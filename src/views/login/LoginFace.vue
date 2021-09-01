<template>
  <div class="root">
    <navbar class="navbar"></navbar>
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
import {openUserMedia} from "@/untils/CameraUntil";
import {Toast} from "vant";

export default {
  name: "face",
  components: {Navbar},
  data() {
    return {
      imgData: null,
      unWatch: null
    }
  },

  mounted() {
    this.unWatch = this.$watch('imgData', (nval, oval) => {
      this.unWatch()
      this.$refs.img.src = nval
      let imgBase = nval.split(',')[1]
      console.log(imgBase)
      //匹配人脸
      request.post('https://aip.baidubce.com/rest/2.0/face/v3/multi-search' + this.baiduToken,
          {
            image: imgBase,
            image_type: "BASE64",
            group_id_list: "1",
          }).then(res => {
          console.log(res);
        if (res.error_code===0){
          //1：N搜索，只取图中最大的人脸识别，face_list数组不会超过1
          let faceUser = res.result.face_list[0].user_list[0];
          let data={
            phone_number: faceUser.user_id,
            token:faceUser.user_info
          }
          console.log(data);
          request.post('/user/loginface',data).then(res=>{
            if (res.code === 200) {
              Toast.success('登录成功')
            }else{
              Toast.fail(JSON.stringify(res));
            }
          })
        }
        else if (res.error_code===222207){
          Toast.fail('用户未认证!')
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
  methods: {},
}
</script>

<style scoped>
.navbar {
  grid-column-start: span 3;
}

.root {
  /*background: #f7f8fa;*/
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