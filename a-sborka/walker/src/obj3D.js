import * as THREE from 'three';
import * as Build from './walker';
import * as MSV from './mouseClick.js';
//import * as IFP from './infoPoint.js';
//import * as LGS from './lightShadow.js';

//import * as LOADS from './loaderScene.js';

export class Obj3D extends THREE.Mesh {
  constructor({ geometry, material, scale, file = '' }) {
    super(geometry, material);

    this.crBox({ scale: scale, file: file });
  }

  crBox({ scale, file }) {
    if (scale) this.scale.copy(scale);

    this.userData.file = file;
    this.userData.pivot = null;
    this.userData.iPoint = null;

    Build.scene.add(this);
    Build.infProg.scene.furnitures.push(this);
  }

  attachObj3D({ obj, userData }) {
    if (userData) this.userData = { ...this.userData, ...userData };
    this.add(obj);
    this.material.visible = false;

    //if (IFP.ManageIP) IFP.ManageIP.createPoint({ obj: this });

    //this.children[0].traverse((child) => LGS.assingShadow({ child: child }));
  }

  textureFix() {
    let obj = this.children[0];

    obj.traverse(function (child) {
      if (child.isMesh) {
        let materialArray = [];
        if (child.material instanceof Array) {
          materialArray = child.material;
        } else {
          materialArray = [child.material];
        }

        materialArray.forEach(function (mtrl, idx) {
          if (mtrl.map) {
            mtrl.map.repeat.set(1.0, 1.0);
            mtrl.map.offset.set(0, 0);

            let map = mtrl.map;
            map.wrapS = map.wrapT = THREE.RepeatWrapping;

            map.encoding = THREE.sRGBEncoding;
            map.needsUpdate = true;
          }
        });
      }
    });
  }

  moveObj({ pos }) {
    this.position.copy(pos);

    this.limitMoveAxisY();
  }

  rotateObj({ posCenter, angle }) {
    this.position.sub(posCenter);
    this.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    this.position.add(posCenter);

    this.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
  }

  limitMoveAxisY() {
    let box = this;

    let v = [];

    if (1 == 1) {
      box.updateMatrixWorld();
      box.geometry.computeBoundingBox();
      let bound = box.geometry.boundingBox;

      v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4(box.matrixWorld);
      v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4(box.matrixWorld);
      v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4(box.matrixWorld);
      v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4(box.matrixWorld);

      v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4(box.matrixWorld);
      v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4(box.matrixWorld);
      v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4(box.matrixWorld);
      v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4(box.matrixWorld);
    }

    let bound = { min: { x: Infinity, y: Infinity, z: Infinity }, max: { x: -Infinity, y: -Infinity, z: -Infinity } };

    for (let i = 0; i < v.length; i++) {
      if (v[i].y < bound.min.y) {
        bound.min.y = v[i].y;
      }
      if (v[i].y > bound.max.y) {
        bound.max.y = v[i].y;
      }
    }

    let offset = new THREE.Vector3();

    if (bound.min.y < Build.infProg.scene.boundMinFloor.min.y) {
      offset = new THREE.Vector3(0, Build.infProg.scene.boundMinFloor.min.y - bound.min.y, 0);
    }

    if (bound.max.y > Build.infProg.scene.boundMinFloor.max.y) {
      offset = new THREE.Vector3(0, Build.infProg.scene.boundMinFloor.max.y - bound.max.y, 0);
    }

    this.position.add(offset);
  }

  objHidePivot() {
    if (this.userData.pivot) Build.infProg.scene.newPivot.hide();
  }

  objOutline(show) {
    let arr = show ? [this] : [];
    Build.outlinePass.selectedObjects = arr;
  }

  render() {
    Build.render();
  }
}
