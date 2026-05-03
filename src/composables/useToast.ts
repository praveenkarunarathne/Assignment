import { useToastStore } from '@/stores/toastStore'

export function useToast() {
  const store = useToastStore()
  return {
    success: (msg: string) => store.show(msg, 'success'),
    error: (msg: string) => store.show(msg, 'error'),
    info: (msg: string) => store.show(msg, 'info'),
  }
}
