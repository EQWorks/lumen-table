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

const QuantitaveFilter = ({ column: { filterValue, preFilteredRows, setFilter, id } }) => {
  const [minValue, setMinValue] = useState()
  const [maxValue, setMaxValue] = useState()

  const classes = useStyles();

  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })

    setMaxValue(Math.ceil(max))
    setMinValue(Math.floor(min))

    return [min, max]
  }, [id, preFilteredRows])

  const sliderOnChange = (_, newValue) => {
    setMaxValue(newValue[1])
    setMinValue(newValue[0])
    console.log('slider change')
    const [_min, _max] = newValue

    if (_min === min && _max === max) {
      setFilter('')
    } else {
      setFilter(newValue)
    }
  }

  const minOnChange = ({ target: { value } }) => {
    setMinValue(Number(value))
    console.log('min value: ', value)
  }

  const maxOnChange = ({ target: { value } }) => {
    setMaxValue(Number(value))
    console.log('max value: ', value)
  }

  return (
    <div className={classes.root} onClick={(e) => { e.stopPropagation() }} >
      {console.log('re-render')}
      {console.log('state: ', maxValue)}
      <Slider
        value={filterValue || [Math.ceil(min), Math.floor(max)]}
        onChange={(_, newValue) => sliderOnChange(_, newValue)}
        max={max}
        min={min}
        valueLabelDisplay="on"
        step={max - min <= 1 ? 0.1 : 1}
      />
      <div className={classes.range}>
        <div className="min">
          min
        <TextField variant='outlined'
            size='small'
            value={minValue}
            onChange={minOnChange}
            onKeyUp={() => setFilter([minValue, maxValue])}
          />
        </div>
        <div className="max">
          max
        <TextField variant='outlined'
            size='small'
            value={maxValue}
            onChange={maxOnChange}
            onKeyUp={() => setFilter([minValue, maxValue])}
          />
        </div>
      </div>
    </div>
  )
}

QuantitaveFilter.propTypes = {
  column: PropTypes.object.isRequired
}

QuantitaveFilter.filterFn = 'between'

export default QuantitaveFilter
