import { createRouter, createWebHashHistory } from 'vue-router'
import MenuPrincipal from '../components/MenuPrincipal.vue'
import Game from '../components/Game.vue'
//import MenuMuerte from '../components/MenuMuerte.vue'
//import MenuFinal from '../components/MenuFinal.vue'

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
    path: '/x',
    name: 'Muerte',
    component: () => import(/* webpackChunkName: "muerte" */ '@/components/MenuMuerte.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/end',
    name: 'Final',
    component: () => import(/* webpackChunkName: "final" */ '@/components/MenuFinal.vue'),
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

// Navegación guard para manejar la carga
router.beforeEach((to, from, next) => {
  // Mostrar loading state
  window.dispatchEvent(new CustomEvent('loading-start'))
  next()
})

router.afterEach(() => {
  // Ocultar loading state
  window.dispatchEvent(new CustomEvent('loading-end'))
})

export default router
