import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: 'Home',
      component: () => import("../views/AppHome.vue"),
      redirect: "/login",
      children: [
        {
          path: '/login',
          name: 'Login',
          component: () => import("../views/AppLogin.vue"),
        },
        {
          path: "/reset-password",
          name: 'Reset',
          component: () => import("../views/AppResetPassword.vue")
        }
      ]
    },
    {
      path: "/loans",
      name: 'Loans',
      component: () => import("../views/AppLoans.vue"),
    },
  ],
});

router.beforeEach(async (to, from) => {
  const isAuthenticated = await JSON.parse(localStorage.auth).token
  const publicRoute = ['Home', 'Login', 'Reset']
  const name = String(to.name)

  if (!isAuthenticated && !publicRoute.includes(name)) return { name: 'Login' }
  else return true
})

export default router;