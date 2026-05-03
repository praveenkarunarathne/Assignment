<script setup lang="ts">
import { useRouter } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import type { Product } from '@/types'

const props = defineProps<{
  products: Product[]
  loading: boolean
  columns?: number
}>()

const router = useRouter()
</script>

<template>
  <div>
    <!-- Loading skeletons -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
    >
      <SkeletonCard v-for="i in 8" :key="i" />
    </div>

    <!-- Empty state -->
    <EmptyState
      v-else-if="products.length === 0"
      title="No products found"
      description="Try adjusting your filters or search query to find what you're looking for."
      action-label="Clear Filters"
      @action="$emit('clearFilters')"
    />

    <!-- Product grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
    >
      <div
        v-for="(product, index) in products"
        :key="product.id"
        :style="{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }"
        class="animate-fade-up"
        @click="router.push(`/products/${product.id}`)"
      >
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>
