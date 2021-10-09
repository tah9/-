<template>
  <div class="content-view">
    <div class="he-follow">
      <div class="text-div">{{uid===$root.getUser().uid?'我':'TA'}}关注的人
        <van-icon name="arrow"/>
      </div>
      <div class="he-follow-list">
        <div class="follow-item" v-for="follow in follows">
          <div class="follow-item-root">
            <img :src="follow.userAvatar" class="follow-item-avt">
            <div class="follow-item-name">{{follow.username}}</div>
          </div>
        </div>
      </div>
    </div>
      <div class="text-div2">{{uid===$root.getUser().uid?'我':'TA'}}的热门动态
      <van-icon name="arrow"/>
    </div>
    <div class="list-view" >
      <ListItem :item="item" v-for="item in rows"></ListItem>
<!--      <van-loading color="#0f9d58" />-->
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
      rows: null,
      follows:null,
    }
  },
  components: {
    ListItem,
    RecommendArticle
  },
  created() {
    let _this=this
    this.$nextTick(()=>{

    })
  },
  watch:{
    uid(nv,ov){
      console.log(nv);
      if (nv!==null){
        request.get("/article/get?uid="+nv+"&pagerSize=1000").then(res => {
          if (this.rows === null) {
            this.rows = res.rows
          } else {
            this.rows.push(...res.rows)
          }
          this.loading = false
        })
        request.get('/user/allFollow/'+nv).then(res=>{
          console.log(res);
          this.follows=res.rows
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.content-view {
  background: @bg-color;
}
.he-follow{
  margin: @item-margin;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
.follow-item-name{
  text-align: center;
  width: 5em;
  height: 3em;
  font-size: 14px;
  white-space: pre-wrap;
  word-break:break-all
}
.follow-item-root{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.follow-item-avt {
  border-radius: 50%;
  width: 3.5em;
  height:  3.5em;
  margin-left: 0.3em;
  overflow: hidden;
}
.he-follow-list{
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
.he-follow-list::-webkit-scrollbar{
  display: none;
}
.follow-item{
  display: inline-block;
  padding: 0 @item-margin;
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
}.text-div2 {
  padding: 0 @item-margin @item-margin @item-margin  ;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>