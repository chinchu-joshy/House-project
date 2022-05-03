import { FBXLoader } from "/js/fbxloader.js";
const boxModel
document.getElementById("floorplan").addEventListener('click',createFloorPlan)
function createFloorPlan(){
    console.log("reacger")
    const fbxLoader = new FBXLoader();
    fbxLoader.load("Model/vent.fbx", (object) => {
        vent = object;
        models.push(object);
      
        object.position.set(13, 34.8, 28.5);
       
    
        object.traverse((child) => {
          if (child.isMesh && child.name.includes("Vent")) {
            
          
          }
        });
        scene.add(object);
        object.userData.draggable = true;
      });
    boxModel = new THREE.Box3().setFromObject(object);
}