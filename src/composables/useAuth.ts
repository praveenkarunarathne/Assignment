import { useAuthStore } from '@/stores/authStore'
import type { LoginCredentials } from '@/types'

export function useAuth() {
  const store = useAuthStore()
  return {
    user: store.user,
    isLoggedIn: store.isLoggedIn,
    loading: store.loading,
    error: store.error,
    signIn: (credentials: LoginCredentials) => store.signIn(credentials),
    signOut: () => store.signOut(),
    restoreSession: () => store.restoreSession(),
  }
}
