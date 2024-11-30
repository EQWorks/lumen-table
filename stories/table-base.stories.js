// Button.stories.js|jsx

import React from 'react'

import TableBase from '../src/table-base/table-base'

import { builderData } from './data/builder'
import provincesDates from './data/province-dates'
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Table Base',
  component: TableBase,
}

export const defaultMode = () => <TableBase data={provincesDates} isSortable isFilterable />

