import img_man from './images/man.png';

import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as MSV from './mouseClick.js';
import * as PANOR from './panorama.js';
import * as HIDDO from './HiddenObject.js';
import * as CRM from './cursorMove.js';
//import * as API from './api/apiPia.js';
import * as LGS from './lightShadow.js';
import * as IFP from './infoPoint.js';

let point = [];
let click = {};
click.down = false;
click.move = false;
click.type = '';

export let kof = { speed: 0.5 };

export let ManageWP = null;

export function initWalkPoint({ arr }) {
  if (arr.length == 0) return;
  ManageWP = new ManageWalkPoints({ arrRoom: arr });
}

class ManageWalkPoints {
  arrRoom = [];
  geometry = null;
  material = null;
  arr = [];
  enabled = true;

  constructor({ arrRoom }) {
    this.arrRoom = arrRoom;
    this.geometry = this.crGeom();
    this.material = this.crMat();
    this.event();

    this.createPoints();
    this.initClick();
  }

  crGeom() {
    let geometry = new THREE.CircleGeometry(0.25, 32);

    return geometry;
  }

  crMat() {
    //let map = this.crTexture({text: 'test'});
    let map = new THREE.TextureLoader().load(img_man);
    map.repeat.set(1.5, 1.5);
    map.offset.set(-0.25, -0.25);
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
    map.encoding = THREE.sRGBEncoding;
    //map.anisotropy = Build.renderer.capabilities.getMaxAnisotropy();
    map.needsUpdate = true;

    let material = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, lightMap: Build.infProg.img.lightMap_1, map: map });

    return material;
  }

  crTexture({ text }) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 1024;

    context.fillStyle = 'rgba(255,255,255,1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, 1024 / 2, 0, 2 * Math.PI, false);
    context.fillStyle = 'rgba(255,255,255,1)';
    context.fill();
    context.lineWidth = canvas.width * 0.1;
    context.strokeStyle = 'rgba(34, 34, 34,1)';
    context.stroke();

    context.font = '420pt Arial';
    context.fillStyle = 'rgba(34, 34, 34,1)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  event() {
    //Build.container.addEventListener('mousedown', (event) => this.clickDown({ event: event }));
    //Build.container.addEventListener('touchstart', (event) => this.clickDown({ event: event }));

    Build.container.addEventListener('mousemove', (event) => this.clickMove({ event: event }));
    Build.container.addEventListener('touchmove', (event) => this.clickMove({ event: event }));

    Build.container.addEventListener('mouseup', (event) => this.clickUp({ event: event }));
    Build.container.addEventListener('touchend', (event) => this.clickUp({ event: event }));
  }

  initClick() {
    let clickDown = this.clickDown.bind(this);
    Build.infProg.cl.ListClick.addItem({ key: 'wPoint', arr: [...this.arr, Build.infProg.scene.construction], order: 1, f: clickDown });
  }

  createPoints() {
    let arrRoom = this.arrRoom;

    for (let i = 0; i < arrRoom.length; i++) {
      let area = getArea({ obj: arrRoom[i].o });
      if (area < 1.2) continue;

      let point = new WalkPoint({ pos: arrRoom[i].pos, geom: this.geometry, mat: this.material.clone() });
      this.addItemInArr({ obj: point });
    }

    function getArea({ obj }) {
      if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
      let bound = obj.geometry.boundingBox;

      let x = bound.max.x - bound.min.x;
      let z = bound.max.z - bound.min.z;

      return x * z;
    }
  }

  addItemInArr({ obj }) {
    this.arr.push(obj);
  }

  rotPoints() {
    let arr = this.arr;

    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].visible) continue;
      arr[i].setRotCam();
    }
  }

  enablePoints({ show }) {
    let arr = this.arr;

    for (let i = 0; i < arr.length; i++) {
      arr[i].visible = show;
      if (!arr[i].visible) continue;
      arr[i].setRotCam();
    }

    this.enabled = show;
  }

  clickDown({ event, ray }) {
    click.down = true;
    click.move = false;
    click.type = 'left';

    switch (event.button) {
      case 0:
        click.type = 'left';
        break;
      case 1:
        click.type = 'right';
        break;
      case 2:
        click.type = 'right';
        break;
    }

    if (click.type !== 'left' && Build.camera3D.userData.camera.type !== 'fly') return;

    let point = this.arr;
    let o = null;

    for (let i = 0; i < ray.length; i++) {
      for (let i2 = 0; i2 < point.length; i2++) {
        if (ray[i].object == point[i2]) {
          o = ray[i].object;
          break;
        }
      }

      if (o) {
        break;
      } else if (ray[i].object.material.opacity > 0.9) {
        break;
      }
    }

    if (o && o.material.opacity > 0.5) {
      Build.infProg.mouse.click.down = false;

      goWalk({ obj: o });
    }
  }

  clickMove({ event }) {
    if (!Build.camOrbit.activeCam.isCam3D) return;
    if (Build.camera3D.userData.camera.type != 'fly') return;

    let point = this.arr;

    let ray = MSV.rayIntersect(event, point, 'arr');
    if (ray.length == 0) return;

    if (ray[0].object.material.opacity > 0.5) Build.container.style.cursor = 'pointer';

    if (!click.down) return;
    if (click.type != 'left') return;

    click.move = true;
  }

  clickUp({ event }) {
    click.down = false;
    click.move = false;
  }
}

class WalkPoint extends THREE.Mesh {
  constructor({ pos, geom, mat }) {
    super(geom, mat);

    this.create({ pos: pos });
  }

  create({ pos }) {
    this.position.copy(pos);
    this.position.y = 1;
    this.userData.tag = 'WalkPoint';
    this.userData.noShadow = true;

    this.setRotCam();

    Build.scene.add(this);
  }

  setRotCam() {
    this.rotation.copy(Build.camera3D.rotation);
  }
}

function rayPointToCam(params) {
  let obj = params.obj;
  let pos = obj.position;

  let dir = new THREE.Vector3().subVectors(Build.camera3D.position, pos).normalize();

  let ray = new THREE.Raycaster();
  ray.set(pos, dir);

  let intersects = ray.intersectObjects([Build.infProg.scene.construction], true);

  if (1 == 2) {
    let geometry = new THREE.BufferGeometry().setFromPoints([pos, pos.clone().add(dir)]);
    let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    let line = new THREE.Line(geometry, material);
    Build.scene.add(line);
  }

  let opacity = 1;

  if (intersects.length == 0) {
    opacity = 1;
  } else {
    let o = intersects[0].object;

    if (o.material.opacity > 0.9) {
      opacity = 0;
    } else {
      opacity = 1;
    }
  }

  obj.material.opacity = opacity;
}

function goWalk(params) {
  let camera3D = Build.camera3D;
  if (!Build.camOrbit.activeCam.isCam3D) return;

  Build.camOrbit.setStopMove({ value: true });

  Build.container.style.cursor = 'default';
  camera3D.userData.camera.type = '';

  let obj = params.obj;

  ManageWP.enablePoints({ show: false });
  CRM.visibleCursorP360({ visible: false });
  //API.apiPIA.buttonExitCamWalkUI(false);

  camera3D.userData.camera.save.pos = camera3D.position.clone();
  let posCenter = camera3D.userData.camera.d3.targetO.position;

  let dir1 = camera3D.getWorldDirection(new THREE.Vector3());
  dir1 = new THREE.Vector3().addScaledVector(dir1, 3);
  let dir2 = new THREE.Vector3(dir1.x, 0, dir1.z).normalize();

  let path_1 = pathCam({ startP: camera3D.position, endP: obj.position.clone().add(new THREE.Vector3(0, 0.6, 0)) });
  let path_2 = pathCam({ startP: camera3D.position.clone().add(dir1), endP: obj.position.clone().add(dir2).add(new THREE.Vector3(0, 0.6, 0)) });

  Build.infProg.scene.pivot.userData.propPivot({ type: 'setPivot', obj: null });
  Build.camOrbit.effectP({ type: 'off' });
  LGS.ceilShadow({ shadow: true });

  movePathCam({ path: path_1, path_2: path_2, type: 'first' });

  Build.render();
}

export function goFly() {
  let camera3D = Build.camera3D;
  if (!Build.camOrbit.activeCam.isCam3D) return;

  Build.camOrbit.setStopMove({ value: true });

  Build.container.style.cursor = 'default';
  camera3D.userData.camera.type = '';

  ManageWP.enablePoints({ show: false });
  CRM.visibleCursorP360({ visible: false });
  //API.apiPIA.buttonExitCamWalkUI(false);

  if (1 == 1) {
    let posCenter = camera3D.userData.camera.d3.targetO.position;

    let radius = new THREE.Vector3().distanceTo(new THREE.Vector3(camera3D.userData.camera.save.pos.x, 0, camera3D.userData.camera.save.pos.z));

    camera3D.updateMatrixWorld();
    let dir = camera3D.getWorldDirection(new THREE.Vector3());
    dir = new THREE.Vector3(dir.x, 0, dir.z).normalize();

    let radXZ = Math.atan2(dir.z, dir.x);
    let pos = new THREE.Vector3();
    pos.x = -radius * Math.cos(radXZ) + 0;
    pos.z = -radius * Math.sin(radXZ) + 0;
    pos.y = camera3D.userData.camera.save.pos.y;

    let dir1 = camera3D.getWorldDirection(new THREE.Vector3());
    dir1 = new THREE.Vector3().addScaledVector(dir1, 3);

    let path_1 = pathCam({ startP: camera3D.position, endP: pos });
    let path_2 = pathCam({ startP: camera3D.position.clone().add(dir1), endP: new THREE.Vector3(0, posCenter.y, 0) });

    Build.infProg.scene.pivot.userData.propPivot({ type: 'setPivot', obj: null });
    Build.camOrbit.effectP({ type: 'off' });
    LGS.ceilShadow({ shadow: false });

    movePathCam({ path: path_1, path_2: path_2, type: 'fly' });
  }

  PANOR.showHidePanorama({ visible: false });

  HIDDO.wallAfterRender_3();

  Build.render();
}

function pathCam(params) {
  let startP = params.startP;
  let endP = params.endP;
  let helpTool = params.helpTool;

  let count = 21;
  let dist = startP.distanceTo(endP);
  let dir = new THREE.Vector3().subVectors(endP, startP).normalize();
  let unit = new THREE.Vector3().addScaledVector(dir, dist / (count - 1));

  let points = [];

  for (let i = 0; i < count; i++) {
    points[i] = new THREE.Vector3().addScaledVector(unit, i);
    points[i].add(startP);
  }

  let path = {};
  path.p1 = 0;
  path.p2 = 1;
  path.pi = 0;
  path.points = points;

  if (helpTool) {
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    let line = new THREE.Line(geometry, material);
    Build.scene.add(line);

    for (let i = 0; i < points.length; i++) {
      let o = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
      o.position.copy(points[i]);
      Build.scene.add(o);
    }
  }

  return path;
}

function movePathCam(params) {
  let camera3D = Build.camera3D;
  if (!Build.camOrbit.activeCam.isCam3D) return;

  let path = params.path;
  let path_2 = params.path_2;

  let length = path.points.length;
  let t2 = (path.p1 + path.pi) / length;
  let p1 = Math.floor(path.p1 + path.pi) % length;
  let p2 = (p1 + 1) % length;

  if (path.pi >= 1) {
    path.pi = 0;
  }

  let points = path.points;

  let pos = new THREE.Vector3();
  pos = new THREE.Vector3().subVectors(points[p2], points[p1]);
  pos = new THREE.Vector3().addScaledVector(pos, path.pi);
  pos.add(points[p1]);

  camera3D.position.copy(pos);

  if (path_2) {
    let points_2 = path_2.points;

    let pos_2 = new THREE.Vector3();
    pos_2 = new THREE.Vector3().subVectors(points_2[p2], points_2[p1]);
    pos_2 = new THREE.Vector3().addScaledVector(pos_2, path.pi);
    pos_2.add(points_2[p1]);

    camera3D.lookAt(pos_2);
  }

  path.p1 = p1;
  path.p2 = p2;
  path.pi += kof.speed + 0.003;
  //path.pi = Math.round(path.pi * 100)/100;

  if (1 == 1) {
    HIDDO.showHideObjCeil();
  }

  if (params.type == 'fly') {
    camera3D.fov += (camera3D.userData.camera.fov.fly - camera3D.fov) * t2;
  }
  if (params.type == 'first') {
    camera3D.fov += (camera3D.userData.camera.fov.first - camera3D.fov) * t2;
  }
  camera3D.updateProjectionMatrix();

  if (IFP.ManageIP) IFP.ManageIP.rotPoints();

  if (p1 + 1 < length) {
    requestAnimationFrame(function () {
      movePathCam({ path: path, path_2: path_2, type: params.type });
    });
  } else {
    camera3D.userData.camera.type = params.type;

    if (camera3D.userData.camera.type == 'fly') {
      ManageWP.enablePoints({ show: true });
      CRM.visibleCursorP360({ visible: false });
      //API.apiPIA.buttonExitCamWalkUI(false);

      camera3D.fov = camera3D.userData.camera.fov.fly;
    }
    if (camera3D.userData.camera.type == 'first') {
      ManageWP.enablePoints({ show: false });
      CRM.visibleCursorP360({ visible: true });
      //API.apiPIA.buttonExitCamWalkUI(true);

      HIDDO.showAllWallRender_2();
      PANOR.showHidePanorama();
      camera3D.fov = camera3D.userData.camera.fov.first;
    }

    Build.camOrbit.setStopMove({ value: false });
    Build.camOrbit.effectP({ type: 'on' });

    camera3D.updateProjectionMatrix();
  }

  Build.render();
}
