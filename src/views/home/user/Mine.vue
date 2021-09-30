<template>
  <div class="root">
    <div class="top">
      <van-icon name="/api/graduate/emoji/systeam/通知.jpg"/>
      <span @click="$router.push('/publishArticle')">+</span>
    </div>
    <div class="user_mess">
      <img :src="user.userAvatar">
      <div class="name">
        {{user.username}}
      </div>
      <van-icon name="arrow" class="arrow"/>
    </div>
    <div class="follower">
        <span>
          <h3>30</h3>
          动态
        </span>|
      <span>
          <h3>30</h3>
          关注
        </span>|
      <span>
          <h3>30</h3>
          粉丝
        </span>
    </div>
    <van-cell-group inset ce>
      <van-cell center title="身份认证" label="人脸信息">
        <div class="facebtn">已录入</div>
      </van-cell>
    </van-cell-group>
    <div class="top2">
      <van-cell-group inset ce>
        <van-cell center title="总运动" label="100分钟" is-link>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset ce>
        <van-cell center title="体重" label="120公斤" is-link>
        </van-cell>
      </van-cell-group>
    </div>

  </div>
</template>

<script>
export default {
  name: "Mine",
  data() {
    return {
      user: this.$root.getUser(),
    }
  },
  methods: {
    test() {
      console.log('---')
    }
  }
}
</script>

<style lang="less" scoped>
.root {
  display: flex;
  flex-direction: column;
  padding: @item-margin;
  background: @bg-color;
}
.user_mess {
  border-radius: @item-margin;
  display: flex;
  padding: @item-margin;
}
.name {
  flex: 1;
}
.user_mess img {
  width: 5em;
  height: 5em;
  border-radius: 50%;
  object-fit: cover;
}
.arrow{
  align-self: center;
}
.root *{
  margin: 5px 0;
  background-color: white;
}
.top {
  background-color: @bg-color;
  display: flex;
  justify-content: right;
}

.top span {
  float: right;
  text-align: center;
  line-height: @icon-img-wh;
  width: @icon-img-wh;
  height: @icon-img-wh;
  background: @theme-color;
  border-radius: 50px;
  color: white;
  flex-shrink: 0;
}

.top img {
  width: @icon-img-wh;
  height: @icon-img-wh;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 20px;
}

.top2 {
  display: flex;
  justify-content: space-around;
}
.follower {
  border-radius: @item-margin;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.follower h3{
  text-align: center;
  color: #000000;
  font-size: 2.5em;
}
.follower span{
  color: @gay-font;
  font-size: 0.5em;
}
.facebtn {
  height: 32px;
  width: 80px;
  text-align: center;
  line-height: 32px;
  margin-left: auto;
  color: @theme-color;
  border-radius: 50px;
  border: 1px solid @theme-color;
}
</style>