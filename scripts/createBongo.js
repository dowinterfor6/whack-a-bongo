import * as THREE from "three";

const createBongo = (width, height, depth, color) => {
  // Placeholder
  const geometry = new THREE.BoxGeometry(width, height, depth);
  geometry.isBongo = true;
  const material = new THREE.MeshLambertMaterial( { color } );
  return new THREE.Mesh( geometry, material );
}

export default createBongo;