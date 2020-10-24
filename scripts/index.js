import * as THREE from "../node_modules/three/build/three.module.js";
import createBox from "./createBox.js";
import createHole from "./createHole.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper );

// 23*3 = 69, 50, 23*3 = 69

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Whack a bongo table
const boxDimensions = {
  height: 50,
  x: 100,
  y: 100
}
const boxCenter = {
  x: 0,
  y: boxDimensions.height / 2,
  z: -boxDimensions.y / 2
}

const box = createBox(boxDimensions.x, boxDimensions.height, boxDimensions.y, 0x00ff00);
box.position.set(0, boxCenter.y, boxCenter.z);
scene.add( box );

// bongo holes, x padding 3 each side, y padding 16 each side
// boxwidth/height - width/height * 3
const holeLength = 23;
const offset = 3;

const xyPos = [
  { x: boxCenter.x - holeLength - offset, z: boxCenter.z + holeLength + offset}, { x: boxCenter.x, z: boxCenter.z + holeLength + offset}, { x: boxCenter.x + holeLength + offset, z: boxCenter.z + holeLength + offset},
  { x: boxCenter.x - holeLength - offset, z: boxCenter.z}, { x: boxCenter.x, z: boxCenter.z}, { x: boxCenter.x + holeLength + offset, z: boxCenter.z},
  { x: boxCenter.x - holeLength - offset, z: boxCenter.z - holeLength - offset}, { x: boxCenter.x, z: boxCenter.z - holeLength - offset}, { x: boxCenter.x + holeLength + offset, z: boxCenter.z - holeLength - offset}
]

xyPos.forEach(({ x, z }) => {
  const hole = createHole(holeLength, 1, holeLength, 0xffffff);
  hole.position.set(x, boxDimensions.height / 2 + boxCenter.y + 1, z);
  scene.add( hole );
})

camera.position.set(0, 125, 25);
// camera.position.set(0, 75, 50);
camera.lookAt(0, 0, boxCenter.z);

function animate() {
  requestAnimationFrame( animate );
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();