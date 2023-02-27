import { makeStyles } from '@eqworks/lumen-labs'

const tableStyle = ({ isOverflow, centerHeader, compactTable }) => makeStyles(({
  tableRootContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: isOverflow ? 'visible' : 'scroll',

    '& .table__content-container': {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: isOverflow ? 'inline-block' : 'inline-table',
      fontSize: '0.857rem',
      lineHeight: '1rem',
      letterSpacing: '0.025rem',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '4px',
      borderCollapse: 'separate',
      borderSpacing: 0,
      overflow: 'auto',

      '& tr': {
        borderStyle: 'solid',
        borderCollapse: 'separate',
        borderSpacing: 0,

        '& td, th': {
          padding: compactTable ? '0.25rem 0.5rem 0.25rem 0.5rem' : '0.75rem 0.5rem 0.75rem 0.5rem',
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
        '& .table__header-row': {
          '& .table__header-cell': {
            '& .table__header-item': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: centerHeader ? 'center' : 'flex-start',
              textAlign: centerHeader ? 'center' : 'start',
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
