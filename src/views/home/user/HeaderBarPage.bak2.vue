<template>
  <div id="root">
    <div id="headerBox" :style="'height:'+navNormalHeight+'px'">
      <div id="headerRoot">
        <img :src="coverImg" id="coverImg">
        <slot name="headerInfo"></slot>
        <div id="mask"></div>
      </div>
    </div>
    <div id="content" :style="'height:calc(100% - '+navShrinkHeight+'px)'">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "test",
  props :{
    navNormalHeight: 0,
    navShrinkHeight: 0,
    navExpandHeight: 0,
    coverImg:''
  },
  mounted() {
    this.$nextTick(() => {
      let _this = this;
      let topView = document.getElementById('headerBox')
      let content = document.getElementById('content')
      let mask=document.getElementById('mask')

      let startY
      let oldHeight
      let up
      let oldTop = 0
      let subHeight = 0
      let tempY = 0
      let timeout
      let navHeight=_this.navNormalHeight

      window.addEventListener('touchstart', ev => {

        let touch = ev.targetTouches[0]
        startY = touch.clientY
        tempY = touch.clientY
        oldHeight = topView.clientHeight
        oldTop = content.scrollTop
      })
      window.addEventListener('touchend', ev => {

        if (!up /*&& navHeight !== _this.navShrinkHeight*/&&navHeight>=_this.navNormalHeight) {
          let interval = setInterval(() => {
            if (navHeight <= _this.navNormalHeight) {
              clearInterval(interval)
            }
            navHeight -= 5;
            if (navHeight <= _this.navNormalHeight) {
              navHeight = _this.navNormalHeight
            }
            topView.style.height = navHeight + 'px'
          }, 5)
        }
      });
      window.addEventListener('touchmove', ev => {

        let touch = ev.targetTouches[0]

        up = touch.clientY <= tempY
        //上滑状态
        if (up) {
          let offY = startY - touch.clientY;
          navHeight = oldHeight - offY;
          subHeight = (oldHeight - offY)
          formatY()
          //顶部完全收缩，关闭其他滑动
          if (topView.clientHeight > _this.navShrinkHeight) {
            content.style.overflowY = 'hidden'
            topView.style.height = navHeight + 'px'
          }
          //顶部收缩完成
          else {
            //开启主内容滑动
            if (content.style.overflowY === 'hidden') {
              content.style.overflowY = 'scroll'
            }
            content.scrollTop = _this.navShrinkHeight - subHeight + oldTop
          }
        }
        //下滑状态
        else {
          let offY = startY - touch.clientY;
          navHeight = _this.navShrinkHeight
          subHeight = (oldHeight - offY)
          //主内容已滑动到顶部
          if (content.scrollTop === 0) {
            //暂停主内容滑动
            if (content.style.overflowY === 'scroll') {
              content.style.overflowY = 'hidden'
              startY = touch.clientY
              oldHeight = _this.navShrinkHeight
            }
            let offY = startY - touch.clientY;

            navHeight = oldHeight - offY;

            formatY()

            //扩张高度
            topView.style.height = navHeight + 'px'
          }
          //主内容顶部未出现
          else {
            if (content.style.overflowY === 'hidden') {
              content.style.overflowY = 'scroll'
            }
            content.scrollTop = _this.navShrinkHeight - subHeight + oldTop
          }
        }
        if (navHeight<=_this.navNormalHeight){
          let temp = _this.navNormalHeight - navHeight
          let val = temp / _this.navNormalHeight
          mask.style.background = 'rgba(0, 0, 0, '+val+')'
        }
        if (navHeight<=_this.navExpandHeight){
          _this.$emit('navHide',navHeight)
        }
        //电脑端模拟手机滑动到屏幕外修正
        if (touch.clientY < document.documentElement.clientHeight
            &&touch.clientX<0&&touch.clientX>document.documentElement.clientWidth) {
          tempY = touch.clientY
        }
      })

      function formatY() {
        //避免过度缩小
        if (navHeight <= _this.navShrinkHeight) {
          navHeight = _this.navShrinkHeight
        }
        //避免过度扩张
        if (navHeight >= _this.navExpandHeight) {
          navHeight = _this.navExpandHeight
        }
      }

      content.addEventListener('scroll', ev => {
        if (timeout !== undefined) {
          clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
          oldTop = content.scrollTop
        }, 200);

      })
    })
  }
}
</script>

<style scoped>
#coverImg {
  object-fit: cover;
  height: 100%;
  width: 100%;
  position: absolute;
}
#headerRoot {
  position: relative;
  height: 100%;
  width: 100%;
}
#mask{
  z-index: 8;
  height: 100%;
  width: 100%;
  position: absolute;
  visibility: hidden;
}
#root {
  height: 100%;
  background: green;
  width: 100%;
  position: fixed;
}

#headerBox {
  background: lightpink;
  width: 100%;
  overflow: hidden;
}

#content {
  overflow: hidden;
  height: calc(100% - 65px);
}
</style>