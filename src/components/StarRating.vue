<script setup lang="ts">
const props = defineProps<{
  rating: number
  count?: number
}>()
</script>

<template>
  <div class="flex items-center gap-1.5">
    <div class="flex items-center gap-0.5">
      <template v-for="i in 5" :key="i">
        <!-- Full star -->
        <svg
          v-if="i <= Math.floor(rating)"
          class="w-4 h-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <!-- Half star -->
        <svg
          v-else-if="i === Math.floor(rating) + 1 && (rating % 1) >= 0.5"
          class="w-4 h-4 text-amber-400"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient :id="'half-star-' + i">
              <stop offset="50%" stop-color="currentColor" />
              <stop offset="50%" stop-color="transparent" />
            </linearGradient>
          </defs>
          <path
            :fill="`url(#half-star-${i})`"
            stroke="currentColor"
            stroke-width="0.5"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        <!-- Empty star -->
        <svg
          v-else
          class="w-4 h-4 text-edge dark:text-edge-dark"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </template>
    </div>
    <span class="text-sm font-mono text-txt-secondary dark:text-txt-dark-secondary">
      {{ rating.toFixed(1) }}
    </span>
    <span v-if="count !== undefined" class="text-xs text-txt-muted dark:text-txt-dark-muted">
      ({{ count }})
    </span>
  </div>
</template>
