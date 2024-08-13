

<style type="text/css">

.button_catalog_close
{
	position: absolute;
	width: 30px;	
	height: 30px;
	top: 10px;
	right: 10px;
		
	-webkit-transform: rotate(-45deg);
	-moz-transform: rotate(-45deg);
	-o-transform: rotate(-45deg);
	-ms-transform: rotate(-45deg);
	transform: rotate(-45deg);
	
	font-family: arial,sans-serif;
	font-size: 50px;
	text-align: center;
	text-decoration: none;
	line-height: 0.6em;
	color: #666;
	cursor: pointer;	
}


.button_show_panel_catalog
{
	position: fixed;
	right: 0;
	top: 50%;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
	list-style: none;
	margin-left: 0;
	padding-left: 0;		
	

	width: 30px;	
	height: 180px;	
	border: 1px solid #b3b3b3; 
	border-radius: 3px;
	background-color:#f1f1f1;		
   
	-webkit-box-shadow:0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; 
	-moz-box-shadow: 0px 0px 2px #bababa,  inset 0px 0px 1px #ffffff;  
	box-shadow:0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; 	
	
	cursor: pointer;
}

.button_show_panel_catalog_1
{
	margin: auto;
	margin-top: 70px;
	width: 0;
	height: 0;
	border: 0 solid transparent;
	border-top-width: 20px;
	border-bottom-width: 20px;
	border-right: 10px solid #696464;
}


.block_rp_1
{
	width: 200px;
	height: 40px;
}

.block_rp_text
{
	margin-left: 5px;
	font-family: arial,sans-serif;
	font-size: 14px;
	color: #666;
	text-decoration: none;

	outline: none;
}



<!--   ------------>


	.substrate
	{
		z-index: 100;
		
		position:fixed; 
		left:0; 
		top:70px;
		width: 200px; 
		height: auto; 
		background-color:#ffffff;
		border:1px solid #e6e4e4;		
	}
	

	.input_load_substrate
	{
		opacity: 0;
		visibility: hidden;
		position: absolute;		
	}	

	.prew_substrate 
	{
		width: 200px; 
		min-height: 100px;
		max-height: 150px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;		
	}
	
	.prew_substrate img
	{
		display: block;	
		width: 200px;
		min-height: 100px;
		max-height: 150px;		
		margin: auto; 
		-o-object-fit: contain;
		object-fit: contain;			
	}

	.substrate input
	{
		display: block;
		margin: 10px auto;
		width: 90%;
			
		font-size: 18px;
		text-align: center;
		color: #666;
		
		text-decoration: none;
		line-height: 2em;
		padding: 0;
		
		border: 1px solid #ccc;
		border-radius: 3px;
		background-color:#fff;	
	}
	
	.substrate .flex_1 input
	{
		width: 100px;
	}	
	
	.substrate .block_1
	{
		margin: 10px auto;
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
	}
	
	.pr_plane_text_1
	{
		width: 100%;
		padding-top: 10px;
		border-top: 1px solid #b3b3b3;
		font-family: arial,sans-serif;
		font-size: 15px;
		text-align: center;
		color: #666;	
	}
</style>





<div class="right_panel_1" data-action ='right_panel_1' style="display: flex; z-index: 1;">

	<div nameId="right_panel_resize_1" style="height: 100%; width: 3px; background: #909090; cursor: w-resize;">
	</div>

	<div class="flex_column_1 right_panel_1_1" nameId="dv_right_panel_1">
		<div class="flex_1 bottom_line_1">
			<div class="flex_1 relative_1 right_panel_1_item">
				<div class="right_panel_1_item_block" nameId="button_wrap_plan">
					<div class="right_panel_1_item_block_text">
						план
					</div>	
				</div>			
				<div class="right_panel_1_item_block" nameId="button_wrap_object">
					<div class="right_panel_1_item_block_text">
						объект
					</div>	
				</div>			
				<div class="right_panel_1_item_block" nameId="button_wrap_catalog">
					<div class="right_panel_1_item_block_text">
						каталог
					</div>	
				</div>
				<div class="right_panel_1_item_block" nameId="button_wrap_list_obj">
					<div class="right_panel_1_item_block_text">
						список
					</div>	
				</div>			
			</div>
			<div class="button_catalog_close" nameId="button_catalog_close">
				+
			</div>
		</div>
	
	
		<div class="flex_column_1" nameId="wrap_plan" style="display: none;">
			<div class="right_panel_1_1_h">План</div>
			
				<div class="right_panel_1_1_list rp_height_250px" nameId="rp_plane_1">
					<div nameId="rp_plane_2">
					</div>
					<div nameId="rp_plane_3">
					</div>					
				</div>
				
				<div nameId="block_substrate_wrap" style="display: none;">  


					<div nameId="block_substrate_1" style="display: none;">
					
						<div class="rp_obj_name" style="margin:20px auto;">
							<input type="text" nameId="rp_floor_name" value="Название">	 				
						</div>
							

						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									высота
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" nameId="rp_height_plane" style="width: 90%; margin:5px 5px;" value=0>
							</div>
						</div>				
						
						<div style="margin-top: 20px;">				
							<div class="button1 button_gradient_1" nameId="button_delete_plane">
								удалить этаж	
							</div>					
						</div>					
					
					
					</div>
					
					<div nameId="block_substrate_2" style="display: none;">

						<div class="substrate" nameId="substrate" style="display: block;">

							<input name="file" type="file" accept="image/x-png,image/jpeg" id="load_substrate_1" class="input_load_substrate">
							<label for="load_substrate_1" class="button1 button_gradient_1" nameId="load_img_1">		
								загрузить план
							</label>

							<div class="prew_substrate" style="margin: auto;">
								<img src="" nameId="rp_floor_img" alt=""/>
							</div>
							
							<div>
								<div class="pr_plane_text_1">
									прозрачность
								</div>	
								<input type="range" nameId="input_transparency_substrate" min="1" max="100" value="100">
							</div>	
							
							<div class="block_1" style="display: none;">
								<div class="pr_plane_text_1">
									вращение
								</div>
								
								<div class="flex_1">
									<input type="text" nameId="input_rotate_substrate" value=0>
									<div class="button1 button_gradient_1" nameId="input_rotate_substrate_45">
										45
									</div>

									<div class="button1 button_gradient_1" nameId="input_rotate_substrate_90">
										90
									</div>	
								</div>
							</div>	
							
							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										реальная длина
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" nameId="input_size_substrate" style="width: 90%; margin:5px 5px;" value=1>
								</div>
							</div>
							
							<div class="button1 button_gradient_1" nameId="assign_size_substrate">
								применить
							</div>			
											
						</div>			

					</div>
					
				
				</div>
				

		</div>
		
		
		<div nameId="wrap_object">
			<div class="flex_column_1" nameId="wrap_sborka_1">

				<div nameId="list_sborka_1" style="position: relative;"></div>								
				
			</div>
			
			<div class="flex_column_1" nameId="wrap_object_1" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Объект</div>
				
				
				<div class="rp_obj">  
				
					<div class="rp_obj_name">
						<input type="text" nameId="rp_obj_name" value="Название">					
					</div>
							

					<div class="flex_1 bottom_line_1">
						<div class="flex_1 relative_1">			
							<div class="right_panel_1_item_2_block" nameId="button_obj_tool_pivot">
								<div class="right_panel_1_item_block_text">
									позиционирование
								</div>	
							</div>
							<div class="right_panel_1_item_2_block" nameId="button_obj_properties">
								<div class="right_panel_1_item_block_text">
									параметры
								</div>	
							</div>							
						</div>
					</div>



					<div nameId="rp_bl_obj_tool_pivot">
					
						<div class="flex_1 w_1">
							<?if(1==2){?>
							<select name="fruit">
							<option value ="none">Глобально</option>
							<option value ="guava">Локально</option>
							</select>
							<?}?>							
						</div>

						<div class="button1 button_gradient_1" nameId="select_pivot" style="margin: 30px 0 10px 0;">
							перемещение 
						</div>	
						
						<div class="flex_1 input_rotate">
							<input type="text" nameId="object_pos_X" value="0">
							<input type="text" nameId="object_pos_Y" value="0">
							<input type="text" nameId="object_pos_Z" value="0">
						</div>	

						
						<div nameId="block_gizmo">
							<div class="button1 button_gradient_1" nameId="select_gizmo" style="margin: 40px 0 10px 0;">
								вращение	
							</div>	

							<div class="flex_1 input_rotate">
								<input type="text" nameId="object_rotate_X" value="0">
								<input type="text" nameId="object_rotate_Y" value="0">
								<input type="text" nameId="object_rotate_Z" value="0">
							</div>	

							<div class="flex_1" style="margin: 0px 0 20px 0;">
								<div style="width: 100%; height: 2px; background: rgb(247, 72, 72);"></div>
								<div style="width: 100%; height: 2px; background: rgb(17, 255, 0);"></div>
								<div style="width: 100%; height: 2px; background: rgb(72, 116, 247);"></div>
							</div>
							
							<div class="flex_1" style="margin: 0px 0 20px 0;">
								<div class="button1 button_gradient_1" nameId="obj_rotate_X_90m">-90</div>
								<div class="button1 button_gradient_1" nameId="obj_rotate_X_90">90</div>
								
								<div class="button1 button_gradient_1" nameId="obj_rotate_Y_90m">-90</div>
								<div class="button1 button_gradient_1" nameId="obj_rotate_Y_90">90</div>
								
								<div class="button1 button_gradient_1" nameId="obj_rotate_Z_90m">-90</div>
								<div class="button1 button_gradient_1" nameId="obj_rotate_Z_90">90</div>
							</div>						
						
							<div class="button1 button_gradient_1" nameId="obj_rotate_reset">
								сбросить	
							</div>											
						</div>
						
					
					</div>
					
					
					<div nameId="rp_bl_obj_properties">	
					
						<div nameId="rp_wrap_obj_align" style="display: none;">
						
							<div class="button1 button_gradient_1" nameId="button_deactive_join_element" style="border-color: #ff0000">
								закрыть	
							</div>
						
							<div class="right_panel_1_1_list" nameId="rp_obj_align">
								
							</div>	
							<div class="button1 button_gradient_1" nameId="join_element">
								подключить	
							</div>
							
						</div>
						
						
						<div nameId="rp_wrap_add_group" style="display: none;">
							<div class="button1 button_gradient_1" nameId="button_deactive_add_group" style="border-color: #ff0000">
								закрыть	
							</div>							
							<div class="right_panel_1_1_list" nameId="rp_add_group">
								
							</div>
							<div class="button1 button_gradient_1" nameId="button_add_group">
								сгруппировать	
							</div>	
						</div>



						<div nameId="bl_object_3d" style="display: none;">
							
							<div nameId="bl_rp_obj_group"> 
							
								<div class="flex_1" style="display: none;">
									<div class="flex_1 align_items block_rp_1">
										<div class="checkbox_1" nameId="box_input_group">
											<div class="checkbox_1_checked" nameId="box_input_checked_group"></div>						
										</div>
										<div class="block_rp_text">Группа</div>						
									</div>															
								</div>
								
								<div class="right_panel_1_1_list" nameId="rp_obj_group">
									
								</div>

								<div nameId="pr_list_button_for_obj" style="display: none;">
									
									<div class="flex_1">
										<div class="button1 button_gradient_1" nameId="button_active_add_group" style="width: 100%;">
											сгруппировать	
										</div>
										<div class="button1 button_gradient_1" nameId="button_detach_obj_group" style="width: 100%;">
											отделить	
										</div>															
									</div>
									
									<div class="flex_1">
										<div class="button1 button_gradient_1" nameId="button_copy_obj" style="width: 100%;">
											копировать	
										</div>
										<div class="button1 button_gradient_1" nameId="button_delete_obj" style="width: 100%;">
											удалить	
										</div>								
									</div>
			
									<div nameId="sp_block_drt">

									</div>		
								</div>								
							
							</div>
							
							<div nameId="pr_list_button_center_point" style="display: none;"> 
								<div class="button1 button_gradient_1" nameId="button_active_join_element">
									подключить
								</div>		 										
							</div>	

							<div nameId="pr_list_button_for_tube_point1" style="margin: 10px 0; display: none;">								
								<div nameId="button_active_align_wf_point1" class="button1 button_gradient_1">подключить точку</div>			
							</div>
							
							<div nameId="pr_list_button_for_tube_point2" style="margin: 10px 0; display: none;">								
								<div nameId="button_active_align_wf_point2" class="button1 button_gradient_1">подключить трубу</div>			
							</div>															
							
							<div nameId="rp_bl_wf_tube">							
								<div class="flex_1" style="display: none;">
									<div class="flex_1 align_items">
										<div class="rp_label_plane">
											диаметр (мм)
										</div>
									</div>
									<div class="flex_1 align_items" style="width: auto;">
										<input type="text" nameId="size_tube_diameter_2" style="width: 90%; margin:5px 5px;" value=0>
									</div>
								</div>					
												 
				
								<div style="margin: 10px 0;">
									<div nameId="butt_add_point_on_tube" class="button1 button_gradient_1">добавить точку</div>
								</div>						
							</div>					
							
						</div>	
												
					</div>
					
				</div> 
			</div>	
		</div>

		
		<div class="flex_column_1 relative_1 height100" nameId="wrap_list_obj" style="display: none;">
			<div class="right_panel_1_1_h">Список материалов</div>
			
			<div class="right_panel_3_1_list" list_ui="wf">
				
				<?if(1 == 2){?>
				<div class="flex_1 right_panel_1_1_list_item">
					<div class="right_panel_1_1_list_item_color"></div>
					<div class="right_panel_1_1_list_item_text">
						труба 20
					</div>	
					<div class="right_panel_1_1_list_item_text">
						3.2м
					</div>				
				</div>
				<?}?>
				
			</div>
			
			<div class="button1 button_gradient_1" nameId="save_list_obj" style="display: block; position: absolute; left: 0; right: 0; bottom: 80px; margin: auto 10px;">
				сохранить список
			</div>			
		</div>
		
		
		<div class="flex_column_1 relative_1 height100" nameId="wrap_catalog" style="display: none;">
			<div class="right_panel_1_1_h">Каталог</div>
			
			<div class="right_panel_2_1_list" list_ui="catalog">
				
			</div>
			
			<div class="right_panel_2_2_list">
				<div class="flex_1">
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							высота
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" nameId="rp_planeHeight_posY" style="width: 90%; margin:5px 5px;" value=0>
					</div>
					
					<div class="button1 button_gradient_1" nameId="rp_show_hide_planeHeight">
						пок	
					</div>								
				</div>
			</div>			
		</div>
		
	</div>
	
	
	<div class="button_show_panel_catalog" nameId="button_show_panel_catalog" style="display: none;">
		<div class="button_show_panel_catalog_1">		
		</div>	
	</div>
	
</div>



