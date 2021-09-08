<template>
  <div class="root">
    <h1>步道</h1>
    <div class="login-form">
      <div class="close"></div>
      <div class="head-info">
        <div class="user_face" @click="$router.push('/login/face')">刷脸登录</div>
      </div>
      <div class="clear"></div>
      <div class="avtar">
        <van-image round fit="cover"
                   class="avtarimg"></van-image>
      </div>
      <form>
        <input type="text" class="text" :value="user.phone_number" onfocus="this.value = '';"
               onblur="if (this.value == '') {this.value = 'Username';}">
        <div class="key">
          <input type="password" :value="user.password" onfocus="this.value = '';"
                 onblur="if (this.value == '') {this.value = 'Password';}">
        </div>
      </form>
      <div>
        <input type="submit" @click="login">
      </div>
    </div>
    <div class="copy-rights" @click="$router.push('/login/register')" style="color: #3ea751">注册账号
    </div>

  </div>
</template>

<script>
import request from "@/network/request";

export default {
  name: "Login",
  data() {
    return {
      user: {
        phone_number: '',
        password: '',
      }
    }
  },
  created() {

  },
  methods: {
    login() {
      request.post('/user/login', this.user).then(res => {
        console.log(res);
        this.$root.token = res.token;

      })
    }
  }
}
</script>
<style scoped src="./css/style.css"></style>
<style scoped>
.root {
  background: url(images/bg1.jpg);
  font-family: 'Open Sans', sans-serif;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  min-height: 1050px;
}

.user_face {
  line-height: 50px;
  font-size: 20px;
  text-align: right;
  padding-right: 8%;
  color: #fff;
  text-shadow: 0 0 10px;
  letter-spacing: 1px;
}

.avtarimg {
  background: url(images/foot.png);
  width: 5em;
  height: 5em;
  margin-top: 2.5em;
}
</style>