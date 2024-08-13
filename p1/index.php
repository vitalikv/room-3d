<? require_once("include/bd.php");  ?>
<?php $vrs = '=51' ?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="shortcut icon" href="/img/favicon.ico" />
	<title><?=$title?></title>
	<meta name="description" content="<?=$description?>" />
	<link rel="stylesheet" href="<?=$path?>css/style.css?<?=$vrs?>"> 
</head>



<body>
	<script>
		var vr = "<?=$vrs ?>";
		
		var infProject = JSON.parse('<?=$jsonPhp?>');

		console.log('type '+ vr);		
	</script>
	
			
	
    <script src="<?=$path?>js/three.min.js"></script>
    <script src="<?=$path?>js/jquery.js"></script>
    <script src="<?=$path?>js/ThreeCSG.js"></script>         
	
	<script src="<?=$path?>js/dp/EffectComposer.js"></script>
	<script src="<?=$path?>js/dp/CopyShader.js"></script>
	<script src="<?=$path?>js/dp/RenderPass.js"></script>
	<script src="<?=$path?>js/dp/ShaderPass.js"></script>
	<script src="<?=$path?>js/dp/OutlinePass.js"></script>
	<script src="<?=$path?>js/dp/FXAAShader.js"></script>
	<script src="<?=$path?>js/dp/SAOPass.js"></script>
	<script src="<?=$path?>js/dp/SAOShader.js"></script>
	<script src="<?=$path?>js/dp/DepthLimitedBlurShader.js"></script>
	<script src="<?=$path?>js/dp/UnpackDepthRGBAShader.js"></script>	
	
	<script src="<?=$path?>js/loader/inflate.min.js"></script>
	<script src="<?=$path?>js/loader/FBXLoader.js"></script>
	<script src="<?=$path?>js/loader/STLExporter.js"></script>
	<script src="<?=$path?>js/loader/GLTFLoader.js"></script>	
	<script src="<?=$path?>js/BufferGeometryUtils.js"></script>
	<script src="<?=$path?>js/export/GLTFExporter.js"></script>
	
	
	<div id="canvasFrame" style="position: fixed; width: 100%; height: 100%; top: 0; right: 0; overflow: hidden; font-family: arial,sans-serif;">
		<div class="frame block_select_text">
				
			<noindex>
			<div class="flex_1 height100">
				
				<div style="flex-grow:1; position: relative;" nameId="wrapP1">
					<div style="position: absolute; width: 100%; bottom: 110px; z-index: 2;" nameId="menu_loader_slider_UI">			
						<div style="width: 260px; height: 60px; margin: auto; padding-bottom: 30px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);">	
							<div style="padding: 15px 0 0 0; font-size: 18px; text-align: center; color: #666;">Загрузка объектов</div>		
							<div style="padding: 15px 0; font-size: 16px; text-align: center; color: #666;" nameId="txt_loader_slider_UI">0%</div>		
						</div>	
					</div>					
				</div>				
				
				<div nameId="wrapP2"></div>

			</div>
			</noindex>
		
		</div>

		<svg id="svgFrame" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" style="position: absolute; z-index: 1">
		</svg>	

		<div id='selectBoxFrame'></div>
		
		<div id='htmlBlock' class="block_select_text"></div>
		
	</div>
	
	<div nameId="wrapDiv" style="display: none; position: fixed; left: 0; top: 0; width: 100%; height: 100%; font-family: arial,sans-serif; background: rgba(0, 0, 0, 0.5);"></div>
	
	
	<style type="text/css">
		#selectBoxFrame
		{
			width: 0;
			height: 0;
			line-height: 0;
			background-color: #707070;
			position: absolute;
			z-index: 100;
			visibility: hidden;
			-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
			filter: alpha(opacity=40);
			opacity: .4;
		}
	</style>	
	

    <script src="<?=$path?>test.js?<?=$vrs?>"></script>    		 
		
		
	



</body>


</html>