import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { RangeSliderLabel } from '@eqworks/lumen-labs'


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
  },
}))

const RangeFilter = ({ column: { filterValue, preFilteredRows, setFilter, id, percentage } }) => {
  const classes = useStyles()
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
      setFilter([percentage ? newValue[0] / 100 : newValue[0], percentage ? newValue[1] / 100 : newValue[1]])
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
        onChange={(_, newValue) => sliderOnChange(_, newValue)}
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
