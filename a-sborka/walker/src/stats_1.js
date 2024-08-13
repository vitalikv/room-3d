
import * as THREE from '../node_modules/three/build/three.module.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';
import * as Build from './walker.js';
import * as CRM from './cursorMove.js';
import * as WKP from './walkPoint.js';



export function initPanel()
{
	showStats_1();
	//showStats_2({start: true});	
	//showStats_3({start: true});
	//showStats_4({start: true});	
	//showStats_5({start: true});	
	//showStats_6({start: true});
	
	//crSpeedMovementFirst();
	//crSpeedFirstFly();
	
	crShLightMapIntensity();	
}



export function showStats_1()
{
	let stats = new Stats();
	Build.container.appendChild( stats.dom );
	
	if(stats.dom.children[1]) stats.dom.children[1].style.display = '';
	if(stats.dom.children[2]) stats.dom.children[2].style.display = '';
	
	stats.dom.style.display = 'flex';
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



export function showStats_6(params)
{
	let html = 
	`<div style="position: fixed; top: 250px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;">
		<div style="display: flex; width: 80px; height: 50px; align-items: center; color: #666; box-sizing: border-box; border: 1px solid #ccc; background: #fff;">
			<div style="display: block; margin: auto; font-size: 14px; text-align: center; color: #666;">
				time: ${(new Date().getTime() - Build.infProg.stats.time.number) / 1000}
			</div>
		</div>
	</div>`;
	
	if(params.start)
	{
		let div1 = document.createElement( 'div' );
		div1.innerHTML = html;
		let elem = div1.firstChild;
		Build.container.appendChild( elem );	
		
		Build.infProg.stats.time.number = new Date().getTime();
		Build.infProg.stats.time.el = elem;		
	}
	
	if(params.up && Build.infProg.stats.time.update)
	{
		let elem2 = Build.infProg.stats.time.el;
		
		elem2.innerHTML = html;
	}		
}



function crSpeedMovementFirst()
{
	let html = 
	`<div style="position: fixed; top: 60px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;">
		<div style="display: flex; width: 80px; height: 170px; align-items: center; box-sizing: border-box; border: 1px solid #ccc; background: #fff;">
			<div style="margin: auto;">
				<div nameId="textInf" style="font-size: 14px; text-align: center; color: #666;">
					0.5
				</div>
				<input type="range" min="0" value="0.5" max="1" step="0.1" orient="vertical" style="height: 140px; width: 20px; margin: 10px auto; -webkit-appearance: slider-vertical;">
			</div>
		</div>
	</div>`;	
	
	
	let div1 = document.createElement( 'div' );
	div1.innerHTML = html;
	let elem = div1.firstChild;
	Build.container.appendChild( elem );	
	
	//Build.infProg.stats.memory_m = elem;		


	elem.addEventListener('mousedown', function(e) { e.stopPropagation(); });
	elem.addEventListener('mousemove', function(e) { e.stopPropagation(); });
	elem.addEventListener('mouseup', function(e) { e.stopPropagation(); });	
	
	elem.addEventListener( 'touchstart', function(e) { e.stopPropagation(); });
	elem.addEventListener( 'touchmove', function(e) { e.stopPropagation(); });
	elem.addEventListener( 'touchend', function(e) { e.stopPropagation(); });	
	
	let ui_block = elem.querySelector('[nameId="textInf"]');
	let input = elem.querySelector('[type=range]');
	
	input.oninput = function(){ inputChangeSpeedMovementFirst({value: this.value, ui_block: ui_block}); }
	
}


function inputChangeSpeedMovementFirst(params)
{	
	params.ui_block.innerText = params.value;
	
	CRM.kof.speed = Number(params.value);
}



function crSpeedFirstFly()
{
	let html = 
	`<div style="position: fixed; top: 60px; left: 80px; cursor: pointer; opacity: 0.9; z-index: 10000;">
		<div style="display: flex; width: 80px; height: 170px; align-items: center; box-sizing: border-box; border: 1px solid #ccc; background: #fff;">
			<div style="margin: auto;">
				<div nameId="textInf" style="font-size: 14px; text-align: center; color: #666;">
					0.5
				</div>
				<input type="range" min="0" value="0.5" max="1" step="0.1" orient="vertical" style="height: 140px; width: 20px; margin: 10px auto; -webkit-appearance: slider-vertical;">
			</div>
		</div>
	</div>`;	
	
	
	let div1 = document.createElement( 'div' );
	div1.innerHTML = html;
	let elem = div1.firstChild;
	Build.container.appendChild( elem );	
	
	//Build.infProg.stats.memory_m = elem;		


	elem.addEventListener('mousedown', function(e) { e.stopPropagation(); });
	elem.addEventListener('mousemove', function(e) { e.stopPropagation(); });
	elem.addEventListener('mouseup', function(e) { e.stopPropagation(); });	
	
	elem.addEventListener( 'touchstart', function(e) { e.stopPropagation(); });
	elem.addEventListener( 'touchmove', function(e) { e.stopPropagation(); });
	elem.addEventListener( 'touchend', function(e) { e.stopPropagation(); });	
	
	let ui_block = elem.querySelector('[nameId="textInf"]');
	let input = elem.querySelector('[type=range]');
	
	input.oninput = function(){ inputChangeSpeedFirstFly({value: this.value, ui_block: ui_block}); }
	
}


function inputChangeSpeedFirstFly(params)
{	
	params.ui_block.innerText = params.value;
	
	WKP.kof.speed = Number(params.value);
}




function crShLightMapIntensity()
{
	let html = 
	`<div style="position: fixed; top: 60px; right: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;">
		<div style="display: flex; width: 80px; height: 170px; align-items: center; box-sizing: border-box; border: 1px solid #ccc; background: #fff;">
			<div style="margin: auto;">
				<div nameId="lightMapIntensity" style="font-size: 14px; text-align: center; color: #666;">
					1
				</div>
				<input type="range" min="0" value="1" max="10" step="0.1" orient="vertical" style="height: 140px; width: 20px; margin: 10px auto; -webkit-appearance: slider-vertical;">
			</div>
		</div>
	</div>`;	
	
	
	let div1 = document.createElement( 'div' );
	div1.innerHTML = html;
	let elem = div1.firstChild;
	Build.container.appendChild( elem );	
	
	//Build.infProg.stats.memory_m = elem;		


	elem.addEventListener('mousedown', function(e) { e.stopPropagation(); });
	elem.addEventListener('mousemove', function(e) { e.stopPropagation(); });
	elem.addEventListener('mouseup', function(e) { e.stopPropagation(); });	
	
	elem.addEventListener( 'touchstart', function(e) { e.stopPropagation(); });
	elem.addEventListener( 'touchmove', function(e) { e.stopPropagation(); });
	elem.addEventListener( 'touchend', function(e) { e.stopPropagation(); });	
	
	let el_lightMapI = elem.querySelector('[nameId="lightMapIntensity"]');
	let input = elem.querySelector('[type=range]');
	
	input.oninput = function(){ inputChangeLightMap({value: this.value, el_lightMapI: el_lightMapI}); }
	
}




function inputChangeLightMap(params)
{
	let obj = Build.scene;
	if(!obj) return;
	
	
	
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 	
			if(child.material)
			{
				child.material.lightMapIntensity = params.value;
				
				child.material.needsUpdate = true;
			}							
		}
	});	
	
	params.el_lightMapI.innerText = params.value;
	
	Build.render();
}








