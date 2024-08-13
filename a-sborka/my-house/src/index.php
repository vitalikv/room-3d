<!DOCTYPE html>
<html lang="en">

<head>
	<title>loader</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<!--<link type="text/css" rel="stylesheet" href="css/style.css">-->
</head>







<body>
		
	<div nameId="loader" style="position: fixed; width: 100%; height: 100%; background: #fff; z-index: 2; display: block;">		
		<div style="position: absolute; top: 0; bottom: 0; left:0; right: 0;">			
			<img nameId="preview" src="img/WebGL_Preloader.jpg" style="display: block; position: relative; top: 50%; width: 100%; transform: translateY(-50%);">			
			<div style="position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); width: auto; padding: 20px; opacity: 0.6; border:solid 1px #b3b3b3; border-radius: 9px; background: #fff;">				
				<div nameId="progress_load" style="font:32px Arial, Helvetica, sans-serif; text-align: center; color: #222;">loading...</div>			
			</div>		
		</div>	
	</div>
		
	<div style="display: -webkit-box; display: flex; position: fixed; width: 100%; height: 100%; top: 0; left: 0; font-family: Arial, Helvetica, sans-serif;">
		
		
		<div nameId="containerScene" style="width: 100%; touch-action: none;"></div>
		
	</div>
		
</body>

<script type="module" src="index.js"></script>

</html>