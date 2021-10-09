<template>
  <div>
    <div class="main">
      <div style="display: flex;justify-content: space-between;margin-bottom: 10px">
        <span>回复</span>
        <span style="color: #0f9d58" @click="toPush()">发布</span>
      </div>
      <div contenteditable="plaintext-only" class="input" id="input" ref="input"
           :placeholder="'回复：'+commentTarget.username"></div>
      <img v-if="fileImg.key" :src="fileImg.key" class="fileImg">
    </div>
    <div class="bottom">
      <div class="bottom-icon">
        <img src="/api/graduate/emoji/systeam/表情.jpg" @click="showEmoji">
        <div class="upel">
          <img src="/api/graduate/emoji/systeam/相册.jpg">
          <input type="file" @change="insertImg" ref="contentFile">
        </div>
        <img src="/api/graduate/emoji/systeam/艾特.jpg" @click="$router.push('/friend')">
        <img src="/api/graduate/emoji/systeam/话题.jpg">
        <img src="/api/graduate/emoji/systeam/键盘.jpg">
      </div>
      <EmojiView :my-bottom="myBottom" id="emoji" @emojiClick="createEmoji" ref="emoji"></EmojiView>
    </div>
  </div>

</template>

<script>

import EmojiView from "@/views/home/home/compone/EmojiView";
import request from "@/network/request";
import {formatText} from '@/untils/InputUntiil'
import {Toast} from "vant";

export default {
  name: "EmojiInput",
  components: {EmojiView},
  data() {
    return {
      fileImg: {},
      myBottom: 0,
      input: null,
      rangeOfInputBox: null,
      dataV: null,
    }
  },
  props: {
    commentTarget: null,
    article: null
  },
  methods: {
    toPush() {
      let _this = this;
      let commentTarget = this.commentTarget;
      console.log(commentTarget);
      let formData = new FormData();
      let value = this.fileImg.value;
      if (value) {
        formData.append("file", value)
      }
      //  fid,uid,rid,rrid,message,dateline,pic,rusername,isFeedAuthor

      let toArticle = false
      //如果直接回复动态
      if (!('rid' in commentTarget)) {
        toArticle = true
        commentTarget['rid'] = 0
        commentTarget['rrid'] = 0
        commentTarget['fid'] = commentTarget.id
      }
      console.log(toArticle)
      //回复评论
      formData.append("fid", commentTarget.fid)//动态id
      //如果在子评论区自己回复自己的话，目标评论为根评论
      formData.append("rid", commentTarget.uid===this.$root.getUser().uid?commentTarget.rrid:commentTarget.id)//目标评论id
      formData.append("rrid", !toArticle && commentTarget.rrid === 0 ? commentTarget.id : commentTarget.rrid)
      formData.append("message", formatText(this.input.innerHTML))
      formData.append("dateline", Date.parse(new Date()) / 1000)
      formData.append("rusername", commentTarget.username===this.$root.getUser().username?"":commentTarget.username)
      formData.append("isFeedAuthor", this.article.uid === this.$root.getUser().uid ? 1 : 0)
      formData.append("feedUid", this.article.uid)


      request.post('/article/commentPush', formData).then(res => {
        console.log(res);
        _this.$emit('updateComment',res.rows)
        _this.$emit('hideInput')
        Toast.success('发表成功')
      })
    },
    insertImg() {
      let contentFile = this.$refs.contentFile;
      let file = contentFile.files[0]
      let base = window.webkitURL.createObjectURL(file);
      this.fileImg = {
        key: base,
        value: file
      }
    },
    showEmoji() {
      this.myBottom = this.myBottom === 0 ? document.documentElement.clientHeight * 0.3 : 0
    },
    createEmoji(url) {
      let emojiEl = document.createElement("img");
      //设置dataV
      emojiEl.setAttribute(this.dataV, '')
      emojiEl.className = 'content-emoji'
      emojiEl.src = url;
      this.insertEl(emojiEl)
      console.log('weishenm')
    },
    //向输入框插入元素
    insertEl(el) {
      this.input.focus()
      if (!this.rangeOfInputBox) {
        this.rangeOfInputBox = new Range();
        this.rangeOfInputBox.selectNodeContents(this.input);
      }
      if (this.rangeOfInputBox.collapsed) {
        this.rangeOfInputBox.insertNode(el);
      } else {
        this.rangeOfInputBox.deleteContents();
        this.rangeOfInputBox.insertNode(el);
      }
      this.rangeOfInputBox.collapse(false);
    }
  },
  created() {
    let _this = this;
    this.$nextTick(() => {
      _this.input = document.getElementById('input')
      _this.dataV = _this.input.attributes[0].name;
      setTimeout(() => _this.input.focus(), 0)
    })
    document.onselectionchange = () => {
      let selection = document.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        if (_this.input.contains(range.commonAncestorContainer)) {
          _this.rangeOfInputBox = range;
        }
      }
    }
    // //使input保持焦点
    // document.addEventListener("click", function (e) {
    //   if (e.target.nodeName !== 'INPUT') {
    //     _this.input.focus()
    //   }
    //   // if (e.target.id !== "input"||e.target.getAttribute('class')!=="emoji-icon") {
    //   //   e.preventDefault()
    //   // }
    // })
  }
}
</script>

<style scoped lang="less">
.main {
  padding: @item-margin;
}

.fileImg {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset;
}


.input {
  min-height: 10vh;
  letter-spacing: @text-space;
  vertical-align: middle;
  font-size: 1.05em;
  outline: none;
  background-color: white;
}

.input:empty:before {
  content: attr(placeholder);
  color: #c3c3b7;
}

.input img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-bottom: 3px;
  pointer-events: none;
}

.input:focus {
  caret-color: @theme-color;
}

.bottom-icon {
  display: flex;
  justify-content: space-between;
  padding: calc(@item-margin / 2) @item-margin;
  border-bottom: gainsboro 1px solid;
  border-top: gainsboro 1px solid;
}

.bottom-icon > * {
  width: @icon-img-wh;
  height: @icon-img-wh;
  position: relative;
}

.upel * {
  width: @icon-img-wh;
  position: absolute;
  height: @icon-img-wh;
}

.upel input {
  opacity: 0;
}
</style>