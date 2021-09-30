<template>
  <div class="root">
    <div class="input-search">
      <img :src="userAvatar">
      <input type="search">
      <van-icon name="/api/graduate/emoji/systeam/通知.jpg"/>
      <span @click="$router.push('/publishArticle')">+</span>
    </div>
    <van-tabs v-model="active" class="tab-root" sticky >
      <van-tab title="关注" class="tab-item">
        <HomeFocusOn></HomeFocusOn>
      </van-tab>
      <van-tab title="推荐" class="tab-item">
        <HomeArticle></HomeArticle>
      </van-tab>
      <van-tab title="话题" class="tab-item">
        <HomeTags></HomeTags>
      </van-tab>
      <van-tab title="热榜" class="tab-item">

      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import request from "@/network/request";
import HomeTags from "@/views/home/home/HomeTags";
import HomeArticle from "@/views/home/home/HomeArticle";
import HomeFocusOn from "@/views/home/home/HomeFocusOn";

export default {
  name: "Home",
  data() {
    return {
      active: 1,
      searchValue: '',
      userAvatar:this.$root.getUser().userAvatar
    }
  },
  components: {
    HomeFocusOn,
    HomeArticle,
    HomeTags,
  },
  methods: {},
  mounted() {

  }
}
</script>

<style scoped lang="less">
@search-content-background-color: red;
@search-icon-color: #757575;

.input-search {
  display: flex;
  padding: @item-margin;
  justify-content: space-between;
}

.input-search input {
  border-radius: 50px;
  border-style: none;
  background-color: @bg-color;
  max-width: 60%;
  background-image: url("/api/graduate/emoji/systeam/搜索.jpg"); /*设置小图标为背景*/
  background-size: 22px 22px; /*设置小图标的 大小*/
  background-position: 3px 0px; /*设置小图标的位置*/
  background-repeat: no-repeat; /*设置小图标不重复*/
  padding-left: 25px;
  padding-right: 3px;
  caret-color: @theme-color;

}

.input-search img {
  width: @icon-img-wh;
  height: @icon-img-wh;
  border-radius: 50%;
  flex-shrink: 0;
}

.input-search img:nth-child(2) {
  float: right;
}

.input-search span {
  float: right;
  text-align: center;
  line-height: @icon-img-wh;
  width: @icon-img-wh;
  height: @icon-img-wh;
  background: @theme-color;
  border-radius: 50px;
  color: white;
  flex-shrink: 0;
}

.tab-root {
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*right: 0;*/
  margin-bottom: 3em;
  background-color: @bg-color;
}

.tab-item {
  //overflow: scroll;
}


</style>