<template>
  <div class="cart-container">
    <h2>我的购物车</h2>

    <!-- 购物车为空时的提示 -->
    <el-empty v-if="cartStore.cartItems.length === 0" description="购物车空空如也，快去逛逛吧~">
      <el-button type="primary" @click="$router.push('/product')">去购物</el-button>
    </el-empty>

    <!-- 购物车有商品时的列表 -->
    <div v-else>
      <el-card v-for="item in cartStore.cartItems" :key="item.id" style="margin-bottom: 15px;">
        <div class="cart-item">
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>单价：¥{{ item.price }}</p>
          </div>
          <div class="item-actions">
            <el-input-number 
              v-model="item.quantity" 
              :min="1" 
              size="small"
              @change="updateQuantity"
            />
            <el-button type="danger" size="small" style="margin-left: 15px;" @click="handleRemove(item.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 底部结算栏 -->
      <div class="cart-footer">
        <p>总计：<span class="total-price">¥{{ cartStore.getTotalPrice().toFixed(2) }}</span></p>
        <el-button type="primary" size="large" @click="handleCheckout">去结算</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

// 更新数量（因为修改了对象属性，Pinia 会自动响应，这里可以留空或做额外逻辑）
const updateQuantity = () => {
  // Pinia 的 ref 是响应式的，直接修改 item.quantity 即可
}

// 删除商品
const handleRemove = (productId) => {
  cartStore.removeFromCart(productId)
  ElMessage.success('商品已移除')
}

// 去结算
const handleCheckout = () => {
  ElMessage.success('订单结算功能将在第七天开发')
  // 以后这里会跳转到结算页面或调用后端创建订单接口
}
</script>

<style scoped>
.cart-container {
  padding: 20px;
}
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-info h3 {
  margin: 0 0 10px 0;
}
.item-info p {
  margin: 0;
  color: #666;
}
.item-actions {
  display: flex;
  align-items: center;
}
.cart-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.total-price {
  font-size: 24px;
  color: #e4393c;
  font-weight: bold;
}
</style>