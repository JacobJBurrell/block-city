// ---------- land: army base (north), hills + BLOCK CITY sign (south), Miami x Hollywood dressing ----------
const ldN=[],ldS=[],ldD=[],ldE=[],ldSold=[],ldTanks=[],ldDebris=[],ldBeams=[];
const ldC=new THREE.Color(),ldMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.86,metalness:.04}),ldMat2=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,side:THREE.DoubleSide}),ldEm=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});
let ldAlert=0,ldCan=0,ldLateOn=false,ldRnd=12345;
function ldR(){ldRnd=(ldRnd*1103515245+12345)&0x7fffffff;return ldRnd/0x7fffffff}
function ldPaint(g,col){if(g.index)g=g.toNonIndexed();ldC.set(col);const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=ldC.r;a[i*3+1]=ldC.g;a[i*3+2]=ldC.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
function ldB(L,w,h,d,x,y,z,col,ry,rx,rz){const g=new THREE.BoxGeometry(w,h,d);if(rx)g.rotateX(rx);if(rz)g.rotateZ(rz);if(ry)g.rotateY(ry);g.translate(x,y,z);L.push(ldPaint(g,col))}
function ldCy(L,rt,rb,h,seg,x,y,z,col,rx,rz){const g=new THREE.CylinderGeometry(rt,rb,h,seg);if(rx)g.rotateX(rx);if(rz)g.rotateZ(rz);g.translate(x,y,z);L.push(ldPaint(g,col))}
function ldMesh(L,mat,shadow){const m=new THREE.Mesh(U.mergeBufferGeometries(L),mat);m.castShadow=!!shadow;m.receiveShadow=true;scene.add(m);return m}
function ldSol(x0,x1,z0,z1,h){solids.push({minX:Math.min(x0,x1),maxX:Math.max(x0,x1),minZ:Math.min(z0,z1),maxZ:Math.max(z0,z1),h:h})}
function ldInto(L,geo,x,y,z,ry){const g=geo.clone();if(ry)g.rotateY(ry);g.translate(x,y,z);L.push(g)}
// 5x7 pixel font for signs
const ldF={A:[14,17,17,31,17,17,17],B:[30,17,17,30,17,17,30],C:[15,16,16,16,16,16,15],D:[30,17,17,17,17,17,30],E:[31,16,16,30,16,16,31],F:[31,16,16,30,16,16,16],G:[15,16,16,23,17,17,15],I:[31,4,4,4,4,4,31],K:[17,18,20,24,20,18,17],L:[16,16,16,16,16,16,31],M:[17,27,21,21,17,17,17],N:[17,25,21,19,17,17,17],O:[14,17,17,17,17,17,14],P:[30,17,17,30,16,16,16],R:[30,17,17,30,20,18,17],S:[15,16,16,14,1,1,30],T:[31,4,4,4,4,4,4],U:[17,17,17,17,17,17,14],V:[17,17,17,17,17,10,4],W:[17,17,17,21,21,27,17],H:[17,17,17,31,17,17,17],Y:[17,17,10,4,4,4,4],'-':[0,0,0,31,0,0,0]};
// one glyph; (ox,oy,oz) = top-left as the reader sees it, (rx,rz) = the reader's right on the ground plane
function ldGlyph(L,ch,ox,oy,oz,rx,rz,px,dp,col){const g=ldF[ch];if(!g)return;for(let r=0;r<7;r++){let c=0;while(c<5){if(g[r]>>(4-c)&1){let e=c;while(e<4&&(g[r]>>(3-e)&1))e++;const w=(e-c+1)*px,m=(c+e+1)/2*px;ldB(L,rx?w:dp,px,rx?dp:w,ox+rx*m,oy-(r+.5)*px,oz+rz*m,col);c=e+1}else c++}}}
function ldText(L,s,ox,oy,oz,rx,rz,px,dp,col){for(let i=0;i<s.length;i++)ldGlyph(L,s[i],ox+rx*i*px*6,oy,oz+rz*i*px*6,rx,rz,px,dp,col)}
// ----- vehicle prototypes -----
const ldVG=(()=>{const O=0x4f5d3a,O2=0x44512f,K=0x1f221b,GL=0x1b2733,H=[],Tt=[],J=[],T=[],W=[];
 ldB(H,3.3,.95,6.0,0,1.3,0,O);ldB(H,2.9,.45,4.2,0,2.0,.3,O2);ldB(H,3.3,.8,1.5,0,1.42,-3.2,O,0,-.6);ldB(H,2.6,.5,.5,0,1.5,3.1,O2);
 for(const s of[-1,1]){ldB(H,.85,1.1,6.8,s*1.78,.6,0,K);ldB(H,1.05,.1,7,s*1.78,1.22,0,O2);for(let k=0;k<5;k++)ldCy(H,.45,.45,.18,10,s*2.25,.52,-2.6+k*1.3,0x3d4432,0,Math.PI/2)}
 ldB(Tt,2.3,.85,2.9,0,.43,.25,O);ldB(Tt,1.9,.6,.9,0,.4,1.9,O2);ldB(Tt,1.1,.65,.55,0,.42,-1.4,O2);ldCy(Tt,.15,.15,4.4,8,0,.45,-3.75,0x3a4230,Math.PI/2);ldCy(Tt,.22,.22,.55,8,0,.45,-5.8,K,Math.PI/2);ldCy(Tt,.5,.5,.16,10,-.5,.93,.6,O2);ldB(Tt,.12,.5,.12,.7,1.1,.9,K);
 ldB(J,2.0,.5,4.0,0,.8,0,O);ldB(J,1.9,.45,1.3,0,1.25,-1.3,O);ldB(J,1.6,.4,.08,0,1.2,-1.97,K);ldB(J,1.9,.5,.14,0,1.25,1.9,O);ldB(J,1.85,.7,.07,0,1.85,-.6,GL);ldB(J,1.95,.08,.1,0,2.22,-.6,O2);ldB(J,1.9,.08,.08,0,2.45,.95,K);ldCy(J,.42,.42,.26,12,0,1.3,2.12,K,Math.PI/2);ldB(J,2.1,.18,.16,0,.62,-2.05,K);ldB(J,2.1,.18,.16,0,.62,2.05,K);
 for(const s of[-1,1]){ldB(J,.3,.22,.08,s*.7,1.25,-1.99,0xfff6d8);ldB(J,.14,.5,2.3,s*.95,1.25,.75,O);ldB(J,.45,.12,1.0,s*1.0,1.02,-1.3,O2);ldB(J,.7,.5,.7,s*.45,1.15,.15,0x2b2e26);ldB(J,.7,.7,.14,s*.45,1.55,.5,0x2b2e26);ldB(J,.08,1.0,.08,s*.92,1.95,.95,K)}
 ldB(T,2.2,.4,7.0,0,.95,.3,K);ldB(T,2.5,1.7,1.9,0,2.0,-2.3,O);ldB(T,2.2,.7,.08,0,2.35,-3.27,GL);ldB(T,2.3,.9,.5,0,1.5,-3.4,O2);ldB(T,2.6,.25,4.6,0,1.25,1.4,O2);ldB(T,2.6,1.9,4.6,0,2.35,1.4,0x77764f);ldB(T,2.5,.3,.2,0,.8,-3.6,K);
 for(let k=0;k<4;k++)ldB(T,2.68,1.95,.1,0,2.36,-.6+k*1.33,0x66653f);
 for(const s of[-1,1]){ldB(T,.3,.24,.08,s*.85,1.5,-3.66,0xfff6d8);ldB(T,.08,.6,1.0,s*1.26,2.3,-2.3,GL);ldCy(T,.55,.55,.34,14,s*1.17,.55,2.9,0x151515,0,Math.PI/2)}
 ldCy(W,.45,.45,.32,14,0,0,0,0x151515,0,Math.PI/2);ldCy(W,.22,.22,.34,8,0,0,0,0x4f5d3a,0,Math.PI/2);
 const mg=a=>U.mergeBufferGeometries(a);return {hull:mg(H),tur:mg(Tt),jeep:mg(J),truck:mg(T),wheel:mg(W)}})();
function ldVehicle(kind,x,z,ry){const g=new THREE.Group(),add=(geo,px,py,pz)=>{const m=new THREE.Mesh(geo,ldMat);m.castShadow=true;m.position.set(px||0,py||0,pz||0);g.add(m);return m};g.userData.wheels=[];let c;
 if(kind==='tank'){add(ldVG.hull);g.userData.tur=add(ldVG.tur,0,2.2,.3);g.userData.max=13;c={m:g,speed:0,steer:0,hp:900,ldTank:true,ldV:'tank',vhEng:new THREE.Vector3(0,2.1,2.6)};ldTanks.push(c)}
 else{const tr=kind==='truck';add(tr?ldVG.truck:ldVG.jeep);const wx=tr?1.17:1.02,wy=tr?.55:.45;for(const p of(tr?[[-wx,-2.4],[wx,-2.4],[-wx,1.7],[wx,1.7]]:[[-wx,-1.3],[wx,-1.3],[-wx,1.3],[wx,1.3]])){const w=add(ldVG.wheel,p[0],wy,p[1]);if(tr)w.scale.setScalar(1.22);g.userData.wheels.push(w)}
  g.userData.max=tr?30:42;c={m:g,speed:0,steer:0,hp:tr?260:160,ldV:kind,vhEng:new THREE.Vector3(0,1.3,tr?-3.3:-1.5)}}
 g.position.set(x,0,z);g.rotation.y=ry||0;scene.add(g);cars.push(c);return c}
function ldStaticTank(L,x,z,ry,ty){ldSol(x-2.2,x+2.2,z-3.5,z+3.5,3.2);ldInto(L,ldVG.hull,x,0,z,ry);const t=ldVG.tur.clone();t.rotateY(ty||0);t.translate(0,2.2,.3);t.rotateY(ry||0);t.translate(x,0,z);L.push(t)}
function ldStaticTruck(L,x,z,ry){ldSol(x-1.3,x+1.3,z-3.7,z+3.7,3.3);ldInto(L,ldVG.truck,x,0,z,ry);for(const p of[[-1.17,-2.4],[1.17,-2.4],[-1.17,1.7],[1.17,1.7]]){const w=ldVG.wheel.clone();w.scale(1.22,1.22,1.22);w.translate(p[0],.55,p[1]);w.rotateY(ry||0);w.translate(x,0,z);L.push(w)}}
// sign atlas for the army base (one texture, one merged mesh, 2 triangles per sign)
const ldCells={},ldSG=[];const ldAtlas=(()=>{const cv=document.createElement('canvas');cv.width=512;cv.height=512;const g=cv.getContext('2d');
 const cell=(k,x,y,w,h,bg,fg,txt,sz)=>{ldCells[k]=[x,y,w,h];g.fillStyle=bg;g.fillRect(x,y,w,h);if(!txt)return;g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';let s=Math.floor(h*(sz||.7));const F=n=>'900 '+n+'px Impact, Arial Black, sans-serif';g.font=F(s);while(g.measureText(txt).width>w*.9&&s>6){s--;g.font=F(s)}g.fillText(txt,x+w/2,y+h/2+1)};
 cell('mil',0,0,512,128,'#8a1c1c','#fff','');g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';const fit=(t,y,mx)=>{let s=mx;g.font='900 '+s+'px Impact, Arial Black, sans-serif';while(g.measureText(t).width>440&&s>8){s--;g.font='900 '+s+'px Impact, Arial Black, sans-serif'}g.fillText(t,256,y)};fit('MILITARY BASE',40,50);g.fillStyle='#f2e24a';fit('NO ENTRY',94,50);g.strokeStyle='#f2f2ea';g.lineWidth=4;g.strokeRect(6,6,500,116);
 cell('chk',0,128,512,80,'#47503a','#f2e24a','CHECKPOINT');cell('hgA',0,208,256,40,'#47503a','#f2e24a','HANGAR A');cell('hgB',256,208,256,40,'#47503a','#f2e24a','HANGAR B');
 cell('bkA',0,248,256,32,'#5b6447','#f2f2ea','BARRACKS A');cell('bkB',256,248,256,32,'#5b6447','#f2f2ea','BARRACKS B');cell('bkC',0,280,256,32,'#5b6447','#f2f2ea','BARRACKS C');cell('bkD',256,280,256,32,'#5b6447','#f2f2ea','BARRACKS D');
 cell('cmd',0,312,256,40,'#7c8073','#f2e24a','COMMAND');cell('mp',256,312,256,26,'#3d4432','#f2e24a','MOTOR POOL');cell('rng',256,338,128,24,'#47503a','#f2e24a','RANGE');cell('stop',384,338,96,32,'#c62828','#ffffff','STOP',.8);cell('army',0,352,256,64,'#6f7a5a','#f2f2ea','ARMY');
 const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t})();
function ldTag(k,w,h,x,y,z,ry){const c=ldCells[k],g=new THREE.PlaneGeometry(w,h),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(c[0]+uv.getX(i)*c[2])/512,1-(c[1]+(1-uv.getY(i))*c[3])/512);const q=g.toNonIndexed();if(ry)q.rotateY(ry);q.translate(x,y,z);ldSG.push(q)}
// ================= ARMY BASE (north) =================
const ldZ0=-HALF-36,ldZ1=-HALF-236,ldX0=-165,ldX1=165,ldGX=roadCenter(5);
{const L=ldN,OL=0x5b6447,OD=0x47503a,CON=0x8d8f86,ASP=0x34363a,DK=0x24271f,GL=0x1b2733,WH=0xf2f2ea;
 for(const o of scene.children.slice())if(o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.width===40&&o.geometry.parameters.depth===40&&Math.hypot(o.position.x,o.position.z)>HALF+50)scene.remove(o);
 ldB(L,ldX1-ldX0+16,.1,ldZ0-ldZ1+16,0,0,(ldZ0+ldZ1)/2,0x77755f);ldB(L,12,.1,38,ldGX,.02,-HALF-18,ASP);ldB(L,12,.12,140,ldGX,.03,ldZ0-70,ASP);ldB(L,300,.12,10,0,.03,ldZ0-84,ASP);
 ldB(L,300,.12,16,0,.03,ldZ1+22,0x2c2e31);for(let x=-130;x<=130;x+=20)ldB(L,9,.13,.7,x,.035,ldZ1+22,WH);ldB(L,92,.1,24,89,.03,ldZ0-24,0x77796f);
 const fence=(x0,z0,x1,z1)=>{const len=Math.hypot(x1-x0,z1-z0),cx=(x0+x1)/2,cz=(z0+z1)/2,ax=Math.abs(x1-x0)>Math.abs(z1-z0);
  ldB(L,ax?len:.8,1,ax?.8:len,cx,.5,cz,CON);ldB(L,ax?len:.12,3,ax?.12:len,cx,2.5,cz,0x4d5a4e);ldB(L,ax?len:.3,.12,ax?.3:len,cx,4.25,cz,0xb9bdc2);
  const n=Math.max(1,Math.round(len/10));for(let i=0;i<=n;i++)ldB(L,.35,4.4,.35,x0+(x1-x0)*i/n,2.2,z0+(z1-z0)*i/n,DK);ldSol(x0-(ax?0:.6),x1+(ax?0:.6),z0-(ax?.6:0),z1+(ax?.6:0),4.4)};
 fence(ldX0,ldZ0,ldGX-8,ldZ0);fence(ldGX+8,ldZ0,ldX1,ldZ0);fence(ldX0,ldZ1,ldX1,ldZ1);fence(ldX0,ldZ0,ldX0,ldZ1);fence(ldX1,ldZ0,ldX1,ldZ1);
 for(const s of[-1,1]){ldB(L,1.3,5.4,1.3,ldGX+s*8,2.7,ldZ0,CON);ldB(L,1.6,.3,1.6,ldGX+s*8,5.5,ldZ0,OD)}
 ldText(L,'RESTRICTED',ldGX+11.6,4.4,ldZ0+.5,1,0,.34,.1,0xf2e24a);ldB(L,22.4,3.2,.2,ldGX+21.6,3.2,ldZ0+.38,0x8a1c1c);
 for(const tw of[[ldX0+7,ldZ0-7],[ldX1-7,ldZ0-7],[ldX0+7,ldZ1+7],[ldX1-7,ldZ1+7]]){const x=tw[0],z=tw[1];for(const a of[-2,2])for(const b of[-2,2]){ldB(L,.4,9,.4,x+a,4.5,z+b,DK);ldB(L,.2,3,.2,x+a*1.2,10.8,z+b*1.2,DK)}
  ldB(L,5.2,.35,5.2,x,9.1,z,OD);for(const a of[-1,1]){ldB(L,5.2,1.2,.2,x,9.9,z+a*2.5,OL);ldB(L,.2,1.2,5.2,x+a*2.5,9.9,z,OL)}ldB(L,6,.3,6,x,12.4,z,OD);
  const lx=x-Math.sign(x)*2.3,lz=z+(z>(ldZ0+ldZ1)/2?-2.3:2.3);ldB(ldE,.9,.7,.9,lx,11.2,lz,0xfff4c8);ldBeams.push([lx,11.2,lz])}
 ldB(L,6,3.6,5,ldGX+13,1.8,ldZ0-4.5,OL);ldB(L,6.8,.3,5.8,ldGX+13,3.75,ldZ0-4.5,OD);ldB(L,.1,1.1,3,ldGX+9.95,2.3,ldZ0-4.5,GL);ldSol(ldGX+10,ldGX+16,ldZ0-7,ldZ0-2,3.8);
 for(const b of[[-100,ldZ0-26],[-100,ldZ0-46],[-58,ldZ0-26],[-58,ldZ0-46]]){const x=b[0],z=b[1];ldB(L,36,5,11,x,2.5,z,OL);const g=new THREE.BoxGeometry(36.6,7.9,7.9);g.rotateX(Math.PI/4);g.scale(1,.45,1);g.translate(x,5,z);L.push(ldPaint(g,OD));
  for(let k=-3;k<=3;k++)if(k)ldB(L,2.2,1.3,.12,x+k*4.8,3,z+5.52,GL);ldB(L,1.6,2.6,.14,x,1.3,z+5.53,0x2f3327);ldSol(x-18,x+18,z-5.5,z+5.5,7.5)}
 {const z=ldZ0-40;ldB(L,24,8,14,22,4,z,0x7c8073);ldB(L,24.8,.5,14.8,22,8.2,z,OD);for(const y of[2.6,6])for(let k=-4;k<=4;k++)if(y>3||k)ldB(L,1.6,1.4,.12,22+k*2.5,y,z+7.02,GL);ldB(L,1.8,2.6,.14,22,1.3,z+7.03,0x2f3327);ldB(L,.2,7,.2,30,11.7,z,DK);ldSol(10,34,z-7,z+7,8.5)}
 for(const hx of[64,114]){const hz=ldZ0-52;for(const s of[-1,1]){ldB(L,1,10,30,hx+s*17,5,hz,OL);ldB(L,18.8,.5,30.6,hx+s*8.7,12.1,hz,OD,0,0,-s*.26);ldSol(hx+s*17-.5,hx+s*17+.5,hz-15,hz+15,10)}
  ldB(L,35,10,1,hx,5,hz-14.5,OL);ldB(L,35,4.6,.6,hx,12.2,hz-14.6,OL);ldB(L,35,2.2,.6,hx,11.1,hz+14.7,OD);ldB(L,33,.12,30,hx,.04,hz,0x6f716a);ldSol(hx-17.5,hx+17.5,hz-15,hz-14,10)}
 ldCy(L,7,7.3,.16,24,10,.08,ldZ0-122,0x3b3e42);ldCy(L,6.2,6.2,.18,24,10,.09,ldZ0-122,0xf2c230);ldCy(L,5.8,5.8,.2,24,10,.1,ldZ0-122,0x3b3e42);for(const s of[-1,1])ldB(L,.7,.05,4.4,10+s*1.8,.21,ldZ0-122,WH);ldB(L,3.6,.05,.7,10,.21,ldZ0-122,WH);
 for(let k=0;k<3;k++)ldStaticTank(L,-125+k*15,ldZ0-125,Math.PI,(k-1)*.35);ldStaticTruck(L,-76,ldZ0-127,Math.PI);ldStaticTruck(L,-64,ldZ0-127,Math.PI);ldStaticTank(L,64,ldZ0-56,Math.PI,0);ldStaticTruck(L,114,ldZ0-56,Math.PI);
 for(let a=0;a<3;a++)for(let b=0;b<2;b++)for(let c=0;c<2-b;c++)ldB(L,1.3,1.1,1.3,-50+a*1.5+b*.3,.6+c*1.12,ldZ0-120-b*1.6,(a+b+c)%2?0x6b5a3a:0x4f5d3a);
 ldB(L,6,7,6,130,3.5,ldZ0-150,0x7c8073);ldSol(127,133,ldZ0-153,ldZ0-147,7.2);
 for(const k of[0,1]){ldCy(L,2.2,2.2,8,12,134,2.5,ldZ0-98-k*6,0xa9ada6,0,Math.PI/2);ldB(L,7,.6,1,134,.3,ldZ0-98-k*6,CON)}ldSol(129.5,138.5,ldZ0-107,ldZ0-95,4.8);
 ldCy(L,.12,.16,13,6,ldGX-14,6.5,ldZ0-14,0xc9ccd0);ldSol(-51,-45.5,ldZ0-122.6,ldZ0-119,2.2);
 for(const s of[-1,1])for(const z of[ldZ0-22,ldZ0-52,ldZ0-104,ldZ0-134]){ldB(L,.25,7,.25,ldGX+s*7.2,3.5,z,DK);ldB(L,1.3,.2,.3,ldGX+s*6.6,7,z,DK);ldB(ldE,1,.22,.5,ldGX+s*6.2,6.85,z,0xfff1c9)}
 for(const b of[[-100,ldZ0-26],[-100,ldZ0-46],[-58,ldZ0-26],[-58,ldZ0-46]])for(const k of[-2,1,3])ldB(ldE,2.1,1.2,.1,b[0]+k*4.8,3,b[1]+5.6,0xffe2a0);for(const k of[-3,-1,2,4])ldB(ldE,1.5,1.3,.1,22+k*2.5,6,ldZ0-32.9,0xffe2a0);
 for(const s of[-1,1])for(let k=0;k<3;k++){ldB(L,3,.5,1,ldGX+s*12,.3+k*.5,ldZ0-14-(k%2)*.2,0x9b8f6b);ldB(L,1,.5,2.4,ldGX+s*(10.5+ (s>0?3:3)),.3+k*.5,ldZ0-15.5,0x9b8f6b)}
 // ===== base detail: all merged into ldN (one mesh) and ldE (emissive) =====
 const PI=Math.PI,SB=0x9b8f6b;
 // extra guard towers (mid sides, back) with ladders and searchlights
 const tower=(x,z)=>{for(const a of[-2,2])for(const b of[-2,2]){ldB(L,.4,9,.4,x+a,4.5,z+b,DK);ldB(L,.2,3,.2,x+a*1.2,10.8,z+b*1.2,DK)}
  ldB(L,5.2,.35,5.2,x,9.1,z,OD);for(const a of[-1,1]){ldB(L,5.2,1.2,.2,x,9.9,z+a*2.5,OL);ldB(L,.2,1.2,5.2,x+a*2.5,9.9,z,OL);ldB(L,4.2,.1,.1,x,4.5,z+a*2,DK,0,0,a*1.1);ldB(L,.1,.1,4.2,x+a*2,4.5,z,DK,0,a*1.1,0)}ldB(L,6,.3,6,x,12.4,z,OD);
  for(let y=.5;y<9;y+=.55)ldB(L,.9,.06,.06,x+.9,y,z+2.35,DK);for(const a of[.45,1.35])ldB(L,.06,9,.06,x+a,4.5,z+2.35,DK);ldSol(x-2.3,x+2.3,z-2.3,z+2.3,12.6);
  const lx=x-Math.sign(x)*2.3,lz=z+(z>(ldZ0+ldZ1)/2?-2.3:2.3);ldB(ldE,.9,.7,.9,lx,11.2,lz,0xfff4c8);ldBeams.push([lx,11.2,lz])};
 tower(ldX0+7,(ldZ0+ldZ1)/2);tower(ldX1-7,(ldZ0+ldZ1)/2);tower(0,ldZ1+7);
 // gate checkpoint: jersey barriers along the approach, speed bumps, stop sign, warning board, gate lights
 for(const s of[-1,1]){for(let z=ldZ0+4;z<-HALF-4;z+=3.4){ldB(L,.7,.9,3.2,ldGX+s*6.6,.45,z+1.7,0xb7b5ac);ldB(L,.35,.35,3.2,ldGX+s*6.6,1.05,z+1.7,0xb7b5ac)}ldSol(ldGX+s*6.6-.4,ldGX+s*6.6+.4,ldZ0+4,-HALF-4,1.2);ldB(ldE,.7,.4,.7,ldGX+s*8,5.85,ldZ0+.6,0xfff1c9)}
 for(const z of[ldZ0+10,ldZ0+20]){ldB(L,11.4,.12,.6,ldGX,.08,z,0xf2c230);for(let k=0;k<6;k++)ldB(L,.9,.13,.62,ldGX-4.7+k*1.9,.085,z,0x222222)}
 ldB(L,.12,2.6,.12,ldGX+5.6,1.3,ldZ0+3,0x8a8d90);ldCy(L,.62,.62,.06,8,ldGX+5.6,2.75,ldZ0+3.05,0xc62828,PI/2);ldTag('stop',.96,.32,ldGX+5.6,2.75,ldZ0+3.09,0);
 {const x=ldGX+16,z=ldZ0+14;for(const s of[-1,1])ldB(L,.2,4.4,.2,x+s*4.6,2.2,z-.12,0x8a8d90);ldB(L,10.4,2.8,.15,x,3.4,z,0x8a1c1c);ldTag('mil',10.2,2.6,x,3.4,z+.09,0)}
 ldB(L,6.4,1.1,.15,ldGX+13,4.45,ldZ0-1.85,OD);ldTag('chk',6.2,1,ldGX+13,4.45,ldZ0-1.76,0);
 // tank-trap hedgehogs along the outside of the front fence
 for(let x=-150;x<=150;x+=10){if(Math.abs(x-ldGX)<16)continue;const z=ldZ0+5+(Math.abs(x)%20?1.2:0);for(let k=0;k<3;k++)ldB(L,2.3,.22,.22,x,.78,z,0x3a3a36,k*PI*2/3,0,.62);ldSol(x-.8,x+.8,z-.8,z+.8,1.4)}
 // razor wire coils on every fence run
 const wire=(x0,z0,x1,z1)=>{const len=Math.hypot(x1-x0,z1-z0),ax=Math.abs(x1-x0)>Math.abs(z1-z0),n=Math.floor(len/2.5);for(let i=0;i<n;i++){const t=(i+.5)/n,g=new THREE.TorusGeometry(.42,.025,3,5);g.rotateY(ax?PI/2:0);g.rotateX((i%3-1)*.22);g.translate(x0+(x1-x0)*t,4.78,z0+(z1-z0)*t);L.push(ldPaint(g,0xc4c8cc))}};
 wire(ldX0,ldZ0,ldGX-8,ldZ0);wire(ldGX+8,ldZ0,ldX1,ldZ0);wire(ldX0,ldZ1,ldX1,ldZ1);wire(ldX0,ldZ0,ldX0,ldZ1);wire(ldX1,ldZ0,ldX1,ldZ1);
 // barracks: porches, steps, AC units, names
 [[-100,ldZ0-26,'A'],[-100,ldZ0-46,'B'],[-58,ldZ0-26,'C'],[-58,ldZ0-46,'D']].forEach(b=>{const x=b[0],z=b[1];ldB(L,3.4,.2,1.9,x,2.85,z+6.4,OD);for(const s of[-1,1])ldB(L,.15,2.8,.15,x+s*1.5,1.4,z+7.2,DK);ldB(L,2.8,.25,1.3,x,.13,z+6.2,CON);
  for(const s of[-1,1]){ldB(L,.6,.8,1.1,x+s*18.35,.8,z+2,0x9aa09a);ldB(L,.06,.5,.5,x+s*18.67,.85,z+2,DK);ldB(L,.6,.8,1.1,x+s*18.35,.8,z-2,0x9aa09a)}
  ldTag('bk'+b[2],9.2,1.1,x+11.8,4.3,z+5.57,0)});
 // HQ name, parade square, three flag poles (flags are animated meshes below)
 ldTag('cmd',8,1.25,22,4.45,ldZ0-32.93,0);
 {const z=ldZ0-20;ldB(L,30,.06,14,22,.05,z,0x9a9a92);for(const s of[-1,1]){ldB(L,30,.07,.25,22,.06,z+s*6.8,WH);ldB(L,.25,.07,14,22+s*14.8,.06,z,WH)}for(const x of[14,22,30]){ldCy(L,.1,.13,10,6,x,5,ldZ0-27.5,0xc9ccd0);ldCy(L,.2,.2,.2,6,x,10.1,ldZ0-27.5,0xd4af37)}}
 // hangars: names over the doors, interior light strips
 for(const hx of[64,114]){const hz=ldZ0-52;ldTag(hx<100?'hgA':'hgB',14,2.05,hx,11.1,hz+15.06,0);for(const s of[-1,1])ldB(ldE,.4,.15,26,hx+s*7,9.7,hz,0xfff1c9)}
 // helipad: edge lights and a windsock
 for(let k=0;k<12;k++){const a=k*PI/6;ldB(ldE,.35,.15,.35,10+Math.cos(a)*7.5,.22,ldZ0-122+Math.sin(a)*7.5,k%2?0x7df0ff:0xfff1c9)}
 const sock=(x,z)=>{ldCy(L,.08,.1,6,6,x,3,z,0xdddddd);ldCy(L,.13,.45,2.2,8,x+1.2,5.85,z,0xff6a00,0,-PI/2);ldCy(L,.46,.46,.6,8,x+.55,5.85,z,0xf2f2f2,0,-PI/2)};sock(24,ldZ0-110);sock(120,ldZ1+8);
 // motor pool: shade canopy, bay lines, sign, extra jeep, fuel pumps
 const sJeep=(x,z,ry)=>{ldSol(x-1.1,x+1.1,z-2.1,z+2.1,2.4);ldInto(L,ldVG.jeep,x,0,z,ry);for(const p of[[-1.02,-1.3],[1.02,-1.3],[-1.02,1.3],[1.02,1.3]]){const w=ldVG.wheel.clone();w.translate(p[0],.45,p[1]);w.rotateY(ry||0);w.translate(x,0,z);L.push(w)}};
 {const z=ldZ0-125;ldB(L,80,.35,16,-94,5.4,z,OD);ldB(L,80.4,.5,.3,-94,5.25,z+8.1,0x3d4432);for(let x=-132;x<=-56;x+=12.6)for(const s of[-1,1]){ldB(L,.35,5.3,.35,x,2.65,z+s*7.6,DK);ldSol(x-.3,x+.3,z+s*7.6-.3,z+s*7.6+.3,5.4)}
  ldB(L,13,1.4,.15,-94,6.3,z+8.1,0x3d4432);ldTag('mp',12.6,1.25,-94,6.3,z+8.2,0);for(let x=-130;x<=-58;x+=8)ldB(L,.15,.06,11,x,.07,z,WH);sJeep(-88,z+1,PI);sJeep(-52,z+12,PI/2)}
 {const x=-45,z=ldZ0-100;ldB(L,6,.3,2,x,.15,z,CON);for(const s of[-1,1]){ldB(L,.8,1.6,.6,x+s*1.6,1.1,z,0xb02323);ldB(L,.6,.4,.05,x+s*1.6,1.4,z+.33,0xf2f2ea);ldB(L,.2,4.4,.2,x+s*2.6,2.2,z,DK)}ldB(L,8,.3,5,x,4.5,z,OD);ldB(ldE,6,.08,.3,x,4.33,z,0xfff1c9);ldSol(x-3,x+3,z-1,z+1,1.8)}
 // container yard (west) and ammo crate stacks
 {const cc=[0x55613f,0x9b8f6b,0x8a4b2b,0x4f6d7a,0x6b5a3a];for(const x of[-155,-152.4,-149.8,-141.5,-138.9])for(const d of[30,44,58]){const n=1+Math.floor(ldR()*2.6),z=ldZ0-d;
  for(let k=0;k<n;k++){const col=cc[Math.floor(ldR()*cc.length)],y=1.3+k*2.62;ldB(L,2.5,2.6,12.2,x,y,z,col);for(const s of[-1,1])for(let r=-4.5;r<=4.5;r+=3)ldB(L,.06,2.3,.3,x+s*1.27,y,z+r,col);ldB(L,2.2,2.3,.06,x,y,z+6.12,col);for(const s of[-.5,.5])ldB(L,.07,2.3,.08,x+s,y,z+6.16,DK)}ldSol(x-1.25,x+1.25,z-6.1,z+6.1,n*2.62)}}
 const crates=(x,z,nx,nz,h)=>{for(let a=0;a<nx;a++)for(let b=0;b<nz;b++){const hh=1+Math.floor(ldR()*h);for(let c=0;c<hh;c++){const col=ldR()<.5?0x6b5a3a:0x4f5d3a;ldB(L,1.25,1.05,1.25,x+a*1.35,.53+c*1.07,z+b*1.35,col);ldB(L,1.28,.12,1.28,x+a*1.35,.53+c*1.07,z+b*1.35,0x3a3a2e)}}ldSol(x-.7,x+nx*1.35-.65,z-.7,z+nz*1.35-.65,h*1.07)};
 crates(-128,ldZ0-30,3,2,2);crates(-128,ldZ0-62,2,2,2);crates(87,ldZ0-45,2,3,3);crates(136,ldZ0-139,2,2,2);
 // sandbag gun nests
 const nest=(x,z,r,face)=>{for(let l=0;l<3;l++){const n=Math.round(PI*1.55*r/.92);for(let i=0;i<=n;i++){const a=face+.45+(i+(l%2)*.5)/n*(PI*2-.9);ldB(L,.9,.36,.5,x+Math.cos(a)*r,.2+l*.36,z+Math.sin(a)*r,(i+l)%3?SB:0x8f8462,PI/2-a)}}
  const b=face+PI;ldCy(L,.05,.05,1.1,4,x,.55,z,DK);ldB(L,1.3,.16,.16,x+Math.cos(b)*.5,1.15,z+Math.sin(b)*.5,0x2b2e26,-b);ldB(L,.3,.25,.25,x,1.15,z,0x2b2e26,-b);ldSol(x-r-.3,x+r+.3,z-r-.3,z+r+.3,1.1)};
 nest(-140,ldZ0-14,2.2,-PI/2);nest(150,ldZ0-14,2.2,-PI/2);nest(-4,ldZ0-9,2,-PI/2);nest(30,ldZ0-138,2.2,-PI/2);nest(-155,ldZ0-165,2.2,0);
 // radome, comms mast, water tower (east strip)
 {const z=ldZ0-128;ldCy(L,4.2,4.6,4,16,150,2,z,0x8d8f86);const d=new THREE.SphereGeometry(5.2,16,10,0,PI*2,0,PI*.62);d.translate(150,6,z);L.push(ldPaint(d,0xf2f2ea));ldSol(145.4,154.6,z-4.6,z+4.6,11.2)}
 {const x=150,z=ldZ0-62,C=0xc9ccd0;for(const a of[-1,1])for(const b of[-1,1])ldB(L,.22,26,.22,x+a,13,z+b,C);for(let y=2;y<25;y+=3)for(const a of[-1,1]){ldB(L,2.2,.1,.1,x,y,z+a,C);ldB(L,.1,.1,2.2,x+a,y,z,C);ldB(L,2.7,.08,.08,x,y+1.5,z+a,C,0,0,a*.94);ldB(L,.08,.08,2.7,x+a,y+1.5,z,C,0,a*.94,0)}
  for(const q of[[0,18,1.6,0],[-1.6,22,0,-PI/2]]){const g=new THREE.SphereGeometry(1.4,12,6,0,PI*2,0,PI*.32);g.rotateX(PI/2);g.rotateY(q[3]);g.translate(x+q[0],q[1],z+q[2]);L.push(ldPaint(g,0xf2f2ea))}ldB(ldE,.5,.5,.5,x,26.3,z,0xff3020);ldSol(x-1.2,x+1.2,z-1.2,z+1.2,26)}
 {const x=150,z=ldZ0-35,C=0x7c8073;for(const a of[-1,1])for(const b of[-1,1])ldB(L,.35,14,.35,x+a*2.4,7,z+b*2.4,C);for(const y of[4,9])for(const a of[-1,1]){ldB(L,5,.18,.18,x,y,z+a*2.4,C);ldB(L,.18,.18,5,x+a*2.4,y,z,C)}
  ldCy(L,3.6,3.6,4.5,16,x,16.2,z,0x6f7a5a);ldCy(L,0,3.9,2,16,x,19.4,z,0x5b6447);ldCy(L,3.9,3.9,.3,16,x,14,z,0x47503a);{const g=new THREE.CylinderGeometry(3.63,3.63,1.1,12,1,true,-.6,1.2),c=ldCells.army,uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(c[0]+uv.getX(i)*c[2])/512,1-(c[1]+(1-uv.getY(i))*c[3])/512);const q=g.toNonIndexed();q.translate(x,16.4,z);ldSG.push(q)}ldSol(x-2.7,x+2.7,z-2.7,z+2.7,20)}
 // floodlight masts
 const mast=(x,z)=>{ldCy(L,.18,.28,18,6,x,9,z,DK);ldB(L,3.2,.3,.5,x,18,z,DK);for(const a of[-1.2,-.4,.4,1.2])ldB(ldE,.6,.45,.6,x+a,17.7,z+.3,0xfff4d6);ldSol(x-.3,x+.3,z-.3,z+.3,18)};
 mast(-150,ldZ0-108);mast(-155,ldZ0-150);mast(155,ldZ0-150);mast(40,ldZ0-150);
 // airstrip: edge and threshold lights, hardstands and a blast wall behind the parked jets
 for(let x=-145;x<=145;x+=14.5)for(const s of[-1,1])ldB(ldE,.3,.18,.3,x,.2,ldZ1+22+s*8.6,0xfff1c9);for(let k=-3;k<=3;k++){ldB(ldE,.3,.18,.3,-150.6,.2,ldZ1+22+k*2.2,0x40ff70);ldB(ldE,.3,.18,.3,150.6,.2,ldZ1+22+k*2.2,0xff4030)}
 for(const x of[-84,-52,-20])ldB(L,16,.06,12,x,.05,ldZ0-159,0x8d8f86);for(let x=-100;x<=-4;x+=1.46){ldB(L,1.38,3.4,.45,x,1.7,ldZ0-150,0xa9aaa2);ldB(L,1.38,.4,1.4,x,.2,ldZ0-150,0xa9aaa2)}ldSol(-100.7,-3.3,ldZ0-150.7,ldZ0-149.3,3.4);
 // training ground: dirt yard, obstacle course, rope tower
 {const zc=ldZ0-100;ldB(L,80,.06,58,85,.04,ldZ0-118,0x8a7655);
  for(let i=0;i<5;i++)for(const s of[-1,1]){const g=new THREE.TorusGeometry(.42,.16,5,10);g.rotateX(PI/2);g.translate(50+i*1.5+(s>0?.75:0),.17,zc+s*1.2);L.push(ldPaint(g,0x1c1c1c))}
  for(const x of[60,64]){ldB(L,.35,1.2,5,x,.6,zc,0x8a6b45);ldSol(x-.2,x+.2,zc-2.5,zc+2.5,1.2)}ldB(L,.5,2.4,5,70,1.2,zc,0x8a6b45);for(let y=.5;y<2.4;y+=.6)ldB(L,.12,.12,4.6,69.7,y,zc,0x6b5236);ldSol(69.75,70.25,zc-2.5,zc+2.5,2.4);
  for(const s of[-1,1]){ldB(L,10.4,.12,.12,81,2.3,zc+s*.55,0x55585d);for(const x of[76,86])ldB(L,.14,2.35,.14,x,1.17,zc+s*.55,0x55585d)}for(let x=76.5;x<86;x+=.6)ldB(L,.06,.06,1.1,x,2.33,zc,0x9a9da1);
  for(const s of[-1,1]){ldCy(L,.14,.14,9,8,95,.55,zc+s*1.6,0x7a5c3a,0,PI/2);for(const x of[91,95,99])ldB(L,.2,.5,.2,x,.25,zc+s*1.6,0x5d4630)}
  {const x=106;for(const a of[-1,1]){for(const s of[-1,1])ldB(L,.18,5.76,.18,x+a*1.55,2.42,zc+s*2.4,0x7a5c3a,0,0,a*.569);for(let k=0;k<6;k++){const y=.5+k*.8;ldB(L,.05,.05,4.8,x+a*3.1*(1-y/4.85),y,zc,0x2a2a2a)}for(let k=-2;k<=2;k++)ldB(L,.05,5.7,.05,x+a*1.55,2.42,zc+k*.95,0x2a2a2a,0,0,a*.569)}ldB(L,.2,.2,5,x,4.85,zc,0x7a5c3a)}
  for(let x=112;x<=121;x+=1.5){for(const s of[-1,1])ldB(L,.08,.6,.08,x,.3,zc+s*1.3,0x55585d);ldB(L,.03,.03,2.6,x,.58,zc,0x9a9da1)}for(const s of[-1,0,1])ldB(L,9.2,.03,.03,116.5,.55,zc+s*1.3,0x9a9da1);
  {const x=120,z=ldZ0-112;for(const a of[-1.5,1.5])for(const b of[-1,1])ldB(L,.25,7,.25,x+a,3.5,z+b,0x7a5c3a);ldB(L,3.4,.3,2.4,x,7,z,0x7a5c3a);for(const a of[-.8,0,.8])ldCy(L,.05,.05,6.6,5,x+a,3.6,z,0xc2a878);ldSol(x-1.7,x+1.7,z-1.1,z+1.1,7)}}
 // shooting range: firing-line shelter, rests, targets, earth berm
 {const zf=ldZ0-128,zt=ldZ0-143;ldB(L,62,.25,4,82,3.1,zf,OD);for(let x=52;x<=112;x+=10)for(const s of[-1,1])ldB(L,.2,3,.2,x,1.5,zf+s*1.8,DK);
  ldB(L,7,1.3,.15,82,3.9,zf+2,OD);ldTag('rng',6.6,1.2,82,3.9,zf+2.09,0);
  for(let x=55;x<=109;x+=6){ldB(L,1.2,.9,.6,x,.45,zf-1.2,SB);for(const s of[-1,1])ldB(L,.08,1.5,.08,x+s*.35,.75,zt,DK);ldB(L,.9,1.3,.06,x,1.75,zt,0xf2f2ea);ldB(L,.5,.5,.07,x,1.95,zt,0x222222);ldB(L,.2,.2,.08,x,1.95,zt,0xc62828)}
  ldB(L,66,3.6,3,82,1.8,zt-3,0x6f5f40);ldSol(49,115,zt-4.5,zt-1.5,3.6)}
 ldMesh(L,ldMat,true);var ldSignMat=new THREE.MeshStandardMaterial({map:ldAtlas,emissive:0xffffff,emissiveMap:ldAtlas,emissiveIntensity:.12,roughness:.75});{const sm=new THREE.Mesh(U.mergeBufferGeometries(ldSG),ldSignMat);sm.receiveShadow=true;scene.add(sm)}
 // moving parts
 const bg=new THREE.ConeGeometry(7,44,14,1,true);bg.translate(0,-22,0);const bm=new THREE.MeshBasicMaterial({color:0xfff0c0,transparent:true,opacity:.2,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false,fog:false});
 for(let i=0;i<ldBeams.length;i++){const p=ldBeams[i],g=new THREE.Group(),m=new THREE.Mesh(bg,bm);m.rotation.z=1.15;g.add(m);g.position.set(p[0],p[1],p[2]);g.visible=false;scene.add(g);ldBeams[i]={g:g,ph:i*1.7,base:Math.atan2(p[2]-(ldZ0+ldZ1)/2,-p[0])}}
 const rl=[];{const d=new THREE.SphereGeometry(2.7,12,5,0,Math.PI*2,0,1.05);d.rotateX(Math.PI/2);d.translate(0,1.6,-1.3);rl.push(ldPaint(d,0xc9ccd0));ldB(rl,.3,1.8,.3,0,.9,0,0x55585d);ldB(rl,.15,.15,2.4,0,1.6,.2,0x55585d)}
 var ldRadar=new THREE.Mesh(U.mergeBufferGeometries(rl),ldMat2);ldRadar.position.set(130,7,ldZ0-150);ldRadar.castShadow=true;scene.add(ldRadar);
 const ar=[];for(let k=0;k<8;k++)ldB(ar,1.9,.22,.22,-.95-k*1.9,0,0,k%2?0xf2f2ea:0xc62828);ldB(ar,.5,1.3,.5,0,-.5,0,DK);
 var ldArm=new THREE.Mesh(U.mergeBufferGeometries(ar),ldMat);ldArm.position.set(ldGX+7.9,1.25,ldZ0);scene.add(ldArm);
 const fg=new THREE.PlaneGeometry(3.4,2.1);fg.translate(1.7,0,0);var ldFlag=new THREE.Mesh(ldPaint(fg,0x2f6b3a),ldMat2);ldFlag.position.set(ldGX-14,11.8,ldZ0-14);scene.add(ldFlag);
 var ldFlags=[];{const fd=[[0x2f6b3a,0xf2e24a,0x2f6b3a],[0x1d3f8a,0xf2f2f2,0x1d3f8a],[0xc62828,0xf2f2f2,0xc62828]];for(let i=0;i<3;i++){const a=[];for(let k=0;k<3;k++){const g=new THREE.PlaneGeometry(3.2,.66);g.translate(1.6,.66-k*.66,0);a.push(ldPaint(g,fd[i][k]))}const m=new THREE.Mesh(U.mergeBufferGeometries(a),ldMat2);m.position.set(14+i*8,9.3,ldZ0-27.5);m.castShadow=true;scene.add(m);ldFlags.push(m)}}
 // vehicles, helicopter, crates, soldiers
 ldVehicle('tank',64,ldZ0-22,Math.PI);ldVehicle('tank',-20,ldZ0-104,-Math.PI/2);ldVehicle('truck',114,ldZ0-22,Math.PI);ldVehicle('jeep',ldGX-11,ldZ0-24,Math.PI);ldVehicle('jeep',-79,ldZ0-14,Math.PI);
 if(typeof vhMakeHeli==='function'&&typeof vhHelis!=='undefined'){const m=vhMakeHeli(0x4b5a34);m.position.set(10,.2,ldZ0-122);m.rotation.y=.6;scene.add(m);const c={m:m,speed:0,steer:0,hp:160,vhT:'heli',vy:0,vhSpin:0,vhFloor:.2,vhEng:new THREE.Vector3(0,2.7,.4)};cars.push(c);vhHelis.push(c)}
 const pg=new THREE.BoxGeometry(1,1,1);for(const p of[[2,22,ldZ0-30],[2,-85,ldZ0-118],[4,114,ldZ0-40],[4,-79,ldZ0-36],[0,-8,ldZ0-134]]){const d=PK[p[0]],m=new THREE.Mesh(pg,new THREE.MeshStandardMaterial({color:d.col,emissive:d.col,emissiveIntensity:1.6,toneMapped:false}));m.position.set(p[1],1.2,p[2]);m.castShadow=true;scene.add(m);pickups.push({m:m,d:d,t:0})}
 const sol=(x,z,a,b,st)=>{const g=makePerson(0x4b5a34,0x3d4a2c,[0xf1c27d,0xc68642,0x8d5524][Math.floor(Math.random()*3)]);g.userData.rlType='sol';g.userData.rlTint=new THREE.Color(0xa9bf72);if(g.userData.gun)g.userData.gun.visible=true;g.position.set(x,.3,z);g.rotation.y=Math.PI;scene.add(g);
  const s={g:g,kind:'army',hp:4,cd:1+Math.random(),dead:false,aggro:false,home:new THREE.Vector3(x,.3,z),deadT:0,walkT:Math.random()*9,a:a||null,b:b||null,leg:0,stat:!!st};ldSold.push(s);shooters.push(s)};
 sol(ldGX-5.5,ldZ0-3);sol(ldGX+5.5,ldZ0-3);sol(-140,ldZ0-78,[-140,ldZ0-78],[-45,ldZ0-78]);sol(140,ldZ0-78,[140,ldZ0-78],[20,ldZ0-78]);sol(ldGX+3,ldZ0-20,[ldGX+3,ldZ0-20],[ldGX+3,ldZ0-130]);
 sol(-130,ldZ0-112,[-130,ldZ0-112],[-60,ldZ0-112]);sol(50,ldZ0-30,[50,ldZ0-30],[128,ldZ0-30]);sol(18,ldZ0-112)}
function ldSoldTick(dt){for(let i=0;i<ldSold.length;i++){const s=ldSold[i],g=s.g;
 if(s.dead){s.deadT+=dt;if(s.deadT<.35){g.rotation.x=-Math.min(1,s.deadT*3)*Math.PI/2;g.position.addScaledVector(s.fall,dt*4)}if(s.deadT>50&&g.position.distanceTo(pos)>110){s.dead=false;s.hp=4;s.aggro=false;g.rotation.x=0;g.position.copy(s.home)}continue}
 const dx=pos.x-g.position.x,dz=pos.z-g.position.z,d=Math.hypot(dx,dz)||1;let mv=0;s.aggro=state==='play'&&ldAlert>0&&d<80;
 if(s.aggro){g.rotation.y=Math.atan2(-dx,-dz);if(!s.stat){if(d>16){mv=4.6;g.position.x+=dx/d*mv*dt;g.position.z+=dz/d*mv*dt}else{const sd=Math.sin(T*1.3+i)*2;g.position.x+=-dz/d*sd*dt;g.position.z+=dx/d*sd*dt;mv=Math.abs(sd)}}s.cd-=dt;if(s.cd<=0&&d<46){s.cd=.8+Math.random()*.8;enemyShoot(s)}}
 else{const t=s.a?(s.leg?s.b:s.a):[s.home.x,s.home.z],hx=t[0]-g.position.x,hz=t[1]-g.position.z,hd=Math.hypot(hx,hz);if(hd<1.2){if(s.a)s.leg=1-s.leg}else{mv=1.7;g.position.x+=hx/hd*mv*dt;g.position.z+=hz/hd*mv*dt;g.rotation.y=Math.atan2(-hx,-hz)}}
 if(mv)collide(g.position,.45);s.walkT+=dt*mv*1.5;animLimbs(g,mv,s.walkT);if(s.aggro&&mv<1)g.userData.armR.rotation.x=Math.PI/2}}
{const st=shooterTick;shooterTick=function(dt){for(const s of ldSold){const i=shooters.indexOf(s);if(i>=0)shooters.splice(i,1)}st(dt);for(const s of ldSold)shooters.push(s);ldSoldTick(dt)}}
{const s0=shoot;shoot=function(){const c=driving;if(!c||!c.ldTank){s0();return}if(ldCan>0)return;ldCan=2.4;const m=c.m,o=new THREE.Vector3(m.position.x,m.position.y+2.65,m.position.z),tg=findTarget();let dir=null;
 if(tg){dir=tg.p.clone().sub(o);if(dir.length()>95||dir.length()<7)dir=null}if(!dir)dir=new THREE.Vector3(-Math.sin(camYaw),-.03,-Math.cos(camYaw));dir.normalize();
 m.userData.tur.rotation.y=Math.atan2(-dir.x,-dir.z)-m.rotation.y;o.addScaledVector(new THREE.Vector3(dir.x,0,dir.z).normalize(),6.2);fireRocket(o,dir);
 burst(o,10,0xffd27a,7,.5,.25);burst(o,8,0x777777,4,1,.9,.6);sfx(1.1,260,1);sfx(.3,1800,.6);shake=Math.max(shake,.6);c.speed-=2.5;flashLight.position.copy(o);flashLight.intensity=6}}
// ================= HILLS + SIGN (south) =================
const ldTX0=-340,ldTZ0=HALF+40,ldTS=4,ldTNX=161,ldTNZ=49,ldTH=new Float32Array(ldTNX*ldTNZ),ldSZ=HALF+94;
const ldRoad=[[-135,HALF-2],[-135,HALF+44],[-130,HALF+58],[-116,HALF+70],[-112,HALF+84],[-124,HALF+96],[-146,HALF+102],[-164,HALF+110],[-170,HALF+122]];
const ldPl=[{x:-170,z:HALF+122,r:21},{x:-90,z:HALF+84,r:18},{x:126,z:HALF+90,r:18},{x:-240,z:HALF+98,r:18},{x:112,z:HALF+166,r:23}];
function ldSm(t){t=t<0?0:(t>1?1:t);return t*t*(3-2*t)}
function ldH0(x,z){const t=ldSm((z-(HALF+46))/112),fx=ldSm((x+336)/70)*(1-ldSm((x-150)/66));if(t<=0||fx<=0)return 0;return t*fx*(43+14*Math.sin(x*.012+.8)+7*Math.sin(x*.031+2)+4*Math.sin(z*.05+x*.02)+1.6*Math.sin(x*.11)*Math.sin(z*.09))}
function ldNear(x,z){let bd=1e9,bx=0,bz=0;for(let i=0;i<ldRoad.length-1;i++){const a=ldRoad[i],b=ldRoad[i+1],vx=b[0]-a[0],vz=b[1]-a[1];let t=((x-a[0])*vx+(z-a[1])*vz)/(vx*vx+vz*vz);t=t<0?0:(t>1?1:t);const px=a[0]+vx*t,pz=a[1]+vz*t,d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;bx=px;bz=pz}}return [bd,bx,bz]}
function ldHc(x,z){let h=ldH0(x,z);const n=ldNear(x,z);if(n[0]<13)h+=(ldH0(n[1],n[2])-h)*(1-ldSm((n[0]-5)/8));for(const p of ldPl){const d=Math.hypot(x-p.x,z-p.z);if(d<p.r)h+=(p.h-h)*(1-ldSm((d-p.r*.62)/(p.r*.38)))}return h}
function ldHt(x,z){const fx=(x-ldTX0)/ldTS,fz=(z-ldTZ0)/ldTS;if(fx<0||fz<0||fx>=ldTNX-1||fz>=ldTNZ-1)return 0;const ix=Math.floor(fx),iz=Math.floor(fz),u=fx-ix,v=fz-iz,i=iz*ldTNX+ix,A=ldTH[i],B=ldTH[i+1],Cq=ldTH[i+ldTNX],D=ldTH[i+ldTNX+1];return u+v<=1?A+(B-A)*u+(Cq-A)*v:D+(Cq-D)*(1-u)+(B-D)*(1-v)}
function ldFloor(x,z){if(z>ldTZ0){const h=ldHt(x,z);return h>.02?h:-1}if(x>HALF+37&&x<HALF+96.6&&Math.abs(z-120)<2.2)return x<HALF+41?.3+(x-HALF-37)*.075:.6;return -1}
function ldLandOK(p){return (p.z<-HALF-10&&p.z>ldZ1-16&&Math.abs(p.x)<=186)||(p.z>HALF+10&&p.z<HALF+210&&p.x>-332&&p.x<302)}
function ldPalm(L,x,y,z,s,ph){let px=0,py=0;for(let k=0;k<5;k++){const t=.03+k*.035,g=new THREE.CylinderGeometry(.15*s,.2*s,1.85*s,6);g.rotateZ(-t);g.translate(px+Math.sin(t)*.9*s,py+Math.cos(t)*.9*s,0);g.rotateY(ph);g.translate(x,y,z);L.push(ldPaint(g,k%2?0x8a6b45:0x7a5c3a));px+=Math.sin(t)*1.8*s;py+=Math.cos(t)*1.8*s}
 for(let k=0;k<8;k++){const a=k*Math.PI/4,g=new THREE.BoxGeometry(.75*s,.06,3.3*s);g.translate(0,0,1.65*s);g.rotateX(.42);const g2=new THREE.BoxGeometry(.5*s,.06,1.7*s);g2.translate(0,0,.85*s);g2.rotateX(1.05);g2.translate(0,-Math.sin(.42)*3.3*s,Math.cos(.42)*3.3*s);
  for(const q of[g,g2]){q.rotateY(a);q.translate(px,py,0);q.rotateY(ph);q.translate(x,y,z);L.push(ldPaint(q,k%2?0x3f8f3a:0x2f7d32))}}}
{for(const p of ldPl)p.h=ldH0(p.x,p.z);for(let iz=0;iz<ldTNZ;iz++)for(let ix=0;ix<ldTNX;ix++)ldTH[iz*ldTNX+ix]=ldHc(ldTX0+ix*ldTS,ldTZ0+iz*ldTS);
 const n=ldTNX*ldTNZ,P=new Float32Array(n*3),Cc=new Float32Array(n*3),idx=[],c1=new THREE.Color(),c2=new THREE.Color(),c3=new THREE.Color();
 for(let iz=0;iz<ldTNZ;iz++)for(let ix=0;ix<ldTNX;ix++){const i=iz*ldTNX+ix,x=ldTX0+ix*ldTS,z=ldTZ0+iz*ldTS,h=ldTH[i];P[i*3]=x;P[i*3+1]=h+.03;P[i*3+2]=z;
  const k=.5+.5*Math.sin(x*.07+z*.05)*Math.cos(x*.03-z*.08),d=.5+.5*Math.sin(x*.19)*Math.sin(z*.23);c1.set(0x8f7f48).lerp(c2.set(0x5a6a33),k).lerp(c3.set(0x7a6240),d*.45);c2.set(0x4c9a47).lerp(c1,ldSm(h/7));Cc[i*3]=c2.r;Cc[i*3+1]=c2.g;Cc[i*3+2]=c2.b}
 for(let iz=0;iz<ldTNZ-1;iz++)for(let ix=0;ix<ldTNX-1;ix++){const a=iz*ldTNX+ix,b=a+1,c=a+ldTNX,d=c+1;if(ldTH[a]+ldTH[b]+ldTH[c]+ldTH[d]<.04)continue;idx.push(a,c,b,b,c,d)}
 const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(P,3));tg.setAttribute('color',new THREE.BufferAttribute(Cc,3));tg.setIndex(idx);tg.computeVertexNormals();
 const tm=new THREE.Mesh(tg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));tm.receiveShadow=true;scene.add(tm);
 // road ribbon
 const L=ldS,rp=[],rc=[];const quad=(a,b,c,d,col)=>{ldC.set(col);for(const v of[a,c,b,b,c,d]){rp.push(v[0],v[1],v[2]);rc.push(ldC.r,ldC.g,ldC.b)}};
 const pts=[];for(let i=0;i<ldRoad.length-1;i++){const a=ldRoad[i],b=ldRoad[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),m=Math.ceil(len/1.6);for(let k=0;k<m;k++)pts.push([a[0]+(b[0]-a[0])*k/m,a[1]+(b[1]-a[1])*k/m])}pts.push(ldRoad[ldRoad.length-1]);
 const edge=[],off=[-3.6,-1.8,0,1.8,3.6,-.16,.16];for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-2)],b=pts[Math.min(pts.length-1,i+2)],tx=b[0]-a[0],tz=b[1]-a[1],tl=Math.hypot(tx,tz)||1,nx=-tz/tl,nz=tx/tl,x=pts[i][0],z=pts[i][1];edge.push(off.map((o,k)=>[x+nx*o,ldHt(x+nx*o,z+nz*o)+(k>4?.2:.15),z+nz*o]))}
 for(let i=0;i<edge.length-1;i++){for(let k=0;k<4;k++)quad(edge[i][k+1],edge[i][k],edge[i+1][k+1],edge[i+1][k],0x33353a);if(i%4<2)quad(edge[i][6],edge[i][5],edge[i+1][6],edge[i+1][5],0xf4d03f)}
 const rg=new THREE.BufferGeometry(),nn=rp.length/3,rn=new Float32Array(nn*3),ru=new Float32Array(nn*2);for(let i=0;i<nn;i++)rn[i*3+1]=1;
 rg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(rp),3));rg.setAttribute('normal',new THREE.BufferAttribute(rn,3));rg.setAttribute('uv',new THREE.BufferAttribute(ru,2));rg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(rc),3));rg.computeVertexNormals();L.push(rg);
 // viewpoint
 {const p=ldPl[0],h=p.h;ldCy(L,15,15.6,.3,28,p.x,h+.12,p.z,0x4a4c50);for(let k=0;k<11;k++){const a=Math.PI*(1.12+k*.076),x=p.x+Math.cos(a)*14.2,z=p.z+Math.sin(a)*14.2;ldB(L,.22,1.2,.22,x,h+.85,z,0xc9ccd0);ldB(L,4.4,.14,.14,x,h+1.4,z,0xc9ccd0,-a+Math.PI/2)}
  for(const s of[-1,1]){ldB(L,.35,1.3,.35,p.x+s*4,h+.9,p.z-11.5,0x55585d);ldB(L,.55,.4,.9,p.x+s*4,h+1.7,p.z-11.7,0x2c2e31);ldB(L,3,.2,.9,p.x+s*8,h+.75,p.z+6,0x7a5c3a);ldB(L,3,.7,.15,p.x+s*8,h+1.1,p.z+6.4,0x7a5c3a)}}
 // mansions
 for(let i=1;i<4;i++){const p=ldPl[i],x=p.x,z=p.z,h=p.h,W=[0xf2ede2,0xf7e9d6,0xe9eef0][i-1];ldB(L,15,5,9,x,h+2.5,z+2,W);ldB(L,8,3.6,7,x-2.5,h+6.8,z+2.5,W);ldB(L,15.8,.4,9.8,x,h+5.2,z+2,0xa5482f);ldB(L,8.8,.4,7.8,x-2.5,h+8.8,z+2.5,0xa5482f);
  ldB(L,9,2.6,.15,x+1,h+2.3,z-2.55,0x22364a);ldB(L,5,2,.15,x-2.5,h+6.8,z-1.05,0x22364a);ldB(L,12.5,.2,7.4,x+1,h+.12,z-7.4,0xd9d4c4);ldB(L,9,.3,4.5,x+1,h+.16,z-7.4,0x2fa8d8);
  for(const s of[-1,1]){ldCy(L,.25,.25,5,8,x+s*6.6,h+2.5,z-2.9,0xffffff);ldCy(L,0,.9,6,7,x+s*10.5,h+3,z+4,0x2f5a33);ldCy(L,0,.8,5,7,x+s*10.5,h+2.5,z-1,0x2f5a33)}ldSol(x-7.5,x+7.5,z-2.5,z+6.5,h+9.5)}
 // observatory
 {const p=ldPl[4],x=p.x,z=p.z,h=p.h;ldCy(L,9,9.5,6,20,x,h+3,z,0xf0ede6);const d=new THREE.SphereGeometry(8.2,18,8,0,Math.PI*2,0,Math.PI/2);d.translate(x,h+6,z);L.push(ldPaint(d,0xcfd6d2));ldB(L,1.6,6,.3,x,h+10.2,z-6.4,0x2c3238,0,-.75);
  for(const s of[-1,1]){ldB(L,11,4.6,7,x+s*13.5,h+2.3,z,0xf0ede6);const e=new THREE.SphereGeometry(3,12,6,0,Math.PI*2,0,Math.PI/2);e.translate(x+s*16,h+4.6,z);L.push(ldPaint(e,0xcfd6d2));ldSol(x+s*13.5-5.5,x+s*13.5+5.5,z-3.5,z+3.5,h+8)}ldB(L,8,.5,5,x,h+.25,z-11,0xd9d4c4);ldSol(x-9,x+9,z-9,z+9,h+14.5)}
 // scrub
 const bc=[0x5f6f3a,0x74803f,0x8a8a4a,0x4f6b35,0x9a8b55];for(let k=0;k<150;k++){const x=-325+ldR()*535,z=HALF+52+ldR()*172,h=ldHt(x,z);if(h<2||ldNear(x,z)[0]<7||(Math.abs(z-ldSZ)<7&&x>-60&&x<80))continue;let ok=true;for(const p of ldPl)if(Math.hypot(x-p.x,z-p.z)<p.r+1)ok=false;if(!ok)continue;
  const s=1.1+ldR()*1.9,g=new THREE.IcosahedronGeometry(1,0);g.scale(s,s*.7,s);g.translate(x,h+s*.3,z);L.push(ldPaint(g,bc[k%5]))}
 // the sign
 const SG=[],word='BLOCKCITY';for(let i=0;i<word.length;i++){const X=70-i*13-(i>4?6:0),cx=X-5,th=ldHt(cx,ldSZ),top=th+17;ldGlyph(SG,word[i],X,top,ldSZ,-1,0,2,1.4,0xffffff);for(const s of[-3,3]){ldB(L,.5,17,.5,cx+s,th+8.5,ldSZ+1.1,0x8a8d90);ldB(L,.4,.4,5,cx+s,th+9,ldSZ+3.4,0x8a8d90,0,.7)}
  ldB(ldE,1.2,.5,.8,cx,ldHt(cx,ldSZ-4)+.5,ldSZ-4,0xfff1c9);ldSol(X-10,X,ldSZ-.7,ldSZ+.7,top)}
 var ldSign=new THREE.Mesh(U.mergeBufferGeometries(SG),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.75,emissive:0xffffff,emissiveIntensity:0}));ldSign.castShadow=true;scene.add(ldSign);
 // drive-in (flat south-east corner)
 {const x=258,z=HALF+50;ldB(L,66,.08,64,x,.03,z+33,0x6b665c);for(const s of[-1,1])ldB(L,.8,19,.8,x+s*13,9.5,z+.6,0x55585d);ldB(L,31,15,.6,x,11.5,z+.3,0x3a3d42);ldSol(x-15.5,x+15.5,z,z+1,19);
  ldText(ldE,'BLOCK',x+8.2,17.6,z-.05,-1,0,.55,.12,0xff5fa8);ldText(ldE,'DRIVE-IN',x+13.1,12.4,z-.05,-1,0,.55,.12,0x5fe0ff);
  for(let r=0;r<4;r++)for(let k=0;k<8;k++){ldB(L,.15,1.3,.15,x-26.2+k*7.5,.65,z+16+r*12,0x8a8d90);ldB(L,.4,.3,.3,x-26.2+k*7.5,1.4,z+16+r*12,0x2c2e31)}
  ldB(L,5,3.5,4,x,1.75,z+60,0xd9c2a5);ldB(L,5.8,.3,4.8,x,3.6,z+60,0xa5482f);ldSol(x-2.5,x+2.5,z+58,z+62,3.7);
  var ldScreen=new THREE.Mesh(new THREE.PlaneGeometry(29,13),new THREE.MeshBasicMaterial({color:0xdddddd,toneMapped:false}));ldScreen.position.set(x,11.5,z+.62);scene.add(ldScreen)}
 for(let k=0;k<7;k++)ldPalm(L,226+k*11,0,HALF+47+(k%2)*3,1.25+ldR()*.3,ldR()*6);
 ldMesh(L,ldMat,true)}
// ================= DISTRICT DRESSING =================
{const L=ldD,BX=roadCenter(8),WOOD=0x8a6b45;
 for(let j=0;j<N;j++){const z0=roadCenter(j)+9,z1=roadCenter(j+1)-9;ldB(L,1.5,.26,z1-z0,BX,.13,(z0+z1)/2,0xb8b3a6);for(let k=0;k<3;k++){const z=z0+6+k*12;ldPalm(L,BX,.2,z,1.05+ldR()*.25,ldR()*6);solids.push({minX:BX-.35,maxX:BX+.35,minZ:z-.35,maxZ:z+.35,h:3})}}
 const st=new THREE.Shape();for(let k=0;k<10;k++){const a=k*Math.PI/5,r=k%2?.34:.85,x=Math.sin(a)*r,y=Math.cos(a)*r;if(k)st.lineTo(x,y);else st.moveTo(x,y)}const sg=new THREE.ShapeGeometry(st);sg.rotateX(-Math.PI/2);
 for(let j=3;j<=7;j++){const cz=roadCenter(j)+CELL/2;ldB(L,2.3,.03,38,BX+8.3,.315,cz,0x2a2a2e);for(let k=0;k<12;k++){const g=sg.clone();g.translate(BX+8.3,.34,cz-17.6+k*3.2);L.push(ldPaint(g,k%3?0xe89aa6:0xd9b45a))}}
 // marina
 ldB(L,59.5,.3,4.2,HALF+66.5,.45,120,WOOD);ldB(L,4.2,.3,4.2,HALF+39,.33,120,WOOD,0,0,.07);for(let x=HALF+42;x<HALF+97;x+=9)for(const s of[-1,1])ldCy(L,.25,.25,2.6,6,x,.1,120+s*2.2,0x5d4630);
 for(const fx of[HALF+58,HALF+72,HALF+86])for(const s of[-1,1])ldB(L,2.2,.25,13,fx,.42,120+s*8.5,WOOD);
 for(const y of[[HALF+65,1],[HALF+79,1],[HALF+65,-1],[HALF+79,-1],[HALF+92.5,1]]){const x=y[0],d=y[1],z=120+d*9.5,HU=0xf6f6f2;ldB(L,3.8,1.5,10,x,.75,z,HU);ldB(L,2.69,1.5,2.69,x,.75,z+d*5,HU,Math.PI/4);ldB(L,3.86,.25,10.05,x,.5,z,0x1d3557);ldB(L,3.5,.1,9.6,x,1.52,z,0xc9a36b);
  ldB(L,3,1.2,4.6,x,2.15,z-d*.6,0xffffff);ldB(L,3.06,.45,4.2,x,2.3,z-d*.6,0x1b2b3c);ldB(L,2.4,.8,2.4,x,3.15,z-d*1.2,0xffffff);ldCy(L,.06,.06,3,5,x,4.9,z-d*1.2,0xb9bdc2)}
 for(let x=HALF+44;x<HALF+97;x+=13){ldB(L,.15,2.6,.15,x,1.9,121.9,0x55585d);ldB(ldE,.4,.3,.4,x,3.3,121.9,0xffe9b0)}
 // ferris wheel
 const FX=HALF+22,FZ=-66,FH=16.5;ldB(L,14,.5,8,FX,.25,FZ,0x7a7c80);for(const s of[-1,1])for(const q of[-1,1])ldB(L,.5,17.9,.5,FX+s*1.9,8.25,FZ+q*3.5,0xe9e9ee,0,-q*.401);ldCy(L,.8,.8,4.6,10,FX,FH,FZ,0xdd3344,0,Math.PI/2);ldB(L,3,3,3,FX-4,2,FZ+8,0xf7b7c5);ldB(L,3.6,.3,3.6,FX-4,3.6,FZ+8,0x8fd8e8);ldSol(FX-7,FX+7,FZ-4,FZ+4,1);
 const wl=[],we=[],gc=[0xff5fa8,0x5fe0ff,0xffd23f,0x80ff9a,0xc9b6f2,0xff8a4c];for(const s of[-1,1]){const t=new THREE.TorusGeometry(14,.2,6,44);t.rotateY(Math.PI/2);t.translate(s*1.2,0,0);wl.push(ldPaint(t,0xf2f2f5));for(let k=0;k<12;k++){const g=new THREE.BoxGeometry(.16,14,.16);g.translate(0,7,0);g.rotateX(k*Math.PI/6);g.translate(s*1.2,0,0);wl.push(ldPaint(g,0xe2e4ea))}}
 for(let k=0;k<12;k++){const a=k*Math.PI/6,y=Math.cos(a)*14,z=Math.sin(a)*14;const g=new THREE.SphereGeometry(1.05,8,6);g.translate(0,y,z);wl.push(ldPaint(g,gc[k%6]));ldB(wl,2.4,.14,.14,0,y,z,0xe2e4ea);for(const s of[-1,1])for(const o of[0,.26]){const b=a+o;ldB(we,.3,.3,.3,s*1.45,Math.cos(b)*14,Math.sin(b)*14,gc[(k+(o?3:0))%6])}}
 var ldWheel=new THREE.Mesh(U.mergeBufferGeometries(wl),ldMat);ldWheel.position.set(FX,FH,FZ);ldWheel.castShadow=true;scene.add(ldWheel);ldWheel.add(new THREE.Mesh(U.mergeBufferGeometries(we),ldEm));
 // hotel blade signs on the beach road
 const names=['OCEAN','PALMS','DECO','TIDES','CORAL','WAVE','SANDS','STAR','MIAMI'],pc=[0xf7b7c5,0xa8e6cf,0x8fd8e8,0xffd3a5,0xc9b6f2],nc=[0xff5fa8,0x5fe0ff,0xffd23f,0x80ff9a];
 const cand=solids.filter(s=>s.h>9&&s.h<36&&s.maxX-s.minX>9&&s.minX>roadCenter(10)&&s.maxX<roadCenter(11)).sort((a,b)=>a.minZ-b.minZ);let ni=0;
 for(let k=0;k<cand.length&&ni<names.length;k+=2){const s=cand[k],zc=(s.minZ+s.maxZ)/2,top=s.h+2.6,nm=names[ni];ldB(L,1,nm.length*1.55+1.4,1.6,s.maxX+.5,top-(nm.length*1.55+1.4)/2,zc,pc[ni%5]);ldB(L,1.3,.4,2,s.maxX+.5,top+.2,zc,0xffffff);
  for(let i=0;i<nm.length;i++)ldGlyph(ldE,nm[i],s.maxX+1.03,top-.6-i*1.55,zc+.5,0,-1,.2,.08,nc[ni%4]);ldB(ldE,.1,.12,1.7,s.maxX+1.03,top-.25,zc,nc[(ni+1)%4]);ni++}
 ldMesh(L,ldMat,true);ldMesh(ldE,ldEm,false)}
// ================= collision + bounds =================
{const c0=collide;collide=function(p,r,maxH){const ox=p.x,oz=p.z,res=c0(p,r,maxH);if(res)return res;const L=HALF+50;
 if(oz<-L&&Math.abs(ox)<=186){p.z=Math.max(oz,ldZ1-14);p.x=Math.max(-185,Math.min(185,ox))}
 else if(oz>L&&ox>-332&&ox<302){p.z=Math.min(oz,HALF+208);p.x=Math.max(-331,Math.min(301,ox))}
 else if(ox>L-.01&&ox<HALF+96.6&&Math.abs(oz-120)<2.3)p.x=Math.min(ox,HALF+96.2);
 if(p.x>HALF+47&&p.x<HALF+97&&Math.abs(p.z-120)<2.6)p.z=Math.max(118.2,Math.min(121.8,p.z));return res}}
if(typeof fxBounds==='function'){const b0=fxBounds;fxBounds=function(c,m){if(ldLandOK(m.position))return;b0(c,m)}}
function ldLate(){if(typeof fxChOpen!=='undefined'&&fxChOpen&&!driving){const f=ldFloor(pos.x,pos.z);if(f>0&&pos.y-f<10){fxChOpen=false;if(typeof fxChute!=='undefined')fxChute.visible=false}}}
// ================= per-frame =================
function ldTick(dt){if(!ldLateOn){ldLateOn=true;MODS.push(ldLate)}
 const night=1-Math.max(0,Math.min(1,Math.sin(dayT*Math.PI*2)*3+.5));ldEm.color.setScalar(.4+night*1.5);ldSignMat.emissiveIntensity=.12+night*.35;ldSign.material.emissiveIntensity=.3+night*.3;
 for(const b of ldBeams){b.g.visible=night>.4;if(b.g.visible)b.g.rotation.y=b.base+Math.sin(T*.35+b.ph)*1.1}
 ldRadar.rotation.y+=dt*.8;ldFlag.rotation.y=.5+Math.sin(T*2.2)*.3;for(let i=0;i<ldFlags.length;i++)ldFlags[i].rotation.y=.5+Math.sin(T*2.2+i*1.3)*.3;ldWheel.rotation.x+=dt*.12;
 const fl=.5+.5*Math.sin(T*7.3)*Math.sin(T*3.1);ldScreen.material.color.setRGB(.35+night*(.5+fl*.9),.38+night*(.6+fl*.7),.42+night*(.9+fl*.5));
 const gd=Math.hypot(pos.x-ldGX,pos.z-ldZ0);ldArm.rotation.z+=((gd<26?-1.3:0)-ldArm.rotation.z)*Math.min(1,dt*2.5);
 // restricted area
 if(state==='play'&&pos.x>ldX0&&pos.x<ldX1&&pos.z<ldZ0&&pos.z>ldZ1&&pos.y<70){if(ldAlert<=0){toast('RESTRICTED AREA!');beep(220,.4,.2)}ldAlert=25;if(wantedScore<10)wantedScore=10}else if(ldAlert>0)ldAlert-=dt;
 // tanks
 ldCan-=dt;const c=driving;if(c&&c.ldTank)$('wpn').innerHTML='<div>CANNON<br><small>'+(ldCan>0?'...':'READY')+'</small></div>';for(const t of ldTanks){const tu=t.m.userData.tur,da=(((t===c?camYaw-t.m.rotation.y:0)-tu.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;tu.rotation.y+=da*Math.min(1,dt*4)}
 if(c&&c.ldTank&&!c.dead){const p=c.m.position,h0=c.hp;
  for(const o of cars.slice()){if(o===c||o.vhT||o.custom||o.ldTank)continue;if(o.m.position.distanceTo(p)<4.5){if(!o.dead)blowParked(o);const i=cars.indexOf(o);if(i>=0)cars.splice(i,1);o.m.scale.y*=.3;ldDebris.push({m:o.m,t:40})}}
  for(const t of traffic)if(t.m.position.distanceTo(p)<4.6){if(!t.dead)blowCar(t);t.m.position.y=-60}
  for(const pc of police)if(!pc.dead&&!pc.gone&&pc.m.position.distanceTo(p)<4.6){blowPolice(pc);pc.m.scale.y=.3}
  if(c.hp<h0)c.hp=h0}
 for(let i=ldDebris.length-1;i>=0;i--){const d=ldDebris[i];d.t-=dt;if(d.t<=0&&d.m.position.distanceTo(pos)>60){scene.remove(d.m);ldDebris.splice(i,1)}}
 // ground height on the hills and the marina dock
 if(!driving){const f=ldFloor(pos.x,pos.z);if(f>0){const ty=Math.max(.3,f+.04);if(vel.y<=30*dt+.001&&(pos.y<=ty+.12||(onGround&&pos.y<=ty+.8))){pos.y=ty;vel.y=state==='play'?30*dt:0;onGround=true}}}
 for(const o of cars){if(o.custom||o.vhT)continue;const m=o.m,f=ldFloor(m.position.x,m.position.z);
  if(f>0){m.position.y=f;if(!m.userData.ldUp){m.userData.ldUp=1;if(!o.vhBike)m.rotation.order='YXZ'}
   if(o===driving&&!o.vhBike){const a=m.rotation.y,ax=-Math.sin(a)*2.2,az=-Math.cos(a)*2.2,hf=Math.max(0,ldFloor(m.position.x+ax,m.position.z+az)),hb=Math.max(0,ldFloor(m.position.x-ax,m.position.z-az));m.rotation.x+=(Math.atan2(hf-hb,4.4)-m.rotation.x)*Math.min(1,dt*8)}}
  else if(m.userData.ldUp){m.position.y=0;if(!o.vhBike)m.rotation.x=0;m.userData.ldUp=0}}
 for(const pc of police){const m=pc.m,f=ldFloor(m.position.x,m.position.z);if(f>0){m.position.y=f;m.userData.ldUp=1}else if(m.userData.ldUp){m.position.y=0;m.userData.ldUp=0}}
 for(const s of shooters){const g=s.g,f=ldFloor(g.position.x,g.position.z);if(f>0){g.position.y=Math.max(.3,f+.04);g.userData.ldUp=1}else if(g.userData.ldUp){g.position.y=.3;g.userData.ldUp=0}}}
MODS.push(ldTick);
