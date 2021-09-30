<template>
  <div class="container">
    <div class="forms-container">
      <div class="signin-signup">
        <form action="#" class="sign-in-form">
          <h2 class="title">用户登录</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="请输入账号" v-model="user.phone_number"/>
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="请输入密码" v-model="user.password"/>
          </div>
          <input type="submit" value="登录" class="btn solid" @click="login"/>
          <p class="social-text">其他登录方式</p>
          <div class="social-media">
              <img class="icon" src="/api/graduate/emoji/systeam/刷脸1.jpg">
          </div>
        </form>
        <form action="#" class="sign-up-form">
          <h2 class="title">注册</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="用户名" v-model="user.username"/>
          </div>
          <div class="input-field">
            <i class="fas fa-phone"></i>
            <input  placeholder="手机号码"  v-model="user.phone_number"/>
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="密码"  v-model="user.password"/>
          </div>
          <input type="submit" class="btn" value="注册账号" @click="register"/>
        </form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>没有账号?</h3>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
            ex ratione. Aliquid!
          </p>
          <button class="btn transparent" id="sign-up-btn">
            去注册
          </button>
        </div>
        <img src="img/log.svg" class="image" alt="" />
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>已有账号?</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            laboriosam ad deleniti.
          </p>
          <button class="btn transparent" id="sign-in-btn">
            登录
          </button>
        </div>
        <img src="img/register.svg" class="image" alt="" />
      </div>
    </div>
    <van-popup class="popup"
               v-model="registerFinish" position="bottom">
      <h2>注册成功</h2>
      <van-button icon="https://img01.yzcdn.cn/vant/user-active.png" size="large"
                  round type="info" class="facebtn">
        完善人脸信息
      </van-button>
      <a href="www.baidu.com">跳过</a>
    </van-popup>
  </div>

</template>

<script>
import request from "@/network/request";
import {Toast} from "vant";

export default {
  name: "Login",
  data() {
    return {
      user: {
        username:'',
        phone_number: '',
        password: '',
      },
      registerFinish: false,

    }
  },
  mounted() {
    this.$nextTick(()=>{
      const sign_in_btn = document.querySelector("#sign-in-btn");
      const sign_up_btn = document.querySelector("#sign-up-btn");
      const container = document.querySelector(".container");

      sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
      });

      sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
      });
    })


  },
  methods: {
    login() {
      console.log(this.user);
      request.post('/user/login', this.user).then(res => {
        console.log(res);
        window.localStorage.setItem("token",res.token)
        request.get("/user/useTokenGetUser").then(res=>{
          console.log(res);
          window.localStorage.setItem("user",JSON.stringify(res.userInfo))
          this.$router.replace('/main/home')
        })
      })
    },
    register(){
      request.post('/user/register', this.user).then(res => {
        if (res.code===200){
          window.localStorage.setItem("token",res.token)
          this.registerFinish = true
          console.log(res);
        }else{
          Toast.fail(res.msg)
        }
      })
    }
  }
}
</script>
<style scoped src="./style.css"></style>
<style scoped lang="less">
@icon-wh:50px;
.icon {
  width: @icon-wh;
  height: @icon-wh;
  object-fit: cover;
}
.icon:hover{

}
.popup {
  /*grid-auto-flow: column;*/
  height: 25%;
  display: grid;
  grid-template-rows:auto auto auto;
  grid-template-columns: 1fr auto 1fr;
}
.facebtn {
  grid-column-start: 2;
}
h2 {
  text-align: center;
  grid-column-start: 2;
}
a {
  grid-column-start: 3;
  grid-row-start: 3;
  text-align: center;
}
</style>