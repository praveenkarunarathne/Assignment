<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'
import PageWrapper from './components/PageWrapper.vue'
import BottomTabBar from './components/BottomTabBar.vue'

// Custom cursor logic
const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)
const hasMoved = ref(false)

function updateMouse(e: MouseEvent) {
  if (!hasMoved.value) hasMoved.value = true
  
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  
  // Check for hover states
  const target = e.target as HTMLElement
  if (target.closest('[data-cursor-hover="true"]')) {
    isHovering.value = true
  } else {
    isHovering.value = false
  }
}

onMounted(() => {
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', updateMouse)
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
})
</script>

<template>
  <div class="min-h-screen flex flex-col transition-colors duration-150 relative">
    <!-- Custom Cursor (Desktop only via CSS) -->
    <div 
      class="custom-cursor hidden md:flex transition-opacity duration-300"
      :class="[isHovering ? 'is-hovering' : '', hasMoved ? 'opacity-100' : 'opacity-0']"
      :style="{ transform: `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)` }"
    >
      <span class="custom-cursor-text">VIEW</span>
    </div>

    <NavBar />
    <PageWrapper class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </PageWrapper>
    <BottomTabBar />
    <Footer />
    <Toast />
  </div>
</template>
