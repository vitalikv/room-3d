import * as THREE from 'three';
import * as Build from './walker';

let dirLight = false;
let light = null;
let lights = [];
let arrCeil = [];

export function initLightShadow() {
  dirLight = true;
  Build.renderer.shadowMap.enabled = true;
  Build.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  let scene = Build.scene;

  light = new THREE.DirectionalLight(0xffffff, 0.3);
  light.position.set(-10, 5, -5);
  light.castShadow = true;
  light.shadow.camera.near = 0.01;
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.shadow.camera.bottom = -10;
  light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
  //light.shadow.bias = -0.002;
  //light.shadow.normalBias = 0.0003;
  light.shadow.blurSamples = 0;
  scene.add(light);

  lights.push(light);

  console.log(light);

  if (1 == 2) {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    cube.position.copy(light.position);
    scene.add(cube);
  }

  if (Build.infProg.mode.dynamicL == false) {
    Build.renderer.shadowMap.autoUpdate = false;
    light.shadow.autoUpdate = false;
  }

  scene.traverse(function (child) {
    assingShadow({ child: child });

    if (child.geometry && new RegExp('ceil', 'i').test(child.name)) {
      arrCeil.push(child);
    }
  });

  ceilShadow({ shadow: false });

  Build.render();
}

export function assingShadow({ child }) {
  if (!dirLight) return;

  if (!child.isMesh) return;
  if (child.userData.noShadow) return;

  let materialArray = child.material instanceof Array ? child.material : [child.material];

  materialArray.forEach(function (mtrl, idx) {
    if (mtrl.name !== 'glass') {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  upDynamicLight();
}

export function ceilShadow(params) {
  if (!dirLight) return;

  let shadow = params.shadow;

  for (let i = 0; i < arrCeil.length; i++) {
    arrCeil[i].castShadow = shadow;
    arrCeil[i].receiveShadow = shadow;
  }

  upDynamicLight();
}

export function initPointLight({ arrRoom }) {
  let geometry = new THREE.BoxGeometry(0.1, 0.01, 0.1);
  let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  crLightPoint();

  function crLightPoint() {
    for (let i = 0; i < arrRoom.length; i++) {
      let area = getArea({ obj: arrRoom[i].o });
      if (area < 1.2) continue;

      let cube = new THREE.Mesh(geometry, material);
      cube.position.set(arrRoom[i].pos.x, Build.infProg.scene.boundMinFloor.max.y, arrRoom[i].pos.z);
      Build.scene.add(cube);

      let light = new THREE.PointLight(0xffffff, 0.2, 10);
      light.position.copy(cube.position);
      light.position.y = light.position.y - 0.1;
      light.castShadow = true;
      light.shadow.bias = -0.002;
      light.shadow.mapSize.width = light.shadow.mapSize.height = 256;
      Build.scene.add(light);

      lights.push(light);
    }

    function getArea({ obj }) {
      if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
      let bound = obj.geometry.boundingBox;

      let x = bound.max.x - bound.min.x;
      let z = bound.max.z - bound.min.z;

      return x * z;
    }
  }

  Build.render();
}

function upDynamicLight() {
  if (Build.infProg.mode.dynamicL == false) {
    light.shadow.needsUpdate = true;
    Build.renderer.shadowMap.needsUpdate = true;
    Build.render();
  }
}

window.sss = ggfr;

function ggfr() {
  for (let i = 0; i < lights.length; i++) {
    let light = lights[i];

    //light.dispose();
    //light.shadow.autoUpdate = false;
    //light.shadow.needsUpdate = true;
  }

  Build.renderer.shadowMap.autoUpdate = false;
  Build.renderer.shadowMap.needsUpdate = true;

  console.log(Build.renderer, lights);

  Build.render();
}
