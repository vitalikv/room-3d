import './css/style.css';
import img_lightMap_1 from './images/lightMap_1.png';
import * as THREE from '../node_modules/three/build/three.module.js';

import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from '../node_modules/three/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from '../node_modules/three/examples/jsm/shaders/FXAAShader.js';
import { OutlinePass } from '../node_modules/three/examples/jsm/postprocessing/OutlinePass.js';

import * as INTFPC from './ui/interface_pc.js';
import * as INTFMOB from './ui/interface_mob.js';
import * as MSV from './mouseClick.js';
import * as MVC from './moveCamera.js';
import * as MVK from './moveCameraKey.js';
import * as LOADS from './loaderScene.js';
import * as SST from './stats_1.js';
import * as CRM from './cursorMove.js';

export let camera2D = null;
export let camera3D = null;
export let renderer;
export let container;

export let composer;
export let renderPass;
export let fxaaPass;
export let outlinePass;

export let scene = null;

export let infProg = {};

infProg.doc = {};
infProg.doc.path = getPath();
infProg.doc.flatPath = '';
infProg.doc.vers = '';

infProg.doc.loadFile = {};
infProg.doc.loadFile.progress = 0;
infProg.doc.loadFile.total = 0;
infProg.doc.browser = detectMobileOlPC();
infProg.doc.mobile = detectMobileDevice();
infProg.doc.alertIphone15 = detectIPhoneVers();
infProg.doc.language = detectBrowserLanguage();

infProg.scene = {};
infProg.scene.camera = null;
infProg.scene.offset = new THREE.Vector3();
infProg.scene.floor = [];
infProg.scene.construction = null;
infProg.scene.windows = null;
infProg.scene.doors = null;
infProg.scene.furnitures = [];
infProg.scene.boxF = [];
infProg.scene.reflectionProbe = [];
infProg.scene.panorama = null;
infProg.scene.cursorP360 = null;
infProg.scene.pathCam = null;

infProg.scene.paints = [];
infProg.scene.catalogAccessKeys = null;

infProg.scene.hide = {};
infProg.scene.hide.wall = [];
infProg.scene.hide.plita = [];
infProg.scene.hide.ceil = [];

infProg.mouse = {};
infProg.mouse.event = null;
infProg.mouse.click = {};
infProg.mouse.click.down = false;
infProg.mouse.click.move = false;
infProg.mouse.click.type = '';

infProg.mouse.pos = new THREE.Vector2();
infProg.mouse.th = {};
infProg.mouse.th.pos = [];
infProg.mouse.th.pos[0] = {};
infProg.mouse.th.pos[1] = {};
infProg.mouse.th.pos[1].x = new THREE.Vector2();
infProg.mouse.th.pos[1].y = new THREE.Vector2();
infProg.mouse.th.ratio1 = new THREE.Vector2();
infProg.mouse.th.camDist = new THREE.Vector3();

infProg.planeMath = null;

infProg.stats = {};
infProg.stats.fps = null;
infProg.stats.drcall = null;
infProg.stats.triang = null;
infProg.stats.memory_g = null;
infProg.stats.memory_m = null;
infProg.stats.time = {};
infProg.stats.time.update = true;
infProg.stats.time.el = null;
infProg.stats.time.number = new Date().getTime();

infProg.mode = {};
infProg.mode.matFloor = true;
infProg.mode.refProbe = true;
infProg.mode.iPoint = true;
infProg.mode.upMat = true;
infProg.mode.stImg = true;
infProg.mode.hideO = true;
infProg.mode.lightMap = '';
infProg.mode.vProbe = null;

infProg.img = {};
infProg.img.lightMap_1 = new THREE.TextureLoader().load(img_lightMap_1);
infProg.img.lightMap_1.encoding = THREE.sRGBEncoding;
infProg.img.floor = [];
infProg.img.list = [];

infProg.elem = {};
infProg.elem.butt = {};
infProg.elem.butt.cam2D = null;
infProg.elem.butt.cam3D = null;
infProg.elem.butt.camFirst = null;
infProg.elem.progressBar = null;
infProg.elem.qrId = null;

infProg.elem.mapSize = [];
infProg.elem.lightMapSize = [];

function getPath() {
  let path = '';

  if (document.currentScript) {
    let src = document.currentScript.src;
    let arr = src.split('/');
    let fname = arr[arr.length - 1];

    path = src.replace(fname, '');
  }

  //console.log(document.currentScript, path);

  return path;
}

function onWindowResize() {
  let aspect = container.clientWidth / container.clientHeight;
  let d = 5;

  camera2D.left = -d * aspect;
  camera2D.right = d * aspect;
  camera2D.top = d;
  camera2D.bottom = -d;
  camera2D.updateProjectionMatrix();

  camera3D.aspect = aspect;
  camera3D.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  render();
}

export function render() {
  //
  if (composer) {
    composer.render();
  } else {
    renderer.render(scene, infProg.scene.camera);
  }

  if (infProg.stats.fps) infProg.stats.fps.update();
  //if(infProg.stats.drcall) SST.showStats_2({up: true});
  //if(infProg.stats.triang) SST.showStats_3({up: true});
  //if(infProg.stats.memory_g) SST.showStats_4({up: true});
  //if(infProg.stats.memory_m) SST.showStats_5({up: true});
  //if(infProg.stats.time.el) SST.showStats_6({up: true});
}

export async function init(params = {}) {
  if (infProg.doc.mobile) {
    INTFMOB.initMainUI(params);
  } else {
    INTFPC.initMainUI(params);
  }

  infProg.elem.progressBar = document.querySelector('[nameId="progressBar"]');

  container = document.querySelector('[nameId="containerScene"]');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  renderer = new THREE.WebGLRenderer({ antialias: false, logarithmicDepthBuffer: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.CustomToneMapping;
  //renderer.toneMappingExposure = 1;

  container.appendChild(renderer.domElement);

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.outline = 'none';

  MSV.initCamera();
  MVK.initCameraKey();
  camera2D = MSV.camera2D;
  camera3D = MSV.camera3D;
  infProg.scene.camera = camera3D;

  window.addEventListener('resize', onWindowResize, false);
  container.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

  LOADS.loadScene_1(params);
  CRM.initCursorMove();

  let paramsString = document.location.search;
  let searchParams = new URLSearchParams(paramsString);
  let composerR = searchParams.get('composerR');

  if (!composerR) initComposerRender();

  render();
}

function initComposerRender() {
  composer = new EffectComposer(renderer);
  //composer.renderer.outputEncoding = THREE.sRGBEncoding;
  //composer.renderer.gammaFactor = 2.2;
  composer.setSize(container.clientWidth, container.clientHeight);
  composer.renderTarget1.texture.encoding = THREE.sRGBEncoding;
  composer.renderTarget2.texture.encoding = THREE.sRGBEncoding;

  renderPass = new RenderPass(scene, camera3D);
  composer.addPass(renderPass);

  fxaaPass = new ShaderPass(FXAAShader);
  let pixelRatio = renderer.getPixelRatio();
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (container.offsetWidth * pixelRatio);
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (container.offsetHeight * pixelRatio);
  //fxaaPass.material.uniforms[ 'tDiffuse' ].value.encoding = THREE.sRGBEncoding;
  composer.addPass(fxaaPass);

  outlinePass = new OutlinePass(new THREE.Vector2(container.offsetWidth, container.offsetHeight), scene, camera3D);
  composer.addPass(outlinePass);
  outlinePass.visibleEdgeColor.set(0xffffff);
  outlinePass.hiddenEdgeColor.set(0xffffff);
  outlinePass.edgeStrength = Number(5); // сила/прочность
  outlinePass.edgeThickness = Number(0.5); // толщина
  outlinePass.selectedObjects = [];
}

THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
  'vec3 CustomToneMapping( vec3 color ) { return color; }',
  `#define Uncharted2Helper( x ) max( ((5.3 * x)*(5.3 * x) + 0.104 * x) / ((5.184 * x)*(5.184 * x) + 4.052 * x + 0.362), vec3( 0.0 ) )
	float toneMappingWhitePoint = 1.0;
	vec3 CustomToneMapping( vec3 color ) {
		color *= toneMappingExposure;
		return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
	}`
);

export function urlHttps(params) {
  let url = params.url;

  let pattern = /^https?:\/\//i;

  if (!pattern.test(url)) {
    url = 'https:' + url;
  }

  return url;
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
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

function detectMobileDevice() {
  let mobile = false;

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    mobile = true;
  }
  console.log('MD', mobile);
  return mobile;
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
  console.log('alert iPh15', alert);
  return alert;
}

function detectBrowserLanguage() {
  let language = 'en';

  if (/ru/i.test(navigator.language)) {
    language = 'ru';
  }
  console.log('lang', language);
  return language;
}

//document.addEventListener("DOMContentLoaded", init);
