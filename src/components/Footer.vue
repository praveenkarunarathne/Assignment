<template>
  <footer class="mt-auto border-t border-edge dark:border-edge-dark bg-surface dark:bg-surface-dark py-12">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p class="font-display text-base font-light text-txt dark:text-txt-dark-primary tracking-[0.05em]">
          Ledger
        </p>
        <p class="text-xs tracking-[0.15em] uppercase text-txt-muted dark:text-txt-dark-muted font-body font-light">
          &copy; {{ new Date().getFullYear() }} Ledger Store
        </p>
        <div class="flex gap-6">
          <a href="#" class="text-xs tracking-[0.1em] uppercase text-txt-muted dark:text-txt-dark-muted hover:text-txt dark:hover:text-txt-dark-primary transition-colors font-body font-light">Privacy</a>
          <a href="#" class="text-xs tracking-[0.1em] uppercase text-txt-muted dark:text-txt-dark-muted hover:text-txt dark:hover:text-txt-dark-primary transition-colors font-body font-light">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</template>
