<template>
  <div class="navbar">
    <div class="left" @click="leftClick">
      <van-icon name="arrow-left" color="#0f9d58" />
      <!--<span>返回</span>-->
    </div>
    <div class="center">{{ title }}</div>
    <div class="right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {};
  },
  props: {
    title: '',
    canExit: {
      default: true
    }
  },
  components: {},
  methods: {
    leftClick() {
      if (this.canExit) {
        this.$router.go(-1)
      } else {
        this.$emit('exit')
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  position: relative;
  z-index: 100;
  top: 0;
  height: 44px;
  line-height: 44px;
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
}

.right {
  right: 16px;
  top: 0;
  bottom: 0;
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.center {
  top: 0;
  bottom: 0;
  position: absolute;
  left: 0;
  right: 0;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
}

.left {
  left: 16px;
  top: 0;
  bottom: 0;
  z-index: 101;
  position: absolute;
  display: flex;
  align-items: center;
  color: #0f9d58;
}

img {
  width: 1.3em;
  height: 1.3em;
}
</style>
