import * as THREE from "../node_modules/three/build/three.module.js";

// Width, height, depth
// 7*9 = 63, 50, 9*9 = 81
const createBox = (width, height, depth, color) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial( { color } );
  return new THREE.Mesh( geometry, material );
}

export default createBox;