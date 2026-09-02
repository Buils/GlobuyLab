<template>
  <div class="product-detail-container">
    <!-- 顶部面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/product' }">全部商品</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div v-if="loading" style="text-align: center; padding: 100px; font-size: 18px;">
      <el-icon class="is-loading"><Loading /></el-icon> 正在加载商品信息...
    </div>

    <el-card v-else-if="product" class="detail-card">
      <div class="detail-body">
        <!-- 左侧：商品图片区域 -->
        <div class="detail-image">
          <div class="main-image">
            <img :src="product.image_url" :alt="product.name" />
          </div>
        </div>

        <!-- 右侧：商品信息区域 -->
        <div class="detail-info">
          <h1 class="product-title">{{ product.name }}</h1>
          <p class="product-desc">{{ product.description }}</p>
          
          <!-- 价格区域 -->
          <div class="price-box">
            <span class="price-label">价格：</span>
            <span class="price-value">¥{{ product.price }}</span>
          </div>

          <!-- 模拟规格选择 -->
          <div class="spec-box" v-if="product.specs && product.specs.length">
            <p class="spec-label">颜色：</p>
            <div class="spec-options">
              <el-tag 
                v-for="(color, index) in product.specs" 
                :key="color" 
                :effect="selectedColor === index ? 'dark' : 'plain'"
                @click="selectedColor = index"
                class="spec-tag"
              >
                {{ color }}
              </el-tag>
            </div>
          </div>

          <!-- 数量选择 -->
          <div class="quantity-box">
            <span class="spec-label">数量：</span>
            <el-input-number v-model="quantity" :min="1" :max="99" />
          </div>

          <!-- 操作按钮 -->
          <div class="action-box">
            <el-button type="primary" size="large" @click="handleAddToCart" :loading="adding">
              加入购物车
            </el-button>
            <!-- 直接加购后并跳到checkout -->
            <el-button size="large" @click="$router.push('/checkout')">去购物车结算</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-empty v-else description="抱歉，商品不存在或已被下架" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { ElMessage } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';
import request from '../utils/request';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref(null);
const loading = ref(true);
const adding = ref(false);
const quantity = ref(1);
const selectedColor = ref(0);

// 获取商品详情
const fetchProductDetail = async () => {
  loading.value = true;
  const productId = route.params.id;
  try {
    const res = await request.get(`/products/${productId}`);
    if (res.data.code === 200) {
      product.value = res.data.data;
    } else {
      ElMessage.error('获取商品信息失败');
    }
  } catch (error) {
    ElMessage.error('网络请求异常');
  } finally {
    loading.value = false;
  }
};

// 加入购物车逻辑
const handleAddToCart = () => {
  if (!product.value) return;
  adding.value = true;
  
  // 模拟网络延迟
  setTimeout(() => {
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image_url: product.value.image_url,
      quantity: quantity.value
    });
    ElMessage.success(`已将 ${quantity.value} 件商品加入购物车`);
    adding.value = false;
  }, 500);
};

onMounted(() => {
  fetchProductDetail();
});
</script>

<style scoped>
.product-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.detail-card {
  margin-top: 20px;
}
.detail-body {
  display: flex;
  gap: 40px;
}
.detail-image .main-image {
  width: 450px;
  height: 450px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-image .main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.detail-info {
  flex: 1;
}
.product-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  line-height: 1.4;
}
.product-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}
.price-box {
  background: #fdf6ec;
  padding: 15px 20px;
  border-radius: 4px;
  margin-bottom: 25px;
}
.price-label { font-size: 14px; color: #999; }
.price-value { font-size: 28px; color: #e4393c; font-weight: bold; margin-left: 10px; }

.spec-box, .quantity-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.spec-label { font-size: 14px; color: #999; width: 60px; }
.spec-tag { cursor: pointer; margin-right: 10px; }

.action-box {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}
</style>