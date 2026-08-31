import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])

  function addToCart(product) {
    const existing = cartItems.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      cartItems.value.push({ ...product, quantity: 1 })
    }
  }

  function removeFromCart(productId) {
    cartItems.value = cartItems.value.filter(item => item.id !== productId)
  }

  function getTotalPrice() {
    return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  return { cartItems, addToCart, removeFromCart, getTotalPrice }
})