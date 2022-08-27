import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home/index.vue'
import Type from '../pages/Type/index.vue'
import Cart from '../pages/Cart/index.vue'
import My from '../pages/My/index.vue'
import List from '../pages/List/index.vue'
import Detail from '../pages/Detail/index.vue'
import Login from '../pages/Login/index.vue'
import PayPal from '../pages/PayPal/index.vue'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/type',
            name: 'type',
            component: Type
        },
        {
            path: '/cart',
            name: 'cart',
            component: Cart
        },
        {
            path: '/my',
            name: 'my',
            component: My
        },
        {
            path: "/list/:id?",
            name: "list",
            component: List,
            props: true
        },
        {
            path: "/detail/:id?",
            name: "detail",
            component: Detail,
            props: true
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/paypal",
            name: "paypal",
            component: PayPal
        }

    ]
})

// 添加路由守卫,如果没登录,就跳转到登录页面
const whiteRouter = ["/my","/cart"] // 需要权限的路由
router.beforeEach((to,from,next)=>{
    if(whiteRouter.includes(to.path) && !localStorage.getItem('token')){
        return next('/login')
    }
    next()
})

export default router

