import * as THREE from 'three';
import * as Build from './walker';
import * as HIDDO from './HiddenObject.js';
import * as WKP from './walkPoint.js';
import * as CRM from './cursorMove.js';
import * as IFP from './infoPoint.js';
import * as AOBJ from './actionObj.js';

export class CameraOrbit {
  constructor({ container, renderer, scene }) {
    this.container = container;
    this.renderer = renderer;
    this.scene = scene;
    this.cam2D = this.initCam2D();
    this.cam3D = this.initCam3D();
    this.planeMath = this.initPlaneMath();
    this.activeCam = this.cam3D;

    this.animateCam = false;
    this.detectBrowser = this.detectBrowser();

    this.stopMove = false;

    this.mouse = {};
    this.mouse.button = '';
    this.mouse.event = null;
    this.mouse.down = false;
    this.mouse.move = false;
    this.mouse.pos = {};
    this.mouse.pos.x = 0;
    this.mouse.pos.y = 0;

    this.mouse.th = {};
    this.mouse.th.pos = [];
    this.mouse.th.pos[0] = {};
    this.mouse.th.pos[1] = {};
    this.mouse.th.pos[1].x = new THREE.Vector2();
    this.mouse.th.pos[1].y = new THREE.Vector2();
    this.mouse.th.ratio1 = new THREE.Vector2();
    this.mouse.th.camDist = new THREE.Vector3();

    this.sphericalDelta = {};
    this.sphericalDelta.theta = 0;
    this.sphericalDelta.phi = 0;

    this.initEvent();
    this.startPosCam3D({ pos: new THREE.Vector3(8, 15, 15), lookAt: new THREE.Vector3(0, 1, 0) });
  }

  initEvent() {
    let mouseDown = this.mouseDown.bind(this);
    let mouseMove = this.mouseMove.bind(this);
    let mouseUp = this.mouseUp.bind(this);
    let mouseWheel = this.mouseWheel.bind(this);
    let windowResize = this.windowResize.bind(this);

    this.container.addEventListener('mousedown', mouseDown, false);
    this.container.addEventListener('touchstart', mouseDown, false);

    this.container.addEventListener('mousemove', mouseMove, false);
    this.container.addEventListener('touchmove', mouseMove, false);

    this.container.addEventListener('mouseup', mouseUp, false);
    this.container.addEventListener('touchend', mouseUp, false);

    this.container.addEventListener('DOMMouseScroll', mouseWheel, false);
    this.container.addEventListener('mousewheel', mouseWheel, false);

    window.addEventListener('resize', windowResize, false);
  }

  windowResize() {
    const canvas = this.container;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.renderer.setSize(width, height);
    if (Build.composer) Build.composer.setSize(width, height);
    if (Build.fxaaPass) {
      Build.fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * this.renderer.getPixelRatio());
      Build.fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * this.renderer.getPixelRatio());
    }

    let aspect = width / height;
    let d = 5;

    this.cam2D.left = -d * aspect;
    this.cam2D.right = d * aspect;
    this.cam2D.top = d;
    this.cam2D.bottom = -d;
    this.cam2D.updateProjectionMatrix();

    this.cam3D.aspect = aspect;
    this.cam3D.updateProjectionMatrix();

    this.render();
  }

  setStopMove({ value }) {
    this.stopMove = value;

    this.mouse.button = '';
    this.mouse.down = false;
    this.mouse.move = false;
  }

  initCam2D() {
    let aspect = this.container.clientWidth / this.container.clientHeight;
    let d = 5;
    let camera2D = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera2D.position.set(0, 10, 0);
    camera2D.lookAt(this.scene.position);
    camera2D.zoom = 1;
    camera2D.updateMatrixWorld();
    camera2D.updateProjectionMatrix();

    camera2D.isCam2D = true;

    return camera2D;
  }

  initCam3D() {
    let camera3D = new THREE.PerspectiveCamera(40, this.container.clientWidth / this.container.clientHeight, 0.01, 1000);
    camera3D.rotation.order = 'YZX'; //'ZYX'
    camera3D.position.set(5, 7, 5);

    camera3D.userData.camera = {};
    camera3D.userData.camera.save = {};
    camera3D.userData.camera.save.pos = new THREE.Vector3();
    camera3D.userData.camera.save.radius = 0;

    camera3D.userData.camera.d3 = { theta: 0, phi: 75 };
    camera3D.userData.camera.d3.minDist = 0;
    camera3D.userData.camera.d3.targetO = targetO(this.scene);
    camera3D.userData.camera.type = 'fly';
    camera3D.userData.camera.click = {};
    camera3D.userData.camera.click.pos = new THREE.Vector3();
    camera3D.userData.camera.fov = {};
    camera3D.userData.camera.fov.fly = 40;
    camera3D.userData.camera.fov.first = 65;

    camera3D.isCam3D = true;

    function targetO(scene) {
      let material = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 1, depthTest: false });
      let obj = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), material);
      obj.position.copy(new THREE.Vector3(0, 1, 0));
      obj.renderOrder = 2;
      obj.visible = false;
      scene.add(obj);

      return obj;
    }

    return camera3D;
  }

  initPlaneMath() {
    let geometry = new THREE.PlaneGeometry(10000, 10000);
    let material = new THREE.MeshStandardMaterial({ color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    material.visible = false;
    let planeMath = new THREE.Mesh(geometry, material);
    planeMath.rotation.set(-Math.PI / 2, 0, 0);
    this.scene.add(planeMath);

    return planeMath;
  }

  startPosCam3D({ pos, lookAt }) {
    this.cam3D.position.copy(pos);
    this.cam3D.lookAt(lookAt);

    this.cam3D.userData.camera.save.pos = this.cam3D.position.clone();
    this.cam3D.userData.camera.d3.targetO.position.copy(lookAt);
    this.cam3D.userData.camera.save.radius = this.cam3D.userData.camera.d3.targetO.position.distanceTo(this.cam3D.position);
  }

  mouseDown(event) {
    if (this.stopMove) return;
    this.mouse.down = true;
    this.mouse.move = false;
    this.mouse.event = event;

    switch (event.button) {
      case 0:
        this.mouse.button = 'left';
        break;
      case 1:
        this.mouse.button = 'right';
        break;
      case 2:
        this.mouse.button = 'right';
        break;
    }

    if (event.changedTouches) {
      event.clientX = event.targetTouches[0].clientX;
      event.clientY = event.targetTouches[0].clientY;
      this.mouse.button = 'left';

      if (event.targetTouches.length == 2) {
        this.mouse.button = 'right';
        let th1 = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
        let th2 = { x: event.targetTouches[1].clientX, y: event.targetTouches[1].clientY };

        this.mouse.th.pos[0] = th1;
        this.mouse.th.pos[1] = th2;

        this.mouse.th.ratio1 = new THREE.Vector2(th2.x, th2.y).distanceTo(new THREE.Vector2(th1.x, th1.y));
        this.mouse.th.camDist = this.cam3D.userData.camera.d3.targetO.position.distanceTo(this.cam3D.position);
      }
    }

    this.startCam2D({ event: event });
    this.startCam3D({ event: event, button: this.mouse.button });

    this.render();
  }

  mouseMove(event) {
    this.container.style.cursor = 'default';

    if (this.stopMove) return;
    if (!this.mouse.down) return;

    if (event.changedTouches) {
      event.clientX = event.targetTouches[0].clientX;
      event.clientY = event.targetTouches[0].clientY;
    }

    this.mouse.move = true;
    this.mouse.event = event;
  }

  mouseUp(event) {
    if (this.stopMove) return;

    this.animateCamMove({ stop: true });
    this.animateCamEnd({ button: this.mouse.button });

    if (this.mouse.down && !this.mouse.move) AOBJ.rayHitObj({ event: event });

    this.mouse.button = '';
    this.mouse.down = false;
    this.mouse.move = false;
  }

  startCam2D({ event }) {
    if (!this.activeCam.isCam2D) return;
    let camera2D = this.cam2D;

    let planeMath = this.planeMath;
    planeMath.position.set(camera2D.position.x, 0, camera2D.position.z);
    planeMath.rotation.set(-Math.PI / 2, 0, 0);
    planeMath.updateMatrixWorld();

    let intersects = this.rayIntersect(event, planeMath, 'one');

    this.mouse.pos.x = intersects[0].point.x;
    this.mouse.pos.y = intersects[0].point.z;
  }

  startCam3D({ event, button }) {
    if (!this.activeCam.isCam3D) return;
    let camera3D = this.cam3D;

    this.mouse.pos.x = event.clientX;
    this.mouse.pos.y = event.clientY;
    this.sphericalDelta.theta = 0;
    this.sphericalDelta.phi = 0;

    if (button == 'left') {
      //var dir = camera.getWorldDirection();
      let dir = new THREE.Vector3().subVectors(camera3D.userData.camera.d3.targetO.position, camera3D.position).normalize();

      // получаем угол наклона камеры к target (к точке куда она смотрит)
      let dergree = THREE.Math.radToDeg(dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z))) * 2;
      if (dir.y > 0) dergree *= -1;

      // получаем угол направления (на плоскости) камеры к target
      dir.y = 0;
      dir.normalize();

      camera3D.userData.camera.d3.theta = THREE.Math.radToDeg(Math.atan2(dir.x, dir.z) - Math.PI) * 2;
      camera3D.userData.camera.d3.phi = dergree;
    }

    this.animateCamMove({ start: true });
  }

  animateCamMove({ start = false, stop = false } = {}) {
    if (start) this.animateCam = true;
    if (stop) this.animateCam = false;
    if (!this.animateCam) return;

    this.moveCam3D();
    Build.infProg.scene.pivot.userData.propPivot({ type: 'setScale' });

    requestAnimationFrame(() => this.animateCamMove());

    this.effectP({ type: 'off' });
  }

  moveCam3D({ button = this.mouse.button } = {}) {
    let event = this.mouse.event;

    if (this.cam3D.userData.camera.type == 'fly') this.moveCam3DFly({ event, button });
    if (this.cam3D.userData.camera.type == 'first') this.moveCam3DFirst({ event, button });

    if (event.targetTouches) {
    } else {
      CRM.rayCursor(event);
    }

    this.render();
  }

  moveCam3DFly({ event, button }) {
    let camera3D = this.cam3D;

    if (button == 'left') {
      let theta = -((event.clientX - this.mouse.pos.x) * 0.3) + this.sphericalDelta.theta + camera3D.userData.camera.d3.theta;
      let phi = (event.clientY - this.mouse.pos.y) * 0.3 + this.sphericalDelta.phi + camera3D.userData.camera.d3.phi;

      phi = Math.min(170, Math.max(10, phi));

      let radious = camera3D.userData.camera.d3.targetO.position.distanceTo(camera3D.position);

      camera3D.position.x = radious * Math.sin((theta * Math.PI) / 360) * Math.cos((phi * Math.PI) / 360);
      camera3D.position.y = radious * Math.sin((phi * Math.PI) / 360);
      camera3D.position.z = radious * Math.cos((theta * Math.PI) / 360) * Math.cos((phi * Math.PI) / 360);

      camera3D.position.add(camera3D.userData.camera.d3.targetO.position);
      camera3D.lookAt(camera3D.userData.camera.d3.targetO.position);

      camera3D.userData.camera.d3.targetO.rotation.set(0, camera3D.rotation.y, 0);

      this.sphericalDelta.theta -= (40 * (event.clientX - this.mouse.pos.x)) / this.container.clientHeight;
      this.sphericalDelta.theta *= 1 - 0.1;
      //this.sphericalDelta.theta = 0;

      this.sphericalDelta.phi += (40 * (event.clientY - this.mouse.pos.y)) / this.container.clientHeight;
      this.sphericalDelta.phi *= 1 - 0.1;
      //this.sphericalDelta.phi *= 0;

      this.mouse.pos.x = event.clientX;
      this.mouse.pos.y = event.clientY;
      camera3D.userData.camera.d3.theta = theta;
      camera3D.userData.camera.d3.phi = phi;
    }

    if (button == 'right') {
      if (event.targetTouches && event.targetTouches.length == 2) {
        let th1 = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
        let th2 = { x: event.targetTouches[1].clientX, y: event.targetTouches[1].clientY };

        let ratio2 = new THREE.Vector2(th2.x, th2.y).distanceTo(new THREE.Vector2(th1.x, th1.y));

        this.touchZoomCam3D(this.mouse.th.ratio1 / ratio2);

        event.clientX = event.targetTouches[1].clientX - this.mouse.th.pos[1].x + event.targetTouches[0].clientX;
        event.clientY = event.targetTouches[1].clientY - this.mouse.th.pos[1].y + event.targetTouches[0].clientY;
      }
    }

    if (WKP.ManageWP) WKP.ManageWP.rotPoints();
    if (IFP.ManageIP) IFP.ManageIP.rotPoints();

    HIDDO.wallAfterRender_3();
    HIDDO.showHideObjCeil();
  }

  moveCam3DFirst({ event, button }) {
    if (button !== 'left') return;

    let camera3D = this.cam3D;

    camera3D.rotation.x -= this.sphericalDelta.phi / 5;
    camera3D.rotation.y -= this.sphericalDelta.theta / 5;

    if (camera3D.rotation.x < -1.3439) camera3D.rotation.x = -1.3439;
    else if (camera3D.rotation.x > 1.3439) camera3D.rotation.x = 1.3439;

    this.sphericalDelta.theta += (1 * (event.clientX - this.mouse.pos.x)) / this.container.clientHeight;
    this.sphericalDelta.theta *= 1 - 0.1;
    //this.sphericalDelta.theta = 0;

    this.sphericalDelta.phi += (1 * (event.clientY - this.mouse.pos.y)) / this.container.clientHeight;
    this.sphericalDelta.phi *= 1 - 0.1;
    //this.sphericalDelta.phi *= 0;

    this.mouse.pos.x = event.clientX;
    this.mouse.pos.y = event.clientY;

    //camera3D.userData.camera.d3.targetO.position.set( camera3D.position.x, camera3D.userData.camera.d3.targetO.position.y, camera3D.position.z );
    camera3D.userData.camera.d3.targetO.rotation.set(0, camera3D.rotation.y, 0);

    if (IFP.ManageIP) IFP.ManageIP.rotPoints();
  }

  animateCamEnd({ button }) {
    if (Math.abs(this.sphericalDelta.theta) > 0.01 || Math.abs(this.sphericalDelta.phi) > 0.01) {
      this.moveCam3D({ button });
      Build.infProg.scene.pivot.userData.propPivot({ type: 'setScale' });

      requestAnimationFrame(() => this.animateCamEnd({ button }));
    } else {
      this.effectP({ type: 'on' });
      this.render();
    }
  }

  touchZoomCam3D(zoom) {
    if (this.cam3D.userData.camera.type !== 'fly') return;

    let dist = zoom * this.mouse.th.camDist;
    let pos1 = this.cam3D.userData.camera.d3.targetO.position;

    let dir = new THREE.Vector3().subVectors(this.cam3D.position, pos1).normalize();
    dir = new THREE.Vector3().addScaledVector(dir, dist);
    let pos3 = new THREE.Vector3().addVectors(pos1, dir);

    this.cam3D.position.copy(pos3);
  }

  mouseWheel(e) {
    e.preventDefault();

    let delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;
    if (this.detectBrowser == 'Chrome' || this.detectBrowser == 'Opera') delta = -delta;

    if (this.activeCam.isCam2D) this.cameraZoom2D(delta);
    if (this.activeCam.isCam3D && this.cam3D.userData.camera.type == 'fly') this.cameraZoomFly3D(delta, 1);
    if (this.activeCam.isCam3D && this.cam3D.userData.camera.type == 'first') this.cameraZoomFirst3D(delta);

    Build.infProg.scene.pivot.userData.propPivot({ type: 'setScale' });

    this.render();
  }

  cameraZoom2D(delta) {
    let zoom = this.cam2D.zoom - delta * 0.1 * (this.cam2D.zoom / 2);

    this.cam2D.zoom = zoom;
    this.cam2D.updateProjectionMatrix();
  }

  cameraZoomFly3D(delta, z) {
    let movement = delta < 0 ? z : -z;
    movement *= 1.2;

    let pos1 = this.cam3D.userData.camera.d3.targetO.position;
    let pos2 = this.cam3D.position.clone();

    let dir = this.cam3D.getWorldDirection(new THREE.Vector3());
    let offset = new THREE.Vector3().addScaledVector(dir, movement);

    pos1 = offsetTargetCam({ posCenter: pos1, dir: dir, dist: this.cam3D.userData.camera.d3.minDist });
    offset = stopTargetCam({ posCenter: pos1, posCam: pos2, offset: offset });

    // устанавливаем расстояние насколько близко можно приблизиться камерой к target
    function offsetTargetCam({ posCenter, dir, dist }) {
      let dirInvers = new THREE.Vector3(-dir.x, -dir.y, -dir.z);
      let offset = new THREE.Vector3().addScaledVector(dirInvers, dist);

      let newPos = new THREE.Vector3().addVectors(posCenter, offset);

      return newPos;
    }

    // запрещаем перемещение камеры за пределы центра/target
    function stopTargetCam({ posCenter, posCam, offset }) {
      let newPos = new THREE.Vector3().addVectors(posCam, offset);
      let dir2 = new THREE.Vector3().subVectors(posCenter, newPos).normalize();

      let dot = dir.dot(dir2);
      if (dot < 0) offset = new THREE.Vector3().subVectors(posCenter, posCam);

      return offset;
    }

    this.cam3D.position.add(offset);
  }

  cameraZoomFirst3D(delta) {
    let movement = delta < 0 ? 3 : -3;

    let fov = this.cam3D.fov - movement;
    if (fov < 40) fov = 40;
    if (fov > 120) fov = 120;

    this.cam3D.fov = fov;
    this.cam3D.userData.camera.fov.first = fov;

    this.cam3D.updateProjectionMatrix();
  }

  rayIntersect(event, obj, t) {
    let mouse = getMousePosition(event);

    function getMousePosition(event) {
      const rect = this.container.getBoundingClientRect();

      let x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
      let y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;

      return new THREE.Vector2(x, y);
    }

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.activeCam);

    let intersects = null;
    if (t == 'one') {
      intersects = raycaster.intersectObject(obj);
    } else if (t == 'arr') {
      intersects = raycaster.intersectObjects(obj, true);
    }

    return intersects;
  }

  effectP({ type, value }) {
    if (type == 'on') value = true;
    if (type == 'off') value = false;

    if (Build.fxaaPass) Build.fxaaPass.enabled = value;
  }

  detectBrowser() {
    let ua = navigator.userAgent;

    if (ua.search(/MSIE/) > 0) return 'Explorer';
    if (ua.search(/Firefox/) > 0) return 'Firefox';
    if (ua.search(/Opera/) > 0) return 'Opera';
    if (ua.search(/Chrome/) > 0) return 'Chrome';
    if (ua.search(/Safari/) > 0) return 'Safari';
    if (ua.search(/Konqueror/) > 0) return 'Konqueror';
    if (ua.search(/Iceweasel/) > 0) return 'Debian';
    if (ua.search(/SeaMonkey/) > 0) return 'SeaMonkey';

    // Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
    if (ua.search(/Gecko/) > 0) return 'Gecko';

    // а может это вообще поисковый робот
    return 'Search Bot';
  }

  render() {
    Build.render();
  }
}
