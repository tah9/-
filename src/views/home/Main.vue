<template>
<div>
  <router-view></router-view>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o" @click="$router.replace('/main/home')">标签</van-tabbar-item>
    <van-tabbar-item icon="search" @click="$router.replace('/main/center')">标签</van-tabbar-item>
    <van-tabbar-item icon="user-o" @click="$router.replace('/main/mine')">我</van-tabbar-item>
  </van-tabbar>
</div>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      active:2
    }
  },
  methods:{
  }
}
</script>

<style scoped>

</style>