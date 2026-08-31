import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../views/Product.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue')
  },
  { path: '/admin', 
    name: 'Admin', 
    component: () => import('../views/Admin.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router