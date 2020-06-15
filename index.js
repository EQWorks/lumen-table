import React, { useState, useEffect, useMemo, Children } from 'react'
import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TableContainer from '@material-ui/core/TableContainer'
import MUITable from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TablePagination from '@material-ui/core/TablePagination'
import { makeStyles } from '@material-ui/core/styles'
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from 'react-table'

import TableColumn from './table-column'
import TableToolbar from './table-toolbar'


const useStyles = makeStyles((theme) => ({
  head: {
    fontSize: 'body',
    fontWeight: 600,
    backgroundColor: theme.palette.grey[50],
  },
  toggles: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  toolbarRight: {
    marginLeft: 'auto',
    marginRight: 0,
  },
}))

const getHeader = (s) => [
  s.charAt(0).toUpperCase(),
  s.slice(1).replace(/_/g, ' '),
].join('')

const Table = ({ columns, data, children, downloadable, tableProps, headerGroupProps }) => {
  const classes = useStyles()
  const [autoCols, setAutoCols] = useState(columns || [])
  const _data = useMemo(() => data, [data])
  useEffect(() => {
    if (!children && !columns) {
      setAutoCols(Object.keys(data[0] || {}).map((accessor) => ({
        accessor,
        Header: getHeader(accessor),
      })))
    } else if (Array.isArray(columns) && columns.length > 0) {
      setAutoCols(columns)
    } else {
      setAutoCols(
        Children.toArray(children)
          .filter((c) => c.type === TableColumn || c.type.name === 'TableColumn')
          .map((c) => c.props)
      )
    }
  }, [columns, data, children])
  const _cols = useMemo(() => autoCols, [autoCols])
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    allColumns,
    prepareRow,
    toggleHideColumn,
    setGlobalFilter,
    preGlobalFilteredRows,
    setPageSize,
    gotoPage,
    visibleColumns,
    state: { pageSize, pageIndex },
  } = useTable(
    {
      columns: _cols,
      data: _data,
    },
    // plugin hooks - order matters
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  return (
    <>
      <TableToolbar
        allColumns={allColumns}
        visibleColumns={visibleColumns}
        toggleHideColumn={toggleHideColumn}
        downloadable={downloadable}
        data={data}
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
      />
      {visibleColumns.length > 0 ? (
        <>
          <TableContainer>
            <MUITable {...getTableProps(tableProps)}>
              <TableHead>
                {headerGroups.map((headerGroup, i) => (
                  <TableRow key={i} {...headerGroup.getHeaderGroupProps(headerGroupProps)}>
                    {headerGroup.headers.map((column, i) => (
                      <TableCell
                        key={i}
                        className={classes.head}
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                      >
                        {column.render('Header')}
                        <TableSortLabel
                          active={column.isSorted}
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
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
            </MUITable>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[
              5,
              10,
              25,
              { label: 'All', value: data.length },
            ]}
            colSpan={3}
            count={data.length}
            rowsPerPage={pageSize}
            page={pageIndex}
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onChangePage={(_, page) => { gotoPage(page) }}
            onChangeRowsPerPage={({ target: { value }}) => {
              setPageSize(Number(value))
            }}
          />
        </>
      ) : (
        <Card>
          <CardContent>
            <Typography variant='body1'>
              No visible columns
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
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
  tableProps: PropTypes.object,
  headerGroupProps: PropTypes.object,
}
Table.defaultProps = {
  columns: null,
  children: null,
  data: [],
  downloadable: true,
  tableProps: {},
  headerGroupProps: {},
}
Table.Column = TableColumn

export default Table
