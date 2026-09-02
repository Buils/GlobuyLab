<template>
  <div class="admin-container">
    <!-- 1. 未登录状态：显示登录表单 -->
    <div v-if="!isLoggedIn" class="login-box">
      <h2>管理员后台登录</h2>
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="handleLogin" :loading="loading">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 2. 已登录状态：显示后台管理面板 -->
    <div v-else>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Globuy 跨境电商后台</h2>
        <el-button type="danger" size="small" @click="handleLogout">安全退出</el-button>
      </div>

      <el-tabs v-model="activeTab">
        <!-- 商品管理 -->
        <el-tab-pane label="商品管理" name="products">
          <el-button type="primary" style="margin-bottom:10px;" @click="showAddProductDialog = true">新增商品</el-button>
          <el-button type="success" style="margin-bottom:10px; margin-left:10px;" @click="triggerImport('category')">导入分类(CSV)</el-button>
          <el-button type="warning" style="margin-bottom:10px; margin-left:10px;" @click="triggerImport('product')">导入商品(CSV)</el-button>

          <!-- 隐藏的文件选择器 -->
          <input type="file" ref="fileInput" accept=".csv" style="display: none;" @change="handleFileChange" />
          <el-table :data="products" border>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="price" label="价格" width="120" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button size="small" type="danger" @click="handleDeleteProduct(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 订单管理 -->
        <el-tab-pane label="订单管理" name="orders">
          <el-table :data="orders" border>
            <el-table-column prop="id" label="订单号" width="80" />
            <el-table-column prop="user_name" label="收货人" width="120" />
            <el-table-column prop="total_amount" label="总金额" width="120" />
            <el-table-column label="当前状态" width="150">
              <template #default="{ row }">
                <el-select v-model="row.status" size="small" @change="val => updateOrderStatus(row.id, val)">
                  <el-option label="待支付" value="待支付" />
                  <el-option label="已发货" value="已发货" />
                  <el-option label="已完成" value="已完成" />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 用户反馈管理 -->
        <el-tab-pane label="用户反馈" name="feedbacks">
          <el-table :data="feedbacks" border>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="email" label="用户邮箱" width="200" />
            <el-table-column prop="message" label="反馈内容" />
            <el-table-column prop="created_at" label="反馈时间" width="180" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增商品弹窗 -->
  <el-dialog v-model="showAddProductDialog" title="新增商品" width="600px">
    <el-form :model="newProduct" label-width="100px">
      <el-form-item label="商品名称">
        <el-input v-model="newProduct.name" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="图片链接">
        <el-input v-model="newProduct.image_url" placeholder="请输入商品图片URL" />
      </el-form-item>
      <el-form-item label="原价">
        <el-input-number v-model="newProduct.original_price" :min="0" :precision="2" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="特价(现价)">
        <el-input-number v-model="newProduct.price" :min="0" :precision="2" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="newProduct.spec" placeholder="例如: 256G 黑色" />
      </el-form-item>
      <el-form-item label="关联分类ID">
        <el-input-number v-model="newProduct.category_id" :min="1" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input v-model="newProduct.description" type="textarea" :rows="3" placeholder="请输入商品描述" />
      </el-form-item>
      <el-form-item label="上架状态">
        <el-switch v-model="newProduct.is_on_sale" active-text="上架" inactive-text="下架" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddProductDialog = false">取消</el-button>
      <el-button type="primary" @click="handleAddProduct" :loading="adding">确认添加</el-button>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';
import Papa from 'papaparse';

// ================= 核心：解决刷新丢失登录状态的问题 =================
// 1. 初始化时，从 localStorage 读取保存的 Token
const isLoggedIn = ref(!!localStorage.getItem('globuy_admin_token'));
const activeTab = ref('products');
const loading = ref(false);

// 2. 监听登录状态，一旦登录成功，将 Token 存入 localStorage
watch(isLoggedIn, (newVal) => {
  if (newVal) {
    localStorage.setItem('globuy_admin_token', 'true');
    fetchData(); // 登录成功后加载数据
  } else {
    localStorage.removeItem('globuy_admin_token');
  }
});

// 3. 退出登录时，清除状态和本地存储
const handleLogout = () => {
  isLoggedIn.value = false;
  ElMessage.success('已安全退出');
};
// ================================================================

// ================= 登录逻辑 =================
const loginForm = ref({ username: '', password: '' });
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    return ElMessage.warning('请输入账号和密码');
  }
  loading.value = true;
  try {
    const res = await request.post('/auth/login', loginForm.value);
    if (res.data.code === 200) {
      isLoggedIn.value = true;
      ElMessage.success('登录成功');
    }
  } catch (error) {
    ElMessage.error('账号或密码错误');
  } finally {
    loading.value = false;
  }
};

// ================= 数据获取 =================
const products = ref([]);
const orders = ref([]);
const feedbacks = ref([]);

const fetchData = async () => {
  const [pRes, oRes, fRes] = await Promise.all([
    request.get('/products'),
    request.get('/orders/all'),
    request.get('/feedbacks')
  ]);
  if (pRes.data.code === 200) products.value = pRes.data.data;
  if (oRes.data.code === 200) orders.value = oRes.data.data;
  if (fRes.data.code === 200) feedbacks.value = fRes.data.data;
};

// ================= 商品管理操作 =================
const showAddProductDialog = ref(false);
// 新增商品表单数据（增加了原价、规格、上架状态）
const newProduct = ref({ 
  name: '', 
  price: 0, 
  original_price: 0, 
  spec: '', 
  description: '', 
  image_url: '', 
  category_id: 1, 
  is_on_sale: true // 默认上架
});

// 添加商品的提交逻辑
const adding = ref(false);
const handleAddProduct = async () => {
  if (!newProduct.value.name || newProduct.value.price <= 0) {
    return ElMessage.warning('商品名称和价格不能为空');
  }
  
  adding.value = true;
  try {
    // 👇 注意：后端接收的字段名必须和这里完全一致
    const res = await request.post('/products', {
      name: newProduct.value.name,
      price: newProduct.value.price,
      original_price: newProduct.value.original_price,
      spec: newProduct.value.spec,
      description: newProduct.value.description,
      image_url: newProduct.value.image_url,
      category_id: newProduct.value.category_id,
      is_on_sale: newProduct.value.is_on_sale ? 1 : 0 // 将布尔值转为 1 或 0 存入数据库
    });
    
    if (res.data.code === 200) {
      ElMessage.success('商品添加成功');
      showAddProductDialog.value = false;
      // 重置表单
      newProduct.value = { 
        name: '', price: 0, original_price: 0, spec: '', 
        description: '', image_url: '', category_id: 1, is_on_sale: true 
      };
      fetchData(); // 刷新商品列表
    }
  } catch (error) {
    ElMessage.error('添加失败，请检查后端日志');
  } finally {
    adding.value = false;
  }
};

const handleDeleteProduct = async (id) => {
  await request.delete(`/products/${id}`);
  ElMessage.success('商品已删除');
  fetchData();
};

// ================= 批量导入商品管理操作 =================

const fileInput = ref(null);
const importType = ref('');

// 触发文件选择
const triggerImport = (type) => {
  importType.value = type;
  fileInput.value.click();
};

// 处理文件读取与解析
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true, // 将第一行作为表头
    skipEmptyLines: true,
    complete: async (results) => {
      const data = results.data;
      try {
        if (importType.value === 'category') {
          // 导入分类
          const categories = data.map(row => ({ name: row['分类名称'] }));
          const res = await request.post('/products/import-categories', { categories });
          ElMessage.success(res.data.message);
        } else if (importType.value === 'product') {
          // 导入商品（字段映射）
          const products = data.map(row => ({
            name: row['产品名'],
            price: parseFloat(row['特价']) || 0,
            original_price: parseFloat(row['原价']) || 0,
            spec: row['规格'] || '',
            description: row['描述'] || '',
            image_url: row['图片地址'] || '',
            category_name: row['关联分类名称'] || '', // 核心修改：传递分类名称，而不是ID
            is_on_sale: row['是否上架'] === '下架' ? 0 : 1
          }));
          const res = await request.post('/products/import-products', { products });
          ElMessage.success(res.data.message);
        }
        fetchData(); // 导入成功后刷新表格
      } catch (error) {
        ElMessage.error('导入失败，请检查CSV格式');
      }
    },
    error: (err) => {
      ElMessage.error('CSV解析失败: ' + err.message);
    }
  });
  
  // 重置 input，允许重复选择同一个文件
  e.target.value = ''; 
};

// ================= 订单管理操作 =================
const updateOrderStatus = async (id, status) => {
  await request.put(`/orders/${id}/status`, { status });
  ElMessage.success('订单状态已更新');
};

// ================= 页面初始化 =================
onMounted(() => {
  // 如果页面刷新时检测到已经登录，自动拉取数据
  if (isLoggedIn.value) fetchData();
});
</script>

<style scoped>
.admin-container { }
.login-box { max-width: 400px; margin: 100px auto; padding: 30px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); }
</style>