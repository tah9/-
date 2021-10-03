<template>
  <div class="tabLayout" ref="tabLayout" @click="verifyChild($event)">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabLayout",
  data() {
    return {
      current: 1,
      lastItemIndex :null
    }
  },
  methods: {
    verifyChild(e) {
      let tabLayout = this.$refs.tabLayout;
      for (let i = 0; i < tabLayout.children.length; i++) {
        let child = tabLayout.children[i];
        if (child.contains(e.target)) {
          this.changeTab(i, child)
        }
      }
    },
    changeTab(index, node) {
      this.lastItemIndex =this.current
      this.$emit('changeTab', index)
      let tabLayout = this.$refs.tabLayout;
      let winWidth = window.innerWidth;
      if (node) {
        let liLeft = node.offsetLeft,
            liWidth = node.offsetWidth,
            liCenter = (winWidth - liWidth) / 2,
            liTarget = liLeft - liCenter;
        if (liTarget < 0) {
          liTarget = 0
        }
        // let step=liTarget/1000
        // let interval=setInterval(()=>{
        //   console.log('run')
        //   if (tabLayout.scrollLeft<=0){
        //     tabLayout.scrollLeft=0
        //     clearInterval(interval)
        //   }
        //   tabLayout.scrollLeft=tabLayout.scrollLeft+step
        // },1)
        tabLayout.scrollLeft = liTarget;

        // let step = (liTarget - total) / 50
        // if (step < 0) step = -step
        // let total = index * 70 - Math.floor( tabLayout.clientWidth / 3 )
        // this.moveSlow(liTarget,total,step)
      }
    },
    moveSlow(distance, total, step) {
      console.log('>>>>')
      // 正向滚动 和 反向滚动
      if (this.lastItemIndex < this.current) {
        // 每隔1毫秒移动一小段距离，直到移动至目标至为止，反之亦然
        if (distance < total) {
          distance += step
          this.$refs.tabLayout.scrollLeft = distance
          setTimeout(() => {
            this.moveSlow(distance, total, step)
          }, 1)
        } else {
          this.$refs.tabLayout.scrollLeft = total
        }
      } else if (this.lastItemIndex > this.current) {
        if (distance > total) {
          distance -= step
          this.$refs.tabLayout.scrollLeft = distance
          setTimeout(() => {
            this.moveSlow(distance, total, step)
          }, 1)
        } else {
          this.$refs.tabLayout.scrollLeft = total
        }
      }
    }
  },
};
</script>
<style lang="less">

.tabLayout {
  width: 100%;
  height: auto;
  display: inline-block;
  white-space: nowrap;
  overflow: scroll;
}

.tabLayout::-webkit-scrollbar {
  display: none;
}

.tabLayout > * {
  height: auto;
  display: inline-block;
  // 点击高亮某一项时,将原来的字体变大,会导致没有高亮的元素距离上面有空隙,会出现纵向滚动条
  margin-top: -1px;
}

//.line {
//  width: 150px;
//  height: 3px;
//  background: #059;
//  left: 0;
//  bottom: 0;
//}

//.activeheader {
//  font-size: 1em;
//  font-weight: 700;
//  position: relative;
//}

</style>