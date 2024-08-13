

import * as THREE from '../node_modules/three/build/three.module.js';

import * as MSV from './mouseClick.js';
import * as MVC from './moveCamera.js';
import * as LOADS from './loaderScene.js';
import * as SST from './stats_1.js';
import * as MODS from './modeSettings.js';



export let camera, cameraTop, camera3D;
export let renderer;
export let container;
export let scene = null;

export let infProg = {};

infProg.doc = {};
infProg.doc.path = '';

infProg.obj = null;
infProg.scene = {};
infProg.scene.floor = [];
infProg.scene.obj = [];

infProg.scene.hide = {};
infProg.scene.hide.wall = [];
infProg.scene.hide.plita = [];

infProg.mouse = {};
infProg.mouse.click = {};
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


infProg.mode = {};
infProg.mode.active = 1;
infProg.mode.type = [];
infProg.mode.type[0] = {mat: '', texture: '', lightMap: '', light: '', toneMapping: ''};
infProg.mode.img = true;

infProg.img = {};
infProg.img.lightMap_1 = new THREE.TextureLoader().load('img/lightMap_1.png');
infProg.img.lightMap_1.encoding = THREE.sRGBEncoding;



function onWindowResize() 
{
	let aspect = container.clientWidth / container.clientHeight;
	let d = 5;
	
	cameraTop.left = -d * aspect;
	cameraTop.right = d * aspect;
	cameraTop.top = d;
	cameraTop.bottom = -d;
	cameraTop.updateProjectionMatrix();

	 
	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();
	
	renderer.setSize( container.clientWidth, container.clientHeight );
	
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	
	render();

}


function animate() 
{
	requestAnimationFrame( animate );	
	
	if(infProg.stats.fps) infProg.stats.fps.update();
}


export function render() 
{
	renderer.render( scene, camera );

	if(infProg.stats.drcall) SST.showStats_2({up: true});
	if(infProg.stats.triang) SST.showStats_3({up: true});
	if(infProg.stats.memory_g) SST.showStats_4({up: true});
	if(infProg.stats.memory_m) SST.showStats_5({up: true});	
}


export async function init() {

	//container = document.createElement( 'div' );
	//document.body.appendChild( container );
	//container.style.position = 'fixed';
	//container.style.width = '100%';
	//container.style.height = '100%';
	//container.style.top = 0;
	//container.style.left = 0;		
	document.body.style.zoom = 1;
	
	container = document.querySelector('[nameId="containerScene"]');	

	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	


	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.clientWidth, container.clientHeight );
	//renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
//renderer.gammaFactor = 0.45;
//renderer.gammaInput = true;
//renderer.gammaOutput = true;
	
	container.appendChild( renderer.domElement );
	

	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	renderer.domElement.style.outline = 'none';


	window.addEventListener( 'resize', onWindowResize, false );
	
	container.addEventListener('contextmenu', function(event) { event.preventDefault() });
	container.addEventListener( 'mousedown', MSV.onDocumentMouseDown, false );
	container.addEventListener( 'mousemove', MSV.onDocumentMouseMove, false );
	container.addEventListener( 'mouseup', MSV.onDocumentMouseUp, false );	
	
	container.addEventListener( 'touchstart', MSV.onDocumentMouseDown, false );
	container.addEventListener( 'touchmove', MSV.onDocumentMouseMove, false );
	container.addEventListener( 'touchend', MSV.onDocumentMouseUp, false );

	container.addEventListener('DOMMouseScroll', MVC.onDocumentMouseWheel, false);
	container.addEventListener('mousewheel', MVC.onDocumentMouseWheel, false);		
	
	
	let aspect = container.clientWidth / container.clientHeight;
	let d = 5;
	
	//----------- cameraTop
	cameraTop = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
	cameraTop.position.set(0, 10, 0);
	cameraTop.lookAt(scene.position);
	cameraTop.zoom = 1;
	cameraTop.updateMatrixWorld();
	cameraTop.updateProjectionMatrix();
	cameraTop.userData.camera = { save: { pos: cameraTop.position.clone(), zoom: cameraTop.zoom } };
	//----------- cameraTop


	//----------- camera3D
	camera3D = new THREE.PerspectiveCamera( 65, container.clientWidth / container.clientHeight, 0.01, 1000 );  
	//camera3D.rotation.order = 'YZX';		//'ZYX'
	camera3D.position.set(5, 7, 5);	
	
	camera3D.userData.camera = {};
	camera3D.userData.camera.save = {};
	camera3D.userData.camera.save.pos = new THREE.Vector3();
	camera3D.userData.camera.save.radius = 0;

	camera3D.userData.camera.d3 = { theta: 0, phi: 75 };
	camera3D.userData.camera.d3.targetO = MVC.createCenterCamObj();	
	camera3D.userData.camera.type = 'fly';
	camera3D.userData.camera.height = 0;
	camera3D.userData.camera.startProject = true;
	camera3D.userData.camera.click = {};
	camera3D.userData.camera.click.pos = new THREE.Vector3();	
	//----------- camera3D	
	
	
	
	LOADS.loadScene_1(); 

	createPlaneMath();
	MVC.startPosCamera3D({radious: 10, theta: 90, phi: 35});	
	
	//scene.add( new THREE.GridHelper( 10, 10 ) );
	//scene.add( new THREE.AxesHelper( 10000 ) );
	
	
	camera = camera3D;

	
	render();	

	//SST.showStats_1();
	//SST.showStats_2({start: true});	
	//SST.showStats_3({start: true});
	//SST.showStats_4({start: true});	
	//SST.showStats_5({start: true});	
	
}



function createPlaneMath()
{
	let geometry = new THREE.PlaneGeometry( 10000, 10000 );
	
	let material = new THREE.MeshPhongMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	let planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	infProg.planeMath = planeMath;
}



//----------- Math			
export function localTransformPoint(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


export function worldTransformPoint(dir1, dir_local)
{	
	let qt = quaternionDirection(dir1);			
	return dir_local.applyQuaternion( qt );
}


export function quaternionDirection(dir1)
{
	let mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}
//----------- Math




document.addEventListener("DOMContentLoaded", loopFr);


function loopFr()
{
	init();
	animate();
}



