import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/ProductsView.vue'),
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/views/ProductDetailView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// Navigation guard
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.guestOnly && auth.isLoggedIn) return { name: 'home' }
})

export default router
