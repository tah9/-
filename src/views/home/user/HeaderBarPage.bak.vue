<template>
  <div id="root">
    <div id="header" :style="'height:'+navHeight+'px'">
      <div>你好</div>
<!--      <slot name="header"></slot>-->
    </div>
    <div id="content" :style="'height:calc(100% - '+navShrinkHeight+'px)'">
<!--      <slot name="content"></slot>-->
      <div v-for="i in 100">{{i}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "test",
  // props:{
  //   navHeight: 300,
  //   navShrinkHeight: 65,
  //   navExpandHeight: 500
  // },
  data(){
    return{
      navHeight: 300,
      navShrinkHeight: 65,
      navExpandHeight: 500
    }
  },
  mounted() {
    this.$nextTick(() => {
      let _this = this;
      let topView = document.getElementById('header')
      let content = document.getElementById('content')

      let startY
      let oldHeight
      let up
      let oldTop = 0
      let subHeight = 0
      let tempY=0
      window.addEventListener('touchstart', ev => {
        let touch = ev.targetTouches[0]
        startY = touch.clientY
        tempY=touch.clientY
        oldHeight = topView.clientHeight
        oldTop = content.scrollTop
      })
      window.addEventListener('touchmove', ev => {
        let touch = ev.targetTouches[0]

        up = touch.clientY<=tempY

        //上滑状态
        if (up) {
          let offY = startY - touch.clientY;
          _this.navHeight = oldHeight - offY;
          subHeight = (oldHeight - offY)
          formatY()
          //顶部完全收缩，关闭其他滑动
          if (topView.clientHeight > _this.navShrinkHeight) {
            content.style.overflowY = 'hidden'
            topView.style.height = _this.navHeight + 'px'
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
          _this.navHeight=_this.navShrinkHeight
          subHeight = (oldHeight - offY)
          //主内容已滑动到顶部
          if (content.scrollTop === 0) {
            //暂停主内容滑动
            if (content.style.overflowY === 'scroll') {
              content.style.overflowY = 'hidden'
              //起点设为手指当前位置
              startY=touch.clientY
              //旧高度设为缩小状态高度
              oldHeight=_this.navShrinkHeight
            }

            let offY = startY - touch.clientY;

            _this.navHeight = oldHeight - offY;

            formatY()

            //扩张高度
            topView.style.height = _this.navHeight + 'px'
          }
          //主内容顶部未出现
          else {
            if (content.style.overflowY === 'hidden') {
              content.style.overflowY = 'scroll'
            }
            content.scrollTop= _this.navShrinkHeight - subHeight + oldTop
          }
        }
        //Y方向标记
        tempY=touch.clientY
      })

      function formatY(){
        //避免过度缩小
        if (_this.navHeight <= _this.navShrinkHeight) {
          _this.navHeight = _this.navShrinkHeight
        }
        //避免过度扩张
        if (_this.navHeight >= _this.navExpandHeight) {
          _this.navHeight = _this.navExpandHeight
        }
      }
      //滚动完成获取顶部距离
      let timeout
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
#root {
  height: 100%;
  background: green;
  width: 100%;
  position: fixed;
}

#header {
  background: lightpink;
  width: 100%;
  overflow-y: hidden;
}

#content {
  overflow: hidden;
}
</style>