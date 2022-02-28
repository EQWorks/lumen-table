import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Button, TextField, RangeSliderLabel } from '@eqworks/lumen-labs'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '40ch',
    padding: theme.spacing(4, 2, 0, 2),
    fontSize: theme.typography.fontSize,
  },

  rangeContainer: {
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
    columnGap: 10,
    textAlign: 'left',
    textIndent: 5,
  },

  buttonContainer: {
    marginTop: 20,
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
    columnGap: 10,
  },
}))

const QuantitaveFilter = ({ column: { filterValue, preFilteredRows, setFilter, id, percentage }, closePopper }) => {
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')

  const classes = useStyles()
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
    setMinValue(newValue[0])
    setMaxValue(newValue[1])
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
        values={[minValue, maxValue]}
        onChange={(_, newValue) => sliderOnChange(_, newValue)}
        min={Math.floor(min)}
        max={Math.ceil(max)}
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
