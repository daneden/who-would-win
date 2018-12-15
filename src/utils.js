// @flow
type Emoji = {
  codename: string,
  number: string,
  shortname: string,
  utf: string,
}

// Pick a random element from an array
function sample<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)]
}

function buildStringFromEmoji(emoji: Emoji): string {
  let label = emoji.shortname.replace(/:/g, "").replace(/-/g, " ")
  return `${emoji.utf} ${label}`
}

module.exports = {
  buildStringFromEmoji,
  sample,
}
