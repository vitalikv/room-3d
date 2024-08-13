
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './test.js';
import * as MSV from './mouseClick.js';
import * as HIDEO from './hideWall.js';




let type_browser = detectBrowser();


// создаем круг (объект), для обозначения куда смотрит камера в 3D режиме
export function createCenterCamObj()
{

	let material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	let obj = new THREE.Mesh( new THREE.BoxGeometry(0.07, 0.07, 0.07), material );
	obj.renderOrder = 2;
	obj.visible = false;
	
	Build.scene.add( obj );
	
	
	return obj;
}



// первоначальные настройки при страте 
export function startPosCamera3D(cdm)
{
	let camera3D = Build.camera3D;
	
	camera3D.position.x = 0;
	camera3D.position.y = cdm.radious * Math.sin( cdm.phi * Math.PI / 360 );
	camera3D.position.z = cdm.radious * Math.cos( cdm.theta * Math.PI / 360 ) * Math.cos( cdm.phi * Math.PI / 360 );			
			
	camera3D.lookAt(new THREE.Vector3( 0, 0, 0 ));
	
	camera3D.userData.camera.save.pos = camera3D.position.clone();
	camera3D.userData.camera.save.radius = camera3D.userData.camera.d3.targetO.position.distanceTo(camera3D.position);	
}



export function clickSetCamera3D( event, click )
{
	let camera3D = Build.camera3D;
	
	if ( Build.camera != camera3D ) { return; }
	
	Build.infProg.mouse.pos.x = event.clientX;
	Build.infProg.mouse.pos.y = event.clientY;
	
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
	}
	else if ( click == 'right' )		
	{
		Build.infProg.planeMath.position.copy( camera3D.userData.camera.d3.targetO.position );
		//Build.infProg.planeMath.rotation.set(-Math.PI/2, 0, 0);
		Build.infProg.planeMath.rotation.copy( camera3D.rotation );
		Build.infProg.planeMath.updateMatrixWorld();

		let intersects = MSV.rayIntersect( event, Build.infProg.planeMath, 'one' );	
		camera3D.userData.camera.click.pos = intersects[0].point;  
	}	
}





export function cameraMove3D( event )
{ 
	let camera3D = Build.camera3D;
	
	if ( camera3D.userData.camera.type == 'fly' )
	{
		if ( Build.infProg.mouse.click.type == 'left' ) 
		{  
			let radious = camera3D.userData.camera.d3.targetO.position.distanceTo( camera3D.position );
			
			let theta = - ( ( event.clientX - Build.infProg.mouse.pos.x ) * 0.5 ) + camera3D.userData.camera.d3.theta;
			let phi = ( ( event.clientY - Build.infProg.mouse.pos.y ) * 0.5 ) + camera3D.userData.camera.d3.phi;
			phi = Math.min( 180, Math.max( -60, phi ) );

			camera3D.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera3D.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera3D.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera3D.position.add( camera3D.userData.camera.d3.targetO.position );  
			camera3D.lookAt( camera3D.userData.camera.d3.targetO.position );			
			
			camera3D.userData.camera.d3.targetO.rotation.set( 0, camera3D.rotation.y, 0 );
			
			HIDEO.wallAfterRender_3();
		}
		if ( Build.infProg.mouse.click.type == 'right' )    
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
			
			let intersects = MSV.rayIntersect( event, Build.infProg.planeMath, 'one' );
			if(!intersects[0]) return;
			let offset = new THREE.Vector3().subVectors( camera3D.userData.camera.click.pos, intersects[0].point );
			camera3D.position.add( offset );
			camera3D.userData.camera.d3.targetO.position.add( offset );
						
			
			HIDEO.wallAfterRender_3();
		}
		
	}		
	
}


function touchCameraZoom3D( zoom )
{
	let camera3D = Build.camera3D;
	
	if ( Build.camera != camera3D ) return;

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

	cameraZoom3D( delta, 1 );
	
	Build.render();
}






function cameraZoom3D( delta, z )
{
	//if ( camera != camera3D ) return;

	let camera3D = Build.camera3D;
	
	if(camera3D.userData.camera.type == 'fly')
	{
		var vect = ( delta < 0 ) ? z : -z;

		var pos1 = camera3D.userData.camera.d3.targetO.position;
		var pos2 = camera3D.position.clone();
		
		var dir = new THREE.Vector3().subVectors( pos1, camera3D.position ).normalize();
		dir = new THREE.Vector3().addScaledVector( dir, vect );
		dir.addScalar( 0.001 );
		var pos3 = new THREE.Vector3().addVectors( camera3D.position, dir );	


		var qt = Build.quaternionDirection( new THREE.Vector3().subVectors( pos1, camera3D.position ).normalize() );
		var v1 = Build.localTransformPoint( new THREE.Vector3().subVectors( pos1, pos3 ), qt );


		var offset = new THREE.Vector3().subVectors( pos3, pos2 );
		var pos2 = new THREE.Vector3().addVectors( pos1, offset );

		var centerCam_2 = pos1.clone();
		
		if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam_2.copy( pos2 ); } }
		
		if ( v1.z >= 0.05) 
		{ 
			camera3D.userData.camera.d3.targetO.position.copy(centerCam_2);
			camera3D.position.copy( pos3 ); 	
		}			
	}
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



