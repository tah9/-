<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
// todo 话题分析：平均回复数。帖子数量。总热度。。。
</script>
<style lang="less">
html::-webkit-scrollbar{
  display: none;
}


html{
  scrollbar-width: none;

}
.feed-link-tag,.feed-link-uname{
  color: @theme-color;
}
///*body {*/
///*  background: #27363e;*/
///*  //margin: 0;*/
///*  //padding: 0;*/
///*}*/
</style>
