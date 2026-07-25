<script setup lang="ts">
import { useProductsStore } from '../stores/products'
import ProductCard from './ProductCard.vue'
import SkeletonDetail from './SkeletonDetail.vue'

const products = useProductsStore()
</script>

<template>
  <div>
    <!-- Skeleton loading -->
    <div
      v-if="products.loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-edge dark:bg-edge-dark border-y border-edge dark:border-edge-dark"
    >
      <div v-for="i in 12" :key="i" class="product-card p-4 flex flex-col gap-4 bg-surface dark:bg-surface-dark">
        <div class="skeleton aspect-square rounded-md w-full"></div>
        <div class="skeleton h-4 w-1/3 mt-2 rounded"></div>
        <div class="skeleton h-5 w-3/4 rounded"></div>
        <div class="skeleton h-4 w-1/4 mt-auto rounded"></div>
        <div class="skeleton h-10 w-full mt-2 rounded"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="products.filteredProducts.length === 0 && !products.error"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-txt-muted dark:text-txt-dark-muted">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
      <p class="mt-4 text-base font-medium text-txt dark:text-txt-dark-primary">
        No products found
      </p>
      <p class="mt-1 text-sm text-txt-muted dark:text-txt-dark-muted">
        Try adjusting your search or filter
      </p>
    </div>

    <!-- Product grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-edge dark:bg-edge-dark border-y border-edge dark:border-edge-dark"
    >
      <div
        v-for="(product, index) in products.filteredProducts"
        :key="product.id"
        :style="{ animationDelay: `${(index % 12) * 50}ms`, animationFillMode: 'both' }"
        class="animate-fade-up relative group bg-surface dark:bg-surface-dark"
      >
        <ProductCard :product="product" class="h-full block p-4 lg:p-6" />
      </div>
    </div>
  </div>
</template>
