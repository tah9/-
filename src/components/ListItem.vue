<template>
  <div class="list-item" @click="contentInfo(item.id,$event)">
    <div class="item-top">
      <img class="item-avt-img" :src="item.userAvatar" @click="toUserInfo(item.username)">
      <span class="list-item-avt-title">{{ item.username }}</span>
      <span class="list-item-avt-tag">
          {{ getTime(item.dateline) }}&nbsp;<img class="emoji-c"
                                                 src="/api/graduate/emoji/systeam/手机.jpg"/>{{ item.device_title }}
        </span>
      <van-icon name="arrow-down" class="arr-bottom" color="#666666"/>
    </div>
    <div class="list-item-content" onfocus="this.blur()"
         contenteditable="plaintext-only" v-html="formatContent(item.message)"></div>
    <div class="list-item-pics">
      <img v-if="item.pic.length>0" v-for="(url,index) in item.pic.split(',')" :src="url"
           @click="clickImg(item.pic.split(','),index)"/>
    </div>
    <div class="first-comment" v-if="'firstComment' in item.other">
      <div class="comment-like-number">
        <div>{{ item.other.firstComment.likenum }}赞</div>
      </div>
      <div v-html="setFirstComment(item.other.firstComment)" class="first-comment-main"></div>
    </div>
    <div class="item-bottom">
        <span class="list-item-bottom-span" @click="like(item)">
          <van-icon class="bottom-icon" name="good-job" color="#0f9d58" v-show="'like' in item.other"/>
          <van-icon class="bottom-icon" name="good-job-o" v-show="!('like' in item.other)"/>
          <span>&nbsp;{{ item.likenum }}</span>
        </span>
      <span class="list-item-bottom-span"><van-icon class="bottom-icon" name="chat-o"/><span>&nbsp;{{
          item.replynum
        }}</span></span>
      <span class="list-item-bottom-span"><van-icon class="bottom-icon" name="share-o"/><span>&nbsp;{{
          item.share_num
        }}</span></span>
    </div>
  </div>
</template>

<script>
import {ImagePreview} from "vant";
import {getTime} from "@/untils/Other";
import request from "@/network/request";
import {formatText, textToOld} from "@/untils/InputUntiil";

export default {
  name: "ListItem",
  props: {
    item: null,
  },
  methods: {
    setFirstComment(comment) {
      let result = ''
      let uname = document.createElement('span')
      uname.className = 'first-comment-name'
      uname.innerText = comment.username
      result += uname.outerHTML
      if (comment.uid === this.item.uid) {
        let lou = document.createElement('span')
        lou.className = "lou"
        lou.innerText = '楼主'
        result += lou.outerHTML
      }
      result += "："
      result += this.formatContent(comment.message)
      return result
    },
    clickImg(picArr, index) {
      event.stopPropagation()
      ImagePreview({
        images: picArr,
        startPosition: index
      });
    },
    getTime(oldTime) {
      return getTime(oldTime)
    },
    contentInfo(id, e) {
      let node = e.target;
      if (node.nodeName !== 'A') {
        this.$router.push('/articleInfo/' + id)
      } else {
        let url = node.getAttribute('href');
        this.$router.push(url)
      }
    },
    toUserInfo(username) {
      event.stopPropagation()
      this.$router.push('/u/' + username);
    },
    like(item) {
      event.stopPropagation()
      let data = {
        uid: this.$root.getUser().uid,
        id: item.id,
        ruid: item.uid,
        type: "article"
      }
      console.log(data);
      if ('like' in item.other) {
        request.post('/article/dislike', data).then(res => {
          item.likenum--
          delete item.other.like
        })
      } else {
        request.post('/article/like', data).then(res => {
          item.likenum++
          item.other['like'] = true
        })
      }
    },
    formatContent(str) {
      str = textToOld(str)
      //把图片替换回文字>[图片]
      str = str.replace('<img ' + this.dataV + ' src="/api/graduate/emoji/图片.jpg" class="content-emoji">', '[图片]')
      return str
    }
  },
}
</script>

<style lang="less">
@f-size: 1em;
@item-margin: 12px;
@avt-size: 35px;
.first-comment {
  border-radius: 8px;
  background-color: @gay-bg;
  overflow: hidden;
}

.first-comment-main {
  padding: calc(@item-margin / 2) @item-margin;
  box-sizing: border-box;
  font-size: 14px;
}

.first-comment-name {
  color: @theme-color;
}

.lou {
  color: @theme-color;
  border: 1px solid @theme-color;
  text-align: center;
  font-size: 0.5em;
  border-radius: 2px;
  margin-left: 0.5em;
}

.comment-like-number {
  width: 5em;
  height: 1em;
  border-radius: 0 0 3px 0;
  padding: 2px @item-margin;
  box-sizing: border-box;
  text-align: center;
  margin-left: -2em;
  background-color: @theme-color;
  transform: skewX(-15deg);
  line-height: 1em;
}

.comment-like-number div {
  min-width: 5em;
  color: white;
  line-height: 1em;
  margin: 0.3em 0 0 3em;
  font-size: 0.5em;
  transform: skewX(15deg);
}

.list-item {
  margin: 0 8px 12px 8px;
  background-color: white;
  border-radius: 8px;
  padding: 10px 10px;
}


.item-top {
  align-items: center;
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr auto;
}

.item-avt-img {
  margin-right: @item-margin;
  object-fit: cover;
  width: @avt-size;
  height: @avt-size;
  border-radius: 50%;
  grid-row-start: span 2;
}

.list-item-avt-title {
  font-size: calc(@f-size - 1px);
}

.list-item-avt-tag {
  display: flex;
  align-items: center;
  color: #bdbdbd;
  font-size: calc(@f-size - 3px);
  grid-column-start: 2;
  line-height: 17.5px;
}

.arr-bottom {
  grid-row-start: 1;
  grid-column-start: 3;
}

.list-item-content {
  margin-top: 10px;
  letter-spacing: @text-space;

  -webkit-touch-callout: none;
  -webkit-user-select: none;

  -khtml-user-select: none;

  -moz-user-select: none;

  -ms-user-select: none;

  user-select: none;
}


.list-item-pics {
  width: 100%;
  height: 100%;
  margin-top: 10px;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  object-fit: cover;
  margin-bottom: 10px;
}

.list-item-pics img {
  width: 28vw;
  height: 28vw;
  margin: 2px;
  object-fit: cover;
}

.emoji-c {
  width: @f-size;
  height: @f-size;
  vertical-align: middle;
}

.item-bottom {
  margin-top: 10px;
  display: flex;
  padding: 0 30px;
  justify-content: space-between;
}

.list-item-bottom-span {
  display: flex;
  justify-content: center;
}
</style>