<template>
  <div>
    <div class="dialog">
      <div class="msg" :class="m.state === 'send' ? 'send': 'received'"
           v-for="m in msg">
        <span>{{m.data}}</span>
      </div>
    </div>
    <div class="function">
        <input type="text" @keyup.enter="send" v-model:value="text">
        <button type="submit" @click="send">发送</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WebChat",
  data(){
    return {
      sendId: this.$route.query.user_id,
      receivedId:this.$route.query.received_id,
      text: '',
      msg:[]
    }
  },
  created() {
    creatWebSocket(this.sendId)
  },
  mounted() {
    let _this = this
    webSocket.onmessage = function (e){
      let res = JSON.parse(e.data)
      console.log(res)

      let obj = {}
      obj.state = 'received'
      obj.data = res.text
      _this.msg.push(obj)
    }
  },
  beforeDestroy() {
    closeWebSocket()
  },
  methods:{
    send(){
      sendTo(this.text, this.sendId, this.receivedId)

      let obj = {}
      obj.state = 'send'
      obj.data = this.text
      this.msg.push(obj)

      this.text = ''
    }
  }
}

let webSocket = null

function creatWebSocket(sendId){
  webSocket = new WebSocket('ws://localhost:9001/webSocket/' + sendId)
}

function closeWebSocket(){
  webSocket.close()
  console.log('close')
}

function sendTo(msg, sendId, receivedId){
  let obj = {}
  obj.sendUserId = sendId
  obj.receivedUserId = receivedId
  obj.text = msg
  let jsonData = JSON.stringify(obj)
  webSocket.send(jsonData)
  // console.log(obj)
}

function setInnerHtml(msg){
  document.getElementsByClassName("dialog")[0].scrollIntoView(msg);
}

window.onload = function () {
  webSocket.onopen = function (e) {
    console.log('connection')
  }

  webSocket.onerror = function (e) {
    console.log('error')
  }


}
</script>

<style scoped>
.dialog{

}
.msg{
  /*margin: 5px auto;*/
  padding: 25px;
  /*text-align: center;*/
  line-height: 40px;
  font-size: 20px;
}
.msg span{
  display: inline-block;
  margin: 10px;
  padding: 10px 30px;
  background-color:#e3e3e3;
}
.send{
  text-align: right;
}
.received span{
  text-align: left;
}
.function{
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 20px 0;
  background-color: #e3e3e3;
  text-align: center;
}
</style>