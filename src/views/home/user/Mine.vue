<template>
  <div class="root">
    <div class="top">
      <div class="pure_top"></div>
    </div>
    <div class="user_mess">
      <van-cell center size="large" @click="$router.push('/main/mine/usermess')" is-link value="个人主页">
        <van-image round fit="cover" slot="title"
                   width="5rem"
                   height="5rem"
                   :src="user.avatar_url"></van-image>
        <div slot="label">{{ user.username }}</div>
      </van-cell>
      <van-cell-group inset ce>
        <van-cell center title="身份认证" label="人脸信息">
          <van-button round plain type="primary" size="small">已录入</van-button>
        </van-cell>
      </van-cell-group>
    </div>
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
      user: this.$root.user,
    }
  },
  methods: {
    test() {
      console.log('---')
    }
  }
}
</script>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
}

.top {
  /*position: relative;*/
}

/*.user_mess {*/
/*  bottom: 0;*/
/*}*/

.pure_top {
  width: 100%;
  height: 100px;
  position: relative;
  z-index: -1;
  overflow: hidden;
  top: 0;
  bottom: 0;
}

.pure_top::after {
  content: '';
  width: 140%;
  height: 100px;
  position: absolute;
  left: -20%;
  top: 0;
  z-index: -1;
  border-radius: 0 0 50% 50%;
  background: #1496f1;

}

.top2 {
  display: flex;
  justify-content: space-around;
}
</style>