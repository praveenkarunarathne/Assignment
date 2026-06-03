import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, fetchCurrentUser } from '@/services/api'
import type { AuthResponse, LoginCredentials } from '@/types'
import { useCartStore } from '@/stores/cartStore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthResponse | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  async function signIn(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    try {
      const data = await login(credentials)
      const authToken = (data as any).accessToken || data.token
      token.value = authToken
      user.value = data
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('auth_user', JSON.stringify(data))
      return true
    } catch {
      error.value = 'Invalid username or password'
      return false
    } finally {
      loading.value = false
    }
  }

  async function restoreSession() {
    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser)
      token.value = storedToken
      // Optionally verify token with /auth/me
      try {
        const freshUser = await fetchCurrentUser()
        user.value = freshUser
      } catch {
        signOut()
      }
    }
  }

  function signOut() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    
    const cartStore = useCartStore()
    cartStore.clearCart()
  }

  return { user, token, loading, error, isLoggedIn, signIn, signOut, restoreSession }
})
