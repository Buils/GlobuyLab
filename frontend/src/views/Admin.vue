<template>
  <div class="admin-container">
    <h2>后台管理系统</h2>
    <el-tabs>
      <!-- 1. 商品管理 -->
      <el-tab-pane label="商品管理">
        <el-button type="primary" style="margin-bottom:10px;" @click="showAddDialog = true">新增商品</el-button>
        <el-table :data="products" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="商品名" />
          <el-table-column prop="price" label="价格" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 2. 订单管理 -->
      <el-tab-pane label="订单管理">
        <el-table :data="orders" border>
          <el-table-column prop="id" label="订单号" width="80" />
          <el-table-column prop="user_name" label="用户" />
          <el-table-column prop="total_amount" label="金额" />
          <el-table-column prop="status" label="状态" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-select v-model="row.status" size="small" @change="val => updateStatus(row.id, val)">
                <el-option label="待支付" value="待支付" />
                <el-option label="已发货" value="已发货" />
                <el-option label="已完成" value="已完成" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 3. 分类管理（结构图要求） -->
      <el-tab-pane label="分类管理">
        <el-table :data="categories" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="分类名称" />
        </el-table>
      </el-tab-pane>

      <!-- 4. 顾客反馈/联系我们（结构图要求） -->
      <el-tab-pane label="顾客反馈">
        <el-table :data="feedbacks" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="email" label="顾客邮箱" />
          <el-table-column prop="message" label="留言内容" />
          <el-table-column prop="created_at" label="时间" />
        </el-table>
      </el-tab-pane>

      <!-- 5. 数据看板（结构图要求） -->
      <el-tab-pane label="数据看板">
        <el-row :gutter="20">
          <el-col :span="12"><el-card shadow="hover"><h3>总订单数</h3><p style="font-size:30px; color:#409EFF;">{{ stats.totalOrders }}</p></el-card></el-col>
          <el-col :span="12"><el-card shadow="hover"><h3>总销售额</h3><p style="font-size:30px; color:#67C23A;">¥{{ stats.totalSales }}</p></el-card></el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';

const products = ref([]);
const orders = ref([]);
const categories = ref([]);
const feedbacks = ref([]);
const stats = ref({ totalOrders: 0, totalSales: 0 });
const showAddDialog = ref(false);

const fetchData = async () => {
  const pRes = await request.get('/products');
  const oRes = await request.get('/orders/all');
  const cRes = await request.get('/categories');
  const fRes = await request.get('/feedbacks');
  const sRes = await request.get('/orders/stats');
  
  if (pRes.data.code === 200) products.value = pRes.data.data;
  if (oRes.data.code === 200) orders.value = oRes.data.data;
  if (cRes.data.code === 200) categories.value = cRes.data.data;
  if (fRes.data.code === 200) feedbacks.value = fRes.data.data;
  if (sRes.data.code === 200) stats.value = sRes.data.data;
};

const handleDelete = async (id) => {
  await request.delete(`/products/${id}`);
  ElMessage.success('删除成功'); fetchData();
};

const updateStatus = async (id, status) => {
  await request.put(`/orders/${id}/status`, { status });
  ElMessage.success('状态更新成功'); fetchData();
};

onMounted(fetchData);
</script>