import { FBXLoader } from "/js/fbxloader.js";
import CameraControls from "./js/camera-controls.module.js";
import { EffectComposer } from "/js/EffectComposer.js";
import { RenderPass } from "/js/RenderPass.js";
import { GlitchPass } from "/js/GlitchPass.js";
import { OutlinePass } from "/js/OutlinePass.js";
import { SMAAPass } from "/js/SMAAPass.js";

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
  obj;
/* -------------------------------- constants ------------------------------- */
const raycaster = new THREE.Raycaster();
const raycster2 = new THREE.Raycaster();
const raycaster0 = new THREE.Raycaster();
const raycaster3 = new THREE.Raycaster();
const raycaster4 = new THREE.Raycaster();
const raycaster5 = new THREE.Raycaster();

var far = new THREE.Vector3();
const clickmouse = new THREE.Vector2();
const movemouse = new THREE.Vector2();
var draggable = new THREE.Object3D();
var direction = new THREE.Vector3();
let object = [];
let wallIntersect = [];
let wallIntersect1 = [];
let wallIntersect2 = [];
let wallIntersect3 = [];
let wallIntersect4 = [];
let mousedown = false;
let x = 0;
let mouseX;
let mouseY;
const params = {
  clipIntersection: true,
  planeConstant: 0,
  showHelpers: false,
};
/* ----------------------------- clipping plane ----------------------------- */
function createClippingPlane(bXMin = 0, bXMax = 0, bYMin = 0, bYMax = 0) {
  const plane1 = new THREE.Plane(new THREE.Vector3(1, 0, 0));
  plane1.translate(new THREE.Vector3(bXMax, 0, 0));
  const plane2 = new THREE.Plane(new THREE.Vector3(-1, 0, 0));
  plane2.translate(new THREE.Vector3(bXMin, 0, 0));
  const plane3 = new THREE.Plane(new THREE.Vector3(0, -1, 0));
  plane3.translate(new THREE.Vector3(0, bYMin, 0));
  const plane4 = new THREE.Plane(new THREE.Vector3(0, 1, 0));
  plane4.translate(new THREE.Vector3(0, bYMax, 0));
  const plane5 = new THREE.Plane(new THREE.Vector3(0, 0, -1));
  const clipPlanes = [plane1, plane2, plane3, plane4, plane5];

  // const Phelper = new THREE.PlaneHelper(clipPlanes[0], 80, 0xfff000);
  //         console.log(Phelper);
  //         scene.add(Phelper);
  //         const Phelper2 = new THREE.PlaneHelper(clipPlanes[1], 80, 0xff00f0);

  //         scene.add(Phelper2);
  //         const Phelper3 = new THREE.PlaneHelper(clipPlanes[2], 80, 0x000ff0);

  //         scene.add(Phelper3)
  //         const Phelper4 = new THREE.PlaneHelper(clipPlanes[3], 80, 0xff0ff0);

  //         scene.add(Phelper4)

  return clipPlanes;
}

/* -------------------- events to trigger the raycasting -------------------- */

document.addEventListener("mousedown", onMouseDown);
function onMouseDown(event) {
  event.preventDefault();
  mousedown = true;
  mouse3D = new THREE.Vector3(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse3D, camera);

  const data = scene.children.filter((intersect) => {
    if (intersect.name != "Saltbox_Cabinet") {
      return intersect;
    }
  });
  intersects = raycaster.intersectObjects(data);

  if (intersects.length > 0) {
    object = intersects[0].object;

    // console.log("checking the intersect",intersects[0].object)
    bbox = new THREE.Box3().setFromObject(object);
    // console.log("checking the bbox",bbox)
    // Double__Door
    while (
      !(object instanceof THREE.Scene) &&
      !object.name.includes("SaltBox") &&
      !object.name.includes("front_outline") &&
      !object.name.includes("Double__Door") &&
      !object.name.includes("Exterior")
    ) {
      object = object.parent;
    }
    if (object.userData.draggable) {
      startpoint = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z);
      endpoint = new THREE.Vector3(bbox.max.x, bbox.max.y, -100);
      raycaster0.set(
        startpoint,
        direction.subVectors(endpoint, startpoint).normalize()
      );
      // raycaster.setFromCamera(mousemove, camera);
      wallIntersect = raycaster0.intersectObjects(scene.children);
      console.log("looking for the changes",wallIntersect)
    
      const val = intersects
        .filter((data) => {
          console.log("changes",data)
          if (data.object.name.includes("front")) {
          
            return data;
          } else {
            return;
          }
        })
        .map((value) => {
          if (value && intersects[0]) {
            //value.object.material.clippingPlanes = []
            // console.log("object name is ", value.object.name)
            value.object.material.clippingPlanes = createClippingPlane(
              bbox.min.x,
              bbox.max.x,
              bbox.min.y,
              bbox.max.y
            );
            // console.log(createClippingPlane( bbox.min.x,
            //   bbox.max.x,
            //   bbox.min.y,
            //   bbox.max.y))
            // console.log("clipping plane",  value.object.material.clippingPlanes)
            value.object.material.clipIntersection = true;
            value.object.material.needsUpdate = true;
          } else return;
        });

      cameraControls.enabled = false;
      xPosition = object.position.x;
      yPosition = object.position.y;
      mouseX = object.position.x - intersects[0].point.x;
      mouseY = object.position.y - intersects[0].point.y;
      // console.log("mouseX",object.position.x,"intersect point",intersects[0].point.x,"mouseX",mouseX)
      // console.log("mouseY",object.position.y,"intersect point",intersects[0].point.y)
      draggable = object;
    } else {
      draggable = new THREE.Object3D();
    }
  } else {
    // console.log("not getting the value");
    draggable = new THREE.Object3D();
  }
}
document.addEventListener("mousemove", onMouseDrag);

function onMouseDrag(event) {
  if (!mousedown) {
    return;
  }
  mousemove = new THREE.Vector3(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  if (draggable.userData.draggable) {
    bbox2 = new THREE.Box3().setFromObject(draggable);

    startpoint = new THREE.Vector3(bbox2.max.x, bbox2.max.y, bbox2.min.z);
    endpoint = new THREE.Vector3(bbox2.max.x, bbox2.max.y, -100);
    // console.log("starting pint", startpoint, "ending point", endpoint);
    startpoint = new THREE.Vector3(bbox2.max.x, bbox2.max.y, bbox2.min.z);
    endpoint = new THREE.Vector3(bbox2.max.x, bbox2.max.y, -100);
    startpointLeft = new THREE.Vector3(bbox2.min.x, bbox2.max.y, bbox2.min.z);
    endpointLeft = new THREE.Vector3(bbox2.min.x, bbox2.max.y, -100);
    startpointBottomLeft = new THREE.Vector3(
      bbox2.min.x,
      bbox2.min.y,
      bbox2.min.z
    );
    endpointBottomLeft = new THREE.Vector3(bbox2.min.x, bbox2.min.y, -100);
    startpointBottomRight = new THREE.Vector3(
      bbox2.max.x,
      bbox2.max.y,
      bbox2.min.z
    );

    endpointBottomRight = new THREE.Vector3(bbox2.max.x, bbox2.max.y, -100);

    raycaster.setFromCamera(mousemove, camera);
    intersectPoint = raycaster.intersectObjects(scene.children);
    raycster2.set(
      startpoint,
      direction.subVectors(endpoint, startpoint).normalize()
    );
    raycaster3.set(
      startpointLeft,
      direction.subVectors(endpointLeft, startpointLeft).normalize()
    );
    // raycaster4.set(
    //   startpointBottomLeft,
    //   direction.subVectors(endpointBottomLeft, startpointBottomLeft).normalize()
    // );
    // raycaster5.set(
    //   startpointBottomRight,
    //   direction.subVectors(endpointBottomRight, startpointBottomRight).normalize()
    // );
    // raycaster.far = far.subVectors(mainpoint.position, startpoint).length();

    wallIntersect1 = raycster2.intersectObjects(scene.children);

    wallIntersect2 = raycaster3.intersectObjects(scene.children);
    console.log(wallIntersect2);
    // wallIntersect3 = raycaster4.intersectObjects(
    // scene.children
    // );
    // wallIntersect4 = raycaster5.intersectObjects(
    // scene.children
    // );
  }
  // raycaster.setFromCamera(mousemove, camera);

  if (draggable.userData.draggable && wallIntersect1.length > 0) {
    // console.log("beforeX",draggable.position.x,"wall point",wallIntersect[0].point.x)
    // console.log("beforeY",draggable.position.y)

    if (intersects.length > 1) {
      intersects[1].object.material.depthTest = true;
      const selectedObject = intersects[0].object;
      addSelectedObject(selectedObject);
      outlinePass.selectedObjects = selectedObjects;
    }

    draggable.position.x = intersectPoint[0].point.x + mouseX;

    // draggable.position.y =  intersectPoint[0].point.y +mouseY;
    // console.log("afterX",draggable.position.x)
    // console.log("aftery",draggable.position.y)
    draggable.updateMatrixWorld();
    //   //     }
  }
  // }
  else {
    if (draggable.userData.draggable) {
      intersects[1].object.renderOrder = 1;
      intersects[1].object.material.color = new THREE.Color(0xff0000);
      intersects[1].object.material.depthTest = false;
    }
  }
}
document.addEventListener("mouseup", onMouseUp);
function onMouseUp(event) {
  if (wallIntersect1.length < 1) {
    draggable.position.x = xPosition;
    draggable.position.y = yPosition;
    intersects[1].object.material.depthTest = true;
  }
  mousedown = false;
  cameraControls.enabled = true;
  bbox = null;
  const val = wallIntersect
    .filter((data) => {
      if (data.object.name.includes("front")) {
        return data;
      } else {
        return;
      }
    })
    .map((value) => {
      // console.log(value,"on mouseup")
      value.object.material.clippingPlanes = null;
      value.object.material.clipIntersection = false;
    });
}
function addSelectedObject(object) {
  selectedObjects = [];
  selectedObjects.push(object);
}
// if (mouseclick) {
//   mouseMove();
// }
init();
animate();
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
  /* --------------------------------- render --------------------------------- */
  renderer = new THREE.WebGL1Renderer({
    antialias: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.localClippingEnabled = true;
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
  light.position.set(-10, 10, 92);
  const light2 = new THREE.PointLight(0xffffff, 0.9, 100);
  light2.position.set(20, 10, 92);
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

  /* ---------------------------- post proccessing ---------------------------- */
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const glitchPass = new GlitchPass();
  outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );
  composer.addPass(outlinePass);
  const pass = new SMAAPass(
    window.innerWidth * renderer.getPixelRatio(),
    window.innerHeight * renderer.getPixelRatio()
  );
  composer.addPass(pass);
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
    window.vent = object.children[0].children[0];
    object.position.set(13, 34.8, 28.5);
    // object.position.set(13, 49.8, 14);

    object.traverse((child) => {
      if (child.isMesh && child.name.includes("Vent")) {
        // const pass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
        // composer.addPass( pass );
        addVent(child);
      }
    });
    scene.add(object);
    object.userData.draggable = true;
  });
  fbxLoader.load("Model/doubleDoor.fbx", (object) => {
    window.Door = object.children[0].children[0];

    object.traverse((child) => {
      if (child.isMesh && child.name.includes("ramp")) {
        child.visible = false;
      }
      if (child.name.includes("Standard_Door")) {
        child.visible = true;
      }
      if (child.isMesh && child.name.includes("DoorWood")) {
        child.material = new THREE.MeshPhongMaterial();
        child.bumpMap = textureWall;
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.map = textureWall;
        child.material.bumpScale = 0.08;
        child.material.map.wrapS = THREE.RepeatWrapping;
        child.material.map.wrapT = THREE.RepeatWrapping;
        child.material.color = new THREE.Color(0x382c16);
        child.userData.draggable = true;
        child.userData.name = "door";
        child.material.needsUpdate = true;
        child.visible = false;
        // child.material.bumpMap.needsUpdate = true;
      }
      if (child.name.includes("Awning")) {
        child.visible = false;
      }
    });
    object.position.set(7, 8, 28);
    object.scale.set(0.19, 0.19, 0.19);
    object.rotation.y = Math.PI / 2;
    object.userData.draggable = true;
    scene.add(object);
  });
  fbxLoader.load("Model/model-3.fbx", function (object) {
    window.model = object;
    // (draggable.children[0].material.clippingPlanes = clipPlanes),
    // console.log(draggable)
    object.traverse(function (child) {
      if (child.isMesh && child.name.includes("Shed_SaltBox")) {
        addBottom(child, 0xf0f0f0);
        window.child = child;
      }
      if (child.isMesh && child.name.includes("Trim")) {
        Trim(child, 0xfff0f2f5);
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
            (value.name == "left_side" ||
              value.name == "back_side" ||
              value.name == "right_side" ||
              value.name == "front_side")
          ) {
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
    //  const outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    // composer.addPass( outlinePass );

    object.position.set(0, -15, 0);
    camera.lookAt(object.position);
    object.userData.name = "Roofing";
    object.scale.set(0.19, 0.19, 0.19);
    object.userData.draggable = false;
    scene.add(object);
    mainpoint = object;
    // var outlineMaterial1 = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // });
    // var outlineMesh1 = new THREE.Mesh(globalGeomtry, outlineMaterial1);

    // scene.add(outlineMesh1);
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

  // var helper = new THREE.BoundingBoxHelper(value, 0xff0000);
  // scene.add(helper)
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

  child.rotation.y = Math.PI;
  child.material.color = new THREE.Color(0xffffff);
  child.userData.draggable = true;
  child.userData.name = "vent";
  child.userData.limit = false;
}
function addDoor(child) {
  child.material.bumpMap = textureWall;
}
/* --------------------------- drawing an outline --------------------------- */

/* --------------------------------- animate -------------------------------- */
function animate() {
  requestAnimationFrame(animate);
  composer.render();

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
