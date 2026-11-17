/* DevilsPro — rzeczywista scena WebGL 3D, geometryczny model zastępczy. */
(function(){
'use strict';
const host=document.getElementById('devilsCharacterPreview');if(!host)return;
const user=sessionStorage.getItem('idleLoggedUser'),slot=sessionStorage.getItem('idleActiveSlot');
const gearKey='idleDemoEquipment_'+user+'_'+slot;
function equipment(){try{return JSON.parse(localStorage.getItem(gearKey)||'{}')||{}}catch{return {}}}
function start(){
 if(!window.THREE){host.innerHTML='<div class="model3d-error">Nie udało się wczytać silnika 3D. Sprawdź połączenie z internetem.</div>';return;}
 const T=window.THREE;
 host.classList.remove('devils-look');host.innerHTML='';host.classList.add('model3d-host');
 const stage=document.createElement('div');stage.className='model3d-stage';
 const controls=document.createElement('div');controls.className='model3d-controls';
 const toggle=document.createElement('button');toggle.type='button';toggle.textContent='Obracaj: WYŁ.';toggle.setAttribute('aria-pressed','false');
 const angleLabel=document.createElement('span');angleLabel.textContent='0°';
 controls.append(toggle,angleLabel);host.append(stage,controls);
 const scene=new T.Scene();const camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(0,2.15,7.8);camera.lookAt(0,1.9,0);
 let renderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.shadowMap.enabled=true;stage.appendChild(renderer.domElement)}catch(e){stage.textContent='Twoja przeglądarka nie obsługuje WebGL.';return}
 scene.add(new T.HemisphereLight(0xf7d9b4,0x30202e,2.15));const keyLight=new T.DirectionalLight(0xffe1a3,3.2);keyLight.position.set(-3,7,5);scene.add(keyLight);const rim=new T.DirectionalLight(0x9067e8,2.4);rim.position.set(3,5,-4);scene.add(rim);
 const body=new T.Group();scene.add(body);
 const skin=new T.MeshStandardMaterial({color:0xc58b70,roughness:.77});const hair=new T.MeshStandardMaterial({color:0x2a1720,roughness:.8});const cloth=new T.MeshStandardMaterial({color:0x48242c,metalness:.25,roughness:.7});const gold=new T.MeshStandardMaterial({color:0xd4a64f,metalness:.82,roughness:.26});const steel=new T.MeshStandardMaterial({color:0x9aa6bd,metalness:.85,roughness:.28});const violet=new T.MeshStandardMaterial({color:0x62436f,metalness:.45,roughness:.36});const black=new T.MeshStandardMaterial({color:0x17151b,roughness:.8});
 function ell(parent,x,y,z,sx,sy,sz,mat){const mesh=new T.Mesh(new T.SphereGeometry(1,18,14),mat);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh}
 function cyl(parent,x,y,z,rt,rb,h,mat,segments=12){const mesh=new T.Mesh(new T.CylinderGeometry(rt,rb,h,segments),mat);mesh.position.set(x,y,z);parent.add(mesh);return mesh}
 function limb(parent,a,b,r1,r2,mat){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);const mesh=new T.Mesh(new T.CylinderGeometry(r1,r2,d.length(),12),mat);mesh.position.copy(av.add(bv).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());parent.add(mesh);return mesh}
 // Stała sylwetka z pełną geometrią przodu, boków i pleców.
 ell(body,0,2.55,0,.34,.49,.22,skin);ell(body,0,2.05,0,.25,.29,.19,skin);
 ell(body,0,3.35,0,.22,.29,.20,skin);cyl(body,0,3.08,0,.105,.11,.23,skin);
 ell(body,0,3.54,-.09,.25,.31,.24,hair);ell(body,-.16,3.20,-.15,.13,.47,.12,hair);ell(body,.16,3.20,-.15,.13,.47,.12,hair);
 ell(body,-.07,3.38,.185,.024,.018,.012,black);ell(body,.07,3.38,.185,.024,.018,.012,black);
 ell(body,-.23,2.85,0,.14,.14,.16,skin);ell(body,.23,2.85,0,.14,.14,.16,skin);
 limb(body,[-.31,2.82,0],[-.45,2.35,.04],.12,.10,skin);limb(body,[-.45,2.35,.04],[-.38,1.91,.16],.10,.075,skin);ell(body,-.38,1.83,.16,.095,.14,.075,skin);
 limb(body,[.31,2.82,0],[.45,2.35,.04],.12,.10,skin);limb(body,[.45,2.35,.04],[.39,1.91,.16],.10,.075,skin);ell(body,.39,1.83,.16,.095,.14,.075,skin);
 ell(body,-.16,1.79,0,.16,.17,.17,skin);ell(body,.16,1.79,0,.16,.17,.17,skin);
 limb(body,[-.16,1.8,0],[-.17,1.09,.025],.155,.11,skin);limb(body,[-.17,1.09,.025],[-.17,.45,.08],.11,.075,skin);
 limb(body,[.16,1.8,0],[.17,1.09,.025],.155,.11,skin);limb(body,[.17,1.09,.025],[.17,.45,.08],.11,.075,skin);
 ell(body,-.17,.14,.17,.14,.10,.28,black);ell(body,.17,.14,.17,.14,.10,.28,black);
 // Bazowy, nieprześwitujący strój.
 ell(body,0,2.75,.05,.35,.22,.235,cloth);ell(body,0,1.94,.02,.31,.20,.22,cloth);
 const gear=new T.Group();body.add(gear);
 function refreshGear(){while(gear.children.length){const c=gear.children.pop();c.parent=null; if(c.geometry)c.geometry.dispose()}
 const eq=equipment();const armor=!!eq.armor;const rare=/legend|smocz|bosk|królew|krolew/i.test(String(eq.armor?.name||''));const metal=rare?gold:violet;
 if(armor){ell(gear,0,2.63,.075,.39,.46,.25,metal);ell(gear,0,2.22,.08,.30,.18,.22,gold);ell(gear,-.34,2.84,0,.23,.16,.23,gold);ell(gear,.34,2.84,0,.23,.16,.23,gold);cyl(gear,0,1.94,0,.27,.38,.34,metal);ell(gear,0,2.64,.30,.11,.14,.05,gold)}
 if(eq.helmet){ell(gear,0,3.55,.01,.255,.19,.23,steel);cyl(gear,0,3.64,0,.08,.12,.23,gold)}
 if(eq.gloves){limb(gear,[-.45,2.27,.045],[-.38,1.92,.15],.12,.095,metal);limb(gear,[.45,2.27,.045],[.39,1.92,.15],.12,.095,metal)}
 if(eq.pants){limb(gear,[-.16,1.73,.015],[-.17,1.05,.03],.17,.12,metal);limb(gear,[.16,1.73,.015],[.17,1.05,.03],.17,.12,metal)}
 if(eq.boots){limb(gear,[-.17,.72,.07],[-.17,.24,.08],.13,.11,steel);limb(gear,[.17,.72,.07],[.17,.24,.08],.13,.11,steel)}
 if(eq.weapon){const isStaff=/kostur|staff|różdż|rozdz|berł|berl/i.test(String(eq.weapon.name||''));
 // Rękojeść znajduje się bezpośrednio w prawej dłoni.
 if(isStaff){cyl(gear,.39,1.55,.17,.028,.035,2.4,gold);ell(gear,.39,2.79,.17,.15,.17,.15,violet)}else{cyl(gear,.39,1.48,.17,.032,.032,.55,black);cyl(gear,.39,1.79,.17,.19,.19,.045,gold);const blade=new T.Mesh(new T.ConeGeometry(.105,1.15,4),steel);blade.position.set(.39,2.39,.17);blade.rotation.y=Math.PI/4;gear.add(blade)}}
 }
 refreshGear();
 const pedestal=new T.Mesh(new T.CylinderGeometry(1.12,1.25,.12,48),new T.MeshStandardMaterial({color:0x362a25,metalness:.65,roughness:.38}));pedestal.position.y=-.02;scene.add(pedestal);
 function resize(){const w=stage.clientWidth||320,h=stage.clientHeight||440;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 resize();const observer=window.ResizeObserver?new ResizeObserver(resize):null;if(observer)observer.observe(stage);else window.addEventListener('resize',resize);
 let enabled=false,dragging=false,prev=0,degrees=0;
 function apply(){body.rotation.y=degrees*Math.PI/180;angleLabel.textContent=Math.round(Math.abs(degrees))+'°'}
 toggle.addEventListener('click',()=>{enabled=!enabled;toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'✓ Obracaj: WŁ.':'Obracaj: WYŁ.';stage.classList.toggle('can-rotate',enabled);if(!enabled){degrees=0;apply()}});
 stage.addEventListener('pointerdown',e=>{if(!enabled)return;dragging=true;prev=e.clientX;stage.setPointerCapture(e.pointerId)});
 stage.addEventListener('pointermove',e=>{if(!dragging||!enabled)return;degrees=Math.max(-720,Math.min(720,degrees+(e.clientX-prev)*1.05));prev=e.clientX;apply()});
 function stop(){dragging=false}stage.addEventListener('pointerup',stop);stage.addEventListener('pointercancel',stop);
 let alive=true;function draw(){if(!alive)return;renderer.render(scene,camera);requestAnimationFrame(draw)}draw();
 window.addEventListener('storage',e=>{if(e.key===gearKey)refreshGear()});window.addEventListener('focus',refreshGear);
 window.DevilsModel3D={update:refreshGear};
 window.addEventListener('pagehide',()=>{alive=false;observer?.disconnect();renderer.dispose()},{once:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
