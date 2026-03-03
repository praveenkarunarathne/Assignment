import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product, CartItem } from '../types';

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>(
        JSON.parse(localStorage.getItem('cart') || '[]')
    );

    // Sync to local storage on every change
    watch(
        items,
        (newItems) => {
            localStorage.setItem('cart', JSON.stringify(newItems));
        },
        { deep: true }
    );

    const totalItems = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const totalPrice = computed(() =>
        items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    );

    function addToCart(product: Product) {
        const existing = items.value.find((i) => i.product.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            items.value.push({ product, quantity: 1 });
        }
    }

    function removeFromCart(productId: number) {
        const index = items.value.findIndex((i) => i.product.id === productId);
        if (index > -1) {
            items.value.splice(index, 1);
        }
    }

    function updateQuantity(productId: number, quantity: number) {
        const item = items.value.find((i) => i.product.id === productId);
        if (item) {
            if (quantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = quantity;
            }
        }
    }

    function clearCart() {
        items.value = [];
    }

    return {
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };
});
