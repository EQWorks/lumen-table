import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import Slider from '@material-ui/core/Slider'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '40ch',
    padding: theme.spacing(4, 2, 0, 2),
    fontSize: theme.typography.fontSize,
    textAlign: 'center',
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

  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })

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

  const minOnChange = ({ target: { value } }) => {
    setMinValue(Number(value))
  }

  const maxOnChange = ({ target: { value } }) => {
    setMaxValue(Number(value))
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
    <div className={classes.root} onClick={(e) => { e.stopPropagation() }} >
      <Slider
        value={[minValue, maxValue]}
        onChange={(_, newValue) => sliderOnChange(_, newValue)}
        min={Math.floor(min)}
        max={Math.ceil(max)}
        step={max - min <= 1 ? 0.1 : 1}
      />
      <div className={classes.rangeContainer}>
        <div className="min">
          Min
          <TextField variant='outlined'
            size='small'
            value={percentage ? minValue * 100 : Math.floor(minValue)}
            onChange={minOnChange}
          />
        </div>
        <div className="max">
          Max
          <TextField variant='outlined'
            size='small'
            value={percentage ? maxValue * 100 : Math.ceil(maxValue)}
            onChange={maxOnChange}
          />
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button variant="contained" color="primary" onClick={(e) => { applyOnClick(e) }}>
          Apply
        </Button>
        <Button variant="outlined" color="primary" onClick={(e) => { cancelOnClick(e) }}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

QuantitaveFilter.propTypes = {
  column: PropTypes.object.isRequired,
  closePopper: PropTypes.func
}

QuantitaveFilter.filterFn = 'between'

export default QuantitaveFilter
