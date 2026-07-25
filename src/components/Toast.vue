<script setup lang="ts">
import { useToastStore } from '../stores/toast'

const toasts = useToastStore()

function iconColor(type: string): string {
  switch (type) {
    case 'success': return 'text-cobalt'
    case 'error': return 'text-sale'
    default: return 'text-txt-muted dark:text-txt-dark-muted'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2" style="pointer-events: none;">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts.toasts"
          :key="toast.id"
          class="flex items-center gap-3 rounded-lg border border-edge dark:border-edge-dark bg-surface dark:bg-surface-dark-raised px-4 py-3 shadow-toast"
          style="pointer-events: auto;"
        >
          <!-- Icon -->
          <svg
            v-if="toast.type === 'success'"
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            :class="iconColor(toast.type)"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg
            v-else-if="toast.type === 'error'"
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            :class="iconColor(toast.type)"
          >
            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
          </svg>
          <svg
            v-else
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            :class="iconColor(toast.type)"
          >
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
          </svg>

          <span class="text-sm font-medium text-txt dark:text-txt-dark-primary">
            {{ toast.message }}
          </span>

          <button
            class="ml-2 opacity-40 hover:opacity-100 transition-opacity text-txt-muted dark:text-txt-dark-muted"
            @click="toasts.dismiss(toast.id)"
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
