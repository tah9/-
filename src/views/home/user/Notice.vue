<template>
  <div>
    <navbar title="通知">
        <img src="/api/graduate/emoji/systeam/已读.jpg" style="margin-right: 1em">
        <img src="/api/graduate/emoji/systeam/删除.jpg">
    </navbar>
    <NoticeEnter></NoticeEnter>
  </div>
</template>

<script>
import NoticeEnter from "@/views/home/user/NoticeComp/NoticeEnter";
import Navbar from "@/components/navbar";

export default {
  name: "Notice",
  components: {Navbar, NoticeEnter}
}
</script>

<style scoped lang="less">
</style>