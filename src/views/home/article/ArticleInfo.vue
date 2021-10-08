<template>
  <div class="root">
    <div class="nav" id="nav">
      <van-icon name="arrow-left" size="1.3em" @click="$router.go(-1)"/>
      <span style="margin-left: 10px" v-show="!showSmall&&!isFeedArticle">动态</span>

      <transition name="fade">
        <div class="nav-hide" v-show="showSmall">
          <img :src="info.userAvatar" @click="$router.push('/u/' + info.username)">
          <h4>{{ info.username }}</h4>
          <FollowBtn :is-follow="info.focus" class="arr-bottom"></FollowBtn>
        </div>
      </transition>
      <van-icon name="label-o" size="1.3em" class="right-menu"/>
    </div>

    <div class="content" id="content" :style="'margin-top:'+(isFeedArticle?0:50)+'px'">
      <div style="border-bottom: 1px solid rgba(0, 0, 0, .05);"></div>
      <img class="topCover" v-if="isFeedArticle" :src="info.message_cover">
      <div class="main">
        <div class="item-top">
          <img class="avt-img" :src="info.userAvatar" @click="$router.push('/u/' + info.username)">
          <span class="avt-title">{{ info.username }}</span>
          <span class="avt-tag">
            {{ getTime(info.dateline) }}
          &nbsp;<img class="emoji-c" src="/api/graduate/emoji/systeam/手机.jpg"/>{{ info.device_title }}
        </span>
          <FollowBtn :is-follow="info.focus" class="arr-bottom"></FollowBtn>
        </div>
        <div class="main-content" contenteditable="plaintext-only" v-html="myTextToOld(info.message)"
             onfocus="this.blur()" v-if="info.message" @click="clickA($event)"></div>
        <div class="item-pics">
          <img v-for="url in info.picArr" :src="url"/>
        </div>
      </div>
      <div class="margin-div"></div>
      <div class="content-bottom" :style="'top:'+(isFeedArticle?50:0)+'px'">
        <span>赞 {{ info.likenum }}</span>
        <span>回复 {{ info.replynum }}</span>
        <span></span> <span></span>
        <span>转发 556</span>
      </div>
      <div class="margin-div"></div>
      <comment-cell :auth-name="info.username" :view-rows="resultRows"
                    @toggleCommentTarget="cItem=>{commentTarget=cItem;showComment=true}"
                    :style="'margin-bottom:'+(isFeedArticle?0:50)+'px'"></comment-cell>
    </div>

    <div class="bottom" v-if="info.other">
      <van-icon name="edit"/>
      <div style="flex: 0.4;margin-left: 1em" @click="writeComment()">写回复</div>
      <div style="flex: 0.6;display: flex;justify-content: space-around;">
        <div class="bottom-icon">
          <van-icon name="comment-o"/>
          <van-badge :content="info.replynum"/>
        </div>
        <div v-show="'like' in info.other" class="bottom-icon">
          <van-icon name="good-job" color="#0f9d58" @click="likeInfo(info)"/>
          <van-badge :content="info.likenum"/>
        </div>
        <div v-show="!('like' in info.other)" class="bottom-icon">
          <van-icon name="good-job-o" @click="likeInfo(info)"/>
          <van-badge :content="info.likenum"/>
        </div>
        <div class="bottom-icon">
          <van-icon name="star-o"/>
          <van-badge :content="9"/>
        </div>
        <div class="bottom-icon">
          <van-icon name="share-o"/>
          <van-badge :content="9"/>
        </div>
      </div>
    </div>
    <van-popup v-model="showComment" position="bottom" ref="root" round>
      <CommentInput :commentTarget="commentTarget" :article="info" @updateComment="updateComment"></CommentInput>
    </van-popup>
  </div>
</template>

<script>
import request from "@/network/request";
import {getTime} from "@/untils/Other";
import CommentCell from "@/views/home/article/CommentCell";
import FollowBtn from "@/components/FollowBtn";
import CommentInput from "@/components/CommentInput";
import {addComment, formatText, textToOld} from "@/untils/InputUntiil";

export default {
  name: "ArticleInfo",
  components: {FollowBtn, CommentCell, CommentInput},
  data() {
    return {
      info: {},
      text: '',
      showComment: false,
      showSmall: false,
      commentTarget: null,
      viewRows: null,
      resultRows:null
    }
  },
  computed: {
    isFeedArticle() {
      return this.info.feedType === 'feedArticle'
    }
  },
  methods: {
    updateComment(comment) {
      console.log(comment);
      let _this=this
      comment['username']=this.$root.getUser().username
      comment['userAvatar']=this.$root.getUser().userAvatar
      this.viewRows.push(comment);
      this.formatComment()
    },
    formatComment(){
      let _this=this
      let cellRows = []
      this.resultRows=[]
      _this.viewRows.forEach((item, index) => {
        //是子评论
        if (item.rrid !== 0) {
          cellRows.push(item)
        }
        //根评论
        else{
          item['cellRows']=[]
          _this.resultRows.push(item)
        }
      });
      //添加
      for (let item of _this.resultRows) {
        //有需要显示的评论的话
        if (item.replynum!==0) {
          cellRows.forEach((cell, index) => {
            //根评论id等于此评论id
            if (cell.rrid === item.id) {
              item.cellRows.push(cell)
            }
          })
        }
      }
      _this.resultRows.sort(function (a, b) {
        return b.rank_score - a.rank_score
      });
    },
    writeComment() {
      this.commentTarget = this.info;
      this.showComment = true;
      console.log(this.commentTarget)
    },
    clickA(e) {
      let node = e.target;
      if (node.nodeName === 'A') {
        let url = node.getAttribute('href');
        this.$router.push(url)
      }
    },
    likeInfo(item) {
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
    myTextToOld(str) {
      return textToOld(str)
    },
    getTime(oldTime) {
      return getTime(oldTime);
    }
  },
  created() {
    request.get('/article/comment/' + this.$route.params.id).then(res => {
      this.viewRows = res.rows
      this.formatComment()
    })
    request.get('/article/info/' + this.$route.params.id).then(res => {
      console.log(res);
      this.info = res.info
      console.log(this.info);
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
@f-size: 1em;
@mymargin: 12px;
@avt-size: 35px;
@nav-height: 50px;
.topCover {
  width: 100%;
}

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

.bottom-icon {
  display: flex;
  align-items: center;
}

.nav-hide img {
  margin-right: @mymargin;
  object-fit: cover;
  width: @avt-size;
  height: @avt-size;
  border-radius: 50%;
  grid-row-start: span 2;
}

.nav-hide h4 {
  margin: 0 calc(2 * @mymargin) 0 @mymargin;
  line-height: 2em;
}

.item-pics {
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.van-badge {
  background: white;
  color: @gay-font;
  margin-bottom: 10px;
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
}


.margin-div {
  background: @gay-bg;
  height: calc(@mymargin / 2);
}

.content-bottom {
  position: sticky;
  height: @nav-height;
  background: white;
  box-sizing: border-box;
  display: flex;
  padding: @mymargin;
  z-index: 3;
  justify-content: space-between;
}

.avt-img {
  margin-right: @mymargin;
  object-fit: cover;
  width: @avt-size;
  height: @avt-size;
  border-radius: 50%;
  grid-row-start: span 2;
}

.main {
  padding: @mymargin;
}

.content {
  overflow: scroll;
  height: calc(100% - @nav-height);
}

.item-top {
  align-items: center;
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr auto;
}

.nav {
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
}

.right-menu {
  margin-left: auto;
}


.nav-avt {
  border-radius: 50%;
  width: 2em;
  height: 2em;
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
  //font-size: calc(@f-size - 1px);
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 3;
  margin-right: 1em;
  //color: white;
  //height: 1.7em;
  //line-height: 1.7em;
  //width: 4em;
  //text-align: center;
  //border-radius: 40px;
  //background-color: @theme-color;
}

.bottom {
  bottom: 0;
  width: 100%;
  box-shadow: 0 -1px 1px 1px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 0 @mymargin;
  height: @nav-height;
  position: absolute;
  display: flex;
  background: white;
  align-items: center;
}


.fade-enter-active {
  transition: opacity .5s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>