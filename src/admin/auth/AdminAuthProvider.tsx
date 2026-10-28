import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { supabase } from '../../supabase/client'
import { adminApi, AdminApiError } from '../lib/api'
import type { AdminIdentity } from '../lib/types'
import { AdminAuthContext, type AdminAuthStatus, type AdminAuthValue } from './context'

type AuthState = {
  status: AdminAuthStatus
  identity: AdminIdentity | null
  error: string
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', identity: null, error: '' })
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const loadIdentity = useCallback(async (hasSession: boolean): Promise<AuthState> => {
    if (!hasSession) {
      const nextState: AuthState = { status: 'signed_out', identity: null, error: '' }
      if (mounted.current) setState(nextState)
      return nextState
    }
    try {
      const identity = await adminApi<AdminIdentity>('me')
      const nextState: AuthState = { status: 'authenticated', identity, error: '' }
      if (mounted.current) setState(nextState)
      return nextState
    } catch (error) {
      let nextState: AuthState
      if (error instanceof AdminApiError && error.status === 403) {
        nextState = { status: 'forbidden', identity: null, error: error.message }
      } else {
        nextState = {
          status: 'error',
          identity: null,
          error: error instanceof Error ? error.message : 'Unable to load your administrator profile.',
        }
      }
      if (mounted.current) setState(nextState)
      return nextState
    }
  }, [])

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => loadIdentity(Boolean(data.session)))
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadIdentity(Boolean(session))
    })
    return () => subscription.subscription.unsubscribe()
  }, [loadIdentity])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    const identityState = await loadIdentity(Boolean(data.session))
    if (identityState.status !== 'authenticated') {
      throw new Error(identityState.error || 'Unable to verify administrator access.')
    }
  }, [loadIdentity])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setState({ status: 'signed_out', identity: null, error: '' })
  }, [])

  const reload = useCallback(async () => {
    setState((previous) => ({ ...previous, status: 'loading', error: '' }))
    const { data } = await supabase.auth.getSession()
    await loadIdentity(Boolean(data.session))
  }, [loadIdentity])

  const value = useMemo<AdminAuthValue>(
    () => ({ ...state, signIn, signOut, reload }),
    [state, signIn, signOut, reload],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
