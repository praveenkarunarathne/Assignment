<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back button -->
    <button 
      @click="router.back()" 
      class="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors group text-sm font-medium"
    >
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      Back to Products
    </button>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-24">
      <Loader type="spinner" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-rose-500 mb-4 font-medium">{{ error }}</p>
      <button @click="loadProduct" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
        Try Again
      </button>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10">
        
        <!-- Image Gallery -->
        <div class="flex flex-col gap-4">
          <div class="w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
            <img 
              :src="selectedImage || product.thumbnail" 
              :alt="product.title"
              class="w-full h-full object-contain p-6"
            />
          </div>
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button 
              v-for="(img, idx) in product.images" 
              :key="idx"
              @click="selectedImage = img"
              class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200"
              :class="selectedImage === img 
                ? 'border-primary-500 shadow-md' 
                : 'border-gray-200 dark:border-gray-600 opacity-60 hover:opacity-100'"
            >
              <img :src="img" :alt="`${product.title} view ${idx + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <!-- Tags -->
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-md">
              {{ product.category }}
            </span>
            <span class="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-xs bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-md">
              <Star class="w-3.5 h-3.5 fill-current" /> {{ product.rating }}
            </span>
            <span v-if="product.discountPercentage > 0" class="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              {{ Math.round(product.discountPercentage) }}% OFF
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1.5 leading-tight">
            {{ product.title }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mb-6 font-medium">{{ product.brand }}</p>

          <!-- Price -->
          <div class="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
            <span class="text-3xl font-extrabold text-gray-900 dark:text-white">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.discountPercentage > 0" class="text-base text-gray-400 line-through mb-0.5">
              ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
            </span>
          </div>

          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {{ product.description }}
          </p>

          <!-- Actions -->
          <div class="mt-auto flex gap-3">
            <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <button 
                @click="quantity > 1 && quantity--"
                class="px-3.5 py-3 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Minus class="w-4 h-4" />
              </button>
              <span class="px-3 font-semibold text-gray-900 dark:text-white w-10 text-center">{{ quantity }}</span>
              <button 
                @click="quantity < product.stock && quantity++"
                class="px-3.5 py-3 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                :disabled="quantity >= product.stock"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
            
            <button 
              @click="handleAddToCart"
              class="flex-grow flex items-center justify-center py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98]"
            >
              <ShoppingCart class="w-5 h-5 mr-2" />
              Add to Cart
            </button>
          </div>

          <p v-if="product.stock" class="text-sm text-gray-500 dark:text-gray-400 mt-4 flex items-center gap-1.5">
            <Package class="w-4 h-4 text-emerald-500"/>
            <span><strong class="text-emerald-600 dark:text-emerald-400">{{ product.stock }}</strong> in stock</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Product } from '../types';
import { fetchProductById } from '../services/api';
import { useCartStore } from '../stores/cart';
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Package } from 'lucide-vue-next';
import Loader from '../components/Loader.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedImage = ref<string | null>(null);
const quantity = ref(1);

const loadProduct = async () => {
  loading.value = true;
  error.value = null;
  const rawId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  const id = rawId ?? '';
  
  try {
    product.value = await fetchProductById(id);
    const firstImage = product.value.images?.[0];
    if (firstImage) {
      selectedImage.value = firstImage;
    } else {
      selectedImage.value = product.value.thumbnail;
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load product details';
  } finally {
    loading.value = false;
  }
};

const handleAddToCart = () => {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addToCart(product.value);
    }
  }
};

onMounted(() => {
  loadProduct();
});
</script>
