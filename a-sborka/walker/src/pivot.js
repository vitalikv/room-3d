import * as THREE from 'three';
import * as Build from './walker';
import * as MSV from './mouseClick.js';

export function initPivot() {
  Build.infProg.scene.newPivot = new Pivot({ container: Build.container, scene: Build.scene });
}

class Pivot extends THREE.Group {
  constructor({ container, scene }) {
    super();

    this.initPivot({ scene: scene, container: container });
    this.initClick();

    this.render();
  }

  initPivot({ scene, container }) {
    this.userData.tag = 'pivot';
    this.userData.obj = null;
    this.userData.container = container;

    this.visible = false;
    scene.add(this);

    this.crObj();
    this.planeMath = this.crPlaneMath({ scene: scene });
  }

  crObj() {
    let material = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 1, depthTest: false, lightMap: Build.infProg.img.lightMap_1 });

    arrows({ pivot: this });
    crCone({ pivot: this });
    arcCircle({ pivot: this });

    function arrows({ pivot }) {
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

    function crCone({ pivot }) {
      let geometry = new THREE.ConeGeometry(0.2, 0.5, 32);
      let obj = new THREE.Mesh(geometry, material);
      obj.position.set(0, 0.2, 0);
      obj.userData.axis = 'y';
      pivot.add(obj);
    }

    function arcCircle({ pivot }) {
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
  }

  initClick() {
    let mouseDown = this.mouseDown.bind(this);
    Build.infProg.cl.ListClick.addItem({ key: 'pivot', arr: [this], order: 0, f: mouseDown });
  }

  crPlaneMath({ scene }) {
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

    scene.add(planeMath);

    return planeMath;
  }

  setPivot({ obj }) {
    this.userData.obj = obj;
    this.userData.obj.userData.pivot = this;

    let pos = obj.position;
    this.position.set(pos.x, pos.y, pos.z);
    this.rotation.copy(obj.rotation);
    this.visible = true;
    this.setScale();
  }

  mouseDown({ ray }) {
    Build.camOrbit.setStopMove({ value: true });
    let inf = this.startPivot({ ray: ray });
    this.render();

    this.userData.container.onmousemove = (event) => {
      let intersects = MSV.rayIntersect(event, this.planeMath, 'one');
      if (intersects.length == 0) return;
      let pos = intersects[0].point;

      if (inf.type == 'moveAxis') this.movePivot({ inf: inf, pos: pos });
      if (inf.type == 'gizmo') this.rotatePivot({ inf: inf, pos: pos });
    };

    this.userData.container.onmouseup = (event) => {
      this.userData.container.onmousemove = null;
      this.userData.container.onmouseup = null;

      Build.camOrbit.setStopMove({ value: false });
    };
  }

  startPivot({ ray }) {
    let obj = ray[0].object;
    let inf = { type: '' };

    if (obj.userData.axis) {
      inf.type = 'moveAxis';

      this.planeMath.position.copy(ray[0].point);
      this.planeMath.rotation.set(Math.PI / 2, 0, 0);
      if (obj.userData.axis == 'y') this.planeMath.rotation.copy(Build.camera3D.rotation);
      this.planeMath.updateMatrixWorld();

      obj.updateMatrixWorld();
      inf.startPos = this.position.clone().sub(ray[0].point);
      inf.dir = new THREE.Vector3().subVectors(this.position, obj.getWorldPosition(new THREE.Vector3())).normalize();
    }

    if (obj.userData.gizmo) {
      inf.type = 'gizmo';

      this.planeMath.position.set(this.position.x, ray[0].point.y, this.position.z);
      this.planeMath.rotation.set(Math.PI / 2, 0, 0);
      this.planeMath.updateMatrixWorld();

      let dir = this.planeMath.worldToLocal(ray[0].point.clone());
      inf.rotY = Math.atan2(dir.x, dir.y);
    }

    return inf;
  }

  movePivot({ inf, pos }) {
    let dist = inf.dir.dot(new THREE.Vector3().subVectors(pos.clone().add(inf.startPos), this.position));
    pos = this.position.clone().add(new THREE.Vector3().addScaledVector(inf.dir, dist));

    this.position.copy(pos);

    if (this.userData.obj) {
      this.userData.obj.moveObj({ pos: this.position });
      this.position.copy(this.userData.obj.position);
    }

    this.setScale();

    this.render();
  }

  rotatePivot({ inf, pos }) {
    let dir = this.planeMath.worldToLocal(pos.clone());
    let rotY = Math.atan2(dir.x, dir.y);

    this.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotY - inf.rotY);

    if (this.userData.obj) this.userData.obj.rotateObj({ posCenter: this.position, angle: rotY - inf.rotY });

    inf.rotY = rotY;

    this.render();
  }

  setScale() {
    if (!this.visible) return;

    let dist = Build.camera3D.position.distanceTo(this.position);
    let scale = dist / 50;
    if (Build.camera3D.userData.camera.type == 'first') scale *= 3;
    //scale = scale > 1.4 ? scale : 1.4;
    this.scale.set(scale, scale, scale);
  }

  hide() {
    this.visible = false;

    if (this.userData.obj) this.userData.obj.userData.pivot = null;
    this.userData.obj = null;
  }

  render() {
    Build.render();
  }
}
