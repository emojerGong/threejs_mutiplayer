import * as THREE from 'three';
import { cameraBaseDefault } from './default';

function initBase() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  // 0x000000 0x404449
  scene.background = new THREE.Color(0x404449);
  const camera = new THREE.PerspectiveCamera(
    cameraBaseDefault.fov,
    cameraBaseDefault.aspect,
    cameraBaseDefault.near,
    cameraBaseDefault.far
  );
  scene.add(camera);

  return {
    renderer,
    scene,
    camera,
  };
}

export { initBase };
