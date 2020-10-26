import * as THREE from "three";

const createPlane = (width, height, color) => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const planeMaterial = new THREE.MeshLambertMaterial({ color });
  return new THREE.Mesh( geometry, planeMaterial );
}

export default createPlane;