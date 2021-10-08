<template>
  <div class="root">
    <navbar title="个人资料" :canExit="false" @exit="leftClick()"></navbar>
    <div class="cell">
      <div>更换头像</div>
      <div class="upel">
        <img :src="user.userAvatar" ref="avatarImg">
        <input type="file" @change="avatarChange()" ref="avatarInput">
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="cell">
      <div>个人主页背景</div>
      <div class="upel">
        <img :src="user.cover" ref="coverImg">
        <input type="file" @change="coverChange()" ref="coverInput">
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="cell">
      <div>用户名</div>
      <input type="text" v-model="user.username">
      <van-icon name="arrow"></van-icon>
    </div>

    <div class="cell">
      <div>签名</div>
      <textarea type="text" v-model="user.bio" rows="8"></textarea>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="marginDiv">以下信息用于计算运动消耗等</div>
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
          v-model="currentDate" type="date"
          title="选择年月日" :min-date="minDate" :max-date="maxDate"
      />
    </van-popup>
    <div class="cell">
      <div>性别</div>
      <div @click="showGender=true">{{user.gender===1?'男':'女'}}</div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="cell">
      <div>生日</div>
      <div @click="show=true">{{currentDate.getFullYear() + "-" + currentDate.getMonth() + "-" + currentDate.getDay() }}
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="cell">
      <div>身高</div>
      <div><input type="text" v-model="user.height"><span> cm</span></div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="cell">
      <div>体重</div>
      <div><input type="text" v-model="user.weight"><span> kg</span></div>
      <van-icon name="arrow"></van-icon>
    </div>
    <van-popup v-model="showGender" round class="showGender">
      <van-picker toolbar-position="bottom"
          show-toolbar @change="onGenderChange"
          :columns="['男','女']">
      </van-picker>
    </van-popup>
    <div class="marginDiv" style="height: 100%"></div>
  </div>
</template>

<script>
import Navbar from "@/components/navbar";
import request from "@/network/request";
import {Toast} from "vant";

export default {
  name: "EditUser",
  components: {Navbar},
  data() {
    return {
      showGender:false,
      avatar:null,
      cover:null,
      show: false,
      minDate: new Date(1921, 0, 1),
      maxDate: new Date(2021, 10, 1),
      currentDate: new Date(2021, 1, 1),
      user: this.$root.getUser()
    };
  },
  methods: {
    test(){
      console.log('test')
    },
    leftClick(){
      let _this=this
      let formData = new FormData();
      formData.append("uid",this.user.uid)
      if (this.cover){
        formData.append("cover",this.cover.value)
      }
      if (this.avatar){
        formData.append("userAvatar",this.avatar.value)
      }
      formData.append("username",this.user.username)
      formData.append("bio",this.user.bio)
      formData.append("gender", this.user.gender);
      formData.append("birthday", this.currentDate.getFullYear() + "-" + this.currentDate.getMonth() + "-" + this.currentDate.getDay());
      formData.append("height", this.user.height);
      formData.append("weight",this.user.weight)
      request.post('/user/changeUser',formData).then(res=>{
        if (res.code === 200) {
          request.get("/user/useTokenGetUser").then(res=>{
            console.log(res);
            window.localStorage.setItem("user",JSON.stringify(res.userInfo))
            Toast.success('修改成功')
            _this.$router.replace('/main/mine')
          })
        }
      })
    },
    onGenderChange(picker,value,index){
      this.user.gender=index===0?1:0
    },
    avatarChange() {
      let avatarInput = this.$refs.avatarInput;
      let file=avatarInput.files[0]
      this.avatar={
        key:window.webkitURL.createObjectURL(file),
        value:file
      }
      this.$refs.avatarImg.src=this.avatar.key
    },
    coverChange(){
      let coverInput = this.$refs.coverInput;
      let file=coverInput.files[0]
      this.cover={
        key:window.webkitURL.createObjectURL(file),
        value:file
      }
      this.$refs.coverImg.src=this.cover.key
    }
  },
}
</script>

<style lang="less" scoped>
.root {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}
.showGender{
  width: 70%;
}
.marginDiv {
  background: @bg-color;
  padding: 15px 0 10px @item-margin;
}

.cell {
  padding: @item-margin;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
}

.cell > *:nth-child(1) {
  min-width: 25%;
}

.cell > *:nth-child(2) {
  margin-left: auto;
  margin-right: 1em;
  white-space: pre-line;
}

.upel {
  position: relative;
  width: 3em;
  height: 3em;
}
input{
  border: none;
  text-align: right;
}
textarea{
  border: none;
}
.upel > * {
  width: 3em;
  position: absolute;
  height: 3em;
  object-fit: cover;
  border-radius: 50%;
}

.upel input {
  opacity: 0;
}
</style>