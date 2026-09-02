<template>
  <div class="checkout-container">
    <h2>确认订单</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="收货人" prop="user_name"><el-input v-model="form.user_name" /></el-form-item>
      <el-form-item label="电话" prop="phone"><el-input v-model="form.phone" /></el-form-item>
      <el-form-item label="邮箱" prop="email"><el-input v-model="form.email" /></el-form-item>
      <el-form-item label="地址" prop="address"><el-input v-model="form.address" /></el-form-item>
      <el-form-item label="Visa卡号" prop="cardNumber">
        <el-input v-model="form.cardNumber" maxlength="16" placeholder="模拟成功请输入16个4" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handlePay('success')" :loading="loading">模拟支付成功</el-button>
        <el-button type="danger" @click="handlePay('fail')" :loading="loading">模拟支付失败</el-button>
      </el-form-item>
    </el-form>

    <!-- 核心：支付成功后展示 Token -->
    <el-result v-if="payResult" :icon="payResult.success ? 'success' : 'error'" :title="payResult.title">
      <template #extra>
        <div v-if="payResult.success" style="background: #f5f5f5; padding: 15px; border-radius: 8px; word-break: break-all;">
          <p>您的专属订单Token：</p>
          <h3 style="color: #409EFF;">{{ payResult.token }}</h3>
          <p style="color: #999; font-size: 12px;">请务必复制保存此Token，用于查询订单！</p>
        </div>
        <el-button type="primary" @click="$router.push('/user')">前往我的订单</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import request from '../utils/request';
import { ElMessage } from 'element-plus';

const router = useRouter();
const cartStore = useCartStore();
const formRef = ref(null);
const loading = ref(false);
const payResult = ref(null);

// 表单数据
const form = ref({ user_name: '', phone: '', email: '', address: '', cardNumber: '' });

// 表单校验规则
const rules = {
  user_name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  address: [{ required: true, message: '请输入收件地址', trigger: 'blur' }],
  cardNumber: [{ required: true, message: '请输入16位卡号', trigger: 'blur' }]
};

const handlePay = async (type) => {
  // 1. 校验表单
  await formRef.value.validate();
  
  // 2. 校验卡号长度
  if (form.value.cardNumber.length !== 16) {
    return ElMessage.error('卡号必须为16位数字！');
  }

  loading.value = true;

  // 3. 模拟支付失败
  if (type === 'fail') {
    setTimeout(() => {
      loading.value = false;
      ElMessage.error('支付失败：银行系统拒绝交易！');
    }, 1000);
    return;
  }

  // 4. 模拟支付成功逻辑
  if (form.value.cardNumber !== '4444444444444444') {
    loading.value = false;
    return ElMessage.error('支付失败：卡号验证未通过（成功需输入16个4）！');
  }

  try {
    // 👈 核心：把购物车里的商品（包含数量）和用户信息一起发给后端
    const res = await request.post('/orders', { 
      items: cartStore.cartItems, 
      ...form.value 
    });
    
    if (res.data.code === 200) {
      // 展示支付成功结果和 Token
      payResult.value = { 
        success: true, 
        title: '支付成功！', 
        token: res.data.data.token 
      };
      // 清空购物车（Pinia 会自动清空 localStorage）
      cartStore.clearCart(); 
    }
  } catch (error) { ElMessage.error('订单创建失败'); }
  finally { loading.value = false; }
};
</script>