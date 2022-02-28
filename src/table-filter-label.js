import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded'

import { BaseComponents, makeStyles } from '@eqworks/lumen-labs'

import SelectionFilter from './filters/selection-filter'
import RangeFilter from './filters/range-filter'
import QuantitaveFilter from './filters/quantitave-filter'
import QualitativeFilter from './filters/qualitative-filter'
import { DateRangeFilter } from './filters/date-range-filter'
import DefaultFilter from './filters/default-filter'


const TableFilterLabel = ({ column }) => {
  const classes = makeStyles({
    filterLabelContainer: {
      '& .button-container:focus': {
        outline: 0
      },

      '& .dialog-container': {
        display: 'grid',

        '& .dialog-content': {
          justifySelf: 'center',
        }
      },
    },

    filter: {
      padding: '1rem',
      display: 'flex',
    },
  })

  const dialogClasses = Object.freeze({
    root: classes.filterLabelContainer,
    dialogContainer: 'dialog-container',
    dialog: 'dialog-content shadow-light-20 bg-secondary-50'
  })

  const buttonClasses = Object.freeze({
    button: 'button-container'
  })
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)

  const handleClose = (e) => {
    if (anchorRef.current && anchorRef.current.contains(e.target)) {
      return
    }
    setOpen(false)
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
    { console.log('nothing: ', type) }
    }
  }

  const _button = (
    <BaseComponents.ButtonBase
      aria-label='Edit button'
      ref={anchorRef}
      classes={buttonClasses}
    >
      <FilterListRoundedIcon color={column.filterValue ? 'primary' : 'disabled'} />
    </BaseComponents.ButtonBase>
  )

  return (
    <>
      <BaseComponents.DialogBase classes={dialogClasses} button={_button}>
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

TableFilterLabel.propTypes = {
  column: PropTypes.object.isRequired,
}

export default TableFilterLabel
