// @flow
type Emoji = {
  codename: string,
  number: string,
  shortname: string,
  utf: string,
}

const EMOJI_CSV_PATH = "./emoji.csv"

// Pick a random element from an array
function sample<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)]
}

function buildStringFromEmoji(emoji: Emoji): string {
  const label = emoji.shortname
    .replace(/:/g, "") // strip out colons
    .replace(/-/g, " ") // replace dashes with spaces

  return `${emoji.utf} ${label}`
}

function getFighters(emoji: Array<Emoji>): [string, string] {
  let [a, b] = [sample(emoji), sample(emoji)].map(buildStringFromEmoji)

  while (a === b) {
    b = buildStringFromEmoji(sample(emoji))
  }

  return [a, b]
}

module.exports = {
  EMOJI_CSV_PATH,
  buildStringFromEmoji,
  getFighters,
  sample,
}
