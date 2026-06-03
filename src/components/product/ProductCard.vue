<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useToast } from '@/composables/useToast'
import StarRating from '@/components/ui/StarRating.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'

const props = defineProps<{
  product: Product
}>()

const cart = useCartStore()
const toast = useToast()

const discountedPrice = computed(() =>
  props.product.price * (1 - props.product.discountPercentage / 100)
)

const inCart = computed(() => cart.isInCart(props.product.id))

const auth = useAuthStore()
const router = useRouter()

function handleAddToCart(e: Event) {
  e.stopPropagation()
  if (!auth.isLoggedIn) {
    toast.error('Please login to add items to cart')
    router.push('/login')
    return
  }
  if (!inCart.value) {
    cart.addItem(props.product)
    toast.success(`${props.product.title} added to cart!`)
  }
}
</script>

<template>
  <div class="product-card group">
    <!-- Image wrapper -->
    <div class="relative aspect-[4/3] overflow-hidden bg-light-elevated dark:bg-dark-elevated">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <!-- Discount badge -->
      <span
        v-if="product.discountPercentage > 0"
        class="absolute top-3 left-3 bg-accent text-white text-xs font-mono font-medium px-2.5 py-1 rounded-full"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </span>
      <!-- Out of stock overlay -->
      <div
        v-if="product.stock === 0"
        class="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <span class="text-white font-body font-semibold text-sm bg-black/60 px-4 py-2 rounded-full">
          Out of Stock
        </span>
      </div>
      <!-- Quick add button (slides up on hover) -->
      <button
        v-if="product.stock > 0"
        class="absolute bottom-0 left-0 right-0 bg-accent text-white text-sm font-body font-medium py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        @click="handleAddToCart"
      >
        {{ inCart ? 'In Cart ✓' : 'Quick Add +' }}
      </button>
    </div>

    <!-- Card body -->
    <div class="p-4 space-y-2">
      <!-- Category -->
      <span class="text-xs text-ink-muted dark:text-chalk-muted uppercase tracking-wider font-body">
        {{ product.category }}
      </span>

      <!-- Title -->
      <h3 class="font-display font-semibold text-base text-ink-primary dark:text-chalk-primary line-clamp-2 leading-snug">
        {{ product.title }}
      </h3>

      <!-- Rating -->
      <StarRating :rating="product.rating" />

      <!-- Price row -->
      <div class="flex items-center justify-between pt-1">
        <div class="flex items-center gap-2">
          <span class="font-mono font-semibold text-accent text-lg">
            ${{ discountedPrice.toFixed(2) }}
          </span>
          <span
            v-if="product.discountPercentage > 0"
            class="font-mono text-sm text-ink-muted dark:text-chalk-muted line-through"
          >
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
        <span v-if="product.brand" class="text-xs text-ink-muted dark:text-chalk-muted font-body">
          {{ product.brand }}
        </span>
      </div>

      <!-- Add to Cart button -->
      <button
        class="w-full mt-2 flex items-center justify-center gap-2 text-sm"
        :class="inCart ? 'btn-secondary' : 'btn-primary'"
        :disabled="product.stock === 0"
        @click="handleAddToCart"
      >
        <svg v-if="!inCart" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ inCart ? 'In Cart' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>
