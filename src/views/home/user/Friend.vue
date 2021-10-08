<template>
  <div>
    <div class="search">
      <img src="/api/graduate/emoji/systeam/返回.jpg">
      <input type="search" placeholder="搜索用户">
    </div>
    <div class="label">好友</div>
    <div>
      <div v-for="item in rows" class="item" @click="clickItem(item)">
        <img class="avt" :src="item.userAvatar">
        <div class="name">{{ item.username }}</div>
        <input type="checkbox" value="second_checkbox" :checked="item.check">
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/network/request";

export default {
  name: "Friend",
  methods: {
    clickItem(item) {
      this.$set(item, 'check', !item.check)
    }
  },
  data() {
    return {
      rows: null
    }
  },
  created() {
    request.get('/user/allFollow/' + this.$root.getUser().uid).then(res => {
      console.log(res);
      this.rows = res.rows
    })
  }
}
</script>

<style scoped lang="less">
.avt {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;

}

.item {
  display: flex;
  padding: @item-margin calc(2 * @item-margin);
  box-sizing: border-box;
  align-items: center;
  border-top: 1px #e0e0e0 solid;
}

.name {
  margin-left: 1em;
}

.item input {
  margin-left: auto;
}

.label {
  height: 3em;
  line-height: 3em;
  margin-left: calc(2 * @item-margin);
}

.search {
  position: sticky;
  top: @item-margin;
  overflow: hidden;
  height: 2em;
  align-items: center;
  display: flex;
  margin: @item-margin;
  background: @bg-color;
  border-radius: 50px;
}

.search img {
  margin-left: 1em;
  width: 1.2em;
  height: 1em;
}

.search input {
  border: none;
  background: @bg-color;
  margin-left: 1em;
  flex: 1;
}
</style>