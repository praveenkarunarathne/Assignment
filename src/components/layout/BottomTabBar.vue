<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()

const tabs = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Shop', path: '/products', icon: 'grid' },
  { name: 'Cart', path: '/cart', icon: 'bag' },
  { name: 'Account', path: '/login', icon: 'person' },
] as const

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-card border-t">
    <div class="flex items-center justify-around h-16 px-2">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :id="`tab-${tab.icon}`"
        class="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors"
        :class="isActive(tab.path) ? 'text-accent' : 'text-ink-muted dark:text-chalk-muted'"
        @click="router.push(tab.path)"
        :aria-label="tab.name"
      >
        <!-- Home icon -->
        <svg v-if="tab.icon === 'home'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <!-- Grid icon -->
        <svg v-if="tab.icon === 'grid'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <!-- Bag icon -->
        <template v-if="tab.icon === 'bag'">
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span
              v-if="cart.totalItems > 0"
              class="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center"
            >
              {{ cart.totalItems > 9 ? '9+' : cart.totalItems }}
            </span>
          </div>
        </template>
        <!-- Person icon -->
        <svg v-if="tab.icon === 'person'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-[10px] font-body font-medium">{{ tab.name }}</span>
      </button>
    </div>
  </div>
</template>
