<template>
  <div class="root">
    <div class="nav" id="nav">
      <van-icon name="arrow-left" size="1.3em" @click="$router.go(-1)"/>
      <span style="margin-left: 10px" v-show="!showSmall">动态</span>

      <transition name="fade">
        <div class="nav-hide" v-show="showSmall">
          <img :src="info.userAvatar" class="nav-avt" @click="$router.push('/u/' + info.username)">
          <h4>{{ info.username }}</h4>
          <div v-show="info.uid!==$root.getUser().uid"
               :style="'background:' +btnColor()+';'">{{ checkFocus() }}
          </div>
        </div>
      </transition>
      <van-icon name="label-o" size="1.3em" class="right-menu"/>
    </div>

    <div class="content" id="content">
      <div class="main">
        <div class="item-top">
          <img class="avt-img" :src="info.userAvatar"  @click="$router.push('/u/' + info.username)>
          <span class="avt-title">{{ info.username }}</span>
          <span class="avt-tag">
            {{ getTime(info.dateline) }}
          &nbsp;<img class="emoji-c" src="/api/graduate/emoji/systeam/手机.jpg"/>{{ info.device_title }}
        </span>
          <div class="arr-bottom" v-show="info.uid!==$root.getUser().uid"
               :style="'background:' +btnColor()+';'">{{ checkFocus() }}
          </div>
        </div>
        <div class="main-content" contenteditable="plaintext-only" :id="info.id"></div>
        <div class="item-pics">
          <img v-for="url in info.picArr" :src="url"/>
        </div>
      </div>
      <div class="margin-div"></div>
      <div class="content-bottom">
        <span>赞{{info.likenum}}</span>
        <span>回复{{info.replynum}}</span>
        <span></span> <span></span>
        <span>转发556</span>
      </div>
      <div class="margin-div"></div>
      <comment-cell :auth-name="info.username"></comment-cell>
    </div>

    <div class="bottom">
      <van-icon name="edit"/>
      <div>写回复</div>
      <van-icon name="comment-o" :badge="info.likenum"/>
      <van-icon name="good-job-o" :badge="info.replynum"/>
      <van-icon name="star-o" badge="9"/>
      <van-icon name="share-o"/>
    </div>
  </div>
</template>

<script>
import request from "@/network/request";
import {getTime} from "@/untils/Other";
import CommentCell from "@/views/home/article/CommentCell";

export default {
  name: "ArticleInfo",
  components: {CommentCell},
  data() {
    return {
      info: {},
      text: '',
      showSmall: false,
    }
  },
  methods: {
    formatText() {
      this.$nextTick(() => {
        let content = document.getElementById(this.info.id)
        let str = this.info.message
        let head = '<img src="/api/graduate/emoji/'
        let end = '.jpg" style="width: 20px; height: 20px; pointer-events: none; margin-bottom: 3px; vertical-align: middle;">'
        str = str.replace(new RegExp('\\[', "gm"), head)
        str = str.replace(new RegExp(']', "gm"), end)
        content.innerHTML = str;
      })
    },
    checkFocus() {
      return this.info.focus ? '已关注' : '关注'
    },
    btnColor() {
      return this.info.focus ? '#666666' : '#0f9d58'
    },
    getTime(oldTime) {
      return getTime(oldTime);
    }
  },
  created() {
    request.get('/article/info/' + this.$route.params.id).then(res => {
      console.log(res);
      this.info = res.info
      this.formatText()
    })

    this.$nextTick(() => {
      let _this = this
      let content = document.getElementById('content')
      content.addEventListener('scroll', ev => {
        _this.showSmall = content.scrollTop > 35
      })
    })
  }
}
</script>

<style scoped lang="less">
@mymargin: 24px;
.root {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.emoji-c {
  width: @f-size;
  height: @f-size;
  vertical-align: middle;
}
.nav-hide {
  margin: 0 @mymargin;
  display: flex;
  align-items: center;
}

.nav-hide h4 {
  margin: 0 calc(2 * @mymargin) 0 @mymargin;
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
.item-pics {
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.item-pics img {
  width: 28vw;
  height: 28vw;
  object-fit: cover;
  overflow: hidden;
  margin: 2px;
  border-radius: 8px;
}

.main-content {
  margin: @mymargin 0;
  pointer-events: none;
}

@f-size: 1em;
@mymargin: 12px;
@avt-size: 35px;
@nav-height: 50px;
.margin-div {
  background: @gay-bg;
  height: calc(@mymargin / 2 );
}

.content-bottom {
  position: sticky;
  height: @nav-height;
  background: white;
  box-sizing: border-box;
  display: flex;
  padding: @mymargin;
  justify-content: space-between;
  top: 0;
}

.main {
  padding: @mymargin;
}

.content {
  margin: @nav-height 0;
  overflow: scroll;
  height: calc(100% - 2 * @nav-height);
}

.item-top {
  align-items: center;
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr auto;
}

.nav {
  background: white;
  z-index: 9;
  width: 100%;
  position: fixed;
  height: @nav-height;
  top: 0;
  //background: rgba(0, 0, 0, .75);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: calc(@mymargin / 2) @mymargin;
  border-bottom: 1px solid rgba(0, 0, 0, .05);
}


.nav-avt {
  border-radius: 50%;
  width: 2em;
  height: 2em;
}


.right-menu {
  margin-left: auto;
}

.avt-img {
  margin-right: @mymargin;
  object-fit: cover;
  width: @avt-size;
  height: @avt-size;
  border-radius: 50%;
  grid-row-start: span 2;
}

.avt-title {
  font-size: calc(@f-size - 1px);
}

.avt-tag {
  display: flex;
  align-items: center;
  color: #bdbdbd;
  font-size: calc(@f-size - 3px);
  grid-column-start: 2;
  line-height: 17.5px;
}

.arr-bottom {
  font-size: calc(@f-size - 1px);
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 3;
  margin-right: 1em;
  color: white;
  height: 1.7em;
  line-height: 1.7em;
  width: 4em;
  text-align: center;
  border-radius: 40px;
  background-color: @theme-color;
}

.bottom {
  box-shadow: 0 -2px 2px 1px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 0 @mymargin;
  height: @nav-height;
  position: absolute;
  width: 100%;
  display: flex;
  bottom: 0;
  background: white;
  justify-content: space-between;
  align-items: center;
}

.bottom div {
  flex: 0.4;
}

.fade-enter-active {
  transition: opacity .5s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>