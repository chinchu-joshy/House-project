// <!DOCTYPE html>
// <html lang="en">
// 	<head>
// 		<title>three.js ar - cones</title>
// 		<meta charset="utf-8">
// 		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
// 		<link type="text/css" rel="stylesheet" href="main.css">
// 	</head>
// 	<body>

// 		<div id="info">
// 			<a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> ar - cones<br/>(Chrome Android 81+)
// 		</div>

// 		<!-- Import maps polyfill -->
// 		<!-- Remove this when import maps will be widely supported -->
// 		<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>

// 		<script type="importmap">
// 			{
// 				"imports": {
// 					"three": "../build/three.module.js"
// 				}
// 			}
// 		</script>

// 		<script type="module">

import { ARButton } from "./js/arbutton.js";
import { FBXLoader } from "./js/fbxloader.js";

let camera, scene, renderer;
let controller, textureBase, textureWall, texture, textureRoof, ventTexture;
const fbxLoader = new FBXLoader();

init();
animate();

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  //

  document.body.appendChild(ARButton.createButton(renderer));

  //

  const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(
    Math.PI / 2
  );

  function onSelect() {
    // const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
    // const mesh = new THREE.Mesh( geometry, material );
    // mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
    // mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
    // scene.add( mesh );
    texture = new THREE.TextureLoader().load("Model/walnut-normal.jpg");
    textureWall = new THREE.TextureLoader().load("Model/wall-3.png");
    textureRoof = new THREE.TextureLoader().load("Model/RusticBlack.jpeg");
    textureBase = new THREE.TextureLoader().load("Model/base.jpg");
    ventTexture = new THREE.TextureLoader().load("Model/Venttexture.jpg");
    fbxLoader.load("Model/model-3.fbx", function (object) {
      // (draggable.children[0].material.clippingPlanes = clipPlanes),
      // console.log(draggable)
        object.traverse(function (child) {
          if (child.isMesh && child.name.includes("Shed_SaltBox")) {
            addBottom(child, 0xf0f0f0);
            
          }
          if (child.isMesh && child.name.includes("Trim")) {
            Trim(child);
          }
          if (child.name.includes("Ridge_Cap")) {
            child.visible = false;
          }
          if (child.name.includes("_40_year_Metal_Roofing")) {
            child.visible = false;
          }
          if (child.name.includes("EXTERIOR_OPTIONS")) {
            child.visible = false;
          }
          if (child.name.includes("Shed_SaltBox_10x10_Sidewall")) {
            child.traverse((value) => {
              if (
                value.isMesh &&
                (
                  value.name == "left_side" ||
                  value.name == "back_side" ||
                  value.name == "right_side" ||
                  value.name == "front_side")
              ) {
                sideWall(value);
              }
              if (
                value.name == "left_outline" ||
                value.name == "right_outline" ||
                value.name == "front_outline" ||
                value.name == "back__outline"
              ) {
                value.visible = false;
              }
            });
          }
          if (child.name.includes("Roofing")) {
            child.traverse((value) => {
              if (value.isMesh && value.name?.includes("Archite")) {
                Roof(value);
              }
            });
          }
          if (child.name.includes("Grid")) {
            child.visible = false;
          }
        });


      object.position.set(0, -1, 0);
      console.log("here")
      camera.lookAt(object.position);
      object.scale.set(0.005, 0.005, 0.005);

      scene.add(object);

     
    });
    fbxLoader.load("Model/vent.fbx", (object) => {
     
      object.position.set(0,0,0);
      // object.position.set(13, 49.8, 14);
      object.traverse((child) => {
        if (child.isMesh && child.name.includes("Vent")) {
          // const pass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
          // composer.addPass( pass );
          addVent(child);
        }
      });
      scene.add(object);
     
    });
   
  }

function createVent(){
  fbxLoader.load("Model/vent.fbx", (object) => {
    vent = object;
    models.push(object);
    // window.vent = object.children[0].children[0];
    object.position.set(13, 43.8, 28.5);
    // object.position.set(13, 49.8, 14);
    object.traverse((child) => {
      if (child.isMesh && child.name.includes("Vent")) {
        // const pass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
        // composer.addPass( pass );
        addVent(child);
      }
    });
    scene.add(object);
   
  });
}

  function createDoor() {
    fbxLoader.load("Model/doubleDoor.fbx", (object) => {
      door = object;
      models.push(object);
      object.traverse((door) => {
        window.door = object;
        if (door.isMesh && door.name.includes("ramp")) {
          door.visible = false;
        }
        if (
          door.name.includes("Double__Door") ||
          door.name.includes("Standard_Door") ||
          door.name.includes("DoubleDoor_HingeFrame") ||
          door.parent.name.includes("DoubleDoor_HingeFrame") ||
          door.parent.name.includes("Standard_Door")
        ) {
          // console.log(door);
          door.visible = true;
        } else {
          door.visible = false;
        }
        if (door.name.includes("DoorWood")) {
          door.material = new THREE.MeshStandardMaterial();
          door.material.bumpMap = textureWall;
          //door.material.map = textureWall;
          door.material.bumpScale = 0.4;
          door.material.color = new THREE.Color(0x382c16);
          door.material.bumpMap.needsUpdate = true;
          door.material.needsUpdate = true;
        }
        if (door.name.includes("Trim_side")) {
          door.material = new THREE.MeshPhongMaterial();
          door.material.bumpMap = texture;
          //door.material.map = texture;
          door.material.bumpScale = 0.8;
          door.material.bumpMap.wrapS = THREE.RepeatWrapping;
          door.material.bumpMap.wrapT = THREE.RepeatWrapping;
          door.material.color = new THREE.Color(0xffffff);
          door.material.needsUpdate = true;
        }
        if (door.name.includes("Awning")) {
          door.visible = false;
        }
      });
      object.position.set(7, 17, 29);
      object.scale.set(0.19, 0.19, 0.19);
      object.rotation.y = -Math.PI / 2;
      object.userData.draggable = true;
      scene.add(object);
    });
  }

  /* ----------------------- add the texture dynamically ---------------------- */
  function addBottom(child, color) {
    child.material = new THREE.MeshPhongMaterial();
    child.castShadow = true;
    child.receiveShadow = true;
    child.material.map = textureBase;
    child.material.bumpScale = 0.08;
    child.material.map.wrapS = THREE.RepeatWrapping;
    child.material.map.wrapT = THREE.RepeatWrapping;
    child.material.color = new THREE.Color(color);
    child.userData.draggable = false;
    child.userData.name = "bottom";
  }
  function sideWall(value) {
    value.material = new THREE.MeshStandardMaterial();
    value.material.bumpScale = 0.3;
    value.material.color = new THREE.Color(0x382c16);
    value.material.DoubleSide = true;
    value.material.bumpMap = textureWall;
    value.material.bumpMap.repeat.set(4, 4);
    value.material.bumpMap.wrapS = THREE.RepeatWrapping;
    value.material.bumpMap.wrapT = THREE.RepeatWrapping;
    value.material.bumpMap.needsUpdate = true;
    value.material.needsUpdate = true;
    value.userData.draggable = false;
    value.userData.name = "sidewall";
    value.userData.limit = true;
    // var helper = new THREE.BoundingBoxHelper(value, 0xff0000);
    // scene.add(helper)
  }
  function Trim(child) {
    child.material = new THREE.MeshPhongMaterial();
    child.castShadow = true;
    child.receiveShadow = true;
    child.material.bumpMap = texture;
    child.material.bumpScale = 0.08;
    child.material.bumpMap.wrapS = THREE.RepeatWrapping;
    child.material.bumpMap.wrapT = THREE.RepeatWrapping;
    child.material.color = new THREE.Color(0xffffff);
    child.userData.draggable = false;
    child.userData.name = "trim";
    child.userData.limit = true;
  }
  function Roof(value) {
    value.material = new THREE.MeshPhongMaterial();
    value.material.map = textureRoof;
    value.material.map.wrapS = THREE.RepeatWrapping;
    value.material.map.wrapT = THREE.RepeatWrapping;
    value.material.map.repeat.set(6, 6);
    value.userData.draggable = false;
    value.userData.name = "roof";
    value.userData.limit = true;
  }
  function addVent(child) {
    child.material = new THREE.MeshPhongMaterial();
    child.castShadow = true;
    child.receiveShadow = true;
    child.material.map = ventTexture;
    child.material.map.wrapS = THREE.RepeatWrapping;
    child.material.map.wrapT = THREE.RepeatWrapping;
    child.material.needsUpdate = true;
    child.material.map.needsUpdate = true;
    child.scale.set(0.2, 0.2, 0.2);
    child.rotation.y = Math.PI;
    child.material.color = new THREE.Color(0xffffff);
    child.userData.draggable = true;
    child.userData.name = "vent";
    child.userData.limit = false;
  }
  controller = renderer.xr.getController(0);
  controller.addEventListener("selectstart", onSelect);
  console.log( renderer.xr)
  scene.add(controller);
  //
  window.addEventListener("resize", onWindowResize);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
}
