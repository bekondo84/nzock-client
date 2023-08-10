import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/IsisHomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  }, {
    path: '/error-404',
    name: 'error404',
    component: () => import('@/components/errors/404ErrorPage.vue')
  }, {
    path: '/error-500',
    name: 'error500',
    component: () => import('@/components/errors/500ErrorPage.vue')
  }, {
    path: '/error-400',
    name: 'error400',
    component: () => import('@/components/errors/400ErrorPage.vue')
  },{
    path: '/:plugin',
    name: 'plugin',
    component: HomeView
  }, {
    path: "/:catchAll(.*)",
    redirect: "/"
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
