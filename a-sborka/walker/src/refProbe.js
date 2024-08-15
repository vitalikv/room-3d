import * as THREE from 'three';
import * as Build from './walker.js';

export function crReflectionProbe() {
  let imgSize = 256;

  let pmremGenerator = new THREE.PMREMGenerator(Build.renderer);
  pmremGenerator.compileEquirectangularShader();

  let cubeCamera = new THREE.CubeCamera(0.01, 10, new THREE.WebGLCubeRenderTarget(imgSize, { encoding: THREE.sRGBEncoding }));

  for (let i = 0; i < Build.infProg.scene.reflectionProbe.length; i++) {
    cubeCamera.position.copy(Build.infProg.scene.reflectionProbe[i].pos);
    cubeCamera.update(Build.renderer, Build.scene);

    let envMap = pmremGenerator.fromEquirectangular(cubeCamera.renderTarget.texture).texture;

    Build.infProg.scene.reflectionProbe[i].envMap = envMap;

    if (Build.infProg.scene.reflectionProbe[i].obj) {
      let ro = Build.infProg.scene.reflectionProbe[i].obj;
      //ro.material.metalness = 0.7,
      //ro.material.roughness = 0.0;
      ro.material.envMap = envMap;
      ro.material.needsUpdate = true;
    }

    Build.infProg.scene.furnitures.forEach((obj) => setRefProbe({ obj }));

    envMap.dispose();
    cubeCamera.renderTarget.texture.dispose();
  }

  Build.infProg.scene.reflectionProbe = [];
  pmremGenerator.dispose();
}

function setRefProbe({ obj }) {
  obj.traverse((child) => {
    if (child.userData && child.userData.uuidRP && child.material.userData.envMap) {
      let prefProb = Build.infProg.scene.reflectionProbe.find((o) => child.userData.uuidRP == o.uuid);

      if (prefProb && child.material.type == 'MeshStandardMaterial') {
        child.material.envMap = prefProb.envMap;
        child.material.needsUpdate = true;
      }
    }
  });
}
