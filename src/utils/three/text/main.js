import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { getModelSize } from '../misc/model';

async function createTextSprite() {
  const {
    str = 'Owner',
    color = 0xffffff,
    size = 0.2,
    height = 0.05,
  } = arguments;

  const loader = new FontLoader();
  const font = await loader.loadAsync('3d/fonts/helvetiker_bold.typeface.json');

  const textMaterial = new THREE.MeshBasicMaterial({
    color,
  });

  const textGeometry = new TextGeometry(str, {
    font,
    size: 0.2, // 文本的大小
    height: 0.1, // 文本的厚度
  });

  // 设置文本的位置以使其居中
  textGeometry.computeBoundingBox();
  const fontMesh = new THREE.Mesh(textGeometry, textMaterial);
  const fontSize = getModelSize(fontMesh);
  fontMesh.translateX(-fontSize.x / 2);

  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const edgesGeometry = new THREE.EdgesGeometry(textGeometry);
  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  edges.translateX(-fontSize.x / 2);

  const group = new THREE.Group();
  group.add(fontMesh);
  group.add(edges);
  group.name = 'userName';

  return group;
}

export { createTextSprite };
