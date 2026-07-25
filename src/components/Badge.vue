<script setup lang="ts">
const props = defineProps<{
  label: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}>()

const variantClasses: Record<string, string> = {
  default: 'bg-surface-raised dark:bg-surface-dark-raised text-txt-secondary dark:text-txt-dark-secondary',
  success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}
</script>

<template>
  <span class="badge" :class="variantClasses[variant || 'default']">
    {{ label }}
  </span>
</template>
