import { useCallback, useEffect, useRef, useState } from 'react'
import { adminApi } from './api'

type Query = Record<string, string | number | boolean | null | undefined>

type QueryState<T> = {
  data: T | null
  error: string
  loading: boolean
}

export function useAdminQuery<T>(action: string, query: Query = {}, options: { enabled?: boolean } = {}) {
  const enabled = options.enabled !== false
  const [state, setState] = useState<QueryState<T>>({ data: null, error: '', loading: enabled })
  const mounted = useRef(true)
  const key = JSON.stringify(query)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const run = useCallback(async () => {
    if (!enabled) return
    setState((previous) => ({ ...previous, loading: true, error: '' }))
    try {
      const result = await adminApi<T>(action, { query: JSON.parse(key) as Query })
      if (mounted.current) setState({ data: result, error: '', loading: false })
    } catch (error) {
      if (mounted.current) {
        setState({ data: null, error: error instanceof Error ? error.message : 'Request failed.', loading: false })
      }
    }
  }, [action, key, enabled])

  useEffect(() => {
    void run()
  }, [run])

  const setData = useCallback((updater: (current: T | null) => T | null) => {
    setState((previous) => ({ ...previous, data: updater(previous.data) }))
  }, [])

  return { ...state, reload: run, setData }
}
