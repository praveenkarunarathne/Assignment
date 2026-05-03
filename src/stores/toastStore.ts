import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastMessage } from '@/types'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])

  function show(message: string, type: ToastMessage['type'] = 'success') {
    const id = crypto.randomUUID()
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), 3000)
  }

  function dismiss(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, show, dismiss }
})
