<template>
  <nav class="glass border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <RouterLink to="/" class="flex-shrink-0 flex items-center gap-2.5 group">
            <div class="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <ShoppingBag class="h-5 w-5 text-white" />
            </div>
            <span class="font-extrabold text-xl text-primary-700 dark:text-primary-400 tracking-tight">VueStore</span>
          </RouterLink>
        </div>
        
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Dark Mode Toggle -->
          <button 
            @click="toggleDark" 
            class="p-2.5 rounded-lg text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            aria-label="Toggle Dark Mode"
          >
            <Sun v-if="isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>

          <!-- Cart Button -->
          <button 
            @click="isCartOpen = true" 
            class="relative p-2.5 rounded-lg text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200" 
            title="Cart"
          >
            <ShoppingCart class="h-5 w-5" />
            <span 
              v-if="cartStore.totalItems > 0" 
              class="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>

          <!-- Auth Section -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
            <img 
              :src="authStore.user?.image" 
              alt="Avatar" 
              class="h-8 w-8 rounded-full border-2 border-primary-200 dark:border-primary-700"
            />
            <div class="hidden sm:block">
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none">{{ authStore.user?.firstName }}</p>
              <button 
                @click="handleLogout" 
                class="text-xs text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
          <RouterLink 
            v-else 
            to="/login" 
            class="text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-5 py-2 rounded-lg transition-colors shadow-sm"
          >
            Sign in
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>

  <!-- Cart Drawer -->
  <CartDrawer :isOpen="isCartOpen" @close="isCartOpen = false" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { ShoppingBag, ShoppingCart, Sun, Moon } from 'lucide-vue-next';
import CartDrawer from './CartDrawer.vue';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const isDark = ref(localStorage.getItem('theme') === 'dark' || 
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));

const isCartOpen = ref(false);

watchEffect(() => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});

const toggleDark = () => {
  isDark.value = !isDark.value;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
