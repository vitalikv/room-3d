import './css/style.css';

import * as THREE from 'three';

import 'regenerator-runtime/runtime';

import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from '../node_modules/three/examples/jsm/shaders/FXAAShader.js';
import { OutlinePass } from '../node_modules/three/examples/jsm/postprocessing/OutlinePass.js';

import * as PAR from './sceneParams';
import * as CAM from './camera.js';
import * as MVK from './moveCameraKey.js';
import * as LOADS from './loaderScene.js';
import * as CRM from './cursorMove.js';
import * as AOBJ from './actionObj.js';
import * as API from './api/apiPia.js';
import * as GAPI from './api/apiPiaGlobal.js';
import * as MSV from './mouseClick.js';

export let infProg = PAR.initParams();
export let scene, camOrbit, camera2D, camera3D, renderer, container;
export let composer, renderPass, fxaaPass, outlinePass;

export async function init(params = { el: null, url: null, panorama: null, showUi: true, lang: null, onReady: () => {} }) {
  let elParent = document.querySelector('#root');

  let elRoot = document.createElement('div');
  elRoot.setAttribute('nameId', 'containerWrapper');
  elRoot.style.cssText = 'position: relative; width: 100%; height: 100%; display: block; outline: none, overflow: hidden;';

  API.init({ elRoot: elRoot, showUi: params.showUi, lang: params.lang, onReady: params.onReady });
  API.apiPIA.initProgressBar();

  let elem = document.createElement('div');
  elem.setAttribute('nameId', 'containerScene');
  elem.style.cssText = 'width: 100%; height: 100%; touch-action: none; user-select: none;';
  elRoot.appendChild(elem);
  elParent.appendChild(elRoot);

  container = document.querySelector('[nameId="containerScene"]');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.CustomToneMapping;
  //renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);
  container.addEventListener('contextmenu', (event) => event.preventDefault());

  camOrbit = new CAM.CameraOrbit({ container: container, renderer: renderer, scene: scene, setCam: '3D' });
  camera2D = camOrbit.cam2D;
  camera3D = camOrbit.cam3D;

  infProg.cl.ListClick = new MSV.ListOrder({ container: container });
  MVK.initCameraKey();
  LOADS.loadScene_1(params);
  CRM.initCursorMove();
  AOBJ.init();

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

export function render() {
  if (composer) composer.render();
  else renderer.render(scene, camOrbit.activeCam);

  if (infProg.stats.fps) infProg.stats.fps.update();
}

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

//document.addEventListener("DOMContentLoaded", init);
