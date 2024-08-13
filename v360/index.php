<?php $vrs = '=5' ?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?=$title?></title>

	<link rel="stylesheet" href="<?=$path?>css/style.css?<?=$vrs?>"> 
</head>

<body>
	
	<div id="container"></div>
	
	<div class="logo" logo="">
		<div class="load_txt">Загрузка</div>
		<!--<div class="load_process" load_process=''>0 %</div>-->
		<img src="img/52_1.jpg">
	</div>


	
    <script src="<?=$path?>js/three.min.js?<?=$vrs?>"></script>
    <script src="<?=$path?>js/jquery.js"></script>
	<script src="<?=$path?>js/OBJLoader.js?<?=$vrs?>"></script>

	<script src="<?=$path?>panorama360/panorama360.js?<?=$vrs?>"></script>
    <script src="<?=$path?>script.js?<?=$vrs?>"></script>    	
	
	
	<div class="help_1" style="z-index: 1;">
		<div class="button3">
			<div data-action='fullscreen' class="button1"><img src="img/fullscreen_1.png"></div>
		</div>
	</div>	
		
</body>



</html>