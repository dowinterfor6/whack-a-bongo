import * as THREE from "three";

const createChicken = (width, height, depth, color) => {
  // Placeholder
  const geometry = new THREE.BoxGeometry(width, height, depth);
  geometry.isChicken = true;
  const material = new THREE.MeshLambertMaterial( { color, transparent: true } );
  return new THREE.Mesh( geometry, material );
}

export default createChicken;