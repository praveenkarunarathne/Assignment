<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProductById } from '@/services/api'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import StarRating from '@/components/ui/StarRating.vue'
import Badge from '@/components/ui/Badge.vue'
import SkeletonDetail from '@/components/ui/SkeletonDetail.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import type { Product } from '@/types'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const toast = useToast()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedImage = ref(0)
const quantity = ref(1)

const discountedPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price * (1 - product.value.discountPercentage / 100)
})

const inCart = computed(() => product.value ? cart.isInCart(product.value.id) : false)

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

const auth = useAuthStore()

function addToCart() {
  if (!product.value) return
  if (!auth.isLoggedIn) {
    toast.error('Please login to add items to cart')
    router.push('/login')
    return
  }
  for (let i = 0; i < quantity.value; i++) {
    cart.addItem(product.value)
  }
  toast.success(`${product.value.title} added to cart!`)
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

onMounted(async () => {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    error.value = 'Invalid product ID'
    loading.value = false
    return
  }
  try {
    product.value = await fetchProductById(id)
  } catch {
    error.value = 'Product not found'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading -->
    <SkeletonDetail v-if="loading" />

    <!-- Error -->
    <EmptyState
      v-else-if="error || !product"
      title="Product Not Found"
      description="The product you're looking for doesn't exist or has been removed."
      action-label="Back to Shop"
      @action="router.push('/products')"
    />

    <!-- Product detail -->
    <template v-else>
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-ink-muted dark:text-chalk-muted mb-8 font-body">
        <router-link to="/" class="hover:text-accent transition-colors">Home</router-link>
        <span>›</span>
        <router-link to="/products" class="hover:text-accent transition-colors">Products</router-link>
        <span>›</span>
        <router-link
          :to="{ name: 'products', query: { category: product.category } }"
          class="hover:text-accent transition-colors capitalize"
        >
          {{ product.category }}
        </router-link>
        <span>›</span>
        <span class="text-ink-primary dark:text-chalk-primary line-clamp-1">{{ product.title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Left: Images -->
        <div class="space-y-4">
          <div class="lg:sticky lg:top-20">
            <!-- Main image -->
            <div class="relative aspect-square rounded-3xl overflow-hidden bg-light-elevated dark:bg-dark-elevated">
              <img
                :src="product.images[selectedImage] || product.thumbnail"
                :alt="product.title"
                class="w-full h-full object-cover transition-opacity duration-300"
              />
              <!-- Discount badge -->
              <span
                v-if="product.discountPercentage > 0"
                class="absolute top-4 left-4 bg-accent text-white text-sm font-mono font-medium px-3 py-1.5 rounded-full"
              >
                -{{ Math.round(product.discountPercentage) }}%
              </span>
            </div>

            <!-- Thumbnail strip -->
            <div v-if="product.images.length > 1" class="flex gap-3 mt-4">
              <button
                v-for="(img, i) in product.images"
                :key="i"
                class="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200"
                :class="selectedImage === i ? 'border-accent shadow-accent' : 'border-transparent hover:border-light-border dark:hover:border-dark-border'"
                @click="selectedImage = i"
              >
                <img :src="img" :alt="`${product.title} image ${i + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>

            <!-- Badges -->
            <div class="flex flex-wrap gap-2 mt-4">
              <Badge :label="product.availabilityStatus" :variant="stockVariant as 'default' | 'success' | 'warning' | 'danger'" />
              <Badge :label="product.shippingInformation" />
            </div>
          </div>
        </div>

        <!-- Right: Details -->
        <div class="space-y-6">
          <!-- Title -->
          <h1 class="font-display text-3xl md:text-4xl font-bold text-ink-primary dark:text-chalk-primary leading-tight">
            {{ product.title }}
          </h1>

          <!-- Rating -->
          <StarRating :rating="product.rating" :count="product.reviews?.length" />

          <!-- Price -->
          <div class="flex items-center gap-3">
            <span class="font-mono font-bold text-3xl text-accent">
              ${{ discountedPrice.toFixed(2) }}
            </span>
            <span
              v-if="product.discountPercentage > 0"
              class="font-mono text-lg text-ink-muted dark:text-chalk-muted line-through"
            >
              ${{ product.price.toFixed(2) }}
            </span>
            <Badge
              v-if="product.discountPercentage > 0"
              :label="`Save $${(product.price - discountedPrice).toFixed(2)}`"
              variant="success"
            />
          </div>

          <!-- Description -->
          <p class="text-ink-secondary dark:text-chalk-secondary leading-relaxed font-body">
            {{ product.description }}
          </p>

          <!-- Tags -->
          <div v-if="product.tags?.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="badge bg-light-elevated dark:bg-dark-elevated text-ink-secondary dark:text-chalk-secondary"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Stock indicator -->
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-emerald-500': product.stock > 50,
                'bg-amber-500': product.stock > 10 && product.stock <= 50,
                'bg-red-500': product.stock <= 10,
              }"
            />
            <span class="text-sm font-body" :class="{
              'text-emerald-600 dark:text-emerald-400': product.stock > 50,
              'text-amber-600 dark:text-amber-400': product.stock > 10 && product.stock <= 50,
              'text-red-600 dark:text-red-400': product.stock <= 10,
            }">
              {{ stockLabel }}
            </span>
          </div>

          <!-- Quantity selector -->
          <div class="flex items-center gap-4">
            <span class="text-sm font-body font-medium text-ink-primary dark:text-chalk-primary">Quantity</span>
            <div class="flex items-center gap-2 bg-light-elevated dark:bg-dark-elevated rounded-2xl p-1">
              <button
                class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-light-border dark:hover:bg-dark-border transition-colors font-bold"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                −
              </button>
              <span class="w-10 text-center font-mono font-semibold">{{ quantity }}</span>
              <button
                class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-light-border dark:hover:bg-dark-border transition-colors font-bold"
                @click="quantity = Math.min(product.stock, quantity + 1)"
              >
                +
              </button>
            </div>
          </div>

          <!-- Add to Cart -->
          <button
            class="w-full py-4 text-base flex items-center justify-center gap-2"
            :class="inCart ? 'btn-secondary' : 'btn-primary'"
            :disabled="product.stock === 0"
            @click="addToCart"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {{ inCart ? `In Cart — Add More` : `Add to Cart — $${(discountedPrice * quantity).toFixed(2)}` }}
          </button>

          <!-- Divider -->
          <hr class="border-light-border dark:border-dark-border" />

          <!-- Product details grid -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div v-if="product.brand">
              <span class="text-ink-muted dark:text-chalk-muted font-body">Brand</span>
              <p class="font-body font-medium text-ink-primary dark:text-chalk-primary mt-1">{{ product.brand }}</p>
            </div>
            <div>
              <span class="text-ink-muted dark:text-chalk-muted font-body">SKU</span>
              <p class="font-mono text-ink-primary dark:text-chalk-primary mt-1">{{ product.sku }}</p>
            </div>
            <div>
              <span class="text-ink-muted dark:text-chalk-muted font-body">Weight</span>
              <p class="font-body font-medium text-ink-primary dark:text-chalk-primary mt-1">{{ product.weight }}g</p>
            </div>
            <div>
              <span class="text-ink-muted dark:text-chalk-muted font-body">Dimensions</span>
              <p class="font-body font-medium text-ink-primary dark:text-chalk-primary mt-1">
                {{ product.dimensions.width }} × {{ product.dimensions.height }} × {{ product.dimensions.depth }} cm
              </p>
            </div>
            <div>
              <span class="text-ink-muted dark:text-chalk-muted font-body">Warranty</span>
              <p class="font-body font-medium text-ink-primary dark:text-chalk-primary mt-1">{{ product.warrantyInformation }}</p>
            </div>
            <div>
              <span class="text-ink-muted dark:text-chalk-muted font-body">Return Policy</span>
              <p class="font-body font-medium text-ink-primary dark:text-chalk-primary mt-1">{{ product.returnPolicy }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <section v-if="product.reviews?.length" class="mt-16">
        <h2 class="section-title mb-8">Customer Reviews</h2>

        <!-- Rating summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div class="flex flex-col items-center justify-center bg-light-surface dark:bg-dark-surface rounded-3xl p-8 shadow-card">
            <span class="font-display text-5xl font-bold text-accent">{{ product.rating.toFixed(1) }}</span>
            <StarRating :rating="product.rating" class="mt-2" />
            <span class="text-sm text-ink-muted dark:text-chalk-muted mt-2 font-body">
              Based on {{ product.reviews.length }} reviews
            </span>
          </div>

          <!-- Rating bars -->
          <div class="md:col-span-2 space-y-2">
            <div
              v-for="(count, i) in ratingDistribution"
              :key="i"
              class="flex items-center gap-3"
            >
              <span class="text-sm font-mono w-12 text-right text-ink-secondary dark:text-chalk-secondary">
                {{ 5 - i }}★
              </span>
              <div class="flex-1 h-3 bg-light-elevated dark:bg-dark-elevated rounded-full overflow-hidden">
                <div
                  class="h-full bg-accent rounded-full transition-all duration-500"
                  :style="{ width: `${product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0}%` }"
                />
              </div>
              <span class="text-sm font-mono w-8 text-ink-muted dark:text-chalk-muted">
                {{ count }}
              </span>
            </div>
          </div>
        </div>

        <!-- Review cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(review, i) in product.reviews"
            :key="i"
            class="bg-light-surface dark:bg-dark-surface rounded-3xl p-6 shadow-card"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="font-body font-semibold text-sm text-ink-primary dark:text-chalk-primary">
                  {{ review.reviewerName }}
                </span>
                <span class="text-xs text-ink-muted dark:text-chalk-muted ml-2 font-body">
                  {{ new Date(review.date).toLocaleDateString() }}
                </span>
              </div>
              <StarRating :rating="review.rating" />
            </div>
            <p class="text-sm text-ink-secondary dark:text-chalk-secondary font-body leading-relaxed">
              {{ review.comment }}
            </p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
