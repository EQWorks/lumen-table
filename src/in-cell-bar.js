import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@eqworks/lumen-labs'


const useStyles = ({ bgColor, barLength }) => makeStyles({
  bar: {
    backgroundColor: bgColor,
    height: '14px',
    width: `${barLength}%`,
    marginRight: '4px',
  },
  value: {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '14px',
    textAlign: 'center',
    color: '#6C6C6C', // secondary-700
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
const computeBgIntensity = (value, range) => {
  if (value < range[0]) {
    return '#D6E8FD' // primary-100
  }
  if (value >= range[0] && value < range[1]) {
    return '#AFD0FC' // primary-200
  }
  if (value >= range[1] && value < range[2]) {
    return '#85B2F6' // primary-300
  }
  return '#6697EE' // primary-400
}

const InCellBar = ({ data, column, value, barColumns }) => {
  if (isNaN(Number(value)) || (barColumns.length && !barColumns.includes(column.id))) {
    return <p>{value}</p>
  }

  const _maxVals = useMemo(() => computeMaxVals(data, column.id, maxValsPerColumn), [data, column, maxValsPerColumn])
  const _intensityRange = useMemo(() => {
    const baseIndex = Math.floor(_maxVals[column.id]/4)
    return new Array(4).fill().map((_, i) => baseIndex * (i + 1))
  }, [_maxVals, column])

  const styles = useStyles({
    bgColor: computeBgIntensity(value, _intensityRange),
    barLength: ((value/_maxVals[column.id]) * 100).toFixed(2),
  })

  return (
    <div className='flex items-center'>
      <div className={styles.bar} />
      <p className={styles.value}>{value}</p>
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
    PropTypes.bool.isRequired,
    PropTypes.array.isRequired,
  ]),
}

export default InCellBar
