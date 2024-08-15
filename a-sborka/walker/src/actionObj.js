import * as THREE from '../node_modules/three/build/three.module';
import * as Build from './walker';
import * as MSV from './mouseClick.js';

export let pivot = null;
let planeMath = null;

let act = {};
act.click = false;
act.type = 'move';
act.obj = null;
act.pos = new THREE.Vector3();

export function init() {
  pivot = crPivot();
  Build.infProg.scene.pivot = pivot;
  planeMath = crPlaneMath();

  let container = Build.container;

  container.addEventListener('mousedown', mouseDown, false);
}

function crPivot() {
  let pivot = new THREE.Group();
  pivot.userData.tag = 'pivot';
  pivot.userData.obj = null;
  pivot.userData.f = {};
  pivot.userData.propPivot = propPivot;
  pivot.visible = false;
  Build.scene.add(pivot);

  let material = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 1, depthTest: false, lightMap: Build.infProg.img.lightMap_1 });

  arrows();
  crCone();
  arcCircle();

  function arrows() {
    let arr = [];
    arr[0] = { axis: 'x', pos: new THREE.Vector3(0.6, 0.0, 0.0), rot: new THREE.Vector3(0, Math.PI / 2, 0) };
    arr[1] = { axis: '-x', pos: new THREE.Vector3(-0.6, 0.0, 0.0), rot: new THREE.Vector3(0, -Math.PI / 2, 0) };
    arr[2] = { axis: '-z', pos: new THREE.Vector3(0.0, 0.0, -0.6), rot: new THREE.Vector3(0, Math.PI, 0) };
    arr[3] = { axis: 'z', pos: new THREE.Vector3(0.0, 0.0, 0.6), rot: new THREE.Vector3(0, 0, 0) };

    const triangleShape = new THREE.Shape()
      .moveTo(0, -0.75 / 2)
      .lineTo(-0.5 / 2, 0)
      .lineTo(0.5 / 2, 0)
      .lineTo(0, -0.75 / 2);

    let geometry = new THREE.ExtrudeGeometry(triangleShape, { depth: -0.05, bevelEnabled: false });
    geometry.rotateX(-Math.PI / 2);

    for (let i = 0; i < arr.length; i++) {
      let obj = new THREE.Mesh(geometry, material);
      obj.userData.noShadow = true;
      obj.userData.axis = arr[i].axis;
      obj.position.set(arr[i].pos.x, arr[i].pos.y, arr[i].pos.z);
      obj.rotation.set(arr[i].rot.x, arr[i].rot.y, arr[i].rot.z);
      pivot.add(obj);
    }
  }

  function crCone() {
    let geometry = new THREE.ConeGeometry(0.2, 0.5, 32);
    let obj = new THREE.Mesh(geometry, material);
    obj.position.set(0, 0.2, 0);
    obj.userData.axis = 'y';
    pivot.add(obj);
  }

  function arcCircle() {
    let arcShape = new THREE.Shape().moveTo(1.3, 0).absarc(0, 0, 1.3, 0, Math.PI * 2, false);
    let holePath = new THREE.Path().moveTo(1.1, 0).absarc(0, 0, 1.1, 0, Math.PI * 2, true);
    arcShape.holes.push(holePath);

    let geometry = new THREE.ExtrudeGeometry(arcShape, { depth: -0.01, bevelEnabled: false });
    geometry.rotateX(-Math.PI / 2);

    let obj = new THREE.Mesh(geometry, material);
    obj.userData.noShadow = true;
    obj.userData.gizmo = true;
    pivot.add(obj);
  }

  function propPivot(params) {
    let type = params.type;

    if (type == 'setPivot') setPivot({ obj: params.obj });
    if (type == 'setScale') setScale();
    if (type == 'hide') hide();
    if (type == 'outline') outline({ arr: params.arr });

    function setPivot(params) {
      let obj = params.obj;

      pivot.userData.propPivot({ type: 'hide' });
      pivot.userData.propPivot({ type: 'outline', arr: [] });

      if (!obj) return;

      pivot.userData.obj = obj;
      let pos = obj.position;
      pivot.position.set(pos.x, pos.y, pos.z);
      pivot.visible = true;

      pivot.userData.propPivot({ type: 'outline', arr: [obj] });
      pivot.userData.propPivot({ type: 'setScale' });
    }

    function setScale() {
      if (!pivot.visible) return;

      let dist = Build.camera3D.position.distanceTo(pivot.position);
      let scale = dist / 50;
      if (Build.camera3D.userData.camera.type == 'first') scale *= 3;
      //scale = scale > 1.4 ? scale : 1.4;
      pivot.scale.set(scale, scale, scale);

      //console.log(scale);
    }

    function hide() {
      pivot.visible = false;
      pivot.userData.obj = null;
    }

    function outline({ arr } = { arr: [] }) {
      Build.outlinePass.selectedObjects = arr;
    }
  }

  return pivot;
}

function crPlaneMath() {
  let geometry = new THREE.PlaneGeometry(10000, 10000);
  let material = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  material.visible = false;

  let planeMath = new THREE.Mesh(geometry, material);
  planeMath.rotation.set(-Math.PI / 2, 0, 0);

  Build.scene.add(planeMath);

  if (1 == 2) {
    const geometry = new THREE.BoxGeometry(0.05, 0.001, 1);
    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, depthTest: false });
    const cube = new THREE.Mesh(geometry, material);
    planeMath.add(cube);
  }

  if (1 == 2) {
    const geometry = new THREE.BoxGeometry(1, 0.001, 0.05);
    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, depthTest: false });
    const cube = new THREE.Mesh(geometry, material);
    planeMath.add(cube);
  }

  return planeMath;
}

export function rayHitObj(params) {
  let event = params.event;

  let arr = [];
  if (Build.infProg.scene.construction) arr[arr.length] = Build.infProg.scene.construction;
  if (Build.infProg.scene.windows) arr[arr.length] = Build.infProg.scene.windows;
  if (Build.infProg.scene.doors) arr[arr.length] = Build.infProg.scene.doors;
  if (Build.infProg.scene.furnitures.length > 0) arr.push(...Build.infProg.scene.furnitures);
  if (Build.infProg.scene.walkPoint.length > 0) arr.push(...Build.infProg.scene.walkPoint);

  let ray = MSV.rayIntersect(event, arr, 'arr');
  //let ray = MSV.rayIntersect(event, [Build.scene], 'arr');

  let visible = false;

  let obj = getVisibleObj({ ray: ray });

  if (obj) {
    obj = getParentObj({ obj: obj });
    let o = Build.infProg.scene.furnitures.find((o) => o == obj);

    if (o) visible = true;
  }

  if (!visible) {
    Build.outlinePass.selectedObjects = [];
    Build.infProg.scene.newPivot.hide();
  } else {
    obj.objOutline(true);
    Build.infProg.scene.newPivot.setPivot({ obj: obj });
  }
  Build.render();
}

// убираем невидимые объекты из массива
function getVisibleObj({ ray }) {
  if (ray.length == 0) return;

  let obj = null;

  for (let i = 0; i < ray.length; i++) {
    if (!Array.isArray(ray[i].object.material)) {
      if (!ray[i].object.material.visible) continue;
    }

    if (ray[i].object.material.opacity < 0.31) continue;
    obj = ray[i].object;
    break;
  }

  return obj;
}

// находим родитель у дочернего объекта
function getParentObj({ obj }) {
  let next = true;

  while (next) {
    if (obj.parent) {
      if (obj.parent == Build.scene) {
        next = false;
        return obj;
      } else {
        obj = obj.parent;
      }
    } else {
      next = false;
      return null;
    }
  }
}

function mouseDown(event) {
  if (Build.outlinePass.selectedObjects.length == 0) return;

  let ray = MSV.rayIntersect(event, Build.outlinePass.selectedObjects, 'arr');
  if (ray.length == 0) return;

  let obj = getVisibleObj({ ray });
  if (!obj) return;

  obj = getParentObj({ obj: obj });
  if (!obj) return;

  planeMath.position.copy(ray[0].point);
  planeMath.rotation.set(Math.PI / 2, 0, 0);
  planeMath.updateMatrixWorld();

  Build.camOrbit.setStopMove({ value: true });

  let data = { obj: obj, posCurr: ray[0].point };

  Build.container.onmousemove = (event) => {
    let intersects = MSV.rayIntersect(event, planeMath, 'one');
    if (intersects.length == 0) return;
    let pos = intersects[0].point;

    moveObj({ data, pos });
  };

  Build.container.onmouseup = (event) => {
    Build.container.onmousemove = null;
    Build.container.onmouseup = null;

    Build.camOrbit.setStopMove({ value: false });
  };

  Build.render();
}

function moveObj({ data, pos }) {
  let offset = pos.clone().sub(data.posCurr);

  data.obj.position.add(offset);
  data.posCurr = pos;

  if (data.obj.userData.pivot) data.obj.userData.pivot.position.add(offset);
  if (data.obj.userData.iPoint) data.obj.userData.iPoint.position.add(offset);

  Build.render();
}
