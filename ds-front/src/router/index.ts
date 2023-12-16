// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/new-dream',
  },
  {
    path: '/new-dream',
    name: 'NewDreamPage',
    component: () => import('@/views/NewDreamPage.vue'),
    meta: { title: 'New Dream' }
  },
  {
    path: '/dreams',
    name: 'DreamsPage',
    component: () => import('@/views/DreamsPage.vue'),
    meta: { title: 'Dreams' }
  },
  {
    path: '/new-session',
    name: 'NewSessionPage',
    component: () => import('@/views/NewSessionPage.vue'),
    meta: { title: 'New Session' }
  },
  {
    path: '/sessions',
    name: 'SessionsPage',
    component: () => import('@/views/SessionsPage.vue'),
    meta: { title: 'Sessions' }
  },
  {
    path: '/dream/:id/:action',
    name: 'ViewDreamPage',
    component: () => import('@/views/ViewDreamPage.vue'),
    meta: { title: 'View Dream' }
  },
  {
    path: '/session/:id',
    name: 'ViewSessionPage',
    component: () => import('@/views/ViewSessionPage.vue'),
    meta: { title: 'New Session' }
  },
  {
    path: '/dream-overview',
    name: 'DreamOverviewPage',
    component: () => import('@/views/DreamOverviewPage.vue'),
    meta: { title: 'Time Overview' }
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: () => import('@/views/SettingsPage.vue'),
    meta: { title: 'Settings' }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
