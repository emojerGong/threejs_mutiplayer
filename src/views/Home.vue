<template>
  <main
    class="w-screen h-screen overflow-hidden pt-12 pb-4 m-auto flex flex-col items-center gap-y-4"
  >
    <h2 class="font-extrabold font-mono text-5xl">Threejs + mutiplayer</h2>
    <nav
      class="flex-1 overflow-y-auto min-w-[300px] flex flex-col items-center justify-start gap-y-2"
    >
      <div v-if="!filterRoutes.length" class="text-gray-400">
        ----- No Page -----
      </div>
      <router-link
        class="w-full h-10 inline-flex justify-center items-center border-black border-2 rounded-xl hover:bg-black/10"
        v-for="(route, index) in filterRoutes"
        :key="index"
        :to="route.path"
      >
        {{ route.name }}
      </router-link>
    </nav>
  </main>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';

const routes = useRouter().options.routes;
const ignoreRouteNameList = ['/', 'home', 'startup'];
const filterRoutes = routes.filter(
  (route) => !ignoreRouteNameList.includes(route.name)
);
</script>

<style lang="scss" scoped></style>
