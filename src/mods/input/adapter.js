// ---------- input adapter: one input path (Pointer Events) for touch, mouse and pen, so controls work inside embeds and on desktop ----------
let inRot=0,inRW=0,inRH=0;const inW=()=>inRW||document.documentElement.clientWidth,inH=()=>inRH||document.documentElement.clientHeight,inX=e=>inRot===1?e.clientY:(inRot===2?inH()-e.clientY:(inRot===3?inW()-e.clientX:e.clientX)),inY=e=>inRot===1?inW()-e.clientX:(inRot===2?e.clientX:(inRot===3?inH()-e.clientY:e.clientY)); // 0 normal, 1 left (90), 2 right (270), 3 upside down (180) // rotate-screen mode maps real screen points into the rotated game space
const inTxt=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]');
if(window.PointerEvent){const act=new Map(),W=window,fire=(type,t,tgt)=>{const ev=new Event(type,{bubbles:true,cancelable:true});ev.inSyn=true;ev.changedTouches=[t];ev.touches=Array.from(act.values());ev.targetTouches=ev.touches;(tgt&&tgt.isConnected?tgt:document.body).dispatchEvent(ev)};
 const wake=()=>{try{if(AC&&AC.state==='suspended')AC.resume()}catch(e){}};
 const drop=(id,ty)=>{const t=act.get(id);if(!t)return;act.delete(id);fire(ty||'touchend',t,t.target)};
 // release everything that matches: a missed "finger up" must never leave a control stuck
 const dropAll=f=>{for(const t of Array.from(act.values()))if(!f||f(t))drop(t.identifier,'touchcancel')};
 for(const ty of['touchstart','touchmove','touchend','touchcancel'])W.addEventListener(ty,e=>{if(e.inSyn)return;if(inTxt(e))return;e.stopImmediatePropagation();if(e.cancelable)e.preventDefault();
  if(ty==='touchend'||ty==='touchcancel'){wake();const left=e.touches?e.touches.length:0,mine=Array.from(act.values()).filter(t=>t.pt!=='mouse');
   if(left===0)dropAll();else if(mine.length>left){const c=e.changedTouches&&e.changedTouches[0];mine.sort((a,b)=>c?(Math.hypot(a.clientX-inX(c),a.clientY-inY(c))-Math.hypot(b.clientX-inX(c),b.clientY-inY(c))):0);for(let i=0;i<mine.length-left;i++)drop(mine[i].identifier)}}},{capture:true,passive:false});
 let lastP=-1e9;const mt=e=>({identifier:'mouse',pt:'mouse',clientX:inX(e),clientY:inY(e),pageX:inX(e),pageY:inY(e),target:e.target});
 for(const ty of['mousedown','mousemove','mouseup','click','dblclick','contextmenu'])W.addEventListener(ty,e=>{if(e.inSyn)return;if(inTxt(e))return;if((ty==='mousedown'||ty==='mouseup')&&typeof inMouseHook==='function'&&inMouseHook(e)){e.stopImmediatePropagation();return}if(ty!=='mousemove')e.stopImmediatePropagation();if(ty==='contextmenu')e.preventDefault();if(ty==='click')wake();
  const t=act.get('mouse');
  if(ty==='mousemove'){if(t){t.clientX=inX(e);t.clientY=inY(e);fire('touchmove',t,t.target)}return}
  if(ty==='mouseup'||ty==='click'){if(t){t.clientX=inX(e);t.clientY=inY(e);drop('mouse')}dropAll(c=>c.pt==='mouse');wake();return}
  if(ty==='mousedown'&&e.button===0&&!t&&performance.now()-lastP>700){const n=mt(e);act.set('mouse',n);fire('touchstart',n,n.target)}},{capture:true});
 W.addEventListener('pointerdown',e=>{lastP=performance.now();if(inTxt(e))return;if(e.pointerType==='mouse'&&typeof inMouseHook==='function'&&inMouseHook(e))return;if(e.pointerType==='mouse'&&e.button!==0)return;
  if(act.has(e.pointerId))drop(e.pointerId,'touchcancel');if(e.isPrimary)dropAll(c=>c.pt===e.pointerType);
  const t={identifier:e.pointerId,pt:e.pointerType||'touch',clientX:inX(e),clientY:inY(e),pageX:inX(e),pageY:inY(e),target:e.target};act.set(e.pointerId,t);
  try{if(e.pointerType==='mouse'&&e.target.setPointerCapture)e.target.setPointerCapture(e.pointerId)}catch(x){}fire('touchstart',t,t.target)},{capture:true});
 W.addEventListener('pointermove',e=>{lastP=performance.now();const t=act.get(e.pointerId);if(!t)return;if(t.pt==='mouse'&&e.isTrusted&&e.buttons===0){drop(e.pointerId);return}t.clientX=inX(e);t.clientY=inY(e);t.pageX=t.clientX;t.pageY=t.clientY;fire('touchmove',t,t.target)},{capture:true});
 const end=ty=>e=>{lastP=performance.now();const t=act.get(e.pointerId);if(!t)return;t.clientX=inX(e);t.clientY=inY(e);drop(e.pointerId,ty);wake()};
 W.addEventListener('pointerup',end('touchend'),{capture:true});W.addEventListener('pointercancel',end('touchcancel'),{capture:true});
 W.addEventListener('blur',()=>dropAll());W.addEventListener('pagehide',()=>dropAll());document.addEventListener('visibilitychange',()=>{if(document.hidden)dropAll()})}
