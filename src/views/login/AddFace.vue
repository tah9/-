<template>
  <div class="root">
    <navbar title="注册人脸" class="navbar"></navbar>
    <div class="face" ref="face">
      <video width="560" height="720" id="video" autoplay muted ref="video"></video>
      <canvas width="560" height="720" id="canvas" ></canvas>
    </div>
    <h3>把脸移入框内</h3>
    <img ref="img">
  </div>
</template>

<script>
import request from "@/network/request";
import Navbar from "@/components/navbar";
import {Toast} from "vant";
import {openUserMedia, syncStopTrack, restartTrack, getImg, destroyTrack} from '@/untils/CameraUntil'
import * as faceapi from "../../../public/face-api.min";

export default {
  name: "AddFace",
  components: {Navbar},
  data() {
    return {}
  },
  methods: {
    determineIfExisted(imgBase) {
      console.log('determineIfExisted')
      let jsonData = {
        image: imgBase,
        image_type: "BASE64",
        group_id_list: "1",
      }
      return request.post(this.baiduUrl + '/multi-search', jsonData)
          .then(res => {
            if (res.error_code === 0) {
              Toast.fail('人脸已被认证')
              return Promise.reject()
            } else {
              return Promise.resolve(jsonData.image)
            }
          })
    },
    addFace(image) {
      let jsonData = {
        image: image,
        image_type: "BASE64",
        group_id: "1",
        uid: this.$route.params.phone_number,
        user_info: this.$root.token
      }
      request.post(this.baiduUrl + '/faceset/user/add', jsonData)
          .then(res => {
            console.log(res);
            request.put('/user/addface/' + this.$route.params.phone_number)
                .then(res => {
                  console.log(res);
                  Toast.success('添加成功');
                  destroyTrack()
                  this.$router.replace('/login')
                })
          })
    }
  },
  mounted() {
    this.$nextTick(() => {
      const video = document.getElementById('video')
      const canvas = document.getElementById('canvas')
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        // faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]).then(()=>{
        console.log('over')
        navigator.getUserMedia(
            {video: {}},
            stream => video.srcObject = stream,
            err => console.error(err)
        )
        video.addEventListener('play',()=>{
          const displaySize = { width: video.width, height: video.height }
          faceapi.matchDimensions(canvas, displaySize)
          let options = new faceapi.TinyFaceDetectorOptions();
          setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, options).withFaceLandmarks()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
          }, 100)
        })

      })
    })

    // openUserMedia(this.$refs.video, trackEvent => {
    //   if (trackEvent.data.length > 0) {
    //     syncStopTrack()
    //     this.determineIfExisted(getImg(this.$refs.video))
    //         .then(this.addFace)
    //         .catch(restartTrack)
    //   }
    // });
  },
}
</script>

<style lang="less" scoped>
.navbar {
  top: 0;
}

.root {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
}


.face {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -40%); /* 50%为自身尺寸的一半 */
}

#video {
  position: absolute;
}

h3 {
  grid-row-start: 5;
  grid-column-start: 2;
  text-align: center;
}
canvas{
  position: absolute;
}
img {
  grid-column-start: 2;
  grid-row-start: 4;
  width: 300px;
  height: 300px;
}
</style>