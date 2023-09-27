import { useToast } from 'vue-toast-notification';
import * as THREE from 'three';

function modelAction(actionClip, model, isLoop = false, speed = 1) {
  if (!actionClip) {
    useToast().error('modelAction: actionClip error or null! ');
    return;
  }

  if (!model || model?.isObject3D !== true) {
    useToast().error('modelAction: not model! ');
    return;
  }

  const mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(actionClip);

  action.clampWhenFinished = true;
  action.startAt(0); // 設置動畫起始時間
  action.setEffectiveTimeScale(speed); // 可選，設置動畫速度
  action.setLoop(isLoop ? THREE.LoopRepeat : THREE.LoopOnce); // 可選，設置循環方式
  action.play();
}

function activateAllActions(params) {}

function actionPlay(mixer = new THREE.AnimationMixer(), action) {}

function setWeight(action, weight) {
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(weight);
}

export { modelAction, setWeight };
