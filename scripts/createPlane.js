import * as THREE from "../node_modules/three/build/three.module.js";

const createPlane = (width, height, color) => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const planeMaterial = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh( geometry, planeMaterial );
}

export default createPlane;