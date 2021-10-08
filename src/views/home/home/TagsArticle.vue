<template>
  <div v-if="info">
    <div class="nav" id="nav">
      <van-icon name="arrow-left" size="1.3em" @click="$router.go(-1)" color="white"/>
      <transition name="fade">
        <div class="nav-hide" v-show="showSmall">
          <img :src="info.logo" class="nav-avt" @click="$router.push('/u/' + info.username)">
          <div>
            <h3>{{ info.title }}</h3>
            <div>{{ formatNum(info.hot_num) + '热度 ' }}</div>
          </div>
          <FollowBtn :is-follow="info.focus" style="margin-left: auto" color="rgba(238, 238, 238, 0.2)"></FollowBtn>
        </div>
      </transition>
      <van-icon name="search" size="1.3em" class="right-menu" color="white"/>
    </div>
    <div class="head" ref="head" v-if='info' :style="{'--bgurl': ('url('+info.logo+')')}">
      <div class="head-main">
        <div>
          <img :src="info.logo">
          <div class="title">
            <div>{{ info.title }}</div>
            <div>{{ formatNum(info.hot_num) + '热度 ' + formatNum(info.feednum) + '讨论' }}</div>
          </div>
          <div></div>
        </div>
        <div>
          <img :src="url" v-for="url in pics">
          <div style="margin-left: 10px">{{ formatNum(info.follownum) }}人关注</div>
          <van-icon name="arrow" size="10"/>
          <FollowBtn :is-follow="info.focus" style="margin-left: auto" color="rgba(238, 238, 238, 0.2)"></FollowBtn>
        </div>
        <div style="margin-top: 10px" v-html="info.intro.replace(new RegExp('\r\n','gm'),'<br>')"></div>
      </div>
    </div>
    <div class="content" id="content">
      <TabLayout class="tabLayout" @changeTab="toggleTab">
        <div :class="0===current?'tab-on':''">最新发布</div>
        <div :class="1===current?'tab-on':''">点赞飙升</div>
        <div :class="2===current?'tab-on':''">热门动态</div>
      </TabLayout>
      <div style="margin-top: 10px">
        <ListItem v-for="item in rows" :item="item"></ListItem>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/network/request";
import TabLayout from "@/components/TabLayout";
import ListItem from "@/components/ListItem";
import FollowBtn from "@/components/FollowBtn";

export default {

  name: "TagsArticle",
  components: {FollowBtn, ListItem, TabLayout},
  data() {
    return {
      current: 0,
      info: null,
      pics: null,
      rows: null,
      showSmall: false,
      tag: decodeURIComponent(this.$route.path).replace('/t/', '')
    }
  },
  methods: {
    toggleTab(cur) {
      this.current = cur;
      this.getRows(cur)
    },
    getRows(index) {
      let s
      if (index === 0) {
        s = "&orderBy=dateline"
      } else {
        s = '&orderBy=rank_score'
      }
      request.get('/article/get?tags=' + this.tag + s).then(res => {
        this.rows = res.rows
      })
    },
    formatNum(num) {
      return num >= 10000 ? (num / 10000).toFixed(1) + 'w' : num
    },
  },
  mounted() {
    let _this = this;
    request.post('/tag/info', {title: this.tag}).then(res => {
      this.info = res.rows;
      this.pics = res.users
    })
    this.getRows(_this.current)

    function scroll(e) {
      let scrollTop = document.documentElement.scrollTop
      _this.showSmall = scrollTop >= 80
    }

    window.addEventListener('scroll', scroll)
  }
}
</script>

<style scoped lang="less">
@nav-height: 50px;
@avt-size: 35px;

.tab-on::after {
  position: absolute;
  content: "";
  width: 50%;
  height: 3px;
  bottom: 0;
  left: 25%;
  background: @theme-color;
  border-radius: 50px;
}

.tabLayout > * {
  position: relative;
  width: 33%;
  text-align: center;
  line-height: 40px;
}

.tabLayout {
  z-index: 3;
  background: white;
  position: sticky;
  top: @nav-height;
}

.content {
  background: @bg-color;
  border-radius: 10px 10px 0 0;
}

.nav {
  background: #312b32;
  //filter: blur(80px);
  background-size: cover;
  z-index: 9;
  width: 100%;
  position: fixed;
  height: @nav-height;
  top: 0;
  //background: rgba(0, 0, 0, .75);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: calc(@item-margin / 2) @item-margin;
  border-bottom: 1px solid rgba(0, 0, 0, .05);
}

.nav-hide {
  margin: 0 @item-margin;
  display: flex;
  width: 100%;
  align-items: center;
  color: white;
}

.nav-hide img {
  margin-right: @item-margin;
  object-fit: cover;
  width: @avt-size;
  height: @avt-size;
  border-radius: 50%;
  grid-row-start: span 2;
}

.right-menu {
  margin-left: auto;
}

.head-main {
  background: rgba(0, 0, 0, .3);
  padding: calc(@nav-height + @item-margin) @item-margin @item-margin @item-margin;
  color: white;
}

.head {
  position: relative;
  overflow: hidden;
}

.head::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  bottom: 0;
  background-image: var(--bgurl);
  //background: url("https://i0.wp.com/airlinkalaska.com/wp-content/uploads//aurora-2.jpg?resize=1024%2C683&ssl=1");
  background-size: cover;
  // 核心代码：
  filter: blur(80px);
  transform: scale(3);
}

.title {
  margin-left: @item-margin;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title > div:nth-child(1) {
  font-size: 1.2em;
  font-weight: bold;
}

.nav-hide > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.nav-hide h3 {
  margin: 0;
}

.head-main > div:nth-child(2) {
  display: flex;
  align-items: center;
  margin-top: @item-margin;
  padding-left: 0.5em;
  box-sizing: border-box;
}

.head-main > div:nth-child(2) img {
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  margin-left: -0.5em;
  border: 2px white solid;
  object-fit: cover;
}

.head-main > div:nth-child(1) {
  display: flex;
}

.head-main > div:nth-child(1) img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  overflow: hidden;
}


</style>