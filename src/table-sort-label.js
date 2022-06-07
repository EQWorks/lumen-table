import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, BaseComponents, Icons } from '@eqworks/lumen-labs'


const classes = makeStyles({
  root: {
    marginLeft: '0.25rem',
    marginRight: '0.25rem',
  },
})

const TableSortLabel = ({ isSorted, isSortedDesc }) => {
  const renderIcon = () => {
    if (!isSorted) {
      return (<Icons.ArrowUpDownRegular size='lg' />)
    }
    return isSortedDesc ? (
      <Icons.ArrowDownRegular className='text-interactive-600' size='lg' />
    ) : (
      <Icons.ArrowUpRegular className='text-interactive-600' size='lg' />
    )
  }
  return (<BaseComponents.ButtonBase className={classes.root}>{renderIcon()}</BaseComponents.ButtonBase>)
}

TableSortLabel.propTypes = {
  isSorted: PropTypes.bool,
  isSortedDesc: PropTypes.bool,
}
TableSortLabel.defaultProps = {
  isSorted: false,
  isSortedDesc: false,
}

export default TableSortLabel
