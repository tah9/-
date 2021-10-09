<template>
  <div>
    <div style="border-bottom: 1px solid rgba(0, 0, 0, .05);"></div>
    <img class="topCover" v-if="isFeedArticle" :src="info.message_cover">
    <div class="main">
      <div class="item-top">
        <img class="avt-img" :src="info.userAvatar" @click="$router.push('/u/' + info.username)">
        <span class="avt-title">{{ info.username }}</span>
        <span class="avt-tag">
           <time-span :it-time="info.dateline" style="margin-right: 0"></time-span>
          &nbsp;<img class="emoji-c" src="/api/graduate/emoji/systeam/手机.jpg"/>{{ info.device_title }}
        </span>
        <FollowBtn :is-follow="info.focus" class="arr-bottom"  :follow_id="info.uid" @follow="toggleFollow"></FollowBtn>
      </div>
      <div class="main-content" contenteditable="plaintext-only" v-html="myTextToOld(info.message)"
           onfocus="this.blur()" v-if="info.message" @click="clickA($event)"></div>
      <div class="item-pics" v-if="info.pic">
        <img v-for="(url,index) in info.pic.split(',')" :src="url" @click="clickImg(info.pic.split(','),index)"/>
      </div>
    </div>
    <div class="margin-div"></div>
  </div>
</template>

<script>
import {textToOld} from "@/untils/InputUntiil";
import {getTime} from "@/untils/Other";
import TimeSpan from "@/components/TimeSpan";
import FollowBtn from "@/components/FollowBtn"
import {ImagePreview} from "vant";

export default {
  name: "ArticleContent",
  components: {TimeSpan, FollowBtn},
  props: {
    info: null,
    isFeedArticle: null
  },
  methods: {
    toggleFollow(flag){
      this.$emit('follow',flag)
    },
    clickImg(picArr, index) {
      event.stopPropagation()
      ImagePreview({
        images: picArr,
        startPosition: index
      });
    },
    clickA(e) {
      let node = e.target;
      if (node.nodeName === 'A') {
        let url = node.getAttribute('href');
        this.$router.push(url)
      }
    },
    myTextToOld(str) {
      return textToOld(str)
    },
    getTime(oldTime) {
      return getTime(oldTime);
    }
  }
}
</script>

<style scoped lang="less">
.topCover {
  width: 100%;
}

.item-pics img {
  width: 28vw;
  height: 28vw;
  object-fit: cover;
  overflow: hidden;
  margin: 2px;
  border-radius: 8px;
}

.main {
  padding: @mymargin;
}

.main-content {
  margin: @mymargin 0;
}

.emoji-c {
  width: @f-size;
  height: @f-size;
  vertical-align: middle;
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

.item-top {
  align-items: center;
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr auto;
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
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 3;
  margin-right: 1em;
}


</style>