
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './test.js';
import * as MVC from './moveCamera.js';



let long_click = false;
let lastClickTime = 0;
let catchTime = 0.30;



export function onDocumentMouseDown( event ) 
{
	long_click = false;
	lastClickTime = new Date().getTime();
	
	
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
			
			Build.infProg.mouse.th.pos[1].x = th2.x;
			Build.infProg.mouse.th.pos[1].y = th2.y;
			
			Build.infProg.mouse.th.ratio1 = new THREE.Vector2(th2.x, th2.y).distanceTo(new THREE.Vector2(th1.x, th1.y));
			Build.infProg.mouse.th.camDist = Build.camera3D.userData.camera.d3.targetO.position.distanceTo(Build.camera3D.position);
		}		
		
		console.log(Build.infProg.mouse.click.type, event.targetTouches, event.targetTouches.length);
	}	

	
	MVC.clickSetCamera3D( event, Build.infProg.mouse.click.type );
	
	Build.infProg.rayhit = null;	
				
	//var ray = rayIntersect( event, infProject.obj, 'one' );
	
	//if(ray.length > 0) { infProject.rayhit = ray[0]; }	
	
	//clickObj();
	
	Build.render();
}





export function onDocumentMouseMove( event ) 
{ 
	if(event.changedTouches)
	{
		event.clientX = event.targetTouches[0].clientX;
		event.clientY = event.targetTouches[0].clientY;
	}
		

	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }
	
	MVC.cameraMove3D( event );
	
	Build.render();
}


export function onDocumentMouseUp( event )  
{	
	Build.infProg.mouse.click.type = '';
	
	if(event.changedTouches)
	{   
		if(event.targetTouches.length == 1)
		{
			Build.infProg.mouse.click.type = 'left';
		}
		else if(event.targetTouches.length == 2)
		{	
			Build.infProg.mouse.click.type = 'right';			
		}
		
		
		if(Build.infProg.mouse.click.type != '')
		{
			event.clientX = event.targetTouches[0].clientX;
			event.clientY = event.targetTouches[0].clientY;
			
			MVC.clickSetCamera3D( event, Build.infProg.mouse.click.type );					
		}
	}	
	
	Build.render();
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
	
	raycaster.setFromCamera( mouse, Build.camera );
	
	let intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }
	
	return intersects;
}



