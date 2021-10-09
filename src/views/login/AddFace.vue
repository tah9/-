<template>
  <div class="root">
    <navbar title="注册人脸" class="navbar"></navbar>
    <h3>把脸移入框内</h3>
    <div class="faceRoot" ref="face">
      <van-circle v-model="currentRate" :rate="rate" :speed="100" class="circle"
                  :stroke-width="20" layer-color="#f2f1f6" color="#0f9d58"/>
      <div class="face">
        <video width="300" height="300" id="video" autoplay muted ref="video"
               :style="mask?'filter: blur(20px);':''"></video>
        <canvas width="300" height="300" id="canvas"></canvas>
      </div>
    </div>
    <h3 v-text="guideText" class="guideText"></h3>

    <transition name="fade">
    <div class="btn" ref="btn" v-if="guideText==='扫描完成。'" @click="btnClick">完成</div>
    </transition>
  </div>
</template>

<script>
import request from "@/network/request";
import Navbar from "@/components/navbar";
import * as faceapi from "../../../public/face-api.min";
import {loadAllDescriptor, screenShot_File} from "@/untils/faceUntil";
import {dataURLtoFile} from "@/untils/FileUtil";

export default {
  name: "AddFace",
  components: {Navbar},
  data() {
    return {
      currentRate: 0,
      rate: 0,
      mask: false,
      guideText: '识别中'
    }
  },
  methods: {
    btnClick(){
      this.$router.go(-1);
      let user = this.$root.getUser();
      user.hasFace=true
      window.localStorage.setItem("user",JSON.stringify(user))
    }
  },
  mounted() {
    let interval
    let _this = this
    this.$nextTick(() => {
          const video = document.getElementById('video')
          const canvas = document.getElementById('canvas')
          let fWidth = 300;
          let fHeight = 300;


          //获取设备列表,得到deviceId开启指定摄像头
          console.log(navigator.mediaDevices.enumerateDevices());
          Promise.all([
            navigator.getUserMedia(
                {
                  video: {
                    width: fWidth, height: fHeight,
                    // deviceId: 'ba16a7bf2ca20a5e50062ba1698bb618d5385c50d0f0bf0e5329103d17ead837'//多摄像头时开启指定
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
            request.get('/face/allUser')
          ]).then(load)

          const displaySize = {width: fWidth, height: fHeight}
          const options = new faceapi.SsdMobilenetv1Options({
            // inputSize:608,//》32的倍数，越大越能检测屏幕内越小的人脸》同时更卡顿。上限608默认416
            //scoreThreshold: 0.8
          })

          async function load(res) {
            console.log(res[5]);
            let faceDescriptors = await loadAllDescriptor(res[5].rows);
            console.log(faceDescriptors);
            let faceMatcher = new faceapi.FaceMatcher(faceDescriptors, 0.5)//匹配偏差，越小越严格，超过0.5以上都为unknow

            const ctx = canvas.getContext('2d')
            interval = setInterval(async () => {
              const detections = await faceapi.detectAllFaces(video, options).withFaceLandmarks(/*true*/).withFaceDescriptors()
              const resizedDetections = faceapi.resizeResults(detections, displaySize)
              ctx.clearRect(0, 0, fWidth, fHeight);
              const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
              results.forEach((result, i) => {
                if (_this.mask) {
                  return
                }

                const box = resizedDetections[i].detection.box

                let unknown = result.label === 'unknown'
                let color = unknown ? 'white' : 'red'
                //console.log(result);

                if (box.width * box.height < 20000) {
                  _this.guideText = '请靠近镜头'
                  return
                }
                //已记录人脸
                if (!unknown) {
                  const drawBox = new faceapi.draw.DrawBox(box, {boxColor: color});
                  drawBox.draw(canvas)
                  _this.guideText = '此人脸已存在！'
                  return
                }
                //未记录人脸
                else {
                  const drawBox = new faceapi.draw.DrawBox(box, {boxColor: color});
                  drawBox.draw(canvas)
                  _this.guideText = '请保持不动'
                  video.pause()
                  //异步执行
                  video.srcObject.getVideoTracks().forEach(videoTrack => {
                      videoTrack.stop()
                  });
                  _this.rate = 100
                  _this.mask = true
                  addFace(dataURLtoFile(screenShot_File(video, box)))
                }

              })
              if (!_this.mask) {
                //绘制68点
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
              }
            }, 100)
          }
        }
    )

    function addFace(file) {
      let formData = new FormData();
      formData.append('file', file)
      request.post('/face/addface/' + _this.$root.getUser().username, formData).then(res => {
        console.log(res);
        if (res.code === 200) {
          clearInterval(interval)
          _this.guideText='扫描完成。'
        }else{
          _this.mask=false
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
@circleDIA: 330px;
@facePadding: 15px;
.navbar {
  top: 0;
}

.guideText {
  margin-top: 35%;
}

.root {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
}

.faceRoot {
  position: relative;
  width: @circleDIA;
  height: @circleDIA;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -30%); /* 50%为自身尺寸的一半 */
}

.face {
  position: absolute;
  width: 300px;
  height: 300px;
  margin: @facePadding;
  border-radius: 50%;
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.circle {
  position: absolute;
  width: @circleDIA;
  height: @circleDIA;
}

#video {
  position: absolute;
}

canvas {
  position: absolute;
}

h3 {
  text-align: center;
}

.btn {
  position: absolute;
  text-align: center;
  width: 80%;
  margin-left: 10%;
  color: white;
  height: 44px;
  line-height: 44px;
  border-radius: @item-margin;
  background: @theme-color;
  bottom: 44px;
}
</style>