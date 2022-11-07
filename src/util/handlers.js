export const sample = Object.entries(_sample).reduce((acc, [key, vals]) => {
  const currentVals = Object.values(vals)
  if (acc.length) {
    return acc.map((a, i) => ({ ...a, [key]: currentVals[i] }))
  }
  return currentVals.map((val) => ({ [key]: val }))
}, [])