


settingListUsers();
activeElemProject_1();


function activeElemProject_1()
{
	let el_1 = document.querySelector('[nameId="butCountProject"]');	
	el_1.onmousedown = function(e){ settingListUsers(); e.stopPropagation(); }
	
	let el_2 = document.querySelector('[nameId="currentPage"]');
	el_2.onchange = function(e){ settingListUsers({ currentPage: el_2.value.trim() }); e.stopPropagation(); }
}


// собираем настройки для вывода списка
function settingListUsers(cdm)
{
	if(!cdm) cdm = {};
	
	let el_int = document.querySelector('[nameId="intCountProject"]');
	let el_list = document.querySelector('[nameId="typeCountProject"]');
	
	let ind = el_list.selectedIndex;
	let type = el_list[ind].value;
	
	let count = el_int.value.trim();
	if(!isNumeric(count)) { console.log('err WHERE', count); return; }
	
	let query1 = 'WHERE date_up'+' '+type+' '+ (Math.floor(new Date().getTime() / 1000) - (count * 86400));
	
	//-------------
	
	let el_sort_1 = document.querySelector('[nameId="sortTable_1"]');
	let el_sort_2 = document.querySelector('[nameId="sortTable_2"]');
	
	let s1 = el_sort_1[el_sort_1.selectedIndex].value.trim();
	let s2 = el_sort_2[el_sort_2.selectedIndex].value.trim();
	
	let query2 = 'ORDER BY '+s1+' '+s2;

	//-------------
	
	let currentPage = 1;
	if(cdm.currentPage) { currentPage = cdm.currentPage; }
	//else { currentPage = document.querySelector('[nameId="currentPage"]').value.trim(); }
	document.querySelector('[nameId="currentPage"]').value = currentPage;
	
	let el_limitItem = document.querySelector('[nameId="intLimitItem"]');
	let limitItem = el_limitItem.value.trim();
	
	if(!isNumeric(currentPage)) { console.log('err currentPage', currentPage); return; }
	if(!isNumeric(limitItem)) { console.log('err limitItem', limitItem); return; }
	
	var limitStart = currentPage * limitItem - limitItem;
	
	let query3 = 'LIMIT '+limitStart+', '+limitItem;
	
	//-------------
	
	console.log(query1, query2, query3);
	
	renderListProject({where: query1, order: query2, limit: query3});
}


// выводим список 
async function renderListProject(cdm) 
{
	
	var url = 'bd/getProject.php';
	var table = 'project';		

	var query = 'table='+table+'&select_list=id, user_id, name, date_up';
	
	if(cdm.where) { query += '&where='+cdm.where; }
	if(cdm.order) { query += '&order='+cdm.order; }	
	if(cdm.limit) { query += '&limit='+cdm.limit; }	
	
	var response = await fetch(url, 
	{
		method: 'POST',
		body: query,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },				
	});
	var json = await response.json();		
	console.log(json);
	var listItem = json.list;

	// показываем список
	var container_1 = document.body.querySelector('[nameId="projectList"]');
	container_1.innerHTML = '';	
	
	for(var i = 0; i < listItem.length; i++)
	{
		var j = listItem[i];		
		
		var html = 
		'<div style="display: flex; margin: 10px;">\
			<div style="width: 40px; margin: 0 5px;">'+j.id+'</div>\
			<div style="width: 100px; margin: 0 5px;">'+j.user_id+'</div>\
			<div style="width: 250px; margin: 0 5px;">'+j.name+'</div>\
			<div style="width: 200px; margin: 0 5px;">'+j.date_up+'</div>\
		</div>';
		
		var div = document.createElement('div');
		div.innerHTML = html;
		var elem = div.firstChild;		
			
		container_1.append(elem);
	}	



	// постраничная навигация
	var container_2 = document.body.querySelector('[nameId="listPage"]');
	container_2.innerHTML = '';
	
	if(json.pageCount)
	{
		if(json.pageCount > 1)
		{
			var currentPage = document.querySelector('[nameId="currentPage"]').value.trim();
			
			for(var i = 0; i < json.pageCount; i++)
			{	
				var bg = (i == currentPage - 1) ? '#557997' : '#269CFF';
				
				var html = 
				'<div style="display: flex; width: 40px; height: 40px; margin: 0 5px; align-items: center; background: '+bg+'; border-radius: 4px; cursor: pointer;">\
					<div style="margin: auto; font-size: 12px; text-align: center; color: #fff;">\
						'+(i+1)+'\
					</div>\
				</div>';

				var div = document.createElement('div');
				div.innerHTML = html;
				var elem = div.firstChild;
				
				
				(function(i) 
				{					
					
					elem.onmousedown = function(e)
					{ 
						settingListUsers({currentPage: i+1});
						e.stopPropagation(); 
					};	
					
				}(i));

				container_2.append(elem);
			}
			
		}
	}	
	
}




function isNumeric(n) 
{   
   return !isNaN(parseFloat(n)) && isFinite(n);   
   // Метод isNaN пытается преобразовать переданный параметр в число. 
   // Если параметр не может быть преобразован, возвращает true, иначе возвращает false.
   // isNaN("12") // false 
}






