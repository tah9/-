import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vant from 'vant';
import 'vant/lib/index.css';
import navbar from "@/components/navbar";

Vue.use(Vant);
Vue.use(navbar);
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.baiduToken = '?access_token=24.b5a99405e4e864ee75267aa50315654e.2592000.1632800342.282335-24767568';
new Vue({
    router,
    data(){
      return{
          token:''
      }
    },
    store,
    render: h => h(App)
}).$mount('#app')
