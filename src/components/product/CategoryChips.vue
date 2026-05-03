<script setup lang="ts">
import type { Category } from '@/types'

const props = defineProps<{
  categories: Category[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
    <!-- All chip -->
    <button
      class="snap-start flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 whitespace-nowrap"
      :class="modelValue === 'all'
        ? 'bg-accent text-white shadow-accent'
        : 'bg-light-elevated dark:bg-dark-elevated text-ink-secondary dark:text-chalk-secondary hover:bg-light-border dark:hover:bg-dark-border'"
      @click="emit('update:modelValue', 'all')"
    >
      All
    </button>
    <!-- Category chips -->
    <button
      v-for="cat in categories"
      :key="cat.slug"
      class="snap-start flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 whitespace-nowrap capitalize"
      :class="modelValue === cat.slug
        ? 'bg-accent text-white shadow-accent'
        : 'bg-light-elevated dark:bg-dark-elevated text-ink-secondary dark:text-chalk-secondary hover:bg-light-border dark:hover:bg-dark-border'"
      @click="emit('update:modelValue', cat.slug)"
    >
      {{ cat.name }}
    </button>
  </div>
</template>
