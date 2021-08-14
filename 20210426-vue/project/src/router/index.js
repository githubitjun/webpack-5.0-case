/*
 * @Author: 九天
 * @Date: 2021-04-26 10:44:26
 * @LastEditors: 九天
 * @LastEditTime: 2021-08-11 10:07:37
 * @Description: 
 * @FilePath: \20210426-vue\project\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/animation',
    name: 'Animation',
    component:() => import('../views/Animation.vue')
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component:() => import('../views/Monitor.vue')
  },
  {
    path: '/uploadFiles',
    name: 'uploadFiles',
    component:() => import('../views/UploadFiles.vue')
  },
  {
    path: '/breakUpload',
    name: 'breakUpload',
    component:() => import('../views/BreakUpload.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
