
<!DOCTYPE html>
<html lang="en">

<head>
	<title>Users</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<!--<link type="text/css" rel="stylesheet" href="main.css">	-->
</head>

<body>
		

	<div style="display: flex; max-width: 1200px; min-width: 400px; margin: 0px auto; font-family: arial,sans-serif; font-size: 14px; color: #666;">	

		<div style="margin-top: 55px; width: 250px; height: 300px; background: #F0F0F0;">
		
			<div nameId="butCountProject" style="display: flex; height: 36px; margin: 12px 10px; align-items: center; background: #269CFF; border-radius: 4px; cursor: pointer;">
				<div style="margin: auto; text-decoration: none; font-size: 12px; text-align: center; color: #fff;">
					count(Project)
				</div>
			</div>
			
			<div style="display: flex; height: 36px; margin: 12px 10px; align-items: center;">

				<input type="text" nameId="intCountProject" value="0" style="width: 70px; height: 24px; font-size: 12px; text-align: center; color: #4A4A4A; border:solid 1px #b3b3b3;">

				<select nameId="typeCountProject" style="width: 100px; height: 28px; margin: 0 0 0 auto; font-size: 12px; color: #4A4A4A; border:solid 1px #b3b3b3;">
					<option value=">" selected="">больше</option>
					<option value=">=" selected="">больше || =</option>
					<option value="=">равно</option>
					<option value="<=">меньше || =</option>
					<option value="<">меньше</option>					
				</select>

			</div>
			
			<div style="display: flex; height: 36px; margin: 12px 10px; align-items: center;">

				<select nameId="sortTable_1" style="width: 76px; height: 28px; margin: 0 auto 0 0; text-align: center; font-size: 12px; color: #4A4A4A; border:solid 1px #b3b3b3;">
					<option value="id" selected="">id</option>
					<option value="count_project">count(Project)</option>
				</select>

				<select nameId="sortTable_2" style="width: 100px; height: 28px; margin: 0 0 0 auto; font-size: 12px; color: #4A4A4A; border:solid 1px #b3b3b3;">
					<option value="ASC" selected="">возрастание</option>
					<option value="DESC">убывание</option>
				</select>

			</div>

			<div style="display: flex; height: 36px; margin: 12px 10px; align-items: center; border:solid 1px #b3b3b3;">

				<div style="margin: auto; text-decoration: none; font-size: 12px; text-align: center; color: #000;">
					LIMIT
				</div>

				<input type="text" nameId="intLimitItem" value="30" style="width: 98px; height: 24px; font-size: 12px; text-align: center; color: #4A4A4A; border:solid 1px #b3b3b3;">

			</div>			
			
		</div>
		
		<div nameId="blockUsers" style="margin-top: 55px;">
			<div style="display: flex; border:solid 1px #b3b3b3;">
				<div style="width: 40px; margin: 0 5px; border-right:solid 1px #b3b3b3;">id</div>
				<div style="width: 200px; margin: 0 5px; border-right:solid 1px #b3b3b3;">mail</div>
				<div style="width: 100px; margin: 0 5px; border-right:solid 1px #b3b3b3;">pass</div>
				<div style="width: 200px; margin: 0 5px; border-right:solid 1px #b3b3b3;">date</div>
				<div style="width: 100px; margin: 0 5px;">count(Project)</div>
			</div>
			
			<div style="border:solid 1px #b3b3b3;" nameId="userList">
			
			</div>
			
			<div style="display: flex; margin: 40px auto;" nameId="listPage">
			
			</div>			

			<input type="text" nameId="currentPage" value="1" style="width: 98px; height: 24px; font-size: 12px; text-align: center; color: #4A4A4A; border:solid 1px #b3b3b3;">			
		</div>	
		
	</div>
	
	

	<script src="tableUsers.js"></script>
	
</body>

	

</html>