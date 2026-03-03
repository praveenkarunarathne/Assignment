<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
    <!-- Subtle background shapes -->
    <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 right-10 w-72 h-72 bg-accent-400/5 rounded-full blur-3xl"></div>

    <div class="relative max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 sm:p-10">
        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <div class="bg-primary-600 p-3.5 rounded-xl">
            <Lock class="h-7 w-7 text-white" />
          </div>
        </div>

        <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome Back
        </h2>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          Sign in to your account
        </p>
        
        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="username" 
                type="text" 
                v-model="username" 
                required 
                class="block w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm" 
                placeholder="e.g., emilys" 
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound class="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="password" 
                type="password" 
                v-model="password" 
                required 
                class="block w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm" 
                placeholder="e.g., emilyspass" 
              />
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 dark:bg-rose-900/20 py-3 px-4 rounded-lg border border-rose-200 dark:border-rose-800/30">
            <AlertCircle class="w-4 h-4 flex-shrink-0" />
            {{ error }}
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin" />
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <p class="text-xs text-center text-gray-400 dark:text-gray-500">
            Demo credentials: 
            <code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-mono">emilys</code> / 
            <code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-mono">emilyspass</code>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { login } from '../services/api';
import { User as UserIcon, Lock, KeyRound, AlertCircle, Loader2 } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('emilys');
const password = ref('emilyspass');
const loading = ref(false);
const error = ref<string | null>(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const authData = await login(username.value, password.value);
    authStore.setAuth(authData);
    router.push('/');
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
