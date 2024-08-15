import img_man from './images/infoP.png';

import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as MSV from './mouseClick.js';

export let stopClick = false;
export let ManageIP = null;

export function initInfoPoint() {
  ManageIP = new ManageInfoPoints();

  for (let i = 0; i < Build.infProg.scene.furnitures.length; i++) {
    ManageIP.createPoint({ obj: Build.infProg.scene.furnitures[i] });
  }
}

class ManageInfoPoints {
  geometry = null;
  material = null;
  arr = [];
  enabled = true;

  constructor() {
    this.geometry = this.crGeom();
    this.material = this.crMat();
    this.event();
  }

  crGeom() {
    let size = 0.1;
    if (Build.infProg.doc.browser == 'mobile') size = 0.2;

    return new THREE.CircleGeometry(size, 32);
  }

  crMat() {
    let map = new THREE.TextureLoader().load(img_man);
    map.repeat.set(1.0, 1.0);
    map.offset.set(0, 0);
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
    map.encoding = THREE.sRGBEncoding;
    //map.anisotropy = Build.renderer.capabilities.getMaxAnisotropy();
    map.needsUpdate = true;

    let material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      lightMap: Build.infProg.img.lightMap_1,
      map: map,
      transparent: true,
      opacity: 1,
      depthTest: false,
    });

    return material;
  }

  event() {
    Build.container.addEventListener('mousedown', (event) => this.clickDown({ event: event }));
    Build.container.addEventListener('mousemove', (event) => this.clickMove({ event: event }));
  }

  createPoint({ obj: obj }) {
    let point = new InfoPoint({ obj: obj, geom: this.geometry, mat: this.material.clone() });
    this.addItemInArr({ obj: point });
  }

  addItemInArr({ obj }) {
    this.arr.push(obj);
  }

  deleteItemInArr({ obj }) {
    deleteValueFromArrya({ arr: this.arr, o: obj });

    function deleteValueFromArrya({ arr, o }) {
      for (let i = arr.length - 1; i > -1; i--) {
        if (arr[i] == o) {
          arr.splice(i, 1);
          break;
        }
      }
    }
  }

  rotPoints() {
    let arr = this.arr;

    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].visible) continue;
      arr[i].setRotCam();
      arr[i].setScale();
    }
  }

  scalePoints() {
    let arr = this.arr;

    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].visible) continue;
      arr[i].setScale();
    }
  }

  enablePoints({ show }) {
    this.enabled = show;
    let arr = this.arr;

    for (let i = 0; i < arr.length; i++) {
      arr[i].visible = show;

      if (!arr[i].visible) continue;
      arr[i].setRotCam();
      arr[i].setScale();
      arr[i].setOpacity();
    }

    this.render();
  }

  clickDown({ event }) {
    if (stopClick) {
      stopClick = false;
      return;
    }

    let arrPoint = this.arr;
    if (arrPoint.length == 0) return;

    let arr = arrPoint.filter((o) => o.visible);

    let ray = MSV.rayIntersect(event, arr, 'arr');
    if (ray.length == 0) return;

    crHtmlWrapper({ event: event, obj: ray[0].object });
  }

  clickMove({ event }) {
    let arrPoint = this.arr;
    if (arrPoint.length == 0) return;

    let arr = arrPoint.filter((o) => o.visible);

    let ray = MSV.rayIntersect(event, arr, 'arr');
    if (ray.length == 0) return;

    Build.container.style.cursor = 'pointer';
  }

  render() {
    Build.render();
  }
}

class InfoPoint extends THREE.Mesh {
  constructor({ obj, geom, mat }) {
    super(geom, mat);

    this.create({ obj: obj });
  }

  create({ obj }) {
    this.userData.tag = 'infoPoint';
    this.userData.noShadow = true;
    this.userData.joinObj = obj;
    this.userData.joinObj.userData.iPoint = this;

    this.setPosCenter();
    this.setRotCam();
    this.setScale();

    Build.scene.add(this);

    obj.userData.infoPoint = this;
  }

  setPosCenter() {
    let obj = this.userData.joinObj;
    let pos = new THREE.Vector3();
    let count = 0;

    obj.updateMatrixWorld(true);

    obj.traverseVisible((child) => {
      if (child.isMesh) addPos(child);
    });

    function addPos(obj) {
      if (obj.geometry) {
        if (!obj.geometry.boundingSphere) obj.geometry.computeBoundingSphere();
        let posC = obj.geometry.boundingSphere.center.clone().applyMatrix4(obj.matrixWorld);
        pos.add(posC);
        count++;
      }
    }

    pos = new THREE.Vector3(pos.x / count, pos.y / count, pos.z / count);

    this.position.copy(pos);
  }

  setRotCam() {
    this.rotation.copy(Build.camera3D.rotation);
  }

  setScale() {
    let dist = Build.camera3D.position.distanceTo(this.position);
    if (dist > 6) dist = 6;
    let scale = dist / 6;
    this.scale.set(scale, scale, scale);
  }

  visibility({ show }) {
    this.visible = show;
  }

  setOpacity() {
    if (!ManageIP.enabled) return;

    let joinObj = this.userData.joinObj;
    this.visible = joinObj.renderOrder > 1 ? false : true;
  }

  delete() {
    let joinObj = this.userData.joinObj;
    joinObj.userData.infoPoint = null;

    ManageIP.deleteItemInArr({ obj: this });
    Build.scene.remove(this);
  }

  render() {
    Build.render();
  }
}

export function setStopClick(flag) {
  stopClick = flag;
}

function crHtmlWrapper({ obj: obj }) {
  let elWrap = document.createElement('div');
  elWrap.style.cssText = 'position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1; background: rgba(0, 0, 0, 0.2);';
  document.body.querySelector('[nameId="containerWrapper"]').appendChild(elWrap);

  let jsonInf = getInfoLotId({ obj: obj });
  let elText = crHtmlDescription({ obj: obj, elWrap: elWrap, jsonInf: jsonInf });

  elWrap.onmousedown = (event) => {
    if (!elText.contains(event.target)) {
      Build.camOrbit.setStopMove({ value: true });
      elWrap.onmouseup = (event) => {
        elWrap.remove();
        Build.camOrbit.setStopMove({ value: false });
      };
    }
  };

  function getInfoLotId(params) {
    let obj = params.obj;
    obj = obj.userData.joinObj;

    let inf = {};
    inf.name = 'name';
    inf.description = 'description';
    inf.price = 'price ₽';

    if (obj.userData.pop && obj.userData.pop.info) {
      inf.name = obj.userData.pop.info.name;
      inf.description = obj.userData.pop.info.description;
      inf.price = '';
    }

    return inf;
  }

  function crHtmlDescription(params) {
    let obj = params.obj;
    let elWrap = params.elWrap;

    let strPrice = jsonInf.price != '' ? `<div style='margin-top: 20px; color: #2F2F2F;'>${jsonInf.price}</div>` : '';

    let html = `<div style='position: fixed; background: #F5F7F6; border: 1px solid #E5EAF1; box-sizing: border-box; border-radius: 20px;'>
      <div style='display: flex; flex-direction: column; max-width: 200px; height: auto; margin: 30px 40px; font-size: 14px; line-height: 17px;'>
        <div style='color: #0057FF;'>${jsonInf.name}</div>
        <div style='color: #2F2F2F;'>${jsonInf.description}</div>
        ${strPrice}
      </div>
    </div>`;
    let elem = document.createElement('div');
    elem.innerHTML = html;
    elem = elem.firstChild;

    obj.updateMatrixWorld(true);
    if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
    let pos = obj.localToWorld(new THREE.Vector3(0, obj.geometry.boundingBox.max.y, 0));

    let tempV = pos.clone().project(Build.camera3D);
    let x = (tempV.x * 0.5 + 0.5) * Build.container.clientWidth;
    let y = (tempV.y * -0.5 + 0.5) * Build.container.clientHeight;

    elWrap.appendChild(elem);

    let widthEl = elem.getBoundingClientRect().width;

    elem.style.top = `${y - elem.clientHeight - 0}px`;
    elem.style.left = `${x - elem.clientWidth / 2}px`;

    let rect = elem.getBoundingClientRect();

    if (rect.x < 10) elem.style.left = '10px';
    if (rect.y < 10) elem.style.top = '10px';
    if (rect.x + widthEl + 10 > Build.container.clientWidth) elem.style.left = Build.container.clientWidth - widthEl - 10 + 'px';

    return elem;
  }
}
