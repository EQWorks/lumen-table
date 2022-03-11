import { makeStyles } from '@eqworks/lumen-labs'

const tableStyle = makeStyles(({
  tableRootContainer: {
    '& .table-container': {
      '& .table-root': {
        position: 'relative',
        width: '100%',
        fontSize: '0.857rem',
        lineHeight: '1.143rem',
        letterSpacing: '0.029rem',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '4px',
        borderCollapse: 'separate',
        borderSpacing: 0,

        '& tr': {
          '& td, th': {
            borderStyle: 'solid',
            borderCollapse: 'separate',
            borderSpacing: 0,
            padding: '0.75rem 0 0.75rem 1rem',
          },

          '& .table-header-cell, .table-body-cell': {
            minWidth: '9.375rem',
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

        '& .table-header': {
          fontWeight: 700,
          '& .table-header-row': {
            '& .table-header-cell': {
              '& .table-header-item': {
                display: 'flex',
                alignItems: 'center',
              },
            },
          },
        },

        '& .sticky-header': {
          position: 'sticky',
          top: 0,
        },

        '& .table-body': {
          '& .table-body-row': {
            '& .table-body-cell': {
              '& .table-body-item': {
              },
            },
          },
        },

        '& .table-footer': {
          '& .table-footer-row': {
            '& .table-footer-cell': {
            },

            '& .border-none': {
              borderWidth: '1px 0 0 0',
            },

            '& .border-vertical': {
              borderWidth: '1px 0 0 0',
            },
          },
        },
      },
    },

    '& .empty-container': {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
  
      '& .content-container': {
        padding: '1.25rem',
      },
    },
  },
}))

export default tableStyle
