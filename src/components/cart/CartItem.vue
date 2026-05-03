<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import type { CartItem as CartItemType } from '@/types'

const props = defineProps<{
  item: CartItemType
}>()

const cart = useCartStore()

function decrement() {
  if (props.item.quantity <= 1) {
    cart.removeItem(props.item.product.id)
  } else {
    cart.updateQuantity(props.item.product.id, props.item.quantity - 1)
  }
}

function increment() {
  cart.updateQuantity(props.item.product.id, props.item.quantity + 1)
}

const discountedPrice = (props.item.product.price * (1 - props.item.product.discountPercentage / 100))
</script>

<template>
  <div class="flex items-center gap-3 p-3 rounded-2xl bg-light-elevated dark:bg-dark-elevated">
    <!-- Thumbnail -->
    <img
      :src="item.product.thumbnail"
      :alt="item.product.title"
      class="w-12 h-12 rounded-xl object-cover flex-shrink-0"
    />

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-body font-medium text-ink-primary dark:text-chalk-primary line-clamp-1">
        {{ item.product.title }}
      </h4>
      <span class="text-accent font-mono font-semibold text-sm">
        ${{ discountedPrice.toFixed(2) }}
      </span>
      <!-- Quantity controls -->
      <div class="flex items-center gap-2 mt-1">
        <button
          class="w-6 h-6 rounded-lg bg-light-border dark:bg-dark-border flex items-center justify-center text-xs font-bold hover:bg-accent hover:text-white transition-colors"
          @click="decrement"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span class="text-sm font-mono w-6 text-center">{{ item.quantity }}</span>
        <button
          class="w-6 h-6 rounded-lg bg-light-border dark:bg-dark-border flex items-center justify-center text-xs font-bold hover:bg-accent hover:text-white transition-colors"
          @click="increment"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>

    <!-- Delete -->
    <button
      class="flex-shrink-0 p-1 text-ink-muted dark:text-chalk-muted hover:text-red-400 transition-colors"
      @click="cart.removeItem(item.product.id)"
      aria-label="Remove item"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>
