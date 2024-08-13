
import * as THREE from '../node_modules/three/build/three.module.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';
import * as Build from './test.js';





export function showStats_1()
{
	let stats = new Stats();
	Build.container.appendChild( stats.dom );
	
	Build.infProg.stats.fps = stats;		
}


export function showStats_2(params)
{
	let html = 
	`<div style="position: fixed; top: 50px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;">
		<div style="display: flex; width: 80px; height: 50px; align-items: center; color: #666; box-sizing: border-box; border: 1px solid #ccc; background: #fff;">
			<div style="display: block; margin: auto; font-size: 14px; text-align: center; color: #666;">
				calls: ${Build.renderer.info.render.calls}
			</div>
		</div>
	</div>`;
	
	if(params.start)
	{
		let div1 = document.createElement( 'div' );
		div1.innerHTML = html;
		let elem = div1.firstChild;
		Build.container.appendChild( elem );	
		
		Build.infProg.stats.drcall = elem;
		
		//console.log(Build.renderer.info.programs);
		//console.log(Build.renderer.info.render);
		//console.log(Build.renderer.info.memory);
		
	}
	
	if(params.up)
	{
		let elem2 = Build.infProg.stats.drcall;
		
		elem2.innerHTML = html;
	}		
}



export function showStats_3(params)
{
	let html = 
	`<div style="position: fixed; top: 100px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;">
		<div style="display: flex; width: 80px; height: 50px; align-items: center; color: #666; box-sizing: border-box; border: 1px solid #ccc; background: #fff;">
			<div style="display: block; margin: auto; font-size: 14px; text-align: center; color: #666;">
				triangles: ${Build.renderer.info.render.triangles}
			</div>
		</div>
	</div>`;
	
	if(params.start)
	{
		let div1 = document.createElement( 'div' );
		div1.innerHTML = html;
		let elem = div1.firstChild;
		Build.container.appendChild( elem );	
		
		Build.infProg.stats.triang = elem;		
	}
	
	if(params.up)
	{
		let elem2 = Build.infProg.stats.triang;
		
		elem2.innerHTML = html;
	}		
}



export function showStats_4(params)
{
	let html = 
	`<div style="position: fixed; top: 150px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;">
		<div style="display: flex; width: 80px; height: 50px; align-items: center; color: #666; box-sizing: border-box; border: 1px solid #ccc; background: #fff;">
			<div style="display: block; margin: auto; font-size: 14px; text-align: center; color: #666;">
				geometries: ${Build.renderer.info.memory.geometries}
			</div>
		</div>
	</div>`;
	
	if(params.start)
	{
		let div1 = document.createElement( 'div' );
		div1.innerHTML = html;
		let elem = div1.firstChild;
		Build.container.appendChild( elem );	
		
		Build.infProg.stats.memory_g = elem;		
	}
	
	if(params.up)
	{
		let elem2 = Build.infProg.stats.memory_g;
		
		elem2.innerHTML = html;
	}		
}



export function showStats_5(params)
{
	let html = 
	`<div style="position: fixed; top: 200px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;">
		<div style="display: flex; width: 80px; height: 50px; align-items: center; color: #666; box-sizing: border-box; border: 1px solid #ccc; background: #fff;">
			<div style="display: block; margin: auto; font-size: 14px; text-align: center; color: #666;">
				textures: ${Build.renderer.info.memory.textures}
			</div>
		</div>
	</div>`;
	
	if(params.start)
	{
		let div1 = document.createElement( 'div' );
		div1.innerHTML = html;
		let elem = div1.firstChild;
		Build.container.appendChild( elem );	
		
		Build.infProg.stats.memory_m = elem;		
	}
	
	if(params.up)
	{
		let elem2 = Build.infProg.stats.memory_m;
		
		elem2.innerHTML = html;
	}		
}



