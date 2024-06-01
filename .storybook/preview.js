import React from 'react'
import 'regenerator-runtime/runtime'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [
  (Story) => (
    <Story />
  ),
]
