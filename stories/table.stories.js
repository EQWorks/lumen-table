import React, { useState, useEffect, useRef } from 'react'

import { Parser, transforms } from 'json2csv'
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
import { Button, Pagination, makeStyles } from '@eqworks/lumen-labs'

export default {
  title: 'Table',
  component: Table,
}

const classes = makeStyles({
  stylingContainer: {
    width: '45vw',
  },

  typography: {
    fontSize: '1rem',
    fontFamily: 'PT Sans, sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
})

export const empty = () => <Table />

export const normal = () => <Table data={provinces} rowsPerPage={[5,10,20,50]}/>

export const noToolbar = () => <Table data={provinces} toolbar={false} rowsPerPage={[5,10,20,50]}/>

export const stickyHeader = () => <Table data={provinces} initialPageSize={50} rowsPerPage={[5,10,20,50]} stickyHeader/>

export const highlightColumn = () => <Table data={provinces} rowsPerPage={[5,10,20,50]} highlightColumn={1}/>

export const stylingTypes = () => (
  <div>
    <h4 className='text-interactive-500'>Table styles</h4>
    <div className='flex'>
      <div className='mr-2'>
        <h4 className='m-2'>- White header - horizontal border</h4>
        <Table
          classes={{
            root: classes.stylingContainer,
          }} 
          data={provinces} 
          initialPageSize={5} 
          rowsPerPage={[5,10,20,50]}
          toolbar={false}
        />
      </div>
      <div>
        <h4 className='m-2'>- Grey header - horizontal border</h4>
        <Table
          classes={{
            root: classes.stylingContainer,
          }} 
          data={provinces} 
          initialPageSize={5} 
          rowsPerPage={[5,10,20,50]}
          toolbar={false}
          defaultStyles={
            {
              headerColor: 'grey',
              borderType: 'horizontal',
            }
          }
        />
      </div>
    </div>
    <div className='flex'>
      <div className='mr-2'>
        <h4 className='m-2'>- White header - vertical border</h4>
        <Table
          classes={{
            root: classes.stylingContainer,
          }} 
          data={provinces} 
          initialPageSize={5} 
          rowsPerPage={[5,10,20,50]}
          toolbar={false}
          defaultStyles={
            {
              headerColor: 'white',
              borderType: 'vertical',
            }
          }
        />
      </div>
      <div>
        <h4 className='m-2'>- Grey header - vertical border</h4>
        <Table
          classes={{
            root: classes.stylingContainer,
          }} 
          data={provinces} 
          initialPageSize={5} 
          rowsPerPage={[5,10,20,50]}
          toolbar={false}
          defaultStyles={
            {
              headerColor: 'grey',
              borderType: 'vertical',
            }
          }
        />
      </div>
    </div>
    <div className='flex'>
      <div className='mr-2'>
        <h4 className='m-2'>- White header - all around border</h4>
        <Table
          classes={{
            root: classes.stylingContainer,
          }} 
          data={provinces} 
          initialPageSize={5} 
          rowsPerPage={[5,10,20,50]}
          toolbar={false}
          defaultStyles={
            {
              headerColor: 'white',
              borderType: 'around',
            }
          }
        />
      </div>
      <div>
        <h4 className='m-2'>- Grey header - all around border</h4>
        <Table
          classes={{
            root: classes.stylingContainer,
          }} 
          data={provinces} 
          initialPageSize={5} 
          rowsPerPage={[5,10,20,50]}
          toolbar={false}
          defaultStyles={
            {
              headerColor: 'grey',
              borderType: 'around',
            }
          }
        />
      </div>
    </div>
    <div className='flex'>
      <div className='mr-2'>
        <h4 className='m-2'>- White header - none border</h4>
        <Table
          classes={{
            root: classes.stylingContainer,
          }} 
          data={provinces} 
          initialPageSize={5} 
          rowsPerPage={[5,10,20,50]}
          toolbar={false}
          defaultStyles={
            {
              headerColor: 'white',
              borderType: 'none',
            }
          }
        />
      </div>
      <div>
        <h4 className='m-2'>- Grey header - none border</h4>
        <Table
          classes={{
            root: classes.stylingContainer,
          }} 
          data={provinces} 
          initialPageSize={5} 
          rowsPerPage={[5,10,20,50]}
          toolbar={false}
          defaultStyles={
            {
              headerColor: 'grey',
              borderType: 'none',
            }
          }
        />
      </div>
    </div>
  </div>

)

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
        Cell: () => <Button size='sm' variant='filled' onClick={null}>Edit</Button>,
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
      Cell={() => <Button size='sm' variant='filled' onClick={null}>Edit</Button>}
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
      <div className={classes.typography}>
        Hidden columns remembered for {remember.ttl} minutes. Refresh page, or
        swich out and back to this story, to see its effect.
      </div>
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
      <div className={classes.typography}>
        Hidden columns remembered for {remember.ttl} minutes. Refresh page, or
        swich out and back to this story, to see its effect.
      </div>
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
      <div className={classes.typography}>
        Columns sorting order remembered for {remember.ttl} minutes. Refresh
        page, or swich out and back to this story, to see its effect.
      </div>
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
      <div className={classes.typography}>
        SortBy changing according to the chosen Button.
      </div>
      <div style={{ display: 'flex', marginTop: '.5rem' }}>
        {['new_cases', 'total_cases', 'province'].map((col) => (
          <div key={col} style={{ paddingRight: '.5rem' }}>
            <Button onClick={() => setSort(col)} size='sm'>
              {col}
            </Button>
          </div>
        ))}
      </div>
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
      <div className={classes.typography}>
        SortBy to be case insensitive.
      </div>
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
      <div className={classes.typography}>
        Data from <a href={API_URL}>{API_URL}</a>
      </div>
      <Table data={data} />
    </>
  )
}

export const customPagination = () => {
  const [getTable, setGetTable] = useState('')
  const tableRef = useRef({})
  const { rows, pageSize, gotoPage, setPageSize } = getTable

  useEffect(() => {
    setGetTable(tableRef.current)
  }, [tableRef])
  console.log(getTable)
  const onChageRowsPerPage = (e, val) => {
    e.stopPropagation()
    if (tableRef.pageSize !== val.pager.pageSize) {
      setPageSize(val.pager.pageSize)
    }
  }

  return (
    <div>
      <Table ref={tableRef} data={provinces} initialPageSize={10} stickyHeader hidePagination/>
      {getTable && (
        <Pagination
          items={rows}
          pageSize={pageSize}
          onChangePage={(_, page) => {
            gotoPage(page.currentPage - 1) 
          }}
          onChangeRowsPerPage={(e, val) => onChageRowsPerPage(e, val)}
          rowsPerPage={[5,10,20,50]}
        />
      )}
    </div>
  )
}
