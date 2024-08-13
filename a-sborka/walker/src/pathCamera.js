
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as HIDDO from './HiddenObject.js';
import * as WKP from './walkPoint.js';




export function initPathCam(params) 
{
	let points = splineCircle({r: 15});

	let geometry = new THREE.BufferGeometry().setFromPoints( points );
	let material = new THREE.LineBasicMaterial({ color: 0x0000ff });

	let line = new THREE.Line( geometry, material );
	line.userData.path = {};
	line.userData.path.p1 = 0;
	line.userData.path.p2 = 1;
	line.userData.path.pi = 0.0;
	line.userData.path.points = points;
	line.userData.cam = null;
	Build.infProg.scene.pathCam = line;
	
	Build.scene.add( line );		
	
	movePathCam();
}



function splineCircle(params)
{
	let r = params.r;
	
	let count = 68; 
	let circle = [];
	let g = (Math.PI * 2) / count;
	
	let vel = 0;
	
	for ( let i = 0; i < count + 1; i++ )
	{
		let angle = g * i;
		circle[i] = new THREE.Vector3();
		
		let x = Math.sin(angle + Math.PI/4);
		let z = Math.cos(angle + Math.PI/4);
		
		circle[i].x = (x * r) + x * r * ((1 - (i/68)) * 1);
		circle[i].z = (z * r) + z * r * ((1 - (i/68)) * 1);
		
		circle[i].y = (1 - (i/68)) * 20 + 5;
		
		circle[i].userData = {};
		
		let vel_2 = easeOutSine((i + 1)/(count + 1));
		
		circle[i].userData.velocity = (vel_2 - vel) * 60;				
		
		vel = vel_2;
	}	
	
	return circle;
}




function movePathCam()
{
	let line = Build.infProg.scene.pathCam;
	
	
		
	let length = line.userData.path.points.length;
	let t2 = (line.userData.path.p1 + line.userData.path.pi)/length;
	let p1 = Math.floor( line.userData.path.p1 + line.userData.path.pi ) % length;
	let p2 = ( p1 + 1 ) % length;
	
	if(line.userData.path.pi >= 1) { line.userData.path.pi = 0; }
	
	

	
	let points = line.userData.path.points;
	
	let pos = new THREE.Vector3();
	pos = new THREE.Vector3().subVectors( points[p2], points[p1] );
	pos = new THREE.Vector3().addScaledVector( pos, line.userData.path.pi );
	pos.add( points[p1] );

	let camera = Build.infProg.scene.camera;
	
	camera.position.copy(pos);
	camera.lookAt( new THREE.Vector3(0, 1, 0) );	
		
	
	HIDDO.wallAfterRender_3();
	
	Build.render();
		
	
	line.userData.path.p1 = p1;
	line.userData.path.p2 = p2;	
	line.userData.path.pi += points[p1].userData.velocity;
	
	
	if(p1 + 1 < length && !Build.infProg.mouse.click.down) { requestAnimationFrame( movePathCam ); }
	else { WKP.visibleInfPoint({visPoint: true, visCursor: false, visButt: false}); }
}



function easeInOutSine(x) 
{
	return -(Math.cos(Math.PI * x) - 1) / 2;
}

function easeOutSine(x) 
{
	return Math.sin((x * Math.PI) / 2);
}






