import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { CartItem, Product } from '@/types'

const CART_KEY = 'lumiere_cart'

export const useCartStore = defineStore('cart', () => {
  // Hydrate from localStorage
  const storedCart = localStorage.getItem(CART_KEY)
  const items = ref<CartItem[]>(storedCart ? JSON.parse(storedCart) : [])

  // Persist to localStorage on every change
  watch(items, (val) => {
    localStorage.setItem(CART_KEY, JSON.stringify(val))
  }, { deep: true })

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => {
      const discounted = item.product.price * (1 - item.product.discountPercentage / 100)
      return sum + discounted * item.quantity
    }, 0)
  )

  const savings = computed(() =>
    items.value.reduce((sum, item) => {
      const saving = item.product.price * (item.product.discountPercentage / 100)
      return sum + saving * item.quantity
    }, 0)
  )

  function addItem(product: Product) {
    const existing = items.value.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ product, quantity: 1 })
    }
  }

  function removeItem(productId: number) {
    items.value = items.value.filter((i) => i.product.id !== productId)
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find((i) => i.product.id === productId)
    if (item) {
      if (quantity <= 0) removeItem(productId)
      else item.quantity = quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  function isInCart(productId: number): boolean {
    return items.value.some((i) => i.product.id === productId)
  }

  return {
    items,
    totalItems,
    subtotal,
    savings,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  }
})
