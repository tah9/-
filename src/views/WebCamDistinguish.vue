<template>
  <div class="root">
    <!--    <input type="file" id="imageUpload">-->
    <video width="1280" height="720 " id="video" autoplay muted></video>
    <canvas width="1280" height="720" id="canvas"></canvas>
  </div>
</template>

<script>
import * as faceapi from "../../public/face-api.min.js";

export default {
  name: "WebCam",
  mounted() {
    this.$nextTick(() => {
      const video = document.getElementById('video')
      const canvas = document.getElementById('canvas')
      Promise.all([
        navigator.getUserMedia(
            {video: {}, audio: false},
            stream => video.srcObject = stream,
            err => console.error(err)
        ),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        // faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
      ]).then(start)

      async function start() {
        const labeledFaceDescriptors = await loadLabeledImages()
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)//匹配偏差，越小越严格，超过0.5以上都为unknow

        const displaySize = {width: video.width, height: video.height}
        faceapi.matchDimensions(canvas, displaySize)

        setInterval(async () => {
          const options = new faceapi.TinyFaceDetectorOptions({
            // inputSize:608,》32的倍数，越大越能检测最小的人脸同时更慢。上限608默认400
          })
          const detections = await faceapi.detectAllFaces(video, options).withFaceLandmarks(/*true*/).withFaceDescriptors()
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()})
            drawBox.draw(canvas)
          })
          // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        }, 100)

      }


      function loadLabeledImages() {
        const labels = ['leijun', 'tanghan', 'zhouxingchi'];
        return Promise.all(
            labels.map(async label => {
              const descriptions = []
              for (let i = 0; i <= 2; i++) {
                try {
                  const img = await faceapi.fetchImage(`/api/graduate/face/${label}/${i}.jpg`)
                  const detections = await faceapi.detectSingleFace(img).withFaceLandmarks(/*true*/).withFaceDescriptor()
                  descriptions.push(detections.descriptor)
                } catch (e) {
                  console.log(label + i + "]]" + e);
                }
              }
              return new faceapi.LabeledFaceDescriptors(label, descriptions)
            })
        )
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
}

#video {
  position: absolute;
}
</style>