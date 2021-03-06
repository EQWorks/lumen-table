import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import Slider from '@material-ui/core/Slider'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@eqworks/lumen-ui/dist/button'
import TextField from '@eqworks/lumen-ui/dist/text-field'

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

  const minOnChange = ({ target: { value } }) => {
    percentage ? setMinValue(Number(value) / 100) : setMinValue(Number(value))
  }

  const maxOnChange = ({ target: { value } }) => {
    percentage ? setMaxValue(Number(value) / 100) : setMaxValue(Number(value))
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
          <TextField 
            fullWidth
            label=''
            value={percentage ? minValue * 100 : Math.floor(minValue)}
            onChange={minOnChange}
          />
        </div>
        <div className="max">
          Max
          <TextField 
            fullWidth
            label=''
            value={percentage ? maxValue * 100 : Math.ceil(maxValue)}
            onChange={maxOnChange}
          />
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button type="primary" color="primary" onClick={(e) => { applyOnClick(e) }}>
          Apply
        </Button>
        <Button type="secondary" color="primary" onClick={(e) => { cancelOnClick(e) }}>
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
