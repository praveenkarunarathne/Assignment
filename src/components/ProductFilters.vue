<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProductsStore } from '../stores/products'
import type { SortOption } from '../types'

const products = useProductsStore()

const localMinPrice = ref(products.filterState.minPrice)
const localMaxPrice = ref(products.filterState.maxPrice)
const localSortBy = ref<SortOption>(products.filterState.sortBy)

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low–High', value: 'price-asc' },
  { label: 'Price: High–Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating-desc' },
  { label: 'A–Z', value: 'name-asc' },
]

function apply() {
  products.filterState.sortBy = localSortBy.value
  products.filterState.minPrice = localMinPrice.value
  products.filterState.maxPrice = localMaxPrice.value
}

function reset() {
  localMinPrice.value = 0
  localMaxPrice.value = 10000
  localSortBy.value = 'default'
  apply()
}

// Watch for external resets
watch(() => products.filterState, (newVal) => {
  localMinPrice.value = newVal.minPrice
  localMaxPrice.value = newVal.maxPrice
  localSortBy.value = newVal.sortBy
}, { deep: true })
</script>

<template>
  <div class="space-y-10">
    <!-- Sort -->
    <div>
      <label class="block text-xs font-body font-normal tracking-[0.2em] uppercase text-txt-muted dark:text-txt-dark-muted mb-3">
        Sort By
      </label>
      <select
        v-model="localSortBy"
        class="input-field"
        @change="apply"
      >
        <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- Price Range -->
    <div class="mb-10">
      <h3 class="text-xs tracking-[0.15em] uppercase text-txt dark:text-txt-dark-primary font-body font-light mb-6">Price Range</h3>
      
      <div class="flex items-center space-x-4">
        <!-- Min Input -->
        <div class="relative w-full">
          <span class="absolute left-0 top-1/2 -translate-y-1/2 text-txt-muted dark:text-txt-dark-muted text-sm font-sans">$</span>
          <input 
            v-model.number="localMinPrice"
            type="number" 
            placeholder="0" 
            class="w-full bg-transparent border-b border-edge dark:border-edge-dark py-2 pl-4 pr-2 text-sm font-sans text-txt dark:text-txt-dark-primary focus:outline-none focus:border-txt dark:focus:border-txt-dark-primary transition-colors"
          />
        </div>
        
        <span class="text-txt-muted dark:text-txt-dark-muted font-light">—</span>
        
        <!-- Max Input -->
        <div class="relative w-full">
          <span class="absolute left-0 top-1/2 -translate-y-1/2 text-txt-muted dark:text-txt-dark-muted text-sm font-sans">$</span>
          <input 
            v-model.number="localMaxPrice"
            type="number" 
            placeholder="10000" 
            class="w-full bg-transparent border-b border-edge dark:border-edge-dark py-2 pl-4 pr-2 text-sm font-sans text-txt dark:text-txt-dark-primary focus:outline-none focus:border-txt dark:focus:border-txt-dark-primary transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col gap-4 pt-2">
      <button class="btn-primary w-full text-xs py-3.5" @click="apply">Apply Filters</button>
      <button
        class="w-full text-xs py-2 tracking-[0.15em] uppercase text-txt-muted hover:text-txt dark:hover:text-txt-dark-primary transition-colors font-light"
        @click="reset"
      >
        Clear all
      </button>
    </div>
  </div>
</template>
