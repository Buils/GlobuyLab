<template>
  <div class="product-container">
    <h2>商品展示</h2>
    <div style="display: flex;">
      <!-- 左侧分类栏 -->
      <div style="width: 200px; margin-right: 20px;">
        <el-card>
          <h3>商品分类</h3>
          <el-menu @select="handleCategorySelect">
            <el-menu-item index="">全部商品</el-menu-item>
            <el-menu-item v-for="cat in categories" :key="cat.id" :index="String(cat.id)">
              {{ cat.name }}
            </el-menu-item>
          </el-menu>
        </el-card>
      </div>

      <!-- 右侧商品列表 -->
      <div style="flex: 1;">
        <div v-if="loading">加载中...</div>
        <el-row :gutter="20" v-else>
          <el-col :span="8" v-for="item in products" :key="item.id">
            <el-card shadow="hover" style="margin-bottom: 20px;">
              <template #header><div class="card-header">{{ item.name }}</div></template>
              <p>价格：¥{{ item.price }}</p>
              <p>描述：{{ item.description }}</p>
              <el-button type="primary" size="small" @click="addToCart(item)">加入购物车</el-button>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import request from '../utils/request';
import { useCartStore } from '../stores/cart';
import { ElMessage } from 'element-plus';

const route = useRoute();
const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const cartStore = useCartStore();

const fetchProducts = async (categoryId = '', keyword = '') => {
  loading.value = true;
  try {
    let url = '/products?';
    if (categoryId) url += `categoryId=${categoryId}&`;
    if (keyword) url += `keyword=${keyword}`;
    const res = await request.get(url);
    if (res.data.code === 200) products.value = res.data.data;
  } catch (error) { ElMessage.error('获取商品列表失败'); }
  finally { loading.value = false; }
};

const fetchCategories = async () => {
  const res = await request.get('/categories');
  if (res.data.code === 200) categories.value = res.data.data;
};

const handleCategorySelect = (index) => {
  fetchProducts(index);
};

const addToCart = (product) => {
  cartStore.addToCart(product);
  ElMessage.success(`${product.name} 已加入购物车`);
};

onMounted(() => {
  fetchCategories();
  const keyword = route.query.keyword || '';
  fetchProducts('', keyword);
});
</script>

<style scoped>
.product-container { padding: 20px; }
.card-header { font-weight: bold; }
</style>