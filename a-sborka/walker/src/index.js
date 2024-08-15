import * as Build from './walker.js';

class PoPIA {
  constructor() {
    //this.init();
  }

  init(params = { url: null }) {
    Build.init(params);
  }
}

if (!window.PoPIA) {
  window.PoPIA = new PoPIA();

  let paramsString = document.location.search;
  let searchParams = new URLSearchParams(paramsString);
  let flat = searchParams.get('flat');

  if (flat) {
    window.PoPIA.init({ url: flat });
  } else {
    //window.PoPIA.init({ url: './file/flat.json?164845' });

    window.PoPIA.init({
      el: '#root',
      url: './file/flat.json?164845',
      showUi: true,
      //lang: 'en',
      wPoint: false,
      camCenter: true,
      infoPoint: true,
    });
  }
}

//window.PoPIA.init({url: 'https://files.planoplan.com/upload/userdata/1/2/projects/2770528/poplight/flat.json?444', width: '700px', height: '700px'});
//window.PoPIA.init({url: 'https://files.planoplan.com/upload/userdata/1/2/projects/2770528/poplight/flat.json?2444'});

// /?flat=https://files.planoplan.com/upload/userdata/1/2/projects/2826121/poplight/flat.json?2454
