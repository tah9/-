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
      <span><div>{{sum}}</div>动态</span>|<span><div>{{ user.follow }}</div>关注</span>|<span><div>{{ user.fans }}</div>粉丝</span>
    </div>
    <div class="card">
      <div>生物信息</div>
      <span class="goAdd" style="display: flex;align-items: center" v-if="!$root.getUser().hasFace"
            @click="$router.push('/login/addface/'+$root.getUser().username)">未录入</span>
      <span class="beAdd" v-else style="display: flex;align-items: center">已录入</span>
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
    <div style="border-bottom: 1px solid rgba(0, 0, 0, .05);margin-top: 100px;margin-bottom: 10px"></div>
    <div class="exitBtn btn" @click="$router.replace('/login')">退出登录</div>
  </div>
</template>

<script>
import request from "@/network/request";

export default {
  name: "Mine",
  data() {
    return {
      user: this.$root.getUser(),
      sum:0
    }
  },
  methods: {
    test() {
      console.log('---')
    }
  },
  created() {
    request.get('/user/articleSum').then(res=>{
      this.sum=res.sum
    })
  }
}
</script>

<style lang="less" scoped>
.root {
  display: flex;
  flex-direction: column;
  padding: @item-margin;
  background: @bg-color;
  top: 0;
  bottom: 0;
  position: fixed;
  left: 0;
  right: 0;
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


.arrow {
  align-self: center;
}

.top {
  background-color: @bg-color;
  display: flex;
  justify-content: right;
}

.goAdd {
  border-radius: 50px;
  padding: 0 0.5em;
  border: 1px white solid;
  height: 1.5em;
  text-align: center;
  line-height: 1.5em;
  background: rgba(238, 238, 238, 0.2);
  color: white;
}

.beAdd {
  border-radius: 50px;
  padding: 0 0.5em;
  border: 1px white solid;
  height: 1.5em;
  text-align: center;
  line-height: 1.5em;
  background: rgba(238, 238, 238, 0.2);
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
  justify-content: space-evenly;
  //background: rgba(15,157,88,.3);
  background: @theme-color;
  padding: 5px @item-margin;
  color: white;
  border-radius: 50% 50% 0 0;
}
.exitBtn{
  color: red;
  font-weight: bold;
  text-align: center;
  height: 44px;
  line-height: 44px;
  bottom: 44px;
}
</style>