<template>
  <div class="root">
    <div class="top">
      <img src="/api/graduate/emoji/systeam/通知.jpg"/>
      <span @click="$router.push('/publishArticle')">+</span>
    </div>
    <div class="user_mess" @click="$router.push('/u/'+user.username)">
      <img :src="user.userAvatar">
      <div class="name">
        <div>{{ user.username }}</div>
        <span>ID:{{ user.uid }}</span>
      </div>
      <van-icon name="arrow" class="arrow"/>
    </div>
    <div class="follower">
      <span><div>10</div>动态</span>|<span><div>{{ user.follow }}</div>关注</span>|<span><div>{{ user.fans }}</div>粉丝</span></div>
    <div class="card">
      <div>生物信息</div>
      <div style="display: flex;align-items: center">
        <span class="status">已录入</span>
        <van-icon name="success"/>
      </div>
    </div>
    <div class="top2">
      <van-cell-group inset ce>
        <van-cell center title="总运动" label="100分钟" is-link>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset ce>
        <van-cell center title="总距离" label="100km" is-link>
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
  padding-left: 1em;
}

.name div {
  margin: 5px 0;
  font-weight: bold;
}

.name span {
  color: gray;
}

.user_mess img {
  width: 3.5em;
  height: 3.5em;
  border-radius: 50%;
  object-fit: cover;
}

.status {
  //border: 1px solid white;
  //border-radius: 50px;
  //padding: 3px;
  //font-size: 14px;
  //min-width: 4em;
  //text-align: center;
  font-weight: bold;
}

.arrow {
  align-self: center;
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
  align-items: center;
  display: flex;
  border-radius: 5px;
  justify-content: space-around;
  background: white;
}

.follower {
  margin: @item-margin 0;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  background: white;
  justify-content: space-evenly;
  align-items: center;
}

.follower div {
  text-align: center;
  color: #000000;
  font-weight: bold;
  font-size: 1.4em;
}

div {
  size: 1em;
}

span {
  font-size: 14px;
}

.follower span {
  color: @gay-font;
}

.card {
  display: flex;
  margin: 0 calc(3 * @item-margin);
  justify-content: space-around;
  background: rgba(15,157,88,.3);
  padding: 5px @item-margin;
  color: white;
  border-radius: 50% 50% 0 0;
}
</style>