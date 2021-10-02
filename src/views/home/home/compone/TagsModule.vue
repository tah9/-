<template>
<div>
  <div class="tagbar">
    <div class="wrapper">
      <div class="tags">
        <div class="tag" v-for="(row,index) in rows" :key="index">
          <van-image height="60" width="60" :src="row.logo"></van-image>
          <div class="tag_desc">
            <span>{{row.title}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="banner" :style="styleCVar">
    <span>运动健康</span>
  </div>

  <div class="tabs">
    <van-tabs  swipeable type="card" color="#07c160">
      <van-tab v-for="(tab,index) in tabs" :key="index" :title="tab" ></van-tab>
    </van-tabs>
  </div>
</div>
</template>

<script>
export default {
  name: "TagsModule",
  data(){
    return {
      tabs:['推荐','热门','我的关注','交易','好物','玩机','情感'],
      clientW:0
    }
  },
  props:{
    rows:{
      type:Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style scoped lang="less">
@clientW: 0px;

.tagbar{
  width: 100vw;
  overflow: hidden;
  margin: 15px 0 -3px 0;
}
.wrapper{
  width: auto;
  height: auto;
  overflow-x: auto;
}
.wrapper::-webkit-scrollbar{
  width:0
}
.tags{
  width: auto;
  height: 60px;
  display: flex;
}
.tag{
  display: block;
  margin: 0 5px;
  flex: 1;
}
.van-image__img{
  border-radius: 5px;
}
.tag_desc{
  width: 50px;
  height: 50px;
  background-color: rgba(0,0,0,.1);
  border-radius: 5px;
  overflow: hidden;
  padding: 5px;
  text-align: center;
  line-height: 25px;
  position: relative;
  top: -65px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.banner{
  height: 40px;
  margin: 0 5px;
  background-color: #fff;
  border-radius: 5px;
  text-align: center;
  vertical-align: center;
}
.banner span{
  line-height:40px;
  letter-spacing:8px;
}
/deep/.tabs{
  margin: 15px 0;
}

/deep/.van-tabs__nav--card{
  border: hidden;
  margin: inherit;
  background-color: #f2f1f6;
}
/deep/.van-tab{
  border: hidden;
  margin: 0 5px;
  background-color: rgba(200,200,200,.5);
  border-radius: 3px;
}
</style>
