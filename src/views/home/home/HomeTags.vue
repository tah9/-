<template>
  <div class="tab-item">
    <div class="top-list">
      <div v-for="item in descTags" @click="$router.push('/t/'+item.title.replace('[\\?].*?[0-9]',''))">
        <img :src="item.logo">
        <div>{{ item.title }}</div>
      </div>
    </div>
    <TabLayout @changeTab="(cur)=>{this.current=cur;this.toggleTagClass(cur)}"
               class="hot-words" :style="isTop?'background:white;':''">
      <div :class="index===current?'word-on':''" v-for="(item,index) in hotWords"
           :style="isTop&&index!==current?'background:#f2f1f6;':''">
        {{ item }}
      </div>
    </TabLayout>
    <van-list v-model="loading" :finished="finshed" @load="onLoad" offset="0" class="bottom-list">
      <van-cell-group v-for="(row,i) in rows" :key="i" @click="$router.push('/t/'+row.title.replace('[\\?].*?[0-9]',''))">
        <van-cell :title="row.title" :label="num_desc(row)" is-link :center=true>
          <van-icon slot="icon" :name="row.logo" size="60"></van-icon>
        </van-cell>
      </van-cell-group>
      <!--      <van-loading vertical size="20">加载中...</van-loading>-->
    </van-list>
  </div>
</template>

<script>

import Probe from "../../Probe/Probe";
import request from "@/network/request";
import TabLayout from "@/components/TabLayout";

export default {
  name: "HomeTags",
  components: {TabLayout, Probe},
  data() {
    return {
      current: 0,
      rows: [],
      page: 1,
      loading: false,
      finshed: false,
      hotWords: null,
      descTags: null,
      isTop:false
    }
  },
  created() {
    this.loadWords()
    this.getDescTags()
    // this.getList()
  },
  computed: {},
  methods: {
    loadWords() {
      request.get('/tag/hotWords').then(res => {
        let result = ['推荐']
        this.hotWords = result.concat(res.rows)
      })
    },
    toggleTagClass(index) {
      this.page=1
      if (index === 0) {
        request.get("tag/all?pagerNum=" + this.page).then(res=>{this.rows=res.rows})
      } else {
        this.getTags(index)
      }
    },
    getTags(index) {
      request.post('/tag/match', {
        word: this.hotWords[index]
      }).then(res => {
        this.rows = res.rows
      })
    },
    getList() {
      request.get("tag/all?pagerNum=" + this.page).then(res => {
        this.rows = this.rows.concat(res.rows)
        this.loading = false
      })
    },
    getDescTags() {
      request.get("tag/all?sort=1").then(res => {
        console.log(res);
        this.descTags = res.rows
      })
    },
    onLoad() {
      this.loading = true
      console.log("load")
      this.page++
      this.getList()
      this.finshed = false
    },
    num_desc(row) {
      let hotnum = row.hot_num
      let feednum = row.feednum
      let re = hotnum >= 1000 ? Math.floor(hotnum / 1000) + "w热度  " : hotnum
      let fe = feednum >= 1000 ? Math.floor(feednum / 1000) + "w讨论" : feednum
      return '🔥' + re + fe
    },
  },
  mounted() {
    let _this=this
    function scroll(){
      let scrollTop = document.documentElement.scrollTop
      // console.log(scrollTop);
      _this.isTop=scrollTop>=125
    }
    window.addEventListener('scroll',scroll)
  }
}
</script>

<style scoped lang="less">
.tab-item {
  background: @bg-color;
}

.bottom-list {
  margin: 0 5px;
  border-radius: 12px;
  overflow: hidden;
}
.hot-words {
  position: sticky;
  top: 44px;
  z-index: 3;
  //background: white;
}
.hot-words > * {
  border-radius: 5px;
  line-height: 2em;
  text-align: center;
  height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
  background: white;
  margin: 10px 5px;
  position: relative;
}

.word-on {
  color: white;
  background: @theme-color;
}

//.word-on::after{
//  position: absolute;
//  content: "";
//  width: 100%;
//  height: 2px;
//  bottom: 0;
//  left: 0;
//  background: red;
//  border-radius: 50px;
//}

.van-cell__title {
  margin-left: 10px;
}

.van-icon__image {
  border-radius: 5px;
}

.top-list {
  overflow-x: auto;
  white-space: nowrap;
}

.top-list::-webkit-scrollbar {
  display: none;
}

.top-list > div {
  display: inline-block;
  width: 70px;
  height: 70px;
  position: relative;
}

.top-list > div * {
  position: absolute;
  width: 60px;
  height: 60px;
  text-align: center;
  margin: 5px;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  line-height: 60px;
  background: rgba(0, 0, 0, .3);
}
</style>
