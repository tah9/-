<template>
  <div>
    <div class="recommend_top">
      <van-swipe class="my-swipe" height="100px" :autoplay="3000" indicator-color="white">
        <van-swipe-item><img class="simg" src="https://img95.699pic.com/photo/40179/9317.jpg_wh300.jpg">
        </van-swipe-item>
        <van-swipe-item><img class="simg" src="https://i3.miyangsheng.com/40687c/113c2bb7ab83dfbdb76562f310.jpg">
        </van-swipe-item>
      </van-swipe>
      <div class="icons">
        <div>
          <img src="/api/graduate/emoji/systeam/干货.jpg" style="transform: scale(1.8)">
          干货
        </div>
        <div>
          <img src="/api/graduate/emoji/systeam/编辑.jpg">
          编辑精选
        </div>
        <div>
          <img src="/api/graduate/emoji/systeam/赛事.jpg">
          赛事
        </div>
        <div>
          <img src="/api/graduate/emoji/systeam/人群.jpg" style="transform: scale(1.2)">
          质量用户
        </div>
        <div>
          <img src="/api/graduate/emoji/systeam/更多.jpg">
          更多
        </div>
      </div>
    </div>
    <RecommendArticle></RecommendArticle>
  </div>
</template>

<script>
import RecommendArticle from "@/views/home/home/compone/RecommendArticle";
import request from "@/network/request";
import MySwiper from "@/views/home/home/compone/MySwiper";

export default {
  name: "HomeArticle",
  components: {
    RecommendArticle, MySwiper
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

.icons img {
  padding: 6px;
  box-sizing: border-box;
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

.my-swipe, .van-swipe-item {
  color: #fff;
  font-size: 20px;
  height: 100px;
  text-align: center;
}

.simg {
  height: 100px;
  width: 100%;
  object-fit: cover;
}
</style>