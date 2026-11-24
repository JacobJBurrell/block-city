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
 if(c.vhT==='heli'){c.vhSpin=Math.min(1,c.vhSpin+dt*.8);const fl0=c.vhFloor||0,air=p.y>fl0+.12,up=(vhJump||vhUp)&&c.vhSpin>.85,dn=vhDown&&!up;
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
const vhSignTex=canvasTex(256,128,g=>{g.fillStyle='#0b0f14';g.fillRect(0,0,256,128);g.strokeStyle='#35b0ff';g.lineWidth=6;g.strokeRect(6,6,244,116);g.fillStyle='#e8f4ff';g.font='900 44px -apple-system,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('HELIPAD',128,50);g.font='700 30px -apple-system,Arial,sans-serif';g.fillStyle='#35b0ff';g.fillText('ELEVATOR ▲',128,94)});
const vhSign2Tex=canvasTex(256,128,g=>{g.fillStyle='#0b0f14';g.fillRect(0,0,256,128);g.strokeStyle='#35b0ff';g.lineWidth=6;g.strokeRect(6,6,244,116);g.fillStyle='#e8f4ff';g.font='900 46px -apple-system,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('STREET',128,50);g.font='700 30px -apple-system,Arial,sans-serif';g.fillStyle='#35b0ff';g.fillText('ELEVATOR ▼',128,94)});
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
 vhGuardTick();vhRoofTick(dt);
 if(driving!==vhCur){if(vhCur&&vhCur.vhT==='heli'&&!driving&&vhCur.m.position.y>(vhCur.vhFloor||0)+.6){const m=vhCur.m,ax=m.position.x-pos.x,az=m.position.z-pos.z,d=Math.hypot(ax,az)||1;vhCur.vhDrift=[ax/d*7-Math.sin(m.rotation.y)*vhCur.speed*.6,az/d*7-Math.cos(m.rotation.y)*vhCur.speed*.6]}
  if(vhRider.parent)vhRider.parent.remove(vhRider);vhCur=driving;vhLastV=driving?driving.speed:0;if(driving){if(driving.hp===undefined)driving.hp=100;vhMaxPts(driving);vhSeat(driving);if(driving.vhT==='heli')toast('UP to climb, DOWN to descend. Hold CAR to bail out');else if(driving.vhT==='boat')toast('Boat! Push up to go')}}
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
