// ---------- airport + flyable planes (module: airport, prefix ap) ----------
let apInvert=false; // false = GTA style: pull the stick DOWN to climb, push UP to dive. Set true to flip.
const apAX=-HALF,apRX=apAX-190,apTX=apAX-140,apPlanes=[];
function apRGB(g,r,gg,b){const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=r;a[i*3+1]=gg;a[i*3+2]=b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
function apCol(g,hex){const c=new THREE.Color(hex);return apRGB(g,c.r,c.g,c.b)}
const apB=(w,h,d,x,y,z,c)=>apCol(bxg(w,h,d,x,y,z),c);
const apCyl=(rt,rb,h,n,x,y,z,c,rx,ry,rz)=>apCol(gT(new THREE.CylinderGeometry(rt,rb,h,n),x,y,z,rx,ry,rz),c);
const apBodyMat=new THREE.MeshStandardMaterial({vertexColors:true,metalness:.35,roughness:.36,side:THREE.DoubleSide});
const apNavMat=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}),apStrobeMat=new THREE.MeshBasicMaterial({color:new THREE.Color(4,4,4),toneMapped:false}),apStrobeGeo=new THREE.BoxGeometry(.3,.2,.3);
const apLightMat=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}),apGlassMat=new THREE.MeshStandardMaterial({color:0x2c5374,metalness:.9,roughness:.08,emissive:0xffd9a0,emissiveIntensity:0});
let apBeacon=null,apCone=null,apSignMat=null;
// ----- static airport -----
{const A=[],M=[],S=[],G=[],L=[],F=[],W=0xf2f2f2,Y=0xf2c318,X=apAX;
 const lt=(x,y,z,r,g,b,s)=>L.push(apRGB(bxg(s||.5,.35,s||.5,x,y,z),r,g,b));
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(270,1100),grass.material);gr.rotation.x=-Math.PI/2;gr.position.set(-(HALF+335),-0.02,0);gr.receiveShadow=true;scene.add(gr);
 // pavement
 A.push(apB(24,.02,300,apRX,.03,0,0x26282c),apB(12,.02,300,apTX,.03,0,0x3a3d42),apB(64,.02,240,X-102,.03,0,0x54585e),apB(84,.02,32,X-96,.03,135,0x54585e),apB(70,.02,14,X-35,.03,81,0x2f3136),apB(24,.02,144,X-26,.03,2,0x34363b),apB(8,.02,100,X-36,.03,-20,0x9a9da1));
 for(const z of[-140,0,140])A.push(apB(32,.02,12,apRX+28,.03,z,0x3a3d42));
 // paint
 for(let z=-120;z<=120;z+=20)M.push(apB(.7,.02,10,apRX,.055,z,W));
 for(const s of[-1,1]){M.push(apB(.5,.02,296,apRX+s*11.2,.055,0,W),apB(3,.02,18,apRX+s*5.5,.055,95,W),apB(3,.02,18,apRX+s*5.5,.055,-95,W));for(let i=0;i<8;i++)M.push(apB(1.7,.02,12,apRX-9.8+i*2.8,.055,s*141,W))}
 const dig=(ch,cx,cz,dir)=>{const Wd=4,H=9,t=.9,seg={a:[0,H/2,Wd+t,t],d:[0,-H/2,Wd+t,t],g:[0,0,Wd+t,t],f:[-Wd/2,H/4,t,H/2],b:[Wd/2,H/4,t,H/2],e:[-Wd/2,-H/4,t,H/2],c:[Wd/2,-H/4,t,H/2]},mp={'1':'bc','3':'abcdg','6':'acdefg','8':'abcdefg'};for(const k of mp[ch]){const s=seg[k];M.push(apB(s[2],.02,s[3],cx+dir*s[0],.055,cz-dir*s[1],W))}};
 dig('3',apRX-3.6,122,1);dig('6',apRX+3.6,122,1);dig('1',apRX+3.6,-122,-1);dig('8',apRX-3.6,-122,-1);
 M.push(apB(.35,.02,300,apTX,.055,0,Y));for(const z of[-140,0,140])M.push(apB(32,.02,.35,apRX+28,.055,z,Y));
 for(const z of[-100,-45,30,62,95])M.push(apB(30,.02,.35,X-119,.055,z,Y),apB(.35,.02,6,X-104,.055,z,Y));
 for(const hx of[-124,-96,-68])M.push(apB(.35,.02,30,X+hx,.055,105,Y));
 for(let x=-66;x<-2;x+=8)M.push(apB(4,.02,.3,X+x,.055,81,Y));for(let z=-66;z<=70;z+=4)M.push(apB(5,.02,.2,X-17,.055,z,W));
 // runway, taxi and approach lights
 for(let z=-150;z<=150;z+=15){lt(apRX-12.6,.2,z,3,2.9,2.5);lt(apRX+12.6,.2,z,3,2.9,2.5);lt(apTX-6.6,.2,z,.25,.5,3,.4);lt(apTX+6.6,.2,z,.25,.5,3,.4)}
 for(let i=0;i<9;i++){lt(apRX-10+i*2.5,.2,151.5,.2,3,.5);lt(apRX-10+i*2.5,.2,-151.5,3,.15,.1)}
 for(const s of[-1,1])for(let k=0;k<4;k++)for(const dx of[-3,0,3])lt(apRX+dx,.3,s*(156+k*5.4),3,2.8,2.2,.6);
 // terminal
 S.push(apB(24,12,100,X-52,6,-20,0xa6adb5),apB(27,.8,104,X-52,12.4,-20,0x676c73),apB(6,3.6,14,X-37,1.8,-20,0xc9ced4),apB(8,.4,18,X-37,3.8,-20,0x676c73),apB(14,2.6,3,X-71,5.2,-12,0xb7bec6),apB(1,3.9,1,X-77,1.95,-12,0x7c838b));
 for(let z=-66;z<=26;z+=6)S.push(apB(.5,9,.5,X-64.3,5.5,z,0x3d434a));S.push(apB(.5,.5,93,X-64.3,10,-20,0x3d434a),apB(.5,.5,93,X-64.3,1,-20,0x3d434a));
 G.push(bxg(.3,9,92,X-64.15,5.5,-20),bxg(.3,6,60,X-39.85,7.5,-20),bxg(5.6,2.6,.3,X-37,1.9,-13),bxg(5.6,2.6,.3,X-37,1.9,-27));
 solids.push({minX:X-64,maxX:X-40,minZ:-70,maxZ:30,h:12.8});
 // control tower
 S.push(apB(7,30,7,X-52,15,52,0xa6adb5),apCyl(6.6,6.6,.8,8,X-52,35.6,52,0x555b63),apCyl(4.6,3.6,1.2,8,X-52,30.4,52,0x8a9099),apCyl(.12,.12,5,6,X-52,38.5,52,0x444444));
 G.push(gT(new THREE.CylinderGeometry(6.1,4.7,4.4,8),X-52,33.1,52));lt(X-52,41.1,52,3,.15,.1,.5);
 solids.push({minX:X-55.5,maxX:X-48.5,minZ:48.5,maxZ:55.5,h:36});
 // hangars
 [-124,-96,-68].forEach((hx,i)=>{const c=[0xe63946,0x1d70b8,0xf4a261][i],x=X+hx;S.push(apB(26,11,.6,x,5.5,150,0x717d89),apB(.6,11,30,x-13,5.5,135,0x717d89),apB(.6,11,30,x+13,5.5,135,0x717d89),apB(27.4,.7,31.2,x,11.3,135,0x5d6772),apB(26,2,.7,x,10,120.1,0x7b8692),apB(26,.5,.75,x,9.4,120.1,c));
  solids.push({minX:x-13,maxX:x+13,minZ:149.6,maxZ:150.4,h:11.6},{minX:x-13.4,maxX:x-12.6,minZ:120,maxZ:150,h:11.6},{minX:x+12.6,maxX:x+13.4,minZ:120,maxZ:150,h:11.6});lt(x,9.6,119.6,3,2.8,2.2,.7)});
 // flood masts, fuel trucks, baggage carts, windsock, gate
 for(const z of[-112,-78,40,112]){S.push(apCyl(.18,.28,16,6,X-71,8,z,0x555b63),apB(.6,.5,2.6,X-71.6,16,z,0x333333));lt(X-71.9,15.7,z-.8,3,2.9,2.4,.6);lt(X-71.9,15.7,z+.8,3,2.9,2.4,.6);solids.push({minX:X-71.3,maxX:X-70.7,minZ:z-.3,maxZ:z+.3,h:16})}
 for(const t of[[-80,58],[-84,102]]){const x=X+t[0],z=t[1];S.push(apB(2.4,2.2,2.2,x,1.5,z-3.4,0xf2c318),apCyl(1.25,1.25,5.2,12,x,1.9,z+.6,0xe9ecef,Math.PI/2),apB(2.3,.3,7.6,x,.55,z,0x2a2a2a),apB(2.1,.9,.1,x,1.9,z-4.52,0x16222e));for(const wz of[-3.2,1.4,3])for(const wx of[-1.15,1.15])S.push(apCyl(.5,.5,.4,10,x+wx,.5,z+wz,0x111111,0,0,Math.PI/2));solids.push({minX:x-1.3,maxX:x+1.3,minZ:z-4.6,maxZ:z+3.3,h:3})}
 for(let i=0;i<6;i++){const x=X-76-(i%2)*3,z=-58+i*3.4-(i>2?20:0);S.push(apB(1.6,.25,2.6,x,.6,z,0x39424c),apB(1.4,.9,1.6,x,1.2,z,[0x8a5a2b,0x2a6f97,0x444444][i%3]));for(const wx of[-.8,.8])for(const wz of[-.9,.9])S.push(apCyl(.25,.25,.2,8,x+wx,.25,z+wz,0x111111,0,0,Math.PI/2))}
 S.push(apCyl(.1,.14,7,6,apRX+19,3.5,20,0xdddddd),apCol(gT(new THREE.ConeGeometry(.55,2.8,10,1,true),apRX+19,6.8,21.5,-Math.PI/2),0xff6a00));
 S.push(apB(.7,4,.7,X-12,2,71.5,0x39424c),apB(.7,4,.7,X-12,2,90.5,0x39424c),apB(.3,.3,9,X-12,3.6,76.4,0xe63946,),apB(3,2.6,3,X-9,1.3,68.5,0xcfd4da),apB(3.4,.3,3.4,X-9,2.75,68.5,0x555b63));
 // fence
 const x0=X-245,x1=X-12,z0=-175,z1=175;const run=(ax,a,b,c)=>{const len=b-a,mid=(a+b)/2;if(ax==='x'){S.push(apB(len,.12,.12,mid,2.9,c,0x7d858e));F.push(bxg(len,2.8,.04,mid,1.4,c));for(let v=a;v<=b+.01;v+=8)S.push(apB(.16,3,.16,v,1.5,c,0x7d858e));solids.push({minX:a,maxX:b,minZ:c-.3,maxZ:c+.3,h:3})}else{S.push(apB(.12,.12,len,c,2.9,mid,0x7d858e));F.push(bxg(.04,2.8,len,c,1.4,mid));for(let v=a;v<=b+.01;v+=8)S.push(apB(.16,3,.16,c,1.5,v,0x7d858e));solids.push({minX:c-.3,maxX:c+.3,minZ:a,maxZ:b,h:3})}};
 run('x',x0,x1,z0);run('x',x0,x1,z1);run('z',z0,z1,x0);run('z',z0,72,x1);run('z',90,z1,x1);
 const mk=(arr,mat,sh)=>{const m=new THREE.Mesh(U.mergeBufferGeometries(arr),mat);m.castShadow=!!sh;m.receiveShadow=true;scene.add(m);return m};
 mk(A,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92}));mk(M,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
 mk(S,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7,metalness:.1}),1);mk(G,apGlassMat);mk(L,apLightMat).receiveShadow=false;
 mk(F,new THREE.MeshBasicMaterial({color:0xaab3bd,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide})).receiveShadow=false;
 // terminal sign
 const cv=document.createElement('canvas');cv.width=512;cv.height=64;const c2=cv.getContext('2d');c2.fillStyle='#10202e';c2.fillRect(0,0,512,64);c2.fillStyle='#bfe6ff';c2.font='bold 44px sans-serif';c2.textAlign='center';c2.textBaseline='middle';c2.fillText('BLOCK CITY INTL',256,34);
 const tx=new THREE.CanvasTexture(cv);tx.encoding=THREE.sRGBEncoding;apSignMat=new THREE.MeshStandardMaterial({map:tx,emissive:0xffffff,emissiveMap:tx,emissiveIntensity:.3});
 const s1=new THREE.Mesh(new THREE.PlaneGeometry(44,5.5),apSignMat);s1.rotation.y=Math.PI/2;s1.position.set(X-39.7,9.2,-20);scene.add(s1);const s2=s1.clone();s2.rotation.y=-Math.PI/2;s2.position.set(X-64.4,10.9,-20);s2.scale.set(.6,.35,1);scene.add(s2);
 // rotating beacon
 apBeacon=new THREE.Group();apBeacon.position.set(X-52,36.6,52);const bb=new THREE.Mesh(new THREE.BoxGeometry(.9,.7,2.2),new THREE.MeshBasicMaterial({color:new THREE.Color(.6,3,1),toneMapped:false}));apBeacon.add(bb);
 const cg=new THREE.ConeGeometry(5,60,10,1,true);cg.translate(0,-30,0);cg.rotateX(-Math.PI/2);apCone=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({color:0xcfffe0,transparent:true,opacity:.07,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));apCone.rotation.x=.06;apBeacon.add(apCone);scene.add(apBeacon)}
// ----- aircraft models -----
const apT={prop:{len:8.5,r:.72,cy:1.5,wy:2.4,vs:17,vmax:54,acc:17,pr:.72,maxRoll:.95,turn:1.0,camD:17,camH:2.6,tip:5.5,nose:4,gearUp:0},
 jet:{len:15,r:1,cy:1.9,wy:1.5,vs:26,vmax:90,acc:26,pr:.62,maxRoll:.95,turn:.85,camD:27,camH:3.6,tip:7,nose:7.3,gearUp:1},
 liner:{len:38,r:2,cy:4.2,wy:3.6,vs:30,vmax:78,acc:14,pr:.42,maxRoll:.6,turn:.5,camD:62,camH:9,tip:16.5,nose:18.6,gearUp:1}};
function apFus(len,r,cy,col,prof,p0,pl,f0,f1,k){const pts=[];if(f0===undefined){for(const p of prof)pts.push(new THREE.Vector2(Math.max(.002,p[1]*r),p[0]*len))}
 else for(let i=0;i<=5;i++){const f=f0+(f1-f0)*i/5;let rr=0;for(let j=1;j<prof.length;j++)if(f<=prof[j][0]){const a=prof[j-1],b=prof[j];rr=a[1]+(b[1]-a[1])*(f-a[0])/(b[0]-a[0]);break}pts.push(new THREE.Vector2(rr*r*(k||1.015),f*len))}
 return apCol(gT(p0===undefined?new THREE.LatheGeometry(pts,16):new THREE.LatheGeometry(pts,8,p0,pl),0,cy,0,-Math.PI/2),col)}
function apWing(half,rootC,tipC,sweep,th,y,zLE,col,dih){const o=[];for(const s of[-1,1]){const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(s*half,sweep);sh.lineTo(s*half,sweep+tipC);sh.lineTo(0,rootC);const g=new THREE.ExtrudeGeometry(sh,{depth:th,bevelEnabled:false});g.rotateX(Math.PI/2);if(dih)g.rotateZ(s*dih);g.translate(0,y,zLE);o.push(apCol(g,col))}return o}
function apFin(rootC,tipC,sweep,h,th,y,z0,col){const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(sweep,h);sh.lineTo(sweep+tipC,h);sh.lineTo(rootC,0);const g=new THREE.ExtrudeGeometry(sh,{depth:th,bevelEnabled:false});g.translate(0,0,-th/2);g.rotateY(-Math.PI/2);g.translate(0,y,z0);return apCol(g,col)}
const apPropGeo=(()=>{const a=[];for(let k=0;k<3;k++){const b=new THREE.BoxGeometry(.2,1,.05).toNonIndexed();b.translate(0,.55,0);b.rotateZ(k*Math.PI*2/3);a.push(b)}a.push(gT(new THREE.ConeGeometry(.3,.7,10),0,0,-.2,-Math.PI/2));return U.mergeBufferGeometries(a)})(),apPropMat=new THREE.MeshStandardMaterial({color:0x1c1c1f,roughness:.5,metalness:.4});
const apGeoCache={};
function apGeo(type,acc){const key=type+acc;if(apGeoCache[key])return apGeoCache[key];const B=[],GR=[],N=[],Wh=0xf5f6f7,Dk=0x15202b,Gy=0x8b9198,Tr=0x111111,PI=Math.PI;let props=[];
 const nav=(x,y,z,r,g,b)=>N.push(apRGB(bxg(.28,.2,.28,x,y,z),r,g,b)),wheel=(arr,r,w,x,z)=>arr.push(apCyl(r,r,w,10,x,r,z,Tr,0,0,PI/2));
 if(type==='prop'){const pf=[[-.5,.12],[-.4,.3],[-.2,.62],[0,.95],[.2,1],[.38,.94],[.46,.74],[.5,.5]];
  B.push(apFus(7.6,.72,1.5,Wh,pf),apFus(7.6,.72,1.5,Dk,pf,-1.25,2.5,.08,.33,1.03),apCyl(.36,.36,.1,10,0,1.5,-3.82,Dk,PI/2));
  B.push(...apWing(5.5,1.6,1.25,.12,.15,2.42,-1.55,Wh,.025),apB(.5,.17,1.3,-5.3,2.5,-.8,acc),apB(.5,.17,1.3,5.3,2.5,-.8,acc),...apWing(1.9,.95,.65,.3,.08,1.78,2.75,Wh),apFin(1.35,.6,.95,1.75,.09,1.85,2.3,acc));
  for(const s of[-1,1]){B.push(apCol(gT(new THREE.BoxGeometry(.07,2.25,.14),s*1.62,1.72,-.9,0,0,-s*.98),Gy),apB(.03,.17,3.2,s*.722,1.42,-.9,acc),apCol(gT(new THREE.BoxGeometry(.1,1.15,.3),s*.98,.72,-.25,0,0,s*.75),Wh));wheel(B,.28,.16,s*1.36,-.25)}
  B.push(apB(.08,.85,.08,0,.62,-2.7,Gy));wheel(B,.25,.14,0,-2.7);props=[[0,1.5,-3.95,1]];nav(-5.5,2.5,-.9,3,.1,.1);nav(5.5,2.5,-.9,.1,3,.3);nav(0,2.0,3.75,3,3,3)}
 else if(type==='jet'){const pf=[[-.5,.1],[-.42,.38],[-.3,.75],[-.18,.97],[.2,1],[.33,.9],[.42,.62],[.47,.35],[.5,.03]];
  B.push(apFus(15,1,1.9,Wh,pf),apFus(15,1,1.9,Dk,pf,-1.05,2.1,.355,.425,1.02));
  B.push(...apWing(7,3.2,1.1,3,.2,1.45,-1.7,Wh,.06),apFin(3.3,1.6,2.5,3.1,.16,2.55,3.9,acc),...apWing(2.9,1.5,.8,.9,.1,5.66,6.3,Wh));
  for(const s of[-1,1]){B.push(apB(.09,1,.95,s*6.98,2.35,1.85,acc),apCyl(.42,.54,2.7,12,s*1.6,2.4,3.5,acc,PI/2),apCyl(.44,.44,.06,12,s*1.6,2.4,2.13,Tr,PI/2),apCyl(.34,.34,.06,12,s*1.6,2.4,4.87,Tr,PI/2),apB(.6,.12,1.5,s*1.15,2.35,3.6,Wh),apB(.04,.15,8.6,s*.995,1.75,-.6,acc));
   for(let z=-3.6;z<=1.7;z+=1.05)B.push(apB(.08,.34,.5,s*.965,2.2,z,Dk));GR.push(apB(.12,1,.12,s*1.35,.82,.5,Gy));wheel(GR,.34,.22,s*1.35,.5)}
  GR.push(apB(.1,1.05,.1,0,.8,-5.3,Gy));wheel(GR,.28,.3,0,-5.3);nav(-7,2,1.9,3,.1,.1);nav(7,2,1.9,.1,3,.3);nav(0,2.3,7.4,3,3,3)}
 else{const pf=[[-.5,.06],[-.45,.3],[-.36,.66],[-.27,.92],[-.2,1],[.36,1],[.42,.9],[.46,.68],[.485,.42],[.5,.04]],Wg=0xe6e9ec;
  B.push(apFus(38,2,4.2,Wh,pf),apFus(38,2,4.2,Dk,pf,-.8,1.6,.437,.468,1.02),apFus(38,2,4.2,acc,pf,PI-.7,1.4,-.3,.4,1.006));
  B.push(...apWing(16.5,8.5,2.2,9,.55,3.4,-6.6,Wg,.07),apFin(7,2.6,6,7.6,.4,5.7,10.2,acc),...apWing(6.2,3.6,1.4,3.4,.3,4.9,13,Wg,.05));
  for(const s of[-1,1]){B.push(apB(.14,1.8,1.7,s*16.42,5.35,4.2,acc),apCyl(.85,1.22,4.4,14,s*5.6,2.05,-3.4,Wg,PI/2),apCyl(1.24,1.24,.5,14,s*5.6,2.05,-5.4,acc,PI/2),apCyl(1.02,1.02,.06,14,s*5.6,2.05,-5.68,Tr,PI/2),apCyl(.6,.6,.06,12,s*5.6,2.05,-1.18,Tr,PI/2),apB(.3,.7,2.8,s*5.6,3.1,-2.9,Wg),apB(.05,.3,27,s*1.995,4.05,-1,acc),apB(.07,1.9,1,s*1.95,4.5,-13.2,0xcfd4da),apB(.07,1.9,1,s*1.95,4.5,10.4,0xcfd4da));
   for(let z=-11.8;z<=9.2;z+=1.05)B.push(apB(.08,.42,.36,s*1.95,4.75,z,Dk));
   GR.push(apB(.3,2.3,.3,s*3,1.75,1.2,Gy));for(const dx of[-.36,.36])for(const dz of[-.75,.75])GR.push(apCyl(.62,.62,.4,10,s*3+dx,.62,1.2+dz,Tr,0,0,PI/2));GR.push(apCyl(.55,.55,.3,10,s*.3,.55,-14.5,Tr,0,0,PI/2))}
  GR.push(apB(.25,1.8,.25,0,1.4,-14.5,Gy));nav(-16.5,4.6,3.4,3,.1,.1);nav(16.5,4.6,3.4,.1,3,.3);nav(0,4.5,18.6,3,3,3)}
 const o={body:U.mergeBufferGeometries(B),gear:GR.length?U.mergeBufferGeometries(GR):null,lights:U.mergeBufferGeometries(N),props};apGeoCache[key]=o;return o}
function apPath(zP,T){const v=T.vs*1.5,c=T.vmax*.6,R=apRX,X=apTX,P=HALF+90,a=T.acc*.7;return [[X,0,zP,7,5],[X,0,140,10,5],[R+3,0,140,6,6],[R,0,128,5,6,3],[R,0,-20,v,a],[R,45,-250,c,8],[R+130,80,-P,c,8],[P-160,85,-P,c,8],[P+130,85,-170,c,8],[P+130,80,180,c,8],[P-160,75,P+20,c,8],[R+230,62,P+40,c,8],[R+60,46,P+10,v*1.2,8],[R,32,330,v*1.15,8],[R,15,222,v,8],[R,0,136,v*.9,8],[R,0,-100,16,5],[R,0,-140,7,6],[X,0,-140,7,5],[X,0,zP,9,5],[apAX-108,0,zP,5,5,26]]}
function apMake(type,acc,x,z,yaw,ai,wait){const T=apT[type],g=new THREE.Group(),G=apGeo(type,acc);g.rotation.order='YXZ';
 const b=new THREE.Mesh(G.body,apBodyMat);b.castShadow=true;g.add(b);let gear=null;if(G.gear){gear=new THREE.Mesh(G.gear,apBodyMat);gear.castShadow=true;g.add(gear)}
 g.add(new THREE.Mesh(G.lights,apNavMat));const st=new THREE.Mesh(apStrobeGeo,apStrobeMat);st.position.set(0,T.cy+T.r+.1,0);st.scale.setScalar(T.r+.4);g.add(st);
 const props=[];for(const q of G.props){const m=new THREE.Mesh(apPropGeo,apPropMat);m.position.set(q[0],q[1],q[2]);m.scale.setScalar(q[3]);m.castShadow=true;g.add(m);props.push(m)}
 g.position.set(x,0,z);g.rotation.y=yaw;g.userData.kind='plane';scene.add(g);
 const p={m:g,T,type,speed:0,thr:0,hp:100,steer:0,custom:true,kind:'plane',camD:T.camD,camH:T.camH,dead:false,gear,props,strobe:st,home:[type,acc,x,z,yaw,ai],ai:null,air:false,vy:0,stolen:false};
 if(ai)p.ai={path:apPath(z,T),i:0,wait:wait||8};apPlanes.push(p);return p}
apMake('prop',0xe63946,apAX-124,134,0);apMake('prop',0x1d70b8,apAX-96,134,0);apMake('prop',0xf2a100,apAX-108,95,Math.PI/2);
apMake('jet',0x16324f,apAX-68,133,0);apMake('jet',0x8a1c2b,apAX-108,30,Math.PI/2);apMake('liner',0x0b6e99,apAX-98,-45,Math.PI/2);
apMake('prop',0x2a9d8f,apAX-108,-100,Math.PI/2,true,6);apMake('jet',0x444b55,apAX-108,62,Math.PI/2,true,75);
// ----- flight -----
let apJid=null,apKey=false,apBail=null,apWas=null,apWarn=0,apHudS='';
addEventListener('touchstart',e=>{for(const t of e.changedTouches)if(hit($('jump'),t))apJid=t.identifier},{passive:true});
{const up=e=>{for(const t of e.changedTouches)if(t.identifier===apJid)apJid=null;if(!e.touches||!e.touches.length)apJid=null};addEventListener('touchend',up);addEventListener('touchcancel',up)}
addEventListener('keydown',e=>{if(e.key===' ')apKey=true});addEventListener('keyup',e=>{if(e.key===' ')apKey=false});
const apChute=(()=>{const a=[apCol(gT(new THREE.SphereGeometry(2.4,12,6,0,Math.PI*2,0,Math.PI*.45),0,2.2,0),0xff7a1a)];for(const q of[[-1.9,0],[1.9,0],[0,-1.9],[0,1.9]])a.push(apCol(gT(new THREE.CylinderGeometry(.02,.02,3.9,4),q[0]/2,2.0,q[1]/2,q[1]*.25,0,-q[0]*.25),0xffffff));const m=new THREE.Mesh(U.mergeBufferGeometries(a),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,side:THREE.DoubleSide}));m.visible=false;m.castShadow=true;scene.add(m);return m})();
const apHud=document.createElement('div');apHud.style.cssText='position:fixed;top:calc(env(safe-area-inset-top,0px) + 84px);left:50%;margin-left:-84px;width:168px;display:none;pointer-events:none;color:#fff;font-weight:800;font-size:13px;text-shadow:0 1px 3px #000;align-items:center';
apHud.innerHTML='<div style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid #fffc;position:relative;flex:none;margin-right:9px"><div id="apHz" style="position:absolute;left:-50%;top:-50%;width:200%;height:200%;background:linear-gradient(#3aa0ff 50%,#7a5a2c 50%)"></div><div style="position:absolute;left:9px;right:9px;top:50%;height:2px;margin-top:-1px;background:#ffd23f"></div></div><div id="apTx" style="line-height:1.35;white-space:nowrap"></div>';document.body.appendChild(apHud);
{const m=$('msg'),p=document.createElement('p');p.innerHTML='<b>Airport</b> is west of the city. Steal a plane with CAR, hold JUMP for throttle, pull the stick DOWN to climb, UP to dive, left and right to bank. CAR bails out (parachute opens up high)';m.insertBefore(p,m.lastElementChild)}
function apFwd(m){const r=m.rotation,c=Math.cos(r.x);return new THREE.Vector3(-Math.sin(r.y)*c,Math.sin(r.x),-Math.cos(r.y)*c)}
function apHit(p){const m=p.m,T=p.T,sy=Math.sin(m.rotation.y),cw=Math.cos(m.rotation.y),px=m.position.x,pz=m.position.z,y=m.position.y,R=T.nose+2;
 const pts=[[0,0,T.cy-T.r*.6],[-sy*T.nose,-cw*T.nose,T.cy-T.r*.6],[cw*T.tip,-sy*T.tip,T.wy],[-cw*T.tip,sy*T.tip,T.wy],[cw*T.tip*.5,-sy*T.tip*.5,T.wy],[-cw*T.tip*.5,sy*T.tip*.5,T.wy]];
 for(const s of solids){if(px<s.minX-R||px>s.maxX+R||pz<s.minZ-R||pz>s.maxZ+R)continue;for(const q of pts){if(y+q[2]>s.h)continue;const x=px+q[0],z=pz+q[1];if(x>s.minX&&x<s.maxX&&z>s.minZ&&z<s.maxZ)return s}}return null}
function apCrash(p){if(p.dead)return;const m=p.m,inside=driving===p;p.dead=true;p.speed=0;p.ai=null;const at=m.position.clone();at.y+=1;explode(at);if(p.type==='liner'){explode(at.clone().add(new THREE.Vector3(6,0,4)));explode(at.clone().add(new THREE.Vector3(-6,0,-5)))}
 if(inside){hurt(45);if(driving===p){driving=null;player.visible=true;pos.set(m.position.x,.3,m.position.z);vel.set(0,6,0);onGround=false}}
 char(m);m.position.y=0;m.rotation.x=-.12;m.rotation.z=(Math.random()-.5)*.5;cash+=100;crime(2);
 const h=p.home;setTimeout(()=>{scene.remove(m);const i=apPlanes.indexOf(p);if(i>=0)apPlanes.splice(i,1);apMake(h[0],h[1],h[2],h[3],h[4],h[5],20)},60000)}
function apSim(p,dt,jx,jy,held,piloted){const T=p.T,m=p.m,r=m.rotation,air=m.position.y>.02,ox=m.position.x,oz=m.position.z;
 p.thr+=((held?1:0)-p.thr)*Math.min(1,dt*(held?1.3:(air?.16:.6)));
 p.speed+=(p.thr*T.acc-Math.max(0,p.speed)*T.acc/T.vmax)*dt;const pin=(apInvert?-1:1)*jy;let vy=0;
 if(air){const L=Math.min(1,p.speed/T.vs);p.speed-=Math.sin(r.x)*15*dt;p.speed=Math.max(0,p.speed);
  r.x+=pin*T.pr*L*dt;if(Math.abs(jy)<.06)r.x+=((m.position.y<12&&p.thr>.5?.1:0)-r.x)*Math.min(1,dt*.7);if(L<1)r.x+=(-.5-r.x)*(1-L)*dt*1.8;r.x=Math.max(-.85,Math.min(.8,r.x));
  r.z+=(-jx*T.maxRoll-r.z)*Math.min(1,dt*2.6);r.y+=r.z*T.turn*L*dt;
  const sink=L<1?(1-L)*(1-L)*30+(1-L)*5:0;vy=Math.sin(r.x)*p.speed-sink;p.stall=L<1}
 else{p.stall=false;r.z+=(0-r.z)*Math.min(1,dt*6);r.y+=-jx*dt*Math.min(1,Math.abs(p.speed)/5)*1.15*(p.speed<0?-1:1);
  if(p.thr<.08){if(piloted&&jy>.35&&p.speed<1)p.speed=Math.max(-5,p.speed-7*dt);else if(p.speed>0)p.speed=Math.max(0,p.speed-10*dt);else p.speed=Math.min(0,p.speed+8*dt)}
  if(p.speed>T.vs){r.x+=pin*T.pr*.8*dt;if(p.speed>T.vs*1.3)r.x=Math.max(r.x,.07)}else r.x+=(0-r.x)*Math.min(1,dt*5);r.x=Math.max(0,Math.min(.4,r.x));vy=p.speed>T.vs?Math.sin(r.x)*p.speed:0}
 const c=Math.cos(r.x);m.position.x+=-Math.sin(r.y)*c*p.speed*dt;m.position.z+=-Math.cos(r.y)*c*p.speed*dt;m.position.y+=vy*dt;
 if(m.position.y<=0){if(air){if(vy<-13||r.x<-.42||Math.abs(r.z)>.75){m.position.y=0;apCrash(p);return}if(piloted)toast(vy<-7?'Rough landing!':'Touchdown');if(vy<-7)shake=.5}m.position.y=0}
 if(m.position.y>180){m.position.y=180;r.x=Math.min(r.x,0)}
 const B=HALF+780;if(Math.abs(m.position.x)>B||Math.abs(m.position.z)>B){const want=Math.atan2(m.position.x,m.position.z);r.y+=(((want-r.y+Math.PI*3)%(Math.PI*2))-Math.PI)*Math.min(1,dt*1.2);}
 if(piloted&&(Math.abs(m.position.x)>B||Math.abs(m.position.z)>B)&&T_now()>apWarn){apWarn=T_now()+5;toast('Turning back to the city')}
 const s=apHit(p);if(s){if(m.position.y>.02||Math.abs(p.speed)>12){apCrash(p);return}m.position.x=ox;m.position.z=oz;p.speed=0}
 p.vy=vy}
function T_now(){return performance.now()/1000}
function apAI(p,dt){const a=p.ai,m=p.m,r=m.rotation,T=p.T;if(a.wait>0){a.wait-=dt;p.speed=0;p.thr=.15;r.x*=.9;r.z*=.9;return}
 const w=a.path[a.i],dx=w[0]-m.position.x,dz=w[2]-m.position.z,d=Math.hypot(dx,dz),air=m.position.y>.05,want=Math.atan2(-dx,-dz),da=((want-r.y+Math.PI*3)%(Math.PI*2))-Math.PI;
 const mr=(air?.5:1.4)*dt,turn=Math.max(-mr,Math.min(mr,da));r.y+=turn;p.speed+=Math.max(-13*dt,Math.min(w[4]*dt,w[3]-p.speed));p.thr=air?.8:Math.min(1,p.speed/20+.2);
 m.position.x+=-Math.sin(r.y)*p.speed*dt;m.position.z+=-Math.cos(r.y)*p.speed*dt;
 let st=0;if(air||p.speed>T.vs){const cl=p.speed*.22*dt;st=Math.max(-cl,Math.min(cl,(w[1]-m.position.y)*Math.min(1,p.speed*dt*1.1/Math.max(d-(w[1]>0?30:0),1))))}m.position.y=Math.max(0,m.position.y+st);
 r.x+=(Math.atan2(st/Math.max(dt,.001),Math.max(p.speed,1))*1.2+(air&&w[1]===0?.06:0)-r.x)*Math.min(1,dt*2);r.z+=((air?turn/Math.max(dt,.001)*1.5:0)-r.z)*Math.min(1,dt*2);
 if(d<(w[1]>0?40:4.5)){if(w[5])a.wait=w[5];a.i=(a.i+1)%a.path.length}}
function apExit(p){const m=p.m,air=m.position.y>1.2||Math.abs(p.speed)>12,ry=m.rotation.y,f=apFwd(m);driving=null;player.visible=true;cam.up.set(0,1,0);
 if(!air){const o=p.T.r+2.2;pos.set(m.position.x-Math.cos(ry)*o,.3,m.position.z+Math.sin(ry)*o);vel.set(0,0,0);p.thr=0;toast('Got out')}
 else{pos.copy(m.position);pos.y+=p.T.cy;vel.set(f.x*p.speed*.45,4,f.z*p.speed*.45);onGround=false;apBail={t:0,chute:false,vy:0,h:pos.y};toast('BAILED OUT!')}}
{const nc=nearestCar;nearestCar=function(peek){let best=null,bd=1e9;
 for(const p of apPlanes){if(p.dead||p===driving||p.m.position.y>1||(p.ai&&p.speed>14))continue;const m=p.m,T=p.T,sy=Math.sin(m.rotation.y),cw=Math.cos(m.rotation.y),dx=pos.x-m.position.x,dz=pos.z-m.position.z;
  const t=Math.max(-T.nose,Math.min(T.nose,-(dx*sy+dz*cw))),d=Math.hypot(dx+sy*t,dz+cw*t);if(d<T.r+3.6&&d<bd){bd=d;best=p}}
 if(best){const c=nc(true);if(c&&Math.hypot(c.m.position.x-pos.x,c.m.position.z-pos.z)<bd)best=null}
 if(!best)return nc(peek);if(peek)return best;
 if(best.ai){best.ai=null;const h=best.home;if(h[5]){h[5]=false;setTimeout(()=>apMake(h[0],h[1],h[2],h[3],h[4],true,10),120000)}}
 if(!best.stolen){best.stolen=true;if(wantedScore<3)crime(3-wantedScore)}camPitch=.24;toast(best.type==='liner'?'STOLE AN AIRLINER! Hold JUMP for throttle':'STOLE A PLANE! Hold JUMP for throttle');beep(500,.1,.12);return best}}
{const dm=drawMap;drawMap=function(){dm();if(pos.x>apAX+130)return;const g=mapC,S=260,sc=S/215;g.save();g.beginPath();g.arc(S/2,S/2,S/2-4,0,7);g.clip();g.translate(S/2,S/2);g.rotate(camYaw);g.translate(-pos.x*sc,-pos.z*sc);
 g.fillStyle='#777b80';g.fillRect((apAX-134)*sc,-120*sc,64*sc,270*sc);g.fillStyle='#3a3d42';g.fillRect((apTX-6)*sc,-150*sc,12*sc,300*sc);for(const z of[-140,0,140])g.fillRect((apRX+12)*sc,(z-6)*sc,32*sc,12*sc);g.fillRect((apAX-70)*sc,74*sc,70*sc,14*sc);
 g.fillStyle='#222428';g.fillRect((apRX-12)*sc,-150*sc,24*sc,300*sc);g.fillStyle='#fff';for(let z=-120;z<=120;z+=40)g.fillRect((apRX-.6)*sc,(z-8)*sc,1.2*sc,16*sc);
 for(const p of apPlanes){if(p.dead)continue;g.save();g.translate(p.m.position.x*sc,p.m.position.z*sc);g.rotate(-p.m.rotation.y);g.fillStyle=p===driving?'#ffd23f':'#e8f4ff';const k=p.type==='liner'?1.9:1;g.fillRect(-1.5*k,-8*k,3*k,16*k);g.fillRect(-9*k,-2*k,18*k,3.5*k);g.fillRect(-4*k,6*k,8*k,2*k);g.restore()}
 g.restore();if(!driving||driving.kind!=='plane'){g.save();g.translate(S/2,S/2);g.rotate(camYaw-facing);g.fillStyle='#fff';g.beginPath();g.moveTo(0,-12);g.lineTo(8,8);g.lineTo(-8,8);g.fill();g.restore()}}}
function apTick(dt){const sunH=Math.sin(dayT*Math.PI*2),night=1-Math.max(0,Math.min(1,sunH*3+.5));
 apLightMat.color.setScalar(.1+night*1.05);apGlassMat.emissiveIntensity=night*.55;apSignMat.emissiveIntensity=.25+night*1.6;apBeacon.rotation.y+=dt*2.2;apCone.visible=night>.35;
 let mine=driving&&driving.kind==='plane'&&apPlanes.indexOf(driving)>=0?driving:null;
 if(mine&&carQ&&state==='play'){carQ=false;apExit(mine);mine=null}
 let jx=joy.x,jy=joy.y;const jm=Math.hypot(jx,jy);if(jm<.22){jx=0;jy=0}else{const k=(jm-.22)/.78/jm;jx*=k;jy*=k}
 const strobe=(T*1.1%1)<.07;
 for(let i=apPlanes.length-1;i>=0;i--){const p=apPlanes[i];if(p.dead)continue;const m=p.m,on=p===mine&&state==='play';
  if(p.ai)apAI(p,dt);else if(p===mine||Math.abs(p.speed)>.05||m.position.y>.01||p.thr>.02)apSim(p,dt,on?jx:0,on?jy:0,on&&(apJid!==null||apKey),on);
  if(p.dead)continue;p.strobe.visible=strobe&&(p===mine||!!p.ai||m.position.y>.5);if(p.gear&&p.T.gearUp)p.gear.visible=m.position.y<14;
  const sp=(p===mine||p.ai||p.thr>.03)?(14+p.thr*45):0;for(const q of p.props)q.rotation.z+=sp*dt}
 if(mine&&driving===mine){const m=mine.m,r=m.rotation;pos.copy(m.position);facing=r.y;vel.set(0,0,0);jumpQ=false;
  const a=-r.z*.35;cam.up.set(Math.cos(camYaw)*Math.sin(a),Math.cos(a),-Math.sin(camYaw)*Math.sin(a));
  if(apWas!==mine){apWas=mine;apHud.style.display='flex';$('jump').textContent='GAS'}
  const s='ALT '+Math.round(m.position.y*3)+' ft<br>SPD '+Math.round(Math.abs(mine.speed)*2)+' kt<br>'+(mine.stall&&m.position.y>2?'<span style="color:#ff4040">STALL</span>':'THR '+Math.round(mine.thr*100)+'%');
  if(s!==apHudS){apHudS=s;$('apTx').innerHTML=s}$('apHz').style.transform='rotate('+(r.z*57.3).toFixed(1)+'deg) translateY('+(r.x*34).toFixed(1)+'px)'}
 else{if(apWas){apWas=null;apHud.style.display='none';$('jump').textContent='JUMP';cam.up.set(0,1,0)}
  if(!driving&&state==='play')for(const p of apPlanes){const m=p.m,T=p.T;if(m.position.y>1||T.cy-T.r>2.2||pos.y>T.cy+T.r)continue;const sy=Math.sin(m.rotation.y),cw=Math.cos(m.rotation.y),dx=pos.x-m.position.x,dz=pos.z-m.position.z,t=Math.max(-T.nose,Math.min(T.nose,-(dx*sy+dz*cw))),ex=dx+sy*t,ez=dz+cw*t,d=Math.hypot(ex,ez),R=T.r+.5;if(d<R&&d>.001){pos.x+=ex/d*(R-d);pos.z+=ez/d*(R-d)}}}
 if(apBail){const b=apBail;if(state!=='play'||driving){apBail=null;apChute.visible=false}
  else if(onGround&&b.t>.15){if(!b.chute){const d=(-b.vy-22)*4;if(d>0){hurt(d);shake=.6;if(state==='play')toast(d>60?'OUCH!':'Hard landing')}}else toast('Nice landing');apBail=null;apChute.visible=false}
  else{b.t+=dt;b.vy=vel.y;if(!b.chute&&b.t>.7&&b.h>25&&pos.y>12){b.chute=true;toast('Parachute open! Steer with the stick')}if(b.chute){vel.y=Math.max(vel.y,-6.5);apChute.visible=true;apChute.position.set(pos.x,pos.y,pos.z);apChute.rotation.y=facing}}}}
{const ex=explode;explode=function(q){ex(q);for(const p of apPlanes)if(!p.dead&&!p.boom&&p.m.position.distanceTo(q)<p.T.nose*.5+5){p.boom=true;setTimeout(()=>apCrash(p),350)}}}
MODS.push(apTick);
function apWestOK(p){return p.x>-HALF-250}
