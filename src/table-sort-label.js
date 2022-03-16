import React from 'react'
import PropTypes from 'prop-types'

import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded'
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded'
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded'

import { BaseComponents, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  root: {
    paddingLeft: '2px',
    paddingRight: '2px',
  },
})

const TableSortLabel = ({ isSorted, isSortedDesc }) => {
  const renderIcon = () => {
    if (!isSorted) {
      return (<ImportExportRoundedIcon fontSize='small' color='disabled' />)
    }
    return isSortedDesc ? (
      <ArrowDownwardRoundedIcon fontSize='small' color='primary' />
    ) : (
      <ArrowUpwardRoundedIcon fontSize='small' color='primary' />
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
