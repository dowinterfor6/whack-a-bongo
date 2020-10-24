import * as THREE from "../node_modules/three/build/three.module.js";

// Width, height, depth
const createHole = (width, height, depth, color) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial( { color } );
  return new THREE.Mesh( geometry, material );
}

export default createHole;