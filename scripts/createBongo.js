import * as THREE from "../node_modules/three/build/three.module.js";

const createBongo = (width, height, depth, color) => {
  // Placeholder
  const geometry = new THREE.BoxGeometry(width, height, depth);
  geometry.bongo = true;
  const material = new THREE.MeshBasicMaterial( { color } );
  return new THREE.Mesh( geometry, material );
}

export default createBongo;