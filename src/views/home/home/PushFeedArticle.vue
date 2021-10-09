<template>
  <div class="root">
    <div class="nav">
      <van-icon name="cross" style="margin-right: 1.3em" @click="$router.go(-1)"/>
      发布动态
      <van-button plain type="default" size="small" color="#0f9d58" @click="publishArticle"
                  style="margin-left: auto">&nbsp;发布&nbsp;
      </van-button>
    </div>
    <div style="height: 3px;background: #f1f2f6"></div>
    <div class="content" ref="content" :style="'margin-bottom:'+(myBottom+39)+'px'">
      <div class="coverImg">
        <img v-show="titleImg" ref="titleImg">
        <input id="upTitleCover" type="file" @change="titleImgLoad()">
      </div>
      <input class="titleInput" type="text" placeholder="标题" ref="title">
      <div contenteditable="plaintext-only" class="input" id="input"
           ref="input" placeholder="正文"></div>
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
      <EmojiView :my-bottom="myBottom" id="emoji" @emojiClick="emojiClick" @backSpace="backSpace"
                 ref="emoji"></EmojiView>
    </div>
  </div>
</template>

<script>
import EmojiView from "@/views/home/home/compone/EmojiView";
import request from "@/network/request";
import {dataURLtoFile} from "@/untils/FileUtil";
import {formatText} from "@/untils/InputUntiil";

export default {
  name: "PublishArticle",
  components: {EmojiView},
  data() {
    return {
      titleImg: null,
      myBottom: 0,
      offHeight: 0,
      input: null,
      rangeOfInputBox: null,
      dataV: '',
      map: new Map()
    }
  },
  methods: {
    titleImgLoad() {
      let upTitleload = document.getElementById('upTitleCover')
      let file = upTitleload.files[0]
      this.titleImg = file
      let base = window.webkitURL.createObjectURL(file);
      this.$refs.titleImg.src = base
      this.map.set(base, file)
    },
    getText() {
      //表情转换
      //replaceAll只支持2021es6
      let str = this.input.innerHTML
      let head = '<img class="content-emoji" src="/api/graduate/emoji/'
      let end = '.jpg">'
      str = str.replace(new RegExp(this.dataV + "=\"\"", "gm"), '')
      str = str.replace(new RegExp(head, "gm"), '[')
      str = str.replace(new RegExp(end, "gm"), ']')
      str = str.replace(new RegExp(']<div', 'gm'), end)
      return str
    },
    publishArticle() {
      let formData = new FormData()
      let imgs = this.input.getElementsByClassName('content-Img');
      for (let img of imgs) {
        formData.append('file', this.map.get(img.src))
      }
      formData.append('file', this.map.get(this.$refs.titleImg.src))
      //上传图片
      request.post('/article/upPics', formData).then(res => {
        return Promise.resolve(res.split(','))
      }).then(urls => {//替换图片路径
        for (let i = 0; i < imgs.length; i++) {
          imgs[i].src = urls[i]
        }
        return Promise.resolve(urls[urls.length - 1])
      }).then((titleUrl) => {
        let data = {
          uid: this.$root.getUser().uid,
          message: formatText(this.input.innerHTML),
          message_title: this.$refs.title.value,
          message_cover: titleUrl,
          device_title: this.getDeviceTitle(),
          dateline: Date.parse(new Date()) / 1000,
          feedType: 'feedArticle'
        }
        let articleJson = JSON.stringify(data)
        console.log(articleJson);
        formData.append("article", articleJson)
        request.post("/article/create", formData).then(res => {
          console.log(res);
        })
      })

    },
    insertImg() {
      let contentFile = this.$refs.contentFile;
      let file = contentFile.files[0]
      let base = window.webkitURL.createObjectURL(file);
      this.map.set(base, file)
      this.dataV = this.input.attributes[0].name;
      let emojiEl = document.createElement("img");
      //设置dataV
      emojiEl.setAttribute(this.dataV, '')
      emojiEl.className = 'content-Img'
      emojiEl.src = base;
      this.input.focus()

      let desc = document.createElement('div')
      desc.setAttribute(this.dataV, '')
      // desc.setAttribute('placeholder', '图片描述')
      desc.innerText = '图片描述'
      desc.className = 'describe'
      let con = document.createElement('div')
      con.className = 'content-img-root'
      con.setAttribute(this.dataV, '')
      con.appendChild(emojiEl)
      con.appendChild(desc)
      con.addEventListener('click', click)
      this.inputAddEl(con)
      let _this = this

      function click() {
        _this.input.removeChild(con);
        _this.map.delete(con.children[0].src)
      }

      this.inputAddEl(document.createElement('br'))
      this.myBottom = 0
    },
    inputAddEl(el) {
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
    },
    insertEmoji(url) {
      this.dataV = this.input.attributes[0].name;
      let emojiEl = document.createElement("img");
      emojiEl.className = 'content-emoji'
      emojiEl.src = url;
      this.input.focus()
      this.inputAddEl(emojiEl)

      // this.rangeOfInputBox.setStart(emojiEl,0)
      // this.rangeOfInputBox.collapse(false)
      // this.input.getSelection.addRange(this.rangeOfInputBox)
      // let range = this.input.createRange();
      // //返回用户当前的选区
      // let sel =  this.input.getSelection();
      // range.setStart(1, 0);
      // //使得选区(光标)开始与结束位置重叠
      // range.collapse(true);
      // //移除现有其他的选区
      // sel.removeAllRanges();
      // //加入光标的选区
      // sel.addRange(range);
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
      return "来自客户端"
      // return  navigator.userAgent.match(regex)[0].replace("(","")
      //     .replace(")","").replaceAll("; ","-")
    }
  },
  mounted() {
    let _this = this;
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    this.$nextTick(() => {
      this.input = this.$refs.input
      setTimeout(function () {
        _this.input.focus();
      }, 0);

      // this.input.onblur = function () {
      //   _this.input.focus()
      // }

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
    //使input保持焦点
    document.addEventListener("click", function (e) {
      if (e.target.nodeName !== 'INPUT') {
        _this.input.focus()
      }
      // if (e.target.id !== "input"||e.target.getAttribute('class')!=="emoji-icon") {
      //   e.preventDefault()
      // }
    }/*, false*/);


  }
}
</script>

<style scoped lang="less">
@emoji-wh: 30px;
.titleInput {
  width: 100%;
  border-bottom: 1px gray solid;
  border-top: none;
  border-left: none;
  border-right: none;
  margin: 1em 0;
  padding: 5px;
  font-weight: bolder;
  font-size: 1.2em;
}

.describe {
  width: 100%;
  display: block;
  color: lightgrey;
  text-align: center;
  margin-bottom: @item-margin;
}

//.describe:empty::before {
//  color: lightgrey;
//  content: attr(placeholder);
//}

.content-img-root {
  position: relative;
  width: 100%;
  height: auto;
  pointer-events: none;
  display: block;
}

.content-Img {
  border-radius: 5px;
  margin: @item-margin 0 5px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset;
  width: 100%;
}

.content-img-root::before {
  content: 'x';
  display: inline-block;
  width: 50px;
  height: 50px;
  pointer-events: auto;
  border-radius: 50%;
  border: solid 2px #fff;
  background: #FF0000;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 50px;
  transform: scale(0.5, 0.5);
  position: absolute;
  right: -15px;
  top: -5px;
  cursor: pointer;
}

.titleInput::placeholder {
  font-weight: bolder;
  font-size: 1.2em;
}

.coverImg {
  position: relative;
  background: #f5f5f5;
  height: 100px;
  line-height: 100px;
  color: #888888;
}

.coverImg::after {
  text-align: center;
  content: "+添加题图";
  margin-left: 40%;
}

.coverImg > input {
  width: 100%;
  position: absolute;
  height: 100%;
  opacity: 0;
}

.coverImg img {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset;
}

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


.content {
  margin-bottom: 50px;
  padding: calc(@item-margin * 2);
  overflow: scroll;
  background-color: white;
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


.input:focus {
  caret-color: @theme-color;
}

.nav {
  background: white;
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
  background: white;
}

.bottom-icon {
  display: flex;
  justify-content: space-between;
  padding: calc(@item-margin / 2) calc(3 * @item-margin);
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