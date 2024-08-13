
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as MSV from './mouseClick.js';
import * as SLO from './selectObj.js';



let cursorP360 = null;
let click = {};	
click.down = false;	
click.move = false;
click.type = '';
let camMove = false;

export let kof = { speed: 0.5 };


export function initCursorMove()
{
	let container = Build.container;
	
	container.addEventListener( 'mousedown', mouseCursorDown, false );
	container.addEventListener( 'mousemove', mouseCursorMove, false );
	container.addEventListener( 'mouseup', mouseCursorUp, false );	
	
	container.addEventListener( 'touchstart', mouseCursorDown, false );
	container.addEventListener( 'touchmove', mouseCursorMove, false );
	container.addEventListener( 'touchend', mouseCursorUp, false );	

	cursorP360 = createCursorP360();
}


// создаем круг для курсора
function createCursorP360()
{	
	
	let obj = new THREE.Mesh( new THREE.CircleGeometry( 0.1, 32 ), new THREE.MeshPhysicalMaterial( { color : 0xcccccc, transparent: true, opacity: 0.25, map: crTexture(), lightMap: Build.infProg.img.lightMap_1 } ) ); 
	
	obj.renderOrder = 1;
	obj.position.set(0,0,0);
	obj.visible = false;	
	Build.scene.add( obj );
	
	
	function crTexture()
	{
		
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');	

		canvas.width = 1024;
		canvas.height = 1024;
		
		context.fillStyle = 'rgba(255,255,255,1)';
		context.fillRect(0, 0, canvas.width, canvas.height);		
		
		context.beginPath();
		context.arc(canvas.width/2, canvas.height/2, 1024/2, 0, 2*Math.PI, false);
		context.fillStyle = 'rgba(255,255,255,1)';
		context.fill();
		context.lineWidth = canvas.width * 0.2;
		context.strokeStyle = 'rgba(0, 0, 0 ,1)';
		context.stroke();		
		
		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;		
		
		return texture;
	}	
	
	return obj;
}



export function visibleCursorP360(params)
{
	if(!cursorP360) return;
	
	cursorP360.visible = params.visible;
}


function mouseCursorDown( event )
{
	click.down = true;
	click.move = false;	
	click.type = 'left';
	
	switch ( event.button ) 
	{
		case 0: click.type = 'left'; break;
		case 1: click.type = 'right'; break;
		case 2: click.type = 'right'; break;
	}
	
}

function mouseCursorMove( event )
{ 
	if(cursorP360.visible) 
	{ 
		cursorP360.visible = false; 
		Build.render(); 
	}
	
	if(Build.infProg.scene.camera != Build.camera3D) return;
	if(Build.camera3D.userData.camera.type != 'first') return;		
	
	rayCursor( event );
	click.move = true;			
}

function mouseCursorUp( event )
{
	if(!click.move && click.type == 'left' && Build.camera3D.userData.camera.type == 'first' && !camMove)
	{
		setTimeout(function()
		{ 
			let pos = rayCursor( event );
			if(pos) 
			{ 
				camMove = true;
				cursorP360.visible = false;
				pos = rayCollision({pos: pos});
				//moveCamera({pos: pos});			
				let path = pathCam({startP: Build.camera3D.position, endP: pos})
				movePathCam({path: path});			
			}			
		
		}, 350);
	}
	
	click.down = false;
	click.move = false;	
}







export function rayCursor( event )
{
	if(Build.infProg.scene.camera != Build.camera3D) return null;
	if(Build.camera3D.userData.camera.type != 'first') return null;		
	if(camMove) return null;
	
	cursorP360.visible = false;
	
	let arr = [];
	if(Build.infProg.scene.construction) arr[arr.length] = Build.infProg.scene.construction;
	if(Build.infProg.scene.windows) arr[arr.length] = Build.infProg.scene.windows;
	if(Build.infProg.scene.doors) arr[arr.length] = Build.infProg.scene.doors;	
	if(Build.infProg.scene.furnitures.length > 0) { arr.push(...Build.infProg.scene.furnitures); }
	
	let ray = MSV.rayIntersect( event, arr, 'arr' );
	if(ray.length > 0 && cursorP360) 
	{ 
		if(new RegExp( 'floor' ,'i').test( ray[0].object.name ))
		{
			cursorP360.position.set( 0, 0, 0 );
			let normalMatrix = new THREE.Matrix3().getNormalMatrix( ray[0].object.matrixWorld );
			let normal = ray[0].face.normal.clone().applyMatrix3( normalMatrix ).normalize();	
			
			cursorP360.lookAt( normal );
			cursorP360.position.copy( ray[0].point );
			cursorP360.position.add( new THREE.Vector3(normal.x*0.01, normal.y*0.01, normal.z*0.01) );
			
			cursorP360.visible = true;
			
			Build.render();
			
			return ray[0].point;			
		}
	}
	
	return null;
}



function rayCollision(params)
{
	let pos = params.pos;
	
	let dir = Build.camera3D.getWorldDirection(new THREE.Vector3());
	dir = new THREE.Vector3(dir.x, 0, dir.z).normalize();
	dir.x *= 0.2;
	dir.z *= 0.2;
	
	pos.sub(dir);
	
	return pos;
}


function pathCam(params) 
{
	let startP = params.startP;
	let endP = params.endP;	
	let helpTool = params.helpTool;
	
	
	let count = 21;
	let dist = startP.distanceTo(endP);	
	let dir = new THREE.Vector3().subVectors( endP, startP ).normalize();
	let unit = new THREE.Vector3().addScaledVector( dir, dist / (count - 1)  );
	
	let points = [];
	
	for ( let i = 0; i < count; i++ )
	{
		points[i] = new THREE.Vector3().addScaledVector( unit, i );
		points[i].add(startP);
	}	

	let path = {};
	path.p1 = 0;
	path.p2 = 1;
	path.pi = 0;
	path.points = points;	
	
	
	if(helpTool)
	{
		let geometry = new THREE.BufferGeometry().setFromPoints( points );
		let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
		let line = new THREE.Line( geometry, material );
		Build.scene.add( line );				
		
		for ( let i = 0; i < points.length; i++ )
		{
			let o = new THREE.Mesh( new THREE.SphereGeometry( 0.05, 16, 16 ), new THREE.MeshBasicMaterial( {color: 0x0000ff} ) );
			o.position.copy(points[i]);
			Build.scene.add( o );			
		}		
	}
	
	
	return path;	
}



function movePathCam(params)
{
	let camera3D = Build.camera3D;	
	if(Build.infProg.scene.camera != camera3D) return;
	
	let path = params.path;	
		
	let length = path.points.length;
	let t2 = (path.p1 + path.pi)/length;
	let p1 = Math.floor( path.p1 + path.pi ) % length;
	let p2 = ( p1 + 1 ) % length;
	
	
	if(path.pi >= 1) { path.pi = 0; }
	
	
	let points = path.points;
	
	let pos = new THREE.Vector3();
	pos = new THREE.Vector3().subVectors( points[p2], points[p1] );
	pos = new THREE.Vector3().addScaledVector( pos, path.pi );
	pos.add( points[p1] );
	
	
	camera3D.position.set(pos.x, camera3D.position.y, pos.z);
	if(params.lookAt) camera3D.lookAt( params.lookAt );	
			
	
	Build.render();
		
	
	path.p1 = p1;
	path.p2 = p2;	
	path.pi += myOutSine(t2) + kof.speed;
	
	
	if(p1 + 1 < length) { requestAnimationFrame( function() { movePathCam({path: path, lookAt: params.lookAt}); } ); }
	else { camMove = false; }
}



function myOutSine(x) 
{
	return 0.5 - Math.abs(Math.cos(Math.PI * x) / 2);
}


function moveCamera(params)
{
	let pos = params.pos;
	let camera3D = Build.camera3D;
	
	camera3D.position.set(pos.x, camera3D.position.y, pos.z);
	
	Build.render();
}




