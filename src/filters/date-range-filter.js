import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { filterDates } from './utils'
import { DateRange } from '@eqworks/lumen-labs'

DateRangeFilter.propTypes = {
  column: PropTypes.object.isRequired,
}

const reducer = (id) => (acc, row) => {
  if (!Object.values(acc).length) {
    acc.min = row.values[id]
    acc.max = row.values[id]
    return acc
  }
  const curr = new Date(row.values.date)
  const min = new Date(acc.min)
  const max = new Date(acc.max)
  if (curr < min) {
    acc.min = row.values[id]
  }
  if (curr > max) {
    acc.max = row.values[id]
  }
  return acc
}

function DateRangeFilter({ column: { filterValue, preFilteredRows, setFilter, id } }) {
  const { min, max } = useMemo(() => preFilteredRows.reduce(reducer(id), {}))
  const [filterMin, filterMax] = filterValue || []
  
  return (
    <DateRange 
      defaultValue={[filterMin || min, filterMax || max]} 
      setFromValue={(value) => { setFilter((old = []) => [value ? value : undefined, old[1]]) }} 
      setToValue={(value) => { setFilter((old = []) => [old[0], value ? value : undefined]) }}
    />
  )
}

export { filterDates, DateRangeFilter }
