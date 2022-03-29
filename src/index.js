import React, { useState, useEffect, useMemo, Children } from 'react'
import PropTypes from 'prop-types'

import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useFilters,
} from 'react-table'
import { cached } from 'use-cached'

import { Pagination } from '@eqworks/lumen-labs'

import TableColumn from './table-column'
import TableToolbar from './table-toolbar'
import TableSortLabel from './table-sort-label'
import TableFilterLabel from './table-filter-label'
import DefaultFilter from './filters/default-filter'
import SelectionFilter from './filters/selection-filter'
import RangeFilter from './filters/range-filter'
import { saveData } from './table-toolbar/download'
import QuantitaveFilter from './filters/quantitave-filter'
import QualitativeFilter from './filters/qualitative-filter'

import tableStyle from './tableStyle'


const getHeader = (s) => [
  s.charAt(0).toUpperCase(),
  s.slice(1).replace(/_/g, ' '),
].join('')

const inferColumns = (data) => Object.keys(data[0] || {}).map((accessor) => ({
  accessor,
  Header: getHeader(accessor),
}))
const colFilter = (c) => c.type === TableColumn || c.type.name === 'TableColumn'
const deObjectify = (data) => data.map((d) => {
  const r = { ...d }
  Object.keys(d).forEach((k) => {
    if (typeof d[k] === 'object' && d[k] != null) {
      r[k] = JSON.stringify(d[k])
    }
  })
  return r
})

const useTableConfig = ({ data, hiddenColumns, children, columns, remember, extendColumns = false }) => {
  // memoized columns and data for useTable hook
  const _data = useMemo(() => deObjectify(data), [data])
  const _cols = useMemo(() => {
    const inferred = inferColumns(data)
    if (!children && !columns) {
      return inferred
    }
    const explicit = Array.isArray(columns) && columns.length > 0
      ? columns
      : Children.toArray(children).filter(colFilter).map((c) => c.props)

    if (extendColumns) {
      const expCols = explicit.map(v => v.id || v.accessor)
      return [
        ...inferred.filter((v) => !expCols.includes(v.accessor)),
        ...explicit,
      ]
    }
    return explicit
  }, [columns, data, children])
  // cached hidden state
  const [hidden, setHiddenCache] = cached({
    ...remember,
    key: remember.key != null ? `${remember.key}_HIDDEN` : null,
  })(useState)(() => {
    const _hidden = _cols.filter((c) => c.hidden).map((c) => (typeof c.accessor === 'string') ? c.accessor : c.id)
    return _hidden.length ? _hidden : (hiddenColumns || [])
  })

  return {
    _cols,
    _data,
    hidden,
    setHiddenCache,
  }
}

export const Table = ({
  classes,
  columns,
  data,
  toolbar,
  children,
  downloadable,
  hiddenColumns,
  tableProps,
  headerGroupProps,
  sortBy,
  remember,
  extendColumns,
  downloadFn,
  defaultStyles,
  stickyHeader,
  rowsPerPage,
  initialPageSize,
  highlightColumn,
}) => {
  // custom table config hook
  const {
    _cols,
    _data,
    hidden,
    setHiddenCache,
  } = useTableConfig({ data, hiddenColumns, children, columns, remember, extendColumns })
  // remember me
  const [cachedSortBy, setCachedSortBy] = cached({
    ...remember,
    key: remember.key != null ? `${remember.key}_SORT_BY` : null,
  })(useState)(sortBy)
  // useTable
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    allColumns,
    prepareRow,
    toggleSortBy,
    toggleHideColumn,
    setGlobalFilter,
    preGlobalFilteredRows,
    setPageSize,
    gotoPage,
    visibleColumns,
    state: { pageSize, globalFilter, hiddenColumns: _hidden, sortBy: _sortBy },
    rows,
  } = useTable(
    {
      columns: _cols,
      data: _data,
      initialState: {
        hiddenColumns: hidden,
        sortBy: useMemo(() => Array.isArray(cachedSortBy) ? cachedSortBy : [cachedSortBy], [cachedSortBy]),
        pageSize: initialPageSize,
      },
      sortTypes: {
        caseInsensitive: (row1, row2, columnName) => {
          if (row1.original[columnName].toLowerCase() > row2.original[columnName].toLowerCase()) {
            return 1
          } else if (row2.original[columnName].toLowerCase() > row1.original[columnName].toLowerCase()) {
            return -1
          } else {
            return 0
          }
        },
      },
    },
    // plugin hooks - order matters
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
  )

  // remember hidden
  useEffect(() => {
    if (remember.hidden) {
      setHiddenCache(_hidden)
    }
  }, [_hidden, remember.hidden])
  // remember sortBy
  useEffect(() => {
    if (remember.sortBy) {
      setCachedSortBy(_sortBy)
    }
  }, [_sortBy, remember.sortBy])
  useEffect(() => {
    if (sortBy.length) {
      toggleSortBy(sortBy[0].id, sortBy[0].desc, false)
    }
  }, [sortBy])

  const onChageRowsPerPage = (e, val) => {
    e.stopPropagation()
    if (pageSize !== val.pager.pageSize) {
      setPageSize(val.pager.pageSize)
    }
  }

  return (
    <div className={`table-root-container ${tableStyle.tableRootContainer} ${classes.root}`}>
      {(_data.length > 0 && toolbar) && (
        <TableToolbar
          rows={rows}
          allColumns={allColumns}
          visibleColumns={visibleColumns}
          toggleHideColumn={toggleHideColumn}
          downloadable={downloadable}
          data={data}
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter || ''}
          setGlobalFilter={setGlobalFilter}
          downloadFn={downloadFn}
        />
      )}
      {visibleColumns.length > 0 ? (
        <>
          <div className={`table-container ${classes.container}`}>
            <table className={`table-root border-secondary-200 shadow-light-10 ${classes.root}`} {...getTableProps(tableProps)}>
              <thead className={`table-header text-secondary-500 
                ${classes.header} ${stickyHeader && 'sticky-header'}
                ${defaultStyles.headerColor === 'grey' && 'bg-secondary-100'}
                ${defaultStyles.headerColor === 'white' && 'bg-secondary-50 shadow-light-40'}
              `}>
                {headerGroups.map((headerGroup, index) => {
                  const totalHeaders = headerGroup.headers.length

                  return ( 
                    <tr key={`header-row-${index}`} className="table-header-row" {...headerGroup.getHeaderGroupProps(headerGroupProps)}>
                      {headerGroup.headers.map((column, index) => (
                        <th key={`header-cell-${index}`} className={`table-header-cell border-${defaultStyles.borderType} border-secondary-200`} {...column.getHeaderProps(column.getSortByToggleProps())}>
                          <div className="table-header-item">
                            {column.render('Header')}
                            {column.canSort && (<TableSortLabel {...column} />)}
                            {column.canFilter && (<TableFilterLabel column={column} index={index} length={totalHeaders}/>)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  )
                })}
              </thead>
              <tbody className={`table-body ${classes.body}`} {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row)
                  return (
                    <tr className="table-body-row" key={i} {...row.getRowProps()}>
                      {row.cells.map((cell, i) => (
                        <td className={`table-body-cell border-${defaultStyles.borderType} border-secondary-200 text-secondary-800 ${i === (highlightColumn - 1) && 'font-bold'}`} key={i} {...cell.getCellProps()}>
                          <div className="table-body-item">{cell.render('Cell')}</div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className={`table-footer ${classes.footer}`}>
                <tr className="table-footer-row">
                  {(0 < rows.length && rows.length < data.length ? rows.length > pageSize : rows.length > 0) && (
                    <td className={`table-footer-cell border-${defaultStyles.borderType} border-secondary-200`} colSpan={100}>
                      <Pagination
                        items={rows}
                        pageSize={pageSize}
                        onChangePage={(_, page) =>  gotoPage(page.currentPage - 1)}
                        onChangeRowsPerPage={(e, val) => onChageRowsPerPage(e, val)}
                        rowsPerPage={rowsPerPage}
                      />
                    </td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      ) : (
        <div className="empty-container shadow-10">
          <div className="content-container">
            No visible columns
          </div>
        </div>
      )}
    </div>
  )
}

const childrenColumnCheck = (props, _, componentName) => {
  if (props.children && props.columns) {
    return new Error(`Only one or none of 'children' or 'columns' is allowed in '${componentName}'`)
  }
}

Table.propTypes = {
  classes: PropTypes.object,
  columns: childrenColumnCheck,
  children: childrenColumnCheck,
  data: PropTypes.array,
  downloadable: PropTypes.bool,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string),
  tableProps: PropTypes.object,
  toolbar: PropTypes.bool,
  headerGroupProps: PropTypes.object,
  sortBy: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  remember: PropTypes.shape({
    key: PropTypes.string,
    ttl: PropTypes.number,
    ttlMS: PropTypes.number,
    hidden: PropTypes.bool,
    sortBy: PropTypes.bool,
  }),
  extendColumns: PropTypes.bool,
  downloadFn: PropTypes.func,
  defaultStyles: PropTypes.shape({
    headerColor: PropTypes.oneOf(['grey', 'white']),
    borderType: PropTypes.oneOf(['none', 'horizontal', 'vertical', 'around']),
  }),
  stickyHeader: PropTypes.bool,
  rowsPerPage: PropTypes.arrayOf(PropTypes.number),
  initialPageSize: PropTypes.number,
  highlightColumn: PropTypes.number,
}

Table.defaultProps = {
  classes: {},
  columns: null,
  children: null,
  data: [],
  downloadable: true,
  hiddenColumns: [],
  tableProps: {},
  toolbar: true,
  headerGroupProps: {},
  sortBy: {},
  remember: {},
  extendColumns: false,
  downloadFn: saveData,
  defaultStyles: {
    headerColor: 'white',
    borderType: 'horizontal',
  },
  stickyHeader: false,
  initialPageSize: 10,
}
Table.Column = TableColumn
Table.filters = { DefaultFilter, SelectionFilter, RangeFilter, QuantitaveFilter, QualitativeFilter }

export default Table
