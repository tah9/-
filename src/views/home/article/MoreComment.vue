<template>
  <div id="comment-view">
    <div style="border-bottom: 1px solid rgba(0, 0, 0, .05);"></div>
    <Comment_One_Item :item="data" @toggleCommentTarget="contentClick"></Comment_One_Item>
    <Comment_One_Item color="#f2f1f6" :item="comment" v-for="comment in data.cellRows" @toggleCommentTarget="contentClick">
      <div slot="username">
        <a :href="'/u/'+comment.username" class="feed-link-uname">{{ comment.username }}<span
            v-if="comment.isFeedAuthor === 1" class="lou">楼主</span></a>
        <span v-if="comment.rid !== comment.rrid">
              回复 <a :href="'/u/'+comment.rusername" class="feed-link-uname">{{ comment.rusername }}</a>
              <span v-if="comment.rusername === authName">楼主</span>
            </span>
      </div>
    </Comment_One_Item>
    <van-popup v-model="showComment" position="bottom" ref="root" round v-if="showComment">
      <CommentInput :commentTarget="commentTarget" :article="article" @updateComment="updateComment"  @hideInput="showComment=false"></CommentInput>
    </van-popup>
  </div>
</template>

<script>
import Comment_One_Item from "@/views/home/article/Comment_One_Item";
import CommentInput from "@/components/CommentInput";
export default {
  name: "MoreComment",
  components: {Comment_One_Item,CommentInput},
  props:{
    data:null,
    authName:null,
    article:null
  },
  data(){
    return{
      showComment:false,
      commentTarget:null,
    }
  },
  methods:{
    contentClick(comment){
      this.commentTarget = comment;
      this.showComment=true
    },
    updateComment(comment){
      comment['username']=this.$root.getUser().username
      comment['userAvatar']=this.$root.getUser().userAvatar
      this.data.cellRows.push(comment)
    }
  }
}
</script>

<style scoped lang="less">
#comment-view {
  margin-bottom: @item-margin;
}

</style>