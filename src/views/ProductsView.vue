<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import SearchBar from '@/components/ui/SearchBar.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import ProductFilters from '@/components/product/ProductFilters.vue'
import CategoryChips from '@/components/product/CategoryChips.vue'
import type { FilterState } from '@/types'

const route = useRoute()
const router = useRouter()
const { products, categories, loading, error, total, loadProducts, loadCategories, searchAndFilter } = useProducts()

const filters = ref<FilterState>({
  category: 'all',
  searchQuery: '',
  sortBy: 'default',
  minPrice: 0,
  maxPrice: 10000,
})

const filtersOpen = ref(false)

// Read URL params on mount
onMounted(async () => {
  if (route.query.q) filters.value.searchQuery = String(route.query.q)
  if (route.query.category) filters.value.category = String(route.query.category)

  await loadCategories()
  await searchAndFilter(filters.value)
})

// Debounced filter watcher
let filterTimer: ReturnType<typeof setTimeout>
watch(filters, (val) => {
  clearTimeout(filterTimer)
  filterTimer = setTimeout(() => {
    searchAndFilter(val)
    // Update URL
    router.replace({
      query: {
        ...(val.searchQuery ? { q: val.searchQuery } : {}),
        ...(val.category !== 'all' ? { category: val.category } : {}),
      },
    })
  }, 300)
}, { deep: true })

function clearFilters() {
  filters.value = {
    category: 'all',
    searchQuery: '',
    sortBy: 'default',
    minPrice: 0,
    maxPrice: 10000,
  }
}

const hasActiveFilters = ref(false)
watch(filters, (val) => {
  hasActiveFilters.value = val.category !== 'all' || val.searchQuery !== '' || val.sortBy !== 'default' || val.minPrice > 0 || val.maxPrice < 10000
}, { deep: true, immediate: true })
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="section-title">Shop</h1>
      <p class="text-ink-secondary dark:text-chalk-secondary mt-2 font-body">
        Showing {{ products.length }} of {{ total }} products
      </p>
    </div>

    <div class="flex gap-8">
      <!-- Sidebar (desktop) -->
      <aside class="hidden lg:block w-64 flex-shrink-0">
        <div class="sticky top-20 space-y-6">
          <h3 class="font-display text-lg font-bold text-ink-primary dark:text-chalk-primary">Filters</h3>
          <ProductFilters
            :model-value="filters"
            @update:model-value="(val: FilterState) => filters = val"
          />
          <div class="pt-4">
            <h4 class="font-body font-semibold text-sm text-ink-primary dark:text-chalk-primary mb-3">Categories</h4>
            <div class="flex flex-col gap-2">
              <button
                class="text-left text-sm font-body transition-colors px-3 py-2 rounded-xl"
                :class="filters.category === 'all' ? 'bg-accent text-white' : 'text-ink-secondary dark:text-chalk-secondary hover:bg-light-elevated dark:hover:bg-dark-elevated'"
                @click="filters.category = 'all'"
              >
                All
              </button>
              <button
                v-for="cat in categories"
                :key="cat.slug"
                class="text-left text-sm font-body transition-colors px-3 py-2 rounded-xl capitalize"
                :class="filters.category === cat.slug ? 'bg-accent text-white' : 'text-ink-secondary dark:text-chalk-secondary hover:bg-light-elevated dark:hover:bg-dark-elevated'"
                @click="filters.category = cat.slug"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-w-0">
        <!-- Search -->
        <SearchBar
          :model-value="filters.searchQuery"
          @update:model-value="(val: string) => filters.searchQuery = val"
          class="mb-6"
        />

        <!-- Mobile category chips -->
        <div class="lg:hidden mb-6">
          <CategoryChips
            :categories="categories"
            :model-value="filters.category"
            @update:model-value="(val: string) => filters.category = val"
          />
        </div>

        <!-- Active filters / Mobile sort -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2 flex-wrap">
            <span v-if="filters.searchQuery" class="badge bg-accent/10 text-accent">
              "{{ filters.searchQuery }}"
              <button @click="filters.searchQuery = ''" class="ml-1">×</button>
            </span>
            <span v-if="filters.category !== 'all'" class="badge bg-accent/10 text-accent capitalize">
              {{ filters.category }}
              <button @click="filters.category = 'all'" class="ml-1">×</button>
            </span>
            <button
              v-if="hasActiveFilters"
              class="text-xs text-accent hover:text-accent-dark font-body transition-colors"
              @click="clearFilters"
            >
              Clear all
            </button>
          </div>

          <!-- Mobile sort -->
          <div class="lg:hidden">
            <select
              v-model="filters.sortBy"
              class="input-field text-sm py-2 pr-8"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="rating-desc">Top Rated</option>
              <option value="name-asc">A–Z</option>
            </select>
          </div>
        </div>

        <!-- Product grid -->
        <ProductGrid
          :products="products"
          :loading="loading"
          @clear-filters="clearFilters"
        />
      </div>
    </div>
  </div>
</template>
