import img_hidelot from './images/hidelot.png';

import * as Build from './walker';
import * as SLO from './selectObj.js';

export function structureCatalog() {
  let paints = Build.infProg.scene.paints;
  let arr = [];

  for (let i = 0; i < paints.length; i++) {
    if (!paints[i].paint) continue;
    if (!Array.isArray(paints[i].paint)) continue;
    if (paints[i].paint.length == 0) continue;

    if (!paints[i].paint[0].lots) continue;
    if (!Array.isArray(paints[i].paint[0].lots)) continue;
    if (paints[i].paint[0].lots.length == 0) continue;

    if (paints[i].activeId > -1) {
      for (let i2 = 0; i2 < paints[i].paint.length; i2++) {
        if (paints[i].activeId + 1 > paints[i].paint[i2].lots.length) continue;

        paints[i].paint[i2].setupedLot = paints[i].paint[i2].lots[paints[i].activeId];
      }
    }

    let n = arr.length;

    arr[n] = {};
    arr[n].id = i;
    arr[n].caption = paints[i].caption;
    arr[n].preview = null;
    arr[n].color = null;
    arr[n].setIcon = null;
    arr[n].items = [];

    let o = SLO.infLots.find((o) => o.id == paints[i].paint[0].setupedLot);

    if (o) {
      if (o.preview && o.preview !== '') arr[n].preview = o.preview;
      if (o.color && o.color !== '') arr[n].color = o.color;
    }

    paints[i].activeId = paints[i].paint[0].lots.findIndex((id) => id == paints[i].paint[0].setupedLot);

    let arr2 = [];
    let paintsCaptions = paints[i].paintsCaptions;

    if (paintsCaptions) {
      if (paints[i].activeId > -1) setIcon({ arr: arr, n: n, paints: paints, i: i, ind: paints[i].activeId });

      for (let i2 = 0; i2 < paintsCaptions.length; i2++) {
        let n = arr2.length;
        arr2[n] = {};
        arr2[n].id = i2;
        arr2[n].caption = paintsCaptions[i2].ru;
        arr2[n].preview = null;
        arr2[n].color = null;

        setIcon({ arr: arr2, n: n, paints: paints, i: i, ind: i2 });
      }
    } else {
      let lots = paints[i].paint[0].lots;

      for (let i2 = 0; i2 < lots.length; i2++) {
        let n = arr2.length;
        arr2[n] = {};
        arr2[n].id = i2;
        arr2[n].caption = '';
        arr2[n].preview = null;
        arr2[n].color = null;

        let o = SLO.infLots.find((o) => o.id == lots[i2]);
        if (!o) continue;

        arr2[n].caption = o.shortName.length > 0 ? o.shortName : o.caption;
        arr2[n].preview = o.preview && o.preview !== '' ? o.preview : null;
        arr2[n].color = o.color && o.color !== '' ? o.color : null;

        if (new RegExp('thumbx', 'i').test(arr2[n].preview)) {
          arr2[n].preview = arr2[n].preview.replace('thumbx', 'thumb128x128');
        }
      }
    }
    arr[n].actItemId = paints[i].activeId;
    arr[n].items = arr2;

    paints[i].captions = arr2.map((o) => o.caption);
  }

  setPrevDefault({ arr: arr });

  return arr;
}

function setIcon(params) {
  let arr = params.arr;
  let n = params.n;
  let paints = params.paints;
  let i = params.i;
  let ind = params.ind;

  //arr[n].color = null;
  //arr[n].preview = null;
  arr[n].setIcon = null;

  let setIcon = [];
  let paint = paints[i].paint;

  for (let i2 = 0; i2 < paint.length; i2++) {
    let n2 = setIcon.length;

    if (n2 > 3) break;

    let o = SLO.infLots.find((o) => o.id == paints[i].paint[i2].lots[ind]);
    if (!o) continue;

    let exist = setIcon.find((o2) => o2.lotId == o.id);
    if (exist) continue;

    setIcon[n2] = {};
    setIcon[n2].lotId = o.id;
    setIcon[n2].preview = o.preview && o.preview !== '' ? o.preview : null;
    setIcon[n2].color = o.color && o.color !== '' ? o.color : null;

    if (new RegExp('thumbx', 'i').test(setIcon[n2].preview)) {
      setIcon[n2].preview = setIcon[n2].preview.replace('thumbx', 'thumb128x128');
    }
  }

  if (setIcon.length > 1) {
    arr[n].setIcon = setIcon;
  } else if (setIcon.length == 1 && setIcon[0].color) {
    arr[n].preview = setIcon[0].preview;
    arr[n].color = setIcon[0].color;
  }
}

function setPrevDefault(params) {
  let arr = params.arr;

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].preview && !arr[i].color && !arr[i].setIcon) arr[i].preview = img_hidelot;

    for (let i2 = 0; i2 < arr[i].items.length; i2++) {
      let arr2 = arr[i].items[i2];

      if (!arr2.preview && !arr2.color && !arr2.setIcon) {
        arr2.preview = img_hidelot;
        arr2.color = 'FFFFFF';
      }
    }
  }
}
