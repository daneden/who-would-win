// Pick a random element from an array
const sample = array => array[Math.floor(Math.random() * array.length)]

const buildString = emoji => {
  let label = emoji.shortname.replace(/:/g, "").replace(/-/g, " ")
  return `${emoji.utf} ${label}`
}

module.exports = {
  buildString,
  sample,
}
