import { makeStyles } from '@eqworks/lumen-labs'

const tableStyle = ({ headerTitle, centerHeader, compactTable }) => makeStyles(({
  tableRootContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    '& .table__content-container': {
      position: 'relative',
      height: 'auto',
      margin: headerTitle ? '0.625rem 0.625rem' : 'initial',
      display: 'inline-block',
      fontSize: '0.857rem',
      lineHeight: '1rem',
      letterSpacing: '0.025rem',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '4px',
      borderCollapse: 'separate',
      borderSpacing: 0,
      overflowY: 'auto',

      '& tr': {
        borderStyle: 'solid',
        borderCollapse: 'separate',
        borderSpacing: 0,

        '& td, th': {
          padding: compactTable ? '0.25rem 0 0.25rem 0.5rem' : '0.75rem 0 0.75rem 1rem',
          borderStyle: 'solid',
          borderCollapse: 'separate',
          borderSpacing: 0,

          '&:last-child': {
            paddingRight: compactTable ? '0.5rem' : '1rem',
          },
        },

        '& .border-horizontal': {
          borderWidth: '0 0 1px 0',
        },

        '& .border-vertical': {
          borderWidth: '0 1px 0 0',
        },

        '& .border-vertical:last-child': {
          borderRight: '0',
        },

        '& .border-around': {
          borderWidth: '0 1px 1px 0',
        },
      },

      '& .table__header': {
        width: '100%',
        display: 'table',
        tableLayout: 'fixed',
        fontWeight: 700,

        '& .table__header-row': {
          '& .table__header-cell': {
            '& .table__header-item': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: centerHeader ? 'center' : 'flex-start',
              textTransform: 'capitalize',
            },
          },
        },
      },

      '& .sticky-header': {
        position: 'sticky',
        top: 0,
      },

      '& .table__body': {
        '& .table__body-row': {
          width: '100%',
          display: 'table',
          tableLayout: 'fixed',
          '& .table__body-cell': {
            '& .table__body-item': {
              wordWrap: 'break-word',
            },
          },
        },
      },

      '& .table__footer': {
        '& .table__footer-row': {
          borderWidth: '1px 0 0 0',
          borderStyle: 'solid',
          borderCollapse: 'separate',
          borderSpacing: 0,

          '& .border-none': {
            borderWidth: '1px 0 0 0',
          },

          '& .border-vertical': {
            borderWidth: '1px 0 0 0',
          },
        },
      },
    },

    '& .empty__container': {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
  
      '& .content__container': {
        padding: '1.25rem',
      },
    },
  },
}))

export default tableStyle
