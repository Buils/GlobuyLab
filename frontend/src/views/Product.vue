<template>
  <div class="product-container">
    <h2>商品展示</h2>
    
    <!-- 加载中提示 -->
    <div v-if="loading">加载中...</div>
    
    <!-- 商品列表 -->
    <el-row :gutter="20" v-else>
      <el-col :span="6" v-for="item in products" :key="item.id">
        <el-card shadow="hover" style="margin-bottom: 20px;">
          <template #header>
            <div class="card-header">{{ item.name }}</div>
          </template>
          <p>价格：¥{{ item.price }}</p>
          <p>描述：{{ item.description }}</p>
          <el-button type="primary" size="small" @click="addToCart(item)">
            加入购物车
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'

const products = ref([])
const loading = ref(true)
const cartStore = useCartStore()

// 获取商品列表
const fetchProducts = async () => {
  try {
    const res = await request.get('/products')
    if (res.data.code === 200) {
      products.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 加入购物车
const addToCart = (product) => {
  cartStore.addToCart(product)
  ElMessage.success(`${product.name} 已加入购物车`)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-container {
  padding: 20px;
}
.card-header {
  font-weight: bold;
}
</style>