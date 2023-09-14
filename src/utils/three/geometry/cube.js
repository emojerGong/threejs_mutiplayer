import * as THREE from "three";

function createCubeBase(x = 0, y = 0, z = 0, size = 1, color = 0x00ff00) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);

  return cube;
}

export { createCubeBase };
