import { makeStyles } from '@material-ui/core/styles'

const defaultBorderStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
}

const useStyles = ({ isBorder, borderStyles, toolbar }) => makeStyles((theme) => {
  const containerBorderStyle = isBorder === true && {
    ...defaultBorderStyle,
    ...borderStyles,

    '& tfoot tr:last-child td:first-child': {
      'border-bottom': 0,
    },
  }

  const tableBorderRadius = borderStyles.borderRadius && toolbar !== true && {
    '& thead tr:last-child th:first-child': {
      'border-top-left-radius': borderStyles.borderRadius,
    },

    '& thead tr:last-child th:last-child': {
      'border-top-right-radius': borderStyles.borderRadius,
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
