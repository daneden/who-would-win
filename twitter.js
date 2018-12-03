const Q = require("q")

// These functions courtesy @airhadoken: https://gist.github.com/airhadoken/8742d16a2a190a3505a2
// augmentTwit will take as its argument a Twit instance and return a version of it that
// hits a private API with iPhone user agent headers to allow poll posting.
function augmentTwit(twit) {
  twit._buildReqOpts = function(method, path, params, isStreaming, callback) {
    var helpers = require("twit/lib/helpers")
    var endpoints = require("twit/lib/endpoints")
    var FORMDATA_PATHS = []
    var self = this
    if (!params) {
      params = {}
    }
    // clone `params` object so we can modify it without modifying the user's reference
    var paramsClone = JSON.parse(JSON.stringify(params))
    // convert any arrays in `paramsClone` to comma-seperated strings
    var finalParams = this.normalizeParams(paramsClone)
    delete finalParams.twit_options

    // the options object passed to `request` used to perform the HTTP request
    var reqOpts = {
      headers: {
        Accept: "*/*",
        "User-Agent": "Twitter-iPhone/6.45 iOS/9.0.2 (Apple;iPhone8,2;;;;;1)",
        "X-Twitter-Client": "Twitter-iPhone",
        "X-Twitter-API-Version": "5",
        "X-Twitter-Client-Language": "en",
        "X-Twitter-Client-Version": "6.45",
      },
      gzip: true,
      encoding: null,
    }

    if (typeof self.config.timeout_ms !== "undefined") {
      reqOpts.timeout = self.config.timeout_ms
    }

    try {
      // finalize the `path` value by building it using user-supplied params
      path = helpers.moveParamsIntoPath(finalParams, path)
    } catch (e) {
      callback(e, null, null)
      return
    }

    if (isStreaming) {
      // This is a Streaming API request.

      var stream_endpoint_map = {
        user: endpoints.USER_STREAM,
        site: endpoints.SITE_STREAM,
      }
      var endpoint = stream_endpoint_map[path] || endpoints.PUB_STREAM
      reqOpts.url = endpoint + path + ".json"
    } else {
      // This is a REST API request.

      if (path === "media/upload") {
        // For media/upload, use a different entpoint and formencode.
        reqOpts.url = endpoints.MEDIA_UPLOAD + "media/upload.json"
      } else if (path.indexOf("cards/") === 0) {
        reqOpts.url = "https://caps.twitter.com/v2/" + path + ".json"
      } else {
        reqOpts.url = endpoints.REST_ROOT + path + ".json"
      }

      if (FORMDATA_PATHS.indexOf(path) !== -1) {
        reqOpts.headers["Content-type"] = "multipart/form-data"
        reqOpts.form = finalParams
        // set finalParams to empty object so we don't append a query string
        // of the params
        finalParams = {}
      } else {
        reqOpts.headers["Content-type"] = "application/json"
      }
    }

    if (Object.keys(finalParams).length) {
      // not all of the user's parameters were used to build the request path
      // add them as a query string
      var qs = helpers.makeQueryString(finalParams)
      reqOpts.url += "?" + qs
    }

    if (!self.config.app_only_auth) {
      // with user auth, we can just pass an oauth object to requests
      // to have the request signed
      var oauth_ts = Date.now() + self._twitter_time_minus_local_time_ms

      reqOpts.oauth = {
        consumer_key: self.config.consumer_key,
        consumer_secret: self.config.consumer_secret,
        token: self.config.access_token,
        token_secret: self.config.access_token_secret,
        timestamp: Math.floor(oauth_ts / 1000).toString(),
      }

      callback(null, reqOpts)
      return
    } else {
      // we're using app-only auth, so we need to ensure we have a bearer token
      // Once we have a bearer token, add the Authorization header and return the fully qualified `reqOpts`.
      self._getBearerToken(function(err, bearerToken) {
        if (err) {
          callback(err, null)
          return
        }

        reqOpts.headers["Authorization"] = "Bearer " + bearerToken
        callback(null, reqOpts)
        return
      })
    }
  }

  return twit
}

function postPoll(oauth, statustext, entries, duration) {
  var params = {
    "twitter:api:api:endpoint": "1",
    "twitter:card": "poll" + entries.length + "choice_text_only",
    "twitter:long:duration_minutes": duration || 1440, //default 1-day
  }

  if (entries.length < 2) {
    throw "Must have at least two poll entries"
  }
  if (entries.length > 4) {
    throw "Too many poll entries (max 4)"
  }

  entries.forEach(function(val, i) {
    params["twitter:string:choice" + (i + 1) + "_label"] = val
  })

  return Q(oauth)
    .ninvoke("post", "cards/create", {
      card_data: JSON.stringify(params),
    })
    .then(
      function(pack) {
        var data = pack[0]
        if (data.status === "FAILURE") {
          throw pack
        } else {
          return data
        }
      },
      function(err) {
        console.error("Error on creating twitter card")
        console.error(err)
      }
    )
    .then(function(data) {
      return Q(oauth)
        .ninvoke("post", "statuses/update", {
          status: statustext,
          card_uri: data.card_uri,
          include_cards: 1,
          cards_platform: "iPhone-13",
          contributor_details: 1,
        })
        .then(
          function(pack) {
            return pack[0]
          },
          function(err) {
            console.error("Error on posting tweet")
            console.error(err)
          }
        )
    })
}

function getCard(oauth, tweet) {
  return Q(oauth)
    .ninvoke("get", "statuses/show/" + tweet.id_str, {
      cards_platform: "iPhone-13",
      include_cards: 1,
    })
    .then(
      function(pack) {
        var data = pack[0]
        return data.card
      },
      function(err) {
        console.error("Error getting card data")
        console.error(err)
      }
    )
}

module.exports = {
  augmentTwit,
  postPoll,
  getCard,
}
