window.__st={s:()=>JSON.stringify({state,cash,app:stApp,open:stPhOpen,own:Object.keys(stS.own),safe:stProps[0]&&stOwn(stProps[0]),done:stS.done,stage:stS.h&&stS.h.stage,crew:stH?stH.crew.map(m=>m.id+(m.down?'x':'')):null,inc:stS.inc,msgs:stUnread(),badge:stBadge,wanted,cpIn:typeof cpIn!=='undefined'&&cpIn?cpIn.type:null,x:Math.round(pos.x),z:Math.round(pos.z),game:!!stG,pan:stPan.style.display,tx:stS.tx.length,props:stProps.filter(p=>p.x!==undefined).length}),
 cash:n=>{cash=n},phone:a=>stOpenPhone(a),tap:k=>stTap(k),close:()=>stClosePhone(),pan:k=>stPanCb&&stPanCb(k),
 tp:(x,z)=>{pos.set(x,.3,z);vel.set(0,0,0)},prop:id=>{const P=stProps.find(p=>p.id===id);P.away=true;pos.set(P.x,.3,P.z);vel.set(0,0,0);return [P.x,P.z]},
 mk:()=>{const S=stH,h=stS.h;const m={car:S.park,scout:S.door,gear:S.gear,meet:S.door,enter:S.door,escape:S.drop}[h.stage];return m?[m.x,m.z]:null},
 car:()=>{const S=stH;let c=cars.find(c=>!c.dead&&!c.custom&&!c.vhT&&!c.vhBike);c.m.position.set(S.park.x,0,S.park.z);c.speed=0;driving=c;player.visible=false;pos.copy(c.m.position)},
 door:()=>{const t=stH.tg;pos.set(t.x,.3,t.z-.8);vel.set(0,0,0);cpDoorCD=0},skip:t=>{stH.t=t},gtap:()=>{const g=stG;if(!g)return 'nogame';g.ph=Math.asin(g.c*2-1)-T*g.sp;stGameTap();return g?g.hit:'done'},gmiss:()=>{const g=stG;g.ph=Math.asin(Math.max(-1,Math.min(1,(g.c>.5?g.c-.4:g.c+.4)*2-1)))-T*g.sp;stGameTap()},
 leave:()=>{cpDoorCD=0;cpLeave()},die:()=>{hp=1;hurt(50)},inc:(id,a)=>{stS.inc[id]=a},reset:()=>{localStorage.removeItem('blockcity_story')},fire:b=>{fireId=b?1:null},play:n=>{stS.play=n}};
window.__st.unshop=()=>{try{msCloseMenu()}catch(e){};if(state==='shop')state='play';return state};

window.__sp=[];
try{if(window.speechSynthesis){const sp0=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=function(u){window.__sp.push([u.text,u.voice?u.voice.name:null,u.pitch,u.rate]);try{setTimeout(()=>{u.onend&&u.onend()},300)}catch(e){}}}}catch(e){}
window.__sph={s:()=>JSON.stringify({open:stPhOpen,app:stApp,locked:stLocked,view:stView,state,x:Math.round(pos.x*10)/10,z:Math.round(pos.z*10)/10,unread:stUnread(),call:stCallO?[stCallO.id,stCallO.dir,stCallO.st]:null,fire:fireId,typing:Object.keys(stTyping).filter(k=>stTyping[k]),spoken:window.__sp.length}),
 open:a=>stOpenPhone(a),close:()=>stClosePhone(),go:a=>stGo(a),tap:k=>stTap(k),send:(id,t)=>stSend(id,t),
 chat:id=>JSON.stringify((stC.t[id]||[]).slice(-6)),act:id=>JSON.stringify(stC.act[id]||null),
 ring:id=>stIncoming(id||'nana',['Hello dear, it is Nana.','Call me back.']),acc:()=>stAccept(),dec:()=>stDecline(),call:id=>stCall(id),
 joy:(x,y)=>{joy.id=7;joy.x=x;joy.y=y},joy0:()=>{joy.id=null;joy.x=joy.y=0},
 icon:id=>{const P=stProps.find(p=>p.id===id);return P&&P.ic?JSON.stringify([P.ic.label,P.ic.color,P.ic.glyph,mpIcons.indexOf(P.ic)>=0]):null},
 buy:id=>{const P=stProps.find(p=>p.id===id);return stBuy(P)},feed:()=>stC.feed.length,
 rect:sel=>{const e=document.querySelector(sel);if(!e)return null;const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2,r.width,r.height]},
 voices:()=>stVoices.length};
window.__sph.play=()=>{if(state!=='play'){state='play';try{$('msg').style.display='none'}catch(e){}}return state};
window.__sph.st=()=>state;window.__sph.pos=()=>Math.round(pos.x*10)/10+','+Math.round(pos.z*10)/10;window.__sph.cash=n=>{if(n!==undefined)cash=n;return cash};
window.__sph.btn=()=>{const q=stPhBtn.getBoundingClientRect();return [q.left+q.width/2,q.top+q.height/2,q.width]};
