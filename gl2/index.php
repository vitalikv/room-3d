<? require_once("include/bd.php");  ?>
<?php $vrs = '='.time() ?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?=$title?></title>
	<meta name="description" content="<?=$description?>" />
	<link rel="stylesheet" href="<?=$path?>css/style.css?<?=$vrs?>"> 
</head>

<body>
	<script>
		var vr = "<?=$vrs ?>";
		
		var infProject = JSON.parse('<?=$jsonPhp?>');

		console.log('version '+ vr);		
	</script>
	
			
	
    <script src="<?=$path?>js/three.min.js?<?=$vrs?>"></script>
    <script src="<?=$path?>js/jquery.js"></script>
    <script src="<?=$path?>js/ThreeCSG.js"></script>       
  
	
	<script src="<?=$path?>js/dp/EffectComposer.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/CopyShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/RenderPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/ShaderPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/OutlinePass.js?<?=$vrs?>"></script>
	

	
	<div class="frame" nameId="frameG">
			
		<div class="flex_1 top_panel_1 button_gradient_1" data-action ='top_panel_1' style="display: none;">
			<div class="go_home align_items" nameId="butt_main_menu">
				<div class="go_home_txt">
					Меню
				</div>
			</div>
			<div class="title_1"><h1><?=$h1?></h1></div>			
		</div>	
		
		<noindex>
		
		<div class="flex_1 height100">
			
			<div nameId="msDiv_1" style="display: none; position: absolute; left: 50%; top: 50%; border:solid 1px #b3b3b3; background: #fff; padding: 5px 10px; font-family: arial,sans-serif; font-size: 15px; color: #666;">
				
			</div>
			<div nameId="mainDiv_1" style="flex-grow:1; position: relative;">
				<? require_once("include/top_1.php"); ?>			
				
						
				
				<? require_once("include/modal_window_3.php"); ?>													
				
			</div>
			
			
			<? require_once("include/right_panel_1.php"); ?>
			
		</div>
		
		</noindex>
		
	</div>
	
	
	<script src="<?=$path?>test.js?<?=$vrs?>"></script> 
	


</body>


</html>