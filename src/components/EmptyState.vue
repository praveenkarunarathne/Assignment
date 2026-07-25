<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  actionLabel?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="text-6xl mb-6">🛍️</div>
    <h3 class="font-display text-2xl font-bold text-txt dark:text-txt-dark-primary mb-2">
      {{ title }}
    </h3>
    <p class="text-txt-muted dark:text-txt-dark-muted text-sm max-w-sm mb-6">
      {{ description }}
    </p>
    <button
      v-if="actionLabel"
      class="btn-primary"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
