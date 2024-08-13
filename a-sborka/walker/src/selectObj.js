import img_hidelot from './images/hidelot.png';

import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as CATPC from './ui/catalog_pc.js';
import * as CATMOB from './ui/catalog_mob.js';
import * as QRK from './qr.js';

let infLots = [];

export function initSelectObj(params) {
  if (!Build.infProg.scene.catalogAccessKeys) return;

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

  //let host = 'https://catalog.planoplan.com/api/v2.1/search/?lang=ru&disregard_price=1&disregard_structure=1&disregard_ownership=1';
  //let url = host + '&' + Build.infProg.scene.catalogAccessKeys + '&' + strId;
  let url = './file/catalog.json';

  let p = xhrPromise_1({ url: url });
  p.then((data) => {
    infLots = [...new Set(data.items)];
    QRK.checkUrlQR();
    structureCatalog();
    QRK.setUrlQR();
    getObjFromPaints();
    // getPreviewImg({arr: infLots});
  }).catch((err) => {
    console.log('err', err);
  });

  function structureCatalog() {
    let arr = [];

    for (let i = 0; i < paints.length; i++) {
      if (!paints[i].paint) continue;
      if (!Array.isArray(paints[i].paint)) continue;
      if (paints[i].paint.length == 0) continue;

      if (!paints[i].paint[0].lots) continue;
      if (!Array.isArray(paints[i].paint[0].lots)) continue;
      if (paints[i].paint[0].lots.length == 0) continue;

      if (paints[i].activeId > -1) {
        for (let i2 = 0; i2 < paints[i].paint.length; i2++) {
          if (paints[i].activeId + 1 > paints[i].paint[i2].lots.length) continue;

          paints[i].paint[i2].setupedLot = paints[i].paint[i2].lots[paints[i].activeId];
        }
      }

      let n = arr.length;

      arr[n] = {};
      arr[n].id = i;
      arr[n].caption = paints[i].caption;
      arr[n].preview = null;
      arr[n].color = null;
      arr[n].setIcon = null;
      arr[n].items = [];

      //let apiLot = infLots.find(o => o.id == paints[i].paint[0].lots[0]);
      let o = infLots.find((o) => o.id == paints[i].paint[0].setupedLot);

      if (o) {
        if (o.preview && o.preview !== '') arr[n].preview = o.preview;
        if (o.color && o.color !== '') arr[n].color = o.color;
      }

      paints[i].activeId = paints[i].paint[0].lots.findIndex((id) => id == paints[i].paint[0].setupedLot);

      let arr2 = [];
      let paintsCaptions = paints[i].paintsCaptions;

      if (paintsCaptions) {
        if (paints[i].activeId > -1) setIcon({ arr: arr, n: n, paints: paints, i: i, ind: paints[i].activeId });

        for (let i2 = 0; i2 < paintsCaptions.length; i2++) {
          let n = arr2.length;

          arr2[n] = {};
          arr2[n].id = i2;
          arr2[n].caption = paintsCaptions[i2].ru;
          arr2[n].preview = null;
          arr2[n].color = null;

          setIcon({ arr: arr2, n: n, paints: paints, i: i, ind: i2 });
        }
      } else {
        let lots = paints[i].paint[0].lots;

        for (let i2 = 0; i2 < lots.length; i2++) {
          let o = infLots.find((o) => o.id == lots[i2]);
          if (!o) continue;

          let n = arr2.length;

          arr2[n] = {};
          arr2[n].id = i2;
          arr2[n].caption = o.shortName.length > 0 ? o.shortName : o.caption;
          arr2[n].preview = o.preview && o.preview !== '' ? o.preview : null;
          arr2[n].color = o.color && o.color !== '' ? o.color : null;
        }
      }
      arr[n].items = arr2;
    }

    setPrevDefault({ arr: arr });

    if (Build.infProg.doc.mobile) {
      CATMOB.initCatalogUI({ arr: arr });
    } else {
      CATPC.initCatalogUI({ arr: arr });
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

            setTexture({ obj: paints[i].paint[i2].objScene[i3], lotId: paints[i].paint[i2].setupedLot });
          }
        } else if (paints[i].paint[i2].container) {
          loadObjApi({ paint: paints[i].paint[i2], lotId: paints[i].paint[i2].setupedLot });
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

function setIcon(params) {
  let arr = params.arr;
  let n = params.n;
  let paints = params.paints;
  let i = params.i;
  let ind = params.ind;

  //arr[n].color = null;
  //arr[n].preview = null;
  arr[n].setIcon = null;

  let setIcon = [];
  let paint = paints[i].paint;

  for (let i2 = 0; i2 < paint.length; i2++) {
    let n2 = setIcon.length;

    if (n2 > 3) break;

    let o = infLots.find((o) => o.id == paints[i].paint[i2].lots[ind]);

    let exist = setIcon.find((o2) => o2.lotId == o.id);

    if (exist) continue;
    if (!o) continue;

    setIcon[n2] = {};
    setIcon[n2].lotId = o.id;
    setIcon[n2].preview = o.preview && o.preview !== '' ? o.preview : null;
    setIcon[n2].color = o.color && o.color !== '' ? o.color : null;
  }

  if (setIcon.length > 1) {
    arr[n].setIcon = setIcon;
  } else if (setIcon.length == 1 && setIcon[0].preview) {
    arr[n].preview = setIcon[0].preview;
    arr[n].color = setIcon[0].color;
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

function setPrevDefault(params) {
  let arr = params.arr;

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].preview && !arr[i].color && !arr[i].setIcon) arr[i].preview = img_hidelot;

    for (let i2 = 0; i2 < arr[i].items.length; i2++) {
      let arr2 = arr[i].items[i2];

      if (!arr2.preview && !arr2.color && !arr2.setIcon) {
        arr2.preview = img_hidelot;
        arr2.color = 'FFFFFF';
      }
    }
  }
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

  outlineAddObj({ arr: arrO });
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

        setTexture({ obj: paint[i].objScene[i2], lotId: paint[i].lots[lotId] });
      }
    } else if (paint[i].container) {
      for (let i2 = paint[i].objScene.length - 1; i2 >= 0; i2--) {
        if (!paint[i].objScene[i2]) continue;

        let obj = paint[i].objScene[i2];
        paint[i].objScene[i2] = null;
        disposeNode(obj);
        Build.scene.remove(obj);
      }

      if (paint[i].container) {
        loadObjApi({ paint: paint[i], lotId: paint[i].lots[lotId], selectAct: true });
      }
    }
  }

  paints[paintsId].activeId = lotId;
  QRK.setUrlQR();
}

function setTexture(params) {
  let obj = params.obj;
  let lotId = params.lotId;

  let color = null;
  let src = null;

  for (let i = 0; i < infLots.length; i++) {
    if (infLots[i].id == lotId) {
      if (infLots[i].color) color = Build.urlHttps({ url: infLots[i].color });
      if (infLots[i].sourceImageURL) src = Build.urlHttps({ url: infLots[i].sourceImageURL });
      break;
    }
  }

  if (color) {
    if (obj.material.map) {
      obj.material.map.dispose();
      obj.material.map = null;
    }

    obj.material.color = new THREE.Color('#' + color);
    obj.material.needsUpdate = true;
    Build.render();
  }

  if (src) {
    new THREE.TextureLoader().load(src, function (texture) {
      if (obj.material.map) {
        obj.material.map.dispose();
        obj.material.map = null;
      }

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      obj.material.map = texture;
      obj.material.map.encoding = THREE.sRGBEncoding;
      obj.material.map.needsUpdate = true;
      obj.material.needsUpdate = true;
      Build.render();
    });
  }
}

function loadObjApi(params) {
  let paint = params.paint;
  let lotId = params.lotId;
  let selectAct = params.selectAct;

  let url = null;
  let sizeDef = new THREE.Vector3();

  for (let i = 0; i < infLots.length; i++) {
    if (infLots[i].id == lotId) {
      let arrSize = infLots[i].size.split(',');
      sizeDef = new THREE.Vector3(arrSize[0], arrSize[1], arrSize[2]);
      url = infLots[i].fileJson;
      break;
    }
  }

  if (!url) {
    Build.render();
    return;
  }

  if (!paint.container) return;

  let size = paint.container.size;
  let scale = new THREE.Vector3(size.x / sizeDef.x, size.y / sizeDef.y, size.z / sizeDef.z);

  let geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  let material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
  let box = new THREE.Mesh(geometry, material);

  let pos = new THREE.Vector3(paint.container.center.x, paint.container.center.y, paint.container.center.z);
  let lookV = new THREE.Vector3(paint.container.forward.x, paint.container.forward.y, paint.container.forward.z);

  box.lookAt(lookV);
  box.position.copy(Build.infProg.scene.offset);
  box.position.add(pos);
  Build.scene.add(box);
  Build.render();

  new THREE.ObjectLoader().load(
    url,

    function (obj) {
      disposeNode(box);
      Build.scene.remove(box);

      obj.lookAt(lookV);
      obj.position.copy(Build.infProg.scene.offset);
      obj.position.add(pos);
      obj.position.y -= size.y / 2;
      obj.scale.copy(scale);
      Build.scene.add(obj);

      paint.objScene = [obj];

      obj.userData.pop = {};
      obj.userData.pop.lotId = lotId;

      if (selectAct) {
        outlineAddObj({ arr: [obj] });
      }

      Build.render();
    }
  );
}

export function outlineAddObj(params) {
  return;
  Build.outlinePass.selectedObjects = params.arr;

  Build.render();
}

// очищаем объект из памяти
function disposeNode(node) {
  if (node.geometry) {
    node.geometry.dispose();
  }

  if (node.material) {
    var materialArray = [];

    if (node.material instanceof Array) {
      materialArray = node.material;
    } else {
      materialArray = [node.material];
    }

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
