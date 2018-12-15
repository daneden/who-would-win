const csv = require("csvtojson")

const {
  EMOJI_CSV_PATH,
  buildStringFromEmoji,
  getFighters,
  sample,
} = require("./utils")

csv()
  .fromFile(EMOJI_CSV_PATH)
  .then(emoji => {
    const [a, b] = getFighters(emoji)

    console.log(`
    The two fighters are:
    ${a}
    ${b}
    `)
  })
