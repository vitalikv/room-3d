import * as THREE from 'three';
import * as Build from './walker.js';

export class ListOrder {
  constructor({ container }) {
    this.list = [];
    this.initEvent({ container: container });
  }

  initEvent({ container }) {
    let mouseDown = this.mouseDown.bind(this);

    container.addEventListener('mousedown', mouseDown, false);
    container.addEventListener('touchstart', mouseDown, false);
  }

  addItem({ key, arr, order, f }) {
    this.list.push({ key: key, arr: arr, order: order, f: f });

    this.list.sort((a, b) => {
      return a.order - b.order;
    });
  }

  mouseDown(event) {
    if (event.changedTouches) {
      event.clientX = event.targetTouches[0].clientX;
      event.clientY = event.targetTouches[0].clientY;
    }

    let list = this.list;

    for (var i = 0; i < list.length; i++) {
      let arr = list[i].arr.filter((o) => o.visible);

      let ray = rayIntersect(event, arr, 'arr');
      if (ray.length == 0) continue;

      list[i].f({ event, ray });
      return;
    }
  }
}

export function rayIntersect(event, obj, t, recursive = true) {
  if (event.changedTouches) {
    event.clientX = event.targetTouches[0].clientX;
    event.clientY = event.targetTouches[0].clientY;
  }

  let mouse = getMousePosition(event);

  function getMousePosition(event) {
    const rect = Build.renderer.domElement.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / Build.container.clientWidth) * 2 - 1;
    let y = -((event.clientY - rect.top) / Build.container.clientHeight) * 2 + 1;

    return new THREE.Vector2(x, y);
  }

  let raycaster = new THREE.Raycaster();

  raycaster.setFromCamera(mouse, Build.camOrbit.activeCam);

  let intersects = null;
  if (t == 'one') {
    intersects = raycaster.intersectObject(obj);
  } else if (t == 'arr') {
    intersects = raycaster.intersectObjects(obj, recursive);
  }

  return intersects;
}
