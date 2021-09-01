<template>
  <div class="root">
    <navbar :title="title" class="navbar"></navbar>
    <div class="face" ref="face">
      <video autoplay playsinline id="video" ref="video"></video>
    </div>
    <h3>把脸移入框内</h3>
    <img ref="img">
  </div>
</template>

<script>
import request from "@/network/request";
import Navbar from "@/components/navbar";
import {Toast} from "vant";
import {openUserMedia} from '@/untils/CameraUntil'

export default {
  name: "AddFace",
  components: {Navbar},
  data() {
    return {
      title: '注册人脸',
      imgData: null,
      unWatch: null
    }
  },

  mounted() {
    console.log(this.$root.token+'===');
    this.unWatch = this.$watch('imgData', (nval, oval) => {
      this.unWatch()
      this.$refs.img.src = nval
      let imgBase = nval.split(',')[1]
      console.log(imgBase)
      request.post('https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add' + this.baiduToken,
          {
            image: imgBase,
            image_type: "BASE64",
            group_id: "1",//每组上限80W张图，所以暂时都上传1组
            user_id: this.$route.params.phone,
            user_info:this.$root.token
          }).then(res => {
        if (res.error_msg === 'SUCCESS') {
          Toast.success('认证成功');
          request.put('/user/addface/'+this.$route.params.phone).then(res=>{
            this.$router.replace('/login')
          })
        } else {
          Toast.fail(JSON.stringify(res));
        }
      })
    })
    openUserMedia(trackEvent => {
      if (trackEvent.data.length > 0) {//人脸数大于0
        let canvas = document.createElement("canvas");
        canvas.width = this.$refs.video.videoWidth;
        canvas.height = this.$refs.video.videoHeight;
        canvas.getContext('2d').drawImage(this.$refs.video, 0, 0);
        this.imgData = canvas.toDataURL("image/png")
      } else {
      }
    })
  },
}
</script>

<style scoped>
.navbar {
  grid-column-start: span 3;
}

.root {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto 10% auto 1fr 1fr 1fr 1fr 1fr;
}


.face {
  grid-column-start: 2;
  grid-row-start: 3;
  /*position: relative;*/
  width: 300px;
  height: 300px;
  border-radius: 50%;
  overflow: hidden;
}

#video {
  width: 300px;
  height: 300px;
  /*position: absolute;*/
}

h3 {
  grid-row-start: 5;
  grid-column-start: 2;
  text-align: center;
}

img {
  grid-column-start: 2;
  grid-row-start: 4;
  background: red;
  width: 300px;
  height: 300px;
}
</style>