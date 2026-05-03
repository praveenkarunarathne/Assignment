<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: []
}>()

const internalValue = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout>

watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

watch(internalValue, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', val)
    emit('search')
  }, 350)
})

function clear() {
  internalValue.value = ''
  emit('update:modelValue', '')
  emit('search')
}
</script>

<template>
  <div class="relative">
    <svg
      class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted dark:text-chalk-muted"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      id="search-input"
      v-model="internalValue"
      type="text"
      placeholder="Search products..."
      class="input-field pl-11 pr-10"
    />
    <button
      v-if="internalValue"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-light-border dark:hover:bg-dark-border transition-colors text-ink-muted dark:text-chalk-muted"
      @click="clear"
      aria-label="Clear search"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
