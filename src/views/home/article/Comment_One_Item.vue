<template>
  <div class="item" :style="'background:'+color+';'" @click="contentClick(item,$event)">
    <img :src="item.userAvatar" class="avt-img" @click="avaClick(item)">
    <div class="comment-content">
      <slot name="username">
        <div>
          <a class="feed-link-uname" :href="'/u/'+item.username">{{ item.username }}</a>
        </div>
      </slot>
      <div class="item-content" contenteditable="plaintext-only" v-html="formatText(item.message)" onfocus="this.blur()"></div>
      <img v-if="item.pic" class="item-pc" :id="item.id+'img'" :src="item.pic" @click="clickPic(item.pic)">{{setPic(item.id+'img',item.pic)}}
      <div class="comment-bottom">
        <TimeSpan :it-time="item.dateline"></TimeSpan>
        <span class="bottom-span" style="margin-right: 10px">
          <van-icon class="bottom-icon" name="good-job-o" @click="commentLike(item)" v-show="!item.beLike"/>
            <van-icon class="bottom-icon" name="good-job" color="#0f9d58" v-show="item.beLike" @click="commentLike(item)"/>
          <span>&nbsp;{{ item.likenum }}</span>
        </span>
        <span class="bottom-span" style="margin-right: 10px"><van-icon class="bottom-icon" name="chat-o"/><span>&nbsp;{{
            item.replynum
          }}</span></span>
      </div>
    </div>
  </div>
</template>

<script>
import TimeSpan from "@/components/TimeSpan";
import {textToOld} from "@/untils/InputUntiil";
import request from "@/network/request";
import {getTime} from "@/untils/Other";
import {ImagePreview} from "vant";

export default {
  name: "Comment_One_Item",
  props: {
    item: null,
    color:{
      default:'white'
    }
  },
  components:{
    TimeSpan
  },
  methods: {
    clickPic(url){
      event.stopPropagation()
      ImagePreview([url]);
    },
    setPic(id,url){
      this.$nextTick(()=>{
        let image = new Image();
        image.src=url
        image.onload=function (){
          let scale=image.height/200
          let img = document.getElementById(id);
          img.style.width=image.width/scale+'px'
          // img.src=url
        }
      })
    },
    avaClick(item){
      event.stopPropagation()
      this.$router.push('/u/' + item.username)
    },
    contentClick(item,e) {
      if (e.target.nodeName==='A'){

      }else{
        this.$emit('toggleCommentTarget', item)
      }
    },
    formatText(text) {
      return textToOld(text)
    },
    commentLike(item) {
      event.stopPropagation()
      let _this = this
      let data = {
        uid: this.$root.getUser().uid,
        id: item.id,
        ruid: item.uid,
        type: 'comment',
      }
      if (item.beLike) {
        request.post('/article/dislike', data).then(res => {
          item.likenum--
          _this.$set(item, 'beLike', false)
        })
      } else {
        request.post('/article/like', data).then(res => {
          item.likenum++
          _this.$set(item, 'beLike', true)
        })
      }
    },
  }
}
</script>

<style scoped lang="less">
@avt-size: 30px;
@item-minHeight: 80px;
@rsize: 8px;
.moreComment {
  display: grid;
}

.item-pc {
  border-radius: @rsize;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid rgba(100, 100, 100, 0.3);
  //max-height: 200px;
}

.avt-img {
  margin-right: 8px;
  width: @avt-size;
  height: @avt-size;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2px 0;
  box-sizing: border-box;
}

.item-content {
  margin: 5px 0;
  pointer-events: none;
  letter-spacing: @text-space;
}

.comment-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}

.comment-bottom * {
  display: flex;
  justify-content: center;
}

.item {
  display: flex;
  min-height: @item-minHeight;
  padding: @item-margin calc(1.5 * @item-margin);
  box-sizing: border-box;
}


.item-pc {
  max-width: 100%;
  border-radius: @rsize;
  border: 1px solid rgba(100, 100, 100, 0.3);
  //max-height: 200px;
}
</style>