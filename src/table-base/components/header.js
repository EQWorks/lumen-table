import React from 'react'
'../styles/table.css'

const Header = ({ headerGroups }) => {
  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr className='table-row' {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th className='table-header'{...column.getHeaderProps()}>{column.render('Header')}</th>
          ))}
        </tr>
      ))}
    </thead>
  )
}

export default Header
