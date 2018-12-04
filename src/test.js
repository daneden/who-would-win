const csv = require("csvtojson")
const emojiCsv = "./emoji.csv"

const { buildStringFromEmoji, sample } = require("./utils")

csv()
  .fromFile(emojiCsv)
  .then(emoji => {
    const [a, b] = [sample(emoji), sample(emoji)].map(buildStringFromEmoji)

    console.log(`
    The two fighters are:
    ${a}
    ${b}
    `)
  })
