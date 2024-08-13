
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './test.js';







// меняем тип ToneMapping
export function setToneMapping(params)
{	
	let renderer = Build.renderer;
	let toneMapping = params.toneMapping;
	
	if(!toneMapping)
	{
		if(renderer.toneMapping == THREE.NoToneMapping) { toneMapping = 'CustomToneMapping'; }
		else { toneMapping = 'NoToneMapping'; }
	}
	
	
	if(toneMapping == 'NoToneMapping')
	{
		renderer.toneMapping = THREE.NoToneMapping; 
	}	
	else if(toneMapping == 'LinearToneMapping')
	{
		renderer.toneMapping = THREE.LinearToneMapping;
	}
	else if(toneMapping == 'ReinhardToneMapping')
	{
		renderer.toneMapping = THREE.ReinhardToneMapping;
	}
	else if(toneMapping == 'CineonToneMapping')
	{
		renderer.toneMapping = THREE.CineonToneMapping;
	}
	else if(toneMapping == 'ACESFilmicToneMapping')
	{
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
	}
	else if(toneMapping == 'CustomToneMapping')
	{
		renderer.toneMapping = THREE.CustomToneMapping;
	}	
	else 
	{
		return;
	}
	
	
	
	
	let obj = Build.infProg.obj;
	
	if(!obj) return;
	
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 	
			if(child.material)
			{
				child.material.needsUpdate = true;
			}							
		}
	});		
	
	Build.render();	

}


THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
	'vec3 CustomToneMapping( vec3 color ) { return color; }',
	`#define Uncharted2Helper( x ) max( ((5.3 * x)*(5.3 * x) + 0.104 * x) / ((5.184 * x)*(5.184 * x) + 4.052 * x + 0.362), vec3( 0.0 ) )
	float toneMappingWhitePoint = 1.0;
	vec3 CustomToneMapping( vec3 color ) {
		color *= toneMappingExposure;
		return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
	}`
);








