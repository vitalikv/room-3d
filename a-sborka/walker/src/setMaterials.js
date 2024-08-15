import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';

export function matPop({ obj }) {
  obj.traverse((child) => {
    if (child.material) {
      let userData = {};
      userData.opacity = child.material.opacity;
      child.material.userData = userData;
      child.material.userData.tag1 = 'obj';
      setMat({ obj: child });
    }
  });
}

function setMat({ obj }) {
  if (!obj) return;
  let name = obj.material.name;

  let list = [];

  list[list.length] = { old: 'mattet', new: 'tulle', metalness: 0, roughness: 1 };
  list[list.length] = { old: 'matte', new: 'matt', metalness: 0, roughness: 1 };
  list[list.length] = { old: 'satin', new: 'semimatt', metalness: 0.19, roughness: 0.2 };
  list[list.length] = { old: 'semigloss', new: 'semiglossy', metalness: 0.3, roughness: 0.3 };
  list[list.length] = { old: 'glossy', new: 'glossy', metalness: 0.6, roughness: 0.3, envMap: true };
  list[list.length] = { old: 'brushed', new: 'brushed', metalness: 0.33, roughness: 0.23, envMap: true };
  list[list.length] = { old: 'polished', new: 'polished', metalness: 0.7, roughness: 0.1, envMap: true };
  list[list.length] = { old: 'reflective', new: 'reflective', metalness: 1, roughness: 0.0, envMap: true };
  list[list.length] = { old: 'chrome', new: 'chrome', metalness: 1.0, roughness: 0, envMap: true };
  list[list.length] = { old: 'mirror', new: 'mirror', metalness: 1, roughness: 0, envMap: true };
  list[list.length] = { old: 'glass', new: 'glass', metalness: 1, roughness: 0, opacity: 0.26 };
  list[list.length] = { old: 'steklo_blur', new: 'frostedglass', metalness: 0.45, roughness: 0.26, opacity: 0.26 };
  list[list.length] = { old: 'selfluminous', new: 'selfluminous', metalness: 0, roughness: 1 };

  for (let i = 0; i < list.length; i++) {
    if (new RegExp(list[i].old, 'i').test(name)) {
      let uuid = obj.material.uuid;

      let mat = obj.material.clone();
      disposeMat(obj);
      obj.material = mat;

      obj.material.uuid = uuid;
      obj.material.name = list[i].old;

      if (obj.material.map) obj.material.map.encoding = THREE.sRGBEncoding;
      if (obj.material.lightMap) obj.material.lightMap.encoding = THREE.sRGBEncoding;

      if (list[i].old == 'selfluminous') {
        obj.material.emissive = obj.material.color;
      }

      obj.material.metalness = list[i].metalness;
      obj.material.roughness = list[i].roughness;
      if (list[i].opacity) obj.material.opacity = list[i].opacity;
      obj.material.needsUpdate = true;

      if (list[i].envMap) obj.material.userData.envMap = true;

      //Build.render();

      break;
    }
  }
}

function disposeMat(node) {
  if (!node.material) return;

  let materialArray = node.material instanceof Array ? node.material : [node.material];

  materialArray.forEach(function (mtrl, idx) {
    if (mtrl.map) mtrl.map.dispose();
    if (mtrl.lightMap) mtrl.lightMap.dispose();
    if (mtrl.bumpMap) mtrl.bumpMap.dispose();
    if (mtrl.normalMap) mtrl.normalMap.dispose();
    if (mtrl.specularMap) mtrl.specularMap.dispose();
    if (mtrl.envMap) mtrl.envMap.dispose();
    mtrl.dispose();
  });

  Build.renderer.renderLists.dispose();
}
