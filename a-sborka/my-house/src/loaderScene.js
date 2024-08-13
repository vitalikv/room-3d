
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './test.js';
import * as LoadM from './loaderMaterials.js';
import * as MODS from './modeSettings.js';
import * as HIDEO from './hideWall.js';


export function loadScene_1() 
{ 	
	let url = 'model/house.json';
	Build.infProg.doc.path = 'model/';
		
	
	MODS.setToneMapping({toneMapping: 'CustomToneMapping'});	
	
	
	if(url) loadScene_2({url: url});
	
};


function loadScene_2(params)
{
	let xhr = new XMLHttpRequest();
	xhr.responseType =	"json";
	xhr.open('GET', params.url, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	
	xhr.onreadystatechange = function() 
	{		
		if(xhr.readyState == 4 && xhr.status == 200) 
		{				
			loadScene_3({json: xhr.response});			
		}
	};
	
	xhr.onprogress = function(event) 
	{
		let val = 0;
		
		if(event.lengthComputable)
		{
			val = Math.round( event.loaded / event.total * 100 );
		}
		else
		{
			let total = parseInt(xhr.getResponseHeader('content-length'), 10);
			val = Math.round( event.loaded / total * 10 );
		}
		console.log(val);
		if(val > 100) val = 100;
		
		
		//elemProgressBar.style.width = val/2 + '%';		
		//elemLoad.innerText = 'Json ' + val + '%';		
	};	
	
	xhr.send();	
}


function loadScene_3(params)
{
	let json = params.json;
	
	for(let i = 0; i < json.images.length; i++)
	{
		let url = json.images[i].url;		
		json.images[i].url = '';
		json.images[i].url_2 = url;
	}	
	
	let obj = new THREE.ObjectLoader().parse( json );
	
	Build.infProg.obj = obj;
	
	Build.scene.add( obj );
	
	console.log(obj);
	
	getBoundObject_1({obj: obj});
	
	let wallVisible = [];
	let plitaVisible = [];
	//let plitaVisible = [];
	
	obj.traverse(function(child) 
	{
		if(new RegExp( 'VrayEnv_Panorama_unlit' ,'i').test( child.name ))
		{
			child.visible = false;				
		}
		
		if(new RegExp( 'HiddenObject' ,'i').test( child.name ))
		{					
			wallVisible[wallVisible.length] = child;
			
			child.userData.wall = {};
			child.userData.wall.show = true;
			
			let dir = new THREE.Vector3(child.userData.direction.x, child.userData.direction.y, child.userData.direction.z); 
			
			child.userData.direction = dir; 
		}
		else if(new RegExp( 'Plita' ,'i').test( child.name ))
		{
			plitaVisible[plitaVisible.length] = child;
		}
		else if(child.userData.hideInWalk)
		{
			plitaVisible[plitaVisible.length] = child;
		}
		
		if(child.material)
		{
			let userData = {};
			userData.opacity = child.material.opacity;									
			child.material.userData = userData;

			if(/illum/i.test( child.material.name )) 
			{
				let m1 = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, metalness: 0, roughness: 1 });
				m1.userData = userData;
				//m1.map = child.material.map;
				m1.lightMap = Build.infProg.img.lightMap_1;
				m1.opacity = child.material.opacity;
				
				//if(m1.map) m1.map.encoding = THREE.sRGBEncoding;
				//if(m1.lightMap) m1.lightMap.encoding = THREE.sRGBEncoding;
				
				child.material = m1;
				child.material.needsUpdate = true;
			}			
		}			
			
	});	
	
	
	Build.infProg.scene.hide.wall = wallVisible;
	Build.infProg.scene.hide.plita = plitaVisible;
	
	HIDEO.wallAfterRender_3();
	Build.render();
	
	let divLoad = document.querySelector('[nameId="loader"]');
	divLoad.style.display = "none";	
	
	LoadM.loadImg_1({json: json, obj: obj});
	
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 	
			if(child.material)
			{
				child.material.lightMapIntensity = 3.2;
				
				child.material.needsUpdate = true;
			}							
		}
	});	
}




function getBoundObject_1(cdm)
{
	let obj = cdm.obj;
	
	if(!obj) return;
	
	let arr = [];
	let arrFloor = [];
	let arrObj = [];	
	
	obj.updateMatrixWorld(true);
	
	obj.traverse(function(child) 
	{
		if (child instanceof THREE.Mesh)
		{
			if(child.geometry) 
			{ 
				//if(new RegExp( 'floor' ,'i').test( child.name )){ arr[arr.length] = child; }
				//if(new RegExp( 'ceil' ,'i').test( child.name )){ arr[arr.length] = child; }
				if(new RegExp( 'VrayEnv_Panorama_unlit' ,'i').test( child.name )){}
				else { arr[arr.length] = child; }
				
			}
		}
	});	

	//scene.updateMatrixWorld();
	
	let v = [];
	
	for ( let i = 0; i < arr.length; i++ )
	{		
		arr[i].geometry.computeBoundingBox();	
		arr[i].geometry.computeBoundingSphere();

		let bound = arr[i].geometry.boundingBox;
		
		//console.log(111111, arr[i], bound);

		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

		
		let pos = arr[i].geometry.boundingSphere.center.clone().applyMatrix4( arr[i].matrixWorld );
		
		if(new RegExp( 'floor' ,'i').test( arr[i].name ))
		{
			arrFloor[arrFloor.length] = {o: arr[i], name: arr[i].name, pos: pos};
		}
		else
		{
			arrObj[arrObj.length] = {o: arr[i], name: arr[i].name, pos: pos};
		}
	}
	
	let bound = { min : { x : 999999, y : 999999, z : 999999 }, max : { x : -999999, y : -999999, z : -999999 } };
	
	
	for(let i = 0; i < v.length; i++)
	{
		if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
		if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
		if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
		if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
		if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
		if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
	}
	
	let offset = new THREE.Vector3(-((bound.max.x - bound.min.x)/2 + bound.min.x), 0, -((bound.max.z - bound.min.z)/2 + bound.min.z));
	obj.position.copy(offset);
	
	
	
	for ( let i = 0; i < arrFloor.length; i++ )
	{
		arrFloor[i].pos.add(offset);		
	}
	
	for ( let i = 0; i < arrObj.length; i++ )
	{
		arrObj[i].pos.add(offset);		
	}	

	Build.infProg.scene.floor = arrFloor;
	Build.infProg.scene.obj = arrObj;	
}





