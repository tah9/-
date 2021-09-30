<template>
  <div class="content-view">
    <div class="text-div">他的热门动态
      <van-icon name="arrow"/>
    </div>
    <div class="list-view">
      <ListItem :item="item" v-for="item in rows"></ListItem>
    </div>
  </div>
</template>

<script>
import RecommendArticle from "@/views/home/home/compone/RecommendArticle";
import ListItem from "@/components/ListItem";
import request from "@/network/request";

export default {
  name: "UserContent",
  props: {
    uid: null
  },
  data() {
    return {
      rows: null
    }
  },
  components: {
    ListItem,
    RecommendArticle
  },
  watch:{
    uid(nv,ov){
      if (nv!==null)
      request.get("/article/user/"+nv+ "?pagerSize=1000").then(res => {
        if (this.rows === null) {
          this.rows = res.rows
        } else {
          this.rows.push(...res.rows)
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.content-view {
}
.list-view {
  display: flex;
  flex-direction: column;
}
.text-div {
  padding: @item-margin;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>