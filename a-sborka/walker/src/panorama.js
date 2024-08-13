
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';





export function initPanorama(params)
{
	let geometry = new THREE.SphereGeometry( 32, 100, 100 );
	let material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.BackSide, toneMapped: false} );
	let obj = new THREE.Mesh( geometry, material );
	
	obj.visible = false;
	
	Build.scene.add( obj );	
	
	
	obj.userData.viewImg = [];
	
	obj.userData.viewImg[0] = new THREE.TextureLoader().load('https://files.planoplan.com/upload/catalog/lot/202111/b4564709.jpg');
	obj.userData.viewImg[1] = new THREE.TextureLoader().load('https://files.planoplan.com/upload/catalog/lot/202111/d7c1bdc7.jpg');
	obj.userData.viewImg[2] = new THREE.TextureLoader().load('https://files.planoplan.com/upload/catalog/lot/202111/5bb16f83.jpg');
	
	obj.userData.viewImg[0].encoding = THREE.sRGBEncoding;
	obj.userData.viewImg[1].encoding = THREE.sRGBEncoding;
	obj.userData.viewImg[2].encoding = THREE.sRGBEncoding;
	
	obj.userData.viewImg[0].needsUpdate = true;
	obj.userData.viewImg[1].needsUpdate = true;
	obj.userData.viewImg[2].needsUpdate = true;
	
	obj.material.map = obj.userData.viewImg[2];
	obj.material.needsUpdate = true;

	Build.infProg.scene.panorama = obj;
	
	
	document.addEventListener("keydown", function (e) 
	{ 
		let ind = undefined;
		
		if(e.keyCode == 49){ ind = 0; }
		if(e.keyCode == 50){ ind = 1; }
		if(e.keyCode == 51){ ind = 2; }

		if(ind !== undefined)
		{
			let panorama = Build.infProg.scene.panorama;
			
			panorama.material.map = panorama.userData.viewImg[ind];
			panorama.material.needsUpdate = true;
			Build.render();
		}		
	});
	
}


export function showHidePanorama(params)
{
	if(!Build.infProg.scene.panorama) return;
	if(!params) params = {};
		
	let camera = Build.infProg.scene.camera;
	let show = false;
	
	if(camera == Build.camera2D)
	{						
		show = false;		
	}
	else if(camera == Build.camera3D)
	{	
		if(Build.camera3D.userData.camera.type == 'fly') { show = false; }
		if(Build.camera3D.userData.camera.type == 'first') { show = true; }
		if(params.visible !== undefined) { show = params.visible; }
	}
	
	Build.infProg.scene.panorama.visible = show;
	
	Build.render();
}
	








