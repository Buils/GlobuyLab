<template>
  <div class="contact-container">
    <h2>联系我们</h2>
    <el-form :model="form" label-width="80px">
      <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
      <el-form-item label="留言"><el-input v-model="form.message" type="textarea" :rows="4" /></el-form-item>
      <el-form-item><el-button type="primary" @click="submitFeedback">提交</el-button></el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';

const form = ref({ email: '', message: '' });
const submitFeedback = async () => {
  await request.post('/feedbacks', form.value);
  ElMessage.success('感谢您的反馈！');
  form.value = { email: '', message: '' };
};
</script>