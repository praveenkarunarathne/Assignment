<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'
import { useToastStore } from '../stores/toast'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import EmptyState from '../components/EmptyState.vue'
import MagneticButton from '../components/MagneticButton.vue'

const router = useRouter()
const cart = useCartStore()
const productsStore = useProductsStore()
const toast = useToastStore()

onMounted(() => {
  productsStore.fetchAll()
})

const cartProducts = computed(() => {
  return cart.lines.map((line) => {
    const product = productsStore.getProductById(line.productId)
    return { ...line, product }
  }).filter((item) => item.product !== undefined)
})

function getDiscountedPrice(price: number, discount: number = 0): number {
  return price * (1 - discount / 100)
}

const subtotal = computed(() => {
  return cartProducts.value.reduce((sum, item) => {
    return sum + (item.product!.price * item.quantity)
  }, 0)
})

const totalSavings = computed(() => {
  return cartProducts.value.reduce((sum, item) => {
    const original = item.product!.price * item.quantity
    const discounted = getDiscountedPrice(item.product!.price, item.product!.discountPercentage) * item.quantity
    return sum + (original - discounted)
  }, 0)
})

const discountedSubtotal = computed(() => subtotal.value - totalSavings.value)
const shippingCost = computed(() => discountedSubtotal.value >= 50 ? 0 : 4.99)
const finalTotal = computed(() => discountedSubtotal.value + shippingCost.value)

function checkout() {
  toast.push('Payment processing coming soon!', 'info')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 min-h-[80vh] pb-24 md:pb-16">
    <h1 class="font-display text-2xl sm:text-3xl font-light text-txt dark:text-txt-dark-primary tracking-tight mb-8 sm:mb-12">Shopping Cart</h1>

    <LoadingSpinner v-if="productsStore.loading" />

    <!-- Empty cart -->
    <EmptyState
      v-else-if="cart.lines.length === 0"
      title="Your cart is empty"
      description="Looks like you haven't added anything to your cart yet. Explore our products and find something you love!"
      action-label="Start Shopping"
      @action="router.push('/')"
    />

    <!-- Cart with items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
      <!-- Left: Cart items -->
      <div class="lg:col-span-2 space-y-0">
        <div
          v-for="item in cartProducts"
          :key="item.product!.id"
          class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-transparent py-6 border-b border-edge dark:border-edge-dark"
        >
          <!-- Product image -->
          <img
            :src="item.product!.thumbnail"
            :alt="item.product!.title"
            class="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover flex-shrink-0 cursor-pointer bg-transparent"
            @click="router.push(`/product/${item.product!.id}`)"
          />

          <!-- Product info + controls wrapper -->
          <div class="flex-1 min-w-0 w-full">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h3
                  class="font-display font-light text-sm sm:text-base text-txt dark:text-txt-dark-primary cursor-pointer hover:text-txt-secondary transition-colors truncate"
                  @click="router.push(`/product/${item.product!.id}`)"
                >
                  {{ item.product!.title }}
                </h3>
                <p class="text-xs sm:text-xs text-txt-muted dark:text-txt-dark-muted uppercase tracking-widest font-body mt-1 truncate">
                  {{ item.product!.category.replace(/-/g, ' ') }}
                  <span v-if="item.product!.brand"> · {{ item.product!.brand }}</span>
                </p>
              </div>
              <!-- Remove button -->
              <button
                class="p-1.5 sm:p-2 text-txt-muted dark:text-txt-dark-muted hover:text-txt transition-colors flex-shrink-0"
                @click="cart.removeFromCart(item.product!.id)"
                aria-label="Remove item"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <!-- Price + Quantity row -->
            <div class="flex items-center justify-between mt-3 gap-4">
              <div class="flex items-center gap-2">
                <span class="font-body font-light text-txt dark:text-txt-dark-primary text-base sm:text-lg">
                  ${{ getDiscountedPrice(item.product!.price, item.product!.discountPercentage).toFixed(2) }}
                </span>
                <span
                  v-if="item.product!.discountPercentage > 0"
                  class="font-body font-light text-xs sm:text-sm text-txt-muted dark:text-txt-dark-muted line-through"
                >
                  ${{ item.product!.price.toFixed(2) }}
                </span>
              </div>

              <!-- Quantity controls -->
              <div class="flex items-center gap-3 sm:gap-4 border-b border-edge dark:border-edge-dark pb-1">
                <button
                  class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:text-txt-muted transition-colors font-light text-base sm:text-lg text-txt dark:text-txt-dark-primary"
                  @click="cart.updateQuantity(item.product!.id, item.quantity - 1)"
                >
                  −
                </button>
                <span class="w-6 sm:w-8 text-center font-body font-light text-base sm:text-lg text-txt dark:text-txt-dark-primary">{{ item.quantity }}</span>
                <button
                  class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:text-txt-muted transition-colors font-light text-base sm:text-lg text-txt dark:text-txt-dark-primary"
                  @click="cart.updateQuantity(item.product!.id, item.quantity + 1)"
                >
                  +
                </button>
              </div>

              <!-- Line total (visible on md+) -->
              <span class="hidden md:block font-body font-light text-txt dark:text-txt-dark-primary text-lg w-24 text-right">
                ${{ (getDiscountedPrice(item.product!.price, item.product!.discountPercentage) * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Continue shopping -->
        <router-link
          to="/"
          class="inline-flex items-center gap-2 text-txt-muted hover:text-txt dark:hover:text-txt-dark-primary font-body font-light text-xs tracking-[0.15em] uppercase transition-colors mt-8 sm:mt-10"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Continue Shopping
        </router-link>
      </div>

      <!-- Right: Order summary -->
      <div class="lg:col-span-1">
        <div class="sticky top-24 bg-transparent py-8 border-t border-edge dark:border-edge-dark lg:border-t-0 lg:border-l lg:pl-12 space-y-6">
          <h2 class="text-xs font-body font-normal tracking-[0.3em] uppercase text-txt-muted dark:text-txt-dark-muted">
            Order Summary
          </h2>

          <!-- Items breakdown -->
          <div class="space-y-3 text-sm font-body font-light">
            <div class="flex justify-between text-txt-secondary dark:text-txt-dark-secondary">
              <span>Items ({{ cart.itemCount }})</span>
              <span>$<span class="font-light">{{ subtotal.toFixed(2) }}</span></span>
            </div>
            <div v-if="totalSavings > 0" class="flex justify-between text-txt-secondary dark:text-txt-dark-secondary">
              <span>Savings</span>
              <span>−${{ totalSavings.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-txt-secondary dark:text-txt-dark-secondary">
              <span>Shipping</span>
              <span>
                {{ shippingCost === 0 ? 'Complimentary' : `$${shippingCost.toFixed(2)}` }}
              </span>
            </div>
            <p v-if="shippingCost > 0" class="text-xs tracking-[0.1em] uppercase text-txt-muted dark:text-txt-dark-muted">
              ${{ (50 - discountedSubtotal).toFixed(2) }} more for complimentary shipping
            </p>
          </div>

          <hr class="border-edge dark:border-edge-dark" />

          <!-- Total -->
          <div class="flex justify-between items-baseline pt-4">
            <span class="text-xs tracking-[0.2em] uppercase text-txt-muted dark:text-txt-dark-muted">Total</span>
            <span class="font-display font-light text-2xl text-txt dark:text-txt-dark-primary">
              ${{ finalTotal.toFixed(2) }}
            </span>
          </div>

          <!-- Checkout button -->
          <MagneticButton @click="checkout">
            Proceed to Checkout
          </MagneticButton>

          <!-- Clear cart -->
          <button
            class="w-full text-center text-xs tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted hover:text-txt dark:hover:text-txt-dark-primary font-body font-light transition-colors"
            @click="cart.clearCart()"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
