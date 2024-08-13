import svg_help_info_pc_1 from '../images/svg/help_info_pc_1.svg';
import svg_help_info_pc_2 from '../images/svg/help_info_pc_2.svg';
import svg_help_info_pc_3 from '../images/svg/help_info_pc_3.svg';


import * as Build from '../walker.js';
import * as LSVG from './list_svg.js';
import * as LOADER from './loader.js';
import * as QRK from '../qr.js';



export function initMainUI(params) {
    let html = createHtmlEl(params);
    assignEventEl({ html: html });
}


function listLanguage() {
    let lang = {
        help: {
            en: {
                str1: 'Смотрите по сторонам<br>зажимая левую кнопку мыши',
                str2: 'Кликайте на пол<br>для перемещения',
                str3: 'Или используйте<br>стрелки клавиатуры',
            },
            ru: {
                str1: 'Смотрите по сторонам<br>зажимая левую кнопку мыши',
                str2: 'Кликайте на пол<br>для перемещения',
                str3: 'Или используйте<br>стрелки клавиатуры',
            }
        }
    }

    return lang;
}



function createHtmlEl(params) {
    let lang = listLanguage();

    let html = ``;

    html += LOADER.getHtml();

    html +=
        `<div nameId="containerUI" style="display: -webkit-box; display: flex; position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
		
		<div style="display: flex; position: absolute; top: 20px; left: 0; right: 0; height: 0; user-select: none;">
			<div style="display: flex; margin: 0 auto;">							
				
				<div nameId="butt_camera_2D" style="display: none; padding:0 2px;">
					<div class="button1 button_gradient_1" style="width: 39px; padding: 10px;"> 
						2D
					</div>	
				</div>		
				
				<div nameId="butt_camera_3D" style="display: none; padding:0 2px;">
					<div class="button1 button_gradient_1" style="width: 39px; padding: 10px;"> 
						3D
					</div>	
				</div>							
				
			</div> 
		</div>
		
		<div nameId="butt_camera_First" class="button_back_first" style="display: none;"> 											
			<svg width="15" height="18" viewBox="0 0 15 18" fill="#2F2F2F" xmlns="http://www.w3.org/2000/svg">
				<g>
					${LSVG.getSvg({type: 'button_back_first'})}
				</g>
			</svg>
		</div>


		<div class="logo_wrap">
			<a href="https://b2b.planoplan.com" class="logo_a" target="_blank">
				<div>
					<svg width="45" height="44" viewBox="0 0 45 44" fill="#E5EAF1">
						<g>
							${LSVG.getSvg({type: 'icon_planoplan'})}
						</g>
					</svg>
				</div>
				
				<div style="margin-left: 12px;">
					<svg width="162" height="34" viewBox="0 0 162 34" fill="#0057FF">
						<g>
							${LSVG.getSvg({type: 'txt_planoplan'})}
						</g>
					</svg>
				</div>
			</a>
		</div>


		<div nameId="button_qr" class="button_qr">
			<div class="button_qr_txt">
				Сохранить<br>Загрузить
			</div>
		</div>
		
		<div nameId="button_help" class="button_help">
			<svg width="10" height="16" viewBox="0 0 10 16" fill="#2F2F2F" xmlns="http://www.w3.org/2000/svg">
				<g>
					${LSVG.getSvg({type: 'button_help'})}
				</g>
			</svg>
		</div>		


		<div nameId="help_wrap" class="help_wrap" style="display: none;">
		
			<div nameId="help_info_pc" class="help_info_pc">
				<div class="help_info_pc_bl_1">
					<img src="${svg_help_info_pc_1}" style="width: 52px; height: 34px; margin-right: 10px;">
					<div>${lang.help[Build.infProg.doc.language].str1}</div>
				</div>		
			
				<div class="help_info_pc_bl_2">
					<img src="${svg_help_info_pc_2}" style="width: 34px; height: 34px; margin-right: 10px;">
					<div>${lang.help[Build.infProg.doc.language].str2}</div>
				</div>	
				
				<div class="help_info_pc_bl_3">
					<img src="${svg_help_info_pc_3}" style="width: 48px; height: 32px; margin-right: 10px;">
					<div>${lang.help[Build.infProg.doc.language].str3}</div>
				</div>				
			</div>
		
		</div>
		
		
		<div nameId="qr_wrap" class="qr_wrap" style="display: none;">
			
			<div nameId="qr_info" class="qr_info">
			
				<div nameId="qr_info_copy_qr" class="qr_info_copy_mess" style="display: none;"> 
					<div>
						Код скопирован
					</div>			
				</div>

				<div nameId="qr_info_copy_url" class="qr_info_copy_mess" style="display: none;"> 
					<div>
						Ссылка скопирована
					</div>			
				</div>				
			
				<div nameId="qr_save">
					<div class="qr_save_txt">
						Сохраните этот код, чтобы вернуться к конфигурации  в дальнейшем:
					</div>
					<div class="qr_input">
						<div nameId="qrId">DADBCD</div>
					</div>

					<div class="qr_block_svg_icon">
						<div nameId="bt_copy_qr" class="qr_item_svg_icon">
							${LSVG.getSvg({type: 'button_copy_qr_input'})}
						</div>
						<div nameId="bt_copy_url" class="qr_item_svg_icon">
							${LSVG.getSvg({type: 'button_copy_qr_url'})}
						</div>
					</div>
					
					<div nameId="button_qr_toggle_save" class="button_qr_toggle">
						<div>Загрузить код</div>
					</div>					
				</div>	

				<div nameId="qr_load" style="display: none;">
					<div class="qr_load_txt">
						Введите код конфигурации сохраненный ранее:
					</div>
					<div class="qr_input">
						<input nameId="qr_load_input" value="" placeholder="КОД">
					</div>

					<div nameId="button_qr_toggle_load" class="qr_back_to_save">
						<div class="qr_back_to_save_txt">Назад</div>					
					</div>
					
					<div nameId="act_qr" class="button_qr_toggle">
						<div>Применить код</div>
					</div>					
				</div>				
			</div>
		
		</div>		
		
						
		<div nameId="containerScene" style="width: 100%; touch-action: none;"></div>		
	</div>`;

    let elem = document.createElement('div');
    elem.innerHTML = html;
    //let elem = div1.firstChild;	
    elem.style.position = 'absolute';
    elem.style.width = '100%';
    elem.style.height = '100%';
    elem.style.overflow = 'hidden';
    elem.style.margin = 0;

    if (params.width && params.height) {
        elem.style.width = params.width;
        elem.style.height = params.height;
    } else {
        document.body.style.margin = 0;
    }

    document.body.appendChild(elem);

    return elem;
}



function assignEventEl(params) {
    let html = params.html;

    let el_bh = html.querySelector('[nameId="button_help"]');
    let el_wrap = html.querySelector('[nameId="help_wrap"]');
    let el_hipc = html.querySelector('[nameId="help_info_pc"]');

    el_bh.onmousedown = (event) => {
        el_wrap.style.display = '';

        el_wrap.onmousedown = (event) => {
            if (!el_hipc.contains(event.target)) {
                el_wrap.style.display = 'none';
            }
        }
    }

    let el_butt_qr = html.querySelector('[nameId="button_qr"]');
    let el_qr_wrap = html.querySelector('[nameId="qr_wrap"]');
    let el_qr_info = html.querySelector('[nameId="qr_info"]');

    el_butt_qr.onmousedown = (event) => {
        el_qr_wrap.style.display = '';

        el_qr_wrap.onmousedown = (event) => {
            if (!el_qr_info.contains(event.target)) {
                el_qr_wrap.style.display = 'none';
            }
        }
    }


    let el_qr_save = html.querySelector('[nameId="qr_save"]');
    let el_qr_load = html.querySelector('[nameId="qr_load"]');
    let el_qr_bt_save = html.querySelector('[nameId="button_qr_toggle_save"]');
    let el_qr_bt_load = html.querySelector('[nameId="button_qr_toggle_load"]');

    el_qr_bt_save.onmousedown = (event) => {
        el_qr_save.style.display = 'none';
        el_qr_load.style.display = '';
    }

    el_qr_bt_load.onmousedown = (event) => {
        el_qr_load.style.display = 'none';
        el_qr_save.style.display = '';
    }

    Build.infProg.elem.qrId = html.querySelector('[nameId="qrId"]');

    QRK.assignEvenCopyQR({ html: html });
    QRK.assignEvenCopyUrl({ html: html });
    QRK.assignEvenActiveQR({ html: html });
}