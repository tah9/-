<template>
<div>
  <van-tabs v-model="active">
    <van-tab title="关注">
    </van-tab>
    <van-tab title="推荐">
      <div class="recommend_top">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item>1</van-swipe-item>
          <van-swipe-item>2</van-swipe-item>
          <van-swipe-item>3</van-swipe-item>
          <van-swipe-item>4</van-swipe-item>
        </van-swipe>
      </div>

    </van-tab>
    <van-tab title="热榜"></van-tab>
    <van-tab title="内容"></van-tab>
  </van-tabs>
</div>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      active:1
    }
  }
}
</script>

<style scoped>
.recommend_top{
  margin: 8px;
  border-radius: 8px;
  overflow: hidden;
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
</style>