<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Hero Section -->
    <div class="relative overflow-hidden rounded-2xl mb-10 p-8 sm:p-12 bg-primary-700">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-accent-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>
      <div class="relative z-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
          Discover Products
        </h1>
        <p class="text-primary-200 text-base sm:text-lg max-w-lg">
          Browse our curated collection of premium products at great prices.
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <FilterBar 
      @update:search="handleSearch"
      @update:category="handleCategory"
    />

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Loader v-for="n in 8" :key="n" type="skeleton" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 mb-4">
        <span class="text-2xl">⚠️</span>
      </div>
      <p class="text-rose-600 dark:text-rose-400 mb-4 font-medium">{{ error }}</p>
      <button @click="loadProducts" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-sm">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <span class="text-2xl">🔍</span>
      </div>
      <p class="text-gray-600 dark:text-gray-400 text-lg font-medium">No products found</p>
      <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filter.</p>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in products" 
        :key="product.id"
        :product="product" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Product } from '../types';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard.vue';
import FilterBar from '../components/FilterBar.vue';
import Loader from '../components/Loader.vue';

const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const currentSearch = ref('');
const currentCategory = ref('');

const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetchProducts(currentSearch.value, currentCategory.value);
    products.value = response.products;
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load products';
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query: string) => {
  currentSearch.value = query;
  currentCategory.value = '';
  loadProducts();
};

const handleCategory = (category: string) => {
  currentCategory.value = category;
  currentSearch.value = '';
  loadProducts();
};

onMounted(() => {
  loadProducts();
});
</script>
