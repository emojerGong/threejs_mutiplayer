<template>
  <div ref="guiContainerRef" id="gui-container"></div>
</template>

<script setup>
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { ref, reactive, defineExpose, onMounted } from "vue";

const guiContainerRef = ref();
const gui = new GUI({ width: 300 });

defineExpose({
  gui,
});

onMounted(() => {
  guiContainerRef.value.appendChild(gui.domElement);
});
</script>
