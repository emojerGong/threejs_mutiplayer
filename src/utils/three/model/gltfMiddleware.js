import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { useToast } from 'vue-toast-notification';
import { modelPath } from './static';

async function loadModelBaseAsync(fileFullName = '') {
  try {
    if (!fileFullName.trim()) {
      throw Error('CANT GET THE FILEFULLNAME!');
    }
    const loader = new GLTFLoader();
    loader.setPath(modelPath);

    const response = await loader.loadAsync(fileFullName);

    return response;
  } catch (error) {
    useToast().error('GLTF LOAD ERROR! SEE CONSOLE!', {
      duration: 2000,
    });
    console.error(error);
  }
}

export { loadModelBaseAsync };
