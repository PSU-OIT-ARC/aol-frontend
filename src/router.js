import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const FlatPageRoutes = 'about|aquatic-invasives|bathymetry|photo-submissions';


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/lake/:reachcode',
        name: 'lake',
        props: (route) => ({
            reachcode: route.params.reachcode,
        }),
        component: () => import(/* webpackChunkName: "lake" */ './views/Lake.vue')
    },
    {
        path: '/login',
        name: 'login',
        beforeEnter: () => {
            window.location = process.env.VUE_APP_BACKEND_URL;
        }
    },
    {
        path: `/:slug(${FlatPageRoutes})`,
        name: 'flatpage',
        props: (route) => ({
            slug: route.params.slug,
        }),
        component: () => import(/* webpackChunkName: "FlatPage" */ './views/FlatPage.vue')
    },
    {
        path: '*',
        name: '404',
        component: () => import(/* webpackChunkName: "404" */ './views/404.vue')
    }
  ]
})
