import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // 1. 初始化时从 localStorage 读取数据
  const cartItems = ref(JSON.parse(localStorage.getItem('globuy_cart')) || []);
  // 2. 计算购物车商品总数
  const cartItemTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });

  // 2. 计算总价
  const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  });

  // 3. 同步保存到 localStorage 的方法
  const saveToLocalStorage = () => {
    localStorage.setItem('globuy_cart', JSON.stringify(cartItems.value));
  };

  // 4. 添加商品（如果已存在则数量+1）
  const addToCart = (product) => {
    const existingItem = cartItems.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.value.push({ ...product, quantity: 1 });
    }
    saveToLocalStorage();
  };

  // 5. 删除商品
  const removeFromCart = (productId) => {
    cartItems.value = cartItems.value.filter(item => item.id !== productId);
    saveToLocalStorage();
  };

  // 6. 清空购物车（下单成功后调用）
  const clearCart = () => {
    cartItems.value = [];
    localStorage.removeItem('globuy_cart');
  };

  return { cartItems, cartItemTotal, totalPrice, addToCart, removeFromCart, clearCart };
});