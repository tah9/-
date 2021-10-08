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
.content-emoji {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-bottom: 3px;
  pointer-events: none;
}
.lou {
  color: @theme-color;
  border: 1px solid @theme-color;
  text-align: center;
  font-size: 0.5em;
  border-radius: 2px;
  margin-left: 0.4em;
}
.feed-link-tag,.feed-link-uname{
  color: @theme-color;
}
</style>
