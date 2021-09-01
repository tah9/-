import Vue from 'vue'
import VueRouter from 'vue-router'
const Login =()=>import("../views/login/Login")
const LoginFace =()=>import("../views/login/LoginFace")
const Register =()=>import("../views/login/Register")
const AddFace =()=>import("../views/login/AddFace")
const Community =()=>import("../views/Community")
Vue.use(VueRouter)

const routes = [
  {
    path:"/login",
    component: Login,
  },{
    path:"/login/face",
    component: LoginFace,
  },{
    path:"/login/register",
    component: Register,
  },,{
    path:"/login/addface/:phone",
    component: AddFace,
  },
  {
    path: "/community",
    component:Community
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
