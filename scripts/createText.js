import * as THREE from "three";

const createText = (text, font, size, height, color) => {
  const geometry = new THREE.TextGeometry( text, {
		font,
		size,
		height,
		curveSegments: 12,
		bevelEnabled: false,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
  } );
  geometry.center();
  geometry.text = text;
  const material = new THREE.MeshLambertMaterial( { color } );
  return new THREE.Mesh(geometry, material);
}

export default createText;