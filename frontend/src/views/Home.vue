<template>
  <div class="home-container">
    <el-carousel height="300px">
      <el-carousel-item v-for="item in banners" :key="item">
        <div style="background:#409EFF; height:100%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:24px;">
          {{ item }}
        </div>
      </el-carousel-item>
    </el-carousel>
    <h2 style="margin-top:20px;">热门商品推荐</h2>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in hotProducts" :key="item.id">
        <el-card shadow="hover" style="margin-bottom:20px;">
          <h3>{{ item.name }}</h3>
          <p style="color:red;">¥{{ item.price }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '../utils/request';

const banners = ['跨境电商大促', '全场包邮', '正品保障'];
const hotProducts = ref([]);

onMounted(async () => {
  const res = await request.get('/products');
  if (res.data.code === 200) hotProducts.value = res.data.data.slice(0, 4);
});
</script>