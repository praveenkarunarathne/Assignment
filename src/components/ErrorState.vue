<script setup lang="ts">
defineProps<{
  message?: string
  onRetry?: () => void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-sale">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
    <p class="mt-4 text-lg font-medium text-txt dark:text-txt-dark-primary">
      Something went wrong
    </p>
    <p class="mt-1 text-sm text-txt-muted dark:text-txt-dark-muted">
      {{ message || 'We could not load the requested data.' }}
    </p>
    <button
      v-if="onRetry"
      class="btn-primary mt-6 text-sm py-2.5 px-6"
      @click="onRetry"
    >
      Try again
    </button>
  </div>
</template>
