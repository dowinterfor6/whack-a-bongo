import * as THREE from "three";

// Width, height, depth
const createHole = (width, height, depth, color) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshLambertMaterial( { color } );
  return new THREE.Mesh( geometry, material );
}

export default createHole;