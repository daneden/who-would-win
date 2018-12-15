const T = require("twit")
const csv = require("csvtojson")
const dotenv = require("dotenv").load({ silent: true })

const { augmentTwit, postPoll, getCard } = require("./twitter")
const {
  EMOJI_CSV_PATH,
  buildStringFromEmoji,
  getFighters,
  sample,
} = require("./utils")

// Twitter doesn't allow arbitrary apps to access the cards creation API, so we have to use
// the consumer key for the official app.
// I managed to find it here: https://gist.github.com/shobotch/5160017
// If you wanted to create polls too, you'd have to generate your own access token and secret.
// I used twurl to do that: https://github.com/twitter/twurl
const {
  IPHONE_CONSUMER_KEY,
  IPHONE_CONSUMER_SECRET,
  IPHONE_ACCESS_TOKEN,
  IPHONE_ACCESS_TOKEN_SECRET,
} = process.env

const twit = new T({
  consumer_key: IPHONE_CONSUMER_KEY,
  consumer_secret: IPHONE_CONSUMER_SECRET,
  access_token: IPHONE_ACCESS_TOKEN,
  access_token_secret: IPHONE_ACCESS_TOKEN_SECRET,
})

// Make our Twit instance able to post to the poll cards API
augmentTwit(twit)

// Parse the CSV, sample it for two emoji, then post the poll
csv()
  .fromFile(EMOJI_CSV_PATH)
  .then(emoji => {
    const [a, b] = getFighters(emoji)

    postPoll(twit, "Who would win in a fight?", [a, b])
      .then(t => getCard(twit, t))
      .then(function(card) {
        console.log(card)
      })
  })
