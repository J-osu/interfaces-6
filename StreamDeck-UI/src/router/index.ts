import { createRouter, createWebHistory } from 'vue-router'
import { useSystemStore } from '@/stores/systemStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'checklist',
      component: () => import('@/views/ChecklistView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      beforeEnter: () => {
        const store = useSystemStore()
        if (!store.checksCompleted) {
          return { name: 'checklist' }
        }
      },
    },
  ],
})

export default router
