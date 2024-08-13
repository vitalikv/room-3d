import svg_help_info_mobile_1 from '../images/svg/help_info_mobile_1.svg';
import svg_help_info_mobile_2 from '../images/svg/help_info_mobile_2.svg';
import svg_alert from '../images/svg/alert.svg';

import * as Build from '../walker.js';
import * as LSVG from './list_svg.js';
import * as LOADER from './loader.js';
import * as CATMOB from './catalog_mob.js';
import * as QRK from '../qr.js';

export function initMainUI(params) {
  let html = createHtmlEl(params);
  assignEventEl({ html: html });
}

function listLanguage() {
  let lang = {
    help: {
      en: {
        str1: 'Orbit around<br>One finger drag',
        str2: 'Move<br>One finger tap',
      },
      ru: {
        str1: 'Вращение<br>Зажать и перемещать',
        str2: 'Перемещение<br>Нажатие на пол',
      },
    },
    alertIphone: {
      en: {
        str1: 'Please update iOS to version 15 or higher for correct widget performance',
      },
      ru: {
        str1: 'Для корректной работы виджета обновите iOS до версии 15 или выше',
      },
    },
  };

  return lang;
}

function createHtmlEl(params) {
  let lang = listLanguage();

  let html = ``;

  html += LOADER.getHtml();

  html += `<div nameId="containerUI" style="display: -webkit-box; display: flex; position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
		
		<div style="display: flex; position: absolute; top: 0; left: 0; right: 0; height: 0; user-select: none;">
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
		
		<div style="display: flex; flex-direction: column; position: absolute; bottom: 0; left: 0; right: 0; height: auto; user-select: none;">
			<div nameId="footer_p" style="position: relative; display: flex; justify-content: center; align-items: center; width: 100%; height: 0px;">		
				
				<div nameId="butt_camera_First" class="button_back_first mobile" style="display: none;"> 											
					<svg width="15" height="18" viewBox="0 0 15 18" fill="#2F2F2F" xmlns="http://www.w3.org/2000/svg">
						<g>
							${LSVG.getSvg({ type: 'button_back_first' })}
						</g>
					</svg>
				</div>																
				
			</div>
			
			
			<div nameId="footer_cat" class="footer_cat">
				<div nameId="sliderI" cat_row="1" class="catalog_mobile">
					<div nameId="slider" style="display: flex; overflow-x: hidden; overflow-y: hidden; user-select: none;">
					</div>
				</div>
				<div cat_row="2" class="catalog_mobile row2">
					
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
  return;
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
    };
  };

  let el_1 = html.querySelector('[nameId="iphone15"]');
  let el_2 = html.querySelector('[nameId="alert_iphone15"]');

  el_1.onmousedown = (event) => {
    el_1.style.display = 'none';
  };
  el_2.onmousedown = (event) => {
    el_1.style.display = 'none';
  };

  if (Build.infProg.doc.alertIphone15) {
    el_1.style.display = '';
  }

  let el_butt_qr = html.querySelector('[nameId="button_qr"]');
  let el_qr_wrap = html.querySelector('[nameId="qr_wrap"]');
  let el_qr_info = html.querySelector('[nameId="qr_info"]');

  el_butt_qr.onmousedown = (event) => {
    el_qr_wrap.style.display = '';
    CATMOB.closeCatRow2();

    el_qr_wrap.onmousedown = (event) => {
      if (!el_qr_info.contains(event.target)) {
        el_qr_wrap.style.display = 'none';
      }
    };
  };

  let el_qr_save = html.querySelector('[nameId="qr_save"]');
  let el_qr_load = html.querySelector('[nameId="qr_load"]');
  let el_qr_bt_save = html.querySelector('[nameId="button_qr_toggle_save"]');
  let el_qr_bt_load = html.querySelector('[nameId="button_qr_toggle_load"]');

  el_qr_bt_save.onmousedown = (event) => {
    el_qr_save.style.display = 'none';
    el_qr_load.style.display = '';
  };

  el_qr_bt_load.onmousedown = (event) => {
    el_qr_load.style.display = 'none';
    el_qr_save.style.display = '';
  };

  Build.infProg.elem.qrId = html.querySelector('[nameId="qrId"]');

  QRK.assignEvenCopyQR({ html: html });
  QRK.assignEvenCopyUrl({ html: html });
  QRK.assignEvenActiveQR({ html: html });
}
