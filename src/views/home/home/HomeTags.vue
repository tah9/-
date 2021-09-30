<template>
  <div class="tab-item">
    <van-list v-model="loading" :finished="finshed" @load="onLoad" offset="0">
      <van-cell-group v-for="(row,i) in rows" :key="i">
        <van-cell :title="row.title" :label="num_desc(row)"  is-link :center=true>
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
import Login from "@/views/login/Login";
export default {
  name: "HomeTags",
  components: {Probe},
  data(){
    return {
      rows: [],
      page:1,
      loading: false,
      finshed:false
    }
  },
  created() {
    // this.getList()
  },
  computed:{

  },
  methods:{
    getList(page){
      request.get("tag/all?pagerNum=" + this.page).then( res => {
        this.rows = this.rows.concat(res)
        console.log(this.rows.length)
        this.loading = false
      })
    },
    onLoad(){
      this.loading = true
      console.log("load")
      this.page++
      this.getList()
      this.finshed = false
    },
    num_desc(row){
      let hotnum = row.hot_num
      let feednum = row.feednum
      return '🔥'+Math.floor(hotnum/1000) + "w热度  " +  Math.floor(feednum/1000) + "w讨论"
    },

  }
}
</script>

<style scoped lang="less">
.van-cell__title{
  margin-left: 10px;
}
.van-icon__image {
  border-radius: 5px;
}
</style>
