<script setup lang="ts">
import { ref } from 'vue'

const buttonRef = ref<HTMLButtonElement | null>(null)
const x = ref(0)
const y = ref(0)

function handleMouseMove(e: MouseEvent) {
  if (!buttonRef.value) return
  
  const { clientX, clientY } = e
  const { left, top, width, height } = buttonRef.value.getBoundingClientRect()
  
  const middleX = clientX - (left + width / 2)
  const middleY = clientY - (top + height / 2)
  
  // Divide to control magnetic strength (higher number = weaker pull)
  x.value = middleX * 0.2
  y.value = middleY * 0.2
}

function handleMouseLeave() {
  x.value = 0
  y.value = 0
}
</script>

<template>
  <button
    ref="buttonRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    :style="{
      transform: `translate(${x}px, ${y}px)`,
      transition: x === 0 && y === 0 ? 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)' : 'transform 0.1s linear'
    }"
    class="btn-primary w-full shadow-none relative"
  >
    <slot></slot>
  </button>
</template>
