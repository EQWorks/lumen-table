import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@eqworks/lumen-labs'

import DefaultFilter from './filters/default-filter'
import { getTailwindConfigColor } from '@eqworks/lumen-labs/dist/utils/tailwind-config-color'


const useStyles = () => makeStyles(({
  headerTitleRootContainer: {
    position: 'relative',
    padding: '1.25rem 0.625rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& .title__container': {
      fontSize: '1.125rem',
      color: getTailwindConfigColor('secondary-900'),
      fontWeight: 'bold',
      letterSpacing: '0.016rem',
    },

    '& .default-filter__root-container': {
      position: 'absolute',
      right: 0,
      padding: 'inherit',
    },
  },
}))


const HeaderTitle = ({
  allColumns,
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  title,
}) => {
  const classes = useStyles()

  return (
    <div className={`header-title__root-container shadow-blue-20 ${classes.headerTitleRootContainer}`}>
      {title && <div className="title__container">{title}</div>}
      {allColumns.some((c) => !c.disableGlobalFilter) && (
        <DefaultFilter
          preFilteredRows={preGlobalFilteredRows}
          setFilter={setGlobalFilter}
          globalFilter={globalFilter}
        />
      )}
    </div>
  )
}

HeaderTitle.propTypes = {
  allColumns: PropTypes.array,
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string.isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
  title: PropTypes.string,
}

HeaderTitle.defaultProps = {
  allColumns: [],
  title: '',
}

export default HeaderTitle
