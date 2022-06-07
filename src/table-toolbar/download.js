import React from 'react'
import PropTypes from 'prop-types'

import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'

import { Button, makeStyles, BaseComponents, Icons } from '@eqworks/lumen-labs'

import Badge from '@material-ui/core/Badge'


export const saveData = ({ data, rows, allColumns, visibleColumns, downloadName, visCols = false, filteredRows = false }) => {
  const cols = (visCols && visibleColumns.length > 0) ? visibleColumns : allColumns
  const headers = cols.map((c) => c.render('Header'))
  const valueKeys = cols.map((c) => c.id)
  let csvContent = ''

  headers.forEach((h) => {
    csvContent += `"${String(h).replace(/"/g, '""')}",`
  })
  csvContent = csvContent.slice(0, -1)
  csvContent += '\r\n'

  ;(filteredRows ? rows.map((r) => r.values) : data).forEach((d) => {
    valueKeys.forEach((x) => {
      csvContent += `"${String(d[x]).replace(/"/g, '""')}",`
    })
    csvContent = csvContent.slice(0, -1)
    csvContent += '\r\n'
  })

  const url = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${downloadName}.csv` || 'data.csv')
  document.body.appendChild(link)

  link.click()
  link.remove()
}

const classes = makeStyles({
  downloadContainer: {
    '& .button-container': {
      border: 0,
    },

    '& .dialog-container': {
      zIndex: 1,
    },
  },
})

const dialogClasses = Object.freeze({
  root: classes.downloadContainer,
  dialog: 'dialog-container shadow-light-40 bg-secondary-50',
})

const buttonClasses = Object.freeze({
  button: 'button-container',
})

const Download = ({ data, allColumns, visibleColumns, rows, downloadFn, downloadName }) => {
  const allowVisCols = 0 < visibleColumns.length && visibleColumns.length < allColumns.length
  const allowFilteredRows = 0 < rows.length && rows.length < data.length
  const allowOptions = allowVisCols || allowFilteredRows

  const handleDownload = ({ visCols = false, filteredRows = false }) => (e) => {
    e.stopPropagation()
    downloadFn({ data, rows, allColumns, visibleColumns, visCols, filteredRows, downloadName })
  }

  const allText = () => {
    if (allowVisCols && !allowFilteredRows) {
      return 'All columns'
    }
    if (!allowVisCols && allowFilteredRows) {
      return 'All rows'
    }
    return 'All columns and rows'
  }

  if (!data.length || !(allColumns || []).length) {
    return null
  }

  const _button = (
    <div aria-label='Save Button'>
      <Button
        classes={buttonClasses}
        variant='outlined'
        size='lg'
        endIcon={
          <Badge color='secondary' variant='dot' invisible={!allowOptions}>
            <Icons.DownloadBold size='lg' />
          </Badge>
        }
        onClick={allowOptions ? undefined : handleDownload({ visCols: false, filteredRows: false })}
        aria-haspopup='menu'
      >
        Download
      </Button>
    </div>
  )

  return (
    <>
      <BaseComponents.DialogBase classes={dialogClasses} button={_button}>
        <MenuList>
          <MenuItem onClick={handleDownload({ visCols: false, filteredRows: false })}>
            {allText()}
          </MenuItem>
          {allowVisCols && allowFilteredRows && (
            <MenuItem onClick={handleDownload({ visCols: true, filteredRows: true })}>
              Visible columns and filtered rows
            </MenuItem>
          )}
          {allowVisCols && (
            <MenuItem onClick={handleDownload({ visCols: true, filteredRows: false })}>
              Visible columns
            </MenuItem>
          )}
          {allowFilteredRows && (
            <MenuItem onClick={handleDownload({ visCols: false, filteredRows: true })}>
              Filtered rows
            </MenuItem>
          )}
        </MenuList>
      </BaseComponents.DialogBase>
    </>
  )
}

Download.propTypes = {
  data: PropTypes.array,
  allColumns: PropTypes.array,
  visibleColumns: PropTypes.array,
  rows: PropTypes.array,
  downloadFn: PropTypes.func,
  downloadName: PropTypes.string,
}
Download.defaultProps = {
  data: [],
  allColumns: null,
  visibleColumns: [],
  rows: [],
  downloadFn: saveData,
}

export default Download
