<template>
  <div class="user-container">
    <h2>我的订单</h2>
    <div style="margin-bottom: 20px; display: flex; align-items: center;">
      <el-input v-model="userName" placeholder="请输入姓名查询订单" style="width: 300px; margin-right: 10px;" />
      <el-button type="primary" @click="fetchOrders">查询订单</el-button>
    </div>
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';

const userName = ref('');
const orders = ref([]);
const loading = ref(false);

const fetchOrders = async () => {
  if (!userName.value.trim()) return ElMessage.warning('请输入姓名');
  loading.value = true;
  try {
    const res = await request.get(`/orders?name=${userName.value}`);
    if (res.data.code === 200) {
      orders.value = res.data.data;
      if (orders.value.length === 0) ElMessage.info('暂无订单');
    }
  } catch (error) { ElMessage.error('查询失败'); }
  finally { loading.value = false; }
};
</script>