import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { SwitchRect, makeStyles } from '@eqworks/lumen-labs'


const SelectionFilter = ({ column: { filterValue, preFilteredRows, setFilter, id } }) => {
  const classes = makeStyles({
    list: {
      width: '40ch',
      overflow: 'auto',
      maxHeight: '60vh',
  
      '& .MuiListItem-root': {
        marginBottom: 4,
      },
    },
  })

  const options = useMemo(() => {
    const opts = new Set()
    preFilteredRows.forEach((row) => {
      opts.add(row.values[id])
    })
    return [...opts.values()]
  }, [id, preFilteredRows])

  return (
    <List className={classes.list}>
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
              <SwitchRect
                id={labelID}
                checked={!filterValue || (filterValue || '').includes(opt)}
                onClick={(e) => e.stopPropagation()}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={labelID} primary={opt} />
          </ListItem>
        )
      })}
    </List>
  )
}

SelectionFilter.propTypes = {
  column: PropTypes.object.isRequired,
}
SelectionFilter.filterFn = (rows, id, filterValue) => {
  const arr = (filterValue || '').split(',')
  return rows.filter((row) => arr.includes(row.values[id]))
}

export default SelectionFilter
