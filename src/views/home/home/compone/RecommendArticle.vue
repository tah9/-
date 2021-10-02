<template>
  <van-list v-model="loading" v-if="url!=='/article/user/undefined'"
            :finished="finished" offset="0"
            finished-text="没有更多了"
            @load="onLoad" class="list-view" id="listView">
    <ListItem :item="item" v-for="(item,index) in rows" @click="contentInfo(item.id)"></ListItem>
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
      loading: false,
      finished: false,
      pagerNum: 1,
      pagerSize: 10
    }
  },
  components:{
    ListItem
  },
  props: {
    url: ''
  },
  methods: {
    onLoad() {
      console.log(this.url + '>>beload>>' + 'this.pagerNum>>' + this.pagerNum)
      request.get(this.url + "?pagerNum=" + (this.pagerNum++)).then(res => {
        if (this.rows === null) {
          this.rows = res.rows
        } else {
          this.rows.push(...res.rows)
        }
        this.loading = false
      })
    },

  },
}
</script>

<style scoped lang="less">
@f-size: 1em;
@item-margin: 12px;
@avt-size: 35px;

.list-view {
  display: flex;
  flex-direction: column;
}
</style>