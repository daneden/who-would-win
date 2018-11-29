const csv = require('csvtojson')
const emojiCsv =  './emoji.csv'

// Pick a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)]

csv().fromFile(emojiCsv).then(emoji => {
  let [a, b] = [sample(emoji), sample(emoji)]

  // Naive safeguard against picking the same element twice
  if(a === b) b = sample(emoji)

  // TODO: Add real account ID
  const pollCardPayload = {
    account_id: 'TBD',
    duration_in_minutes: 24*60,
    first_choice: a.utf,
    second_choice: b.utf,
  }

  // TODO: Get card URI from post response above
  const pollCardURI = 'TBD' //response.data.card_uri

  const tweetPayload = {
    status: 'Who would win?',
    card_uri: pollCardURI,
  }

  // TODO: Remove console.log-ing
  console.log(pollCardPayload)

})
