import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as LOADS from './loaderScene.js';
import * as OAS from './obj3D.js';
import * as SMAT from './setMaterials.js';
import * as SLO from './selectObj.js';
import * as UPPOBJ from './upPaintObj';

// загрузка объекта из json файла
export function initFurnitures({ json }) {
  if (!json.furnitures) return;
  if (!Array.isArray(json.furnitures)) return;

  let arr = [];

  for (let i = 0; i < json.furnitures.length; i++) {
    let o = json.furnitures[i];
    if (!o.file) continue;

    o.volume = 1;
    if (o.bounds && o.bounds.size) {
      o.volume = o.bounds.size.x * o.bounds.size.y * o.bounds.size.z;
      if (!Build.isNumeric(o.volume)) o.volume = 1;
    }

    arr.push(o);
  }

  arr.sort((a, b) => b.volume - a.volume); // сортируем от большего к уменьшему

  // create box под объект
  for (let i = 0; i < arr.length; i++) {
    let o = arr[i];

    if (!o.file) continue;
    if (!o.bounds && !o.bounds.size && !o.bounds.center) continue;

    let geometry = new THREE.BoxGeometry(o.bounds.size.x, o.bounds.size.y, o.bounds.size.z);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
    let obj = new OAS.Obj3D({ geometry: geometry, material: material, file: o.file });

    obj.position.set(-o.bounds.center.x, o.bounds.center.y, o.bounds.center.z);
  }

  return arr;
}

export function attachObjFurnitures({ obj, file }) {
  let arr = Build.infProg.scene.furnitures;

  for (let i = 0; i < arr.length; i++) {
    if (file !== arr[i].userData.file) continue;

    obj.position.sub(arr[i].position);
    arr[i].attachObj3D({ obj: obj, userData: { ...obj.userData } });

    obj = arr[i];

    break;
  }

  return obj;
}

// загрузка объекта из POP
export function loadObjPop({ paint, lotId }) {
  let info = {};
  let sizeDef = new THREE.Vector3();

  let arr = SLO.infLots;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == lotId) {
      let arrSize = arr[i].size.split(',');
      sizeDef = new THREE.Vector3(arrSize[0], arrSize[1], arrSize[2]);
      info.url = arr[i].fileJson;
      info.name = arr[i].shortName.length > 0 ? arr[i].shortName : arr[i].caption;
      info.description = arr[i].description;
      info.components = arr[i].components;
      info.children_lots = arr[i].children_lots;
      break;
    }
  }

  if (!info.url) {
    Build.render();
    return;
  }

  if (!paint.container) return;

  let size = paint.container.size;
  let scale = new THREE.Vector3(size.x / sizeDef.x, size.y / sizeDef.y, size.z / sizeDef.z);
  let pos = new THREE.Vector3(paint.container.center.x, paint.container.center.y, paint.container.center.z);
  let lookV = new THREE.Vector3(paint.container.forward.x, paint.container.forward.y, paint.container.forward.z);

  let geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  let material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
  let box = new OAS.Obj3D({ geometry: geometry, material: material, scale: scale });
  box.lookAt(lookV);
  box.position.copy(Build.infProg.scene.offset);
  box.position.add(pos);

  Build.render();

  paint.objScene = [box];

  new THREE.ObjectLoader().load(
    info.url,

    function (obj) {
      obj.position.y -= size.y / 2;
      box.attachObj3D({ obj: obj, userData: { lotId, info, ...obj.userData } });
      box.textureFix();
      //SMAT.matPop({ obj });

      setTexturePop({ obj: box, arrId: info.children_lots });

      Build.render();
    }
  );
}

function setTexturePop({ obj, arrId }) {
  if (1 == 2) {
    if (!Array.isArray(arrId)) return;
    if (arrId.length == 0) return;

    let strId = '';
    for (let i = 0; i < arrId.length; i++) strId += '&id[' + i + ']=' + arrId[i];

    let url = Build.infProg.doc.host + '&' + Build.infProg.scene.catalogAccessKeys + '&' + strId;
  }

  let list = getObjs({ obj });

  function getObjs({ obj }) {
    let arr = [];
    let items = obj.userData.info.components;

    obj.traverse((child) => {
      if (child.geometry) {
        items.forEach((item) => {
          if (item.alias == child.geometry.name && item.lots && item.lots.length > 0) {
            arr.push({ obj: child, lotId: item.lots[0] });
          }
        });
      }
    });

    return arr;
  }

  list.forEach((item) => UPPOBJ.upTextureObj({ obj: item.obj, lotId: item.lotId }));
}
