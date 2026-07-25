import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser } from '../types'
import { useCartStore } from './cart'
import router from '../router'

const TOKEN_KEY = 'ledger-auth-token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loginError = ref<string | null>(null)
  const loginLoading = ref(false)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const token = computed(() => localStorage.getItem(TOKEN_KEY))

  async function initAuth() {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (!storedToken) {
      isInitialized.value = true
      return
    }

    try {
      const res = await fetch('https://dummyjson.com/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })

      if (res.ok) {
        const data: AuthUser = await res.json()
        user.value = data
        // Load cart for this user from localStorage
        const cartStore = useCartStore()
        cartStore.loadCartForUser(data.id)
      } else {
        localStorage.removeItem(TOKEN_KEY)
      }
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY)
    } finally {
      isInitialized.value = true
    }
  }

  async function login(username: string, password: string): Promise<boolean> {
    loginLoading.value = true
    loginError.value = null
    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, expiresInMins: 60 }),
      })

      if (!res.ok) {
        const data = await res.json()
        loginError.value = data.message || 'Invalid credentials'
        return false
      }

      const data: AuthUser = await res.json()
      user.value = data
      localStorage.setItem(TOKEN_KEY, data.accessToken)
      
      const cartStore = useCartStore()
      cartStore.loadCartForUser(data.id)
      
      return true
    } catch (e) {
      loginError.value = e instanceof Error ? e.message : 'Login failed'
      return false
    } finally {
      loginLoading.value = false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    
    const cartStore = useCartStore()
    cartStore.clearCartStateOnly()
    
    router.push('/')
  }

  return {
    user,
    token,
    loginError,
    loginLoading,
    isInitialized,
    isAuthenticated,
    initAuth,
    login,
    logout,
  }
})
