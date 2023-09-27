import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/startup',
    name: 'startup',
    component: () => import('@/views/three/Startup.vue'),
  },
  {
    path: '/startup_with_colyseus',
    name: 'startup_with_colyseus',
    component: () => import('@/views/three/StartupWithColyseus.vue'),
  },
  {
    path: '/avatar_with_colyseus',
    name: 'avatar_with_colyseus',
    component: () => import('@/views/three/AvatarWithColyseus.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export { router, routes };
