window.__ms={
 st:()=>({type:msType,stage:msStage,time:Math.round(msTime),reward:msReward,streak:msStreak,best:msBest,passed:msPassed,cash,hp:Math.round(hp),armor,wanted,state,menu:msMenuOpen,txt:$('mission').innerText,ban:msBan.innerText,banOp:msBan.style.opacity,stat:msStat.textContent,driving:!!driving,ammo:[WEAP[1].ammo,WEAP[2].ammo,WEAP[3].ammo],shooters:shooters.length,loose:msLoose.length,d:Math.round(Math.hypot(mission.target.x-pos.x,mission.target.z-pos.z)),markers:beam.visible}),
 start:t=>{msStart(t);return msType},
 tp:()=>{pos.set(mission.target.x,0.3,mission.target.z);if(driving)driving.m.position.set(mission.target.x,0,mission.target.z)},
 car:()=>{const c=cars.find(c=>!c.dead);driving=c;player.visible=false;c.speed=0;return true},
 hotcar:()=>{driving=msData.car;player.visible=false;return true},
 out:()=>{carQ=true},
 killTarget:()=>{killShooter(msData.tg,pos)},
 blow:n=>{let k=0;for(const t of traffic){if(!t.dead&&k<n){blowCar(t);k++}}return k},
 time:v=>{msTime=v},
 crash:()=>{msCrashCD=0;msPrevSpd=30;driving.speed=3},
 shop:(kind)=>{const s=msShops.find(s=>s.kind===kind);s.inn=false;pos.set(s.x,0.3,s.z);if(driving)driving.m.position.set(s.x,0,s.z);return [s.x,s.z]},
 away:()=>{pos.set(roadCenter(5)+4,0.3,roadCenter(5)+4);if(driving)driving.m.position.set(pos.x,0,pos.z)},
 set:(o)=>{if(o.cash!==undefined)cash=o.cash;if(o.hp!==undefined)hp=o.hp;if(o.w!==undefined)wantedScore=o.w},
 die:()=>{hp=1;hurt(50)},
 save:()=>msSave(),
 look:()=>{camPitch=.35},
 rect:(k)=>{const e=document.querySelector('[data-ms="'+k+'"]');const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}
};
window.__dt=()=>[deadT,T];
window.__fast=()=>{deadT=.05;msWait=.05};
window.__ms.offers=()=>msOffers.map(o=>[o.t,Math.round(o.p.x),Math.round(o.p.z)]);
window.__ms.acc=i=>msAccept(i);window.__ms.pin=v=>msPin(v);window.__ms.cancel=()=>msCancel();
window.__ms.vis=()=>({beam:beam.visible,ring:ring.visible,pinned:msPinned,type:msType,card:$('mission').innerText.slice(0,80),fx:typeof fxPt!=='undefined'?fxPt.style.display:'-'});
window.__ms.tpOffer=i=>{const o=msOffers[i];pos.set(o.p.x,0.3,o.p.z);vel.set(0,0,0);return o.t};
