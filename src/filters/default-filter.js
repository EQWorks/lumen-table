import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { TextField, Icons, makeStyles } from '@eqworks/lumen-labs'
import { useAsyncDebounce } from 'react-table'


const DefaultFilter = ({ filterValue, preFilteredRows, setFilter, id }) => {
  const classes = makeStyles({
    defaultFilterContainer: {
      '& .textfield-container': {
        width: '12.5rem'
      }
    }
  })

  const textFieldClasses = Object.freeze({
    container: 'textfield-container'
  })

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
    <div className={classes.defaultFilterContainer}>
      <TextField
        classes={textFieldClasses}
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
    </div>
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
