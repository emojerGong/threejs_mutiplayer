import * as THREE from 'three';

function getModelSize(model) {
  const boundingBox = new THREE.Box3();

  // 计算模型的包围盒
  boundingBox.setFromObject(model);

  // 获取包围盒的尺寸
  const size = new THREE.Vector3();
  boundingBox.getSize(size);

  return size;
}

function getModelWorldSize(model) {}

export { getModelSize };
