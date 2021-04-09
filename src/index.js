import React, { useState, useEffect, useMemo, Children } from 'react'
import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TableContainer from '@material-ui/core/TableContainer'
import MUITable from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import { makeStyles } from '@material-ui/core/styles'
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useFilters,
} from 'react-table'
import { cached } from 'use-cached'

import TableColumn from './table-column'
import TableToolbar from './table-toolbar'
import TableSortLabel from './table-sort-label'
import TableFilterLabel from './table-filter-label'
import DefaultFilter from './filters/default-filter'
import SelectionFilter from './filters/selection-filter'
import RangeFilter from './filters/range-filter'
import { saveData } from './table-toolbar/download'


const useStyles = (borderStyle) => makeStyles((theme) => {
  const containerBorderStyle = (borderStyle.size && borderStyle.type) && {
    border: `${borderStyle.size + 'px'} ${borderStyle.type} ${borderStyle.color ? borderStyle.color : 'black'}`,
    'border-radius': `${borderStyle.radius > 0 ? borderStyle.radius : 0}`,
  }

  const tableBorderRadius = borderStyle.radius > 0 && {
    '& thead tr:last-child th:first-child': {
      'border-top-left-radius': borderStyle.radius,
    },

    '& thead tr:last-child th:last-child': {
      'border-top-right-radius': borderStyle.radius,
    },

    '& tfoot tr:last-child td:first-child': {
      'border-bottom': 0,
    },
  }

  return ({
    head: {
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: theme.palette.grey[50],
      whiteSpace: 'wrap',
      height: '100%',
    },
    columnContainer: {
      display: 'flex',
    },
    body: {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    },
    grow: {
      flexGrow: 1,
    },
    spacer: { flex: 'inherit' },
    root: {
      overflow: 'visible',
    },
    table: {
      tableLayout: 'fixed',
      ...tableBorderRadius,
    },
    tableMainContainer: {
      ...containerBorderStyle
    }
  })
})

const getHeader = (s) => [
  s.charAt(0).toUpperCase(),
  s.slice(1).replace(/_/g, ' '),
].join('')

const inferColumns = (data) => Object.keys(data[0] || {}).map((accessor) => ({
  accessor,
  Header: getHeader(accessor),
}))
const colFilter = (c) => c.type === TableColumn || c.type.name === 'TableColumn'

const useTableConfig = ({ data, hiddenColumns, children, columns, remember, extendColumns = false }) => {
  // memoized columns and data for useTable hook
  const _data = useMemo(() => data, [data])
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
  borderStyle,
}) => {
  const classes = useStyles(borderStyle)()
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
    state: { pageSize, pageIndex, globalFilter, hiddenColumns: _hidden, sortBy: _sortBy },
    rows,
  } = useTable(
    {
      columns: _cols,
      data: _data,
      initialState: {
        hiddenColumns: hidden,
        sortBy: useMemo(() => Array.isArray(cachedSortBy) ? cachedSortBy : [cachedSortBy], [cachedSortBy]),
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

  return (
    <div className={'tableMainContainer ' + `${classes.tableMainContainer}`}>
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
        <TableContainer>
          <MUITable className={classes.table} {...getTableProps(tableProps)}>
            <TableHead>
              {headerGroups.map((headerGroup, i) => (
                <TableRow key={i} {...headerGroup.getHeaderGroupProps(headerGroupProps)}>
                  {headerGroup.headers.map((column, i) => (
                    <TableCell
                      key={i}
                      className={classes.head}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      <div className={classes.columnContainer}>
                        {column.render('Header')}
                        {column.canSort && (<TableSortLabel {...column} />)}
                        {column.canFilter && (<TableFilterLabel column={column} />)}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()} className={classes.body}>
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <TableRow key={i} {...row.getRowProps()}>
                    {row.cells.map((cell, i) => (
                      <TableCell key={i} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>

            {/* TODO: this seems to be simplifiable */}
            {(0 < rows.length && rows.length < data.length ? rows.length > pageSize : rows.length > 0) && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    /* TODO: dynamically scale rowsPerPageOptions */
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: 'All', value: data.length },
                    ]}
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={pageSize}
                    page={pageIndex}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={(_, page) => { gotoPage(page) }}
                    onChangeRowsPerPage={({ target: { value } }) => {
                      setPageSize(Number(value))
                    }}
                    classes={{ spacer: classes.spacer, root: classes.root }}
                  />
                </TableRow>
              </TableFooter>
            )}
          </MUITable>
        </TableContainer>
      ) : (
        <Card>
          <CardContent>
            <Typography variant='body1'>
              No visible columns
            </Typography>
          </CardContent>
        </Card>
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
  borderStyle: PropTypes.shape({
    size: PropTypes.number,
    type: PropTypes.oneOf(['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden']),
    color: PropTypes.string,
    radius: PropTypes.number,
  }),
}
Table.defaultProps = {
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
  borderStyle: {},
}
Table.Column = TableColumn
Table.filters = { DefaultFilter, SelectionFilter, RangeFilter }

export default Table
