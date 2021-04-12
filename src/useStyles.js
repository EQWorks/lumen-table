import { makeStyles } from '@material-ui/core/styles'

const useStyles = (borderOptions) => makeStyles((theme) => {
  const containerBorderStyle = borderOptions.isBorder === true && {
    border: `${borderOptions.borderStyle.size}px ${borderOptions.borderStyle.type} ${borderOptions.borderStyle.color ? borderOptions.borderStyle.color : 'black'}`,
    'border-radius': `${borderOptions.borderStyle.radius > 0 ? borderOptions.borderStyle.radius : 0}px`,
    '& tfoot tr:last-child td:first-child': {
      'border-bottom': 0,
    },
  }

  const tableBorderRadius = borderOptions.borderStyle.radius > 0 && borderOptions.toolbar !== true && {
    '& thead tr:last-child th:first-child': {
      'border-top-left-radius': borderOptions.borderStyle.radius,
    },

    '& thead tr:last-child th:last-child': {
      'border-top-right-radius': borderOptions.borderStyle.radius,
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
