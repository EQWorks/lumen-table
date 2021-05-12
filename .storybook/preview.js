import { ThemeProvider } from '@eqworks/lumen-ui/dist/theme';
import React from 'react';


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
];
