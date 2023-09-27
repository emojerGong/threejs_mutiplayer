<template>
  <ThreeBase ref="threeRef" />
  <Control ref="guiRef" />
  <ColyseusMain @room-updated="roomUpdateHandler" />
</template>

<script setup>
import * as THREE from 'three';
import Control from '@/comp/gui/Control.vue';
import ThreeBase from '@/comp/three/ThreeBase.vue';

import ColyseusMain from '@/comp/colyseus/Main.vue';
import { messageInit } from '@/utils/colyseus/message';

import { useToast } from 'vue-toast-notification';

import {
  ref,
  reactive,
  toRaw,
  onMounted,
  onBeforeUnmount,
  watchEffect,
} from 'vue';
import { createCubeBase } from '@/utils/three/geometry/cube';
import { createGridHelperBase } from '@/utils/three/floor/gridHelper';

const threeRef = ref();
const guiRef = ref();

let animateTime = 0;
let renderer, scene, camera;
const myObject3D = ref(null);
const myObject3DPosition = reactive({
  x: Math.random() * 4 - 2,
  y: 0,
  z: Math.random() * 4 - 2,
});
let room = ref(null);
let gui;

watchEffect(() => {
  if (room.value) {
    room.value.send('player-move', {
      id: room.value.sessionId,
      x: myObject3DPosition.x,
      z: myObject3DPosition.z,
    });
  }
});

function updateMyObjPos(position) {
  myObject3DPosition.x = position.x;
  myObject3DPosition.y = position.y;
  myObject3DPosition.z = position.z;
}

function myObject3DInit() {
  const cube = createCubeBase();
  cube.material.wireframe = true;
  myObject3D.value = new THREE.Object3D();
  myObject3D.value.position.x = myObject3DPosition.x;
  myObject3D.value.position.z = myObject3DPosition.z;
  myObject3D.value.add(cube);
  scene.add(toRaw(myObject3D.value));
}

function createAnotherCube(id = '', x = 0, z = 0) {
  if (room.value.sessionId !== id) {
    const obj = new THREE.Object3D();
    obj.name = id;
    obj.position.set(x, 0, z);
    const cube = createCubeBase();
    cube.material.wireframe = true;
    obj.add(cube);
    scene.add(obj);
  }
}

function updateCubePos(id = '', x = 0, z = 0) {
  const itemCube = scene.getObjectByName(id);
  if (itemCube) {
    itemCube.position.set(x, 0, z);
  }
}

function disposeCube(id = '') {
  scene.remove(scene.getObjectByName(id));
}

function guiInit() {
  if (myObject3D.value) {
    const itemObjPos = {
      x: myObject3D.value.position.x,
      z: myObject3D.value.position.z,
    };
    gui = guiRef.value.gui;
    const cubeFolder = gui.addFolder('Cube');
    const cubePositionFolder = cubeFolder.addFolder('Position');
    cubePositionFolder.add(itemObjPos, 'x', -5, 5).onChange((x) => {
      myObject3D.value.position.x = x;
      updateMyObjPos(myObject3D.value.position);
    });
    cubePositionFolder.add(itemObjPos, 'z', -5, 5).onChange((z) => {
      myObject3D.value.position.z = z;
      updateMyObjPos(myObject3D.value.position);
    });
    cubePositionFolder.open();
    cubeFolder.open();
  }
}

function roomUpdateHandler(roomValue) {
  room.value = roomValue;
  room.value.send('new-player', {
    id: room.value.sessionId,
    x: myObject3DPosition.x,
    z: myObject3DPosition.z,
  });

  messageInit(room.value, 'joined', (m) => {
    const { newPlayerId = '', players = [] } = m;
    if (room.value.sessionId !== newPlayerId) {
      useToast().success(`${newPlayerId} joined!`);
    }
    if (players?.length) {
      players.forEach((player) => {
        createAnotherCube(player.id, player.x, player.z);
      });
    }
  });

  messageInit(room.value, 'move', (m) => {
    const { id = '', x = 0, z = 0 } = m;
    if (room.value.sessionId !== id) {
      updateCubePos(id, x, z);
    }
  });

  messageInit(room.value, 'left', (m) => {
    const { id = '' } = m;
    useToast().warning(`${id} is left!`);
    disposeCube(id);
  });

  myObject3DInit();
  guiInit();
}

function mountedHandler() {
  renderer = threeRef.value.renderer;
  scene = threeRef.value.scene;
  camera = threeRef.value.camera;

  camera.position.z = 6;
  camera.position.y = 6;
  camera.lookAt(0, 0, 0);

  const gridHelper = createGridHelperBase();
  gridHelper.position.y = -0.5;
  scene.add(gridHelper);
}

function animate() {
  animateTime = requestAnimationFrame(animate);
  if (myObject3D.value) {
    camera.lookAt(myObject3D.value.position);
  }

  renderer.render(scene, camera);
}

onMounted(() => {
  mountedHandler();
  animate();
});
onBeforeUnmount(() => {
  if (room.value) {
    room.value.leave();
    useToast().success('left', {
      duration: 2000,
    });
  }
  cancelAnimationFrame(animateTime);
});
</script>
