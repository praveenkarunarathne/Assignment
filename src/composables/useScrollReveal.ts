import { onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollReveal(containerRef: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    const container = containerRef.value
    if (container) {
      const cards = container.querySelectorAll('.scroll-reveal')
      cards.forEach((card) => observer?.observe(card))
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  function observe(el: Element) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.classList.add('revealed')
      return
    }
    observer?.observe(el)
  }

  return { observe }
}
