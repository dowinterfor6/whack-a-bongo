import * as THREE from "three";
import createBongo from "./createBongo.js";
import createText from "./createText.js";
import toggleBongo from "./toggleBongo.js";
import { gsap } from "gsap";
import createChicken from "./createChicken.js";
import toggleChicken from "./toggleChicken.js";
import GLTFLoader from 'three-gltf-loader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const manager = new THREE.LoadingManager();
const fontLoader = new THREE.FontLoader(manager);
const textureLoader = new THREE.TextureLoader();
const modelLoader = new GLTFLoader(manager);

// const axesHelper = new THREE.AxesHelper( 100 );
// scene.add( axesHelper );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor("#e5e5e5");
document.body.appendChild( renderer.domElement );


window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
})

const light = new THREE.PointLight(0xffffff, 5, 500);
// Same as camera?
light.position.set(0, 200, 25);
scene.add(light);

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

// Whack a bongo table dimensions
// height is actually y, y is z
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

let helveticaFont;
fontLoader.load( 'fonts/helvetiker_regular.typeface.json', (res) => {
  helveticaFont = res;
});

// Use manager to start game after loaded
let scoreText;
let gameRestartText;
let chickenTexts = [];
const scoreTextFontSize = 14;
const scoreTextColor = 0xffffff;
const scoreTextSize = 1;
const chickensOffset = 25;
const chickensX = [-chickensOffset, 0, chickensOffset];

// Mallet
let mallet;
modelLoader.load("assets/blender/mallet.glb", (malletScene) => {
  mallet = malletScene.scene.children.filter(({userData}) => userData.name === "Mallet Head")[0];
  mallet.geometry.isMouse = true;
})

let machineModel;
modelLoader.load("assets/blender/WhackAMoleMachine.glb", (machineScene) => {
  machineModel = machineScene.scene.children.filter(({userData}) => userData.name === "WhackAMoleMachine")[0];
  machineModel.position.set(0, boxCenter.y, boxCenter.z);
  machineModel.scale.set(100, 47.5, 100);
  scene.add(machineModel);
})

manager.onLoad = function () {
  // Title
  const titleText = createText("Whack-a-Bongo", helveticaFont, 9, 1, 0xffffff);
  titleText.position.set(0, boxDimensions.height + 52, -boxDimensions.y);
  scene.add(titleText);

  // Score
  scoreText = createText("0", helveticaFont, scoreTextFontSize, scoreTextSize, scoreTextColor);
  scoreText.position.set(0, boxDimensions.height + 32.5, -boxDimensions.y);
  scene.add(scoreText);

  // BongoCats
  const catsXOffset = 34;

  const leftBongoCatGeometry = new THREE.PlaneGeometry(50, 50);
  const leftBongoCatMaterial = new THREE.MeshLambertMaterial({
    map: textureLoader.load('assets/images/bongoCatPawUp.png'),
    transparent: true
  });
  const leftBongoCat = new THREE.Mesh(leftBongoCatGeometry, leftBongoCatMaterial);
  leftBongoCat.position.set(-catsXOffset, boxDimensions.height + 32.5, -boxDimensions.y + 2);
  scene.add(leftBongoCat);

  const rightBongoCatGeometry = new THREE.PlaneGeometry(50, 50);
  const rightBongoCatMaterial = new THREE.MeshLambertMaterial({
    map: textureLoader.load('assets/images/bongoCatPawDown.png'),
    transparent: true
  });
  const rightBongoCat = new THREE.Mesh(rightBongoCatGeometry, rightBongoCatMaterial);
  rightBongoCat.position.set(catsXOffset, boxDimensions.height + 32.5, -boxDimensions.y + 2);
  scene.add(rightBongoCat);

  // Chickens
  const chickenSteppedOnGeometry = new THREE.PlaneGeometry(20, 20);
  const chickenSteppedOnMaterial = new THREE.MeshLambertMaterial({
    map: textureLoader.load('assets/images/chickenSteppedOn.png'),
    transparent: true
  });

  for (const chickenX of chickensX) {
    const chickenSteppedOn = new THREE.Mesh(chickenSteppedOnGeometry, chickenSteppedOnMaterial);
    chickenSteppedOn.position.set(chickenX, boxDimensions.height + 12.5, -boxDimensions.y - 2);
    chickenTexts.push(chickenSteppedOn);
  }

  chickenTexts.forEach((chicken) => {
    scene.add(chicken);
  })

  // Game over text
  gameRestartText = createText("Game over!", helveticaFont, 10, scoreTextSize, scoreTextColor);
  gameRestartText.position.set(0, boxDimensions.height + 12.5, -boxDimensions.y - 2);
  scene.add(gameRestartText);

  // Attach event listener for click
  attachClickEventListener();

  // Game start
  animate();
}

const holeLength = 23;
const offset = 3;

const xyPos = [
  { x: boxCenter.x - holeLength - offset, z: boxCenter.z + holeLength + offset}, { x: boxCenter.x, z: boxCenter.z + holeLength + offset}, { x: boxCenter.x + holeLength + offset, z: boxCenter.z + holeLength + offset},
  { x: boxCenter.x - holeLength - offset, z: boxCenter.z}, { x: boxCenter.x, z: boxCenter.z}, { x: boxCenter.x + holeLength + offset, z: boxCenter.z},
  { x: boxCenter.x - holeLength - offset, z: boxCenter.z - holeLength - offset}, { x: boxCenter.x, z: boxCenter.z - holeLength - offset}, { x: boxCenter.x + holeLength + offset, z: boxCenter.z - holeLength - offset}
]

// Bongos
const bongos = [];
const bongoDimensions = { w: 13, h: 13, d: 13 };
const travelDist = bongoDimensions.h;

xyPos.forEach(({ x, z }) => {
  const bongo = createBongo(bongoDimensions.w, bongoDimensions.h, bongoDimensions.d, 0x00ff00);
  bongo.position.set(x, boxDimensions.height / 2 + boxCenter.y + 1 - travelDist, z);
  bongo.material.opacity = 0;
  bongos.push(bongo);
  scene.add(bongo);
})

// Chickens
const chickens = [];
const chickenDimensions = { w: 13, h: 13, d: 13 };

xyPos.forEach(({ x, z }) => {
  const chicken = createChicken(chickenDimensions.w, chickenDimensions.h, chickenDimensions.d, 0xff1111);
  chicken.position.set(x, boxDimensions.height / 2 + boxCenter.y + 1 - travelDist, z);
  chicken.material.opacity = 0;
  chickens.push(chicken);
  scene.add(chicken);
})

// Camera
// camera.position.set(0, 125, 25);
camera.position.set(0, 140, 20);
// camera.lookAt(0, 0, boxCenter.z);
camera.lookAt(0, boxDimensions.height - 5, -boxDimensions.y + 25);

const popUpTime = 750;
let state = {
  activeGame: false,
  prepareGame: true,
  chickensHit: 0
}

function animate() {

  if (state.activeGame) {
    // Game over condition
    if (state.chickensHit === 3) {
      state.activeGame = false;
      state.prepareGame = true;
      displayGameOver();
    } else {
      activateBongo();
      activateChicken();
    }
  } else if (state.prepareGame) {
    resetChickens();
    placeStarterBongo();
    state.prepareGame = false;
  }

  requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function placeStarterBongo() { 
  const bongo = bongos[Math.floor(bongos.length / 2)];
  bongo.geometry.startingBongo = true;
  const { x, y, z } = bongo.position;
  const animDuration = 0.5;
  const initY = boxDimensions.height / 2 + boxCenter.y + 1 - travelDist;

  bongo.position.setY(initY);

  gsap.to(bongo.position, {
    duration: animDuration,
    y: y + travelDist,
    ease: "expo.out"
  }).delay(1);

  gsap.to(bongo.material, {
    duration: animDuration,
    opacity: 1,
    ease: "expo.out"
  }).delay(1);
}

let activeHoleIdx = [];

function activateBongo() {
  const rand = Math.round(Math.random() * 1000);
  if (rand % 200 === 0) {
    let randIdx = Math.round(Math.random() * (bongos.length - 1));
    while (activeHoleIdx.includes(randIdx)) {
      randIdx = Math.round(Math.random() * (bongos.length - 1));
    }
    const randBongo = bongos[randIdx];

    activeHoleIdx.push(randIdx);
    window.setTimeout(() => {
      activeHoleIdx.shift();
    }, popUpTime + 1000); // Buffer time between popup

    toggleBongo(randBongo, travelDist, popUpTime);
  };
}

function activateChicken() {
  const rand = Math.round(Math.random() * 1000);
  if (rand % 400 === 0) {
    let randIdx = Math.round(Math.random() * (chickens.length - 1));
    while (activeHoleIdx.includes(randIdx)) {
      randIdx = Math.round(Math.random() * (chickens.length - 1));
    }
    const randChicken = chickens[randIdx];

    activeHoleIdx.push(randIdx);
    window.setTimeout(() => {
      activeHoleIdx.shift();
    }, popUpTime + 1000); // Buffer time between popup

    toggleChicken(randChicken, travelDist, popUpTime);
  };
}

function incrementScore(oldScore) {
  scoreText = createText(`${oldScore + 1}`, helveticaFont, scoreTextFontSize, scoreTextSize, scoreTextColor);
  scoreText.position.set(0, boxDimensions.height + 32.5, -boxDimensions.y);
  scene.add(scoreText);
}

function displayGameOver() {
  gameRestartText.position.set(0, boxDimensions.height + 12.5, -boxDimensions.y);
}

function resetGameOver() {
  gameRestartText.position.set(0, boxDimensions.height + 12.5, -boxDimensions.y - 2);
}

function resetChickens() {
  chickenTexts.forEach((chicken, idx) => {
    let x = chickensX[idx];
    chicken.position.set(x, boxDimensions.height + 12.5, -boxDimensions.y - 2);
  });

  state.chickensHit = 0;
}

function resetScore() {
  scene.remove(scoreText);
  // Probably find a way to refactor this
  scoreText = createText("0", helveticaFont, scoreTextFontSize, scoreTextSize, scoreTextColor);
  scoreText.position.set(0, boxDimensions.height + 32.5, -boxDimensions.y);
  scene.add(scoreText);
}

function attachClickEventListener() {
  // Hammer, maybe make this with JS/CSS/HTML instead
  // const hammerGeometry = new THREE.PlaneGeometry(25, 25);
  // const hammerUpMaterial = new THREE.MeshLambertMaterial({
  //   map: textureLoader.load("assets/images/hammerUp.png"),
  //   transparent: true
  // });
  // const hammerDownMaterial = new THREE.MeshLambertMaterial({
  //   map: textureLoader.load("assets/images/hammerDown.png"),
  //   transparent: true
  // });

  // const mouseUpMesh = new THREE.Mesh(hammerGeometry, hammerUpMaterial);
  // const mouseDownMesh = new THREE.Mesh(hammerGeometry, hammerDownMaterial);
  // mouseDownMesh.material.opacity = 0;

  // mouseUpMesh.geometry.isMouse = true;
  // mouseDownMesh.geometry.isMouse = true;

  // scene.add(mouseUpMesh);
  // scene.add(mouseDownMesh);
  scene.add(mallet);
  mallet.scale.set(50, 50, 50);
  mallet.rotateX(Math.PI / 8);
  mallet.rotateY(-3 * Math.PI / 16);
  mallet.rotateZ(-Math.PI / 8);

  document.addEventListener("mousedown", () => {
    // mouseUpMesh.material.opacity = 0;
    // mouseDownMesh.material.opacity = 1;
  })

  document.addEventListener("mouseup", () => {
    // mouseUpMesh.material.opacity = 1;
    // mouseDownMesh.material.opacity = 0;
  })

  document.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    
    // Make it locked to zx plane
    // Window plane, e.g. yx plane
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0);
    // console.log("vector: ", vector);
    // Position of vector in the world
    // Use known camera position vector (position and look at)
    vector.unproject( camera );
    // console.log("vector (unproject): ", vector);
    const dir = vector.sub( camera.position ).normalize();
    const distance = - camera.position.z / dir.z;
    let pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
    // pos.y = 80;
    mallet.position.copy(pos);
    // mouseDownMesh.position.copy(pos);
  })

  document.addEventListener("click", 
    (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // const intersects = raycaster.intersectObject(scene.children);
      const intersects = raycaster.intersectObjects(scene.children).filter((intersect) => !intersect.object.geometry.isMouse);
      if (intersects.length > 0) {
        const { object } = intersects[0];
        if (object.geometry.isBongo && !object.geometry.isHit && !object.geometry.startingBongo) {
          object.geometry.isHit = true;
          // Get existing score, parseint + 1, make new score
          const oldScore = parseInt(scoreText.geometry.text);
          scene.remove(scoreText);
          incrementScore(oldScore);
          object.material.color.setHex(0x00ffff);
          window.setTimeout(() => {
            object.material.color.setHex(0x00ff00);
          }, 300);
        } else if (object.geometry.isChicken && !object.geometry.isHit && !object.geometry.startingBongo) {
          object.geometry.isHit = true;
          // Handle lose condition
          state.chickensHit = state.chickensHit + 1;
          
          chickenTexts[state.chickensHit - 1].position.setZ(chickenTexts[state.chickensHit - 1].position.z + 4);

          object.material.color.setHex(0xff0000);
          window.setTimeout(() => {
            object.material.color.setHex(0xff1111);
          }, 300);
        } else if(object.geometry.isBongo && object.geometry.startingBongo) {
          object.geometry.isHit = true;
          object.geometry.startingBongo = false;
          const { x, y, z } = object.position;
          const animDuration = 0.5;

          object.material.color.setHex(0x00ffff);
          window.setTimeout(() => {
            object.material.color.setHex(0x00ff00);
          }, 300);

          gsap.to(object.position, {
            duration: animDuration,
            y: y - travelDist,
            ease: "expo.out"
          });

          gsap.to(object.material, {
            duration: animDuration,
            opacity: 0,
            ease: "expo.out"
          });

          resetScore();
          resetGameOver();

          // Short delay before starting game
          window.setTimeout(() => {
            state.activeGame = true;
          }, 750)
        }
      }
    }
  )
}