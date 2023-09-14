<template>
  <div
    id="threejs-container"
    ref="threejsContainer"
    class="w-screen h-screen relative inset-0"
  ></div>
</template>

<script setup>
import { defineExpose, ref, onMounted, onBeforeUnmount } from "vue";
import { resizeCamera, resizeRenderer } from "@/utils/three/misc/resize";
import { initBase } from "@/utils/three/init";
import { xrOpen } from "@/utils/three/xr";

const threejsContainer = ref();

const { renderer, scene, camera } = initBase();
// renderer init
xrOpen(renderer);

function resizeHandler() {
  const cW = threejsContainer.value.clientWidth;
  const cH = threejsContainer.value.clientHeight;
  resizeCamera(camera, cW, cH);
  resizeRenderer(renderer, cW, cH);
}

defineExpose({
  renderer,
  scene,
  camera,
});

onMounted(() => {
  resizeHandler();
  threejsContainer.value.appendChild(renderer.domElement);
  window.addEventListener("resize", resizeHandler, false);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeHandler, false);
});
</script>
