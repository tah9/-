<template>
  <div class="root">
    <div class="nav">
      <van-icon name="cross" style="margin-right: 1.3em" @click="$router.go(-1)"/>
      发布动态
      <van-button plain type="default" size="small" color="#0f9d58" @click="publishArticle"
                  style="margin-left: auto">&nbsp;发布&nbsp;
      </van-button>
    </div>
    <div class="content" ref="content" :style="'margin-bottom:'+(myBottom+50)+'px'">
      <div contenteditable="plaintext-only" class="input" id="input" ref="input"
           placeholder="分享你此刻的想法..."></div>
      <van-uploader v-model="fileList" multiple :max-count="9"/>
    </div>

    <div class="bottom">
      <div class="bottom-icon">
        <img src="/api/graduate/emoji/systeam/表情.jpg" @click="showEmoji">
        <img src="/api/graduate/emoji/systeam/相册.jpg">
        <img src="/api/graduate/emoji/systeam/话题.jpg">
        <img src="/api/graduate/emoji/systeam/键盘.jpg">
      </div>
      <EmojiView :my-bottom="myBottom" id="emoji"
                 @emojiClick="emojiClick" @backSpace="backSpace" ref="emoji"></EmojiView>
    </div>
  </div>
</template>

<script>
import EmojiView from "@/views/home/home/compone/EmojiView";
import request from "@/network/request";

export default {
  name: "PublishArticle",
  components: {EmojiView},
  data() {
    return {
      myBottom: 0,
      offHeight: 0,
      input: null,
      rangeOfInputBox: null,
      fileList: [],
      dataV:''
    }
  },
  methods: {
    getText() {
      //表情转换
      //replaceAll只支持2021es6
      let head='<img '+this.dataV+'="" class="content-emoji" src="/api/graduate/emoji/'
      let end='.jpg">'
      let str=this.input.innerHTML
      str=str.replace(new RegExp(head,"gm"), '[')
      str=str.replace(new RegExp(end,"gm"), ']')
      console.log(str);
      return str
    },
    publishArticle() {
      let formData = new FormData()
      let data = {
        uid: this.$root.getUser().uid,
        message: this.getText(),
        device_title: this.getDeviceTitle(),
        dateline: Date.parse(new Date()) / 1000
      }
      let articleJson = JSON.stringify(data)
      console.log(articleJson);
      formData.append("article", articleJson)

      for (let file of this.fileList) {
        formData.append("file", file.file)
      }
      request.post("/article/create", formData).then(res => {
        console.log(res);
      })
    },
    insertEmoji(url) {
      this.dataV = this.input.attributes[0].name;
      let emojiEl = document.createElement("img");
      //设置dataV
      emojiEl.setAttribute(this.dataV,'')
      emojiEl.className='content-emoji'
      emojiEl.src = url;
      if (!this.rangeOfInputBox) {
        this.rangeOfInputBox = new Range();
        this.rangeOfInputBox.selectNodeContents(this.input);
      }

      if (this.rangeOfInputBox.collapsed) {
        this.rangeOfInputBox.insertNode(emojiEl);
      } else {
        this.rangeOfInputBox.deleteContents();
        this.rangeOfInputBox.insertNode(emojiEl);
      }

      this.rangeOfInputBox.collapse(false);

    },
    emojiClick(url) {
      this.insertEmoji(url)
    },
    backSpace() {
      // let emojiEl = document.createElement("img");
      // emojiEl.className='insertEmoji'
      // this.$refs.content.appendChild(emojiEl)
      // emojiEl.src="https://img01.yzcdn.cn/vant/cat.jpeg"

      // console.log(window.getSelection());
    },
    showEmoji() {
      if (this.myBottom === 0) {
        this.myBottom = this.offHeight
      } else {
        this.myBottom = 0
      }
    },
    getDeviceTitle() {
      let regex = /\((.+?)\)/g
      return "来自酷安客户端"
      // return  navigator.userAgent.match(regex)[0].replace("(","")
      //     .replace(")","").replaceAll("; ","-")
    }
  },
  mounted() {
    let _this = this;
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    this.$nextTick(() => {
      // this.$refs.input.focus()
      this.input = this.$refs.input
      this.input.onblur = function () {
        // _this.rangeOfInputBox = document.getSelection().getRangeAt(0).cloneRange();
      }

      document.onselectionchange = () => {
        let selection = document.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          if (_this.input.contains(range.commonAncestorContainer)) {
            _this.rangeOfInputBox = range;
          }
        }
      };

      window.addEventListener('resize', function () {

        if (window.innerHeight < windowHeight) {
          _this.myBottom = 0
          _this.offHeight = windowHeight - window.innerHeight;
        } else {
          _this.myBottom = _this.offHeight
        }
      })
      setTimeout(() => {
        if (_this.offHeight === 0) {
          _this.offHeight = windowHeight * 0.33
        }
      }, 500)
    })
    // //使input保持焦点
    // document.addEventListener("click", function (e) {
    //   if (e.target.id !== "input"||e.target.getAttribute('class')!=="emoji-icon") {
    //     e.preventDefault()
    //   }
    // }, false);


  }
}
</script>

<style scoped lang="less">
@emoji-wh: 30px;

.root {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: @bg-color;
  display: flex;
  flex-direction: column;
}
.content-emoji {
  width: 20px;
  height: 20px;
  pointer-events: none;
  margin-bottom: 3px;
  vertical-align: middle;
}
.root * {
  background-color: white;
}

.content {
  margin-top: 5px;
  margin-bottom: 50px;
  padding: calc(@item-margin * 2);
  overflow: scroll;
  overflow-x: hidden;
}

.insertEmoji {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-bottom: 3px;
  pointer-events: none;
}

.input {
  min-height: 33vh;
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

.nav {
  display: flex;
  align-items: center;
  padding: @item-margin calc(2 * @item-margin);
  font-size: 1.25em;
  color: @gay-font;
  border-bottom: gainsboro 1px solid;
}

.bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.bottom-icon {
  display: flex;
  justify-content: space-between;
  padding: calc(@item-margin / 2) calc(3 * @item-margin);
  border-bottom: gainsboro 1px solid;
  border-top: gainsboro 1px solid;
}

.bottom-icon img {
  width: @icon-img-wh;
  height: @icon-img-wh;
}
</style>