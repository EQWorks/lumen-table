import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import ButtonBase from '@material-ui/core/ButtonBase'
import Popper from '@material-ui/core/Popper'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import FilterListIcon from '@material-ui/icons/FilterList'
import { makeStyles } from '@material-ui/core/styles'

import TableSortLabel from './table-sort-label'
import SelectionFilter from './filters/selection-filter'
import RangeFilter from './filters/range-filter'
import QuantitaveFilter from './filters/quantitave-filter'
import QualitativeFilter from './filters/qualitative-filter'
import DefaultFilter from './filters/default-filter'


const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: '2px',
    paddingRight: '2px',
  },
  filter: {
    padding: '1rem',
    display: 'flex',
  },
}))

const TableFilterLabel = ({ column }) => {
  const classes = useStyles()
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
      default:
        { console.log('nothing: ', type) }
    }
  }

  return (
    <>
      <ButtonBase
        aria-label='Edit button'
        ref={anchorRef}
        disableRipple
        className={classes.root}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
      >
        <FilterListIcon color={column.filterValue ? 'primary' : 'disabled'} />
      </ButtonBase>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <div className={classes.filter}>
                  {column.Filter ? (
                    filterType(column.Filter.name)
                  ) : (
                    <DefaultFilter {...column} />
                  )}
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

TableFilterLabel.propTypes = {
  column: PropTypes.object.isRequired,
}

export default TableFilterLabel
