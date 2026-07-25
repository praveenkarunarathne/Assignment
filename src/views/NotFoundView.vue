<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="text-center animate-fade-up">
      <div class="font-display text-[8rem] md:text-[12rem] font-bold text-txt-muted/30 dark:text-txt-dark-muted/30 leading-none select-none">
        404
      </div>
      <h1 class="font-display text-3xl md:text-4xl font-bold text-txt dark:text-txt-dark-primary -mt-8 relative z-10">
        Page Not Found
      </h1>
      <p class="text-txt-secondary dark:text-txt-dark-secondary font-body mt-4 max-w-md mx-auto relative z-10">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <button
        class="btn-primary mt-8 relative z-10"
        @click="router.push('/')"
      >
        Go Home
      </button>
    </div>
  </div>
</template>
