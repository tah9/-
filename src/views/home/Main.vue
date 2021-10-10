<template>
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <van-tabbar v-model="active" z-index="999" route active-color="#0f9d58">
        <van-tabbar-item icon="wap-home" replace to="/main/home">首页</van-tabbar-item>
      <van-tabbar-item icon="search" replace to="/main/center">标签</van-tabbar-item>
      <van-tabbar-item icon="manager" replace to="/main/mine">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>

export default {
  name: "Home",
  data() {
    return {
      active: 2
    }
  },
  methods: {},
  mounted() {

  }
}
</script>

<style lang="less" scoped>

</style>