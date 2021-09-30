<template>
  <div id="comment-view">
    <div class="item" v-for="data in viewRows">
      <img :src="data.userAvatar" class="avt-img">
      <div class="comment-content" >
        <span class="comment-name">{{ data.username }}</span>
        <div class="item-content" contenteditable="plaintext-only" v-html="formatContent(data.message)"></div>
        <img v-if="data.pic.length>0" :src="data.pic" class="item-pc">
        <div class="comment-bottom">
          <span class="comment-time">{{ getTime(data.dateline) }}</span>
          <span class="bottom-span" style="margin-right: 10px">
          <van-icon class="bottom-icon" name="good-job-o"/>
          <span >&nbsp;{{ data.likenum }}</span>
        </span>
          <span class="bottom-span" style="margin-right: 10px"><van-icon class="bottom-icon" name="chat-o"/><span>&nbsp;{{
              data.replynum
            }}</span></span>
        </div>
        <div class="r-comment" v-if="data.recent_reply_ids.length>0" v-html="addCell(data)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {getTime} from "@/untils/Other";
import request from "@/network/request";

export default {
  name: "CommentCell",
  props: {
    authName:''
  },
  data() {
    return {
      dataV: '',
      viewRows: [],
    }
  },
  methods: {
    addCell(data) {
        let result=''
        let split = data.recent_reply_ids.split(',');
        for (let i = 0; i < split.length; i++) {
          if (!('cellRows' in data)){
            data['cellRows'] = []
          }
          data.cellRows.forEach(item=>{
            if (item.id==split[i]){//值相等，类型不等
              let cell = document.createElement('div');
              cell.className='cell-comment'
              cell.setAttribute(this.dataV,'')

              let uname = document.createElement('span');
              uname.innerText=item.username
              uname.style.color='#0f9d58'

              cell.appendChild(uname)
              if (item.isFeedAuthor===1){
                let lou=document.createElement('span')
                lou.className="lou"
                lou.innerText='楼主'
                lou.setAttribute(this.dataV,'')
                cell.appendChild(lou)
              }

              //不是直接回复评论，而是回复子评论
              if (item.rid!==item.rrid){
                cell.append('回复')
                let runame = document.createElement('span');
                runame.innerText=item.rusername
                runame.style.color='#0f9d58'
                cell.appendChild(runame)
                if (item.rusername===this.authName){
                  let lou=document.createElement('span')
                  lou.className="lou"
                  lou.innerText='楼主'
                  lou.setAttribute(this.dataV,'')
                  cell.appendChild(lou)
                }
              }
              let message = document.createElement('span');
              message.innerHTML=this.formatContent("："+item.message)
              cell.appendChild(message)
              result+=cell.outerHTML
            }
          })
        }
        if (data.replynum>split.length){
          let end = document.createElement('span');
          end.style.color='#0f9d58'
          end.innerText='查看更多回复('+data.replynum+')'
          result+=end.outerHTML
        }
      return result
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
        return  str;
    }
  },
  created() {
    let _this = this
    request.get('/article/comment/' + this.$route.params.id).then(res => {
      console.log(res);
      _this.viewRows = res.rows
      let cellRows = []
      _this.viewRows.forEach((item, index) => {
        //是子评论
        if (item.rid !== 0) {
          cellRows.push(item)
        }
      });
      for (let item of _this.viewRows) {
        //有需要显示的评论的话
        if (item.recent_reply_ids.length > 0) {
          cellRows.forEach((cell, index) => {
            //根评论id等于此评论id
            if (cell.rrid === item.id) {
              if (!('cellRows' in item)) {
                item['cellRows'] = []
              }
              item.cellRows.push(cell)
            }
          })
        }
      }

    })
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

.lou{
  color: @theme-color;
  border: 1px solid @theme-color ;
  text-align: center;
  font-size: 0.5em;
  border-radius: 2px;
  margin-left: 0.5em;
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

.comment-name {
  color: @theme-color;
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

.content-emoji {
  width: 20px;
  height: 20px;
  object-fit: cover;
  pointer-events: none;
  margin-bottom: 3px;
  vertical-align: middle;
}

</style>