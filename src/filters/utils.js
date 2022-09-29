const filterDates = (rows, _, [min, max]) => rows
  .filter(({ values: { date } }) => new Date(date) >= new Date(min) && new Date(date) <= new Date(max))

// based on https://stackoverflow.com/a/10601315/158111
const abbreviateNumber = (value) => {
  const suffixes = ['', 'k', 'm', 'b', 't']
  let newValue = value
  if (value >= 1000) {
    const suffixNum = Math.floor(String(Math.floor(value)).length / 3)
    let shortValue = ''
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = (suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value)
      shortValue = parseFloat(shortValue.toPrecision(precision))
      const dotLessShortValue = String(shortValue).replace(/[^a-zA-Z 0-9]+/g, '')
      if (dotLessShortValue.length <= 2) {
        break
      }
    }
    if (shortValue % 1 != 0) {
      shortValue = shortValue.toFixed(1)
    }
    newValue = `${shortValue}${suffixes[suffixNum]}`
  } else if (value % 1 != 0 && value > 1) { //to account for float numbers
    newValue = Math.floor(value).toString()
  }
  return newValue
}

export { filterDates, abbreviateNumber }
