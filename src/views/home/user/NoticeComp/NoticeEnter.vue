<template>
  <div>
    <div class="cell">
      <img src="/api/graduate/emoji/systeam/notice_艾特.jpg" style="background: #2097f3" class="icon-img">
      <div>@我的动态</div>
      <van-icon name="arrow" class="icon"/>
    </div>
    <div class="cell">
      <img src="/api/graduate/emoji/systeam/notice_评论.jpg"style="background: #00bcd5"  class="icon-img">
      <div>@我的评论</div>
      <van-icon name="arrow" class="icon"/>
    </div>
    <div class="cell">
      <img src="/api/graduate/emoji/systeam/notice_点赞.jpg"style="background: #4cb050"  class="icon-img">
      <div>我收到的赞</div>
      <van-icon name="arrow" class="icon"/>
    </div>
    <div class="cell">
      <img src="/api/graduate/emoji/systeam/notice_好友关注.jpg" style="background: #f44236"  class="icon-img">
      <div>好友关注</div>
      <van-icon name="arrow" class="icon"/>
    </div>
    <div class="cell">
      <img src="/api/graduate/emoji/systeam/邮箱.jpg" style="background: #ff9701"  class="icon-img">
      <div>私信</div>
      <van-icon name="arrow" class="icon"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoticeEnter"
}
</script>

<style scoped lang="less">
.icon-img {
  border-radius: 50%;
  background: @theme-color;
  width: 3em;
  height: 3em;
  padding: 0.7em;
  margin-right: 1em;
  box-sizing: border-box;
}

.icon {
  margin-left: auto;
}

.cell {
  padding: @item-margin calc(2 * @item-margin);
  display: flex;
  align-items: center;
}
</style>