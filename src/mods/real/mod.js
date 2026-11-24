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
