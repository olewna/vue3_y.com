import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/views/Home.vue";
import Login from "../components/views/Login.vue";
import Register from "../components/views/Register.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
