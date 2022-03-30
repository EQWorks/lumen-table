import { fireEvent, getByRole } from '@testing-library/react'
import React from 'react'
import { render } from '@testing-library/react'
import TableBase from './table-base'

describe('<TableBase/>', () => {
  it('has table columns and rows', () => {
    const { getByRole } = render(<TableBase />)
    const thead = getByRole('thead')
    const tr = getByRole('tr')
    const th = getByRole('th')
    const tbody = getByRole('tbody')
  })
})
