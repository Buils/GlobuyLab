<template>
    <!-- 分开左右，左边导航和logo ，右边是主题切换和搜索 -->
    <!-- 管理员页不显示头部 -->
    <div class="header" v-if="!$route.name === 'admin'" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px;">
      <div style="display: flex; align-items: center;">
        <h1 style="margin: 0 10px 0 0;cursor: pointer;" @click="$router.push('/')">Globuy</h1>

        <!-- 菜单列表 -->
        <el-menu mode="horizontal" :router="true" style="background: transparent; border-bottom: none;width: 500px;">
          <el-menu-item index="/product">商品展示</el-menu-item>
          <el-menu-item index="/user">用户中心</el-menu-item>
          <el-menu-item index="/fetchorders">我的订单</el-menu-item>
          <el-menu-item index="/contact">联系我们</el-menu-item>
          <el-menu-item index="/admin">管理员</el-menu-item>
        </el-menu>
      </div>
  
      <!-- 搜索框 -->
      <div style="display: flex; align-items: center; gap: 20px;">
        <ThemeSwitch />
        <el-input placeholder="搜索商品" style="width: 220px;" />
        <el-button type="primary" @click="">搜索</el-button>
        <el-badge :value="cartStore.cartItemTotal" :hidden="cartStore.cartItemTotal === 0" :max="99">
          <el-icon @click="$router.push('/cart')" style="cursor: pointer; font-size: 22px;">
            <ShoppingCart />
          </el-icon>
        </el-badge>
      </div>···
    </div>

    <!-- router-view 显示路由组件 -->
    <div style="padding: 20px;">
      <router-view></router-view>
    </div>


</template>

<script setup>
import { useCartStore } from './stores/cart'; // 注意：根据你的实际路径调整
import ThemeSwitch from './components/ThemeSwitch.vue';
import { ShoppingCart } from '@element-plus/icons-vue';
const cartStore = useCartStore();
</script>·