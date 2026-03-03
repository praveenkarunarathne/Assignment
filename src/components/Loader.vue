<template>
  <div v-if="loading" class="flex justify-center items-center p-8 w-full h-full">
    <div class="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 dark:border-gray-700 border-t-primary-600 dark:border-t-primary-400"></div>
  </div>
  <div v-else-if="type === 'skeleton'" class="w-full">
    <div class="animate-pulse flex flex-col space-y-3">
      <div class="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
      <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div>
      <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
      <div class="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-gray-800">
        <div class="h-5 bg-gray-100 dark:bg-gray-800 rounded w-20"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  loading?: boolean,
  type?: 'spinner' | 'skeleton'
}>(), {
  loading: true,
  type: 'spinner'
})
</script>
