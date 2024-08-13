
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as MVC from './moveCamera.js';
import * as HIDDO from './HiddenObject.js';



export let camera2D = null;
export let camera3D = null;




export function initCamera()
{
	let container = Build.container;
		
	container.addEventListener( 'mousedown', mouseDown, false );
	container.addEventListener( 'mousemove', mouseMove, false );
	container.addEventListener( 'mouseup', mouseUp, false );
	
	
	container.addEventListener( 'touchstart', mouseDown, false );
	container.addEventListener( 'touchmove', mouseMove, false );
	container.addEventListener( 'touchend', mouseUp, false );

	container.addEventListener('DOMMouseScroll', MVC.onDocumentMouseWheel, false);
	container.addEventListener('mousewheel', MVC.onDocumentMouseWheel, false);


	let aspect = container.clientWidth / container.clientHeight;
	let d = 5;
	
	
	//----------- camera2D
	camera2D = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
	camera2D.position.set(0, 10, 0);
	camera2D.lookAt(new THREE.Vector3());
	camera2D.zoom = 1;
	camera2D.updateMatrixWorld();
	camera2D.updateProjectionMatrix();
	camera2D.userData.camera = { save: { pos: camera2D.position.clone(), zoom: camera2D.zoom } };
	//----------- camera2D


	//----------- camera3D
	camera3D = new THREE.PerspectiveCamera( 40, container.clientWidth / container.clientHeight, 0.01, 1000 );  
	camera3D.rotation.order = 'YZX';		//'ZYX'
	camera3D.position.set(5, 7, 5);	
	
	camera3D.userData.camera = {};
	camera3D.userData.camera.save = {};
	camera3D.userData.camera.save.pos = new THREE.Vector3();
	camera3D.userData.camera.save.radius = 0;

	camera3D.userData.camera.d3 = { theta: 0, phi: 75 };
	camera3D.userData.camera.d3.minDist = 0;
	camera3D.userData.camera.d3.targetO = createCenterCamObj();	
	camera3D.userData.camera.type = 'fly';
	camera3D.userData.camera.click = {};
	camera3D.userData.camera.click.pos = new THREE.Vector3();
	camera3D.userData.camera.fov = {};
	camera3D.userData.camera.fov.fly = 40;
	camera3D.userData.camera.fov.first = 65;
	//----------- camera3D	

	
	createPlaneMath();
	startPosCamera3D({pos: new THREE.Vector3(8, 15, 15), lookAt: new THREE.Vector3( 0, 1, 0 )});
}



// создаем круг (объект), для обозначения куда смотрит камера в 3D режиме
function createCenterCamObj()
{
	let material = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 1, depthTest: false });
	//material.lightMap = Build.infProg.img.lightMap_1;
	let obj = new THREE.Mesh( new THREE.BoxGeometry(0.07, 0.07, 0.07), material );
	obj.position.copy(new THREE.Vector3( 0, 1, 0 ));
	obj.renderOrder = 2;
	obj.visible = false;
	
	Build.scene.add( obj );	
	
	return obj;
}


function createPlaneMath()
{
	let geometry = new THREE.PlaneGeometry( 10000, 10000 );
	
	let material = new THREE.MeshPhongMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	let planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	Build.scene.add( planeMath );	
	
	Build.infProg.planeMath = planeMath;
}


// первоначальные настройки при страте 
function startPosCamera3D(params)
{	
	camera3D.position.x = params.pos.x;
	camera3D.position.y = params.pos.y;
	camera3D.position.z = params.pos.z;			
			
	camera3D.lookAt(params.lookAt);
	
	camera3D.userData.camera.save.pos = camera3D.position.clone();
	camera3D.userData.camera.save.radius = camera3D.userData.camera.d3.targetO.position.distanceTo(camera3D.position);	
}






function mouseDown( event ) 
{
	Build.infProg.mouse.click.type = '';
	Build.infProg.mouse.click.down = true;
	Build.infProg.mouse.click.move = false;
	Build.infProg.mouse.event = event;
	
	
	
	switch ( event.button ) 
	{
		case 0: Build.infProg.mouse.click.type = 'left'; break;
		case 1: Build.infProg.mouse.click.type = 'right'; /*middle*/ break;
		case 2: Build.infProg.mouse.click.type = 'right'; break;
	}	
	
	if(event.changedTouches)
	{
		event.clientX = event.targetTouches[0].clientX;
		event.clientY = event.targetTouches[0].clientY;
		Build.infProg.mouse.click.type = 'left';
		
		
		if(event.targetTouches.length == 2)
		{	
			Build.infProg.mouse.click.type = 'right';	
			let th1 = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };				
			let th2 = { x: event.targetTouches[1].clientX, y: event.targetTouches[1].clientY };

			Build.infProg.mouse.th.pos[0].x = th1.x;
			Build.infProg.mouse.th.pos[0].y = th1.y;			
			Build.infProg.mouse.th.pos[1].x = th2.x;
			Build.infProg.mouse.th.pos[1].y = th2.y;
			
			Build.infProg.mouse.th.ratio1 = new THREE.Vector2(th2.x, th2.y).distanceTo(new THREE.Vector2(th1.x, th1.y));
			Build.infProg.mouse.th.camDist = Build.camera3D.userData.camera.d3.targetO.position.distanceTo(Build.camera3D.position);
		}		
	}	

	
	MVC.clickSetCamera2D( event, Build.infProg.mouse.click.type );
	MVC.clickSetCamera3D( event, Build.infProg.mouse.click.type );
				
	if (Build.infProg.scene.camera == Build.camera3D) { MVC.animateCamMove({type: Build.infProg.mouse.click.type}); }
	
	if(Build.composer) Build.composer.removePass( Build.fxaaPass );
	if(Build.infProg.doc.browser == 'mobile') Build.renderer.setPixelRatio( window.devicePixelRatio/2 );

	if(1==2)
	{
		//let ray = rayIntersect( event, [...Build.infProg.scene.furnitures], 'arr' );
		let ray = rayIntersect( event, [Build.scene], 'arr' );
		if(ray.length > 0) { console.log( ray[0].object ); }
	}	
	
	Build.render();
}



function mouseMove( event ) 
{ 
	if(!Build.infProg.mouse.click.down) return;
	
	if(event.changedTouches)
	{
		event.clientX = event.targetTouches[0].clientX;
		event.clientY = event.targetTouches[0].clientY;
	}
	
	Build.infProg.mouse.event = event;		

	//if(Build.infProg.scene.camera == Build.camera2D) { MVC.cameraMove2D( event ); }
	
	if(Build.infProg.mouse.click.down && !Build.infProg.mouse.click.move)
	{
		Build.infProg.mouse.click.move = true;
	}	
	
	//Build.render();
}


function mouseUp( event )  
{		
	
	if(event.changedTouches && Build.infProg.mouse.click.down)
	{   
		if(event.targetTouches.length == 1)
		{
			Build.infProg.mouse.click.type = 'left';
		}
		else if(event.targetTouches.length == 2)
		{	
			Build.infProg.mouse.click.type = 'right';			
		}
		
		
		if(Build.infProg.mouse.click.type != '' && event.targetTouches.length > 0)
		{
			event.clientX = event.targetTouches[0].clientX;
			event.clientY = event.targetTouches[0].clientY;
			
			MVC.clickSetCamera2D( event, Build.infProg.mouse.click.type );
			MVC.clickSetCamera3D( event, Build.infProg.mouse.click.type );					
		}
	}
	
	if(Build.composer) Build.composer.addPass( Build.fxaaPass );
	if(Build.infProg.doc.browser == 'mobile') Build.renderer.setPixelRatio( window.devicePixelRatio );
	
	Build.render();
	
	let type = Build.infProg.mouse.click.type;
	Build.infProg.mouse.click.type = '';
	Build.infProg.mouse.click.down = false;
	Build.infProg.mouse.click.move = false;	

	if (Build.infProg.scene.camera == Build.camera3D) { MVC.animateCamUp({type: type}); }
}





function getMousePosition( event )
{
	let x = ( ( event.clientX - Build.container.offsetLeft ) / Build.container.clientWidth ) * 2 - 1;
	let y = - ( ( event.clientY - Build.container.offsetTop ) / Build.container.clientHeight ) * 2 + 1;	
	
	return new THREE.Vector2(x, y);
}

	

export function rayIntersect( event, obj, t ) 
{
	let mouse = getMousePosition( event );
	
	let raycaster = new THREE.Raycaster();
	
	raycaster.setFromCamera( mouse, Build.infProg.scene.camera );
	
	let intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }
	
	return intersects;
}



