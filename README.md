# @EQWorks/lumen-table

React data table component. Graduated from [@EQWorks/react-labs](https://github.com/EQWorks/react-labs).

## Getting started

Firstly, install `lumen-table`:

```
npm i @eqworks/lumen-table
```

Next, install the required peer dependencies:

```
npm i @eqworks/lumen-ui @material-ui/core @material-ui/icons @material-ui/lab react react-dom
```

Once you have installed all the required dependencies, wrap your application in a `<ThemeProvider>`:

```jsx
import { ThemeProvider } from "@eqworks/lumen-ui";

const MyApp = () => <ThemeProvider>Hello world!</ThemeProvider>;
```

Now, you can start using `lumen-table` component:

```jsx
import { Table } from "@eqworks/lumen-table";

const MyComponent = () => (
  <div>
    <Table />
  </div>
);
```

> **Note:** You can override the `lumen-ui` default theme by passing a `theme` prop to `<ThemeProvider>`.<br />[Click here to find out how to create your own theme using Material UI's `createMuiTheme` method](https://material-ui.com/customization/theming/#api).
