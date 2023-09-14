function resizeCamera(camera, w, h) {
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function resizeRenderer(renderer, w, h) {
  renderer.setSize(w, h);
}

export { resizeCamera, resizeRenderer };
