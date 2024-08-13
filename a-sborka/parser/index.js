
// парсер изображений с планоплана и сохранения их локально в папке
init();

async function init() 
{


	let response = await fetch('file1.json', { method: 'GET' });
	let json = await response.json();
	
	

	for ( let i = 0; i < json.length; i++ )
	{
		console.log({name: json[i].name, url: json[i].url});
	
		
		let response = await fetch('t/saveLocal.php', 
		{
			method: 'POST',
			body: 'name='+json[i].name+'&url='+json[i].url,
			headers: 
			{	
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
			},				
		});
	}
}