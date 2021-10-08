<template>
  <div :style="'background:' +btnColor()+';'" v-text="checkFocus()"></div>
</template>

<script>
export default {
  name: "FollowBtn",
  props: {
    isFollow: null,
    color:{
      default:'#0f9d58'
    }
  },
  methods: {
    checkFocus() {
      return this.isFollow ? '已关注' : '关注'
    },
    btnColor() {
      return this.isFollow ? '#666666' : this.color
    },
  }
}
</script>

<style scoped lang="less">
div{
  margin-right: 1em;
  color: white;
  height: 1.5em;
  line-height: 1.5em;
  width: 4em;
  text-align: center;
  border-radius: 40px;
  background-color: @theme-color;
}
</style>