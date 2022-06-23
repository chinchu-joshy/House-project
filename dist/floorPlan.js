
import { ARButton } from './js/arbutton.js';
let camera,
  scene,
  renderer,
  light,
  clock,
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
