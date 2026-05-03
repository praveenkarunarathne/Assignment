<script setup lang="ts">
</script>

<template>
  <footer class="bg-light-surface dark:bg-dark-surface border-t mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
        <!-- Brand -->
        <div class="md:col-span-1">
          <h3 class="font-display italic text-2xl font-bold text-accent mb-3">Lumière</h3>
          <p class="text-ink-secondary dark:text-chalk-secondary text-sm leading-relaxed">
            Curated excellence for the modern lifestyle. Discover premium products that inspire.
          </p>
        </div>

        <!-- Shop -->
        <div>
          <h4 class="font-body font-semibold text-sm uppercase tracking-wider mb-4 text-ink-primary dark:text-chalk-primary">Shop</h4>
          <ul class="space-y-3">
            <li><router-link to="/products" class="nav-link text-sm">All Products</router-link></li>
            <li><router-link to="/products?category=smartphones" class="nav-link text-sm">Electronics</router-link></li>
            <li><router-link to="/products?category=furniture" class="nav-link text-sm">Furniture</router-link></li>
            <li><router-link to="/products?category=fragrances" class="nav-link text-sm">Fragrances</router-link></li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="font-body font-semibold text-sm uppercase tracking-wider mb-4 text-ink-primary dark:text-chalk-primary">Company</h4>
          <ul class="space-y-3">
            <li><span class="nav-link text-sm cursor-default">About Us</span></li>
            <li><span class="nav-link text-sm cursor-default">Careers</span></li>
            <li><span class="nav-link text-sm cursor-default">Press</span></li>
            <li><span class="nav-link text-sm cursor-default">Blog</span></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-body font-semibold text-sm uppercase tracking-wider mb-4 text-ink-primary dark:text-chalk-primary">Support</h4>
          <ul class="space-y-3">
            <li><span class="nav-link text-sm cursor-default">Help Center</span></li>
            <li><span class="nav-link text-sm cursor-default">Shipping & Returns</span></li>
            <li><span class="nav-link text-sm cursor-default">Contact Us</span></li>
            <li><span class="nav-link text-sm cursor-default">Privacy Policy</span></li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-12 pt-8 border-t text-center">
        <p class="text-ink-muted dark:text-chalk-muted text-sm font-body">
          © {{ new Date().getFullYear() }} Lumière Store. All rights reserved. Crafted with passion.
        </p>
      </div>
    </div>
  </footer>
</template>
