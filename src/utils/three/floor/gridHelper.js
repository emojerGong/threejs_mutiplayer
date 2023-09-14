import * as THREE from "three";

function createGridHelperBase(size = 10, divisions = 10) {
  return new THREE.GridHelper(size, divisions);
}

export { createGridHelperBase };
