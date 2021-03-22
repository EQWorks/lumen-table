import React from 'react'
import PropTypes from 'prop-types'

import ButtonBase from '@material-ui/core/ButtonBase'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: '2px',
    paddingRight: '2px',
  },
}))

const TableSortLabel = ({ isSorted, isSortedDesc }) => {
  const classes = useStyles()

  const renderIcon = () => {
    if (!isSorted) {
      return (<ImportExportIcon fontSize='small' color='disabled' />)
    }
    return isSortedDesc ? (
      <ArrowDownwardIcon fontSize='small' color='primary' />
    ) : (
      <ArrowUpwardIcon fontSize='small' color='primary' />
    )
  }
  return (<ButtonBase disableRipple className={classes.root}>{renderIcon()}</ButtonBase>)
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
