<template>
  <ThreeBase ref="threeRef" />
  <Control ref="guiRef" />
</template>

<script setup>
import * as THREE from "three";

import ThreeBase from "@/comp/three/ThreeBase.vue";
import Control from "@/comp/gui/Control.vue";

import { ref, onMounted, onBeforeUnmount } from "vue";
import { createCubeBase } from "@/utils/three/geometry/cube";
import { createGridHelperBase } from "@/utils/three/floor/gridHelper";

const threeRef = ref();
const guiRef = ref();

let animateTime = 0;
let renderer, scene, camera, myObject3D;
let gui;

function mountedHandler() {
  renderer = threeRef.value.renderer;
  scene = threeRef.value.scene;
  camera = threeRef.value.camera;

  camera.position.z = 6;
  camera.position.y = 6;

  const cube = createCubeBase();
  cube.material.wireframe = true;
  myObject3D = new THREE.Object3D();
  myObject3D.position.x = Math.random() * 4 - 2;
  myObject3D.position.z = Math.random() * 4 - 2;
  myObject3D.add(cube);
  scene.add(myObject3D);

  const gridHelper = createGridHelperBase();
  gridHelper.position.y = -0.5;
  scene.add(gridHelper);

  // gui init
  gui = guiRef.value.gui;
  const cubeFolder = gui.addFolder("Cube");
  const cubePositionFolder = cubeFolder.addFolder("Position");
  cubePositionFolder.add(myObject3D.position, "x", -5, 5);
  cubePositionFolder.add(myObject3D.position, "z", -5, 5);
  cubePositionFolder.open();
  const cubeRotationFolder = cubeFolder.addFolder("Rotation");
  cubeRotationFolder.add(myObject3D.rotation, "x", 0, Math.PI * 2, 0.01);
  cubeRotationFolder.add(myObject3D.rotation, "y", 0, Math.PI * 2, 0.01);
  cubeRotationFolder.add(myObject3D.rotation, "z", 0, Math.PI * 2, 0.01);
  cubeRotationFolder.open();
  cubeFolder.open();
}

function animate() {
  animateTime = requestAnimationFrame(animate);
  camera.lookAt(myObject3D.position);

  renderer.render(scene, camera);
}

onMounted(() => {
  mountedHandler();
  animate();
});
onBeforeUnmount(() => {
  cancelAnimationFrame(animateTime);
});
</script>
