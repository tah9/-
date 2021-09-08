import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("../views/login/Login")
const LoginFace = () => import("../views/login/LoginFace")
const Register = () => import("../views/login/Register")
const AddFace = () => import("../views/login/AddFace")
const Main = () => import("../views/home/Main")
const Mine = () => import("../views/home/user/Mine")
const Center = () => import("../views/home/center/Center")
const Home = () => import("../views/home/home/Home")
const UserMess = () => import("../views/home/user/UserMess")
const Box = () => import('../views/box/DepositBox')
const Probe = () => import('../views/Probe/Probe')
const Test = () => import('../views/WebCamDistinguish')
const Test2 = () => import('../views/WebCam')

Vue.use(VueRouter)
const routes = [
    {
        path: "/login",
        component: Login,
    }, {
        path: "/login/face",
        component: LoginFace,
    }, {
        path: "/login/register",
        component: Register,
    }, {
        path: "/login/addface/:phone_number",
        component: AddFace,
    }, {
        path: '/main',
        component: Main,
        children: [
            {
                path: "home",
                component: Home
            }, {
                path: "center",
                component: Center
            }, {
                path: "mine",
                component: Mine
            },
        ]
    },
    {
        path: '/main/mine/usermess',
        component: UserMess
    }, {
        path: '/box',
        component: Box
    }, {
        path: '/probe/:number',
        component: Probe
    }, {
        path: '/test1',
        component: Test
    }, {
        path: '/test2',
        component: Test2
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
