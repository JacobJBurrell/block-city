// ---------- world detail (wd): street furniture, neon, rooftops, beach, sky, parks ----------
let wdDraws=0,wdT=0,wdPh=-1;
const wdMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,metalness:.05}),wdMatC=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:0}),wdDum=new THREE.Object3D(),wdCol=new THREE.Color(),wdR=Math.random;
function wdG(g,col,x,y,z,rx,ry,rz){if(g.index)g=g.toNonIndexed();if(rx)g.rotateX(rx);if(rz)g.rotateZ(rz);if(ry)g.rotateY(ry);g.translate(x||0,y||0,z||0);
 wdCol.set(col).convertSRGBToLinear();const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=wdCol.r;a[i*3+1]=wdCol.g;a[i*3+2]=wdCol.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
const wdBox=(w,h,d,col,x,y,z,rx,ry,rz)=>wdG(new THREE.BoxGeometry(w,h,d),col,x,y,z,rx,ry,rz);
const wdCyl=(rt,rb,h,n,col,x,y,z,rx,ry,rz)=>wdG(new THREE.CylinderGeometry(rt,rb,h,n),col,x,y,z,rx,ry,rz);
const wdSph=(r,col,x,y,z)=>wdG(new THREE.SphereGeometry(r,7,5),col,x,y,z);
function wdInst(parts,arr,o){o=o||{};const geo=Array.isArray(parts)?U.mergeBufferGeometries(parts):parts;const m=new THREE.InstancedMesh(geo,o.mat||(arr.length&&arr[0][6]!==undefined?wdMatC:wdMat),Math.max(1,arr.length));m.count=arr.length;
 for(let i=0;i<arr.length;i++){const a=arr[i];wdDum.position.set(a[0],a[1],a[2]);wdDum.rotation.set(0,a[3]||0,0);const s=a[4]||1;wdDum.scale.set(a[7]||s,a[5]||s,s);wdDum.updateMatrix();m.setMatrixAt(i,wdDum.matrix);if(a[6]!==undefined)m.setColorAt(i,wdCol.set(a[6]).convertSRGBToLinear())}
 m.frustumCulled=false;m.castShadow=!!o.shadow;m.receiveShadow=!o.noRecv;scene.add(m);wdDraws++;return m}
const wdC0=roadCenter(0)+CELL/2,wdParks={},wdParkList=[[5,5],[1,8],[8,1],[2,2],[8,6],[4,9]];wdParkList.forEach(p=>wdParks[p[0]+','+p[1]]=1);
const wdSides=[[1,0],[-1,0],[0,1],[0,-1]],wdFace=(fx,fz)=>Math.atan2(-fx,-fz);
function wdPt(cx,cz,s,r,a){const n=wdSides[s];return [cx+n[0]*r-n[1]*a,cz+n[1]*r+n[0]*a]}
const wdBld=solids.filter(s=>s.h>=8&&s.maxX-s.minX>=10);
// flat decals (crosswalks, stop lines, park paths, courts): one mesh
const wdDec={p:[],c:[]};
function wdQuad(x0,z0,x1,z1,y,col){wdCol.set(col).convertSRGBToLinear();wdDec.p.push(x0,y,z0,x0,y,z1,x1,y,z0,x1,y,z0,x0,y,z1,x1,y,z1);for(let i=0;i<6;i++)wdDec.c.push(wdCol.r,wdCol.g,wdCol.b)}
// textured quads (signs, billboards)
function wdTQ(Q,cx,cy,cz,n,w,h,u0,v0,u1,v1){const rx=n[1]*w/2,rz=-n[0]*w/2,h2=h/2;Q.p.push(cx-rx,cy-h2,cz-rz,cx+rx,cy-h2,cz+rz,cx+rx,cy+h2,cz+rz,cx-rx,cy-h2,cz-rz,cx+rx,cy+h2,cz+rz,cx-rx,cy+h2,cz-rz);Q.u.push(u0,v0,u1,v0,u1,v1,u0,v0,u1,v1,u0,v1)}
function wdTQMesh(Q,mat){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(Q.p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(Q.u,2));const m=new THREE.Mesh(g,mat);m.frustumCulled=false;scene.add(m);wdDraws++;return m}
// ---- streets ----
const wdA={hyd:[],bench:[],trash:[],bus:[],mail:[],sign:[],tl:[],flower:[],hoop:[],play:[]};
for(let i=0;i<=N;i++)for(let j=0;j<=N;j++){const rx=roadCenter(i),rz=roadCenter(j);
 for(const c of [[-1,1,0],[1,-1,Math.PI]]){const bi=i+(c[0]>0?0:-1),bj=j+(c[1]>0?0:-1);if(bi<0||bi>=N||bj<0||bj>=N)continue;wdA.tl.push([rx+c[0]*7.6,.3,rz+c[1]*7.6,c[2]])}
 for(let k=0;k<10;k++){const o=-6.65+k*1.4;
  if(i>0)wdQuad(rx-10.4,rz+o,rx-7.6,rz+o+.7,.04,0xe9e9e9);if(i<N)wdQuad(rx+7.6,rz+o,rx+10.4,rz+o+.7,.04,0xe9e9e9);
  if(j>0)wdQuad(rx+o,rz-10.4,rx+o+.7,rz-7.6,.04,0xe9e9e9);if(j<N)wdQuad(rx+o,rz+7.6,rx+o+.7,rz+10.4,.04,0xe9e9e9)}
 if(i>0)wdQuad(rx-11.7,rz+.4,rx-11.2,rz+6.8,.04,0xe9e9e9);if(i<N)wdQuad(rx+11.2,rz-6.8,rx+11.7,rz-.4,.04,0xe9e9e9);
 if(j>0)wdQuad(rx-6.8,rz-11.7,rx-.4,rz-11.2,.04,0xe9e9e9);if(j<N)wdQuad(rx+.4,rz+11.2,rx+6.8,rz+11.7,.04,0xe9e9e9)}
for(let i=0;i<N;i++)for(let j=0;j<N;j++){const cx=wdC0+i*CELL,cz=wdC0+j*CELL;let s,p,n;
 if(wdParks[i+','+j]){const y=.375,py=.355;
  wdQuad(cx-18,cz-1.4,cx+18,cz+1.4,y,0x8f7650);wdQuad(cx-1.4,cz-18,cx+1.4,cz+18,y,0x8f7650);wdQuad(cx-6.5,cz-6.5,cx+6.5,cz+6.5,y+.004,0x86796a);
  wdA.bench.push([cx+5.8,py,cz+3.2,wdFace(-1,0)],[cx-5.8,py,cz-3.2,wdFace(1,0)],[cx-3.2,py,cz+5.8,wdFace(0,-1)],[cx+3.2,py,cz-5.8,wdFace(0,1)]);
  wdA.trash.push([cx+7,py,cz-2.2,0],[cx-7,py,cz+2.2,0]);
  for(const a of [[-7.6,7.6],[7.6,-7.6],[-7.6,-7.6],[12,2.7],[-12,-2.7],[2.7,-12],[-2.7,12],[-12,2.7],[2.7,12],[15.5,-2.7],[-2.7,-15.5]])wdA.flower.push([cx+a[0],py,cz+a[1],wdR()*6,.9+wdR()*.4]);
  const pk=wdParkList.findIndex(q=>q[0]===i&&q[1]===j);
  if(pk===3||pk===4){wdQuad(cx+6.6,cz+6.6,cx+17.6,cz+17.6,y+.002,0x9c6b3f);wdA.play.push([cx+12.1,py,cz+12.1,0])}
  else if(pk===1||pk===2){const X0=cx+3.4,X1=cx+17.4,Z0=cz-17.2,Z1=cz-9,zc=(Z0+Z1)/2,xc=(X0+X1)/2,W=0xf2f2f2,cy=y+.004;wdQuad(X0,Z0,X1,Z1,y+.002,0x2d6e8a);
   wdQuad(X0,Z0,X1,Z0+.12,cy,W);wdQuad(X0,Z1-.12,X1,Z1,cy,W);wdQuad(X0,Z0,X0+.12,Z1,cy,W);wdQuad(X1-.12,Z0,X1,Z1,cy,W);wdQuad(xc-.06,Z0,xc+.06,Z1,cy,W);
   for(const e of [[X0,1],[X1,-1]]){const a=e[0],b=e[0]+e[1]*3.6;wdQuad(Math.min(a,b),zc-1.6,Math.max(a,b),zc-1.48,cy,W);wdQuad(Math.min(a,b),zc+1.48,Math.max(a,b),zc+1.6,cy,W);wdQuad(b-.06,zc-1.6,b+.06,zc+1.6,cy,W);wdQuad(Math.min(a,b),zc-1.48,Math.max(a,b),zc+1.48,y+.003,0xb5482f);wdA.hoop.push([e[0]+e[1]*.5,py,zc,wdFace(e[1],0)])}}
  continue}
 s=Math.floor(wdR()*4);p=wdPt(cx,cz,s,19.4,(wdR()<.5?-1:1)*(6+wdR()*7));wdA.hyd.push([p[0],.3,p[1],wdR()*6]);
 for(let k=0;k<2;k++){s=Math.floor(wdR()*4);p=wdPt(cx,cz,s,19.3,(k?-1:1)*15.3);wdA.trash.push([p[0],.3,p[1],0])}
 for(s=0;s<4;s++)if(wdR()<.5){n=wdSides[s];p=wdPt(cx,cz,s,16.75,8.5);wdA.bench.push([p[0],.3,p[1],wdFace(n[0],n[1])])}
 if((i+j)%3===0){s=(i+2*j)%4;n=wdSides[s];p=wdPt(cx,cz,s,17,-8.5);wdA.bus.push([p[0],.3,p[1],wdFace(n[0],n[1])]);solids.push(n[0]?{minX:p[0]-.75,maxX:p[0]+.75,minZ:p[1]-1.75,maxZ:p[1]+1.75,h:2.6}:{minX:p[0]-1.75,maxX:p[0]+1.75,minZ:p[1]-.75,maxZ:p[1]+.75,h:2.6})}
 if((i*3+j)%4===1){s=(i+j)%2?2:0;n=wdSides[s];p=wdPt(cx,cz,s,19.2,3.2);wdA.mail.push([p[0],.3,p[1],wdFace(-n[0],-n[1])])}
 for(let k=0;k<2;k++){s=(i+j+k*2)%4;n=wdSides[s];p=wdPt(cx,cz,s,19.5,-11.5);wdA.sign.push([p[0],.3,p[1],wdFace(-n[1],n[0])])}}
// traffic lights: poles (1 draw) + bulbs for the two directions (2 draws) driven by tiny 3x1 textures
const wdD=0x24272b;
wdInst([wdCyl(.11,.14,5.8,8,wdD,0,2.9,0),wdCyl(.2,.25,.4,8,wdD,0,.2,0),wdCyl(.07,.07,4.4,6,wdD,2.2,5.72,0,0,0,Math.PI/2),wdBox(.52,1.55,.42,0x111214,4.2,4.95,0),wdBox(.52,1.55,.42,0x111214,0,3.4,-.3),wdCyl(.07,.07,4.4,6,wdD,0,5.72,-2.2,Math.PI/2),wdBox(.42,1.55,.52,0x111214,0,4.95,-4.2),wdBox(.42,1.55,.52,0x111214,-.3,3.4,0),
 wdBox(1.7,.3,.05,0x1c7a3c,.2,4.55,.18),wdBox(.05,.3,1.7,0x1c7a3c,.18,4.9,.2)],wdA.tl,{shadow:1});
function wdBulbs(A){const a=[];for(const h of A?[[-.23,4.95,-4.2],[-.53,3.4,0]]:[[4.2,4.95,-.23],[0,3.4,-.53]])for(let k=0;k<3;k++){const g=(A?new THREE.BoxGeometry(.06,.32,.32):new THREE.BoxGeometry(.32,.32,.06)).toNonIndexed(),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(k+.5)/3,.5);g.translate(h[0],h[1]+.5-k*.5,h[2]);a.push(g)}return U.mergeBufferGeometries(a)}
const wdTLc=[[255,45,35],[255,185,30],[45,255,110]];
function wdTLTex(){const t=new THREE.DataTexture(new Uint8Array(12),3,1);t.needsUpdate=true;return t}
function wdSetTL(t,on){const d=t.image.data;for(let k=0;k<3;k++){const f=k===on?1:.09;d[k*4]=wdTLc[k][0]*f;d[k*4+1]=wdTLc[k][1]*f;d[k*4+2]=wdTLc[k][2]*f;d[k*4+3]=255}t.needsUpdate=true}
const wdTLA=wdTLTex(),wdTLB=wdTLTex();
for(const e of [[1,wdTLA],[0,wdTLB]]){const mt=new THREE.MeshBasicMaterial({map:e[1],toneMapped:false});mt.color.setScalar(2.8);wdInst(wdBulbs(e[0]),wdA.tl,{mat:mt,noRecv:1})}
// furniture
wdInst([wdCyl(.17,.2,.55,8,0xc8261c,0,.28,0),wdSph(.18,0xc8261c,0,.56,0),wdCyl(.07,.07,.52,6,0xc8261c,0,.38,0,0,0,Math.PI/2),wdCyl(.06,.06,.14,6,0xd9d9d9,0,.74,0)],wdA.hyd);
wdInst([wdBox(2,.1,.55,0x8a5a2b,0,.5,0),wdBox(2,.5,.08,0x8a5a2b,0,.88,.27),wdBox(.1,.5,.5,0x26282b,-.85,.25,0),wdBox(.1,.5,.5,0x26282b,.85,.25,0),wdBox(.08,.5,.08,0x26282b,-.85,.75,.27),wdBox(.08,.5,.08,0x26282b,.85,.75,.27)],wdA.bench,{shadow:1});
wdInst([wdCyl(.3,.25,.8,10,0x2f5d3a,0,.4,0),wdCyl(.32,.32,.08,10,0x1c1e20,0,.83,0)],wdA.trash);
wdInst([wdBox(3.5,.1,1.5,0x2e4a66,0,2.5,0),wdBox(.1,2.5,.1,0x2b2d30,-1.65,1.25,.65),wdBox(.1,2.5,.1,0x2b2d30,1.65,1.25,.65),wdBox(.1,2.5,.1,0x2b2d30,-1.65,1.25,-.65),wdBox(.1,2.5,.1,0x2b2d30,1.65,1.25,-.65),
 wdBox(3.2,1.7,.05,0x86b6d8,0,1.45,.68),wdBox(2.4,.1,.45,0x8a5a2b,0,.5,.35),wdBox(.06,1.6,1.1,0xe6e6e6,-1.66,1.3,0),wdBox(.08,2.9,.08,0x9a9a9a,2.05,1.45,-.6),wdBox(.55,.55,.06,0x1e63c9,2.05,2.7,-.6)],wdA.bus,{shadow:1});
wdInst([wdBox(.5,.7,.45,0x1c4fa0,0,.75,0),wdCyl(.25,.25,.45,8,0x1c4fa0,0,1.1,0,Math.PI/2),wdBox(.06,.4,.06,0x1b1b1b,-.2,.2,-.17),wdBox(.06,.4,.06,0x1b1b1b,.2,.2,-.17),wdBox(.06,.4,.06,0x1b1b1b,-.2,.2,.17),wdBox(.06,.4,.06,0x1b1b1b,.2,.2,.17),wdBox(.3,.05,.02,0xdddddd,0,.95,-.23)],wdA.mail);
wdInst([wdCyl(.04,.04,2.7,6,0x9a9a9a,0,1.35,0),wdBox(.55,.7,.04,0xf2f2f2,0,2.35,-.05),wdBox(.4,.16,.05,0xc22a2a,0,2.52,-.06),wdBox(.3,.3,.05,0x1b1b1b,0,2.2,-.06)],wdA.sign);
// ---- shops: awnings (instanced, tinted) + neon signs (atlas quads) + rooftop gear + billboards ----
const wdSignTex=canvasTex(1024,1024,g=>{const names=['ZAPP ARCADE','MOXI MART 24H','BRIX GYM','LUNA LOUNGE','KOBO NOODLES','PEEL JUICE BAR','ORBIT CAFE','TACO TORNADO','VOLT TIRES','PAWN PALACE','DOT LAUNDRY','RIFF RECORDS','HEX TATTOO','BUN + CRUMB','FIN FISH MARKET','SNIP SALON'],cols=['#ff3d81','#35e0ff','#ffd23f','#7dff5a','#ff8a2a','#b46bff'];
 g.fillStyle='#000';g.fillRect(0,0,1024,1024);g.textAlign='center';g.textBaseline='middle';
 for(let k=0;k<16;k++){const x=(k%2)*512,y=Math.floor(k/2)*128,c=cols[k%cols.length];g.fillStyle='#0b0d14';g.fillRect(x+4,y+4,504,120);g.strokeStyle=c;g.lineWidth=6;g.strokeRect(x+11,y+11,490,106);g.shadowColor=c;g.shadowBlur=16;g.fillStyle=c;g.font='900 62px -apple-system,Helvetica,Arial,sans-serif';g.fillText(names[k],x+256,y+68,440);g.fillText(names[k],x+256,y+68,440);g.shadowBlur=0}});
const wdBillTex=canvasTex(1024,1024,g=>{const ads=[['FIZZ BLAST','SODA THAT SLAPS','#ff4f8b','#ff9a3c','#fff'],['AERO KICKS','RUN THE BLOCK','#0c0c10','#1c1c26','#b6ff3a'],['RADIO 99.9','BLOCK CITY BEATS','#3a1c8f','#b0409f','#fff'],['PALM BAY','BEACHES ARE EAST','#2aa8ff','#9fe3ff','#fff36b'],['COMET X9','THE PHONE THAT FLIES','#07152e','#123a7a','#7fe0ff'],['BURGER BARN','DOUBLE STACK $4','#c81d25','#ff5a36','#ffd23f'],['TURBO JOLT','ENERGY IN A CAN','#ffd400','#ff9d00','#111'],['DRIVE SAFE','THE COPS ARE WATCHING','#14181d','#2b333c','#ff5050']];
 g.textAlign='center';g.textBaseline='middle';
 for(let k=0;k<8;k++){const x=(k%2)*512,y=Math.floor(k/2)*256,a=ads[k],gr=g.createLinearGradient(x,y,x+512,y+256);gr.addColorStop(0,a[2]);gr.addColorStop(1,a[3]);g.fillStyle=gr;g.fillRect(x,y,512,256);
  g.globalAlpha=.16;g.fillStyle='#fff';for(let c=0;c<7;c++){g.beginPath();g.arc(x+40+((c*83+k*37)%440),y+30+((c*59+k*23)%200),18+((c*13)%34),0,7);g.fill()}g.globalAlpha=1;
  g.fillStyle='rgba(0,0,0,.35)';g.font='900 92px -apple-system,Helvetica,Arial,sans-serif';g.fillText(a[0],x+260,y+108,470);g.fillStyle=a[4];g.fillText(a[0],x+256,y+104,470);
  g.font='700 36px -apple-system,Helvetica,Arial,sans-serif';g.fillText(a[1],x+256,y+190,460);g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=8;g.strokeRect(x+4,y+4,504,248)}});
const wdSignMat=new THREE.MeshBasicMaterial({map:wdSignTex,toneMapped:false}),wdBillMat=new THREE.MeshBasicMaterial({map:wdBillTex,toneMapped:false});
const wdSQ={p:[],u:[]},wdBQ={p:[],u:[]},wdAw=[],wdAC=[],wdWT=[],wdAnt=[],wdBlk=[],wdBillC=[],wdAwCols=[0xb3261e,0x1f6f43,0x1c3f7a,0xd9772b,0x12807a,0x7a1f3d,0x2b2b2b,0xc9a227];
for(const b of wdBld){const bx=(b.minX+b.maxX)/2,bz=(b.minZ+b.maxZ)/2,w=b.maxX-b.minX,d=b.maxZ-b.minZ,h=b.h,ci=Math.round((bx-wdC0)/CELL),cj=Math.round((bz-wdC0)/CELL);if(ci<0||ci>=N||cj<0||cj>=N)continue;const cx=wdC0+ci*CELL,cz=wdC0+cj*CELL;
 for(let s=0;s<4;s++){const n=wdSides[s],fx=bx+n[0]*w/2,fz=bz+n[1]*d/2;if((fx-cx)*n[0]+(fz-cz)*n[1]<15.5)continue;const fw=n[0]?d:w;
  if(wdR()<.72){const aw=Math.min(fw*.7,9),off=(wdR()-.5)*(fw-aw)*.6,px=fx-n[1]*off,pz=fz+n[0]*off;wdAw.push([px,3.3,pz,wdFace(n[0],n[1]),1,1,wdAwCols[Math.floor(wdR()*wdAwCols.length)],aw]);
   const sw=Math.min(aw*.92,6.4),k=Math.floor(wdR()*16),u0=(k%2)/2,v1=1-Math.floor(k/2)/8;wdTQ(wdSQ,px+n[0]*.14,4.75,pz+n[1]*.14,n,sw,sw/4,u0,v1-.125,u0+.5,v1)}
  if(h>=14&&h<=46&&fw>=14)wdBillC.push({x:fx-n[0]*1.1,y:h+.6,z:fz-n[1]*1.1,n})}
 if(h>=10){const q=[[1,1],[1,-1],[-1,1],[-1,-1]].sort(()=>wdR()-.5),y=h+.6,na=1+Math.floor(wdR()*3);for(let k=0;k<na;k++)wdAC.push([bx+q[k][0]*w*.33,y,bz+q[k][1]*d*.33,wdR()<.5?0:Math.PI/2]);
  if(h<55&&wdR()<.28)wdWT.push([bx+q[3][0]*w*.3,y,bz+q[3][1]*d*.3,wdR()*6,Math.min(1.5,w/14)]);
  if(h>50){const sc=1+h/160;wdAnt.push([bx,h+2.3,bz,wdR()*6,sc]);wdBlk.push([bx,h+2.3+10.2*sc,bz])}}}
{const g=U.mergeBufferGeometries([wdG(new THREE.BoxGeometry(1,.08,1.45),0xffffff,0,0,-.7,-.32),wdBox(1,.28,.04,0xeeeeee,0,-.37,-1.388)]);wdInst(g,wdAw,{shadow:1})}
wdTQMesh(wdSQ,wdSignMat);
wdInst([wdBox(1.7,1,1.25,0xb4b8bc,0,.5,0),wdCyl(.45,.45,.06,10,0x2b2f33,0,1.03,0),wdBox(1.72,.5,.9,0x8d9196,0,.5,0),wdBox(.3,.25,.3,0x6d7176,.6,1.1,.4)],wdAC);
wdInst([wdBox(.15,2,.15,0x33363a,-.8,1,-.8),wdBox(.15,2,.15,0x33363a,.8,1,-.8),wdBox(.15,2,.15,0x33363a,-.8,1,.8),wdBox(.15,2,.15,0x33363a,.8,1,.8),wdCyl(1.3,1.3,2.2,10,0x7a5230,0,3.1,0),wdCyl(1.34,1.34,.1,10,0x2b2b2b,0,2.5,0),wdCyl(1.34,1.34,.1,10,0x2b2b2b,0,3.7,0),wdG(new THREE.ConeGeometry(1.5,.9,10),0x4a4f55,0,4.65,0)],wdWT,{shadow:1});
wdInst([wdCyl(.07,.14,10,6,0xcfd3d6,0,5,0),wdBox(1.6,.06,.06,0xcfd3d6,0,5.5,0),wdBox(.06,.06,1.3,0xcfd3d6,0,7,0),wdBox(1,.06,.06,0xcfd3d6,0,8.4,0),wdCyl(.5,.2,.25,8,0xe6e6e6,.3,3.2,0,0,0,.9)],wdAnt);
const wdBlinkMat=new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false});wdInst(new THREE.SphereGeometry(.28,8,6),wdBlk,{mat:wdBlinkMat,noRecv:1});
{wdBillC.sort(()=>wdR()-.5);const pick=[];for(const c of wdBillC){if(pick.length>=16)break;if(pick.every(p=>Math.hypot(p.x-c.x,p.z-c.z)>55))pick.push(c)}
 const arr=pick.map((c,k)=>{const u0=(k%2)/2,v1=1-Math.floor((k%8)/2)/4;wdTQ(wdBQ,c.x+c.n[0]*.06,c.y+6.5,c.z+c.n[1]*.06,c.n,14,7,u0,v1-.25,u0+.5,v1);return [c.x,c.y,c.z,wdFace(c.n[0],c.n[1])]});
 wdInst([wdBox(.3,3,.3,0x2b2d30,-4.5,1.5,.3),wdBox(.3,3,.3,0x2b2d30,4.5,1.5,.3),wdBox(14.5,7.5,.3,0x1d1f22,0,6.5,.25),wdBox(14.5,.12,.9,0x3a3d41,0,2.75,-.3),wdBox(.12,.12,3,0x2b2d30,-4.5,3,1.4,.75),wdBox(.12,.12,3,0x2b2d30,4.5,3,1.4,.75)],arr,{shadow:1});wdTQMesh(wdBQ,wdBillMat)}
// ---- parks: flowers, playground, hoops ----
{const p=[wdCyl(.9,1,.25,10,0x4a3523,0,.12,0)],fc=[0xff4d6d,0xffd23f,0xff8fab,0xffffff,0xb46bff,0xff7b00];for(let k=0;k<9;k++){const a=k*2.4,r=k?.3+(k%3)*.22:0,x=Math.cos(a)*r,z=Math.sin(a)*r;p.push(wdCyl(.025,.025,.3,4,0x2f8f3a,x,.38,z),wdSph(.15,fc[k%fc.length],x,.56,z))}wdInst(p,wdA.flower)}
wdInst([wdCyl(.07,.07,4.4,6,0xd33a2c,-2.5,2.6,-3.4,0,0,Math.PI/2),wdCyl(.06,.06,2.8,6,0xd33a2c,-4.6,1.3,-2.9,.3),wdCyl(.06,.06,2.8,6,0xd33a2c,-4.6,1.3,-3.9,-.3),wdCyl(.06,.06,2.8,6,0xd33a2c,-.4,1.3,-2.9,.3),wdCyl(.06,.06,2.8,6,0xd33a2c,-.4,1.3,-3.9,-.3),
 wdBox(.03,1.8,.03,0x9a9a9a,-3.6,1.7,-3.4),wdBox(.03,1.8,.03,0x9a9a9a,-3,1.7,-3.4),wdBox(.6,.05,.25,0x1b1b1b,-3.3,.8,-3.4),wdBox(.03,1.8,.03,0x9a9a9a,-2,1.7,-3.4),wdBox(.03,1.8,.03,0x9a9a9a,-1.4,1.7,-3.4),wdBox(.6,.05,.25,0x1b1b1b,-1.7,.8,-3.4),
 wdBox(1.5,.1,1.5,0x2a6fd6,3,1.6,2.4),wdBox(.1,1.6,.1,0x2a6fd6,2.35,.8,1.75),wdBox(.1,1.6,.1,0x2a6fd6,3.65,.8,1.75),wdBox(.1,1.6,.1,0x2a6fd6,2.35,.8,3.05),wdBox(.1,1.6,.1,0x2a6fd6,3.65,.8,3.05),wdBox(.9,.08,3.5,0xf2c230,3,.85,.1,-.46),wdBox(.06,.3,3.5,0xf2c230,2.52,.98,.1,-.46),wdBox(.06,.3,3.5,0xf2c230,3.48,.98,.1,-.46),wdBox(.7,1.7,.08,0x9a9a9a,3,.8,3.3,-.2),wdBox(1.5,.5,.06,0xd33a2c,3,2.2,3.12),
 wdBox(3.2,.25,3.2,0x8a5a2b,-2.8,.12,2.6),wdBox(2.9,.06,2.9,0xe6d49c,-2.8,.26,2.6),wdCyl(.15,.2,.5,6,0x555555,2.6,.25,-3.6),wdBox(3.2,.08,.3,0x3cb043,2.6,.55,-3.6,0,0,.16)],wdA.play,{shadow:1});
wdInst([wdCyl(.09,.09,3.5,6,0x2b2d30,0,1.75,.7),wdBox(.1,.1,.8,0x2b2d30,0,3.35,.3),wdBox(1.7,1.1,.06,0xf4f4f4,0,3.45,-.1),wdBox(.6,.45,.02,0xd33a2c,0,3.3,-.14),wdG(new THREE.TorusGeometry(.23,.03,5,12),0xff6a00,0,3.05,-.42,Math.PI/2),wdCyl(.23,.14,.42,8,0xffffff,0,2.82,-.42)],wdA.hoop,{shadow:1});
{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(wdDec.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(wdDec.c,3));const nn=new Float32Array(wdDec.p.length);for(let i=1;i<nn.length;i+=3)nn[i]=1;g.setAttribute('normal',new THREE.BufferAttribute(nn,3));
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));m.receiveShadow=true;m.frustumCulled=false;scene.add(m);wdDraws++}
// ---- beach: palms, umbrellas, lifeguard towers, pier, animated water ----
const wdPZ=roadCenter(5),wdPX0=HALF+24,wdPX1=HALF+34,wdPX2=HALF+100,wdDY=1.7;
function wdPierH(x,z){if(x<wdPX0||x>wdPX2||Math.abs(z-wdPZ)>(x>wdPX2-14?8:4.5))return -1;return x<wdPX1?wdDY*(x-wdPX0)/(wdPX1-wdPX0):wdDY}
{const pp=[];let px=0,py=0;for(let k=0;k<6;k++){const t=.04+k*.05;pp.push(wdCyl(.15-.012*k,.18-.012*k,1.4,6,k%2?0x8a6b45:0x7a5c3a,px+Math.sin(t)*.62,py+.62,0,0,0,-t));px+=Math.sin(t)*1.25;py+=Math.cos(t)*1.25}
 for(let k=0;k<8;k++){const a=k*Math.PI/4+.2,g1=new THREE.BoxGeometry(.6,.05,1.8).toNonIndexed(),g2=new THREE.BoxGeometry(.4,.05,1.8).toNonIndexed();g1.translate(0,0,.9);g1.rotateX(.1+(k%2)*.18);g2.translate(0,0,.9);g2.rotateX(.85);g2.translate(0,-.2-(k%2)*.3,1.72);g1.rotateY(a);g2.rotateY(a);pp.push(wdG(g1,0x1f6a2a,px,py,0),wdG(g2,0x2b8038,px,py,0))}
 pp.push(wdSph(.17,0x4a3520,px+.18,py-.18,.1),wdSph(.17,0x4a3520,px-.12,py-.2,-.15),wdSph(.17,0x4a3520,px,py-.2,.2));
 const arr=[],roadZ=z=>{for(let j=0;j<=N;j++)if(Math.abs(z-roadCenter(j))<10)return true;return false};
 for(let z=-HALF+6;z<HALF-4;z+=7+wdR()*5){const back=wdR()<.55,x=back?HALF+3+wdR()*3.5:HALF+25+wdR()*5;if((back&&roadZ(z))||Math.abs(z-wdPZ)<8)continue;arr.push([x,.02,z,wdR()*6.28,.9+wdR()*.45]);solids.push({minX:x-.3,maxX:x+.3,minZ:z-.3,maxZ:z+.3,h:3})}
 wdInst(pp,arr,{shadow:1})}
const wdTowers=[wdPZ-82,wdPZ+72,wdPZ+190];
{const cols=[0xff4d4d,0xffd23f,0x35b0ff,0xff8a2a,0x3ddc84,0xff6fb5,0xffffff],arr=[];
 for(let z=-HALF+8;z<HALF-6;z+=6+wdR()*6){const x=HALF+30.5+wdR()*8.5;if(Math.abs(z-wdPZ)<7.5||wdTowers.some(t=>Math.abs(z-t)<6&&x<HALF+36))continue;arr.push([x,.02,z,wdR()*6.28,.9+wdR()*.3,0,cols[Math.floor(wdR()*cols.length)]])}
 arr.forEach(a=>a[5]=a[4]);
 wdInst([wdCyl(.04,.04,2.3,5,0xf2f2f2,0,1.15,0),wdG(new THREE.ConeGeometry(1.55,.55,8),0xffffff,0,2.45,0),wdBox(.85,.04,1.8,0xffffff,-.95,.03,.5),wdBox(.85,.04,1.8,0xe8e8e8,.95,.03,.3)],arr,{shadow:1});
 const tw=wdTowers.map(z=>{solids.push({minX:HALF+29.4,maxX:HALF+32.6,minZ:z-1.6,maxZ:z+1.6,h:4});return [HALF+31,.02,z,wdFace(1,0)]});
 wdInst([wdBox(.15,2.2,.15,0xe8e8e8,-1.2,1.1,-1.2),wdBox(.15,2.2,.15,0xe8e8e8,1.2,1.1,-1.2),wdBox(.15,2.2,.15,0xe8e8e8,-1.2,1.1,1.2),wdBox(.15,2.2,.15,0xe8e8e8,1.2,1.1,1.2),wdBox(3,.12,3,0xd8d0c0,0,2.2,0),wdBox(2.2,1.6,1.8,0xf4f4f4,0,3.06,.45),wdBox(2.24,.32,1.84,0xd62828,0,2.48,.45),wdBox(1.5,.6,.06,0x6fa3c7,0,3.3,-.46),
  wdBox(2.9,.12,2.7,0xd62828,0,3.98,.3,-.1),wdBox(1,.08,3.5,0xcfc6b4,0,1.1,-2.85,-.684),wdBox(.06,.8,.06,0xe8e8e8,-1.4,2.65,-1.4),wdBox(.06,.8,.06,0xe8e8e8,1.4,2.65,-1.4),wdBox(2.86,.06,.06,0xe8e8e8,0,3.05,-1.4),wdCyl(.03,.03,1.8,5,0x888888,1.25,4.9,1.3),wdBox(.55,.32,.03,0xffd23f,1.55,5.6,1.3)],tw,{shadow:1})}
{const W=0x8b6b47,Dk=0x6a5036,L=wdPX2-wdPX1,mx=(wdPX1+wdPX2)/2,rl=Math.hypot(wdPX1-wdPX0,wdDY),ra=Math.atan2(wdDY,wdPX1-wdPX0),p=[wdBox(L,.2,9,W,mx,wdDY-.1,wdPZ),wdBox(rl+.3,.2,9,W,(wdPX0+wdPX1)/2,wdDY/2-.1,wdPZ,0,0,ra),wdBox(14,.2,16,W,wdPX2-7,wdDY-.11,wdPZ)];
 for(let x=wdPX1+1;x<wdPX2;x+=2)p.push(wdBox(.07,.02,x>wdPX2-14?16:9,Dk,x,wdDY+.006,wdPZ));
 for(const s of [-1,1]){p.push(wdBox(L-14,.09,.12,Dk,mx-7,wdDY+1.05,wdPZ+s*4.4),wdBox(L-14,.06,.08,Dk,mx-7,wdDY+.55,wdPZ+s*4.4),wdBox(rl,.09,.12,Dk,(wdPX0+wdPX1)/2,wdDY/2+1.05,wdPZ+s*4.4,0,0,ra),wdBox(14,.09,.12,Dk,wdPX2-7,wdDY+1.05,wdPZ+s*7.9),wdBox(.12,.09,3.5,Dk,wdPX2-14,wdDY+1.05,wdPZ+s*6.15));
  for(let x=wdPX1;x<=wdPX2-14;x+=3)p.push(wdBox(.12,1.1,.12,Dk,x,wdDY+.55,wdPZ+s*4.4));for(let x=wdPX2-14;x<=wdPX2;x+=3.5)p.push(wdBox(.12,1.1,.12,Dk,x,wdDY+.55,wdPZ+s*7.9));
  for(let x=wdPX1+2;x<=wdPX2;x+=6)p.push(wdCyl(.24,.24,wdDY+1.2,6,0x4f3d2a,x,(wdDY-1.4)/2,wdPZ+s*(x>wdPX2-14?7.3:3.9)));
  for(const z of [-3.2,3.2])p.push(wdBox(.2,3,.2,0xf0f0f0,wdPX2-7+s*3.2,wdDY+1.5,wdPZ+z))}
 for(let z=-7.9;z<=7.9;z+=3.95)p.push(wdBox(.12,1.1,.12,Dk,wdPX2,wdDY+.55,wdPZ+z));p.push(wdBox(.12,.09,16,Dk,wdPX2,wdDY+1.05,wdPZ),wdG(new THREE.ConeGeometry(5.4,1.9,4),0xc0392b,wdPX2-7,wdDY+3.95,wdPZ,0,Math.PI/4),wdBox(2.4,.1,.6,W,wdPX2-7,wdDY+.5,wdPZ),wdBox(.1,.5,.5,Dk,wdPX2-8,wdDY+.25,wdPZ),wdBox(.1,.5,.5,Dk,wdPX2-6,wdDY+.25,wdPZ));
 const lamps=[];for(let x=wdPX1+5,k=0;x<wdPX2-15;x+=11,k++){const z=wdPZ+(k%2?4.3:-4.3);p.push(wdBox(.14,3.3,.14,0x24272b,x,wdDY+1.65,z));lamps.push([x,wdDY+3.35,z])}
 lamps.push([wdPX2-7,wdDY+2.95,wdPZ]);
 const m=new THREE.Mesh(U.mergeBufferGeometries(p),wdMat);m.castShadow=true;m.receiveShadow=true;scene.add(m);wdDraws++;wdInst(new THREE.BoxGeometry(.55,.3,.55),lamps,{mat:lampMat,noRecv:1})}
const wdCollide0=collide;
collide=function(p,r,maxH){const ox=p.x,res=wdCollide0(p,r,maxH);if(ox>HALF+46&&ox<wdPX2+3&&wdPierH(Math.min(ox,wdPX2),p.z)>=0){const hw=(ox>wdPX2-13.5?8:4.5)-.6;p.x=Math.min(ox,wdPX2-.6);p.z=Math.max(wdPZ-hw,Math.min(wdPZ+hw,p.z))}return res};
const wdOldSea=scene.children.find(o=>o.isMesh&&o.geometry&&o.geometry.parameters&&o.geometry.parameters.width===700);if(wdOldSea)wdOldSea.visible=false;
const wdWaterN=canvasTex(128,128,g=>{const im=g.createImageData(128,128),H=(x,y)=>{const a=x/128*6.2832,b=y/128*6.2832;return Math.sin(a*2+b)*.5+Math.sin(b*3-a)*.35+Math.sin(a*5+b*2)*.2+Math.sin(a*3-b*4)*.15+Math.sin(a*7+b*6)*.08};
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){const dx=(H(x+1,y)-H(x-1,y))*2.2,dy=(H(x,y+1)-H(x,y-1))*2.2,l=Math.hypot(dx,dy,1),i=(y*128+x)*4;im.data[i]=(-dx/l*.5+.5)*255;im.data[i+1]=(-dy/l*.5+.5)*255;im.data[i+2]=(1/l*.5+.5)*255;im.data[i+3]=255}g.putImageData(im,0,0)},[38,82]);wdWaterN.encoding=THREE.LinearEncoding;
const wdWater=new THREE.Mesh(new THREE.PlaneGeometry(700,SIZE+900),new THREE.MeshStandardMaterial({color:new THREE.Color(0x1f7fc4).convertSRGBToLinear(),metalness:.6,roughness:.16,normalMap:wdWaterN,normalScale:new THREE.Vector2(.4,.4)}));wdWater.rotation.x=-Math.PI/2;wdWater.position.set(HALF+390,.06,0);wdWater.receiveShadow=true;scene.add(wdWater);wdDraws++;
const wdFoam=new THREE.Mesh(new THREE.PlaneGeometry(5,SIZE+400),new THREE.MeshBasicMaterial({map:canvasTex(32,256,g=>{g.clearRect(0,0,32,256);for(let y=0;y<256;y++){const e=10+Math.sin(y/256*6.2832*3)*5+Math.sin(y/256*6.2832*11)*3;for(let x=0;x<32;x++){const a=x<e?Math.min(1,x/4)*(.55+.45*Math.random()):Math.max(0,1-(x-e)/9)*.6*Math.random();g.fillStyle='rgba(255,255,255,'+a.toFixed(3)+')';g.fillRect(x,y,1,1)}}},[1,26]),transparent:true,depthWrite:false,opacity:.7}));
wdFoam.rotation.x=-Math.PI/2;wdFoam.position.set(HALF+41.5,.09,0);scene.add(wdFoam);wdDraws++;
// ---- sky: sun, moon, clouds, birds ----
const wdSun=new THREE.Mesh(new THREE.CircleGeometry(7,24),new THREE.MeshBasicMaterial({toneMapped:false,fog:false,depthWrite:false}));scene.add(wdSun);wdDraws++;
const wdMoon=new THREE.Mesh(new THREE.CircleGeometry(6,24),new THREE.MeshBasicMaterial({toneMapped:false,fog:false,depthWrite:false,map:canvasTex(128,128,g=>{g.fillStyle='#e9edf2';g.fillRect(0,0,128,128);for(const c of [[40,44,13],[82,34,8],[70,80,17],[34,88,7],[98,70,6],[56,22,5],[92,100,9]]){g.fillStyle='rgba(120,130,150,.5)';g.beginPath();g.arc(c[0],c[1],c[2],0,7);g.fill()}})}));scene.add(wdMoon);wdDraws++;
const wdSunDir=new THREE.Vector3(),wdCN=30,wdCW=500,wdCl=[];
const wdCloudGeo=U.mergeBufferGeometries([[0,0,0,1,.5,.8],[.9,.1,.2,.75,.42,.6],[-1,.05,-.1,.8,.4,.65],[.3,.15,-.5,.6,.38,.5],[-.4,.12,.5,.65,.4,.55],[1.6,-.02,-.1,.5,.3,.45]].map(a=>{const g=new THREE.IcosahedronGeometry(1,1);g.scale(a[3],a[4],a[5]);g.translate(a[0],a[1],a[2]);return g}));
{const ps=wdCloudGeo.attributes.position,c=new Float32Array(ps.count*3);for(let i=0;i<ps.count;i++){const v=.74+.26*Math.max(0,Math.min(1,(ps.getY(i)+.3)/.7));c[i*3]=c[i*3+1]=c[i*3+2]=v}wdCloudGeo.setAttribute('color',new THREE.BufferAttribute(c,3))}
const wdCloudMat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.92,fog:false,depthWrite:false,toneMapped:false}),wdClouds=new THREE.InstancedMesh(wdCloudGeo,wdCloudMat,wdCN);wdClouds.frustumCulled=false;scene.add(wdClouds);wdDraws++;
for(let i=0;i<wdCN;i++)wdCl.push({x:wdR()*wdCW,z:wdR()*wdCW,y:72+wdR()*34,s:20+wdR()*18,r:wdR()*6.28});
const wdBN=24,wdBirdGeo=new THREE.BufferGeometry();wdBirdGeo.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.25,0,0,.25,-.85,.3,.08,0,0,-.25,.85,.3,.08,0,0,.25],3));
const wdBirds=new THREE.InstancedMesh(wdBirdGeo,new THREE.MeshBasicMaterial({color:0x14161a,side:THREE.DoubleSide}),wdBN),wdBd=[];wdBirds.frustumCulled=false;scene.add(wdBirds);wdDraws++;
for(let i=0;i<wdBN;i++){const p=wdParkList[i%6];wdBd.push({cx:wdC0+p[0]*CELL,cz:wdC0+p[1]*CELL,r:7+wdR()*9,y:13+wdR()*10,a:wdR()*6.28,w:(.5+wdR()*.4)*(wdR()<.5?1:-1),ph:wdR()*6})}
function wdTick(dt){wdT+=dt;const sunA=dayT*Math.PI*2,sunH=Math.sin(sunA),day=Math.max(0,Math.min(1,sunH*3+.5)),night=1-day,wet=typeof rain==='number'?rain:0,cp=cam.position;
 const ph=Math.floor((wdT%16)/2);if(ph!==wdPh){wdPh=ph;wdSetTL(wdTLA,ph<3?2:ph===3?1:0);wdSetTL(wdTLB,ph<4?0:ph<7?2:1)}
 wdSignMat.color.setScalar(.8+night*1.5);wdBillMat.color.setScalar(.85+night*.7);const bl=.3+night*(Math.sin(wdT*3.5)>0?5:.15);wdBlinkMat.color.setRGB(bl,bl*.04,bl*.04);
 wdWaterN.offset.x+=dt*.018;wdWaterN.offset.y+=dt*.011;wdFoam.position.x=HALF+41.5+Math.sin(wdT*.7)*1.3;wdFoam.material.opacity=(.45+.3*Math.sin(wdT*.7+1.2))*(.35+.65*day);
 wdSunDir.set(Math.cos(sunA)*80,sunH*120,40).normalize();wdSun.visible=wdSunDir.y>-.05;
 if(wdSun.visible){wdSun.position.copy(cp).addScaledVector(wdSunDir,236);wdSun.lookAt(cp);const k=Math.max(0,Math.min(1,sunH*2.2)),f=1-wet*.93;wdSun.material.color.setRGB(9*f,(3.2+4.6*k)*f,(1+4.2*k)*f)}
 wdSunDir.set(-Math.cos(sunA)*80,-sunH*45,-90).normalize();wdMoon.visible=wdSunDir.y>-.03&&night>.05;
 if(wdMoon.visible){wdMoon.position.copy(cp).addScaledVector(wdSunDir,236);wdMoon.lookAt(cp);wdMoon.material.color.setScalar((.4+night*1.3)*(1-wet*.9))}
 const warm=4*day*(1-day),cb=.09+.91*day,g=1-wet*.5;wdCloudMat.color.setRGB(cb*g,(cb+.02*night)*(1-.22*warm)*g,(cb+.07*night)*(1-.42*warm)*g);wdCloudMat.opacity=.88+wet*.1;
 for(let i=0;i<wdCN;i++){const c=wdCl[i],rx=((c.x+wdT*2.2-cp.x)%wdCW+wdCW)%wdCW-wdCW/2,rz=((c.z+wdT*.7-cp.z)%wdCW+wdCW)%wdCW-wdCW/2,dy=c.y-cp.y,d=Math.sqrt(rx*rx+rz*rz+dy*dy),f=Math.max(0,Math.min(1,(246-d)/28)),s=c.s*f*(1+wet*.5);
  wdDum.position.set(cp.x+rx,c.y,cp.z+rz);wdDum.rotation.set(0,c.r,0);wdDum.scale.set(s,s*.8,s);wdDum.updateMatrix();wdClouds.setMatrixAt(i,wdDum.matrix)}wdClouds.instanceMatrix.needsUpdate=true;
 const bs=day>.3&&wet<.4?1:0;for(let i=0;i<wdBN;i++){const b=wdBd[i];b.a+=b.w*dt;const vx=-Math.sin(b.a)*b.w,vz=Math.cos(b.a)*b.w;wdDum.position.set(b.cx+Math.cos(b.a)*b.r,b.y+Math.sin(wdT*.6+b.ph)*1.5,b.cz+Math.sin(b.a)*b.r);wdDum.rotation.set(0,Math.atan2(-vx,-vz),0);wdDum.scale.set(bs,bs*Math.sin(wdT*9+b.ph)*1.3,bs);wdDum.updateMatrix();wdBirds.setMatrixAt(i,wdDum.matrix)}wdBirds.instanceMatrix.needsUpdate=true;
 // pier: lift player, cars and shooters onto the deck
 if(!driving){const h=wdPierH(pos.x,pos.z);if(h>=0){const ty=Math.max(.3,h);if(vel.y<=30*dt+.001&&pos.y<=ty+.08){pos.y=ty;vel.y=state==='play'?30*dt:0;onGround=true}}}
 for(const c of cars){const h=wdPierH(c.m.position.x,c.m.position.z);if(h>=0){c.m.position.y=h;c.m.userData.wdUp=1}else if(c.m.userData.wdUp){c.m.position.y=0;c.m.userData.wdUp=0}}
 for(const pc of police){const h=wdPierH(pc.m.position.x,pc.m.position.z);if(h>=0){pc.m.position.y=h;pc.m.userData.wdUp=1}else if(pc.m.userData.wdUp){pc.m.position.y=0;pc.m.userData.wdUp=0}}
 for(const s of shooters)if(!s.dead){const h=wdPierH(s.g.position.x,s.g.position.z);s.g.position.y=h>=0?Math.max(.3,h):.3}}
MODS.push(wdTick);
