import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'


const useStyles = ({ bgColor, barLength }) => makeStyles({
  bar: {
    backgroundColor: bgColor,
    height: '0.875rem',
    width: `${barLength}%`,
    marginRight: '0.25rem',
  },
  value: {
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: '0.875rem',
    textAlign: 'center',
    color: getTailwindConfigColor('secondary-700'),
  },
})

const maxValsPerColumn = {}
const computeMaxVals = (data, columnID, maxValsPerColumn) => {
  if (!maxValsPerColumn[columnID]) {
    const max = Math.max(...data.map((column) => parseInt(column[columnID])))
    maxValsPerColumn[columnID] = max
  }
  return maxValsPerColumn
}

const adjustBarColor = (amount, color) => {
  return '#' + color.replace(/^#/, '').replace(/../g, color =>
    ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substring(1,3))
}

const getFormattedValue = (value, format, header) => {
  const formatFunc = format[header]
  if (Object.keys(format).length && formatFunc) {
    if (formatFunc?.func) {
      return formatFunc.func(value)
    }
    return formatFunc(value)
  }
  return value
}

const getColorAmount = (max, value) => {
  let amount = parseInt((max / value) * 10)
  if (value > max || value === 0) {
    amount = 0
  }

  if (amount > 90) {
    amount = 90
  }
  return amount
}

const InCellBar = ({ data, column, value, barColumns, formatData, barColumnsColor }) => {
  const _value = getFormattedValue(value, formatData, column.Header)
  if (isNaN(Number(value)) || (barColumns.length && !barColumns.includes(column.id)) || !barColumns) {
    return <p>{_value}</p>
  }
  const _maxVals = useMemo(() => computeMaxVals(data, column.id, maxValsPerColumn), [data, column, maxValsPerColumn])

  const styles = useStyles({
    bgColor: adjustBarColor(getColorAmount(_maxVals[column.id], Math.ceil(Number(value))), barColumnsColor),
    barLength: ((value/_maxVals[column.id]) * 100).toFixed(2),
  })

  return (
    <div className='flex items-center'>
      <div className={styles.bar} />
      <p className={styles.value}>{_value}</p>
    </div>
  )
}

InCellBar.propTypes = {
  data: PropTypes.array.isRequired,
  column: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  barColumns: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]),
  barColumnsColor: PropTypes.string,
  formatData: PropTypes.object,
}

InCellBar.defaultProps = {
  formatData: {},
  barColumnsColor: getTailwindConfigColor('primary-400'),
  barColumns: false,
}

export default InCellBar
