import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/product/:id',
        name: 'ProductDetail',
        component: ProductDetailView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Optional: basic auth guard
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
