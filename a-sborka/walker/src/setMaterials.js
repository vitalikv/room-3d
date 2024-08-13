
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';







export function setMatSetting_1(params)
{
	
	let obj = params.obj;
	let name = obj.material.name;
	
	if(!obj) return;	

	let list = [];
	
	list[list.length] = {old: 'mattet', new: 'tulle', metalness: 0, roughness: 1};
	list[list.length] = {old: 'matte', new: 'matt', metalness: 0, roughness: 1};
	list[list.length] = {old: 'satin', new: 'semimatt', metalness: 0.19, roughness: 0.2};
	list[list.length] = {old: 'semigloss', new: 'semiglossy', metalness: 0.3, roughness: 0.3};
	list[list.length] = {old: 'glossy', new: 'glossy', metalness: 0.6, roughness: 0.3, envMap: true};	
	list[list.length] = {old: 'brushed', new: 'brushed', metalness: 0.33, roughness: 0.23, envMap: true};
	list[list.length] = {old: 'polished', new: 'polished', metalness: 0.7, roughness: 0.1, envMap: true};
	list[list.length] = {old: 'reflective', new: 'reflective', metalness: 1, roughness: 0.0, envMap: true};
	list[list.length] = {old: 'chrome', new: 'chrome', metalness: 1.0, roughness: 0, envMap: true};
	list[list.length] = {old: 'mirror', new: 'mirror', metalness: 1, roughness: 0, envMap: true};
	list[list.length] = {old: 'glass', new: 'glass', metalness: 1, roughness: 0, opacity: 0.26};
	list[list.length] = {old: 'steklo_blur', new: 'frostedglass', metalness: 0.45, roughness: 0.26, opacity: 0.26};	
	list[list.length] = {old: 'selfluminous', new: 'selfluminous', metalness: 0, roughness: 1};	
	
	
	for ( let i = 0; i < list.length; i++ )
	{		
		if(new RegExp( list[i].old ,'i').test( name ))
		{	 
			
			let uuid = obj.material.uuid;			
			
			let mat = obj.material.clone();			
			obj.material.dispose();
			obj.material = mat;						
			
			obj.material.uuid = uuid;
			obj.material.name = list[i].old;

			if(obj.material.map) obj.material.map.encoding = THREE.sRGBEncoding;
			if(obj.material.lightMap) obj.material.lightMap.encoding = THREE.sRGBEncoding;

			if(list[i].old == 'selfluminous') 
			{
				obj.material.emissive = obj.material.color;
			}	
			
			obj.material.metalness = list[i].metalness;
			obj.material.roughness = list[i].roughness;
			if(list[i].opacity) obj.material.opacity = list[i].opacity;
			obj.material.needsUpdate = true;
			
			if(list[i].envMap) obj.material.userData.envMap = true;			
			
			
			//Build.render();	
			
			break;
		}
	}	
	
}




export function crMatReflectionProbe()
{
	let imgSize = 256;	
	
	let pmremGenerator = new THREE.PMREMGenerator( Build.renderer );
	pmremGenerator.compileEquirectangularShader();

	let cubeCamera = new THREE.CubeCamera(0.01, 10, new THREE.WebGLCubeRenderTarget( imgSize, {encoding: THREE.sRGBEncoding} ));
	
	for ( let i = 0; i < Build.infProg.scene.reflectionProbe.length; i++ )
	{
		cubeCamera.position.copy(Build.infProg.scene.reflectionProbe[i].pos);
		cubeCamera.update( Build.renderer, Build.scene );	
		

		let envMap = pmremGenerator.fromEquirectangular( cubeCamera.renderTarget.texture ).texture;		
		
		
		if(Build.infProg.scene.reflectionProbe[i].obj)
		{
			let ro = Build.infProg.scene.reflectionProbe[i].obj;
			//ro.material.metalness = 0.7, 
			//ro.material.roughness = 0.0;			
			ro.material.envMap = envMap;
			ro.material.needsUpdate = true;				
		}
		
		
		for ( let i2 = 0; i2 < Build.infProg.scene.furnitures.length; i2++ )
		{
			let obj = Build.infProg.scene.furnitures[i2];
			
			obj.traverse(function(child)
			{
				if(child.userData && child.userData.uuidRP)
				{				
					if(child.userData.uuidRP == Build.infProg.scene.reflectionProbe[i].uuid)
					{  
						if(child.material.userData.envMap && child.material.type == 'MeshStandardMaterial')
						{
							child.material.envMap = envMap;
							child.material.needsUpdate = true;								
						}
					}
				}				
			});
		}
		
		envMap.dispose();
		cubeCamera.renderTarget.texture.dispose();
	}	
	
	Build.infProg.scene.reflectionProbe = [];
	pmremGenerator.dispose();
}






// очищаем объект из памяти
function disposeNode(node) 
{
	if (node.geometry) { node.geometry.dispose(); }
	
	if (node.material) 
	{
		var materialArray = [];
		
		if(node.material instanceof Array) { materialArray = node.material; }
		else { materialArray = [node.material]; }
		
		materialArray.forEach(function (mtrl, idx) 
		{
			if (mtrl.map) mtrl.map.dispose();
			if (mtrl.lightMap) mtrl.lightMap.dispose();
			if (mtrl.bumpMap) mtrl.bumpMap.dispose();
			if (mtrl.normalMap) mtrl.normalMap.dispose();
			if (mtrl.specularMap) mtrl.specularMap.dispose();
			if (mtrl.envMap) mtrl.envMap.dispose();
			mtrl.dispose();
		});
	}
	
	Build.renderer.renderLists.dispose();
}









