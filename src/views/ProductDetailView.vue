<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorState from '../components/ErrorState.vue'
import StarRating from '../components/StarRating.vue'
import Badge from '../components/Badge.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cart = useCartStore()

const product = ref<Product | undefined>(undefined)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedImage = ref(0)
const quantity = ref(1)

const productId = computed(() => Number(route.params.id))

async function loadProduct() {
  loading.value = true
  error.value = null
  await productsStore.fetchAll()
  const found = productsStore.getProductById(productId.value)
  if (found) {
    product.value = found
    selectedImage.value = 0
    quantity.value = 1
  } else {
    error.value = 'Product not found'
  }
  loading.value = false
}

const discountedPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price * (1 - product.value.discountPercentage / 100)
})

const inCart = computed(() => {
  if (!product.value) return false
  return cart.getQuantity(product.value.id) > 0
})

const stockVariant = computed(() => {
  if (!product.value) return 'default'
  if (product.value.stock > 50) return 'success'
  if (product.value.stock > 10) return 'warning'
  return 'danger'
})

const stockLabel = computed(() => {
  if (!product.value) return ''
  if (product.value.stock > 50) return 'In Stock'
  if (product.value.stock > 10) return `Only ${product.value.stock} left`
  if (product.value.stock > 0) return `Low Stock: ${product.value.stock}`
  return 'Out of Stock'
})

function addToCart() {
  if (!product.value) return
  const success = cart.addToCart(product.value.id, quantity.value)
  if (!success) {
    // Toast handles showing the error, and router pushes to login inside addToCart
  }
}

// Rating distribution for reviews
const ratingDistribution = computed(() => {
  if (!product.value?.reviews) return []
  const dist = [0, 0, 0, 0, 0]
  product.value.reviews.forEach((r) => {
    const idx = Math.min(Math.max(Math.round(r.rating) - 1, 0), 4)
    dist[idx]++
  })
  return dist.reverse() // 5 stars first
})

onMounted(loadProduct)
watch(() => route.params.id, loadProduct)
</script>

<template>
  <div class="min-h-[80vh] pb-24 md:pb-20">
    <LoadingSpinner v-if="loading" />
    
    <ErrorState
      v-else-if="error || !product"
      :message="error || 'Product not found'"
      :on-retry="() => router.push('/')"
      retry-label="Back to Shop"
    />

    <div v-else class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-12">
      <!-- Breadcrumb -->
      <nav class="mb-6 sm:mb-8 lg:mb-12 text-xs font-body font-light tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted flex items-center gap-2 overflow-x-auto">
        <RouterLink to="/" class="hover:text-txt dark:hover:text-txt-dark-primary transition-colors">Home</RouterLink>
        <span>/</span>
        <RouterLink
          :to="`/category/${product.category}`"
          class="hover:text-txt dark:hover:text-txt-dark-primary transition-colors"
        >
          {{ product.category.replace(/-/g, ' ') }}
        </RouterLink>
        <span>/</span>
        <span class="text-txt-secondary dark:text-txt-dark-secondary truncate">{{ product.title }}</span>
      </nav>

      <div class="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-20">
        <!-- Left: Images -->
        <div class="space-y-4">
          <div class="lg:sticky lg:top-24">
            <!-- Main image -->
            <div class="aspect-square overflow-hidden bg-surface-raised dark:bg-surface-dark-raised flex items-center justify-center">
              <img
                :src="product.images[selectedImage] || product.thumbnail"
                :alt="product.title"
                class="w-full h-full object-contain transition-opacity duration-300"
              />
            </div>

            <!-- Thumbnail strip -->
            <div v-if="product.images && product.images.length > 1" class="flex gap-3 sm:gap-4 mt-4 sm:mt-6 overflow-x-auto pb-4 -mx-1 px-1">
              <button
                v-for="(img, i) in product.images"
                :key="i"
                class="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden transition-all duration-200 bg-transparent"
                :class="selectedImage === i ? 'border-b-2 border-txt dark:border-txt-dark-primary' : 'border-b-2 border-transparent opacity-60 hover:opacity-100'"
                @click="selectedImage = i"
              >
                <img :src="img" :alt="`${product.title} image ${i + 1}`" class="w-full h-full object-contain" />
              </button>
            </div>

            <!-- Badges -->
            <div class="flex flex-wrap gap-2 mt-4 sm:mt-6" v-if="product.availabilityStatus || product.shippingInformation">
              <Badge v-if="product.availabilityStatus" :label="product.availabilityStatus" :variant="stockVariant as 'default' | 'success' | 'warning' | 'danger'" />
              <span class="text-sm text-txt-muted dark:text-txt-dark-muted flex items-center">{{ stockLabel }}</span>
              <Badge v-if="product.shippingInformation" :label="product.shippingInformation" />
            </div>
          </div>
        </div>

        <!-- Right: Details -->
        <div class="space-y-8 lg:pt-4">
          <!-- Title -->
          <h1 class="font-display text-2xl sm:text-3xl md:text-4xl font-light text-txt dark:text-txt-dark-primary leading-tight tracking-tight">
            {{ product.title }}
          </h1>

          <!-- Rating -->
          <StarRating :rating="product.rating" :count="product.reviews?.length" />

          <!-- Price -->
          <div class="flex items-center gap-4">
            <span class="font-body font-light text-3xl sm:text-4xl text-txt dark:text-txt-dark-primary">
              ${{ discountedPrice.toFixed(2) }}
            </span>
            <span
              v-if="product.discountPercentage > 0"
              class="font-body font-light text-xl text-txt-muted dark:text-txt-dark-muted line-through"
            >
              ${{ product.price.toFixed(2) }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-txt-secondary dark:text-txt-dark-secondary leading-relaxed font-body font-light text-base sm:text-lg">
            {{ product.description }}
          </p>

          <!-- Tags -->
          <div v-if="product.tags?.length" class="flex flex-wrap gap-3">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="text-xs uppercase tracking-widest text-txt-muted dark:text-txt-dark-muted"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Quantity selector -->
          <div class="flex items-center gap-4 sm:gap-6 pt-4 sm:pt-6">
            <span class="text-xs font-body font-normal tracking-[0.2em] uppercase text-txt-muted dark:text-txt-dark-muted">Quantity</span>
            <div class="flex items-center gap-4 border-b border-edge dark:border-edge-dark pb-1">
              <button
                class="w-8 h-8 flex items-center justify-center hover:text-txt-muted transition-colors font-light text-lg text-txt dark:text-txt-dark-primary"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                −
              </button>
              <span class="w-8 text-center font-body font-light text-lg">{{ quantity }}</span>
              <button
                class="w-8 h-8 flex items-center justify-center hover:text-txt-muted transition-colors font-light text-lg text-txt dark:text-txt-dark-primary"
                @click="quantity = Math.min(product.stock, quantity + 1)"
              >
                +
              </button>
            </div>
          </div>

          <!-- Add to Cart -->
          <button
            class="w-full py-4 sm:py-5 text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors"
            :class="inCart ? 'bg-transparent border border-txt text-txt hover:bg-surface-raised dark:hover:bg-surface-dark-raised' : 'bg-txt text-surface hover:bg-txt-secondary dark:bg-txt-dark-primary dark:text-surface-dark dark:hover:bg-txt-dark-secondary'"
            :disabled="product.stock === 0"
            @click="addToCart"
          >
            <template v-if="inCart">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              In Cart — Add More
            </template>
            <template v-else>
              Add to Cart
            </template>
          </button>

          <!-- Divider -->
          <hr class="border-edge dark:border-edge-dark my-4" />

          <!-- Product details grid -->
          <div class="grid grid-cols-2 gap-4 sm:gap-6 text-sm">
            <div v-if="product.brand">
              <span class="text-xs tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted font-body">Brand</span>
              <p class="font-body font-light text-txt dark:text-txt-dark-primary mt-1.5">{{ product.brand }}</p>
            </div>
            <div v-if="product.sku">
              <span class="text-xs tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted font-body">SKU</span>
              <p class="font-mono font-light text-txt dark:text-txt-dark-primary mt-1.5">{{ product.sku }}</p>
            </div>
            <div v-if="product.weight">
              <span class="text-xs tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted font-body">Weight</span>
              <p class="font-body font-light text-txt dark:text-txt-dark-primary mt-1.5">{{ product.weight }}g</p>
            </div>
            <div v-if="product.dimensions">
              <span class="text-xs tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted font-body">Dimensions</span>
              <p class="font-body font-light text-txt dark:text-txt-dark-primary mt-1.5">
                {{ product.dimensions.width }} × {{ product.dimensions.height }} × {{ product.dimensions.depth }} cm
              </p>
            </div>
            <div v-if="product.warrantyInformation">
              <span class="text-xs tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted font-body">Warranty</span>
              <p class="font-body font-light text-txt dark:text-txt-dark-primary mt-1.5">{{ product.warrantyInformation }}</p>
            </div>
            <div v-if="product.returnPolicy">
              <span class="text-xs tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted font-body">Return Policy</span>
              <p class="font-body font-light text-txt dark:text-txt-dark-primary mt-1.5">{{ product.returnPolicy }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <section v-if="product.reviews?.length" class="mt-20 border-t border-edge dark:border-edge-dark pt-20">
        <h2 class="text-xs font-body font-normal tracking-[0.3em] uppercase text-txt-muted dark:text-txt-dark-muted mb-10">Customer Reviews</h2>

        <!-- Rating summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          <div class="flex flex-col items-center justify-center py-8">
            <span class="font-display text-5xl font-light text-txt dark:text-txt-dark-primary">{{ product.rating.toFixed(1) }}</span>
            <StarRating :rating="product.rating" class="mt-3" />
            <span class="text-xs tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted mt-3 font-body">
              {{ product.reviews.length }} reviews
            </span>
          </div>

          <!-- Rating bars -->
          <div class="md:col-span-2 space-y-3 flex flex-col justify-center">
            <div
              v-for="(count, i) in ratingDistribution"
              :key="i"
              class="flex items-center gap-3"
            >
              <span class="text-xs font-body font-light w-12 text-right text-txt-secondary dark:text-txt-dark-secondary">
                {{ 5 - i }}★
              </span>
              <div class="flex-1 h-[2px] bg-edge dark:bg-edge-dark overflow-hidden">
                <div
                  class="h-full bg-txt dark:bg-txt-dark-primary transition-all duration-500"
                  :style="{ width: `${product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0}%` }"
                />
              </div>
              <span class="text-xs font-body font-light w-8 text-txt-muted dark:text-txt-dark-muted">
                {{ count }}
              </span>
            </div>
          </div>
        </div>

        <!-- Review cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div
            v-for="(review, i) in product.reviews"
            :key="i"
            class="border-t border-edge dark:border-edge-dark py-8 px-2"
          >
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="font-body font-light text-sm text-txt dark:text-txt-dark-primary">
                  {{ review.reviewerName }}
                </span>
                <span class="text-xs tracking-[0.1em] text-txt-muted dark:text-txt-dark-muted ml-3 font-body">
                  {{ new Date(review.date).toLocaleDateString() }}
                </span>
              </div>
              <StarRating :rating="review.rating" />
            </div>
            <p class="text-sm text-txt-secondary dark:text-txt-dark-secondary font-body font-light leading-relaxed">
              {{ review.comment }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
