import * as Build from '../walker.js';
import * as SLO from '../selectObj.js';
import * as LSVG from './list_svg.js';


let arrItems_1 = [];
let arrItems_2 = [];
let arrElBlock = [];

export function initCatalogUI(params) {
    leftPanel(params);
}


function createHtmlEl(params) {
    let type = params.type;
    let parent = params.parent;

    let html = ``;

    if (type == 'panel') {
        html = `<div class="panel"></div>`;
    }

    if (type == 'panel_group' || type == 'panel_group_block_item') {
        let inf = params.inf;
        let elclass = type;

        if (inf.setIcon) {
            let divSet = ``;

            for (let i = 0; i < inf.setIcon.length; i++) {
                let dp = ``;
                if (i == 2 && inf.setIcon.length == 3) { dp = `grid-column-start: 1; grid-column-end: 3;`; }

                divSet +=
                    `<div style="background: ${inf.setIcon[i].color}; ${dp}">
					${inf.setIcon[i].preview}
				</div>`;
            }

            html =
                `<div class="${elclass}">
				<div nameId="prev" class="panel_group_prev" style="display: grid; grid-template-columns: 50% 50%; background: #ffffff;">
					${divSet}
				</div>
				<div class="panel_group_txt">
					${inf.caption}
				</div>
			</div>`;
        } else {
            html =
                `<div class="${elclass}">
				<div nameId="prev" class="panel_group_prev" style="background: ${inf.color};">
					${inf.preview}
				</div>
				<div class="panel_group_txt">
					${inf.caption}
				</div>
			</div>`;
        }
    }

    if (type == 'panel_group_block') {
        html = `<div class="panel_group_block" style="display: none;"></div>`;
    }



    if (type == 'button_panel_show') {
        html =
            `<div class="button_panel" style="display: none;">
			<div class="button_panel_img"> 											
				<svg width="14" height="14" viewBox="0 0 14 14" fill="#2F2F2F" xmlns="http://www.w3.org/2000/svg">
					<g>
						${LSVG.getSvg({type: 'button_open_catalog'})}
					</g>
				</svg>								
			</div>		
			<div class="button_panel_txt"> 			
				Отделка
			</div>			
		</div>`;
    }


    if (type == 'button_panel_hide') {
        html =
            `<div class="button_panel">
			<div class="button_panel_img"> 			
				<svg width="13" height="12" viewBox="0 0 13 12" fill="#4A4A4A" xmlns="http://www.w3.org/2000/svg">
					<g>
						${LSVG.getSvg({type: 'button_close_catalog'})}
					</g>
				</svg>
			</div>		
			<div class="button_panel_txt"> 			
				Скрыть
			</div>			
		</div>`;
    }


    let div1 = document.createElement('div');
    div1.innerHTML = html;
    let elem = div1.firstChild;
    parent.appendChild(elem);

    return elem;
}


function leftPanel(params) {
    let arr = params.arr;
    if (arr.length == 0) return;

    let blockUI = createHtmlEl({ type: 'panel', parent: document.querySelector('[nameId="containerUI"]') });


    for (let i = 0; i < arr.length; i++) {
        let inf = addHtmlItem({ item: arr[i] });

        let elem = createHtmlEl({ type: 'panel_group', parent: blockUI, inf: inf });

        arrItems_1[arrItems_1.length] = elem;

        let elBlock = null;
        if (arr[i].items.length > 0) { elBlock = childBlock({ arr: arr[i].items, paintsId: arr[i].id, parentEl: elem }); }

        elem.onmousedown = (e) => {
            SLO.outlineAddObj({ arr: [] });

            e.stopPropagation();

            deActiveItems_1();

            for (let i2 = 0; i2 < arrElBlock.length; i2++) {
                if (elBlock == arrElBlock[i2]) {
                    elBlock.style.display = (elBlock.style.display == '') ? 'none' : '';

                    //if(elBlock.style.display == '') { SLO.checkActObj({paintsId: arr[i].id}); }

                    if (elBlock.style.display == '') {
                        elem.classList.add('item_active');
                        document.addEventListener('mousedown', hideChildBlock);
                    }
                } else {
                    arrElBlock[i2].style.display = 'none';
                }
            }
        }
    }


    let el_bps = createHtmlEl({ type: 'button_panel_show', parent: document.querySelector('[nameId="containerUI"]') });
    let el_bph = createHtmlEl({ type: 'button_panel_hide', parent: document.querySelector('[nameId="containerUI"]') });


    el_bps.onmousedown = (e) => {
        el_bps.style.display = 'none';
        el_bph.style.display = '';
        //blockUI.style.display = '';
        blockUI.classList.remove('catalog_close_pc');
        blockUI.classList.add('catalog_open_pc');
    }

    el_bph.onmousedown = (e) => {
        el_bph.style.display = 'none';
        el_bps.style.display = '';
        blockUI.classList.remove('catalog_open_pc');
        blockUI.classList.add('catalog_close_pc');
        //blockUI.style.display = 'none';
        arrElBlock.forEach(el => el.style.display = 'none');
        document.removeEventListener('click', hideChildBlock);
    }
}


function childBlock(params) {
    let paintsId = params.paintsId;
    let arr = params.arr;
    let parentEl = params.parentEl;

    let el_parent_prev = parentEl.querySelector('[nameId="prev"]');

    let blockUI = createHtmlEl({ type: 'panel_group_block', parent: document.querySelector('[nameId="containerUI"]') });

    let paints = Build.infProg.scene.paints;

    paints[paintsId].catalog = {};
    paints[paintsId].catalog.main = el_parent_prev;
    paints[paintsId].catalog.items = [];

    for (let i = 0; i < arr.length; i++) {
        let inf = addHtmlItem({ item: arr[i] });

        let elem = createHtmlEl({ type: 'panel_group_block_item', parent: blockUI, inf: inf });

        arrItems_2[arrItems_2.length] = elem;

        let el_prev = elem.querySelector('[nameId="prev"]');

        paints[paintsId].catalog.items[arr[i].id] = el_prev;

        elem.onmousedown = (e) => {
            el_parent_prev.innerHTML = el_prev.innerHTML;
            el_parent_prev.style.cssText = el_prev.style.cssText;
            deActiveItems_2();
            elem.classList.add('item_active');
            SLO.changeLots({ paintsId: paintsId, lotId: arr[i].id });
        }
    }

    arrElBlock[arrElBlock.length] = blockUI;

    return blockUI;
}


function addHtmlItem(params) {
    let item = params.item;

    let caption = item.caption;
    let preview = (item.preview) ? `<img src="${item.preview}" style="display: block; height: 100%; margin: auto; pointer-events: none;">` : ``;
    let color = (item.color) ? `#${item.color}` : `#5fa9f8`;
    let setIcon = null;

    if (item.setIcon) {
        setIcon = [];

        for (let i = 0; i < item.setIcon.length; i++) {
            let item2 = item.setIcon[i];

            setIcon[i] = {};
            setIcon[i].preview = (item2.preview) ? `<img src="${item2.preview}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">` : ``;
            setIcon[i].color = (item2.color) ? `#${item2.color}` : `#5fa9f8`;
        }
    }

    return { caption: caption, preview: preview, color: color, setIcon: setIcon };
}



function hideChildBlock(event) {
    let result = null;

    for (let i2 = 0; i2 < arrElBlock.length; i2++) {
        if (arrElBlock[i2].contains(event.target)) { result = true; }
    }

    if (result) return;

    arrElBlock.forEach(el => el.style.display = 'none');
    deActiveItems_1();
    deActiveItems_2();

    document.removeEventListener('mousedown', hideChildBlock);
}



function deActiveItems_1() {
    arrItems_1.forEach(el => el.classList.remove('item_active'));
}

function deActiveItems_2() {
    arrItems_2.forEach(el => el.classList.remove('item_active'));
}