
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as MSV from './mouseClick.js';
import * as HIDDO from './HiddenObject.js';
import * as WKP from './walkPoint.js';
import * as CRM from './cursorMove.js';


let type_browser = detectBrowser();

let sphericalDelta = {};
sphericalDelta.theta = 0;
sphericalDelta.phi = 0;


export function animateCamMove() 
{	
	
	if(Build.infProg.mouse.click.type !== '') 
	{ 
		requestAnimationFrame( animateCamMove );
		cameraMove3D({type: Build.infProg.mouse.click.type}); 
	}
}


export function animateCamUp(params) 
{		

	if(Math.abs(sphericalDelta.theta) > 0.01 || Math.abs(sphericalDelta.phi) > 0.01) 
	{ 		
		requestAnimationFrame( function() { animateCamUp({type: params.type}); } )
		cameraMove3D({type: params.type}); 
	}
}






export function clickSetCamera2D( event, click )
{
	if(Build.infProg.scene.camera != Build.camera2D) return;
	
	Build.infProg.planeMath.position.set(Build.camera2D.position.x, 0, Build.camera2D.position.z);
	Build.infProg.planeMath.rotation.set(-Math.PI/2,0,0);  
	Build.infProg.planeMath.updateMatrixWorld();
	
	let intersects = MSV.rayIntersect( event, Build.infProg.planeMath, 'one' );
	
	Build.infProg.mouse.pos.x = intersects[0].point.x;
	Build.infProg.mouse.pos.y = intersects[0].point.z;	 		
}


export function clickSetCamera3D( event, click )
{
	let camera3D = Build.camera3D;
	
	if ( Build.infProg.scene.camera != camera3D ) { return; }
	
	Build.infProg.mouse.pos.x = event.clientX;
	Build.infProg.mouse.pos.y = event.clientY;
	sphericalDelta.theta = 0;
	sphericalDelta.phi = 0;
	
	if ( click == 'left' )				
	{
		//var dir = camera.getWorldDirection();
		let dir = new THREE.Vector3().subVectors( camera3D.userData.camera.d3.targetO.position, camera3D.position ).normalize();
		
		// получаем угол наклона камеры к target (к точке куда она смотрит)
		let dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; } 			
		
		// получаем угол направления (на плоскости) камеры к target 
		dir.y = 0; 
		dir.normalize();    			
		
		
		camera3D.userData.camera.d3.theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;
		camera3D.userData.camera.d3.phi = dergree;
		//camera3D.userData.camera.save.radius = camera3D.userData.camera.d3.targetO.position.distanceTo(camera3D.position);
	}	
}



export function cameraMove2D( event ) 
{
	if(Build.infProg.scene.camera != Build.camera2D) return;
	if(Build.infProg.mouse.click.type == '') return;
	
	
	if(event.targetTouches && event.targetTouches.length == 2)
	{
		let th1 = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };				
		let th2 = { x: event.targetTouches[1].clientX, y: event.targetTouches[1].clientY };

		let ratio2 = new THREE.Vector2(th2.x, th2.y).distanceTo(new THREE.Vector2(th1.x, th1.y));
		
		touchCameraZoom2D( ratio2 );
		
		event.clientX = (event.targetTouches[1].clientX - Build.infProg.mouse.th.pos[1].x) + event.targetTouches[0].clientX;
		event.clientY = (event.targetTouches[1].clientY - Build.infProg.mouse.th.pos[1].y) + event.targetTouches[0].clientY;							
	}	
	
	let intersects = MSV.rayIntersect( event, Build.infProg.planeMath, 'one' );
	
	Build.camera2D.position.x += Build.infProg.mouse.pos.x - intersects[0].point.x;
	Build.camera2D.position.z += Build.infProg.mouse.pos.y - intersects[0].point.z;	
}



export function cameraMove3D(params)
{ 
	
	let event = Build.infProg.mouse.event;
	
	let camera3D = Build.camera3D;
	
	
	//if(Build.infProg.mouse.click.type == '') return;
		
	if ( camera3D.userData.camera.type == 'fly' )
	{
		if ( params.type == 'left' ) 
		{  
			let theta = -( ( event.clientX - Build.infProg.mouse.pos.x ) * 0.3 ) + sphericalDelta.theta + camera3D.userData.camera.d3.theta;
			let phi = ( ( event.clientY - Build.infProg.mouse.pos.y ) * 0.3 ) + sphericalDelta.phi + camera3D.userData.camera.d3.phi;
			
			phi = Math.min( 170, Math.max( 10, phi ) );

			let radious = camera3D.userData.camera.d3.targetO.position.distanceTo(camera3D.position);
			
			camera3D.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera3D.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera3D.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera3D.position.add( camera3D.userData.camera.d3.targetO.position );  
			camera3D.lookAt( camera3D.userData.camera.d3.targetO.position );			
			
			camera3D.userData.camera.d3.targetO.rotation.set( 0, camera3D.rotation.y, 0 );
			
			sphericalDelta.theta -= 40 * (event.clientX - Build.infProg.mouse.pos.x) / Build.container.clientHeight;
			sphericalDelta.theta *= 1 - 0.10;
			//sphericalDelta.theta = 0;
			
			sphericalDelta.phi += 40 * (event.clientY - Build.infProg.mouse.pos.y) / Build.container.clientHeight;
			sphericalDelta.phi *= 1 - 0.10;			
			//sphericalDelta.phi *= 0;
			
			
			Build.infProg.mouse.pos.x = event.clientX;
			Build.infProg.mouse.pos.y = event.clientY;	
			camera3D.userData.camera.d3.theta = theta;
			camera3D.userData.camera.d3.phi = phi;			
			
		}
		if ( params.type == 'right' )    
		{			
			if(event.targetTouches && event.targetTouches.length == 2)
			{
				let th1 = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };				
				let th2 = { x: event.targetTouches[1].clientX, y: event.targetTouches[1].clientY };

				let ratio2 = new THREE.Vector2(th2.x, th2.y).distanceTo(new THREE.Vector2(th1.x, th1.y));
				
				touchCameraZoom3D( Build.infProg.mouse.th.ratio1/ratio2 );
				
				event.clientX = (event.targetTouches[1].clientX - Build.infProg.mouse.th.pos[1].x) + event.targetTouches[0].clientX;
				event.clientY = (event.targetTouches[1].clientY - Build.infProg.mouse.th.pos[1].y) + event.targetTouches[0].clientY;							
			}									
		}		
		
		WKP.pointRotation();
		HIDDO.wallAfterRender_3();
		HIDDO.showHideObjCeil();		
		
	}		
	else if ( camera3D.userData.camera.type == 'first' )
	{
		if ( params.type == 'left' )
		{
			camera3D.rotation.x -= sphericalDelta.phi/5;
			camera3D.rotation.y -= sphericalDelta.theta/5;
			
			if(camera3D.rotation.x < -1.3439) { camera3D.rotation.x = -1.3439; }
			else if(camera3D.rotation.x > 1.3439) { camera3D.rotation.x = 1.3439; }
			
			
			sphericalDelta.theta += 1 * (event.clientX - Build.infProg.mouse.pos.x) / Build.container.clientHeight;
			sphericalDelta.theta *= 1 - 0.10;
			//sphericalDelta.theta = 0;
			
			sphericalDelta.phi += 1 * (event.clientY - Build.infProg.mouse.pos.y) / Build.container.clientHeight;
			sphericalDelta.phi *= 1 - 0.10;			
			//sphericalDelta.phi *= 0;

			
			Build.infProg.mouse.pos.x = event.clientX;
			Build.infProg.mouse.pos.y = event.clientY;
		
			//camera3D.userData.camera.d3.targetO.position.set( camera3D.position.x, camera3D.userData.camera.d3.targetO.position.y, camera3D.position.z );
			camera3D.userData.camera.d3.targetO.rotation.set( 0, camera3D.rotation.y, 0 );
		}		
		
	} 
	
	if(event.targetTouches) { }
	else { CRM.rayCursor(event); }
	
	
	Build.render();
}






function touchCameraZoom2D( ratio2 )
{
	let camera2D = Build.camera2D;
	
	if ( Build.infProg.scene.camera != camera2D ) return;
	
	let delta = ratio2/Build.infProg.mouse.th.ratio1;
	Build.infProg.mouse.th.ratio1 = ratio2;


	let zoom = camera2D.zoom + (delta - 1);
	
	if(zoom < 0.4) { zoom = 0.4; }
	else if(zoom > 10) { zoom = 10; }
	
	camera2D.zoom = zoom;
	camera2D.updateProjectionMatrix();
}



function touchCameraZoom3D( zoom )
{
	let camera3D = Build.camera3D;
	
	if ( Build.infProg.scene.camera != camera3D ) return;

	if(camera3D.userData.camera.type == 'fly')
	{
		let dist = zoom * Build.infProg.mouse.th.camDist;
	
		let pos1 = camera3D.userData.camera.d3.targetO.position;
		let pos2 = camera3D.position.clone();
		
		let dir = new THREE.Vector3().subVectors( camera3D.position, pos1 ).normalize();
		dir = new THREE.Vector3().addScaledVector( dir, dist );  
		let pos3 = new THREE.Vector3().addVectors( pos1, dir );

		camera3D.position.copy( pos3 ); 			
	}
}




export function onDocumentMouseWheel( e )
{
	
	let delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;

	if ( type_browser == 'Chrome' || type_browser == 'Opera' ) { delta = -delta; }
	
	
	if(Build.infProg.scene.camera == Build.camera2D) 
	{ 
		cameraZoom2D( delta ); 
	}
	else if(Build.infProg.scene.camera == Build.camera3D) 
	{ 
		if(Build.camera3D.userData.camera.type == 'fly') { cameraZoomFly3D( delta, 1 ); }
		if(Build.camera3D.userData.camera.type == 'first') { cameraZoomFirst3D( delta ); }
	}	
	
	Build.render();
}



function cameraZoom2D( delta )
{
	let camera2D = Build.camera2D;
	let zoom = camera2D.zoom - ( delta * 0.1 * ( camera2D.zoom / 2 ) );
	
	camera2D.zoom = zoom;
	camera2D.updateProjectionMatrix();		
}


function cameraZoomFly3D( delta, z )
{
	let camera3D = Build.camera3D;
	
	if(camera3D.userData.camera.type != 'fly') return;
	
	
	let movement = ( delta < 0 ) ? z : -z;
	movement *= 1.2;
	
	let pos1 = camera3D.userData.camera.d3.targetO.position;
	let pos2 = camera3D.position.clone();
			
	
	let dir = camera3D.getWorldDirection(new THREE.Vector3());
	let offset = new THREE.Vector3().addScaledVector( dir, movement );
	
	pos1 = offsetTargetCam({posCenter: pos1, dir: dir, dist: camera3D.userData.camera.d3.minDist});
	offset = stopTargetCam({posCenter: pos1, posCam: pos2, offset: offset});
	
	
	// устанавливаем расстояние насколько близко можно приблизиться камерой к target
	function offsetTargetCam(params)
	{
		let dir = params.dir;
		let dist = params.dist;
		let posCenter = params.posCenter;
		
		let dirInvers = new THREE.Vector3(-dir.x, -dir.y, -dir.z);		
		let offset = new THREE.Vector3().addScaledVector( dirInvers, dist );
		
		let newPos = new THREE.Vector3().addVectors( posCenter, offset );
		
		return newPos;
	}	
	
	
	// запрещаем перемещение камеры за пределы центра/target
	function stopTargetCam(params)
	{	
		let offset = params.offset;
		let posCam = params.posCam;
		let posCenter = params.posCenter;
		
		let newPos = new THREE.Vector3().addVectors( posCam, offset );
		let dir2 = new THREE.Vector3().subVectors( posCenter, newPos ).normalize();		
		
		let dot = dir.dot(dir2);

		if(dot < 0) 
		{
			offset = new THREE.Vector3().subVectors( posCenter, posCam )
		}
		
		return offset;
	}	

	camera3D.position.add( offset );			
}


function cameraZoomFirst3D( delta )
{
	let camera3D = Build.camera3D;
	
	if(camera3D.userData.camera.type != 'first') return;
	
	let movement = ( delta < 0 ) ? 3 : -3;
	
	let fov = camera3D.fov - movement;
	
	if(fov < 40) fov = 40;
	if(fov > 120) fov = 120;
	
	camera3D.fov = fov;
	camera3D.userData.camera.fov.first = fov;
	
	camera3D.updateProjectionMatrix();

	Build.render();		
}







function detectBrowser()
{
	let ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
	if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
	if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
	if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
	if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
	if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
	if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

	// Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
	if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

	// а может это вообще поисковый робот
	return 'Search Bot';
}



