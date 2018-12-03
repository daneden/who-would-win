const csv = require("csvtojson")
const emojiCsv = "./emoji.csv"

const sample = array => array[Math.floor(Math.random() * array.length)]

const buildString = emoji => {
  let label = emoji.shortname.replace(/:/g, "").replace(/-/g, " ")
  return `${emoji.utf} ${label}`
}

csv()
  .fromFile(emojiCsv)
  .then(emoji => {
    const [a, b] = [sample(emoji), sample(emoji)].map(buildString)

    console.log(a, b)
  })
