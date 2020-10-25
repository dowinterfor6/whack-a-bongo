import * as THREE from "../node_modules/three/build/three.module.js";
import createBongo from "./createBongo.js";
import createBox from "./createBox.js";
import createHole from "./createHole.js";
import createPlane from "./createPlane.js";
import createText from "./createText.js";
import toggleBongo from "./toggleBongo.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const manager = new THREE.LoadingManager();
const fontLoader = new THREE.FontLoader(manager);

const axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Floor
const floor = createPlane(750, 750, 0xffffff);
floor.rotateX(-(Math.PI / 2));
scene.add(floor);

// Whack a bongo table
// This is so confusing lol
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

// Score/display
const scoreBoxZ = 50;
const scoreBox = createBox(boxDimensions.x, boxDimensions.height, scoreBoxZ, 0xffff00);
scoreBox.position.set(0, boxCenter.y, boxCenter.z - scoreBoxZ - (scoreBoxZ / 2));
scene.add(scoreBox);

let helveticaFont;
fontLoader.load( 'fonts/helvetiker_regular.typeface.json', (res) => {
  helveticaFont = res;
});

// Use manager to start game after loaded
let scoreText;
manager.onLoad = function () {
  console.log("Loaded");
  scoreText = createText("0", helveticaFont, 24, 1, 0x111111);
  // scoreText.position.set(0, boxCenter.y + 10, boxCenter.z - boxDimensions.y);
  scoreText.position.set(0, boxDimensions.height, -boxDimensions.y - scoreBoxZ / 2);
  scoreText.rotateX(-(Math.PI / 2));
  scene.add(scoreText);

  // Game start
  animate();
}


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
  scene.add(hole);
});

// Bongos
const bongoUuids = [];
const bongos = [];
const bongoDimensions = { w: 15, h: 15, d: 15 };
const travelDist = bongoDimensions.h / 2;

xyPos.forEach(({ x, z }) => {
  const bongo = createBongo(bongoDimensions.w, bongoDimensions.h, bongoDimensions.d, 0x00ff00);
  bongo.position.set(x, boxDimensions.height / 2 + boxCenter.y + 1 - travelDist, z);
  bongoUuids.push(bongo.uuid);
  bongos.push(bongo);
  scene.add(bongo);
})

document.addEventListener("click", 
  (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    // Change to first intersect
    // intersects.forEach(({ object }) => {
    const { object } = intersects[0];
      // if (bongoUuids.includes(object.uuid)) {
      if (object.geometry.bongo) {
        // Get existing score, parseint + 1, make new score
        const oldScore = parseInt(scoreText.geometry.text);
        scene.remove(scoreText);
        incrementScore(oldScore);
        object.material.color.setHex(0x00ffff);
        window.setTimeout(() => {
          object.material.color.setHex(0x00ff00);
        }, 300);
      }
    // })
  }
)

// camera.position.set(0, 125, 25);
camera.position.set(0, 200, 25);
camera.lookAt(0, 0, boxCenter.z);

const activeBongo = [];
const popUpTime = 1000;

function animate() {
  const rand = Math.round(Math.random() * 1000);
  if (rand % 100 === 0) {
    let randIdx = Math.round(Math.random() * (bongos.length - 1));
    while (activeBongo.includes(randIdx)) {
      randIdx = Math.round(Math.random() * (bongos.length - 1));
    }
    const randBongo = bongos[randIdx];

    activeBongo.push(randIdx);
    window.setTimeout(() => {
      activeBongo.shift();
    }, popUpTime);

    toggleBongo(randBongo, travelDist, popUpTime);
  };

  requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function incrementScore(oldScore) {
  scoreText = createText(`${oldScore + 1}`, helveticaFont, 24, 1, 0x111111);
  scoreText.position.set(0, boxDimensions.height, -boxDimensions.y - scoreBoxZ / 2);
  scoreText.rotateX(-(Math.PI / 2));
  scene.add(scoreText);
}