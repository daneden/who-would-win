const csv = require('csvtojson')
const emojiCsv =  './emoji.csv'

const sample = (array) => array[Math.floor(Math.random() * array.length)]

csv().fromFile('./emoji.csv').then(emoji => {
  let [a, b] = [sample(emoji), sample(emoji)]
  if(a === b) b = sample(emoji)

  const pollCardPayload = {
    account_id: 'TBD',
    duration_in_minutes: 24*60,
    first_choice: a.utf,
    second_choice: b.utf,
  }

  const pollCardURI = 'TBD' //response.data.card_uri

  const tweetPayload = {
    status: 'Who would win?',
    card_uri: pollCardURI,
  }

  console.log(pollCardPayload)

})
