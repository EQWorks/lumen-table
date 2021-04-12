import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Slider from '@material-ui/core/Slider'
import { makeStyles } from '@material-ui/core/styles'
import { ControlPointSharp } from '@material-ui/icons'


// based on https://stackoverflow.com/a/10601315/158111
function abbreviateNumber(value) {
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '40ch',
    padding: theme.spacing(4, 2, 0, 2),
    textAlign: 'center',
  },
}))

const filterNumColumns = (columns) => {
  const numColums = []
  columns.forEach(column => {
    column.preFilteredRows.length &&
      isNaN(column.preFilteredRows[0].values[column.id]) === false && numColums.push(column)
  })

  return numColums
}

const QualitativeFilter = ({ allColumns, setFilter, filterValue }) => {
  console.log('filterValue: ', filterValue)
  console.log('allColumns: ', allColumns)
  const classes = useStyles()
  const filteredRows = []

  const [min, max] = useMemo(() => {
    let min = 0;
    let max = 0;

    filterNumColumns(allColumns).forEach(column => {
      let filterMin = column.preFilteredRows.length ? column.preFilteredRows[1].values[column.id] : 0
      let filterMax = column.preFilteredRows.length ? column.preFilteredRows[1].values[column.id] : 0
      filteredRows.push([column.id, column.preFilteredRows])

      column.preFilteredRows.forEach(row => {
        filterMin = Math.min(row.values[column.id], filterMin)
        filterMax = Math.max(row.values[column.id], filterMax)

        if (filterMin < min) {
          min = filterMin
        } else if (filterMax > max) {
          max = filterMax
        }
      })
    })

    return [min, max]
  }, [filteredRows[1]])
  //console.log('ids: ', columnsId)
  console.log('rows: ', filteredRows)
  const handleOnChange = (_, newValue) => {
    const [_min, _max] = newValue
    if (_min === min && _max === max) {
      setFilter(filterValue)
    } else {
      setFilter(newValue)
    }
  }

  return (
    <div className={classes.root} onClick={(e) => { e.stopPropagation() }} >
      <Slider
        value={filterValue || [Math.ceil(max), Math.floor(min)]}
        onChange={(_, newValue) => handleOnChange(_, newValue)}
        max={Math.ceil(max)}
        min={Math.floor(min)}
        valueLabelDisplay="on"
        step={max - min <= 1 ? 0.1 : 1}
      />
    </div>
  )
}

QualitativeFilter.propTypes = {
  allColumns: PropTypes.array.isRequired
}

QualitativeFilter.filterFn = 'between'

export default QualitativeFilter
