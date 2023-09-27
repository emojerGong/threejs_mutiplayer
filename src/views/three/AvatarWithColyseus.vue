<template>
  <ThreeBase ref="threeRef" />
  <Control ref="guiRef" />
  <ColyseusMain @room-updated="roomUpdateHandler" />
</template>

<script setup>
import {
  ref,
  reactive,
  toRaw,
  onMounted,
  onBeforeUnmount,
  watchEffect,
} from 'vue';
import { useToast } from 'vue-toast-notification';
import * as THREE from 'three';
import Control from '@/comp/gui/Control.vue';
import ThreeBase from '@/comp/three/ThreeBase.vue';
// threejs middleware
import { createGridHelperBase } from '@/utils/three/floor/gridHelper';
import { createTextSprite } from '@/utils/three/text/main';
import { createLightBase } from '@/utils/three/light/main';
import { getModelSize } from '@/utils/three/misc/model';
// Colyseus middleware
import ColyseusMain from '@/comp/colyseus/Main.vue';
import { messageInit } from '@/utils/colyseus/message';
// avatar
import {
  createRandomProfile,
  loadModelBaseAsync_AvatarTest,
} from '@/utils/avatar/main';

// component ref
const threeRef = ref();
const guiRef = ref();

let animateTime = 0; // 接收requestAnimationFrame
let renderer, scene, camera; // threejs related
let userList = []; // 接收room players
const myObject3D = ref(null);
const myObject3DPosition = reactive({
  x: Math.random() * 4 - 2,
  y: 0,
  z: Math.random() * 4 - 2,
});
const myObject3DAction = ref(null);
const room = ref(null);

watchEffect(() => {
  if (room.value) {
    room.value.send('player-move', {
      id: room.value.sessionId,
      x: myObject3DPosition.x,
      z: myObject3DPosition.z,
    });
  }
});
watchEffect(() => {
  if (room.value) {
    if (myObject3DAction.value) {
      room.value.send('player-action', {
        id: room.value.sessionId,
        action: myObject3DAction.value,
      });
    }
  }
});

function updateMyObjPos(position) {
  myObject3DPosition.x = position.x;
  myObject3DPosition.y = position.y;
  myObject3DPosition.z = position.z;
}

async function myObject3DInit() {
  const { profile, model, mixer, transitionList } =
    await loadModelBaseAsync_AvatarTest();

  console.log(getModelSize(model));
  console.log(model.position);
  const textMesh = await createTextSprite();
  textMesh.position.set(
    model.position.x,
    model.position.y + 2.3,
    model.position.z
  );
  myObject3D.value = new THREE.Object3D();
  myObject3D.value.position.x = myObject3DPosition.x;
  myObject3D.value.position.z = myObject3DPosition.z;
  myObject3D.value.add(model);
  myObject3D.value.add(textMesh);
  scene.add(toRaw(myObject3D.value));

  const ownerInfo = {
    profile,
    model,
    mixer,
    transitionList,
    owner: true,
  };
  userList.push(ownerInfo);

  return ownerInfo;
}

async function createAnotherAvatar(player) {
  if (room.value.sessionId !== player.id) {
    const { id, profile, x, z } = player;

    const obj = new THREE.Object3D();
    obj.name = id;
    obj.position.set(x, 0, z);

    const anotherAvatar = await loadModelBaseAsync_AvatarTest(profile);
    obj.add(anotherAvatar.model);

    scene.add(obj);
    userList.push({
      id,
      profile: anotherAvatar.profile,
      model: anotherAvatar.model,
      mixer: anotherAvatar.mixer,
      transitionList: anotherAvatar.transitionList,
      owner: false,
    });
  }
}

function updateAvatarPos(id = '', x = 0, z = 0) {
  const itemCube = scene.getObjectByName(id);
  if (itemCube) {
    itemCube.position.set(x, 0, z);
  }
}

function updateAvatarAction(id = '', action = '') {
  if (!action.trim()) {
    return;
  }
  const userIndex = userList.findIndex((u) => u.id === id);
  const user = userIndex > -1 ? userList[userIndex] : null;
  console.log(userIndex, user);

  if (user) {
    if (action === 'idle') {
      user.transitionList[1]();
    } else if (action === 'clap') {
      user.transitionList[0]();
    }
  }
}

function disposeAvatar(id = '') {
  scene.remove(scene.getObjectByName(id));

  const disposeUserIndex = userList.findIndex((u) => u.id == id);
  if (disposeUserIndex !== -1) {
    userList.splice(disposeUserIndex, 1);
  }
}

function guiInit() {
  if (myObject3D.value) {
    const controlObj = {
      x: myObject3D.value.position.x,
      z: myObject3D.value.position.z,
      clap: function () {
        if (userList.length && userList[0].transitionList) {
          userList[0].transitionList[0]();
          myObject3DAction.value = 'clap';
        }
        useToast().default('clap', {
          duration: 1000,
        });
      },
      idle: function () {
        if (userList.length && userList[0].transitionList) {
          userList[0].transitionList[1]();
          myObject3DAction.value = 'idle';
        }
        useToast().default('idle', {
          duration: 1000,
        });
      },
    };

    const totalFolder = guiRef.value.gui.addFolder('Avatar');
    // place control
    const posFolder = totalFolder.addFolder('Position');
    posFolder.add(controlObj, 'x', -5, 5).onChange((x) => {
      myObject3D.value.position.x = x;
      updateMyObjPos(myObject3D.value.position);
    });
    posFolder.add(controlObj, 'z', -5, 5).onChange((z) => {
      myObject3D.value.position.z = z;
      updateMyObjPos(myObject3D.value.position);
    });
    // animation control
    const aniFolder = totalFolder.addFolder('Animation');
    aniFolder.add(controlObj, 'clap');
    aniFolder.add(controlObj, 'idle');

    aniFolder.open();
    posFolder.open();
    totalFolder.open();
  }
}

async function roomUpdateHandler(roomValue) {
  room.value = roomValue;

  const ownerInfo = await myObject3DInit();

  room.value.send('new-player', {
    id: room.value.sessionId,
    profile: ownerInfo.profile,
    x: myObject3DPosition.x,
    z: myObject3DPosition.z,
  });

  messageInit(room.value, 'joined', (m) => {
    const { newPlayerId = '', players = [] } = m;
    if (room.value.sessionId !== newPlayerId) {
      useToast().success(`${newPlayerId} joined!`);
    }
    if (players?.length) {
      players.forEach(async (player) => {
        createAnotherAvatar(player);
      });
    }
  });

  messageInit(room.value, 'move', (m) => {
    const { id = '', x = 0, z = 0 } = m;
    if (room.value.sessionId !== id) {
      updateAvatarPos(id, x, z);
    }
  });

  messageInit(room.value, 'action', (m) => {
    const { id = '', action = '' } = m;
    console.log(m);
    if (room.value.sessionId !== id) {
      updateAvatarAction(id, action);
    }
  });

  messageInit(room.value, 'left', (m) => {
    const { id = '' } = m;
    useToast().warning(`${id} is left!`);
    disposeAvatar(id);
  });

  guiInit();
}

function mountedHandler() {
  renderer = threeRef.value.renderer;
  scene = threeRef.value.scene;
  camera = threeRef.value.camera;

  camera.position.z = 6;
  camera.position.y = 4;
  camera.lookAt(0, 0, 0);
  createRandomProfile();

  const gridHelper = createGridHelperBase();
  gridHelper.position.y = -0.5;
  scene.add(gridHelper);

  const ambientLight = createLightBase('ambient', {
    color: 0xfffcdc,
    intensity: 2,
  });
  scene.add(ambientLight);
}

function animate() {
  animateTime = requestAnimationFrame(animate);
  if (myObject3D.value) {
    camera.lookAt(myObject3D.value.position);
  }

  userList.forEach((user) => {
    user.mixer.update(0.01);
  });

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
