<<<<<<< HEAD
import React from 'react'
=======
import React, { useEffect } from 'react'
>>>>>>> testing filter and sort states
import PropTypes from 'prop-types'

import Toolbar from '@material-ui/core/Toolbar'
import { makeStyles } from '@material-ui/core/styles'

import Download from './download'
import { Toggle } from './toggle'
import DefaultFilter from '../filters/default-filter'


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    marginRight: theme.spacing(2),
  },
}))

const TableToolbar = ({
  // Search
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  // Toggle
  toggleHideColumn,
  allColumns, // + Download
  // Download
  downloadable,
  downloadFn,
  data,
  visibleColumns,
  rows,
}) => {
  const classes = useStyles()

<<<<<<< HEAD
=======
  console.log('global filter: ', globalFilter)
>>>>>>> testing filter and sort states
  return (
    <Toolbar>
      {allColumns.some((c) => !c.disableGlobalFilter) && (
        <DefaultFilter
          preFilteredRows={preGlobalFilteredRows}
          setFilter={setGlobalFilter}
          globalFilter={globalFilter}
        />
      )}
      <div className={classes.grow} />
      {allColumns.some((c) => !c.noToggle) && (
        <Toggle
          allColumns={allColumns}
          toggleHideColumn={toggleHideColumn}
        />
      )}
      {downloadable && (
        <Download
          data={data}
          allColumns={allColumns}
          visibleColumns={visibleColumns}
          rows={rows}
          downloadFn={downloadFn}
        />
      )}
    </Toolbar>
  )
}

TableToolbar.propTypes = {
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string.isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
  ...Download.propTypes,
  ...Toggle.propTypes,
}

export default TableToolbar
