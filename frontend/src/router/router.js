import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/views/Home.vue";
import Login from "@/components/views/Login.vue";
import Register from "@/components/views/Register.vue";
import PageNotFound from "@/components/views/PageNotFound.vue";
import Account from "@/components/Account.vue";
import store from "@/store/store.js";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/account/:id",
    name: "Account",
    props: true,
    component: Account,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "PAGENOTFOUND",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && to.path !== "/register" && !store.state.logged) {
    next("/login");
  } else {
    // W przeciwnym razie, pozwól mu przejść dalej
    next();
  }
});

export default router;
