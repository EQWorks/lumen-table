import { makeStyles } from '@material-ui/core/styles'

const useStyles = (borderOptions) => makeStyles((theme) => {
  const containerBorderStyle = borderOptions.isBorder === true && {
    borderWidth: `${borderOptions.borderStyles.borderWidth ? borderOptions.borderStyles.borderWidth : 1}px`,
    borderStyle: `${borderOptions.borderStyles.borderStyle ? borderOptions.borderStyles.borderStyle : 'solid'}`,
    borderColor: `${borderOptions.borderStyles.borderColor ? borderOptions.borderStyles.borderColor : '#e0e0e0'}`,
    borderRadius: `${borderOptions.borderStyles.borderRadius ? borderOptions.borderStyles.borderRadius : 4}px`,
    '& tfoot tr:last-child td:first-child': {
      'border-bottom': 0,
    },
  }

  const tableBorderRadius = borderOptions.borderStyles.borderRadius && borderOptions.toolbar !== true && {
    '& thead tr:last-child th:first-child': {
      'border-top-left-radius': borderOptions.borderStyles.borderRadius,
    },

    '& thead tr:last-child th:last-child': {
      'border-top-right-radius': borderOptions.borderStyles.borderRadius,
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
