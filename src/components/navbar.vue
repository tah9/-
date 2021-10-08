<template>
  <div class="navbar">
    <div class="left" @click="leftClick">
      <van-icon name="arrow-left" color="#0f9d58"/>
      <!--<span>返回</span>-->
    </div>
    <div class="center">{{ title }}</div>
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
      if (this.exit) {
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
  z-index: 111;
  top: 0;
  height: 44px;
  line-height: 44px;
  width: 100%;
}

.center {
  top: 0;
  bottom: 0;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}

.left {
  z-index: 999;
  left: 0;
  top: 0;
  bottom: 0;
  position: absolute;
  padding: 16px;
  display: flex;
  align-items: center;
  color: #0f9d58;

}

/*.right {*/
/*  display: flex;*/
/*  color: #1989FA;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*}*/
</style>
