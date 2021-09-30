<template>
  <div class="list-view" id="listView">
    <div class="list-item" v-for="(item,index) in rows" @click="contentInfo(item.id)">
      <div class="item-top">
        <img class="avt-img" :src="item.userAvatar" @click="toUserInfo(item.uid)">
        <span class="avt-title">{{ item.username }}</span>
        <span class="avt-tag">
          {{getTime(item.dateline)}}&nbsp;<img class="emoji-c" src="/api/graduate/emoji/systeam/手机.jpg"/>{{ item.device_title }}
        </span>
        <van-icon name="arrow-down" class="arr-bottom" color="#666666"/>
      </div>
      <div class="item-content" contenteditable="plaintext-only" v-html="formatContent(item.message)"></div>
      <div class="item-pics">
        <img v-for="url in item.picArr" :src="url"/>
      </div>
      <div class="item-bottom">
        <span class="bottom-span" @click="like(index)">
          <van-icon class="bottom-icon" name="good-job" v-show="item.like===true"/>
          <van-icon class="bottom-icon" name="good-job-o" v-show="item.like!==true"/>
          <span>&nbsp;{{ item.likenum }}</span>
        </span>
        <span class="bottom-span"><van-icon class="bottom-icon" name="chat-o"/><span>&nbsp;{{ item.replynum }}</span></span>
        <span class="bottom-span"><van-icon class="bottom-icon" name="share-o"/><span>&nbsp;{{ item.share_num }}</span></span>
      </div>
    </div>
  </div>
</template>

<script>


import request from "@/network/request";
import {getTime} from "@/untils/Other";

export default {
  name: "Article",
  props: {
    rows: null,
  },
  data(){
    return{
      dataV:''
    }
  },
  methods: {
    getTime(oldTime){
      return getTime(oldTime)
    },
    contentInfo(id) {
      this.$router.push('/articleInfo/' + id)
    },
    toUserInfo(uid) {
      event.stopPropagation()
      this.$router.push('/user/' + uid);
    },
    like(index) {
      event.stopPropagation()
      let item = this.rows[index]
      let data = {
        uid: this.$root.getUser().uid,
        id: item.id,
        aid:item.uid
      }
      console.log(data);
      if (item.like === true) {
        request.post('/article/dislike', data).then(res => {
          item.likenum--
          this.$set(item, "like", false)
        })
      } else {
        request.post('/article/like', data).then(res => {
          item.likenum++
          this.$set(item, "like", true)
        })
      }
    },
    formatContent(str) {
        let head = '<img ' + this.dataV + ' src="/api/graduate/emoji/'
        let end = '.jpg" class="content-emoji">'
        str = str.replace(new RegExp('\\[', "gm"), head)
        str = str.replace(new RegExp(']', "gm"), end)
        str=str+'...<a href="" style="color: #0f9d58">查看更多</a>'
       return str
    }
  },
  created() {
    let _this=this
    _this.$nextTick(()=>{
      //获取data-v（scope权限）
      let listView = document.getElementById('listView');
      console.log(listView);
      _this.dataV = listView.attributes[0].name
    })
  }
}
</script>

<style scoped lang="less">
@f-size: 1em;
@item-margin: 12px;
@avt-size: 35px;

.list-view {
  display: flex;
  flex-direction: column;
}

.list-item {
  margin: 0 8px 12px 8px;
  background-color: white;
  border-radius: 8px;
  padding: 10px 10px;
}

.list-item * {
  vertical-align: middle;
}

.item-top {
  align-items: center;
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr auto;
}

.avt-img {
  margin-right: @item-margin;
  object-fit: cover;
  width: @avt-size;
  height: @avt-size;
  border-radius: 50%;
  grid-row-start: span 2;
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
  grid-row-start: 1;
  grid-column-start: 3;
}

.item-content {
  margin-top: 10px;
  pointer-events: none;
  letter-spacing: @text-space;
}

.content-emoji {
  width: 20px;
  height: 20px;
  object-fit: cover;
  pointer-events: none;
  margin-bottom: 3px;
  vertical-align: middle;
}

.item-pics {
  margin-top: 10px;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
}

.item-pics img {
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

.bottom-span {
  display: flex;
  justify-content: center;
}
</style>