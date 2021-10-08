<template>
  <div class="root">
    <div class="header" :style="'height:'+navNormalHeight+'px;'" id="header">
      <div id="headerRoot">
        <img :src="coverImg" class="coverImg">
        <div id="imgMask"></div>
        <slot name="headerInfo"></slot>
        <div id="mask"></div>
      </div>
    </div>
    <div class="content" id="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Temp",
  props: {
    navNormalHeight: 0,
    navShrinkHeight: 0,
    navExpandHeight: 0,
    coverImg: '',
    notScrollFilter:''
  },
  mounted() {
    let _this = this;
    let header = document.getElementById('header')
    let content = document.getElementById('content')
    let mask = document.getElementById('mask')

    document.documentElement.style.overflowY = 'hidden'

    let startX
    let startY, lastContentY = 0
    let oldY
    let up, lastHeight = _this.navNormalHeight
    let beTouch = false

    function start(ev) {
      let touches = ev.touches[0];
      startX=touches.clientX
      startY = touches.clientY
      beTouch = true
    }


    function move(ev) {
      let touches = ev.touches[0]
      if (touches.target.className.includes(_this.notScrollFilter)/*&&Math.abs(touches.clientX-startX)+50>Math.abs(touches.clientY-startY)*/){
        return
      }
      //第一次移动仅获取坐标，不进行其他操作
      if (oldY === undefined) {
        oldY = touches.clientY
        return
      }
      up = touches.clientY <= oldY
      // console.log(up);
      //上滑
      if (up) {
        let offY = startY - touches.clientY
        if (header.clientHeight > _this.navShrinkHeight) {
          if (content.style.overflowY === 'scroll') {
            content.style.overflowY = 'hidden'
          }
          let number = _this.navNormalHeight - offY - (_this.navNormalHeight - lastHeight);
          header.style.height = number + 'px'
          formatHeight()
        }
        //顶部收缩完成
        else {
          // console.log(content.style.overflowY)
          //打开主内容滑动（下方滑动）
          content.style.overflowY = 'scroll'

          let offO = offY - (lastHeight - _this.navShrinkHeight) + lastContentY
          content.scrollTop = offO
        }
      }
      //下滑
      else {
        //主内容顶部展现
        if (content.scrollTop === 0) {
          if (content.style.overflowY === 'scroll') {
            content.style.overflowY = 'hidden'
            startY = touches.clientY;
            lastHeight = _this.navShrinkHeight
          }
          let offY = touches.clientY - startY
          let newHeight = (lastHeight + offY)
          header.style.height = newHeight + 'px'
          formatHeight()
        }
        //主内容顶部未出现
        else {
          let offY = startY - touches.clientY
          if (content.style.overflowY === 'hidden') {
            content.style.overflowY = 'scroll'
          }
          let offO = offY - (lastHeight - _this.navShrinkHeight) + lastContentY
          content.scrollTop = offO
        }
      }
      if (header.clientHeight <= _this.navNormalHeight) {
        let temp = _this.navNormalHeight - header.clientHeight
        let val = (temp / _this.navNormalHeight) - 0.2
        mask.style.background = 'rgba(0, 0, 0, ' + val + ')'
      }
      if (header.clientHeight <= _this.navExpandHeight) {
        _this.$emit('navHide', header.clientHeight)
      }
      //电脑端模拟手机滑动到屏幕外修正
      if (touches.clientY < document.documentElement.clientHeight
          && touches.clientX < 0 && touches.clientX > document.documentElement.clientWidth) {
        oldY = touches.clientY
      }
      oldY = touches.clientY
    }


    function end(ev) {
      beTouch = false
      lastHeight = header.clientHeight
      lastContentY = content.scrollTop
      //高度大于普通高度，触发回弹动画
      if (lastHeight >= _this.navNormalHeight) {
        let interval = setInterval(() => {
          if (header.clientHeight <= _this.navNormalHeight + 5) {
            clearInterval(interval)
          }
          let height = header.clientHeight - 5
          header.style.height = height + 'px'
          if (header.clientHeight <= _this.navNormalHeight + 5) {
            lastHeight = _this.navNormalHeight
          }
        }, 5)
      }
    }


    //函数防抖
    let timeOut
    // let beSend=false

    function beScroll(ev) {

      // if ((content.scrollTop + content.clientHeight) === content.scrollHeight) {
      //   console.log('到底了');
      //   if (!beSend){
      //     _this.$emit('beBottom')
      //     beSend=true
      //     console.log('fasong')
      //     setTimeout(() => {
      //       beSend=false
      //     }, 1000)
      //   }
      // }
      if (timeOut !== undefined) {
        clearTimeout(timeOut)
      }
      if (beTouch) {
        return
      }
      timeOut = setTimeout(() => {
        lastContentY = content.scrollTop
      }, 1)
    }


    function formatHeight() {
      if (header.clientHeight < _this.navShrinkHeight) {
        header.style.height = _this.navShrinkHeight + 'px'
      }
      if (header.clientHeight >= _this.navExpandHeight) {
        header.style.height = _this.navExpandHeight + 'px'
      }
    }

    window.addEventListener('touchstart', start)
    window.addEventListener('touchmove', move)
    window.addEventListener('touchend', end)
    content.addEventListener('scroll', beScroll)

    this.$on('hook:beforeDestroy', () => {
      console.log('销毁事件')
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', end)
      content.removeEventListener('scroll', beScroll)
      document.documentElement.style.overflowY = 'auto'
    })
  }
}
</script>

<style lang="less" scoped>
.coverImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
}
body{
  //关闭手机浏览器下拉刷新
  overflow: hidden;
}
.root {
  height: 100%;
  width: 100%;
  position: fixed;
}

.header {
  width: 100%;
  overflow: hidden;
}

.content {
  height: calc(100% - 65px);
  width: 100%;
  background-color: @bg-color;
  overflow-y: hidden;
}

#mask {
  z-index: 8;
  height: 100%;
  width: 100%;
  position: absolute;
  pointer-events: none;
}

#imgMask {
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.45);
  pointer-events: none;
}

#headerRoot {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>