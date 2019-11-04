import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: 'map',
        },
        {
            path: '/login',
            name: 'login',
            beforeEnter: () => {
                window.location = process.env.VUE_APP_BACKEND_URL + '/admin/login/';
            }
        },
        {
            path: '/map',
            name: 'map',
            component: () => import(/* webpackChunkName: "map" */ '@/views/Map.vue')
        },
        {
            path: '/lake/:reachcode',
            name: 'lake',
            props: (route) => ({
                reachcode: route.params.reachcode,
            }),
            component: () => import(/* webpackChunkName: "lake" */ '@/views/Lake.vue')
        },
        {
            path: `/:slug`,
            name: 'flatpage',
            props: (route) => ({
                slug: route.params.slug,
            }),
            component: () => import(/* webpackChunkName: "flatpage" */ '@/views/FlatPage.vue')
        },
    ]
})

export default router;
