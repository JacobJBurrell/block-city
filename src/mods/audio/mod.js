// ---------- audio module (au*) ----------
let auOn=false,auMute=0,auMaster=null,auOut=null,auBus={},auEng=null,auAmb=null,auScr=null,auSir=null,auStepD=0,auPrevW=0,auWhoCD=0,auPrevDrv=null,auPrevG=true,auHornT=12,auRG=null,auDist=null;
const auR={st:0,step:0,next:0};
// auExt: set by the music module while YouTube owns the radio; the synthesized stations below then stay silent (they remain the offline fallback)
let auExt=0;
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
function auRadioTick(){const on=driving&&state==='play'&&auR.st<4&&!auExt,now=AC.currentTime;auRG.gain.setTargetAtTime(on?1:0,now,.15);if(!on){auR.next=0;return}
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
 auAmb.cg.gain.setTargetAtTime((.15+.04*Math.sin(T*.31))*nightK*(driving?.6:1),now,.5);auAmb.rg.gain.setTargetAtTime(rain*.035,now,.5);auAmb.lg.gain.setTargetAtTime(rain*(driving?.045:.022),now,.5);
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
