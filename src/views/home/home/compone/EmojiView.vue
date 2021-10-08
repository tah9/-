<template>
  <van-swipe class="bot-emoji" :style="'height:'+myBottom+'px'"
             v-show="myBottom!==0"
             indicator-color="#757575">
    <van-swipe-item v-for="(data,page) in emojiData">
      <div class="emoji-row" ref="test" :key="page"
           :style="'grid-template-rows: repeat('+rows+',auto);'+'grid-template-columns: repeat('+columns+',auto);' ">
        <img class="emoji-icon" v-for="(item,i) in data" :src="item" @click="emojiClick(item)">
        <img class="emoji-icon test" src="/api/graduate/emoji/systeam/退格.jpg" @click="backSpace"
             :style="'gridRowStart:'+rows+';gridColumnStart:'+columns+';'">
      </div>
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  name: "EmojiView",
  data() {
    return {
      emojiSize: 102,
      emojiWH: 30,
    }
  },
  methods: {
    emojiClick(url) {
      this.$emit("emojiClick", url)
    },
    backSpace() {
      this.$emit("backSpace")
    }
  },
  props: {
    myBottom: 0,
  },
  computed: {
    emojiData() {
      let picIndex = 1
      let pageSum = Math.ceil(this.emojiSize / (this.rows * this.columns));
      let pageSize = this.rows * this.columns//每一页的数量
      let result = []
      for (let i = 0; i < pageSum; i++) {
        let page = []
        for (let i = 0; i < pageSize; i++) {
          if (picIndex <= this.emojiSize && (i + 1) % pageSize !== 0) {
            page.push(this.getEmojiUrl(picIndex++))
          } else {
            // page.push('/api/graduate/emoji/退格.jpg')
            break
          }
        }
        result.push(page)
      }
      return result
    },
    getEmojiUrl() {
      return function (i) {
        while (i.toString().length < 3) {
          i = '0' + i
        }
        return '/api/graduate/emoji/' + i + '.jpg'
      }
    },
    rows() {
      let item = 2 * this.emojiWH
      let botHeight = this.myBottom
      let row = Math.floor((botHeight - item) / item)
      return row;
    },
    columns() {
      let item = 2 * this.emojiWH
      let winWidth = document.documentElement.clientWidth
      let column = Math.floor((winWidth - this.emojiWH) / item)
      console.log(column)
      return column;
    }
  },
  mounted() {
    // let _this=this
    // this.$nextTick(() => {
    //   window.addEventListener('resize', function () {
    //
    //     if (window.innerHeight < windowHeight) {
    //       _this.myBottom = 0
    //       _this.offHeight = windowHeight - window.innerHeight;
    //     } else {
    //       _this.myBottom = _this.offHeight
    //     }
    //   })
    // })
  }
}
</script>

<style scoped lang="less">
@emoji-wh: 60px;


.emoji-row {
  justify-content: center;
  align-content: center;
  display: grid;

  //grid-template-rows: 1fr 1fr 1fr 1fr;
  //grid-template-columns: repeat(5, auto);

  padding: calc(@emoji-wh / 2) /*calc(2 * @emoji-wh)*/ calc(@emoji-wh / 4);
  //display: flex;
  //flex-wrap: wrap;
  //justify-items: flex-start;
  //justify-content: space-between;
}

.emoji-icon {
  padding: calc(@emoji-wh / 4);
  width: @emoji-wh;
  height: @emoji-wh;
  box-sizing: border-box;

}

</style>