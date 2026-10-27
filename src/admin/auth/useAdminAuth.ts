import { useContext } from 'react'
import { AdminAuthContext, type AdminAuthValue } from './context'

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext)
  if (!value) throw new Error('useAdminAuth must be used within an AdminAuthProvider.')
  return value
}
