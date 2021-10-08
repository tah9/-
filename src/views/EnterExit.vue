<template>
  <div class="root">
    <video width="640" height="480" id="video" autoplay muted></video>
    <canvas width="640" height="480" id="canvas"></canvas>
    <message @receiveJson="update" style="display: none"></message>
    <img id="testimg" style="display: none">
  </div>
</template>

<script>
import Message from "@/views/Message";

import * as faceapi from "../../public/face-api.min.js";
import request from "@/network/request";
import {dataURLtoFile} from "@/untils/FileUtil";

export default {
  name: "EnterExit",
  data() {
    return {
      faceDescriptors: [],
      faceMatcher: null,
      beCheckFace: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
          const video = document.getElementById('video')
          const canvas = document.getElementById('canvas')

          //获取设备列表,得到deviceId开启指定摄像头
          console.log(navigator.mediaDevices.enumerateDevices());
          Promise.all([
            navigator.getUserMedia(
                {
                  video: {
                    width: video.width, height: video.height,
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
          ]).then(start)
          let _this = this;

          async function start(respones) {
            const displaySize = {width: video.width, height: video.height}
            faceapi.matchDimensions(canvas, displaySize)
            await _this.loadAllDescriptor(respones[5].rows)
            _this.faceMatcher = new faceapi.FaceMatcher(_this.faceDescriptors, 0.5)//匹配偏差，越小越严格，超过0.5以上都为unknow

            const options = new faceapi.SsdMobilenetv1Options({
              // inputSize:608,//》32的倍数，越大越能检测屏幕内越小的人脸》同时更卡顿。上限608默认416
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
                if (_this.beCheckFace) {
                  return
                }
                //提交检查并上传
                _this.beCheckFace = true
                _this.verificationAndUpload(video, box)
              })
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            }, 100)

          }


        }
    )

  },
  methods: {
    screenShot_File(video, box) {
      let cc = document.createElement('canvas');
      let offHeight = box.height / 3.8
      let cWidth = box.width
      let cHeight = box.height + offHeight
      cc.width = cWidth
      cc.height = cHeight
      let ccCtx = cc.getContext("2d");
      ccCtx.drawImage(video, box.x, box.y - offHeight, cWidth, cHeight, 0, 0, cWidth, cHeight)
      return cc.toDataURL("image/jpeg");
    },
    //检测到未认证人脸标记为游客（已废弃）
    async upload(base) {
      let size = this.faceDescriptors.length + 1
      let name = '游客' + (size < 10 ? '0' + size : size)
      let file = new FormData()
      file.append("username", name)
      // for (let item of base.length) {
      await file.append("file", await dataURLtoFile(base))
      // }
      await request.post('/face/upload', file)
    },
    async verificationAndUpload(video, box) {
      let base = this.screenShot_File(video, box);
      let img = document.createElement('img');
      img.src = base
      let temp = document.getElementById('testimg')
      temp.src = base
      let result = await faceapi.detectSingleFace(img).withFaceLandmarks(/*true*/).withFaceDescriptor();
      if (result !== undefined) {
        // let b = await this.determineIfExisted(img, base);
        // console.log(b);
        //if (!b){
          await this.upload(base)
       // }
      } else {
        this.beCheckFace = false
      }
    },
    // async determineIfExisted(img) {
    //   let faceDescriptors = this.faceDescriptors;
    //   let tempMatcher = new faceapi.FaceMatcher(faceDescriptors, 0.5);
    //   let resizeResults = await faceapi
    //       .detectSingleFace(img)
    //       .withFaceLandmarks()
    //       .withFaceDescriptor()
    //   const bestMatch = tempMatcher.findBestMatch(resizeResults.descriptor)
    //   for (let i in faceDescriptors) {
    //     if (await faceDescriptors[i].label === bestMatch.label) {
    //       console.log('已有此人脸')
    //       console.log(faceDescriptors[i]);
    //       console.log(bestMatch);
    //       faceDescriptors[i].descriptors.push(bestMatch.descriptors)
    //       return true
    //     }
    //   }
    //   console.log('查无此人，开始添加')
    //   return false
    // },
    async update(json) {
      //实时更新后台人脸信息(新用户人脸、旧用户人脸更新)
      const newFace = await this.loadOneDescriptor(json.username)
      console.log('新人脸'+newFace);
      if (newFace.descriptors.length === 0) {
        console.log(newFace.label + '更新失败')
        return;
      }
      if (json.hasOwnProperty("update")) {//如果已存在则更新人脸
        for (let i in this.faceDescriptors) {
          if (await this.faceDescriptors[i].label === newFace.label) {
            this.faceDescriptors[i] = newFace
          }
        }
        console.log('更新人脸')
      } else {//如果没有此人脸,则添加人脸标志
        this.faceDescriptors.push(newFace)
        console.log('添加人脸')
      }
      console.log(this.faceDescriptors)
      this.faceMatcher = new faceapi.FaceMatcher(this.faceDescriptors, 0.4)
      this.beCheckFace = false
    },
    async loadOneDescriptor(name) {
      const descriptions = []
      let i = 0;
      while (i !== -1) {
        try {
          const img = await faceapi.fetchImage(`/api/graduate/face/${name}/${i++}.jpg`);
          //人脸标识符
          const itemDesc = await faceapi.detectSingleFace(img).withFaceLandmarks(/*true*/).withFaceDescriptor();
          descriptions.push(itemDesc.descriptor)
        } catch (e) {
          //console.log(name + '>>>' + e);
          i = -1
        }
      }
      let labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(name, descriptions);
      console.log(labeledFaceDescriptors);
      return labeledFaceDescriptors
    },
    async loadAllDescriptor(names) {
      console.log(names);
      for (let name of names) {
        let item = await this.loadOneDescriptor(name);
        if (item.descriptors.length > 0) {
          this.faceDescriptors.push(item)
        }
      }
    }
  },
  components: {
    Message
  }
}
</script>

<style scoped>
.root {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#canvas {
  position: absolute;
}

#video {
  position: absolute;
}

img {
  position: absolute;
  top: 0;
  width: 100px;
  height: 100px;
}

</style>