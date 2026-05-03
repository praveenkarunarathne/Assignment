<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'

const store = useToastStore()

function toastBorderClass(type: string): string {
  switch (type) {
    case 'success': return 'border-l-4 border-l-emerald-500'
    case 'error': return 'border-l-4 border-l-red-500'
    case 'info': return 'border-l-4 border-l-blue-500'
    default: return ''
  }
}

function toastIconColor(type: string): string {
  switch (type) {
    case 'success': return 'text-emerald-500'
    case 'error': return 'text-red-500'
    case 'info': return 'text-blue-500'
    default: return ''
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="page">
      <div
        v-for="toast in store.toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto bg-light-surface dark:bg-dark-surface shadow-card-hover rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-sm animate-fade-up',
          toastBorderClass(toast.type)
        ]"
      >
        <!-- Icon -->
        <svg v-if="toast.type === 'success'" :class="['w-5 h-5 flex-shrink-0', toastIconColor(toast.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else-if="toast.type === 'error'" :class="['w-5 h-5 flex-shrink-0', toastIconColor(toast.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-else :class="['w-5 h-5 flex-shrink-0', toastIconColor(toast.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <span class="text-sm font-body text-ink-primary dark:text-chalk-primary flex-1">
          {{ toast.message }}
        </span>

        <button
          class="flex-shrink-0 text-ink-muted dark:text-chalk-muted hover:text-ink-primary dark:hover:text-chalk-primary transition-colors"
          @click="store.dismiss(toast.id)"
          aria-label="Dismiss"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
