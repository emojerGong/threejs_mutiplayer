import * as THREE from 'three';

import { useToast } from 'vue-toast-notification';

class lightOptions extends THREE.Light {
  constructor() {
    this.distance = 0;
    this.decay = 2;
    this.angle = Math.PI / 3;
    this.penumbra = 0;
  }
}

function createLightBase(type = '', options = new lightOptions()) {
  console.log(options);
  switch (type) {
    case 'ambient':
      return new THREE.AmbientLight(options.color, options.intensity);
    case 'directional':
      return new THREE.DirectionalLight(options.color, options.intensity);
    case 'point':
      return new THREE.PointLight(
        options.color,
        options.intensity,
        options.distance,
        options.decay
      );
    case 'spot':
      return new THREE.SpotLight(
        options.color,
        options.intensity,
        options.distance,
        options.angle,
        options.penumbra,
        options.decay
      );
    default:
      useToast().error('NO LIGHT TYPE! ');
      return null;
  }
}

export { createLightBase };
