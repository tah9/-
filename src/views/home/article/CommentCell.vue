<template>
  <div id="comment-view">
    <div class="item" v-for="data in viewRows">
      <img :src="data.userAvatar" class="avt-img" @click="$router.push('/u/' + data.username)">
      <div class="comment-content">
        <a class="feed-link-uname" :href="'/u/'+data.username">{{ data.username }}</a>
        <div class="item-content" contenteditable="plaintext-only" v-html="formatContent(data.message)"
             @focus="contentClick(data)" onfocus="this.blur()"></div>
        <img v-if="data.pic" :src="data.pic" class="item-pc">
        <div class="comment-bottom">
          <span class="comment-time">{{ getTime(data.dateline) }}</span>
          <span class="bottom-span" style="margin-right: 10px">
          <van-icon class="bottom-icon" name="good-job-o" @click="commentLike(data)" v-show="!data.like"/>
            <van-icon class="bottom-icon" name="good-job" color="#0f9d58" v-show="data.like"
                      @click="commentLike(data)"/>
          <span>&nbsp;{{ data.likenum }}</span>
        </span>
          <span class="bottom-span" style="margin-right: 10px"><van-icon class="bottom-icon" name="chat-o"/><span>&nbsp;{{
              data.replynum
            }}</span></span>
        </div>
        <div class="r-comment" v-if="data.replynum>0" :key="viewRows.id">
          <div class="cell-comment" v-for="(comment,index) in data.cellRows" @click="cellCommentClick(comment,$event)" v-if="index<5">
            <a :href="'/u/'+comment.username" class="feed-link-uname">{{ comment.username }}<span v-if="comment.isFeedAuthor === 1" class="lou">楼主</span></a>
            <span v-if="comment.rid !== comment.rrid">
              回复 <a :href="'/u/'+comment.rusername" class="feed-link-uname">{{ comment.rusername }}</a>
              <span v-if="comment.rusername === authName">楼主</span>
            </span>
            <span v-html="myText(comment)"></span>
          </div>
          <div v-if="data.replynum>5" style="color: #0f9d58">查看更多回复({{data.replynum}})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getTime} from "@/untils/Other";
import request from "@/network/request";
import {addComment,textToOld} from "@/untils/InputUntiil";

export default {
  name: "CommentCell",
  props: {
    authName: '',
    viewRows: null,
  },
  data() {
    return {
      dataV: '',
    }
  },
  watch: {},
  methods: {
    cellCommentClick(comment,e){
      if (e.target.nodeName==='A'){
        let url = e.target.getAttribute('href');
        this.$router.push(url)
      }else{
        this.$emit('toggleCommentTarget', comment)
      }
    },
    myText(item){
      return textToOld("：" + item.message)
    },
    loadComment() {

    },
    contentClick(item) {
      this.$emit('toggleCommentTarget', item)
    },
    commentLike(item) {
      let _this = this
      let data = {
        uid: this.$root.getUser().uid,
        id: item.id,
        ruid: item.uid,
        type: 'comment',
      }
      if (item.like) {
        request.post('/article/dislike', data).then(res => {
          item.likenum--
          _this.$set(item, 'like', false)
        })
      } else {
        request.post('/article/like', data).then(res => {
          item.likenum++
          _this.$set(item, 'like', true)
        })
      }
    },
    getTime(oldTime) {
      return getTime(oldTime)
    },
    formatContent(str) {
      let head = '<img ' + this.dataV + ' src="/api/graduate/emoji/'
      let end = '.jpg" class="content-emoji">'
      str = str.replace(new RegExp('\\[', "gm"), head)
      str = str.replace(new RegExp(']', "gm"), end)
      //把图片替换回文字>[图片]
      str = str.replace('<img ' + this.dataV + ' src="/api/graduate/emoji/图片.jpg" class="content-emoji">', '[图片]')
      // str=str+'...<a href="" style="color: #0f9d58">查看更多</a>'
      return str;
    }
  },
  mounted() {
    let _this = this

    _this.$nextTick(() => {
      //获取data-v（scope权限）
      let listView = document.getElementById('comment-view');
      console.log(listView);
      _this.dataV = listView.attributes[0].name
    })
  }
}
</script>

<style lang="less" scoped>
@avt-size: 30px;
@item-minHeight: 80px;
@rsize: 8px;
.cell-comment {
  align-items: center;
}


.r-comment {
  width: 100%;
  padding: calc(@item-margin / 2);
  box-sizing: border-box;
  background-color: @bg-color;
  margin-top: 10px;
}

#comment-view {
  padding: 0 calc(1.5 * @item-margin);
  box-sizing: border-box;
}

.comment-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.comment-bottom * {
  display: flex;
  justify-content: center;
}

.item {
  display: flex;
  min-height: @item-minHeight;
  margin: 20px 0;
}

.comment-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2px 0;
  box-sizing: border-box;
}


.item-pc {
  max-width: 100%;
  border-radius: @rsize;
  border: 1px solid rgba(100, 100, 100, 0.3);
  //max-height: 200px;
}

.item-content {
  margin: 5px 0;
  pointer-events: none;
  letter-spacing: @text-space;
}

.avt-img {
  margin-right: 8px;
  width: @avt-size;
  height: @avt-size;
  border-radius: 50%;
  object-fit: cover;
}

.comment-time {
  font-size: 0.8em;
  margin-right: auto;
  color: @gay-font;
}


</style>