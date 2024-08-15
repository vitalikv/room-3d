import * as WKP from '../walkPoint.js';
import * as LOADER from '../ui/loader.js';
import * as SLO from '../selectObj.js';
import * as QRK from '../qr.js';
import * as IFP from '../infoPoint.js';
//import { UI } from '../interface';

export let apiPIA;

export function init(elRoot) {
  apiPIA = new ApiPIA(elRoot);
}

class ApiPIA {
  constructor(params) {
    this.elRoot = params.elRoot;
    this.showUi = params.showUi;
    this.lang = params.lang ? params.lang : this.detectBrowserLanguage();
    this.mobile = this.detectMobileDevice();
    this.onReady = params.onReady;
    this.gallery = [];
  }

  // получить элемент в который встраивается PIA
  getElRoot() {
    return this.elRoot;
  }

  // запуск лоадера
  initProgressBar() {
    LOADER.initLoader();
  }

  // прогресс лоадера
  moveProgressBar(value) {
    this.getElRoot().querySelector('[nameId="progressBar"]').style.width = value + '%';
  }

  // лоадер загружен на 100%
  endProgressBar() {
    this.getElRoot().querySelector('[nameId="wrap_progressBar"]').style.display = 'none';
    this.getElRoot().querySelector('[nameId="loader"]').style.display = 'none';
  }

  // показать/спрятать кнопку выход из режима "от первого лица"
  buttonExitCamWalkUI(isShow) {
    //UI.toggleCamWalkButton(isShow);
  }

  // выход из режима "от первого лица"
  camFly() {
    WKP.goFly();
  }

  // подключение интерфейса
  initInterface() {
    // UI.init({
    //   el: this.elRoot,
    //   showUi: this.showUi,
    //   locale: this.lang,
    //   qr: this.getQR(),
    // });
  }

  // подключение каталога
  initCatalog(data) {
    // this.gallery = data;
    // UI.initGallery({ gallery: data });
    // if (this.onReady) {
    //   this.onReady();
    // }
  }

  getCatalog() {
    return this.gallery;
  }

  showHideCatalog(show) {
    if (IFP.ManageIP) IFP.ManageIP.enablePoints({ show: show });
  }

  detectMobileDevice() {
    let mobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      mobile = true;
    }
    return mobile;
  }

  detectBrowserLanguage() {
    let language = 'en';

    if (/ru/i.test(navigator.language)) {
      language = 'ru';
    }
    return language;
  }

  // применить окраску
  applyPaint(groupId, itemId) {
    return new Promise((resolve, reject) => {
      try {
        SLO.changeLots({ paintsId: groupId, lotId: itemId });
        resolve(this.getQR());
      } catch (e) {
        reject(e);
      }
    });
  }

  // получить QR код
  getQR() {
    //return QRK.getQR();
  }

  // нажали на кнопку "применить код"
  applyQr(value) {
    // return new Promise((resolve) => {
    //   QRK.updatePaints({ qr: value }); // пример: value = 'CABAAAAAABA'
    //   resolve(QRK.getQR());
    // });
  }
}
