import { useMemo, useState } from 'react'
import { cached } from 'use-cached'
export const getHeader = (s) => [
  s.charAt(0).toUpperCase(),
  s.slice(1).replace(/_/g, ' '),
].join('')

export const inferColumns = (data) => Object.keys(data[0] || {}).map((accessor) => ({
  accessor,
  Header: getHeader(accessor),
}))

export const useTableConfig = ({ data, hiddenColumns, children, columns, remember, extendColumns = false }) => {
  // memoized columns and data for useTable hook
  const _data = useMemo(() => data, [data])
  const _cols = useMemo(() => {
    const inferred = inferColumns(data)
    if (!children && !columns) {
      return inferred
    }
    const explicit = Array.isArray(columns) && columns.length > 0
      ? columns
      : Children.toArray(children).filter(colFilter).map((c) => c.props)

    if (extendColumns) {
      const expCols = explicit.map(v => v.id || v.accessor)
      return [
        ...inferred.filter((v) => !expCols.includes(v.accessor)),
        ...explicit,
      ]
    }
    return explicit
  }, [columns, data, children])
  // cached hidden state
  const [hidden, setHiddenCache] = cached({
    ...remember,
    key: remember.key != null ? `${remember.key}_HIDDEN` : null,
  })(useState)(() => {
    const _hidden = _cols.filter((c) => c.hidden).map((c) => (typeof c.accessor === 'string') ? c.accessor : c.id)
    return _hidden.length ? _hidden : (hiddenColumns || [])
  })

  return {
    _cols,
    _data,
    hidden,
    setHiddenCache,
  }
}
