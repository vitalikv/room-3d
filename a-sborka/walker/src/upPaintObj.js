import * as THREE from '../node_modules/three/build/three.module';
import * as Build from './walker';
import * as SLO from './selectObj.js';

let arrTexture = [];

export async function upTextureObj({ obj, lotId }) {
  let arr = SLO.infLots;

  let color = null;
  let src = null;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == lotId) {
      if (arr[i].color) color = arr[i].color;
      if (arr[i].sourceImageURL) src = arr[i].sourceImageURL;
      break;
    }
  }

  if (obj.material.map) {
    obj.material.map.dispose();
    obj.material.map = null;
    obj.material.color = new THREE.Color('#ffffff');
    obj.material.needsUpdate = true;
    Build.render();
  }

  if (color) {
    obj.material.color = new THREE.Color('#' + color);
    obj.material.needsUpdate = true;
    Build.render();
  }

  if (src) {
    if (Build.infProg.doc.browser == 'mobile') {
      src = src.replace('thumb1024x1024', 'thumb500x500');
    }

    let ind = arrTexture.findIndex((arr) => arr.src == src);

    if (ind == -1) {
      let n = arrTexture.length;
      arrTexture[n] = {};
      arrTexture[n].src = src;
      arrTexture[n].texture = new THREE.Texture();
      arrTexture[n].objs = [obj];
      arrTexture[n].load = false;

      let map = arrTexture[n].texture;
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.encoding = THREE.sRGBEncoding;
      map.needsUpdate = true;

      map.image = new Image();

      let response = await fetch(src, { method: 'GET' });
      let blob = await response.blob();
      map.image.src = window.URL.createObjectURL(blob);

      map.image.onload = () => {
        let objs = arrTexture[n].objs;

        for (let i = 0; i < objs.length; i++) {
          objs[i].material.map = map;
          objs[i].material.needsUpdate = true;
        }

        arrTexture[n].objs = [];
        arrTexture[n].load = true;

        window.URL.revokeObjectURL(map.image.src);

        Build.render();
      };
    } else {
      let load = arrTexture[ind].load;

      if (load) {
        let map = arrTexture[ind].texture;
        obj.material.map = map;
        obj.material.needsUpdate = true;
        Build.render();
      } else {
        arrTexture[ind].objs.push(obj);
      }
    }
  }
}
