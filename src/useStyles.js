import { makeStyles } from '@material-ui/core/styles'

const useStyles = (borderStyle) => makeStyles((theme) => {
  const containerBorderStyle = (borderStyle.size && borderStyle.type) && {
    border: `${borderStyle.size}px ${borderStyle.type} ${borderStyle.color ? borderStyle.color : 'black'}`,
    'border-radius': `${borderStyle.radius > 0 ? borderStyle.radius : 0}px`,
  }

  const tableBorderRadius = borderStyle.radius > 0 && {
    '& thead tr:last-child th:first-child': {
      'border-top-left-radius': borderStyle.radius,
    },

    '& thead tr:last-child th:last-child': {
      'border-top-right-radius': borderStyle.radius,
    },

    '& tfoot tr:last-child td:first-child': {
      'border-bottom': 0,
    },
  }

  return ({
    head: {
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: theme.palette.grey[50],
      whiteSpace: 'wrap',
      height: '100%',
    },
    columnContainer: {
      display: 'flex',
    },
    body: {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    },
    grow: {
      flexGrow: 1,
    },
    spacer: { flex: 'inherit' },
    root: {
      overflow: 'visible',
    },
    table: {
      tableLayout: 'fixed',
      ...tableBorderRadius,
    },
    tableMainContainer: {
      ...containerBorderStyle,
    },
  })
})

export default useStyles
