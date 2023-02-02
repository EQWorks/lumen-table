import React, { useState, useEffect, useMemo, Children, forwardRef, useImperativeHandle, useRef } from 'react'
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
import ColSortLabel from './filters/col-sort-label'
import ColFilterLabel from './filters/col-filter-label'
import DefaultFilter from './filters/default-filter'
import SelectionFilter from './filters/selection-filter'
import RangeFilter from './filters/range-filter'
import { saveData } from './table-toolbar/download'
import QuantitaveFilter from './filters/quantitave-filter'
import QualitativeFilter from './filters/qualitative-filter'
import InCellBar from './in-cell-bar'

import tableStyle from './tableStyle'
import { getTailwindConfigColor } from '@eqworks/lumen-labs/dist/utils/tailwind-config-color'
import HeaderTitle from './header-title'


const getHeader = (s) => [
  s.charAt(0).toUpperCase(),
  s.slice(1).replace(/_/g, ' '),
].join('')

const renderInCellBar = (props, barColumns, formatData, barColumnsColor, c) => 
  <InCellBar 
    {...props} 
    barColumns={barColumns} 
    barColumnsColor={barColumnsColor} 
    formatData={formatData} 
    {...c} 
  />

const inferColumns = (data, barColumns, formatData) => Object.keys(data[0] || {}).map((accessor) => ({
  accessor,
  Header: getHeader(accessor),
  Cell: (props) => renderInCellBar(props, barColumns, formatData),
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

const useTableConfig = ({ 
  data, 
  hiddenColumns,
  children, 
  columns, 
  remember, 
  extendColumns = false, 
  barColumns = false, 
  formatData,
  barColumnsColor,
}) => {
  // memoized columns and data for useTable hook
  const _data = useMemo(() => deObjectify(data), [data])
  const _cols = useMemo(() => {
    const inferred = inferColumns(data, barColumns, formatData)
    if (!children && !columns) {
      return inferred
    }
    const explicit = Array.isArray(columns) && columns.length > 0
      ? columns.map(c => ({ ...c, Cell: (props) => 
        renderInCellBar(props, barColumns, formatData, barColumnsColor, c) }))
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

export const Table = forwardRef(({
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
  hidePagination,
  barColumns,
  formatData,
  barColumnsColor,
  headerTitle,
  title,
}, ref) => {
  console.log('barColumns: ', barColumns)
  // custom table config hook
  const {
    _cols,
    _data,
    hidden,
    setHiddenCache,
  } = useTableConfig({ data, hiddenColumns, children, columns, remember, extendColumns, barColumns, barColumnsColor, formatData })
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
  const tableClasses = tableStyle({ 
    headerTitle,
    centerHeader: defaultStyles.centerHeader, 
  })
  const tableRef = useRef(null)

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

  useImperativeHandle(ref, () => ({
    ref: tableRef,
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
  }))

  const onChageRowsPerPage = (e, val) => {
    e.stopPropagation()
    if (pageSize !== val.pager.pageSize) {
      setPageSize(val.pager.pageSize)
    }
  }

  const renderTableRow = data => (
    data.map((row, i) => {
      prepareRow(row)
      return (
        <tr className="table__body-row" key={i} {...row.getRowProps()}>
          {row.cells.map((cell, i) => (
            <td className={`table__body-cell border-${defaultStyles.borderType} border-secondary-200 text-secondary-800 ${i === (highlightColumn - 1) && 'font-bold'}`} key={i} {...cell.getCellProps()}>
              <div className="table__body-item">{cell.render('Cell')}</div>
            </td>
          ))}
        </tr>
      )
    })
  )

  const renderTableHeaderItem = (col, index, totalHeaders) => {
    const formatType = formatData[col.id]?.type ? ` (${formatData[col.id]?.type})` : ''
    return (
      <div className="table__header-item">
        {`${col.render('Header')}${formatType}`}
        {col.canSort && (<ColSortLabel {...col} />)}
        {col.canFilter && (<ColFilterLabel column={col} index={index} length={totalHeaders}/>)}
      </div>
    )
  }

  return (
    <div 
      ref={tableRef} 
      className={`${tableClasses.tableRootContainer} ${classes.tableRootContainer}
        ${headerTitle ? 'shadow-blue-20' : ''} table__root-container bg-secondary-50`
      }
    >
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
      {(_data.length > 0 && headerTitle) && (
        <HeaderTitle 
          allColumns={allColumns}
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter || ''}
          title={title}
        />
      )}
      {visibleColumns.length > 0 ? (
        <>
          <div className={`${classes.tableContainer} table__container`}>
            <table className={`${classes.tableContentContainer} table__content-container border-secondary-200 shadow-light-10`} {...getTableProps(tableProps)}>
              <thead className={`${classes.tableHeaderContainer} table__header text-secondary-500 
                ${(stickyHeader || hidePagination) && 'sticky-header'}
                ${defaultStyles.headerColor === 'grey' && 'bg-secondary-100'}
                ${defaultStyles.headerColor === 'white' && 'bg-secondary-50 shadow-light-40'}
              `}>
                {headerGroups.map((headerGroup, index) => {
                  const totalHeaders = headerGroup.headers.length

                  return ( 
                    <tr key={`header-row-${index}`} className="table__header-row" {...headerGroup.getHeaderGroupProps(headerGroupProps)}>
                      {headerGroup.headers.map((column, index) => (
                        <th key={`header-cell-${index}`} className={`table__header-cell border-${defaultStyles.borderType} border-secondary-200`} {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {renderTableHeaderItem(column, index, totalHeaders)}                      
                        </th>
                      ))}
                    </tr>
                  )
                })}
              </thead>
              <tbody className={`${classes.tableBodyContainer} table__body`} {...getTableBodyProps()}>
                {renderTableRow(hidePagination ? rows : page)}
              </tbody>
              <tfoot className={`${classes.tableFooterContainer} table__footer`}>
                <tr className="table__footer-row">
                  {(0 < rows.length && rows.length < data.length ? rows.length > pageSize : rows.length > 0) && !hidePagination && (
                    <td className={`table__footer-cell border-${defaultStyles.borderType} border-secondary-200`} colSpan={100}>
                      <Pagination
                        itemsLength={rows.length}
                        pageSize={pageSize}
                        onChangePage={(_, val) => {
                          gotoPage(val.pager.currentPage - 1)
                        }}
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
        <div className="empty__container shadow-10">
          <div className="content__container">
            No visible columns
          </div>
        </div>
      )}
    </div>
  )
})

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
    centerHeader: PropTypes.bool,
  }),
  stickyHeader: PropTypes.bool,
  rowsPerPage: PropTypes.arrayOf(PropTypes.number),
  initialPageSize: PropTypes.number,
  highlightColumn: PropTypes.number,
  hidePagination: PropTypes.bool,
  barColumns: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]),
  formatData: PropTypes.object,
  barColumnsColor: PropTypes.string,
  headerTitle: PropTypes.bool,
  title: PropTypes.string,
}

Table.defaultProps = {
  classes: {
    tableRootContainer: '',
    tableContainer: '',
    tableContentContainer: '',
    tableHeaderContainer: '',
    tableBodyContainer: '',
    tableFooterContainer: '',
  },
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
    centerHeader: false,
  },
  stickyHeader: false,
  rowsPerPage: [5, 10, 15, 20, 25],
  initialPageSize: 10,
  hidePagination: false,
  barColumns: false,
  formatData: {},
  barColumnsColor: getTailwindConfigColor('primary-400'),
  headerTitle: false,
  title: '',
}
Table.Column = TableColumn
Table.filters = { DefaultFilter, SelectionFilter, RangeFilter, QuantitaveFilter, QualitativeFilter }

export default Table
