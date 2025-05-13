import { createRouter, createWebHashHistory } from 'vue-router'
import MenuPrincipal from '@/components/MenuPrincipal.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: MenuPrincipal
  },
  {
    path: '/game1',
    name: 'game1',
    component: () => import(/* webpackChunkName: "mundo1" */ '@/views/Mundo1.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/game2',
    name: 'game2',
    component: () => import(/* webpackChunkName: "mundo2" */ '@/views/Mundo2.vue'),
    meta: { requiresAuth: false }
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
