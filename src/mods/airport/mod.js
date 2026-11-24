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
// ----- static airport -----
// Everything static is merged into a few meshes by material: pavement A, paint M, structures/vehicles S, glass G, lights L, fence mesh F, signs SG.
const apMatS=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7,metalness:.1});
const apCells={};let apSock=[],apRadar=null;const apTrain=[];
// one canvas atlas for every airport sign (one draw call for all of them)
const apAtlas=(()=>{const cv=document.createElement('canvas');cv.width=1024;cv.height=512;const g=cv.getContext('2d');
 const cell=(k,x,y,w,h,bg,fg,txt)=>{apCells[k]=[x,y,w,h];g.fillStyle=bg;g.fillRect(x,y,w,h);g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';let s=Math.floor(h*.64);g.font='bold '+s+'px sans-serif';while(g.measureText(txt).width>w*.9&&s>8){s--;g.font='bold '+s+'px sans-serif'}g.fillText(txt,x+w/2,y+h/2+2)};
 cell('main',0,0,1024,80,'#10202e','#bfe6ff','BLOCK CITY INTL');cell('mon',0,80,1024,80,'#0f2a44','#ffffff','BLOCK CITY INTERNATIONAL AIRPORT');
 cell('dep',0,160,512,64,'#1d5fae','#ffffff','DEPARTURES');cell('arr',512,160,512,64,'#f2c318','#111111','ARRIVALS');
 cell('auth',0,224,512,64,'#ffffff','#c8102e','AUTHORIZED PERSONNEL ONLY');cell('fire',512,224,512,64,'#c8102e','#ffffff','AIRPORT FIRE RESCUE');
 cell('hold',0,288,192,64,'#c8102e','#ffffff','36-18');for(let i=1;i<=3;i++){cell('tw'+i,96+i*96,288,96,64,'#111111','#f2c318','A'+i);cell('g'+i,384+i*96,288,96,64,'#1b1f26','#f2c318','A'+i);cell('h'+i,(i-1)*256,352,256,64,'#2a2f36','#ffffff','HANGAR '+i)}
 cell('P',768,288,128,128,'#1d5fae','#ffffff','P');cell('park',0,416,512,64,'#1d5fae','#ffffff','PARKING');cell('fuel',512,416,512,64,'#f2c318','#111111','FUEL FARM - NO SMOKING');
 cell('taxi',0,480,512,32,'#f2c318','#111111','TAXI');cell('bag',512,480,512,32,'#2a2f36','#ffffff','BAGGAGE CLAIM');
 const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t})();
let apSignMat=new THREE.MeshStandardMaterial({map:apAtlas,emissive:0xffffff,emissiveMap:apAtlas,emissiveIntensity:.3,roughness:.6});
let apBeacon=null,apCone=null;
{const A=[],M=[],S=[],G=[],L=[],F=[],SG=[],W=0xf2f2f2,Y=0xf2c318,X=apAX,PI=Math.PI,DK=0x2a2d31,CON=0xb9bec4;
 const lt=(x,y,z,r,g,b,s)=>L.push(apRGB(bxg(s||.5,.35,s||.5,x,y,z),r,g,b));
 const el=(x,z,r,g,b)=>{S.push(apB(.12,.3,.12,x,.15,z,DK));L.push(apRGB(bxg(.3,.18,.3,x,.38,z),r,g,b))};
 // parts in a local frame (x right, -z front), turned by ry and moved to (ox,oz). q=[w,h,d,lx,ly,lz,col,rx,rz]
 const LW=(g,ox,oz,ry)=>{if(ry)g.rotateY(ry);g.translate(ox,0,oz);return g};
 const V=(parts,ox,oz,ry,arr)=>{for(const q of parts){const g=new THREE.BoxGeometry(q[0],q[1],q[2]).toNonIndexed();if(q[7])g.rotateX(q[7]);if(q[8])g.rotateZ(q[8]);g.translate(q[3],q[4],q[5]);(arr||S).push(apCol(LW(g,ox,oz,ry),q[6]))}};
 const VC=(rt,rb,h,n,lx,ly,lz,col,rx,rz,ox,oz,ry,arr)=>{const g=gT(new THREE.CylinderGeometry(rt,rb,h,n),0,0,0,rx,0,rz);g.translate(lx,ly,lz);(arr||S).push(apCol(LW(g,ox,oz,ry),col))};
 const wh=(x,z,r,w)=>[w||.28,r*2,r*2,x,r,z,0x151515];
 const SGN=(k,w,h,x,y,z,ry)=>{const c=apCells[k],g=new THREE.PlaneGeometry(w,h),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(c[0]+uv.getX(i)*c[2])/1024,1-(c[1]+(1-uv.getY(i))*c[3])/512);const q=gT(g,0,0,0);if(ry)q.rotateY(ry);q.translate(x,y,z);SG.push(q)};
 const ARCH=(w,rise,len,x,y,z0,col)=>{const s=new THREE.Shape();s.moveTo(-w/2,0);s.quadraticCurveTo(0,rise*2,w/2,0);s.lineTo(-w/2,0);const g=new THREE.ExtrudeGeometry(s,{depth:len,bevelEnabled:false,curveSegments:12});S.push(apCol(gT(g,x,y,z0),col))};
 // vehicle templates (front = -z)
 const TUG=[[1.5,.75,2.3,0,.6,0,Y],[1.3,.06,1.4,0,2.05,.35,Y],[.07,1.1,.07,-.62,1.5,-.3,0x333333],[.07,1.1,.07,.62,1.5,-.3,0x333333],[.07,1.1,.07,-.62,1.5,1,0x333333],[.07,1.1,.07,.62,1.5,1,0x333333],[.7,.45,.5,0,1.15,.55,0x222222],[.3,.25,.5,0,.45,1.35,0x333333],wh(-.75,-.75,.3),wh(.75,-.75,.3),wh(-.75,.8,.3),wh(.75,.8,.3)];
 const CART=c=>[[1.45,.12,2.4,0,.55,0,0x5a6068],[1.4,1.0,2.3,0,1.12,0,c],[1.5,.08,2.4,0,1.66,0,0x3a3f45],[.08,.08,.9,0,.45,-1.6,0x333333],wh(-.7,-.8,.2,.2),wh(.7,-.8,.2,.2),wh(-.7,.8,.2,.2),wh(.7,.8,.2,.2)];
 const BELT=[[1.7,.6,4.6,0,.6,.4,W],[1,.12,6.4,0,2.05,-.6,0x2a2a2a,.42],[.08,.5,6.3,-.55,2.3,-.6,Y,.42],[.08,.5,6.3,.55,2.3,-.6,Y,.42],[1.2,1,1.1,-.25,1.35,1.9,0xdddddd],wh(-.8,-1.3,.33),wh(.8,-1.3,.33),wh(-.8,1.9,.33),wh(.8,1.9,.33)];
 const CAT=[[2.2,.45,6.4,0,.75,0,0x333333],[2.2,1.9,1.8,0,1.6,-2.4,W],[2.1,.7,.08,0,2.0,-3.32,0x1e2a36],[2.3,2.3,4,0,4.2,1,W],[2.32,.45,4.02,0,3.4,1,0xc8102e],[.18,2.6,.18,-.8,2.1,1,0x777777],[.18,2.6,.18,.8,2.1,1,0x777777],[2.4,.12,.9,0,3.0,3.3,0x999999],wh(-1,-2.3,.42,.32),wh(1,-2.3,.42,.32),wh(-1,2.2,.42,.32),wh(1,2.2,.42,.32)];
 const STAIR=[[2,.4,6,0,.6,0,0x333333],[2,1.7,1.7,0,1.5,-2.3,W],[1.5,.18,5.4,0,2.55,1,0xdddddd,-.55],[.06,.9,5.4,-.75,3.1,1,Y,-.55],[.06,.9,5.4,.75,3.1,1,Y,-.55],[1.6,.15,1.4,0,3.95,3.6,0xdddddd],wh(-.95,-2.2,.4),wh(.95,-2.2,.4),wh(-.95,2.2,.4),wh(.95,2.2,.4)];
 const GPU=[[1.2,1,2,0,.8,0,0x2f6db5],[1.25,.1,2.05,0,1.35,0,0x1d4f8c],wh(-.6,-.7,.25,.2),wh(.6,-.7,.25,.2),wh(-.6,.7,.25,.2),wh(.6,.7,.25,.2)];
 const PUSH=[[2.8,1,5.2,0,.75,0,Y],[1.3,.9,1.3,-.6,1.7,1.2,0x1e2a36],[2.9,.12,.4,0,.5,-2.7,0x333333],wh(-1.3,-1.6,.5,.4),wh(1.3,-1.6,.5,.4),wh(-1.3,1.6,.5,.4),wh(1.3,1.6,.5,.4)];
 const CAR=c=>[[1.85,.7,4.3,0,.62,0,c],[1.62,.56,2.2,0,1.24,.25,0x1e2a36],[1.64,.08,2,0,1.55,.25,c],wh(-.85,-1.4,.33,.25),wh(.85,-1.4,.33,.25),wh(-.85,1.4,.33,.25),wh(.85,1.4,.33,.25)];
 const BUS=[[2.5,2.8,11,0,1.85,0,W],[2.52,.9,10.4,0,2.4,0,0x1e2a36],[2.54,.35,11.02,0,1,0,0x1d70b8],wh(-1.2,-3.6,.5,.3),wh(1.2,-3.6,.5,.3),wh(-1.2,3.4,.5,.3),wh(1.2,3.4,.5,.3)];
 const FIRE=[[2.5,2.5,8,0,1.75,0,0xc8102e],[2.4,1,.08,0,2.4,-4.02,0x1e2a36],[2.52,.3,8.02,0,1.3,0,W],[.6,.3,.6,0,3.15,-2.8,0x3a7bd5],[1.8,.3,4.5,0,3.15,1,0x9aa3ac],wh(-1.2,-2.6,.55,.35),wh(1.2,-2.6,.55,.35),wh(-1.2,2.2,.55,.35),wh(1.2,2.2,.55,.35)];
 const FUEL=(x,z,ry)=>{V([[2.3,.3,7.6,0,.55,0,DK],[2.4,2.2,2.2,0,1.5,-3.4,Y],[2.1,.9,.08,0,1.95,-4.52,0x16222e],wh(-1.15,-3.2,.5,.4),wh(1.15,-3.2,.5,.4),wh(-1.15,1.4,.5,.4),wh(1.15,1.4,.5,.4),wh(-1.15,3,.5,.4),wh(1.15,3,.5,.4)],x,z,ry);VC(1.25,1.25,5.2,12,0,1.9,.6,0xe9ecef,PI/2,0,x,z,ry)};
 const cone=(x,z)=>{S.push(apCyl(.04,.24,.7,6,x,.35,z,0xff6a00),apB(.5,.05,.5,x,.03,z,0x222222))};
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(270,1100),grass.material);gr.rotation.x=-Math.PI/2;gr.position.set(-(HALF+335),-0.02,0);gr.receiveShadow=true;scene.add(gr);
 // ===== pavement =====
 A.push(apB(24,.02,300,apRX,.03,0,0x26282c),apB(12,.02,300,apTX,.03,0,0x3a3d42),apB(64,.02,240,X-102,.03,0,0x54585e),apB(84,.02,32,X-96,.03,135,0x54585e),apB(70,.02,14,X-35,.03,81,0x2f3136));
 for(const s of[-1,1])A.push(apB(3,.02,300,apRX+s*13.5,.028,0,0x4a4d52),apB(24,.02,8,apRX,.03,s*154,0x303236));
 for(const z of[-140,0,140])A.push(apB(32,.02,12,apRX+28,.03,z,0x3a3d42));
 A.push(apB(6,.02,240,-371.6,.034,0,0x404349));                                    // airside service road in front of the terminal
 A.push(apB(18,.02,154,-327,.03,-3,0x34363b),apB(8,.06,100,-340,.05,-20,0xb5b8bc)); // landside road + curb
 A.push(apB(44,.02,85,-344,.03,-122.5,0x303236),apB(12,.02,10,-330,.03,-75,0x34363b)); // car park + its entrance
 // ===== paint =====
 for(let z=-120;z<=120;z+=20)M.push(apB(.7,.02,10,apRX,.055,z,W));
 for(const s of[-1,1]){M.push(apB(.5,.02,296,apRX+s*11.2,.055,0,W),apB(3,.02,18,apRX+s*5.5,.055,95,W),apB(3,.02,18,apRX+s*5.5,.055,-95,W));for(let i=0;i<8;i++)M.push(apB(1.7,.02,12,apRX-9.8+i*2.8,.055,s*141,W));
  // touchdown-zone bars
  for(const e of[-1,1])for(const t of[[108,3],[72,2],[58,1]])for(let k=0;k<t[1];k++)M.push(apB(1.1,.02,7,apRX+s*(3.2+k*2),.055,e*t[0],W));
  // blast pads: yellow chevrons
  for(let k=0;k<2;k++)for(const h of[-1,1]){const g=bxg(11.4,.02,.6,0,0,0);g.rotateY(-h*s*.266);g.translate(apRX+h*5.5,.055,s*(151.6+k*3.3)+s*1.5);M.push(apCol(g,Y))}}
 const dig=(ch,cx,cz,dir)=>{const Wd=4,H=9,t=.9,seg={a:[0,H/2,Wd+t,t],d:[0,-H/2,Wd+t,t],g:[0,0,Wd+t,t],f:[-Wd/2,H/4,t,H/2],b:[Wd/2,H/4,t,H/2],e:[-Wd/2,-H/4,t,H/2],c:[Wd/2,-H/4,t,H/2]},mp={'1':'bc','3':'abcdg','6':'acdefg','8':'abcdefg'};for(const k of mp[ch]){const s=seg[k];M.push(apB(s[2],.02,s[3],cx+dir*s[0],.055,cz-dir*s[1],W))}};
 dig('3',apRX-3.6,122,1);dig('6',apRX+3.6,122,1);dig('1',apRX+3.6,-122,-1);dig('8',apRX-3.6,-122,-1);
 M.push(apB(.35,.02,300,apTX,.055,0,Y));for(const z of[-140,0,140]){M.push(apB(32,.02,.35,apRX+28,.055,z,Y));
  // runway holding position: two solid + two dashed yellow lines across the connector
  for(const dx of[0,.6])M.push(apB(.25,.02,12,apRX+16+dx,.056,z,Y));for(const dx of[1.4,2])for(let k=-5;k<=5;k+=2)M.push(apB(.25,.02,1.2,apRX+16+dx,.056,z+k,Y))}
 for(const z of[-100,-38,30,62,95])M.push(apB(30,.02,.35,X-119,.055,z,Y),apB(.35,.02,6,X-104,.055,z,Y));
 for(const hx of[-124,-96,-68])M.push(apB(.35,.02,30,X+hx,.055,105,Y));
 for(let x=-66;x<-2;x+=8)M.push(apB(4,.02,.3,X+x,.055,81,Y));
 // gate lead-in lines, stop bars and the red equipment line along the terminal
 for(const gz of[-55,-20,15])M.push(apB(36,.02,.35,-392,.056,gz,Y),apB(.4,.02,3.2,-373.9,.056,gz,Y),apB(.4,.02,3.2,-376.5,.056,gz+3.5,0xd62828));
 M.push(apB(.25,.02,240,-368.9,.056,0,W),apB(.25,.02,240,-374.4,.056,0,W));for(let z=-118;z<120;z+=6)M.push(apB(.2,.02,3,-371.9,.057,z,W));
 // landside lanes and a zebra crossing
 for(let z=-76;z<72;z+=8)M.push(apB(.25,.02,4,-327,.055,z,W));for(let k=0;k<9;k++)M.push(apB(1,.02,4,-334.5+k*2,.055,-20,W));
 // car park stalls
 const rows=[[-363.5,1],[-351.5,-1],[-346.5,1],[-334.5,-1],[-329.5,1]];for(const r of rows)for(let k=0;k<=29;k++)M.push(apB(5,.02,.15,r[0],.055,-163.2+k*2.7,W));
 // ===== runway, taxi, approach lights + PAPI =====
 for(let z=-150;z<=150;z+=15){el(apRX-12.6,z,3,2.9,2.5);el(apRX+12.6,z,3,2.9,2.5);el(apTX-6.6,z,.25,.5,3);el(apTX+6.6,z,.25,.5,3)}
 for(let i=0;i<9;i++){lt(apRX-10+i*2.5,.2,151.5,.2,3,.5,.4);lt(apRX-10+i*2.5,.2,-151.5,3,.15,.1,.4)}
 for(const s of[-1,1])for(let k=0;k<4;k++){for(const dx of[-3,0,3])lt(apRX+dx,.9,s*(160+k*6),3,2.8,2.2,.5);S.push(apB(7,.12,.12,apRX,.75,s*(160+k*6),0x555b63));for(const dx of[-3,0,3])S.push(apB(.1,.75,.1,apRX+dx,.37,s*(160+k*6),0x555b63))}
 for(const e of[-1,1])for(let k=0;k<4;k++){const x=apRX-e*(17+k*2.4),z=e*100;S.push(apB(1.3,.7,.9,x,.45,z,0x3a3d42));L.push(apRGB(bxg(.9,.3,.12,x,.55,z+e*.46),3,k<2?2.9:.12,k<2?2.6:.1))}
 // ===== terminal: two levels, glass curtain walls, arched roof, jet bridges =====
 {const x0=-368,x1=-344,zc=-20,len=100;
  S.push(apB(23.4,4.2,99.4,-356,2.1,zc,CON),apB(23,7.4,99,-356,7.9,zc,0x7e8791),apB(24.8,.5,100.8,-356,4.25,zc,0xd5d9de),apB(25,.6,101,-356,11.8,zc,0x676c73));
  ARCH(30,3.4,106,-356,12.05,-73,0xe3e6ea);S.push(apB(30.3,.45,106.2,-356,12.1,zc,0x9aa3ac));
  for(const x of[x0-.1,x1+.1])G.push(bxg(.2,7,98,x,7.9,zc));
  for(let z=zc-48;z<=zc+48.1;z+=4)for(const x of[x0-.3,x1+.3])S.push(apB(.22,7.1,.22,x,7.9,z,0x3d434a));
  for(const y of[7.9,11.35])for(const x of[x0-.3,x1+.3])S.push(apB(.22,.22,98,x,y,zc,0x3d434a));
  for(const z of[-70.1,30.1]){S.push(apB(24.2,11.6,.4,-356,5.8,z,0xa6adb5));G.push(bxg(6,6.4,.5,-356,7.6,z))}
  for(const z of[-62,-38,-2,22]){S.push(apB(.2,3.1,3.6,x0-.12,1.55,z,0x3d434a));S.push(apB(.24,.35,3.9,x0-.14,3.2,z,Y))}       // baggage hall doors
  for(const z of[-50,-35,-5,10]){G.push(bxg(.25,3,4,x1+.1,1.5,z));S.push(apB(.3,.3,4.4,x1+.15,3.1,z,0x3d434a))}               // entrance doors
  // landside canopy over the curb with DEPARTURES / ARRIVALS boards
  S.push(apB(7.2,.35,78,-339.6,5.3,zc,0xe3e6ea),apB(.5,.9,78,-336.1,5.1,zc,0x9aa3ac));for(let z=-58;z<=19;z+=9.5)S.push(apCyl(.2,.2,5,8,-336.8,2.6,z,0x9aa3ac));
  SGN('dep',8,1,-335.8,5.1,-35,PI/2);SGN('arr',8,1,-335.8,5.1,-2,PI/2);SGN('bag',5,.5,-343.7,3.8,10,PI/2);
  SGN('main',30,2.4,-343.55,9.8,zc,PI/2);SGN('main',18,1.4,-368.45,10.1,zc+.5,-PI/2);
  // kerbside traffic: taxis and a shuttle bus
  V(CAR(0xf2c318),-333.5,-46,0);V(CAR(0xf2c318),-333.5,-40,0);V(CAR(0xf2c318),-333.5,-34,0);V(BUS,-333.6,-2,0);V(CAR(0x2c3e50),-333.5,14,0);
  solids.push({minX:x0,maxX:x1,minZ:-70,maxZ:30,h:15.4});
  // jet bridges: fixed link -> rotunda -> telescopic tunnel -> cab at the airliner's front-left door
  [-55,-20,15].forEach((gz,i)=>{const rx=-372,rz=gz-11,dx=-377.8,dz=gz-3.6,vx=dx-rx,vz=dz-rz,ln=Math.hypot(vx,vz),ry=Math.atan2(vx,vz),mx=(rx+dx)/2,mz=(rz+dz)/2;
   S.push(apB(4.2,3,2.6,-370.1,5.75,rz,0xc9ced4),apCyl(1.9,1.9,3.3,12,rx,5.75,rz,0xb7bec6),apCyl(.45,.45,4.2,8,rx,2.1,rz,0x8a9099));
   V([[2.5,2.7,ln-1.4,0,5.45,0,0xd5d9de],[2.54,.3,ln-1.4,0,4.25,0,DK]],mx,mz,ry);{const gg=new THREE.BoxGeometry(2.56,.55,ln-2.6).toNonIndexed();gg.translate(0,5.9,0);G.push(LW(gg,mx,mz,ry))}
   const px=rx+vx*.78,pz=rz+vz*.78;V([[.3,3.6,.3,-.85,2.1,0,0x6b7178],[.3,3.6,.3,.85,2.1,0,0x6b7178],[2.2,.35,.6,0,.55,0,0x555b63],wh(-.95,0,.35,.3),wh(.95,0,.35,.3)],px,pz,ry);
   V([[3,2.9,2.4,0,5.25,0,0xc9ced4],[2.6,2.5,.9,0,5.0,1.5,DK],[3.1,.3,2.5,0,6.8,0,0x9aa3ac]],dx,dz,0);
   S.push(apB(.15,1.2,2.6,-368.25,9.3,rz,0x1b1f26));SGN('g'+(i+1),2.4,1.6,-368.4,9.3,rz,-PI/2)});
 }
 // ===== ground support equipment around the gates (right side of each airliner, under the wing) =====
 const train=(x,z,ry,n,cols)=>{const c=Math.cos(ry),s=Math.sin(ry);V(TUG,x,z,ry);for(let i=0;i<n;i++){const d=2.75*(i+1);V(CART(cols[i%cols.length]),x+s*d,z+c*d,ry)}};
 [-55,-20,15].forEach((gz,i)=>{V(BELT,-397,gz+5.6,0);if(i===1)V(BELT,-383.5,gz+5.6,0);V(CAT,-401.4,gz+5.8,PI);V(GPU,-377.2,gz+3.6,PI/2);
  train(-381,gz+9.5,-PI/2,3,[0x2a6f97,0x6b7178,0x3f7d4a]);cone(-390,gz+17.7);cone(-390,gz-17.7);cone(-411.5,gz);if(i!==1)FUEL(-392,gz+12.5,-PI/2)});
 V(STAIR,-433.2,-31.4,PI);cone(-417,-20);cone(-417,-56);                                   // remote stand: steps at the stealable airliner
 V(PUSH,-386,108,PI/2);V(PUSH,-418,112,0);train(-370,104,PI,2,[0x2a6f97,0x8a5a2b]);V(GPU,-360,112,0);
 // follow-me car + a fuel truck waiting by the hangars
 V(CAR(0xf2c318),-430,112,PI/2);V([[1.7,.12,.5,0,1.65,0,0x222222]],-430,112,PI/2);FUEL(-362,98,0);solids.push({minX:-363.3,maxX:-360.7,minZ:93.4,maxZ:102.6,h:3});
 // ===== control tower =====
 S.push(apCyl(2.9,3.6,30,8,X-52,15,52,0xc4c9cf),apB(.6,26,1.3,X-49.2,15,52,0x3d434a),apB(15,5,11,X-52,2.5,52,CON),apB(15.6,.4,11.6,X-52,5.2,52,0x676c73));G.push(bxg(15.1,1.4,11.1,X-52,3,52));
 S.push(apCyl(6.6,6.6,.8,8,X-52,35.6,52,0x555b63),apCyl(4.6,3.6,1.2,8,X-52,30.4,52,0x8a9099),apCyl(.12,.12,5,6,X-52,38.5,52,0x444444),apCyl(6.9,6.9,.25,16,X-52,30.9,52,0x555b63),apCol(gT(new THREE.CylinderGeometry(6.9,6.9,1,16,1,true),X-52,31.5,52),0x777e86));
 S.push(apCyl(.06,.06,4,5,X-49.5,38,50.5,0x444444),apCyl(.06,.06,3,5,X-54.5,37.5,53.5,0x444444),apCol(gT(new THREE.SphereGeometry(.9,10,6),X-49.5,36.9,54),0xf2f2f2));
 G.push(gT(new THREE.CylinderGeometry(6.1,4.7,4.4,8),X-52,33.1,52));lt(X-52,41.1,52,3,.15,.1,.5);
 solids.push({minX:X-55.5,maxX:X-48.5,minZ:48.5,maxZ:55.5,h:36},{minX:X-59.5,maxX:X-44.5,minZ:46.5,maxZ:57.5,h:5.4});
 // ===== hangars: barrel roofs, sliding doors, interior lights =====
 [-124,-96,-68].forEach((hx,i)=>{const c=[0xe63946,0x1d70b8,0xf4a261][i],x=X+hx;S.push(apB(26,11,.6,x,5.5,150,0x717d89),apB(.6,11,30,x-13,5.5,135,0x717d89),apB(.6,11,30,x+13,5.5,135,0x717d89),apB(26,2,.7,x,10,120.1,0x7b8692),apB(26,.5,.75,x,9.4,120.1,c));
  ARCH(27.4,4,31.2,x,11,119.4,0x8e979f);for(const s of[-1,1]){S.push(apB(5.5,10,.35,x+s*10.25,5,119.6,0x9aa3ac));for(let y=1.5;y<10;y+=2.2)S.push(apB(5.5,.12,.42,x+s*10.25,y,119.6,0x7b8692));G.push(bxg(.7,1.2,24,x+s*13,8,135));L.push(apRGB(bxg(.35,.12,24,x+s*6,10.8,135),2.6,2.5,2.2))}
  SGN('h'+(i+1),7,1.75,x,12.6,119.3,PI);
  solids.push({minX:x-13,maxX:x+13,minZ:149.6,maxZ:150.4,h:11.6},{minX:x-13.4,maxX:x-12.6,minZ:120,maxZ:150,h:11.6},{minX:x+12.6,maxX:x+13.4,minZ:120,maxZ:150,h:11.6},{minX:x+7.5,maxX:x+13,minZ:119.4,maxZ:119.8,h:10},{minX:x-13,maxX:x-7.5,minZ:119.4,maxZ:119.8,h:10});lt(x,9.6,119.6,3,2.8,2.2,.7)});
 // ===== apron flood masts =====
 for(const z of[-112,-78,40,112]){S.push(apCyl(.18,.28,16,6,X-71,8,z,0x555b63),apB(.6,.5,2.6,X-71.6,16,z,0x333333));lt(X-71.9,15.7,z-.8,3,2.9,2.4,.6);lt(X-71.9,15.7,z+.8,3,2.9,2.4,.6);solids.push({minX:X-71.3,maxX:X-70.7,minZ:z-.3,maxZ:z+.3,h:16})}
 // ===== fire station + fuel farm (south-east corner) =====
 S.push(apB(22,7,14,-341,3.5,103,0xd9d4c8),apB(22.6,.5,14.6,-341,7.2,103,0x8a1c1c));for(const x of[-348,-341,-334]){S.push(apB(5.6,5.2,.2,x,2.6,95.9,0x3d434a));S.push(apB(5.8,.3,.3,x,5.35,95.85,0xc8102e))}
 SGN('fire',12,1.5,-341,6.2,95.75,PI);V(FIRE,-341,96.5,0);solids.push({minX:-352,maxX:-330,minZ:96,maxZ:110,h:7.4});
 for(const t of[[-345,136],[-345,154],[-330,145]]){S.push(apCyl(5.5,5.5,7,16,t[0],3.5,t[1],0xe9ecef),apCyl(5.55,5.55,.6,16,t[0],5.6,t[1],0x2a6f97),apCyl(5.6,5.6,.2,16,t[0],7.05,t[1],0xcfd4da));solids.push({minX:t[0]-4.6,maxX:t[0]+4.6,minZ:t[1]-4.6,maxZ:t[1]+4.6,h:7.2})}
 for(const w of[[30,.9,.5,-338,127],[30,.9,.5,-338,163],[.5,.9,36,-353,145],[.5,.9,36,-323,145]])S.push(apB(w[0],w[1],w[2],w[3],.45,w[4],0x9a9da1));
 S.push(apB(6,1.6,.15,-338,1.5,126.6,0x333333));SGN('fuel',5.8,.72,-338,1.6,126.5,PI);
 // ===== car park: stalls, parked cars, lamps, booth =====
 {let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};const cols=[0xc0392b,0x2c3e50,0xecf0f1,0x7f8c8d,0x2980b9,0x16a085,0xf39c12,0x111111,0x8e44ad,0xbdc3c7,0xd35400,0x27ae60];
  for(const r of rows)for(let k=0;k<29;k++)if(rnd()<.62)V(CAR(cols[Math.floor(rnd()*cols.length)]),r[0]-r[1]*.2,-161.85+k*2.7,r[1]*PI/2+(rnd()-.5)*.06);
  for(const x of[-357.5,-340.5])for(const z of[-150,-122,-94]){S.push(apCyl(.13,.18,9,6,x,4.5,z,0x555b63),apB(2.6,.18,.25,x,9,z,0x555b63));lt(x-1.1,8.85,z,3,2.9,2.5,.5);lt(x+1.1,8.85,z,3,2.9,2.5,.5)}
  S.push(apB(2.2,2.6,2.2,-322.5,1.3,-77,0xd5d9de),apB(2.6,.2,2.6,-322.5,2.7,-77,0x1d5fae));G.push(bxg(2.25,.9,2.25,-322.5,1.9,-77));
  S.push(apB(.3,1,.3,-324,.5,-77,0x333333));for(let k=0;k<6;k++)S.push(apB(.9,.15,.15,-324,1.1+k*.85,-77,k%2?0xd62828:W));
  S.push(apB(.2,4.4,.2,-337,2.2,-74,0x555b63),apB(2.3,2.3,.12,-337,4.6,-74.08,0x1d5fae));SGN('P',2.1,2.1,-337,4.6,-73.98,0);S.push(apB(4.6,.9,.12,-337,3.0,-74.08,0x1d5fae));SGN('park',4.4,.62,-337,3.0,-73.98,0);
  for(let z=-166;z<-80;z+=5)S.push(apCol(gT(new THREE.IcosahedronGeometry(.9,0),-319.5,.7,z+rnd()*2),0x3f7d3a));for(let z=-66;z<74;z+=6)S.push(apCol(gT(new THREE.IcosahedronGeometry(.8,0),-317.2,.6,z),0x4a8a3f))}
 // ===== entrance monument sign and taxiway / holding signs =====
 S.push(apB(1.2,3.4,13,-322.6,1.7,98,0x8a8f96),apB(1.4,.3,13.4,-322.6,3.5,98,0x555b63));SGN('mon',12.4,1,-321.95,2.3,98,PI/2);
 [-140,0,140].forEach((z,i)=>{for(const s of[-1,1]){const zz=z+s*8.2;S.push(apB(.3,1.1,3.3,-478,1,zz,0x111111),apB(.12,.6,.12,-478,.3,zz-1.2,0x555555),apB(.12,.6,.12,-478,.3,zz+1.2,0x555555));SGN('hold',2,.65,-477.83,1.05,zz-.62,PI/2);SGN('tw'+(3-i),1,.65,-477.83,1.05,zz+.95,PI/2)}});
 // ===== perimeter fence with barbed wire and warning signs =====
 const x0=X-245,x1=X-12,z0=-175,z1=175;const run=(ax,a,b,c)=>{const len=b-a,mid=(a+b)/2;if(ax==='x'){S.push(apB(len,.12,.12,mid,2.9,c,0x7d858e));for(const y of[3.25,3.55])S.push(apB(len,.04,.04,mid,y,c,0x9aa1a8));F.push(bxg(len,2.8,.04,mid,1.4,c));for(let v=a;v<=b+.01;v+=8)S.push(apB(.16,3.7,.16,v,1.85,c,0x7d858e));solids.push({minX:a,maxX:b,minZ:c-.3,maxZ:c+.3,h:3})}else{S.push(apB(.12,.12,len,c,2.9,mid,0x7d858e));for(const y of[3.25,3.55])S.push(apB(.04,.04,len,c,y,mid,0x9aa1a8));F.push(bxg(.04,2.8,len,c,1.4,mid));for(let v=a;v<=b+.01;v+=8)S.push(apB(.16,3.7,.16,c,1.85,v,0x7d858e));solids.push({minX:c-.3,maxX:c+.3,minZ:a,maxZ:b,h:3})}};
 run('x',x0,x1,z0);run('x',x0,x1,z1);run('z',z0,z1,x0);run('z',z0,72,x1);run('z',90,z1,x1);
 for(const z of[-140,-40,140])SGN('auth',3.2,.4,x1+.1,1.8,z,PI/2);for(const x of[-520,-430,-340])SGN('auth',3.2,.4,x,1.8,z0-.1,PI),SGN('auth',3.2,.4,x,1.8,z1+.1,0);
 S.push(apB(.7,4,.7,X-12,2,71.5,0x39424c),apB(.7,4,.7,X-12,2,90.5,0x39424c),apB(.3,.3,9,X-12,3.6,76.4,0xe63946),apB(3,2.6,3,X-9,1.3,68.5,0xcfd4da),apB(3.4,.3,3.4,X-9,2.75,68.5,0x555b63));
 // ===== windsock poles and the surveillance radar mast =====
 for(const w of[[apRX+21,105],[apRX-21,-105]]){S.push(apCyl(.08,.12,7,6,w[0],3.5,w[1],0xdddddd),apB(1.6,.12,1.6,w[0],.06,w[1],0x9a9da1));L.push(apRGB(bxg(.25,.25,.25,w[0],7.1,w[1]),3,.2,.1))}
 {const x=-466,z=75;for(const a of[-1.2,1.2])for(const b of[-1.2,1.2])S.push(apB(.22,14,.22,x+a,7,z+b,0xd0d4d8));
  for(let y=2;y<14;y+=3){for(const b of[-1.2,1.2]){S.push(apB(2.6,.12,.12,x,y,z+b,0xd0d4d8),apB(.12,.12,2.6,x+b,y,z,0xd0d4d8));for(const k of[-1,1]){const g=bxg(3.6,.08,.08,0,0,0);g.rotateZ(k*.89);g.translate(x,y+1.5,z+b);S.push(apCol(g,0xd0d4d8));const h=bxg(.08,.08,3.6,0,0,0);h.rotateX(k*.89);h.translate(x+b,y+1.5,z);S.push(apCol(h,0xd0d4d8))}}}
  S.push(apB(3.4,.3,3.4,x,14.1,z,0x8a9099),apCyl(.35,.45,1.2,8,x,14.8,z,0x555b63));solids.push({minX:x-1.4,maxX:x+1.4,minZ:z-1.4,maxZ:z+1.4,h:16});
  const rg=[apCol(gT(new THREE.CylinderGeometry(3.2,3.2,1.5,12,1,true,-.7,1.4),0,0,-3,-.25),0xe9ecef),apB(.15,.15,2.4,0,-.3,-1,0x8a9099),apB(.5,.5,.5,0,-.3,-2.2,0x555b63),apB(.4,.6,.4,0,-.5,0,0x555b63)];
  apRadar=new THREE.Mesh(U.mergeBufferGeometries(rg),apBodyMat);apRadar.position.set(x,16.1,z);apRadar.castShadow=true;scene.add(apRadar)}
 // ===== merge =====
 const mk=(arr,mat,sh)=>{const m=new THREE.Mesh(U.mergeBufferGeometries(arr),mat);m.castShadow=!!sh;m.receiveShadow=true;scene.add(m);return m};
 mk(A,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92}));mk(M,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
 mk(S,apMatS,1);mk(G,apGlassMat);mk(L,apLightMat).receiveShadow=false;mk(SG,apSignMat).receiveShadow=false;
 mk(F,new THREE.MeshBasicMaterial({color:0xaab3bd,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide})).receiveShadow=false;
 // windsocks (orange / white bands), turned by the wind in apTick
 {const a=[];for(let i=0;i<5;i++){const r0=.55-i*.075,r1=.55-(i+1)*.075,g=new THREE.CylinderGeometry(r1,r0,.62,10,1,true);g.rotateZ(-PI/2);g.translate(.31+i*.62,0,0);a.push(apCol(gT(g,0,0,0),i%2?0xf2f2f2:0xff5a00))}const sg=U.mergeBufferGeometries(a);
  for(const w of[[apRX+21,105],[apRX-21,-105]]){const m=new THREE.Mesh(sg,apBodyMat);m.position.set(w[0],6.8,w[1]);m.rotation.order='YZX';scene.add(m);apSock.push(m)}}
 // baggage train that loops along the airside service road
 {const tg=[],cg=[];V(TUG,0,0,0,tg);V(CART(0x2a6f97),0,0,0,cg);const t1=U.mergeBufferGeometries(tg),c1=U.mergeBufferGeometries(cg);for(let i=0;i<4;i++){const m=new THREE.Mesh(i?c1:t1,apMatS);m.castShadow=true;scene.add(m);apTrain.push(m)}}
 // rotating beacon
 apBeacon=new THREE.Group();apBeacon.position.set(X-52,36.6,52);const bb=new THREE.Mesh(new THREE.BoxGeometry(.9,.7,2.2),new THREE.MeshBasicMaterial({color:new THREE.Color(.6,3,1),toneMapped:false}));apBeacon.add(bb);
 const cg=new THREE.ConeGeometry(5,60,10,1,true);cg.translate(0,-30,0);cg.rotateX(-Math.PI/2);apCone=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({color:0xcfffe0,transparent:true,opacity:.07,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));apCone.rotation.x=.06;apBeacon.add(apCone);scene.add(apBeacon)}
// loop path of the baggage train: south along x=-370.3, U-turn, north along x=-373.5 (clear of the rotunda pillars and flood masts)
function apTrainAt(s){const r=1.6,cx=-371.9,Ls=216,Lc=Math.PI*r,Lt=2*Ls+2*Lc;s=((s%Lt)+Lt)%Lt;if(s<Ls)return [-370.3,-108+s];s-=Ls;if(s<Lc){const a=s/r;return [cx+Math.cos(a)*r,108+Math.sin(a)*r]}s-=Lc;if(s<Ls)return [-373.5,108-s];s-=Ls;const a=s/r;return [cx-Math.cos(a)*r,-108-Math.sin(a)*r]}
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
apMake('jet',0x16324f,apAX-68,133,0);apMake('jet',0x8a1c2b,apAX-108,30,Math.PI/2);apMake('liner',0x0b6e99,apAX-116,-38,Math.PI/2);
apMake('prop',0x2a9d8f,apAX-108,-100,Math.PI/2,true,6);apMake('jet',0x444b55,apAX-108,62,Math.PI/2,true,75);
// ----- airliners parked nose-in at the three gates (scenery: one merged mesh + one lights mesh) -----
{const SL=[],SN=[],cx=-391;for(const q of[[-55,0xc8102e],[-20,0x2a9d8f],[15,0xf2a100]]){const cz=q[0],G0=apGeo('liner',q[1]);for(const g of[G0.body,G0.gear]){const c=g.clone();c.rotateY(-Math.PI/2);c.translate(cx,0,cz);SL.push(c)}const n=G0.lights.clone();n.rotateY(-Math.PI/2);n.translate(cx,0,cz);SN.push(n);
  solids.push({minX:cx-19,maxX:cx+18.6,minZ:cz-2,maxZ:cz+2,h:6.3},{minX:cx+1,maxX:cx+5.8,minZ:cz-6.9,maxZ:cz-4.3,h:3.3},{minX:cx+1,maxX:cx+5.8,minZ:cz+4.3,maxZ:cz+6.9,h:3.3})}
 const b=new THREE.Mesh(U.mergeBufferGeometries(SL),apBodyMat);b.castShadow=true;b.receiveShadow=true;scene.add(b);scene.add(new THREE.Mesh(U.mergeBufferGeometries(SN),apNavMat))}
// ----- flight -----
let apJid=null,apKey=false,apBail=null,apWas=null,apWarn=0,apHudS='';
addEventListener('touchstart',e=>{for(const t of e.changedTouches)if(hit($('jump'),t))apJid=t.identifier},{passive:true});
{const up=e=>{for(const t of e.changedTouches)if(t.identifier===apJid)apJid=null;if(!e.touches||!e.touches.length)apJid=null};addEventListener('touchend',up);addEventListener('touchcancel',up)}
// laptop: the keyboard no longer holds apKey (Space is the brake); apKey stays for the on-screen throttle rocker. Keys come from vhK (vehicles module).
let apKx=0,apKy=0,apKr=0;
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
// kb (laptop keys) = null for touch, or {rud:-1..1, brk:bool, rev:bool}; with kb the throttle is a lever set in apTick (W/S) instead of hold-to-gas
function apSim(p,dt,jx,jy,held,piloted,kb){const T=p.T,m=p.m,r=m.rotation,air=m.position.y>.02,ox=m.position.x,oz=m.position.z;
 if(!kb)p.thr+=((held?1:0)-p.thr)*Math.min(1,dt*(held?1.3:(air?.16:.6)));
 p.speed+=(p.thr*T.acc-Math.max(0,p.speed)*T.acc/T.vmax)*dt;const pin=(apInvert?-1:1)*jy;let vy=0;
 if(air){const L=Math.min(1,p.speed/T.vs);p.speed-=Math.sin(r.x)*15*dt;if(kb&&kb.brk)p.speed-=7*dt;p.speed=Math.max(0,p.speed);
  r.x+=pin*T.pr*L*dt;if(Math.abs(jy)<.06)r.x+=((m.position.y<12&&p.thr>.5?.1:0)-r.x)*Math.min(1,dt*(kb?.4:.7));if(L<1)r.x+=(-.5-r.x)*(1-L)*dt*1.8;r.x=Math.max(-.85,Math.min(.8,r.x));
  r.z+=(-jx*T.maxRoll-r.z)*Math.min(1,dt*2.6);r.y+=r.z*T.turn*L*dt;if(kb&&kb.rud)r.y-=kb.rud*.32*L*dt;
  const sink=L<1?(1-L)*(1-L)*30+(1-L)*5:0;vy=Math.sin(r.x)*p.speed-sink;p.stall=L<1}
 else{p.stall=false;r.z+=(0-r.z)*Math.min(1,dt*6);const sa=Math.abs(p.speed),st=kb?Math.max(-1,Math.min(1,jx+kb.rud)):jx;
  r.y+=-st*dt*Math.min(1,sa/5)*1.15*(kb?Math.max(.3,1-sa/(T.vs*1.8)):1)*(p.speed<0?-1:1);
  if(kb&&kb.brk){if(p.speed>0)p.speed=Math.max(0,p.speed-20*dt);else p.speed=Math.min(0,p.speed+20*dt)}
  if(p.thr<.08){if(piloted&&(kb?kb.rev:jy>.35)&&p.speed<1)p.speed=Math.max(-5,p.speed-7*dt);else if(p.speed>0)p.speed=Math.max(0,p.speed-10*dt);else p.speed=Math.min(0,p.speed+8*dt)}
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
 if(!best.stolen){best.stolen=true;if(wantedScore<3)crime(3-wantedScore)}camPitch=.24;toast((best.type==='liner'?'STOLE AN AIRLINER!':'STOLE A PLANE!')+(vhKbLast?'':' Hold JUMP for throttle'));beep(500,.1,.12);return best}}
{const dm=drawMap;drawMap=function(){dm();if(pos.x>apAX+130)return;const g=mapC,S=260,sc=S/215;g.save();g.beginPath();g.arc(S/2,S/2,S/2-4,0,7);g.clip();g.translate(S/2,S/2);g.rotate(camYaw);g.translate(-pos.x*sc,-pos.z*sc);
 g.fillStyle='#777b80';g.fillRect((apAX-134)*sc,-120*sc,64*sc,270*sc);g.fillStyle='#3a3d42';g.fillRect((apTX-6)*sc,-150*sc,12*sc,300*sc);for(const z of[-140,0,140])g.fillRect((apRX+12)*sc,(z-6)*sc,32*sc,12*sc);g.fillRect((apAX-70)*sc,74*sc,70*sc,14*sc);
 g.fillStyle='#222428';g.fillRect((apRX-12)*sc,-150*sc,24*sc,300*sc);g.fillStyle='#fff';for(let z=-120;z<=120;z+=40)g.fillRect((apRX-.6)*sc,(z-8)*sc,1.2*sc,16*sc);
 for(const p of apPlanes){if(p.dead)continue;g.save();g.translate(p.m.position.x*sc,p.m.position.z*sc);g.rotate(-p.m.rotation.y);g.fillStyle=p===driving?'#ffd23f':'#e8f4ff';const k=p.type==='liner'?1.9:1;g.fillRect(-1.5*k,-8*k,3*k,16*k);g.fillRect(-9*k,-2*k,18*k,3.5*k);g.fillRect(-4*k,6*k,8*k,2*k);g.restore()}
 g.restore();if(!driving||driving.kind!=='plane'){g.save();g.translate(S/2,S/2);g.rotate(camYaw-facing);g.fillStyle='#fff';g.beginPath();g.moveTo(0,-12);g.lineTo(8,8);g.lineTo(-8,8);g.fill();g.restore()}}}
function apTick(dt){const sunH=Math.sin(dayT*Math.PI*2),night=1-Math.max(0,Math.min(1,sunH*3+.5));
 apLightMat.color.setScalar(.1+night*1.05);apGlassMat.emissiveIntensity=night*.55;apSignMat.emissiveIntensity=.25+night*1.6;apBeacon.rotation.y+=dt*2.2;apCone.visible=night>.35;
 // wind: socks swing around a slowly drifting direction; radar turns; baggage train loops the service road
 {const wd=.9+Math.sin(T*.05)*.5,ws=.55+.35*Math.sin(T*.31)*Math.sin(T*.13);for(const s of apSock){s.rotation.y=wd+Math.sin(T*1.7+s.position.z)*.08;s.rotation.z=-(1-ws)*.9+Math.sin(T*5.3+s.position.z)*.03}}
 apRadar.rotation.y+=dt*1.3;
 {const s0=T*4.2;for(let i=0;i<apTrain.length;i++){const s=s0-(i?.4+i*2.75:0),q=apTrainAt(s),q2=apTrainAt(s+.3),m=apTrain[i];m.position.set(q[0],0,q[1]);m.rotation.y=Math.atan2(-(q2[0]-q[0]),-(q2[1]-q[1]))}}
 let mine=driving&&driving.kind==='plane'&&apPlanes.indexOf(driving)>=0?driving:null;
 if(mine&&carQ&&state==='play'){carQ=false;apExit(mine);mine=null}
 let jx=joy.x,jy=joy.y;const jm=Math.hypot(jx,jy);if(jm<.22){jx=0;jy=0}else{const k=(jm-.22)/.78/jm;jx*=k;jy*=k}
 // laptop keys: A/D bank, Up/Down pitch (Down = nose up), Left/Right rudder, W/S throttle lever, Space brake
 let kb=null;if(mine&&state==='play'&&vhKbFly){const K=vhK,ramp=(v,t,up,dn)=>v+Math.max(-(t?up:dn)*dt,Math.min((t?up:dn)*dt,t-v));
  apKx=ramp(apKx,(K.KeyD?1:0)-(K.KeyA?1:0),3,7);apKy=ramp(apKy,(K.ArrowDown?1:0)-(K.ArrowUp?1:0),2.4,8);apKr=ramp(apKr,(K.ArrowRight?1:0)-(K.ArrowLeft?1:0),3,7);
  jx=apKx;jy=apKy;kb={rud:apKr,brk:!!K.Space,rev:!!K.KeyS&&mine.thr<.02};
  if(K.KeyW||apJid!==null||apKey)mine.thr=Math.min(1,mine.thr+dt*.55);if(K.KeyS)mine.thr=Math.max(0,mine.thr-dt*.7)}else{apKx=apKy=apKr=0}
 const strobe=(T*1.1%1)<.07;
 for(let i=apPlanes.length-1;i>=0;i--){const p=apPlanes[i];if(p.dead)continue;const m=p.m,on=p===mine&&state==='play';
  if(p.ai)apAI(p,dt);else if(p===mine||Math.abs(p.speed)>.05||m.position.y>.01||p.thr>.02)apSim(p,dt,on?jx:0,on?jy:0,on&&(apJid!==null||apKey),on,on?kb:null);
  if(p.dead)continue;p.strobe.visible=strobe&&(p===mine||!!p.ai||m.position.y>.5);if(p.gear&&p.T.gearUp)p.gear.visible=m.position.y<14;
  const sp=(p===mine||p.ai||p.thr>.03)?(14+p.thr*45):0;for(const q of p.props)q.rotation.z+=sp*dt}
 if(mine&&driving===mine){const m=mine.m,r=m.rotation;pos.copy(m.position);facing=r.y;vel.set(0,0,0);jumpQ=false;
  const a=-r.z*.35;cam.up.set(Math.cos(camYaw)*Math.sin(a),Math.cos(a),-Math.sin(camYaw)*Math.sin(a));
  if(apWas!==mine){apWas=mine;apHud.style.display='flex';$('jump').textContent='GAS';vhFlyHint('plane')}
  const gnd=m.position.y<.05,cue=gnd&&mine.speed>=mine.T.vs?'<br><span style="color:#7dff9a">ROTATE '+(vhKbFly?'&darr;':'&#9660;')+'</span>':(gnd&&vhKbFly&&kb&&kb.brk&&Math.abs(mine.speed)>.5?'<br><span style="color:#ffb347">BRAKE</span>':'');
  const s='ALT '+Math.round(m.position.y*3)+' ft<br>SPD '+Math.round(Math.abs(mine.speed)*2)+' kt<br>'+(mine.stall&&m.position.y>2?'<span style="color:#ff4040">STALL</span>':'THR '+Math.round(mine.thr*100)+'%')+cue;
  if(s!==apHudS){apHudS=s;$('apTx').innerHTML=s}$('apHz').style.transform='rotate('+(r.z*57.3).toFixed(1)+'deg) translateY('+(r.x*34).toFixed(1)+'px)'}
 else{if(apWas){apWas=null;apHud.style.display='none';$('jump').textContent='JUMP';cam.up.set(0,1,0)}
  if(!driving&&state==='play')for(const p of apPlanes){const m=p.m,T=p.T;if(m.position.y>1||T.cy-T.r>2.2||pos.y>T.cy+T.r)continue;const sy=Math.sin(m.rotation.y),cw=Math.cos(m.rotation.y),dx=pos.x-m.position.x,dz=pos.z-m.position.z,t=Math.max(-T.nose,Math.min(T.nose,-(dx*sy+dz*cw))),ex=dx+sy*t,ez=dz+cw*t,d=Math.hypot(ex,ez),R=T.r+.5;if(d<R&&d>.001){pos.x+=ex/d*(R-d);pos.z+=ez/d*(R-d)}}}
 if(apBail){const b=apBail;if(state!=='play'||driving){apBail=null;apChute.visible=false}
  else if(onGround&&b.t>.15){if(!b.chute){const d=(-b.vy-22)*4;if(d>0){hurt(d);shake=.6;if(state==='play')toast(d>60?'OUCH!':'Hard landing')}}else toast('Nice landing');apBail=null;apChute.visible=false}
  else{b.t+=dt;b.vy=vel.y;if(!b.chute&&b.t>.7&&b.h>25&&pos.y>12){b.chute=true;toast('Parachute open! Steer with the stick')}if(b.chute){vel.y=Math.max(vel.y,-6.5);apChute.visible=true;apChute.position.set(pos.x,pos.y,pos.z);apChute.rotation.y=facing}}}}
{const ex=explode;explode=function(q){ex(q);for(const p of apPlanes)if(!p.dead&&!p.boom&&p.m.position.distanceTo(q)<p.T.nose*.5+5){p.boom=true;setTimeout(()=>apCrash(p),350)}}}
MODS.push(apTick);
function apWestOK(p){return p.x>-HALF-250}
