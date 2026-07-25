<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('emilys')
const password = ref('emilyspass')

async function handleSubmit() {
  const success = await auth.login(username.value, password.value)
  if (success) {
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  }
}
</script>

<template>
  <div class="flex min-h-[85vh] items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="mb-16 text-center">
        <h1 class="font-display text-4xl font-light text-txt dark:text-txt-dark-primary tracking-tight">
          Welcome back
        </h1>
        <p class="mt-4 text-sm text-txt-muted dark:text-txt-dark-muted font-body font-light tracking-wide">
          Log in to access your account
        </p>
      </div>

      <form class="flex flex-col gap-8" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-2 block text-[10px] font-body font-normal tracking-[0.2em] uppercase text-txt-muted dark:text-txt-dark-muted">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            required
            class="input-field"
            placeholder="Enter username"
          />
        </div>
        <div>
          <label class="mb-2 block text-[10px] font-body font-normal tracking-[0.2em] uppercase text-txt-muted dark:text-txt-dark-muted">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="input-field"
            placeholder="Enter password"
          />
        </div>

        <!-- Error -->
        <div
          v-if="auth.loginError"
          class="py-3 text-sm font-light text-txt-secondary dark:text-txt-dark-secondary border-b border-edge dark:border-edge-dark"
        >
          {{ auth.loginError }}
        </div>

        <button
          type="submit"
          class="btn-primary w-full mt-4"
          :disabled="auth.loginLoading"
        >
          <span v-if="auth.loginLoading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign in</span>
        </button>
      </form>

      <!-- Demo hint -->
      <div class="mt-16 text-center">
        <p class="text-[10px] text-txt-muted dark:text-txt-dark-muted font-body tracking-[0.15em] uppercase mb-3">
          Demo credentials
        </p>
        <p class="text-sm text-txt-secondary dark:text-txt-dark-secondary font-body font-light">
          <span class="font-mono text-xs">emilys</span>
          <span class="text-txt-muted mx-2">/</span>
          <span class="font-mono text-xs">emilyspass</span>
        </p>
      </div>
    </div>
  </div>
</template>
