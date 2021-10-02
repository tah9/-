<template>
  <div>
    <tags-module :rows="rows"></tags-module>
    <van-list v-model="loading" :finished="finshed" @load="onLoad">
      <van-cell-group v-for="(row,i) in rows" :key="i">
        <van-cell :title="row.title" is-link :center=true>
          <div slot="label">
            <van-icon name="fire-o" size="10" color="red"></van-icon>
            {{num_desc(row)}}</div>
          <van-icon slot="icon" :name="row.logo" size="60"></van-icon>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>

import Probe from "../../Probe/Probe";
import request from "@/network/request";
import TagsModule from "@/views/home/home/compone/TagsModule";
export default {
  name: "HomeTags",
  components: {
    Probe,
    TagsModule
  },
  data(){
    return {
      rows: [],
      page:1,
      loading: false,
      finshed:false,
    }
  },
  created() {
    this.clientW = document.body.clientWidth
  },
  computed:{
    styleCVar(){
      return {
        '@clientW':this.clientW + 'px'
      }
    }
  },
  methods:{
    getList(){
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
      return Math.floor(hotnum/100)/10 + "w热度  " +  Math.floor(feednum/100)/10 + "w讨论"
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
