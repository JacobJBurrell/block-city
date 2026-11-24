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
