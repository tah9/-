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
import {openUserMedia, getImg, syncStopTrack, restartTrack, destroyTrack} from "@/untils/CameraUntil";
import {Toast} from "vant";

export default {
  name: "face",
  components: {Navbar},
  data() {
    return {}
  },
  methods: {
    matchFace(imgBase) {
      console.log('match')

      let data = {
        image: imgBase,
        image_type: "BASE64",
        group_id_list: "1",
      }
      return request.post(this.baiduUrl + '/multi-search', data)
          .then(res => {
            console.log(res);
            if (res.error_code === 0) {
              let faceUser = res.result.face_list[0].user_list[0];
              console.log(faceUser);
              return Promise.resolve(faceUser)
            } else if (res.error_code === 222207) {
              Toast.fail('用户未认证!')
              return Promise.reject()
            }
          })
    },
    faceLogin(faceUser) {
      let data = {
        phone_number: faceUser.uid,
        token: faceUser.user_info
      }
      console.log(data);
      request.post('/user/loginface', data)
          .then(res => {
            if (res.code === 200) {
              this.$root.token = data.token
              this.$root.user = res.user
              Toast.success("欢迎，" + res.user.username)
              destroyTrack()
              this.$router.replace('/main/mine')
            } else {
              Toast.fail(JSON.stringify(res));
            }
          })
    }
  },
  mounted() {
    openUserMedia(this.$refs.video, trackEvent => {
      if (trackEvent.data.length > 0) {
        syncStopTrack()
        this.matchFace(getImg(this.$refs.video))
            .then(this.faceLogin)
            .catch(restartTrack)
      }
    })
  }
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
  width: 300px;
  height: 300px;
}
</style>