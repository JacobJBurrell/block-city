// ---------- input adapter: one input path (Pointer Events) for touch, mouse and pen, so controls work inside embeds and on desktop ----------
let inRot=0,inRW=0,inRH=0;const inW=()=>inRW||document.documentElement.clientWidth,inH=()=>inRH||document.documentElement.clientHeight,inX=e=>inRot===1?e.clientY:(inRot===2?inH()-e.clientY:(inRot===3?inW()-e.clientX:e.clientX)),inY=e=>inRot===1?inW()-e.clientX:(inRot===2?e.clientX:(inRot===3?inH()-e.clientY:e.clientY)); // 0 normal, 1 left (90), 2 right (270), 3 upside down (180) // rotate-screen mode maps real screen points into the rotated game space
const inTxt=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]');
// last input type (like Roblox): keyboard or mouse hides the on-screen touch controls (body.in-kbm), a finger on the screen brings them back
// inTchT: time of the last finger or pen event; inFing: finger/pen pointers that are down right now. On a touchscreen laptop both a mouse and fingers exist,
// and Chrome follows a tap with made-up mouse events (mousemove, mousedown, mouseup, click, or contextmenu after press-and-hold): those must never count as a mouse.
let inKbm=false,inMvAcc=0,inMvT=-1e9,inTchT=-1e9;const inFing=new Set();
function inSetKbm(on){inMvAcc=0;if(on===inKbm&&document.body.classList.contains('in-kbm')===on)return;inKbm=on;document.body.classList.toggle('in-kbm',on)}
inSetKbm(!((navigator.maxTouchPoints||0)>0));
{const W=window,o={capture:true,passive:true};
 for(const ty of['pointerdown','pointermove','pointerup','pointercancel'])W.addEventListener(ty,e=>{if(e.pointerType==='mouse')return;inTchT=performance.now();if(ty==='pointerdown')inFing.add(e.pointerId);else if(ty!=='pointermove')inFing.delete(e.pointerId)},o);
 for(const ty of['touchstart','touchmove','touchend','touchcancel'])W.addEventListener(ty,e=>{if(e.inSyn)return;inTchT=performance.now();if(ty!=='touchmove'&&e.touches&&!e.touches.length)inFing.clear()},o);
 W.addEventListener('blur',()=>inFing.clear());
 W.addEventListener('pointerdown',e=>{if(!e.isTrusted)return;if(e.pointerType==='mouse'){if(performance.now()-inTchT>1500)inFing.clear();inSetKbm(true)}else if(e.pointerType==='touch'||e.pointerType==='pen')inSetKbm(false)},o);
 // the mouse has to really travel (40px in one go) to take over, and never while a finger is on the screen or has just left it
 W.addEventListener('pointermove',e=>{if(!e.isTrusted||e.pointerType!=='mouse'||inKbm)return;const n=performance.now();if(inFing.size||n-inTchT<600){inMvAcc=0;return}if(n-inMvT>700)inMvAcc=0;inMvT=n;inMvAcc+=Math.abs(e.movementX||0)+Math.abs(e.movementY||0);if(inMvAcc>40)inSetKbm(true)},o);
 W.addEventListener('touchstart',e=>{if(e.isTrusted)inSetKbm(false)},o);
 // pinching on a laptop touchpad arrives as ctrl+wheel: keep the browser from zooming the whole page (the game still gets the wheel and zooms the camera)
 W.addEventListener('wheel',e=>{if(e.ctrlKey&&e.cancelable&&!inTxt(e))e.preventDefault()},{capture:true,passive:false});
 W.addEventListener('wheel',e=>{if(e.isTrusted)inSetKbm(true)},o);
 W.addEventListener('keydown',e=>{if(e.isTrusted&&!inTxt(e))inSetKbm(true)},true)}
if(window.PointerEvent){const act=new Map(),W=window,fire=(type,t,tgt)=>{const ev=new Event(type,{bubbles:true,cancelable:true});ev.inSyn=true;ev.changedTouches=[t];ev.touches=Array.from(act.values());ev.targetTouches=ev.touches;(tgt&&tgt.isConnected?tgt:document.body).dispatchEvent(ev)};
 const wake=()=>{try{if(AC&&AC.state==='suspended')AC.resume()}catch(e){}};
 const drop=(id,ty)=>{const t=act.get(id);if(!t)return;act.delete(id);fire(ty||'touchend',t,t.target)};
 // release everything that matches: a missed "finger up" must never leave a control stuck
 const dropAll=f=>{for(const t of Array.from(act.values()))if(!f||f(t))drop(t.identifier,'touchcancel')};
 // Pointer lock (shift lock, first person with the mouse): Chrome then reports every finger at the locked mouse position, on the locked element, so pointer events are useless for it.
 // A finger that comes down while locked releases the lock and is followed through the real touch events instead (they keep the true position); these get ids 'T0','T1'...
 let lkN=0,lkT=-1e9;const unlock=()=>{try{if(typeof uiUnlock==='function')uiUnlock();else if(document.exitPointerLock)document.exitPointerLock()}catch(x){}},at=c=>{const el=document.elementFromPoint(c.clientX,c.clientY);return el||document.body};
 for(const ty of['touchstart','touchmove','touchend','touchcancel'])W.addEventListener(ty,e=>{if(e.inSyn)return;if(inTxt(e))return;e.stopImmediatePropagation();if(e.cancelable)e.preventDefault();
  if(e.isTrusted&&e.changedTouches)for(const c of Array.from(e.changedTouches)){const k='T'+c.identifier,t=act.get(k);
   if(ty==='touchstart'){if(t||!(lkN>0&&performance.now()-lkT<250))continue;lkN--;const n={identifier:k,pt:'touch',lk:1,clientX:inX(c),clientY:inY(c),pageX:inX(c),pageY:inY(c),target:at(c)};act.set(k,n);fire('touchstart',n,n.target)}
   else if(t){t.clientX=inX(c);t.clientY=inY(c);t.pageX=t.clientX;t.pageY=t.clientY;if(ty==='touchmove')fire('touchmove',t,t.target);else drop(k,ty)}}
  if(ty==='touchend'||ty==='touchcancel'){wake();const left=e.touches?e.touches.length:0,mine=Array.from(act.values()).filter(t=>t.pt!=='mouse');
   if(left===0)dropAll();else if(mine.length>left){const c=e.changedTouches&&e.changedTouches[0];mine.sort((a,b)=>c?(Math.hypot(a.clientX-inX(c),a.clientY-inY(c))-Math.hypot(b.clientX-inX(c),b.clientY-inY(c))):0);for(let i=0;i<mine.length-left;i++)drop(mine[i].identifier)}}},{capture:true,passive:false});
 let lastP=-1e9;const mt=e=>({identifier:'mouse',pt:'mouse',clientX:inX(e),clientY:inY(e),pageX:inX(e),pageY:inY(e),target:e.target});
 for(const ty of['mousedown','mousemove','mouseup','click','dblclick','contextmenu'])W.addEventListener(ty,e=>{if(e.inSyn)return;if(inTxt(e))return;
  // mouse events a finger makes up (Chrome marks them with firesTouchEvents; otherwise: a finger is down, or was a moment ago) are swallowed here, before anything can take them for a click
  {const sc=e.sourceCapabilities,dt=performance.now()-inTchT;if((sc&&sc.firesTouchEvents)||inFing.size||dt<(ty==='mousemove'?400:1000)){e.stopImmediatePropagation();if(ty==='contextmenu')e.preventDefault();if(ty==='click')wake();return}}
  if((ty==='mousedown'||ty==='mouseup')&&typeof inMouseHook==='function'&&inMouseHook(e)){e.stopImmediatePropagation();return}if(ty!=='mousemove')e.stopImmediatePropagation();if(ty==='contextmenu')e.preventDefault();if(ty==='click')wake();
  const t=act.get('mouse');
  if(ty==='mousemove'){if(t){t.clientX=inX(e);t.clientY=inY(e);fire('touchmove',t,t.target)}return}
  if(ty==='mouseup'||ty==='click'){if(t){t.clientX=inX(e);t.clientY=inY(e);drop('mouse')}dropAll(c=>c.pt==='mouse');wake();return}
  if(ty==='mousedown'&&e.button===0&&!t&&performance.now()-lastP>700){const n=mt(e);act.set('mouse',n);fire('touchstart',n,n.target)}},{capture:true});
 W.addEventListener('pointerdown',e=>{lastP=performance.now();if(inTxt(e))return;
  if(e.pointerType!=='mouse'&&document.pointerLockElement){unlock();if(e.isTrusted&&'ontouchstart' in window){if(lastP-lkT>250)lkN=0;lkN++;lkT=lastP;return}}
 if(e.pointerType==='mouse'&&typeof inMouseHook==='function'&&inMouseHook(e))return;if(e.pointerType==='mouse'&&e.button!==0)return;
  if(act.has(e.pointerId))drop(e.pointerId,'touchcancel');if(e.isPrimary)dropAll(c=>c.pt===e.pointerType);
  const t={identifier:e.pointerId,pt:e.pointerType||'touch',clientX:inX(e),clientY:inY(e),pageX:inX(e),pageY:inY(e),target:e.target};act.set(e.pointerId,t);
  try{if(e.pointerType==='mouse'&&e.target.setPointerCapture)e.target.setPointerCapture(e.pointerId)}catch(x){}fire('touchstart',t,t.target)},{capture:true});
 W.addEventListener('pointermove',e=>{lastP=performance.now();const t=act.get(e.pointerId);if(!t)return;if(t.pt==='mouse'&&e.isTrusted&&e.buttons===0){drop(e.pointerId);return}t.clientX=inX(e);t.clientY=inY(e);t.pageX=t.clientX;t.pageY=t.clientY;fire('touchmove',t,t.target)},{capture:true});
 const end=ty=>e=>{lastP=performance.now();const t=act.get(e.pointerId);if(!t)return;t.clientX=inX(e);t.clientY=inY(e);drop(e.pointerId,ty);wake()};
 W.addEventListener('pointerup',end('touchend'),{capture:true});W.addEventListener('pointercancel',end('touchcancel'),{capture:true});
 W.addEventListener('blur',()=>dropAll());W.addEventListener('pagehide',()=>dropAll());document.addEventListener('visibilitychange',()=>{if(document.hidden)dropAll()})}
