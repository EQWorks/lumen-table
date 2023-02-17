import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { makeStyles, BaseComponents, Icons } from '@eqworks/lumen-labs'

import SelectionFilter from './selection-filter'
import RangeFilter from './range-filter'
import QuantitaveFilter from './quantitave-filter'
import QualitativeFilter from './qualitative-filter'
import { DateRangeFilter } from './date-range-filter'
import DefaultFilter from './default-filter'


const useStyles = (index, length) => makeStyles({
  filterLabelContainer: {
    '& .button-container:focus': {
      outline: 0,
    },

    '& .dialog-container': {
      display: 'grid',

      '& .dialog-content': {
        justifySelf: `${(index === length - 1 && 'right') || (index === 0 ? 'left' : 'center')}`,
      },
    },
  },

  filter: {
    padding: '1rem',
    display: 'flex',
  },
})

const dialogClasses = Object.freeze({
  dialogContainer: 'dialog-container',
  dialog: 'dialog-content shadow-light-40 bg-secondary-50',
})

const buttonClasses = Object.freeze({
  button: 'button-container',
})

const ColFilterLabel = ({ column, index, length }) => {
  const classes = useStyles(index, length)
  const anchorRef = useRef(null)

  const handleClose = (e) => {
    if (anchorRef.current && anchorRef.current.contains(e.target)) {
      return
    }
  }

  const filterType = (type) => {
    switch (type) {
    case 'SelectionFilter':
      return <SelectionFilter column={column} />
    case 'RangeFilter':
      return <RangeFilter column={column} />
    case 'QuantitaveFilter':
      return <QuantitaveFilter column={column} closePopper={handleClose} />
    case 'QualitativeFilter':
      return <QualitativeFilter column={column} closePopper={handleClose} />
    case 'DateRangeFilter':
      return <DateRangeFilter column={column} />
    default:
      break
    }
  }

  const _button = (
    <BaseComponents.ButtonBase
      aria-label='Edit button'
      ref={anchorRef}
      classes={buttonClasses}
    >
      <Icons.Filter size='lg' />
    </BaseComponents.ButtonBase>
  )

  return (
    <>
      <BaseComponents.DialogBase 
        classes={{
          ...dialogClasses,
          root: classes.filterLabelContainer,
        }} 
        button={_button}>
        <div className={classes.filter}>
          {column.Filter ? (
            filterType(column.Filter.name)
          ) : (
            <DefaultFilter {...column} />
          )}
        </div>
      </BaseComponents.DialogBase>
    </>
  )
}

ColFilterLabel.propTypes = {
  column: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
}

export default ColFilterLabel
