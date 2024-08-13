
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';





let act1 = false;
let stKeys_2 = false;

let arrKey = [];
let offsetP = new THREE.Vector3();

export function initCameraKey()
{	
	document.addEventListener("keydown", (e) => 
	{ 
		arrKey[e.keyCode] = true;		
		
		if(!e.repeat) 
		{
			let result = [87, 38, 83, 40, 65, 68].find(item => item == e.keyCode);			
			if(result && !act1) { act1 = true; posKeyDown({kof: 0.04}); }
			
			if(e.keyCode == 37 || e.keyCode == 39) { stKeys_2 = true; rotKeyDown({keys: e.keyCode, kof: 0.05}); }
		}
	});

	document.addEventListener("keyup", (e) => 
	{ 
		arrKey[e.keyCode] = false;		
		
		if(e.keyCode == 37 || e.keyCode == 39) { stKeys_2 = false; }
	});	
}



function posKeyDown(params) 
{
	let camera = Build.infProg.scene.camera;
	
	if(camera !== Build.camera3D) return;
	if(camera.userData.camera.type !== 'first') return;
		 
	let kof = params.kof;
		
	let offset = new THREE.Vector3( 0, 0, 0 );
	let count = 0;
	
	if(arrKey[87] || arrKey[38]) 
	{
		count += 1;
		offset.x += Math.sin( camera.rotation.y - Math.PI );
		offset.z += Math.cos( camera.rotation.y - Math.PI );
	}
	else if(arrKey[83] || arrKey[40]) 
	{
		count += 1;
		offset.x += Math.sin( camera.rotation.y );
		offset.z += Math.cos( camera.rotation.y );
	}
	
	if(arrKey[65]) 
	{	
		count += 1;
		offset.x += Math.sin( camera.rotation.y - 1.5707963267948966 );
		offset.z += Math.cos( camera.rotation.y - 1.5707963267948966 );			
	}	
	else if(arrKey[68]) 
	{	
		count += 1;
		offset.x += Math.sin( camera.rotation.y + 1.5707963267948966 );
		offset.z += Math.cos( camera.rotation.y + 1.5707963267948966 );							
	}	
	
	if(count > 1) 
	{
		offset.x *= 0.7;
		offset.z *= 0.7;		
	}
	
	let pos = new THREE.Vector3( offset.x * kof, 0, offset.z * kof );
	
	if(pos.x !== 0 || pos.y !== 0 || pos.z !== 0)
	{
		camera.position.add( pos );
		offsetP = offset.clone();
		
		Build.render();
		
		requestAnimationFrame( function() { posKeyDown({kof: kof}); } );		
	}
	else 
	{ 
		act1 = false; 
		
		kof *= 1 - 0.1;
		if(kof > 0.001)
		{			
			let pos = new THREE.Vector3( offsetP.x * kof, 0, offsetP.z * kof );
			camera.position.add( pos );
			Build.render();
			
			requestAnimationFrame( function() { posKeyDown({kof: kof}); } ); 			
		}			

	}		
	
}




function rotKeyDown(params) 
{
	let camera = Build.infProg.scene.camera;
	
	if(camera !== Build.camera3D) return;
	if(camera.userData.camera.type !== 'first') return;
	
	
	let keys = params.keys;
	let kof = params.kof;
	
	
	if(keys == 65 || keys == 37) { camera.rotation.y += 0.5 * kof; }
	if(keys == 68 || keys == 39) { camera.rotation.y -= 0.5 * kof; }	
	
	
	Build.render();

	if(stKeys_2) { requestAnimationFrame( function() { rotKeyDown({keys: keys, kof: kof}); } ) }
	else { rotKeyUp({keys: keys, kof: 0.05}); }
}

function rotKeyUp(params) 
{
	let camera = Build.infProg.scene.camera;
	
	if(camera !== Build.camera3D) return;
	if(camera.userData.camera.type !== 'first') return;
	
	
	let keys = params.keys;
	let kof = params.kof;
	
	
	if(keys == 65 || keys == 37) { camera.rotation.y += 0.5 * kof; }
	else if(keys == 68 || keys == 39) { camera.rotation.y -= 0.5 * kof; }	
	
	
	Build.render();

	kof *= 1 - 0.1;	
	if(kof > 0.001) requestAnimationFrame( function() { rotKeyUp({keys: keys, kof: kof}); } )

}
