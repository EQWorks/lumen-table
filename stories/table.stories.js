import React, { useState, useEffect } from 'react'

import { Parser, transforms } from 'json2csv'
import Typography from '@eqworks/lumen-ui/dist/typography'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded'
import { Table } from '../src'

import provinces from './data/provinces'
import provincesRange from './data/provinces-range'
import provincesDates from './data/province-dates'
import provincesJson from './data/provinces-json'
import { DateRangeFilter, filterDates } from '../src/filters/date-range-filter'

export default {
  title: 'Table',
  component: Table,
}

export const empty = () => <Table />

export const normal = () => <Table data={provinces} />

export const noToolbar = () => <Table data={provinces} toolbar={false} />

export const columns = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'New cases', accessor: 'new_cases' },
      { Header: 'Total cases', accessor: 'total_cases' },
      { Header: 'Province', accessor: 'province' },
      { Header: 'Rate', accessor: 'rate', Cell: ({ value }) => `${value}%` },
    ]}
    slider={true}
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

export const QuantitaveFilter = () => (
  <Table
    data={provincesRange}
    columns={[
      {
        Header: 'New cases',
        accessor: 'new_cases',
        Filter: Table.filters.QuantitaveFilter,
        filter: Table.filters.QuantitaveFilter.filterFn,
      },
      {
        Header: 'Total cases',
        accessor: 'total_cases',
        Filter: Table.filters.QuantitaveFilter,
        filter: Table.filters.QuantitaveFilter.filterFn,
      },
      {
        Header: 'Rate',
        accessor: 'rate',
        Cell: ({ value }) => `${value * 100}%`,
        Filter: Table.filters.QuantitaveFilter,
        filter: Table.filters.QuantitaveFilter.filterFn,
        percentage: true,
      },
      { Header: 'Province', accessor: 'province' },
    ]}
  />
)

export const QualitativeFilter = () => (
  <Table
    data={provinces}
    columns={[
      { Header: 'New cases', accessor: 'new_cases' },
      { Header: 'Total cases', accessor: 'total_cases' },
      { Header: 'Rate', accessor: 'rate', Cell: ({ value }) => `${value}%` },
      {
        Header: 'Province',
        accessor: 'province',
        Filter: Table.filters.QualitativeFilter,
        filter: Table.filters.QualitativeFilter.filterFn,
      },
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
    if (p.province.startsWith('B')) p.province = p.province.toLowerCase()
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
export const renderJson = () => {
  const downloadToCsv = ({ data, rows, visibleColumns, visCols = false, filteredRows = false }) => {
    /* if row value is of type json and any columns are filtered or
      declared, the json values won't be downloaded - as the flattened values
      generate new columns and those are not declared inside `fields`
      https://github.com/zemirco/json2csv/issues/505#issuecomment-741835714
    */
    const cols = (visCols && visibleColumns.length > 0) ? visibleColumns : null
    /* if columns are filtered, csv will contain labeled value:
    value = new_cases
    label = New Cases
    */
    const fields = cols?.map(({ id: value, Header: label }) => ({ value, label }))
    const _rows = filteredRows ? rows.map((r) => r.values) : data
    const { flatten } = transforms
    const json2csvParser = new Parser({
      fields, // if undefined, download all
      transforms: [
        flatten({
          separator: '_',
          objects: true,
          arrays: true,
        }),
      ],
    })
    const csv = json2csvParser.parse(_rows)
    const url = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'data.csv')
    document.body.appendChild(link)

    link.click()
    link.remove()
  }

  return (
    <Table data={provincesJson} downloadFn={downloadToCsv} >
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
                  expandIcon={<ExpandMoreRoundedIcon />}
                >
                  Details
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
}

export const defaultBorderStyle = () => <Table data={provinces} isBorder={true}/>

export const customBorderStyle = () => <Table data={provinces} isBorder={true} borderStyles={{ borderRadius: 10, borderColor: 'red', borderStyle: 'dashed', borderWidth: 4 }}/>

export const arbitraryAPIData = () => {
  const API_URL = 'https://api.covid19api.com/summary'
  const [data, setData] = useState([])
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(({ Countries }) => {
        setData(Countries)
      })
  }, [])
  return (
    <>
      <Typography variant="body1">
        Data from <a href={API_URL}>{API_URL}</a>
      </Typography>
      <Table data={data} />
    </>
  )
}
