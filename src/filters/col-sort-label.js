import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, BaseComponents, Icons } from '@eqworks/lumen-labs'


const classes = makeStyles({
  root: {
    marginLeft: '0.25rem',
    marginRight: '0.25rem',
  },
})

const ColSortLabel = ({ isSorted, isSortedDesc }) => {
  const renderIcon = () => {
    if (!isSorted) {
      return (<Icons.ArrowUpDown size='lg' />)
    }
    return isSortedDesc ? (
      <Icons.ArrowDown className='text-interactive-600' size='lg' />
    ) : (
      <Icons.ArrowUp className='text-interactive-600' size='lg' />
    )
  }

  return (
    <BaseComponents.ButtonBase className={classes.root}>
      {renderIcon()}
    </BaseComponents.ButtonBase>
  )
}

ColSortLabel.propTypes = {
  isSorted: PropTypes.bool,
  isSortedDesc: PropTypes.bool,
}
ColSortLabel.defaultProps = {
  isSorted: false,
  isSortedDesc: false,
}

export default ColSortLabel
