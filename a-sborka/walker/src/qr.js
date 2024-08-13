


import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './walker.js';
import * as SLO from './selectObj.js';



let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');



export function assignEvenCopyQR(params)
{
	let html = params.html;
	let el = html.querySelector('[nameId="bt_copy_qr"]');
	let el_mess_qr = html.querySelector('[nameId="qr_info_copy_qr"]');
	let el_mess_url = html.querySelector('[nameId="qr_info_copy_url"]');
	
	el.onmousedown =(event)=> 
	{
		copyTxt({str: Build.infProg.elem.qrId.innerText});
		
		el_mess_qr.style.display = '';
		el_mess_url.style.display = 'none';		
		setTimeout(() => { el_mess_qr.style.display = 'none'; }, 2000);  		 
	}		
}


export function assignEvenCopyUrl(params)
{
	let html = params.html;
	let el = html.querySelector('[nameId="bt_copy_url"]');
	let el_mess_qr = html.querySelector('[nameId="qr_info_copy_qr"]');
	let el_mess_url = html.querySelector('[nameId="qr_info_copy_url"]');
	
	el.onmousedown =(event)=> 
	{
		copyTxt({str: document.location.href});
		
		el_mess_url.style.display = ''; 
		el_mess_qr.style.display = 'none';
		setTimeout(() => { el_mess_url.style.display = 'none'; }, 2000);  		 
	}	
}


function copyTxt(params)
{
	let str = params.str;
	str = str.trim();
	
	let inp = document.createElement('input');
	document.body.appendChild(inp);
	inp.value = str;
	inp.select();
	document.execCommand('copy',false);
	inp.remove();
}	


export function assignEvenActiveQR(params)
{
	let html = params.html;
	let el = html.querySelector('[nameId="act_qr"]');
	let input = html.querySelector('[nameId="qr_load_input"]');
	let el_qr_wrap = html.querySelector('[nameId="qr_wrap"]');
	
	el.onmousedown =(event)=> 
	{
		updatePaints({qr: input.value});
		input.value = "";
		el_qr_wrap.style.display = 'none';
	}	
	
	
	function updatePaints(params)
	{
		let qr = params.qr;
		qr = qr.trim();
				
		if(!qr) return;
		if(/^[a-z]{1,20}$/i.test( qr ) == false) return;
		
		
		let paints = Build.infProg.scene.paints;	
		let arrQr = qr.split('');	
		
		for ( let i = 0; i < paints.length; i++ )
		{
			let activeId = alphabet.findIndex(item => new RegExp( item ,'i').test( arrQr[i] ) );
			
			if(paints[i].activeId == activeId) continue;
			
			if(activeId > -1) 
			{				
				paints[i].activeId = activeId; 
				
				let elMain = paints[i].catalog.main;
				let elItem = paints[i].catalog.items[activeId];

				elMain.innerHTML = elItem.innerHTML;
				elMain.style.cssText = elItem.style.cssText;
			
				SLO.changeLots({paintsId: i, lotId: activeId});				
			}
		}
	}
}




export function checkUrlQR()
{
	let paramsString = document.location.search;
	let searchParams = new URLSearchParams(paramsString);
	let qr = searchParams.get("QR");
	
	if(!qr) return;
	
	let paints = Build.infProg.scene.paints;	
	let arrQr = qr.split('');	
	
	for ( let i = 0; i < paints.length; i++ )
	{
		let activeId = alphabet.findIndex(item => new RegExp( item ,'i').test( arrQr[i] ) );
		paints[i].activeId = activeId;  
	}
}


export function setUrlQR()
{
	let paints = Build.infProg.scene.paints;
	let str = '';
	
	for ( let i = 0; i < paints.length; i++ )
	{
		str += '' + alphabet[paints[i].activeId];
	}		

	let paramsString = document.location.search;
	let searchParams = new URLSearchParams(paramsString);	
	let flat = searchParams.get("flat");
	if(flat) { flat = '?flat=' + flat; }
	else { flat = ''; }
	
	let qr = '';
	if(flat) { qr = '&QR='; }
	else { qr = '?QR='; }
	
	let url = document.location.href.replace(document.location.search, '');
	
	window.history.pushState('', '', url + flat + qr + str);
	
	updateQR({qr: str});
}


function updateQR(params)
{
	if(!Build.infProg.elem.qrId) return;
	
	let qr = params.qr;
	
	let arr = qr.split('');
	
	arr = arr.map(o => o.toUpperCase());
	
	let newQr = arr.join('');	
	
	Build.infProg.elem.qrId.innerText = newQr;	
}




