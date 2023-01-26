import React from 'react'

import { Table } from '../src'
import provinces from './data/provinces'
import data from './data/dashboard-data'
import { getTailwindConfigColor } from '@eqworks/lumen-labs/dist/utils/tailwind-config-color'
import { makeStyles } from '@eqworks/lumen-labs'


export default {
  title: 'Table Chart',
  component: Table,
}

/** -- props (Table):
 * [classes] - object, custom styling supported keys:
 *  tableRootContainer: root container wrapper,
 *  tableContainer: outer container wrapper,
 *  tableContentContainer: inner container wrapper,
 *  tableHeaderContainer: component header container wrapper,
 *  tableBodyContainer: component body container wrapper,
 *  tableFooterContainer: component footer container wrapper,
 * [data] - array, data json structure to render the item inside the table
 * [columns] - arrayOf(object), render selected col with customizable values or use extendeColumns to only customize one col values
    either children or columns can't be both
 * [children] - any, render inner table content container elements. either children or columns can't be both
 * [downloadable] - bool, controls table data download option when toolbar is present - default: true
 * [hiddenColumns] - arrayOf(string), disable/hidde columns with the matches values (header key)
 * [toolbar] - bool, controls table toolbar display - default: true
 * [sortBy] - oneOfType([arrayOf(object), object]), define selected column based on header key for specific sorting
 * [remember] - object, allow remembering certain columns previous sorting or hide with a timer
      key: string, column header key
      ttl: number, remmeber timer in mins (5 = 5mins)
      ttlMS: number, remember timer in ms (5000 = 5mins)
      hidden: bool, remember hidden col based on timer
      sortBy: bool, remember sort option based on timer
    }),
 * [extendColumns] - bool, controls single custom columns value prop 
 * [downloadFn] - func, called when download is clicked
 * [defaultStyles] - object, controls predefined table styles
      headerColor: oneOf(['grey', 'white']), changes table header background color - default: 'white'
      borderType: oneOf(['none', 'horizontal', 'vertical', 'around']), changes table cells border display - default: 'horizontal'
      centerHeader: bool, controls table header each title col to be centered - default: false
    }),
 * [stickyHeader] - bool, controls sticky table header for when pagination is not present = scrollable - default: false
 * [rowsPerPage] - arrayOf(number), defines the selectable number of rows per page when pagination is present - default: [5, 10, 15, 20, 25]
 * [initialPageSize] - number, defines the initial rows per page when pagination is present - default: 10
 * [highlightColumn] - number, specific column to be highlighted (bold)
 * [hidePagination] - bool, controls the use of pagination for the table - default: false
 * [barColumns]: oneOfType([bool,array]), if true all possible columns with numeric values will have bar display.
      if array with header column key only the selected ones will have bar display.
 * [formatData] - object, format columns value based on key and format function. See storybook example for details
 * [barColumnsColor] - string, defines bar columns main color only HEX color - default: '#6697ee'
 * [headerTitle] - bool, controls headerTitle with search filter display
 * [title] - string, set title for headerTitle
*/

const compactStyleClasses = makeStyles(({
  tableRootContainer: {
    '& .table__container': {
      '& .table__content-container': {
        '& .table__header-compact': {
          '& .table__header-row': {
            '& .table__header-cell': {
              padding: '0.25rem 0 0.25rem 0.5rem',
              '&:last-child': {
                paddingRight: '0.5rem',
              },
            },
          },
        },
    
        '& .table__body-compact': {
          '& .table__body-row': {
            '& .table__body-cell': {
              padding: '0.25rem 0 0.25rem 0.5rem',
              '&:last-child': {
                paddingRight: '0.5rem',
              },
            },
          },
        },
      },
    },
  },
}))

const numberFormatting = val => `${Number(val)/1000}km`

const percentageFormatting = val => `${Number(val).toFixed(2)}%`

export const bar = () => <Table data={provinces} rowsPerPage={[5,10,20,50]} barColumns />

export const barSelectiveColumns = () => <Table data={provinces} rowsPerPage={[5,10,20,50]} barColumns={['rate', 'new_cases']} />

export const dashboardTable = () => (
  <Table 
    data={data}
    columns={
      Object.keys(data[0]).map((key) => ({
        Header: key.replaceAll('_', ' '), 
        accessor: key,
        disableFilters: true,
        disableSortBy: key === 'Age' ? false : true,
      }))
    }
    sortBy={{ id: 'Age', desc: false }}
    rowsPerPage={[5,10,20,50]}
    barColumns={['Marketshare of Vehicle Age']}
    hidePagination 
    formatData={{ 
      'Resolution': numberFormatting,
      'Marketshare of Vehicle Age': {
        func: percentageFormatting,
        type: '%',
      },
    }}
    toolbar={false}
    headerTitle={true}
    title='testing title'
  />
)

export const customColorAndBorder = () => (
  <Table 
    data={data} 
    columns={
      Object.keys(data[0]).map((key) => ({
        Header: key.replaceAll('_', ' '), 
        accessor: key,
        disableFilters: true,
        disableSortBy: key === 'Age' ? false : true,
      }))
    }
    sortBy={{ id: 'Age', desc: false }}
    rowsPerPage={[5,10,20,50]}
    barColumns={['Marketshare of Vehicle Age']}
    hidePagination 
    formatData={{ 
      'Resolution': {
        func: numberFormatting,
        type: 'Km',
      },
      'Marketshare of Vehicle Age': {
        func: percentageFormatting,
        type: '%',
      },
    }}
    toolbar={false}
    headerTitle={true}
    title='testing title'
    barColumnsColor={`${getTailwindConfigColor('success-400')}`} // only HEX color
    defaultStyles={
      {
        headerColor: 'grey', // PropTypes.oneOf(['grey', 'white'])
        borderType: 'around', // PropTypes.oneOf(['none', 'horizontal', 'vertical', 'around'])
        centerHeader: true,
      }
    }
  />
)

export const customCompactStyle = () => (
  <Table 
    data={data} 
    classes={{
      tableRootContainer: compactStyleClasses.tableRootContainer,
      tableHeaderContainer: 'table__header-compact',
      tableBodyContainer: 'table__body-compact',
    }}
    columns={
      Object.keys(data[0]).map((key) => ({
        Header: key.replaceAll('_', ' '), 
        accessor: key,
        disableFilters: true,
        disableSortBy: key === 'Age' ? false : true,
      }))
    }
    sortBy={{ id: 'Age', desc: false }}
    rowsPerPage={[5,10,20,50]}
    barColumns={['Marketshare of Vehicle Age']}
    hidePagination 
    formatData={{ 
      'Resolution': {
        func: numberFormatting,
        type: 'Km',
      },
      'Marketshare of Vehicle Age': {
        func: percentageFormatting,
        type: '%',
      },
    }}
    toolbar={false}
    title='testing title'
    defaultStyles={
      {
        headerColor: 'white',
        borderType: 'around',
      }
    }
  />
)
