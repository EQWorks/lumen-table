import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { TextField, Icons } from '@eqworks/lumen-labs'
import { useAsyncDebounce } from 'react-table'


const DefaultFilter = ({ filterValue, preFilteredRows, setFilter, id }) => {
  const [value, setValue] = useState(filterValue)
  const _setFilter = useAsyncDebounce(value => {
    setFilter(value || undefined)
  }, 200)
  const search = (value) => {
    setValue(value)
    _setFilter(value)
  }

  // Global filter only works with pagination from the first page.
  // This may not be a problem for server side pagination when
  // only the current page is downloaded.
  return (
    <TextField
      id={`table-search${id ? `-${id}` : ''}`}
      size='lg'
      inputProps={{ 
        placeholder: `Search in ${preFilteredRows.length} records...`, 
        startIcon: <Icons.Search size='lg'/> 
      }}
      onClick={(e) => { e.stopPropagation() }}
      onChange={search}
      value={value || ''}
    />
  )
}

DefaultFilter.propTypes = {
  filterValue: PropTypes.any,
  preFilteredRows: PropTypes.array.isRequired,
  setFilter: PropTypes.func.isRequired,
  id: PropTypes.string,
}
DefaultFilter.defaultProps = {
  filterValue: null,
  id: null,
}

export default DefaultFilter
