<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) return
  const success = await auth.signIn({
    username: username.value,
    password: password.value,
  })
  if (success) {
    toast.success(`Welcome back, ${auth.user?.firstName}!`)
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="glass-card rounded-4xl p-8 md:p-10 w-full max-w-md shadow-card-hover animate-scale-in">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="font-display italic text-3xl font-bold text-accent mb-2">Lumière</h1>
        <h2 class="font-display text-2xl font-bold text-ink-primary dark:text-chalk-primary">
          Welcome back
        </h2>
        <p class="text-ink-secondary dark:text-chalk-secondary text-sm font-body mt-2">
          Sign in to your Lumière account
        </p>
      </div>

      <!-- Form -->
      <div class="space-y-4" @keyup.enter="handleLogin">
        <!-- Username -->
        <div>
          <label class="block text-sm font-body font-medium text-ink-primary dark:text-chalk-primary mb-1.5">
            Username
          </label>
          <input
            id="login-username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="input-field"
            autocomplete="username"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-body font-medium text-ink-primary dark:text-chalk-primary mb-1.5">
            Password
          </label>
          <div class="relative">
            <input
              id="login-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="input-field pr-12"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-chalk-muted hover:text-ink-primary dark:hover:text-chalk-primary transition-colors"
              @click="showPassword = !showPassword"
              aria-label="Toggle password visibility"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Error message -->
        <p v-if="auth.error" class="text-red-500 text-sm font-body animate-fade-in">
          {{ auth.error }}
        </p>

        <!-- Sign In button -->
        <button
          id="login-submit"
          class="w-full btn-primary py-4 text-base flex items-center justify-center gap-2"
          :disabled="auth.loading || !username || !password"
          @click="handleLogin"
        >
          <svg
            v-if="auth.loading"
            class="animate-spin w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ auth.loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </div>

      <!-- Hint -->
      <div class="mt-6 p-4 bg-light-elevated dark:bg-dark-elevated rounded-2xl">
        <p class="text-xs text-ink-muted dark:text-chalk-muted font-mono text-center">
          Try: username: <span class="text-accent font-semibold">emilys</span> / password: <span class="text-accent font-semibold">emilyspass</span>
        </p>
      </div>

      <!-- Register link -->
      <p class="text-center text-sm text-ink-muted dark:text-chalk-muted mt-6 font-body">
        Don't have an account?
        <span class="text-ink-secondary dark:text-chalk-secondary cursor-default">Register</span>
      </p>
    </div>
  </div>
</template>
