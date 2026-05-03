import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  onMounted(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = stored ? stored === 'dark' : prefersDark
    applyTheme()
  })

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  function toggle() {
    isDark.value = !isDark.value
    applyTheme()
  }

  return { isDark, toggle }
}
