<template>
  <div class="user-container">
    <h2>我的订单</h2>
    <el-form :inline="true" @submit.prevent="fetchOrders">
      <el-form-item label="订单Token">
        <el-input v-model="token" placeholder="请输入下单时生成的Token" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchOrders">查询订单</el-button>
      </el-form-item>
    </el-form>
    
    <el-empty v-if="orders.length === 0 && !loading" description="暂无订单记录" />
    <el-card v-for="order in orders" :key="order.id" style="margin-bottom: 15px;">
      <template #header>
        <div style="display: flex; justify-content: space-between;">
          <span>订单号：{{ order.id }}</span>
          <el-tag :type="order.status === '待支付' ? 'warning' : 'success'">{{ order.status }}</el-tag>
        </div>
      </template>
      <p>收货地址：{{ order.address }}</p>
      <p>总金额：<span style="color:red; font-weight:bold;">¥{{ order.total_amount }}</span></p>
      <el-divider />
      <div v-for="item in order.items" :key="item.id" style="margin-bottom: 5px;">
        <span>商品：{{ item.product_name }} | 单价：¥{{ item.price }} | 数量：{{ item.quantity }}</span>
      </div>
    </el-card>

    <div style="margin-top: 20px; text-align: center;">
      <el-link type="danger" @click="$router.push('/contact')">忘记Token？点击联系我们找回</el-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';

const token = ref('');
const orders = ref([]);
const loading = ref(false);

const fetchOrders = async () => {
  if (!token.value.trim()) return ElMessage.warning('请输入Token');
  loading.value = true;
  try {
    const res = await request.get(`/orders/by-token?token=${token.value}`);
    if (res.data.code === 200) {
      orders.value = res.data.data;
      if (orders.value.length === 0) ElMessage.info('未找到相关订单');
    }
  } catch (error) { ElMessage.error('查询失败'); }
  finally { loading.value = false; }
};
</script>