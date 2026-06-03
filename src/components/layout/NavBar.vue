<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from '@/composables/useTheme'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const { isDark, toggle } = useTheme()

const mobileMenuOpen = ref(false)
const cartAnimating = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')

const openCart = inject<() => void>('openCart', () => {})

// Animate cart badge when count changes
watch(() => cart.totalItems, () => {
  cartAnimating.value = true
  setTimeout(() => (cartAnimating.value = false), 400)
})

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'products', query: { q: searchQuery.value } })
    searchOpen.value = false
    searchQuery.value = ''
  }
}

import { useToast } from '@/composables/useToast'
const toast = useToast()

function handleSignOut() {
  auth.signOut()
  toast.success('Signed out successfully')
  router.push('/login')
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav
    id="main-nav"
    class="fixed top-0 left-0 right-0 z-50 glass-card border-b"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link
          to="/"
          class="font-display italic text-2xl font-bold text-accent hover:text-accent-dark transition-colors"
        >
          Lumière
        </router-link>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center gap-8">
          <router-link to="/products" class="nav-link">Shop</router-link>
          <router-link to="/products?category=furniture" class="nav-link">Collections</router-link>
          <span v-if="auth.isLoggedIn" class="nav-link">
            {{ auth.user?.firstName }}
          </span>
        </div>

        <!-- Right Icons -->
        <div class="flex items-center gap-2">
          <!-- Search toggle -->
          <button
            id="nav-search-toggle"
            class="p-2 rounded-xl hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors"
            @click="searchOpen = !searchOpen"
            aria-label="Toggle search"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- Cart -->
          <button
            id="nav-cart-button"
            class="relative p-2 rounded-xl hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors"
            @click="openCart"
            aria-label="Open cart"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span
              v-if="cart.totalItems > 0"
              :class="['absolute -top-1 -right-1 bg-accent text-white text-xs font-mono w-5 h-5 rounded-full flex items-center justify-center', cartAnimating ? 'animate-cart-bounce' : '']"
            >
              {{ cart.totalItems > 99 ? '99+' : cart.totalItems }}
            </span>
          </button>

          <!-- User -->
          <router-link
            v-if="!auth.isLoggedIn"
            to="/login"
            class="hidden md:flex items-center gap-1 nav-link"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Sign In
          </router-link>
          <button
            v-else
            class="hidden md:flex items-center gap-2 nav-link"
            @click="handleSignOut"
          >
            <img
              :src="auth.user?.image"
              :alt="auth.user?.firstName"
              class="w-8 h-8 rounded-full object-cover border-2 border-accent"
            />
          </button>

          <!-- Mobile Hamburger -->
          <button
            id="mobile-menu-toggle"
            class="md:hidden p-2 rounded-xl hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors"
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="Toggle menu"
          >
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Inline Search Bar -->
      <Transition name="page">
        <div v-if="searchOpen" class="pb-3">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted dark:text-chalk-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="input-field pl-10 pr-4"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>
      </Transition>
    </div>
  </nav>

  <!-- Mobile Menu Slide-over -->
  <Transition name="page">
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 md:hidden">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="mobileMenuOpen = false" />
      <div class="absolute top-16 left-0 right-0 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border p-6 animate-fade-up">
        <div class="flex flex-col gap-4">
          <router-link to="/products" class="nav-link text-lg" @click="mobileMenuOpen = false">Shop</router-link>
          <router-link to="/products?category=furniture" class="nav-link text-lg" @click="mobileMenuOpen = false">Collections</router-link>
          <router-link to="/cart" class="nav-link text-lg" @click="mobileMenuOpen = false">Cart ({{ cart.totalItems }})</router-link>
          <router-link v-if="!auth.isLoggedIn" to="/login" class="nav-link text-lg" @click="mobileMenuOpen = false">Sign In</router-link>
          <button v-else class="nav-link text-lg text-left" @click="handleSignOut">Sign Out</button>
        </div>
      </div>
    </div>
  </Transition>
</template>
