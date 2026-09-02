<template>
  <div>
    <el-switch
      v-model="isDarkMode"
      style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #ccc"
      :active-action-icon="Moon"
      :inactive-action-icon="Sunny"
      @change="changeThemeMode()"
      ref="themeSwitch"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'

const isDarkMode = ref(false)
const themeSwitch = ref(null)

const changeThemeMode = () => {
  localStorage.setItem('darkMode', isDarkMode.value.toString())

  // 不支持视图过渡API直接降级
  if (!document.startViewTransition) {
    document.documentElement.classList.toggle('dark')
    return
  }

  const rect = themeSwitch.value.$el.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  const transition = document.startViewTransition(() => {
    document.documentElement.classList.toggle('dark')
  })

  transition.ready.then(() => {
    // ⭐官网精髓！！这里不要用isDarkMode.value，实时读取DOM状态
    const nowDark = document.documentElement.classList.contains('dark')

    const clipPath = [
      `circle(0 at ${x}px ${y}px)`,
      `circle(${radius}px at ${x}px ${y}px)`
    ]

    document.documentElement.animate(
      {
        clipPath: nowDark ? clipPath.reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-in-out',
        pseudoElement: nowDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
  })
}

onMounted(() => {
  if (localStorage.getItem('darkMode') === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }
})
</script>

<style>
/* Element‑Plus官网原版样式，不要修改！ */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

.dark::view-transition-old(root) {
  z-index: 2147483646;
}
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-old(root) {
  z-index: 1;
}
::view-transition-new(root) {
  z-index: 2147483646;
}
</style>
