
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as LOADS from './loaderScene.js';



export function initFurnitures(params)
{
	let json = params.json;
	
	if(!json.furnitures) return;
	if(!Array.isArray(json.furnitures)) return;
	
	
	let arrF = [];

	for(let i = 0; i < json.furnitures.length; i++)
	{
		let o = json.furnitures[i];
		
		if(!o.file) continue;
		
		o.volume = 1;
		if(o.bounds && o.bounds.size) 
		{ 
			let size = o.bounds.size;
			
			o.volume = size.x * size.y * size.z; 
			if(!Build.isNumeric(o.volume)) { o.volume = 1; }
		}			
		
		arrF[arrF.length] = o;
	}
	
	if(arrF.length > 1)
	{
		arrF.sort(function (a, b) { return b.volume - a.volume; });	// сортируем по уменьшению 
	}			
	
	
	crBoxFurnitures({arr: arrF});

	return arrF;
}


function crBoxFurnitures(params)
{
	let arr = params.arr;
	
	for(let i = 0; i < arr.length; i++)
	{
		let o = arr[i];
		
		if(!o.file) continue;				
		
		if(o.bounds && o.bounds.size && o.bounds.center) 
		{ 
			let size = o.bounds.size;
			
			let geometry = new THREE.BoxGeometry( size.x, size.y, size.z );
			let material = new THREE.MeshBasicMaterial( {color: 0x000000, transparent: true, opacity: 0.5} );
			let box = new THREE.Mesh( geometry, material );
			
			let pos = o.bounds.center;
			pos.x *= -1;
			
			box.position.copy(pos);
			box.userData.file = o.file;
			
			Build.scene.add( box );
			
			Build.infProg.scene.boxF[Build.infProg.scene.boxF.length] = box;
		}			
	}	
}


export function offsetBoxFurnitures()
{
	let arr = Build.infProg.scene.boxF;
	let offset = Build.infProg.scene.offset;
	
	for(let i = 0; i < arr.length; i++)
	{
		arr[i].position.add(offset);
	}
}



export function deleteBoxFurnitures(params)
{
	let obj = params.obj;
	let arr = Build.infProg.scene.boxF;
	
	for(let i = 0; i < arr.length; i++)
	{
		if(obj.userData.file !== arr[i].userData.file) continue;
		
		Build.scene.remove(arr[i]);
		Build.render();
		
		arr.splice(i, 1);
		
		break;
	}
}




