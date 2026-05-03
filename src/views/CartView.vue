<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useToast } from '@/composables/useToast'
import EmptyState from '@/components/ui/EmptyState.vue'

const router = useRouter()
const cart = useCartStore()
const toast = useToast()

function getDiscountedPrice(price: number, discount: number): number {
  return price * (1 - discount / 100)
}

function checkout() {
  toast.info('Payment processing coming soon!')
}

const shippingCost = 0 // Free shipping
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-8">Shopping Cart</h1>

    <!-- Empty cart -->
    <EmptyState
      v-if="cart.items.length === 0"
      title="Your cart is empty"
      description="Looks like you haven't added anything to your cart yet. Explore our products and find something you love!"
      action-label="Start Shopping"
      @action="router.push('/products')"
    />

    <!-- Cart with items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left: Cart items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.product.id"
          class="flex items-center gap-4 bg-light-surface dark:bg-dark-surface rounded-3xl p-4 shadow-card"
        >
          <!-- Product image -->
          <img
            :src="item.product.thumbnail"
            :alt="item.product.title"
            class="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover flex-shrink-0 cursor-pointer"
            @click="router.push(`/products/${item.product.id}`)"
          />

          <!-- Product info -->
          <div class="flex-1 min-w-0">
            <h3
              class="font-display font-semibold text-ink-primary dark:text-chalk-primary cursor-pointer hover:text-accent transition-colors"
              @click="router.push(`/products/${item.product.id}`)"
            >
              {{ item.product.title }}
            </h3>
            <p class="text-sm text-ink-muted dark:text-chalk-muted capitalize font-body">
              {{ item.product.category }}
              <span v-if="item.product.brand"> · {{ item.product.brand }}</span>
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span class="font-mono font-semibold text-accent">
                ${{ getDiscountedPrice(item.product.price, item.product.discountPercentage).toFixed(2) }}
              </span>
              <span
                v-if="item.product.discountPercentage > 0"
                class="font-mono text-sm text-ink-muted dark:text-chalk-muted line-through"
              >
                ${{ item.product.price.toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Quantity controls -->
          <div class="flex items-center gap-2 bg-light-elevated dark:bg-dark-elevated rounded-2xl p-1">
            <button
              class="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-light-border dark:hover:bg-dark-border transition-colors font-bold text-sm"
              @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
            >
              −
            </button>
            <span class="w-8 text-center font-mono font-semibold text-sm">{{ item.quantity }}</span>
            <button
              class="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-light-border dark:hover:bg-dark-border transition-colors font-bold text-sm"
              @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
            >
              +
            </button>
          </div>

          <!-- Line total -->
          <div class="hidden md:block text-right">
            <span class="font-mono font-bold text-ink-primary dark:text-chalk-primary">
              ${{ (getDiscountedPrice(item.product.price, item.product.discountPercentage) * item.quantity).toFixed(2) }}
            </span>
          </div>

          <!-- Remove -->
          <button
            class="p-2 text-ink-muted dark:text-chalk-muted hover:text-red-400 transition-colors"
            @click="cart.removeItem(item.product.id)"
            aria-label="Remove item"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Continue shopping -->
        <router-link
          to="/products"
          class="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-body font-medium text-sm transition-colors mt-4"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Continue Shopping
        </router-link>
      </div>

      <!-- Right: Order summary -->
      <div class="lg:col-span-1">
        <div class="sticky top-20 bg-light-surface dark:bg-dark-surface rounded-3xl p-6 shadow-card space-y-4">
          <h2 class="font-display text-xl font-bold text-ink-primary dark:text-chalk-primary">
            Order Summary
          </h2>

          <!-- Items breakdown -->
          <div class="space-y-2 text-sm font-body">
            <div class="flex justify-between text-ink-secondary dark:text-chalk-secondary">
              <span>Items ({{ cart.totalItems }})</span>
              <span class="font-mono">${{ (cart.subtotal + cart.savings).toFixed(2) }}</span>
            </div>
            <div v-if="cart.savings > 0" class="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Savings</span>
              <span class="font-mono font-semibold">-${{ cart.savings.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-ink-secondary dark:text-chalk-secondary">
              <span>Shipping</span>
              <span class="font-mono">
                {{ cart.subtotal >= 50 ? 'Free' : '$4.99' }}
              </span>
            </div>
            <p v-if="cart.subtotal < 50" class="text-xs text-ink-muted dark:text-chalk-muted">
              Add ${{ (50 - cart.subtotal).toFixed(2) }} more for free shipping
            </p>
          </div>

          <hr class="border-light-border dark:border-dark-border" />

          <!-- Total -->
          <div class="flex justify-between items-center">
            <span class="font-body font-semibold text-ink-primary dark:text-chalk-primary">Total</span>
            <span class="font-mono font-bold text-2xl text-ink-primary dark:text-chalk-primary">
              ${{ (cart.subtotal + (cart.subtotal >= 50 ? 0 : 4.99)).toFixed(2) }}
            </span>
          </div>

          <!-- Checkout button -->
          <button class="w-full btn-primary py-4 text-base" @click="checkout">
            Proceed to Checkout
          </button>

          <!-- Clear cart -->
          <button
            class="w-full text-center text-sm text-ink-muted dark:text-chalk-muted hover:text-red-400 font-body transition-colors"
            @click="cart.clearCart()"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
