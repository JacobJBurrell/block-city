// ---------- isles: city-themed islands east of the mainland, bridges, and many more vehicle types ----------
// Island names are original. Themes: beach resort (art-deco strip), dense tower grid with a central park, neon casino strip, neon lane district with a lattice tower, cliff-and-canal village, cargo port, volcano.
const isGY=.35;
const isRX=HALF+250,isRZ=-40,isRA=110,isRB=130;          // Coral Key (resort)
const isMX=HALF+500,isMZ=-40,isMA=80,isMB=130;           // Metro Isle (tower grid)
const isSX=HALF+500,isSZ=330,isSA=90,isSB=70;            // Lucky Sands (casino strip)
const isHX=HALF+560,isHZ=-330,isHA=70,isHB=80;           // Hikari (neon lanes)
const isLX=HALF+176,isLZ=620,isLR=48;                    // Porto Luna (cliff village)
const isPX=HALF+230,isPZ=300,isPA=88,isPB=80;            // Port Ironside
const isWX=HALF+330,isWZ=-360,isWR=96;                   // Ember Isle (volcano)
const isIslets=[[HALF+126,190,13],[HALF+415,130,11],[HALF+150,-262,12],[HALF+640,150,9],[HALF+120,430,10]],isPlat=[HALF+450,205];
const isBZ=roadCenter(3);
const isBr=[{ax:'x',c:isBZ,lo:HALF+8,hi:HALF+200,h:7,r0:38,r1:32,g0:0,g1:isGY,w:10.6,st:'susp',name:'Sunrise Bridge'},
 {ax:'x',c:isRZ-14,lo:HALF+346,hi:HALF+432,h:6,r0:12,r1:12,g0:isGY,g1:isGY,w:10.6,st:'stone',name:'Harbor Span'},
 {ax:'x',c:isSZ,lo:HALF+308,hi:HALF+420,h:2.4,r0:10,r1:10,g0:isGY,g1:isGY,w:10.6,st:'cause',name:'Sands Causeway'},
 {ax:'z',c:HALF+542,lo:-262,hi:-158,h:5,r0:10,r1:10,g0:isGY,g1:isGY,w:10.6,st:'truss',name:'Lantern Bridge'}];
function isSm(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
function isWildH(x,z){const d=Math.hypot(x-isWX,z-isWZ);if(d>isWR)return -1;const e=isSm((isWR-d)/20),dp=Math.hypot(x-isWX-20,z-isWZ+16);let pk=Math.pow(Math.max(0,1-dp/62),1.7)*42;if(dp<8)pk-=(8-dp)*1.1;
 let b=1.6+1.4*Math.sin(x*.09)*Math.cos(z*.11)+.8*Math.sin(x*.21+z*.17);const fx=Math.abs(x-isWX+18),fz=Math.abs(z-isWZ-58);const fl=isSm((fx-34)/8)+isSm((fz-7)/5);b*=Math.min(1,fl);pk*=Math.min(1,fl+isSm((dp-30)/20));return isGY+e*Math.max(0,pk+Math.max(0,b))}
function isBrH(B,along){if(along<B.lo||along>B.hi)return -1;if(along<B.lo+B.r0)return B.g0+(B.h-B.g0)*isSm((along-B.lo)/B.r0);if(along>B.hi-B.r1)return B.g1+(B.h-B.g1)*isSm((B.hi-along)/B.r1);return B.h}
function isBridgeH(x,z){let h=-1;for(const B of isBr){const a=B.ax==='x'?x:z,c=B.ax==='x'?z:x;if(Math.abs(c-B.c)>B.w/2)continue;h=Math.max(h,isBrH(B,a))}return h}
function isOnBridge(x,z){for(const B of isBr){const a=B.ax==='x'?x:z,c=B.ax==='x'?z:x;if(a>=B.lo&&a<=B.hi&&Math.abs(c-B.c)<B.w/2+3)return B}return null}
function isIsleH(x,z){if(x<HALF+60)return -1;const a=(x-isRX)/isRA,b=(z-isRZ)/isRB;if(a*a+b*b<=1)return isGY;
 if(Math.abs(x-isMX)<=isMA&&Math.abs(z-isMZ)<=isMB)return isGY;if(Math.abs(x-isSX)<=isSA&&Math.abs(z-isSZ)<=isSB)return isGY;if(Math.abs(x-isHX)<=isHA&&Math.abs(z-isHZ)<=isHB)return isGY;
 if(Math.abs(x-isPX)<=isPA&&Math.abs(z-isPZ)<=isPB)return isGY;if(Math.hypot(x-isLX,z-isLZ)<=isLR)return isGY;const w=isWildH(x,z);if(w>=0)return w;
 for(const q of isIslets)if(Math.hypot(x-q[0],z-q[1])<q[2])return isGY;return -1}
function isLandAt(x,z){return Math.max(isBridgeH(x,z),isIsleH(x,z))}
function isNearShore(x,z){if(x<HALF+56)return {x:HALF+44,z:z};for(let r=3;r<=14;r+=2.75)for(let k=0;k<16;k++){const a=k*Math.PI/8,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;if(isIsleH(px,pz)>=0&&isIsleH(x+Math.cos(a)*(r+2),z+Math.sin(a)*(r+2))>=0)return {x:x+Math.cos(a)*(r+2),z:z+Math.sin(a)*(r+2)}}return null}
// shapes for the map module (land colour fill), see report
const isMapShapes=[{k:'e',x:isRX,z:isRZ,a:isRA,b:isRB,c:'#e6d6a0'},{k:'r',x:isMX,z:isMZ,a:isMA,b:isMB,c:'#9a9ea3'},{k:'r',x:isSX,z:isSZ,a:isSA,b:isSB,c:'#d9c28f'},{k:'r',x:isHX,z:isHZ,a:isHA,b:isHB,c:'#8f9399'},
 {k:'r',x:isPX,z:isPZ,a:isPA,b:isPB,c:'#7d8085'},{k:'c',x:isLX,z:isLZ,a:isLR,b:isLR,c:'#d8c39a'},{k:'c',x:isWX,z:isWZ,a:isWR,b:isWR,c:'#3f7d3e'}];
for(const q of isIslets)isMapShapes.push({k:'c',x:q[0],z:q[1],a:q[2],b:q[2],c:'#e6d6a0'});
for(const B of isBr)isMapShapes.push(B.ax==='x'?{k:'b',x0:B.lo,z0:B.c,x1:B.hi,z1:B.c,w:B.w,c:'#55585d'}:{k:'b',x0:B.c,z0:B.lo,x1:B.c,z1:B.hi,w:B.w,c:'#55585d'});
// ----- geometry helpers: static scenery is baked into a few merged meshes per island -----
const isCol=new THREE.Color();
function isG(geo,hex,x,y,z,ry,rx,rz){let g=geo.index?geo.toNonIndexed():geo;if(g.attributes.uv)g.deleteAttribute('uv');if(rx)g.rotateX(rx);if(rz)g.rotateZ(rz);if(ry)g.rotateY(ry);g.translate(x||0,y||0,z||0);isCol.set(hex);const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=isCol.r;a[i*3+1]=isCol.g;a[i*3+2]=isCol.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
const isB=(w,h,d,hex,x,y,z,ry,rx,rz)=>isG(new THREE.BoxGeometry(w,h,d),hex,x,y,z,ry,rx,rz);
const isCy=(r1,r2,h,n,hex,x,y,z,ry,rx,rz)=>isG(new THREE.CylinderGeometry(r1,r2,h,n),hex,x,y,z,ry,rx,rz);
const isMatV=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:.05}),isMatGlow=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});
const isWT=canvasTex(128,128,g=>{g.fillStyle='#ececec';g.fillRect(0,0,128,128);for(let r=0;r<4;r++)for(let c=0;c<4;c++){g.fillStyle='#2a3440';g.fillRect(6+c*32,6+r*32,20,22);const gr=g.createLinearGradient(0,8+r*32,0,26+r*32);gr.addColorStop(0,'#a9c0d2');gr.addColorStop(1,'#3e5468');g.fillStyle=gr;g.fillRect(8+c*32,8+r*32,16,18)}g.fillStyle='rgba(0,0,0,.16)';for(let r=0;r<4;r++)g.fillRect(0,30+r*32,128,2)});
const isWE=canvasTex(128,128,g=>{g.fillStyle='#000';g.fillRect(0,0,128,128);const cols=['#ffd9a0','#bfe0ff','#fff3c8'];for(let r=0;r<4;r++)for(let c=0;c<4;c++)if((r*5+c*3+r*c)%3!==0){g.fillStyle=cols[(r+c)%3];g.globalAlpha=.55+((r*7+c)%4)*.12;g.fillRect(8+c*32,8+r*32,16,18);g.globalAlpha=1}});
const isTwMat=new THREE.MeshStandardMaterial({map:isWT,emissiveMap:isWE,emissive:0xffffff,emissiveIntensity:0,vertexColors:true,roughness:.45,metalness:.2});winMats.push(isTwMat);
const isSol=[],isGroups=[];let isDraws=0;
function isSolid(x0,x1,z0,z1,h){const s={minX:x0,maxX:x1,minZ:z0,maxZ:z1,h:h};isSol.push(s);solids.push(s);return s}
function isMesh(list,mat,grp,shadow){if(!list.length)return null;const m=new THREE.Mesh(U.mergeBufferGeometries(list),mat||isMatV);m.castShadow=!!shadow;m.receiveShadow=true;grp.add(m);isDraws++;return m}
function isGroup(name,x,z,r){const g=new THREE.Group();g.name=name;g.userData.c=[x,z,r];scene.add(g);isGroups.push(g);return g}
function isTw(list,x,z,w,d,h,hex,y0,noSolid){y0=y0===undefined?isGY:y0;const g=new THREE.BoxGeometry(w,h,d).toNonIndexed(),uv=g.attributes.uv,n=uv.count,ou=Math.floor(Math.random()*4)*.25,ov=Math.floor(Math.random()*4)*.25;
 for(let i=0;i<n;i++){const f=Math.floor(i/6);if(f===2||f===3){uv.setXY(i,.01,.01);continue}const sp=f<2?d:w;uv.setXY(i,uv.getX(i)*sp/12+ou,uv.getY(i)*h/12+ov)}
 g.translate(x,y0+h/2,z);isCol.set(hex);const a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=isCol.r;a[i*3+1]=isCol.g;a[i*3+2]=isCol.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));list.push(g);if(!noSolid)isSolid(x-w/2,x+w/2,z-d/2,z+d/2,y0+h);return g}
// palms (one instanced mesh for every island) and simple round trees
const isPalmGeo=(()=>{const a=[isCy(.16,.26,6.4,6,0x7a5a36,0,3.2,0,0,0,.06)];for(let k=0;k<7;k++){const an=k*Math.PI*2/7;a.push(isB(.9,.08,3.4,0x2f8f3a,Math.sin(an)*1.6,6.2,Math.cos(an)*1.6,an,.38))}a.push(isG(new THREE.IcosahedronGeometry(.35,0),0x5b3d1e,0,6.2,0));return U.mergeBufferGeometries(a)})();
const isPalmAt=[];function isPalm(x,z,y,s){isPalmAt.push([x,y===undefined?isGY:y,z,s||(.85+Math.random()*.5)])}
function isTree(L,x,z,s,y){s=s||1;y=y===undefined?isGY:y;L.push(isCy(.16*s,.24*s,2.6*s,6,0x6b4a2a,x,y+1.3*s,z),isG(new THREE.IcosahedronGeometry(1.7*s,1),[0x3a8f3a,0x2f7d32,0x4a9a3f][Math.floor(Math.abs(x*7+z*3))%3],x,y+3.5*s,z))}
const isFx={jets:null,beams:[],flick:[]};
// ===== bridges =====
for(const B of isBr){const g=isGroup(B.name,B.ax==='x'?(B.lo+B.hi)/2:B.c,B.ax==='x'?B.c:(B.lo+B.hi)/2,(B.hi-B.lo)/2+20),L=[],N=[];
 const deckC=B.st==='susp'?0xc8452f:B.st==='stone'?0x9c8f7a:B.st==='truss'?0x3d6b8a:0x8d9299;
 const seg=(a0,a1)=>{const y0=isBrH(B,a0),y1=isBrH(B,a1),len=Math.hypot(a1-a0,y1-y0),an=Math.atan2(y1-y0,a1-a0),m=(a0+a1)/2,ym=(y0+y1)/2;
  L.push(isB(len+.3,.5,B.w,0x34373c,m,ym-.26,0,0,0,an),isB(len+.3,.06,.3,0xf4d03f,m,ym+.02,0,0,0,an));for(const s of[-B.w/2+.1,B.w/2-.1])L.push(isB(len+.3,1,.25,0xb9bec6,m,ym+.5,s,0,0,an))};
 for(let a=B.lo;a<B.hi-.01;a+=6.3)seg(a,Math.min(B.hi,a+6.3));
 const span0=B.lo+B.r0,span1=B.hi-B.r1;
 for(let a=span0;a<=span1;a+=(B.st==='cause'?14:24))for(const s of[-3.4,3.4])L.push(isCy(.7,.9,B.h+1,8,0x8d9299,a,(B.h-1)/2,s));
 const lampsEvery=B.st==='cause'?14:18;for(let a=span0+4;a<span1;a+=lampsEvery){L.push(isB(.2,4.5,.2,0x30343a,a,B.h+2.2,-B.w/2+.4));N.push(isB(.9,.25,.5,0xfff0c0,a,B.h+4.4,-B.w/2+.8))}
 const towers=[];
 if(B.st==='susp'||B.st==='stone'){const t1=span0+(B.st==='susp'?26:12),t2=span1-(B.st==='susp'?26:12),TH=B.st==='susp'?34:24;towers.push(t1,t2);
  for(const tx of[t1,t2]){if(B.st==='susp'){for(const s of[-6,6])L.push(isB(2.2,TH,2.2,deckC,tx,TH/2-2,s));L.push(isB(2,1.6,14,deckC,tx,TH-3,0),isB(2,1.2,14,deckC,tx,TH*.55,0))}
   else{for(const s of[-5.3,5.3])L.push(isB(4,TH,3.6,deckC,tx,TH/2-2,s));L.push(isB(4,4,14.2,deckC,tx,TH-3,0),isB(4.2,1.2,15,0x8a7d68,tx,TH-.6,0),isCy(1.6,1.6,4.1,10,deckC,tx,TH-5.8,0,0,0,Math.PI/2));for(const s of[-5.3,5.3])L.push(isCy(.2,1.9,2.4,4,0x8a7d68,tx,TH+1,s,Math.PI/4))}
   N.push(isB(.5,.5,.5,0xff3030,tx,TH+.2,-5),isB(.5,.5,.5,0xff3030,tx,TH+.2,5))}
  const top=TH-1.8,cab=(a0,y0,a1,y1)=>{const len=Math.hypot(a1-a0,y1-y0),an=Math.atan2(y1-y0,a1-a0);for(const s of[-5.6,5.6])L.push(isB(len,.22,.22,0xd9dde3,(a0+a1)/2,(y0+y1)/2,s,0,0,an))};
  const n=8;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,y=u=>B.h+1.2+(top-B.h-1.2)*Math.pow(2*u-1,2);cab(t1+(t2-t1)*u0,y(u0),t1+(t2-t1)*u1,y(u1));if(i>0)for(const s of[-5.6,5.6])L.push(isB(.12,y(u0)-B.h,.12,0xd9dde3,t1+(t2-t1)*u0,(y(u0)+B.h)/2,s))}
  cab(span0-4,isBrH(B,span0-4)+1.2,t1,top);cab(t2,top,span1+4,isBrH(B,span1+4)+1.2)}
 if(B.st==='truss'){for(let a=span0;a<span1;a+=8){for(const s of[-5.4,5.4]){L.push(isB(8.2,.35,.35,deckC,a+4,B.h+6,s),isB(.35,6,.35,deckC,a,B.h+3,s),isB(Math.hypot(8,6),.3,.3,deckC,a+4,B.h+3,s,0,0,Math.atan2(6,8)*((Math.round(a/8)%2)?1:-1)))}L.push(isB(.35,.35,11,deckC,a,B.h+6,0))}}
 for(const q of[L,N])for(const geo of q){if(B.ax==='z'){geo.rotateY(-Math.PI/2);geo.translate(B.c,0,0)}else geo.translate(0,0,B.c)}
 for(const tx of towers)for(const s of[-6,6]){const w=B.st==='stone'?4:2.2;if(B.ax==='x')isSolid(tx-w/2,tx+w/2,B.c+s-1.1,B.c+s+1.1,30);else isSolid(B.c-s-1.1,B.c-s+1.1,tx-w/2,tx+w/2,30)}
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)}
// ===== CORAL KEY: beach resort with an art-deco strip =====
let isHeliPads=[];
(function(){const g=isGroup('Coral Key',isRX,isRZ,150),L=[],N=[],TW=[],X=isRX,Z=isRZ;
 const el=(rx,rz,h,hex,y,cx)=>{const q=isCy(1,1.03,h,48,hex,0,0,0);q.scale(rx,1,rz);q.translate(cx===undefined?X:cx,y,Z);return q};
 L.push(el(isRA,isRB,1.6,0xe6d6a0,isGY-.8),el(isRA-22,isRB-13,.1,0x58b05a,isGY+.03,X-11));
 const rw=9,bx=[-34,0,34],bz=[-52,-14,24,62];for(const x of bx)L.push(isB(rw,.08,bz[3]-bz[0]+rw,0x2f3136,X+x,isGY+.1,Z+(bz[0]+bz[3])/2));for(const z of bz)L.push(isB(bx[2]-bx[0]+rw+10,.08,rw,0x2f3136,X+5,isGY+.11,Z+z));
 L.push(isB(64,.08,rw,0x2f3136,X-66,isGY+.1,isBZ),isB(rw,.08,Math.abs(isBZ-(Z+bz[0]))+rw,0x2f3136,X-34,isGY+.1,(isBZ+Z+bz[0])/2));
 L.push(isB(rw,.08,190,0x2f3136,X+44,isGY+.1,Z-5),isB(52,.08,rw,0x2f3136,X+72,isGY+.1,Z-14));
 for(const x of bx)for(let z=bz[0]+6;z<bz[3];z+=9)L.push(isB(.25,.02,3.6,0xf4d03f,X+x,isGY+.16,Z+z));for(let z=-96;z<88;z+=9)L.push(isB(.25,.02,3.6,0xf4d03f,X+44,isGY+.16,Z+z));
 const pals=[0xf7b7c5,0xa8e6cf,0x8fd8e8,0xffd3a5,0xfff1d0,0xc9b6f2,0xffffff];let k=0;
 for(let i=0;i<2;i++)for(let j=0;j<3;j++){const cx=X+(bx[i]+bx[i+1])/2,cz=Z+(bz[j]+bz[j+1])/2,w=34-rw-3,d=(bz[j+1]-bz[j])-rw-3;L.push(isB(w+2.4,.3,d+2.4,0x9a9c9f,cx,isGY+.12,cz));
  if(i===1&&j===1){L.push(isB(w,.1,d,0x4cbf55,cx,isGY+.3,cz),isCy(3.2,3.6,.9,20,0xe9e9e9,cx,isGY+.6,cz),isCy(2.8,2.8,.15,20,0x39b0ff,cx,isGY+1,cz));isSolid(cx-3.4,cx+3.4,cz-3.4,cz+3.4,1.4);for(const s of[[-7,-7],[7,7],[-7,7],[7,-7]])isPalm(cx+s[0],cz+s[1])}
  else{const h=10+((k*7)%5)*5+(i===0&&j===0?22:0);isTw(TW,cx,cz,w,d,h,pals[k%pals.length]);L.push(isB(w+.5,.5,d+.5,0x4a4d52,cx,isGY+h+.2,cz));k++}}
 // the deco strip: low pastel hotels with rounded corners and neon fins, facing the beach
 const deco=[0xf7a8c4,0xa8e6cf,0x8fd8e8,0xffd3a5,0xc9b6f2,0xfff1a8,0xffffff],neon=[0xff4fd8,0x3cf2ff,0xffe14d,0x7dff6a,0xff7a3c];
 [-84,-62,-38,12,34,56,78].forEach((oz,i)=>{const cx=X+58,cz=Z+oz,w=13,d=16,h=12+(i%3)*4,col=deco[i%deco.length],nc=neon[i%neon.length];isTw(TW,cx-1,cz,w-2,d,h,col);
  for(const s of[-1,1])L.push(isCy(2,2,h,14,col,cx+w/2-2.2,isGY+h/2,cz+s*(d/2-2)));L.push(isB(w+.6,.6,d+.6,0xffffff,cx,isGY+h+.3,cz),isB(w+.8,.4,d+.8,col,cx,isGY+3.6,cz),isB(3,.3,d*.7,0xffffff,cx+w/2+1.4,isGY+3.4,cz));
  N.push(isB(.5,h*.75,1.3,nc,cx+w/2+.2,isGY+h*.55,cz),isB(.15,.35,d-1,nc,cx+w/2+.3,isGY+h+.3,cz),isB(.15,.25,d-3,nc,cx+w/2+.35,isGY+3.2,cz));
  for(let u=-6;u<=6;u+=3){L.push(isB(1.6,.15,.8,0xffffff,cx+w/2+3.2,isGY+.9,cz+u),isCy(.06,.06,1,4,0x30343a,cx+w/2+3.2,isGY+.5,cz+u))}});
 for(let z=-92;z<=86;z+=12){if(Math.abs(z+14)<8)continue;const ex=X+isRA*Math.sqrt(Math.max(0,1-Math.pow(z/isRB,2)));if(ex-X<82)continue;const ux=X+76+((z*7)%9+9)%9;L.push(isCy(1.7,0,.6,8,[0xff5a5a,0xffd23f,0x4dd0ff,0xffffff][Math.abs(z)%4],ux,isGY+2.4,Z+z),isCy(.05,.05,2.2,5,0xdddddd,ux,isGY+1.2,Z+z),isB(.9,.08,1.9,[0x2e86c1,0xe74c3c,0xf1c40f][Math.abs(z)%3],ux+1.6,isGY+.05,Z+z+.4));isPalm(X+70,Z+z+6)}
 for(const q of isBuildingsBig())isTw(TW,q[0],q[1],q[2],q[3],q[4],q[5]);
 function isBuildingsBig(){return [[X-2,Z+96,30,18,46,0xffffff],[X-30,Z+96,14,14,30,0x8fd8e8]]}
 L.push(isB(24,.3,9,0xf2ead8,X-2,isGY+.12,Z+80),isB(22,.12,7,0x35c3f2,X-2,isGY+.24,Z+80));
 const bcx=X-64,bcz=Z+22;L.push(isB(20,.3,14,0xb98a5a,bcx,isGY+.2,bcz),isB(22,.4,16,0xf3efe6,bcx,isGY+5,bcz));for(const s of[[-9,-6],[9,-6],[-9,6],[9,6]])L.push(isCy(.3,.3,5,8,0xf3efe6,bcx+s[0],isGY+2.5,bcz+s[1]));L.push(isB(8,1.1,1.6,0x6b4a2a,bcx,isGY+.8,bcz-3));N.push(isB(10,.5,.2,0xff4fd8,bcx,isGY+5.6,bcz+8.1));
 const gx=X+10,gz=Z-110;{const q=isCy(1,1,.08,32,0x3fae55,0,0,0);q.scale(38,1,14);q.translate(gx,isGY+.1,gz);L.push(q);const p=isCy(1,1,.08,20,0x7bd86a,0,0,0);p.scale(7,1,5);p.translate(gx+24,isGY+.14,gz-2);L.push(p);
  L.push(isCy(.05,.05,3,5,0xffffff,gx+25,isGY+1.5,gz-2),isB(.9,.5,.04,0xff3030,gx+25.5,isGY+2.7,gz-2))}
 const hx=X-82,hz=Z-58;for(let i=0;i<3;i++){L.push(isB(26,.4,2.2,0x8a6a45,hx-18,isGY+.05,hz+i*12));for(let u=0;u<26;u+=6)L.push(isCy(.25,.25,2.4,6,0x5a4630,hx-30+u,isGY-.8,hz+i*12+1.2))}
 const yacht=(x,z,s,ry)=>{const y=[isB(3.2*s,1.4*s,11*s,0xffffff,0,.7*s,0),isB(2.8*s,1.1*s,5*s,0xf4f4f4,0,1.9*s,.8*s),isB(2.2*s,.9*s,2.8*s,0xffffff,0,2.9*s,1.2*s),isB(2.9*s,.5*s,4.6*s,0x1c2a3a,0,2*s,.8*s),isCy(1.6*s,0,3*s,4,0xffffff,0,.7*s,-6.9*s,0,-Math.PI/2)];for(const q of y){q.rotateY(ry);q.translate(x,isGY-.3,z);L.push(q)}};
 yacht(hx-22,hz+6,1,1.57);yacht(hx-16,hz+18,.8,1.57);yacht(hx-24,hz-7,1.2,1.57);
 const lx=X+52,lz=Z-104;for(let i=0;i<5;i++)L.push(isCy(2.6-i*.3,2.9-i*.3,4.4,14,i%2?0xd63a2f:0xffffff,lx,isGY+2.2+i*4.4,lz));L.push(isCy(2.2,2.2,.4,14,0x30343a,lx,isGY+22.2,lz),isCy(1.2,1.2,2.2,10,0x9fd7ff,lx,isGY+23.5,lz),isCy(.2,1.9,1.6,12,0xd63a2f,lx,isGY+25.4,lz));N.push(isCy(.9,.9,1.6,8,0xfff3b0,lx,isGY+23.5,lz));isSolid(lx-3,lx+3,lz-3,lz+3,26);
 const hp=[X-62,Z-80];isHeliPads.push(hp);L.push(isCy(6,6.3,.2,24,0x55585d,hp[0],isGY+.1,hp[1]),isCy(4.6,4.6,.03,24,0xffd23f,hp[0],isGY+.22,hp[1]),isCy(4.2,4.2,.03,24,0x55585d,hp[0],isGY+.23,hp[1]),isB(.5,.03,3,0xffffff,hp[0]-1,isGY+.25,hp[1]),isB(.5,.03,3,0xffffff,hp[0]+1,isGY+.25,hp[1]),isB(2,.03,.5,0xffffff,hp[0],isGY+.25,hp[1]));
 for(let z=bz[0]+4;z<bz[3];z+=9.5){isPalm(X+bx[1]-5.4,Z+z);isPalm(X+bx[1]+5.4,Z+z)}for(let a=0;a<6.28;a+=.23){const px=X+Math.cos(a)*(isRA-7),pz=Z+Math.sin(a)*(isRB-7);if(Math.abs(pz-isBZ)<9&&Math.cos(a)<0)continue;if(Math.abs(pz-(Z-14))<9&&Math.cos(a)>0)continue;isPalm(px,pz)}
 isMesh(L,null,g,true);isMesh(TW,isTwMat,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== METRO ISLE: dense tower grid, central park, waterfront =====
const isMAv=[0,1,2,3,4,5].map(i=>isMX-70+i*28),isMSt=[-150,-126,-102,-78,-54,-30,-6,18,42,66].map(v=>v+isMZ+40),isMPark=[isMAv[2]+4,isMAv[4]-4,isMSt[1]+3.5,isMSt[5]-3.5];
(function(){const g=isGroup('Metro Isle',isMX,isMZ,160),L=[],N=[],TW=[],X=isMX,Z=isMZ;
 L.push(isB(isMA*2,1.8,isMB*2,0x8f9296,X,isGY-.9,Z),isB(isMA*2+1,1.2,1,0x6d7176,X,isGY,Z-isMB),isB(isMA*2+1,1.2,1,0x6d7176,X,isGY,Z+isMB),isB(1,1.2,isMB*2,0x6d7176,X-isMA,isGY,Z),isB(1,1.2,isMB*2,0x6d7176,X+isMA,isGY,Z));
 for(const ax of isMAv){L.push(isB(8,.08,isMB*2-2,0x2b2d31,ax,isGY+.05,Z));for(let z=Z-isMB+4;z<Z+isMB;z+=8)L.push(isB(.25,.02,3.4,0xf4d03f,ax,isGY+.1,z))}
 for(const sz of isMSt)L.push(isB(isMA*2-2,.08,7,0x2b2d31,X,isGY+.06,sz));
 for(const ax of isMAv)for(const sz of isMSt)for(const s of[-1,1]){for(let u=-2.6;u<=2.6;u+=1.3)L.push(isB(.6,.02,2.2,0xf2f2f2,ax+u,isGY+.11,sz+s*5.2))}
 // central park with a lake, paths and trees
 {const P=isMPark,cx=(P[0]+P[1])/2,cz=(P[2]+P[3])/2,w=P[1]-P[0],d=P[3]-P[2];L.push(isB(w+1.2,.6,d+1.2,0x7a7468,cx,isGY+.18,cz),isB(w,.2,d,0x4caf50,cx,isGY+.5,cz));
  const lk=isCy(1,1,.1,28,0x2f86c8,0,0,0);lk.scale(13,1,22);lk.translate(cx+6,isGY+.62,cz+14);L.push(lk);
  L.push(isB(2.2,.06,d-4,0xd8c9a3,cx-10,isGY+.63,cz),isB(w-4,.06,2.2,0xd8c9a3,cx,isGY+.63,cz-24),isB(w-4,.06,2.2,0xd8c9a3,cx,isGY+.63,cz-4));
  for(let i=0;i<46;i++){const x=P[0]+3+((i*37)%(w-6)),z=P[2]+3+((i*53)%(d-6));if(Math.hypot((x-cx-6)/14,(z-cz-14)/23)<1)continue;if(Math.abs(x-cx+10)<2.5||Math.abs(z-cz+24)<2.5||Math.abs(z-cz+4)<2.5)continue;isTree(L,x,z,.9+(i%4)*.12,isGY+.6)}
  for(const q of[[P[0],P[2]],[P[1],P[2]],[P[0],P[3]],[P[1],P[3]]])isSolid(q[0]-.6,q[0]+.6,q[1]-.6,q[1]+.6,1)}
 const pal=[0xa0522d,0x8b5a3c,0xd8cfc0,0x9aa3ab,0x6f8fa8,0xe8dcc0,0x5a5f66,0xb98d6b,0xc4c9cf];
 const xe=[X-isMA,...isMAv,X+isMA],ze=[Z-isMB,...isMSt,Z+isMB];let k=0;const spire=[isMAv[3],isMAv[4],isMSt[7],isMSt[8]];
 for(let i=0;i<xe.length-1;i++)for(let j=0;j<ze.length-1;j++){const x0=xe[i]+(i===0?2:4),x1=xe[i+1]-(i===xe.length-2?2:4),z0=ze[j]+(j===0?2:3.5),z1=ze[j+1]-(j===ze.length-2?2:3.5);if(x1-x0<6||z1-z0<6)continue;
  const cx=(x0+x1)/2,cz=(z0+z1)/2;if(cx>isMPark[0]&&cx<isMPark[1]&&cz>isMPark[2]&&cz<isMPark[3])continue;
  L.push(isB(x1-x0+1.6,.25,z1-z0+1.6,0xa8aaad,cx,isGY+.1,cz));
  if(xe[i]===spire[0]&&ze[j]===spire[2]){const tiers=[[18,58],[14,30],[10,20],[6,12]];let y=isGY;tiers.forEach((t,ti)=>{isTw(TW,cx,cz,t[0],t[0],t[1],0xd9d2c0,y,ti>0);y+=t[1];N.push(isB(t[0]+.4,.3,t[0]+.4,0xfff1c8,cx,y-.6,cz))});L.push(isCy(.3,2.2,22,8,0xcfd3d8,cx,y+11,cz));N.push(isB(.4,.4,.4,0xff3030,cx,y+22.4,cz));k++;continue}
  const cf=1-Math.min(1,Math.hypot(cx-X,(cz-Z)*.6)/110),split=(x1-x0>14)?2:1,sw=(x1-x0-(split-1)*1.2)/split;
  for(let s=0;s<split;s++){const bxp=x0+sw/2+s*(sw+1.2),h=Math.round(16+Math.pow(Math.random(),1.3)*(34+cf*92)),col=pal[(k*5+s*3)%pal.length];isTw(TW,bxp,cz,sw,z1-z0,h,col);
   L.push(isB(sw+.4,.6,z1-z0+.4,0x4a4d52,bxp,isGY+h+.3,cz));
   if(h>70){const h2=14+Math.random()*26;isTw(TW,bxp,cz,sw*.66,(z1-z0)*.66,h2,col,isGY+h,true);N.push(isB(.5,.5,.5,0xff3030,bxp,isGY+h+h2+.6,cz))}
   else if(h<58&&Math.random()<.45){const wx=bxp+(Math.random()-.5)*sw*.4,wz=cz+(Math.random()-.5)*(z1-z0)*.4,y=isGY+h+.6;for(const q of[[-.9,-.9],[.9,-.9],[-.9,.9],[.9,.9]])L.push(isB(.15,1.8,.15,0x3b2a1a,wx+q[0],y+.9,wz+q[1]));L.push(isCy(1.4,1.4,2.2,10,0x8a6a45,wx,y+2.9,wz),isCy(0,1.6,1,10,0x5a4630,wx,y+4.5,wz))}}
  k++}
 for(let z=Z-isMB+10;z<Z+isMB;z+=34)L.push(isB(14,.4,2.4,0x8a6a45,X-isMA-7,isGY-.05,z));
 isMesh(L,null,g,true);isMesh(TW,isTwMat,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== LUCKY SANDS: neon casino strip and fountain lake =====
(function(){const g=isGroup('Lucky Sands',isSX,isSZ,140),L=[],N=[],TW=[],X=isSX,Z=isSZ;
 L.push(isB(isSA*2,1.8,isSB*2,0xd9c28f,X,isGY-.9,Z),isB(isSA*2-4,.06,isSB*2-4,0xcdb27a,X,isGY+.02,Z));
 L.push(isB(isSA*2,.08,16,0x2b2d31,X,isGY+.06,Z),isB(isSA*2-6,.3,2.6,0x3f7d3e,X,isGY+.2,Z),isB(10,.08,isSB*2,0x2b2d31,X,isGY+.07,Z));
 for(let x=X-isSA+8;x<X+isSA;x+=11){if(Math.abs(x-X)<8)continue;isPalm(x,Z,isGY+.3,1.1)}
 for(const s of[-1,1])L.push(isB(isSA*2,.25,4,0xb7b1a5,X,isGY+.12,Z+s*10));
 // pyramid casino with a sky beam
 {const px=X-58,pz=Z-40,q=isCy(.01,24,34,4,0x1c1f26,px,isGY+17,pz,Math.PI/4);L.push(q,isB(30,.6,30,0x2a2d33,px,isGY+.3,pz));N.push(isB(10,4,.4,0xffd27a,px,isGY+4,pz+17.2),isB(30.5,.3,.3,0xffe08a,px,isGY+.9,pz+15.2));isSolid(px-15,px+15,pz-15,pz+15,30);
  const bm=new THREE.Mesh(new THREE.CylinderGeometry(.9,1.6,220,10,1,true),new THREE.MeshBasicMaterial({color:0xfff3d0,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));bm.position.set(px,isGY+34+110,pz);g.add(bm);isFx.beams.push(bm);isDraws++}
 // three-wing hotel tower
 {const cx=X-4,cz=Z-40;for(let i=0;i<3;i++){const a=i*Math.PI*2/3+Math.PI/2,ox=Math.cos(a)*13,oz=Math.sin(a)*13;const geo=isTw(TW,0,0,10,26,62-i*6,0xe0c070,isGY,true);geo.translate(-0,0,0);geo.rotateY(-a+Math.PI/2);geo.translate(cx+ox,0,cz+oz)}L.push(isCy(7,7,70,12,0xe0c070,cx,isGY+35,cz));N.push(isB(.3,6,12,0xff3c8e,cx+7.2,isGY+64,cz),isB(.3,6,12,0xff3c8e,cx-7.2,isGY+64,cz));isSolid(cx-16,cx+16,cz-16,cz+16,62);
  L.push(isB(44,9,16,0xf2ead8,cx,isGY+4.5,cz+24));N.push(isB(40,1.2,.3,0x3cf2ff,cx,isGY+8.6,cz+32.2),isB(40,.4,.3,0xff4fd8,cx,isGY+6.8,cz+32.2));isSolid(cx-22,cx+22,cz+16,cz+32,9)}
 // observation needle and its casino
 {const nx=X+56,nz=Z-46;L.push(isCy(2.4,3.2,100,12,0xd9dde3,nx,isGY+50,nz),isCy(9,7,8,20,0xf2f2f2,nx,isGY+104,nz),isCy(.3,1,22,8,0xd9dde3,nx,isGY+119,nz));N.push(isCy(9.2,9.2,.8,20,0x3cf2ff,nx,isGY+102,nz),isB(.6,.6,.6,0xff3030,nx,isGY+130.6,nz));isSolid(nx-3.2,nx+3.2,nz-3.2,nz+3.2,100);
  isTw(TW,nx,Z-18,30,14,14,0xc9b6f2);N.push(isB(28,2.4,.3,0xffe14d,nx,isGY+11,Z-10.8),isB(.3,12,3,0xff4fd8,nx-15.3,isGY+8,Z-14))}
 // castle casino
 {const cx=X-58,cz=Z+38;isTw(TW,cx,cz,30,20,20,0xffffff);const tc=[0xd63a2f,0x2e86c1,0xf1c40f];[[-15,-10],[15,-10],[-15,10],[15,10],[-6,-10],[6,-10]].forEach((q,i)=>{const h=24+(i%3)*5;L.push(isCy(3,3,h,12,0xf4f4f4,cx+q[0],isGY+h/2,cz+q[1]),isCy(0,3.8,7,12,tc[i%3],cx+q[0],isGY+h+3.5,cz+q[1]));N.push(isCy(3.1,3.1,.4,12,0xffe14d,cx+q[0],isGY+h-.8,cz+q[1]))});
  N.push(isB(22,3,.3,0xff7a3c,cx,isGY+16,cz-10.3),isB(30,.4,.3,0x3cf2ff,cx,isGY+2.5,cz-10.3));isSolid(cx-18,cx+18,cz-13,cz+13,24)}
 // fountain lake and the curved resort behind it
 {const fx=X+4,fz=Z+22,lk=isCy(1,1,.4,32,0x1d86c8,0,0,0);lk.scale(30,1,8);lk.translate(fx,isGY+.05,fz);L.push(lk);const rim=isCy(1,1,.6,32,0xe7dfcf,0,0,0);rim.scale(31.5,1,9.4);rim.translate(fx,isGY,fz);L.push(rim);isSolid(fx-30,fx+30,fz-7,fz+7,.9);
  for(let i=0;i<5;i++){const a=-.55+i*.275,r=58,bxp=fx+Math.sin(a)*r,bzp=fz+52-Math.cos(a)*r+10;const geo=isTw(TW,0,0,16,12,50,0xf2e6d0,isGY,true);geo.rotateY(-a);geo.translate(bxp,0,bzp);isSolid(bxp-8,bxp+8,bzp-6,bzp+6,50)}
  N.push(isB(46,1.2,.3,0xffe14d,fx,isGY+44,fz+21));
  const J=[];for(let i=0;i<17;i++){const x=fx-26+i*3.25,z=fz+Math.sin(i*.9)*3;J.push(isCy(.12,.35,1,6,0xdff6ff,x,.5,z))}const jm=new THREE.Mesh(U.mergeBufferGeometries(J),new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.75,depthWrite:false,toneMapped:false}));jm.position.y=isGY;g.add(jm);isDraws++;isFx.jets=jm}
 // gold glass tower
 {const tx=X+58,tz=Z+40;isTw(TW,tx,tz,22,22,64,0xd8b45a);isTw(TW,tx,tz,15,15,18,0xd8b45a,isGY+64,true);N.push(isB(22.4,.5,22.4,0xffe08a,tx,isGY+64,tz),isB(.3,14,8,0xff4fd8,tx-11.2,isGY+20,tz))}
 // giant marquee pylons along the strip
 [[-78,-11],[-30,-11],[30,-11],[78,-11],[-78,11],[-30,11],[30,11],[78,11]].forEach((q,i)=>{const x=X+q[0],z=Z+q[1],c=[0xff4fd8,0x3cf2ff,0xffe14d,0x7dff6a][i%4];L.push(isB(1.2,20,1.2,0x30343a,x,isGY+10,z),isB(7,9,1.4,0x1c1f26,x,isGY+17,z));N.push(isB(6.4,8.2,1.5,c,x,isGY+17,z),isB(7.4,.5,1.6,0xffffff,x,isGY+21.8,z));isSolid(x-.7,x+.7,z-.7,z+.7,20)});
 isMesh(L,null,g,true);isMesh(TW,isTwMat,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g);g.userData.neon=1})();
// ===== HIKARI: narrow neon lanes, scramble crossing, lattice tower, temple =====
const isHLx=[804,826,846,868,890,912].map(v=>v-864+isHX),isHLz=[-400,-378,-356,-334,-312,-290,-268].map(v=>v+330+isHZ);
(function(){const g=isGroup('Hikari',isHX,isHZ,140),L=[],N=[],TW=[],X=isHX,Z=isHZ;
 L.push(isB(isHA*2,1.8,isHB*2,0x8f9399,X,isGY-.9,Z));
 for(const x of isHLx)L.push(isB(6,.08,isHB*2-2,0x34363b,x,isGY+.05,Z));for(const z of isHLz)L.push(isB(isHA*2-2,.08,6,0x34363b,X,isGY+.06,z));
 {const cx=isHLx[2],cz=isHLz[3];for(let u=-2.4;u<=2.4;u+=1.2)for(const s of[-1,1]){L.push(isB(.6,.02,2,0xf2f2f2,cx+u,isGY+.11,cz+s*4.2),isB(2,.02,.6,0xf2f2f2,cx+s*4.2,isGY+.11,cz+u))}for(let u=-3;u<=3;u+=1)for(const a of[Math.PI/4,-Math.PI/4])L.push(isB(.5,.02,1.6,0xf2f2f2,cx+u*Math.cos(a),isGY+.12,cz+u*Math.sin(a),a))}
 const pal=[0x8a8f96,0x6d737b,0xb7a99a,0x4f555d,0xa3a8ae,0x7c6f64,0x5e6a73,0xc2b8ad,0x9b8f84],nc=[0xff3c8e,0x3cf2ff,0xffe14d,0xff4d4d,0x7dff6a,0xffffff,0xb46bff,0xff9a3c];
 const xe=[X-isHA,...isHLx,X+isHA],ze=[Z-isHB,...isHLz,Z+isHB];let k=0;
 for(let i=0;i<xe.length-1;i++)for(let j=0;j<ze.length-1;j++){const x0=xe[i]+(i===0?2:3),x1=xe[i+1]-(i===xe.length-2?2:3),z0=ze[j]+(j===0?2:3),z1=ze[j+1]-(j===ze.length-2?2:3);if(x1-x0<5||z1-z0<5)continue;const cx=(x0+x1)/2,cz=(z0+z1)/2;
  if(i===5&&j===1){// lattice tower
   const y0=isGY,H=96,tc=[0xe8442e,0xf4f4f4];for(const q of[[-1,-1],[1,-1],[-1,1],[1,1]]){for(let s=0;s<6;s++){const t0=s/6,t1=(s+1)/6,r0=7*(1-t0*.85),r1=7*(1-t1*.85),hh=H*.62/6,len=Math.hypot(hh,(r0-r1)*1.414);L.push(isB(.7,len,.7,tc[s%2],cx+q[0]*(r0+r1)/2,y0+hh*(s+.5),cz+q[1]*(r0+r1)/2,0,-q[1]*Math.atan2(r0-r1,hh),q[0]*Math.atan2(r0-r1,hh)))}}
   for(const t of[.2,.4,.62]){const r=7*(1-t*.85/.62*.62);L.push(isB(r*2+1.2,.5,r*2+1.2,tc[0],cx,y0+H*t,cz))}L.push(isB(4.8,4,4.8,0xf4f4f4,cx,y0+H*.62+2,cz),isCy(.8,1.4,H*.38,8,0xe8442e,cx,y0+H*.81,cz));N.push(isB(5,.4,5,0xffe14d,cx,y0+H*.62+.4,cz),isB(.6,.6,.6,0xff3030,cx,y0+H+.3,cz));for(const q of[[-1,-1],[1,-1],[-1,1],[1,1]])isSolid(cx+q[0]*7-1,cx+q[0]*7+1,cz+q[1]*7-1,cz+q[1]*7+1,6);k++;continue}
  if(i===1&&j===5){// temple garden with a pagoda and a red gate
   L.push(isB(x1-x0,.2,z1-z0,0xd7cfbf,cx,isGY+.1,cz));for(let t=0;t<3;t++){const s=7-t*1.6,y=isGY+.2+t*4;L.push(isB(s,3.4,s,0x7a1f17,cx,y+1.7,cz),isCy(0,s*.95,1.4,4,0x2b2b30,cx,y+3.9,cz,Math.PI/4))}L.push(isCy(.15,.15,3,6,0xd9a520,cx,isGY+14,cz));isSolid(cx-3.5,cx+3.5,cz-3.5,cz+3.5,12);
   const gz=z1+.5;for(const s of[-2.4,2.4])L.push(isCy(.3,.35,5,8,0xd63a2f,cx+s,isGY+2.5,gz));L.push(isB(6.6,.5,.6,0x1c1c1c,cx,isGY+5.2,gz),isB(5.6,.35,.45,0xd63a2f,cx,isGY+4.2,gz));isTree(L,cx-5,cz-5,.8);isTree(L,cx+5,cz-5,.7);k++;continue}
  const split=(x1-x0>12)?2:1,sw=(x1-x0-(split-1)*.8)/split;
  for(let s=0;s<split;s++){const bxp=x0+sw/2+s*(sw+.8),h=Math.round(12+Math.pow(Math.random(),1.2)*30+(j<3?6:0)),col=pal[(k*3+s)%pal.length],d=z1-z0;isTw(TW,bxp,cz,sw,d,h,col);L.push(isB(sw+.3,.5,d+.3,0x4a4d52,bxp,isGY+h+.25,cz));
   for(const f of[-1,1]){const fz=cz+f*(d/2+.18),c1=nc[(k+s*2+(f>0?1:0))%nc.length],sh=Math.min(h-3,6+((k*7+s)%4)*2.5);N.push(isB(1.9,sh,.3,c1,bxp-sw/2+1.4,isGY+3+sh/2,fz),isB(sw-.6,.9,.3,nc[(k+s+3)%nc.length],bxp,isGY+2.6,fz));if(sw>7)N.push(isB(1.2,Math.max(2,sh-2),.25,nc[(k*5+s+f+8)%nc.length],bxp+sw/2-1.2,isGY+3.5+(sh-2)/2,fz))}
   for(const f of[-1,1])for(let u=-d/2+3;u<=d/2-3;u+=Math.max(6,d/2)){const bs=Math.min(h-6,3+((k+Math.round(u))%3)*1.6);if(bs<2.5)continue;N.push(isB(.8,bs,.2,nc[(k*3+s+Math.round(u)+(f>0?2:0)+16)%nc.length],bxp+f*(sw/2+.45),isGY+5+bs/2,cz+u))}
   L.push(isB(sw,.2,1.4,0x2b2b30,bxp,isGY+3.4,cz-d/2-.7),isB(sw,.2,1.4,0x2b2b30,bxp,isGY+3.4,cz+d/2+.7))}
  k++}
 for(let i=0;i<18;i++){const x=X-isHA+6+((i*29)%(isHA*2-12)),z=isHLz[i%isHLz.length];L.push(isB(.12,4.5,.12,0x30343a,x,isGY+2.2,z+3.4));N.push(isB(.5,.3,.5,0xfff3c8,x,isGY+4.5,z+3.4))}
 for(let z=Z-isHB+10;z<Z+isHB;z+=40)L.push(isB(12,.4,2.4,0x8a6a45,X+isHA+6,isGY-.05,z));
 isMesh(L,null,g,true);isMesh(TW,isTwMat,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g);g.userData.neon=1})();
// ===== PORTO LUNA: cliff village with terraces, canal, bell tower =====
(function(){const g=isGroup('Porto Luna',isLX,isLZ,70),L=[],N=[],X=isLX,Z=isLZ;
 L.push(isCy(isLR,isLR+2,1.6,40,0xd8c39a,X,isGY-.8,Z),isCy(isLR-1,isLR-1,.06,40,0xcbb38a,X,isGY+.02,Z));
 const tr=[[44,34,5,0],[30,24,10,-2],[17,14,15,-4]],house=[0xf7c59f,0xf4a6a6,0xfff1a8,0xf2d0a4,0xe8b4b8,0xfde2c4,0xd9e6c3];let k=0;
 tr.forEach((t,ti)=>{const cz=Z-6+t[3];L.push(isB(t[0],t[2],t[1],ti===0?0xb79f7d:0xc6ae8a,X,isGY+t[2]/2,cz));isSolid(X-t[0]/2,X+t[0]/2,cz-t[1]/2,cz+t[1]/2,isGY+t[2]);
  const nxt=tr[ti+1];for(let u=-t[0]/2+3;u<=t[0]/2-3;u+=5.4){const hz=cz+t[1]/2-3;if(nxt&&Math.abs(u)<nxt[0]/2+1&&hz<Z-6+nxt[3]+nxt[1]/2+2)continue;const hh=4+((k*3)%3)*1.2,col=house[k%house.length];L.push(isB(4.6,hh,4.2,col,X+u,isGY+t[2]+hh/2,hz),isCy(0,3.6,1.8,4,0xb5523b,X+u,isGY+t[2]+hh+.9,hz,Math.PI/4),isB(1,1.4,.1,0x3b6e8f,X+u,isGY+t[2]+hh*.6,hz+2.12));k++}});
 {const y=isGY+15;L.push(isB(4,22,4,0xb5523b,X,y+11,Z-10),isCy(0,3.2,4,4,0x8a3b28,X,y+24,Z-10,Math.PI/4));N.push(isB(4.1,1,4.1,0xfff3b0,X,y+19,Z-10))}
 {const y=isGY+10;L.push(isB(10,7,8,0xf4efe6,X+9,y+3.5,Z-4));const dm=new THREE.SphereGeometry(4,16,8,0,Math.PI*2,0,Math.PI/2);L.push(isG(dm,0xc9d6df,X+9,y+7,Z-4))}
 for(let a=0;a<6.28;a+=.42){const r=isLR-5,hx=X+Math.cos(a)*r,hz=Z+Math.sin(a)*r;if(Math.sin(a)>.55)continue;if(Math.abs(hz-isLZ-30)<6)continue;const col=house[k%house.length],hh=4.5+(k%3);L.push(isB(4.4,hh,4.4,col,hx,isGY+hh/2,hz,-a),isCy(0,3.5,1.6,4,0xb5523b,hx,isGY+hh+.8,hz,Math.PI/4-a));isSolid(hx-2.2,hx+2.2,hz-2.2,hz+2.2,hh);k++}
 const cz=Z+30;L.push(isB(78,.1,5,0x2f86c8,X,isGY+.04,cz),isB(78,.3,.5,0xd8c39a,X,isGY+.15,cz-2.8),isB(78,.3,.5,0xd8c39a,X,isGY+.15,cz+2.8));
 for(const bx of[X-14,X+12]){L.push(isB(2.6,.3,3,0xe8dccb,bx,isGY+1.1,cz),isB(2.6,.3,2.4,0xe8dccb,bx,isGY+.6,cz-2.4,0,.42),isB(2.6,.3,2.4,0xe8dccb,bx,isGY+.6,cz+2.4,0,-.42));for(const s2 of[-1.2,1.2])L.push(isB(.15,.6,7.4,0xd8c9b0,bx+s2,isGY+1.4,cz))}
 for(const q of[[-28,1],[2,-1],[26,1]]){L.push(isB(.9,.35,6,0x111111,X+q[0],isGY+.2,cz+q[1]*.6),isB(.2,1,.2,0x111111,X+q[0],isGY+.6,cz+q[1]*.6+2.8))}
 for(let i=0;i<4;i++)L.push(isB(14,.4,2.2,0x8a6a45,X-isLR-6,isGY-.05,Z-12+i*8));
 for(let a=.2;a<6.28;a+=.7)isTree(L,X+Math.cos(a)*(isLR-12),Z+Math.sin(a)*(isLR-12)*.9,.6);
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== PORT IRONSIDE: cargo port =====
(function(){const g=isGroup('Port Ironside',isPX,isPZ,130),L=[],N=[],X=isPX,Z=isPZ;
 L.push(isB(isPA*2,1.8,isPB*2,0x7d8085,X,isGY-.9,Z),isB(isPA*2-6,.06,isPB*2-6,0x55585c,X,isGY+.03,Z));
 for(let u=-isPA+6;u<isPA;u+=12)L.push(isB(5,.03,.5,0xf4d03f,X+u,isGY+.08,Z+6));L.push(isB(70,.08,10.6,0x2b2d31,X+isPA-35,isGY+.06,isSZ));
 const cg=new THREE.BoxGeometry(2.6,2.7,7),cm=new THREE.MeshStandardMaterial({roughness:.7,metalness:.3}),spots=[];
 for(let r=0;r<4;r++)for(let c=0;c<7;c++){const n=1+((r*5+c*3)%4);for(let s=0;s<n;s++)spots.push([X-70+c*8.4,isGY+1.35+s*2.7,Z-58+r*3.1+(r>1?8:0)]);isSolid(X-70+c*8.4-3.5,X-70+c*8.4+3.5,Z-58+r*3.1+(r>1?8:0)-1.3,Z-58+r*3.1+(r>1?8:0)+1.3,n*2.7+.4)}
 const ci=new THREE.InstancedMesh(cg,cm,spots.length),dm=new THREE.Object3D(),cc=[0xc0392b,0x2471a3,0x1e8449,0xd68910,0x7d3c98,0x5d6d7e,0xe5e7e9];spots.forEach((p,i)=>{dm.position.set(p[0],p[1],p[2]);dm.rotation.y=Math.PI/2;dm.updateMatrix();ci.setMatrixAt(i,dm.matrix);ci.setColorAt(i,isCol.set(cc[(i*7+Math.floor(p[2]))%cc.length]))});ci.castShadow=true;g.add(ci);isDraws++;
 for(const cz of[-40,5,50]){const cx=X+isPA-12;for(const s of[[-5,-6],[5,-6],[-5,6],[5,6]])L.push(isB(1.1,26,1.1,0xe07b1f,cx+s[0],isGY+13,Z+cz+s[1]));L.push(isB(12,1.4,14,0xe07b1f,cx,isGY+26,Z+cz),isB(46,1.6,2.2,0xe07b1f,cx+12,isGY+28,Z+cz),isB(3,2.4,3,0xf4f4f4,cx+16,isGY+26,Z+cz),isB(.3,12,.3,0x30343a,cx+24,isGY+21,Z+cz),isB(2.8,.5,7.2,0x30343a,cx+24,isGY+15,Z+cz));N.push(isB(.5,.5,.5,0xff3030,cx+34,isGY+29.2,Z+cz));for(const s of[[-5,-6],[5,-6],[-5,6],[5,6]])isSolid(cx+s[0]-.6,cx+s[0]+.6,Z+cz+s[1]-.6,Z+cz+s[1]+.6,26)}
 {const sx=X+isPA+13,sz=Z-26,h=[isB(15,6.5,92,0x1f2d3d,sx,1.6,sz),isB(15.2,1,92.2,0xb03a2e,sx,-1.4,sz),isB(13,9,11,0xf4f4f4,sx,9.2,sz+36),isB(14.5,.5,12,0x30343a,sx,13.9,sz+36),isCy(1.6,1.6,4.5,10,0xd68910,sx,16.2,sz+38)];for(const q of h)L.push(q);for(let r=0;r<8;r++)for(let c=0;c<4;c++){const n=1+((r+c*2)%3);for(let s=0;s<n;s++)L.push(isB(2.6,2.7,7,cc[(r*3+c+s)%cc.length],sx-4.5+c*3,6.2+s*2.7,sz-38+r*8))}isSolid(sx-7.6,sx+7.6,sz-46,sz+46,7)}
 for(const q of[[-52,40,34,22,11,0x8fa3b5],[-10,44,30,22,10,0xb5a48f],[-52,-4,26,16,9,0x9aa7a0]]){L.push(isB(q[2],q[4],q[3],q[5],X+q[0],isGY+q[4]/2,Z+q[1]));const rf=isCy(1,1,q[2]+1,3,0x5d6166,0,0,0,0,0,Math.PI/2);rf.scale(1,2.6,q[3]*.58);rf.translate(X+q[0],isGY+q[4]+1.2,Z+q[1]);L.push(rf);L.push(isB(7,6,.3,0x2c2f33,X+q[0],isGY+3,Z+q[1]-q[3]/2-.1));isSolid(X+q[0]-q[2]/2,X+q[0]+q[2]/2,Z+q[1]-q[3]/2,Z+q[1]+q[3]/2,q[4]+3)}
 for(let i=0;i<5;i++){const tx=X+32+(i%3)*15,tz=Z+40+Math.floor(i/3)*14;L.push(isCy(5.5,5.5,9,20,0xe9ecef,tx,isGY+4.5,tz),isCy(5.6,5.6,.5,20,0xb03a2e,tx,isGY+7.5,tz),isCy(.1,5.5,1.2,20,0xdfe3e6,tx,isGY+9.6,tz));isSolid(tx-5.5,tx+5.5,tz-5.5,tz+5.5,10)}
 for(const tz of[-22,-17]){L.push(isB(120,.12,.22,0x8d8f92,X-14,isGY+.14,Z+tz-.75),isB(120,.12,.22,0x8d8f92,X-14,isGY+.14,Z+tz+.75));for(let u=-74;u<46;u+=3)L.push(isB(.4,.08,2.4,0x5a4630,X+u,isGY+.08,Z+tz))}
 for(let i=0;i<5;i++){const wx=X-60+i*13;L.push(isB(11.5,3,2.7,i===0?0x2c3e50:cc[i%cc.length],wx,isGY+2.2,Z-22),isB(11.8,.5,2.9,0x222222,wx,isGY+.6,Z-22));if(i===0)L.push(isB(3,1.6,2.6,0xf1c40f,wx-3.5,isGY+4.4,Z-22))}isSolid(X-66,X-2,Z-23.5,Z-20.5,4);
 for(const q of[[-20,-40],[14,-52],[20,20]]){L.push(isB(1.6,1.2,2.6,0xf1c40f,X+q[0],isGY+.9,Z+q[1]),isB(.15,3.2,.15,0x30343a,X+q[0]-.5,isGY+1.9,Z+q[1]-1.5),isB(.15,3.2,.15,0x30343a,X+q[0]+.5,isGY+1.9,Z+q[1]-1.5),isB(1.3,.1,1.6,0x30343a,X+q[0],isGY+.5,Z+q[1]-2.2),isB(1.5,.1,1.5,0x30343a,X+q[0],isGY+2.5,Z+q[1]+.3))}
 for(const q of[[-80,-70],[0,-70],[70,-70],[-80,70],[0,70]]){L.push(isB(.4,16,.4,0x8d9299,X+q[0],isGY+8,Z+q[1]));N.push(isB(2.4,.5,1,0xfff3c8,X+q[0],isGY+16.2,Z+q[1]))}
 L.push(isB(22,.5,3,0x8a6a45,X-isPA-10,isGY-.05,Z-30));
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== EMBER ISLE: volcano, jungle, waterfall, hidden airstrip =====
(function(){const g=isGroup('Ember Isle',isWX,isWZ,125),L=[],N=[],X=isWX,Z=isWZ;
 const pg=new THREE.PlaneGeometry(204,204,56,56);pg.rotateX(-Math.PI/2);pg.translate(X,0,Z);const P=pg.attributes.position,ca=new Float32Array(P.count*3),c=new THREE.Color(),c2=new THREE.Color();
 for(let i=0;i<P.count;i++){const x=P.getX(i),z=P.getZ(i);let h=isWildH(x,z);const d=Math.hypot(x-X,z-Z);if(h<0)h=-2.5-(d-isWR)*.2;P.setY(i,h);
  if(h<-.4)c.set(0x1a5f8f);else if(h<1.1)c.set(0xe6d6a0);else if(h<14)c.set(0x2f8a3c).lerp(c2.set(0x256e30),((i*7)%10)/16);else if(h<27)c.set(0x4d6b3a).lerp(c2.set(0x6b6258),isSm((h-14)/13));else c.set(0x5a5049).lerp(c2.set(0x2b2422),isSm((h-27)/12));
  const fx=Math.abs(x-X+18),fz=Math.abs(z-Z-58);if(fx<33&&fz<5.5&&h<1.2)c.set(0x6b5a44);ca[i*3]=c.r;ca[i*3+1]=c.g;ca[i*3+2]=c.b}
 pg.setAttribute('color',new THREE.BufferAttribute(ca,3));pg.computeVertexNormals();const tm=new THREE.Mesh(pg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95}));tm.receiveShadow=true;g.add(tm);isDraws++;
 const H=(x,z)=>Math.max(isGY,isWildH(x,z));
 N.push(isCy(6.5,5,.6,14,0xff5a14,X+20,H(X+20,Z-16)+.5,Z-16));g.userData.smoke=new THREE.Vector3(X+20,H(X+20,Z-16)+2,Z-16);
 for(let i=0;i<9;i++){const u=i/8,x=X+10-u*22,z=Z-10+u*10,y=H(x,z);N.push(isB(3,.5,3.2,i%2?0xbfe6ff:0x8fd0ff,x,y+.3,z,.4))}{const px=X-15,pz=Z+3;const p=isCy(1,1,.2,18,0x2fa8e8,0,0,0);p.scale(8,1,6);p.translate(px,H(px,pz)+.25,pz);L.push(p)}
 for(let u=-28;u<=28;u+=8)L.push(isB(4,.05,.5,0xf3f3f3,X-18+u,isGY+.14,Z+58));L.push(isB(.2,5,.2,0xdddddd,X+18,isGY+2.5,Z+50),isCy(.5,.2,2,8,0xff7a1a,X+19.1,isGY+4.8,Z+50,0,0,Math.PI/2),isB(5,3,4,0x7a5a36,X-50,isGY+1.5,Z+48),isB(5.6,.3,4.6,0x8c3b2a,X-50,isGY+3.1,Z+48));isSolid(X-52.5,X-47.5,Z+46,Z+50,3.5);
 {const rx=X-46,rz=Z-38,ry=H(rx,rz);L.push(isB(16,.6,12,0x9a917f,rx,ry+.1,rz));for(const s of[[-6,-4.5],[-2,-4.5],[2,-4.5],[6,-4.5],[-6,4.5],[6,4.5],[2,4.5]])L.push(isCy(.6,.7,2+((s[0]+9)%4)*1.2,8,0xb3aa98,rx+s[0],ry+1.6+((s[0]+9)%4)*.6,rz+s[1]));L.push(isB(9,.7,1.3,0xb3aa98,rx+2,ry+5.4,rz-4.5),isB(2,1.4,2,0x8d8676,rx-2,ry+.9,rz+1))}
 {const cx=X-58,cz=Z+22;for(const s of[[0,0,0xd35400],[5,3,0x2e86c1],[-3,6,0x27ae60]])L.push(isCy(.1,2.2,2.6,4,s[2],cx+s[0],isGY+1.3,cz+s[1],.6));L.push(isCy(.9,.9,.25,8,0x4a4038,cx+2,isGY+.2,cz+4));N.push(isCy(.1,.5,.9,6,0xff8a2a,cx+2,isGY+.75,cz+4));L.push(isB(8,.4,2.2,0x8a6a45,cx-14,isGY,cz+2))}
 let n=0;for(let i=0;i<900&&n<70;i++){const a=(i*2.399),r=18+((i*37)%74),x=X+Math.cos(a)*r,z=Z+Math.sin(a)*r,h=isWildH(x,z);if(h<.6||h>20)continue;const fx=Math.abs(x-X+18),fz=Math.abs(z-Z-58);if(fx<40&&fz<10)continue;isPalm(x,z,h-.1,.8+((i*13)%7)*.09);n++}
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
// ===== islets, sandbars, sea platform =====
(function(){const g=isGroup('Islets',HALF+300,150,560),L=[],N=[];for(const q of isIslets){const e=isCy(1,1.05,1.5,18,0xe6d6a0,0,0,0);e.scale(q[2],1,q[2]*.8);e.translate(q[0],isGY-.75,q[1]);L.push(e);isPalm(q[0]-2,q[1]+1);isPalm(q[0]+3,q[1]-2);L.push(isG(new THREE.IcosahedronGeometry(1.6,0),0x7d7a72,q[0]+4,isGY+.5,q[1]+3))}
 const px=isPlat[0],pz=isPlat[1];for(const s of[[-7,-7],[7,-7],[-7,7],[7,7]])L.push(isCy(1,1,11,10,0xd9a520,px+s[0],2,pz+s[1]));L.push(isB(20,1,20,0x6d7278,px,7.5,pz),isB(7,4,6,0xe9ecef,px-5,10,pz-5),isCy(4.5,4.5,.1,20,0xffd23f,px+4,8.06,pz+4),isCy(4,4,.1,20,0x55585d,px+4,8.08,pz+4),isB(.6,14,.6,0xc0392b,px-8,15,pz+8),isB(.4,.4,12,0xc0392b,px-8,21,pz+3));N.push(isB(.6,.6,.6,0xff3030,px-8,22.4,pz+8));solids.push({minX:px-10,maxX:px+10,minZ:pz-10,maxZ:pz+10,h:8});
 isMesh(L,null,g,true);g.userData.glow=isMesh(N,isMatGlow.clone(),g)})();
{const im=new THREE.InstancedMesh(isPalmGeo,isMatV,isPalmAt.length),d=new THREE.Object3D();isPalmAt.forEach((p,i)=>{d.position.set(p[0],p[1],p[2]);d.rotation.y=i*1.7;d.scale.setScalar(p[3]);d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.castShadow=true;im.frustumCulled=false;scene.add(im);isDraws++}

// ===== vehicle types =====
const isTY={},isVMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.2}),isVGlow=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});
function isCarGeo(s){const L2=s.L/2,W=s.W,gc=s.gc,body=[],dark=[],ex=[],gl=[],glass=[];
 if(s.box){body.push(prof([[-L2,gc],[L2,gc],[L2,s.belt],[L2-s.ws,s.roof],[-L2,s.roof]],W,.08));glass.push(prof([[L2+.02,s.belt+.08],[L2-s.ws+.03,s.roof-.14],[L2-s.ws-.05,s.roof-.14],[L2-.06,s.belt+.08]],W-.3,.03));
  const wl=s.L-s.ws-1.2-(s.cargo||0);if(wl>1)for(const x of[-W/2-.01,W/2+.01])dark.push(bxg(.05,(s.roof-s.belt)*.42,wl,x,s.belt+(s.roof-s.belt)*.55,-(L2-s.ws-.6-wl/2)))}
 else{const th=s.th===undefined?s.belt:s.th;body.push(prof([[-L2+.05,gc],[L2-.07,gc],[L2,gc+.2],[L2-.05,s.hh],[s.cf,s.belt],[s.cr,s.belt+(s.open?0:.02)],[-L2+.05,th],[-L2,gc+.25]],W,.07));
  if(s.open){glass.push(prof([[s.cf,s.belt],[s.cf-s.rf,s.roof],[s.cf-s.rf-.07,s.roof],[s.cf-.12,s.belt]],W-.3,.03));dark.push(bxg(W-.5,.25,(s.cf-s.cr)-.5,0,s.belt-.02,-(s.cf+s.cr)/2+.15));for(const x of[-.5,.5])dark.push(bxg(.62,.62,.2,x,s.belt+.25,-(s.cf-s.rf-.75)),bxg(.62,.62,.2,x,s.belt+.25,-(s.cr+.4)))}
  else{glass.push(prof([[s.cf,s.belt],[s.cf-s.rf,s.roof],[s.cr+s.rr,s.roof],[s.cr,s.belt]],W-.34,.05));const a=s.cf-s.rf,b=s.cr+s.rr;body.push(bxg(W-.36,.07,a-b+.1,0,s.roof+.075,-(a+b)/2),bxg(W-.23,s.roof-s.belt-.04,.1,0,(s.roof+s.belt)/2+.03,-(a+b)/2-.1))}
  if(s.bed)dark.push(bxg(W-.4,.06,(s.cr+L2)-.5,0,th+.03,(L2-s.cr)/2-s.cr-.02+.0))}
 dark.push(bxg(W+.06,.2,.22,0,gc+.1,-L2+.1),bxg(W+.06,.2,.22,0,gc+.1,L2-.1),bxg(W-.2,.2,s.L-.5,0,gc-.02,0));
 const zf=-s.wb/2+(s.wo||0),zr=s.wb/2+(s.wo||0);for(const x of[-W/2+.015,W/2-.015])for(const z of[zf,zr])dark.push(gT(new THREE.CylinderGeometry(s.r+.13,s.r+.13,.05,18),x,s.r+.02,z,0,0,Math.PI/2));
 const hy=(s.box?gc+.55:s.hh-.13),ty=(s.box?gc+.6:(s.th===undefined?s.belt:s.th)-.14);
 const head=U.mergeBufferGeometries([bxg(.5,.16,.08,-W/2+.45,hy,-L2+.03),bxg(.5,.16,.08,W/2-.45,hy,-L2+.03)]),tail=U.mergeBufferGeometries([bxg(.5,.15,.08,-W/2+.45,ty,L2-.03),bxg(.5,.15,.08,W/2-.45,ty,L2-.03)]);
 dark.push(bxg(W*.45,.2,.06,0,gc+.3,-L2+.01));
 if(s.extra)s.extra(body,dark,ex,gl,s);
 return {s,body:U.mergeBufferGeometries(body),glass:U.mergeBufferGeometries(glass),dark:U.mergeBufferGeometries(dark),head,tail,ex:ex.length?U.mergeBufferGeometries(ex):null,gl:gl.length?U.mergeBufferGeometries(gl):null,wz:[zf,zr]}}
const isSpecs={
 hatch:{mass:1.0,L:3.9,W:2.05,gc:.36,hh:.86,belt:1,roof:1.56,cf:.75,cr:-1.72,rf:.6,rr:.22,wb:2.45,r:.38,max:35},
 sedan:{mass:1.2,L:4.6,W:2.15,gc:.36,hh:.84,belt:1,roof:1.52,cf:.95,cr:-1.45,rf:.65,rr:.55,th:.98,wb:2.8,r:.4,max:38},
 coupe:{mass:1.2,L:4.4,W:2.15,gc:.33,hh:.8,belt:.96,roof:1.36,cf:.7,cr:-1.3,rf:.75,rr:.8,th:.95,wb:2.7,r:.4,max:47,acc:1.2},
 muscle:{mass:1.5,L:4.9,W:2.25,gc:.36,hh:.9,belt:1.02,roof:1.4,cf:.45,cr:-1.4,rf:.55,rr:.8,th:1,wb:2.95,r:.44,max:51,acc:1.35,turn:.9,extra:(b,d)=>{d.push(bxg(.9,.16,1.1,0,1.0,-1.5));b.push(bxg(2.05,.08,.4,0,1.12,2.25))}},
 super:{mass:1.3,L:4.5,W:2.3,gc:.26,hh:.6,belt:.82,roof:1.14,cf:.6,cr:-1,rf:.9,rr:.9,th:.86,wb:2.7,r:.4,max:63,acc:1.6,turn:1.15,extra:(b,d)=>{b.push(bxg(2.2,.06,.45,0,1.2,2.05),bxg(.08,.34,.25,-.85,1.03,2.05),bxg(.08,.34,.25,.85,1.03,2.05));d.push(bxg(1.7,.1,.5,0,.36,-2.2))}},
 suv:{mass:1.8,L:4.7,W:2.3,gc:.5,hh:1.05,belt:1.25,roof:1.95,cf:1,cr:-2.1,rf:.5,rr:.2,wb:2.9,r:.48,max:33,turn:.9,extra:(b,d)=>{d.push(bxg(.08,.08,2.4,-.8,2.06,.5),bxg(.08,.08,2.4,.8,2.06,.5))}},
 pickup:{mass:1.9,L:5.3,W:2.3,gc:.52,hh:1.08,belt:1.25,roof:1.9,cf:1.1,cr:-.3,rf:.5,rr:.12,th:1.18,wb:3.3,r:.48,max:34,bed:1,extra:(b)=>{b.push(bxg(.1,.28,2.2,-1.08,1.3,1.5),bxg(.1,.28,2.2,1.08,1.3,1.5),bxg(2.2,.28,.1,0,1.3,2.58))}},
 jeep:{mass:1.6,L:4,W:2.2,gc:.56,hh:1.12,belt:1.26,roof:1.92,cf:.6,cr:-1.2,rf:.2,rr:.1,open:1,wb:2.45,r:.52,max:32,extra:(b,d)=>{d.push(gT(new THREE.CylinderGeometry(.5,.5,.3,14),0,1.25,2.15,Math.PI/2),bxg(1.9,.1,.1,0,1.95,.2),bxg(.1,.7,.1,-.9,1.6,.2),bxg(.1,.7,.1,.9,1.6,.2),bxg(1.8,.3,.12,0,.75,-2.08))}},
 convertible:{mass:1.2,L:4.4,W:2.15,gc:.33,hh:.8,belt:.98,roof:1.4,cf:.75,cr:-.75,rf:.6,rr:0,th:.94,open:1,wb:2.7,r:.4,max:45,acc:1.15},
 classic:{mass:1.4,L:4.6,W:2.05,gc:.42,hh:1.02,belt:1.1,roof:1.66,cf:.5,cr:-1.25,rf:.28,rr:.5,th:.9,wb:2.9,r:.45,max:29,extra:(b,d,e)=>{for(const x of[-1.06,1.06])for(const z of[-1.45,1.45])b.push(gT(new THREE.CylinderGeometry(.62,.62,.34,14,1,false,0,Math.PI),x,.5,z,0,Math.PI/2,Math.PI/2));e.push(isCy(.2,.2,.1,10,0xfff6d0,-.72,.98,-2.28,0,Math.PI/2),isCy(.2,.2,.1,10,0xfff6d0,.72,.98,-2.28,0,Math.PI/2),isB(.9,.5,.08,0xcfd3d8,0,.82,-2.31))}},
 lowrider:{mass:1.5,L:5,W:2.25,gc:.22,hh:.8,belt:.95,roof:1.38,cf:.6,cr:-1.3,rf:.6,rr:.9,th:.9,wb:3,r:.35,max:35,extra:(b,d,e)=>{e.push(isB(.03,.08,4.4,0xe8c547,-1.13,.62,0),isB(.03,.08,4.4,0xe8c547,1.13,.62,0))}},
 limo:{mass:2.2,L:7.4,W:2.15,gc:.36,hh:.84,belt:1,roof:1.5,cf:2.3,cr:-2.8,rf:.65,rr:.55,th:.98,wb:5.1,r:.4,max:34,turn:.7,acc:.9},
 taxi:{mass:1.2,L:4.6,W:2.15,gc:.36,hh:.84,belt:1,roof:1.52,cf:.95,cr:-1.45,rf:.65,rr:.55,th:.98,wb:2.8,r:.4,max:39,col:0xf5c518,extra:(b,d,e,g)=>{g.push(isB(.9,.26,.36,0xfff2a0,0,1.76,.1));e.push(isB(.03,.16,3.2,0x111111,-1.085,.8,0),isB(.03,.16,3.2,0x111111,1.085,.8,0))}},
 van:{mass:2.0,box:1,L:5,W:2.3,gc:.42,belt:1.25,roof:2.3,ws:.85,wb:3.1,r:.44,max:31,cargo:2},
 boxtruck:{mass:3.5,box:1,L:6.8,W:2.5,gc:.5,belt:1.4,roof:2.5,ws:.7,wb:4.2,r:.5,max:28,turn:.75,acc:.85,cargo:9,extra:(b,d,e)=>{e.push(isB(2.56,2.6,4.6,0xf2f2f2,0,2.15,1.05),isB(2.58,.5,4.62,0x2e86c1,0,1.5,1.05))}},
 bus:{mass:6.0,box:1,L:10.6,W:2.7,gc:.45,belt:1.35,roof:3.05,ws:.45,wb:6,r:.52,max:25,turn:.55,acc:.7,extra:(b,d,e,g)=>{e.push(isB(2.72,.3,10.2,0xf2f2f2,0,1.05,0));g.push(isB(1.6,.3,.06,0xffb020,0,2.85,-5.29))}},
 ambulance:{mass:2.6,box:1,L:5.6,W:2.4,gc:.45,belt:1.3,roof:2.5,ws:.8,wb:3.4,r:.45,max:44,acc:1.1,col:0xf4f4f4,cargo:2.6,extra:(b,d,e,g)=>{e.push(isB(2.42,.3,5.3,0xd62828,0,1.15,.1),isB(.03,.9,.3,0xd62828,-1.21,1.95,1.2),isB(.03,.3,.9,0xd62828,-1.21,1.95,1.2),isB(.03,.9,.3,0xd62828,1.21,1.95,1.2),isB(.03,.3,.9,0xd62828,1.21,1.95,1.2));g.push(isB(.5,.2,.4,0xff2020,-.5,2.62,-1.6),isB(.5,.2,.4,0x2050ff,.5,2.62,-1.6))}},
 firetruck:{mass:5.0,box:1,L:8,W:2.6,gc:.5,belt:1.4,roof:2.6,ws:.6,wb:4.8,r:.52,max:36,turn:.65,col:0xc81d11,cargo:6,extra:(b,d,e,g)=>{e.push(isB(.5,.14,6.4,0xcfd3d8,0,2.95,.9),isB(.08,.3,6.4,0xcfd3d8,-.3,2.82,.9),isB(.08,.3,6.4,0xcfd3d8,.3,2.82,.9),isB(2.62,.25,7.6,0xf2f2f2,0,1.2,0),isCy(.3,.3,2.2,10,0xcfd3d8,-1.0,2.0,1.5,0,Math.PI/2));g.push(isB(1.4,.2,.4,0xff2020,0,2.72,-3.2))}}};
function isType(n){if(!isTY[n])isTY[n]=isCarGeo(isSpecs[n]);return isTY[n]}
function isBuildCar(n,col){const T=isType(n),s=T.s,g=new THREE.Group(),bm=new THREE.MeshPhysicalMaterial({color:s.col!==undefined?s.col:col,metalness:.5,roughness:.3,clearcoat:1,clearcoatRoughness:.06});
 const add=(geo,mat,sh)=>{const m=new THREE.Mesh(geo,mat);m.castShadow=!!sh;g.add(m);return m};add(T.body,bm,1);add(T.glass,CM.glass,1);add(T.dark,CM.dark);add(T.head,CM.head);add(T.tail,CM.tail);if(T.ex)add(T.ex,isVMat,1);if(T.gl)add(T.gl,isVGlow);
 g.userData.wheels=[];const k=s.r/.4;for(const x of[-s.W/2+.1,s.W/2-.1])for(const z of T.wz){const w=new THREE.Group(),ti=new THREE.Mesh(CAR.tire,CM.tire);ti.castShadow=true;w.add(ti,new THREE.Mesh(CAR.rim,CM.rim));w.scale.set(s.box?1.25:1,k,k);w.position.set(x,s.r,z);g.add(w);g.userData.wheels.push(w)}
 g.userData.max=s.max;g.userData.isAcc=s.acc||1;g.userData.isTurn=s.turn||1;g.userData.isType=n;g.userData.rlNoSwap=true;g.userData.isLen=s.L;g.userData.mass=s.mass||1.2;return g}
const isMix={mid:[['base',22],['hatch',12],['sedan',14],['coupe',6],['muscle',5],['suv',9],['pickup',6],['van',6],['taxi',6],['classic',3],['lowrider',3],['convertible',3],['jeep',2],['super',2],['boxtruck',2],['bus',2],['limo',1],['ambulance',1],['firetruck',.6]],
 down:[['base',20],['taxi',22],['sedan',14],['limo',7],['bus',7],['coupe',6],['super',5],['hatch',6],['van',5],['suv',4],['ambulance',2],['boxtruck',2]],
 beach:[['base',22],['convertible',20],['jeep',14],['super',7],['coupe',8],['hatch',8],['classic',6],['lowrider',6],['suv',5],['taxi',4]],
 sub:[['suv',24],['pickup',22],['sedan',14],['hatch',12],['base',10],['van',7],['muscle',6],['classic',3],['jeep',2]],
 port:[['boxtruck',30],['pickup',25],['van',25],['jeep',10],['suv',10]]};
function isZone(x,z){if(x>HALF+90)return Math.abs(x-isPX)<=isPA&&Math.abs(z-isPZ)<=isPB?'port':'beach';if(x>HALF-2*CELL-ROAD)return 'beach';if(x<-HALF+2*CELL+ROAD)return 'sub';return Math.hypot(x,z)<HALF*.4?'down':'mid'}
function isPick(zone){const m=isMix[zone]||isMix.mid;let t=0;for(const q of m)t+=q[1];let r=Math.random()*t;for(const q of m){r-=q[1];if(r<=0)return q[0]}return 'base'}
let isZoneHint=null;
{const mc=makeCar;makeCar=function(col,ty){if(ty!==undefined)return mc(col,ty);const n=isPick(isZoneHint||'mid');return n==='base'?mc(col):isBuildCar(n,col)}}
function isSwap(o,zone){const m=o.m,col=m.children[0]&&m.children[0].material&&m.children[0].material.color?m.children[0].material.color.getHex():0x888888;isZoneHint=zone||isZone(m.position.x,m.position.z);const n=isPick(isZoneHint);isZoneHint=null;if(n==='base')return;const g=isBuildCar(n,carColors[Math.floor(Math.random()*carColors.length)]);g.position.copy(m.position);g.rotation.copy(m.rotation);scene.remove(m);scene.add(g);o.m=g;o.hp=100}
for(const c of cars){if(c.vhT||c.vhBike||c.custom||c.dead||!c.m.userData.wheels||c.m.userData.wheels.length!==4)continue;if(typeof rlCarList!=='undefined'&&rlCarList.indexOf(c.m)<0)continue;isSwap(c)}
for(const t of traffic){if(t.dead)continue;const m=t.m,z=isZone(m.position.x,m.position.z);isSwap(t,z==='beach'||z==='sub'?z:(Math.random()<.5?'down':'mid'));const L=t.m.userData.isLen||4.4;if(L>6)t.spd=Math.min(t.spd,9)}

// ===== island vehicles, craft, peds, pickups, island traffic =====
const isIsleCars=[];
function isGrpAt(x,z){let best=null,bd=1e9;for(const g of isGroups){const c=g.userData.c;if(g.name==='Islets'||/Bridge|Span|Causeway/.test(g.name))continue;const d=Math.hypot(x-c[0],z-c[1]);if(d<bd){bd=d;best=g}}return best}
function isPark(n,x,z,ry,col){const g=isBuildCar(n,col===undefined?carColors[Math.floor(Math.random()*carColors.length)]:col);g.position.set(x,isGY,z);g.rotation.y=ry||0;scene.add(g);const c={m:g,speed:0,steer:0,hp:100};cars.push(c);isIsleCars.push({c,g:isGrpAt(x,z)});return c}
// Coral Key
isPark('convertible',isRX-34+5.6,isRZ-30,0);isPark('super',isRX+5.6,isRZ+40,Math.PI);isPark('jeep',isRX+34-5.6,isRZ-4,0);isPark('limo',isRX+48.6,isRZ-50,0,0xffffff);isPark('classic',isRX+48.6,isRZ+20,Math.PI,0x8fd8e8);isPark('convertible',isRX+48.6,isRZ+44,Math.PI,0xf7a8c4);isPark('suv',isRX-34-5.6,isRZ+50,0);isPark('taxi',isRX-48,isBZ+2.6,Math.PI/2);
// Metro Isle: yellow cabs and sedans at the curbs
for(let i=0;i<14;i++){const ax=isMAv[1+(i%4)]+(i%2?3.6:-3.6),z=isMZ-110+((i*37)%210);if(z>isMPark[2]-4&&z<isMPark[3]+4&&ax>isMPark[0]-6&&ax<isMPark[1]+6)continue;isPark(i%3===2?(i%2?'sedan':'limo'):'taxi',ax,z,i%2?Math.PI:0,i%3===2?0x1c1c1c:undefined)}
// Lucky Sands
isPark('limo',isSX-66,isSZ+14,Math.PI/2,0xffffff);isPark('super',isSX-40,isSZ+14,Math.PI/2,0xffd60a);isPark('super',isSX+20,isSZ-14,-Math.PI/2,0xe63946);isPark('convertible',isSX+44,isSZ-14,-Math.PI/2,0x9b5de5);isPark('limo',isSX+66,isSZ+14,Math.PI/2,0x1c1c1c);isPark('muscle',isSX-3,isSZ+40,0,0xf4a261);
// Hikari
for(let i=0;i<8;i++){const x=isHLx[1+(i%4)]+(i%2?1.6:-1.6),z=isHZ-60+((i*41)%120);isPark(['hatch','van','coupe','hatch','taxi','hatch','lowrider','sedan'][i],x,z,i%2?Math.PI:0)}
// Port Ironside and Ember Isle
isPark('boxtruck',isPX-30,isPZ+14,Math.PI/2);isPark('boxtruck',isPX+6,isPZ+16,Math.PI/2);isPark('pickup',isPX-64,isPZ+18,0);isPark('van',isPX+30,isPZ-2,Math.PI/2);isPark('jeep',isPX-76,isPZ-34,Math.PI/2);
isPark('jeep',isWX-40,isWZ+52,Math.PI/2,0x556b2f);isPark('pickup',isWX-52,isWZ+34,0,0x8a6a45);
// moving island traffic on loop roads (stealable; a car stops looping once the player has driven it)
const isLoops=[{pts:[[isMAv[0],isMSt[0]],[isMAv[5],isMSt[0]],[isMAv[5],isMSt[9]],[isMAv[0],isMSt[9]]],sp:9,types:['taxi','taxi','taxi','taxi','sedan','bus','taxi','limo']},
 {pts:[[isSX-isSA+6,isSZ-4],[isSX+isSA-6,isSZ-4],[isSX+isSA-6,isSZ+4],[isSX-isSA+6,isSZ+4]],sp:8,types:['limo','super','convertible','limo','taxi']},
 {pts:[[isHLx[0],isHLz[0]],[isHLx[5],isHLz[0]],[isHLx[5],isHLz[6]],[isHLx[0],isHLz[6]]],sp:7,types:['hatch','van','taxi','hatch','coupe']}];
for(const lp of isLoops){let per=0;lp.seg=[];for(let i=0;i<lp.pts.length;i++){const a=lp.pts[i],b=lp.pts[(i+1)%lp.pts.length],l=Math.hypot(b[0]-a[0],b[1]-a[1]);lp.seg.push([a,b,l,per]);per+=l}lp.per=per;lp.cars=[];
 lp.types.forEach((t,i)=>{const c=isPark(t,lp.pts[0][0],lp.pts[0][1],0,t==='taxi'?undefined:undefined);c.isLoop={lp,s:per*i/lp.types.length};lp.cars.push(c)})}
function isLoopPos(lp,s){s=((s%lp.per)+lp.per)%lp.per;for(const q of lp.seg)if(s<=q[3]+q[2]){const u=(s-q[3])/q[2],dx=(q[1][0]-q[0][0])/q[2],dz=(q[1][1]-q[0][1])/q[2];return [q[0][0]+dx*q[2]*u-dz*2.2,q[0][1]+dz*q[2]*u+dx*2.2,Math.atan2(-dx,-dz)]}return [lp.pts[0][0],lp.pts[0][1],0]}
const isCraft=[];
if(typeof vhMakeBike==='function'&&typeof vhBikes!=='undefined'){for(const q of[[isWX-30,isWZ+50,0xd35400],[isWX-26,isWZ+50,0x27ae60],[isWX-60,isWZ+30,0xf1c40f],[isRX-58,isRZ+30,0xe63946],[isLX-20,isLZ+20,0x8fd8e8],[isLX+22,isLZ+18,0xf7a8c4],[isHLx[1]+2,isHZ+20,0xff3c8e]]){const m=vhMakeBike(q[2]);m.position.set(q[0],isGY,q[1]);m.rotation.z=.14;scene.add(m);const c={m,speed:0,steer:0,hp:100,vhBike:true,vhEng:new THREE.Vector3(0,.7,0)};cars.push(c);vhBikes.push(c);isIsleCars.push({c,g:isGrpAt(q[0],q[1])})}}
function isJetSki(col){const g=new THREE.Group(),L=[isB(1,.5,2.8,col,0,.3,0),isCy(.5,0,1.1,4,col,0,.3,-1.9,Math.PI/4,-Math.PI/2),isB(.8,.3,1.2,0x1c1c1c,0,.7,.5),isB(.7,.5,.5,col,0,.75,-.5),isB(1,.08,.08,0x1c1c1c,0,1.05,-.55),isB(1.02,.1,2.6,0xffffff,0,.12,0)];const m=new THREE.Mesh(U.mergeBufferGeometries(L),isMatV);m.castShadow=true;g.add(m);return g}
function isYacht(){const g=new THREE.Group(),L=[isB(4.2,1.8,15,0xffffff,0,.6,0),isCy(2.1,0,4,4,0xffffff,0,.6,-9.5,Math.PI/4,-Math.PI/2),isB(3.6,1.4,7,0xf4f4f4,0,2.2,1),isB(3.7,.6,6.4,0x1c2a3a,0,2.3,1),isB(2.8,1.1,3.6,0xffffff,0,3.4,1.6),isB(2.9,.5,3.2,0x1c2a3a,0,3.5,1.6),isB(4.3,.12,5,0xb98a5a,0,1.56,5),isB(.1,2,.1,0xcfd3d8,0,4.9,1.6),isB(4.24,.25,15,0x1d3557,0,-.1,0)];const m=new THREE.Mesh(U.mergeBufferGeometries(L),isMatV);m.castShadow=true;g.add(m);return g}
function isShoreSpot(x0,z0,dx,dz){let x=x0,z=z0;for(let i=0;i<200&&isIsleH(x,z)>=0;i++){x+=dx;z+=dz}return [x+dx*2.2,z+dz*2.2]}
if(typeof vhBoats!=='undefined'){const addB=(m,p,ry,mx,eng)=>{m.position.set(p[0],0,p[1]);m.rotation.y=ry;scene.add(m);const c={m,speed:0,steer:0,hp:100,vhT:'boat',vhPh:p[0]*.1,vhEng:eng,isMax:mx,mass:mx<20?8:1};cars.push(c);vhBoats.push(c);isCraft.push(c);return c},js=new THREE.Vector3(0,.8,1.2),sb=new THREE.Vector3(0,.9,2.4);
 addB(isJetSki(0xe63946),isShoreSpot(isRX,isRZ+20,-1,0),Math.PI/2,44,js);addB(isJetSki(0x00b4d8),isShoreSpot(isRX,isRZ+27,-1,0),Math.PI/2,44,js);addB(isJetSki(0xffd60a),isShoreSpot(isWX,isWZ+26,-1,0),Math.PI/2,44,js);addB(isJetSki(0x80ed99),isShoreSpot(isPX,isPZ-34,-1,0),0,44,js);addB(isJetSki(0xff4fd8),isShoreSpot(isSX,isSZ+40,1,0),-Math.PI/2,44,js);addB(isJetSki(0xffffff),isShoreSpot(isLX,isLZ,-1,0),Math.PI/2,44,js);
 addB(isYacht(),isShoreSpot(isRX,isRZ-26,-1,0).map((v,i)=>i===0?v-9:v),0,17,new THREE.Vector3(0,1.6,6));
 if(typeof vhMakeBoat==='function'){addB(vhMakeBoat(0x1d70b8),isShoreSpot(isPX,isPZ-24,-1,0),0,36,sb);addB(vhMakeBoat(0xd62828),isShoreSpot(isWX,isWZ+34,-1,0),Math.PI/2,36,sb);addB(vhMakeBoat(0xffa200),isShoreSpot(isRX,isRZ+10,1,0),-Math.PI/2,36,sb);addB(vhMakeBoat(0x2a9d8f),isShoreSpot(isMX,isMZ+40,1,0),-Math.PI/2,36,sb);addB(vhMakeBoat(0xe9c46a),isShoreSpot(isHX,isHZ,1,0),-Math.PI/2,36,sb);addB(vhMakeBoat(0x264653),isShoreSpot(isLX,isLZ+10,0,1),Math.PI,36,sb)}}
if(typeof vhMakeHeli==='function'&&typeof vhHelis!=='undefined'){for(const q of[[isHeliPads[0][0],isHeliPads[0][1],0xffffff,isGY+.2],[isPlat[0]+4,isPlat[1]+4,0xffd23f,8.1],[isMX+60,isMZ+105,0x1d3557,isGY]]){const m=vhMakeHeli(q[2]);m.position.set(q[0],q[3],q[1]);m.rotation.y=Math.random()*6;scene.add(m);const c={m,speed:0,steer:0,hp:100,vhT:'heli',vy:0,vhSpin:0,vhFloor:q[3],vhEng:new THREE.Vector3(0,2.7,.4)};cars.push(c);vhHelis.push(c)}}
// decorative seaplane at Coral Key
{const L=[isCy(.9,.9,7,10,0xffffff,0,2.2,0,0,Math.PI/2),isCy(.9,.1,2,10,0xffffff,0,2.2,-4.5,0,-Math.PI/2),isCy(.9,.25,3,10,0xffffff,0,2.4,5,0,Math.PI/2),isB(13,.2,1.9,0xe63946,0,3.25,-.6),isB(4,.15,1.1,0xe63946,0,2.7,6),isB(.15,1.7,1.3,0xe63946,0,3.4,6),isB(1.5,.6,1.2,0x1c2a3a,0,2.75,-2.4)];for(const x of[-2,2]){L.push(isCy(.45,.45,7,8,0xcfd3d8,x,.35,-.3,0,Math.PI/2),isCy(.45,.05,1.4,8,0xcfd3d8,x,.35,-4.5,0,-Math.PI/2),isB(.12,1.6,.12,0x8d9299,x,1.2,-1.6),isB(.12,1.6,.12,0x8d9299,x,1.2,1.2))}L.push(isB(2.6,.12,.2,0x222222,0,2.2,-5.6,0,0,.5));const m=new THREE.Mesh(U.mergeBufferGeometries(L),isMatV);m.castShadow=true;const p=isShoreSpot(isRX,isRZ-30,1,0);m.position.set(p[0]+6,.1,p[1]);m.rotation.y=.4;scene.add(m);isDraws++}
for(const q of[[isRX+84,isRZ-10,2],[isRX-64,isRZ+26,3],[isPX-40,isPZ-48,0],[isPX+40,isPZ+60,4],[isWX-46,isWZ-38,2],[isWX+20,isWZ-16,4],[isPlat[0]+4,isPlat[1]+4,2],[isWX-58,isWZ+26,1],[isMPark[0]+6,isMPark[2]+6,3],[isSX+4,isSZ+12,0],[isHLx[2]+3,isHLz[3]+3,1],[isLX-30,isLZ+10,4]]){const d=PK[q[2]],m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:d.col,emissive:d.col,emissiveIntensity:1.6,toneMapped:false}));const h=q[0]===isPlat[0]+4?8.2:Math.max(isGY,isIsleH(q[0],q[1]));m.position.set(q[0],h+1,q[1]);scene.add(m);pickups.push({m,d,t:0,isY:h+1})}
const isPeds=[];
for(const q of[[isRX-5.4,isRZ-48,isRX-5.4,isRZ+58],[isRX-30,isRZ-9.5,isRX+30,isRZ-9.5],[isRX+70,isRZ-80,isRX+70,isRZ+70],[isRX+80,isRZ-30,isRX+86,isRZ+40],
 [isMAv[1]+5,isMZ-120,isMAv[1]+5,isMZ+120],[isMAv[4]+5,isMZ-120,isMAv[4]+5,isMZ+120],[isMPark[0]+8,isMPark[2]+8,isMPark[0]+8,isMPark[3]-8],[isMX-70,isMSt[8]+4.5,isMX+70,isMSt[8]+4.5],
 [isSX-80,isSZ-9,isSX+80,isSZ-9],[isSX-80,isSZ+9,isSX+80,isSZ+9],[isSX-20,isSZ+16,isSX+28,isSZ+16],
 [isHLx[2]-4,isHZ-74,isHLx[2]-4,isHZ+74],[isHX-66,isHLz[3]+4,isHX+66,isHLz[3]+4],[isHLx[4]+4,isHZ-74,isHLx[4]+4,isHZ+74],
 [isLX-36,isLZ+24,isLX+36,isLZ+24],[isLX-30,isLZ-30,isLX-38,isLZ+10],
 [isPX-70,isPZ+4,isPX+50,isPZ+4],[isPX+40,isPZ-50,isPX+66,isPZ+20],[isWX-56,isWZ+18,isWX-34,isWZ+46]]){const g=makePerson(new THREE.Color().setHSL(Math.random(),.45,.5),new THREE.Color().setHSL(Math.random(),.25,.28),[0xf1c27d,0xc68642,0x8d5524,0xe0ac69][isPeds.length%4]);g.position.set(q[0],isGY+.05,q[1]);scene.add(g);isPeds.push({g,a:[q[0],q[1]],b:[q[2],q[3]],u:Math.random(),d:1,sp:1.2+Math.random()*.7,w:0,grp:isGrpAt(q[0],q[1])})}
// ===== bounds, collisions, lifting =====
let isGuard=false,isLateOn=false;const isLast=new WeakMap();
// wdPierH is only widened while fixes' "car sinks in the ocean" check runs (between isTick and isLate), so the world's own lifting never grabs boats or helicopters
if(typeof wdPierH==='function'){const w0=wdPierH;wdPierH=function(x,z){const h=w0(x,z);if(h>=0||!isGuard)return h;return isLandAt(x,z)}}
function isClampBridge(p){if(p.x<HALF+42)return;const B=isOnBridge(p.x,p.z);if(!B||isIsleH(p.x,p.z)>=0)return;const lim=B.w/2-.8;if(B.ax==='x')p.z=Math.max(B.c-lim,Math.min(B.c+lim,p.z));else p.x=Math.max(B.c-lim,Math.min(B.c+lim,p.x))}
function isSolCol(p,r,maxH){let res=false;for(const s of isSol){if(maxH!==undefined&&p.y>s.h)continue;const cx=Math.max(s.minX,Math.min(p.x,s.maxX)),cz=Math.max(s.minZ,Math.min(p.z,s.maxZ)),dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;if(d2<r*r){const d=Math.sqrt(d2)||1e-4;if(d2===0)p.x+=r;else{p.x+=dx/d*(r-d);p.z+=dz/d*(r-d)}res=true}}return res}
const isXMax=HALF+760,isZMax=HALF+440;
{const c0=collide;collide=function(p,r,maxH){const ox=p.x,oz=p.z;if(ox<HALF+2)return c0(p,r,maxH);const h=isLandAt(ox,oz);
  if(h<0){const res=c0(p,r,maxH),clamped=Math.abs(p.x-ox)>.01||Math.abs(p.z-oz)>.01;if(!clamped||ox<=HALF+49)return res;
   const air=p!==pos&&p.y>1.5;if(air){p.x=Math.min(isXMax,ox);p.z=Math.max(-isZMax,Math.min(isZMax,oz));return isSolCol(p,r,maxH)}
   const l=isLast.get(p);if(l&&Math.hypot(ox-l.x,oz-l.z)<12){p.x=l.x;p.z=l.z;return true}const s=isNearShore(ox,oz);if(s&&isLandAt(s.x,s.z)>=0){p.x=s.x;p.z=s.z;return true}return res}
  if(ox<=HALF+49){const res=c0(p,r,maxH);isClampBridge(p);return res}
  p.x=ox;p.z=oz;const res=isSolCol(p,r,maxH);isClampBridge(p);if(isLandAt(p.x,p.z)<0){p.x=ox;p.z=oz}isLast.set(p,{x:p.x,z:p.z});return res}}
if(typeof fxBounds==='function'){const b0=fxBounds;fxBounds=function(c,m){if(isLandAt(m.position.x,m.position.z)>=0)return;b0(c,m)}}
// boats: wider sea limits so every island is reachable (the vehicles module caps boats at HALF+520 / +-HALF+190)
if(typeof vhDrive==='function'){const d0=vhDrive;vhDrive=function(dt,jx,jy){const c=driving,boat=c&&c.vhT==='boat',bx=boat?c.m.position.x:0,bz=boat?c.m.position.z:0;d0(dt,jx,jy);if(!boat||driving!==c)return;const m=c.m,p=m.position;
  const nx=bx-Math.sin(m.rotation.y)*c.speed*dt,nz=bz-Math.cos(m.rotation.y)*c.speed*dt;if(nx<HALF+42.5)return;p.x=Math.min(isXMax,nx);p.z=Math.max(-isZMax,Math.min(isZMax,nz));pos.x=p.x;pos.z=p.z}}
// leave a boat at any island shore (runs before the vehicles module's "get closer to the beach" check)
MODS.unshift(function(){if(carQ&&driving&&state==='play'&&driving.vhT==='boat'&&driving.m.position.x>HALF+53){const m=driving.m,s=isNearShore(m.position.x,m.position.z);if(!s)return;const h=isLandAt(s.x,s.z);if(h<0)return;carQ=false;driving.speed=0;driving=null;player.visible=true;pos.set(s.x,Math.max(.3,h),s.z);vel.set(0,0,0);onGround=true;toast('Ashore')}});
const isPrev=new THREE.Vector3();let isMapOn=false,isCullT=0;
function isLift(m,o){const x=m.position.x,z=m.position.z;if(x<HALF+2)return;const h=isLandAt(x,z);if(h>=0){m.position.y=h;m.userData.isUp=1}else if(m.userData.isUp){m.position.y=0;m.userData.isUp=0}}
function isLate(){isGuard=false}
function isTick(dt){dt=Math.max(0,dt);
 if(!isLateOn){isLateOn=true;MODS.push(isLate)}
 if(!isMapOn){isMapOn=true;try{if(typeof mpIcons!=='undefined')mpIcons.push({x:isRX,z:isRZ,label:'Coral Key',color:'#ff9ecd',glyph:'C'},{x:isMX,z:isMZ,label:'Metro Isle',color:'#cfd3d8',glyph:'M'},{x:isSX,z:isSZ,label:'Lucky Sands',color:'#ffe14d',glyph:'$'},{x:isHX,z:isHZ,label:'Hikari',color:'#ff3c8e',glyph:'H'},{x:isLX,z:isLZ,label:'Porto Luna',color:'#f7c59f',glyph:'L'},{x:isPX,z:isPZ,label:'Port Ironside',color:'#ffb347',glyph:'P'},{x:isWX,z:isWZ,label:'Ember Isle',color:'#7bd86a',glyph:'E'},{x:isHeliPads[0][0],z:isHeliPads[0][1],label:'Helipad',color:'#ffd23f',glyph:'H'},{x:isPlat[0],z:isPlat[1],label:'Sea Platform',color:'#cfd3d8',glyph:'S'});
  if(typeof mpLabels!=='undefined'){mpLabels.push({x:isRX,z:isRZ,text:'CORAL KEY',size:2},{x:isMX,z:isMZ,text:'METRO ISLE',size:2},{x:isSX,z:isSZ,text:'LUCKY SANDS',size:2},{x:isHX,z:isHZ,text:'HIKARI',size:2},{x:isLX,z:isLZ,text:'PORTO LUNA',size:2},{x:isPX,z:isPZ,text:'PORT IRONSIDE',size:2},{x:isWX,z:isWZ,text:'EMBER ISLE',size:2},{x:isRX+44,z:isRZ+20,text:'Ocean Strip',size:0},{x:(isMPark[0]+isMPark[1])/2,z:(isMPark[2]+isMPark[3])/2,text:'Commons Park',size:0});for(const B of isBr)mpLabels.push({x:B.ax==='x'?(B.lo+B.hi)/2:B.c+8,z:B.ax==='x'?B.c-9:(B.lo+B.hi)/2,text:B.name,size:0})}}catch(e){}}
 isCullT-=dt;if(isCullT<=0){isCullT=.4;const cx=cam.position.x,cz=cam.position.z;for(const g of isGroups){const c=g.userData.c;g.visible=Math.hypot(cx-c[0],cz-c[1])<c[2]+300}
  for(const q of isIsleCars)if(q.g)q.c.m.visible=q.g.visible||driving===q.c;for(const p of isPeds)p.g.visible=!p.grp||p.grp.visible}
 const night=1-Math.max(0,Math.min(1,Math.sin(dayT*Math.PI*2)*3+.5));
 for(const g of isGroups)if(g.userData.glow&&g.visible){const f=g.userData.neon?(.75+night*2.1)*(.92+.08*Math.sin(T*9+g.userData.c[0])):.35+night*2.2;g.userData.glow.material.color.setScalar(f)}
 for(const b of isFx.beams)b.visible=night>.3;if(isFx.jets&&isFx.jets.parent.visible){const s=Math.max(.15,Math.sin(T*.9)*.5+.5);isFx.jets.scale.set(1,1+s*14,1)}
 for(const g of isGroups)if(g.userData.smoke&&g.visible&&Math.random()<dt*6)burst(g.userData.smoke,1,0x555555,1.5,1.6,3,1.4);
 for(const p of isPeds){if(!p.g.visible||p.g.userData.dead)continue;const L=Math.hypot(p.b[0]-p.a[0],p.b[1]-p.a[1]);p.u+=p.d*p.sp*dt/L;if(p.u>1){p.u=1;p.d=-1}if(p.u<0){p.u=0;p.d=1}const x=p.a[0]+(p.b[0]-p.a[0])*p.u,z=p.a[1]+(p.b[1]-p.a[1])*p.u;p.g.position.set(x,Math.max(isGY,isIsleH(x,z))+.05,z);p.g.rotation.y=Math.atan2(-(p.b[0]-p.a[0])*p.d,-(p.b[1]-p.a[1])*p.d);p.w+=dt*p.sp*3;animLimbs(p.g,p.sp*2.5,p.w)}
 for(const lp of isLoops)for(const c of lp.cars){const q=c.isLoop;if(!q||c.dead)continue;if(driving===c){c.isLoop=null;continue}if(!c.m.visible)continue;const nx=isLoopPos(lp,q.s+lp.sp*dt);let hold=Math.hypot(nx[0]-pos.x,nx[1]-pos.z)<4.5;if(!hold)for(const o of lp.cars)if(o!==c&&o.isLoop){const d=((o.isLoop.s-q.s)%lp.per+lp.per)%lp.per;if(d>0&&d<9){hold=true;break}}
  if(!hold){q.s+=lp.sp*dt;const p=isLoopPos(lp,q.s);c.m.position.x=p[0];c.m.position.z=p[1];let da=((p[2]-c.m.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;c.m.rotation.y+=da*Math.min(1,dt*6);for(const w of c.m.userData.wheels)w.rotation.x-=lp.sp*dt*2}}
 // lift the player, cars, police and enemies onto bridges and island ground
 if(!driving){const h=isLandAt(pos.x,pos.z);if(h>=0&&pos.x>HALF+2){const ty=Math.max(.3,h+.02);if(vel.y<=30*dt+.001&&(pos.y<=ty+.12||(onGround&&pos.y<=ty+.9))){pos.y=ty;vel.y=state==='play'?30*dt:0;onGround=true}}}
 for(const c of cars){if(c.vhT==='heli'||c.vhT==='boat'||c.custom)continue;isLift(c.m,c)}
 for(const pc of police)isLift(pc.m,pc);
 for(const s of shooters){const g=s.g;if(g.position.x<HALF+2)continue;const h=isLandAt(g.position.x,g.position.z);if(h>=0)g.position.y=Math.max(.3,h)}
 for(const b of isCraft.concat(typeof vhBoats!=='undefined'?vhBoats:[])){if(b.dead)continue;const m=b.m;if(m.position.y>1.2&&isIsleH(m.position.x,m.position.z)<0)m.position.y=.02+Math.sin(T*1.8+(b.vhPh||0))*.09}
 for(const t of traffic){const L=t.m.userData.isLen;if(L&&L>6&&t.spd>9)t.spd=9}
 const c=driving;if(c&&state==='play'){const m=c.m,u=m.userData;
  if(c.vhT==='boat'){if(c.isMax){c.speed=Math.max(-6,Math.min(c.isMax,c.speed*(c.isMax>40?1.012:1)));if(c.isMax<20)c.speed*=Math.pow(.8,dt)}const p=m.position;if(isIsleH(p.x,p.z)>=0){p.x=isPrev.x;p.z=isPrev.z;if(Math.abs(c.speed)>14){toast('CRASH!');shake=.4;if(typeof vhDamage==='function')vhDamage(Math.abs(c.speed)*.6)}c.speed*=-.25}else isPrev.copy(p);
   const px=isPlat[0],pz=isPlat[1];for(const s of[[-7,-7],[7,-7],[-7,7],[7,7]])if(Math.hypot(p.x-px-s[0],p.z-pz-s[1])<2.4){p.x=isPrev.x;p.z=isPrev.z;c.speed*=-.25}}
  else if(!c.vhT&&!c.custom){let jx=joy.x,jy=joy.y;if(Math.hypot(jx,jy)<.22){jx=0;jy=0}if(u.isAcc&&u.isAcc!==1)c.speed+=-jy*28*dt*(u.isAcc-1);if(u.isTurn&&u.isTurn!==1)m.rotation.y+=-jx*dt*Math.min(1,Math.abs(c.speed)/6)*2.2*Math.sign(c.speed||1)*(u.isTurn-1)}}
 for(const p of pickups)if(p.isY!==undefined&&p.m.visible)p.m.position.y=p.isY+Math.sin(T*3+p.m.position.x)*.25;
 isGuard=true}
MODS.push(isTick);
