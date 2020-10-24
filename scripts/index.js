import * as THREE from "../node_modules/three/build/three.module.js";
import createBox from "./createBox.js";
import createHole from "./createHole.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper );

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

const box = createBox(boxDimensions.x, boxDimensions.height, boxDimensions.y, 0x191919);
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

let holeUuids = [];

xyPos.forEach(({ x, z }) => {
  const hole = createHole(holeLength, 1, holeLength, 0xffffff);
  hole.position.set(x, boxDimensions.height / 2 + boxCenter.y + 1, z);
  holeUuids.push(hole.uuid);
  scene.add( hole );
})

document.addEventListener("click", 
  (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach(({ object }) => {
      if (holeUuids.includes(object.uuid)) {
        object.material.color.setHex(0x00ff00);
        window.setTimeout(() => {
          object.material.color.setHex(0xffffff);
        }, 300);
      }
    })
  }
)

camera.position.set(0, 125, 25);
// camera.position.set(0, 75, 50);
camera.lookAt(0, 0, boxCenter.z);

function animate() {
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();