<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FilterState, SortOption } from '@/types'

const props = defineProps<{
  modelValue: FilterState
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FilterState]
}>()

const localMinPrice = ref(props.modelValue.minPrice)
const localMaxPrice = ref(props.modelValue.maxPrice)
const localSortBy = ref<SortOption>(props.modelValue.sortBy)

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low–High', value: 'price-asc' },
  { label: 'Price: High–Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating-desc' },
  { label: 'A–Z', value: 'name-asc' },
]

function apply() {
  emit('update:modelValue', {
    ...props.modelValue,
    sortBy: localSortBy.value,
    minPrice: localMinPrice.value,
    maxPrice: localMaxPrice.value,
  })
}

function reset() {
  localMinPrice.value = 0
  localMaxPrice.value = 10000
  localSortBy.value = 'default'
  emit('update:modelValue', {
    ...props.modelValue,
    sortBy: 'default',
    minPrice: 0,
    maxPrice: 10000,
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Sort -->
    <div>
      <label class="block text-sm font-body font-medium text-ink-primary dark:text-chalk-primary mb-2">
        Sort By
      </label>
      <select
        v-model="localSortBy"
        class="input-field"
        @change="apply"
      >
        <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- Price Range -->
    <div>
      <label class="block text-sm font-body font-medium text-ink-primary dark:text-chalk-primary mb-2">
        Price Range
      </label>
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-chalk-muted text-sm">$</span>
          <input
            v-model.number="localMinPrice"
            type="number"
            min="0"
            placeholder="Min"
            class="input-field pl-7 text-sm"
          />
        </div>
        <span class="text-ink-muted dark:text-chalk-muted">–</span>
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-chalk-muted text-sm">$</span>
          <input
            v-model.number="localMaxPrice"
            type="number"
            min="0"
            placeholder="Max"
            class="input-field pl-7 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button class="btn-primary flex-1 text-sm" @click="apply">Apply</button>
      <button class="btn-secondary flex-1 text-sm" @click="reset">Reset</button>
    </div>
  </div>
</template>
