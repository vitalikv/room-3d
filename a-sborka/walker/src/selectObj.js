import * as Build from './walker';
import * as SCAT from './structureCatalog';
import * as UPPOBJ from './upPaintObj';
import * as QRK from './qr';
//import * as API from './api/apiPia';
import * as IFP from './infoPoint.js';
import * as LOADF from './loaderFurnitures.js';

import * as CATPC from './ui/catalog_pc.js';
import * as CATMOB from './ui/catalog_mob.js';

export let infLots = [];

export function initSelectObj(params) {
  let start = true;
  if (!Build.infProg.scene.catalogAccessKeys) start = false;
  if (params.paints.length == 0) start = false;

  if (!start) {
    //API.apiPIA.showUi = false;
    //API.apiPIA.initInterface();
    return;
  }

  let paints = params.paints;
  Build.infProg.scene.paints = paints;

  let arrId = [];

  for (let i = 0; i < paints.length; i++) {
    paints[i].activeId = -1;
    paints[i].catalog = null;

    if (!paints[i].paint) continue;

    for (let i2 = 0; i2 < paints[i].paint.length; i2++) {
      paints[i].paint[i2].objScene = [];
      arrId.push(...paints[i].paint[i2].lots);
    }
  }

  arrId = [...new Set(arrId)];

  let strId = '';

  for (let i = 0; i < arrId.length; i++) {
    strId += '&id[' + i + ']=' + arrId[i];
  }

  //let url = Build.infProg.doc.host + '&' + Build.infProg.scene.catalogAccessKeys + '&' + strId;
  let url = Build.infProg.doc.host;

  let p = xhrPromise_1({ url: url });
  p.then((data) => {
    let arr = [...data.items, ...data.children_items];
    infLots = [...new Set(arr)];
    upAddHttps(infLots);

    QRK.checkUrlQR();
    let arr2 = SCAT.structureCatalog();
    QRK.setUrlQR();

    getObjFromPaints();

    //API.apiPIA.initInterface();
    //API.apiPIA.initCatalog(arr2);

    CATPC.initCatalogUI({ arr: arr2 });

    // getPreviewImg({arr: infLots});
  }).catch((err) => {
    console.log('err', err);
  });

  function upAddHttps(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].preview && arr[i].preview !== '') arr[i].preview = Build.urlHttps({ url: arr[i].preview });
      if (arr[i].sourceImageURL && arr[i].sourceImageURL !== '') arr[i].sourceImageURL = Build.urlHttps({ url: arr[i].sourceImageURL });
    }
  }

  function getObjFromPaints() {
    for (let i = 0; i < paints.length; i++) {
      if (!paints[i].paint) continue;
      if (!Array.isArray(paints[i].paint)) continue;
      if (paints[i].paint.length == 0) continue;

      for (let i2 = 0; i2 < paints[i].paint.length; i2++) {
        if (!paints[i].paint[i2].lots) continue;
        if (!Array.isArray(paints[i].paint[i2].lots)) continue;
        if (paints[i].paint[i2].lots.length == 0) continue;

        if (paints[i].paint[i2].isMaterial) {
          paints[i].paint[i2].objScene = getObjs({ arrName: paints[i].paint[i2].objects });

          for (let i3 = 0; i3 < paints[i].paint[i2].objScene.length; i3++) {
            if (!paints[i].paint[i2].objScene[i3]) continue;

            UPPOBJ.upTextureObj({ obj: paints[i].paint[i2].objScene[i3], lotId: paints[i].paint[i2].setupedLot });
          }
        } else if (paints[i].paint[i2].container) {
          LOADF.loadObjPop({ paint: paints[i].paint[i2], lotId: paints[i].paint[i2].setupedLot });
        }
      }
    }
  }

  function getPreviewImg(params) {
    let arr = params.arr;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].preview) xhrImg_1({ json: arr[i], url: arr[i].preview });
    }
  }
}

function getObjs(params) {
  let arrName = params.arrName;
  let arr = [];

  Build.scene.traverse(function (child) {
    for (let i = 0; i < arrName.length; i++) {
      if (arrName[i] == child.name) {
        arr[arr.length] = child;
        break;
      }
    }
  });

  return arr;
}

function xhrPromise_1(params) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', params.url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.response);
      }
    };

    xhr.onprogress = (event) => {};

    xhr.onerror = () => {
      reject(xhr.response);
    };

    xhr.send();
  });
}

function xhrImg_1(params) {
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.open('GET', params.url, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let image = new Image();
      image.src = window.URL.createObjectURL(xhr.response);

      image.onload = function () {
        params.json.blob = image.src;
      };
    }
  };
  xhr.send();
}

export function checkActObj(params) {
  let paintsId = params.paintsId;

  let paints = Build.infProg.scene.paints;
  let paint = paints[paintsId].paint;

  let arrO = [];

  for (let i = 0; i < paint.length; i++) {
    if (!paint[i].objScene) continue;

    arrO.push(...paint[i].objScene);
  }
}

export function changeLots(params) {
  let paintsId = params.paintsId;
  let lotId = params.lotId;

  let paints = Build.infProg.scene.paints;
  let paint = paints[paintsId].paint;

  for (let i = 0; i < paint.length; i++) {
    if (paint[i].isMaterial) {
      for (let i2 = 0; i2 < paint[i].objScene.length; i2++) {
        if (!paint[i].objScene[i2]) continue;

        UPPOBJ.upTextureObj({ obj: paint[i].objScene[i2], lotId: paint[i].lots[lotId] });
      }
    } else if (paint[i].container) {
      for (let i2 = paint[i].objScene.length - 1; i2 >= 0; i2--) {
        if (!paint[i].objScene[i2]) continue;

        let obj = paint[i].objScene[i2];
        paint[i].objScene[i2] = null;

        obj.objOutline(false);
        obj.objHidePivot();
        if (obj.userData.infoPoint) obj.userData.infoPoint.delete();

        disposeNode(obj);
        Build.scene.remove(obj);
        deleteValueFromArrya({ arr: Build.infProg.scene.furnitures, o: obj });
        Build.render();
      }

      if (paint[i].container) {
        LOADF.loadObjPop({ paint: paint[i], lotId: paint[i].lots[lotId] });
      }
    }
  }

  paints[paintsId].activeId = lotId;
  for (let i2 = 0; i2 < paints[paintsId].paint.length; i2++) {
    paints[paintsId].paint[i2].setupedLot = paints[paintsId].paint[i2].lots[paints[paintsId].activeId];
  }

  QRK.setUrlQR();
}

export function getEstimate() {
  let paints = Build.infProg.scene.paints;

  let arr = [];

  for (let i = 0; i < paints.length; i++) {
    if (paints[i].activeId == -1) continue;

    let n = arr.length;

    arr[n] = {};
    arr[n].id = n;
    arr[n].caption = paints[i].caption;

    arr[n].value = {};
    arr[n].value.id = paints[i].activeId;
    arr[n].value.caption = paints[i].captions[paints[i].activeId];
  }

  return arr;
}

function deleteValueFromArrya(params) {
  var arr = params.arr;
  var o = params.o;

  for (var i = arr.length - 1; i > -1; i--) {
    if (arr[i] == o) {
      arr.splice(i, 1);
      break;
    }
  }
}

function disposeNode(obj) {
  let arr = [];
  obj.traverse((child) => arr.push(child));
  arr.forEach((o) => clearMemory(o));

  function clearMemory(node) {
    if (!node.geometry) return;

    node.geometry.dispose();

    if (node.material) {
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
    }

    Build.renderer.renderLists.dispose();
  }
}
