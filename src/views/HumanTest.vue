<template>
<div>

  <video width="320" height="240" id="video" autoplay muted></video>
  <canvas width="320" height="240"  id="canvas"></canvas>
</div>
</template>

<script>
import Human from '@vladmandic/human';
export default {
  name: "HumanTest",
  mounted() {
    this.$nextTick(()=>{
      // create instance of human with simple configuration using default values
      const config = { backend: 'webgl' };
      const human = new Human(config);

      function detectVideo() {
        // select input HTMLVideoElement and output HTMLCanvasElement from page
        const inputVideo = document.getElementById('video');
        const outputCanvas = document.getElementById('canvas');
        // perform processing using default configuration
        human.detect(inputVideo).then((result) => {
          // result object will contain detected details
          // as well as the processed canvas itself
          // so lets first draw processed frame on canvas
          human.draw.canvas(result.canvas, outputCanvas);
          // then draw results on the same canvas
          human.draw.face(outputCanvas, result.face);
          human.draw.body(outputCanvas, result.body);
          human.draw.hand(outputCanvas, result.hand);
          human.draw.gesture(outputCanvas, result.gesture);
          // and loop immediate to the next frame
          requestAnimationFrame(detectVideo);
        });
      }

      detectVideo();

    })
  }
}
</script>

<style scoped>

</style>