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

const classes = makeStyles(({
  tableContainer: {
    margin: '0.625rem 0.625rem',
  },
}))

const numberFormatting = val => `${Number(val)/1000}km`

const percentageFormatting = val => `${Number(val).toFixed(2)}%`

export const bar = () => <Table data={provinces} rowsPerPage={[5,10,20,50]} barColumns />

export const barSelectiveColumns = () => <Table data={provinces} rowsPerPage={[5,10,20,50]} barColumns={['rate', 'new_cases']} />

export const dashboardTable = () => (
  <Table 
    data={data} 
    classes={{
      tableRootContainer: 'shadow-blue-20',
      tableContainer: classes.tableContainer,
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
    barColumns={['Marketshare of Vehicle Age (%)']}
    hidePagination 
    formatData={{ 
      'Resolution (km)': numberFormatting,
      'Marketshare of Vehicle Age (%)': percentageFormatting,
    }}
    toolbar={false}
    headerTitle={true}
    title='testing title'
  />
)

export const customColorAndBorder = () => (
  <Table 
    data={data} 
    classes={{
      tableRootContainer: 'shadow-blue-20',
      tableContainer: classes.tableContainer,
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
    barColumns={['Marketshare of Vehicle Age (%)']}
    hidePagination 
    formatData={{ 
      'Resolution (km)': numberFormatting,
      'Marketshare of Vehicle Age (%)': percentageFormatting,
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
