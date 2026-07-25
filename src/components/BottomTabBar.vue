<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
const auth = useAuthStore()

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function handleAccountTap() {
  if (auth.isAuthenticated) {
    auth.logout()
    router.push('/')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-card border-t border-edge dark:border-edge-dark">
    <div class="flex items-center justify-around h-16 px-2">
      <!-- Home -->
      <button
        id="tab-home"
        class="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors"
        :class="isActive('/') ? 'text-txt dark:text-txt-dark-primary' : 'text-txt-muted dark:text-txt-dark-muted'"
        @click="router.push('/')"
        aria-label="Home"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-[10px] font-body font-medium">Home</span>
      </button>

      <!-- Cart -->
      <button
        id="tab-bag"
        class="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors"
        :class="isActive('/cart') ? 'text-txt dark:text-txt-dark-primary' : 'text-txt-muted dark:text-txt-dark-muted'"
        @click="router.push('/cart')"
        aria-label="Cart"
      >
        <div class="relative">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span
            v-if="cart.itemCount > 0"
            class="absolute -top-2 -right-2 bg-txt dark:bg-txt-dark-primary text-surface dark:text-surface-dark text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center"
          >
            {{ cart.itemCount > 9 ? '9+' : cart.itemCount }}
          </span>
        </div>
        <span class="text-[10px] font-body font-medium">Cart</span>
      </button>

      <!-- Account -->
      <button
        id="tab-person"
        class="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors"
        :class="isActive('/login') || auth.isAuthenticated ? 'text-txt dark:text-txt-dark-primary' : 'text-txt-muted dark:text-txt-dark-muted'"
        @click="handleAccountTap"
        aria-label="Account"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-[10px] font-body font-medium">{{ auth.isAuthenticated ? 'Log out' : 'Sign in' }}</span>
      </button>
    </div>
  </div>
</template>
