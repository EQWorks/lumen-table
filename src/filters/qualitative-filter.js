import React, { useMemo, useState, useRef , useEffect } from 'react'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, Button, BaseComponents, TextField, Icons, Checkbox } from '@eqworks/lumen-labs'


const classes = makeStyles({
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
    width: '100%',
  },

  optionButtonContainer: {
    padding: '6px 15px',
    display: 'none',
    textTransform: 'capitalize',

    '& .MuiButtonBase-root': {
      backgroundColor: 'unset',

      '&:hover': {
        backgroundColor: 'unset',
      },
    },
  },

  buttonContainer: {
    marginTop: '1.25rem',
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
    columnGap: '0.625rem',

    '& .submit-button': {
      justifyContent: 'center',
    },
  },
})

const QualitativeFilter = ({ column: { filterValue, preFilteredRows, setFilter, id }, closePopper }) => {
  const [value, setValue] = useState('')
  const [optionsValue, setOptionsValue] = useState(filterValue || '')

  const listContainerRef = useRef([])
  const listItemTextRef = useRef([])
  const optionButtonRef = useRef([])

  listContainerRef.current = []
  listItemTextRef.current = []
  optionButtonRef.current = []

  const tailwindClasses = Object.freeze({ 
    texfield: {
      container: 'w-full',
    },

    submitButton: {
      button: 'submit-button',
    },

    optionButton: {
      button: 'text-interactive-500 focus:outline-none',
    },
  })

  const options = useMemo(() => {
    const opts = new Set()
    preFilteredRows.forEach((row) => {
      opts.add(row.values[id])
    })
    return [...opts.values()]
  }, [id, preFilteredRows])

  useEffect(() => {
    if (!optionsValue.length) {
      setOptionsValue(options.join(','))
    }
  }, [options])

  const inputProps = { 
    placeholder:  `Search in ${options.length} records...`,
    startIcon: <Icons.Search size='lg'/>,
  }

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

  const handleOnSearch = (val) => {
    setValue(val)
  }

  const handleOnMouseEnter = (opt, index) => {
    if (!optionsValue || optionsValue.includes(opt)) {
      optionButtonRef.current[index].style.display = 'flex'
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
        optionButtonRef.current[options.indexOf(opt)].style.display = 'flex'
      }
      setOptionsValue(arr.length ? arr.join(',') : '')
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
          classes={tailwindClasses.texfield}
          size='lg'
          inputProps={inputProps}
          onClick={(e) => { e.stopPropagation() }}
          onChange={handleOnSearch}
          onKeyUp={filterList}
          value={value || ''}
        />
        {options.map((opt, index) => {
          const labelID = `${id}-selection-label-${opt}`
          const checked = optionsValue && optionsValue.split(',').filter((v) => v).includes(opt)

          return (
            <div
              key={labelID}
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
                {optionsValue && 
                  <Checkbox
                    checked={checked}
                    inputProps={{ disabled: opt === optionsValue ? true : false }}
                  />
                }
                <ListItemText ref={(el) => addToRefs(el, 'listItemText')} className='listItemText' id={labelID} primary={opt} />
              </ListItem>
              <div ref={(el) => addToRefs(el, classes.optionButton)} className={classes.optionButtonContainer}>
                {optionsValue && optionsValue.split(',').length === 1 ?
                  <BaseComponents.ButtonBase
                    classes={tailwindClasses.optionButton}
                    onClick={(e) => {
                      handleExceptOnClick(e, opt)
                    }}
                  >
                    Except
                  </BaseComponents.ButtonBase>
                  :
                  <BaseComponents.ButtonBase
                    classes={tailwindClasses.optionButton}
                    onClick={(e) => {
                      handleOnlyOnClick(e, opt)
                    }}
                  >
                    Only
                  </BaseComponents.ButtonBase>
                }
              </div>
            </div>
          )
        })}
      </List>
      <div className={classes.buttonContainer}>
        <Button classes={tailwindClasses.submitButton} variant="filled" size='lg' onClick={(e) => { applyOnClick(e) }}>
          Apply
        </Button>
        <Button classes={tailwindClasses.submitButton} variant="outlined" size='lg' onClick={(e) => { cancelOnClick(e) }}>
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
