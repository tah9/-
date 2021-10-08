<template>
  <div class="user">
    <div class="top-two">
      <h3 class="name">{{ user.username }}</h3>
      <div class="user-bio">{{ user.bio }}</div>
      <div class="follow">
        {{ user.be_like_num }}&nbsp;<span>获赞</span>
        {{ user.follow }}&nbsp;<span>关注</span>
        {{ user.fans }}&nbsp;<span>粉丝</span>
      </div>
      <span class="time">{{ getTime(user.logintime) }}活跃</span>
    </div>

    <div class="top-one">
      <img @click="bigImg(user.userAvatar)" :src="user.userAvatar" class="avtimg">
      <FollowBtn class="btn" v-if="user.uid!==$root.getUser().uid"></FollowBtn>
      <div class="btn2" v-else @click="$router.push('/editUser')">编辑资料</div>
      <img src="/api/graduate/emoji/systeam/邮箱.jpg" class="emailimg">
    </div>
  </div>
</template>

<script>
import {getTime} from "@/untils/Other";
import {ImagePreview} from "vant";
import FollowBtn from "@/components/FollowBtn";

export default {
  props: {
    res: {},
    user: {}
  },
  methods: {
    getTime(oldTime) {
      return getTime(oldTime)
    },
    bigImg(url) {
      ImagePreview([url]);
    },
    toFocus() {
      console.log('关注')
    }
  },
  name: "HeaderInfo",
  created() {
  },
  components: {
    FollowBtn
  }
}
</script>

<style scoped lang="less">
.user-bio {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.top-one {
  display: flex;
  box-sizing: border-box;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1em;
}

.name {
  color: white;
  margin: 0;
}

.time {
  background-color: rgba(238, 238, 238, 0.5);
  color: white;
  padding: 3px 10px;
  border-radius: 50px;
  font-size: 0.8em;
}

@avtimg-wh: 90px;

.avtimg {
  margin-right: auto;
  width: @avtimg-wh;
  height: @avtimg-wh;
  object-fit: cover;
  border-radius: 50%;
}


.emailimg {
  background-color: rgba(238, 238, 238, 0.5);
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  padding: 8px;
  object-fit: cover;
  border-radius: 50%;
}


.btn {
  margin-right: 1em;
  height: 40px;
  line-height: 40px;
  width: 6em;
}

.btn2 {
  margin-right: 1em;
  height: 40px;
  line-height: 40px;
  width: 6em;
  color: white;
  text-align: center;
  border-radius: 40px;
  background-color: rgba(238, 238, 238, 0.5);

}

.follow {
  margin: @item-margin 0;
  color: white;
  display: flex;
  font-weight: bolder;
}

.follow span {
  margin-right: 2em;
  font-size: 0.9em;
  font-weight: normal;
}

.user {
  display: flex;
  flex-direction: column-reverse;
  padding: calc(2 * @item-margin);
  box-sizing: border-box;
  position: absolute;
  z-index: 1;
  width: 100%;
  //background-color: rgba(238, 238, 238, 0.5);
  bottom: 0;
}

</style>