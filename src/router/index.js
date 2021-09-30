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
const Box = () => import('../views/box/Box')
const Probe = () => import('../views/Probe/Probe')
const EnterExit = () => import('../views/EnterExit')
const Test2 = () => import('../views/WebCam')
const HumanTest = () => import('../views/HumanTest')

Vue.use(VueRouter)
const routes = [
    {
        path: "/",
        redirect: '/login'
    },
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
        path: '/user/:uid',
        component: UserMess
    }, {
        path: '/box',
        component: Box
    }, {
        path: '/probe/:number',
        component: Probe
    }, {
        path: '/enterexit',
        component: EnterExit
    }, {
        path: '/test2',
        component: Test2
    }, {
        path: '/humantest',
        component: HumanTest
    }, {
        path: '/publishArticle',
        component: () => import('../views/home/home/PublishArticle')
    }, {
        path: '/test',
        component: () => import('../views/home/user/HeaderBarPage.bak')
    },{
        path:'/articleInfo/:id',
        component:()=>import('../views/home/article/ArticleInfo')
    },{
        path:'/onlineChat',
        component:()=>import('../views/chat/OnlineChat')
    },{
        path:'/onlineChat2',
        component:()=>import('../views/chat/OnlineChat2')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
