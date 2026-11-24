// ---------- map: radar with water + fog of war, full-screen labelled map with pan/zoom, waypoint ----------
const mpX0=-HALF-272,mpX1=HALF+650,mpZ0=-HALF-262,mpZ1=HALF+380,mpCell=16,mpSK=1.25;
const mpCols=Math.ceil((mpX1-mpX0)/mpCell),mpRows=Math.ceil((mpZ1-mpZ0)/mpCell);
const mpFog=new Uint8Array(mpCols*mpRows),mpPlay=new Uint8Array(mpCols*mpRows);
const mpIcons=[],mpLabels=[];   // other modules may push: mpIcons {x,z,label,color,glyph,obj?}  mpLabels {x,z,text,size(0 small,1 district,2 region),hidden?}
const mpHasLand=typeof ldLandOK==='function',mpHasAp=typeof apAX!=='undefined',mpHasPier=typeof wdPX0!=='undefined';
let mpOpen=false,mpWay=null,mpK=1.15,mpCX=0,mpCZ=0,mpDirty=false,mpSeen=0,mpTotal=0,mpLegendOn=false,mpW=300,mpH=300,mpDpr=1,mpRevT=0,mpSaveT=15,mpDrawT=0;
const mpParks=[[5,5],[1,8],[8,1],[2,2],[8,6],[4,9]];
function mpZone(x,z){if(Math.abs(x)>HALF||Math.abs(z)>HALF)return 'out';const i=Math.max(0,Math.min(N-1,Math.floor((x+HALF)/CELL))),j=Math.max(0,Math.min(N-1,Math.floor((z+HALF)/CELL)));if(i>=N-2)return 'beach';if(i<=1)return 'sub';return Math.hypot(roadCenter(i)+CELL/2,roadCenter(j)+CELL/2)<HALF*.4?'down':'mid'}
// draws the whole world in world units (the context is already transformed); b = optional [x0,z0,x1,z1] to skip buildings outside the view
function mpDrawWorld(g,b){const BIG=1800,zh=(mpZ1-mpZ0)+BIG*2;
 g.fillStyle='#3d7a43';g.fillRect(mpX0-BIG,mpZ0-BIG,(mpX1-mpX0)+BIG*2,zh);
 if(mpHasAp){g.fillStyle='#4f8f52';g.fillRect(apAX-252,-172,238,344)}
 if(mpHasLand){g.fillStyle='#8f8058';g.fillRect(-HALF-40,HALF+40,SIZE+80,170);g.fillStyle='#7c6d49';for(let k=0;k<9;k++){g.beginPath();g.ellipse(-HALF+30+k*72,HALF+95+(k%3)*28,46,24,0,0,7);g.fill()}g.fillStyle='#a3956c';for(let k=0;k<8;k++){g.beginPath();g.ellipse(-HALF+66+k*72,HALF+150-(k%2)*30,30,14,0,0,7);g.fill()}
  g.fillStyle='#6f7552';g.fillRect(-170,-HALF-240,340,220);g.strokeStyle='#23261a';g.lineWidth=2.5;g.strokeRect(-170,-HALF-240,340,220);g.fillStyle='#565a61';g.fillRect(-7,-HALF-22,14,24)}
 g.fillStyle='#e2d29a';g.fillRect(HALF,mpZ0-BIG,42,zh);g.fillStyle='#2f86d6';g.fillRect(HALF+40,mpZ0-BIG,BIG*2,zh);g.fillStyle='#4a9be6';g.fillRect(HALF+40,mpZ0-BIG,7,zh);
 if(mpHasAp){g.fillStyle='#777b80';g.fillRect(apAX-134,-120,64,270);g.fillStyle='#3a3d42';g.fillRect(apTX-6,-150,12,300);for(const z of[-140,0,140])g.fillRect(apRX+12,z-6,32,12);g.fillRect(apAX-70,74,70,14);
  g.fillStyle='#222428';g.fillRect(apRX-12,-150,24,300);g.fillStyle='#fff';for(let z=-120;z<=120;z+=40)g.fillRect(apRX-.6,z-8,1.2,16)}
 g.fillStyle='#565a61';g.fillRect(-HALF,-HALF,SIZE,SIZE);
 const bc={mid:'#8a9094',down:'#7d8b9a',beach:'#cdb5a8',sub:'#8fae7f'};
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){const x=roadCenter(i)+ROAD/2,z=roadCenter(j)+ROAD/2;let park=false;for(const p of mpParks)if(p[0]===i&&p[1]===j)park=true;g.fillStyle=park?'#49b356':bc[mpZone(x+BLOCK/2,z+BLOCK/2)];g.fillRect(x,z,BLOCK,BLOCK)}
 if(mpHasPier){g.fillStyle='#8a6b45';g.fillRect(wdPX0,wdPZ-4.5,wdPX2-14-wdPX0,9);g.fillRect(wdPX2-14,wdPZ-8,14,16)}
 if(typeof isMapShapes!=='undefined'){try{for(const q of isMapShapes){g.fillStyle=q.c;g.strokeStyle=q.c;if(q.k==='e'){g.beginPath();g.ellipse(q.x,q.z,q.a,q.b,0,0,7);g.fill()}else if(q.k==='r')g.fillRect(q.x-q.a,q.z-q.b,q.a*2,q.b*2);else if(q.k==='c'){g.beginPath();g.arc(q.x,q.z,q.a,0,7);g.fill()}else if(q.k==='b'){g.lineWidth=q.w||6;g.beginPath();g.moveTo(q.x0,q.z0);g.lineTo(q.x1,q.z1);g.stroke()}}}catch(e){}}
 const sc={mid:'#c6c9cf',down:'#a3bbd4',beach:'#f3c3d3',sub:'#e6d2b0',out:'#b9bcc2'};let last='';
 for(const s of solids){if(s.h<=4)continue;if(b&&(s.maxX<b[0]||s.minX>b[2]||s.maxZ<b[1]||s.minZ>b[3]))continue;const c=sc[mpZone((s.minX+s.maxX)/2,(s.minZ+s.maxZ)/2)];if(c!==last){g.fillStyle=c;last=c}g.fillRect(s.minX,s.minZ,s.maxX-s.minX,s.maxZ-s.minZ)}}
const mpStatic=document.createElement('canvas');
function mpBuildStatic(){mpStatic.width=Math.round((mpX1-mpX0)*mpSK);mpStatic.height=Math.round((mpZ1-mpZ0)*mpSK);const g=mpStatic.getContext('2d');g.setTransform(mpSK,0,0,mpSK,-mpX0*mpSK,-mpZ0*mpSK);mpDrawWorld(g)}
mpBuildStatic();
// ----- fog of war -----
const mpFogC=document.createElement('canvas');mpFogC.width=mpCols;mpFogC.height=mpRows;const mpFogG=mpFogC.getContext('2d');
function mpFogPaint(){mpFogG.clearRect(0,0,mpCols,mpRows);mpFogG.fillStyle='rgba(6,9,16,.9)';mpFogG.fillRect(0,0,mpCols,mpRows);mpSeen=0;for(let i=0;i<mpFog.length;i++)if(mpFog[i]){mpFogG.clearRect(i%mpCols,Math.floor(i/mpCols),1,1);if(mpPlay[i])mpSeen++}}
{for(let r=0;r<mpRows;r++)for(let c=0;c<mpCols;c++){const x=mpX0+(c+.5)*mpCell,z=mpZ0+(r+.5)*mpCell;let p=(Math.abs(x)<=HALF+30&&Math.abs(z)<=HALF+30)||(x>HALF&&x<HALF+112&&Math.abs(z)<=HALF+30);if(mpHasAp&&x>apAX-252&&x<apAX&&Math.abs(z)<172)p=true;if(mpHasLand&&((Math.abs(x)<170&&z>-HALF-240&&z<-HALF)||(Math.abs(x)<HALF&&z>HALF&&z<HALF+200)))p=true;if(p){mpPlay[r*mpCols+c]=1;mpTotal++}}}
function mpReveal(x,z,r){let n=0;const c0=Math.max(0,Math.floor((x-r-mpX0)/mpCell)),c1=Math.min(mpCols-1,Math.floor((x+r-mpX0)/mpCell)),r0=Math.max(0,Math.floor((z-r-mpZ0)/mpCell)),r1=Math.min(mpRows-1,Math.floor((z+r-mpZ0)/mpCell));
 for(let rr=r0;rr<=r1;rr++)for(let c=c0;c<=c1;c++){const i=rr*mpCols+c;if(mpFog[i])continue;if(Math.hypot(mpX0+(c+.5)*mpCell-x,mpZ0+(rr+.5)*mpCell-z)<=r){mpFog[i]=1;mpFogG.clearRect(c,rr,1,1);n++;if(mpPlay[i])mpSeen++}}
 if(n)mpDirty=true;return n}
function mpSeenAt(x,z){const c=Math.floor((x-mpX0)/mpCell),r=Math.floor((z-mpZ0)/mpCell);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const cc=c+a,rr=r+b;if(cc>=0&&rr>=0&&cc<mpCols&&rr<mpRows&&mpFog[rr*mpCols+cc])return true}return false}
function mpPct(){return mpTotal?Math.min(100,Math.round(mpSeen/mpTotal*100)):0}
function mpSave(){try{let s='';for(let i=0;i<mpFog.length;i+=8){let v=0;for(let k=0;k<8;k++)if(mpFog[i+k])v|=1<<k;s+=String.fromCharCode(v)}localStorage.setItem('blockcity_map',JSON.stringify({v:1,c:mpCols,r:mpRows,d:btoa(s),w:mpWay,h:localStorage.getItem('blockcity_save')!==null}));mpDirty=false}catch(e){}}
function mpLoad(){try{const o=JSON.parse(localStorage.getItem('blockcity_map')||'null');if(!o||o.c!==mpCols||o.r!==mpRows)return;
  if(o.h&&localStorage.getItem('blockcity_save')===null){localStorage.removeItem('blockcity_map');return}   // game save was wiped: start the map over too
  const s=atob(o.d);for(let i=0;i<mpFog.length;i++)mpFog[i]=(s.charCodeAt(i>>3)>>(i&7))&1;if(o.w&&typeof o.w.x==='number')mpWay={x:o.w.x,z:o.w.z}}catch(e){}}
function mpResetFog(){mpFog.fill(0);mpFogPaint();mpWay=null;mpDirty=true;mpSave()}
mpLoad();mpFogPaint();mpReveal(pos.x,pos.z,55);
// ----- icons and labels -----
if(typeof msShops!=='undefined')for(const s of msShops)mpIcons.push({x:s.x,z:s.z,label:s.kind==='gun'?'Gun shop':(s.kind==='body'?'Body shop':'Clinic'),color:s.css,glyph:s.kind==='gun'?'G':(s.kind==='body'?'S':'+')});
if(typeof vhHelis!=='undefined')for(const h of vhHelis)mpIcons.push({x:h.m.position.x,z:h.m.position.z,label:'Helipad',color:'#ffd23f',glyph:'H'});
if(typeof vhBoats!=='undefined')for(const b of vhBoats)mpIcons.push({obj:b.m,x:0,z:0,label:'Boat',color:'#7fd4ff',glyph:'B',ent:b});
if(mpHasAp)mpIcons.push({x:apAX-36,z:81,label:'Airport',color:'#e8f4ff',glyph:'A'});
const mpSp=t=>t.split('').join('  ');
{const L=(x,z,text,size,q)=>mpLabels.push({x,z,text,size,q:q||null});const pc=(i,j)=>[roadCenter(i)+CELL/2,roadCenter(j)+CELL/2];
 L(roadCenter(5)+CELL/2,roadCenter(4)+CELL/2-4,'DOWNTOWN',1);L(roadCenter(10)-2,roadCenter(3)+CELL/2,'CORAL BEACH',1);L(roadCenter(1),roadCenter(5)+CELL/2,'PALM HOLLOW',1);
 L(roadCenter(5)+CELL/2,roadCenter(1),'NORTHGATE',1);L(roadCenter(6),roadCenter(9)+CELL/2+6,'SOUTH MARKET',1);L(roadCenter(8),roadCenter(5)-4,'LITTLE NEON',1);L(roadCenter(3),roadCenter(4),'MIDTOWN WEST',1);
 if(typeof turf!=='undefined'&&turf.length){let x=0,z=0;for(const t of turf){x+=t[0];z+=t[1]}L(x/turf.length,z/turf.length,'VIOLET ROW',1)}
 const pn=['Fountain Park','Heron Park','Bayside Green','Oak Common','Arcade Gardens','Southfield Park'];mpParks.forEach((p,k)=>{const c=pc(p[0],p[1]);L(c[0],c[1]+15,pn[k],0)});
 L(HALF+118,roadCenter(8),'AZURE BAY',2);if(mpHasPier)L((wdPX0+wdPX2)/2,wdPZ-14,'Sunset Pier',0);
 if(mpHasAp)L(apAX-130,-186,'BLOCK CITY AIRPORT',2,'???');
 if(mpHasLand){L(0,-HALF-128,'RESTRICTED AREA',2,'???');L(0,HALF+122,'STARGAZER HILLS',2,'???')}}
const mpAve=['Marlin Ave','Coral Way','Palmetto Ave','Flamingo Dr','Neon Blvd','Vista Ave','Grand Central Ave','Starlight Blvd','Pelican Ave','Tangerine Ave','Seabreeze Dr','Ocean Front Dr'];
const mpOrd=n=>n+(n%10===1&&n!==11?'st':(n%10===2&&n!==12?'nd':(n%10===3&&n!==13?'rd':'th')))+' St';
// ----- radar (minimap) -----
{const dm=drawMap,noop=function(){},P=CanvasRenderingContext2D.prototype,skip={'#aaaaaa':1,'#555555':1,'#2e6b33':1,'#777b80':1,'#3a3d42':1,'#222428':1};
 const filt=function(x,y,w,h){const f=this.fillStyle;if(skip[f]||(f==='#ffffff'&&Math.min(Math.abs(w),Math.abs(h))<2.2))return;P.fillRect.call(this,x,y,w,h)};
 drawMap=function(){const g=mapC;if(typeof fxBig!=='undefined'&&fxBig){dm();return}const S=260,sc=S/215,R0=S/2,th=camYaw;
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,S,S);g.save();g.beginPath();g.arc(R0,R0,R0,0,7);g.clip();g.fillStyle='#3d7a43';g.fillRect(0,0,S,S);
  g.translate(R0,R0);g.rotate(th);g.translate(-pos.x*sc,-pos.z*sc);g.fillStyle='#2f86d6';g.fillRect((HALF+40)*sc,(pos.z-400)*sc,2400*sc,800*sc);
  const R=160,ax=Math.max(mpX0,pos.x-R),bx=Math.min(mpX1,pos.x+R),az=Math.max(mpZ0,pos.z-R),bz=Math.min(mpZ1,pos.z+R);
  if(bx>ax+1&&bz>az+1){g.drawImage(mpStatic,(ax-mpX0)*mpSK,(az-mpZ0)*mpSK,(bx-ax)*mpSK,(bz-az)*mpSK,ax*sc,az*sc,(bx-ax)*sc,(bz-az)*sc);
   g.imageSmoothingEnabled=true;g.drawImage(mpFogC,(ax-mpX0)/mpCell,(az-mpZ0)/mpCell,(bx-ax)/mpCell,(bz-az)/mpCell,ax*sc,az*sc,(bx-ax)*sc,(bz-az)*sc)}
  g.restore();
  g.clearRect=noop;g.fillRect=filt;try{dm()}finally{delete g.clearRect;delete g.fillRect}
  if(mpWay){let dx=(mpWay.x-pos.x)*sc,dz=(mpWay.z-pos.z)*sc,X=dx*Math.cos(th)-dz*Math.sin(th),Y=dx*Math.sin(th)+dz*Math.cos(th);const d=Math.hypot(X,Y),m=R0-15;if(d>m){X*=m/d;Y*=m/d}
   g.save();g.translate(R0+X,R0+Y);g.rotate(Math.PI/4);g.fillStyle='#ff3df0';g.strokeStyle='#fff';g.lineWidth=2.5;g.fillRect(-7,-7,14,14);g.strokeRect(-7,-7,14,14);g.restore()}
  const nx=R0+Math.sin(th)*(R0-14),ny=R0-Math.cos(th)*(R0-14);g.fillStyle='rgba(10,14,22,.85)';g.beginPath();g.arc(nx,ny,12,0,7);g.fill();g.fillStyle='#ff5a4d';g.font='bold 17px -apple-system,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('N',nx,ny+1)}}
// ----- full map overlay -----
{const st=document.createElement('style');st.textContent='#mpWrap{position:fixed;left:0;top:0;right:0;bottom:0;z-index:80;display:none;background:rgba(4,7,12,.84);font-family:-apple-system,system-ui,sans-serif;color:#fff;-webkit-user-select:none;user-select:none}#mpC{position:absolute;left:10px;top:10px;border-radius:16px;box-shadow:0 0 0 2px rgba(255,255,255,.3),0 10px 40px rgba(0,0,0,.6);background:#0b1016}.mpB{position:absolute;width:46px;height:46px;border-radius:14px;background:rgba(14,21,32,.82);border:1.5px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:23px;color:#fff;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}#mpHead{position:absolute;left:calc(env(safe-area-inset-left,0px) + 22px);top:22px;font-weight:900;font-size:15px;letter-spacing:2px;text-shadow:0 1px 4px #000;pointer-events:none;background:rgba(14,21,32,.78);border:1.5px solid rgba(255,255,255,.25);border-radius:14px;padding:8px 13px}#mpHead small{display:block;font-size:11px;letter-spacing:1px;color:#9fd0ff;font-weight:700;margin-top:2px}#mpHint{position:absolute;left:0;right:0;bottom:18px;text-align:center;font-size:11px;font-weight:700;color:#ffffffb0;text-shadow:0 1px 3px #000;pointer-events:none}body.in-kbm #mpHint .mpTc,body:not(.in-kbm) #mpHint .mpKb{display:none}body.in-kbm #mpC{cursor:grab}body.in-kbm #mpC:active{cursor:grabbing}body.in-kbm .mpB{cursor:pointer}#mpLeg{position:absolute;left:calc(env(safe-area-inset-left,0px) + 22px);bottom:70px;background:rgba(14,21,32,.9);border:1.5px solid rgba(255,255,255,.3);border-radius:14px;padding:10px 12px;font-size:12px;font-weight:700;display:none;max-height:60%;overflow:hidden;columns:2;column-gap:16px}#mpLeg div{display:flex;align-items:center;margin:3px 0;break-inside:avoid}#mpLeg i{display:inline-flex;width:18px;height:18px;border-radius:50%;margin-right:7px;align-items:center;justify-content:center;font-style:normal;font-size:10px;font-weight:900;color:#111;border:1.5px solid #000}';document.head.appendChild(st)}
const mpWrap=document.createElement('div');mpWrap.id='mpWrap';
mpWrap.innerHTML='<canvas id="mpC"></canvas><div id="mpHead">BLOCK CITY<small id="mpPc"></small></div><div id="mpHint"><span class="mpTc">Drag to move &middot; pinch or +/&minus; to zoom &middot; tap to set a waypoint</span><span class="mpKb">Drag to move &middot; scroll wheel or +/&minus; to zoom &middot; click to set a waypoint &middot; M or Esc to close</span></div><div id="mpLeg"></div>'+
 '<div class="mpB" id="mpX" style="right:calc(env(safe-area-inset-right,0px) + 22px);top:22px">&#10005;</div><div class="mpB" id="mpZi" style="right:calc(env(safe-area-inset-right,0px) + 22px);top:50%;margin-top:-52px">+</div><div class="mpB" id="mpZo" style="right:calc(env(safe-area-inset-right,0px) + 22px);top:50%;margin-top:6px">&minus;</div>'+
 '<div class="mpB" id="mpMe" style="right:calc(env(safe-area-inset-right,0px) + 22px);bottom:22px;font-size:20px">&#9678;</div><div class="mpB" id="mpLg" style="left:calc(env(safe-area-inset-left,0px) + 22px);bottom:22px;width:auto;padding:0 14px;font-size:12px;letter-spacing:1px">LEGEND</div>';
document.body.appendChild(mpWrap);
const mpCv=document.getElementById('mpC'),mpG=mpCv.getContext('2d');
function mpClamp(){const ww=mpX1-mpX0,wh=mpZ1-mpZ0,kmin=Math.min(mpW/ww,mpH/wh);mpK=Math.max(kmin,Math.min(6,mpK));const hw=mpW/2/mpK,hh=mpH/2/mpK;mpCX=hw*2>=ww?(mpX0+mpX1)/2:Math.max(mpX0+hw,Math.min(mpX1-hw,mpCX));mpCZ=hh*2>=wh?(mpZ0+mpZ1)/2:Math.max(mpZ0+hh,Math.min(mpZ1-hh,mpCZ))}
function mpResize(){mpW=Math.max(120,innerWidth-20);mpH=Math.max(120,innerHeight-20);mpDpr=Math.min(devicePixelRatio||1,2);mpCv.style.width=mpW+'px';mpCv.style.height=mpH+'px';mpCv.width=Math.round(mpW*mpDpr);mpCv.height=Math.round(mpH*mpDpr);mpClamp()}
function mpText(g,t,x,y,fill,sw){g.lineWidth=sw||3;g.strokeStyle='rgba(8,12,20,.85)';g.lineJoin='round';g.strokeText(t,x,y);g.fillStyle=fill;g.fillText(t,x,y)}
function mpDot(g,x,y,r,col,gl){g.beginPath();g.arc(x,y,r,0,7);g.fillStyle=col;g.fill();g.lineWidth=1.8;g.strokeStyle='#05080d';g.stroke();if(gl){g.fillStyle='#10151c';g.font='900 '+Math.round(r*1.25)+'px -apple-system,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(gl,x,y+.5)}}
function mpDraw(){const g=mpG,W=mpW,H=mpH,k=mpK,F='-apple-system,system-ui,sans-serif';g.setTransform(mpDpr,0,0,mpDpr,0,0);g.fillStyle='#0b1016';g.fillRect(0,0,W,H);
 const sx=x=>(x-mpCX)*k+W/2,sy=z=>(z-mpCZ)*k+H/2,on=(x,y,m)=>x>-m&&y>-m&&x<W+m&&y<H+m;
 g.save();g.translate(W/2,H/2);g.scale(k,k);g.translate(-mpCX,-mpCZ);g.beginPath();g.rect(mpX0,mpZ0,mpX1-mpX0,mpZ1-mpZ0);g.clip();
 if(k<mpSK*.95){g.imageSmoothingEnabled=true;g.drawImage(mpStatic,mpX0,mpZ0,mpX1-mpX0,mpZ1-mpZ0)}else mpDrawWorld(g,[mpCX-W/2/k,mpCZ-H/2/k,mpCX+W/2/k,mpCZ+H/2/k]);
 g.imageSmoothingEnabled=true;g.drawImage(mpFogC,mpX0,mpZ0,mpCols*mpCell,mpRows*mpCell);g.restore();
 g.textAlign='center';g.textBaseline='middle';
 // street names when zoomed in
 if(k>=1.7){g.font='700 10px '+F;for(let i=0;i<=N;i++){const rc=roadCenter(i);for(let j=1;j<N;j+=2){const m=roadCenter(j)+CELL/2;let X=sx(rc),Y=sy(m);if(on(X,Y,40)&&mpSeenAt(rc,m)){g.save();g.translate(X,Y);g.rotate(-Math.PI/2);mpText(g,mpAve[i]||'',0,0,'#f2f5fa',2.5);g.restore()}
    X=sx(m-CELL);Y=sy(rc);if(on(X,Y,40)&&mpSeenAt(m-CELL,rc))mpText(g,mpOrd(i+1),X,Y,'#f2f5fa',2.5)}}}
 // labels
 for(const l of mpLabels){if(l.hidden)continue;const X=sx(l.x),Y=sy(l.z);if(!on(X,Y,90))continue;const seen=mpSeenAt(l.x,l.z);if(!seen&&!l.q)continue;if(l.size===0&&k<1.05)continue;
  if(l.size===0){g.font='italic 700 11px '+F;mpText(g,seen?l.text:l.q,X,Y,'#d9ffd9',2.5)}else{g.font='900 '+Math.round((l.size===2?15:13)*Math.max(.72,Math.min(1.25,k/.85)))+'px '+F;mpText(g,mpSp(seen?l.text:l.q),X,Y,l.text==='AZURE BAY'?'#cfe9ff':(l.size===2?'#ffe9a8':'#ffffff'),3.5)}}
 // icons
 const big=k>=1.5;for(const ic of mpIcons){if(ic.ent&&ic.ent.dead)continue;const wx=ic.obj?ic.obj.position.x:ic.x,wz=ic.obj?ic.obj.position.z:ic.z;if(!mpSeenAt(wx,wz))continue;const X=sx(wx),Y=sy(wz);if(!on(X,Y,20))continue;mpDot(g,X,Y,9,ic.color||'#fff',ic.glyph||'');if(big&&ic.label){g.font='700 10px '+F;mpText(g,ic.label,X,Y+16,'#fff',2.5)}}
 if(typeof apPlanes!=='undefined')for(const p of apPlanes){if(p.dead||!mpSeenAt(p.m.position.x,p.m.position.z))continue;const X=sx(p.m.position.x),Y=sy(p.m.position.z);if(!on(X,Y,20))continue;const s=(p.type==='liner'?1.6:1)*Math.max(.4,Math.min(1.3,k/1.15));g.save();g.translate(X,Y);g.rotate(-p.m.rotation.y);g.fillStyle=p===driving?'#ffd23f':'#eef6ff';g.strokeStyle='#05080d';g.lineWidth=1;g.beginPath();g.rect(-1.5*s,-8*s,3*s,16*s);g.rect(-9*s,-2*s,18*s,3.5*s);g.rect(-4*s,6*s,8*s,2*s);g.fill();g.restore()}
 for(const e of shooters)if(!e.dead&&!e.gone&&e.kind==='gang'&&mpSeenAt(e.g.position.x,e.g.position.z))mpDot(g,sx(e.g.position.x),sy(e.g.position.z),3.5,'#c060ff');
 for(const pc of police)if(!pc.dead&&!pc.gone)mpDot(g,sx(pc.m.position.x),sy(pc.m.position.z),5.5,Math.sin(T*12)>0?'#ff3030':'#3a6bff');
 const px=sx(pos.x),py=sy(pos.z);
 // mission + waypoint
 if(beam.visible){const X=sx(mission.target.x),Y=sy(mission.target.z),col='#'+beamMat.color.getHexString();g.setLineDash([7,6]);g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.moveTo(px,py);g.lineTo(X,Y);g.stroke();g.setLineDash([]);
  g.strokeStyle=col;g.lineWidth=2;g.globalAlpha=.6;g.beginPath();g.arc(X,Y,11+Math.sin(T*5)*3,0,7);g.stroke();g.globalAlpha=1;mpDot(g,X,Y,7,col);g.font='800 10px '+F;mpText(g,'MISSION',X,Y-17,'#fff',2.5)}
 if(mpWay){const X=sx(mpWay.x),Y=sy(mpWay.z);g.setLineDash([3,5]);g.strokeStyle='#ff3df0';g.lineWidth=2;g.beginPath();g.moveTo(px,py);g.lineTo(X,Y);g.stroke();g.setLineDash([]);g.save();g.translate(X,Y);g.rotate(Math.PI/4);g.fillStyle='#ff3df0';g.strokeStyle='#fff';g.lineWidth=2;g.fillRect(-6,-6,12,12);g.strokeRect(-6,-6,12,12);g.restore();
  g.font='800 10px '+F;mpText(g,Math.round(Math.hypot(mpWay.x-pos.x,mpWay.z-pos.z))+' m',X,Y-16,'#ffd6fb',2.5)}
 // player
 g.save();g.translate(px,py);g.rotate(-facing);g.beginPath();g.moveTo(0,-11);g.lineTo(8,8);g.lineTo(0,4);g.lineTo(-8,8);g.closePath();g.fillStyle='#fff';g.fill();g.lineWidth=2;g.strokeStyle='#05080d';g.stroke();g.restore();
 // north arrow
 g.fillStyle='rgba(14,21,32,.8)';g.beginPath();g.arc(W-34,H/2-96,15,0,7);g.fill();g.fillStyle='#ff5a4d';g.beginPath();g.moveTo(W-34,H/2-109);g.lineTo(W-29,H/2-99);g.lineTo(W-39,H/2-99);g.fill();g.fillStyle='#fff';g.font='900 11px '+F;g.fillText('N',W-34,H/2-91);
 document.getElementById('mpPc').textContent='MAP '+mpPct()+'% EXPLORED'}
function mpLegendFill(){const rows=[['#fff','','You'],['#33ff88','','Mission'],['#ff3df0','','Waypoint'],['#3a6bff','','Police'],['#c060ff','','Gang']],seen={};for(const ic of mpIcons){if(!ic.label||seen[ic.label])continue;seen[ic.label]=1;rows.push([ic.color||'#fff',ic.glyph||'',ic.label])}
 let h='';for(const r of rows)h+='<div><i style="background:'+r[0]+'">'+r[1]+'</i>'+r[2]+'</div>';document.getElementById('mpLeg').innerHTML=h}
function mpShow(){if(mpOpen||state!=='play')return;mpOpen=true;state='map';joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;fireId=null;mpCX=pos.x;mpCZ=pos.z;mpWrap.style.display='block';mpResize();mpLegendFill();mpDraw()}
function mpClose(){if(!mpOpen)return;mpOpen=false;mpWrap.style.display='none';if(state==='map')state='play';for(const k in mpTch)delete mpTch[k];mpSave()}
function mpToggle(){if(mpOpen)mpClose();else mpShow()}
if(typeof fxToggleMap==='function'){fxToggleMap=mpToggle}else{$('map').addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();mpToggle()},{passive:false});addEventListener('keydown',e=>{if(e.key==='m'||e.key==='M')mpToggle()})}
function mpZoomAt(f,x,y){const wx=mpCX+(x-mpW/2)/mpK,wz=mpCZ+(y-mpH/2)/mpK;mpK*=f;mpClamp();mpCX=wx-(x-mpW/2)/mpK;mpCZ=wz-(y-mpH/2)/mpK;mpClamp();mpDraw()}
function mpSetWay(wx,wz){if(mpWay&&Math.hypot(wx-mpWay.x,wz-mpWay.z)*mpK<20){mpWay=null}else mpWay={x:Math.max(mpX0+4,Math.min(mpX1-4,wx)),z:Math.max(mpZ0+4,Math.min(mpZ1-4,wz))};mpDirty=true;beep(mpWay?1100:700,.07,.08)}
const mpTch={};let mpTap=false,mpMove=0;
{const loc=t=>{const r=mpCv.getBoundingClientRect();return [t.clientX-r.left,t.clientY-r.top]},ids=()=>Object.keys(mpTch),stop=e=>{e.stopPropagation();if(e.cancelable)e.preventDefault()};
 const two=()=>{const k=ids(),a=mpTch[k[0]],b=mpTch[k[1]];return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.max(8,Math.hypot(a.x-b.x,a.y-b.y))}};
 mpCv.addEventListener('touchstart',e=>{stop(e);for(const t of e.changedTouches){const p=loc(t);mpTch[t.identifier]={x:p[0],y:p[1]}}const n=ids().length;mpTap=n===1;if(n===1)mpMove=0},{passive:false});
 mpCv.addEventListener('touchmove',e=>{stop(e);for(const t of e.changedTouches){const o=mpTch[t.identifier];if(!o)continue;const p=loc(t),n=ids().length;
   if(n===1){const dx=p[0]-o.x,dy=p[1]-o.y;mpMove+=Math.abs(dx)+Math.abs(dy);if(mpMove>9)mpTap=false;mpCX-=dx/mpK;mpCZ-=dy/mpK;o.x=p[0];o.y=p[1];mpClamp()}
   else{const a=two(),wx=mpCX+(a.x-mpW/2)/mpK,wz=mpCZ+(a.y-mpH/2)/mpK;o.x=p[0];o.y=p[1];const b=two();mpK*=b.d/a.d;mpClamp();mpCX=wx-(b.x-mpW/2)/mpK;mpCZ=wz-(b.y-mpH/2)/mpK;mpClamp();mpTap=false}}mpDraw()},{passive:false});
 const end=e=>{stop(e);for(const t of e.changedTouches){const o=mpTch[t.identifier];if(!o)continue;delete mpTch[t.identifier];if(mpTap&&e.type==='touchend'&&!ids().length){mpSetWay(mpCX+(o.x-mpW/2)/mpK,mpCZ+(o.y-mpH/2)/mpK);mpTap=false}}mpDraw()};
 mpCv.addEventListener('touchend',end,{passive:false});mpCv.addEventListener('touchcancel',end,{passive:false});
 mpCv.addEventListener('wheel',e=>{e.preventDefault();e.stopPropagation();const p=loc(e);mpZoomAt(Math.exp(-e.deltaY*.0016),p[0],p[1])},{passive:false});
 const btn=(id,fn)=>document.getElementById(id).addEventListener('touchstart',e=>{stop(e);fn();if(mpOpen)mpDraw()},{passive:false});
 btn('mpX',mpClose);btn('mpZi',()=>mpZoomAt(1.45,mpW/2,mpH/2));btn('mpZo',()=>mpZoomAt(1/1.45,mpW/2,mpH/2));btn('mpMe',()=>{mpCX=pos.x;mpCZ=pos.z;if(mpK<1.1)mpK=1.1;mpClamp()});btn('mpLg',()=>{mpLegendOn=!mpLegendOn;document.getElementById('mpLeg').style.display=mpLegendOn?'block':'none'});
 for(const ty of['touchstart','touchmove','touchend','touchcancel'])mpWrap.addEventListener(ty,e=>{e.stopPropagation();if(ty==='touchstart'&&e.target===mpWrap)mpClose()});
 addEventListener('keydown',e=>{if(!mpOpen)return;if(e.key==='+'||e.key==='=')mpZoomAt(1.3,mpW/2,mpH/2);else if(e.key==='-'||e.key==='_')mpZoomAt(1/1.3,mpW/2,mpH/2);else if(e.key==='Escape')mpClose()});
 addEventListener('resize',()=>{if(mpOpen){mpResize();mpDraw()}})}
// ----- waypoint marker in the world + per-frame work -----
const mpBeam=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.7,90,16,1,true),new THREE.MeshBasicMaterial({color:0xff3df0,transparent:true,opacity:.42,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));mpBeam.visible=false;scene.add(mpBeam);
MODS.push(function(dt){if(state!=='play'&&state!=='map')return;
 mpRevT-=dt;if(mpRevT<=0){mpRevT=.25;const alt=driving?driving.m.position.y:pos.y;mpReveal(pos.x,pos.z,alt>30?110:55)}
 mpSaveT-=dt;if(mpSaveT<=0){mpSaveT=15;if(mpDirty)mpSave()}
 if(mpWay){mpBeam.visible=true;mpBeam.position.set(mpWay.x,45,mpWay.z);mpBeam.material.opacity=.34+.1*Math.sin(T*4);if(state==='play'&&Math.hypot(mpWay.x-pos.x,mpWay.z-pos.z)<9){mpWay=null;mpDirty=true;toast('Waypoint reached');beep(1300,.12,.1)}}else mpBeam.visible=false;
 if(mpOpen){mpDrawT-=dt;if(mpDrawT<=0){mpDrawT=.12;mpDraw()}}});
addEventListener('pagehide',()=>{if(mpDirty)mpSave()});
