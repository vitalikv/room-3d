import * as Build from '../walker.js';
import * as SLO from '../selectObj.js';
import * as LSVG from './list_svg.js';


let arrItems_1 = [];
let arrItems_2 = [];
let arrElBlock = [];
let el_b1 = null;
let el_b2 = null;
let el_b3 = null;
let el_footer_cat = null;


export function initCatalogUI(params) {
    el_b1 = document.querySelector('[nameId="catb_1"]');
    el_b2 = document.querySelector('[nameId="catb_2"]');
    el_b3 = document.querySelector('[nameId="catb_3"]');

    leftPanel(params);
}





function createHtmlEl(params) {
    let type = params.type;
    let parent = params.parent;

    let html = ``;


    if (type == 'item row1' || type == 'item row2') {
        let inf = params.inf;
        let elclass = (type == 'item row1') ? 'panel_group mobile' : 'panel_group_block_item mobile';

        if (inf.setIcon) {
            let divSet = ``;

            for (let i = 0; i < inf.setIcon.length; i++) {
                let dp = ``;
                if (i == 2 && inf.setIcon.length == 3) { dp = `grid-column-start: 1; grid-column-end: 3;`; }

                divSet +=
                    `<div style="padding: 0; margin: 0; background: ${inf.setIcon[i].color}; ${dp}">
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

    if (type == 'cat_group_row2') {
        html =
            `<div nameId="sliderI" class="cat_group_row2" style="display: none;">
			<div nameId="slider" style="display: flex; overflow-x: hidden; overflow-y: hidden; user-select: none;"></div>
		</div>`;
    }



    if (type == 'button_panel_show') {
        html =
            `<div class="button_panel mobile" style="display: none;">
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
            `<div class="button_panel mobile">
			<div class="button_panel_img rot90"> 			
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

    el_footer_cat = document.querySelector('[nameId="footer_cat"]');


    let a1 = document.querySelector('[cat_row="1"]');
    let a2 = a1.querySelector('[nameId="slider"]');

    for (let i = 0; i < arr.length; i++) {
        let inf = addHtmlItem({ item: arr[i] });

        let elem = createHtmlEl({ type: 'item row1', parent: a2, inf: inf });

        arrItems_1[arrItems_1.length] = elem;

        let elBlock = null;
        if (arr[i].items.length > 0) { elBlock = childBlock({ arr: arr[i].items, paintsId: arr[i].id, parentEl: elem }); }

        addEventClickRow_1({ blockUI: elem, el_footer_cat: el_footer_cat, elBlock: elBlock });
    }

    addEventScroll({ blockUI: a1 });

    let b1 = document.querySelector('[cat_row="2"]');

    for (let i = 0; i < arrElBlock.length; i++) {
        b1.appendChild(arrElBlock[i]);
    }





    el_b1.onmousedown = (e) => {
        el_b1.style.display = 'none';
        el_b2.style.display = '';
        el_b3.style.display = 'none';

        el_footer_cat.classList.remove('catb_1');
        el_footer_cat.classList.remove('catb_2');
        el_footer_cat.classList.remove('catb_3');

        el_footer_cat.classList.add('catb_2');
    }

    el_b2.onmousedown = (e) => {
        el_b1.style.display = '';
        el_b2.style.display = 'none';
        el_b3.style.display = 'none';

        el_footer_cat.classList.remove('catb_1');
        el_footer_cat.classList.remove('catb_2');
        el_footer_cat.classList.remove('catb_3');

        el_footer_cat.classList.add('catb_1');
    }

    el_b3.onmousedown = (e) => {
        closeCatRow2();
    }
}


export function closeCatRow2() {
    el_b1.style.display = 'none';
    el_b2.style.display = '';
    el_b3.style.display = 'none';

    el_footer_cat.classList.remove('catb_1');
    el_footer_cat.classList.remove('catb_2');
    el_footer_cat.classList.remove('catb_3');

    el_footer_cat.classList.add('catb_2');
    arrElBlock.forEach(el => el.style.display = 'none');
}





function leftPanel2(params) {
    let arr = params.arr;
    if (arr.length == 0) return;

    let el_footer_cat = document.querySelector('[nameId="footer_cat"]');

    let cat_row1 = createHtmlEl({ type: 'catalog row1', parent: el_footer_cat });
    let cat_row2 = createHtmlEl({ type: 'catalog row2', parent: el_footer_cat });

    for (let i = 0; i < arr.length; i++) {
        let inf = addHtmlItem({ item: arr[i] });

        let elem = createHtmlEl({ type: 'item row1', parent: cat_row1.querySelector('[nameId="slider"]'), inf: inf });

        let elBlock = null;
        if (arr[i].items.length > 0) { elBlock = childBlock({ arr: arr[i].items, paintsId: arr[i].id }); }

        let isDown = false;
        let isMove = false;

        elem.onmousedown = () => { isDown = true;
            isMove = false; }
        elem.onmousemove = (e) => { if (isDown) { isMove = true; } };

        elem.onmouseup = () => {
            if (isDown && !isMove) {
                let open = false;

                for (let i2 = 0; i2 < arrElBlock.length; i2++) {
                    if (elBlock == arrElBlock[i2]) {
                        elBlock.style.display = (elBlock.style.display == '') ? 'none' : '';

                        if (elBlock.style.display == '') open = true;
                    } else {
                        arrElBlock[i2].style.display = 'none';
                    }
                }

                el_footer_cat.classList.remove('catalog_open_mobile_1');
                el_footer_cat.classList.remove('catalog_open_mobile_2');
                el_footer_cat.classList.remove('catalog_close_mobile_1');
                el_footer_cat.classList.remove('catalog_close_mobile_2');

                if (open) {
                    el_footer_cat.classList.add('catalog_open_mobile_2');
                } else {
                    el_footer_cat.classList.add('catalog_close_mobile_2');
                }
            }

            isDown = false;
        };

    }

    addEventScroll({ blockUI: cat_row1 });

    for (let i = 0; i < arrElBlock.length; i++) {
        cat_row2.appendChild(arrElBlock[i]);

        addEventScroll({ blockUI: arrElBlock[i] });
    }



    let el_bps = createHtmlEl({ type: 'button_panel_show', parent: document.querySelector('[nameId="footer_p"]') });
    let el_bph = createHtmlEl({ type: 'button_panel_hide', parent: document.querySelector('[nameId="footer_p"]') });



    el_bps.onmousedown = (e) => {
        el_bps.style.display = 'none';
        el_bph.style.display = '';

        el_footer_cat.classList.remove('catalog_open_mobile_1');
        el_footer_cat.classList.remove('catalog_open_mobile_2');
        el_footer_cat.classList.remove('catalog_close_mobile_1');
        el_footer_cat.classList.remove('catalog_close_mobile_2');
        el_footer_cat.classList.add('catalog_open_mobile_1');
    }

    el_bph.onmousedown = (e) => {
        el_bph.style.display = 'none';
        el_bps.style.display = '';

        el_footer_cat.classList.remove('catalog_open_mobile_1');
        el_footer_cat.classList.remove('catalog_open_mobile_2');
        el_footer_cat.classList.remove('catalog_close_mobile_1');
        el_footer_cat.classList.remove('catalog_close_mobile_2');
        el_footer_cat.classList.add('catalog_close_mobile_1');

        arrElBlock.forEach(el => el.style.display = 'none');
    }
}


function childBlock(params) {
    let paintsId = params.paintsId;
    let arr = params.arr;
    let parentEl = params.parentEl;

    let el_parent_prev = parentEl.querySelector('[nameId="prev"]');

    let blockUI = createHtmlEl({ type: 'cat_group_row2', parent: document.querySelector('[nameId="containerUI"]') });

    let paints = Build.infProg.scene.paints;

    paints[paintsId].catalog = {};
    paints[paintsId].catalog.main = el_parent_prev;
    paints[paintsId].catalog.items = [];

    for (let i = 0; i < arr.length; i++) {
        let inf = addHtmlItem({ item: arr[i] });

        let elem = createHtmlEl({ type: 'item row2', parent: blockUI.querySelector('[nameId="slider"]'), inf: inf });

        arrItems_2[arrItems_2.length] = elem;

        let el_prev = elem.querySelector('[nameId="prev"]');

        paints[paintsId].catalog.items[arr[i].id] = el_prev;

        addEventClickRow_2({ blockUI: elem, paintsId: paintsId, lotId: arr[i].id, el_parent_prev: el_parent_prev, el_prev: el_prev });
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



function addEventScroll(params) {
    let blockUI = params.blockUI;
    let slider = blockUI.querySelector('[nameId="slider"]');

    let isDown = false;
    let isMove = false;
    let startX;
    let scrollLeft;


    blockUI.onmousedown = (event) => tabDown(event);
    blockUI.onmousemove = (event) => tabMove(event);
    blockUI.onmouseup = (event) => tabUp(event);
    slider.onwheel = (event) => scrollMove(event);

    blockUI.ontouchstart = (event) => tabDown(event);
    blockUI.ontouchmove = (event) => tabMove(event);
    blockUI.ontouchend = (event) => tabUp(event);

    function tabDown(event) {
        if (event.target.closest('[nameId="slider"]') != slider) return;

        isDown = true;
        isMove = false;

        convM(event);

        startX = event.clientX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }

    function tabMove(event) {
        if (!isDown) return;

        isMove = true;

        convM(event);

        const x = event.clientX - slider.offsetLeft;
        const walk = (x - startX) * 1; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    }

    function tabUp(event) {
        isDown = false;
    }

    function tabOut(event) {
        isDown = false;
    }

    function scrollMove(event) {
        slider.scrollLeft += event.deltaY;
    }

    function convM(event) {
        if (event.changedTouches) {
            event.clientX = event.targetTouches[0].clientX;
            event.clientY = event.targetTouches[0].clientY;
        }
    }
}


function addEventClickRow_1(params) {
    let blockUI = params.blockUI;
    let el_footer_cat = params.el_footer_cat;
    let elBlock = params.elBlock;

    let isDown = false;
    let isMove = false;


    blockUI.onmousedown = (event) => tabDown(event);
    blockUI.onmousemove = (event) => tabMove(event);
    blockUI.onmouseup = (event) => tabUp(event);

    //blockUI.ontouchstart = (event) => tabDown(event);
    //blockUI.ontouchmove = (event) => tabMove(event);
    //blockUI.ontouchend = (event) => tabUp(event);

    function tabDown(event) {
        isDown = true;
        isMove = false;
    }

    function tabMove(event) {
        if (!isDown) return;

        isMove = true;
    }

    function tabUp(event) {
        if (isDown && !isMove) {
            let open = false;

            for (let i2 = 0; i2 < arrElBlock.length; i2++) {
                if (elBlock == arrElBlock[i2]) {
                    elBlock.style.display = (elBlock.style.display == '') ? 'none' : '';

                    if (elBlock.style.display == '') open = true;
                } else {
                    arrElBlock[i2].style.display = 'none';
                }
            }

            el_footer_cat.classList.remove('catb_1');
            el_footer_cat.classList.remove('catb_2');
            el_footer_cat.classList.remove('catb_3');

            deActiveItems_1();
            deActiveItems_2();

            if (open) {
                el_b1.style.display = 'none';
                el_b2.style.display = 'none';
                el_b3.style.display = '';
                el_footer_cat.classList.add('catb_3');
                addEventScroll({ blockUI: elBlock });
                blockUI.classList.add('item_active');
            } else {
                el_b1.style.display = 'none';
                el_b2.style.display = '';
                el_b3.style.display = 'none';
                el_footer_cat.classList.add('catb_2');
            }
        }

        isDown = false;
    }

}


function addEventClickRow_2(params) {
    let blockUI = params.blockUI;
    let paintsId = params.paintsId;
    let lotId = params.lotId;
    let el_parent_prev = params.el_parent_prev;
    let el_prev = params.el_prev;

    let isDown = false;
    let isMove = false;


    blockUI.onmousedown = (event) => tabDown(event);
    blockUI.onmousemove = (event) => tabMove(event);
    blockUI.onmouseup = (event) => tabUp(event);

    //blockUI.ontouchstart = (event) => tabDown(event);
    //blockUI.ontouchmove = (event) => tabMove(event);
    //blockUI.ontouchend = (event) => tabUp(event);

    function tabDown(event) {
        isDown = true;
        isMove = false;
    }

    function tabMove(event) {
        if (!isDown) return;

        isMove = true;
    }

    function tabUp(event) {
        if (isDown && !isMove) {
            el_parent_prev.innerHTML = el_prev.innerHTML;
            el_parent_prev.style.cssText = el_prev.style.cssText;
            deActiveItems_2();
            blockUI.classList.add('item_active');
            SLO.changeLots({ paintsId: paintsId, lotId: lotId });
        }

        isDown = false;
    }

}



function deActiveItems_1() {
    arrItems_1.forEach(el => el.classList.remove('item_active'));
}

function deActiveItems_2() {
    arrItems_2.forEach(el => el.classList.remove('item_active'));
}