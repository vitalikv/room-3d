




<div class="flex_1 top_panel_2">	
	
	<div class="toolbar" data-action ='top_panel_1'>

		<div class="button1-wrap-1">
			<div nameId='screenshot' class="button1 button_gradient_1"><img src="<?=$path?>/img/screenshot.png"></div>
		</div>	

		
		<? if($_SERVER['SERVER_NAME']=='3d-stroyka' && $interface['rtc']) {?>
		<div class="button1-wrap-1" nameId='butt_main_load_obj'>
			<div class="button1 button_gradient_1"> 
				<img src="<?=$path?>/img/download_1.png">
			</div>	
		</div>			
		<? } ?>
		
	</div> 
	
	<div class="tp_right_1" data-action ='top_panel_1'>
	
		<div class="button1-wrap-1" nameId='butt_camera_2D' style="display: none;">
			<div class="button1 button_gradient_1" style="width: 39px;"> 
				2D
			</div>	
		</div>		
		<div class="button1-wrap-1" nameId='butt_camera_3D' style="display: none;">
			<div class="button1 button_gradient_1" style="width: 39px;"> 
				3D
			</div>	
		</div>	
		<div class="button1-wrap-1" nameId='butt_close_cameraView' style="display: none;">
			<div class="button1 button_gradient_1" style="width: 39px;">
				<div style="transform: rotate(-45deg); font-family: arial,sans-serif; font-size: 40px; text-align: center; text-decoration: none; line-height: 0.5em; color: #666; cursor: pointer;">
					+
				</div>
			</div>	
		</div>
		
	</div>		
	
</div>


<div style="position: absolute; width: 100%; bottom: 110px; z-index: 2;" nameId="menu_loader_slider_UI">		
	
	<div style="width: 260px; height: 60px; margin: auto; padding-bottom: 30px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);">
	
		<div style="padding: 15px 0 0 0; font-size: 18px; text-align: center; color: #666;">
			Загрузка объектов
		</div>
		
		<div style="padding: 15px 0; font-size: 16px; text-align: center; color: #666;" nameId="txt_loader_slider_UI">
			0%
		</div>
		
	</div>
	
</div>


