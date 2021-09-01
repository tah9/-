<template>
    <div class="root">
      <h4 class="header" @click="$router.push('/login/face')">刷脸登录</h4>
      <div class="center">
        <el-form>
          <el-form-item>
            <el-input v-model="phone" placeholder="输入手机号码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
        </el-form>
        <van-button round block type="info" native-type="submit">登录</van-button>
        <h5 style="color: white" @click="$router.push('/login/register')">注册</h5>
      </div>
      <div class="foot">
        <h6 style="color:#1989FA">用户协议</h6>
      </div>
    </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      phone: '',
      password: '',
      imageUrl: ''
    }
  },
  created() {

  },
  methods: {
    phoneLogin() {
    },
  }
}
</script>

<style scoped>

.root {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background: #2D2D3F;
  text-align: center;
  padding-top: 30%;
}

.header {
  padding-right: 20%;
  top: 0;
  width: auto;
  right: 0;
  text-align: right;
  color: #fff;
  text-shadow:0 0 10px;
  letter-spacing: 1px;
}

.center {
  padding-left: 20%;
  padding-right: 20%;
  flex-flow: column;
  align-items: center;
}

.foot {
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

</style>