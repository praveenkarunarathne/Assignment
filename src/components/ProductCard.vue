<template>
  <RouterLink :to="`/product/${product.id}`" class="block group">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700/60 flex flex-col h-full">
      
      <!-- Image -->
      <div class="relative w-full aspect-[4/3] bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <img 
          :src="product.thumbnail" 
          :alt="product.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        <!-- Discount Badge -->
        <div v-if="product.discountPercentage > 0" class="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          -{{ Math.round(product.discountPercentage) }}%
        </div>
        
        <!-- Rating -->
        <div class="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sm font-medium px-2 py-1 rounded-md flex items-center gap-1 text-gray-700 dark:text-gray-200">
          <span class="text-amber-500">★</span> {{ product.rating }}
        </div>

        <!-- Quick Add -->
        <button 
          @click.prevent="addToCart"
          class="absolute bottom-3 right-3 bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 active:scale-90"
          title="Add to Cart"
        >
          <ShoppingCart class="w-4 h-4" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col flex-grow">
        <span class="text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1.5">
          {{ product.category }}
        </span>

        <h3 class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" :title="product.title">
          {{ product.title }}
        </h3>
        
        <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-grow leading-relaxed">
          {{ product.description }}
        </p>

        <div class="flex items-end justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <div>
            <span class="text-lg font-bold text-gray-900 dark:text-white">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.discountPercentage > 0" class="text-xs text-gray-400 line-through ml-1.5">
              ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Product } from '../types';
import { useCartStore } from '../stores/cart';
import { ShoppingCart } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const props = defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();

const addToCart = () => {
  cartStore.addToCart(props.product);
};
</script>
