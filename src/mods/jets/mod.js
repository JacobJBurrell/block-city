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
{const nc=nearestCar;nearestCar=function(peek){const r=nc(peek);if(!peek&&r&&r.jt&&!r.jtS){r.jtS=true;wantedScore=Math.max(wantedScore,16);ldAlert=25;jtMode=0;toast('STOLE A FIGHTER JET! Hold JUMP for throttle')}return r}}
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
