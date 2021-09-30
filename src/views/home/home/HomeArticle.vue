<template>
  <div>
    <div class="recommend_top">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item><img src="http://i5.7k7kimg.cn/cms/cms10/20210304/142402_3507.jpg"></van-swipe-item>
        <van-swipe-item><img src="http://i5.7k7kimg.cn/cms/cms10/20210304/142402_3507.jpg"></van-swipe-item>
        <van-swipe-item><img src="http://i5.7k7kimg.cn/cms/cms10/20210304/142402_3507.jpg"></van-swipe-item>
        <van-swipe-item><img src="http://i5.7k7kimg.cn/cms/cms10/20210304/142402_3507.jpg"></van-swipe-item>
      </van-swipe>
    </div>
    <RecommendArticle ></RecommendArticle>
  </div>
</template>

<script>
import RecommendArticle from "@/views/home/home/compone/RecommendArticle";
import request from "@/network/request";

export default {
  name: "HomeArticle",
  components: {
    RecommendArticle
  },
  data() {
    return {
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="less">
.recommend_top {
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