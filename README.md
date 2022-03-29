# @EQWorks/lumen-table

React data table component. Graduated from [@EQWorks/react-labs](https://github.com/EQWorks/react-labs).

## Getting started

Firstly, install `lumen-table`:

```
npm i @eqworks/lumen-table
```

Next, install the required peer dependencies:

```
npm i @eqworks/lumen-labs @material-ui/core @material-ui/icons react react-dom
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

You can override the `lumen-labs` default theme by passing a `classes` prop to `<Table />` for your own custom styling.

```jsx
import { Table } from "@eqworks/lumen-table";

const tableClasses = Object.freeze({
  rootContainer: 'custom-root-container-class',
  container: 'custom-container',
  root: 'custom-root',
  header: 'custom-header',
  body: 'custom-body',
  foot: 'custom-foot'
})

const MyComponent = () => (
  <div>
    <Table classes={tableClasses}/>
  </div>
);
```
