// Block City v6 (controls now work with touch, mouse and keyboard, inside embeds too): real 3D model files for nearby cars and people, motorcycles, helicopters, boats, parachute, missions, shops, radio, districts, street detail
// Model credits: sports car by vicent091036 (CC BY); characters from mixamo.com and readyplayer.me, via the three.js examples repository.
// FIRE (red) auto-aims and shoots. Shoot cars to blow them up.
// Joystick (left) to walk or drive, drag right side to look, JUMP to jump, CAR to get in or out.
// Do delivery missions for cash, collect coins, explore the city through day and night.
// Needs internet the first time to load the 3D engine (three.js).
let html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<style>*{touch-action:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}html{overscroll-behavior:none}html,body{margin:0;height:100%;background:#000;overflow:hidden;touch-action:none;-webkit-user-select:none;font-family:-apple-system,sans-serif}
canvas#g{display:block;position:fixed;top:0;left:0;width:100vw;height:100vh}
#hud{position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);left:12px;color:#fff;font-weight:800;font-size:17px;text-shadow:0 2px 4px #000a;pointer-events:none;line-height:1.5}
#cash{color:#6dff8a;font-size:24px}
#map{position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);right:10px;width:130px;height:130px;border-radius:50%;border:3px solid #fffa;background:#0008}
#stick{position:fixed;left:26px;bottom:calc(env(safe-area-inset-bottom,0px) + 26px);width:130px;height:130px;border-radius:50%;background:#fff2;border:3px solid #fff8}
#knob{position:absolute;left:40px;top:40px;width:50px;height:50px;border-radius:50%;background:#fffc}
.btn{position:fixed;width:84px;height:84px;border-radius:50%;background:#ffffff38;border:3px solid #fffa;color:#fff;font-weight:900;font-size:16px;display:flex;align-items:center;justify-content:center}
#jump{right:24px;bottom:calc(env(safe-area-inset-bottom,0px) + 30px)}
#car{right:120px;bottom:calc(env(safe-area-inset-bottom,0px) + 70px);background:#ffcc3360}
#mission{position:fixed;top:calc(env(safe-area-inset-top,0px) + 118px);left:12px;max-width:200px;color:#fff;font-weight:700;font-size:14px;text-align:left;text-shadow:0 2px 4px #000;pointer-events:none}
#msg{position:fixed;top:22%;left:0;right:0;text-align:center;color:#fff;text-shadow:0 2px 8px #000;pointer-events:none}
#msg h1{font-size:42px;margin:0}#msg p{font-size:16px;margin:6px}
#fire{right:20px;bottom:calc(env(safe-area-inset-bottom,0px) + 130px);width:96px;height:96px;background:#ff3b3060}
#xh{position:fixed;left:50%;top:45%;width:26px;height:26px;margin:-13px;border:2px solid #fffc;border-radius:50%;pointer-events:none}
#lock{position:fixed;width:44px;height:44px;margin:-22px;border:3px solid #ff3b30;border-radius:8px;pointer-events:none;display:none}
#kills{color:#ff8a80}
#stars{position:fixed;top:calc(env(safe-area-inset-top,0px) + 4px);left:50%;margin-left:-80px;width:160px;text-align:center;font-size:22px;letter-spacing:2px;text-shadow:0 2px 4px #000;pointer-events:none}
#bars{position:fixed;top:calc(env(safe-area-inset-top,0px) + 34px);left:50%;margin-left:-80px;width:160px;pointer-events:none}
#bars>div{height:8px;border-radius:4px;background:#0007;margin-bottom:4px;overflow:hidden;border:1px solid #fff5}
#hpb{height:100%;background:#4cff6a;width:100%}#arb{height:100%;background:#4aa3ff;width:0}
#wpn{right:122px;bottom:calc(env(safe-area-inset-bottom,0px) + 168px);width:78px;height:78px;font-size:12px;text-align:center;line-height:1.2;background:#0006}
#wpn small{font-size:15px}
#dmg{position:fixed;inset:0;pointer-events:none;opacity:0;background:radial-gradient(ellipse at center,transparent 45%,#ff000099 100%)}
@media (orientation:portrait){#stars,#bars{left:auto;right:150px;margin-left:0;width:118px}#stars{font-size:19px;letter-spacing:0}}
#toast{position:fixed;top:40%;left:0;right:0;text-align:center;color:#fff;font-weight:900;font-size:26px;text-shadow:0 2px 8px #000;opacity:0;transition:opacity .3s;pointer-events:none}</style></head>
<body><div id="hud"><div id="cash">$0</div><div id="cn">● 0</div><div id="clock"></div><div id="kills">✖ 0</div></div><div id="xh"></div><div id="dmg"></div><div id="stars"></div><div id="bars"><div><div id="hpb"></div></div><div><div id="arb"></div></div></div><div id="lock"></div>
<canvas id="map" width="260" height="260"></canvas><div id="mission"></div>
<div id="stick"><div id="knob"></div></div><div id="jump" class="btn">JUMP</div><div id="car" class="btn">CAR</div><div id="fire" class="btn">FIRE</div><div id="wpn" class="btn">PISTOL</div><div id="toast"></div>
<div id="uiBoot"><style>#uiBoot{position:fixed;left:0;top:0;right:0;bottom:0;z-index:90;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 42%,#1b2230 0%,#07090e 68%,#030406 100%);color:#e8ecf1;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;transition:opacity .45s ease;pointer-events:none}#uiBoot~#msg{display:none}#uiBoot b{font-size:clamp(34px,9vw,76px);font-weight:800;letter-spacing:.2em;margin-right:-.2em;line-height:1;text-align:center}#uiBoot div{width:150px;height:1px;margin:16px 0 12px;background:linear-gradient(90deg,transparent,#ffd23f,transparent)}#uiBoot small{font-size:10px;font-weight:700;letter-spacing:.42em;margin-right:-.42em;opacity:.55;animation:uiBootP 1.4s ease-in-out infinite}#uiBoot i{font-style:normal;font-size:11px;margin-top:14px;opacity:0;animation:uiBootL 0s 25s forwards}@keyframes uiBootP{50%{opacity:.25}}@keyframes uiBootL{to{opacity:.6}}</style><b>BLOCK CITY</b><div></div><small>LOADING</small><i>Still loading. The first visit needs an internet connection.</i></div><div id="msg"><h1>BLOCK CITY</h1><p style="opacity:.7;font-size:12px">version 20</p><p>Walk or drive with the joystick, drag right side to look</p><p><b>Tap any person or car to lock on and shoot.</b> FIRE auto-aims only at cops and gangs who are after you</p><p>Tap the minimap to expand it. Gun button switches weapons</p><p>CAR steals any car: parked, moving, even cop cars</p><p>Crimes bring police. Purple gang owns the southeast. Grab glowing crates</p><p>CAR gets you in and out. Follow the beam for delivery jobs</p><p style="opacity:.8">Keyboard: WASD move, drag to look, click to shoot, Space jump, E car, F fire, Q weapon, M map</p><p><b>Tap anywhere to start</b></p></div>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/utils/BufferGeometryUtils.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/shaders/CopyShader.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/shaders/LuminosityHighPassShader.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/shaders/FXAAShader.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/postprocessing/EffectComposer.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/postprocessing/RenderPass.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/postprocessing/ShaderPass.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/postprocessing/UnrealBloomPass.js"><\/script>
<script>
if(!window.THREE){document.getElementById('msg').innerHTML='<h1>No internet</h1><p>Connect once so the 3D engine can load.</p>'}else{
THREE.ColorManagement.legacyMode=false;const $=id=>document.getElementById(id);
// ---------- input adapter: one input path (Pointer Events) for touch, mouse and pen, so controls work inside embeds and on desktop ----------
let inRot=0,inRW=0,inRH=0;const inW=()=>inRW||document.documentElement.clientWidth,inH=()=>inRH||document.documentElement.clientHeight,inX=e=>inRot===1?e.clientY:(inRot===2?inH()-e.clientY:(inRot===3?inW()-e.clientX:e.clientX)),inY=e=>inRot===1?inW()-e.clientX:(inRot===2?e.clientX:(inRot===3?inH()-e.clientY:e.clientY)); // 0 normal, 1 left (90), 2 right (270), 3 upside down (180) // rotate-screen mode maps real screen points into the rotated game space
const inTxt=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]');
// last input type (like Roblox): keyboard or mouse hides the on-screen touch controls (body.in-kbm), a finger on the screen brings them back
// inTchT: time of the last finger or pen event; inFing: finger/pen pointers that are down right now. On a touchscreen laptop both a mouse and fingers exist,
// and Chrome follows a tap with made-up mouse events (mousemove, mousedown, mouseup, click, or contextmenu after press-and-hold): those must never count as a mouse.
let inKbm=false,inMvAcc=0,inMvT=-1e9,inTchT=-1e9;const inFing=new Set();
function inSetKbm(on){inMvAcc=0;if(on===inKbm&&document.body.classList.contains('in-kbm')===on)return;inKbm=on;document.body.classList.toggle('in-kbm',on)}
inSetKbm(!((navigator.maxTouchPoints||0)>0));
{const W=window,o={capture:true,passive:true};
 for(const ty of['pointerdown','pointermove','pointerup','pointercancel'])W.addEventListener(ty,e=>{if(e.pointerType==='mouse')return;inTchT=performance.now();if(ty==='pointerdown')inFing.add(e.pointerId);else if(ty!=='pointermove')inFing.delete(e.pointerId)},o);
 for(const ty of['touchstart','touchmove','touchend','touchcancel'])W.addEventListener(ty,e=>{if(e.inSyn)return;inTchT=performance.now();if(ty!=='touchmove'&&e.touches&&!e.touches.length)inFing.clear()},o);
 W.addEventListener('blur',()=>inFing.clear());
 W.addEventListener('pointerdown',e=>{if(!e.isTrusted)return;if(e.pointerType==='mouse'){if(performance.now()-inTchT>1500)inFing.clear();inSetKbm(true)}else if(e.pointerType==='touch'||e.pointerType==='pen')inSetKbm(false)},o);
 // the mouse has to really travel (40px in one go) to take over, and never while a finger is on the screen or has just left it
 W.addEventListener('pointermove',e=>{if(!e.isTrusted||e.pointerType!=='mouse'||inKbm)return;const n=performance.now();if(inFing.size||n-inTchT<600){inMvAcc=0;return}if(n-inMvT>700)inMvAcc=0;inMvT=n;inMvAcc+=Math.abs(e.movementX||0)+Math.abs(e.movementY||0);if(inMvAcc>40)inSetKbm(true)},o);
 W.addEventListener('touchstart',e=>{if(e.isTrusted)inSetKbm(false)},o);
 // pinching on a laptop touchpad arrives as ctrl+wheel: keep the browser from zooming the whole page (the game still gets the wheel and zooms the camera)
 W.addEventListener('wheel',e=>{if(e.ctrlKey&&e.cancelable&&!inTxt(e))e.preventDefault()},{capture:true,passive:false});
 W.addEventListener('wheel',e=>{if(e.isTrusted)inSetKbm(true)},o);
 W.addEventListener('keydown',e=>{if(e.isTrusted&&!inTxt(e))inSetKbm(true)},true)}
if(window.PointerEvent){const act=new Map(),W=window,fire=(type,t,tgt)=>{const ev=new Event(type,{bubbles:true,cancelable:true});ev.inSyn=true;ev.changedTouches=[t];ev.touches=Array.from(act.values());ev.targetTouches=ev.touches;(tgt&&tgt.isConnected?tgt:document.body).dispatchEvent(ev)};
 const wake=()=>{try{if(AC&&AC.state==='suspended')AC.resume()}catch(e){}};
 const drop=(id,ty)=>{const t=act.get(id);if(!t)return;act.delete(id);fire(ty||'touchend',t,t.target)};
 // release everything that matches: a missed "finger up" must never leave a control stuck
 const dropAll=f=>{for(const t of Array.from(act.values()))if(!f||f(t))drop(t.identifier,'touchcancel')};
 // Pointer lock (shift lock, first person with the mouse): Chrome then reports every finger at the locked mouse position, on the locked element, so pointer events are useless for it.
 // A finger that comes down while locked releases the lock and is followed through the real touch events instead (they keep the true position); these get ids 'T0','T1'...
 let lkN=0,lkT=-1e9;const unlock=()=>{try{if(typeof uiUnlock==='function')uiUnlock();else if(document.exitPointerLock)document.exitPointerLock()}catch(x){}},at=c=>{const el=document.elementFromPoint(c.clientX,c.clientY);return el||document.body};
 for(const ty of['touchstart','touchmove','touchend','touchcancel'])W.addEventListener(ty,e=>{if(e.inSyn)return;if(inTxt(e))return;e.stopImmediatePropagation();if(e.cancelable)e.preventDefault();
  if(e.isTrusted&&e.changedTouches)for(const c of Array.from(e.changedTouches)){const k='T'+c.identifier,t=act.get(k);
   if(ty==='touchstart'){if(t||!(lkN>0&&performance.now()-lkT<250))continue;lkN--;const n={identifier:k,pt:'touch',lk:1,clientX:inX(c),clientY:inY(c),pageX:inX(c),pageY:inY(c),target:at(c)};act.set(k,n);fire('touchstart',n,n.target)}
   else if(t){t.clientX=inX(c);t.clientY=inY(c);t.pageX=t.clientX;t.pageY=t.clientY;if(ty==='touchmove')fire('touchmove',t,t.target);else drop(k,ty)}}
  if(ty==='touchend'||ty==='touchcancel'){wake();const left=e.touches?e.touches.length:0,mine=Array.from(act.values()).filter(t=>t.pt!=='mouse');
   if(left===0)dropAll();else if(mine.length>left){const c=e.changedTouches&&e.changedTouches[0];mine.sort((a,b)=>c?(Math.hypot(a.clientX-inX(c),a.clientY-inY(c))-Math.hypot(b.clientX-inX(c),b.clientY-inY(c))):0);for(let i=0;i<mine.length-left;i++)drop(mine[i].identifier)}}},{capture:true,passive:false});
 let lastP=-1e9;const mt=e=>({identifier:'mouse',pt:'mouse',clientX:inX(e),clientY:inY(e),pageX:inX(e),pageY:inY(e),target:e.target});
 for(const ty of['mousedown','mousemove','mouseup','click','dblclick','contextmenu'])W.addEventListener(ty,e=>{if(e.inSyn)return;if(inTxt(e))return;
  // mouse events a finger makes up (Chrome marks them with firesTouchEvents; otherwise: a finger is down, or was a moment ago) are swallowed here, before anything can take them for a click
  {const sc=e.sourceCapabilities,dt=performance.now()-inTchT;if((sc&&sc.firesTouchEvents)||inFing.size||dt<(ty==='mousemove'?400:1000)){e.stopImmediatePropagation();if(ty==='contextmenu')e.preventDefault();if(ty==='click')wake();return}}
  if((ty==='mousedown'||ty==='mouseup')&&typeof inMouseHook==='function'&&inMouseHook(e)){e.stopImmediatePropagation();return}if(ty!=='mousemove')e.stopImmediatePropagation();if(ty==='contextmenu')e.preventDefault();if(ty==='click')wake();
  const t=act.get('mouse');
  if(ty==='mousemove'){if(t){t.clientX=inX(e);t.clientY=inY(e);fire('touchmove',t,t.target)}return}
  if(ty==='mouseup'||ty==='click'){if(t){t.clientX=inX(e);t.clientY=inY(e);drop('mouse')}dropAll(c=>c.pt==='mouse');wake();return}
  if(ty==='mousedown'&&e.button===0&&!t&&performance.now()-lastP>700){const n=mt(e);act.set('mouse',n);fire('touchstart',n,n.target)}},{capture:true});
 W.addEventListener('pointerdown',e=>{lastP=performance.now();if(inTxt(e))return;
  if(e.pointerType!=='mouse'&&document.pointerLockElement){unlock();if(e.isTrusted&&'ontouchstart' in window){if(lastP-lkT>250)lkN=0;lkN++;lkT=lastP;return}}
 if(e.pointerType==='mouse'&&typeof inMouseHook==='function'&&inMouseHook(e))return;if(e.pointerType==='mouse'&&e.button!==0)return;
  if(act.has(e.pointerId))drop(e.pointerId,'touchcancel');if(e.isPrimary)dropAll(c=>c.pt===e.pointerType);
  const t={identifier:e.pointerId,pt:e.pointerType||'touch',clientX:inX(e),clientY:inY(e),pageX:inX(e),pageY:inY(e),target:e.target};act.set(e.pointerId,t);
  try{if(e.pointerType==='mouse'&&e.target.setPointerCapture)e.target.setPointerCapture(e.pointerId)}catch(x){}fire('touchstart',t,t.target)},{capture:true});
 W.addEventListener('pointermove',e=>{lastP=performance.now();const t=act.get(e.pointerId);if(!t)return;if(t.pt==='mouse'&&e.isTrusted&&e.buttons===0){drop(e.pointerId);return}t.clientX=inX(e);t.clientY=inY(e);t.pageX=t.clientX;t.pageY=t.clientY;fire('touchmove',t,t.target)},{capture:true});
 const end=ty=>e=>{lastP=performance.now();const t=act.get(e.pointerId);if(!t)return;t.clientX=inX(e);t.clientY=inY(e);drop(e.pointerId,ty);wake()};
 W.addEventListener('pointerup',end('touchend'),{capture:true});W.addEventListener('pointercancel',end('touchcancel'),{capture:true});
 W.addEventListener('blur',()=>dropAll());W.addEventListener('pagehide',()=>dropAll());document.addEventListener('visibilitychange',()=>{if(document.hidden)dropAll()})}

const renderer=new THREE.WebGLRenderer({antialias:true});renderer.domElement.id='g';renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x9fd0ff,120,262);
const cam=new THREE.PerspectiveCamera(65,1,0.3,266);
function size(){renderer.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}size();addEventListener('resize',size);setTimeout(size,300);

renderer.setPixelRatio(Math.min(devicePixelRatio||1,3));
const composer=new THREE.EffectComposer(renderer,new THREE.WebGLRenderTarget(4,4,{type:THREE.HalfFloatType}));composer.setPixelRatio(Math.min(devicePixelRatio||1,3));
composer.addPass(new THREE.RenderPass(scene,cam));
const bloom=new THREE.UnrealBloomPass(new THREE.Vector2(256,256),.75,.45,.92);composer.addPass(bloom);
const grade=new THREE.ShaderPass({uniforms:{tDiffuse:{value:null},dmg:{value:0},ex:{value:1.0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D tDiffuse;uniform float dmg,ex;varying vec2 vUv;vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}void main(){vec2 c=vUv-.5;float r=dot(c,c);vec3 col;col=max(texture2D(tDiffuse,vUv).rgb,vec3(0.));col=aces(col*ex);float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,1.12);col=pow(col,vec3(1./2.2));col*=1.-r*.7;col=mix(col,vec3(.75,0.,0.),dmg*smoothstep(.08,.45,r));gl_FragColor=vec4(col,1.);}'});
composer.addPass(grade);const fxaa=new THREE.ShaderPass(THREE.FXAAShader);composer.addPass(fxaa);
function size2(){composer.setSize(innerWidth,innerHeight);const pr=renderer.getPixelRatio();fxaa.uniforms.resolution.value.set(1/(innerWidth*pr),1/(innerHeight*pr))}size2();addEventListener('resize',size2);setTimeout(size2,300);
const hemi=new THREE.HemisphereLight(0xffffff,0x556655,0.6);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0dd,1);sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);sun.shadow.bias=-0.0004;Object.assign(sun.shadow.camera,{left:-60,right:60,top:60,bottom:-60,near:1,far:300});scene.add(sun);scene.add(sun.target);
// ---------- city layout ----------
const N=11,BLOCK=40,ROAD=14,CELL=BLOCK+ROAD,SIZE=N*CELL+ROAD,HALF=SIZE/2;
function roadCenter(i){return -HALF+ROAD/2+i*CELL}
function canvasTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rep)t.repeat.set(rep[0],rep[1]);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t}
// ---------- detailed models (cars, people, trees, building glass) ----------
const U=THREE.BufferGeometryUtils;
function gT(geo,x,y,z,rx,ry,rz){const g=geo.index?geo.toNonIndexed():geo;if(rx)g.rotateX(rx);if(ry)g.rotateY(ry);if(rz)g.rotateZ(rz);g.translate(x||0,y||0,z||0);return g}
const bxg=(w,h,d,x,y,z)=>gT(new THREE.BoxGeometry(w,h,d),x,y,z);
function prof(pts,width,bev){const s=new THREE.Shape();s.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)s.lineTo(pts[i][0],pts[i][1]);const g=new THREE.ExtrudeGeometry(s,{depth:width-bev*2,bevelEnabled:true,bevelSize:bev,bevelThickness:bev,bevelSegments:3});g.translate(0,0,-(width-bev*2)/2);g.rotateY(Math.PI/2);return g}
const CM={glass:new THREE.MeshStandardMaterial({color:0x0c141c,metalness:1,roughness:.04}),dark:new THREE.MeshStandardMaterial({color:0x15171a,roughness:.75}),
 head:new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xfff0cc,emissiveIntensity:1.6}),tail:new THREE.MeshStandardMaterial({color:0x550000,emissive:0xff1010,emissiveIntensity:1.4}),
 trim:new THREE.MeshStandardMaterial({color:0xe8e8e8,metalness:.9,roughness:.2}),tire:new THREE.MeshStandardMaterial({color:0x0d0d0d,roughness:.95}),rim:new THREE.MeshStandardMaterial({color:0xc8ccd0,metalness:1,roughness:.22})};
const CAR=(()=>{const cyl=(r,h,n,x,y,z)=>gT(new THREE.CylinderGeometry(r,r,h,n),x,y,z,0,0,Math.PI/2);
 const body=U.mergeBufferGeometries([prof([[-2.15,.38],[2.1,.38],[2.16,.56],[2.12,.84],[1.0,1.0],[-1.5,1.03],[-2.12,.97],[-2.16,.6]],2.2,.07),bxg(1.84,.07,1.38,0,1.645,.29),bxg(1.97,.56,.1,0,1.3,.32),bxg(.16,.1,.22,1.19,1.1,-.8),bxg(.16,.1,.22,-1.19,1.1,-.8)]);
 const glass=prof([[1.0,1.0],[.36,1.57],[-.94,1.57],[-1.52,1.02]],1.86,.05);
 const d=[bxg(2.26,.2,.22,0,.46,-2.1),bxg(2.26,.2,.22,0,.46,2.1),bxg(1.1,.2,.06,0,.68,-2.18),bxg(2.0,.2,3.9,0,.34,0)];
 for(const x of[-1.085,1.085])for(const z of[-1.38,1.38])d.push(cyl(.54,.05,20,x,.42,z));
 for(const x of[-1.112,1.112])for(const z of[-.62,.34,1.12])d.push(bxg(.02,.52,.025,x,.72,z));
 const t=[bxg(.5,.15,.03,0,.5,-2.215),bxg(.5,.15,.03,0,.56,2.215)];for(const x of[-1.12,1.12])for(const z of[-.12,.84])t.push(bxg(.03,.045,.17,x,.93,z));
 return {body,glass,dark:U.mergeBufferGeometries(d),trim:U.mergeBufferGeometries(t),
  head:U.mergeBufferGeometries([bxg(.52,.17,.08,-.68,.76,-2.17),bxg(.52,.17,.08,.68,.76,-2.17)]),tail:U.mergeBufferGeometries([bxg(.56,.15,.08,-.68,.84,2.175),bxg(.56,.15,.08,.68,.84,2.175),bxg(.8,.05,.08,0,.9,2.175)]),
  tire:cyl(.4,.28,20,0,0,0),rim:U.mergeBufferGeometries([cyl(.25,.3,14,0,0,0),bxg(.31,.5,.08,0,0,0),bxg(.31,.08,.5,0,0,0)]),spoiler:U.mergeBufferGeometries([bxg(2.0,.06,.42,0,1.34,1.95),bxg(.08,.3,.2,-.8,1.18,1.95),bxg(.08,.3,.2,.8,1.18,1.95)])}})();
function makeCar(col,tyIn){const g=new THREE.Group(),bm=new THREE.MeshPhysicalMaterial({color:col,metalness:.5,roughness:.3,clearcoat:1,clearcoatRoughness:.06});
 const add=(geo,mat,sh)=>{const m=new THREE.Mesh(geo,mat);m.castShadow=!!sh;g.add(m);return m};
 add(CAR.body,bm,1);add(CAR.glass,CM.glass,1);add(CAR.dark,CM.dark);add(CAR.head,CM.head);add(CAR.tail,CM.tail);add(CAR.trim,CM.trim);
 g.userData.wheels=[];for(const [x,z] of [[-1.0,-1.38],[1.0,-1.38],[-1.0,1.38],[1.0,1.38]]){const w=new THREE.Group(),ti=new THREE.Mesh(CAR.tire,CM.tire);ti.castShadow=true;w.add(ti,new THREE.Mesh(CAR.rim,CM.rim));w.position.set(x,.4,z);g.add(w);g.userData.wheels.push(w)}
 const ty=tyIn===undefined?Math.random():tyIn;if(ty<.22){g.scale.set(1.03,.84,1.1);add(CAR.spoiler,bm,1);g.userData.max=56}else if(ty<.4){g.scale.set(1.1,1.22,1.06);g.userData.max=31}
 return g}
// people
const PGEO=(()=>{const c=(r,l)=>new THREE.CapsuleGeometry(r,l,4,10);return {chest:c(.3,.38),hip:c(.27,.1),neck:new THREE.CylinderGeometry(.1,.11,.2,8),head:new THREE.SphereGeometry(.25,16,12),hair:new THREE.SphereGeometry(.268,16,8,0,Math.PI*2,0,Math.PI*.56),eye:new THREE.SphereGeometry(.034,6,6),
 uarm:c(.105,.34),farm:c(.088,.34),hand:new THREE.SphereGeometry(.1,8,6),thigh:c(.16,.36),shin:c(.125,.4),shoe:new THREE.BoxGeometry(.21,.14,.44),gun:U.mergeBufferGeometries([bxg(.07,.36,.09,0,-.78,-.02),bxg(.07,.12,.2,0,-.62,.08)])}})();
const hairMats=[0x1a1410,0x3b2a1a,0x0c0c0c,0x6b4a2a,0xb08d57,0x555555].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.9}));
const shoeMat=new THREE.MeshStandardMaterial({color:0x1b1b1f,roughness:.6}),eyeMat=new THREE.MeshStandardMaterial({color:0x111111,roughness:.3}),gunMat=new THREE.MeshStandardMaterial({color:0x202226,metalness:.8,roughness:.35});
function makePerson(shirtCol,pantsCol,skinCol){const g=new THREE.Group(),b=new THREE.Group();b.scale.setScalar(.78);g.add(b);
 const M=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r});const shirt=M(shirtCol,.85),pants=M(pantsCol,.9),skin=M(skinCol,.6);
 const add=(par,geo,mat,x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(sx)m.scale.set(sx,sy,sz);m.castShadow=true;par.add(m);return m};
 const chest=add(b,PGEO.chest,shirt,0,1.86,0,1.22,1,.72);add(b,PGEO.hip,pants,0,1.4,0,1.16,1,.8);add(b,PGEO.neck,skin,0,2.38,0);add(b,PGEO.head,skin,0,2.62,0,.95,1.12,1);
 const hair=add(b,PGEO.hair,hairMats[Math.floor(Math.random()*hairMats.length)],0,2.65,0,.97,1.12,1.04);hair.rotation.x=.28;
 add(b,PGEO.eye,eyeMat,-.09,2.65,-.225).castShadow=false;add(b,PGEO.eye,eyeMat,.09,2.65,-.225).castShadow=false;
 const u={};
 for(const s of[-1,1]){const arm=new THREE.Group();arm.position.set(s*.47,2.2,0);b.add(arm);add(arm,PGEO.uarm,shirt,0,-.27,0);const el=new THREE.Group();el.position.y=-.55;arm.add(el);add(el,PGEO.farm,skin,0,-.26,0);add(el,PGEO.hand,skin,0,-.55,0);
  const leg=new THREE.Group();leg.position.set(s*.17,1.35,0);b.add(leg);add(leg,PGEO.thigh,pants,0,-.33,0);const kn=new THREE.Group();kn.position.y=-.66;leg.add(kn);add(kn,PGEO.shin,pants,0,-.3,0);add(kn,PGEO.shoe,shoeMat,0,-.62,-.09);
  if(s<0){u.armL=arm;u.elbL=el;u.legL=leg;u.kneeL=kn}else{u.armR=arm;u.elbR=el;u.legR=leg;u.kneeR=kn;u.gun=add(el,PGEO.gun,gunMat,0,0,0);u.gun.visible=false}}
 chest.onBeforeRender=()=>{for(const k of['L','R']){const a=u['arm'+k].rotation.x,l=u['leg'+k].rotation.x;u['elb'+k].rotation.x=a>1.2||a<-2?.08:.22+Math.max(0,a)*.7;u['knee'+k].rotation.x=-(.1+Math.max(0,-l)*1.1+Math.max(0,l)*.25)}};
 g.userData=u;return g}
// trees
const trunkGeo=new THREE.CylinderGeometry(.2,.32,3.4,7),trunkMat=new THREE.MeshStandardMaterial({color:0x5d4128,roughness:1});
const canopyGeo=U.mergeBufferGeometries([[0,4.4,0,1.75],[1,3.8,.3,1.25],[-.9,3.9,-.4,1.3],[.1,3.7,-1,1.15],[-.2,3.75,1,1.2],[-.1,5.4,.1,1.2]].map(a=>{const q=new THREE.IcosahedronGeometry(1,2);q.scale(a[3],a[3]*.85,a[3]);q.translate(a[0],a[1],a[2]);return q}));
const leafMats=[0x2f7d32,0x3a8f3a,0x276b2c,0x4a9a3f].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.95}));
function tree(x,z){const g=new THREE.Group();const t=new THREE.Mesh(trunkGeo,trunkMat);t.position.y=1.7;t.castShadow=true;g.add(t);const c=new THREE.Mesh(canopyGeo,leafMats[Math.floor(Math.random()*leafMats.length)]);c.castShadow=true;g.add(c);
 g.position.set(x,0,z);g.rotation.y=Math.random()*6.28;g.scale.setScalar(.85+Math.random()*.4);scene.add(g);solids.push({minX:x-.4,maxX:x+.4,minZ:z-.4,maxZ:z+.4,h:3})}
// building glass
const roofGeo=new THREE.BoxGeometry(1,1,1),roofMat=new THREE.MeshStandardMaterial({color:0x4a4d52,roughness:.9}),winPool={};
function winTex(base,lit){const key=base+(lit>.4?'a':'b');if(!winPool[key]){const pat=[];for(let i=0;i<15;i++)pat.push(Math.random()<lit?1+Math.random():0);
 const draw=em=>canvasTex(128,256,g=>{g.fillStyle=em?'#000':base;g.fillRect(0,0,128,256);
  if(!em)for(let i=0;i<500;i++){g.fillStyle='rgba(0,0,0,'+Math.random()*.06+')';g.fillRect(Math.random()*128,Math.random()*256,3,2)}
  for(let f=0;f<5;f++){const y=f*51.2;if(!em){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,y+47,128,4);g.fillStyle='rgba(255,255,255,.14)';g.fillRect(0,y+45,128,2)}
   for(let c=0;c<3;c++){const x=6+c*42.67,L=pat[f*3+c];
    if(em){if(L){g.fillStyle=L>1.7?'#bfe0ff':'#ffd9a0';g.globalAlpha=.55+(L-1)*.45;g.fillRect(x+2,y+10,26,30);g.globalAlpha=1}}
    else{g.fillStyle='#262b31';g.fillRect(x,y+8,30,34);const gr=g.createLinearGradient(0,y+10,0,y+40);if(L){gr.addColorStop(0,'#b5cde0');gr.addColorStop(1,'#5f7c96')}else{gr.addColorStop(0,'#86abcc');gr.addColorStop(.5,'#3b5873');gr.addColorStop(1,'#1f3044')}g.fillStyle=gr;g.fillRect(x+2,y+10,26,30);g.fillStyle='#262b31';g.fillRect(x+14,y+10,2,30)}}}});
 winPool[key]={map:draw(false),em:draw(true)}}
 const p=winPool[key],t=p.map.clone();t.needsUpdate=true;t.userData.em=p.em.clone();t.userData.em.needsUpdate=true;return t}
// ground (grass) and road surface
const grass=new THREE.Mesh(new THREE.PlaneGeometry(SIZE+400,SIZE+400),new THREE.MeshStandardMaterial({map:canvasTex(64,64,(g)=>{g.fillStyle='#3f9b45';g.fillRect(0,0,64,64);for(let i=0;i<300;i++){g.fillStyle=Math.random()<.5?'#4cae52':'#378a3d';g.fillRect(Math.random()*64,Math.random()*64,2,2)}},[120,120])}));
grass.rotation.x=-Math.PI/2;grass.position.y=-0.02;grass.receiveShadow=true;scene.add(grass);
const roadTex=canvasTex(128,128,(g)=>{g.fillStyle='#2f3136';g.fillRect(0,0,128,128);for(let i=0;i<400;i++){g.fillStyle='rgba(255,255,255,'+Math.random()*.05+')';g.fillRect(Math.random()*128,Math.random()*128,2,2)}g.fillStyle='#f4d03f';g.fillRect(62,0,4,56);g.fillRect(62,72,4,56)});
const roadMat=new THREE.MeshStandardMaterial({map:roadTex,roughness:.9});
for(let i=0;i<=N;i++){
 const rz=new THREE.Mesh(new THREE.PlaneGeometry(ROAD,SIZE),roadMat.clone());rz.material.map=roadTex.clone();rz.material.map.needsUpdate=true;rz.material.map.repeat.set(1,SIZE/ROAD);rz.rotation.x=-Math.PI/2;rz.position.set(roadCenter(i),0.01,0);rz.receiveShadow=true;scene.add(rz);
 const rx=new THREE.Mesh(new THREE.PlaneGeometry(ROAD,SIZE),roadMat.clone());rx.material.map=roadTex.clone();rx.material.map.needsUpdate=true;rx.material.map.repeat.set(1,SIZE/ROAD);rx.rotation.x=-Math.PI/2;rx.rotation.z=Math.PI/2;rx.position.set(0,0.015,roadCenter(i));rx.receiveShadow=true;scene.add(rx)}
// buildings
const solids=[];// {minX,maxX,minZ,maxZ,h}
const winMats=[];
function winTexOld(base,lit){return canvasTex(64,128,(g)=>{g.fillStyle=base;g.fillRect(0,0,64,128);for(let y=6;y<128;y+=16)for(let x=6;x<64;x+=14){g.fillStyle=Math.random()<lit?'#ffe9a8':'#1c2a3a';g.fillRect(x,y,8,10)}})}
const fxPal={beach:['#f7b7c5','#a8e6cf','#8fd8e8','#ffd3a5','#fff1d0','#c9b6f2'],sub:['#e8d8c0','#d9c2a5','#f0e6d2','#cfd8c8'],down:['#3d5a73','#2e4257','#4a6b85','#56707f','#39485a']},fxRoofGeo=new THREE.ConeGeometry(1,1,4),fxRoofMat=new THREE.MeshStandardMaterial({color:0xa5482f,roughness:.85});const palette=['#c9cfd6','#e0b48a','#9fb3c8','#d8d0b8','#b88a7a','#8f9aa6','#e6e1d3','#a8c5b5'];
for(let i=0;i<N;i++)for(let j=0;j<N;j++){
 const cx=roadCenter(i)+CELL/2,cz=roadCenter(j)+CELL/2;
 // sidewalk
 const sw=new THREE.Mesh(new THREE.BoxGeometry(BLOCK,0.3,BLOCK),new THREE.MeshStandardMaterial({color:0x7a7c80,roughness:.95}));sw.position.set(cx,0.15,cz);sw.receiveShadow=true;scene.add(sw);
 const park=(i===5&&j===5)||(i===1&&j===8)||(i===8&&j===1)||(i===2&&j===2)||(i===8&&j===6)||(i===4&&j===9);
 if(park){const pg=new THREE.Mesh(new THREE.BoxGeometry(BLOCK-4,0.35,BLOCK-4),new THREE.MeshStandardMaterial({color:0x4cbf55}));pg.position.set(cx,0.18,cz);pg.receiveShadow=true;scene.add(pg);
  for(let k=0;k<10;k++)tree(cx+(Math.random()-.5)*(BLOCK-10),cz+(Math.random()-.5)*(BLOCK-10));
  const fountain=new THREE.Mesh(new THREE.CylinderGeometry(4,4.5,1,24),new THREE.MeshStandardMaterial({color:0xdddddd}));fountain.position.set(cx,0.6,cz);fountain.castShadow=true;scene.add(fountain);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(3.6,3.6,0.2,24),new THREE.MeshStandardMaterial({color:0x3ab0ff,metalness:.3,roughness:.1}));water.position.set(cx,1.05,cz);scene.add(water);
  solids.push({minX:cx-4.5,maxX:cx+4.5,minZ:cz-4.5,maxZ:cz+4.5,h:1.2});continue}
 const zone=i>=N-2?'beach':(i<=1?'sub':(Math.hypot(cx,cz)<HALF*.4?'down':'mid'));const split=zone==='sub'?2:(Math.random()<.6?2:1);
 for(let a=0;a<split;a++)for(let b=0;b<split;b++){
  const w=(BLOCK-6)/split-2,d=w,bx=cx-(BLOCK-6)/2+(a+.5)*(BLOCK-6)/split,bz=cz-(BLOCK-6)/2+(b+.5)*(BLOCK-6)/split;
  const dist=Math.hypot(bx,bz),h=zone==='sub'?5.2+Math.random()*2.6:(zone==='beach'?9+Math.random()*17:(zone==='down'?28+Math.pow(Math.random(),1.6)*125:Math.max(8,Math.pow(Math.max(0,1-dist/HALF),1.5)*100*Math.random()+8+Math.random()*12)));
  const lit=0.25+Math.random()*.3,tex=winTex((fxPal[zone]||palette)[Math.floor(Math.random()*(fxPal[zone]||palette).length)],lit);tex.repeat.set(Math.max(1,Math.round(w/5.5)),Math.max(.2,Math.round(h/2.6)/5));tex.userData.em.repeat.copy(tex.repeat);
  const m=new THREE.MeshStandardMaterial({map:tex,roughness:.42,metalness:.15,emissive:0xffffff,emissiveMap:tex.userData.em,emissiveIntensity:0});winMats.push(m);
  const bld=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);bld.position.set(bx,h/2+0.3,bz);bld.castShadow=true;bld.receiveShadow=true;scene.add(bld);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(w*.4,2,d*.4),new THREE.MeshStandardMaterial({color:0x666666}));roof.position.set(bx,h+1.3,bz);roof.castShadow=true;scene.add(roof);if(zone==='sub'){const pr=new THREE.Mesh(fxRoofGeo,fxRoofMat);pr.scale.set(w*.8,2.8,d*.8);pr.position.set(bx,h+1.7,bz);pr.rotation.y=Math.PI/4;pr.castShadow=true;scene.add(pr);roof.visible=false}const capM=new THREE.Mesh(roofGeo,roofMat);capM.scale.set(w+.5,.5,d+.5);capM.position.set(bx,h+.35,bz);scene.add(capM);
  solids.push({minX:bx-w/2,maxX:bx+w/2,minZ:bz-d/2,maxZ:bz+d/2,h:h})}
 // street trees on corners
 tree(cx-BLOCK/2+2,cz-BLOCK/2+2);tree(cx+BLOCK/2-2,cz+BLOCK/2-2)}
function treeOld(x,z){const g=new THREE.Group();const t=new THREE.Mesh(new THREE.BoxGeometry(.6,3,.6),new THREE.MeshStandardMaterial({color:0x7a5230}));t.position.y=1.8;t.castShadow=true;g.add(t);
 for(let k=0;k<3;k++){const l=new THREE.Mesh(new THREE.BoxGeometry(2.6-k*.6,1.2,2.6-k*.6),new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.3+Math.random()*.05,.6,.3+k*.05)}));l.position.y=3.6+k*1.1;l.castShadow=true;g.add(l)}
 g.position.set(x,0,z);scene.add(g);solids.push({minX:x-.4,maxX:x+.4,minZ:z-.4,maxZ:z+.4,h:3})}
// street lights
const lampMats=[];const lampMat=new THREE.MeshStandardMaterial({color:0xffffee,emissive:0xffe9a0,emissiveIntensity:0});
for(let i=0;i<=N;i++)for(let j=0;j<N;j++){const x=roadCenter(i)+ROAD/2+0.8,z=roadCenter(j)+CELL/2;
 const pole=new THREE.Mesh(new THREE.BoxGeometry(.3,6,.3),new THREE.MeshStandardMaterial({color:0x333333}));pole.position.set(x,3,z);pole.castShadow=true;scene.add(pole);
 const lamp=new THREE.Mesh(new THREE.BoxGeometry(1.2,.4,.6),lampMat);lamp.position.set(x-0.5,6,z);scene.add(lamp)}
// big world edge hills
for(let k=0;k<30;k++){const a=k/30*Math.PI*2;if(Math.abs(Math.cos(a))>.5)continue;const r=HALF+60+Math.random()*40;const h=new THREE.Mesh(new THREE.BoxGeometry(40,20+Math.random()*40,40),new THREE.MeshStandardMaterial({color:0x5c8f5a}));h.position.set(Math.cos(a)*r,5,Math.sin(a)*r);scene.add(h)}
// sky
const skyU={top:{value:new THREE.Color(0x3a7bd5)},bot:{value:new THREE.Color(0xbfe3ff)}};
const sky=new THREE.Mesh(new THREE.SphereGeometry(600,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:skyU,vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 top;uniform vec3 bot;varying vec3 p;void main(){float h=normalize(p).y;gl_FragColor=vec4(mix(bot,top,clamp(h*1.5,0.,1.)),1.);}'}));scene.add(sky);
const starsGeo=new THREE.BufferGeometry();const sp=[];for(let i=0;i<800;i++){const v=new THREE.Vector3().randomDirection();if(v.y<0.05)v.y=Math.abs(v.y)+.05;v.multiplyScalar(550);sp.push(v.x,v.y,v.z)}
starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xffffff,size:2,transparent:true,opacity:0}));scene.add(stars);
// ---------- character ----------
function makePersonOld(shirtCol,pantsCol,skinCol){const g=new THREE.Group();const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.7});
 function limb(w,h,d,m,x,y){const p=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.y=-h/2;b.castShadow=true;p.add(b);p.position.set(x,y,0);g.add(p);return p}
 const torso=new THREE.Mesh(new THREE.BoxGeometry(1,1,.5),M(shirtCol));torso.position.y=1.5;torso.castShadow=true;g.add(torso);
 const head=new THREE.Mesh(new THREE.BoxGeometry(.75,.75,.75),M(skinCol));head.position.y=2.4;head.castShadow=true;g.add(head);
 const cap=new THREE.Mesh(new THREE.BoxGeometry(.8,.25,.95),M(shirtCol));cap.position.set(0,2.85,-.08);g.add(cap);
 const eyes=new THREE.Mesh(new THREE.BoxGeometry(.5,.1,.02),M(0x111111));eyes.position.set(0,2.45,-.39);g.add(eyes);
 g.userData={armL:limb(.38,1,.38,M(skinCol),-.7,2),armR:limb(.38,1,.38,M(skinCol),.7,2),legL:limb(.44,1,.44,M(pantsCol),-.24,1),legR:limb(.44,1,.44,M(pantsCol),.24,1)};
 return g}
const player=makePerson(0xff5a36,0x23324d,0xf1c27d);player.userData.gun.visible=true;scene.add(player);
// pedestrians
const peds=[];for(let k=0;k<90;k++){const p=makePerson(new THREE.Color().setHSL(Math.random(),.7,.55),new THREE.Color().setHSL(Math.random(),.4,.3),[0xf1c27d,0xc68642,0x8d5524,0xe0ac69][k%4]);
 const i=Math.floor(Math.random()*N),j=Math.floor(Math.random()*N),cx=roadCenter(i)+CELL/2,cz=roadCenter(j)+CELL/2;
 p.userData.path={cx,cz,r:BLOCK/2-1.2,t:Math.random()*4,dir:Math.random()<.5?1:-1,spd:.8+Math.random()*.5};scene.add(p);peds.push(p)}
// ---------- cars ----------
const carColors=[0xe63946,0x1d70b8,0xf4a261,0x2a9d8f,0xffffff,0x222222,0x9b5de5,0xffd60a];
function makeCarOld(col,tyIn){const g=new THREE.Group();const body=new THREE.MeshStandardMaterial({color:col,metalness:.5,roughness:.3});
 const b=new THREE.Mesh(new THREE.BoxGeometry(2.2,.8,4.4),body);b.position.y=.8;b.castShadow=true;g.add(b);
 const top=new THREE.Mesh(new THREE.BoxGeometry(1.9,.7,2.2),body);top.position.set(0,1.55,.2);top.castShadow=true;g.add(top);
 const glass=new THREE.MeshStandardMaterial({color:0x223344,metalness:.8,roughness:.05});
 const ws=new THREE.Mesh(new THREE.BoxGeometry(1.8,.55,.05),glass);ws.position.set(0,1.55,-.92);g.add(ws);const rw=ws.clone();rw.position.z=1.32;g.add(rw);
 const sideL=new THREE.Mesh(new THREE.BoxGeometry(.05,.5,1.9),glass);sideL.position.set(-.96,1.55,.2);g.add(sideL);const sideR=sideL.clone();sideR.position.x=.96;g.add(sideR);
 const wm=new THREE.MeshStandardMaterial({color:0x111111});g.userData.wheels=[];
 for(const [x,z] of [[-1.05,-1.4],[1.05,-1.4],[-1.05,1.4],[1.05,1.4]]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.35,16),wm);w.rotation.z=Math.PI/2;w.position.set(x,.42,z);w.castShadow=true;g.add(w);g.userData.wheels.push(w)}
 const hl=new THREE.MeshStandardMaterial({color:0xffffee,emissive:0xffffcc,emissiveIntensity:.3});for(const x of[-.7,.7]){const h=new THREE.Mesh(new THREE.BoxGeometry(.4,.2,.05),hl);h.position.set(x,.9,-2.21);g.add(h)}
 const tl=new THREE.MeshStandardMaterial({color:0xff2222,emissive:0xff0000,emissiveIntensity:.4});for(const x of[-.7,.7]){const h=new THREE.Mesh(new THREE.BoxGeometry(.4,.2,.05),tl);h.position.set(x,.9,2.21);g.add(h)}
 const ty=tyIn===undefined?Math.random():tyIn;if(ty<.22){g.scale.set(1.02,.8,1.08);const sp=new THREE.Mesh(new THREE.BoxGeometry(2.1,.12,.5),body);sp.position.set(0,1.42,2.05);g.add(sp);g.userData.max=56}else if(ty<.4){g.scale.set(1.12,1.22,1.08);g.userData.max=31}
 return g}
const cars=[];// parked/drivable
for(let k=0;k<50;k++){const c=makeCar(carColors[k%carColors.length]);const i=Math.floor(Math.random()*(N+1)),j=Math.floor(Math.random()*N);
 c.position.set(roadCenter(i)+ROAD/2-1.6,0,roadCenter(j)+CELL/2+(Math.random()-.5)*20);c.rotation.y=Math.PI;scene.add(c);cars.push({m:c,speed:0,steer:0})}
const traffic=[];
for(let k=0;k<40;k++){const c=makeCar(carColors[(k+3)%carColors.length]);const alongX=k%2===0,lane=Math.floor(Math.random()*(N+1)),dir=Math.random()<.5?1:-1;
 const t={m:c,alongX,dir,lane,pos:(Math.random()-.5)*SIZE,spd:8+Math.random()*5};scene.add(c);traffic.push(t)}
function placeTraffic(t){const off=t.dir*3.2;if(t.alongX){t.m.position.set(t.pos,0,roadCenter(t.lane)+off);t.m.rotation.y=t.dir>0?-Math.PI/2:Math.PI/2}else{t.m.position.set(roadCenter(t.lane)-off,0,t.pos);t.m.rotation.y=t.dir>0?Math.PI:0}}
// ---------- coins & missions ----------
const coinMat=new THREE.MeshStandardMaterial({color:0xffcc33,metalness:.7,roughness:.25,emissive:0x553300});
const coins=[];for(let k=0;k<140;k++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,.15,20),coinMat);m.rotation.x=Math.PI/2;
 const i=Math.floor(Math.random()*(N+1));const along=(Math.random()-.5)*SIZE*.9;if(Math.random()<.5)m.position.set(roadCenter(i),1.2,along);else m.position.set(along,1.2,roadCenter(i));m.castShadow=true;scene.add(m);coins.push(m)}
const beamMat=new THREE.MeshBasicMaterial({color:0x33ff88,transparent:true,opacity:.35,depthWrite:false});
const beam=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,120,24,1,true),beamMat);scene.add(beam);
const ring=new THREE.Mesh(new THREE.TorusGeometry(3,.25,8,32),new THREE.MeshBasicMaterial({color:0x33ff88}));ring.rotation.x=Math.PI/2;scene.add(ring);
const arrow=new THREE.Mesh(new THREE.ConeGeometry(.5,1.4,4),new THREE.MeshBasicMaterial({color:0x33ff88}));arrow.rotation.x=Math.PI/2;scene.add(arrow);
const box=new THREE.Mesh(new THREE.BoxGeometry(.7,.6,.7),new THREE.MeshStandardMaterial({color:0xb5835a}));box.visible=false;scene.add(box);
const placesNames=['the Diner','City Hall','the Mall','the Gym','Pizza Spot','the Arcade','the Library','Tech Tower','the Docks','Corner Store','the Park','Music Shop'];
let mission={stage:'pickup',target:new THREE.Vector3(),reward:0,timeLeft:0,from:'',to:''};
function randomCorner(){const i=Math.floor(Math.random()*(N+1)),j=Math.floor(Math.random()*(N+1));return new THREE.Vector3(roadCenter(i),0,roadCenter(j))}
function newMission(){mission.stage='pickup';mission.target=randomCorner();mission.from=placesNames[Math.floor(Math.random()*placesNames.length)];mission.to=placesNames[Math.floor(Math.random()*placesNames.length)];box.visible=false}
newMission();
// ---------- state & controls ----------
const pos=new THREE.Vector3(roadCenter(5)+4,0,roadCenter(5)+4),vel=new THREE.Vector3();
let onGround=true,facing=0,walkT=0,state='ready',camYaw=0.6,camPitch=0.4,cash=0,coinN=0,driving=null,dayT=0.3,knock=0;
let fireId=null;
let joy={id:null,x:0,y:0,cx:0,cy:0},look={id:null,x:0,y:0},jumpQ=false,carQ=false;
const stick=$('stick'),knob=$('knob');
function hit(el,t){const r=el.getBoundingClientRect();return t.clientX>r.left-10&&t.clientX<r.right+10&&t.clientY>r.top-10&&t.clientY<r.bottom+10}
addEventListener('touchstart',e=>{e.preventDefault();if(state==='ready'){state='play';$('msg').style.display='none';return}
 for(const t of e.changedTouches){if(hit($('fire'),t)){fireId=t.identifier;continue}if(hit($('wpn'),t)){cycleWeapon();continue}if(hit($('jump'),t)){jumpQ=true;continue}if(hit($('car'),t)){carQ=true;continue}
  if(uiJoyZone(t)&&joy.id===null){const r=stick.getBoundingClientRect();joy={id:t.identifier,cx:r.left+r.width/2,cy:r.top+r.height/2,x:0,y:0};moveJoy(t)}
  else if(look.id===null)look={id:t.identifier,x:t.clientX,y:t.clientY,sx:t.clientX,sy:t.clientY,t0:performance.now()}}},{passive:false});
function moveJoy(t){let dx=t.clientX-joy.cx,dy=t.clientY-joy.cy;const d=Math.hypot(dx,dy),m=55;if(d>m){dx*=m/d;dy*=m/d}joy.x=dx/m;joy.y=dy/m;knob.style.transform='translate('+dx+'px,'+dy+'px)'}
addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===joy.id)moveJoy(t);else if(t.identifier===look.id){camYaw-=(t.clientX-look.x)*0.008*uiSens;camPitch=Math.max(uiFPWas?-1.05:0.05,Math.min(uiFPWas?1.6:1.3,camPitch+(t.clientY-look.y)*0.005*uiSens*uiInvY));look.x=t.clientX;look.y=t.clientY}}},{passive:false});
function endT(e){for(const t of e.changedTouches){if(t.identifier===fireId)fireId=null;if(t.identifier===joy.id){joy.id=null;joy.x=joy.y=0;knob.style.transform=''}if(t.identifier===look.id){if(Math.hypot(t.clientX-look.sx,t.clientY-look.sy)<14&&performance.now()-look.t0<350)tapShoot(t.clientX,t.clientY);look.id=null}}if(!e.touches||!e.touches.length){fireId=null;joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null}}
addEventListener('touchend',endT);addEventListener('touchcancel',endT);addEventListener('keydown',e=>{if(e.key==='f')fireId=1;if(e.key==='q')cycleWeapon()});addEventListener('keyup',e=>{if(e.key==='f')fireId=null});addEventListener('mousedown',()=>{if(state==='ready'){state='play';$('msg').style.display='none'}});
function toast(s){const t=$('toast');t.textContent=s;t.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.opacity=0,1600)}
// collision: circle vs building boxes
function collide(p,r,maxH){for(const s of solids){if(maxH!==undefined&&p.y>s.h)continue;const cx=Math.max(s.minX,Math.min(p.x,s.maxX)),cz=Math.max(s.minZ,Math.min(p.z,s.maxZ));const dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;
 if(d2<r*r){const d=Math.sqrt(d2)||0.0001;if(d2===0){p.x+=r}else{p.x+=dx/d*(r-d);p.z+=dz/d*(r-d)}return true}}
 const lim=HALF+50;p.x=Math.max(-lim-235,Math.min(lim,p.x));p.z=Math.max(-lim,Math.min(lim,p.z));return false}
// minimap
const mapC=$('map').getContext('2d');
function drawMap(){const g=mapC,S=260,sc=S/215;g.clearRect(0,0,S,S);g.save();g.beginPath();g.arc(S/2,S/2,S/2,0,7);g.clip();g.fillStyle='#2e6b33';g.fillRect(0,0,S,S);
 g.translate(S/2,S/2);g.rotate(camYaw);g.translate(-pos.x*sc,-pos.z*sc);
 g.fillStyle='#555';for(let i=0;i<=N;i++){g.fillRect((roadCenter(i)-ROAD/2)*sc,-HALF*sc,ROAD*sc,SIZE*sc);g.fillRect(-HALF*sc,(roadCenter(i)-ROAD/2)*sc,SIZE*sc,ROAD*sc)}
 g.fillStyle='#aaa';for(const s of solids)if(s.h>4)g.fillRect(s.minX*sc,s.minZ*sc,(s.maxX-s.minX)*sc,(s.maxZ-s.minZ)*sc);
 g.fillStyle='#33ff88';g.beginPath();g.arc(mission.target.x*sc,mission.target.z*sc,8,0,7);g.fill();for(const pc of police)if(!pc.dead&&!pc.gone){g.fillStyle=Math.sin(T*12)>0?'#ff3030':'#3060ff';g.beginPath();g.arc(pc.m.position.x*sc,pc.m.position.z*sc,6,0,7);g.fill()}g.fillStyle='#c060ff';for(const e of shooters)if(!e.dead&&e.kind==='gang'){g.beginPath();g.arc(e.g.position.x*sc,e.g.position.z*sc,4,0,7);g.fill()}
 g.restore();g.save();g.translate(S/2,S/2);g.rotate(camYaw-facing);g.fillStyle='#fff';g.beginPath();g.moveTo(0,-12);g.lineTo(8,8);g.lineTo(-8,8);g.fill();g.restore();
 g.strokeStyle='#fff8';g.lineWidth=4;g.beginPath();g.arc(S/2,S/2,S/2-2,0,7);g.stroke()}

// ---------- combat, weapons, police, gangs, weather ----------
let AC=null,NB=null;
function audio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){}}
addEventListener('touchstart',audio);addEventListener('mousedown',audio);
function sfx(dur,freq,gain,at){if(!AC)return;if(at){gain*=Math.max(0,1-at.distanceTo(pos)/110);if(gain<.01)return}const t=AC.currentTime,s=AC.createBufferSource();s.buffer=NB;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=freq;const g=AC.createGain();g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t,Math.random()*.5);s.stop(t+dur)}
function beep(f,dur,g){if(!AC)return;const t=AC.currentTime,o=AC.createOscillator(),G=AC.createGain();o.frequency.value=f;G.gain.setValueAtTime(g,t);G.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(G);G.connect(AC.destination);o.start(t);o.stop(t+dur)}
let sirenO=null,sirenG=null;
function sirenTick(v){if(!AC)return;if(!sirenO){sirenO=AC.createOscillator();sirenO.type='square';sirenG=AC.createGain();sirenG.gain.value=0;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=1800;sirenO.connect(f);f.connect(sirenG);sirenG.connect(AC.destination);sirenO.start()}sirenO.frequency.value=750+350*Math.sin(T*4);sirenG.gain.value=v*.05}
// tracers + particles
const tracers=[];const trMat=new THREE.MeshBasicMaterial({color:0xffe08a,transparent:true,opacity:.9,toneMapped:false});
for(let i=0;i<40;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.06,.06,1),trMat);m.visible=false;scene.add(m);tracers.push({m,l:0})}
let trI=0;function tracer(a,b){const t=tracers[trI++%tracers.length];t.m.position.copy(a).lerp(b,.5);t.m.lookAt(b);t.m.scale.z=a.distanceTo(b);t.m.visible=true;t.l=.06}
const parts=[];const pGeo=new THREE.BoxGeometry(1,1,1);
function burst(p,n,col,spd,sz,life,up){for(let i=0;i<n;i++){let q=null;for(const x of parts)if(!x.m.visible){q=x;break}if(!q){if(parts.length>320)return;q={m:new THREE.Mesh(pGeo,new THREE.MeshBasicMaterial({transparent:true,toneMapped:false,depthWrite:false})),v:new THREE.Vector3()};scene.add(q.m);parts.push(q)}
 q.m.visible=true;q.m.position.copy(p);q.m.material.color.set(col);q.m.material.opacity=1;q.v.set((Math.random()-.5)*spd,Math.random()*spd*(up||.5),(Math.random()-.5)*spd);q.s=sz*(.5+Math.random());q.m.scale.setScalar(q.s);q.l=q.L=life*(.6+Math.random()*.6);q.g=up?-6:-15}}
const boomLight=new THREE.PointLight(0xff9040,0,60,2);scene.add(boomLight);
const flashLight=new THREE.PointLight(0xffd080,0,18,2);scene.add(flashLight);
let shake=0,kills=0;
// ---------- player health ----------
let hp=100,armor=0,dmgFx=0,deadT=0;
function hurt(n){if(state!=='play')return;if(armor>0){const a=Math.min(armor,n*.7);armor-=a;n-=a}hp-=n;dmgFx=Math.min(1,dmgFx+n/25);if(hp<=0){hp=0;die()}}
function die(){state='dead';deadT=3.5;toast('WIPED OUT');if(driving){driving.speed=0;driving=null;player.visible=true}
 const loss=Math.round(cash*.1);cash-=loss;$('msg').style.display='block';$('msg').innerHTML='<h1 style="color:#ff5050">WIPED OUT</h1><p>-$'+loss+' hospital bill</p>'}
function respawn(){state='play';hp=100;armor=0;wantedScore=0;evade=0;pos.set(roadCenter(5)+4,0.3,roadCenter(5)+4);vel.set(0,0,0);$('msg').style.display='none';
 for(const s of shooters)if(s.kind==='cop'){s.dead=true;s.gone=true;s.g.visible=false}for(const pc of police)pc.gone=true}
// ---------- weapons ----------
const WEAP=[{n:'PISTOL',rate:.3,dmg:1.5,pel:1,ammo:Infinity,col:0xcccccc},{n:'SMG',rate:.085,dmg:1,pel:1,ammo:60,col:0x4dd0ff},{n:'SHOTGUN',rate:.85,dmg:1.3,pel:6,ammo:12,col:0xffa040},{n:'ROCKET',rate:1.2,dmg:0,pel:1,ammo:3,col:0x80ff60}];
let wi=0;function cycleWeapon(){for(let k=1;k<=4;k++){const n=(wi+k)%4;if(WEAP[n].ammo>0){wi=n;break}}toast(WEAP[wi].n);beep(900,.06,.1)}
// ---------- enemies on foot ----------
const shooters=[];
function makeShooter(kind,x,z){const g=kind==='cop'?makePerson(0x1d3557,0x0b132b,[0xf1c27d,0xc68642,0x8d5524][Math.floor(Math.random()*3)]):makePerson(0x7b2cbf,0x151515,[0xf1c27d,0xc68642,0x8d5524,0xe0ac69][Math.floor(Math.random()*4)]);
 g.userData.gun.visible=true;g.position.set(x,0.3,z);scene.add(g);const s={g,kind,hp:kind==='cop'?4:3,cd:1+Math.random(),dead:false,aggro:false,home:new THREE.Vector3(x,0.3,z),deadT:0,walkT:Math.random()*9};shooters.push(s);return s}
// gang turf: blocks i,j >= 5
const turf=[];for(const q of [[2,9,.8],[3,10,2.4],[2,8,4]])turf.push([roadCenter(q[0])+CELL/2,roadCenter(q[1])+CELL/2,q[2]]);
const turfC=new THREE.Vector3(roadCenter(6),0,roadCenter(6));
function spawnGang(){const b=turf[Math.floor(Math.random()*turf.length)],a=b[2]+(Math.random()-.5)*.7,r=BLOCK/2-1.5-Math.random()*1.2;return makeShooter('gang',b[0]+Math.cos(a)*r*(Math.abs(Math.cos(a))>.7?1:.8),b[1]+Math.sin(a)*r)}
for(let k=0;k<7;k++)spawnGang();
function killShooter(s,from){if(s.dead)return;s.dead=true;s.deadT=0;s.fall=new THREE.Vector3().subVectors(s.g.position,from).setY(0).normalize();burst(s.g.position.clone().setY(1.5),10,0xffffff,4,.25,.4);kills++;
 if(s.kind==='gang'){cash+=25;toast('+$25')}else{crime(3);cash+=10}}
// ---------- police ----------
let wantedScore=0,wanted=0,evade=0,spawnCD=0;const police=[];
function crime(n){wantedScore+=n}
function makePoliceCar(){const c=makeCar(0x101820,.9);c.userData.max=46;const bar=new THREE.Mesh(new THREE.BoxGeometry(1.4,.2,.4),new THREE.MeshStandardMaterial({color:0x222222}));bar.position.set(0,1.72,.29);c.add(bar);
 const red=new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false}),blue=new THREE.MeshBasicMaterial({color:0x2050ff,toneMapped:false});
 const r=new THREE.Mesh(new THREE.BoxGeometry(.6,.22,.42),red);r.position.set(-.38,1.78,.29);const b=new THREE.Mesh(new THREE.BoxGeometry(.6,.22,.42),blue);b.position.set(.38,1.78,.29);c.add(r,b);
 const door=new THREE.Mesh(new THREE.BoxGeometry(2.25,.5,1.7),new THREE.MeshStandardMaterial({color:0xffffff,metalness:.4,roughness:.3}));door.position.set(0,.72,.25);c.add(door);c.userData.red=red;c.userData.blue=blue;return c}
function spawnPolice(){const a=Math.random()*Math.PI*2,p=new THREE.Vector3(pos.x+Math.cos(a)*85,0,pos.z+Math.sin(a)*85);
 const snap=v=>roadCenter(Math.max(0,Math.min(N,Math.round((v+HALF-ROAD/2)/CELL))));if(Math.random()<.5)p.x=snap(p.x);else p.z=snap(p.z);
 p.x=Math.max(-HALF,Math.min(HALF,p.x));p.z=Math.max(-HALF,Math.min(HALF,p.z));
 const m=makePoliceCar();m.position.copy(p);m.rotation.y=Math.atan2(-(pos.x-p.x),-(pos.z-p.z));scene.add(m);police.push({m,speed:0,hp:150,dead:false,deployed:false,stuck:0,back:0,hitCD:0})}
function blowPolice(pc){if(pc.dead)return;pc.dead=true;explode(pc.m.position.clone().setY(1));char(pc.m);crime(3);setTimeout(()=>{pc.gone=true},20000)}
// ---------- explosions ----------
function explode(p){burst(p,34,0xffaa22,16,1.2,.7,1);burst(p,22,0xff4400,10,1.6,.9,1);burst(p,16,0x333333,6,2.2,2,1.2);boomLight.position.copy(p).setY(3);boomLight.intensity=9;shake=Math.max(shake,Math.max(0,1.2-p.distanceTo(pos)/50));sfx(1.6,420,1,p);
 for(const q of peds)if(!q.userData.dead&&q.position.distanceTo(p)<8)killPed(q,p);
 for(const s of shooters)if(!s.dead&&s.g.position.distanceTo(p)<8)killShooter(s,p);
 for(const t of traffic)if(!t.dead&&t.m.position.distanceTo(p)<7&&t.m.position.distanceTo(p)>0.5){t.hp=(t.hp||100)-70;if(t.hp<=0)setTimeout(()=>blowCar(t),250)}
 for(const c of cars)if(c!==driving&&!c.dead&&c.m.position.distanceTo(p)<6)setTimeout(()=>blowParked(c),250);
 for(const pc of police)if(!pc.dead&&pc.m.position.distanceTo(p)<7&&pc.m.position.distanceTo(p)>.5){pc.hp-=100;if(pc.hp<=0)setTimeout(()=>blowPolice(pc),250)}
 const dp=p.distanceTo(new THREE.Vector3(pos.x,1,pos.z));if(dp<9)hurt((9-dp)*9)}
function char(m){m.traverse(o=>{if(o.material&&o.material.color&&o.material!==trMat){o.material=o.material.clone();o.material.color.multiplyScalar(.12);if(o.material.emissive)o.material.emissive.set(0)}})}
function blowCar(t){if(t.dead)return;t.dead=true;explode(t.m.position.clone().setY(1));char(t.m);t.m.position.y=-.2;t.m.rotation.z=(Math.random()-.5)*.6;cash+=50;crime(1.5);
 setTimeout(()=>{t.m.parent.remove(t.m);const c=makeCar(carColors[Math.floor(Math.random()*carColors.length)]);scene.add(c);t.m=c;t.dead=false;t.hp=100;t.pos=t.dir>0?-HALF-20:HALF+20},20000)}
function blowParked(c){if(c.dead)return;c.dead=true;explode(c.m.position.clone().setY(1));char(c.m);cash+=50;crime(1.5)}
function killPed(q,from){const u=q.userData;if(u.dead)return;u.dead=true;u.deadT=0;u.fall=new THREE.Vector3().subVectors(q.position,from).setY(0).normalize();burst(q.position.clone().setY(1.5),10,0xffffff,4,.25,.4);kills++;cash+=5;crime(1);
 for(const p of peds){const d=p.position.distanceTo(q.position);if(d<30&&!p.userData.dead){p.userData.path.spd=Math.min(3.5,p.userData.path.spd*2.2)}}
 setTimeout(()=>{u.dead=false;q.rotation.x=0;q.rotation.z=0;const i=Math.floor(Math.random()*N),j=Math.floor(Math.random()*N);u.path.cx=roadCenter(i)+CELL/2;u.path.cz=roadCenter(j)+CELL/2;u.path.spd=.8+Math.random()*.5},15000)}
// ---------- pickups ----------
const pickups=[];const PK=[{k:'smg',col:0x4dd0ff,txt:'SMG +60'},{k:'shotgun',col:0xffa040,txt:'SHOTGUN +12'},{k:'rocket',col:0x80ff60,txt:'ROCKETS +3'},{k:'health',col:0xff4060,txt:'HEALTH +50'},{k:'armor',col:0x4060ff,txt:'ARMOR +50'}];
for(let k=0;k<45;k++){const d=PK[k%5],i=Math.floor(Math.random()*N),j=Math.floor(Math.random()*N),a=Math.floor(Math.random()*4),r=BLOCK/2-1.5;
 const m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:d.col,emissive:d.col,emissiveIntensity:1.6,toneMapped:false}));
 m.position.set(roadCenter(i)+CELL/2+(a&1?r:-r),1.2,roadCenter(j)+CELL/2+(a&2?r:-r));m.castShadow=true;scene.add(m);pickups.push({m,d,t:0})}
function pickupTick(dt){for(const p of pickups){if(p.t>0){p.t-=dt;if(p.t<=0)p.m.visible=true;continue}p.m.rotation.y+=dt*2;p.m.position.y=1.2+Math.sin(T*3+p.m.position.x)*.25;
 if(Math.hypot(p.m.position.x-pos.x,p.m.position.z-pos.z)<(driving?3.2:1.8)){const k=p.d.k;
  if(k==='health'){if(hp>=100)continue;hp=Math.min(100,hp+50)}else if(k==='armor'){if(armor>=100)continue;armor=Math.min(100,armor+50)}
  else{const w=WEAP[{smg:1,shotgun:2,rocket:3}[k]];w.ammo+=({smg:60,shotgun:12,rocket:3})[k]}
  p.m.visible=false;p.t=40;toast(p.d.txt);beep(1300,.15,.15);setTimeout(()=>beep(1750,.15,.12),90)}}}
// ---------- rockets ----------
const rockets=[];const rkGeo=new THREE.CylinderGeometry(.12,.12,.9,8);rkGeo.rotateX(Math.PI/2);const rkMat=new THREE.MeshStandardMaterial({color:0x556b2f});
function fireRocket(o,dir){const m=new THREE.Mesh(rkGeo,rkMat);m.position.copy(o);m.lookAt(o.clone().add(dir));scene.add(m);rockets.push({m,v:dir.clone().multiplyScalar(55),l:2.5})}
function rocketTick(dt){for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.l-=dt;r.m.position.addScaledVector(r.v,dt);burst(r.m.position,1,0xffaa33,1,.3,.15);burst(r.m.position,1,0x888888,1,.5,.6,.4);
 const p=r.m.position;let hit=r.l<=0||p.y<.3;if(!hit){const tp=new THREE.Vector3(p.x,0,p.z);if(collide(tp,.3))hit=true}
 if(!hit){for(const t of allTargets())if(t.p.distanceTo(p)<2.2){hit=true;break}}
 if(hit){explode(p.clone());scene.remove(r.m);rockets.splice(i,1)}}}
// ---------- targeting & shooting ----------
const lockEl=document.getElementById('lock');
function allTargets(){const out=[];
 for(const q of peds)if(!q.userData.dead)out.push({kind:'ped',obj:q,p:q.position.clone().setY(1.6)});
 for(const s of shooters)if(!s.dead)out.push({kind:'sh',obj:s,p:s.g.position.clone().setY(1.6),hostile:s.aggro||(s.kind==='cop'&&wanted>0)});
 for(const t of traffic)if(!t.dead)out.push({kind:'car',obj:t,p:t.m.position.clone().setY(1)});
 for(const c of cars)if(c!==driving&&!c.dead)out.push({kind:'parked',obj:c,p:c.m.position.clone().setY(1)});
 for(const pc of police)if(!pc.dead&&!pc.gone)out.push({kind:'pol',obj:pc,p:pc.m.position.clone().setY(1),hostile:wanted>0});
 return out}
function findTarget(){if(lockObj){for(const t of allTargets())if(t.obj===lockObj&&Math.hypot(t.p.x-pos.x,t.p.z-pos.z)<85)return t;lockObj=null}const fx=-Math.sin(camYaw),fz=-Math.cos(camYaw);let best=null,bs=1e9;
 for(const t of allTargets()){const dx=t.p.x-pos.x,dz=t.p.z-pos.z,d=Math.hypot(dx,dz);if(!t.hostile||d<1||d>60)continue;const dot=(dx*fx+dz*fz)/d;if(dot<.45)continue;let s=d*(2-dot);if(t.hostile)s*=.4;if(s<bs){bs=s;best=t}}
 return best}
function damage(t,dmg){const from=pos;
 if(t.kind==='ped')killPed(t.obj,from);
 else if(t.kind==='sh'){const s=t.obj;s.hp-=dmg;s.aggro=true;burst(t.p,4,0xffffff,3,.15,.2);if(s.hp<=0)killShooter(s,from);if(s.kind==='cop')crime(.5)}
 else{const c=t.obj;c.hp=(c.hp||100)-dmg*6;burst(t.p,4,0xffdd66,6,.15,.25);if(t.kind==='pol')crime(.3);if(c.hp<=0){if(t.kind==='car')blowCar(c);else if(t.kind==='pol')blowPolice(c);else blowParked(c)}}}
function shoot(){const w=WEAP[wi];if(w.ammo<=0){wi=0;return}if(w.ammo!==Infinity)w.ammo--;
 const tg=findTarget();const o=new THREE.Vector3(pos.x,pos.y+(driving?2.2:1.9),pos.z);let end;
 if(tg){end=tg.p.clone();if(!driving)facing=Math.atan2(-(end.x-pos.x),-(end.z-pos.z))}
 else if(tapT>0&&tapPt){end=tapPt.clone();if(!driving)facing=Math.atan2(-(end.x-pos.x),-(end.z-pos.z))}
 else{end=new THREE.Vector3(pos.x-Math.sin(camYaw)*60,o.y-Math.sin(camPitch)*8,pos.z-Math.cos(camYaw)*60);if(!driving)facing=camYaw}
 const mz=o.clone().add(new THREE.Vector3(-Math.sin(facing)*.9,0,-Math.cos(facing)*.9));
 if(w.n==='ROCKET'){fireRocket(mz,end.clone().sub(mz).normalize());sfx(.6,900,.6);shake=Math.max(shake,.25)}
 else{for(let k=0;k<w.pel;k++){const e=end.clone();if(w.pel>1)e.add(new THREE.Vector3((Math.random()-.5)*2.5,(Math.random()-.5)*1.5,(Math.random()-.5)*2.5));tracer(mz,e)}
  if(tg)damage(tg,w.dmg*w.pel);sfx(w.n==='SHOTGUN'?.4:.18,w.n==='SHOTGUN'?1200:2200,w.n==='SHOTGUN'?.8:.5);shake=Math.max(shake,w.n==='SHOTGUN'?.3:.08)}
 flashLight.position.copy(mz);flashLight.intensity=4;burst(mz,3,0xffcc55,2,.18,.06);
 // nearby civilians panic, gangs hear it
 for(const s of shooters)if(s.kind==='gang'&&s.g.position.distanceTo(pos)<40)s.aggro=true}
// ---------- AI updates ----------
function animLimbs(g,sp,t){const u=g.userData,sw=Math.sin(t)*Math.min(1,sp/5)*.9;u.armL.rotation.x=sw;u.armR.rotation.x=-sw;u.legL.rotation.x=-sw;u.legR.rotation.x=sw}
function enemyShoot(s){const sp=s.g.position,o=sp.clone().setY(1.9),tp=new THREE.Vector3(pos.x,pos.y+(driving?1.2:1.5),pos.z),d=o.distanceTo(tp);
 const chance=Math.max(.15,Math.min(.65,1-d/40))*(driving?.6:1);const hitIt=Math.random()<chance;
 const e=hitIt?tp:tp.clone().add(new THREE.Vector3((Math.random()-.5)*4,(Math.random()-.5)*2,(Math.random()-.5)*4));
 tracer(o,e);sfx(.18,1800,.35,sp);if(hitIt)hurt((s.kind==='cop'?5:6)*(driving?.5:1));s.g.userData.armR.rotation.x=Math.PI/2}
function shooterTick(dt){for(let i=shooters.length-1;i>=0;i--){const s=shooters[i],g=s.g;
 if(s.gone){scene.remove(g);shooters.splice(i,1);continue}
 if(s.dead){s.deadT+=dt;if(s.deadT<.35){g.rotation.x=-Math.min(1,s.deadT*3)*Math.PI/2;g.position.addScaledVector(s.fall,dt*4)}
  if(s.deadT>12&&g.position.distanceTo(pos)>40){s.gone=true;if(s.kind==='gang')setTimeout(spawnGang,20000)}continue}
 const dx=pos.x-g.position.x,dz=pos.z-g.position.z,d=Math.hypot(dx,dz);let mv=0;
 if(s.kind==='gang'){if(d<30&&lfGangHot(s,d,dt))s.aggro=true;if(d>70)s.aggro=false}else s.aggro=wanted>0;
 if(state!=='play')s.aggro=false;
 if(s.kind==='cop'&&wanted===0){s.leave=(s.leave||0)+dt;if(s.leave>8&&d>30){s.gone=true;continue}}
 if(s.aggro){g.rotation.y=Math.atan2(-dx,-dz);const want=s.kind==='cop'?9:13;
  if(d>want){mv=s.kind==='cop'?5.2:4;g.position.x+=dx/d*mv*dt;g.position.z+=dz/d*mv*dt}
  else{const sd=Math.sin(T*1.3+i)*2;g.position.x+=-dz/d*sd*dt;g.position.z+=dx/d*sd*dt;mv=Math.abs(sd)}
  s.cd-=dt;if(s.cd<=0&&d<38){s.cd=.7+Math.random()*.7;enemyShoot(s)}}
 else{const hx=s.home.x-g.position.x,hz=s.home.z-g.position.z,hd=Math.hypot(hx,hz);if(hd>1.5&&s.kind==='gang'){mv=1.6;g.position.x+=hx/hd*mv*dt;g.position.z+=hz/hd*mv*dt;g.rotation.y=Math.atan2(-hx,-hz)}else g.rotation.y+=Math.sin(T*.5+i)*dt*.3}
 collide(g.position,.45);s.walkT+=dt*mv*1.5;animLimbs(g,mv,s.walkT);if(s.aggro&&mv<1)g.userData.armR.rotation.x=Math.PI/2}}
function policeTick(dt){let near=99;
 for(let i=police.length-1;i>=0;i--){const pc=police[i],m=pc.m;
  if(pc.gone){scene.remove(m);police.splice(i,1);continue}if(pc.dead)continue;
  const flash=Math.sin(T*14)>0;m.userData.red.color.setRGB(flash?4:.2,0,0);m.userData.blue.color.setRGB(0,0,flash?.2:4);
  const tgt=driving?driving.m.position:pos;const dx=tgt.x-m.position.x,dz=tgt.z-m.position.z,d=Math.hypot(dx,dz);near=Math.min(near,d);
  if(wanted===0){m.rotation.y+=dt*.3;pc.speed=Math.min(pc.speed+dt*10,18);if(d>130){pc.gone=true;continue}}
  else{if(!driving&&d<16&&!pc.deployed){pc.deployed=true;pc.speed=0;const r=new THREE.Vector3(Math.cos(m.rotation.y),0,-Math.sin(m.rotation.y));
    makeShooter('cop',m.position.x+r.x*2.4,m.position.z+r.z*2.4).aggro=true;makeShooter('cop',m.position.x-r.x*2.4,m.position.z-r.z*2.4).aggro=true}
   if(pc.deployed&&(driving||d>60))pc.deployed=false;
   if(!pc.deployed){if(pc.back>0){pc.back-=dt;pc.speed=-7;m.rotation.y+=dt*1.5}else{const want=Math.atan2(-dx,-dz);let da=((want-m.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;m.rotation.y+=Math.max(-2.4*dt,Math.min(2.4*dt,da));pc.speed+=((driving?31:21)*(1-Math.min(.7,Math.abs(da)/2))-pc.speed)*Math.min(1,dt*1.5)}}else pc.speed*=Math.pow(.05,dt)}
  m.position.x+=-Math.sin(m.rotation.y)*pc.speed*dt;m.position.z+=-Math.cos(m.rotation.y)*pc.speed*dt;
  if(collide(m.position,1.9)){pc.speed*=.4;pc.stuck+=dt;if(pc.stuck>1.2){pc.back=1;pc.stuck=0}}else pc.stuck=Math.max(0,pc.stuck-dt);
  for(const w of m.userData.wheels)w.rotation.x-=pc.speed*dt*2;
  pc.hitCD-=dt;if(d<3.6&&pc.hitCD<=0&&Math.abs(pc.speed)>6&&state==='play'){pc.hitCD=1;hurt(driving?6:18);if(driving){driving.speed*=-.3;const push=driving.m.position.clone().sub(m.position).setY(0).normalize();driving.m.position.addScaledVector(push,1.2)}toast('RAMMED!');shake=.5}}
 sirenTick(wanted>0?Math.max(0,1-near/80):0)}
function wantedTick(dt){const th=[1,3,6,10,16];let s=0;for(const t of th)if(wantedScore>=t)s++;
 if(s>wanted&&wanted===0&&s>0)toast('POLICE ARE COMING');wanted=s;
 if(wanted>0){let seen=false;for(const pc of police)if(!pc.dead&&!pc.gone&&pc.m.position.distanceTo(pos)<70)seen=true;for(const c of shooters)if(c.kind==='cop'&&!c.dead&&c.g.position.distanceTo(pos)<55)seen=true;
  if(!seen){evade+=dt;if(evade>7+wanted*3){wantedScore=0;wanted=0;evade=0;toast('Lost the cops');}}else evade=0;
  spawnCD-=dt;const alive=police.filter(p=>!p.dead&&!p.gone).length;if(alive<Math.min(5,wanted)&&spawnCD<=0){spawnCD=4;spawnPolice()}}
 const el=$('stars');let h='';for(let k=0;k<5;k++)h+='<span style="color:'+(k<wanted?((evade>0&&Math.sin(T*10)>0)?'#fff5':'#ffd23f'):'#fff3')+'">★</span>';if(el._h!==h){el.innerHTML=h;el._h=h}}
// ---------- weather ----------
let rain=0,rainTarget=0,weatherT=70;
const rainN=1600,rainGeo=new THREE.BufferGeometry(),rainPos=new Float32Array(rainN*6);rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));
const rainMesh=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xaabbcc,transparent:true,opacity:0}));rainMesh.frustumCulled=false;scene.add(rainMesh);
for(let i=0;i<rainN;i++){rainPos[i*6]=(Math.random()-.5)*60;rainPos[i*6+1]=Math.random()*30;rainPos[i*6+2]=(Math.random()-.5)*60}
function weatherTick(dt){weatherT-=dt;if(weatherT<=0){rainTarget=rainTarget>0?0:1;weatherT=rainTarget?60+Math.random()*50:90+Math.random()*90;}
 rain+=(rainTarget-rain)*Math.min(1,dt*.15);
 const k=1-rain*.5;skyU.top.value.multiplyScalar(k);skyU.bot.value.lerp(new THREE.Color(.35,.37,.4).multiplyScalar(skyU.bot.value.r+.05),rain*.6);sun.intensity*=1-rain*.6;
 rainMesh.material.opacity=rain*.55;if(rain>.02){rainMesh.position.set(cam.position.x,cam.position.y-10,cam.position.z);
  for(let i=0;i<rainN;i++){let y=rainPos[i*6+1]-dt*32;if(y<0)y+=30;rainPos[i*6+1]=y;rainPos[i*6+3]=rainPos[i*6]+.15;rainPos[i*6+4]=y+.9;rainPos[i*6+5]=rainPos[i*6+2]}rainGeo.attributes.position.needsUpdate=true}
 roadMat.roughness=.9-rain*.6}
// ---------- main combat tick ----------
let fireCD=0;
function combatTick(dt){fireCD-=dt;
 if(state==='dead'){deadT-=dt;if(deadT<=0)respawn()}
 if(state==='play'&&(fireId!==null||burstN>0)&&fireCD<=0){fireCD=WEAP[wi].rate;if(burstN>0)burstN--;shoot()}
 for(const t of tracers)if(t.l>0){t.l-=dt;if(t.l<=0)t.m.visible=false}
 for(const q of parts)if(q.m.visible){q.l-=dt;if(q.l<=0){q.m.visible=false;continue}q.v.y+=q.g*dt;q.m.position.addScaledVector(q.v,dt);if(q.m.position.y<.1){q.m.position.y=.1;q.v.multiplyScalar(.5)}q.m.material.opacity=q.l/q.L;q.m.scale.setScalar(q.s*(q.g>-10?1+(1-q.l/q.L)*1.5:1))}
 boomLight.intensity*=Math.pow(.02,dt);flashLight.intensity*=Math.pow(.0001,dt);shake*=Math.pow(.05,dt);dmgFx*=Math.pow(.15,dt);
 shooterTick(dt);policeTick(dt);wantedTick(dt);pickupTick(dt);rocketTick(dt);
 if(state==='play'&&hp<40)hp=Math.min(40,hp+dt*.8);
 const tg=state==='play'?findTarget():null;if(tg){const p=tg.p.clone().setY(tg.p.y+.2).project(cam);if(p.z<1){lockEl.style.display='block';lockEl.style.borderColor=tg.hostile?'#ff3b30':'#ffd23f';lockEl.style.left=((p.x+1)/2*innerWidth)+'px';lockEl.style.top=((1-p.y)/2*innerHeight)+'px'}else lockEl.style.display='none'}else lockEl.style.display='none';
 $('kills').textContent='✖ '+kills;$('hpb').style.width=hp+'%';$('arb').style.width=armor+'%';
 const w=WEAP[wi];$('wpn').innerHTML='<div>'+w.n+'<br><small>'+(w.ammo===Infinity?'∞':w.ammo)+'</small></div>';$('wpn').style.borderColor='#'+w.col.toString(16).padStart(6,'0');
 $('dmg').style.opacity=dmgFx}
// ---------- sky reflections ----------
const pmrem=new THREE.PMREMGenerator(renderer),envScene=new THREE.Scene();envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50,24,12),sky.material));
const envGnd=new THREE.Mesh(new THREE.CircleGeometry(50,16),new THREE.MeshBasicMaterial({color:0x2a2d30}));envGnd.rotation.x=-Math.PI/2;envGnd.position.y=-3;envScene.add(envGnd);
let envRT=null,envT=0;
function envTick(dt){envT-=dt;if(envT>0)return;envT=6;const b=skyU.bot.value;envGnd.material.color.setRGB(b.r*.3,b.g*.3,b.b*.3);const rt=pmrem.fromScene(envScene,0.02);scene.environment=rt.texture;if(envRT)envRT.dispose();envRT=rt}
// ---------- v3: carjacking, tap to shoot, beach ----------
sky.scale.setScalar(.42);sky.renderOrder=-2;stars.scale.setScalar(.45);
{const sand=new THREE.Mesh(new THREE.PlaneGeometry(46,SIZE+400),new THREE.MeshStandardMaterial({color:0xe8d9a0,roughness:1}));sand.rotation.x=-Math.PI/2;sand.position.set(HALF+23,0.02,0);sand.receiveShadow=true;scene.add(sand);
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(700,SIZE+900),new THREE.MeshStandardMaterial({color:0x1a78c2,metalness:.7,roughness:.12}));sea.rotation.x=-Math.PI/2;sea.position.set(HALF+40+350,0.05,0);scene.add(sea);
 for(let z=-HALF;z<HALF;z+=22)tree(HALF+8+Math.random()*14,z+Math.random()*10)}
const fleers=[];
function flee(p){const g=makePerson(new THREE.Color().setHSL(Math.random(),.7,.55),0x333344,[0xf1c27d,0xc68642,0x8d5524][Math.floor(Math.random()*3)]);g.position.set(p.x+2.5,0.3,p.z);scene.add(g);
 const d=new THREE.Vector3(p.x-pos.x,0,p.z-pos.z).normalize();if(!d.lengthSq())d.set(1,0,0);fleers.push({g,d,t:9,w:0})}
function nearestCar(peek){const P=new THREE.Vector3(pos.x,0,pos.z);let best=null,bd=6.5,kind=0;
 for(const c of cars){if(c.dead)continue;const d=c.m.position.distanceTo(P);if(d<bd){bd=d;best=c;kind=0}}
 for(const t of traffic){if(t.dead)continue;const d=t.m.position.distanceTo(P);if(d<bd){bd=d;best=t;kind=1}}
 for(const pc of police){if(pc.dead||pc.gone)continue;const d=pc.m.position.distanceTo(P);if(d<bd){bd=d;best=pc;kind=2}}
 if(peek||!best)return best;
 if(kind===0){toast('Driving! Push up to go');return best}
 const m=best.m,c={m,speed:0,steer:0,hp:best.hp||100};cars.push(c);
 if(kind===1){const t=best;t.m=makeCar(carColors[Math.floor(Math.random()*carColors.length)]);scene.add(t.m);t.pos=t.dir>0?-HALF-20:HALF+20;t.hp=100;placeTraffic(t);flee(m.position);crime(1);toast('CARJACKED!')}
 else{police.splice(police.indexOf(best),1);crime(3);toast('STOLE A COP CAR!')}
 beep(500,.1,.12);return c}
let lockObj=null,lockT=0,burstN=0,tapPt=null,tapT=0;
function tapShoot(x,y){if(state!=='play')return;let best=null,bs=1;
 for(const t of allTargets()){if(Math.hypot(t.p.x-pos.x,t.p.z-pos.z)>85)continue;const p=t.p.clone().project(cam);if(p.z>1)continue;
  const d=Math.hypot((p.x+1)/2*innerWidth-x,(1-p.y)/2*innerHeight-y),dc=t.p.distanceTo(cam.position),thr=38+((t.kind==='ped'||t.kind==='sh')?1.1:2.4)*innerHeight/(1.27*dc);if(d/thr<bs){bs=d/thr;best=t}}
 if(best){lockObj=best.obj;lockT=6;tapPt=null;beep(1500,.05,.08)}
 else{lockObj=null;const v=new THREE.Vector3(x/innerWidth*2-1,-(y/innerHeight)*2+1,.5).unproject(cam).sub(cam.position).normalize();tapPt=cam.position.clone().addScaledVector(v,Math.min(70,v.y<-.01?(cam.position.y-.5)/-v.y:70));tapT=.6}
 burstN=WEAP[wi].rate<.2?4:1}
addEventListener('click',e=>tapShoot(e.clientX,e.clientY));
let carLbl='';
function v3Tick(dt){tapT-=dt;if(lockObj){lockT-=dt;if(fireId!==null)lockT=6;if(lockT<=0)lockObj=null}
 for(let i=fleers.length-1;i>=0;i--){const f=fleers[i];f.t-=dt;if(f.t<=0){scene.remove(f.g);fleers.splice(i,1);continue}f.g.position.addScaledVector(f.d,6*dt);collide(f.g.position,.45);f.g.rotation.y=Math.atan2(-f.d.x,-f.d.z);f.w+=dt*9;animLimbs(f.g,6,f.w);f.g.userData.armL.rotation.x=f.g.userData.armR.rotation.x=-2.6}
 const near=state==='play'&&!driving?nearestCar(true):null,l=driving?'EXIT':(near?(cars.indexOf(near)<0?'STEAL':'DRIVE'):'CAR');
 if(l!==carLbl){carLbl=l;const b=$('car');b.textContent=l;b.style.background=l==='CAR'?'#ffcc3340':(l==='EXIT'?'#ffffff50':'#ffcc33e0');b.style.color=l==='CAR'||l==='EXIT'?'#fff':'#000'}}
const MODS=[];
// ---------- mods ----------
// ---------- real 3D model files: downloaded once at start, shown on nearby cars and people; the code-built models stay as the far-distance and offline fallback ----------
// Credits: people are from the Microsoft Rocketbox Avatar Library (MIT License, Microsoft), converted to GLB with their own walk, run, idle, sit, talk, phone, wave and other animations.
// Sports car by vicent091036 (CC BY). Fallback characters if the Rocketbox files are unreachable: Soldier and Michelle from mixamo.com, avatar from readyplayer.me, via the three.js examples repository.
const rlCDN='https://cdn.jsdelivr.net/gh/mrdoob/three.js@';
let rlHost='https://jacobjburrell.github.io/block-city/models/';
// served from a local test server (python -m http.server in the repo root): use the local models/ folder
try{if(/^https?:$/.test(location.protocol)&&/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname))rlHost=location.origin+'/models/'}catch(e){}
let rlMaxPeople=16,rlMaxCars=6,rlMode='',rlAnims=null,rlAnims2=null,rlCar=null,rlSrc=null,rlT=0,rlMade=0,rlDriver=null,rlLd=null,rlActive=0,rlGpuT=0;
const rlChar={},rlPool={},rlPeople=[],rlCarList=[],rlLive=[],rlNear=[],rlFail={},rlBusy={},rlQueue=[],rlUse={},rlW={};
// avatar variants: each key is a file rb_<key>.glb on rlHost (Microsoft Rocketbox, MIT). They download only when someone of that look first comes near.
const rlCivM=['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12','m13','m14','m15','m16','m17','m18'],rlCivF=['f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12','f13','f14','f15','f16','f17','f18'];
const rlCiv=rlCivM.concat(rlCivF),rlCopV=['cop','cop2','cop3'],rlGangV=['g1','g2','g3','g4'],rlMedV=['med1','med2'],rlRB=['player','cop','g1','m1','f1','m2','f2'];
const rlSex=k=>/^f\d|^med2$/.test(k)?'f':'m',rlPick=a=>a[Math.floor(Math.random()*a.length)];
function rlVary(g){const u=g.userData;if(u.rlSeed!==undefined)return;u.rlSeed=Math.random();u.rlPost=(Math.random()-.3)*.09;u.rlTilt=(Math.random()-.5)*.12;u.rlWalk=Math.random()<.3?'Stroll':'Walk'}
const rlQ=()=>new THREE.Quaternion(),rlV=()=>new THREE.Vector3(),rlCl=(v,a,b)=>Math.max(a,Math.min(b,v));
function rlRecolor(g){try{const b=g.children[0].children;b[0].material.color.set(0x4a3326);b[1].material.color.set(0x2a3040);b[2].material.color.set(0xd9a57a);b[4].material=b[4].material.clone();b[4].material.color.set(0x3a2a1c)}catch(e){}}
{let n=0,gi=0;const order=rlCiv.slice().sort(()=>Math.random()-.5);const reg=g=>{const u=g.userData;if(!u.rlType)u.rlType=order[n%order.length];u.rlIdx=n++;u.rlH=.965+Math.random()*.07;rlVary(g);rlPeople.push(g)};
 const mp=makePerson;makePerson=function(a,b,c){const g=mp(a,b,c);g.userData.rlShirt=new THREE.Color(a);g.userData.rlPants=new THREE.Color(b);reg(g);return g};
 const ms=makeShooter;makeShooter=function(k,x,z){const s=ms(k,x,z);s.g.userData.rlType=k==='cop'?'cop':rlGangV[gi++%rlGangV.length];if(k!=='cop')s.g.userData.rlWalk='WalkCool';return s};
 const mc=makeCar;makeCar=function(a,b){const g=mc(a,b);rlCarList.push(g);return g};
 const mpc=makePoliceCar;makePoliceCar=function(){const c=mpc(),k=c.children.length;c.userData.rlX=[c.children[k-4],c.children[k-3],c.children[k-2],c.children[k-1]];for(const o of c.userData.rlX){o.userData.rlKeep=true;o.userData.y0=o.position.y}return c};
 const ch=char;char=function(m){ch(m);m.userData.rlBurnt=true};
 player.userData.rlType='player';player.userData.rlMe=true;player.userData.rlH=1;rlPeople.push(player);rlRecolor(player);
 for(const p of peds){p.userData.rlShirt=p.children[0].children[0].material.color.clone();p.userData.rlPants=p.children[0].children[1].material.color.clone();reg(p)}
 for(const s of shooters){s.g.userData.rlType=s.kind==='cop'?'cop':rlGangV[gi++%rlGangV.length];rlVary(s.g);if(s.kind!=='cop')s.g.userData.rlWalk='WalkCool';s.g.userData.rlH=.98+Math.random()*.05;rlPeople.push(s.g)}
 for(const c of cars)rlCarList.push(c.m);for(const t of traffic)rlCarList.push(t.m);
 // the same player character, seated, for cars (bikes and boats use the vehicles module's rider, flagged with rlSeat)
 rlDriver=mp(0x4a3326,0x2a3040,0xd9a57a);const du=rlDriver.userData;du.rlType='player';du.rlSeat='car';du.rlH=1;du.rlMe=true;du.rlHideBody=true;rlDriver.children[0].visible=false;rlPeople.push(rlDriver);
 const sh=shoot;shoot=function(){player.userData.rlAimT=T+.55;if(rlDriver)rlDriver.userData.rlAimT=T+.55;sh()};
 const es=enemyShoot;enemyShoot=function(s){if(s&&s.g)s.g.userData.rlAimT=T+1.1;es(s)};
 const dm=damage;damage=function(t,d){if(t&&t.kind==='sh'&&t.obj&&t.obj.g)t.obj.g.userData.rlHitT=T+.3;dm(t,d)};
 const hu=hurt;hurt=function(v){const h0=hp;hu(v);if(hp<h0)player.userData.rlHitT=T+.3}}
function rlBones(root){const m={};root.traverse(o=>{if(o.isBone)m[o.name.replace('mixamorig','')]=o});return m}
function rlTpose(g){const c=g.animations.find(a=>a.name==='TPose');if(c){const mx=new THREE.AnimationMixer(g.scene);mx.clipAction(c).play();mx.setTime(0)}g.scene.updateMatrixWorld(true)}
function rlPrep(key,g,clips){const sc=g.scene,b=rlBones(sc);const top=(b.HeadTop_End||b.Head).getWorldPosition(rlV()).y,foot=(b.LeftToeBase||b.LeftFoot).getWorldPosition(rlV()).y;
 const flip=b.RightArm.getWorldPosition(rlV()).x-b.LeftArm.getWorldPosition(rlV()).x<0;rlChar[key]={scene:sc,clips,scale:2.0/(top-foot),flip,b,vW:1.6,vR:5.5};return rlChar[key]}
function rlBake(C){const S=rlSrc,tb=C.b,names=S.order.filter(n=>tb[n]),rest={},R=rlQ().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI),Ri=R.clone().invert(),out={};
 for(const n of names)rest[n]=tb[n].getWorldQuaternion(rlQ());
 for(const cn of['Idle','Walk','Run']){const clip=S.clips[cn];S.mixer.stopAllAction();S.mixer.clipAction(clip).play();const N=Math.max(2,Math.round(clip.duration*30)),times=[],vals={};for(const n of names)vals[n]=[];
  for(let i=0;i<=N;i++){times.push(clip.duration*i/N);S.mixer.setTime(Math.min(clip.duration*i/N,clip.duration-1e-4));S.scene.updateMatrixWorld(true);const W={};
   for(const n of names){const D=S.bones[n].getWorldQuaternion(rlQ()).multiply(S.restInv[n]);if(C.flip!==S.flip)D.premultiply(R).multiply(Ri);const w=D.multiply(rest[n]);W[n]=w;
    const p=tb[n].parent,pn=p.isBone?p.name.replace('mixamorig',''):'';const l=(W[pn]||p.getWorldQuaternion(rlQ())).clone().invert().multiply(w);vals[n].push(l.x,l.y,l.z,l.w)}}
  out[cn]=new THREE.AnimationClip(cn,clip.duration,names.map(n=>new THREE.QuaternionKeyframeTrack(tb[n].name+'.quaternion',times,vals[n])))}
 S.mixer.stopAllAction();return out}
// Rocketbox avatar: native clips from rb_anims.json (+ the extra set in rb_anims2.json) bound by bone name
function rlMk(C,name,src,A){const a=A&&A[src];if(!a)return null;const b=C.b,sc=a.s?1/a.s:1,times=[],tr=[];for(let i=0;i<a.n;i++)times.push(a.d*i/Math.max(1,a.n-1));
 for(const n in a.q)if(b[n]){const v=a.q[n];if(v.length===4)tr.push(new THREE.QuaternionKeyframeTrack(n+'.quaternion',[0],v.map(x=>x*sc)));else tr.push(new THREE.QuaternionKeyframeTrack(n+'.quaternion',times,sc===1?v:v.map(x=>x*sc)))}
 if(a.p&&b.Bip01){const rp=b.Bip01.position,v=[];for(let i=0;i<a.n;i++)v.push(rp.x,a.p[i*3+1]*C.kk,rp.z);tr.push(new THREE.VectorKeyframeTrack('Bip01.position',times,v))}
 const c=new THREE.AnimationClip(name,a.d,tr);C.clips[name]=c;return c}
// ground speed a locomotion clip was authored at (root motion), so playback can match how fast the person really moves
function rlSpd(src,A){const a=A&&A[src];return a&&a.p?Math.max(.5,Math.abs(a.p[(a.n-1)*3+2]-a.p[2])/a.d*.0112):0}
function rlClip(C,name){if(!C||!C.rb)return C&&C.clips[name]||null;if(C.clips[name])return C.clips[name];if(C.miss[name])return null;
 const A2=rlAnims2;let c=null;if(A2){const s=C.fem&&A2['F'+name]?'F'+name:(A2[name]?name:(name==='SitIdle'&&C.fem&&A2.FSit?'FSit':null));if(s){c=rlMk(C,name,s,A2);if(name==='Sprint')C.vS=rlSpd(s,A2);else if(name==='WalkCool'||name==='Stroll')C['v'+name]=rlSpd(s,A2)}}
 if(!c&&A2)C.miss[name]=1;return c}
function rlHasClip(n){return /^(Idle|Walk|Run|Sit)$/.test(n)||!!(rlAnims2&&(rlAnims2[n]||rlAnims2['F'+n]))}
function rlPrepRB(k,g){const sc=g.scene,b={},A=rlAnims,fem=rlSex(k)==='f';sc.traverse(o=>{if(/^Bip01/.test(o.name))b[o.name]=o;if(o.isMesh)o.frustumCulled=false});const kk=b.Bip01.position.y/90,tex=[];
 sc.traverse(o=>{if(o.isMesh){const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms)if(m.map&&tex.indexOf(m.map)<0){tex.push(m.map);m.map.anisotropy=4}}});
 const C={k,scene:sc,clips:{},miss:{},scale:.0112,flip:true,rb:true,fem,b,kk,tex};
 rlMk(C,'Idle',fem?'FIdle':'Idle',A);rlMk(C,'Walk',fem?'FWalk':'Walk',A);rlMk(C,'Run',fem?'FRun':'Run',A);rlMk(C,'Sit','Sit',A);
 C.vW=rlSpd(fem?'FWalk':'Walk',A)||1.4;C.vR=rlSpd(fem?'FRun':'Run',A)||4;C.sitH=(A.Sit&&A.Sit.p?A.Sit.p[1]:59)*kk*.0112;
 try{sc.updateMatrixWorld(true);const pv=b.Bip01_Pelvis||b.Bip01;C.hip=Math.max(.6,Math.min(1.3,pv.getWorldPosition(rlV()).y*C.scale))}catch(e){C.hip=1}
 rlChar[k]=C;rlT=0}
// ---------- streaming: nothing big downloads before the title screen is up ----------
// While the page builds the city and shows the title only the player's own look (and looks picked in the character screen) download; the crowd's looks
// stream in from 1.6 s after the title is up, and everyone is a code-built person until their HD look arrives.
// Two downloads at a time; parsing is spaced out (one model at a time, a short gap between) so the frame rate does not hitch while walking around.
let rlStream=false,rlPlayT=0,rlParseT=0,rlDeferred=[];const rlPri={},rlBuf=[];
function rlWant(k,first){if(!rlLd||rlChar[k]||rlFail[k]||rlBusy[k])return;if(first)rlPri[k]=1;const i=rlQueue.indexOf(k);if(i>=0){if(first){rlQueue.splice(i,1);rlQueue.unshift(k)}}else if(first)rlQueue.unshift(k);else rlQueue.push(k);rlPump()}
function rlPump(){for(let i=0;i<rlQueue.length&&rlActive<2;){const k=rlQueue[i];if(rlChar[k]||rlFail[k]){rlQueue.splice(i,1);continue}if(!rlStream&&!rlPri[k]){i++;continue}rlQueue.splice(i,1);rlBusy[k]=1;rlActive++;
  const done=()=>{rlActive--;delete rlBusy[k];rlT=0;rlPump()};
  fetch(rlHost+'rb_'+k+'.glb').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(buf=>{rlBuf.push({k,buf,done});if(rlPri[k])rlParseT=0}).catch(()=>{rlFail[k]=1;done()})}}
function rlParseTick(dt){rlParseT-=dt;if(rlParseT>0||!rlBuf.length)return;let j=0;for(let i=0;i<rlBuf.length;i++)if(rlPri[rlBuf[i].k]){j=i;break}const q=rlBuf.splice(j,1)[0];rlParseT=state==='play'?.7:.2;
 try{rlLd.parse(q.buf,rlHost,g=>{try{rlPrepRB(q.k,g)}catch(e){rlFail[q.k]=1;console.log('model',e)}q.done()},()=>{rlFail[q.k]=1;q.done()})}catch(e){rlFail[q.k]=1;q.done()}}
// once the title is up: start streaming the crowd, then the extra animations and the HD sports car
function rlStreamTick(dt){if(rlStream)return;rlPlayT+=state==='chmenu'?0:dt;if(rlPlayT<1.6)return;rlStream=true;rlPump();
 setTimeout(()=>{for(const f of rlDeferred)try{f()}catch(e){}rlDeferred.length=0},2500)}
function rlAct(a,name){let act=a.acts[name];if(act)return act;const c=rlClip(a.C,name);if(!c)return null;act=a.mixer.clipAction(c);act.play();act.setEffectiveWeight(0);if(c.duration>2)act.time=Math.random()*c.duration;a.acts[name]=act;return act}
function rlMake(key){const C=rlChar[key],o=THREE.SkeletonUtils.clone(C.scene),w=new THREE.Group();w.add(o);if(C.flip)w.rotation.y=Math.PI;const mats=[],B={};
 o.traverse(m=>{if(m.isMesh){m.frustumCulled=false;m.castShadow=true;m.material=m.material.clone();m.material.userData.base=m.material.color.clone();mats.push(m.material)}
  if(C.rb&&/^Bip01_((L|R)_(UpperArm|Forearm|Hand|Thigh|Calf|Foot|Clavicle)|Spine1|Spine2|Head|Neck|[LR]Eye(BlinkTop|BlinkBottom)?)$/.test(m.name))B[m.name.slice(6)]=m});
 let gun=null;if(C.rb&&B.R_Hand){gun=new THREE.Mesh(rlGunGeo,rlGunMat);gun.visible=false;B.R_Hand.add(gun)}
 const a={key,C,w,mixer:new THREE.AnimationMixer(o),acts:{},mats,gun,B:C.rb?B:null,g:null,lp:rlV(),sp:0,aim:0,hit:0,yaw:0,hy:0,hp:0,bl:0,blT:1+Math.random()*4,glT:0,gl:0,glp:0,st:0};
 if(C.rb){for(const n of['Idle','Walk','Run','Sit'])rlAct(a,n)}else{for(const n in C.clips){a.acts[n]=a.mixer.clipAction(C.clips[n]);a.acts[n].play();a.acts[n].setEffectiveWeight(0)}}
 if(a.acts.Idle)a.acts.Idle.setEffectiveWeight(1);rlMade++;return a}
function rlFree(a){try{a.mixer.stopAllAction();a.mixer.uncacheRoot(a.w.children[0]);for(const m of a.mats)m.dispose()}catch(e){}rlMade--}
// keep the number of animated character instances bounded: reuse a pooled one, else retire an idle one of another look
function rlGet(key){const pool=rlPool[key]||(rlPool[key]=[]);if(pool.length)return pool.pop();if(rlMade>=rlMaxPeople+8){for(const k in rlPool)if(k!==key&&rlPool[k].length){rlFree(rlPool[k].pop());break}}return rlMade<rlMaxPeople+8?rlMake(key):null}
function rlKey(g){const u=g.userData;let t=u.rlType||'m1';
 if(rlMode==='rb'){if(t==='player')t=chPlayerKey();else{if(t==='sol')t='army';else if(t==='mic')t='f1';else if(t==='rpm')t='m1';
   else if(t==='cop')t=u.rlVar||(u.rlVar=rlPick(rlCopV));else if(t==='gang')t=u.rlVar||(u.rlVar=rlPick(rlGangV));else if(t==='med')t=u.rlVar||(u.rlVar=rlPick(rlMedV));
   if(t===chPlayerKey()&&!u.rlMe){const L=rlSex(t)==='f'?rlCivF:rlCivM;t=L[(L.indexOf(t)+7)%L.length]}}
  if(rlChar[t])return t;if(!rlFail[t])rlWant(t,u.rlMe||u.rlType==='player');
  // stand-in while the right look downloads: another loaded model of the same kind and sex
  const fem=rlSex(t)==='f',pref=/^cop/.test(t)?rlCopV:(/^g\d/.test(t)?rlGangV:(/^med/.test(t)?rlMedV:(t==='army'||t==='swat'?['army','swat','cop']:(fem?rlCivF:rlCivM))));
  let ok=pref.filter(k=>rlChar[k]);if(!ok.length)ok=(fem?rlCivF:rlCivM).filter(k=>rlChar[k]);if(!ok.length)return null;return ok[(u.rlIdx||0)%ok.length]}
 if(u.rlSeat)return null;const f=t==='mic'||t.charAt(0)==='f',m=t==='rpm'||/^m\d/.test(t);t=f?'mic':(m?'rpm':'sol');if(rlChar[t])return t;return t==='sol'?null:(rlChar.rpm?'rpm':(rlChar.mic?'mic':null))}
function rlStart(a,o){const act=rlAct(a,o.name);if(!act)return;act.reset();act.setLoop(o.loop?THREE.LoopRepeat:THREE.LoopOnce,Infinity);act.clampWhenFinished=!o.loop;act.play();if(!o.loop&&!o.until)o.until=T+act.getClip().duration-(o.fade||.3)}
function rlAttach(g){const key=rlKey(g);if(!key)return;const a=rlGet(key);if(!a)return;const u=g.userData,C=a.C,wh=new THREE.Color(1,1,1),h=u.rlH||1,me=u.rlMe||u.rlType==='player';
 for(const m of a.mats){m.color.copy(m.userData.base);if(m.userData.chU)m.userData.chU.chOn.value.set(0,0,0);if(me){if(C.rb)chApplyMat(a,m);continue}
  if(C.rb){if(/body/.test(m.name)){if(u.rlTint)m.color.lerp(u.rlTint,.28);else if(u.rlShirt&&/^[mf]\d/.test(key))m.color.lerp(u.rlShirt,.1)}}
  else if(key==='sol'){if(u.rlTint)m.color.multiply(u.rlTint);else if(u.rlType==='cop')m.color.setHex(0x6f8dff);else if(/^g\d/.test(u.rlType||''))m.color.setHex(0xb98cff)}
  else if(key==='rpm'){if(/Outfit_Top/.test(m.name)&&u.rlShirt)m.color.copy(u.rlShirt).lerp(wh,.8);else if(/Outfit_Bottom/.test(m.name)&&u.rlPants)m.color.copy(u.rlPants).lerp(wh,.5)}else if(u.rlShirt)m.color.copy(u.rlShirt).lerp(wh,.7)}
 a.w.scale.setScalar(C.scale*h);a.w.position.set(0,u.rlSeat?1.05-(C.sitH||.66)*h:0,0);a.w.rotation.set(0,C.flip?Math.PI:0,0);a.aim=0;a.hit=0;a.hy=0;a.hp=0;a.st=0;
 for(const n in a.acts)a.acts[n].setEffectiveWeight(n==='Idle'?1:0);if(u.rlAct&&C.rb)rlStart(a,u.rlAct);
 if(C.gpuFree){C.gpuFree=0}rlUse[key]=T;
 g.children[0].visible=false;g.add(a.w);a.g=g;g.getWorldPosition(a.lp);a.sp=0;a.yaw=g.rotation.y;u.av=a;rlLive.push(a)}
function rlRelease(a){const g=a.g;if(g){g.remove(a.w);if(g.children[0])g.children[0].visible=!g.userData.rlHideBody;g.userData.av=null}a.g=null;(rlPool[a.key]||(rlPool[a.key]=[])).push(a);const i=rlLive.indexOf(a);if(i>=0)rlLive.splice(i,1)}
// ---------- API for other modules (life: crowd behaviour) ----------
// rlPlay(person, 'Phone'|'Text'|'Talk'|'Talk2'|'Listen'|'Laugh'|'Wave'|'Point'|'Cower'|'Angry'|'Nervous'|'Dance'|'Look'|'Wait'|'Idle2'|'SitIdle'|null, {loop:true, fade:.35, dur:seconds, move:false})
// plays a full-body clip while the person stands still (move:true keeps it while walking), null stops it; returns false if the clip is unknown.
function rlPlay(g,name,o){if(!g||!g.userData)return false;const u=g.userData;if(!name){u.rlAct=null;return true}o=o||{};
 const A={name,loop:o.loop!==false,fade:o.fade===undefined?.35:o.fade,move:!!o.move,until:o.dur?T+o.dur:0};u.rlAct=A;if(u.av&&u.av.C.rb)rlStart(u.av,A);return rlHasClip(name)}
// rlIdleVariant(person[,seconds]): a natural idle (look around, wait, shift weight, check phone, text) for a while; returns its name
function rlIdleVariant(g,sec){if(!g)return null;const u=g.userData,L=['Idle2','Look','Wait','Nervous','Text','Look','Idle2'],n=L[Math.floor(Math.random()*L.length)];u.rlIdleV=n;u.rlIdleT=T+(sec||6+Math.random()*9);return n}
// rlLookAt(person, Vector3 | Object3D | null): head turns toward it (null returns to automatic glances)
function rlLookAt(g,t){if(g&&g.userData)g.userData.rlLook=t||null}
function rlClips(){return['Idle','Walk','Run','Sit'].concat(rlAnims2?Object.keys(rlAnims2).filter(k=>!/^F[A-Z]/.test(k)):[])}
// turn one bone so it points along a world direction (used for aiming, sitting, falling, lying dead)
const rlGunGeo=U.mergeBufferGeometries([new THREE.BoxGeometry(17,3,4.2).toNonIndexed().translate(15,2.2,1.5),new THREE.BoxGeometry(4.4,3,10).toNonIndexed().translate(8.5,2.2,-3.5)]),rlGunMat=new THREE.MeshStandardMaterial({color:0x1b1c1f,metalness:.7,roughness:.4});
const rlPa=rlV(),rlPb=rlV(),rlPq=rlQ(),rlPp=rlQ(),rlPi=rlQ(),rlPd=rlV();
function rlPoint(bone,child,dir,w){if(!bone||!child||w<=.01)return;bone.updateWorldMatrix(true,false);child.updateWorldMatrix(false,false);rlPa.setFromMatrixPosition(bone.matrixWorld);rlPb.setFromMatrixPosition(child.matrixWorld).sub(rlPa).normalize();
 rlPq.setFromUnitVectors(rlPb,dir);if(w<1)rlPq.slerp(rlPi.identity(),1-w);bone.parent.getWorldQuaternion(rlPp);bone.quaternion.premultiply(rlPp).premultiply(rlPq).premultiply(rlPi.copy(rlPp).invert())}
function rlTwist(bone,axis,ang){if(!bone)return;bone.parent.getWorldQuaternion(rlPp);rlPq.setFromAxisAngle(axis,ang);bone.quaternion.premultiply(rlPp).premultiply(rlPq).premultiply(rlPi.copy(rlPp).invert())}
function rlCarReady(sc){sc.updateMatrixWorld(true);const wn=['wheel_fl','wheel_fr','wheel_rl','wheel_rr'],B={body:[],glass:[],light:[],rest:[]},wh={},cc=new THREE.Color();
 const geo=(m,rel,c)=>{const g=m.geometry.clone();for(const k of Object.keys(g.attributes))if(k!=='position'&&k!=='normal')g.deleteAttribute(k);if(!g.index){const ix=[];for(let i=0;i<g.attributes.position.count;i++)ix.push(i);g.setIndex(ix)}g.applyMatrix4(rel);
  const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=c.r;a[i*3+1]=c.g;a[i*3+2]=c.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g};
 sc.traverse(m=>{if(!m.isMesh)return;let w=null;for(let p=m.parent;p;p=p.parent)if(wn.indexOf(p.name)>=0){w=p;break}
  if(w){(wh[w.name]=wh[w.name]||{node:w,g:[]}).g.push(geo(m,new THREE.Matrix4().copy(w.matrixWorld).invert().multiply(m.matrixWorld),m.material.color));return}
  const mn=m.material.name,nm=m.name;let b='rest',c=m.material.color;
  if(mn==='Body_Color')b='body';else if(mn==='Glass_Gray')b='glass';else if(nm==='lights'||nm==='leds'){b='light';c=cc.setRGB(2.4,2.3,2)}else if(nm==='lights_red'||nm==='brakes'){b='light';c=cc.setRGB(2.4,.12,.08)}
  B[b].push(geo(m,m.matrixWorld,c))});
 const root=new THREE.Group(),mg=a=>U.mergeBufferGeometries(a),add=(g,mat,name,sh)=>{const m=new THREE.Mesh(g,mat);m.name=name;m.castShadow=!!sh;root.add(m);return m};
 const rest=new THREE.MeshStandardMaterial({vertexColors:true,metalness:.3,roughness:.5});
 add(mg(B.body),rest,'rlBody',1);add(mg(B.rest),rest,'rlRest');add(mg(B.light),new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}),'rlLight');
 add(mg(B.glass),new THREE.MeshStandardMaterial({color:0x10151b,metalness:1,roughness:.05,transparent:true,opacity:.72}),'rlGlass');
 wn.forEach((n,i)=>{const o=new THREE.Group(),inn=new THREE.Group();wh[n].node.matrixWorld.decompose(o.position,o.quaternion,o.scale);inn.name='rlW'+i;inn.add(new THREE.Mesh(mg(wh[n].g),rest));o.add(inn);root.add(o)});
 rlCar={root};rlT=0}
function rlSkin(g){const u=g.userData;if(!u.rlOld){u.rlOld=g.children.filter(o=>!o.userData.rlKeep&&o!==rlDriver);u.rlPaint=g.children[0].material;for(const o of u.rlOld)if(o.isMesh)o.scale.y=.8}
 if(!u.rl){const c=rlCar.root.clone(true);c.getObjectByName('rlBody').material=u.rlPaint;u.rlW=[0,1,2,3].map(i=>c.getObjectByName('rlW'+i));u.rl=c;g.add(c);if(u.rlBurnt){c.traverse(o=>{if(o.material){o.material=o.material.clone();if(o.material.color)o.material.color.multiplyScalar(.12);o.material.vertexColors=false;o.material.needsUpdate=true}})}}}
function rlShow(g,on){const u=g.userData;if(on)rlSkin(g);if(!u.rlOld)return;for(const o of u.rlOld)o.visible=!on;if(u.rl)u.rl.visible=on;if(u.rlX){for(let i=0;i<3;i++)u.rlX[i].position.y=u.rlX[i].userData.y0-(on?.42:.3);u.rlX[3].visible=!on}}
const rlSelP=rlV(),rlShown={};
function rlSelect(){const P=new THREE.Vector3(pos.x,0,pos.z);
 for(let i=rlPeople.length-1;i>=0;i--){const g=rlPeople[i];if(!g.parent&&!g.userData.rlSeat&&g!==player){if(g.userData.av)rlRelease(g.userData.av);rlPeople.splice(i,1)}}
 if(rlMode){const c=[];for(const g of rlPeople){const u=g.userData,vis=g.visible&&!!g.parent;let d=1e9;if(u.rlSeat){if(vis){if(u.rlNpc){g.getWorldPosition(rlSelP);d=Math.hypot(rlSelP.x-P.x,rlSelP.z-P.z)}else d=-.5}}else if(g===player){if(vis)d=-1}else if(g.parent===scene&&vis)d=Math.hypot(g.position.x-P.x,g.position.z-P.z);u.rlD=d;if(d<70&&rlKey(g))c.push(g)}
  c.sort((a,b)=>a.userData.rlD-b.userData.rlD);const top=c.filter((g,i)=>i<rlMaxPeople||g.userData.rlD<0);
  for(const a of rlLive.slice())if(top.indexOf(a.g)<0||rlKey(a.g)!==a.key)rlRelease(a);
  // a look shown for the first time uploads its textures (a frame hitch on phones): at most one new look per pass, the rest stay code-built a moment longer
  let fresh=0;for(const g of top)if(!g.userData.av){const k=rlKey(g);if(k&&!rlShown[k]&&!g.userData.rlMe){if(fresh++)continue;rlShown[k]=1}rlAttach(g)}}
 if(rlCar){for(let i=rlCarList.length-1;i>=0;i--)if(!rlCarList[i].parent)rlCarList.splice(i,1);
  const c=[];for(const g of rlCarList){const d=(driving&&driving.m===g)?-1:g.position.distanceTo(P);g.userData.rlD=d;if(d<60)c.push(g);if(!g.userData.rlOld){const u=g.userData;u.rlOld=g.children.filter(o=>!o.userData.rlKeep&&o!==rlDriver);u.rlPaint=g.children[0].material;for(const o of u.rlOld)if(o.isMesh)o.scale.y=.8}}
  c.sort((a,b)=>a.userData.rlD-b.userData.rlD);const top=c.slice(0,rlMaxCars);for(const g of rlNear)if(top.indexOf(g)<0)rlShow(g,false);for(const g of top)rlShow(g,true);rlNear.length=0;for(const g of top)rlNear.push(g)}}
const rlF=rlV(),rlU=rlV(),rlR=rlV(),rlGq=rlQ(),rlGp=rlV();
function rlDir(f,u,r){return rlPd.set(0,0,0).addScaledVector(rlF,f).addScaledVector(rlU,u).addScaledVector(rlR,r).normalize()}
function rlPose(a,dt){const g=a.g,u=g.userData,B=a.B,seat=u.rlSeat,dead=!seat&&(g.rotation.x<-1||!!u.rlDie),me=g===player;
 if(u.rlDie&&!seat){if(a.gun)a.gun.visible=false;rlDiePose(a);return}
 g.getWorldQuaternion(rlGq);rlF.set(0,0,-1).applyQuaternion(rlGq);rlU.set(0,1,0).applyQuaternion(rlGq);rlR.set(1,0,0).applyQuaternion(rlGq);
 const P=(b,c,f,up,r,w)=>rlPoint(B[b],B[c],rlDir(f,up,r),w===undefined?1:w);
 if(a.gun&&(seat||dead))a.gun.visible=false;
 if(seat){for(const sd of[['L',-1],['R',1]]){const k=sd[0],s=sd[1],ua=k+'_UpperArm',fa=k+'_Forearm',hd=k+'_Hand',th=k+'_Thigh',ca=k+'_Calf',ft=k+'_Foot';
   if(seat==='bike'){P(th,ca,.8,-.3,s*.4);P(ca,ft,-.3,-.95,s*.05);P(ua,fa,.78,-.52,s*.2);P(fa,hd,.95,-.25,-s*.04)}
   else if(seat==='boat'){P(th,ca,.92,-.15,s*.16);P(ca,ft,.3,-.95,0);P(ua,fa,.7,-.6,s*.12);P(fa,hd,.9,.22,-s*.3)}
   else{P(th,ca,.97,.14,s*.13);P(ca,ft,.8,-.58,0);P(ua,fa,.7,-.64,s*.1);P(fa,hd,.9,.3,-s*.3)}}return}
 if(dead){P('R_UpperArm','R_Forearm',-.1,.35,.9);P('R_Forearm','R_Hand',.3,.75,.5);P('L_UpperArm','L_Forearm',-.05,-.3,-.9);P('L_Forearm','L_Hand',.2,-.8,-.5);P('L_Thigh','L_Calf',.05,-.9,-.4);P('R_Calf','R_Foot',.45,-.6,.5);return}
 a.aim+=(((u.rlAimT||0)>T?1:0)-a.aim)*Math.min(1,dt*14);a.hit+=(((u.rlHitT||0)>T?1:0)-a.hit)*Math.min(1,dt*16);
 const chute=me&&((typeof fxChOpen!=='undefined'&&fxChOpen)||(typeof apBail!=='undefined'&&apBail&&apBail.chute));
 if(chute){for(const s of[-1,1]){const k=s<0?'L':'R';P(k+'_UpperArm',k+'_Forearm',.05,.9,s*.4);P(k+'_Forearm',k+'_Hand',0,1,s*.05)}return}
 if(me&&!onGround&&a.aim<.5){for(const s of[-1,1]){const k=s<0?'L':'R';P(k+'_UpperArm',k+'_Forearm',.25,.35,s*.85,.7)}}
 if(a.hit>.02)rlTwist(B.Spine1,rlR,-.4*a.hit);
 if(a.gun)a.gun.visible=a.aim>.3;
 if(a.aim>.02){P('R_UpperArm','R_Forearm',1,-.08,.02,a.aim);P('R_Forearm','R_Hand',1,-.02,-.12,a.aim);P('L_UpperArm','L_Forearm',.72,-.5,.34,a.aim*.9);P('L_Forearm','L_Hand',.7,.28,.66,a.aim*.9)}
 if(u.rlGst)rlGstPose(a,P,dt)}
function rlSeatDriver(){const c=driving,ok=rlMode==='rb'&&rlChar.player&&c&&!c.vhT&&!c.vhBike&&!c.custom&&!c.dead&&c.m.userData.rl&&c.m.userData.rl.visible;
 if(ok){if(rlDriver.parent!==c.m){c.m.add(rlDriver);rlDriver.position.set(-.37,-.58,.34);rlDriver.rotation.set(0,0,0);rlT=0}}else if(rlDriver.parent){rlDriver.parent.remove(rlDriver);if(rlDriver.userData.av)rlRelease(rlDriver.userData.av)}}
// free the GPU copy of looks nobody has used for a while (they upload again when needed), so wandering the city does not keep piling up texture memory
function rlGpuTrim(){for(const k in rlChar){const C=rlChar[k];if(!C||!C.rb||C.gpuFree||k===chPlayerKey())continue;if(rlLive.some(a=>a.key===k))rlUse[k]=T;else if(T-(rlUse[k]||0)>30){for(const t of C.tex)t.dispose();C.gpuFree=1;delete rlShown[k]}}}
const rlHd=rlV(),rlTg=rlV();
// living layer on top of the clips: head turns toward people and the player, glances around, blinks, breathes, has a personal posture
function rlLife(a,dt,s){const g=a.g,u=g.userData,B=a.B;if(!B||!B.Head)return;
 g.getWorldQuaternion(rlGq);rlF.set(0,0,-1).applyQuaternion(rlGq);rlU.set(0,1,0).applyQuaternion(rlGq);rlR.set(1,0,0).applyQuaternion(rlGq);
 if(!u.rlSeat){if(u.rlPost)rlTwist(B.Spine1,rlR,-u.rlPost*(s>3?.4:1));if(s<.5&&B.Spine2)rlTwist(B.Spine2,rlR,Math.sin(T*1.6+(u.rlSeed||0)*9)*.014)}
 let ty=0,tp=0,have=false;const L=u.rlLook,me=g===player||u.rlMe;
 if(L||!me){B.Head.updateWorldMatrix(true,false);rlHd.setFromMatrixPosition(B.Head.matrixWorld);
  if(L){if(L.isVector3)rlTg.copy(L);else if(L.getWorldPosition){L.getWorldPosition(rlTg);rlTg.y+=L.isGroup?1.7:0}else if(L.position)rlTg.copy(L.position);have=true}
  else if(!driving&&state==='play'){const dx=pos.x-rlHd.x,dz=pos.z-rlHd.z;if(dx*dx+dz*dz<70){rlTg.set(pos.x,pos.y+1.65,pos.z);have=true}}
  if(have){rlTg.sub(rlHd);const f=rlTg.dot(rlF),r=rlTg.dot(rlR),up=rlTg.dot(rlU);ty=-Math.atan2(r,f);tp=Math.atan2(up,Math.hypot(f,r));if(Math.abs(ty)>1.75){ty=0;tp=0}}
  else{a.glT-=dt;if(a.glT<=0){a.glT=1.5+Math.random()*4;const q=Math.random();a.gl=q<.45?0:(Math.random()-.5)*1.5;a.glp=(Math.random()-.55)*.35}ty=a.gl;tp=a.glp}}
 ty=rlCl(ty,-1.15,1.15);tp=rlCl(tp,-.5,.4);if(s>3){ty*=.4;tp*=.4}
 const k=Math.min(1,dt*(have?5:2.5));a.hy+=(ty-a.hy)*k;a.hp+=(tp-a.hp)*k;
 if(Math.abs(a.hy)>.005||Math.abs(a.hp)>.005){rlTwist(B.Neck,rlU,a.hy*.38);rlTwist(B.Head,rlU,a.hy*.62);rlTwist(B.Neck,rlR,a.hp*.35);rlTwist(B.Head,rlR,a.hp*.65)}
 if(u.rlTilt)rlTwist(B.Head,rlF,u.rlTilt*.5);
 a.blT-=dt;if(a.blT<=0){a.blT=2+Math.random()*4.5;a.bl=.16}
 if(a.bl>0){a.bl-=dt;const c=Math.sin(Math.max(0,a.bl)/.16*Math.PI);rlTwist(B.LEyeBlinkTop,rlR,-c*rlBlinkA);rlTwist(B.REyeBlinkTop,rlR,-c*rlBlinkA);rlTwist(B.LEyeBlinkBottom,rlR,c*rlBlinkA*.3);rlTwist(B.REyeBlinkBottom,rlR,c*rlBlinkA*.3)}}
let rlBlinkA=.45;
let rlBootEl=document.getElementById('rlBoot');
function rlTick(dt){if(rlBootEl){const e=rlBootEl;rlBootEl=null;e.style.opacity=0;setTimeout(()=>{if(e.parentNode)e.parentNode.removeChild(e)},450)}
 rlStreamTick(dt);if(rlLd)rlParseTick(dt);chTick(dt);rlSeatDriver();rlT-=dt;if(rlT<=0){rlT=.35;try{rlSelect()}catch(e){console.log('rl',e)}}
 rlGpuT-=dt;if(rlGpuT<=0){rlGpuT=5;try{rlGpuTrim()}catch(e){}}
 try{rlDieTick(dt);rlDrvTick(dt)}catch(e){if(rlErr++<3)console.log('rl',e)}
 for(const a of rlLive){const g=a.g,u=g.userData,C=a.C,seat=u.rlSeat,dead=!seat&&(g.rotation.x<-1||!!u.rlDie),air=g===player&&!onGround;
  g.getWorldPosition(rlGp);const d=seat?0:Math.hypot(rlGp.x-a.lp.x,rlGp.z-a.lp.z)/Math.max(dt,.001);a.lp.copy(rlGp);a.sp+=(Math.min(d,16)-a.sp)*Math.min(1,dt*8);
  const s=a.sp,want=rlW;for(const n in want)delete want[n];
  let ov=u.rlAct;if(ov&&ov.until&&T>ov.until){u.rlAct=ov=null}if(u.rlIdleV&&T>(u.rlIdleT||0))u.rlIdleV=null;
  a.st=s<.25?a.st+dt:0;if(C.rb&&!ov&&!u.rlIdleV&&!u.rlMe&&a.st>5&&Math.random()<dt*.15)rlIdleVariant(g);
  const ovOn=C.rb&&ov&&!seat&&!dead&&!air&&s<(ov.move?12:.8)&&rlAct(a,ov.name);
  if(seat){want.Sit=1}else if(dead)want.Idle=1;else if(ovOn)want[ov.name]=1;else if(air)want.Run=1;
  else{const r=rlCl((s-2.6)/2.2,0,1),k=rlCl((s-.12)/.6,0,1),sp=C.rb&&C.vR&&s>C.vR*1.12&&rlAct(a,'Sprint')?rlCl((s-C.vR*1.12)/(C.vR*.55),0,1):0,
    wk=C.rb&&u.rlWalk&&u.rlWalk!=='Walk'&&rlAct(a,u.rlWalk)?u.rlWalk:'Walk',iv=C.rb&&u.rlIdleV&&rlAct(a,u.rlIdleV)?u.rlIdleV:'Idle';
   want.Run=r*(1-sp);if(sp)want.Sprint=r*sp;want[wk]=(want[wk]||0)+k*(1-r);want[iv]=(want[iv]||0)+1-k}
  const fr=dead||seat?30:9,fo=ov?1/Math.max(.08,ov.fade||.3):9;
  for(const n in a.acts){const act=a.acts[n],w=act.getEffectiveWeight(),tw=want[n]||0;if(w===0&&tw===0)continue;let nw=w+(tw-w)*Math.min(1,dt*(ov&&n===ov.name?fo:fr));if(tw===0&&nw<.004)nw=0;act.setEffectiveWeight(nw)}
  if(a.acts.Walk)a.acts.Walk.timeScale=rlCl(s/C.vW,.55,1.7);if(a.acts.Run)a.acts.Run.timeScale=air?.35:rlCl(s/C.vR,.75,want.Sprint?1.3:1.75);
  if(a.acts.Sprint)a.acts.Sprint.timeScale=rlCl(s/(C.vS||7),.8,1.6);for(const n of['WalkCool','Stroll'])if(a.acts[n])a.acts[n].timeScale=rlCl(s/(C['v'+n]||C.vW),.55,1.7);
  a.mixer.update(dead?0:dt);
  if(!seat&&!dead){let dy=g.rotation.y-a.yaw;dy=((dy+Math.PI*3)%(Math.PI*2))-Math.PI;a.yaw=g.rotation.y;const lean=rlCl(-dy/Math.max(dt,.001)*.045*Math.min(1,s/5),-.22,.22);a.w.rotation.z+=(lean-a.w.rotation.z)*Math.min(1,dt*6)}else a.w.rotation.z=0;
  if(u.rlDie&&!seat){try{rlDiePose(a)}catch(e){if(rlErr++<3)console.log('rl die',e)}}
  else if(a.B){try{rlPose(a,dt)}catch(e){}if(!dead)try{rlLife(a,dt,s)}catch(e){}}}
 for(const g of rlNear){const u=g.userData;if(u.rlW&&u.wheels)for(let i=0;i<4;i++)if(u.wheels[i])u.rlW[i].rotation.x=u.wheels[i].rotation.x}}
// ---------- deaths: a ragdoll-like fall (stagger, knees give, the body hits the ground and settles) that stays down ----------
// rlKill(person, from, kind): from = where the hit came from (Vector3), kind 'shot'|'player'|'car'|'boom'|'eject'. Works on HD avatars (bones) and code-built people (limb groups).
const rlDying=[],rlKq=rlQ(),rlKq2=rlQ(),rlKv=rlV(),rlKw=rlV(),rlAX=new THREE.Vector3(1,0,0),rlAY=new THREE.Vector3(0,1,0),rlWup=new THREE.Vector3(0,1,0),rlKt=rlV();
let rlErr=0,rlBoomP=null,rlHitFrom=null;
const rlKinds={shot:[.16,.72,.55,0,1,.8],player:[.3,.85,.6,0,1,.8],car:[0,.62,2,.55,.3,1],boom:[0,.85,3.6,1.15,.3,1],eject:[.05,.7,.7,.15,.6,.6]}; // stagger, fall time, slide, lift, knees, flail
function rlKill(g,from,kind,spd){if(!g||!g.userData)return;const u=g.userData;if(u.rlDie)return;kind=rlKinds[kind]?kind:'shot';const K=rlKinds[kind];
 const yaw=g.rotation.y,c=Math.cos(yaw),s=Math.sin(yaw);let fx=from?g.position.x-from.x:0,fz=from?g.position.z-from.z:0,l=Math.hypot(fx,fz);
 if(l<.05){const b=Math.random()<.6?1:-1;fx=s*b;fz=c*b;l=1}fx/=l;fz/=l;
 const lx=fx*c-fz*s,lz=fx*s+fz*c,fd=lz<0;let dl=fd?Math.atan2(-lx,-lz):Math.atan2(lx,lz);dl=rlCl(dl+(Math.random()-.5)*.5,-1.25,1.25);
 let sl=K[2]*(.8+Math.random()*.4);if(kind==='car')sl=Math.min(7,2+(spd||10)*.16);
 // do not slide through walls
 rlKt.set(g.position.x+fx*sl,g.position.y,g.position.z+fz*sl);if(collide(rlKt,.55))sl=Math.max(0,(rlKt.x-g.position.x)*fx+(rlKt.z-g.position.z)*fz-.35);
 g.rotation.x=0;g.rotation.z=0;
 u.rlDie={t:0,k:kind,fd,dl,lx,lz,sl,st:K[0],dur:K[1],lift:K[3]*(kind==='car'?Math.min(1.6,.6+(spd||10)*.03):1),kn:K[4],fl:K[5],sd:Math.random()<.5?1:-1,cur:null};
 if(rlDying.indexOf(g)<0)rlDying.push(g)}
function rlDieCur(D,H){const t=D.t,p=rlCl((t-D.st)/D.dur,0,1),e=p*p,sm=p*p*(3-2*p),lean=.2*rlCl(t/Math.max(.01,D.st),0,1)*(1-p);
 let th=lean+(Math.PI/2-lean)*e,hy=H-(H-.13)*Math.pow(e,.85)-.07*lean/.2+D.lift*Math.sin(p*Math.PI)*(1-p*.3);
 if(p>=1){const b=t-D.st-D.dur;hy+=.07*Math.abs(Math.sin(b*11))*Math.exp(-b*7)}
 return {th,hy,sf:(D.k==='car'||D.k==='boom')?Math.min(1,p*1.15):sm,dl:D.dl*sm,kn:Math.sin(p*Math.PI)*D.kn,fl:Math.sin(Math.min(1,p*1.3)*Math.PI)*D.fl,L:rlCl((p-.5)/.5,0,1)}}
// body root: twist toward the fall, tip over around the hip, the hip drops to the ground and slides
function rlDieRoot(node,D,c,H,flip){rlKq.setFromAxisAngle(rlAY,c.dl);rlKq2.setFromAxisAngle(rlAX,D.fd?-c.th:c.th);rlKq.multiply(rlKq2);
 rlKv.set(D.lx*D.sl*c.sf,c.hy,D.lz*D.sl*c.sf);rlKw.set(0,H,0).applyQuaternion(rlKq);node.position.copy(rlKv).sub(rlKw);node.quaternion.copy(rlKq);if(flip)node.quaternion.multiply(rlKq2.setFromAxisAngle(rlAY,Math.PI))}
function rlDiePose(a){const g=a.g,u=g.userData,D=u.rlDie,B=a.B,C=a.C,H=(C.hip||1)*(u.rlH||1);if(!D)return;const c=D.cur||(D.cur=rlDieCur(D,H));
 rlDieRoot(a.w,D,c,H,C.flip);if(!B)return;
 g.getWorldQuaternion(rlGq);rlGq.multiply(rlKq.setFromAxisAngle(rlAY,c.dl)).multiply(rlKq2.setFromAxisAngle(rlAX,D.fd?-c.th:c.th));
 rlF.set(0,0,-1).applyQuaternion(rlGq);rlU.set(0,1,0).applyQuaternion(rlGq);rlR.set(1,0,0).applyQuaternion(rlGq);
 const sd=D.sd,L=c.L,fl=c.fl*(1-L),kn=c.kn*(1-L);
 // limb directions in the body frame (toward head, body right, chest) plus world up so limbs rest on, not under, the ground
 const Q=(b,ch,uu,r,f,up,w)=>{if(w<=.01||!B[b]||!B[ch])return;rlPd.set(0,0,0).addScaledVector(rlU,uu).addScaledVector(rlR,r).addScaledVector(rlF,f).addScaledVector(rlWup,up).normalize();rlPoint(B[b],B[ch],rlPd,w)};
 for(const s of[-1,1]){const k=s<0?'L':'R',m=s===sd;
  if(D.fd){Q(k+'_UpperArm',k+'_Forearm',.05,s*.4,.75,0,fl);Q(k+'_Forearm',k+'_Hand',.1,s*.15,.9,0,fl)}// reach out to break the fall
  else{Q(k+'_UpperArm',k+'_Forearm',.3,s*.55,.5,.2,fl);Q(k+'_Forearm',k+'_Hand',.6,s*.3,.4,.3,fl)}// arms fly up
  Q(k+'_Thigh',k+'_Calf',-1,s*.1,kn*.9,0,kn);Q(k+'_Calf',k+'_Foot',-1,s*.05,-kn*.8,0,kn);
  if(m){Q(k+'_UpperArm',k+'_Forearm',.2,s*.85,0,.05,L);Q(k+'_Forearm',k+'_Hand',.7,-s*.45,0,.05,L)}// one arm bent up by the head
  else{Q(k+'_UpperArm',k+'_Forearm',-.7,s*.55,0,.05,L);Q(k+'_Forearm',k+'_Hand',-.75,s*.4,0,.05,L)}// the other loose by the side
  if(D.fd){Q(k+'_Thigh',k+'_Calf',-1,s*.17,0,.03,L);Q(k+'_Calf',k+'_Foot',m?-.75:-1,s*.07,0,m?.5:.03,L)}
  else{Q(k+'_Thigh',k+'_Calf',m?-.82:-1,s*(m?.25:.15),0,m?.48:.03,L);Q(k+'_Calf',k+'_Foot',-1,s*.08,0,m?-.4:.02,L)}}
 if(L>.02){rlTwist(B.Head,rlU,sd*.75*L);rlTwist(B.Spine1,rlF,sd*.1*L)}
 if(c.fl>.02&&B.Spine1)rlTwist(B.Spine1,rlR,(D.fd?.25:-.3)*c.fl*(1-L))}
function rlDieLimbs(g,D,c){const u=g.userData;if(!u.armL)return;const L=c.L,fl=c.fl*(1-L);
 u.armL.rotation.z=-(.25+.9*Math.max(L,fl));u.armR.rotation.z=.25+.9*Math.max(L,fl);u.legL.rotation.z=-.12*L;u.legR.rotation.z=.12*L;
 u.armL.rotation.x=u.armR.rotation.x=fl*.8;u.legL.rotation.x=u.legR.rotation.x=c.kn*.9*(1-L)}
function rlRevive(g){const u=g.userData;if(!u)return;u.rlDie=null;const b=g.children[0];if(b&&b.isGroup&&b!==(u.av&&u.av.w)){b.position.set(0,0,0);b.quaternion.identity()}
 for(const k of['armL','armR','legL','legR'])if(u[k])u[k].rotation.z=0;const a=u.av;if(a&&a.w){a.w.position.set(0,u.rlSeat?a.w.position.y:0,0);a.w.rotation.set(0,a.C.flip?Math.PI:0,0)}}
function rlDieTick(dt){for(let i=rlDying.length-1;i>=0;i--){const g=rlDying[i],u=g.userData,D=u.rlDie;if(!D){rlDying.splice(i,1);continue}
  const alive=g===player?state!=='dead':(u.rlSh?!u.rlSh.dead:(u.path?!u.dead:false));
  if(alive||(!g.parent&&g!==player)){rlRevive(g);rlDying.splice(i,1);continue}
  D.t+=dt;D.cur=null;const b=g.children[0];if(b&&b.isGroup){const c=rlDieCur(D,1.05);rlDieRoot(b,D,c,1.05,false);rlDieLimbs(g,D,c)}}
 // GTA-style: the camera lifts to look down at your body while WASTED is on screen
 if(state==='dead'&&!driving){camPitch+=(.62-camPitch)*Math.min(1,dt*.9)}}
function rlKind(from){if(from&&from===rlBoomP)return 'boom';if(driving&&driving.m&&from===driving.m.position)return 'car';return 'shot'}
{const kp=killPed;killPed=function(q,from){const was=q.userData.dead;kp(q,from);if(!was&&q.userData.dead){q.userData.deadT=1;rlKill(q,from,rlKind(from),driving?Math.abs(driving.speed||0):0)}}}
{const ks=killShooter;killShooter=function(s,from){const was=s.dead;ks(s,from);if(!was&&s.dead&&s.g){s.deadT=Math.max(s.deadT,.35);s.g.userData.rlSh=s;rlKill(s.g,from,rlKind(from),driving?Math.abs(driving.speed||0):0)}}}
{const ex=explode;explode=function(p){const o=rlBoomP;rlBoomP=p;try{ex(p)}finally{rlBoomP=o}}}
{const es2=enemyShoot;enemyShoot=function(s){rlHitFrom=s&&s.g?s.g.position.clone():null;es2(s)}}
{const ex2=explode;explode=function(p){if(p&&Math.hypot(p.x-pos.x,p.z-pos.z)<10)rlHitFrom=p.clone();ex2(p)}}
// the player: on foot falls where they stand; in a car the body ends up beside the driver's door
let rlPitch0=null;
function rlPlayerDown(dv,from){let kind='player';rlPitch0=camPitch;
 if(dv&&dv.m){const m=dv.m,y=m.rotation.y,c=Math.cos(y),s=Math.sin(y),side=dv.vhBike?-.6:-1.75;pos.x=m.position.x+c*side+s*.3;pos.z=m.position.z-s*side+c*.3;
  let gy=chGround(pos.x,pos.z);pos.y=gy>.31?gy-.3:.3;collide(pos,.5);facing=y;player.rotation.y=y;from=m.position.clone();kind='eject'}
 player.position.copy(pos);player.visible=true;rlKill(player,from,kind)}
{const d0=die;die=function(){const dv=driving,from=rlHitFrom;d0();try{rlPlayerDown(dv,from)}catch(e){console.log('rl die',e)}rlHitFrom=null}}
{const r0=respawn;respawn=function(){rlRevive(player);const i=rlDying.indexOf(player);if(i>=0)rlDying.splice(i,1);if(rlPitch0!==null){camPitch=rlPitch0;rlPitch0=null}r0()}}
// ---------- gestures: procedural arm poses layered on the clips (Rocketbox has no fight or surrender clips) ----------
// rlGesture(person,'hands'|'scared'|'guard'|'punch'|'stagger'|'point', seconds[, target Vector3/Object3D]); null clears
function rlGesture(g,n,dur,tg){if(!g||!g.userData)return;const u=g.userData;if(!n){u.rlGst=null;return}u.rlGst={n,t0:T,d:dur||1,tg:tg||null,sd:n==='punch'?(u.rlPunchS=-(u.rlPunchS||-1)):(Math.random()<.5?1:-1)}}
function rlGstPose(a,P,dt){const g=a.g,u=g.userData,G=u.rlGst,B=a.B;if(!G)return;const t=T-G.t0;if(t>G.d){u.rlGst=null;return}
 const w=Math.max(0,Math.min(1,t/.16,(G.d-t)/.2));if(w<=0)return;
 if(G.n==='hands'){for(const s of[-1,1]){const k=s<0?'L':'R';P(k+'_UpperArm',k+'_Forearm',.12,.72,s*.66,w);P(k+'_Forearm',k+'_Hand',.08,1,s*.06,w)}}
 else if(G.n==='scared'){for(const s of[-1,1]){const k=s<0?'L':'R';P(k+'_UpperArm',k+'_Forearm',.62,.12,s*.34,w);P(k+'_Forearm',k+'_Hand',.22,.95,-s*.3,w)}if(B.Spine1)rlTwist(B.Spine1,rlR,.2*w)}
 else if(G.n==='guard'||G.n==='punch'){for(const s of[-1,1]){const k=s<0?'L':'R';P(k+'_UpperArm',k+'_Forearm',.38,-.62,s*.4,w);P(k+'_Forearm',k+'_Hand',.32,1,-s*.18,w)}
  if(G.n==='punch'){const s=G.sd,k=s<0?'L':'R',p=t/G.d,wind=p<.3?Math.sin(p/.3*Math.PI*.5):Math.max(0,1-(p-.3)/.12),ex=p<.3?0:(p<.5?(p-.3)/.2:Math.max(0,1-(p-.5)/.35));
   if(wind>.01){P(k+'_UpperArm',k+'_Forearm',-.3,-.45,s*.6,wind*w);P(k+'_Forearm',k+'_Hand',.75,.65,0,wind*w)}
   if(ex>.01){P(k+'_UpperArm',k+'_Forearm',1,.1,-s*.1,ex*w);P(k+'_Forearm',k+'_Hand',1,.08,-s*.06,ex*w)}
   if(B.Spine1)rlTwist(B.Spine1,rlU,-s*(.4*ex-.25*wind)*w)}}
 else if(G.n==='stagger'){const p=t/G.d,k2=Math.sin(Math.min(1,p*1.6)*Math.PI)*w;if(B.Spine1)rlTwist(B.Spine1,rlR,-.5*k2);if(B.Head)rlTwist(B.Head,rlR,-.35*k2);
  for(const s of[-1,1]){const k=s<0?'L':'R';P(k+'_UpperArm',k+'_Forearm',.3,-.25,s*.9,k2*.8)}}
 else if(G.n==='point'&&G.tg){const tp=G.tg.isVector3?G.tg:G.tg.position;if(tp){rlPd.set(tp.x-g.position.x,.3*Math.hypot(tp.x-g.position.x,tp.z-g.position.z)/8,tp.z-g.position.z).normalize();rlPoint(B.R_UpperArm,B.R_Forearm,rlPd,w);rlPoint(B.R_Forearm,B.R_Hand,rlPd,w)}}}
// shooters that are hit but not killed stagger back a little
{const dm2=damage;damage=function(t,d){const s=t&&t.kind==='sh'?t.obj:null,h0=s?s.hp:0;dm2(t,d);if(s&&!s.dead&&s.hp<h0&&s.g){rlGesture(s.g,'stagger',.45);const dx=s.g.position.x-pos.x,dz=s.g.position.z-pos.z,l=Math.hypot(dx,dz)||1;s.g.position.x+=dx/l*.3;s.g.position.z+=dz/l*.3;collide(s.g.position,.45)}}}
// ---------- NPC drivers: a seated person behind the wheel of traffic, police, ambulances and island cars near you ----------
const rlDrv=[],rlDrvL=[],rlDrvN=[];let rlDrvT=0,rlDrvMax=6;
function rlDrvMake(){const g=makePerson(0x3a4250,0x23262e,[0xf1c27d,0xc68642,0x8d5524,0xe0ac69][Math.floor(Math.random()*4)]),u=g.userData;u.rlSeat='car';u.rlNpc=1;u.rlKeep=true;
 g.traverse(o=>{if(o.isMesh)o.castShadow=false});u.legL.rotation.x=u.legR.rotation.x=1.45;u.armL.rotation.x=u.armR.rotation.x=1.05;
 const ch=g.children[0].children[0],ob=ch.onBeforeRender;ch.onBeforeRender=function(){ob.apply(this,arguments);u.kneeL.rotation.x=u.kneeR.rotation.x=-1.5};const d={g,car:null};rlDrv.push(d);return d}
// seat from the car's shape: isles car specs give cabin, roof and belt line; plain city cars use the sports-car seat
function rlDrvSeat(m){const u=m.userData;if(u.rlSeatP)return u.rlSeatP;let x=-.4,y=.47,z=.34;const S=u.isType&&typeof isSpecs!=='undefined'?isSpecs[u.isType]:null;
 if(S){if(S.box){x=-S.W/2+.62;y=S.belt-.22;z=-S.L/2+S.ws+.5}else{const a=S.cf-S.rf,b=S.cr+(S.rr||0);x=-S.W/2+.6;y=Math.max(S.gc+.1,Math.min(S.belt-.38,S.roof-.98));z=Math.min(-Math.max(a,b)+.3,-(a+b)/2+.05)}}
 const sc=m.scale;return u.rlSeatP={x:x/sc.x,y:(y-1.05)/sc.y,z:z/sc.z,s:[1/sc.x,1/sc.y,1/sc.z]}}
function rlDrvCars(out){out.length=0;for(const t of traffic)if(!t.dead&&t.m)out.push(t.m);for(const pc of police)if(!pc.dead&&!pc.gone&&!pc.deployed)out.push(pc.m);
 for(const c of cars)if(c.isLoop&&!c.dead&&c!==driving&&c.m)out.push(c.m);
 if(typeof lfAmb!=='undefined'&&lfAmb&&lfAmb.m&&(lfAmb.ph===0||lfAmb.ph===4))out.push(lfAmb.m);return out}
// the shared car glass is opaque; cars with a driver get a tinted see-through copy while the driver sits in them
let rlGlassT=null;
function rlDrvGlass(m,on){if(!CM||!CM.glass)return;if(!rlGlassT){rlGlassT=CM.glass.clone();rlGlassT.transparent=true;rlGlassT.opacity=.55;rlGlassT.roughness=.08}
 for(const o of m.children)if(o.isMesh){if(on&&o.material===CM.glass)o.material=rlGlassT;else if(!on&&o.material===rlGlassT)o.material=CM.glass}}
function rlDrvOff(d){const g=d.g;if(d.car)rlDrvGlass(d.car,false);if(g.parent)g.parent.remove(g);if(g.userData.av)rlRelease(g.userData.av);d.car=null}
function rlDrvOn(d,m){const S=rlDrvSeat(m),g=d.g,u=g.userData;g.position.set(S.x,S.y,S.z);g.scale.set(S.s[0],S.s[1],S.s[2]);g.rotation.set(0,0,0);m.add(g);d.car=m;rlDrvGlass(m,true);
 const cop=!!m.userData.red,med=m.userData.isType==='ambulance'||(typeof lfAmb!=='undefined'&&lfAmb&&lfAmb.m===m),ty=cop?'cop':(med?'med':null);
 if(ty){if(u.rlType!==ty){u.rlType=ty;u.rlVar=null}}else if(u.rlType==='cop'||u.rlType==='med'||!u.rlType){u.rlType=rlPick(rlCiv);u.rlVar=null}
 try{g.children[0].children[0].material.color.setHex(cop?0x1d3557:(med?0xf2f2f2:new THREE.Color().setHSL(Math.random(),.5,.45).getHex()))}catch(e){}rlT=0}
// a car that burns loses its driver first (char() would blacken the pooled person for good)
{const c0=char;char=function(m){for(const d of rlDrv)if(d.car===m)rlDrvOff(d);c0(m)}}
function rlDrvTick(dt){for(const d of rlDrv){const m=d.car;if(m&&(!m.parent||(driving&&driving.m===m)))rlDrvOff(d)}
 rlDrvT-=dt;if(rlDrvT>0)return;rlDrvT=.4;const L=rlDrvCars(rlDrvL),N=rlDrvN;N.length=0;
 for(const m of L){const dd=Math.hypot(m.position.x-pos.x,m.position.z-pos.z),S=m.userData.isType&&typeof isSpecs!=='undefined'?isSpecs[m.userData.isType]:null;if(S&&S.box)continue;// vans, trucks and buses have a solid cab: nobody to see
  if(dd<46&&!(driving&&driving.m===m))N.push([dd,m])}N.sort((a,b)=>a[0]-b[0]);if(N.length>rlDrvMax)N.length=rlDrvMax;
 for(const d of rlDrv)if(d.car&&!N.some(x=>x[1]===d.car))rlDrvOff(d);
 for(const x of N){const m=x[1];if(rlDrv.some(d=>d.car===m))continue;let d=rlDrv.find(d=>!d.car);if(!d){if(rlDrv.length>=rlDrvMax)break;d=rlDrvMake()}rlDrvOn(d,m)}}
// ---------- character select, outfits and spawn point (GTA-style) ----------
const chChoices=[{k:'player',n:'Marcus',fb:[0x4a3326,0x2a3040,0xd9a57a]},{k:'m3',n:'Andre',fb:[0x3b5b8a,0x2a3550,0x6b4a33]},{k:'m9',n:'Tyler',fb:[0xb3261e,0x2f3d5a,0xe0b89a]},
 {k:'m13',n:'Daniel',fb:[0x8a8f98,0xb9a27a,0xd8b090]},{k:'m16',n:'Leo',fb:[0x1f3a68,0xf2f2f2,0xd9a57a]},{k:'f12',n:'Jess',fb:[0x5a5a5a,0x3a5a8a,0xf0c8a8]},
 {k:'f8',n:'Maya',fb:[0x5a3a24,0x3a5a8a,0xc89070]},{k:'f18',n:'Nina',fb:[0x9a9a9a,0x222222,0xe0b090]},{k:'f16',n:'Claire',fb:[0x2a2e3a,0x1d1f24,0xf0c8a8]}];
const chPal=[-1,0xf2f2f2,0x1d1f24,0xb3261e,0x1f3a68,0x3f6b3a,0xc8b48a,0x7a7f87,0xd97aa6,0x1f7a7a,0xe0a020],chShoe=[-1,0xf2f2f2,0x1d1f24,0x5a3a24,0xb3261e,0x1f3a68];
let chS={k:'player',name:'',top:-1,bot:-1,shoe:-1,spawn:'last',last:null};
try{const j=JSON.parse(localStorage.getItem('blockcity_char')||'null');if(j)for(const k in chS)if(j[k]!==undefined)chS[k]=j[k]}catch(e){}
function chSave(){try{localStorage.setItem('blockcity_char',JSON.stringify(chS))}catch(e){}}
function chChoice(){for(const c of chChoices)if(c.k===chS.k)return c;return chChoices[0]}
function chPlayerKey(){const k=chS.k;return(k!=='player'&&chChoices.some(c=>c.k===k)&&!rlFail[k])?k:'player'}
function chName(){return chS.name||chChoice().n}
// clothes mask: which parts of the body texture are top / bottom / shoes, from the skinning weights, minus visible skin
const chMasks={};
function chMask(C){if(chMasks[C.k]!==undefined)return chMasks[C.k];let tex=null;try{const S=256,mk=()=>{const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,S,S);return[c,x]};
  const [cv,cx]=mk(),[sk,sx]=mk(),cols=['#f00','#0f0','#00f'];let img=null;
  const part=n=>/Spine|Neck|Clavicle|UpperArm|Forearm/.test(n)?0:(/Pelvis|Thigh|Calf/.test(n)?1:(/Foot|Toe/.test(n)?2:-1)),bare=n=>/Neck|UpperArm|Forearm|Calf|Thigh/.test(n);
  C.scene.traverse(o=>{if(!o.isSkinnedMesh||!o.material||!/body/i.test(o.material.name)||!o.geometry.attributes.skinIndex)return;img=img||(o.material.map&&o.material.map.image);
   const G=o.geometry,uv=G.attributes.uv,si=G.attributes.skinIndex,sw=G.attributes.skinWeight,bn=o.skeleton.bones,n=uv.count,vp=new Int8Array(n),vb=new Uint8Array(n);
   for(let i=0;i<n;i++){let bi=si.getX(i),bw=sw.getX(i);if(sw.getY(i)>bw){bw=sw.getY(i);bi=si.getY(i)}if(sw.getZ(i)>bw){bw=sw.getZ(i);bi=si.getZ(i)}if(sw.getW(i)>bw){bi=si.getW(i)}const nm=bn[bi]?bn[bi].name:'';vp[i]=part(nm);vb[i]=bare(nm)?1:0}
   const ix=G.index,tn=ix?ix.count/3:n/3,V=k=>ix?ix.getX(k):k;
   for(let t=0;t<tn;t++){const a=V(t*3),b=V(t*3+1),c=V(t*3+2),pa=vp[a],pb=vp[b],pc=vp[c],p=(pa===pb||pa===pc)?pa:(pb===pc?pb:pa);if(p<0)continue;
    for(const q of[[cx,cols[p]],[sx,(vb[a]||vb[b]||vb[c])?'#fff':null]]){if(!q[1])continue;const x=q[0];x.fillStyle=x.strokeStyle=q[1];x.lineWidth=1.6;x.beginPath();x.moveTo(uv.getX(a)*S,uv.getY(a)*S);x.lineTo(uv.getX(b)*S,uv.getY(b)*S);x.lineTo(uv.getX(c)*S,uv.getY(c)*S);x.closePath();x.fill();x.stroke()}}});
  if(!img)throw 0;
  const tc=document.createElement('canvas');tc.width=tc.height=S;const tx=tc.getContext('2d');tx.drawImage(img,0,0,S,S);const T0=tx.getImageData(0,0,S,S).data,M=cx.getImageData(0,0,S,S),K=sx.getImageData(0,0,S,S).data,D=M.data;
  for(let i=0;i<D.length;i+=4){if(!(D[i]|D[i+1]|D[i+2])||!K[i])continue;const r=T0[i],g=T0[i+1],b=T0[i+2],cb=128-.1687*r-.3313*g+.5*b,cr=128+.5*r-.4187*g-.0813*b;if(cr>136&&cr<178&&cb>78&&cb<128&&r>45&&r>g)D[i]=D[i+1]=D[i+2]=0}
  cx.putImageData(M,0,0);tex=new THREE.CanvasTexture(cv);tex.flipY=false}catch(e){tex=null}chMasks[C.k]=tex;return tex}
function chPatch(m,mask){if(m.userData.chU)return m.userData.chU;const U0={chMask:{value:mask},chT:{value:new THREE.Color()},chB:{value:new THREE.Color()},chSh:{value:new THREE.Color()},chOn:{value:new THREE.Vector3()}};m.userData.chU=U0;
 m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U0);sh.fragmentShader='uniform sampler2D chMask;uniform vec3 chT,chB,chSh,chOn;\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n{vec3 mk=texture2D(chMask,vUv).rgb*chOn;float w=clamp(mk.r+mk.g+mk.b,0.,1.);if(w>.001){float l=dot(diffuseColor.rgb,vec3(.299,.587,.114));vec3 tc=(chT*mk.r+chB*mk.g+chSh*mk.b)/max(w,.001);diffuseColor.rgb=mix(diffuseColor.rgb,tc*clamp(.25+l*3.2,.12,1.45),w);}}')};
 m.customProgramCacheKey=()=>'chOutfit1';m.needsUpdate=true;return U0}
function chSetU(U,o){o=o||chS;U.chT.value.setHex(o.top>=0?o.top:0);U.chB.value.setHex(o.bot>=0?o.bot:0);U.chSh.value.setHex(o.shoe>=0?o.shoe:0);U.chOn.value.set(o.top>=0?1:0,o.bot>=0?1:0,o.shoe>=0?1:0)}
function chApplyMat(a,m,o){o=o||chS;if(!/body/i.test(m.name)||!m.map)return;const any=o.top>=0||o.bot>=0||o.shoe>=0;if(!any){if(m.userData.chU)m.userData.chU.chOn.value.set(0,0,0);return}const mask=chMask(a.C);if(!mask)return;chSetU(chPatch(m,mask),o)}
function chFallback(){const c=chChoice(),t=chS.top>=0?chS.top:c.fb[0],b=chS.bot>=0?chS.bot:c.fb[1];for(const g of[player,rlDriver])try{const k=g.children[0].children;k[0].material.color.setHex(t);k[1].material.color.setHex(b);k[2].material.color.setHex(c.fb[2])}catch(e){}}
function chRefresh(){chFallback();for(const a of rlLive){const u=a.g.userData;if(u.rlMe||u.rlType==='player')for(const m of a.mats)if(a.C.rb)chApplyMat(a,m)}rlT=0}
// ---------- spawn points ----------
function chSpawns(){const R=roadCenter,out=[];if(chS.last)out.push({id:'last',label:'Last location',x:chS.last[0],z:chS.last[1],yaw:chS.last[2]||0});
 out.push({id:'down',label:'Downtown',x:R(5)+4,z:R(5)+4,yaw:.6},{id:'beach',label:'Ocean Beach',x:HALF+16,z:R(4),yaw:-Math.PI/2},{id:'sub',label:'Suburbs',x:R(1)+4,z:R(6)+4,yaw:-Math.PI/2});
 if(typeof apAX!=='undefined')out.push({id:'air',label:'Airport',x:apAX-36,z:81,yaw:Math.PI/2});
 if(typeof ldGX!=='undefined')out.push({id:'base',label:'Army base gate',x:ldGX+3,z:-HALF-8,yaw:0});
 if(typeof ldFloor==='function')out.push({id:'hills',label:'Hills viewpoint',x:-170,z:HALF+122,yaw:0});
 try{if(typeof stProps!=='undefined'&&typeof stOwn==='function')for(const P of stProps)if(stOwn(P)){const x=P.x!==undefined?P.x:(P.at?P.at[0]:undefined),z=P.z!==undefined?P.z:(P.at?P.at[1]:undefined);if(x!==undefined&&z!==undefined)out.push({id:'p_'+P.id,label:P.n,x,z,yaw:0,prop:1})}}catch(e){}
 try{if(typeof isSpawns!=='undefined'&&Array.isArray(isSpawns)){for(const s of isSpawns)out.push({id:'i_'+(s.id||s.label),label:s.label,x:s.x,z:s.z,yaw:s.yaw||0})}else if(typeof isLandAt==='function'&&typeof isRX!=='undefined'&&isLandAt(isRX,isRZ)>=0)out.push({id:'i_resort',label:'Resort island',x:isRX,z:isRZ,yaw:0})}catch(e){}
 return out}
function chSpawnPick(){const L=chSpawns();return L.find(s=>s.id===chS.spawn)||L.find(s=>s.id==='last')||L.find(s=>s.id==='down')}
function chGround(x,z){let y=.3;try{if(typeof ldFloor==='function'){const h=ldFloor(x,z);if(h>0)y=Math.max(y,h+.6)}if(typeof isLandAt==='function'){const h=isLandAt(x,z);if(h>0)y=Math.max(y,h+.6)}}catch(e){}return y}
function chWet(x,z){if(x<HALF+44)return false;try{if(typeof isLandAt==='function'&&isLandAt(x,z)>=0)return false;if(typeof wdPierH==='function'&&wdPierH(x,z)>=0)return false;if(typeof ldFloor==='function'&&ldFloor(x,z)>=0)return false}catch(e){}return true}
function chSetSpawn(){const s=chSpawnPick();if(!s)return;let x=s.x,z=s.z,lab=s.label;if(chWet(x,z)){x=HALF+16;z=roadCenter(4);lab='Ocean Beach'}window.chSpawn={x,z,yaw:s.yaw,label:s.id==='last'?(chZone(x,z)):lab};return window.chSpawn}
function chZone(x,z){if(x<-HALF-10)return 'Airport';if(z<-HALF-10)return 'Army base';if(z>HALF+30)return 'The Hills';if(x>HALF-60)return 'Ocean Beach';if(x<roadCenter(2))return 'Suburbs';return Math.hypot(x,z)<HALF*.4?'Downtown':'Midtown'}
let chPlaced=false,chSaveT=0,chWired=0,chLastSt='';
function chPlace(){if(chPlaced)return;chPlaced=true;const s=window.chSpawn||chSetSpawn();if(!s)return;pos.set(s.x,chGround(s.x,s.z),s.z);vel.set(0,0,0);onGround=pos.y<=.31;facing=s.yaw;player.rotation.y=s.yaw;camYaw=s.yaw;player.position.copy(pos)}
addEventListener('bc-play',()=>{chClose();chPlace()});
// ---------- character screen UI ----------
const chCss=document.createElement('style');chCss.textContent=
 '#chBtn{position:fixed;z-index:120;left:calc(env(safe-area-inset-left,0px) + 14px);top:calc(env(safe-area-inset-top,0px) + 62px);display:none;align-items:center;gap:10px;padding:8px 14px 8px 8px;border-radius:999px;background:rgba(14,16,22,.62);border:1px solid rgba(255,255,255,.18);color:#fff;font:600 11px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.12em;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 10px 30px rgba(0,0,0,.35);cursor:pointer}'
+'#chBtn i{width:30px;height:30px;border-radius:50%;background:linear-gradient(160deg,#ffe28a,#f0a800);display:flex;align-items:center;justify-content:center;font-style:normal;color:#14161c;font-weight:900;font-size:13px;letter-spacing:0}'
+'#chBtn small{display:block;opacity:.6;font-size:9px;letter-spacing:.08em;margin-top:1px;font-weight:500}'
+'#chOv{position:fixed;inset:0;z-index:210;display:none;color:#fff;font:500 13px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:radial-gradient(ellipse at 30% 40%,rgba(30,36,52,.92),rgba(6,8,12,.97) 70%);-webkit-user-select:none;user-select:none}'
+'#chOv .ch-wrap{position:absolute;inset:0;display:flex;padding:calc(env(safe-area-inset-top,0px) + 12px) calc(env(safe-area-inset-right,0px) + 14px) calc(env(safe-area-inset-bottom,0px) + 12px) calc(env(safe-area-inset-left,0px) + 14px);box-sizing:border-box;gap:14px}'
+'#chOv .ch-pv{position:relative;flex:1 1 48%;min-width:0;min-height:0;border-radius:22px;overflow:hidden;background:radial-gradient(ellipse at 50% 70%,rgba(255,210,63,.16),rgba(255,255,255,.02) 60%);border:1px solid rgba(255,255,255,.08)}'
+'#chOv canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none}'
+'#chOv .ch-load{position:absolute;left:0;right:0;top:48%;text-align:center;opacity:.6;font-size:11px;letter-spacing:.2em}'
+'#chOv .ch-nav{position:absolute;left:0;right:0;bottom:14px;display:flex;align-items:center;justify-content:center;gap:14px}'
+'#chOv .ch-arr{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);font-size:22px;font-weight:300}'
+'#chOv .ch-nm{min-width:120px;text-align:center}#chOv .ch-nm b{display:block;font-size:20px;font-weight:800;letter-spacing:.06em}#chOv .ch-nm small{opacity:.55;font-size:10px;letter-spacing:.18em}'
+'#chOv .ch-side{flex:1 1 52%;min-width:0;overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:6px;padding-right:2px}'
+'#chOv .ch-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}#chOv .ch-tt{font-size:12px;font-weight:800;letter-spacing:.32em;opacity:.9}'
+'#chOv .ch-x{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);font-size:16px}'
+'#chOv .ch-sec{font-size:9.5px;font-weight:700;letter-spacing:.24em;opacity:.5;margin-top:8px}'
+'#chOv .ch-row{display:flex;flex-wrap:wrap;gap:8px}#chOv .ch-sw{width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,255,255,.18);box-sizing:border-box;position:relative}'
+'#chOv .ch-sw.on{border-color:#ffd23f;box-shadow:0 0 0 3px rgba(255,210,63,.25)}#chOv .ch-sw.org{background:conic-gradient(#999,#555,#999);}#chOv .ch-sw.org:after{content:"";position:absolute;left:4px;right:4px;top:50%;height:2px;background:#fff;transform:rotate(-45deg);opacity:.8}'
+'#chOv .ch-in{height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;font:600 14px -apple-system,sans-serif;padding:0 12px;outline:none;-webkit-user-select:text;user-select:text;width:100%;box-sizing:border-box}'
+'#chOv .ch-chip{padding:9px 12px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);font-size:11.5px;font-weight:600}#chOv .ch-chip.on{background:rgba(255,210,63,.18);border-color:#ffd23f;color:#ffe9a0}'
+'#chOv .ch-done{position:sticky;bottom:0;flex:0 0 auto;margin-top:12px;height:48px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-weight:800;letter-spacing:.3em;text-indent:.3em;color:#12141a;background:linear-gradient(180deg,#fff0b8,#ffd23f 48%,#f0a800);box-shadow:0 12px 30px rgba(255,190,40,.25)}'
+'@media (orientation:landscape){#chBtn{left:auto;right:calc(env(safe-area-inset-right,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 8px);padding:6px 12px 6px 6px}#chBtn small{display:none}#chBtn i{width:26px;height:26px}}'
+'@media (orientation:portrait){#chOv .ch-wrap{flex-direction:column}#chOv .ch-pv{flex:0 0 46%}#chOv .ch-side{flex:1 1 auto}}';
document.head.appendChild(chCss);
const chBtn=document.createElement('div');chBtn.id='chBtn';document.body.appendChild(chBtn);
const chOv=document.createElement('div');chOv.id='chOv';document.body.appendChild(chOv);
let chOpenF=false,chMode='title',chPrevState='',chPv=null,chDrag=null,chLoadMsg=null;
function chBtnSync(){chBtn.innerHTML='<i>'+(chName().charAt(0)||'?')+'</i><span>CHARACTER<small>'+chName()+' &middot; '+((chSpawnPick()||{}).label||'Downtown')+'</small></span>'}
function chSw(part,list,cur){return '<div class="ch-row">'+list.map(c=>'<div class="ch-sw'+(c<0?' org':'')+(c===cur?' on':'')+'" data-a="sw" data-p="'+part+'" data-c="'+c+'"'+(c>=0?' style="background:#'+c.toString(16).padStart(6,'0')+'"':'')+'></div>').join('')+'</div>'}
function chRender(){const c=chChoice(),sp=chMode==='title'?chSpawns():[],cur=(chSpawnPick()||{}).id;
 chOv.innerHTML='<div class="ch-wrap"><div class="ch-pv"><canvas></canvas><div class="ch-load"></div><div class="ch-nav"><div class="ch-arr" data-a="prev">&#8249;</div><div class="ch-nm"><b>'+chName()+'</b><small>'+(chChoices.indexOf(c)+1)+' / '+chChoices.length+'</small></div><div class="ch-arr" data-a="next">&#8250;</div></div></div>'
  +'<div class="ch-side"><div class="ch-h"><div class="ch-tt">'+(chMode==='title'?'CHARACTER':'WARDROBE')+'</div><div class="ch-x" data-a="close">&#10005;</div></div>'
  +'<div class="ch-sec">NAME</div><input class="ch-in" maxlength="14" placeholder="'+c.n+'" value="'+(chS.name||'').replace(/[<>"&]/g,'')+'">'
  +'<div class="ch-sec">TOP</div>'+chSw('top',chPal,chS.top)+'<div class="ch-sec">BOTTOM</div>'+chSw('bot',chPal,chS.bot)+'<div class="ch-sec">SHOES</div>'+chSw('shoe',chShoe,chS.shoe)
  +(sp.length?'<div class="ch-sec">SPAWN AT</div><div class="ch-row">'+sp.map(s=>'<div class="ch-chip'+(s.id===cur?' on':'')+'" data-a="sp" data-s="'+s.id+'">'+s.label+'</div>').join('')+'</div>':'')
  +'<div class="ch-done" data-a="close">'+(chMode==='title'?'DONE':'WEAR')+'</div></div></div>';
 const cv=chOv.querySelector('canvas');chLoadMsg=chOv.querySelector('.ch-load');if(chPv&&chPv.r.domElement!==cv){chPvClose()}if(!chPv)chPvOpen(cv);if(chPv){chPv.key=null}
 const inp=chOv.querySelector('.ch-in');inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')inp.blur()});inp.addEventListener('keyup',e=>e.stopPropagation());
 inp.addEventListener('input',()=>{chS.name=inp.value.trim().slice(0,14);const b=chOv.querySelector('.ch-nm b');if(b)b.textContent=chName();chSave()})}
function chOpen(mode){if(chOpenF)return;chMode=mode||'title';chOpenF=true;if(chMode!=='title'){chPrevState=state;state='chmenu'}chOv.style.display='block';chRender();requestAnimationFrame(chPvLoop)}
function chClose(){if(!chOpenF)return;chOpenF=false;chOv.style.display='none';chPvClose();const a=document.activeElement;if(a&&a.blur)a.blur();chSave();chRefresh();if(chMode==='title')chSetSpawn();else if(state==='chmenu')state=chPrevState||'play';chBtnSync()}
chBtn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();chOpen('title')},{passive:false});chBtn.addEventListener('mousedown',e=>e.stopPropagation());
function chAction(a){const k=a.getAttribute('data-a');
 if(k==='close')chClose();else if(k==='prev'||k==='next'){const i=chChoices.indexOf(chChoice()),n=chChoices[(i+(k==='next'?1:chChoices.length-1))%chChoices.length];chS.k=n.k;chS.top=chS.bot=chS.shoe=-1;rlWant(n.k,true);chSave();const sc=chOv.querySelector('.ch-side'),st=sc?sc.scrollTop:0;chRender();const s2=chOv.querySelector('.ch-side');if(s2)s2.scrollTop=st}
 else if(k==='sw'){chS[a.getAttribute('data-p')]=+a.getAttribute('data-c');chSave();for(const x of chOv.querySelectorAll('.ch-sw[data-p="'+a.getAttribute('data-p')+'"]'))x.classList.toggle('on',x===a);chPvOutfit()}
 else if(k==='sp'){chS.spawn=a.getAttribute('data-s');chSave();for(const x of chOv.querySelectorAll('.ch-chip'))x.classList.toggle('on',x===a);chSetSpawn()}}
// taps act on release so the options list can be dragged to scroll (the game blocks the browser's own touch scrolling)
chOv.addEventListener('touchstart',e=>{e.stopPropagation();const t=e.changedTouches&&e.changedTouches[0];if(!t)return;const tg=t.target&&t.target.closest?t.target:e.target;
 if(tg&&tg.classList&&tg.classList.contains('ch-in')){tg.focus();return}if(e.cancelable)e.preventDefault();
 if(tg&&tg.tagName==='CANVAS'){chDrag={x:t.clientX,id:t.identifier,cv:1};if(chPv)chPv.auto=false;return}
 chDrag={id:t.identifier,x:t.clientX,y:t.clientY,y0:t.clientY,a:tg&&tg.closest?tg.closest('[data-a]'):null,side:tg&&tg.closest?tg.closest('.ch-side'):null,moved:false}},{passive:false});
chOv.addEventListener('touchmove',e=>{e.stopPropagation();if(!chDrag)return;for(const t of e.changedTouches)if(t.identifier===chDrag.id){if(chDrag.cv){if(chPv)chPv.rot+=(t.clientX-chDrag.x)*.012;chDrag.x=t.clientX}
  else{if(Math.abs(t.clientY-chDrag.y0)>7)chDrag.moved=true;if(chDrag.moved&&chDrag.side)chDrag.side.scrollTop-=t.clientY-chDrag.y;chDrag.y=t.clientY}}},{passive:false});
chOv.addEventListener('touchend',e=>{e.stopPropagation();const d=chDrag;chDrag=null;if(d&&!d.cv&&!d.moved&&d.a)chAction(d.a)});chOv.addEventListener('touchcancel',()=>{chDrag=null});
chOv.addEventListener('wheel',e=>{const sd=chOv.querySelector('.ch-side');if(sd)sd.scrollTop+=e.deltaY;e.stopPropagation()},{passive:true});
chOv.addEventListener('mousedown',e=>e.stopPropagation());chOv.addEventListener('click',e=>e.stopPropagation());
// ---------- turntable preview (its own small renderer, only while the screen is open) ----------
function chPvOpen(cv){try{const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});r.setPixelRatio(Math.min(2,devicePixelRatio||1));r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.08;
 const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xe6eeff,0x3a2c24,.9));const k=new THREE.DirectionalLight(0xfff0dc,1.7);k.position.set(2.2,4,3.2);sc.add(k);const f=new THREE.DirectionalLight(0xbfd6ff,.55);f.position.set(-3,1.5,2);sc.add(f);const rim=new THREE.DirectionalLight(0xffd88a,1.3);rim.position.set(-1.5,3,-4);sc.add(rim);
 const disc=new THREE.Mesh(new THREE.CircleGeometry(.9,48),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.35}));disc.rotation.x=-Math.PI/2;disc.position.y=.002;sc.add(disc);
 const cam=new THREE.PerspectiveCamera(24,1,.1,60);chPv={r,sc,cam,key:null,w:null,mixer:null,mats:[],rot:.35,auto:true,t:performance.now()}}catch(e){chPv=null}}
function chPvClose(){if(!chPv)return;try{if(chPv.w)chPv.sc.remove(chPv.w);for(const m of chPv.mats)m.dispose();chPv.r.dispose();chPv.r.forceContextLoss()}catch(e){}chPv=null}
function chPvOutfit(){if(!chPv||!chPv.w)return;const fake={C:rlChar[chPv.key]};for(const m of chPv.mats)chApplyMat(fake,m)}
function chPvModel(){const k=chPlayerKey(),C=rlChar[k];if(chPv.key===k&&chPv.w)return;if(!C||!C.rb){rlWant(chS.k,true);if(chLoadMsg)chLoadMsg.textContent=rlFail[chS.k]?'UNAVAILABLE OFFLINE':'LOADING…';return}
 if(chPv.w){chPv.sc.remove(chPv.w);for(const m of chPv.mats)m.dispose();chPv.mats=[]}if(chLoadMsg)chLoadMsg.textContent='';
 const o=THREE.SkeletonUtils.clone(C.scene),w=new THREE.Group();w.add(o);w.scale.setScalar(C.scale);o.traverse(m=>{if(m.isMesh){m.frustumCulled=false;m.material=m.material.clone();chPv.mats.push(m.material)}});
 chPv.sc.add(w);chPv.w=w;chPv.key=k;chPv.mixer=new THREE.AnimationMixer(o);const cl=C.clips.Idle;if(cl)chPv.mixer.clipAction(cl).play();chPvOutfit()}
function chPvLoop(){if(!chOpenF)return;requestAnimationFrame(chPvLoop);if(!chPv)return;const now=performance.now(),dt=Math.min(.05,(now-chPv.t)/1000);chPv.t=now;
 const cv=chPv.r.domElement,W=cv.clientWidth||1,H=cv.clientHeight||1;if(cv.width!==Math.round(W*chPv.r.getPixelRatio())||cv.height!==Math.round(H*chPv.r.getPixelRatio())){chPv.r.setSize(W,H,false);chPv.cam.aspect=W/H;chPv.cam.updateProjectionMatrix()}
 const asp=W/H,dist=7.4/Math.min(1,Math.max(.5,asp*1.1));chPv.cam.position.set(0,1.25,dist);chPv.cam.lookAt(0,.78,0);
 chPvModel();if(chPv.auto)chPv.rot+=dt*.35;if(chPv.w){chPv.w.rotation.y=chPv.rot;chPv.mixer.update(dt)}chPv.r.render(chPv.sc,chPv.cam)}
// ---------- per-frame: title button, wardrobe hook, spawn placement, remembering where you were ----------
function chTick(dt){if(!chWired){chWired=1;chFallback();chSetSpawn();chBtnSync();try{if(typeof stWear==='function')stWear=function(){chOpen('wardrobe')}}catch(e){}}
 const show=state==='ready'&&!chOpenF;chBtn.style.display=show?'flex':'none';if(show&&chLastSt!=='ready')chBtnSync();
 if(chLastSt==='ready'&&state!=='ready'&&state!=='chmenu'){chClose();chPlace()}chLastSt=state;
 chSaveT-=dt;if(chSaveT<=0&&state==='play'){chSaveT=4;let x=pos.x,z=pos.z,ok=onGround&&!driving;if(driving&&driving.m&&!driving.vhT&&!driving.custom&&driving.m.position.y<1.2){x=driving.m.position.x;z=driving.m.position.z;ok=true}
  if(ok&&Math.abs(x)<HALF+700&&Math.abs(z)<HALF+700&&!chWet(x,z)&&(!chS.last||Math.hypot(x-chS.last[0],z-chS.last[1])>3)){chS.last=[Math.round(x*10)/10,Math.round(z*10)/10,Math.round(facing*100)/100];chSave()}}}
addEventListener('keydown',e=>{if(!chOpenF)return;if(e.key==='Escape'){chClose();e.stopImmediatePropagation();return}if(!(e.target&&e.target.classList&&e.target.classList.contains('ch-in')))e.stopImmediatePropagation()},true);
MODS.push(rlTick);
// boot: the loader scripts load async (the title screen does not need them); the walk/run/idle set and the player's own look come first, everything else after PLAY
const rlLibs='https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/';
function rlScript(p){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=rlLibs+p;s.async=true;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
function rlBoot(){let aj=null;try{aj=fetch(rlHost+'rb_anims.json').then(r=>{if(!r.ok)throw 0;return r.json()})}catch(e){aj=Promise.reject(e)}aj.catch(()=>{});
 Promise.all([rlScript('loaders/GLTFLoader.js'),rlScript('utils/SkeletonUtils.js')]).then(()=>{if(!THREE.GLTFLoader||!THREE.SkeletonUtils)return;
 const L=new THREE.GLTFLoader(),G=rlCDN+'r160/examples/models/gltf/',safe=f=>g=>{try{f(g)}catch(e){console.log('model',e)}},no=()=>{};
 rlDeferred.push(()=>rlScript('loaders/DRACOLoader.js').then(()=>{const D=new THREE.DRACOLoader();D.setDecoderPath(rlLibs+'libs/draco/gltf/');L.setDRACOLoader(D);L.load(G+'ferrari.glb',safe(g=>rlCarReady(g.scene)),undefined,no)}).catch(()=>{}));
 const legacy=()=>{if(rlMode)return;rlMode='old';L.load(G+'Soldier.glb',safe(g=>{rlTpose(g);const C=rlPrep('sol',g,{}),S={scene:g.scene,mixer:null,clips:{},bones:C.b,restInv:{},order:[],flip:C.flip};
   g.scene.traverse(o=>{if(o.isBone)S.order.push(o.name.replace('mixamorig',''))});for(const n of S.order)S.restInv[n]=C.b[n].getWorldQuaternion(rlQ()).invert();
   for(const a of g.animations){const c=a.clone();c.tracks=c.tracks.filter(t=>!/\.scale$/.test(t.name));S.clips[a.name]=c}
   const src=THREE.SkeletonUtils.clone(g.scene);S.scene=src;S.bones=rlBones(src);S.mixer=new THREE.AnimationMixer(src);rlSrc=S;C.clips={Idle:S.clips.Idle,Walk:S.clips.Walk,Run:S.clips.Run};rlT=0;
   L.load(rlCDN+'r170/examples/models/gltf/readyplayer.me.glb',safe(g2=>{rlTpose(g2);const C2=rlPrep('rpm',g2,{});C2.clips=rlBake(C2);rlT=0}),undefined,no);
   L.load(G+'Michelle.glb',safe(g2=>{rlTpose(g2);const C2=rlPrep('mic',g2,{});C2.clips=rlBake(C2);rlT=0}),undefined,no)}),undefined,no)};
 rlLd=L;aj.then(j=>{if(!j||!j.Walk)throw 0;rlAnims=j;rlMode='rb';rlT=0;rlWant(chPlayerKey(),true);
  rlDeferred.unshift(()=>fetch(rlHost+'rb_anims2.json').then(r=>r.ok?r.json():null).then(j2=>{if(j2&&j2.Talk){rlAnims2=j2;for(const k in rlChar){const C=rlChar[k];if(C&&C.miss)C.miss={}}}}).catch(()=>{}))}).catch(legacy)}).catch(()=>{})}
rlBoot();

// ---------- missions, shops, save (module prefix: ms) ----------
let msType=-1,msStage=0,msTime=0,msReward=0,msStreak=0,msBest=0,msPassed=0,msWait=0,msData={},msMenuOpen=false,msSaveT=10,msPrevSpd=0,msCrashCD=0,msBanT=0,msTxt=null,msStatTxt=null,msWasDead=false,msMenuMsg='',msMarkOn=true,msFirst=true;
const msQueue=[],msLoose=[],msShops=[],msOffers=[];let msPinned=true,msOfferT=0;
const msNames=['DELIVERY','TAXI FARE','HIT JOB','GETAWAY','HOT CAR','RAMPAGE'];
// ----- save / load -----
function msSave(){try{localStorage.setItem('blockcity_save',JSON.stringify({v:1,cash:cash,ammo:[WEAP[1].ammo,WEAP[2].ammo,WEAP[3].ammo],kills:kills,passed:msPassed,best:msBest}))}catch(e){}}
function msLoad(){try{const d=JSON.parse(localStorage.getItem('blockcity_save')||'null');if(!d)return;if(d.cash>0)cash=d.cash|0;if(d.ammo)for(let k=0;k<3;k++)if(d.ammo[k]>=0)WEAP[k+1].ammo=d.ammo[k]|0;kills=d.kills|0;msPassed=d.passed|0;msBest=d.best|0}catch(e){}}
msLoad();
// ----- HUD pieces -----
const msBan=document.createElement('div');msBan.id='msBan';msBan.style.cssText='position:fixed;top:19%;left:0;right:0;text-align:center;pointer-events:none;opacity:0;transition:opacity .5s;font-weight:900;text-shadow:0 3px 10px #000,0 0 2px #000;letter-spacing:2px;z-index:20';document.body.appendChild(msBan);
function msBanner(a,b,good){msBan.innerHTML='<div style="font-size:38px;color:'+(good?'#ffd23f':'#ff4b4b')+'">'+a+'</div><div style="font-size:19px;color:#fff;letter-spacing:1px">'+(b||'')+'</div>';msBan.style.opacity=1;msBanT=3.4}
const msStat=document.createElement('div');msStat.id='msStat';msStat.style.cssText='font-size:12px;font-weight:700;color:#ffe9a8;line-height:1.3';$('hud').appendChild(msStat);
$('mission').style.top='calc(env(safe-area-inset-top,0px) + 138px)';
function msText(s){if(s&&msType>=0)s+=msCardBtns();if(s!==msTxt){msTxt=s;$('mission').innerHTML=s}}
function msMarker(v){v=!!(v&&msPinned);if(v!==msMarkOn){msMarkOn=v;beam.visible=ring.visible=arrow.visible=v}}
function msJingle(good){if(good){beep(660,.12,.12);setTimeout(()=>beep(880,.12,.12),120);setTimeout(()=>beep(1320,.3,.12),240)}else{beep(330,.2,.12);setTimeout(()=>beep(220,.4,.12),200)}}
// ----- shop menu -----
const msMenu=document.createElement('div');msMenu.id='msMenu';msMenu.setAttribute('data-ms','x');msMenu.style.cssText='position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#000b;z-index:50;font-family:-apple-system,sans-serif';document.body.appendChild(msMenu);
const msItems=[{n:'SMG AMMO',q:'+60 rounds',p:150,f:()=>{WEAP[1].ammo+=60}},{n:'SHOTGUN SHELLS',q:'+12 shells',p:200,f:()=>{WEAP[2].ammo+=12}},{n:'ROCKETS',q:'+3 rockets',p:600,f:()=>{WEAP[3].ammo+=3}},{n:'BODY ARMOR',q:'full armor',p:300,f:()=>{armor=100},full:()=>armor>=100}];
function msMenuRender(){let h='<div data-ms="p" style="width:min(460px,92vw);background:#16181dee;border:2px solid #ffb020;border-radius:16px;padding:12px 14px;color:#fff;box-shadow:0 8px 40px #000">';
 h+='<div style="display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:20px;margin-bottom:8px"><span style="color:#ffb020">GUN SHOP</span><span style="color:#6dff8a">$'+cash+'</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
 for(let k=0;k<msItems.length;k++){const it=msItems[k],full=it.full&&it.full(),ok=cash>=it.p&&!full;h+='<div data-ms="'+k+'" style="padding:10px 8px;border-radius:12px;background:'+(ok?'#2b303a':'#1e2026')+';border:2px solid '+(ok?'#ffffff66':'#ffffff1c')+';opacity:'+(ok?1:.55)+';text-align:center"><div style="font-weight:900;font-size:15px">'+it.n+'</div><div style="font-size:12px;color:#bbb">'+(full?'already full':it.q)+'</div><div style="font-weight:900;font-size:16px;color:#6dff8a">$'+it.p+'</div></div>'}
 h+='</div><div style="height:18px;margin-top:6px;text-align:center;font-size:13px;font-weight:700;color:#ffd23f">'+msMenuMsg+'</div><div data-ms="x" style="margin-top:4px;padding:12px;border-radius:12px;background:#ff3b30;text-align:center;font-weight:900;font-size:17px">CLOSE</div></div>';msMenu.innerHTML=h}
function msOpenMenu(){msMenuOpen=true;msMenuMsg='Tap an item to buy';state='shop';joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;fireId=null;burstN=0;jumpQ=carQ=false;vel.x=vel.z=0;msMenuRender();msMenu.style.display='flex'}
function msCloseMenu(){msMenuOpen=false;msMenu.style.display='none';if(state==='shop')state='play';msSave()}
function msBuy(k){const it=msItems[k];if(!it)return;if(it.full&&it.full())msMenuMsg='You already have full armor';else if(cash<it.p){msMenuMsg='Not enough cash for '+it.n;beep(200,.15,.1)}else{cash-=it.p;it.f();msMenuMsg='Bought '+it.n+' ('+it.q+')';beep(1300,.1,.12);$('cash').textContent='$'+cash}msMenuRender()}
function msMenuHit(el){const b=el&&el.closest?el.closest('[data-ms]'):null;if(!b)return;const k=b.getAttribute('data-ms');if(k==='x')msCloseMenu();else if(k!=='p')msBuy(+k)}
addEventListener('touchstart',e=>{if(!msMenuOpen)return;e.preventDefault();e.stopPropagation();for(const t of e.changedTouches){msMenuHit(t.target);if(!msMenuOpen)break}},{capture:true,passive:false});
for(const msEv of['touchmove','touchend','touchcancel','mousedown','click'])addEventListener(msEv,e=>{if(!msMenuOpen)return;e.stopPropagation();if(msEv==='click')msMenuHit(e.target)},true);
// ----- shops in the world -----
const msShopGeo={ring:new THREE.TorusGeometry(1,.09,8,32),tube:new THREE.CylinderGeometry(1,1,1,24,1,true)};
function msAddShop(kind,i,j){const cx=roadCenter(i)+CELL/2,cz=roadCenter(j)+CELL/2,D={gun:[0xffb020,'#ffb020','GUN SHOP'],body:[0x40e0ff,'#40e0ff','BODY SHOP'],clinic:[0xff6f91,'#ff6f91','CLINIC +']}[kind];
 let x=cx,z=cz-18,r=2.3;if(kind==='body'){z=cz-BLOCK/2-3.5;r=4.2}
 const g=new THREE.Group();g.position.set(x,0,z);
 const ringM=new THREE.Mesh(msShopGeo.ring,new THREE.MeshBasicMaterial({color:D[0],toneMapped:false}));ringM.rotation.x=Math.PI/2;ringM.scale.set(r,r,1.6);ringM.position.y=.5;g.add(ringM);
 const tube=new THREE.Mesh(msShopGeo.tube,new THREE.MeshBasicMaterial({color:D[0],transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));tube.scale.set(r,2.6,r);tube.position.y=1.6;g.add(tube);
 const tex=canvasTex(256,64,(c,w,h)=>{c.fillStyle='rgba(10,12,16,.82)';c.fillRect(0,0,w,h);c.strokeStyle=D[1];c.lineWidth=6;c.strokeRect(3,3,w-6,h-6);c.fillStyle=D[1];c.font='900 34px -apple-system,Helvetica,Arial,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(D[2],w/2,h/2+2)});
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));sp.scale.set(5.2,1.3,1);sp.position.y=kind==='body'?5.2:4.6;g.add(sp);
 scene.add(g);msShops.push({kind,x,z,r,g,ringM,tube,css:D[1],inn:false})}
for(const a of[[3,3],[7,3],[3,7],[6,7],[9,4]])msAddShop('gun',a[0],a[1]);
for(const a of[[4,2],[2,6],[7,5],[5,8],[9,2]])msAddShop('body',a[0],a[1]);
for(const a of[[4,5],[1,3],[7,8],[6,4],[1,6]])msAddShop('clinic',a[0],a[1]);
function msShopTick(){for(const s of msShops){const inn=Math.hypot(s.x-pos.x,s.z-pos.z)<s.r;if(inn&&!s.inn){
  if(s.kind==='gun'){if(driving)toast('Get out and walk in to shop');else msOpenMenu()}
  else if(s.kind==='clinic'){if(hp>=100)toast('Clinic: you are healthy');else{const fee=Math.max(20,Math.round((100-hp)*2));if(cash>=fee){cash-=fee;hp=100;toast('Patched up  -$'+fee);beep(900,.12,.12);setTimeout(()=>beep(1200,.2,.12),110)}else toast('Clinic costs $'+fee)}}
  else{if(!driving)toast('Bring a car to the body shop');else{const fee=150+150*wanted;if(cash<fee)toast('Body shop costs $'+fee);else{cash-=fee;const had=wanted>0;driving.hp=100;const bm=driving.m.children[0]&&driving.m.children[0].material;if(bm&&bm.color)bm.color.setHex(carColors[Math.floor(Math.random()*carColors.length)]);
    wantedScore=0;evade=0;if(msType===4&&msData.car===driving)msData.cond=100;driving.speed*=.3;toast((had?'Resprayed, cops lost you':'Fixed and resprayed')+'  -$'+fee);beep(700,.1,.12);setTimeout(()=>beep(1000,.1,.12),100);setTimeout(()=>beep(1400,.2,.12),200)}}}}
 s.inn=inn}}
// minimap: shops (squares) and race checkpoints
const msDrawMap0=drawMap;
drawMap=function(){msDrawMap0();const g=mapC,S=260,sc=S/215;g.save();g.beginPath();g.arc(S/2,S/2,S/2-4,0,7);g.clip();g.translate(S/2,S/2);g.rotate(camYaw);g.translate(-pos.x*sc,-pos.z*sc);
 g.lineWidth=2;g.strokeStyle='#000';for(const s of msShops){g.fillStyle=s.css;g.fillRect(s.x*sc-6,s.z*sc-6,12,12);g.strokeRect(s.x*sc-6,s.z*sc-6,12,12)}
 if(msType===3&&msStage===1){g.fillStyle='#ffe14d';for(let k=msData.k+1;k<msData.cps.length;k++){g.beginPath();g.arc(msData.cps[k].x*sc,msData.cps[k].z*sc,4,0,7);g.fill()}}
 g.restore()};
// ----- mission helpers -----
function msPick(ref,minD,maxD,inner){const ok=[];let best=null,bd=1e9;const mid=(minD+maxD)/2,lim=inner?N-1:N;
 for(let i=0;i<=lim;i++)for(let j=0;j<=lim;j++){const x=roadCenter(i),z=roadCenter(j),d=Math.hypot(x-ref.x,z-ref.z);if(d>=minD&&d<=maxD)ok.push([x,z]);const e=Math.abs(d-mid);if(e<bd){bd=e;best=[x,z]}}
 const p=ok.length?ok[Math.floor(Math.random()*ok.length)]:best;return new THREE.Vector3(p[0],0,p[1])}
function msPickBlock(ref,minD,maxD){const ok=[];let best=null,bd=1e9;const mid=(minD+maxD)/2;
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){if(i>=8&&j>=8)continue;const x=roadCenter(i)+CELL/2,z=roadCenter(j)+CELL/2,d=Math.hypot(x-ref.x,z-ref.z);if(d>=minD&&d<=maxD)ok.push([x,z]);const e=Math.abs(d-mid);if(e<bd){bd=e;best=[x,z]}}
 return ok.length?ok[Math.floor(Math.random()*ok.length)]:best}
function msFindCar(){const ok=[];for(const c of cars){if(c.dead||c===driving)continue;const d=Math.hypot(c.m.position.x-pos.x,c.m.position.z-pos.z);if(d>35&&d<260)ok.push(c)}return ok.length?ok[Math.floor(Math.random()*ok.length)]:null}
function msNextType(){if(!msQueue.length){const a=[0,1,2,3,4,5];while(a.length)msQueue.push(a.splice(Math.floor(Math.random()*a.length),1)[0]);if(msFirst){msFirst=false;msQueue.splice(msQueue.indexOf(0),1);msQueue.unshift(0)}}return msQueue.shift()}
function msPlace(){return placesNames[Math.floor(Math.random()*placesNames.length)]}
function msClean(){box.visible=false;const d=msData;if(d.pass){scene.remove(d.pass);d.pass=null}if(d.cone&&d.cone.parent)d.cone.parent.remove(d.cone);if(d.guards)for(const s of d.guards)msLoose.push(s);d.guards=null}
function msStart(t){msClean();msType=t;msStage=0;msData={};msTime=0;mission.stage='pickup';msMarker(true);
 if(t===4){const c=msFindCar();if(!c){msStart(0);return}msData.car=c;mission.target=c.m.position.clone();return}
 if(t===1){const c=msPick(pos,45,200,true);const p=makePerson(new THREE.Color().setHSL(Math.random(),.7,.55),new THREE.Color().setHSL(Math.random(),.4,.3),[0xf1c27d,0xc68642,0x8d5524,0xe0ac69][Math.floor(Math.random()*4)]);
  p.position.set(c.x+8.4,0.3,c.z+12.5);p.rotation.y=Math.PI/2;scene.add(p);msData.pass=p;msData.to=msPlace();mission.target=new THREE.Vector3(c.x+4,0,c.z+12.5);return}
 mission.target=msPick(pos,45,200)}
function msBegin(){const t=msType,from=mission.target.clone();msStage=1;mission.stage='deliver';msCrashCD=1;
 if(t===0){const d=msPick(from,150,340),dist=d.distanceTo(from);mission.target=d;msReward=Math.round(dist*1.5);msTime=dist/9+25;msData.to=msPlace();box.visible=true;toast('Package picked up!')}
 else if(t===1){scene.remove(msData.pass);msData.pass=null;const d=msPick(from,170,380),dist=d.distanceTo(from);mission.target=d;msReward=Math.round(dist*2);msTime=dist/13+25;msData.crash=0;toast('Passenger: "'+msData.to+', and step on it!"')}
 else if(t===2){const b=msPickBlock(pos,110,300),dist=Math.hypot(b[0]-pos.x,b[1]-pos.z),x=b[0]+(Math.random()-.5)*14,z=b[1]+18;
  const tg=makeShooter('gang',x,z);tg.hp=6;const cone=new THREE.Mesh(new THREE.ConeGeometry(.4,.9,4),new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false}));cone.rotation.x=Math.PI;cone.position.y=3.3;tg.g.add(cone);
  msData.tg=tg;msData.cone=cone;msData.guards=[tg];for(let k=0;k<3;k++)msData.guards.push(makeShooter('gang',x+(k-1)*3.2+(k===1?1.6:0),z+(k===1?1.2:-.6)));
  mission.target=tg.g.position.clone();msReward=Math.round(300+dist*.8+225);msTime=150+dist/8;toast('Target marked. Watch the bodyguards')}
 else if(t===3){let i=Math.max(0,Math.min(N,Math.round((pos.x+HALF-ROAD/2)/CELL))),j=Math.max(0,Math.min(N,Math.round((pos.z+HALF-ROAD/2)/CELL))),dir=Math.floor(Math.random()*4);const n=6+Math.floor(Math.random()*3),cps=[],D=[[1,0],[0,1],[-1,0],[0,-1]];
  for(let k=0;k<n;k++){const opt=[];for(let q=0;q<4;q++){if(q===(dir+2)%4)continue;const a=i+D[q][0]*2,b=j+D[q][1]*2;if(a>=0&&a<=N&&b>=0&&b<=N){opt.push(q);if(q!==dir)opt.push(q)}}
   dir=opt.length?opt[Math.floor(Math.random()*opt.length)]:(dir+2)%4;i=Math.max(0,Math.min(N,i+D[dir][0]*2));j=Math.max(0,Math.min(N,j+D[dir][1]*2));cps.push(new THREE.Vector3(roadCenter(i),0,roadCenter(j)))}
  let len=cps[0].distanceTo(from);for(let k=1;k<n;k++)len+=cps[k].distanceTo(cps[k-1]);msData.cps=cps;msData.k=0;mission.target=cps[0];msReward=Math.round(250+len*.9);msTime=len/13+20;toast('GO GO GO!')}
 else if(t===4){const d=msPick(pos,200,380),dist=d.distanceTo(from);msData.dest=d;msData.cond=100;mission.target=d;msReward=Math.round(350+dist*1.2);msTime=dist/10+60;if(wantedScore<3)crime(3-wantedScore);toast('Car reported stolen! Get it to the garage')}
 else if(t===5){msData.n=5;msData.k=0;msTime=90;msReward=800;WEAP[1].ammo+=60;WEAP[3].ammo+=2;toast('RAMPAGE! Destroy 5 vehicles');mission.target=new THREE.Vector3(1e5,0,1e5)}}
function msEnd(pass,bonus,why){const t=msType;msClean();msType=-1;msPinned=true;msOfferT=1.5;msStage=0;msWait=4.5;mission.target=new THREE.Vector3(1e5,0,1e5);msMarker(false);msText('');
 if(pass){msStreak++;const mult=Math.min(2.5,1+.15*(msStreak-1)),total=Math.round((msReward+(bonus||0))*mult);cash+=total;msPassed++;if(msStreak>msBest)msBest=msStreak;msBanner('MISSION PASSED','+$'+total+(mult>1?'   streak x'+mult.toFixed(2):''),true);msJingle(true);msSave()}
 else{msStreak=0;msBanner('MISSION FAILED',why||'',false);msJingle(false)}
 if(t===4&&pass&&driving)carQ=true}
function msVehKill(c){if(msType===5&&msStage===1){msData.k++;beep(1100,.08,.1)}}
const msBlowCar0=blowCar,msBlowParked0=blowParked,msBlowPolice0=blowPolice;
blowCar=function(t){const w=t.dead;msBlowCar0(t);if(!w&&t.dead)msVehKill(t)};
blowParked=function(c){const w=c.dead;msBlowParked0(c);if(!w&&c.dead)msVehKill(c)};
blowPolice=function(p){const w=p.dead;msBlowPolice0(p);if(!w&&p.dead)msVehKill(p)};
// ----- per-frame mission logic (only while playing) -----
function msTick(dt){if(msMenuOpen)return;msShopTick();
 if(msType<0){msMarker(false);msText('');return}
 const t=msType,spd=driving?Math.abs(driving.speed):0;let crashed=false;msCrashCD-=dt;if(driving&&msCrashCD<=0&&msPrevSpd>13&&spd<msPrevSpd*.62){crashed=true;msCrashCD=1}msPrevSpd=spd;
 if(t===2&&msStage===1&&!msData.tg.dead)mission.target.copy(msData.tg.g.position).setY(0);
 if(t===4){const c=msData.car;if(c.dead){if(msStage===1)msEnd(false,0,'The car was destroyed');else msStart(msNextType());return}
  if(driving===c){if(msStage===0)msBegin();mission.target=msData.dest}else mission.target=c.m.position.clone().setY(0)}
 const dT=Math.hypot(mission.target.x-pos.x,mission.target.z-pos.z),D=Math.round(dT)+' m',H='<b style="color:#ffd23f">'+msNames[t]+'</b>'+(msPinned?'':' <span style="opacity:.6;font-size:11px">(unpinned)</span>')+'<br>';
 if(msStage===0){
  if(t===0){msText(H+'Pick up the package<br>'+D);if(dT<4)msBegin()}
  else if(t===1){msText(H+(driving?'Pull up next to the passenger':'Passenger waiting. Bring a car')+'<br>'+D);if(dT<6){if(driving){if(spd<10)msBegin()}else if(!msData.told){msData.told=true;toast('You need a car for a taxi fare')}}}
  else if(t===2){msText(H+'Get the target info at the marker<br>'+D);if(dT<4)msBegin()}
  else if(t===3){msText(H+'Bring a fast car to the start line<br>'+D);if(dT<6)msBegin()}
  else if(t===4){msText(H+'Steal the marked car<br>'+D)}
  else{msText(H+'Go to the marker to start<br>'+D);if(dT<4)msBegin()}
  return}
 msTime-=dt;const tl=Math.max(0,msTime).toFixed(0)+'s',mult=Math.min(2.5,1+.15*msStreak),pay='Pays $'+Math.round(msReward*mult);
 if(t===0){msText(H+'Deliver to '+msData.to+'<br>'+D+'  |  '+tl+'<br>'+pay);if(dT<4){msEnd(true,Math.round(msTime*2));return}}
 else if(t===1){if(crashed){msData.crash++;toast(msData.crash>3?'Passenger: "LET ME OUT!"':'Passenger: "Watch it!"')}
  const care=Math.max(0,100-25*msData.crash);msText(H+(driving?'Drive to '+msData.to:'Get back in the car!')+'<br>'+D+'  |  '+tl+'<br>'+pay+'  tip $'+(care+Math.round(msTime*3)));
  if(driving&&dT<7){const tip=care+Math.round(msTime*3);toast('Tip: $'+tip);msEnd(true,tip);return}}
 else if(t===2){msMarker(true);msText(H+'Take out the marked target<br>'+D+'  |  '+tl+'<br>'+pay);for(const s of msData.guards)if(s.dead)s.kind='msx';if(msData.tg.dead){msEnd(true,Math.round(msTime));return}}
 else if(t===3){msText(H+'Checkpoint '+(msData.k+1)+' / '+msData.cps.length+'<br>'+D+'  |  '+tl+'<br>'+pay);
  if(dT<8){msData.k++;if(msData.k>=msData.cps.length){msEnd(true,Math.round(msTime*5));return}mission.target=msData.cps[msData.k];msTime+=2;beep(1200,.1,.12);setTimeout(()=>beep(1600,.12,.12),90)}}
 else if(t===4){if(crashed&&driving===msData.car){msData.cond-=20;toast('Car damaged! '+Math.max(0,msData.cond)+'%');if(msData.cond<=0){msEnd(false,0,'You wrecked the car');return}}
  msText(H+(driving===msData.car?'Deliver it to the garage':'Get back in the hot car!')+'<br>'+D+'  |  '+tl+'<br>Condition '+msData.cond+'%  $'+Math.round(msReward*mult*msData.cond/100));
  if(driving===msData.car&&dT<7){msReward=Math.round(msReward*msData.cond/100);msEnd(true,Math.round(msTime));return}}
 else if(t===5){msMarker(false);msText(H+'Vehicles destroyed '+msData.k+' / '+msData.n+'<br>'+tl+'<br>'+pay);if(msData.k>=msData.n){msEnd(true,Math.round(msTime*4));return}}
 if(msTime<=0)msEnd(false,0,t===5?'Not enough wrecks':'Out of time')}
// ----- always-on frame work: banner, autosave, shop glow, death handling -----
MODS.push(function msFrame(dt){
 if(msBanT>0){msBanT-=dt;if(msBanT<=0)msBan.style.opacity=0}
 msSaveT-=dt;if(msSaveT<=0){msSaveT=10;if(state!=='ready')msSave()}
 for(const s of msShops){s.ringM.rotation.z+=dt*1.2;s.ringM.position.y=.5+Math.sin(T*2.5+s.x)*.15;s.tube.material.opacity=.16+.1*Math.sin(T*3+s.z)}
 if(msData.pass){const p=msData.pass,u=p.userData;u.armR.rotation.x=-2.6+Math.sin(T*6)*.3;p.rotation.y=Math.atan2(-(pos.x-p.position.x),-(pos.z-p.position.z))}
 if(msData.cone)msData.cone.rotation.y+=dt*3;
 for(let i=msLoose.length-1;i>=0;i--){const s=msLoose[i];if(s.dead){s.kind='msx';msLoose.splice(i,1)}else if(s.gone)msLoose.splice(i,1);else if(s.g.position.distanceTo(pos)>90){s.gone=true;msLoose.splice(i,1)}}
 if(state==='dead'){if(!msWasDead){msWasDead=true;if(msMenuOpen)msCloseMenu();if(msType>=0&&msStage>=1)msEnd(false,0,'You got wiped out')}}
 else if(msWasDead&&state==='play'){msWasDead=false}
 const st='✔ '+msPassed+' jobs  ·  streak '+msStreak+(msBest>0?'  ·  best '+msBest:'');if(st!==msStatTxt){msStatTxt=st;msStat.textContent=st}});

// ----- job offers: the player picks jobs, can unpin and cancel -----
const msDesc=['Pick up a package and deliver it on the clock','Drive a passenger across town, tips for a smooth ride','Take out a marked gang target and his bodyguards','Race through checkpoints against the clock','Steal a marked car and bring it in clean','Wreck 5 vehicles in 90 seconds'];
const msOfferViz=[];
for(let k=0;k<3;k++){const g=new THREE.Group();const r=new THREE.Mesh(msShopGeo.ring,new THREE.MeshBasicMaterial({color:0xffd23f,toneMapped:false}));r.rotation.x=Math.PI/2;r.scale.set(1.6,1.6,1.4);r.position.y=.45;g.add(r);
 const tb=new THREE.Mesh(msShopGeo.tube,new THREE.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));tb.scale.set(1.6,7,1.6);tb.position.y=3.5;g.add(tb);
 const tex=canvasTex(128,64,(c,w,h)=>{c.fillStyle='rgba(20,16,4,.85)';c.beginPath();c.arc(w/2,h/2,28,0,7);c.fill();c.strokeStyle='#ffd23f';c.lineWidth=5;c.stroke();c.fillStyle='#ffd23f';c.font='900 30px -apple-system,Helvetica,Arial,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('$',w/2,h/2+2)});
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));sp.scale.set(2.6,1.3,1);sp.position.y=3.2;g.add(sp);g.visible=false;scene.add(g);
 const ic={x:0,z:0,label:'Job',color:'#ffd23f',glyph:'J',ent:{dead:true}};try{mpIcons.push(ic)}catch(e){}
 msOfferViz.push({g,r,tb,ic})}
function msOfferMake(t){const o={t:t,id:Math.random(),est:[180,260,520,420,560,800][t]};
 if(t===4){const c=msFindCar();if(!c)return null;o.car=c;o.p=c.m.position.clone().setY(0)}
 else if(t===1){o.c=msPick(pos,60,260,true);o.p=new THREE.Vector3(o.c.x+4,0,o.c.z+12.5)}
 else o.p=msPick(pos,60,260);
 for(const q of msOffers)if(q.p.distanceTo(o.p)<25)return null;return o}
function msStartAt(o){msClean();msType=o.t;msStage=0;msData={};msTime=0;mission.stage='pickup';msPinned=true;msMarkOn=null;msTxt=null;msMarker(true);
 if(o.t===4){const c=o.car&&!o.car.dead&&o.car!==driving?o.car:msFindCar();if(!c){msType=-1;msMarker(false);toast('That car is gone');return false}msData.car=c;mission.target=c.m.position.clone();return true}
 if(o.t===1){const c=o.c,p=makePerson(new THREE.Color().setHSL(Math.random(),.7,.55),new THREE.Color().setHSL(Math.random(),.4,.3),[0xf1c27d,0xc68642,0x8d5524,0xe0ac69][Math.floor(Math.random()*4)]);p.position.set(c.x+8.4,0.3,c.z+12.5);p.rotation.y=Math.PI/2;scene.add(p);msData.pass=p;msData.to=msPlace();mission.target=new THREE.Vector3(c.x+4,0,c.z+12.5);return true}
 mission.target=o.p.clone();return true}
function msAccept(i){if(msType>=0){toast('Finish or cancel your current job first');return false}const o=msOffers[i];if(!o)return false;msOffers.splice(i,1);const ok=msStartAt(o);if(ok){toast('Job accepted: '+msNames[o.t]);beep(1000,.08,.1);setTimeout(()=>beep(1400,.1,.1),90)}return ok}
function msAcceptType(t){if(msType>=0)return false;let i=msOffers.findIndex(o=>o.t===t);if(i<0){const o=msOfferMake(t);if(!o)return false;msOffers.push(o);i=msOffers.length-1}return msAccept(i)}
function msPin(v){if(msType<0)return;msPinned=!!v;msMarkOn=null;msTxt=null;msMarker(msType!==5);toast(v?'Job pinned':'Job unpinned. Open Jobs or tap Pin to show it again')}
function msCancel(){if(msType<0)return;msClean();msType=-1;msStage=0;msData={};mission.target=new THREE.Vector3(1e5,0,1e5);msPinned=true;msMarkOn=null;msMarker(false);msTxt=null;msText('');msStreak=0;msOfferT=2;toast('Job cancelled')}
function msSummary(){const t=msType;if(t<0)return '';const d=Math.round(Math.hypot(mission.target.x-pos.x,mission.target.z-pos.z));if(msStage===0)return ['Pick up the package','Pick up the passenger','Get the target info at the marker','Bring a fast car to the start line','Steal the marked car','Go to the marker to start'][t]+(t===5?'':' · '+d+' m');return ['Deliver to '+(msData.to||'the drop'),'Drive to '+(msData.to||'the destination'),'Take out the marked target','Checkpoint '+((msData.k||0)+1)+' of '+(msData.cps?msData.cps.length:0),'Bring the car to the garage','Destroy vehicles '+(msData.k||0)+' of '+(msData.n||5)][t]+(t===5?'':' · '+d+' m')+' · '+Math.max(0,Math.round(msTime))+'s left'}
function msCardBtns(){const b='pointer-events:auto;display:inline-block;padding:4px 10px;border-radius:10px;font-size:11px;font-weight:800;letter-spacing:.3px;margin-right:6px';return '<div style="margin-top:6px;pointer-events:auto"><span data-mc="pin" style="'+b+';background:#ffffff26">'+(msPinned?'UNPIN':'PIN')+'</span><span data-mc="x" style="'+b+';background:#ff3b3066">CANCEL</span></div>'}
$('mission').addEventListener('touchstart',e=>{const b=e.target&&e.target.closest?e.target.closest('[data-mc]'):null;if(!b)return;e.preventDefault();e.stopPropagation();if(state!=='play')return;if(b.getAttribute('data-mc')==='pin')msPin(!msPinned);else msCancel()},{passive:false});
for(const ty of['touchmove','touchend'])$('mission').addEventListener(ty,e=>{const b=e.target&&e.target.closest?e.target.closest('[data-mc]'):null;if(b)e.stopPropagation()});
MODS.push(function msOfferTick(dt){if(state==='ready')return;
 for(let i=msOffers.length-1;i>=0;i--){const o=msOffers[i];if(o.car){if(o.car===driving&&msType<0&&state==='play'){msAccept(i);break}if(o.car.dead||o.car===driving){msOffers.splice(i,1);continue}o.p.copy(o.car.m.position).setY(0)}if(Math.hypot(o.p.x-pos.x,o.p.z-pos.z)>460)msOffers.splice(i,1)}
 msOfferT-=dt;if(msOfferT<=0&&msOffers.length<3){msOfferT=3;let t=msNextType();for(let k=0;k<6&&msOffers.some(o=>o.t===t);k++)t=msNextType();const o=msOfferMake(t);if(o)msOffers.push(o)}
 for(let k=0;k<3;k++){const v=msOfferViz[k],o=msOffers[k],show=!!o&&msType<0;v.g.visible=show;v.ic.ent.dead=!o;if(o){v.ic.x=o.p.x;v.ic.z=o.p.z;v.ic.label='Job: '+msNames[o.t];v.g.position.set(o.p.x,0,o.p.z);if(show){v.r.rotation.z+=dt*1.5;v.tb.material.opacity=.12+.08*Math.sin(T*3+k)}}}
 if(msType<0&&state==='play'&&!msMenuOpen)for(let i=0;i<msOffers.length;i++){const o=msOffers[i];if(o.t===4)continue;if(Math.hypot(o.p.x-pos.x,o.p.z-pos.z)<3.2){msAccept(i);break}}
});

// ---------- audio module (au*) ----------
let auOn=false,auMute=0,auMaster=null,auOut=null,auBus={},auEng=null,auAmb=null,auScr=null,auSir=null,auStepD=0,auPrevW=0,auWhoCD=0,auPrevDrv=null,auPrevG=true,auHornT=12,auRG=null,auDist=null;
const auR={st:0,step:0,next:0};
function auLoop(){const s=AC.createBufferSource();s.buffer=NB;s.loop=true;s.start(0,Math.random()*.9);return s}
function auInit(){if(auOn||!AC||!NB)return;auOn=true;
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=12;comp.ratio.value=12;comp.attack.value=.003;comp.release.value=.2;
 auOut=AC.createGain();auOut.gain.value=.8;auMaster=AC.createGain();auMaster.connect(comp);comp.connect(auOut);auOut.connect(AC.destination);
 const lv={eng:.24,fx:.9,wpn:.75,amb:1,radio:.45,ui:.5};for(const k in lv){const g=AC.createGain();g.gain.value=lv[k];g.connect(auMaster);auBus[k]=g}
 // engine chain: saw + sub square + noise -> lowpass -> tremolo -> gain
 {const o1=AC.createOscillator(),o2=AC.createOscillator(),lp=AC.createBiquadFilter(),tr=AC.createGain(),g=AC.createGain(),lfo=AC.createOscillator(),ld=AC.createGain(),ng=AC.createGain(),o2g=AC.createGain();
  o1.type='sawtooth';o2.type='square';o1.frequency.value=45;o2.frequency.value=22;o2g.gain.value=.5;lp.type='lowpass';lp.frequency.value=300;lp.Q.value=1.5;g.gain.value=0;ng.gain.value=0;lfo.frequency.value=23;ld.gain.value=.15;
  o1.connect(lp);o2.connect(o2g);o2g.connect(lp);auLoop().connect(ng);ng.connect(lp);lp.connect(tr);tr.connect(g);g.connect(auBus.eng);lfo.connect(ld);ld.connect(tr.gain);o1.start();o2.start();lfo.start();
  const wf=AC.createBiquadFilter(),wg=AC.createGain();wf.type='bandpass';wf.frequency.value=700;wf.Q.value=.6;wg.gain.value=0;auLoop().connect(wf);wf.connect(wg);wg.connect(auBus.eng);
  auEng={o1,o2,lp,g,lfo,ld,ng,wg,rpm:0,gear:0,dip:0}}
 // tire screech
 {const f=AC.createBiquadFilter(),f2=AC.createBiquadFilter(),g=AC.createGain();f.type='bandpass';f.frequency.value=1700;f.Q.value=7;f2.type='bandpass';f2.frequency.value=2450;f2.Q.value=9;g.gain.value=0;const s=auLoop();s.connect(f);s.connect(f2);f.connect(g);f2.connect(g);g.connect(auBus.fx);auScr={f,f2,g}}
 // ambience: city bed + rain
 {const cf=AC.createBiquadFilter(),cg=AC.createGain(),rf=AC.createBiquadFilter(),rg=AC.createGain(),lf=AC.createBiquadFilter(),lg=AC.createGain();
  cf.type='lowpass';cf.frequency.value=240;cg.gain.value=0;auLoop().connect(cf);cf.connect(cg);cg.connect(auBus.amb);
  rf.type='bandpass';rf.frequency.value=5200;rf.Q.value=.4;rg.gain.value=0;auLoop().connect(rf);rf.connect(rg);rg.connect(auBus.amb);
  lf.type='lowpass';lf.frequency.value=520;lg.gain.value=0;auLoop().connect(lf);lf.connect(lg);lg.connect(auBus.amb);auAmb={cg,rg,lg}}
 // radio bus (+ distortion send for the rock station)
 {auRG=AC.createGain();auRG.gain.value=0;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=60;auRG.connect(hp);hp.connect(auBus.radio);
  auDist=AC.createWaveShaper();const c=new Float32Array(512);for(let i=0;i<512;i++){const x=i/255.5-1;c[i]=Math.tanh(x*6)}auDist.curve=c;const dl=AC.createBiquadFilter(),dg=AC.createGain();dl.type='lowpass';dl.frequency.value=3200;dg.gain.value=.3;auDist.connect(dl);dl.connect(dg);dg.connect(auRG)}}
function auDst(b){return typeof b==='string'?auBus[b]:b}
// filtered noise burst with frequency sweep
function auN(bus,dur,type,f0,f1,q,gain,when,atk){if(!auOn||!(gain>.002))return;const t=when||AC.currentTime,s=AC.createBufferSource();s.buffer=NB;s.loop=true;const f=AC.createBiquadFilter();f.type=type;f.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)f.frequency.exponentialRampToValueAtTime(f1,t+dur);f.Q.value=q||.7;
 const g=AC.createGain();if(atk){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+atk)}else g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(auDst(bus));s.start(t,Math.random()*.9);s.stop(t+dur+.03)}
// pitched blip with pitch sweep
function auO(bus,type,f0,f1,dur,gain,when,atk){if(!auOn||!(gain>.002))return;const t=when||AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur);
 if(atk){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+atk)}else g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(auDst(bus));o.start(t);o.stop(t+dur+.03)}
// ---- replacements for the base helpers (routed through the limiter) ----
sfx=function(dur,freq,gain,at){if(!AC)return;auInit();if(auMute||!auOn)return;if(at){gain*=Math.max(0,1-at.distanceTo(pos)/110);if(gain<.01)return}auN('fx',dur,'lowpass',freq,Math.max(60,freq*.45),.7,gain)};
beep=function(f,dur,g){if(!AC)return;auInit();auO('ui','sine',f,f,dur,g*1.6);auO('ui','triangle',f*2,f*2,dur*.6,g*.4)};
sirenTick=function(v){if(!AC)return;auInit();if(!auOn)return;if(!auSir){const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';f.type='bandpass';f.frequency.value=1100;f.Q.value=1;g.gain.value=0;o.connect(f);f.connect(g);g.connect(auBus.fx);o.start();auSir={o,g}}
 const ph=(T*.85)%1,now=AC.currentTime;auSir.o.frequency.setTargetAtTime(640+(ph<.5?ph*2:2-ph*2)*780,now,.03);auSir.g.gain.setTargetAtTime(v*.11,now,.12)};
// ---- weapons ----
function auGun(n,k){if(!auOn||k<.02)return;const r=.94+Math.random()*.12,t=AC.currentTime;
 if(n==='PISTOL'){auN('wpn',.11,'bandpass',1900*r,700,.8,.9*k);auO('wpn','triangle',520*r,90,.07,.5*k);auN('wpn',.35,'lowpass',900,200,.5,.18*k)}
 else if(n==='SMG'){auN('wpn',.07,'bandpass',2600*r,1100,.9,.6*k);auO('wpn','square',340*r,110,.045,.2*k);auN('wpn',.18,'lowpass',1200,300,.5,.1*k)}
 else if(n==='SHOTGUN'){auN('wpn',.22,'lowpass',2400,300,.6,1*k);auO('wpn','sine',150,38,.28,.9*k);auN('wpn',.9,'lowpass',700,120,.5,.3*k);auN('wpn',.05,'bandpass',1500,900,2,.22*k,t+.34);auN('wpn',.06,'bandpass',1100,700,2,.25*k,t+.46)}
 else{auN('wpn',.75,'bandpass',300,2600,1.5,.6*k,t,.05);auO('wpn','sawtooth',70,170,.6,.28*k);auN('wpn',.15,'lowpass',1500,400,.6,.5*k)}}
const auShoot0=shoot;shoot=function(){const w=WEAP[wi],ok=w.ammo>0;auMute++;try{auShoot0()}finally{auMute--}if(ok&&AC){auInit();auGun(w.n,1)}};
const auEShoot0=enemyShoot;enemyShoot=function(s){auMute++;try{auEShoot0(s)}finally{auMute--}if(AC){auInit();auGun('PISTOL',.55*Math.max(0,1-s.g.position.distanceTo(pos)/110))}};
const auDmg0=damage;damage=function(t,dmg){auDmg0(t,dmg);if(!auOn)return;if(t.kind==='ped'||t.kind==='sh')auN('fx',.07,'lowpass',520,180,.7,.32);else{auO('fx','triangle',2100+Math.random()*900,900,.06,.15);auN('fx',.04,'highpass',3200,3200,.7,.18)}};
// ---- explosions ----
function auBoom(p){if(!AC)return;auInit();if(!auOn)return;const d=p.distanceTo(pos),k=Math.max(0,1-d/170);if(k<.02)return;const t=AC.currentTime+Math.min(.3,d/340),near=Math.max(.15,1-d/60);
 auO('fx','sine',95,26,1.0,1.1*k,t);auO('fx','triangle',55,30,1.6,.5*k,t);auN('fx',1.9,'lowpass',900*near+160,70,.6,1*k,t);auN('fx',.25,'bandpass',2800,900,.8,.6*k*near,t);auN('fx',1.2,'bandpass',500,1900,2,.12*k*near,t+.35,.2)}
const auExp0=explode;explode=function(p){auMute++;try{auExp0(p)}finally{auMute--}auBoom(p)};
// ---- jingles + event sounds (hooked on toast text) ----
function auJ(fs,sd,type,g){if(!auOn)return;const t=AC.currentTime;for(let i=0;i<fs.length;i++)if(fs[i])auO('ui',type||'triangle',fs[i],fs[i],sd*2.2,g||.25,t+i*sd,.01)}
function auCrash(k){if(!auOn)return;const t=AC.currentTime;auN('fx',.3,'bandpass',900,300,1,.7*k);auO('fx','sine',140,45,.25,.7*k);auN('fx',.45,'bandpass',1900,1300,6,.28*k);for(let i=0;i<4;i++)auO('fx','sine',2600+Math.random()*2400,1800,.09,.06*k,t+.05+Math.random()*.25)}
function auDoor(){auN('fx',.1,'lowpass',380,120,.8,.5);auO('fx','sine',130,60,.1,.4)}
const auToast0=toast;toast=function(s){auToast0(s);if(!AC)return;auInit();if(!auOn)return;s=String(s);
 if(/^Delivered/.test(s))auJ([523,659,784,1047,1319],.09,'triangle',.3);
 else if(/Package picked up/.test(s))auJ([659,880],.1,'triangle',.25);
 else if(/Too slow|WIPED OUT|failed/i.test(s))auJ([392,330,262,196],.17,'sawtooth',.13);
 else if(/Lost the cops/.test(s))auJ([784,659,523,659,1047],.1,'triangle',.22);
 else if(/CRASH|BUMP|RAMMED/.test(s))auCrash(/BUMP/.test(s)?.6:1);
 else if(/CARJACK|STOLE|Driving!|Got out/.test(s))auDoor();
 else if(/Rain rolling in/.test(s)){auN('amb',2.8,'lowpass',220,50,.5,.6,AC.currentTime+.3,.35);auO('amb','sine',60,30,2.2,.4,AC.currentTime+.3,.2)}};
// ---- engine / tyres / wind ----
function auEngTick(dt){const E=auEng,now=AC.currentTime;
 if(!driving||state!=='play'){E.g.gain.setTargetAtTime(0,now,.1);E.wg.gain.setTargetAtTime(0,now,.2);auScr.g.gain.setTargetAtTime(0,now,.05);E.rpm=0;return}
 const m=driving.m,ud=m.userData||{},kind=ud.kind||'car',sp=driving.speed||0,v=Math.abs(sp),mx=ud.max||38,thr=Math.abs(joy.y)>.22?-joy.y:0,th=Math.abs(thr)>0?1:0;
 const ed=[0,.16,.34,.54,.76,1.6],x=Math.min(1.5,v/mx);let gi=0;while(gi<4&&x>=ed[gi+1])gi++;const fr=Math.min(1,(x-ed[gi])/(Math.min(1.05,ed[gi+1])-ed[gi]));
 let rpm=gi===0?.1+.9*fr:.42+.58*fr;if(kind==='heli')rpm=.8;if(gi!==E.gear){if(gi>E.gear&&kind!=='heli')E.dip=.14;E.gear=gi}
 E.dip=Math.max(0,E.dip-dt);E.rpm+=(rpm-E.rpm)*Math.min(1,dt*9);const r=E.rpm;
 let f=42+r*108,cut=260+r*1500+th*520,vol=.34+r*.4+th*.26,lf=23,ld=.15,ng=0;
 if(kind==='bike'){f=78+r*215;cut=500+r*2400+th*600;lf=31;ld=.22;vol*=.9}
 else if(kind==='boat'){f=30+r*46;cut=220+r*500;lf=8;ld=.5;ng=.25}
 else if(kind==='heli'){f=48;cut=650;lf=12.5;ld=.88;ng=1.1;vol=.62}
 if(E.dip>0)vol*=.45;
 E.o1.frequency.setTargetAtTime(f,now,.04);E.o2.frequency.setTargetAtTime(f*.5,now,.04);E.lp.frequency.setTargetAtTime(cut,now,.05);E.g.gain.setTargetAtTime(vol,now,.06);
 E.lfo.frequency.setTargetAtTime(lf,now,.1);E.ld.gain.setTargetAtTime(ld,now,.1);E.ng.gain.setTargetAtTime(ng,now,.1);
 E.wg.gain.setTargetAtTime(Math.min(.3,x*x*.24),now,.2);
 let sc=0;if(kind==='car'||kind==='bike'){if(Math.abs(joy.x)>.6&&v>mx*.5)sc=.2*Math.abs(joy.x)*Math.min(1,v/mx);if(thr&&sp*thr<0&&v>12)sc=Math.max(sc,.2)}
 auScr.g.gain.setTargetAtTime(sc,now,.07);auScr.f.frequency.setTargetAtTime(1450+v*10,now,.1);auScr.f2.frequency.setTargetAtTime(2100+v*14,now,.1)}
// ---- radio: 4 generated stations ----
const auST=[
 {n:'NEON 104 synthwave',b:'NEON',bpm:104,root:45,sc:[0,2,3,5,7,8,10],prog:[0,5,2,6],sw:0,k:'x...x...x...x...',s:'....x.......x...',h:'..x...x...x...xo',
  mel:[4,null,null,7,null,6,4,null, 9,null,null,7,null,5,null,7, 6,null,8,null,9,null,8,6, 8,null,null,10,null,8,6,null]},
 {n:'BLOCK 88 hip-hop',b:'BLOCK',bpm:88,root:43,sc:[0,2,3,5,7,8,10],prog:[0,0,3,4],sw:.2,k:'x......x..x.....',s:'....x.......x...',h:'x.x.x.xxx.x.x.x.',
  mel:[null,4,null,2,null,null,0,null, null,4,null,2,null,1,0,null, null,5,null,3,null,null,2,null, 4,null,2,null,1,null,null,null]},
 {n:'RIOT 140 rock',b:'RIOT',bpm:140,root:40,sc:[0,2,3,5,7,8,10],prog:[0,5,3,4],sw:0,k:'x.....x.x.....x.',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',g:'x.xx.xx.x.xx.xxx',
  mel:[null,null,null,null,7,6,4,null, null,null,null,null,9,7,5,null, 7,null,9,7,6,null,4,null, 4,6,7,null,9,null,7,6]},
 {n:'DUSK 76 lo-fi',b:'DUSK',bpm:76,root:48,sc:[0,2,4,5,7,9,11],prog:[1,4,0,5],sw:.24,k:'x.........x.....',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',
  mel:[null,null,4,null,3,null,1,null, null,3,null,4,null,null,6,null, null,null,4,null,2,null,1,0, null,2,null,null,0,null,null,null]}];
function auF(S,deg,oct){const o=Math.floor(deg/7),d=((deg%7)+7)%7;return 440*Math.pow(2,(S.root+12*(oct+o)+S.sc[d]-69)/12)}
function auRNote(dst,type,f,t,dur,g,cut,atk,det){const o=AC.createOscillator(),lp=AC.createBiquadFilter(),G=AC.createGain();o.type=type;o.frequency.value=f;if(det)o.detune.value=det;lp.type='lowpass';lp.frequency.value=cut||4000;atk=atk||.008;
 G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g,t+atk);G.gain.setValueAtTime(g,t+Math.max(atk,dur*.7));G.gain.exponentialRampToValueAtTime(.0005,t+dur+atk);o.connect(lp);lp.connect(G);G.connect(dst);o.start(t);o.stop(t+dur+atk+.04)}
function auRStep(S,si,i,t0){const st=i%16,bar=(i>>4)%4,sd=60/S.bpm/4,t=t0+(st%2?S.sw*sd:0),ch=S.prog[bar],R=auRG,e=i>>1,m=st%2===0?S.mel[(bar*8+(st>>1))%32]:null;
 if(S.k[st]==='x'){auO(R,'sine',150,42,.22,si===3?.5:.8,t);if(si===1)auRNote(R,'sine',auF(S,ch,-1),t,sd*5,.42,400,.01)}
 if(S.s[st]==='x'){auN(R,si===3?.12:.17,'bandpass',si===3?1300:1900,900,.7,si===3?.22:.42,t);auO(R,'triangle',190,120,.08,.2,t)}
 const h=S.h[st];if(h!=='.')auN(R,h==='o'?.22:.045,'highpass',7500,7500,.7,(si===2?.12:si===3?.04:.07)*(st%4===0?1:.7),t);
 if(si===0){auRNote(R,'sawtooth',auF(S,ch,-1),t,sd*.8,st%4===0?.1:.2,500);
  if(st===0)for(const d of[0,2,4]){auRNote(R,'sawtooth',auF(S,ch+d,1),t,sd*15,.035,1300,.35,6);auRNote(R,'sawtooth',auF(S,ch+d,1),t,sd*15,.035,1300,.35,-7)}
  if(st%2===0)auRNote(R,'square',auF(S,ch+[0,2,4,7,4,2,4,7][e%8],2),t,sd*1.4,.035,2600);
  if(m!==null)auRNote(R,'sawtooth',auF(S,m,2),t,sd*2.6,.085,2400,.02,5)}
 else if(si===1){if(st===0||st===10)for(const d of[0,2,4,6])auRNote(R,'triangle',auF(S,ch+d,1),t,sd*3,.055,1800);
  if(m!==null){auRNote(R,'sine',auF(S,m,3),t,sd*3,.07,6000);auRNote(R,'sine',auF(S,m,4),t,sd*1.2,.02,8000)}}
 else if(si===2){if(st%2===0)auRNote(R,'sawtooth',auF(S,ch,-1),t,sd*1.6,.2,520);
  if(S.g[st]==='x'){const d=st===0?sd*1.9:sd*.75;for(const q of[[0,0],[4,0],[0,1]])auRNote(auDist,'sawtooth',auF(S,ch+q[0],q[1]),t,d,.3,2200,.004,(q[1]?5:-4))}
  if(m!==null)auRNote(R,'square',auF(S,m,2),t,sd*1.7,.06,3000,.005)}
 else{if(st===0||st===10)for(const d of[0,2,4,6])auRNote(R,'triangle',auF(S,ch+d,d<2?0:1),t,sd*(st?5:7),.075,1100,.02,Math.sin(i)*8);
  if(st===0||st===6||st===10)auRNote(R,'sine',auF(S,ch,-1),t,sd*3,.26,400,.01);
  if(m!==null){auRNote(R,'sine',auF(S,m,2),t,sd*3.2,.075,3000,.015);auRNote(R,'triangle',auF(S,m,2),t,sd*2,.03,1600,.015,9)}
  if(Math.random()<.4)auN(R,.012,'highpass',4000,4000,.7,.035,t+Math.random()*sd)}}
function auRadioTick(){const on=driving&&state==='play'&&auR.st<4,now=AC.currentTime;auRG.gain.setTargetAtTime(on?1:0,now,.15);if(!on){auR.next=0;return}
 const S=auST[auR.st],sd=60/S.bpm/4;if(auR.next<now){auR.next=now+.06}let n=0;while(auR.next<now+.32&&n++<12){auRStep(S,auR.st,auR.step,auR.next);auR.next+=sd;auR.step=(auR.step+1)%64}}
function auRadioNext(){auR.st=(auR.st+1)%5;auR.step=0;auR.next=0;const on=auR.st<4;toast(on?'♪ '+auST[auR.st].n:'Radio off');auBtn.textContent=on?auST[auR.st].b:'OFF';auBtn.style.opacity=on?1:.55}
const auBtn=document.createElement('div');auBtn.id='radio';auBtn.textContent=auST[0].b;
auBtn.style.cssText='position:fixed;top:calc(env(safe-area-inset-top,0px) + 62px);left:50%;margin-left:90px;width:44px;height:44px;border-radius:50%;background:#0008;border:2px solid #7df;color:#fff;font-weight:900;font-size:9px;display:none;align-items:center;justify-content:center;text-align:center;z-index:5';
document.body.appendChild(auBtn);
auBtn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();audio();auRadioNext()},{passive:false});
for(const ev of['mousedown','click'])auBtn.addEventListener(ev,e=>{e.stopPropagation();if(ev==='click')auRadioNext()});
addEventListener('touchend',()=>{if(AC&&AC.state==='suspended')AC.resume()});
// ---- per-frame ----
function auTick(dt){const show=driving&&state==='play'?'flex':'none';if(auBtn.style.display!==show)auBtn.style.display=show;
 if(!AC)return;auInit();if(!auOn)return;const now=AC.currentTime;
 if(driving!==auPrevDrv){auPrevDrv=driving;auR.step=0;auR.next=0}
 auEngTick(dt);auRadioTick();
 // footsteps, jump and landing
 if(!driving&&state==='play'){if(onGround){const hs=Math.hypot(vel.x,vel.z);auStepD+=hs*dt;if(auStepD>2.3){auStepD=0;auN('fx',.08,'lowpass',650+Math.random()*250,160,.8,.5);if(rain>.3)auN('fx',.09,'highpass',2600,2600,.7,.05*rain)}
   if(!auPrevG){auN('fx',.12,'lowpass',300,90,.8,.4);auO('fx','sine',110,50,.1,.3)}}else if(auPrevG&&vel.y>5)auN('fx',.16,'bandpass',500,1400,1,.1,now,.05);auPrevG=onGround}else auPrevG=true;
 // ambience
 const nightK=1-.35*Math.max(0,Math.min(1,-Math.sin(dayT*Math.PI*2)*3+.5));
 auAmb.cg.gain.setTargetAtTime((.15+.04*Math.sin(T*.31))*nightK*(driving?.6:1),now,.5);auAmb.rg.gain.setTargetAtTime(rain*.1,now,.5);auAmb.lg.gain.setTargetAtTime(rain*(driving?.13:.06),now,.5);
 auHornT-=dt;if(auHornT<=0){auHornT=9+Math.random()*16;const g=.012+Math.random()*.012;auO('amb','square',415,415,.38,g,now,.02);auO('amb','square',349,349,.38,g,now,.02);if(Math.random()<.4){auO('amb','square',415,415,.2,g,now+.5,.02);auO('amb','square',349,349,.2,g,now+.5,.02)}}
 // traffic passing close
 auWhoCD-=dt;for(const t of traffic){if(t.dead)continue;const d=Math.hypot(t.m.position.x-pos.x,t.m.position.z-pos.z);if(d<10){if(!t.auIn){t.auIn=true;if(auWhoCD<=0&&state==='play'){auWhoCD=.35;auN('fx',.8,'bandpass',950,330,1.1,.2,now,.22);auO('fx','sawtooth',95,62,.7,.05,now,.2)}}}else if(d>15)t.auIn=false}
 // wanted level sting
 if(wanted>auPrevW){auO('ui','sawtooth',196,196,.22,.16,now,.01);auO('ui','sawtooth',233,233,.22,.16,now+.17,.01);auO('ui','sawtooth',294,294,.45,.18,now+.34,.01);auN('ui',.5,'lowpass',400,100,.7,.2,now+.34)}auPrevW=wanted}
MODS.push(auTick);
// ---- street voices: screams, shouts, gasps, whimpers (a buzz through vowel formant filters, placed left/right and fading with distance) ----
// auVoice('scream'|'shout'|'yelp'|'gasp'|'whimper'|'grunt', position, female)
const auVF={a:[850,1250,2700],e:[600,1800,2600],u:[600,1000,2400],o:[400,850,2400]};let auVoT=0,auVoN=0;
function auVK(p,range){if(!p)return {k:1,t:AC.currentTime,pan:0};const dx=p.x-cam.position.x,dz=p.z-cam.position.z,d=Math.hypot(p.x-pos.x,p.z-pos.z),k=Math.max(0,1-d/(range||65));
 const rx=Math.cos(camYaw),rz=-Math.sin(camYaw),l=Math.hypot(dx,dz)||1;return {k:k*k,t:AC.currentTime+Math.min(.18,d/340),pan:Math.max(-.85,Math.min(.85,(dx*rx+dz*rz)/l))}}
function auVoice(kind,p,fem){if(!AC)return;auInit();if(!auOn||auMute)return;const now=AC.currentTime;if(now-auVoT>1){auVoT=now;auVoN=0}if(++auVoN>5)return;
 const V=auVK(p);if(V.k<.02)return;const t=V.t,r=.9+Math.random()*.22,f0=(fem?235:135)*r,sc=fem?1.14:1;
 let out=AC.createGain();out.gain.value=1;if(AC.createStereoPanner){const pn=AC.createStereoPanner();pn.pan.value=V.pan;out.connect(pn);pn.connect(auBus.fx)}else out.connect(auBus.fx);
 if(kind==='gasp'){auN(out,.32,'bandpass',1400,2600,1.1,.22*V.k,t,.12);return}
 const P={scream:[1.1+Math.random()*.4,[2.05,2.65,2.2],'a',.42,.04,6],shout:[.34,[1.5,1.15,1.1],'e',.5,.02,0],yelp:[.24,[2.3,2,1.7],'a',.4,.015,0],
  whimper:[.75,[1.75,1.9,1.55],'o',.2,.06,9],grunt:[.2,[.9,.8,.7],'u',.38,.015,0]}[kind];if(!P)return;
 const [dur,c,vw,gn,atk,vib]=P,o=AC.createOscillator(),env=AC.createGain(),F=auVF[vw];o.type='sawtooth';
 o.frequency.setValueAtTime(f0*c[0],t);o.frequency.linearRampToValueAtTime(f0*c[1],t+Math.min(.16,dur*.3));o.frequency.linearRampToValueAtTime(f0*c[2],t+dur);
 if(vib){const lf=AC.createOscillator(),lg=AC.createGain();lf.frequency.value=vib+Math.random()*1.5;lg.gain.value=f0*c[1]*(kind==='whimper'?.06:.025);lf.connect(lg);lg.connect(o.frequency);lf.start(t);lf.stop(t+dur+.05)}
 for(let i=0;i<3;i++){const b=AC.createBiquadFilter(),g=AC.createGain();b.type='bandpass';b.frequency.value=F[i]*sc;b.Q.value=[5,7,9][i];g.gain.value=[1.6,.9,.5][i];o.connect(b);b.connect(g);g.connect(env)}
 env.gain.setValueAtTime(.0001,t);env.gain.exponentialRampToValueAtTime(gn*V.k,t+atk);env.gain.setValueAtTime(gn*V.k,t+dur*.6);env.gain.exponentialRampToValueAtTime(.0001,t+dur);env.connect(out);o.start(t);o.stop(t+dur+.05);
 if(kind==='scream')auN(out,dur*.8,'bandpass',2600*sc,2000,.9,.05*V.k,t,.05);
 if(kind==='whimper'){env.gain.setValueAtTime(gn*V.k*.3,t+dur*.38);env.gain.linearRampToValueAtTime(gn*V.k,t+dur*.5)}}
// a punch landing, a swing that misses, a phone being dialled
function auHit(p){if(!AC)return;auInit();if(!auOn)return;const V=auVK(p,50);if(V.k<.02)return;auN('fx',.1,'lowpass',520,140,.9,.75*V.k,V.t);auO('fx','sine',115,45,.13,.6*V.k,V.t);auN('fx',.05,'highpass',2400,2400,.7,.12*V.k,V.t)}
function auWhiff(p){if(!AC)return;auInit();if(!auOn)return;const V=auVK(p,40);if(V.k<.02)return;auN('fx',.2,'bandpass',700,2600,1.3,.16*V.k,V.t,.06)}
function auDial(p){if(!AC)return;auInit();if(!auOn)return;const V=auVK(p,35);if(V.k<.02)return;const tones=[[697,1209],[770,1336],[852,1477],[941,1336]];
 for(let i=0;i<4;i++){const q=tones[i],w=V.t+.2+i*.17;auO('fx','sine',q[0],q[0],.09,.05*V.k,w,.005);auO('fx','sine',q[1],q[1],.09,.04*V.k,w,.005)}}

// ---------- vehicles: motorcycles, helicopters, boats, vehicle damage, headlights ----------
const vhM={rotor:new THREE.MeshStandardMaterial({color:0x1c1e21,roughness:.6}),hull:new THREE.MeshPhysicalMaterial({color:0xf4f4ee,roughness:.25,clearcoat:1,clearcoatRoughness:.1}),deck:new THREE.MeshStandardMaterial({color:0x9a6b3f,roughness:.8})};
function vhPaint(col){return new THREE.MeshPhysicalMaterial({color:col,metalness:.5,roughness:.3,clearcoat:1,clearcoatRoughness:.06})}
function vhMesh(par,geo,mat,sh){const m=new THREE.Mesh(geo,mat);m.castShadow=!!sh;par.add(m);return m}
// ----- motorcycle -----
const vhBikeGeo=(()=>{const rod=(len,x,y,z,rx)=>gT(new THREE.BoxGeometry(.05,len,.05),x,y,z,rx);return {
 paint:U.mergeBufferGeometries([prof([[.62,.8],[.66,1.02],[.45,1.2],[.1,1.08],[-.22,.98],[-.26,.74]],.34,.05),prof([[-.24,.82],[-.98,1.02],[-1.02,.92],[-.3,.68]],.26,.04),bxg(.15,.05,.5,0,.82,-.95)]),
 dark:U.mergeBufferGeometries([prof([[-.2,1.0],[-.92,1.06],[-.92,.98],[-.2,.92]],.28,.03),bxg(.3,.4,.6,0,.55,-.05),rod(.87,-.12,.765,-.75,.48),rod(.87,.12,.765,-.75,.48),bxg(.06,.07,.75,-.1,.4,.45),bxg(.06,.07,.75,.1,.4,.45),bxg(.72,.045,.045,0,1.17,-.55),bxg(.5,.04,.08,0,.42,.15)]),
 chrome:U.mergeBufferGeometries([gT(new THREE.CylinderGeometry(.06,.075,.95,8),.19,.42,.55,Math.PI/2),gT(new THREE.CylinderGeometry(.06,.075,.95,8),-.19,.42,.55,Math.PI/2)]),
 head:bxg(.16,.12,.06,0,.98,-.72),tail:bxg(.14,.06,.05,0,.98,1.02)}})();
function vhMakeBike(col){const g=new THREE.Group();g.rotation.order='YXZ';const pm=vhPaint(col);
 vhMesh(g,vhBikeGeo.paint,pm,1);vhMesh(g,vhBikeGeo.dark,CM.dark,1);vhMesh(g,vhBikeGeo.chrome,CM.trim);vhMesh(g,vhBikeGeo.head,CM.head);vhMesh(g,vhBikeGeo.tail,CM.tail);
 g.userData.wheels=[];for(const z of[-.95,.8]){const w=new THREE.Group();w.scale.set(.5,.95,.95);vhMesh(w,CAR.tire,CM.tire,1);vhMesh(w,CAR.rim,CM.rim);w.position.set(0,.38,z);g.add(w);g.userData.wheels.push(w)}
 g.userData.max=62;return g}
// ----- helicopter -----
const vhHeliGeo={
 paint:U.mergeBufferGeometries([prof([[.6,.6],[.6,2.4],[-.4,2.45],[-1.3,2.1],[-1.5,1.3],[-1.0,.7]],1.9,.15),prof([[-1.3,1.9],[-5.2,1.75],[-5.2,1.5],[-1.3,1.3]],.4,.08),prof([[-4.7,1.6],[-5.5,2.9],[-5.9,2.9],[-5.3,1.5]],.12,.03),bxg(1.5,.06,.42,0,1.72,4.4)]),
 glass:prof([[.55,.62],[1.6,.7],[2.05,1.05],[1.95,1.55],[1.25,2.25],[.55,2.38]],1.8,.14),
 dark:U.mergeBufferGeometries([bxg(1.0,.36,1.7,0,2.64,.4),gT(new THREE.CylinderGeometry(.09,.09,.45,8),0,2.98,.2),bxg(.1,.1,3.6,-.85,.08,-.1),bxg(.1,.1,3.6,.85,.08,-.1),bxg(.07,.62,.07,-.78,.38,-1),bxg(.07,.62,.07,.78,.38,-1),bxg(.07,.62,.07,-.78,.38,.8),bxg(.07,.62,.07,.78,.38,.8)]),
 rotor:U.mergeBufferGeometries([bxg(11,.05,.36,0,0,0),bxg(.36,.05,11,0,0,0),gT(new THREE.CylinderGeometry(.22,.22,.14,10),0,0,0)]),
 trotor:U.mergeBufferGeometries([bxg(.04,1.7,.15,0,0,0),bxg(.04,.15,1.7,0,0,0)]),
 head:bxg(.3,.14,.1,0,.72,-1.55),tail:bxg(.1,.1,.1,0,2.95,5.7)};
function vhMakeHeli(col){const g=new THREE.Group();g.rotation.order='YXZ';const pm=vhPaint(col);
 vhMesh(g,vhHeliGeo.paint,pm,1);vhMesh(g,vhHeliGeo.glass,CM.glass,1);vhMesh(g,vhHeliGeo.dark,CM.dark,1);vhMesh(g,vhHeliGeo.head,CM.head);vhMesh(g,vhHeliGeo.tail,CM.tail);
 const r=vhMesh(g,vhHeliGeo.rotor,vhM.rotor,1);r.position.set(0,3.2,.2);const t=vhMesh(g,vhHeliGeo.trotor,vhM.rotor);t.position.set(.3,2.3,5.45);
 g.userData.wheels=[];g.userData.rotor=r;g.userData.trotor=t;return g}
// ----- speedboat -----
const vhBoatGeo=(()=>{const plan=(k,depth,bev)=>{const s=new THREE.Shape(),P=[[-.95,-2.3],[.95,-2.3],[1,.6],[.6,1.9],[0,2.8],[-.6,1.9],[-1,.6]];s.moveTo(P[0][0]*k,P[0][1]*k);for(let i=1;i<P.length;i++)s.lineTo(P[i][0]*k,P[i][1]*k);const g=new THREE.ExtrudeGeometry(s,{depth:depth,bevelEnabled:true,bevelSize:bev,bevelThickness:bev,bevelSegments:2});g.rotateX(-Math.PI/2);return g};
 const hull=plan(1,.7,.1);hull.translate(0,-.3,0);const deck=plan(.93,.03,.02);deck.translate(0,.5,0);
 return {hull,deck,stripe:bxg(2.24,.13,2.7,0,.2,.9),glass:gT(new THREE.BoxGeometry(1.6,.5,.05),0,.82,-.75,.5),
  dark:U.mergeBufferGeometries([bxg(.5,.45,.5,-.42,.72,.35),bxg(.5,.45,.5,.42,.72,.35),bxg(.5,.75,.1,-.42,.9,.62),bxg(.5,.75,.1,.42,.9,.62),bxg(.55,.85,.55,0,.55,2.45),bxg(1.5,.3,.3,0,.68,-.55)])}})();
function vhMakeBoat(col){const g=new THREE.Group();g.rotation.order='YXZ';vhMesh(g,vhBoatGeo.hull,vhM.hull,1);vhMesh(g,vhBoatGeo.deck,vhM.deck);vhMesh(g,vhBoatGeo.stripe,vhPaint(col));vhMesh(g,vhBoatGeo.glass,CM.glass);vhMesh(g,vhBoatGeo.dark,CM.dark,1);g.userData.wheels=[];return g}
// ----- spawn -----
const vhBikes=[],vhHelis=[],vhBoats=[],vhSeaX=HALF+42.5;const vhPads=[],vhRoofs=[],vhElev=[];
(()=>{const cols=[0xd62828,0x111111,0x1d70b8,0xffd60a,0x2a9d8f,0xff7b00];
 for(let k=0;k<12;k++){const m=vhMakeBike(cols[k%cols.length]);let i=Math.floor(Math.random()*(N+1)),j=Math.floor(Math.random()*N),z=roadCenter(j)+CELL/2+(Math.random()-.5)*22;if(k===0){i=5;z=roadCenter(5)+13}
  m.position.set(roadCenter(i)-ROAD/2+1.1,0,z);m.rotation.y=0;m.rotation.z=.14;scene.add(m);const c={m,speed:0,steer:0,hp:100,vhBike:true,vhEng:new THREE.Vector3(0,.7,0)};cars.push(c);vhBikes.push(c)}
 const bc=[0xd62828,0x1d70b8,0xffa200];for(let k=0;k<7;k++){const m=vhMakeBoat(bc[k%3]);m.position.set(HALF+46.5,0,-255+k*85);m.rotation.y=-Math.PI/2+(Math.random()-.5)*.5;scene.add(m);const c={m,speed:0,steer:0,hp:100,vhT:'boat',vhPh:k*2.1,vhEng:new THREE.Vector3(0,.9,2.4)};cars.push(c);vhBoats.push(c)}})();
// ----- rider shown on bikes and boats -----
const vhRider=makePerson(0xff5a36,0x23324d,0xf1c27d);vhRider.userData.rlType='player';vhRider.userData.rlMe=true;vhRider.userData.rlH=1;vhRider.userData.rlSeat='bike';if(typeof rlRecolor==='function')rlRecolor(vhRider);
vhRider.children[0].children[0].onBeforeRender=()=>{const u=vhRider.userData,p=vhRider.userData.vhPose;u.armL.rotation.x=u.armR.rotation.x=p[0];u.elbL.rotation.x=u.elbR.rotation.x=p[1];u.legL.rotation.x=u.legR.rotation.x=p[2];u.kneeL.rotation.x=u.kneeR.rotation.x=p[3]};
vhRider.userData.vhPose=[1.1,.25,1.25,-1.5];
function vhSeat(c){const m=c.m;vhRider.userData.rlSeat=c.vhT==='boat'?'boat':'bike';if(c.vhBike){vhRider.userData.vhPose=[1.05,.3,1.2,-1.55];vhRider.position.set(0,-.02,.62);vhRider.rotation.set(-.32,0,0);vhRider.userData.armL.rotation.x=1.05;m.add(vhRider)}
 else if(c.vhT==='boat'){vhRider.userData.vhPose=[.9,.5,1.35,-1.3];vhRider.position.set(-.42,-.12,.42);vhRider.rotation.set(0,0,0);m.add(vhRider)}}
// ----- held JUMP (helicopter climb) -----
let vhJump=false,vhDown=false;const vhJumpIds={};
{const b=document.createElement('div');b.id='vhdn';b.className='btn';b.textContent='DOWN';b.style.cssText='right:216px;bottom:calc(env(safe-area-inset-bottom,0px) + 34px);background:#4aa3ff60;display:none';document.body.appendChild(b);
 b.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();vhDown=true},{passive:false});const up=e=>{e.stopPropagation();vhDown=false};b.addEventListener('touchend',up);b.addEventListener('touchcancel',up);
 addEventListener('keydown',e=>{if(e.key==='c')vhDown=true});addEventListener('keyup',e=>{if(e.key==='c')vhDown=false})}
addEventListener('touchstart',e=>{for(const t of e.changedTouches)if(hit($('jump'),t)){vhJumpIds[t.identifier]=1;vhJump=true}},{passive:true});
function vhTouchEnd(e){for(const t of e.changedTouches)delete vhJumpIds[t.identifier];if(!e.touches||!e.touches.length)for(const k in vhJumpIds)delete vhJumpIds[k];vhJump=Object.keys(vhJumpIds).length>0}
addEventListener('touchend',vhTouchEnd);addEventListener('touchcancel',vhTouchEnd);
addEventListener('keydown',e=>{if(e.key===' ')vhJump=true});addEventListener('keyup',e=>{if(e.key===' ')vhJump=false});
// ----- laptop flight keys, shared by helicopters (here), planes (airport) and jets -----
// vhK holds key state by e.code. vhKbFly is true while the pilot flies with the keyboard; a real touch switches back to the touch controls.
const vhK={};let vhKbFly=false,vhKbLast=(navigator.maxTouchPoints||0)===0;
const vhFlyCodes={KeyW:1,KeyA:1,KeyS:1,KeyD:1,ArrowUp:1,ArrowDown:1,ArrowLeft:1,ArrowRight:1,Space:1,KeyC:1};
function vhFlying(){const c=driving;return !!(c&&state==='play'&&(c.vhT==='heli'||c.kind==='plane'))}
function vhKeyTxt(e){return e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]')}
addEventListener('keydown',e=>{if(vhKeyTxt(e))return;vhK[e.code]=1;vhKbLast=true;if(vhFlyCodes[e.code]&&vhFlying()){vhKbFly=true;if(e.code.indexOf('Arrow')===0||e.code==='Space')e.preventDefault()}},true);
addEventListener('keyup',e=>{vhK[e.code]=0},true);addEventListener('blur',()=>{for(const k in vhK)vhK[k]=0});
addEventListener('touchstart',e=>{for(const t of e.changedTouches||[])if(t.pt!=='mouse'&&t.pt!=='key'){vhKbFly=false;vhKbLast=false}},true);
function vhKA(a,b){return (vhK[a]||vhK[b])?1:0}
// small keycap hint shown the first time per session the player takes each kind of aircraft with a keyboard
const vhHintSeen={};let vhKHT=0;const vhHintEl=document.createElement('div');vhHintEl.id='vhKeys';document.body.appendChild(vhHintEl);
{const st=document.createElement('style');st.textContent='#vhKeys{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 70px);transform:translateX(-50%);z-index:7;display:none;pointer-events:none;padding:8px 14px;border-radius:14px;background:rgba(14,16,24,.64);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.14);color:#fff;font:700 11px/1.9 system-ui,-apple-system,Segoe UI,sans-serif;text-align:center;white-space:nowrap;transition:opacity .6s;box-shadow:0 8px 22px rgba(0,0,0,.3)}#vhKeys kbd{display:inline-block;min-width:13px;padding:0 5px;margin:0 1px;border-radius:5px;background:rgba(255,255,255,.92);color:#15171d;font:800 10px/17px system-ui,sans-serif;box-shadow:0 2px 0 rgba(255,255,255,.35)}#vhKeys i{font-style:normal;opacity:.55;margin:0 7px}';document.head.appendChild(st)}
function vhFlyHint(kind){if(vhHintSeen[kind]||!vhKbLast)return;vhHintSeen[kind]=1;const k=s=>'<kbd>'+s+'</kbd>',d='<i>&middot;</i>';
 vhHintEl.innerHTML=kind==='heli'?(k('W')+k('A')+k('S')+k('D')+' fly'+d+k('Space')+' up'+d+k('C')+' down<br>hold '+k('E')+' to bail out'):
  (k('W')+k('S')+' throttle'+d+k('A')+k('D')+' bank'+d+k('&uarr;')+k('&darr;')+' pitch ('+k('&darr;')+' climbs)<br>'+k('&larr;')+k('&rarr;')+' rudder'+d+k('Space')+' brake'+d+'hold '+k('E')+' to bail out');
 vhHintEl.style.opacity='1';vhHintEl.style.display='block';vhKHT=9}
function vhHintTick(dt){if(vhKHT<=0)return;vhKHT-=dt;if(!vhFlying())vhKHT=Math.min(vhKHT,.01);if(vhKHT<.7)vhHintEl.style.opacity='0';if(vhKHT<=0)vhHintEl.style.display='none'}
// ----- vehicle health (GTA-style): hp stays 0..100 percent of each vehicle's own max points -----
const vhBurning=[],vhDamaged=new Set();let vhCur=null,vhSmokeT=0,vhLastV=0,vhOwnBlow=null;
function vhManaged(c){if(!c||c.dead)return false;const k=c.kind||(c.m&&c.m.userData.kind);return !(c.custom||k==='plane'||k==='jet')}
function vhMaxPts(c){if(c.vhMaxP)return c.vhMaxP;const u=c.m.userData;let p=1000;
 if(u.mass)p=Math.max(400,Math.min(9000,u.mass*.75));
 else if(c.vhBike)p=420;else if(c.vhT==='heli')p=1100;else if(c.vhT==='boat')p=800;else if(c.ldTank||c.ldV==='tank')p=7000;else if(c.ldV==='truck')p=2800;else if(c.ldV==='jeep')p=1900;
 else if(u.max&&u.max<=31)p=1500;else if(u.max&&u.max>=56)p=850;
 if(c.hp===undefined)c.hp=100;if(c.hp>100){p*=c.hp/100;c.hp=100}
 c.vhMaxP=p;return p}
function vhHit(c,pts,kind){if(!vhManaged(c)||pts<=0)return;const mx=vhMaxPts(c);c.hp=(c.hp===undefined?100:c.hp)-pts/mx*100;vhDamaged.add(c);
 if(c.hp<=0&&kind==='boom'){c.hp=.1;if(c.vhFire===undefined||c.vhFire>.6){if(c.vhFire===undefined)vhBurning.push(c);c.vhFire=.6}return}
 c.hp=Math.max(.1,c.hp);if(c.hp<5&&c.vhFire===undefined){c.vhFire=6;vhBurning.push(c);if(c===driving){toast('ON FIRE! GET OUT!');beep(300,.3,.2)}}}
// legacy entry used by other modules (old scale: n percent of a 100-point car)
function vhDamage(n){if(driving)vhHit(driving,n*10,'legacy')}
const vhHurtPrev=hurt;hurt=function(n){const c=driving;
 if(n>0&&c&&state==='play'&&vhManaged(c)){const big=n>=20;vhHit(c,n*(big?13:6)*(c.vhBike?.6:1),big?'boom':'hit');
  let leak=c.vhBike?.7:(c.hp<25?(1-c.hp/25)*.6:0);if(big&&!c.vhBike)leak=Math.max(leak,.12);if(leak>0)vhHurtPrev(n*leak);
  shake=Math.max(shake,big?.5:.12);return}
 vhHurtPrev(n)};
{const bp=blowParked;blowParked=function(c){const own=c===vhOwnBlow,c0=cash,w0=wantedScore;bp(c);if(own){cash=c0;wantedScore=w0;vhOwnBlow=null}}}
function vhEngPos(c){return c.m.localToWorld((c.vhEng||new THREE.Vector3(0,1.05,-1.6)).clone())}
function vhDmgTick(dt){const c=driving;
 // impacts: speed change within one frame (wall, traffic, police rams); cosmetic below ~8 units/s
 if(c&&!c.vhT&&vhManaged(c)&&state==='play'){const dv=Math.abs(c.speed-vhLastV);if(dv>8&&c===vhCur)vhHit(c,.18*(dv*dv-64),'crash');vhLastV=c.speed;
  const pct=c.hp===undefined?100:c.hp;if(pct<30){const mx=(c.m.userData.max||38)*(.4+.6*pct/30);c.speed=Math.max(-mx*.5,Math.min(mx,c.speed));if(pct<15&&Math.random()<dt*1.5){c.speed*=.85;sfx(.12,300,.25)}}}
 else vhLastV=c?c.speed:0;
 if(c&&c.vhFire!==undefined&&c.hp>=20){delete c.vhFire;const i=vhBurning.indexOf(c);if(i>=0)vhBurning.splice(i,1)}
 if(c&&c.hp<40&&vhManaged(c))vhDamaged.add(c);
 vhSmokeT-=dt;if(vhSmokeT<=0){vhSmokeT=.08;let n=0;for(const v of vhDamaged){if(v.dead||!v.m.parent||v.hp>=40){if(v.dead||v.hp>=40)vhDamaged.delete(v);continue}if(v.m.position.distanceTo(pos)>90||n>=6)continue;n++;
   const h=v.hp;burst(vhEngPos(v),h<20?2:1,h<20?0x1c1c1c:0x8a8a8a,1.6,h<20?.75:.55,h<20?1.5:1.1,.9)}}
 for(let i=vhBurning.length-1;i>=0;i--){const b=vhBurning[i];if(b.dead){vhBurning.splice(i,1);continue}b.vhFire-=dt;const e=vhEngPos(b);burst(e,2,Math.random()<.5?0xff7a18:0xffc130,2.2,.55,.45,1.2);
  if(b.vhFire<=0){vhBurning.splice(i,1);if(driving===b){driving=null;player.visible=true}vhOwnBlow=b;blowParked(b);vhOwnBlow=null}}}

// ----- flight and boat control (called from the driving block) -----
let vhUp=false;
function vhGround(x,z,y){let f=0;for(const P of vhPads)if(P.y<=y+.7&&Math.hypot(x-P.x,z-P.z)<P.r)f=Math.max(f,P.y);
 for(const s of solids){if(s.maxX-s.minX<2||s.h>y+.7)continue;if(x>s.minX-1.2&&x<s.maxX+1.2&&z>s.minZ-1.2&&z<s.maxZ+1.2)f=Math.max(f,s.h+(s.h>4?.62:.1))}
 if(f===0){const mx=((x+HALF)%CELL+CELL)%CELL,mz=((z+HALF)%CELL+CELL)%CELL;if(mx>ROAD&&mz>ROAD&&Math.abs(x)<HALF&&Math.abs(z)<HALF)f=.32}
 if(typeof ldFloor==='function'){const h=ldFloor(x,z);if(h>f&&h<=y+.7)f=h}if(typeof isLandAt==='function'){const h=isLandAt(x,z);if(h>f&&h<=y+.7)f=h}return f}
function vhDrive(dt,jx,jy){const c=driving,m=c.m,p=m.position;jumpQ=false;
 if(c.vhT==='heli'){if(vhKbFly){jx=vhKA('KeyD','ArrowRight')-vhKA('KeyA','ArrowLeft');jy=vhKA('KeyS','ArrowDown')-vhKA('KeyW','ArrowUp')}c.vhSpin=Math.min(1,c.vhSpin+dt*.8);const fl0=c.vhFloor||0,air=p.y>fl0+.12,up=(vhJump||vhUp)&&c.vhSpin>.85,dn=vhDown&&!up;
  let tv=up?11:(dn?-9:0);const hgt=p.y-fl0;if(dn&&hgt<5)tv=Math.max(tv,-(1+hgt*1.6));if(!air&&!up)tv=0;
  c.vy+=(tv-c.vy)*Math.min(1,dt*(up||dn?2.2:3.2));
  if(air){c.speed+=-jy*26*dt;c.speed*=Math.pow(Math.abs(jy)<.05?.45:.72,dt);c.speed=Math.max(-14,Math.min(46,c.speed));m.rotation.y+=-jx*dt*1.7}else c.speed*=Math.pow(.002,dt);
  p.x+=-Math.sin(m.rotation.y)*c.speed*dt;p.z+=-Math.cos(m.rotation.y)*c.speed*dt;p.y=Math.min(200,p.y+c.vy*dt);
  if(collide(p,2.7,p.y)){const s=Math.abs(c.speed);if(s>8){vhHit(c,.18*(s*s-64),'crash');toast('CRASH!');shake=.5;sfx(.4,500,.8)}c.speed*=-.3}
  const fl=vhGround(p.x,p.z,p.y);c.vhFloor=fl;if(p.y<=fl){if(c.vy<-8){vhHit(c,3*(c.vy*c.vy-64),'crash');shake=.5;sfx(.4,400,.8)}p.y=fl;c.vy=Math.max(0,c.vy)}
  const a2=p.y>fl+.12?1:0;m.rotation.x+=(-c.speed/46*.3*a2-m.rotation.x)*Math.min(1,dt*4);m.rotation.z+=(-jx*.28*a2-m.rotation.z)*Math.min(1,dt*4)}
 else{c.speed+=-jy*22*dt;c.speed*=Math.pow(.55,dt);if(Math.abs(jy)<.05)c.speed*=Math.pow(.5,dt);c.speed=Math.max(-8,Math.min(36,c.speed));
  m.rotation.y+=-jx*dt*Math.min(1,Math.abs(c.speed)/5)*1.5*Math.sign(c.speed||1);c.vhSteer=jx;
  p.x+=-Math.sin(m.rotation.y)*c.speed*dt;p.z+=-Math.cos(m.rotation.y)*c.speed*dt;
  if(p.x<vhSeaX){p.x=vhSeaX;const s=Math.abs(c.speed);if(s>8){vhHit(c,.18*(s*s-64),'crash');toast('CRASH!');shake=.4;sfx(.3,500,.7)}c.speed*=-.2}
  p.x=Math.min(HALF+520,p.x);p.z=Math.max(-HALF-190,Math.min(HALF+190,p.z));
  if(Math.abs(c.speed)>5&&Math.random()<.8){const w=m.localToWorld(new THREE.Vector3((Math.random()-.5)*1.4,.15,2.6));burst(w,1,0xffffff,2.5,.45,.7,.3)}}
 pos.copy(p);facing=m.rotation.y}
// ----- airborne exit guard: a tap on CAR in the air does nothing; hold it ~0.8 s to bail out -----
let vhHoldId=null,vhHoldT0=0,vhHoldKey=false,vhBailOK=false,vhHintT=-9;
const vhRingEl=document.createElement('div');vhRingEl.style.cssText='position:fixed;pointer-events:none;border-radius:50%;z-index:30;display:none;-webkit-mask:radial-gradient(circle,transparent 58%,#000 60%);mask:radial-gradient(circle,transparent 58%,#000 60%)';document.body.appendChild(vhRingEl);
function vhAirborne(c){if(!c||c.dead)return false;const m=c.m,k=c.kind||m.userData.kind;
 if(c.vhT==='heli')return m.position.y>(c.vhFloor||0)+.6;if(k==='plane'||k==='jet')return m.position.y>2;return false}
function vhAirExitGuard(){if(!carQ||!driving||state!=='play'||!vhAirborne(driving))return false;if(vhBailOK){vhBailOK=false;return false}carQ=false;if(T-vhHintT>1.4){vhHintT=T;toast('Hold to bail out')}return true}
addEventListener('touchstart',e=>{for(const t of e.changedTouches)if(hit($('car'),t)){vhHoldId=t.identifier;vhHoldT0=performance.now()}},{passive:true});
{const end=e=>{for(const t of e.changedTouches)if(t.identifier===vhHoldId)vhHoldId=null;if(!e.touches||!e.touches.length)vhHoldId=null};addEventListener('touchend',end);addEventListener('touchcancel',end)}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if((k==='e'||k==='enter')&&!e.repeat){vhHoldKey=true;vhHoldT0=performance.now()}});addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='e'||k==='enter')vhHoldKey=false});
function vhGuardTick(){const c=driving,air=state==='play'&&vhAirborne(c),holding=vhHoldId!==null||vhHoldKey;
 if(air&&holding){const f=Math.min(1,(performance.now()-vhHoldT0)/800);const r=$('car').getBoundingClientRect(),pad=8;
  vhRingEl.style.display='block';vhRingEl.style.left=(r.left-pad)+'px';vhRingEl.style.top=(r.top-pad)+'px';vhRingEl.style.width=(r.width+pad*2)+'px';vhRingEl.style.height=(r.height+pad*2)+'px';
  vhRingEl.style.background='conic-gradient(#ffd23f '+(f*360)+'deg, rgba(255,255,255,.18) 0deg)';
  if(f>=1){vhHoldId=null;vhHoldKey=false;vhBailOK=true;carQ=true;vhRingEl.style.display='none'}}
 else vhRingEl.style.display='none';
 if(!air)vhBailOK=false;
 vhAirExitGuard();
 // landed helicopter: step out onto whatever it stands on (roof, pad or ground) instead of the street below
 if(carQ&&c&&c.vhT==='heli'&&!air&&state==='play'){carQ=false;const m=c.m,fl=c.vhFloor||0,ry=m.rotation.y;c.speed=0;c.vy=0;driving=null;player.visible=true;
  let sp=null;for(const s of[1,-1,0]){const x=s?m.position.x+Math.cos(ry)*3.4*s:m.position.x-Math.sin(ry)*4.2,z=s?m.position.z-Math.sin(ry)*3.4*s:m.position.z-Math.cos(ry)*4.2;
   const g=vhGround(x,z,fl+.5);if(Math.abs(g-fl)<.8||(fl<1&&g<1)){sp=[x,Math.max(g,.3),z];break}}
  if(!sp)sp=[m.position.x+Math.cos(ry)*3.4,fl,m.position.z-Math.sin(ry)*3.4];pos.set(sp[0],sp[1],sp[2]);vel.set(0,0,0);onGround=true;toast('Got out')}}
{const nc=nearestCar;nearestCar=function(peek){if(!driving&&state==='play'){let best=null,bd=6.8;for(const h of vhHelis){if(h.dead)continue;const d=Math.hypot(h.m.position.x-pos.x,h.m.position.z-pos.z);if(d<bd&&Math.abs(h.m.position.y-pos.y)<2.6){bd=d;best=h}}
  if(best&&pos.y>2){if(!peek)beep(500,.1,.12);return best}}return nc(peek)}}

// ----- helipads: hospital roof, police roof, downtown tower roof, beach rescue pad -----
// each pad registers {x,z,y(top surface),r}; vhGround knows pads so helicopters rest exactly on them
function vhPadTex(ring){return canvasTex(256,256,g=>{g.fillStyle='#2f3236';g.fillRect(0,0,256,256);for(let i=0;i<900;i++){g.fillStyle='rgba(255,255,255,'+(Math.random()*.05)+')';g.fillRect(Math.random()*256,Math.random()*256,2,2)}
 g.strokeStyle='#f2f2f2';g.lineWidth=5;g.beginPath();g.arc(128,128,120,0,7);g.stroke();g.strokeStyle=ring;g.lineWidth=12;g.beginPath();g.arc(128,128,100,0,7);g.stroke();
 g.fillStyle='#fff';g.fillRect(84,62,22,132);g.fillRect(150,62,22,132);g.fillRect(84,117,88,22)})}
const vhPadGeo=new THREE.CircleGeometry(5.7,40),vhSlabGeo=new THREE.CylinderGeometry(6.2,6.35,.22,40);
const vhSlabMat=new THREE.MeshStandardMaterial({color:0x4a4d52,roughness:.9}),vhPadLampMat=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0x7dff9a,emissiveIntensity:0,toneMapped:false});
function vhMakePad(x,y,z,yaw,ring,rp){rp=rp||6.3;const k=rp/6.3,top=y+.22;const slab=new THREE.Mesh(vhSlabGeo,vhSlabMat);slab.scale.set(k,1,k);slab.position.set(x,y+.11,z);slab.receiveShadow=true;slab.castShadow=true;scene.add(slab);
 const pad=new THREE.Mesh(vhPadGeo,new THREE.MeshStandardMaterial({map:vhPadTex(ring),roughness:.85}));pad.rotation.set(-Math.PI/2,0,yaw);pad.scale.set(k,k,1);pad.position.set(x,top+.004,z);pad.receiveShadow=true;scene.add(pad);
 const L=[];for(let k=0;k<16;k++){const a=k/16*Math.PI*2;L.push(bxg(.22,.12,.22,x+Math.cos(a)*5.95*k,top+.06,z+Math.sin(a)*5.95*k))}const lamps=new THREE.Mesh(U.mergeBufferGeometries(L),vhPadLampMat);scene.add(lamps);
 const P={x,z,y:top,r:rp,yaw};vhPads.push(P);return P}
// a building's roof: hide the base roof block so the deck is clear, keep it free of world rooftop gear, add a walkable floor
function vhRoofOf(b){const x=(b.minX+b.maxX)/2,z=(b.minZ+b.maxZ)/2,y=b.h+.6;
 for(const o of scene.children.slice())if(o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry'&&Math.abs(o.position.x-x)<.05&&Math.abs(o.position.z-z)<.05&&Math.abs(o.position.y-(b.h+1.3))<.05)scene.remove(o);
 const R={b,x,z,y,x0:b.minX+.25,x1:b.maxX-.25,z0:b.minZ+.25,z1:b.maxZ-.25};vhRoofs.push(R);vhNoGear.add(b);return R}
// elevator: glowing door on the north face at street level, housing with an exit door on the roof
const vhElevMat=new THREE.MeshStandardMaterial({color:0x0f141a,emissive:0x35b0ff,emissiveIntensity:1.4,toneMapped:false}),vhRingMat=new THREE.MeshBasicMaterial({color:0x35b0ff,transparent:true,opacity:.55,toneMapped:false,depthWrite:false});
const vhSignTex=canvasTex(256,128,g=>{g.fillStyle='#0b0f14';g.fillRect(0,0,256,128);g.strokeStyle='#35b0ff';g.lineWidth=6;g.strokeRect(6,6,244,116);g.fillStyle='#e8f4ff';g.font='900 44px -apple-system,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('HELIPAD',128,50);g.font='700 30px -apple-system,Arial,sans-serif';g.fillStyle='#35b0ff';g.fillText('ELEVATOR â–²',128,94)});
const vhSign2Tex=canvasTex(256,128,g=>{g.fillStyle='#0b0f14';g.fillRect(0,0,256,128);g.strokeStyle='#35b0ff';g.lineWidth=6;g.strokeRect(6,6,244,116);g.fillStyle='#e8f4ff';g.font='900 46px -apple-system,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('STREET',128,50);g.font='700 30px -apple-system,Arial,sans-serif';g.fillStyle='#35b0ff';g.fillText('ELEVATOR â–¼',128,94)});
function vhRing(x,y,z){const m=new THREE.Mesh(new THREE.RingGeometry(.75,1.15,32),vhRingMat);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.userData.vhKeep=true;scene.add(m);return m}
function vhElevator(R,side){const b=R.b,w=b.maxX-b.minX,off=Math.min(6.5,w/2-2.4)*side,sx=R.x+off,sz=b.minZ;
 const door=new THREE.Mesh(bxg(2.2,3,.2,sx,1.8,sz-.1),new THREE.MeshStandardMaterial({color:0x8e98a3,metalness:.85,roughness:.28}));scene.add(door);const seam=new THREE.Mesh(bxg(.05,3,.22,sx,1.8,sz-.11),CM.dark);scene.add(seam);
 const fr=[bxg(2.7,.2,.36,sx,3.38,sz-.18),bxg(.2,3.2,.36,sx-1.2,1.75,sz-.18),bxg(.2,3.2,.36,sx+1.2,1.75,sz-.18)];const frame=new THREE.Mesh(U.mergeBufferGeometries(fr),vhElevMat);scene.add(frame);
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.3),new THREE.MeshBasicMaterial({map:vhSignTex,toneMapped:false}));sg.position.set(sx,4.55,sz-.42);sg.rotation.y=Math.PI;scene.add(sg);
 const d=b.maxZ-b.minZ,hx=R.x+(w/2-1.6)*side,hz=R.z-(d/2-1.6),hy=R.y;const hs=new THREE.Mesh(new THREE.BoxGeometry(1.8,2.6,1.8),new THREE.MeshStandardMaterial({color:0x6b6f75,roughness:.8}));hs.position.set(hx,hy+1.3,hz);hs.castShadow=true;scene.add(hs);
 solids.push({minX:hx-.9,maxX:hx+.9,minZ:hz-.9,maxZ:hz+.9,h:hy+2.6});
 const d2=new THREE.Mesh(new THREE.BoxGeometry(.1,2.1,1.2),vhElevMat);d2.position.set(hx-side*.92,hy+1.05,hz);scene.add(d2);
 const s2=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.75),new THREE.MeshBasicMaterial({map:vhSign2Tex,toneMapped:false}));s2.position.set(hx-side*.96,hy+2.3,hz);s2.rotation.y=-side*Math.PI/2;scene.add(s2);
 const rx=hx-side*2.2;const E={R,sx,sz:sz-1.5,rx,rz:hz,ry:hy,a:vhRing(sx,.36,sz-1.5),b:vhRing(rx,hy+.05,hz),lock:false};vhElev.push(E);return E}
const vhNoGear=new Set();
// keep world's rooftop AC units, water towers, antennas and billboards off the pad roofs (world filters solids once at load)
solids.filter=function(f){delete solids.filter;return Array.prototype.filter.call(this,(s,i,a)=>!vhNoGear.has(s)&&f(s,i,a))};
function vhBlockBld(i,j){const cx=roadCenter(i)+CELL/2,cz=roadCenter(j)+CELL/2;let best=null;
 for(const s of solids)if(s.h>4.5&&s.maxX-s.minX>8&&Math.abs((s.minX+s.maxX)/2-cx)<BLOCK/2&&Math.abs((s.minZ+s.maxZ)/2-cz)<BLOCK/2&&(!best||s.minZ<best.minZ-.5||(Math.abs(s.minZ-best.minZ)<.5&&s.minX<best.minX)))best=s;return best}
(()=>{const spots=[];
 const hosp=vhBlockBld(6,6),pol=vhBlockBld(4,4);if(hosp)spots.push([hosp,0xf2f2f2,'#ff3050',1]);if(pol&&pol!==hosp)spots.push([pol,0x1d3557,'#5a7dff',-1]);
 let tw=null,tb=-1;for(const s of solids){const w=s.maxX-s.minX,cx=(s.minX+s.maxX)/2,cz=(s.minZ+s.maxZ)/2;if(s===hosp||s===pol||w<14.5||s.maxZ-s.minZ<14.5||s.h<40||s.h>95||Math.hypot(cx,cz)>HALF*.42)continue;const sc=s.h+(w>=30?80:0)-Math.hypot(cx,cz)*.1;if(sc>tb){tb=sc;tw=s}}
 if(tw)spots.push([tw,0x16181c,'#ffd23f',1]);
 for(const sp of spots){const R=vhRoofOf(sp[0]),b=sp[0],rp=Math.min(6.3,Math.min(b.maxX-b.minX,b.maxZ-b.minZ)/2-2.3);const P=vhMakePad(R.x,R.y,R.z,0,sp[2],rp);vhElevator(R,sp[3]);vhHeliAt(P,sp[1])}
 // beach rescue pad at the quiet south end of the sand (world props stop at z<HALF-4)
 const bx=HALF+27,bz=HALF+24,by=.02;const P=vhMakePad(bx,by,bz,Math.PI/2,'#ff8a2a');vhHeliAt(P,0xf4a261)})();
function vhHeliAt(P,col){const m=vhMakeHeli(col);m.position.set(P.x,P.y,P.z);m.rotation.y=P.yaw;scene.add(m);const c={m,speed:0,steer:0,hp:100,vhT:'heli',vy:0,vhSpin:0,vhFloor:P.y,vhPad:P,vhEng:new THREE.Vector3(0,2.7,.4)};cars.push(c);vhHelis.push(c);return c}
// on foot: stand on pad roofs, ride the elevators
let vhOnRoof=null,vhElevCD=0;
function vhFade(cb){if(typeof cpFade==='function'){try{cpFade(cb);return}catch(e){}}cb()}
function vhRoofTick(dt){vhElevCD-=dt;if(driving||state!=='play'){vhOnRoof=null;return}
 let sup=null;for(const R of vhRoofs)if(pos.x>R.x0&&pos.x<R.x1&&pos.z>R.z0&&pos.z<R.z1&&pos.y>R.y-1.6&&pos.y<=R.y+.14&&vel.y<=30*dt+.001){sup=R;break}
 if(sup){pos.y=sup.y;vel.y=30*dt;onGround=true;vhOnRoof=sup}else if(vhOnRoof){const R=vhOnRoof;if(!(pos.x>R.x0&&pos.x<R.x1&&pos.z>R.z0&&pos.z<R.z1))onGround=false;vhOnRoof=null}
 for(const E of vhElev){const ds=Math.hypot(pos.x-E.sx,pos.z-E.sz),dr=Math.hypot(pos.x-E.rx,pos.z-E.rz),onR=Math.abs(pos.y-E.ry)<1.2,onS=pos.y<2.5;
  E.a.material.opacity=.4+.25*Math.sin(T*4);
  if(E.lock){if((onS&&ds>2.2||!onS)&&(onR&&dr>2.2||!onR))E.lock=false;continue}
  if(vhElevCD>0)continue;
  if(onS&&ds<1.3){E.lock=true;vhElevCD=1.2;vhFade(()=>{pos.set(E.rx,E.ry,E.rz);vel.set(0,0,0);onGround=true;camYaw=0;toast('Roof helipad')});beep(880,.12,.1);break}
  if(onR&&dr<1.3){E.lock=true;vhElevCD=1.2;vhFade(()=>{pos.set(E.sx,.3,E.sz-.6);vel.set(0,0,0);onGround=true;camYaw=0;toast('Street level')});beep(660,.12,.1);break}}}
// first frame: snap other modules' helicopters (army base) onto their own pads, level and aligned
let vhPadInit=false;
function vhPadsLate(){vhPadInit=true;for(const h of vhHelis){if(h.vhPad)continue;const m=h.m,y=Math.max(m.position.y,h.vhFloor||0);const P={x:m.position.x,z:m.position.z,y,r:6.3,yaw:0};vhPads.push(P);h.vhPad=P;m.position.y=y;m.rotation.set(0,0,0);h.vhFloor=y}}

// ----- headlight -----
const vhSpot=new THREE.SpotLight(0xfff0cc,0,70,.6,.7,1.3);scene.add(vhSpot);scene.add(vhSpot.target);
// ----- vehicle health bar: kept for compatibility but never shown (GTA hides car health) -----
(()=>{const o=document.createElement('div');o.id='vhbw';o.style.display='none';const i=document.createElement('div');i.id='vhb';i.style.cssText='height:100%;width:100%;background:#ffb020';o.appendChild(i);$('bars').appendChild(o)})();
// ----- per-frame -----
function vhTick(dt){if(!vhPadInit)vhPadsLate();
 if(carQ&&driving&&state==='play'){if(driving.vhT==='boat'&&driving.m.position.x>HALF+53){carQ=false;toast('Get closer to the beach')}}
 vhGuardTick();vhRoofTick(dt);vhHintTick(dt);
 if(driving!==vhCur){if(vhCur&&vhCur.vhT==='heli'&&!driving&&vhCur.m.position.y>(vhCur.vhFloor||0)+.6){const m=vhCur.m,ax=m.position.x-pos.x,az=m.position.z-pos.z,d=Math.hypot(ax,az)||1;vhCur.vhDrift=[ax/d*7-Math.sin(m.rotation.y)*vhCur.speed*.6,az/d*7-Math.cos(m.rotation.y)*vhCur.speed*.6]}
  if(vhRider.parent)vhRider.parent.remove(vhRider);vhCur=driving;vhLastV=driving?driving.speed:0;if(driving){if(driving.hp===undefined)driving.hp=100;vhMaxPts(driving);vhSeat(driving);if(driving.vhT==='heli'){if(vhKbLast)vhFlyHint('heli');else toast('UP to climb, DOWN to descend. Hold CAR to bail out')}else if(driving.vhT==='boat')toast('Boat! Push up to go')}}
 const c=driving;
 if(c&&c.vhBike&&state==='play'){let jy=joy.y,jx=joy.x;if(Math.hypot(jx,jy)<.22){jx=0;jy=0}c.speed+=-jy*16*dt;const tz=-jx*.48*Math.min(1,Math.abs(c.speed)/22)*Math.sign(c.speed||1);c.m.rotation.z+=(tz-c.m.rotation.z)*Math.min(1,dt*6)}
 for(const b of vhBikes)if(b!==c&&!b.dead)b.m.rotation.z+=(.14-b.m.rotation.z)*Math.min(1,dt*4);
 vhDmgTick(dt);
 for(const h of vhHelis){const m=h.m;if(h!==c){h.vhSpin=Math.max(0,h.vhSpin-dt*.35);const fl=vhGround(m.position.x,m.position.z,m.position.y);h.vhFloor=fl;if(m.position.y>fl){h.vy=Math.max(-30,h.vy-22*dt);m.position.y+=h.vy*dt;m.rotation.x+=dt*.4;if(h.vhDrift){m.position.x+=h.vhDrift[0]*dt;m.position.z+=h.vhDrift[1]*dt;m.rotation.y+=dt*1.6}if(m.position.y<=fl){m.position.y=fl;m.rotation.x=0;m.rotation.z=0;h.vhDrift=null;if(h.vy<-10&&!h.dead)blowParked(h);h.vy=0}}}
  if(h.dead)h.vhSpin=Math.max(0,h.vhSpin-dt);m.userData.rotor.rotation.y+=dt*34*h.vhSpin;m.userData.trotor.rotation.x+=dt*50*h.vhSpin}
 for(const b of vhBoats){if(b.dead)continue;const m=b.m,sp=b===c?b.speed/36:0;m.position.y=.02+Math.sin(T*1.8+b.vhPh)*.09+Math.abs(sp)*.12;m.rotation.x=Math.sin(T*1.3+b.vhPh)*.035+sp*.12;const tz=Math.sin(T*1.1+b.vhPh)*.04+(b===c?-(b.vhSteer||0)*.22*Math.min(1,Math.abs(sp)*2):0);m.rotation.z+=(tz-m.rotation.z)*Math.min(1,dt*5)}
 const night=1-Math.max(0,Math.min(1,Math.sin(dayT*Math.PI*2)*3+.5)),dim=Math.min(1,night+rain*.5);vhPadLampMat.emissiveIntensity=.4+night*2.6*(Math.sin(T*3)>-.3?1:.35);
 if(c&&dim>.05){const m=c.m,heli=c.vhT==='heli';vhSpot.position.copy(m.localToWorld(heli?new THREE.Vector3(0,.7,-1.6):new THREE.Vector3(0,1,-2.1)));vhSpot.target.position.copy(m.localToWorld(heli?new THREE.Vector3(0,-14,-16):new THREE.Vector3(0,-.5,-24)));vhSpot.intensity=dim*(heli?5:3.2)}else vhSpot.intensity=0}
MODS.push(vhTick);

// ---------- world detail (wd): street furniture, neon, rooftops, beach, sky, parks ----------
let wdDraws=0,wdT=0,wdPh=-1;
const wdMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,metalness:.05}),wdMatC=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:0}),wdDum=new THREE.Object3D(),wdCol=new THREE.Color(),wdR=Math.random;
function wdG(g,col,x,y,z,rx,ry,rz){if(g.index)g=g.toNonIndexed();if(rx)g.rotateX(rx);if(rz)g.rotateZ(rz);if(ry)g.rotateY(ry);g.translate(x||0,y||0,z||0);
 wdCol.set(col).convertSRGBToLinear();const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=wdCol.r;a[i*3+1]=wdCol.g;a[i*3+2]=wdCol.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
const wdBox=(w,h,d,col,x,y,z,rx,ry,rz)=>wdG(new THREE.BoxGeometry(w,h,d),col,x,y,z,rx,ry,rz);
const wdCyl=(rt,rb,h,n,col,x,y,z,rx,ry,rz)=>wdG(new THREE.CylinderGeometry(rt,rb,h,n),col,x,y,z,rx,ry,rz);
const wdSph=(r,col,x,y,z)=>wdG(new THREE.SphereGeometry(r,7,5),col,x,y,z);
function wdInst(parts,arr,o){o=o||{};const geo=Array.isArray(parts)?U.mergeBufferGeometries(parts):parts;const m=new THREE.InstancedMesh(geo,o.mat||(arr.length&&arr[0][6]!==undefined?wdMatC:wdMat),Math.max(1,arr.length));m.count=arr.length;
 for(let i=0;i<arr.length;i++){const a=arr[i];wdDum.position.set(a[0],a[1],a[2]);wdDum.rotation.set(0,a[3]||0,0);const s=a[4]||1;wdDum.scale.set(a[7]||s,a[5]||s,s);wdDum.updateMatrix();m.setMatrixAt(i,wdDum.matrix);if(a[6]!==undefined)m.setColorAt(i,wdCol.set(a[6]).convertSRGBToLinear())}
 m.frustumCulled=false;m.castShadow=!!o.shadow;m.receiveShadow=!o.noRecv;scene.add(m);wdDraws++;return m}
const wdC0=roadCenter(0)+CELL/2,wdParks={},wdParkList=[[5,5],[1,8],[8,1],[2,2],[8,6],[4,9]];wdParkList.forEach(p=>wdParks[p[0]+','+p[1]]=1);
const wdSides=[[1,0],[-1,0],[0,1],[0,-1]],wdFace=(fx,fz)=>Math.atan2(-fx,-fz);
function wdPt(cx,cz,s,r,a){const n=wdSides[s];return [cx+n[0]*r-n[1]*a,cz+n[1]*r+n[0]*a]}
const wdBld=solids.filter(s=>s.h>=8&&s.maxX-s.minX>=10);
// flat decals (crosswalks, stop lines, park paths, courts): one mesh
const wdDec={p:[],c:[]};
function wdQuad(x0,z0,x1,z1,y,col){wdCol.set(col).convertSRGBToLinear();wdDec.p.push(x0,y,z0,x0,y,z1,x1,y,z0,x1,y,z0,x0,y,z1,x1,y,z1);for(let i=0;i<6;i++)wdDec.c.push(wdCol.r,wdCol.g,wdCol.b)}
// textured quads (signs, billboards)
function wdTQ(Q,cx,cy,cz,n,w,h,u0,v0,u1,v1){const rx=n[1]*w/2,rz=-n[0]*w/2,h2=h/2;Q.p.push(cx-rx,cy-h2,cz-rz,cx+rx,cy-h2,cz+rz,cx+rx,cy+h2,cz+rz,cx-rx,cy-h2,cz-rz,cx+rx,cy+h2,cz+rz,cx-rx,cy+h2,cz-rz);Q.u.push(u0,v0,u1,v0,u1,v1,u0,v0,u1,v1,u0,v1)}
function wdTQMesh(Q,mat){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(Q.p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(Q.u,2));const m=new THREE.Mesh(g,mat);m.frustumCulled=false;scene.add(m);wdDraws++;return m}
// ---- streets ----
const wdA={hyd:[],bench:[],trash:[],bus:[],mail:[],sign:[],tl:[],flower:[],hoop:[],play:[]},wdBusS=[],wdFac=[],wdM={};
for(let i=0;i<=N;i++)for(let j=0;j<=N;j++){const rx=roadCenter(i),rz=roadCenter(j);
 for(const c of [[-1,1,0],[1,-1,Math.PI]]){const bi=i+(c[0]>0?0:-1),bj=j+(c[1]>0?0:-1);if(bi<0||bi>=N||bj<0||bj>=N)continue;wdA.tl.push([rx+c[0]*7.6,.3,rz+c[1]*7.6,c[2]])}
 for(let k=0;k<10;k++){const o=-6.65+k*1.4;
  if(i>0)wdQuad(rx-10.4,rz+o,rx-7.6,rz+o+.7,.04,0xe9e9e9);if(i<N)wdQuad(rx+7.6,rz+o,rx+10.4,rz+o+.7,.04,0xe9e9e9);
  if(j>0)wdQuad(rx+o,rz-10.4,rx+o+.7,rz-7.6,.04,0xe9e9e9);if(j<N)wdQuad(rx+o,rz+7.6,rx+o+.7,rz+10.4,.04,0xe9e9e9)}
 if(i>0)wdQuad(rx-11.7,rz+.4,rx-11.2,rz+6.8,.04,0xe9e9e9);if(i<N)wdQuad(rx+11.2,rz-6.8,rx+11.7,rz-.4,.04,0xe9e9e9);
 if(j>0)wdQuad(rx-6.8,rz-11.7,rx-.4,rz-11.2,.04,0xe9e9e9);if(j<N)wdQuad(rx+.4,rz+11.2,rx+6.8,rz+11.7,.04,0xe9e9e9)}
for(let i=0;i<N;i++)for(let j=0;j<N;j++){const cx=wdC0+i*CELL,cz=wdC0+j*CELL;let s,p,n;
 if(wdParks[i+','+j]){const y=.375,py=.355;
  wdQuad(cx-18,cz-1.4,cx+18,cz+1.4,y,0x8f7650);wdQuad(cx-1.4,cz-18,cx+1.4,cz+18,y,0x8f7650);wdQuad(cx-6.5,cz-6.5,cx+6.5,cz+6.5,y+.004,0x86796a);
  wdA.bench.push([cx+5.8,py,cz+3.2,wdFace(-1,0)],[cx-5.8,py,cz-3.2,wdFace(1,0)],[cx-3.2,py,cz+5.8,wdFace(0,-1)],[cx+3.2,py,cz-5.8,wdFace(0,1)]);
  wdA.trash.push([cx+7,py,cz-2.2,0],[cx-7,py,cz+2.2,0]);
  for(const a of [[-7.6,7.6],[7.6,-7.6],[-7.6,-7.6],[12,2.7],[-12,-2.7],[2.7,-12],[-2.7,12],[-12,2.7],[2.7,12],[15.5,-2.7],[-2.7,-15.5]])wdA.flower.push([cx+a[0],py,cz+a[1],wdR()*6,.9+wdR()*.4]);
  const pk=wdParkList.findIndex(q=>q[0]===i&&q[1]===j);
  if(pk===3||pk===4){wdQuad(cx+6.6,cz+6.6,cx+17.6,cz+17.6,y+.002,0x9c6b3f);wdA.play.push([cx+12.1,py,cz+12.1,0])}
  else if(pk===1||pk===2){const X0=cx+3.4,X1=cx+17.4,Z0=cz-17.2,Z1=cz-9,zc=(Z0+Z1)/2,xc=(X0+X1)/2,W=0xf2f2f2,cy=y+.004;wdQuad(X0,Z0,X1,Z1,y+.002,0x2d6e8a);
   wdQuad(X0,Z0,X1,Z0+.12,cy,W);wdQuad(X0,Z1-.12,X1,Z1,cy,W);wdQuad(X0,Z0,X0+.12,Z1,cy,W);wdQuad(X1-.12,Z0,X1,Z1,cy,W);wdQuad(xc-.06,Z0,xc+.06,Z1,cy,W);
   for(const e of [[X0,1],[X1,-1]]){const a=e[0],b=e[0]+e[1]*3.6;wdQuad(Math.min(a,b),zc-1.6,Math.max(a,b),zc-1.48,cy,W);wdQuad(Math.min(a,b),zc+1.48,Math.max(a,b),zc+1.6,cy,W);wdQuad(b-.06,zc-1.6,b+.06,zc+1.6,cy,W);wdQuad(Math.min(a,b),zc-1.48,Math.max(a,b),zc+1.48,y+.003,0xb5482f);wdA.hoop.push([e[0]+e[1]*.5,py,zc,wdFace(e[1],0)])}}
  continue}
 s=Math.floor(wdR()*4);p=wdPt(cx,cz,s,19.4,(wdR()<.5?-1:1)*(6+wdR()*7));wdA.hyd.push([p[0],.3,p[1],wdR()*6]);
 for(let k=0;k<2;k++){s=Math.floor(wdR()*4);p=wdPt(cx,cz,s,19.3,(k?-1:1)*15.3);wdA.trash.push([p[0],.3,p[1],0])}
 for(s=0;s<4;s++)if(wdR()<.5){n=wdSides[s];p=wdPt(cx,cz,s,16.75,8.5);wdA.bench.push([p[0],.3,p[1],wdFace(n[0],n[1])])}
 if((i+j)%3===0){s=(i+2*j)%4;n=wdSides[s];p=wdPt(cx,cz,s,17,-8.5);wdA.bus.push([p[0],.3,p[1],wdFace(n[0],n[1])]);wdBusS.push(n[0]?{minX:p[0]-.75,maxX:p[0]+.75,minZ:p[1]-1.75,maxZ:p[1]+1.75,h:2.6}:{minX:p[0]-1.75,maxX:p[0]+1.75,minZ:p[1]-.75,maxZ:p[1]+.75,h:2.6});solids.push(wdBusS[wdBusS.length-1])}
 if((i*3+j)%4===1){s=(i+j)%2?2:0;n=wdSides[s];p=wdPt(cx,cz,s,19.2,3.2);wdA.mail.push([p[0],.3,p[1],wdFace(-n[0],-n[1])])}
 for(let k=0;k<2;k++){s=(i+j+k*2)%4;n=wdSides[s];p=wdPt(cx,cz,s,19.5,-11.5);wdA.sign.push([p[0],.3,p[1],wdFace(-n[1],n[0])])}}
// traffic lights: poles (1 draw) + bulbs for the two directions (2 draws) driven by tiny 3x1 textures
const wdD=0x24272b;
wdInst([wdCyl(.11,.14,5.8,8,wdD,0,2.9,0),wdCyl(.2,.25,.4,8,wdD,0,.2,0),wdCyl(.07,.07,4.4,6,wdD,2.2,5.72,0,0,0,Math.PI/2),wdBox(.52,1.55,.42,0x111214,4.2,4.95,0),wdBox(.52,1.55,.42,0x111214,0,3.4,-.3),wdCyl(.07,.07,4.4,6,wdD,0,5.72,-2.2,Math.PI/2),wdBox(.42,1.55,.52,0x111214,0,4.95,-4.2),wdBox(.42,1.55,.52,0x111214,-.3,3.4,0),
 wdBox(1.7,.3,.05,0x1c7a3c,.2,4.55,.18),wdBox(.05,.3,1.7,0x1c7a3c,.18,4.9,.2)],wdA.tl,{shadow:1});
function wdBulbs(A){const a=[];for(const h of A?[[-.23,4.95,-4.2],[-.53,3.4,0]]:[[4.2,4.95,-.23],[0,3.4,-.53]])for(let k=0;k<3;k++){const g=(A?new THREE.BoxGeometry(.06,.32,.32):new THREE.BoxGeometry(.32,.32,.06)).toNonIndexed(),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(k+.5)/3,.5);g.translate(h[0],h[1]+.5-k*.5,h[2]);a.push(g)}return U.mergeBufferGeometries(a)}
const wdTLc=[[255,45,35],[255,185,30],[45,255,110]];
function wdTLTex(){const t=new THREE.DataTexture(new Uint8Array(12),3,1);t.needsUpdate=true;return t}
function wdSetTL(t,on){const d=t.image.data;for(let k=0;k<3;k++){const f=k===on?1:.09;d[k*4]=wdTLc[k][0]*f;d[k*4+1]=wdTLc[k][1]*f;d[k*4+2]=wdTLc[k][2]*f;d[k*4+3]=255}t.needsUpdate=true}
const wdTLA=wdTLTex(),wdTLB=wdTLTex();
for(const e of [[1,wdTLA],[0,wdTLB]]){const mt=new THREE.MeshBasicMaterial({map:e[1],toneMapped:false});mt.color.setScalar(2.8);wdInst(wdBulbs(e[0]),wdA.tl,{mat:mt,noRecv:1})}
// furniture
wdInst([wdCyl(.17,.2,.55,8,0xc8261c,0,.28,0),wdSph(.18,0xc8261c,0,.56,0),wdCyl(.07,.07,.52,6,0xc8261c,0,.38,0,0,0,Math.PI/2),wdCyl(.06,.06,.14,6,0xd9d9d9,0,.74,0)],wdA.hyd);
wdM.bench=wdInst([wdBox(2,.1,.55,0x8a5a2b,0,.5,0),wdBox(2,.5,.08,0x8a5a2b,0,.88,.27),wdBox(.1,.5,.5,0x26282b,-.85,.25,0),wdBox(.1,.5,.5,0x26282b,.85,.25,0),wdBox(.08,.5,.08,0x26282b,-.85,.75,.27),wdBox(.08,.5,.08,0x26282b,.85,.75,.27)],wdA.bench,{shadow:1});
wdInst([wdCyl(.3,.25,.8,10,0x2f5d3a,0,.4,0),wdCyl(.32,.32,.08,10,0x1c1e20,0,.83,0)],wdA.trash);
wdM.bus=wdInst([wdBox(3.5,.1,1.5,0x2e4a66,0,2.5,0),wdBox(.1,2.5,.1,0x2b2d30,-1.65,1.25,.65),wdBox(.1,2.5,.1,0x2b2d30,1.65,1.25,.65),wdBox(.1,2.5,.1,0x2b2d30,-1.65,1.25,-.65),wdBox(.1,2.5,.1,0x2b2d30,1.65,1.25,-.65),
 wdBox(3.2,1.7,.05,0x86b6d8,0,1.45,.68),wdBox(2.4,.1,.45,0x8a5a2b,0,.5,.35),wdBox(.06,1.6,1.1,0xe6e6e6,-1.66,1.3,0),wdBox(.08,2.9,.08,0x9a9a9a,2.05,1.45,-.6),wdBox(.55,.55,.06,0x1e63c9,2.05,2.7,-.6)],wdA.bus,{shadow:1});
wdInst([wdBox(.5,.7,.45,0x1c4fa0,0,.75,0),wdCyl(.25,.25,.45,8,0x1c4fa0,0,1.1,0,Math.PI/2),wdBox(.06,.4,.06,0x1b1b1b,-.2,.2,-.17),wdBox(.06,.4,.06,0x1b1b1b,.2,.2,-.17),wdBox(.06,.4,.06,0x1b1b1b,-.2,.2,.17),wdBox(.06,.4,.06,0x1b1b1b,.2,.2,.17),wdBox(.3,.05,.02,0xdddddd,0,.95,-.23)],wdA.mail);
wdInst([wdCyl(.04,.04,2.7,6,0x9a9a9a,0,1.35,0),wdBox(.55,.7,.04,0xf2f2f2,0,2.35,-.05),wdBox(.4,.16,.05,0xc22a2a,0,2.52,-.06),wdBox(.3,.3,.05,0x1b1b1b,0,2.2,-.06)],wdA.sign);
// ---- shops: awnings (instanced, tinted) + neon signs (atlas quads) + rooftop gear + billboards ----
const wdSignTex=canvasTex(1024,1024,g=>{const names=['ZAPP ARCADE','MOXI MART 24H','BRIX GYM','LUNA LOUNGE','KOBO NOODLES','PEEL JUICE BAR','ORBIT CAFE','TACO TORNADO','VOLT TIRES','PAWN PALACE','DOT LAUNDRY','RIFF RECORDS','HEX TATTOO','BUN + CRUMB','FIN FISH MARKET','SNIP SALON'],cols=['#ff3d81','#35e0ff','#ffd23f','#7dff5a','#ff8a2a','#b46bff'];
 g.fillStyle='#000';g.fillRect(0,0,1024,1024);g.textAlign='center';g.textBaseline='middle';
 for(let k=0;k<16;k++){const x=(k%2)*512,y=Math.floor(k/2)*128,c=cols[k%cols.length];g.fillStyle='#0b0d14';g.fillRect(x+4,y+4,504,120);g.strokeStyle=c;g.lineWidth=6;g.strokeRect(x+11,y+11,490,106);g.shadowColor=c;g.shadowBlur=16;g.fillStyle=c;g.font='900 62px -apple-system,Helvetica,Arial,sans-serif';g.fillText(names[k],x+256,y+68,440);g.fillText(names[k],x+256,y+68,440);g.shadowBlur=0}});
const wdBillTex=canvasTex(1024,1024,g=>{const ads=[['FIZZ BLAST','SODA THAT SLAPS','#ff4f8b','#ff9a3c','#fff'],['AERO KICKS','RUN THE BLOCK','#0c0c10','#1c1c26','#b6ff3a'],['RADIO 99.9','BLOCK CITY BEATS','#3a1c8f','#b0409f','#fff'],['PALM BAY','BEACHES ARE EAST','#2aa8ff','#9fe3ff','#fff36b'],['COMET X9','THE PHONE THAT FLIES','#07152e','#123a7a','#7fe0ff'],['BURGER BARN','DOUBLE STACK $4','#c81d25','#ff5a36','#ffd23f'],['TURBO JOLT','ENERGY IN A CAN','#ffd400','#ff9d00','#111'],['DRIVE SAFE','THE COPS ARE WATCHING','#14181d','#2b333c','#ff5050']];
 g.textAlign='center';g.textBaseline='middle';
 for(let k=0;k<8;k++){const x=(k%2)*512,y=Math.floor(k/2)*256,a=ads[k],gr=g.createLinearGradient(x,y,x+512,y+256);gr.addColorStop(0,a[2]);gr.addColorStop(1,a[3]);g.fillStyle=gr;g.fillRect(x,y,512,256);
  g.globalAlpha=.16;g.fillStyle='#fff';for(let c=0;c<7;c++){g.beginPath();g.arc(x+40+((c*83+k*37)%440),y+30+((c*59+k*23)%200),18+((c*13)%34),0,7);g.fill()}g.globalAlpha=1;
  g.fillStyle='rgba(0,0,0,.35)';g.font='900 92px -apple-system,Helvetica,Arial,sans-serif';g.fillText(a[0],x+260,y+108,470);g.fillStyle=a[4];g.fillText(a[0],x+256,y+104,470);
  g.font='700 36px -apple-system,Helvetica,Arial,sans-serif';g.fillText(a[1],x+256,y+190,460);g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=8;g.strokeRect(x+4,y+4,504,248)}});
const wdSignMat=new THREE.MeshBasicMaterial({map:wdSignTex,toneMapped:false}),wdBillMat=new THREE.MeshBasicMaterial({map:wdBillTex,toneMapped:false});
const wdSQ={p:[],u:[]},wdBQ={p:[],u:[]},wdAw=[],wdAC=[],wdWT=[],wdAnt=[],wdBlk=[],wdBillC=[],wdAwCols=[0xb3261e,0x1f6f43,0x1c3f7a,0xd9772b,0x12807a,0x7a1f3d,0x2b2b2b,0xc9a227];
const wdElevB=new Set();try{if(typeof vhElev!=='undefined')for(const E of vhElev)if(E.R&&E.R.b)wdElevB.add(E.R.b)}catch(e){}
for(const b of wdBld){const bx=(b.minX+b.maxX)/2,bz=(b.minZ+b.maxZ)/2,w=b.maxX-b.minX,d=b.maxZ-b.minZ,h=b.h,ci=Math.round((bx-wdC0)/CELL),cj=Math.round((bz-wdC0)/CELL);if(ci<0||ci>=N||cj<0||cj>=N)continue;const cx=wdC0+ci*CELL,cz=wdC0+cj*CELL;
 for(let s=0;s<4;s++){const n=wdSides[s],fx=bx+n[0]*w/2,fz=bz+n[1]*d/2;if((fx-cx)*n[0]+(fz-cz)*n[1]<15.5)continue;if(n[1]<0&&wdElevB.has(b))continue;const fw=n[0]?d:w;
  if(wdR()<.72){const aw=Math.min(fw*.7,9),off=(wdR()-.5)*(fw-aw)*.6,px=fx-n[1]*off,pz=fz+n[0]*off;wdFac.push({x:px,z:pz,n,aw,i:wdAw.length,q:wdSQ.p.length});wdAw.push([px,3.3,pz,wdFace(n[0],n[1]),1,1,wdAwCols[Math.floor(wdR()*wdAwCols.length)],aw]);
   const sw=Math.min(aw*.92,6.4),k=Math.floor(wdR()*16),u0=(k%2)/2,v1=1-Math.floor(k/2)/8;wdTQ(wdSQ,px+n[0]*.14,4.75,pz+n[1]*.14,n,sw,sw/4,u0,v1-.125,u0+.5,v1)}
  if(h>=14&&h<=46&&fw>=14)wdBillC.push({x:fx-n[0]*1.1,y:h+.6,z:fz-n[1]*1.1,n})}
 if(h>=10){const q=[[1,1],[1,-1],[-1,1],[-1,-1]].sort(()=>wdR()-.5),y=h+.6,na=1+Math.floor(wdR()*3);for(let k=0;k<na;k++)wdAC.push([bx+q[k][0]*w*.33,y,bz+q[k][1]*d*.33,wdR()<.5?0:Math.PI/2]);
  if(h<55&&wdR()<.28)wdWT.push([bx+q[3][0]*w*.3,y,bz+q[3][1]*d*.3,wdR()*6,Math.min(1.5,w/14)]);
  if(h>50){const sc=1+h/160;wdAnt.push([bx,h+2.3,bz,wdR()*6,sc]);wdBlk.push([bx,h+2.3+10.2*sc,bz])}}}
{const g=U.mergeBufferGeometries([wdG(new THREE.BoxGeometry(1,.08,1.45),0xffffff,0,0,-.7,-.32),wdBox(1,.28,.04,0xeeeeee,0,-.37,-1.388)]);wdM.aw=wdInst(g,wdAw,{shadow:1})}
wdM.sign=wdTQMesh(wdSQ,wdSignMat);
// a shop storefront takes over a facade: remove the generic awning + neon sign there, and benches / bus shelters in front of its door
// wdClearFacade(x0,x1,z,nz,doorX): north (nz<0) or south (nz>0) facade at z spanning x0..x1
// east/west facade at x spanning z0..z1 (used where another module hangs its own sign on that wall)
function wdClearSide(z0,z1,x,nx){const Z=new THREE.Matrix4().makeScale(0,0,0);for(const e of wdFac){if(e.gone||e.n[1]!==0||Math.sign(e.n[0])!==Math.sign(nx)||Math.abs(e.x-x)>.8||e.z+e.aw/2<z0||e.z-e.aw/2>z1)continue;e.gone=true;wdM.aw.setMatrixAt(e.i,Z);wdM.aw.instanceMatrix.needsUpdate=true;
 const P=wdM.sign.geometry.attributes.position;for(let k=e.q/3;k<e.q/3+6;k++)P.setXYZ(k,0,-50,0);P.needsUpdate=true}}
function wdClearFacade(x0,x1,z,nz,dx){const Z=new THREE.Matrix4().makeScale(0,0,0);
 for(const e of wdFac){if(e.gone||e.n[0]!==0||Math.sign(e.n[1])!==Math.sign(nz)||Math.abs(e.z-z)>.8||e.x<x0-.5||e.x>x1+.5)continue;e.gone=true;wdM.aw.setMatrixAt(e.i,Z);wdM.aw.instanceMatrix.needsUpdate=true;
  const P=wdM.sign.geometry.attributes.position;for(let k=e.q/3;k<e.q/3+6;k++)P.setXYZ(k,0,-50,0);P.needsUpdate=true}
 if(dx===undefined)return;for(const L of[['bench',wdA.bench],['bus',wdA.bus]])L[1].forEach((a,k)=>{if(Math.abs(a[0]-dx)<5.5&&Math.abs(a[2]-z)<3.2&&!a.gone){a.gone=true;wdM[L[0]].setMatrixAt(k,Z);wdM[L[0]].instanceMatrix.needsUpdate=true;
  if(L[0]==='bus'){const s=wdBusS[k],i=solids.indexOf(s);if(i>=0)solids.splice(i,1)}}})}
wdInst([wdBox(1.7,1,1.25,0xb4b8bc,0,.5,0),wdCyl(.45,.45,.06,10,0x2b2f33,0,1.03,0),wdBox(1.72,.5,.9,0x8d9196,0,.5,0),wdBox(.3,.25,.3,0x6d7176,.6,1.1,.4)],wdAC);
wdInst([wdBox(.15,2,.15,0x33363a,-.8,1,-.8),wdBox(.15,2,.15,0x33363a,.8,1,-.8),wdBox(.15,2,.15,0x33363a,-.8,1,.8),wdBox(.15,2,.15,0x33363a,.8,1,.8),wdCyl(1.3,1.3,2.2,10,0x7a5230,0,3.1,0),wdCyl(1.34,1.34,.1,10,0x2b2b2b,0,2.5,0),wdCyl(1.34,1.34,.1,10,0x2b2b2b,0,3.7,0),wdG(new THREE.ConeGeometry(1.5,.9,10),0x4a4f55,0,4.65,0)],wdWT,{shadow:1});
wdInst([wdCyl(.07,.14,10,6,0xcfd3d6,0,5,0),wdBox(1.6,.06,.06,0xcfd3d6,0,5.5,0),wdBox(.06,.06,1.3,0xcfd3d6,0,7,0),wdBox(1,.06,.06,0xcfd3d6,0,8.4,0),wdCyl(.5,.2,.25,8,0xe6e6e6,.3,3.2,0,0,0,.9)],wdAnt);
const wdBlinkMat=new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false});wdInst(new THREE.SphereGeometry(.28,8,6),wdBlk,{mat:wdBlinkMat,noRecv:1});
{wdBillC.sort(()=>wdR()-.5);const pick=[];for(const c of wdBillC){if(pick.length>=16)break;if(pick.every(p=>Math.hypot(p.x-c.x,p.z-c.z)>55))pick.push(c)}
 const arr=pick.map((c,k)=>{const u0=(k%2)/2,v1=1-Math.floor((k%8)/2)/4;wdTQ(wdBQ,c.x+c.n[0]*.06,c.y+6.5,c.z+c.n[1]*.06,c.n,14,7,u0,v1-.25,u0+.5,v1);return [c.x,c.y,c.z,wdFace(c.n[0],c.n[1])]});
 wdInst([wdBox(.3,3,.3,0x2b2d30,-4.5,1.5,.3),wdBox(.3,3,.3,0x2b2d30,4.5,1.5,.3),wdBox(14.5,7.5,.3,0x1d1f22,0,6.5,.25),wdBox(14.5,.12,.9,0x3a3d41,0,2.75,-.3),wdBox(.12,.12,3,0x2b2d30,-4.5,3,1.4,.75),wdBox(.12,.12,3,0x2b2d30,4.5,3,1.4,.75)],arr,{shadow:1});wdTQMesh(wdBQ,wdBillMat)}
// ---- parks: flowers, playground, hoops ----
{const p=[wdCyl(.9,1,.25,10,0x4a3523,0,.12,0)],fc=[0xff4d6d,0xffd23f,0xff8fab,0xffffff,0xb46bff,0xff7b00];for(let k=0;k<9;k++){const a=k*2.4,r=k?.3+(k%3)*.22:0,x=Math.cos(a)*r,z=Math.sin(a)*r;p.push(wdCyl(.025,.025,.3,4,0x2f8f3a,x,.38,z),wdSph(.15,fc[k%fc.length],x,.56,z))}wdInst(p,wdA.flower)}
wdInst([wdCyl(.07,.07,4.4,6,0xd33a2c,-2.5,2.6,-3.4,0,0,Math.PI/2),wdCyl(.06,.06,2.8,6,0xd33a2c,-4.6,1.3,-2.9,.3),wdCyl(.06,.06,2.8,6,0xd33a2c,-4.6,1.3,-3.9,-.3),wdCyl(.06,.06,2.8,6,0xd33a2c,-.4,1.3,-2.9,.3),wdCyl(.06,.06,2.8,6,0xd33a2c,-.4,1.3,-3.9,-.3),
 wdBox(.03,1.8,.03,0x9a9a9a,-3.6,1.7,-3.4),wdBox(.03,1.8,.03,0x9a9a9a,-3,1.7,-3.4),wdBox(.6,.05,.25,0x1b1b1b,-3.3,.8,-3.4),wdBox(.03,1.8,.03,0x9a9a9a,-2,1.7,-3.4),wdBox(.03,1.8,.03,0x9a9a9a,-1.4,1.7,-3.4),wdBox(.6,.05,.25,0x1b1b1b,-1.7,.8,-3.4),
 wdBox(1.5,.1,1.5,0x2a6fd6,3,1.6,2.4),wdBox(.1,1.6,.1,0x2a6fd6,2.35,.8,1.75),wdBox(.1,1.6,.1,0x2a6fd6,3.65,.8,1.75),wdBox(.1,1.6,.1,0x2a6fd6,2.35,.8,3.05),wdBox(.1,1.6,.1,0x2a6fd6,3.65,.8,3.05),wdBox(.9,.08,3.5,0xf2c230,3,.85,.1,-.46),wdBox(.06,.3,3.5,0xf2c230,2.52,.98,.1,-.46),wdBox(.06,.3,3.5,0xf2c230,3.48,.98,.1,-.46),wdBox(.7,1.7,.08,0x9a9a9a,3,.8,3.3,-.2),wdBox(1.5,.5,.06,0xd33a2c,3,2.2,3.12),
 wdBox(3.2,.25,3.2,0x8a5a2b,-2.8,.12,2.6),wdBox(2.9,.06,2.9,0xe6d49c,-2.8,.26,2.6),wdCyl(.15,.2,.5,6,0x555555,2.6,.25,-3.6),wdBox(3.2,.08,.3,0x3cb043,2.6,.55,-3.6,0,0,.16)],wdA.play,{shadow:1});
wdInst([wdCyl(.09,.09,3.5,6,0x2b2d30,0,1.75,.7),wdBox(.1,.1,.8,0x2b2d30,0,3.35,.3),wdBox(1.7,1.1,.06,0xf4f4f4,0,3.45,-.1),wdBox(.6,.45,.02,0xd33a2c,0,3.3,-.14),wdG(new THREE.TorusGeometry(.23,.03,5,12),0xff6a00,0,3.05,-.42,Math.PI/2),wdCyl(.23,.14,.42,8,0xffffff,0,2.82,-.42)],wdA.hoop,{shadow:1});
{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(wdDec.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(wdDec.c,3));const nn=new Float32Array(wdDec.p.length);for(let i=1;i<nn.length;i+=3)nn[i]=1;g.setAttribute('normal',new THREE.BufferAttribute(nn,3));
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));m.receiveShadow=true;m.frustumCulled=false;scene.add(m);wdDraws++}
// ---- beach: palms, umbrellas, lifeguard towers, pier, animated water ----
const wdPZ=roadCenter(5),wdPX0=HALF+24,wdPX1=HALF+34,wdPX2=HALF+100,wdDY=1.7;
function wdPierH(x,z){if(x<wdPX0||x>wdPX2||Math.abs(z-wdPZ)>(x>wdPX2-14?8:4.5))return -1;return x<wdPX1?wdDY*(x-wdPX0)/(wdPX1-wdPX0):wdDY}
{const pp=[];let px=0,py=0;for(let k=0;k<6;k++){const t=.04+k*.05;pp.push(wdCyl(.15-.012*k,.18-.012*k,1.4,6,k%2?0x8a6b45:0x7a5c3a,px+Math.sin(t)*.62,py+.62,0,0,0,-t));px+=Math.sin(t)*1.25;py+=Math.cos(t)*1.25}
 for(let k=0;k<8;k++){const a=k*Math.PI/4+.2,g1=new THREE.BoxGeometry(.6,.05,1.8).toNonIndexed(),g2=new THREE.BoxGeometry(.4,.05,1.8).toNonIndexed();g1.translate(0,0,.9);g1.rotateX(.1+(k%2)*.18);g2.translate(0,0,.9);g2.rotateX(.85);g2.translate(0,-.2-(k%2)*.3,1.72);g1.rotateY(a);g2.rotateY(a);pp.push(wdG(g1,0x1f6a2a,px,py,0),wdG(g2,0x2b8038,px,py,0))}
 pp.push(wdSph(.17,0x4a3520,px+.18,py-.18,.1),wdSph(.17,0x4a3520,px-.12,py-.2,-.15),wdSph(.17,0x4a3520,px,py-.2,.2));
 const arr=[],roadZ=z=>{for(let j=0;j<=N;j++)if(Math.abs(z-roadCenter(j))<10)return true;return false};
 for(let z=-HALF+6;z<HALF-4;z+=7+wdR()*5){const back=wdR()<.55,x=back?HALF+3+wdR()*3.5:HALF+25+wdR()*5;if((back&&roadZ(z))||Math.abs(z-wdPZ)<8)continue;arr.push([x,.02,z,wdR()*6.28,.9+wdR()*.45]);solids.push({minX:x-.3,maxX:x+.3,minZ:z-.3,maxZ:z+.3,h:3})}
 wdInst(pp,arr,{shadow:1})}
const wdTowers=[wdPZ-82,wdPZ+72,wdPZ+190];
{const cols=[0xff4d4d,0xffd23f,0x35b0ff,0xff8a2a,0x3ddc84,0xff6fb5,0xffffff],arr=[];
 for(let z=-HALF+8;z<HALF-6;z+=6+wdR()*6){const x=HALF+30.5+wdR()*8.5;if(Math.abs(z-wdPZ)<7.5||wdTowers.some(t=>Math.abs(z-t)<6&&x<HALF+36))continue;arr.push([x,.02,z,wdR()*6.28,.9+wdR()*.3,0,cols[Math.floor(wdR()*cols.length)]])}
 arr.forEach(a=>a[5]=a[4]);
 wdInst([wdCyl(.04,.04,2.3,5,0xf2f2f2,0,1.15,0),wdG(new THREE.ConeGeometry(1.55,.55,8),0xffffff,0,2.45,0),wdBox(.85,.04,1.8,0xffffff,-.95,.03,.5),wdBox(.85,.04,1.8,0xe8e8e8,.95,.03,.3)],arr,{shadow:1});
 const tw=wdTowers.map(z=>{solids.push({minX:HALF+29.4,maxX:HALF+32.6,minZ:z-1.6,maxZ:z+1.6,h:4});return [HALF+31,.02,z,wdFace(1,0)]});
 wdInst([wdBox(.15,2.2,.15,0xe8e8e8,-1.2,1.1,-1.2),wdBox(.15,2.2,.15,0xe8e8e8,1.2,1.1,-1.2),wdBox(.15,2.2,.15,0xe8e8e8,-1.2,1.1,1.2),wdBox(.15,2.2,.15,0xe8e8e8,1.2,1.1,1.2),wdBox(3,.12,3,0xd8d0c0,0,2.2,0),wdBox(2.2,1.6,1.8,0xf4f4f4,0,3.06,.45),wdBox(2.24,.32,1.84,0xd62828,0,2.48,.45),wdBox(1.5,.6,.06,0x6fa3c7,0,3.3,-.46),
  wdBox(2.9,.12,2.7,0xd62828,0,3.98,.3,-.1),wdBox(1,.08,3.5,0xcfc6b4,0,1.1,-2.85,-.684),wdBox(.06,.8,.06,0xe8e8e8,-1.4,2.65,-1.4),wdBox(.06,.8,.06,0xe8e8e8,1.4,2.65,-1.4),wdBox(2.86,.06,.06,0xe8e8e8,0,3.05,-1.4),wdCyl(.03,.03,1.8,5,0x888888,1.25,4.9,1.3),wdBox(.55,.32,.03,0xffd23f,1.55,5.6,1.3)],tw,{shadow:1})}
{const W=0x8b6b47,Dk=0x6a5036,L=wdPX2-wdPX1,mx=(wdPX1+wdPX2)/2,rl=Math.hypot(wdPX1-wdPX0,wdDY),ra=Math.atan2(wdDY,wdPX1-wdPX0),p=[wdBox(L,.2,9,W,mx,wdDY-.1,wdPZ),wdBox(rl+.3,.2,9,W,(wdPX0+wdPX1)/2,wdDY/2-.1,wdPZ,0,0,ra),wdBox(14,.2,16,W,wdPX2-7,wdDY-.11,wdPZ)];
 for(let x=wdPX1+1;x<wdPX2;x+=2)p.push(wdBox(.07,.02,x>wdPX2-14?16:9,Dk,x,wdDY+.006,wdPZ));
 for(const s of [-1,1]){p.push(wdBox(L-14,.09,.12,Dk,mx-7,wdDY+1.05,wdPZ+s*4.4),wdBox(L-14,.06,.08,Dk,mx-7,wdDY+.55,wdPZ+s*4.4),wdBox(rl,.09,.12,Dk,(wdPX0+wdPX1)/2,wdDY/2+1.05,wdPZ+s*4.4,0,0,ra),wdBox(14,.09,.12,Dk,wdPX2-7,wdDY+1.05,wdPZ+s*7.9),wdBox(.12,.09,3.5,Dk,wdPX2-14,wdDY+1.05,wdPZ+s*6.15));
  for(let x=wdPX1;x<=wdPX2-14;x+=3)p.push(wdBox(.12,1.1,.12,Dk,x,wdDY+.55,wdPZ+s*4.4));for(let x=wdPX2-14;x<=wdPX2;x+=3.5)p.push(wdBox(.12,1.1,.12,Dk,x,wdDY+.55,wdPZ+s*7.9));
  for(let x=wdPX1+2;x<=wdPX2;x+=6)p.push(wdCyl(.24,.24,wdDY+1.2,6,0x4f3d2a,x,(wdDY-1.4)/2,wdPZ+s*(x>wdPX2-14?7.3:3.9)));
  for(const z of [-3.2,3.2])p.push(wdBox(.2,3,.2,0xf0f0f0,wdPX2-7+s*3.2,wdDY+1.5,wdPZ+z))}
 for(let z=-7.9;z<=7.9;z+=3.95)p.push(wdBox(.12,1.1,.12,Dk,wdPX2,wdDY+.55,wdPZ+z));p.push(wdBox(.12,.09,16,Dk,wdPX2,wdDY+1.05,wdPZ),wdG(new THREE.ConeGeometry(5.4,1.9,4),0xc0392b,wdPX2-7,wdDY+3.95,wdPZ,0,Math.PI/4),wdBox(2.4,.1,.6,W,wdPX2-7,wdDY+.5,wdPZ),wdBox(.1,.5,.5,Dk,wdPX2-8,wdDY+.25,wdPZ),wdBox(.1,.5,.5,Dk,wdPX2-6,wdDY+.25,wdPZ));
 const lamps=[];for(let x=wdPX1+5,k=0;x<wdPX2-15;x+=11,k++){const z=wdPZ+(k%2?4.3:-4.3);p.push(wdBox(.14,3.3,.14,0x24272b,x,wdDY+1.65,z));lamps.push([x,wdDY+3.35,z])}
 lamps.push([wdPX2-7,wdDY+2.95,wdPZ]);
 const m=new THREE.Mesh(U.mergeBufferGeometries(p),wdMat);m.castShadow=true;m.receiveShadow=true;scene.add(m);wdDraws++;wdInst(new THREE.BoxGeometry(.55,.3,.55),lamps,{mat:lampMat,noRecv:1})}
const wdCollide0=collide;
collide=function(p,r,maxH){const ox=p.x,res=wdCollide0(p,r,maxH);if(ox>HALF+46&&ox<wdPX2+3&&wdPierH(Math.min(ox,wdPX2),p.z)>=0){const hw=(ox>wdPX2-13.5?8:4.5)-.6;p.x=Math.min(ox,wdPX2-.6);p.z=Math.max(wdPZ-hw,Math.min(wdPZ+hw,p.z))}return res};
const wdOldSea=scene.children.find(o=>o.isMesh&&o.geometry&&o.geometry.parameters&&o.geometry.parameters.width===700);if(wdOldSea)wdOldSea.visible=false;
const wdWaterN=canvasTex(128,128,g=>{const im=g.createImageData(128,128),H=(x,y)=>{const a=x/128*6.2832,b=y/128*6.2832;return Math.sin(a*2+b)*.5+Math.sin(b*3-a)*.35+Math.sin(a*5+b*2)*.2+Math.sin(a*3-b*4)*.15+Math.sin(a*7+b*6)*.08};
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){const dx=(H(x+1,y)-H(x-1,y))*2.2,dy=(H(x,y+1)-H(x,y-1))*2.2,l=Math.hypot(dx,dy,1),i=(y*128+x)*4;im.data[i]=(-dx/l*.5+.5)*255;im.data[i+1]=(-dy/l*.5+.5)*255;im.data[i+2]=(1/l*.5+.5)*255;im.data[i+3]=255}g.putImageData(im,0,0)},[38,82]);wdWaterN.encoding=THREE.LinearEncoding;
const wdWater=new THREE.Mesh(new THREE.PlaneGeometry(700,SIZE+900),new THREE.MeshStandardMaterial({color:new THREE.Color(0x1f7fc4).convertSRGBToLinear(),metalness:.6,roughness:.16,normalMap:wdWaterN,normalScale:new THREE.Vector2(.4,.4)}));wdWater.rotation.x=-Math.PI/2;wdWater.position.set(HALF+390,.06,0);wdWater.receiveShadow=true;scene.add(wdWater);wdDraws++;
const wdFoam=new THREE.Mesh(new THREE.PlaneGeometry(5,SIZE+400),new THREE.MeshBasicMaterial({map:canvasTex(32,256,g=>{g.clearRect(0,0,32,256);for(let y=0;y<256;y++){const e=10+Math.sin(y/256*6.2832*3)*5+Math.sin(y/256*6.2832*11)*3;for(let x=0;x<32;x++){const a=x<e?Math.min(1,x/4)*(.55+.45*Math.random()):Math.max(0,1-(x-e)/9)*.6*Math.random();g.fillStyle='rgba(255,255,255,'+a.toFixed(3)+')';g.fillRect(x,y,1,1)}}},[1,26]),transparent:true,depthWrite:false,opacity:.7}));
wdFoam.rotation.x=-Math.PI/2;wdFoam.position.set(HALF+41.5,.09,0);scene.add(wdFoam);wdDraws++;
// ---- sky: sun, moon, clouds, birds ----
const wdSun=new THREE.Mesh(new THREE.CircleGeometry(7,24),new THREE.MeshBasicMaterial({toneMapped:false,fog:false,depthWrite:false}));scene.add(wdSun);wdDraws++;
const wdMoon=new THREE.Mesh(new THREE.CircleGeometry(6,24),new THREE.MeshBasicMaterial({toneMapped:false,fog:false,depthWrite:false,map:canvasTex(128,128,g=>{g.fillStyle='#e9edf2';g.fillRect(0,0,128,128);for(const c of [[40,44,13],[82,34,8],[70,80,17],[34,88,7],[98,70,6],[56,22,5],[92,100,9]]){g.fillStyle='rgba(120,130,150,.5)';g.beginPath();g.arc(c[0],c[1],c[2],0,7);g.fill()}})}));scene.add(wdMoon);wdDraws++;
const wdSunDir=new THREE.Vector3(),wdCN=30,wdCW=500,wdCl=[];
const wdCloudGeo=U.mergeBufferGeometries([[0,0,0,1,.5,.8],[.9,.1,.2,.75,.42,.6],[-1,.05,-.1,.8,.4,.65],[.3,.15,-.5,.6,.38,.5],[-.4,.12,.5,.65,.4,.55],[1.6,-.02,-.1,.5,.3,.45]].map(a=>{const g=new THREE.IcosahedronGeometry(1,1);g.scale(a[3],a[4],a[5]);g.translate(a[0],a[1],a[2]);return g}));
{const ps=wdCloudGeo.attributes.position,c=new Float32Array(ps.count*3);for(let i=0;i<ps.count;i++){const v=.74+.26*Math.max(0,Math.min(1,(ps.getY(i)+.3)/.7));c[i*3]=c[i*3+1]=c[i*3+2]=v}wdCloudGeo.setAttribute('color',new THREE.BufferAttribute(c,3))}
const wdCloudMat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.92,fog:false,depthWrite:false,toneMapped:false}),wdClouds=new THREE.InstancedMesh(wdCloudGeo,wdCloudMat,wdCN);wdClouds.frustumCulled=false;scene.add(wdClouds);wdDraws++;
for(let i=0;i<wdCN;i++)wdCl.push({x:wdR()*wdCW,z:wdR()*wdCW,y:72+wdR()*34,s:20+wdR()*18,r:wdR()*6.28});
const wdBN=24,wdBirdGeo=new THREE.BufferGeometry();wdBirdGeo.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.25,0,0,.25,-.85,.3,.08,0,0,-.25,.85,.3,.08,0,0,.25],3));
const wdBirds=new THREE.InstancedMesh(wdBirdGeo,new THREE.MeshBasicMaterial({color:0x14161a,side:THREE.DoubleSide}),wdBN),wdBd=[];wdBirds.frustumCulled=false;scene.add(wdBirds);wdDraws++;
for(let i=0;i<wdBN;i++){const p=wdParkList[i%6];wdBd.push({cx:wdC0+p[0]*CELL,cz:wdC0+p[1]*CELL,r:7+wdR()*9,y:13+wdR()*10,a:wdR()*6.28,w:(.5+wdR()*.4)*(wdR()<.5?1:-1),ph:wdR()*6})}
function wdTick(dt){wdT+=dt;const sunA=dayT*Math.PI*2,sunH=Math.sin(sunA),day=Math.max(0,Math.min(1,sunH*3+.5)),night=1-day,wet=typeof rain==='number'?rain:0,cp=cam.position;
 const ph=Math.floor((wdT%16)/2);if(ph!==wdPh){wdPh=ph;wdSetTL(wdTLA,ph<3?2:ph===3?1:0);wdSetTL(wdTLB,ph<4?0:ph<7?2:1)}
 wdSignMat.color.setScalar(.8+night*1.5);wdBillMat.color.setScalar(.85+night*.7);const bl=.3+night*(Math.sin(wdT*3.5)>0?5:.15);wdBlinkMat.color.setRGB(bl,bl*.04,bl*.04);
 wdWaterN.offset.x+=dt*.018;wdWaterN.offset.y+=dt*.011;wdFoam.position.x=HALF+41.5+Math.sin(wdT*.7)*1.3;wdFoam.material.opacity=(.45+.3*Math.sin(wdT*.7+1.2))*(.35+.65*day);
 wdSunDir.set(Math.cos(sunA)*80,sunH*120,40).normalize();wdSun.visible=wdSunDir.y>-.05;
 if(wdSun.visible){wdSun.position.copy(cp).addScaledVector(wdSunDir,236);wdSun.lookAt(cp);const k=Math.max(0,Math.min(1,sunH*2.2)),f=1-wet*.93;wdSun.material.color.setRGB(9*f,(3.2+4.6*k)*f,(1+4.2*k)*f)}
 wdSunDir.set(-Math.cos(sunA)*80,-sunH*45,-90).normalize();wdMoon.visible=wdSunDir.y>-.03&&night>.05;
 if(wdMoon.visible){wdMoon.position.copy(cp).addScaledVector(wdSunDir,236);wdMoon.lookAt(cp);wdMoon.material.color.setScalar((.4+night*1.3)*(1-wet*.9))}
 const warm=4*day*(1-day),cb=.09+.91*day,g=1-wet*.5;wdCloudMat.color.setRGB(cb*g,(cb+.02*night)*(1-.22*warm)*g,(cb+.07*night)*(1-.42*warm)*g);wdCloudMat.opacity=.88+wet*.1;
 for(let i=0;i<wdCN;i++){const c=wdCl[i],rx=((c.x+wdT*2.2-cp.x)%wdCW+wdCW)%wdCW-wdCW/2,rz=((c.z+wdT*.7-cp.z)%wdCW+wdCW)%wdCW-wdCW/2,dy=c.y-cp.y,d=Math.sqrt(rx*rx+rz*rz+dy*dy),f=Math.max(0,Math.min(1,(246-d)/28)),s=c.s*f*(1+wet*.5);
  wdDum.position.set(cp.x+rx,c.y,cp.z+rz);wdDum.rotation.set(0,c.r,0);wdDum.scale.set(s,s*.8,s);wdDum.updateMatrix();wdClouds.setMatrixAt(i,wdDum.matrix)}wdClouds.instanceMatrix.needsUpdate=true;
 const bs=day>.3&&wet<.4?1:0;for(let i=0;i<wdBN;i++){const b=wdBd[i];b.a+=b.w*dt;const vx=-Math.sin(b.a)*b.w,vz=Math.cos(b.a)*b.w;wdDum.position.set(b.cx+Math.cos(b.a)*b.r,b.y+Math.sin(wdT*.6+b.ph)*1.5,b.cz+Math.sin(b.a)*b.r);wdDum.rotation.set(0,Math.atan2(-vx,-vz),0);wdDum.scale.set(bs,bs*Math.sin(wdT*9+b.ph)*1.3,bs);wdDum.updateMatrix();wdBirds.setMatrixAt(i,wdDum.matrix)}wdBirds.instanceMatrix.needsUpdate=true;
 // pier: lift player, cars and shooters onto the deck
 if(!driving){const h=wdPierH(pos.x,pos.z);if(h>=0){const ty=Math.max(.3,h);if(vel.y<=30*dt+.001&&pos.y<=ty+.08){pos.y=ty;vel.y=state==='play'?30*dt:0;onGround=true}}}
 for(const c of cars){const h=wdPierH(c.m.position.x,c.m.position.z);if(h>=0){c.m.position.y=h;c.m.userData.wdUp=1}else if(c.m.userData.wdUp){c.m.position.y=0;c.m.userData.wdUp=0}}
 for(const pc of police){const h=wdPierH(pc.m.position.x,pc.m.position.z);if(h>=0){pc.m.position.y=h;pc.m.userData.wdUp=1}else if(pc.m.userData.wdUp){pc.m.position.y=0;pc.m.userData.wdUp=0}}
 for(const s of shooters)if(!s.dead){const h=wdPierH(s.g.position.x,s.g.position.z);s.g.position.y=h>=0?Math.max(.3,h):.3}}
MODS.push(wdTick);

// ---------- airport + flyable planes (module: airport, prefix ap) ----------
let apInvert=false; // false = GTA style: pull the stick DOWN to climb, push UP to dive. Set true to flip.
const apAX=-HALF,apRX=apAX-190,apTX=apAX-140,apPlanes=[];
function apRGB(g,r,gg,b){const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=r;a[i*3+1]=gg;a[i*3+2]=b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
function apCol(g,hex){const c=new THREE.Color(hex);return apRGB(g,c.r,c.g,c.b)}
const apB=(w,h,d,x,y,z,c)=>apCol(bxg(w,h,d,x,y,z),c);
const apCyl=(rt,rb,h,n,x,y,z,c,rx,ry,rz)=>apCol(gT(new THREE.CylinderGeometry(rt,rb,h,n),x,y,z,rx,ry,rz),c);
const apBodyMat=new THREE.MeshStandardMaterial({vertexColors:true,metalness:.35,roughness:.36,side:THREE.DoubleSide});
const apNavMat=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}),apStrobeMat=new THREE.MeshBasicMaterial({color:new THREE.Color(4,4,4),toneMapped:false}),apStrobeGeo=new THREE.BoxGeometry(.3,.2,.3);
const apLightMat=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}),apGlassMat=new THREE.MeshStandardMaterial({color:0x2c5374,metalness:.9,roughness:.08,emissive:0xffd9a0,emissiveIntensity:0});
// ----- static airport -----
// Everything static is merged into a few meshes by material: pavement A, paint M, structures/vehicles S, glass G, lights L, fence mesh F, signs SG.
const apMatS=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7,metalness:.1});
const apCells={};let apSock=[],apRadar=null;const apTrain=[];
// one canvas atlas for every airport sign (one draw call for all of them)
const apAtlas=(()=>{const cv=document.createElement('canvas');cv.width=1024;cv.height=512;const g=cv.getContext('2d');
 const cell=(k,x,y,w,h,bg,fg,txt)=>{apCells[k]=[x,y,w,h];g.fillStyle=bg;g.fillRect(x,y,w,h);g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';let s=Math.floor(h*.64);g.font='bold '+s+'px sans-serif';while(g.measureText(txt).width>w*.9&&s>8){s--;g.font='bold '+s+'px sans-serif'}g.fillText(txt,x+w/2,y+h/2+2)};
 cell('main',0,0,1024,80,'#10202e','#bfe6ff','BLOCK CITY INTL');cell('mon',0,80,1024,80,'#0f2a44','#ffffff','BLOCK CITY INTERNATIONAL AIRPORT');
 cell('dep',0,160,512,64,'#1d5fae','#ffffff','DEPARTURES');cell('arr',512,160,512,64,'#f2c318','#111111','ARRIVALS');
 cell('auth',0,224,512,64,'#ffffff','#c8102e','AUTHORIZED PERSONNEL ONLY');cell('fire',512,224,512,64,'#c8102e','#ffffff','AIRPORT FIRE RESCUE');
 cell('hold',0,288,192,64,'#c8102e','#ffffff','36-18');for(let i=1;i<=3;i++){cell('tw'+i,96+i*96,288,96,64,'#111111','#f2c318','A'+i);cell('g'+i,384+i*96,288,96,64,'#1b1f26','#f2c318','A'+i);cell('h'+i,(i-1)*256,352,256,64,'#2a2f36','#ffffff','HANGAR '+i)}
 cell('P',768,288,128,128,'#1d5fae','#ffffff','P');cell('park',0,416,512,64,'#1d5fae','#ffffff','PARKING');cell('fuel',512,416,512,64,'#f2c318','#111111','FUEL FARM - NO SMOKING');
 cell('taxi',0,480,512,32,'#f2c318','#111111','TAXI');cell('bag',512,480,512,32,'#2a2f36','#ffffff','BAGGAGE CLAIM');
 const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t})();
let apSignMat=new THREE.MeshStandardMaterial({map:apAtlas,emissive:0xffffff,emissiveMap:apAtlas,emissiveIntensity:.3,roughness:.6});
let apBeacon=null,apCone=null;
{const A=[],M=[],S=[],G=[],L=[],F=[],SG=[],W=0xf2f2f2,Y=0xf2c318,X=apAX,PI=Math.PI,DK=0x2a2d31,CON=0xb9bec4;
 const lt=(x,y,z,r,g,b,s)=>L.push(apRGB(bxg(s||.5,.35,s||.5,x,y,z),r,g,b));
 const el=(x,z,r,g,b)=>{S.push(apB(.12,.3,.12,x,.15,z,DK));L.push(apRGB(bxg(.3,.18,.3,x,.38,z),r,g,b))};
 // parts in a local frame (x right, -z front), turned by ry and moved to (ox,oz). q=[w,h,d,lx,ly,lz,col,rx,rz]
 const LW=(g,ox,oz,ry)=>{if(ry)g.rotateY(ry);g.translate(ox,0,oz);return g};
 const V=(parts,ox,oz,ry,arr)=>{for(const q of parts){const g=new THREE.BoxGeometry(q[0],q[1],q[2]).toNonIndexed();if(q[7])g.rotateX(q[7]);if(q[8])g.rotateZ(q[8]);g.translate(q[3],q[4],q[5]);(arr||S).push(apCol(LW(g,ox,oz,ry),q[6]))}};
 const VC=(rt,rb,h,n,lx,ly,lz,col,rx,rz,ox,oz,ry,arr)=>{const g=gT(new THREE.CylinderGeometry(rt,rb,h,n),0,0,0,rx,0,rz);g.translate(lx,ly,lz);(arr||S).push(apCol(LW(g,ox,oz,ry),col))};
 const wh=(x,z,r,w)=>[w||.28,r*2,r*2,x,r,z,0x151515];
 const SGN=(k,w,h,x,y,z,ry)=>{const c=apCells[k],g=new THREE.PlaneGeometry(w,h),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(c[0]+uv.getX(i)*c[2])/1024,1-(c[1]+(1-uv.getY(i))*c[3])/512);const q=gT(g,0,0,0);if(ry)q.rotateY(ry);q.translate(x,y,z);SG.push(q)};
 const ARCH=(w,rise,len,x,y,z0,col)=>{const s=new THREE.Shape();s.moveTo(-w/2,0);s.quadraticCurveTo(0,rise*2,w/2,0);s.lineTo(-w/2,0);const g=new THREE.ExtrudeGeometry(s,{depth:len,bevelEnabled:false,curveSegments:12});S.push(apCol(gT(g,x,y,z0),col))};
 // vehicle templates (front = -z)
 const TUG=[[1.5,.75,2.3,0,.6,0,Y],[1.3,.06,1.4,0,2.05,.35,Y],[.07,1.1,.07,-.62,1.5,-.3,0x333333],[.07,1.1,.07,.62,1.5,-.3,0x333333],[.07,1.1,.07,-.62,1.5,1,0x333333],[.07,1.1,.07,.62,1.5,1,0x333333],[.7,.45,.5,0,1.15,.55,0x222222],[.3,.25,.5,0,.45,1.35,0x333333],wh(-.75,-.75,.3),wh(.75,-.75,.3),wh(-.75,.8,.3),wh(.75,.8,.3)];
 const CART=c=>[[1.45,.12,2.4,0,.55,0,0x5a6068],[1.4,1.0,2.3,0,1.12,0,c],[1.5,.08,2.4,0,1.66,0,0x3a3f45],[.08,.08,.9,0,.45,-1.6,0x333333],wh(-.7,-.8,.2,.2),wh(.7,-.8,.2,.2),wh(-.7,.8,.2,.2),wh(.7,.8,.2,.2)];
 const BELT=[[1.7,.6,4.6,0,.6,.4,W],[1,.12,6.4,0,2.05,-.6,0x2a2a2a,.42],[.08,.5,6.3,-.55,2.3,-.6,Y,.42],[.08,.5,6.3,.55,2.3,-.6,Y,.42],[1.2,1,1.1,-.25,1.35,1.9,0xdddddd],wh(-.8,-1.3,.33),wh(.8,-1.3,.33),wh(-.8,1.9,.33),wh(.8,1.9,.33)];
 const CAT=[[2.2,.45,6.4,0,.75,0,0x333333],[2.2,1.9,1.8,0,1.6,-2.4,W],[2.1,.7,.08,0,2.0,-3.32,0x1e2a36],[2.3,2.3,4,0,4.2,1,W],[2.32,.45,4.02,0,3.4,1,0xc8102e],[.18,2.6,.18,-.8,2.1,1,0x777777],[.18,2.6,.18,.8,2.1,1,0x777777],[2.4,.12,.9,0,3.0,3.3,0x999999],wh(-1,-2.3,.42,.32),wh(1,-2.3,.42,.32),wh(-1,2.2,.42,.32),wh(1,2.2,.42,.32)];
 const STAIR=[[2,.4,6,0,.6,0,0x333333],[2,1.7,1.7,0,1.5,-2.3,W],[1.5,.18,5.4,0,2.55,1,0xdddddd,-.55],[.06,.9,5.4,-.75,3.1,1,Y,-.55],[.06,.9,5.4,.75,3.1,1,Y,-.55],[1.6,.15,1.4,0,3.95,3.6,0xdddddd],wh(-.95,-2.2,.4),wh(.95,-2.2,.4),wh(-.95,2.2,.4),wh(.95,2.2,.4)];
 const GPU=[[1.2,1,2,0,.8,0,0x2f6db5],[1.25,.1,2.05,0,1.35,0,0x1d4f8c],wh(-.6,-.7,.25,.2),wh(.6,-.7,.25,.2),wh(-.6,.7,.25,.2),wh(.6,.7,.25,.2)];
 const PUSH=[[2.8,1,5.2,0,.75,0,Y],[1.3,.9,1.3,-.6,1.7,1.2,0x1e2a36],[2.9,.12,.4,0,.5,-2.7,0x333333],wh(-1.3,-1.6,.5,.4),wh(1.3,-1.6,.5,.4),wh(-1.3,1.6,.5,.4),wh(1.3,1.6,.5,.4)];
 const CAR=c=>[[1.85,.7,4.3,0,.62,0,c],[1.62,.56,2.2,0,1.24,.25,0x1e2a36],[1.64,.08,2,0,1.55,.25,c],wh(-.85,-1.4,.33,.25),wh(.85,-1.4,.33,.25),wh(-.85,1.4,.33,.25),wh(.85,1.4,.33,.25)];
 const BUS=[[2.5,2.8,11,0,1.85,0,W],[2.52,.9,10.4,0,2.4,0,0x1e2a36],[2.54,.35,11.02,0,1,0,0x1d70b8],wh(-1.2,-3.6,.5,.3),wh(1.2,-3.6,.5,.3),wh(-1.2,3.4,.5,.3),wh(1.2,3.4,.5,.3)];
 const FIRE=[[2.5,2.5,8,0,1.75,0,0xc8102e],[2.4,1,.08,0,2.4,-4.02,0x1e2a36],[2.52,.3,8.02,0,1.3,0,W],[.6,.3,.6,0,3.15,-2.8,0x3a7bd5],[1.8,.3,4.5,0,3.15,1,0x9aa3ac],wh(-1.2,-2.6,.55,.35),wh(1.2,-2.6,.55,.35),wh(-1.2,2.2,.55,.35),wh(1.2,2.2,.55,.35)];
 const FUEL=(x,z,ry)=>{V([[2.3,.3,7.6,0,.55,0,DK],[2.4,2.2,2.2,0,1.5,-3.4,Y],[2.1,.9,.08,0,1.95,-4.52,0x16222e],wh(-1.15,-3.2,.5,.4),wh(1.15,-3.2,.5,.4),wh(-1.15,1.4,.5,.4),wh(1.15,1.4,.5,.4),wh(-1.15,3,.5,.4),wh(1.15,3,.5,.4)],x,z,ry);VC(1.25,1.25,5.2,12,0,1.9,.6,0xe9ecef,PI/2,0,x,z,ry)};
 const cone=(x,z)=>{S.push(apCyl(.04,.24,.7,6,x,.35,z,0xff6a00),apB(.5,.05,.5,x,.03,z,0x222222))};
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(270,1100),grass.material);gr.rotation.x=-Math.PI/2;gr.position.set(-(HALF+335),-0.02,0);gr.receiveShadow=true;scene.add(gr);
 // ===== pavement =====
 A.push(apB(24,.02,300,apRX,.03,0,0x26282c),apB(12,.02,300,apTX,.03,0,0x3a3d42),apB(64,.02,240,X-102,.03,0,0x54585e),apB(84,.02,32,X-96,.03,135,0x54585e),apB(70,.02,14,X-35,.03,81,0x2f3136));
 for(const s of[-1,1])A.push(apB(3,.02,300,apRX+s*13.5,.028,0,0x4a4d52),apB(24,.02,8,apRX,.03,s*154,0x303236));
 for(const z of[-140,0,140])A.push(apB(32,.02,12,apRX+28,.03,z,0x3a3d42));
 A.push(apB(6,.02,240,-371.6,.034,0,0x404349));                                    // airside service road in front of the terminal
 A.push(apB(18,.02,154,-327,.03,-3,0x34363b),apB(8,.06,100,-340,.05,-20,0xb5b8bc)); // landside road + curb
 A.push(apB(44,.02,85,-344,.03,-122.5,0x303236),apB(12,.02,10,-330,.03,-75,0x34363b)); // car park + its entrance
 // ===== paint =====
 for(let z=-120;z<=120;z+=20)M.push(apB(.7,.02,10,apRX,.055,z,W));
 for(const s of[-1,1]){M.push(apB(.5,.02,296,apRX+s*11.2,.055,0,W),apB(3,.02,18,apRX+s*5.5,.055,95,W),apB(3,.02,18,apRX+s*5.5,.055,-95,W));for(let i=0;i<8;i++)M.push(apB(1.7,.02,12,apRX-9.8+i*2.8,.055,s*141,W));
  // touchdown-zone bars
  for(const e of[-1,1])for(const t of[[108,3],[72,2],[58,1]])for(let k=0;k<t[1];k++)M.push(apB(1.1,.02,7,apRX+s*(3.2+k*2),.055,e*t[0],W));
  // blast pads: yellow chevrons
  for(let k=0;k<2;k++)for(const h of[-1,1]){const g=bxg(11.4,.02,.6,0,0,0);g.rotateY(-h*s*.266);g.translate(apRX+h*5.5,.055,s*(151.6+k*3.3)+s*1.5);M.push(apCol(g,Y))}}
 const dig=(ch,cx,cz,dir)=>{const Wd=4,H=9,t=.9,seg={a:[0,H/2,Wd+t,t],d:[0,-H/2,Wd+t,t],g:[0,0,Wd+t,t],f:[-Wd/2,H/4,t,H/2],b:[Wd/2,H/4,t,H/2],e:[-Wd/2,-H/4,t,H/2],c:[Wd/2,-H/4,t,H/2]},mp={'1':'bc','3':'abcdg','6':'acdefg','8':'abcdefg'};for(const k of mp[ch]){const s=seg[k];M.push(apB(s[2],.02,s[3],cx+dir*s[0],.055,cz-dir*s[1],W))}};
 dig('3',apRX-3.6,122,1);dig('6',apRX+3.6,122,1);dig('1',apRX+3.6,-122,-1);dig('8',apRX-3.6,-122,-1);
 M.push(apB(.35,.02,300,apTX,.055,0,Y));for(const z of[-140,0,140]){M.push(apB(32,.02,.35,apRX+28,.055,z,Y));
  // runway holding position: two solid + two dashed yellow lines across the connector
  for(const dx of[0,.6])M.push(apB(.25,.02,12,apRX+16+dx,.056,z,Y));for(const dx of[1.4,2])for(let k=-5;k<=5;k+=2)M.push(apB(.25,.02,1.2,apRX+16+dx,.056,z+k,Y))}
 for(const z of[-100,-38,30,62,95])M.push(apB(30,.02,.35,X-119,.055,z,Y),apB(.35,.02,6,X-104,.055,z,Y));
 for(const hx of[-124,-96,-68])M.push(apB(.35,.02,30,X+hx,.055,105,Y));
 for(let x=-66;x<-2;x+=8)M.push(apB(4,.02,.3,X+x,.055,81,Y));
 // gate lead-in lines, stop bars and the red equipment line along the terminal
 for(const gz of[-55,-20,15])M.push(apB(36,.02,.35,-392,.056,gz,Y),apB(.4,.02,3.2,-373.9,.056,gz,Y),apB(.4,.02,3.2,-376.5,.056,gz+3.5,0xd62828));
 M.push(apB(.25,.02,240,-368.9,.056,0,W),apB(.25,.02,240,-374.4,.056,0,W));for(let z=-118;z<120;z+=6)M.push(apB(.2,.02,3,-371.9,.057,z,W));
 // landside lanes and a zebra crossing
 for(let z=-76;z<72;z+=8)M.push(apB(.25,.02,4,-327,.055,z,W));for(let k=0;k<9;k++)M.push(apB(1,.02,4,-334.5+k*2,.055,-20,W));
 // car park stalls
 const rows=[[-363.5,1],[-351.5,-1],[-346.5,1],[-334.5,-1],[-329.5,1]];for(const r of rows)for(let k=0;k<=29;k++)M.push(apB(5,.02,.15,r[0],.055,-163.2+k*2.7,W));
 // ===== runway, taxi, approach lights + PAPI =====
 for(let z=-150;z<=150;z+=15){el(apRX-12.6,z,3,2.9,2.5);el(apRX+12.6,z,3,2.9,2.5);el(apTX-6.6,z,.25,.5,3);el(apTX+6.6,z,.25,.5,3)}
 for(let i=0;i<9;i++){lt(apRX-10+i*2.5,.2,151.5,.2,3,.5,.4);lt(apRX-10+i*2.5,.2,-151.5,3,.15,.1,.4)}
 for(const s of[-1,1])for(let k=0;k<4;k++){for(const dx of[-3,0,3])lt(apRX+dx,.9,s*(160+k*6),3,2.8,2.2,.5);S.push(apB(7,.12,.12,apRX,.75,s*(160+k*6),0x555b63));for(const dx of[-3,0,3])S.push(apB(.1,.75,.1,apRX+dx,.37,s*(160+k*6),0x555b63))}
 for(const e of[-1,1])for(let k=0;k<4;k++){const x=apRX-e*(17+k*2.4),z=e*100;S.push(apB(1.3,.7,.9,x,.45,z,0x3a3d42));L.push(apRGB(bxg(.9,.3,.12,x,.55,z+e*.46),3,k<2?2.9:.12,k<2?2.6:.1))}
 // ===== terminal: two levels, glass curtain walls, arched roof, jet bridges =====
 {const x0=-368,x1=-344,zc=-20,len=100;
  S.push(apB(23.4,4.2,99.4,-356,2.1,zc,CON),apB(23,7.4,99,-356,7.9,zc,0x7e8791),apB(24.8,.5,100.8,-356,4.25,zc,0xd5d9de),apB(25,.6,101,-356,11.8,zc,0x676c73));
  ARCH(30,3.4,106,-356,12.05,-73,0xe3e6ea);S.push(apB(30.3,.45,106.2,-356,12.1,zc,0x9aa3ac));
  for(const x of[x0-.1,x1+.1])G.push(bxg(.2,7,98,x,7.9,zc));
  for(let z=zc-48;z<=zc+48.1;z+=4)for(const x of[x0-.3,x1+.3])S.push(apB(.22,7.1,.22,x,7.9,z,0x3d434a));
  for(const y of[7.9,11.35])for(const x of[x0-.3,x1+.3])S.push(apB(.22,.22,98,x,y,zc,0x3d434a));
  for(const z of[-70.1,30.1]){S.push(apB(24.2,11.6,.4,-356,5.8,z,0xa6adb5));G.push(bxg(6,6.4,.5,-356,7.6,z))}
  for(const z of[-62,-38,-2,22]){S.push(apB(.2,3.1,3.6,x0-.12,1.55,z,0x3d434a));S.push(apB(.24,.35,3.9,x0-.14,3.2,z,Y))}       // baggage hall doors
  for(const z of[-50,-35,-5,10]){G.push(bxg(.25,3,4,x1+.1,1.5,z));S.push(apB(.3,.3,4.4,x1+.15,3.1,z,0x3d434a))}               // entrance doors
  // landside canopy over the curb with DEPARTURES / ARRIVALS boards
  S.push(apB(7.2,.35,78,-339.6,5.3,zc,0xe3e6ea),apB(.5,.9,78,-336.1,5.1,zc,0x9aa3ac));for(let z=-58;z<=19;z+=9.5)S.push(apCyl(.2,.2,5,8,-336.8,2.6,z,0x9aa3ac));
  SGN('dep',8,1,-335.8,5.1,-35,PI/2);SGN('arr',8,1,-335.8,5.1,-2,PI/2);SGN('bag',5,.5,-343.7,3.8,10,PI/2);
  SGN('main',30,2.4,-343.55,9.8,zc,PI/2);SGN('main',18,1.4,-368.45,10.1,zc+.5,-PI/2);
  // kerbside traffic: taxis and a shuttle bus
  V(CAR(0xf2c318),-333.5,-46,0);V(CAR(0xf2c318),-333.5,-40,0);V(CAR(0xf2c318),-333.5,-34,0);V(BUS,-333.6,-2,0);V(CAR(0x2c3e50),-333.5,14,0);
  solids.push({minX:x0,maxX:x1,minZ:-70,maxZ:30,h:15.4});
  // jet bridges: fixed link -> rotunda -> telescopic tunnel -> cab at the airliner's front-left door
  [-55,-20,15].forEach((gz,i)=>{const rx=-372,rz=gz-11,dx=-377.8,dz=gz-3.6,vx=dx-rx,vz=dz-rz,ln=Math.hypot(vx,vz),ry=Math.atan2(vx,vz),mx=(rx+dx)/2,mz=(rz+dz)/2;
   S.push(apB(4.2,3,2.6,-370.1,5.75,rz,0xc9ced4),apCyl(1.9,1.9,3.3,12,rx,5.75,rz,0xb7bec6),apCyl(.45,.45,4.2,8,rx,2.1,rz,0x8a9099));
   V([[2.5,2.7,ln-1.4,0,5.45,0,0xd5d9de],[2.54,.3,ln-1.4,0,4.25,0,DK]],mx,mz,ry);{const gg=new THREE.BoxGeometry(2.56,.55,ln-2.6).toNonIndexed();gg.translate(0,5.9,0);G.push(LW(gg,mx,mz,ry))}
   const px=rx+vx*.78,pz=rz+vz*.78;V([[.3,3.6,.3,-.85,2.1,0,0x6b7178],[.3,3.6,.3,.85,2.1,0,0x6b7178],[2.2,.35,.6,0,.55,0,0x555b63],wh(-.95,0,.35,.3),wh(.95,0,.35,.3)],px,pz,ry);
   V([[3,2.9,2.4,0,5.25,0,0xc9ced4],[2.6,2.5,.9,0,5.0,1.5,DK],[3.1,.3,2.5,0,6.8,0,0x9aa3ac]],dx,dz,0);
   S.push(apB(.15,1.2,2.6,-368.25,9.3,rz,0x1b1f26));SGN('g'+(i+1),2.4,1.6,-368.4,9.3,rz,-PI/2)});
 }
 // ===== ground support equipment around the gates (right side of each airliner, under the wing) =====
 const train=(x,z,ry,n,cols)=>{const c=Math.cos(ry),s=Math.sin(ry);V(TUG,x,z,ry);for(let i=0;i<n;i++){const d=2.75*(i+1);V(CART(cols[i%cols.length]),x+s*d,z+c*d,ry)}};
 [-55,-20,15].forEach((gz,i)=>{V(BELT,-397,gz+5.6,0);if(i===1)V(BELT,-383.5,gz+5.6,0);V(CAT,-401.4,gz+5.8,PI);V(GPU,-377.2,gz+3.6,PI/2);
  train(-381,gz+9.5,-PI/2,3,[0x2a6f97,0x6b7178,0x3f7d4a]);cone(-390,gz+17.7);cone(-390,gz-17.7);cone(-411.5,gz);if(i!==1)FUEL(-392,gz+12.5,-PI/2)});
 V(STAIR,-433.2,-31.4,PI);cone(-417,-20);cone(-417,-56);                                   // remote stand: steps at the stealable airliner
 V(PUSH,-386,108,PI/2);V(PUSH,-418,112,0);train(-370,104,PI,2,[0x2a6f97,0x8a5a2b]);V(GPU,-360,112,0);
 // follow-me car + a fuel truck waiting by the hangars
 V(CAR(0xf2c318),-430,112,PI/2);V([[1.7,.12,.5,0,1.65,0,0x222222]],-430,112,PI/2);FUEL(-362,98,0);solids.push({minX:-363.3,maxX:-360.7,minZ:93.4,maxZ:102.6,h:3});
 // ===== control tower =====
 S.push(apCyl(2.9,3.6,30,8,X-52,15,52,0xc4c9cf),apB(.6,26,1.3,X-49.2,15,52,0x3d434a),apB(15,5,11,X-52,2.5,52,CON),apB(15.6,.4,11.6,X-52,5.2,52,0x676c73));G.push(bxg(15.1,1.4,11.1,X-52,3,52));
 S.push(apCyl(6.6,6.6,.8,8,X-52,35.6,52,0x555b63),apCyl(4.6,3.6,1.2,8,X-52,30.4,52,0x8a9099),apCyl(.12,.12,5,6,X-52,38.5,52,0x444444),apCyl(6.9,6.9,.25,16,X-52,30.9,52,0x555b63),apCol(gT(new THREE.CylinderGeometry(6.9,6.9,1,16,1,true),X-52,31.5,52),0x777e86));
 S.push(apCyl(.06,.06,4,5,X-49.5,38,50.5,0x444444),apCyl(.06,.06,3,5,X-54.5,37.5,53.5,0x444444),apCol(gT(new THREE.SphereGeometry(.9,10,6),X-49.5,36.9,54),0xf2f2f2));
 G.push(gT(new THREE.CylinderGeometry(6.1,4.7,4.4,8),X-52,33.1,52));lt(X-52,41.1,52,3,.15,.1,.5);
 solids.push({minX:X-55.5,maxX:X-48.5,minZ:48.5,maxZ:55.5,h:36},{minX:X-59.5,maxX:X-44.5,minZ:46.5,maxZ:57.5,h:5.4});
 // ===== hangars: barrel roofs, sliding doors, interior lights =====
 [-124,-96,-68].forEach((hx,i)=>{const c=[0xe63946,0x1d70b8,0xf4a261][i],x=X+hx;S.push(apB(26,11,.6,x,5.5,150,0x717d89),apB(.6,11,30,x-13,5.5,135,0x717d89),apB(.6,11,30,x+13,5.5,135,0x717d89),apB(26,2,.7,x,10,120.1,0x7b8692),apB(26,.5,.75,x,9.4,120.1,c));
  ARCH(27.4,4,31.2,x,11,119.4,0x8e979f);for(const s of[-1,1]){S.push(apB(5.5,10,.35,x+s*10.25,5,119.6,0x9aa3ac));for(let y=1.5;y<10;y+=2.2)S.push(apB(5.5,.12,.42,x+s*10.25,y,119.6,0x7b8692));G.push(bxg(.7,1.2,24,x+s*13,8,135));L.push(apRGB(bxg(.35,.12,24,x+s*6,10.8,135),2.6,2.5,2.2))}
  SGN('h'+(i+1),7,1.75,x,12.6,119.3,PI);
  solids.push({minX:x-13,maxX:x+13,minZ:149.6,maxZ:150.4,h:11.6},{minX:x-13.4,maxX:x-12.6,minZ:120,maxZ:150,h:11.6},{minX:x+12.6,maxX:x+13.4,minZ:120,maxZ:150,h:11.6},{minX:x+7.5,maxX:x+13,minZ:119.4,maxZ:119.8,h:10},{minX:x-13,maxX:x-7.5,minZ:119.4,maxZ:119.8,h:10});lt(x,9.6,119.6,3,2.8,2.2,.7)});
 // ===== apron flood masts =====
 for(const z of[-112,-78,40,112]){S.push(apCyl(.18,.28,16,6,X-71,8,z,0x555b63),apB(.6,.5,2.6,X-71.6,16,z,0x333333));lt(X-71.9,15.7,z-.8,3,2.9,2.4,.6);lt(X-71.9,15.7,z+.8,3,2.9,2.4,.6);solids.push({minX:X-71.3,maxX:X-70.7,minZ:z-.3,maxZ:z+.3,h:16})}
 // ===== fire station + fuel farm (south-east corner) =====
 S.push(apB(22,7,14,-341,3.5,103,0xd9d4c8),apB(22.6,.5,14.6,-341,7.2,103,0x8a1c1c));for(const x of[-348,-341,-334]){S.push(apB(5.6,5.2,.2,x,2.6,95.9,0x3d434a));S.push(apB(5.8,.3,.3,x,5.35,95.85,0xc8102e))}
 SGN('fire',12,1.5,-341,6.2,95.75,PI);V(FIRE,-341,96.5,0);solids.push({minX:-352,maxX:-330,minZ:96,maxZ:110,h:7.4});
 for(const t of[[-345,136],[-345,154],[-330,145]]){S.push(apCyl(5.5,5.5,7,16,t[0],3.5,t[1],0xe9ecef),apCyl(5.55,5.55,.6,16,t[0],5.6,t[1],0x2a6f97),apCyl(5.6,5.6,.2,16,t[0],7.05,t[1],0xcfd4da));solids.push({minX:t[0]-4.6,maxX:t[0]+4.6,minZ:t[1]-4.6,maxZ:t[1]+4.6,h:7.2})}
 for(const w of[[30,.9,.5,-338,127],[30,.9,.5,-338,163],[.5,.9,36,-353,145],[.5,.9,36,-323,145]])S.push(apB(w[0],w[1],w[2],w[3],.45,w[4],0x9a9da1));
 S.push(apB(6,1.6,.15,-338,1.5,126.6,0x333333));SGN('fuel',5.8,.72,-338,1.6,126.5,PI);
 // ===== car park: stalls, parked cars, lamps, booth =====
 {let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};const cols=[0xc0392b,0x2c3e50,0xecf0f1,0x7f8c8d,0x2980b9,0x16a085,0xf39c12,0x111111,0x8e44ad,0xbdc3c7,0xd35400,0x27ae60];
  for(const r of rows)for(let k=0;k<29;k++)if(rnd()<.62)V(CAR(cols[Math.floor(rnd()*cols.length)]),r[0]-r[1]*.2,-161.85+k*2.7,r[1]*PI/2+(rnd()-.5)*.06);
  for(const x of[-357.5,-340.5])for(const z of[-150,-122,-94]){S.push(apCyl(.13,.18,9,6,x,4.5,z,0x555b63),apB(2.6,.18,.25,x,9,z,0x555b63));lt(x-1.1,8.85,z,3,2.9,2.5,.5);lt(x+1.1,8.85,z,3,2.9,2.5,.5)}
  S.push(apB(2.2,2.6,2.2,-322.5,1.3,-77,0xd5d9de),apB(2.6,.2,2.6,-322.5,2.7,-77,0x1d5fae));G.push(bxg(2.25,.9,2.25,-322.5,1.9,-77));
  S.push(apB(.3,1,.3,-324,.5,-77,0x333333));for(let k=0;k<6;k++)S.push(apB(.9,.15,.15,-324,1.1+k*.85,-77,k%2?0xd62828:W));
  S.push(apB(.2,4.4,.2,-337,2.2,-74,0x555b63),apB(2.3,2.3,.12,-337,4.6,-74.08,0x1d5fae));SGN('P',2.1,2.1,-337,4.6,-73.98,0);S.push(apB(4.6,.9,.12,-337,3.0,-74.08,0x1d5fae));SGN('park',4.4,.62,-337,3.0,-73.98,0);
  for(let z=-166;z<-80;z+=5)S.push(apCol(gT(new THREE.IcosahedronGeometry(.9,0),-319.5,.7,z+rnd()*2),0x3f7d3a));for(let z=-66;z<74;z+=6)S.push(apCol(gT(new THREE.IcosahedronGeometry(.8,0),-317.2,.6,z),0x4a8a3f))}
 // ===== entrance monument sign and taxiway / holding signs =====
 S.push(apB(1.2,3.4,13,-322.6,1.7,98,0x8a8f96),apB(1.4,.3,13.4,-322.6,3.5,98,0x555b63));SGN('mon',12.4,1,-321.95,2.3,98,PI/2);
 [-140,0,140].forEach((z,i)=>{for(const s of[-1,1]){const zz=z+s*8.2;S.push(apB(.3,1.1,3.3,-478,1,zz,0x111111),apB(.12,.6,.12,-478,.3,zz-1.2,0x555555),apB(.12,.6,.12,-478,.3,zz+1.2,0x555555));SGN('hold',2,.65,-477.83,1.05,zz-.62,PI/2);SGN('tw'+(3-i),1,.65,-477.83,1.05,zz+.95,PI/2)}});
 // ===== perimeter fence with barbed wire and warning signs =====
 const x0=X-245,x1=X-12,z0=-175,z1=175;const run=(ax,a,b,c)=>{const len=b-a,mid=(a+b)/2;if(ax==='x'){S.push(apB(len,.12,.12,mid,2.9,c,0x7d858e));for(const y of[3.25,3.55])S.push(apB(len,.04,.04,mid,y,c,0x9aa1a8));F.push(bxg(len,2.8,.04,mid,1.4,c));for(let v=a;v<=b+.01;v+=8)S.push(apB(.16,3.7,.16,v,1.85,c,0x7d858e));solids.push({minX:a,maxX:b,minZ:c-.3,maxZ:c+.3,h:3})}else{S.push(apB(.12,.12,len,c,2.9,mid,0x7d858e));for(const y of[3.25,3.55])S.push(apB(.04,.04,len,c,y,mid,0x9aa1a8));F.push(bxg(.04,2.8,len,c,1.4,mid));for(let v=a;v<=b+.01;v+=8)S.push(apB(.16,3.7,.16,c,1.85,v,0x7d858e));solids.push({minX:c-.3,maxX:c+.3,minZ:a,maxZ:b,h:3})}};
 run('x',x0,x1,z0);run('x',x0,x1,z1);run('z',z0,z1,x0);run('z',z0,72,x1);run('z',90,z1,x1);
 for(const z of[-140,-40,140])SGN('auth',3.2,.4,x1+.1,1.8,z,PI/2);for(const x of[-520,-430,-340])SGN('auth',3.2,.4,x,1.8,z0-.1,PI),SGN('auth',3.2,.4,x,1.8,z1+.1,0);
 S.push(apB(.7,4,.7,X-12,2,71.5,0x39424c),apB(.7,4,.7,X-12,2,90.5,0x39424c),apB(.3,.3,9,X-12,3.6,76.4,0xe63946),apB(3,2.6,3,X-9,1.3,68.5,0xcfd4da),apB(3.4,.3,3.4,X-9,2.75,68.5,0x555b63));
 // ===== windsock poles and the surveillance radar mast =====
 for(const w of[[apRX+21,105],[apRX-21,-105]]){S.push(apCyl(.08,.12,7,6,w[0],3.5,w[1],0xdddddd),apB(1.6,.12,1.6,w[0],.06,w[1],0x9a9da1));L.push(apRGB(bxg(.25,.25,.25,w[0],7.1,w[1]),3,.2,.1))}
 {const x=-466,z=75;for(const a of[-1.2,1.2])for(const b of[-1.2,1.2])S.push(apB(.22,14,.22,x+a,7,z+b,0xd0d4d8));
  for(let y=2;y<14;y+=3){for(const b of[-1.2,1.2]){S.push(apB(2.6,.12,.12,x,y,z+b,0xd0d4d8),apB(.12,.12,2.6,x+b,y,z,0xd0d4d8));for(const k of[-1,1]){const g=bxg(3.6,.08,.08,0,0,0);g.rotateZ(k*.89);g.translate(x,y+1.5,z+b);S.push(apCol(g,0xd0d4d8));const h=bxg(.08,.08,3.6,0,0,0);h.rotateX(k*.89);h.translate(x+b,y+1.5,z);S.push(apCol(h,0xd0d4d8))}}}
  S.push(apB(3.4,.3,3.4,x,14.1,z,0x8a9099),apCyl(.35,.45,1.2,8,x,14.8,z,0x555b63));solids.push({minX:x-1.4,maxX:x+1.4,minZ:z-1.4,maxZ:z+1.4,h:16});
  const rg=[apCol(gT(new THREE.CylinderGeometry(3.2,3.2,1.5,12,1,true,-.7,1.4),0,0,-3,-.25),0xe9ecef),apB(.15,.15,2.4,0,-.3,-1,0x8a9099),apB(.5,.5,.5,0,-.3,-2.2,0x555b63),apB(.4,.6,.4,0,-.5,0,0x555b63)];
  apRadar=new THREE.Mesh(U.mergeBufferGeometries(rg),apBodyMat);apRadar.position.set(x,16.1,z);apRadar.castShadow=true;scene.add(apRadar)}
 // ===== merge =====
 const mk=(arr,mat,sh)=>{const m=new THREE.Mesh(U.mergeBufferGeometries(arr),mat);m.castShadow=!!sh;m.receiveShadow=true;scene.add(m);return m};
 mk(A,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92}));mk(M,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
 mk(S,apMatS,1);mk(G,apGlassMat);mk(L,apLightMat).receiveShadow=false;mk(SG,apSignMat).receiveShadow=false;
 mk(F,new THREE.MeshBasicMaterial({color:0xaab3bd,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide})).receiveShadow=false;
 // windsocks (orange / white bands), turned by the wind in apTick
 {const a=[];for(let i=0;i<5;i++){const r0=.55-i*.075,r1=.55-(i+1)*.075,g=new THREE.CylinderGeometry(r1,r0,.62,10,1,true);g.rotateZ(-PI/2);g.translate(.31+i*.62,0,0);a.push(apCol(gT(g,0,0,0),i%2?0xf2f2f2:0xff5a00))}const sg=U.mergeBufferGeometries(a);
  for(const w of[[apRX+21,105],[apRX-21,-105]]){const m=new THREE.Mesh(sg,apBodyMat);m.position.set(w[0],6.8,w[1]);m.rotation.order='YZX';scene.add(m);apSock.push(m)}}
 // baggage train that loops along the airside service road
 {const tg=[],cg=[];V(TUG,0,0,0,tg);V(CART(0x2a6f97),0,0,0,cg);const t1=U.mergeBufferGeometries(tg),c1=U.mergeBufferGeometries(cg);for(let i=0;i<4;i++){const m=new THREE.Mesh(i?c1:t1,apMatS);m.castShadow=true;scene.add(m);apTrain.push(m)}}
 // rotating beacon
 apBeacon=new THREE.Group();apBeacon.position.set(X-52,36.6,52);const bb=new THREE.Mesh(new THREE.BoxGeometry(.9,.7,2.2),new THREE.MeshBasicMaterial({color:new THREE.Color(.6,3,1),toneMapped:false}));apBeacon.add(bb);
 const cg=new THREE.ConeGeometry(5,60,10,1,true);cg.translate(0,-30,0);cg.rotateX(-Math.PI/2);apCone=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({color:0xcfffe0,transparent:true,opacity:.07,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));apCone.rotation.x=.06;apBeacon.add(apCone);scene.add(apBeacon)}
// loop path of the baggage train: south along x=-370.3, U-turn, north along x=-373.5 (clear of the rotunda pillars and flood masts)
function apTrainAt(s){const r=1.6,cx=-371.9,Ls=216,Lc=Math.PI*r,Lt=2*Ls+2*Lc;s=((s%Lt)+Lt)%Lt;if(s<Ls)return [-370.3,-108+s];s-=Ls;if(s<Lc){const a=s/r;return [cx+Math.cos(a)*r,108+Math.sin(a)*r]}s-=Lc;if(s<Ls)return [-373.5,108-s];s-=Ls;const a=s/r;return [cx-Math.cos(a)*r,-108-Math.sin(a)*r]}
// ----- aircraft models -----
const apT={prop:{len:8.5,r:.72,cy:1.5,wy:2.4,vs:17,vmax:54,acc:17,pr:.72,maxRoll:.95,turn:1.0,camD:17,camH:2.6,tip:5.5,nose:4,gearUp:0},
 jet:{len:15,r:1,cy:1.9,wy:1.5,vs:26,vmax:90,acc:26,pr:.62,maxRoll:.95,turn:.85,camD:27,camH:3.6,tip:7,nose:7.3,gearUp:1},
 liner:{len:38,r:2,cy:4.2,wy:3.6,vs:30,vmax:78,acc:14,pr:.42,maxRoll:.6,turn:.5,camD:62,camH:9,tip:16.5,nose:18.6,gearUp:1}};
function apFus(len,r,cy,col,prof,p0,pl,f0,f1,k){const pts=[];if(f0===undefined){for(const p of prof)pts.push(new THREE.Vector2(Math.max(.002,p[1]*r),p[0]*len))}
 else for(let i=0;i<=5;i++){const f=f0+(f1-f0)*i/5;let rr=0;for(let j=1;j<prof.length;j++)if(f<=prof[j][0]){const a=prof[j-1],b=prof[j];rr=a[1]+(b[1]-a[1])*(f-a[0])/(b[0]-a[0]);break}pts.push(new THREE.Vector2(rr*r*(k||1.015),f*len))}
 return apCol(gT(p0===undefined?new THREE.LatheGeometry(pts,16):new THREE.LatheGeometry(pts,8,p0,pl),0,cy,0,-Math.PI/2),col)}
function apWing(half,rootC,tipC,sweep,th,y,zLE,col,dih){const o=[];for(const s of[-1,1]){const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(s*half,sweep);sh.lineTo(s*half,sweep+tipC);sh.lineTo(0,rootC);const g=new THREE.ExtrudeGeometry(sh,{depth:th,bevelEnabled:false});g.rotateX(Math.PI/2);if(dih)g.rotateZ(s*dih);g.translate(0,y,zLE);o.push(apCol(g,col))}return o}
function apFin(rootC,tipC,sweep,h,th,y,z0,col){const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(sweep,h);sh.lineTo(sweep+tipC,h);sh.lineTo(rootC,0);const g=new THREE.ExtrudeGeometry(sh,{depth:th,bevelEnabled:false});g.translate(0,0,-th/2);g.rotateY(-Math.PI/2);g.translate(0,y,z0);return apCol(g,col)}
const apPropGeo=(()=>{const a=[];for(let k=0;k<3;k++){const b=new THREE.BoxGeometry(.2,1,.05).toNonIndexed();b.translate(0,.55,0);b.rotateZ(k*Math.PI*2/3);a.push(b)}a.push(gT(new THREE.ConeGeometry(.3,.7,10),0,0,-.2,-Math.PI/2));return U.mergeBufferGeometries(a)})(),apPropMat=new THREE.MeshStandardMaterial({color:0x1c1c1f,roughness:.5,metalness:.4});
const apGeoCache={};
function apGeo(type,acc){const key=type+acc;if(apGeoCache[key])return apGeoCache[key];const B=[],GR=[],N=[],Wh=0xf5f6f7,Dk=0x15202b,Gy=0x8b9198,Tr=0x111111,PI=Math.PI;let props=[];
 const nav=(x,y,z,r,g,b)=>N.push(apRGB(bxg(.28,.2,.28,x,y,z),r,g,b)),wheel=(arr,r,w,x,z)=>arr.push(apCyl(r,r,w,10,x,r,z,Tr,0,0,PI/2));
 if(type==='prop'){const pf=[[-.5,.12],[-.4,.3],[-.2,.62],[0,.95],[.2,1],[.38,.94],[.46,.74],[.5,.5]];
  B.push(apFus(7.6,.72,1.5,Wh,pf),apFus(7.6,.72,1.5,Dk,pf,-1.25,2.5,.08,.33,1.03),apCyl(.36,.36,.1,10,0,1.5,-3.82,Dk,PI/2));
  B.push(...apWing(5.5,1.6,1.25,.12,.15,2.42,-1.55,Wh,.025),apB(.5,.17,1.3,-5.3,2.5,-.8,acc),apB(.5,.17,1.3,5.3,2.5,-.8,acc),...apWing(1.9,.95,.65,.3,.08,1.78,2.75,Wh),apFin(1.35,.6,.95,1.75,.09,1.85,2.3,acc));
  for(const s of[-1,1]){B.push(apCol(gT(new THREE.BoxGeometry(.07,2.25,.14),s*1.62,1.72,-.9,0,0,-s*.98),Gy),apB(.03,.17,3.2,s*.722,1.42,-.9,acc),apCol(gT(new THREE.BoxGeometry(.1,1.15,.3),s*.98,.72,-.25,0,0,s*.75),Wh));wheel(B,.28,.16,s*1.36,-.25)}
  B.push(apB(.08,.85,.08,0,.62,-2.7,Gy));wheel(B,.25,.14,0,-2.7);props=[[0,1.5,-3.95,1]];nav(-5.5,2.5,-.9,3,.1,.1);nav(5.5,2.5,-.9,.1,3,.3);nav(0,2.0,3.75,3,3,3)}
 else if(type==='jet'){const pf=[[-.5,.1],[-.42,.38],[-.3,.75],[-.18,.97],[.2,1],[.33,.9],[.42,.62],[.47,.35],[.5,.03]];
  B.push(apFus(15,1,1.9,Wh,pf),apFus(15,1,1.9,Dk,pf,-1.05,2.1,.355,.425,1.02));
  B.push(...apWing(7,3.2,1.1,3,.2,1.45,-1.7,Wh,.06),apFin(3.3,1.6,2.5,3.1,.16,2.55,3.9,acc),...apWing(2.9,1.5,.8,.9,.1,5.66,6.3,Wh));
  for(const s of[-1,1]){B.push(apB(.09,1,.95,s*6.98,2.35,1.85,acc),apCyl(.42,.54,2.7,12,s*1.6,2.4,3.5,acc,PI/2),apCyl(.44,.44,.06,12,s*1.6,2.4,2.13,Tr,PI/2),apCyl(.34,.34,.06,12,s*1.6,2.4,4.87,Tr,PI/2),apB(.6,.12,1.5,s*1.15,2.35,3.6,Wh),apB(.04,.15,8.6,s*.995,1.75,-.6,acc));
   for(let z=-3.6;z<=1.7;z+=1.05)B.push(apB(.08,.34,.5,s*.965,2.2,z,Dk));GR.push(apB(.12,1,.12,s*1.35,.82,.5,Gy));wheel(GR,.34,.22,s*1.35,.5)}
  GR.push(apB(.1,1.05,.1,0,.8,-5.3,Gy));wheel(GR,.28,.3,0,-5.3);nav(-7,2,1.9,3,.1,.1);nav(7,2,1.9,.1,3,.3);nav(0,2.3,7.4,3,3,3)}
 else{const pf=[[-.5,.06],[-.45,.3],[-.36,.66],[-.27,.92],[-.2,1],[.36,1],[.42,.9],[.46,.68],[.485,.42],[.5,.04]],Wg=0xe6e9ec;
  B.push(apFus(38,2,4.2,Wh,pf),apFus(38,2,4.2,Dk,pf,-.8,1.6,.437,.468,1.02),apFus(38,2,4.2,acc,pf,PI-.7,1.4,-.3,.4,1.006));
  B.push(...apWing(16.5,8.5,2.2,9,.55,3.4,-6.6,Wg,.07),apFin(7,2.6,6,7.6,.4,5.7,10.2,acc),...apWing(6.2,3.6,1.4,3.4,.3,4.9,13,Wg,.05));
  for(const s of[-1,1]){B.push(apB(.14,1.8,1.7,s*16.42,5.35,4.2,acc),apCyl(.85,1.22,4.4,14,s*5.6,2.05,-3.4,Wg,PI/2),apCyl(1.24,1.24,.5,14,s*5.6,2.05,-5.4,acc,PI/2),apCyl(1.02,1.02,.06,14,s*5.6,2.05,-5.68,Tr,PI/2),apCyl(.6,.6,.06,12,s*5.6,2.05,-1.18,Tr,PI/2),apB(.3,.7,2.8,s*5.6,3.1,-2.9,Wg),apB(.05,.3,27,s*1.995,4.05,-1,acc),apB(.07,1.9,1,s*1.95,4.5,-13.2,0xcfd4da),apB(.07,1.9,1,s*1.95,4.5,10.4,0xcfd4da));
   for(let z=-11.8;z<=9.2;z+=1.05)B.push(apB(.08,.42,.36,s*1.95,4.75,z,Dk));
   GR.push(apB(.3,2.3,.3,s*3,1.75,1.2,Gy));for(const dx of[-.36,.36])for(const dz of[-.75,.75])GR.push(apCyl(.62,.62,.4,10,s*3+dx,.62,1.2+dz,Tr,0,0,PI/2));GR.push(apCyl(.55,.55,.3,10,s*.3,.55,-14.5,Tr,0,0,PI/2))}
  GR.push(apB(.25,1.8,.25,0,1.4,-14.5,Gy));nav(-16.5,4.6,3.4,3,.1,.1);nav(16.5,4.6,3.4,.1,3,.3);nav(0,4.5,18.6,3,3,3)}
 const o={body:U.mergeBufferGeometries(B),gear:GR.length?U.mergeBufferGeometries(GR):null,lights:U.mergeBufferGeometries(N),props};apGeoCache[key]=o;return o}
function apPath(zP,T){const v=T.vs*1.5,c=T.vmax*.6,R=apRX,X=apTX,P=HALF+90,a=T.acc*.7;return [[X,0,zP,7,5],[X,0,140,10,5],[R+3,0,140,6,6],[R,0,128,5,6,3],[R,0,-20,v,a],[R,45,-250,c,8],[R+130,80,-P,c,8],[P-160,85,-P,c,8],[P+130,85,-170,c,8],[P+130,80,180,c,8],[P-160,75,P+20,c,8],[R+230,62,P+40,c,8],[R+60,46,P+10,v*1.2,8],[R,32,330,v*1.15,8],[R,15,222,v,8],[R,0,136,v*.9,8],[R,0,-100,16,5],[R,0,-140,7,6],[X,0,-140,7,5],[X,0,zP,9,5],[apAX-108,0,zP,5,5,26]]}
function apMake(type,acc,x,z,yaw,ai,wait){const T=apT[type],g=new THREE.Group(),G=apGeo(type,acc);g.rotation.order='YXZ';
 const b=new THREE.Mesh(G.body,apBodyMat);b.castShadow=true;g.add(b);let gear=null;if(G.gear){gear=new THREE.Mesh(G.gear,apBodyMat);gear.castShadow=true;g.add(gear)}
 g.add(new THREE.Mesh(G.lights,apNavMat));const st=new THREE.Mesh(apStrobeGeo,apStrobeMat);st.position.set(0,T.cy+T.r+.1,0);st.scale.setScalar(T.r+.4);g.add(st);
 const props=[];for(const q of G.props){const m=new THREE.Mesh(apPropGeo,apPropMat);m.position.set(q[0],q[1],q[2]);m.scale.setScalar(q[3]);m.castShadow=true;g.add(m);props.push(m)}
 g.position.set(x,0,z);g.rotation.y=yaw;g.userData.kind='plane';scene.add(g);
 const p={m:g,T,type,speed:0,thr:0,hp:100,steer:0,custom:true,kind:'plane',camD:T.camD,camH:T.camH,dead:false,gear,props,strobe:st,home:[type,acc,x,z,yaw,ai],ai:null,air:false,vy:0,stolen:false};
 if(ai)p.ai={path:apPath(z,T),i:0,wait:wait||8};apPlanes.push(p);return p}
apMake('prop',0xe63946,apAX-124,134,0);apMake('prop',0x1d70b8,apAX-96,134,0);apMake('prop',0xf2a100,apAX-108,95,Math.PI/2);
apMake('jet',0x16324f,apAX-68,133,0);apMake('jet',0x8a1c2b,apAX-108,30,Math.PI/2);apMake('liner',0x0b6e99,apAX-116,-38,Math.PI/2);
apMake('prop',0x2a9d8f,apAX-108,-100,Math.PI/2,true,6);apMake('jet',0x444b55,apAX-108,62,Math.PI/2,true,75);
// ----- airliners parked nose-in at the three gates (scenery: one merged mesh + one lights mesh) -----
{const SL=[],SN=[],cx=-391;for(const q of[[-55,0xc8102e],[-20,0x2a9d8f],[15,0xf2a100]]){const cz=q[0],G0=apGeo('liner',q[1]);for(const g of[G0.body,G0.gear]){const c=g.clone();c.rotateY(-Math.PI/2);c.translate(cx,0,cz);SL.push(c)}const n=G0.lights.clone();n.rotateY(-Math.PI/2);n.translate(cx,0,cz);SN.push(n);
  solids.push({minX:cx-19,maxX:cx+18.6,minZ:cz-2,maxZ:cz+2,h:6.3},{minX:cx+1,maxX:cx+5.8,minZ:cz-6.9,maxZ:cz-4.3,h:3.3},{minX:cx+1,maxX:cx+5.8,minZ:cz+4.3,maxZ:cz+6.9,h:3.3})}
 const b=new THREE.Mesh(U.mergeBufferGeometries(SL),apBodyMat);b.castShadow=true;b.receiveShadow=true;scene.add(b);scene.add(new THREE.Mesh(U.mergeBufferGeometries(SN),apNavMat))}
// ----- flight -----
let apJid=null,apKey=false,apBail=null,apWas=null,apWarn=0,apHudS='';
addEventListener('touchstart',e=>{for(const t of e.changedTouches)if(hit($('jump'),t))apJid=t.identifier},{passive:true});
{const up=e=>{for(const t of e.changedTouches)if(t.identifier===apJid)apJid=null;if(!e.touches||!e.touches.length)apJid=null};addEventListener('touchend',up);addEventListener('touchcancel',up)}
// laptop: the keyboard no longer holds apKey (Space is the brake); apKey stays for the on-screen throttle rocker. Keys come from vhK (vehicles module).
let apKx=0,apKy=0,apKr=0;
const apChute=(()=>{const a=[apCol(gT(new THREE.SphereGeometry(2.4,12,6,0,Math.PI*2,0,Math.PI*.45),0,2.2,0),0xff7a1a)];for(const q of[[-1.9,0],[1.9,0],[0,-1.9],[0,1.9]])a.push(apCol(gT(new THREE.CylinderGeometry(.02,.02,3.9,4),q[0]/2,2.0,q[1]/2,q[1]*.25,0,-q[0]*.25),0xffffff));const m=new THREE.Mesh(U.mergeBufferGeometries(a),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,side:THREE.DoubleSide}));m.visible=false;m.castShadow=true;scene.add(m);return m})();
const apHud=document.createElement('div');apHud.style.cssText='position:fixed;top:calc(env(safe-area-inset-top,0px) + 84px);left:50%;margin-left:-84px;width:168px;display:none;pointer-events:none;color:#fff;font-weight:800;font-size:13px;text-shadow:0 1px 3px #000;align-items:center';
apHud.innerHTML='<div style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid #fffc;position:relative;flex:none;margin-right:9px"><div id="apHz" style="position:absolute;left:-50%;top:-50%;width:200%;height:200%;background:linear-gradient(#3aa0ff 50%,#7a5a2c 50%)"></div><div style="position:absolute;left:9px;right:9px;top:50%;height:2px;margin-top:-1px;background:#ffd23f"></div></div><div id="apTx" style="line-height:1.35;white-space:nowrap"></div>';document.body.appendChild(apHud);
{const m=$('msg'),p=document.createElement('p');p.innerHTML='<b>Airport</b> is west of the city. Steal a plane with CAR, hold JUMP for throttle, pull the stick DOWN to climb, UP to dive, left and right to bank. CAR bails out (parachute opens up high)';m.insertBefore(p,m.lastElementChild)}
function apFwd(m){const r=m.rotation,c=Math.cos(r.x);return new THREE.Vector3(-Math.sin(r.y)*c,Math.sin(r.x),-Math.cos(r.y)*c)}
function apHit(p){const m=p.m,T=p.T,sy=Math.sin(m.rotation.y),cw=Math.cos(m.rotation.y),px=m.position.x,pz=m.position.z,y=m.position.y,R=T.nose+2;
 const pts=[[0,0,T.cy-T.r*.6],[-sy*T.nose,-cw*T.nose,T.cy-T.r*.6],[cw*T.tip,-sy*T.tip,T.wy],[-cw*T.tip,sy*T.tip,T.wy],[cw*T.tip*.5,-sy*T.tip*.5,T.wy],[-cw*T.tip*.5,sy*T.tip*.5,T.wy]];
 for(const s of solids){if(px<s.minX-R||px>s.maxX+R||pz<s.minZ-R||pz>s.maxZ+R)continue;for(const q of pts){if(y+q[2]>s.h)continue;const x=px+q[0],z=pz+q[1];if(x>s.minX&&x<s.maxX&&z>s.minZ&&z<s.maxZ)return s}}return null}
function apCrash(p){if(p.dead)return;const m=p.m,inside=driving===p;p.dead=true;p.speed=0;p.ai=null;const at=m.position.clone();at.y+=1;explode(at);if(p.type==='liner'){explode(at.clone().add(new THREE.Vector3(6,0,4)));explode(at.clone().add(new THREE.Vector3(-6,0,-5)))}
 if(inside){hurt(45);if(driving===p){driving=null;player.visible=true;pos.set(m.position.x,.3,m.position.z);vel.set(0,6,0);onGround=false}}
 char(m);m.position.y=0;m.rotation.x=-.12;m.rotation.z=(Math.random()-.5)*.5;cash+=100;crime(2);
 const h=p.home;setTimeout(()=>{scene.remove(m);const i=apPlanes.indexOf(p);if(i>=0)apPlanes.splice(i,1);apMake(h[0],h[1],h[2],h[3],h[4],h[5],20)},60000)}
// kb (laptop keys) = null for touch, or {rud:-1..1, brk:bool, rev:bool}; with kb the throttle is a lever set in apTick (W/S) instead of hold-to-gas
function apSim(p,dt,jx,jy,held,piloted,kb){const T=p.T,m=p.m,r=m.rotation,air=m.position.y>.02,ox=m.position.x,oz=m.position.z;
 if(!kb)p.thr+=((held?1:0)-p.thr)*Math.min(1,dt*(held?1.3:(air?.16:.6)));
 p.speed+=(p.thr*T.acc-Math.max(0,p.speed)*T.acc/T.vmax)*dt;const pin=(apInvert?-1:1)*jy;let vy=0;
 if(air){const L=Math.min(1,p.speed/T.vs);p.speed-=Math.sin(r.x)*15*dt;if(kb&&kb.brk)p.speed-=7*dt;p.speed=Math.max(0,p.speed);
  r.x+=pin*T.pr*L*dt;if(Math.abs(jy)<.06)r.x+=((m.position.y<12&&p.thr>.5?.1:0)-r.x)*Math.min(1,dt*(kb?.4:.7));if(L<1)r.x+=(-.5-r.x)*(1-L)*dt*1.8;r.x=Math.max(-.85,Math.min(.8,r.x));
  r.z+=(-jx*T.maxRoll-r.z)*Math.min(1,dt*2.6);r.y+=r.z*T.turn*L*dt;if(kb&&kb.rud)r.y-=kb.rud*.32*L*dt;
  const sink=L<1?(1-L)*(1-L)*30+(1-L)*5:0;vy=Math.sin(r.x)*p.speed-sink;p.stall=L<1}
 else{p.stall=false;r.z+=(0-r.z)*Math.min(1,dt*6);const sa=Math.abs(p.speed),st=kb?Math.max(-1,Math.min(1,jx+kb.rud)):jx;
  r.y+=-st*dt*Math.min(1,sa/5)*1.15*(kb?Math.max(.3,1-sa/(T.vs*1.8)):1)*(p.speed<0?-1:1);
  if(kb&&kb.brk){if(p.speed>0)p.speed=Math.max(0,p.speed-20*dt);else p.speed=Math.min(0,p.speed+20*dt)}
  if(p.thr<.08){if(piloted&&(kb?kb.rev:jy>.35)&&p.speed<1)p.speed=Math.max(-5,p.speed-7*dt);else if(p.speed>0)p.speed=Math.max(0,p.speed-10*dt);else p.speed=Math.min(0,p.speed+8*dt)}
  if(p.speed>T.vs){r.x+=pin*T.pr*.8*dt;if(p.speed>T.vs*1.3)r.x=Math.max(r.x,.07)}else r.x+=(0-r.x)*Math.min(1,dt*5);r.x=Math.max(0,Math.min(.4,r.x));vy=p.speed>T.vs?Math.sin(r.x)*p.speed:0}
 const c=Math.cos(r.x);m.position.x+=-Math.sin(r.y)*c*p.speed*dt;m.position.z+=-Math.cos(r.y)*c*p.speed*dt;m.position.y+=vy*dt;
 if(m.position.y<=0){if(air){if(vy<-13||r.x<-.42||Math.abs(r.z)>.75){m.position.y=0;apCrash(p);return}if(piloted)toast(vy<-7?'Rough landing!':'Touchdown');if(vy<-7)shake=.5}m.position.y=0}
 if(m.position.y>180){m.position.y=180;r.x=Math.min(r.x,0)}
 const B=HALF+780;if(Math.abs(m.position.x)>B||Math.abs(m.position.z)>B){const want=Math.atan2(m.position.x,m.position.z);r.y+=(((want-r.y+Math.PI*3)%(Math.PI*2))-Math.PI)*Math.min(1,dt*1.2);}
 if(piloted&&(Math.abs(m.position.x)>B||Math.abs(m.position.z)>B)&&T_now()>apWarn){apWarn=T_now()+5;toast('Turning back to the city')}
 const s=apHit(p);if(s){if(m.position.y>.02||Math.abs(p.speed)>12){apCrash(p);return}m.position.x=ox;m.position.z=oz;p.speed=0}
 p.vy=vy}
function T_now(){return performance.now()/1000}
function apAI(p,dt){const a=p.ai,m=p.m,r=m.rotation,T=p.T;if(a.wait>0){a.wait-=dt;p.speed=0;p.thr=.15;r.x*=.9;r.z*=.9;return}
 const w=a.path[a.i],dx=w[0]-m.position.x,dz=w[2]-m.position.z,d=Math.hypot(dx,dz),air=m.position.y>.05,want=Math.atan2(-dx,-dz),da=((want-r.y+Math.PI*3)%(Math.PI*2))-Math.PI;
 const mr=(air?.5:1.4)*dt,turn=Math.max(-mr,Math.min(mr,da));r.y+=turn;p.speed+=Math.max(-13*dt,Math.min(w[4]*dt,w[3]-p.speed));p.thr=air?.8:Math.min(1,p.speed/20+.2);
 m.position.x+=-Math.sin(r.y)*p.speed*dt;m.position.z+=-Math.cos(r.y)*p.speed*dt;
 let st=0;if(air||p.speed>T.vs){const cl=p.speed*.22*dt;st=Math.max(-cl,Math.min(cl,(w[1]-m.position.y)*Math.min(1,p.speed*dt*1.1/Math.max(d-(w[1]>0?30:0),1))))}m.position.y=Math.max(0,m.position.y+st);
 r.x+=(Math.atan2(st/Math.max(dt,.001),Math.max(p.speed,1))*1.2+(air&&w[1]===0?.06:0)-r.x)*Math.min(1,dt*2);r.z+=((air?turn/Math.max(dt,.001)*1.5:0)-r.z)*Math.min(1,dt*2);
 if(d<(w[1]>0?40:4.5)){if(w[5])a.wait=w[5];a.i=(a.i+1)%a.path.length}}
function apExit(p){const m=p.m,air=m.position.y>1.2||Math.abs(p.speed)>12,ry=m.rotation.y,f=apFwd(m);driving=null;player.visible=true;cam.up.set(0,1,0);
 if(!air){const o=p.T.r+2.2;pos.set(m.position.x-Math.cos(ry)*o,.3,m.position.z+Math.sin(ry)*o);vel.set(0,0,0);p.thr=0;toast('Got out')}
 else{pos.copy(m.position);pos.y+=p.T.cy;vel.set(f.x*p.speed*.45,4,f.z*p.speed*.45);onGround=false;apBail={t:0,chute:false,vy:0,h:pos.y};toast('BAILED OUT!')}}
{const nc=nearestCar;nearestCar=function(peek){let best=null,bd=1e9;
 for(const p of apPlanes){if(p.dead||p===driving||p.m.position.y>1||(p.ai&&p.speed>14))continue;const m=p.m,T=p.T,sy=Math.sin(m.rotation.y),cw=Math.cos(m.rotation.y),dx=pos.x-m.position.x,dz=pos.z-m.position.z;
  const t=Math.max(-T.nose,Math.min(T.nose,-(dx*sy+dz*cw))),d=Math.hypot(dx+sy*t,dz+cw*t);if(d<T.r+3.6&&d<bd){bd=d;best=p}}
 if(best){const c=nc(true);if(c&&Math.hypot(c.m.position.x-pos.x,c.m.position.z-pos.z)<bd)best=null}
 if(!best)return nc(peek);if(peek)return best;
 if(best.ai){best.ai=null;const h=best.home;if(h[5]){h[5]=false;setTimeout(()=>apMake(h[0],h[1],h[2],h[3],h[4],true,10),120000)}}
 if(!best.stolen){best.stolen=true;if(wantedScore<3)crime(3-wantedScore)}camPitch=.24;toast((best.type==='liner'?'STOLE AN AIRLINER!':'STOLE A PLANE!')+(vhKbLast?'':' Hold JUMP for throttle'));beep(500,.1,.12);return best}}
{const dm=drawMap;drawMap=function(){dm();if(pos.x>apAX+130)return;const g=mapC,S=260,sc=S/215;g.save();g.beginPath();g.arc(S/2,S/2,S/2-4,0,7);g.clip();g.translate(S/2,S/2);g.rotate(camYaw);g.translate(-pos.x*sc,-pos.z*sc);
 g.fillStyle='#777b80';g.fillRect((apAX-134)*sc,-120*sc,64*sc,270*sc);g.fillStyle='#3a3d42';g.fillRect((apTX-6)*sc,-150*sc,12*sc,300*sc);for(const z of[-140,0,140])g.fillRect((apRX+12)*sc,(z-6)*sc,32*sc,12*sc);g.fillRect((apAX-70)*sc,74*sc,70*sc,14*sc);
 g.fillStyle='#222428';g.fillRect((apRX-12)*sc,-150*sc,24*sc,300*sc);g.fillStyle='#fff';for(let z=-120;z<=120;z+=40)g.fillRect((apRX-.6)*sc,(z-8)*sc,1.2*sc,16*sc);
 for(const p of apPlanes){if(p.dead)continue;g.save();g.translate(p.m.position.x*sc,p.m.position.z*sc);g.rotate(-p.m.rotation.y);g.fillStyle=p===driving?'#ffd23f':'#e8f4ff';const k=p.type==='liner'?1.9:1;g.fillRect(-1.5*k,-8*k,3*k,16*k);g.fillRect(-9*k,-2*k,18*k,3.5*k);g.fillRect(-4*k,6*k,8*k,2*k);g.restore()}
 g.restore();if(!driving||driving.kind!=='plane'){g.save();g.translate(S/2,S/2);g.rotate(camYaw-facing);g.fillStyle='#fff';g.beginPath();g.moveTo(0,-12);g.lineTo(8,8);g.lineTo(-8,8);g.fill();g.restore()}}}
function apTick(dt){const sunH=Math.sin(dayT*Math.PI*2),night=1-Math.max(0,Math.min(1,sunH*3+.5));
 apLightMat.color.setScalar(.1+night*1.05);apGlassMat.emissiveIntensity=night*.55;apSignMat.emissiveIntensity=.25+night*1.6;apBeacon.rotation.y+=dt*2.2;apCone.visible=night>.35;
 // wind: socks swing around a slowly drifting direction; radar turns; baggage train loops the service road
 {const wd=.9+Math.sin(T*.05)*.5,ws=.55+.35*Math.sin(T*.31)*Math.sin(T*.13);for(const s of apSock){s.rotation.y=wd+Math.sin(T*1.7+s.position.z)*.08;s.rotation.z=-(1-ws)*.9+Math.sin(T*5.3+s.position.z)*.03}}
 apRadar.rotation.y+=dt*1.3;
 {const s0=T*4.2;for(let i=0;i<apTrain.length;i++){const s=s0-(i?.4+i*2.75:0),q=apTrainAt(s),q2=apTrainAt(s+.3),m=apTrain[i];m.position.set(q[0],0,q[1]);m.rotation.y=Math.atan2(-(q2[0]-q[0]),-(q2[1]-q[1]))}}
 let mine=driving&&driving.kind==='plane'&&apPlanes.indexOf(driving)>=0?driving:null;
 if(mine&&carQ&&state==='play'){carQ=false;apExit(mine);mine=null}
 let jx=joy.x,jy=joy.y;const jm=Math.hypot(jx,jy);if(jm<.22){jx=0;jy=0}else{const k=(jm-.22)/.78/jm;jx*=k;jy*=k}
 // laptop keys: A/D bank, Up/Down pitch (Down = nose up), Left/Right rudder, W/S throttle lever, Space brake
 let kb=null;if(mine&&state==='play'&&vhKbFly){const K=vhK,ramp=(v,t,up,dn)=>v+Math.max(-(t?up:dn)*dt,Math.min((t?up:dn)*dt,t-v));
  apKx=ramp(apKx,(K.KeyD?1:0)-(K.KeyA?1:0),3,7);apKy=ramp(apKy,(K.ArrowDown?1:0)-(K.ArrowUp?1:0),2.4,8);apKr=ramp(apKr,(K.ArrowRight?1:0)-(K.ArrowLeft?1:0),3,7);
  jx=apKx;jy=apKy;kb={rud:apKr,brk:!!K.Space,rev:!!K.KeyS&&mine.thr<.02};
  if(K.KeyW||apJid!==null||apKey)mine.thr=Math.min(1,mine.thr+dt*.55);if(K.KeyS)mine.thr=Math.max(0,mine.thr-dt*.7)}else{apKx=apKy=apKr=0}
 const strobe=(T*1.1%1)<.07;
 for(let i=apPlanes.length-1;i>=0;i--){const p=apPlanes[i];if(p.dead)continue;const m=p.m,on=p===mine&&state==='play';
  if(p.ai)apAI(p,dt);else if(p===mine||Math.abs(p.speed)>.05||m.position.y>.01||p.thr>.02)apSim(p,dt,on?jx:0,on?jy:0,on&&(apJid!==null||apKey),on,on?kb:null);
  if(p.dead)continue;p.strobe.visible=strobe&&(p===mine||!!p.ai||m.position.y>.5);if(p.gear&&p.T.gearUp)p.gear.visible=m.position.y<14;
  const sp=(p===mine||p.ai||p.thr>.03)?(14+p.thr*45):0;for(const q of p.props)q.rotation.z+=sp*dt}
 if(mine&&driving===mine){const m=mine.m,r=m.rotation;pos.copy(m.position);facing=r.y;vel.set(0,0,0);jumpQ=false;
  const a=-r.z*.35;cam.up.set(Math.cos(camYaw)*Math.sin(a),Math.cos(a),-Math.sin(camYaw)*Math.sin(a));
  if(apWas!==mine){apWas=mine;apHud.style.display='flex';$('jump').textContent='GAS';vhFlyHint('plane')}
  const gnd=m.position.y<.05,cue=gnd&&mine.speed>=mine.T.vs?'<br><span style="color:#7dff9a">ROTATE '+(vhKbFly?'&darr;':'&#9660;')+'</span>':(gnd&&vhKbFly&&kb&&kb.brk&&Math.abs(mine.speed)>.5?'<br><span style="color:#ffb347">BRAKE</span>':'');
  const s='ALT '+Math.round(m.position.y*3)+' ft<br>SPD '+Math.round(Math.abs(mine.speed)*2)+' kt<br>'+(mine.stall&&m.position.y>2?'<span style="color:#ff4040">STALL</span>':'THR '+Math.round(mine.thr*100)+'%')+cue;
  if(s!==apHudS){apHudS=s;$('apTx').innerHTML=s}$('apHz').style.transform='rotate('+(r.z*57.3).toFixed(1)+'deg) translateY('+(r.x*34).toFixed(1)+'px)'}
 else{if(apWas){apWas=null;apHud.style.display='none';$('jump').textContent='JUMP';cam.up.set(0,1,0)}
  if(!driving&&state==='play')for(const p of apPlanes){const m=p.m,T=p.T;if(m.position.y>1||T.cy-T.r>2.2||pos.y>T.cy+T.r)continue;const sy=Math.sin(m.rotation.y),cw=Math.cos(m.rotation.y),dx=pos.x-m.position.x,dz=pos.z-m.position.z,t=Math.max(-T.nose,Math.min(T.nose,-(dx*sy+dz*cw))),ex=dx+sy*t,ez=dz+cw*t,d=Math.hypot(ex,ez),R=T.r+.5;if(d<R&&d>.001){pos.x+=ex/d*(R-d);pos.z+=ez/d*(R-d)}}}
 if(apBail){const b=apBail;if(state!=='play'||driving){apBail=null;apChute.visible=false}
  else if(onGround&&b.t>.15){if(!b.chute){const d=(-b.vy-22)*4;if(d>0){hurt(d);shake=.6;if(state==='play')toast(d>60?'OUCH!':'Hard landing')}}else toast('Nice landing');apBail=null;apChute.visible=false}
  else{b.t+=dt;b.vy=vel.y;if(!b.chute&&b.t>.7&&b.h>25&&pos.y>12){b.chute=true;toast('Parachute open! Steer with the stick')}if(b.chute){vel.y=Math.max(vel.y,-6.5);apChute.visible=true;apChute.position.set(pos.x,pos.y,pos.z);apChute.rotation.y=facing}}}}
{const ex=explode;explode=function(q){ex(q);for(const p of apPlanes)if(!p.dead&&!p.boom&&p.m.position.distanceTo(q)<p.T.nose*.5+5){p.boom=true;setTimeout(()=>apCrash(p),350)}}}
MODS.push(apTick);
function apWestOK(p){return p.x>-HALF-250}

// ---------- land: army base (north), hills + BLOCK CITY sign (south), Miami x Hollywood dressing ----------
const ldN=[],ldS=[],ldD=[],ldE=[],ldSold=[],ldTanks=[],ldDebris=[],ldBeams=[];
const ldC=new THREE.Color(),ldMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.86,metalness:.04}),ldMat2=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,side:THREE.DoubleSide}),ldEm=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});
let ldAlert=0,ldCan=0,ldLateOn=false,ldRnd=12345;
function ldR(){ldRnd=(ldRnd*1103515245+12345)&0x7fffffff;return ldRnd/0x7fffffff}
function ldPaint(g,col){if(g.index)g=g.toNonIndexed();ldC.set(col);const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=ldC.r;a[i*3+1]=ldC.g;a[i*3+2]=ldC.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
function ldB(L,w,h,d,x,y,z,col,ry,rx,rz){const g=new THREE.BoxGeometry(w,h,d);if(rx)g.rotateX(rx);if(rz)g.rotateZ(rz);if(ry)g.rotateY(ry);g.translate(x,y,z);L.push(ldPaint(g,col))}
function ldCy(L,rt,rb,h,seg,x,y,z,col,rx,rz){const g=new THREE.CylinderGeometry(rt,rb,h,seg);if(rx)g.rotateX(rx);if(rz)g.rotateZ(rz);g.translate(x,y,z);L.push(ldPaint(g,col))}
function ldMesh(L,mat,shadow){const m=new THREE.Mesh(U.mergeBufferGeometries(L),mat);m.castShadow=!!shadow;m.receiveShadow=true;scene.add(m);return m}
function ldSol(x0,x1,z0,z1,h){solids.push({minX:Math.min(x0,x1),maxX:Math.max(x0,x1),minZ:Math.min(z0,z1),maxZ:Math.max(z0,z1),h:h})}
function ldInto(L,geo,x,y,z,ry){const g=geo.clone();if(ry)g.rotateY(ry);g.translate(x,y,z);L.push(g)}
// 5x7 pixel font for signs
const ldF={A:[14,17,17,31,17,17,17],B:[30,17,17,30,17,17,30],C:[15,16,16,16,16,16,15],D:[30,17,17,17,17,17,30],E:[31,16,16,30,16,16,31],F:[31,16,16,30,16,16,16],G:[15,16,16,23,17,17,15],I:[31,4,4,4,4,4,31],K:[17,18,20,24,20,18,17],L:[16,16,16,16,16,16,31],M:[17,27,21,21,17,17,17],N:[17,25,21,19,17,17,17],O:[14,17,17,17,17,17,14],P:[30,17,17,30,16,16,16],R:[30,17,17,30,20,18,17],S:[15,16,16,14,1,1,30],T:[31,4,4,4,4,4,4],U:[17,17,17,17,17,17,14],V:[17,17,17,17,17,10,4],W:[17,17,17,21,21,27,17],H:[17,17,17,31,17,17,17],Y:[17,17,10,4,4,4,4],'-':[0,0,0,31,0,0,0]};
// one glyph; (ox,oy,oz) = top-left as the reader sees it, (rx,rz) = the reader's right on the ground plane
function ldGlyph(L,ch,ox,oy,oz,rx,rz,px,dp,col){const g=ldF[ch];if(!g)return;for(let r=0;r<7;r++){let c=0;while(c<5){if(g[r]>>(4-c)&1){let e=c;while(e<4&&(g[r]>>(3-e)&1))e++;const w=(e-c+1)*px,m=(c+e+1)/2*px;ldB(L,rx?w:dp,px,rx?dp:w,ox+rx*m,oy-(r+.5)*px,oz+rz*m,col);c=e+1}else c++}}}
function ldText(L,s,ox,oy,oz,rx,rz,px,dp,col){for(let i=0;i<s.length;i++)ldGlyph(L,s[i],ox+rx*i*px*6,oy,oz+rz*i*px*6,rx,rz,px,dp,col)}
// ----- vehicle prototypes -----
const ldVG=(()=>{const O=0x4f5d3a,O2=0x44512f,K=0x1f221b,GL=0x1b2733,H=[],Tt=[],J=[],T=[],W=[];
 ldB(H,3.3,.95,6.0,0,1.3,0,O);ldB(H,2.9,.45,4.2,0,2.0,.3,O2);ldB(H,3.3,.8,1.5,0,1.42,-3.2,O,0,-.6);ldB(H,2.6,.5,.5,0,1.5,3.1,O2);
 for(const s of[-1,1]){ldB(H,.85,1.1,6.8,s*1.78,.6,0,K);ldB(H,1.05,.1,7,s*1.78,1.22,0,O2);for(let k=0;k<5;k++)ldCy(H,.45,.45,.18,10,s*2.25,.52,-2.6+k*1.3,0x3d4432,0,Math.PI/2)}
 ldB(Tt,2.3,.85,2.9,0,.43,.25,O);ldB(Tt,1.9,.6,.9,0,.4,1.9,O2);ldB(Tt,1.1,.65,.55,0,.42,-1.4,O2);ldCy(Tt,.15,.15,4.4,8,0,.45,-3.75,0x3a4230,Math.PI/2);ldCy(Tt,.22,.22,.55,8,0,.45,-5.8,K,Math.PI/2);ldCy(Tt,.5,.5,.16,10,-.5,.93,.6,O2);ldB(Tt,.12,.5,.12,.7,1.1,.9,K);
 ldB(J,2.0,.5,4.0,0,.8,0,O);ldB(J,1.9,.45,1.3,0,1.25,-1.3,O);ldB(J,1.6,.4,.08,0,1.2,-1.97,K);ldB(J,1.9,.5,.14,0,1.25,1.9,O);ldB(J,1.85,.7,.07,0,1.85,-.6,GL);ldB(J,1.95,.08,.1,0,2.22,-.6,O2);ldB(J,1.9,.08,.08,0,2.45,.95,K);ldCy(J,.42,.42,.26,12,0,1.3,2.12,K,Math.PI/2);ldB(J,2.1,.18,.16,0,.62,-2.05,K);ldB(J,2.1,.18,.16,0,.62,2.05,K);
 for(const s of[-1,1]){ldB(J,.3,.22,.08,s*.7,1.25,-1.99,0xfff6d8);ldB(J,.14,.5,2.3,s*.95,1.25,.75,O);ldB(J,.45,.12,1.0,s*1.0,1.02,-1.3,O2);ldB(J,.7,.5,.7,s*.45,1.15,.15,0x2b2e26);ldB(J,.7,.7,.14,s*.45,1.55,.5,0x2b2e26);ldB(J,.08,1.0,.08,s*.92,1.95,.95,K)}
 ldB(T,2.2,.4,7.0,0,.95,.3,K);ldB(T,2.5,1.7,1.9,0,2.0,-2.3,O);ldB(T,2.2,.7,.08,0,2.35,-3.27,GL);ldB(T,2.3,.9,.5,0,1.5,-3.4,O2);ldB(T,2.6,.25,4.6,0,1.25,1.4,O2);ldB(T,2.6,1.9,4.6,0,2.35,1.4,0x77764f);ldB(T,2.5,.3,.2,0,.8,-3.6,K);
 for(let k=0;k<4;k++)ldB(T,2.68,1.95,.1,0,2.36,-.6+k*1.33,0x66653f);
 for(const s of[-1,1]){ldB(T,.3,.24,.08,s*.85,1.5,-3.66,0xfff6d8);ldB(T,.08,.6,1.0,s*1.26,2.3,-2.3,GL);ldCy(T,.55,.55,.34,14,s*1.17,.55,2.9,0x151515,0,Math.PI/2)}
 ldCy(W,.45,.45,.32,14,0,0,0,0x151515,0,Math.PI/2);ldCy(W,.22,.22,.34,8,0,0,0,0x4f5d3a,0,Math.PI/2);
 const mg=a=>U.mergeBufferGeometries(a);return {hull:mg(H),tur:mg(Tt),jeep:mg(J),truck:mg(T),wheel:mg(W)}})();
function ldVehicle(kind,x,z,ry){const g=new THREE.Group(),add=(geo,px,py,pz)=>{const m=new THREE.Mesh(geo,ldMat);m.castShadow=true;m.position.set(px||0,py||0,pz||0);g.add(m);return m};g.userData.wheels=[];let c;
 if(kind==='tank'){add(ldVG.hull);g.userData.tur=add(ldVG.tur,0,2.2,.3);g.userData.max=13;c={m:g,speed:0,steer:0,hp:900,ldTank:true,ldV:'tank',vhEng:new THREE.Vector3(0,2.1,2.6)};ldTanks.push(c)}
 else{const tr=kind==='truck';add(tr?ldVG.truck:ldVG.jeep);const wx=tr?1.17:1.02,wy=tr?.55:.45;for(const p of(tr?[[-wx,-2.4],[wx,-2.4],[-wx,1.7],[wx,1.7]]:[[-wx,-1.3],[wx,-1.3],[-wx,1.3],[wx,1.3]])){const w=add(ldVG.wheel,p[0],wy,p[1]);if(tr)w.scale.setScalar(1.22);g.userData.wheels.push(w)}
  g.userData.max=tr?30:42;c={m:g,speed:0,steer:0,hp:tr?260:160,ldV:kind,vhEng:new THREE.Vector3(0,1.3,tr?-3.3:-1.5)}}
 g.position.set(x,0,z);g.rotation.y=ry||0;scene.add(g);cars.push(c);return c}
function ldStaticTank(L,x,z,ry,ty){ldSol(x-2.2,x+2.2,z-3.5,z+3.5,3.2);ldInto(L,ldVG.hull,x,0,z,ry);const t=ldVG.tur.clone();t.rotateY(ty||0);t.translate(0,2.2,.3);t.rotateY(ry||0);t.translate(x,0,z);L.push(t)}
function ldStaticTruck(L,x,z,ry){ldSol(x-1.3,x+1.3,z-3.7,z+3.7,3.3);ldInto(L,ldVG.truck,x,0,z,ry);for(const p of[[-1.17,-2.4],[1.17,-2.4],[-1.17,1.7],[1.17,1.7]]){const w=ldVG.wheel.clone();w.scale(1.22,1.22,1.22);w.translate(p[0],.55,p[1]);w.rotateY(ry||0);w.translate(x,0,z);L.push(w)}}
// sign atlas for the army base (one texture, one merged mesh, 2 triangles per sign)
const ldCells={},ldSG=[];const ldAtlas=(()=>{const cv=document.createElement('canvas');cv.width=512;cv.height=512;const g=cv.getContext('2d');
 const cell=(k,x,y,w,h,bg,fg,txt,sz)=>{ldCells[k]=[x,y,w,h];g.fillStyle=bg;g.fillRect(x,y,w,h);if(!txt)return;g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';let s=Math.floor(h*(sz||.7));const F=n=>'900 '+n+'px Impact, Arial Black, sans-serif';g.font=F(s);while(g.measureText(txt).width>w*.9&&s>6){s--;g.font=F(s)}g.fillText(txt,x+w/2,y+h/2+1)};
 cell('mil',0,0,512,128,'#8a1c1c','#fff','');g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';const fit=(t,y,mx)=>{let s=mx;g.font='900 '+s+'px Impact, Arial Black, sans-serif';while(g.measureText(t).width>440&&s>8){s--;g.font='900 '+s+'px Impact, Arial Black, sans-serif'}g.fillText(t,256,y)};fit('MILITARY BASE',40,50);g.fillStyle='#f2e24a';fit('NO ENTRY',94,50);g.strokeStyle='#f2f2ea';g.lineWidth=4;g.strokeRect(6,6,500,116);
 cell('chk',0,128,512,80,'#47503a','#f2e24a','CHECKPOINT');cell('hgA',0,208,256,40,'#47503a','#f2e24a','HANGAR A');cell('hgB',256,208,256,40,'#47503a','#f2e24a','HANGAR B');
 cell('bkA',0,248,256,32,'#5b6447','#f2f2ea','BARRACKS A');cell('bkB',256,248,256,32,'#5b6447','#f2f2ea','BARRACKS B');cell('bkC',0,280,256,32,'#5b6447','#f2f2ea','BARRACKS C');cell('bkD',256,280,256,32,'#5b6447','#f2f2ea','BARRACKS D');
 cell('cmd',0,312,256,40,'#7c8073','#f2e24a','COMMAND');cell('mp',256,312,256,26,'#3d4432','#f2e24a','MOTOR POOL');cell('rng',256,338,128,24,'#47503a','#f2e24a','RANGE');cell('stop',384,338,96,32,'#c62828','#ffffff','STOP',.8);cell('army',0,352,256,64,'#6f7a5a','#f2f2ea','ARMY');
 const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t})();
function ldTag(k,w,h,x,y,z,ry){const c=ldCells[k],g=new THREE.PlaneGeometry(w,h),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(c[0]+uv.getX(i)*c[2])/512,1-(c[1]+(1-uv.getY(i))*c[3])/512);const q=g.toNonIndexed();if(ry)q.rotateY(ry);q.translate(x,y,z);ldSG.push(q)}
// ================= ARMY BASE (north) =================
const ldZ0=-HALF-36,ldZ1=-HALF-236,ldX0=-165,ldX1=165,ldGX=roadCenter(5);
{const L=ldN,OL=0x5b6447,OD=0x47503a,CON=0x8d8f86,ASP=0x34363a,DK=0x24271f,GL=0x1b2733,WH=0xf2f2ea;
 for(const o of scene.children.slice())if(o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.width===40&&o.geometry.parameters.depth===40&&Math.hypot(o.position.x,o.position.z)>HALF+50)scene.remove(o);
 ldB(L,ldX1-ldX0+16,.1,ldZ0-ldZ1+16,0,0,(ldZ0+ldZ1)/2,0x77755f);ldB(L,12,.1,38,ldGX,.02,-HALF-18,ASP);ldB(L,12,.12,140,ldGX,.03,ldZ0-70,ASP);ldB(L,300,.12,10,0,.03,ldZ0-84,ASP);
 ldB(L,300,.12,16,0,.03,ldZ1+22,0x2c2e31);for(let x=-130;x<=130;x+=20)ldB(L,9,.13,.7,x,.035,ldZ1+22,WH);ldB(L,92,.1,24,89,.03,ldZ0-24,0x77796f);
 const fence=(x0,z0,x1,z1)=>{const len=Math.hypot(x1-x0,z1-z0),cx=(x0+x1)/2,cz=(z0+z1)/2,ax=Math.abs(x1-x0)>Math.abs(z1-z0);
  ldB(L,ax?len:.8,1,ax?.8:len,cx,.5,cz,CON);ldB(L,ax?len:.12,3,ax?.12:len,cx,2.5,cz,0x4d5a4e);ldB(L,ax?len:.3,.12,ax?.3:len,cx,4.25,cz,0xb9bdc2);
  const n=Math.max(1,Math.round(len/10));for(let i=0;i<=n;i++)ldB(L,.35,4.4,.35,x0+(x1-x0)*i/n,2.2,z0+(z1-z0)*i/n,DK);ldSol(x0-(ax?0:.6),x1+(ax?0:.6),z0-(ax?.6:0),z1+(ax?.6:0),4.4)};
 fence(ldX0,ldZ0,ldGX-8,ldZ0);fence(ldGX+8,ldZ0,ldX1,ldZ0);fence(ldX0,ldZ1,ldX1,ldZ1);fence(ldX0,ldZ0,ldX0,ldZ1);fence(ldX1,ldZ0,ldX1,ldZ1);
 for(const s of[-1,1]){ldB(L,1.3,5.4,1.3,ldGX+s*8,2.7,ldZ0,CON);ldB(L,1.6,.3,1.6,ldGX+s*8,5.5,ldZ0,OD)}
 ldText(L,'RESTRICTED',ldGX+11.6,4.4,ldZ0+.5,1,0,.34,.1,0xf2e24a);ldB(L,22.4,3.2,.2,ldGX+21.6,3.2,ldZ0+.38,0x8a1c1c);
 for(const tw of[[ldX0+7,ldZ0-7],[ldX1-7,ldZ0-7],[ldX0+7,ldZ1+7],[ldX1-7,ldZ1+7]]){const x=tw[0],z=tw[1];for(const a of[-2,2])for(const b of[-2,2]){ldB(L,.4,9,.4,x+a,4.5,z+b,DK);ldB(L,.2,3,.2,x+a*1.2,10.8,z+b*1.2,DK)}
  ldB(L,5.2,.35,5.2,x,9.1,z,OD);for(const a of[-1,1]){ldB(L,5.2,1.2,.2,x,9.9,z+a*2.5,OL);ldB(L,.2,1.2,5.2,x+a*2.5,9.9,z,OL)}ldB(L,6,.3,6,x,12.4,z,OD);
  const lx=x-Math.sign(x)*2.3,lz=z+(z>(ldZ0+ldZ1)/2?-2.3:2.3);ldB(ldE,.9,.7,.9,lx,11.2,lz,0xfff4c8);ldBeams.push([lx,11.2,lz])}
 ldB(L,6,3.6,5,ldGX+13,1.8,ldZ0-4.5,OL);ldB(L,6.8,.3,5.8,ldGX+13,3.75,ldZ0-4.5,OD);ldB(L,.1,1.1,3,ldGX+9.95,2.3,ldZ0-4.5,GL);ldSol(ldGX+10,ldGX+16,ldZ0-7,ldZ0-2,3.8);
 for(const b of[[-100,ldZ0-26],[-100,ldZ0-46],[-58,ldZ0-26],[-58,ldZ0-46]]){const x=b[0],z=b[1];ldB(L,36,5,11,x,2.5,z,OL);const g=new THREE.BoxGeometry(36.6,7.9,7.9);g.rotateX(Math.PI/4);g.scale(1,.45,1);g.translate(x,5,z);L.push(ldPaint(g,OD));
  for(let k=-3;k<=3;k++)if(k)ldB(L,2.2,1.3,.12,x+k*4.8,3,z+5.52,GL);ldB(L,1.6,2.6,.14,x,1.3,z+5.53,0x2f3327);ldSol(x-18,x+18,z-5.5,z+5.5,7.5)}
 {const z=ldZ0-40;ldB(L,24,8,14,22,4,z,0x7c8073);ldB(L,24.8,.5,14.8,22,8.2,z,OD);for(const y of[2.6,6])for(let k=-4;k<=4;k++)if(y>3||k)ldB(L,1.6,1.4,.12,22+k*2.5,y,z+7.02,GL);ldB(L,1.8,2.6,.14,22,1.3,z+7.03,0x2f3327);ldB(L,.2,7,.2,30,11.7,z,DK);ldSol(10,34,z-7,z+7,8.5)}
 for(const hx of[64,114]){const hz=ldZ0-52;for(const s of[-1,1]){ldB(L,1,10,30,hx+s*17,5,hz,OL);ldB(L,18.8,.5,30.6,hx+s*8.7,12.1,hz,OD,0,0,-s*.26);ldSol(hx+s*17-.5,hx+s*17+.5,hz-15,hz+15,10)}
  ldB(L,35,10,1,hx,5,hz-14.5,OL);ldB(L,35,4.6,.6,hx,12.2,hz-14.6,OL);ldB(L,35,2.2,.6,hx,11.1,hz+14.7,OD);ldB(L,33,.12,30,hx,.04,hz,0x6f716a);ldSol(hx-17.5,hx+17.5,hz-15,hz-14,10)}
 ldCy(L,7,7.3,.16,24,10,.08,ldZ0-122,0x3b3e42);ldCy(L,6.2,6.2,.18,24,10,.09,ldZ0-122,0xf2c230);ldCy(L,5.8,5.8,.2,24,10,.1,ldZ0-122,0x3b3e42);for(const s of[-1,1])ldB(L,.7,.05,4.4,10+s*1.8,.21,ldZ0-122,WH);ldB(L,3.6,.05,.7,10,.21,ldZ0-122,WH);
 for(let k=0;k<3;k++)ldStaticTank(L,-125+k*15,ldZ0-125,Math.PI,(k-1)*.35);ldStaticTruck(L,-76,ldZ0-127,Math.PI);ldStaticTruck(L,-64,ldZ0-127,Math.PI);ldStaticTank(L,64,ldZ0-56,Math.PI,0);ldStaticTruck(L,114,ldZ0-56,Math.PI);
 for(let a=0;a<3;a++)for(let b=0;b<2;b++)for(let c=0;c<2-b;c++)ldB(L,1.3,1.1,1.3,-50+a*1.5+b*.3,.6+c*1.12,ldZ0-120-b*1.6,(a+b+c)%2?0x6b5a3a:0x4f5d3a);
 ldB(L,6,7,6,130,3.5,ldZ0-150,0x7c8073);ldSol(127,133,ldZ0-153,ldZ0-147,7.2);
 for(const k of[0,1]){ldCy(L,2.2,2.2,8,12,134,2.5,ldZ0-98-k*6,0xa9ada6,0,Math.PI/2);ldB(L,7,.6,1,134,.3,ldZ0-98-k*6,CON)}ldSol(129.5,138.5,ldZ0-107,ldZ0-95,4.8);
 ldCy(L,.12,.16,13,6,ldGX-14,6.5,ldZ0-14,0xc9ccd0);ldSol(-51,-45.5,ldZ0-122.6,ldZ0-119,2.2);
 for(const s of[-1,1])for(const z of[ldZ0-22,ldZ0-52,ldZ0-104,ldZ0-134]){ldB(L,.25,7,.25,ldGX+s*7.2,3.5,z,DK);ldB(L,1.3,.2,.3,ldGX+s*6.6,7,z,DK);ldB(ldE,1,.22,.5,ldGX+s*6.2,6.85,z,0xfff1c9)}
 for(const b of[[-100,ldZ0-26],[-100,ldZ0-46],[-58,ldZ0-26],[-58,ldZ0-46]])for(const k of[-2,1,3])ldB(ldE,2.1,1.2,.1,b[0]+k*4.8,3,b[1]+5.6,0xffe2a0);for(const k of[-3,-1,2,4])ldB(ldE,1.5,1.3,.1,22+k*2.5,6,ldZ0-32.9,0xffe2a0);
 for(const s of[-1,1])for(let k=0;k<3;k++){ldB(L,3,.5,1,ldGX+s*12,.3+k*.5,ldZ0-14-(k%2)*.2,0x9b8f6b);ldB(L,1,.5,2.4,ldGX+s*(10.5+ (s>0?3:3)),.3+k*.5,ldZ0-15.5,0x9b8f6b)}
 // ===== base detail: all merged into ldN (one mesh) and ldE (emissive) =====
 const PI=Math.PI,SB=0x9b8f6b;
 // extra guard towers (mid sides, back) with ladders and searchlights
 const tower=(x,z)=>{for(const a of[-2,2])for(const b of[-2,2]){ldB(L,.4,9,.4,x+a,4.5,z+b,DK);ldB(L,.2,3,.2,x+a*1.2,10.8,z+b*1.2,DK)}
  ldB(L,5.2,.35,5.2,x,9.1,z,OD);for(const a of[-1,1]){ldB(L,5.2,1.2,.2,x,9.9,z+a*2.5,OL);ldB(L,.2,1.2,5.2,x+a*2.5,9.9,z,OL);ldB(L,4.2,.1,.1,x,4.5,z+a*2,DK,0,0,a*1.1);ldB(L,.1,.1,4.2,x+a*2,4.5,z,DK,0,a*1.1,0)}ldB(L,6,.3,6,x,12.4,z,OD);
  for(let y=.5;y<9;y+=.55)ldB(L,.9,.06,.06,x+.9,y,z+2.35,DK);for(const a of[.45,1.35])ldB(L,.06,9,.06,x+a,4.5,z+2.35,DK);ldSol(x-2.3,x+2.3,z-2.3,z+2.3,12.6);
  const lx=x-Math.sign(x)*2.3,lz=z+(z>(ldZ0+ldZ1)/2?-2.3:2.3);ldB(ldE,.9,.7,.9,lx,11.2,lz,0xfff4c8);ldBeams.push([lx,11.2,lz])};
 tower(ldX0+7,(ldZ0+ldZ1)/2);tower(ldX1-7,(ldZ0+ldZ1)/2);tower(0,ldZ1+7);
 // gate checkpoint: jersey barriers along the approach, speed bumps, stop sign, warning board, gate lights
 for(const s of[-1,1]){for(let z=ldZ0+4;z<-HALF-4;z+=3.4){ldB(L,.7,.9,3.2,ldGX+s*6.6,.45,z+1.7,0xb7b5ac);ldB(L,.35,.35,3.2,ldGX+s*6.6,1.05,z+1.7,0xb7b5ac)}ldSol(ldGX+s*6.6-.4,ldGX+s*6.6+.4,ldZ0+4,-HALF-4,1.2);ldB(ldE,.7,.4,.7,ldGX+s*8,5.85,ldZ0+.6,0xfff1c9)}
 for(const z of[ldZ0+10,ldZ0+20]){ldB(L,11.4,.12,.6,ldGX,.08,z,0xf2c230);for(let k=0;k<6;k++)ldB(L,.9,.13,.62,ldGX-4.7+k*1.9,.085,z,0x222222)}
 ldB(L,.12,2.6,.12,ldGX+5.6,1.3,ldZ0+3,0x8a8d90);ldCy(L,.62,.62,.06,8,ldGX+5.6,2.75,ldZ0+3.05,0xc62828,PI/2);ldTag('stop',.96,.32,ldGX+5.6,2.75,ldZ0+3.09,0);
 {const x=ldGX+16,z=ldZ0+14;for(const s of[-1,1])ldB(L,.2,4.4,.2,x+s*4.6,2.2,z-.12,0x8a8d90);ldB(L,10.4,2.8,.15,x,3.4,z,0x8a1c1c);ldTag('mil',10.2,2.6,x,3.4,z+.09,0)}
 ldB(L,6.4,1.1,.15,ldGX+13,4.45,ldZ0-1.85,OD);ldTag('chk',6.2,1,ldGX+13,4.45,ldZ0-1.76,0);
 // tank-trap hedgehogs along the outside of the front fence
 for(let x=-150;x<=150;x+=10){if(Math.abs(x-ldGX)<16)continue;const z=ldZ0+5+(Math.abs(x)%20?1.2:0);for(let k=0;k<3;k++)ldB(L,2.3,.22,.22,x,.78,z,0x3a3a36,k*PI*2/3,0,.62);ldSol(x-.8,x+.8,z-.8,z+.8,1.4)}
 // razor wire coils on every fence run
 const wire=(x0,z0,x1,z1)=>{const len=Math.hypot(x1-x0,z1-z0),ax=Math.abs(x1-x0)>Math.abs(z1-z0),n=Math.floor(len/2.5);for(let i=0;i<n;i++){const t=(i+.5)/n,g=new THREE.TorusGeometry(.42,.025,3,5);g.rotateY(ax?PI/2:0);g.rotateX((i%3-1)*.22);g.translate(x0+(x1-x0)*t,4.78,z0+(z1-z0)*t);L.push(ldPaint(g,0xc4c8cc))}};
 wire(ldX0,ldZ0,ldGX-8,ldZ0);wire(ldGX+8,ldZ0,ldX1,ldZ0);wire(ldX0,ldZ1,ldX1,ldZ1);wire(ldX0,ldZ0,ldX0,ldZ1);wire(ldX1,ldZ0,ldX1,ldZ1);
 // barracks: porches, steps, AC units, names
 [[-100,ldZ0-26,'A'],[-100,ldZ0-46,'B'],[-58,ldZ0-26,'C'],[-58,ldZ0-46,'D']].forEach(b=>{const x=b[0],z=b[1];ldB(L,3.4,.2,1.9,x,2.85,z+6.4,OD);for(const s of[-1,1])ldB(L,.15,2.8,.15,x+s*1.5,1.4,z+7.2,DK);ldB(L,2.8,.25,1.3,x,.13,z+6.2,CON);
  for(const s of[-1,1]){ldB(L,.6,.8,1.1,x+s*18.35,.8,z+2,0x9aa09a);ldB(L,.06,.5,.5,x+s*18.67,.85,z+2,DK);ldB(L,.6,.8,1.1,x+s*18.35,.8,z-2,0x9aa09a)}
  ldTag('bk'+b[2],9.2,1.1,x+11.8,4.3,z+5.57,0)});
 // HQ name, parade square, three flag poles (flags are animated meshes below)
 ldTag('cmd',8,1.25,22,4.45,ldZ0-32.93,0);
 {const z=ldZ0-20;ldB(L,30,.06,14,22,.05,z,0x9a9a92);for(const s of[-1,1]){ldB(L,30,.07,.25,22,.06,z+s*6.8,WH);ldB(L,.25,.07,14,22+s*14.8,.06,z,WH)}for(const x of[14,22,30]){ldCy(L,.1,.13,10,6,x,5,ldZ0-27.5,0xc9ccd0);ldCy(L,.2,.2,.2,6,x,10.1,ldZ0-27.5,0xd4af37)}}
 // hangars: names over the doors, interior light strips
 for(const hx of[64,114]){const hz=ldZ0-52;ldTag(hx<100?'hgA':'hgB',14,2.05,hx,11.1,hz+15.06,0);for(const s of[-1,1])ldB(ldE,.4,.15,26,hx+s*7,9.7,hz,0xfff1c9)}
 // helipad: edge lights and a windsock
 for(let k=0;k<12;k++){const a=k*PI/6;ldB(ldE,.35,.15,.35,10+Math.cos(a)*7.5,.22,ldZ0-122+Math.sin(a)*7.5,k%2?0x7df0ff:0xfff1c9)}
 const sock=(x,z)=>{ldCy(L,.08,.1,6,6,x,3,z,0xdddddd);ldCy(L,.13,.45,2.2,8,x+1.2,5.85,z,0xff6a00,0,-PI/2);ldCy(L,.46,.46,.6,8,x+.55,5.85,z,0xf2f2f2,0,-PI/2)};sock(24,ldZ0-110);sock(120,ldZ1+8);
 // motor pool: shade canopy, bay lines, sign, extra jeep, fuel pumps
 const sJeep=(x,z,ry)=>{ldSol(x-1.1,x+1.1,z-2.1,z+2.1,2.4);ldInto(L,ldVG.jeep,x,0,z,ry);for(const p of[[-1.02,-1.3],[1.02,-1.3],[-1.02,1.3],[1.02,1.3]]){const w=ldVG.wheel.clone();w.translate(p[0],.45,p[1]);w.rotateY(ry||0);w.translate(x,0,z);L.push(w)}};
 {const z=ldZ0-125;ldB(L,80,.35,16,-94,5.4,z,OD);ldB(L,80.4,.5,.3,-94,5.25,z+8.1,0x3d4432);for(let x=-132;x<=-56;x+=12.6)for(const s of[-1,1]){ldB(L,.35,5.3,.35,x,2.65,z+s*7.6,DK);ldSol(x-.3,x+.3,z+s*7.6-.3,z+s*7.6+.3,5.4)}
  ldB(L,13,1.4,.15,-94,6.3,z+8.1,0x3d4432);ldTag('mp',12.6,1.25,-94,6.3,z+8.2,0);for(let x=-130;x<=-58;x+=8)ldB(L,.15,.06,11,x,.07,z,WH);sJeep(-88,z+1,PI);sJeep(-52,z+12,PI/2)}
 {const x=-45,z=ldZ0-100;ldB(L,6,.3,2,x,.15,z,CON);for(const s of[-1,1]){ldB(L,.8,1.6,.6,x+s*1.6,1.1,z,0xb02323);ldB(L,.6,.4,.05,x+s*1.6,1.4,z+.33,0xf2f2ea);ldB(L,.2,4.4,.2,x+s*2.6,2.2,z,DK)}ldB(L,8,.3,5,x,4.5,z,OD);ldB(ldE,6,.08,.3,x,4.33,z,0xfff1c9);ldSol(x-3,x+3,z-1,z+1,1.8)}
 // container yard (west) and ammo crate stacks
 {const cc=[0x55613f,0x9b8f6b,0x8a4b2b,0x4f6d7a,0x6b5a3a];for(const x of[-155,-152.4,-149.8,-141.5,-138.9])for(const d of[30,44,58]){const n=1+Math.floor(ldR()*2.6),z=ldZ0-d;
  for(let k=0;k<n;k++){const col=cc[Math.floor(ldR()*cc.length)],y=1.3+k*2.62;ldB(L,2.5,2.6,12.2,x,y,z,col);for(const s of[-1,1])for(let r=-4.5;r<=4.5;r+=3)ldB(L,.06,2.3,.3,x+s*1.27,y,z+r,col);ldB(L,2.2,2.3,.06,x,y,z+6.12,col);for(const s of[-.5,.5])ldB(L,.07,2.3,.08,x+s,y,z+6.16,DK)}ldSol(x-1.25,x+1.25,z-6.1,z+6.1,n*2.62)}}
 const crates=(x,z,nx,nz,h)=>{for(let a=0;a<nx;a++)for(let b=0;b<nz;b++){const hh=1+Math.floor(ldR()*h);for(let c=0;c<hh;c++){const col=ldR()<.5?0x6b5a3a:0x4f5d3a;ldB(L,1.25,1.05,1.25,x+a*1.35,.53+c*1.07,z+b*1.35,col);ldB(L,1.28,.12,1.28,x+a*1.35,.53+c*1.07,z+b*1.35,0x3a3a2e)}}ldSol(x-.7,x+nx*1.35-.65,z-.7,z+nz*1.35-.65,h*1.07)};
 crates(-128,ldZ0-30,3,2,2);crates(-128,ldZ0-62,2,2,2);crates(87,ldZ0-45,2,3,3);crates(136,ldZ0-139,2,2,2);
 // sandbag gun nests
 const nest=(x,z,r,face)=>{for(let l=0;l<3;l++){const n=Math.round(PI*1.55*r/.92);for(let i=0;i<=n;i++){const a=face+.45+(i+(l%2)*.5)/n*(PI*2-.9);ldB(L,.9,.36,.5,x+Math.cos(a)*r,.2+l*.36,z+Math.sin(a)*r,(i+l)%3?SB:0x8f8462,PI/2-a)}}
  const b=face+PI;ldCy(L,.05,.05,1.1,4,x,.55,z,DK);ldB(L,1.3,.16,.16,x+Math.cos(b)*.5,1.15,z+Math.sin(b)*.5,0x2b2e26,-b);ldB(L,.3,.25,.25,x,1.15,z,0x2b2e26,-b);ldSol(x-r-.3,x+r+.3,z-r-.3,z+r+.3,1.1)};
 nest(-140,ldZ0-14,2.2,-PI/2);nest(150,ldZ0-14,2.2,-PI/2);nest(-4,ldZ0-9,2,-PI/2);nest(30,ldZ0-138,2.2,-PI/2);nest(-155,ldZ0-165,2.2,0);
 // radome, comms mast, water tower (east strip)
 {const z=ldZ0-128;ldCy(L,4.2,4.6,4,16,150,2,z,0x8d8f86);const d=new THREE.SphereGeometry(5.2,16,10,0,PI*2,0,PI*.62);d.translate(150,6,z);L.push(ldPaint(d,0xf2f2ea));ldSol(145.4,154.6,z-4.6,z+4.6,11.2)}
 {const x=150,z=ldZ0-62,C=0xc9ccd0;for(const a of[-1,1])for(const b of[-1,1])ldB(L,.22,26,.22,x+a,13,z+b,C);for(let y=2;y<25;y+=3)for(const a of[-1,1]){ldB(L,2.2,.1,.1,x,y,z+a,C);ldB(L,.1,.1,2.2,x+a,y,z,C);ldB(L,2.7,.08,.08,x,y+1.5,z+a,C,0,0,a*.94);ldB(L,.08,.08,2.7,x+a,y+1.5,z,C,0,a*.94,0)}
  for(const q of[[0,18,1.6,0],[-1.6,22,0,-PI/2]]){const g=new THREE.SphereGeometry(1.4,12,6,0,PI*2,0,PI*.32);g.rotateX(PI/2);g.rotateY(q[3]);g.translate(x+q[0],q[1],z+q[2]);L.push(ldPaint(g,0xf2f2ea))}ldB(ldE,.5,.5,.5,x,26.3,z,0xff3020);ldSol(x-1.2,x+1.2,z-1.2,z+1.2,26)}
 {const x=150,z=ldZ0-35,C=0x7c8073;for(const a of[-1,1])for(const b of[-1,1])ldB(L,.35,14,.35,x+a*2.4,7,z+b*2.4,C);for(const y of[4,9])for(const a of[-1,1]){ldB(L,5,.18,.18,x,y,z+a*2.4,C);ldB(L,.18,.18,5,x+a*2.4,y,z,C)}
  ldCy(L,3.6,3.6,4.5,16,x,16.2,z,0x6f7a5a);ldCy(L,0,3.9,2,16,x,19.4,z,0x5b6447);ldCy(L,3.9,3.9,.3,16,x,14,z,0x47503a);{const g=new THREE.CylinderGeometry(3.63,3.63,1.1,12,1,true,-.6,1.2),c=ldCells.army,uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(c[0]+uv.getX(i)*c[2])/512,1-(c[1]+(1-uv.getY(i))*c[3])/512);const q=g.toNonIndexed();q.translate(x,16.4,z);ldSG.push(q)}ldSol(x-2.7,x+2.7,z-2.7,z+2.7,20)}
 // floodlight masts
 const mast=(x,z)=>{ldCy(L,.18,.28,18,6,x,9,z,DK);ldB(L,3.2,.3,.5,x,18,z,DK);for(const a of[-1.2,-.4,.4,1.2])ldB(ldE,.6,.45,.6,x+a,17.7,z+.3,0xfff4d6);ldSol(x-.3,x+.3,z-.3,z+.3,18)};
 mast(-150,ldZ0-108);mast(-155,ldZ0-150);mast(155,ldZ0-150);mast(40,ldZ0-150);
 // airstrip: edge and threshold lights, hardstands and a blast wall behind the parked jets
 for(let x=-145;x<=145;x+=14.5)for(const s of[-1,1])ldB(ldE,.3,.18,.3,x,.2,ldZ1+22+s*8.6,0xfff1c9);for(let k=-3;k<=3;k++){ldB(ldE,.3,.18,.3,-150.6,.2,ldZ1+22+k*2.2,0x40ff70);ldB(ldE,.3,.18,.3,150.6,.2,ldZ1+22+k*2.2,0xff4030)}
 for(const x of[-84,-52,-20])ldB(L,16,.06,12,x,.05,ldZ0-159,0x8d8f86);for(let x=-100;x<=-4;x+=1.46){ldB(L,1.38,3.4,.45,x,1.7,ldZ0-150,0xa9aaa2);ldB(L,1.38,.4,1.4,x,.2,ldZ0-150,0xa9aaa2)}ldSol(-100.7,-3.3,ldZ0-150.7,ldZ0-149.3,3.4);
 // training ground: dirt yard, obstacle course, rope tower
 {const zc=ldZ0-100;ldB(L,80,.06,58,85,.04,ldZ0-118,0x8a7655);
  for(let i=0;i<5;i++)for(const s of[-1,1]){const g=new THREE.TorusGeometry(.42,.16,5,10);g.rotateX(PI/2);g.translate(50+i*1.5+(s>0?.75:0),.17,zc+s*1.2);L.push(ldPaint(g,0x1c1c1c))}
  for(const x of[60,64]){ldB(L,.35,1.2,5,x,.6,zc,0x8a6b45);ldSol(x-.2,x+.2,zc-2.5,zc+2.5,1.2)}ldB(L,.5,2.4,5,70,1.2,zc,0x8a6b45);for(let y=.5;y<2.4;y+=.6)ldB(L,.12,.12,4.6,69.7,y,zc,0x6b5236);ldSol(69.75,70.25,zc-2.5,zc+2.5,2.4);
  for(const s of[-1,1]){ldB(L,10.4,.12,.12,81,2.3,zc+s*.55,0x55585d);for(const x of[76,86])ldB(L,.14,2.35,.14,x,1.17,zc+s*.55,0x55585d)}for(let x=76.5;x<86;x+=.6)ldB(L,.06,.06,1.1,x,2.33,zc,0x9a9da1);
  for(const s of[-1,1]){ldCy(L,.14,.14,9,8,95,.55,zc+s*1.6,0x7a5c3a,0,PI/2);for(const x of[91,95,99])ldB(L,.2,.5,.2,x,.25,zc+s*1.6,0x5d4630)}
  {const x=106;for(const a of[-1,1]){for(const s of[-1,1])ldB(L,.18,5.76,.18,x+a*1.55,2.42,zc+s*2.4,0x7a5c3a,0,0,a*.569);for(let k=0;k<6;k++){const y=.5+k*.8;ldB(L,.05,.05,4.8,x+a*3.1*(1-y/4.85),y,zc,0x2a2a2a)}for(let k=-2;k<=2;k++)ldB(L,.05,5.7,.05,x+a*1.55,2.42,zc+k*.95,0x2a2a2a,0,0,a*.569)}ldB(L,.2,.2,5,x,4.85,zc,0x7a5c3a)}
  for(let x=112;x<=121;x+=1.5){for(const s of[-1,1])ldB(L,.08,.6,.08,x,.3,zc+s*1.3,0x55585d);ldB(L,.03,.03,2.6,x,.58,zc,0x9a9da1)}for(const s of[-1,0,1])ldB(L,9.2,.03,.03,116.5,.55,zc+s*1.3,0x9a9da1);
  {const x=120,z=ldZ0-112;for(const a of[-1.5,1.5])for(const b of[-1,1])ldB(L,.25,7,.25,x+a,3.5,z+b,0x7a5c3a);ldB(L,3.4,.3,2.4,x,7,z,0x7a5c3a);for(const a of[-.8,0,.8])ldCy(L,.05,.05,6.6,5,x+a,3.6,z,0xc2a878);ldSol(x-1.7,x+1.7,z-1.1,z+1.1,7)}}
 // shooting range: firing-line shelter, rests, targets, earth berm
 {const zf=ldZ0-128,zt=ldZ0-143;ldB(L,62,.25,4,82,3.1,zf,OD);for(let x=52;x<=112;x+=10)for(const s of[-1,1])ldB(L,.2,3,.2,x,1.5,zf+s*1.8,DK);
  ldB(L,7,1.3,.15,82,3.9,zf+2,OD);ldTag('rng',6.6,1.2,82,3.9,zf+2.09,0);
  for(let x=55;x<=109;x+=6){ldB(L,1.2,.9,.6,x,.45,zf-1.2,SB);for(const s of[-1,1])ldB(L,.08,1.5,.08,x+s*.35,.75,zt,DK);ldB(L,.9,1.3,.06,x,1.75,zt,0xf2f2ea);ldB(L,.5,.5,.07,x,1.95,zt,0x222222);ldB(L,.2,.2,.08,x,1.95,zt,0xc62828)}
  ldB(L,66,3.6,3,82,1.8,zt-3,0x6f5f40);ldSol(49,115,zt-4.5,zt-1.5,3.6)}
 ldMesh(L,ldMat,true);var ldSignMat=new THREE.MeshStandardMaterial({map:ldAtlas,emissive:0xffffff,emissiveMap:ldAtlas,emissiveIntensity:.12,roughness:.75});{const sm=new THREE.Mesh(U.mergeBufferGeometries(ldSG),ldSignMat);sm.receiveShadow=true;scene.add(sm)}
 // moving parts
 const bg=new THREE.ConeGeometry(7,44,14,1,true);bg.translate(0,-22,0);const bm=new THREE.MeshBasicMaterial({color:0xfff0c0,transparent:true,opacity:.2,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false,fog:false});
 for(let i=0;i<ldBeams.length;i++){const p=ldBeams[i],g=new THREE.Group(),m=new THREE.Mesh(bg,bm);m.rotation.z=1.15;g.add(m);g.position.set(p[0],p[1],p[2]);g.visible=false;scene.add(g);ldBeams[i]={g:g,ph:i*1.7,base:Math.atan2(p[2]-(ldZ0+ldZ1)/2,-p[0])}}
 const rl=[];{const d=new THREE.SphereGeometry(2.7,12,5,0,Math.PI*2,0,1.05);d.rotateX(Math.PI/2);d.translate(0,1.6,-1.3);rl.push(ldPaint(d,0xc9ccd0));ldB(rl,.3,1.8,.3,0,.9,0,0x55585d);ldB(rl,.15,.15,2.4,0,1.6,.2,0x55585d)}
 var ldRadar=new THREE.Mesh(U.mergeBufferGeometries(rl),ldMat2);ldRadar.position.set(130,7,ldZ0-150);ldRadar.castShadow=true;scene.add(ldRadar);
 const ar=[];for(let k=0;k<8;k++)ldB(ar,1.9,.22,.22,-.95-k*1.9,0,0,k%2?0xf2f2ea:0xc62828);ldB(ar,.5,1.3,.5,0,-.5,0,DK);
 var ldArm=new THREE.Mesh(U.mergeBufferGeometries(ar),ldMat);ldArm.position.set(ldGX+7.9,1.25,ldZ0);scene.add(ldArm);
 const fg=new THREE.PlaneGeometry(3.4,2.1);fg.translate(1.7,0,0);var ldFlag=new THREE.Mesh(ldPaint(fg,0x2f6b3a),ldMat2);ldFlag.position.set(ldGX-14,11.8,ldZ0-14);scene.add(ldFlag);
 var ldFlags=[];{const fd=[[0x2f6b3a,0xf2e24a,0x2f6b3a],[0x1d3f8a,0xf2f2f2,0x1d3f8a],[0xc62828,0xf2f2f2,0xc62828]];for(let i=0;i<3;i++){const a=[];for(let k=0;k<3;k++){const g=new THREE.PlaneGeometry(3.2,.66);g.translate(1.6,.66-k*.66,0);a.push(ldPaint(g,fd[i][k]))}const m=new THREE.Mesh(U.mergeBufferGeometries(a),ldMat2);m.position.set(14+i*8,9.3,ldZ0-27.5);m.castShadow=true;scene.add(m);ldFlags.push(m)}}
 // vehicles, helicopter, crates, soldiers
 ldVehicle('tank',64,ldZ0-22,Math.PI);ldVehicle('tank',-20,ldZ0-104,-Math.PI/2);ldVehicle('truck',114,ldZ0-22,Math.PI);ldVehicle('jeep',ldGX-11,ldZ0-24,Math.PI);ldVehicle('jeep',-79,ldZ0-14,Math.PI);
 if(typeof vhMakeHeli==='function'&&typeof vhHelis!=='undefined'){const m=vhMakeHeli(0x4b5a34);m.position.set(10,.2,ldZ0-122);m.rotation.y=.6;scene.add(m);const c={m:m,speed:0,steer:0,hp:160,vhT:'heli',vy:0,vhSpin:0,vhFloor:.2,vhEng:new THREE.Vector3(0,2.7,.4)};cars.push(c);vhHelis.push(c)}
 const pg=new THREE.BoxGeometry(1,1,1);for(const p of[[2,22,ldZ0-30],[2,-85,ldZ0-118],[4,114,ldZ0-40],[4,-79,ldZ0-36],[0,-8,ldZ0-134]]){const d=PK[p[0]],m=new THREE.Mesh(pg,new THREE.MeshStandardMaterial({color:d.col,emissive:d.col,emissiveIntensity:1.6,toneMapped:false}));m.position.set(p[1],1.2,p[2]);m.castShadow=true;scene.add(m);pickups.push({m:m,d:d,t:0})}
 const sol=(x,z,a,b,st)=>{const g=makePerson(0x4b5a34,0x3d4a2c,[0xf1c27d,0xc68642,0x8d5524][Math.floor(Math.random()*3)]);g.userData.rlType='sol';g.userData.rlTint=new THREE.Color(0xa9bf72);if(g.userData.gun)g.userData.gun.visible=true;g.position.set(x,.3,z);g.rotation.y=Math.PI;scene.add(g);
  const s={g:g,kind:'army',hp:4,cd:1+Math.random(),dead:false,aggro:false,home:new THREE.Vector3(x,.3,z),deadT:0,walkT:Math.random()*9,a:a||null,b:b||null,leg:0,stat:!!st};ldSold.push(s);shooters.push(s)};
 sol(ldGX-5.5,ldZ0-3);sol(ldGX+5.5,ldZ0-3);sol(-140,ldZ0-78,[-140,ldZ0-78],[-45,ldZ0-78]);sol(140,ldZ0-78,[140,ldZ0-78],[20,ldZ0-78]);sol(ldGX+3,ldZ0-20,[ldGX+3,ldZ0-20],[ldGX+3,ldZ0-130]);
 sol(-130,ldZ0-112,[-130,ldZ0-112],[-60,ldZ0-112]);sol(50,ldZ0-30,[50,ldZ0-30],[128,ldZ0-30]);sol(18,ldZ0-112)}
function ldSoldTick(dt){for(let i=0;i<ldSold.length;i++){const s=ldSold[i],g=s.g;
 if(s.dead){s.deadT+=dt;if(s.deadT<.35){g.rotation.x=-Math.min(1,s.deadT*3)*Math.PI/2;g.position.addScaledVector(s.fall,dt*4)}if(s.deadT>50&&g.position.distanceTo(pos)>110){s.dead=false;s.hp=4;s.aggro=false;g.rotation.x=0;g.position.copy(s.home)}continue}
 const dx=pos.x-g.position.x,dz=pos.z-g.position.z,d=Math.hypot(dx,dz)||1;let mv=0;s.aggro=state==='play'&&ldAlert>0&&d<80;
 if(s.aggro){g.rotation.y=Math.atan2(-dx,-dz);if(!s.stat){if(d>16){mv=4.6;g.position.x+=dx/d*mv*dt;g.position.z+=dz/d*mv*dt}else{const sd=Math.sin(T*1.3+i)*2;g.position.x+=-dz/d*sd*dt;g.position.z+=dx/d*sd*dt;mv=Math.abs(sd)}}s.cd-=dt;if(s.cd<=0&&d<46){s.cd=.8+Math.random()*.8;enemyShoot(s)}}
 else{const t=s.a?(s.leg?s.b:s.a):[s.home.x,s.home.z],hx=t[0]-g.position.x,hz=t[1]-g.position.z,hd=Math.hypot(hx,hz);if(hd<1.2){if(s.a)s.leg=1-s.leg}else{mv=1.7;g.position.x+=hx/hd*mv*dt;g.position.z+=hz/hd*mv*dt;g.rotation.y=Math.atan2(-hx,-hz)}}
 if(mv)collide(g.position,.45);s.walkT+=dt*mv*1.5;animLimbs(g,mv,s.walkT);if(s.aggro&&mv<1)g.userData.armR.rotation.x=Math.PI/2}}
{const st=shooterTick;shooterTick=function(dt){for(const s of ldSold){const i=shooters.indexOf(s);if(i>=0)shooters.splice(i,1)}st(dt);for(const s of ldSold)shooters.push(s);ldSoldTick(dt)}}
{const s0=shoot;shoot=function(){const c=driving;if(!c||!c.ldTank){s0();return}if(ldCan>0)return;ldCan=2.4;const m=c.m,o=new THREE.Vector3(m.position.x,m.position.y+2.65,m.position.z),tg=findTarget();let dir=null;
 if(tg){dir=tg.p.clone().sub(o);if(dir.length()>95||dir.length()<7)dir=null}if(!dir)dir=new THREE.Vector3(-Math.sin(camYaw),-.03,-Math.cos(camYaw));dir.normalize();
 m.userData.tur.rotation.y=Math.atan2(-dir.x,-dir.z)-m.rotation.y;o.addScaledVector(new THREE.Vector3(dir.x,0,dir.z).normalize(),6.2);fireRocket(o,dir);
 burst(o,10,0xffd27a,7,.5,.25);burst(o,8,0x777777,4,1,.9,.6);sfx(1.1,260,1);sfx(.3,1800,.6);shake=Math.max(shake,.6);c.speed-=2.5;flashLight.position.copy(o);flashLight.intensity=6}}
// ================= HILLS + SIGN (south) =================
const ldTX0=-340,ldTZ0=HALF+40,ldTS=4,ldTNX=161,ldTNZ=49,ldTH=new Float32Array(ldTNX*ldTNZ),ldSZ=HALF+94;
const ldRoad=[[-135,HALF-2],[-135,HALF+44],[-130,HALF+58],[-116,HALF+70],[-112,HALF+84],[-124,HALF+96],[-146,HALF+102],[-164,HALF+110],[-170,HALF+122]];
const ldPl=[{x:-170,z:HALF+122,r:21},{x:-90,z:HALF+84,r:18},{x:126,z:HALF+90,r:18},{x:-240,z:HALF+98,r:18},{x:112,z:HALF+166,r:23}];
function ldSm(t){t=t<0?0:(t>1?1:t);return t*t*(3-2*t)}
function ldH0(x,z){const t=ldSm((z-(HALF+46))/112),fx=ldSm((x+336)/70)*(1-ldSm((x-150)/66));if(t<=0||fx<=0)return 0;return t*fx*(43+14*Math.sin(x*.012+.8)+7*Math.sin(x*.031+2)+4*Math.sin(z*.05+x*.02)+1.6*Math.sin(x*.11)*Math.sin(z*.09))}
function ldNear(x,z){let bd=1e9,bx=0,bz=0;for(let i=0;i<ldRoad.length-1;i++){const a=ldRoad[i],b=ldRoad[i+1],vx=b[0]-a[0],vz=b[1]-a[1];let t=((x-a[0])*vx+(z-a[1])*vz)/(vx*vx+vz*vz);t=t<0?0:(t>1?1:t);const px=a[0]+vx*t,pz=a[1]+vz*t,d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;bx=px;bz=pz}}return [bd,bx,bz]}
function ldHc(x,z){let h=ldH0(x,z);const n=ldNear(x,z);if(n[0]<13)h+=(ldH0(n[1],n[2])-h)*(1-ldSm((n[0]-5)/8));for(const p of ldPl){const d=Math.hypot(x-p.x,z-p.z);if(d<p.r)h+=(p.h-h)*(1-ldSm((d-p.r*.62)/(p.r*.38)))}return h}
function ldHt(x,z){const fx=(x-ldTX0)/ldTS,fz=(z-ldTZ0)/ldTS;if(fx<0||fz<0||fx>=ldTNX-1||fz>=ldTNZ-1)return 0;const ix=Math.floor(fx),iz=Math.floor(fz),u=fx-ix,v=fz-iz,i=iz*ldTNX+ix,A=ldTH[i],B=ldTH[i+1],Cq=ldTH[i+ldTNX],D=ldTH[i+ldTNX+1];return u+v<=1?A+(B-A)*u+(Cq-A)*v:D+(Cq-D)*(1-u)+(B-D)*(1-v)}
function ldFloor(x,z){if(z>ldTZ0){const h=ldHt(x,z);return h>.02?h:-1}if(x>HALF+37&&x<HALF+96.6&&Math.abs(z-120)<2.2)return x<HALF+41?.3+(x-HALF-37)*.075:.6;return -1}
function ldLandOK(p){return (p.z<-HALF-10&&p.z>ldZ1-16&&Math.abs(p.x)<=186)||(p.z>HALF+10&&p.z<HALF+210&&p.x>-332&&p.x<302)}
function ldPalm(L,x,y,z,s,ph){let px=0,py=0;for(let k=0;k<5;k++){const t=.03+k*.035,g=new THREE.CylinderGeometry(.15*s,.2*s,1.85*s,6);g.rotateZ(-t);g.translate(px+Math.sin(t)*.9*s,py+Math.cos(t)*.9*s,0);g.rotateY(ph);g.translate(x,y,z);L.push(ldPaint(g,k%2?0x8a6b45:0x7a5c3a));px+=Math.sin(t)*1.8*s;py+=Math.cos(t)*1.8*s}
 for(let k=0;k<8;k++){const a=k*Math.PI/4,g=new THREE.BoxGeometry(.75*s,.06,3.3*s);g.translate(0,0,1.65*s);g.rotateX(.42);const g2=new THREE.BoxGeometry(.5*s,.06,1.7*s);g2.translate(0,0,.85*s);g2.rotateX(1.05);g2.translate(0,-Math.sin(.42)*3.3*s,Math.cos(.42)*3.3*s);
  for(const q of[g,g2]){q.rotateY(a);q.translate(px,py,0);q.rotateY(ph);q.translate(x,y,z);L.push(ldPaint(q,k%2?0x3f8f3a:0x2f7d32))}}}
{for(const p of ldPl)p.h=ldH0(p.x,p.z);for(let iz=0;iz<ldTNZ;iz++)for(let ix=0;ix<ldTNX;ix++)ldTH[iz*ldTNX+ix]=ldHc(ldTX0+ix*ldTS,ldTZ0+iz*ldTS);
 const n=ldTNX*ldTNZ,P=new Float32Array(n*3),Cc=new Float32Array(n*3),idx=[],c1=new THREE.Color(),c2=new THREE.Color(),c3=new THREE.Color();
 for(let iz=0;iz<ldTNZ;iz++)for(let ix=0;ix<ldTNX;ix++){const i=iz*ldTNX+ix,x=ldTX0+ix*ldTS,z=ldTZ0+iz*ldTS,h=ldTH[i];P[i*3]=x;P[i*3+1]=h+.03;P[i*3+2]=z;
  const k=.5+.5*Math.sin(x*.07+z*.05)*Math.cos(x*.03-z*.08),d=.5+.5*Math.sin(x*.19)*Math.sin(z*.23);c1.set(0x8f7f48).lerp(c2.set(0x5a6a33),k).lerp(c3.set(0x7a6240),d*.45);c2.set(0x4c9a47).lerp(c1,ldSm(h/7));Cc[i*3]=c2.r;Cc[i*3+1]=c2.g;Cc[i*3+2]=c2.b}
 for(let iz=0;iz<ldTNZ-1;iz++)for(let ix=0;ix<ldTNX-1;ix++){const a=iz*ldTNX+ix,b=a+1,c=a+ldTNX,d=c+1;if(ldTH[a]+ldTH[b]+ldTH[c]+ldTH[d]<.04)continue;idx.push(a,c,b,b,c,d)}
 const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(P,3));tg.setAttribute('color',new THREE.BufferAttribute(Cc,3));tg.setIndex(idx);tg.computeVertexNormals();
 const tm=new THREE.Mesh(tg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));tm.receiveShadow=true;scene.add(tm);
 // road ribbon
 const L=ldS,rp=[],rc=[];const quad=(a,b,c,d,col)=>{ldC.set(col);for(const v of[a,c,b,b,c,d]){rp.push(v[0],v[1],v[2]);rc.push(ldC.r,ldC.g,ldC.b)}};
 const pts=[];for(let i=0;i<ldRoad.length-1;i++){const a=ldRoad[i],b=ldRoad[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),m=Math.ceil(len/1.6);for(let k=0;k<m;k++)pts.push([a[0]+(b[0]-a[0])*k/m,a[1]+(b[1]-a[1])*k/m])}pts.push(ldRoad[ldRoad.length-1]);
 const edge=[],off=[-3.6,-1.8,0,1.8,3.6,-.16,.16];for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-2)],b=pts[Math.min(pts.length-1,i+2)],tx=b[0]-a[0],tz=b[1]-a[1],tl=Math.hypot(tx,tz)||1,nx=-tz/tl,nz=tx/tl,x=pts[i][0],z=pts[i][1];edge.push(off.map((o,k)=>[x+nx*o,ldHt(x+nx*o,z+nz*o)+(k>4?.2:.15),z+nz*o]))}
 for(let i=0;i<edge.length-1;i++){for(let k=0;k<4;k++)quad(edge[i][k+1],edge[i][k],edge[i+1][k+1],edge[i+1][k],0x33353a);if(i%4<2)quad(edge[i][6],edge[i][5],edge[i+1][6],edge[i+1][5],0xf4d03f)}
 const rg=new THREE.BufferGeometry(),nn=rp.length/3,rn=new Float32Array(nn*3),ru=new Float32Array(nn*2);for(let i=0;i<nn;i++)rn[i*3+1]=1;
 rg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(rp),3));rg.setAttribute('normal',new THREE.BufferAttribute(rn,3));rg.setAttribute('uv',new THREE.BufferAttribute(ru,2));rg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(rc),3));rg.computeVertexNormals();L.push(rg);
 // viewpoint
 {const p=ldPl[0],h=p.h;ldCy(L,15,15.6,.3,28,p.x,h+.12,p.z,0x4a4c50);for(let k=0;k<11;k++){const a=Math.PI*(1.12+k*.076),x=p.x+Math.cos(a)*14.2,z=p.z+Math.sin(a)*14.2;ldB(L,.22,1.2,.22,x,h+.85,z,0xc9ccd0);ldB(L,4.4,.14,.14,x,h+1.4,z,0xc9ccd0,-a+Math.PI/2)}
  for(const s of[-1,1]){ldB(L,.35,1.3,.35,p.x+s*4,h+.9,p.z-11.5,0x55585d);ldB(L,.55,.4,.9,p.x+s*4,h+1.7,p.z-11.7,0x2c2e31);ldB(L,3,.2,.9,p.x+s*8,h+.75,p.z+6,0x7a5c3a);ldB(L,3,.7,.15,p.x+s*8,h+1.1,p.z+6.4,0x7a5c3a)}}
 // mansions
 for(let i=1;i<4;i++){const p=ldPl[i],x=p.x,z=p.z,h=p.h,W=[0xf2ede2,0xf7e9d6,0xe9eef0][i-1];ldB(L,15,5,9,x,h+2.5,z+2,W);ldB(L,8,3.6,7,x-2.5,h+6.8,z+2.5,W);ldB(L,15.8,.4,9.8,x,h+5.2,z+2,0xa5482f);ldB(L,8.8,.4,7.8,x-2.5,h+8.8,z+2.5,0xa5482f);
  ldB(L,9,2.6,.15,x+1,h+2.3,z-2.55,0x22364a);ldB(L,5,2,.15,x-2.5,h+6.8,z-1.05,0x22364a);ldB(L,12.5,.2,7.4,x+1,h+.12,z-7.4,0xd9d4c4);ldB(L,9,.3,4.5,x+1,h+.16,z-7.4,0x2fa8d8);
  for(const s of[-1,1]){ldCy(L,.25,.25,5,8,x+s*6.6,h+2.5,z-2.9,0xffffff);ldCy(L,0,.9,6,7,x+s*10.5,h+3,z+4,0x2f5a33);ldCy(L,0,.8,5,7,x+s*10.5,h+2.5,z-1,0x2f5a33)}ldSol(x-7.5,x+7.5,z-2.5,z+6.5,h+9.5)}
 // observatory
 {const p=ldPl[4],x=p.x,z=p.z,h=p.h;ldCy(L,9,9.5,6,20,x,h+3,z,0xf0ede6);const d=new THREE.SphereGeometry(8.2,18,8,0,Math.PI*2,0,Math.PI/2);d.translate(x,h+6,z);L.push(ldPaint(d,0xcfd6d2));ldB(L,1.6,6,.3,x,h+10.2,z-6.4,0x2c3238,0,-.75);
  for(const s of[-1,1]){ldB(L,11,4.6,7,x+s*13.5,h+2.3,z,0xf0ede6);const e=new THREE.SphereGeometry(3,12,6,0,Math.PI*2,0,Math.PI/2);e.translate(x+s*16,h+4.6,z);L.push(ldPaint(e,0xcfd6d2));ldSol(x+s*13.5-5.5,x+s*13.5+5.5,z-3.5,z+3.5,h+8)}ldB(L,8,.5,5,x,h+.25,z-11,0xd9d4c4);ldSol(x-9,x+9,z-9,z+9,h+14.5)}
 // scrub
 const bc=[0x5f6f3a,0x74803f,0x8a8a4a,0x4f6b35,0x9a8b55];for(let k=0;k<150;k++){const x=-325+ldR()*535,z=HALF+52+ldR()*172,h=ldHt(x,z);if(h<2||ldNear(x,z)[0]<7||(Math.abs(z-ldSZ)<7&&x>-60&&x<80))continue;let ok=true;for(const p of ldPl)if(Math.hypot(x-p.x,z-p.z)<p.r+1)ok=false;if(!ok)continue;
  const s=1.1+ldR()*1.9,g=new THREE.IcosahedronGeometry(1,0);g.scale(s,s*.7,s);g.translate(x,h+s*.3,z);L.push(ldPaint(g,bc[k%5]))}
 // the sign
 const SG=[],word='BLOCKCITY';for(let i=0;i<word.length;i++){const X=70-i*13-(i>4?6:0),cx=X-5,th=ldHt(cx,ldSZ),top=th+17;ldGlyph(SG,word[i],X,top,ldSZ,-1,0,2,1.4,0xffffff);for(const s of[-3,3]){ldB(L,.5,17,.5,cx+s,th+8.5,ldSZ+1.1,0x8a8d90);ldB(L,.4,.4,5,cx+s,th+9,ldSZ+3.4,0x8a8d90,0,.7)}
  ldB(ldE,1.2,.5,.8,cx,ldHt(cx,ldSZ-4)+.5,ldSZ-4,0xfff1c9);ldSol(X-10,X,ldSZ-.7,ldSZ+.7,top)}
 var ldSign=new THREE.Mesh(U.mergeBufferGeometries(SG),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.75,emissive:0xffffff,emissiveIntensity:0}));ldSign.castShadow=true;scene.add(ldSign);
 // drive-in (flat south-east corner)
 {const x=258,z=HALF+50;ldB(L,66,.08,64,x,.03,z+33,0x6b665c);for(const s of[-1,1])ldB(L,.8,19,.8,x+s*13,9.5,z+.6,0x55585d);ldB(L,31,15,.6,x,11.5,z+.3,0x3a3d42);ldSol(x-15.5,x+15.5,z,z+1,19);
  ldText(ldE,'BLOCK',x+8.2,17.6,z-.05,-1,0,.55,.12,0xff5fa8);ldText(ldE,'DRIVE-IN',x+13.1,12.4,z-.05,-1,0,.55,.12,0x5fe0ff);
  for(let r=0;r<4;r++)for(let k=0;k<8;k++){ldB(L,.15,1.3,.15,x-26.2+k*7.5,.65,z+16+r*12,0x8a8d90);ldB(L,.4,.3,.3,x-26.2+k*7.5,1.4,z+16+r*12,0x2c2e31)}
  ldB(L,5,3.5,4,x,1.75,z+60,0xd9c2a5);ldB(L,5.8,.3,4.8,x,3.6,z+60,0xa5482f);ldSol(x-2.5,x+2.5,z+58,z+62,3.7);
  var ldScreen=new THREE.Mesh(new THREE.PlaneGeometry(29,13),new THREE.MeshBasicMaterial({color:0xdddddd,toneMapped:false}));ldScreen.position.set(x,11.5,z+.62);scene.add(ldScreen)}
 for(let k=0;k<7;k++)ldPalm(L,226+k*11,0,HALF+47+(k%2)*3,1.25+ldR()*.3,ldR()*6);
 ldMesh(L,ldMat,true)}
// ================= DISTRICT DRESSING =================
{const L=ldD,BX=roadCenter(8),WOOD=0x8a6b45;
 for(let j=0;j<N;j++){const z0=roadCenter(j)+9,z1=roadCenter(j+1)-9;ldB(L,1.5,.26,z1-z0,BX,.13,(z0+z1)/2,0xb8b3a6);for(let k=0;k<3;k++){const z=z0+6+k*12;ldPalm(L,BX,.2,z,1.05+ldR()*.25,ldR()*6);solids.push({minX:BX-.35,maxX:BX+.35,minZ:z-.35,maxZ:z+.35,h:3})}}
 const st=new THREE.Shape();for(let k=0;k<10;k++){const a=k*Math.PI/5,r=k%2?.34:.85,x=Math.sin(a)*r,y=Math.cos(a)*r;if(k)st.lineTo(x,y);else st.moveTo(x,y)}const sg=new THREE.ShapeGeometry(st);sg.rotateX(-Math.PI/2);
 for(let j=3;j<=7;j++){const cz=roadCenter(j)+CELL/2;ldB(L,2.3,.03,38,BX+8.3,.315,cz,0x2a2a2e);for(let k=0;k<12;k++){const g=sg.clone();g.translate(BX+8.3,.34,cz-17.6+k*3.2);L.push(ldPaint(g,k%3?0xe89aa6:0xd9b45a))}}
 // marina
 ldB(L,59.5,.3,4.2,HALF+66.5,.45,120,WOOD);ldB(L,4.2,.3,4.2,HALF+39,.33,120,WOOD,0,0,.07);for(let x=HALF+42;x<HALF+97;x+=9)for(const s of[-1,1])ldCy(L,.25,.25,2.6,6,x,.1,120+s*2.2,0x5d4630);
 for(const fx of[HALF+58,HALF+72,HALF+86])for(const s of[-1,1])ldB(L,2.2,.25,13,fx,.42,120+s*8.5,WOOD);
 for(const y of[[HALF+65,1],[HALF+79,1],[HALF+65,-1],[HALF+79,-1],[HALF+92.5,1]]){const x=y[0],d=y[1],z=120+d*9.5,HU=0xf6f6f2;ldB(L,3.8,1.5,10,x,.75,z,HU);ldB(L,2.69,1.5,2.69,x,.75,z+d*5,HU,Math.PI/4);ldB(L,3.86,.25,10.05,x,.5,z,0x1d3557);ldB(L,3.5,.1,9.6,x,1.52,z,0xc9a36b);
  ldB(L,3,1.2,4.6,x,2.15,z-d*.6,0xffffff);ldB(L,3.06,.45,4.2,x,2.3,z-d*.6,0x1b2b3c);ldB(L,2.4,.8,2.4,x,3.15,z-d*1.2,0xffffff);ldCy(L,.06,.06,3,5,x,4.9,z-d*1.2,0xb9bdc2)}
 for(let x=HALF+44;x<HALF+97;x+=13){ldB(L,.15,2.6,.15,x,1.9,121.9,0x55585d);ldB(ldE,.4,.3,.4,x,3.3,121.9,0xffe9b0)}
 // ferris wheel
 const FX=HALF+22,FZ=-66,FH=16.5;ldB(L,14,.5,8,FX,.25,FZ,0x7a7c80);for(const s of[-1,1])for(const q of[-1,1])ldB(L,.5,17.9,.5,FX+s*1.9,8.25,FZ+q*3.5,0xe9e9ee,0,-q*.401);ldCy(L,.8,.8,4.6,10,FX,FH,FZ,0xdd3344,0,Math.PI/2);ldB(L,3,3,3,FX-4,2,FZ+8,0xf7b7c5);ldB(L,3.6,.3,3.6,FX-4,3.6,FZ+8,0x8fd8e8);ldSol(FX-7,FX+7,FZ-4,FZ+4,1);
 const wl=[],we=[],gc=[0xff5fa8,0x5fe0ff,0xffd23f,0x80ff9a,0xc9b6f2,0xff8a4c];for(const s of[-1,1]){const t=new THREE.TorusGeometry(14,.2,6,44);t.rotateY(Math.PI/2);t.translate(s*1.2,0,0);wl.push(ldPaint(t,0xf2f2f5));for(let k=0;k<12;k++){const g=new THREE.BoxGeometry(.16,14,.16);g.translate(0,7,0);g.rotateX(k*Math.PI/6);g.translate(s*1.2,0,0);wl.push(ldPaint(g,0xe2e4ea))}}
 for(let k=0;k<12;k++){const a=k*Math.PI/6,y=Math.cos(a)*14,z=Math.sin(a)*14;const g=new THREE.SphereGeometry(1.05,8,6);g.translate(0,y,z);wl.push(ldPaint(g,gc[k%6]));ldB(wl,2.4,.14,.14,0,y,z,0xe2e4ea);for(const s of[-1,1])for(const o of[0,.26]){const b=a+o;ldB(we,.3,.3,.3,s*1.45,Math.cos(b)*14,Math.sin(b)*14,gc[(k+(o?3:0))%6])}}
 var ldWheel=new THREE.Mesh(U.mergeBufferGeometries(wl),ldMat);ldWheel.position.set(FX,FH,FZ);ldWheel.castShadow=true;scene.add(ldWheel);ldWheel.add(new THREE.Mesh(U.mergeBufferGeometries(we),ldEm));
 // hotel blade signs on the beach road
 const names=['OCEAN','PALMS','DECO','TIDES','CORAL','WAVE','SANDS','STAR','MIAMI'],pc=[0xf7b7c5,0xa8e6cf,0x8fd8e8,0xffd3a5,0xc9b6f2],nc=[0xff5fa8,0x5fe0ff,0xffd23f,0x80ff9a];
 const cand=solids.filter(s=>s.h>9&&s.h<36&&s.maxX-s.minX>9&&s.minX>roadCenter(10)&&s.maxX<roadCenter(11)).sort((a,b)=>a.minZ-b.minZ);let ni=0;
 for(let k=0;k<cand.length&&ni<names.length;k+=2){const s=cand[k],zc=(s.minZ+s.maxZ)/2,top=s.h+2.6,nm=names[ni];ldB(L,1,nm.length*1.55+1.4,1.6,s.maxX+.5,top-(nm.length*1.55+1.4)/2,zc,pc[ni%5]);ldB(L,1.3,.4,2,s.maxX+.5,top+.2,zc,0xffffff);
  for(let i=0;i<nm.length;i++)ldGlyph(ldE,nm[i],s.maxX+1.03,top-.6-i*1.55,zc+.5,0,-1,.2,.08,nc[ni%4]);ldB(ldE,.1,.12,1.7,s.maxX+1.03,top-.25,zc,nc[(ni+1)%4]);ni++}
 ldMesh(L,ldMat,true);ldMesh(ldE,ldEm,false)}
// ================= collision + bounds =================
{const c0=collide;collide=function(p,r,maxH){const ox=p.x,oz=p.z,res=c0(p,r,maxH);if(res)return res;const L=HALF+50;
 if(oz<-L&&Math.abs(ox)<=186){p.z=Math.max(oz,ldZ1-14);p.x=Math.max(-185,Math.min(185,ox))}
 else if(oz>L&&ox>-332&&ox<302){p.z=Math.min(oz,HALF+208);p.x=Math.max(-331,Math.min(301,ox))}
 else if(ox>L-.01&&ox<HALF+96.6&&Math.abs(oz-120)<2.3)p.x=Math.min(ox,HALF+96.2);
 if(p.x>HALF+47&&p.x<HALF+97&&Math.abs(p.z-120)<2.6)p.z=Math.max(118.2,Math.min(121.8,p.z));return res}}
if(typeof fxBounds==='function'){const b0=fxBounds;fxBounds=function(c,m){if(ldLandOK(m.position))return;b0(c,m)}}
function ldLate(){if(typeof fxChOpen!=='undefined'&&fxChOpen&&!driving){const f=ldFloor(pos.x,pos.z);if(f>0&&pos.y-f<10){fxChOpen=false;if(typeof fxChute!=='undefined')fxChute.visible=false}}}
// ================= per-frame =================
function ldTick(dt){if(!ldLateOn){ldLateOn=true;MODS.push(ldLate)}
 const night=1-Math.max(0,Math.min(1,Math.sin(dayT*Math.PI*2)*3+.5));ldEm.color.setScalar(.4+night*1.5);ldSignMat.emissiveIntensity=.12+night*.35;ldSign.material.emissiveIntensity=.3+night*.3;
 for(const b of ldBeams){b.g.visible=night>.4;if(b.g.visible)b.g.rotation.y=b.base+Math.sin(T*.35+b.ph)*1.1}
 ldRadar.rotation.y+=dt*.8;ldFlag.rotation.y=.5+Math.sin(T*2.2)*.3;for(let i=0;i<ldFlags.length;i++)ldFlags[i].rotation.y=.5+Math.sin(T*2.2+i*1.3)*.3;ldWheel.rotation.x+=dt*.12;
 const fl=.5+.5*Math.sin(T*7.3)*Math.sin(T*3.1);ldScreen.material.color.setRGB(.35+night*(.5+fl*.9),.38+night*(.6+fl*.7),.42+night*(.9+fl*.5));
 const gd=Math.hypot(pos.x-ldGX,pos.z-ldZ0);ldArm.rotation.z+=((gd<26?-1.3:0)-ldArm.rotation.z)*Math.min(1,dt*2.5);
 // restricted area
 if(state==='play'&&pos.x>ldX0&&pos.x<ldX1&&pos.z<ldZ0&&pos.z>ldZ1&&pos.y<70){if(ldAlert<=0){toast('RESTRICTED AREA!');beep(220,.4,.2)}ldAlert=25;if(wantedScore<10)wantedScore=10}else if(ldAlert>0)ldAlert-=dt;
 // tanks
 ldCan-=dt;const c=driving;if(c&&c.ldTank)$('wpn').innerHTML='<div>CANNON<br><small>'+(ldCan>0?'...':'READY')+'</small></div>';for(const t of ldTanks){const tu=t.m.userData.tur,da=(((t===c?camYaw-t.m.rotation.y:0)-tu.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;tu.rotation.y+=da*Math.min(1,dt*4)}
 if(c&&c.ldTank&&!c.dead){const p=c.m.position,h0=c.hp;
  for(const o of cars.slice()){if(o===c||o.vhT||o.custom||o.ldTank)continue;if(o.m.position.distanceTo(p)<4.5){if(!o.dead)blowParked(o);const i=cars.indexOf(o);if(i>=0)cars.splice(i,1);o.m.scale.y*=.3;ldDebris.push({m:o.m,t:40})}}
  for(const t of traffic)if(t.m.position.distanceTo(p)<4.6){if(!t.dead)blowCar(t);t.m.position.y=-60}
  for(const pc of police)if(!pc.dead&&!pc.gone&&pc.m.position.distanceTo(p)<4.6){blowPolice(pc);pc.m.scale.y=.3}
  if(c.hp<h0)c.hp=h0}
 for(let i=ldDebris.length-1;i>=0;i--){const d=ldDebris[i];d.t-=dt;if(d.t<=0&&d.m.position.distanceTo(pos)>60){scene.remove(d.m);ldDebris.splice(i,1)}}
 // ground height on the hills and the marina dock
 if(!driving){const f=ldFloor(pos.x,pos.z);if(f>0){const ty=Math.max(.3,f+.04);if(vel.y<=30*dt+.001&&(pos.y<=ty+.12||(onGround&&pos.y<=ty+.8))){pos.y=ty;vel.y=state==='play'?30*dt:0;onGround=true}}}
 for(const o of cars){if(o.custom||o.vhT)continue;const m=o.m,f=ldFloor(m.position.x,m.position.z);
  if(f>0){m.position.y=f;if(!m.userData.ldUp){m.userData.ldUp=1;if(!o.vhBike)m.rotation.order='YXZ'}
   if(o===driving&&!o.vhBike){const a=m.rotation.y,ax=-Math.sin(a)*2.2,az=-Math.cos(a)*2.2,hf=Math.max(0,ldFloor(m.position.x+ax,m.position.z+az)),hb=Math.max(0,ldFloor(m.position.x-ax,m.position.z-az));m.rotation.x+=(Math.atan2(hf-hb,4.4)-m.rotation.x)*Math.min(1,dt*8)}}
  else if(m.userData.ldUp){m.position.y=0;if(!o.vhBike)m.rotation.x=0;m.userData.ldUp=0}}
 for(const pc of police){const m=pc.m,f=ldFloor(m.position.x,m.position.z);if(f>0){m.position.y=f;m.userData.ldUp=1}else if(m.userData.ldUp){m.position.y=0;m.userData.ldUp=0}}
 for(const s of shooters){const g=s.g,f=ldFloor(g.position.x,g.position.z);if(f>0){g.position.y=Math.max(.3,f+.04);g.userData.ldUp=1}else if(g.userData.ldUp){g.position.y=.3;g.userData.ldUp=0}}}
MODS.push(ldTick);

// ---------- isles: city-themed islands east of the mainland, bridges, and many more vehicle types ----------
// Island names are original. Themes: beach resort (art-deco strip), dense tower grid with a central park, neon casino strip, neon lane district with a lattice tower, cliff-and-canal village, cargo port, volcano.
const isGY=.35;
const isRX=HALF+250,isRZ=-40,isRA=110,isRB=130;          // Coral Key (resort)
const isMX=HALF+500,isMZ=-40,isMA=80,isMB=130;           // Metro Isle (tower grid)
const isSX=HALF+500,isSZ=330,isSA=90,isSB=70;            // Lucky Sands (casino strip)
const isHX=HALF+560,isHZ=-330,isHA=70,isHB=80;           // Hikari (neon lanes)
const isLX=HALF+176,isLZ=620,isLR=48;                    // Porto Luna (cliff village)
const isPX=HALF+230,isPZ=300,isPA=88,isPB=80;            // Port Ironside
const isWX=HALF+330,isWZ=-360,isWR=96;                   // Ember Isle (volcano)
const isIslets=[[HALF+126,190,13],[HALF+415,130,11],[HALF+150,-262,12],[HALF+640,150,9],[HALF+120,430,10]],isPlat=[HALF+450,205];
const isBZ=roadCenter(3);
const isBr=[{ax:'x',c:isBZ,lo:HALF+8,hi:HALF+200,h:7,r0:38,r1:32,g0:0,g1:isGY,w:10.6,st:'susp',name:'Sunrise Bridge'},
 {ax:'x',c:isRZ-14,lo:HALF+346,hi:HALF+432,h:6,r0:12,r1:12,g0:isGY,g1:isGY,w:10.6,st:'stone',name:'Harbor Span'},
 {ax:'x',c:isSZ,lo:HALF+308,hi:HALF+420,h:2.4,r0:10,r1:10,g0:isGY,g1:isGY,w:10.6,st:'cause',name:'Sands Causeway'},
 {ax:'z',c:HALF+542,lo:-262,hi:-158,h:5,r0:10,r1:10,g0:isGY,g1:isGY,w:10.6,st:'truss',name:'Lantern Bridge'}];
function isSm(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
function isWildH(x,z){const d=Math.hypot(x-isWX,z-isWZ);if(d>isWR)return -1;const e=isSm((isWR-d)/20),dp=Math.hypot(x-isWX-20,z-isWZ+16);let pk=Math.pow(Math.max(0,1-dp/62),1.7)*42;if(dp<8)pk-=(8-dp)*1.1;
 let b=1.6+1.4*Math.sin(x*.09)*Math.cos(z*.11)+.8*Math.sin(x*.21+z*.17);const fx=Math.abs(x-isWX+18),fz=Math.abs(z-isWZ-58);const fl=isSm((fx-34)/8)+isSm((fz-7)/5);b*=Math.min(1,fl);pk*=Math.min(1,fl+isSm((dp-30)/20));return isGY+e*Math.max(0,pk+Math.max(0,b))}
function isBrH(B,along){if(along<B.lo||along>B.hi)return -1;if(along<B.lo+B.r0)return B.g0+(B.h-B.g0)*isSm((along-B.lo)/B.r0);if(along>B.hi-B.r1)return B.g1+(B.h-B.g1)*isSm((B.hi-along)/B.r1);return B.h}
function isBridgeH(x,z){let h=-1;for(const B of isBr){const a=B.ax==='x'?x:z,c=B.ax==='x'?z:x;if(Math.abs(c-B.c)>B.w/2)continue;h=Math.max(h,isBrH(B,a))}return h}
function isOnBridge(x,z){for(const B of isBr){const a=B.ax==='x'?x:z,c=B.ax==='x'?z:x;if(a>=B.lo&&a<=B.hi&&Math.abs(c-B.c)<B.w/2+3)return B}return null}
function isIsleH(x,z){if(x<HALF+60)return -1;const a=(x-isRX)/isRA,b=(z-isRZ)/isRB;if(a*a+b*b<=1)return isGY;
 if(Math.abs(x-isMX)<=isMA&&Math.abs(z-isMZ)<=isMB)return isGY;if(Math.abs(x-isSX)<=isSA&&Math.abs(z-isSZ)<=isSB)return isGY;if(Math.abs(x-isHX)<=isHA&&Math.abs(z-isHZ)<=isHB)return isGY;
 if(Math.abs(x-isPX)<=isPA&&Math.abs(z-isPZ)<=isPB)return isGY;if(Math.hypot(x-isLX,z-isLZ)<=isLR)return isGY;const w=isWildH(x,z);if(w>=0)return w;
 for(const q of isIslets)if(Math.hypot(x-q[0],z-q[1])<q[2])return isGY;return -1}
function isLandAt(x,z){return Math.max(isBridgeH(x,z),isIsleH(x,z))}
function isNearShore(x,z){if(x<HALF+56)return {x:HALF+44,z:z};for(let r=3;r<=14;r+=2.75)for(let k=0;k<16;k++){const a=k*Math.PI/8,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;if(isIsleH(px,pz)>=0&&isIsleH(x+Math.cos(a)*(r+2),z+Math.sin(a)*(r+2))>=0)return {x:x+Math.cos(a)*(r+2),z:z+Math.sin(a)*(r+2)}}return null}
// shapes for the map module (land colour fill), see report
const isMapShapes=[{k:'e',x:isRX,z:isRZ,a:isRA,b:isRB,c:'#e6d6a0'},{k:'r',x:isMX,z:isMZ,a:isMA,b:isMB,c:'#9a9ea3'},{k:'r',x:isSX,z:isSZ,a:isSA,b:isSB,c:'#d9c28f'},{k:'r',x:isHX,z:isHZ,a:isHA,b:isHB,c:'#8f9399'},
 {k:'r',x:isPX,z:isPZ,a:isPA,b:isPB,c:'#7d8085'},{k:'c',x:isLX,z:isLZ,a:isLR,b:isLR,c:'#d8c39a'},{k:'c',x:isWX,z:isWZ,a:isWR,b:isWR,c:'#3f7d3e'}];
for(const q of isIslets)isMapShapes.push({k:'c',x:q[0],z:q[1],a:q[2],b:q[2],c:'#e6d6a0'});
for(const B of isBr)isMapShapes.push(B.ax==='x'?{k:'b',x0:B.lo,z0:B.c,x1:B.hi,z1:B.c,w:B.w,c:'#55585d'}:{k:'b',x0:B.c,z0:B.lo,x1:B.c,z1:B.hi,w:B.w,c:'#55585d'});
// ----- geometry helpers: static scenery is baked into a few merged meshes per island -----
const isCol=new THREE.Color();
function isG(geo,hex,x,y,z,ry,rx,rz){let g=geo.index?geo.toNonIndexed():geo;if(g.attributes.uv)g.deleteAttribute('uv');if(rx)g.rotateX(rx);if(rz)g.rotateZ(rz);if(ry)g.rotateY(ry);g.translate(x||0,y||0,z||0);isCol.set(hex);const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=isCol.r;a[i*3+1]=isCol.g;a[i*3+2]=isCol.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
const isB=(w,h,d,hex,x,y,z,ry,rx,rz)=>isG(new THREE.BoxGeometry(w,h,d),hex,x,y,z,ry,rx,rz);
const isCy=(r1,r2,h,n,hex,x,y,z,ry,rx,rz)=>isG(new THREE.CylinderGeometry(r1,r2,h,n),hex,x,y,z,ry,rx,rz);
const isMatV=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:.05}),isMatGlow=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});
const isWT=canvasTex(128,128,g=>{g.fillStyle='#ececec';g.fillRect(0,0,128,128);for(let r=0;r<4;r++)for(let c=0;c<4;c++){g.fillStyle='#2a3440';g.fillRect(6+c*32,6+r*32,20,22);const gr=g.createLinearGradient(0,8+r*32,0,26+r*32);gr.addColorStop(0,'#a9c0d2');gr.addColorStop(1,'#3e5468');g.fillStyle=gr;g.fillRect(8+c*32,8+r*32,16,18)}g.fillStyle='rgba(0,0,0,.16)';for(let r=0;r<4;r++)g.fillRect(0,30+r*32,128,2)});
const isWE=canvasTex(128,128,g=>{g.fillStyle='#000';g.fillRect(0,0,128,128);const cols=['#ffd9a0','#bfe0ff','#fff3c8'];for(let r=0;r<4;r++)for(let c=0;c<4;c++)if((r*5+c*3+r*c)%3!==0){g.fillStyle=cols[(r+c)%3];g.globalAlpha=.55+((r*7+c)%4)*.12;g.fillRect(8+c*32,8+r*32,16,18);g.globalAlpha=1}});
const isTwMat=new THREE.MeshStandardMaterial({map:isWT,emissiveMap:isWE,emissive:0xffffff,emissiveIntensity:0,vertexColors:true,roughness:.45,metalness:.2});winMats.push(isTwMat);
const isSol=[],isGroups=[];let isDraws=0;
function isSolid(x0,x1,z0,z1,h){const s={minX:x0,maxX:x1,minZ:z0,maxZ:z1,h:h};isSol.push(s);solids.push(s);return s}
function isMesh(list,mat,grp,shadow){if(!list.length)return null;const m=new THREE.Mesh(U.mergeBufferGeometries(list),mat||isMatV);m.castShadow=!!shadow;m.receiveShadow=true;grp.add(m);isDraws++;return m}
function isGroup(name,x,z,r){const g=new THREE.Group();g.name=name;g.userData.c=[x,z,r];scene.add(g);isGroups.push(g);return g}
function isTw(list,x,z,w,d,h,hex,y0,noSolid){y0=y0===undefined?isGY:y0;const g=new THREE.BoxGeometry(w,h,d).toNonIndexed(),uv=g.attributes.uv,n=uv.count,ou=Math.floor(Math.random()*4)*.25,ov=Math.floor(Math.random()*4)*.25;
 for(let i=0;i<n;i++){const f=Math.floor(i/6);if(f===2||f===3){uv.setXY(i,.01,.01);continue}const sp=f<2?d:w;uv.setXY(i,uv.getX(i)*sp/12+ou,uv.getY(i)*h/12+ov)}
 g.translate(x,y0+h/2,z);isCol.set(hex);const a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=isCol.r;a[i*3+1]=isCol.g;a[i*3+2]=isCol.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));list.push(g);if(!noSolid)isSolid(x-w/2,x+w/2,z-d/2,z+d/2,y0+h);return g}
// palms (one instanced mesh for every island) and simple round trees
const isPalmGeo=(()=>{const a=[isCy(.16,.26,6.4,6,0x7a5a36,0,3.2,0,0,0,.06)];for(let k=0;k<7;k++){const an=k*Math.PI*2/7;a.push(isB(.9,.08,3.4,0x2f8f3a,Math.sin(an)*1.6,6.2,Math.cos(an)*1.6,an,.38))}a.push(isG(new THREE.IcosahedronGeometry(.35,0),0x5b3d1e,0,6.2,0));return U.mergeBufferGeometries(a)})();
const isPalmAt=[];function isPalm(x,z,y,s){isPalmAt.push([x,y===undefined?isGY:y,z,s||(.85+Math.random()*.5)])}
function isTree(L,x,z,s,y){s=s||1;y=y===undefined?isGY:y;L.push(isCy(.16*s,.24*s,2.6*s,6,0x6b4a2a,x,y+1.3*s,z),isG(new THREE.IcosahedronGeometry(1.7*s,1),[0x3a8f3a,0x2f7d32,0x4a9a3f][Math.floor(Math.abs(x*7+z*3))%3],x,y+3.5*s,z))}
const isFx={jets:null,beams:[],flick:[]};
// ===== bridges =====
for(const B of isBr){const g=isGroup(B.name,B.ax==='x'?(B.lo+B.hi)/2:B.c,B.ax==='x'?B.c:(B.lo+B.hi)/2,(B.hi-B.lo)/2+20),L=[],N=[];
 const deckC=B.st==='susp'?0xc8452f:B.st==='stone'?0x9c8f7a:B.st==='truss'?0x3d6b8a:0x8d9299;
 const seg=(a0,a1)=>{const y0=isBrH(B,a0),y1=isBrH(B,a1),len=Math.hypot(a1-a0,y1-y0),an=Math.atan2(y1-y0,a1-a0),m=(a0+a1)/2,ym=(y0+y1)/2;
  L.push(isB(len+.3,.5,B.w,0x34373c,m,ym-.26,0,0,0,an),isB(len+.3,.06,.3,0xf4d03f,m,ym+.02,0,0,0,an));for(const s of[-B.w/2+.1,B.w/2-.1])L.push(isB(len+.3,1,.25,0xb9bec6,m,ym+.5,s,0,0,an))};
 for(let a=B.lo;a<B.hi-.01;a+=6.3)seg(a,Math.min(B.hi,a+6.3));
 const span0=B.lo+B.r0,span1=B.hi-B.r1;
 for(let a=span0;a<=span1;a+=(B.st==='cause'?14:24))for(const s of[-3.4,3.4])L.push(isCy(.7,.9,B.h+1,8,0x8d9299,a,(B.h-1)/2,s));
 const lampsEvery=B.st==='cause'?14:18;for(let a=span0+4;a<span1;a+=lampsEvery){L.push(isB(.2,4.5,.2,0x30343a,a,B.h+2.2,-B.w/2+.4));N.push(isB(.9,.25,.5,0xfff0c0,a,B.h+4.4,-B.w/2+.8))}
 const towers=[];
 if(B.st==='susp'||B.st==='stone'){const t1=span0+(B.st==='susp'?26:12),t2=span1-(B.st==='susp'?26:12),TH=B.st==='susp'?34:24;towers.push(t1,t2);
  for(const tx of[t1,t2]){if(B.st==='susp'){for(const s of[-6,6])L.push(isB(2.2,TH,2.2,deckC,tx,TH/2-2,s));L.push(isB(2,1.6,14,deckC,tx,TH-3,0),isB(2,1.2,14,deckC,tx,TH*.55,0))}
   else{for(const s of[-5.3,5.3])L.push(isB(4,TH,3.6,deckC,tx,TH/2-2,s));L.push(isB(4,4,14.2,deckC,tx,TH-3,0),isB(4.2,1.2,15,0x8a7d68,tx,TH-.6,0),isCy(1.6,1.6,4.1,10,deckC,tx,TH-5.8,0,0,0,Math.PI/2));for(const s of[-5.3,5.3])L.push(isCy(.2,1.9,2.4,4,0x8a7d68,tx,TH+1,s,Math.PI/4))}
   N.push(isB(.5,.5,.5,0xff3030,tx,TH+.2,-5),isB(.5,.5,.5,0xff3030,tx,TH+.2,5))}
  const top=TH-1.8,cab=(a0,y0,a1,y1)=>{const len=Math.hypot(a1-a0,y1-y0),an=Math.atan2(y1-y0,a1-a0);for(const s of[-5.6,5.6])L.push(isB(len,.22,.22,0xd9dde3,(a0+a1)/2,(y0+y1)/2,s,0,0,an))};
  const n=8;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,y=u=>B.h+1.2+(top-B.h-1.2)*Math.pow(2*u-1,2);cab(t1+(t2-t1)*u0,y(u0),t1+(t2-t1)*u1,y(u1));if(i>0)for(const s of[-5.6,5.6])L.push(isB(.12,y(u0)-B.h,.12,0xd9dde3,t1+(t2-t1)*u0,(y(u0)+B.h)/2,s))}
  cab(span0-4,isBrH(B,span0-4)+1.2,t1,top);cab(t2,top,span1+4,isBrH(B,span1+4)+1.2)}
 if(B.st==='truss'){for(let a=span0;a<span1;a+=8){for(const s of[-5.4,5.4]){L.push(isB(8.2,.35,.35,deckC,a+4,B.h+6,s),isB(.35,6,.35,deckC,a,B.h+3,s),isB(Math.hypot(8,6),.3,.3,deckC,a+4,B.h+3,s,0,0,Math.atan2(6,8)*((Math.round(a/8)%2)?1:-1)))}L.push(isB(.35,.35,11,deckC,a,B.h+6,0))}}
 for(const q of[L,N])for(const geo of q){if(B.ax==='z'){geo.rotateY(-Math.PI/2);geo.translate(B.c,0,0)}else geo.translate(0,0,B.c)}
 for(const tx of towers)for(const s of[-6,6]){const w=B.st==='stone'?4:2.2;if(B.ax==='x')isSolid(tx-w/2,tx+w/2,B.c+s-1.1,B.c+s+1.1,30);else isSolid(B.c-s-1.1,B.c-s+1.1,tx-w/2,tx+w/2,30)}
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)}
// ===== CORAL KEY: beach resort with an art-deco strip =====
let isHeliPads=[];
(function(){const g=isGroup('Coral Key',isRX,isRZ,150),L=[],N=[],TW=[],X=isRX,Z=isRZ;
 const el=(rx,rz,h,hex,y,cx)=>{const q=isCy(1,1.03,h,48,hex,0,0,0);q.scale(rx,1,rz);q.translate(cx===undefined?X:cx,y,Z);return q};
 L.push(el(isRA,isRB,1.6,0xe6d6a0,isGY-.8),el(isRA-22,isRB-13,.1,0x58b05a,isGY+.03,X-11));
 const rw=9,bx=[-34,0,34],bz=[-52,-14,24,62];for(const x of bx)L.push(isB(rw,.08,bz[3]-bz[0]+rw,0x2f3136,X+x,isGY+.1,Z+(bz[0]+bz[3])/2));for(const z of bz)L.push(isB(bx[2]-bx[0]+rw+10,.08,rw,0x2f3136,X+5,isGY+.11,Z+z));
 L.push(isB(64,.08,rw,0x2f3136,X-66,isGY+.1,isBZ),isB(rw,.08,Math.abs(isBZ-(Z+bz[0]))+rw,0x2f3136,X-34,isGY+.1,(isBZ+Z+bz[0])/2));
 L.push(isB(rw,.08,190,0x2f3136,X+44,isGY+.1,Z-5),isB(52,.08,rw,0x2f3136,X+72,isGY+.1,Z-14));
 for(const x of bx)for(let z=bz[0]+6;z<bz[3];z+=9)L.push(isB(.25,.02,3.6,0xf4d03f,X+x,isGY+.16,Z+z));for(let z=-96;z<88;z+=9)L.push(isB(.25,.02,3.6,0xf4d03f,X+44,isGY+.16,Z+z));
 const pals=[0xf7b7c5,0xa8e6cf,0x8fd8e8,0xffd3a5,0xfff1d0,0xc9b6f2,0xffffff];let k=0;
 for(let i=0;i<2;i++)for(let j=0;j<3;j++){const cx=X+(bx[i]+bx[i+1])/2,cz=Z+(bz[j]+bz[j+1])/2,w=34-rw-3,d=(bz[j+1]-bz[j])-rw-3;L.push(isB(w+2.4,.3,d+2.4,0x9a9c9f,cx,isGY+.12,cz));
  if(i===1&&j===1){L.push(isB(w,.1,d,0x4cbf55,cx,isGY+.3,cz),isCy(3.2,3.6,.9,20,0xe9e9e9,cx,isGY+.6,cz),isCy(2.8,2.8,.15,20,0x39b0ff,cx,isGY+1,cz));isSolid(cx-3.4,cx+3.4,cz-3.4,cz+3.4,1.4);for(const s of[[-7,-7],[7,7],[-7,7],[7,-7]])isPalm(cx+s[0],cz+s[1])}
  else{const h=10+((k*7)%5)*5+(i===0&&j===0?22:0);isTw(TW,cx,cz,w,d,h,pals[k%pals.length]);L.push(isB(w+.5,.5,d+.5,0x4a4d52,cx,isGY+h+.2,cz));k++}}
 // the deco strip: low pastel hotels with rounded corners and neon fins, facing the beach
 const deco=[0xf7a8c4,0xa8e6cf,0x8fd8e8,0xffd3a5,0xc9b6f2,0xfff1a8,0xffffff],neon=[0xff4fd8,0x3cf2ff,0xffe14d,0x7dff6a,0xff7a3c];
 [-84,-62,-38,12,34,56,78].forEach((oz,i)=>{const cx=X+58,cz=Z+oz,w=13,d=16,h=12+(i%3)*4,col=deco[i%deco.length],nc=neon[i%neon.length];isTw(TW,cx-1,cz,w-2,d,h,col);
  for(const s of[-1,1])L.push(isCy(2,2,h,14,col,cx+w/2-2.2,isGY+h/2,cz+s*(d/2-2)));L.push(isB(w+.6,.6,d+.6,0xffffff,cx,isGY+h+.3,cz),isB(w+.8,.4,d+.8,col,cx,isGY+3.6,cz),isB(3,.3,d*.7,0xffffff,cx+w/2+1.4,isGY+3.4,cz));
  N.push(isB(.5,h*.75,1.3,nc,cx+w/2+.2,isGY+h*.55,cz),isB(.15,.35,d-1,nc,cx+w/2+.3,isGY+h+.3,cz),isB(.15,.25,d-3,nc,cx+w/2+.35,isGY+3.2,cz));
  for(let u=-6;u<=6;u+=3){L.push(isB(1.6,.15,.8,0xffffff,cx+w/2+3.2,isGY+.9,cz+u),isCy(.06,.06,1,4,0x30343a,cx+w/2+3.2,isGY+.5,cz+u))}});
 for(let z=-92;z<=86;z+=12){if(Math.abs(z+14)<8)continue;const ex=X+isRA*Math.sqrt(Math.max(0,1-Math.pow(z/isRB,2)));if(ex-X<82)continue;const ux=X+76+((z*7)%9+9)%9;L.push(isCy(1.7,0,.6,8,[0xff5a5a,0xffd23f,0x4dd0ff,0xffffff][Math.abs(z)%4],ux,isGY+2.4,Z+z),isCy(.05,.05,2.2,5,0xdddddd,ux,isGY+1.2,Z+z),isB(.9,.08,1.9,[0x2e86c1,0xe74c3c,0xf1c40f][Math.abs(z)%3],ux+1.6,isGY+.05,Z+z+.4));isPalm(X+70,Z+z+6)}
 for(const q of isBuildingsBig())isTw(TW,q[0],q[1],q[2],q[3],q[4],q[5]);
 function isBuildingsBig(){return [[X-2,Z+96,30,18,46,0xffffff],[X-30,Z+96,14,14,30,0x8fd8e8]]}
 L.push(isB(24,.3,9,0xf2ead8,X-2,isGY+.12,Z+80),isB(22,.12,7,0x35c3f2,X-2,isGY+.24,Z+80));
 const bcx=X-64,bcz=Z+22;L.push(isB(20,.3,14,0xb98a5a,bcx,isGY+.2,bcz),isB(22,.4,16,0xf3efe6,bcx,isGY+5,bcz));for(const s of[[-9,-6],[9,-6],[-9,6],[9,6]])L.push(isCy(.3,.3,5,8,0xf3efe6,bcx+s[0],isGY+2.5,bcz+s[1]));L.push(isB(8,1.1,1.6,0x6b4a2a,bcx,isGY+.8,bcz-3));N.push(isB(10,.5,.2,0xff4fd8,bcx,isGY+5.6,bcz+8.1));
 const gx=X+10,gz=Z-110;{const q=isCy(1,1,.08,32,0x3fae55,0,0,0);q.scale(38,1,14);q.translate(gx,isGY+.1,gz);L.push(q);const p=isCy(1,1,.08,20,0x7bd86a,0,0,0);p.scale(7,1,5);p.translate(gx+24,isGY+.14,gz-2);L.push(p);
  L.push(isCy(.05,.05,3,5,0xffffff,gx+25,isGY+1.5,gz-2),isB(.9,.5,.04,0xff3030,gx+25.5,isGY+2.7,gz-2))}
 const hx=X-82,hz=Z-58;for(let i=0;i<3;i++){L.push(isB(26,.4,2.2,0x8a6a45,hx-18,isGY+.05,hz+i*12));for(let u=0;u<26;u+=6)L.push(isCy(.25,.25,2.4,6,0x5a4630,hx-30+u,isGY-.8,hz+i*12+1.2))}
 const yacht=(x,z,s,ry)=>{const y=[isB(3.2*s,1.4*s,11*s,0xffffff,0,.7*s,0),isB(2.8*s,1.1*s,5*s,0xf4f4f4,0,1.9*s,.8*s),isB(2.2*s,.9*s,2.8*s,0xffffff,0,2.9*s,1.2*s),isB(2.9*s,.5*s,4.6*s,0x1c2a3a,0,2*s,.8*s),isCy(1.6*s,0,3*s,4,0xffffff,0,.7*s,-6.9*s,0,-Math.PI/2)];for(const q of y){q.rotateY(ry);q.translate(x,isGY-.3,z);L.push(q)}};
 yacht(hx-22,hz+6,1,1.57);yacht(hx-16,hz+18,.8,1.57);yacht(hx-24,hz-7,1.2,1.57);
 const lx=X+52,lz=Z-104;for(let i=0;i<5;i++)L.push(isCy(2.6-i*.3,2.9-i*.3,4.4,14,i%2?0xd63a2f:0xffffff,lx,isGY+2.2+i*4.4,lz));L.push(isCy(2.2,2.2,.4,14,0x30343a,lx,isGY+22.2,lz),isCy(1.2,1.2,2.2,10,0x9fd7ff,lx,isGY+23.5,lz),isCy(.2,1.9,1.6,12,0xd63a2f,lx,isGY+25.4,lz));N.push(isCy(.9,.9,1.6,8,0xfff3b0,lx,isGY+23.5,lz));isSolid(lx-3,lx+3,lz-3,lz+3,26);
 const hp=[X-62,Z-80];isHeliPads.push(hp);L.push(isCy(6,6.3,.2,24,0x55585d,hp[0],isGY+.1,hp[1]),isCy(4.6,4.6,.03,24,0xffd23f,hp[0],isGY+.22,hp[1]),isCy(4.2,4.2,.03,24,0x55585d,hp[0],isGY+.23,hp[1]),isB(.5,.03,3,0xffffff,hp[0]-1,isGY+.25,hp[1]),isB(.5,.03,3,0xffffff,hp[0]+1,isGY+.25,hp[1]),isB(2,.03,.5,0xffffff,hp[0],isGY+.25,hp[1]));
 for(let z=bz[0]+4;z<bz[3];z+=9.5){isPalm(X+bx[1]-5.4,Z+z);isPalm(X+bx[1]+5.4,Z+z)}for(let a=0;a<6.28;a+=.23){const px=X+Math.cos(a)*(isRA-7),pz=Z+Math.sin(a)*(isRB-7);if(Math.abs(pz-isBZ)<9&&Math.cos(a)<0)continue;if(Math.abs(pz-(Z-14))<9&&Math.cos(a)>0)continue;isPalm(px,pz)}
 isMesh(L,null,g,true);isMesh(TW,isTwMat,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== METRO ISLE: dense tower grid, central park, waterfront =====
const isMAv=[0,1,2,3,4,5].map(i=>isMX-70+i*28),isMSt=[-150,-126,-102,-78,-54,-30,-6,18,42,66].map(v=>v+isMZ+40),isMPark=[isMAv[2]+4,isMAv[4]-4,isMSt[1]+3.5,isMSt[5]-3.5];
(function(){const g=isGroup('Metro Isle',isMX,isMZ,160),L=[],N=[],TW=[],X=isMX,Z=isMZ;
 L.push(isB(isMA*2,1.8,isMB*2,0x8f9296,X,isGY-.9,Z),isB(isMA*2+1,1.2,1,0x6d7176,X,isGY,Z-isMB),isB(isMA*2+1,1.2,1,0x6d7176,X,isGY,Z+isMB),isB(1,1.2,isMB*2,0x6d7176,X-isMA,isGY,Z),isB(1,1.2,isMB*2,0x6d7176,X+isMA,isGY,Z));
 for(const ax of isMAv){L.push(isB(8,.08,isMB*2-2,0x2b2d31,ax,isGY+.05,Z));for(let z=Z-isMB+4;z<Z+isMB;z+=8)L.push(isB(.25,.02,3.4,0xf4d03f,ax,isGY+.1,z))}
 for(const sz of isMSt)L.push(isB(isMA*2-2,.08,7,0x2b2d31,X,isGY+.06,sz));
 for(const ax of isMAv)for(const sz of isMSt)for(const s of[-1,1]){for(let u=-2.6;u<=2.6;u+=1.3)L.push(isB(.6,.02,2.2,0xf2f2f2,ax+u,isGY+.11,sz+s*5.2))}
 // central park with a lake, paths and trees
 {const P=isMPark,cx=(P[0]+P[1])/2,cz=(P[2]+P[3])/2,w=P[1]-P[0],d=P[3]-P[2];L.push(isB(w+1.2,.6,d+1.2,0x7a7468,cx,isGY+.18,cz),isB(w,.2,d,0x4caf50,cx,isGY+.5,cz));
  const lk=isCy(1,1,.1,28,0x2f86c8,0,0,0);lk.scale(13,1,22);lk.translate(cx+6,isGY+.62,cz+14);L.push(lk);
  L.push(isB(2.2,.06,d-4,0xd8c9a3,cx-10,isGY+.63,cz),isB(w-4,.06,2.2,0xd8c9a3,cx,isGY+.63,cz-24),isB(w-4,.06,2.2,0xd8c9a3,cx,isGY+.63,cz-4));
  for(let i=0;i<46;i++){const x=P[0]+3+((i*37)%(w-6)),z=P[2]+3+((i*53)%(d-6));if(Math.hypot((x-cx-6)/14,(z-cz-14)/23)<1)continue;if(Math.abs(x-cx+10)<2.5||Math.abs(z-cz+24)<2.5||Math.abs(z-cz+4)<2.5)continue;isTree(L,x,z,.9+(i%4)*.12,isGY+.6)}
  for(const q of[[P[0],P[2]],[P[1],P[2]],[P[0],P[3]],[P[1],P[3]]])isSolid(q[0]-.6,q[0]+.6,q[1]-.6,q[1]+.6,1)}
 const pal=[0xa0522d,0x8b5a3c,0xd8cfc0,0x9aa3ab,0x6f8fa8,0xe8dcc0,0x5a5f66,0xb98d6b,0xc4c9cf];
 const xe=[X-isMA,...isMAv,X+isMA],ze=[Z-isMB,...isMSt,Z+isMB];let k=0;const spire=[isMAv[3],isMAv[4],isMSt[7],isMSt[8]];
 for(let i=0;i<xe.length-1;i++)for(let j=0;j<ze.length-1;j++){const x0=xe[i]+(i===0?2:4),x1=xe[i+1]-(i===xe.length-2?2:4),z0=ze[j]+(j===0?2:3.5),z1=ze[j+1]-(j===ze.length-2?2:3.5);if(x1-x0<6||z1-z0<6)continue;
  const cx=(x0+x1)/2,cz=(z0+z1)/2;if(cx>isMPark[0]&&cx<isMPark[1]&&cz>isMPark[2]&&cz<isMPark[3])continue;
  L.push(isB(x1-x0+1.6,.25,z1-z0+1.6,0xa8aaad,cx,isGY+.1,cz));
  if(xe[i]===spire[0]&&ze[j]===spire[2]){const tiers=[[18,58],[14,30],[10,20],[6,12]];let y=isGY;tiers.forEach((t,ti)=>{isTw(TW,cx,cz,t[0],t[0],t[1],0xd9d2c0,y,ti>0);y+=t[1];N.push(isB(t[0]+.4,.3,t[0]+.4,0xfff1c8,cx,y-.6,cz))});L.push(isCy(.3,2.2,22,8,0xcfd3d8,cx,y+11,cz));N.push(isB(.4,.4,.4,0xff3030,cx,y+22.4,cz));k++;continue}
  const cf=1-Math.min(1,Math.hypot(cx-X,(cz-Z)*.6)/110),split=(x1-x0>14)?2:1,sw=(x1-x0-(split-1)*1.2)/split;
  for(let s=0;s<split;s++){const bxp=x0+sw/2+s*(sw+1.2),h=Math.round(16+Math.pow(Math.random(),1.3)*(34+cf*92)),col=pal[(k*5+s*3)%pal.length];isTw(TW,bxp,cz,sw,z1-z0,h,col);
   L.push(isB(sw+.4,.6,z1-z0+.4,0x4a4d52,bxp,isGY+h+.3,cz));
   if(h>70){const h2=14+Math.random()*26;isTw(TW,bxp,cz,sw*.66,(z1-z0)*.66,h2,col,isGY+h,true);N.push(isB(.5,.5,.5,0xff3030,bxp,isGY+h+h2+.6,cz))}
   else if(h<58&&Math.random()<.45){const wx=bxp+(Math.random()-.5)*sw*.4,wz=cz+(Math.random()-.5)*(z1-z0)*.4,y=isGY+h+.6;for(const q of[[-.9,-.9],[.9,-.9],[-.9,.9],[.9,.9]])L.push(isB(.15,1.8,.15,0x3b2a1a,wx+q[0],y+.9,wz+q[1]));L.push(isCy(1.4,1.4,2.2,10,0x8a6a45,wx,y+2.9,wz),isCy(0,1.6,1,10,0x5a4630,wx,y+4.5,wz))}}
  k++}
 for(let z=Z-isMB+10;z<Z+isMB;z+=34)L.push(isB(14,.4,2.4,0x8a6a45,X-isMA-7,isGY-.05,z));
 isMesh(L,null,g,true);isMesh(TW,isTwMat,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== LUCKY SANDS: neon casino strip and fountain lake =====
(function(){const g=isGroup('Lucky Sands',isSX,isSZ,140),L=[],N=[],TW=[],X=isSX,Z=isSZ;
 L.push(isB(isSA*2,1.8,isSB*2,0xd9c28f,X,isGY-.9,Z),isB(isSA*2-4,.06,isSB*2-4,0xcdb27a,X,isGY+.02,Z));
 L.push(isB(isSA*2,.08,16,0x2b2d31,X,isGY+.06,Z),isB(isSA*2-6,.3,2.6,0x3f7d3e,X,isGY+.2,Z),isB(10,.08,isSB*2,0x2b2d31,X,isGY+.07,Z));
 for(let x=X-isSA+8;x<X+isSA;x+=11){if(Math.abs(x-X)<8)continue;isPalm(x,Z,isGY+.3,1.1)}
 for(const s of[-1,1])L.push(isB(isSA*2,.25,4,0xb7b1a5,X,isGY+.12,Z+s*10));
 // pyramid casino with a sky beam
 {const px=X-58,pz=Z-40,q=isCy(.01,24,34,4,0x1c1f26,px,isGY+17,pz,Math.PI/4);L.push(q,isB(30,.6,30,0x2a2d33,px,isGY+.3,pz));N.push(isB(10,4,.4,0xffd27a,px,isGY+4,pz+17.2),isB(30.5,.3,.3,0xffe08a,px,isGY+.9,pz+15.2));isSolid(px-15,px+15,pz-15,pz+15,30);
  const bm=new THREE.Mesh(new THREE.CylinderGeometry(.9,1.6,220,10,1,true),new THREE.MeshBasicMaterial({color:0xfff3d0,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));bm.position.set(px,isGY+34+110,pz);g.add(bm);isFx.beams.push(bm);isDraws++}
 // three-wing hotel tower
 {const cx=X-4,cz=Z-40;for(let i=0;i<3;i++){const a=i*Math.PI*2/3+Math.PI/2,ox=Math.cos(a)*13,oz=Math.sin(a)*13;const geo=isTw(TW,0,0,10,26,62-i*6,0xe0c070,isGY,true);geo.translate(-0,0,0);geo.rotateY(-a+Math.PI/2);geo.translate(cx+ox,0,cz+oz)}L.push(isCy(7,7,70,12,0xe0c070,cx,isGY+35,cz));N.push(isB(.3,6,12,0xff3c8e,cx+7.2,isGY+64,cz),isB(.3,6,12,0xff3c8e,cx-7.2,isGY+64,cz));isSolid(cx-16,cx+16,cz-16,cz+16,62);
  L.push(isB(44,9,16,0xf2ead8,cx,isGY+4.5,cz+24));N.push(isB(40,1.2,.3,0x3cf2ff,cx,isGY+8.6,cz+32.2),isB(40,.4,.3,0xff4fd8,cx,isGY+6.8,cz+32.2));isSolid(cx-22,cx+22,cz+16,cz+32,9)}
 // observation needle and its casino
 {const nx=X+56,nz=Z-46;L.push(isCy(2.4,3.2,100,12,0xd9dde3,nx,isGY+50,nz),isCy(9,7,8,20,0xf2f2f2,nx,isGY+104,nz),isCy(.3,1,22,8,0xd9dde3,nx,isGY+119,nz));N.push(isCy(9.2,9.2,.8,20,0x3cf2ff,nx,isGY+102,nz),isB(.6,.6,.6,0xff3030,nx,isGY+130.6,nz));isSolid(nx-3.2,nx+3.2,nz-3.2,nz+3.2,100);
  isTw(TW,nx,Z-18,30,14,14,0xc9b6f2);N.push(isB(28,2.4,.3,0xffe14d,nx,isGY+11,Z-10.8),isB(.3,12,3,0xff4fd8,nx-15.3,isGY+8,Z-14))}
 // castle casino
 {const cx=X-58,cz=Z+38;isTw(TW,cx,cz,30,20,20,0xffffff);const tc=[0xd63a2f,0x2e86c1,0xf1c40f];[[-15,-10],[15,-10],[-15,10],[15,10],[-6,-10],[6,-10]].forEach((q,i)=>{const h=24+(i%3)*5;L.push(isCy(3,3,h,12,0xf4f4f4,cx+q[0],isGY+h/2,cz+q[1]),isCy(0,3.8,7,12,tc[i%3],cx+q[0],isGY+h+3.5,cz+q[1]));N.push(isCy(3.1,3.1,.4,12,0xffe14d,cx+q[0],isGY+h-.8,cz+q[1]))});
  N.push(isB(22,3,.3,0xff7a3c,cx,isGY+16,cz-10.3),isB(30,.4,.3,0x3cf2ff,cx,isGY+2.5,cz-10.3));isSolid(cx-18,cx+18,cz-13,cz+13,24)}
 // fountain lake and the curved resort behind it
 {const fx=X+4,fz=Z+22,lk=isCy(1,1,.4,32,0x1d86c8,0,0,0);lk.scale(30,1,8);lk.translate(fx,isGY+.05,fz);L.push(lk);const rim=isCy(1,1,.6,32,0xe7dfcf,0,0,0);rim.scale(31.5,1,9.4);rim.translate(fx,isGY,fz);L.push(rim);isSolid(fx-30,fx+30,fz-7,fz+7,.9);
  for(let i=0;i<5;i++){const a=-.55+i*.275,r=58,bxp=fx+Math.sin(a)*r,bzp=fz+52-Math.cos(a)*r+10;const geo=isTw(TW,0,0,16,12,50,0xf2e6d0,isGY,true);geo.rotateY(-a);geo.translate(bxp,0,bzp);isSolid(bxp-8,bxp+8,bzp-6,bzp+6,50)}
  N.push(isB(46,1.2,.3,0xffe14d,fx,isGY+44,fz+21));
  const J=[];for(let i=0;i<17;i++){const x=fx-26+i*3.25,z=fz+Math.sin(i*.9)*3;J.push(isCy(.12,.35,1,6,0xdff6ff,x,.5,z))}const jm=new THREE.Mesh(U.mergeBufferGeometries(J),new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.75,depthWrite:false,toneMapped:false}));jm.position.y=isGY;g.add(jm);isDraws++;isFx.jets=jm}
 // gold glass tower
 {const tx=X+58,tz=Z+40;isTw(TW,tx,tz,22,22,64,0xd8b45a);isTw(TW,tx,tz,15,15,18,0xd8b45a,isGY+64,true);N.push(isB(22.4,.5,22.4,0xffe08a,tx,isGY+64,tz),isB(.3,14,8,0xff4fd8,tx-11.2,isGY+20,tz))}
 // giant marquee pylons along the strip
 [[-78,-11],[-30,-11],[30,-11],[78,-11],[-78,11],[-30,11],[30,11],[78,11]].forEach((q,i)=>{const x=X+q[0],z=Z+q[1],c=[0xff4fd8,0x3cf2ff,0xffe14d,0x7dff6a][i%4];L.push(isB(1.2,20,1.2,0x30343a,x,isGY+10,z),isB(7,9,1.4,0x1c1f26,x,isGY+17,z));N.push(isB(6.4,8.2,1.5,c,x,isGY+17,z),isB(7.4,.5,1.6,0xffffff,x,isGY+21.8,z));isSolid(x-.7,x+.7,z-.7,z+.7,20)});
 isMesh(L,null,g,true);isMesh(TW,isTwMat,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g);g.userData.neon=1})();
// ===== HIKARI: narrow neon lanes, scramble crossing, lattice tower, temple =====
const isHLx=[804,826,846,868,890,912].map(v=>v-864+isHX),isHLz=[-400,-378,-356,-334,-312,-290,-268].map(v=>v+330+isHZ);
(function(){const g=isGroup('Hikari',isHX,isHZ,140),L=[],N=[],TW=[],X=isHX,Z=isHZ;
 L.push(isB(isHA*2,1.8,isHB*2,0x8f9399,X,isGY-.9,Z));
 for(const x of isHLx)L.push(isB(6,.08,isHB*2-2,0x34363b,x,isGY+.05,Z));for(const z of isHLz)L.push(isB(isHA*2-2,.08,6,0x34363b,X,isGY+.06,z));
 {const cx=isHLx[2],cz=isHLz[3];for(let u=-2.4;u<=2.4;u+=1.2)for(const s of[-1,1]){L.push(isB(.6,.02,2,0xf2f2f2,cx+u,isGY+.11,cz+s*4.2),isB(2,.02,.6,0xf2f2f2,cx+s*4.2,isGY+.11,cz+u))}for(let u=-3;u<=3;u+=1)for(const a of[Math.PI/4,-Math.PI/4])L.push(isB(.5,.02,1.6,0xf2f2f2,cx+u*Math.cos(a),isGY+.12,cz+u*Math.sin(a),a))}
 const pal=[0x8a8f96,0x6d737b,0xb7a99a,0x4f555d,0xa3a8ae,0x7c6f64,0x5e6a73,0xc2b8ad,0x9b8f84],nc=[0xff3c8e,0x3cf2ff,0xffe14d,0xff4d4d,0x7dff6a,0xffffff,0xb46bff,0xff9a3c];
 const xe=[X-isHA,...isHLx,X+isHA],ze=[Z-isHB,...isHLz,Z+isHB];let k=0;
 for(let i=0;i<xe.length-1;i++)for(let j=0;j<ze.length-1;j++){const x0=xe[i]+(i===0?2:3),x1=xe[i+1]-(i===xe.length-2?2:3),z0=ze[j]+(j===0?2:3),z1=ze[j+1]-(j===ze.length-2?2:3);if(x1-x0<5||z1-z0<5)continue;const cx=(x0+x1)/2,cz=(z0+z1)/2;
  if(i===5&&j===1){// lattice tower
   const y0=isGY,H=96,tc=[0xe8442e,0xf4f4f4];for(const q of[[-1,-1],[1,-1],[-1,1],[1,1]]){for(let s=0;s<6;s++){const t0=s/6,t1=(s+1)/6,r0=7*(1-t0*.85),r1=7*(1-t1*.85),hh=H*.62/6,len=Math.hypot(hh,(r0-r1)*1.414);L.push(isB(.7,len,.7,tc[s%2],cx+q[0]*(r0+r1)/2,y0+hh*(s+.5),cz+q[1]*(r0+r1)/2,0,-q[1]*Math.atan2(r0-r1,hh),q[0]*Math.atan2(r0-r1,hh)))}}
   for(const t of[.2,.4,.62]){const r=7*(1-t*.85/.62*.62);L.push(isB(r*2+1.2,.5,r*2+1.2,tc[0],cx,y0+H*t,cz))}L.push(isB(4.8,4,4.8,0xf4f4f4,cx,y0+H*.62+2,cz),isCy(.8,1.4,H*.38,8,0xe8442e,cx,y0+H*.81,cz));N.push(isB(5,.4,5,0xffe14d,cx,y0+H*.62+.4,cz),isB(.6,.6,.6,0xff3030,cx,y0+H+.3,cz));for(const q of[[-1,-1],[1,-1],[-1,1],[1,1]])isSolid(cx+q[0]*7-1,cx+q[0]*7+1,cz+q[1]*7-1,cz+q[1]*7+1,6);k++;continue}
  if(i===1&&j===5){// temple garden with a pagoda and a red gate
   L.push(isB(x1-x0,.2,z1-z0,0xd7cfbf,cx,isGY+.1,cz));for(let t=0;t<3;t++){const s=7-t*1.6,y=isGY+.2+t*4;L.push(isB(s,3.4,s,0x7a1f17,cx,y+1.7,cz),isCy(0,s*.95,1.4,4,0x2b2b30,cx,y+3.9,cz,Math.PI/4))}L.push(isCy(.15,.15,3,6,0xd9a520,cx,isGY+14,cz));isSolid(cx-3.5,cx+3.5,cz-3.5,cz+3.5,12);
   const gz=z1+.5;for(const s of[-2.4,2.4])L.push(isCy(.3,.35,5,8,0xd63a2f,cx+s,isGY+2.5,gz));L.push(isB(6.6,.5,.6,0x1c1c1c,cx,isGY+5.2,gz),isB(5.6,.35,.45,0xd63a2f,cx,isGY+4.2,gz));isTree(L,cx-5,cz-5,.8);isTree(L,cx+5,cz-5,.7);k++;continue}
  const split=(x1-x0>12)?2:1,sw=(x1-x0-(split-1)*.8)/split;
  for(let s=0;s<split;s++){const bxp=x0+sw/2+s*(sw+.8),h=Math.round(12+Math.pow(Math.random(),1.2)*30+(j<3?6:0)),col=pal[(k*3+s)%pal.length],d=z1-z0;isTw(TW,bxp,cz,sw,d,h,col);L.push(isB(sw+.3,.5,d+.3,0x4a4d52,bxp,isGY+h+.25,cz));
   for(const f of[-1,1]){const fz=cz+f*(d/2+.18),c1=nc[(k+s*2+(f>0?1:0))%nc.length],sh=Math.min(h-3,6+((k*7+s)%4)*2.5);N.push(isB(1.9,sh,.3,c1,bxp-sw/2+1.4,isGY+3+sh/2,fz),isB(sw-.6,.9,.3,nc[(k+s+3)%nc.length],bxp,isGY+2.6,fz));if(sw>7)N.push(isB(1.2,Math.max(2,sh-2),.25,nc[(k*5+s+f+8)%nc.length],bxp+sw/2-1.2,isGY+3.5+(sh-2)/2,fz))}
   for(const f of[-1,1])for(let u=-d/2+3;u<=d/2-3;u+=Math.max(6,d/2)){const bs=Math.min(h-6,3+((k+Math.round(u))%3)*1.6);if(bs<2.5)continue;N.push(isB(.8,bs,.2,nc[(k*3+s+Math.round(u)+(f>0?2:0)+16)%nc.length],bxp+f*(sw/2+.45),isGY+5+bs/2,cz+u))}
   L.push(isB(sw,.2,1.4,0x2b2b30,bxp,isGY+3.4,cz-d/2-.7),isB(sw,.2,1.4,0x2b2b30,bxp,isGY+3.4,cz+d/2+.7))}
  k++}
 for(let i=0;i<18;i++){const x=X-isHA+6+((i*29)%(isHA*2-12)),z=isHLz[i%isHLz.length];L.push(isB(.12,4.5,.12,0x30343a,x,isGY+2.2,z+3.4));N.push(isB(.5,.3,.5,0xfff3c8,x,isGY+4.5,z+3.4))}
 for(let z=Z-isHB+10;z<Z+isHB;z+=40)L.push(isB(12,.4,2.4,0x8a6a45,X+isHA+6,isGY-.05,z));
 isMesh(L,null,g,true);isMesh(TW,isTwMat,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g);g.userData.neon=1})();
// ===== PORTO LUNA: cliff village with terraces, canal, bell tower =====
(function(){const g=isGroup('Porto Luna',isLX,isLZ,70),L=[],N=[],X=isLX,Z=isLZ;
 L.push(isCy(isLR,isLR+2,1.6,40,0xd8c39a,X,isGY-.8,Z),isCy(isLR-1,isLR-1,.06,40,0xcbb38a,X,isGY+.02,Z));
 const tr=[[44,34,5,0],[30,24,10,-2],[17,14,15,-4]],house=[0xf7c59f,0xf4a6a6,0xfff1a8,0xf2d0a4,0xe8b4b8,0xfde2c4,0xd9e6c3];let k=0;
 tr.forEach((t,ti)=>{const cz=Z-6+t[3];L.push(isB(t[0],t[2],t[1],ti===0?0xb79f7d:0xc6ae8a,X,isGY+t[2]/2,cz));isSolid(X-t[0]/2,X+t[0]/2,cz-t[1]/2,cz+t[1]/2,isGY+t[2]);
  const nxt=tr[ti+1];for(let u=-t[0]/2+3;u<=t[0]/2-3;u+=5.4){const hz=cz+t[1]/2-3;if(nxt&&Math.abs(u)<nxt[0]/2+1&&hz<Z-6+nxt[3]+nxt[1]/2+2)continue;const hh=4+((k*3)%3)*1.2,col=house[k%house.length];L.push(isB(4.6,hh,4.2,col,X+u,isGY+t[2]+hh/2,hz),isCy(0,3.6,1.8,4,0xb5523b,X+u,isGY+t[2]+hh+.9,hz,Math.PI/4),isB(1,1.4,.1,0x3b6e8f,X+u,isGY+t[2]+hh*.6,hz+2.12));k++}});
 {const y=isGY+15;L.push(isB(4,22,4,0xb5523b,X,y+11,Z-10),isCy(0,3.2,4,4,0x8a3b28,X,y+24,Z-10,Math.PI/4));N.push(isB(4.1,1,4.1,0xfff3b0,X,y+19,Z-10))}
 {const y=isGY+10;L.push(isB(10,7,8,0xf4efe6,X+9,y+3.5,Z-4));const dm=new THREE.SphereGeometry(4,16,8,0,Math.PI*2,0,Math.PI/2);L.push(isG(dm,0xc9d6df,X+9,y+7,Z-4))}
 for(let a=0;a<6.28;a+=.42){const r=isLR-5,hx=X+Math.cos(a)*r,hz=Z+Math.sin(a)*r;if(Math.sin(a)>.55)continue;if(Math.abs(hz-isLZ-30)<6)continue;const col=house[k%house.length],hh=4.5+(k%3);L.push(isB(4.4,hh,4.4,col,hx,isGY+hh/2,hz,-a),isCy(0,3.5,1.6,4,0xb5523b,hx,isGY+hh+.8,hz,Math.PI/4-a));isSolid(hx-2.2,hx+2.2,hz-2.2,hz+2.2,hh);k++}
 const cz=Z+30;L.push(isB(78,.1,5,0x2f86c8,X,isGY+.04,cz),isB(78,.3,.5,0xd8c39a,X,isGY+.15,cz-2.8),isB(78,.3,.5,0xd8c39a,X,isGY+.15,cz+2.8));
 for(const bx of[X-14,X+12]){L.push(isB(2.6,.3,3,0xe8dccb,bx,isGY+1.1,cz),isB(2.6,.3,2.4,0xe8dccb,bx,isGY+.6,cz-2.4,0,.42),isB(2.6,.3,2.4,0xe8dccb,bx,isGY+.6,cz+2.4,0,-.42));for(const s2 of[-1.2,1.2])L.push(isB(.15,.6,7.4,0xd8c9b0,bx+s2,isGY+1.4,cz))}
 for(const q of[[-28,1],[2,-1],[26,1]]){L.push(isB(.9,.35,6,0x111111,X+q[0],isGY+.2,cz+q[1]*.6),isB(.2,1,.2,0x111111,X+q[0],isGY+.6,cz+q[1]*.6+2.8))}
 for(let i=0;i<4;i++)L.push(isB(14,.4,2.2,0x8a6a45,X-isLR-6,isGY-.05,Z-12+i*8));
 for(let a=.2;a<6.28;a+=.7)isTree(L,X+Math.cos(a)*(isLR-12),Z+Math.sin(a)*(isLR-12)*.9,.6);
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== PORT IRONSIDE: cargo port =====
(function(){const g=isGroup('Port Ironside',isPX,isPZ,130),L=[],N=[],X=isPX,Z=isPZ;
 L.push(isB(isPA*2,1.8,isPB*2,0x7d8085,X,isGY-.9,Z),isB(isPA*2-6,.06,isPB*2-6,0x55585c,X,isGY+.03,Z));
 for(let u=-isPA+6;u<isPA;u+=12)L.push(isB(5,.03,.5,0xf4d03f,X+u,isGY+.08,Z+6));L.push(isB(70,.08,10.6,0x2b2d31,X+isPA-35,isGY+.06,isSZ));
 const cg=new THREE.BoxGeometry(2.6,2.7,7),cm=new THREE.MeshStandardMaterial({roughness:.7,metalness:.3}),spots=[];
 for(let r=0;r<4;r++)for(let c=0;c<7;c++){const n=1+((r*5+c*3)%4);for(let s=0;s<n;s++)spots.push([X-70+c*8.4,isGY+1.35+s*2.7,Z-58+r*3.1+(r>1?8:0)]);isSolid(X-70+c*8.4-3.5,X-70+c*8.4+3.5,Z-58+r*3.1+(r>1?8:0)-1.3,Z-58+r*3.1+(r>1?8:0)+1.3,n*2.7+.4)}
 const ci=new THREE.InstancedMesh(cg,cm,spots.length),dm=new THREE.Object3D(),cc=[0xc0392b,0x2471a3,0x1e8449,0xd68910,0x7d3c98,0x5d6d7e,0xe5e7e9];spots.forEach((p,i)=>{dm.position.set(p[0],p[1],p[2]);dm.rotation.y=Math.PI/2;dm.updateMatrix();ci.setMatrixAt(i,dm.matrix);ci.setColorAt(i,isCol.set(cc[(i*7+Math.floor(p[2]))%cc.length]))});ci.castShadow=true;g.add(ci);isDraws++;
 for(const cz of[-40,5,50]){const cx=X+isPA-12;for(const s of[[-5,-6],[5,-6],[-5,6],[5,6]])L.push(isB(1.1,26,1.1,0xe07b1f,cx+s[0],isGY+13,Z+cz+s[1]));L.push(isB(12,1.4,14,0xe07b1f,cx,isGY+26,Z+cz),isB(46,1.6,2.2,0xe07b1f,cx+12,isGY+28,Z+cz),isB(3,2.4,3,0xf4f4f4,cx+16,isGY+26,Z+cz),isB(.3,12,.3,0x30343a,cx+24,isGY+21,Z+cz),isB(2.8,.5,7.2,0x30343a,cx+24,isGY+15,Z+cz));N.push(isB(.5,.5,.5,0xff3030,cx+34,isGY+29.2,Z+cz));for(const s of[[-5,-6],[5,-6],[-5,6],[5,6]])isSolid(cx+s[0]-.6,cx+s[0]+.6,Z+cz+s[1]-.6,Z+cz+s[1]+.6,26)}
 {const sx=X+isPA+13,sz=Z-26,h=[isB(15,6.5,92,0x1f2d3d,sx,1.6,sz),isB(15.2,1,92.2,0xb03a2e,sx,-1.4,sz),isB(13,9,11,0xf4f4f4,sx,9.2,sz+36),isB(14.5,.5,12,0x30343a,sx,13.9,sz+36),isCy(1.6,1.6,4.5,10,0xd68910,sx,16.2,sz+38)];for(const q of h)L.push(q);for(let r=0;r<8;r++)for(let c=0;c<4;c++){const n=1+((r+c*2)%3);for(let s=0;s<n;s++)L.push(isB(2.6,2.7,7,cc[(r*3+c+s)%cc.length],sx-4.5+c*3,6.2+s*2.7,sz-38+r*8))}isSolid(sx-7.6,sx+7.6,sz-46,sz+46,7)}
 for(const q of[[-52,40,34,22,11,0x8fa3b5],[-10,44,30,22,10,0xb5a48f],[-52,-4,26,16,9,0x9aa7a0]]){L.push(isB(q[2],q[4],q[3],q[5],X+q[0],isGY+q[4]/2,Z+q[1]));const rf=isCy(1,1,q[2]+1,3,0x5d6166,0,0,0,0,0,Math.PI/2);rf.scale(1,2.6,q[3]*.58);rf.translate(X+q[0],isGY+q[4]+1.2,Z+q[1]);L.push(rf);L.push(isB(7,6,.3,0x2c2f33,X+q[0],isGY+3,Z+q[1]-q[3]/2-.1));isSolid(X+q[0]-q[2]/2,X+q[0]+q[2]/2,Z+q[1]-q[3]/2,Z+q[1]+q[3]/2,q[4]+3)}
 for(let i=0;i<5;i++){const tx=X+32+(i%3)*15,tz=Z+40+Math.floor(i/3)*14;L.push(isCy(5.5,5.5,9,20,0xe9ecef,tx,isGY+4.5,tz),isCy(5.6,5.6,.5,20,0xb03a2e,tx,isGY+7.5,tz),isCy(.1,5.5,1.2,20,0xdfe3e6,tx,isGY+9.6,tz));isSolid(tx-5.5,tx+5.5,tz-5.5,tz+5.5,10)}
 for(const tz of[-22,-17]){L.push(isB(120,.12,.22,0x8d8f92,X-14,isGY+.14,Z+tz-.75),isB(120,.12,.22,0x8d8f92,X-14,isGY+.14,Z+tz+.75));for(let u=-74;u<46;u+=3)L.push(isB(.4,.08,2.4,0x5a4630,X+u,isGY+.08,Z+tz))}
 for(let i=0;i<5;i++){const wx=X-60+i*13;L.push(isB(11.5,3,2.7,i===0?0x2c3e50:cc[i%cc.length],wx,isGY+2.2,Z-22),isB(11.8,.5,2.9,0x222222,wx,isGY+.6,Z-22));if(i===0)L.push(isB(3,1.6,2.6,0xf1c40f,wx-3.5,isGY+4.4,Z-22))}isSolid(X-66,X-2,Z-23.5,Z-20.5,4);
 for(const q of[[-20,-40],[14,-52],[20,20]]){L.push(isB(1.6,1.2,2.6,0xf1c40f,X+q[0],isGY+.9,Z+q[1]),isB(.15,3.2,.15,0x30343a,X+q[0]-.5,isGY+1.9,Z+q[1]-1.5),isB(.15,3.2,.15,0x30343a,X+q[0]+.5,isGY+1.9,Z+q[1]-1.5),isB(1.3,.1,1.6,0x30343a,X+q[0],isGY+.5,Z+q[1]-2.2),isB(1.5,.1,1.5,0x30343a,X+q[0],isGY+2.5,Z+q[1]+.3))}
 for(const q of[[-80,-70],[0,-70],[70,-70],[-80,70],[0,70]]){L.push(isB(.4,16,.4,0x8d9299,X+q[0],isGY+8,Z+q[1]));N.push(isB(2.4,.5,1,0xfff3c8,X+q[0],isGY+16.2,Z+q[1]))}
 L.push(isB(22,.5,3,0x8a6a45,X-isPA-10,isGY-.05,Z-30));
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== EMBER ISLE: volcano, jungle, waterfall, hidden airstrip =====
(function(){const g=isGroup('Ember Isle',isWX,isWZ,125),L=[],N=[],X=isWX,Z=isWZ;
 const pg=new THREE.PlaneGeometry(204,204,56,56);pg.rotateX(-Math.PI/2);pg.translate(X,0,Z);const P=pg.attributes.position,ca=new Float32Array(P.count*3),c=new THREE.Color(),c2=new THREE.Color();
 for(let i=0;i<P.count;i++){const x=P.getX(i),z=P.getZ(i);let h=isWildH(x,z);const d=Math.hypot(x-X,z-Z);if(h<0)h=-2.5-(d-isWR)*.2;P.setY(i,h);
  if(h<-.4)c.set(0x1a5f8f);else if(h<1.1)c.set(0xe6d6a0);else if(h<14)c.set(0x2f8a3c).lerp(c2.set(0x256e30),((i*7)%10)/16);else if(h<27)c.set(0x4d6b3a).lerp(c2.set(0x6b6258),isSm((h-14)/13));else c.set(0x5a5049).lerp(c2.set(0x2b2422),isSm((h-27)/12));
  const fx=Math.abs(x-X+18),fz=Math.abs(z-Z-58);if(fx<33&&fz<5.5&&h<1.2)c.set(0x6b5a44);ca[i*3]=c.r;ca[i*3+1]=c.g;ca[i*3+2]=c.b}
 pg.setAttribute('color',new THREE.BufferAttribute(ca,3));pg.computeVertexNormals();const tm=new THREE.Mesh(pg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95}));tm.receiveShadow=true;g.add(tm);isDraws++;
 const H=(x,z)=>Math.max(isGY,isWildH(x,z));
 N.push(isCy(6.5,5,.6,14,0xff5a14,X+20,H(X+20,Z-16)+.5,Z-16));g.userData.smoke=new THREE.Vector3(X+20,H(X+20,Z-16)+2,Z-16);
 for(let i=0;i<9;i++){const u=i/8,x=X+10-u*22,z=Z-10+u*10,y=H(x,z);N.push(isB(3,.5,3.2,i%2?0xbfe6ff:0x8fd0ff,x,y+.3,z,.4))}{const px=X-15,pz=Z+3;const p=isCy(1,1,.2,18,0x2fa8e8,0,0,0);p.scale(8,1,6);p.translate(px,H(px,pz)+.25,pz);L.push(p)}
 for(let u=-28;u<=28;u+=8)L.push(isB(4,.05,.5,0xf3f3f3,X-18+u,isGY+.14,Z+58));L.push(isB(.2,5,.2,0xdddddd,X+18,isGY+2.5,Z+50),isCy(.5,.2,2,8,0xff7a1a,X+19.1,isGY+4.8,Z+50,0,0,Math.PI/2),isB(5,3,4,0x7a5a36,X-50,isGY+1.5,Z+48),isB(5.6,.3,4.6,0x8c3b2a,X-50,isGY+3.1,Z+48));isSolid(X-52.5,X-47.5,Z+46,Z+50,3.5);
 {const rx=X-46,rz=Z-38,ry=H(rx,rz);L.push(isB(16,.6,12,0x9a917f,rx,ry+.1,rz));for(const s of[[-6,-4.5],[-2,-4.5],[2,-4.5],[6,-4.5],[-6,4.5],[6,4.5],[2,4.5]])L.push(isCy(.6,.7,2+((s[0]+9)%4)*1.2,8,0xb3aa98,rx+s[0],ry+1.6+((s[0]+9)%4)*.6,rz+s[1]));L.push(isB(9,.7,1.3,0xb3aa98,rx+2,ry+5.4,rz-4.5),isB(2,1.4,2,0x8d8676,rx-2,ry+.9,rz+1))}
 {const cx=X-58,cz=Z+22;for(const s of[[0,0,0xd35400],[5,3,0x2e86c1],[-3,6,0x27ae60]])L.push(isCy(.1,2.2,2.6,4,s[2],cx+s[0],isGY+1.3,cz+s[1],.6));L.push(isCy(.9,.9,.25,8,0x4a4038,cx+2,isGY+.2,cz+4));N.push(isCy(.1,.5,.9,6,0xff8a2a,cx+2,isGY+.75,cz+4));L.push(isB(8,.4,2.2,0x8a6a45,cx-14,isGY,cz+2))}
 let n=0;for(let i=0;i<900&&n<70;i++){const a=(i*2.399),r=18+((i*37)%74),x=X+Math.cos(a)*r,z=Z+Math.sin(a)*r,h=isWildH(x,z);if(h<.6||h>20)continue;const fx=Math.abs(x-X+18),fz=Math.abs(z-Z-58);if(fx<40&&fz<10)continue;isPalm(x,z,h-.1,.8+((i*13)%7)*.09);n++}
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== islets, sandbars, sea platform =====
(function(){const g=isGroup('Islets',HALF+300,150,560),L=[],N=[];for(const q of isIslets){const e=isCy(1,1.05,1.5,18,0xe6d6a0,0,0,0);e.scale(q[2],1,q[2]*.8);e.translate(q[0],isGY-.75,q[1]);L.push(e);isPalm(q[0]-2,q[1]+1);isPalm(q[0]+3,q[1]-2);L.push(isG(new THREE.IcosahedronGeometry(1.6,0),0x7d7a72,q[0]+4,isGY+.5,q[1]+3))}
 const px=isPlat[0],pz=isPlat[1];for(const s of[[-7,-7],[7,-7],[-7,7],[7,7]])L.push(isCy(1,1,11,10,0xd9a520,px+s[0],2,pz+s[1]));L.push(isB(20,1,20,0x6d7278,px,7.5,pz),isB(7,4,6,0xe9ecef,px-5,10,pz-5),isCy(4.5,4.5,.1,20,0xffd23f,px+4,8.06,pz+4),isCy(4,4,.1,20,0x55585d,px+4,8.08,pz+4),isB(.6,14,.6,0xc0392b,px-8,15,pz+8),isB(.4,.4,12,0xc0392b,px-8,21,pz+3));N.push(isB(.6,.6,.6,0xff3030,px-8,22.4,pz+8));solids.push({minX:px-10,maxX:px+10,minZ:pz-10,maxZ:pz+10,h:8});
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
{const im=new THREE.InstancedMesh(isPalmGeo,isMatV,isPalmAt.length),d=new THREE.Object3D();isPalmAt.forEach((p,i)=>{d.position.set(p[0],p[1],p[2]);d.rotation.y=i*1.7;d.scale.setScalar(p[3]);d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.castShadow=true;im.frustumCulled=false;scene.add(im);isDraws++}

// ===== vehicle types =====
const isTY={},isVMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.2}),isVGlow=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});
function isCarGeo(s){const L2=s.L/2,W=s.W,gc=s.gc,body=[],dark=[],ex=[],gl=[],glass=[];
 if(s.box){body.push(prof([[-L2,gc],[L2,gc],[L2,s.belt],[L2-s.ws,s.roof],[-L2,s.roof]],W,.08));glass.push(prof([[L2+.02,s.belt+.08],[L2-s.ws+.03,s.roof-.14],[L2-s.ws-.05,s.roof-.14],[L2-.06,s.belt+.08]],W-.3,.03));
  const wl=s.L-s.ws-1.2-(s.cargo||0);if(wl>1)for(const x of[-W/2-.01,W/2+.01])dark.push(bxg(.05,(s.roof-s.belt)*.42,wl,x,s.belt+(s.roof-s.belt)*.55,-(L2-s.ws-.6-wl/2)))}
 else{const th=s.th===undefined?s.belt:s.th;body.push(prof([[-L2+.05,gc],[L2-.07,gc],[L2,gc+.2],[L2-.05,s.hh],[s.cf,s.belt],[s.cr,s.belt+(s.open?0:.02)],[-L2+.05,th],[-L2,gc+.25]],W,.07));
  if(s.open){glass.push(prof([[s.cf,s.belt],[s.cf-s.rf,s.roof],[s.cf-s.rf-.07,s.roof],[s.cf-.12,s.belt]],W-.3,.03));dark.push(bxg(W-.5,.25,(s.cf-s.cr)-.5,0,s.belt-.02,-(s.cf+s.cr)/2+.15));for(const x of[-.5,.5])dark.push(bxg(.62,.62,.2,x,s.belt+.25,-(s.cf-s.rf-.75)),bxg(.62,.62,.2,x,s.belt+.25,-(s.cr+.4)))}
  else{glass.push(prof([[s.cf,s.belt],[s.cf-s.rf,s.roof],[s.cr+s.rr,s.roof],[s.cr,s.belt]],W-.34,.05));const a=s.cf-s.rf,b=s.cr+s.rr;body.push(bxg(W-.36,.07,a-b+.1,0,s.roof+.075,-(a+b)/2),bxg(W-.23,s.roof-s.belt-.04,.1,0,(s.roof+s.belt)/2+.03,-(a+b)/2-.1))}
  if(s.bed)dark.push(bxg(W-.4,.06,(s.cr+L2)-.5,0,th+.03,(L2-s.cr)/2-s.cr-.02+.0))}
 dark.push(bxg(W+.06,.2,.22,0,gc+.1,-L2+.1),bxg(W+.06,.2,.22,0,gc+.1,L2-.1),bxg(W-.2,.2,s.L-.5,0,gc-.02,0));
 const zf=-s.wb/2+(s.wo||0),zr=s.wb/2+(s.wo||0);for(const x of[-W/2+.015,W/2-.015])for(const z of[zf,zr])dark.push(gT(new THREE.CylinderGeometry(s.r+.13,s.r+.13,.05,18),x,s.r+.02,z,0,0,Math.PI/2));
 const hy=(s.box?gc+.55:s.hh-.13),ty=(s.box?gc+.6:(s.th===undefined?s.belt:s.th)-.14);
 const head=U.mergeBufferGeometries([bxg(.5,.16,.08,-W/2+.45,hy,-L2+.03),bxg(.5,.16,.08,W/2-.45,hy,-L2+.03)]),tail=U.mergeBufferGeometries([bxg(.5,.15,.08,-W/2+.45,ty,L2-.03),bxg(.5,.15,.08,W/2-.45,ty,L2-.03)]);
 dark.push(bxg(W*.45,.2,.06,0,gc+.3,-L2+.01));
 if(s.extra)s.extra(body,dark,ex,gl,s);
 return {s,body:U.mergeBufferGeometries(body),glass:U.mergeBufferGeometries(glass),dark:U.mergeBufferGeometries(dark),head,tail,ex:ex.length?U.mergeBufferGeometries(ex):null,gl:gl.length?U.mergeBufferGeometries(gl):null,wz:[zf,zr]}}
const isSpecs={
 hatch:{mass:1.0,L:3.9,W:2.05,gc:.36,hh:.86,belt:1,roof:1.56,cf:.75,cr:-1.72,rf:.6,rr:.22,wb:2.45,r:.38,max:35},
 sedan:{mass:1.2,L:4.6,W:2.15,gc:.36,hh:.84,belt:1,roof:1.52,cf:.95,cr:-1.45,rf:.65,rr:.55,th:.98,wb:2.8,r:.4,max:38},
 coupe:{mass:1.2,L:4.4,W:2.15,gc:.33,hh:.8,belt:.96,roof:1.36,cf:.7,cr:-1.3,rf:.75,rr:.8,th:.95,wb:2.7,r:.4,max:47,acc:1.2},
 muscle:{mass:1.5,L:4.9,W:2.25,gc:.36,hh:.9,belt:1.02,roof:1.4,cf:.45,cr:-1.4,rf:.55,rr:.8,th:1,wb:2.95,r:.44,max:51,acc:1.35,turn:.9,extra:(b,d)=>{d.push(bxg(.9,.16,1.1,0,1.0,-1.5));b.push(bxg(2.05,.08,.4,0,1.12,2.25))}},
 super:{mass:1.3,L:4.5,W:2.3,gc:.26,hh:.6,belt:.82,roof:1.14,cf:.6,cr:-1,rf:.9,rr:.9,th:.86,wb:2.7,r:.4,max:63,acc:1.6,turn:1.15,extra:(b,d)=>{b.push(bxg(2.2,.06,.45,0,1.2,2.05),bxg(.08,.34,.25,-.85,1.03,2.05),bxg(.08,.34,.25,.85,1.03,2.05));d.push(bxg(1.7,.1,.5,0,.36,-2.2))}},
 suv:{mass:1.8,L:4.7,W:2.3,gc:.5,hh:1.05,belt:1.25,roof:1.95,cf:1,cr:-2.1,rf:.5,rr:.2,wb:2.9,r:.48,max:33,turn:.9,extra:(b,d)=>{d.push(bxg(.08,.08,2.4,-.8,2.06,.5),bxg(.08,.08,2.4,.8,2.06,.5))}},
 pickup:{mass:1.9,L:5.3,W:2.3,gc:.52,hh:1.08,belt:1.25,roof:1.9,cf:1.1,cr:-.3,rf:.5,rr:.12,th:1.18,wb:3.3,r:.48,max:34,bed:1,extra:(b)=>{b.push(bxg(.1,.28,2.2,-1.08,1.3,1.5),bxg(.1,.28,2.2,1.08,1.3,1.5),bxg(2.2,.28,.1,0,1.3,2.58))}},
 jeep:{mass:1.6,L:4,W:2.2,gc:.56,hh:1.12,belt:1.26,roof:1.92,cf:.6,cr:-1.2,rf:.2,rr:.1,open:1,wb:2.45,r:.52,max:32,extra:(b,d)=>{d.push(gT(new THREE.CylinderGeometry(.5,.5,.3,14),0,1.25,2.15,Math.PI/2),bxg(1.9,.1,.1,0,1.95,.2),bxg(.1,.7,.1,-.9,1.6,.2),bxg(.1,.7,.1,.9,1.6,.2),bxg(1.8,.3,.12,0,.75,-2.08))}},
 convertible:{mass:1.2,L:4.4,W:2.15,gc:.33,hh:.8,belt:.98,roof:1.4,cf:.75,cr:-.75,rf:.6,rr:0,th:.94,open:1,wb:2.7,r:.4,max:45,acc:1.15},
 classic:{mass:1.4,L:4.6,W:2.05,gc:.42,hh:1.02,belt:1.1,roof:1.66,cf:.5,cr:-1.25,rf:.28,rr:.5,th:.9,wb:2.9,r:.45,max:29,extra:(b,d,e)=>{for(const x of[-1.06,1.06])for(const z of[-1.45,1.45])b.push(gT(new THREE.CylinderGeometry(.62,.62,.34,14,1,false,0,Math.PI),x,.5,z,0,Math.PI/2,Math.PI/2));e.push(isCy(.2,.2,.1,10,0xfff6d0,-.72,.98,-2.28,0,Math.PI/2),isCy(.2,.2,.1,10,0xfff6d0,.72,.98,-2.28,0,Math.PI/2),isB(.9,.5,.08,0xcfd3d8,0,.82,-2.31))}},
 lowrider:{mass:1.5,L:5,W:2.25,gc:.22,hh:.8,belt:.95,roof:1.38,cf:.6,cr:-1.3,rf:.6,rr:.9,th:.9,wb:3,r:.35,max:35,extra:(b,d,e)=>{e.push(isB(.03,.08,4.4,0xe8c547,-1.13,.62,0),isB(.03,.08,4.4,0xe8c547,1.13,.62,0))}},
 limo:{mass:2.2,L:7.4,W:2.15,gc:.36,hh:.84,belt:1,roof:1.5,cf:2.3,cr:-2.8,rf:.65,rr:.55,th:.98,wb:5.1,r:.4,max:34,turn:.7,acc:.9},
 taxi:{mass:1.2,L:4.6,W:2.15,gc:.36,hh:.84,belt:1,roof:1.52,cf:.95,cr:-1.45,rf:.65,rr:.55,th:.98,wb:2.8,r:.4,max:39,col:0xf5c518,extra:(b,d,e,g)=>{g.push(isB(.9,.26,.36,0xfff2a0,0,1.76,.1));e.push(isB(.03,.16,3.2,0x111111,-1.085,.8,0),isB(.03,.16,3.2,0x111111,1.085,.8,0))}},
 van:{mass:2.0,box:1,L:5,W:2.3,gc:.42,belt:1.25,roof:2.3,ws:.85,wb:3.1,r:.44,max:31,cargo:2},
 boxtruck:{mass:3.5,box:1,L:6.8,W:2.5,gc:.5,belt:1.4,roof:2.5,ws:.7,wb:4.2,r:.5,max:28,turn:.75,acc:.85,cargo:9,extra:(b,d,e)=>{e.push(isB(2.56,2.6,4.6,0xf2f2f2,0,2.15,1.05),isB(2.58,.5,4.62,0x2e86c1,0,1.5,1.05))}},
 bus:{mass:6.0,box:1,L:10.6,W:2.7,gc:.45,belt:1.35,roof:3.05,ws:.45,wb:6,r:.52,max:25,turn:.55,acc:.7,extra:(b,d,e,g)=>{e.push(isB(2.72,.3,10.2,0xf2f2f2,0,1.05,0));g.push(isB(1.6,.3,.06,0xffb020,0,2.85,-5.29))}},
 ambulance:{mass:2.6,box:1,L:5.6,W:2.4,gc:.45,belt:1.3,roof:2.5,ws:.8,wb:3.4,r:.45,max:44,acc:1.1,col:0xf4f4f4,cargo:2.6,extra:(b,d,e,g)=>{e.push(isB(2.42,.3,5.3,0xd62828,0,1.15,.1),isB(.03,.9,.3,0xd62828,-1.21,1.95,1.2),isB(.03,.3,.9,0xd62828,-1.21,1.95,1.2),isB(.03,.9,.3,0xd62828,1.21,1.95,1.2),isB(.03,.3,.9,0xd62828,1.21,1.95,1.2));g.push(isB(.5,.2,.4,0xff2020,-.5,2.62,-1.6),isB(.5,.2,.4,0x2050ff,.5,2.62,-1.6))}},
 firetruck:{mass:5.0,box:1,L:8,W:2.6,gc:.5,belt:1.4,roof:2.6,ws:.6,wb:4.8,r:.52,max:36,turn:.65,col:0xc81d11,cargo:6,extra:(b,d,e,g)=>{e.push(isB(.5,.14,6.4,0xcfd3d8,0,2.95,.9),isB(.08,.3,6.4,0xcfd3d8,-.3,2.82,.9),isB(.08,.3,6.4,0xcfd3d8,.3,2.82,.9),isB(2.62,.25,7.6,0xf2f2f2,0,1.2,0),isCy(.3,.3,2.2,10,0xcfd3d8,-1.0,2.0,1.5,0,Math.PI/2));g.push(isB(1.4,.2,.4,0xff2020,0,2.72,-3.2))}}};
function isType(n){if(!isTY[n])isTY[n]=isCarGeo(isSpecs[n]);return isTY[n]}
function isBuildCar(n,col){const T=isType(n),s=T.s,g=new THREE.Group(),bm=new THREE.MeshPhysicalMaterial({color:s.col!==undefined?s.col:col,metalness:.5,roughness:.3,clearcoat:1,clearcoatRoughness:.06});
 const add=(geo,mat,sh)=>{const m=new THREE.Mesh(geo,mat);m.castShadow=!!sh;g.add(m);return m};add(T.body,bm,1);add(T.glass,CM.glass,1);add(T.dark,CM.dark);add(T.head,CM.head);add(T.tail,CM.tail);if(T.ex)add(T.ex,isVMat,1);if(T.gl)add(T.gl,isVGlow);
 g.userData.wheels=[];const k=s.r/.4;for(const x of[-s.W/2+.1,s.W/2-.1])for(const z of T.wz){const w=new THREE.Group(),ti=new THREE.Mesh(CAR.tire,CM.tire);ti.castShadow=true;w.add(ti,new THREE.Mesh(CAR.rim,CM.rim));w.scale.set(s.box?1.25:1,k,k);w.position.set(x,s.r,z);g.add(w);g.userData.wheels.push(w)}
 g.userData.max=s.max;g.userData.isAcc=s.acc||1;g.userData.isTurn=s.turn||1;g.userData.isType=n;g.userData.rlNoSwap=true;g.userData.isLen=s.L;g.userData.mass=s.mass||1.2;return g}
const isMix={mid:[['base',22],['hatch',12],['sedan',14],['coupe',6],['muscle',5],['suv',9],['pickup',6],['van',6],['taxi',6],['classic',3],['lowrider',3],['convertible',3],['jeep',2],['super',2],['boxtruck',2],['bus',2],['limo',1],['ambulance',1],['firetruck',.6]],
 down:[['base',20],['taxi',22],['sedan',14],['limo',7],['bus',7],['coupe',6],['super',5],['hatch',6],['van',5],['suv',4],['ambulance',2],['boxtruck',2]],
 beach:[['base',22],['convertible',20],['jeep',14],['super',7],['coupe',8],['hatch',8],['classic',6],['lowrider',6],['suv',5],['taxi',4]],
 sub:[['suv',24],['pickup',22],['sedan',14],['hatch',12],['base',10],['van',7],['muscle',6],['classic',3],['jeep',2]],
 port:[['boxtruck',30],['pickup',25],['van',25],['jeep',10],['suv',10]]};
function isZone(x,z){if(x>HALF+90)return Math.abs(x-isPX)<=isPA&&Math.abs(z-isPZ)<=isPB?'port':'beach';if(x>HALF-2*CELL-ROAD)return 'beach';if(x<-HALF+2*CELL+ROAD)return 'sub';return Math.hypot(x,z)<HALF*.4?'down':'mid'}
function isPick(zone){const m=isMix[zone]||isMix.mid;let t=0;for(const q of m)t+=q[1];let r=Math.random()*t;for(const q of m){r-=q[1];if(r<=0)return q[0]}return 'base'}
let isZoneHint=null;
{const mc=makeCar;makeCar=function(col,ty){if(ty!==undefined)return mc(col,ty);const n=isPick(isZoneHint||'mid');return n==='base'?mc(col):isBuildCar(n,col)}}
function isSwap(o,zone){const m=o.m,col=m.children[0]&&m.children[0].material&&m.children[0].material.color?m.children[0].material.color.getHex():0x888888;isZoneHint=zone||isZone(m.position.x,m.position.z);const n=isPick(isZoneHint);isZoneHint=null;if(n==='base')return;const g=isBuildCar(n,carColors[Math.floor(Math.random()*carColors.length)]);g.position.copy(m.position);g.rotation.copy(m.rotation);scene.remove(m);scene.add(g);o.m=g;o.hp=100}
for(const c of cars){if(c.vhT||c.vhBike||c.custom||c.dead||!c.m.userData.wheels||c.m.userData.wheels.length!==4)continue;if(typeof rlCarList!=='undefined'&&rlCarList.indexOf(c.m)<0)continue;isSwap(c)}
for(const t of traffic){if(t.dead)continue;const m=t.m,z=isZone(m.position.x,m.position.z);isSwap(t,z==='beach'||z==='sub'?z:(Math.random()<.5?'down':'mid'));const L=t.m.userData.isLen||4.4;if(L>6)t.spd=Math.min(t.spd,9)}

// ===== island vehicles, craft, peds, pickups, island traffic =====
const isIsleCars=[];
function isGrpAt(x,z){let best=null,bd=1e9;for(const g of isGroups){const c=g.userData.c;if(g.name==='Islets'||/Bridge|Span|Causeway/.test(g.name))continue;const d=Math.hypot(x-c[0],z-c[1]);if(d<bd){bd=d;best=g}}return best}
function isPark(n,x,z,ry,col){const g=isBuildCar(n,col===undefined?carColors[Math.floor(Math.random()*carColors.length)]:col);g.position.set(x,isGY,z);g.rotation.y=ry||0;scene.add(g);const c={m:g,speed:0,steer:0,hp:100};cars.push(c);isIsleCars.push({c,g:isGrpAt(x,z)});return c}
// Coral Key
isPark('convertible',isRX-34+5.6,isRZ-30,0);isPark('super',isRX+5.6,isRZ+40,Math.PI);isPark('jeep',isRX+34-5.6,isRZ-4,0);isPark('limo',isRX+48.6,isRZ-50,0,0xffffff);isPark('classic',isRX+48.6,isRZ+20,Math.PI,0x8fd8e8);isPark('convertible',isRX+48.6,isRZ+44,Math.PI,0xf7a8c4);isPark('suv',isRX-34-5.6,isRZ+50,0);isPark('taxi',isRX-48,isBZ+2.6,Math.PI/2);
// Metro Isle: yellow cabs and sedans at the curbs
for(let i=0;i<14;i++){const ax=isMAv[1+(i%4)]+(i%2?3.6:-3.6),z=isMZ-110+((i*37)%210);if(z>isMPark[2]-4&&z<isMPark[3]+4&&ax>isMPark[0]-6&&ax<isMPark[1]+6)continue;isPark(i%3===2?(i%2?'sedan':'limo'):'taxi',ax,z,i%2?Math.PI:0,i%3===2?0x1c1c1c:undefined)}
// Lucky Sands
isPark('limo',isSX-66,isSZ+14,Math.PI/2,0xffffff);isPark('super',isSX-40,isSZ+14,Math.PI/2,0xffd60a);isPark('super',isSX+20,isSZ-14,-Math.PI/2,0xe63946);isPark('convertible',isSX+44,isSZ-14,-Math.PI/2,0x9b5de5);isPark('limo',isSX+66,isSZ+14,Math.PI/2,0x1c1c1c);isPark('muscle',isSX-3,isSZ+40,0,0xf4a261);
// Hikari
for(let i=0;i<8;i++){const x=isHLx[1+(i%4)]+(i%2?1.6:-1.6),z=isHZ-60+((i*41)%120);isPark(['hatch','van','coupe','hatch','taxi','hatch','lowrider','sedan'][i],x,z,i%2?Math.PI:0)}
// Port Ironside and Ember Isle
isPark('boxtruck',isPX-30,isPZ+14,Math.PI/2);isPark('boxtruck',isPX+6,isPZ+16,Math.PI/2);isPark('pickup',isPX-64,isPZ+18,0);isPark('van',isPX+30,isPZ-2,Math.PI/2);isPark('jeep',isPX-76,isPZ-34,Math.PI/2);
isPark('jeep',isWX-40,isWZ+52,Math.PI/2,0x556b2f);isPark('pickup',isWX-52,isWZ+34,0,0x8a6a45);
// moving island traffic on loop roads (stealable; a car stops looping once the player has driven it)
const isLoops=[{pts:[[isMAv[0],isMSt[0]],[isMAv[5],isMSt[0]],[isMAv[5],isMSt[9]],[isMAv[0],isMSt[9]]],sp:9,types:['taxi','taxi','taxi','taxi','sedan','bus','taxi','limo']},
 {pts:[[isSX-isSA+6,isSZ-4],[isSX+isSA-6,isSZ-4],[isSX+isSA-6,isSZ+4],[isSX-isSA+6,isSZ+4]],sp:8,types:['limo','super','convertible','limo','taxi']},
 {pts:[[isHLx[0],isHLz[0]],[isHLx[5],isHLz[0]],[isHLx[5],isHLz[6]],[isHLx[0],isHLz[6]]],sp:7,types:['hatch','van','taxi','hatch','coupe']}];
for(const lp of isLoops){let per=0;lp.seg=[];for(let i=0;i<lp.pts.length;i++){const a=lp.pts[i],b=lp.pts[(i+1)%lp.pts.length],l=Math.hypot(b[0]-a[0],b[1]-a[1]);lp.seg.push([a,b,l,per]);per+=l}lp.per=per;lp.cars=[];
 lp.types.forEach((t,i)=>{const c=isPark(t,lp.pts[0][0],lp.pts[0][1],0,t==='taxi'?undefined:undefined);c.isLoop={lp,s:per*i/lp.types.length};lp.cars.push(c)})}
function isLoopPos(lp,s){s=((s%lp.per)+lp.per)%lp.per;for(const q of lp.seg)if(s<=q[3]+q[2]){const u=(s-q[3])/q[2],dx=(q[1][0]-q[0][0])/q[2],dz=(q[1][1]-q[0][1])/q[2];return [q[0][0]+dx*q[2]*u-dz*2.2,q[0][1]+dz*q[2]*u+dx*2.2,Math.atan2(-dx,-dz)]}return [lp.pts[0][0],lp.pts[0][1],0]}
const isCraft=[];
if(typeof vhMakeBike==='function'&&typeof vhBikes!=='undefined'){for(const q of[[isWX-30,isWZ+50,0xd35400],[isWX-26,isWZ+50,0x27ae60],[isWX-60,isWZ+30,0xf1c40f],[isRX-58,isRZ+30,0xe63946],[isLX-20,isLZ+20,0x8fd8e8],[isLX+22,isLZ+18,0xf7a8c4],[isHLx[1]+2,isHZ+20,0xff3c8e]]){const m=vhMakeBike(q[2]);m.position.set(q[0],isGY,q[1]);m.rotation.z=.14;scene.add(m);const c={m,speed:0,steer:0,hp:100,vhBike:true,vhEng:new THREE.Vector3(0,.7,0)};cars.push(c);vhBikes.push(c);isIsleCars.push({c,g:isGrpAt(q[0],q[1])})}}
function isJetSki(col){const g=new THREE.Group(),L=[isB(1,.5,2.8,col,0,.3,0),isCy(.5,0,1.1,4,col,0,.3,-1.9,Math.PI/4,-Math.PI/2),isB(.8,.3,1.2,0x1c1c1c,0,.7,.5),isB(.7,.5,.5,col,0,.75,-.5),isB(1,.08,.08,0x1c1c1c,0,1.05,-.55),isB(1.02,.1,2.6,0xffffff,0,.12,0)];const m=new THREE.Mesh(U.mergeBufferGeometries(L),isMatV);m.castShadow=true;g.add(m);return g}
function isYacht(){const g=new THREE.Group(),L=[isB(4.2,1.8,15,0xffffff,0,.6,0),isCy(2.1,0,4,4,0xffffff,0,.6,-9.5,Math.PI/4,-Math.PI/2),isB(3.6,1.4,7,0xf4f4f4,0,2.2,1),isB(3.7,.6,6.4,0x1c2a3a,0,2.3,1),isB(2.8,1.1,3.6,0xffffff,0,3.4,1.6),isB(2.9,.5,3.2,0x1c2a3a,0,3.5,1.6),isB(4.3,.12,5,0xb98a5a,0,1.56,5),isB(.1,2,.1,0xcfd3d8,0,4.9,1.6),isB(4.24,.25,15,0x1d3557,0,-.1,0)];const m=new THREE.Mesh(U.mergeBufferGeometries(L),isMatV);m.castShadow=true;g.add(m);return g}
function isShoreSpot(x0,z0,dx,dz){let x=x0,z=z0;for(let i=0;i<200&&isIsleH(x,z)>=0;i++){x+=dx;z+=dz}return [x+dx*2.2,z+dz*2.2]}
if(typeof vhBoats!=='undefined'){const addB=(m,p,ry,mx,eng)=>{m.position.set(p[0],0,p[1]);m.rotation.y=ry;scene.add(m);const c={m,speed:0,steer:0,hp:100,vhT:'boat',vhPh:p[0]*.1,vhEng:eng,isMax:mx,mass:mx<20?8:1};cars.push(c);vhBoats.push(c);isCraft.push(c);return c},js=new THREE.Vector3(0,.8,1.2),sb=new THREE.Vector3(0,.9,2.4);
 addB(isJetSki(0xe63946),isShoreSpot(isRX,isRZ+20,-1,0),Math.PI/2,44,js);addB(isJetSki(0x00b4d8),isShoreSpot(isRX,isRZ+27,-1,0),Math.PI/2,44,js);addB(isJetSki(0xffd60a),isShoreSpot(isWX,isWZ+26,-1,0),Math.PI/2,44,js);addB(isJetSki(0x80ed99),isShoreSpot(isPX,isPZ-34,-1,0),0,44,js);addB(isJetSki(0xff4fd8),isShoreSpot(isSX,isSZ+40,1,0),-Math.PI/2,44,js);addB(isJetSki(0xffffff),isShoreSpot(isLX,isLZ,-1,0),Math.PI/2,44,js);
 addB(isYacht(),isShoreSpot(isRX,isRZ-26,-1,0).map((v,i)=>i===0?v-9:v),0,17,new THREE.Vector3(0,1.6,6));
 if(typeof vhMakeBoat==='function'){addB(vhMakeBoat(0x1d70b8),isShoreSpot(isPX,isPZ-24,-1,0),0,36,sb);addB(vhMakeBoat(0xd62828),isShoreSpot(isWX,isWZ+34,-1,0),Math.PI/2,36,sb);addB(vhMakeBoat(0xffa200),isShoreSpot(isRX,isRZ+10,1,0),-Math.PI/2,36,sb);addB(vhMakeBoat(0x2a9d8f),isShoreSpot(isMX,isMZ+40,1,0),-Math.PI/2,36,sb);addB(vhMakeBoat(0xe9c46a),isShoreSpot(isHX,isHZ,1,0),-Math.PI/2,36,sb);addB(vhMakeBoat(0x264653),isShoreSpot(isLX,isLZ+10,0,1),Math.PI,36,sb)}}
if(typeof vhMakeHeli==='function'&&typeof vhHelis!=='undefined'){for(const q of[[isHeliPads[0][0],isHeliPads[0][1],0xffffff,isGY+.2],[isPlat[0]+4,isPlat[1]+4,0xffd23f,8.1],[isMX+60,isMZ+105,0x1d3557,isGY]]){const m=vhMakeHeli(q[2]);m.position.set(q[0],q[3],q[1]);m.rotation.y=Math.random()*6;scene.add(m);const c={m,speed:0,steer:0,hp:100,vhT:'heli',vy:0,vhSpin:0,vhFloor:q[3],vhEng:new THREE.Vector3(0,2.7,.4)};cars.push(c);vhHelis.push(c)}}
// decorative seaplane at Coral Key
{const L=[isCy(.9,.9,7,10,0xffffff,0,2.2,0,0,Math.PI/2),isCy(.9,.1,2,10,0xffffff,0,2.2,-4.5,0,-Math.PI/2),isCy(.9,.25,3,10,0xffffff,0,2.4,5,0,Math.PI/2),isB(13,.2,1.9,0xe63946,0,3.25,-.6),isB(4,.15,1.1,0xe63946,0,2.7,6),isB(.15,1.7,1.3,0xe63946,0,3.4,6),isB(1.5,.6,1.2,0x1c2a3a,0,2.75,-2.4)];for(const x of[-2,2]){L.push(isCy(.45,.45,7,8,0xcfd3d8,x,.35,-.3,0,Math.PI/2),isCy(.45,.05,1.4,8,0xcfd3d8,x,.35,-4.5,0,-Math.PI/2),isB(.12,1.6,.12,0x8d9299,x,1.2,-1.6),isB(.12,1.6,.12,0x8d9299,x,1.2,1.2))}L.push(isB(2.6,.12,.2,0x222222,0,2.2,-5.6,0,0,.5));const m=new THREE.Mesh(U.mergeBufferGeometries(L),isMatV);m.castShadow=true;const p=isShoreSpot(isRX,isRZ-30,1,0);m.position.set(p[0]+6,.1,p[1]);m.rotation.y=.4;scene.add(m);isDraws++}
for(const q of[[isRX+84,isRZ-10,2],[isRX-64,isRZ+26,3],[isPX-40,isPZ-48,0],[isPX+40,isPZ+60,4],[isWX-46,isWZ-38,2],[isWX+20,isWZ-16,4],[isPlat[0]+4,isPlat[1]+4,2],[isWX-58,isWZ+26,1],[isMPark[0]+6,isMPark[2]+6,3],[isSX+4,isSZ+12,0],[isHLx[2]+3,isHLz[3]+3,1],[isLX-30,isLZ+10,4]]){const d=PK[q[2]],m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:d.col,emissive:d.col,emissiveIntensity:1.6,toneMapped:false}));const h=q[0]===isPlat[0]+4?8.2:Math.max(isGY,isIsleH(q[0],q[1]));m.position.set(q[0],h+1,q[1]);scene.add(m);pickups.push({m,d,t:0,isY:h+1})}
const isPeds=[];
for(const q of[[isRX-5.4,isRZ-48,isRX-5.4,isRZ+58],[isRX-30,isRZ-9.5,isRX+30,isRZ-9.5],[isRX+70,isRZ-80,isRX+70,isRZ+70],[isRX+80,isRZ-30,isRX+86,isRZ+40],
 [isMAv[1]+5,isMZ-120,isMAv[1]+5,isMZ+120],[isMAv[4]+5,isMZ-120,isMAv[4]+5,isMZ+120],[isMPark[0]+8,isMPark[2]+8,isMPark[0]+8,isMPark[3]-8],[isMX-70,isMSt[8]+4.5,isMX+70,isMSt[8]+4.5],
 [isSX-80,isSZ-9,isSX+80,isSZ-9],[isSX-80,isSZ+9,isSX+80,isSZ+9],[isSX-20,isSZ+16,isSX+28,isSZ+16],
 [isHLx[2]-4,isHZ-74,isHLx[2]-4,isHZ+74],[isHX-66,isHLz[3]+4,isHX+66,isHLz[3]+4],[isHLx[4]+4,isHZ-74,isHLx[4]+4,isHZ+74],
 [isLX-36,isLZ+24,isLX+36,isLZ+24],[isLX-30,isLZ-30,isLX-38,isLZ+10],
 [isPX-70,isPZ+4,isPX+50,isPZ+4],[isPX+40,isPZ-50,isPX+66,isPZ+20],[isWX-56,isWZ+18,isWX-34,isWZ+46]]){const g=makePerson(new THREE.Color().setHSL(Math.random(),.45,.5),new THREE.Color().setHSL(Math.random(),.25,.28),[0xf1c27d,0xc68642,0x8d5524,0xe0ac69][isPeds.length%4]);g.position.set(q[0],isGY+.05,q[1]);scene.add(g);isPeds.push({g,a:[q[0],q[1]],b:[q[2],q[3]],u:Math.random(),d:1,sp:1.2+Math.random()*.7,w:0,grp:isGrpAt(q[0],q[1])})}
// ===== bounds, collisions, lifting =====
let isGuard=false,isLateOn=false;const isLast=new WeakMap();
// wdPierH is only widened while fixes' "car sinks in the ocean" check runs (between isTick and isLate), so the world's own lifting never grabs boats or helicopters
if(typeof wdPierH==='function'){const w0=wdPierH;wdPierH=function(x,z){const h=w0(x,z);if(h>=0||!isGuard)return h;return isLandAt(x,z)}}
function isClampBridge(p){if(p.x<HALF+42)return;const B=isOnBridge(p.x,p.z);if(!B||isIsleH(p.x,p.z)>=0)return;const lim=B.w/2-.8;if(B.ax==='x')p.z=Math.max(B.c-lim,Math.min(B.c+lim,p.z));else p.x=Math.max(B.c-lim,Math.min(B.c+lim,p.x))}
function isSolCol(p,r,maxH){let res=false;for(const s of isSol){if(maxH!==undefined&&p.y>s.h)continue;const cx=Math.max(s.minX,Math.min(p.x,s.maxX)),cz=Math.max(s.minZ,Math.min(p.z,s.maxZ)),dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;if(d2<r*r){const d=Math.sqrt(d2)||1e-4;if(d2===0)p.x+=r;else{p.x+=dx/d*(r-d);p.z+=dz/d*(r-d)}res=true}}return res}
const isXMax=HALF+760,isZMax=HALF+440;
{const c0=collide;collide=function(p,r,maxH){const ox=p.x,oz=p.z;if(ox<HALF+2)return c0(p,r,maxH);const h=isLandAt(ox,oz);
  if(h<0){const res=c0(p,r,maxH),clamped=Math.abs(p.x-ox)>.01||Math.abs(p.z-oz)>.01;if(!clamped||ox<=HALF+49)return res;
   const air=p!==pos&&p.y>1.5;if(air){p.x=Math.min(isXMax,ox);p.z=Math.max(-isZMax,Math.min(isZMax,oz));return isSolCol(p,r,maxH)}
   const l=isLast.get(p);if(l&&Math.hypot(ox-l.x,oz-l.z)<12){p.x=l.x;p.z=l.z;return true}const s=isNearShore(ox,oz);if(s&&isLandAt(s.x,s.z)>=0){p.x=s.x;p.z=s.z;return true}return res}
  if(ox<=HALF+49){const res=c0(p,r,maxH);isClampBridge(p);return res}
  p.x=ox;p.z=oz;const res=isSolCol(p,r,maxH);isClampBridge(p);if(isLandAt(p.x,p.z)<0){p.x=ox;p.z=oz}isLast.set(p,{x:p.x,z:p.z});return res}}
if(typeof fxBounds==='function'){const b0=fxBounds;fxBounds=function(c,m){if(isLandAt(m.position.x,m.position.z)>=0)return;b0(c,m)}}
// boats: wider sea limits so every island is reachable (the vehicles module caps boats at HALF+520 / +-HALF+190)
if(typeof vhDrive==='function'){const d0=vhDrive;vhDrive=function(dt,jx,jy){const c=driving,boat=c&&c.vhT==='boat',bx=boat?c.m.position.x:0,bz=boat?c.m.position.z:0;d0(dt,jx,jy);if(!boat||driving!==c)return;const m=c.m,p=m.position;
  const nx=bx-Math.sin(m.rotation.y)*c.speed*dt,nz=bz-Math.cos(m.rotation.y)*c.speed*dt;if(nx<HALF+42.5)return;p.x=Math.min(isXMax,nx);p.z=Math.max(-isZMax,Math.min(isZMax,nz));pos.x=p.x;pos.z=p.z}}
// leave a boat at any island shore (runs before the vehicles module's "get closer to the beach" check)
MODS.unshift(function(){if(carQ&&driving&&state==='play'&&driving.vhT==='boat'&&driving.m.position.x>HALF+53){const m=driving.m,s=isNearShore(m.position.x,m.position.z);if(!s)return;const h=isLandAt(s.x,s.z);if(h<0)return;carQ=false;driving.speed=0;driving=null;player.visible=true;pos.set(s.x,Math.max(.3,h),s.z);vel.set(0,0,0);onGround=true;toast('Ashore')}});
const isPrev=new THREE.Vector3();let isMapOn=false,isCullT=0;
function isLift(m,o){const x=m.position.x,z=m.position.z;if(x<HALF+2)return;const h=isLandAt(x,z);if(h>=0){m.position.y=h;m.userData.isUp=1}else if(m.userData.isUp){m.position.y=0;m.userData.isUp=0}}
function isLate(){isGuard=false}
function isTick(dt){dt=Math.max(0,dt);
 if(!isLateOn){isLateOn=true;MODS.push(isLate)}
 if(!isMapOn){isMapOn=true;try{if(typeof mpIcons!=='undefined')mpIcons.push({x:isRX,z:isRZ,label:'Coral Key',color:'#ff9ecd',glyph:'C'},{x:isMX,z:isMZ,label:'Metro Isle',color:'#cfd3d8',glyph:'M'},{x:isSX,z:isSZ,label:'Lucky Sands',color:'#ffe14d',glyph:'$'},{x:isHX,z:isHZ,label:'Hikari',color:'#ff3c8e',glyph:'H'},{x:isLX,z:isLZ,label:'Porto Luna',color:'#f7c59f',glyph:'L'},{x:isPX,z:isPZ,label:'Port Ironside',color:'#ffb347',glyph:'P'},{x:isWX,z:isWZ,label:'Ember Isle',color:'#7bd86a',glyph:'E'},{x:isHeliPads[0][0],z:isHeliPads[0][1],label:'Helipad',color:'#ffd23f',glyph:'H'},{x:isPlat[0],z:isPlat[1],label:'Sea Platform',color:'#cfd3d8',glyph:'S'});
  if(typeof mpLabels!=='undefined'){mpLabels.push({x:isRX,z:isRZ,text:'CORAL KEY',size:2},{x:isMX,z:isMZ,text:'METRO ISLE',size:2},{x:isSX,z:isSZ,text:'LUCKY SANDS',size:2},{x:isHX,z:isHZ,text:'HIKARI',size:2},{x:isLX,z:isLZ,text:'PORTO LUNA',size:2},{x:isPX,z:isPZ,text:'PORT IRONSIDE',size:2},{x:isWX,z:isWZ,text:'EMBER ISLE',size:2},{x:isRX+44,z:isRZ+20,text:'Ocean Strip',size:0},{x:(isMPark[0]+isMPark[1])/2,z:(isMPark[2]+isMPark[3])/2,text:'Commons Park',size:0});for(const B of isBr)mpLabels.push({x:B.ax==='x'?(B.lo+B.hi)/2:B.c+8,z:B.ax==='x'?B.c-9:(B.lo+B.hi)/2,text:B.name,size:0})}}catch(e){}}
 isCullT-=dt;if(isCullT<=0){isCullT=.4;const cx=cam.position.x,cz=cam.position.z;for(const g of isGroups){const c=g.userData.c;g.visible=Math.hypot(cx-c[0],cz-c[1])<c[2]+300}
  for(const q of isIsleCars)if(q.g)q.c.m.visible=q.g.visible||driving===q.c;for(const p of isPeds)p.g.visible=!p.grp||p.grp.visible}
 const night=1-Math.max(0,Math.min(1,Math.sin(dayT*Math.PI*2)*3+.5));
 for(const g of isGroups)if(g.userData.glow&&g.visible){const f=g.userData.neon?(.75+night*2.1)*(.92+.08*Math.sin(T*9+g.userData.c[0])):.35+night*2.2;g.userData.glow.material.color.setScalar(f)}
 for(const b of isFx.beams)b.visible=night>.3;if(isFx.jets&&isFx.jets.parent.visible){const s=Math.max(.15,Math.sin(T*.9)*.5+.5);isFx.jets.scale.set(1,1+s*14,1)}
 for(const g of isGroups)if(g.userData.smoke&&g.visible&&Math.random()<dt*6)burst(g.userData.smoke,1,0x555555,1.5,1.6,3,1.4);
 for(const p of isPeds){if(!p.g.visible||p.g.userData.dead)continue;const L=Math.hypot(p.b[0]-p.a[0],p.b[1]-p.a[1]);p.u+=p.d*p.sp*dt/L;if(p.u>1){p.u=1;p.d=-1}if(p.u<0){p.u=0;p.d=1}const x=p.a[0]+(p.b[0]-p.a[0])*p.u,z=p.a[1]+(p.b[1]-p.a[1])*p.u;p.g.position.set(x,Math.max(isGY,isIsleH(x,z))+.05,z);p.g.rotation.y=Math.atan2(-(p.b[0]-p.a[0])*p.d,-(p.b[1]-p.a[1])*p.d);p.w+=dt*p.sp*3;animLimbs(p.g,p.sp*2.5,p.w)}
 for(const lp of isLoops)for(const c of lp.cars){const q=c.isLoop;if(!q||c.dead)continue;if(driving===c){c.isLoop=null;continue}if(!c.m.visible)continue;const nx=isLoopPos(lp,q.s+lp.sp*dt);let hold=Math.hypot(nx[0]-pos.x,nx[1]-pos.z)<4.5;if(!hold)for(const o of lp.cars)if(o!==c&&o.isLoop){const d=((o.isLoop.s-q.s)%lp.per+lp.per)%lp.per;if(d>0&&d<9){hold=true;break}}
  if(!hold){q.s+=lp.sp*dt;const p=isLoopPos(lp,q.s);c.m.position.x=p[0];c.m.position.z=p[1];let da=((p[2]-c.m.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;c.m.rotation.y+=da*Math.min(1,dt*6);for(const w of c.m.userData.wheels)w.rotation.x-=lp.sp*dt*2}}
 // lift the player, cars, police and enemies onto bridges and island ground
 if(!driving){const h=isLandAt(pos.x,pos.z);if(h>=0&&pos.x>HALF+2){const ty=Math.max(.3,h+.02);if(vel.y<=30*dt+.001&&(pos.y<=ty+.12||(onGround&&pos.y<=ty+.9))){pos.y=ty;vel.y=state==='play'?30*dt:0;onGround=true}}}
 for(const c of cars){if(c.vhT==='heli'||c.vhT==='boat'||c.custom)continue;isLift(c.m,c)}
 for(const pc of police)isLift(pc.m,pc);
 for(const s of shooters){const g=s.g;if(g.position.x<HALF+2)continue;const h=isLandAt(g.position.x,g.position.z);if(h>=0)g.position.y=Math.max(.3,h)}
 for(const b of isCraft.concat(typeof vhBoats!=='undefined'?vhBoats:[])){if(b.dead)continue;const m=b.m;if(m.position.y>1.2&&isIsleH(m.position.x,m.position.z)<0)m.position.y=.02+Math.sin(T*1.8+(b.vhPh||0))*.09}
 for(const t of traffic){const L=t.m.userData.isLen;if(L&&L>6&&t.spd>9)t.spd=9}
 const c=driving;if(c&&state==='play'){const m=c.m,u=m.userData;
  if(c.vhT==='boat'){if(c.isMax){c.speed=Math.max(-6,Math.min(c.isMax,c.speed*(c.isMax>40?1.012:1)));if(c.isMax<20)c.speed*=Math.pow(.8,dt)}const p=m.position;if(isIsleH(p.x,p.z)>=0){p.x=isPrev.x;p.z=isPrev.z;if(Math.abs(c.speed)>14){toast('CRASH!');shake=.4;if(typeof vhDamage==='function')vhDamage(Math.abs(c.speed)*.6)}c.speed*=-.25}else isPrev.copy(p);
   const px=isPlat[0],pz=isPlat[1];for(const s of[[-7,-7],[7,-7],[-7,7],[7,7]])if(Math.hypot(p.x-px-s[0],p.z-pz-s[1])<2.4){p.x=isPrev.x;p.z=isPrev.z;c.speed*=-.25}}
  else if(!c.vhT&&!c.custom){let jx=joy.x,jy=joy.y;if(Math.hypot(jx,jy)<.22){jx=0;jy=0}if(u.isAcc&&u.isAcc!==1)c.speed+=-jy*28*dt*(u.isAcc-1);if(u.isTurn&&u.isTurn!==1)m.rotation.y+=-jx*dt*Math.min(1,Math.abs(c.speed)/6)*2.2*Math.sign(c.speed||1)*(u.isTurn-1)}}
 for(const p of pickups)if(p.isY!==undefined&&p.m.visible)p.m.position.y=p.isY+Math.sin(T*3+p.m.position.x)*.25;
 isGuard=true}
MODS.push(isTick);

// ---------- crime: police escalation (helicopters, SWAT, army, roadblocks, BUSTED), store robberies, interiors, street life ----------
const cpTH=[0,1,3,6,10,16];function cpStars(n){if(wantedScore<cpTH[n])wantedScore=cpTH[n]}
function cpCol(g,c){const col=new THREE.Color(c),n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=col.r;a[i*3+1]=col.g;a[i*3+2]=col.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
const cpB=(w,h,d,x,y,z,c)=>cpCol(bxg(w,h,d,x,y,z),c),cpCy=(r,h,n,x,y,z,c,rx,rz)=>cpCol(gT(new THREE.CylinderGeometry(r,r,h,n),x,y,z,rx||0,0,rz||0),c);
const cpVM=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.15}),cpGlow=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}),cpMG=a=>U.mergeBufferGeometries(a);
const cpR=(a,b)=>a+Math.random()*(b-a);
const cpFlat=new THREE.MeshBasicMaterial({vertexColors:true}),cpFlatIn=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide});
function cpShade(g,inv){const c=g.attributes.color,n=g.attributes.normal;for(let i=0;i<c.count;i++){const s=inv?-1:1,f=.74+.26*n.getY(i)*s+.1*n.getZ(i)*s-.06*Math.abs(n.getX(i));c.setXYZ(i,c.getX(i)*f,c.getY(i)*f,c.getZ(i)*f)}return g}
// ----- banner (BUSTED / WASTED) -----
const cpBan=document.createElement('div');cpBan.style.cssText='position:fixed;left:0;right:0;top:34%;text-align:center;pointer-events:none;z-index:40;opacity:0;transition:opacity .35s;background:linear-gradient(90deg,transparent,#000c 25%,#000c 75%,transparent);padding:10px 0';document.body.appendChild(cpBan);
function cpBanner(t,col,sub,sec){cpBan.innerHTML='<div style="font-weight:900;font-style:italic;font-size:50px;letter-spacing:3px;color:'+col+';text-shadow:0 3px 0 #000">'+t+'</div><div style="color:#fff;font-weight:700;font-size:15px">'+(sub||'')+'</div>';cpBan.style.opacity=1;clearTimeout(cpBanner.h);cpBanner.h=setTimeout(()=>{cpBan.style.opacity=0},(sec||3)*1000)}
{const d0=die;die=function(){const c0=cash;d0();$('msg').style.display='none';cpBanner('WASTED','#e03a3a','Hospital bill -$'+(c0-cash),3.3)}}
// ----- menus -----
const cpPan=document.createElement('div');cpPan.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;display:none;align-items:center;justify-content:center;background:#0009;z-index:70';document.body.appendChild(cpPan);let cpPanCb=null;
function cpOpen(html,cb){cpPanCb=cb;cpPan.innerHTML='<div style="width:min(430px,90vw);max-height:86vh;overflow:auto;background:#14171cf2;border:2px solid #ffd23f;border-radius:16px;padding:14px 16px;color:#fff;font-weight:700;font-size:15px;line-height:1.55">'+html+'</div>';cpPan.style.display='flex';state='cpmenu';joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;fireId=null;burstN=0;jumpQ=carQ=false;vel.x=vel.z=0}
function cpClose(){cpPan.style.display='none';if(state==='cpmenu')state='play'}
function cpBtn(k,t,c){return '<div data-k="'+k+'" style="display:inline-block;margin:10px 8px 0 0;padding:10px 18px;border-radius:12px;background:'+(c||'#ffd23f')+';color:#000;font-weight:900">'+t+'</div>'}
cpPan.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const b=e.target&&e.target.closest?e.target.closest('[data-k]'):null;if(b&&cpPanCb)cpPanCb(b.getAttribute('data-k'))},{passive:false});
let cpSave={own:false,car:null};try{const j=JSON.parse(localStorage.getItem('blockcity_cp')||'null');if(j)cpSave=j}catch(e){}
function cpStore(){try{localStorage.setItem('blockcity_cp',JSON.stringify(cpSave))}catch(e){}if(typeof msSave==='function')msSave()}
// ----- places: stores, banks, safehouse, police station, hospital, club -----
// ===== interiors v2: furnished rooms, storefronts with real doors, seamless enter/exit, counters =====
const cpTypes={store:{l:'24/7 MART',c:0x3ddc84,stars:2,dur:7,pay:[300,900]},jewel:{l:'LUMIERE JEWELS',c:0x5fe3ff,stars:3,dur:9,pay:[2300,2900]},bank:{l:'MERIDIAN BANK',c:0xffc93c,stars:4,dur:16,pay:[8000,12000]},
 safe:{l:'APARTMENTS',c:0x4a9dff},police:{l:'POLICE',c:0x5a7dff},hosp:{l:'HOSPITAL',c:0xff4d6d},club:{l:'CLUB NEON',c:0xff3df2},gun:{l:'IRONSIGHT GUNS',c:0xffb020},clinic:{l:'CITY CLINIC',c:0xff6f91},estate:{l:'PRIME KEY REALTY',c:0x6dff8a}};
const cpPlaces=[],cpRooms={},cpNPC=new THREE.Group();scene.add(cpNPC);
const cpLight=new THREE.PointLight(0xfff2dd,0,30,1.4);scene.add(cpLight);
// ---- textures ----
const cpAni=Math.min(8,(renderer.capabilities.getMaxAnisotropy&&renderer.capabilities.getMaxAnisotropy())||4);
function cpCT(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=cpAni;return t}
function cpSpeck(g,w,h,n,cols,sz){for(let i=0;i<n;i++){g.fillStyle=cols[i%cols.length];const s=sz*(.5+Math.random());g.fillRect(Math.random()*w,Math.random()*h,s,s)}}
const cpTX={},cpRough={tile:.3,wood:.5,carpet:.98,marble:.14,vinyl:.42,concrete:.85,dark:.2};
function cpTexOf(k){if(cpTX[k])return cpTX[k];const S=256;let t;
 if(k==='tile')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#d9d7d1';g.fillRect(0,0,w,h);for(let i=0;i<4;i++)for(let j=0;j<4;j++){const v=212+Math.random()*26|0;g.fillStyle='rgb('+v+','+(v-2)+','+(v-7)+')';g.fillRect(i*64+2,j*64+2,60,60)}cpSpeck(g,w,h,1400,['rgba(0,0,0,.05)','rgba(255,255,255,.07)'],2);g.fillStyle='rgba(80,80,80,.55)';for(let i=0;i<=4;i++){g.fillRect(i*64-1,0,2,h);g.fillRect(0,i*64-1,w,2)}});
 else if(k==='wood')t=cpCT(S,S,(g,w,h)=>{const cs=['#8a5a36','#9c6a43','#7a4b2c','#a8744a','#93603b'];for(let r=0;r<6;r++){const y=r*42.67;g.fillStyle=cs[(r*3+1)%5];g.fillRect(0,y,w,43);for(let k2=0;k2<26;k2++){g.strokeStyle='rgba(40,20,5,'+(.05+Math.random()*.08)+')';g.lineWidth=1;g.beginPath();const yy=y+Math.random()*42;g.moveTo(0,yy);for(let x=0;x<=w;x+=32)g.lineTo(x,yy+Math.sin(x/40+k2)*2);g.stroke()}g.fillStyle='rgba(20,10,0,.55)';g.fillRect(0,y,w,1.5);const sx=(r*97)%w;g.fillRect(sx,y,1.5,43)}});
 else if(k==='carpet')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#9a9a9a';g.fillRect(0,0,w,h);cpSpeck(g,w,h,9000,['rgba(0,0,0,.09)','rgba(255,255,255,.09)','rgba(0,0,0,.05)'],1.6)});
 else if(k==='marble')t=cpCT(512,512,(g,w,h)=>{g.fillStyle='#f2efe9';g.fillRect(0,0,w,h);for(let i=0;i<40;i++){g.fillStyle='rgba(200,195,185,'+Math.random()*.15+')';g.beginPath();g.arc(Math.random()*w,Math.random()*h,20+Math.random()*60,0,7);g.fill()}for(let v=0;v<16;v++){g.strokeStyle='rgba(120,115,110,'+(.12+Math.random()*.2)+')';g.lineWidth=.6+Math.random()*2.2;g.beginPath();let x=Math.random()*w,y=Math.random()*h;g.moveTo(x,y);for(let s=0;s<30;s++){x+=(Math.random()-.4)*28;y+=(Math.random()-.5)*28;g.lineTo(x,y)}g.stroke()}g.strokeStyle='rgba(90,90,90,.35)';g.lineWidth=2;g.strokeRect(0,0,w,h)});
 else if(k==='vinyl')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#d6d6d4';g.fillRect(0,0,w,h);cpSpeck(g,w,h,3000,['rgba(0,0,0,.08)','rgba(255,255,255,.1)','rgba(60,80,90,.08)'],2.2);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(0,0,w,1.5);g.fillRect(0,0,1.5,h);g.fillRect(0,128,w,1);g.fillRect(128,0,1,h)});
 else if(k==='concrete')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#9d9c98';g.fillRect(0,0,w,h);for(let i=0;i<60;i++){g.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,255,255')+','+Math.random()*.06+')';g.beginPath();g.arc(Math.random()*w,Math.random()*h,8+Math.random()*30,0,7);g.fill()}cpSpeck(g,w,h,2500,['rgba(0,0,0,.08)','rgba(255,255,255,.06)'],1.5);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,0,w,1.5)});
 else if(k==='dark')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#202024';g.fillRect(0,0,w,h);cpSpeck(g,w,h,2500,['rgba(255,255,255,.04)','rgba(0,0,0,.2)'],1.5);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(0,0,w,2);g.fillRect(0,0,2,h)});
 else if(k==='plaster')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#efefef';g.fillRect(0,0,w,h);cpSpeck(g,w,h,5000,['rgba(0,0,0,.025)','rgba(255,255,255,.05)'],2)});
 else if(k==='wallpaper')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#e6e6e6';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=32){g.fillStyle='rgba(0,0,0,.07)';g.fillRect(x,0,12,h);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(x+16,0,3,h)}for(let y=16;y<h;y+=32)for(let x=22;x<w;x+=32){g.fillStyle='rgba(0,0,0,.08)';g.beginPath();g.arc(x,y,3,0,7);g.fill()}});
 else if(k==='brick')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#b9b1a6';g.fillRect(0,0,w,h);const cs=['#8b4a3a','#9a5442','#7d3f31','#a35d47','#874636'];for(let r=0;r<8;r++)for(let c2=-1;c2<4;c2++){const x=c2*64+(r%2?32:0);g.fillStyle=cs[(r*5+c2*3+11)%5];g.fillRect(x+2,r*32+2,60,28)}cpSpeck(g,w,h,2500,['rgba(0,0,0,.1)','rgba(255,255,255,.06)'],2)});
 else if(k==='acoustic')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#f1f1ee';g.fillRect(0,0,w,h);cpSpeck(g,w,h,3500,['rgba(0,0,0,.08)'],1.4);g.fillStyle='rgba(120,120,120,.6)';g.fillRect(0,0,w,3);g.fillRect(0,0,3,h);g.fillRect(0,127,w,2);g.fillRect(127,0,2,h)});
 else if(k==='view')t=cpCT(512,256,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,'#7fbfff');q.addColorStop(.75,'#e6f4ff');q.addColorStop(1,'#cfd8df');g.fillStyle=q;g.fillRect(0,0,w,h);const s=g.createRadialGradient(390,60,4,390,60,90);s.addColorStop(0,'rgba(255,250,225,.95)');s.addColorStop(1,'rgba(255,250,225,0)');g.fillStyle=s;g.fillRect(0,0,w,h);
   for(let i=0;i<22;i++){const bw=18+Math.random()*40,bh=40+Math.random()*140,x=Math.random()*w;g.fillStyle=['#b8c7d6','#a7b9cc','#c7d3df','#9fb0c3'][i%4];g.fillRect(x,h-30-bh,bw,bh);g.fillStyle='rgba(255,255,255,.35)';for(let y=h-26-bh;y<h-36;y+=9)for(let xx=x+3;xx<x+bw-4;xx+=7)g.fillRect(xx,y,3,4)}
   for(let i=0;i<5;i++){const x=40+i*110+Math.random()*30;g.strokeStyle='#5b4a3a';g.lineWidth=4;g.beginPath();g.moveTo(x,h-28);g.quadraticCurveTo(x+6,h-80,x+2,h-120);g.stroke();g.strokeStyle='#3f7a3a';g.lineWidth=5;for(let a=0;a<7;a++){g.beginPath();g.moveTo(x+2,h-120);g.quadraticCurveTo(x+2+Math.cos(a)*22,h-132,x+2+Math.cos(a*.9)*40,h-110+Math.sin(a)*10);g.stroke()}}
   g.fillStyle='#8f969c';g.fillRect(0,h-30,w,30);g.fillStyle='#b9bec2';g.fillRect(0,h-30,w,5)});
 else if(k==='glimpse')t=cpCT(1024,512,(g,w,h)=>{const pal=[['#fff4d8','#d8c29a','#3ddc84'],['#3a2850','#160e22','#9ff3ff'],['#fff1dc','#cdb894','#c9a227'],['#ffe9c7','#c29b66','#ff9a3c'],['#6b5642','#2b221a','#ffb020'],['#f4fbfb','#cfe3e2','#3aa6a0'],['#f3eadb','#c9b79a','#6dff8a'],['#1a0f24','#05030a','#ff3df2']];
   for(let v=0;v<8;v++){g.save();g.translate((v%4)*256,(v>>2)*256);g.beginPath();g.rect(0,0,256,256);g.clip();const P=pal[v],q=g.createLinearGradient(0,0,0,256);q.addColorStop(0,P[0]);q.addColorStop(1,P[1]);g.fillStyle=q;g.fillRect(0,0,256,256);
    if(v!==7)for(let i=0;i<3;i++){g.fillStyle='rgba(255,255,240,.8)';g.fillRect(30+i*80,8,50,6)}
    if(v<4){for(let s=0;s<4;s++){const y=90+s*40;g.fillStyle='rgba(40,30,20,.55)';g.fillRect(0,y,256,5);for(let x=4;x<252;x+=9+Math.random()*7){g.fillStyle=v===1?'rgba(255,255,255,'+(.2+Math.random()*.6)+')':['#e63946','#f4a261','#2a9d8f','#ffd60a','#1d70b8','#9b5de5'][Math.random()*6|0];g.fillRect(x,y-8-Math.random()*16,6,20)}}}
    else if(v===4){g.fillStyle='#4a3a2a';g.fillRect(0,60,256,120);for(let r=0;r<3;r++)for(let i=0;i<6;i++){const x=12+i*42,y=78+r*36;g.fillStyle='#17181a';g.fillRect(x,y,34,5);g.fillRect(x+24,y+3,9,9);g.fillRect(x+4,y+4,4,8)}g.fillStyle='#2b2b2b';g.fillRect(0,196,256,30);g.fillStyle='rgba(200,230,255,.25)';g.fillRect(0,190,256,8)}
    else if(v===5){g.fillStyle='#3aa6a0';g.fillRect(0,120,256,6);g.fillStyle='#ff3050';g.fillRect(170,46,40,12);g.fillRect(184,32,12,40);for(let i=0;i<6;i++){g.fillStyle='#3aa6a0';g.fillRect(14+i*36,170,28,22);g.fillRect(14+i*36,150,28,8);g.fillStyle='#333';g.fillRect(16+i*36,192,4,20);g.fillRect(36+i*36,192,4,20)}g.fillStyle='#fff';g.fillRect(20,70,110,60);g.fillStyle='#9ad1d4';g.fillRect(28,80,94,8)}
    else if(v===6){for(let i=0;i<3;i++){g.fillStyle='#5b3a29';g.fillRect(10+i*84,150,70,10);g.fillStyle='#4a3426';g.fillRect(14+i*84,160,6,50);g.fillRect(70+i*84,160,6,50);g.fillStyle='#111';g.fillRect(30+i*84,118,34,26);g.fillStyle='#5fb8ff';g.fillRect(33+i*84,121,28,20)}
     for(let i=0;i<4;i++){g.fillStyle='#f6efe2';g.fillRect(14+i*62,46,46,40);g.fillStyle='#a5482f';g.beginPath();g.moveTo(12+i*62,58);g.lineTo(37+i*62,40);g.lineTo(62+i*62,58);g.fill();g.fillStyle='#7cb342';g.fillRect(14+i*62,78,46,8)}}
    else{for(let i=0;i<9;i++){g.strokeStyle=['#ff2bd6','#2bd6ff','#7a2bff'][i%3];g.lineWidth=3;g.globalAlpha=.8;g.beginPath();g.moveTo(Math.random()*256,0);g.lineTo(Math.random()*256,256);g.stroke()}g.globalAlpha=1;for(let i=0;i<7;i++){const x=14+i*34+Math.random()*8,y=150+Math.random()*20;g.fillStyle='#0a0610';g.beginPath();g.arc(x,y,9,0,7);g.fill();g.fillRect(x-11,y+8,22,60)}}
    g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,216,256,40);g.fillStyle=P[2];g.globalAlpha=.6;g.fillRect(0,212,256,4);g.globalAlpha=1;g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.moveTo(0,0);g.lineTo(90,0);g.lineTo(10,256);g.lineTo(0,256);g.fill();g.restore()}});
 else if(k==='street')t=cpCT(512,256,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,110);q.addColorStop(0,'#9fd0ff');q.addColorStop(1,'#e8f4ff');g.fillStyle=q;g.fillRect(0,0,w,h);
   for(let i=0;i<7;i++){const x=i*76-10+Math.random()*12,bw=70,bh=90+Math.random()*60,c=['#c9cfd6','#e0b48a','#9fb3c8','#d8d0b8','#b88a7a'][i%5];g.fillStyle=c;g.fillRect(x,150-bh,bw,bh);g.fillStyle='rgba(28,42,58,.75)';for(let y=150-bh+8;y<140;y+=16)for(let xx=x+6;xx<x+bw-8;xx+=14)g.fillRect(xx,y,8,10);g.fillStyle=['#b3261e','#1f6f43','#1c3f7a','#d9772b'][i%4];g.fillRect(x+6,128,bw-12,8)}
   g.fillStyle='#8c8e92';g.fillRect(0,150,w,16);g.fillStyle='#2f3136';g.fillRect(0,166,w,52);g.fillStyle='#f4d03f';for(let x=0;x<w;x+=60)g.fillRect(x,190,34,3);g.fillStyle='#8c8e92';g.fillRect(0,218,w,38);g.fillStyle='#6f7176';g.fillRect(0,218,w,3);
   for(const cx of[60,300]){const c=['#e63946','#1d70b8','#ffffff','#2a9d8f'][Math.random()*4|0];g.fillStyle=c;g.fillRect(cx,182,92,20);g.fillRect(cx+18,170,54,14);g.fillStyle='#223344';g.fillRect(cx+22,172,22,10);g.fillRect(cx+48,172,20,10);g.fillStyle='#111';g.beginPath();g.arc(cx+18,203,7,0,7);g.arc(cx+74,203,7,0,7);g.fill()}
   g.fillStyle='#333';g.fillRect(440,96,5,122);g.fillRect(420,94,30,6)});
 cpTX[k]=t;return t}
function cpAtlasTex(){if(cpTX.atlas)return cpTX.atlas;return cpTX.atlas=cpCT(1024,1024,g=>{const C=(i,f)=>{g.save();g.translate((i%4)*256,(i>>2)*256);g.beginPath();g.rect(0,0,256,256);g.clip();f();g.restore()};
 const T=(t,x,y,sz,col,wt)=>{g.fillStyle=col;g.font=(wt||'900')+' '+sz+'px -apple-system,Helvetica,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,x,y)};
 const GR=(a,b)=>{const q=g.createLinearGradient(0,0,0,256);q.addColorStop(0,a);q.addColorStop(1,b);g.fillStyle=q;g.fillRect(0,0,256,256)};
 C(0,()=>{GR('#e0262b','#8f0f14');g.fillStyle='#fff';g.beginPath();g.ellipse(128,152,34,68,0,0,7);g.fill();g.fillRect(116,62,24,42);g.fillStyle='#e0262b';g.fillRect(100,142,56,22);T('FIZZ UP',128,38,40,'#fff');T('ICE COLD',128,232,22,'#ffd60a')});
 C(1,()=>{GR('#6a2bd1','#ff8a00');g.fillStyle='#ffd23f';g.beginPath();g.moveTo(70,80);g.lineTo(186,80);g.lineTo(176,200);g.lineTo(80,200);g.closePath();g.fill();T('NOVA',128,120,36,'#6a2bd1');T('CHIPS',128,160,30,'#e0262b');T('NEW FLAVOR',128,232,20,'#fff')});
 C(2,()=>{GR('#0f8a4a','#05391e');T('SUPER',128,46,34,'#fff');T('7',128,140,130,'#ffd60a');T('LOTTO $2',128,230,24,'#fff')});
 C(3,()=>{GR('#ffd60a','#ff9f1c');g.fillStyle='#c2410c';g.beginPath();g.ellipse(128,130,80,24,0,0,7);g.fill();g.fillStyle='#7c2d12';g.beginPath();g.ellipse(128,124,70,12,0,0,7);g.fill();T('HOT DOG',128,50,38,'#7c2d12');T('$1.99',128,205,46,'#b91c1c')});
 C(4,()=>{GR('#141018','#000');g.strokeStyle='#e6c26a';g.lineWidth=5;g.beginPath();g.moveTo(128,70);g.lineTo(180,110);g.lineTo(128,190);g.lineTo(76,110);g.closePath();g.moveTo(76,110);g.lineTo(180,110);g.stroke();T('LUMIERE',128,222,32,'#e6c26a','700')});
 C(5,()=>{GR('#0f1f3d','#08122a');g.strokeStyle='#d4af37';g.lineWidth=8;g.strokeRect(24,24,208,208);T('M',128,112,120,'#d4af37','700');T('MERIDIAN TRUST',128,200,21,'#d4af37','700')});
 C(6,()=>{g.fillStyle='#efe3c4';g.fillRect(0,0,256,256);T('WANTED',128,36,40,'#3a2a1a');g.fillStyle='#3a2a1a';g.beginPath();g.arc(128,108,34,0,7);g.fill();g.fillRect(84,140,88,70);T('REWARD $5,000',128,232,20,'#7a1010')});
 C(7,()=>{GR('#1d3557','#0b1a30');g.fillStyle='#d9b44a';g.beginPath();for(let k=0;k<12;k++){const a=k*Math.PI/6,r=k%2?40:70;g.lineTo(128+Math.cos(a)*r,110+Math.sin(a)*r)}g.closePath();g.fill();T('SERVE',128,204,26,'#fff');T('AND PROTECT',128,234,20,'#d9b44a')});
 C(8,()=>{g.fillStyle='#f4fbfb';g.fillRect(0,0,256,256);g.fillStyle='#3aa6a0';g.fillRect(0,0,256,56);T('HEALTH TIP',128,30,28,'#fff');g.fillStyle='#7fd1cb';for(let k=0;k<5;k++){g.beginPath();g.arc(70+k*29,130,14,0,7);g.fill()}T('WASH YOUR',128,184,26,'#1f5f5b');T('HANDS',128,216,30,'#1f5f5b')});
 C(9,()=>{g.fillStyle='#efefef';g.fillRect(0,0,256,256);for(let k=6;k>0;k--){g.fillStyle=k%2?'#111':'#f5f5f5';g.beginPath();g.arc(128,120,k*17,0,7);g.fill()}g.fillStyle='#e0262b';g.beginPath();g.arc(128,120,9,0,7);g.fill();T('IRONSIGHT',128,236,22,'#e0262b')});
 C(10,()=>{const q=g.createLinearGradient(0,0,256,256);q.addColorStop(0,'#ff2bd6');q.addColorStop(1,'#2b6cff');g.fillStyle=q;g.fillRect(0,0,256,256);T('NIGHT',128,100,50,'#fff');T('SHIFT',128,152,50,'#fff');T('FRI - SAT',128,220,22,'#ffe')});
 C(11,()=>{g.fillStyle='#f3eee2';g.fillRect(0,0,256,256);const cs=['#e63946','#1d70b8','#f4a261','#2a9d8f','#111'];for(let k=0;k<7;k++){g.fillStyle=cs[k%5];g.fillRect(20+Math.random()*170,20+Math.random()*170,30+Math.random()*60,30+Math.random()*60)}});
 C(12,()=>{GR('#0b3c5d','#328cc1');g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=6;for(let k=0;k<6;k++){g.beginPath();for(let x=0;x<=256;x+=8)g.lineTo(x,60+k*32+Math.sin(x/30+k)*12);g.stroke()}});
 C(13,()=>{const q=g.createLinearGradient(0,0,0,256);q.addColorStop(0,'#ff9a5a');q.addColorStop(.6,'#ffd29a');q.addColorStop(.61,'#2d4a6b');q.addColorStop(1,'#14263d');g.fillStyle=q;g.fillRect(0,0,256,256);g.fillStyle='#ffe9b0';g.beginPath();g.arc(128,150,34,0,7);g.fill();g.fillStyle='#1d2b3d';g.fillRect(0,154,256,4)});
 C(14,()=>{GR('#8fd3ff','#e8f6ff');g.fillStyle='#7cb342';g.fillRect(0,190,256,66);g.fillStyle='#f6efe2';g.fillRect(60,110,136,90);g.fillStyle='#a5482f';g.beginPath();g.moveTo(48,112);g.lineTo(128,58);g.lineTo(208,112);g.closePath();g.fill();g.fillStyle='#5b3a29';g.fillRect(116,150,24,50);g.fillStyle='#9fd8ff';g.fillRect(76,128,28,22);g.fillRect(152,128,28,22);g.fillStyle='#c62828';g.fillRect(0,0,256,34);T('FOR SALE',128,18,22,'#fff')});
 C(15,()=>{GR('#0f2b1d','#071810');g.strokeStyle='#6dff8a';g.lineWidth=10;g.beginPath();g.arc(100,110,34,0,7);g.stroke();g.beginPath();g.moveTo(134,110);g.lineTo(200,110);g.lineTo(200,132);g.moveTo(178,110);g.lineTo(178,128);g.stroke();T('PRIME KEY',128,190,30,'#6dff8a');T('REALTY',128,224,22,'#d7ffe0')});
})}
// ---- shared interior materials ----
const cpIF=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.58,metalness:.06,envMapIntensity:.45}),
 cpIG=new THREE.MeshStandardMaterial({color:0xd6ecf5,transparent:true,opacity:.2,roughness:.04,metalness:.25,depthWrite:false,envMapIntensity:1.2}),
 cpAtM=new THREE.MeshStandardMaterial({map:cpAtlasTex(),roughness:.55,envMapIntensity:.3}),cpWinM=new THREE.MeshBasicMaterial({map:cpTexOf('view'),toneMapped:false}),cpStreetM=new THREE.MeshBasicMaterial({map:cpTexOf('street'),toneMapped:false}),
 cpProdMat=new THREE.MeshStandardMaterial({roughness:.5,envMapIntensity:.4}),cpUBox=new THREE.BoxGeometry(1,1,1),cpUBot=new THREE.CylinderGeometry(1,1,1,8),
 cpScrM=new THREE.ShaderMaterial({uniforms:{uT:{value:0}},vertexShader:'varying vec2 vUv;varying vec3 vW;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:'uniform float uT;varying vec2 vUv;varying vec3 vW;void main(){float sd=fract(sin(dot(floor(vW.xz*.7),vec2(12.9,78.2)))*437.5);vec2 p=vUv;vec3 c=mix(vec3(.03,.06,.16),vec3(.08,.3,.62)+.18*sin(vec3(0.,2.,4.)+sd*6.),p.y);c+=.16*sin(vec3(1.,2.,3.)*(p.x*5.+uT*(1.+sd))+p.y*3.);float tk=step(.06,p.y)*step(p.y,.18);c=mix(c,vec3(.8,.1,.12),tk*.85);c+=tk*.25*step(.5,fract(p.x*18.-uT*1.5));float hd=step(.74,p.y)*step(p.y,.86)*step(.08,p.x)*step(p.x,.55+.3*sd);c=mix(c,vec3(.95),hd*.8);float bx=step(.3,p.y)*step(p.y,.66)*step(.6,p.x)*step(p.x,.92);c=mix(c,vec3(.9,.6,.3)*(.6+.4*sin(uT*2.+sd*9.)),bx*.7);gl_FragColor=vec4(c*1.15,1.);}'});
function cpUVs(g,su,sv){const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*su,uv.getY(i)*sv);return g}
const cpPal=()=>[0xe63946,0xf4a261,0x2a9d8f,0xffd60a,0x1d70b8,0x9b5de5,0xffffff,0x3ddc84,0xff6f91,0x8d99ae,0xe76f51,0x264653][Math.random()*12|0];
// ---- room kit: local coords x -9..9, z -7..7 (entrance +z), y = height above floor ----
function cpKit(X,H){const K={X,H,F:[],G:[],E:[],A:[],W:[],SW:[],S:[],PB:[],PC:[],obs:[],t:[0,0,0]};
 const P=(x,z)=>{const a=K.t[2],c=Math.cos(a),s=Math.sin(a);return [X+K.t[0]+x*c+z*s,K.t[1]-x*s+z*c]};
 const put=(arr,geo,x,y,z,rx,ry,rz,col)=>{const q=P(x,z),g=gT(geo,q[0],.3+y,q[1],rx||0,K.t[2]+(ry||0),rz||0);if(col!==undefined)cpCol(g,col);arr.push(g);return g};
 K.b=(w,h,d,x,y,z,c,ry)=>put(K.F,new THREE.BoxGeometry(w,h,d),x,y,z,0,ry,0,c);
 K.e=(w,h,d,x,y,z,c,ry)=>put(K.E,new THREE.BoxGeometry(w,h,d),x,y,z,0,ry,0,c);
 K.gl=(w,h,d,x,y,z,ry)=>put(K.G,new THREE.BoxGeometry(w,h,d),x,y,z,0,ry,0,0xffffff);
 K.bz=(w,h,d,x,y,z,rz,c)=>put(K.F,new THREE.BoxGeometry(w,h,d),x,y,z,0,0,rz,c);
 K.c=(rt,rb,h,n,x,y,z,c,arr)=>put(arr||K.F,new THREE.CylinderGeometry(rt,rb,h,n),x,y,z,0,0,0,c);
 K.cz=(r,h,n,x,y,z,c,arr)=>put(arr||K.F,new THREE.CylinderGeometry(r,r,h,n),x,y,z,Math.PI/2,0,0,c);
 K.sp=(r,x,y,z,c,arr)=>put(arr||K.F,new THREE.IcosahedronGeometry(r,1),x,y,z,0,0,0,c);
 K.grp=(x,z,ry,fn)=>{const o=K.t,a=o[2],c=Math.cos(a),s=Math.sin(a);K.t=[o[0]+x*c+z*s,o[1]-x*s+z*c,a+ry];fn();K.t=o};
 K.at=(cell,w,h,x,y,z,ry,fr)=>K.grp(x,z,ry||0,()=>{const g=new THREE.PlaneGeometry(w,h),uv=g.attributes.uv,cx=cell%4,cy=cell>>2;for(let i=0;i<uv.count;i++)uv.setXY(i,(cx+uv.getX(i))/4,(3-cy+uv.getY(i))/4);put(K.A,g,0,y,.035);if(fr!==0)K.b(w+.12,h+.12,.04,0,y,.01,fr||0x1a1a1a)});
 K.win=(w,h,x,y,z,ry)=>K.grp(x,z,ry||0,()=>{put(K.W,new THREE.PlaneGeometry(w,h),0,y,.03);const fc=0xf4f1ea;K.b(w+.26,.12,.14,0,y+h/2+.06,.06,fc);K.b(w+.34,.08,.26,0,y-h/2-.04,.11,fc);K.b(.12,h,.14,-w/2-.06,y,.06,fc);K.b(.12,h,.14,w/2+.06,y,.06,fc);K.b(.07,h,.08,0,y,.06,fc);K.b(w,.06,.08,0,y+h*.18,.06,fc)});
 K.scr=(w,h,x,y,z,ry)=>K.grp(x,z,ry||0,()=>{K.b(w+.12,h+.12,.07,0,y,0,0x0e0f12);put(K.S,new THREE.PlaneGeometry(w,h),0,y,.04)});
 K.box=(x,y,z,sx,sy,sz,c,ry)=>{const q=P(x,z);K.PB.push({x:q[0],y:.3+y,z:q[1],sx,sy,sz,c,ry:K.t[2]+(ry||0)})};
 K.bot=(x,y,z,r,h,c)=>{const q=P(x,z);K.PC.push({x:q[0],y:.3+y,z:q[1],sx:r,sy:h,sz:r,c,ry:0})};
 K.ob=(w,d,x,z)=>{const a=P(x-w/2,z-d/2),b=P(x+w/2,z+d/2);K.obs.push([Math.min(a[0],b[0]),Math.max(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[1],b[1])])};
 K.fill=(x0,x1,y,z,dep,mh)=>{for(let x=x0;x<x1-.1;){const w=.12+Math.random()*.18,h=.14+Math.random()*(mh-.14);if(Math.random()<.08){x+=w;continue}K.box(x+w/2,y+h/2,z,w*.9,h,dep*(.7+Math.random()*.3),cpPal());x+=w}};
 K.panels=(list,w,d)=>{for(const p of list){K.e(w,.04,d,p[0],H-.035,p[1],0xfff9ee);K.b(w+.1,.03,d+.1,p[0],H-.015,p[1],0xdcdcdc)}};
 K.down=(list,c)=>{for(const p of list){K.c(.16,.16,.03,12,p[0],H-.02,p[1],c||0xfff2d6,K.E);K.c(.22,.22,.02,12,p[0],H-.01,p[1],0xcfcfcf)}};
 K.plant=(x,z,s)=>{s=s||1;K.c(.28*s,.22*s,.55*s,12,x,.27*s,z,0xefefef);K.c(.25*s,.25*s,.04,12,x,.54*s,z,0x3a2a1a);for(let i=0;i<7;i++){const a=i*.9;K.sp((.22+Math.random()*.12)*s,x+Math.cos(a)*.22*s,(.8+Math.random()*.7)*s,z+Math.sin(a)*.22*s,[0x2f7d32,0x3a8f3a,0x276b2c,0x4a9a3f][i%4])}K.ob(.6*s,.6*s,x,z)};
 K.chair=(x,z,ry,c)=>K.grp(x,z,ry,()=>{K.b(.56,.08,.56,0,.48,0,c);K.b(.56,.62,.07,0,.82,.25,c);for(const a of[[-.24,-.24],[.24,-.24],[-.24,.24],[.24,.24]])K.b(.05,.46,.05,a[0],.23,a[1],0x2b2b2b)});
 K.sofa=(x,z,ry,w,c)=>K.grp(x,z,ry,()=>{K.b(w,.42,.95,0,.25,0,c);K.b(w,.75,.25,0,.62,.36,c);K.b(.22,.62,.95,-w/2+.11,.4,0,c);K.b(.22,.62,.95,w/2-.11,.4,0,c);const n=Math.max(1,Math.round(w/1.1));for(let i=0;i<n;i++)K.b(w/n-.12,.14,.72,-w/2+(i+.5)*w/n,.52,-.05,new THREE.Color(c).multiplyScalar(1.15).getHex());K.ob(w,.95,0,0)});
 K.table=(x,z,w,d,h,c,leg)=>{K.b(w,.06,d,x,h,z,c);for(const a of[[-1,-1],[1,-1],[-1,1],[1,1]])K.b(.07,h,.07,x+a[0]*(w/2-.08),h/2,z+a[1]*(d/2-.08),leg||0x2b2b2b);K.ob(w,d,x,z)};
 K.lamp=(x,z)=>{K.c(.18,.22,.05,12,x,.03,z,0x2b2b2b);K.c(.025,.025,1.6,6,x,.83,z,0x2b2b2b);K.c(.22,.32,.36,14,x,1.7,z,0xfff1d6,K.E)};
 K.cam=(x,z,ry)=>K.grp(x,z,ry,()=>{K.b(.1,.3,.1,0,H-.15,0,0x222222);K.b(.26,.2,.44,0,H-.36,.16,0xe8e8e8);K.e(.05,.05,.02,0,H-.36,.39,0xff2020)});
 K.atm=(x,z,ry)=>K.grp(x,z,ry,()=>{K.b(.95,1.75,.7,0,.87,0,0x2c3e50);K.b(.8,.12,.25,0,1.0,.42,0x1b2631);K.e(.5,.36,.02,0,1.32,.36,0x56c8ff);K.e(.86,.16,.03,0,1.68,.36,0x2a6fdb);K.b(.36,.16,.08,0,.98,.5,0x7f8c8d);K.ob(1,.8,0,0)});
 K.cooler=(x,z)=>{K.b(.42,1.0,.42,x,.5,z,0xe6e6e6);K.c(.17,.17,.5,12,x,1.25,z,0xffffff,K.G);K.c(.15,.15,.46,12,x,1.24,z,0x9fd8ff)};
 return K}
function cpGondola(K,L){K.b(L,.22,1.0,0,.11,0,0x5d6670);K.b(L,1.75,.05,0,.97,0,0x9aa3ad);K.b(.07,1.85,1.0,-L/2,.92,0,0x5d6670);K.b(.07,1.85,1.0,L/2,.92,0,0x5d6670);
 for(let t=0;t<3;t++){const y=.3+t*.52;K.b(L,.035,.95,0,y,0,0xdfe3e8);K.b(L,.06,.015,0,y-.03,.48,0xffd60a);K.b(L,.06,.015,0,y-.03,-.48,0xffd60a);K.fill(-L/2+.08,L/2-.08,y+.02,.25,.4,.42);K.fill(-L/2+.08,L/2-.08,y+.02,-.25,.4,.42)}
 K.b(L*.6,.3,.04,0,2.05,0,0x2a9d8f)}
function cpFridge(K,L){K.e(L,2.2,.04,0,1.25,-.4,0xe8f6ff);K.b(L,.3,.9,0,2.5,0,0xd5d9de);K.b(L,.25,.9,0,.12,0,0xd5d9de);K.e(L-.1,.12,.02,0,2.52,.46,0x56c8ff);
 for(let x=-L/2;x<=L/2+.01;x+=L/Math.round(L/1.25))K.b(.07,2.25,.9,x,1.25,0,0xb9bec4);
 for(const y of[.5,1.0,1.5,1.98]){K.b(L,.03,.78,0,y,-.02,0xf0f0f0);for(let x=-L/2+.12;x<L/2-.1;x+=.15+Math.random()*.05){if(Math.random()<.1)continue;const h=.22+Math.random()*.12;K.bot(x,y+h/2+.02,-.05+Math.random()*.25,.055,h,[0x8b1c2c,0x2a9d8f,0xf4a261,0x56c8ff,0xe9f5f9,0x3ddc84,0x1d1d1d][Math.random()*7|0])}}
 K.gl(L,2.18,.03,0,1.27,.44);for(let x=-L/2+.6;x<L/2;x+=L/Math.round(L/1.25))K.b(.04,.9,.05,x,1.3,.48,0xbfc5cc);K.ob(L,.95,0,0)}

// ---- room shell + templates ----
function cpShell(K,R,o){const X=K.X,H=K.H,g=R.grp;
 const fl=cpUVs(new THREE.PlaneGeometry(18,14),18/o.fs,14/o.fs);fl.rotateX(-Math.PI/2);fl.translate(X,.3,0);
 g.add(new THREE.Mesh(fl,new THREE.MeshStandardMaterial({map:cpTexOf(o.f),color:o.fc===undefined?0xffffff:o.fc,roughness:cpRough[o.f]||.6,metalness:0,envMapIntensity:o.f==='marble'?.9:.4})));
 const ws=o.ws||3,wg=[],wall=(w,cx,cz,ry)=>{wg.push(gT(cpUVs(new THREE.PlaneGeometry(w,H),w/ws,H/ws),X+cx,.3+H/2,cz,0,ry,0))};
 wall(18,0,-7,0);wall(18,0,7,Math.PI);wall(14,-9,0,Math.PI/2);wall(14,9,0,-Math.PI/2);
 g.add(new THREE.Mesh(cpMG(wg),new THREE.MeshStandardMaterial({map:cpTexOf(o.w),color:o.wc,roughness:.9,envMapIntensity:.25})));
 const cs=o.cs||2.4,cg=cpUVs(new THREE.PlaneGeometry(18,14),18/cs,14/cs);cg.rotateX(Math.PI/2);cg.translate(X,.3+H,0);
 g.add(new THREE.Mesh(cg,new THREE.MeshStandardMaterial({map:cpTexOf(o.c),color:o.cc===undefined?0xffffff:o.cc,roughness:.95,envMapIntensity:.15})));
 const bc=o.base===undefined?0xf4f1ea:o.base;
 K.b(18,.22,.05,0,.11,-6.97,bc);K.b(14,.22,.05,-8.97,.11,0,bc,Math.PI/2);K.b(14,.22,.05,8.97,.11,0,bc,Math.PI/2);K.b(8,.22,.05,-5,.11,6.97,bc);K.b(8,.22,.05,5,.11,6.97,bc);
 K.b(18,.12,.1,0,H-.06,-6.95,bc);K.b(18,.12,.1,0,H-.06,6.95,bc);K.b(14,.12,.1,-8.95,H-.06,0,bc,Math.PI/2);K.b(14,.12,.1,8.95,H-.06,0,bc,Math.PI/2);
 if(o.stripe!==undefined){K.b(17.9,.14,.03,0,1.1,-6.98,o.stripe);K.b(13.9,.14,.03,-8.98,1.1,0,o.stripe,Math.PI/2);K.b(13.9,.14,.03,8.98,1.1,0,o.stripe,Math.PI/2);K.b(7.9,.14,.03,-5,1.1,6.98,o.stripe);K.b(7.9,.14,.03,5,1.1,6.98,o.stripe)}
 K.b(.2,2.95,.26,-.96,1.47,6.88,0x2b2f36);K.b(.2,2.95,.26,.96,1.47,6.88,0x2b2f36);K.b(2.12,.2,.26,0,2.95,6.88,0x2b2f36);
 K.SW.push(gT(new THREE.PlaneGeometry(1.72,2.8),X,.3+1.4,6.985,0,Math.PI,0));
 // the storefront seen from inside: same display windows, mullions and bulkheads as the facade outside, looking out at the street
 if(o.front!==false)for(const sx of[-1,1]){K.SW.push(gT(new THREE.PlaneGeometry(2.2,2.44),X+sx*2.1,.3+1.69,6.975,0,Math.PI,0));K.gl(2.2,2.44,.02,sx*2.1,1.69,6.9);
  for(const mx of[1.0,3.2])K.b(.1,2.95,.14,sx*mx,1.47,6.92,0x2b2f36);K.b(2.2,.45,.16,sx*2.1,.22,6.92,0xcfc8ba);K.b(2.3,.06,.3,sx*2.1,.47,6.82,0x9a9a9a);K.b(2.2,.08,.12,sx*2.1,2.92,6.93,0x2b2f36)}
 K.e(.72,.24,.06,0,3.3,6.9,0x3dff7a);K.b(1.7,.02,1.1,0,.01,6.05,0x2a2a2a);
 R.door=cpAddDoor(X-.8,6.9,0)}
function cpPerson(R,lx,lz,ry,sh,pa,rt){const g=makePerson(sh,pa,[0xf1c27d,0xc68642,0x8d5524,0xe0ac69][Math.random()*4|0]);g.userData.rlType=rt;g.position.set(R.x+lx,.3,lz);g.rotation.y=ry;scene.add(g);g.visible=R.grp.visible;R.ppl.push(g);return g}
function cpWalker(R,pts,sh,pa,rt){const g=cpPerson(R,pts[0][0],pts[0][1],0,sh,pa,rt);R.walk.push({g,pts,i:1,w:0,pause:Math.random()*2});return g}
const cpT={
 store(K,R){cpShell(K,R,{f:'tile',fs:2.4,w:'plaster',wc:0xe6dcc4,c:'acoustic',stripe:0x2a9d8f});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.6);
  K.b(7,1.0,.9,0,.5,-3.6,0x5b3b24);K.b(7.3,.06,1.05,0,1.03,-3.6,0x232323);K.b(7,.12,.02,0,.75,-3.14,0x3ddc84);
  K.b(.5,.22,.38,-1.6,1.17,-3.75,0x1a1a1a);K.b(.06,.3,.06,-1.6,1.3,-3.82,0x1a1a1a);K.e(.42,.28,.03,-1.6,1.52,-3.8,0x6fe0ff);K.b(.22,.1,.3,-.6,1.11,-3.42,0x333333);
  K.b(1.6,.8,.35,2.3,.4,-2.95,0x9aa3ad);K.fill(1.55,3.05,.82,-2.95,.25,.26);K.b(.9,.5,.3,2.6,1.33,-3.8,0x0f5132);K.e(.8,.36,.03,2.6,1.35,-3.64,0x3ddc84);
  K.grp(0,-6.55,0,()=>{K.b(8,2.6,.08,0,1.5,-.32,0x6b7682);K.b(.08,2.6,.5,-4,1.5,-.05,0x6b7682);K.b(.08,2.6,.5,4,1.5,-.05,0x6b7682);for(let t=0;t<5;t++){K.b(7.8,.04,.45,0,.55+t*.48,-.05,0xdfe3e8);K.fill(-3.8,3.8,.57+t*.48,-.05,.3,.36)}});
  K.at(2,1.5,1.9,-6.3,2.8,-6.93,0);K.at(3,1.5,1.9,6.3,2.8,-6.93,0);
  for(const gx of[-3.4,3.4])K.grp(gx,2.1,Math.PI/2,()=>cpGondola(K,5.2));
  K.grp(-8.45,2.3,Math.PI/2,()=>cpFridge(K,7.4));K.at(0,1.3,1.4,-8.95,3.55,0,Math.PI/2);K.at(1,1.3,1.4,-8.95,3.55,4.4,Math.PI/2);
  K.win(3.6,1.9,8.97,2.3,2.6,-Math.PI/2);K.at(3,1.2,1.2,8.95,2.2,-1.1,-Math.PI/2);
  K.grp(8.3,-1.4,-Math.PI/2,()=>{K.b(2.6,.95,.9,0,.47,0,0x4a3426);K.b(2.7,.05,1,0,.97,0,0x1d1d1d);for(const x of[-.8,.1,.9]){K.b(.45,.6,.4,x,1.3,-.1,0x2b2b2b);K.e(.2,.1,.02,x,1.45,.11,0xff9a3c)}K.ob(2.7,1,0,0)});
  K.atm(8.35,5.3,-Math.PI/2);K.b(1.6,1.0,.8,-7.2,.5,6.1,0xf4f8fb);K.e(1.0,.26,.02,-7.2,.68,5.69,0x5fd0ff);K.ob(1.6,.8,-7.2,6.1);
  K.cam(-8.5,-6.5,Math.PI/4);K.cam(8.5,6.4,-Math.PI*.75);K.plant(7.6,3.8,.9);
  for(const gx of[-3.4,3.4]){K.b(1.0,1.05,.55,gx,.52,5.15,gx<0?0xe0262b:0x6a2bd1);K.fill(gx-.45,gx+.45,1.06,5.15,.4,.3);K.at(gx<0?0:1,.9,.75,gx,.55,5.43,0,0);K.ob(1,.6,gx,5.15)}
  K.grp(-2.1,6.35,Math.PI,()=>{K.b(2,.75,.42,0,.37,0,0x6b7682);for(let i=0;i<6;i++)K.box(-.8+i*.32,.82,.05-.04*(i%2),.28,.14,.34,[0xf2f2f2,0xe63946,0x1d70b8,0xffd60a][i%4],.25);K.ob(2,.5,0,0)});
  K.grp(2.1,6.2,Math.PI,()=>{K.b(1.9,.82,.75,0,.41,0,0xf4f8fb);K.gl(1.8,.05,.66,0,.85,0);for(let i=0;i<8;i++)K.box(-.7+(i%4)*.46,.72,-.17+(i>>2)*.34,.38,.12,.28,[0xffd1dc,0xfff1c4,0x8b5a2b,0xb5e8ff][i%4]);K.e(1.6,.14,.02,0,.62,.38,0x56c8ff);K.ob(1.9,.8,0,0)});
  K.b(.5,.36,.3,1.4,1.24,-3.4,0x0f8a4a);K.at(2,.44,.44,1.4,1.33,-3.24,0,0);K.b(.9,.05,.4,-3.0,1.08,-3.45,0x9aa3ad);for(let i=0;i<4;i++)K.c(.07,.07,.12,8,-3.3+i*.2,1.17,-3.45,0xc9a227);
  K.grp(8.5,1.8,-Math.PI/2,()=>{K.b(2.2,.95,.7,0,.47,0,0x4a3426);K.b(2.3,.05,.75,0,.97,0,0x1d1d1d);K.b(.45,.55,.4,-.7,1.25,-.1,0x2b2b2b);K.c(.07,.07,.12,8,-.7,1.05,.1,0xffffff);K.b(.38,.6,.32,.2,1.27,-.1,0xc0c0c0);for(let i=0;i<5;i++)K.c(.05,.045,.13,8,.75,1.06+i*.13,0,0xffffff);K.ob(2.3,.8,0,0)});
  R.clerk=cpPerson(R,0,-5,Math.PI,0xd62828,0x222222,'m2');cpWalker(R,[[-5.4,.2],[-5.4,4.4],[0,5],[0,-.4],[5.4,4.3],[5.4,.1]],0x2a6fdb,0x333333,'f2')},
 jewel(K,R){cpShell(K,R,{f:'carpet',fc:0x6a3358,fs:3,w:'wallpaper',wc:0x4a3c60,c:'plaster',cc:0x3a3046,base:0xc9a24a,stripe:0xc9a24a});
  const dl=[];for(const x of[-6,-2,2,6])for(const z of[-5,-1,3])dl.push([x,z]);K.down(dl,0xfff0c8);
  K.c(.03,.03,.9,6,0,K.H-.45,1.5,0xc9a24a);K.c(.9,.55,.14,18,0,K.H-.95,1.5,0xc9a24a);for(let k=0;k<10;k++){const a=k*.628;K.sp(.08,Math.cos(a)*.8,K.H-1.0,1.5+Math.sin(a)*.8,0xfff4cc,K.E)}
  for(const p of[[-5,.2],[0,1.4],[5,.2],[-5,4],[5,4]]){K.b(2.2,.95,1.2,p[0],.47,p[1],0x1b1630);K.b(2.3,.05,1.3,p[0],.97,p[1],0xc9a24a);K.b(2.0,.03,1.0,p[0],1.0,p[1],0x4b1d5c);K.gl(2.2,.5,1.2,p[0],1.25,p[1]);
   for(let i=0;i<6;i++){const x=p[0]-.75+i*.3,z=p[1]+(i%2?.2:-.2);K.c(.07,.07,.02,10,x,1.03,z,0xc9a24a);K.sp(.05,x,1.07,z,[0xff7ad9,0x9ff3ff,0xffffff,0xffe066][i%4],K.E)}K.ob(2.3,1.3,p[0],p[1])}
  K.b(8,1.0,.9,0,.5,-3.6,0x1b1630);K.b(8.1,.05,.95,0,1.0,-3.6,0xc9a24a);K.gl(8,.42,.9,0,1.23,-3.6);for(let i=0;i<10;i++)K.sp(.05,-3.5+i*.75,1.07,-3.6,[0xff7ad9,0x9ff3ff,0xffe066][i%3],K.E);
  for(const x of[-6,-3,3,6]){K.b(2,3,.06,x,1.9,-6.95,0x6f7884);K.b(2.1,.08,.1,x,3.44,-6.93,0xc9a24a)}K.at(4,2.6,2.6,0,2.7,-6.93,0,0xc9a24a);
  for(const z of[-3,1.5])K.grp(-8.5,z,Math.PI/2,()=>{K.b(1.6,1.1,.6,0,.55,0,0x1b1630);K.c(.12,.18,.5,10,-.4,1.35,0,0x101010);K.c(.12,.18,.5,10,.4,1.35,0,0x101010);K.e(.3,.04,.06,-.4,1.4,.1,0xffe066);K.e(.3,.04,.06,.4,1.4,.1,0xffffff);K.ob(1.6,.6,0,0)});
  K.at(4,1.4,1.4,8.95,2.6,-2.5,-Math.PI/2,0xc9a24a);K.win(3,2,8.97,2.3,2.5,-Math.PI/2);
  for(const x of[-2.4,2.4]){K.c(.06,.09,1.0,8,x,.5,5.2,0xc9a24a);K.sp(.09,x,1.04,5.2,0xc9a24a)}K.b(4.8,.06,.06,0,.85,5.2,0x8b1c2c);
  K.plant(-8,6,1);K.plant(8,6,1);K.chair(7.8,-1,-Math.PI/2,0x6a3358);K.cam(-8.5,-6.5,Math.PI/4);
  R.clerk=cpPerson(R,0,-5,Math.PI,0x111111,0x222222,'f1');cpWalker(R,[[-3,2.6],[3,2.6],[3,5.6],[-3,5.6]],0xf5f5f5,0x2b2b2b,'f3')},
 bank(K,R){cpShell(K,R,{f:'marble',fs:4,w:'plaster',wc:0xe6dcc6,c:'plaster',cc:0xf6f1e6,base:0x6b5a44,ws:4});
  for(const p of[[-6,.2],[6,.2],[-6,4.4],[6,4.4]]){K.c(.42,.42,K.H-.6,18,p[0],K.H/2,p[1],0xece6da);K.b(1.1,.3,1.1,p[0],.15,p[1],0xc8bfae);K.b(1.1,.3,1.1,p[0],K.H-.15,p[1],0xc8bfae);K.ob(1.1,1.1,p[0],p[1])}
  K.b(15,1.15,.9,0,.57,-3.2,0x4a3826);K.b(15.2,.06,1.05,0,1.17,-3.2,0xd9cfba);K.gl(15,1.4,.04,0,1.9,-3.02);for(let x=-7.5;x<=7.51;x+=2.5)K.b(.07,1.5,.08,x,1.95,-3.02,0xc9a227);K.b(15,.08,.1,0,2.64,-3.02,0xc9a227);
  for(const x of[-5,-2.5,0,2.5,5]){K.b(.8,.05,.3,x,1.22,-2.95,0x2b2b2b);K.e(.3,.18,.03,x,2.82,-3.0,0xffe9a8);K.b(.5,.35,.05,x,1.45,-3.55,0x111111)}
  K.b(5.4,5.2,.3,0,2.6,-6.84,0x6d6f73);K.cz(2.1,.6,32,0,2.55,-6.5,0x9a9fa6);K.cz(1.72,.66,32,0,2.55,-6.48,0x80858b);K.cz(.36,.85,16,0,2.55,-6.3,0xc9a227);
  for(let k=0;k<3;k++)K.bz(3.0,.14,.14,0,2.55,-6.12,k*Math.PI/3,0xc9a227);for(let k=0;k<12;k++){const a=k*Math.PI/6;K.cz(.11,.2,8,Math.cos(a)*1.92,2.55+Math.sin(a)*1.92,-6.2,0xd0d4d8)}
  K.at(5,2.2,2.2,-8.95,3.6,-1.2,Math.PI/2,0xc9a227);K.at(5,2.2,2.2,8.95,3.6,-1.2,-Math.PI/2,0xc9a227);
  for(let i=0;i<5;i++){const x=-2+i;K.c(.06,.09,1.0,8,x,.5,2.2,0xc9a227);K.sp(.08,x,1.04,2.2,0xc9a227)}K.b(4,.06,.06,0,.86,2.2,0x8b1c2c);for(let i=0;i<4;i++){K.c(.06,.09,1.0,8,2,.5,2.2+i*.9,0xc9a227)}K.b(.06,.06,2.7,2,.86,3.55,0x8b1c2c);
  K.atm(8.35,2,-Math.PI/2);K.atm(8.35,3.4,-Math.PI/2);K.grp(-8.5,3,Math.PI/2,()=>{K.b(3,.45,.6,0,.45,0,0x4a3826);K.b(3,.6,.12,0,.85,-.26,0x4a3826);K.ob(3,.6,0,0)});
  K.b(2.4,1.05,.8,-2.6,.52,5,0x4a3826);K.b(2.5,.06,.9,-2.6,1.08,5,0xe8e1d3);K.ob(2.5,.9,-2.6,5);
  for(const x of[-3,3]){K.c(.04,.04,1.3,6,x,K.H-.65,1.5,0xc9a227);K.c(1.0,.7,.25,18,x,K.H-1.4,1.5,0xc9a227);for(let k=0;k<8;k++){const a=k*.785;K.sp(.09,x+Math.cos(a)*.9,K.H-1.25,1.5+Math.sin(a)*.9,0xfff4cc,K.E)}}
  K.cz(.55,.06,24,-5.6,4.6,-6.93,0xf5f0e6);K.bz(.04,.4,.03,-5.6,4.75,-6.88,0,0x111111);K.bz(.3,.04,.03,-5.47,4.6,-6.88,0,0x111111);
  K.plant(-8,6,1.1);K.plant(8,6,1.1);K.plant(-8,-2.2,1);K.plant(8,-2.2,1);K.cam(-8.5,-6.5,Math.PI/4);K.cam(8.5,6.5,-Math.PI*.75);
  R.clerk=cpPerson(R,0,-5,Math.PI,0x1f2a44,0x222222,'m3');R.npc.push(cpPerson(R,-5,-5,Math.PI,0x2b3a55,0x222222,'f2'),cpPerson(R,5,-5,Math.PI,0x2b3a55,0x222222,'f4'),cpPerson(R,-1,2.6,Math.PI,0x7a6a55,0x333333,'m1'),cpPerson(R,-1,3.7,Math.PI,0x355c7d,0x222222,'f1'));
  cpWalker(R,[[4.5,5.2],[-4.5,5.6],[-4.5,1.2],[4.6,1.2]],0x6c584c,0x2b2b2b,'m4')},
 police(K,R){cpShell(K,R,{f:'vinyl',fc:0xc9d0da,fs:3.2,w:'plaster',wc:0xd4dbe5,c:'acoustic',stripe:0x1d3557,base:0x2b3a55});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.6);
  K.b(7,1.25,1.2,0,.62,-3.4,0x2b3a55);K.b(7.2,.06,1.3,0,1.27,-3.4,0xc7ccd3);K.b(7,.22,.02,0,.95,-2.79,0xd9b44a);K.b(.6,.4,.05,-1.8,1.6,-3.8,0x111111);K.b(.6,.4,.05,1.8,1.6,-3.8,0x111111);
  K.grp(-8.94,-.5,Math.PI/2,()=>{K.b(3.6,2.1,.05,0,2.2,0,0xa57a4a)});K.at(6,.9,1.1,-8.9,2.5,-1.6,Math.PI/2,0);K.at(6,.9,1.1,-8.9,2.5,-.4,Math.PI/2,0);K.at(7,.9,1.1,-8.9,2.3,.7,Math.PI/2,0);
  for(const z of[2,4.4])K.grp(-8.4,z,Math.PI/2,()=>{K.b(2.4,.45,.55,0,.42,0,0x4b5563);K.b(2.4,.6,.1,0,.85,-.24,0x4b5563);K.ob(2.4,.6,0,0)});
  for(let k=0;k<8;k++)K.c(.05,.05,3.2,6,4.8+k*.52,1.6,-4.6,0x7d838c);for(let k=0;k<4;k++)K.c(.05,.05,3.2,6,4.6,1.6,-6.6+k*.6,0x7d838c);K.b(4.2,.1,.1,6.7,3.2,-4.6,0x7d838c);K.b(.1,.1,2.4,4.6,3.2,-5.8,0x7d838c);K.b(2.6,.4,.6,7.5,.35,-6.5,0x6b7280);
  K.cooler(8.3,1.2);for(let i=0;i<3;i++)K.b(.7,1.3,.6,-6.5+i*.75,.65,-6.6,0x6b7280);K.scr(2.4,1.35,8.95,2.6,3.4,-Math.PI/2);K.at(7,1.5,1.5,0,3.3,-6.93,0,0xd9b44a);
  K.plant(8,6,1);K.plant(-8,6,1);K.cam(-8.5,-6.5,Math.PI/4);
  R.npc.push(cpPerson(R,0,-5,Math.PI,0x1d3557,0x0b132b,'cop'),cpPerson(R,-5,-5.2,Math.PI/2,0x1d3557,0x0b132b,'cop'),cpPerson(R,-7.4,3.2,Math.PI/2,0x8d6e63,0x333333,'m5'))},
 hosp(K,R){cpShell(K,R,{f:'vinyl',fc:0xd5e0e3,fs:3.2,w:'plaster',wc:0xe4ecee,c:'acoustic',stripe:0x3aa6a0});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.6);
  K.b(6,1.1,1.0,0,.55,-3.4,0xffffff);K.b(6.2,.06,1.1,0,1.12,-3.4,0x3aa6a0);K.b(1.0,1.1,2.2,-3.4,.55,-4.4,0xffffff);K.b(1.1,.06,2.3,-3.4,1.12,-4.4,0x3aa6a0);K.b(.5,.35,.05,1.2,1.45,-3.7,0x111111);
  K.e(1.6,.5,.05,0,4.2,-6.92,0xff3050);K.e(.5,1.6,.05,0,4.2,-6.9,0xff3050);K.e(3,.32,.04,0,3.2,-6.92,0xff6f7f);
  for(const z of[1.3,3.2])for(let i=0;i<5;i++)K.chair(-7.6+i*.7,z,Math.PI,0x3aa6a0);K.ob(3.6,.6,-6.2,1.3);K.ob(3.6,.6,-6.2,3.2);
  for(const z of[-1,2.6]){K.b(2.2,.6,1.2,7.6,.45,z,0xdfe8ea);K.b(2.1,.18,1.1,7.6,.82,z,0xffffff);K.b(.5,.12,.8,8.4,.96,z,0xf0f4f7);K.b(.06,.06,3.2,6.4,K.H-.3,z,0xaab4b8);K.b(.04,2.6,1.5,6.4,2.4,z-.7,0xbde3e6);K.ob(2.2,1.2,7.6,z)}
  K.grp(8.4,5.4,-Math.PI/2,()=>{K.b(1.1,2.2,.9,0,1.1,0,0x1a1a1a);K.e(.8,1.5,.02,-.05,1.25,.46,0xbfe8ff);for(let i=0;i<4;i++)for(let j=0;j<3;j++)K.box(-.3+j*.25,.65+i*.36,.38,.16,.22,.1,cpPal());K.ob(1.1,.9,0,0)});
  K.scr(2.2,1.25,-8.95,2.7,-1.6,Math.PI/2);K.at(8,1.3,1.3,8.95,2.4,-4.6,-Math.PI/2,0);K.at(8,1.3,1.3,-8.95,2.4,5,Math.PI/2,0);K.win(2.6,1.8,8.97,2.3,.8,-Math.PI/2);
  K.plant(-8,6,1);K.plant(5.6,6.1,.9);K.cooler(-4.6,5.8);K.cam(8.5,-6.5,-Math.PI/4);
  R.npc.push(cpPerson(R,0,-5,Math.PI,0xffffff,0x9ad1d4,'f3'),cpPerson(R,-6.2,3.2,Math.PI,0x6d597a,0x333333,'m1'));cpWalker(R,[[4.5,-1],[4.5,4.2],[-1,4.2],[-1,-1]],0xf4f4f4,0x7fb7be,'m3')},
 club(K,R){cpShell(K,R,{f:'dark',fs:2,w:'brick',wc:0x4a3860,ws:2.6,c:'plaster',cc:0x0c0c12,base:0x111111});
  K.b(3.6,1.1,1.2,2.5,.55,-5.6,0x121212);K.e(3.4,.08,.04,2.5,.9,-4.98,0xff2bd6);K.e(3.4,.08,.04,2.5,.3,-4.98,0x2bd6ff);for(const x of[1.6,3.4]){K.c(.32,.32,.05,18,x,1.13,-5.6,0x2b2b2b);K.c(.05,.05,.06,8,x,1.17,-5.6,0xd0d0d0)}K.b(.6,.06,.4,2.5,1.14,-5.6,0x333333);K.e(.5,.3,.03,2.5,1.5,-6.05,0x7a2bff);
  for(const x of[-.4,5.4]){K.b(1.2,2.6,1.1,x,1.3,-5.9,0x0a0a0a);for(const y of[.7,1.6,2.3])K.cz(.32,.05,14,x,y,-5.33,0x2a2a2a)}K.ob(4.4,1.4,2.5,-5.6);K.ob(1.2,1.1,-.4,-5.9);K.ob(1.2,1.1,5.4,-5.9);
  K.grp(-6.9,-1.5,Math.PI/2,()=>{K.b(7,1.15,1.0,0,.57,0,0x2a1a3a);K.b(7.2,.06,1.15,0,1.17,0,0x111111);K.e(7,.05,.04,0,1.08,.56,0x2bd6ff);K.ob(7.2,1.1,0,0)});
  K.grp(-8.7,-1.5,Math.PI/2,()=>{K.e(7,2.2,.04,0,2.1,-.22,0xffa94d);for(const y of[1.3,2.0,2.7]){K.b(7,.04,.38,0,y,0,0x222222);for(let x=-3.3;x<3.3;x+=.2+Math.random()*.06)K.bot(x,y+.16,0,.05,.28,[0x6b8f3a,0x8b1c2c,0xc9a227,0x2a9d8f,0xe9f5f9][Math.random()*5|0])}});
  for(let i=0;i<6;i++){const z=-4.6+i*1.2;K.c(.05,.05,.8,6,-5.9,.4,z,0x888888);K.c(.22,.22,.08,12,-5.9,.84,z,0xb0306a)}
  for(const z of[-3,2])K.grp(7.6,z,-Math.PI/2,()=>{K.sofa(0,0,0,3,0x5b1a4a);K.table(0,-1.1,1.2,.7,.7,0x111111)});
  K.at(10,1.8,1.8,8.95,3,-.5,-Math.PI/2,0xff3df2);K.at(10,1.6,1.6,-8.95,3.6,4.6,Math.PI/2,0x2bd6ff);
  for(let k=0;k<5;k++)K.e(.08,1.6+k*.3,.04,8.94,2.4,4.2+k*.35,[0xff2bd6,0x2bd6ff,0xffd62b,0x7a2bff,0x3dff7a][k],Math.PI/2);K.e(.06,.06,7,1,K.H-.4,0,0xff2bd6);K.e(.06,.06,7,4,K.H-.4,0,0x2bd6ff);
  R.dance=new THREE.InstancedMesh(new THREE.BoxGeometry(1.9,.06,1.9),new THREE.MeshBasicMaterial({toneMapped:false}),16);R.dance.frustumCulled=false;{const M=new THREE.Matrix4(),C=new THREE.Color();let n=0;for(let i=0;i<4;i++)for(let j=0;j<4;j++){M.makeTranslation(K.X-.5+i*2,.33,-3.3+j*2);R.dance.setMatrixAt(n,M);R.dance.setColorAt(n,C.setHex(0xff2bd6));n++}}R.grp.add(R.dance);
  R.ball=new THREE.Mesh(new THREE.IcosahedronGeometry(.55,2),new THREE.MeshStandardMaterial({color:0xffffff,metalness:1,roughness:.15,flatShading:true}));R.ball.position.set(K.X+2.5,.3+K.H-1.3,-.3);R.grp.add(R.ball);K.c(.01,.01,1.0,4,2.5,K.H-.5,-.3,0x888888);
  R.npc.push(cpPerson(R,2.5,-6.4,Math.PI,0x111111,0x111111,'m4'),cpPerson(R,-8,-1.5,Math.PI/2,0x222222,0x111111,'m5'));const ty=['f1','m2','f2','m3','f4','m1','f3'];
  R.dancers=[];for(let k=0;k<7;k++)R.dancers.push(cpPerson(R,0+(k%4)*1.9,-2.6+Math.floor(k/4)*2.4,Math.random()*6,new THREE.Color().setHSL(k/7,.7,.5).getHex(),0x1a1a1a,ty[k]))},
 safe(K,R){cpShell(K,R,{f:'wood',fs:3.5,w:'plaster',wc:0xece4d6,c:'plaster',cc:0xfbfaf7});K.down([[-5,-4],[-2,-4],[3,-2],[3,2],[6.8,4.2],[-5,2]]);
  K.grp(-5,-6.55,0,()=>{K.b(7,.95,.9,0,.47,0,0xf2f2f2);K.b(7.1,.06,.95,0,.97,.02,0x2d2d2d);for(let x=-3;x<=3.01;x+=1)K.b(.02,.8,.02,x,.47,.46,0x9a9a9a);K.b(7,.9,.45,0,2.7,-.22,0xf2f2f2);K.b(7,.6,.03,0,1.35,-.43,0xbfdbe6);K.b(.8,.02,.6,1.2,1.0,.05,0x111111);for(const a of[[-.2,-.15],[.2,-.15],[-.2,.15],[.2,.15]])K.c(.1,.1,.01,12,1.2+a[0],1.02,.05+a[1],0x442222,K.E);K.b(.9,.08,.5,-1.5,.96,.05,0xb0b6bb);K.b(.9,.4,.5,1.2,2.1,-.1,0xd0d0d0);K.b(1.0,2.3,.9,4.05,1.15,0,0xc9ccd1);K.ob(9,.95,.5,0)});
  K.table(-5,-2.6,1.8,1.0,.78,0x6b4a2f);K.chair(-5.6,-1.8,0,0x4a3426);K.chair(-4.4,-1.8,0,0x4a3426);K.chair(-5.6,-3.4,Math.PI,0x4a3426);K.chair(-4.4,-3.4,Math.PI,0x4a3426);
  K.b(4.5,.02,3.2,3,.01,-2.5,0x8b1c2c);K.sofa(3,-.5,0,3.2,0x46566b);K.table(3,-2.6,1.4,.7,.42,0x5b3a29);K.b(3.2,.5,.5,3,.25,-6.65,0x3a2a1a);K.scr(2.6,1.45,3,1.9,-6.9,0);K.lamp(5.6,-.6);K.sofa(6.4,-3.2,-Math.PI/2,1.2,0x7a6a55);
  K.grp(7.75,4.2,-Math.PI/2,()=>{K.b(1.8,.45,2.3,0,.25,0,0x3a2a1a);K.b(1.7,.25,2.1,0,.58,.05,0xf2f2f2);K.b(1.7,.12,1.4,0,.74,.4,0x35506b);K.b(.6,.14,.4,-.45,.78,-.8,0xffffff);K.b(.6,.14,.4,.45,.78,-.8,0xffffff);K.b(1.9,1.1,.1,0,.8,-1.15,0x3a2a1a);for(const s of[-1,1]){K.b(.5,.55,.45,s*1.25,.28,-.85,0x4a3426);K.c(.12,.16,.28,10,s*1.25,.75,-.85,0xfff1d6,K.E)}K.ob(1.9,2.4,0,0)});
  K.grp(-8.45,4.6,Math.PI/2,()=>{K.b(2,2.4,.7,0,1.2,0,0x5b3a29);K.b(.02,2.2,.02,0,1.2,.36,0x2b1a10);K.ob(2,.7,0,0)});
  K.grp(-8.6,.6,Math.PI/2,()=>{K.b(2.2,2.2,.4,0,1.1,0,0x6b4a2f);for(const y of[.5,1.1,1.7]){K.b(2.1,.04,.36,0,y,0,0x4a3426);K.fill(-1,1,y+.02,.02,.25,.34)}K.ob(2.2,.4,0,0)});
  K.win(2.4,1.8,-8.97,2.3,-3.4,Math.PI/2);K.win(2.4,1.8,8.97,2.3,.6,-Math.PI/2);for(const z of[-4.9,-1.9])K.b(.08,2.6,.5,-8.85,2.1,z,0x8b1c2c);
  K.at(11,1.4,1.4,-2.2,2.6,-6.93,0,0x2b2b2b);K.at(13,1.6,1.1,8.95,2.6,-3.6,-Math.PI/2,0x2b2b2b);K.at(12,1.2,1.2,-8.95,2.6,3.0,Math.PI/2,0x2b2b2b);K.plant(1.2,-.2,.9);K.plant(-8,6.2,1)},
 stlux(K,R){cpShell(K,R,{front:false,f:'marble',fs:4,w:'plaster',wc:0xf2ede4,c:'plaster',cc:0xffffff,ws:4});K.down([[-6,-4],[-2,-4],[2,-4],[6,-4],[-4,0],[4,0],[-4,4],[4,4]]);
  for(let z=-6;z<=6;z+=2)K.win(1.9,3.6,8.97,2.3,z,-Math.PI/2);
  K.b(4.5,.02,3.6,3.2,.01,.6,0xd8d2c6);K.sofa(3.6,2.2,0,3.4,0xe8e6e1);K.sofa(5.6,.4,-Math.PI/2,2.2,0xe8e6e1);K.b(1.6,.04,.9,3.2,.42,.4,0xffffff);K.gl(1.6,.38,.9,3.2,.22,.4);K.ob(1.6,.9,3.2,.4);
  K.grp(-8.65,.5,Math.PI/2,()=>{K.b(3.6,1.1,.6,0,.55,0,0xbdb7ad);K.e(1.8,.45,.05,0,.55,.31,0xff8a3c);K.b(1.8,.05,.3,0,.33,.2,0x222222);K.b(4.2,.12,.4,0,1.16,.05,0x8a8478);K.ob(3.6,.6,0,0)});K.scr(3.6,2.0,-8.94,2.6,.5,Math.PI/2);
  K.b(4,1.0,1.2,-1,.5,-4.4,0xffffff);K.b(4.2,.08,1.4,-1,1.04,-4.4,0x2b2b2b);for(let i=0;i<3;i++){K.c(.04,.04,.75,6,-2.2+i*1.2,.4,-3.4,0x888888);K.c(.2,.2,.08,12,-2.2+i*1.2,.8,-3.4,0x2b2b2b);K.c(.012,.012,1.8,4,-2.2+i*1.2,K.H-.9,-4.4,0x111111);K.c(.18,.24,.3,12,-2.2+i*1.2,K.H-1.9,-4.4,0xfff1d6,K.E)}K.ob(4.2,1.4,-1,-4.4);
  K.grp(-1,-6.55,0,()=>{K.b(10,.95,.9,0,.47,0,0xffffff);K.b(10.1,.06,.95,0,.97,.02,0x2b2b2b);K.b(10,1.0,.45,0,2.9,-.22,0xffffff);K.b(1.1,2.5,.9,5.6,1.25,0,0xc9ccd1)});
  K.table(-4.6,1.4,2.6,1.1,.78,0x5b3a29);for(const a of[[-5.4,.6,0],[-4.6,.6,0],[-3.8,.6,0],[-5.4,2.2,Math.PI],[-4.6,2.2,Math.PI],[-3.8,2.2,Math.PI]])K.chair(a[0],a[1],a[2],0xe8e6e1);
  K.at(13,2.4,1.6,2.6,2.8,-6.93,0,0x2b2b2b);K.at(11,1.6,1.6,-7.2,2.8,6.93,Math.PI,0x2b2b2b);K.at(12,1.6,1.6,-3.6,2.8,6.93,Math.PI,0x2b2b2b);K.plant(7.8,6.1,1.2);K.plant(-8,6,1.2);K.plant(7.8,-6,1.2);
  for(let i=0;i<7;i++)K.b(1.4,.25,.45,-7.8,.12+i*.25,-1.6-i*.45,0x8a6a4a);K.ob(1.4,3.2,-7.8,-3)},
 stoff(K,R){cpShell(K,R,{front:false,f:'carpet',fc:0x4c5566,fs:3,w:'plaster',wc:0xd9dde2,c:'acoustic',stripe:0x2b3a55});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5]],2.4,.6);
  K.b(7.2,3.3,.1,0,2.2,-6.9,0xa57a4a);K.b(7.4,.12,.16,0,3.9,-6.86,0x3a2a1a);K.b(7.4,.12,.16,0,.5,-6.86,0x3a2a1a);
  const pins=[];for(let i=0;i<9;i++){const x=-3+(i%3)*3+(Math.random()-.5)*.6,y=1.3+Math.floor(i/3)*.9+(Math.random()-.5)*.2;pins.push([x,y]);K.b(.8,.6,.02,x,y,-6.83,i%3?0xf5f5f5:0xfff3b0);K.b(.6,.06,.01,x,y+.12,-6.82,0x333333);K.c(.04,.04,.03,6,x,y+.27,-6.81,0xe63946,K.E)}
  for(const p of[[0,4],[4,8],[1,5],[3,7],[2,4]]){const a=pins[p[0]],b=pins[p[1]],dx=b[0]-a[0],dy=b[1]-a[1];K.bz(Math.hypot(dx,dy),.02,.01,(a[0]+b[0])/2,(a[1]+b[1])/2+.27,-6.8,Math.atan2(dy,dx),0xd62828)}
  for(const p of[[-4.5,-2.6],[-1.5,-2.6],[-4.5,.6],[-1.5,.6]]){K.b(2.4,.06,1.1,p[0],.76,p[1],0xe8e1d3);K.b(.06,.74,1.0,p[0]-1.15,.38,p[1],0x555555);K.b(.06,.74,1.0,p[0]+1.15,.38,p[1],0x555555);K.scr(.7,.42,p[0],1.1,p[1]-.3,0);K.chair(p[0],p[1]+.8,Math.PI,0x2b2b2b);K.ob(2.4,1.1,p[0],p[1])}
  K.gl(.06,3,5,3.6,1.5,-1);K.gl(4.6,3,.06,6.3,1.5,1.5);K.b(.08,3,.08,3.6,1.5,1.5,0x777777);K.table(6.3,-1.2,2.6,1.2,.76,0xe8e1d3);for(const a of[[5.6,-2.2,0],[7,-2.2,0],[5.6,-.2,Math.PI],[7,-.2,Math.PI]])K.chair(a[0],a[1],a[2],0x2b3a55);K.ob(.2,5,3.6,-1);K.ob(4.6,.2,6.3,1.5);
  K.b(3,1.6,.05,6.3,2.2,-6.9,0xffffff);K.b(3.1,.06,.12,6.3,1.4,-6.85,0x999999);K.cooler(-8.3,5.5);for(let i=0;i<3;i++)K.b(.7,1.3,.6,-8.5,.65,-2+i*.75,0x6b7280,Math.PI/2);K.b(.9,.9,.7,8.3,.45,4.8,0xdedede);K.ob(.9,.7,8.3,4.8);
  K.win(2.6,1.8,-8.97,2.3,1.8,Math.PI/2);K.at(14,1.2,1.2,8.95,2.4,3.4,-Math.PI/2,0x2b2b2b);K.plant(-8,6.2,1);K.plant(8,6.2,1)},
 gun(K,R){cpShell(K,R,{f:'concrete',fs:4,w:'brick',wc:0xffffff,ws:2.6,c:'acoustic',cc:0x9a9a9a,base:0x2b2b2b});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.5);
  K.b(10,.9,.9,0,.45,-3.6,0x2b2b2b);K.gl(10,.42,.9,0,1.12,-3.6);K.b(10.1,.04,.95,0,1.34,-3.6,0x111111);K.e(9.8,.03,.05,0,1.3,-3.35,0xffffff);K.b(9.8,.02,.8,0,.92,-3.6,0x3a1d1d);
  for(let i=0;i<12;i++){const x=-4.4+i*.8;K.b(.32,.1,.05,x,.99,-3.6,0x1a1a1a);K.b(.08,.16,.05,x-.11,.95,-3.6,0x1a1a1a)}K.b(10,.12,.02,0,.7,-3.14,0xffb020);
  K.b(16,3,.06,0,2.1,-6.92,0x6e5a44);for(let r=0;r<3;r++)for(let i=0;i<7;i++){const x=-6.6+i*2.2,y=1.4+r*.75,c=[0x1a1a1a,0x3b4a2f,0x8a7350][(i+r)%3];K.b(1.6,.1,.05,x,y,-6.86,c);K.b(.5,.22,.05,x+.75,y-.06,-6.86,c);K.b(.08,.25,.05,x-.2,y-.14,-6.86,c)}
  K.grp(8.5,-3,-Math.PI/2,()=>{K.b(4,2.6,.08,0,1.3,-.22,0x555555);K.b(.08,2.6,.5,-2,1.3,0,0x555555);K.b(.08,2.6,.5,2,1.3,0,0x555555);for(let t=0;t<4;t++){K.b(3.9,.04,.45,0,.5+t*.6,.03,0x777777);for(let x=-1.8;x<1.8;x+=.28)K.box(x,.62+t*.6,.05,.24,.18,.3,[0x3b6b2a,0xd97706,0xb91c1c][Math.random()*3|0])}K.ob(4,.5,0,0)});
  K.at(9,1.6,1.6,-8.95,2.4,-1.5,Math.PI/2,0);K.at(9,1.6,1.6,-8.95,2.4,2.5,Math.PI/2,0);K.at(9,1.3,1.3,8.95,2.6,3.6,-Math.PI/2,0);
  K.grp(-8.94,5.2,Math.PI/2,()=>{K.b(1.4,2.6,.08,0,1.3,0,0x3a3a3a);K.e(1.0,.25,.05,0,2.85,.05,0xff3030)});
  for(let i=0;i<4;i++){K.b(.05,1.5,.05,-5+i*.6,.75,5.2,0x777777)}K.b(2.4,.05,.05,-4.1,1.5,5.2,0x777777);for(let i=0;i<6;i++)K.b(.35,.8,.06,-5+i*.35,1.05,5.2,[0x3b4a2f,0x5b6b3a,0x8a7350][i%3]);K.ob(2.6,.4,-4.1,5.2);
  K.cam(-8.5,-6.5,Math.PI/4);K.cam(8.5,6.5,-Math.PI*.75);K.plant(8,6,1);
  K.b(3.2,.9,1.0,-3.6,.45,1.4,0x2b2b2b);K.gl(3.2,.4,1.0,-3.6,1.1,1.4);K.b(3.1,.02,.9,-3.6,.91,1.4,0x3a1d1d);for(let i=0;i<8;i++){const x=-4.9+(i%4)*.85,z=1.15+(i>>2)*.5;K.b(.3,.09,.05,x,.97,z,0x1a1a1a);K.b(.07,.15,.05,x-.1,.93,z,0x1a1a1a)}K.ob(3.3,1.1,-3.6,1.4);
  K.grp(8.94,1.2,-Math.PI/2,()=>{K.b(3.4,2.2,.06,0,1.7,0,0x5a4632);K.b(3.4,.1,.2,0,.75,.1,0x3a2a1a);for(let i=0;i<9;i++){const x=-1.5+i*.37,c=[0x1a1a1a,0x3b4a2f,0x6b4a2f][i%3];K.b(.07,1.5,.06,x,1.55,.1,c);K.b(.12,.32,.07,x,.95,.1,c);K.b(.05,.2,.06,x+.05,1.45,.12,0x111111)}});
  K.b(1.2,.5,.8,7.6,.25,-5.8,0x4b5d2a);K.b(1.2,.5,.8,7.6,.75,-5.8,0x3b4a2f);K.b(1.1,.45,.75,6.3,.22,-5.9,0x4b5d2a);K.e(.5,.1,.02,7.6,.35,-5.39,0xffd60a);K.ob(2.6,.9,7,-5.8);
  K.grp(-8.94,5.2,Math.PI/2,()=>{K.gl(1.0,.6,.03,0,1.9,.06)});
  R.npc.push(cpPerson(R,0,-5,Math.PI,0x3b4a2f,0x2b2b2b,'m5'));R.ctr={k:'gun',lx:0,lz:-2.55}},
 clinic(K,R){cpShell(K,R,{f:'vinyl',fc:0xd8e2e4,fs:3.2,w:'plaster',wc:0xe6eeec,c:'acoustic',stripe:0xff6f91});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.6);
  K.b(5,1.1,1.0,0,.55,-3.4,0xffffff);K.b(5.2,.06,1.1,0,1.12,-3.4,0xff6f91);K.b(.5,.35,.05,1,1.45,-3.7,0x111111);K.e(1.4,.44,.05,0,3.6,-6.92,0xff3050);K.e(.44,1.4,.05,0,3.6,-6.9,0xff3050);
  for(const z of[1.4,3.4])for(let i=0;i<4;i++)K.chair(-7.4+i*.7,z,Math.PI,0xff6f91);K.ob(3,.6,-6.35,1.4);K.ob(3,.6,-6.35,3.4);
  for(let i=0;i<3;i++)K.b(.7,1.3,.6,6.5+i*.75,.65,-6.6,0xdedede);K.cooler(7.8,3.2);K.scr(2,1.15,-8.95,2.6,-1.6,Math.PI/2);K.at(8,1.3,1.3,8.95,2.4,0,-Math.PI/2,0);K.win(2.6,1.8,8.97,2.3,4.4,-Math.PI/2);K.plant(-8,6.2,1);K.plant(8,6.2,1);
  K.gl(5,.7,.03,0,1.5,-2.92);K.b(5,.05,.06,0,1.86,-2.92,0xd0d6d8);K.c(.06,.06,.2,8,-2,1.22,-3.1,0xbfe8ff);K.b(.9,.04,.6,-1.2,1.16,-3.5,0xf4f4f4);
  K.b(.05,.05,4.2,4.9,3.2,-3.2,0xaab4b8);for(let i=0;i<8;i++)K.b(.06,2.7,.5,4.9+(i%2)*.06,1.85,-5.0+i*.5,0xbde3e6);K.b(3.6,.05,.05,6.7,3.2,-1.1,0xaab4b8);for(let i=0;i<4;i++)K.b(.5,2.7,.06,5.5+i*.55,1.85,-1.1+(i%2)*.06,0xbde3e6);
  K.b(2.1,.65,.9,7.2,.4,-3.6,0xdfe8ea);K.b(2.0,.12,.85,7.2,.78,-3.6,0xf2f2f2);K.b(.6,.12,.5,8.0,.9,-3.6,0xffffff);K.b(.6,1.6,.4,8.6,.8,-5.8,0xf4f4f4);K.ob(4.2,4.4,7,-3.4);
  K.table(-8.3,2.4,.6,.6,.5,0xdcdcdc);for(let i=0;i<3;i++)K.box(-8.3+(i-1)*.12,.55+i*.02,2.4,.25,.02,.32,[0xe63946,0x1d70b8,0xffd60a][i],i*.4);
  K.grp(3.6,5.6,.6,()=>{K.cz(.32,.04,16,-.3,.32,0,0x333333);K.cz(.32,.04,16,.3,.32,0,0x333333);K.b(.55,.06,.5,0,.5,0,0x2b2b2b);K.b(.55,.5,.06,0,.78,.25,0x2b2b2b);K.ob(.8,.7,0,0)});
  K.cz(.3,.05,24,-3,3.4,-6.92,0xffffff);K.bz(.03,.22,.02,-3,3.48,-6.88,0,0x111111);K.bz(.16,.03,.02,-2.93,3.4,-6.88,0,0x111111);
  R.npc.push(cpPerson(R,0,-5,Math.PI,0xffffff,0xff9fb6,'f4'),cpPerson(R,-6.7,3.4,Math.PI,0x52796f,0x333333,'m2'));R.ctr={k:'clinic',lx:0,lz:-2.55}},
 estate(K,R){cpShell(K,R,{f:'wood',fs:3.5,w:'plaster',wc:0xeae6de,c:'plaster',cc:0xfbfaf7});K.down([[-6,-4],[-2,-4],[2,-4],[6,-4],[-4,1],[4,1],[0,4]]);
  K.b(6,1.1,1.0,0,.55,-3.4,0x6b4a2f);K.b(6.2,.06,1.1,0,1.12,-3.4,0xf4f1ea);K.b(5.8,.2,.02,0,.8,-2.89,0x6dff8a);K.b(.5,.35,.05,-1.2,1.45,-3.7,0x111111);
  K.at(15,2.6,2.6,0,2.6,-6.93,0,0x2b2b2b);for(const z of[-4.6,-1.8,1])K.at(14,1.5,1.5,-8.95,2.4,z,Math.PI/2,0x6b4a2f);for(const z of[-4.6,-1.8])K.at(14,1.5,1.5,8.95,2.4,z,-Math.PI/2,0x6b4a2f);
  K.b(1.2,1.0,1.2,0,.5,1.8,0xffffff);K.b(.7,.4,.5,0,1.21,1.8,0xf2e8d5);K.c(0,.52,.35,4,0,1.58,1.8,0xa5482f);K.b(.12,.18,.02,0,1.1,2.06,0x5b3a29);K.gl(1.1,.8,1.1,0,1.42,1.8);K.ob(1.2,1.2,0,1.8);
  K.sofa(-5.5,3.8,0,2.4,0x4a5a6b);K.table(-5.5,2.6,1.2,.6,.42,0x6b4a2f);K.sofa(5.5,3.8,0,2.4,0x4a5a6b);K.scr(2.4,1.35,8.95,2.6,2.6,-Math.PI/2);K.plant(-8,6.2,1.1);K.plant(8,6.2,1.1);K.plant(3.4,-5.8,1);K.plant(-3.4,-5.8,1);
  for(const sx of[-1,1]){const x=sx*5.6;K.b(2.2,.06,1.0,x,.76,-.6,0x6b4a2f);K.b(2.1,.7,.06,x,.4,-1.05,0x5b3a29);K.b(.06,.74,.95,x-1.05,.38,-.6,0x5b3a29);K.b(.06,.74,.95,x+1.05,.38,-.6,0x5b3a29);K.scr(.7,.42,x,1.1,-.75,Math.PI);K.b(.5,.02,.18,x,.8,-1.0,0x222222);K.chair(x,-1.6,Math.PI,0x2b2b2b);K.chair(x-.5,.4,0,0x4a5a6b);K.chair(x+.5,.4,0,0x4a5a6b);K.ob(2.2,1.0,x,-.6)}
  for(const x of[-7.8,-7.1,7.1,7.8])K.b(.65,1.3,.6,x,.65,-6.55,0x8a8f98);K.b(1.4,1.0,.12,3.6,2.0,-6.9,0x5b3a29);for(let i=0;i<12;i++)K.c(.03,.03,.1,6,3.1+(i%6)*.2,1.8+(i>>2>1?.35:0)+(i>=6?.3:0),-6.82,0xc9a227);
  R.npc.push(cpPerson(R,0,-5,Math.PI,0xf5f5f5,0x2b2b2b,'f1'),cpPerson(R,-5.6,-2.15,Math.PI,0x2b3a55,0x222222,'m3'));R.ctr={k:'estate',lx:0,lz:-2.55}}};
const cpRoomH={store:4.6,jewel:4.6,bank:6.4,police:4.6,hosp:4.6,club:6,safe:4.2,stlux:5.2,stoff:4.4,gun:4.6,clinic:4.4,estate:4.4},cpRoomL={club:[.55,.22,0xff66cc],safe:[.9,.42,0xffe2b8],jewel:[.9,.38,0xffe6c0],stlux:[.8,.38,0xfff1dc]};
let cpRoomN=0;
function cpRoom(type,idx){if(idx===undefined){idx=cpRoomN++;while(idx===24||idx===25)idx=cpRoomN++}const X=3000+idx*90,H=cpRoomH[type]||4.6,R={x:X,z:0,type,H,npc:[],ppl:[],walk:[],clerk:null,grp:new THREE.Group(),zmin:-6.2,obs:[],ctr:null,mine:true};R.grp.visible=false;scene.add(R.grp);
 const K=cpKit(X,H);(cpT[type]||cpT.safe)(K,R);const g=R.grp;
 if(K.F.length)g.add(new THREE.Mesh(cpMG(K.F),cpIF));if(K.G.length)g.add(new THREE.Mesh(cpMG(K.G),cpIG));if(K.E.length)g.add(new THREE.Mesh(cpMG(K.E),cpGlow));if(K.A.length)g.add(new THREE.Mesh(cpMG(K.A),cpAtM));if(K.W.length)g.add(new THREE.Mesh(cpMG(K.W),cpWinM));if(K.SW.length)g.add(new THREE.Mesh(cpMG(K.SW),cpStreetM));if(K.S.length)g.add(new THREE.Mesh(cpMG(K.S),cpScrM));
 cpInst(cpUBox,K.PB,g);cpInst(cpUBot,K.PC,g);g.traverse(o=>{o.castShadow=false;o.receiveShadow=false;o.userData.cpMine=true});
 if(R.clerk||R.ctr||type==='police'||type==='hosp')R.zmin=-2.4;R.obs=R.zmin>-3?K.obs.filter(o=>o[3]>-2.4):K.obs;if(R.ctr){R.ctr.x=X+R.ctr.lx;R.ctr.z=R.ctr.lz}
 const L=cpRoomL[type]||[.85,.36,0xfff2dd];R.li=L[0];R.amb=L[1];R.lc=L[2];R.dc=0;for(const o of g.children)R.dc++;return R}
function cpInst(geo,list,grp){if(!list.length)return null;const m=new THREE.InstancedMesh(geo,cpProdMat,list.length),M=new THREE.Matrix4(),Q=new THREE.Quaternion(),E=new THREE.Euler(),V=new THREE.Vector3(),S=new THREE.Vector3(),C=new THREE.Color();
 list.forEach((o,i)=>{Q.setFromEuler(E.set(0,o.ry,0));M.compose(V.set(o.x,o.y,o.z),Q,S.set(o.sx,o.sy,o.sz));m.setMatrixAt(i,M);m.setColorAt(i,C.setHex(o.c))});m.frustumCulled=false;grp.add(m);return m}
function cpGetRoom(type){return cpRooms[type]||(cpRooms[type]=cpRoom(type))}

// ---- doors (instanced: one draw call for every door in the game) ----
const cpDoorGeo={f:cpMG([bxg(.08,2.7,.08,.04,1.35,0),bxg(.08,2.7,.08,1.56,1.35,0),bxg(1.6,.1,.08,.8,2.65,0),bxg(1.6,.2,.08,.8,.1,0),bxg(1.5,.05,.1,.8,1.1,0),bxg(.05,.5,.08,1.4,1.1,.07)]),g:bxg(1.44,2.42,.03,.8,1.33,0)};
const cpDoorF=new THREE.InstancedMesh(cpDoorGeo.f,new THREE.MeshStandardMaterial({color:0x2b2f36,metalness:.7,roughness:.32}),72),cpDoorG=new THREE.InstancedMesh(cpDoorGeo.g,new THREE.MeshStandardMaterial({color:0xbfd9e6,transparent:true,opacity:.34,roughness:.05,metalness:.3,depthWrite:false,envMapIntensity:1.3}),72);
cpDoorF.frustumCulled=cpDoorG.frustumCulled=false;cpDoorF.count=cpDoorG.count=0;scene.add(cpDoorF,cpDoorG);
const cpDoors=[],cpDM=new THREE.Matrix4(),cpDQ=new THREE.Quaternion(),cpDE=new THREE.Euler(),cpDV=new THREE.Vector3(),cpDS=new THREE.Vector3(1,1,1);
function cpDoorSet(d){cpDQ.setFromEuler(cpDE.set(0,d.ry+d.a,0));cpDM.compose(cpDV.set(d.x,.3,d.z),cpDQ,cpDS);cpDoorF.setMatrixAt(d.i,cpDM);cpDoorG.setMatrixAt(d.i,cpDM);cpDoorF.instanceMatrix.needsUpdate=cpDoorG.instanceMatrix.needsUpdate=true}
function cpAddDoor(x,z,ry){if(cpDoors.length>=72)return null;const d={i:cpDoors.length,x,z,ry,a:0,ta:0};cpDoors.push(d);cpDoorF.count=cpDoorG.count=cpDoors.length;cpDoorSet(d);return d}
// ---- storefronts (merged for every place: ~4 draw calls total) ----
const cpSF={F:[],E:[],GL:[],SG:[]},cpSignKeys=['store','jewel','bank','safe','police','hosp','club','gun','clinic','estate','body'],cpSignL={body:['SPRAY & BODY',0x40e0ff]};
const cpSignTex=cpCT(512,64*16,g=>{g.fillStyle='#000';g.fillRect(0,0,512,1024);cpSignKeys.forEach((k,i)=>{const D=cpTypes[k]||{l:cpSignL[k][0],c:cpSignL[k][1]},y=i*64,c='#'+D.c.toString(16).padStart(6,'0');const q=g.createLinearGradient(0,y,0,y+64);q.addColorStop(0,'#1a1d24');q.addColorStop(1,'#07080b');g.fillStyle=q;g.fillRect(0,y,512,64);
 g.strokeStyle=c;g.lineWidth=3;g.strokeRect(6,y+6,500,52);g.shadowColor=c;g.shadowBlur=14;g.fillStyle=c;g.font='900 '+(D.l.length>12?32:38)+'px -apple-system,Helvetica,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(D.l,256,y+34);g.shadowBlur=0;g.fillStyle='#fff';g.globalAlpha=.85;g.fillText(D.l,256,y+34);g.globalAlpha=1})});
function cpSFb(w,h,d,x,y,z,c,arr,rx){(arr||cpSF.F).push(cpCol(gT(new THREE.BoxGeometry(w,h,d),x,y,z,rx||0,0,0),c))}
function cpSign(key,w,h,x,y,z,ry){const p=gT(new THREE.PlaneGeometry(w,h),x,y,z,0,ry,0),uv=p.attributes.uv,i=cpSignKeys.indexOf(key);for(let k=0;k<uv.count;k++)uv.setY(k,1-(i+1-uv.getY(k))/16);cpSF.SG.push(p)}
function cpFront(pl){const x=pl.x,z=pl.z,c=pl.D.c,acc=new THREE.Color(c),dk=acc.clone().multiplyScalar(.42).getHex(),stone=0xcfc8ba,metal=0x2b2f36,y0=.3,v={store:0,jewel:1,bank:2,safe:3,gun:4,clinic:5,hosp:5,estate:6,police:6,club:7}[pl.type],gv=v===undefined?3:v;
 cpSFb(.5,3.8,.36,x-3.45,y0+1.9,z-.18,stone);cpSFb(.5,3.8,.36,x+3.45,y0+1.9,z-.18,stone);cpSFb(7.4,.55,.3,x,y0+3.35,z-.15,dk);cpSFb(7.4,.07,.34,x,y0+3.06,z-.17,0xeeeeee);
 for(const s of[-1,1]){cpSFb(2.2,.45,.14,x+s*2.1,y0+.22,z-.07,stone);cpSFb(2.3,.06,.2,x+s*2.1,y0+.48,z-.1,0x9a9a9a);cpSFb(2.2,.06,.08,x+s*2.1,y0+2.92,z-.04,metal)}
 for(const mx of[-3.2,-1.0,1.0,3.2])cpSFb(.1,2.95,.12,x+mx,y0+1.47,z-.06,metal);cpSFb(2.0,.14,.12,x,y0+2.78,z-.06,metal);
 cpSF.F.push(cpCol(gT(new THREE.BoxGeometry(7.2,.09,1.5),x,y0+3.13,z-.72,-.3,0,0),dk));cpSFb(7.2,.26,.05,x,y0+2.94,z-1.43,c);
 cpSFb(2.4,.08,1.0,x,y0+.04,z-.5,0x8d8d8d);cpSFb(1.5,.02,.8,x,y0+.09,z-.55,0x2a2a2a);
 for(const s of[-1,1]){cpSFb(.18,.3,.16,x+s*3.45,y0+2.55,z-.44,metal);cpSFb(.12,.22,.04,x+s*3.45,y0+2.55,z-.54,0xfff1c4,cpSF.E)}
 cpSFb(4.9,1.0,.22,x,y0+3.95,z-.36,0x14171c);cpSign(pl.type,4.7,.86,x,y0+3.95,z-.48,Math.PI);
 for(const r of[[-2.1,1.69,2.2,2.44],[2.1,1.69,2.2,2.44],[0,1.36,1.62,2.72]]){const q=gT(new THREE.PlaneGeometry(r[2],r[3]),x+r[0],y0+r[1],z-.02,0,Math.PI,0),uv=q.attributes.uv;for(let k=0;k<uv.count;k++){uv.setX(k,(gv%4+uv.getX(k))/4);uv.setY(k,(uv.getY(k)+(gv<4?1:0))/2)}cpSF.GL.push(q)}
 pl.door=cpAddDoor(x-.8,z-.07,0)}
function cpBodyShop(s){const sl=cpFindSlot(cpBlk(s.x),cpBlk(s.z+BLOCK/2+3.5));if(!sl){s.r=0;s.g.visible=false;scene.remove(s.g);const i=msShops.indexOf(s);if(i>=0)msShops.splice(i,1);return}cpClearFront(sl);
 const x=sl[0],z0=sl[1],y0=.3,dk=0x14171c,st=0x3a3f47;s.x=x;s.z=z0-2.1;s.r=2.5;s.g.position.set(s.x,0,s.z);s.ringM.scale.set(2.5,2.5,1.6);s.tube.scale.set(2.5,2.6,2.5);if(s.g.children[2])s.g.children[2].visible=false;s.g.visible=true;
 for(const sx of[-3.55,3.55])cpSFb(.5,4.7,.4,x+sx,y0+2.35,z0-.2,st);cpSFb(7.6,.7,.42,x,y0+4.6,z0-.21,st);
 cpSFb(6.6,2.9,.06,x,y0+1.45,z0-.03,0x0b0c0e);cpSFb(6.4,.08,.6,x,y0+2.88,z0-.3,0xf6fbff,cpSF.E);
 for(let i=0;i<5;i++)cpSFb(6.6,.24,.14,x,y0+3.05+i*.25,z0-.1,i%2?0x8a9098:0x9aa1a8);cpSFb(6.6,.12,.18,x,y0+2.96,z0-.12,0x50565e);
 cpSFb(5.8,.9,.16,x,y0+5.45,z0-.1,dk);cpSign('body',5.5,.7,x,y0+5.45,z0-.19,Math.PI);
 cpSF.F.push(cpCol(gT(new THREE.BoxGeometry(7.8,.1,2.6),x,y0+4.25,z0-1.3,.12,0,0),0xd7dde3));cpSFb(7.8,.3,.08,x,y0+4.1,z0-2.6,dk);for(const lx of[-2.4,0,2.4])cpSFb(.9,.04,.3,x+lx,y0+4.17,z0-1.3,0xf6fbff,cpSF.E);
 for(const sx of[-2.2,2.2])cpSFb(.1,.02,3.5,x+sx,y0+.02,z0-2.05,0xffd60a);cpSFb(4.5,.02,.1,x,y0+.02,z0-3.8,0xffd60a);
 cpSFb(1.1,1.0,.6,x+4.6,y0+.5,z0-.45,0xb91c1c);cpSFb(1.1,.1,.62,x+4.6,y0+1.0,z0-.45,0x7f1d1d);cpSFb(.8,1.4,.5,x-4.5,y0+.7,z0-.4,0x2563eb);
 for(let i=0;i<4;i++)cpSF.F.push(cpCol(gT(new THREE.CylinderGeometry(.42,.42,.28,14),x+4.5,y0+.14+i*.29,z0-1.4),0x111111));
 const m=makePerson(0x1f4e79,0x2b2b2b,0xc68642);m.userData.rlType='m4';m.position.set(x-4.3,.3,z0-1.5);m.rotation.y=-.4;scene.add(m)}
// ---- places ----
const cpSlots=new Set(),cpParkB={'5,5':1,'1,8':1,'8,1':1,'2,2':1,'8,6':1,'4,9':1};
// a free street-facing (north, -z) building facade near block i,j; returns [doorX, facadeZ, solid]. One shop per facade.
// helipad street elevators (vehicles/mod.js) sit on some north facades: a shop may share that facade, but its 7.4 m storefront must clear the elevator door
const cpElevX=new Map();try{if(typeof vhElev!=='undefined')for(const E of vhElev)if(E.R&&E.R.b){if(!cpElevX.has(E.R.b))cpElevX.set(E.R.b,[]);cpElevX.get(E.R.b).push(E.sx)}}catch(e){}
function cpSlotX(b){const w=b.maxX-b.minX,bx=(b.minX+b.maxX)/2,m=Math.max(0,w/2-3.8),xs=w>=24?[bx-w/4,bx+w/4,bx]:[bx,bx-m,bx+m],el=cpElevX.get(b);if(!el)return xs[0];
 for(const x of xs)if(el.every(ex=>Math.abs(x-ex)>=5.4))return x;return undefined}
// a free street-facing (north, -z) building facade near block i,j; returns [doorX, facadeZ, solid]. One shop per facade. pref: take the helipad building of the block first (hospital, police)
function cpFindSlot(i,j,pref){const ord=[];for(let di=-2;di<=2;di++)for(let dj=-2;dj<=2;dj++){const a=i+di,b=j+dj;if(a<0||b<0||a>=N||b>=N||cpParkB[a+','+b])continue;ord.push([a,b,Math.hypot(di,dj)])}ord.sort((p,q)=>p[2]-q[2]);
 for(const o of ord){const cx=roadCenter(o[0])+CELL/2,cz=roadCenter(o[1])+CELL/2,cand=[];
  for(const s of solids){const w=s.maxX-s.minX;if(!(s.h>4.5&&w>8&&w<34)||cpSlots.has(s))continue;const bx=(s.minX+s.maxX)/2,bz=(s.minZ+s.maxZ)/2;if(Math.abs(bx-cx)>BLOCK/2||Math.abs(bz-cz)>BLOCK/2||s.minZ>cz-10||s.minZ<cz-17.5)continue;if(cpSlotX(s)===undefined)continue;cand.push(s)}
  const key=b=>Math.abs((b.minX+b.maxX)/2-cx)-(pref&&cpElevX.has(b)?1000:0);cand.sort((a,b)=>key(a)-key(b));
  if(cand.length){const b=cand[0];cpSlots.add(b);return [cpSlotX(b),b.minZ,b]}}return null}
function cpClearFront(sl){try{if(typeof wdClearFacade==='function')wdClearFacade(sl[2].minX,sl[2].maxX,sl[1],-1,sl[0])}catch(e){}}
function cpAddPlace(type,i,j){const sl=cpFindSlot(i,j,type==='hosp'||type==='police');if(!sl)return null;cpClearFront(sl);const pl={type,D:cpTypes[type],x:sl[0],z:sl[1],cool:0,door:null};
 Object.defineProperty(pl,'room',{get(){return this._r||(this._r=cpGetRoom(this.type))},set(v){this._r=v},enumerable:false});cpPlaces.push(pl);cpFront(pl);return pl}
for(const w of[['police',4,4],['hosp',6,6],['store',3,3],['store',6,3],['store',3,6],['store',7,7],['store',9,4],['store',4,1],['store',6,9],['jewel',6,5],['bank',5,4],['bank',4,6],['safe',5,6],['club',7,3]])cpAddPlace(w[0],w[1],w[2]);
for(const b of[[5,7],[4,3],[6,2],[2,4],[8,4]])if(cpAddPlace('estate',b[0],b[1]))break;
const cpBlk=v=>Math.round((v-(-HALF+ROAD/2)-CELL/2)/CELL);
if(typeof msShops!=='undefined')for(const s of msShops.slice()){try{if(s.kind==='gun'||s.kind==='clinic'){const pl=cpAddPlace(s.kind,cpBlk(s.x),cpBlk(s.z+18));s.r=0;s.g.visible=false;if(pl){s.x=pl.x;s.z=pl.z-1.4;s.cpPl=pl}else msShops.splice(msShops.indexOf(s),1)}else if(s.kind==='body')cpBodyShop(s)}catch(e){console.log('cp shop',e)}}
{const m1=new THREE.Mesh(cpMG(cpSF.F),cpVM);m1.castShadow=true;m1.receiveShadow=true;scene.add(m1);if(cpSF.E.length)scene.add(new THREE.Mesh(cpMG(cpSF.E),cpGlow));
 scene.add(new THREE.Mesh(cpMG(cpSF.GL),new THREE.MeshBasicMaterial({map:cpTexOf('glimpse'),toneMapped:false,color:0xe8e0d0})));scene.add(new THREE.Mesh(cpMG(cpSF.SG),new THREE.MeshBasicMaterial({map:cpSignTex,toneMapped:false})))}
function cpPlace(t){for(const p of cpPlaces)if(p.type===t)return p;return null}
// land/mod.js hangs tall hotel blade signs on the beach-side walls (every second candidate, same rule as there; this mirrors the 'cand' list under 'hotel blade signs on the beach road' in land/mod.js, keep both in sync): keep the generic awning neon off those walls
try{if(typeof wdClearSide==='function'&&typeof ldGlyph==='function'){const cand=solids.filter(s=>s.h>9&&s.h<36&&s.maxX-s.minX>9&&s.minX>roadCenter(10)&&s.maxX<roadCenter(11)).sort((a,b)=>a.minZ-b.minZ);for(let k=0;k<cand.length&&k<18;k+=2){const s=cand[k],zc=(s.minZ+s.maxZ)/2;wdClearSide(zc-2,zc+2,s.maxX,1)}}}catch(e){}
// minimap icons
{const dm=drawMap;drawMap=function(){dm();if(cpIn)return;const g=mapC,S=260,sc=S/215;g.save();g.beginPath();g.arc(S/2,S/2,S/2-4,0,7);g.clip();g.translate(S/2,S/2);g.rotate(camYaw);g.translate(-pos.x*sc,-pos.z*sc);
  for(const p of cpPlaces){if(p.type==='gun'||p.type==='clinic')continue;const x=p.x*sc,z=p.z*sc;g.fillStyle='#000';g.beginPath();g.arc(x,z,7,0,7);g.fill();g.fillStyle='#'+p.D.c.toString(16).padStart(6,'0');g.beginPath();g.arc(x,z,5.2,0,7);g.fill()}g.restore()}}
// ---- transitions: door swing, camera dolly, warm bloom crossfade ----
const cpFadeEl=document.createElement('div');cpFadeEl.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;background:radial-gradient(ellipse at center,#fffdf6 0%,#fff3dc 55%,#ffe2b8 100%);opacity:0;pointer-events:none;z-index:35';document.body.appendChild(cpFadeEl);
let cpIn=null,cpDoorCD=0,cpRob=null,cpShotAt=-99,cpBeat=0,cpSeq=null,cpOvA=0,cpOvS=-1;const cpFrz=[],cpCam={on:false,p:new THREE.Vector3(),q:new THREE.Quaternion()},cpTM=new THREE.Matrix4(),cpUp=new THREE.Vector3(0,1,0),cpTV=new THREE.Vector3(),cpHT=new THREE.Vector3();
const cpEase=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
function cpPose(px,py,pz,tx,ty,tz){const o={p:new THREE.Vector3(px,py,pz),q:new THREE.Quaternion()};cpTM.lookAt(o.p,cpTV.set(tx,ty,tz),cpUp);o.q.setFromRotationMatrix(cpTM);return o}
function cpCamNow(){return {p:cam.position.clone(),q:cam.quaternion.clone()}}
function cpBlend(a,b,u){cpCam.on=true;cpCam.p.copy(a.p).lerp(b.p,u);cpCam.q.copy(a.q).slerp(b.q,u)}
function cpClampCam(v){const R=cpIn&&cpIn.room;if(!R)return false;const x=Math.max(R.x-8.55,Math.min(R.x+8.55,v.x)),z=Math.max(-6.55,Math.min(6.55,v.z)),y=Math.max(.9,Math.min(R.H+.05,v.y)),ch=x!==v.x||y!==v.y||z!==v.z;v.set(x,y,z);return ch}
function cpFollow(){let d=9;try{if(typeof uiZoom!=='undefined')d*=uiZoom}catch(e){}const cp=Math.cos(camPitch),o=cpPose(pos.x+Math.sin(camYaw)*cp*d,pos.y+2+Math.sin(camPitch)*d,pos.z+Math.cos(camYaw)*cp*d,pos.x,pos.y+2,pos.z);if(cpClampCam(o.p)){cpTM.lookAt(o.p,cpTV.set(pos.x,pos.y+1.8,pos.z),cpUp);o.q.setFromRotationMatrix(cpTM)}return o}
function cpHalt(){joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;fireId=null;burstN=0;jumpQ=carQ=false;vel.x=vel.z=0}
function cpWalk(tx,tz,dt,sp){const dx=tx-pos.x,dz=tz-pos.z,d=Math.hypot(dx,dz);if(d<.04){vel.x=vel.z=0;return}const s=Math.min(d,sp*dt);pos.x+=dx/d*s;pos.z+=dz/d*s;vel.x=dx/d*sp;vel.z=dz/d*sp}
function cpFade(fn){if(cpSeq){fn();return}cpSeq={k:'fade',t:0,fn}}
function cpStartIn(pl){cpSeq={k:'in',t:0,pl,c0:cpCamNow()};if(state==='play')state='cpdoor';cpHalt();if(pl.door)pl.door.ta=-1.75;sfx(.3,420,.18)}
function cpStartOut(){const pl=cpIn,R=pl.room;cpSeq={k:'out',t:0,pl,c0:cpCamNow()};if(state==='play')state='cpdoor';cpHalt();if(R.door)R.door.ta=1.6;sfx(.3,420,.18)}
function cpSeqTick(dt){const S=cpSeq;if(!S)return;S.t+=dt;const t=S.t;
 if(S.k==='fade'){cpOvA=Math.min(1,t/.16);if(t>=.16){cpSeq=null;S.fn();if(!cpSeq)cpSeq={k:'fadeout',t:0}}return}
 if(S.k==='fadeout'){cpOvA=Math.max(0,1-t/.3);if(t>=.3){cpSeq=null;cpOvA=0}return}
 if(S.k==='in'){const pl=S.pl;facing=Math.PI;if(t<.85){cpWalk(pl.x,pl.z-(t<.55?.55:.05),dt,3.4);const e1=cpPose(pl.x+.8,2.75,pl.z-3.8,pl.x,1.6,pl.z+2),e2=cpPose(pl.x+.2,2.2,pl.z-1.25,pl.x,1.6,pl.z+3);
   if(t<.55)cpBlend(S.c0,e1,cpEase(t/.55));else cpBlend(e1,e2,cpEase((t-.55)/.3));cpOvA=t<.55?0:cpEase((t-.55)/.3)}else cpGo(pl,true);return}
 if(S.k==='out'){const pl=S.pl,R=pl.room;facing=Math.PI;if(t<.8){cpWalk(R.x,6.7,dt,3.4);const e1=cpPose(R.x-.5,2.75,3.3,R.x,1.6,9),e2=cpPose(R.x-.1,2.2,5.5,R.x,1.5,10);
   if(t<.5)cpBlend(S.c0,e1,cpEase(t/.5));else cpBlend(e1,e2,cpEase((t-.5)/.3));cpOvA=t<.5?0:cpEase((t-.5)/.3)}else cpLeave();return}
 if(S.k==='settle'){facing=S.face;if(S.walk)cpWalk(S.wx,S.wz,dt,2.4);cpOvA=S.flash?Math.max(0,1-t/.32):0;if(S.door&&t>.4)S.door.ta=0;cpBlend(S.c0,cpFollow(),cpEase(t/S.dur));
  if(t>=S.dur){cpCam.on=false;cpSeq=null;cpOvA=0;vel.x=vel.z=0;if(state==='cpdoor')state='play'}}}
function cpFreeze(){cpFrz.length=0;for(const pc of police)if(!pc.dead&&!pc.gone)cpFrz.push({o:pc.m.position,v:pc.m.position.clone(),pc});for(const s of shooters)if(s.kind==='cop'&&!s.dead)cpFrz.push({o:s.g.position,v:s.g.position.clone()})}
{const sp0=spawnPolice;spawnPolice=function(){if(cpIn)return;sp0()}}
const cpRing=document.createElement('div');cpRing.style.cssText='position:fixed;left:50%;top:20%;width:92px;height:92px;margin-left:-46px;border-radius:50%;display:none;align-items:center;justify-content:center;pointer-events:none;z-index:30;color:#fff;font-weight:900;font-size:15px;text-shadow:0 1px 3px #000';document.body.appendChild(cpRing);
function cpShow(R,on){R.grp.visible=on;for(const g of R.ppl)g.visible=on}
function cpGo(pl,fromSeq){const R=pl.room;if(cpIn&&cpIn!==pl)cpShow(cpIn.room,false);cpIn=pl;cpShow(R,true);cpFreeze();
 pos.set(R.x,.3,5.75);vel.set(0,0,0);facing=0;player.rotation.y=0;camYaw=0;camPitch=.3;rainMesh.visible=false;cpDoorCD=1.6;R.ctrIn=false;
 cpLight.position.set(R.x,.3+R.H-.6,0);cpLight.intensity=R.li;cpLight.color.setHex(R.lc);cpLight.distance=30;cpRob=null;if(R.door){R.door.a=1.6;R.door.ta=0;cpDoorSet(R.door)}
 if(R.clerk){R.clerk.rotation.x=0;R.clerk.userData.armL.rotation.x=R.clerk.userData.armR.rotation.x=0}
 if(pl.D&&pl.D.pay){if(!cpSave.robHint)toast('Pull your gun on the clerk: FIRE (left click) to rob the place')}else if(pl.type==='safe'){hp=100;if(wanted<=2){wantedScore=0;wanted=0;evade=0}cpStore();toast('Safehouse: healed, heat cleared, game saved')}
 else if(pl.type==='hosp'||pl.type==='clinic')toast('Walk up to the front desk for treatment');else if(pl.type==='gun')toast('Walk up to the counter to shop');else if(pl.type==='estate')toast('See the agent at the counter to buy property');else if(pl.type==='police')toast(wanted>0?'Bold move walking in here':'Police station');else if(pl.type==='club')toast('Club Neon');
 cpSeq={k:'settle',t:0,dur:.8,flash:cpOvA>.3,c0:cpPose(R.x+.75,2.9,6.7,R.x-.2,1.5,-1),walk:true,wx:R.x,wz:4.3,face:0};if(state==='play'||state==='cpdoor')state='cpdoor'}
function cpEnter(pl){if(pl.D.pay&&pl.cool>T){toast('Closed after the robbery. Try later');cpDoorCD=3;return}
 if(pl.type==='safe'&&!cpSave.own){cpDoorCD=2.5;const e=cpPlace('estate');cpOpen('<div style="font-size:20px;color:#4a9dff">APARTMENT FOR SALE</div>This safehouse is listed with Prime Key Realty. Buy it at their counter, then come back with the keys.<br>Price: <span style="color:#6dff8a">$5,000</span><br>'+cpBtn('w','MARK REALTY ON MAP')+cpBtn('x','OK','#ccc'),k=>{cpClose();if(k==='w'&&e){try{mpWay={x:e.x,z:e.z-2};mpDirty=true}catch(x){}toast('Prime Key Realty marked on your map')}});return}
 if(pl.door)cpStartIn(pl);else cpFade(()=>cpGo(pl))}
function cpLeave(silent){const pl=cpIn;if(!pl)return;if(cpRob&&cpRob.t>0&&!cpRob.done){const part=Math.round(cpRob.pay*Math.min(1,cpRob.t/cpRob.dur)/10)*10;cash+=part;pl.cool=T+150;if(part>0)cpCashFlash()}
 cpRob=null;cpRing.style.display='none';cpIn=null;cpDoorCD=1.8;rainMesh.visible=true;cpLight.intensity=0;const R=pl.room;cpShow(R,false);cpFrz.length=0;if(R.door){R.door.a=R.door.ta=0;cpDoorSet(R.door)}
 if(silent){cpSeq=null;cpCam.on=false;cpOvA=0;return}
 if(pl.door){pos.set(pl.x,.3,pl.z-.85);pl.door.a=pl.door.ta=-1.75;cpDoorSet(pl.door)}else pos.set(pl.x,.3,pl.z-2.6);vel.set(0,0,0);facing=0;player.rotation.y=0;camYaw=Math.PI;camPitch=.35;
 let k=0;for(const pc of police)if(!pc.dead&&!pc.gone){const a=k++*1.3;pc.m.position.set(pl.x+Math.cos(a)*45,0,pl.z-20+Math.sin(a)*30);collide(pc.m.position,2)}for(const s of shooters)if(s.kind==='cop'&&!s.dead){const a=Math.random()*6.3;s.g.position.set(pl.x+Math.cos(a)*22,.3,pl.z-14+Math.sin(a)*8);collide(s.g.position,.5)}
 cpSeq={k:'settle',t:0,dur:.9,flash:cpOvA>.3,c0:cpPose(pl.x-1.8,2.1,pl.z-5.8,pl.x,1.5,pl.z-.3),walk:!!pl.door,wx:pl.x,wz:pl.z-2.6,face:0,door:pl.door};if(state==='play'||state==='cpdoor')state='cpdoor'}
{const c0=collide;collide=function(p,r,maxH){if(cpIn&&p===pos){const R=cpIn.room;p.x=Math.max(R.x-8.3,Math.min(R.x+8.3,p.x));p.z=Math.max(R.zmin,Math.min(6.7,p.z));
  for(const o of R.obs){const cx=Math.max(o[0],Math.min(p.x,o[1])),cz=Math.max(o[2],Math.min(p.z,o[3])),dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;if(d2<.2025){const d=Math.sqrt(d2);if(d<1e-4)p.z=o[3]+.45;else{p.x+=dx/d*(.45-d);p.z+=dz/d*(.45-d)}}}return false}return c0(p,r,maxH)}}
{const s0=shoot;shoot=function(){cpShotAt=T;s0();for(const q of peds){const u=q.userData;if(u.dead||u.cpPan>0)continue;if(Math.hypot(q.position.x-pos.x,q.position.z-pos.z)<30){u.cpPan=8;u.cpSpd=u.path.spd;u.path.spd=Math.min(3.6,u.path.spd*2.6)}}}}
{const r0=respawn;respawn=function(){if(cpIn)cpLeave(true);r0();const h=cpPlace('hosp');if(h){pos.set(h.x,.3,h.z-3);camYaw=Math.PI}}}
// ---- counters: buying happens inside, at the desk ----
const cpCounterH={};
function cpOpenCounter(kind,onOpen){cpCounterH[kind]=onOpen}
function cpClinic(pl){if(hp>=100){toast('Nurse: you look healthy to me');return}const fee=Math.max(20,Math.round((100-hp)*2));
 cpOpen('<div style="font-size:20px;color:#ff6f91">'+pl.D.l+'</div>Full treatment restores your health.<br>Fee: <span style="color:#6dff8a">$'+fee+'</span> &nbsp; You have $'+cash+'<br>'+cpBtn('pay','PAY')+cpBtn('x','NOT NOW','#ccc'),k=>{if(k==='pay'){if(cash>=fee){cash-=fee;hp=100;cpClose();toast('Patched up  -$'+fee);beep(900,.12,.12);setTimeout(()=>beep(1200,.2,.12),110)}else toast('Not enough cash')}else cpClose()})}
function cpGunFallback(){const it=[['SMG AMMO +60',150,()=>{WEAP[1].ammo+=60}],['SHOTGUN +12',200,()=>{WEAP[2].ammo+=12}],['ROCKETS +3',600,()=>{WEAP[3].ammo+=3}],['ARMOR',300,()=>{armor=100}]];
 cpOpen('<div style="font-size:20px;color:#ffb020">IRONSIGHT GUNS</div>You have $'+cash+'<br>'+it.map((a,i)=>cpBtn(i,a[0]+' $'+a[1])).join('')+cpBtn('x','CLOSE','#ccc'),k=>{if(k==='x'){cpClose();return}const a=it[+k];if(cash>=a[1]){cash-=a[1];a[2]();toast('Bought '+a[0])}else toast('Not enough cash')})}
function cpEstate(pl){let L=[];try{if(typeof stProps!=='undefined'&&typeof stBuy==='function')L=stProps}catch(e){}
 const own=P=>{try{return typeof stOwn==='function'?stOwn(P):(P.id==='safe'&&cpSave.own)}catch(e){return false}},
 draw=()=>{let h='<div style="font-size:20px;color:#6dff8a">PRIME KEY REALTY</div><div style="font-weight:500;font-size:13px">Tap a listing to buy it. You have $'+cash+'</div>';
  if(L.length){for(const P of L)h+='<div data-k="'+P.id+'" style="margin-top:8px;padding:8px 10px;border-radius:10px;background:'+(own(P)?'#1e2a22':'#232831')+';border:1px solid #ffffff22"><span style="color:'+(own(P)?'#6dff8a':'#fff')+'">'+P.n+'</span> <span style="float:right;color:#6dff8a">'+(own(P)?'OWNED':'$'+P.p.toLocaleString())+'</span><div style="font-weight:500;font-size:12px;color:#aab">'+(P.d||'')+'</div></div>'}
  else h+='<div data-k="safe" style="margin-top:8px;padding:8px 10px;border-radius:10px;background:#232831">Safehouse Apartment <span style="float:right;color:#6dff8a">'+(cpSave.own?'OWNED':'$5,000')+'</span></div>';
  cpOpen(h+cpBtn('x','CLOSE','#ccc'),k=>{if(k==='x'){cpClose();return}if(L.length){const P=L.find(q=>q.id===k);if(!P||own(P))return;try{if(stBuy(P)){toast('Keys to '+P.n+' are yours');try{if(P.x!==undefined){mpWay={x:P.x,z:P.z};mpDirty=true}}catch(e){}}}catch(e){}draw()}
   else if(!cpSave.own){if(cash>=5000){cash-=5000;cpSave.own=true;cpStore();cpBanner('PROPERTY BOUGHT','#6dff8a','Safehouse Apartment',2.4);draw()}else toast('Not enough cash')}})};draw()}
function cpCounter(pl,R){const k=R.ctr.k,h=cpCounterH[k];if(h){try{h(pl,R)}catch(e){console.log('cp counter',e)}return}
 if(k==='gun'){if(typeof msOpenMenu==='function')msOpenMenu();else cpGunFallback()}else if(k==='clinic')cpClinic(pl);else if(k==='estate')cpEstate(pl)}
// ---- render hook: interior lighting, camera override / clamp, hide outdoor markers indoors ----
{const rr=renderer.render.bind(renderer),hc=new THREE.Color(),hg=new THREE.Color(),mapEl=$('map');let mapHid=false;
 renderer.render=function(s,c){if(s!==scene||c!==cam)return rr(s,c);
  if(cpCam.on){cam.position.copy(cpCam.p);cam.quaternion.copy(cpCam.q);cam.updateMatrixWorld()}else if(cpIn&&cpClampCam(cam.position)){cam.lookAt(pos.x,pos.y+1.8,pos.z);cam.updateMatrixWorld()}
  const ins=!!cpIn;if(ins!==mapHid){mapHid=ins;if(mapEl)mapEl.style.visibility=ins?'hidden':''}
  if(!ins)return rr(s,c);const R=cpIn.room,si=sun.intensity,hi=hemi.intensity,bv=beam.visible,rv=ring.visible,av=arrow.visible;let mb=null;try{if(typeof mpBeam!=='undefined'&&mpBeam){mb=mpBeam;mb.cpV=mb.visible;mb.visible=false}}catch(e){}
  try{if(typeof fxPt!=='undefined')fxPt.style.display='none'}catch(e){}
  hc.copy(hemi.color);hg.copy(hemi.groundColor);sun.intensity=0;hemi.intensity=R.amb;hemi.color.setHex(0xfff1e0);hemi.groundColor.setHex(0x4a4038);beam.visible=ring.visible=arrow.visible=false;
  try{rr(s,c)}finally{sun.intensity=si;hemi.intensity=hi;hemi.color.copy(hc);hemi.groundColor.copy(hg);beam.visible=bv;ring.visible=rv;arrow.visible=av;if(mb)mb.visible=mb.cpV}}}
// ---- inside: robbery, counters, ambient life ----
function cpInTick(dt){const pl=cpIn,R=pl.room,D=pl.D||{};evade=0;cpScrM.uniforms.uT.value=T;
 for(const w of R.walk){if(w.stop)continue;const g=w.g;if(w.pause>0){w.pause-=dt;continue}const p=w.pts[w.i],tx=R.x+p[0],tz=p[1],dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);if(d<.15){w.i=(w.i+1)%w.pts.length;w.pause=1+Math.random()*2.5;continue}g.position.x+=dx/d*1.1*dt;g.position.z+=dz/d*1.1*dt;g.rotation.y=Math.atan2(-dx,-dz);w.w+=dt*6;animLimbs(g,1.1,w.w)}
 if(R.ctr&&state==='play'){const d=Math.hypot(pos.x-R.ctr.x,pos.z-R.ctr.z);if(d<1.7){if(!R.ctrIn){R.ctrIn=true;cpCounter(pl,R)}}else if(d>2.6)R.ctrIn=false}
 if(R.ball)R.ball.rotation.y+=dt*.8;
 if(pl.type==='club'){cpBeat-=dt;if(cpBeat<=0){cpBeat=.46;sfx(.12,120,.5);cpLight.color.setHSL(Math.random(),1,.6);if(R.dance){const C=new THREE.Color();for(let i=0;i<16;i++)R.dance.setColorAt(i,C.setHSL(Math.random(),1,.55));R.dance.instanceColor.needsUpdate=true}}
  (R.dancers||[]).forEach((g,i)=>{const u=g.userData,s=Math.sin(T*6.8+i);g.position.y=.3+Math.abs(s)*.22;g.rotation.y+=dt*(i%2?1.2:-1);u.armL.rotation.x=-2+s;u.armR.rotation.x=-2-s;u.legL.rotation.x=s*.4;u.legR.rotation.x=-s*.4});return}
 if(!D.pay||!R.clerk||state!=='play')return;cpRobTick(pl,R,D,dt)}
// ===== robbery: shown, not told. The clerk raises both hands, empties the till and pushes bundles of cash across the counter; customers crouch or run =====
const cpRobCfg={store:{tx:-1.6,cz:-4.5,top:1.06,fz:-3.32},jewel:{tx:0,cz:-4.6,top:1.46,fz:-3.28},bank:{tx:0,cz:-4.15,top:1.21,fz:-2.86}},
 cpBundG=new THREE.BoxGeometry(.32,.12,.16),cpBundM=new THREE.MeshStandardMaterial({color:0x6fbf73,roughness:.8}),cpBandM=new THREE.MeshStandardMaterial({color:0xf2e6c0,roughness:.7}),cpBandG=new THREE.BoxGeometry(.06,.125,.165);
const cpPF=new THREE.Vector3(),cpPU=new THREE.Vector3(),cpPR=new THREE.Vector3(),cpPQ=new THREE.Quaternion(),cpPD=new THREE.Vector3(),cpHV=new THREE.Vector3();
// arm poses: direction of the upper arm, then the forearm, in the person's own forward / up / right axes (mirrored for the left arm)
const cpPoses={up:[[.12,.2,1],[.12,1,.08]],reach:[[.5,-.82,.14],[.92,-.42,-.15]],give:[[.82,-.32,.1],[1,.06,-.28]],cower:[[.55,.55,.55],[-.2,.9,-.55]]};
// applied after real/mod.js has run the animation mixer for this frame (crime's MODS hook runs after real's), so it layers on top of the clip
const cpArmB=[['L_UpperArm','L_Forearm'],['L_Forearm','L_Hand'],['R_UpperArm','R_Forearm'],['R_Forearm','R_Hand']],cpArmLow={up:-2.9,reach:-.8,give:-1.35,cower:-2.6};
function cpArmAp(B,P,wt){for(let si=0;si<2;si++){const s=si?1:-1;for(let i=0;i<2;i++){const d=P[i],bn=cpArmB[si*2+i];cpPD.set(0,0,0).addScaledVector(cpPF,d[0]).addScaledVector(cpPU,d[1]).addScaledVector(cpPR,d[2]*s).normalize();
  rlPoint(B[bn[0]],B[bn[1]],cpPD,wt)}}}
function cpArm(g,k,w,k0){const u=g.userData,a=u.av;if(a&&a.B&&typeof rlPoint==='function'){g.getWorldQuaternion(cpPQ);cpPF.set(0,0,-1).applyQuaternion(cpPQ);cpPU.set(0,1,0).applyQuaternion(cpPQ);cpPR.set(1,0,0).applyQuaternion(cpPQ);
  if(k0&&k0!==k)cpArmAp(a.B,cpPoses[k0],1);cpArmAp(a.B,cpPoses[k],w);return}
 if(!u.armL)return;const t=cpArmLow[k];u.armL.rotation.x=u.armR.rotation.x=t;u.armL.rotation.z=k==='up'?-.5:0;u.armR.rotation.z=k==='up'?.5:0}
function cpHand(g,out){const a=g.userData.av;if(a&&a.B&&a.B.R_Hand){a.B.R_Hand.getWorldPosition(out);return out}g.getWorldQuaternion(cpPQ);cpPF.set(0,0,-1).applyQuaternion(cpPQ);return out.copy(g.position).addScaledVector(cpPF,.5).setY(1.4)}
function cpFace(g,x,z,dt,k){const ty=Math.atan2(-(x-g.position.x),-(z-g.position.z));let d=ty-g.rotation.y;d=((d+Math.PI*3)%(Math.PI*2))-Math.PI;g.rotation.y+=d*Math.min(1,dt*(k||8))}
function cpRobReset(R){if(!R)return;cpSG.visible=cpSGF.visible=false;if(R.robFx){for(const b of R.robFx)R.grp.remove(b.m);R.robFx.length=0}
 for(const g of R.ppl){const u=g.userData;if(!u.cpHome)u.cpHome=[g.position.x,g.position.z,g.rotation.y];else{g.position.set(u.cpHome[0],.3,u.cpHome[1]);g.rotation.y=u.cpHome[2]}
  u.cpRe=null;u.cpNerv=0;g.rotation.x=0;try{rlPlay(g,null)}catch(e){}if(u.armL){u.armL.rotation.set(0,0,0);u.armR.rotation.set(0,0,0)}}
 for(const w of R.walk)w.stop=false}
{const g0=cpGo;cpGo=function(pl,f){g0(pl,f);try{cpRobReset(pl.room)}catch(e){console.log('cp rob reset',e)}}}
// customers: some freeze and crouch, some bolt for the door
function cpPanic(R,c){let k=0;for(const g of R.ppl){if(g===c||g.userData.cpRe)continue;const w=R.walk.find(q=>q.g===g);if(w)w.stop=true;
  const run=w?(k++%2===0):Math.random()<.2;g.userData.cpRe={k:run?'run':'cower',t:Math.random()*.5}}}
function cpPanicTick(R,dt){for(const g of R.ppl){const e=g.userData.cpRe;if(!e)continue;if(e.t>0){e.t-=dt;continue}
  if(e.k==='run'){if(!e.wp){const sx=g.position.x<R.x?-.3:.3;e.wp=[[g.position.x,5.6],[R.x+sx,5.6],[R.x+sx,6.7]]}const q=e.wp[0],tx=q[0],tz=q[1],dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);if(d<.3){e.wp.shift();if(!e.wp.length){g.visible=false;e.k='gone'}continue}
   const sp=4.6;g.position.x+=dx/d*sp*dt;g.position.z+=dz/d*sp*dt;g.rotation.y=Math.atan2(-dx,-dz);if(!g.userData.av&&g.userData.legL)animLimbs(g,sp,T*14)}
  else if(e.k==='cower'){if(!e.on){e.on=true;try{rlPlay(g,'Cower',{fade:.25})}catch(x){}}cpFace(g,pos.x,pos.z,dt,3);if(!g.userData.av)cpArm(g,'up',1)}}}
function cpCashFlash(){const el=$('cash');if(!el)return;el.style.transition='transform .2s,color .2s';el.style.transform='scale(1.35)';el.style.color='#6dff8a';clearTimeout(cpCashFlash.h);cpCashFlash.h=setTimeout(()=>{el.style.transform='';el.style.color=''},700)}
// armed clerk: a pump shotgun held at the hand, muzzle flash on each shot (one shared mesh, parented to the room being robbed)
const cpSG=new THREE.Mesh(U.mergeBufferGeometries([gT(new THREE.CylinderGeometry(.03,.03,.78,8),0,.02,.28,Math.PI/2,0,0),gT(new THREE.CylinderGeometry(.035,.035,.36,8),0,-.04,.22,Math.PI/2,0,0),bxg(.07,.12,.34,0,-.02,-.12),bxg(.06,.14,.3,0,-.08,-.38)]),new THREE.MeshStandardMaterial({color:0x2a2420,roughness:.55,metalness:.4})),
 cpSGF=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,0),new THREE.MeshBasicMaterial({color:0xffd27a,toneMapped:false}));cpSG.visible=false;cpSGF.visible=false;cpSGF.position.set(0,.02,.74);cpSG.add(cpSGF);
const cpSGV=new THREE.Vector3(),cpSGT=new THREE.Vector3(),cpRobDur={reach:.8,give:.65};
function cpRobAdd(R,C,c,st){const k=R.robFx.length,m=new THREE.Mesh(cpBundG,cpBundM),band=new THREE.Mesh(cpBandG,cpBandM);m.add(band);m.rotation.y=cpR(-.4,.4);
 const tp=new THREE.Vector3(R.x+C.tx+((k%3)-1)*.34+cpR(-.04,.04),.3+C.top+.04+(Math.floor(k/3)%4)*.125,C.fz-Math.floor(k/12)*.17);R.grp.add(m);const b={m,p0:new THREE.Vector3(),tp,e:0,st};
 if(st==='slide')b.p0.set(R.x+C.tx,.3+C.top-.3,C.fz-.6);else cpHand(c,b.p0);m.position.copy(b.p0);R.robFx.push(b);beep(990,.12,.04);return b}
function cpRobTick(pl,R,D,dt){const c=R.clerk,u=c.userData,C=cpRobCfg[pl.type]||cpRobCfg.store;cpPanicTick(R,dt);
 if(!cpRob){const near=Math.hypot(pos.x-c.position.x,pos.z-c.position.z)<11;if(near&&(fireId!==null||T-cpShotAt<.4)){
   cpRob={t:0,dur:D.dur,pay:Math.round(cpR(D.pay[0],D.pay[1])/10)*10,armed:Math.random()<.25,cd:1.6,down:false,start:T,ph:'up',pt:0,k0:null,n:0,walk:0,cur:null};cpStars(D.stars);
   if(!cpSave.robHint){cpSave.robHint=1;cpStore()}cpPanic(R,c);sfx(.25,300,.3);if(!R.robFx)R.robFx=[]}return}
 const r=cpRob;
 // the till is empty: the bundles on the counter fly into the player's bag, the clerk crouches behind the counter
 if(r.done){for(let i=R.robFx.length-1;i>=0;i--){const b=R.robFx[i];if(!b.fly)continue;b.fly+=dt*2.4;const e=Math.min(1,b.fly);cpHV.set(pos.x,pos.y+1.2,pos.z);b.m.position.lerpVectors(b.p0,cpHV,e*e);b.m.position.y+=Math.sin(e*Math.PI)*.5;if(e>=1){R.grp.remove(b.m);R.robFx.splice(i,1)}}
  if(!r.down){cpFace(c,pos.x,pos.z,dt,3);if(!r.cow){r.cow=1;try{rlPlay(c,'Cower',{fade:.3})}catch(e){}}if(!u.av)cpArm(c,'cower',1)}return}
 // the clerk steps over to the till
 if(r.walk<1&&!r.down){r.walk=Math.min(1,r.walk+dt*1.6);c.position.x+=(R.x+C.tx-c.position.x)*Math.min(1,dt*6);c.position.z+=(C.cz-c.position.z)*Math.min(1,dt*6)}
 if(r.armed&&!r.down){cpFace(c,pos.x,pos.z,dt);u.rlAimT=T+.3;if(u.armR&&!u.av){u.armR.rotation.x=Math.PI/2;u.armL.rotation.x=1.2}r.cd-=dt;
  if(u.av&&u.av.gun)u.av.gun.visible=false;if(cpSG.parent!==R.grp)R.grp.add(cpSG);cpSG.visible=true;cpHand(c,cpSG.position);cpSG.lookAt(cpSGT.set(pos.x,pos.y+1.3,pos.z));
  if(!r.pump){r.pump=1;sfx(.08,260,.25);setTimeout(()=>sfx(.08,200,.25),140)}
  if(cpSGF.visible&&T>r.fl)cpSGF.visible=false;
  if(r.cd<=0){r.cd=1.9;cpSGF.visible=true;r.fl=T+.06;cpSG.localToWorld(cpSGV.set(0,.02,.8));tracer(cpSGV,cpSGT.set(pos.x,1.5,pos.z));burst(cpSGV,6,0xffcc66,3,.18,.18,.5);
   try{if(typeof auGun==='function'&&AC){auInit();auGun('SHOTGUN',1)}else sfx(.4,1100,.8)}catch(e){sfx(.4,1100,.8)}hurt(15)}
  if(cpShotAt>r.start+.6){r.down=true;u.rlAimT=0;c.rotation.x=-Math.PI/2;cpSG.visible=cpSGF.visible=false;cpStars(Math.min(5,D.stars+1));r.pt=0}return}
 if(cpSG.visible)cpSG.visible=cpSGF.visible=false;
 r.t+=dt*(r.down?1.4:1);r.pt+=dt;
 if(!r.down){const ph=r.ph,dur=ph==='up'?(r.n?.45:1.0):cpRobDur[ph];let w=Math.min(1,r.pt/.28);w=w*w*(3-2*w);
  if(ph==='reach')cpFace(c,R.x+C.tx,C.fz+3,dt,6);else cpFace(c,pos.x,pos.z,dt,6);
  if(!u.cpNerv){u.cpNerv=1;try{rlPlay(c,'Nervous',{fade:.25})}catch(e){}}
  cpArm(c,ph,w,r.k0);
  if(ph==='give'){if(!r.cur)r.cur=cpRobAdd(R,C,c,'hand');if(r.pt>.34&&r.cur.st==='hand'){r.cur.st='slide';r.cur.p0.copy(r.cur.m.position)}}
  if(r.pt>=dur){r.k0=ph;r.pt=0;r.ph=ph==='up'?'reach':(ph==='reach'?'give':'up');if(ph==='give'){r.n++;if(r.cur&&r.cur.st==='hand'){r.cur.st='slide';r.cur.p0.copy(r.cur.m.position)}r.cur=null}}}
 else if(r.pt>.8){r.pt=0;cpRobAdd(R,C,c,'slide')}
 for(const b of R.robFx){if(b.st==='hand')cpHand(c,b.m.position);else if(b.st==='slide'){b.e=Math.min(1,b.e+dt*3.2);const e=b.e;b.m.position.lerpVectors(b.p0,b.tp,e*e*(3-2*e));if(e>=1)b.st='rest'}}
 if(r.t>=r.dur){r.done=true;cash+=r.pay;pl.cool=T+150;u.cpNerv=0;try{rlPlay(c,null)}catch(e){}for(const b of R.robFx){b.p0=b.m.position.clone();b.st='fly';b.fly=.001+Math.random()*.25}
  cpCashFlash();sfx(.2,1500,.2);if(typeof msSave==='function')msSave()}}
let cpInit=false;
function cpIntTick(dt){
 if(!cpInit){cpInit=true;try{if(typeof mpIcons!=='undefined')for(const p of cpPlaces){if(p.type==='gun'||p.type==='clinic')continue;mpIcons.push({x:p.x,z:p.z,label:p.D.l,color:'#'+p.D.c.toString(16).padStart(6,'0'),glyph:{store:'$',jewel:'J',bank:'B',safe:'H',police:'P',hosp:'+',club:'C',estate:'R'}[p.type]||'*'})}}catch(e){}
  for(const t of['stlux','stoff']){const R=cpRooms[t];if(!R||!R.mine)continue;for(const o of scene.children){if(!o.isMesh||o.userData.cpMine)continue;const gb=o.geometry;if(!gb.boundingSphere)gb.computeBoundingSphere();const c=gb.boundingSphere.center;if(Math.abs(c.x+o.position.x-R.x)<10&&Math.abs(c.z+o.position.z)<8.5&&c.y<8)o.visible=false}}}
 for(const d of cpDoors)if(d.a!==d.ta){const s=dt*5.5;d.a=Math.abs(d.ta-d.a)<s?d.ta:d.a+Math.sign(d.ta-d.a)*s;cpDoorSet(d)}
 cpSeqTick(dt);if(cpOvA!==cpOvS){cpOvS=cpOvA;cpFadeEl.style.opacity=cpOvA}
 if(cpIn){for(const f of cpFrz){f.o.copy(f.v);if(f.pc)f.pc.speed=0}cpInTick(dt);
  if(state==='play'&&!cpSeq&&cpDoorCD<=0&&pos.z>6.05&&Math.abs(pos.x-cpIn.room.x)<2.4)cpStartOut()}
 else if(state==='play'&&!driving&&cpDoorCD<=0&&!cpSeq){for(const p of cpPlaces)if(p.door&&Math.abs(pos.x-p.x)<1.25&&pos.z<p.z&&pos.z>p.z-1.6&&vel.z>-1){cpEnter(p);break}}
 if(cpIn||cpSeq){const sh=Math.sin(dayT*Math.PI*2),dv=Math.max(0,Math.min(1,sh*3+.5));cpWinM.color.setRGB(.16+.84*dv,.18+.82*dv,.3+.7*dv);cpStreetM.color.copy(cpWinM.color)}}

// garage in front of the safehouse
const cpGar=(()=>{const p=cpPlace('safe');if(!p)return null;const m=new THREE.Mesh(new THREE.RingGeometry(1.9,2.4,28),new THREE.MeshBasicMaterial({color:0x4a9dff,toneMapped:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(p.x+6,.06,p.z-6.2);scene.add(m);return {m,x:p.x+6,z:p.z-6.2,cd:0,away:true}})();
function cpGarTick(dt){const G=cpGar;if(!G)return;G.m.visible=cpSave.own;if(!cpSave.own)return;G.cd-=dt;const d=Math.hypot(pos.x-G.x,pos.z-G.z);if(d>5)G.away=true;if(d>2.6||G.cd>0||!G.away||state!=='play')return;
 if(driving&&!driving.custom&&!driving.vhT&&!driving.vhBike&&Math.abs(driving.speed)<4&&cpSave.car===null){const c=driving,col=c.m.children[0]&&c.m.children[0].material&&c.m.children[0].material.color?c.m.children[0].material.color.getHex():0xe63946;scene.remove(c.m);const i=cars.indexOf(c);if(i>=0)cars.splice(i,1);driving=null;player.visible=true;pos.set(G.x,.3,G.z+3);cpSave.car=col;cpStore();G.cd=3;G.away=false;toast('Car stored in your garage')}
 else if(!driving&&cpSave.car!==null){const m=makeCar(cpSave.car,.9);m.position.set(G.x,0,G.z);m.rotation.y=Math.PI/2;scene.add(m);cars.push({m,speed:0,steer:0});cpSave.car=null;cpStore();G.cd=3;G.away=false;toast('Your car is out front')}}
// ----- police helicopter -----
const cpHelis=[];let cpHeliCD=3;const cpSR=new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false}),cpSB=new THREE.MeshBasicMaterial({color:0x2050ff,toneMapped:false});
const cpHG=(()=>{const n=0x14213d,w=0xf4f4f4,k=0x1a1a1a;return {body:cpMG([cpB(1.9,1.8,3.6,0,0,0,n),cpB(1.7,1.3,1.3,0,-.1,-2.3,n),cpB(1.5,.75,.8,0,.2,-2.6,0x7fb8e6),cpB(.5,.5,4.4,0,.45,3.9,n),cpB(.14,1.6,1,0,1.1,5.7,w),cpB(1.96,.4,3.2,0,-.25,0,w),cpB(.12,.12,3.6,-.95,-1.5,0,k),cpB(.12,.12,3.6,.95,-1.5,0,k),cpB(.1,.7,.1,-.95,-1.15,-1,k),cpB(.1,.7,.1,.95,-1.15,-1,k),cpB(.1,.7,.1,-.95,-1.15,1,k),cpB(.1,.7,.1,.95,-1.15,1,k),cpB(.3,.6,.3,0,1.2,0,k),cpCy(.32,.3,10,0,-1.05,-1.9,w,Math.PI/2)]),
 rotor:cpMG([cpB(9.4,.06,.36,0,0,0,k),cpB(.36,.06,9.4,0,0,0,k)]),tail:cpB(.06,1.7,.2,0,0,0,k),lamp:new THREE.BoxGeometry(.3,.2,.3)}})();
function cpMakeHeli(){const g=new THREE.Group();g.add(new THREE.Mesh(cpHG.body,cpVM));const r=new THREE.Mesh(cpHG.rotor,cpVM);r.position.y=1.56;g.add(r);const t=new THREE.Mesh(cpHG.tail,cpVM);t.position.set(.22,1.2,5.7);g.add(t);
 const a=new THREE.Mesh(cpHG.lamp,cpSR);a.position.set(-.6,-.95,.8);const b=new THREE.Mesh(cpHG.lamp,cpSB);b.position.set(.6,-.95,.8);g.add(a,b);g.userData={rotor:r,trotor:t};g.scale.setScalar(1.25);return g}
const cpSpot=new THREE.SpotLight(0xdbe9ff,0,80,.17,.5,1.5);scene.add(cpSpot);scene.add(cpSpot.target);
const cpCone=new THREE.Mesh(new THREE.ConeGeometry(6.5,1,24,1,true),new THREE.MeshBasicMaterial({color:0xcfe2ff,transparent:true,opacity:.07,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false}));cpCone.visible=false;cpCone.frustumCulled=false;scene.add(cpCone);
const cpDisc=new THREE.Mesh(new THREE.CircleGeometry(6.5,28),new THREE.MeshBasicMaterial({color:0xcfe2ff,transparent:true,opacity:.14,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));cpDisc.rotation.x=-Math.PI/2;cpDisc.visible=false;scene.add(cpDisc);
function cpHeliSpawn(){const a=Math.random()*6.283,m=cpMakeHeli();m.position.set(pos.x+Math.cos(a)*120,46,pos.z+Math.sin(a)*120);scene.add(m);cpHelis.push({m,hp:42,ang:a,dir:Math.random()<.5?1:-1,rad:24+cpHelis.length*9,alt:30+cpHelis.length*8,cd:3,bn:0,snd:0,down:false,leave:false,vy:0});toast('POLICE HELICOPTER INBOUND')}
function cpHeliDown(h){if(h.down)return;h.down=true;h.vy=2;crime(2);toast('Helicopter hit!');burst(h.m.position,16,0xffaa22,9,.8,.7,1);sfx(.8,600,.8,h.m.position)}
function cpCover(){for(const s of solids)if(s.h>12&&pos.x>s.minX-3.5&&pos.x<s.maxX+3.5&&pos.z>s.minZ-3.5&&pos.z<s.maxZ+3.5)return true;return false}
function cpHeliTick(dt){const act=state==='play'||state==='cpmenu',need=act&&!cpIn?(wanted>=5?2:(wanted>=3?1:0)):0;let alive=0,lead=null;for(const h of cpHelis)if(!h.down&&!h.leave)alive++;
 cpHeliCD-=dt;if(alive<need&&cpHeliCD<=0){cpHeliCD=16;cpHeliSpawn()}
 const tg=driving?driving.m.position:(cpIn&&cpIn.x!==undefined?cpHT.set(cpIn.x,0,cpIn.z-8):pos),flash=Math.sin(T*13)>0;cpSR.color.setRGB(flash?4:.15,0,0);cpSB.color.setRGB(0,0,flash?.15:4);
 for(let i=cpHelis.length-1;i>=0;i--){const h=cpHelis[i],m=h.m,p=m.position;m.userData.rotor.rotation.y+=dt*(h.down?14:32);m.userData.trotor.rotation.x+=dt*45;
  if(h.down){h.vy-=13*dt;p.y+=h.vy*dt;m.rotation.y+=dt*6;m.rotation.z=.4;p.x+=Math.cos(h.ang)*6*dt;p.z+=Math.sin(h.ang)*6*dt;if(Math.random()<.5)burst(p,1,0x333333,2,.9,1,.8);
   let fl=1.5;for(const s of solids)if(s.h>4&&p.x>s.minX&&p.x<s.maxX&&p.z>s.minZ&&p.z<s.maxZ)fl=Math.max(fl,s.h+1.5);if(p.y<=fl){explode(p.clone());crime(2);cash+=500;toast('Helicopter down! +$500');scene.remove(m);cpHelis.splice(i,1)}continue}
  if(!h.leave&&(wanted<3||cpIn||state==='dead'))h.leave=true;if(h.leave&&wanted>=3&&!cpIn&&state==='play')h.leave=false;
  if(h.leave){p.x+=Math.cos(h.ang)*30*dt;p.z+=Math.sin(h.ang)*30*dt;p.y+=6*dt;m.rotation.y=Math.atan2(-Math.cos(h.ang),-Math.sin(h.ang));if(Math.hypot(p.x-pos.x,p.z-pos.z)>240){scene.remove(m);cpHelis.splice(i,1)}continue}
  h.ang+=dt*.42*h.dir;const d=new THREE.Vector3(tg.x+Math.cos(h.ang)*h.rad-p.x,h.alt+(tg.y||0)*.6-p.y,tg.z+Math.sin(h.ang)*h.rad-p.z),L=d.length();if(L>.01)p.addScaledVector(d.normalize(),Math.min(40,L*1.3)*dt);
  let fl=0;for(const s of solids)if(s.h>p.y-6&&p.x>s.minX-4&&p.x<s.maxX+4&&p.z>s.minZ-4&&p.z<s.maxZ+4)fl=Math.max(fl,s.h+7);if(p.y<fl)p.y+=(fl-p.y)*Math.min(1,dt*3);
  m.rotation.y=Math.atan2(-(tg.x-p.x),-(tg.z-p.z));m.rotation.z=.14*h.dir;m.rotation.x=-.12;
  const dist=p.distanceTo(tg);if(dist<130){evade=-.5;if(!lead)lead=h}h.snd-=dt;if(h.snd<=0){h.snd=.12;sfx(.07,230,.3,p)}
  h.cd-=dt;if(h.cd<=0&&dist<80&&state==='play'){if(h.bn<=0)h.bn=wanted>=5?6:4;h.bn--;h.cd=h.bn>0?.13:2.1+Math.random();
   let ch=.24;if(driving&&Math.abs(driving.speed)>18)ch*=.45;if(cpCover())ch*=.3;const o=p.clone().setY(p.y-.8),hit=Math.random()<ch,e=new THREE.Vector3(tg.x,(tg.y||0)+1.4,tg.z);if(!hit)e.add(new THREE.Vector3(cpR(-3,3),0,cpR(-3,3)));tracer(o,e);if(!hit)burst(e.setY(.2),2,0xcccccc,2,.2,.3);sfx(.14,1500,.45,p);if(hit)hurt(4)}}
 const night=1-Math.max(0,Math.min(1,Math.sin(dayT*Math.PI*2)*3+.5));
 if(lead){const p=lead.m.position,gp=new THREE.Vector3(tg.x,.12,tg.z),v=new THREE.Vector3().subVectors(p,gp),L=v.length();cpSpot.position.copy(p);cpSpot.target.position.copy(gp);cpSpot.intensity=.5+night*2;
  cpCone.visible=cpDisc.visible=true;cpCone.position.copy(gp).addScaledVector(v,.5);cpCone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());cpCone.scale.set(1,L,1);cpCone.material.opacity=.02+night*.05;cpDisc.position.copy(gp);cpDisc.material.opacity=.03+night*.08}
 else{cpSpot.intensity=0;cpCone.visible=cpDisc.visible=false}}
{const at=allTargets;allTargets=function(){const o=at();for(const h of cpHelis)if(!h.down)o.push({kind:'heli',obj:h,p:h.m.position.clone(),hostile:true});if(cpMug&&!cpMug.done)o.push({kind:'mug',obj:cpMug,p:cpMug.g.position.clone().setY(1.5),hostile:true});return o}}
{const dm=damage;damage=function(t,dmg){if(t.kind==='heli'){const h=t.obj;h.hp-=dmg;burst(t.p,5,0xffdd66,6,.2,.3);crime(.3);if(h.hp<=0)cpHeliDown(h);return}if(t.kind==='mug'){cpMugEnd(true);return}dm(t,dmg)}}
{const ex=explode;explode=function(p){ex(p);for(const h of cpHelis)if(!h.down&&h.m.position.distanceTo(p)<11)cpHeliDown(h)}}
// ----- SWAT vans, army jeeps, heavier officers -----
const cpWheelG=gT(new THREE.CylinderGeometry(.58,.58,.5,14),0,0,0,0,0,Math.PI/2),cpWheelM=new THREE.MeshStandardMaterial({color:0x0d0d0d,roughness:.95});
function cpMakeVan(kind){const g=new THREE.Group(),army=kind==='army',a=army?0x4b5d2a:0x0e1626,b=army?0x39471f:0xf2f2f2,k=0x1a1a1a;
 const geo=army?[cpB(2.4,1.1,4.8,0,1.15,0,a),cpB(2.3,1,2.4,0,2.15,.6,b),cpB(2.1,.7,.06,0,2.2,-.62,0x223344),cpB(2.5,.35,.3,0,.75,-2.5,k),cpCy(.55,.4,12,0,1.5,2.55,k,Math.PI/2),cpB(.5,.2,.1,-.75,1.35,-2.42,0xfff2c0),cpB(.5,.2,.1,.75,1.35,-2.42,0xfff2c0)]
  :[cpB(2.6,2.4,5,0,1.75,.7,a),cpB(2.5,1.5,1.7,0,1.3,-2.6,a),cpB(2.3,.75,.06,0,1.7,-3.46,0x223344),cpB(2.64,.5,4.6,0,1.7,.7,b),cpB(2.7,.5,.35,0,.7,-3.5,k),cpB(2.2,.9,.1,0,1,-3.52,k),cpB(1.5,.22,.5,0,3.05,-.6,k),cpB(.5,.2,.1,-.8,1.15,-3.47,0xfff2c0),cpB(.5,.2,.1,.8,1.15,-3.47,0xfff2c0)];
 g.add(new THREE.Mesh(cpMG(geo),cpVM));g.children[0].castShadow=true;const red=new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false}),blue=new THREE.MeshBasicMaterial({color:0x2050ff,toneMapped:false});
 if(!army){const r=new THREE.Mesh(cpHG.lamp,red);r.scale.set(2,1.2,1.5);r.position.set(-.45,3.2,-.6);const u=new THREE.Mesh(cpHG.lamp,blue);u.scale.set(2,1.2,1.5);u.position.set(.45,3.2,-.6);g.add(r,u)}
 const wheels=[];for(const [x,z] of[[-1.25,-1.9],[1.25,-1.9],[-1.25,1.9],[1.25,1.9]]){const w=new THREE.Mesh(cpWheelG,cpWheelM);w.position.set(x,.58,z);g.add(w);wheels.push(w)}g.userData={wheels,red,blue,max:army?40:36,kind:kind};return g}
function cpConvert(pc,kind){const o=pc.m,m=cpMakeVan(kind);m.position.copy(o.position);m.rotation.y=o.rotation.y;scene.remove(o);scene.add(m);pc.m=m;pc.hp=kind==='swat'?480:330;pc.cpKind=kind;pc.cpDepN=0}
{const sp=spawnPolice;spawnPolice=function(){const n=police.length;sp();const pc=police[police.length-1];if(!pc||police.length===n)return;if(wanted>=5&&Math.random()<.5)cpConvert(pc,'army');else if(wanted>=4&&Math.random()<.5)cpConvert(pc,'swat')}}
function cpTint(s,army){const g=s.g;s.hp=army?10:9;s.aggro=true;g.userData.rlType='sol';g.userData.rlTint=new THREE.Color(army?0x8fbf6a:0x66708c);const c=g.children[0]&&g.children[0].children[0];if(c&&c.material)c.material.color.set(army?0x4b5d2a:0x15171c)}
function cpSquadTick(){for(const pc of police){if(!pc.cpKind||pc.dead||pc.gone)continue;if(pc.deployed&&!pc.cpDep){pc.cpDep=true;if(pc.cpDepN++>1)continue;const m=pc.m,army=pc.cpKind==='army',n=shooters.length,f=new THREE.Vector3(-Math.sin(m.rotation.y),0,-Math.cos(m.rotation.y));
   const sq=[shooters[n-1],shooters[n-2],makeShooter('cop',m.position.x-f.x*4+f.z*2,m.position.z-f.z*4-f.x*2),makeShooter('cop',m.position.x-f.x*4-f.z*2,m.position.z-f.z*4+f.x*2)];for(const s of sq)if(s&&s.kind==='cop'&&!s.dead)cpTint(s,army);toast(army?'ARMY!':'SWAT TEAM!')}
  if(!pc.deployed)pc.cpDep=false}}
// ----- roadblocks with spike strips -----
let cpRB=null,cpRBcd=10;const cpStrip=new THREE.Mesh(cpMG([cpB(11.5,.07,.7,0,.05,0,0x2a2a2a)].concat(Array.from({length:22},(_,i)=>cpCol(gT(new THREE.ConeGeometry(.09,.3,4),-5.4+i*.51,.24,0),0xd0d0d0)))),cpVM);cpStrip.visible=false;scene.add(cpStrip);
function cpRoadblock(){const m=driving.m,f=new THREE.Vector3(-Math.sin(m.rotation.y),0,-Math.cos(m.rotation.y)),ax=Math.abs(f.x)>Math.abs(f.z),snap=v=>roadCenter(Math.max(0,Math.min(N,Math.round((v+HALF-ROAD/2)/CELL))));
 let x=m.position.x,z=m.position.z;if(ax){z=snap(z);if(Math.abs(z-m.position.z)>5)return;x+=Math.sign(f.x)*92;x=snap(x)-Math.sign(f.x)*CELL/2}else{x=snap(x);if(Math.abs(x-m.position.x)>5)return;z+=Math.sign(f.z)*92;z=snap(z)-Math.sign(f.z)*CELL/2}
 if(Math.abs(x)>HALF-12||Math.abs(z)>HALF-12)return;const dv=ax?Math.abs(x-m.position.x):Math.abs(z-m.position.z);if(dv<30)return;if(cpRB)cpRBclear(true);const list=[];
 for(const o of[-3.4,3.4]){const c=makePoliceCar();c.position.set(ax?x:x+o,0,ax?z+o:z);c.rotation.y=ax?(o>0?0:Math.PI):(o>0?Math.PI/2:-Math.PI/2);scene.add(c);const e={m:c,speed:0,steer:0,hp:150,cpBlock:true};cars.push(e);list.push(e);makeShooter('cop',c.position.x+(ax?-2.5*Math.sign(f.x):0),c.position.z+(ax?0:-2.5*Math.sign(f.z))).aggro=true}
 const sx=ax?x-Math.sign(f.x)*11:x,sz=ax?z:z-Math.sign(f.z)*11;cpStrip.position.set(sx,0,sz);cpStrip.rotation.y=ax?Math.PI/2:0;cpStrip.visible=true;cpRB={list,x:sx,z:sz,ax,t:T};toast('ROADBLOCK AHEAD')}
function cpRBclear(force){const r=cpRB;if(!r)return;if(!force&&(T-r.t<40||Math.hypot(r.x-pos.x,r.z-pos.z)<120))return;for(const e of r.list){if(e===driving)continue;scene.remove(e.m);const i=cars.indexOf(e);if(i>=0)cars.splice(i,1)}cpStrip.visible=false;cpRB=null}
function cpRBTick(dt){cpRBcd-=dt;const c=driving,land=c&&!c.custom&&!c.vhT&&!c.cpBlock;if(land&&wanted>=4&&Math.abs(c.speed)>16&&cpRBcd<=0&&state==='play'){cpRBcd=24;cpRoadblock()}cpRBclear(false);
 if(land&&cpRB&&!c.cpSpiked){const a=cpRB.ax?c.m.position.x-cpRB.x:c.m.position.z-cpRB.z,b=cpRB.ax?c.m.position.z-cpRB.z:c.m.position.x-cpRB.x;if(Math.abs(a)<1.6&&Math.abs(b)<6.2&&!c.vhBike){c.cpSpiked=Math.random()<.5?1:-1;toast('TIRES BLOWN!');sfx(.3,1800,.7);shake=.4}}
 if(land&&c.cpSpiked){c.speed=Math.max(-6,Math.min(13,c.speed));c.m.rotation.y+=c.cpSpiked*.3*dt*Math.min(1,Math.abs(c.speed)/6);if(Math.abs(c.speed)>5&&Math.random()<.4)burst(c.m.position.clone().setY(.2),1,0xffcc55,3,.12,.2)}}
// ----- BUSTED -----
let cpBustT=0,cpBustEnd=0;
function cpBustTick(dt){if(state==='cpbust'){if(T>=cpBustEnd){const fine=Math.round(cash*.1);cash-=fine;WEAP[1].ammo=WEAP[2].ammo=WEAP[3].ammo=0;wi=0;wantedScore=0;wanted=0;evade=0;for(const s of shooters)if(s.kind==='cop'){s.dead=true;s.gone=true;s.g.visible=false}for(const pc of police)pc.gone=true;
   const p=cpPlace('police');if(p){pos.set(p.x,.3,p.z-3);camYaw=Math.PI}vel.set(0,0,0);state='play';toast('Fined $'+fine+'. Weapons confiscated')}return}
 if(state!=='play'||driving||cpIn||wanted<1||wanted>2){cpBustT=0;return}let near=null,nd=1e9;for(const s of shooters)if(s.kind==='cop'&&!s.dead){const d=Math.hypot(s.g.position.x-pos.x,s.g.position.z-pos.z);if(d<nd){nd=d;near=s}if(wanted===1&&T-cpShotAt>3)s.cd=Math.max(s.cd,.6)}
 const still=Math.hypot(vel.x,vel.z)<2;if(near&&still&&nd<14&&nd>2.2){const g=near.g;g.position.x+=(pos.x-g.position.x)/nd*6.5*dt;g.position.z+=(pos.z-g.position.z)/nd*6.5*dt}
 if(near&&still&&nd<3.2){cpBustT+=dt;if(cpBustT>2){cpBustT=0;state='cpbust';cpBustEnd=T+3;cpBanner('BUSTED','#4f8dff','10% fine, weapons confiscated',3);sfx(.5,500,.5)}}else cpBustT=Math.max(0,cpBustT-dt)}
// ----- cash drops -----
const cpCash=[],cpCashG=new THREE.BoxGeometry(.55,.3,.3),cpCashM=new THREE.MeshBasicMaterial({color:0x6dff8a,toneMapped:false});
function cpDrop(p,amt){if(cpCash.length>24)return;const m=new THREE.Mesh(cpCashG,cpCashM);m.position.set(p.x+cpR(-.8,.8),.7,p.z+cpR(-.8,.8));scene.add(m);cpCash.push({m,amt:Math.round(amt),t:40})}
{const kp=killPed;killPed=function(q,from){const w=q.userData.dead;kp(q,from);if(!w&&q.userData.dead&&Math.random()<.7)cpDrop(q.position,cpR(10,60))};const ks=killShooter;killShooter=function(s,from){const w=s.dead;ks(s,from);if(!w&&s.dead)cpDrop(s.g.position,s.kind==='gang'?cpR(40,150):cpR(15,40))}}
function cpCashTick(dt){for(let i=cpCash.length-1;i>=0;i--){const c=cpCash[i];c.t-=dt;c.m.rotation.y+=dt*3;if(Math.hypot(c.m.position.x-pos.x,c.m.position.z-pos.z)<(driving?3:1.7)&&state==='play'){cash+=c.amt;toast('+$'+c.amt);c.t=0}if(c.t<=0){scene.remove(c.m);cpCash.splice(i,1)}}
 for(const q of peds){const u=q.userData;if(u.cpPan>0){u.cpPan-=dt;if(u.cpPan<=0&&!u.dead)u.path.spd=u.cpSpd||1}}}
// ----- street event: mugger -----
let cpMug=null,cpMugCD=55;
function cpMugEnd(win){const M=cpMug;if(!M||M.done)return;M.done=true;M.t=5;if(win){M.g.rotation.x=-Math.PI/2;cash+=250;cpBanner('MUGGER STOPPED','#3ddc84','+$250 reward',2)}else toast('The mugger got away')}
function cpMugTick(dt){if(!cpMug){cpMugCD-=dt;if(cpMugCD<=0&&state==='play'&&!cpIn&&wanted===0&&Math.abs(pos.x)<HALF-30&&Math.abs(pos.z)<HALF-30){cpMugCD=cpR(80,130);const a=Math.random()*6.283,g=makePerson(0x222222,0x111111,0xc68642);g.position.set(pos.x+Math.cos(a)*24,.3,pos.z+Math.sin(a)*24);collide(g.position,.5);
   const bag=new THREE.Mesh(new THREE.BoxGeometry(.5,.45,.3),new THREE.MeshStandardMaterial({color:0x8a5a2b}));bag.position.set(.5,1.1,0);g.add(bag);scene.add(g);cpMug={g,t:24,w:0,done:false};toast('MUGGER! Stop him for a reward')}return}
 const M=cpMug,g=M.g;M.t-=dt;if(M.done){if(M.t<=0){scene.remove(g);cpMug=null}return}
 const dx=g.position.x-pos.x,dz=g.position.z-pos.z,d=Math.hypot(dx,dz)||1;g.position.x+=dx/d*7.6*dt;g.position.z+=dz/d*7.6*dt;if(collide(g.position,.45)){g.position.x+=-dz/d*5*dt;g.position.z+=dx/d*5*dt}g.rotation.y=Math.atan2(-dx,-dz);M.w+=dt*10;animLimbs(g,7,M.w);
 if(d<(driving?3.2:2.1))cpMugEnd(true);else if(M.t<=0||d>95)cpMugEnd(false)}
// ----- stunt ramps -----
const cpRamps=[[roadCenter(3)+3.3,roadCenter(4)+CELL/2,0],[roadCenter(7)-3.3,roadCenter(5)+CELL/2,Math.PI],[roadCenter(5)+CELL/2,roadCenter(2)-3.3,-Math.PI/2],[roadCenter(4)+CELL/2,roadCenter(8)+3.3,Math.PI/2]],cpAirC=[];
{const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(7,0);sh.lineTo(7,1.9);sh.closePath();const gs=[];for(const r of cpRamps){let g=new THREE.ExtrudeGeometry(sh,{depth:5,bevelEnabled:false});g.translate(-3.5,0,-2.5);g.rotateY(Math.PI/2);g.rotateY(r[2]);g.translate(r[0],.02,r[1]);gs.push(cpCol(g,0xffc21a))}
 const m=new THREE.Mesh(cpMG(gs),cpVM);m.castShadow=true;scene.add(m)}
function cpRampTick(dt){const c=driving;if(c&&!c.custom&&!c.vhT&&!c.cpAir&&c.speed>24&&state==='play'){const m=c.m,fx=-Math.sin(m.rotation.y),fz=-Math.cos(m.rotation.y);for(const r of cpRamps){const rx=-Math.sin(r[2]),rz=-Math.cos(r[2]),dx=m.position.x-r[0],dz=m.position.z-r[1],al=dx*rx+dz*rz,ac=Math.abs(dx*rz-dz*rx);
   if(al>-1.5&&al<3.5&&ac<2.7&&fx*rx+fz*rz>.75){c.cpAir={vy:c.speed*.38,x:m.position.x,z:m.position.z};cpAirC.push(c);toast('STUNT JUMP!');sfx(.3,900,.4);break}}}
 for(let i=cpAirC.length-1;i>=0;i--){const c=cpAirC[i],a=c.cpAir,m=c.m;m.position.y+=a.vy*dt;a.vy-=27*dt;m.rotation.x=Math.max(-.35,Math.min(.35,a.vy*.018));if(m.position.y<=0){m.position.y=0;m.rotation.x=0;c.cpAir=null;cpAirC.splice(i,1);if(c===driving){const b=Math.round(Math.hypot(m.position.x-a.x,m.position.z-a.z))*12;cash+=b;shake=.5;cpBanner('STUNT BONUS','#ffc21a','+$'+b,1.8)}}}}
// ----- phone -----
const cpPh=document.createElement('div');cpPh.className='btn';cpPh.textContent='☰';cpPh.style.cssText='left:86px;top:calc(env(safe-area-inset-top,0px) + 44px);width:34px;height:34px;font-size:18px;border-width:2px;background:#0008';document.body.appendChild(cpPh);
function cpPhone(){const L=(c,t)=>'<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#'+c.toString(16).padStart(6,'0')+';margin:0 6px 0 10px"></span>'+t;
 cpOpen('<div style="font-size:22px;color:#ffd23f">PHONE</div>Cash $'+cash+' &nbsp; Kills '+kills+' &nbsp; Wanted '+wanted+'★<br>'+(typeof msPassed!=='undefined'?'Jobs passed '+msPassed+' &nbsp; Best streak '+msBest+'<br>':'')+'Safehouse: '+(cpSave.own?'owned'+(cpSave.car!==null?' (car in garage)':''):'not owned ($5,000)')+
 '<div style="margin-top:8px;color:#ffd23f">MAP</div>'+L(0x3ddc84,'Store')+L(0x5fe3ff,'Jewelry')+L(0xffc93c,'Bank')+'<br>'+L(0x4a9dff,'Safehouse')+L(0x5a7dff,'Police')+L(0xff4d6d,'Hospital')+L(0xff3df2,'Club')+
 '<div style="margin-top:8px;font-weight:500;font-size:13px">Rob a store: walk in through the door and FIRE (left click on a laptop) near the clerk. The clerk empties the till onto the counter; stay until the cash comes to you, or run early with part of it. Some clerks pull a shotgun: shoot back, then grab the till yourself. 3 stars brings a helicopter, 4 SWAT and roadblocks, 5 the army. Stand still near a cop at 1 or 2 stars and you get busted.</div>'+cpBtn('x','CLOSE')+cpBtn('r','RESPAWN','#ff8a80'),k=>{cpClose();if(k==='r'&&state==='play'){if(driving){driving.speed=0;driving=null;player.visible=true}respawn()}})}
cpPh.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(state==='play')cpPhone()},{passive:false});
// ----- main tick -----
MODS.push(function(dt){cpDoorCD-=dt;cpHeliTick(dt);cpSquadTick();cpRBTick(dt);cpBustTick(dt);cpCashTick(dt);cpMugTick(dt);cpRampTick(dt);cpGarTick(dt);
 cpIntTick(dt)});

// ---------- story: phone, properties, crew heists ----------
let stS={own:{},inc:{},done:0,h:null,msgs:[],tx:[],play:0,outfit:0,sent:{},lawT:-999};
try{const j=JSON.parse(localStorage.getItem('blockcity_story')||'null');if(j)for(const k in j)stS[k]=j[k]}catch(e){}
function stStore(){try{const h=stS.h;localStorage.setItem('blockcity_story',JSON.stringify(Object.assign({},stS,{h:h?{i:h.i,loud:h.loud,crew:h.crew,stage:stKeep(h.stage)}:null})))}catch(e){}if(typeof msSave==='function')msSave()}
function stKeep(s){return s==='car'||s==='scout'||s==='gear'?s:(s==='plan'?'plan':'meet')}
function stTry(f,d){try{return f()}catch(e){return d}}
function stM(n){return '$'+Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function stTx(t,a){stS.tx.unshift([t,a]);if(stS.tx.length>20)stS.tx.length=20}
function stPay(a,t){if(cash<a)return false;cash-=a;stTx(t,-a);return true}
// ----- characters -----
const stCrew={rico:{n:'Rico Vance',r:'Driver',s:3,cut:12,c:'#ff8a3d'},dee:{n:'Dee Okafor',r:'Driver',s:1,cut:5,c:'#c9a227'},mara:{n:'Mara Stone',r:'Gunman',s:3,cut:12,c:'#e0455a'},tug:{n:'Tug Bellamy',r:'Gunman',s:1,cut:5,c:'#8d6e63'},pixel:{n:'Ines "Pixel" Roy',r:'Hacker',s:3,cut:12,c:'#3ddcff'},lenny:{n:'Lenny Voss',r:'Hacker',s:1,cut:5,c:'#9b7bff'}};
const stCon={vee:{n:'Vee Calloway',r:'Fixer',c:'#ffd23f'},taxi:{n:'Block Cab',r:'Taxi',c:'#f4c20d'},mech:{n:'Otto Garage',r:'Car delivery',c:'#6dd47e'},law:{n:'Sol Greaves',r:'Lawyer',c:'#b0bec5'},agent:{n:'Dana Pryce',r:'Real estate',c:'#ff7ab8'}};
function stAv(c,n,sz){const p=n.replace(/"[^"]*"/,'').trim().split(/\s+/);return '<span style="display:inline-flex;align-items:center;justify-content:center;width:'+(sz||34)+'px;height:'+(sz||34)+'px;border-radius:50%;background:'+c+';color:#000;font-weight:900;font-size:'+Math.round((sz||34)*.4)+'px;flex:none">'+p[0][0]+(p[1]?p[1][0]:'')+'</span>'}
// ----- properties -----
const stSP=(i,j,o)=>{const a=[roadCenter(i)+CELL/2+o,roadCenter(j)+ROAD/2+1.7];a.ij=[i,j];return a};
const stProps=[{id:'safe',n:'Safehouse Apartment',k:'home',p:5000,d:'Heal, save, lose 2 stars, 1 garage slot'},
 {id:'apt',n:'Midtown Studio',k:'home',p:18000,at:stSP(3,7,9),t:'safe',d:'Save point and health refill'},
 {id:'house',n:'Westside House',k:'home',p:45000,at:stSP(0,4,9),t:'stlux',d:'Family house in the suburbs'},
 {id:'ware',n:'Dockside Warehouse',k:'home',p:35000,at:stSP(9,9,9),t:'stoff',d:'Heist planning room near the beach'},
 {id:'condo',n:'Ocean Condo',k:'home',p:90000,at:stSP(9,5,9),t:'stlux',d:'Beachfront condo'},
 {id:'pent',n:'Skyline Penthouse',k:'home',p:220000,at:stSP(5,3,-9),t:'stlux',d:'Top of downtown'},
 {id:'mans',n:'Hillside Mansion',k:'home',p:500000,at:[roadCenter(5)+CELL/2+9,HALF+18],t:'stlux',d:'Under the BLOCK CITY sign'},
 {id:'wash',n:'Suds Car Wash',k:'biz',p:60000,at:stSP(2,5,9),t:'stoff',inc:400,cap:6000,d:'Earns $400 a minute'},
 {id:'club',n:'Club Neon (50% stake)',k:'biz',p:150000,at:stSP(7,2,9),t:'stoff',inc:1100,cap:15000,d:'Earns $1,100 a minute'},
 {id:'marina',n:'Bayside Boat Rental',k:'biz',p:120000,at:[HALF+22,roadCenter(7)+10],t:'stoff',inc:850,cap:12000,d:'Earns $850 a minute'}];
function stOwn(P){return P.id==='safe'?stTry(()=>cpSave.own,false):!!stS.own[P.id]}
function stCol(g,c){const col=new THREE.Color(c),n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=col.r;a[i*3+1]=col.g;a[i*3+2]=col.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
const stB=(w,h,d,x,y,z,c)=>stCol(bxg(w,h,d,x,y,z),c);
const stHasCp=typeof cpGo==='function'&&typeof cpTypes!=='undefined'&&typeof cpRoom==='function';
if(stHasCp){cpTypes.stlux={l:'HOME',c:0x6dff8a,wall:0xe8e2d6,floor:0x9c7b55};cpTypes.stoff={l:'OFFICE',c:0x6dff8a,wall:0x56606b,floor:0x3d4248};
 for(const t of['stlux','stoff']){const R=cpRoom(t,t==='stlux'?24:25);cpRooms[t]=R;const X=R.x,g=[stB(17.6,.05,13.6,X,.345,0,t==='stlux'?0x9c7b55:0x3d4248)];
  if(t==='stlux'){g.push(stB(5,.9,2,X-5,.75,-4.5,0x394a6d),stB(5,1.6,.5,X-5,1.1,-5.6,0x2c3a57),stB(2.6,.5,1.4,X-5,.55,-2.2,0x6b4a2f),stB(4,.16,2.4,X+4.5,2.6,-6.3,0x0c0c0c),stB(3,.5,1,X+4.5,.55,-6,0x4a3a2c),stB(3.4,.7,4.6,X+5.6,.65,2.5,0xf2f2f2),stB(3.4,.3,1,X+5.6,1.1,.6,0xd7dce2),stB(6,.03,4,X-4,.33,2,0x8a2f3a))}
  else{g.push(stB(5,.12,2.2,X,1.25,-2.5,0x5a4632),stB(.2,1.2,.2,X-2.3,.9,-3.4,0x333333),stB(.2,1.2,.2,X+2.3,.9,-3.4,0x333333),stB(.2,1.2,.2,X-2.3,.9,-1.6,0x333333),stB(.2,1.2,.2,X+2.3,.9,-1.6,0x333333),stB(7,3.4,.14,X,2.6,-6.6,0x1d2b22),stB(1.6,1,.05,X-2,2.9,-6.5,0xfff4c2),stB(1.6,1,.05,X,2.3,-6.5,0xcfe8ff),stB(1.6,1,.05,X+2,3,-6.5,0xffd0d0),stB(1.4,2.4,1.4,X-7,1.5,-5.5,0x596673),stB(1.4,2.4,1.4,X+7,1.5,-5.5,0x596673))}
  scene.add(new THREE.Mesh(U.mergeBufferGeometries(g),new THREE.MeshBasicMaterial({vertexColors:true})))}}
{const g=[],stSaleQ=[];for(const P of stProps){if(!P.at)continue;
  // city properties get a real front door on a street facade (shared slot finder with the shops), the marker sits on the pavement at the door
  if(P.at.ij&&stHasCp&&typeof cpFindSlot==='function'){const sl=stTry(()=>cpFindSlot(P.at.ij[0],P.at.ij[1]),null);const dr=sl?cpAddDoor(sl[0]-.8,sl[1]-.07,0):null;if(sl&&!dr)cpSlots.delete(sl[2]);
   // no door left (instanced door pool full): keep the plain ring + sign post on the pavement and leave that facade to the city
   if(sl&&dr){cpClearFront(sl);const dx=sl[0],dz=sl[1],biz=P.k==='biz';P.at=[dx,dz-1.35];P.dz=dz;P.dr=dr;
   g.push(stB(.45,3.4,.3,dx-1.2,1.7,dz-.15,0xcfc8ba),stB(.45,3.4,.3,dx+1.2,1.7,dz-.15,0xcfc8ba),stB(2.9,.35,.3,dx,3.15,dz-.15,0xcfc8ba),stB(3.2,.12,1.4,dx,3.5,dz-.7,0x2b2f36),stB(2.4,.12,.9,dx,.36,dz-.45,0xb9b3a8),
    stB(.5,.32,.06,dx+.9,2.6,dz-.33,0x1a1a1a),stB(1.5,1.5,.06,dx+2.4,1.9,dz-.04,biz?0x2a6fdb:0xc62828));
   if(typeof cpAtM!=='undefined'){const q=gT(new THREE.PlaneGeometry(1.36,1.36),dx+2.4,1.9,dz-.08,0,Math.PI,0),uv=q.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,(2+uv.getX(k))/4,uv.getY(k)/4);stSaleQ.push(q)}}}
  const x=P.at[0],z=P.at[1],y=typeof ldFloor==='function'?Math.max(0,stTry(()=>ldFloor(x,z),0)):0;P.x=x;P.z=z;P.y=y;P.away=true;
  if(!P.dr)g.push(stB(.14,2.6,.14,x+1.9,y+1.5,z,0xeeeeee),stB(1.7,1,.1,x+1.9,y+2.5,z,P.k==='biz'?0x2a6fdb:0xc62828),stB(1.3,.2,.12,x+1.9,y+2.65,z,0xffffff),stB(1.1,.12,.12,x+1.9,y+2.3,z,0xffffff));
  P.ring=new THREE.Mesh(new THREE.RingGeometry(1,1.35,24),new THREE.MeshBasicMaterial({color:0xffd23f,toneMapped:false,side:THREE.DoubleSide}));P.ring.rotation.x=-Math.PI/2;P.ring.position.set(x,y+.36,z);scene.add(P.ring)}
 const m=new THREE.Mesh(U.mergeBufferGeometries(g),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7}));m.castShadow=true;scene.add(m);if(stSaleQ.length)scene.add(new THREE.Mesh(U.mergeBufferGeometries(stSaleQ),cpAtM))}
let stIconsDone=false;
function stBuy(P){if(stOwn(P))return true;const pr=stPrice(P);if(!stPay(pr,'Bought '+P.n)){toast('Not enough cash for '+P.n);return false}if(stS.disc&&pr<P.p)stS.disc=0;if(P.id==='safe'){stTry(()=>{cpSave.own=true;cpStore()})}else{stS.own[P.id]=1;stS.inc[P.id]=0}stIconUpd(P);stStore();stTry(()=>cpBanner('PROPERTY BOUGHT','#6dff8a',P.n,3));beep(1300,.15,.12);stMsg('agent','Congratulations on '+P.n+'. The keys are yours.');return true}
function stCollect(P){const a=Math.floor(stS.inc[P.id]||0);if(a<1)return 0;stS.inc[P.id]=0;cash+=a;stTx(P.n+' income',a);stStore();return a}
function stCollectAll(){let a=0;for(const P of stProps)if(P.k==='biz'&&stOwn(P))a+=stCollect(P);return a}
function stEnterProp(P){if(!stHasCp)return;const pl={type:P.t,D:cpTypes[P.t],x:P.x,z:P.dr?P.dz:P.z+2.6,room:typeof cpGetRoom==='function'?cpGetRoom(P.t):cpRooms[P.t],cool:0,st:P,door:P.dr||null};P.away=false;
 const fin=()=>{hp=100;if(wanted<=2){wantedScore=0;evade=0}const a=P.k==='biz'?stCollect(P):0;toast(P.n+(a?': collected '+stM(a):': healed and saved'));stStore()};
 if(P.dr&&typeof cpStartIn==='function'){cpStartIn(pl);fin()}else cpFade(()=>{cpGo(pl);fin()})}
const stOutfits=[[0xff5a36,0x23324d],[0x1f2937,0x111827],[0xf5f5f5,0x1e3a8a],[0x2e7d32,0x3e2723],[0x7b1fa2,0x212121],[0xfbc02d,0x263238]];
function stWear(){stS.outfit=(stS.outfit+1)%stOutfits.length;stDress();stStore();toast('Outfit '+(stS.outfit+1)+' of '+stOutfits.length)}
function stDress(){const o=stOutfits[stS.outfit%stOutfits.length];stTry(()=>{const b=player.children[0];b.children[0].material.color.setHex(o[0]);b.children[1].material.color.setHex(o[1]);player.userData.rlShirt=new THREE.Color(o[0]);player.userData.rlPants=new THREE.Color(o[1])})}
if(stS.outfit)stDress();
// ----- generic panel (uses its own element so it never fights the crime panel) -----
const stCss=document.createElement('style');stCss.textContent='.st-p{position:fixed;z-index:80;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff}.st-b{display:inline-block;margin:6px 6px 0 0;padding:9px 14px;border-radius:11px;background:#ffd23f;color:#000;font-weight:800;font-size:13px}.st-b.g{background:#2b3038;color:#fff;border:1px solid #fff3}.st-b.r{background:#ff6b6b}.st-row{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:11px;background:#ffffff10;margin-top:6px;font-size:12.5px;line-height:1.3}.st-h{font-weight:900;font-size:15px;letter-spacing:.5px}.st-s{opacity:.7;font-size:11.5px}body.stcam>*:not(canvas):not(#stCamX){visibility:hidden!important}';document.head.appendChild(stCss);
const stPan=document.createElement('div');stPan.className='st-p';stPan.style.cssText='left:0;top:0;right:0;bottom:0;display:none;align-items:center;justify-content:center;background:#000a';document.body.appendChild(stPan);
let stPanCb=null,stPrev='play';
function stPause(s){if(state==='play')stPrev='play';state=s;joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;fireId=null;burstN=0;jumpQ=carQ=false;vel.x=vel.z=0}
function stResume(s){if(state===s)state='play'}
function stOpenPan(html,cb){stPanCb=cb;stPan.innerHTML='<div style="width:min(440px,92%);max-height:92%;overflow:hidden;background:#12151bf5;border:1px solid #ffffff30;border-radius:18px;padding:14px 16px;box-shadow:0 12px 40px #000a">'+html+'</div>';stPan.style.display='flex';stPause('stpanel')}
function stClosePan(){stPan.style.display='none';stResume('stpanel')}
stPan.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const b=e.target&&e.target.closest?e.target.closest('[data-k]'):null;if(b&&stPanCb)stPanCb(b.getAttribute('data-k'))},{passive:false});
const stBtn=(k,t,c)=>'<span class="st-b '+(c||'')+'" data-k="'+k+'">'+t+'</span>';
// subtitles
const stSub=document.createElement('div');stSub.className='st-p';stSub.style.cssText='left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);transform:translateX(-50%);max-width:74%;padding:7px 14px;border-radius:12px;background:#000b;font-size:13.5px;font-weight:600;text-align:center;pointer-events:none;opacity:0;transition:opacity .25s;z-index:28';document.body.appendChild(stSub);
let stSubT=0;const stSubQ=[];
function stSay(who,t){const c=stCrew[who]||stCon[who]||{n:who,c:'#fff'};stSubQ.push('<b style="color:'+c.c+'">'+c.n.split(' ')[0]+':</b> '+t)}
function stRow(av,t,s,btn){return '<div class="st-row">'+av+'<div style="flex:1;min-width:0"><div style="font-weight:700">'+t+'</div><div class="st-s">'+s+'</div></div>'+(btn||'')+'</div>'}
function stHeist(){return [{n:'The Corner Job',d:'Hit the 24/7 Mart chain safe',take:25000,type:'store'},{n:'Ice Cold',d:'Clean out the jewelry store',take:90000,type:'jewel'},{n:'The Big One',d:'Block City Central Bank vault',take:400000,type:'bank'}]}
function stStageText(){const h=stS.h;if(!h)return '';const H=stHeist()[h.i];return ({plan:'Pick your crew',car:'Steal a getaway car and park it at the marker',scout:'Scout the target: stand by the front door',gear:'Pick up the gear bag',meet:'Meet the crew at the target',enter:'Go in through the front door',ctrl:h.loud?'Fire a shot to control the room':'Blend in while the crew gets set',vault:'Crack the safe',grab:'Hold the room while the bags fill',exit:'Get out the front door',escape:'Lose them and reach the drop-off'})[h.stage]||H.n}
function stWay(x,z){stTry(()=>{mpWay={x:x,z:z};mpDirty=true});stWayMine={x:x,z:z}}
let stWayMine=null,stTaxiT=0;
// ----- phone v2: GTA 6 style smartphone, texting, calls with voices, non-pausing -----
const stSoc={jaz:{n:'Jasmine Ortega',r:'Friend',c:'#ff5fa2'},marc:{n:'Marcus Bell',r:'Gym buddy',c:'#2fa7ff'},nana:{n:'Nana Burke',r:'Neighbour',c:'#f2a541'},kai:{n:'Kai Tanaka',r:'Tech guy',c:'#1fc7a8'},deke:{n:'Deke Marlow',r:'Car dealer',c:'#a8795a'}};
const stGen={vee:'f',taxi:'m',mech:'m',law:'m',agent:'f',rico:'m',dee:'f',mara:'f',tug:'m',pixel:'f',lenny:'m',jaz:'f',marc:'m',nana:'f',kai:'m',deke:'m',op:'f'};
const stVP={vee:[.95,1.02],taxi:[.85,1.1],mech:[.75,.95],law:[.9,.9],agent:[1.15,1.05],rico:[.9,1.12],dee:[1.1,1.1],mara:[.9,1],tug:[.65,.9],pixel:[1.25,1.15],lenny:[1.05,1.2],jaz:[1.3,1.12],marc:[.75,1.06],nana:[1.15,.82],kai:[1.05,1.16],deke:[.7,.96],op:[1,.95]};
const stAll=['vee','agent','law','mech','taxi','jaz','marc','nana','kai','deke','rico','dee','mara','tug','pixel','lenny'];
function stWho(id){return stSoc[id]||stCon[id]||stCrew[id]||(id==='op'?{n:'Operator',r:'',c:'#8e8e93'}:{n:String(id),r:'',c:'#8e8e93'})}
function stNum(id){const i=stAll.indexOf(id);return '555-01'+(i<0?99:10+i)}
function stE(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])}
function stClk(){const h=Math.floor((dayT*24+6)%24),m=Math.floor((dayT*24*60)%60);return (h%12||12)+':'+String(m).padStart(2,'0')}
function stHour(){return Math.floor((dayT*24+6)%24)}
function stTod(){const h=stHour();return h<5?'late night':(h<12?'morning':(h<17?'afternoon':(h<21?'evening':'night')))}
function stDist(){const x=pos.x,z=pos.z;if(x>HALF+20)return 'the beach';if(x<-HALF-15)return 'the airport';if(z<-HALF-15)return 'the army base';if(z>HALF+30)return 'the hills';if(Math.hypot(x,z)<HALF*.4)return 'downtown';if(x>HALF*.6)return 'Ocean Drive';if(x<-HALF*.6)return 'the west side';return 'midtown'}
function stAgo(ts){const d=Math.max(0,stS.play-ts);return d<60?'now':(d<3600?Math.floor(d/60)+'m':Math.floor(d/3600)+'h')}
function stAv(c,n,sz){const p=String(n).replace(/"[^"]*"/,'').trim().split(/\s+/);const s=sz?'width:'+sz+'px;height:'+sz+'px;font-size:'+Math.round(sz*.4)+'px;':'';return '<span class="stp-av" style="'+s+'background:linear-gradient(150deg,'+c+','+c+'99)">'+p[0][0]+(p[1]?p[1][0]:'')+'</span>'}
function stAvI(id,em){const w=stWho(id),e=em||3;return '<span class="stp-av" style="width:'+e+'em;height:'+e+'em;font-size:1em;background:linear-gradient(150deg,'+w.c+','+w.c+'88)"><span style="font-size:'+(e*.36).toFixed(2)+'em">'+stIni(w.n)+'</span></span>'}
function stIni(n){const p=String(n).replace(/"[^"]*"/,'').trim().split(/\s+/);return p[0][0]+(p[1]?p[1][0]:'')}
// ----- chat state -----
let stC={t:{},u:{},mood:{},act:{},last:{},calls:[],feed:[],ll:{},nextPro:150,nextCall:330,nextFeed:40,flags:{}};
try{const j=JSON.parse(localStorage.getItem('blockcity_chat')||'null');if(j)for(const k in j)stC[k]=j[k]}catch(e){}
function stChatSave(){try{localStorage.setItem('blockcity_chat',JSON.stringify(stC))}catch(e){}}
let stBadge=0,stView=null,stTyping={},stPend=[],stPhotos=[];
function stAdd(id,d,txt,quiet){const L=(stC.t[id]=stC.t[id]||[]);L.push([d,txt,Math.round(stS.play)]);if(L.length>50)L.splice(0,L.length-50);stC.last[id]=stS.play;if(d!==1&&!quiet&&stView!==id)stC.u[id]=(stC.u[id]||0)+1;stChatSave();stBadgeDraw()}
function stUnread(){let n=0;for(const k in stC.u)n+=stC.u[k]||0;return n}
if(stS.msgs&&stS.msgs.length&&!stC.mig){for(const m of stS.msgs.slice().reverse())stAdd(m[0],0,m[1],true);stC.mig=1;stChatSave()}
function stMsg(from,t,act){stAdd(from,0,t);if(act)stC.act[from]=act;stNotify(from,t);stTry(()=>{beep(1500,.07,.1);setTimeout(()=>beep(1900,.09,.1),110)});if(stView===from)stRender()}
function stOnce(k,from,t){if(stS.sent[k])return;stS.sent[k]=1;stMsg(from,t)}
// ----- css -----
const stPCss=document.createElement('style');stPCss.textContent=
'.stp{position:fixed;z-index:82;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#fff;transform:translateY(125%) scale(.97);opacity:0;transition:transform .42s cubic-bezier(.2,.9,.22,1),opacity .28s;pointer-events:none;-webkit-user-select:none;user-select:none;line-height:1.25}'+
'.stp.on{transform:none;opacity:1;pointer-events:auto}'+
'.stp-f{position:absolute;inset:0;border-radius:3.3em;background:linear-gradient(145deg,#4a4d55,#17191d 38%,#2e3138 70%,#121316);padding:.5em;box-shadow:0 1.8em 3.6em #000d,inset 0 0 0 .1em #6c707a,inset 0 0 0 .28em #08090b}'+
'.stp-f:before{content:"";position:absolute;right:-.22em;top:24%;width:.22em;height:12%;border-radius:0 .2em .2em 0;background:#3a3d44}'+
'.stp-f:after{content:"";position:absolute;left:-.22em;top:20%;width:.22em;height:7%;border-radius:.2em 0 0 .2em;background:#3a3d44;box-shadow:0 3.2em 0 #3a3d44}'+
'.stp-s{position:relative;width:100%;height:100%;border-radius:2.85em;overflow:hidden;background:#000}'+
'.stp-w{position:absolute;inset:0;background:radial-gradient(130% 75% at 30% 8%,#ffb36b 0%,#ff6f7d 28%,#c13f8f 50%,#4b2786 72%,#120a2c 100%)}'+
'.stp-sb{position:absolute;left:0;right:0;top:0;height:3em;display:flex;align-items:center;justify-content:space-between;padding:0 1.5em 0 1.75em;font-size:1em;font-weight:600;z-index:11;pointer-events:none;letter-spacing:.01em;text-shadow:0 1px 2px #0006}'+
'.stp-di{position:absolute;left:50%;top:.62em;width:7.2em;height:2.05em;margin-left:-3.6em;border-radius:1.1em;background:#000;z-index:10;transition:width .35s cubic-bezier(.2,.9,.3,1),margin .35s cubic-bezier(.2,.9,.3,1);display:flex;align-items:center;justify-content:space-between;padding:0 .55em;box-sizing:border-box;overflow:hidden}'+
'.stp-di.wide{width:10.4em;margin-left:-5.2em}'+
'.stp-L{position:absolute;inset:0;transition:transform .45s cubic-bezier(.2,.9,.22,1),opacity .3s}'+
'.stp-home{padding:3.6em .75em 0;z-index:1}'+
'.stp-lock{z-index:6;display:flex;flex-direction:column;align-items:center;padding-top:4.4em;background:linear-gradient(#0000,#0003 60%,#0008)}'+
'.stp-lock.off{transform:translateY(-104%)}'+
'.stp-app{z-index:4;background:#000;opacity:0;transform:scale(.18);pointer-events:none;display:flex;flex-direction:column;border-radius:2.85em;overflow:hidden}'+
'.stp-app.on{opacity:1;transform:none;pointer-events:auto}'+
'.stp-g{display:grid;grid-template-columns:repeat(4,1fr);gap:1.05em 0;margin-top:.9em}'+
'.stp-i{text-align:center;position:relative}'+
'.stp-i span.l{display:block;font-size:.72em;overflow:hidden;text-overflow:ellipsis;font-weight:500;text-shadow:0 1px 3px #000a;margin-top:.4em;white-space:nowrap}'+
'.stp-ic{width:3.7em;height:3.7em;margin:0 auto;border-radius:.95em;display:flex;align-items:center;justify-content:center;box-shadow:0 .3em .7em #0006,inset 0 .1em 0 #ffffff45,inset 0 -.12em .2em #0003}'+
'.stp-ic svg{width:56%;height:56%;fill:#fff;filter:drop-shadow(0 .06em .08em #0004)}'+
'.stp-bd{position:absolute;right:.35em;top:-.45em;min-width:1.55em;height:1.55em;border-radius:.8em;background:#ff3b30;font-size:.78em;font-weight:700;line-height:1.55em;padding:0 .35em;box-sizing:border-box;box-shadow:0 0 0 .12em #0002}'+
'.stp-dock{position:absolute;left:.75em;right:.75em;bottom:1.9em;height:6em;border-radius:2.1em;background:#ffffff30;display:grid;grid-template-columns:repeat(4,1fr);align-items:center;box-shadow:inset 0 0 0 .06em #ffffff38}'+
'.stp-wd{margin-top:.2em;border-radius:1.5em;background:#00000040;padding:.85em 1em;display:flex;justify-content:space-between;align-items:center;box-shadow:inset 0 0 0 .06em #ffffff2a}'+
'.stp-bar{position:absolute;left:0;right:0;bottom:0;height:1.9em;z-index:12;display:flex;align-items:center;justify-content:center}'+
'.stp-bar i{width:9.5em;height:.36em;border-radius:.3em;background:#fffe;display:block;box-shadow:0 0 .3em #0006}'+
'[data-k]{transition:transform .12s,filter .12s}.stp-pr{transform:scale(.92)!important;filter:brightness(.78)}'+
'.stp-hd{flex:none;padding:3.2em 1.1em .45em;display:flex;align-items:center;gap:.5em;min-height:2.2em}'+
'.stp-hd b{font-size:1.65em;font-weight:800;letter-spacing:-.01em}'+
'.stp-bk{color:#0a84ff;font-size:1.05em;font-weight:500;padding:.2em .3em .2em 0;white-space:nowrap}'+
'.stp-sc{flex:1;overflow:hidden;padding:0 .9em 2.4em;position:relative}'+
'.stp-row{display:flex;align-items:center;gap:.72em;padding:.6em .1em;border-bottom:.06em solid #ffffff17}'+
'.stp-av{width:3em;height:3em;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:1.05em;text-shadow:0 1px 2px #0005;letter-spacing:.02em}'+
'.stp-t{flex:1;min-width:0}.stp-t b{display:block;font-size:1em;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.stp-sub{font-size:.84em;color:#ffffff8a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.stp-dot{width:.62em;height:.62em;border-radius:50%;background:#0a84ff;flex:none}'+
'.stp-btn{display:inline-flex;align-items:center;justify-content:center;padding:.48em .95em;border-radius:1.3em;background:#0a84ff;font-weight:600;font-size:.9em;white-space:nowrap}'+
'.stp-btn.g{background:#ffffff1f}.stp-btn.r{background:#ff3b30}.stp-btn.y{background:#30d158;color:#04140a}.stp-btn.o{background:#ff9f0a;color:#1a1000}'+
'.stp-ib{width:2.3em;height:2.3em;border-radius:50%;background:#ffffff1c;display:inline-flex;align-items:center;justify-content:center;flex:none}.stp-ib svg{width:55%;height:55%;fill:#30d158}'+
'.stp-chat{display:flex;flex-direction:column;padding:.4em .7em .6em}'+
'.stp-m{max-width:78%;padding:.5em .8em;border-radius:1.25em;margin:.14em 0;line-height:1.32;word-wrap:break-word;font-size:1em}'+
'.stp-m.i{background:#2c2c2e;align-self:flex-start;border-bottom-left-radius:.35em}'+
'.stp-m.o{background:linear-gradient(#2f95ff,#0a7cff);align-self:flex-end;border-bottom-right-radius:.35em}'+
'.stp-ts{align-self:center;font-size:.72em;color:#ffffff66;margin:.6em 0 .2em}'+
'.stp-vm{display:flex;align-items:center;gap:.55em;min-width:11em}.stp-vm i{display:inline-block;width:.18em;border-radius:.1em;background:#ffffffaa;margin-right:.14em}'+
'.stp-typ{align-self:flex-start;background:#2c2c2e;border-radius:1.25em;padding:.62em .8em;margin:.14em 0}.stp-typ i{display:inline-block;width:.45em;height:.45em;border-radius:50%;background:#ffffff99;margin:0 .1em;animation:stpB 1s infinite}.stp-typ i:nth-child(2){animation-delay:.15s}.stp-typ i:nth-child(3){animation-delay:.3s}'+
'@keyframes stpB{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-.3em);opacity:1}}'+
'.stp-chips{display:flex;gap:.4em;padding:.35em .7em;overflow:hidden;flex:none}'+
'.stp-chip{flex:none;padding:.42em .8em;border-radius:1.3em;border:.08em solid #0a84ff;color:#58a8ff;font-size:.86em;white-space:nowrap;background:#0a84ff14}'+
'.stp-inp{flex:none;display:flex;gap:.45em;align-items:center;padding:.3em .7em 2.3em}'+
'.stp-inp input{flex:1;min-width:0;height:2.45em;border-radius:1.3em;border:.08em solid #ffffff30;background:#1c1c1e;color:#fff;padding:0 .9em;font-size:16px;outline:none;-webkit-user-select:text;user-select:text;font-family:inherit}'+
'.stp-send{width:2.3em;height:2.3em;border-radius:50%;background:#0a84ff;display:flex;align-items:center;justify-content:center;flex:none}.stp-send svg{width:55%;height:55%;fill:#fff}'+
'.stp-nb{position:absolute;left:.55em;right:.55em;top:.45em;z-index:11;border-radius:1.5em;background:#1f1f22f2;padding:.65em .75em;display:flex;gap:.6em;align-items:center;transform:translateY(-130%);transition:transform .4s cubic-bezier(.2,.9,.22,1);box-shadow:0 .5em 1.4em #000b}'+
'.stp-nb.on{transform:translateY(2.8em)}'+
'.stp-card{border-radius:1.2em;background:#1c1c1e;padding:.85em;margin-top:.6em}'+
'.stp-ph{height:6.2em;border-radius:.9em;position:relative;overflow:hidden;margin:-.1em -.1em .6em}'+
'.stp-tab{display:flex;gap:.3em;background:#ffffff14;border-radius:.8em;padding:.2em;margin:0 0 .5em}.stp-tab span{flex:1;text-align:center;padding:.35em 0;border-radius:.65em;font-size:.85em;font-weight:600;color:#ffffffaa}.stp-tab span.on{background:#ffffff26;color:#fff}'+
'.stp-key{display:grid;grid-template-columns:repeat(3,1fr);gap:.7em .9em;padding:0 .8em}.stp-key span{height:3.6em;border-radius:50%;background:#ffffff22;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:1.5em;font-weight:400;width:3.6em;justify-self:center}'+
'.stp-cbg{position:absolute;inset:0;z-index:0}'+
'.stp-cb{width:3.9em;height:3.9em;border-radius:50%;display:flex;align-items:center;justify-content:center}.stp-cb svg{width:46%;height:46%;fill:#fff}'+
'#stNB{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);width:min(330px,78vw);transform:translate(-50%,-160%);transition:transform .45s cubic-bezier(.2,.9,.22,1);z-index:86;border-radius:20px;background:#1f1f22f0;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;display:flex;gap:10px;align-items:center;padding:10px 12px;box-shadow:0 10px 30px #000a;box-sizing:border-box}'+
'#stNB.on{transform:translate(-50%,0)}#stNB .stp-av{width:36px;height:36px;font-size:14px}'+
'.stp-post{padding:.7em 0;border-bottom:.06em solid #ffffff17;display:flex;gap:.6em}'+
'.stp-flash{position:fixed;inset:0;background:#fff;z-index:200;pointer-events:none;opacity:0;transition:opacity .35s}';
document.head.appendChild(stPCss);
// ----- svg bits -----
const stSvg=(p,ex)=>'<svg viewBox="0 0 24 24"'+(ex||'')+'>'+p+'</svg>';
const stGl={phone:'<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/>',
 msgs:'<path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.4 6.1L4.5 21l4.3-2.3c1 .2 2.1.3 3.2.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/>',
 contacts:'<circle cx="12" cy="8.5" r="4"/><path d="M4 20.5c0-4.4 3.6-7 8-7s8 2.6 8 7z"/>',
 map:'<path d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
 bank:'<path d="M12 2 2 7.5V10h20V7.5zM4.5 11h3v7h-3zm6 0h3v7h-3zm6 0h3v7h-3zM2 19.5h20V22H2z"/>',
 estate:'<path d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z"/>',
 jobs:'<path d="M9 3h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3V5a2 2 0 0 1 2-2zm0 3h6V5H9zM2 12h20v1.5H2z"/>',
 chirp:'<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 4.6 16.7L21 21l-1.2-4.4A9 9 0 0 0 12 3zm0 4.2a4.8 4.8 0 0 1 3.4 1.4l-1.3 1.3a3 3 0 1 0 0 4.2l1.3 1.3A4.8 4.8 0 1 1 12 7.2z"/>',
 music:'<path d="M9 18a3 3 0 1 1-2-2.8V5.5L20 3v12a3 3 0 1 1-2-2.8V7.3L9 9.3z"/>',
 cam:'<path fill-rule="evenodd" d="M8.5 4 6.9 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2.9l-1.6-2zM12 8.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
 stats:'<path d="M4 20v-9h3.5v9zm6.3 0V4h3.4v16zm6.2 0v-6.5H20V20z"/>',
 set:'<path fill-rule="evenodd" d="M10.3 2h3.4l.5 2.6c.6.2 1.2.5 1.7.9l2.5-.9 1.7 2.9-2 1.7a7 7 0 0 1 0 1.8l2 1.7-1.7 2.9-2.5-.9c-.5.4-1.1.7-1.7.9l-.5 2.6h-3.4l-.5-2.6a7 7 0 0 1-1.7-.9l-2.5.9-1.7-2.9 2-1.7a7 7 0 0 1 0-1.8l-2-1.7 1.7-2.9 2.5.9c.5-.4 1.1-.7 1.7-.9zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
 send:'<path d="M3 20.5 21 12 3 3.5v6.6L15 12 3 13.9z"/>',
 play:'<path d="M7 4.5v15L20 12z"/>',
 end:'<path d="M12 9c-3.2 0-6.2.8-8.9 2.2-.5.3-.8.8-.7 1.4l.4 2.3c.1.7.8 1.2 1.5 1l3-.8c.6-.2 1-.7 1-1.3v-1.5c1.2-.4 2.4-.5 3.7-.5s2.5.1 3.7.5v1.5c0 .6.4 1.1 1 1.3l3 .8c.7.2 1.4-.3 1.5-1l.4-2.3c.1-.6-.2-1.1-.7-1.4A19 19 0 0 0 12 9z"/>',
 heart:'<path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 18.8 5 21 8.3 19.5 11.8 17.5 16.4 12 21 12 21z"/>',
 pin:'<path d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7z"/>',
 flash:'<path d="M9 2h6l-1 6h4l-8 14 1-9H7z"/>'};
const stAppDef={phone:['Phone','#62e57c','#1fb94a'],msgs:['Messages','#69c9ff','#0a7cff'],contacts:['Contacts','#c9ccd3','#7d8189'],map:['Maps','#ffe066','#ff8c1a'],bank:['Block Bank','#3fe08f','#05804e'],estate:['Property','#ff7b95','#d9133f'],jobs:['Jobs','#c78bff','#7419c9'],chirp:['Chirp','#58d5ff','#0a6fb8'],music:['Music','#ff7187','#e6143c'],cam:['Camera','#a5abb6','#3d4250'],stats:['Stats','#7ae9ff','#0b7c96'],set:['Settings','#a1a1a8','#46464c']};
const stGrid=['contacts','map','bank','estate','jobs','stats','cam','set'],stDock=['phone','msgs','chirp','music'];
const stWall='<svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMax slice" style="position:absolute;inset:0;width:100%;height:100%"><circle cx="64" cy="126" r="21" fill="#ffd598" opacity=".9"/><circle cx="64" cy="126" r="34" fill="#ffd598" opacity=".12"/><path d="M0 158 Q30 150 55 156 T100 154 V200 H0z" fill="#2a1446"/><path d="M0 170 Q40 162 100 172 V200 H0z" fill="#170b2c"/><path d="M20 200 C22 176 25 156 31 140" stroke="#0f0720" stroke-width="2" fill="none"/><path d="M31 140c-8-6-18-6-24 .5 8-2.5 16-.5 24-.5zm0 0c-2-9-10-15-18-15 7 3 13 8 18 15zm0 0c6-8 15-10 22-6-8 0-15 2-22 6zm0 0c8-2 16 2 20 9-6-4-13-6-20-9zm0 0c-5 3-9 9-10 16 3-6 6-11 10-16z" fill="#0f0720"/><path d="M84 200c1-16 3-29 7-40" stroke="#0f0720" stroke-width="1.5" fill="none"/><path d="M91 160c-6-4-13-4-17 .5 6-2 11-.5 17-.5zm0 0c-1-6-7-10-13-10 5 2 9 5 13 10zm0 0c4-6 11-7 15-4-5 0-10 1-15 4zm0 0c5-1 11 1 14 6-4-3-9-4-14-6z" fill="#0f0720"/></svg>';
const stStat='<svg viewBox="0 0 18 12" style="width:1.35em;height:.9em;fill:#fff"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity=".4"/></svg><svg viewBox="0 0 16 12" style="width:1.2em;height:.9em;fill:#fff"><path d="M8 2.2c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8 .5 10.6 10.6 0 0 0 .5 3.5l1.2 1.2A9 9 0 0 1 8 2.2zm0 3.4c1.5 0 2.9.6 4 1.6l1.2-1.2A7.4 7.4 0 0 0 8 3.9 7.4 7.4 0 0 0 2.8 6L4 7.2c1.1-1 2.5-1.6 4-1.6zM8 9a2 2 0 0 0-1.4.6L8 11l1.4-1.4A2 2 0 0 0 8 9z"/></svg>';
function stBat(){const b=Math.max(9,100-Math.floor((stS.play/45)%91));return '<span style="display:inline-flex;align-items:center;gap:.15em"><span style="width:1.9em;height:.95em;border-radius:.3em;border:.09em solid #ffffffaa;padding:.09em;box-sizing:border-box;display:inline-block"><span style="display:block;height:100%;width:'+b+'%;border-radius:.15em;background:'+(b<20?'#ff3b30':'#fff')+'"></span></span><span style="width:.12em;height:.35em;background:#ffffffaa;border-radius:0 .1em .1em 0"></span></span>'}
// ----- dom -----
const stPh=document.createElement('div');stPh.className='stp';stPh.id='stPhone';
stPh.innerHTML='<div class="stp-f"><div class="stp-s" id="stpS"><div class="stp-w">'+stWall+'</div><div class="stp-sb"><span id="stpT">9:41</span><span id="stpSI" style="display:flex;gap:.35em;align-items:center">'+stStat+stBat()+'</span></div><div class="stp-di" id="stpDI"></div><div class="stp-L stp-home" id="stpH"></div><div class="stp-L stp-app" id="stpA"></div><div class="stp-L stp-lock" id="stpLk"></div><div class="stp-nb" id="stpNB"></div><div class="stp-bar" data-k="bar"><i></i></div></div></div>';
document.body.appendChild(stPh);
const stEl=id=>document.getElementById(id);
const stNB=document.createElement('div');stNB.id='stNB';document.body.appendChild(stNB);
const stFl=document.createElement('div');stFl.className='stp-flash';document.body.appendChild(stFl);
let stApp='home',stPhOpen=false,stCam=false,stLocked=true,stPhTab='rec',stDialS='',stNbId=null,stNbT=0,stPhNbT=0,stCallO=null,stCallCollect=null,stMusicOk=typeof auST!=='undefined'&&typeof auR!=='undefined';
function stLayout(){const W=innerWidth,H=innerHeight;let h,b,r;
 const rect=id=>{const e=$(id);if(!e||e.offsetParent===null)return null;const q=e.getBoundingClientRect();return q.width?q:null};
 const rs=['fire','car','jump','wpn'].map(rect).filter(Boolean);
 if(H>=W){const top0=rs.length?Math.min.apply(null,rs.map(q=>q.top)):H*.68;h=Math.min(500,top0-160);if(h>=340){b=H-top0+12;r=10}else{h=Math.min(500,H*.62);b=10;r=10}}
 else{h=Math.min(460,H-18);const l0=rs.length?Math.min.apply(null,rs.map(q=>q.left)):W*.72;r=Math.max(10,W-l0+10);b=(H-h)/2;if(W-r-h*.49<W*.36){r=10}}
 const w=Math.round(h*.49);stPh.style.width=w+'px';stPh.style.height=Math.round(h)+'px';stPh.style.right=Math.round(r)+'px';stPh.style.bottom='calc(env(safe-area-inset-bottom,0px) + '+Math.round(b)+'px)';stPh.style.fontSize=(w/245*13).toFixed(2)+'px'}
function stIcon(a,big){const D=stAppDef[a],bd=(a==='msgs'&&stUnread())?'<span class="stp-bd">'+stUnread()+'</span>':((a==='phone'&&stC.miss)?'<span class="stp-bd">'+stC.miss+'</span>':((a==='jobs'&&typeof msOffers!=='undefined'&&msOffers.length&&msType<0)?'<span class="stp-bd" style="background:#ff9f0a">'+msOffers.length+'</span>':''));
 return '<div class="stp-i" data-k="app:'+a+'"><div class="stp-ic" style="background:linear-gradient(165deg,'+D[1]+','+D[2]+')">'+stSvg(stGl[a])+'</div>'+bd+(big?'':'<span class="l">'+D[0]+'</span>')+'</div>'}
function stHomeDraw(){let h='<div class="stp-wd" data-k="app:bank"><div><div style="font-size:.75em;opacity:.75;letter-spacing:.06em">BLOCK BANK</div><div style="font-size:1.45em;font-weight:700">'+stM(cash)+'</div></div><div style="text-align:right"><div style="font-size:.75em;opacity:.75">'+stTod().toUpperCase()+'</div><div style="font-size:.95em;font-weight:600">'+(wanted>0?'&#9733;'.repeat(wanted):stDist())+'</div></div></div><div class="stp-g">';
 for(const a of stGrid)h+=stIcon(a);h+='</div><div class="stp-dock">';for(const a of stDock)h+=stIcon(a,true);h+='</div>';stEl('stpH').innerHTML=h}
function stLockDraw(){const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],d=Math.floor(stS.play/1200)+2;let n='';
 const ids=Object.keys(stC.u).filter(k=>stC.u[k]>0).slice(0,2);for(const id of ids){const L=stC.t[id]||[],m=L[L.length-1];if(m)n+='<div style="width:86%;margin-top:.5em;border-radius:1.3em;background:#ffffff2a;padding:.6em .7em;display:flex;gap:.55em;align-items:center">'+stAvI(id,2.3)+'<div class="stp-t"><b style="font-size:.9em">'+stE(stWho(id).n)+'</b><div class="stp-sub" style="color:#fffc">'+stE(m[1])+'</div></div></div>'}
 stEl('stpLk').innerHTML='<div style="font-size:.95em;font-weight:600;opacity:.9;margin-top:.6em">'+days[d%7]+', Block City</div><div style="font-size:5.2em;font-weight:200;letter-spacing:-.03em;line-height:1.05;text-shadow:0 .05em .2em #0004">'+stClk()+'</div>'+n+'<div style="position:absolute;bottom:3em;left:0;right:0;text-align:center;font-size:.85em;opacity:.8">Swipe up to open</div><div style="position:absolute;bottom:2.6em;left:1.7em;width:3.1em;height:3.1em;border-radius:50%;background:#0006;display:flex;align-items:center;justify-content:center">'+stSvg(stGl.flash,' style="width:45%;height:45%;fill:#fff"')+'</div><div style="position:absolute;bottom:2.6em;right:1.7em;width:3.1em;height:3.1em;border-radius:50%;background:#0006;display:flex;align-items:center;justify-content:center">'+stSvg(stGl.cam,' style="width:45%;height:45%;fill:#fff"')+'</div>'}
function stUnlock(){if(!stLocked)return;stLocked=false;stEl('stpLk').classList.add('off')}
function stOpenPhone(a){if(stPhOpen){if(a)stGo(a);return}if(state!=='play')return;stPhOpen=true;stLayout();stHomeDraw();stLockDraw();stLocked=true;const L=stEl('stpLk');L.style.transition='none';L.classList.remove('off');void L.offsetWidth;L.style.transition='';
 stEl('stpA').classList.remove('on');stApp='home';stView=null;stPh.classList.add('on');stTick1();fireId=null;burstN=0;
 if(a){stUnlock();stGo(a)}else setTimeout(()=>{if(stPhOpen)stUnlock()},stUnread()?1400:650);stBadgeDraw()}
function stClosePhone(){if(!stPhOpen)return;stPhOpen=false;stView=null;stPh.classList.remove('on');stTry(()=>{const i=stPh.querySelector('input');if(i)i.blur()})}
function stGo(a,fromEl){stUnlock();if(a==='set'){stClosePhone();stTry(()=>uiOpenSet());return}if(a==='cam'&&false)return;stApp=a;stView=a.indexOf('chat:')===0?a.slice(5):null;if(stView){stC.u[stView]=0;stChatSave();stBadgeDraw()}if(a==='phone')stC.miss=0;
 const A=stEl('stpA'),S=stEl('stpS');if(fromEl&&!A.classList.contains('on')){const r=fromEl.getBoundingClientRect(),q=S.getBoundingClientRect();A.style.transformOrigin=((r.left+r.width/2-q.left)/q.width*100).toFixed(1)+'% '+((r.top+r.height/2-q.top)/q.height*100).toFixed(1)+'%'}else if(!A.classList.contains('on'))A.style.transformOrigin='50% 60%';
 stRender();A.classList.add('on')}
function stHome(){stApp='home';stView=null;stEl('stpA').classList.remove('on');stHomeDraw()}
function stBadgeDraw(){stBadge=stUnread()+(stC.miss||0);if(!stPhBtn)return;if(stDot.parentNode!==stPhBtn){stPhBtn.style.overflow='visible';stPhBtn.appendChild(stDot)}stDot.style.display=stBadge?'block':'none';stDot.textContent=stBadge}
// ----- notifications -----
function stNotify(id,txt){const w=stWho(id);if(stPhOpen&&!stLocked){if(stView===id)return;const N=stEl('stpNB');N.setAttribute('data-k','chat:'+id);N.innerHTML=stAvI(id,2.4)+'<div class="stp-t"><b style="font-size:.88em">'+stE(w.n)+' <span style="font-weight:400;opacity:.6;font-size:.85em">now</span></b><div class="stp-sub" style="color:#fffd">'+stE(txt)+'</div></div>';N.classList.add('on');stPhNbT=3.2;stHomeDraw();return}
 stNbId=id;stNB.innerHTML=stAv(w.c,w.n,36)+'<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:13px;display:flex;justify-content:space-between"><span>'+stE(w.n)+'</span><span style="opacity:.55;font-weight:500;font-size:11px">MESSAGES</span></div><div style="font-size:12.5px;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+stE(txt)+'</div></div>';stNB.classList.add('on');stNbT=4}
stNB.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();stNB.classList.remove('on');stNbT=0;if(stNbId&&state==='play'){stOpenPhone('chat:'+stNbId)}},{passive:false});
for(const ty of['touchmove','touchend'])stNB.addEventListener(ty,e=>e.stopPropagation());
// ----- voices -----
const stTTS=('speechSynthesis' in window)?window.speechSynthesis:null;let stVoices=[];
function stLoadV(){try{stVoices=stTTS.getVoices().filter(v=>/^en/i.test(v.lang))}catch(e){}}
if(stTTS){stLoadV();try{stTTS.addEventListener('voiceschanged',stLoadV)}catch(e){try{stTTS.onvoiceschanged=stLoadV}catch(x){}}}
const stFem=/samantha|karen|moira|tessa|victoria|fiona|allison|ava|susan|zira|serena|kate|nicky|female|joanna|salli|kimberly|ivy|emma|amy|libby|sonia|aria|jenny|michelle|hazel|catherine|martha|kathy|vicki|princess|grandma|flo|shelley|sandy/i,stMal=/daniel|alex|fred|aaron|arthur|gordon|rishi|tom|david|mark|male|guy|ryan|oliver|george|matthew|joey|justin|brian|eric|james|lee|reed|ralph|albert|bruce|junior|grandpa|rocko|eddy|aidan/i;
function stVoice(id){if(!stVoices.length)stLoadV();const g=stGen[id]||'m',L=stVoices.filter(v=>(g==='f'?stFem:stMal).test(v.name)),P=L.length?L:stVoices;if(!P.length)return null;let h=0;for(const ch of id)h=(h*31+ch.charCodeAt(0))>>>0;return P[h%P.length]}
function stSubsOn(){return stTry(()=>!(uiS&&uiS.subs===0),true)}
function stVol(){return stTry(()=>Math.max(0,Math.min(1,uiS.vol!==undefined?uiS.vol:1)),1)}
function stBabble(id,txt,done){const n=Math.min(40,Math.max(4,Math.round(txt.length/4))),base=(stGen[id]==='f'?220:120)*(stVP[id]?stVP[id][0]:1);let k=0;
 const step=()=>{if(k>=n){done();return}k++;stTry(()=>{if(!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(base*(.85+Math.random()*.4),t);o.frequency.linearRampToValueAtTime(base*(.8+Math.random()*.4),t+.09);f.type='bandpass';f.frequency.value=900+Math.random()*700;f.Q.value=2;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05*stVol(),t+.02);g.gain.linearRampToValueAtTime(0,t+.11);o.connect(f);f.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.13)});setTimeout(step,95+Math.random()*60)};step()}
function stSpeak(id,txt,done){let fin=false;const end=()=>{if(fin)return;fin=true;clearTimeout(tm);if(done)done()};const tm=setTimeout(end,txt.length*80+1600);
 if(stSubsOn()){const w=stWho(id);stSubQ.length=0;stSub.innerHTML='<b style="color:'+w.c+'">'+stE(w.n.split(' ')[0])+':</b> '+stE(txt);stSub.style.opacity=1;stSubT=Math.max(2.5,txt.length*.07)}
 if(stTTS&&stVol()>0){try{const u=new SpeechSynthesisUtterance(txt);const v=stVoice(id);if(v){u.voice=v;u.lang=v.lang}else u.lang='en-US';const p=stVP[id]||[1,1];u.pitch=p[0];u.rate=p[1];u.volume=stVol();u.onend=end;u.onerror=end;stTTS.speak(u);return}catch(e){}}
 stBabble(id,txt,end)}
function stHush(){stTry(()=>{if(stTTS)stTTS.cancel()})}
// ----- calls -----
let stRingI=null;
function stRingOn(on){if(stRingI){clearInterval(stRingI);stRingI=null}if(!on)return;const r=()=>{stTry(()=>{beep(988,.14,.07);setTimeout(()=>beep(784,.14,.07),170);setTimeout(()=>beep(988,.14,.07),340)});stTry(()=>{if(navigator.vibrate&&!(uiS&&uiS.vib===0))navigator.vibrate([180,120,180])})};r();stRingI=setInterval(r,1700)}
function stLogCall(id,k){stC.calls.unshift([id,k,Math.round(stS.play)]);if(stC.calls.length>25)stC.calls.length=25;if(k==='miss')stC.miss=(stC.miss||0)+1;stChatSave();stBadgeDraw()}
function stIncoming(id,lines,after){if(stCallO||state!=='play'){stAdd(id,2,lines.join(' '));stNotify(id,'Voicemail');return}stCallO={id:id,dir:'in',st:'ring',t:0,lines:lines.slice(),k:0,after:after||null,line:''};stOpenPhone('call');stRingOn(true);stDI()}
function stDial(id,act){if(stCallO)return;stCallO={id:id,dir:'out',st:'dial',t:0,lines:[],k:0,act:act,line:''};if(!stPhOpen)stOpenPhone('call');else stGo('call');stDI();stTry(()=>{beep(440,.35,.05);setTimeout(()=>beep(440,.35,.05),900)})}
function stCallLine(){const c=stCallO;if(!c||c.st!=='live')return;if(c.k>=c.lines.length){setTimeout(()=>{if(stCallO===c)stHang(true)},700);return}const t=c.lines[c.k++];c.line=t;stRender();stSpeak(c.id,t,()=>{if(stCallO===c)setTimeout(stCallLine,300)})}
function stAccept(){const c=stCallO;if(!c||c.st!=='ring')return;stRingOn(false);c.st='live';c.t=0;stLogCall(c.id,'in');stRender();setTimeout(stCallLine,500)}
function stDecline(){const c=stCallO;if(!c)return;stRingOn(false);if(c.dir==='in'&&c.st==='ring'){stAdd(c.id,2,c.lines.join(' '));stLogCall(c.id,'miss');stCallO=null;stDI();stNotify(c.id,'Left you a voicemail');if(stApp==='call')stHome();return}stHang(false)}
function stHang(nat){const c=stCallO;if(!c)return;stHush();stRingOn(false);stCallO=null;stDI();if(stApp==='call')stHome();if(c.after&&c.st==='live')stTry(c.after);stRender()}
function stDI(){const d=stEl('stpDI'),c=stCallO;if(c){d.classList.add('wide');d.innerHTML='<span style="width:.6em;height:.6em;border-radius:50%;background:#30d158"></span><span style="font-size:.78em;color:#30d158;font-weight:600">'+(c.st==='live'?Math.floor(c.t/60)+':'+String(Math.floor(c.t%60)).padStart(2,'0'):(c.dir==='in'?'Incoming':'Calling'))+'</span>'}else{d.classList.remove('wide');d.innerHTML=''}}
// ----- dialogue engine -----
const stInt=[['sorry',/\b(sorry|my bad|apolog|forgive)/],['insult',/\b(stupid|idiot|loser|hate you|shut up|trash|dumb|suck|ugly|annoying|clown|bozo)\b/],['compl',/\b(thank|thanks|thx|ty|love (it|you|ya)|great|awesome|amazing|legend|the best|nice one|appreciate|goat|beautiful)\b/],['food',/\b(hungry|food|eat|starving|broke|poor)\b/],['intel',/\b(intel|info|tip|plan|target|details)\b/],['price',/\b(how much|price|cost|fee)\b/],['job',/\b(job|work|gig|heist|score|hustle|money|cash|pay|rich|bread|business)\b/],['help',/\b(help|cops|police|wanted|heat|stars|trouble|busted|chasing|clear)\b/],['car',/\b(car|ride|wheels|vehicle|drive|garage|deliver)\b/],['home',/\b(house|home|apartment|condo|property|buy|place|crib)\b/],['where',/\b(where|wya|wru|location|address)\b/],['meet',/\b(meet|hang|come over|link|pull up|party|club|race|gym|tonight|tea)\b/],['joke',/\b(joke|funny|lol|lmao|haha|hehe|bored|lmfao)\b/],['how',/\b(how are|how r|hru|you good|u good|whats up|what's up|wyd|what you doing|how you)\b/],['greet',/^\s*(hi|hey|hello|yo|hiya|sup|morning|evening|gm|ayo|heyy+|wassup)\b/],['bye',/\b(bye|later|cya|gtg|gotta go|goodnight|good night|peace)\b/]];
const stYes=/^\s*(y|ya|yes|yeah|yep|yup|sure|ok|okay|do it|deal|bet|set it up|send it|lets go|let's go|i'?m in|im down|pick me up|race you|sounds good|go)\b/i,stNo=/^\s*(no|nah|nope|not now|pass|maybe later|never mind|nvm)\b/i;
const stPerOf=id=>({vee:'boss',jaz:'party',marc:'bro',nana:'nana',kai:'nerd',deke:'shady',taxi:'cab',mech:'mech',law:'law',agent:'agent'})[id]||'crew';
const stPer={
 boss:{greet:['You rang.','Talk to me.','Make it quick, three phones are going.'],how:['Busy. Money does not make itself.','Counting other peoples money. You?'],job:'@heist',intel:'@intel',where:['Somewhere with a view and no cameras.','If I told you I would have to move.'],meet:['We meet when there is money to split.'],help:'@help',insult:['Careful. I hire and I fire.','Cute. Save that energy for the job.'],compl:['I know.','Flattery does not pay rent. Work does.'],joke:['The joke is the Block City PD.'],bye:['Phone stays on. Always.'],car:['Drivers handle wheels. I handle money.'],home:['Buy property. It cleans money and you need a bed.'],def:['Text me when you are ready to work.','Money talk only.','Mm.'],cold:['I do not do business with people who talk like that.'],hot:['{w} stars? Get off the street before you call me.'],chips:['Got a job?','Any intel?','How much is my cut?']},
 party:{greet:['heyyy','omg hiii','look who finally texts back'],how:['living my best life. you?','tired but cute lol','{tod} vibes honestly'],job:['babe I do brunch not crime','ask Vee, she knows people'],where:['at the beach getting a tan','Club Neon line is insane rn','getting ready, takes two hours minimum'],meet:'@party',help:'@helpparty',insult:['wow ok','rude. blocked. (not really. but rude)'],compl:['stoppp','I know I know','you are sweet'],joke:['why did the cop break up with the speed bump? too many ups and downs. ok I tried'],bye:['byeee','text me later!'],car:['pick me up in something nice'],home:['when do I get the tour of your place?'],def:['lol what','hahaha true','ok but did you see my story','wait what','no way'],cold:['k.'],hot:['are those sirens for YOU?? go hide'],chips:['Club tonight?','Wyd?','You good?']},
 bro:{greet:['yo!','what up bro','ayy my guy'],how:['just hit a PR on bench','hydrated and focused. you?','sore but thriving'],job:['only job I got is gains bro','heard the fixer pays good. ask her'],where:['gym. where else','muscle beach doing pullups'],meet:'@race',help:['bro just outrun them','cut through the alleys, cops hate alleys'],insult:['say that at the gym','ok tough guy'],compl:['appreciate you bro','you too man, you too'],joke:['tried a no carb diet. worst four minutes of my life'],bye:['later bro','stay swole'],car:['need torque bro. no sedans'],home:['you buy a place? home gym or no respect'],def:['bet','facts','lmaooo','for real'],cold:['whatever man'],hot:['bro you are ALL over the scanner lol'],chips:['Race me?','Leg day?','What up']},
 nana:{greet:['Hello sweetheart.','Oh, it is you! Hello dear.'],how:['My knees complain but I am fine, dear. Are you eating?','Watching my programs. Are you staying out of trouble?'],job:['Work hard and be honest, dear. Mostly honest.'],where:['Home, where else. The kettle is on.'],meet:['Come by for tea any time. I made too many cookies again.'],help:'@helpnana',food:'@food',insult:['Well I never. I will pray for you, dear.','That is not how you were raised.'],compl:['Oh stop it, you will make me blush.','You were always a good one.'],joke:['Knock knock. Who is there? Your Nana. Call more often.'],bye:['Bye dear, wear a jacket.','Goodnight sweetheart.'],car:['Drive slow, dear. Those streets are full of maniacs.'],home:['A home of your own! I am so proud.'],def:['Oh that is nice dear.','I do not understand these texting words, dear.','Mm hm.'],cold:['I will wait for an apology, dear.'],hot:['I saw sirens on the news near {d}. Please be careful.'],chips:['Hi Nana','I am hungry','How are you?']},
 nerd:{greet:['sup','hey. make it interesting'],how:['compiling. always compiling','three monitors, zero sunlight. great'],job:'@hack',help:'@hack',where:['server room. it is cold and I love it'],meet:['in person? bold of you'],insult:['ok I just changed your contact name to something embarrassing','error 404: respect not found'],compl:['finally someone recognises genius','acknowledged'],joke:['there are 10 kinds of people. those who get binary and those who do not'],bye:['logging off'],car:['I could unlock any car on this street. I choose not to. mostly'],home:['make sure your place has fiber or do not invite me'],def:['interesting. no','k','sure','that is a bug, not a feature'],cold:['blocked (in spirit)'],hot:['your face is lighting up every police scanner'],chips:['Clear my stars','Any tech?','Sup']},
 shady:{greet:['who is this. oh. you.','yeah?'],how:['moving metal. always moving metal'],job:'@car',car:'@car',price:'@car',where:['you do not need to know where my lot is'],meet:['we do not meet. cars just appear'],help:['heat? swap cars. I can help with that','{w} stars? ditch the ride, I got another'],insult:['price just went up'],compl:['flattery does not get discounts. ok maybe a little'],joke:['my cars are like my jokes. borrowed'],bye:['delete this chat'],home:['need a garage? buy one. cars need homes too'],def:['say less','not my problem','mm','we will see'],cold:['lose my number'],chips:['Need a car','How much?','Any deals?']},
 cab:{greet:['Block Cab, where to?'],def:'@taxi',where:'@taxi',meet:'@taxi',car:'@taxi',job:['We drive, we do not hire. Try the Jobs app.'],help:['Cab rule: no passengers with stars. Lose the cops first.'],insult:['Tips are optional, manners are not.'],compl:['Five stars for you too.'],bye:['Ride safe.'],chips:['Pick me up','How much?','Thanks']},
 mech:{greet:['Otto Garage, talk.'],def:'@deliver',car:'@deliver',where:'@deliver',help:['Respray at a body shop clears heat. I just move cars.'],insult:['I have heard worse from engines.'],compl:['Cheers.'],bye:['Keep it between the lines.'],chips:['Bring my car','How much?','Thanks Otto']},
 law:{greet:['Sol Greaves. Billing starts now.'],def:'@law',help:'@law',price:'@law',insult:['That will be an extra fee.'],compl:['Flattery is billable too.'],bye:['Do not call me from jail.'],chips:['Clear my record','How much?','Thanks Sol']},
 agent:{greet:['Dana Pryce, Block City Realty!'],def:'@agent',home:'@agent',price:'@agent',compl:'@disc',insult:['I have sold houses to worse people. Barely.'],bye:['Happy house hunting!'],chips:['Any deals?','What is for sale?','You are the best']},
 crew:{greet:['Yo.','Ready when you are.'],how:'@role',job:['Vee calls the shots. Hit her up.'],where:['Around. Close enough.'],meet:['Next job. Not before.'],help:['Lose them in the alleys. Do not lead them to us.'],insult:['Keep that up and find a new crew.'],compl:['Respect.'],joke:['Funny. Now focus.'],bye:['Later.'],def:['Copy.','Roger.','Hm.'],cold:['We are done talking.'],chips:['You ready?','What is up?','Good work']}};
const stGenL={sorry:['Fine. We are good.','Apology accepted. This time.'],price:['Depends what you want.'],intel:['No intel here.'],food:['Get a hot dog from a cart.']};
function stPick(id,arr){if(!arr||!arr.length)return '...';const last=stC.ll[id];let i=Math.floor(Math.random()*arr.length);if(arr.length>1&&arr[i]===last)i=(i+1)%arr.length;stC.ll[id]=arr[i];return arr[i]}
function stFill(s){return s.replace('{w}',wanted).replace('{tod}',stTod()).replace('{d}',stDist()).replace('{cash}',stM(cash))}
function stFare(w){return Math.max(40,Math.round(Math.hypot(w.x-pos.x,w.z-pos.z)*1.2/10)*10)}
function stSpecial(id,k,it){const h=stS.h;
 if(k==='heist'){if(stS.done>=3)return {t:'You cleaned out this city. Lay low a while.'};if(h&&h.stage!=='plan')return {t:'Focus. '+stStageText()+'.'};const H=stHeist()[stS.done];return {t:'I have '+H.n+' lined up. '+stM(H.take)+' on the table. Want me to set it up?',act:{k:'heist',y:'Set it up'}}}
 if(k==='intel'){if(h&&h.stage!=='plan')return {t:'Intel: '+stStageText()+'. '+(stH&&stH.tg?'Target is about '+Math.round(Math.hypot(stH.tg.x-pos.x,stH.tg.z-pos.z))+' m from you.':'')};return stSpecial(id,'heist')}
 if(k==='help'){if(wanted>0)return {t:wanted+' stars? Call Sol the lawyer, or get off the street.'};return {t:'Help with what? You are clean.'}}
 if(k==='helpparty')return {t:wanted>0?'are those sirens for YOU?? go hide':'help with what babe'};
 if(k==='helpnana')return {t:wanted>0?'I heard sirens on the news. Please be careful, dear.':'What is wrong, dear? Are you hungry?'};
 if(k==='party'){const P=stProps.find(p=>p.id==='club');return {t:'Club Neon tonight? I will put you on the list',act:{k:'party',y:'I am in',x:P?P.x:0,z:P?P.z:0}}}
 if(k==='race'){if(typeof msType!=='undefined'&&msType>=0)return {t:'finish your gig first then we race'};return {t:'race me. checkpoints across town, loser buys protein. you in?',act:{k:'race',y:'Race you'}}}
 if(k==='food'){if(stS.play-(stC.flags.food||-999)<600)return {t:'I already sent you something, dear. Spend it on vegetables.'};return {t:'You sound hungry. I am sending you a little something for food, dear.',act:{k:'food',now:1}}}
 if(k==='hack'){if(wanted<1)return {t:'you are clean. if you get heat I can scrub one star off the police database. $1,000 a pop'};if(stS.play-(stC.flags.hack||-999)<180)return {t:'their firewall is still hot from last time. give it a few minutes'};return {t:'I can scrub one star off the police database. $1,000. want it?',act:{k:'hack',p:1000,y:'Do it'}}}
 if(k==='car')return {t:'got a clean sports car. no plates, no questions. $750 and I drop it at your feet. deal?',act:{k:'car',p:750,y:'Deal'}};
 if(k==='taxi'){const w=stTry(()=>mpWay,null);if(!w)return {t:'Drop a pin on your map, then text me again.'};if(wanted>0)return {t:'Not with that heat on you. Lose the cops first.'};const f=stFare(w);return {t:'Pin received. '+stM(f)+' to get you there. Want a ride?',act:{k:'taxi',p:f,y:'Pick me up'}}}
 if(k==='deliver'){if(stTry(()=>cpSave.car,null)===null)return {t:'Nothing of yours in the garage. Park a car on the blue ring at your safehouse first.'};return {t:'Your car is ready. $250 and it is parked next to you. Want it?',act:{k:'deliver',p:250,y:'Bring it'}}}
 if(k==='law'){if(wanted<1)return {t:'You are clean. Keep it that way.'};if(wanted>2)return {t:'Even I cannot fix '+wanted+' stars. Hide first, then call.'};const fee=wanted*2000;return {t:'I can make '+wanted+' star'+(wanted>1?'s':'')+' disappear for '+stM(fee)+'. Shall I?',act:{k:'law',p:fee,y:'Do it'}}}
 if(k==='agent'){const L=stProps.filter(p=>!stOwn(p)).slice(0,3).map(p=>p.n+' '+stM(stPrice(p)));return {t:L.length?'Hot listings: '+L.join(', ')+'. Everything is in the Property app.':'You own everything I have. I am almost jealous.'}}
 if(k==='disc'){if(stS.disc)return {t:'You already have 10% off your next property!'};if((stC.mood[id]||0)>=1){stS.disc=.9;stStore();return {t:'You are a sweetheart. 10% off your next property, it is on me.'}}return {t:'Aw, thank you!'}}
 if(k==='role'){const r=(stCrew[id]||{}).r;return {t:r==='Driver'?'Tuning the getaway car.':(r==='Gunman'?'Cleaning my gear.':'Watching cameras I should not be watching.')}}
 return {t:'...'}}
function stDoAct(id,a){if(!a)return null;
 if(a.p&&cash<a.p)return {t:'That is '+stM(a.p)+' and you have '+stM(cash)+'. Come back with money.'};
 if(a.k==='heist'){setTimeout(()=>{if(state==='play'){stClosePhone();stPlan()}},900);return {t:'Opening the board. Pick your crew.'}}
 if(a.k==='party'){stWay(a.x,a.z);return {t:'yay! pinned it on your map. dress nice'}}
 if(a.k==='race'){if(typeof msAcceptType==='function'&&msAcceptType(3))return {t:'start line is on your map. GO'};return {t:'finish your gig first'}}
 if(a.k==='food'){stC.flags.food=stS.play;cash+=100;stTx('From Nana',100);return {t:'Sent you $100. Eat something green.'}}
 if(a.k==='hack'){if(wanted<1)return {t:'you are already clean'};stPay(a.p,'Kai: database scrub');stC.flags.hack=stS.play;const th=[1,3,6,10,16];wantedScore=wanted>=2?th[wanted-2]:0;evade=0;return {t:'done. one star gone. you never saw me'}}
 if(a.k==='car'){if(driving||stTry(()=>!!cpIn,false))return {t:'get out on the street first'};stPay(a.p,'Deke: car drop');const m=makeCar(carColors[Math.floor(Math.random()*carColors.length)],.1);m.position.set(pos.x+3.2,0,pos.z);collide(m.position,1.9);m.rotation.y=facing;scene.add(m);cars.push({m,speed:0,steer:0});return {t:'look to your right. enjoy. we never talked'}}
 if(a.k==='taxi'){const w=stTry(()=>mpWay,null);if(!w)return {t:'Pin is gone. Drop it again.'};if(driving||stTry(()=>!!cpIn,false))return {t:'Step out to the street first.'};stPay(a.p,'Taxi fare');const go=()=>{pos.set(w.x,.3+stTry(()=>Math.max(0,ldFloor(w.x,w.z)),0),w.z);vel.set(0,0,0);collide(pos,.6)};stTry(()=>cpFade(go),go());return {t:'Here you go. Thanks for riding Block Cab.'}}
 if(a.k==='deliver'){if(stTry(()=>cpSave.car,null)===null)return {t:'Garage is empty.'};if(driving||stTry(()=>!!cpIn,false))return {t:'Call me when you are on the street.'};stPay(a.p,'Car delivery');const m=makeCar(cpSave.car,.9);m.position.set(pos.x+3.2,0,pos.z);collide(m.position,1.9);m.rotation.y=facing;scene.add(m);cars.push({m,speed:0,steer:0});cpSave.car=null;stTry(()=>cpStore());return {t:'Parked right next to you.'}}
 if(a.k==='law'){if(wanted<1)return {t:'Nothing to clear.'};if(!stPay(a.p,'Legal fees'))return {t:'My fee is '+stM(a.p)+'.'};wantedScore=0;evade=0;stS.lawT=T;return {t:'Charges dropped. Pleasure doing business.'}}
 return null}
function stReply(id,txt){const low=String(txt).toLowerCase().trim(),P=stPer[stPerOf(id)]||stPer.crew,act=stC.act[id];
 if(act&&stYes.test(low)){stC.act[id]=null;return stDoAct(id,act)||{t:'Done.'}}
 if(act&&stNo.test(low)){stC.act[id]=null;return {t:stPick(id,['No worries.','Your loss.','Offer stands. For now.'])}}
 let it='def';for(const a of stInt)if(a[1].test(low)){it=a[0];break}
 if(it==='price'&&act&&act.p)return {t:'It is '+stM(act.p)+'.',act:act};
 const m=stC.mood[id]||0;if(it==='insult')stC.mood[id]=Math.max(-3,m-1);else if(it==='compl')stC.mood[id]=Math.min(3,m+1);else if(it==='sorry')stC.mood[id]=Math.min(3,m+2);
 if((stC.mood[id]||0)<=-2&&it!=='sorry'&&it!=='compl')return {t:stPick(id,P.cold||P.def)};
 if(wanted>=2&&(it==='greet'||it==='how')&&P.hot)return {t:stFill(stPick(id,P.hot))};
 let L=P[it];if(L===undefined)L=stGenL[it];if(L===undefined)L=P.def;
 if(typeof L==='string'&&L[0]==='@')return stSpecial(id,L.slice(1),it);
 return {t:stFill(stPick(id,L))}}
function stChips(id){const a=stC.act[id];if(a){const P=stPer[stPerOf(id)]||stPer.crew;return [a.y||'Yes, do it','Not now',a.p?'How much?':((P.chips||['Thanks'])[1])]}const P=stPer[stPerOf(id)]||stPer.crew,c=(P.chips||['Hey','What is up?','Thanks']).slice();if(wanted>0&&stPerOf(id)!=='law')c[2]='Cops are on me';return c}
function stSend(id,txt){txt=String(txt||'').trim().slice(0,160);if(!txt)return;stAdd(id,1,txt);if(stView===id)stRender();const r=stReply(id,txt),now=performance.now(),d=900+Math.min(2600,r.t.length*45)+Math.random()*700;
 stPend.push({at:now+500,fn:()=>{stTyping[id]=1;if(stView===id)stRender()}});
 stPend.push({at:now+d,fn:()=>{stTyping[id]=0;stAdd(id,0,r.t);if(r.act)stC.act[id]=r.act;else if(stC.act[id]&&stC.act[id].now){stC.act[id]=null}
  if(r.act&&r.act.now){const x=stDoAct(id,r.act);stC.act[id]=null;if(x)stPend.push({at:performance.now()+1200,fn:()=>{stAdd(id,0,x.t);if(stView===id)stRender();else stNotify(id,x.t)}})}
  if(stView===id)stRender();else stNotify(id,r.t);stTry(()=>beep(1700,.06,.06))}})}
// ----- outgoing calls (contacts) -----
function stCall(k){if(stCallO)return;stDial(k,()=>{stCallCollect=[];const r=stCallAct(k);const lines=stCallCollect;stCallCollect=null;return {lines:lines.length?lines:['Hello?'],after:r}})}
function stCallAct(k){
 if(k==='vee'){if(stS.done>=3)stSay('vee','Three for three. Take a holiday, you earned it.');else if(stS.h&&stS.h.stage!=='plan')stSay('vee','You are mid job. '+stStageText()+'.');else{stSay('vee','I have a job with your name on it. Come look at the board.');return ()=>{stClosePhone();stPlan()}}return null}
 if(k==='taxi'){const w=stTry(()=>mpWay,null)||stTry(()=>(beam.visible?mission.target:null),null);if(driving||stTry(()=>!!cpIn,false)){stSay('taxi','Step out to the street first.');return null}if(wanted>0){stSay('taxi','Not with that heat on you.');return null}if(!w){stSay('taxi','Drop a marker on your map first, then call me.');return null}
  const fare=stFare(w);if(cash<fare){stSay('taxi','Fare is '+stM(fare)+'. Come back with cash.');return null}stSay('taxi','Hop in. '+stM(fare)+'. Hold on.');return ()=>{stPay(fare,'Taxi fare');const go=()=>{pos.set(w.x,.3+stTry(()=>Math.max(0,ldFloor(w.x,w.z)),0),w.z);vel.set(0,0,0);collide(pos,.6)};stTry(()=>cpFade(go),go())}}
 if(k==='mech'){if(stTry(()=>cpSave.car,null)===null){stSay('mech','Nothing of yours in the garage. Park a car on the blue ring at your safehouse first.');return null}if(driving||stTry(()=>!!cpIn,false)){stSay('mech','Call me when you are standing on the street.');return null}if(cash<250){stSay('mech','Delivery is $250.');return null}stSay('mech','On its way. Two fifty.');return ()=>{const r=stDoAct('mech',{k:'deliver',p:250})}}
 if(k==='law'){if(wanted<1){stSay('law','You are clean. Keep it that way.');return null}if(wanted>2){stSay('law','Even I cannot fix '+wanted+' stars. Hide first.');return null}if(T-stS.lawT<120&&T>=stS.lawT){stSay('law','I just called in a favour. Give it a couple of minutes.');return null}const fee=wanted*2000;if(cash<fee){stSay('law','My fee is '+stM(fee)+'.');return null}stSay('law','Consider it handled. '+stM(fee)+'.');return ()=>{stDoAct('law',{k:'law',p:fee})}}
 if(k==='agent'){stSay('agent','Everything I have is in the Property app. Signs are up at each address. I will open it for you.');return ()=>{stGo('estate')}}
 const r=stReply(k,'hey whats up');stSay(k,r.t);if(r.act){stC.act[k]=r.act;stSay(k,'Text me if you want it.')}return null}
const stSay0=stSay;stSay=function(who,t){if(stCallCollect){stCallCollect.push(t);return}stSay0(who,t)};
// ----- social feed -----
const stHandles=[['sally','Sally Vega','@sunsetsally','#ff9f0a'],['news','Block City News','@blockcitynews','#ff3b30'],['dre','Dre','@beachbum_dre','#30d158'],['neon','Neon Nights','@neonnights','#bf5af2'],['traffic','BC Traffic','@bctraffic','#ffd60a'],['gary','Gary','@grumpygary','#8e8e93'],['jaz','Jasmine Ortega','@jazzyjaz','#ff5fa2'],['marc','Marcus Bell','@marcuslifts','#2fa7ff'],['kai','Kai Tanaka','@kai_dev','#1fc7a8']];
const stAmb=[['sally','sunset on Ocean Drive hits different tonight'],['dre','who keeps parking a tank outside the army base gate?? oh wait'],['gary','third pothole on my street this week. great job city hall'],['neon','doors open at 10. dress code: shine'],['traffic','heavy traffic downtown, avoid the main avenue'],['jaz','new nails who dis'],['marc','reminder: rest days are for the weak'],['kai','just watched someone steal a car with the doors open. respect the efficiency'],['news','Mayor promises "fewer explosions" in new budget'],['sally','the ferris wheel at night is my whole personality'],['gary','someone drove a boat onto the beach. a BOAT'],['dre','ocean was perfect today'],['news','Airport reports another "unscheduled departure"'],['neon','DJ set starting now']];
function stPost(h,t){stC.feed.unshift([h,t,Math.floor(Math.random()*90)+3,Math.round(stS.play),0]);if(stC.feed.length>30)stC.feed.length=30;stChatSave()}
if(!stC.feed.length)for(let i=0;i<5;i++)stPost(stAmb[i][0],stAmb[i][1]);
// ----- events for proactive texts and posts -----
let stEvW=0,stEvDone=stS.done,stEvOwn=Object.keys(stS.own).length,stEvKills=kills,stEvDead=false,stEvPass=stTry(()=>msPassed,0);
function stEventsTick(){
 if(wanted>=3&&stEvW<3){stPost('news','Police pursuit underway near '+stDist()+'. Avoid the area.');if(Math.random()<.6)stPend.push({at:performance.now()+6000,fn:()=>stMsg('kai','your face is lighting up every police scanner. want me to scrub a star? $1,000',{k:'hack',p:1000,y:'Do it'})})}
 stEvW=wanted;
 if(stS.done>stEvDone){stEvDone=stS.done;const H=stHeist()[stS.done-1];stPost('news','BREAKING: '+H.n+' robbery leaves police baffled. Suspects still at large.');stPend.push({at:performance.now()+9000,fn:()=>stMsg('jaz','WAIT. was that you on the news??')});stPend.push({at:performance.now()+16000,fn:()=>stMsg('nana','Dear, the news mentioned a robbery. Please tell me you were home.')})}
 const own=Object.keys(stS.own).length;if(own>stEvOwn){stEvOwn=own;stPost('gary','new neighbours just moved in. if they are loud I am calling someone');stPend.push({at:performance.now()+7000,fn:()=>stMsg('nana','A new home! I am baking you cookies.')})}
 if(kills-stEvKills>=6){stEvKills=kills;stPost('news','Reports of gunfire near '+stDist()+'. Residents urged to stay indoors.')}
 const p=stTry(()=>msPassed,0);if(p>stEvPass){stEvPass=p;if(p%3===0)stPost('traffic','some maniac just hit 100 through '+stDist()+'. send help')}
 if(state==='dead'&&!stEvDead){stEvDead=true;stPend.push({at:performance.now()+12000,fn:()=>stMsg('marc','heard you got sent to the hospital lol you good?')})}else if(state!=='dead')stEvDead=false}
function stProactive(){const h=stHour(),r=Math.random();
 if((h>=20||h<3)&&r<.5){const P=stProps.find(p=>p.id==='club');stMsg('jaz','Club Neon tonight? I can get you on the list',{k:'party',y:'I am in',x:P?P.x:0,z:P?P.z:0});return}
 if(h>=6&&h<11&&r<.5){stMsg('marc','leg day. you coming or what');return}
 const opts=[()=>stMsg('deke','got a clean ride, barely used. $750, dropped at your feet. interested?',{k:'car',p:750,y:'Deal'}),()=>stMsg('nana','Just checking on you, dear. Are you eating properly?'),()=>{if(typeof msType!=='undefined'&&msType<0)stMsg('marc','race me. checkpoints across town. you in?',{k:'race',y:'Race you'});else stMsg('marc','yo what you up to')},()=>stMsg('kai','found a bug in the city traffic lights. not fixing it. just letting you know'),()=>stMsg('jaz','ok but who was the guy jumping a motorbike off the pier earlier lol')];
 opts[Math.floor(Math.random()*opts.length)]()}
function stRandomCall(){const r=Math.random(),h=stHour();
 if((h>=19||h<3)&&r<.4){const P=stProps.find(p=>p.id==='club');stIncoming('jaz',['Heyyy! Okay so, Club Neon tonight.','I put you on the list. Do not make me wait outside!'],()=>{if(P)stWay(P.x,P.z)});return}
 if(r<.6)stIncoming('nana',['Hello sweetheart, it is Nana.','I just wanted to hear your voice. Are you eating?','Call your Nana more often. Bye now.']);
 else if(r<.8)stIncoming('marc',['Yo bro! You hit the gym today?','Text me if you want to race. Loser buys protein.']);
 else stIncoming('deke',['It is Deke. Do not say my name on the phone.','I got cars. Text me if you need wheels.'])}
// ----- render apps -----
function stHdr(t,back,right){return '<div class="stp-hd"><span class="stp-bk" data-k="'+(back||'home')+'">&lsaquo; '+(back&&back!=='home'?'Back':'')+'</span><b style="flex:1">'+t+'</b>'+(right||'')+'</div>'}
function stRender(){const A=stEl('stpA');if(!A)return;let h='';const a=stApp;
 if(a==='msgs'){h+=stHdr('Messages','home');h+='<div class="stp-sc" id="stpSc">';const ids=Object.keys(stC.t).filter(k=>(stC.t[k]||[]).length).sort((x,y)=>(stC.last[y]||0)-(stC.last[x]||0));
  if(!ids.length)h+='<div class="stp-sub" style="padding:1em 0">No conversations yet. Text someone from Contacts.</div>';
  for(const id of ids){const L=stC.t[id],m=L[L.length-1],u=stC.u[id]||0,w=stWho(id);h+='<div class="stp-row" data-k="chat:'+id+'">'+(u?'<span class="stp-dot"></span>':'<span style="width:.62em"></span>')+stAvI(id)+'<div class="stp-t"><b>'+stE(w.n)+'</b><div class="stp-sub">'+(m[0]===2?'&#9654; Voicemail':(m[0]===1?'You: ':'')+stE(m[1]))+'</div></div><span class="stp-sub" style="align-self:flex-start;margin-top:.2em">'+stAgo(m[2])+'</span></div>'}
  h+='<div style="margin-top:.8em"><span class="stp-btn g" data-k="app:contacts">New message</span></div></div>'}
 else if(a.indexOf('chat:')===0){const id=a.slice(5),w=stWho(id),L=stC.t[id]||[];
  h+='<div class="stp-hd" style="position:relative;flex-direction:column;gap:.25em;padding-bottom:.6em;border-bottom:.06em solid #ffffff17"><span class="stp-bk" data-k="app:msgs" style="position:absolute;left:1em;top:3.4em">&lsaquo;</span>'+stAvI(id,3.1)+'<span style="font-size:.85em;font-weight:600">'+stE(w.n)+' &rsaquo;</span><span style="font-size:.7em;opacity:.55">'+(stTyping[id]?'typing...':(w.r||'mobile'))+'</span><span data-k="call:'+id+'" style="position:absolute;right:1em;top:3.4em" class="stp-ib">'+stSvg(stGl.phone)+'</span></div>';
  h+='<div class="stp-sc" id="stpSc" style="padding:0"><div class="stp-chat">';let lastTs=-1e9;
  L.slice(-30).forEach((m,i,arr)=>{if(m[2]-lastTs>240)h+='<div class="stp-ts">'+(m[2]<1?'Earlier':(stAgo(m[2])==='now'?'Today':'Today, '+stAgo(m[2])+' ago'))+'</div>';lastTs=m[2];const idx=L.length-arr.length+i;
   if(m[0]===2)h+='<div class="stp-m i stp-vm" data-k="vm:'+id+':'+idx+'"><span class="stp-ib" style="width:1.9em;height:1.9em;background:#ffffff22">'+stSvg(stGl.play,' style="fill:#fff"')+'</span><span>'+[5,9,6,12,8,14,7,11,5,9,13,6,10,4].map(v=>'<i style="height:'+(v*.08)+'em"></i>').join('')+'</span><span class="stp-sub">0:'+String(Math.min(59,Math.round(m[1].length/12))).padStart(2,'0')+'</span></div>';
   else h+='<div class="stp-m '+(m[0]===1?'o':'i')+'">'+stE(m[1])+'</div>'});
  if(stTyping[id])h+='<div class="stp-typ"><i></i><i></i><i></i></div>';
  h+='</div></div><div class="stp-chips">'+stChips(id).map((c,i)=>'<span class="stp-chip" data-k="chip:'+i+'">'+stE(c)+'</span>').join('')+'</div><div class="stp-inp"><input id="stpIn" type="text" maxlength="160" placeholder="Text message" autocomplete="off" autocorrect="on" enterkeyhint="send" data-k="inp"><span class="stp-send" data-k="send">'+stSvg(stGl.send)+'</span></div>'}
 else if(a==='contacts'){h+=stHdr('Contacts','home');h+='<div class="stp-sc" id="stpSc">';let last='';const ids=stAll.slice().sort((x,y)=>stWho(x).n.localeCompare(stWho(y).n));
  for(const id of ids){const w=stWho(id),L=w.n.replace(/"[^"]*"\s*/,'')[0];if(L!==last){last=L;h+='<div style="font-size:.75em;font-weight:700;color:#ffffff66;margin-top:.6em">'+L+'</div>'}
   h+='<div class="stp-row">'+stAvI(id,2.6)+'<div class="stp-t"><b>'+stE(w.n)+'</b><div class="stp-sub">'+stE(w.r||'')+' &middot; '+stNum(id)+'</div></div><span class="stp-ib" data-k="chat:'+id+'">'+stSvg(stGl.msgs,' style="fill:#0a84ff"')+'</span><span class="stp-ib" data-k="call:'+id+'">'+stSvg(stGl.phone)+'</span></div>'}h+='</div>'}
 else if(a==='phone'){h+=stHdr(stPhTab==='rec'?'Recents':'Keypad','home');h+='<div class="stp-sc" id="stpSc"><div class="stp-tab"><span data-k="ptab:rec" class="'+(stPhTab==='rec'?'on':'')+'">Recents</span><span data-k="ptab:key" class="'+(stPhTab==='key'?'on':'')+'">Keypad</span><span data-k="app:contacts">Contacts</span></div>';
  if(stPhTab==='rec'){if(!stC.calls.length)h+='<div class="stp-sub" style="padding:1em 0">No recent calls</div>';for(const c of stC.calls.slice(0,15)){const w=stWho(c[0]);h+='<div class="stp-row" data-k="call:'+c[0]+'"><div class="stp-t"><b style="color:'+(c[1]==='miss'?'#ff453a':'#fff')+'">'+stE(w.n)+'</b><div class="stp-sub">'+(c[1]==='in'?'Incoming':(c[1]==='out'?'Outgoing':'Missed'))+'</div></div><span class="stp-sub">'+stAgo(c[2])+'</span></div>'}}
  else{h+='<div style="text-align:center;font-size:1.9em;font-weight:300;height:1.6em;margin:.3em 0 .5em;letter-spacing:.05em">'+(stDialS||'&nbsp;')+'</div><div class="stp-key">';for(const d of['1','2','3','4','5','6','7','8','9','*','0','#'])h+='<span data-k="key:'+d+'">'+d+'</span>';h+='<span style="visibility:hidden"></span><span data-k="kcall" style="background:#30d158">'+stSvg(stGl.phone,' style="width:40%;height:40%;fill:#fff"')+'</span><span data-k="kdel" style="background:none;font-size:1em">&#9003;</span></div>'}
  h+='</div>'}
 else if(a==='call'){const c=stCallO;if(!c){stApp='home';stHome();return}const w=stWho(c.id),tm=Math.floor(c.t/60)+':'+String(Math.floor(c.t%60)).padStart(2,'0');
  h+='<div class="stp-cbg" style="background:radial-gradient(120% 70% at 50% 25%,'+w.c+'88,#141418 70%)"></div><div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;height:100%;padding-top:4.2em;box-sizing:border-box">'+stAvI(c.id,6)+'<div style="font-size:1.6em;font-weight:500;margin-top:.5em">'+stE(w.n)+'</div><div class="stp-sub" style="font-size:.95em" id="stpCT">'+(c.st==='ring'?(c.dir==='in'?'mobile &middot; incoming call':'calling...'):(c.st==='dial'?'calling...':tm))+'</div>';
  h+='<div style="flex:1;display:flex;align-items:center;padding:0 1.2em;text-align:center;font-size:.95em;line-height:1.35;opacity:.92">'+(c.line?'&ldquo;'+stE(c.line)+'&rdquo;':'')+'</div>';
  if(c.st==='ring'&&c.dir==='in')h+='<div style="display:flex;justify-content:space-between;width:78%;margin-bottom:3.4em"><div style="text-align:center"><span class="stp-cb" data-k="dec" style="background:#ff3b30">'+stSvg(stGl.end)+'</span><div class="stp-sub" style="margin-top:.4em">Decline</div></div><div style="text-align:center"><span class="stp-cb" data-k="acc" style="background:#30d158">'+stSvg(stGl.phone)+'</span><div class="stp-sub" style="margin-top:.4em">Accept</div></div></div>';
  else h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.9em 1.4em;margin-bottom:1.1em">'+['mute','keypad','speaker'].map(x=>'<div style="text-align:center"><span class="stp-cb" style="background:#ffffff26;width:3.3em;height:3.3em;margin:0 auto"></span><div class="stp-sub" style="margin-top:.3em;font-size:.75em">'+x+'</div></div>').join('')+'</div><span class="stp-cb" data-k="end" style="background:#ff3b30;margin-bottom:3em">'+stSvg(stGl.end)+'</span>';
  h+='</div>'}
 else if(a==='bank'){h+=stHdr('Block Bank','home');let inc=0;for(const P of stProps)if(P.k==='biz'&&stOwn(P))inc+=Math.floor(stS.inc[P.id]||0);
  h+='<div class="stp-sc" id="stpSc"><div style="border-radius:1.2em;padding:1em;background:linear-gradient(135deg,#0f9b5f,#064d33 60%,#0b2b20);box-shadow:0 .4em 1em #0007;position:relative;overflow:hidden"><div style="position:absolute;right:-2em;top:-2em;width:7em;height:7em;border-radius:50%;background:#ffffff14"></div><div style="font-size:.72em;letter-spacing:.12em;opacity:.8">BLOCK BANK &middot; CHECKING</div><div style="font-size:2em;font-weight:700;margin:.25em 0">'+stM(cash)+'</div><div style="display:flex;justify-content:space-between;font-size:.78em;opacity:.85"><span>**** 4720</span><span>Income waiting '+stM(inc)+'</span></div></div>'+(inc>0?'<div style="margin-top:.7em"><span class="stp-btn y" data-k="collect">Collect '+stM(inc)+'</span></div>':'');
  h+='<div style="font-weight:700;margin:1em 0 .2em">Transactions</div>';if(!stS.tx.length)h+='<div class="stp-sub">No transactions yet</div>';for(const t of stS.tx.slice(0,12))h+='<div class="stp-row" style="justify-content:space-between"><span class="stp-t"><b style="font-weight:500">'+stE(t[0])+'</b></span><b style="color:'+(t[1]<0?'#ff8a80':'#30d158')+'">'+(t[1]<0?'-':'+')+stM(Math.abs(t[1]))+'</b></div>';h+='</div>'}
 else if(a==='estate'){h+=stHdr('Property','home',stS.disc?'<span class="stp-btn o" style="padding:.3em .6em">10% OFF</span>':'');h+='<div class="stp-sc" id="stpSc">';
  for(const P of stProps){const o=stOwn(P),pr=stPrice(P);h+='<div class="stp-card"><div class="stp-ph" style="background:'+stPhoto(P)+'">'+stSil(P)+(o?'<span style="position:absolute;left:.6em;top:.6em" class="stp-btn y">OWNED</span>':'')+'</div><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5em"><div class="stp-t"><b>'+stE(P.n)+'</b><div class="stp-sub" style="white-space:normal">'+stE(P.d)+'</div></div><b style="color:'+(o?'#30d158':'#fff')+';white-space:nowrap">'+(o?'Yours':stM(pr))+'</b></div><div style="margin-top:.55em;display:flex;gap:.4em">'+(o?'':'<span class="stp-btn" data-k="buy:'+P.id+'">Buy</span>')+(P.x!==undefined?'<span class="stp-btn g" data-k="way:'+P.id+'">'+stSvg(stGl.pin,' style="width:1em;height:1em;fill:#ff453a;margin-right:.3em"')+'Map</span>':'')+'</div></div>'}h+='</div>'}
 else if(a==='jobs'){h+=stHdr('Jobs','home');h+='<div class="stp-sc" id="stpSc">';const hasMs=typeof msOffers!=='undefined';
  if(hasMs&&msType>=0){h+='<div class="stp-card" style="border:.08em solid #ffd23f55"><div style="font-size:.72em;letter-spacing:.1em;color:#ffd23f">ACTIVE JOB</div><div style="font-weight:700;font-size:1.1em;margin:.15em 0">'+msNames[msType]+'</div><div class="stp-sub" style="white-space:normal">'+stE(stTry(()=>msSummary(),''))+'</div><div style="margin-top:.55em;display:flex;gap:.4em"><span class="stp-btn '+(msPinned?'g':'')+'" data-k="job:pin">'+(msPinned?'Unpin':'Pin')+'</span><span class="stp-btn r" data-k="job:x">Cancel</span></div></div>'}
  if(hasMs){h+='<div style="font-weight:700;margin:.9em 0 .2em">Available</div>';if(!msOffers.length)h+='<div class="stp-sub">Checking for work...</div>';msOffers.forEach((o,i)=>{const d=Math.round(Math.hypot(o.p.x-pos.x,o.p.z-pos.z));h+='<div class="stp-row"><span class="stp-av" style="background:#ffd23f;color:#201600;font-size:.9em">'+'DTHRCX'[o.t]+'</span><div class="stp-t"><b>'+msNames[o.t]+'</b><div class="stp-sub" style="white-space:normal">'+msDesc[o.t]+' &middot; ~'+stM(o.est)+' &middot; '+d+' m</div></div><span style="display:flex;flex-direction:column;gap:.3em"><span class="stp-btn" data-k="job:acc:'+i+'">'+(msType>=0?'Queue':'Accept')+'</span><span class="stp-btn g" data-k="job:gps:'+i+'">GPS</span></span></div>'})}
  h+='<div style="font-weight:700;margin:1em 0 .2em">Heists</div>';const HS=stHeist();HS.forEach((H,i)=>{const st=i<stS.done?'DONE':(i===stS.done?(stS.h&&stS.h.i===i&&stS.h.stage!=='plan'?'IN PROGRESS':'READY'):'LOCKED');h+='<div class="stp-row"><span class="stp-av" style="background:'+(st==='DONE'?'#30d158':(st==='LOCKED'?'#3a3a3c':'#ff5cf0'))+'">'+(i+1)+'</span><div class="stp-t"><b>'+H.n+'</b><div class="stp-sub">'+stM(H.take)+' take &middot; '+st+'</div></div>'+(st==='READY'?'<span class="stp-btn" data-k="plan">Plan</span>':'')+'</div>'});
  if(stS.h&&stS.h.stage!=='plan')h+='<div class="stp-card"><b>Now:</b> '+stStageText()+'<div style="margin-top:.5em"><span class="stp-btn r" data-k="quit">Abandon heist</span></div></div>';h+='</div>'}
 else if(a==='chirp'){h+=stHdr('Chirp','home');h+='<div class="stp-sc" id="stpSc">';stC.feed.forEach((p,i)=>{const H=stHandles.find(x=>x[0]===p[0])||['x','Someone','@someone','#888'];h+='<div class="stp-post">'+stAv(H[3],H[1])+'<div class="stp-t"><div style="font-size:.9em"><b style="display:inline">'+stE(H[1])+'</b> <span class="stp-sub">'+H[2]+' &middot; '+stAgo(p[3])+'</span></div><div style="margin:.2em 0 .35em;font-size:.95em;line-height:1.3">'+stE(p[1])+'</div><span data-k="like:'+i+'" style="display:inline-flex;align-items:center;gap:.3em;font-size:.82em;color:'+(p[4]?'#ff375f':'#ffffff88')+'">'+stSvg(stGl.heart,' style="width:1.1em;height:1.1em;fill:'+(p[4]?'#ff375f':'#ffffff66')+'"')+(p[2]+(p[4]?1:0))+'</span></div></div>'});h+='</div>'}
 else if(a==='music'){h+=stHdr('Music','home');h+='<div class="stp-sc" id="stpSc">';if(!stMusicOk)h+='<div class="stp-sub">Radio unavailable</div>';else{const cur=auR.st;h+='<div class="stp-card" style="background:linear-gradient(135deg,#ff2d55,#5b1022);text-align:center"><div style="font-size:.72em;letter-spacing:.12em;opacity:.8">NOW SELECTED</div><div style="font-size:1.35em;font-weight:800;margin:.25em 0">'+(cur<4?auST[cur].n:'Radio off')+'</div><div class="stp-sub" style="color:#fffc">'+(driving?'Playing in your vehicle':'Plays when you are in a vehicle')+'</div></div>';
  for(let i=0;i<=auST.length;i++){const on=cur===i,n=i<auST.length?auST[i].n:'Radio off';h+='<div class="stp-row" data-k="st:'+i+'"><span class="stp-av" style="border-radius:.6em;background:'+['#bf5af2','#ff9f0a','#ff453a','#64d2ff','#3a3a3c'][i%5]+'">'+(i<auST.length?auST[i].b[0]:'&times;')+'</span><div class="stp-t"><b>'+stE(n)+'</b><div class="stp-sub">'+(i<auST.length?auST[i].bpm+' bpm':'Silence')+'</div></div>'+(on?'<b style="color:#ff375f">&#9654;</b>':'')+'</div>'}}h+='</div>'}
 else if(a==='cam'){h+=stHdr('Camera','home');h+='<div class="stp-sc" id="stpSc"><div style="height:11em;border-radius:1em;background:linear-gradient(#111,#222);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.5em;text-align:center;padding:0 1em"><div style="font-size:.85em;opacity:.8">Photo Mode hides the HUD so you can frame a shot. Tap the shutter to take it.</div><span class="stp-btn" data-k="photo">Open Photo Mode</span></div><div style="font-weight:700;margin:.9em 0 .4em">Recents</div>';if(!stPhotos.length)h+='<div class="stp-sub">No photos yet</div>';h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.25em">';for(const p of stPhotos)h+='<img src="'+p+'" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:.35em">';h+='</div></div>'}
 else if(a==='map'){h+=stHdr('Maps','home');h+='<div class="stp-sc" id="stpSc"><div class="stp-card" style="background:linear-gradient(135deg,#1f3b57,#0f1f2e)"><div class="stp-sub">You are in</div><div style="font-size:1.3em;font-weight:700">'+stE(stDist())+'</div><div style="margin-top:.6em"><span class="stp-btn" data-k="fullmap">Open full map</span> '+(stTry(()=>mpWay,null)?'<span class="stp-btn g" data-k="clrway">Clear pin</span>':'')+'</div></div><div style="font-weight:700;margin:.9em 0 .2em">Places</div>';
  const pl=[];for(const P of stProps)if(P.x!==undefined)pl.push([P.n+(stOwn(P)?' (yours)':''),P.x,P.z]);stTry(()=>{for(const q of cpPlaces)pl.push([q.D&&q.D.l?q.D.l:q.type,q.x,q.z])});pl.sort((x,y)=>Math.hypot(x[1]-pos.x,x[2]-pos.z)-Math.hypot(y[1]-pos.x,y[2]-pos.z));
  for(const q of pl.slice(0,14))h+='<div class="stp-row"><div class="stp-t"><b style="font-weight:500">'+stE(q[0])+'</b><div class="stp-sub">'+Math.round(Math.hypot(q[1]-pos.x,q[2]-pos.z))+' m</div></div><span class="stp-btn g" data-k="gps:'+Math.round(q[1])+':'+Math.round(q[2])+'">GPS</span></div>';h+='</div>'}
 else if(a==='stats'){h+=stHdr('Stats','home');const own=stProps.filter(stOwn).length,R=(x,y)=>'<div class="stp-row" style="justify-content:space-between"><span>'+x+'</span><b>'+y+'</b></div>';h+='<div class="stp-sc" id="stpSc">'+R('Cash',stM(cash))+R('Heists completed',stS.done+' of 3')+R('Properties',own+' of '+stProps.length)+R('Takedowns',kills)+R('Jobs passed',stTry(()=>msPassed,0))+R('Best streak',stTry(()=>msBest,0))+R('Time played',Math.floor(stS.play/60)+' min')+R('Wanted level',wanted+' stars')+R('Texts sent',Object.values(stC.t).reduce((n,L)=>n+L.filter(m=>m[0]===1).length,0))+'</div>'}
 A.innerHTML=h;if(a.indexOf('chat:')===0){const sc=stEl('stpSc');if(sc)sc.scrollTop=sc.scrollHeight}}
function stPhoto(P){const s={home:'linear-gradient(#7ec8ff,#cfe9ff 55%,#8fbf7a 56%,#5e8f4f)',biz:'linear-gradient(#ffb36b,#ffd9a8 55%,#9a9a9a 56%,#6d6d6d)'};return P.id==='condo'||P.id==='marina'?'linear-gradient(#7ec8ff,#bfe6ff 52%,#1a78c2 53%,#0e4f86)':(P.id==='pent'?'linear-gradient(#2b3a67,#ff8f6b)':(P.id==='mans'?'linear-gradient(#ffb36b,#ffe2b8 50%,#b79b6c 51%,#7d6a48)':s[P.k]))}
function stSil(P){const c='#1d2333',m={safe:'<rect x="30" y="18" width="40" height="42"/>',apt:'<rect x="28" y="10" width="44" height="50"/>',house:'<path d="M25 60V36l25-18 25 18v24z"/>',ware:'<path d="M15 60V30l35-10 35 10v30z"/>',condo:'<rect x="34" y="8" width="32" height="52"/>',pent:'<rect x="40" y="2" width="20" height="58"/><rect x="24" y="22" width="14" height="38"/><rect x="62" y="16" width="14" height="44"/>',mans:'<path d="M12 60V38l18-12 18 12V60zM46 60V30l22-14 22 14v30z"/>',wash:'<path d="M18 60V34h64v26zM14 34l36-12 36 12z"/>',club:'<rect x="22" y="22" width="56" height="38"/><rect x="30" y="28" width="40" height="8" fill="#ff5cf0"/>',marina:'<path d="M20 50h50l-8 10H28z"/><path d="M44 50V24l14 20z"/>'}[P.id]||'<rect x="30" y="20" width="40" height="40"/>';return '<svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMax meet" style="position:absolute;inset:0;width:100%;height:100%;fill:'+c+'">'+m+'</svg>'}
// ----- input -----
let stTch=null;
function stK(el){return el&&el.closest?el.closest('[data-k]'):null}
stPh.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const t=e.changedTouches[0];if(!t||stTch)return;const el=t.target,k=stK(el),sc=el&&el.closest?el.closest('.stp-sc'):null;stTch={id:t.identifier,x:t.clientX,y:t.clientY,k:k,sc:sc,st:sc?sc.scrollTop:0,mv:false,t0:performance.now()};if(k){k.classList.add('stp-pr');stTry(()=>{if(navigator.vibrate&&!(uiS&&uiS.vib===0))navigator.vibrate(6)})}},{passive:false});
stPh.addEventListener('touchmove',e=>{e.preventDefault();e.stopPropagation();const s=stTch;if(!s)return;for(const t of e.changedTouches){if(t.identifier!==s.id)continue;const dx=t.clientX-s.x,dy=t.clientY-s.y;if(Math.abs(dx)+Math.abs(dy)>9){s.mv=true;if(s.k){s.k.classList.remove('stp-pr')}}if(s.sc)s.sc.scrollTop=s.st-dy}},{passive:false});
function stTEnd(e){e.stopPropagation();const s=stTch;if(!s)return;let mine=false;for(const t of e.changedTouches)if(t.identifier===s.id)mine=true;if(!mine&&e.type!=='touchcancel')return;stTch=null;if(s.k)s.k.classList.remove('stp-pr');if(e.type==='touchcancel')return;
 const t=e.changedTouches[0],dy=t?t.clientY-s.y:0;
 if(stLocked&&dy<-20){stUnlock();return}
 if(s.mv){if(s.k&&s.k.getAttribute('data-k')==='bar'&&dy<-18)stTap('bar');return}
 if(stLocked){stUnlock();return}
 if(s.k)stTap(s.k.getAttribute('data-k'),s.k)}
stPh.addEventListener('touchend',stTEnd);stPh.addEventListener('touchcancel',stTEnd);
stPh.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&e.target&&e.target.id==='stpIn'){const v=e.target.value;e.target.value='';if(stView)stSend(stView,v);e.preventDefault()}});
stPh.addEventListener('keyup',e=>e.stopPropagation());stPh.addEventListener('keypress',e=>e.stopPropagation());
function stTap(k,el){
 if(k==='bar'){if(stApp==='home')stClosePhone();else stHome();return}
 if(k==='home'||k==='close'){if(k==='close'){stClosePhone();return}stHome();return}
 if(k==='inp'){stTry(()=>{const i=stEl('stpIn');i.focus();i.click&&0});return}
 if(k.indexOf('app:')===0){const a=k.slice(4);stGo(a,el);return}
 if(k.indexOf('chat:')===0){stEl('stpNB').classList.remove('on');stGo(k,el);return}
 if(k.indexOf('chip:')===0){if(!stView)return;const c=stChips(stView)[+k.slice(5)];stSend(stView,c);return}
 if(k==='send'){const i=stEl('stpIn');if(i&&stView){const v=i.value;i.value='';stSend(stView,v)}return}
 if(k.indexOf('call:')===0){stCall(k.slice(5));return}
 if(k==='acc'){stAccept();return}if(k==='dec'||k==='end'){stDecline();return}
 if(k.indexOf('ptab:')===0){stPhTab=k.slice(5);stRender();return}
 if(k.indexOf('key:')===0){if(stDialS.length<12)stDialS+=k.slice(4);stTry(()=>beep(900+Math.random()*400,.06,.05));stRender();return}
 if(k==='kdel'){stDialS=stDialS.slice(0,-1);stRender();return}
 if(k==='kcall'){const n=stDialS.replace(/[^0-9]/g,''),id=stAll.find(x=>stNum(x).replace('-','')===n||stNum(x).replace('-','').slice(3)===n);stDialS='';if(id)stCall(id);else if(n){stCallO=null;stDial('op',null);stCallO.opMsg=true}return}
 if(k.indexOf('vm:')===0){const p=k.split(':'),m=(stC.t[p[1]]||[])[+p[2]];if(m)stSpeak(p[1],m[1]);return}
 if(k==='collect'){const a=stCollectAll();toast(a?'Collected '+stM(a):'Nothing to collect');stRender();return}
 if(k.indexOf('buy:')===0){const P=stProps.find(p=>p.id===k.slice(4));if(P)stBuy(P);stRender();return}
 if(k.indexOf('way:')===0){const P=stProps.find(p=>p.id===k.slice(4));if(P){stWay(P.x,P.z);toast('GPS set: '+P.n)}return}
 if(k.indexOf('gps:')===0){const p=k.split(':');stWay(+p[1],+p[2]);toast('GPS set');stRender();return}
 if(k==='clrway'){stTry(()=>{mpWay=null;mpDirty=true});stWayMine=null;stRender();return}
 if(k==='fullmap'){stClosePhone();stTry(()=>fxToggleMap());return}
 if(k==='plan'){stClosePhone();stPlan();return}if(k==='quit'){stAbort('Heist abandoned');stRender();return}
 if(k==='job:pin'){stTry(()=>msPin(!msPinned));stRender();return}
 if(k==='job:x'){stTry(()=>msCancel());stRender();return}
 if(k.indexOf('job:acc:')===0){stTry(()=>{if(msType>=0){toast('Finish or cancel your current job first');return}msAccept(+k.slice(8))});stRender();return}
 if(k.indexOf('job:gps:')===0){stTry(()=>{const o=msOffers[+k.slice(8)];if(o){stWay(o.p.x,o.p.z);toast('GPS set: '+msNames[o.t])}});return}
 if(k.indexOf('like:')===0){const p=stC.feed[+k.slice(5)];if(p){p[4]=p[4]?0:1;stChatSave();stRender()}return}
 if(k.indexOf('st:')===0){stTry(()=>{const i=+k.slice(3);auR.st=(i+4)%5;auRadioNext()});stRender();return}
 if(k==='photo'){stClosePhone();stCamOn();return}}
// ----- phone button: take over the crime one, or make our own -----
let stPhBtn=null;
if(typeof cpPh!=='undefined'){stPhBtn=cpPh;cpPhone=function(){if(stPhOpen)stClosePhone();else stOpenPhone()};cpPh.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v13h10V5zm4 14.2v1.2h2v-1.2z"/></svg>'}
else{stPhBtn=document.createElement('div');stPhBtn.className='btn';stPhBtn.textContent='PHONE';stPhBtn.style.cssText='left:14px;top:calc(env(safe-area-inset-top,0px) + 70px);width:44px;height:44px;font-size:9px';document.body.appendChild(stPhBtn);stPhBtn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(stPhOpen)stClosePhone();else stOpenPhone()},{passive:false})}
const stDot=document.createElement('span');stDot.style.cssText='position:absolute;right:-3px;top:-3px;min-width:16px;height:16px;border-radius:8px;background:#ff3b30;color:#fff;font-size:10px;font-weight:800;line-height:16px;text-align:center;display:none;pointer-events:none';
addEventListener('keydown',e=>{if(e.key==='t'){if(stPhOpen)stClosePhone();else stOpenPhone()}});
addEventListener('resize',()=>{if(stPhOpen)setTimeout(stLayout,60)});
// no shooting while the phone is out
{const ts0=tapShoot;tapShoot=function(x,y){if(stPhOpen)return;ts0(x,y)}}
// ----- camera / photo mode -----
const stCamX=document.createElement('div');stCamX.id='stCamX';stCamX.className='st-p';stCamX.style.cssText='left:0;top:0;right:0;bottom:0;display:none;align-items:flex-end;justify-content:center;padding-bottom:calc(env(safe-area-inset-bottom,0px) + 22px);font-size:12px;font-weight:700;text-shadow:0 1px 3px #000;gap:26px';stCamX.innerHTML='<span data-c="x" style="padding:9px 14px;border-radius:18px;background:#0008">Done</span><span data-c="s" style="width:62px;height:62px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px #0006,0 0 0 7px #fff"></span><span style="width:52px"></span>';document.body.appendChild(stCamX);
function stCamOn(){stCam=true;document.body.classList.add('stcam');stCamX.style.display='flex';stPause('stcam')}
function stCamOff(){stCam=false;document.body.classList.remove('stcam');stCamX.style.display='none';stResume('stcam')}
function stShot(){stTry(()=>{composer.render();const c=document.createElement('canvas'),src=renderer.domElement;c.width=240;c.height=Math.round(240*src.height/src.width);c.getContext('2d').drawImage(src,0,0,c.width,c.height);stPhotos.unshift(c.toDataURL('image/jpeg',.72));if(stPhotos.length>9)stPhotos.length=9});stFl.style.transition='none';stFl.style.opacity=.9;void stFl.offsetWidth;stFl.style.transition='opacity .45s';stFl.style.opacity=0;stTry(()=>{beep(2400,.03,.08);setTimeout(()=>beep(1800,.05,.06),60)});toast('Photo saved to Camera')}
stCamX.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const b=e.target&&e.target.closest?e.target.closest('[data-c]'):null;if(b&&b.getAttribute('data-c')==='s')stShot();else stCamOff()},{passive:false});
// ----- per-frame -----
let stT2=0,stCallT=0;
function stTick1(){const t=stEl('stpT');if(t)t.textContent=stClk();const si=stEl('stpSI');if(si)si.innerHTML=stStat+stBat()}
let stLastNow=performance.now();
MODS.push(function stPhoneFrame(dt){const now=performance.now(),rdt=Math.min(.25,Math.max(0,(now-stLastNow)/1000));stLastNow=now;
 for(let i=stPend.length-1;i>=0;i--)if(stPend[i].at<=now){const p=stPend.splice(i,1)[0];stTry(p.fn)}
 if(stNbT>0){stNbT-=rdt;if(stNbT<=0)stNB.classList.remove('on')}
 if(stPhNbT>0){stPhNbT-=rdt;if(stPhNbT<=0)stEl('stpNB').classList.remove('on')}
 if(stPhOpen){fireId=null;burstN=0}
 const c=stCallO;if(c){c.t+=rdt;stCallT-=rdt;if(stCallT<=0){stCallT=.5;stDI();const e=stEl('stpCT');if(e&&c.st==='live')e.textContent=Math.floor(c.t/60)+':'+String(Math.floor(c.t%60)).padStart(2,'0')}
  if(c.dir==='in'&&c.st==='ring'&&c.t>16)stDecline();
  if(c.dir==='out'&&c.st==='dial'&&c.t>1.8){c.st='live';c.t=0;stLogCall(c.id,'out');if(c.opMsg){c.lines=['The number you have dialed is not in service. Please check the number and try again.']}else{const r=c.act?c.act():{lines:['Hello?']};c.lines=r.lines;c.after=r.after||null}stRender();setTimeout(stCallLine,200)}}
 stT2-=dt;if(stT2<=0){stT2=1;if(stPhOpen){stTick1();if(stApp==='home')stHomeDraw()}
  if(state==='play'){stEventsTick();
   if(stS.play>stC.nextPro){stC.nextPro=stS.play+80+Math.random()*90;if(stS.play>200)stProactive()}
   if(stS.play>stC.nextFeed){stC.nextFeed=stS.play+45+Math.random()*60;const a=stAmb[Math.floor(Math.random()*stAmb.length)];stPost(a[0],a[1]);if(stPhOpen&&stApp==='chirp')stRender()}
   if(stS.play>stC.nextCall&&!stCallO&&!stPhOpen&&!stS.h){stC.nextCall=stS.play+260+Math.random()*240;if(stS.play>300)stRandomCall()}}}});
// ----- intro call from the fixer (instead of a plain text) -----
function stIntroCall(){if(stS.sent.hi)return;stS.sent.hi=1;stStore();stIncoming('vee',['Heard you are making noise in Block City.','I put crews together for real money. Banks, jewels, the works.','When you want in, call me, or text me from your phone.'],()=>{stMsg('vee','Saved my number. Text me "job" when you are ready.')})}

{const stOP0=stOpenPan;stOpenPan=function(h,cb){if(stPhOpen)stClosePhone();stOP0(h,cb)}}
function stPrice(P){return Math.round(P.p*(stS.disc||1))}
function stIconUpd(P){if(!P.ic)return;const o=stOwn(P);P.ic.label=(o?'':'For sale: ')+P.n;P.ic.color=o?(P.k==='biz'?'#0a84ff':'#34c759'):'#ffd23f';P.ic.glyph=o?(P.k==='biz'?'$':'\u2302'):'$';if(o)stTry(()=>{mpReveal(P.x,P.z,30);mpDirty=true})}

// ----- heists -----
const stRoleKeys={Driver:['rico','dee'],Gunman:['mara','tug'],Hacker:['pixel','lenny']};
let stPl={loud:true,d:'dee',g:'tug',h:'lenny'};
function stPlan(){if(stS.done>=3){toast('All heists done');return}const i=stS.done,H=stHeist()[i];
 const draw=()=>{let cut=0,h='<div class="st-h" style="font-size:19px;color:#ffd23f">HEIST: '+H.n.toUpperCase()+'</div><div class="st-s">'+H.d+' &middot; Take '+stM(H.take*(stPl.loud?1:1.15))+'</div><div style="margin-top:6px">'+stBtn('ap:1','Loud'+(stPl.loud?' &#10003;':''),stPl.loud?'':'g')+stBtn('ap:0','Quiet'+(stPl.loud?'':' &#10003;'),stPl.loud?'g':'')+'<span class="st-s"> '+(stPl.loud?'Fast, more heat':'One more setup job, bigger take, less heat')+'</span></div>';
  for(const r of['Driver','Gunman','Hacker']){const key=r[0].toLowerCase();h+='<div style="display:flex;gap:6px;margin-top:6px">';for(const id of stRoleKeys[r]){const c=stCrew[id],on=stPl[key]===id;if(on)cut+=c.cut;h+='<div data-k="cr:'+key+':'+id+'" class="st-row" style="flex:1;margin:0;border:2px solid '+(on?'#ffd23f':'transparent')+'">'+stAv(c.c,c.n,28)+'<div><div style="font-weight:700">'+c.n+'</div><div class="st-s">'+r+' '+'&#9733;'.repeat(c.s)+' &middot; '+c.cut+'% cut</div></div></div>'}h+='</div>'}
  h+='<div class="st-s" style="margin-top:8px">Crew takes '+cut+'%. Your share about <b style="color:#6dff8a">'+stM(H.take*(stPl.loud?1:1.15)*(1-cut/100))+'</b></div>'+stBtn('go','START SETUP')+stBtn('x','Not now','g');stOpenPan(h,cb)};
 const cb=k=>{if(k==='x'){stClosePan();return}if(k.indexOf('ap:')===0){stPl.loud=k==='ap:1';draw();return}if(k.indexOf('cr:')===0){const p=k.split(':');stPl[p[1]]=p[2];draw();return}
  if(k==='go'){stClosePan();stS.h={i:i,loud:stPl.loud,crew:{d:stPl.d,g:stPl.g,h:stPl.h},stage:'car'};stStore();stSetup();stSay('vee','First we need wheels. Steal something and park it by the target.')}};draw()}
let stH=null; // runtime heist data
const stBeam=new THREE.Mesh(new THREE.CylinderGeometry(2,2,60,18,1,true),new THREE.MeshBasicMaterial({color:0xff5cf0,transparent:true,opacity:.3,depthWrite:false,toneMapped:false}));stBeam.visible=false;scene.add(stBeam);
const stRing=document.createElement('div');stRing.className='st-p';stRing.style.cssText='left:50%;top:22%;width:96px;height:96px;margin-left:-48px;border-radius:50%;display:none;align-items:center;justify-content:center;pointer-events:none;z-index:30;font-weight:900;font-size:14px;text-shadow:0 1px 3px #000';document.body.appendChild(stRing);
const stObj=document.createElement('div');stObj.className='st-p';stObj.style.cssText='left:50%;top:calc(env(safe-area-inset-top,0px) + 96px);transform:translateX(-50%);padding:6px 12px;border-radius:11px;background:#000a;border-left:3px solid #ff5cf0;font-size:12.5px;font-weight:700;pointer-events:none;display:none;z-index:6;max-width:70%;text-align:center';document.body.appendChild(stObj);
function stSetup(){const h=stS.h;if(!h||h.stage==='plan'){stH=null;return}const H=stHeist()[h.i];const tg=stTry(()=>cpPlaces.find(p=>p.type===H.type),null);
 if(!tg){stH=null;return}const good=stCrew[h.crew.d].s>=3,want=good?190:320;let drop=null,bd=1e9;for(let a=0;a<=N;a++)for(let b=0;b<=N;b++){const x=roadCenter(a),z=roadCenter(b),e=Math.abs(Math.hypot(x-tg.x,z-tg.z)-want);if(e<bd){bd=e;drop={x:x,z:z}}}
 let gear=null;bd=1e9;for(let a=0;a<=N;a++)for(let b=0;b<=N;b++){const x=roadCenter(a),z=roadCenter(b),e=Math.abs(Math.hypot(x-tg.x,z-tg.z)-130);if(e<bd){bd=e;gear={x:x,z:z}}}
 stH={tg:tg,park:{x:tg.x,z:tg.z-9.5},door:{x:tg.x,z:tg.z-3},drop:drop,gear:gear,t:0,crew:[],take:H.take*(h.loud?1:1.15),lost:0,car:null,miss:0,hit:0,sayT:0,pt:null}}
function stMate(id,dx){const c=stCrew[id],g=makePerson(new THREE.Color(c.c),0x20242c,[0xf1c27d,0xc68642,0x8d5524][Math.floor(Math.random()*3)]);stTry(()=>{g.userData.gun.visible=true});g.position.set(pos.x+dx,.3,pos.z+2);scene.add(g);return {id:id,g:g,hp:100,down:false,cd:1,w:0,dx:dx}}
function stClearCrew(){if(stH){for(const m of stH.crew)scene.remove(m.g);stH.crew=[]}}
function stAbort(msg){stClearCrew();stS.h=null;stH=null;stRing.style.display='none';stGameEnd();stBeam.visible=false;stObj.style.display='none';if(stWayMine){stTry(()=>{mpWay=null;mpDirty=true});stWayMine=null}stStore();if(msg)toast(msg)}
function stFail(why){const h=stS.h;if(!h)return;stClearCrew();stRing.style.display='none';stGameEnd();h.stage='meet';stSetup();stStore();stTry(()=>cpBanner('HEIST FAILED','#ff5252',why+'. Meet the crew to try again',3.5));stMsg('vee','That went sideways. Regroup at the target when the heat dies down.')}
// vault mini-game
const stGame=document.createElement('div');stGame.className='st-p';stGame.style.cssText='left:0;top:0;right:0;bottom:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:#000b;z-index:75';document.body.appendChild(stGame);
let stG=null;
function stGameStart(){const s=stCrew[stS.h.crew.h].s,w=s>=3?.3:.17;stG={w:w,c:.5,hit:0,miss:0,ph:Math.random()*6,sp:s>=3?2.1:2.9};stGame.style.display='flex';stPause('stgame');stGameDraw()}
function stGameEnd(){stG=null;stGame.style.display='none';stResume('stgame')}
function stGamePos(){return (Math.sin(T*stG.sp+stG.ph)+1)/2}
function stGameDraw(){const g=stG,x=stGamePos();stGame.innerHTML='<div class="st-h" style="font-size:20px;color:#3ddcff">CRACK THE SAFE</div><div class="st-s" style="margin:4px 0 14px">Tap when the bar is inside the green zone &middot; '+g.hit+' / 3</div><div style="position:relative;width:min(380px,80%);height:34px;border-radius:10px;background:#1d2530;border:1px solid #fff4;overflow:hidden"><div style="position:absolute;top:0;bottom:0;left:'+((g.c-g.w/2)*100)+'%;width:'+(g.w*100)+'%;background:#2ecc71"></div><div style="position:absolute;top:-2px;bottom:-2px;left:'+(x*100)+'%;width:5px;margin-left:-2px;background:#fff;box-shadow:0 0 8px #fff"></div></div><div class="st-s" style="margin-top:12px">Misses raise the alarm</div>'}
function stGameTap(){const g=stG;if(!g)return;const x=stGamePos();if(Math.abs(x-g.c)<=g.w/2){g.hit++;beep(1400+g.hit*200,.1,.12);g.c=.2+Math.random()*.6;g.ph=Math.random()*6;if(g.hit>=3){stGameEnd();stS.h.stage='grab';stH.t=0;stSay(stS.h.crew.h,'We are in. Bag it!');return}}else{g.miss++;stH.miss++;beep(220,.2,.14);if(g.miss===2){stTry(()=>cpStars(2));stSay(stS.h.crew.h,'That tripped something. Hurry.')}}stGameDraw()}
stGame.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();stGameTap()},{passive:false});
function stPayout(){const h=stS.h,H=stHeist()[h.i];let take=Math.round((stH.take-stH.lost)/10)*10,rows='',cut=0;for(const k of['d','g','h']){const c=stCrew[h.crew[k]],m=stH.crew.find(q=>q.id===h.crew[k]),down=m&&m.down,a=down?0:Math.round(take*c.cut/100);cut+=a;rows+=stRow(stAv(c.c,c.n,28),c.n,c.r+(down?' &middot; went down':' &middot; '+c.cut+'%'),'<b style="color:'+(down?'#ff8a80':'#fff')+'">'+(down?'$0':stM(a))+'</b>')}
 const mine=take-cut;cash+=mine;stTx(H.n+' payout',mine);stS.done=Math.max(stS.done,h.i+1);stClearCrew();stS.h=null;stH=null;stBeam.visible=false;stObj.style.display='none';if(stWayMine){stTry(()=>{mpWay=null;mpDirty=true});stWayMine=null}wantedScore=0;evade=0;stStore();
 stOpenPan('<div class="st-h" style="font-size:22px;color:#6dff8a">HEIST PASSED</div><div class="st-s">'+H.n+' &middot; Total take '+stM(take)+(stH0lost?' (lost '+stM(stH0lost)+' on the way)':'')+'</div>'+rows+'<div class="st-row" style="background:#1e5631"><div style="flex:1;font-weight:800">YOUR SHARE</div><b style="font-size:18px;color:#6dff8a">'+stM(mine)+'</b></div>'+stBtn('x','NICE'),()=>stClosePan());
 stTry(()=>msJingle&&msJingle(true));if(stS.done<3)setTimeout(()=>stMsg('vee','Clean work. I have something bigger when you are ready: '+stHeist()[stS.done].n+'.'),4000);else setTimeout(()=>stMsg('vee','The Big One is done. Nobody in Block City has ever pulled that off.'),4000)}
let stH0lost=0;
function stHeistTick(dt){const h=stS.h;if(!h||h.stage==='plan')return;if(!stH){stSetup();if(!stH)return}const S=stH,tg=S.tg,inside=stTry(()=>cpIn===tg,false),dTo=p=>Math.hypot(p.x-pos.x,p.z-pos.z);
 let mk=null;const st=h.stage;
 if(st!=='car'&&st!=='scout'&&st!=='gear'&&st!=='meet'){if(state==='dead'){stFail('You went down');return}if(state==='cpbust'){stFail('You got busted');return}}
 if(state!=='play')return;
 if(st==='car'){mk=S.park;if(driving&&!driving.custom&&!driving.vhT&&dTo(mk)<5.5&&Math.abs(driving.speed)<4){S.car=driving;driving.speed=0;driving=null;player.visible=true;pos.set(mk.x+3,.3,mk.z);collide(pos,.6);h.stage='scout';stStore();toast('Getaway car in place');stSay(h.crew.d,stCrew[h.crew.d].s>=3?'I can make that thing fly.':'It has wheels. Should be fine.')}}
 else if(st==='scout'){mk=S.door;if(dTo(mk)<6){S.t+=dt;if(S.t>3){S.t=0;h.stage=h.loud?'meet':'gear';stStore();toast('Target scouted');stSay(h.crew.h,h.loud?'One camera, one guard. Easy.':'I need the gear bag before we go quiet.')}}else S.t=0}
 else if(st==='gear'){mk=S.gear;if(dTo(mk)<5){h.stage='meet';stStore();toast('Gear collected');stSay(h.crew.g,'Got the masks. Meet you at the door.')}}
 else if(st==='meet'){mk=S.door;if(dTo(mk)<7&&!driving){S.crew=[stMate(h.crew.g,-1.8),stMate(h.crew.h,1.8)];S.lost=0;S.miss=0;h.stage='enter';stSay(h.crew.g,'Masks on. Follow my lead.');stSay('vee','Driver is waiting at the drop. Make it quick.')}}
 else if(st==='enter'){mk=S.door;tg.cool=0;if(inside){h.stage='ctrl';S.t=0;stSay(h.crew.g,h.loud?'EVERYBODY DOWN!':'Nice and calm. Nobody look up.')}}
 else if(st==='ctrl'){if(!inside){h.stage='enter';return}S.t+=dt;if(h.loud?(fireId!==null||burstN>0||stTry(()=>T-cpShotAt<.5,false)||S.t>9):S.t>4){stTry(()=>cpStars(h.loud?2:1));stGameStart();h.stage='vault'}}
 else if(st==='vault'){if(!stG){stGameStart()}}
 else if(st==='grab'){if(!inside){stRing.style.display='none';h.stage='enter';toast('Get back inside!');return}S.t+=dt;const dur=[8,11,15][h.i]*(stCrew[h.crew.g].s>=3?.7:1),f=Math.min(1,S.t/dur),deg=Math.round(f*360);stRing.style.display='flex';stRing.style.background='conic-gradient(#ff5cf0 '+deg+'deg,#0009 '+deg+'deg)';stRing.textContent=stM(Math.round(S.take*f/100)*100);
  if(f>=1){stRing.style.display='none';stTry(()=>cpStars((h.loud?[3,4,5]:[1,2,3])[h.i]+(S.miss>=2?1:0)));h.stage='exit';stSay(h.crew.g,'Bags are full. MOVE!');stTry(()=>cpBanner('GOT IT','#ff5cf0','Get to the drop-off',2.2))}}
 else if(st==='exit'){if(!inside&&!stTry(()=>!!cpIn,false)){h.stage='escape';stSay(h.crew.d,stCrew[h.crew.d].s>=3?'Short run. I am two blocks from the freeway.':'I am... kind of far. Sorry.');if(S.car&&!S.car.dead&&stCrew[h.crew.d].s>=3)S.car.m.userData.max=58}}
 else if(st==='escape'){mk=S.drop;if(dTo(mk)<8){stH0lost=S.lost;stPayout();return}}
 // marker + objective
 if(mk){stBeam.visible=true;stBeam.position.set(mk.x,30,mk.z);if(!stWayMine||stWayMine.x!==mk.x||stWayMine.z!==mk.z||(stTry(()=>mpWay,1)===null&&dTo(mk)>14))stWay(mk.x,mk.z)}else stBeam.visible=false;
 stObj.style.display='block';const txt='HEIST &middot; '+stStageText()+(mk?' &middot; '+Math.round(dTo(mk))+' m':'');if(stObj._t!==txt){stObj.innerHTML=txt;stObj._t=txt}
 // crew AI
 const hostile=[];for(const s of shooters)if(!s.dead&&(s.aggro||(s.kind==='cop'&&wanted>0)))hostile.push(s);
 for(const m of S.crew){const g=m.g;if(m.down)continue;const a=facing,tx=pos.x+Math.cos(a)*m.dx+Math.sin(a)*2.2,tz=pos.z-Math.sin(a)*m.dx+Math.cos(a)*2.2,dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);let sp=0;
  if(d>45||(inside&&Math.abs(g.position.x-pos.x)>30)||(!inside&&g.position.x>2500)){g.position.set(tx,.3,tz)}else if(d>.6){sp=Math.min(driving?30:8.5,d*3);g.position.x+=dx/d*sp*dt;g.position.z+=dz/d*sp*dt;g.rotation.y=Math.atan2(-dx,-dz);if(!inside)collide(g.position,.45)}
  g.visible=!driving;m.w+=dt*sp*1.5;animLimbs(g,sp,m.w);
  let best=null,bd=32;for(const s of hostile){const q=Math.hypot(s.g.position.x-g.position.x,s.g.position.z-g.position.z);if(q<bd){bd=q;best=s}}
  if(best&&!driving){g.userData.armR.rotation.x=Math.PI/2;if(sp<1)g.rotation.y=Math.atan2(-(best.g.position.x-g.position.x),-(best.g.position.z-g.position.z));m.cd-=dt;if(m.cd<=0){const sk=stCrew[m.id].r==='Gunman'?stCrew[m.id].s:1;m.cd=sk>=3?.55:1.1;const o=g.position.clone().setY(1.8),e=best.g.position.clone().setY(1.5);tracer(o,e);sfx(.16,2000,.3,g.position);if(Math.random()<(sk>=3?.7:.4)){best.hp-=1.2;best.aggro=true;if(best.hp<=0)killShooter(best,g.position)}}
   if(Math.random()<dt*.07){m.hp-=34;if(m.hp<=0){m.down=true;g.rotation.x=-Math.PI/2;const loss=Math.round(S.take*.12);S.lost+=loss;stSay(m.id,'I am hit! Go, go!');toast(stCrew[m.id].n+' is down. Lost '+stM(loss))}}}}}
// ----- main tick -----
let stT1=0,stMsgT=25;
MODS.push(function(dt){
 if(stSubT>0){stSubT-=dt;if(stSubT<=0)stSub.style.opacity=0}else if(stSubQ.length){stSub.innerHTML=stSubQ.shift();stSub.style.opacity=1;stSubT=3.4}
 if(stG)stGameDraw();
 if(state==='play'){stS.play+=dt;for(const P of stProps)if(P.k==='biz'&&stOwn(P))stS.inc[P.id]=Math.min(P.cap,(stS.inc[P.id]||0)+P.inc*dt/60)}
 stHeistTick(dt);
 stT1-=dt;if(stT1<=0){stT1=.25;
  if(!stIconsDone)stTry(()=>{for(const P of stProps)if(P.x!==undefined){P.ic={x:P.x,z:P.z,label:'',color:'',glyph:''};stIconUpd(P);mpIcons.push(P.ic)}stIconsDone=true});
  const inP=stTry(()=>cpIn&&cpIn.st,null);
  for(const P of stProps){if(P.x===undefined)continue;const o=stOwn(P);P.ring.material.color.setHex(o?0x6dff8a:0xffd23f);const d=Math.hypot(pos.x-P.x,pos.z-P.z);if(d>4&&!inP&&!stTry(()=>!!cpIn||!!cpSeq,false))P.away=true;
   if(state==='play'&&!driving&&d<1.5&&P.away&&!stTry(()=>!!cpIn,false)){P.away=false;if(o)stEnterProp(P);else stOpenPan('<div class="st-h" style="font-size:20px;color:'+(P.k==='biz'?'#6fb1ff':'#ff8a80')+'">FOR SALE</div><div style="font-size:17px;font-weight:800;margin-top:2px">'+P.n+'</div><div class="st-s">'+P.d+(P.k==='biz'?' (collect up to '+stM(P.cap)+')':' &middot; heal, save, wardrobe, heist board')+'</div><div style="margin-top:6px">Price <b style="color:#6dff8a">'+stM(stPrice(P))+'</b> &nbsp; You have '+stM(cash)+'</div>'+stBtn('buy','BUY')+stBtn('x','Leave','g'),k=>{stClosePan();if(k==='buy'&&stBuy(P))stEnterProp(P)})}}
  stIn.style.display=(state==='play'&&(inP||stTry(()=>cpIn&&cpIn.type==='safe'&&cpSave.own,false)))?'flex':'none';
  if(stS.play>stMsgT){stMsgT+=90;if(!stS.sent.hi&&!stCallO&&!stPhOpen)stIntroCall();if(stS.play>120)stOnce('re','agent','New listings in the Property app: houses from $18,000 and businesses that pay you while you play.');if(stS.play>300&&stS.done===0)stOnce('nag','vee','Still waiting on that call. The Corner Job is an easy $25k.');if(stS.play%180<1)stStore()}}});
// in-property action bar
const stIn=document.createElement('div');stIn.className='st-p';stIn.style.cssText='left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 150px);transform:translateX(-50%);display:none;gap:6px;z-index:9';stIn.innerHTML=stBtn('board','HEIST BOARD')+stBtn('wear','WARDROBE','g')+stBtn('save','SAVE','g');document.body.appendChild(stIn);
stIn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const b=e.target&&e.target.closest?e.target.closest('[data-k]'):null;if(!b||state!=='play')return;const k=b.getAttribute('data-k');if(k==='board'){if(stS.h&&stS.h.stage!=='plan')toast('Heist in progress: '+stStageText());else stPlan()}else if(k==='wear')stWear();else{stStore();toast('Game saved')}},{passive:false});
if(stS.h)stSetup();

// ---------- account: sign in with an emailed 6-digit code, cloud saves that follow the player (module prefix: ac) ----------
// Backend: Supabase (Auth email OTP + one table "profiles" protected by Row Level Security). Setup: docs/ACCOUNT_SETUP.md.
// Only the project URL and the anon (publishable) key go here; both are meant to be public. Never put any other key in this file.
const acCfg={url:'',anon:''};
const acBIG=999999999,acSKEY='bcacct_session',acMKEY='bcacct_meta',acBKEY='bcacct_backup',acPFX='blockcity_',acLIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
const acDevKeys=['q','auto','rot','lh','fps','hint'];   // settings that belong to one device (screen and layout); they are not copied between devices
let acLibP=null,acCl=null,acInitP=null,acUser=null,acAdmin=false,acReal=0,acOpen=false,acView='email',acMsg='',acMsgBad=false,acBusy=false,acEmail='',acCodeV='',acSendAt=0,acSends=[],acTries=0,acConf=null,acSt='off',acPushT=0,acLastPush=-1e9,acRetry=0,acRetryT=0,acDelC=0,acPushing=false,acAgain=false,acKeepUntil=0,acFrozen=false,acGot=false,acNoPersist=false,acCloudT=0,acSyncing=false,acMetaT=0;
const acOK=()=>!!(acCfg.url&&acCfg.anon);
// ----- storage: may be blocked or partitioned inside a third-party iframe (Sekai) -----
const acLS=(function(){try{const k='bcacct_t';localStorage.setItem(k,'1');const ok=localStorage.getItem(k)==='1';localStorage.removeItem(k);return ok}catch(e){return false}})();
const acFramed=(function(){try{return window.top!==window.self}catch(e){return true}})();
const acMem={};
const acStore={getItem:k=>{if(acLS){try{return localStorage.getItem(k)}catch(e){}}return acMem[k]===undefined?null:acMem[k]},setItem:(k,v)=>{acMem[k]=String(v);if(acLS){try{localStorage.setItem(k,v)}catch(e){acNoPersist=true}}},removeItem:k=>{delete acMem[k];if(acLS){try{localStorage.removeItem(k)}catch(e){}}}};
let acMeta={play:0,t:0,h:'',uid:'',syncAt:'',syncHash:''};try{Object.assign(acMeta,JSON.parse(localStorage.getItem(acMKEY)||'{}'))}catch(e){}
try{const a=JSON.parse(localStorage.getItem('bcacct_sent')||'[]');if(Array.isArray(a)){acSends=a.filter(t=>t>0&&t<=Date.now()&&Date.now()-t<900000);acSendAt=acSends.length?Math.max.apply(null,acSends):0}}catch(e){}
function acMetaSave(){try{localStorage.setItem(acMKEY,JSON.stringify(acMeta))}catch(e){}}
// ----- the save bundle: every blockcity_* key of the local save -----
const acCash=()=>acAdmin?acReal:cash;
function acLive(){return JSON.stringify({v:1,cash:acCash(),ammo:[WEAP[1].ammo,WEAP[2].ammo,WEAP[3].ammo],kills:kills,passed:typeof msPassed!=='undefined'?msPassed:0,best:typeof msBest!=='undefined'?msBest:0})}
function acKeys(){const o={};if(!acLS){o[acPFX+'save']=acLive();return o}
 try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf(acPFX)===0){const v=localStorage.getItem(k);if(v!==null&&v.length<300000)o[k]=v}}}catch(e){}return o}
function acNorm(k,v){if(k!==acPFX+'settings')return v;try{const o=JSON.parse(v);for(const d of acDevKeys)delete o[d];return JSON.stringify(o)}catch(e){return v}}
function acHash(keys){const n=Object.keys(keys||{}).sort();let h=5381,c=0;for(const k of n){if(k===acPFX+'hints')continue;const s=k+'='+acNorm(k,String(keys[k]))+';';for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;c+=s.length}return h+':'+c}
function acLocalHash(){const h=acHash(acKeys());if(h!==acMeta.h){acMeta.h=h;acMeta.t=Date.now();acMetaSave()}return h}
const acDev=()=>((navigator.maxTouchPoints||0)>0&&Math.min(screen.width,screen.height)<700)?'phone':'computer';
function acBundle(){const b={v:1,t:acMeta.t||Date.now(),play:Math.round(acMeta.play||0),cash:acCash(),dev:acDev(),keys:acKeys()};
 try{if(JSON.stringify(b).length>800000)delete b.keys[acPFX+'map']}catch(e){}return b}
function acInfo(b){let c=0;try{c=(b&&typeof b.cash==='number')?b.cash:(JSON.parse(b.keys[acPFX+'save']).cash|0)}catch(e){}return {cash:c,t:b&&b.t||0,play:b&&b.play||0,dev:b&&b.dev||''}}
// ----- wrap the local save: the admin perk never reaches the saved cash; every local save also schedules a cloud save -----
{const old=msSave;msSave=function(){if(acFrozen)return;if(acAdmin){if(cash<acBIG/2)acReal=Math.max(0,cash|0);const c=cash;cash=acReal;try{old()}finally{cash=c<acBIG/2?acBIG:c}}else old();acTouch()}}
function acTouch(){if(acFrozen)return;const now=Date.now();if(now-acMetaT>8000){acMetaT=now;acMetaSave()}if(!acUser||acConf)return;if(acLocalHash()!==acMeta.syncHash)acSchedule()}
function acSchedule(){if(acPushT||!acUser)return;acPushT=setTimeout(()=>{acPushT=0;acPush()},Math.max(1500,15000-(Date.now()-acLastPush)))}
function acSetAdmin(on){on=!!on;if(on&&!acAdmin){acReal=Math.max(0,cash|0);acAdmin=true;cash=acBIG}else if(!on&&acAdmin){acAdmin=false;cash=acReal}document.body.classList.toggle('ac-inf',acAdmin)}
MODS.push(function acTick(dt){if(acAdmin&&cash!==acBIG){if(cash<acBIG/2)acReal=Math.max(0,cash|0);cash=acBIG}if(state==='play')acMeta.play=(acMeta.play||0)+dt});
// ----- plain words for errors -----
function acPlain(e){const m=String(e&&(e.message||e.error_description||e.msg||e.code)||e||'').toLowerCase(),st=e&&e.status;try{console.log('account:',m)}catch(x){}
 if(/failed to fetch|networkerror|network request|load failed|timed out|timeout|could not load/.test(m))return 'No connection. Check the internet and try again.';
 if(st===429||/rate limit|too many|security purposes/.test(m))return 'Too many tries just now. Wait a minute and try again.';
 if(/expired|invalid.*(token|otp|code)|otp/.test(m))return 'That code is wrong or has expired. Check it or send a new one.';
 if(/signups? not allowed|signup.*disabled/.test(m))return 'New accounts are switched off right now.';
 if(/email.*invalid|invalid.*email|validate email/.test(m))return 'That email address does not look right.';
 if(/error sending|smtp|sending.*email/.test(m))return 'The code email could not be sent. Try again in a few minutes.';
 if(st===401||/jwt|not authenticated|refresh token|session/.test(m))return 'Your sign-in ran out. Please sign in again.';
 if(/permission denied|row-level|42501/.test(m))return 'The server refused that change.';
 return 'Something went wrong. Please try again.'}
const acIsNet=e=>/connection/i.test(acPlain(e)),acIsAuth=e=>/sign-in ran out/.test(acPlain(e));
// ----- supabase-js, loaded only when needed -----
function acLib(){if(acLibP)return acLibP;acLibP=new Promise((res,rej)=>{if(window.__acLib){res(window.__acLib);return}if(window.supabase&&window.supabase.createClient){res(window.supabase);return}
  const s=document.createElement('script'),to=setTimeout(()=>rej(new Error('could not load')),15000);s.src=acLIB;s.async=true;
  s.onload=()=>{clearTimeout(to);if(window.supabase&&window.supabase.createClient)res(window.supabase);else rej(new Error('could not load'))};s.onerror=()=>{clearTimeout(to);rej(new Error('could not load'))};document.head.appendChild(s)});
 acLibP.catch(()=>{acLibP=null});return acLibP}
function acFetch(u,o){o=o||{};if(Date.now()<acKeepUntil&&(!o.body||String(o.body).length<60000))o=Object.assign({},o,{keepalive:true});return fetch(u,o)}
function acInit(){if(acInitP)return acInitP;if(!acOK())return Promise.reject(new Error('not set up'));
 acInitP=acLib().then(lib=>{acCl=lib.createClient(acCfg.url,acCfg.anon,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storageKey:acSKEY,storage:acStore},global:{fetch:acFetch}});return acCl.auth.getSession()})
  .then(r=>{const s=r&&r.data&&r.data.session;acUser=s&&s.user?s.user:null;if(acUser)acSync(false);return acCl});
 acInitP.catch(()=>{acInitP=null;acCl=null});return acInitP}
function acSetSt(s){acSt=s;acChipSync();if(acOpen&&(acView==='profile'||acView==='conflict'))acRender()}
// ----- sync -----
function acFail(e){if(acIsAuth(e)){acDrop('Your sign-in ran out. Please sign in again.');return}acSetSt('offline');acRetry=Math.min(60,acRetry?acRetry*2:5);clearTimeout(acRetryT);acRetryT=setTimeout(acResync,acRetry*1000)}
function acResync(){clearTimeout(acRetryT);acRetryT=0;if(!acUser||!acCl||acConf)return;if(!acGot)acSync(false);else if(acLocalHash()!==acMeta.syncHash)acPush();else acSetSt('synced')}
function acMark(row,h){acMeta.uid=acUser?acUser.id:'';acMeta.syncAt=row&&row.updated_at||'';acMeta.syncHash=h;acCloudT=row&&row.updated_at?Date.parse(row.updated_at):Date.now();acMetaSave()}
function acSync(interactive){if(!acCl||!acUser||acSyncing)return;acSyncing=true;acSetSt('loading');const uid=acUser.id;
 Promise.resolve().then(()=>acCl.from('profiles').select('save,is_admin,updated_at').eq('id',uid).maybeSingle()).then(r=>{acSyncing=false;if(r&&r.error)throw r.error;if(!acUser||acUser.id!==uid)return;
  const row=r&&r.data;acGot=true;acRetry=0;acSetAdmin(row&&row.is_admin===true);const lh=acLocalHash();
  if(!row||!row.save||!row.save.keys){acPush();return}
  const ch=acHash(row.save.keys),same=acMeta.uid===uid;
  if(ch===lh){acMark(row,lh);acSetSt('synced');return}
  if(same&&acMeta.syncAt===row.updated_at){acPush();return}                       // the cloud copy is the one this device last wrote or read: just save
  let fresh=false;try{fresh=acLS&&localStorage.getItem(acPFX+'save')===null}catch(e){}
  const quiet=fresh||(same&&lh===acMeta.syncHash);                                 // nothing new on this device: the cloud copy is simply newer
  let looped=false;try{looped=Date.now()-(+sessionStorage.getItem('bcacct_rl')||0)<20000}catch(e){}
  if(quiet&&!looped&&(state==='ready'||acOpen)){acApply(row);return}
  acConf={row:row,quiet:quiet};acSetSt('conflict');if(acOpen){acView='conflict';acRender()}
 }).catch(e=>{acSyncing=false;acFail(e)})}
function acPush(){if(!acCl||!acUser||acConf||acFrozen)return;if(acPushing){acAgain=true;return}clearTimeout(acPushT);acPushT=0;
 const b=acBundle(),h=acHash(b.keys),uid=acUser.id;acPushing=true;acSetSt('saving');
 Promise.resolve().then(()=>acCl.from('profiles').update({save:b}).eq('id',uid).select('updated_at')).then(r=>{if(r&&r.error)throw r.error;if(r&&r.data&&r.data.length)return r.data[0];
   return acCl.from('profiles').insert({id:uid,save:b}).select('updated_at').then(r2=>{if(r2&&r2.error)throw r2.error;return r2&&r2.data&&r2.data[0]})})
  .then(row=>{acPushing=false;acLastPush=Date.now();acRetry=0;acGot=true;if(!acUser||acUser.id!==uid)return;acMark(row,h);acSetSt('synced');if(acAgain||acLocalHash()!==h){acAgain=false;acSchedule()}})
  .catch(e=>{acPushing=false;acAgain=false;acFail(e)})}
function acFlush(){acMetaSave();if(!acUser||!acCl||acConf||acFrozen)return;if(acLocalHash()!==acMeta.syncHash){acKeepUntil=Date.now()+4000;acPush()}}
addEventListener('pagehide',acFlush);document.addEventListener('visibilitychange',()=>{if(document.hidden)acFlush()});addEventListener('online',()=>{if(acSt==='offline')acResync()});
// take the cloud copy: back up this device's save first, then restart the game so every module reads the new save
function acApply(row){const b=row.save,keys=Object.assign({},b.keys||{});acConf=null;
 try{localStorage.setItem(acBKEY,JSON.stringify({t:Date.now(),keys:acKeys()}))}catch(e){try{const k=acKeys();delete k[acPFX+'map'];localStorage.setItem(acBKEY,JSON.stringify({t:Date.now(),keys:k}))}catch(x){}}
 if(!acLS){try{const d=JSON.parse(keys[acPFX+'save']||'null');if(d){const c=Math.max(0,d.cash|0);if(acAdmin)acReal=c;else cash=c;if(d.ammo)for(let k=0;k<3;k++)if(d.ammo[k]>=0)WEAP[k+1].ammo=d.ammo[k]|0;kills=d.kills|0;if(typeof msPassed!=='undefined'){msPassed=d.passed|0;msBest=d.best|0}}}catch(e){}
  acMeta.play=b.play||acMeta.play;acMeta.h=acHash(acKeys());acMark(row,acMeta.h);acSetSt('synced');if(acOpen){acView='profile';acRender()}return}
 try{const loc=JSON.parse(localStorage.getItem(acPFX+'settings')||'null');if(loc&&keys[acPFX+'settings']){const c=JSON.parse(keys[acPFX+'settings']);for(const d of acDevKeys){if(loc[d]!==undefined)c[d]=loc[d];else delete c[d]}keys[acPFX+'settings']=JSON.stringify(c)}}catch(e){}
 try{const dead=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf(acPFX)===0&&keys[k]===undefined)dead.push(k)}for(const k of dead)localStorage.removeItem(k);for(const k in keys)localStorage.setItem(k,String(keys[k]))}catch(e){}
 acMeta.play=b.play||0;acMeta.t=b.t||Date.now();acMeta.h=acHash(acKeys());acMark(row,acMeta.h);
 acFrozen=true;try{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).indexOf(acPFX)===0||k===acMKEY)return;return set.call(this,k,v)}}catch(e){}   // nothing may overwrite the new save on the way out
 try{sessionStorage.setItem('bcacct_rl',String(Date.now()))}catch(e){}
 acMsg='Loading your saved game...';acMsgBad=false;acView='wait';if(acOpen)acRender();setTimeout(()=>{try{location.reload()}catch(e){}},350)}
// ----- sign in / out -----
function acSend(){if(acBusy)return;const el=document.getElementById('acEm');if(el)acEmail=el.value.trim();const now=Date.now();
 if(!/^[^@ ]+@[^@ ]+[.][^@ ]+$/.test(acEmail)||acEmail.length>200){acSay('Type your email address first.',true);return}
 if(now-acSendAt<60000){acSay('Please wait '+Math.ceil((60000-(now-acSendAt))/1000)+' seconds before asking for another code.',true);return}
 acSends=acSends.filter(t=>now-t<900000);if(acSends.length>=4){acSay('Too many codes requested. Try again in a few minutes.',true);return}
 acBusy=true;acSay('Sending your code...');
 acInit().then(cl=>cl.auth.signInWithOtp({email:acEmail,options:{shouldCreateUser:true}})).then(r=>{acBusy=false;if(r&&r.error)throw r.error;acSendAt=Date.now();acSends.push(acSendAt);try{localStorage.setItem('bcacct_sent',JSON.stringify(acSends))}catch(x){}acTries=0;acCodeV='';acView='code';acSay('');acFocus('acCode')})
  .catch(e=>{acBusy=false;acSay(acPlain(e),true)})}
function acVerify(){if(acBusy)return;const el=document.getElementById('acCode');if(el)acCodeV=el.value.replace(/[^0-9]/g,'');
 if(acCodeV.length!==6){acSay('Type the 6 numbers from the email.',true);return}if(acTries>=8){acSay('Too many tries. Send a new code.',true);return}
 acTries++;acBusy=true;acSay('Checking...');
 acInit().then(cl=>cl.auth.verifyOtp({email:acEmail,token:acCodeV,type:'email'})).then(r=>{acBusy=false;if(r&&r.error)throw r.error;const d=r&&r.data||{};acUser=d.user||(d.session&&d.session.user)||null;if(!acUser)throw new Error('otp');
   acCodeV='';acGot=false;acConf=null;acNoPersist=acNoPersist||!acLS;if(acLS){try{if(localStorage.getItem(acSKEY)===null)acNoPersist=true}catch(e){acNoPersist=true}}
   acView='profile';acSay('');acSync(true)})
  .catch(e=>{acBusy=false;acCodeV='';const c=document.getElementById('acCode');if(c)c.value='';acSay(acPlain(e),true);acFocus('acCode')})}
function acDrop(msg){clearTimeout(acPushT);acPushT=0;clearTimeout(acRetryT);acRetryT=0;const cl=acCl;acUser=null;acConf=null;acGot=false;acSetAdmin(false);acSt='off';acChipSync();acView='email';acDelC=0;
 try{if(cl)Promise.resolve(cl.auth.signOut({scope:'local'})).catch(()=>{})}catch(e){}acSay(msg||'');if(typeof msSave==='function')msSave()}
function acSignOut(){if(acBusy)return;if(acUser&&acCl&&!acConf&&acLocalHash()!==acMeta.syncHash){acKeepUntil=Date.now()+4000;acPush()}setTimeout(()=>acDrop('Signed out. Your game is still saved on this device.'),acPushing?700:0)}
function acDelete(){if(acBusy||!acUser||!acCl)return;if(!acDelC){acDelC=1;acRender();return}acDelC=0;acBusy=true;acSay('Deleting...');const uid=acUser.id;
 Promise.resolve().then(()=>acCl.rpc('delete_my_account')).then(r=>{if(r&&r.error)return acCl.from('profiles').update({save:null}).eq('id',uid).select('updated_at').then(r2=>{if(r2&&r2.error)throw r2.error})})
  .then(()=>{acBusy=false;acMeta.uid='';acMeta.syncAt='';acMeta.syncHash='';acMetaSave();acDrop('Your account data was deleted. This device still has its own save.')})
  .catch(e=>{acBusy=false;acSay(acPlain(e),true)})}
// ----- panel -----
const acEsc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function acMask(e){e=String(e||'');const i=e.indexOf('@');if(i<1)return 'your email';const d=e.slice(i+1),j=d.lastIndexOf('.');return e.charAt(0)+'&bull;&bull;&bull;@'+d.charAt(0)+'&bull;&bull;&bull;'+(j>0?acEsc(d.slice(j)):'')}
function acAgo(t){if(!t)return 'never';const s=(Date.now()-t)/1000;if(s<60)return 'just now';if(s<3600)return Math.round(s/60)+' min ago';if(s<86400)return Math.round(s/3600)+' h ago';try{return new Date(t).toLocaleDateString()}catch(e){return 'a while ago'}}
function acDur(s){s=Math.round(s||0);const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?h+' h '+m+' min':m+' min'}
const acMoney=c=>'$'+String(Math.round(c||0)).replace(/([0-9])(?=([0-9]{3})+$)/g,'$1,');
const acStTxt={off:'Not connected',loading:'Connecting...',saving:'Saving...',synced:'Saved to your account',offline:'Offline. Will try again by itself.',conflict:'Choose which save to keep'};
{const st=document.createElement('style');st.id='acCss';st.textContent=
 '#acRoot{position:fixed;left:0;top:0;right:0;bottom:0;z-index:150;display:none;align-items:flex-start;justify-content:center;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:calc(var(--st,0px) + 9vh) 12px 16px;box-sizing:border-box;background:rgba(6,8,14,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:#fff;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,Helvetica,Arial,sans-serif;touch-action:manipulation}'
 +'@media (max-height:480px){#acRoot{padding-top:calc(var(--st,0px) + 8px)}}'
 +'.ac-pan{width:min(400px,100%);box-sizing:border-box;border-radius:22px;border:1px solid var(--gb,rgba(255,255,255,.17));padding:16px 16px 14px;background:rgba(18,20,28,.94);box-shadow:0 20px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.1)}'
 +'.ac-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.ac-hd b{font-size:20px;font-weight:900;letter-spacing:1.5px}.ac-x{width:34px;height:34px;border-radius:50%;border:1px solid var(--gb,rgba(255,255,255,.17));display:flex;align-items:center;justify-content:center;font-size:20px;line-height:1;background:rgba(255,255,255,.06)}'
 +'.ac-p{font-size:13px;line-height:1.4;opacity:.82;margin:0 0 12px}.ac-p b{color:var(--ac,#ffd23f);opacity:1}'
 +'.ac-in{display:block;width:100%;height:50px;box-sizing:border-box;border-radius:14px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#fff;font:600 17px/1 inherit;font-family:inherit;padding:0 14px;outline:none;-webkit-appearance:none;appearance:none;-webkit-user-select:text;user-select:text}.ac-in:focus{border-color:var(--ac,#ffd23f)}.ac-in::placeholder{color:rgba(255,255,255,.38)}.ac-code{text-align:center;font-size:26px;font-weight:800;letter-spacing:.42em;text-indent:.42em;font-variant-numeric:tabular-nums}'
 +'.ac-b{display:flex;align-items:center;justify-content:center;height:46px;margin-top:10px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;text-align:center;border:1px solid var(--gb,rgba(255,255,255,.17));background:rgba(255,255,255,.08);box-sizing:border-box;padding:0 12px}.ac-b.ac-go{font-size:14px;color:#14161c;background:linear-gradient(160deg,#ffe27a,#ffb300);border-color:transparent}.ac-b.ac-warn{color:#ff8f85;border-color:rgba(255,99,88,.5)}.ac-b.ac-dim{opacity:.45}.ac-row{display:flex;gap:10px}.ac-row .ac-b{flex:1;font-size:11px;letter-spacing:.5px;padding:0 8px;line-height:1.15}'
 +'.ac-msg{min-height:18px;margin-top:10px;font-size:12.5px;font-weight:700;text-align:center;color:#ffe9a8}.ac-msg.bad{color:#ff8f85}.ac-note{margin-top:10px;font-size:11px;line-height:1.35;opacity:.6;text-align:center}'
 +'.ac-card{border-radius:16px;border:1px solid var(--gb,rgba(255,255,255,.17));background:rgba(255,255,255,.05);padding:10px 12px}.ac-card+.ac-card{margin-top:8px}.ac-who{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:800;margin-bottom:6px;word-break:break-all}.ac-badge{flex:none;padding:2px 8px;border-radius:999px;background:var(--ac,#ffd23f);color:#14161c;font-size:10px;font-weight:900;letter-spacing:.8px}'
 +'.ac-kv{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;font-weight:600;padding:4px 0}.ac-kv span:first-child{opacity:.62}.ac-kv em{font-style:normal;font-weight:800;color:#7dffa0;font-variant-numeric:tabular-nums;text-align:right}.ac-kv em.w{color:#fff}.ac-kv em.o{color:#ffb86b}'
 +'.ac-ct{font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;opacity:.6;margin-bottom:2px}'
 +'.ac-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#34c759;margin-left:2px}.ac-dot.o{background:#ffb86b}'
 +'#acChip{position:fixed;left:50%;top:calc(var(--st,0px) + 52px);transform:translateX(-50%);z-index:60;display:none;padding:8px 14px;border-radius:999px;border:1px solid var(--ac,#ffd23f);background:rgba(18,20,28,.9);color:#fff;font:800 11px/1 -apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:.8px;text-transform:uppercase;white-space:nowrap}'
 +'body.ac-inf #cash{font-size:0!important}body.ac-inf #cash::after{content:"$'+String.fromCharCode(8734)+'";font-size:21px}';
 document.head.appendChild(st)}
const acRoot=document.createElement('div');acRoot.id='acRoot';document.body.appendChild(acRoot);
const acChip=document.createElement('div');acChip.id='acChip';acChip.textContent='Newer save in your account';document.body.appendChild(acChip);
function acChipSync(){acChip.style.display=(acConf&&!acOpen&&state!=='ready')?'block':'none'}
function acSay(m,bad){acMsg=m||'';acMsgBad=!!bad;if(acOpen)acRender()}
function acFocus(id){setTimeout(()=>{const e=document.getElementById(id);if(e&&acOpen){try{e.focus({preventScroll:false})}catch(x){}}},60)}
function acStoreNote(){if(!acLS||acNoPersist)return '<div class="ac-note">This browser does not let the game remember your sign-in here. You will need to sign in again next time. The game itself works as normal.</div>';
 if(acFramed)return '<div class="ac-note">Inside an app the sign-in may not be remembered. If it asks again, just sign in again. Your account keeps your game.</div>';return ''}
function acRender(){const em=document.getElementById('acEm'),cd=document.getElementById('acCode'),foc=document.activeElement&&document.activeElement.id;if(em)acEmail=em.value.trim();if(cd)acCodeV=cd.value;
 const msg='<div class="ac-msg'+(acMsgBad?' bad':'')+'" id="acMsg">'+acEsc(acMsg)+'</div>';let h='<div class="ac-pan"><div class="ac-hd"><b>ACCOUNT</b><div class="ac-x" data-ac="close">&times;</div></div>';
 if(!acOK())h+='<div class="ac-card" style="text-align:center;padding:18px 12px"><div style="font-size:16px;font-weight:800;margin-bottom:6px">Accounts are not set up yet</div><div style="font-size:12.5px;opacity:.7;line-height:1.4">Your game still saves on this device, the same as always.</div></div><div class="ac-b ac-go" data-ac="close">OK</div>';
 else if(acView==='wait')h+=msg;
 else if(acView==='conflict'&&acConf){const L=acInfo(acBundle()),C=acInfo(acConf.row.save),ct=acConf.row.updated_at?Date.parse(acConf.row.updated_at):C.t;
  h+='<div class="ac-p">'+(acConf.quiet?'Your account has a newer save. Load it now?':'This device and your account have different saves. Which one do you want to keep?')+'</div>'
   +'<div class="ac-card"><div class="ac-ct">This device</div><div class="ac-kv"><span>Cash</span><em>'+acMoney(L.cash)+'</em></div><div class="ac-kv"><span>Last saved</span><em class="w">'+acAgo(acMeta.t)+'</em></div></div>'
   +'<div class="ac-card"><div class="ac-ct">Your account'+(C.dev?' &middot; from a '+acEsc(C.dev):'')+'</div><div class="ac-kv"><span>Cash</span><em>'+acMoney(C.cash)+'</em></div><div class="ac-kv"><span>Last saved</span><em class="w">'+acAgo(ct)+'</em></div></div>'
   +'<div class="ac-row"><div class="ac-b" data-ac="keepLocal">Keep this device</div><div class="ac-b ac-go" data-ac="keepCloud">Use account save</div></div><div class="ac-note">The other save is replaced. If you pick the account save, the game restarts.</div>'+msg}
 else if(acUser&&acView!=='email'&&acView!=='code'){const st=acSt==='synced'?'Saved to your account':(acStTxt[acSt]||''),col=acSt==='synced'?'':(acSt==='offline'||acSt==='conflict'?'o':'w');
  h+='<div class="ac-card"><div class="ac-who"><span>'+acMask(acUser.email)+'</span>'+(acAdmin?'<span class="ac-badge">ADMIN</span>':'')+'</div>'
   +'<div class="ac-kv"><span>Cash</span><em>'+(acAdmin?'&infin; unlimited':acMoney(cash))+'</em></div><div class="ac-kv"><span>Play time</span><em class="w">'+acDur(acMeta.play)+'</em></div>'
   +'<div class="ac-kv"><span>Last saved to account</span><em class="w">'+acAgo(acCloudT)+'</em></div><div class="ac-kv"><span>Sync</span><em class="'+col+'" id="acSync">'+st+'</em></div></div>'
   +'<div class="ac-row"><div class="ac-b" data-ac="sync">Save now</div><div class="ac-b" data-ac="out">Sign out</div></div><div class="ac-b ac-warn" data-ac="del">'+(acDelC?'Tap again to delete for good':'Delete my account data')+'</div>'+msg+(acNoPersist||!acLS?acStoreNote():'')}
 else if(acView==='code'){const left=Math.max(0,Math.ceil((60000-(Date.now()-acSendAt))/1000));
  h+='<div class="ac-p">Type the 6-digit code we sent to <b>'+acMask(acEmail)+'</b>. It can take a minute. Check spam too.</div><input class="ac-in ac-code" id="acCode" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" maxlength="6" placeholder="000000" enterkeyhint="done">'
   +'<div class="ac-b ac-go" data-ac="verify">Sign in</div><div class="ac-row"><div class="ac-b'+(left?' ac-dim':'')+'" data-ac="resend" id="acRe">'+(left?'Send again ('+left+')':'Send again')+'</div><div class="ac-b" data-ac="back">Other email</div></div>'+msg}
 else h+='<div class="ac-p">Sign in to keep your game on every device. We email you a <b>6-digit code</b>. No password.</div><input class="ac-in" id="acEm" type="email" inputmode="email" autocomplete="email" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="200" placeholder="Email address" enterkeyhint="send">'
   +'<div class="ac-b ac-go" data-ac="send">Send code</div>'+msg+acStoreNote();
 acRoot.innerHTML=h+'</div>';const e2=document.getElementById('acEm'),c2=document.getElementById('acCode');if(e2)e2.value=acEmail;if(c2)c2.value=acCodeV;if(foc==='acEm'&&e2)e2.focus();if(foc==='acCode'&&c2)c2.focus()}
function acOpenPanel(){if(acOpen)return;acOpen=true;acMsg='';acMsgBad=false;acDelC=0;acRoot.style.display='flex';acRoot.scrollTop=0;
 if(acOK()){if(acConf)acView='conflict';else if(acUser)acView='profile';else if(acView!=='code')acView='email';
  if(!acCl){let has=false;try{has=acStore.getItem(acSKEY)!==null}catch(e){}if(has){acView='wait';acMsg='Connecting...';acInit().then(()=>{if(acView==='wait'){acMsg='';acView=acConf?'conflict':(acUser?'profile':'email');if(acOpen)acRender()}}).catch(e=>{acView='email';acSay(acPlain(e),true)})}else acInit().catch(()=>{})}}
 acRender();acChipSync()}
function acClose(){if(!acOpen)return;acOpen=false;acRoot.style.display='none';acDelC=0;try{if(document.activeElement&&document.activeElement.blur&&acRoot.contains(document.activeElement))document.activeElement.blur()}catch(e){}acChipSync()}
function acAct(a){if(a==='close')acClose();else if(a==='send')acSend();else if(a==='verify')acVerify();else if(a==='resend'){if(Date.now()-acSendAt>=60000)acSend();else acSay('Please wait a little before sending again.',true)}
 else if(a==='back'){acView='email';acCodeV='';acSay('')}else if(a==='out')acSignOut();else if(a==='del')acDelete();
 else if(a==='sync'){acDelC=0;if(acConf){acView='conflict';acRender()}else if(!acGot)acSync(true);else{acLocalHash();acPush()}}
 else if(a==='keepLocal'){acConf=null;acView='profile';acPush();acRender();acChipSync()}else if(a==='keepCloud'){if(acConf)acApply(acConf.row)}
 if(a!=='del'&&acDelC){acDelC=0;if(acOpen)acRender()}}
const acTxt=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select');
acRoot.addEventListener('touchstart',e=>{e.stopPropagation();if(acTxt(e))return;if(e.cancelable)e.preventDefault();const a=e.target&&e.target.closest?e.target.closest('[data-ac]'):null;if(a)acAct(a.getAttribute('data-ac'))},{passive:false});
for(const acEv of['touchmove','touchend','touchcancel','mousedown','mouseup','click','wheel','keypress'])acRoot.addEventListener(acEv,e=>{e.stopPropagation()});
acRoot.addEventListener('input',e=>{const t=e.target;if(t&&t.id==='acCode'){const v=t.value.replace(/[^0-9]/g,'').slice(0,6);if(v!==t.value)t.value=v;acCodeV=v;if(v.length===6&&!acBusy)acVerify()}else if(t&&t.id==='acEm')acEmail=t.value.trim()});
acRoot.addEventListener('focusin',e=>{const t=e.target;if(t&&t.scrollIntoView)setTimeout(()=>{try{t.scrollIntoView({block:'center'})}catch(x){}},320)});
addEventListener('keydown',e=>{if(!acOpen)return;if(e.key==='Escape'){acClose();e.preventDefault()}else if(e.key==='Enter'&&acTxt(e)){acAct(acView==='code'?'verify':'send');e.preventDefault()}e.stopImmediatePropagation()},true);
addEventListener('keyup',e=>{if(acOpen)e.stopImmediatePropagation()},true);
acChip.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();acOpenPanel()},{passive:false});
setInterval(()=>{if(acOpen&&acView==='code'){const b=document.getElementById('acRe');if(b){const left=Math.max(0,Math.ceil((60000-(Date.now()-acSendAt))/1000));b.textContent=left?'Send again ('+left+')':'Send again';b.classList.toggle('ac-dim',left>0)}}},1000);
// ----- Account buttons on the title screen and in the pause / settings menu (added next to the ui module's own buttons) -----
function acMkBtn(id){const b=document.createElement('div');b.id=id;b.className='ui-b';b.innerHTML='Account<span class="ac-dot" style="display:none"></span>';
 b.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();acOpenPanel()},{passive:false});return b}
function acInject(){const t=document.getElementById('uiTitle');if(t&&!document.getElementById('acBtnT')){const o=t.querySelector('.ui-opt'),b=acMkBtn('acBtnT');if(o)o.appendChild(b);else{b.style.cssText='position:absolute;left:14px;bottom:calc(var(--sb,0px) + 7vh + 10px);height:34px;padding:0 13px;font-size:10px;color:#fff;border:1px solid rgba(255,255,255,.2)';t.appendChild(b)}}
 const s=document.getElementById('uiSet');if(s&&!document.getElementById('acBtnS')){const f=s.querySelector('.ui-ft');if(f)f.insertBefore(acMkBtn('acBtnS'),f.querySelector('.ui-res'))}
 for(const id of['acBtnT','acBtnS']){const b=document.getElementById(id),d=b&&b.querySelector('.ac-dot');if(d){d.style.display=acUser?'inline-block':'none';d.className='ac-dot'+(acSt==='synced'||acSt==='saving'?'':' o')}}
 if(acAdmin&&s){const sp=s.querySelector('.ui-hd span');if(sp&&sp.textContent.indexOf('$'+acBIG)>=0)sp.textContent=sp.textContent.replace('$'+acBIG,'$'+String.fromCharCode(8734))}
 acChipSync()}
setInterval(acInject,400);
// ----- start: only load anything if this device already holds a sign-in -----
function acBoot(){if(!acOK()||acCl||acInitP)return;let has=false;try{has=acStore.getItem(acSKEY)!==null}catch(e){}if(has)acInit().catch(()=>{})}
setTimeout(acBoot,2500);

// ---------- life: pedestrians with behaviour, traffic manners, witnesses and beat cops, cinematic spawn camera ----------
const lfR=BLOCK/2-1.2,lfSmart=[],lfCops=[],lfBub=[];
let lfIntro=null,lfPrevState=state,lfIntroDone=false,lfCaller=null,lfScan=0,lfHonkT=0,lfBlockT=0,lfPush=0,lfPassed=-1,lfAmb=null,lfDown=null,lfFovNow=65,lfErr=0;
const lfLines={bump:['Hey! Watch it!','Excuse you!','Easy, pal!','Do you mind?'],flee:['Run!','He has a gun!','Get down!','Not today!'],cower:['Please, no!','Take it, take it!','Do not shoot!'],
 fight:['Wrong one, buddy!','You want some?','Come here!'],call:['Calling the cops!','Police? Yes, right now!','I am reporting this!'],watch:['Did you see that?','Somebody call an ambulance!','This is going online.','No way...'],
 chat:['No, really?','So I told him...','Rent went up again.','You hungry?','Best tacos in town.','Traffic was awful.','Ha! Classic.'],car:['That is my car!','Get back here!','Thief!'],dive:['Whoa!','Maniac!','Sidewalk, genius!'],gang:['Wrong block.','Keep walking.','You lost?'],cop:['Evening.','Move along.','Stay out of trouble.']};
const lfPick=k=>lfLines[k][Math.floor(Math.random()*lfLines[k].length)];
// --- speech bubbles (4 pooled). Show, don't tell: people now shout, scream and gesture instead; bubbles stay off unless lfBubOn is set.
let lfBubOn=false;const lfCat={};for(const k in lfLines)for(const s of lfLines[k])lfCat[s]=k;
for(let i=0;i<4;i++){const d=document.createElement('div');d.className='lf-keep';d.style.cssText='position:fixed;left:0;top:0;pointer-events:none;z-index:6;display:none;transform:translate(-50%,-100%);background:rgba(255,255,255,.93);color:#14161c;font:700 12px -apple-system,sans-serif;padding:4px 9px;border-radius:11px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.4)';document.body.appendChild(d);lfBub.push({d,g:null,t:0})}
function lfFem(g){const u=g&&g.userData;if(!u)return false;if(u.av&&u.av.C)return !!u.av.C.fem;return /^f\d|^med2$|^mic$/.test(u.rlVar||u.rlType||'')}
// what each kind of line sounds like (audio module voices); chat and greetings stay silent
const lfVox={flee:'scream',cower:'whimper',fight:'shout',call:'',watch:'gasp',chat:'',car:'shout',dive:'yelp',gang:'shout',cop:'',bump:'grunt'};
function lfVoice(g,kind){if(!g||!kind||typeof auVoice!=='function')return;try{auVoice(kind,g.position,lfFem(g))}catch(e){}}
function lfSay(g,txt,dur){if(!g||Math.hypot(g.position.x-pos.x,g.position.z-pos.z)>42)return;const cat=lfCat[txt];if(cat&&lfVox[cat])lfVoice(g,lfVox[cat]);if(!lfBubOn)return;
 let b=null;for(const x of lfBub){if(x.g===g){b=x;break}if(x.t<=0&&!b)b=x}if(!b)return;b.g=g;b.t=dur||2.2;b.d.textContent=txt}
// HD clip helpers (code-built people keep the arm rotations below)
const lfHD=p=>typeof rlPlay==='function'&&p&&p.userData;
function lfClip(p,n,o){if(lfHD(p)){if(p.userData.lfClip===n)return;p.userData.lfClip=n;rlPlay(p,n,o)}}
function lfClipOff(p){if(lfHD(p)&&p.userData.lfClip){p.userData.lfClip=null;rlPlay(p,null)}}
function lfGst(p,n,d,tg){if(typeof rlGesture==='function')rlGesture(p,n,d,tg)}
// personality: decided the first time someone is threatened
function lfPers(p){const u=p.userData;if(!u.lfP){const r=Math.random();u.lfP=r<.11?'fight':(r<.155?'gun':(r<.32?'call':(r<.52?'cower':'flee')))}return u.lfP}
function lfBubTick(dt){const v=new THREE.Vector3();for(const b of lfBub){if(b.t<=0)continue;b.t-=dt;const g=b.g;if(b.t<=0||!g||!g.parent||state!=='play'){b.t=0;b.d.style.display='none';continue}
  v.set(g.position.x,g.position.y+2.75,g.position.z).project(cam);if(v.z>1||Math.abs(v.x)>1.1||Math.abs(v.y)>1.1){b.d.style.display='none';continue}b.d.style.display='block';b.d.style.left=((v.x+1)/2*innerWidth)+'px';b.d.style.top=((1-v.y)/2*innerHeight)+'px'}}
// --- geometry helpers
function lfGreen(alongX){const ph=(typeof wdPh!=='undefined'&&wdPh>=0)?wdPh:Math.floor((T%16)/2);return alongX?ph<3:(ph>=4&&ph<7)}
function lfBlock(x,z){const f=v=>Math.max(0,Math.min(N-1,Math.round((v+HALF-ROAD/2-CELL/2)/CELL)));return [roadCenter(f(x))+CELL/2,roadCenter(f(z))+CELL/2]}
function lfPerim(x,z,b){const dx=x-b[0],dz=z-b[1],r=lfR;let px,pz,side,f;if(Math.abs(dx)>Math.abs(dz)){px=dx>0?r:-r;pz=Math.max(-r,Math.min(r,dz));if(dx>0){side=1;f=(pz+r)/(2*r)}else{side=3;f=(r-pz)/(2*r)}}else{pz=dz>0?r:-r;px=Math.max(-r,Math.min(r,dx));if(dz>0){side=2;f=(r-px)/(2*r)}else{side=0;f=(px+r)/(2*r)}}return {x:b[0]+px,z:b[1]+pz,t:side+f,side,f}}
function lfMove(g,tx,tz,spd,dt){const dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);if(d<.05)return d;const s=Math.min(d,spd*dt);g.position.x+=dx/d*s;g.position.z+=dz/d*s;g.position.y=.3;collide(g.position,.45);g.rotation.y=Math.atan2(-dx,-dz);const u=g.userData;u.lfW=(u.lfW||0)+dt*spd*1.5;animLimbs(g,spd,u.lfW);return d}
function lfFace(g,x,z){g.rotation.y=Math.atan2(-(x-g.position.x),-(z-g.position.z))}
function lfStand(g){const u=g.userData;u.armL.rotation.x*=.8;u.armR.rotation.x*=.8;u.legL.rotation.x*=.8;u.legR.rotation.x*=.8}
// --- smart pedestrians
function lfTake(p,st,data,urgent){const u=p.userData;if(u.dead)return false;if(!u.lfOn){if(lfSmart.length>=(urgent?28:20))return false;u.lfOn=true;lfSmart.push(p)}if(u.lf&&u.lf.st!==st){lfClipOff(p);lfGst(p,null);u.rlAimT=0;if(u.gun&&!u.lfArmed)u.gun.visible=false}u.lf=Object.assign({st,t:0},data||{});return true}
function lfDrop(p,b){const u=p.userData,q=u.path;lfClipOff(p);lfGst(p,null);if(u.gun)u.gun.visible=false;if(!b)b=lfBlock(p.position.x,p.position.z);const m=lfPerim(p.position.x,p.position.z,b);q.cx=b[0];q.cz=b[1];q.t=m.t;if(q.spd>1.6)q.spd=.8+Math.random()*.5;u.lfOn=false;u.lf=null;const i=lfSmart.indexOf(p);if(i>=0)lfSmart.splice(i,1)}
// GTA-style reactions by personality: a few fight back (fists, or a pistol), some call the cops, some cower, most run screaming
const lfBusy=s=>s==='flee'||s==='fight'||s==='cower'||s==='call'||s==='gun'||s==='angry'||s==='mugged'||s==='hands';
function lfReact(p,P,d,kind){const u=p.userData,pr=lfPers(p),near=!driving&&state==='play';
 if(pr==='fight'&&near&&d<16&&kind!=='boom'){if(lfTake(p,'angry',{dur:.9},true)){lfClip(p,'Angry',{dur:1.2});lfFace(p,pos.x,pos.z);lfSay(p,lfPick('fight'))}return}
 if(pr==='gun'&&near&&d<26&&kind!=='boom'){if(lfTake(p,'gun',{cd:.8+Math.random()*.6,dur:11+Math.random()*5},true)){u.lfArmed=1;lfSay(p,lfPick('fight'))}return}
 if(pr==='call'&&d>9&&wanted<2){if(lfTake(p,'call',{dur:4.5,own:1,sx:P.x,sz:P.z},true)){lfClip(p,'Phone');lfSay(p,lfPick('call'))}return}
 if((pr==='cower'||d<7)&&kind!=='aim'&&d<15){if(lfTake(p,'cower',{dur:4+Math.random()*4},true)){lfClip(p,'Cower');lfGst(p,'scared',3);lfSay(p,lfPick('cower'))}return}
 if(kind==='aim'){if(lfTake(p,'hands',{dur:3.5+Math.random()*2},true)){lfGst(p,'hands',3.5);lfClip(p,'Nervous');if(Math.random()<.5)lfVoice(p,'whimper')}return}
 if(lfTake(p,'flee',{sx:P.x,sz:P.z,dur:5+Math.random()*4},true)&&Math.random()<.45)lfSay(p,lfPick('flee'))}
function lfThreat(P,R,kind){let n=0;for(const p of peds){const u=p.userData;if(u.dead)continue;const d=Math.hypot(p.position.x-P.x,p.position.z-P.z);if(d>R)continue;if(u.lfOn&&u.lf&&lfBusy(u.lf.st))continue;
  // the closest react at once, people further away a moment later (you see the panic spread)
  if(d<12||n++<6)lfReact(p,P,d,kind);else setTimeout(()=>{if(!u.dead&&!(u.lfOn&&u.lf&&lfBusy(u.lf.st)))lfReact(p,P,d,kind)},200+d*25)}}
function lfWatch(P,n){let k=0;for(const p of peds){if(k>=n)break;const u=p.userData;if(u.dead||u.lfOn)continue;const d=Math.hypot(p.position.x-P.x,p.position.z-P.z);if(d<14||d>60)continue;if(lfTake(p,'watch',{sx:P.x,sz:P.z,dur:8+Math.random()*5})){k++;if(k<3)lfSay(p,lfPick('watch'),2.6)}}}
function lfPedTick(dt){const px=pos.x,pz=pos.z,onFoot=!driving&&state==='play';
 // reflexes for nearby walkers: bumps and diving away from cars
 for(const p of peds){const u=p.userData;if(u.dead)continue;const dx=p.position.x-px,dz=p.position.z-pz,d=Math.hypot(dx,dz);if(d>9)continue;const st=u.lfOn&&u.lf?u.lf.st:'';
  if(driving&&!driving.custom&&!driving.vhT&&Math.abs(driving.speed)>7&&d<7&&st!=='dive'&&st!=='flee'){const m=driving.m,fx=-Math.sin(m.rotation.y)*Math.sign(driving.speed),fz=-Math.cos(m.rotation.y)*Math.sign(driving.speed);if((dx*fx+dz*fz)>0){const side=(dx*fz-dz*fx)>0?1:-1;if(lfTake(p,'dive',{vx:fz*side,vz:-fx*side},true)&&Math.random()<.5)lfSay(p,lfPick('dive'),1.6)}}
  else if(onFoot&&d<1.15&&Math.hypot(vel.x,vel.z)>4&&st!=='stumble'&&!lfBusy(st)){if(lfTake(p,'stumble',{},true)){u.rlHitT=T+.5;lfGst(p,'stagger',.6);p.position.x+=dx/(d||1)*.7;p.position.z+=dz/(d||1)*.7;u.lfBump=(u.lfBump||0)+1;u.lfBumpT=T;lfSay(p,lfPick('bump'),1.8)}}}
 // the player aiming at someone up close: hands up, or a tough one squares up
 if(onFoot&&typeof lockObj!=='undefined'&&lockObj&&lockObj.userData&&lockObj.userData.path&&!lockObj.userData.dead){const p=lockObj,u=p.userData,d=Math.hypot(p.position.x-px,p.position.z-pz);
  if(d<14&&!(u.lfOn&&u.lf&&lfBusy(u.lf.st))){u.lfAimT=(u.lfAimT||0)+dt;if(u.lfAimT>.45){u.lfAimT=0;lfReact(p,pos,d,'aim')}}}
 // ambient behaviours, a few at a time
 lfScan-=dt;if(lfScan<=0&&state==='play'){lfScan=.6;for(const p of peds){const u=p.userData;if(u.dead||u.lfOn)continue;const d=Math.hypot(p.position.x-px,p.position.z-pz);if(d>75||d<7)continue;const q=u.path;
   if(u.lfJog&&T>u.lfJog){u.lfJog=0;q.spd=.8+Math.random()*.5}const r=Math.random();
   if(r<.018){let o=null;for(const c of peds){if(c===p||c.userData.dead||c.userData.lfOn)continue;const dd=Math.hypot(c.position.x-p.position.x,c.position.z-p.position.z);if(dd<7&&dd>1.2){o=c;break}}if(o){const dur=7+Math.random()*7;if(lfTake(p,'chat',{o,dur})&&!lfTake(o,'chat',{o:p,dur}))lfDrop(p)}}
   else if(r<.034)lfTake(p,'phone',{dur:5+Math.random()*7,gl:0});
   else if(r<.05)lfTake(p,'idle',{dur:3+Math.random()*5,gl:0,base:p.rotation.y});
   else if(r<.058){const b=[q.cx,q.cz],ix=b[0]-p.position.x,iz=b[1]-p.position.z,l=Math.hypot(ix,iz)||1;lfTake(p,'shop',{tx:p.position.x+ix/l*1.7,tz:p.position.z+iz/l*1.7,dur:4+Math.random()*5,ph:0})}
   else if(r<.08){const m=lfPerim(p.position.x,p.position.z,[q.cx,q.cz]);if(m.f<.14||m.f>.86){const sx=m.side===1?1:m.side===3?-1:0,sz=m.side===2?1:m.side===0?-1:0,nx=q.cx+sx*CELL,nz=q.cz+sz*CELL;if(Math.abs(nx)<HALF&&Math.abs(nz)<HALF)lfTake(p,'crossW',{nb:[nx,nz],tx:p.position.x+sx*(CELL-2*lfR),tz:p.position.z+sz*(CELL-2*lfR),ax:sx!==0})}}
   else if(r<.086&&!u.lfJog){u.lfJog=T+14;q.spd=3.1}}}
 // run the state machines
 for(let i=lfSmart.length-1;i>=0;i--){const p=lfSmart[i],u=p.userData,s=u.lf;if(u.dead||!s){u.lfOn=false;u.lf=null;lfSmart.splice(i,1);continue}s.t+=dt;const dp=Math.hypot(p.position.x-px,p.position.z-pz);
  if(dp>130&&s.st!=='return'){lfDrop(p);continue}
  if(s.st==='flee'){const dx=p.position.x-s.sx,dz=p.position.z-s.sz,l=Math.hypot(dx,dz)||1;lfMove(p,p.position.x+dx/l*6,p.position.z+dz/l*6,6.4,dt);if(s.t>s.dur)s.st='return'}
  else if(s.st==='cower'){lfStand(p);u.armL.rotation.x=u.armR.rotation.x=2.5;lfFace(p,px,pz);if(s.t%2.6<dt)lfGst(p,'scared',2.8);if(s.t>s.dur){lfClipOff(p);s.st='flee';s.sx=px;s.sz=pz;s.dur=s.t+4}}
  else if(s.st==='hands'){lfStand(p);u.armL.rotation.x=u.armR.rotation.x=Math.PI;lfFace(p,px,pz);if(s.t%3<dt)lfGst(p,'hands',3.2);if(s.t>s.dur||(lockObj!==p&&s.t>1.5)){lfClipOff(p);lfGst(p,null);s.st='flee';s.sx=px;s.sz=pz;s.dur=s.t+5}}
  else if(s.st==='angry'){lfStand(p);lfFace(p,px,pz);u.armL.rotation.x=u.armR.rotation.x=.6;if(s.t>s.dur){lfClipOff(p);if(lfPers(p)==='fight'&&!driving&&dp<25){s.st='fight';s.t=0;s.cd=.25}else s.st='return'}}
  else if(s.st==='fight'){if(state!=='play'||driving||s.t>14||dp>40){lfGst(p,null);s.st='flee';s.sx=px;s.sz=pz;s.dur=s.t+5}
   else if(dp>1.45&&!(s.hitAt>s.t)){lfMove(p,px,pz,dp>4?5.4:2.2,dt)}
   else{lfFace(p,px,pz);lfStand(p);s.cd-=dt;const G=u.rlGst;if(!G||(G.n!=='punch'&&G.n!=='guard'))lfGst(p,'guard',1.25);else if(G.n==='guard'&&T-G.t0>.8)G.t0=T-.3;// fists up between punches
    if(s.cd<=0){s.cd=.85+Math.random()*.45;lfGst(p,'punch',.5);s.hitAt=s.t+.2;u.armR.rotation.x=.4}
    if(s.hitAt&&s.t>=s.hitAt){s.hitAt=0;u.armR.rotation.x=1.6;if(dp<1.75&&state==='play'){hurt(7);player.userData.rlHitT=T+.35;shake=Math.max(shake,.12);if(typeof auHit==='function')auHit(p.position);if(Math.random()<.35)lfSay(p,lfPick('fight'),1.5)}else if(typeof auWhiff==='function')auWhiff(p.position)}}}
  else if(s.st==='gun'){u.lfArmed=1;if(u.gun)u.gun.visible=true;if(state!=='play'||s.t>s.dur||dp>45){u.lfArmed=0;if(u.gun)u.gun.visible=false;s.st='flee';s.sx=px;s.sz=pz;s.dur=s.t+5}
   else{const dx=px-p.position.x,dz=pz-p.position.z,l=dp||1;if(dp>12)lfMove(p,px,pz,3.6,dt);else if(dp<6)lfMove(p,p.position.x-dx/l*3,p.position.z-dz/l*3,2.6,dt);else{const sd=Math.sin(T*1.1+i)>0?1:-1;lfMove(p,p.position.x-dz/l*sd,p.position.z+dx/l*sd,.9,dt)}
    lfFace(p,px,pz);u.rlAimT=T+.4;u.armR.rotation.x=Math.PI/2;s.cd-=dt;if(s.cd<=0&&dp<30&&s.t>.7){s.cd=1+Math.random()*.8;enemyShoot({g:p,kind:'gang'})}}}
  else if(s.st==='call'){lfStand(p);u.armR.rotation.x=2.2;
   if(s.own){if(s.t<.1&&typeof auDial==='function')auDial(p.position);const ax=p.position.x-s.sx,az=p.position.z-s.sz;lfFace(p,p.position.x+ax,p.position.z+az);// turn away to make the call
    if(s.t>s.dur){if(wanted===0&&state==='play')wantedScore=Math.max(wantedScore,1.05);lfClipOff(p);s.st='flee';s.sx=px;s.sz=pz;s.dur=s.t+4}}
   else{lfFace(p,px,pz);if(!lfCaller||lfCaller.g!==p)s.st='return'}}
  else if(s.st==='dive'){if(s.t<.42){p.position.x+=s.vx*9*dt;p.position.z+=s.vz*9*dt;collide(p.position,.45);u.rlHitT=T+.2;u.armL.rotation.x=u.armR.rotation.x=-2.2;if(s.t<dt*1.5)lfGst(p,'scared',1.4)}else{lfStand(p);if(s.t>1.7)s.st='return'}}
  else if(s.st==='stumble'){lfStand(p);if(s.t>.95){if(u.lfBump>1&&T-(u.lfBumpT||0)<8){u.lfBump=0;s.st='angry';s.t=0;s.dur=1.6;lfClip(p,'Angry',{dur:2});lfSay(p,lfPick('fight'))}else s.st='return'}}
  else if(s.st==='mugged'){lfStand(p);if(s.m&&s.m.g)lfFace(p,s.m.g.position.x,s.m.g.position.z);u.armL.rotation.x=u.armR.rotation.x=s.down?.1:Math.PI;if(s.t>(s.dur||30))s.st='return'}
  else if(s.st==='thank'){lfStand(p);lfFace(p,px,pz);u.armR.rotation.x=2.6+Math.sin(T*9)*.3;if(s.t>s.dur){lfClipOff(p);s.st='return'}}
  else if(s.st==='chat'){lfStand(p);const o=s.o;if(!o||o.userData.dead||!o.userData.lfOn||s.t>s.dur){s.st='return';continue}lfFace(p,o.position.x,o.position.z);const os=o.userData.lf;if(s.spk===undefined){s.spk=os&&os.spk!==undefined?!os.spk:Math.random()<.5;s.turn=1.5+Math.random()*2.5;s.tk=Math.random()<.5?'Talk':'Talk2'}s.turn-=dt;if(s.turn<=0){s.spk=!s.spk;s.turn=1.4+Math.random()*2.8;if(os)os.spk=!s.spk}
   lfClip(p,s.spk?s.tk:(s.lg?'Laugh':'Listen'));if(!s.spk&&s.turn<dt)s.lg=Math.random()<.15;
   if(s.spk){u.armR.rotation.x=.45+Math.sin(T*4.2+i)*.45;u.armL.rotation.x=.25+Math.sin(T*3.1+i*2)*.3;p.rotation.y+=Math.sin(T*2.6+i)*.06}else{u.armL.rotation.x=.05;u.legL.rotation.x=.08*Math.sin(T*.7+i)}}
  else if(s.st==='idle'){lfStand(p);s.gl-=dt;if(s.gl<=0){s.gl=.8+Math.random()*1.8;s.look=s.base+(Math.random()-.5)*1.6;if(dp<9&&Math.random()<.5)s.look=Math.atan2(-(px-p.position.x),-(pz-p.position.z))}p.rotation.y+=(((s.look||s.base)-p.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI)*Math.min(1,dt*3);u.legL.rotation.x=.1*Math.sin(T*.6+i);u.legR.rotation.x=-.1*Math.sin(T*.6+i);if(s.t>s.dur)s.st='return'}
  else if(s.st==='phone'){lfStand(p);u.armR.rotation.x=2.3;if(s.tx===undefined)s.tx=Math.random()<.5;lfClip(p,s.tx?'Text':'Phone');s.gl-=dt;if(s.gl<=0){s.gl=2+Math.random()*3;if(Math.random()<.4)p.rotation.y+=(Math.random()-.5)*1.2}if(dp<4)lfFace(p,px,pz);if(s.t>s.dur)s.st='return'}
  else if(s.st==='shop'){if(s.ph===0){if(lfMove(p,s.tx,s.tz,1.2,dt)<.3||s.t>4){s.ph=1;s.t=0}}else{lfStand(p);lfClip(p,'Look');const b=lfBlock(p.position.x,p.position.z);lfFace(p,b[0],b[1]);if(s.t>s.dur)s.st='return'}}
  else if(s.st==='watch'){const d=Math.hypot(p.position.x-s.sx,p.position.z-s.sz);if(d>(s.keep||20)&&s.t<6)lfMove(p,s.sx,s.sz,2.6,dt);else{lfStand(p);lfFace(p,s.sx,s.sz);u.armR.rotation.x=1.9;
    if(!s.pt){s.pt=1;if(Math.random()<.6)lfGst(p,'point',2.4,new THREE.Vector3(s.sx,1,s.sz));lfClip(p,Math.random()<.5?'Nervous':'Look')}}if(s.t>s.dur)s.st='return'}
  else if(s.st==='crossW'){lfStand(p);lfFace(p,s.tx,s.tz);lfClip(p,'Wait');if(!lfGreen(!s.ax)&&s.t>.8){s.st='cross';s.t=0}else if(s.t>11)s.st='return'}
  else if(s.st==='cross'){if(lfMove(p,s.tx,s.tz,1.7,dt)<.35||s.t>16){lfDrop(p,s.nb)}}
  else if(s.st==='return'){const b=lfBlock(p.position.x,p.position.z),m=lfPerim(p.position.x,p.position.z,b);if(lfMove(p,m.x,m.z,1.6,dt)<.3||s.t>30)lfDrop(p,b)}
  else lfDrop(p)}}
// --- witnesses: crimes only stick when someone sees them
{const c0=crime;crime=function(n){if(n>=2.5||wanted>0||lfIntro){c0(n);return}let seen=false;const P=pos;
  for(const pc of police)if(!pc.dead&&!pc.gone&&pc.m.position.distanceTo(P)<60)seen=true;for(const s of shooters)if(s.kind==='cop'&&!s.dead&&s.g.position.distanceTo(P)<50)seen=true;
  for(const c of lfCops)if(c.g.parent&&Math.hypot(c.g.position.x-P.x,c.g.position.z-P.z)<45)seen=true;for(const t of traffic)if(t.lfCop&&!t.dead&&t.m.userData.red&&Math.hypot(t.m.position.x-P.x,t.m.position.z-P.z)<45)seen=true;
  if(seen){c0(n);return}c0(n*.3);
  if(!lfCaller){let w=null,wd=36;for(const p of peds){const u=p.userData;if(u.dead)continue;const d=Math.hypot(p.position.x-P.x,p.position.z-P.z);if(d<wd&&d>5&&!(u.lfOn&&u.lf&&u.lf.st==='fight')){wd=d;w=p}}
   if(w&&lfTake(w,'call',{},true)){lfCaller={g:w,t:3.4,n:n*.7};lfClip(w,'Phone');if(typeof auDial==='function')auDial(w.position);lfSay(w,lfPick('call'),3)}}else lfCaller.n+=n*.4}}
// no text: you see the witness on the phone, hear the dial tone, and the wanted stars appear when the call goes through
function lfCallTick(dt){const c=lfCaller;if(!c)return;if(c.g.userData.dead||!c.g.userData.lfOn){lfCaller=null;return}c.t-=dt;if(c.t<=0){lfCaller=null;wantedScore+=c.n}}
// --- reactions to what the player does
{const s0=shoot;shoot=function(){s0();if(state==='play')lfThreat(pos,34,'shot')}}
{const e0=explode;explode=function(p){e0(p);try{if(Math.hypot(p.x-pos.x,p.z-pos.z)<110){lfThreat(p,38,'boom');lfWatch(p,5)}}catch(e){}}}
{const k0=killPed;killPed=function(q,from){const was=q.userData.dead;k0(q,from);try{if(!was&&q.userData.dead&&Math.hypot(q.position.x-pos.x,q.position.z-pos.z)<70){lfWatch(q.position,2);if(!lfDown&&!lfAmb)lfDown={g:q,t:5}}}catch(e){}}}
{const f0=flee;flee=function(p){const n=fleers.length;f0(p);const f=fleers[fleers.length-1];if(f&&fleers.length>n&&Math.random()<.4){f.lfAngry=4.5;lfSay(f.g,lfPick('car'),2.2)}}}
// --- gangs warn first on their own turf
{const g0=spawnGang;spawnGang=function(){const s=g0();if(s)s.lfTurf=true;return s};for(const s of shooters)if(s.kind==='gang')s.lfTurf=true}
function lfGangHot(s,d,dt){if(!s.lfTurf||state!=='play')return true;if(typeof lockObj!=='undefined'&&lockObj===s)return true;if(s.hp<3)return true;if(d>22){s.lfNear=Math.max(0,(s.lfNear||0)-.02);return false}
 s.lfNear=(s.lfNear||0)+(dt||.016);if(!s.lfWarn||T-s.lfWarn>9){s.lfWarn=T;lfSay(s.g,lfPick('gang'),2.4);lfFace(s.g,pos.x,pos.z);lfGst(s.g,'point',2.2,player)}/* shouts and points you off the block */return d<5||s.lfNear>(d<11?4.5:9)}
// --- staged street mugging (replaces the "MUGGER!" text): a mugger holds someone up at gunpoint in front of you, she screams with her hands up and hands over her bag,
// bystanders stop and point or back away, then he runs (the crime module's chase). Shoot or tackle him and she waves thanks.
let lfMugV=null;
function lfMugVictim(){const fx=-Math.sin(camYaw),fz=-Math.cos(camYaw);let best=null,bs=-1e9;
 for(const p of peds){const u=p.userData;if(u.dead||(u.lfOn&&u.lf&&lfBusy(u.lf.st)))continue;const dx=p.position.x-pos.x,dz=p.position.z-pos.z,d=Math.hypot(dx,dz);if(d<10||d>32)continue;const dot=(dx*fx+dz*fz)/d;if(dot<.5)continue;
  const sc=dot*3-Math.abs(d-16)/8+(lfFem(p)?.4:0);if(sc>bs){bs=sc;best=p}}return best}
function lfMugStart(M){const v=lfMugVictim(),g=M.g,u=g.userData;M.lfEnd=0;u.rlType='gang';u.rlVar=null;u.rlWalk='WalkCool';
 if(!v){lfVoice(g,'scream');return}// nobody to stage it with: you only hear a scream from where he runs
 const a=Math.random()*6.283;g.position.set(v.position.x+Math.cos(a)*1.5,.3,v.position.z+Math.sin(a)*1.5);collide(g.position,.45);lfFace(g,v.position.x,v.position.z);
 const bag=g.children.find(o=>o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry');if(bag){g.remove(bag);bag.position.set(.42,1.05,-.1);v.add(bag)}
 lfTake(v,'mugged',{m:M,dur:40},true);M.lfStage={t:0,v,bag,said:0};if(typeof rlT!=='undefined')rlT=0}
function lfMugStageTick(dt){const M=cpMug,S=M.lfStage,g=M.g,u=g.userData,v=S.v,vu=v.userData;S.t+=dt;const t=S.t,dp=Math.hypot(g.position.x-pos.x,g.position.z-pos.z);
 if(vu.dead||(dp<6&&t>.8)||t>7.5){lfMugRun(M);return}
 lfFace(g,v.position.x,v.position.z);if(u.gun)u.gun.visible=true;u.armR.rotation.x=Math.PI/2;u.rlAimT=T+.3;
 if(!S.said){S.said=1;lfVoice(g,'shout')}
 if(t>.5&&S.said===1){S.said=2;lfVoice(v,'scream');lfGst(v,'hands',5);lfClip(v,'Nervous');
  let k=0;for(const p of peds){const pu=p.userData;if(p===v||pu.dead||(pu.lfOn&&pu.lf&&lfBusy(pu.lf.st)))continue;const d=Math.hypot(p.position.x-v.position.x,p.position.z-v.position.z);if(d>26||k>5)continue;k++;
   if(Math.random()<.55)lfTake(p,'watch',{sx:v.position.x,sz:v.position.z,dur:7+Math.random()*4,keep:9},true);else lfTake(p,'flee',{sx:g.position.x,sz:g.position.z,dur:3+Math.random()*3},true)}}
 if(t>2.3&&S.said===2){S.said=3;lfVoice(v,'whimper')}
 if(t>4.3&&S.said===3){S.said=4;if(vu.lf)vu.lf.down=1;lfGst(v,null);if(S.bag){v.remove(S.bag);S.bag.position.set(.5,1.1,0);g.add(S.bag)}}// she hands over the bag
 if(t>5.1)lfMugRun(M)}
function lfMugRun(M){const S=M.lfStage;if(!S)return;M.lfStage=null;const g=M.g,v=S.v,vu=v.userData;if(g.userData.gun)g.userData.gun.visible=false;g.userData.rlAimT=0;
 if(S.bag&&S.bag.parent!==g){if(S.bag.parent)S.bag.parent.remove(S.bag);S.bag.position.set(.5,1.1,0);g.add(S.bag)}M.t=Math.max(M.t,22);lfMugV=v;
 if(!vu.dead&&vu.lf&&vu.lf.st==='mugged'){vu.lf.down=1;lfGst(v,'point',2.6,g);lfVoice(v,'shout');vu.lf.dur=vu.lf.t+3.2;lfClip(v,'Angry',{dur:3})}}
function lfMugEnd(M){M.lfEnd=1;const g=M.g,v=lfMugV;lfMugV=null;if(M.lfStage)lfMugRun(M);
 if(g.rotation.x<-1){g.rotation.x=0;if(typeof rlKill==='function')rlKill(g,pos,'shot')}// stopped: he goes down properly instead of tipping over like a plank
 if(g.userData.rlDie&&v&&!v.userData.dead&&Math.hypot(v.position.x-pos.x,v.position.z-pos.z)<60){lfTake(v,'thank',{dur:4},true);lfClip(v,'Wave',{dur:4})}}
{const mt0=cpMugTick;cpMugTick=function(dt){const had=!!cpMug;if(cpMug&&cpMug.lfStage&&!cpMug.done){try{lfMugStageTick(dt)}catch(e){lfMugRun(cpMug)}return}
  mt0(dt);if(!had&&cpMug&&!cpMug.done)try{lfMugStart(cpMug)}catch(e){}if(cpMug&&cpMug.done&&!cpMug.lfEnd)try{lfMugEnd(cpMug)}catch(e){cpMug.lfEnd=1}}}
// armed civilians count as hostile for auto-aim
{const at=allTargets;allTargets=function(){const o=at();for(const t of o)if(t.kind==='ped'&&t.obj.userData.lfArmed)t.hostile=true;return o}}
// --- traffic manners
function lfTrafficTick(dt){const px=pos.x,pz=pos.z,pv=driving?driving.m.position:pos;let pol=null;if(wanted>0)for(const pc of police)if(!pc.dead&&!pc.gone)pol=pc;
 for(const t of traffic){if(t.dead){t.lfStop=false;continue}const p=t.m.position,d=Math.hypot(p.x-px,p.z-pz);
  if(t.lfCop&&!t.m.userData.red)t.lfCop=false;
  if(t.hp!==undefined&&t.hp<100&&!t.lfScared){t.lfScared=true;t.spd=Math.min(22,t.spd*1.8)}
  if(d>140){t.lfStop=false;// far away: sometimes take a turn at an intersection so routes vary
   const k=Math.round((t.pos+HALF-ROAD/2)/CELL),c=roadCenter(k);if(k>0&&k<N&&Math.abs(t.pos-c)<1.2){if(t.lfK!==k){t.lfK=k;if(Math.random()<.3){const ol=t.lane;t.alongX=!t.alongX;t.lane=k;t.pos=roadCenter(ol);t.dir=Math.random()<.5?1:-1;t.lfK=ol}}}continue}
  let stop=false;const ax=t.alongX,u=t.pos,dir=t.dir;
  if(!t.lfScared){const k=dir>0?Math.ceil((u+HALF-ROAD/2-1)/CELL):Math.floor((u+HALF-ROAD/2+1)/CELL);if(k>=0&&k<=N){const sl=roadCenter(k)-dir*(ROAD/2+2.6),g=(sl-u)*dir;if(g>0&&g<6.5&&!lfGreen(ax))stop=true}}
  if(!stop)for(const o of traffic){if(o===t||o.dead||o.alongX!==ax||o.lane!==t.lane||o.dir!==dir)continue;const g=(o.pos-u)*dir;if(g>0&&g<9.5){stop=true;break}}
  const fx=ax?dir:0,fz=ax?0:dir;
  if(!stop)for(const c of cars){if(c===driving||c.vhT||c.custom)continue;const rx=c.m.position.x-p.x,rz=c.m.position.z-p.z,f=rx*fx+rz*fz;if(f>0&&f<8.5&&Math.abs(rx*fz-rz*fx)<1.9){stop=true;break}}
  if(!stop)for(const q of lfSmart){const s=q.userData.lf;if(!s||(s.st!=='cross'&&s.st!=='dive'))continue;const rx=q.position.x-p.x,rz=q.position.z-p.z,f=rx*fx+rz*fz;if(f>0&&f<10&&Math.abs(rx*fz-rz*fx)<3.2){stop=true;break}}
  if(!stop&&pol&&d<70&&pol.m.position.distanceTo(p)<32&&!t.lfCop)stop=true;
  t.lfStop=stop;
  if(!stop&&d<12){const rx=pv.x-p.x,rz=pv.z-p.z,f=rx*fx+rz*fz;if(f>0&&f<9&&Math.abs(rx*fz-rz*fx)<2.5){lfBlockT+=dt;if(lfBlockT>2.2&&T>lfHonkT){lfHonkT=T+2.6;beep(415,.28,.07);setTimeout(()=>beep(415,.2,.06),330)}}}}
 lfBlockT=Math.max(0,lfBlockT-dt*.3);
 for(const f of fleers)if(f.lfAngry>0){f.lfAngry-=dt;const dx=pv.x-f.g.position.x,dz=pv.z-f.g.position.z,l=Math.hypot(dx,dz)||1;f.d.set(dx/l,0,dz/l);if(f.lfAngry<=0)f.d.set(-dx/l,0,-dz/l)}}
// police cruisers that drive the streets when you are not wanted
for(let k=0;k<2;k++){try{const m=makePoliceCar(),t={m,alongX:k===0,dir:k?1:-1,lane:3+k*5,pos:(Math.random()-.5)*SIZE*.6,spd:9,lfCop:true};scene.add(m);traffic.push(t);placeTraffic(t)}catch(e){}}
// --- beat cops on foot
function lfCopSpawn(){const a=Math.random()*6.28,b=lfBlock(pos.x+Math.cos(a)*85,pos.z+Math.sin(a)*85),g=makePerson(0x1d3557,0x0b132b,0xc68642);g.userData.rlType='cop';const sd=Math.floor(Math.random()*4),r=lfR;
 g.position.set(b[0]+(sd===1?r:sd===3?-r:0),.3,b[1]+(sd===2?r:sd===0?-r:0));scene.add(g);lfCops.push({g,b,t:sd+.5,dir:Math.random()<.5?1:-1,hi:0})}
function lfCopTick(dt){if(state!=='play')return;if(wanted===0&&lfCops.length<3&&Math.random()<dt*.25)lfCopSpawn();
 for(let i=lfCops.length-1;i>=0;i--){const c=lfCops[i],g=c.g,d=Math.hypot(g.position.x-pos.x,g.position.z-pos.z);
  if(d>190){scene.remove(g);lfCops.splice(i,1);continue}
  if(wanted>0&&d<55){const s=makeShooter('cop',g.position.x,g.position.z);s.aggro=true;scene.remove(g);lfCops.splice(i,1);continue}
  if(d<4.5&&!driving){lfStand(g);lfFace(g,pos.x,pos.z);if(T>c.hi){c.hi=T+12;lfSay(g,lfPick('cop'),2.2)}continue}
  c.t+=dt*1.25*c.dir/(2*lfR);const per=((c.t%4)+4)%4,sd=Math.floor(per),f=per-sd,r=lfR;let x,z;if(sd===0){x=-r+2*r*f;z=-r}else if(sd===1){x=r;z=-r+2*r*f}else if(sd===2){x=r-2*r*f;z=r}else{x=-r;z=r-2*r*f}
  const nx=c.b[0]+x,nz=c.b[1]+z,dx=nx-g.position.x,dz=nz-g.position.z;if(dx||dz)g.rotation.y=Math.atan2(-dx,-dz);g.position.set(nx,.3,nz);g.userData.lfW=(g.userData.lfW||0)+dt*2;animLimbs(g,1.3,g.userData.lfW)}}
// --- ambulance for people who go down near you
function lfAmbMake(){const m=makeCar(0xf4f4f4,.3);if(typeof rlCarList!=='undefined'){const i=rlCarList.indexOf(m);if(i>=0)rlCarList.splice(i,1)}
 const red=new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false}),a=new THREE.Mesh(new THREE.BoxGeometry(1.1,.2,.4),red);a.position.set(0,1.75,.3);m.add(a);
 const cr=new THREE.MeshStandardMaterial({color:0xd01818});for(const s of[-1,1]){const h=new THREE.Mesh(new THREE.BoxGeometry(.04,.5,.16),cr),v=new THREE.Mesh(new THREE.BoxGeometry(.04,.16,.5),cr);h.position.set(s*1.13,.8,.9);v.position.set(s*1.13,.8,.9);m.add(h,v)}m.userData.lfRed=red;return m}
function lfAmbTick(dt){if(lfDown){lfDown.t-=dt;const g=lfDown.g;if(!g.userData.dead)lfDown=null;else if(lfDown.t<=0){const q=g.position,ix=Math.round((q.x+HALF-ROAD/2)/CELL),iz=Math.round((q.z+HALF-ROAD/2)/CELL),alongZ=Math.abs(q.x-roadCenter(ix))<Math.abs(q.z-roadCenter(iz)),m=lfAmbMake(),dir=Math.random()<.5?1:-1;
    if(alongZ){m.position.set(roadCenter(ix)-dir*3.2,0,q.z-dir*80);m.rotation.y=dir>0?Math.PI:0}else{m.position.set(q.x-dir*80,0,roadCenter(iz)+dir*3.2);m.rotation.y=dir>0?-Math.PI/2:Math.PI/2}
    scene.add(m);lfAmb={m,alongZ,dir,tgt:alongZ?q.z:q.x,g,ph:0,t:0,med:null};lfDown=null}}
 const a=lfAmb;if(!a)return;a.t+=dt;a.m.userData.lfRed.color.setRGB(Math.sin(T*12)>0?4:.3,0,0);const p=a.m.position;
 if(a.ph===0){const c=a.alongZ?p.z:p.x,g=(a.tgt-c)*a.dir;if(g>3&&a.t<14){const s=Math.min(17,4+g*.6)*dt*a.dir;if(a.alongZ)p.z+=s;else p.x+=s;for(const w of a.m.userData.wheels)w.rotation.x+=dt*20}else{a.ph=1;a.t=0;const md=makePerson(0xf2f2f2,0x1d3557,0xe0ac69);md.position.set(p.x+(a.alongZ?a.dir*-2.3:0),.3,p.z+(a.alongZ?0:a.dir*2.3));scene.add(md);a.med=md}}
 else if(a.ph===1){const md=a.med,g=a.g;if(lfMove(md,g.position.x+.9,g.position.z,3.2,dt)<1.1||a.t>7){a.ph=2;a.t=0}}
 else if(a.ph===2){const md=a.med;lfStand(md);lfFace(md,a.g.position.x,a.g.position.z);md.userData.armL.rotation.x=md.userData.armR.rotation.x=.9;md.position.y=-.25;if(a.t>5){md.position.y=.3;a.ph=3;a.t=0}}
 else if(a.ph===3){if(lfMove(a.med,p.x,p.z,3.4,dt)<2.4||a.t>6){scene.remove(a.med);a.med=null;a.ph=4;a.t=0}}
 else{const s=Math.min(16,2+a.t*6)*dt*a.dir;if(a.alongZ)p.z+=s;else p.x+=s;for(const w of a.m.userData.wheels)w.rotation.x+=dt*20;if(a.t>9||Math.hypot(p.x-pos.x,p.z-pos.z)>150){scene.remove(a.m);lfAmb=null}}}
// --- cinematic spawn camera
const lfBars=[0,1].map(i=>{const d=document.createElement('div');d.className='lf-keep';d.style.cssText='position:fixed;left:0;right:0;'+(i?'bottom':'top')+':0;height:0;background:#000;z-index:80;pointer-events:none;transition:height .55s ease';document.body.appendChild(d);return d});
const lfCard=document.createElement('div');lfCard.className='lf-keep';lfCard.style.cssText='position:fixed;left:7%;bottom:17%;z-index:81;pointer-events:none;color:#fff;opacity:0;transition:opacity .7s;text-shadow:0 2px 14px rgba(0,0,0,.8);font-family:Georgia,"Times New Roman",serif';
lfCard.innerHTML='<div style="font-size:12px;letter-spacing:6px;opacity:.85;font-family:-apple-system,sans-serif;font-weight:600">BLOCK CITY</div><div id="lfCardD" style="font-size:36px;font-style:italic;line-height:1.15"></div><div id="lfCardT" style="font-size:13px;letter-spacing:3px;opacity:.8;font-family:-apple-system,sans-serif;margin-top:4px"></div><div style="font-size:10px;letter-spacing:2px;opacity:.5;font-family:-apple-system,sans-serif;margin-top:14px">TAP TO SKIP</div>';document.body.appendChild(lfCard);
{const st=document.createElement('style');st.textContent='body.lf-cine>*:not(#g):not(.lf-keep){opacity:0!important;pointer-events:none!important}';document.head.appendChild(st)}
function lfDistrict(){if(lfLabel)return lfLabel;const x=pos.x,z=pos.z;if(x<-HALF-10)return 'Airport';if(z<-HALF-10)return 'Northgate';if(z>HALF+30)return 'The Hills';if(x>HALF)return 'Ocean Beach';const i=Math.round((x+HALF-ROAD/2-CELL/2)/CELL);if(i>=N-2)return 'Ocean Beach';if(i<=1)return 'Westside';if(Math.hypot(x,z)<HALF*.4)return 'Downtown';return 'Midtown'}
let lfLabel='';
function lfIntroStart(short){if(lfIntro)return;lfLabel='';if(!short){const c=window.chSpawn;if(c&&isFinite(c.x)&&isFinite(c.z)){pos.set(c.x,.3,c.z);vel.set(0,0,0);if(isFinite(c.yaw)){camYaw=c.yaw;facing=c.yaw}lfLabel=c.label||''}}lfIntro={t:0,dur:short?2.8:6.4,short:!!short,fn:scene.fog.near,ff:scene.fog.far,cf:cam.far,a:Math.random()*6.28};state='lfintro';document.body.classList.add('lf-cine');
 for(const b of lfBars)b.style.height='11%';document.getElementById('lfCardD').textContent=lfDistrict();const ck=$('clock');document.getElementById('lfCardT').textContent=(ck?ck.textContent:'').toUpperCase();lfCard.style.opacity=short?0:1;try{sfx(1.2,320,.25)}catch(e){}}
function lfIntroEnd(){const I=lfIntro;if(!I)return;lfIntro=null;scene.fog.near=I.fn;scene.fog.far=I.ff;cam.far=I.cf;cam.updateProjectionMatrix();if(state==='lfintro')state='play';document.body.classList.remove('lf-cine');for(const b of lfBars)b.style.height='0';lfCard.style.opacity=0;lfPrevState='play'}
addEventListener('touchstart',e=>{if(lfIntro&&lfIntro.t>.5){lfIntro.t=Math.max(lfIntro.t,lfIntro.dur-.9)}},true);addEventListener('keydown',()=>{if(lfIntro&&lfIntro.t>.5)lfIntro.t=Math.max(lfIntro.t,lfIntro.dur-.9)});
const lfCA=new THREE.Vector3(),lfCB=new THREE.Vector3(),lfCL=new THREE.Vector3();
function lfShot(k,a,out){const c=Math.cos(a),s=Math.sin(a);if(k===0)out.set(pos.x+c*30,235,pos.z+s*30+70);else if(k===1)out.set(pos.x+c*95,100,pos.z+s*95);else if(k===2)out.set(pos.x+c*34,30,pos.z+s*34);else{const h=2,dist=9;out.set(pos.x+Math.sin(camYaw)*Math.cos(camPitch)*dist,Math.max(1,pos.y+h+Math.sin(camPitch)*dist),pos.z+Math.cos(camYaw)*Math.cos(camPitch)*dist)}return out}
function lfCam(dt){
 if(lfIntro){const I=lfIntro;I.t+=dt;const t=I.t,D=I.dur;if(t>=D){lfIntroEnd();return}let k0,f;
  if(I.short){k0=2;f=t/D}else if(t<1.5){k0=0;f=-1}else if(t<3){k0=1;f=-1}else if(t<4.2){k0=2;f=-1}else{k0=2;f=(t-4.2)/(D-4.2)}
  const drift=I.a+t*.07;if(f<0){lfShot(k0,drift,lfCA)}else{const e=f*f*(3-2*f);lfShot(k0,drift,lfCA);lfShot(3,0,lfCB);lfCA.lerp(lfCB,e)}
  const e2=f<0?0:f*f*(3-2*f);cam.position.copy(lfCA);lfCL.set(pos.x,pos.y+2*e2+ (1-e2)*1,pos.z);cam.lookAt(lfCL);
  cam.far=I.cf+(1400-I.cf)*(1-e2);scene.fog.near=I.fn+(380-I.fn)*(1-e2);scene.fog.far=I.ff+(1300-I.ff)*(1-e2);cam.fov=65-(f<0?[18,10,4][k0]:4*(1-e2));cam.updateProjectionMatrix();
  if(sky){sky.position.copy(cam.position);stars.position.copy(cam.position)}if(!I.short&&t>D-1.6){for(const b of lfBars)b.style.height='0';lfCard.style.opacity=0}return}
 // premium feel in play: wider view at speed, slow push-in on a passed mission
 if(typeof msPassed!=='undefined'){if(lfPassed<0)lfPassed=msPassed;else if(msPassed>lfPassed){lfPassed=msPassed;lfPush=1.6}}
 lfPush=Math.max(0,lfPush-dt);let want=65;if(driving&&state==='play')want+=Math.min(13,Math.abs(driving.speed||0)*.26);if(lfPush>0)want-=7*Math.sin(Math.min(1,lfPush/1.6)*Math.PI);
 if(Math.abs(cam.fov-lfFovNow)>.6){lfFovNow=cam.fov;return}// someone else is driving the field of view right now
 const nf=lfFovNow+(want-lfFovNow)*Math.min(1,dt*2.5);if(Math.abs(nf-cam.fov)>.02){cam.fov=nf;cam.updateProjectionMatrix()}lfFovNow=cam.fov}
{const r0=respawn;respawn=function(){r0();try{if(state==='play'&&lfIntroDone)lfIntroStart(true)}catch(e){}}}
// --- master tick
MODS.push(function(dt){try{
  if(lfWantIntro&&state==='play'){lfWantIntro=false;lfIntroDone=true;lfIntroStart(false)}
  else if(!lfIntroDone&&lfPrevState==='ready'&&state==='play'){lfIntroDone=true;lfIntroStart(false)}lfPrevState=state;
  lfBubTick(dt);lfTrafficTick(dt);lfAmbTick(dt);
  if(state==='play'){lfPedTick(dt);lfCallTick(dt);lfCopTick(dt)}
 }catch(e){if(lfErr++<3)console.log('life error',e&&e.stack||e)}});

let lfWantIntro=false;addEventListener('bc-play',()=>{if(!lfIntroDone)lfWantIntro=true});

// ---------- military fighter jets at the army base (uses the airport flight model) ----------
const jtJets=[],jtMs=[];let jtMode=0,jtRel=0,jtLbl='';
if(typeof apT!=='undefined'&&typeof ldZ1!=='undefined'){
apT.fighter={len:13,r:.8,cy:1.75,wy:1.7,vs:24,vmax:135,acc:46,pr:.95,maxRoll:1.15,turn:1.3,camD:24,camH:3.4,tip:4.6,nose:6.6,gearUp:1};
const jtG=(()=>{const B=[],GR=[],N=[],C1=0x6f7a80,C2=0x545e63,C3=0x8d979c,Dk=0x10161b,Gy=0x8b9198,Tr=0x111111,PI=Math.PI;
 B.push(apFus(13,.8,1.75,C1,[[-.5,.03],[-.44,.3],[-.34,.62],[-.2,.9],[0,1],[.3,1],[.44,.86],[.5,.7]]));
 B.push(apFus(13,.8,1.75,C2,[[-.5,.03],[-.44,.3],[-.34,.62],[-.2,.9],[0,1],[.3,1],[.44,.86],[.5,.7]],undefined,undefined,-.5,-.36,1.02));
 const cg=new THREE.SphereGeometry(.6,12,8);cg.scale(.8,.78,2.4);B.push(apCol(gT(cg,0,2.28,-2.5),Dk));
 B.push(...apWing(4.6,5.4,1.1,3.9,.16,1.72,-1.7,C2),...apWing(2.5,2,.8,1.3,.1,1.78,4.1,C1));
 for(const s of[-1,1]){const f=apFin(2.5,1,1.7,2.4,.1,0,3.5,C2);f.rotateZ(-s*.3);f.translate(s*.8,2.2,0);B.push(f);
  B.push(apB(.75,.8,3.4,s*.95,1.55,-.6,C2),apB(.7,.74,.08,s*.95,1.55,-2.33,Tr),apCyl(.44,.52,1.1,12,s*.5,1.75,6.35,Dk,PI/2),apB(1.6,.03,1.5,s*2.1,1.9,1.3,C3),apB(1,.03,1,s*3.3,1.9,2.3,C1));
  for(const x of[2,3.2]){B.push(apCyl(.09,.09,2.2,6,s*x,1.47,1.2+x*.3,0xe6e8ea,PI/2),apCyl(.01,.09,.36,6,s*x,1.47,-.08+x*.3,0xb02323,PI/2),apB(.05,.18,.5,s*x,1.6,1.2+x*.3,Gy))}
  GR.push(apB(.1,.95,.1,s*1.15,.72,1.1,Gy),apCyl(.3,.3,.2,10,s*1.15,.3,1.1,Tr,0,0,PI/2))}
 GR.push(apB(.09,1,.09,0,.74,-3.7,Gy),apCyl(.26,.26,.18,10,0,.26,-3.7,Tr,0,0,PI/2));
 const nav=(x,y,z,r,g,b)=>N.push(apRGB(bxg(.22,.16,.22,x,y,z),r,g,b));nav(-4.6,1.76,2.7,3,.1,.1);nav(4.6,1.76,2.7,.1,3,.3);nav(0,1.9,6.6,3,3,3);
 const ab=new THREE.ConeGeometry(.4,3.2,10,1,true);ab.rotateX(Math.PI/2);ab.translate(0,0,1.6);
 return {body:U.mergeBufferGeometries(B),gear:U.mergeBufferGeometries(GR),lights:U.mergeBufferGeometries(N),ab}})();
const jtAbMat=new THREE.MeshBasicMaterial({color:new THREE.Color(3,1.3,.35),transparent:true,opacity:.85,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,side:THREE.DoubleSide});
function jtMake(x,z,yaw){const T=apT.fighter,g=new THREE.Group();g.rotation.order='YXZ';const b=new THREE.Mesh(jtG.body,apBodyMat);b.castShadow=true;g.add(b);const gear=new THREE.Mesh(jtG.gear,apBodyMat);g.add(gear);
 g.add(new THREE.Mesh(jtG.lights,apNavMat));const st=new THREE.Mesh(apStrobeGeo,apStrobeMat);st.position.set(0,T.cy+T.r+.1,0);st.scale.setScalar(T.r+.4);g.add(st);
 const ab=[];for(const s of[-1,1]){const a=new THREE.Mesh(jtG.ab,jtAbMat);a.position.set(s*.5,1.75,6.8);a.visible=false;g.add(a);ab.push(a)}
 g.position.set(x,0,z);g.rotation.y=yaw;g.userData.kind='plane';scene.add(g);
 const p={m:g,T,type:'fighter',speed:0,thr:0,hp:100,steer:0,custom:true,kind:'plane',camD:T.camD,camH:T.camH,dead:false,gear,props:[],strobe:st,home:['fighter',0,x,z,yaw,false],ai:null,air:false,vy:0,stolen:false,jt:true,jtAb:ab,jtDead:0};
 apPlanes.push(p);jtJets.push(p);return p}
const jtHome=[[-132,ldZ1+22,-Math.PI/2],[-84,ldZ1+41,-Math.PI/2],[-52,ldZ1+41,-Math.PI/2],[-20,ldZ1+41,-Math.PI/2]];
for(const h of jtHome)jtMake(h[0],h[1],h[2]);
setTimeout(function(){try{if(typeof mpIcons!=='undefined')for(const p of jtJets)mpIcons.push({x:p.m.position.x,z:p.m.position.z,label:'Fighter jet',color:'#9fb0b8',glyph:'✈',obj:p.m})}catch(e){}},0);
{const nc=nearestCar;nearestCar=function(peek){const r=nc(peek);if(!peek&&r&&r.jt&&!r.jtS){r.jtS=true;wantedScore=Math.max(wantedScore,16);ldAlert=25;jtMode=0;toast('STOLE A FIGHTER JET!'+(vhKbLast?'':' Hold JUMP for throttle'))}return r}}
function jtAim(o,d,range,cos,hostileOnly){let best=null,bs=1e9;for(const t of allTargets()){if(hostileOnly&&!t.hostile)continue;const v=t.p.clone().sub(o),L=v.length();if(L<4||L>range)continue;const c=v.dot(d)/L;if(c<cos)continue;const s=L*(1.2-c);if(s<bs){bs=s;best=t}}return best}
function jtFire(){const c=driving,m=c.m,d=apFwd(m),o=m.position.clone().add(new THREE.Vector3(0,1.6,0)).addScaledVector(d,7);
 if(jtMode===1){if(jtRel>0){fireCD=.15;return}jtRel=2.6;fireCD=.3;const mesh=new THREE.Mesh(rkGeo,rkMat);mesh.scale.setScalar(1.6);mesh.position.copy(o);scene.add(mesh);
  let t=null;if(lockObj)for(const q of allTargets())if(q.obj===lockObj)t=q;if(!t)t=jtAim(o,d,320,.6,true)||jtAim(o,d,260,.93,false);
  jtMs.push({m:mesh,d:d.clone(),sp:Math.max(70,c.speed+40),l:6,t:t?t.obj:null});sfx(.7,900,.7);toast(t?'Missile locked':'Missile away');return}
 fireCD=.07;const t=jtAim(o,d,170,.988,false);let end;if(t){end=t.p.clone();damage(t,1.3)}else{end=o.clone().addScaledVector(d,170);if(d.y<-.02){const k=Math.min(170,(o.y-.2)/-d.y);end=o.clone().addScaledVector(d,k);if(k<170)burst(end,3,0xc9b98a,5,.3,.35)}}
 for(const s of[-.5,.5])tracer(o.clone().add(new THREE.Vector3(Math.cos(m.rotation.y)*s,0,-Math.sin(m.rotation.y)*s)),end);sfx(.12,2600,.4);shake=Math.max(shake,.05)}
{const sh=shoot;shoot=function(){if(driving&&driving.jt&&state==='play'){jtFire();return}sh()}}
{const cw=cycleWeapon;cycleWeapon=function(){if(driving&&driving.jt){jtMode=1-jtMode;toast(jtMode?'MISSILES':'CANNON');beep(900,.06,.1);return}cw()}}
MODS.push(function(dt){jtRel-=dt;
 for(const p of jtJets){const on=!p.dead&&p.thr>.55;for(const a of p.jtAb){a.visible=on;if(on)a.scale.set(1,1,(p.thr-.4)*1.6*(.85+Math.random()*.3))}
  if(p.dead){p.jtDead+=dt;if(p.jtDead>150&&Math.hypot(p.home[2]-pos.x,p.home[3]-pos.z)>140){const i=apPlanes.indexOf(p);if(i>=0)apPlanes.splice(i,1);jtJets.splice(jtJets.indexOf(p),1);scene.remove(p.m);jtMake(p.home[2],p.home[3],p.home[4]);break}}}
 for(let i=jtMs.length-1;i>=0;i--){const q=jtMs[i],mp=q.m.position;q.l-=dt;q.sp=Math.min(190,q.sp+140*dt);let tp=null;if(q.t)for(const t of allTargets())if(t.obj===q.t){tp=t;break}
  if(tp){const w=tp.p.clone().sub(mp).normalize();q.d.lerp(w,Math.min(1,dt*4.5)).normalize()}
  mp.addScaledVector(q.d,q.sp*dt);q.m.lookAt(mp.clone().add(q.d));burst(mp,1,0xffb347,1,.35,.15);burst(mp,1,0x9a9a9a,1,.6,.7,.4);
  let hit=q.l<=0||mp.y<.3;if(!hit&&tp&&tp.p.distanceTo(mp)<5){hit=true;try{damage(tp,60)}catch(e){}}if(!hit&&q.l<5.6){const g=new THREE.Vector3(mp.x,0,mp.z);for(const s of solids)if(mp.y<s.h&&g.x>s.minX&&g.x<s.maxX&&g.z>s.minZ&&g.z<s.maxZ){hit=true;break}}
  if(hit){explode(mp.clone());scene.remove(q.m);jtMs.splice(i,1)}}
 const inJ=driving&&driving.jt&&state==='play';if(inJ){const l='<div>'+(jtMode?'MISSILE':'CANNON')+'<br><small>'+(jtMode?(jtRel>0?'...':'RDY'):'∞')+'</small></div>';$('wpn').innerHTML=l}});
}

// ---------- fixes: map edges, calmer siren ----------
function fxBounds(c,m){const k=m.userData.kind;if(c.custom||c.vhT==='heli'||c.vhT==='boat'||k==='heli'||k==='boat'||k==='plane')return;const p=m.position,L=HALF+24;
 if(p.z>L){p.z=L;c.speed*=.4}if(p.z<-L){p.z=-L;c.speed*=.4}if(p.x<-L&&!fxWest(p)){p.x=-L;c.speed*=.4}}
function fxWest(p){return typeof apWestOK==='function'&&apWestOK(p)}
MODS.push(function(dt){if(!driving)return;const c=driving,m=c.m,k=m.userData.kind;if(c.custom||c.vhT==='heli'||c.vhT==='boat'||k==='heli'||k==='boat'||k==='plane')return;
 if(m.position.x>HALF+42&&!(typeof wdPierH==='function'&&wdPierH(m.position.x,m.position.z)>=0)){burst(m.position.clone().setY(.4),26,0xd8ecff,9,.5,.9,1);sfx(.8,700,.7);c.dead=true;c.speed=0;m.visible=false;driving=null;player.visible=true;pos.set(HALF+37,0.3,m.position.z);vel.set(0,0,0);toast('Your car sank!')}});
{const s0=sirenTick;sirenTick=function(v){s0(v*(((T%8)<1.5)?.3:0))}}
MODS.push(function(){if(driving){const u=driving.m.userData;if(!u.kind)u.kind=driving.vhT||(u.wheels&&u.wheels.length===2?'bike':'car')}});

// ---- v5 fixes ----
// damage goes to the vehicle first; no vehicle health bar

// tap the minimap to expand it
let fxBig=false;const fxMapEl=$('map');
{const dm=drawMap;drawMap=function(){const g=mapC;if(!fxBig){dm();return}const C=720,z=C/(260*2.2);g.setTransform(1,0,0,1,0,0);g.fillStyle='#2e6b33';g.fillRect(0,0,C,C);g.setTransform(z,0,0,z,C/2-130*z,C/2-130*z);
  g.clip=function(){};g.stroke=function(){};g.clearRect=function(){};try{dm()}finally{delete g.clip;delete g.stroke;delete g.clearRect;g.setTransform(1,0,0,1,0,0)}
  g.fillStyle='#fff';g.font='bold 26px -apple-system,sans-serif';g.textAlign='center';g.fillText('TAP TO CLOSE',C/2,C-18)}}
function fxToggleMap(){fxBig=!fxBig;const W=Math.round(Math.min(innerWidth,innerHeight)*.94);fxMapEl.width=fxMapEl.height=fxBig?720:260;
 fxMapEl.style.cssText=fxBig?('left:50%;top:50%;right:auto;width:'+W+'px;height:'+W+'px;margin:'+(-W/2)+'px 0 0 '+(-W/2)+'px;border-radius:18px;z-index:60'):'';drawMap()}
fxMapEl.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(state==='play')fxToggleMap()},{passive:false});
fxMapEl.addEventListener('mousedown',e=>{e.stopPropagation();if(state==='play')fxToggleMap()});fxMapEl.addEventListener('click',e=>e.stopPropagation());
// clearer mission pointer: big flat arrow floating ahead of the player + screen-edge marker with distance
{const sh=new THREE.Shape();sh.moveTo(0,2);sh.lineTo(1.5,0);sh.lineTo(.6,0);sh.lineTo(.6,-1.6);sh.lineTo(-.6,-1.6);sh.lineTo(-.6,0);sh.lineTo(-1.5,0);sh.closePath();
 const g=new THREE.ExtrudeGeometry(sh,{depth:.2,bevelEnabled:false});g.scale(.55,.55,1);g.translate(0,3.6,2.3);arrow.geometry=g;arrow.material.depthTest=false;arrow.material.toneMapped=false;arrow.material.transparent=true;arrow.renderOrder=999;
 const o=new THREE.Mesh(g.clone().scale(1,1,1),new THREE.MeshBasicMaterial({color:0x000000,depthTest:false,transparent:true,opacity:.75}));o.geometry.translate(0,-3.6,0).scale(1.3,1.22,1).translate(0,3.6+.03,.02);o.renderOrder=998;arrow.add(o)}
const fxPt=document.createElement('div');fxPt.style.cssText='position:fixed;left:0;top:0;pointer-events:none;z-index:5;display:none;text-align:center;font-weight:900;font-size:13px;color:#fff;text-shadow:0 1px 3px #000,0 0 6px #000;width:70px;margin:-26px 0 0 -35px';
fxPt.innerHTML='<div id="fxPa" style="font-size:30px;line-height:30px">&#9650;</div><div id="fxPd"></div>';document.body.appendChild(fxPt);
MODS.push(function(dt){arrow.material.opacity=.75+.25*Math.sin(T*6);
 if(state!=='play'||(!beam.visible&&!fxHasWay())||fxBig){fxPt.style.display='none';return}
 const v=new THREE.Vector3(fxTgt().x,3,fxTgt().z).project(cam);let x=v.x,y=v.y;const behind=v.z>1;if(behind){x=-x;y=-y}
 const off=behind||Math.abs(x)>.86||Math.abs(y)>.8;let ang=0;if(off){const k=1/Math.max(Math.abs(x)/.86,Math.abs(y)/.8,1e-3);if(behind&&Math.abs(x)<.86&&Math.abs(y)<.8){const n=Math.hypot(x,y)||1;x=x/n;y=y/n}const k2=1/Math.max(Math.abs(x)/.86,Math.abs(y)/.8,1e-3);x*=k2;y*=k2;ang=Math.atan2(x,y)}
 const col='#'+beamMat.color.getHexString();fxPt.style.display='block';fxPt.style.left=((x+1)/2*innerWidth)+'px';fxPt.style.top=((1-y)/2*innerHeight)+'px';
 const a=document.getElementById('fxPa');a.style.color=col;a.style.transform='rotate('+ang+'rad)';a.innerHTML=off?'&#9650;':'&#9660;';document.getElementById('fxPd').textContent=Math.round(Math.hypot(fxTgt().x-pos.x,fxTgt().z-pos.z))+' m'});
// clear burnt wrecks once you leave, and park a fresh car somewhere else
MODS.push(function(dt){for(let i=cars.length-1;i>=0;i--){const c=cars[i];if(!c.dead||c===driving)continue;c.fxW=(c.fxW||0)+dt;if(c.fxW>45&&Math.hypot(c.m.position.x-pos.x,c.m.position.z-pos.z)>90){scene.remove(c.m);cars.splice(i,1);
  if(!c.vhT&&!c.vhBike&&!c.custom&&cars.length<70){const m=makeCar(carColors[Math.floor(Math.random()*carColors.length)]),a=Math.floor(Math.random()*(N+1)),b=Math.floor(Math.random()*N);m.position.set(roadCenter(a)+ROAD/2-1.6,0,roadCenter(b)+CELL/2+(Math.random()-.5)*20);m.rotation.y=Math.PI;if(Math.hypot(m.position.x-pos.x,m.position.z-pos.z)>80){scene.add(m);cars.push({m,speed:0,steer:0})}}}}});

{let lb='';MODS.push(function(){const h=driving&&driving.vhT==='heli',l=h?'UP':(driving&&driving.m.userData.kind==='plane'?'GAS':(driving&&!driving.vhT?'BOOST':'JUMP'));if(l!==lb){lb=l;$('jump').textContent=l;const d=document.getElementById('vhdn');if(d)d.style.display=h?'flex':'none'}if(!h&&typeof vhDown!=='undefined')vhDown=false})}

// parachute: bail out of a helicopter (or anything else) in the air; opens by itself when you fall from height
const fxChute=new THREE.Group();{const cols=[0xff4d3d,0xffffff];for(let k=0;k<8;k++){const c=new THREE.Mesh(new THREE.SphereGeometry(3,6,8,k*Math.PI/4,Math.PI/4,0,Math.PI*.42),new THREE.MeshStandardMaterial({color:cols[k%2],roughness:.8,side:THREE.DoubleSide}));c.castShadow=true;fxChute.add(c)}
 const lm=new THREE.LineBasicMaterial({color:0x222222}),pts=[];for(let k=0;k<8;k++){const a=k*Math.PI/4;pts.push(new THREE.Vector3(Math.cos(a)*2.9,.75,Math.sin(a)*2.9),new THREE.Vector3(0,-3.2,0))}fxChute.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),lm));fxChute.visible=false;scene.add(fxChute)}
let fxChOpen=false,fxVy=0,fxWasGround=true;
MODS.push(function(dt){
 if(carQ&&driving&&state==='play'&&driving.vhT==='heli'&&driving.m.position.y>3){carQ=false;const m=driving.m,h=m.position.y;driving.speed=0;driving=null;player.visible=true;pos.set(m.position.x+Math.cos(m.rotation.y)*2.6,h-.5,m.position.z-Math.sin(m.rotation.y)*2.6);vel.set(0,-1,0);onGround=false;toast(h>12?'PARACHUTE!':'Jumped out')}
 if(driving||state!=='play'){fxChOpen=false;fxChute.visible=false;fxWasGround=true;fxVy=0;return}
 if(!onGround){if(!fxChOpen&&pos.y>11&&vel.y<-7){fxChOpen=true;sfx(.5,900,.5)}if(fxChOpen){vel.y=Math.max(vel.y,-5+30*dt);if(pos.y<1.2)fxChOpen=false}fxVy=fxChOpen?0:vel.y}
 else{if(!fxWasGround&&fxVy<-24)hurt((-fxVy-24)*2.6);fxChOpen=false;fxVy=0}
 fxWasGround=onGround;fxChute.visible=fxChOpen;if(fxChOpen){fxChute.position.set(pos.x,pos.y+5.6,pos.z);fxChute.rotation.y=facing;fxChute.rotation.z=Math.sin(T*1.5)*.06}});



// the pointer follows your own map marker when one is set, otherwise the mission
function fxHasWay(){return typeof mpWay!=='undefined'&&!!mpWay}
function fxTgt(){return fxHasWay()?mpWay:mission.target}
if(typeof cpPh!=='undefined'){cpPh.style.left='14px';cpPh.style.top='calc(env(safe-area-inset-top,0px) + 70px)';cpPh.style.width='44px';cpPh.style.height='44px'}
// ---- show, don't tell: only essential text reaches the screen ----
// Events you can already see or hear (crashes, police arriving, landings, place names, a mugging...) stay silent on screen; their sound cues still play.
// Control hints show the first two times only. Money, mission objectives, shops and settings messages are unchanged.
const fxQuiet=/^(CRASH!|BUMP!|RAMMED!|WIPED OUT|CARJACKED!|STOLE A COP CAR!|Got out|Jumped out|POLICE ARE COMING|Lost the cops|Witness silenced|Someone called the police|MUGGER!|The mugger got away|HD |TIRES BLOWN|ROADBLOCK AHEAD|POLICE HELICOPTER INBOUND|SWAT TEAM!|ARMY!|Helicopter hit!|Clerk down|The clerk has a shotgun|Touchdown|Nice landing|Hard landing|OUCH!|Rough landing|Street level|Roof helipad|Ashore|Club Neon|Police station|Bold move walking in here|Turning back to the city|BAILED OUT!|Waypoint reached|RESTRICTED AREA|ON FIRE|GO GO GO|Rain rolling in|Your car sank|(PISTOL|SMG|SHOTGUN|ROCKET)$|Passenger: "(LET ME OUT|Watch))/;
const fxHint=/^(Driving! Push up|Get closer to|Boat! Push up|Hold to bail out|UP to climb|Parachute open|PARACHUTE!|Hold FIRE on the clerk|Walk up to the|Get out and walk in|See the agent|STOLE AN AIRLINER|STOLE A FIGHTER JET|Bring a car to the body shop|You need a car for)/;
let fxHints={};try{fxHints=JSON.parse(localStorage.getItem('blockcity_hints')||'{}')||{}}catch(e){}
function fxToastOk(s){s=String(s);if(fxQuiet.test(s))return false;const m=s.match(fxHint);if(m){const k=m[1];fxHints[k]=(fxHints[k]||0)+1;try{localStorage.setItem('blockcity_hints',JSON.stringify(fxHints))}catch(e){}return fxHints[k]<=2}return true}
{const t0=toast;toast=function(s){if(fxToastOk(s)){t0(s);return}const el=$('toast'),tx=el.textContent,op=el.style.opacity;t0(s);el.textContent=tx;el.style.opacity=op}}

// ---------- keyboard for desktop play (Roblox defaults: WASD move, Up/Down arrows move, Left/Right arrows turn the camera, Space jump) ----------
// In any vehicle every arrow key goes to the vehicle (steering, and the flight controls in planes, helicopters and jets), never to the camera.
const inKeys={};
{const K=inKeys,typing=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]');
 const mv=()=>{if(joy.id!==null&&joy.id!=='kb')return;const veh=!!driving,x=Math.max(-1,Math.min(1,(K.d?1:0)-(K.a?1:0)+(veh?(K.arrowright?1:0)-(K.arrowleft?1:0):0))),y=Math.max(-1,Math.min(1,(K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0)));
  if(x||y){joy.id='kb';joy.x=x;joy.y=y}else if(joy.id==='kb'){joy.id=null;joy.x=joy.y=0}};
 addEventListener('keydown',e=>{if(typing(e))return;const k=e.key.toLowerCase();if(state==='ready'&&(k==='enter'||k===' ')){state='play';$('msg').style.display='none';audio()}K[k]=1;mv();if(k===' '){jumpQ=true;e.preventDefault()}if(k.indexOf('arrow')===0)e.preventDefault()});
 addEventListener('keyup',e=>{K[e.key.toLowerCase()]=0;mv()});addEventListener('blur',()=>{for(const k in K)K[k]=0;mv()});
 // per frame: keep the key-driven stick in step (getting in or out of a vehicle changes what the arrows do) and turn the camera with Left/Right on foot
 MODS.push(function(dt){mv();if(state!=='play'||driving)return;const r=(K.arrowleft?1:0)-(K.arrowright?1:0);if(r)camYaw+=r*2.4*dt})}

// ---------- map: radar with water + fog of war, full-screen labelled map with pan/zoom, waypoint ----------
const mpX0=-HALF-272,mpX1=HALF+650,mpZ0=-HALF-262,mpZ1=HALF+380,mpCell=16,mpSK=1.25;
const mpCols=Math.ceil((mpX1-mpX0)/mpCell),mpRows=Math.ceil((mpZ1-mpZ0)/mpCell);
const mpFog=new Uint8Array(mpCols*mpRows),mpPlay=new Uint8Array(mpCols*mpRows);
const mpIcons=[],mpLabels=[];   // other modules may push: mpIcons {x,z,label,color,glyph,obj?}  mpLabels {x,z,text,size(0 small,1 district,2 region),hidden?}
const mpHasLand=typeof ldLandOK==='function',mpHasAp=typeof apAX!=='undefined',mpHasPier=typeof wdPX0!=='undefined';
let mpOpen=false,mpWay=null,mpK=1.15,mpCX=0,mpCZ=0,mpDirty=false,mpSeen=0,mpTotal=0,mpLegendOn=false,mpW=300,mpH=300,mpDpr=1,mpRevT=0,mpSaveT=15,mpDrawT=0;
const mpParks=[[5,5],[1,8],[8,1],[2,2],[8,6],[4,9]];
function mpZone(x,z){if(Math.abs(x)>HALF||Math.abs(z)>HALF)return 'out';const i=Math.max(0,Math.min(N-1,Math.floor((x+HALF)/CELL))),j=Math.max(0,Math.min(N-1,Math.floor((z+HALF)/CELL)));if(i>=N-2)return 'beach';if(i<=1)return 'sub';return Math.hypot(roadCenter(i)+CELL/2,roadCenter(j)+CELL/2)<HALF*.4?'down':'mid'}
// draws the whole world in world units (the context is already transformed); b = optional [x0,z0,x1,z1] to skip buildings outside the view
function mpDrawWorld(g,b){const BIG=1800,zh=(mpZ1-mpZ0)+BIG*2;
 g.fillStyle='#3d7a43';g.fillRect(mpX0-BIG,mpZ0-BIG,(mpX1-mpX0)+BIG*2,zh);
 if(mpHasAp){g.fillStyle='#4f8f52';g.fillRect(apAX-252,-172,238,344)}
 if(mpHasLand){g.fillStyle='#8f8058';g.fillRect(-HALF-40,HALF+40,SIZE+80,170);g.fillStyle='#7c6d49';for(let k=0;k<9;k++){g.beginPath();g.ellipse(-HALF+30+k*72,HALF+95+(k%3)*28,46,24,0,0,7);g.fill()}g.fillStyle='#a3956c';for(let k=0;k<8;k++){g.beginPath();g.ellipse(-HALF+66+k*72,HALF+150-(k%2)*30,30,14,0,0,7);g.fill()}
  g.fillStyle='#6f7552';g.fillRect(-170,-HALF-240,340,220);g.strokeStyle='#23261a';g.lineWidth=2.5;g.strokeRect(-170,-HALF-240,340,220);g.fillStyle='#565a61';g.fillRect(-7,-HALF-22,14,24)}
 g.fillStyle='#e2d29a';g.fillRect(HALF,mpZ0-BIG,42,zh);g.fillStyle='#2f86d6';g.fillRect(HALF+40,mpZ0-BIG,BIG*2,zh);g.fillStyle='#4a9be6';g.fillRect(HALF+40,mpZ0-BIG,7,zh);
 if(mpHasAp){g.fillStyle='#777b80';g.fillRect(apAX-134,-120,64,270);g.fillStyle='#3a3d42';g.fillRect(apTX-6,-150,12,300);for(const z of[-140,0,140])g.fillRect(apRX+12,z-6,32,12);g.fillRect(apAX-70,74,70,14);
  g.fillStyle='#222428';g.fillRect(apRX-12,-150,24,300);g.fillStyle='#fff';for(let z=-120;z<=120;z+=40)g.fillRect(apRX-.6,z-8,1.2,16)}
 g.fillStyle='#565a61';g.fillRect(-HALF,-HALF,SIZE,SIZE);
 const bc={mid:'#8a9094',down:'#7d8b9a',beach:'#cdb5a8',sub:'#8fae7f'};
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){const x=roadCenter(i)+ROAD/2,z=roadCenter(j)+ROAD/2;let park=false;for(const p of mpParks)if(p[0]===i&&p[1]===j)park=true;g.fillStyle=park?'#49b356':bc[mpZone(x+BLOCK/2,z+BLOCK/2)];g.fillRect(x,z,BLOCK,BLOCK)}
 if(mpHasPier){g.fillStyle='#8a6b45';g.fillRect(wdPX0,wdPZ-4.5,wdPX2-14-wdPX0,9);g.fillRect(wdPX2-14,wdPZ-8,14,16)}
 if(typeof isMapShapes!=='undefined'){try{for(const q of isMapShapes){g.fillStyle=q.c;g.strokeStyle=q.c;if(q.k==='e'){g.beginPath();g.ellipse(q.x,q.z,q.a,q.b,0,0,7);g.fill()}else if(q.k==='r')g.fillRect(q.x-q.a,q.z-q.b,q.a*2,q.b*2);else if(q.k==='c'){g.beginPath();g.arc(q.x,q.z,q.a,0,7);g.fill()}else if(q.k==='b'){g.lineWidth=q.w||6;g.beginPath();g.moveTo(q.x0,q.z0);g.lineTo(q.x1,q.z1);g.stroke()}}}catch(e){}}
 const sc={mid:'#c6c9cf',down:'#a3bbd4',beach:'#f3c3d3',sub:'#e6d2b0',out:'#b9bcc2'};let last='';
 for(const s of solids){if(s.h<=4)continue;if(b&&(s.maxX<b[0]||s.minX>b[2]||s.maxZ<b[1]||s.minZ>b[3]))continue;const c=sc[mpZone((s.minX+s.maxX)/2,(s.minZ+s.maxZ)/2)];if(c!==last){g.fillStyle=c;last=c}g.fillRect(s.minX,s.minZ,s.maxX-s.minX,s.maxZ-s.minZ)}}
const mpStatic=document.createElement('canvas');
function mpBuildStatic(){mpStatic.width=Math.round((mpX1-mpX0)*mpSK);mpStatic.height=Math.round((mpZ1-mpZ0)*mpSK);const g=mpStatic.getContext('2d');g.setTransform(mpSK,0,0,mpSK,-mpX0*mpSK,-mpZ0*mpSK);mpDrawWorld(g)}
mpBuildStatic();
// ----- fog of war -----
const mpFogC=document.createElement('canvas');mpFogC.width=mpCols;mpFogC.height=mpRows;const mpFogG=mpFogC.getContext('2d');
function mpFogPaint(){mpFogG.clearRect(0,0,mpCols,mpRows);mpFogG.fillStyle='rgba(6,9,16,.9)';mpFogG.fillRect(0,0,mpCols,mpRows);mpSeen=0;for(let i=0;i<mpFog.length;i++)if(mpFog[i]){mpFogG.clearRect(i%mpCols,Math.floor(i/mpCols),1,1);if(mpPlay[i])mpSeen++}}
{for(let r=0;r<mpRows;r++)for(let c=0;c<mpCols;c++){const x=mpX0+(c+.5)*mpCell,z=mpZ0+(r+.5)*mpCell;let p=(Math.abs(x)<=HALF+30&&Math.abs(z)<=HALF+30)||(x>HALF&&x<HALF+112&&Math.abs(z)<=HALF+30);if(mpHasAp&&x>apAX-252&&x<apAX&&Math.abs(z)<172)p=true;if(mpHasLand&&((Math.abs(x)<170&&z>-HALF-240&&z<-HALF)||(Math.abs(x)<HALF&&z>HALF&&z<HALF+200)))p=true;if(p){mpPlay[r*mpCols+c]=1;mpTotal++}}}
function mpReveal(x,z,r){let n=0;const c0=Math.max(0,Math.floor((x-r-mpX0)/mpCell)),c1=Math.min(mpCols-1,Math.floor((x+r-mpX0)/mpCell)),r0=Math.max(0,Math.floor((z-r-mpZ0)/mpCell)),r1=Math.min(mpRows-1,Math.floor((z+r-mpZ0)/mpCell));
 for(let rr=r0;rr<=r1;rr++)for(let c=c0;c<=c1;c++){const i=rr*mpCols+c;if(mpFog[i])continue;if(Math.hypot(mpX0+(c+.5)*mpCell-x,mpZ0+(rr+.5)*mpCell-z)<=r){mpFog[i]=1;mpFogG.clearRect(c,rr,1,1);n++;if(mpPlay[i])mpSeen++}}
 if(n)mpDirty=true;return n}
function mpSeenAt(x,z){const c=Math.floor((x-mpX0)/mpCell),r=Math.floor((z-mpZ0)/mpCell);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const cc=c+a,rr=r+b;if(cc>=0&&rr>=0&&cc<mpCols&&rr<mpRows&&mpFog[rr*mpCols+cc])return true}return false}
function mpPct(){return mpTotal?Math.min(100,Math.round(mpSeen/mpTotal*100)):0}
function mpSave(){try{let s='';for(let i=0;i<mpFog.length;i+=8){let v=0;for(let k=0;k<8;k++)if(mpFog[i+k])v|=1<<k;s+=String.fromCharCode(v)}localStorage.setItem('blockcity_map',JSON.stringify({v:1,c:mpCols,r:mpRows,d:btoa(s),w:mpWay,h:localStorage.getItem('blockcity_save')!==null}));mpDirty=false}catch(e){}}
function mpLoad(){try{const o=JSON.parse(localStorage.getItem('blockcity_map')||'null');if(!o||o.c!==mpCols||o.r!==mpRows)return;
  if(o.h&&localStorage.getItem('blockcity_save')===null){localStorage.removeItem('blockcity_map');return}   // game save was wiped: start the map over too
  const s=atob(o.d);for(let i=0;i<mpFog.length;i++)mpFog[i]=(s.charCodeAt(i>>3)>>(i&7))&1;if(o.w&&typeof o.w.x==='number')mpWay={x:o.w.x,z:o.w.z}}catch(e){}}
function mpResetFog(){mpFog.fill(0);mpFogPaint();mpWay=null;mpDirty=true;mpSave()}
mpLoad();mpFogPaint();mpReveal(pos.x,pos.z,55);
// ----- icons and labels -----
if(typeof msShops!=='undefined')for(const s of msShops)mpIcons.push({x:s.x,z:s.z,label:s.kind==='gun'?'Gun shop':(s.kind==='body'?'Body shop':'Clinic'),color:s.css,glyph:s.kind==='gun'?'G':(s.kind==='body'?'S':'+')});
if(typeof vhHelis!=='undefined')for(const h of vhHelis)mpIcons.push({x:h.m.position.x,z:h.m.position.z,label:'Helipad',color:'#ffd23f',glyph:'H'});
if(typeof vhBoats!=='undefined')for(const b of vhBoats)mpIcons.push({obj:b.m,x:0,z:0,label:'Boat',color:'#7fd4ff',glyph:'B',ent:b});
if(mpHasAp)mpIcons.push({x:apAX-36,z:81,label:'Airport',color:'#e8f4ff',glyph:'A'});
const mpSp=t=>t.split('').join('  ');
{const L=(x,z,text,size,q)=>mpLabels.push({x,z,text,size,q:q||null});const pc=(i,j)=>[roadCenter(i)+CELL/2,roadCenter(j)+CELL/2];
 L(roadCenter(5)+CELL/2,roadCenter(4)+CELL/2-4,'DOWNTOWN',1);L(roadCenter(10)-2,roadCenter(3)+CELL/2,'CORAL BEACH',1);L(roadCenter(1),roadCenter(5)+CELL/2,'PALM HOLLOW',1);
 L(roadCenter(5)+CELL/2,roadCenter(1),'NORTHGATE',1);L(roadCenter(6),roadCenter(9)+CELL/2+6,'SOUTH MARKET',1);L(roadCenter(8),roadCenter(5)-4,'LITTLE NEON',1);L(roadCenter(3),roadCenter(4),'MIDTOWN WEST',1);
 if(typeof turf!=='undefined'&&turf.length){let x=0,z=0;for(const t of turf){x+=t[0];z+=t[1]}L(x/turf.length,z/turf.length,'VIOLET ROW',1)}
 const pn=['Fountain Park','Heron Park','Bayside Green','Oak Common','Arcade Gardens','Southfield Park'];mpParks.forEach((p,k)=>{const c=pc(p[0],p[1]);L(c[0],c[1]+15,pn[k],0)});
 L(HALF+118,roadCenter(8),'AZURE BAY',2);if(mpHasPier)L((wdPX0+wdPX2)/2,wdPZ-14,'Sunset Pier',0);
 if(mpHasAp)L(apAX-130,-186,'BLOCK CITY AIRPORT',2,'???');
 if(mpHasLand){L(0,-HALF-128,'RESTRICTED AREA',2,'???');L(0,HALF+122,'STARGAZER HILLS',2,'???')}}
const mpAve=['Marlin Ave','Coral Way','Palmetto Ave','Flamingo Dr','Neon Blvd','Vista Ave','Grand Central Ave','Starlight Blvd','Pelican Ave','Tangerine Ave','Seabreeze Dr','Ocean Front Dr'];
const mpOrd=n=>n+(n%10===1&&n!==11?'st':(n%10===2&&n!==12?'nd':(n%10===3&&n!==13?'rd':'th')))+' St';
// ----- radar (minimap) -----
{const dm=drawMap,noop=function(){},P=CanvasRenderingContext2D.prototype,skip={'#aaaaaa':1,'#555555':1,'#2e6b33':1,'#777b80':1,'#3a3d42':1,'#222428':1};
 const filt=function(x,y,w,h){const f=this.fillStyle;if(skip[f]||(f==='#ffffff'&&Math.min(Math.abs(w),Math.abs(h))<2.2))return;P.fillRect.call(this,x,y,w,h)};
 drawMap=function(){const g=mapC;if(typeof fxBig!=='undefined'&&fxBig){dm();return}const S=260,sc=S/215,R0=S/2,th=camYaw;
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,S,S);g.save();g.beginPath();g.arc(R0,R0,R0,0,7);g.clip();g.fillStyle='#3d7a43';g.fillRect(0,0,S,S);
  g.translate(R0,R0);g.rotate(th);g.translate(-pos.x*sc,-pos.z*sc);g.fillStyle='#2f86d6';g.fillRect((HALF+40)*sc,(pos.z-400)*sc,2400*sc,800*sc);
  const R=160,ax=Math.max(mpX0,pos.x-R),bx=Math.min(mpX1,pos.x+R),az=Math.max(mpZ0,pos.z-R),bz=Math.min(mpZ1,pos.z+R);
  if(bx>ax+1&&bz>az+1){g.drawImage(mpStatic,(ax-mpX0)*mpSK,(az-mpZ0)*mpSK,(bx-ax)*mpSK,(bz-az)*mpSK,ax*sc,az*sc,(bx-ax)*sc,(bz-az)*sc);
   g.imageSmoothingEnabled=true;g.drawImage(mpFogC,(ax-mpX0)/mpCell,(az-mpZ0)/mpCell,(bx-ax)/mpCell,(bz-az)/mpCell,ax*sc,az*sc,(bx-ax)*sc,(bz-az)*sc)}
  g.restore();
  g.clearRect=noop;g.fillRect=filt;try{dm()}finally{delete g.clearRect;delete g.fillRect}
  if(mpWay){let dx=(mpWay.x-pos.x)*sc,dz=(mpWay.z-pos.z)*sc,X=dx*Math.cos(th)-dz*Math.sin(th),Y=dx*Math.sin(th)+dz*Math.cos(th);const d=Math.hypot(X,Y),m=R0-15;if(d>m){X*=m/d;Y*=m/d}
   g.save();g.translate(R0+X,R0+Y);g.rotate(Math.PI/4);g.fillStyle='#ff3df0';g.strokeStyle='#fff';g.lineWidth=2.5;g.fillRect(-7,-7,14,14);g.strokeRect(-7,-7,14,14);g.restore()}
  const nx=R0+Math.sin(th)*(R0-14),ny=R0-Math.cos(th)*(R0-14);g.fillStyle='rgba(10,14,22,.85)';g.beginPath();g.arc(nx,ny,12,0,7);g.fill();g.fillStyle='#ff5a4d';g.font='bold 17px -apple-system,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('N',nx,ny+1)}}
// ----- full map overlay -----
{const st=document.createElement('style');st.textContent='#mpWrap{position:fixed;left:0;top:0;right:0;bottom:0;z-index:80;display:none;background:rgba(4,7,12,.84);font-family:-apple-system,system-ui,sans-serif;color:#fff;-webkit-user-select:none;user-select:none}#mpC{position:absolute;left:10px;top:10px;border-radius:16px;box-shadow:0 0 0 2px rgba(255,255,255,.3),0 10px 40px rgba(0,0,0,.6);background:#0b1016}.mpB{position:absolute;width:46px;height:46px;border-radius:14px;background:rgba(14,21,32,.82);border:1.5px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:23px;color:#fff;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}#mpHead{position:absolute;left:calc(env(safe-area-inset-left,0px) + 22px);top:22px;font-weight:900;font-size:15px;letter-spacing:2px;text-shadow:0 1px 4px #000;pointer-events:none;background:rgba(14,21,32,.78);border:1.5px solid rgba(255,255,255,.25);border-radius:14px;padding:8px 13px}#mpHead small{display:block;font-size:11px;letter-spacing:1px;color:#9fd0ff;font-weight:700;margin-top:2px}#mpHint{position:absolute;left:0;right:0;bottom:18px;text-align:center;font-size:11px;font-weight:700;color:#ffffffb0;text-shadow:0 1px 3px #000;pointer-events:none}body.in-kbm #mpHint .mpTc,body:not(.in-kbm) #mpHint .mpKb{display:none}body.in-kbm #mpC{cursor:grab}body.in-kbm #mpC:active{cursor:grabbing}body.in-kbm .mpB{cursor:pointer}#mpLeg{position:absolute;left:calc(env(safe-area-inset-left,0px) + 22px);bottom:70px;background:rgba(14,21,32,.9);border:1.5px solid rgba(255,255,255,.3);border-radius:14px;padding:10px 12px;font-size:12px;font-weight:700;display:none;max-height:60%;overflow:hidden;columns:2;column-gap:16px}#mpLeg div{display:flex;align-items:center;margin:3px 0;break-inside:avoid}#mpLeg i{display:inline-flex;width:18px;height:18px;border-radius:50%;margin-right:7px;align-items:center;justify-content:center;font-style:normal;font-size:10px;font-weight:900;color:#111;border:1.5px solid #000}';document.head.appendChild(st)}
const mpWrap=document.createElement('div');mpWrap.id='mpWrap';
mpWrap.innerHTML='<canvas id="mpC"></canvas><div id="mpHead">BLOCK CITY<small id="mpPc"></small></div><div id="mpHint"><span class="mpTc">Drag to move &middot; pinch or +/&minus; to zoom &middot; tap to set a waypoint</span><span class="mpKb">Drag to move &middot; scroll wheel or +/&minus; to zoom &middot; click to set a waypoint &middot; M or Esc to close</span></div><div id="mpLeg"></div>'+
 '<div class="mpB" id="mpX" style="right:calc(env(safe-area-inset-right,0px) + 22px);top:22px">&#10005;</div><div class="mpB" id="mpZi" style="right:calc(env(safe-area-inset-right,0px) + 22px);top:50%;margin-top:-52px">+</div><div class="mpB" id="mpZo" style="right:calc(env(safe-area-inset-right,0px) + 22px);top:50%;margin-top:6px">&minus;</div>'+
 '<div class="mpB" id="mpMe" style="right:calc(env(safe-area-inset-right,0px) + 22px);bottom:22px;font-size:20px">&#9678;</div><div class="mpB" id="mpLg" style="left:calc(env(safe-area-inset-left,0px) + 22px);bottom:22px;width:auto;padding:0 14px;font-size:12px;letter-spacing:1px">LEGEND</div>';
document.body.appendChild(mpWrap);
const mpCv=document.getElementById('mpC'),mpG=mpCv.getContext('2d');
function mpClamp(){const ww=mpX1-mpX0,wh=mpZ1-mpZ0,kmin=Math.min(mpW/ww,mpH/wh);mpK=Math.max(kmin,Math.min(6,mpK));const hw=mpW/2/mpK,hh=mpH/2/mpK;mpCX=hw*2>=ww?(mpX0+mpX1)/2:Math.max(mpX0+hw,Math.min(mpX1-hw,mpCX));mpCZ=hh*2>=wh?(mpZ0+mpZ1)/2:Math.max(mpZ0+hh,Math.min(mpZ1-hh,mpCZ))}
function mpResize(){mpW=Math.max(120,innerWidth-20);mpH=Math.max(120,innerHeight-20);mpDpr=Math.min(devicePixelRatio||1,2);mpCv.style.width=mpW+'px';mpCv.style.height=mpH+'px';mpCv.width=Math.round(mpW*mpDpr);mpCv.height=Math.round(mpH*mpDpr);mpClamp()}
function mpText(g,t,x,y,fill,sw){g.lineWidth=sw||3;g.strokeStyle='rgba(8,12,20,.85)';g.lineJoin='round';g.strokeText(t,x,y);g.fillStyle=fill;g.fillText(t,x,y)}
function mpDot(g,x,y,r,col,gl){g.beginPath();g.arc(x,y,r,0,7);g.fillStyle=col;g.fill();g.lineWidth=1.8;g.strokeStyle='#05080d';g.stroke();if(gl){g.fillStyle='#10151c';g.font='900 '+Math.round(r*1.25)+'px -apple-system,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(gl,x,y+.5)}}
function mpDraw(){const g=mpG,W=mpW,H=mpH,k=mpK,F='-apple-system,system-ui,sans-serif';g.setTransform(mpDpr,0,0,mpDpr,0,0);g.fillStyle='#0b1016';g.fillRect(0,0,W,H);
 const sx=x=>(x-mpCX)*k+W/2,sy=z=>(z-mpCZ)*k+H/2,on=(x,y,m)=>x>-m&&y>-m&&x<W+m&&y<H+m;
 g.save();g.translate(W/2,H/2);g.scale(k,k);g.translate(-mpCX,-mpCZ);g.beginPath();g.rect(mpX0,mpZ0,mpX1-mpX0,mpZ1-mpZ0);g.clip();
 if(k<mpSK*.95){g.imageSmoothingEnabled=true;g.drawImage(mpStatic,mpX0,mpZ0,mpX1-mpX0,mpZ1-mpZ0)}else mpDrawWorld(g,[mpCX-W/2/k,mpCZ-H/2/k,mpCX+W/2/k,mpCZ+H/2/k]);
 g.imageSmoothingEnabled=true;g.drawImage(mpFogC,mpX0,mpZ0,mpCols*mpCell,mpRows*mpCell);g.restore();
 g.textAlign='center';g.textBaseline='middle';
 // street names when zoomed in
 if(k>=1.7){g.font='700 10px '+F;for(let i=0;i<=N;i++){const rc=roadCenter(i);for(let j=1;j<N;j+=2){const m=roadCenter(j)+CELL/2;let X=sx(rc),Y=sy(m);if(on(X,Y,40)&&mpSeenAt(rc,m)){g.save();g.translate(X,Y);g.rotate(-Math.PI/2);mpText(g,mpAve[i]||'',0,0,'#f2f5fa',2.5);g.restore()}
    X=sx(m-CELL);Y=sy(rc);if(on(X,Y,40)&&mpSeenAt(m-CELL,rc))mpText(g,mpOrd(i+1),X,Y,'#f2f5fa',2.5)}}}
 // labels
 for(const l of mpLabels){if(l.hidden)continue;const X=sx(l.x),Y=sy(l.z);if(!on(X,Y,90))continue;const seen=mpSeenAt(l.x,l.z);if(!seen&&!l.q)continue;if(l.size===0&&k<1.05)continue;
  if(l.size===0){g.font='italic 700 11px '+F;mpText(g,seen?l.text:l.q,X,Y,'#d9ffd9',2.5)}else{g.font='900 '+Math.round((l.size===2?15:13)*Math.max(.72,Math.min(1.25,k/.85)))+'px '+F;mpText(g,mpSp(seen?l.text:l.q),X,Y,l.text==='AZURE BAY'?'#cfe9ff':(l.size===2?'#ffe9a8':'#ffffff'),3.5)}}
 // icons
 const big=k>=1.5;for(const ic of mpIcons){if(ic.ent&&ic.ent.dead)continue;const wx=ic.obj?ic.obj.position.x:ic.x,wz=ic.obj?ic.obj.position.z:ic.z;if(!mpSeenAt(wx,wz))continue;const X=sx(wx),Y=sy(wz);if(!on(X,Y,20))continue;mpDot(g,X,Y,9,ic.color||'#fff',ic.glyph||'');if(big&&ic.label){g.font='700 10px '+F;mpText(g,ic.label,X,Y+16,'#fff',2.5)}}
 if(typeof apPlanes!=='undefined')for(const p of apPlanes){if(p.dead||!mpSeenAt(p.m.position.x,p.m.position.z))continue;const X=sx(p.m.position.x),Y=sy(p.m.position.z);if(!on(X,Y,20))continue;const s=(p.type==='liner'?1.6:1)*Math.max(.4,Math.min(1.3,k/1.15));g.save();g.translate(X,Y);g.rotate(-p.m.rotation.y);g.fillStyle=p===driving?'#ffd23f':'#eef6ff';g.strokeStyle='#05080d';g.lineWidth=1;g.beginPath();g.rect(-1.5*s,-8*s,3*s,16*s);g.rect(-9*s,-2*s,18*s,3.5*s);g.rect(-4*s,6*s,8*s,2*s);g.fill();g.restore()}
 for(const e of shooters)if(!e.dead&&!e.gone&&e.kind==='gang'&&mpSeenAt(e.g.position.x,e.g.position.z))mpDot(g,sx(e.g.position.x),sy(e.g.position.z),3.5,'#c060ff');
 for(const pc of police)if(!pc.dead&&!pc.gone)mpDot(g,sx(pc.m.position.x),sy(pc.m.position.z),5.5,Math.sin(T*12)>0?'#ff3030':'#3a6bff');
 const px=sx(pos.x),py=sy(pos.z);
 // mission + waypoint
 if(beam.visible){const X=sx(mission.target.x),Y=sy(mission.target.z),col='#'+beamMat.color.getHexString();g.setLineDash([7,6]);g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.moveTo(px,py);g.lineTo(X,Y);g.stroke();g.setLineDash([]);
  g.strokeStyle=col;g.lineWidth=2;g.globalAlpha=.6;g.beginPath();g.arc(X,Y,11+Math.sin(T*5)*3,0,7);g.stroke();g.globalAlpha=1;mpDot(g,X,Y,7,col);g.font='800 10px '+F;mpText(g,'MISSION',X,Y-17,'#fff',2.5)}
 if(mpWay){const X=sx(mpWay.x),Y=sy(mpWay.z);g.setLineDash([3,5]);g.strokeStyle='#ff3df0';g.lineWidth=2;g.beginPath();g.moveTo(px,py);g.lineTo(X,Y);g.stroke();g.setLineDash([]);g.save();g.translate(X,Y);g.rotate(Math.PI/4);g.fillStyle='#ff3df0';g.strokeStyle='#fff';g.lineWidth=2;g.fillRect(-6,-6,12,12);g.strokeRect(-6,-6,12,12);g.restore();
  g.font='800 10px '+F;mpText(g,Math.round(Math.hypot(mpWay.x-pos.x,mpWay.z-pos.z))+' m',X,Y-16,'#ffd6fb',2.5)}
 // player
 g.save();g.translate(px,py);g.rotate(-facing);g.beginPath();g.moveTo(0,-11);g.lineTo(8,8);g.lineTo(0,4);g.lineTo(-8,8);g.closePath();g.fillStyle='#fff';g.fill();g.lineWidth=2;g.strokeStyle='#05080d';g.stroke();g.restore();
 // north arrow
 g.fillStyle='rgba(14,21,32,.8)';g.beginPath();g.arc(W-34,H/2-96,15,0,7);g.fill();g.fillStyle='#ff5a4d';g.beginPath();g.moveTo(W-34,H/2-109);g.lineTo(W-29,H/2-99);g.lineTo(W-39,H/2-99);g.fill();g.fillStyle='#fff';g.font='900 11px '+F;g.fillText('N',W-34,H/2-91);
 document.getElementById('mpPc').textContent='MAP '+mpPct()+'% EXPLORED'}
function mpLegendFill(){const rows=[['#fff','','You'],['#33ff88','','Mission'],['#ff3df0','','Waypoint'],['#3a6bff','','Police'],['#c060ff','','Gang']],seen={};for(const ic of mpIcons){if(!ic.label||seen[ic.label])continue;seen[ic.label]=1;rows.push([ic.color||'#fff',ic.glyph||'',ic.label])}
 let h='';for(const r of rows)h+='<div><i style="background:'+r[0]+'">'+r[1]+'</i>'+r[2]+'</div>';document.getElementById('mpLeg').innerHTML=h}
function mpShow(){if(mpOpen||state!=='play')return;mpOpen=true;state='map';joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;fireId=null;mpCX=pos.x;mpCZ=pos.z;mpWrap.style.display='block';mpResize();mpLegendFill();mpDraw()}
function mpClose(){if(!mpOpen)return;mpOpen=false;mpWrap.style.display='none';if(state==='map')state='play';for(const k in mpTch)delete mpTch[k];mpSave()}
function mpToggle(){if(mpOpen)mpClose();else mpShow()}
if(typeof fxToggleMap==='function'){fxToggleMap=mpToggle}else{$('map').addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();mpToggle()},{passive:false});addEventListener('keydown',e=>{if(e.key==='m'||e.key==='M')mpToggle()})}
function mpZoomAt(f,x,y){const wx=mpCX+(x-mpW/2)/mpK,wz=mpCZ+(y-mpH/2)/mpK;mpK*=f;mpClamp();mpCX=wx-(x-mpW/2)/mpK;mpCZ=wz-(y-mpH/2)/mpK;mpClamp();mpDraw()}
function mpSetWay(wx,wz){if(mpWay&&Math.hypot(wx-mpWay.x,wz-mpWay.z)*mpK<20){mpWay=null}else mpWay={x:Math.max(mpX0+4,Math.min(mpX1-4,wx)),z:Math.max(mpZ0+4,Math.min(mpZ1-4,wz))};mpDirty=true;beep(mpWay?1100:700,.07,.08)}
const mpTch={};let mpTap=false,mpMove=0;
{const loc=t=>{const r=mpCv.getBoundingClientRect();return [t.clientX-r.left,t.clientY-r.top]},ids=()=>Object.keys(mpTch),stop=e=>{e.stopPropagation();if(e.cancelable)e.preventDefault()};
 const two=()=>{const k=ids(),a=mpTch[k[0]],b=mpTch[k[1]];return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.max(8,Math.hypot(a.x-b.x,a.y-b.y))}};
 mpCv.addEventListener('touchstart',e=>{stop(e);for(const t of e.changedTouches){const p=loc(t);mpTch[t.identifier]={x:p[0],y:p[1]}}const n=ids().length;mpTap=n===1;if(n===1)mpMove=0},{passive:false});
 mpCv.addEventListener('touchmove',e=>{stop(e);for(const t of e.changedTouches){const o=mpTch[t.identifier];if(!o)continue;const p=loc(t),n=ids().length;
   if(n===1){const dx=p[0]-o.x,dy=p[1]-o.y;mpMove+=Math.abs(dx)+Math.abs(dy);if(mpMove>9)mpTap=false;mpCX-=dx/mpK;mpCZ-=dy/mpK;o.x=p[0];o.y=p[1];mpClamp()}
   else{const a=two(),wx=mpCX+(a.x-mpW/2)/mpK,wz=mpCZ+(a.y-mpH/2)/mpK;o.x=p[0];o.y=p[1];const b=two();mpK*=b.d/a.d;mpClamp();mpCX=wx-(b.x-mpW/2)/mpK;mpCZ=wz-(b.y-mpH/2)/mpK;mpClamp();mpTap=false}}mpDraw()},{passive:false});
 const end=e=>{stop(e);for(const t of e.changedTouches){const o=mpTch[t.identifier];if(!o)continue;delete mpTch[t.identifier];if(mpTap&&e.type==='touchend'&&!ids().length){mpSetWay(mpCX+(o.x-mpW/2)/mpK,mpCZ+(o.y-mpH/2)/mpK);mpTap=false}}mpDraw()};
 mpCv.addEventListener('touchend',end,{passive:false});mpCv.addEventListener('touchcancel',end,{passive:false});
 mpCv.addEventListener('wheel',e=>{e.preventDefault();e.stopPropagation();const p=loc(e);mpZoomAt(Math.exp(-e.deltaY*.0016),p[0],p[1])},{passive:false});
 const btn=(id,fn)=>document.getElementById(id).addEventListener('touchstart',e=>{stop(e);fn();if(mpOpen)mpDraw()},{passive:false});
 btn('mpX',mpClose);btn('mpZi',()=>mpZoomAt(1.45,mpW/2,mpH/2));btn('mpZo',()=>mpZoomAt(1/1.45,mpW/2,mpH/2));btn('mpMe',()=>{mpCX=pos.x;mpCZ=pos.z;if(mpK<1.1)mpK=1.1;mpClamp()});btn('mpLg',()=>{mpLegendOn=!mpLegendOn;document.getElementById('mpLeg').style.display=mpLegendOn?'block':'none'});
 for(const ty of['touchstart','touchmove','touchend','touchcancel'])mpWrap.addEventListener(ty,e=>{e.stopPropagation();if(ty==='touchstart'&&e.target===mpWrap)mpClose()});
 addEventListener('keydown',e=>{if(!mpOpen)return;if(e.key==='+'||e.key==='=')mpZoomAt(1.3,mpW/2,mpH/2);else if(e.key==='-'||e.key==='_')mpZoomAt(1/1.3,mpW/2,mpH/2);else if(e.key==='Escape')mpClose()});
 addEventListener('resize',()=>{if(mpOpen){mpResize();mpDraw()}})}
// ----- waypoint marker in the world + per-frame work -----
const mpBeam=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.7,90,16,1,true),new THREE.MeshBasicMaterial({color:0xff3df0,transparent:true,opacity:.42,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));mpBeam.visible=false;scene.add(mpBeam);
MODS.push(function(dt){if(state!=='play'&&state!=='map')return;
 mpRevT-=dt;if(mpRevT<=0){mpRevT=.25;const alt=driving?driving.m.position.y:pos.y;mpReveal(pos.x,pos.z,alt>30?110:55)}
 mpSaveT-=dt;if(mpSaveT<=0){mpSaveT=15;if(mpDirty)mpSave()}
 if(mpWay){mpBeam.visible=true;mpBeam.position.set(mpWay.x,45,mpWay.z);mpBeam.material.opacity=.34+.1*Math.sin(T*4);if(state==='play'&&Math.hypot(mpWay.x-pos.x,mpWay.z-pos.z)<9){mpWay=null;mpDirty=true;toast('Waypoint reached');beep(1300,.12,.1)}}else mpBeam.visible=false;
 if(mpOpen){mpDrawT-=dt;if(mpDrawT<=0){mpDrawT=.12;mpDraw()}}});
addEventListener('pagehide',()=>{if(mpDirty)mpSave()});

// ---------- ui: modern HUD, pinch zoom, rotate-screen mode, settings menu ----------
const uiDef={q:8,auto:1,vol:1,sens:1,invY:0,rot:0,lh:0,fps:0,hint:0};
const uiS=Object.assign({},uiDef);try{Object.assign(uiS,JSON.parse(localStorage.getItem('blockcity_settings')||'{}'))}catch(e){}
function uiSave(){try{localStorage.setItem('blockcity_settings',JSON.stringify(uiS))}catch(e){}}
let uiZoom=1,uiZoomT=1,uiSens=uiS.sens,uiInvY=uiS.invY?-1:1,uiOpen=false,uiPrev='play',uiFloat=false,uiPinch=null,uiVolBase=null,uiConfirm=0,uiDrag=null;
const uiClamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function uiZoomBy(f){uiZoomT=uiClamp(uiZoomT*f,.42,2.6)}  // the camera glides to uiZoomT (see ext.js)
// ----- real viewport + rotate-screen plumbing -----
const uiDW=Object.getOwnPropertyDescriptor(window,'innerWidth'),uiDH=Object.getOwnPropertyDescriptor(window,'innerHeight');
const uiRW=()=>uiDW&&uiDW.get?uiDW.get.call(window):document.documentElement.clientWidth,uiRH=()=>uiDH&&uiDH.get?uiDH.get.call(window):document.documentElement.clientHeight;
let uiRotOK=false;const uiSw=()=>inRot===1||inRot===2;
try{Object.defineProperty(window,'innerWidth',{configurable:true,get:()=>uiSw()?uiRH():uiRW()});Object.defineProperty(window,'innerHeight',{configurable:true,get:()=>uiSw()?uiRW():uiRH()});
 const gb=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){const r=gb.call(this);if(!inRot)return r;if(inRot===3){const l=uiRW()-r.right,t=uiRH()-r.bottom;return {left:l,top:t,right:l+r.width,bottom:t+r.height,width:r.width,height:r.height,x:l,y:t}}const l=inRot===2?uiRH()-r.bottom:r.top,t=inRot===2?r.left:uiRW()-r.right;return {left:l,top:t,right:l+r.height,bottom:t+r.width,width:r.height,height:r.width,x:l,y:t}};
 uiRotOK=true}catch(e){uiRotOK=false}
function uiLayout(){const b=document.body.classList,p=innerHeight>innerWidth;b.toggle('ui-touch',(navigator.maxTouchPoints||0)>0);b.toggle('ui-p',p);b.toggle('ui-l',!p);b.toggle('ui-lh',!!uiS.lh);b.toggle('ui-rot',inRot===1);b.toggle('ui-rot2',inRot===2);b.toggle('ui-rot3',inRot===3);b.toggle('ui-fps',!!uiS.fps);
 stick.style.left='';stick.style.top='';stick.style.bottom='';stick.style.right='';uiFloat=false}
function uiApplyRot(){const want=uiS.rot&&uiRotOK?(uiS.rot|0)%4:0,b=document.body.style;inRW=uiRW();inRH=uiRH();inRot=want;
 if(want){const sw=want!==3;b.position='fixed';b.left='0';b.top='0';b.width=(sw?uiRH():uiRW())+'px';b.height=(sw?uiRW():uiRH())+'px';b.transformOrigin='0 0';b.transform=want===3?'rotate(180deg) translate(-100%,-100%)':(want===2?'rotate(-90deg) translate(-100%,0)':'rotate(90deg) translate(0,-100%)')}
 else{b.position='';b.left='';b.top='';b.width='';b.height='';b.transformOrigin='';b.transform=''}
 uiLayout();const ev=new Event('resize');ev.uiSyn=true;window.dispatchEvent(ev);uiTitleSync();uiRotSync()}
const uiRotNext=[1,3,0,2],uiRotName=['Normal','Left','Right','Upside down'];
function uiRotCycle(){uiS.rot=uiRotNext[(uiS.rot|0)%4];uiS.hint=1;uiSave();uiApplyRot();toast('Screen: '+uiRotName[uiS.rot])}
function uiRotSync(){let ok=false;try{ok=!!uiRotB}catch(e){}if(!ok)return;const can=uiRotOK;uiRotB.style.display=can?'block':'none';uiRotB.style.transform=inRot===2?'scaleX(-1)':(inRot===3?'rotate(180deg)':'');uiRotB.style.opacity=inRot?'1':'.7'}
addEventListener('resize',e=>{if(e.uiSyn)return;uiApplyRot()});
// ----- icons (drawn here, used as CSS backgrounds so game code can keep rewriting button text) -----
const uiIc=(d,col)=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="'+(col||'#fff')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>')+'")';
const uiI={fire:'<circle cx="12" cy="12" r="7"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>',jump:'<path d="M6 12l6-6 6 6M6 19l6-6 6 6"/>',up:'<path d="M12 20V5M5 12l7-7 7 7"/>',down:'<path d="M12 4v15M5 12l7 7 7-7"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',car:'<path d="M3 13l2-5.5A2 2 0 0 1 6.9 6h10.2a2 2 0 0 1 1.9 1.5L21 13v5h-3v-2H6v2H3z"/><path d="M7 13.5h.01M17 13.5h.01"/>',exit:'<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/>',
 gun:'<path d="M3 8h16v4h-6.5l-1 2.5H8.5L8 19H4.5l1-7H3z"/>',gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
 rot:'<path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v4h-4"/>',note:'<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>',
 heart:'<path fill="#4cff6a" stroke="none" d="M12 21s-7.6-4.7-9.5-9.3C1 8.2 3.200 4.500 6.700 4.500c2.100 0 3.700 1.100 5.300 3.100 1.600-2 3.200-3.100 5.300-3.100 3.500 0 5.700 3.700 4.200 7.200C19.600 16.300 12 21 12 21z"/>',
 shield:'<path fill="#4aa3ff" stroke="none" d="M12 2l8 3v6c0 5-3.400 9.300-8 11-4.600-1.700-8-6-8-11V5z"/>',play:'<path fill="#14161c" stroke="none" d="M8 5l11 7-11 7z"/>',
 move:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="#fff"/>',look:'<path d="M2 12s3.600-6 10-6 10 6 10 6-3.600 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.500"/>',pinch:'<path d="M4 20l5-5M9 20v-5H4M20 4l-5 5M15 4v5h5"/>',map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'};
// ----- styles -----
{const G='background:rgba(16,18,26,.5);-webkit-backdrop-filter:blur(12px) saturate(1.5);backdrop-filter:blur(12px) saturate(1.5);box-shadow:0 6px 20px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.12);';
 const I=' !important',c=[];
 c.push('body{--st:env(safe-area-inset-top,0px);--sb:env(safe-area-inset-bottom,0px);--sl:env(safe-area-inset-left,0px);--sr:env(safe-area-inset-right,0px);--gb:rgba(255,255,255,.17);--ac:#ffd23f;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,Inter,Helvetica,Arial,sans-serif}');
 c.push('body.ui-rot{--st:env(safe-area-inset-right,0px);--sb:env(safe-area-inset-left,0px);--sl:env(safe-area-inset-top,0px);--sr:env(safe-area-inset-bottom,0px)}');
 c.push('body.ui-rot2{--st:env(safe-area-inset-left,0px);--sb:env(safe-area-inset-right,0px);--sl:env(safe-area-inset-bottom,0px);--sr:env(safe-area-inset-top,0px)}');
 c.push('body.ui-rot3{--st:env(safe-area-inset-bottom,0px);--sb:env(safe-area-inset-top,0px);--sl:env(safe-area-inset-right,0px);--sr:env(safe-area-inset-left,0px)}.ui-seg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:2px 0 8px}.ui-seg .ui-b{height:34px;font-size:10px;letter-spacing:.5px;border:1px solid var(--gb);background:rgba(255,255,255,.06);color:#fff}.ui-seg .ui-b.on{background:var(--ac);color:#14161c;border-color:transparent}');
 c.push('#uiRotB{position:fixed;right:calc(var(--sr) + 12px);top:calc(var(--st) + 140px);width:34px;height:34px;border-radius:50%;border:1px solid var(--gb);z-index:6;display:none;background:rgba(20,22,28,.55) '+uiIc(uiI.rot)+' no-repeat center/18px}.ui-side{margin:6px 0 2px;display:flex;flex-direction:column;align-items:center;gap:6px}.ui-side-h{font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}.ui-b.ui-on{outline:2px solid var(--ac);color:var(--ac)}');
 c.push('body.ui-noblur *{-webkit-backdrop-filter:none'+I+';backdrop-filter:none'+I+'}');
 // status cluster
 c.push('#uiCard{position:fixed;left:calc(var(--sl) + 58px);top:calc(var(--st) + 8px);width:194px;height:88px;border-radius:18px;border:1px solid var(--gb);pointer-events:none;z-index:3;'+G+'}');
 c.push('#hud{left:calc(var(--sl) + 71px)'+I+';top:calc(var(--st) + 13px)'+I+';width:168px;font-size:12px'+I+';line-height:1.2'+I+';text-shadow:none'+I+';z-index:4}');
 c.push('#cash{font-size:21px'+I+';font-weight:800;line-height:24px;color:#7dffa0'+I+';letter-spacing:.3px;font-variant-numeric:tabular-nums}');
 c.push('#clock{position:absolute;right:0;top:6px;font-size:11px;font-weight:700;opacity:.72;letter-spacing:.4px}#cn,#kills,#msStat{display:none'+I+'}');
 c.push('#stars{left:calc(var(--sl) + 69px)'+I+';right:auto'+I+';top:calc(var(--st) + 39px)'+I+';margin:0'+I+';width:auto'+I+';text-align:left'+I+';font-size:15px'+I+';letter-spacing:3px'+I+';line-height:18px;text-shadow:0 1px 2px rgba(0,0,0,.5)'+I+';z-index:4}');
 c.push('#bars{left:calc(var(--sl) + 71px)'+I+';right:auto'+I+';top:calc(var(--st) + 63px)'+I+';margin:0'+I+';width:168px'+I+';z-index:4}');
 c.push('#bars>div{position:relative;height:6px'+I+';margin:0 0 7px 20px'+I+';border:0'+I+';border-radius:3px'+I+';background:rgba(255,255,255,.16)'+I+';overflow:visible'+I+'}');
 c.push('#bars>div::before{content:"";position:absolute;left:-19px;top:-3px;width:12px;height:12px;background:center/contain no-repeat '+uiIc(uiI.heart)+'}#bars>div:nth-child(2)::before{background-image:'+uiIc(uiI.shield)+'}');
 c.push('#hpb,#arb{border-radius:3px;transition:width .2s}#hpb{background:linear-gradient(90deg,#3ee06a,#7dffa0)'+I+'}#hpb.ui-low{background:linear-gradient(90deg,#ff3b30,#ff7a59)'+I+'}#arb{background:linear-gradient(90deg,#3a8dff,#7cc0ff)'+I+'}');
 c.push('#uiGear{position:fixed;left:calc(var(--sl) + 10px);top:calc(var(--st) + 8px);width:40px;height:40px;border-radius:50%;border:1px solid var(--gb);z-index:6;'+G+'background-image:'+uiIc(uiI.gear)+';background-repeat:no-repeat;background-position:center;background-size:21px;transition:transform .08s}');
 c.push('#uiGear.ui-on,.ui-b.ui-on{transform:scale(.92);filter:brightness(1.3)}');
 c.push('#mission{left:calc(var(--sl) + 10px)'+I+';top:calc(var(--st) + 104px)'+I+';max-width:216px'+I+';padding:8px 12px;border-radius:14px;border:1px solid var(--gb);border-left:3px solid var(--ac);font-size:12.5px'+I+';font-weight:600'+I+';line-height:1.35;text-shadow:none'+I+';z-index:3;'+G+'}#mission:empty{display:none}');
 // radar + things hanging under it (no !important on #map: the expanded map sets inline styles)
 c.push('#map{top:calc(var(--st) + 8px);right:calc(var(--sr) + 10px);width:112px;height:112px;border:2px solid rgba(255,255,255,.42);box-shadow:0 6px 20px rgba(0,0,0,.4);z-index:4}body.ui-l #map{width:122px;height:122px}');
 c.push('#radio{top:calc(var(--st) + 128px)'+I+';right:calc(var(--sr) + 14px)'+I+';left:auto'+I+';margin:0'+I+';width:42px'+I+';height:42px'+I+';border:1px solid rgba(125,221,255,.75)'+I+';background:rgba(16,18,26,.5)'+I+';font-size:8.5px'+I+';letter-spacing:.4px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 4px 14px rgba(0,0,0,.35);transition:transform .08s}body.ui-l #radio{top:calc(var(--st) + 138px)'+I+'}#radio.ui-on{transform:scale(.9)}');
 c.push('#uiApHud{padding:6px 12px 6px 6px;border-radius:30px;border:1px solid var(--gb);width:auto'+I+';text-shadow:none'+I+';z-index:4;'+G+'}body.ui-p #uiApHud{top:calc(var(--st) + 178px)'+I+';right:calc(var(--sr) + 10px)'+I+';left:auto'+I+';margin:0'+I+'}body.ui-l #uiApHud{top:calc(var(--st) + 8px)'+I+';left:50%'+I+';margin-left:-88px'+I+'}');
 c.push('#uiFps{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--sb) + 4px);font-size:10px;font-weight:700;letter-spacing:.5px;color:#fff;opacity:.7;pointer-events:none;display:none;z-index:6;text-shadow:0 1px 2px #000}body.ui-fps #uiFps{display:block}');
 c.push('#toast{top:27%'+I+';left:50%'+I+';right:auto'+I+';transform:translateX(-50%);padding:9px 18px;border-radius:999px;border:1px solid var(--gb);font-size:17px'+I+';font-weight:800'+I+';letter-spacing:.4px;white-space:nowrap;max-width:88%;overflow:hidden;text-overflow:ellipsis;text-shadow:none'+I+';z-index:7;'+G+'}#toast:empty{display:none}');
 c.push('#xh{width:18px'+I+';height:18px'+I+';margin:-9px'+I+';border:1.5px solid rgba(255,255,255,.85)'+I+';box-shadow:0 0 0 1px rgba(0,0,0,.25)}#xh::after{content:"";position:absolute;left:50%;top:50%;width:3px;height:3px;margin:-1.5px;border-radius:50%;background:#fff}');
 c.push('#lock{border-width:2px'+I+';border-radius:11px'+I+';box-shadow:0 0 0 1px rgba(0,0,0,.3),0 0 12px rgba(255,255,255,.2)}');
 c.push('#msg h1{font-size:46px'+I+';font-weight:900;letter-spacing:3px}#msg p{font-weight:600}');
 // joystick (left/top are set inline while it floats under the thumb)
 c.push('#stick{left:calc(var(--sl) + 24px);bottom:calc(var(--sb) + 30px);width:124px'+I+';height:124px'+I+';border:1px solid var(--gb)'+I+';background:radial-gradient(circle,rgba(255,255,255,.07) 0,rgba(16,18,26,.44) 72%)'+I+';-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 6px 20px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.12);opacity:.62;transition:opacity .15s;z-index:5}');
 c.push('#stick.ui-on{opacity:1}#stick::before{content:"";position:absolute;left:13px;top:13px;right:13px;bottom:13px;border-radius:50%;border:1px dashed rgba(255,255,255,.2)}');
 c.push('#knob{left:36px'+I+';top:36px'+I+';width:52px'+I+';height:52px'+I+';background:radial-gradient(circle at 35% 30%,#fff,#c7cedd)'+I+';box-shadow:0 4px 12px rgba(0,0,0,.45)}');
 c.push('body.ui-p #stick{bottom:calc(var(--sb) + 38px)}body.ui-lh #stick{left:auto;right:calc(var(--sr) + 24px)}');
 // action buttons
 c.push('.btn{border-width:1px'+I+';border-style:solid'+I+';border-color:var(--gb);background:rgba(16,18,26,.5)'+I+';color:#fff'+I+';flex-direction:column;font-size:9.5px'+I+';font-weight:800'+I+';letter-spacing:.9px;line-height:1.1;text-transform:uppercase;-webkit-backdrop-filter:blur(8px) saturate(1.4);backdrop-filter:blur(8px) saturate(1.4);box-shadow:0 6px 18px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.14);transition:transform .08s,filter .08s;z-index:5}');
 c.push('.btn::before{content:"";width:25px;height:25px;margin-bottom:2px;flex:none;background:center/contain no-repeat '+uiIc(uiI.bolt)+'}.btn.ui-on{transform:scale(.92);filter:brightness(1.4)}');
 c.push('#fire{background:radial-gradient(circle at 34% 28%,rgba(255,122,100,.96),rgba(206,36,36,.86))'+I+';border-color:rgba(255,255,255,.4);box-shadow:0 8px 26px rgba(214,40,40,.5),inset 0 1px 0 rgba(255,255,255,.35);font-size:10px'+I+'}#fire::before{width:36px;height:36px;background-image:'+uiIc(uiI.fire)+'}');
 c.push('#jump::before{background-image:'+uiIc(uiI.jump)+'}#jump[data-s=UP]::before{background-image:'+uiIc(uiI.up)+'}#jump[data-s=GAS]::before,#jump[data-s=BOOST]::before{background-image:'+uiIc(uiI.bolt)+'}');
 c.push('#car::before{background-image:'+uiIc(uiI.car)+'}#car[data-s=EXIT]::before{background-image:'+uiIc(uiI.exit)+'}#car[data-s=CAR]{opacity:.6}');
 c.push('#car[data-s=DRIVE],#car[data-s=STEAL]{background:linear-gradient(160deg,#ffe27a,#ffb300)'+I+';color:#14161c'+I+';border-color:rgba(255,255,255,.6);box-shadow:0 0 0 0 rgba(255,210,63,.7),0 8px 22px rgba(255,179,0,.45);animation:uiPulse 1.2s infinite}#car[data-s=DRIVE]::before,#car[data-s=STEAL]::before{background-image:'+uiIc(uiI.car,'#14161c')+'}');
 c.push('@keyframes uiPulse{0%{box-shadow:0 0 0 0 rgba(255,210,63,.65),0 8px 22px rgba(255,179,0,.45)}100%{box-shadow:0 0 0 16px rgba(255,210,63,0),0 8px 22px rgba(255,179,0,.45)}}');
 c.push('#wpn{border-width:2px'+I+';font-size:8.5px'+I+';line-height:1.15'+I+'}#wpn::before{width:19px;height:19px;margin-bottom:0;background-image:'+uiIc(uiI.gun)+'}#wpn small{font-size:13px'+I+';font-weight:800;letter-spacing:0}');
 c.push('#vhdn{background:rgba(40,110,220,.55)'+I+'}#vhdn::before{background-image:'+uiIc(uiI.down)+'}');
 const place=(m,o)=>{for(const k in o){const v=o[k],sz='width:'+v[2]+'px'+I+';height:'+v[2]+'px'+I+';bottom:calc(var(--sb) + '+v[1]+'px)'+I+';top:auto'+I+';';
  c.push('body.'+m+':not(.ui-lh) #'+k+'{'+sz+'right:calc(var(--sr) + '+v[0]+'px)'+I+';left:auto'+I+'}body.'+m+'.ui-lh #'+k+'{'+sz+'left:calc(var(--sl) + '+v[0]+'px)'+I+';right:auto'+I+'}')}};
 place('ui-p',{fire:[20,106,92],jump:[22,26,68],car:[104,46,68],wpn:[126,132,62],vhdn:[30,214,58]});
 place('ui-l',{fire:[22,96,92],jump:[24,18,68],car:[106,36,68],wpn:[128,122,62],vhdn:[190,24,58]});
 // title screen (the game HUD is hidden behind it)
 c.push('body.ui-title #uiCard,body.ui-title #hud,body.ui-title #stars,body.ui-title #bars,body.ui-title #mission,body.ui-title #stick,body.ui-title .btn,body.ui-title #xh,body.ui-title #lock,body.ui-title #uiGear,body.ui-title #fxPt,body.ui-title #radio,body.ui-title #uiApHud{display:none'+I+'}body.ui-title #map{display:none}body.ui-title #uiRotB,body.ui-title #toast{display:none'+I+'}');
 c.push('#uiTitle{position:fixed;left:0;top:0;right:0;bottom:0;z-index:70;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:calc(var(--st) + 7vh + 10px) calc(var(--sr) + 22px) calc(var(--sb) + 7vh + 10px) calc(var(--sl) + 22px);box-sizing:border-box;color:#fff;background:radial-gradient(ellipse at 50% 42%,rgba(6,8,14,.18) 0%,rgba(6,8,14,.62) 58%,rgba(4,5,9,.94) 100%);transition:opacity .55s ease,transform .55s ease;overflow:hidden}#uiTitle::before,#uiTitle::after{content:"";position:absolute;left:0;right:0;height:7vh;background:#000;transition:transform .55s ease}#uiTitle::before{top:0}#uiTitle::after{bottom:0}#uiTitle.ui-out{opacity:0;transform:scale(1.06);pointer-events:none}#uiTitle.ui-out::before{transform:translateY(-100%)}#uiTitle.ui-out::after{transform:translateY(100%)}');
 c.push('.ui-wm{display:flex;flex-direction:column;align-items:center;text-align:center}.ui-wm b{display:block;font-weight:800;font-size:clamp(34px,11.5vw,84px);line-height:1;letter-spacing:.2em;margin-right:-.2em;text-transform:uppercase;color:#e8ecf1;background:linear-gradient(105deg,rgba(255,255,255,0) 42%,rgba(255,255,255,.95) 50%,rgba(255,255,255,0) 58%),linear-gradient(180deg,#ffffff 0%,#e6ebf1 34%,#8f9bab 52%,#f3f5f8 61%,#aab4c0 100%);background-size:260% 100%,100% 100%;background-position:130% 0,0 0;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 8px 26px rgba(0,0,0,.7));animation:uiSheen 5.5s ease-in-out infinite}body.ui-l .ui-wm b{font-size:clamp(34px,8.2vw,76px);display:inline-block}body.ui-l .ui-wm b+b{margin-left:.35em}body.ui-l .ui-wm .ui-wl{display:block}@keyframes uiSheen{0%,55%{background-position:130% 0,0 0}100%{background-position:-60% 0,0 0}}');
 c.push('.ui-rule{width:150px;height:1px;margin:12px 0 10px;background:linear-gradient(90deg,transparent,var(--ac),transparent)}.ui-tl{font-size:10px;font-weight:700;letter-spacing:.42em;margin-right:-.42em;text-transform:uppercase;opacity:.78}.ui-ver{position:absolute;right:calc(var(--sr) + 12px);bottom:calc(var(--sb) + 7vh + 6px);font-size:9px;letter-spacing:.18em;text-transform:uppercase;opacity:.45}');
 c.push('.ui-play2{position:relative;margin-top:8px;width:210px;height:54px;border-radius:999px;font-size:15px;font-weight:800;letter-spacing:.36em;text-indent:.36em;color:#12141a;background:linear-gradient(180deg,#fff0b8 0%,#ffd23f 48%,#f0a800 100%);box-shadow:0 0 0 1px rgba(255,255,255,.35) inset,0 14px 34px rgba(255,190,40,.32),0 2px 0 rgba(255,255,255,.7) inset;animation:uiGlow 2.4s ease-in-out infinite}.ui-play2.ui-dn,#uiTitle.ui-out .ui-play2{transform:scale(.94);filter:brightness(.88)}@keyframes uiGlow{0%,100%{box-shadow:0 0 0 1px rgba(255,255,255,.35) inset,0 14px 34px rgba(255,190,40,.25),0 2px 0 rgba(255,255,255,.7) inset}50%{box-shadow:0 0 0 1px rgba(255,255,255,.35) inset,0 14px 44px rgba(255,190,40,.5),0 2px 0 rgba(255,255,255,.7) inset}}');
 c.push('.ui-opt{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:2px}.ui-opt .ui-b{height:34px;padding:0 13px;font-size:9.5px;letter-spacing:.14em;color:#fff;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05)}.ui-opt .ui-b i{width:14px;height:14px;background:center/contain no-repeat}.ui-opt .ui-b.ui-on{border-color:var(--ac);color:var(--ac)}.ui-optl{width:100%;text-align:center;font-size:9px;letter-spacing:.3em;text-transform:uppercase;opacity:.55}');
 c.push('.ui-ctl{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;width:100%;max-width:330px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.1)}.ui-ctl div{display:flex;flex-direction:column;align-items:center;gap:5px;padding:9px 4px 8px;background:rgba(10,12,18,.72);font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;text-align:center;line-height:1.25}.ui-ctl i{width:18px;height:18px;background:center/contain no-repeat;opacity:.9}.ui-ctl small{display:block;font-size:8px;letter-spacing:.08em;opacity:.55;font-weight:600}.ui-keys{font-size:9px;letter-spacing:.14em;text-transform:uppercase;opacity:.55;text-align:center}body.ui-touch .ui-keys{display:none}body.ui-l #uiTitle{gap:9px}body.ui-l .ui-ctl{grid-template-columns:repeat(6,1fr);max-width:560px}body.ui-l .ui-rule{margin:8px 0 7px}body.ui-l .ui-play2{height:46px;margin-top:2px}');
 c.push('.ui-logo{font-weight:900;font-style:italic;line-height:.86;letter-spacing:-1px;font-size:74px;text-transform:uppercase;background:linear-gradient(175deg,#fff3b0 10%,#ffd23f 45%,#ff7a18 95%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#ffd23f;filter:drop-shadow(0 6px 18px rgba(0,0,0,.55))}body.ui-l .ui-logo{font-size:62px}');
 c.push('.ui-tag{margin:10px 0 16px;font-size:11px;font-weight:800;letter-spacing:5px;opacity:.85}.ui-col{display:flex;flex-direction:column;align-items:center}body.ui-l .ui-col{align-items:flex-start}body.ui-p .ui-col{width:100%}');
 c.push('.ui-b{display:flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;transition:transform .08s,filter .08s;box-sizing:border-box}');
 c.push('.ui-play{width:236px;height:58px;font-size:19px;color:#14161c;background:linear-gradient(160deg,#ffe27a,#ffb300);box-shadow:0 10px 30px rgba(255,179,0,.45),inset 0 1px 0 rgba(255,255,255,.6);animation:uiPulse 1.6s infinite}.ui-play::before{content:"";width:22px;height:22px;background:center/contain no-repeat '+uiIc(uiI.play)+'}');
 c.push('.ui-row{display:flex;gap:10px;margin-top:12px}.ui-ghost{height:40px;padding:0 16px;font-size:11px;color:#fff;border:1px solid var(--gb);'+G+'}.ui-ghost i{width:17px;height:17px;background:center/contain no-repeat}');
 c.push('.ui-hint{margin-top:10px;font-size:11.5px;font-weight:600;opacity:.8;text-align:center;max-width:300px}');
 c.push('.ui-how{width:100%;max-width:340px;border-radius:18px;border:1px solid var(--gb);padding:12px 14px;box-sizing:border-box;'+G+'}.ui-how div{display:flex;align-items:center;gap:10px;font-size:12.5px;font-weight:600;line-height:1.25;padding:5px 0}.ui-how i{flex:none;width:20px;height:20px;background:center/contain no-repeat;opacity:.95}.ui-how b{color:var(--ac);font-weight:800}.ui-kb{opacity:.7;font-size:11px'+I+'}body.ui-p .ui-kb,body.ui-touch .ui-kb{display:none'+I+'}');
 // settings
 c.push('#uiSet{position:fixed;left:0;top:0;right:0;bottom:0;z-index:80;display:none;align-items:center;justify-content:center;background:rgba(6,8,14,.5);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:#fff}#uiSet.ui-show{display:flex}');
 c.push('.ui-pan{width:min(430px,calc(100% - 24px));box-sizing:border-box;border-radius:22px;border:1px solid var(--gb);padding:14px 16px 16px;background:rgba(18,20,28,.86);box-shadow:0 20px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.1)}body.ui-l .ui-pan{width:min(700px,calc(100% - 24px));padding:10px 16px 12px}');
 c.push('.ui-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px}.ui-hd b{font-size:20px;font-weight:900;letter-spacing:1.5px}.ui-hd span{font-size:11px;font-weight:700;opacity:.7;letter-spacing:.3px}');
 c.push('.ui-grid{display:grid;grid-template-columns:1fr;gap:2px 22px}body.ui-l .ui-grid{grid-template-columns:1.25fr 1fr}');
 c.push('.ui-it{padding:7px 0}.ui-lb{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;letter-spacing:.4px;margin-bottom:7px}.ui-lb em{font-style:normal;color:var(--ac);font-weight:800;font-variant-numeric:tabular-nums}');
 c.push('.ui-sl{display:flex;align-items:center;gap:10px}.ui-pm{flex:none;width:30px;height:30px;border-radius:50%;border:1px solid var(--gb);background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;line-height:1}');
 c.push('.ui-tr{position:relative;flex:1;height:30px}.ui-tr::before{content:"";position:absolute;left:0;right:0;top:12px;height:6px;border-radius:3px;background:rgba(255,255,255,.16)}.ui-fl{position:absolute;left:0;top:12px;height:6px;border-radius:3px;background:linear-gradient(90deg,#ffb300,#ffe27a);pointer-events:none}.ui-th{position:absolute;top:4px;width:22px;height:22px;margin-left:-11px;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.5);pointer-events:none}');
 c.push('.ui-chip{padding:3px 9px;border-radius:999px;border:1px solid var(--gb);font-size:10px;font-weight:800;letter-spacing:.8px;margin-left:8px}.ui-chip.on{background:var(--ac);color:#14161c;border-color:transparent}');
 c.push('.ui-tg{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;letter-spacing:.3px;padding:8px 0}.ui-tg small{display:block;font-size:10px;font-weight:600;opacity:.6;letter-spacing:0;margin-top:1px}.ui-sw{flex:none;position:relative;width:46px;height:26px;border-radius:13px;background:rgba(255,255,255,.18);transition:background .15s;pointer-events:none}.ui-sw::after{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .15s;box-shadow:0 1px 4px rgba(0,0,0,.4)}.ui-sw.on{background:#34c759}.ui-sw.on::after{transform:translateX(20px)}.ui-tg.off{opacity:.38}');
 c.push('.ui-ft{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}body.ui-p .ui-ft .ui-res{flex:1 1 100%;order:2;height:48px}.ui-ft .ui-b{flex:1;height:42px;font-size:10.5px;text-align:center;line-height:1.15;padding:0 8px;white-space:nowrap;border:1px solid var(--gb);background:rgba(255,255,255,.08)}.ui-ft .ui-res{flex:1.4;font-size:14px;color:#14161c;background:linear-gradient(160deg,#ffe27a,#ffb300);border-color:transparent}.ui-ft .ui-warn{color:#ff8f85;border-color:rgba(255,99,88,.5)}');
 const st=document.createElement('style');st.id='uiCss';st.textContent=c.join('');document.head.appendChild(st)}
// ----- DOM pieces -----
const uiEl=(tag,id,html)=>{const e=document.createElement(tag);if(id)e.id=id;if(html)e.innerHTML=html;document.body.appendChild(e);return e};
uiEl('div','uiCard');const uiGear=uiEl('div','uiGear'),uiRotB=uiEl('div','uiRotB'),uiFpsEl=uiEl('div','uiFps'),uiSet=uiEl('div','uiSet'),uiTitle=uiEl('div','uiTitle');
{const hz=document.getElementById('apHz');if(hz&&hz.parentElement&&hz.parentElement.parentElement)hz.parentElement.parentElement.id='uiApHud'}
$('msg').style.display='none';
const uiSpan=(k)=>'<i style="background-image:'+uiIc(uiI[k]).split('"').join('&quot;')+'"></i>';
function uiTitleSync(){const canRot=uiRotOK&&(inRot||uiRH()>uiRW()*1.05);
 const side=uiRotOK&&(inRot||uiRH()>uiRW()*1.05),ver=(($('msg').textContent||'').match(/version\s*\d+/i)||[''])[0],it=(k,a,b)=>'<div>'+uiSpan(k)+'<span>'+a+'<small>'+b+'</small></span></div>',ri='<i style="transform:scaleX(-1);background-image:'+uiIc(uiI.rot).split('"').join('&quot;')+'"></i>';
 uiTitle.innerHTML='<div class="ui-wm"><span class="ui-wl"><b>Block</b><b>City</b></span><div class="ui-rule"></div><div class="ui-tl">Open world &middot; Drive &middot; Fly &middot; Rule</div></div>'
  +'<div class="ui-b ui-play ui-play2">Play</div>'
  +'<div class="ui-opt">'+(side?'<div class="ui-optl">'+(inRot?'Screen rotated':'Play sideways')+'</div><div class="ui-b'+(inRot===1?' ui-on':'')+'" data-a="rot1">'+uiSpan('rot')+'Turn left</div><div class="ui-b'+(inRot===2?' ui-on':'')+'" data-a="rot2">Turn right'+ri+'</div>'+(inRot?'<div class="ui-b" data-a="rot0">Upright</div>':''):'')+'<div class="ui-b" data-a="set">'+uiSpan('gear')+'Settings</div></div>'
  +'<div class="ui-ctl">'+it('move','Move','Left thumb')+it('look','Look','Drag')+it('look','Zoom','Pinch')+it('fire','Shoot','Tap target')+it('car','Vehicles','Car button')+it('map','Map','Tap radar')+'</div>'
  +'<div class="ui-keys">WASD &middot; Mouse &middot; Space &middot; E &middot; F &middot; Q &middot; M</div><div class="ui-ver">'+ver+'</div>'}
uiTitle.addEventListener('touchstart',e=>{const a=e.target&&e.target.closest?e.target.closest('[data-a]'):null;if(!a)return;e.preventDefault();e.stopPropagation();const k=a.getAttribute('data-a');if(k.indexOf('rot')===0){uiS.rot=+k.charAt(3)||0;uiS.hint=1;uiSave();uiApplyRot()}else uiOpenSet()},{passive:false});
// ----- graphics quality -----
const uiQPR=[.6,.7,.85,1,1.25,1.5,1.75,2,2.5,3],uiQFar=[150,150,180,210,240,266,266,266,266,266],uiQP=[0,0,4,6,8,10,12,16,16,16],uiQC=[0,0,1,2,3,4,5,6,6,6];
function uiApplyQ(){const q=uiClamp(Math.round(uiS.q),1,10),i=q-1,pr=Math.min(devicePixelRatio||1,uiQPR[i]);
 try{renderer.setPixelRatio(pr);composer.setPixelRatio(pr);bloom.enabled=q>=5;fxaa.enabled=q>=3;
  const sh=q>=4,ms=q>=7?4096:2048;if(sun.castShadow!==sh)sun.castShadow=sh;if(sun.shadow.mapSize.x!==ms){sun.shadow.mapSize.set(ms,ms);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}
  const far=uiQFar[i];cam.far=far;cam.updateProjectionMatrix();scene.fog.far=far-4;scene.fog.near=far*.46;sky.scale.setScalar((far-14)/600);stars.scale.setScalar((far-19)/550);
  if(typeof rlMaxPeople!=='undefined')rlMaxPeople=uiQP[i];if(typeof rlMaxCars!=='undefined')rlMaxCars=uiQC[i];
  document.body.classList.toggle('ui-noblur',q<=4);size();size2()}catch(e){console.log('ui quality',e)}}
// ----- settings panel -----
const uiSl={q:{n:'Graphics quality',min:1,max:10,step:1,f:v=>Math.round(v)+' / 10'},vol:{n:'Master volume',min:0,max:1,step:.05,f:v=>Math.round(v*100)+'%'},sens:{n:'Camera sensitivity',min:.3,max:2.5,step:.1,f:v=>v.toFixed(1)+'x'}};
function uiSlHtml(k){const d=uiSl[k],p=(uiS[k]-d.min)/(d.max-d.min)*100;return '<div class="ui-it"><div class="ui-lb"><span>'+d.n+(k==='q'?'<span class="ui-chip'+(uiS.auto?' on':'')+'" data-a="auto">AUTO</span>':'')+'</span><em id="uiV_'+k+'">'+d.f(uiS[k])+'</em></div><div class="ui-sl"><div class="ui-pm" data-a="dec" data-k="'+k+'">&minus;</div><div class="ui-tr" data-a="sl" data-k="'+k+'"><div class="ui-fl" id="uiF_'+k+'" style="width:'+p+'%"></div><div class="ui-th" id="uiT_'+k+'" style="left:'+p+'%"></div></div><div class="ui-pm" data-a="inc" data-k="'+k+'">+</div></div></div>'}
function uiTgHtml(k,n,sub,off){return '<div class="ui-tg'+(off?' off':'')+'" data-a="tg" data-k="'+k+'"><span>'+n+(sub?'<small>'+sub+'</small>':'')+'</span><div class="ui-sw'+(uiS[k]?' on':'')+'"></div></div>'}
function uiRender(){const canRot=uiRotOK&&(inRot||uiRH()>uiRW()*1.05),jobs=typeof msPassed!=='undefined'?' &middot; '+msPassed+' jobs':'';
 uiSet.innerHTML='<div class="ui-pan"><div class="ui-hd"><b>'+(uiPrev==='ready'?'SETTINGS':'PAUSED')+'</b><span>$'+cash+' &middot; '+kills+' takedowns &middot; '+coinN+' coins'+jobs+'</span></div><div class="ui-grid"><div>'+uiSlHtml('q')+uiSlHtml('vol')+uiSlHtml('sens')+'</div><div>'
  +'<div class="ui-tg"><span>Rotate screen<small>Play in any direction</small></span></div><div class="ui-seg">'+[0,1,3,2].map(m=>'<div class="ui-b'+((uiS.rot|0)===m?' on':'')+'" data-a="rotset" data-k="'+m+'">'+uiRotName[m]+'</div>').join('')+'</div>'+uiTgHtml('lh','Left-handed layout','Swap joystick and buttons')+uiTgHtml('invY','Invert camera Y')+uiTgHtml('fps','Show FPS')+'</div></div>'
  +'<div class="ui-ft">'+(uiPrev==='ready'?'':'<div class="ui-b" data-a="respawn">Reset character</div>')+'<div class="ui-b ui-warn" data-a="wipe">'+(uiConfirm?'Tap again to erase':'Reset saved game')+'</div><div class="ui-b ui-res" data-a="close">'+(uiPrev==='ready'?'Done':'Resume')+'</div></div></div>'}
function uiSetVal(k,v,live){const d=uiSl[k];v=uiClamp(Math.round(v/d.step)*d.step,d.min,d.max);if(k==='q'&&uiS.auto&&v!==uiS.q){uiS.auto=0;const ch=uiSet.querySelector('.ui-chip');if(ch)ch.classList.remove('on')}uiS[k]=v;
 const p=(v-d.min)/(d.max-d.min)*100,f=document.getElementById('uiF_'+k),t=document.getElementById('uiT_'+k),e=document.getElementById('uiV_'+k);if(f)f.style.width=p+'%';if(t)t.style.left=p+'%';if(e)e.textContent=d.f(v);
 if(k==='sens')uiSens=v;if(k==='vol')uiVolT=0;if(k==='q'&&!live)uiApplyQ()}
function uiSlAt(k,x){const tr=uiSet.querySelector('.ui-tr[data-k='+k+']');if(!tr)return;const r=tr.getBoundingClientRect(),d=uiSl[k];uiSetVal(k,d.min+uiClamp((x-r.left)/r.width,0,1)*(d.max-d.min),true)}
function uiOpenSet(){if(uiOpen||(state!=='play'&&state!=='ready'))return;uiOpen=true;uiPrev=state;state='settings';uiConfirm=0;uiRender();uiSet.classList.add('ui-show');fireId=null;joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;uiPinch=null}
function uiCloseSet(){if(!uiOpen)return;uiOpen=false;uiSet.classList.remove('ui-show');if(state==='settings')state=uiPrev;uiSave();uiApplyQ()}
uiSet.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const t=e.changedTouches[0],el=e.target&&e.target.closest?e.target.closest('[data-a]'):null;if(!el)return;const a=el.getAttribute('data-a'),k=el.getAttribute('data-k');if(a!=='wipe')uiConfirm=0;
 if(a==='sl'){uiDrag={k:k,id:t.identifier};uiSlAt(k,t.clientX)}
 else if(a==='dec'||a==='inc')uiSetVal(k,uiS[k]+(a==='inc'?1:-1)*uiSl[k].step)
 else if(a==='auto'){uiS.auto=uiS.auto?0:1;uiAutoBad=0;uiRender()}
 else if(a==='rotset'){uiS.rot=+k||0;uiS.hint=1;uiApplyRot();uiRender()}
 else if(a==='tg'){uiS[k]=uiS[k]?0:1;if(k==='invY')uiInvY=uiS.invY?-1:1;if(k==='rot'){uiS.hint=1;uiApplyRot()}else uiLayout();uiRender()}
 else if(a==='respawn'){uiCloseSet();respawn()}
 else if(a==='wipe'){if(!uiConfirm){uiConfirm=1;uiRender()}else{uiConfirm=0;cash=0;coinN=0;kills=0;WEAP[1].ammo=60;WEAP[2].ammo=12;WEAP[3].ammo=3;wi=0;if(typeof msPassed!=='undefined'){msPassed=0;msBest=0}try{localStorage.removeItem('blockcity_save')}catch(x){}if(typeof msSave==='function')msSave();uiRender();toast('Saved game erased')}}
 else if(a==='close')uiCloseSet()},{passive:false});
uiSet.addEventListener('touchmove',e=>{e.stopPropagation();if(uiDrag)for(const t of e.changedTouches)if(t.identifier===uiDrag.id)uiSlAt(uiDrag.k,t.clientX)});
{const up=e=>{e.stopPropagation();if(uiDrag){const k=uiDrag.k;uiDrag=null;uiSave();if(k==='q')uiApplyQ()}};uiSet.addEventListener('touchend',up);uiSet.addEventListener('touchcancel',up)}
uiRotB.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(state==='play'||state==='ready')uiRotCycle()},{passive:false});
uiGear.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();uiOpenSet()},{passive:false});
// Esc / P: menu. If Esc first closed the map or the phone, it does only that.
{let busy=false;addEventListener('keydown',e=>{busy=(typeof mpOpen!=='undefined'&&mpOpen)||(typeof chOpenF!=='undefined'&&chOpenF)},true);
 addEventListener('keydown',e=>{if(e.key!=='Escape'&&e.key!=='p')return;if(e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]'))return;if(busy)return;
  if(!uiOpen&&typeof stPhOpen!=='undefined'&&stPhOpen&&typeof stClosePhone==='function'){if(e.key==='Escape')stClosePhone();return}if(uiOpen)uiCloseSet();else uiOpenSet()})}
// ----- floating joystick: base asks this before it reads the stick position, so the stick is moved under the thumb first -----
function uiJoyZone(t){const W=innerWidth,H=innerHeight;if(t.pt==='mouse')return false;  // the mouse never drives the touch stick (WASD does)
 if(!((uiS.lh?t.clientX>W*.55:t.clientX<W*.45)&&t.clientY>H*.36))return false;
 if(joy.id===null&&!uiOpen){const R=stick.offsetWidth/2||63,x=uiClamp(t.clientX,R+6,W-R-6),y=uiClamp(t.clientY,H*.36+R*.5,H-R-6);stick.style.left=(x-R)+'px';stick.style.top=(y-R)+'px';stick.style.bottom='auto';stick.style.right='auto';uiFloat=true}return true}
// ----- pressed states (capture: sees every touch even when a button stops it) -----
const uiHeld={};
addEventListener('touchstart',e=>{for(const t of e.changedTouches){const el=t.target&&t.target.closest?t.target.closest('.btn,#radio,#uiGear,.ui-b,.ui-pm'):null;if(el){el.classList.add('ui-on');uiHeld[t.identifier]=el}}},true);
{const rel=e=>{for(const t of e.changedTouches){const el=uiHeld[t.identifier];if(el){el.classList.remove('ui-on');delete uiHeld[t.identifier]}}if(!e.touches||!e.touches.length)for(const k in uiHeld){uiHeld[k].classList.remove('ui-on');delete uiHeld[k]}};addEventListener('touchend',rel,true);addEventListener('touchcancel',rel,true)}
// ----- pinch zoom: a second free finger while one is already looking -----
const uiFind=(l,id)=>{for(const t of l)if(t.identifier===id)return t;return null};
addEventListener('touchstart',e=>{if(state!=='play'||uiPinch)return;for(const t of e.changedTouches){if(t.identifier===look.id||t.identifier===joy.id||t.identifier===fireId)continue;if(look.id===null)continue;
 if(hit($('fire'),t)||hit($('wpn'),t)||hit($('jump'),t)||hit($('car'),t))continue;const a=uiFind(e.touches,look.id);if(!a)continue;
 uiPinch={a:look.id,b:t.identifier,d:Math.max(24,Math.hypot(a.clientX-t.clientX,a.clientY-t.clientY)),z:uiZoom};look.id=null;break}});
addEventListener('touchmove',e=>{if(!uiPinch)return;const a=uiFind(e.touches,uiPinch.a),b=uiFind(e.touches,uiPinch.b);if(!a||!b){uiPinch=null;return}uiZoom=uiZoomT=uiClamp(uiPinch.z*uiPinch.d/Math.max(24,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)),.42,2.6)});
{const end=e=>{if(!uiPinch)return;for(const t of e.changedTouches)if(t.identifier===uiPinch.a||t.identifier===uiPinch.b){uiPinch=null;return}if(!e.touches||e.touches.length<2)uiPinch=null};addEventListener('touchend',end);addEventListener('touchcancel',end)}
// ----- per-frame -----
const uiBoot=document.getElementById('uiBoot');let uiBootN=0;   // boot card from mod.py: fades once the first frame (with the new title) is on screen
let uiLast=performance.now(),uiAcc=0,uiN=0,uiWarm=0,uiAutoBad=0,uiVolT=0,uiCarS='',uiJumpS='',uiTitleOn=true,uiFpsV=0;
MODS.push(function(dt){const now=performance.now(),rt=Math.min(.5,(now-uiLast)/1000);uiLast=now;
 if(uiBoot&&uiBootN<2&&++uiBootN===2){uiBoot.style.opacity='0';setTimeout(()=>{try{uiBoot.remove()}catch(e){}},500)}
 const ready=state==='ready'||(state==='settings'&&uiPrev==='ready');if(ready!==uiTitleOn){uiTitleOn=ready;if(ready){uiTitle.classList.remove('ui-out');uiTitle.style.display='flex'}else{uiTitle.classList.add('ui-out');setTimeout(()=>{if(!uiTitleOn)uiTitle.style.display='none'},600);if(state==='play'){try{window.dispatchEvent(new Event('bc-play'))}catch(e){}}}document.body.classList.toggle('ui-title',ready);if(!ready&&!uiS.hint){uiS.hint=1;uiSave()}}
 if(carLbl!==uiCarS){uiCarS=carLbl;$('car').setAttribute('data-s',carLbl)}const js=$('jump').textContent;if(js!==uiJumpS){uiJumpS=js;$('jump').setAttribute('data-s',js)}
 const on=joy.id!==null;if(stick.classList.contains('ui-on')!==on)stick.classList.toggle('ui-on',on);if(!on&&uiFloat){stick.style.left='';stick.style.top='';stick.style.bottom='';stick.style.right='';uiFloat=false}
 const as=innerHeight>innerWidth?.5:.8;if(arrow.scale.x!==as)arrow.scale.setScalar(as);
 const low=hp<30,hb=$('hpb');if(hb.classList.contains('ui-low')!==low)hb.classList.toggle('ui-low',low);
 uiVolT-=rt;if(uiVolT<=0){uiVolT=.5;if(typeof auMaster!=='undefined'&&auMaster&&auMaster.gain){if(uiVolBase===null)uiVolBase=auMaster.gain.value;auMaster.gain.value=uiVolBase*uiS.vol}}
 // frame rate: counter + automatic quality (skips the first seconds while models load)
 if(document.hidden){uiAcc=0;uiN=0;return}uiWarm+=rt;uiAcc+=rt;uiN++;
 if(uiAcc>=1.5){uiFpsV=uiN/uiAcc;uiAcc=0;uiN=0;if(uiS.fps)uiFpsEl.textContent=Math.round(uiFpsV)+' FPS  Q'+uiS.q+(uiS.auto?' AUTO':'');
  if(uiS.auto&&uiWarm>5&&!uiOpen){if(uiFpsV<27){uiAutoBad++;if(uiAutoBad>=2&&uiS.q>1){uiS.q=Math.max(1,uiS.q-(uiFpsV<16?2:1));uiAutoBad=0;uiApplyQ();uiSave()}}else uiAutoBad=0}}});
document.body.classList.add('ui-title');uiTitleSync();uiApplyRot();uiApplyQ();

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

// ---------- gfx: static batching, stable shadows, FSR-style upscaling + sharpening, colour grade, quality policy ----------
let gxScale=1,gxSharp=.3,gxQ=8,gxEff=8,gxDyn=1,gxShN=1,gxFrame=0,gxUpOn=false,gxGood=0,gxBad=0,gxAcc=0,gxN=0,gxWarm=0,gxLodT=0,gxLast=performance.now();
const gxChunks=[],gxStats={calls:0,tris:0,merged:0,removed:0,on:false},gxNoBatch=location.hash.indexOf('gxnobatch')>=0,gxNoUp=location.hash.indexOf('gxnoup')>=0,gxFr=new THREE.Frustum(),gxPM=new THREE.Matrix4();
// ----- 1. static batching -----
function gxBatch(){scene.updateMatrixWorld(true);const C=110,chunks={},rm=[],winSet=new Set(winMats),shared={},sm={};
 const M=(k,f)=>sm[k]||(sm[k]=f());
 const add=(x,z,mk,mat,geo,sh)=>{const k=Math.floor(x/C)+'_'+Math.floor(z/C),c=chunks[k]||(chunks[k]={m:{},inst:{}});(c.m[mk]||(c.m[mk]={mat,g:[],sh})).g.push(geo)};
 const prep=(mesh,uv,ao)=>{let g=mesh.geometry.clone();if(g.index)g=g.toNonIndexed();for(const k of Object.keys(g.attributes))if(k!=='position'&&k!=='normal'&&k!=='uv')g.deleteAttribute(k);
  if(uv){const u=g.attributes.uv;for(let i=0;i<u.count;i++)u.setXY(i,u.getX(i)*uv.x,u.getY(i)*uv.y)}
  if(ao){const p=g.attributes.position,n=p.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){const v=p.getY(i)<0?.6:1;a[i*3]=a[i*3+1]=a[i*3+2]=v}g.setAttribute('color',new THREE.BufferAttribute(a,3))}
  g.applyMatrix4(mesh.matrixWorld);return g};
 const low=new THREE.BufferGeometry();{const parts=[[0,4.4,0,1.75],[1,3.8,.3,1.25],[-.9,3.9,-.4,1.3],[.1,3.7,-1,1.15],[-.2,3.75,1,1.2],[-.1,5.4,.1,1.2]].map(a=>{const q=new THREE.IcosahedronGeometry(1,1);q.scale(a[3],a[3]*.85,a[3]);q.translate(a[0],a[1],a[2]);return q});low.copy(U.mergeBufferGeometries(parts))}
 for(const o of scene.children.slice()){
  if(o.isMesh&&!o.isInstancedMesh&&!o.isSkinnedMesh&&!o.children.length&&o.visible&&!Array.isArray(o.material)){const g=o.geometry,p=g.parameters||{},m=o.material;let mk=null,mat=m,uv=null,ao=false,sh=3;
   if(winSet.has(m)&&m.map){const sid=m.map.source?m.map.source.uuid:m.map.uuid;uv=m.map.repeat.clone();if(!shared[sid]){shared[sid]=m.clone();shared[sid].map=m.map.clone();shared[sid].map.repeat.set(1,1);shared[sid].map.needsUpdate=true;if(m.emissiveMap){shared[sid].emissiveMap=m.emissiveMap.clone();shared[sid].emissiveMap.repeat.set(1,1);shared[sid].emissiveMap.needsUpdate=true}shared[sid].vertexColors=true}mat=shared[sid];mk='b'+sid;ao=true}
   else if(g===roofGeo&&m===roofMat){mk='cap'}
   else if(typeof fxRoofGeo!=='undefined'&&g===fxRoofGeo){mk='pr'+m.uuid}
   else if(m===lampMat){mk='lamp';sh=0}
   else if(g.type==='BoxGeometry'&&m.isMeshStandardMaterial&&!m.isMeshPhysicalMaterial&&!m.map&&!m.transparent&&!Object.keys(o.userData).length){const hex=m.color.getHex();
    if(p.height===2&&hex===0x666666){mk='roof';mat=M('roof',()=>m)}
    else if(p.width===.3&&p.height===6&&p.depth===.3){mk='pole';mat=M('pole',()=>m);sh=1}
    else if(p.height===.3&&p.width===BLOCK&&p.depth===BLOCK){mk='sw'+hex;mat=M(mk,()=>m);sh=2}
    else if(p.height===.35&&p.width===BLOCK-4){mk='pg'+hex;mat=M(mk,()=>m);sh=2}
    else if(p.width===40&&p.depth===40&&hex===0x5c8f5a){mk='hill';mat=M('hill',()=>m);sh=0}}
   if(mk){add(o.position.x,o.position.z,mk,mat,prep(o,uv,ao),sh);rm.push(o)}}
  else if(o.isGroup&&o.children.length===2&&o.children[0].geometry===trunkGeo&&o.children[1].geometry===canopyGeo&&o.visible){const k=Math.floor(o.position.x/C)+'_'+Math.floor(o.position.z/C),c=chunks[k]||(chunks[k]={m:{},inst:{}});
   (c.m.trunk||(c.m.trunk={mat:trunkMat,g:[],sh:1})).g.push(prep(o.children[0]));const lm=o.children[1].material;(c.inst[lm.uuid]||(c.inst[lm.uuid]={mat:lm,mx:[]})).mx.push(o.children[1].matrixWorld.clone());rm.push(o)}}
 const built=[];
 for(const k in chunks){const c=chunks[k],grp=new THREE.Group(),box=new THREE.Box3();grp.userData.gx=true;
  for(const mk in c.m){const e=c.m[mk],geo=U.mergeBufferGeometries(e.g);if(!geo)throw new Error('merge '+mk);geo.computeBoundingSphere();geo.computeBoundingBox();const me=new THREE.Mesh(geo,e.mat);me.castShadow=!!(e.sh&1);me.receiveShadow=!!(e.sh&2);me.matrixAutoUpdate=false;grp.add(me);box.union(geo.boundingBox);for(const q of e.g)q.dispose()}
  const inst=[];for(const u in c.inst){const e=c.inst[u],im=new THREE.InstancedMesh(low,e.mat,e.mx.length);e.mx.forEach((m,i)=>{im.setMatrixAt(i,m);box.expandByPoint(new THREE.Vector3().setFromMatrixPosition(m).add(new THREE.Vector3(0,4,0)))});im.instanceMatrix.needsUpdate=true;im.castShadow=true;im.frustumCulled=false;im.matrixAutoUpdate=false;grp.add(im);inst.push(im)}
  const sp=box.getBoundingSphere(new THREE.Sphere());sp.radius+=6;grp.matrixAutoUpdate=false;built.push({grp,sp,inst})}
 if(!built.length)return;
 for(const b of built){scene.add(b.grp);gxChunks.push(b)}
 for(const o of rm){scene.remove(o);if(o.isMesh&&o.geometry!==roofGeo&&!(typeof fxRoofGeo!=='undefined'&&o.geometry===fxRoofGeo))o.geometry.dispose();if(o.isMesh&&winSet.has(o.material))o.material.dispose()}
 winMats.length=0;for(const k in shared)winMats.push(shared[k]);
 gxStats.merged=built.length;gxStats.removed=rm.length;gxStats.on=true}
if(!gxNoBatch){try{gxBatch()}catch(e){console.log('gx batch skipped',e)}}
// ----- 2. upscale (bicubic with anti-ringing clamp) + contrast-adaptive sharpening -----
let gxPass=null;
try{if(!gxNoUp&&THREE.FullScreenQuad){const vs='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
 const m1=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null},src:{value:new THREE.Vector2(1,1)}},vertexShader:vs,depthTest:false,depthWrite:false,fragmentShader:[
  'uniform sampler2D tDiffuse;uniform vec2 src;varying vec2 vUv;',
  'void main(){vec2 sp=vUv*src,tc=floor(sp-.5)+.5,f=sp-tc;',
  'vec2 w0=f*(-.5+f*(1.-.5*f)),w1=1.+f*f*(-2.5+1.5*f),w2=f*(.5+f*(2.-1.5*f)),w3=f*f*(-.5+.5*f);',
  'vec2 w12=w1+w2,o12=w2/w12,t0=(tc-1.)/src,t3=(tc+2.)/src,t12=(tc+o12)/src;',
  'vec3 c=texture2D(tDiffuse,vec2(t0.x,t0.y)).rgb*w0.x*w0.y+texture2D(tDiffuse,vec2(t12.x,t0.y)).rgb*w12.x*w0.y+texture2D(tDiffuse,vec2(t3.x,t0.y)).rgb*w3.x*w0.y',
  '+texture2D(tDiffuse,vec2(t0.x,t12.y)).rgb*w0.x*w12.y+texture2D(tDiffuse,vec2(t12.x,t12.y)).rgb*w12.x*w12.y+texture2D(tDiffuse,vec2(t3.x,t12.y)).rgb*w3.x*w12.y',
  '+texture2D(tDiffuse,vec2(t0.x,t3.y)).rgb*w0.x*w3.y+texture2D(tDiffuse,vec2(t12.x,t3.y)).rgb*w12.x*w3.y+texture2D(tDiffuse,vec2(t3.x,t3.y)).rgb*w3.x*w3.y;',
  'vec3 a=texture2D(tDiffuse,tc/src).rgb,b=texture2D(tDiffuse,(tc+vec2(1.,0.))/src).rgb,d=texture2D(tDiffuse,(tc+vec2(0.,1.))/src).rgb,e=texture2D(tDiffuse,(tc+1.)/src).rgb;',
  'gl_FragColor=vec4(clamp(c,min(min(a,b),min(d,e)),max(max(a,b),max(d,e))),1.);}'].join('\n')});
 const m2=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null},px:{value:new THREE.Vector2(1,1)},sharp:{value:.3}},vertexShader:vs,depthTest:false,depthWrite:false,fragmentShader:[
  'uniform sampler2D tDiffuse;uniform vec2 px;uniform float sharp;varying vec2 vUv;',
  'void main(){vec3 e=texture2D(tDiffuse,vUv).rgb,b=texture2D(tDiffuse,vUv+vec2(0.,-px.y)).rgb,d=texture2D(tDiffuse,vUv+vec2(-px.x,0.)).rgb,f=texture2D(tDiffuse,vUv+vec2(px.x,0.)).rgb,h=texture2D(tDiffuse,vUv+vec2(0.,px.y)).rgb;',
  'vec3 mn=min(min(b,d),min(f,h)),mx=max(max(b,d),max(f,h));',
  'vec3 hmin=min(mn,e)/(4.*mx+1e-4),hmax=(1.-max(mx,e))/(4.*mn-4.-1e-4);vec3 lv=max(-hmin,hmax);',
  'float lobe=max(-.1875,min(max(lv.r,max(lv.g,lv.b)),0.))*sharp;',
  'gl_FragColor=vec4(clamp((lobe*(b+d+f+h)+e)/(4.*lobe+1.),0.,1.),1.);}'].join('\n')});
 const quad=new THREE.FullScreenQuad(m1),rt=new THREE.WebGLRenderTarget(4,4,{depthBuffer:false}),v=new THREE.Vector2();
 gxPass={enabled:true,needsSwap:false,clear:false,renderToScreen:true,setSize:function(){},dispose:function(){},
  render:function(r,wb,rb){r.getDrawingBufferSize(v);if(rt.width!==v.x||rt.height!==v.y)rt.setSize(v.x,v.y);
   m1.uniforms.tDiffuse.value=rb.texture;m1.uniforms.src.value.set(rb.width,rb.height);quad.material=m1;r.setRenderTarget(rt);quad.render(r);
   m2.uniforms.tDiffuse.value=rt.texture;m2.uniforms.px.value.set(1/v.x,1/v.y);m2.uniforms.sharp.value=gxSharp*4;quad.material=m2;r.setRenderTarget(null);quad.render(r)}};
 composer.addPass(gxPass);gxUpOn=true}}catch(e){console.log('gx upscaler off',e);gxPass=null;gxUpOn=false}
function gxSetScale(s){gxScale=Math.max(.4,Math.min(1,s));if(!gxUpOn)gxScale=1;try{composer.setPixelRatio(renderer.getPixelRatio()*gxScale);composer.setSize(innerWidth,innerHeight)}catch(e){}return gxScale}
// ----- 3. image quality -----
try{const an=Math.min(8,renderer.capabilities.getMaxAnisotropy()),seen=new Set();scene.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms)for(const k of['map','emissiveMap']){const t=m[k];if(t&&!seen.has(t)){seen.add(t);if(t.anisotropy<an){t.anisotropy=an;t.needsUpdate=true}}}})}catch(e){}
try{skyU.sd={value:new THREE.Vector3(0,1,0)};sky.material.fragmentShader=['uniform vec3 top;uniform vec3 bot;uniform vec3 sd;varying vec3 p;',
 'void main(){vec3 d=normalize(p);float h=d.y;vec3 c=mix(bot,top,pow(clamp(h*1.3,0.,1.),.75));',
 'c=mix(c,bot*1.1+.02,exp(-abs(h)*8.)*.5);float s=max(dot(d,normalize(sd)),0.),up=smoothstep(-.1,.15,sd.y);',
 'c+=vec3(1.,.8,.58)*(pow(s,5.)*.16+pow(s,60.)*.5)*up;gl_FragColor=vec4(c,1.);}'].join('\n');sky.material.needsUpdate=true}catch(e){console.log('gx sky',e)}
try{grade.material.fragmentShader=['uniform sampler2D tDiffuse;uniform float dmg,ex;varying vec2 vUv;',
 'vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}',
 'void main(){vec2 c=vUv-.5;float r=dot(c,c);vec3 col=aces(max(texture2D(tDiffuse,vUv).rgb,vec3(0.))*ex*1.06);',
 'float l=dot(col,vec3(.2126,.7152,.0722));col=mix(vec3(l),col,1.14);',
 'col+=vec3(-.010,.0,.016)*(1.-smoothstep(0.,.4,l))+vec3(.018,.008,-.014)*smoothstep(.45,1.,l);',
 'col=pow(clamp(col,0.,1.),vec3(1./2.2));col=mix(col,col*col*(3.-2.*col),.28);',
 'col*=1.-r*.5;col=mix(col,vec3(.75,0.,0.),dmg*smoothstep(.08,.45,r));gl_FragColor=vec4(col,1.);}'].join('\n');grade.material.needsUpdate=true;
 bloom.strength=.6;bloom.radius=.5;hemi.groundColor.set(0x3b4960)}catch(e){console.log('gx grade',e)}
// ----- shadows: texel-snapped so they do not shimmer, optional reduced update rate -----
const gxLM=new THREE.Matrix4(),gxLI=new THREE.Matrix4(),gxV1=new THREE.Vector3(),gxUp=new THREE.Vector3(0,1,0);
function gxSun(){try{const sc=sun.shadow.camera,st=(sc.right-sc.left)/sun.shadow.mapSize.x;gxLM.lookAt(sun.position,sun.target.position,gxUp);gxLI.copy(gxLM).transpose();
 gxV1.copy(sun.target.position).applyMatrix4(gxLI);const dx=Math.round(gxV1.x/st)*st-gxV1.x,dy=Math.round(gxV1.y/st)*st-gxV1.y;gxV1.set(dx,dy,0).applyMatrix4(gxLM);
 sun.position.add(gxV1);sun.target.position.add(gxV1);
 if(gxShN>1&&renderer.shadowMap.autoUpdate===false)renderer.shadowMap.needsUpdate=(gxFrame%gxShN===0)}catch(e){}}
// ----- 4. quality policy -----
const gxOUT=[1,1.25,1.5,2,2,2.5,3,3,3,3],gxSC=[.75,.72,.67,.62,.7,.67,.67,.77,.87,1],gxSH=[.4,.4,.38,.38,.35,.35,.33,.3,.25,.18];
function gxApply(q){q=Math.max(1,Math.min(10,Math.round(q||8)));gxEff=q;const i=q-1,dpr=devicePixelRatio||1,out=Math.min(dpr,gxOUT[i]),o={q,out,scale:1,shadow:0,every:1,bloom:q>=4};
 try{renderer.setPixelRatio(out);if(typeof size==='function')size();
  const floor=Math.min(1,Math.max(.5,Math.min(dpr,1.5)/out));o.scale=gxUpOn?Math.max(floor,Math.min(1,gxSC[i]*gxDyn+(1-gxSC[i])*0)):1;if(gxUpOn&&gxDyn>=1)o.scale=gxSC[i];gxSharp=gxSH[i];gxSetScale(o.scale);
  const sh=q>=4,ms=q>=9?4096:(q>=6?2048:1024);o.shadow=sh?ms:0;if(sun.castShadow!==sh)sun.castShadow=sh;if(sun.shadow.mapSize.x!==ms){sun.shadow.mapSize.set(ms,ms);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}
  gxShN=q>=8?1:(q>=6?2:3);o.every=gxShN;renderer.shadowMap.autoUpdate=gxShN<=1;renderer.shadowMap.needsUpdate=true;
  bloom.enabled=o.bloom;fxaa.enabled=true}catch(e){console.log('gx apply',e)}return o}
// auto: lower the internal render scale first (the upscaler hides it), then features, never the saved setting
function gxAuto(fps){const q0=gxQ;if(fps<27){gxGood=0;gxBad++;if(gxBad>=2){gxBad=0;if(gxDyn>.72)gxDyn=Math.max(.7,gxDyn-.1);else if(gxEff>4)gxEff--;else return gxEff;gxApply(gxEff)}}
 else if(fps>50){gxBad=0;gxGood++;if(gxGood>=4){gxGood=0;if(gxEff<q0){gxEff++;gxApply(gxEff)}else if(gxDyn<1){gxDyn=Math.min(1,gxDyn+.1);gxApply(gxEff)}}}else{gxBad=0;gxGood=0}return gxEff}
if(typeof uiApplyQ==='function'){try{if(uiS.auto&&uiS.q<8){uiS.q=8;uiSave()}}catch(e){}const u0=uiApplyQ;uiApplyQ=function(){u0();gxQ=uiS.q;gxDyn=1;gxApply(gxQ)};gxQ=uiS.q}
gxApply(gxQ);
MODS.push(function(dt){gxFrame++;const now=performance.now(),rt=Math.min(.5,(now-gxLast)/1000);gxLast=now;
 if(gxStats.measure){gxStats.calls=renderer.info.render.calls;gxStats.tris=renderer.info.render.triangles;renderer.info.reset()}
 try{if(typeof uiAutoBad!=='undefined')uiAutoBad=0}catch(e){}
 if(!document.hidden){gxWarm+=rt;gxAcc+=rt;gxN++;if(gxAcc>=1.5){const f=gxN/gxAcc;gxAcc=0;gxN=0;gxStats.fps=f;if(gxWarm>6&&state==='play'&&(typeof uiS==='undefined'||uiS.auto))gxAuto(f)}}
 try{const sa=dayT*Math.PI*2;skyU.sd.value.set(Math.cos(sa)*80,Math.sin(sa)*120,40)}catch(e){}
 if(gxUpOn&&composer.renderTarget1){const w=composer.renderTarget1.width,h=composer.renderTarget1.height;fxaa.uniforms.resolution.value.set(1/w,1/h)}
 if(gxChunks.length){gxPM.multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);gxFr.setFromProjectionMatrix(gxPM);const far=cam.far;
  for(const c of gxChunks){const d=c.sp.center.distanceTo(cam.position)-c.sp.radius;c.grp.visible=d<far;if(c.grp.visible&&c.inst.length){const v=gxFr.intersectsSphere(c.sp)||d<70;for(const m of c.inst)m.visible=v}}}
 gxLodTick(rt)});
// ----- options a settings menu can render -----
let gxSharpUser=null,gxBloomOn=true,gxShadowsOn=true;
const gxOptions=[
 {key:'upscale',label:'Upscaling (FSR-style)',type:'toggle',get:()=>!!(gxPass&&gxPass.enabled&&gxUpOn),set:v=>{if(!gxPass)return;gxPass.enabled=!!v;gxUpOn=!!v;gxApply(gxEff)}},
 {key:'scale',label:'Render scale',type:'slider',min:.5,max:1,step:.05,get:()=>gxScale,set:v=>{gxDyn=1;gxSetScale(v)}},
 {key:'sharp',label:'Sharpening',type:'slider',min:0,max:1,step:.05,get:()=>gxSharp,set:v=>{gxSharpUser=v;gxSharp=v}},
 {key:'bloom',label:'Bloom glow',type:'toggle',get:()=>bloom.enabled,set:v=>{gxBloomOn=!!v;bloom.enabled=!!v}},
 {key:'shadows',label:'Sun shadows',type:'toggle',get:()=>sun.castShadow,set:v=>{gxShadowsOn=!!v;sun.castShadow=!!v;renderer.shadowMap.needsUpdate=true}}];
{const a0=gxApply;gxApply=function(q){const o=a0(q);try{if(gxSharpUser!==null)gxSharp=gxSharpUser;if(!gxBloomOn)bloom.enabled=false;if(!gxShadowsOn)sun.castShadow=false}catch(e){}return o}}

// ----- far LOD: distant code-built people, cars and coins become instanced impostors (a few draw calls instead of thousands) -----
let gxLodPD=60,gxLodCD=85,gxImpOn=location.hash.indexOf('gxnoimp')<0;
const gxImp=(()=>{const vc=(g,r,gg,b)=>{g=g.index?g.toNonIndexed():g;for(const k of Object.keys(g.attributes))if(k!=='position'&&k!=='normal')g.deleteAttribute(k);const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=r;a[i*3+1]=gg;a[i*3+2]=b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g};
 const mk=(geo,n,inst)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:inst==='car'?.3:0}),n);m.count=0;m.frustumCulled=false;m.castShadow=true;m.receiveShadow=true;
  m.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(n*3),3);scene.add(m);return m};
 const cap=(r,l,y,sx,sz)=>{const g=new THREE.CapsuleGeometry(r,l,2,6);g.scale(sx||1,1,sz||1);g.translate(0,y,0);return g};
 const up=U.mergeBufferGeometries([vc(cap(.24,.42,1.42,1.25,.75),1,1,1),vc(cap(.08,.62,1.38,1,1).translate(-.37,0,0),1,1,1),vc(cap(.08,.62,1.38,1,1).translate(.37,0,0),1,1,1)]);
 const lo=U.mergeBufferGeometries([vc(cap(.12,.78,.55),1,1,1).translate(-.13,0,0),vc(cap(.12,.78,.55),1,1,1).translate(.13,0,0)]);
 const hd=vc(new THREE.SphereGeometry(.2,8,6).translate(0,2.02,0),1,1,1);
 const car=U.mergeBufferGeometries([vc(new THREE.BoxGeometry(2.16,.56,4.3).translate(0,.66,0),1,1,1),vc(new THREE.BoxGeometry(1.8,.5,2.1).translate(0,1.2,.25),.22,.24,.27),
  ...[[-1,-1.38],[1,-1.38],[-1,1.38],[1,1.38]].map(w=>vc(new THREE.BoxGeometry(.3,.8,.8).translate(w[0],.4,w[1]),.06,.06,.06))]);
 return {up:mk(up,160),lo:mk(lo,160),hd:mk(hd,160),car:mk(car,160,'car')}})();
const gxSkin=new THREE.Color(.78,.58,.44),gxTmpC=new THREE.Color();
function gxMask(o,m){o.traverse(q=>{q.layers.mask=m})}
function gxLodTick(rt){gxLodT-=rt;const dec=gxLodT<=0;if(dec)gxLodT=.4;const P=cam.position;let np=0,nc=0;
 try{if(typeof rlPeople!=='undefined')for(const g of rlPeople){const u=g.userData,b=g.children[0];if(!b||g===player)continue;
  const far=gxImpOn&&g.parent===scene&&g.visible&&!u.av&&Math.hypot(g.position.x-P.x,g.position.z-P.z)>gxLodPD;
  if(dec&&far!==!!u.gxF){u.gxF=far;gxMask(b,far?2:1)}
  if(u.gxF&&np<160&&b.visible!==false){const m=g.matrixWorld;gxImp.up.setMatrixAt(np,m);gxImp.lo.setMatrixAt(np,m);gxImp.hd.setMatrixAt(np,m);
   if(!u.gxSC){const ch=b.children;u.gxSC=(ch[0]&&ch[0].material&&ch[0].material.color?ch[0].material.color:new THREE.Color(.5,.5,.55)).clone();u.gxPC=(ch[1]&&ch[1].material&&ch[1].material.color?ch[1].material.color:new THREE.Color(.2,.2,.25)).clone()}
   gxImp.up.setColorAt(np,u.gxSC);gxImp.lo.setColorAt(np,u.gxPC);gxImp.hd.setColorAt(np,gxSkin);np++}}}catch(e){}
 try{const lists=[cars,traffic];for(const L of lists)for(const e of L){const g=e.m;if(!g||!g.children[0]||g.children[0].geometry!==CAR.body)continue;const u=g.userData;
  const far=gxImpOn&&g.parent===scene&&g.visible&&!(typeof driving!=='undefined'&&driving&&driving.m===g)&&!(u.rl&&u.rl.visible)&&Math.hypot(g.position.x-P.x,g.position.z-P.z)>gxLodCD;
  if(dec&&far!==!!u.gxF){u.gxF=far;for(const ch of g.children)if(!ch.userData.rlKeep)gxMask(ch,far?2:1)}
  if(u.gxF&&nc<160){gxImp.car.setMatrixAt(nc,g.matrixWorld);gxImp.car.setColorAt(nc,g.children[0].material.color);nc++}
  if(dec&&u.rl&&!u.gxProx)gxProxy(u.rl,u)}}catch(e){}
 for(const k of['up','lo','hd'])gxImp[k].count=np;gxImp.car.count=nc;
 for(const k in gxImp){const m=gxImp[k];if(m.count){m.instanceMatrix.needsUpdate=true;m.instanceColor.needsUpdate=true}}}
// coins: one instanced draw instead of 140
const gxCoin=(()=>{try{const c0=coins[0];if(!c0)return null;const m=new THREE.InstancedMesh(c0.geometry,c0.material,coins.length);m.frustumCulled=false;m.castShadow=true;scene.add(m);for(const c of coins)c.layers.mask=2;return m}catch(e){return null}})();
MODS.push(function(){if(!gxCoin)return;let n=0;for(const c of coins)if(c.visible){c.updateMatrix();gxCoin.setMatrixAt(n++,c.matrix)}gxCoin.count=n;gxCoin.instanceMatrix.needsUpdate=true});

// the downloaded sports car is ~360k triangles: let a 30-triangle invisible stand-in cast its shadow instead (halves the shadow pass)
const gxProxMat=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}),gxProxGeo=U.mergeBufferGeometries([new THREE.BoxGeometry(1.9,.55,4.3).translate(0,.6,0).toNonIndexed(),new THREE.BoxGeometry(1.6,.45,1.9).translate(0,1.05,.15).toNonIndexed()]);
function gxProxy(rl,u){u.gxProx=true;const bb=new THREE.Box3().setFromObject(rl);rl.traverse(o=>{if(o.isMesh)o.castShadow=false});const m=new THREE.Mesh(gxProxGeo,gxProxMat);m.castShadow=true;m.renderOrder=-1;
 const inv=new THREE.Matrix4().copy(rl.matrixWorld).invert(),sz=bb.getSize(new THREE.Vector3()),c=bb.getCenter(new THREE.Vector3()).applyMatrix4(inv);m.position.set(c.x,0,c.z);rl.add(m)}
{const a1=gxApply;gxApply=function(q){const o=a1(q);try{const i=Math.max(1,Math.min(10,Math.round(q)))-1;if(typeof rlMaxCars!=='undefined'){rlMaxCars=[0,0,1,2,2,3,3,4,5,6][i];o.hdCars=rlMaxCars}if(typeof rlMaxPeople!=='undefined'){rlMaxPeople=[0,2,4,6,8,10,12,16,18,20][i];o.hdPeople=rlMaxPeople}gxLodPD=[35,40,45,50,55,60,60,65,70,75][i];gxLodCD=[50,55,60,70,75,80,85,90,100,110][i]}catch(e){}return o}}
gxApply(gxQ);

// ---------- main loop ----------
let last=performance.now(),T=0,mapTick=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(0.05,(now-last)/1000);last=now;T+=dt;
 // day/night cycle (about 4 minutes per day)
 dayT=(dayT+dt/(60*(uiS.day||20)))%1;const sunA=dayT*Math.PI*2,sunH=Math.sin(sunA),day=Math.max(0,Math.min(1,sunH*3+0.5));
 sun.intensity=0.15+day*0.95;hemi.intensity=0.06+day*0.22;
 skyU.top.value.setRGB(.05+.18*day,.07+.4*day,.18+.66*day);skyU.bot.value.setRGB(.1+.65*day+.2*(1-day)*Math.max(0,1-Math.abs(sunH)*4),.12+.77*day,.25+.75*day);
 weatherTick(dt);scene.fog.color.copy(skyU.bot.value);stars.material.opacity=1-day;
 const night=1-day;for(const m of winMats)m.emissiveIntensity=night*1.6;lampMat.emissiveIntensity=night*5;
 $('clock').textContent=(()=>{const h=Math.floor((dayT*24+6)%24),mm=Math.floor((dayT*24*60)%60);return (h%12||12)+':'+String(mm).padStart(2,'0')+(h<12?' AM':' PM')})();
 combatTick(dt);v3Tick(dt);envTick(dt);for(const f of MODS)f(dt);
 // coins spin
 for(const c of coins)if(c.visible)c.rotation.z+=dt*3;
 // pedestrians walk around their block
 for(const p of peds){if(p.userData.dead){const u=p.userData;if(u.deadT<1){u.deadT+=dt*3;p.rotation.x=-Math.min(1,u.deadT)*Math.PI/2*Math.sign(1);p.position.addScaledVector(u.fall,dt*4)}continue}if(p.userData.lfOn)continue;const q=p.userData.path;q.t+=dt*q.spd*q.dir/ (q.r*2) ;const per=((q.t%4)+4)%4,side=Math.floor(per),f=per-side,r=q.r;
  let x,z;if(side===0){x=-r+2*r*f;z=-r}else if(side===1){x=r;z=-r+2*r*f}else if(side===2){x=r-2*r*f;z=r}else{x=-r;z=r-2*r*f}
  const nx=q.cx+x,nz=q.cz+z;const dx=nx-p.position.x,dz=nz-p.position.z;if(dx||dz)p.rotation.y=Math.atan2(-dx,-dz);p.position.set(nx,0.3,nz);
  const sw=Math.sin(T*6*q.spd+q.cx)*0.6;const u=p.userData;u.armL.rotation.x=sw;u.armR.rotation.x=-sw;u.legL.rotation.x=-sw;u.legR.rotation.x=sw}
 // traffic
 for(const t of traffic){if(t.dead)continue;let blocked=!!t.lfStop;const ahead=t.alongX?new THREE.Vector3(t.dir,0,0):new THREE.Vector3(0,0,t.dir);
  const tp=t.m.position;const toP=(driving?driving.m.position:pos).clone().sub(tp);if(toP.dot(ahead)>0&&toP.dot(ahead)<9&&toP.clone().sub(ahead.clone().multiplyScalar(toP.dot(ahead))).length()<2.5)blocked=true;
  if(!blocked)t.pos+=t.dir*t.spd*dt;if(t.pos>HALF-5){t.pos=HALF-5;t.dir=-1}if(t.pos<-HALF+5){t.pos=-HALF+5;t.dir=1}placeTraffic(t);
  for(const w of t.m.userData.wheels)w.rotation.x+=(blocked?0:t.spd)*dt*2}
 if(state==='play'){
  let jx=joy.x,jy=joy.y;const jm=Math.hypot(jx,jy);if(jm<uiS.dz){jx=0;jy=0}else{const s2=(jm-uiS.dz)/(1-uiS.dz)/jm;jx*=s2;jy*=s2}
  // enter / exit car
  if(carQ){carQ=false;if(driving){const c=driving.m;pos.set(c.position.x+Math.cos(c.rotation.y)*-2.4,0,c.position.z-Math.sin(c.rotation.y)*-2.4);collide(pos,0.5);driving.speed=0;driving=null;player.visible=true;toast('Got out')}
   else{let best=null,bd=5;for(const c of cars){if(c.dead)continue;const d=c.m.position.distanceTo(new THREE.Vector3(pos.x,0,pos.z));if(d<bd){bd=d;best=c}}
    best=nearestCar();if(best){driving=best;player.visible=false}else toast('Get closer to a car')}}
  if(driving&&driving.vhT){vhDrive(dt,jx,jy)}else if(driving&&driving.custom){}else if(driving){const c=driving,m=c.m;const throttle=-jy,steer=-jx;
   c.speed+=throttle*28*dt;c.speed*=Math.pow(0.6,dt);if(Math.abs(throttle)<0.05)c.speed*=Math.pow(0.4,dt);c.speed=Math.max(-12,Math.min(m.userData.max||38,c.speed));
   m.rotation.y+=steer*dt*Math.min(1,Math.abs(c.speed)/6)*2.2*Math.sign(c.speed||1);
   const fwd=new THREE.Vector3(-Math.sin(m.rotation.y),0,-Math.cos(m.rotation.y));m.position.addScaledVector(fwd,c.speed*dt);
   fxBounds(c,m);if(collide(m.position,1.9)){if(Math.abs(c.speed)>14)toast('CRASH!');c.speed*=-0.3}
   for(const t of traffic)if(t.m.position.distanceTo(m.position)<3.4){const push=m.position.clone().sub(t.m.position).setY(0).normalize();m.position.addScaledVector(push,0.6);if(Math.abs(c.speed)>10)toast('BUMP!');c.speed*=-0.3}
   for(const w of m.userData.wheels)w.rotation.x-=c.speed*dt*2;
   for(const o of cars)if(o!==c){const d=o.m.position.distanceTo(m.position);if(d<3.2&&d>.01){const push=m.position.clone().sub(o.m.position).setY(0).normalize();m.position.addScaledVector(push,3.2-d);if(!o.dead)o.m.position.addScaledVector(push,-Math.abs(c.speed)*.015);if(Math.abs(c.speed)>10){toast('CRASH!');shake=.3;sfx(.3,600,.6)}c.speed*=.5}}
   if(Math.abs(c.speed)>9){for(const q of peds)if(!q.userData.dead&&q.position.distanceTo(m.position)<2.5){killPed(q,m.position);shake=.3;sfx(.2,300,.6)}for(const e of shooters)if(!e.dead&&e.g.position.distanceTo(m.position)<2.5)killShooter(e,m.position)}
   pos.copy(m.position);facing=m.rotation.y;
   if(jumpQ){jumpQ=false;c.speed+=12;toast('BOOST')}}
  else{const fx=-Math.sin(camYaw),fz=-Math.cos(camYaw),rx=Math.cos(camYaw),rz=-Math.sin(camYaw);
   const ix=jx*rx+(-jy)*fx,iz=jx*rz+(-jy)*fz,mag=Math.min(1,Math.hypot(jx,jy));const spd=10;
   const acc=onGround?(mag>0?14:30):5;vel.x+=(ix*spd-vel.x)*Math.min(1,acc*dt);vel.z+=(iz*spd-vel.z)*Math.min(1,acc*dt);
   if(knock>0){knock-=dt}
   if(mag>0.1)facing=Math.atan2(-ix,-iz);
   if(jumpQ&&onGround){vel.y=11;onGround=false}jumpQ=false;
   vel.y-=30*dt;pos.addScaledVector(vel,dt);
   const floorY=0.3;if(pos.y<=floorY){pos.y=floorY;vel.y=0;onGround=true}
   collide(pos,0.55,pos.y-0.2);
   for(const t of traffic)if(t.m.position.distanceTo(new THREE.Vector3(pos.x,0,pos.z))<2.6&&knock<=0){const push=new THREE.Vector3(pos.x,0,pos.z).sub(t.m.position).normalize();vel.x=push.x*18;vel.z=push.z*18;vel.y=9;onGround=false;knock=1;toast('Watch the traffic!')}
   for(const c of cars){const d=c.m.position.distanceTo(new THREE.Vector3(pos.x,0,pos.z));if(d<2.4){const push=new THREE.Vector3(pos.x,0,pos.z).sub(c.m.position).normalize();pos.x+=push.x*(2.4-d);pos.z+=push.z*(2.4-d)}}}
  // coins
  for(const c of coins)if(c.visible&&Math.hypot(c.position.x-pos.x,c.position.z-pos.z)<(driving?3:1.4)){c.visible=false;coinN++;cash+=10;setTimeout(()=>{c.visible=true},45000)}
  // missions
  msTick(dt);
  $('cash').textContent='$'+cash;$('cn').textContent='● '+coinN}
 // player animation
 player.position.copy(pos);if(!driving){player.rotation.y+=(((facing-player.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI)*Math.min(1,12*dt);
  const hs=Math.hypot(vel.x,vel.z);walkT+=hs*dt*1.3;const sw=onGround?Math.sin(walkT)*Math.min(1,hs/6)*0.9:0.4;const u=player.userData;
  u.armL.rotation.x=sw;u.armR.rotation.x=-sw;u.legL.rotation.x=-sw;u.legR.rotation.x=sw;if(!onGround)u.armL.rotation.x=u.armR.rotation.x=-2.5}
 if(box.visible){box.position.set(pos.x,pos.y+(driving?2.6:3.3),pos.z);box.rotation.y+=dt}
 // mission marker
 beam.position.set(mission.target.x,60,mission.target.z);ring.position.set(mission.target.x,0.4+Math.sin(T*3)*.2,mission.target.z);ring.rotation.z+=dt;
 beamMat.color.set(mission.stage==='pickup'?0x33ff88:0xffaa22);ring.material.color.copy(beamMat.color);arrow.material.color.copy(beamMat.color);
 const toT=new THREE.Vector3(fxTgt().x-pos.x,0,fxTgt().z-pos.z);arrow.visible=beam.visible||fxHasWay();arrow.position.set(pos.x,pos.y+(driving?4:4.4),pos.z);arrow.rotation.set(0,0,0);arrow.lookAt(pos.x+toT.x,arrow.position.y,pos.z+toT.z);arrow.rotateX(Math.PI/2);
 // camera
 if(driving&&!look.id&&!uiRMB&&uiS.ac){const target=driving.m.rotation.y;camYaw+=(((target-camYaw+Math.PI*3)%(Math.PI*2))-Math.PI)*Math.min(1,2.5*dt)}
 const dist=(driving?(driving.camD||13):9)*uiZoom*(uiS.cd||1),h=driving?(driving.camH||1.5):2;const cx=pos.x+Math.sin(camYaw)*Math.cos(camPitch)*dist,cz=pos.z+Math.cos(camYaw)*Math.cos(camPitch)*dist,cy=pos.y+h+Math.sin(camPitch)*dist;
 const uiOx=uiShift&&!driving?Math.cos(camYaw)*1.6:0,uiOz=uiShift&&!driving?-Math.sin(camYaw)*1.6:0;cam.position.lerp(new THREE.Vector3(cx+uiOx,Math.max(1,cy),cz+uiOz),Math.min(1,10*dt));cam.lookAt(pos.x+uiOx,pos.y+h,pos.z+uiOz);if(shake>.01){cam.position.x+=(Math.random()-.5)*shake;cam.position.y+=(Math.random()-.5)*shake;}
 sun.position.set(pos.x+Math.cos(sunA)*80,Math.max(10,sunH*120),pos.z+40);sun.target.position.copy(pos);gxSun();sky.position.copy(cam.position);stars.position.copy(cam.position);
 if((mapTick=(mapTick+1)%3)===0)drawMap();
 lfCam(dt);grade.uniforms.dmg.value=dmgFx;composer.render()}
requestAnimationFrame(frame)}
<\/script></body></html>`
let wv = new WebView()
await wv.loadHTML(html)
await wv.present(true)
