<template>
  <div class="root">
    <video width="1280" height="720 " style="position: absolute;" id="video" autoplay muted></video>
    <canvas  width="1280" height="720" style="position: absolute;" id="canvas"></canvas>
  </div>
</template>

<script>
import * as faceapi from "../../public/face-api.min.js";

export default {
  name: "WebCam",
  data() {
    return {
      width: null,
      height: null
    }
  },
  methods: {
    async run() {
      // load the models
      await faceapi.loadMtcnnModel('/')
      await faceapi.loadFaceRecognitionModel('/')
      // try to access users webcam and stream the images
      // to the video element
    }
  },
  created() {
    const os = function () {
      const ua = navigator.userAgent,
          isWindowsPhone = /(?:Windows Phone)/.test(ua),
          isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
          isAndroid = /(?:Android)/.test(ua),
          isFireFox = /(?:Firefox)/.test(ua),
          isChrome = /(?:Chrome|CriOS)/.test(ua),
          isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
          isPhone = /(?:iPhone)/.test(ua) && !isTablet,
          isPc = !isPhone && !isAndroid && !isSymbian;
      return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
      };
    }();
    let _this = this;
    this.$nextTick(() => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        // faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        // faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]).then(startVideo)
      let video = document.getElementById('video');

      function startVideo() {
        navigator.getUserMedia(
            {
              video: {
                /*width: 300, height: 300,facingMode: "environment",*/
              }, audio: false
            },
            stream => {
              const setting = stream.getVideoTracks()[0].getSettings();
              console.log(setting);
              console.log(os);
              if (os.isAndroid || os.isPhone) {
                _this.width = setting.height
                _this.height = setting.width
                if (setting.aspectRatio < 1) {
                  _this.width = setting.width
                  _this.height = setting.height
                }
              } else if (os.isTablet) {
                alert("平板")
              } else if (os.isPc) {
                _this.width = setting.width
                _this.height = setting.height
              }
              console.log();
              video.srcObject = stream
            },
            err => console.error(err)
        )
        video.addEventListener('play', () => {
          const canvas = document.getElementById('canvas')
          const displaySize = {width: video.width, height: video.height}
          faceapi.matchDimensions(canvas, displaySize)
          let options = new faceapi.TinyFaceDetectorOptions();
          setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, options)
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
          }, 100)
        })
      }
    })

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
  /*border-radius: 50%;*/
  /*padding: 5px;*/
  /*border: solid green 5px;*/
}

#video {
  position: absolute;
  /*border-radius: 50%;*/
  /*padding: 5px;*/
  /*border: solid green 5px;*/
}
</style>