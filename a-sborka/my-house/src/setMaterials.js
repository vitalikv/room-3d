
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './test.js';







export function setMatSetting_1(params)
{
	
	let obj = params.obj;
	let name = obj.material.name;
	
	if(!obj) return;
	
	if(new RegExp( 'floor' ,'i').test( obj.name )) return;

	let list = [];
	
	list[list.length] = {old: 'mattet', new: 'tulle', metalness: 0, roughness: 1, opacity: 1, transmission: 0.69};
	list[list.length] = {old: 'matte', new: 'matt', metalness: 0, roughness: 1, opacity: 1, transmission: 0 };
	list[list.length] = {old: 'satin', new: 'semimatt', metalness: 0.19, roughness: 0.2, opacity: 1, transmission: 0};
	list[list.length] = {old: 'semigloss', new: 'semiglossy', metalness: 0.59, roughness: 0.15, opacity: 1, transmission: 0};
	list[list.length] = {old: 'glossy', new: 'glossy', metalness: 0.6, roughness: 0.1, opacity: 1, transmission: 0};
	list[list.length] = {old: 'reflective', new: 'reflective', metalness: 1, roughness: 0.0, opacity: 1, transmission: 0};
	list[list.length] = {old: 'brushed', new: 'brushed', metalness: 0.33, roughness: 0.23, opacity: 1, transmission: 0};
	list[list.length] = {old: 'polished', new: 'polished', metalness: 0.7, roughness: 0.1, opacity: 1, transmission: 0};
	list[list.length] = {old: 'chrome', new: 'chrome', metalness: 1.0, roughness: 0, opacity: 1, transmission: 0, NoTexture: true};
	list[list.length] = {old: 'mirror', new: 'mirror', metalness: 1, roughness: 0, opacity: 1, transmission: 0, NoTexture: true};
	list[list.length] = {old: 'glass', new: 'glass', metalness: 1, roughness: 0, opacity: 0.2, transmission: 1, NoTexture: true};
	list[list.length] = {old: 'steklo_blur', new: 'frostedglass', metalness: 0.45, roughness: 0.26, opacity: 1, transmission: 1};	
	list[list.length] = {old: 'selfluminous', new: 'selfluminous', metalness: 0, roughness: 1, opacity: 1, transmission: 0, NoTexture: true};	
	
	
	for ( var i = 0; i < list.length; i++ )
	{		
		if(new RegExp( list[i].old ,'i').test( name ))
		{	 

			
			let uuid = obj.material.uuid;
			let color = obj.material.color;
			let map = obj.material.map;
			let lightMap = obj.material.lightMap;
			let userData = obj.material.userData;
			
			if(map) map.encoding = THREE.sRGBEncoding;
			if(lightMap) lightMap.encoding = THREE.sRGBEncoding;
			
			obj.material = new THREE.MeshPhysicalMaterial({ color: color, transparent: true, map: map, lightMap: lightMap });
			obj.material.name = list[i].old;
			
			obj.material.uuid = uuid;
			obj.material.userData = userData;

			obj.material.metalness = list[i].metalness;
			obj.material.roughness = list[i].roughness;
			obj.material.opacity = list[i].opacity;
			obj.material.transmission = list[i].transmission;
			

			if(list[i].envMap) 
			{ 
				obj.material.userData.envMap = true;
				//obj.material.envMap = gCubeCam.renderTarget.texture;
			}

			//console.log(name, obj.material);
			obj.material.needsUpdate = true;
			
			//disposeNode(obj);
			
			Build.render();	
			
			break;
		}
	}	
	
}




export function setMatSetting_3(cdm)
{
	
	let obj = cdm.obj;
	let name = obj.material.name;
	
	if(!obj) return;
	
	//console.log('xz', obj.name, obj.material.name);
	let color = obj.material.color;
	let map = obj.material.map;
	let lightMap = obj.material.lightMap;
	let userData = obj.material.userData;
	
	//disposeNode(obj);
	
	let list = [];
	
	list[list.length] = {old: 'mattet', new: 'tulle', metalness: 0, roughness: 1, opacity: 1, transmission: 0.69, envMap: true};
	//list[list.length] = {old: 'matte', new: 'matt', metalness: 0, roughness: 1, opacity: 1, transmission: 0 };
	list[list.length] = {old: 'satin', new: 'semimatt', metalness: 0.19, roughness: 0.2, opacity: 1, transmission: 0, envMap: true};
	list[list.length] = {old: 'semigloss', new: 'semiglossy', metalness: 0.59, roughness: 0.15, opacity: 1, transmission: 0, envMap: true};
	list[list.length] = {old: 'glossy', new: 'glossy', metalness: 0.6, roughness: 0.1, opacity: 1, transmission: 0, envMap: true};
	list[list.length] = {old: 'reflective', new: 'reflective', metalness: 1, roughness: 0.0, opacity: 1, transmission: 0, envMap: true};
	list[list.length] = {old: 'brushed', new: 'brushed', metalness: 0.33, roughness: 0.23, opacity: 1, transmission: 0, envMap: true};
	list[list.length] = {old: 'polished', new: 'polished', metalness: 0.7, roughness: 0.1, opacity: 1, transmission: 0, envMap: true};
	list[list.length] = {old: 'chrome', new: 'chrome', metalness: 1.0, roughness: 0, opacity: 1, transmission: 0, envMap: true};
	list[list.length] = {old: 'mirror', new: 'mirror', metalness: 1, roughness: 0, opacity: 1, transmission: 0, envMap: true};
	list[list.length] = {old: 'glass', new: 'glass', metalness: 1, roughness: 0, opacity: 0.84, transmission: 1, envMap: true};
	list[list.length] = {old: 'steklo_blur', new: 'frostedglass', metalness: 0.45, roughness: 0.26, opacity: 1, transmission: 1, envMap: true};	
	

	for ( var i = 0; i < list.length; i++ )
	{		
		if(new RegExp( list[i].old ,'i').test( name ))
		{	 

			//console.log(list[i], obj.name);
			
			let color = obj.material.color;
			let map = obj.material.map;
			let lightMap = obj.material.lightMap;
			let userData = obj.material.userData;
			
			//disposeNode(obj);
			
			obj.material = new THREE.MeshPhysicalMaterial({ color: color, transparent: true, map: map, lightMap: lightMap });
			//obj.material.name = list[i].new;
			
			obj.material.userData = userData;
			
			obj.userData.texture = obj.material.map.clone();			
			obj.userData.click = 0;			

			obj.material.metalness = list[i].metalness;
			obj.material.roughness = list[i].roughness;
			obj.material.opacity = list[i].opacity;
			obj.material.transmission = list[i].transmission;
			

			//obj.material.metalness = 0.99;
			//obj.material.roughness = 0;	

			var camCub_2 = createOneCubeCam_2({pos: cdm.pos});
			
			obj.material.envMap = camCub_2.renderTarget.texture;
			obj.material.map.encoding = THREE.sRGBEncoding;
			obj.material.map.needsUpdate = true;
			obj.material.lightMap.encoding = THREE.sRGBEncoding;
			obj.material.lightMap.needsUpdate = true;
					
			//console.log('boundingSphere', obj.geometry.boundingSphere);
			obj.material.onBeforeCompile = function ( shader ) 
			{
				var bound = obj.geometry.boundingBox;  
				//these parameters are for the cubeCamera texture
				
				shader.uniforms.cubeMapSize = { value: new THREE.Vector3( bound.max.x - bound.min.x, 18, bound.max.z - bound.min.z ) };
				shader.uniforms.cubeMapPos = { value: cdm.pos };

				//replace shader chunks with box projection chunks
				shader.vertexShader = 'varying vec3 vWorldPosition;\n' + shader.vertexShader;

				shader.vertexShader = shader.vertexShader.replace(
					'#include <worldpos_vertex>',
					worldposReplace
				);

				shader.fragmentShader = shader.fragmentShader.replace(
					'#include <envmap_physical_pars_fragment>',
					envmapPhysicalParsReplace
				);
			};							
			
			obj.material.needsUpdate = true;
			Build.render();	
			
			break;
		}
	}
	

	
	obj.material.needsUpdate = true;
	Build.render();	
	
	
}



function createOneCubeCam_2(cdm)
{
	let cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 512, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
	let cubeCam = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
	cubeCam.position.y = 0;
	cubeCam.position.copy(cdm.pos);
	cubeCam.update( Build.renderer, Build.scene );
	
	return cubeCam;
}





			// shader injection for box projected cube environment mapping
			var worldposReplace = `
			#define BOX_PROJECTED_ENV_MAP

			#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )

				vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );

				#ifdef BOX_PROJECTED_ENV_MAP

					vWorldPosition = worldPosition.xyz;

				#endif

			#endif
			`;

			var envmapPhysicalParsReplace = `
			#if defined( USE_ENVMAP )

				#define BOX_PROJECTED_ENV_MAP

				#ifdef BOX_PROJECTED_ENV_MAP

					uniform vec3 cubeMapSize;
					uniform vec3 cubeMapPos;
					varying vec3 vWorldPosition;

					vec3 parallaxCorrectNormal( vec3 v, vec3 cubeSize, vec3 cubePos ) {

						vec3 nDir = normalize( v );
						vec3 rbmax = ( .5 * cubeSize + cubePos - vWorldPosition ) / nDir;
						vec3 rbmin = ( -.5 * cubeSize + cubePos - vWorldPosition ) / nDir;

						vec3 rbminmax;
						rbminmax.x = ( nDir.x > 0. ) ? rbmax.x : rbmin.x;
						rbminmax.y = ( nDir.y > 0. ) ? rbmax.y : rbmin.y;
						rbminmax.z = ( nDir.z > 0. ) ? rbmax.z : rbmin.z;

						float correction = min( min( rbminmax.x, rbminmax.y ), rbminmax.z );
						vec3 boxIntersection = vWorldPosition + nDir * correction;

						return boxIntersection - cubePos;
					}

				#endif

				#ifdef ENVMAP_MODE_REFRACTION
					uniform float refractionRatio;
				#endif

				vec3 getLightProbeIndirectIrradiance( /*const in SpecularLightProbe specularLightProbe,*/ const in GeometricContext geometry, const in int maxMIPLevel ) {

					vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );

					#ifdef ENVMAP_TYPE_CUBE

						#ifdef BOX_PROJECTED_ENV_MAP

							worldNormal = parallaxCorrectNormal( worldNormal, cubeMapSize, cubeMapPos );

						#endif

						vec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );

						// TODO: replace with properly filtered cubemaps and access the irradiance LOD level, be it the last LOD level
						// of a specular cubemap, or just the default level of a specially created irradiance cubemap.

						#ifdef TEXTURE_LOD_EXT

							vec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );

						#else

							// force the bias high to get the last LOD level as it is the most blurred.
							vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );

						#endif

						envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;

					#elif defined( ENVMAP_TYPE_CUBE_UV )

						vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );

					#else

						vec4 envMapColor = vec4( 0.0 );

					#endif

					return PI * envMapColor.rgb * envMapIntensity;

				}

				// Trowbridge-Reitz distribution to Mip level, following the logic of http://casual-effects.blogspot.ca/2011/08/plausible-environment-lighting-in-two.html
				float getSpecularMIPLevel( const in float roughness, const in int maxMIPLevel ) {

					float maxMIPLevelScalar = float( maxMIPLevel );

					float sigma = PI * roughness * roughness / ( 1.0 + roughness );
					float desiredMIPLevel = maxMIPLevelScalar + log2( sigma );

					// clamp to allowable LOD ranges.
					return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );

				}

				vec3 getLightProbeIndirectRadiance( /*const in SpecularLightProbe specularLightProbe,*/ const in vec3 viewDir, const in vec3 normal, const in float roughness, const in int maxMIPLevel ) {

					#ifdef ENVMAP_MODE_REFLECTION

						vec3 reflectVec = reflect( -viewDir, normal );

						// Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
						reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );

					#else

						vec3 reflectVec = refract( -viewDir, normal, refractionRatio );

					#endif

					reflectVec = inverseTransformDirection( reflectVec, viewMatrix );

					float specularMIPLevel = getSpecularMIPLevel( roughness, maxMIPLevel );

					#ifdef ENVMAP_TYPE_CUBE

						#ifdef BOX_PROJECTED_ENV_MAP
							reflectVec = parallaxCorrectNormal( reflectVec, cubeMapSize, cubeMapPos );
						#endif

						vec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );

						#ifdef TEXTURE_LOD_EXT

							vec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );

						#else

							vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );

						#endif

						envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;

					#elif defined( ENVMAP_TYPE_CUBE_UV )

						vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );

					#elif defined( ENVMAP_TYPE_EQUIREC )

						vec2 sampleUV;
						sampleUV.y = asin( clamp( reflectVec.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
						sampleUV.x = atan( reflectVec.z, reflectVec.x ) * RECIPROCAL_PI2 + 0.5;

						#ifdef TEXTURE_LOD_EXT

							vec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );

						#else

							vec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );

						#endif

						envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;

					#elif defined( ENVMAP_TYPE_SPHERE )

						vec3 reflectView = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0,0.0,1.0 ) );

						#ifdef TEXTURE_LOD_EXT

							vec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );

						#else

							vec4 envMapColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );

						#endif

						envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;

					#endif

					return envMapColor.rgb * envMapIntensity;
				}
			#endif
			`;




