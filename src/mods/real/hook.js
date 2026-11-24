window.__rl=()=>({mode:rlMode,car:!!rlCar,chars:Object.keys(rlChar).join(','),live:rlLive.length,near:rlNear.length,made:rlMade,keys:rlLive.map(a=>a.key).join(','),drv:!!rlDriver.parent,drvAv:!!rlDriver.userData.av});
window.__close=()=>{const c=cars[2].m;pos.set(c.position.x+5,0.3,c.position.z-1);camYaw=1.9;camPitch=.2;for(let i=0;i<5;i++){const q=peds[i];q.userData.dead=true;q.userData.deadT=2;q.rotation.x=0;q.position.set(pos.x-2-i*1.3,0.3,pos.z-3+i*.8);q.rotation.y=.5+i}};
window.__walk=(x,y)=>{joy.x=x;joy.y=y};window.__car=()=>{carQ=true};
window.__rlAim=()=>{player.userData.rlAimT=T+60};window.__rlHost=u=>{rlHost=u};window.__rlAir=b=>{onGround=!b;if(b){pos.y=3;vel.y=0}};window.__rlPos=()=>[pos.x,pos.y,pos.z,camYaw,camPitch];
window.__rlStage=()=>{const fx=-Math.sin(camYaw),fz=-Math.cos(camYaw),rx=Math.cos(camYaw),rz=-Math.sin(camYaw);const at=(i,d)=>[pos.x+fx*d+rx*(i*1.5-3.7),pos.z+fz*d+rz*(i*1.5-3.7)];
 for(let i=0;i<6;i++){const q=peds[i],p=at(i,5);q.userData.dead=true;q.userData.deadT=2;q.rotation.x=0;q.position.set(p[0],.3,p[1]);q.rotation.y=camYaw+Math.PI+(i-2.5)*.15}
 const a=at(1,9),b=at(3,9),c=at(5,9);window.__sh=[makeShooter('cop',a[0],a[1]),makeShooter('gang',b[0],b[1]),makeShooter('gang',c[0],c[1])];for(const s of __sh){s.cd=99;s.g.rotation.y=camYaw+Math.PI}hp=1e6};
window.__rlKill=()=>{const q=peds[2];q.userData.dead=false;killPed(q,pos);killShooter(__sh[2],pos)};
window.__rlFreeze=()=>{for(const s of __sh){s.aggro=false;s.cd=99}};
window.__rlDbg=()=>peds.slice(0,6).map(q=>[q.userData.rlType,rlKey(q),!!q.userData.av,Math.round(q.userData.rlD||0),q.visible,q.parent===scene]).concat((window.__sh||[]).map(s=>[s.g.userData.rlType,rlKey(s.g),!!s.g.userData.av,Math.round(s.g.userData.rlD||0)])).concat([['T',Math.round(T*10)/10,rlT,rlPeople.length,rlMade]]);
window.__ch=()=>({key:chPlayerKey(),k:chS.k,spawn:window.chSpawn,pos:[Math.round(pos.x),Math.round(pos.y*10)/10,Math.round(pos.z)],chars:Object.keys(rlChar).length,fail:Object.keys(rlFail).join(','),q:rlQueue.length,live:rlLive.length,a2:!!rlAnims2,made:rlMade,keys:rlLive.map(a=>a.key).join(',')});
window.__chReplace=id=>{chPlaced=false;chS.spawn=id;chSetSpawn();chPlace();camPitch=.25};
window.__line=(keys,anim)=>{const fx=-Math.sin(camYaw),fz=-Math.cos(camYaw),rx=Math.cos(camYaw),rz=-Math.sin(camYaw),n=keys.length;
 for(let i=0;i<n;i++){const q=peds[i],d=6+(i%2)*2.2,o=(i-(n-1)/2)*1.25;q.userData.dead=true;q.userData.deadT=2;q.rotation.x=0;q.userData.rlType=keys[i];q.userData.rlVar=null;q.position.set(pos.x+fx*d+rx*o,.3,pos.z+fz*d+rz*o);q.rotation.y=camYaw+(i%3-1)*.4;if(anim)rlPlay(q,anim[i%anim.length])}rlT=0};
window.__pair=(a1,a2,keys)=>{const fx=-Math.sin(camYaw),fz=-Math.cos(camYaw),rx=Math.cos(camYaw),rz=-Math.sin(camYaw);for(let i=0;i<2;i++){const q=peds[i],o=i?.75:-.75;q.userData.dead=true;q.userData.deadT=2;q.rotation.x=0;if(keys)q.userData.rlType=keys[i];q.position.set(pos.x+fx*4.2+rx*o,.3,pos.z+fz*4.2+rz*o);q.rotation.y=camYaw+(i?-Math.PI/2:Math.PI/2);rlPlay(q,i?a2:a1)}rlLookAt(peds[0],peds[1]);rlLookAt(peds[1],peds[0]);rlT=0};
window.__hideHud=()=>{const st=document.createElement('style');st.textContent='#hud,#map,#stick,.btn,#mission,#stars,#bars,#uiCard,#uiGear,#uiRotB,#cpPh,#fxPt,#xh,#lock,#radio,#toast{opacity:0!important}';document.head.appendChild(st)};
window.__chSet=o=>{Object.assign(chS,o);if(chOpenF){if(o.k)chRender();else chPvOutfit()}chRefresh()};window.__chOpen=m=>chOpen(m||'title');window.__chClose=()=>chClose();
window.__rlPlay=(i,n,o)=>rlPlay(peds[i],n,o);window.__blink=a=>{rlBlinkA=a};window.__rlLive=()=>rlLive.map(a=>[a.key,a.g===player?'P':(peds.indexOf(a.g)),Object.keys(a.acts).filter(n=>a.acts[n].getEffectiveWeight()>.05).join('+')]).slice(0,20);
window.__dbgP=()=>{const u=player.userData;return {vis:player.visible,par:!!player.parent,inPeople:rlPeople.indexOf(player),d:u.rlD,key:rlKey(player),av:!!u.av,mode:rlMode,st:state,rlT,pool:Object.keys(rlPool).map(k=>k+':'+rlPool[k].length).join(' ')}};
window.__rlMax=n=>{rlMaxPeople=n;if(!window.__rlMaxI)window.__rlMaxI=setInterval(()=>{rlMaxPeople=n},200)};window.__cam=(yaw,pitch)=>{camYaw=yaw;camPitch=pitch};
window.__zoomIn=z=>{try{uiZoom=z}catch(e){}};
window.__quad=(keys,anims,look)=>{const fx=-Math.sin(camYaw),fz=-Math.cos(camYaw),rx=Math.cos(camYaw),rz=-Math.sin(camYaw);for(let i=0;i<keys.length;i++){const q=peds[i],o=(i-(keys.length-1)/2)*1.15;q.userData.dead=true;q.userData.deadT=2;q.rotation.x=0;q.userData.rlType=keys[i];q.userData.rlVar=null;q.userData.rlIdleV=null;q.position.set(pos.x+fx*2.6+rx*o,.3,pos.z+fz*2.6+rz*o);q.rotation.y=camYaw+Math.PI+(look?(i%2?-1.2:1.2):0);rlPlay(q,anims[i])}
 if(look){rlLookAt(peds[0],peds[1]);rlLookAt(peds[1],peds[0])}rlT=0};
window.__spd=()=>{const a=player.userData.av;if(!a)return null;const o={sp:Math.round(a.sp*10)/10,vW:a.C.vW,vR:a.C.vR,vS:a.C.vS};for(const n in a.acts){const x=a.acts[n];if(x.getEffectiveWeight()>.02)o[n]=[Math.round(x.getEffectiveWeight()*100)/100,Math.round(x.timeScale*100)/100]}return o};
window.__wear=()=>{stWear()};window.__stt=()=>state;
window.__a3={prog:()=>renderer.info.programs.length,progs:()=>renderer.info.programs.map(p=>p.name),st:()=>state,rl:()=>({mode:rlMode,chars:Object.keys(rlChar),q:rlQueue.slice(),busy:Object.keys(rlBusy),car:!!rlCar,a2:!!rlAnims2,live:rlLive.length})};
Object.assign(window.__a3,{
 deadT:v=>{deadT=v},die:()=>{hurt(99999)},state:()=>state,
 ev:s=>eval(s),
 front:(i,d,o,yo)=>{const q=peds[i],fx=-Math.sin(camYaw),fz=-Math.cos(camYaw),rx=Math.cos(camYaw),rz=-Math.sin(camYaw);q.userData.dead=false;q.userData.deadT=2;q.userData.lfOn=true;q.position.set(pos.x+fx*d+rx*(o||0),.3,pos.z+fz*d+rz*(o||0));q.rotation.set(0,camYaw+(yo||0),0);rlT=0;return q.position.toArray()},
 kill:(i,kind)=>{const q=peds[i];let from=pos.clone();if(kind==='boom'){from=q.position.clone().add(new THREE.Vector3(.5,0,.5));rlBoomP=from}killPed(q,from);rlBoomP=null;return !!q.userData.rlDie},
 dieInfo:i=>{const g=i<0?player:peds[i],u=g.userData,D=u.rlDie;return D?{t:+D.t.toFixed(2),fd:D.fd,av:!!u.av,wy:u.av?+u.av.w.position.y.toFixed(2):null}:null},
 drv:(n)=>{let best=null,bd=1e9;for(const t of traffic){if(t.dead)continue;const d=Math.hypot(t.m.position.x-pos.x,t.m.position.z-pos.z);if(d<bd){bd=d;best=t}}const t=best;
  if(n&&(n==='base'||n==='police'||typeof isBuildCar==='function')){const g=n==='base'?makeCar(0x3366cc,.5):(n==='police'?makePoliceCar():isBuildCar(n,0x3366cc));g.position.copy(t.m.position);g.rotation.copy(t.m.rotation);scene.remove(t.m);scene.add(g);t.m=g}
  t.spd=0;t.lfStop=true;placeTraffic(t);const m=t.m,y=m.rotation.y,c=Math.cos(y),s=Math.sin(y),side=-2.6,fw=-(m.userData.isLen||4.4)*.5-.2;pos.set(m.position.x+c*side+s*fw,.3,m.position.z-s*side+c*fw);player.visible=false;
  camYaw=Math.atan2(pos.x-m.position.x,pos.z-m.position.z);camPitch=.12;facing=camYaw+Math.PI;rlDrvT=0;rlT=0;window.__a3t=t;return [m.userData.isType||'base',bd|0]},
 drvSt:()=>rlDrv.map(d=>[!!d.car,d.car?(d.car.userData.isType||'base'):'',!!d.g.userData.av,d.g.userData.rlType]),
 drvGeo:()=>rlDrv.filter(d=>d.car).map(d=>{const m=d.car,a=d.g.userData.av,h=new THREE.Vector3(),hp=new THREE.Vector3();if(a&&a.B&&a.B.Head){a.B.Head.getWorldPosition(h);m.worldToLocal(h)}
  d.g.getWorldPosition(hp);m.worldToLocal(hp);const S=typeof isSpecs!=='undefined'?isSpecs[m.userData.isType]:null;return {t:m.userData.isType||'base',head:h.toArray().map(v=>+v.toFixed(2)),grp:hp.toArray().map(v=>+v.toFixed(2)),cf:S&&S.cf,rf:S&&S.rf,cr:S&&S.cr,roof:S&&S.roof}}),
 hold:()=>{if(window.__a3t){window.__a3t.spd=0;window.__a3t.lfStop=true}}
});
