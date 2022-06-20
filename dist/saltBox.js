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
const raycaster = new THREE.Raycaster();
const raycster2 = new THREE.Raycaster();
const raycaster0 = new THREE.Raycaster();
const raycaster3 = new THREE.Raycaster();
const raycaster4 = new THREE.Raycaster();
const raycaster5 = new THREE.Raycaster();
const fbxLoader = new FBXLoader();
const models = [];
const doorPoints = [];
const ventPoints = [];
var far = new THREE.Vector3();
const clickmouse = new THREE.Vector2();
const movemouse = new THREE.Vector2();
var draggable = new THREE.Object3D();
var direction = new THREE.Vector3();
let bbox3 = new THREE.Vector3();
let bboxBack = new THREE.Vector3();
let bboxDoor = new THREE.Vector3();
let bboxVent = new THREE.Vector3();
let boxModel = new THREE.Vector3();
let object = [];
let wallIntersect = [];
let wallIntersect1 = [];
let wallIntersect2 = [];
let wallIntersect3 = [];
let wallIntersect4 = [];
let mousedown = false;
let mouseX;
let mouseY;
let checkColor = 0x382c16;
let checkTrimColor=0xffffff
let checkDoorType="Standard_Door"
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

  //         const Phelper = new THREE.PlaneHelper(clipPlanes[0], 80, 0xfff000);
  //         scene.add(Phelper);
  //         const Phelper2 = new THREE.PlaneHelper(clipPlanes[1], 80, 0xff00f0);
  //         scene.add(Phelper2);
  //         const Phelper3 = new THREE.PlaneHelper(clipPlanes[2], 80, 0x000ff0);
  //         scene.add(Phelper3)
  //         const Phelper4 = new THREE.PlaneHelper(clipPlanes[3], 80, 0xff0ff0);
  //         scene.add(Phelper4)

  return clipPlanes;
}

document.getElementById("testing").addEventListener("submit", testing);
function testing(e) {
  e.preventDefault();
  
}

document.getElementById("door").addEventListener("click", changeDoor);
function changeDoor() {}
document.getElementById("trimcolor").addEventListener("click", changeTrimColor);
function changeTrimColor() {}
// document.getElementById("wallcolor").addEventListener("change", changeWallColor);
// function changeWallColor(e) {
//   console.log("reached", document.getElementById("head").value);
// }
document.getElementById("floorplan").addEventListener("click", createFloorPlan);
function createFloorPlan(modelName, position, feet) {
  const fbxLoader = new FBXLoader();
  fbxLoader.load("Model/doubleDoor.fbx", (object) => {
    object.rotation.y = Math.PI / 2;
    object.traverse((child) => {
      if (child.name.includes("Hinges")) {
        child.position.set(7, 8, 28);
        child.rotation.y = Math.PI / 2;
        console.log(child, "find");
        bboxDoor = new THREE.Box3().setFromObject(child);
        var helper = new THREE.BoundingBoxHelper(child, 0xff0000);
        scene.add(helper);
      }
    });
  });
  fbxLoader.load("Model/vent.fbx", (object) => {
    object.traverse((child) => {});
    bboxVent = new THREE.Box3().setFromObject(object);
    object.position.set(13, 34.8, 28.5);
    object.scale.set(0.19, 0.19, 0.19);
  });

  fbxLoader.load("Model/model-3.fbx", (object) => {
    // object.position.set(0, -15, 0);
    // object.scale.set(0.19, 0.19, 0.19);
    // camera.lookAt(0, 100, 0);
    object.traverse((child) => {
      child.position.set(0, -15, 0);
      if (child.name.includes("frontGrid")) {
        frontChildren = child;
        child.scale.set(0.19, 0.19, 0.19);
        bbox3 = new THREE.Box3().setFromObject(child);
      }
      if (child.name.includes("backGrid")) {
        child.scale.set(0.19, 0.19, 0.19);
        backChildren = child;
        bboxBack = new THREE.Box3().setFromObject(child);
        //   console.log(
        //   "size of the x axis checking",
        //   bbox3.getSize(new THREE.Vector3(0, 0, 0)).y
        // );
      }
    });
    function createFrontPlan(child) {
      console.log("reached here", bboxDoor, bboxVent);
      const pointsVertical = [];
      let valueV = 5.79;
      let value = 5.79;
      console.log(
        "size of the z axis",
        bbox3.getSize(new THREE.Vector3(0, 0, 0)).z
      );
      const points = [];

      // points.push(new THREE.Vector3(bbox3.max.x, bbox3.max.y, bbox3.max.z));
      // points.push(new THREE.Vector3(bbox3.min.x, bbox3.max.y, bbox3.max.z));
      // points.push(new THREE.Vector3(bbox3.min.x, bbox3.max.y, bboxBack.min.z));
      // points.push(new THREE.Vector3(bbox3.max.x, bbox3.max.y, bboxBack.min.z));
      // points.push(new THREE.Vector3(bbox3.max.x, bbox3.max.y, bbox3.max.z));
      // console.log(
      //   "for adding the floor plan checking the coordinates",
      //   bbox3.max.x,
      //   bbox3.max.y,
      //   bbox3.max.z - value
      // );
      // console.log(
      //   "max value of the y value checking",
      //   bbox3.min.x,
      //   bbox3.max.y,
      //   bbox3.max.z - value
      // );
      // console.log("looking the cordinate back", bboxBack);

      doorPoints.push(
        new THREE.Vector3(bboxDoor.max.x, bbox3.max.y, bboxDoor.max.z)
      );
      doorPoints.push(
        new THREE.Vector3(bboxDoor.max.x, bbox3.max.y + 4, bboxDoor.max.z)
      );
      doorPoints.push(
        new THREE.Vector3(bboxDoor.min.x, bbox3.max.y, bboxDoor.max.z)
      );
      const geometryDoor = new THREE.BufferGeometry().setFromPoints(doorPoints);
      const materialDoor = new THREE.LineBasicMaterial({ color: 0x000000 });
      const lineDoor = new THREE.Line(geometryDoor, materialDoor);
      console.log(bbox3.max.y);
      console.log("door sign", bboxDoor);
      scene.add(lineDoor);
      for (var i = 1; i <= 10; i++) {
        points.push(
          new THREE.Vector3(bbox3.max.x, bbox3.max.y, bbox3.max.z - value)
        );
        points.push(
          new THREE.Vector3(bbox3.min.x, bbox3.max.y, bbox3.max.z - value)
        );
        points.push(
          new THREE.Vector3(
            bbox3.min.x,
            bbox3.max.y,
            bbox3.max.z - value + 5.79
          )
        );
        points.push(
          new THREE.Vector3(
            bbox3.max.x,
            bbox3.max.y,
            bbox3.max.z - value + 5.79
          )
        );
        value += 5.79;
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x000000 });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      for (var i = 1; i <= 10; i++) {
        pointsVertical.push(
          new THREE.Vector3(bbox3.max.x - valueV, bbox3.max.y, bbox3.max.z)
        );
        pointsVertical.push(
          new THREE.Vector3(bbox3.max.x - valueV, bbox3.max.y, bboxBack.min.z)
        );
        pointsVertical.push(
          new THREE.Vector3(
            bbox3.max.x - valueV + 5.79,
            bbox3.max.y,
            bboxBack.min.z
          )
        );
        pointsVertical.push(
          new THREE.Vector3(
            bbox3.max.x - valueV + 5.79,
            bbox3.max.y,
            bbox3.max.z
          )
        );
        valueV += 5.79;
      }
      const geometry2 = new THREE.BufferGeometry().setFromPoints(
        pointsVertical
      );
      const material2 = new THREE.LineBasicMaterial({ color: 0x000000 });
      const line2 = new THREE.Line(geometry2, material2);
      scene.add(line2);
    }
    createFrontPlan(frontChildren);
    // createBackPlan(backChildren)
  });
  // boxModel = new THREE.Box3().setFromObject(object);
}
/* -------------------- events to trigger the raycasting -------------------- */
canvas.addEventListener("mousedown", onMouseDown);
function onMouseDown(event) {
  event.preventDefault();
  mousedown = true;
  mouse3D = new THREE.Vector3(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse3D, camera);

  intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    object = intersects[0].object;

    // console.log("checking the intersect",intersects[0].object)

    bbox = new THREE.Box3().setFromObject(object);

    // Double__Door

    while (
      !(object instanceof THREE.Scene) &&
      !object.name.includes("SaltBox") &&
      !object.name.includes("front_outline") &&
      !object.name.includes("Double__Door") &&
      !object.name.includes("Exterior")
    ) {
      object = object.parent;
      // console.log("looking", object);
      // console.log(object.userData);
    }
    if (object.userData.draggable) {
      startpoint = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z);
      endpoint = new THREE.Vector3(bbox.max.x, bbox.max.y, -100);
      raycaster0.set(
        startpoint,
        direction.subVectors(endpoint, startpoint).normalize()
      );
      // raycaster.setFromCamera(mousemove, camera);
      // wallIntersect = raycaster0.intersectObjects(scene.children);
      // console.log("looking for the changes",wallIntersect)
      const val = intersects
        .filter((data) => {
          if (data.object.name.includes("front")) {
            // console.log(data.object.name);
            return data;
          } else {
            return;
          }
        })
        .map((value) => {
          if (value) {
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
            // console.log("clipping plane", value.object.material.clippingPlanes);
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
canvas.addEventListener("mousemove", onMouseDrag);

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
    startpointLeft = new THREE.Vector3(bbox2.min.x, bbox2.max.y, bbox2.max.z);
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
    // startpointBottomLeft,
    // direction.subVectors(endpointBottomLeft, startpointBottomLeft).normalize()
    // );
    // raycaster5.set(
    //   startpointBottomRight,
    //   direction.subVectors(endpointBottomRight, startpointBottomRight).normalize()
    // );
    // raycaster.far = far.subVectors(mainpoint.position, startpoint).length();

    wallIntersect1 = raycster2.intersectObjects(scene.children);

    wallIntersect2 = raycaster3.intersectObjects(scene.children);

    wallIntersect3 = raycaster4.intersectObjects(scene.children);

    // wallIntersect4 = raycaster5.intersectObjects(
    // scene.children
    // );
  }
  // raycaster.setFromCamera(mousemove, camera);
  var firstObject = vent;

  var secondObject = door;

  const firstBB = new THREE.Box3().setFromObject(firstObject);

  const secondBB = new THREE.Box3().setFromObject(secondObject);

  collision = firstBB.intersectsBox(secondBB);

  if (
    draggable.userData.draggable &&
    wallIntersect1.length > 0 &&
    wallIntersect2.length > 0 &&
    !collision
  ) {
    // console.log("beforeX",draggable.position.x,"wall point",wallIntersect[0].point.x)
    // console.log("beforeY",draggable.position.y)
    if (intersects.length > 1) {
      intersects[1].object.material.depthTest = true;
      const selectedObject = intersects[0].object;
      addSelectedObject(selectedObject);
      outlinePass.selectedObjects = selectedObjects;
    }
    draggable.position.x = intersectPoint[0].point.x + mouseX;
    // draggable.position.y = intersectPoint[0].point.y + mouseY;
    draggable.updateMatrixWorld();
    //   //     }
  }
  // }
  else {
    if (draggable.userData.draggable) {
      // console.log("correct",draggable)
      draggable.traverse((child) => {
        if (child.name.includes("red")) {
          // draggable.rotation.y = Math.PI ;
          child.renderOrder = 1;
          child.material.color = new THREE.Color(0xff0000);
          child.material.depthTest = false;
          child.visible = true;
        }
      });
    }
  }
}

canvas.addEventListener("mouseup", onMouseUp);

function onMouseUp(event) {
  // document.body.appendChild(renderer.domElement);

  if (wallIntersect1.length < 1 || wallIntersect2.length < 1 || collision) {
    draggable.position.x = xPosition;
    draggable.position.y = yPosition;
    draggable.traverse((child) => {
      if (child.name.includes("red")) {
        // draggable.rotation.y = Math.PI ;
        child.renderOrder = 1;

        child.material.depthTest = true;
        child.visible = false;
      }
    });
  }
  mousedown = false;
  cameraControls.enabled = true;
  bbox = null;
  const val = intersects
    .filter((data) => {
      if (data.object.name.includes("front")) {
        // console.log(data.object.material.clippingPlanes)
        return data;
      } else {
        return;
      }
    })
    .map((value) => {
      // console.log(value,"on mouseup before")
      value.object.material.clippingPlanes = null;
      value.object.material.clipIntersection = false;
      // console.log(value,"on mouseup")
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
    canvas: canvas,
    alpha: true,
    antialias: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.localClippingEnabled = true;
  renderer.xr.enabled=true
 
  // document.body.appendChild(renderer.domElement);

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
  document.body.appendChild( ARButton.createButton( renderer) );
  /* ------------------------ adding model to the scene ----------------------- */
  texture = new THREE.TextureLoader().load("Model/walnut-normal.jpg");
  textureWall = new THREE.TextureLoader().load("Model/wall-3.png");
  textureRoof = new THREE.TextureLoader().load("Model/RusticBlack.jpeg");
  textureBase = new THREE.TextureLoader().load("Model/base.jpg");
  ventTexture = new THREE.TextureLoader().load("Model/Venttexture.jpg");

  fbxLoader.load("Model/vent.fbx", (object) => {
    vent = object;
    models.push(object);

    // window.vent = object.children[0].children[0];

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
  
 

  createHouse();
  createDoor()
  // const axesHelper = new THREE.AxesHelper(80);
  // scene.add(axesHelper);
  /* ------------------------------ loading home ------------------------------ */
}
function createHouse() {
  fbxLoader.load("Model/model-3.fbx", function (object) {
    saltbox = object;
    window.model = object;
    // (draggable.children[0].material.clippingPlanes = clipPlanes),
    // console.log(draggable)
    object.traverse(function (child) {
      if (child.isMesh && child.name.includes("Shed_SaltBox")) {
        addBottom(child, 0xf0f0f0);
        window.child = child;
      }
      if (child.isMesh && child.name.includes("Trim")) {
        Trim(child, trimColor);
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
}
function createDoor(){
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
        // door.userData.draggable = false;
        // door.userData.name = "sidewall";
        // door.userData.limit = true;
        // door.material = new THREE.MeshPhongMaterial();
        // door.material.bumpMap = textureWall;
        // door.castShadow = true;
        // door.receiveShadow = true;
        // door.material.map = textureWall;
        // door.material.bumpMap.repeat.set(4, 4);
        // door.material.bumpScale = 0.08;
        // door.material.map.wrapS = THREE.RepeatWrapping;
        // door.material.map.wrapT = THREE.RepeatWrapping;
        // door.material.color = new THREE.Color(0x3f0000);
        // door.userData.draggable = true;
        // door.userData.name = "door";
        // door.material.needsUpdate = true;
        // console.log(door.material)
      }
      if (door.name.includes("Trim_side")) {
        door.material = new THREE.MeshPhongMaterial();

        door.material.bumpMap = texture;
        // door.material.map = texture;
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
    object.position.set(7, 8, 29);
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
  value.material.color = new THREE.Color(parseInt(test));
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
function Trim(child, color) {
  child.material = new THREE.MeshPhongMaterial();
  child.castShadow = true;
  child.receiveShadow = true;
  child.material.bumpMap = texture;
  child.material.bumpScale = 0.08;
  child.material.bumpMap.wrapS = THREE.RepeatWrapping;
  child.material.bumpMap.wrapT = THREE.RepeatWrapping;
  child.material.color = new THREE.Color(parseInt(trimColor));
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
  if (checkColor != test || checkTrimColor !=trimColor ) {
    console.log("testing value", test);
    createHouse();
  }
if(checkDoorType!= doorType){
 
}
  checkColor = test;
  checkTrimColor=trimColor
  requestAnimationFrame(animate);
  composer.render();

  const delta = clock.getDelta();
   cameraControls.update(delta);
  // if (resizeRendererToDisplaySize(renderer)) {
  //   const canvas = renderer.domElement;
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   camera.aspect = canvas.clientWidth / canvas.clientHeight;
  //   camera.updateProjectionMatrix();
  // }
  
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
