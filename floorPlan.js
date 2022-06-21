import { FBXLoader } from "/js/fbxloader.js";
import CameraControls from "./js/camera-controls.module.js";
import { EffectComposer } from "/js/EffectComposer.js";
import { RenderPass } from "/js/RenderPass.js";
import { GlitchPass } from "/js/GlitchPass.js";
import { OutlinePass } from "/js/OutlinePass.js";
import { SMAAPass } from "/js/SMAAPass.js";
import { test ,trimColor,doorType} from "./helo.js";
import { ARButton } from '/js/arbutton.js';
let camera,

  scene,
  renderer,
  light,
  clock,
  cameraControls,
  textureBase,
  textureWall,
  texture,
  textureRoof,
  ventTexture,
  found,
  startpoint,
  mouse3D,
  intersects,
  xPosition,
  yPosition,
  composer,
  outlinePass,
  selectedObjects,
  bbox,
  bbox2,
  mousemove,
  mainpoint,
  endpoint,
  endpointLeft,
  startpointLeft,
  endpointBottomRight,
  startpointBottomRight,
  endpointBottomLeft,
  startpointBottomLeft,
  intersectPoint,
  obj,
  saltbox,
  vent,
  door,
  collision = false,
  frontChildren,
  backChildren;
/* -------------------------------- constants ------------------------------- */
const canvas = document.querySelector("canvas.webgl");


/* ----------------------------- clipping plane ----------------------------- */





init();
animate();
function init() {
 
  /* ---------------------------------- scene --------------------------------- */
  const BACKGROUND_COLOR = 0xf1f1f1;
  scene = new THREE.Scene();
 
  /* --------------------------------- camera --------------------------------- */
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 10);
  /* --------------------------------- render --------------------------------- */
  renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
   
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.localClippingEnabled = true;
  renderer.xr.enabled=true
 
  // document.body.appendChild(renderer.domElement);

//   var dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
//   dirLight.position.set(90, 30, 0);
//   dirLight.castShadow = true;
//   dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

//   var ambient = new THREE.AmbientLight(0xffffff, 0.8);
//   scene.add(ambient);
//   var dirLightright = new THREE.DirectionalLight(0xffffff, 0.5);
//   dirLightright.position.set(8, 4, -12);
//   dirLightright.castShadow = true;
//   dirLightright.shadow.mapSize = new THREE.Vector2(1024, 1024);
//   scene.add(dirLightright);
//   light = new THREE.PointLight(0xffffff, 0.9, 100);
//   light.position.set(-10, 10, 92);
//   const light2 = new THREE.PointLight(0xffffff, 0.9, 100);
//   light2.position.set(20, 10, 92);
//   scene.add(light2);
//   scene.add(light);
//   const sphereSize = 1;
//   const pointLightHelper = new THREE.PointLightHelper(
//     light,
//     sphereSize,
//     0xfff000
//   );
//   scene.add(pointLightHelper);
//   const pointLightHelper2 = new THREE.PointLightHelper(
//     light2,
//     sphereSize,
//     0xfff000
//   );
//   scene.add(pointLightHelper2);
  
  /* ---------------------------- post proccessing ---------------------------- */
//   composer = new EffectComposer(renderer);
//   const renderPass = new RenderPass(scene, camera);
//   composer.addPass(renderPass);
//   const glitchPass = new GlitchPass();
//   outlinePass = new OutlinePass(
//     new THREE.Vector2(window.innerWidth, window.innerHeight),
//     scene,
//     camera
//   );
//   composer.addPass(outlinePass);
//   const pass = new SMAAPass(
//     window.innerWidth * renderer.getPixelRatio(),
//     window.innerHeight * renderer.getPixelRatio()
//   );
//   composer.addPass(pass);
  /* ----------------------------- camera controls ---------------------------- */
//   CameraControls.install({ THREE: THREE });
  clock = new THREE.Clock();
//   cameraControls = new CameraControls(camera, renderer.domElement);
 
  /* ------------------------ adding model to the scene  */
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
document.body.appendChild( ARButton.createButton( renderer) );
 console.log(renderer.xr)
}


/* --------------------------- drawing an outline --------------------------- */

/* --------------------------------- animate -------------------------------- */
function animate() {
  
 
    renderer.setAnimationLoop( function () {

        renderer.render( scene, camera );
    
    } );
 
}
