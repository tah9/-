<template>
  <div id="comment-view">
    <div v-for="data in viewRows" class="cell">
      <Comment_One_Item :item="data" @toggleCommentTarget="toggleCommentTarget"></Comment_One_Item>
      <div class="r-comment" v-if="data.replynum>0" :key="viewRows.id">
        <div class="cell-comment" v-for="(comment,index) in data.cellRows" @click="cellCommentClick(comment,$event)"
             v-if="index<5">
          <a :href="'/u/'+comment.username" class="feed-link-uname">{{ comment.username }}<span
              v-if="comment.isFeedAuthor === 1" class="lou">楼主</span></a>
          <span v-if="comment.rid !== comment.rrid">
              回复 <a :href="'/u/'+comment.rusername" class="feed-link-uname">{{ comment.rusername }}</a>
              <span v-if="comment.rusername === authName" class="lou">楼主</span>
            </span>
          <span v-html="formatText('：'+comment.message)"></span>
        </div>
        <div v-if="data.replynum>5" style="color: #0f9d58" @click="seeMoreComment(data)">查看更多回复({{ data.replynum }})
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/network/request";
import {addComment, textToOld} from "@/untils/InputUntiil";
import Comment_One_Item from "@/views/home/article/Comment_One_Item";

export default {
  name: "CommentCell",
  components: {Comment_One_Item},
  props: {
    authName: '',
    viewRows: null,
  },
  data() {
    return {
      dataV: '',
    }
  },
  methods: {
    toggleCommentTarget(comment) {
      this.$emit('toggleCommentTarget', comment)
    },
    formatText(text) {
      return textToOld(text)
    },
    seeMoreComment(data) {
      this.$emit('seeMoreComment', data)
    },
    cellCommentClick(comment, e) {
      if (e.target.nodeName === 'A') {
        let url = e.target.getAttribute('href');
        this.$router.push(url)
      } else {
        this.$emit('toggleCommentTarget', comment)
      }
    },
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
}

.cell {
  margin: 10px 0;
}

.r-comment {
  margin: 2px calc(@item-margin * 2) 5px calc(@item-margin + 40px);
  padding: calc(@item-margin / 2);
  box-sizing: border-box;
  background-color: @bg-color;
  border-radius: 5px;
}

#comment-view {
}


.item-pc {
  max-width: 100%;
  border-radius: @rsize;
  border: 1px solid rgba(100, 100, 100, 0.3);
  //max-height: 200px;
}

.comment-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2px 0;
  box-sizing: border-box;
}

</style>