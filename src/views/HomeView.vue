<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
import { fetchProducts, fetchCategories } from '@/services/api'
import ProductGrid from '@/components/product/ProductGrid.vue'
import type { Product, Category } from '@/types'

const router = useRouter()

const heroProducts = ref<Product[]>([])
const trendingProducts = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)

// Intersection observer for scroll animations
const featuredSection = ref<HTMLElement | null>(null)
const featuredVisible = ref(false)
const trendingSection = ref<HTMLElement | null>(null)
const trendingVisible = ref(false)
const statsSection = ref<HTMLElement | null>(null)
const statsVisible = ref(false)
const whySection = ref<HTMLElement | null>(null)
const whyVisible = ref(false)

useIntersectionObserver(featuredSection, ([{ isIntersecting }]) => {
  if (isIntersecting) featuredVisible.value = true
})
useIntersectionObserver(trendingSection, ([{ isIntersecting }]) => {
  if (isIntersecting) trendingVisible.value = true
})
useIntersectionObserver(statsSection, ([{ isIntersecting }]) => {
  if (isIntersecting) statsVisible.value = true
})
useIntersectionObserver(whySection, ([{ isIntersecting }]) => {
  if (isIntersecting) whyVisible.value = true
})

const topCategories = computed(() => categories.value.slice(0, 8))

onMounted(async () => {
  try {
    const [productsData, catsData] = await Promise.all([
      fetchProducts(100),
      fetchCategories(),
    ])
    heroProducts.value = productsData.products.slice(0, 4)
    trendingProducts.value = [...productsData.products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8)
    categories.value = catsData
  } catch {
    // Fail silently
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/3 dark:from-accent/10 dark:via-transparent dark:to-transparent" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Text -->
        <div class="space-y-8 animate-fade-up">
          <div>
            <span class="badge bg-accent/10 text-accent mb-4 inline-block">New Season 2026</span>
            <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink-primary dark:text-chalk-primary leading-[1.1]">
              Discover<br />
              <span class="italic text-accent">Curated</span><br />
              Excellence
            </h1>
          </div>
          <p class="text-lg text-ink-secondary dark:text-chalk-secondary max-w-lg font-body leading-relaxed">
            Explore our handpicked collection of premium products designed to elevate your everyday lifestyle.
          </p>
          <div class="flex flex-wrap gap-4">
            <router-link to="/products" class="btn-primary text-base px-8 py-4">
              Shop Now
              <svg class="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
            <router-link to="/products?category=furniture" class="btn-secondary text-base px-8 py-4">
              View Collections
            </router-link>
          </div>

          <!-- Scroll indicator — flows naturally within left column -->
          <div class="flex flex-col items-center gap-2 animate-bounce">
            <span class="text-xs text-ink-muted dark:text-chalk-muted font-body">Scroll to explore</span>
            <svg class="w-5 h-5 text-ink-muted dark:text-chalk-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        <!-- Right: Bento Grid -->
        <div class="hidden lg:grid grid-cols-2 gap-4 animate-fade-up" style="animation-delay: 200ms">
          <div
            v-for="(product, i) in heroProducts"
            :key="product.id"
            :class="[
              'rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-card',
              i === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-square',
            ]"
            @click="router.push(`/products/${product.id}`)"
          >
            <img
              :src="product.thumbnail"
              :alt="product.title"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section ref="featuredSection" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div :class="['transition-all duration-700', featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <div class="text-center mb-12">
          <h2 class="section-title">Shop by Category</h2>
          <p class="text-ink-secondary dark:text-chalk-secondary mt-3 font-body">Browse our curated collections</p>
        </div>

        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
          <div
            v-for="(cat, index) in topCategories"
            :key="cat.slug"
            class="snap-start flex-shrink-0 w-40 md:w-48 cursor-pointer group"
            :style="{ animationDelay: `${index * 80}ms` }"
            @click="router.push({ name: 'products', query: { category: cat.slug } })"
          >
            <div class="bg-light-elevated dark:bg-dark-elevated rounded-3xl p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <div class="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span class="text-2xl">🛍️</span>
              </div>
              <h3 class="font-body font-semibold text-sm text-ink-primary dark:text-chalk-primary capitalize">
                {{ cat.name }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Products -->
    <section ref="trendingSection" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div :class="['transition-all duration-700', trendingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <div class="flex items-end justify-between mb-12">
          <div>
            <h2 class="section-title">Trending Now</h2>
            <p class="text-ink-secondary dark:text-chalk-secondary mt-3 font-body">Top-rated products our customers love</p>
          </div>
          <router-link to="/products" class="hidden md:inline-flex btn-secondary text-sm">
            View All →
          </router-link>
        </div>

        <ProductGrid
          :products="trendingProducts"
          :loading="loading"
        />

        <div class="text-center mt-10 md:hidden">
          <router-link to="/products" class="btn-primary">View All Products</router-link>
        </div>
      </div>
    </section>

    <!-- Stats Banner -->
    <section ref="statsSection" class="bg-accent py-16">
      <div
        :class="['max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center transition-all duration-700', statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
      >
        <div>
          <div class="font-display text-4xl md:text-5xl font-bold text-white">10,000+</div>
          <div class="text-white/80 font-body mt-2">Products</div>
        </div>
        <div>
          <div class="font-display text-4xl md:text-5xl font-bold text-white">500+</div>
          <div class="text-white/80 font-body mt-2">Brands</div>
        </div>
        <div>
          <div class="font-display text-4xl md:text-5xl font-bold text-white">4.8★</div>
          <div class="text-white/80 font-body mt-2">Average Rating</div>
        </div>
      </div>
    </section>

    <!-- Why Lumière -->
    <section ref="whySection" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div :class="['transition-all duration-700', whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <div class="text-center mb-12">
          <h2 class="section-title">Why Lumière?</h2>
          <p class="text-ink-secondary dark:text-chalk-secondary mt-3 font-body">What makes us different</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-light-surface dark:bg-dark-surface rounded-3xl p-8 text-center shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 mx-auto mb-4 bg-accent/10 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="font-display text-xl font-bold text-ink-primary dark:text-chalk-primary mb-2">
              Curated Selection
            </h3>
            <p class="text-ink-secondary dark:text-chalk-secondary text-sm font-body leading-relaxed">
              Every product is hand-picked by our team to ensure the highest quality and style.
            </p>
          </div>

          <div class="bg-light-surface dark:bg-dark-surface rounded-3xl p-8 text-center shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 mx-auto mb-4 bg-accent/10 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="font-display text-xl font-bold text-ink-primary dark:text-chalk-primary mb-2">
              Secure Checkout
            </h3>
            <p class="text-ink-secondary dark:text-chalk-secondary text-sm font-body leading-relaxed">
              Your data is protected with enterprise-grade encryption at every step.
            </p>
          </div>

          <div class="bg-light-surface dark:bg-dark-surface rounded-3xl p-8 text-center shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 mx-auto mb-4 bg-accent/10 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 class="font-display text-xl font-bold text-ink-primary dark:text-chalk-primary mb-2">
              Easy Returns
            </h3>
            <p class="text-ink-secondary dark:text-chalk-secondary text-sm font-body leading-relaxed">
              Not satisfied? Return any product within 30 days for a full refund.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
