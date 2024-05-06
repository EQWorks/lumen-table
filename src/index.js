import React, { 
  useState, 
  useEffect, 
  useMemo, 
  Children, 
  forwardRef, 
  useImperativeHandle, 
  useRef,
} from 'react'
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

import tableStyle from './table-style'
import HeaderTitle from './header-title'


const getHeader = (s) => [
  s.charAt(0).toUpperCase(),
  s.slice(1).replace(/_/g, ' '),
].join('')

const renderInCell = (props, barColumns, formatData, barColumnsColor, c) => (
  <InCellBar 
    {...props} 
    barColumns={barColumns} 
    barColumnsColor={barColumnsColor} 
    formatData={formatData} 
    {...c} 
  />
)

const getExplicitColumns = (barColumns, formatData, barColumnsColor, columns, children) => {
  if (Array.isArray(columns) && columns.length > 0) {
    if (barColumns.length > 0 || barColumns) {
      return columns.map(c => ({ ...c, Cell: (props) => 
        renderInCell(props, barColumns, formatData, barColumnsColor, columns) }))
    }

    return columns
  }

  return Children.toArray(children).filter(colFilter).map((c) => c.props)
}

const inferColumns = (data, barColumns, formatData, barColumnsColor) => Object.keys(data[0] || {}).map((accessor) => ({
  accessor,
  Header: getHeader(accessor),
  ...barColumns ? { Cell: (props) => renderInCell(props, barColumns, formatData, barColumnsColor) } : {},
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
  barColumns, 
  formatData,
  barColumnsColor,
}) => {
  // memoized columns and data for useTable hook
  const _data = useMemo(() => deObjectify(data), [data])
  const _cols = useMemo(() => {
    const inferred = inferColumns(data, barColumns, formatData, barColumnsColor)
    if (!children && !columns) {
      return inferred
    }
    const explicit = getExplicitColumns(barColumns, formatData, barColumnsColor, columns, children)

    if (extendColumns) {
      const expCols = explicit.map(v => v.id || v.accessor)
      return [
        ...inferred.filter((v) => !expCols.includes(v.accessor)),
        ...explicit,
      ]
    }

    return explicit
  }, [columns, data, children, barColumns, formatData, barColumnsColor])
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
  paginationClasses,
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
  hideRowsPerPage,
}, ref) => {
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

  const [isOverflow, setIsOverflow] = useState(true)

  const tableRef = useRef(null)
  const tableContainerRef = useRef(null)

  const tableClasses = tableStyle({ 
    isOverflow,
    centerHeader: defaultStyles.centerHeader, 
    compactTable: defaultStyles.compactTable,
  })

  useEffect(() => {
    const { current } = tableContainerRef
    setIsOverflow(!current || (current.scrollWidth !== current.clientWidth))
  }, [tableContainerRef])

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
        <tr className={`table__body-row ${classes.tableBodyRow || ''}`} key={i} {...row.getRowProps()}>
          {row.cells.map((cell, i) => (
            <td 
              key={i} 
              className={`table__body-cell ${classes.tableBodyCell || ''} border-${defaultStyles.borderType} 
                border-secondary-200 text-secondary-800 
                ${i === (highlightColumn - 1) && 'font-bold'}
              `} 
              {...cell.getCellProps()}
            >
              <div className={`table__body-item ${classes.tableBodyItem || ''}`}>
                {cell.render('Cell')}
                {console.log('cell: ', cell)}
              </div>
            </td>
          ))}
        </tr>
      )
    })
  )

  const renderTableHeaderItem = (col, index, totalHeaders) => {
    const formatType = formatData[col.id]?.type ? ` (${formatData[col.id]?.type})` : ''
    return (
      <div className={`table__header-item ${classes.tableHeaderItem || ''}`}>
        {`${col.render('Header')}${formatType}`}
        {col.canSort && (<ColSortLabel {...col} />)}
        {col.canFilter && (<ColFilterLabel column={col} index={index} length={totalHeaders}/>)}
      </div>
    )
  }

  return (
    <div 
      ref={tableRef} 
      className={`table__root-container ${classes.tableRootContainer || ''} 
        ${tableClasses.tableRootContainer} ${headerTitle ? 'shadow-blue-20' : ''} bg-secondary-50`
      }
    >
      {(_data.length > 0 && toolbar) && (
        <TableToolbar
          classes={classes}
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
          <table 
            ref={tableContainerRef} 
            className={`table__content-container ${classes.tableContentContainer || ''} border-secondary-200 shadow-light-10`} 
            {...getTableProps(tableProps)
            }
          >
            <thead className={`table__header-container ${classes.tableHeaderContainer || ''} text-secondary-500 
              ${(stickyHeader || hidePagination) && 'sticky-header'}
              ${defaultStyles.headerColor === 'grey' && 'bg-secondary-100'}
              ${defaultStyles.headerColor === 'white' && 'bg-secondary-50 shadow-light-40'}
            `}>
              {headerGroups.map((headerGroup, index) => {
                const totalHeaders = headerGroup.headers.length

                return ( 
                  <tr 
                    key={`header-row-${index}`} 
                    className={`table__header-row ${classes.tableHeaderRow || ''}`} {...headerGroup.getHeaderGroupProps(headerGroupProps)}
                  >
                    {headerGroup.headers.map((column, index) => (
                      <th 
                        key={`header-cell-${index}`} 
                        className={`table__header-cell ${classes.tableHeaderCell || ''} border-${defaultStyles.borderType} border-secondary-200`} 
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                      >
                        {renderTableHeaderItem(column, index, totalHeaders)}                      
                      </th>
                    ))}
                  </tr>
                )
              })}
            </thead>
            <tbody className={`table__body-container ${classes.tableBodyContainer || ''}`} {...getTableBodyProps()}>
              {renderTableRow(hidePagination ? rows : page)}
            </tbody>
            <tfoot className={`table__footer-container ${classes.tableFooterContainer || ''}`}>
              <tr className={`table__footer-row ${classes.tableFooterRow || ''}`}>
                {(0 < rows.length && rows.length < data.length ? rows.length > pageSize : rows.length > 0) && !hidePagination && (
                  <td className={`table__footer-cell ${classes.tableFooterCell || ''} border-${defaultStyles.borderType} border-secondary-200`} colSpan={100}>
                    <Pagination
                      classes={paginationClasses}
                      itemsLength={rows.length}
                      pageSize={pageSize}
                      onChangePage={(_, val) => {
                        gotoPage(val.pager.currentPage - 1)
                      }}
                      onChangeRowsPerPage={(e, val) => onChageRowsPerPage(e, val)}
                      rowsPerPage={rowsPerPage}
                      hideRowsPerPage={hideRowsPerPage}
                    />
                  </td>
                )}
              </tr>
            </tfoot>
          </table>
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
  classes: PropTypes.objectOf(PropTypes.string),
  paginationClasses: PropTypes.objectOf(PropTypes.string),
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
    compactTable: PropTypes.bool,
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
  barColumnsColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  headerTitle: PropTypes.bool,
  title: PropTypes.string,
  hideRowsPerPage: PropTypes.bool,
}

Table.defaultProps = {
  classes: {
    tableRootContainer: '',
    tableContentContainer: '',
    tableToolBarContainer: '',
    tableHeaderContainer: '',
    tableHeaderRow: '',
    tableHeaderCell: '',
    tableHeaderItem: '',
    tableBodyContainer: '',
    tableBodyRow: '',
    tableBodyCell: '',
    tableBodyItem: '',
    tableFooterContainer: '',
    tableFooterRow: '',
    tableFooterCell: '',
  },
  paginationClasses: {
    container: '',
    item: '',
    arrow: '',
    pageItem: '',
    currentPageColor: '',
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
    compactTable: false,
  },
  stickyHeader: false,
  rowsPerPage: [5, 10, 15, 20, 25],
  initialPageSize: 10,
  hidePagination: false,
  barColumns: false,
  formatData: {},
  barColumnsColor: '#6697ee',
  headerTitle: false,
  title: '',
  hideRowsPerPage: false,
}
Table.Column = TableColumn
Table.filters = { DefaultFilter, SelectionFilter, RangeFilter, QuantitaveFilter, QualitativeFilter }

export default Table
