<template>
  <div>
    <div class="recommend_top">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item><img src="http://i5.7k7kimg.cn/cms/cms10/20210304/142402_3507.jpg"></van-swipe-item>
        <van-swipe-item><img src="http://i5.7k7kimg.cn/cms/cms10/20210304/142402_3507.jpg"></van-swipe-item>
        <van-swipe-item><img src="http://i5.7k7kimg.cn/cms/cms10/20210304/142402_3507.jpg"></van-swipe-item>
        <van-swipe-item><img src="http://i5.7k7kimg.cn/cms/cms10/20210304/142402_3507.jpg"></van-swipe-item>
      </van-swipe>
      <div class="icons">
        <div>
          <img src="/api/graduate/emoji/systeam/干货.png">
          干货
        </div>
        <div>
          <img src="/api/graduate/emoji/systeam/干货.png">
          干货
        </div>
        <div>
          <img src="/api/graduate/emoji/systeam/干货.png">
          干货
        </div>
        <div>
          <img src="/api/graduate/emoji/systeam/干货.png">
          干货
        </div>
      </div>
    </div>
    <RecommendArticle url="/article/get"></RecommendArticle>
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
      active: 0,
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="less">
.icons {
  background: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.icons img{
  width: 40px;
  height: 40px;
}
.icons div {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.7em;
  line-height: 2em;
  margin: 5px 0;
}
.recommend_top {
  margin: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 100px;
  text-align: center;
  background-color: #39a9ed;
}
</style>