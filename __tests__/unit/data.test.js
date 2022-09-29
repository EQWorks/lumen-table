import { filterDates, abbreviateNumber } from '../../src/filters/utils'

describe('Filter Dates', () => {

  const mockDates = [
    { values: { date: '2019-11-05' } }, 
    { values: { date: '2019-11-06' } }, 
    { values: { date: '2019-11-07' } }, 
    { values: { date: '2019-11-08' } },
    { values: { date: '2019-11-09' } },
    { values: { date: '2019-11-10' } },
    { values: { date: '2019-11-11' } },
    { values: { date: '2019-11-12' } },
    { values: { date: '2019-11-13' } },
    { values: { date: '2019-11-14' } },
    { values: { date: '2019-11-15' } },
  ]

  const emptyArr = filterDates(mockDates, ['date'], ['2019-11-01', '2019-11-04'])

  const minDate = '2019-11-05'
  const maxDate = '2019-11-10'
  const populatedArr = filterDates(mockDates, ['date'], [minDate, maxDate])

  it('should return an array the size of the filter range', () => {
    expect(emptyArr.length).toEqual(0)
    expect(populatedArr.length).toEqual(6)
  })
  it('should return an array where the first value is equal to min and last is max', () => {
    expect(populatedArr[0].values.date).toEqual(minDate)
    expect(populatedArr[populatedArr.length - 1].values.date).toEqual(maxDate)
  })
})

describe('Abbreviate Number', () => {
  it('should abbreviate longer numbers into strings depending on size (k, m, b, t)', () => {
    const ten = abbreviateNumber(1)
    const thousand = abbreviateNumber(1000)
    const million = abbreviateNumber(1000000)
    const billion = abbreviateNumber(1000000000)
    const trillion = abbreviateNumber(1000000000000)

    expect(ten).toEqual(1)
    expect(thousand).toEqual('1k')
    expect(million).toEqual('1m')
    expect(billion).toEqual('1b')
    expect(trillion).toEqual('1t')
  })
})
