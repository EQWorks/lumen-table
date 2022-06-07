import React from 'react'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { Button, makeStyles, BaseComponents, Icons } from '@eqworks/lumen-labs'

import Switch from '@material-ui/core/Switch'
import Badge from '@material-ui/core/Badge'


const classes = makeStyles({
  toggleContainer: {
    '& .button-container': {
      border: 0,
    },

    '& .dialog-container': {
      zIndex: 1,
    },
  },

  list: {
    overflow: 'auto',
    maxHeight: '60vh',
  },
})

const dialogClasses = Object.freeze({
  root: classes.toggleContainer,
  dialog: 'dialog-container shadow-light-40 bg-secondary-50',
})

const buttonClasses = Object.freeze({
  button: 'button-container',
})

export const Toggle = ({ allColumns, toggleHideColumn }) => {
  if (!(allColumns || []).length) {
    return null
  }

  const _button = (
    <div aria-label='Edit button'>
      <Button
        classes={buttonClasses}
        variant='outlined'
        size='lg'
        endIcon={
          <Badge
            color='secondary'
            variant='dot'
            invisible={allColumns.every((c) => c.isVisible || c.noToggle)}
          >
            <Icons.Gear size='lg' />
          </Badge>
        }
        aria-haspopup='menu'
      >
        Edit table
      </Button>
    </div>
  )

  return (
    <>
      <BaseComponents.DialogBase classes={dialogClasses} button={_button}>
        <List className={classes.list}>
          {allColumns.map((c) => {
            const labelID = `toggle-label-${c.id}`
            return (
              <ListItem
                key={c.id}
                role={undefined}
                dense
                button
                disabled={c.noToggle}
                onClick={() => { toggleHideColumn(c.id) }}
              >
                <ListItemIcon>
                  <Switch
                    color='primary'
                    edge='start'
                    checked={c.isVisible}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelID }}
                  />
                </ListItemIcon>
                <ListItemText id={labelID} primary={c.render('Header')} />
              </ListItem>
            )
          })}
        </List>
      </BaseComponents.DialogBase>
    </>
  )
}

Toggle.propTypes = {
  allColumns: PropTypes.array,
  toggleHideColumn: PropTypes.func,
}
Toggle.defaultProps = {
  allColumns: [],
  toggleHideColumn: () => {},
}

export default Toggle
