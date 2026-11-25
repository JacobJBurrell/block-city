// ---------- crime: police escalation (helicopters, SWAT, army, roadblocks, BUSTED), store robberies, interiors, street life ----------
const cpTH=[0,1,3,6,10,16];function cpStars(n){if(wantedScore<cpTH[n])wantedScore=cpTH[n]}
function cpCol(g,c){const col=new THREE.Color(c),n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=col.r;a[i*3+1]=col.g;a[i*3+2]=col.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
const cpB=(w,h,d,x,y,z,c)=>cpCol(bxg(w,h,d,x,y,z),c),cpCy=(r,h,n,x,y,z,c,rx,rz)=>cpCol(gT(new THREE.CylinderGeometry(r,r,h,n),x,y,z,rx||0,0,rz||0),c);
const cpVM=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.15}),cpGlow=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}),cpMG=a=>U.mergeBufferGeometries(a);
const cpR=(a,b)=>a+Math.random()*(b-a);
const cpFlat=new THREE.MeshBasicMaterial({vertexColors:true}),cpFlatIn=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide});
function cpShade(g,inv){const c=g.attributes.color,n=g.attributes.normal;for(let i=0;i<c.count;i++){const s=inv?-1:1,f=.74+.26*n.getY(i)*s+.1*n.getZ(i)*s-.06*Math.abs(n.getX(i));c.setXYZ(i,c.getX(i)*f,c.getY(i)*f,c.getZ(i)*f)}return g}
// ----- banner (BUSTED / WASTED) -----
const cpBan=document.createElement('div');cpBan.style.cssText='position:fixed;left:0;right:0;top:34%;text-align:center;pointer-events:none;z-index:40;opacity:0;transition:opacity .35s;background:linear-gradient(90deg,transparent,#000c 25%,#000c 75%,transparent);padding:10px 0';document.body.appendChild(cpBan);
function cpBanner(t,col,sub,sec){cpBan.innerHTML='<div style="font-weight:900;font-style:italic;font-size:50px;letter-spacing:3px;color:'+col+';text-shadow:0 3px 0 #000">'+t+'</div><div style="color:#fff;font-weight:700;font-size:15px">'+(sub||'')+'</div>';cpBan.style.opacity=1;clearTimeout(cpBanner.h);cpBanner.h=setTimeout(()=>{cpBan.style.opacity=0},(sec||3)*1000)}
{const d0=die;die=function(){const c0=cash;d0();$('msg').style.display='none';cpBanner('WASTED','#e03a3a','Hospital bill -$'+(c0-cash),3.3)}}
// ----- menus -----
const cpPan=document.createElement('div');cpPan.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;display:none;align-items:center;justify-content:center;background:#0009;z-index:70';document.body.appendChild(cpPan);let cpPanCb=null;
function cpOpen(html,cb){cpPanCb=cb;cpPan.innerHTML='<div style="width:min(430px,90vw);max-height:86vh;overflow:auto;background:#14171cf2;border:2px solid #ffd23f;border-radius:16px;padding:14px 16px;color:#fff;font-weight:700;font-size:15px;line-height:1.55">'+html+'</div>';cpPan.style.display='flex';state='cpmenu';joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;fireId=null;burstN=0;jumpQ=carQ=false;vel.x=vel.z=0}
function cpClose(){cpPan.style.display='none';if(state==='cpmenu')state='play'}
function cpBtn(k,t,c){return '<div data-k="'+k+'" style="display:inline-block;margin:10px 8px 0 0;padding:10px 18px;border-radius:12px;background:'+(c||'#ffd23f')+';color:#000;font-weight:900">'+t+'</div>'}
cpPan.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const b=e.target&&e.target.closest?e.target.closest('[data-k]'):null;if(b&&cpPanCb)cpPanCb(b.getAttribute('data-k'))},{passive:false});
let cpSave={own:false,car:null};try{const j=JSON.parse(localStorage.getItem('blockcity_cp')||'null');if(j)cpSave=j}catch(e){}
function cpStore(){try{localStorage.setItem('blockcity_cp',JSON.stringify(cpSave))}catch(e){}if(typeof msSave==='function')msSave()}
// ----- places: stores, banks, safehouse, police station, hospital, club -----
// ===== interiors v2: furnished rooms, storefronts with real doors, seamless enter/exit, counters =====
const cpTypes={store:{l:'24/7 MART',c:0x3ddc84,stars:2,dur:7,pay:[300,900]},jewel:{l:'LUMIERE JEWELS',c:0x5fe3ff,stars:3,dur:9,pay:[2300,2900]},bank:{l:'MERIDIAN BANK',c:0xffc93c,stars:4,dur:16,pay:[8000,12000]},
 safe:{l:'APARTMENTS',c:0x4a9dff},police:{l:'POLICE',c:0x5a7dff},hosp:{l:'HOSPITAL',c:0xff4d6d},club:{l:'CLUB NEON',c:0xff3df2},gun:{l:'IRONSIGHT GUNS',c:0xffb020},clinic:{l:'CITY CLINIC',c:0xff6f91},estate:{l:'PRIME KEY REALTY',c:0x6dff8a}};
const cpPlaces=[],cpRooms={},cpNPC=new THREE.Group();scene.add(cpNPC);
const cpLight=new THREE.PointLight(0xfff2dd,0,30,1.4);scene.add(cpLight);
// ---- textures ----
const cpAni=Math.min(8,(renderer.capabilities.getMaxAnisotropy&&renderer.capabilities.getMaxAnisotropy())||4);
function cpCT(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=cpAni;return t}
function cpSpeck(g,w,h,n,cols,sz){for(let i=0;i<n;i++){g.fillStyle=cols[i%cols.length];const s=sz*(.5+Math.random());g.fillRect(Math.random()*w,Math.random()*h,s,s)}}
const cpTX={},cpRough={tile:.3,wood:.5,carpet:.98,marble:.14,vinyl:.42,concrete:.85,dark:.2};
function cpTexOf(k){if(cpTX[k])return cpTX[k];const S=256;let t;
 if(k==='tile')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#d9d7d1';g.fillRect(0,0,w,h);for(let i=0;i<4;i++)for(let j=0;j<4;j++){const v=212+Math.random()*26|0;g.fillStyle='rgb('+v+','+(v-2)+','+(v-7)+')';g.fillRect(i*64+2,j*64+2,60,60)}cpSpeck(g,w,h,1400,['rgba(0,0,0,.05)','rgba(255,255,255,.07)'],2);g.fillStyle='rgba(80,80,80,.55)';for(let i=0;i<=4;i++){g.fillRect(i*64-1,0,2,h);g.fillRect(0,i*64-1,w,2)}});
 else if(k==='wood')t=cpCT(S,S,(g,w,h)=>{const cs=['#8a5a36','#9c6a43','#7a4b2c','#a8744a','#93603b'];for(let r=0;r<6;r++){const y=r*42.67;g.fillStyle=cs[(r*3+1)%5];g.fillRect(0,y,w,43);for(let k2=0;k2<26;k2++){g.strokeStyle='rgba(40,20,5,'+(.05+Math.random()*.08)+')';g.lineWidth=1;g.beginPath();const yy=y+Math.random()*42;g.moveTo(0,yy);for(let x=0;x<=w;x+=32)g.lineTo(x,yy+Math.sin(x/40+k2)*2);g.stroke()}g.fillStyle='rgba(20,10,0,.55)';g.fillRect(0,y,w,1.5);const sx=(r*97)%w;g.fillRect(sx,y,1.5,43)}});
 else if(k==='carpet')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#9a9a9a';g.fillRect(0,0,w,h);cpSpeck(g,w,h,9000,['rgba(0,0,0,.09)','rgba(255,255,255,.09)','rgba(0,0,0,.05)'],1.6)});
 else if(k==='marble')t=cpCT(512,512,(g,w,h)=>{g.fillStyle='#f2efe9';g.fillRect(0,0,w,h);for(let i=0;i<40;i++){g.fillStyle='rgba(200,195,185,'+Math.random()*.15+')';g.beginPath();g.arc(Math.random()*w,Math.random()*h,20+Math.random()*60,0,7);g.fill()}for(let v=0;v<16;v++){g.strokeStyle='rgba(120,115,110,'+(.12+Math.random()*.2)+')';g.lineWidth=.6+Math.random()*2.2;g.beginPath();let x=Math.random()*w,y=Math.random()*h;g.moveTo(x,y);for(let s=0;s<30;s++){x+=(Math.random()-.4)*28;y+=(Math.random()-.5)*28;g.lineTo(x,y)}g.stroke()}g.strokeStyle='rgba(90,90,90,.35)';g.lineWidth=2;g.strokeRect(0,0,w,h)});
 else if(k==='vinyl')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#d6d6d4';g.fillRect(0,0,w,h);cpSpeck(g,w,h,3000,['rgba(0,0,0,.08)','rgba(255,255,255,.1)','rgba(60,80,90,.08)'],2.2);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(0,0,w,1.5);g.fillRect(0,0,1.5,h);g.fillRect(0,128,w,1);g.fillRect(128,0,1,h)});
 else if(k==='concrete')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#9d9c98';g.fillRect(0,0,w,h);for(let i=0;i<60;i++){g.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,255,255')+','+Math.random()*.06+')';g.beginPath();g.arc(Math.random()*w,Math.random()*h,8+Math.random()*30,0,7);g.fill()}cpSpeck(g,w,h,2500,['rgba(0,0,0,.08)','rgba(255,255,255,.06)'],1.5);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,0,w,1.5)});
 else if(k==='dark')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#202024';g.fillRect(0,0,w,h);cpSpeck(g,w,h,2500,['rgba(255,255,255,.04)','rgba(0,0,0,.2)'],1.5);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(0,0,w,2);g.fillRect(0,0,2,h)});
 else if(k==='plaster')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#efefef';g.fillRect(0,0,w,h);cpSpeck(g,w,h,5000,['rgba(0,0,0,.025)','rgba(255,255,255,.05)'],2)});
 else if(k==='wallpaper')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#e6e6e6';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=32){g.fillStyle='rgba(0,0,0,.07)';g.fillRect(x,0,12,h);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(x+16,0,3,h)}for(let y=16;y<h;y+=32)for(let x=22;x<w;x+=32){g.fillStyle='rgba(0,0,0,.08)';g.beginPath();g.arc(x,y,3,0,7);g.fill()}});
 else if(k==='brick')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#b9b1a6';g.fillRect(0,0,w,h);const cs=['#8b4a3a','#9a5442','#7d3f31','#a35d47','#874636'];for(let r=0;r<8;r++)for(let c2=-1;c2<4;c2++){const x=c2*64+(r%2?32:0);g.fillStyle=cs[(r*5+c2*3+11)%5];g.fillRect(x+2,r*32+2,60,28)}cpSpeck(g,w,h,2500,['rgba(0,0,0,.1)','rgba(255,255,255,.06)'],2)});
 else if(k==='acoustic')t=cpCT(S,S,(g,w,h)=>{g.fillStyle='#f1f1ee';g.fillRect(0,0,w,h);cpSpeck(g,w,h,3500,['rgba(0,0,0,.08)'],1.4);g.fillStyle='rgba(120,120,120,.6)';g.fillRect(0,0,w,3);g.fillRect(0,0,3,h);g.fillRect(0,127,w,2);g.fillRect(127,0,2,h)});
 else if(k==='view')t=cpCT(512,256,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,'#7fbfff');q.addColorStop(.75,'#e6f4ff');q.addColorStop(1,'#cfd8df');g.fillStyle=q;g.fillRect(0,0,w,h);const s=g.createRadialGradient(390,60,4,390,60,90);s.addColorStop(0,'rgba(255,250,225,.95)');s.addColorStop(1,'rgba(255,250,225,0)');g.fillStyle=s;g.fillRect(0,0,w,h);
   for(let i=0;i<22;i++){const bw=18+Math.random()*40,bh=40+Math.random()*140,x=Math.random()*w;g.fillStyle=['#b8c7d6','#a7b9cc','#c7d3df','#9fb0c3'][i%4];g.fillRect(x,h-30-bh,bw,bh);g.fillStyle='rgba(255,255,255,.35)';for(let y=h-26-bh;y<h-36;y+=9)for(let xx=x+3;xx<x+bw-4;xx+=7)g.fillRect(xx,y,3,4)}
   for(let i=0;i<5;i++){const x=40+i*110+Math.random()*30;g.strokeStyle='#5b4a3a';g.lineWidth=4;g.beginPath();g.moveTo(x,h-28);g.quadraticCurveTo(x+6,h-80,x+2,h-120);g.stroke();g.strokeStyle='#3f7a3a';g.lineWidth=5;for(let a=0;a<7;a++){g.beginPath();g.moveTo(x+2,h-120);g.quadraticCurveTo(x+2+Math.cos(a)*22,h-132,x+2+Math.cos(a*.9)*40,h-110+Math.sin(a)*10);g.stroke()}}
   g.fillStyle='#8f969c';g.fillRect(0,h-30,w,30);g.fillStyle='#b9bec2';g.fillRect(0,h-30,w,5)});
 else if(k==='glimpse')t=cpCT(1024,512,(g,w,h)=>{const pal=[['#fff4d8','#d8c29a','#3ddc84'],['#3a2850','#160e22','#9ff3ff'],['#fff1dc','#cdb894','#c9a227'],['#ffe9c7','#c29b66','#ff9a3c'],['#6b5642','#2b221a','#ffb020'],['#f4fbfb','#cfe3e2','#3aa6a0'],['#f3eadb','#c9b79a','#6dff8a'],['#1a0f24','#05030a','#ff3df2']];
   for(let v=0;v<8;v++){g.save();g.translate((v%4)*256,(v>>2)*256);g.beginPath();g.rect(0,0,256,256);g.clip();const P=pal[v],q=g.createLinearGradient(0,0,0,256);q.addColorStop(0,P[0]);q.addColorStop(1,P[1]);g.fillStyle=q;g.fillRect(0,0,256,256);
    if(v!==7)for(let i=0;i<3;i++){g.fillStyle='rgba(255,255,240,.8)';g.fillRect(30+i*80,8,50,6)}
    if(v<4){for(let s=0;s<4;s++){const y=90+s*40;g.fillStyle='rgba(40,30,20,.55)';g.fillRect(0,y,256,5);for(let x=4;x<252;x+=9+Math.random()*7){g.fillStyle=v===1?'rgba(255,255,255,'+(.2+Math.random()*.6)+')':['#e63946','#f4a261','#2a9d8f','#ffd60a','#1d70b8','#9b5de5'][Math.random()*6|0];g.fillRect(x,y-8-Math.random()*16,6,20)}}}
    else if(v===4){g.fillStyle='#4a3a2a';g.fillRect(0,60,256,120);for(let r=0;r<3;r++)for(let i=0;i<6;i++){const x=12+i*42,y=78+r*36;g.fillStyle='#17181a';g.fillRect(x,y,34,5);g.fillRect(x+24,y+3,9,9);g.fillRect(x+4,y+4,4,8)}g.fillStyle='#2b2b2b';g.fillRect(0,196,256,30);g.fillStyle='rgba(200,230,255,.25)';g.fillRect(0,190,256,8)}
    else if(v===5){g.fillStyle='#3aa6a0';g.fillRect(0,120,256,6);g.fillStyle='#ff3050';g.fillRect(170,46,40,12);g.fillRect(184,32,12,40);for(let i=0;i<6;i++){g.fillStyle='#3aa6a0';g.fillRect(14+i*36,170,28,22);g.fillRect(14+i*36,150,28,8);g.fillStyle='#333';g.fillRect(16+i*36,192,4,20);g.fillRect(36+i*36,192,4,20)}g.fillStyle='#fff';g.fillRect(20,70,110,60);g.fillStyle='#9ad1d4';g.fillRect(28,80,94,8)}
    else if(v===6){for(let i=0;i<3;i++){g.fillStyle='#5b3a29';g.fillRect(10+i*84,150,70,10);g.fillStyle='#4a3426';g.fillRect(14+i*84,160,6,50);g.fillRect(70+i*84,160,6,50);g.fillStyle='#111';g.fillRect(30+i*84,118,34,26);g.fillStyle='#5fb8ff';g.fillRect(33+i*84,121,28,20)}
     for(let i=0;i<4;i++){g.fillStyle='#f6efe2';g.fillRect(14+i*62,46,46,40);g.fillStyle='#a5482f';g.beginPath();g.moveTo(12+i*62,58);g.lineTo(37+i*62,40);g.lineTo(62+i*62,58);g.fill();g.fillStyle='#7cb342';g.fillRect(14+i*62,78,46,8)}}
    else{for(let i=0;i<9;i++){g.strokeStyle=['#ff2bd6','#2bd6ff','#7a2bff'][i%3];g.lineWidth=3;g.globalAlpha=.8;g.beginPath();g.moveTo(Math.random()*256,0);g.lineTo(Math.random()*256,256);g.stroke()}g.globalAlpha=1;for(let i=0;i<7;i++){const x=14+i*34+Math.random()*8,y=150+Math.random()*20;g.fillStyle='#0a0610';g.beginPath();g.arc(x,y,9,0,7);g.fill();g.fillRect(x-11,y+8,22,60)}}
    g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,216,256,40);g.fillStyle=P[2];g.globalAlpha=.6;g.fillRect(0,212,256,4);g.globalAlpha=1;g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.moveTo(0,0);g.lineTo(90,0);g.lineTo(10,256);g.lineTo(0,256);g.fill();g.restore()}});
 else if(k==='street')t=cpCT(512,256,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,110);q.addColorStop(0,'#9fd0ff');q.addColorStop(1,'#e8f4ff');g.fillStyle=q;g.fillRect(0,0,w,h);
   for(let i=0;i<7;i++){const x=i*76-10+Math.random()*12,bw=70,bh=90+Math.random()*60,c=['#c9cfd6','#e0b48a','#9fb3c8','#d8d0b8','#b88a7a'][i%5];g.fillStyle=c;g.fillRect(x,150-bh,bw,bh);g.fillStyle='rgba(28,42,58,.75)';for(let y=150-bh+8;y<140;y+=16)for(let xx=x+6;xx<x+bw-8;xx+=14)g.fillRect(xx,y,8,10);g.fillStyle=['#b3261e','#1f6f43','#1c3f7a','#d9772b'][i%4];g.fillRect(x+6,128,bw-12,8)}
   g.fillStyle='#8c8e92';g.fillRect(0,150,w,16);g.fillStyle='#2f3136';g.fillRect(0,166,w,52);g.fillStyle='#f4d03f';for(let x=0;x<w;x+=60)g.fillRect(x,190,34,3);g.fillStyle='#8c8e92';g.fillRect(0,218,w,38);g.fillStyle='#6f7176';g.fillRect(0,218,w,3);
   for(const cx of[60,300]){const c=['#e63946','#1d70b8','#ffffff','#2a9d8f'][Math.random()*4|0];g.fillStyle=c;g.fillRect(cx,182,92,20);g.fillRect(cx+18,170,54,14);g.fillStyle='#223344';g.fillRect(cx+22,172,22,10);g.fillRect(cx+48,172,20,10);g.fillStyle='#111';g.beginPath();g.arc(cx+18,203,7,0,7);g.arc(cx+74,203,7,0,7);g.fill()}
   g.fillStyle='#333';g.fillRect(440,96,5,122);g.fillRect(420,94,30,6)});
 cpTX[k]=t;return t}
function cpAtlasTex(){if(cpTX.atlas)return cpTX.atlas;return cpTX.atlas=cpCT(1024,1024,g=>{const C=(i,f)=>{g.save();g.translate((i%4)*256,(i>>2)*256);g.beginPath();g.rect(0,0,256,256);g.clip();f();g.restore()};
 const T=(t,x,y,sz,col,wt)=>{g.fillStyle=col;g.font=(wt||'900')+' '+sz+'px -apple-system,Helvetica,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,x,y)};
 const GR=(a,b)=>{const q=g.createLinearGradient(0,0,0,256);q.addColorStop(0,a);q.addColorStop(1,b);g.fillStyle=q;g.fillRect(0,0,256,256)};
 C(0,()=>{GR('#e0262b','#8f0f14');g.fillStyle='#fff';g.beginPath();g.ellipse(128,152,34,68,0,0,7);g.fill();g.fillRect(116,62,24,42);g.fillStyle='#e0262b';g.fillRect(100,142,56,22);T('FIZZ UP',128,38,40,'#fff');T('ICE COLD',128,232,22,'#ffd60a')});
 C(1,()=>{GR('#6a2bd1','#ff8a00');g.fillStyle='#ffd23f';g.beginPath();g.moveTo(70,80);g.lineTo(186,80);g.lineTo(176,200);g.lineTo(80,200);g.closePath();g.fill();T('NOVA',128,120,36,'#6a2bd1');T('CHIPS',128,160,30,'#e0262b');T('NEW FLAVOR',128,232,20,'#fff')});
 C(2,()=>{GR('#0f8a4a','#05391e');T('SUPER',128,46,34,'#fff');T('7',128,140,130,'#ffd60a');T('LOTTO $2',128,230,24,'#fff')});
 C(3,()=>{GR('#ffd60a','#ff9f1c');g.fillStyle='#c2410c';g.beginPath();g.ellipse(128,130,80,24,0,0,7);g.fill();g.fillStyle='#7c2d12';g.beginPath();g.ellipse(128,124,70,12,0,0,7);g.fill();T('HOT DOG',128,50,38,'#7c2d12');T('$1.99',128,205,46,'#b91c1c')});
 C(4,()=>{GR('#141018','#000');g.strokeStyle='#e6c26a';g.lineWidth=5;g.beginPath();g.moveTo(128,70);g.lineTo(180,110);g.lineTo(128,190);g.lineTo(76,110);g.closePath();g.moveTo(76,110);g.lineTo(180,110);g.stroke();T('LUMIERE',128,222,32,'#e6c26a','700')});
 C(5,()=>{GR('#0f1f3d','#08122a');g.strokeStyle='#d4af37';g.lineWidth=8;g.strokeRect(24,24,208,208);T('M',128,112,120,'#d4af37','700');T('MERIDIAN TRUST',128,200,21,'#d4af37','700')});
 C(6,()=>{g.fillStyle='#efe3c4';g.fillRect(0,0,256,256);T('WANTED',128,36,40,'#3a2a1a');g.fillStyle='#3a2a1a';g.beginPath();g.arc(128,108,34,0,7);g.fill();g.fillRect(84,140,88,70);T('REWARD $5,000',128,232,20,'#7a1010')});
 C(7,()=>{GR('#1d3557','#0b1a30');g.fillStyle='#d9b44a';g.beginPath();for(let k=0;k<12;k++){const a=k*Math.PI/6,r=k%2?40:70;g.lineTo(128+Math.cos(a)*r,110+Math.sin(a)*r)}g.closePath();g.fill();T('SERVE',128,204,26,'#fff');T('AND PROTECT',128,234,20,'#d9b44a')});
 C(8,()=>{g.fillStyle='#f4fbfb';g.fillRect(0,0,256,256);g.fillStyle='#3aa6a0';g.fillRect(0,0,256,56);T('HEALTH TIP',128,30,28,'#fff');g.fillStyle='#7fd1cb';for(let k=0;k<5;k++){g.beginPath();g.arc(70+k*29,130,14,0,7);g.fill()}T('WASH YOUR',128,184,26,'#1f5f5b');T('HANDS',128,216,30,'#1f5f5b')});
 C(9,()=>{g.fillStyle='#efefef';g.fillRect(0,0,256,256);for(let k=6;k>0;k--){g.fillStyle=k%2?'#111':'#f5f5f5';g.beginPath();g.arc(128,120,k*17,0,7);g.fill()}g.fillStyle='#e0262b';g.beginPath();g.arc(128,120,9,0,7);g.fill();T('IRONSIGHT',128,236,22,'#e0262b')});
 C(10,()=>{const q=g.createLinearGradient(0,0,256,256);q.addColorStop(0,'#ff2bd6');q.addColorStop(1,'#2b6cff');g.fillStyle=q;g.fillRect(0,0,256,256);T('NIGHT',128,100,50,'#fff');T('SHIFT',128,152,50,'#fff');T('FRI - SAT',128,220,22,'#ffe')});
 C(11,()=>{g.fillStyle='#f3eee2';g.fillRect(0,0,256,256);const cs=['#e63946','#1d70b8','#f4a261','#2a9d8f','#111'];for(let k=0;k<7;k++){g.fillStyle=cs[k%5];g.fillRect(20+Math.random()*170,20+Math.random()*170,30+Math.random()*60,30+Math.random()*60)}});
 C(12,()=>{GR('#0b3c5d','#328cc1');g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=6;for(let k=0;k<6;k++){g.beginPath();for(let x=0;x<=256;x+=8)g.lineTo(x,60+k*32+Math.sin(x/30+k)*12);g.stroke()}});
 C(13,()=>{const q=g.createLinearGradient(0,0,0,256);q.addColorStop(0,'#ff9a5a');q.addColorStop(.6,'#ffd29a');q.addColorStop(.61,'#2d4a6b');q.addColorStop(1,'#14263d');g.fillStyle=q;g.fillRect(0,0,256,256);g.fillStyle='#ffe9b0';g.beginPath();g.arc(128,150,34,0,7);g.fill();g.fillStyle='#1d2b3d';g.fillRect(0,154,256,4)});
 C(14,()=>{GR('#8fd3ff','#e8f6ff');g.fillStyle='#7cb342';g.fillRect(0,190,256,66);g.fillStyle='#f6efe2';g.fillRect(60,110,136,90);g.fillStyle='#a5482f';g.beginPath();g.moveTo(48,112);g.lineTo(128,58);g.lineTo(208,112);g.closePath();g.fill();g.fillStyle='#5b3a29';g.fillRect(116,150,24,50);g.fillStyle='#9fd8ff';g.fillRect(76,128,28,22);g.fillRect(152,128,28,22);g.fillStyle='#c62828';g.fillRect(0,0,256,34);T('FOR SALE',128,18,22,'#fff')});
 C(15,()=>{GR('#0f2b1d','#071810');g.strokeStyle='#6dff8a';g.lineWidth=10;g.beginPath();g.arc(100,110,34,0,7);g.stroke();g.beginPath();g.moveTo(134,110);g.lineTo(200,110);g.lineTo(200,132);g.moveTo(178,110);g.lineTo(178,128);g.stroke();T('PRIME KEY',128,190,30,'#6dff8a');T('REALTY',128,224,22,'#d7ffe0')});
})}
// ---- shared interior materials ----
const cpIF=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.58,metalness:.06,envMapIntensity:.45}),
 cpIG=new THREE.MeshStandardMaterial({color:0xd6ecf5,transparent:true,opacity:.2,roughness:.04,metalness:.25,depthWrite:false,envMapIntensity:1.2}),
 cpAtM=new THREE.MeshStandardMaterial({map:cpAtlasTex(),roughness:.55,envMapIntensity:.3}),cpWinM=new THREE.MeshBasicMaterial({map:cpTexOf('view'),toneMapped:false}),cpStreetM=new THREE.MeshBasicMaterial({map:cpTexOf('street'),toneMapped:false}),
 cpProdMat=new THREE.MeshStandardMaterial({roughness:.5,envMapIntensity:.4}),cpUBox=new THREE.BoxGeometry(1,1,1),cpUBot=new THREE.CylinderGeometry(1,1,1,8),
 cpScrM=new THREE.ShaderMaterial({uniforms:{uT:{value:0}},vertexShader:'varying vec2 vUv;varying vec3 vW;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:'uniform float uT;varying vec2 vUv;varying vec3 vW;void main(){float sd=fract(sin(dot(floor(vW.xz*.7),vec2(12.9,78.2)))*437.5);vec2 p=vUv;vec3 c=mix(vec3(.03,.06,.16),vec3(.08,.3,.62)+.18*sin(vec3(0.,2.,4.)+sd*6.),p.y);c+=.16*sin(vec3(1.,2.,3.)*(p.x*5.+uT*(1.+sd))+p.y*3.);float tk=step(.06,p.y)*step(p.y,.18);c=mix(c,vec3(.8,.1,.12),tk*.85);c+=tk*.25*step(.5,fract(p.x*18.-uT*1.5));float hd=step(.74,p.y)*step(p.y,.86)*step(.08,p.x)*step(p.x,.55+.3*sd);c=mix(c,vec3(.95),hd*.8);float bx=step(.3,p.y)*step(p.y,.66)*step(.6,p.x)*step(p.x,.92);c=mix(c,vec3(.9,.6,.3)*(.6+.4*sin(uT*2.+sd*9.)),bx*.7);gl_FragColor=vec4(c*1.15,1.);}'});
function cpUVs(g,su,sv){const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*su,uv.getY(i)*sv);return g}
const cpPal=()=>[0xe63946,0xf4a261,0x2a9d8f,0xffd60a,0x1d70b8,0x9b5de5,0xffffff,0x3ddc84,0xff6f91,0x8d99ae,0xe76f51,0x264653][Math.random()*12|0];
// ---- room kit: local coords x -9..9, z -7..7 (entrance +z), y = height above floor ----
function cpKit(X,H){const K={X,H,F:[],G:[],E:[],A:[],W:[],SW:[],S:[],PB:[],PC:[],obs:[],t:[0,0,0]};
 const P=(x,z)=>{const a=K.t[2],c=Math.cos(a),s=Math.sin(a);return [X+K.t[0]+x*c+z*s,K.t[1]-x*s+z*c]};
 const put=(arr,geo,x,y,z,rx,ry,rz,col)=>{const q=P(x,z),g=gT(geo,q[0],.3+y,q[1],rx||0,K.t[2]+(ry||0),rz||0);if(col!==undefined)cpCol(g,col);arr.push(g);return g};
 K.b=(w,h,d,x,y,z,c,ry)=>put(K.F,new THREE.BoxGeometry(w,h,d),x,y,z,0,ry,0,c);
 K.e=(w,h,d,x,y,z,c,ry)=>put(K.E,new THREE.BoxGeometry(w,h,d),x,y,z,0,ry,0,c);
 K.gl=(w,h,d,x,y,z,ry)=>put(K.G,new THREE.BoxGeometry(w,h,d),x,y,z,0,ry,0,0xffffff);
 K.bz=(w,h,d,x,y,z,rz,c)=>put(K.F,new THREE.BoxGeometry(w,h,d),x,y,z,0,0,rz,c);
 K.c=(rt,rb,h,n,x,y,z,c,arr)=>put(arr||K.F,new THREE.CylinderGeometry(rt,rb,h,n),x,y,z,0,0,0,c);
 K.cz=(r,h,n,x,y,z,c,arr)=>put(arr||K.F,new THREE.CylinderGeometry(r,r,h,n),x,y,z,Math.PI/2,0,0,c);
 K.sp=(r,x,y,z,c,arr)=>put(arr||K.F,new THREE.IcosahedronGeometry(r,1),x,y,z,0,0,0,c);
 K.grp=(x,z,ry,fn)=>{const o=K.t,a=o[2],c=Math.cos(a),s=Math.sin(a);K.t=[o[0]+x*c+z*s,o[1]-x*s+z*c,a+ry];fn();K.t=o};
 K.at=(cell,w,h,x,y,z,ry,fr)=>K.grp(x,z,ry||0,()=>{const g=new THREE.PlaneGeometry(w,h),uv=g.attributes.uv,cx=cell%4,cy=cell>>2;for(let i=0;i<uv.count;i++)uv.setXY(i,(cx+uv.getX(i))/4,(3-cy+uv.getY(i))/4);put(K.A,g,0,y,.035);if(fr!==0)K.b(w+.12,h+.12,.04,0,y,.01,fr||0x1a1a1a)});
 K.win=(w,h,x,y,z,ry)=>K.grp(x,z,ry||0,()=>{put(K.W,new THREE.PlaneGeometry(w,h),0,y,.03);const fc=0xf4f1ea;K.b(w+.26,.12,.14,0,y+h/2+.06,.06,fc);K.b(w+.34,.08,.26,0,y-h/2-.04,.11,fc);K.b(.12,h,.14,-w/2-.06,y,.06,fc);K.b(.12,h,.14,w/2+.06,y,.06,fc);K.b(.07,h,.08,0,y,.06,fc);K.b(w,.06,.08,0,y+h*.18,.06,fc)});
 K.scr=(w,h,x,y,z,ry)=>K.grp(x,z,ry||0,()=>{K.b(w+.12,h+.12,.07,0,y,0,0x0e0f12);put(K.S,new THREE.PlaneGeometry(w,h),0,y,.04)});
 K.box=(x,y,z,sx,sy,sz,c,ry)=>{const q=P(x,z);K.PB.push({x:q[0],y:.3+y,z:q[1],sx,sy,sz,c,ry:K.t[2]+(ry||0)})};
 K.bot=(x,y,z,r,h,c)=>{const q=P(x,z);K.PC.push({x:q[0],y:.3+y,z:q[1],sx:r,sy:h,sz:r,c,ry:0})};
 K.ob=(w,d,x,z)=>{const a=P(x-w/2,z-d/2),b=P(x+w/2,z+d/2);K.obs.push([Math.min(a[0],b[0]),Math.max(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[1],b[1])])};
 K.fill=(x0,x1,y,z,dep,mh)=>{for(let x=x0;x<x1-.1;){const w=.12+Math.random()*.18,h=.14+Math.random()*(mh-.14);if(Math.random()<.08){x+=w;continue}K.box(x+w/2,y+h/2,z,w*.9,h,dep*(.7+Math.random()*.3),cpPal());x+=w}};
 K.panels=(list,w,d)=>{for(const p of list){K.e(w,.04,d,p[0],H-.035,p[1],0xfff9ee);K.b(w+.1,.03,d+.1,p[0],H-.015,p[1],0xdcdcdc)}};
 K.down=(list,c)=>{for(const p of list){K.c(.16,.16,.03,12,p[0],H-.02,p[1],c||0xfff2d6,K.E);K.c(.22,.22,.02,12,p[0],H-.01,p[1],0xcfcfcf)}};
 K.plant=(x,z,s)=>{s=s||1;K.c(.28*s,.22*s,.55*s,12,x,.27*s,z,0xefefef);K.c(.25*s,.25*s,.04,12,x,.54*s,z,0x3a2a1a);for(let i=0;i<7;i++){const a=i*.9;K.sp((.22+Math.random()*.12)*s,x+Math.cos(a)*.22*s,(.8+Math.random()*.7)*s,z+Math.sin(a)*.22*s,[0x2f7d32,0x3a8f3a,0x276b2c,0x4a9a3f][i%4])}K.ob(.6*s,.6*s,x,z)};
 K.chair=(x,z,ry,c)=>K.grp(x,z,ry,()=>{K.b(.56,.08,.56,0,.48,0,c);K.b(.56,.62,.07,0,.82,.25,c);for(const a of[[-.24,-.24],[.24,-.24],[-.24,.24],[.24,.24]])K.b(.05,.46,.05,a[0],.23,a[1],0x2b2b2b)});
 K.sofa=(x,z,ry,w,c)=>K.grp(x,z,ry,()=>{K.b(w,.42,.95,0,.25,0,c);K.b(w,.75,.25,0,.62,.36,c);K.b(.22,.62,.95,-w/2+.11,.4,0,c);K.b(.22,.62,.95,w/2-.11,.4,0,c);const n=Math.max(1,Math.round(w/1.1));for(let i=0;i<n;i++)K.b(w/n-.12,.14,.72,-w/2+(i+.5)*w/n,.52,-.05,new THREE.Color(c).multiplyScalar(1.15).getHex());K.ob(w,.95,0,0)});
 K.table=(x,z,w,d,h,c,leg)=>{K.b(w,.06,d,x,h,z,c);for(const a of[[-1,-1],[1,-1],[-1,1],[1,1]])K.b(.07,h,.07,x+a[0]*(w/2-.08),h/2,z+a[1]*(d/2-.08),leg||0x2b2b2b);K.ob(w,d,x,z)};
 K.lamp=(x,z)=>{K.c(.18,.22,.05,12,x,.03,z,0x2b2b2b);K.c(.025,.025,1.6,6,x,.83,z,0x2b2b2b);K.c(.22,.32,.36,14,x,1.7,z,0xfff1d6,K.E)};
 K.cam=(x,z,ry)=>K.grp(x,z,ry,()=>{K.b(.1,.3,.1,0,H-.15,0,0x222222);K.b(.26,.2,.44,0,H-.36,.16,0xe8e8e8);K.e(.05,.05,.02,0,H-.36,.39,0xff2020)});
 K.atm=(x,z,ry)=>K.grp(x,z,ry,()=>{K.b(.95,1.75,.7,0,.87,0,0x2c3e50);K.b(.8,.12,.25,0,1.0,.42,0x1b2631);K.e(.5,.36,.02,0,1.32,.36,0x56c8ff);K.e(.86,.16,.03,0,1.68,.36,0x2a6fdb);K.b(.36,.16,.08,0,.98,.5,0x7f8c8d);K.ob(1,.8,0,0)});
 K.cooler=(x,z)=>{K.b(.42,1.0,.42,x,.5,z,0xe6e6e6);K.c(.17,.17,.5,12,x,1.25,z,0xffffff,K.G);K.c(.15,.15,.46,12,x,1.24,z,0x9fd8ff)};
 return K}
function cpGondola(K,L){K.b(L,.22,1.0,0,.11,0,0x5d6670);K.b(L,1.75,.05,0,.97,0,0x9aa3ad);K.b(.07,1.85,1.0,-L/2,.92,0,0x5d6670);K.b(.07,1.85,1.0,L/2,.92,0,0x5d6670);
 for(let t=0;t<3;t++){const y=.3+t*.52;K.b(L,.035,.95,0,y,0,0xdfe3e8);K.b(L,.06,.015,0,y-.03,.48,0xffd60a);K.b(L,.06,.015,0,y-.03,-.48,0xffd60a);K.fill(-L/2+.08,L/2-.08,y+.02,.25,.4,.42);K.fill(-L/2+.08,L/2-.08,y+.02,-.25,.4,.42)}
 K.b(L*.6,.3,.04,0,2.05,0,0x2a9d8f)}
function cpFridge(K,L){K.e(L,2.2,.04,0,1.25,-.4,0xe8f6ff);K.b(L,.3,.9,0,2.5,0,0xd5d9de);K.b(L,.25,.9,0,.12,0,0xd5d9de);K.e(L-.1,.12,.02,0,2.52,.46,0x56c8ff);
 for(let x=-L/2;x<=L/2+.01;x+=L/Math.round(L/1.25))K.b(.07,2.25,.9,x,1.25,0,0xb9bec4);
 for(const y of[.5,1.0,1.5,1.98]){K.b(L,.03,.78,0,y,-.02,0xf0f0f0);for(let x=-L/2+.12;x<L/2-.1;x+=.15+Math.random()*.05){if(Math.random()<.1)continue;const h=.22+Math.random()*.12;K.bot(x,y+h/2+.02,-.05+Math.random()*.25,.055,h,[0x8b1c2c,0x2a9d8f,0xf4a261,0x56c8ff,0xe9f5f9,0x3ddc84,0x1d1d1d][Math.random()*7|0])}}
 K.gl(L,2.18,.03,0,1.27,.44);for(let x=-L/2+.6;x<L/2;x+=L/Math.round(L/1.25))K.b(.04,.9,.05,x,1.3,.48,0xbfc5cc);K.ob(L,.95,0,0)}

// ---- room shell + templates ----
function cpShell(K,R,o){const X=K.X,H=K.H,g=R.grp;
 const fl=cpUVs(new THREE.PlaneGeometry(18,14),18/o.fs,14/o.fs);fl.rotateX(-Math.PI/2);fl.translate(X,.3,0);
 g.add(new THREE.Mesh(fl,new THREE.MeshStandardMaterial({map:cpTexOf(o.f),color:o.fc===undefined?0xffffff:o.fc,roughness:cpRough[o.f]||.6,metalness:0,envMapIntensity:o.f==='marble'?.9:.4})));
 const ws=o.ws||3,wg=[],wall=(w,cx,cz,ry)=>{wg.push(gT(cpUVs(new THREE.PlaneGeometry(w,H),w/ws,H/ws),X+cx,.3+H/2,cz,0,ry,0))};
 wall(18,0,-7,0);wall(18,0,7,Math.PI);wall(14,-9,0,Math.PI/2);wall(14,9,0,-Math.PI/2);
 g.add(new THREE.Mesh(cpMG(wg),new THREE.MeshStandardMaterial({map:cpTexOf(o.w),color:o.wc,roughness:.9,envMapIntensity:.25})));
 const cs=o.cs||2.4,cg=cpUVs(new THREE.PlaneGeometry(18,14),18/cs,14/cs);cg.rotateX(Math.PI/2);cg.translate(X,.3+H,0);
 g.add(new THREE.Mesh(cg,new THREE.MeshStandardMaterial({map:cpTexOf(o.c),color:o.cc===undefined?0xffffff:o.cc,roughness:.95,envMapIntensity:.15})));
 const bc=o.base===undefined?0xf4f1ea:o.base;
 K.b(18,.22,.05,0,.11,-6.97,bc);K.b(14,.22,.05,-8.97,.11,0,bc,Math.PI/2);K.b(14,.22,.05,8.97,.11,0,bc,Math.PI/2);K.b(8,.22,.05,-5,.11,6.97,bc);K.b(8,.22,.05,5,.11,6.97,bc);
 K.b(18,.12,.1,0,H-.06,-6.95,bc);K.b(18,.12,.1,0,H-.06,6.95,bc);K.b(14,.12,.1,-8.95,H-.06,0,bc,Math.PI/2);K.b(14,.12,.1,8.95,H-.06,0,bc,Math.PI/2);
 if(o.stripe!==undefined){K.b(17.9,.14,.03,0,1.1,-6.98,o.stripe);K.b(13.9,.14,.03,-8.98,1.1,0,o.stripe,Math.PI/2);K.b(13.9,.14,.03,8.98,1.1,0,o.stripe,Math.PI/2);K.b(7.9,.14,.03,-5,1.1,6.98,o.stripe);K.b(7.9,.14,.03,5,1.1,6.98,o.stripe)}
 K.b(.2,2.95,.26,-.96,1.47,6.88,0x2b2f36);K.b(.2,2.95,.26,.96,1.47,6.88,0x2b2f36);K.b(2.12,.2,.26,0,2.95,6.88,0x2b2f36);
 K.SW.push(gT(new THREE.PlaneGeometry(1.72,2.8),X,.3+1.4,6.985,0,Math.PI,0));
 // the storefront seen from inside: same display windows, mullions and bulkheads as the facade outside, looking out at the street
 if(o.front!==false)for(const sx of[-1,1]){K.SW.push(gT(new THREE.PlaneGeometry(2.2,2.44),X+sx*2.1,.3+1.69,6.975,0,Math.PI,0));K.gl(2.2,2.44,.02,sx*2.1,1.69,6.9);
  for(const mx of[1.0,3.2])K.b(.1,2.95,.14,sx*mx,1.47,6.92,0x2b2f36);K.b(2.2,.45,.16,sx*2.1,.22,6.92,0xcfc8ba);K.b(2.3,.06,.3,sx*2.1,.47,6.82,0x9a9a9a);K.b(2.2,.08,.12,sx*2.1,2.92,6.93,0x2b2f36)}
 K.e(.72,.24,.06,0,3.3,6.9,0x3dff7a);K.b(1.7,.02,1.1,0,.01,6.05,0x2a2a2a);
 R.door=cpAddDoor(X-.8,6.9,0)}
function cpPerson(R,lx,lz,ry,sh,pa,rt){const g=makePerson(sh,pa,[0xf1c27d,0xc68642,0x8d5524,0xe0ac69][Math.random()*4|0]);g.userData.rlType=rt;g.userData.cpR=R;g.position.set(R.x+lx,.3,lz);g.rotation.y=ry;scene.add(g);g.visible=R.grp.visible;R.ppl.push(g);return g}
function cpWalker(R,pts,sh,pa,rt){const g=cpPerson(R,pts[0][0],pts[0][1],0,sh,pa,rt);R.walk.push({g,pts,i:1,w:0,pause:Math.random()*2});return g}
const cpT={
 store(K,R){cpShell(K,R,{f:'tile',fs:2.4,w:'plaster',wc:0xe6dcc4,c:'acoustic',stripe:0x2a9d8f});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.6);
  K.b(7,1.0,.9,0,.5,-3.6,0x5b3b24);K.b(7.3,.06,1.05,0,1.03,-3.6,0x232323);K.b(7,.12,.02,0,.75,-3.14,0x3ddc84);
  K.b(.5,.22,.38,-1.6,1.17,-3.75,0x1a1a1a);K.b(.06,.3,.06,-1.6,1.3,-3.82,0x1a1a1a);K.e(.42,.28,.03,-1.6,1.52,-3.8,0x6fe0ff);K.b(.22,.1,.3,-.6,1.11,-3.42,0x333333);
  K.b(1.6,.8,.35,2.3,.4,-2.95,0x9aa3ad);K.fill(1.55,3.05,.82,-2.95,.25,.26);K.b(.9,.5,.3,2.6,1.33,-3.8,0x0f5132);K.e(.8,.36,.03,2.6,1.35,-3.64,0x3ddc84);
  K.grp(0,-6.55,0,()=>{K.b(8,2.6,.08,0,1.5,-.32,0x6b7682);K.b(.08,2.6,.5,-4,1.5,-.05,0x6b7682);K.b(.08,2.6,.5,4,1.5,-.05,0x6b7682);for(let t=0;t<5;t++){K.b(7.8,.04,.45,0,.55+t*.48,-.05,0xdfe3e8);K.fill(-3.8,3.8,.57+t*.48,-.05,.3,.36)}});
  K.at(2,1.5,1.9,-6.3,2.8,-6.93,0);K.at(3,1.5,1.9,6.3,2.8,-6.93,0);
  for(const gx of[-3.4,3.4])K.grp(gx,2.1,Math.PI/2,()=>cpGondola(K,5.2));
  K.grp(-8.45,2.3,Math.PI/2,()=>cpFridge(K,7.4));K.at(0,1.3,1.4,-8.95,3.55,0,Math.PI/2);K.at(1,1.3,1.4,-8.95,3.55,4.4,Math.PI/2);
  K.win(3.6,1.9,8.97,2.3,2.6,-Math.PI/2);K.at(3,1.2,1.2,8.95,2.2,-1.1,-Math.PI/2);
  K.grp(8.3,-1.4,-Math.PI/2,()=>{K.b(2.6,.95,.9,0,.47,0,0x4a3426);K.b(2.7,.05,1,0,.97,0,0x1d1d1d);for(const x of[-.8,.1,.9]){K.b(.45,.6,.4,x,1.3,-.1,0x2b2b2b);K.e(.2,.1,.02,x,1.45,.11,0xff9a3c)}K.ob(2.7,1,0,0)});
  K.atm(8.35,5.3,-Math.PI/2);K.b(1.6,1.0,.8,-7.2,.5,6.1,0xf4f8fb);K.e(1.0,.26,.02,-7.2,.68,5.69,0x5fd0ff);K.ob(1.6,.8,-7.2,6.1);
  K.cam(-8.5,-6.5,Math.PI/4);K.cam(8.5,6.4,-Math.PI*.75);K.plant(7.6,3.8,.9);
  for(const gx of[-3.4,3.4]){K.b(1.0,1.05,.55,gx,.52,5.15,gx<0?0xe0262b:0x6a2bd1);K.fill(gx-.45,gx+.45,1.06,5.15,.4,.3);K.at(gx<0?0:1,.9,.75,gx,.55,5.43,0,0);K.ob(1,.6,gx,5.15)}
  K.grp(-2.1,6.35,Math.PI,()=>{K.b(2,.75,.42,0,.37,0,0x6b7682);for(let i=0;i<6;i++)K.box(-.8+i*.32,.82,.05-.04*(i%2),.28,.14,.34,[0xf2f2f2,0xe63946,0x1d70b8,0xffd60a][i%4],.25);K.ob(2,.5,0,0)});
  K.grp(2.1,6.2,Math.PI,()=>{K.b(1.9,.82,.75,0,.41,0,0xf4f8fb);K.gl(1.8,.05,.66,0,.85,0);for(let i=0;i<8;i++)K.box(-.7+(i%4)*.46,.72,-.17+(i>>2)*.34,.38,.12,.28,[0xffd1dc,0xfff1c4,0x8b5a2b,0xb5e8ff][i%4]);K.e(1.6,.14,.02,0,.62,.38,0x56c8ff);K.ob(1.9,.8,0,0)});
  K.b(.5,.36,.3,1.4,1.24,-3.4,0x0f8a4a);K.at(2,.44,.44,1.4,1.33,-3.24,0,0);K.b(.9,.05,.4,-3.0,1.08,-3.45,0x9aa3ad);for(let i=0;i<4;i++)K.c(.07,.07,.12,8,-3.3+i*.2,1.17,-3.45,0xc9a227);
  K.grp(8.5,1.8,-Math.PI/2,()=>{K.b(2.2,.95,.7,0,.47,0,0x4a3426);K.b(2.3,.05,.75,0,.97,0,0x1d1d1d);K.b(.45,.55,.4,-.7,1.25,-.1,0x2b2b2b);K.c(.07,.07,.12,8,-.7,1.05,.1,0xffffff);K.b(.38,.6,.32,.2,1.27,-.1,0xc0c0c0);for(let i=0;i<5;i++)K.c(.05,.045,.13,8,.75,1.06+i*.13,0,0xffffff);K.ob(2.3,.8,0,0)});
  R.clerk=cpPerson(R,0,-5,Math.PI,0xd62828,0x222222,'m2');cpWalker(R,[[-5.4,.2],[-5.4,4.4],[0,5],[0,-.4],[5.4,4.3],[5.4,.1]],0x2a6fdb,0x333333,'f2')},
 jewel(K,R){cpShell(K,R,{f:'carpet',fc:0x6a3358,fs:3,w:'wallpaper',wc:0x4a3c60,c:'plaster',cc:0x3a3046,base:0xc9a24a,stripe:0xc9a24a});
  const dl=[];for(const x of[-6,-2,2,6])for(const z of[-5,-1,3])dl.push([x,z]);K.down(dl,0xfff0c8);
  K.c(.03,.03,.9,6,0,K.H-.45,1.5,0xc9a24a);K.c(.9,.55,.14,18,0,K.H-.95,1.5,0xc9a24a);for(let k=0;k<10;k++){const a=k*.628;K.sp(.08,Math.cos(a)*.8,K.H-1.0,1.5+Math.sin(a)*.8,0xfff4cc,K.E)}
  for(const p of[[-5,.2],[0,1.4],[5,.2],[-5,4],[5,4]]){K.b(2.2,.95,1.2,p[0],.47,p[1],0x1b1630);K.b(2.3,.05,1.3,p[0],.97,p[1],0xc9a24a);K.b(2.0,.03,1.0,p[0],1.0,p[1],0x4b1d5c);K.gl(2.2,.5,1.2,p[0],1.25,p[1]);
   for(let i=0;i<6;i++){const x=p[0]-.75+i*.3,z=p[1]+(i%2?.2:-.2);K.c(.07,.07,.02,10,x,1.03,z,0xc9a24a);K.sp(.05,x,1.07,z,[0xff7ad9,0x9ff3ff,0xffffff,0xffe066][i%4],K.E)}K.ob(2.3,1.3,p[0],p[1])}
  K.b(8,1.0,.9,0,.5,-3.6,0x1b1630);K.b(8.1,.05,.95,0,1.0,-3.6,0xc9a24a);K.gl(8,.42,.9,0,1.23,-3.6);for(let i=0;i<10;i++)K.sp(.05,-3.5+i*.75,1.07,-3.6,[0xff7ad9,0x9ff3ff,0xffe066][i%3],K.E);
  for(const x of[-6,-3,3,6]){K.b(2,3,.06,x,1.9,-6.95,0x6f7884);K.b(2.1,.08,.1,x,3.44,-6.93,0xc9a24a)}K.at(4,2.6,2.6,0,2.7,-6.93,0,0xc9a24a);
  for(const z of[-3,1.5])K.grp(-8.5,z,Math.PI/2,()=>{K.b(1.6,1.1,.6,0,.55,0,0x1b1630);K.c(.12,.18,.5,10,-.4,1.35,0,0x101010);K.c(.12,.18,.5,10,.4,1.35,0,0x101010);K.e(.3,.04,.06,-.4,1.4,.1,0xffe066);K.e(.3,.04,.06,.4,1.4,.1,0xffffff);K.ob(1.6,.6,0,0)});
  K.at(4,1.4,1.4,8.95,2.6,-2.5,-Math.PI/2,0xc9a24a);K.win(3,2,8.97,2.3,2.5,-Math.PI/2);
  for(const x of[-2.4,2.4]){K.c(.06,.09,1.0,8,x,.5,5.2,0xc9a24a);K.sp(.09,x,1.04,5.2,0xc9a24a)}K.b(4.8,.06,.06,0,.85,5.2,0x8b1c2c);
  K.plant(-8,6,1);K.plant(8,6,1);K.chair(7.8,-1,-Math.PI/2,0x6a3358);K.cam(-8.5,-6.5,Math.PI/4);
  R.clerk=cpPerson(R,0,-5,Math.PI,0x111111,0x222222,'f1');cpWalker(R,[[-3,2.6],[3,2.6],[3,5.6],[-3,5.6]],0xf5f5f5,0x2b2b2b,'f3')},
 bank(K,R){cpShell(K,R,{f:'marble',fs:4,w:'plaster',wc:0xe6dcc6,c:'plaster',cc:0xf6f1e6,base:0x6b5a44,ws:4});
  for(const p of[[-6,.2],[6,.2],[-6,4.4],[6,4.4]]){K.c(.42,.42,K.H-.6,18,p[0],K.H/2,p[1],0xece6da);K.b(1.1,.3,1.1,p[0],.15,p[1],0xc8bfae);K.b(1.1,.3,1.1,p[0],K.H-.15,p[1],0xc8bfae);K.ob(1.1,1.1,p[0],p[1])}
  K.b(15,1.15,.9,0,.57,-3.2,0x4a3826);K.b(15.2,.06,1.05,0,1.17,-3.2,0xd9cfba);K.gl(15,1.4,.04,0,1.9,-3.02);for(let x=-7.5;x<=7.51;x+=2.5)K.b(.07,1.5,.08,x,1.95,-3.02,0xc9a227);K.b(15,.08,.1,0,2.64,-3.02,0xc9a227);
  for(const x of[-5,-2.5,0,2.5,5]){K.b(.8,.05,.3,x,1.22,-2.95,0x2b2b2b);K.e(.3,.18,.03,x,2.82,-3.0,0xffe9a8);K.b(.5,.35,.05,x,1.45,-3.55,0x111111)}
  K.b(5.4,5.2,.3,0,2.6,-6.84,0x6d6f73);K.cz(2.1,.6,32,0,2.55,-6.5,0x9a9fa6);K.cz(1.72,.66,32,0,2.55,-6.48,0x80858b);K.cz(.36,.85,16,0,2.55,-6.3,0xc9a227);
  for(let k=0;k<3;k++)K.bz(3.0,.14,.14,0,2.55,-6.12,k*Math.PI/3,0xc9a227);for(let k=0;k<12;k++){const a=k*Math.PI/6;K.cz(.11,.2,8,Math.cos(a)*1.92,2.55+Math.sin(a)*1.92,-6.2,0xd0d4d8)}
  K.at(5,2.2,2.2,-8.95,3.6,-1.2,Math.PI/2,0xc9a227);K.at(5,2.2,2.2,8.95,3.6,-1.2,-Math.PI/2,0xc9a227);
  for(let i=0;i<5;i++){const x=-2+i;K.c(.06,.09,1.0,8,x,.5,2.2,0xc9a227);K.sp(.08,x,1.04,2.2,0xc9a227)}K.b(4,.06,.06,0,.86,2.2,0x8b1c2c);for(let i=0;i<4;i++){K.c(.06,.09,1.0,8,2,.5,2.2+i*.9,0xc9a227)}K.b(.06,.06,2.7,2,.86,3.55,0x8b1c2c);
  K.atm(8.35,2,-Math.PI/2);K.atm(8.35,3.4,-Math.PI/2);K.grp(-8.5,3,Math.PI/2,()=>{K.b(3,.45,.6,0,.45,0,0x4a3826);K.b(3,.6,.12,0,.85,-.26,0x4a3826);K.ob(3,.6,0,0)});
  K.b(2.4,1.05,.8,-2.6,.52,5,0x4a3826);K.b(2.5,.06,.9,-2.6,1.08,5,0xe8e1d3);K.ob(2.5,.9,-2.6,5);
  for(const x of[-3,3]){K.c(.04,.04,1.3,6,x,K.H-.65,1.5,0xc9a227);K.c(1.0,.7,.25,18,x,K.H-1.4,1.5,0xc9a227);for(let k=0;k<8;k++){const a=k*.785;K.sp(.09,x+Math.cos(a)*.9,K.H-1.25,1.5+Math.sin(a)*.9,0xfff4cc,K.E)}}
  K.cz(.55,.06,24,-5.6,4.6,-6.93,0xf5f0e6);K.bz(.04,.4,.03,-5.6,4.75,-6.88,0,0x111111);K.bz(.3,.04,.03,-5.47,4.6,-6.88,0,0x111111);
  K.plant(-8,6,1.1);K.plant(8,6,1.1);K.plant(-8,-2.2,1);K.plant(8,-2.2,1);K.cam(-8.5,-6.5,Math.PI/4);K.cam(8.5,6.5,-Math.PI*.75);
  R.clerk=cpPerson(R,0,-5,Math.PI,0x1f2a44,0x222222,'m3');R.npc.push(cpPerson(R,-5,-5,Math.PI,0x2b3a55,0x222222,'f2'),cpPerson(R,5,-5,Math.PI,0x2b3a55,0x222222,'f4'),cpPerson(R,-1,2.6,Math.PI,0x7a6a55,0x333333,'m1'),cpPerson(R,-1,3.7,Math.PI,0x355c7d,0x222222,'f1'));
  cpWalker(R,[[4.5,5.2],[-4.5,5.6],[-4.5,1.2],[4.6,1.2]],0x6c584c,0x2b2b2b,'m4')},
 police(K,R){cpShell(K,R,{f:'vinyl',fc:0xc9d0da,fs:3.2,w:'plaster',wc:0xd4dbe5,c:'acoustic',stripe:0x1d3557,base:0x2b3a55});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.6);
  K.b(7,1.25,1.2,0,.62,-3.4,0x2b3a55);K.b(7.2,.06,1.3,0,1.27,-3.4,0xc7ccd3);K.b(7,.22,.02,0,.95,-2.79,0xd9b44a);K.b(.6,.4,.05,-1.8,1.6,-3.8,0x111111);K.b(.6,.4,.05,1.8,1.6,-3.8,0x111111);
  K.grp(-8.94,-.5,Math.PI/2,()=>{K.b(3.6,2.1,.05,0,2.2,0,0xa57a4a)});K.at(6,.9,1.1,-8.9,2.5,-1.6,Math.PI/2,0);K.at(6,.9,1.1,-8.9,2.5,-.4,Math.PI/2,0);K.at(7,.9,1.1,-8.9,2.3,.7,Math.PI/2,0);
  for(const z of[2,4.4])K.grp(-8.4,z,Math.PI/2,()=>{K.b(2.4,.45,.55,0,.42,0,0x4b5563);K.b(2.4,.6,.1,0,.85,-.24,0x4b5563);K.ob(2.4,.6,0,0)});
  for(let k=0;k<8;k++)K.c(.05,.05,3.2,6,4.8+k*.52,1.6,-4.6,0x7d838c);for(let k=0;k<4;k++)K.c(.05,.05,3.2,6,4.6,1.6,-6.6+k*.6,0x7d838c);K.b(4.2,.1,.1,6.7,3.2,-4.6,0x7d838c);K.b(.1,.1,2.4,4.6,3.2,-5.8,0x7d838c);K.b(2.6,.4,.6,7.5,.35,-6.5,0x6b7280);
  K.cooler(8.3,1.2);for(let i=0;i<3;i++)K.b(.7,1.3,.6,-6.5+i*.75,.65,-6.6,0x6b7280);K.scr(2.4,1.35,8.95,2.6,3.4,-Math.PI/2);K.at(7,1.5,1.5,0,3.3,-6.93,0,0xd9b44a);
  K.plant(8,6,1);K.plant(-8,6,1);K.cam(-8.5,-6.5,Math.PI/4);
  R.npc.push(cpPerson(R,0,-5,Math.PI,0x1d3557,0x0b132b,'cop'),cpPerson(R,-5,-5.2,Math.PI/2,0x1d3557,0x0b132b,'cop'),cpPerson(R,-7.4,3.2,Math.PI/2,0x8d6e63,0x333333,'m5'))},
 hosp(K,R){cpShell(K,R,{f:'vinyl',fc:0xd5e0e3,fs:3.2,w:'plaster',wc:0xe4ecee,c:'acoustic',stripe:0x3aa6a0});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.6);
  K.b(6,1.1,1.0,0,.55,-3.4,0xffffff);K.b(6.2,.06,1.1,0,1.12,-3.4,0x3aa6a0);K.b(1.0,1.1,2.2,-3.4,.55,-4.4,0xffffff);K.b(1.1,.06,2.3,-3.4,1.12,-4.4,0x3aa6a0);K.b(.5,.35,.05,1.2,1.45,-3.7,0x111111);
  K.e(1.6,.5,.05,0,4.2,-6.92,0xff3050);K.e(.5,1.6,.05,0,4.2,-6.9,0xff3050);K.e(3,.32,.04,0,3.2,-6.92,0xff6f7f);
  for(const z of[1.3,3.2])for(let i=0;i<5;i++)K.chair(-7.6+i*.7,z,Math.PI,0x3aa6a0);K.ob(3.6,.6,-6.2,1.3);K.ob(3.6,.6,-6.2,3.2);
  for(const z of[-1,2.6]){K.b(2.2,.6,1.2,7.6,.45,z,0xdfe8ea);K.b(2.1,.18,1.1,7.6,.82,z,0xffffff);K.b(.5,.12,.8,8.4,.96,z,0xf0f4f7);K.b(.06,.06,3.2,6.4,K.H-.3,z,0xaab4b8);K.b(.04,2.6,1.5,6.4,2.4,z-.7,0xbde3e6);K.ob(2.2,1.2,7.6,z)}
  K.grp(8.4,5.4,-Math.PI/2,()=>{K.b(1.1,2.2,.9,0,1.1,0,0x1a1a1a);K.e(.8,1.5,.02,-.05,1.25,.46,0xbfe8ff);for(let i=0;i<4;i++)for(let j=0;j<3;j++)K.box(-.3+j*.25,.65+i*.36,.38,.16,.22,.1,cpPal());K.ob(1.1,.9,0,0)});
  K.scr(2.2,1.25,-8.95,2.7,-1.6,Math.PI/2);K.at(8,1.3,1.3,8.95,2.4,-4.6,-Math.PI/2,0);K.at(8,1.3,1.3,-8.95,2.4,5,Math.PI/2,0);K.win(2.6,1.8,8.97,2.3,.8,-Math.PI/2);
  K.plant(-8,6,1);K.plant(5.6,6.1,.9);K.cooler(-4.6,5.8);K.cam(8.5,-6.5,-Math.PI/4);
  R.npc.push(cpPerson(R,0,-5,Math.PI,0xffffff,0x9ad1d4,'f3'),cpPerson(R,-6.2,3.2,Math.PI,0x6d597a,0x333333,'m1'));cpWalker(R,[[4.5,-1],[4.5,4.2],[-1,4.2],[-1,-1]],0xf4f4f4,0x7fb7be,'m3')},
 club(K,R){cpShell(K,R,{f:'dark',fs:2,w:'brick',wc:0x4a3860,ws:2.6,c:'plaster',cc:0x0c0c12,base:0x111111});
  K.b(3.6,1.1,1.2,2.5,.55,-5.6,0x121212);K.e(3.4,.08,.04,2.5,.9,-4.98,0xff2bd6);K.e(3.4,.08,.04,2.5,.3,-4.98,0x2bd6ff);for(const x of[1.6,3.4]){K.c(.32,.32,.05,18,x,1.13,-5.6,0x2b2b2b);K.c(.05,.05,.06,8,x,1.17,-5.6,0xd0d0d0)}K.b(.6,.06,.4,2.5,1.14,-5.6,0x333333);K.e(.5,.3,.03,2.5,1.5,-6.05,0x7a2bff);
  for(const x of[-.4,5.4]){K.b(1.2,2.6,1.1,x,1.3,-5.9,0x0a0a0a);for(const y of[.7,1.6,2.3])K.cz(.32,.05,14,x,y,-5.33,0x2a2a2a)}K.ob(4.4,1.4,2.5,-5.6);K.ob(1.2,1.1,-.4,-5.9);K.ob(1.2,1.1,5.4,-5.9);
  K.grp(-6.9,-1.5,Math.PI/2,()=>{K.b(7,1.15,1.0,0,.57,0,0x2a1a3a);K.b(7.2,.06,1.15,0,1.17,0,0x111111);K.e(7,.05,.04,0,1.08,.56,0x2bd6ff);K.ob(7.2,1.1,0,0)});
  K.grp(-8.7,-1.5,Math.PI/2,()=>{K.e(7,2.2,.04,0,2.1,-.22,0xffa94d);for(const y of[1.3,2.0,2.7]){K.b(7,.04,.38,0,y,0,0x222222);for(let x=-3.3;x<3.3;x+=.2+Math.random()*.06)K.bot(x,y+.16,0,.05,.28,[0x6b8f3a,0x8b1c2c,0xc9a227,0x2a9d8f,0xe9f5f9][Math.random()*5|0])}});
  for(let i=0;i<6;i++){const z=-4.6+i*1.2;K.c(.05,.05,.8,6,-5.9,.4,z,0x888888);K.c(.22,.22,.08,12,-5.9,.84,z,0xb0306a)}
  for(const z of[-3,2])K.grp(7.6,z,-Math.PI/2,()=>{K.sofa(0,0,0,3,0x5b1a4a);K.table(0,-1.1,1.2,.7,.7,0x111111)});
  K.at(10,1.8,1.8,8.95,3,-.5,-Math.PI/2,0xff3df2);K.at(10,1.6,1.6,-8.95,3.6,4.6,Math.PI/2,0x2bd6ff);
  for(let k=0;k<5;k++)K.e(.08,1.6+k*.3,.04,8.94,2.4,4.2+k*.35,[0xff2bd6,0x2bd6ff,0xffd62b,0x7a2bff,0x3dff7a][k],Math.PI/2);K.e(.06,.06,7,1,K.H-.4,0,0xff2bd6);K.e(.06,.06,7,4,K.H-.4,0,0x2bd6ff);
  R.dance=new THREE.InstancedMesh(new THREE.BoxGeometry(1.9,.06,1.9),new THREE.MeshBasicMaterial({toneMapped:false}),16);R.dance.frustumCulled=false;{const M=new THREE.Matrix4(),C=new THREE.Color();let n=0;for(let i=0;i<4;i++)for(let j=0;j<4;j++){M.makeTranslation(K.X-.5+i*2,.33,-3.3+j*2);R.dance.setMatrixAt(n,M);R.dance.setColorAt(n,C.setHex(0xff2bd6));n++}}R.grp.add(R.dance);
  R.ball=new THREE.Mesh(new THREE.IcosahedronGeometry(.55,2),new THREE.MeshStandardMaterial({color:0xffffff,metalness:1,roughness:.15,flatShading:true}));R.ball.position.set(K.X+2.5,.3+K.H-1.3,-.3);R.grp.add(R.ball);K.c(.01,.01,1.0,4,2.5,K.H-.5,-.3,0x888888);
  R.npc.push(cpPerson(R,2.5,-6.4,Math.PI,0x111111,0x111111,'m4'),cpPerson(R,-8,-1.5,Math.PI/2,0x222222,0x111111,'m5'));const ty=['f1','m2','f2','m3','f4','m1','f3'];
  R.dancers=[];for(let k=0;k<7;k++)R.dancers.push(cpPerson(R,0+(k%4)*1.9,-2.6+Math.floor(k/4)*2.4,Math.random()*6,new THREE.Color().setHSL(k/7,.7,.5).getHex(),0x1a1a1a,ty[k]))},
 safe(K,R){cpShell(K,R,{f:'wood',fs:3.5,w:'plaster',wc:0xece4d6,c:'plaster',cc:0xfbfaf7});K.down([[-5,-4],[-2,-4],[3,-2],[3,2],[6.8,4.2],[-5,2]]);
  K.grp(-5,-6.55,0,()=>{K.b(7,.95,.9,0,.47,0,0xf2f2f2);K.b(7.1,.06,.95,0,.97,.02,0x2d2d2d);for(let x=-3;x<=3.01;x+=1)K.b(.02,.8,.02,x,.47,.46,0x9a9a9a);K.b(7,.9,.45,0,2.7,-.22,0xf2f2f2);K.b(7,.6,.03,0,1.35,-.43,0xbfdbe6);K.b(.8,.02,.6,1.2,1.0,.05,0x111111);for(const a of[[-.2,-.15],[.2,-.15],[-.2,.15],[.2,.15]])K.c(.1,.1,.01,12,1.2+a[0],1.02,.05+a[1],0x442222,K.E);K.b(.9,.08,.5,-1.5,.96,.05,0xb0b6bb);K.b(.9,.4,.5,1.2,2.1,-.1,0xd0d0d0);K.b(1.0,2.3,.9,4.05,1.15,0,0xc9ccd1);K.ob(9,.95,.5,0)});
  K.table(-5,-2.6,1.8,1.0,.78,0x6b4a2f);K.chair(-5.6,-1.8,0,0x4a3426);K.chair(-4.4,-1.8,0,0x4a3426);K.chair(-5.6,-3.4,Math.PI,0x4a3426);K.chair(-4.4,-3.4,Math.PI,0x4a3426);
  K.b(4.5,.02,3.2,3,.01,-2.5,0x8b1c2c);K.sofa(3,-.5,0,3.2,0x46566b);K.table(3,-2.6,1.4,.7,.42,0x5b3a29);K.b(3.2,.5,.5,3,.25,-6.65,0x3a2a1a);K.scr(2.6,1.45,3,1.9,-6.9,0);K.lamp(5.6,-.6);K.sofa(6.4,-3.2,-Math.PI/2,1.2,0x7a6a55);
  K.grp(7.75,4.2,-Math.PI/2,()=>{K.b(1.8,.45,2.3,0,.25,0,0x3a2a1a);K.b(1.7,.25,2.1,0,.58,.05,0xf2f2f2);K.b(1.7,.12,1.4,0,.74,.4,0x35506b);K.b(.6,.14,.4,-.45,.78,-.8,0xffffff);K.b(.6,.14,.4,.45,.78,-.8,0xffffff);K.b(1.9,1.1,.1,0,.8,-1.15,0x3a2a1a);for(const s of[-1,1]){K.b(.5,.55,.45,s*1.25,.28,-.85,0x4a3426);K.c(.12,.16,.28,10,s*1.25,.75,-.85,0xfff1d6,K.E)}K.ob(1.9,2.4,0,0)});
  K.grp(-8.45,4.6,Math.PI/2,()=>{K.b(2,2.4,.7,0,1.2,0,0x5b3a29);K.b(.02,2.2,.02,0,1.2,.36,0x2b1a10);K.ob(2,.7,0,0)});
  K.grp(-8.6,.6,Math.PI/2,()=>{K.b(2.2,2.2,.4,0,1.1,0,0x6b4a2f);for(const y of[.5,1.1,1.7]){K.b(2.1,.04,.36,0,y,0,0x4a3426);K.fill(-1,1,y+.02,.02,.25,.34)}K.ob(2.2,.4,0,0)});
  K.win(2.4,1.8,-8.97,2.3,-3.4,Math.PI/2);K.win(2.4,1.8,8.97,2.3,.6,-Math.PI/2);for(const z of[-4.9,-1.9])K.b(.08,2.6,.5,-8.85,2.1,z,0x8b1c2c);
  K.at(11,1.4,1.4,-2.2,2.6,-6.93,0,0x2b2b2b);K.at(13,1.6,1.1,8.95,2.6,-3.6,-Math.PI/2,0x2b2b2b);K.at(12,1.2,1.2,-8.95,2.6,3.0,Math.PI/2,0x2b2b2b);K.plant(1.2,-.2,.9);K.plant(-8,6.2,1)},
 stlux(K,R){cpShell(K,R,{front:false,f:'marble',fs:4,w:'plaster',wc:0xf2ede4,c:'plaster',cc:0xffffff,ws:4});K.down([[-6,-4],[-2,-4],[2,-4],[6,-4],[-4,0],[4,0],[-4,4],[4,4]]);
  for(let z=-6;z<=6;z+=2)K.win(1.9,3.6,8.97,2.3,z,-Math.PI/2);
  K.b(4.5,.02,3.6,3.2,.01,.6,0xd8d2c6);K.sofa(3.6,2.2,0,3.4,0xe8e6e1);K.sofa(5.6,.4,-Math.PI/2,2.2,0xe8e6e1);K.b(1.6,.04,.9,3.2,.42,.4,0xffffff);K.gl(1.6,.38,.9,3.2,.22,.4);K.ob(1.6,.9,3.2,.4);
  K.grp(-8.65,.5,Math.PI/2,()=>{K.b(3.6,1.1,.6,0,.55,0,0xbdb7ad);K.e(1.8,.45,.05,0,.55,.31,0xff8a3c);K.b(1.8,.05,.3,0,.33,.2,0x222222);K.b(4.2,.12,.4,0,1.16,.05,0x8a8478);K.ob(3.6,.6,0,0)});K.scr(3.6,2.0,-8.94,2.6,.5,Math.PI/2);
  K.b(4,1.0,1.2,-1,.5,-4.4,0xffffff);K.b(4.2,.08,1.4,-1,1.04,-4.4,0x2b2b2b);for(let i=0;i<3;i++){K.c(.04,.04,.75,6,-2.2+i*1.2,.4,-3.4,0x888888);K.c(.2,.2,.08,12,-2.2+i*1.2,.8,-3.4,0x2b2b2b);K.c(.012,.012,1.8,4,-2.2+i*1.2,K.H-.9,-4.4,0x111111);K.c(.18,.24,.3,12,-2.2+i*1.2,K.H-1.9,-4.4,0xfff1d6,K.E)}K.ob(4.2,1.4,-1,-4.4);
  K.grp(-1,-6.55,0,()=>{K.b(10,.95,.9,0,.47,0,0xffffff);K.b(10.1,.06,.95,0,.97,.02,0x2b2b2b);K.b(10,1.0,.45,0,2.9,-.22,0xffffff);K.b(1.1,2.5,.9,5.6,1.25,0,0xc9ccd1)});
  K.table(-4.6,1.4,2.6,1.1,.78,0x5b3a29);for(const a of[[-5.4,.6,0],[-4.6,.6,0],[-3.8,.6,0],[-5.4,2.2,Math.PI],[-4.6,2.2,Math.PI],[-3.8,2.2,Math.PI]])K.chair(a[0],a[1],a[2],0xe8e6e1);
  K.at(13,2.4,1.6,2.6,2.8,-6.93,0,0x2b2b2b);K.at(11,1.6,1.6,-7.2,2.8,6.93,Math.PI,0x2b2b2b);K.at(12,1.6,1.6,-3.6,2.8,6.93,Math.PI,0x2b2b2b);K.plant(7.8,6.1,1.2);K.plant(-8,6,1.2);K.plant(7.8,-6,1.2);
  for(let i=0;i<7;i++)K.b(1.4,.25,.45,-7.8,.12+i*.25,-1.6-i*.45,0x8a6a4a);K.ob(1.4,3.2,-7.8,-3)},
 stoff(K,R){cpShell(K,R,{front:false,f:'carpet',fc:0x4c5566,fs:3,w:'plaster',wc:0xd9dde2,c:'acoustic',stripe:0x2b3a55});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5]],2.4,.6);
  K.b(7.2,3.3,.1,0,2.2,-6.9,0xa57a4a);K.b(7.4,.12,.16,0,3.9,-6.86,0x3a2a1a);K.b(7.4,.12,.16,0,.5,-6.86,0x3a2a1a);
  const pins=[];for(let i=0;i<9;i++){const x=-3+(i%3)*3+(Math.random()-.5)*.6,y=1.3+Math.floor(i/3)*.9+(Math.random()-.5)*.2;pins.push([x,y]);K.b(.8,.6,.02,x,y,-6.83,i%3?0xf5f5f5:0xfff3b0);K.b(.6,.06,.01,x,y+.12,-6.82,0x333333);K.c(.04,.04,.03,6,x,y+.27,-6.81,0xe63946,K.E)}
  for(const p of[[0,4],[4,8],[1,5],[3,7],[2,4]]){const a=pins[p[0]],b=pins[p[1]],dx=b[0]-a[0],dy=b[1]-a[1];K.bz(Math.hypot(dx,dy),.02,.01,(a[0]+b[0])/2,(a[1]+b[1])/2+.27,-6.8,Math.atan2(dy,dx),0xd62828)}
  for(const p of[[-4.5,-2.6],[-1.5,-2.6],[-4.5,.6],[-1.5,.6]]){K.b(2.4,.06,1.1,p[0],.76,p[1],0xe8e1d3);K.b(.06,.74,1.0,p[0]-1.15,.38,p[1],0x555555);K.b(.06,.74,1.0,p[0]+1.15,.38,p[1],0x555555);K.scr(.7,.42,p[0],1.1,p[1]-.3,0);K.chair(p[0],p[1]+.8,Math.PI,0x2b2b2b);K.ob(2.4,1.1,p[0],p[1])}
  K.gl(.06,3,5,3.6,1.5,-1);K.gl(4.6,3,.06,6.3,1.5,1.5);K.b(.08,3,.08,3.6,1.5,1.5,0x777777);K.table(6.3,-1.2,2.6,1.2,.76,0xe8e1d3);for(const a of[[5.6,-2.2,0],[7,-2.2,0],[5.6,-.2,Math.PI],[7,-.2,Math.PI]])K.chair(a[0],a[1],a[2],0x2b3a55);K.ob(.2,5,3.6,-1);K.ob(4.6,.2,6.3,1.5);
  K.b(3,1.6,.05,6.3,2.2,-6.9,0xffffff);K.b(3.1,.06,.12,6.3,1.4,-6.85,0x999999);K.cooler(-8.3,5.5);for(let i=0;i<3;i++)K.b(.7,1.3,.6,-8.5,.65,-2+i*.75,0x6b7280,Math.PI/2);K.b(.9,.9,.7,8.3,.45,4.8,0xdedede);K.ob(.9,.7,8.3,4.8);
  K.win(2.6,1.8,-8.97,2.3,1.8,Math.PI/2);K.at(14,1.2,1.2,8.95,2.4,3.4,-Math.PI/2,0x2b2b2b);K.plant(-8,6.2,1);K.plant(8,6.2,1)},
 gun(K,R){cpShell(K,R,{f:'concrete',fs:4,w:'brick',wc:0xffffff,ws:2.6,c:'acoustic',cc:0x9a9a9a,base:0x2b2b2b});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.5);
  K.b(10,.9,.9,0,.45,-3.6,0x2b2b2b);K.gl(10,.42,.9,0,1.12,-3.6);K.b(10.1,.04,.95,0,1.34,-3.6,0x111111);K.e(9.8,.03,.05,0,1.3,-3.35,0xffffff);K.b(9.8,.02,.8,0,.92,-3.6,0x3a1d1d);
  for(let i=0;i<12;i++){const x=-4.4+i*.8;K.b(.32,.1,.05,x,.99,-3.6,0x1a1a1a);K.b(.08,.16,.05,x-.11,.95,-3.6,0x1a1a1a)}K.b(10,.12,.02,0,.7,-3.14,0xffb020);
  K.b(16,3,.06,0,2.1,-6.92,0x6e5a44);for(let r=0;r<3;r++)for(let i=0;i<7;i++){const x=-6.6+i*2.2,y=1.4+r*.75,c=[0x1a1a1a,0x3b4a2f,0x8a7350][(i+r)%3];K.b(1.6,.1,.05,x,y,-6.86,c);K.b(.5,.22,.05,x+.75,y-.06,-6.86,c);K.b(.08,.25,.05,x-.2,y-.14,-6.86,c)}
  K.grp(8.5,-3,-Math.PI/2,()=>{K.b(4,2.6,.08,0,1.3,-.22,0x555555);K.b(.08,2.6,.5,-2,1.3,0,0x555555);K.b(.08,2.6,.5,2,1.3,0,0x555555);for(let t=0;t<4;t++){K.b(3.9,.04,.45,0,.5+t*.6,.03,0x777777);for(let x=-1.8;x<1.8;x+=.28)K.box(x,.62+t*.6,.05,.24,.18,.3,[0x3b6b2a,0xd97706,0xb91c1c][Math.random()*3|0])}K.ob(4,.5,0,0)});
  K.at(9,1.6,1.6,-8.95,2.4,-1.5,Math.PI/2,0);K.at(9,1.6,1.6,-8.95,2.4,2.5,Math.PI/2,0);K.at(9,1.3,1.3,8.95,2.6,3.6,-Math.PI/2,0);
  K.grp(-8.94,5.2,Math.PI/2,()=>{K.b(1.4,2.6,.08,0,1.3,0,0x3a3a3a);K.e(1.0,.25,.05,0,2.85,.05,0xff3030)});
  for(let i=0;i<4;i++){K.b(.05,1.5,.05,-5+i*.6,.75,5.2,0x777777)}K.b(2.4,.05,.05,-4.1,1.5,5.2,0x777777);for(let i=0;i<6;i++)K.b(.35,.8,.06,-5+i*.35,1.05,5.2,[0x3b4a2f,0x5b6b3a,0x8a7350][i%3]);K.ob(2.6,.4,-4.1,5.2);
  K.cam(-8.5,-6.5,Math.PI/4);K.cam(8.5,6.5,-Math.PI*.75);K.plant(8,6,1);
  K.b(3.2,.9,1.0,-3.6,.45,1.4,0x2b2b2b);K.gl(3.2,.4,1.0,-3.6,1.1,1.4);K.b(3.1,.02,.9,-3.6,.91,1.4,0x3a1d1d);for(let i=0;i<8;i++){const x=-4.9+(i%4)*.85,z=1.15+(i>>2)*.5;K.b(.3,.09,.05,x,.97,z,0x1a1a1a);K.b(.07,.15,.05,x-.1,.93,z,0x1a1a1a)}K.ob(3.3,1.1,-3.6,1.4);
  K.grp(8.94,1.2,-Math.PI/2,()=>{K.b(3.4,2.2,.06,0,1.7,0,0x5a4632);K.b(3.4,.1,.2,0,.75,.1,0x3a2a1a);for(let i=0;i<9;i++){const x=-1.5+i*.37,c=[0x1a1a1a,0x3b4a2f,0x6b4a2f][i%3];K.b(.07,1.5,.06,x,1.55,.1,c);K.b(.12,.32,.07,x,.95,.1,c);K.b(.05,.2,.06,x+.05,1.45,.12,0x111111)}});
  K.b(1.2,.5,.8,7.6,.25,-5.8,0x4b5d2a);K.b(1.2,.5,.8,7.6,.75,-5.8,0x3b4a2f);K.b(1.1,.45,.75,6.3,.22,-5.9,0x4b5d2a);K.e(.5,.1,.02,7.6,.35,-5.39,0xffd60a);K.ob(2.6,.9,7,-5.8);
  K.grp(-8.94,5.2,Math.PI/2,()=>{K.gl(1.0,.6,.03,0,1.9,.06)});
  R.npc.push(cpPerson(R,0,-5,Math.PI,0x3b4a2f,0x2b2b2b,'m5'));R.ctr={k:'gun',lx:0,lz:-2.55}},
 clinic(K,R){cpShell(K,R,{f:'vinyl',fc:0xd8e2e4,fs:3.2,w:'plaster',wc:0xe6eeec,c:'acoustic',stripe:0xff6f91});K.panels([[-5,-1],[0,-1],[5,-1],[-5,3.6],[0,3.6],[5,3.6],[0,-5.2]],2.4,.6);
  K.b(5,1.1,1.0,0,.55,-3.4,0xffffff);K.b(5.2,.06,1.1,0,1.12,-3.4,0xff6f91);K.b(.5,.35,.05,1,1.45,-3.7,0x111111);K.e(1.4,.44,.05,0,3.6,-6.92,0xff3050);K.e(.44,1.4,.05,0,3.6,-6.9,0xff3050);
  for(const z of[1.4,3.4])for(let i=0;i<4;i++)K.chair(-7.4+i*.7,z,Math.PI,0xff6f91);K.ob(3,.6,-6.35,1.4);K.ob(3,.6,-6.35,3.4);
  for(let i=0;i<3;i++)K.b(.7,1.3,.6,6.5+i*.75,.65,-6.6,0xdedede);K.cooler(7.8,3.2);K.scr(2,1.15,-8.95,2.6,-1.6,Math.PI/2);K.at(8,1.3,1.3,8.95,2.4,0,-Math.PI/2,0);K.win(2.6,1.8,8.97,2.3,4.4,-Math.PI/2);K.plant(-8,6.2,1);K.plant(8,6.2,1);
  K.gl(5,.7,.03,0,1.5,-2.92);K.b(5,.05,.06,0,1.86,-2.92,0xd0d6d8);K.c(.06,.06,.2,8,-2,1.22,-3.1,0xbfe8ff);K.b(.9,.04,.6,-1.2,1.16,-3.5,0xf4f4f4);
  K.b(.05,.05,4.2,4.9,3.2,-3.2,0xaab4b8);for(let i=0;i<8;i++)K.b(.06,2.7,.5,4.9+(i%2)*.06,1.85,-5.0+i*.5,0xbde3e6);K.b(3.6,.05,.05,6.7,3.2,-1.1,0xaab4b8);for(let i=0;i<4;i++)K.b(.5,2.7,.06,5.5+i*.55,1.85,-1.1+(i%2)*.06,0xbde3e6);
  K.b(2.1,.65,.9,7.2,.4,-3.6,0xdfe8ea);K.b(2.0,.12,.85,7.2,.78,-3.6,0xf2f2f2);K.b(.6,.12,.5,8.0,.9,-3.6,0xffffff);K.b(.6,1.6,.4,8.6,.8,-5.8,0xf4f4f4);K.ob(4.2,4.4,7,-3.4);
  K.table(-8.3,2.4,.6,.6,.5,0xdcdcdc);for(let i=0;i<3;i++)K.box(-8.3+(i-1)*.12,.55+i*.02,2.4,.25,.02,.32,[0xe63946,0x1d70b8,0xffd60a][i],i*.4);
  K.grp(3.6,5.6,.6,()=>{K.cz(.32,.04,16,-.3,.32,0,0x333333);K.cz(.32,.04,16,.3,.32,0,0x333333);K.b(.55,.06,.5,0,.5,0,0x2b2b2b);K.b(.55,.5,.06,0,.78,.25,0x2b2b2b);K.ob(.8,.7,0,0)});
  K.cz(.3,.05,24,-3,3.4,-6.92,0xffffff);K.bz(.03,.22,.02,-3,3.48,-6.88,0,0x111111);K.bz(.16,.03,.02,-2.93,3.4,-6.88,0,0x111111);
  R.npc.push(cpPerson(R,0,-5,Math.PI,0xffffff,0xff9fb6,'f4'),cpPerson(R,-6.7,3.4,Math.PI,0x52796f,0x333333,'m2'));R.ctr={k:'clinic',lx:0,lz:-2.55}},
 estate(K,R){cpShell(K,R,{f:'wood',fs:3.5,w:'plaster',wc:0xeae6de,c:'plaster',cc:0xfbfaf7});K.down([[-6,-4],[-2,-4],[2,-4],[6,-4],[-4,1],[4,1],[0,4]]);
  K.b(6,1.1,1.0,0,.55,-3.4,0x6b4a2f);K.b(6.2,.06,1.1,0,1.12,-3.4,0xf4f1ea);K.b(5.8,.2,.02,0,.8,-2.89,0x6dff8a);K.b(.5,.35,.05,-1.2,1.45,-3.7,0x111111);
  K.at(15,2.6,2.6,0,2.6,-6.93,0,0x2b2b2b);for(const z of[-4.6,-1.8,1])K.at(14,1.5,1.5,-8.95,2.4,z,Math.PI/2,0x6b4a2f);for(const z of[-4.6,-1.8])K.at(14,1.5,1.5,8.95,2.4,z,-Math.PI/2,0x6b4a2f);
  K.b(1.2,1.0,1.2,0,.5,1.8,0xffffff);K.b(.7,.4,.5,0,1.21,1.8,0xf2e8d5);K.c(0,.52,.35,4,0,1.58,1.8,0xa5482f);K.b(.12,.18,.02,0,1.1,2.06,0x5b3a29);K.gl(1.1,.8,1.1,0,1.42,1.8);K.ob(1.2,1.2,0,1.8);
  K.sofa(-5.5,3.8,0,2.4,0x4a5a6b);K.table(-5.5,2.6,1.2,.6,.42,0x6b4a2f);K.sofa(5.5,3.8,0,2.4,0x4a5a6b);K.scr(2.4,1.35,8.95,2.6,2.6,-Math.PI/2);K.plant(-8,6.2,1.1);K.plant(8,6.2,1.1);K.plant(3.4,-5.8,1);K.plant(-3.4,-5.8,1);
  for(const sx of[-1,1]){const x=sx*5.6;K.b(2.2,.06,1.0,x,.76,-.6,0x6b4a2f);K.b(2.1,.7,.06,x,.4,-1.05,0x5b3a29);K.b(.06,.74,.95,x-1.05,.38,-.6,0x5b3a29);K.b(.06,.74,.95,x+1.05,.38,-.6,0x5b3a29);K.scr(.7,.42,x,1.1,-.75,Math.PI);K.b(.5,.02,.18,x,.8,-1.0,0x222222);K.chair(x,-1.6,Math.PI,0x2b2b2b);K.chair(x-.5,.4,0,0x4a5a6b);K.chair(x+.5,.4,0,0x4a5a6b);K.ob(2.2,1.0,x,-.6)}
  for(const x of[-7.8,-7.1,7.1,7.8])K.b(.65,1.3,.6,x,.65,-6.55,0x8a8f98);K.b(1.4,1.0,.12,3.6,2.0,-6.9,0x5b3a29);for(let i=0;i<12;i++)K.c(.03,.03,.1,6,3.1+(i%6)*.2,1.8+(i>>2>1?.35:0)+(i>=6?.3:0),-6.82,0xc9a227);
  R.npc.push(cpPerson(R,0,-5,Math.PI,0xf5f5f5,0x2b2b2b,'f1'),cpPerson(R,-5.6,-2.15,Math.PI,0x2b3a55,0x222222,'m3'));R.ctr={k:'estate',lx:0,lz:-2.55}}};
const cpRoomH={store:4.6,jewel:4.6,bank:6.4,police:4.6,hosp:4.6,club:6,safe:4.2,stlux:5.2,stoff:4.4,gun:4.6,clinic:4.4,estate:4.4},cpRoomL={club:[.55,.22,0xff66cc],safe:[.9,.42,0xffe2b8],jewel:[.9,.38,0xffe6c0],stlux:[.8,.38,0xfff1dc]};
let cpRoomN=0;
function cpRoom(type,idx){if(idx===undefined){idx=cpRoomN++;while(idx===24||idx===25)idx=cpRoomN++}const X=3000+idx*90,H=cpRoomH[type]||4.6,R={x:X,z:0,type,H,npc:[],ppl:[],walk:[],clerk:null,grp:new THREE.Group(),zmin:-6.2,obs:[],ctr:null,mine:true};R.grp.visible=false;scene.add(R.grp);
 const K=cpKit(X,H);(cpT[type]||cpT.safe)(K,R);const g=R.grp;
 if(K.F.length)g.add(new THREE.Mesh(cpMG(K.F),cpIF));if(K.G.length)g.add(new THREE.Mesh(cpMG(K.G),cpIG));if(K.E.length)g.add(new THREE.Mesh(cpMG(K.E),cpGlow));if(K.A.length)g.add(new THREE.Mesh(cpMG(K.A),cpAtM));if(K.W.length)g.add(new THREE.Mesh(cpMG(K.W),cpWinM));if(K.SW.length)g.add(new THREE.Mesh(cpMG(K.SW),cpStreetM));if(K.S.length)g.add(new THREE.Mesh(cpMG(K.S),cpScrM));
 cpInst(cpUBox,K.PB,g);cpInst(cpUBot,K.PC,g);g.traverse(o=>{o.castShadow=false;o.receiveShadow=false;o.userData.cpMine=true});
 if(R.clerk||R.ctr||type==='police'||type==='hosp')R.zmin=-2.4;R.obs=R.zmin>-3?K.obs.filter(o=>o[3]>-2.4):K.obs;if(R.ctr){R.ctr.x=X+R.ctr.lx;R.ctr.z=R.ctr.lz}
 const L=cpRoomL[type]||[.85,.36,0xfff2dd];R.li=L[0];R.amb=L[1];R.lc=L[2];R.dc=0;for(const o of g.children)R.dc++;return R}
function cpInst(geo,list,grp){if(!list.length)return null;const m=new THREE.InstancedMesh(geo,cpProdMat,list.length),M=new THREE.Matrix4(),Q=new THREE.Quaternion(),E=new THREE.Euler(),V=new THREE.Vector3(),S=new THREE.Vector3(),C=new THREE.Color();
 list.forEach((o,i)=>{Q.setFromEuler(E.set(0,o.ry,0));M.compose(V.set(o.x,o.y,o.z),Q,S.set(o.sx,o.sy,o.sz));m.setMatrixAt(i,M);m.setColorAt(i,C.setHex(o.c))});m.frustumCulled=false;grp.add(m);return m}
function cpGetRoom(type){return cpRooms[type]||(cpRooms[type]=cpRoom(type))}

// ---- doors (instanced: one draw call for every door in the game) ----
const cpDoorGeo={f:cpMG([bxg(.08,2.7,.08,.04,1.35,0),bxg(.08,2.7,.08,1.56,1.35,0),bxg(1.6,.1,.08,.8,2.65,0),bxg(1.6,.2,.08,.8,.1,0),bxg(1.5,.05,.1,.8,1.1,0),bxg(.05,.5,.08,1.4,1.1,.07)]),g:bxg(1.44,2.42,.03,.8,1.33,0)};
const cpDoorF=new THREE.InstancedMesh(cpDoorGeo.f,new THREE.MeshStandardMaterial({color:0x2b2f36,metalness:.7,roughness:.32}),72),cpDoorG=new THREE.InstancedMesh(cpDoorGeo.g,new THREE.MeshStandardMaterial({color:0xbfd9e6,transparent:true,opacity:.34,roughness:.05,metalness:.3,depthWrite:false,envMapIntensity:1.3}),72);
cpDoorF.frustumCulled=cpDoorG.frustumCulled=false;cpDoorF.count=cpDoorG.count=0;scene.add(cpDoorF,cpDoorG);
const cpDoors=[],cpDM=new THREE.Matrix4(),cpDQ=new THREE.Quaternion(),cpDE=new THREE.Euler(),cpDV=new THREE.Vector3(),cpDS=new THREE.Vector3(1,1,1);
function cpDoorSet(d){cpDQ.setFromEuler(cpDE.set(0,d.ry+d.a,0));cpDM.compose(cpDV.set(d.x,.3,d.z),cpDQ,cpDS);cpDoorF.setMatrixAt(d.i,cpDM);cpDoorG.setMatrixAt(d.i,cpDM);cpDoorF.instanceMatrix.needsUpdate=cpDoorG.instanceMatrix.needsUpdate=true}
function cpAddDoor(x,z,ry){if(cpDoors.length>=72)return null;const d={i:cpDoors.length,x,z,ry,a:0,ta:0};cpDoors.push(d);cpDoorF.count=cpDoorG.count=cpDoors.length;cpDoorSet(d);return d}
// ---- storefronts (merged for every place: ~4 draw calls total) ----
const cpSF={F:[],E:[],GL:[],SG:[]},cpSignKeys=['store','jewel','bank','safe','police','hosp','club','gun','clinic','estate','body'],cpSignL={body:['SPRAY & BODY',0x40e0ff]};
const cpSignTex=cpCT(512,64*16,g=>{g.fillStyle='#000';g.fillRect(0,0,512,1024);cpSignKeys.forEach((k,i)=>{const D=cpTypes[k]||{l:cpSignL[k][0],c:cpSignL[k][1]},y=i*64,c='#'+D.c.toString(16).padStart(6,'0');const q=g.createLinearGradient(0,y,0,y+64);q.addColorStop(0,'#1a1d24');q.addColorStop(1,'#07080b');g.fillStyle=q;g.fillRect(0,y,512,64);
 g.strokeStyle=c;g.lineWidth=3;g.strokeRect(6,y+6,500,52);g.shadowColor=c;g.shadowBlur=14;g.fillStyle=c;g.font='900 '+(D.l.length>12?32:38)+'px -apple-system,Helvetica,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(D.l,256,y+34);g.shadowBlur=0;g.fillStyle='#fff';g.globalAlpha=.85;g.fillText(D.l,256,y+34);g.globalAlpha=1})});
function cpSFb(w,h,d,x,y,z,c,arr,rx){(arr||cpSF.F).push(cpCol(gT(new THREE.BoxGeometry(w,h,d),x,y,z,rx||0,0,0),c))}
function cpSign(key,w,h,x,y,z,ry){const p=gT(new THREE.PlaneGeometry(w,h),x,y,z,0,ry,0),uv=p.attributes.uv,i=cpSignKeys.indexOf(key);for(let k=0;k<uv.count;k++)uv.setY(k,1-(i+1-uv.getY(k))/16);cpSF.SG.push(p)}
function cpFront(pl){const x=pl.x,z=pl.z,c=pl.D.c,acc=new THREE.Color(c),dk=acc.clone().multiplyScalar(.42).getHex(),stone=0xcfc8ba,metal=0x2b2f36,y0=.3,v={store:0,jewel:1,bank:2,safe:3,gun:4,clinic:5,hosp:5,estate:6,police:6,club:7}[pl.type],gv=v===undefined?3:v;
 cpSFb(.5,3.8,.36,x-3.45,y0+1.9,z-.18,stone);cpSFb(.5,3.8,.36,x+3.45,y0+1.9,z-.18,stone);cpSFb(7.4,.55,.3,x,y0+3.35,z-.15,dk);cpSFb(7.4,.07,.34,x,y0+3.06,z-.17,0xeeeeee);
 for(const s of[-1,1]){cpSFb(2.2,.45,.14,x+s*2.1,y0+.22,z-.07,stone);cpSFb(2.3,.06,.2,x+s*2.1,y0+.48,z-.1,0x9a9a9a);cpSFb(2.2,.06,.08,x+s*2.1,y0+2.92,z-.04,metal)}
 for(const mx of[-3.2,-1.0,1.0,3.2])cpSFb(.1,2.95,.12,x+mx,y0+1.47,z-.06,metal);cpSFb(2.0,.14,.12,x,y0+2.78,z-.06,metal);
 cpSF.F.push(cpCol(gT(new THREE.BoxGeometry(7.2,.09,1.5),x,y0+3.13,z-.72,-.3,0,0),dk));cpSFb(7.2,.26,.05,x,y0+2.94,z-1.43,c);
 cpSFb(2.4,.08,1.0,x,y0+.04,z-.5,0x8d8d8d);cpSFb(1.5,.02,.8,x,y0+.09,z-.55,0x2a2a2a);
 for(const s of[-1,1]){cpSFb(.18,.3,.16,x+s*3.45,y0+2.55,z-.44,metal);cpSFb(.12,.22,.04,x+s*3.45,y0+2.55,z-.54,0xfff1c4,cpSF.E)}
 cpSFb(4.9,1.0,.22,x,y0+3.95,z-.36,0x14171c);cpSign(pl.type,4.7,.86,x,y0+3.95,z-.48,Math.PI);
 for(const r of[[-2.1,1.69,2.2,2.44],[2.1,1.69,2.2,2.44],[0,1.36,1.62,2.72]]){const q=gT(new THREE.PlaneGeometry(r[2],r[3]),x+r[0],y0+r[1],z-.02,0,Math.PI,0),uv=q.attributes.uv;for(let k=0;k<uv.count;k++){uv.setX(k,(gv%4+uv.getX(k))/4);uv.setY(k,(uv.getY(k)+(gv<4?1:0))/2)}cpSF.GL.push(q)}
 pl.door=cpAddDoor(x-.8,z-.07,0)}
function cpBodyShop(s){const sl=cpFindSlot(cpBlk(s.x),cpBlk(s.z+BLOCK/2+3.5));if(!sl){s.r=0;s.g.visible=false;scene.remove(s.g);const i=msShops.indexOf(s);if(i>=0)msShops.splice(i,1);return}cpClearFront(sl);
 const x=sl[0],z0=sl[1],y0=.3,dk=0x14171c,st=0x3a3f47;s.x=x;s.z=z0-2.1;s.r=2.5;s.g.position.set(s.x,0,s.z);s.ringM.scale.set(2.5,2.5,1.6);s.tube.scale.set(2.5,2.6,2.5);if(s.g.children[2])s.g.children[2].visible=false;s.g.visible=true;
 for(const sx of[-3.55,3.55])cpSFb(.5,4.7,.4,x+sx,y0+2.35,z0-.2,st);cpSFb(7.6,.7,.42,x,y0+4.6,z0-.21,st);
 cpSFb(6.6,2.9,.06,x,y0+1.45,z0-.03,0x0b0c0e);cpSFb(6.4,.08,.6,x,y0+2.88,z0-.3,0xf6fbff,cpSF.E);
 for(let i=0;i<5;i++)cpSFb(6.6,.24,.14,x,y0+3.05+i*.25,z0-.1,i%2?0x8a9098:0x9aa1a8);cpSFb(6.6,.12,.18,x,y0+2.96,z0-.12,0x50565e);
 cpSFb(5.8,.9,.16,x,y0+5.45,z0-.1,dk);cpSign('body',5.5,.7,x,y0+5.45,z0-.19,Math.PI);
 cpSF.F.push(cpCol(gT(new THREE.BoxGeometry(7.8,.1,2.6),x,y0+4.25,z0-1.3,.12,0,0),0xd7dde3));cpSFb(7.8,.3,.08,x,y0+4.1,z0-2.6,dk);for(const lx of[-2.4,0,2.4])cpSFb(.9,.04,.3,x+lx,y0+4.17,z0-1.3,0xf6fbff,cpSF.E);
 for(const sx of[-2.2,2.2])cpSFb(.1,.02,3.5,x+sx,y0+.02,z0-2.05,0xffd60a);cpSFb(4.5,.02,.1,x,y0+.02,z0-3.8,0xffd60a);
 cpSFb(1.1,1.0,.6,x+4.6,y0+.5,z0-.45,0xb91c1c);cpSFb(1.1,.1,.62,x+4.6,y0+1.0,z0-.45,0x7f1d1d);cpSFb(.8,1.4,.5,x-4.5,y0+.7,z0-.4,0x2563eb);
 for(let i=0;i<4;i++)cpSF.F.push(cpCol(gT(new THREE.CylinderGeometry(.42,.42,.28,14),x+4.5,y0+.14+i*.29,z0-1.4),0x111111));
 const m=makePerson(0x1f4e79,0x2b2b2b,0xc68642);m.userData.rlType='m4';m.position.set(x-4.3,.3,z0-1.5);m.rotation.y=-.4;scene.add(m)}
// ---- places ----
const cpSlots=new Set(),cpParkB={'5,5':1,'1,8':1,'8,1':1,'2,2':1,'8,6':1,'4,9':1};
// a free street-facing (north, -z) building facade near block i,j; returns [doorX, facadeZ, solid]. One shop per facade.
// helipad street elevators (vehicles/mod.js) sit on some north facades: a shop may share that facade, but its 7.4 m storefront must clear the elevator door
const cpElevX=new Map();try{if(typeof vhElev!=='undefined')for(const E of vhElev)if(E.R&&E.R.b){if(!cpElevX.has(E.R.b))cpElevX.set(E.R.b,[]);cpElevX.get(E.R.b).push(E.sx)}}catch(e){}
function cpSlotX(b){const w=b.maxX-b.minX,bx=(b.minX+b.maxX)/2,m=Math.max(0,w/2-3.8),xs=w>=24?[bx-w/4,bx+w/4,bx]:[bx,bx-m,bx+m],el=cpElevX.get(b);if(!el)return xs[0];
 for(const x of xs)if(el.every(ex=>Math.abs(x-ex)>=5.4))return x;return undefined}
// a free street-facing (north, -z) building facade near block i,j; returns [doorX, facadeZ, solid]. One shop per facade. pref: take the helipad building of the block first (hospital, police)
function cpFindSlot(i,j,pref){const ord=[];for(let di=-2;di<=2;di++)for(let dj=-2;dj<=2;dj++){const a=i+di,b=j+dj;if(a<0||b<0||a>=N||b>=N||cpParkB[a+','+b])continue;ord.push([a,b,Math.hypot(di,dj)])}ord.sort((p,q)=>p[2]-q[2]);
 for(const o of ord){const cx=roadCenter(o[0])+CELL/2,cz=roadCenter(o[1])+CELL/2,cand=[];
  for(const s of solids){const w=s.maxX-s.minX;if(!(s.h>4.5&&w>8&&w<34)||cpSlots.has(s))continue;const bx=(s.minX+s.maxX)/2,bz=(s.minZ+s.maxZ)/2;if(Math.abs(bx-cx)>BLOCK/2||Math.abs(bz-cz)>BLOCK/2||s.minZ>cz-10||s.minZ<cz-17.5)continue;if(cpSlotX(s)===undefined)continue;cand.push(s)}
  const key=b=>Math.abs((b.minX+b.maxX)/2-cx)-(pref&&cpElevX.has(b)?1000:0);cand.sort((a,b)=>key(a)-key(b));
  if(cand.length){const b=cand[0];cpSlots.add(b);return [cpSlotX(b),b.minZ,b]}}return null}
function cpClearFront(sl){try{if(typeof wdClearFacade==='function')wdClearFacade(sl[2].minX,sl[2].maxX,sl[1],-1,sl[0])}catch(e){}}
function cpAddPlace(type,i,j){const sl=cpFindSlot(i,j,type==='hosp'||type==='police');if(!sl)return null;cpClearFront(sl);const pl={type,D:cpTypes[type],x:sl[0],z:sl[1],cool:0,door:null};
 Object.defineProperty(pl,'room',{get(){return this._r||(this._r=cpGetRoom(this.type))},set(v){this._r=v},enumerable:false});cpPlaces.push(pl);cpFront(pl);return pl}
for(const w of[['police',4,4],['hosp',6,6],['store',3,3],['store',6,3],['store',3,6],['store',7,7],['store',9,4],['store',4,1],['store',6,9],['jewel',6,5],['bank',5,4],['bank',4,6],['safe',5,6],['club',7,3]])cpAddPlace(w[0],w[1],w[2]);
for(const b of[[5,7],[4,3],[6,2],[2,4],[8,4]])if(cpAddPlace('estate',b[0],b[1]))break;
const cpBlk=v=>Math.round((v-(-HALF+ROAD/2)-CELL/2)/CELL);
if(typeof msShops!=='undefined')for(const s of msShops.slice()){try{if(s.kind==='gun'||s.kind==='clinic'){const pl=cpAddPlace(s.kind,cpBlk(s.x),cpBlk(s.z+18));s.r=0;s.g.visible=false;if(pl){s.x=pl.x;s.z=pl.z-1.4;s.cpPl=pl}else msShops.splice(msShops.indexOf(s),1)}else if(s.kind==='body')cpBodyShop(s)}catch(e){console.log('cp shop',e)}}
{const m1=new THREE.Mesh(cpMG(cpSF.F),cpVM);m1.castShadow=true;m1.receiveShadow=true;scene.add(m1);if(cpSF.E.length)scene.add(new THREE.Mesh(cpMG(cpSF.E),cpGlow));
 scene.add(new THREE.Mesh(cpMG(cpSF.GL),new THREE.MeshBasicMaterial({map:cpTexOf('glimpse'),toneMapped:false,color:0xe8e0d0})));scene.add(new THREE.Mesh(cpMG(cpSF.SG),new THREE.MeshBasicMaterial({map:cpSignTex,toneMapped:false})))}
function cpPlace(t){for(const p of cpPlaces)if(p.type===t)return p;return null}
// land/mod.js hangs tall hotel blade signs on the beach-side walls (every second candidate, same rule as there; this mirrors the 'cand' list under 'hotel blade signs on the beach road' in land/mod.js, keep both in sync): keep the generic awning neon off those walls
try{if(typeof wdClearSide==='function'&&typeof ldGlyph==='function'){const cand=solids.filter(s=>s.h>9&&s.h<36&&s.maxX-s.minX>9&&s.minX>roadCenter(10)&&s.maxX<roadCenter(11)).sort((a,b)=>a.minZ-b.minZ);for(let k=0;k<cand.length&&k<18;k+=2){const s=cand[k],zc=(s.minZ+s.maxZ)/2;wdClearSide(zc-2,zc+2,s.maxX,1)}}}catch(e){}
// minimap icons
{const dm=drawMap;drawMap=function(){dm();if(cpIn)return;const g=mapC,S=260,sc=S/215;g.save();g.beginPath();g.arc(S/2,S/2,S/2-4,0,7);g.clip();g.translate(S/2,S/2);g.rotate(camYaw);g.translate(-pos.x*sc,-pos.z*sc);
  for(const p of cpPlaces){if(p.type==='gun'||p.type==='clinic')continue;const x=p.x*sc,z=p.z*sc;g.fillStyle='#000';g.beginPath();g.arc(x,z,7,0,7);g.fill();g.fillStyle='#'+p.D.c.toString(16).padStart(6,'0');g.beginPath();g.arc(x,z,5.2,0,7);g.fill()}g.restore()}}
// ---- transitions: door swing, camera dolly, warm bloom crossfade ----
const cpFadeEl=document.createElement('div');cpFadeEl.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;background:radial-gradient(ellipse at center,#fffdf6 0%,#fff3dc 55%,#ffe2b8 100%);opacity:0;pointer-events:none;z-index:35';document.body.appendChild(cpFadeEl);
let cpIn=null,cpDoorCD=0,cpRob=null,cpShotAt=-99,cpBeat=0,cpSeq=null,cpOvA=0,cpOvS=-1;const cpFrz=[],cpCam={on:false,p:new THREE.Vector3(),q:new THREE.Quaternion()},cpTM=new THREE.Matrix4(),cpUp=new THREE.Vector3(0,1,0),cpTV=new THREE.Vector3(),cpHT=new THREE.Vector3();
const cpEase=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
function cpPose(px,py,pz,tx,ty,tz){const o={p:new THREE.Vector3(px,py,pz),q:new THREE.Quaternion()};cpTM.lookAt(o.p,cpTV.set(tx,ty,tz),cpUp);o.q.setFromRotationMatrix(cpTM);return o}
function cpCamNow(){return {p:cam.position.clone(),q:cam.quaternion.clone()}}
function cpBlend(a,b,u){cpCam.on=true;cpCam.p.copy(a.p).lerp(b.p,u);cpCam.q.copy(a.q).slerp(b.q,u)}
function cpClampCam(v){const R=cpIn&&cpIn.room;if(!R)return false;const x=Math.max(R.x-8.55,Math.min(R.x+8.55,v.x)),z=Math.max(-6.55,Math.min(6.55,v.z)),y=Math.max(.9,Math.min(R.H+.05,v.y)),ch=x!==v.x||y!==v.y||z!==v.z;v.set(x,y,z);return ch}
function cpFollow(){let d=9;try{if(typeof uiZoom!=='undefined')d*=uiZoom}catch(e){}const cp=Math.cos(camPitch),o=cpPose(pos.x+Math.sin(camYaw)*cp*d,pos.y+2+Math.sin(camPitch)*d,pos.z+Math.cos(camYaw)*cp*d,pos.x,pos.y+2,pos.z);if(cpClampCam(o.p)){cpTM.lookAt(o.p,cpTV.set(pos.x,pos.y+1.8,pos.z),cpUp);o.q.setFromRotationMatrix(cpTM)}return o}
function cpHalt(){joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;fireId=null;burstN=0;jumpQ=carQ=false;vel.x=vel.z=0}
function cpWalk(tx,tz,dt,sp){const dx=tx-pos.x,dz=tz-pos.z,d=Math.hypot(dx,dz);if(d<.04){vel.x=vel.z=0;return}const s=Math.min(d,sp*dt);pos.x+=dx/d*s;pos.z+=dz/d*s;vel.x=dx/d*sp;vel.z=dz/d*sp}
function cpFade(fn){if(cpSeq){fn();return}cpSeq={k:'fade',t:0,fn}}
function cpStartIn(pl){cpSeq={k:'in',t:0,pl,c0:cpCamNow()};if(state==='play')state='cpdoor';cpHalt();if(pl.door)pl.door.ta=-1.75;sfx(.3,420,.18)}
function cpStartOut(){const pl=cpIn,R=pl.room;cpSeq={k:'out',t:0,pl,c0:cpCamNow()};if(state==='play')state='cpdoor';cpHalt();if(R.door)R.door.ta=1.6;sfx(.3,420,.18)}
function cpSeqTick(dt){const S=cpSeq;if(!S)return;S.t+=dt;const t=S.t;
 if(S.k==='fade'){cpOvA=Math.min(1,t/.16);if(t>=.16){cpSeq=null;S.fn();if(!cpSeq)cpSeq={k:'fadeout',t:0}}return}
 if(S.k==='fadeout'){cpOvA=Math.max(0,1-t/.3);if(t>=.3){cpSeq=null;cpOvA=0}return}
 if(S.k==='in'){const pl=S.pl;facing=Math.PI;if(t<.85){cpWalk(pl.x,pl.z-(t<.55?.55:.05),dt,3.4);const e1=cpPose(pl.x+.8,2.75,pl.z-3.8,pl.x,1.6,pl.z+2),e2=cpPose(pl.x+.2,2.2,pl.z-1.25,pl.x,1.6,pl.z+3);
   if(t<.55)cpBlend(S.c0,e1,cpEase(t/.55));else cpBlend(e1,e2,cpEase((t-.55)/.3));cpOvA=t<.55?0:cpEase((t-.55)/.3)}else cpGo(pl,true);return}
 if(S.k==='out'){const pl=S.pl,R=pl.room;facing=Math.PI;if(t<.8){cpWalk(R.x,6.7,dt,3.4);const e1=cpPose(R.x-.5,2.75,3.3,R.x,1.6,9),e2=cpPose(R.x-.1,2.2,5.5,R.x,1.5,10);
   if(t<.5)cpBlend(S.c0,e1,cpEase(t/.5));else cpBlend(e1,e2,cpEase((t-.5)/.3));cpOvA=t<.5?0:cpEase((t-.5)/.3)}else cpLeave();return}
 if(S.k==='settle'){facing=S.face;if(S.walk)cpWalk(S.wx,S.wz,dt,2.4);cpOvA=S.flash?Math.max(0,1-t/.32):0;if(S.door&&t>.4)S.door.ta=0;cpBlend(S.c0,cpFollow(),cpEase(t/S.dur));
  if(t>=S.dur){cpCam.on=false;cpSeq=null;cpOvA=0;vel.x=vel.z=0;if(state==='cpdoor')state='play'}}}
function cpFreeze(){cpFrz.length=0;for(const pc of police)if(!pc.dead&&!pc.gone)cpFrz.push({o:pc.m.position,v:pc.m.position.clone(),pc});for(const s of shooters)if(s.kind==='cop'&&!s.dead)cpFrz.push({o:s.g.position,v:s.g.position.clone()})}
{const sp0=spawnPolice;spawnPolice=function(){if(cpIn)return;sp0()}}
const cpRing=document.createElement('div');cpRing.style.cssText='position:fixed;left:50%;top:20%;width:92px;height:92px;margin-left:-46px;border-radius:50%;display:none;align-items:center;justify-content:center;pointer-events:none;z-index:30;color:#fff;font-weight:900;font-size:15px;text-shadow:0 1px 3px #000';document.body.appendChild(cpRing);
function cpShow(R,on){R.grp.visible=on;for(const g of R.ppl)g.visible=on}
function cpGo(pl,fromSeq){const R=pl.room;if(cpIn&&cpIn!==pl)cpShow(cpIn.room,false);cpIn=pl;cpShow(R,true);cpFreeze();
 pos.set(R.x,.3,5.75);vel.set(0,0,0);facing=0;player.rotation.y=0;camYaw=0;camPitch=.3;rainMesh.visible=false;cpDoorCD=1.6;R.ctrIn=false;
 cpLight.position.set(R.x,.3+R.H-.6,0);cpLight.intensity=R.li;cpLight.color.setHex(R.lc);cpLight.distance=30;cpRob=null;if(R.door){R.door.a=1.6;R.door.ta=0;cpDoorSet(R.door)}
 if(R.clerk){R.clerk.rotation.x=0;R.clerk.userData.armL.rotation.x=R.clerk.userData.armR.rotation.x=0}
 if(pl.D&&pl.D.pay){if(!cpSave.robHint)toast('Pull your gun on the clerk: FIRE (left click) to rob the place')}else if(pl.type==='safe'){hp=100;if(wanted<=2){wantedScore=0;wanted=0;evade=0}cpStore();toast('Safehouse: healed, heat cleared, game saved')}
 else if(pl.type==='hosp'||pl.type==='clinic')toast('Walk up to the front desk for treatment');else if(pl.type==='gun')toast('Walk up to the counter to shop');else if(pl.type==='estate')toast('See the agent at the counter to buy property');else if(pl.type==='police')toast(wanted>0?'Bold move walking in here':'Police station');else if(pl.type==='club')toast('Club Neon');
 cpSeq={k:'settle',t:0,dur:.8,flash:cpOvA>.3,c0:cpPose(R.x+.75,2.9,6.7,R.x-.2,1.5,-1),walk:true,wx:R.x,wz:4.3,face:0};if(state==='play'||state==='cpdoor')state='cpdoor'}
function cpEnter(pl){if(pl.D.pay&&pl.cool>T){toast('Closed after the robbery. Try later');cpDoorCD=3;return}
 if(pl.type==='safe'&&!cpSave.own){cpDoorCD=2.5;const e=cpPlace('estate');cpOpen('<div style="font-size:20px;color:#4a9dff">APARTMENT FOR SALE</div>This safehouse is listed with Prime Key Realty. Buy it at their counter, then come back with the keys.<br>Price: <span style="color:#6dff8a">$5,000</span><br>'+cpBtn('w','MARK REALTY ON MAP')+cpBtn('x','OK','#ccc'),k=>{cpClose();if(k==='w'&&e){try{mpWay={x:e.x,z:e.z-2};mpDirty=true}catch(x){}toast('Prime Key Realty marked on your map')}});return}
 if(pl.door)cpStartIn(pl);else cpFade(()=>cpGo(pl))}
function cpLeave(silent){const pl=cpIn;if(!pl)return;if(cpRob&&cpRob.t>0&&!cpRob.done){const part=Math.round(cpRob.pay*Math.min(1,cpRob.t/cpRob.dur)/10)*10;cash+=part;pl.cool=T+150;if(part>0)cpCashFlash()}
 cpRob=null;cpRing.style.display='none';cpIn=null;cpDoorCD=1.8;rainMesh.visible=true;cpLight.intensity=0;const R=pl.room;cpShow(R,false);cpFrz.length=0;if(R.door){R.door.a=R.door.ta=0;cpDoorSet(R.door)}
 if(silent){cpSeq=null;cpCam.on=false;cpOvA=0;return}
 if(pl.door){pos.set(pl.x,.3,pl.z-.85);pl.door.a=pl.door.ta=-1.75;cpDoorSet(pl.door)}else pos.set(pl.x,.3,pl.z-2.6);vel.set(0,0,0);facing=0;player.rotation.y=0;camYaw=Math.PI;camPitch=.35;
 let k=0;for(const pc of police)if(!pc.dead&&!pc.gone){const a=k++*1.3;pc.m.position.set(pl.x+Math.cos(a)*45,0,pl.z-20+Math.sin(a)*30);collide(pc.m.position,2)}for(const s of shooters)if(s.kind==='cop'&&!s.dead){const a=Math.random()*6.3;s.g.position.set(pl.x+Math.cos(a)*22,.3,pl.z-14+Math.sin(a)*8);collide(s.g.position,.5)}
 cpSeq={k:'settle',t:0,dur:.9,flash:cpOvA>.3,c0:cpPose(pl.x-1.8,2.1,pl.z-5.8,pl.x,1.5,pl.z-.3),walk:!!pl.door,wx:pl.x,wz:pl.z-2.6,face:0,door:pl.door};if(state==='play'||state==='cpdoor')state='cpdoor'}
{const c0=collide;collide=function(p,r,maxH){if(cpIn&&p===pos){const R=cpIn.room;p.x=Math.max(R.x-8.3,Math.min(R.x+8.3,p.x));p.z=Math.max(R.zmin,Math.min(6.7,p.z));
  for(const o of R.obs){const cx=Math.max(o[0],Math.min(p.x,o[1])),cz=Math.max(o[2],Math.min(p.z,o[3])),dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;if(d2<.2025){const d=Math.sqrt(d2);if(d<1e-4)p.z=o[3]+.45;else{p.x+=dx/d*(.45-d);p.z+=dz/d*(.45-d)}}}return false}return c0(p,r,maxH)}}
{const s0=shoot;shoot=function(){cpShotAt=T;s0();for(const q of peds){const u=q.userData;if(u.dead||u.cpPan>0)continue;if(Math.hypot(q.position.x-pos.x,q.position.z-pos.z)<30){u.cpPan=8;u.cpSpd=u.path.spd;u.path.spd=Math.min(3.6,u.path.spd*2.6)}}}}
{const r0=respawn;respawn=function(){if(cpIn)cpLeave(true);r0();const h=cpPlace('hosp');if(h){pos.set(h.x,.3,h.z-3);camYaw=Math.PI}}}
// ---- counters: buying happens inside, at the desk ----
const cpCounterH={};
function cpOpenCounter(kind,onOpen){cpCounterH[kind]=onOpen}
function cpClinic(pl){if(hp>=100){toast('Nurse: you look healthy to me');return}const fee=Math.max(20,Math.round((100-hp)*2));
 cpOpen('<div style="font-size:20px;color:#ff6f91">'+pl.D.l+'</div>Full treatment restores your health.<br>Fee: <span style="color:#6dff8a">$'+fee+'</span> &nbsp; You have $'+cash+'<br>'+cpBtn('pay','PAY')+cpBtn('x','NOT NOW','#ccc'),k=>{if(k==='pay'){if(cash>=fee){cash-=fee;hp=100;cpClose();toast('Patched up  -$'+fee);beep(900,.12,.12);setTimeout(()=>beep(1200,.2,.12),110)}else toast('Not enough cash')}else cpClose()})}
function cpGunFallback(){const it=[['SMG AMMO +60',150,()=>{WEAP[1].ammo+=60}],['SHOTGUN +12',200,()=>{WEAP[2].ammo+=12}],['ROCKETS +3',600,()=>{WEAP[3].ammo+=3}],['ARMOR',300,()=>{armor=100}]];
 cpOpen('<div style="font-size:20px;color:#ffb020">IRONSIGHT GUNS</div>You have $'+cash+'<br>'+it.map((a,i)=>cpBtn(i,a[0]+' $'+a[1])).join('')+cpBtn('x','CLOSE','#ccc'),k=>{if(k==='x'){cpClose();return}const a=it[+k];if(cash>=a[1]){cash-=a[1];a[2]();toast('Bought '+a[0])}else toast('Not enough cash')})}
function cpEstate(pl){let L=[];try{if(typeof stProps!=='undefined'&&typeof stBuy==='function')L=stProps}catch(e){}
 const own=P=>{try{return typeof stOwn==='function'?stOwn(P):(P.id==='safe'&&cpSave.own)}catch(e){return false}},
 draw=()=>{let h='<div style="font-size:20px;color:#6dff8a">PRIME KEY REALTY</div><div style="font-weight:500;font-size:13px">Tap a listing to buy it. You have $'+cash+'</div>';
  if(L.length){for(const P of L)h+='<div data-k="'+P.id+'" style="margin-top:8px;padding:8px 10px;border-radius:10px;background:'+(own(P)?'#1e2a22':'#232831')+';border:1px solid #ffffff22"><span style="color:'+(own(P)?'#6dff8a':'#fff')+'">'+P.n+'</span> <span style="float:right;color:#6dff8a">'+(own(P)?'OWNED':'$'+P.p.toLocaleString())+'</span><div style="font-weight:500;font-size:12px;color:#aab">'+(P.d||'')+'</div></div>'}
  else h+='<div data-k="safe" style="margin-top:8px;padding:8px 10px;border-radius:10px;background:#232831">Safehouse Apartment <span style="float:right;color:#6dff8a">'+(cpSave.own?'OWNED':'$5,000')+'</span></div>';
  cpOpen(h+cpBtn('x','CLOSE','#ccc'),k=>{if(k==='x'){cpClose();return}if(L.length){const P=L.find(q=>q.id===k);if(!P||own(P))return;try{if(stBuy(P)){toast('Keys to '+P.n+' are yours');try{if(P.x!==undefined){mpWay={x:P.x,z:P.z};mpDirty=true}}catch(e){}}}catch(e){}draw()}
   else if(!cpSave.own){if(cash>=5000){cash-=5000;cpSave.own=true;cpStore();cpBanner('PROPERTY BOUGHT','#6dff8a','Safehouse Apartment',2.4);draw()}else toast('Not enough cash')}})};draw()}
function cpCounter(pl,R){const k=R.ctr.k,h=cpCounterH[k];if(h){try{h(pl,R)}catch(e){console.log('cp counter',e)}return}
 if(k==='gun'){if(typeof msOpenMenu==='function')msOpenMenu();else cpGunFallback()}else if(k==='clinic')cpClinic(pl);else if(k==='estate')cpEstate(pl)}
// ---- render hook: interior lighting, camera override / clamp, hide outdoor markers indoors ----
{const rr=renderer.render.bind(renderer),hc=new THREE.Color(),hg=new THREE.Color(),mapEl=$('map');let mapHid=false;
 renderer.render=function(s,c){if(s!==scene||c!==cam)return rr(s,c);
  if(cpCam.on){cam.position.copy(cpCam.p);cam.quaternion.copy(cpCam.q);cam.updateMatrixWorld()}else if(cpIn&&cpClampCam(cam.position)){cam.lookAt(pos.x,pos.y+1.8,pos.z);cam.updateMatrixWorld()}
  const ins=!!cpIn;if(ins!==mapHid){mapHid=ins;if(mapEl)mapEl.style.visibility=ins?'hidden':''}
  if(!ins)return rr(s,c);const R=cpIn.room,si=sun.intensity,hi=hemi.intensity,bv=beam.visible,rv=ring.visible,av=arrow.visible;let mb=null;try{if(typeof mpBeam!=='undefined'&&mpBeam){mb=mpBeam;mb.cpV=mb.visible;mb.visible=false}}catch(e){}
  try{if(typeof fxPt!=='undefined')fxPt.style.display='none'}catch(e){}
  hc.copy(hemi.color);hg.copy(hemi.groundColor);sun.intensity=0;hemi.intensity=R.amb;hemi.color.setHex(0xfff1e0);hemi.groundColor.setHex(0x4a4038);beam.visible=ring.visible=arrow.visible=false;
  try{rr(s,c)}finally{sun.intensity=si;hemi.intensity=hi;hemi.color.copy(hc);hemi.groundColor.copy(hg);beam.visible=bv;ring.visible=rv;arrow.visible=av;if(mb)mb.visible=mb.cpV}}}
// ---- inside: robbery, counters, ambient life ----
function cpInTick(dt){const pl=cpIn,R=pl.room,D=pl.D||{};evade=0;cpScrM.uniforms.uT.value=T;
 for(const w of R.walk){if(w.stop||w.g.userData.dead)continue;const g=w.g;if(w.pause>0){w.pause-=dt;continue}const p=w.pts[w.i],tx=R.x+p[0],tz=p[1],dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);if(d<.15){w.i=(w.i+1)%w.pts.length;w.pause=1+Math.random()*2.5;continue}g.position.x+=dx/d*1.1*dt;g.position.z+=dz/d*1.1*dt;g.rotation.y=Math.atan2(-dx,-dz);w.w+=dt*6;animLimbs(g,1.1,w.w)}
 if(R.ctr&&state==='play'){const d=Math.hypot(pos.x-R.ctr.x,pos.z-R.ctr.z);if(d<1.7){if(!R.ctrIn){R.ctrIn=true;cpCounter(pl,R)}}else if(d>2.6)R.ctrIn=false}
 cpAlarmTick(pl,R,dt);if(R.ball)R.ball.rotation.y+=dt*.8;
 if(pl.type==='club'){cpBeat-=dt;if(cpBeat<=0){cpBeat=.46;sfx(.12,120,.5);cpLight.color.setHSL(Math.random(),1,.6);if(R.dance){const C=new THREE.Color();for(let i=0;i<16;i++)R.dance.setColorAt(i,C.setHSL(Math.random(),1,.55));R.dance.instanceColor.needsUpdate=true}}
  (R.dancers||[]).forEach((g,i)=>{const u=g.userData,s=Math.sin(T*6.8+i);if(u.dead||u.cpRe)return;g.position.y=.3+Math.abs(s)*.22;g.rotation.y+=dt*(i%2?1.2:-1);u.armL.rotation.x=-2+s;u.armR.rotation.x=-2-s;u.legL.rotation.x=s*.4;u.legR.rotation.x=-s*.4});return}
 if(!D.pay||!R.clerk||state!=='play')return;cpRobTick(pl,R,D,dt)}
// ===== robbery: shown, not told. The clerk raises both hands, empties the till and pushes bundles of cash across the counter; customers crouch or run =====
const cpRobCfg={store:{tx:-1.6,cz:-4.5,top:1.06,fz:-3.32},jewel:{tx:0,cz:-4.6,top:1.46,fz:-3.28},bank:{tx:0,cz:-4.15,top:1.21,fz:-2.86}},
 cpBundG=new THREE.BoxGeometry(.32,.12,.16),cpBundM=new THREE.MeshStandardMaterial({color:0x6fbf73,roughness:.8}),cpBandM=new THREE.MeshStandardMaterial({color:0xf2e6c0,roughness:.7}),cpBandG=new THREE.BoxGeometry(.06,.125,.165);
const cpPF=new THREE.Vector3(),cpPU=new THREE.Vector3(),cpPR=new THREE.Vector3(),cpPQ=new THREE.Quaternion(),cpPD=new THREE.Vector3(),cpHV=new THREE.Vector3();
// arm poses: direction of the upper arm, then the forearm, in the person's own forward / up / right axes (mirrored for the left arm)
const cpPoses={up:[[.12,.2,1],[.12,1,.08]],reach:[[.5,-.82,.14],[.92,-.42,-.15]],give:[[.82,-.32,.1],[1,.06,-.28]],cower:[[.55,.55,.55],[-.2,.9,-.55]]};
// applied after real/mod.js has run the animation mixer for this frame (crime's MODS hook runs after real's), so it layers on top of the clip
const cpArmB=[['L_UpperArm','L_Forearm'],['L_Forearm','L_Hand'],['R_UpperArm','R_Forearm'],['R_Forearm','R_Hand']],cpArmLow={up:-2.9,reach:-.8,give:-1.35,cower:-2.6};
function cpArmAp(B,P,wt){for(let si=0;si<2;si++){const s=si?1:-1;for(let i=0;i<2;i++){const d=P[i],bn=cpArmB[si*2+i];cpPD.set(0,0,0).addScaledVector(cpPF,d[0]).addScaledVector(cpPU,d[1]).addScaledVector(cpPR,d[2]*s).normalize();
  rlPoint(B[bn[0]],B[bn[1]],cpPD,wt)}}}
function cpArm(g,k,w,k0){const u=g.userData,a=u.av;if(a&&a.B&&typeof rlPoint==='function'){g.getWorldQuaternion(cpPQ);cpPF.set(0,0,-1).applyQuaternion(cpPQ);cpPU.set(0,1,0).applyQuaternion(cpPQ);cpPR.set(1,0,0).applyQuaternion(cpPQ);
  if(k0&&k0!==k)cpArmAp(a.B,cpPoses[k0],1);cpArmAp(a.B,cpPoses[k],w);return}
 if(!u.armL)return;const t=cpArmLow[k];u.armL.rotation.x=u.armR.rotation.x=t;u.armL.rotation.z=k==='up'?-.5:0;u.armR.rotation.z=k==='up'?.5:0}
function cpHand(g,out){const a=g.userData.av;if(a&&a.B&&a.B.R_Hand){a.B.R_Hand.getWorldPosition(out);return out}g.getWorldQuaternion(cpPQ);cpPF.set(0,0,-1).applyQuaternion(cpPQ);return out.copy(g.position).addScaledVector(cpPF,.5).setY(1.4)}
function cpFace(g,x,z,dt,k){const ty=Math.atan2(-(x-g.position.x),-(z-g.position.z));let d=ty-g.rotation.y;d=((d+Math.PI*3)%(Math.PI*2))-Math.PI;g.rotation.y+=d*Math.min(1,dt*(k||8))}
function cpRobReset(R){if(!R)return;cpSG.visible=cpSGF.visible=false;if(R.robFx){for(const b of R.robFx)R.grp.remove(b.m);R.robFx.length=0}
 R.shotSeen=cpShotAt;R.alarmCall=0;for(const g of R.ppl){const u=g.userData,f=u.lfF;if(f&&f.dead){if(T-f.deadT<150)continue;f.dead=false;u.dead=false;try{rlRevive(g)}catch(e){}}if(f){f.hp=1;f.hot=false}if(u.gun)u.gun.visible=false;u.rlAimT=0;
  if(!u.cpHome)u.cpHome=[g.position.x,g.position.z,g.rotation.y];else{g.position.set(u.cpHome[0],.3,u.cpHome[1]);g.rotation.y=u.cpHome[2]}
  u.cpRe=null;u.cpNerv=0;g.rotation.x=0;try{rlPlay(g,null)}catch(e){}if(u.armL){u.armL.rotation.set(0,0,0);u.armR.rotation.set(0,0,0)}}
 for(const w of R.walk)w.stop=false}
{const g0=cpGo;cpGo=function(pl,f){g0(pl,f);try{cpRobReset(pl.room)}catch(e){console.log('cp rob reset',e)}}}
// customers: some freeze and crouch, some bolt for the door
function cpRole(pl,R,g){const u=g.userData;if(u.cpRole)return u.cpRole;const h=u.cpHome||[g.position.x,g.position.z];let r='cust';
 if(u.rlType==='cop')r='cop';else if(pl.type==='gun'||(pl.type==='club'&&g===R.npc[1]))r='guard';else if(g===R.clerk)r='clerk';else if(h[1]<-4.4)r='staff';return u.cpRole=r}
function cpScream(g){try{if(typeof auVoice==='function')auVoice(Math.random()<.6?'scream':'whimper',g.position,typeof lfFem==='function'&&lfFem(g))}catch(e){}}
function cpPanic(R,c){const pl=cpIn||{type:R.type};let k=0,v=0;R.alarm=T;for(const g of R.ppl){const u=g.userData;if(g===c||u.cpRe||u.dead||!g.visible)continue;const w=R.walk.find(q=>q.g===g);if(w)w.stop=true;const role=cpRole(pl,R,g);
  let kind;if(role==='cop'||role==='guard'){kind='fire';if(u.lfF){u.lfF.hp=Math.max(u.lfF.hp,4);u.lfF.hot=true}}else if(role==='staff'||role==='clerk')kind='duck';else kind=(w?(k++%2===0):Math.random()<.25)?'run':'cower';
  u.cpRe={k:kind,t:Math.random()*.45,cd:.8+Math.random()*.8};if(kind!=='fire'&&v++<3)cpScream(g)}}
// gunfire (or a gun pointed at someone) anywhere indoors: everyone in the room reacts, somebody calls it in
function cpAlarmTick(pl,R,dt){const pay=!!(pl.D&&pl.D.pay);
 if(cpShotAt>(R.shotSeen===undefined?cpShotAt:R.shotSeen)){R.shotSeen=cpShotAt;cpPanic(R,pay&&R.clerk&&!R.clerk.userData.dead&&!(cpRob&&cpRob.done)&&Math.hypot(pos.x-R.clerk.position.x,pos.z-R.clerk.position.z)<11?R.clerk:null);if(pl.type==='police')cpStars(3);else if(!pay&&!R.alarmCall)R.alarmCall=T+3.5}
 if(R.shotSeen===undefined)R.shotSeen=cpShotAt;if(R.alarmCall&&T>R.alarmCall){R.alarmCall=0;cpStars(1)}
 cpPanicTick(R,dt)}
// hooks used by the life module's everyone-is-mortal code
function cpAimAt(g){if(cpIn&&g.userData.cpR===cpIn.room)cpShotAt=T}
// the first shot in a robbable place is the hold-up itself: nobody is hit while the robbery is only starting (shots into the ceiling)
function cpFolkHit(g){const pl=cpIn;if(!pl||!pl.D||!pl.D.pay)return false;const R=pl.room,c=R.clerk;if(!c||c.userData.dead||Math.hypot(pos.x-c.position.x,pos.z-c.position.z)>=11)return false;return !cpRob||T-cpRob.start<.6}
function cpFolkDown(g){const pl=cpIn;if(!pl)return;const R=pl.room,u=g.userData,w=R.walk.find(q=>q.g===g);if(w)w.stop=true;u.cpRe={k:'dead',t:0};g.position.y=.3;u.rlAimT=0;if(u.gun)u.gun.visible=false;
 if(g===R.clerk&&cpRob){const r=cpRob;if(!r.done&&!r.down){cpStars(Math.min(5,((pl.D&&pl.D.stars)||1)+1));r.pt=0}r.down=true;cpSG.visible=cpSGF.visible=false}
 else cpStars(u.rlType==='cop'?4:2);
 cpShotAt=T}
function cpPanicTick(R,dt){for(const g of R.ppl){const u=g.userData,e=u.cpRe;if(!e||u.dead||e.k==='dead')continue;if(e.t>0){e.t-=dt;continue}
  if(e.k==='duck'){if(!e.on){e.on=true;try{rlPlay(g,'Cower',{fade:.2})}catch(x){}}g.position.y+=(-.3-g.position.y)*Math.min(1,dt*7);if(!u.av)cpArm(g,'cower',1);continue}
  if(e.k==='fire'){cpFace(g,pos.x,pos.z,dt,7);u.rlAimT=T+.3;if(u.gun)u.gun.visible=true;if(!u.av&&u.armR)u.armR.rotation.x=Math.PI/2;e.cd-=dt;if(e.cd<=0&&state==='play'){e.cd=1.2+Math.random()*.9;enemyShoot({g,kind:'cop'})}continue}
  if(e.k==='run'){if(!e.wp){const sx=g.position.x<R.x?-.3:.3;e.wp=[[g.position.x,5.6],[R.x+sx,5.6],[R.x+sx,6.7]]}const q=e.wp[0],tx=q[0],tz=q[1],dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);if(d<.3){e.wp.shift();if(!e.wp.length){g.visible=false;e.k='gone'}continue}
   const sp=4.6;g.position.x+=dx/d*sp*dt;g.position.z+=dz/d*sp*dt;g.rotation.y=Math.atan2(-dx,-dz);if(!g.userData.av&&g.userData.legL)animLimbs(g,sp,T*14)}
  else if(e.k==='cower'){if(!e.on){e.on=true;try{rlPlay(g,'Cower',{fade:.25})}catch(x){}}cpFace(g,pos.x,pos.z,dt,3);if(!g.userData.av)cpArm(g,'up',1)}}}
function cpCashFlash(){const el=$('cash');if(!el)return;el.style.transition='transform .2s,color .2s';el.style.transform='scale(1.35)';el.style.color='#6dff8a';clearTimeout(cpCashFlash.h);cpCashFlash.h=setTimeout(()=>{el.style.transform='';el.style.color=''},700)}
// armed clerk: a pump shotgun held at the hand, muzzle flash on each shot (one shared mesh, parented to the room being robbed)
const cpSG=new THREE.Mesh(U.mergeBufferGeometries([gT(new THREE.CylinderGeometry(.03,.03,.78,8),0,.02,.28,Math.PI/2,0,0),gT(new THREE.CylinderGeometry(.035,.035,.36,8),0,-.04,.22,Math.PI/2,0,0),bxg(.07,.12,.34,0,-.02,-.12),bxg(.06,.14,.3,0,-.08,-.38)]),new THREE.MeshStandardMaterial({color:0x2a2420,roughness:.55,metalness:.4})),
 cpSGF=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,0),new THREE.MeshBasicMaterial({color:0xffd27a,toneMapped:false}));cpSG.visible=false;cpSGF.visible=false;cpSGF.position.set(0,.02,.74);cpSG.add(cpSGF);
const cpSGV=new THREE.Vector3(),cpSGT=new THREE.Vector3(),cpRobDur={reach:.8,give:.65};
function cpRobAdd(R,C,c,st){const k=R.robFx.length,m=new THREE.Mesh(cpBundG,cpBundM),band=new THREE.Mesh(cpBandG,cpBandM);m.add(band);m.rotation.y=cpR(-.4,.4);
 const tp=new THREE.Vector3(R.x+C.tx+((k%3)-1)*.34+cpR(-.04,.04),.3+C.top+.04+(Math.floor(k/3)%4)*.125,C.fz-Math.floor(k/12)*.17);R.grp.add(m);const b={m,p0:new THREE.Vector3(),tp,e:0,st};
 if(st==='slide')b.p0.set(R.x+C.tx,.3+C.top-.3,C.fz-.6);else cpHand(c,b.p0);m.position.copy(b.p0);R.robFx.push(b);beep(990,.12,.04);return b}
function cpRobTick(pl,R,D,dt){const c=R.clerk,u=c.userData,C=cpRobCfg[pl.type]||cpRobCfg.store;if(u.dead&&!cpRob)return;
 if(!cpRob){const near=Math.hypot(pos.x-c.position.x,pos.z-c.position.z)<11;if(near&&(fireId!==null||T-cpShotAt<.4)){
   cpRob={t:0,dur:D.dur,pay:Math.round(cpR(D.pay[0],D.pay[1])/10)*10,armed:Math.random()<.25,cd:1.6,down:false,start:T,ph:'up',pt:0,k0:null,n:0,walk:0,cur:null};cpStars(D.stars);
   if(!cpSave.robHint){cpSave.robHint=1;cpStore()}cpPanic(R,c);sfx(.25,300,.3);if(!R.robFx)R.robFx=[]}return}
 const r=cpRob;
 // the till is empty: the bundles on the counter fly into the player's bag, the clerk crouches behind the counter
 if(r.done){for(let i=R.robFx.length-1;i>=0;i--){const b=R.robFx[i];if(!b.fly)continue;b.fly+=dt*2.4;const e=Math.min(1,b.fly);cpHV.set(pos.x,pos.y+1.2,pos.z);b.m.position.lerpVectors(b.p0,cpHV,e*e);b.m.position.y+=Math.sin(e*Math.PI)*.5;if(e>=1){R.grp.remove(b.m);R.robFx.splice(i,1)}}
  if(!r.down&&!u.dead){cpFace(c,pos.x,pos.z,dt,3);if(!r.cow){r.cow=1;try{rlPlay(c,'Cower',{fade:.3})}catch(e){}}if(!u.av)cpArm(c,'cower',1)}return}
 // the clerk steps over to the till
 if(r.walk<1&&!r.down){r.walk=Math.min(1,r.walk+dt*1.6);c.position.x+=(R.x+C.tx-c.position.x)*Math.min(1,dt*6);c.position.z+=(C.cz-c.position.z)*Math.min(1,dt*6)}
 if(r.armed&&!r.down){if(u.lfF){u.lfF.hot=true;if(!r.tough){r.tough=1;u.lfF.hp=2.5}}cpFace(c,pos.x,pos.z,dt);u.rlAimT=T+.3;if(u.armR&&!u.av){u.armR.rotation.x=Math.PI/2;u.armL.rotation.x=1.2}r.cd-=dt;
  if(u.av&&u.av.gun)u.av.gun.visible=false;if(cpSG.parent!==R.grp)R.grp.add(cpSG);cpSG.visible=true;cpHand(c,cpSG.position);cpSG.lookAt(cpSGT.set(pos.x,pos.y+1.3,pos.z));
  if(!r.pump){r.pump=1;sfx(.08,260,.25);setTimeout(()=>sfx(.08,200,.25),140)}
  if(cpSGF.visible&&T>r.fl)cpSGF.visible=false;
  if(r.cd<=0){r.cd=1.9;cpSGF.visible=true;r.fl=T+.06;cpSG.localToWorld(cpSGV.set(0,.02,.8));tracer(cpSGV,cpSGT.set(pos.x,1.5,pos.z));burst(cpSGV,6,0xffcc66,3,.18,.18,.5);
   try{if(typeof auGun==='function'&&AC){auInit();auGun('SHOTGUN',1)}else sfx(.4,1100,.8)}catch(e){sfx(.4,1100,.8)}hurt(15)}
  if(!u.lfF&&cpShotAt>r.start+.6){r.down=true;u.rlAimT=0;c.rotation.x=-Math.PI/2;cpSG.visible=cpSGF.visible=false;cpStars(Math.min(5,D.stars+1));r.pt=0}return}
 if(cpSG.visible)cpSG.visible=cpSGF.visible=false;
 r.t+=dt*(r.down?1.4:1);r.pt+=dt;
 if(!r.down){const ph=r.ph,dur=ph==='up'?(r.n?.45:1.0):cpRobDur[ph];let w=Math.min(1,r.pt/.28);w=w*w*(3-2*w);
  if(ph==='reach')cpFace(c,R.x+C.tx,C.fz+3,dt,6);else cpFace(c,pos.x,pos.z,dt,6);
  if(!u.cpNerv){u.cpNerv=1;try{rlPlay(c,'Nervous',{fade:.25})}catch(e){}}
  cpArm(c,ph,w,r.k0);
  if(ph==='give'){if(!r.cur)r.cur=cpRobAdd(R,C,c,'hand');if(r.pt>.34&&r.cur.st==='hand'){r.cur.st='slide';r.cur.p0.copy(r.cur.m.position)}}
  if(r.pt>=dur){r.k0=ph;r.pt=0;r.ph=ph==='up'?'reach':(ph==='reach'?'give':'up');if(ph==='give'){r.n++;if(r.cur&&r.cur.st==='hand'){r.cur.st='slide';r.cur.p0.copy(r.cur.m.position)}r.cur=null}}}
 else if(r.pt>.8){r.pt=0;cpRobAdd(R,C,c,'slide')}
 for(const b of R.robFx){if(b.st==='hand')cpHand(c,b.m.position);else if(b.st==='slide'){b.e=Math.min(1,b.e+dt*3.2);const e=b.e;b.m.position.lerpVectors(b.p0,b.tp,e*e*(3-2*e));if(e>=1)b.st='rest'}}
 if(r.t>=r.dur){r.done=true;cash+=r.pay;pl.cool=T+150;u.cpNerv=0;try{rlPlay(c,null)}catch(e){}for(const b of R.robFx){b.p0=b.m.position.clone();b.st='fly';b.fly=.001+Math.random()*.25}
  cpCashFlash();sfx(.2,1500,.2);if(typeof msSave==='function')msSave()}}
let cpInit=false;
function cpIntTick(dt){
 if(!cpInit){cpInit=true;try{if(typeof mpIcons!=='undefined')for(const p of cpPlaces){if(p.type==='gun'||p.type==='clinic')continue;mpIcons.push({x:p.x,z:p.z,label:p.D.l,color:'#'+p.D.c.toString(16).padStart(6,'0'),glyph:{store:'$',jewel:'J',bank:'B',safe:'H',police:'P',hosp:'+',club:'C',estate:'R'}[p.type]||'*'})}}catch(e){}
  for(const t of['stlux','stoff']){const R=cpRooms[t];if(!R||!R.mine)continue;for(const o of scene.children){if(!o.isMesh||o.userData.cpMine)continue;const gb=o.geometry;if(!gb.boundingSphere)gb.computeBoundingSphere();const c=gb.boundingSphere.center;if(Math.abs(c.x+o.position.x-R.x)<10&&Math.abs(c.z+o.position.z)<8.5&&c.y<8)o.visible=false}}}
 for(const d of cpDoors)if(d.a!==d.ta){const s=dt*5.5;d.a=Math.abs(d.ta-d.a)<s?d.ta:d.a+Math.sign(d.ta-d.a)*s;cpDoorSet(d)}
 cpSeqTick(dt);if(cpOvA!==cpOvS){cpOvS=cpOvA;cpFadeEl.style.opacity=cpOvA}
 if(cpIn){for(const f of cpFrz){f.o.copy(f.v);if(f.pc)f.pc.speed=0}cpInTick(dt);
  if(state==='play'&&!cpSeq&&cpDoorCD<=0&&pos.z>6.05&&Math.abs(pos.x-cpIn.room.x)<2.4)cpStartOut()}
 else if(state==='play'&&!driving&&cpDoorCD<=0&&!cpSeq){for(const p of cpPlaces)if(p.door&&Math.abs(pos.x-p.x)<1.25&&pos.z<p.z&&pos.z>p.z-1.6&&vel.z>-1){cpEnter(p);break}}
 if(cpIn||cpSeq){const sh=Math.sin(dayT*Math.PI*2),dv=Math.max(0,Math.min(1,sh*3+.5));cpWinM.color.setRGB(.16+.84*dv,.18+.82*dv,.3+.7*dv);cpStreetM.color.copy(cpWinM.color)}}

// garage in front of the safehouse
const cpGar=(()=>{const p=cpPlace('safe');if(!p)return null;const m=new THREE.Mesh(new THREE.RingGeometry(1.9,2.4,28),new THREE.MeshBasicMaterial({color:0x4a9dff,toneMapped:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(p.x+6,.06,p.z-6.2);scene.add(m);return {m,x:p.x+6,z:p.z-6.2,cd:0,away:true}})();
function cpGarTick(dt){const G=cpGar;if(!G)return;G.m.visible=cpSave.own;if(!cpSave.own)return;G.cd-=dt;const d=Math.hypot(pos.x-G.x,pos.z-G.z);if(d>5)G.away=true;if(d>2.6||G.cd>0||!G.away||state!=='play')return;
 if(driving&&!driving.custom&&!driving.vhT&&!driving.vhBike&&Math.abs(driving.speed)<4&&cpSave.car===null){const c=driving,col=c.m.children[0]&&c.m.children[0].material&&c.m.children[0].material.color?c.m.children[0].material.color.getHex():0xe63946;scene.remove(c.m);const i=cars.indexOf(c);if(i>=0)cars.splice(i,1);driving=null;player.visible=true;pos.set(G.x,.3,G.z+3);cpSave.car=col;cpStore();G.cd=3;G.away=false;toast('Car stored in your garage')}
 else if(!driving&&cpSave.car!==null){const m=makeCar(cpSave.car,.9);m.position.set(G.x,0,G.z);m.rotation.y=Math.PI/2;scene.add(m);cars.push({m,speed:0,steer:0});cpSave.car=null;cpStore();G.cd=3;G.away=false;toast('Your car is out front')}}
// ----- police helicopter -----
const cpHelis=[];let cpHeliCD=3;const cpSR=new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false}),cpSB=new THREE.MeshBasicMaterial({color:0x2050ff,toneMapped:false});
const cpHG=(()=>{const n=0x14213d,w=0xf4f4f4,k=0x1a1a1a;return {body:cpMG([cpB(1.9,1.8,3.6,0,0,0,n),cpB(1.7,1.3,1.3,0,-.1,-2.3,n),cpB(1.5,.75,.8,0,.2,-2.6,0x7fb8e6),cpB(.5,.5,4.4,0,.45,3.9,n),cpB(.14,1.6,1,0,1.1,5.7,w),cpB(1.96,.4,3.2,0,-.25,0,w),cpB(.12,.12,3.6,-.95,-1.5,0,k),cpB(.12,.12,3.6,.95,-1.5,0,k),cpB(.1,.7,.1,-.95,-1.15,-1,k),cpB(.1,.7,.1,.95,-1.15,-1,k),cpB(.1,.7,.1,-.95,-1.15,1,k),cpB(.1,.7,.1,.95,-1.15,1,k),cpB(.3,.6,.3,0,1.2,0,k),cpCy(.32,.3,10,0,-1.05,-1.9,w,Math.PI/2)]),
 rotor:cpMG([cpB(9.4,.06,.36,0,0,0,k),cpB(.36,.06,9.4,0,0,0,k)]),tail:cpB(.06,1.7,.2,0,0,0,k),lamp:new THREE.BoxGeometry(.3,.2,.3)}})();
function cpMakeHeli(){const g=new THREE.Group();g.add(new THREE.Mesh(cpHG.body,cpVM));const r=new THREE.Mesh(cpHG.rotor,cpVM);r.position.y=1.56;g.add(r);const t=new THREE.Mesh(cpHG.tail,cpVM);t.position.set(.22,1.2,5.7);g.add(t);
 const a=new THREE.Mesh(cpHG.lamp,cpSR);a.position.set(-.6,-.95,.8);const b=new THREE.Mesh(cpHG.lamp,cpSB);b.position.set(.6,-.95,.8);g.add(a,b);g.userData={rotor:r,trotor:t};g.scale.setScalar(1.25);return g}
const cpSpot=new THREE.SpotLight(0xdbe9ff,0,80,.17,.5,1.5);scene.add(cpSpot);scene.add(cpSpot.target);
const cpCone=new THREE.Mesh(new THREE.ConeGeometry(6.5,1,24,1,true),new THREE.MeshBasicMaterial({color:0xcfe2ff,transparent:true,opacity:.07,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false}));cpCone.visible=false;cpCone.frustumCulled=false;scene.add(cpCone);
const cpDisc=new THREE.Mesh(new THREE.CircleGeometry(6.5,28),new THREE.MeshBasicMaterial({color:0xcfe2ff,transparent:true,opacity:.14,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));cpDisc.rotation.x=-Math.PI/2;cpDisc.visible=false;scene.add(cpDisc);
function cpHeliSpawn(){const a=Math.random()*6.283,m=cpMakeHeli();m.position.set(pos.x+Math.cos(a)*120,46,pos.z+Math.sin(a)*120);scene.add(m);cpHelis.push({m,hp:42,ang:a,dir:Math.random()<.5?1:-1,rad:24+cpHelis.length*9,alt:30+cpHelis.length*8,cd:3,bn:0,snd:0,down:false,leave:false,vy:0});toast('POLICE HELICOPTER INBOUND')}
function cpHeliDown(h){if(h.down)return;h.down=true;h.vy=2;crime(2);toast('Helicopter hit!');burst(h.m.position,16,0xffaa22,9,.8,.7,1);sfx(.8,600,.8,h.m.position)}
function cpCover(){for(const s of solids)if(s.h>12&&pos.x>s.minX-3.5&&pos.x<s.maxX+3.5&&pos.z>s.minZ-3.5&&pos.z<s.maxZ+3.5)return true;return false}
function cpHeliTick(dt){const act=state==='play'||state==='cpmenu',need=act&&!cpIn?(wanted>=5?2:(wanted>=3?1:0)):0;let alive=0,lead=null;for(const h of cpHelis)if(!h.down&&!h.leave)alive++;
 cpHeliCD-=dt;if(alive<need&&cpHeliCD<=0){cpHeliCD=16;cpHeliSpawn()}
 const tg=driving?driving.m.position:(cpIn&&cpIn.x!==undefined?cpHT.set(cpIn.x,0,cpIn.z-8):pos),flash=Math.sin(T*13)>0;cpSR.color.setRGB(flash?4:.15,0,0);cpSB.color.setRGB(0,0,flash?.15:4);
 for(let i=cpHelis.length-1;i>=0;i--){const h=cpHelis[i],m=h.m,p=m.position;m.userData.rotor.rotation.y+=dt*(h.down?14:32);m.userData.trotor.rotation.x+=dt*45;
  if(h.down){h.vy-=13*dt;p.y+=h.vy*dt;m.rotation.y+=dt*6;m.rotation.z=.4;p.x+=Math.cos(h.ang)*6*dt;p.z+=Math.sin(h.ang)*6*dt;if(Math.random()<.5)burst(p,1,0x333333,2,.9,1,.8);
   let fl=1.5;for(const s of solids)if(s.h>4&&p.x>s.minX&&p.x<s.maxX&&p.z>s.minZ&&p.z<s.maxZ)fl=Math.max(fl,s.h+1.5);if(p.y<=fl){explode(p.clone());crime(2);cash+=500;toast('Helicopter down! +$500');scene.remove(m);cpHelis.splice(i,1)}continue}
  if(!h.leave&&(wanted<3||cpIn||state==='dead'))h.leave=true;if(h.leave&&wanted>=3&&!cpIn&&state==='play')h.leave=false;
  if(h.leave){p.x+=Math.cos(h.ang)*30*dt;p.z+=Math.sin(h.ang)*30*dt;p.y+=6*dt;m.rotation.y=Math.atan2(-Math.cos(h.ang),-Math.sin(h.ang));if(Math.hypot(p.x-pos.x,p.z-pos.z)>240){scene.remove(m);cpHelis.splice(i,1)}continue}
  h.ang+=dt*.42*h.dir;const d=new THREE.Vector3(tg.x+Math.cos(h.ang)*h.rad-p.x,h.alt+(tg.y||0)*.6-p.y,tg.z+Math.sin(h.ang)*h.rad-p.z),L=d.length();if(L>.01)p.addScaledVector(d.normalize(),Math.min(40,L*1.3)*dt);
  let fl=0;for(const s of solids)if(s.h>p.y-6&&p.x>s.minX-4&&p.x<s.maxX+4&&p.z>s.minZ-4&&p.z<s.maxZ+4)fl=Math.max(fl,s.h+7);if(p.y<fl)p.y+=(fl-p.y)*Math.min(1,dt*3);
  m.rotation.y=Math.atan2(-(tg.x-p.x),-(tg.z-p.z));m.rotation.z=.14*h.dir;m.rotation.x=-.12;
  const dist=p.distanceTo(tg);if(dist<130){evade=-.5;if(!lead)lead=h}h.snd-=dt;if(h.snd<=0){h.snd=.12;sfx(.07,230,.3,p)}
  h.cd-=dt;if(h.cd<=0&&dist<80&&state==='play'){if(h.bn<=0)h.bn=wanted>=5?6:4;h.bn--;h.cd=h.bn>0?.13:2.1+Math.random();
   let ch=.24;if(driving&&Math.abs(driving.speed)>18)ch*=.45;if(cpCover())ch*=.3;const o=p.clone().setY(p.y-.8),hit=Math.random()<ch,e=new THREE.Vector3(tg.x,(tg.y||0)+1.4,tg.z);if(!hit)e.add(new THREE.Vector3(cpR(-3,3),0,cpR(-3,3)));tracer(o,e);if(!hit)burst(e.setY(.2),2,0xcccccc,2,.2,.3);sfx(.14,1500,.45,p);if(hit)hurt(4)}}
 const night=1-Math.max(0,Math.min(1,Math.sin(dayT*Math.PI*2)*3+.5));
 if(lead){const p=lead.m.position,gp=new THREE.Vector3(tg.x,.12,tg.z),v=new THREE.Vector3().subVectors(p,gp),L=v.length();cpSpot.position.copy(p);cpSpot.target.position.copy(gp);cpSpot.intensity=.5+night*2;
  cpCone.visible=cpDisc.visible=true;cpCone.position.copy(gp).addScaledVector(v,.5);cpCone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());cpCone.scale.set(1,L,1);cpCone.material.opacity=.02+night*.05;cpDisc.position.copy(gp);cpDisc.material.opacity=.03+night*.08}
 else{cpSpot.intensity=0;cpCone.visible=cpDisc.visible=false}}
{const at=allTargets;allTargets=function(){const o=at();for(const h of cpHelis)if(!h.down)o.push({kind:'heli',obj:h,p:h.m.position.clone(),hostile:true});if(cpMug&&!cpMug.done)o.push({kind:'mug',obj:cpMug,p:cpMug.g.position.clone().setY(1.5),hostile:true});return o}}
{const dm=damage;damage=function(t,dmg){if(t.kind==='heli'){const h=t.obj;h.hp-=dmg;burst(t.p,5,0xffdd66,6,.2,.3);crime(.3);if(h.hp<=0)cpHeliDown(h);return}if(t.kind==='mug'){cpMugEnd(true);return}dm(t,dmg)}}
{const ex=explode;explode=function(p){ex(p);for(const h of cpHelis)if(!h.down&&h.m.position.distanceTo(p)<11)cpHeliDown(h)}}
// ----- SWAT vans, army jeeps, heavier officers -----
const cpWheelG=gT(new THREE.CylinderGeometry(.58,.58,.5,14),0,0,0,0,0,Math.PI/2),cpWheelM=new THREE.MeshStandardMaterial({color:0x0d0d0d,roughness:.95});
function cpMakeVan(kind){const g=new THREE.Group(),army=kind==='army',a=army?0x4b5d2a:0x0e1626,b=army?0x39471f:0xf2f2f2,k=0x1a1a1a;
 const geo=army?[cpB(2.4,1.1,4.8,0,1.15,0,a),cpB(2.3,1,2.4,0,2.15,.6,b),cpB(2.1,.7,.06,0,2.2,-.62,0x223344),cpB(2.5,.35,.3,0,.75,-2.5,k),cpCy(.55,.4,12,0,1.5,2.55,k,Math.PI/2),cpB(.5,.2,.1,-.75,1.35,-2.42,0xfff2c0),cpB(.5,.2,.1,.75,1.35,-2.42,0xfff2c0)]
  :[cpB(2.6,2.4,5,0,1.75,.7,a),cpB(2.5,1.5,1.7,0,1.3,-2.6,a),cpB(2.3,.75,.06,0,1.7,-3.46,0x223344),cpB(2.64,.5,4.6,0,1.7,.7,b),cpB(2.7,.5,.35,0,.7,-3.5,k),cpB(2.2,.9,.1,0,1,-3.52,k),cpB(1.5,.22,.5,0,3.05,-.6,k),cpB(.5,.2,.1,-.8,1.15,-3.47,0xfff2c0),cpB(.5,.2,.1,.8,1.15,-3.47,0xfff2c0)];
 g.add(new THREE.Mesh(cpMG(geo),cpVM));g.children[0].castShadow=true;const red=new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false}),blue=new THREE.MeshBasicMaterial({color:0x2050ff,toneMapped:false});
 if(!army){const r=new THREE.Mesh(cpHG.lamp,red);r.scale.set(2,1.2,1.5);r.position.set(-.45,3.2,-.6);const u=new THREE.Mesh(cpHG.lamp,blue);u.scale.set(2,1.2,1.5);u.position.set(.45,3.2,-.6);g.add(r,u)}
 const wheels=[];for(const [x,z] of[[-1.25,-1.9],[1.25,-1.9],[-1.25,1.9],[1.25,1.9]]){const w=new THREE.Mesh(cpWheelG,cpWheelM);w.position.set(x,.58,z);g.add(w);wheels.push(w)}g.userData={wheels,red,blue,max:army?40:36,kind:kind};return g}
function cpConvert(pc,kind){const o=pc.m,m=cpMakeVan(kind);m.position.copy(o.position);m.rotation.y=o.rotation.y;scene.remove(o);scene.add(m);pc.m=m;pc.hp=kind==='swat'?480:330;pc.cpKind=kind;pc.cpDepN=0}
{const sp=spawnPolice;spawnPolice=function(){const n=police.length;sp();const pc=police[police.length-1];if(!pc||police.length===n)return;if(wanted>=5&&Math.random()<.5)cpConvert(pc,'army');else if(wanted>=4&&Math.random()<.5)cpConvert(pc,'swat')}}
function cpTint(s,army){const g=s.g;s.hp=army?10:9;s.aggro=true;g.userData.rlType='sol';g.userData.rlTint=new THREE.Color(army?0x8fbf6a:0x66708c);const c=g.children[0]&&g.children[0].children[0];if(c&&c.material)c.material.color.set(army?0x4b5d2a:0x15171c)}
function cpSquadTick(){for(const pc of police){if(!pc.cpKind||pc.dead||pc.gone)continue;if(pc.deployed&&!pc.cpDep){pc.cpDep=true;if(pc.cpDepN++>1)continue;const m=pc.m,army=pc.cpKind==='army',n=shooters.length,f=new THREE.Vector3(-Math.sin(m.rotation.y),0,-Math.cos(m.rotation.y));
   const sq=[shooters[n-1],shooters[n-2],makeShooter('cop',m.position.x-f.x*4+f.z*2,m.position.z-f.z*4-f.x*2),makeShooter('cop',m.position.x-f.x*4-f.z*2,m.position.z-f.z*4+f.x*2)];for(const s of sq)if(s&&s.kind==='cop'&&!s.dead)cpTint(s,army);toast(army?'ARMY!':'SWAT TEAM!')}
  if(!pc.deployed)pc.cpDep=false}}
// ----- roadblocks with spike strips -----
let cpRB=null,cpRBcd=10;const cpStrip=new THREE.Mesh(cpMG([cpB(11.5,.07,.7,0,.05,0,0x2a2a2a)].concat(Array.from({length:22},(_,i)=>cpCol(gT(new THREE.ConeGeometry(.09,.3,4),-5.4+i*.51,.24,0),0xd0d0d0)))),cpVM);cpStrip.visible=false;scene.add(cpStrip);
function cpRoadblock(){const m=driving.m,f=new THREE.Vector3(-Math.sin(m.rotation.y),0,-Math.cos(m.rotation.y)),ax=Math.abs(f.x)>Math.abs(f.z),snap=v=>roadCenter(Math.max(0,Math.min(N,Math.round((v+HALF-ROAD/2)/CELL))));
 let x=m.position.x,z=m.position.z;if(ax){z=snap(z);if(Math.abs(z-m.position.z)>5)return;x+=Math.sign(f.x)*92;x=snap(x)-Math.sign(f.x)*CELL/2}else{x=snap(x);if(Math.abs(x-m.position.x)>5)return;z+=Math.sign(f.z)*92;z=snap(z)-Math.sign(f.z)*CELL/2}
 if(Math.abs(x)>HALF-12||Math.abs(z)>HALF-12)return;const dv=ax?Math.abs(x-m.position.x):Math.abs(z-m.position.z);if(dv<30)return;if(cpRB)cpRBclear(true);const list=[];
 for(const o of[-3.4,3.4]){const c=makePoliceCar();c.position.set(ax?x:x+o,0,ax?z+o:z);c.rotation.y=ax?(o>0?0:Math.PI):(o>0?Math.PI/2:-Math.PI/2);scene.add(c);const e={m:c,speed:0,steer:0,hp:150,cpBlock:true};cars.push(e);list.push(e);makeShooter('cop',c.position.x+(ax?-2.5*Math.sign(f.x):0),c.position.z+(ax?0:-2.5*Math.sign(f.z))).aggro=true}
 const sx=ax?x-Math.sign(f.x)*11:x,sz=ax?z:z-Math.sign(f.z)*11;cpStrip.position.set(sx,0,sz);cpStrip.rotation.y=ax?Math.PI/2:0;cpStrip.visible=true;cpRB={list,x:sx,z:sz,ax,t:T};toast('ROADBLOCK AHEAD')}
function cpRBclear(force){const r=cpRB;if(!r)return;if(!force&&(T-r.t<40||Math.hypot(r.x-pos.x,r.z-pos.z)<120))return;for(const e of r.list){if(e===driving)continue;scene.remove(e.m);const i=cars.indexOf(e);if(i>=0)cars.splice(i,1)}cpStrip.visible=false;cpRB=null}
function cpRBTick(dt){cpRBcd-=dt;const c=driving,land=c&&!c.custom&&!c.vhT&&!c.cpBlock;if(land&&wanted>=4&&Math.abs(c.speed)>16&&cpRBcd<=0&&state==='play'){cpRBcd=24;cpRoadblock()}cpRBclear(false);
 if(land&&cpRB&&!c.cpSpiked){const a=cpRB.ax?c.m.position.x-cpRB.x:c.m.position.z-cpRB.z,b=cpRB.ax?c.m.position.z-cpRB.z:c.m.position.x-cpRB.x;if(Math.abs(a)<1.6&&Math.abs(b)<6.2&&!c.vhBike){c.cpSpiked=Math.random()<.5?1:-1;toast('TIRES BLOWN!');sfx(.3,1800,.7);shake=.4}}
 if(land&&c.cpSpiked){c.speed=Math.max(-6,Math.min(13,c.speed));c.m.rotation.y+=c.cpSpiked*.3*dt*Math.min(1,Math.abs(c.speed)/6);if(Math.abs(c.speed)>5&&Math.random()<.4)burst(c.m.position.clone().setY(.2),1,0xffcc55,3,.12,.2)}}
// ----- BUSTED -----
let cpBustT=0,cpBustEnd=0;
function cpBustTick(dt){if(state==='cpbust'){if(T>=cpBustEnd){const fine=Math.round(cash*.1);cash-=fine;WEAP[1].ammo=WEAP[2].ammo=WEAP[3].ammo=0;wi=0;wantedScore=0;wanted=0;evade=0;for(const s of shooters)if(s.kind==='cop'){s.dead=true;s.gone=true;s.g.visible=false}for(const pc of police)pc.gone=true;
   const p=cpPlace('police');if(p){pos.set(p.x,.3,p.z-3);camYaw=Math.PI}vel.set(0,0,0);state='play';toast('Fined $'+fine+'. Weapons confiscated')}return}
 if(state!=='play'||driving||cpIn||wanted<1||wanted>2){cpBustT=0;return}let near=null,nd=1e9;for(const s of shooters)if(s.kind==='cop'&&!s.dead){const d=Math.hypot(s.g.position.x-pos.x,s.g.position.z-pos.z);if(d<nd){nd=d;near=s}if(wanted===1&&T-cpShotAt>3)s.cd=Math.max(s.cd,.6)}
 const still=Math.hypot(vel.x,vel.z)<2;if(near&&still&&nd<14&&nd>2.2){const g=near.g;g.position.x+=(pos.x-g.position.x)/nd*6.5*dt;g.position.z+=(pos.z-g.position.z)/nd*6.5*dt}
 if(near&&still&&nd<3.2){cpBustT+=dt;if(cpBustT>2){cpBustT=0;state='cpbust';cpBustEnd=T+3;cpBanner('BUSTED','#4f8dff','10% fine, weapons confiscated',3);sfx(.5,500,.5)}}else cpBustT=Math.max(0,cpBustT-dt)}
// ----- cash drops -----
const cpCash=[],cpCashG=new THREE.BoxGeometry(.55,.3,.3),cpCashM=new THREE.MeshBasicMaterial({color:0x6dff8a,toneMapped:false});
function cpDrop(p,amt){if(cpCash.length>24)return;const m=new THREE.Mesh(cpCashG,cpCashM);m.position.set(p.x+cpR(-.8,.8),.7,p.z+cpR(-.8,.8));scene.add(m);cpCash.push({m,amt:Math.round(amt),t:40})}
{const kp=killPed;killPed=function(q,from){const w=q.userData.dead;kp(q,from);if(!w&&q.userData.dead&&Math.random()<.7)cpDrop(q.position,cpR(10,60))};const ks=killShooter;killShooter=function(s,from){const w=s.dead;ks(s,from);if(!w&&s.dead)cpDrop(s.g.position,s.kind==='gang'?cpR(40,150):cpR(15,40))}}
function cpCashTick(dt){for(let i=cpCash.length-1;i>=0;i--){const c=cpCash[i];c.t-=dt;c.m.rotation.y+=dt*3;if(Math.hypot(c.m.position.x-pos.x,c.m.position.z-pos.z)<(driving?3:1.7)&&state==='play'){cash+=c.amt;toast('+$'+c.amt);c.t=0}if(c.t<=0){scene.remove(c.m);cpCash.splice(i,1)}}
 for(const q of peds){const u=q.userData;if(u.cpPan>0){u.cpPan-=dt;if(u.cpPan<=0&&!u.dead)u.path.spd=u.cpSpd||1}}}
// ----- street event: mugger -----
let cpMug=null,cpMugCD=55;
function cpMugEnd(win){const M=cpMug;if(!M||M.done)return;M.done=true;M.t=5;if(win){M.g.rotation.x=-Math.PI/2;cash+=250;cpBanner('MUGGER STOPPED','#3ddc84','+$250 reward',2)}else toast('The mugger got away')}
function cpMugTick(dt){if(!cpMug){cpMugCD-=dt;if(cpMugCD<=0&&state==='play'&&!cpIn&&wanted===0&&Math.abs(pos.x)<HALF-30&&Math.abs(pos.z)<HALF-30){cpMugCD=cpR(80,130);const a=Math.random()*6.283,g=makePerson(0x222222,0x111111,0xc68642);g.position.set(pos.x+Math.cos(a)*24,.3,pos.z+Math.sin(a)*24);collide(g.position,.5);
   const bag=new THREE.Mesh(new THREE.BoxGeometry(.5,.45,.3),new THREE.MeshStandardMaterial({color:0x8a5a2b}));bag.position.set(.5,1.1,0);g.add(bag);scene.add(g);cpMug={g,t:24,w:0,done:false};toast('MUGGER! Stop him for a reward')}return}
 const M=cpMug,g=M.g;M.t-=dt;if(M.done){if(M.t<=0){scene.remove(g);cpMug=null}return}
 const dx=g.position.x-pos.x,dz=g.position.z-pos.z,d=Math.hypot(dx,dz)||1;g.position.x+=dx/d*7.6*dt;g.position.z+=dz/d*7.6*dt;if(collide(g.position,.45)){g.position.x+=-dz/d*5*dt;g.position.z+=dx/d*5*dt}g.rotation.y=Math.atan2(-dx,-dz);M.w+=dt*10;animLimbs(g,7,M.w);
 if(d<(driving?3.2:2.1))cpMugEnd(true);else if(M.t<=0||d>95)cpMugEnd(false)}
// ----- stunt ramps -----
const cpRamps=[[roadCenter(3)+3.3,roadCenter(4)+CELL/2,0],[roadCenter(7)-3.3,roadCenter(5)+CELL/2,Math.PI],[roadCenter(5)+CELL/2,roadCenter(2)-3.3,-Math.PI/2],[roadCenter(4)+CELL/2,roadCenter(8)+3.3,Math.PI/2]],cpAirC=[];
{const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(7,0);sh.lineTo(7,1.9);sh.closePath();const gs=[];for(const r of cpRamps){let g=new THREE.ExtrudeGeometry(sh,{depth:5,bevelEnabled:false});g.translate(-3.5,0,-2.5);g.rotateY(Math.PI/2);g.rotateY(r[2]);g.translate(r[0],.02,r[1]);gs.push(cpCol(g,0xffc21a))}
 const m=new THREE.Mesh(cpMG(gs),cpVM);m.castShadow=true;scene.add(m)}
function cpRampTick(dt){const c=driving;if(c&&!c.custom&&!c.vhT&&!c.cpAir&&c.speed>24&&state==='play'){const m=c.m,fx=-Math.sin(m.rotation.y),fz=-Math.cos(m.rotation.y);for(const r of cpRamps){const rx=-Math.sin(r[2]),rz=-Math.cos(r[2]),dx=m.position.x-r[0],dz=m.position.z-r[1],al=dx*rx+dz*rz,ac=Math.abs(dx*rz-dz*rx);
   if(al>-1.5&&al<3.5&&ac<2.7&&fx*rx+fz*rz>.75){c.cpAir={vy:c.speed*.38,x:m.position.x,z:m.position.z};cpAirC.push(c);toast('STUNT JUMP!');sfx(.3,900,.4);break}}}
 for(let i=cpAirC.length-1;i>=0;i--){const c=cpAirC[i],a=c.cpAir,m=c.m;m.position.y+=a.vy*dt;a.vy-=27*dt;m.rotation.x=Math.max(-.35,Math.min(.35,a.vy*.018));if(m.position.y<=0){m.position.y=0;m.rotation.x=0;c.cpAir=null;cpAirC.splice(i,1);if(c===driving){const b=Math.round(Math.hypot(m.position.x-a.x,m.position.z-a.z))*12;cash+=b;shake=.5;cpBanner('STUNT BONUS','#ffc21a','+$'+b,1.8)}}}}
// ----- phone -----
const cpPh=document.createElement('div');cpPh.className='btn';cpPh.textContent='☰';cpPh.style.cssText='left:86px;top:calc(env(safe-area-inset-top,0px) + 44px);width:34px;height:34px;font-size:18px;border-width:2px;background:#0008';document.body.appendChild(cpPh);
function cpPhone(){const L=(c,t)=>'<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#'+c.toString(16).padStart(6,'0')+';margin:0 6px 0 10px"></span>'+t;
 cpOpen('<div style="font-size:22px;color:#ffd23f">PHONE</div>Cash $'+cash+' &nbsp; Kills '+kills+' &nbsp; Wanted '+wanted+'★<br>'+(typeof msPassed!=='undefined'?'Jobs passed '+msPassed+' &nbsp; Best streak '+msBest+'<br>':'')+'Safehouse: '+(cpSave.own?'owned'+(cpSave.car!==null?' (car in garage)':''):'not owned ($5,000)')+
 '<div style="margin-top:8px;color:#ffd23f">MAP</div>'+L(0x3ddc84,'Store')+L(0x5fe3ff,'Jewelry')+L(0xffc93c,'Bank')+'<br>'+L(0x4a9dff,'Safehouse')+L(0x5a7dff,'Police')+L(0xff4d6d,'Hospital')+L(0xff3df2,'Club')+
 '<div style="margin-top:8px;font-weight:500;font-size:13px">Rob a store: walk in through the door and FIRE (left click on a laptop) near the clerk. The clerk empties the till onto the counter; stay until the cash comes to you, or run early with part of it. Some clerks pull a shotgun: shoot back, then grab the till yourself. 3 stars brings a helicopter, 4 SWAT and roadblocks, 5 the army. Stand still near a cop at 1 or 2 stars and you get busted.</div>'+cpBtn('x','CLOSE')+cpBtn('r','RESPAWN','#ff8a80'),k=>{cpClose();if(k==='r'&&state==='play'){if(driving){driving.speed=0;driving=null;player.visible=true}respawn()}})}
cpPh.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(state==='play')cpPhone()},{passive:false});
// ----- main tick -----
MODS.push(function(dt){cpDoorCD-=dt;cpHeliTick(dt);cpSquadTick();cpRBTick(dt);cpBustTick(dt);cpCashTick(dt);cpMugTick(dt);cpRampTick(dt);cpGarTick(dt);
 cpIntTick(dt)});
