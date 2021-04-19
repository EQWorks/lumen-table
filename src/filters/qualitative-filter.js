import React, { useMemo, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import { Button, Checkbox } from '@material-ui/core'


const useStyles = makeStyles(() => ({
  list: {
    width: '20em',
    overflow: 'auto',
    maxHeight: '60vh',
    padding: '0 1.5em 0 1em',
  },

  listItemContainer: {
    display: 'flex',
  },

  MuiListItem: {
    paddingLeft: 10
  },

  MuiListItemIcon: {
    minWidth: 0
  },

  onlyButton: {
    padding: '1em',
    textTransform: 'capitalize'
  }
}))

const QualitativeFilter = ({ column: { filterValue, preFilteredRows, setFilter, id } }) => {
  const [value, setValue] = useState('')
  const listItemRef = useRef(null)

  const classes = useStyles()

  const options = useMemo(() => {
    const opts = new Set()
    preFilteredRows.forEach((row) => {
      opts.add(row.values[id])
    })
    return [...opts.values()]
  }, [id, preFilteredRows])

  const handleOnSearch = ({ target: { value } }) => {
    setValue(value)
  }

  const filterList = ({ target: { value } }) => {
    if (listItemRef.current !== null) {
      const li = listItemRef.current.getElementsByClassName('listItemText')
      const listContainer = listItemRef.current.getElementsByClassName(classes.listItemContainer)

      li.forEach((item, i) => {
        const textValue = item.textContent || item.innerText

        if (textValue.toUpperCase().indexOf(value.toUpperCase()) > -1) {
          listContainer[i].style.display = ''
        } else {
          listContainer[i].style.display = 'none'
        }
      })
    }
  }
  // console.log('options: ', options)
  return (
    <List ref={listItemRef} className={classes.list}>
      <TextField fullWidth variant='outlined'
        size='small'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <SearchIcon />
            </InputAdornment>
          ),
          'aria-label': 'search',
        }}
        onClick={(e) => { e.stopPropagation() }}
        onChange={handleOnSearch}
        onKeyUp={filterList}
        value={value || ''}
        placeholder={`Search in ${options.length} records...`}
      />

      {options.map((opt) => {
        const labelID = `${id}-selection-label-${opt}`
        return (
          <div className={classes.listItemContainer}>
            <ListItem
              key={opt}
              className={classes.MuiListItem}
              role={undefined}
              dense
              button
              onClick={(e) => {
                e.stopPropagation()
                let arr = (filterValue || '').split(',').filter((v) => v)
                if (!arr.length) {
                  arr = [...options]
                }
                const i = arr.indexOf(opt)
                if (i > -1) {
                  arr.splice(i, 1)
                } else {
                  arr.push(opt)
                }
                setFilter(arr.length && arr.length < options.length ? arr.join(',') : undefined)
              }}
            >
              <ListItemIcon className={classes.MuiListItemIcon}>
                <Checkbox
                  color='primary'
                  edge='start'
                  checked={!filterValue || (filterValue || '').includes(opt)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelID }}
                />
              </ListItemIcon>
              <ListItemText className='listItemText' id={labelID} primary={opt} />
            </ListItem>
            <Button
              className={classes.onlyButton}
              color="primary"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              Only
            </Button>
          </div>
        )
      })}
    </List>
  )
}

QualitativeFilter.propTypes = {
  column: PropTypes.object.isRequired,
}
QualitativeFilter.filterFn = (rows, id, filterValue) => {
  const arr = (filterValue || '').split(',')
  return rows.filter((row) => arr.includes(row.values[id]))
}

export default QualitativeFilter
