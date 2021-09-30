<template>
  <div>

  </div>
</template>

<script>
import request from "@/network/request";
import axios from 'axios'

export default {
  name: "HomeTags",
  mounted() {
    let config = {

      url: "https://api.coolapk.com/v6/main/headline",
      method: "GET",
      headers: {
      //   // "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 11; 21051182C Build/RKQ1.200826.002) (#Build; Xiaomi; 21051182C; RKQ1.200826.002 test-keys; 11) +CoolMarket/7.0",
      //   "X-Requested-With": "XMLHttpRequest",
      //   "X-Sdk-Int": "30",
      //   "X-Sdk-Locale": "zh-CN",
      //   "X-App-Id": "coolmarket",
      //   "X-App-Token": "51818cf27372e6e622aa0a492204596b51c07174-d3cf-3f21-aceb-a4aea81f1c700x6146b62b",
      //   "X-App-Version": "7.0",
      //   "X-App-Code": "1611112",
      //   "X-Api-Version": "7",
      //   "Host": "api.coolapk.com",
      //   "Connection": "Keep-Alive",
      //   "Accept-Encoding": "gzip",
      //   "cache-control": "no-cache",
      //   "Postman-Token": "6fdda54d-87c1-480c-9121-38556fb64beb"
      }
    }
    axios.get('/apis/v6/main/headline',{
      headers:{
        // Content-Type:
      },
      withCredentials:true
    }).then(res => {
      console.log(res);
    })
  }
}
</script>

<style scoped lang="less"></style>