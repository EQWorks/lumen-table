import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@eqworks/lumen-labs'


const useStyles = ({ bgColor, barLength, barHeight }) => makeStyles({
  bar: {
    backgroundColor: bgColor,
    height: `${barHeight}rem`,
    width: `${barLength}%`,
    marginRight: '0.25rem',
  },
  value: {
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: '0.875rem',
    textAlign: 'center',
    color: '#6c6c6c',
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

// Helper function to convert a hex color to RGB
const hexToRGB = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null
}

// Helper function to convert RGB to hexadecimal format
const rgbToHex = (r, g, b) => {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

const adjustFixedRange = (amount, color) => {
  // Convert the colors to RGB format
  const minRGB = hexToRGB(color[0])
  const maxRGB = hexToRGB(color[1])

  // Calculate the difference between the min and max colors
  const diffR = maxRGB.r - minRGB.r
  const diffG = maxRGB.g - minRGB.g
  const diffB = maxRGB.b - minRGB.b

  // Calculate the adjusted RGB values based on the percentage
  const adjustedR = Math.round(minRGB.r + (diffR * ((amount * 1.25) / 100)))
  const adjustedG = Math.round(minRGB.g + (diffG * ((amount * 1.25) / 100)))
  const adjustedB = Math.round(minRGB.b + (diffB * ((amount * 1.25) / 100)))

  // Convert the adjusted RGB values back to hexadecimal format
  const adjustedColor = rgbToHex(adjustedR, adjustedG, adjustedB)

  return adjustedColor
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
    bgColor: barColumnsColor.length === 2 ? 
      adjustFixedRange(getColorAmount(_maxVals[column.id], Math.ceil(Number(value))), barColumnsColor) :
      adjustBarColor(getColorAmount(_maxVals[column.id], Math.ceil(Number(value))), barColumnsColor),
    barLength: ((value/_maxVals[column.id]) * 100).toFixed(2),
    barHeight: barColumnsColor.length === 2 ? 2 : 0.875,
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
  barColumnsColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  fixedColorRange: PropTypes.array,
  formatData: PropTypes.object,
}

InCellBar.defaultProps = {
  formatData: {},
  barColumnsColor: '#6697ee',
  fixedColorRange: [],
  barColumns: false,
}

export default InCellBar
