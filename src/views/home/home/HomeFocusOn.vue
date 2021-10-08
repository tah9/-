<template>
  <div>
    <MySwiper sleep-time="3000" :height="'100px'" class="swiper">
      <div><img class="test" src="https://img01.yzcdn.cn/vant/cat.jpeg"></div>
      <div><img class="test" src="https://t7.baidu.com/it/u=4198287529,2774471735&fm=193&f=GIF"></div>
      <div><img class="test" src="https://t7.baidu.com/it/u=1956604245,3662848045&fm=193&f=GIF"></div>
      <div><img class="test" src="https://t7.baidu.com/it/u=2529476510,3041785782&fm=193&f=GIF"></div>
    </MySwiper>
  </div>
</template>

<script>
import MySwiper from "@/views/home/home/compone/MySwiper";

export default {
  components: {
    MySwiper
  }
}
</script>

<style scoped>
.swiper{
  object-fit: cover;
}
</style>