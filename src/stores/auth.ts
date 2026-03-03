import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, AuthResponse } from '../types';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(
        JSON.parse(localStorage.getItem('user') || 'null')
    );
    const token = ref<string | null>(localStorage.getItem('token') || null);

    const isAuthenticated = computed(() => !!token.value);

    function setAuth(data: AuthResponse) {
        user.value = {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            image: data.image,
        };
        token.value = data.accessToken;

        localStorage.setItem('user', JSON.stringify(user.value));
        localStorage.setItem('token', token.value);
    }

    function logout() {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return { user, token, isAuthenticated, setAuth, logout };
});
