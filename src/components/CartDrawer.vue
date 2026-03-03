<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" @click="close"></div>
    </Transition>

    <!-- Drawer -->
    <Transition name="slide">
      <div v-if="isOpen" class="fixed top-0 right-0 h-full w-full max-w-md z-[70] flex flex-col bg-white dark:bg-gray-900 shadow-2xl">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            Cart
            <span v-if="cartStore.totalItems > 0" class="text-sm font-normal text-gray-500">({{ cartStore.totalItems }} items)</span>
          </h2>
          <button @click="close" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <!-- Empty -->
        <div v-if="cartStore.items.length === 0" class="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <ShoppingBag class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-600 dark:text-gray-400 font-medium mb-1">Your cart is empty</p>
          <p class="text-gray-400 dark:text-gray-500 text-sm mb-6">Add some items to get started</p>
          <button @click="close" class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors">
            Continue Shopping
          </button>
        </div>

        <!-- Items -->
        <div v-else class="flex-grow overflow-y-auto p-5 space-y-3">
          <div 
            v-for="item in cartStore.items" 
            :key="item.product.id"
            class="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50"
          >
            <div class="w-16 h-16 flex-shrink-0 rounded-lg bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
              <img :src="item.product.thumbnail" :alt="item.product.title" class="w-full h-full object-cover" />
            </div>

            <div class="flex-grow min-w-0">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.product.title }}</h3>
              <p class="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-0.5">${{ item.product.price.toFixed(2) }}</p>
              
              <div class="flex items-center gap-1.5 mt-2">
                <button 
                  @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                  class="w-6 h-6 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
                >
                  <Minus class="w-3 h-3" />
                </button>
                <span class="text-sm font-semibold text-gray-900 dark:text-white w-5 text-center">{{ item.quantity }}</span>
                <button 
                  @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                  class="w-6 h-6 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
                >
                  <Plus class="w-3 h-3" />
                </button>
              </div>
            </div>

            <div class="flex flex-col items-end justify-between">
              <button 
                @click="cartStore.removeFromCart(item.product.id)"
                class="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </button>
              <span class="text-sm font-bold text-gray-900 dark:text-white">
                ${{ (item.product.price * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="cartStore.items.length > 0" class="border-t border-gray-100 dark:border-gray-700 p-5 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400 font-medium">Total</span>
            <span class="text-xl font-bold text-gray-900 dark:text-white">${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <button class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-sm">
            Checkout
          </button>
          <button @click="cartStore.clearCart()" class="w-full py-2 text-sm font-medium text-gray-500 hover:text-rose-500 dark:text-gray-400 transition-colors">
            Clear Cart
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { ShoppingCart, ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const cartStore = useCartStore();

const close = () => {
  emit('close');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
