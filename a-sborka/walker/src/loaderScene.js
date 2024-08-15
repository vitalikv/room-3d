import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as PANOR from './panorama.js';
import * as SMAT from './setMaterials.js';
import * as REFP from './refProbe.js';
import * as LOADF from './loaderFurnitures.js';
import * as HIDDO from './HiddenObject.js';
import * as PCAM from './pathCamera.js';
import * as SST from './stats_1.js';
import * as WKP from './walkPoint.js';
import * as SLO from './selectObj.js';
import * as API from './api/apiPia.js';
import * as LGS from './lightShadow.js';
import * as IFP from './infoPoint.js';
import * as CRM from './cursorMove.js';
import * as PIV from './pivot.js';
import * as OAS from './obj3D.js';

import { LineSegmentsGeometry } from '../node_modules/three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineSegments2 } from '../node_modules/three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from '../node_modules/three/examples/jsm/lines/LineMaterial.js';

export function loadScene_1(params = {}) {
  // &debugUI=1&refProbe=1&matFloor=1&composerR=1&upMat=1&stImg=1&hideO=1&vProbe=1&camCenter=true&wPoint=false&infoPoint=true&dirLight=true&pointLight=true
  let paramsString = document.location.search;
  let searchParams = new URLSearchParams(paramsString);

  let flat = searchParams.get('flat');
  let debugUI = searchParams.get('debugUI');
  let matFloor = searchParams.get('matFloor');
  let refProbe = searchParams.get('refProbe');
  let wPoint = searchParams.get('wPoint');
  let upMat = searchParams.get('upMat');
  let stImg = searchParams.get('stImg');
  let hideO = searchParams.get('hideO');
  let lightMap = searchParams.get('lightMap');
  let vProbe = searchParams.get('vProbe');
  let camCenter = searchParams.get('camCenter');
  let infoPoint = searchParams.get('infoPoint');
  let dirLight = searchParams.get('dirLight');
  let pointLight = searchParams.get('pointLight');
  let dynamicL = searchParams.get('dynamicL');

  if (wPoint !== null) wPoint = wPoint === 'true' ? true : false;
  if (camCenter !== null) camCenter = camCenter === 'true' ? true : false;
  if (infoPoint !== null) infoPoint = infoPoint === 'true' ? true : false;
  if (dirLight !== null) dirLight = dirLight === 'true' ? true : false;
  if (pointLight !== null) pointLight = pointLight === 'true' ? true : false;
  if (dynamicL !== null) dynamicL = dynamicL === 'true' ? true : false;

  let url = null;

  if (flat) {
    url = flat;
  } else if (params.url) {
    url = params.url;
    wPoint = params.wPoint;
    camCenter = params.camCenter;
    infoPoint = params.infoPoint;
    dirLight = params.dirLight;
    //dynamicL = params.dynamicL;
  }

  if (url) {
    let arr = url.split('/');
    let fname = arr[arr.length - 1];
    Build.infProg.doc.flatPath = url.replace(fname, '');

    let arrStr = url.split('?');

    if (arrStr.length > 1) {
      Build.infProg.doc.vers = arrStr[1];
    } else {
      Build.infProg.doc.vers = new Date().getTime();
    }
  }

  if (params.panorama) {
    Build.infProg.scene.panorama.json = params.panorama;
  }

  if (debugUI) SST.initPanel();

  if (matFloor) Build.infProg.mode.matFloor = false;
  if (refProbe) Build.infProg.mode.refProbe = false;
  if (wPoint !== null && wPoint !== undefined) Build.infProg.mode.wPoint = wPoint;
  if (upMat) Build.infProg.mode.upMat = false;
  if (stImg) Build.infProg.mode.stImg = false;
  if (hideO) Build.infProg.mode.hideO = false;
  if (lightMap) Build.infProg.mode.lightMap = lightMap;
  if (vProbe) Build.infProg.mode.vProbe = true;
  if (camCenter !== null && camCenter !== undefined) Build.infProg.mode.camCenter = camCenter;
  if (infoPoint !== null && infoPoint !== undefined) Build.infProg.mode.infoPoint = infoPoint;
  if (dirLight !== null && dirLight !== undefined) Build.infProg.mode.dirLight = dirLight;
  if (pointLight !== null && pointLight !== undefined) Build.infProg.mode.pointLight = pointLight;
  if (dynamicL !== null && dynamicL !== undefined) Build.infProg.mode.dynamicL = dynamicL;

  console.log('vers', Build.infProg.doc.vers, 3);
  //console.log(Build.infProg.mode);

  let p = xhrPromise_1({ url: url });
  p.then((data) => {
    loadScene_2({ json: data });
  }).catch((err) => {
    console.log('err', err);
  });
}

async function loadScene_2(params) {
  let json = params.json;
  if (!json.construction) return;

  let arr = [];

  for (let index in json) {
    if (index == 'construction') {
      json[index].type = index;
      arr[0] = json[index];
    } else if (index == 'windows') {
      json[index].type = index;
      arr[1] = json[index];
    } else if (index == 'doors') {
      json[index].type = index;
      arr[2] = json[index];
    } else if (index == 'furnitures') {
      json[index].forEach((o) => (o.type = index));
    }

    //console.log(index, json[index]);
  }

  if (json.catalogAccessKeys) {
    Build.infProg.scene.catalogAccessKeys = 'keys[0]=' + json.catalogAccessKeys;
  }

  let arrF = LOADF.initFurnitures({ json: json });
  //let arrF = [];
  if (arrF) {
    arr.push(...arrF);
  }

  //Build.infProg.doc.loadFile.total = arr.length + arrF.length;
  Build.infProg.doc.loadFile.total = arr.length;

  let allPr = [];
  let allIn = [];

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) continue;
    if (!arr[i].file) continue;

    let url = arr[i].file;

    let p = xhrPromise_1({ url: Build.infProg.doc.flatPath + url + '?v=' + Build.infProg.doc.vers });

    try {
      allPr[allPr.length] = p;
      allIn[allIn.length] = { type: arr[i].type, file: url };
    } catch (e) {
      Build.infProg.doc.loadFile.total -= 1;
    }
  }

  Promise.all(allPr).then((data) => {
    for (let i = 0; i < data.length; i++) {
      loadScene_3({ json: data[i], type: allIn[i].type, file: allIn[i].file });
    }

    finishLoadScene_1({ json: json });
  });
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

      Build.infProg.doc.loadFile.progress += 1;
      let val = (Build.infProg.doc.loadFile.progress / Build.infProg.doc.loadFile.total) * 100;
      if (val == 'Infinity') val = 0;
      API.apiPIA.moveProgressBar(val);
    };

    xhr.onprogress = (event) => {
      let val = 0;

      if (event.lengthComputable) {
        val = Math.round((event.loaded / event.total) * 100);
      } else {
        let total = parseInt(xhr.getResponseHeader('content-length'), 10);
        val = Math.round((event.loaded / total) * 10);
      }
    };

    xhr.onerror = () => {
      reject(xhr.response);
    };

    xhr.send();
  });
}

function loadScene_3(params) {
  let json = params.json;

  if (json.images) {
    for (let i = 0; i < json.images.length; i++) {
      let url = json.images[i].url;

      let name = url.split('.')[0];

      let type = url.split('.');
      type = type[type.length - 1];

      let arrStr = type.split('?');
      if (arrStr.length > 1) {
        type = arrStr[0];
        //if(/exr/i.test( type )){ type = Build.infProg.mode.lightMap + '.jpg?' + arrStr[1]; }
        //else { type = '_x4.jpg?' + arrStr[1]; }
        if (/exr/i.test(type)) {
          type = Build.infProg.mode.lightMap + '.jpg?v=' + Build.infProg.doc.vers;
        } else {
          type = '_x4.jpg?v=' + Build.infProg.doc.vers;
        }
      }

      url = Build.infProg.doc.flatPath + name + type;

      json.images[i].url = url;
      if (Build.infProg.mode.stImg) {
      } else {
        json.images[i].url = '';
      }
      //json.images[i].url_2 = url;
    }
  }

  let obj = new THREE.ObjectLoader().parse(json);

  if (params.type) {
    if (params.type == 'construction') {
      Build.infProg.scene.construction = obj;
      crEdge({ obj });
      constructionSetting({ obj: obj });
    } else if (params.type == 'windows') {
      Build.infProg.scene.windows = obj;
      crEdge({ obj });
    } else if (params.type == 'doors') {
      Build.infProg.scene.doors = obj;
      crEdge({ obj });
    } else if (params.type == 'furnitures') {
      obj = LOADF.attachObjFurnitures({ obj: obj, file: params.file });
    }
  }

  obj.position.add(Build.infProg.scene.offset);

  SMAT.matPop({ obj });

  Build.scene.add(obj);
}

function constructionSetting(params) {
  let obj = params.obj;

  getBoundObject_1({ obj: obj });

  let plitaVisible = [];

  obj.traverse(function (child) {
    if (new RegExp('VrayEnv_Panorama_unlit', 'i').test(child.name)) {
      child.visible = false;
    }

    if (new RegExp('ReflectionProbe', 'i').test(child.name)) {
      let n = Build.infProg.scene.reflectionProbe.length;
      Build.infProg.scene.reflectionProbe[n] = {};
      Build.infProg.scene.reflectionProbe[n].pos = child.position.clone().add(Build.infProg.scene.offset);
      Build.infProg.scene.reflectionProbe[n].uuid = child.uuid;

      if (Build.infProg.mode.vProbe) {
        let geometry = new THREE.SphereGeometry(0.5, 32, 32);
        let material = new THREE.MeshStandardMaterial({ color: 0xffffff, lightMap: Build.infProg.img.lightMap_1, metalness: 1, roughness: 0 });

        let sphere = new THREE.Mesh(geometry, material);

        sphere.position.copy(Build.infProg.scene.reflectionProbe[n].pos);
        Build.scene.add(sphere);

        Build.infProg.scene.reflectionProbe[n].obj = sphere;
      }
    }

    if (new RegExp('Plita', 'i').test(child.name)) {
      plitaVisible[plitaVisible.length] = child;
    } else if (child.userData.hideInWalk) {
      plitaVisible[plitaVisible.length] = child;
    }

    if (child.material) {
      let userData = {};
      userData.opacity = child.material.opacity;
      child.material.userData = userData;

      if (/illum/i.test(child.material.name)) {
        let m1 = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, metalness: 0, roughness: 1 });
        m1.userData = userData;

        m1.lightMap = Build.infProg.img.lightMap_1;
        m1.opacity = child.material.opacity;

        //if(m1.map) m1.map.encoding = THREE.sRGBEncoding;
        //if(m1.lightMap) m1.lightMap.encoding = THREE.sRGBEncoding;

        child.material.dispose();
        child.material = m1;
        child.material.needsUpdate = true;
      }
    }
  });

  Build.infProg.scene.hide.plita = plitaVisible;

  HIDDO.wallAfterRender_3();
  Build.render();
}

function getBoundObject_1(params) {
  let obj = params.obj;

  if (!obj) return;

  let arr = [];
  let arrFloor = [];

  obj.updateMatrixWorld(true);

  obj.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        //if(new RegExp( 'floor' ,'i').test( child.name )){ arr[arr.length] = child; }
        //if(new RegExp( 'ceil' ,'i').test( child.name )){ arr[arr.length] = child; }
        if (new RegExp('VrayEnv_Panorama_unlit', 'i').test(child.name)) {
        } else {
          arr[arr.length] = child;
        }
      }
    }
  });

  //scene.updateMatrixWorld();

  let v = [];
  let v2 = [];

  for (let i = 0; i < arr.length; i++) {
    arr[i].geometry.computeBoundingBox();
    arr[i].geometry.computeBoundingSphere();

    let bound = arr[i].geometry.boundingBox;

    v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4(arr[i].matrixWorld);
    v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4(arr[i].matrixWorld);
    v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4(arr[i].matrixWorld);
    v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4(arr[i].matrixWorld);

    v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4(arr[i].matrixWorld);
    v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4(arr[i].matrixWorld);
    v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4(arr[i].matrixWorld);
    v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4(arr[i].matrixWorld);

    if (new RegExp('floor', 'i').test(arr[i].name)) {
      let pos = arr[i].geometry.boundingSphere.center.clone().applyMatrix4(arr[i].matrixWorld);

      arrFloor[arrFloor.length] = { o: arr[i], name: arr[i].name, pos: pos };

      v2[v2.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4(arr[i].matrixWorld);
      v2[v2.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4(arr[i].matrixWorld);
      v2[v2.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4(arr[i].matrixWorld);
      v2[v2.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4(arr[i].matrixWorld);

      v2[v2.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4(arr[i].matrixWorld);
      v2[v2.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4(arr[i].matrixWorld);
      v2[v2.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4(arr[i].matrixWorld);
      v2[v2.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4(arr[i].matrixWorld);
    }
  }

  let bound = { min: { x: Infinity, y: Infinity, z: Infinity }, max: { x: -Infinity, y: -Infinity, z: -Infinity } };

  for (let i = 0; i < v.length; i++) {
    if (v[i].x < bound.min.x) {
      bound.min.x = v[i].x;
    }
    if (v[i].x > bound.max.x) {
      bound.max.x = v[i].x;
    }
    if (v[i].y < bound.min.y) {
      bound.min.y = v[i].y;
    }
    if (v[i].y > bound.max.y) {
      bound.max.y = v[i].y;
    }
    if (v[i].z < bound.min.z) {
      bound.min.z = v[i].z;
    }
    if (v[i].z > bound.max.z) {
      bound.max.z = v[i].z;
    }
  }

  let offset = new THREE.Vector3(-((bound.max.x - bound.min.x) / 2 + bound.min.x), 0, -((bound.max.z - bound.min.z) / 2 + bound.min.z));

  Build.infProg.scene.floor = arrFloor;

  for (let i = 0; i < arrFloor.length; i++) {
    arrFloor[i].pos.add(offset);
  }

  Build.infProg.scene.boundG = bound;
  Build.infProg.scene.offset = offset;

  if (1 == 1) {
    Build.infProg.scene.boundMinFloor = bound;

    for (let i = 0; i < v2.length; i++) {
      if (v2[i].y < Build.infProg.scene.boundMinFloor.max.y) {
        Build.infProg.scene.boundMinFloor.min.y = v2[i].y;
      }
    }
  }

  let bx = bound.max.x - bound.min.x;
  let bz = bound.max.z - bound.min.z;

  Build.camera3D.userData.camera.d3.minDist = Math.max(bx / 2, bz / 2);

  if (Build.infProg.mode.camCenter) {
    let center = new THREE.Vector3((bound.max.x - bound.min.x) / 2 + bound.min.x, (bound.max.y - bound.min.y) / 2 + bound.min.y, (bound.max.z - bound.min.z) / 2 + bound.min.z);

    Build.camera3D.position.copy(center.clone().add(offset)).add(new THREE.Vector3(0, 0.025, -1).multiplyScalar((bound.max.x - bound.min.x) * 1.1));
    Build.camera3D.lookAt(Build.camera3D.userData.camera.d3.targetO.position);
  }
}

async function sleepPause(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function finishLoadScene_1(params) {
  let arrImg = [];
  let count = 0;

  Build.scene.traverse(function (child) {
    if (child.material && child.material.userData.tag1 && child.material.userData.tag1 == 'obj') {
      if (child.material.map && child.material.map.image) {
        arrImg[arrImg.length] = child.material.map.image;
      }

      if (child.material.lightMap && child.material.lightMap.image) {
        arrImg[arrImg.length] = child.material.lightMap.image;
      }
    }
  });

  arrImg = [...new Set(arrImg)];

  for (let i = 0; i < arrImg.length; i++) {
    arrImg[i].onload = () => {
      nextStep();
    };
  }

  function nextStep() {
    count++;

    if (arrImg.length == count + 1) {
      Build.render();
      finishLoadScene_2(params);
    }
  }
}

function finishLoadScene_2(params) {
  let json = params.json;

  if (Build.infProg.mode.refProbe) {
    REFP.crReflectionProbe();
  }

  if (Build.infProg.mode.wPoint) {
    WKP.initWalkPoint({ arr: Build.infProg.scene.floor });

    WKP.ManageWP.enablePoints({ show: true });
    CRM.visibleCursorP360({ visible: false });
    //API.apiPIA.buttonExitCamWalkUI(false);
  }

  if (Build.infProg.mode.infoPoint) {
    IFP.initInfoPoint();
  }

  if (Build.infProg.mode.hideO) {
    if (json.hideObjects) {
      HIDDO.initHiddenObject({ arr: json.hideObjects });
      HIDDO.wallAfterRender_3();

      HIDDO.initHiddenObjCeil();
      HIDDO.showHideObjCeil();
    }
  }

  API.apiPIA.endProgressBar();

  PIV.initPivot();

  if (json.paints) {
    SLO.initSelectObj({ paints: json.paints });
  }

  //PCAM.initPathCam();

  if (Build.infProg.scene.panorama.json) {
    PANOR.initPanorama({});
  }

  if (Build.infProg.mode.dirLight) {
    LGS.initLightShadow();
  }

  if (Build.infProg.mode.pointLight) {
    LGS.initPointLight({ arrRoom: Build.infProg.scene.floor });
  }

  Build.camOrbit.effectP({ type: 'on' });

  Build.render();
}

export function crEdge({ obj }) {
  let paramsString = document.location.search;
  let searchParams = new URLSearchParams(paramsString);
  let edge = searchParams.get('edge');

  if (!edge) return;

  let listG = [];
  obj.traverse(function (child) {
    if (child.isMesh && child.geometry) {
      listG.push({ child });
    }
  });

  for (let i = 0; i < listG.length; i++) {
    const lineGeom = new THREE.EdgesGeometry(listG[i].child.geometry, 50);

    const thickLineGeom = new LineSegmentsGeometry().fromEdgesGeometry(lineGeom);
    const thickLines = new LineSegments2(thickLineGeom, new LineMaterial({ color: 0x111111, linewidth: 0.0015 }));
    listG[i].child.add(thickLines);
    thickLines.scale.copy(listG[i].child.scale);
  }
}
