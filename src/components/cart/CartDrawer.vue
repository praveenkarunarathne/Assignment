<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useToast } from '@/composables/useToast'
import CartItem from '@/components/cart/CartItem.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const router = useRouter()
const cart = useCartStore()
const toast = useToast()

function close() {
  emit('update:open', false)
}

function goToCart() {
  close()
  router.push('/cart')
}

function checkout() {
  toast.info('Checkout coming soon!')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="page">
      <div v-if="open" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="close"
        />

        <!-- Drawer panel -->
        <div class="absolute right-0 top-0 bottom-0 w-80 md:w-96 bg-light-surface dark:bg-dark-surface shadow-2xl flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="font-display text-lg font-bold text-ink-primary dark:text-chalk-primary">
              Your Cart
              <span class="text-sm font-body font-normal text-ink-muted dark:text-chalk-muted">
                ({{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }})
              </span>
            </h2>
            <button
              class="p-2 rounded-xl hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors"
              @click="close"
              aria-label="Close cart"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Items list -->
          <div v-if="cart.items.length > 0" class="flex-1 overflow-y-auto p-4 space-y-3">
            <CartItem
              v-for="item in cart.items"
              :key="item.product.id"
              :item="item"
            />
          </div>

          <!-- Empty state -->
          <div v-else class="flex-1 flex items-center justify-center">
            <EmptyState
              title="Cart is empty"
              description="Add some products to get started."
              action-label="Continue Shopping"
              @action="close"
            />
          </div>

          <!-- Footer -->
          <div v-if="cart.items.length > 0" class="border-t p-4 space-y-3">
            <div v-if="cart.savings > 0" class="flex justify-between text-sm">
              <span class="text-emerald-600 dark:text-emerald-400 font-body">You save</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                -${{ cart.savings.toFixed(2) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="font-body font-medium text-ink-primary dark:text-chalk-primary">Subtotal</span>
              <span class="font-mono font-bold text-lg text-ink-primary dark:text-chalk-primary">
                ${{ cart.subtotal.toFixed(2) }}
              </span>
            </div>
            <button
              class="w-full btn-secondary text-sm"
              @click="goToCart"
            >
              View Cart
            </button>
            <button
              class="w-full btn-primary text-sm"
              @click="checkout"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
