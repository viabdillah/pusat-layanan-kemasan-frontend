// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Impor semua view kita
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import UsersView from '../views/UsersView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import CreateOrderView from '../views/CreateOrderView.vue'
import QueueCashierView from '../views/QueueCashierView.vue'
import QueueDesignerView from '../views/QueueDesignerView.vue'
import QueueOperatorView from '../views/QueueOperatorView.vue'
import SalesReportView from '../views/SalesReportView.vue'
import OrderDetailView from '../views/OrderDetailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true } // Semua peran bisa akses dasbor
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true, allowedRoles: ['admin'] }
    },
    {
      path: '/orders/new',
      name: 'create-order',
      component: CreateOrderView,
      meta: { requiresAuth: true, allowedRoles: ['admin', 'kasir'] }
    },
    {
      path: '/orders/:id', // <-- Rute dinamis dengan parameter 'id'
      name: 'order-detail',
      component: OrderDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/queue/kasir',
      name: 'queue-cashier',
      component: QueueCashierView,
      meta: { requiresAuth: true, allowedRoles: ['admin', 'kasir'] }
    },
    {
      path: '/queue/designer',
      name: 'queue-designer',
      component: QueueDesignerView,
      meta: { requiresAuth: true, allowedRoles: ['admin', 'designer'] }
    },
    {
      path: '/queue/operator',
      name: 'queue-operator',
      component: QueueOperatorView,
      meta: { requiresAuth: true, allowedRoles: ['admin', 'operator'] }
    },
    {
      path: '/reports/sales',
      name: 'sales-report',
      component: SalesReportView,
      meta: { requiresAuth: true, allowedRoles: ['admin', 'manajer'] }
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: NotFoundView 
    },
  ]
})

// Navigation Guard yang disempurnakan
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  
  // PERBAIKAN DI SINI: gunakan '.role' (huruf kecil) dan '.toLowerCase()'
  const userRole = authStore.user?.role?.toLowerCase();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' });
  } else if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
    console.log(`Akses ditolak untuk peran '${userRole}' ke rute '${String(to.name)}'`);
    next({ name: 'dashboard' }); 
  } else {
    next();
  }
});

export default router