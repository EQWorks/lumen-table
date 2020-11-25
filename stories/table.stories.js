import React, { useState } from 'react'

import Typography from '@material-ui/core/Typography'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Table } from '../src'

import provinces from './data/provinces'
import provincesRange from './data/provinces-range'
import provincesDates from './data/province-dates'
import provincesJson from './data/provinces-json'
import { DateRangeFilter, filterDates } from './data/date-range-filter'

export default {
  title: 'Table',
  component: Table,
}

export const empty = () => <Table />

export const normal = () => <Table data={provinces} />

export const columns = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'New cases', accessor: 'new_cases' },
      { Header: 'Total cases', accessor: 'total_cases' },
      { Header: 'Province', accessor: 'province' },
      { Header: 'Rate', accessor: 'rate', Cell: ({ value }) => `${value}%` },
    ]}
  />
)

export const columnsChildren = () => (
  <Table data={provinces}>
    <Table.Column Header="New cases" accessor="new_cases" />
    <Table.Column Header="Total cases" accessor="total_cases" />
    <Table.Column Header="Province" accessor="province" />
    <Table.Column
      Header="Rate"
      accessor="rate"
      Cell={({ value }) => `${value}%`}
    />
  </Table>
)

export const noToggle = () => (
  <Table data={provinces}>
    <Table.Column Header="New cases" accessor="new_cases" noToggle={true} />
    <Table.Column Header="Total cases" accessor="total_cases" />
    <Table.Column Header="Province" accessor="province" noToggle={true} />
    <Table.Column
      Header="Rate"
      accessor="rate"
      Cell={({ value }) => `${value}%`}
    />
  </Table>
)

export const initialHidden = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'New cases', accessor: 'new_cases', hidden: true },
      { Header: 'Total cases', accessor: 'total_cases' },
      {
        Header: 'Province',
        accessor: 'province',
        hidden: true,
        noToggle: true,
      },
      { Header: 'Rate', accessor: 'rate', Cell: ({ value }) => `${value}%` },
      {
        Header: 'Action',
        id: 'action',
        // eslint-disable-next-line react/display-name
        Cell: () => <button onClick={null}>Edit</button>,
        hidden: true,
      },
    ]}
  />
)

export const initialHiddenColumns = () => (
  <Table
    data={provinces}
    hiddenColumns={['new_cases', 'total_cases', 'action']}
  >
    <Table.Column Header="New cases" accessor="new_cases" />
    <Table.Column Header="Total cases" accessor="total_cases" />
    <Table.Column Header="Province" accessor="province" />
    <Table.Column
      Header="Rate"
      accessor="rate"
      Cell={({ value }) => `${value}%`}
    />
    <Table.Column
      Header="Action"
      id="action"
      Cell={() => <button onClick={null}>Edit</button>}
    />
  </Table>
)

export const disableGlobalFilter = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'New cases', accessor: 'new_cases' },
      { Header: 'Total cases', accessor: 'total_cases' },
      { Header: 'Rate', accessor: 'rate', Cell: ({ value }) => `${value}%` },
      { Header: 'Province', accessor: 'province' },
    ].map((c) => ({ ...c, disableGlobalFilter: true }))}
  />
)

export const disableFilters = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'New cases', accessor: 'new_cases' },
      { Header: 'Total cases', accessor: 'total_cases', disableFilters: true },
      { Header: 'Rate', accessor: 'rate', Cell: ({ value }) => `${value}%` },
      {
        Header: 'Province',
        accessor: 'province',
        disableFilters: true,
        disableGlobalFilter: true,
      },
    ]}
  />
)

export const disableSortBy = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'New cases', accessor: 'new_cases' },
      {
        Header: 'Total cases',
        accessor: 'total_cases',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Rate',
        accessor: 'rate',
        Cell: ({ value }) => `${value}%`,
        disableSortBy: true,
      },
      {
        Header: 'Province',
        accessor: 'province',
        disableFilters: true,
        disableGlobalFilter: true,
      },
    ]}
  />
)

export const SelectionFilter = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'New cases', accessor: 'new_cases' },
      { Header: 'Total cases', accessor: 'total_cases' },
      { Header: 'Rate', accessor: 'rate', Cell: ({ value }) => `${value}%` },
      {
        Header: 'Province',
        accessor: 'province',
        Filter: Table.filters.SelectionFilter,
        filter: Table.filters.SelectionFilter.filterFn,
      },
    ]}
  />
)

export const RangeFilter = () => (
  <Table
    data={provincesRange}
    columns={[
      {
        Header: 'New cases',
        accessor: 'new_cases',
        Filter: Table.filters.RangeFilter,
        filter: Table.filters.RangeFilter.filterFn,
      },
      {
        Header: 'Total cases',
        accessor: 'total_cases',
        Filter: Table.filters.RangeFilter,
        filter: Table.filters.RangeFilter.filterFn,
      },
      {
        Header: 'Rate',
        accessor: 'rate',
        Cell: ({ value }) => `${value * 100}%`,
        Filter: Table.filters.RangeFilter,
        filter: Table.filters.RangeFilter.filterFn,
        percentage: true,
      },
      { Header: 'Province', accessor: 'province' },
    ]}
  />
)

export const CustomDateRangeFilter = () => (
  // pass a custom Component and a custom filter to a column, following react-table documentation
  <Table
    data={provincesDates}
    columns={[
      {
        Header: 'Date',
        accessor: 'date',
        Filter: DateRangeFilter,
        filter: filterDates,
      },
      {
        Header: 'New cases',
        accessor: 'new_cases',
        Filter: Table.filters.RangeFilter,
        filter: Table.filters.RangeFilter.filterFn,
      },
      {
        Header: 'Total cases',
        accessor: 'total_cases',
        Filter: Table.filters.RangeFilter,
        filter: Table.filters.RangeFilter.filterFn,
      },
      {
        Header: 'Rate',
        accessor: 'rate',
        Cell: ({ value }) => `${value}%`,
        disableFilters: true,
      },
      { Header: 'Province', accessor: 'province' },
    ]}
  />
)

export const initialSortBy = () => (
  <Table data={provinces} sortBy={{ id: 'new_cases', desc: true }} />
)

export const tableProps = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'New cases', accessor: 'new_cases' },
      { Header: 'Total cases', accessor: 'total_cases' },
      { Header: 'Province', accessor: 'province' },
      { Header: 'Rate', accessor: 'rate', Cell: ({ value }) => `${value}%` },
    ]}
    tableProps={{
      // any Material UI <Table> props
      stickyHeader: true,
      size: 'small',
    }}
  />
)

export const rememberHidden = () => {
  const remember = {
    key: 'DEMO_REMEMBER_HIDDEN',
    ttl: 5, // remember for 5 minutes
    hidden: true,
  }
  return (
    <>
      <Typography variant="body1">
        Hidden columns remembered for {remember.ttl} minutes. Refresh page, or
        swich out and back to this story, to see its effect.
      </Typography>
      <Table
        data={provinces}
        columns={[
          { Header: 'New cases', accessor: 'new_cases', hidden: true },
          { Header: 'Total cases', accessor: 'total_cases' },
          { Header: 'Province', accessor: 'province' },
          {
            Header: 'Rate',
            accessor: 'rate',
            Cell: ({ value }) => `${value}%`,
          },
        ]}
        remember={remember}
      />
    </>
  )
}

export const rememberHiddenWithInitHiddenColumns = () => {
  const remember = {
    key: 'DEMO_REMEMBER_HIDDEN2',
    ttl: 5, // remember for 5 minutes
    hidden: true,
  }
  return (
    <>
      <Typography variant="body1">
        Hidden columns remembered for {remember.ttl} minutes. Refresh page, or
        swich out and back to this story, to see its effect.
      </Typography>
      <Table
        data={provinces}
        hiddenColumns={['new_cases', 'total_cases']}
        remember={remember}
      />
    </>
  )
}

export const rememberSortBy = () => {
  const remember = {
    key: 'DEMO_REMEMBER_SORT_BY',
    ttl: 5, // remember for 5 minutes
    sortBy: true,
  }
  return (
    <>
      <Typography variant="body1">
        Columns sorting order remembered for {remember.ttl} minutes. Refresh
        page, or swich out and back to this story, to see its effect.
      </Typography>
      <Table
        data={provinces}
        sortBy={{ id: 'new_cases', desc: true }}
        remember={remember}
      />
    </>
  )
}

export const dynamicSortBy = () => {
  const [sort, setSort] = useState('province')

  return (
    <>
      <Typography variant="body1">
        SortBy changing according to the chosen button.
      </Typography>
      {['new_cases', 'total_cases', 'province'].map((col) => (
        <button key={col} onClick={() => setSort(col)}>
          {' '}
          {col}{' '}
        </button>
      ))}
      <Table data={provinces} sortBy={[{ id: sort, desc: true }]} />
    </>
  )
}
export const caseInsensitiveSort = () => {
  const _provinces = provinces.map((p) => {
    if (p.province.startsWith('B')) p.province =  p.province.toLowerCase()
    return { ...p }
  })
  return (
    <>
      <Typography variant="body1">
        SortBy to be case insensitive.
      </Typography>
      <Table
        data={_provinces}
        columns={[
          { Header: 'New cases', accessor: 'new_cases', hidden: true },
          { Header: 'Total cases', accessor: 'total_cases' },
          { Header: 'Province', accessor: 'province', sortType: 'caseInsensitive' },
          {
            Header: 'Rate',
            accessor: 'rate',
            Cell: ({ value }) => `${value}%`,
          },
        ]}
      />
    </>
  )
}

export const extendColumns = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'Rate Extended', accessor: 'rate', Cell: ({ value }) => `${value}%` },
    ]}
    extendColumns
  />
)

export const extendColumnsChildren = () => (
  <Table data={provinces} extendColumns>
    <Table.Column
      Header="Rate Extended"
      accessor="rate"
      Cell={({ value }) => `${value}%`}
    />
  </Table>
)
export const renderJson = () => (
  <Table data={provincesJson}>
    <Table.Column Header="New cases" accessor="new_cases" />
    <Table.Column Header="Total cases" accessor="total_cases" />
    <Table.Column Header="Province" accessor="province" />
    <Table.Column
      Header="Info"
      accessor="info"
      Cell={({ value }) => {
        // if value type is json, just pass a node that can render it
        if (typeof value === 'object') {
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                JSON
              </AccordionSummary>
              <AccordionDetails>
                <pre>{JSON.stringify(value, undefined, 2)}</pre>
              </AccordionDetails>
            </Accordion>
          )
        }
        return `${value}%`
      }}
    />
  </Table>
)
