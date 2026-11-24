// Block City v3: huge city + beach, detailed cars and people, reflections, tap to shoot, steal any car, police, gangs, weapons
// FIRE (red) auto-aims and shoots. Shoot cars to blow them up.
// Joystick (left) to walk or drive, drag right side to look, JUMP to jump, CAR to get in or out.
// Do delivery missions for cash, collect coins, explore the city through day and night.
// Needs internet the first time to load the 3D engine (three.js).
let html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<style>html,body{margin:0;height:100%;background:#000;overflow:hidden;touch-action:none;-webkit-user-select:none;font-family:-apple-system,sans-serif}
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
#toast{position:fixed;top:40%;left:0;right:0;text-align:center;color:#fff;font-weight:900;font-size:26px;text-shadow:0 2px 8px #000;opacity:0;transition:opacity .3s;pointer-events:none}</style></head>
<body><div id="hud"><div id="cash">$0</div><div id="cn">● 0</div><div id="clock"></div><div id="kills">✖ 0</div></div><div id="xh"></div><div id="dmg"></div><div id="stars"></div><div id="bars"><div><div id="hpb"></div></div><div><div id="arb"></div></div></div><div id="lock"></div>
<canvas id="map" width="260" height="260"></canvas><div id="mission"></div>
<div id="stick"><div id="knob"></div></div><div id="jump" class="btn">JUMP</div><div id="car" class="btn">CAR</div><div id="fire" class="btn">FIRE</div><div id="wpn" class="btn">PISTOL</div><div id="toast"></div>
<div id="msg"><h1>BLOCK CITY</h1><p>Walk or drive with the joystick, drag right side to look</p><p><b>Tap any person or car to lock on and shoot.</b> FIRE keeps shooting. Gun button switches weapons</p><p>CAR steals any car: parked, moving, even cop cars</p><p>Crimes bring police. Purple gang owns the southeast. Grab glowing crates</p><p>CAR gets you in and out. Follow the beam for delivery jobs</p><p><b>Tap anywhere to start</b></p></div>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/utils/BufferGeometryUtils.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/shaders/CopyShader.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/shaders/LuminosityHighPassShader.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/shaders/FXAAShader.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/postprocessing/EffectComposer.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/postprocessing/RenderPass.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/postprocessing/ShaderPass.js"><\/script><script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/postprocessing/UnrealBloomPass.js"><\/script>
<script>
if(!window.THREE){document.getElementById('msg').innerHTML='<h1>No internet</h1><p>Connect once so the 3D engine can load.</p>'}else{
const $=id=>document.getElementById(id);
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
const palette=['#c9cfd6','#e0b48a','#9fb3c8','#d8d0b8','#b88a7a','#8f9aa6','#e6e1d3','#a8c5b5'];
for(let i=0;i<N;i++)for(let j=0;j<N;j++){
 const cx=roadCenter(i)+CELL/2,cz=roadCenter(j)+CELL/2;
 // sidewalk
 const sw=new THREE.Mesh(new THREE.BoxGeometry(BLOCK,0.3,BLOCK),new THREE.MeshStandardMaterial({color:0x8c8e92,roughness:.95}));sw.position.set(cx,0.15,cz);sw.receiveShadow=true;scene.add(sw);
 const park=(i===5&&j===5)||(i===1&&j===8)||(i===8&&j===1)||(i===2&&j===2)||(i===8&&j===6)||(i===4&&j===9);
 if(park){const pg=new THREE.Mesh(new THREE.BoxGeometry(BLOCK-4,0.35,BLOCK-4),new THREE.MeshStandardMaterial({color:0x4cbf55}));pg.position.set(cx,0.18,cz);pg.receiveShadow=true;scene.add(pg);
  for(let k=0;k<10;k++)tree(cx+(Math.random()-.5)*(BLOCK-10),cz+(Math.random()-.5)*(BLOCK-10));
  const fountain=new THREE.Mesh(new THREE.CylinderGeometry(4,4.5,1,24),new THREE.MeshStandardMaterial({color:0xdddddd}));fountain.position.set(cx,0.6,cz);fountain.castShadow=true;scene.add(fountain);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(3.6,3.6,0.2,24),new THREE.MeshStandardMaterial({color:0x3ab0ff,metalness:.3,roughness:.1}));water.position.set(cx,1.05,cz);scene.add(water);
  solids.push({minX:cx-4.5,maxX:cx+4.5,minZ:cz-4.5,maxZ:cz+4.5,h:1.2});continue}
 const split=Math.random()<.6?2:1;
 for(let a=0;a<split;a++)for(let b=0;b<split;b++){
  const w=(BLOCK-6)/split-2,d=w,bx=cx-(BLOCK-6)/2+(a+.5)*(BLOCK-6)/split,bz=cz-(BLOCK-6)/2+(b+.5)*(BLOCK-6)/split;
  const dist=Math.hypot(bx,bz),h=Math.max(8,Math.pow(Math.max(0,1-dist/HALF),1.5)*150*Math.random()+8+Math.random()*12);
  const lit=0.25+Math.random()*.3,tex=winTex(palette[Math.floor(Math.random()*palette.length)],lit);tex.repeat.set(Math.max(1,Math.round(w/5.5)),Math.max(1,Math.round(h/13)));tex.userData.em.repeat.copy(tex.repeat);
  const m=new THREE.MeshStandardMaterial({map:tex,roughness:.42,metalness:.15,emissive:0xffffff,emissiveMap:tex.userData.em,emissiveIntensity:0});winMats.push(m);
  const bld=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);bld.position.set(bx,h/2+0.3,bz);bld.castShadow=true;bld.receiveShadow=true;scene.add(bld);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(w*.4,2,d*.4),new THREE.MeshStandardMaterial({color:0x666666}));roof.position.set(bx,h+1.3,bz);roof.castShadow=true;scene.add(roof);const capM=new THREE.Mesh(roofGeo,roofMat);capM.scale.set(w+.5,.5,d+.5);capM.position.set(bx,h+.35,bz);scene.add(capM);
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
for(let k=0;k<30;k++){const a=k/30*Math.PI*2;if(Math.cos(a)>.5)continue;const r=HALF+60+Math.random()*40;const h=new THREE.Mesh(new THREE.BoxGeometry(40,20+Math.random()*40,40),new THREE.MeshStandardMaterial({color:0x5c8f5a}));h.position.set(Math.cos(a)*r,5,Math.sin(a)*r);scene.add(h)}
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
  if(t.clientX<innerWidth*.42&&t.clientY>innerHeight*.4&&joy.id===null){const r=stick.getBoundingClientRect();joy={id:t.identifier,cx:r.left+r.width/2,cy:r.top+r.height/2,x:0,y:0};moveJoy(t)}
  else if(look.id===null)look={id:t.identifier,x:t.clientX,y:t.clientY,sx:t.clientX,sy:t.clientY,t0:performance.now()}}},{passive:false});
function moveJoy(t){let dx=t.clientX-joy.cx,dy=t.clientY-joy.cy;const d=Math.hypot(dx,dy),m=55;if(d>m){dx*=m/d;dy*=m/d}joy.x=dx/m;joy.y=dy/m;knob.style.transform='translate('+dx+'px,'+dy+'px)'}
addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===joy.id)moveJoy(t);else if(t.identifier===look.id){camYaw-=(t.clientX-look.x)*0.008;camPitch=Math.max(0.05,Math.min(1.3,camPitch+(t.clientY-look.y)*0.005));look.x=t.clientX;look.y=t.clientY}}},{passive:false});
function endT(e){for(const t of e.changedTouches){if(t.identifier===fireId)fireId=null;if(t.identifier===joy.id){joy.id=null;joy.x=joy.y=0;knob.style.transform=''}if(t.identifier===look.id){if(Math.hypot(t.clientX-look.sx,t.clientY-look.sy)<14&&performance.now()-look.t0<350)tapShoot(t.clientX,t.clientY);look.id=null}}if(!e.touches||!e.touches.length){fireId=null;joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null}}
addEventListener('touchend',endT);addEventListener('touchcancel',endT);addEventListener('keydown',e=>{if(e.key==='f')fireId=1;if(e.key==='q')cycleWeapon()});addEventListener('keyup',e=>{if(e.key==='f')fireId=null});addEventListener('mousedown',()=>{if(state==='ready'){state='play';$('msg').style.display='none'}});
function toast(s){const t=$('toast');t.textContent=s;t.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.opacity=0,1600)}
// collision: circle vs building boxes
function collide(p,r,maxH){for(const s of solids){if(maxH!==undefined&&p.y>s.h)continue;const cx=Math.max(s.minX,Math.min(p.x,s.maxX)),cz=Math.max(s.minZ,Math.min(p.z,s.maxZ));const dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;
 if(d2<r*r){const d=Math.sqrt(d2)||0.0001;if(d2===0){p.x+=r}else{p.x+=dx/d*(r-d);p.z+=dz/d*(r-d)}return true}}
 const lim=HALF+50;p.x=Math.max(-lim,Math.min(lim,p.x));p.z=Math.max(-lim,Math.min(lim,p.z));return false}
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
const turf=[];for(let i=8;i<N;i++)for(let j=8;j<N;j++)turf.push([roadCenter(i)+CELL/2,roadCenter(j)+CELL/2]);
const turfC=new THREE.Vector3(roadCenter(6),0,roadCenter(6));
function spawnGang(){const b=turf[Math.floor(Math.random()*turf.length)],a=Math.random()*Math.PI*2,r=BLOCK/2-1.5;return makeShooter('gang',b[0]+Math.cos(a)*r*(Math.abs(Math.cos(a))>.7?1:.8),b[1]+Math.sin(a)*r)}
for(let k=0;k<16;k++)spawnGang();
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
 for(const pc of police)if(!pc.dead&&!pc.gone)out.push({kind:'pol',obj:pc,p:pc.m.position.clone().setY(1)});
 return out}
function findTarget(){if(lockObj){for(const t of allTargets())if(t.obj===lockObj&&Math.hypot(t.p.x-pos.x,t.p.z-pos.z)<85)return t;lockObj=null}const fx=-Math.sin(camYaw),fz=-Math.cos(camYaw);let best=null,bs=1e9;
 for(const t of allTargets()){const dx=t.p.x-pos.x,dz=t.p.z-pos.z,d=Math.hypot(dx,dz);if(d<1||d>55)continue;const dot=(dx*fx+dz*fz)/d;if(dot<.78)continue;let s=d*(2-dot);if(t.hostile)s*=.4;if(s<bs){bs=s;best=t}}
 return best}
function damage(t,dmg){const from=pos;
 if(t.kind==='ped')killPed(t.obj,from);
 else if(t.kind==='sh'){const s=t.obj;s.hp-=dmg;s.aggro=true;burst(t.p,4,0xffffff,3,.15,.2);if(s.hp<=0)killShooter(s,from);if(s.kind==='cop')crime(.5)}
 else{const c=t.obj;c.hp=(c.hp||100)-dmg*14;burst(t.p,4,0xffdd66,6,.15,.25);if(t.kind==='pol')crime(.3);if(c.hp<=0){if(t.kind==='car')blowCar(c);else if(t.kind==='pol')blowPolice(c);else blowParked(c)}}}
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
 if(s.kind==='gang'){if(d<30)s.aggro=true;if(d>70)s.aggro=false}else s.aggro=wanted>0;
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
function weatherTick(dt){weatherT-=dt;if(weatherT<=0){rainTarget=rainTarget>0?0:1;weatherT=rainTarget?60+Math.random()*50:90+Math.random()*90;if(rainTarget)toast('Rain rolling in')}
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
// ---------- main loop ----------
let last=performance.now(),T=0,mapTick=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(0.05,(now-last)/1000);last=now;T+=dt;
 // day/night cycle (about 4 minutes per day)
 dayT=(dayT+dt/240)%1;const sunA=dayT*Math.PI*2,sunH=Math.sin(sunA),day=Math.max(0,Math.min(1,sunH*3+0.5));
 sun.intensity=0.15+day*0.95;hemi.intensity=0.06+day*0.22;
 skyU.top.value.setRGB(.05+.18*day,.07+.4*day,.18+.66*day);skyU.bot.value.setRGB(.1+.65*day+.2*(1-day)*Math.max(0,1-Math.abs(sunH)*4),.12+.77*day,.25+.75*day);
 weatherTick(dt);scene.fog.color.copy(skyU.bot.value);stars.material.opacity=1-day;
 const night=1-day;for(const m of winMats)m.emissiveIntensity=night*1.6;lampMat.emissiveIntensity=night*5;
 $('clock').textContent=(()=>{const h=Math.floor((dayT*24+6)%24),mm=Math.floor((dayT*24*60)%60);return (h%12||12)+':'+String(mm).padStart(2,'0')+(h<12?' AM':' PM')})();
 combatTick(dt);v3Tick(dt);envTick(dt);for(const f of MODS)f(dt);
 // coins spin
 for(const c of coins)if(c.visible)c.rotation.z+=dt*3;
 // pedestrians walk around their block
 for(const p of peds){if(p.userData.dead){const u=p.userData;if(u.deadT<1){u.deadT+=dt*3;p.rotation.x=-Math.min(1,u.deadT)*Math.PI/2*Math.sign(1);p.position.addScaledVector(u.fall,dt*4)}continue}const q=p.userData.path;q.t+=dt*q.spd*q.dir/ (q.r*2) ;const per=((q.t%4)+4)%4,side=Math.floor(per),f=per-side,r=q.r;
  let x,z;if(side===0){x=-r+2*r*f;z=-r}else if(side===1){x=r;z=-r+2*r*f}else if(side===2){x=r-2*r*f;z=r}else{x=-r;z=r-2*r*f}
  const nx=q.cx+x,nz=q.cz+z;const dx=nx-p.position.x,dz=nz-p.position.z;if(dx||dz)p.rotation.y=Math.atan2(-dx,-dz);p.position.set(nx,0.3,nz);
  const sw=Math.sin(T*6*q.spd+q.cx)*0.6;const u=p.userData;u.armL.rotation.x=sw;u.armR.rotation.x=-sw;u.legL.rotation.x=-sw;u.legR.rotation.x=sw}
 // traffic
 for(const t of traffic){if(t.dead)continue;let blocked=false;const ahead=t.alongX?new THREE.Vector3(t.dir,0,0):new THREE.Vector3(0,0,t.dir);
  const tp=t.m.position;const toP=(driving?driving.m.position:pos).clone().sub(tp);if(toP.dot(ahead)>0&&toP.dot(ahead)<9&&toP.clone().sub(ahead.clone().multiplyScalar(toP.dot(ahead))).length()<2.5)blocked=true;
  if(!blocked)t.pos+=t.dir*t.spd*dt;if(t.pos>HALF+20)t.pos=-HALF-20;if(t.pos<-HALF-20)t.pos=HALF+20;placeTraffic(t);
  for(const w of t.m.userData.wheels)w.rotation.x+=(blocked?0:t.spd)*dt*2}
 if(state==='play'){
  let jx=joy.x,jy=joy.y;const jm=Math.hypot(jx,jy);if(jm<0.22){jx=0;jy=0}else{const s2=(jm-0.22)/0.78/jm;jx*=s2;jy*=s2}
  // enter / exit car
  if(carQ){carQ=false;if(driving){const c=driving.m;pos.set(c.position.x+Math.cos(c.rotation.y)*-2.4,0,c.position.z-Math.sin(c.rotation.y)*-2.4);collide(pos,0.5);driving.speed=0;driving=null;player.visible=true;toast('Got out')}
   else{let best=null,bd=5;for(const c of cars){if(c.dead)continue;const d=c.m.position.distanceTo(new THREE.Vector3(pos.x,0,pos.z));if(d<bd){bd=d;best=c}}
    best=nearestCar();if(best){driving=best;player.visible=false}else toast('Get closer to a car')}}
  if(driving){const c=driving,m=c.m;const throttle=-jy,steer=-jx;
   c.speed+=throttle*28*dt;c.speed*=Math.pow(0.6,dt);if(Math.abs(throttle)<0.05)c.speed*=Math.pow(0.4,dt);c.speed=Math.max(-12,Math.min(m.userData.max||38,c.speed));
   m.rotation.y+=steer*dt*Math.min(1,Math.abs(c.speed)/6)*2.2*Math.sign(c.speed||1);
   const fwd=new THREE.Vector3(-Math.sin(m.rotation.y),0,-Math.cos(m.rotation.y));m.position.addScaledVector(fwd,c.speed*dt);
   if(collide(m.position,1.9)){if(Math.abs(c.speed)>14)toast('CRASH!');c.speed*=-0.3}
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
  const dT=Math.hypot(mission.target.x-pos.x,mission.target.z-pos.z);
  if(mission.stage==='pickup'){$('mission').innerHTML='JOB: pick up a package at '+mission.from+'<br>'+Math.round(dT)+' m';
   if(dT<4){mission.stage='deliver';let t;do{t=randomCorner()}while(t.distanceTo(mission.target)<SIZE*.35);const dist=t.distanceTo(mission.target);mission.target=t;mission.reward=Math.round(dist*1.5);mission.timeLeft=dist/9+25;box.visible=true;toast('Package picked up!')}}
  else{mission.timeLeft-=dt;$('mission').innerHTML='DELIVER to '+mission.to+'<br>'+Math.round(dT)+' m  |  '+Math.max(0,mission.timeLeft).toFixed(0)+'s<br>Pays $'+mission.reward;
   if(dT<4){const bonus=Math.max(0,Math.round(mission.timeLeft*2));cash+=mission.reward+bonus;toast('Delivered! +$'+(mission.reward+bonus));newMission()}
   else if(mission.timeLeft<=0){toast('Too slow! Job failed');newMission()}}
  $('cash').textContent='$'+cash;$('cn').textContent='● '+coinN}
 // player animation
 player.position.copy(pos);if(!driving){player.rotation.y+=(((facing-player.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI)*Math.min(1,12*dt);
  const hs=Math.hypot(vel.x,vel.z);walkT+=hs*dt*1.3;const sw=onGround?Math.sin(walkT)*Math.min(1,hs/6)*0.9:0.4;const u=player.userData;
  u.armL.rotation.x=sw;u.armR.rotation.x=-sw;u.legL.rotation.x=-sw;u.legR.rotation.x=sw;if(!onGround)u.armL.rotation.x=u.armR.rotation.x=-2.5}
 if(box.visible){box.position.set(pos.x,pos.y+(driving?2.6:3.3),pos.z);box.rotation.y+=dt}
 // mission marker
 beam.position.set(mission.target.x,60,mission.target.z);ring.position.set(mission.target.x,0.4+Math.sin(T*3)*.2,mission.target.z);ring.rotation.z+=dt;
 beamMat.color.set(mission.stage==='pickup'?0x33ff88:0xffaa22);ring.material.color.copy(beamMat.color);arrow.material.color.copy(beamMat.color);
 const toT=new THREE.Vector3(mission.target.x-pos.x,0,mission.target.z-pos.z);arrow.position.set(pos.x,pos.y+(driving?4:4.4),pos.z);arrow.rotation.set(0,0,0);arrow.lookAt(pos.x+toT.x,arrow.position.y,pos.z+toT.z);arrow.rotateX(Math.PI/2);
 // camera
 if(driving&&!look.id){const target=driving.m.rotation.y;camYaw+=(((target-camYaw+Math.PI*3)%(Math.PI*2))-Math.PI)*Math.min(1,2.5*dt)}
 const dist=driving?13:9,h=driving?1.5:2;const cx=pos.x+Math.sin(camYaw)*Math.cos(camPitch)*dist,cz=pos.z+Math.cos(camYaw)*Math.cos(camPitch)*dist,cy=pos.y+h+Math.sin(camPitch)*dist;
 cam.position.lerp(new THREE.Vector3(cx,Math.max(1,cy),cz),Math.min(1,10*dt));cam.lookAt(pos.x,pos.y+h,pos.z);if(shake>.01){cam.position.x+=(Math.random()-.5)*shake;cam.position.y+=(Math.random()-.5)*shake;}
 sun.position.set(pos.x+Math.cos(sunA)*80,Math.max(10,sunH*120),pos.z+40);sun.target.position.copy(pos);sky.position.copy(cam.position);stars.position.copy(cam.position);
 if((mapTick=(mapTick+1)%3)===0)drawMap();
 grade.uniforms.dmg.value=dmgFx;composer.render()}
requestAnimationFrame(frame)}
<\/script></body></html>`
let wv = new WebView()
await wv.loadHTML(html)
await wv.present(true)
