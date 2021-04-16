import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'


const useStyles = makeStyles(() => ({
  list: {
    overflow: 'auto',
    maxHeight: '60vh',
    padding: '0 1.5em',
  },
}))

const QualitativeFilter = ({ column: { filterValue, preFilteredRows, setFilter, id } }) => {
  const [value, setValue] = useState('')

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

  const filterList = () => {
    console.log('value: ', value)
  }

  console.log('options: ', options)
  return (
    <List className={classes.list}>
      <TextField variant='outlined'
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
          <ListItem
            key={opt}
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
            <ListItemIcon>
              <Switch
                color='primary'
                edge='start'
                checked={!filterValue || (filterValue || '').includes(opt)}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelID }}
              />
            </ListItemIcon>
            <ListItemText id={labelID} primary={opt} />
          </ListItem>
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
