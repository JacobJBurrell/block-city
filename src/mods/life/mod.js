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
