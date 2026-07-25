<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Product } from '../types'
import { useCartStore } from '../stores/cart'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()

const added = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

function handleAdd() {
  const success = cart.addToCart(props.product.id)
  if (success) {
    added.value = true
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      added.value = false
    }, 1200)
  }
}

function discountedPrice(product: Product): string {
  return (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
}
</script>

<template>
  <div class="product-card group relative flex flex-col h-full bg-surface dark:bg-surface-dark" data-cursor-hover="true">
    <!-- Image Container with Studio Backdrop -->
    <RouterLink :to="`/product/${product.id}`" class="relative overflow-hidden bg-[#F9F9F9] dark:bg-[#111111] aspect-[4/5] flex items-center justify-center p-6">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="h-full w-full object-contain transition-transform duration-[600ms] cubic-bezier(0.19, 1, 0.22, 1) group-hover:scale-[1.04]"
        loading="lazy"
      />
    </RouterLink>

    <!-- Details -->
    <div class="mt-5 flex flex-col flex-1 px-2">
      <span class="text-[11px] uppercase tracking-[0.2em] text-txt-muted dark:text-txt-dark-muted mb-3 block">
        {{ product.category.replace(/-/g, ' ') }}
      </span>
      
      <div class="flex justify-between items-baseline w-full mb-1">
        <RouterLink :to="`/product/${product.id}`" class="pr-4 truncate flex-1">
          <h2 class="font-serif text-lg font-light text-txt dark:text-txt-dark-primary truncate group-hover:text-txt-secondary transition-colors">
            {{ product.title }}
          </h2>
        </RouterLink>
        <span class="font-sans text-sm text-txt dark:text-txt-dark-primary whitespace-nowrap">
          ${{ discountedPrice(product) }}
        </span>
      </div>
      
      <div v-if="product.discountPercentage > 0" class="flex gap-2 items-center">
        <span class="text-xs text-txt-muted dark:text-txt-dark-muted line-through font-sans">
          ${{ product.price.toFixed(2) }}
        </span>
      </div>
    </div>

  </div>
</template>
