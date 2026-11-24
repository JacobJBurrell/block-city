// ---------- ui extras: tabbed settings, first person, flight rocker, Roblox-style mouse and keyboard ----------
const uiDef2={fov:65,shake:1,ac:1,cd:1,fp:0,hud:1,hop:1,nomap:0,bsz:1,jsz:1,dz:.22,vib:1,mus:1,sfxv:1,amb:1,subs:1,cb:0,rm:0,day:20,traf:1,ped:1,diff:1,mph:1,gxScale:1,gxSharp:0,gxShadow:1,gxAO:0,kbcard:0};
for(const k in uiDef2)if(uiS[k]===undefined)uiS[k]=uiDef2[k];
const uiPct=v=>Math.round(v*100)+'%',uiX=v=>v.toFixed(2).replace(/0$/,'')+'x';
Object.assign(uiSl,{fov:{n:'Field of view',min:50,max:100,step:1,f:v=>Math.round(v)+'°'},cd:{n:'Camera distance',min:.6,max:1.8,step:.05,f:uiX},
 hud:{n:'HUD scale',min:.75,max:1.3,step:.05,f:uiPct},hop:{n:'HUD opacity',min:.35,max:1,step:.05,f:uiPct},bsz:{n:'Button size',min:.75,max:1.35,step:.05,f:uiPct},jsz:{n:'Joystick size',min:.75,max:1.35,step:.05,f:uiPct},
 dz:{n:'Joystick dead zone',min:.05,max:.45,step:.01,f:uiPct},mus:{n:'Music and radio',min:0,max:1,step:.05,f:uiPct},sfxv:{n:'Effects and engines',min:0,max:1,step:.05,f:uiPct},amb:{n:'Ambience',min:0,max:1,step:.05,f:uiPct},
 day:{n:'Day length',min:4,max:60,step:1,f:v=>Math.round(v)+' min'},traf:{n:'Traffic density',min:0,max:1,step:.1,f:uiPct},ped:{n:'Pedestrian density',min:0,max:1,step:.1,f:uiPct},gxScale:{n:'Render scale',min:.5,max:1.5,step:.05,f:uiPct}});
const uiSegs={diff:['Difficulty',[[0,'Easy'],[1,'Normal'],[2,'Hard']]],mph:['Speed units',[[1,'mph'],[0,'km/h']]],cb:['Colour-blind mode',[[0,'Off'],[1,'Protan'],[2,'Deutan'],[3,'Tritan']]],gxShadow:['Shadow quality',[[0,'Low'],[1,'Medium'],[2,'High']]]};
const uiGX=()=>typeof gxApply==='function';
let uiTab=uiS.tab||'gfx',uiTcY=0;
function uiSegHtml(k){const d=uiSegs[k];return '<div class="ui-tg"><span>'+d[0]+'</span></div><div class="ui-seg ui-seg'+d[1].length+'">'+d[1].map(o=>'<div class="ui-b'+((uiS[k]|0)===o[0]?' on':'')+'" data-a="seg" data-k="'+k+'" data-v="'+o[0]+'">'+o[1]+'</div>').join('')+'</div>'}
function uiTabHtml(){const T=uiTgHtml,S=uiSlHtml;
 if(uiTab==='gfx')return S('q')+(uiGX()?S('gxScale')+uiSegHtml('gxShadow')+T('gxSharp','Sharpening')+T('gxAO','Ambient occlusion','Soft contact shadows'):'')+T('fps','Show FPS');
 if(uiTab==='ctl')return S('sens')+T('invY','Invert camera Y')+T('lh','Left-handed layout','Swap joystick and buttons')+S('bsz')+S('jsz')+S('dz')+T('vib','Vibration','Where the phone supports it');
 if(uiTab==='cam')return S('fov')+S('cd')+T('fp','Always first person','Or pinch / scroll all the way in')+T('ac','Auto-centre behind vehicles')+T('shake','Camera shake')
  +'<div class="ui-tg"><span>Rotate screen<small>Play in any direction</small></span></div><div class="ui-seg ui-seg4">'+[0,1,3,2].map(m=>'<div class="ui-b'+((uiS.rot|0)===m?' on':'')+'" data-a="rotset" data-k="'+m+'">'+uiRotName[m]+'</div>').join('')+'</div>';
 if(uiTab==='aud')return S('vol')+S('mus')+S('sfxv')+S('amb')+T('subs','Subtitles','Crew and phone dialogue');
 if(uiTab==='play')return uiSegHtml('diff')+S('day')+S('traf')+S('ped')+uiSegHtml('mph');
 return S('hud')+S('hop')+T('nomap','Hide minimap','Open the map with Tab, M or the phone')+uiSegHtml('cb')+T('rm','Reduced motion','Less shake and animation')+T('subs','Subtitles')}
const uiTabs=[['gfx','Graphics'],['ctl','Controls'],['cam','Camera'],['aud','Audio'],['play','Gameplay'],['acc','Accessibility']];
uiRender=function(){const jobs=typeof msPassed!=='undefined'?' &middot; '+msPassed+' jobs':'';
 uiSet.innerHTML='<div class="ui-pan ui-pan2"><div class="ui-hd"><b>'+(uiPrev==='ready'?'SETTINGS':'PAUSED')+'</b><span>$'+cash+' &middot; '+kills+' takedowns &middot; '+coinN+' coins'+jobs+'</span></div>'
  +'<div class="ui-tabs">'+uiTabs.map(t=>'<div class="ui-b'+(uiTab===t[0]?' on':'')+'" data-a="tab" data-k="'+t[0]+'">'+t[1]+'</div>').join('')+'</div>'
  +'<div class="ui-tc"><div class="ui-tci">'+uiTabHtml()+'</div></div>'
  +'<div class="ui-ft">'+(uiPrev==='ready'?'':'<div class="ui-b" data-a="respawn">Reset character</div>')+'<div class="ui-b ui-warn" data-a="wipe">'+(uiConfirm?'Tap again to erase':'Reset saved game')+'</div><div class="ui-b ui-res" data-a="close">'+(uiPrev==='ready'?'Done':'Resume')+'</div></div></div>';
 const tc=uiSet.querySelector('.ui-tc');if(tc)tc.scrollTop=uiTcY};
{const sv=uiSetVal;uiSetVal=function(k,v,live){sv(k,v,live);uiApply2(k)}}
let uiScr=null;
uiSet.addEventListener('touchstart',e=>{const t=e.changedTouches[0],el=e.target&&e.target.closest?e.target.closest('[data-a]'):null,tc=uiSet.querySelector('.ui-tc');
 if(tc&&e.target&&e.target.closest&&e.target.closest('.ui-tc')&&!(el&&el.getAttribute('data-a')==='sl'))uiScr={id:t.identifier,y:t.clientY,s:tc.scrollTop,m:0};
 if(!el)return;const a=el.getAttribute('data-a'),k=el.getAttribute('data-k');
 if(a==='tab'){uiTab=k;uiS.tab=k;uiTcY=0;uiRender()}
 else if(a==='seg'){uiS[k]=+el.getAttribute('data-v');uiApply2(k);uiTcY=tc?tc.scrollTop:0;uiRender();uiSave()}
 else if(a==='tg'){uiApply2(k);uiSave()}
 else if(a==='rotset')uiSave()});
uiSet.addEventListener('touchmove',e=>{if(!uiScr||uiDrag)return;for(const t of e.changedTouches)if(t.identifier===uiScr.id){const tc=uiSet.querySelector('.ui-tc');if(!tc)return;tc.scrollTop=uiScr.s-(t.clientY-uiScr.y);uiTcY=tc.scrollTop}});
{const end=()=>{uiScr=null};uiSet.addEventListener('touchend',end);uiSet.addEventListener('touchcancel',end)}
uiSet.addEventListener('wheel',e=>{const tc=uiSet.querySelector('.ui-tc');if(tc){tc.scrollTop+=e.deltaY;uiTcY=tc.scrollTop}e.stopPropagation()},{passive:true});
// ----- applying settings -----
let uiCBready=false;const uiCBM=(()=>{const S=[null,[.56667,.43333,0,.55833,.44167,0,0,.24167,.75833],[.625,.375,0,.7,.3,0,0,.3,.7],[.95,.05,0,0,.43333,.56667,0,.475,.525]],M=[0,0,0,.7,1,0,.7,0,1],o=[[1,0,0,0,1,0,0,0,1]];
 for(let n=1;n<4;n++){const s=S[n],r=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++){let v=(i===j?1:0);for(let k=0;k<3;k++)v+=M[i*3+k]*((k===j?1:0)-s[k*3+j]);r.push(v)}o.push(r)}return o})();
function uiCB(){try{if(!uiCBready){const m=grade.material,a='gl_FragColor=vec4(col,1.);';if(m.fragmentShader.indexOf(a)<0)return;m.uniforms.cbm={value:new THREE.Matrix3()};m.fragmentShader=m.fragmentShader.replace('void main(){','uniform mat3 cbm;void main(){').replace(a,'col=clamp(cbm*col,0.,1.);'+a);m.needsUpdate=true;uiCBready=true}
 const r=uiCBM[uiS.cb|0];grade.material.uniforms.cbm.value.set(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8])}catch(e){console.log('ui cb',e)}}
function uiApply2(k){const b=document.body,st=b.style;
 if(!k||k==='fov'){cam.fov=uiS.fov;cam.updateProjectionMatrix()}
 if(!k||k==='hud')st.setProperty('--uhs',uiS.hud);if(!k||k==='hop')st.setProperty('--uho',uiS.hop);if(!k||k==='bsz')st.setProperty('--ubs',uiS.bsz);if(!k||k==='jsz')st.setProperty('--ujs',uiS.jsz);
 if(!k||k==='nomap')b.classList.toggle('ui-nomap',!!uiS.nomap);if(!k||k==='rm')b.classList.toggle('ui-rm',!!uiS.rm);
 if(!k||k==='cb'){if(uiS.cb||uiCBready)uiCB()}
 if(!k||k==='subs'){try{stSub.style.display=uiS.subs?'':'none'}catch(e){}}
 if(!k||k==='traf'||k==='ped')uiDensT=0;
 if(!k||k==='mus'||k==='sfxv'||k==='amb'||k==='vol'){uiVolT=0;uiABT=0}
 if(k&&k.indexOf('gx')===0&&uiGX()){try{gxApply(uiS.q)}catch(e){}}}
{const q0=uiApplyQ;uiApplyQ=function(){q0();if(uiGX()){try{gxApply(uiS.q)}catch(e){console.log('gx',e)}}}}
// difficulty and vibration
const uiVib=n=>{if(uiS.vib&&navigator.vibrate){try{navigator.vibrate(n)}catch(e){}}};
{const h0=hurt;hurt=function(n){n*=[.55,1,1.6][uiS.diff|0];if(n>2)uiVib(Math.min(90,18+n*2));h0(n)}}
{const ex=explode;explode=function(p){ex(p);try{if(p.distanceTo(pos)<40)uiVib(70)}catch(e){}}}
// traffic and pedestrian density
let uiDensT=0;function uiDensity(){const want=(arr,f)=>Math.round(arr.length*f);
 const nt=want(traffic,uiS.traf);traffic.forEach((t,i)=>{const hide=i>=nt;if(hide&&(!t.uiHid||!t.dead)){t.uiHid=true;t.dead=true;t.m.visible=false;t.m.position.set(0,-500,0)}else if(!hide&&t.uiHid){t.uiHid=false;t.dead=false;t.m.visible=true}});
 const np=want(peds,uiS.ped);peds.forEach((p,i)=>{const u=p.userData,hide=i>=np;if(hide&&(!p.uiHid||!u.dead)){p.uiHid=true;u.dead=true;u.deadT=9;p.visible=false;p.position.set(9999,-500,9999)}else if(!hide&&p.uiHid){p.uiHid=false;u.dead=false;p.visible=true;p.rotation.x=0}})}
// ----- first person -----
let uiFPWas=false,uiShift=false,uiMouse=!((navigator.maxTouchPoints||0)>0),uiWantLock=false,uiFPk=0,uiFPt=performance.now(),uiFPdur=.42;
// first person is wanted when zoomed all the way in (or always, from settings); it stays on behind menus and the map, so closing them does not glide the camera again
const uiFPst=()=>state==='play'||state==='map'||state==='shop'||state==='cpmenu'||state==='chmenu'||state==='cpdoor'||(state==='settings'&&uiPrev!=='ready')||state.indexOf('st')===0;
const uiFPon=()=>uiFPst()&&(uiS.fp||uiZoomT<=.425);
const uiAimC=()=>state==='play'&&!driving&&(uiFPWas||uiShift);
const uiVM=new THREE.Group();{const gm=new THREE.MeshStandardMaterial({color:0x1d1f23,metalness:.7,roughness:.35}),sk=new THREE.MeshStandardMaterial({color:0xc68642,roughness:.7}),sl=new THREE.MeshStandardMaterial({color:0x2b3442,roughness:.85});
 const add=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);uiVM.add(o);return o};add(new THREE.BoxGeometry(.07,.11,.34),gm,0,0,-.12);add(new THREE.BoxGeometry(.045,.045,.2),gm,0,.035,-.36);add(new THREE.BoxGeometry(.06,.14,.07),gm,0,-.1,0);
 add(new THREE.BoxGeometry(.09,.09,.1),sk,0,-.07,.05);const arm=add(new THREE.BoxGeometry(.11,.11,.45),sl,.02,-.12,.3);arm.rotation.x=.18;uiVM.visible=false;uiVM.scale.setScalar(.72);uiVM.renderOrder=5;scene.add(uiVM)}
function uiEyeOf(c){const m=c.m,u=m.userData,T=c.T;
 if(c.kind==='plane'&&T)return new THREE.Vector3(0,T.cy+T.r*(c.type==='liner'?.35:.62),-T.nose*(c.type==='liner'?.82:.42));
 const p0=m.position.clone(),r0=m.rotation.clone();m.position.set(0,0,0);m.rotation.set(0,0,0);m.updateMatrixWorld(true);const b=new THREE.Box3();
 let rid=null;try{rid=vhRider}catch(x){}const skip=o=>{for(let q=o;q;q=q.parent)if(q===player||q===rid)return true;return false};
 m.traverse(o=>{if(o.isMesh&&o.geometry&&!o.isSkinnedMesh&&!skip(o)){o.geometry.computeBoundingBox&&!o.geometry.boundingBox&&o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);b.union(bb)}});
 m.position.copy(p0);m.rotation.copy(r0);m.updateMatrixWorld(true);const s=m.scale,w=b.max.x-b.min.x,h=b.max.y-b.min.y,d=b.max.z-b.min.z,e=new THREE.Vector3();
 if(c.vhT==='heli')e.set(b.min.x+w*.5,b.min.y+h*.52,b.min.z+d*.2);else if(c.vhBike)e.set(0,b.min.y+1.95,b.min.z+d*.62);else if(c.vhT==='boat')e.set(0,b.max.y+.75,b.min.z+d*.6);
 else e.set(b.min.x+w*.3,b.min.y+Math.min(h*.82,1.35),b.min.z+d*.55);
 e.x/=s.x;e.y/=s.y;e.z/=s.z;return e}
function uiFPCam(){const E=new THREE.Euler(0,0,0,'YXZ');
 if(driving&&driving.m){const c=driving,m=c.m;if(!m.userData.uiEye)m.userData.uiEye=uiEyeOf(c);m.updateMatrixWorld(true);cam.position.copy(m.userData.uiEye).applyMatrix4(m.matrixWorld);
  const yo=((camYaw-m.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;E.set(-(camPitch-.4)*.9,yo,0);cam.quaternion.copy(m.getWorldQuaternion(new THREE.Quaternion())).multiply(new THREE.Quaternion().setFromEuler(E));uiVM.visible=false}
 else{cam.position.set(pos.x-Math.sin(camYaw)*.12,pos.y+1.78,pos.z-Math.cos(camYaw)*.12);E.set(-(camPitch-.3),camYaw,0);cam.quaternion.setFromEuler(E);
  uiVM.visible=true;uiVM.position.copy(cam.position);uiVM.quaternion.copy(cam.quaternion);uiVM.translateX(.19);uiVM.translateY(-.2);uiVM.translateZ(-.5);
  if(fireCD>WEAP[wi].rate*.6)uiVM.translateZ(.04)}
 cam.updateMatrixWorld(true)}
// Roblox-style glide between third and first person: uiFPk runs 0..1 over about 0.4 s, the camera pose is blended between the chase camera
// and the eye, and the character fades out as the camera reaches the head (and back in on the way out)
const uiTPp=new THREE.Vector3(),uiTPq=new THREE.Quaternion(),uiFPp=new THREE.Vector3(),uiFPq=new THREE.Quaternion(),uiFadeL=[];
const uiEase=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
// fade for this render only: each avatar owns its materials, and everything is put back straight after the frame
// (three r147 compiles opaque materials with alpha forced to 1, so switching 'transparent' needs needsUpdate; each material keeps both programs cached)
function uiAlpha(o,a){o.traverseVisible(q=>{if(!q.isMesh)return;const ms=Array.isArray(q.material)?q.material:[q.material];for(const m of ms){if(!m||m.userData.uiFd)continue;m.userData.uiFd=1;uiFadeL.push([m,m.transparent,m.opacity]);if(!m.transparent){m.transparent=true;m.needsUpdate=true}m.opacity=m.opacity*a}})}
function uiAlphaEnd(){for(const f of uiFadeL){const m=f[0];if(m.transparent!==f[1]){m.transparent=f[1];m.needsUpdate=true}m.opacity=f[2];delete m.userData.uiFd}uiFadeL.length=0}
{const cr=composer.render.bind(composer);composer.render=function(a){const fp=uiFPon();
 if(fp!==uiFPWas){uiFPWas=fp;document.body.classList.toggle('ui-fp',fp);if(!fp){camPitch=uiClamp(camPitch,.05,1.3);if(!uiShift)uiUnlock()}else{if(uiMouse&&inKbm&&state==='play')uiLock()}}
 if(uiShift&&!driving&&state==='play'){facing=camYaw;player.rotation.y=camYaw}
 const now=performance.now(),rt=Math.min(.1,(now-uiFPt)/1000);uiFPt=now;
 uiFPk=uiS.rm?(fp?1:0):uiClamp(uiFPk+(fp?rt:-rt)/uiFPdur,0,1);const k=uiEase(uiFPk);
 if(k<=.001){uiVM.visible=false;cr(a);return}
 const full=k>=.995,hid=[],hide=o=>{if(o&&o.visible){o.visible=false;hid.push(o)}};
 uiTPp.copy(cam.position);uiTPq.copy(cam.quaternion);uiFPCam();
 if(full){hide(player);try{hide(vhRider)}catch(e){}hide(arrow);hide(box)}
 else{uiFPp.copy(cam.position);uiFPq.copy(cam.quaternion);cam.position.copy(uiTPp).lerp(uiFPp,k);cam.quaternion.copy(uiTPq).slerp(uiFPq,k);cam.updateMatrixWorld(true);uiVM.visible=false;
  const al=1-uiClamp((k-.35)/.55,0,1);if(al<.03)hide(player);else if(al<1)uiAlpha(player,al);if(al<.5){try{hide(vhRider)}catch(e){}hide(arrow);hide(box)}}
 try{cr(a)}finally{for(const o of hid)o.visible=true;uiAlphaEnd();if(!full){cam.position.copy(uiTPp);cam.quaternion.copy(uiTPq);cam.updateMatrixWorld(true)}}}}
function uiCentreTgt(){const cx=innerWidth/2,cy=innerHeight/2;let best=null,bs=1;
 for(const t of allTargets()){if(Math.hypot(t.p.x-pos.x,t.p.z-pos.z)>85)continue;const p=t.p.clone().project(cam);if(p.z>1)continue;const d=Math.hypot((p.x+1)/2*innerWidth-cx,(1-p.y)/2*innerHeight-cy),dc=Math.max(1,t.p.distanceTo(cam.position)),thr=16+((t.kind==='ped'||t.kind==='sh')?.9:2)*innerHeight/(1.27*dc);if(d/thr<bs){bs=d/thr;best=t}}return best}
{const ft=findTarget;findTarget=function(){if(uiAimC())return uiCentreTgt();return ft()}}
{const sh=shoot;shoot=function(){if(uiAimC()&&state==='play'){const t=uiCentreTgt();if(!t){const d=new THREE.Vector3(0,0,-1).applyQuaternion(cam.quaternion);let k=75;if(d.y<-.01)k=Math.min(75,(cam.position.y-.2)/-d.y);tapPt=cam.position.clone().addScaledVector(d,k);tapT=.25}}sh()}}
{const ts=tapShoot;tapShoot=function(x,y){if(uiAimC()){lockObj=null;burstN=WEAP[wi].rate<.2?4:1;return}ts(x,y)}}
// ----- flight rocker: UP / DOWN well away from the exit button -----
const uiRk=document.createElement('div');uiRk.id='uiRk';uiRk.innerHTML='<div data-r="u"><i></i><span>UP</span></div><div data-r="d"><i></i><span>DOWN</span></div>';document.body.appendChild(uiRk);
const uiRkT=new Map();let uiRkU=false,uiRkD=false,uiAirS=null;
function uiRkAt(t){const r=uiRk.getBoundingClientRect();return t.clientY<r.top+r.height/2?'u':'d'}
uiRk.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();for(const t of e.changedTouches)uiRkT.set(t.identifier,uiRkAt(t))},{passive:false});
uiRk.addEventListener('touchmove',e=>{e.stopPropagation();for(const t of e.changedTouches)if(uiRkT.has(t.identifier))uiRkT.set(t.identifier,uiRkAt(t))});
{const end=e=>{e.stopPropagation();for(const t of e.changedTouches)uiRkT.delete(t.identifier);if(!e.touches||!e.touches.length)uiRkT.clear()};uiRk.addEventListener('touchend',end);uiRk.addEventListener('touchcancel',end)}
function uiRkTick(dt){const c=driving,heli=!!(c&&c.vhT==='heli'),plane=!!(c&&c.kind==='plane'),air=state==='play'&&(heli||plane);
 const s=air?(heli?'h':'p'):'';if(s!==uiAirS){uiAirS=s;document.body.classList.toggle('ui-air',air);uiRkT.clear();const sp=uiRk.querySelectorAll('span');sp[0].textContent=plane?'THROTTLE':'UP';sp[1].textContent=plane?'IDLE':'DOWN'}
 let u=false,d=false;for(const v of uiRkT.values()){if(v==='u')u=true;else d=true}
 const vj=typeof vhJump!=='undefined',vd=typeof vhDown!=='undefined',ak=typeof apKey!=='undefined';
 if(heli){if(u&&vj)vhJump=true;else if(uiRkU&&vj)vhJump=false;if(d&&vd)vhDown=true;else if(uiRkD&&vd)vhDown=false}
 else if(plane){if(u&&ak)apKey=true;else if(uiRkU&&ak)apKey=false;if(d)c.thr=Math.max(0,c.thr-dt*1.4)}
 else{if(uiRkU){if(vj)vhJump=false;if(ak)apKey=false}if(uiRkD&&vd)vhDown=false}
 uiRkU=u;uiRkD=d;uiRk.classList.toggle('u',u);uiRk.classList.toggle('d',d)}
// ----- speedometer (mph / km/h) -----
const uiSpd=document.createElement('div');uiSpd.id='uiSpd';document.body.appendChild(uiSpd);let uiSpdS='';
// ----- Roblox-style mouse and keyboard -----
const uiPL=()=>document.pointerLockElement||null;
function uiLock(){if(uiPL())return;uiWantLock=true;try{const el=document.body,r=el.requestPointerLock&&el.requestPointerLock();if(r&&r.catch)r.catch(()=>{})}catch(e){}}
function uiUnlock(){uiWantLock=false;try{if(uiPL()&&document.exitPointerLock)document.exitPointerLock()}catch(e){}}
document.addEventListener('pointerlockchange',()=>{document.body.classList.toggle('ui-locked',!!uiPL());if(!uiPL()&&uiWantLock&&state==='play'&&(uiShift||uiFPWas)){uiWantLock=false;setTimeout(()=>{if(!uiOpen&&state==='play')uiOpenSet()},60)}});
let uiRMB=false,uiLMB=false,uiHkR=false,uiHkT=0,uiRelock=false,uiTchT=-1e9;
addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')uiTchT=performance.now()},true);
const uiMv=(mx,my)=>inRot===1?[my,-mx]:(inRot===2?[-my,mx]:(inRot===3?[-mx,-my]:[mx,my]));
function uiLook(dx,dy,k){camYaw-=dx*k*uiSens;const lo=uiFPWas?-1.05:.05,hi=uiFPWas?1.6:1.3;camPitch=uiClamp(camPitch+dy*k*.8*uiSens*uiInvY,lo,hi)}
// mouse, Roblox-style: a left press on any on-screen element (button, menu, phone, map...) is a normal click and goes on to the element as a touch;
// a left press on the 3D world while playing shoots (hold to keep firing); the right button held down turns the camera; the middle button does nothing
const uiWorldEl=t=>!t||t===renderer.domElement||t===document.body||t===document.documentElement;
const uiFree=()=>state==='play'&&!uiOpen&&!(typeof stPhOpen!=='undefined'&&stPhOpen)&&!(typeof lfIntro!=='undefined'&&lfIntro);
// called by input/adapter.js before it turns a mouse press into a touch: returns true when the press is ours
function inMouseHook(e){const ty=e.type,down=ty==='pointerdown'||ty==='mousedown',up=ty==='pointerup'||ty==='mouseup',now=performance.now();
 if(ty!=='pointerdown'&&now-uiTchT<900)return false;   // mouse events a phone makes up after a tap are not a mouse
 uiMouse=true;
 if(ty==='mousedown'&&e.button===0&&now-uiHkT<300)return uiHkR;   // the same press already seen as a pointerdown
 let r=false;
 if(e.button===2){if(down&&uiFree()){uiRMB=true;document.body.classList.add('ui-rmb');try{if(ty==='pointerdown'&&e.target&&e.target.setPointerCapture)e.target.setPointerCapture(e.pointerId)}catch(x){}}if(up){uiRMB=false;document.body.classList.remove('ui-rmb')}r=true}
 else if(e.button===1){if(e.cancelable)e.preventDefault();r=true}
 else if(e.button===0&&down){const lk=!!uiPL();if(lk?uiFree():(uiFree()&&uiWorldEl(e.target))){if((uiShift||uiFPWas)&&!lk)uiLock();uiLMB=true;fireId='mL';if(!uiAimC())tapShoot(inX(e),inY(e));r=true}}
 else if(e.button===0&&up&&uiLMB){uiLMB=false;if(fireId==='mL')fireId=null;r=true}
 if(ty==='pointerdown'&&e.button===0){uiHkR=r;uiHkT=now}return r}
addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')return;if(e.button===2){uiRMB=false;document.body.classList.remove('ui-rmb')}if(e.button===0&&uiLMB){uiLMB=false;if(fireId==='mL')fireId=null}},true);
addEventListener('mousemove',e=>{if(!uiFree())return;const lock=!!uiPL();if(!(uiRMB||lock||uiAimC()))return;const m=uiMv(e.movementX||0,e.movementY||0);if(!m[0]&&!m[1])return;uiLook(m[0],m[1],lock||uiAimC()?.0032:.006)});
// a left-button drag on the world never turns the camera (that is the right button's job)
addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.pt==='mouse'&&look.id===t.identifier){look.x=t.clientX;look.y=t.clientY}},true);
// scroll wheel: smooth zoom; all the way in is first person (a mouse notch is about 12%, a touchpad scrolls finer)
addEventListener('wheel',e=>{if(uiOpen||state!=='play'||(typeof mpOpen!=='undefined'&&mpOpen))return;const t=e.target;if(t&&t.closest&&t.closest('#uiSet,#chOv,#mpWrap,#stPhone,.st-p,#msMenu,#uiTitle'))return;
 const d=e.deltaY*(e.deltaMode===1?33:(e.deltaMode===2?400:1));if(d)uiZoomBy(Math.exp(uiClamp(d,-240,240)*.0011))},{passive:true});
let uiEsyn=null;
function uiCarTouch(down){const el=$('car'),r=el.getBoundingClientRect();if(!r.width){if(down)carQ=true;return}const t={identifier:'kbE',pt:'key',clientX:r.left+r.width/2,clientY:r.top+r.height/2,pageX:0,pageY:0,target:el};
 if(down){uiEsyn=t}else{if(!uiEsyn)return;uiEsyn=null}const ev=new Event(down?'touchstart':'touchend',{bubbles:true,cancelable:true});ev.inSyn=true;ev.changedTouches=[t];ev.touches=down?[t]:[];ev.targetTouches=ev.touches;el.dispatchEvent(ev)}
addEventListener('keydown',e=>{const k=e.key,lk=k.toLowerCase();if(e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]'))return;uiMouse=true;if(e.repeat&&k!=='i'&&k!=='o')return;
 if(state==='ready'&&(lk==='enter'))return;
 if(k==='Shift'&&state==='play'){uiShift=!uiShift;document.body.classList.toggle('ui-sl',uiShift);if(uiShift)uiLock();else if(!uiFPWas)uiUnlock();toast(uiShift?'Shift lock ON':'Shift lock OFF')}
 else if(lk==='i')uiZoomBy(.86);else if(lk==='o')uiZoomBy(1.16);
 else if(lk==='e'&&state==='play')uiCarTouch(true);
 else if(k==='Tab'||(lk==='m'&&!e.ctrlKey&&!e.metaKey&&!e.altKey)){e.preventDefault();if(typeof mpToggle==='function')mpToggle();else if(typeof fxToggleMap==='function')fxToggleMap()}
 else if(k==='Control'&&typeof vhDown!=='undefined')vhDown=true;
 else if(k>='1'&&k<='4'&&state==='play'){const n=+k-1;if(driving&&driving.jt&&typeof jtMode!=='undefined'){jtMode=n===1?1:0;toast(jtMode?'MISSILES':'CANNON')}else if(WEAP[n]&&WEAP[n].ammo>0){wi=n;toast(WEAP[n].n);beep(900,.06,.1)}else toast('No ammo for '+(WEAP[n]?WEAP[n].n:'that'))}});
addEventListener('keyup',e=>{const lk=e.key.toLowerCase();if(lk==='e')uiCarTouch(false);if(e.key==='Control'&&typeof vhDown!=='undefined')vhDown=false});
addEventListener('blur',()=>{if(uiEsyn)uiCarTouch(false);uiRMB=false;if(fireId==='mL')fireId=null});
// title: keyboard and mouse card (shown instead of the touch hints while the keyboard or mouse is in use)
{const ts0=uiTitleSync;uiTitleSync=function(){ts0();const d=document.createElement('div');d.className='ui-kbc';
 d.innerHTML='<b>Keyboard and mouse</b><div><span>WASD &middot; &uarr;&darr;</span>Move</div><div><span>&larr; &rarr;</span>Turn camera</div><div><span>Right drag</span>Look</div><div><span>Wheel</span>Zoom &middot; 1st person</div><div><span>Shift</span>Shift lock</div><div><span>Space</span>Jump</div><div><span>Click</span>Shoot</div><div><span>E</span>Vehicle</div><div><span>1-4 &middot; Q</span>Weapons</div><div><span>Tab &middot; M</span>Map</div><div><span>T</span>Phone</div><div><span>Esc</span>Menu</div>';
 const k=uiTitle.querySelector('.ui-keys');if(k)k.replaceWith(d);else uiTitle.appendChild(d)};uiTitleSync()}
// ----- per frame -----
let uiAB=null,uiABT=0;
MODS.push(function(dt){
 // zoom glide (wheel, I/O and settings set uiZoomT; pinch sets both)
 uiZoom+=(uiZoomT-uiZoom)*Math.min(1,dt*13);if(Math.abs(uiZoomT-uiZoom)<.002)uiZoom=uiZoomT;
 // pointer lock only while actually playing: menus, the map, the phone and shops get a free cursor, and it comes back afterwards
 {const want=(uiShift||uiFPWas)&&uiFree()&&!(typeof chOpenF!=='undefined'&&chOpenF);if(uiPL()&&!want){uiUnlock();uiRelock=uiShift||uiFPWas}else if(!uiPL()&&want&&uiRelock){uiRelock=false;uiLock()}if(!uiShift&&!uiFPWas)uiRelock=false}
 if(!uiS.shake||uiS.rm)shake=0;
 uiDensT-=dt;if(uiDensT<=0){uiDensT=1.5;try{uiDensity()}catch(e){}}
 uiABT-=dt;if(uiABT<=0&&typeof auBus!=='undefined'&&auBus&&auBus.fx){uiABT=.5;if(!uiAB){uiAB={};for(const k in auBus)uiAB[k]=auBus[k].gain.value}for(const k in auBus){const f=k==='radio'?uiS.mus:(k==='amb'?uiS.amb:uiS.sfxv);auBus[k].gain.value=uiAB[k]*f}}
 uiRkTick(dt);
 const c=driving,ground=c&&state==='play'&&c.kind!=='plane'&&c.vhT!=='heli';let t='';if(ground){const v=Math.abs(c.speed||0);t=Math.round(uiS.mph?v*2.237:v*3.6)+'<small>'+(uiS.mph?'MPH':'KM/H')+'</small>'}
 if(t!==uiSpdS){uiSpdS=t;uiSpd.innerHTML=t;uiSpd.style.display=t?'block':'none'}});
// ----- styles -----
{const st=document.createElement('style');st.textContent=[
 'body{--uhs:1;--uho:1;--ubs:1;--ujs:1}',
 '#uiCard,#hud,#stars,#bars,#mission,#map,#uiGear,#uiRotB,#radio{zoom:var(--uhs)}#uiCard,#hud,#stars,#bars,#mission,#map,.btn,#stick,#uiGear,#radio,#uiRotB,#uiRk,#uiSpd{opacity:var(--uho)}',
 '.btn{scale:var(--ubs)}#stick{scale:var(--ujs)}body.ui-nomap #map{display:none!important}',
 'body.ui-rm *,body.ui-rm *::before,body.ui-rm *::after{animation:none!important;transition:none!important}',
 '#uiRotB{left:auto!important;right:calc(var(--sr) + 108px)!important;top:calc(var(--st) + 104px)!important}',
 '.ui-pan2{max-height:calc(100% - 20px);display:flex;flex-direction:column}.ui-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:2px 0 8px}.ui-tabs .ui-b{height:30px;padding:0 11px;font-size:9.5px;letter-spacing:.8px;border:1px solid var(--gb);background:rgba(255,255,255,.05);color:#fff}.ui-tabs .ui-b.on{background:var(--ac);color:#14161c;border-color:transparent}',
 '.ui-tc{overflow:hidden;max-height:min(54vh,420px);flex:1 1 auto;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08)}.ui-tci{padding:2px 2px 6px}body.ui-l .ui-tci{display:grid;grid-template-columns:1fr 1fr;column-gap:22px;align-items:start}body.ui-l .ui-tc{max-height:min(48vh,250px)}',
 '.ui-seg2{grid-template-columns:repeat(2,1fr)!important}.ui-seg3{grid-template-columns:repeat(3,1fr)!important}.ui-seg4{grid-template-columns:repeat(4,1fr)!important}',
 'body.ui-fp #xh,body.ui-sl #xh{top:50%!important;display:block!important}body.ui-fp #lock{border-radius:50%}body.ui-locked{cursor:none}',
 '#uiRk{position:fixed;display:none;z-index:6;width:72px;height:176px;border-radius:36px;border:1px solid var(--gb);background:rgba(16,18,26,.5);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);overflow:hidden;flex-direction:column;right:calc(var(--sr) + 16px);bottom:calc(var(--sb) + 22px);box-shadow:0 8px 24px rgba(0,0,0,.35)}',
 '#uiRk div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#fff;font-size:9px;font-weight:800;letter-spacing:1px}#uiRk div+div{border-top:1px solid rgba(255,255,255,.14)}#uiRk i{width:24px;height:24px;background:center/contain no-repeat}',
 '#uiRk div:first-child i{background-image:'+uiIc(uiI.up)+'}#uiRk div:last-child i{background-image:'+uiIc(uiI.down)+'}#uiRk.u div:first-child,#uiRk.d div:last-child{background:rgba(255,210,63,.3)}',
 'body.ui-air #uiRk{display:flex}html body.ui-air.ui-air:not(.ui-zz) #jump,html body.ui-air.ui-air:not(.ui-zz) #vhdn{display:none!important}',
 'html body.ui-air.ui-air:not(.ui-lh) #fire{right:calc(var(--sr) + 104px)!important;bottom:calc(var(--sb) + 28px)!important;width:88px!important;height:88px!important}html body.ui-air.ui-air:not(.ui-lh) #wpn{right:calc(var(--sr) + 118px)!important;bottom:calc(var(--sb) + 128px)!important;width:58px!important;height:58px!important}',
 'body.ui-air.ui-lh #uiRk{right:auto;left:calc(var(--sl) + 16px)}html body.ui-air.ui-air.ui-lh #fire{left:calc(var(--sl) + 104px)!important;bottom:calc(var(--sb) + 28px)!important;width:88px!important;height:88px!important}html body.ui-air.ui-air.ui-lh #wpn{left:calc(var(--sl) + 118px)!important;bottom:calc(var(--sb) + 128px)!important;width:58px!important;height:58px!important}',
 'html body.ui-air.ui-air:not(.ui-zz) #car{top:calc(var(--st) + 128px)!important;bottom:auto!important;left:calc(var(--sl) + 14px)!important;right:auto!important;width:50px!important;height:50px!important;font-size:7.5px!important}',
 '#uiSpd{position:fixed;display:none;left:50%;transform:translateX(-50%);bottom:calc(var(--sb) + 10px);z-index:4;color:#fff;font-weight:800;font-size:26px;line-height:1;text-align:center;text-shadow:0 2px 8px rgba(0,0,0,.6);pointer-events:none;font-variant-numeric:tabular-nums}#uiSpd small{display:block;font-size:8.5px;letter-spacing:2px;opacity:.75;margin-top:2px}body.ui-title #uiSpd,body.ui-title #uiRk{display:none!important}',
 // keyboard and mouse in use (input/adapter.js sets body.in-kbm): no touch controls, key hints instead, pointer cursors on everything clickable
 'html body.in-kbm.in-kbm #stick,html body.in-kbm.in-kbm #fire,html body.in-kbm.in-kbm #jump,html body.in-kbm.in-kbm #vhdn,html body.in-kbm.in-kbm #uiRk,html body.in-kbm.in-kbm #car:not([data-s=DRIVE]):not([data-s=STEAL]){display:none!important}',
 'body.in-kbm #car::after,body.in-kbm #wpn::after{position:absolute;top:-5px;right:-5px;min-width:19px;height:19px;padding:0 4px;box-sizing:border-box;border-radius:6px;background:#fff;color:#14161c;font-size:11px;font-weight:900;line-height:19px;text-align:center;letter-spacing:0;box-shadow:0 2px 6px rgba(0,0,0,.4)}body.in-kbm #car::after{content:"E"}body.in-kbm #wpn::after{content:"Q"}',
 'body.in-kbm #uiTitle .ui-ctl,body:not(.in-kbm) #uiTitle .ui-kbc{display:none}',
 'body.in-kbm .btn,body.in-kbm #uiGear,body.in-kbm #uiRotB,body.in-kbm #radio,body.in-kbm #map,body.in-kbm #chBtn,body.in-kbm .ui-b,body.in-kbm .ui-pm,body.in-kbm .ui-tr,body.in-kbm .ui-tg,body.in-kbm [data-a],body.in-kbm [data-k],body.in-kbm [data-mc],body.in-kbm .mpB{cursor:pointer}body.ui-rmb,body.ui-rmb *{cursor:none!important}',
 '.ui-kbc{display:grid;grid-template-columns:repeat(4,auto);gap:6px 14px;max-width:560px;padding:10px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(10,12,18,.72);font-size:9.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.ui-kbc b{grid-column:1/-1;font-size:9px;letter-spacing:.3em;opacity:.6}.ui-kbc span{display:inline-block;margin-right:6px;padding:2px 6px;border-radius:6px;border:1px solid rgba(255,255,255,.3);font-size:9px;opacity:.9}body.ui-p .ui-kbc{grid-template-columns:repeat(2,auto)}'
 ].join('');document.head.appendChild(st)}
uiApply2();
