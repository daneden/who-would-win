const csv = require("csvtojson")
const emojiCsv = "./emoji.csv"

const { buildString, sample } = require("./utils")

csv()
  .fromFile(emojiCsv)
  .then(emoji => {
    const [a, b] = [sample(emoji), sample(emoji)].map(buildString)

    console.log(a, b)
  })
