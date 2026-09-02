<template>
  <div class="home-container">
    <!-- 顶部轮播图 -->
    <el-carousel height="400px" style="border-radius: 8px; overflow: hidden;">
      <el-carousel-item v-for="item in banners" :key="item">
        <div :style="{ background: item.bg, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', fontWeight: 'bold' }">
          {{ item.text }}
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 热门商品推荐 -->
    <h2 style="margin: 30px 0 20px; font-size: 24px;">🔥 热门商品推荐</h2>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in hotProducts" :key="item.id">
        <el-card shadow="hover" :body-style="{ padding: '0px' }" style="cursor: pointer; border-radius: 8px; margin-bottom: 20px;" @click="$router.push(`/product/${item.id}`)">
          <img :src="item.image_url" style="width: 100%; height: 200px; object-fit: cover;" />
          <div style="padding: 14px;">
            <h3 style="font-size: 16px; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ item.name }}</h3>
            <p style="color: #e4393c; font-size: 20px; font-weight: bold;">¥{{ item.price }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '../utils/request';

const banners = [
  { text: '跨境电商 全球好物', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { text: '全场包邮 正品保障', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
];
const hotProducts = ref([]);

onMounted(async () => {
  const res = await request.get('/products');
  if (res.data.code === 200) hotProducts.value = res.data.data.slice(0, 8);
});
</script>