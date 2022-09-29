import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { abbreviateNumber } from './utils'
import { RangeSliderLabel, makeStyles } from '@eqworks/lumen-labs'

const classes = makeStyles({
  root: {
    width: '40ch',
    padding: '2rem 1rem 0 2rem',

    '& .slider-container': {
      textAlign: 'left',
    },
  },
})

const RangeFilter = ({ column: { filterValue, preFilteredRows, setFilter, id, percentage } }) => {
  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  const sliderOnChange = (_, newValue) => {
    const [_min, _max] = newValue

    if (_min === min && _max === max) {
      setFilter('')
    } else {
      setFilter([percentage ? _min / 100 : _min, percentage ? _max / 100 : _max])
    }
  }

  const getValues = () => {
    let values = []

    if (!filterValue) {
      values = percentage ? 
        [Number(Math.floor(min * 100)), Number(Math.ceil(max * 100))] : 
        [Number(Math.floor(min)), Number(Math.ceil(max))]
    } else {
      values = percentage ? 
        [Number(Math.floor(filterValue[0] * 100)), Number(Math.ceil(filterValue[1] * 100))] : 
        [Number(Math.floor(filterValue[0])), Number(Math.ceil(filterValue[1]))]
    }

    return values
  }

  return (
    <div className={classes.root} onClick={(e) => { e.stopPropagation() }} >
      <RangeSliderLabel
        values={getValues()}
        onChange={sliderOnChange}
        min={percentage ? Math.floor(min * 100) : Math.floor(min)}
        max={percentage ? Math.ceil(max * 100) : Math.ceil(max)}
        tooltipFormat={percentage ? undefined : [abbreviateNumber(getValues()[0]), abbreviateNumber(getValues()[1])]}
        width='w-full'
        showLabel={false}
      />
    </div>
  )
}

RangeFilter.propTypes = {
  column: PropTypes.object.isRequired,
}
RangeFilter.filterFn = 'between'

export default RangeFilter
