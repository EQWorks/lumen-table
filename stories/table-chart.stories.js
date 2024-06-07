import React from 'react'

import { Table } from '../src'
import ageRange from './data/age-range'
import provinces from './data/provinces'
import crossCategoryData from './data/cross-category-data'
import { data, largeData } from './data/dashboard-data'
import { makeStyles } from '@eqworks/lumen-labs'


export default {
  title: 'Table Chart',
  component: Table,
}

/** -- props (Table):
 * [classes] - object, custom styling supported keys:
 *  tableRootContainer: root container wrapper,
 *  tableContentContainer: inner container wrapper,
 *  tableToolBarContainer: toolbar container wrapper,
 *  tableHeaderContainer: component header container wrapper,
 *  tableHeaderRow: header container row wrapper,
 *  tableHeaderCell: header container cell wrapper under row,
 *  tableHeaderItem: header container item wrapper under cell,
 *  tableBodyContainer: component body container wrapper,
 *  tableBodyRow: body container row wrapper,
 *  tableBodyCell: body container cell wrapper under row,
 *  tableBodyItem: body container item wrapper under cell,
 *  tableFooterContainer: component footer container wrapper,
 *  tableFooterRow: footer container row wrapper,
 *  tableFooterCell: body container cell wrapper under row,
 * [paginationClasses] - object, custom styling for pagination. Supported keys:
 *  container: container wrapper,
 *  arrow: arrow container wrapper,
 *  item: item container wrapper,
 *  pageItem: pageItem container wrapper under item,
 *  currentPageColor: currentPageColor container wrapper under item,
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
      centerHeader: bool, controls table header each title col to be centered - default: false,
      compactTable: bool, controls table cell height/width - default: false,
    }),
 * [stickyHeader] - bool, controls sticky table header for when pagination is not present = scrollable - default: false
 * [rowsPerPage] - arrayOf(number), defines the selectable number of rows per page when pagination is present - default: [5, 10, 15, 20, 25]
 * [initialPageSize] - number, defines the initial rows per page when pagination is present - default: 10
 * [highlightColumn] - number, specific column to be highlighted (bold)
 * [hidePagination] - bool, controls the use of pagination for the table - default: false
 * [barColumns]: oneOfType([bool,array]), if true all possible columns with numeric values will have bar display.
      if array with header column key only the selected ones will have bar display.
 * [formatData] - object, format columns value based on key and format function. See storybook example for details
 * [barColumnsColor] - string or array, defines bar columns main color only HEX color - default: '#6697ee'
       if array first value represents minColor and second is max color
       as number gets smaller it will appear closer to first value and as the number grows it appears closer to large value
 * [headerTitle] - bool, controls headerTitle with search filter display
 * [title] - string, set title for headerTitle
*/

const noPaginationStyleClasses = makeStyles(({
  rootContainer: {
    height: '31.25rem',
  },
}))

const numberFormatting = val => `${Number(val)/1000}km`

const percentageFormatting = val => `${Number(val).toFixed(2)}%`

const agePercentageFormatting = (val, ageRange) => {
  const totalUserCount = ageRange.reduce((sum, item) => sum + item.user_count, 0)

  // Calculate the percentage for this row
  const percentage = (val / totalUserCount) * 100

  // Return both the formatted percentage string and the raw percentage value
  return `${Number(percentage).toFixed(2)}%`
}

export const bar = () => (
  <div className={noPaginationStyleClasses.rootContainer}>
    <Table data={largeData} rowsPerPage={[5,10,20,50]} barColumns hidePagination/>
  </div>
)

export const barSelectiveColumns = () => <Table data={provinces} rowsPerPage={[5,10,20,50]} barColumns={['rate', 'new_cases']} />

export const dashboardTable = () => (
  <div className={noPaginationStyleClasses.rootContainer}>
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
  </div>
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
    barColumnsColor={'#5cb743'} // only HEX color
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
  <div className={noPaginationStyleClasses.rootContainer}>
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
      title='testing title'
      defaultStyles={
        {
          headerColor: 'white',
          borderType: 'around',
          compactTable: true,
        }
      }
    />
  </div>
)

const customTableClasses = makeStyles({
  tableRootContainer: {
    height: 'auto',
    overflowY: 'hidden',
  },
  tableContentContainer: {
    border: 'none!important',
  },
  tableHeaderContainer: {
    boxShadow: '0 1px 0 0px black',
    position: 'static!important',
  },
  tableHeaderItem: {
    color: 'black',
    fontWeight: 'Normal',
    justifyContent: 'center!important',
  },
  tableBodyCell: {
    paddingTop: '0.75rem!important',
    paddingBottom: '0px!important',
  },
})

export const ageRangeData = () => (
  <div className={noPaginationStyleClasses.rootContainer}>
    <Table
      classes={{
        tableRootContainer: customTableClasses.tableRootContainer,
        tableContentContainer: customTableClasses.tableContentContainer,
        tableHeaderContainer: customTableClasses.tableHeaderContainer,
        tableHeaderItem: customTableClasses.tableHeaderItem,
        tableBodyCell: customTableClasses.tableBodyCell,
      }} 
      data={ageRange}
      columns={
        Object.keys(ageRange[0]).map((key) => ({
          Header: key.replaceAll('_', ' '), 
          accessor: key,
          disableFilters: true,
          disableSortBy: true,
        }))
      }
      rowsPerPage={[5,10,20,50]}
      barColumns={['user_count']}
      hidePagination
      formatData={{
        'user count': {
          func: (row) => agePercentageFormatting(row, ageRange),
          type: '%',
        },
      }}
      toolbar={false}
      barColumnsColor={['#0066a4', '#b7b7b7']}
      defaultStyles={
        {
          borderType: 'vertical',
        }
      }
    />
  </div>
)

export const crossCategoryIndexes = () => {
  const sumPercentageFormatting = (data, row, key) => {
    const total = data.reduce((sum, item) => sum + Number(item[key]), 0)
    const percentage = (row / total) * 100
    return `${Number(percentage).toFixed(2)}%`
  }

  const customTableClasses = makeStyles({
    root: {
      width: '100%',
      '.bar-table-root-container': {
        overflowY: 'scroll',
        maxHeight: '24.5rem',
        scrollbarWidth: 'thin',
        height: 'auto',
        fontFamily: 'inherit',
        '.bar-table-content-container': {
          fontFamily: 'inherit',
          tableLayout: 'fixed',
          '.bar-table-header-container': {
            backgroundColor: 'white',
            fontFamily: 'inherit',
            '.bar-table-header-cell': {
              fontFamily: 'inherit',
              '.bar-table-header-item': {
                color: 'black',
                justifyContent: 'center',
                fontFamily: 'inherit',
                textTransform: 'none',
              },
            },
          },
          '.bar-table-body-cell': {
            fontFamily: 'inherit',
            padding: '0.07rem 1rem',
            '.bar-table-body-item': {
              fontFamily: 'inherit',
              color: 'black',
              fontWeight: 'lighter',

              height: '1.32rem',
              overflow: 'hidden',
              '> div': {
                '> div': {
                  height: '1.3rem',
                },
                '> p': {
                  fontFamily: 'inherit',
                  color:'black',
                },
              },
            },
          },
        },
      },
    } })

  const content = {
    columns: [
      { 
        Header: 'Category',
        accessor: 'category_name',
      },
      { 
        Header: 'Dollar Spend',
        accessor: 'total_spend',
      },
      {
        Header: 'Avg Dollar Spend per Customer',
        accessor: 'avg_spend_per_customer',
      },
      {
        Header: 'Index of Average Spend',
        accessor: 'avg_spend_per_customer_index',
      },
      {
        Header: 'Avg Transaction Size',
        accessor: 'avg_transaction_size',
      },
      {
        Header: 'Index of Average Transaction Size',
        accessor: 'avg_transaction_size_index',
      },
      {
        Header: 'Penetration Rate',
        accessor: 'penetration_rate',
      },
    ],
    sortBy: [{ id: 'total_spend', desc: true }],
    barColumns: ['total_spend', 'avg_spend_per_customer', 'avg_spend_per_customer_index', 'avg_transaction_size', 'avg_transaction_size_index','penetration_rate'],
    formatData: (data) => ({
      'Dollar Spend': {
        func: (row) => sumPercentageFormatting(data, row, 'total_spend'),
        type: '%',
      },
      'Avg Dollar Spend per Customer': (val) => `$${Number(val).toFixed(2)}`,
      'Index of Average Spend': (val) => Number(val).toFixed(2),
      'Avg Transaction Size': (val) => `$${Number(val).toFixed(2)}`,
      'Index of Average Transaction Size': (val) => Number(val).toFixed(2),
      'Penetration Rate': {
        func: (row) => sumPercentageFormatting(data, row, 'penetration_rate'),
        type: '%',
      },
    }),
    tooltipColumns: ['category_name'],
    tooltipConfig: {
      placement: 'top-start',
    },
  }

  return (
    <div className={noPaginationStyleClasses.rootContainer}>
      <div className={customTableClasses.root}>
        <Table
          classes={{
            tableRootContainer: 'bar-table-root-container',
            tableContentContainer: 'bar-table-content-container',
            tableHeaderContainer: 'bar-table-header-container',
            tableHeaderCell: 'bar-table-header-cell',
            tableHeaderItem: 'bar-table-header-item',
            tableBodyCell: 'bar-table-body-cell',
            tableBodyItem: 'bar-table-body-item',
          }} 
          data={crossCategoryData}
          columns={content.columns}
          barColumns={content.barColumns}
          hidePagination
          formatData={content.formatData? content.formatData(crossCategoryData) : {}}
          sortBy={content.sortBy || {}}
          toolbar={false}
          barColumnsColor={['#0066a4', '#b7b7b7']}
          defaultStyles={{ borderType: 'vertical' }}
          stickyHeader={true}
          tooltipColumns={content.tooltipColumns}
          tooltipConfig={content.tooltipConfig}
        />
      </div>
    </div>
  )}
