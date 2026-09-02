<template>
  <div class="product-container">
    <h2>全部商品</h2>
    <div style="display: flex; gap: 20px;">
      <!-- 左侧分类栏 -->
      <div style="width: 200px;">
        <el-card shadow="never">
          <h3 style="margin-bottom: 15px;">商品分类</h3>
          <el-menu :default-active="currentCategoryId" @select="handleCategorySelect">
            <el-menu-item index="">全部商品</el-menu-item>
            <el-menu-item v-for="cat in categories" :key="cat.id" :index="String(cat.id)">
              {{ cat.name }}
            </el-menu-item>
          </el-menu>
        </el-card>
      </div>

      <!-- 右侧商品列表 -->
      <div style="flex: 1;">
        <div v-if="loading" style="text-align: center; padding: 50px;">加载中...</div>
        <el-empty v-else-if="products.length === 0" description="该分类下暂无商品" />
        <el-row :gutter="20" v-else>
          <el-col :span="6" v-for="item in products" :key="item.id">
            <el-card shadow="hover" :body-style="{ padding: '0px' }" style="margin-bottom: 20px; border-radius: 8px;">
              <img :src="item.image_url" style="width: 100%; height: 180px; object-fit: cover;" />
              <div style="padding: 15px;">
                <h3 style="font-size: 16px; margin-bottom: 8px; height: 40px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                  {{ item.name }}
                </h3>
                <p style="color: #e4393c; font-size: 20px; font-weight: bold; margin-bottom: 10px;">¥{{ item.price }}</p>
                <!-- 核心：快捷加入购物车按钮 -->
                <el-button type="primary" size="small" style="width: 100%;" @click="handleQuickAdd(item)">
                  加入购物车
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '../utils/request';
import { useCartStore } from '../stores/cart';
import { ElMessage } from 'element-plus';

const cartStore = useCartStore();
const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const currentCategoryId = ref('');

// 获取商品列表
const fetchProducts = async (categoryId = '') => {
  loading.value = true;
  try {
    let url = '/products';
    if (categoryId) url += `?categoryId=${categoryId}`;
    const res = await request.get(url);
    if (res.data.code === 200) products.value = res.data.data;
  } catch (error) { ElMessage.error('获取商品列表失败'); }
  finally { loading.value = false; }
};

// 获取分类列表
const fetchCategories = async () => {
  const res = await request.get('/categories');
  if (res.data.code === 200) categories.value = res.data.data;
};

// 分类切换
const handleCategorySelect = (index) => {
  currentCategoryId.value = index;
  fetchProducts(index);
};

// 快捷加入购物车（不跳转，只提示）
const handleQuickAdd = (product) => {
  cartStore.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image_url: product.image_url,
    quantity: 1
  });
  ElMessage.success(`【${product.name}】已成功加入购物车！`);
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<style scoped>
.product-container { padding: 20px; }
</style>