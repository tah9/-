<template>
  <div class="root">
    <div class="face" ref="face">
      <video id="video" class="video" width="640" height="480" preload autoplay loop muted></video>
      <canvas id="canvas" class="video" width="640" height="480"></canvas>
    </div>
  </div>
</template>

<script>


export default {
  name: "Probe",
  data() {
    return {
      video: null,
      canvas: null,
      context: null
    }
  },
  mounted() {
    this.video = document.getElementById('video')
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext("2d")
    openUserMedia(this.video, trackEvent => {
      // 画框框
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (trackEvent.data.length > 0) {
        trackEvent.data.forEach(rect => {
          this.context.lineWidth = 1;
          if (rect.y>=120){
            this.context.strokeStyle = "#3ea751";
          }else{
            this.context.strokeStyle = "#ff0000";
          }
          console.log(rect);
          this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        })
      }
    })
  }
}
</script>

<style lang="less" scoped>
@width: 320px;
@heigh: 240px;

.root {

}

.face {
  position: relative;
  //left: calc(50% - 160px);
}

#video {
  position: absolute;
  //width: @width;
  //height: @heigh;
}

#canvas {
  position: absolute;
  //width: @width;
  //height: @heigh;
}
</style>