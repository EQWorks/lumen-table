import React from 'react'

import { Table } from '../src'
import provinces from './data/provinces'


export default {
  title: 'Table Chart',
  component: Table,
}

export const bar = () => <Table data={provinces} rowsPerPage={[5,10,20,50]} barColumns />

export const barSelectiveColumns = () => <Table data={provinces} rowsPerPage={[5,10,20,50]} barColumns={['rate', 'new_cases']} />
