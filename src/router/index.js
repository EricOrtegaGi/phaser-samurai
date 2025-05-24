import { createRouter, createWebHashHistory } from 'vue-router'
import MenuPrincipal from '../components/MenuPrincipal.vue'
import Game from '../components/Game.vue'
import MenuFinal from '../components/MenuFinal.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: MenuPrincipal
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
  {
    path: '/menu-final',
    name: 'menu-final',
    component: MenuFinal,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  window.dispatchEvent(new CustomEvent('loading-start'))
  next()
})

router.afterEach(() => {
  window.dispatchEvent(new CustomEvent('loading-end'))
})

export default router
