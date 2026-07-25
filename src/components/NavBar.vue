<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'
import DarkModeToggle from './DarkModeToggle.vue'

const auth = useAuthStore()
const cart = useCartStore()
const products = useProductsStore()

const mobileOpen = ref(false)
const searchOpen = ref(false)
const searchInput = ref('')

function onSearch() {
  products.setSearch(searchInput.value)
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) {
    searchInput.value = ''
    products.setSearch('')
  }
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm border-b border-edge dark:border-edge-dark">
    <nav class="flex w-full items-center justify-between px-4 lg:px-8 h-16">
      <!-- Logo -->
      <RouterLink
        to="/"
        class="font-display text-xl font-light text-txt dark:text-txt-dark-primary tracking-[0.05em]"
        @click="closeMobile"
      >
        Ledger
      </RouterLink>

      <!-- Desktop actions -->
      <div class="hidden items-center gap-6 md:flex">
        <!-- Search toggle -->
        <div class="flex items-center">
          <Transition name="search-expand">
            <input
              v-if="searchOpen"
              v-model="searchInput"
              type="search"
              placeholder="Search..."
              class="w-48 bg-transparent border-0 border-b border-edge dark:border-edge-dark text-sm font-light text-txt dark:text-txt-dark-primary placeholder:text-txt-muted dark:placeholder:text-txt-dark-muted focus:outline-none focus:border-txt dark:focus:border-txt-dark-primary py-1 mr-2 transition-all"
              autofocus
              @input="onSearch"
              @keydown.escape="toggleSearch"
            />
          </Transition>
          <button
            class="p-2 text-txt-secondary dark:text-txt-dark-secondary hover:text-txt dark:hover:text-txt-dark-primary transition-colors"
            @click="toggleSearch"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>

        <DarkModeToggle data-cursor="hover" />

        <RouterLink
          to="/cart"
          data-cursor="cart"
          class="relative p-2 text-txt-secondary dark:text-txt-dark-secondary hover:text-txt dark:hover:text-txt-dark-primary transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span
            v-if="cart.itemCount > 0"
            class="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center text-[9px] font-medium text-surface bg-txt dark:text-surface-dark dark:bg-txt-dark-primary px-1"
          >
            {{ cart.itemCount > 99 ? '99+' : cart.itemCount }}
          </span>
        </RouterLink>

        <template v-if="auth.isAuthenticated">
          <img
            v-if="auth.user?.image"
            :src="auth.user.image"
            :alt="auth.user.firstName"
            class="h-7 w-7 rounded-full object-cover"
            data-cursor="profile"
          />
          <button
            class="text-xs font-body font-normal tracking-[0.2em] uppercase text-txt-secondary dark:text-txt-dark-secondary hover:text-txt dark:hover:text-txt-dark-primary transition-colors"
            @click="auth.logout()"
            data-cursor="logout"
          >
            Log out
          </button>
        </template>
        <RouterLink
          v-else
          to="/login"
          data-cursor="login"
          class="text-xs font-body font-normal tracking-[0.2em] uppercase text-txt dark:text-txt-dark-primary hover:text-txt-secondary dark:hover:text-txt-dark-secondary transition-colors"
        >
          Sign in
        </RouterLink>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden p-2 text-txt dark:text-txt-dark-primary"
        @click="toggleMobile"
        aria-label="Toggle menu"
      >
        <svg v-if="!mobileOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </nav>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div
        v-if="mobileOpen"
        class="border-t border-edge dark:border-edge-dark bg-surface dark:bg-surface-dark px-4 pb-4 pt-3 md:hidden"
      >
        <input
          v-model="searchInput"
          type="search"
          placeholder="Search..."
          class="w-full bg-transparent border-0 border-b border-edge dark:border-edge-dark text-sm font-light py-2 mb-3 focus:outline-none focus:border-txt dark:focus:border-txt-dark-primary text-txt dark:text-txt-dark-primary placeholder:text-txt-muted"
          @input="onSearch"
        />
        <div class="flex flex-col gap-1">
          <RouterLink to="/cart" class="nav-link flex items-center gap-2 py-2" @click="closeMobile">
            Cart
            <span
              v-if="cart.itemCount > 0"
              class="text-[9px] font-medium text-surface bg-txt dark:text-surface-dark dark:bg-txt-dark-primary px-1.5 py-0.5"
            >{{ cart.itemCount }}</span>
          </RouterLink>
          <template v-if="auth.isAuthenticated">
            <button class="nav-link text-left py-2" @click="auth.logout(); closeMobile()">Log out</button>
          </template>
          <RouterLink v-else to="/login" class="nav-link py-2" @click="closeMobile">Sign in</RouterLink>
          <div class="flex items-center gap-2 py-2">
            <span class="text-xs text-txt-muted dark:text-txt-dark-muted font-body tracking-wider uppercase">Theme</span>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.2s ease, opacity 0.15s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 300px;
  opacity: 1;
}
.search-expand-enter-active,
.search-expand-leave-active {
  transition: width 0.2s ease, opacity 0.15s ease;
  overflow: hidden;
}
.search-expand-enter-from,
.search-expand-leave-to {
  width: 0;
  opacity: 0;
}
</style>
