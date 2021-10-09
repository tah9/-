<template>
<span v-text="getTime(itTime)" class="comment-time"></span>
</template>

<script>
import {getTime} from "@/untils/Other";

export default {
  name: "TimeSpan",
  props:{
    itTime:null
  },
  methods:{
    getTime(oldTime) {
      return getTime(oldTime)
    },
  }
}
</script>

<style scoped lang="less">
.comment-time {
  font-size: 0.8em;
  margin-right: auto;
  color: @gay-font;
}
</style>