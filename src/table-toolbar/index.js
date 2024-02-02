import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@eqworks/lumen-labs'

import Download from './download'
import { Toggle } from './toggle'
import DefaultFilter from '../filters/default-filter'

const customClasses = makeStyles({
  toolbarRootContainer: {
    minHeight: '4rem',
    padding: '0.875rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflowX: 'auto',
    overflowY: 'hidden',

    '& .toolbar__options-container': {
      display: 'flex',
      alignItems: 'center',

      '& > div': {
        position: 'initial',
      },
    },
  },
})

const TableToolbar = ({
  classes,
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
  downloadName,
  data,
  visibleColumns,
  rows,
}) => {
  return (
    <div className={`toolbar__root-container ${classes.tableToolBarContainer || ''} ${customClasses.toolbarRootContainer}`}>
      {allColumns.some((c) => !c.disableGlobalFilter) && (
        <DefaultFilter
          preFilteredRows={preGlobalFilteredRows}
          setFilter={setGlobalFilter}
          globalFilter={globalFilter}
        />
      )}
      <div className='toolbar__options-container'>
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
            downloadName={downloadName}
          />
        )}
      </div>
    </div>
  )
}

TableToolbar.propTypes = {
  classes: PropTypes.object,
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string.isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
  ...Download.propTypes,
  ...Toggle.propTypes,
}

export default TableToolbar
