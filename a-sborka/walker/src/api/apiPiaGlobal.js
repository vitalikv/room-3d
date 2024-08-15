import * as SLO from '../selectObj.js';

window.piaInvokeFunction = invokeFunction;

function invokeFunction(name, params) {
  if (name === 'setPaints') {
    let groupId = params.groupId;
    let itemId = params.itemId;

    SLO.changeLots({ paintsId: groupId, lotId: itemId });
  }

  if (name === 'getEstimate') {
    return SLO.getEstimate();
  }
}
