import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
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
        path: '/:slug',
        name: 'flatpage',
        props: (route) => ({
            slug: route.params.slug,
        }),
        component: () => import(/* webpackChunkName: "FlatPage" */ './views/FlatPage.vue')
    }
  ]
})
