<template>
  <div class="root">
    <div class="screen">
      <div class="operate" v-show="!camera">
        <van-image fit="cover" src="https://img01.yzcdn.cn/vant/cat.jpeg"
                   class="avtarimg"></van-image>
        <el-button type="success" :disabled="surplusBox===0"
                   plain @click="preserveBox">存柜(剩余{{ surplusBox }})
        </el-button>
        <el-button type="primary" :disabled="surplusBox===boxArray.length" plain @click="unBox">取柜</el-button>
      </div>
      <div class='face_root' v-show="camera">
        <video id="video" preload autoplay loop muted></video>
        <canvas id="canvas"></canvas>
      </div>
      <h3>{{ message }}</h3>
    </div>
    <div class="boxs">
      <div class="door-frame" @click="fnCloseDoor(index)" v-for="(item,index) in boxArray">
        <div id="door" class="door" :id="index">
          <div class="door-face-0"></div>
          <div class="door-face-1">
            <div class="door-card">{{ (index + 1) < 10 ? '0' + (index + 1) : (index + 1) }}</div>
          </div>
          <div class="door-face-3"></div>
        </div>
      </div>

    </div>


  </div>

</template>

<script>
const BE_OPEN = 3;
const BE_TAKE = 2;
const NOT_EMPTY_BOX = 1;
const EMPTY_BOX = 0;
import {openUserMedia, syncStopTrack, restartTrack, getImg, destroyTrack} from "@/untils/CameraUntil";
import {Toast} from "vant";
import {match_1vsN, deleteUser, searchGroupUser, registerFace} from "@/untils/BFace";

export default {
  name: "DepositBox",
  computed: {
    //可用柜数
    surplusBox() {
      let sum = 0;
      this.boxArray.forEach(item => {
        if (item === 0) {
          sum++;
        }
      })
      return sum;
    },
  },
  data() {
    return {
      boxArray: new Array(24).fill(0),
      message: '',
      camera: false,
      video: null,
      context: null,
      canvas: null,
    }
  },
  methods: {
    setNotEmptyBox(index) {
      //这里有坑，直接修改数组值计算属性不更新
      this.$set(this.boxArray, index, NOT_EMPTY_BOX)
    },
    setEmptyBox(index) {
      this.$set(this.boxArray, index, EMPTY_BOX)
    },
    beTakeBox(index) {
      this.$set(this.boxArray, index, BE_TAKE)
    },
    beOpenBox(index) {
      this.$set(this.boxArray, index, BE_OPEN)
    },
    //获取某个空柜号
    createIndex() {
      //生成[0,length-1]随机数
      let index = Math.floor(Math.random() * this.boxArray.length);
      while (this.boxArray[index] === 1) {//避免开启已存放的盒子
        index = Math.floor(Math.random() * this.boxArray.length);
      }
      return index
    },
    //存柜
    preserveBox() {
      this.camera = true
      let index = this.createIndex()
      openUserMedia(this.video, trackEvent => {
        if (trackEvent.data.length > 0) {
          let imgBase = getImg(this.video)
          match_1vsN({
            image: imgBase,
            image_type: "BASE64",
            group_id_list: "999",
          }).then(res => {
            if (res.error_code === 0) {
              return Promise.reject('用户存柜超限')
            } else {
              return Promise.resolve(imgBase)
            }
          }).then(res => {
            return registerFace({
              image: imgBase,
              image_type: "BASE64",
              group_id: "999",
              user_id: index,
            })
          }).then(res => {
            Toast.success('开启成功，柜号' + (index + 1));
            this.fnOpenDoor(index)
            this.beOpenBox(index)
          }).catch(msg => {
            Toast.fail(msg)
          }).finally(() => {
            this.camera = false;
            destroyTrack()
          })
        }
      })
    },
    //取柜
    unBox() {
      this.camera = true
      openUserMedia(this.video, trackEvent => {
        if (trackEvent.data.length > 0) {
          let imgBase = getImg(this.video)
          let user_id;
          match_1vsN({
            image: imgBase,
            image_type: "BASE64",
            group_id_list: "999",
          }).then(res => {
            if (res.error_code === 0) {
              user_id = res.result.face_list[0].user_list[0].user_id;
              return Promise.resolve()
            }
          }).then(() => {
            return deleteUser({
              group_id: '999',
              user_id: user_id
            })
          }).then(res => {
            console.log(res);
            Toast.success('柜号' + (parseInt(user_id) + 1) + '，请取走您的物品')
            this.fnOpenDoor(user_id);
            this.beTakeBox(user_id)
          }).catch(() => {
            Toast.fail('验证失败')
          }).finally(() => {
            this.camera = false
            destroyTrack()
          });
        }
      })
    },
    fnOpenDoor(index) {

      //开柜动画
      let eleDoor = document.getElementById(index)
      let percentDoor = 0;

      function add() {
        percentDoor++;
        if (percentDoor >= 100) {
          return;
        }
        eleDoor.style.transform = 'rotateY(' + (-130 * percentDoor / 100) + 'deg)'
        setTimeout(add, 5)
      }

      add()
    },
    fnCloseDoor(index) {
      console.log(index);
      //屏蔽闭柜状态的点击
      if (this.boxArray[index] === EMPTY_BOX || this.boxArray[index] === NOT_EMPTY_BOX) {
        return
      }
      //如果是取柜状态点击完成取柜
      if (this.boxArray[index] === BE_TAKE) {
        this.setEmptyBox(index)
      }
      //如果时存柜状态下点击完成存柜
      if (this.boxArray[index] === BE_OPEN) {
        this.setNotEmptyBox(index)
      }

      console.log('关闭动画')

      //关柜动画
      let eleDoor = document.getElementById(index)
      let percentDoor = 100;

      function sub() {
        percentDoor--;
        if (percentDoor <= 0) {
          return;
        }
        eleDoor.style.transform = 'rotateY(' + (percentDoor) + 'deg)'
        setTimeout(sub, 1)
      }

      sub();

    }
  },
  mounted() {
    this.video = document.getElementById('video')
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext("2d");
    searchGroupUser('999').then(res => {
      let list = res.result.user_id_list;
      list.forEach(item => {
        this.setNotEmptyBox(parseInt(item))
      })
    })
  }
}
</script>

<style lang="less" scoped>
.root {
  position: fixed;
  //cursor: url(../../assets/hand.png), auto;
}

.screen {
  display: flex;
  width: 300px;
  height: 300px;
}

.operate {
  //position: absolute;

}

.face_root {
  position: relative;

  #video {
    position: absolute;
    width: 320px;
    height: 240px;
  }

  #canvas {
    position: absolute;
    width: 320px;
    height: 240px;
  }
}

.boxs {
  margin-left: 15%;
  margin-right: 15%;
  display: flex;
  flex-wrap: wrap;
  background: grey;
  justify-content: space-evenly;
  padding: 0.5% 0.5% 5% 0.5%;
  border-radius: 5px;
  box-shadow: 10px 10px 10px #666;
}

.door-frame {
  padding: 3px;
  box-sizing: content-box;
  background: #484856;
  width: 100px;
  height: 100px;
  border: outset 2px #484856;
  margin: 1px;
  -webkit-perspective: 1200px;
  perspective: 1200px;
}

.door-frame div {
  position: absolute;
}

.door {
  //perspective: 2000px;
  width: 100px;
  height: 100px;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  transform-origin: left;
  transform: rotateY(0deg);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.door-face-1,
.door-face-0 {
  left: -1px;
  top: -1px;
  right: -1px;
  bottom: -1px;
  border: 1px solid #211820;
  background-color: #295489;
}

.door-face-0 {
  transform: translateZ(-12px);
}

.door-face-1 {
  transform: translateZ(0);
}

.door-face-3 {
  width: 2px;
  top: -1px;
  right: 0;
  bottom: -1px;
  border: 1px solid #211820;
  border-radius: 2px;
  background-color: #0c2e59;
  transform: translate3D(7.5px, 0, -2px) rotateY(90deg);
}

/*门牌*/
.door-card {
  background-color: #c1d0ec;
  margin: auto;
  text-align: center;
  //font-size: 30px;
  border: 2px solid;
  border-radius: 2px;
}

</style>