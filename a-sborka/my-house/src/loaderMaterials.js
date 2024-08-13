
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './test.js';
import * as SMat from './setMaterials.js';



export function loadImg_1(params)
{
	let json = params.json;
	let obj = params.obj;
	
	
	let arrT = getMatIdForImg_1({json: json});	
	
	let arrM = [];
	
	obj.traverse(function(child) 
	{
		if(child.material)
		{
			//if(Array.isArray(child.material)) { console.log('----------', arrM.length); arrM.concat(child.material); console.log('----------', arrM.length); }
			//else { arrM[arrM.length] = child.material; }	

			SMat.setMatSetting_1({obj: child});
			arrM[arrM.length] = child.material;
		}		
	});
	
	
	for(let i = 0; i < arrT.length; i++)
	{
		for(let i2 = 0; i2 < arrT[i].arrM.length; i2++)
		{
			let ind = arrM.findIndex(item => item.uuid == arrT[i].arrM[i2].matUuid);
			
			if(ind > -1)
			{
				arrT[i].arrM[i2].matO = arrM[ind];
			}
		}
	}	

	for(let i = 0; i < arrT.length; i++)
	{		
		getTexture(arrT[i]);
	}


	let arrFloor = Build.infProg.scene.floor;
	
	for ( var i = 0; i < arrFloor.length; i++ )
	{
		SMat.setMatSetting_3({obj: arrFloor[i].o, pos: arrFloor[i].pos})		
	}		
}



function getMatIdForImg_1(params)
{
	let json = params.json;
	let arr = [];
	
	for(let i = 0; i < json.images.length; i++)
	{
		let url = json.images[i].url_2;
				
		if(url)
		{	
			arr[arr.length] = getMatIdForImg_2({json: json, url: url, uuid: json.images[i].uuid});
		}
	}
	
	return arr;
}



function getMatIdForImg_2(params)
{
	let url = params.url;
	
	let json = params.json;	
	let uuid = params.uuid;
	
	let fs = json.textures.filter(o => o.image == uuid);
	
	let arr = [];
	
	for(let i = 0; i < fs.length; i++)
	{
		for(let i2 = 0; i2 < json.materials.length; i2++)
		{
			if(json.materials[i2].lightMap)
			{
				if(fs[i].uuid == json.materials[i2].lightMap){ arr[arr.length] = {type: 'lightMap', matUuid: json.materials[i2].uuid}; }
			}
			if(json.materials[i2].map)
			{
				if(fs[i].uuid == json.materials[i2].map){ arr[arr.length] = {type: 'map', matUuid: json.materials[i2].uuid}; }
			}			
		}
		
	}
	
	
	return {url: url, arrM: arr};	
}



async function getTexture(params)
{
	//console.log(params);
	let url = Build.infProg.doc.path + params.url;
	let name = params.url.split( '.' )[0];
	
	//console.log(name);
	let type = url.split( '.' );
	type = type[type.length - 1];
	
	let typeT = '';
	
	let arrStr = type.split('?');
	if(arrStr.length > 1) { type = arrStr[0]; typeT = '?' + arrStr[1];}	
	
	
	if(type == 'exr')
	{
		type = 'jpg';
	}
	
	url = Build.infProg.doc.path + name + '_x4.' + type;
	
	
	let xhr = new XMLHttpRequest();
	xhr.responseType =	"blob";
	xhr.open('GET', url, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() 
	{		
		if(xhr.readyState == 4 && xhr.status == 200) 
		{	
			let image = new Image();
			image.src = window.URL.createObjectURL(xhr.response);
			
			image.onload = function()
			{
				for(let i = 0; i < params.arrM.length; i++)
				{
					if(!params.arrM[i].matO) continue;
					
					params.arrM[i].matO[params.arrM[i].type].image = image;
					
					params.arrM[i].matO[params.arrM[i].type].encoding = THREE.sRGBEncoding;
					params.arrM[i].matO[params.arrM[i].type].needsUpdate = true;
					params.arrM[i].matO.needsUpdate = true;
					
					if(params.arrM[i].type == 'map') 
					{
						params.arrM[i].matO.userData.map = params.arrM[i].matO[params.arrM[i].type];							
					}						
					
				}
				
				Build.render();			
			}								

		}
	}		
	xhr.send();		

}







