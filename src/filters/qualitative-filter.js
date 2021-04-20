import React, { useMemo, useState, useRef, useEffect } from 'react'
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
    paddingLeft: 10,
  },

  MuiListItemIcon: {
    minWidth: 0,
  },

  onlyButton: {
    textTransform: 'capitalize',
    display: 'none',
  },

  buttonContainer: {
    marginTop: 20,
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
    columnGap: 10,
  },
}))

const QualitativeFilter = ({ column: { filterValue, preFilteredRows, setFilter, id }, closePopper }) => {
  const [value, setValue] = useState('')
  const [optionsValue, setOptionsValue] = useState(filterValue || '')
  const listItemRef = useRef(null)

  let listContainer = ''
  let li = ''
  let onlyButtonContainer = ''

  const classes = useStyles()

  const options = useMemo(() => {
    const opts = new Set()
    preFilteredRows.forEach((row) => {
      opts.add(row.values[id])
    })
    return [...opts.values()]
  }, [id, preFilteredRows])

  useEffect(() => {
    if (listItemRef.current !== null) {
      listContainer = listItemRef.current.getElementsByClassName(classes.listItemContainer)
      li = listItemRef.current.getElementsByClassName('listItemText')
      onlyButtonContainer = listItemRef.current.getElementsByClassName(classes.onlyButton)
    }
  })

  const handleOnSearch = ({ target: { value } }) => {
    setValue(value)
  }

  const handleOnMouseEnter = (opt, index) => {
    if (!optionsValue || optionsValue.includes(opt)) {
      onlyButtonContainer[index].style.display = 'initial'
    }
  }

  const handleOnMouseLeave = (index) => {
    onlyButtonContainer[index].style.display = 'none'
  }

  const filterList = ({ target: { value } }) => {
    li.forEach((item, i) => {
      const textValue = item.textContent || item.innerText

      if (textValue.toUpperCase().indexOf(value.toUpperCase()) > -1) {
        listContainer[i].style.display = ''
      } else {
        listContainer[i].style.display = 'none'
      }
    })
  }

  const handleListItemOnClick = (e, opt) => {
    e.stopPropagation()

    let arr = (optionsValue || '').split(',').filter((v) => v)
    if (!arr.length) {
      arr = [...options]
    }

    const i = arr.indexOf(opt)
    if (i > -1) {
      arr.splice(i, 1)
    } else {
      arr.push(opt)
    }

    if (!optionsValue || optionsValue.includes(opt)) {
      onlyButtonContainer[options.indexOf(opt)].style.display = 'none'
    } else {
      onlyButtonContainer[options.indexOf(opt)].style.display = 'initial'
    }

    setOptionsValue(arr.length && arr.length < options.length ? arr.join(',') : undefined)
  }

  const handleOnlyOnClick = (e, opt) => {
    e.stopPropagation()
    setOptionsValue(opt)
  }

  const applyOnClick = (e) => {
    e.stopPropagation()
    closePopper && closePopper(e)
    setFilter(optionsValue)
  }

  const cancelOnClick = (e) => {
    e.stopPropagation()
    closePopper && closePopper(e)
    setOptionsValue(filterValue)
  }

  return (
    <div>
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
        {options.map((opt, index) => {
          const labelID = `${id}-selection-label-${opt}`
          return (
            <div key={opt} className={classes.listItemContainer} onMouseEnter={() => handleOnMouseEnter(opt, index)} onMouseLeave={() => handleOnMouseLeave(index)}>
              <ListItem
                className={classes.MuiListItem}
                role={undefined}
                dense
                button
                onClick={(e) => {
                  handleListItemOnClick(e, opt)
                }}
              >
                <ListItemIcon className={classes.MuiListItemIcon}>
                  <Checkbox
                    color='primary'
                    edge='start'
                    checked={!optionsValue || (optionsValue || '').includes(opt)}
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
                  handleOnlyOnClick(e, opt)
                }}
              >
                Only
              </Button>
            </div>
          )
        })}
      </List>
      <div className={classes.buttonContainer}>
        <Button variant="contained" color="primary" onClick={(e) => { applyOnClick(e) }}>
          Apply
        </Button>
        <Button variant="outlined" color="primary" onClick={(e) => { cancelOnClick(e) }}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

QualitativeFilter.propTypes = {
  column: PropTypes.object.isRequired,
  closePopper: PropTypes.func,
}
QualitativeFilter.filterFn = (rows, id, filterValue) => {
  const arr = (filterValue || '').split(',')
  return rows.filter((row) => arr.includes(row.values[id]))
}

export default QualitativeFilter
