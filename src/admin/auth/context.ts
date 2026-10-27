import { createContext } from 'react'
import type { AdminIdentity } from '../lib/types'

export type AdminAuthStatus = 'loading' | 'signed_out' | 'authenticated' | 'forbidden' | 'error'

export type AdminAuthValue = {
  status: AdminAuthStatus
  identity: AdminIdentity | null
  error: string
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  reload: () => Promise<void>
}

export const AdminAuthContext = createContext<AdminAuthValue | null>(null)
