
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';







export function initHiddenObject(params)
{
	let list = [];
	let arr = params.arr;
	
	for(let i = 0; i < arr.length; i++)
	{
		if(!arr[i].direction) continue;
		if(!arr[i].position) continue;

		let dir = new THREE.Vector3(arr[i].direction.x, arr[i].direction.y, arr[i].direction.z);
		
		for(let i2 = 0; i2 < arr[i].objs.length; i2++)
		{
			let o = arr[i].objs[i2];
			
			list[list.length] = {name: o, dir: dir};
		}
		
	}

	let wallVisible = [];

	Build.scene.traverse(function(child) 
	{
		for(let i = 0; i < list.length; i++)
		{
			if(new RegExp( list[i].name ,'i').test( child.name ))
			{				
				wallVisible[wallVisible.length] = child;
				
				child.userData.wall = {};
				child.userData.wall.show = true; 
				
				child.userData.direction = list[i].dir; 
				
				break;
			}
			
		}
		
	});
	
	
	Build.infProg.scene.hide.wall = wallVisible;
	
}





export function initHiddenObjCeil(params)
{
	let arr = [];
	
	let arrF = Build.infProg.scene.furnitures;
	
	for(let i = 0; i < arrF.length; i++)
	{
		if(!arrF[i].userData.snappedToCeil) continue;
		
		arr[arr.length] = arrF[i];
	}
	
	Build.infProg.scene.hide.ceil = arr;
}





export function showHideObjCeil()
{ 
	let boundG = Build.infProg.scene.boundG;
	
	if(!boundG) return;
	
	let value = 1;
	
	let camera2D = Build.camera2D;
	let camera3D = Build.camera3D;
	let camera = Build.infProg.scene.camera;
	
	if(camera == camera2D) { value = 0; }
	
	if(camera == camera3D) 
	{
		if(camera3D.userData.camera.type == 'first') { value = 1; }
		else 
		{ 
			if(camera.position.y > boundG.max.y) { value = 0; }
			else 
			{
				value = 0;
				
				if(boundG.max.y - camera.position.y > 0.1) 
				{
					value = (Math.round((boundG.max.y - camera.position.y) * 100)/100) * 3;
					
					if(value > 1) value = 1;
				}
				
			}
		}
	}

	let k = Math.abs(value + 1.9);
	if(k < 0) k = 0;
	
	let arr = Build.infProg.scene.hide.ceil;
	
	for(let i = 0; i < arr.length; i++)
	{
		setTransparentMat_2({obj: arr[i], value: value, renderOrder: k});
		
		arr[i].visible = (value <= 0) ? false : true;
	}
	
	Build.render();
}




// скрываем внешние стены, когда она перекрывает обзор
export function wallAfterRender_3()
{ 
	let wallVisible = Build.infProg.scene.hide.wall;
	
	let camPos = Build.infProg.scene.camera.getWorldDirection(new THREE.Vector3());	
	camPos = new THREE.Vector3(camPos.x, 0, camPos.z).normalize();
	
	for ( let i = 0; i < wallVisible.length; i++ )
	{
		let wall = wallVisible[ i ];		
		
		let res = camPos.dot( wallVisible[ i ].userData.direction.clone() );
		
		
		wall.userData.wall.show = false;
		let k = Math.abs(res - 1);
		if(k < 0) k = 0;		
		
		res += 0.2;		
		res = res * 10;	
		
		if(res < 0) res = 0;
		
		if(res == 0) { wall.visible = false; }
		else { wall.visible = true; }
		
		setTransparentMat_2({obj: wall, value: res, renderOrder: k});
	}
}



function setTransparentMat_2(cdm) 
{ 
	let obj = cdm.obj;
	
	let arrM = [];
	let arrO = [];
	obj.traverse(function(child)
	{
		child.renderOrder = cdm.renderOrder;
		
		if(child.material)
		{
			arrM[arrM.length] = child.material;
			arrO[arrO.length] = child;
		}			
	});	
	
	for( let i = 0; i < arrM.length; i++ ) 
	{
		// устанавливаем заданное значение
		if(cdm.value !== undefined)
		{
			let value = (arrM[i].userData.opacity < cdm.value) ? arrM[i].userData.opacity : cdm.value;
			
			arrM[i].opacity = value;
			if(arrM[i].opacity > 0.98) arrM[i].transparent = false;
			if(arrM[i].opacity < 0.98) arrM[i].transparent = true;
		}
		
		// восстанавливаем значение
		if(cdm.default)
		{
			arrM[i].opacity = arrM[i].userData.opacity;
			
			if(arrM[i].userData.opacity < 0.7) arrO[i].renderOrder = 1;
			
			if(arrM[i].userData.opacity > 0.98) arrM[i].transparent = false;
		}		
	}
}


// показываем все стены
export function showAllWallRender_2()
{	
	let wallVisible = Build.infProg.scene.hide.wall;
	
	for ( let i = 0; i < wallVisible.length; i++ )  
	{ 
		let wall = wallVisible[i];
		wall.visible = true;
		wall.userData.wall.show = true;
		setTransparentMat_2({obj: wall, default: true, renderOrder: 0});		
	}
}









