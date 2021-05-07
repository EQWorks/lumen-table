import React from 'react'
import PropTypes from 'prop-types'

import ButtonBase from '@material-ui/core/ButtonBase'
import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded'
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded'
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded'
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
      return (<ImportExportRoundedIcon fontSize='small' color='disabled' />)
    }
    return isSortedDesc ? (
      <ArrowDownwardRoundedIcon fontSize='small' color='primary' />
    ) : (
      <ArrowUpwardRoundedIcon fontSize='small' color='primary' />
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
