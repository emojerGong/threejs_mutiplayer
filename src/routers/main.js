import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Hone.vue"),
  },
  {
    path: "/startup",
    name: "startup",
    component: () => import("@/views/three/Startup.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export { router, routes };
