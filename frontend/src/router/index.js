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
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/fetchorders',
    name: 'FetchOrders',
    component: () => import('../views/FetchOrders.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue')
  },
  { path: '/admin', 
    name: 'Admin', 
    component: () => import('../views/Admin.vue') 
  },
  { path: '/contact', 
    name: 'Contact', 
    component: () => import('../views/Contact.vue') 
  },
  { path: '/checkout', 
    name: 'Checkout', 
    component: () => import('../views/Checkout.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router