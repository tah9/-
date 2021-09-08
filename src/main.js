import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vant from 'vant';
import 'vant/lib/index.css';
import navbar from "@/components/navbar";

Vue.use(Vant);
Vue.use(navbar);
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.baiduUrl = 'https://aip.baidubce.com/rest/2.0/face/v3'
// import VConsole from 'vconsole'
//
// new VConsole()

new Vue({
    router,
    data() {
        return {
            token: '',
            user: {}
        }
    },
    render: h => h(App)
}).$mount('#app')
