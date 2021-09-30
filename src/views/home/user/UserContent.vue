<template>
  <div class="content-view">
    <div class="text-div">他的热门动态 <van-icon name="arrow" /></div>
    <RecommendArticle></RecommendArticle>
  </div>
</template>

<script>
import RecommendArticle from "@/views/home/home/compone/RecommendArticle";

export default {
  name: "UserContent",
  components:{
    RecommendArticle
  }
}
</script>

<style scoped lang="less">
.content-view {
}
.text-div {
  padding: @item-margin;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>