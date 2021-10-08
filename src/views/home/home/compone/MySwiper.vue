<template>
  <div class="swiper" :style="'height:'+height+';'">
    <div class="wrap" :style="'left:0px;width:'+maxWidth+'px;height:'+height+';'" ref="wrap">
      <slot :style="'height:'+height+';'"></slot>
    </div>
    <div class="indicator" ref="indicator">
      <span :class="{on:index===i}" v-for="(item,i) in childSum" @click="togglePage(i)">●</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rootWidth: document.documentElement.clientWidth,
      index: 0,
      maxWidth: 0,
      childSum: 0,
    }
  },
  methods: {
    togglePage(i) {
      this.index = i
      this.$refs.wrap.style.left = -this.rootWidth * i + 'px'
    }
  },
  props: {
    sleepTime: 0,
    height: 0
  },
  mounted() {
    let _this = this

    this.$nextTick(() => {
      let wrap = this.$refs.wrap;
      _this.childSum = wrap.children.length
      _this.maxWidth = _this.childSum * _this.rootWidth

      for (let i = 0; i < _this.childSum; i++) {
        wrap.children[i].style.height = _this.height
      }

      function nextPic() {
        let temp
        if (wrap.style.left === '-' + (_this.maxWidth - _this.rootWidth) + 'px') {
          _this.index = 0
          temp = 0
        } else {
          _this.index++
          temp = parseInt(wrap.style.left) - _this.rootWidth
        }
        wrap.style.left = temp + 'px'
      }
      if (_this.sleepTime !== undefined) {
        setInterval(() => {
          nextPic()
        }, parseInt(_this.sleepTime))
      }
    })
  }
}
</script>

<style scoped>
.swiper {
  overflow-y: hidden;
  position: relative;
  width: 100%;
  overflow-x: scroll;
}
.swiper::-webkit-scrollbar {
  display: none;
}

.wrap {
  position: absolute;
  z-index: 1;
  transition: all 1s;
}

.wrap * {
  float: left;
  width: 100vw;
  object-fit: cover;
  transition: all 1s;
}

.indicator {
  z-index: 2;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
  display: flex;
  justify-content: center;
}

.indicator span {
  margin: 0 10px;
  color: beige;
  font-size: 1.5em;
}

.on {
  color: green !important;
}
</style>
