import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { Button, TextField, RangeSliderLabel, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  root: {
    width: '40ch',
    padding: '2rem 1rem 0 1rem',
    fontSize: '0.875rem',
  },

  rangeContainer: {
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
    columnGap: '0.625rem',
    textAlign: 'left',
    textIndent: '0.313rem',
  },

  buttonContainer: {
    marginTop: '1.25rem',
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
    columnGap: '0.625rem',
  },
})

const QuantitaveFilter = ({ column: { filterValue, preFilteredRows, setFilter, id, percentage }, closePopper }) => {
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')

  const textFieldClasses = Object.freeze({ 
    container: 'w-full',
  })

  const [min, max] = useMemo(() => {
    const values = preFilteredRows.map(({ values }) => values[id])
    const min = Math.min(...values, 0)
    const max = Math.max(...values, 0)

    if (!filterValue) {
      setMinValue(min)
      setMaxValue(max)
    } else if (filterValue) {
      setMinValue(filterValue[0])
      setMaxValue(filterValue[1])
    }

    return [min, max]
  }, [id, preFilteredRows])

  const sliderOnChange = (_, newValue) => {
    setMinValue(percentage ? newValue[0] / 100 : newValue[0])
    setMaxValue(percentage ? newValue[1] / 100 : newValue[1])
  }

  const minOnChange = (val) => {
    percentage ? setMinValue(Number(val) / 100) : setMinValue(Number(val))
  }

  const maxOnChange = (val) => {
    percentage ? setMaxValue(Number(val) / 100) : setMaxValue(Number(val))
  }

  const applyOnClick = (e) => {
    e.stopPropagation()
    closePopper && closePopper(e)
    setFilter([minValue, maxValue])
  }

  const cancelOnClick = (e) => {
    e.stopPropagation()
    closePopper && closePopper(e)
    setMinValue(filterValue ? filterValue[0] : min)
    setMaxValue(filterValue ? filterValue[1] : max)
  }

  return (
    <div className={classes.root} onClick={(e) => { e.stopPropagation() }}>
      <RangeSliderLabel
        values={percentage ? [Number(minValue * 100), Number(maxValue * 100)] : [Number(minValue), Number(maxValue)]}
        onChange={(_, newValue) => sliderOnChange(_, newValue)}
        min={percentage ? Math.floor(min * 100) : Math.floor(min)}
        max={percentage ? Math.ceil(max * 100) : Math.ceil(max)}
        width='w-full'
        showLabel={false}
      />
      <div className={classes.rangeContainer}>
        <div className="min">
          Min
          <TextField
            classes={textFieldClasses}
            size='lg'
            onClick={(e) => { e.stopPropagation() }}
            onChange={minOnChange}
            value={percentage ? (minValue * 100).toString() : Math.floor(minValue).toString()}
          />
        </div>
        <div className="max">
          Max
          <TextField 
            classes={textFieldClasses}
            size='lg'
            onClick={(e) => { e.stopPropagation() }}
            onChange={maxOnChange}
            value={percentage ? (maxValue * 100).toString() : Math.ceil(maxValue).toString()}
          />
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button variant="filled" size='lg' onClick={(e) => { applyOnClick(e) }}>
          Apply
        </Button>
        <Button variant="outlined" size='lg' onClick={(e) => { cancelOnClick(e) }}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

QuantitaveFilter.propTypes = {
  column: PropTypes.object.isRequired,
  closePopper: PropTypes.func,
}

QuantitaveFilter.filterFn = 'between'

export default QuantitaveFilter
