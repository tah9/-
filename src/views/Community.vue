<template>

  <div class="root">
    <div class="btns">
      <button ref="btnCut" @click="cutC">拍摄</button>
      <button ref="btnChangeC" @click="changeC">切换摄像头</button>
    </div>
    <div>
      <video autoplay ref="video"></video>
      <div>
        <div ref="rootview">
          <canvas ref="canvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      useFrontCamera: true,
      constraints: {
        video: {
          width: {
            min: 500,
            ideal: 500,
            max: 500,
          },
          height: {
            min: 500,
            ideal: 500,
            max: 500,
          }
        },
        facingMode:'user'
      }
    }
  },
 async mounted() {
    // try {
    //   if (
    //       !"mediaDevices" in navigator ||
    //       !"getUserMedia" in navigator.mediaDevices
    //   ) {
    //     document.write('当前浏览器不支持Camera API，请更新浏览器。')
    //     return;
    //   }
    //   alert("chenggong")
    // } catch (e) {
    //   alert(e)
    // }
    await this.init()
  },
  methods: {
    changeC() {
      this.useFrontCamera = !this.useFrontCamera;
      this.init()
    },
    cutC() {
      let img = document.createElement("img");
      img.style.width = '100%';
      this.$refs.canvas.width = this.$refs.video.videoWidth;
      this.$refs.canvas.height = this.$refs.video.videoHeight;
      this.$refs.canvas.getContext("2d").drawImage(this.$refs.video, 0, 0);
      img.src = this.$refs.canvas.toDataURL("image/png");
      this.$refs.screenshots.prepend(img);
    },
    async init() {
      this.constraints.video.facingMode=this.useFrontCamera ? "user" : "environment"
      //需配合异步，否则报错
      try {
        let media = await navigator.mediaDevices.getUserMedia(this.constraints);
        this.$refs.video.srcObject = media
      } catch (e) {
        alert(e)
      }
    }
  }
}
</script>
<style scoped>

</style>