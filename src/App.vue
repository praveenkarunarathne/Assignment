<template>
  <div class="min-h-screen transition-colors duration-300">
    <NavBar />
    <PageWrapper>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </PageWrapper>
    <BottomTabBar />
    <FooterComponent />
    <Toast />
    <CartDrawer v-model:open="cartDrawerOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from '@/composables/useTheme'
import NavBar from '@/components/layout/NavBar.vue'
import BottomTabBar from '@/components/layout/BottomTabBar.vue'
import FooterComponent from '@/components/layout/Footer.vue'
import PageWrapper from '@/components/layout/PageWrapper.vue'
import Toast from '@/components/ui/Toast.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'

const auth = useAuthStore()
const { isDark } = useTheme()
const cartDrawerOpen = ref(false)

// Provide cart drawer control to children (NavBar needs it)
provide('openCart', () => (cartDrawerOpen.value = true))

onMounted(() => {
  auth.restoreSession()
})
</script>
