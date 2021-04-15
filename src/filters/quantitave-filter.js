import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import Slider from '@material-ui/core/Slider'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'


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
    fontSize: theme.typography.fontSize,
    textAlign: 'center',
  },

  range: {
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
    columnGap: 10,
    textAlign: 'left',
    textIndent: 5
  }
}))
const filteredRows = []

const filterNumColumns = (columns) => {
  const numColums = []
  columns.forEach(column => {
    column.preFilteredRows.length &&
      isNaN(column.preFilteredRows[0].values[column.id]) === false && numColums.push(column)
  })

  return numColums
}

const QuantitaveFilter = ({ allColumns, setFilter, filterValue }) => {
  const [minValue, setMinValue] = useState()
  const [maxValue, setMaxValue] = useState()
  // console.log('filterValue: ', filterValue)
  // console.log('allColumns: ', allColumns)
  const classes = useStyles();

  const [min, max] = useMemo(() => {
    let min = 0;
    let max = 0;

    filterNumColumns(allColumns).forEach(column => {
      let filterMin = column.preFilteredRows.length ? column.preFilteredRows[0].values[column.id] : 0
      let filterMax = column.preFilteredRows.length ? column.preFilteredRows[0].values[column.id] : 0
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
    setMaxValue(max)
    setMinValue(min)
    return [min, max]
  }, [filteredRows])
  //console.log('ids: ', columnsId)
  //console.log('rows: ', filteredRows)
  const handleOnChange = (_, newValue) => {
    // console.log('new value: ', newValue);
    // console.log("event: ", _)
    const [_min, _max] = newValue
    setMaxValue(newValue[1])
    setMinValue(newValue[0])
    if (_min === min && _max === max) {
      setFilter(filterValue)
    } else {
      setFilter(newValue)
    }
  }

  const minOnChange = ({ target: { value } }) => {
    setMinValue(value)
    console.log('min value: ', value)
  }

  const maxOnChange = ({ target: { value } }) => {
    setMaxValue(value)
    console.log('max value: ', value)
  }

  return (
    <div className={classes.root} onClick={(e) => { e.stopPropagation() }} >
      {console.log('re-render')}
      <Slider
        value={filterValue || [Math.ceil(min), Math.floor(max)]}
        onChange={(_, newValue) => handleOnChange(_, newValue)}
        max={Math.ceil(max)}
        min={Math.floor(min)}
        step={max - min <= 1 ? 0.1 : 1}
      />
      <div className={classes.range}>
        <div className="min">
          min
        <TextField variant='outlined'
            size='small'
            value={minValue}
            onChange={minOnChange}
          />
        </div>
        <div className="max">
          max
        <TextField variant='outlined'
            size='small'
            value={maxValue}
            onChange={maxOnChange}
          />
        </div>
      </div>
    </div>
  )
}

QuantitaveFilter.propTypes = {
  allColumns: PropTypes.array.isRequired
}

QuantitaveFilter.filterFn = 'between'

export default QuantitaveFilter
