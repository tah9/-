<template>
  <div :style="type==='tag'?(isFollow?tagBeFollow:tagNotFollow):''" v-text="checkFocus()" @click="focusIt()" v-if="$root.getUser().uid!==follow_id"></div>
</template>

<script>
import request from "@/network/request";

export default {
  name: "FollowBtn",
  props: {
    isFollow: null,
    type: {
      default: 'user'
    },
    follow_id: null,
  },
  data() {
    return {
      tagBeFollow: {
        background: 'none',
        border: '1px solid #e5e5e5'
      },
      tagNotFollow:{
        background: 'rgba(238, 238, 238, 0.2)',
        color:'white'
      },
    }
  },
  watch: {
    isFollow(nv, ov) {
      console.log(nv);
    }
  },
  methods: {
    checkFocus() {
      return this.isFollow ? '已关注' : '关注'
    },
    btnColor() {
      return this.isFollow ? '#e5e5e5' : this.color
    },
    fontColor() {
      return this.isFollow ? '#757575' : 'white'
    },
    focusIt() {
      let json = {
        uid: this.$root.getUser().uid,
        type: this.type,
        follow_id: this.follow_id
      }
      console.log(json);
      if (!this.isFollow) {
        request.post('/user/focus', json).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.$emit("follow", true)
          }
        })
      } else {
        request.delete('/user/focus', {
          data: json
        }).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.$emit("follow", false)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
div {
  margin-right: 1em;
  color: white;
  height: 1.5em;
  line-height: 1.5em;
  width: 4em;
  font-size: 14px;
  padding: 3px;
  text-align: center;
  border-radius: 40px;
  background-color: @theme-color;
}
</style>