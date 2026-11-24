// ---------- story: phone, properties, crew heists ----------
let stS={own:{},inc:{},done:0,h:null,msgs:[],tx:[],play:0,outfit:0,sent:{},lawT:-999};
try{const j=JSON.parse(localStorage.getItem('blockcity_story')||'null');if(j)for(const k in j)stS[k]=j[k]}catch(e){}
function stStore(){try{const h=stS.h;localStorage.setItem('blockcity_story',JSON.stringify(Object.assign({},stS,{h:h?{i:h.i,loud:h.loud,crew:h.crew,stage:stKeep(h.stage)}:null})))}catch(e){}if(typeof msSave==='function')msSave()}
function stKeep(s){return s==='car'||s==='scout'||s==='gear'?s:(s==='plan'?'plan':'meet')}
function stTry(f,d){try{return f()}catch(e){return d}}
function stM(n){return '$'+Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function stTx(t,a){stS.tx.unshift([t,a]);if(stS.tx.length>20)stS.tx.length=20}
function stPay(a,t){if(cash<a)return false;cash-=a;stTx(t,-a);return true}
// ----- characters -----
const stCrew={rico:{n:'Rico Vance',r:'Driver',s:3,cut:12,c:'#ff8a3d'},dee:{n:'Dee Okafor',r:'Driver',s:1,cut:5,c:'#c9a227'},mara:{n:'Mara Stone',r:'Gunman',s:3,cut:12,c:'#e0455a'},tug:{n:'Tug Bellamy',r:'Gunman',s:1,cut:5,c:'#8d6e63'},pixel:{n:'Ines "Pixel" Roy',r:'Hacker',s:3,cut:12,c:'#3ddcff'},lenny:{n:'Lenny Voss',r:'Hacker',s:1,cut:5,c:'#9b7bff'}};
const stCon={vee:{n:'Vee Calloway',r:'Fixer',c:'#ffd23f'},taxi:{n:'Block Cab',r:'Taxi',c:'#f4c20d'},mech:{n:'Otto Garage',r:'Car delivery',c:'#6dd47e'},law:{n:'Sol Greaves',r:'Lawyer',c:'#b0bec5'},agent:{n:'Dana Pryce',r:'Real estate',c:'#ff7ab8'}};
function stAv(c,n,sz){const p=n.replace(/"[^"]*"/,'').trim().split(/\s+/);return '<span style="display:inline-flex;align-items:center;justify-content:center;width:'+(sz||34)+'px;height:'+(sz||34)+'px;border-radius:50%;background:'+c+';color:#000;font-weight:900;font-size:'+Math.round((sz||34)*.4)+'px;flex:none">'+p[0][0]+(p[1]?p[1][0]:'')+'</span>'}
// ----- properties -----
const stSP=(i,j,o)=>{const a=[roadCenter(i)+CELL/2+o,roadCenter(j)+ROAD/2+1.7];a.ij=[i,j];return a};
const stProps=[{id:'safe',n:'Safehouse Apartment',k:'home',p:5000,d:'Heal, save, lose 2 stars, 1 garage slot'},
 {id:'apt',n:'Midtown Studio',k:'home',p:18000,at:stSP(3,7,9),t:'safe',d:'Save point and health refill'},
 {id:'house',n:'Westside House',k:'home',p:45000,at:stSP(0,4,9),t:'stlux',d:'Family house in the suburbs'},
 {id:'ware',n:'Dockside Warehouse',k:'home',p:35000,at:stSP(9,9,9),t:'stoff',d:'Heist planning room near the beach'},
 {id:'condo',n:'Ocean Condo',k:'home',p:90000,at:stSP(9,5,9),t:'stlux',d:'Beachfront condo'},
 {id:'pent',n:'Skyline Penthouse',k:'home',p:220000,at:stSP(5,3,-9),t:'stlux',d:'Top of downtown'},
 {id:'mans',n:'Hillside Mansion',k:'home',p:500000,at:[roadCenter(5)+CELL/2+9,HALF+18],t:'stlux',d:'Under the BLOCK CITY sign'},
 {id:'wash',n:'Suds Car Wash',k:'biz',p:60000,at:stSP(2,5,9),t:'stoff',inc:400,cap:6000,d:'Earns $400 a minute'},
 {id:'club',n:'Club Neon (50% stake)',k:'biz',p:150000,at:stSP(7,2,9),t:'stoff',inc:1100,cap:15000,d:'Earns $1,100 a minute'},
 {id:'marina',n:'Bayside Boat Rental',k:'biz',p:120000,at:[HALF+22,roadCenter(7)+10],t:'stoff',inc:850,cap:12000,d:'Earns $850 a minute'}];
function stOwn(P){return P.id==='safe'?stTry(()=>cpSave.own,false):!!stS.own[P.id]}
function stCol(g,c){const col=new THREE.Color(c),n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=col.r;a[i*3+1]=col.g;a[i*3+2]=col.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
const stB=(w,h,d,x,y,z,c)=>stCol(bxg(w,h,d,x,y,z),c);
const stHasCp=typeof cpGo==='function'&&typeof cpTypes!=='undefined'&&typeof cpRoom==='function';
if(stHasCp){cpTypes.stlux={l:'HOME',c:0x6dff8a,wall:0xe8e2d6,floor:0x9c7b55};cpTypes.stoff={l:'OFFICE',c:0x6dff8a,wall:0x56606b,floor:0x3d4248};
 for(const t of['stlux','stoff']){const R=cpRoom(t,t==='stlux'?24:25);cpRooms[t]=R;const X=R.x,g=[stB(17.6,.05,13.6,X,.345,0,t==='stlux'?0x9c7b55:0x3d4248)];
  if(t==='stlux'){g.push(stB(5,.9,2,X-5,.75,-4.5,0x394a6d),stB(5,1.6,.5,X-5,1.1,-5.6,0x2c3a57),stB(2.6,.5,1.4,X-5,.55,-2.2,0x6b4a2f),stB(4,.16,2.4,X+4.5,2.6,-6.3,0x0c0c0c),stB(3,.5,1,X+4.5,.55,-6,0x4a3a2c),stB(3.4,.7,4.6,X+5.6,.65,2.5,0xf2f2f2),stB(3.4,.3,1,X+5.6,1.1,.6,0xd7dce2),stB(6,.03,4,X-4,.33,2,0x8a2f3a))}
  else{g.push(stB(5,.12,2.2,X,1.25,-2.5,0x5a4632),stB(.2,1.2,.2,X-2.3,.9,-3.4,0x333333),stB(.2,1.2,.2,X+2.3,.9,-3.4,0x333333),stB(.2,1.2,.2,X-2.3,.9,-1.6,0x333333),stB(.2,1.2,.2,X+2.3,.9,-1.6,0x333333),stB(7,3.4,.14,X,2.6,-6.6,0x1d2b22),stB(1.6,1,.05,X-2,2.9,-6.5,0xfff4c2),stB(1.6,1,.05,X,2.3,-6.5,0xcfe8ff),stB(1.6,1,.05,X+2,3,-6.5,0xffd0d0),stB(1.4,2.4,1.4,X-7,1.5,-5.5,0x596673),stB(1.4,2.4,1.4,X+7,1.5,-5.5,0x596673))}
  scene.add(new THREE.Mesh(U.mergeBufferGeometries(g),new THREE.MeshBasicMaterial({vertexColors:true})))}}
{const g=[],stSaleQ=[];for(const P of stProps){if(!P.at)continue;
  // city properties get a real front door on a street facade (shared slot finder with the shops), the marker sits on the pavement at the door
  if(P.at.ij&&stHasCp&&typeof cpFindSlot==='function'){const sl=stTry(()=>cpFindSlot(P.at.ij[0],P.at.ij[1]),null);const dr=sl?cpAddDoor(sl[0]-.8,sl[1]-.07,0):null;if(sl&&!dr)cpSlots.delete(sl[2]);
   // no door left (instanced door pool full): keep the plain ring + sign post on the pavement and leave that facade to the city
   if(sl&&dr){cpClearFront(sl);const dx=sl[0],dz=sl[1],biz=P.k==='biz';P.at=[dx,dz-1.35];P.dz=dz;P.dr=dr;
   g.push(stB(.45,3.4,.3,dx-1.2,1.7,dz-.15,0xcfc8ba),stB(.45,3.4,.3,dx+1.2,1.7,dz-.15,0xcfc8ba),stB(2.9,.35,.3,dx,3.15,dz-.15,0xcfc8ba),stB(3.2,.12,1.4,dx,3.5,dz-.7,0x2b2f36),stB(2.4,.12,.9,dx,.36,dz-.45,0xb9b3a8),
    stB(.5,.32,.06,dx+.9,2.6,dz-.33,0x1a1a1a),stB(1.5,1.5,.06,dx+2.4,1.9,dz-.04,biz?0x2a6fdb:0xc62828));
   if(typeof cpAtM!=='undefined'){const q=gT(new THREE.PlaneGeometry(1.36,1.36),dx+2.4,1.9,dz-.08,0,Math.PI,0),uv=q.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,(2+uv.getX(k))/4,uv.getY(k)/4);stSaleQ.push(q)}}}
  const x=P.at[0],z=P.at[1],y=typeof ldFloor==='function'?Math.max(0,stTry(()=>ldFloor(x,z),0)):0;P.x=x;P.z=z;P.y=y;P.away=true;
  if(!P.dr)g.push(stB(.14,2.6,.14,x+1.9,y+1.5,z,0xeeeeee),stB(1.7,1,.1,x+1.9,y+2.5,z,P.k==='biz'?0x2a6fdb:0xc62828),stB(1.3,.2,.12,x+1.9,y+2.65,z,0xffffff),stB(1.1,.12,.12,x+1.9,y+2.3,z,0xffffff));
  P.ring=new THREE.Mesh(new THREE.RingGeometry(1,1.35,24),new THREE.MeshBasicMaterial({color:0xffd23f,toneMapped:false,side:THREE.DoubleSide}));P.ring.rotation.x=-Math.PI/2;P.ring.position.set(x,y+.36,z);scene.add(P.ring)}
 const m=new THREE.Mesh(U.mergeBufferGeometries(g),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7}));m.castShadow=true;scene.add(m);if(stSaleQ.length)scene.add(new THREE.Mesh(U.mergeBufferGeometries(stSaleQ),cpAtM))}
let stIconsDone=false;
function stBuy(P){if(stOwn(P))return true;const pr=stPrice(P);if(!stPay(pr,'Bought '+P.n)){toast('Not enough cash for '+P.n);return false}if(stS.disc&&pr<P.p)stS.disc=0;if(P.id==='safe'){stTry(()=>{cpSave.own=true;cpStore()})}else{stS.own[P.id]=1;stS.inc[P.id]=0}stIconUpd(P);stStore();stTry(()=>cpBanner('PROPERTY BOUGHT','#6dff8a',P.n,3));beep(1300,.15,.12);stMsg('agent','Congratulations on '+P.n+'. The keys are yours.');return true}
function stCollect(P){const a=Math.floor(stS.inc[P.id]||0);if(a<1)return 0;stS.inc[P.id]=0;cash+=a;stTx(P.n+' income',a);stStore();return a}
function stCollectAll(){let a=0;for(const P of stProps)if(P.k==='biz'&&stOwn(P))a+=stCollect(P);return a}
function stEnterProp(P){if(!stHasCp)return;const pl={type:P.t,D:cpTypes[P.t],x:P.x,z:P.dr?P.dz:P.z+2.6,room:typeof cpGetRoom==='function'?cpGetRoom(P.t):cpRooms[P.t],cool:0,st:P,door:P.dr||null};P.away=false;
 const fin=()=>{hp=100;if(wanted<=2){wantedScore=0;evade=0}const a=P.k==='biz'?stCollect(P):0;toast(P.n+(a?': collected '+stM(a):': healed and saved'));stStore()};
 if(P.dr&&typeof cpStartIn==='function'){cpStartIn(pl);fin()}else cpFade(()=>{cpGo(pl);fin()})}
const stOutfits=[[0xff5a36,0x23324d],[0x1f2937,0x111827],[0xf5f5f5,0x1e3a8a],[0x2e7d32,0x3e2723],[0x7b1fa2,0x212121],[0xfbc02d,0x263238]];
function stWear(){stS.outfit=(stS.outfit+1)%stOutfits.length;stDress();stStore();toast('Outfit '+(stS.outfit+1)+' of '+stOutfits.length)}
function stDress(){const o=stOutfits[stS.outfit%stOutfits.length];stTry(()=>{const b=player.children[0];b.children[0].material.color.setHex(o[0]);b.children[1].material.color.setHex(o[1]);player.userData.rlShirt=new THREE.Color(o[0]);player.userData.rlPants=new THREE.Color(o[1])})}
if(stS.outfit)stDress();
// ----- generic panel (uses its own element so it never fights the crime panel) -----
const stCss=document.createElement('style');stCss.textContent='.st-p{position:fixed;z-index:80;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff}.st-b{display:inline-block;margin:6px 6px 0 0;padding:9px 14px;border-radius:11px;background:#ffd23f;color:#000;font-weight:800;font-size:13px}.st-b.g{background:#2b3038;color:#fff;border:1px solid #fff3}.st-b.r{background:#ff6b6b}.st-row{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:11px;background:#ffffff10;margin-top:6px;font-size:12.5px;line-height:1.3}.st-h{font-weight:900;font-size:15px;letter-spacing:.5px}.st-s{opacity:.7;font-size:11.5px}body.stcam>*:not(canvas):not(#stCamX){visibility:hidden!important}';document.head.appendChild(stCss);
const stPan=document.createElement('div');stPan.className='st-p';stPan.style.cssText='left:0;top:0;right:0;bottom:0;display:none;align-items:center;justify-content:center;background:#000a';document.body.appendChild(stPan);
let stPanCb=null,stPrev='play';
function stPause(s){if(state==='play')stPrev='play';state=s;joy.id=null;joy.x=joy.y=0;knob.style.transform='';look.id=null;fireId=null;burstN=0;jumpQ=carQ=false;vel.x=vel.z=0}
function stResume(s){if(state===s)state='play'}
function stOpenPan(html,cb){stPanCb=cb;stPan.innerHTML='<div style="width:min(440px,92%);max-height:92%;overflow:hidden;background:#12151bf5;border:1px solid #ffffff30;border-radius:18px;padding:14px 16px;box-shadow:0 12px 40px #000a">'+html+'</div>';stPan.style.display='flex';stPause('stpanel')}
function stClosePan(){stPan.style.display='none';stResume('stpanel')}
stPan.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const b=e.target&&e.target.closest?e.target.closest('[data-k]'):null;if(b&&stPanCb)stPanCb(b.getAttribute('data-k'))},{passive:false});
const stBtn=(k,t,c)=>'<span class="st-b '+(c||'')+'" data-k="'+k+'">'+t+'</span>';
// subtitles
const stSub=document.createElement('div');stSub.className='st-p';stSub.style.cssText='left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);transform:translateX(-50%);max-width:74%;padding:7px 14px;border-radius:12px;background:#000b;font-size:13.5px;font-weight:600;text-align:center;pointer-events:none;opacity:0;transition:opacity .25s;z-index:28';document.body.appendChild(stSub);
let stSubT=0;const stSubQ=[];
function stSay(who,t){const c=stCrew[who]||stCon[who]||{n:who,c:'#fff'};stSubQ.push('<b style="color:'+c.c+'">'+c.n.split(' ')[0]+':</b> '+t)}
function stRow(av,t,s,btn){return '<div class="st-row">'+av+'<div style="flex:1;min-width:0"><div style="font-weight:700">'+t+'</div><div class="st-s">'+s+'</div></div>'+(btn||'')+'</div>'}
function stHeist(){return [{n:'The Corner Job',d:'Hit the 24/7 Mart chain safe',take:25000,type:'store'},{n:'Ice Cold',d:'Clean out the jewelry store',take:90000,type:'jewel'},{n:'The Big One',d:'Block City Central Bank vault',take:400000,type:'bank'}]}
function stStageText(){const h=stS.h;if(!h)return '';const H=stHeist()[h.i];return ({plan:'Pick your crew',car:'Steal a getaway car and park it at the marker',scout:'Scout the target: stand by the front door',gear:'Pick up the gear bag',meet:'Meet the crew at the target',enter:'Go in through the front door',ctrl:h.loud?'Fire a shot to control the room':'Blend in while the crew gets set',vault:'Crack the safe',grab:'Hold the room while the bags fill',exit:'Get out the front door',escape:'Lose them and reach the drop-off'})[h.stage]||H.n}
function stWay(x,z){stTry(()=>{mpWay={x:x,z:z};mpDirty=true});stWayMine={x:x,z:z}}
let stWayMine=null,stTaxiT=0;
// ----- phone v2: GTA 6 style smartphone, texting, calls with voices, non-pausing -----
const stSoc={jaz:{n:'Jasmine Ortega',r:'Friend',c:'#ff5fa2'},marc:{n:'Marcus Bell',r:'Gym buddy',c:'#2fa7ff'},nana:{n:'Nana Burke',r:'Neighbour',c:'#f2a541'},kai:{n:'Kai Tanaka',r:'Tech guy',c:'#1fc7a8'},deke:{n:'Deke Marlow',r:'Car dealer',c:'#a8795a'}};
const stGen={vee:'f',taxi:'m',mech:'m',law:'m',agent:'f',rico:'m',dee:'f',mara:'f',tug:'m',pixel:'f',lenny:'m',jaz:'f',marc:'m',nana:'f',kai:'m',deke:'m',op:'f'};
const stVP={vee:[.95,1.02],taxi:[.85,1.1],mech:[.75,.95],law:[.9,.9],agent:[1.15,1.05],rico:[.9,1.12],dee:[1.1,1.1],mara:[.9,1],tug:[.65,.9],pixel:[1.25,1.15],lenny:[1.05,1.2],jaz:[1.3,1.12],marc:[.75,1.06],nana:[1.15,.82],kai:[1.05,1.16],deke:[.7,.96],op:[1,.95]};
const stAll=['vee','agent','law','mech','taxi','jaz','marc','nana','kai','deke','rico','dee','mara','tug','pixel','lenny'];
function stWho(id){return stSoc[id]||stCon[id]||stCrew[id]||(id==='op'?{n:'Operator',r:'',c:'#8e8e93'}:{n:String(id),r:'',c:'#8e8e93'})}
function stNum(id){const i=stAll.indexOf(id);return '555-01'+(i<0?99:10+i)}
function stE(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])}
function stClk(){const h=Math.floor((dayT*24+6)%24),m=Math.floor((dayT*24*60)%60);return (h%12||12)+':'+String(m).padStart(2,'0')}
function stHour(){return Math.floor((dayT*24+6)%24)}
function stTod(){const h=stHour();return h<5?'late night':(h<12?'morning':(h<17?'afternoon':(h<21?'evening':'night')))}
function stDist(){const x=pos.x,z=pos.z;if(x>HALF+20)return 'the beach';if(x<-HALF-15)return 'the airport';if(z<-HALF-15)return 'the army base';if(z>HALF+30)return 'the hills';if(Math.hypot(x,z)<HALF*.4)return 'downtown';if(x>HALF*.6)return 'Ocean Drive';if(x<-HALF*.6)return 'the west side';return 'midtown'}
function stAgo(ts){const d=Math.max(0,stS.play-ts);return d<60?'now':(d<3600?Math.floor(d/60)+'m':Math.floor(d/3600)+'h')}
function stAv(c,n,sz){const p=String(n).replace(/"[^"]*"/,'').trim().split(/\s+/);const s=sz?'width:'+sz+'px;height:'+sz+'px;font-size:'+Math.round(sz*.4)+'px;':'';return '<span class="stp-av" style="'+s+'background:linear-gradient(150deg,'+c+','+c+'99)">'+p[0][0]+(p[1]?p[1][0]:'')+'</span>'}
function stAvI(id,em){const w=stWho(id),e=em||3;return '<span class="stp-av" style="width:'+e+'em;height:'+e+'em;font-size:1em;background:linear-gradient(150deg,'+w.c+','+w.c+'88)"><span style="font-size:'+(e*.36).toFixed(2)+'em">'+stIni(w.n)+'</span></span>'}
function stIni(n){const p=String(n).replace(/"[^"]*"/,'').trim().split(/\s+/);return p[0][0]+(p[1]?p[1][0]:'')}
// ----- chat state -----
let stC={t:{},u:{},mood:{},act:{},last:{},calls:[],feed:[],ll:{},nextPro:150,nextCall:330,nextFeed:40,flags:{}};
try{const j=JSON.parse(localStorage.getItem('blockcity_chat')||'null');if(j)for(const k in j)stC[k]=j[k]}catch(e){}
function stChatSave(){try{localStorage.setItem('blockcity_chat',JSON.stringify(stC))}catch(e){}}
let stBadge=0,stView=null,stTyping={},stPend=[],stPhotos=[];
function stAdd(id,d,txt,quiet){const L=(stC.t[id]=stC.t[id]||[]);L.push([d,txt,Math.round(stS.play)]);if(L.length>50)L.splice(0,L.length-50);stC.last[id]=stS.play;if(d!==1&&!quiet&&stView!==id)stC.u[id]=(stC.u[id]||0)+1;stChatSave();stBadgeDraw()}
function stUnread(){let n=0;for(const k in stC.u)n+=stC.u[k]||0;return n}
if(stS.msgs&&stS.msgs.length&&!stC.mig){for(const m of stS.msgs.slice().reverse())stAdd(m[0],0,m[1],true);stC.mig=1;stChatSave()}
function stMsg(from,t,act){stAdd(from,0,t);if(act)stC.act[from]=act;stNotify(from,t);stTry(()=>{beep(1500,.07,.1);setTimeout(()=>beep(1900,.09,.1),110)});if(stView===from)stRender()}
function stOnce(k,from,t){if(stS.sent[k])return;stS.sent[k]=1;stMsg(from,t)}
// ----- css -----
const stPCss=document.createElement('style');stPCss.textContent=
'.stp{position:fixed;z-index:82;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#fff;transform:translateY(125%) scale(.97);opacity:0;transition:transform .42s cubic-bezier(.2,.9,.22,1),opacity .28s;pointer-events:none;-webkit-user-select:none;user-select:none;line-height:1.25}'+
'.stp.on{transform:none;opacity:1;pointer-events:auto}'+
'.stp-f{position:absolute;inset:0;border-radius:3.3em;background:linear-gradient(145deg,#4a4d55,#17191d 38%,#2e3138 70%,#121316);padding:.5em;box-shadow:0 1.8em 3.6em #000d,inset 0 0 0 .1em #6c707a,inset 0 0 0 .28em #08090b}'+
'.stp-f:before{content:"";position:absolute;right:-.22em;top:24%;width:.22em;height:12%;border-radius:0 .2em .2em 0;background:#3a3d44}'+
'.stp-f:after{content:"";position:absolute;left:-.22em;top:20%;width:.22em;height:7%;border-radius:.2em 0 0 .2em;background:#3a3d44;box-shadow:0 3.2em 0 #3a3d44}'+
'.stp-s{position:relative;width:100%;height:100%;border-radius:2.85em;overflow:hidden;background:#000}'+
'.stp-w{position:absolute;inset:0;background:radial-gradient(130% 75% at 30% 8%,#ffb36b 0%,#ff6f7d 28%,#c13f8f 50%,#4b2786 72%,#120a2c 100%)}'+
'.stp-sb{position:absolute;left:0;right:0;top:0;height:3em;display:flex;align-items:center;justify-content:space-between;padding:0 1.5em 0 1.75em;font-size:1em;font-weight:600;z-index:11;pointer-events:none;letter-spacing:.01em;text-shadow:0 1px 2px #0006}'+
'.stp-di{position:absolute;left:50%;top:.62em;width:7.2em;height:2.05em;margin-left:-3.6em;border-radius:1.1em;background:#000;z-index:10;transition:width .35s cubic-bezier(.2,.9,.3,1),margin .35s cubic-bezier(.2,.9,.3,1);display:flex;align-items:center;justify-content:space-between;padding:0 .55em;box-sizing:border-box;overflow:hidden}'+
'.stp-di.wide{width:10.4em;margin-left:-5.2em}'+
'.stp-L{position:absolute;inset:0;transition:transform .45s cubic-bezier(.2,.9,.22,1),opacity .3s}'+
'.stp-home{padding:3.6em .75em 0;z-index:1}'+
'.stp-lock{z-index:6;display:flex;flex-direction:column;align-items:center;padding-top:4.4em;background:linear-gradient(#0000,#0003 60%,#0008)}'+
'.stp-lock.off{transform:translateY(-104%)}'+
'.stp-app{z-index:4;background:#000;opacity:0;transform:scale(.18);pointer-events:none;display:flex;flex-direction:column;border-radius:2.85em;overflow:hidden}'+
'.stp-app.on{opacity:1;transform:none;pointer-events:auto}'+
'.stp-g{display:grid;grid-template-columns:repeat(4,1fr);gap:1.05em 0;margin-top:.9em}'+
'.stp-i{text-align:center;position:relative}'+
'.stp-i span.l{display:block;font-size:.72em;overflow:hidden;text-overflow:ellipsis;font-weight:500;text-shadow:0 1px 3px #000a;margin-top:.4em;white-space:nowrap}'+
'.stp-ic{width:3.7em;height:3.7em;margin:0 auto;border-radius:.95em;display:flex;align-items:center;justify-content:center;box-shadow:0 .3em .7em #0006,inset 0 .1em 0 #ffffff45,inset 0 -.12em .2em #0003}'+
'.stp-ic svg{width:56%;height:56%;fill:#fff;filter:drop-shadow(0 .06em .08em #0004)}'+
'.stp-bd{position:absolute;right:.35em;top:-.45em;min-width:1.55em;height:1.55em;border-radius:.8em;background:#ff3b30;font-size:.78em;font-weight:700;line-height:1.55em;padding:0 .35em;box-sizing:border-box;box-shadow:0 0 0 .12em #0002}'+
'.stp-dock{position:absolute;left:.75em;right:.75em;bottom:1.9em;height:6em;border-radius:2.1em;background:#ffffff30;display:grid;grid-template-columns:repeat(4,1fr);align-items:center;box-shadow:inset 0 0 0 .06em #ffffff38}'+
'.stp-wd{margin-top:.2em;border-radius:1.5em;background:#00000040;padding:.85em 1em;display:flex;justify-content:space-between;align-items:center;box-shadow:inset 0 0 0 .06em #ffffff2a}'+
'.stp-bar{position:absolute;left:0;right:0;bottom:0;height:1.9em;z-index:12;display:flex;align-items:center;justify-content:center}'+
'.stp-bar i{width:9.5em;height:.36em;border-radius:.3em;background:#fffe;display:block;box-shadow:0 0 .3em #0006}'+
'[data-k]{transition:transform .12s,filter .12s}.stp-pr{transform:scale(.92)!important;filter:brightness(.78)}'+
'.stp-hd{flex:none;padding:3.2em 1.1em .45em;display:flex;align-items:center;gap:.5em;min-height:2.2em}'+
'.stp-hd b{font-size:1.65em;font-weight:800;letter-spacing:-.01em}'+
'.stp-bk{color:#0a84ff;font-size:1.05em;font-weight:500;padding:.2em .3em .2em 0;white-space:nowrap}'+
'.stp-sc{flex:1;overflow:hidden;padding:0 .9em 2.4em;position:relative}'+
'.stp-row{display:flex;align-items:center;gap:.72em;padding:.6em .1em;border-bottom:.06em solid #ffffff17}'+
'.stp-av{width:3em;height:3em;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:1.05em;text-shadow:0 1px 2px #0005;letter-spacing:.02em}'+
'.stp-t{flex:1;min-width:0}.stp-t b{display:block;font-size:1em;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.stp-sub{font-size:.84em;color:#ffffff8a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.stp-dot{width:.62em;height:.62em;border-radius:50%;background:#0a84ff;flex:none}'+
'.stp-btn{display:inline-flex;align-items:center;justify-content:center;padding:.48em .95em;border-radius:1.3em;background:#0a84ff;font-weight:600;font-size:.9em;white-space:nowrap}'+
'.stp-btn.g{background:#ffffff1f}.stp-btn.r{background:#ff3b30}.stp-btn.y{background:#30d158;color:#04140a}.stp-btn.o{background:#ff9f0a;color:#1a1000}'+
'.stp-ib{width:2.3em;height:2.3em;border-radius:50%;background:#ffffff1c;display:inline-flex;align-items:center;justify-content:center;flex:none}.stp-ib svg{width:55%;height:55%;fill:#30d158}'+
'.stp-chat{display:flex;flex-direction:column;padding:.4em .7em .6em}'+
'.stp-m{max-width:78%;padding:.5em .8em;border-radius:1.25em;margin:.14em 0;line-height:1.32;word-wrap:break-word;font-size:1em}'+
'.stp-m.i{background:#2c2c2e;align-self:flex-start;border-bottom-left-radius:.35em}'+
'.stp-m.o{background:linear-gradient(#2f95ff,#0a7cff);align-self:flex-end;border-bottom-right-radius:.35em}'+
'.stp-ts{align-self:center;font-size:.72em;color:#ffffff66;margin:.6em 0 .2em}'+
'.stp-vm{display:flex;align-items:center;gap:.55em;min-width:11em}.stp-vm i{display:inline-block;width:.18em;border-radius:.1em;background:#ffffffaa;margin-right:.14em}'+
'.stp-typ{align-self:flex-start;background:#2c2c2e;border-radius:1.25em;padding:.62em .8em;margin:.14em 0}.stp-typ i{display:inline-block;width:.45em;height:.45em;border-radius:50%;background:#ffffff99;margin:0 .1em;animation:stpB 1s infinite}.stp-typ i:nth-child(2){animation-delay:.15s}.stp-typ i:nth-child(3){animation-delay:.3s}'+
'@keyframes stpB{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-.3em);opacity:1}}'+
'.stp-chips{display:flex;gap:.4em;padding:.35em .7em;overflow:hidden;flex:none}'+
'.stp-chip{flex:none;padding:.42em .8em;border-radius:1.3em;border:.08em solid #0a84ff;color:#58a8ff;font-size:.86em;white-space:nowrap;background:#0a84ff14}'+
'.stp-inp{flex:none;display:flex;gap:.45em;align-items:center;padding:.3em .7em 2.3em}'+
'.stp-inp input{flex:1;min-width:0;height:2.45em;border-radius:1.3em;border:.08em solid #ffffff30;background:#1c1c1e;color:#fff;padding:0 .9em;font-size:16px;outline:none;-webkit-user-select:text;user-select:text;font-family:inherit}'+
'.stp-send{width:2.3em;height:2.3em;border-radius:50%;background:#0a84ff;display:flex;align-items:center;justify-content:center;flex:none}.stp-send svg{width:55%;height:55%;fill:#fff}'+
'.stp-nb{position:absolute;left:.55em;right:.55em;top:.45em;z-index:11;border-radius:1.5em;background:#1f1f22f2;padding:.65em .75em;display:flex;gap:.6em;align-items:center;transform:translateY(-130%);transition:transform .4s cubic-bezier(.2,.9,.22,1);box-shadow:0 .5em 1.4em #000b}'+
'.stp-nb.on{transform:translateY(2.8em)}'+
'.stp-card{border-radius:1.2em;background:#1c1c1e;padding:.85em;margin-top:.6em}'+
'.stp-ph{height:6.2em;border-radius:.9em;position:relative;overflow:hidden;margin:-.1em -.1em .6em}'+
'.stp-tab{display:flex;gap:.3em;background:#ffffff14;border-radius:.8em;padding:.2em;margin:0 0 .5em}.stp-tab span{flex:1;text-align:center;padding:.35em 0;border-radius:.65em;font-size:.85em;font-weight:600;color:#ffffffaa}.stp-tab span.on{background:#ffffff26;color:#fff}'+
'.stp-key{display:grid;grid-template-columns:repeat(3,1fr);gap:.7em .9em;padding:0 .8em}.stp-key span{height:3.6em;border-radius:50%;background:#ffffff22;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:1.5em;font-weight:400;width:3.6em;justify-self:center}'+
'.stp-cbg{position:absolute;inset:0;z-index:0}'+
'.stp-cb{width:3.9em;height:3.9em;border-radius:50%;display:flex;align-items:center;justify-content:center}.stp-cb svg{width:46%;height:46%;fill:#fff}'+
'#stNB{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);width:min(330px,78vw);transform:translate(-50%,-160%);transition:transform .45s cubic-bezier(.2,.9,.22,1);z-index:86;border-radius:20px;background:#1f1f22f0;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;display:flex;gap:10px;align-items:center;padding:10px 12px;box-shadow:0 10px 30px #000a;box-sizing:border-box}'+
'#stNB.on{transform:translate(-50%,0)}#stNB .stp-av{width:36px;height:36px;font-size:14px}'+
'.stp-post{padding:.7em 0;border-bottom:.06em solid #ffffff17;display:flex;gap:.6em}'+
'.stp-flash{position:fixed;inset:0;background:#fff;z-index:200;pointer-events:none;opacity:0;transition:opacity .35s}';
document.head.appendChild(stPCss);
// ----- svg bits -----
const stSvg=(p,ex)=>'<svg viewBox="0 0 24 24"'+(ex||'')+'>'+p+'</svg>';
const stGl={phone:'<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/>',
 msgs:'<path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.4 6.1L4.5 21l4.3-2.3c1 .2 2.1.3 3.2.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/>',
 contacts:'<circle cx="12" cy="8.5" r="4"/><path d="M4 20.5c0-4.4 3.6-7 8-7s8 2.6 8 7z"/>',
 map:'<path d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
 bank:'<path d="M12 2 2 7.5V10h20V7.5zM4.5 11h3v7h-3zm6 0h3v7h-3zm6 0h3v7h-3zM2 19.5h20V22H2z"/>',
 estate:'<path d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z"/>',
 jobs:'<path d="M9 3h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3V5a2 2 0 0 1 2-2zm0 3h6V5H9zM2 12h20v1.5H2z"/>',
 chirp:'<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 4.6 16.7L21 21l-1.2-4.4A9 9 0 0 0 12 3zm0 4.2a4.8 4.8 0 0 1 3.4 1.4l-1.3 1.3a3 3 0 1 0 0 4.2l1.3 1.3A4.8 4.8 0 1 1 12 7.2z"/>',
 music:'<path d="M9 18a3 3 0 1 1-2-2.8V5.5L20 3v12a3 3 0 1 1-2-2.8V7.3L9 9.3z"/>',
 cam:'<path fill-rule="evenodd" d="M8.5 4 6.9 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2.9l-1.6-2zM12 8.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
 stats:'<path d="M4 20v-9h3.5v9zm6.3 0V4h3.4v16zm6.2 0v-6.5H20V20z"/>',
 set:'<path fill-rule="evenodd" d="M10.3 2h3.4l.5 2.6c.6.2 1.2.5 1.7.9l2.5-.9 1.7 2.9-2 1.7a7 7 0 0 1 0 1.8l2 1.7-1.7 2.9-2.5-.9c-.5.4-1.1.7-1.7.9l-.5 2.6h-3.4l-.5-2.6a7 7 0 0 1-1.7-.9l-2.5.9-1.7-2.9 2-1.7a7 7 0 0 1 0-1.8l-2-1.7 1.7-2.9 2.5.9c.5-.4 1.1-.7 1.7-.9zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
 send:'<path d="M3 20.5 21 12 3 3.5v6.6L15 12 3 13.9z"/>',
 play:'<path d="M7 4.5v15L20 12z"/>',
 end:'<path d="M12 9c-3.2 0-6.2.8-8.9 2.2-.5.3-.8.8-.7 1.4l.4 2.3c.1.7.8 1.2 1.5 1l3-.8c.6-.2 1-.7 1-1.3v-1.5c1.2-.4 2.4-.5 3.7-.5s2.5.1 3.7.5v1.5c0 .6.4 1.1 1 1.3l3 .8c.7.2 1.4-.3 1.5-1l.4-2.3c.1-.6-.2-1.1-.7-1.4A19 19 0 0 0 12 9z"/>',
 heart:'<path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 18.8 5 21 8.3 19.5 11.8 17.5 16.4 12 21 12 21z"/>',
 pin:'<path d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7z"/>',
 flash:'<path d="M9 2h6l-1 6h4l-8 14 1-9H7z"/>'};
const stAppDef={phone:['Phone','#62e57c','#1fb94a'],msgs:['Messages','#69c9ff','#0a7cff'],contacts:['Contacts','#c9ccd3','#7d8189'],map:['Maps','#ffe066','#ff8c1a'],bank:['Block Bank','#3fe08f','#05804e'],estate:['Property','#ff7b95','#d9133f'],jobs:['Jobs','#c78bff','#7419c9'],chirp:['Chirp','#58d5ff','#0a6fb8'],music:['Music','#ff7187','#e6143c'],cam:['Camera','#a5abb6','#3d4250'],stats:['Stats','#7ae9ff','#0b7c96'],set:['Settings','#a1a1a8','#46464c']};
const stGrid=['contacts','map','bank','estate','jobs','stats','cam','set'],stDock=['phone','msgs','chirp','music'];
const stWall='<svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMax slice" style="position:absolute;inset:0;width:100%;height:100%"><circle cx="64" cy="126" r="21" fill="#ffd598" opacity=".9"/><circle cx="64" cy="126" r="34" fill="#ffd598" opacity=".12"/><path d="M0 158 Q30 150 55 156 T100 154 V200 H0z" fill="#2a1446"/><path d="M0 170 Q40 162 100 172 V200 H0z" fill="#170b2c"/><path d="M20 200 C22 176 25 156 31 140" stroke="#0f0720" stroke-width="2" fill="none"/><path d="M31 140c-8-6-18-6-24 .5 8-2.5 16-.5 24-.5zm0 0c-2-9-10-15-18-15 7 3 13 8 18 15zm0 0c6-8 15-10 22-6-8 0-15 2-22 6zm0 0c8-2 16 2 20 9-6-4-13-6-20-9zm0 0c-5 3-9 9-10 16 3-6 6-11 10-16z" fill="#0f0720"/><path d="M84 200c1-16 3-29 7-40" stroke="#0f0720" stroke-width="1.5" fill="none"/><path d="M91 160c-6-4-13-4-17 .5 6-2 11-.5 17-.5zm0 0c-1-6-7-10-13-10 5 2 9 5 13 10zm0 0c4-6 11-7 15-4-5 0-10 1-15 4zm0 0c5-1 11 1 14 6-4-3-9-4-14-6z" fill="#0f0720"/></svg>';
const stStat='<svg viewBox="0 0 18 12" style="width:1.35em;height:.9em;fill:#fff"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity=".4"/></svg><svg viewBox="0 0 16 12" style="width:1.2em;height:.9em;fill:#fff"><path d="M8 2.2c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8 .5 10.6 10.6 0 0 0 .5 3.5l1.2 1.2A9 9 0 0 1 8 2.2zm0 3.4c1.5 0 2.9.6 4 1.6l1.2-1.2A7.4 7.4 0 0 0 8 3.9 7.4 7.4 0 0 0 2.8 6L4 7.2c1.1-1 2.5-1.6 4-1.6zM8 9a2 2 0 0 0-1.4.6L8 11l1.4-1.4A2 2 0 0 0 8 9z"/></svg>';
function stBat(){const b=Math.max(9,100-Math.floor((stS.play/45)%91));return '<span style="display:inline-flex;align-items:center;gap:.15em"><span style="width:1.9em;height:.95em;border-radius:.3em;border:.09em solid #ffffffaa;padding:.09em;box-sizing:border-box;display:inline-block"><span style="display:block;height:100%;width:'+b+'%;border-radius:.15em;background:'+(b<20?'#ff3b30':'#fff')+'"></span></span><span style="width:.12em;height:.35em;background:#ffffffaa;border-radius:0 .1em .1em 0"></span></span>'}
// ----- dom -----
const stPh=document.createElement('div');stPh.className='stp';stPh.id='stPhone';
stPh.innerHTML='<div class="stp-f"><div class="stp-s" id="stpS"><div class="stp-w">'+stWall+'</div><div class="stp-sb"><span id="stpT">9:41</span><span id="stpSI" style="display:flex;gap:.35em;align-items:center">'+stStat+stBat()+'</span></div><div class="stp-di" id="stpDI"></div><div class="stp-L stp-home" id="stpH"></div><div class="stp-L stp-app" id="stpA"></div><div class="stp-L stp-lock" id="stpLk"></div><div class="stp-nb" id="stpNB"></div><div class="stp-bar" data-k="bar"><i></i></div></div></div>';
document.body.appendChild(stPh);
const stEl=id=>document.getElementById(id);
const stNB=document.createElement('div');stNB.id='stNB';document.body.appendChild(stNB);
const stFl=document.createElement('div');stFl.className='stp-flash';document.body.appendChild(stFl);
let stApp='home',stPhOpen=false,stCam=false,stLocked=true,stPhTab='rec',stDialS='',stNbId=null,stNbT=0,stPhNbT=0,stCallO=null,stCallCollect=null,stMusicOk=typeof auST!=='undefined'&&typeof auR!=='undefined';
function stLayout(){const W=innerWidth,H=innerHeight;let h,b,r;
 const rect=id=>{const e=$(id);if(!e||e.offsetParent===null)return null;const q=e.getBoundingClientRect();return q.width?q:null};
 const rs=['fire','car','jump','wpn'].map(rect).filter(Boolean);
 if(H>=W){const top0=rs.length?Math.min.apply(null,rs.map(q=>q.top)):H*.68;h=Math.min(500,top0-160);if(h>=340){b=H-top0+12;r=10}else{h=Math.min(500,H*.62);b=10;r=10}}
 else{h=Math.min(460,H-18);const l0=rs.length?Math.min.apply(null,rs.map(q=>q.left)):W*.72;r=Math.max(10,W-l0+10);b=(H-h)/2;if(W-r-h*.49<W*.36){r=10}}
 const w=Math.round(h*.49);stPh.style.width=w+'px';stPh.style.height=Math.round(h)+'px';stPh.style.right=Math.round(r)+'px';stPh.style.bottom='calc(env(safe-area-inset-bottom,0px) + '+Math.round(b)+'px)';stPh.style.fontSize=(w/245*13).toFixed(2)+'px'}
function stIcon(a,big){const D=stAppDef[a],bd=(a==='msgs'&&stUnread())?'<span class="stp-bd">'+stUnread()+'</span>':((a==='phone'&&stC.miss)?'<span class="stp-bd">'+stC.miss+'</span>':((a==='jobs'&&typeof msOffers!=='undefined'&&msOffers.length&&msType<0)?'<span class="stp-bd" style="background:#ff9f0a">'+msOffers.length+'</span>':''));
 return '<div class="stp-i" data-k="app:'+a+'"><div class="stp-ic" style="background:linear-gradient(165deg,'+D[1]+','+D[2]+')">'+stSvg(stGl[a])+'</div>'+bd+(big?'':'<span class="l">'+D[0]+'</span>')+'</div>'}
function stHomeDraw(){let h='<div class="stp-wd" data-k="app:bank"><div><div style="font-size:.75em;opacity:.75;letter-spacing:.06em">BLOCK BANK</div><div style="font-size:1.45em;font-weight:700">'+stM(cash)+'</div></div><div style="text-align:right"><div style="font-size:.75em;opacity:.75">'+stTod().toUpperCase()+'</div><div style="font-size:.95em;font-weight:600">'+(wanted>0?'&#9733;'.repeat(wanted):stDist())+'</div></div></div><div class="stp-g">';
 for(const a of stGrid)h+=stIcon(a);h+='</div><div class="stp-dock">';for(const a of stDock)h+=stIcon(a,true);h+='</div>';stEl('stpH').innerHTML=h}
function stLockDraw(){const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],d=Math.floor(stS.play/1200)+2;let n='';
 const ids=Object.keys(stC.u).filter(k=>stC.u[k]>0).slice(0,2);for(const id of ids){const L=stC.t[id]||[],m=L[L.length-1];if(m)n+='<div style="width:86%;margin-top:.5em;border-radius:1.3em;background:#ffffff2a;padding:.6em .7em;display:flex;gap:.55em;align-items:center">'+stAvI(id,2.3)+'<div class="stp-t"><b style="font-size:.9em">'+stE(stWho(id).n)+'</b><div class="stp-sub" style="color:#fffc">'+stE(m[1])+'</div></div></div>'}
 stEl('stpLk').innerHTML='<div style="font-size:.95em;font-weight:600;opacity:.9;margin-top:.6em">'+days[d%7]+', Block City</div><div style="font-size:5.2em;font-weight:200;letter-spacing:-.03em;line-height:1.05;text-shadow:0 .05em .2em #0004">'+stClk()+'</div>'+n+'<div style="position:absolute;bottom:3em;left:0;right:0;text-align:center;font-size:.85em;opacity:.8">Swipe up to open</div><div style="position:absolute;bottom:2.6em;left:1.7em;width:3.1em;height:3.1em;border-radius:50%;background:#0006;display:flex;align-items:center;justify-content:center">'+stSvg(stGl.flash,' style="width:45%;height:45%;fill:#fff"')+'</div><div style="position:absolute;bottom:2.6em;right:1.7em;width:3.1em;height:3.1em;border-radius:50%;background:#0006;display:flex;align-items:center;justify-content:center">'+stSvg(stGl.cam,' style="width:45%;height:45%;fill:#fff"')+'</div>'}
function stUnlock(){if(!stLocked)return;stLocked=false;stEl('stpLk').classList.add('off')}
function stOpenPhone(a){if(stPhOpen){if(a)stGo(a);return}if(state!=='play')return;stPhOpen=true;stLayout();stHomeDraw();stLockDraw();stLocked=true;const L=stEl('stpLk');L.style.transition='none';L.classList.remove('off');void L.offsetWidth;L.style.transition='';
 stEl('stpA').classList.remove('on');stApp='home';stView=null;stPh.classList.add('on');stTick1();fireId=null;burstN=0;
 if(a){stUnlock();stGo(a)}else setTimeout(()=>{if(stPhOpen)stUnlock()},stUnread()?1400:650);stBadgeDraw()}
function stClosePhone(){if(!stPhOpen)return;stPhOpen=false;stView=null;stPh.classList.remove('on');stTry(()=>{const i=stPh.querySelector('input');if(i)i.blur()})}
function stGo(a,fromEl){stUnlock();if(a==='set'){stClosePhone();stTry(()=>uiOpenSet());return}if(a==='cam'&&false)return;stApp=a;stView=a.indexOf('chat:')===0?a.slice(5):null;if(stView){stC.u[stView]=0;stChatSave();stBadgeDraw()}if(a==='phone')stC.miss=0;
 const A=stEl('stpA'),S=stEl('stpS');if(fromEl&&!A.classList.contains('on')){const r=fromEl.getBoundingClientRect(),q=S.getBoundingClientRect();A.style.transformOrigin=((r.left+r.width/2-q.left)/q.width*100).toFixed(1)+'% '+((r.top+r.height/2-q.top)/q.height*100).toFixed(1)+'%'}else if(!A.classList.contains('on'))A.style.transformOrigin='50% 60%';
 stRender();A.classList.add('on')}
function stHome(){stApp='home';stView=null;stEl('stpA').classList.remove('on');stHomeDraw()}
function stBadgeDraw(){stBadge=stUnread()+(stC.miss||0);if(!stPhBtn)return;if(stDot.parentNode!==stPhBtn){stPhBtn.style.overflow='visible';stPhBtn.appendChild(stDot)}stDot.style.display=stBadge?'block':'none';stDot.textContent=stBadge}
// ----- notifications -----
function stNotify(id,txt){const w=stWho(id);if(stPhOpen&&!stLocked){if(stView===id)return;const N=stEl('stpNB');N.setAttribute('data-k','chat:'+id);N.innerHTML=stAvI(id,2.4)+'<div class="stp-t"><b style="font-size:.88em">'+stE(w.n)+' <span style="font-weight:400;opacity:.6;font-size:.85em">now</span></b><div class="stp-sub" style="color:#fffd">'+stE(txt)+'</div></div>';N.classList.add('on');stPhNbT=3.2;stHomeDraw();return}
 stNbId=id;stNB.innerHTML=stAv(w.c,w.n,36)+'<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:13px;display:flex;justify-content:space-between"><span>'+stE(w.n)+'</span><span style="opacity:.55;font-weight:500;font-size:11px">MESSAGES</span></div><div style="font-size:12.5px;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+stE(txt)+'</div></div>';stNB.classList.add('on');stNbT=4}
stNB.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();stNB.classList.remove('on');stNbT=0;if(stNbId&&state==='play'){stOpenPhone('chat:'+stNbId)}},{passive:false});
for(const ty of['touchmove','touchend'])stNB.addEventListener(ty,e=>e.stopPropagation());
// ----- voices -----
const stTTS=('speechSynthesis' in window)?window.speechSynthesis:null;let stVoices=[];
function stLoadV(){try{stVoices=stTTS.getVoices().filter(v=>/^en/i.test(v.lang))}catch(e){}}
if(stTTS){stLoadV();try{stTTS.addEventListener('voiceschanged',stLoadV)}catch(e){try{stTTS.onvoiceschanged=stLoadV}catch(x){}}}
const stFem=/samantha|karen|moira|tessa|victoria|fiona|allison|ava|susan|zira|serena|kate|nicky|female|joanna|salli|kimberly|ivy|emma|amy|libby|sonia|aria|jenny|michelle|hazel|catherine|martha|kathy|vicki|princess|grandma|flo|shelley|sandy/i,stMal=/daniel|alex|fred|aaron|arthur|gordon|rishi|tom|david|mark|male|guy|ryan|oliver|george|matthew|joey|justin|brian|eric|james|lee|reed|ralph|albert|bruce|junior|grandpa|rocko|eddy|aidan/i;
function stVoice(id){if(!stVoices.length)stLoadV();const g=stGen[id]||'m',L=stVoices.filter(v=>(g==='f'?stFem:stMal).test(v.name)),P=L.length?L:stVoices;if(!P.length)return null;let h=0;for(const ch of id)h=(h*31+ch.charCodeAt(0))>>>0;return P[h%P.length]}
function stSubsOn(){return stTry(()=>!(uiS&&uiS.subs===0),true)}
function stVol(){return stTry(()=>Math.max(0,Math.min(1,uiS.vol!==undefined?uiS.vol:1)),1)}
function stBabble(id,txt,done){const n=Math.min(40,Math.max(4,Math.round(txt.length/4))),base=(stGen[id]==='f'?220:120)*(stVP[id]?stVP[id][0]:1);let k=0;
 const step=()=>{if(k>=n){done();return}k++;stTry(()=>{if(!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(base*(.85+Math.random()*.4),t);o.frequency.linearRampToValueAtTime(base*(.8+Math.random()*.4),t+.09);f.type='bandpass';f.frequency.value=900+Math.random()*700;f.Q.value=2;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05*stVol(),t+.02);g.gain.linearRampToValueAtTime(0,t+.11);o.connect(f);f.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.13)});setTimeout(step,95+Math.random()*60)};step()}
function stSpeak(id,txt,done){let fin=false;const end=()=>{if(fin)return;fin=true;clearTimeout(tm);if(done)done()};const tm=setTimeout(end,txt.length*80+1600);
 if(stSubsOn()){const w=stWho(id);stSubQ.length=0;stSub.innerHTML='<b style="color:'+w.c+'">'+stE(w.n.split(' ')[0])+':</b> '+stE(txt);stSub.style.opacity=1;stSubT=Math.max(2.5,txt.length*.07)}
 if(stTTS&&stVol()>0){try{const u=new SpeechSynthesisUtterance(txt);const v=stVoice(id);if(v){u.voice=v;u.lang=v.lang}else u.lang='en-US';const p=stVP[id]||[1,1];u.pitch=p[0];u.rate=p[1];u.volume=stVol();u.onend=end;u.onerror=end;stTTS.speak(u);return}catch(e){}}
 stBabble(id,txt,end)}
function stHush(){stTry(()=>{if(stTTS)stTTS.cancel()})}
// ----- calls -----
let stRingI=null;
function stRingOn(on){if(stRingI){clearInterval(stRingI);stRingI=null}if(!on)return;const r=()=>{stTry(()=>{beep(988,.14,.07);setTimeout(()=>beep(784,.14,.07),170);setTimeout(()=>beep(988,.14,.07),340)});stTry(()=>{if(navigator.vibrate&&!(uiS&&uiS.vib===0))navigator.vibrate([180,120,180])})};r();stRingI=setInterval(r,1700)}
function stLogCall(id,k){stC.calls.unshift([id,k,Math.round(stS.play)]);if(stC.calls.length>25)stC.calls.length=25;if(k==='miss')stC.miss=(stC.miss||0)+1;stChatSave();stBadgeDraw()}
function stIncoming(id,lines,after){if(stCallO||state!=='play'){stAdd(id,2,lines.join(' '));stNotify(id,'Voicemail');return}stCallO={id:id,dir:'in',st:'ring',t:0,lines:lines.slice(),k:0,after:after||null,line:''};stOpenPhone('call');stRingOn(true);stDI()}
function stDial(id,act){if(stCallO)return;stCallO={id:id,dir:'out',st:'dial',t:0,lines:[],k:0,act:act,line:''};if(!stPhOpen)stOpenPhone('call');else stGo('call');stDI();stTry(()=>{beep(440,.35,.05);setTimeout(()=>beep(440,.35,.05),900)})}
function stCallLine(){const c=stCallO;if(!c||c.st!=='live')return;if(c.k>=c.lines.length){setTimeout(()=>{if(stCallO===c)stHang(true)},700);return}const t=c.lines[c.k++];c.line=t;stRender();stSpeak(c.id,t,()=>{if(stCallO===c)setTimeout(stCallLine,300)})}
function stAccept(){const c=stCallO;if(!c||c.st!=='ring')return;stRingOn(false);c.st='live';c.t=0;stLogCall(c.id,'in');stRender();setTimeout(stCallLine,500)}
function stDecline(){const c=stCallO;if(!c)return;stRingOn(false);if(c.dir==='in'&&c.st==='ring'){stAdd(c.id,2,c.lines.join(' '));stLogCall(c.id,'miss');stCallO=null;stDI();stNotify(c.id,'Left you a voicemail');if(stApp==='call')stHome();return}stHang(false)}
function stHang(nat){const c=stCallO;if(!c)return;stHush();stRingOn(false);stCallO=null;stDI();if(stApp==='call')stHome();if(c.after&&c.st==='live')stTry(c.after);stRender()}
function stDI(){const d=stEl('stpDI'),c=stCallO;if(c){d.classList.add('wide');d.innerHTML='<span style="width:.6em;height:.6em;border-radius:50%;background:#30d158"></span><span style="font-size:.78em;color:#30d158;font-weight:600">'+(c.st==='live'?Math.floor(c.t/60)+':'+String(Math.floor(c.t%60)).padStart(2,'0'):(c.dir==='in'?'Incoming':'Calling'))+'</span>'}else{d.classList.remove('wide');d.innerHTML=''}}
// ----- dialogue engine -----
const stInt=[['sorry',/\b(sorry|my bad|apolog|forgive)/],['insult',/\b(stupid|idiot|loser|hate you|shut up|trash|dumb|suck|ugly|annoying|clown|bozo)\b/],['compl',/\b(thank|thanks|thx|ty|love (it|you|ya)|great|awesome|amazing|legend|the best|nice one|appreciate|goat|beautiful)\b/],['food',/\b(hungry|food|eat|starving|broke|poor)\b/],['intel',/\b(intel|info|tip|plan|target|details)\b/],['price',/\b(how much|price|cost|fee)\b/],['job',/\b(job|work|gig|heist|score|hustle|money|cash|pay|rich|bread|business)\b/],['help',/\b(help|cops|police|wanted|heat|stars|trouble|busted|chasing|clear)\b/],['car',/\b(car|ride|wheels|vehicle|drive|garage|deliver)\b/],['home',/\b(house|home|apartment|condo|property|buy|place|crib)\b/],['where',/\b(where|wya|wru|location|address)\b/],['meet',/\b(meet|hang|come over|link|pull up|party|club|race|gym|tonight|tea)\b/],['joke',/\b(joke|funny|lol|lmao|haha|hehe|bored|lmfao)\b/],['how',/\b(how are|how r|hru|you good|u good|whats up|what's up|wyd|what you doing|how you)\b/],['greet',/^\s*(hi|hey|hello|yo|hiya|sup|morning|evening|gm|ayo|heyy+|wassup)\b/],['bye',/\b(bye|later|cya|gtg|gotta go|goodnight|good night|peace)\b/]];
const stYes=/^\s*(y|ya|yes|yeah|yep|yup|sure|ok|okay|do it|deal|bet|set it up|send it|lets go|let's go|i'?m in|im down|pick me up|race you|sounds good|go)\b/i,stNo=/^\s*(no|nah|nope|not now|pass|maybe later|never mind|nvm)\b/i;
const stPerOf=id=>({vee:'boss',jaz:'party',marc:'bro',nana:'nana',kai:'nerd',deke:'shady',taxi:'cab',mech:'mech',law:'law',agent:'agent'})[id]||'crew';
const stPer={
 boss:{greet:['You rang.','Talk to me.','Make it quick, three phones are going.'],how:['Busy. Money does not make itself.','Counting other peoples money. You?'],job:'@heist',intel:'@intel',where:['Somewhere with a view and no cameras.','If I told you I would have to move.'],meet:['We meet when there is money to split.'],help:'@help',insult:['Careful. I hire and I fire.','Cute. Save that energy for the job.'],compl:['I know.','Flattery does not pay rent. Work does.'],joke:['The joke is the Block City PD.'],bye:['Phone stays on. Always.'],car:['Drivers handle wheels. I handle money.'],home:['Buy property. It cleans money and you need a bed.'],def:['Text me when you are ready to work.','Money talk only.','Mm.'],cold:['I do not do business with people who talk like that.'],hot:['{w} stars? Get off the street before you call me.'],chips:['Got a job?','Any intel?','How much is my cut?']},
 party:{greet:['heyyy','omg hiii','look who finally texts back'],how:['living my best life. you?','tired but cute lol','{tod} vibes honestly'],job:['babe I do brunch not crime','ask Vee, she knows people'],where:['at the beach getting a tan','Club Neon line is insane rn','getting ready, takes two hours minimum'],meet:'@party',help:'@helpparty',insult:['wow ok','rude. blocked. (not really. but rude)'],compl:['stoppp','I know I know','you are sweet'],joke:['why did the cop break up with the speed bump? too many ups and downs. ok I tried'],bye:['byeee','text me later!'],car:['pick me up in something nice'],home:['when do I get the tour of your place?'],def:['lol what','hahaha true','ok but did you see my story','wait what','no way'],cold:['k.'],hot:['are those sirens for YOU?? go hide'],chips:['Club tonight?','Wyd?','You good?']},
 bro:{greet:['yo!','what up bro','ayy my guy'],how:['just hit a PR on bench','hydrated and focused. you?','sore but thriving'],job:['only job I got is gains bro','heard the fixer pays good. ask her'],where:['gym. where else','muscle beach doing pullups'],meet:'@race',help:['bro just outrun them','cut through the alleys, cops hate alleys'],insult:['say that at the gym','ok tough guy'],compl:['appreciate you bro','you too man, you too'],joke:['tried a no carb diet. worst four minutes of my life'],bye:['later bro','stay swole'],car:['need torque bro. no sedans'],home:['you buy a place? home gym or no respect'],def:['bet','facts','lmaooo','for real'],cold:['whatever man'],hot:['bro you are ALL over the scanner lol'],chips:['Race me?','Leg day?','What up']},
 nana:{greet:['Hello sweetheart.','Oh, it is you! Hello dear.'],how:['My knees complain but I am fine, dear. Are you eating?','Watching my programs. Are you staying out of trouble?'],job:['Work hard and be honest, dear. Mostly honest.'],where:['Home, where else. The kettle is on.'],meet:['Come by for tea any time. I made too many cookies again.'],help:'@helpnana',food:'@food',insult:['Well I never. I will pray for you, dear.','That is not how you were raised.'],compl:['Oh stop it, you will make me blush.','You were always a good one.'],joke:['Knock knock. Who is there? Your Nana. Call more often.'],bye:['Bye dear, wear a jacket.','Goodnight sweetheart.'],car:['Drive slow, dear. Those streets are full of maniacs.'],home:['A home of your own! I am so proud.'],def:['Oh that is nice dear.','I do not understand these texting words, dear.','Mm hm.'],cold:['I will wait for an apology, dear.'],hot:['I saw sirens on the news near {d}. Please be careful.'],chips:['Hi Nana','I am hungry','How are you?']},
 nerd:{greet:['sup','hey. make it interesting'],how:['compiling. always compiling','three monitors, zero sunlight. great'],job:'@hack',help:'@hack',where:['server room. it is cold and I love it'],meet:['in person? bold of you'],insult:['ok I just changed your contact name to something embarrassing','error 404: respect not found'],compl:['finally someone recognises genius','acknowledged'],joke:['there are 10 kinds of people. those who get binary and those who do not'],bye:['logging off'],car:['I could unlock any car on this street. I choose not to. mostly'],home:['make sure your place has fiber or do not invite me'],def:['interesting. no','k','sure','that is a bug, not a feature'],cold:['blocked (in spirit)'],hot:['your face is lighting up every police scanner'],chips:['Clear my stars','Any tech?','Sup']},
 shady:{greet:['who is this. oh. you.','yeah?'],how:['moving metal. always moving metal'],job:'@car',car:'@car',price:'@car',where:['you do not need to know where my lot is'],meet:['we do not meet. cars just appear'],help:['heat? swap cars. I can help with that','{w} stars? ditch the ride, I got another'],insult:['price just went up'],compl:['flattery does not get discounts. ok maybe a little'],joke:['my cars are like my jokes. borrowed'],bye:['delete this chat'],home:['need a garage? buy one. cars need homes too'],def:['say less','not my problem','mm','we will see'],cold:['lose my number'],chips:['Need a car','How much?','Any deals?']},
 cab:{greet:['Block Cab, where to?'],def:'@taxi',where:'@taxi',meet:'@taxi',car:'@taxi',job:['We drive, we do not hire. Try the Jobs app.'],help:['Cab rule: no passengers with stars. Lose the cops first.'],insult:['Tips are optional, manners are not.'],compl:['Five stars for you too.'],bye:['Ride safe.'],chips:['Pick me up','How much?','Thanks']},
 mech:{greet:['Otto Garage, talk.'],def:'@deliver',car:'@deliver',where:'@deliver',help:['Respray at a body shop clears heat. I just move cars.'],insult:['I have heard worse from engines.'],compl:['Cheers.'],bye:['Keep it between the lines.'],chips:['Bring my car','How much?','Thanks Otto']},
 law:{greet:['Sol Greaves. Billing starts now.'],def:'@law',help:'@law',price:'@law',insult:['That will be an extra fee.'],compl:['Flattery is billable too.'],bye:['Do not call me from jail.'],chips:['Clear my record','How much?','Thanks Sol']},
 agent:{greet:['Dana Pryce, Block City Realty!'],def:'@agent',home:'@agent',price:'@agent',compl:'@disc',insult:['I have sold houses to worse people. Barely.'],bye:['Happy house hunting!'],chips:['Any deals?','What is for sale?','You are the best']},
 crew:{greet:['Yo.','Ready when you are.'],how:'@role',job:['Vee calls the shots. Hit her up.'],where:['Around. Close enough.'],meet:['Next job. Not before.'],help:['Lose them in the alleys. Do not lead them to us.'],insult:['Keep that up and find a new crew.'],compl:['Respect.'],joke:['Funny. Now focus.'],bye:['Later.'],def:['Copy.','Roger.','Hm.'],cold:['We are done talking.'],chips:['You ready?','What is up?','Good work']}};
const stGenL={sorry:['Fine. We are good.','Apology accepted. This time.'],price:['Depends what you want.'],intel:['No intel here.'],food:['Get a hot dog from a cart.']};
function stPick(id,arr){if(!arr||!arr.length)return '...';const last=stC.ll[id];let i=Math.floor(Math.random()*arr.length);if(arr.length>1&&arr[i]===last)i=(i+1)%arr.length;stC.ll[id]=arr[i];return arr[i]}
function stFill(s){return s.replace('{w}',wanted).replace('{tod}',stTod()).replace('{d}',stDist()).replace('{cash}',stM(cash))}
function stFare(w){return Math.max(40,Math.round(Math.hypot(w.x-pos.x,w.z-pos.z)*1.2/10)*10)}
function stSpecial(id,k,it){const h=stS.h;
 if(k==='heist'){if(stS.done>=3)return {t:'You cleaned out this city. Lay low a while.'};if(h&&h.stage!=='plan')return {t:'Focus. '+stStageText()+'.'};const H=stHeist()[stS.done];return {t:'I have '+H.n+' lined up. '+stM(H.take)+' on the table. Want me to set it up?',act:{k:'heist',y:'Set it up'}}}
 if(k==='intel'){if(h&&h.stage!=='plan')return {t:'Intel: '+stStageText()+'. '+(stH&&stH.tg?'Target is about '+Math.round(Math.hypot(stH.tg.x-pos.x,stH.tg.z-pos.z))+' m from you.':'')};return stSpecial(id,'heist')}
 if(k==='help'){if(wanted>0)return {t:wanted+' stars? Call Sol the lawyer, or get off the street.'};return {t:'Help with what? You are clean.'}}
 if(k==='helpparty')return {t:wanted>0?'are those sirens for YOU?? go hide':'help with what babe'};
 if(k==='helpnana')return {t:wanted>0?'I heard sirens on the news. Please be careful, dear.':'What is wrong, dear? Are you hungry?'};
 if(k==='party'){const P=stProps.find(p=>p.id==='club');return {t:'Club Neon tonight? I will put you on the list',act:{k:'party',y:'I am in',x:P?P.x:0,z:P?P.z:0}}}
 if(k==='race'){if(typeof msType!=='undefined'&&msType>=0)return {t:'finish your gig first then we race'};return {t:'race me. checkpoints across town, loser buys protein. you in?',act:{k:'race',y:'Race you'}}}
 if(k==='food'){if(stS.play-(stC.flags.food||-999)<600)return {t:'I already sent you something, dear. Spend it on vegetables.'};return {t:'You sound hungry. I am sending you a little something for food, dear.',act:{k:'food',now:1}}}
 if(k==='hack'){if(wanted<1)return {t:'you are clean. if you get heat I can scrub one star off the police database. $1,000 a pop'};if(stS.play-(stC.flags.hack||-999)<180)return {t:'their firewall is still hot from last time. give it a few minutes'};return {t:'I can scrub one star off the police database. $1,000. want it?',act:{k:'hack',p:1000,y:'Do it'}}}
 if(k==='car')return {t:'got a clean sports car. no plates, no questions. $750 and I drop it at your feet. deal?',act:{k:'car',p:750,y:'Deal'}};
 if(k==='taxi'){const w=stTry(()=>mpWay,null);if(!w)return {t:'Drop a pin on your map, then text me again.'};if(wanted>0)return {t:'Not with that heat on you. Lose the cops first.'};const f=stFare(w);return {t:'Pin received. '+stM(f)+' to get you there. Want a ride?',act:{k:'taxi',p:f,y:'Pick me up'}}}
 if(k==='deliver'){if(stTry(()=>cpSave.car,null)===null)return {t:'Nothing of yours in the garage. Park a car on the blue ring at your safehouse first.'};return {t:'Your car is ready. $250 and it is parked next to you. Want it?',act:{k:'deliver',p:250,y:'Bring it'}}}
 if(k==='law'){if(wanted<1)return {t:'You are clean. Keep it that way.'};if(wanted>2)return {t:'Even I cannot fix '+wanted+' stars. Hide first, then call.'};const fee=wanted*2000;return {t:'I can make '+wanted+' star'+(wanted>1?'s':'')+' disappear for '+stM(fee)+'. Shall I?',act:{k:'law',p:fee,y:'Do it'}}}
 if(k==='agent'){const L=stProps.filter(p=>!stOwn(p)).slice(0,3).map(p=>p.n+' '+stM(stPrice(p)));return {t:L.length?'Hot listings: '+L.join(', ')+'. Everything is in the Property app.':'You own everything I have. I am almost jealous.'}}
 if(k==='disc'){if(stS.disc)return {t:'You already have 10% off your next property!'};if((stC.mood[id]||0)>=1){stS.disc=.9;stStore();return {t:'You are a sweetheart. 10% off your next property, it is on me.'}}return {t:'Aw, thank you!'}}
 if(k==='role'){const r=(stCrew[id]||{}).r;return {t:r==='Driver'?'Tuning the getaway car.':(r==='Gunman'?'Cleaning my gear.':'Watching cameras I should not be watching.')}}
 return {t:'...'}}
function stDoAct(id,a){if(!a)return null;
 if(a.p&&cash<a.p)return {t:'That is '+stM(a.p)+' and you have '+stM(cash)+'. Come back with money.'};
 if(a.k==='heist'){setTimeout(()=>{if(state==='play'){stClosePhone();stPlan()}},900);return {t:'Opening the board. Pick your crew.'}}
 if(a.k==='party'){stWay(a.x,a.z);return {t:'yay! pinned it on your map. dress nice'}}
 if(a.k==='race'){if(typeof msAcceptType==='function'&&msAcceptType(3))return {t:'start line is on your map. GO'};return {t:'finish your gig first'}}
 if(a.k==='food'){stC.flags.food=stS.play;cash+=100;stTx('From Nana',100);return {t:'Sent you $100. Eat something green.'}}
 if(a.k==='hack'){if(wanted<1)return {t:'you are already clean'};stPay(a.p,'Kai: database scrub');stC.flags.hack=stS.play;const th=[1,3,6,10,16];wantedScore=wanted>=2?th[wanted-2]:0;evade=0;return {t:'done. one star gone. you never saw me'}}
 if(a.k==='car'){if(driving||stTry(()=>!!cpIn,false))return {t:'get out on the street first'};stPay(a.p,'Deke: car drop');const m=makeCar(carColors[Math.floor(Math.random()*carColors.length)],.1);m.position.set(pos.x+3.2,0,pos.z);collide(m.position,1.9);m.rotation.y=facing;scene.add(m);cars.push({m,speed:0,steer:0});return {t:'look to your right. enjoy. we never talked'}}
 if(a.k==='taxi'){const w=stTry(()=>mpWay,null);if(!w)return {t:'Pin is gone. Drop it again.'};if(driving||stTry(()=>!!cpIn,false))return {t:'Step out to the street first.'};stPay(a.p,'Taxi fare');const go=()=>{pos.set(w.x,.3+stTry(()=>Math.max(0,ldFloor(w.x,w.z)),0),w.z);vel.set(0,0,0);collide(pos,.6)};stTry(()=>cpFade(go),go());return {t:'Here you go. Thanks for riding Block Cab.'}}
 if(a.k==='deliver'){if(stTry(()=>cpSave.car,null)===null)return {t:'Garage is empty.'};if(driving||stTry(()=>!!cpIn,false))return {t:'Call me when you are on the street.'};stPay(a.p,'Car delivery');const m=makeCar(cpSave.car,.9);m.position.set(pos.x+3.2,0,pos.z);collide(m.position,1.9);m.rotation.y=facing;scene.add(m);cars.push({m,speed:0,steer:0});cpSave.car=null;stTry(()=>cpStore());return {t:'Parked right next to you.'}}
 if(a.k==='law'){if(wanted<1)return {t:'Nothing to clear.'};if(!stPay(a.p,'Legal fees'))return {t:'My fee is '+stM(a.p)+'.'};wantedScore=0;evade=0;stS.lawT=T;return {t:'Charges dropped. Pleasure doing business.'}}
 return null}
function stReply(id,txt){const low=String(txt).toLowerCase().trim(),P=stPer[stPerOf(id)]||stPer.crew,act=stC.act[id];
 if(act&&stYes.test(low)){stC.act[id]=null;return stDoAct(id,act)||{t:'Done.'}}
 if(act&&stNo.test(low)){stC.act[id]=null;return {t:stPick(id,['No worries.','Your loss.','Offer stands. For now.'])}}
 let it='def';for(const a of stInt)if(a[1].test(low)){it=a[0];break}
 if(it==='price'&&act&&act.p)return {t:'It is '+stM(act.p)+'.',act:act};
 const m=stC.mood[id]||0;if(it==='insult')stC.mood[id]=Math.max(-3,m-1);else if(it==='compl')stC.mood[id]=Math.min(3,m+1);else if(it==='sorry')stC.mood[id]=Math.min(3,m+2);
 if((stC.mood[id]||0)<=-2&&it!=='sorry'&&it!=='compl')return {t:stPick(id,P.cold||P.def)};
 if(wanted>=2&&(it==='greet'||it==='how')&&P.hot)return {t:stFill(stPick(id,P.hot))};
 let L=P[it];if(L===undefined)L=stGenL[it];if(L===undefined)L=P.def;
 if(typeof L==='string'&&L[0]==='@')return stSpecial(id,L.slice(1),it);
 return {t:stFill(stPick(id,L))}}
function stChips(id){const a=stC.act[id];if(a){const P=stPer[stPerOf(id)]||stPer.crew;return [a.y||'Yes, do it','Not now',a.p?'How much?':((P.chips||['Thanks'])[1])]}const P=stPer[stPerOf(id)]||stPer.crew,c=(P.chips||['Hey','What is up?','Thanks']).slice();if(wanted>0&&stPerOf(id)!=='law')c[2]='Cops are on me';return c}
function stSend(id,txt){txt=String(txt||'').trim().slice(0,160);if(!txt)return;stAdd(id,1,txt);if(stView===id)stRender();const r=stReply(id,txt),now=performance.now(),d=900+Math.min(2600,r.t.length*45)+Math.random()*700;
 stPend.push({at:now+500,fn:()=>{stTyping[id]=1;if(stView===id)stRender()}});
 stPend.push({at:now+d,fn:()=>{stTyping[id]=0;stAdd(id,0,r.t);if(r.act)stC.act[id]=r.act;else if(stC.act[id]&&stC.act[id].now){stC.act[id]=null}
  if(r.act&&r.act.now){const x=stDoAct(id,r.act);stC.act[id]=null;if(x)stPend.push({at:performance.now()+1200,fn:()=>{stAdd(id,0,x.t);if(stView===id)stRender();else stNotify(id,x.t)}})}
  if(stView===id)stRender();else stNotify(id,r.t);stTry(()=>beep(1700,.06,.06))}})}
// ----- outgoing calls (contacts) -----
function stCall(k){if(stCallO)return;stDial(k,()=>{stCallCollect=[];const r=stCallAct(k);const lines=stCallCollect;stCallCollect=null;return {lines:lines.length?lines:['Hello?'],after:r}})}
function stCallAct(k){
 if(k==='vee'){if(stS.done>=3)stSay('vee','Three for three. Take a holiday, you earned it.');else if(stS.h&&stS.h.stage!=='plan')stSay('vee','You are mid job. '+stStageText()+'.');else{stSay('vee','I have a job with your name on it. Come look at the board.');return ()=>{stClosePhone();stPlan()}}return null}
 if(k==='taxi'){const w=stTry(()=>mpWay,null)||stTry(()=>(beam.visible?mission.target:null),null);if(driving||stTry(()=>!!cpIn,false)){stSay('taxi','Step out to the street first.');return null}if(wanted>0){stSay('taxi','Not with that heat on you.');return null}if(!w){stSay('taxi','Drop a marker on your map first, then call me.');return null}
  const fare=stFare(w);if(cash<fare){stSay('taxi','Fare is '+stM(fare)+'. Come back with cash.');return null}stSay('taxi','Hop in. '+stM(fare)+'. Hold on.');return ()=>{stPay(fare,'Taxi fare');const go=()=>{pos.set(w.x,.3+stTry(()=>Math.max(0,ldFloor(w.x,w.z)),0),w.z);vel.set(0,0,0);collide(pos,.6)};stTry(()=>cpFade(go),go())}}
 if(k==='mech'){if(stTry(()=>cpSave.car,null)===null){stSay('mech','Nothing of yours in the garage. Park a car on the blue ring at your safehouse first.');return null}if(driving||stTry(()=>!!cpIn,false)){stSay('mech','Call me when you are standing on the street.');return null}if(cash<250){stSay('mech','Delivery is $250.');return null}stSay('mech','On its way. Two fifty.');return ()=>{const r=stDoAct('mech',{k:'deliver',p:250})}}
 if(k==='law'){if(wanted<1){stSay('law','You are clean. Keep it that way.');return null}if(wanted>2){stSay('law','Even I cannot fix '+wanted+' stars. Hide first.');return null}if(T-stS.lawT<120&&T>=stS.lawT){stSay('law','I just called in a favour. Give it a couple of minutes.');return null}const fee=wanted*2000;if(cash<fee){stSay('law','My fee is '+stM(fee)+'.');return null}stSay('law','Consider it handled. '+stM(fee)+'.');return ()=>{stDoAct('law',{k:'law',p:fee})}}
 if(k==='agent'){stSay('agent','Everything I have is in the Property app. Signs are up at each address. I will open it for you.');return ()=>{stGo('estate')}}
 const r=stReply(k,'hey whats up');stSay(k,r.t);if(r.act){stC.act[k]=r.act;stSay(k,'Text me if you want it.')}return null}
const stSay0=stSay;stSay=function(who,t){if(stCallCollect){stCallCollect.push(t);return}stSay0(who,t)};
// ----- social feed -----
const stHandles=[['sally','Sally Vega','@sunsetsally','#ff9f0a'],['news','Block City News','@blockcitynews','#ff3b30'],['dre','Dre','@beachbum_dre','#30d158'],['neon','Neon Nights','@neonnights','#bf5af2'],['traffic','BC Traffic','@bctraffic','#ffd60a'],['gary','Gary','@grumpygary','#8e8e93'],['jaz','Jasmine Ortega','@jazzyjaz','#ff5fa2'],['marc','Marcus Bell','@marcuslifts','#2fa7ff'],['kai','Kai Tanaka','@kai_dev','#1fc7a8']];
const stAmb=[['sally','sunset on Ocean Drive hits different tonight'],['dre','who keeps parking a tank outside the army base gate?? oh wait'],['gary','third pothole on my street this week. great job city hall'],['neon','doors open at 10. dress code: shine'],['traffic','heavy traffic downtown, avoid the main avenue'],['jaz','new nails who dis'],['marc','reminder: rest days are for the weak'],['kai','just watched someone steal a car with the doors open. respect the efficiency'],['news','Mayor promises "fewer explosions" in new budget'],['sally','the ferris wheel at night is my whole personality'],['gary','someone drove a boat onto the beach. a BOAT'],['dre','ocean was perfect today'],['news','Airport reports another "unscheduled departure"'],['neon','DJ set starting now']];
function stPost(h,t){stC.feed.unshift([h,t,Math.floor(Math.random()*90)+3,Math.round(stS.play),0]);if(stC.feed.length>30)stC.feed.length=30;stChatSave()}
if(!stC.feed.length)for(let i=0;i<5;i++)stPost(stAmb[i][0],stAmb[i][1]);
// ----- events for proactive texts and posts -----
let stEvW=0,stEvDone=stS.done,stEvOwn=Object.keys(stS.own).length,stEvKills=kills,stEvDead=false,stEvPass=stTry(()=>msPassed,0);
function stEventsTick(){
 if(wanted>=3&&stEvW<3){stPost('news','Police pursuit underway near '+stDist()+'. Avoid the area.');if(Math.random()<.6)stPend.push({at:performance.now()+6000,fn:()=>stMsg('kai','your face is lighting up every police scanner. want me to scrub a star? $1,000',{k:'hack',p:1000,y:'Do it'})})}
 stEvW=wanted;
 if(stS.done>stEvDone){stEvDone=stS.done;const H=stHeist()[stS.done-1];stPost('news','BREAKING: '+H.n+' robbery leaves police baffled. Suspects still at large.');stPend.push({at:performance.now()+9000,fn:()=>stMsg('jaz','WAIT. was that you on the news??')});stPend.push({at:performance.now()+16000,fn:()=>stMsg('nana','Dear, the news mentioned a robbery. Please tell me you were home.')})}
 const own=Object.keys(stS.own).length;if(own>stEvOwn){stEvOwn=own;stPost('gary','new neighbours just moved in. if they are loud I am calling someone');stPend.push({at:performance.now()+7000,fn:()=>stMsg('nana','A new home! I am baking you cookies.')})}
 if(kills-stEvKills>=6){stEvKills=kills;stPost('news','Reports of gunfire near '+stDist()+'. Residents urged to stay indoors.')}
 const p=stTry(()=>msPassed,0);if(p>stEvPass){stEvPass=p;if(p%3===0)stPost('traffic','some maniac just hit 100 through '+stDist()+'. send help')}
 if(state==='dead'&&!stEvDead){stEvDead=true;stPend.push({at:performance.now()+12000,fn:()=>stMsg('marc','heard you got sent to the hospital lol you good?')})}else if(state!=='dead')stEvDead=false}
function stProactive(){const h=stHour(),r=Math.random();
 if((h>=20||h<3)&&r<.5){const P=stProps.find(p=>p.id==='club');stMsg('jaz','Club Neon tonight? I can get you on the list',{k:'party',y:'I am in',x:P?P.x:0,z:P?P.z:0});return}
 if(h>=6&&h<11&&r<.5){stMsg('marc','leg day. you coming or what');return}
 const opts=[()=>stMsg('deke','got a clean ride, barely used. $750, dropped at your feet. interested?',{k:'car',p:750,y:'Deal'}),()=>stMsg('nana','Just checking on you, dear. Are you eating properly?'),()=>{if(typeof msType!=='undefined'&&msType<0)stMsg('marc','race me. checkpoints across town. you in?',{k:'race',y:'Race you'});else stMsg('marc','yo what you up to')},()=>stMsg('kai','found a bug in the city traffic lights. not fixing it. just letting you know'),()=>stMsg('jaz','ok but who was the guy jumping a motorbike off the pier earlier lol')];
 opts[Math.floor(Math.random()*opts.length)]()}
function stRandomCall(){const r=Math.random(),h=stHour();
 if((h>=19||h<3)&&r<.4){const P=stProps.find(p=>p.id==='club');stIncoming('jaz',['Heyyy! Okay so, Club Neon tonight.','I put you on the list. Do not make me wait outside!'],()=>{if(P)stWay(P.x,P.z)});return}
 if(r<.6)stIncoming('nana',['Hello sweetheart, it is Nana.','I just wanted to hear your voice. Are you eating?','Call your Nana more often. Bye now.']);
 else if(r<.8)stIncoming('marc',['Yo bro! You hit the gym today?','Text me if you want to race. Loser buys protein.']);
 else stIncoming('deke',['It is Deke. Do not say my name on the phone.','I got cars. Text me if you need wheels.'])}
// ----- render apps -----
function stHdr(t,back,right){return '<div class="stp-hd"><span class="stp-bk" data-k="'+(back||'home')+'">&lsaquo; '+(back&&back!=='home'?'Back':'')+'</span><b style="flex:1">'+t+'</b>'+(right||'')+'</div>'}
function stRender(){const A=stEl('stpA');if(!A)return;let h='';const a=stApp;
 if(a==='msgs'){h+=stHdr('Messages','home');h+='<div class="stp-sc" id="stpSc">';const ids=Object.keys(stC.t).filter(k=>(stC.t[k]||[]).length).sort((x,y)=>(stC.last[y]||0)-(stC.last[x]||0));
  if(!ids.length)h+='<div class="stp-sub" style="padding:1em 0">No conversations yet. Text someone from Contacts.</div>';
  for(const id of ids){const L=stC.t[id],m=L[L.length-1],u=stC.u[id]||0,w=stWho(id);h+='<div class="stp-row" data-k="chat:'+id+'">'+(u?'<span class="stp-dot"></span>':'<span style="width:.62em"></span>')+stAvI(id)+'<div class="stp-t"><b>'+stE(w.n)+'</b><div class="stp-sub">'+(m[0]===2?'&#9654; Voicemail':(m[0]===1?'You: ':'')+stE(m[1]))+'</div></div><span class="stp-sub" style="align-self:flex-start;margin-top:.2em">'+stAgo(m[2])+'</span></div>'}
  h+='<div style="margin-top:.8em"><span class="stp-btn g" data-k="app:contacts">New message</span></div></div>'}
 else if(a.indexOf('chat:')===0){const id=a.slice(5),w=stWho(id),L=stC.t[id]||[];
  h+='<div class="stp-hd" style="position:relative;flex-direction:column;gap:.25em;padding-bottom:.6em;border-bottom:.06em solid #ffffff17"><span class="stp-bk" data-k="app:msgs" style="position:absolute;left:1em;top:3.4em">&lsaquo;</span>'+stAvI(id,3.1)+'<span style="font-size:.85em;font-weight:600">'+stE(w.n)+' &rsaquo;</span><span style="font-size:.7em;opacity:.55">'+(stTyping[id]?'typing...':(w.r||'mobile'))+'</span><span data-k="call:'+id+'" style="position:absolute;right:1em;top:3.4em" class="stp-ib">'+stSvg(stGl.phone)+'</span></div>';
  h+='<div class="stp-sc" id="stpSc" style="padding:0"><div class="stp-chat">';let lastTs=-1e9;
  L.slice(-30).forEach((m,i,arr)=>{if(m[2]-lastTs>240)h+='<div class="stp-ts">'+(m[2]<1?'Earlier':(stAgo(m[2])==='now'?'Today':'Today, '+stAgo(m[2])+' ago'))+'</div>';lastTs=m[2];const idx=L.length-arr.length+i;
   if(m[0]===2)h+='<div class="stp-m i stp-vm" data-k="vm:'+id+':'+idx+'"><span class="stp-ib" style="width:1.9em;height:1.9em;background:#ffffff22">'+stSvg(stGl.play,' style="fill:#fff"')+'</span><span>'+[5,9,6,12,8,14,7,11,5,9,13,6,10,4].map(v=>'<i style="height:'+(v*.08)+'em"></i>').join('')+'</span><span class="stp-sub">0:'+String(Math.min(59,Math.round(m[1].length/12))).padStart(2,'0')+'</span></div>';
   else h+='<div class="stp-m '+(m[0]===1?'o':'i')+'">'+stE(m[1])+'</div>'});
  if(stTyping[id])h+='<div class="stp-typ"><i></i><i></i><i></i></div>';
  h+='</div></div><div class="stp-chips">'+stChips(id).map((c,i)=>'<span class="stp-chip" data-k="chip:'+i+'">'+stE(c)+'</span>').join('')+'</div><div class="stp-inp"><input id="stpIn" type="text" maxlength="160" placeholder="Text message" autocomplete="off" autocorrect="on" enterkeyhint="send" data-k="inp"><span class="stp-send" data-k="send">'+stSvg(stGl.send)+'</span></div>'}
 else if(a==='contacts'){h+=stHdr('Contacts','home');h+='<div class="stp-sc" id="stpSc">';let last='';const ids=stAll.slice().sort((x,y)=>stWho(x).n.localeCompare(stWho(y).n));
  for(const id of ids){const w=stWho(id),L=w.n.replace(/"[^"]*"\s*/,'')[0];if(L!==last){last=L;h+='<div style="font-size:.75em;font-weight:700;color:#ffffff66;margin-top:.6em">'+L+'</div>'}
   h+='<div class="stp-row">'+stAvI(id,2.6)+'<div class="stp-t"><b>'+stE(w.n)+'</b><div class="stp-sub">'+stE(w.r||'')+' &middot; '+stNum(id)+'</div></div><span class="stp-ib" data-k="chat:'+id+'">'+stSvg(stGl.msgs,' style="fill:#0a84ff"')+'</span><span class="stp-ib" data-k="call:'+id+'">'+stSvg(stGl.phone)+'</span></div>'}h+='</div>'}
 else if(a==='phone'){h+=stHdr(stPhTab==='rec'?'Recents':'Keypad','home');h+='<div class="stp-sc" id="stpSc"><div class="stp-tab"><span data-k="ptab:rec" class="'+(stPhTab==='rec'?'on':'')+'">Recents</span><span data-k="ptab:key" class="'+(stPhTab==='key'?'on':'')+'">Keypad</span><span data-k="app:contacts">Contacts</span></div>';
  if(stPhTab==='rec'){if(!stC.calls.length)h+='<div class="stp-sub" style="padding:1em 0">No recent calls</div>';for(const c of stC.calls.slice(0,15)){const w=stWho(c[0]);h+='<div class="stp-row" data-k="call:'+c[0]+'"><div class="stp-t"><b style="color:'+(c[1]==='miss'?'#ff453a':'#fff')+'">'+stE(w.n)+'</b><div class="stp-sub">'+(c[1]==='in'?'Incoming':(c[1]==='out'?'Outgoing':'Missed'))+'</div></div><span class="stp-sub">'+stAgo(c[2])+'</span></div>'}}
  else{h+='<div style="text-align:center;font-size:1.9em;font-weight:300;height:1.6em;margin:.3em 0 .5em;letter-spacing:.05em">'+(stDialS||'&nbsp;')+'</div><div class="stp-key">';for(const d of['1','2','3','4','5','6','7','8','9','*','0','#'])h+='<span data-k="key:'+d+'">'+d+'</span>';h+='<span style="visibility:hidden"></span><span data-k="kcall" style="background:#30d158">'+stSvg(stGl.phone,' style="width:40%;height:40%;fill:#fff"')+'</span><span data-k="kdel" style="background:none;font-size:1em">&#9003;</span></div>'}
  h+='</div>'}
 else if(a==='call'){const c=stCallO;if(!c){stApp='home';stHome();return}const w=stWho(c.id),tm=Math.floor(c.t/60)+':'+String(Math.floor(c.t%60)).padStart(2,'0');
  h+='<div class="stp-cbg" style="background:radial-gradient(120% 70% at 50% 25%,'+w.c+'88,#141418 70%)"></div><div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;height:100%;padding-top:4.2em;box-sizing:border-box">'+stAvI(c.id,6)+'<div style="font-size:1.6em;font-weight:500;margin-top:.5em">'+stE(w.n)+'</div><div class="stp-sub" style="font-size:.95em" id="stpCT">'+(c.st==='ring'?(c.dir==='in'?'mobile &middot; incoming call':'calling...'):(c.st==='dial'?'calling...':tm))+'</div>';
  h+='<div style="flex:1;display:flex;align-items:center;padding:0 1.2em;text-align:center;font-size:.95em;line-height:1.35;opacity:.92">'+(c.line?'&ldquo;'+stE(c.line)+'&rdquo;':'')+'</div>';
  if(c.st==='ring'&&c.dir==='in')h+='<div style="display:flex;justify-content:space-between;width:78%;margin-bottom:3.4em"><div style="text-align:center"><span class="stp-cb" data-k="dec" style="background:#ff3b30">'+stSvg(stGl.end)+'</span><div class="stp-sub" style="margin-top:.4em">Decline</div></div><div style="text-align:center"><span class="stp-cb" data-k="acc" style="background:#30d158">'+stSvg(stGl.phone)+'</span><div class="stp-sub" style="margin-top:.4em">Accept</div></div></div>';
  else h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.9em 1.4em;margin-bottom:1.1em">'+['mute','keypad','speaker'].map(x=>'<div style="text-align:center"><span class="stp-cb" style="background:#ffffff26;width:3.3em;height:3.3em;margin:0 auto"></span><div class="stp-sub" style="margin-top:.3em;font-size:.75em">'+x+'</div></div>').join('')+'</div><span class="stp-cb" data-k="end" style="background:#ff3b30;margin-bottom:3em">'+stSvg(stGl.end)+'</span>';
  h+='</div>'}
 else if(a==='bank'){h+=stHdr('Block Bank','home');let inc=0;for(const P of stProps)if(P.k==='biz'&&stOwn(P))inc+=Math.floor(stS.inc[P.id]||0);
  h+='<div class="stp-sc" id="stpSc"><div style="border-radius:1.2em;padding:1em;background:linear-gradient(135deg,#0f9b5f,#064d33 60%,#0b2b20);box-shadow:0 .4em 1em #0007;position:relative;overflow:hidden"><div style="position:absolute;right:-2em;top:-2em;width:7em;height:7em;border-radius:50%;background:#ffffff14"></div><div style="font-size:.72em;letter-spacing:.12em;opacity:.8">BLOCK BANK &middot; CHECKING</div><div style="font-size:2em;font-weight:700;margin:.25em 0">'+stM(cash)+'</div><div style="display:flex;justify-content:space-between;font-size:.78em;opacity:.85"><span>**** 4720</span><span>Income waiting '+stM(inc)+'</span></div></div>'+(inc>0?'<div style="margin-top:.7em"><span class="stp-btn y" data-k="collect">Collect '+stM(inc)+'</span></div>':'');
  h+='<div style="font-weight:700;margin:1em 0 .2em">Transactions</div>';if(!stS.tx.length)h+='<div class="stp-sub">No transactions yet</div>';for(const t of stS.tx.slice(0,12))h+='<div class="stp-row" style="justify-content:space-between"><span class="stp-t"><b style="font-weight:500">'+stE(t[0])+'</b></span><b style="color:'+(t[1]<0?'#ff8a80':'#30d158')+'">'+(t[1]<0?'-':'+')+stM(Math.abs(t[1]))+'</b></div>';h+='</div>'}
 else if(a==='estate'){h+=stHdr('Property','home',stS.disc?'<span class="stp-btn o" style="padding:.3em .6em">10% OFF</span>':'');h+='<div class="stp-sc" id="stpSc">';
  for(const P of stProps){const o=stOwn(P),pr=stPrice(P);h+='<div class="stp-card"><div class="stp-ph" style="background:'+stPhoto(P)+'">'+stSil(P)+(o?'<span style="position:absolute;left:.6em;top:.6em" class="stp-btn y">OWNED</span>':'')+'</div><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5em"><div class="stp-t"><b>'+stE(P.n)+'</b><div class="stp-sub" style="white-space:normal">'+stE(P.d)+'</div></div><b style="color:'+(o?'#30d158':'#fff')+';white-space:nowrap">'+(o?'Yours':stM(pr))+'</b></div><div style="margin-top:.55em;display:flex;gap:.4em">'+(o?'':'<span class="stp-btn" data-k="buy:'+P.id+'">Buy</span>')+(P.x!==undefined?'<span class="stp-btn g" data-k="way:'+P.id+'">'+stSvg(stGl.pin,' style="width:1em;height:1em;fill:#ff453a;margin-right:.3em"')+'Map</span>':'')+'</div></div>'}h+='</div>'}
 else if(a==='jobs'){h+=stHdr('Jobs','home');h+='<div class="stp-sc" id="stpSc">';const hasMs=typeof msOffers!=='undefined';
  if(hasMs&&msType>=0){h+='<div class="stp-card" style="border:.08em solid #ffd23f55"><div style="font-size:.72em;letter-spacing:.1em;color:#ffd23f">ACTIVE JOB</div><div style="font-weight:700;font-size:1.1em;margin:.15em 0">'+msNames[msType]+'</div><div class="stp-sub" style="white-space:normal">'+stE(stTry(()=>msSummary(),''))+'</div><div style="margin-top:.55em;display:flex;gap:.4em"><span class="stp-btn '+(msPinned?'g':'')+'" data-k="job:pin">'+(msPinned?'Unpin':'Pin')+'</span><span class="stp-btn r" data-k="job:x">Cancel</span></div></div>'}
  if(hasMs){h+='<div style="font-weight:700;margin:.9em 0 .2em">Available</div>';if(!msOffers.length)h+='<div class="stp-sub">Checking for work...</div>';msOffers.forEach((o,i)=>{const d=Math.round(Math.hypot(o.p.x-pos.x,o.p.z-pos.z));h+='<div class="stp-row"><span class="stp-av" style="background:#ffd23f;color:#201600;font-size:.9em">'+'DTHRCX'[o.t]+'</span><div class="stp-t"><b>'+msNames[o.t]+'</b><div class="stp-sub" style="white-space:normal">'+msDesc[o.t]+' &middot; ~'+stM(o.est)+' &middot; '+d+' m</div></div><span style="display:flex;flex-direction:column;gap:.3em"><span class="stp-btn" data-k="job:acc:'+i+'">'+(msType>=0?'Queue':'Accept')+'</span><span class="stp-btn g" data-k="job:gps:'+i+'">GPS</span></span></div>'})}
  h+='<div style="font-weight:700;margin:1em 0 .2em">Heists</div>';const HS=stHeist();HS.forEach((H,i)=>{const st=i<stS.done?'DONE':(i===stS.done?(stS.h&&stS.h.i===i&&stS.h.stage!=='plan'?'IN PROGRESS':'READY'):'LOCKED');h+='<div class="stp-row"><span class="stp-av" style="background:'+(st==='DONE'?'#30d158':(st==='LOCKED'?'#3a3a3c':'#ff5cf0'))+'">'+(i+1)+'</span><div class="stp-t"><b>'+H.n+'</b><div class="stp-sub">'+stM(H.take)+' take &middot; '+st+'</div></div>'+(st==='READY'?'<span class="stp-btn" data-k="plan">Plan</span>':'')+'</div>'});
  if(stS.h&&stS.h.stage!=='plan')h+='<div class="stp-card"><b>Now:</b> '+stStageText()+'<div style="margin-top:.5em"><span class="stp-btn r" data-k="quit">Abandon heist</span></div></div>';h+='</div>'}
 else if(a==='chirp'){h+=stHdr('Chirp','home');h+='<div class="stp-sc" id="stpSc">';stC.feed.forEach((p,i)=>{const H=stHandles.find(x=>x[0]===p[0])||['x','Someone','@someone','#888'];h+='<div class="stp-post">'+stAv(H[3],H[1])+'<div class="stp-t"><div style="font-size:.9em"><b style="display:inline">'+stE(H[1])+'</b> <span class="stp-sub">'+H[2]+' &middot; '+stAgo(p[3])+'</span></div><div style="margin:.2em 0 .35em;font-size:.95em;line-height:1.3">'+stE(p[1])+'</div><span data-k="like:'+i+'" style="display:inline-flex;align-items:center;gap:.3em;font-size:.82em;color:'+(p[4]?'#ff375f':'#ffffff88')+'">'+stSvg(stGl.heart,' style="width:1.1em;height:1.1em;fill:'+(p[4]?'#ff375f':'#ffffff66')+'"')+(p[2]+(p[4]?1:0))+'</span></div></div>'});h+='</div>'}
 else if(a==='music'){h+=stHdr('Music','home');h+='<div class="stp-sc" id="stpSc">';if(!stMusicOk)h+='<div class="stp-sub">Radio unavailable</div>';else{const cur=auR.st;h+='<div class="stp-card" style="background:linear-gradient(135deg,#ff2d55,#5b1022);text-align:center"><div style="font-size:.72em;letter-spacing:.12em;opacity:.8">NOW SELECTED</div><div style="font-size:1.35em;font-weight:800;margin:.25em 0">'+(cur<4?auST[cur].n:'Radio off')+'</div><div class="stp-sub" style="color:#fffc">'+(driving?'Playing in your vehicle':'Plays when you are in a vehicle')+'</div></div>';
  for(let i=0;i<=auST.length;i++){const on=cur===i,n=i<auST.length?auST[i].n:'Radio off';h+='<div class="stp-row" data-k="st:'+i+'"><span class="stp-av" style="border-radius:.6em;background:'+['#bf5af2','#ff9f0a','#ff453a','#64d2ff','#3a3a3c'][i%5]+'">'+(i<auST.length?auST[i].b[0]:'&times;')+'</span><div class="stp-t"><b>'+stE(n)+'</b><div class="stp-sub">'+(i<auST.length?auST[i].bpm+' bpm':'Silence')+'</div></div>'+(on?'<b style="color:#ff375f">&#9654;</b>':'')+'</div>'}}h+='</div>'}
 else if(a==='cam'){h+=stHdr('Camera','home');h+='<div class="stp-sc" id="stpSc"><div style="height:11em;border-radius:1em;background:linear-gradient(#111,#222);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.5em;text-align:center;padding:0 1em"><div style="font-size:.85em;opacity:.8">Photo Mode hides the HUD so you can frame a shot. Tap the shutter to take it.</div><span class="stp-btn" data-k="photo">Open Photo Mode</span></div><div style="font-weight:700;margin:.9em 0 .4em">Recents</div>';if(!stPhotos.length)h+='<div class="stp-sub">No photos yet</div>';h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.25em">';for(const p of stPhotos)h+='<img src="'+p+'" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:.35em">';h+='</div></div>'}
 else if(a==='map'){h+=stHdr('Maps','home');h+='<div class="stp-sc" id="stpSc"><div class="stp-card" style="background:linear-gradient(135deg,#1f3b57,#0f1f2e)"><div class="stp-sub">You are in</div><div style="font-size:1.3em;font-weight:700">'+stE(stDist())+'</div><div style="margin-top:.6em"><span class="stp-btn" data-k="fullmap">Open full map</span> '+(stTry(()=>mpWay,null)?'<span class="stp-btn g" data-k="clrway">Clear pin</span>':'')+'</div></div><div style="font-weight:700;margin:.9em 0 .2em">Places</div>';
  const pl=[];for(const P of stProps)if(P.x!==undefined)pl.push([P.n+(stOwn(P)?' (yours)':''),P.x,P.z]);stTry(()=>{for(const q of cpPlaces)pl.push([q.D&&q.D.l?q.D.l:q.type,q.x,q.z])});pl.sort((x,y)=>Math.hypot(x[1]-pos.x,x[2]-pos.z)-Math.hypot(y[1]-pos.x,y[2]-pos.z));
  for(const q of pl.slice(0,14))h+='<div class="stp-row"><div class="stp-t"><b style="font-weight:500">'+stE(q[0])+'</b><div class="stp-sub">'+Math.round(Math.hypot(q[1]-pos.x,q[2]-pos.z))+' m</div></div><span class="stp-btn g" data-k="gps:'+Math.round(q[1])+':'+Math.round(q[2])+'">GPS</span></div>';h+='</div>'}
 else if(a==='stats'){h+=stHdr('Stats','home');const own=stProps.filter(stOwn).length,R=(x,y)=>'<div class="stp-row" style="justify-content:space-between"><span>'+x+'</span><b>'+y+'</b></div>';h+='<div class="stp-sc" id="stpSc">'+R('Cash',stM(cash))+R('Heists completed',stS.done+' of 3')+R('Properties',own+' of '+stProps.length)+R('Takedowns',kills)+R('Jobs passed',stTry(()=>msPassed,0))+R('Best streak',stTry(()=>msBest,0))+R('Time played',Math.floor(stS.play/60)+' min')+R('Wanted level',wanted+' stars')+R('Texts sent',Object.values(stC.t).reduce((n,L)=>n+L.filter(m=>m[0]===1).length,0))+'</div>'}
 A.innerHTML=h;if(a.indexOf('chat:')===0){const sc=stEl('stpSc');if(sc)sc.scrollTop=sc.scrollHeight}}
function stPhoto(P){const s={home:'linear-gradient(#7ec8ff,#cfe9ff 55%,#8fbf7a 56%,#5e8f4f)',biz:'linear-gradient(#ffb36b,#ffd9a8 55%,#9a9a9a 56%,#6d6d6d)'};return P.id==='condo'||P.id==='marina'?'linear-gradient(#7ec8ff,#bfe6ff 52%,#1a78c2 53%,#0e4f86)':(P.id==='pent'?'linear-gradient(#2b3a67,#ff8f6b)':(P.id==='mans'?'linear-gradient(#ffb36b,#ffe2b8 50%,#b79b6c 51%,#7d6a48)':s[P.k]))}
function stSil(P){const c='#1d2333',m={safe:'<rect x="30" y="18" width="40" height="42"/>',apt:'<rect x="28" y="10" width="44" height="50"/>',house:'<path d="M25 60V36l25-18 25 18v24z"/>',ware:'<path d="M15 60V30l35-10 35 10v30z"/>',condo:'<rect x="34" y="8" width="32" height="52"/>',pent:'<rect x="40" y="2" width="20" height="58"/><rect x="24" y="22" width="14" height="38"/><rect x="62" y="16" width="14" height="44"/>',mans:'<path d="M12 60V38l18-12 18 12V60zM46 60V30l22-14 22 14v30z"/>',wash:'<path d="M18 60V34h64v26zM14 34l36-12 36 12z"/>',club:'<rect x="22" y="22" width="56" height="38"/><rect x="30" y="28" width="40" height="8" fill="#ff5cf0"/>',marina:'<path d="M20 50h50l-8 10H28z"/><path d="M44 50V24l14 20z"/>'}[P.id]||'<rect x="30" y="20" width="40" height="40"/>';return '<svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMax meet" style="position:absolute;inset:0;width:100%;height:100%;fill:'+c+'">'+m+'</svg>'}
// ----- input -----
let stTch=null;
function stK(el){return el&&el.closest?el.closest('[data-k]'):null}
stPh.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const t=e.changedTouches[0];if(!t||stTch)return;const el=t.target,k=stK(el),sc=el&&el.closest?el.closest('.stp-sc'):null;stTch={id:t.identifier,x:t.clientX,y:t.clientY,k:k,sc:sc,st:sc?sc.scrollTop:0,mv:false,t0:performance.now()};if(k){k.classList.add('stp-pr');stTry(()=>{if(navigator.vibrate&&!(uiS&&uiS.vib===0))navigator.vibrate(6)})}},{passive:false});
stPh.addEventListener('touchmove',e=>{e.preventDefault();e.stopPropagation();const s=stTch;if(!s)return;for(const t of e.changedTouches){if(t.identifier!==s.id)continue;const dx=t.clientX-s.x,dy=t.clientY-s.y;if(Math.abs(dx)+Math.abs(dy)>9){s.mv=true;if(s.k){s.k.classList.remove('stp-pr')}}if(s.sc)s.sc.scrollTop=s.st-dy}},{passive:false});
function stTEnd(e){e.stopPropagation();const s=stTch;if(!s)return;let mine=false;for(const t of e.changedTouches)if(t.identifier===s.id)mine=true;if(!mine&&e.type!=='touchcancel')return;stTch=null;if(s.k)s.k.classList.remove('stp-pr');if(e.type==='touchcancel')return;
 const t=e.changedTouches[0],dy=t?t.clientY-s.y:0;
 if(stLocked&&dy<-20){stUnlock();return}
 if(s.mv){if(s.k&&s.k.getAttribute('data-k')==='bar'&&dy<-18)stTap('bar');return}
 if(stLocked){stUnlock();return}
 if(s.k)stTap(s.k.getAttribute('data-k'),s.k)}
stPh.addEventListener('touchend',stTEnd);stPh.addEventListener('touchcancel',stTEnd);
stPh.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&e.target&&e.target.id==='stpIn'){const v=e.target.value;e.target.value='';if(stView)stSend(stView,v);e.preventDefault()}});
stPh.addEventListener('keyup',e=>e.stopPropagation());stPh.addEventListener('keypress',e=>e.stopPropagation());
function stTap(k,el){
 if(k==='bar'){if(stApp==='home')stClosePhone();else stHome();return}
 if(k==='home'||k==='close'){if(k==='close'){stClosePhone();return}stHome();return}
 if(k==='inp'){stTry(()=>{const i=stEl('stpIn');i.focus();i.click&&0});return}
 if(k.indexOf('app:')===0){const a=k.slice(4);stGo(a,el);return}
 if(k.indexOf('chat:')===0){stEl('stpNB').classList.remove('on');stGo(k,el);return}
 if(k.indexOf('chip:')===0){if(!stView)return;const c=stChips(stView)[+k.slice(5)];stSend(stView,c);return}
 if(k==='send'){const i=stEl('stpIn');if(i&&stView){const v=i.value;i.value='';stSend(stView,v)}return}
 if(k.indexOf('call:')===0){stCall(k.slice(5));return}
 if(k==='acc'){stAccept();return}if(k==='dec'||k==='end'){stDecline();return}
 if(k.indexOf('ptab:')===0){stPhTab=k.slice(5);stRender();return}
 if(k.indexOf('key:')===0){if(stDialS.length<12)stDialS+=k.slice(4);stTry(()=>beep(900+Math.random()*400,.06,.05));stRender();return}
 if(k==='kdel'){stDialS=stDialS.slice(0,-1);stRender();return}
 if(k==='kcall'){const n=stDialS.replace(/[^0-9]/g,''),id=stAll.find(x=>stNum(x).replace('-','')===n||stNum(x).replace('-','').slice(3)===n);stDialS='';if(id)stCall(id);else if(n){stCallO=null;stDial('op',null);stCallO.opMsg=true}return}
 if(k.indexOf('vm:')===0){const p=k.split(':'),m=(stC.t[p[1]]||[])[+p[2]];if(m)stSpeak(p[1],m[1]);return}
 if(k==='collect'){const a=stCollectAll();toast(a?'Collected '+stM(a):'Nothing to collect');stRender();return}
 if(k.indexOf('buy:')===0){const P=stProps.find(p=>p.id===k.slice(4));if(P)stBuy(P);stRender();return}
 if(k.indexOf('way:')===0){const P=stProps.find(p=>p.id===k.slice(4));if(P){stWay(P.x,P.z);toast('GPS set: '+P.n)}return}
 if(k.indexOf('gps:')===0){const p=k.split(':');stWay(+p[1],+p[2]);toast('GPS set');stRender();return}
 if(k==='clrway'){stTry(()=>{mpWay=null;mpDirty=true});stWayMine=null;stRender();return}
 if(k==='fullmap'){stClosePhone();stTry(()=>fxToggleMap());return}
 if(k==='plan'){stClosePhone();stPlan();return}if(k==='quit'){stAbort('Heist abandoned');stRender();return}
 if(k==='job:pin'){stTry(()=>msPin(!msPinned));stRender();return}
 if(k==='job:x'){stTry(()=>msCancel());stRender();return}
 if(k.indexOf('job:acc:')===0){stTry(()=>{if(msType>=0){toast('Finish or cancel your current job first');return}msAccept(+k.slice(8))});stRender();return}
 if(k.indexOf('job:gps:')===0){stTry(()=>{const o=msOffers[+k.slice(8)];if(o){stWay(o.p.x,o.p.z);toast('GPS set: '+msNames[o.t])}});return}
 if(k.indexOf('like:')===0){const p=stC.feed[+k.slice(5)];if(p){p[4]=p[4]?0:1;stChatSave();stRender()}return}
 if(k.indexOf('st:')===0){stTry(()=>{const i=+k.slice(3);auR.st=(i+4)%5;auRadioNext()});stRender();return}
 if(k==='photo'){stClosePhone();stCamOn();return}}
// ----- phone button: take over the crime one, or make our own -----
let stPhBtn=null;
if(typeof cpPh!=='undefined'){stPhBtn=cpPh;cpPhone=function(){if(stPhOpen)stClosePhone();else stOpenPhone()};cpPh.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v13h10V5zm4 14.2v1.2h2v-1.2z"/></svg>'}
else{stPhBtn=document.createElement('div');stPhBtn.className='btn';stPhBtn.textContent='PHONE';stPhBtn.style.cssText='left:14px;top:calc(env(safe-area-inset-top,0px) + 70px);width:44px;height:44px;font-size:9px';document.body.appendChild(stPhBtn);stPhBtn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(stPhOpen)stClosePhone();else stOpenPhone()},{passive:false})}
const stDot=document.createElement('span');stDot.style.cssText='position:absolute;right:-3px;top:-3px;min-width:16px;height:16px;border-radius:8px;background:#ff3b30;color:#fff;font-size:10px;font-weight:800;line-height:16px;text-align:center;display:none;pointer-events:none';
addEventListener('keydown',e=>{if(e.key==='t'){if(stPhOpen)stClosePhone();else stOpenPhone()}});
addEventListener('resize',()=>{if(stPhOpen)setTimeout(stLayout,60)});
// no shooting while the phone is out
{const ts0=tapShoot;tapShoot=function(x,y){if(stPhOpen)return;ts0(x,y)}}
// ----- camera / photo mode -----
const stCamX=document.createElement('div');stCamX.id='stCamX';stCamX.className='st-p';stCamX.style.cssText='left:0;top:0;right:0;bottom:0;display:none;align-items:flex-end;justify-content:center;padding-bottom:calc(env(safe-area-inset-bottom,0px) + 22px);font-size:12px;font-weight:700;text-shadow:0 1px 3px #000;gap:26px';stCamX.innerHTML='<span data-c="x" style="padding:9px 14px;border-radius:18px;background:#0008">Done</span><span data-c="s" style="width:62px;height:62px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px #0006,0 0 0 7px #fff"></span><span style="width:52px"></span>';document.body.appendChild(stCamX);
function stCamOn(){stCam=true;document.body.classList.add('stcam');stCamX.style.display='flex';stPause('stcam')}
function stCamOff(){stCam=false;document.body.classList.remove('stcam');stCamX.style.display='none';stResume('stcam')}
function stShot(){stTry(()=>{composer.render();const c=document.createElement('canvas'),src=renderer.domElement;c.width=240;c.height=Math.round(240*src.height/src.width);c.getContext('2d').drawImage(src,0,0,c.width,c.height);stPhotos.unshift(c.toDataURL('image/jpeg',.72));if(stPhotos.length>9)stPhotos.length=9});stFl.style.transition='none';stFl.style.opacity=.9;void stFl.offsetWidth;stFl.style.transition='opacity .45s';stFl.style.opacity=0;stTry(()=>{beep(2400,.03,.08);setTimeout(()=>beep(1800,.05,.06),60)});toast('Photo saved to Camera')}
stCamX.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const b=e.target&&e.target.closest?e.target.closest('[data-c]'):null;if(b&&b.getAttribute('data-c')==='s')stShot();else stCamOff()},{passive:false});
// ----- per-frame -----
let stT2=0,stCallT=0;
function stTick1(){const t=stEl('stpT');if(t)t.textContent=stClk();const si=stEl('stpSI');if(si)si.innerHTML=stStat+stBat()}
let stLastNow=performance.now();
MODS.push(function stPhoneFrame(dt){const now=performance.now(),rdt=Math.min(.25,Math.max(0,(now-stLastNow)/1000));stLastNow=now;
 for(let i=stPend.length-1;i>=0;i--)if(stPend[i].at<=now){const p=stPend.splice(i,1)[0];stTry(p.fn)}
 if(stNbT>0){stNbT-=rdt;if(stNbT<=0)stNB.classList.remove('on')}
 if(stPhNbT>0){stPhNbT-=rdt;if(stPhNbT<=0)stEl('stpNB').classList.remove('on')}
 if(stPhOpen){fireId=null;burstN=0}
 const c=stCallO;if(c){c.t+=rdt;stCallT-=rdt;if(stCallT<=0){stCallT=.5;stDI();const e=stEl('stpCT');if(e&&c.st==='live')e.textContent=Math.floor(c.t/60)+':'+String(Math.floor(c.t%60)).padStart(2,'0')}
  if(c.dir==='in'&&c.st==='ring'&&c.t>16)stDecline();
  if(c.dir==='out'&&c.st==='dial'&&c.t>1.8){c.st='live';c.t=0;stLogCall(c.id,'out');if(c.opMsg){c.lines=['The number you have dialed is not in service. Please check the number and try again.']}else{const r=c.act?c.act():{lines:['Hello?']};c.lines=r.lines;c.after=r.after||null}stRender();setTimeout(stCallLine,200)}}
 stT2-=dt;if(stT2<=0){stT2=1;if(stPhOpen){stTick1();if(stApp==='home')stHomeDraw()}
  if(state==='play'){stEventsTick();
   if(stS.play>stC.nextPro){stC.nextPro=stS.play+80+Math.random()*90;if(stS.play>200)stProactive()}
   if(stS.play>stC.nextFeed){stC.nextFeed=stS.play+45+Math.random()*60;const a=stAmb[Math.floor(Math.random()*stAmb.length)];stPost(a[0],a[1]);if(stPhOpen&&stApp==='chirp')stRender()}
   if(stS.play>stC.nextCall&&!stCallO&&!stPhOpen&&!stS.h){stC.nextCall=stS.play+260+Math.random()*240;if(stS.play>300)stRandomCall()}}}});
// ----- intro call from the fixer (instead of a plain text) -----
function stIntroCall(){if(stS.sent.hi)return;stS.sent.hi=1;stStore();stIncoming('vee',['Heard you are making noise in Block City.','I put crews together for real money. Banks, jewels, the works.','When you want in, call me, or text me from your phone.'],()=>{stMsg('vee','Saved my number. Text me "job" when you are ready.')})}

{const stOP0=stOpenPan;stOpenPan=function(h,cb){if(stPhOpen)stClosePhone();stOP0(h,cb)}}
function stPrice(P){return Math.round(P.p*(stS.disc||1))}
function stIconUpd(P){if(!P.ic)return;const o=stOwn(P);P.ic.label=(o?'':'For sale: ')+P.n;P.ic.color=o?(P.k==='biz'?'#0a84ff':'#34c759'):'#ffd23f';P.ic.glyph=o?(P.k==='biz'?'$':'\u2302'):'$';if(o)stTry(()=>{mpReveal(P.x,P.z,30);mpDirty=true})}

// ----- heists -----
const stRoleKeys={Driver:['rico','dee'],Gunman:['mara','tug'],Hacker:['pixel','lenny']};
let stPl={loud:true,d:'dee',g:'tug',h:'lenny'};
function stPlan(){if(stS.done>=3){toast('All heists done');return}const i=stS.done,H=stHeist()[i];
 const draw=()=>{let cut=0,h='<div class="st-h" style="font-size:19px;color:#ffd23f">HEIST: '+H.n.toUpperCase()+'</div><div class="st-s">'+H.d+' &middot; Take '+stM(H.take*(stPl.loud?1:1.15))+'</div><div style="margin-top:6px">'+stBtn('ap:1','Loud'+(stPl.loud?' &#10003;':''),stPl.loud?'':'g')+stBtn('ap:0','Quiet'+(stPl.loud?'':' &#10003;'),stPl.loud?'g':'')+'<span class="st-s"> '+(stPl.loud?'Fast, more heat':'One more setup job, bigger take, less heat')+'</span></div>';
  for(const r of['Driver','Gunman','Hacker']){const key=r[0].toLowerCase();h+='<div style="display:flex;gap:6px;margin-top:6px">';for(const id of stRoleKeys[r]){const c=stCrew[id],on=stPl[key]===id;if(on)cut+=c.cut;h+='<div data-k="cr:'+key+':'+id+'" class="st-row" style="flex:1;margin:0;border:2px solid '+(on?'#ffd23f':'transparent')+'">'+stAv(c.c,c.n,28)+'<div><div style="font-weight:700">'+c.n+'</div><div class="st-s">'+r+' '+'&#9733;'.repeat(c.s)+' &middot; '+c.cut+'% cut</div></div></div>'}h+='</div>'}
  h+='<div class="st-s" style="margin-top:8px">Crew takes '+cut+'%. Your share about <b style="color:#6dff8a">'+stM(H.take*(stPl.loud?1:1.15)*(1-cut/100))+'</b></div>'+stBtn('go','START SETUP')+stBtn('x','Not now','g');stOpenPan(h,cb)};
 const cb=k=>{if(k==='x'){stClosePan();return}if(k.indexOf('ap:')===0){stPl.loud=k==='ap:1';draw();return}if(k.indexOf('cr:')===0){const p=k.split(':');stPl[p[1]]=p[2];draw();return}
  if(k==='go'){stClosePan();stS.h={i:i,loud:stPl.loud,crew:{d:stPl.d,g:stPl.g,h:stPl.h},stage:'car'};stStore();stSetup();stSay('vee','First we need wheels. Steal something and park it by the target.')}};draw()}
let stH=null; // runtime heist data
const stBeam=new THREE.Mesh(new THREE.CylinderGeometry(2,2,60,18,1,true),new THREE.MeshBasicMaterial({color:0xff5cf0,transparent:true,opacity:.3,depthWrite:false,toneMapped:false}));stBeam.visible=false;scene.add(stBeam);
const stRing=document.createElement('div');stRing.className='st-p';stRing.style.cssText='left:50%;top:22%;width:96px;height:96px;margin-left:-48px;border-radius:50%;display:none;align-items:center;justify-content:center;pointer-events:none;z-index:30;font-weight:900;font-size:14px;text-shadow:0 1px 3px #000';document.body.appendChild(stRing);
const stObj=document.createElement('div');stObj.className='st-p';stObj.style.cssText='left:50%;top:calc(env(safe-area-inset-top,0px) + 96px);transform:translateX(-50%);padding:6px 12px;border-radius:11px;background:#000a;border-left:3px solid #ff5cf0;font-size:12.5px;font-weight:700;pointer-events:none;display:none;z-index:6;max-width:70%;text-align:center';document.body.appendChild(stObj);
function stSetup(){const h=stS.h;if(!h||h.stage==='plan'){stH=null;return}const H=stHeist()[h.i];const tg=stTry(()=>cpPlaces.find(p=>p.type===H.type),null);
 if(!tg){stH=null;return}const good=stCrew[h.crew.d].s>=3,want=good?190:320;let drop=null,bd=1e9;for(let a=0;a<=N;a++)for(let b=0;b<=N;b++){const x=roadCenter(a),z=roadCenter(b),e=Math.abs(Math.hypot(x-tg.x,z-tg.z)-want);if(e<bd){bd=e;drop={x:x,z:z}}}
 let gear=null;bd=1e9;for(let a=0;a<=N;a++)for(let b=0;b<=N;b++){const x=roadCenter(a),z=roadCenter(b),e=Math.abs(Math.hypot(x-tg.x,z-tg.z)-130);if(e<bd){bd=e;gear={x:x,z:z}}}
 stH={tg:tg,park:{x:tg.x,z:tg.z-9.5},door:{x:tg.x,z:tg.z-3},drop:drop,gear:gear,t:0,crew:[],take:H.take*(h.loud?1:1.15),lost:0,car:null,miss:0,hit:0,sayT:0,pt:null}}
function stMate(id,dx){const c=stCrew[id],g=makePerson(new THREE.Color(c.c),0x20242c,[0xf1c27d,0xc68642,0x8d5524][Math.floor(Math.random()*3)]);stTry(()=>{g.userData.gun.visible=true});g.position.set(pos.x+dx,.3,pos.z+2);scene.add(g);return {id:id,g:g,hp:100,down:false,cd:1,w:0,dx:dx}}
function stClearCrew(){if(stH){for(const m of stH.crew)scene.remove(m.g);stH.crew=[]}}
function stAbort(msg){stClearCrew();stS.h=null;stH=null;stRing.style.display='none';stGameEnd();stBeam.visible=false;stObj.style.display='none';if(stWayMine){stTry(()=>{mpWay=null;mpDirty=true});stWayMine=null}stStore();if(msg)toast(msg)}
function stFail(why){const h=stS.h;if(!h)return;stClearCrew();stRing.style.display='none';stGameEnd();h.stage='meet';stSetup();stStore();stTry(()=>cpBanner('HEIST FAILED','#ff5252',why+'. Meet the crew to try again',3.5));stMsg('vee','That went sideways. Regroup at the target when the heat dies down.')}
// vault mini-game
const stGame=document.createElement('div');stGame.className='st-p';stGame.style.cssText='left:0;top:0;right:0;bottom:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:#000b;z-index:75';document.body.appendChild(stGame);
let stG=null;
function stGameStart(){const s=stCrew[stS.h.crew.h].s,w=s>=3?.3:.17;stG={w:w,c:.5,hit:0,miss:0,ph:Math.random()*6,sp:s>=3?2.1:2.9};stGame.style.display='flex';stPause('stgame');stGameDraw()}
function stGameEnd(){stG=null;stGame.style.display='none';stResume('stgame')}
function stGamePos(){return (Math.sin(T*stG.sp+stG.ph)+1)/2}
function stGameDraw(){const g=stG,x=stGamePos();stGame.innerHTML='<div class="st-h" style="font-size:20px;color:#3ddcff">CRACK THE SAFE</div><div class="st-s" style="margin:4px 0 14px">Tap when the bar is inside the green zone &middot; '+g.hit+' / 3</div><div style="position:relative;width:min(380px,80%);height:34px;border-radius:10px;background:#1d2530;border:1px solid #fff4;overflow:hidden"><div style="position:absolute;top:0;bottom:0;left:'+((g.c-g.w/2)*100)+'%;width:'+(g.w*100)+'%;background:#2ecc71"></div><div style="position:absolute;top:-2px;bottom:-2px;left:'+(x*100)+'%;width:5px;margin-left:-2px;background:#fff;box-shadow:0 0 8px #fff"></div></div><div class="st-s" style="margin-top:12px">Misses raise the alarm</div>'}
function stGameTap(){const g=stG;if(!g)return;const x=stGamePos();if(Math.abs(x-g.c)<=g.w/2){g.hit++;beep(1400+g.hit*200,.1,.12);g.c=.2+Math.random()*.6;g.ph=Math.random()*6;if(g.hit>=3){stGameEnd();stS.h.stage='grab';stH.t=0;stSay(stS.h.crew.h,'We are in. Bag it!');return}}else{g.miss++;stH.miss++;beep(220,.2,.14);if(g.miss===2){stTry(()=>cpStars(2));stSay(stS.h.crew.h,'That tripped something. Hurry.')}}stGameDraw()}
stGame.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();stGameTap()},{passive:false});
function stPayout(){const h=stS.h,H=stHeist()[h.i];let take=Math.round((stH.take-stH.lost)/10)*10,rows='',cut=0;for(const k of['d','g','h']){const c=stCrew[h.crew[k]],m=stH.crew.find(q=>q.id===h.crew[k]),down=m&&m.down,a=down?0:Math.round(take*c.cut/100);cut+=a;rows+=stRow(stAv(c.c,c.n,28),c.n,c.r+(down?' &middot; went down':' &middot; '+c.cut+'%'),'<b style="color:'+(down?'#ff8a80':'#fff')+'">'+(down?'$0':stM(a))+'</b>')}
 const mine=take-cut;cash+=mine;stTx(H.n+' payout',mine);stS.done=Math.max(stS.done,h.i+1);stClearCrew();stS.h=null;stH=null;stBeam.visible=false;stObj.style.display='none';if(stWayMine){stTry(()=>{mpWay=null;mpDirty=true});stWayMine=null}wantedScore=0;evade=0;stStore();
 stOpenPan('<div class="st-h" style="font-size:22px;color:#6dff8a">HEIST PASSED</div><div class="st-s">'+H.n+' &middot; Total take '+stM(take)+(stH0lost?' (lost '+stM(stH0lost)+' on the way)':'')+'</div>'+rows+'<div class="st-row" style="background:#1e5631"><div style="flex:1;font-weight:800">YOUR SHARE</div><b style="font-size:18px;color:#6dff8a">'+stM(mine)+'</b></div>'+stBtn('x','NICE'),()=>stClosePan());
 stTry(()=>msJingle&&msJingle(true));if(stS.done<3)setTimeout(()=>stMsg('vee','Clean work. I have something bigger when you are ready: '+stHeist()[stS.done].n+'.'),4000);else setTimeout(()=>stMsg('vee','The Big One is done. Nobody in Block City has ever pulled that off.'),4000)}
let stH0lost=0;
function stHeistTick(dt){const h=stS.h;if(!h||h.stage==='plan')return;if(!stH){stSetup();if(!stH)return}const S=stH,tg=S.tg,inside=stTry(()=>cpIn===tg,false),dTo=p=>Math.hypot(p.x-pos.x,p.z-pos.z);
 let mk=null;const st=h.stage;
 if(st!=='car'&&st!=='scout'&&st!=='gear'&&st!=='meet'){if(state==='dead'){stFail('You went down');return}if(state==='cpbust'){stFail('You got busted');return}}
 if(state!=='play')return;
 if(st==='car'){mk=S.park;if(driving&&!driving.custom&&!driving.vhT&&dTo(mk)<5.5&&Math.abs(driving.speed)<4){S.car=driving;driving.speed=0;driving=null;player.visible=true;pos.set(mk.x+3,.3,mk.z);collide(pos,.6);h.stage='scout';stStore();toast('Getaway car in place');stSay(h.crew.d,stCrew[h.crew.d].s>=3?'I can make that thing fly.':'It has wheels. Should be fine.')}}
 else if(st==='scout'){mk=S.door;if(dTo(mk)<6){S.t+=dt;if(S.t>3){S.t=0;h.stage=h.loud?'meet':'gear';stStore();toast('Target scouted');stSay(h.crew.h,h.loud?'One camera, one guard. Easy.':'I need the gear bag before we go quiet.')}}else S.t=0}
 else if(st==='gear'){mk=S.gear;if(dTo(mk)<5){h.stage='meet';stStore();toast('Gear collected');stSay(h.crew.g,'Got the masks. Meet you at the door.')}}
 else if(st==='meet'){mk=S.door;if(dTo(mk)<7&&!driving){S.crew=[stMate(h.crew.g,-1.8),stMate(h.crew.h,1.8)];S.lost=0;S.miss=0;h.stage='enter';stSay(h.crew.g,'Masks on. Follow my lead.');stSay('vee','Driver is waiting at the drop. Make it quick.')}}
 else if(st==='enter'){mk=S.door;tg.cool=0;if(inside){h.stage='ctrl';S.t=0;stSay(h.crew.g,h.loud?'EVERYBODY DOWN!':'Nice and calm. Nobody look up.')}}
 else if(st==='ctrl'){if(!inside){h.stage='enter';return}S.t+=dt;if(h.loud?(fireId!==null||burstN>0||stTry(()=>T-cpShotAt<.5,false)||S.t>9):S.t>4){stTry(()=>cpStars(h.loud?2:1));stGameStart();h.stage='vault'}}
 else if(st==='vault'){if(!stG){stGameStart()}}
 else if(st==='grab'){if(!inside){stRing.style.display='none';h.stage='enter';toast('Get back inside!');return}S.t+=dt;const dur=[8,11,15][h.i]*(stCrew[h.crew.g].s>=3?.7:1),f=Math.min(1,S.t/dur),deg=Math.round(f*360);stRing.style.display='flex';stRing.style.background='conic-gradient(#ff5cf0 '+deg+'deg,#0009 '+deg+'deg)';stRing.textContent=stM(Math.round(S.take*f/100)*100);
  if(f>=1){stRing.style.display='none';stTry(()=>cpStars((h.loud?[3,4,5]:[1,2,3])[h.i]+(S.miss>=2?1:0)));h.stage='exit';stSay(h.crew.g,'Bags are full. MOVE!');stTry(()=>cpBanner('GOT IT','#ff5cf0','Get to the drop-off',2.2))}}
 else if(st==='exit'){if(!inside&&!stTry(()=>!!cpIn,false)){h.stage='escape';stSay(h.crew.d,stCrew[h.crew.d].s>=3?'Short run. I am two blocks from the freeway.':'I am... kind of far. Sorry.');if(S.car&&!S.car.dead&&stCrew[h.crew.d].s>=3)S.car.m.userData.max=58}}
 else if(st==='escape'){mk=S.drop;if(dTo(mk)<8){stH0lost=S.lost;stPayout();return}}
 // marker + objective
 if(mk){stBeam.visible=true;stBeam.position.set(mk.x,30,mk.z);if(!stWayMine||stWayMine.x!==mk.x||stWayMine.z!==mk.z||(stTry(()=>mpWay,1)===null&&dTo(mk)>14))stWay(mk.x,mk.z)}else stBeam.visible=false;
 stObj.style.display='block';const txt='HEIST &middot; '+stStageText()+(mk?' &middot; '+Math.round(dTo(mk))+' m':'');if(stObj._t!==txt){stObj.innerHTML=txt;stObj._t=txt}
 // crew AI
 const hostile=[];for(const s of shooters)if(!s.dead&&(s.aggro||(s.kind==='cop'&&wanted>0)))hostile.push(s);
 for(const m of S.crew){const g=m.g;if(m.down)continue;const a=facing,tx=pos.x+Math.cos(a)*m.dx+Math.sin(a)*2.2,tz=pos.z-Math.sin(a)*m.dx+Math.cos(a)*2.2,dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);let sp=0;
  if(d>45||(inside&&Math.abs(g.position.x-pos.x)>30)||(!inside&&g.position.x>2500)){g.position.set(tx,.3,tz)}else if(d>.6){sp=Math.min(driving?30:8.5,d*3);g.position.x+=dx/d*sp*dt;g.position.z+=dz/d*sp*dt;g.rotation.y=Math.atan2(-dx,-dz);if(!inside)collide(g.position,.45)}
  g.visible=!driving;m.w+=dt*sp*1.5;animLimbs(g,sp,m.w);
  let best=null,bd=32;for(const s of hostile){const q=Math.hypot(s.g.position.x-g.position.x,s.g.position.z-g.position.z);if(q<bd){bd=q;best=s}}
  if(best&&!driving){g.userData.armR.rotation.x=Math.PI/2;if(sp<1)g.rotation.y=Math.atan2(-(best.g.position.x-g.position.x),-(best.g.position.z-g.position.z));m.cd-=dt;if(m.cd<=0){const sk=stCrew[m.id].r==='Gunman'?stCrew[m.id].s:1;m.cd=sk>=3?.55:1.1;const o=g.position.clone().setY(1.8),e=best.g.position.clone().setY(1.5);tracer(o,e);sfx(.16,2000,.3,g.position);if(Math.random()<(sk>=3?.7:.4)){best.hp-=1.2;best.aggro=true;if(best.hp<=0)killShooter(best,g.position)}}
   if(Math.random()<dt*.07){m.hp-=34;if(m.hp<=0){m.down=true;g.rotation.x=-Math.PI/2;const loss=Math.round(S.take*.12);S.lost+=loss;stSay(m.id,'I am hit! Go, go!');toast(stCrew[m.id].n+' is down. Lost '+stM(loss))}}}}}
// ----- main tick -----
let stT1=0,stMsgT=25;
MODS.push(function(dt){
 if(stSubT>0){stSubT-=dt;if(stSubT<=0)stSub.style.opacity=0}else if(stSubQ.length){stSub.innerHTML=stSubQ.shift();stSub.style.opacity=1;stSubT=3.4}
 if(stG)stGameDraw();
 if(state==='play'){stS.play+=dt;for(const P of stProps)if(P.k==='biz'&&stOwn(P))stS.inc[P.id]=Math.min(P.cap,(stS.inc[P.id]||0)+P.inc*dt/60)}
 stHeistTick(dt);
 stT1-=dt;if(stT1<=0){stT1=.25;
  if(!stIconsDone)stTry(()=>{for(const P of stProps)if(P.x!==undefined){P.ic={x:P.x,z:P.z,label:'',color:'',glyph:''};stIconUpd(P);mpIcons.push(P.ic)}stIconsDone=true});
  const inP=stTry(()=>cpIn&&cpIn.st,null);
  for(const P of stProps){if(P.x===undefined)continue;const o=stOwn(P);P.ring.material.color.setHex(o?0x6dff8a:0xffd23f);const d=Math.hypot(pos.x-P.x,pos.z-P.z);if(d>4&&!inP&&!stTry(()=>!!cpIn||!!cpSeq,false))P.away=true;
   if(state==='play'&&!driving&&d<1.5&&P.away&&!stTry(()=>!!cpIn,false)){P.away=false;if(o)stEnterProp(P);else stOpenPan('<div class="st-h" style="font-size:20px;color:'+(P.k==='biz'?'#6fb1ff':'#ff8a80')+'">FOR SALE</div><div style="font-size:17px;font-weight:800;margin-top:2px">'+P.n+'</div><div class="st-s">'+P.d+(P.k==='biz'?' (collect up to '+stM(P.cap)+')':' &middot; heal, save, wardrobe, heist board')+'</div><div style="margin-top:6px">Price <b style="color:#6dff8a">'+stM(stPrice(P))+'</b> &nbsp; You have '+stM(cash)+'</div>'+stBtn('buy','BUY')+stBtn('x','Leave','g'),k=>{stClosePan();if(k==='buy'&&stBuy(P))stEnterProp(P)})}}
  stIn.style.display=(state==='play'&&(inP||stTry(()=>cpIn&&cpIn.type==='safe'&&cpSave.own,false)))?'flex':'none';
  if(stS.play>stMsgT){stMsgT+=90;if(!stS.sent.hi&&!stCallO&&!stPhOpen)stIntroCall();if(stS.play>120)stOnce('re','agent','New listings in the Property app: houses from $18,000 and businesses that pay you while you play.');if(stS.play>300&&stS.done===0)stOnce('nag','vee','Still waiting on that call. The Corner Job is an easy $25k.');if(stS.play%180<1)stStore()}}});
// in-property action bar
const stIn=document.createElement('div');stIn.className='st-p';stIn.style.cssText='left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 150px);transform:translateX(-50%);display:none;gap:6px;z-index:9';stIn.innerHTML=stBtn('board','HEIST BOARD')+stBtn('wear','WARDROBE','g')+stBtn('save','SAVE','g');document.body.appendChild(stIn);
stIn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const b=e.target&&e.target.closest?e.target.closest('[data-k]'):null;if(!b||state!=='play')return;const k=b.getAttribute('data-k');if(k==='board'){if(stS.h&&stS.h.stage!=='plan')toast('Heist in progress: '+stStageText());else stPlan()}else if(k==='wear')stWear();else{stStore();toast('Game saved')}},{passive:false});
if(stS.h)stSetup();
