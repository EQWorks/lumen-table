import { makeStyles } from '@eqworks/lumen-labs'

const tableStyle = makeStyles(({
  tableRootContainer: {
    '& .table-container': {
      '& .table-root': {
        position: 'relative',
        width: '100%',
        fontSize: '0.857rem',
        lineHeight: '1rem',
        letterSpacing: '0.4px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '4px',
        borderCollapse: 'separate',
        borderSpacing: 0,

        '& tr': {
          borderStyle: 'solid',
          borderCollapse: 'separate',
          borderSpacing: 0,

          '& td, th': {
            padding: '0.75rem 0 0.75rem 1rem',
            borderStyle: 'solid',
            borderCollapse: 'separate',
            borderSpacing: 0,

            '&:last-child': {
              paddingRight: '1rem',
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
                wordWrap: 'break-word',
              },
            },
          },
        },

        '& .table-footer': {
          '& .table-footer-row': {
            borderWidth: '1px 0 0 0',
            borderStyle: 'solid',
            borderCollapse: 'separate',
            borderSpacing: 0,

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
