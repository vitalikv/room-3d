import * as LSVG from './list_svg.js';




export function getHtml() {
    let html =
        `<div nameId="loader" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: #fff; z-index: 3; display: block;">

		<div class="logo_start_wrap">
			<div class="logo_start_a">
				<div>
					<svg width="45" height="44" viewBox="0 0 45 44" fill="#0057FF">
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
			</div>
		</div>
		
		
		<div class="logo_business_wrap">
			<svg width="162" height="22" viewBox="0 0 162 22" fill="#2F2F2F" xmlns="http://www.w3.org/2000/svg">
				<g>
					${LSVG.getSvg({type: 'logo_business'})}
				</g>
			</svg>
		</div>			
	
	</div>
	
	<div nameId="wrap_progressBar" style="display: flex; position: absolute; left: 0; right: 0; bottom: 50%; width: 100%; height: 4px; margin: 0; z-index: 4;">
		<div style="position: relative; width: 100%; height: 100%; max-width: 1000px; margin: auto;">
			<div style="position: absolute; width: 100%; height: 100%; background: #F5F7F6; border-radius: 7px;"></div>
			<div nameId="progressBar" style="position: absolute; width: 0%; height: 100%; background: #0057FF; border-radius: 7px; transition: width .1s;"></div>
		</div>
	</div>`;

    return html;
}