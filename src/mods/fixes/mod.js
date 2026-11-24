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
