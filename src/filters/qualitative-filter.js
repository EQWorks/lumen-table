import React, { useMemo, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded'
import Checkbox from '@eqworks/lumen-ui/dist/checkbox'
import Button from '@eqworks/lumen-ui/dist/button'
import TextField from '@eqworks/lumen-ui/dist/text-field'


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

  optionButton: {
    display: 'none',
    margin: 'auto',
    textTransform: 'capitalize',

    '& .MuiButtonBase-root': {
      backgroundColor: 'unset',

      '&:hover': {
        backgroundColor: 'unset',
      },
    },
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

  const listContainerRef = useRef([])
  const listItemTextRef = useRef([])
  const optionButtonRef = useRef([])

  listContainerRef.current = []
  listItemTextRef.current = []
  optionButtonRef.current = []

  const classes = useStyles()

  const options = useMemo(() => {
    const opts = new Set()
    preFilteredRows.forEach((row) => {
      opts.add(row.values[id])
    })
    return [...opts.values()]
  }, [id, preFilteredRows])

  const addToRefs = (el, type) => {
    switch (type) {
    case classes.listItemContainer:
      if (el && !listContainerRef.current.includes(el)) {
        listContainerRef.current.push(el)
      }
      break
    case 'listItemText':
      if (el && !listItemTextRef.current.includes(el)) {
        listItemTextRef.current.push(el)
      }
      break
    case classes.optionButton:
      if (el && !optionButtonRef.current.includes(el)) {
        optionButtonRef.current.push(el)
      }
      break
    default:
      break
    }
  }

  const handleOnSearch = ({ target: { value } }) => {
    setValue(value)
  }

  const handleOnMouseEnter = (opt, index) => {
    if (!optionsValue || optionsValue.includes(opt)) {
      optionButtonRef.current[index].style.display = 'initial'
    }
  }

  const handleOnMouseLeave = (index) => {
    optionButtonRef.current[index].style.display = 'none'
  }

  const filterList = ({ target: { value } }) => {
    listItemTextRef.current.forEach((item, i) => {
      const textValue = item.textContent || item.innerText

      if (textValue.toUpperCase().indexOf(value.toUpperCase()) > -1) {
        listContainerRef.current[i].style.display = ''
      } else {
        listContainerRef.current[i].style.display = 'none'
      }
    })
  }

  const handleListItemOnClick = (e, opt) => {
    e.stopPropagation()
    if (opt !== optionsValue) {
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
        optionButtonRef.current[options.indexOf(opt)].style.display = 'none'
      } else {
        optionButtonRef.current[options.indexOf(opt)].style.display = 'initial'
      }

      setOptionsValue(arr.length && arr.length < options.length ? arr.join(',') : '')
    }
  }

  const handleExceptOnClick = (e, opt) => {
    e.stopPropagation()
    let arr = [...options]

    const i = arr.indexOf(opt)
    if (i > -1) {
      arr.splice(i, 1)
    }

    optionButtonRef.current[options.indexOf(opt)].style.display = 'none'
    setOptionsValue(arr.length && arr.length < options.length ? arr.join(',') : '')
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
      <List className={classes.list}>
        <TextField 
          fullWidth 
          label=''
          startAdornment={(          
            <InputAdornment position='start'>
              <SearchRoundedIcon />
            </InputAdornment>
          )}
          onClick={(e) => { e.stopPropagation() }}
          onChange={handleOnSearch}
          onKeyUp={filterList}
          value={value || ''}
          placeholder={`Search in ${options.length} records...`}
        />
        {options.map((opt, index) => {
          const labelID = `${id}-selection-label-${opt}`
          return (
            <div
              key={opt}
              ref={(el) => addToRefs(el, classes.listItemContainer)}
              className={classes.listItemContainer}
              onMouseEnter={() => handleOnMouseEnter(opt, index)}
              onMouseLeave={() => handleOnMouseLeave(index)}
            >
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
                    disabled={opt === optionsValue ? true : false}
                  />
                </ListItemIcon>
                <ListItemText ref={(el) => addToRefs(el, 'listItemText')} className='listItemText' id={labelID} primary={opt} />
              </ListItem>
              <div ref={(el) => addToRefs(el, classes.optionButton)} className={classes.optionButton}>
                {optionsValue && optionsValue.split(',').length === 1 ?
                  <Button
                    type="tertiary"
                    color="primary"
                    onClick={(e) => {
                      handleExceptOnClick(e, opt)
                    }}
                    disableRipple
                  >
                    Except
                  </Button>
                  :
                  <Button
                    type="tertiary"
                    color="primary"
                    onClick={(e) => {
                      handleOnlyOnClick(e, opt)
                    }}
                    disableRipple
                  >
                    Only
                  </Button>
                }
              </div>
            </div>
          )
        })}
      </List>
      <div className={classes.buttonContainer}>
        <Button type="primary" color="primary" onClick={(e) => { applyOnClick(e) }}>
          Apply
        </Button>
        <Button type="secondary" color="primary" onClick={(e) => { cancelOnClick(e) }}>
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
