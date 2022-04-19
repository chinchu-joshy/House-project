// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { FBXLoader } from "/js/fbxloader.js";

import { EffectComposer } from "/js/EffectComposer.js";
import { RenderPass } from "/js/RenderPass.js";
import { GlitchPass } from "/js/GlitchPass.js";
import { OutlinePass } from "/js/OutlinePass.js";


let scene, camera, renderer, cube, composer;

init();
animate();
const controls = new THREE.OrbitControls(camera, renderer.domElement);
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGL1Renderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const line = new THREE.Line(geometry, material);
  // scene.add(line)
  const light = new THREE.AmbientLight(0xffff0f, 0.4);
  scene.add(light);

  composer = new EffectComposer(renderer);
  console.log(composer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const glitchPass = new GlitchPass();
//   composer.addPass(glitchPass);

  const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
				// composer.addPass( outlinePass );
                console.log(outlinePass)
  /* --------------------------- adding the post proccessing --------------------------- */

  // const composer = new EffectComposer( renderer );

  /* ------------------------------ box geometry ------------------------------ */
  const box = new THREE.Box3();

  const boxmesh = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial()
  );

  // ensure the bounding box is computed for its geometry
  // this should be done only once (assuming static geometries)
  boxmesh.geometry.computeBoundingBox();

  // ...

  // in the animation loop, compute the current bounding box with the world matrix
  box.copy(boxmesh.geometry.boundingBox).applyMatrix4(boxmesh.matrixWorld);

  // scene.add(boxmesh)

  const fbxLoader = new FBXLoader();
  fbxLoader.load("Model/cottage_fbx.fbx", function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        
        child.castShadow = true;
        child.receiveShadow = false;
        child.flatshading = true;
      }
    });
console.log(object)
    object.scale.set(0.01, 0.01, 0.01);
    var bbox = new THREE.Box3().setFromObject(object);

    var helper = new THREE.BoundingBoxHelper(object, 0xff0000);
    helper.update();
    var frame = new THREE.Shape();
    frame.moveTo(bbox.min.x, bbox.min.y);
    frame.lineTo(bbox.max.x, bbox.min.y);
    frame.lineTo(bbox.max.x, bbox.max.y);
    frame.lineTo(bbox.min.x, bbox.max.y);
    var hole = new THREE.Path();
    hole.moveTo(bbox.min.x + 2, bbox.min.y + 2);
    hole.lineTo(bbox.max.x - 2, bbox.min.y + 2);
    hole.lineTo(bbox.max.x - 2, bbox.max.y - 2);
    hole.lineTo(bbox.min.x + 2, bbox.max.y - 2);
    frame.holes.push(hole);
    var extrudeSettings = {
      steps: 1,
      depth: 1,
      bevelEnabled: false,
    };
    var geom = new THREE.ExtrudeGeometry(frame, extrudeSettings);
    var mesh = new THREE.Mesh(
      geom,
      new THREE.MeshPhongMaterial({ color: 0xffaaaa })
    );
    mesh.position.set(0, 0, bbox.max.z - 2);

    scene.add(mesh);
    scene.add(helper);
    scene.add(object);
  });

  // var geometry_Y = new THREE.BoxBufferGeometry( 1.5, 1.5, 0.99 );
  var geometry_A = new THREE.BoxBufferGeometry(0.7, 0.7, 0.7);
  // geometry_A.translate( 0.5, 0.5, 0 );

  // var bsp_A = new ThreeBSP(geometry_A);
  // var bsp_Y = new ThreeBSP(geometry_Y);

  // var bsp_YsubA = bsp_Y.subtract(bsp_A);
  // var bsp_mesh = bsp_YsubA.toMesh();
  // bsp_mesh.material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );

  // scene.add( bsp_mesh );

  var frame = new THREE.Shape();

  frame.moveTo(-4, -3);
  frame.lineTo(4, -3);
  frame.lineTo(4, 3);
  frame.lineTo(-4, 3);

  //..with a hole:
  var hole = new THREE.Path();
  hole.moveTo(-3, -2);
  hole.lineTo(3, -2);
  hole.lineTo(3, 2);
  hole.lineTo(-3, 2);

  frame.holes.push(hole);

  var extrudeSettings = {
    steps: 0,
    depth: 1,
    bevelEnabled: false,
  };
  var geom = new THREE.ExtrudeGeometry(frame, extrudeSettings);
  var mesh = new THREE.Mesh(
    geom,
    new THREE.MeshPhongMaterial({ color: 0xffaaaa })
  );

  // scene.add(mesh);
  const axesHelper = new THREE.AxesHelper(80);
  scene.add(axesHelper);
}

function animate() {
  requestAnimationFrame(animate);
  composer.render();
}
