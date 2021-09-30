<template>
  <div class="boxs">
    <div class="face_top">
      <div class="control"  v-show="!camera">
        <van-button type="success" :disabled="surplusBox===0"
                    plain @click="preserveBox">存柜(剩余{{ surplusBox }})
        </van-button>
        <van-button type="primary" :disabled="surplusBox===boxArray.length" plain @click="unBox">取柜</van-button>
      </div>
      <div class='face_root' v-show="camera">
        <video id="video" preload autoplay loop muted ></video>
        <canvas id="canvas"></canvas>
      </div>
      <h3>{{ message }}</h3>
    </div>
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

</template>

<script>
import request from "@/network/request";

const BE_OPEN = 3;
const BE_TAKE = 2;
const NOT_EMPTY_BOX = 1;
const EMPTY_BOX = 0;
import {Toast} from "vant";
import * as faceapi from "../../../public/face-api.min";
import {loadAllDescriptor,loadOneDescriptor,screenShot_File} from "@/untils/faceUntil";
import {dataURLtoFile} from "@/untils/FileUtil";

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
      boxArray: new Array(34).fill(0),
      message: '',
      camera: false,
      video: null,
      context: null,
      canvas: null,
      beCheckFace: false,
      faceMatcher:[],
      faceDescriptors:[]
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
      let video=this.video
      let canvas=this.canvas
      this.camera = true
      let index = this.createIndex()
      Promise.all([
        navigator.getUserMedia(
            {
              video: {
                width: 200, height: 200,
                // deviceId: 'ba16a7bf2ca20a5e50062ba1698bb618d5385c50d0f0bf0e5329103d17ead837'
              }, audio: false
            },
            stream => video.srcObject = stream,
            err => console.error(err)
        ),
        // faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        request.get('/user/all')
      ]).then(start)
      let _this=this
      async function start(respones) {
        const displaySize = {width: 200, height: 200}
        faceapi.matchDimensions(canvas, displaySize)
        await loadAllDescriptor(_this.faceDescriptors,respones[5])
        _this.faceMatcher = new faceapi.FaceMatcher(_this.faceDescriptors, 0.5)//匹配偏差，越小越严格，超过0.5以上都为unknow

        const options = new faceapi.SsdMobilenetv1Options({
          // inputSize:608,//》32的倍数，越大越能检测最小的人脸同时更慢。上限608默认416
          //scoreThreshold: 0.8
        })
        const ctx = canvas.getContext('2d')
        setInterval(async () => {
          const detections = await faceapi.detectAllFaces(video, options).withFaceLandmarks(/*true*/).withFaceDescriptors()
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // faceapi.draw.drawDetections(canvas,resizedDetections)
          const results = resizedDetections.map(d => _this.faceMatcher.findBestMatch(d.descriptor))
          results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box

            let unknown = result.label === 'unknown'
            let color = unknown ? 'rgba(0, 0, 255, 1)' : 'green'
            //console.log(result);
            //已记录人脸
            if (!unknown) {
              const drawBox = new faceapi.draw.DrawBox(box, {label: result.label, boxColor: color});
              drawBox.draw(canvas)
              return
            } else {
              const drawBox = new faceapi.draw.DrawBox(box, {boxColor: color});
              drawBox.draw(canvas)
            }
            //未记录人脸
            if (_this.beCheckFace) {//如果正在检查
              console.log('被return')
              return
            }
            //提交检查并上传
            _this.beCheckFace = true
           _this.verification(video, box)
          })
          // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        }, 100)

      }
      // openUserMedia(this.video, trackEvent => {
      //   if (trackEvent.data.length > 0) {
      //     let imgBase = getImg(this.video)
      //     match_1vsN({
      //       image: imgBase,
      //       image_type: "BASE64",
      //       group_id_list: "999",
      //     }).then(res => {
      //       if (res.error_code === 0) {
      //         return Promise.reject('用户存柜超限')
      //       } else {
      //         return Promise.resolve(imgBase)
      //       }
      //     }).then(res => {
      //       return registerFace({
      //         image: imgBase,
      //         image_type: "BASE64",
      //         group_id: "999",
      //         uid: index,
      //       })
      //     }).then(res => {
      //       Toast.success('开启成功，柜号' + (index + 1));
      //       this.fnOpenDoor(index)
      //       this.beOpenBox(index)
      //     }).catch(msg => {
      //       Toast.fail(msg)
      //     }).finally(() => {
      //       this.camera = false;
      //       destroyTrack()
      //     })
      //   }
      // })
    },
    verification(video, box){
      let base = screenShot_File(video, box);
      let file=dataURLtoFile(base)

    },
    //取柜
    unBox() {
      this.camera = true


      openUserMedia(this.video, trackEvent => {
        if (trackEvent.data.length > 0) {
          let imgBase = getImg(this.video)
          let uid;
          match_1vsN({
            image: imgBase,
            image_type: "BASE64",
            group_id_list: "999",
          }).then(res => {
            if (res.error_code === 0) {
              uid = res.result.face_list[0].user_list[0].uid;
              return Promise.resolve()
            }
          }).then(() => {
            return deleteUser({
              group_id: '999',
              uid: uid
            })
          }).then(res => {
            console.log(res);
            Toast.success('柜号' + (parseInt(uid) + 1) + '，请取走您的物品')
            this.fnOpenDoor(uid);
            this.beTakeBox(uid)
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
    request.get('/box/get').then(res=>{
      res.forEach(item=>{
        console.log(item);
        this.setNotEmptyBox(parseInt(item))
      })
    })
  }
}
</script>

<style lang="less" scoped>
@box-wh: 100px;

.face_top {
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background: white;
  grid-column-start: 5;
  grid-row-start: 1;
  grid-row-end: 3;
}
.control{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.face_root {
  position: relative;
  -webkit-transform: scale(0.5);

  #video {
    position: absolute;
    width: 200px;
    height: 200px;
  }

  #canvas {
    position: absolute;
    width: 200px;
    height: 200px;
  }
}

.boxs {
  position: absolute;
  top: 30%;
  left: 5%;
  right: 5%;
  display: grid;
  background: grey;
  border-radius: 5px;
  box-shadow: 10px 10px 10px #666;
  grid-template-rows: repeat(4, 100px);
  grid-template-columns: repeat(9, 100px);
  align-items: center;
  justify-items: center;
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