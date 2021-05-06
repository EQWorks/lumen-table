import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

DateRangeFilter.propTypes = {
  column: PropTypes.object.isRequired,
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}))

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

export function DateRangeFilter({ column: { filterValue, preFilteredRows, setFilter, id } }) {
  const classes = useStyles()
  const { min, max } = useMemo(() => preFilteredRows.reduce(reducer(id), {}))

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="start-date"
        label="From"
        type="date"
        defaultValue={(filterValue || [])[0] || min}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={({ target: { value } }) => {
          setFilter((old = []) => [value ? value : undefined, old[1]])
        }}
      />
      <TextField
        id="end-date"
        label="To"
        type="date"
        defaultValue={(filterValue || [])[1] || max}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={({ target: { value } }) => {
          setFilter((old = []) => [old[0], value ? value : undefined])
        }}
      />
    </form>
  )
}

export const filterDates = (rows, _, [min, max]) => rows
  .filter(({ values: { date } }) => new Date(date) >= new Date(min) && new Date(date) <= new Date(max))
