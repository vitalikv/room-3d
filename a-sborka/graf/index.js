

let infProg = {};
infProg.el = {};
infProg.el.canvas = null;


function init()
{
	let width = 500;
	let height = 300;
	let cs_width = width * 2;
	let cs_height = height * 2;
	let padding = 30;
	
	let canvas = document.querySelector('[nameId="canvas"]'); 
	canvas.width = cs_width;
	canvas.height = cs_height;
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';	
	infProg.el.canvas = canvas;

	let ctx = canvas.getContext('2d');
	
	console.log(canvas);
	
	//------------
	let rows = 6;
	let step = Math.floor(cs_height + (padding * 2)) / rows;

	ctx.beginPath(); 
	ctx.lineWidth = '2';
	ctx.strokeStyle = '#ccc';
	ctx.font = '26px Arial, Helvetica, sans-serif';
	ctx.fillStyle = '#ccc';
	
	for(let i = 0; i < rows; i++)
	{
		let y = i * step; 
		
		ctx.fillText("" + y, 10, (cs_height - y) - 10 - padding);
		
		ctx.moveTo(0, cs_height - y - padding);
		ctx.lineTo(cs_width, cs_height - y - padding);
	}
	
	ctx.stroke();
	ctx.closePath();
	
	//--------
	
	
	ctx.beginPath(); 
	ctx.lineWidth = '5';
	ctx.strokeStyle = '#ff0000';
	
	let arr = [];
	arr[arr.length] = {x: 0, y: 0};
	arr[arr.length] = {x: 50, y: 50};
	arr[arr.length] = {x: 100, y: 300};
	arr[arr.length] = {x: 150, y: 100};
	
	for(let i = 0; i < arr.length; i++)
	{
		ctx.lineTo(arr[i].x, cs_height - arr[i].y - padding);
	}
	
	ctx.stroke();
	ctx.closePath();
}




document.addEventListener("DOMContentLoaded", init);


