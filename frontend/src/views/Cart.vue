<template>
  <div class="cart-container">
    <h2>我的购物车</h2>
    <el-empty v-if="cartStore.cartItems.length === 0" description="购物车空空如也">
      <el-button type="primary" @click="$router.push('/product')">去购物</el-button>
    </el-empty>
    <div v-else>
      <el-card v-for="item in cartStore.cartItems" :key="item.id" style="margin-bottom: 15px; display: flex; align-items: center; gap: 20px;">
        <img :src="item.image_url" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />
        <div style="flex: 1;">
          <h3>{{ item.name }}</h3>
          <p style="color: #e4393c; font-weight: bold;">¥{{ item.price }}</p>
        </div>
        <!-- 核心：修改数量时，实时同步到 localStorage 和总价 -->
        <el-input-number v-model="item.quantity" :min="1" @change="cartStore.saveToLocalStorage" />
        <el-button type="danger" @click="cartStore.removeFromCart(item.id)">删除</el-button>
      </el-card>
      <div style="text-align: right; margin-top: 20px; font-size: 20px;">
        总计：<span style="color: #e4393c; font-weight: bold;">¥{{ cartStore.totalPrice }}</span>
        <el-button type="primary" size="large" style="margin-left: 20px;" @click="$router.push('/checkout')">去结算</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart';
const cartStore = useCartStore();
</script>