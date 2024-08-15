import * as LSVG from './list_svg.js';
import * as API from '../api/apiPia.js';

export function initLoader() {
  let elem = document.createElement('div');
  elem.innerHTML = getHtml();

  let elRoot = API.apiPIA.getElRoot();
  elRoot.appendChild(elem);
}

export function getHtml() {
  let html = `<div nameId="loader" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: #fff; z-index: 3; display: block;">
		
	
	</div>
	
	<div nameId="wrap_progressBar" style="display: flex; position: absolute; left: 0; right: 0; bottom: 50%; width: 100%; height: 10px; margin: 0; z-index: 4;">
		<div style="position: relative; width: 100%; height: 100%; max-width: 1000px; margin: auto;">
			<div style="position: absolute; width: 100%; height: 100%; background: #F5F7F6; border-radius: 7px;"></div>
			<div nameId="progressBar" style="position: absolute; width: 0%; height: 100%; background: #fa0; border-radius: 7px; transition: width .1s;"></div>
		</div>
	</div>`;

  return html;
}
