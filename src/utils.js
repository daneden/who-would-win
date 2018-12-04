type Emoji = {
  codename: string,
  number: string,
  shortname: string,
  utf: string,
}

// Pick a random element from an array
// TODO: Fix `any` type to be type T so that: Array<T> => T
const sample = (array: Array<any>): any =>
  array[Math.floor(Math.random() * array.length)]

const buildStringFromEmoji = (emoji: Emoji): string => {
  let label = emoji.shortname.replace(/:/g, "").replace(/-/g, " ")
  return `${emoji.utf} ${label}`
}

module.exports = {
  buildStringFromEmoji,
  sample,
}
