import React, {useState} from 'react'
import { useTable, useSortBy } from 'react-table'
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import { BiFilter } from 'react-icons/bi'
import { useTableConfig } from '../utils'
import './table-base.css'

const sortIcon = {
  desc: <AiOutlineArrowDown/>,
  asc: <AiOutlineArrowUp/>,
  default: <></>,
}

const TableBase = ({
  columns,
  data,
  children,
  hiddenColumns,
  remember = {},
  extendColumns,
  isSortable,
  isFilterable,
}) => {
  const { _cols,
    _data } = useTableConfig({
    data,
    hiddenColumns,
    children,
    columns,
    remember,
    extendColumns,
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns: _cols,
    data: _data,
  },
  useSortBy,
  )

  const [filterColumn, setFilterColumn] = useState('')

  const getFilterTypes = (cols, data) => cols.map(col => ({ columnName: col.accessor, type: typeof data[0][col.accessor] }))

  const onFilterClicked = (col, e) => {
    setFilterColumn(col.id)
    e.stopPropagation()
  }

  const renderSortStatus = (column) => {
    const status = !column.isSorted ? 'default' : !column.isSortedDesc ? 'asc' : 'desc'

    return sortIcon[status]
  }

  return (
    <table className='table'>
      <thead className='table__head'>
        {headerGroups.map(headerGroup => (
          <tr className='table__head--row' {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column =>
              <th className='table__head--column'{...column.getHeaderProps(column.getSortByToggleProps())}>
                {<div className='table__head--cell'>
                  <div className='table__head-cell--text'>{column.render('Header')}</div>
                  {isSortable && <div className='table__head-cell--icon'>{renderSortStatus(column)}</div>}
                  {isFilterable && <div className='table__head-cell--filter' onClick={(e) => onFilterClicked(column, e)}><BiFilter /></div>}
                </div>}</th>)}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className='table__body'>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr className='table__body--row' {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td className='table__body--column' {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default TableBase
