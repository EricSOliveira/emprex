import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: 'home',
      component: () => import("../views/AppHome.vue"),
    },
    {
      path: "/loans",
      name: 'loans',
      component: () => import("../views/AppLoans.vue"),
    },
  ],
});

export default router;