


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
	if(!isNumeric(count)) { console.log('err HAVING COUNT', count); return; }
	
	let query1 = 'HAVING COUNT(p.user_id)'+' '+type+' '+count;
	
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
	
	renderListUsers({having: query1, order: query2, limit: query3});
}


// выводим список 
async function renderListUsers(cdm) 
{
	if(!cdm) { cdm = {}; }
	
	var url = 'bd/getUsers.php';
	var table = 'user';				
	
	var query = 'table='+table+'&select_list=id, mail, pass, date';
	
	if(cdm.having) { query += '&having='+cdm.having; }
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
	var container_1 = document.body.querySelector('[nameId="userList"]');
	container_1.innerHTML = '';
	
	
	for(var i = 0; i < listItem.length; i++)
	{
		var j = listItem[i];		
		
		var html = 
		'<div style="display: flex; margin: 10px;">\
			<div style="width: 40px; margin: 0 5px;">'+j.id+'</div>\
			<div style="width: 200px; margin: 0 5px;">'+j.mail+'</div>\
			<div style="width: 100px; margin: 0 5px;">'+j.pass+'</div>\
			<div style="width: 200px; margin: 0 5px;">'+j.date+'</div>\
			<div style="width: 100px; margin: 0 5px;">'+j.count_project+'</div>\
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
	
	
	// находим дочерние объекты 
	function getItemChilds(cdm)
	{
		var json = cdm.json;
		
		if(json.id != 'group') 	// это объект, а не группа
		{
			var str_button = 
			'<div nameId="sh_select_obj3D" style="margin-right: 5px; margin-left: auto; width: 20px; height: 20px;">\
				<img src="'+infProject.path+'/img/look.png" style="display: block; height: 95%; margin: auto; -o-object-fit: contain; object-fit: contain;">\
			</div>';
			
			var html = 
			'<div>\
				<div class="right_panel_1_1_list_item">\
					<div class="flex_1 relative_1">\
						<div class="right_panel_1_1_list_item_text">'+json.name+'</div>\
						'+str_button+'\
					</div>\
				</div>\
			</div>';			
			
			var div = document.createElement('div');
			div.innerHTML = html;
			var elem = div.firstChild;
			
			json.elem = elem;

			// при клике добавляем объект в сцену
			var n = json.id;
			(function(n) 
			{
				elem.onmousedown = function(e){ clickInterface({button: 'add_lotid', value: n}); e.stopPropagation(); };	
			}(n));

			// назначаем событие при клике на лупу UI
			var elem_2 = elem.querySelector('[nameId="sh_select_obj3D"]');
			(function(n) 
			{
				elem_2.onmousedown = function(e)
				{ 
					activeCameraView({lotid: n});
					e.stopPropagation();
				};	
			}(n));			
		}
		else
		{
			var groupItem = '';

			var str_button = 
			'<div nameId="shCp_1" style="margin-left: 5px; width: 10px; height: 20px;">\
				<div>\
					<svg height="100%" width="100%" viewBox="0 0 100 100">\
						<polygon points="0,0 100,0 50,100" style="fill:#ffffff;stroke:#000000;stroke-width:4" />\
					</svg>\
				</div>\
			</div>';				
			
			var valueId = '';
			
			if(json.valueId == 'sborka_rad_1') { valueId = 'valueId="sborka_rad_1"'; }
			
			var html = 
			'<div class="right_panel_1_1_list_item" style="top:0px; left:0px;">\
				<div class="flex_1 relative_1" style="margin: auto;">\
					'+str_button+'\
					<div class="right_panel_1_1_list_item_text" nameid="nameItem">'+json.name+'</div>\
				</div>\
				<div nameId="groupItem" '+valueId+' style="display: none;">\
					'+groupItem+'\
				</div>\
			</div>';
			
			var div = document.createElement('div');
			div.innerHTML = html;
			var elem = div.firstChild;
			
			json.elem = elem; 
			
			// назначаем кнопки треугольник событие
			var el_2 = elem.querySelector('[nameId="shCp_1"]');
			var el_3 = elem.querySelector('[nameId="groupItem"]');
			var num = 0;
			(function(num) 
			{
				el_2.onmousedown = function(e){ clickRtekUI_2({elem: this, elem_2: el_3}); e.stopPropagation(); };	
			}(num));			
			
			var container = json.elem.querySelector('[nameid="groupItem"]');
			
			for ( var i = 0; i < json.child.length; i++ )
			{
				json.child[i] = getItemChilds({json: json.child[i]});
				
				container.append(json.child[i].elem);
			}			
		}
		
		return json;
	}	
}




// определяем число ли это или нет
function isNumeric(n) 
{   
   return !isNaN(parseFloat(n)) && isFinite(n);   
   // Метод isNaN пытается преобразовать переданный параметр в число. 
   // Если параметр не может быть преобразован, возвращает true, иначе возвращает false.
   // isNaN("12") // false 
}













