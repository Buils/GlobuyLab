<script setup>

</script>

<template>
  <div id="app">
    <el-menu mode="horizontal" :router="true">
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/product">商品展示</el-menu-item>
      <el-menu-item index="/cart">购物车</el-menu-item>
      <el-menu-item index="/user">用户中心</el-menu-item>
    </el-menu>
    <div style="padding: 20px;">
      <router-view></router-view>
    </div>
  </div>
</template>
