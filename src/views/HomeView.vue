<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import ProductFilters from '../components/ProductFilters.vue'
import ProductGrid from '../components/ProductGrid.vue'
import ErrorState from '../components/ErrorState.vue'
import type { FilterState } from '../types'

const products = useProductsStore()
const route = useRoute()
const router = useRouter()

// Mobile filter drawer state
const mobileFilterOpen = ref(false)

function openMobileFilter() {
  mobileFilterOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeMobileFilter() {
  mobileFilterOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  products.fetchAll()
  if (route.query.q) products.setSearch(String(route.query.q))
  if (route.params.category || route.query.category) {
    products.setCategory(String(route.params.category || route.query.category))
  } else {
    products.setCategory('')
  }
})

watch(() => route.params.category, (newCat) => {
  products.setCategory((newCat as string) || '')
})

watch(() => products.selectedCategory, (val) => {
  if (val) {
    router.push({ name: 'category', params: { category: val }, query: route.query })
  } else {
    router.push({ path: '/', query: route.query })
  }
})

watch(() => products.searchQuery, (val) => {
  router.replace({ query: { ...route.query, q: val || undefined } })
})

function formatCategory(cat: string): string {
  return cat
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const hasActiveFilters = computed(() => {
  const fs = products.filterState
  return products.selectedCategory !== '' || 
         products.searchQuery !== '' || 
         fs.sortBy !== 'default' || 
         fs.minPrice > 0 || 
         fs.maxPrice < 10000
})

function clearFilters() {
  products.setCategory('')
  products.setSearch('')
  products.filterState = {
    sortBy: 'default',
    minPrice: 0,
    maxPrice: 10000,
  }
}
</script>

<template>
  <div>
    <!-- Hero — vertical stack on mobile, horizontal split on desktop -->
    <section class="border-b border-edge dark:border-edge-dark grid grid-cols-1 md:grid-cols-2 min-h-[100svh] md:h-screen">
      <!-- Left: Typography -->
      <div class="px-6 sm:px-8 md:px-16 lg:px-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-edge dark:border-edge-dark min-h-[50svh] md:min-h-0 md:h-full pt-20 pb-10 md:pt-16 md:pb-0">
        <div class="max-w-2xl w-full">
          <div class="mask-container mb-6 md:mb-8">
            <p class="animate-mask-up text-micro text-txt-muted dark:text-txt-dark-muted">New Arrivals</p>
          </div>
          
          <h1 class="text-[clamp(2.5rem,8vw,9rem)] leading-[0.9] md:leading-[0.85] tracking-tight font-serif font-light text-txt dark:text-txt-dark-primary">
            <div class="mask-container block">
              <span class="animate-mask-up inline-block" style="animation-delay: 0.1s">Curated</span>
            </div>
            <div class="mask-container block">
              <span class="animate-mask-up italic inline-block" style="animation-delay: 0.2s">products</span>
            </div>
            <div class="mask-container block">
              <span class="animate-mask-up inline-block" style="animation-delay: 0.3s">that inspire.</span>
            </div>
          </h1>
          
          <div class="mask-container block mt-6 md:mt-10">
            <p class="animate-mask-up inline-block text-sm md:text-base text-gray-600 dark:text-gray-300 font-body leading-relaxed max-w-md font-light" style="animation-delay: 0.4s">
              A handpicked selection of premium goods for the modern lifestyle.
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Anchor Image -->
      <div class="relative w-full min-h-[50svh] md:min-h-0 md:h-full bg-neutral-100 dark:bg-[#111] overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Editorial Campaign" 
          class="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>
    </section>

    <!-- Products section -->
    <section class="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28 pb-24 md:pb-20 lg:pb-28">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-20">
        <!-- Sidebar (desktop only) -->
        <aside class="hidden lg:block w-56 flex-shrink-0">
          <div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4 space-y-10 pb-8">
            <ProductFilters />
            
            <div class="pt-6 border-t border-edge dark:border-edge-dark">
              <h4 class="text-xs font-body font-normal tracking-[0.2em] uppercase text-txt-muted dark:text-txt-dark-muted mb-5">Categories</h4>
              <div class="flex flex-col gap-1">
                <button
                  class="text-left text-sm font-body font-light transition-colors py-1.5"
                  :class="!products.selectedCategory ? 'text-txt dark:text-txt-dark-primary' : 'text-txt-muted dark:text-txt-dark-muted hover:text-txt dark:hover:text-txt-dark-primary'"
                  @click="products.setCategory('')"
                >
                  All
                </button>
                <button
                  v-for="cat in products.categories"
                  :key="cat"
                  class="text-left text-sm font-body font-light transition-colors py-1.5"
                  :class="products.selectedCategory === cat ? 'text-txt dark:text-txt-dark-primary' : 'text-txt-muted dark:text-txt-dark-muted hover:text-txt dark:hover:text-txt-dark-primary'"
                  @click="products.setCategory(cat)"
                >
                  {{ formatCategory(cat) }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main content -->
        <div class="flex-1 min-w-0">
          <!-- Mobile: Horizontal category chips -->
          <div class="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto">
            <div class="flex gap-2 pb-2">
              <button
                class="flex-shrink-0 px-4 py-2 text-xs tracking-[0.15em] uppercase font-body font-light border transition-colors whitespace-nowrap"
                :class="!products.selectedCategory 
                  ? 'border-txt dark:border-txt-dark-primary text-txt dark:text-txt-dark-primary bg-txt/5 dark:bg-txt-dark-primary/5'
                  : 'border-edge dark:border-edge-dark text-txt-muted dark:text-txt-dark-muted'"
                @click="products.setCategory('')"
              >
                All
              </button>
              <button
                v-for="cat in products.categories"
                :key="cat"
                class="flex-shrink-0 px-4 py-2 text-xs tracking-[0.15em] uppercase font-body font-light border transition-colors whitespace-nowrap"
                :class="products.selectedCategory === cat
                  ? 'border-txt dark:border-txt-dark-primary text-txt dark:text-txt-dark-primary bg-txt/5 dark:bg-txt-dark-primary/5'
                  : 'border-edge dark:border-edge-dark text-txt-muted dark:text-txt-dark-muted'"
                @click="products.setCategory(cat)"
              >
                {{ formatCategory(cat) }}
              </button>
            </div>
          </div>

          <!-- Toolbar: active filters + sort + mobile filter button -->
          <div class="flex items-center justify-between mb-6 md:mb-10 gap-3">
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
              <span v-if="products.searchQuery" class="badge border border-edge dark:border-edge-dark text-txt dark:text-txt-dark-primary text-xs sm:text-xs">
                "{{ products.searchQuery }}"
                <button @click="products.setSearch('')" class="ml-1 hover:text-txt-muted">×</button>
              </span>
              <span v-if="products.selectedCategory" class="badge border border-edge dark:border-edge-dark text-txt dark:text-txt-dark-primary text-xs sm:text-xs hidden lg:inline-flex">
                {{ formatCategory(products.selectedCategory) }}
                <button @click="products.setCategory('')" class="ml-1 hover:text-txt-muted">×</button>
              </span>
              <button
                v-if="hasActiveFilters"
                class="text-xs text-txt-muted hover:text-txt dark:hover:text-txt-dark-primary font-body tracking-[0.1em] uppercase transition-colors"
                @click="clearFilters"
              >
                Clear all
              </button>
            </div>

            <div class="flex items-center gap-3 flex-shrink-0">
              <!-- Mobile filter button -->
              <button
                class="lg:hidden flex items-center gap-2 px-3 py-2 text-xs tracking-[0.15em] uppercase font-body font-light border border-edge dark:border-edge-dark text-txt dark:text-txt-dark-primary hover:border-txt dark:hover:border-txt-dark-primary transition-colors"
                @click="openMobileFilter"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="8" y2="18" />
                </svg>
                Filters
              </button>
              <!-- Mobile sort -->
              <select
                v-model="products.filterState.sortBy"
                class="lg:hidden input-field text-xs sm:text-sm py-2 max-w-[130px]"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="rating-desc">Top Rated</option>
                <option value="name-asc">A–Z</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between mb-6 md:mb-10">
            <span class="text-xs font-body font-light tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted">
              {{ products.filteredProducts.length }} products
            </span>
          </div>

          <ErrorState
            v-if="products.error"
            :message="products.error"
            :on-retry="() => products.fetchAll()"
          />

          <div v-else>
            <ProductGrid />
          </div>
        </div>
      </div>
    </section>

    <!-- Mobile Filter Drawer (off-canvas) -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="mobileFilterOpen" class="fixed inset-0 z-[60] lg:hidden">
          <!-- Backdrop -->
          <div 
            class="absolute inset-0 bg-black/40 backdrop-blur-sm"
            @click="closeMobileFilter"
          />
          
          <!-- Drawer panel -->
          <div class="absolute inset-y-0 right-0 w-full max-w-xs bg-surface dark:bg-surface-dark border-l border-edge dark:border-edge-dark shadow-xl flex flex-col drawer-panel">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-edge dark:border-edge-dark">
              <h2 class="text-xs font-body font-normal tracking-[0.3em] uppercase text-txt dark:text-txt-dark-primary">Filters</h2>
              <button 
                class="p-1 text-txt-muted dark:text-txt-dark-muted hover:text-txt dark:hover:text-txt-dark-primary transition-colors"
                @click="closeMobileFilter"
                aria-label="Close filters"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Scrollable content -->
            <div class="flex-1 overflow-y-auto px-6 py-6 space-y-10">
              <ProductFilters />
              
              <div class="pt-6 border-t border-edge dark:border-edge-dark">
                <h4 class="text-xs font-body font-normal tracking-[0.2em] uppercase text-txt-muted dark:text-txt-dark-muted mb-5">Categories</h4>
                <div class="flex flex-col gap-1">
                  <button
                    class="text-left text-sm font-body font-light transition-colors py-2"
                    :class="!products.selectedCategory ? 'text-txt dark:text-txt-dark-primary' : 'text-txt-muted dark:text-txt-dark-muted'"
                    @click="products.setCategory(''); closeMobileFilter()"
                  >
                    All
                  </button>
                  <button
                    v-for="cat in products.categories"
                    :key="cat"
                    class="text-left text-sm font-body font-light transition-colors py-2"
                    :class="products.selectedCategory === cat ? 'text-txt dark:text-txt-dark-primary' : 'text-txt-muted dark:text-txt-dark-muted'"
                    @click="products.setCategory(cat); closeMobileFilter()"
                  >
                    {{ formatCategory(cat) }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-5 border-t border-edge dark:border-edge-dark">
              <button 
                class="btn-primary w-full text-xs py-3.5"
                @click="closeMobileFilter"
              >
                Show {{ products.filteredProducts.length }} Products
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Drawer transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
