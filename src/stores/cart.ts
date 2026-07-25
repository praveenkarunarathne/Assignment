import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartLine } from '../types'
import { useToastStore } from './toast'
import { useAuthStore } from './auth'
import router from '../router'

export const useCartStore = defineStore('cart', () => {
  const lines = ref<CartLine[]>([])

  const itemCount = computed(() => lines.value.reduce((sum, l) => sum + l.quantity, 0))

  function getStorageKey(userId: number) {
    return `ledger-cart:${userId}`
  }

  function loadCartForUser(userId: number) {
    try {
      const raw = localStorage.getItem(getStorageKey(userId))
      lines.value = raw ? JSON.parse(raw) : []
    } catch {
      lines.value = []
    }
  }

  function saveCart() {
    const auth = useAuthStore()
    if (auth.user) {
      localStorage.setItem(getStorageKey(auth.user.id), JSON.stringify(lines.value))
    }
  }

  function addToCart(productId: number, quantity: number = 1): boolean {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      const toast = useToastStore()
      toast.push('Log in to add items to your cart', 'info')
      router.push('/login')
      return false
    }

    const existing = lines.value.find(l => l.productId === productId)
    if (existing) {
      existing.quantity += quantity
    } else {
      lines.value.push({ productId, quantity })
    }
    saveCart()

    const toast = useToastStore()
    toast.push('Added to cart', 'success')
    return true
  }

  function removeFromCart(productId: number) {
    const idx = lines.value.findIndex(l => l.productId === productId)
    if (idx !== -1) {
      lines.value.splice(idx, 1)
      saveCart()

      const toast = useToastStore()
      toast.push('Removed from cart', 'info')
    }
  }

  function updateQuantity(productId: number, quantity: number) {
    const line = lines.value.find(l => l.productId === productId)
    if (line) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        line.quantity = quantity
        saveCart()
      }
    }
  }

  function clearCartStateOnly() {
    // Only clears Pinia state, doesn't erase from localStorage
    lines.value = []
  }

  function clearCart() {
    lines.value = []
    saveCart()
  }

  function getQuantity(productId: number): number {
    return lines.value.find(l => l.productId === productId)?.quantity ?? 0
  }

  return {
    lines,
    itemCount,
    loadCartForUser,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearCartStateOnly,
    getQuantity,
  }
})
