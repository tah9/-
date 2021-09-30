import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import Vant from 'vant';
import 'vant/lib/index.css';
import navbar from "@/components/navbar";

Vue.use(Vant);
Vue.use(navbar);
Vue.config.productionTip = false
// Vue.use(ElementUI);
Vue.prototype.wsUrl='ws://192.168.31.64/websocket/'
Vue.prototype.baiduUrl = 'https://aip.baidubce.com/rest/2.0/face/v3'
// import VConsole from 'vconsole'
//
// new VConsole()

new Vue({
    router,
    data() {
        return {
            user: {

            }
        }
    },
    methods:{
        getUser(){
            return JSON.parse(window.localStorage.getItem('user'))
        },
        setUser(user){
            window.localStorage.setItem("user",user)
        }
    },
    render: h => h(App)
}).$mount('#app')
