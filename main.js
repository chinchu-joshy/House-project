import { FBXLoader } from "/js/fbxloader.js";
let camera, scene, renderer;
init();
animate();

function model1(data) {
  const fbxLoader = new FBXLoader();
  fbxLoader.load(data, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.flatshading = true;
      }
    });
    scene.add(object);
    object.position.set(-80, 0, 10);
    object.scale.set(0.06, 0.06, 0.06);
  });
}
function model2() {
  const fbxLoader = new FBXLoader();
  fbxLoader.load("Model/test.fbx", function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.flatshading = true;
      }
    });

    scene.add(object);
    object.position.set(0, 0, 10);
    //  object.rotation.z=2

    object.scale.set(0.2, 0.2, 0.2);
  });
}
function model3() {
  const fbxLoader = new FBXLoader();
  fbxLoader.load("Model/cottage_fbx.fbx", function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.flatshading = true;
      }
    });

    scene.add(object);
    object.position.set(80, 0, 10);
    object.scale.set(0.009, 0.009, 0.009);
  });
}

document.getElementById("kk").onclick = function () {
  model1("Model/plant.fbx");
};
document.getElementById("ll").onclick = function () {
  model2("Model/test.fbx");
};
document.getElementById("mm").onclick = function () {
  model3("Model/cottage_fbx.fbx");
};
const canvas = document.querySelector("canvas.webgl");

/* -------------------------------- controls -------------------------------- */
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;
function init() {
  /* ---------------------------------- scene --------------------------------- */
  const BACKGROUND_COLOR = 0xf1f1f1;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  // scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

  /* --------------------------------- camera --------------------------------- */
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  /* --------------------------------- render --------------------------------- */
  renderer = new THREE.WebGL1Renderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  /* -------------------------------- fbxloader ------------------------------- */
  /* ---------------------- add the material to the model --------------------- */
  //   var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
  //   var floorMaterial = new THREE.MeshPhongMaterial({
  //     color: 0xff0000,
  //     shininess: 0,
  //   });

  //   var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  //   floor.rotation.x = -0.5 * Math.PI;
  //   floor.receiveShadow = true;
  //   floor.position.y = -1;
  //   scene.add(floor);
  // Add lights
  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
  hemiLight.position.set(0, 50, 0);
  // Add hemisphere light to scene
  scene.add(hemiLight);

  var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
  dirLight.position.set(-8, 12, 8);

  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  // Add directional Light to scene
  scene.add(dirLight);
  /* ------------------------------ loading home ------------------------------ */

  console.log("hhdgfjhdgj");
}

/* --------------------------------- animate -------------------------------- */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}
/* ------------------ update function to update the content ----------------- */
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;
  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
