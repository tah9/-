<template>
  <HeaderBarPage :cover-img="userInfo.cover" v-on:navHide="navHide" :not-scroll-filter="'follow-item'"
                 :nav-expand-height="navExpandHeight" :nav-shrink-height="navShrinkHeight"
                 :nav-normal-height="navNormalHeight">
    <div slot="headerInfo" id="headers">
      <div class="nav" id="nav">
        <van-icon name="arrow-left" size="1.5em" color="#ffffff" @click="$router.go(-1)"/>
        <transition name="fade">
        <div class="nav-hide" v-show="showSmall">
          <img :src="userInfo.userAvatar" class="nav-avt">
          <h4>{{userInfo.username}}</h4>
          <div>关注</div>
        </div>
        </transition>
        <van-icon name="label-o" size="1.5em" color="#ffffff" class="right-menu"/>
      </div>
      <transition name="fade">
      <HeaderInfo :res="userNumber" :user="userInfo" v-show="!showSmall"></HeaderInfo>
      </transition>
    </div>
    <div slot="content">
      <UserContent :uid="userInfo.uid" ></UserContent>
    </div>
  </HeaderBarPage>
</template>

<script>
import HeaderBarPage from "@/views/home/user/HeaderBarPage";
import HeaderInfo from "@/views/home/user/HeaderInfo";
import request from "@/network/request";
import UserContent from "@/views/home/user/UserContent";

export default {
  name: "UserMess",
  data() {
    return {
      navNormalHeight: 300,
      navShrinkHeight: 65,
      navExpandHeight: 500,
      showSmall: false,
      userNumber:{},
      userInfo:{},
    }
  },
  components: {
    UserContent,
    HeaderInfo,
    HeaderBarPage
  },
  methods: {
    navHide(height) {
      // console.log(flag);
      this.showSmall = height < 66
    }
  },
  created() {
    let username=this.$route.params.username
    request.post('/user/info' ,{
      username:username
    }).then(res => {
      this.userNumber=res
      this.userInfo=res.user
      console.log(res);
    });
  },
}
</script>

<style lang="less" scoped>

.nav {
  z-index: 9;
  width: 100%;
  position: fixed;
  height: 65px;
  top: 0;
  //background: rgba(0, 0, 0, .75);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: calc(@item-margin / 2) @item-margin;
}

.nav-hide {
  margin: 0 @item-margin;
  display: flex;
  align-items: center;
}

.nav-hide h4 {
  margin: 0 calc(2 * @item-margin) 0 @item-margin;
  color: white;
  line-height: 2em;
}

.nav-hide div {
  margin-right: 1em;
  color: white;
  height: 1.5em;
  line-height: 1.5em;
  width: 4em;
  text-align: center;
  border-radius: 40px;
  background-color: @theme-color;
}

.nav-avt {
  border-radius: 50%;
  width: 2em;
  height: 2em;
}


.right-menu {
  margin-left: auto;
}

#headers {
  overflow: hidden;
  //height: 300px;
  width: 100%;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}

</style>