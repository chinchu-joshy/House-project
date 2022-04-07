import { FBXLoader } from "/js/fbxloader.js";
import CameraControls from "./js/camera-controls.module.js";

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
  obj;
/* -------------------------------- constants ------------------------------- */
const raycaster = new THREE.Raycaster();
const clickmouse = new THREE.Vector2();
const movemouse = new THREE.Vector2();
var draggable = new THREE.Object3D();
/* -------------------- events to trigger the raycasting -------------------- */
window.addEventListener("click", (event) => {
  console.log(draggable);
  if (draggable.parent) {
    console.log("clicked again");
    draggable = new THREE.Object3D();
    return;
  }
  console.log("clicked");
  clickmouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickmouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(clickmouse, camera);
  found = raycaster.intersectObjects(scene.children);
  console.log(found[0].object.userData.draggable);
  if (found.length > 0 && found[0].object.userData.draggable) {
    draggable = found[0].object;
    console.log("reached");
  }
});
window.addEventListener("mousemove", (event) => {
  movemouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  movemouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  dargObject();
});

function dargObject() {
  if (draggable != null) {
    raycaster.setFromCamera(movemouse, camera);
    obj = raycaster.intersectObjects(scene.children);
    console.log(obj);

    if (obj.length > 0) {
      for (let o of obj) {
        if (!o.object.userData.limit) {
          console.log("continue",o.object)
          continue;
        } else {
         
          console.log("entered dragged" ,o.object);
          draggable.position.x = o.point.x;
          draggable.position.y = o.point.y;
          draggable.visible = true;
        }
      }
    }
  }
}
init();
animate();
// var controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 0.2;
function init() {
  /* ---------------------------------- scene --------------------------------- */
  const BACKGROUND_COLOR = 0xf1f1f1;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);
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

  var dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
  dirLight.position.set(90, 30, 0);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

  var ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);
  var dirLightright = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLightright.position.set(8, 4, -12);
  dirLightright.castShadow = true;

  dirLightright.shadow.mapSize = new THREE.Vector2(1024, 1024);
  scene.add(dirLightright);
  light = new THREE.PointLight(0xffffff, 0.9, 100);
  light.position.set(-10, 30, 42);
  const light2 = new THREE.PointLight(0xffffff, 0.9, 100);
  light2.position.set(20, 30, 42);
  scene.add(light2);

  scene.add(light);
  const sphereSize = 1;
  const pointLightHelper = new THREE.PointLightHelper(
    light,
    sphereSize,
    0xfff000
  );
  scene.add(pointLightHelper);
  const pointLightHelper2 = new THREE.PointLightHelper(
    light2,
    sphereSize,
    0xfff000
  );
  scene.add(pointLightHelper2);
  /* ----------------------------- camera controls ---------------------------- */
  CameraControls.install({ THREE: THREE });
  clock = new THREE.Clock();
  cameraControls = new CameraControls(camera, renderer.domElement);
  /* ------------------------ adding model to the scene ----------------------- */
  texture = new THREE.TextureLoader().load("Model/walnut-normal.jpg");
  textureWall = new THREE.TextureLoader().load("Model/wall-3.png");
  textureRoof = new THREE.TextureLoader().load("Model/RusticBlack.jpeg");
  textureBase = new THREE.TextureLoader().load("Model/base.jpg");
  ventTexture = new THREE.TextureLoader().load("Model/Venttexture.jpg");
  const fbxLoader = new FBXLoader();
  fbxLoader.load("Model/vent.fbx", (object) => {
    console.log("first object", object);
    scene.add(object);
    object.traverse((child) => {
      console.log("vent child", child);
      child.visible = true;
      if (child.isMesh && child.name.includes("Vent")) {
        addVent(child, 0xf0f0f0);
      }
    });
  });
  fbxLoader.load("Model/model-3.fbx", function (object) {
    window.model = object;
    object.traverse(function (child) {
      if (child.isMesh && child.name.includes("Shed_SaltBox")) {
        addBottom(child, 0xf0f0f0);
        window.child = child;
        window.changeBottomColor = addBottom;
      }
      if (child.isMesh && child.name.includes("Trim")) {
        Trim(child, 0x5d665f);
      }
      if (child.name.includes("Ridge_Cap")) {
        child.visible = false;
      }
      if (child.name.includes("_40_year_Metal_Roofing")) {
        child.visible = false;
      }
      if (child.name.includes("Shed_SaltBox_10x10_Sidewall")) {
        child.traverse((value) => {
          if (
            value.isMesh &&
            (value.name == "left_side" ||
              value.name == "back_side" ||
              value.name == "right_side" ||
              value.name == "front_side")
          ) {
            console.log("wallText", textureWall.image);

            sideWall(value, 0x382c16);
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

    scene.add(object);
    object.position.set(0, 0, 0);
    object.userData.name = "Roofing";

    object.scale.set(0.19, 0.19, 0.19);
  });

  const axesHelper = new THREE.AxesHelper(80);
  scene.add(axesHelper);
  /* ------------------------------ loading home ------------------------------ */
}

/* ----------------------- add the texture dynamically ---------------------- */
function addBottom(child, color) {
  child.material = new THREE.MeshPhongMaterial();
  child.castShadow = true;
  child.receiveShadow = true;
  // child.flatshading = true;
  child.material.map = textureBase;
  child.material.bumpScale = 0.08;
  child.material.map.wrapS = THREE.RepeatWrapping;
  child.material.map.wrapT = THREE.RepeatWrapping;
  child.material.color = new THREE.Color(color);

  child.userData.draggable = false;
  child.userData.name = "sidewall";
}
function sideWall(value, color) {
  value.material = new THREE.MeshStandardMaterial();
  value.material.bumpScale = 0.2;
  value.material.color = new THREE.Color(color);
  value.material.DoubleSide = true;
  value.material.bumpMap = textureWall;
  value.material.bumpMap.repeat.set(2, 2);
  value.material.bumpMap.needsUpdate = true;
  value.material.bumpMap.wrapS = THREE.RepeatWrapping;
  value.material.bumpMap.wrapT = THREE.RepeatWrapping;
  value.material.needsUpdate = true;
  value.userData.draggable = false;
  value.userData.name = "wall";
  value.userData.limit = true;
}
function Trim(child, color) {
  child.material = new THREE.MeshPhongMaterial();
  child.castShadow = true;
  child.receiveShadow = true;
  child.material.bumpMap = texture;
  child.material.bumpScale = 0.08;
  child.material.bumpMap.wrapS = THREE.RepeatWrapping;
  child.material.bumpMap.wrapT = THREE.RepeatWrapping;
  child.material.color = new THREE.Color(color);
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
  child.position.set(13, 49.8, 14);
  child.rotation.y = Math.PI;
  child.material.color = new THREE.Color(0xffffff);
  child.userData.draggable = true;
  child.userData.name = "vent";
  child.userData.limit = false;
}

/* --------------------------------- animate -------------------------------- */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // light.position.x +=10
  // light.position.y = camera.position.y;
  // light.position.z = camera.position.z;
  const delta = clock.getDelta();
  const hasControlsUpdated = cameraControls.update(delta);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}
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
