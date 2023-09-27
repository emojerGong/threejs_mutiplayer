import {
  AvatarTypeList,
  AvatarObjectList,
  AvatarObjectFlattenList,
} from './profileRelated';
import { loadModelBaseAsync } from '../three/model/gltfMiddleware';

import { setWeight } from '../three/control/mixer';

import * as THREE from 'three';
import _ from 'lodash';

class Profile {
  constructor(gender, clothType) {
    AvatarTypeList.forEach((t) => {
      if (t === 'gender' && gender) {
        this[t] = gender;
      } else if (t === 'clothType' && clothType) {
        this[t] = clothType;
      } else {
        this[t] = '';
      }
    });
  }
}

function createRandomGenderAndClothType() {
  const gender =
    AvatarObjectList.genderObjects[
      _.random(0, AvatarObjectList.genderObjects - 1, false)
    ].name;
  let clothType = null;
  if (gender === 'male') {
    clothType = AvatarObjectList.clothTypeObjects[1].name;
  } else {
    clothType =
      AvatarObjectList.clothTypeObjects[
        _.random(0, AvatarObjectList.clothTypeObjects - 1, false)
      ].name;
  }

  return {
    gender,
    clothType,
  };
}

function createRandomProfile() {
  const { gender, clothType } = createRandomGenderAndClothType();
  const p = new Profile(gender, clothType);

  AvatarTypeList.forEach((t) => {
    if (t === 'gender' || t === 'clothType') {
      return;
    }
    let item;
    if (t === 'hair') {
      item =
        p.gender === 'male'
          ? AvatarObjectList.maleHairObjects
          : AvatarObjectList.femaleHairObjects;
    } else if (t === 'cloth') {
      if (p.gender === 'male') {
        item = AvatarObjectList.maleUpperClothObjects;
      } else {
        item =
          p.clothType === 'full'
            ? AvatarObjectList.femaleFullClothObjects
            : AvatarObjectList.femaleUpperClothObjects;
      }
    } else {
      item = AvatarObjectList[`${t}Objects`];
    }
    p[t] = item[_.random(0, item.length - 1, false)].name;
  });
  return p;
}

async function loadModelBaseAsync_AvatarTest(profile) {
  if (!profile) {
    profile = createRandomProfile();
  }
  const displayList = _.values(profile);
  const response = await loadModelBaseAsync('Avatar.glb');
  // console.log(response.animations);
  const model = response.scene;
  const mixer = new THREE.AnimationMixer(model);

  const actions = [
    mixer.clipAction(response.animations[6]), // idle
    mixer.clipAction(response.animations[8]), // clap
  ];

  actions.forEach((action, index) => {
    if (index === 0) {
      setWeight(action, 1);
    } else {
      setWeight(action, 0);
    }
    action.play();
  });

  function idleToClap() {
    setWeight(actions[0], 0);
    setWeight(actions[1], 1);
  }

  function clapToIdle() {
    setWeight(actions[0], 1);
    setWeight(actions[1], 0);
  }

  const transitionList = [idleToClap, clapToIdle];

  //DeformationSystem
  AvatarObjectFlattenList.forEach((item) => {
    const itemMesh = model.getObjectByName(item.name);
    if (!displayList.includes(item.name) && itemMesh) {
      itemMesh.visible = false;
    }
  });

  return { profile, model, mixer, transitionList };
}

export { createRandomProfile, loadModelBaseAsync_AvatarTest };
