<template>
  <van-list v-model="loading"
            :finished="finished" offset="0"
            finished-text="没有更多了"
            @load="onLoad" class="list-view" id="listView">
    <div v-for="(item,index) in rows">
      <ListItem :item="item"></ListItem>
      <div v-if="index===6">
        <div class="text-div">新鲜图文
          <van-icon name="arrow"/>
        </div>
        <div class="feedArticleList">
          <div v-for="(feed,j) in feedRows" :id="j" class="feed-item" @click="$router.push('/articleInfo/' + feed.id)">
            <img width="100%" height="100px" class="feedImg">
            <canvas  width="100%" height="100px" style="display: none"></canvas>
            <div class="feedArticleText">{{ feed.message_title.substring(0,28) }}</div>
            {{ getColor(j) }}
          </div>
        </div>
      </div>
    </div>

  </van-list>
</template>

<script>


import request from "@/network/request";
import {getTime} from "@/untils/Other";
import {ImagePreview} from 'vant';
import ListItem from "@/components/ListItem";

export default {
  name: "Article",
  data() {
    return {
      rows: null,
      feedRows: null,
      loading: false,
      finished: false,
      pagerNum: 1,
      pagerSize: 10
    }
  },
  components: {
    ListItem
  },
  methods: {
    getColor(j) {
      this.$nextTick(()=>{
        let item = document.getElementById((j) + '');
        let canvas = item.getElementsByTagName("canvas")[0];
        let ctx = canvas.getContext('2d')
        let img = item.getElementsByTagName("img")[0];
        img.src = "/api/graduate/articlepics/"+j+".jpg"
        img.onload = function(){
          ctx.drawImage(img, 0, 0);
          let imgData = (ctx.getImageData(0, 0, img.width, img.height)).data  //x开始复制的左上角位置的 x 坐标。 y 开始复制的左上角位置的 y 坐标。 width 将要复制的矩形区域的宽度。 height 将要复制的矩形区域的高度。

          let temp = imgData[0] * 0.299 + imgData[1] * 0.587 + imgData[2] * 0.114;
          let b = '(' + imgData[0] + ',' + imgData[1] + ',' + imgData[2] + ',' + imgData[3] + ')'
          // let b = '(' + (imgData[0]+imgData[4]) + ',' + (imgData[1]+ imgData[5]) + ',' + (imgData[2]+ imgData[6]) + ',' + (imgData[3]+imgData[7]) + ')'
          // let c = '(' + imgData[4] + ',' + imgData[5] + ',' + imgData[6] + ',' + imgData[7] + ')'
          // let d = '(' + 255 + ',' + 255 + ',' + 255 + ',' + 255 + ')'
          // console.log(b);
          // console.log(temp)
          if (temp >= 192) {
            item.style.background = 'black'
          }
          else{
            item.style.background = 'rgba' + b
          }
        }

      })
    },
    onLoad() {
      console.log('>>beload>>' + 'this.pagerNum>>' + this.pagerNum)
      request.get("/article/get?pagerNum=" + (this.pagerNum++)).then(res => {
        if (this.rows === null) {
          this.rows = res.rows
        } else {
          this.rows.push(...res.rows)
        }
        this.loading = false
      })
    },

  },
  created() {
    request.get("/article/get?pagerNum=1&feedType=feedArticle").then(res => {
      this.feedRows = res.rows
    })
  }
}
</script>

<style scoped lang="less">
@f-size: 1em;
@item-margin: 12px;
@avt-size: 35px;
.text-div {
  padding: 0 @item-margin;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-view {
  display: flex;
  flex-direction: column;
}

.feedArticleText {
  white-space: pre-wrap;
  height: 3em;
  color: white;
  padding: 0.1em 0.5em;
}

.feedArticleList {
  width: 100%;
  overflow-x: scroll;
  white-space: nowrap;
}
.feedArticleList::-webkit-scrollbar{
  display: none;
}
.feed-item {
  width: 60vw;
  border-radius: 8px;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  margin: @item-margin calc(@item-margin / 2);
}

</style>