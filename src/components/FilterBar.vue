<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-3 mb-8">
    <!-- Search Input -->
    <div class="relative flex-grow">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search class="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        v-model="searchQuery"
        @input="emitSearch"
        placeholder="Search products..."
        class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
      />
    </div>

    <!-- Category Select -->
    <div class="relative min-w-[180px]">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Filter class="h-4 w-4 text-gray-400" />
      </div>
      <select
        v-model="selectedCategory"
        @change="emitCategory"
        class="block w-full pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm rounded-lg appearance-none transition-all cursor-pointer"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.slug" :value="category.slug">
          {{ category.name }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
        <ChevronDown class="h-4 w-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchCategories } from '../services/api';
import { Search, Filter, ChevronDown } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'update:search', query: string): void;
  (e: 'update:category', category: string): void;
}>();

const searchQuery = ref('');
const selectedCategory = ref('');
const categories = ref<{ slug: string, name: string, url: string }[]>([]);

let debounceTimer: ReturnType<typeof setTimeout>;

const emitSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('update:search', searchQuery.value);
  }, 400);
};

const emitCategory = () => {
  searchQuery.value = '';
  emit('update:category', selectedCategory.value);
};

onMounted(async () => {
  try {
    categories.value = await fetchCategories();
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
});
</script>
