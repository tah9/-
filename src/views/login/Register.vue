<template>
  <div class="root">
    <navbar :title='title'></navbar>
    <div style="padding-left: 3%;padding-right: 3%">

      <!-- 输入昵称 -->
      <van-field v-model="user.username" label="昵称" placeholder="请输入昵称"
                 maxlength="11" :required="true" :rules="[{ required: true }]"/>
      <!--手机号-->
      <van-field v-model="user.phone_number" :required="true"
                 :rules="[{ required: true }]" maxlength="11" type="tel" label="手机号" placeholder="请输入手机号"/>
      <!-- 输入密码 -->
      <van-field v-model="user.password" type="password" label="密码" placeholder="请输入密码"
                 maxlength="11" :required="true" :rules="[{ required: true }]"/>
      <van-field name="radio" label="性别">
        <template #input>
          <van-radio-group v-model="user.gender" direction="horizontal">
            <van-radio name="男">男</van-radio>
            <van-radio name="女">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <div style="margin: 16px;" @click="registerUp">
        <van-button round block type="info" native-type="submit">注册</van-button>
      </div>
    </div>
    <van-popup class="popup"
               v-model="registerFinish" position="bottom">
      <h2>注册成功</h2>
      <van-button icon="https://img01.yzcdn.cn/vant/user-active.png"
                  @click="addFace"
                  round type="info" class="facebtn">
        完善人脸信息
      </van-button>
      <a href="www.baidu.com">进入主页</a>
    </van-popup>
  </div>
</template>

<script>
import Navbar from "@/components/navbar";
import request from "@/network/request";

export default {
  name: "Register",
  components: {Navbar},
  data() {
    return {
      title: '手机号注册',
      registerFinish: false,
      user: {
        phone_number: '',
        password: '',
        username: '',
        gender: '男'
      },
    }
  },
  methods: {
    addFace(){
        this.$router.push('/login/addface/'+this.user.phone_number)
    },
    registerUp() {
      request.post('/user/register', this.user).then(res => {
        console.log(res);
        this.$root.token=res.token
        console.log(this.$root.token);
        this.registerFinish = true
      }).catch(e => {
        alert(e)
      })
    }
  }
}
</script>

<style scoped>
.popup {
  /*grid-auto-flow: column;*/
  height: 25%;
  display: grid;
  grid-template-rows:auto auto auto;
  grid-template-columns: 1fr auto 1fr;
}

h2 {
  text-align: center;
  grid-column-start: 2;
}

.facebtn {
  grid-column-start: 2;
}

a {
  grid-column-start: 3;
  grid-row-start: 3;
  text-align: center;
}
</style>