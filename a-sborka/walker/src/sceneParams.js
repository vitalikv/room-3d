import * as THREE from 'three';
import img_lightMap_1 from './images/lightMap_1.png';

export function initParams() {
  let infProg = {};

  infProg.doc = {};
  infProg.doc.flatPath = '';
  infProg.doc.vers = '';

  infProg.doc.loadFile = {};
  infProg.doc.loadFile.progress = 0;
  infProg.doc.loadFile.total = 0;
  infProg.doc.browser = detectMobileOlPC();
  infProg.doc.alertIphone15 = detectIPhoneVers();
  infProg.doc.interface = {};
  infProg.doc.interface.show = true;
  infProg.doc.host = './file/catalog.json';

  infProg.scene = {};
  infProg.scene.offset = new THREE.Vector3();
  infProg.scene.floor = [];
  infProg.scene.construction = null;
  infProg.scene.windows = null;
  infProg.scene.doors = null;
  infProg.scene.furnitures = [];
  infProg.scene.boxF = [];
  infProg.scene.reflectionProbe = [];
  infProg.scene.cursorP360 = null;
  infProg.scene.walkPoint = [];
  infProg.scene.pivot = null;
  infProg.scene.newPivot = null;
  infProg.scene.pathCam = null;
  infProg.scene.panorama = {};
  infProg.scene.panorama.obj = null;
  infProg.scene.panorama.json = null;
  infProg.scene.qr = '';
  infProg.scene.lights = [];

  infProg.scene.paints = [];
  infProg.scene.catalogAccessKeys = null;

  infProg.scene.hide = {};
  infProg.scene.hide.wall = [];
  infProg.scene.hide.plita = [];
  infProg.scene.hide.ceil = [];

  infProg.mouse = {};
  infProg.mouse.click = {};
  infProg.mouse.click.down = false;
  infProg.mouse.click.move = false;
  infProg.mouse.click.type = '';

  infProg.stats = {};
  infProg.stats.fps = null;

  infProg.mode = {};
  infProg.mode.matFloor = true;
  infProg.mode.refProbe = true;
  infProg.mode.wPoint = true;
  infProg.mode.upMat = true;
  infProg.mode.stImg = true;
  infProg.mode.hideO = true;
  infProg.mode.lightMap = '';
  infProg.mode.vProbe = null;
  infProg.mode.camCenter = false;
  infProg.mode.infoPoint = false;
  infProg.mode.dirLight = false;
  infProg.mode.pointLight = false;
  infProg.mode.dynamicL = true;

  infProg.img = {};
  infProg.img.lightMap_1 = new THREE.TextureLoader().load(img_lightMap_1);
  infProg.img.lightMap_1.encoding = THREE.sRGBEncoding;
  infProg.img.floor = [];
  infProg.img.list = [];

  infProg.elem = {};
  infProg.elem.butt = {};
  infProg.elem.butt.cam2D = null;
  infProg.elem.butt.cam3D = null;

  infProg.elem.mapSize = [];
  infProg.elem.lightMapSize = [];

  infProg.cl = {};
  infProg.cl.ListClick = null;

  return infProg;
}

function detectMobileOlPC() {
  let type = '';

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    type = 'mobile';
  } else {
    type = 'pc';
  }

  return type;
}

function detectIPhoneVers() {
  let alert = false;

  if (/iPhone/i.test(navigator.userAgent)) {
    let found = navigator.userAgent.match(/Version\/([0-9]{1,3})/i);

    if (found) {
      if (found[1]) {
        if (Number(found[1]) < 15) {
          alert = true;
        }
      }
    }
  }
  //console.log('alert iPh15', alert);
  return alert;
}
