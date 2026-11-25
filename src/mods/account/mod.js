// ---------- account: sign in with an emailed 6-digit code, cloud saves that follow the player (module prefix: ac) ----------
// Backend: Supabase (Auth email OTP + one table "profiles" protected by Row Level Security). Setup: docs/ACCOUNT_SETUP.md.
// Only the project URL and the anon (publishable) key go here; both are meant to be public. Never put any other key in this file.
const acCfg={url:'https://sudgpszinjrjkyttogqb.supabase.co',anon:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZGdwc3ppbmpyamt5dHRvZ3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1ODI1NjEsImV4cCI6MjExMTE1ODU2MX0.soHLXH4ddKwjMOX89QdFDLpyqkvthdKzZ-En-Imnya4'};
const acBIG=999999999,acSKEY='bcacct_session',acMKEY='bcacct_meta',acBKEY='bcacct_backup',acPFX='blockcity_',acLIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
const acDevKeys=['q','auto','rot','lh','fps','hint'];   // settings that belong to one device (screen and layout); they are not copied between devices
let acLibP=null,acCl=null,acInitP=null,acUser=null,acAdmin=false,acReal=0,acOpen=false,acView='email',acMsg='',acMsgBad=false,acBusy=false,acEmail='',acCodeV='',acSendAt=0,acSends=[],acTries=0,acConf=null,acSt='off',acPushT=0,acLastPush=-1e9,acRetry=0,acRetryT=0,acDelC=0,acPushing=false,acAgain=false,acKeepUntil=0,acFrozen=false,acGot=false,acNoPersist=false,acCloudT=0,acSyncing=false,acMetaT=0;
const acOK=()=>!!(acCfg.url&&acCfg.anon);
// ----- storage: may be blocked or partitioned inside a third-party iframe (Sekai) -----
const acLS=(function(){try{const k='bcacct_t';localStorage.setItem(k,'1');const ok=localStorage.getItem(k)==='1';localStorage.removeItem(k);return ok}catch(e){return false}})();
const acFramed=(function(){try{return window.top!==window.self}catch(e){return true}})();
const acMem={};
const acStore={getItem:k=>{if(acLS){try{return localStorage.getItem(k)}catch(e){}}return acMem[k]===undefined?null:acMem[k]},setItem:(k,v)=>{acMem[k]=String(v);if(acLS){try{localStorage.setItem(k,v)}catch(e){acNoPersist=true}}},removeItem:k=>{delete acMem[k];if(acLS){try{localStorage.removeItem(k)}catch(e){}}}};
let acMeta={play:0,t:0,h:'',uid:'',syncAt:'',syncHash:''};try{Object.assign(acMeta,JSON.parse(localStorage.getItem(acMKEY)||'{}'))}catch(e){}
try{const a=JSON.parse(localStorage.getItem('bcacct_sent')||'[]');if(Array.isArray(a)){acSends=a.filter(t=>t>0&&t<=Date.now()&&Date.now()-t<900000);acSendAt=acSends.length?Math.max.apply(null,acSends):0}}catch(e){}
function acMetaSave(){try{localStorage.setItem(acMKEY,JSON.stringify(acMeta))}catch(e){}}
// ----- the save bundle: every blockcity_* key of the local save -----
const acCash=()=>acAdmin?acReal:cash;
function acLive(){return JSON.stringify({v:1,cash:acCash(),ammo:[WEAP[1].ammo,WEAP[2].ammo,WEAP[3].ammo],kills:kills,passed:typeof msPassed!=='undefined'?msPassed:0,best:typeof msBest!=='undefined'?msBest:0})}
function acKeys(){const o={};if(!acLS){o[acPFX+'save']=acLive();return o}
 try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf(acPFX)===0){const v=localStorage.getItem(k);if(v!==null&&v.length<300000)o[k]=v}}}catch(e){}return o}
function acNorm(k,v){if(k!==acPFX+'settings')return v;try{const o=JSON.parse(v);for(const d of acDevKeys)delete o[d];return JSON.stringify(o)}catch(e){return v}}
function acHash(keys){const n=Object.keys(keys||{}).sort();let h=5381,c=0;for(const k of n){if(k===acPFX+'hints')continue;const s=k+'='+acNorm(k,String(keys[k]))+';';for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;c+=s.length}return h+':'+c}
function acLocalHash(){const h=acHash(acKeys());if(h!==acMeta.h){acMeta.h=h;acMeta.t=Date.now();acMetaSave()}return h}
const acDev=()=>((navigator.maxTouchPoints||0)>0&&Math.min(screen.width,screen.height)<700)?'phone':'computer';
function acBundle(){const b={v:1,t:acMeta.t||Date.now(),play:Math.round(acMeta.play||0),cash:acCash(),dev:acDev(),keys:acKeys()};
 try{if(JSON.stringify(b).length>800000)delete b.keys[acPFX+'map']}catch(e){}return b}
function acInfo(b){let c=0;try{c=(b&&typeof b.cash==='number')?b.cash:(JSON.parse(b.keys[acPFX+'save']).cash|0)}catch(e){}return {cash:c,t:b&&b.t||0,play:b&&b.play||0,dev:b&&b.dev||''}}
// ----- wrap the local save: the admin perk never reaches the saved cash; every local save also schedules a cloud save -----
{const old=msSave;msSave=function(){if(acFrozen)return;if(acAdmin){if(cash<acBIG/2)acReal=Math.max(0,cash|0);const c=cash;cash=acReal;try{old()}finally{cash=c<acBIG/2?acBIG:c}}else old();acTouch()}}
function acTouch(){if(acFrozen)return;const now=Date.now();if(now-acMetaT>8000){acMetaT=now;acMetaSave()}if(!acUser||acConf)return;if(acLocalHash()!==acMeta.syncHash)acSchedule()}
function acSchedule(){if(acPushT||!acUser)return;acPushT=setTimeout(()=>{acPushT=0;acPush()},Math.max(1500,15000-(Date.now()-acLastPush)))}
function acSetAdmin(on){on=!!on;if(on&&!acAdmin){acReal=Math.max(0,cash|0);acAdmin=true;cash=acBIG}else if(!on&&acAdmin){acAdmin=false;cash=acReal}document.body.classList.toggle('ac-inf',acAdmin)}
MODS.push(function acTick(dt){if(acAdmin&&cash!==acBIG){if(cash<acBIG/2)acReal=Math.max(0,cash|0);cash=acBIG}if(state==='play')acMeta.play=(acMeta.play||0)+dt});
// ----- plain words for errors -----
function acPlain(e){const m=String(e&&(e.message||e.error_description||e.msg||e.code)||e||'').toLowerCase(),st=e&&e.status;try{console.log('account:',m)}catch(x){}
 if(/failed to fetch|networkerror|network request|load failed|timed out|timeout|could not load/.test(m))return 'No connection. Check the internet and try again.';
 if(st===429||/rate limit|too many|security purposes/.test(m))return 'Too many tries just now. Wait a minute and try again.';
 if(/expired|invalid.*(token|otp|code)|otp/.test(m))return 'That code is wrong or has expired. Check it or send a new one.';
 if(/signups? not allowed|signup.*disabled/.test(m))return 'New accounts are switched off right now.';
 if(/email.*invalid|invalid.*email|validate email/.test(m))return 'That email address does not look right.';
 if(/error sending|smtp|sending.*email/.test(m))return 'The code email could not be sent. Try again in a few minutes.';
 if(st===401||/jwt|not authenticated|refresh token|session/.test(m))return 'Your sign-in ran out. Please sign in again.';
 if(/permission denied|row-level|42501/.test(m))return 'The server refused that change.';
 return 'Something went wrong. Please try again.'}
const acIsNet=e=>/connection/i.test(acPlain(e)),acIsAuth=e=>/sign-in ran out/.test(acPlain(e));
// ----- supabase-js, loaded only when needed -----
function acLib(){if(acLibP)return acLibP;acLibP=new Promise((res,rej)=>{if(window.__acLib){res(window.__acLib);return}if(window.supabase&&window.supabase.createClient){res(window.supabase);return}
  const s=document.createElement('script'),to=setTimeout(()=>rej(new Error('could not load')),15000);s.src=acLIB;s.async=true;
  s.onload=()=>{clearTimeout(to);if(window.supabase&&window.supabase.createClient)res(window.supabase);else rej(new Error('could not load'))};s.onerror=()=>{clearTimeout(to);rej(new Error('could not load'))};document.head.appendChild(s)});
 acLibP.catch(()=>{acLibP=null});return acLibP}
function acFetch(u,o){o=o||{};if(Date.now()<acKeepUntil&&(!o.body||String(o.body).length<60000))o=Object.assign({},o,{keepalive:true});return fetch(u,o)}
function acInit(){if(acInitP)return acInitP;if(!acOK())return Promise.reject(new Error('not set up'));
 acInitP=acLib().then(lib=>{acCl=lib.createClient(acCfg.url,acCfg.anon,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'implicit',storageKey:acSKEY,storage:acStore},global:{fetch:acFetch}});return acCl.auth.getSession()})
  .then(r=>{const s=r&&r.data&&r.data.session;acUser=s&&s.user?s.user:null;if(acUser)acSync(false);return acCl});
 acInitP.catch(()=>{acInitP=null;acCl=null});return acInitP}
function acSetSt(s){acSt=s;acChipSync();if(acOpen&&(acView==='profile'||acView==='conflict'))acRender()}
// ----- sync -----
function acFail(e){if(acIsAuth(e)){acDrop('Your sign-in ran out. Please sign in again.');return}acSetSt('offline');acRetry=Math.min(60,acRetry?acRetry*2:5);clearTimeout(acRetryT);acRetryT=setTimeout(acResync,acRetry*1000)}
function acResync(){clearTimeout(acRetryT);acRetryT=0;if(!acUser||!acCl||acConf)return;if(!acGot)acSync(false);else if(acLocalHash()!==acMeta.syncHash)acPush();else acSetSt('synced')}
function acMark(row,h){acMeta.uid=acUser?acUser.id:'';acMeta.syncAt=row&&row.updated_at||'';acMeta.syncHash=h;acCloudT=row&&row.updated_at?Date.parse(row.updated_at):Date.now();acMetaSave()}
function acSync(interactive){if(!acCl||!acUser||acSyncing)return;acSyncing=true;acSetSt('loading');const uid=acUser.id;
 Promise.resolve().then(()=>acCl.from('profiles').select('save,is_admin,updated_at').eq('id',uid).maybeSingle()).then(r=>{acSyncing=false;if(r&&r.error)throw r.error;if(!acUser||acUser.id!==uid)return;
  const row=r&&r.data;acGot=true;acRetry=0;acSetAdmin(row&&row.is_admin===true);const lh=acLocalHash();
  if(!row||!row.save||!row.save.keys){acPush();return}
  const ch=acHash(row.save.keys),same=acMeta.uid===uid;
  if(ch===lh){acMark(row,lh);acSetSt('synced');return}
  if(same&&acMeta.syncAt===row.updated_at){acPush();return}                       // the cloud copy is the one this device last wrote or read: just save
  let fresh=false;try{fresh=acLS&&localStorage.getItem(acPFX+'save')===null}catch(e){}
  const quiet=fresh||(same&&lh===acMeta.syncHash);                                 // nothing new on this device: the cloud copy is simply newer
  let looped=false;try{looped=Date.now()-(+sessionStorage.getItem('bcacct_rl')||0)<20000}catch(e){}
  if(quiet&&!looped&&(state==='ready'||acOpen)){acApply(row);return}
  acConf={row:row,quiet:quiet};acSetSt('conflict');if(acOpen){acView='conflict';acRender()}
 }).catch(e=>{acSyncing=false;acFail(e)})}
function acPush(){if(!acCl||!acUser||acConf||acFrozen)return;if(acPushing){acAgain=true;return}clearTimeout(acPushT);acPushT=0;
 const b=acBundle(),h=acHash(b.keys),uid=acUser.id;acPushing=true;acSetSt('saving');
 Promise.resolve().then(()=>acCl.from('profiles').update({save:b}).eq('id',uid).select('updated_at')).then(r=>{if(r&&r.error)throw r.error;if(r&&r.data&&r.data.length)return r.data[0];
   return acCl.from('profiles').insert({id:uid,save:b}).select('updated_at').then(r2=>{if(r2&&r2.error)throw r2.error;return r2&&r2.data&&r2.data[0]})})
  .then(row=>{acPushing=false;acLastPush=Date.now();acRetry=0;acGot=true;if(!acUser||acUser.id!==uid)return;acMark(row,h);acSetSt('synced');if(acAgain||acLocalHash()!==h){acAgain=false;acSchedule()}})
  .catch(e=>{acPushing=false;acAgain=false;acFail(e)})}
function acFlush(){acMetaSave();if(!acUser||!acCl||acConf||acFrozen)return;if(acLocalHash()!==acMeta.syncHash){acKeepUntil=Date.now()+4000;acPush()}}
addEventListener('pagehide',acFlush);document.addEventListener('visibilitychange',()=>{if(document.hidden)acFlush()});addEventListener('online',()=>{if(acSt==='offline')acResync()});
// take the cloud copy: back up this device's save first, then restart the game so every module reads the new save
function acApply(row){const b=row.save,keys=Object.assign({},b.keys||{});acConf=null;
 try{localStorage.setItem(acBKEY,JSON.stringify({t:Date.now(),keys:acKeys()}))}catch(e){try{const k=acKeys();delete k[acPFX+'map'];localStorage.setItem(acBKEY,JSON.stringify({t:Date.now(),keys:k}))}catch(x){}}
 if(!acLS){try{const d=JSON.parse(keys[acPFX+'save']||'null');if(d){const c=Math.max(0,d.cash|0);if(acAdmin)acReal=c;else cash=c;if(d.ammo)for(let k=0;k<3;k++)if(d.ammo[k]>=0)WEAP[k+1].ammo=d.ammo[k]|0;kills=d.kills|0;if(typeof msPassed!=='undefined'){msPassed=d.passed|0;msBest=d.best|0}}}catch(e){}
  acMeta.play=b.play||acMeta.play;acMeta.h=acHash(acKeys());acMark(row,acMeta.h);acSetSt('synced');if(acOpen){acView='profile';acRender()}return}
 try{const loc=JSON.parse(localStorage.getItem(acPFX+'settings')||'null');if(loc&&keys[acPFX+'settings']){const c=JSON.parse(keys[acPFX+'settings']);for(const d of acDevKeys){if(loc[d]!==undefined)c[d]=loc[d];else delete c[d]}keys[acPFX+'settings']=JSON.stringify(c)}}catch(e){}
 try{const dead=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf(acPFX)===0&&keys[k]===undefined)dead.push(k)}for(const k of dead)localStorage.removeItem(k);for(const k in keys)localStorage.setItem(k,String(keys[k]))}catch(e){}
 acMeta.play=b.play||0;acMeta.t=b.t||Date.now();acMeta.h=acHash(acKeys());acMark(row,acMeta.h);
 acFrozen=true;try{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).indexOf(acPFX)===0||k===acMKEY)return;return set.call(this,k,v)}}catch(e){}   // nothing may overwrite the new save on the way out
 try{sessionStorage.setItem('bcacct_rl',String(Date.now()))}catch(e){}
 acMsg='Loading your saved game...';acMsgBad=false;acView='wait';if(acOpen)acRender();setTimeout(()=>{try{location.reload()}catch(e){}},350)}
// ----- sign in / out -----
function acSend(){if(acBusy)return;const el=document.getElementById('acEm');if(el)acEmail=el.value.trim();const now=Date.now();
 if(!/^[^@ ]+@[^@ ]+[.][^@ ]+$/.test(acEmail)||acEmail.length>200){acSay('Type your email address first.',true);return}
 if(now-acSendAt<60000){acSay('Please wait '+Math.ceil((60000-(now-acSendAt))/1000)+' seconds before asking for another code.',true);return}
 acSends=acSends.filter(t=>now-t<900000);if(acSends.length>=4){acSay('Too many codes requested. Try again in a few minutes.',true);return}
 acBusy=true;acSay('Sending your sign-in email...');
 acInit().then(cl=>cl.auth.signInWithOtp({email:acEmail,options:{shouldCreateUser:true,emailRedirectTo:acBack()}})).then(r=>{acBusy=false;if(r&&r.error)throw r.error;acSendAt=Date.now();acSends.push(acSendAt);try{localStorage.setItem('bcacct_sent',JSON.stringify(acSends))}catch(x){}acTries=0;acCodeV='';acView='code';acSay('');acFocus('acCode')})
  .catch(e=>{acBusy=false;acSay(acPlain(e),true)})}
function acVerify(){if(acBusy)return;const el=document.getElementById('acCode');if(el)acCodeV=el.value.replace(/[^0-9]/g,'');
 if(acCodeV.length!==6){acSay('Type the 6 numbers from the email.',true);return}if(acTries>=8){acSay('Too many tries. Send a new code.',true);return}
 acTries++;acBusy=true;acSay('Checking...');
 acInit().then(cl=>cl.auth.verifyOtp({email:acEmail,token:acCodeV,type:'email'})).then(r=>{acBusy=false;if(r&&r.error)throw r.error;const d=r&&r.data||{};acUser=d.user||(d.session&&d.session.user)||null;if(!acUser)throw new Error('otp');
   acCodeV='';acGot=false;acConf=null;acNoPersist=acNoPersist||!acLS;if(acLS){try{if(localStorage.getItem(acSKEY)===null)acNoPersist=true}catch(e){acNoPersist=true}}
   acView='profile';acSay('');acSync(true)})
  .catch(e=>{acBusy=false;acCodeV='';const c=document.getElementById('acCode');if(c)c.value='';acSay(acPlain(e),true);acFocus('acCode')})}
function acDrop(msg){clearTimeout(acPushT);acPushT=0;clearTimeout(acRetryT);acRetryT=0;const cl=acCl;acUser=null;acConf=null;acGot=false;acSetAdmin(false);acSt='off';acChipSync();acView='email';acDelC=0;
 try{if(cl)Promise.resolve(cl.auth.signOut({scope:'local'})).catch(()=>{})}catch(e){}acSay(msg||'');if(typeof msSave==='function')msSave()}
function acSignOut(){if(acBusy)return;if(acUser&&acCl&&!acConf&&acLocalHash()!==acMeta.syncHash){acKeepUntil=Date.now()+4000;acPush()}setTimeout(()=>acDrop('Signed out. Your game is still saved on this device.'),acPushing?700:0)}
function acDelete(){if(acBusy||!acUser||!acCl)return;if(!acDelC){acDelC=1;acRender();return}acDelC=0;acBusy=true;acSay('Deleting...');const uid=acUser.id;
 Promise.resolve().then(()=>acCl.rpc('delete_my_account')).then(r=>{if(r&&r.error)return acCl.from('profiles').update({save:null}).eq('id',uid).select('updated_at').then(r2=>{if(r2&&r2.error)throw r2.error})})
  .then(()=>{acBusy=false;acMeta.uid='';acMeta.syncAt='';acMeta.syncHash='';acMetaSave();acDrop('Your account data was deleted. This device still has its own save.')})
  .catch(e=>{acBusy=false;acSay(acPlain(e),true)})}
// ----- panel -----
const acEsc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function acMask(e){e=String(e||'');const i=e.indexOf('@');if(i<1)return 'your email';const d=e.slice(i+1),j=d.lastIndexOf('.');return e.charAt(0)+'&bull;&bull;&bull;@'+d.charAt(0)+'&bull;&bull;&bull;'+(j>0?acEsc(d.slice(j)):'')}
function acAgo(t){if(!t)return 'never';const s=(Date.now()-t)/1000;if(s<60)return 'just now';if(s<3600)return Math.round(s/60)+' min ago';if(s<86400)return Math.round(s/3600)+' h ago';try{return new Date(t).toLocaleDateString()}catch(e){return 'a while ago'}}
function acDur(s){s=Math.round(s||0);const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?h+' h '+m+' min':m+' min'}
const acMoney=c=>'$'+String(Math.round(c||0)).replace(/([0-9])(?=([0-9]{3})+$)/g,'$1,');
const acStTxt={off:'Not connected',loading:'Connecting...',saving:'Saving...',synced:'Saved to your account',offline:'Offline. Will try again by itself.',conflict:'Choose which save to keep'};
{const st=document.createElement('style');st.id='acCss';st.textContent=
 '#acRoot{position:fixed;left:0;top:0;right:0;bottom:0;z-index:150;display:none;align-items:flex-start;justify-content:center;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:calc(var(--st,0px) + 9vh) 12px 16px;box-sizing:border-box;background:rgba(6,8,14,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:#fff;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,Helvetica,Arial,sans-serif;touch-action:manipulation}'
 +'@media (max-height:480px){#acRoot{padding-top:calc(var(--st,0px) + 8px)}}'
 +'.ac-pan{width:min(400px,100%);box-sizing:border-box;border-radius:22px;border:1px solid var(--gb,rgba(255,255,255,.17));padding:16px 16px 14px;background:rgba(18,20,28,.94);box-shadow:0 20px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.1)}'
 +'.ac-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.ac-hd b{font-size:20px;font-weight:900;letter-spacing:1.5px}.ac-x{width:34px;height:34px;border-radius:50%;border:1px solid var(--gb,rgba(255,255,255,.17));display:flex;align-items:center;justify-content:center;font-size:20px;line-height:1;background:rgba(255,255,255,.06)}'
 +'.ac-p{font-size:13px;line-height:1.4;opacity:.82;margin:0 0 12px}.ac-p b{color:var(--ac,#ffd23f);opacity:1}'
 +'.ac-in{display:block;width:100%;height:50px;box-sizing:border-box;border-radius:14px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#fff;font:600 17px/1 inherit;font-family:inherit;padding:0 14px;outline:none;-webkit-appearance:none;appearance:none;-webkit-user-select:text;user-select:text}.ac-in:focus{border-color:var(--ac,#ffd23f)}.ac-in::placeholder{color:rgba(255,255,255,.38)}.ac-code{text-align:center;font-size:26px;font-weight:800;letter-spacing:.42em;text-indent:.42em;font-variant-numeric:tabular-nums}'
 +'.ac-b{display:flex;align-items:center;justify-content:center;height:46px;margin-top:10px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;text-align:center;border:1px solid var(--gb,rgba(255,255,255,.17));background:rgba(255,255,255,.08);box-sizing:border-box;padding:0 12px}.ac-b.ac-go{font-size:14px;color:#14161c;background:linear-gradient(160deg,#ffe27a,#ffb300);border-color:transparent}.ac-b.ac-warn{color:#ff8f85;border-color:rgba(255,99,88,.5)}.ac-b.ac-dim{opacity:.45}.ac-row{display:flex;gap:10px}.ac-row .ac-b{flex:1;font-size:11px;letter-spacing:.5px;padding:0 8px;line-height:1.15}'
 +'.ac-msg{min-height:18px;margin-top:10px;font-size:12.5px;font-weight:700;text-align:center;color:#ffe9a8}.ac-msg.bad{color:#ff8f85}.ac-note{margin-top:10px;font-size:11px;line-height:1.35;opacity:.6;text-align:center}'
 +'.ac-card{border-radius:16px;border:1px solid var(--gb,rgba(255,255,255,.17));background:rgba(255,255,255,.05);padding:10px 12px}.ac-card+.ac-card{margin-top:8px}.ac-who{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:800;margin-bottom:6px;word-break:break-all}.ac-badge{flex:none;padding:2px 8px;border-radius:999px;background:var(--ac,#ffd23f);color:#14161c;font-size:10px;font-weight:900;letter-spacing:.8px}'
 +'.ac-kv{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;font-weight:600;padding:4px 0}.ac-kv span:first-child{opacity:.62}.ac-kv em{font-style:normal;font-weight:800;color:#7dffa0;font-variant-numeric:tabular-nums;text-align:right}.ac-kv em.w{color:#fff}.ac-kv em.o{color:#ffb86b}'
 +'.ac-ct{font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;opacity:.6;margin-bottom:2px}'
 +'.ac-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#34c759;margin-left:2px}.ac-dot.o{background:#ffb86b}'
 +'#acChip{position:fixed;left:50%;top:calc(var(--st,0px) + 52px);transform:translateX(-50%);z-index:60;display:none;padding:8px 14px;border-radius:999px;border:1px solid var(--ac,#ffd23f);background:rgba(18,20,28,.9);color:#fff;font:800 11px/1 -apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:.8px;text-transform:uppercase;white-space:nowrap}'
 +'body.ac-inf #cash{font-size:0!important}body.ac-inf #cash::after{content:"$'+String.fromCharCode(8734)+'";font-size:21px}';
 document.head.appendChild(st)}
const acRoot=document.createElement('div');acRoot.id='acRoot';document.body.appendChild(acRoot);
const acChip=document.createElement('div');acChip.id='acChip';acChip.textContent='Newer save in your account';document.body.appendChild(acChip);
function acChipSync(){acChip.style.display=(acConf&&!acOpen&&state!=='ready')?'block':'none'}
function acSay(m,bad){acMsg=m||'';acMsgBad=!!bad;if(acOpen)acRender()}
function acFocus(id){setTimeout(()=>{const e=document.getElementById(id);if(e&&acOpen){try{e.focus({preventScroll:false})}catch(x){}}},60)}
function acStoreNote(){if(!acLS||acNoPersist)return '<div class="ac-note">This browser does not let the game remember your sign-in here. You will need to sign in again next time. The game itself works as normal.</div>';
 if(acFramed)return '<div class="ac-note">Inside an app the sign-in may not be remembered. If it asks again, just sign in again. Your account keeps your game.</div>';return ''}
function acRender(){const em=document.getElementById('acEm'),cd=document.getElementById('acCode'),foc=document.activeElement&&document.activeElement.id;if(em)acEmail=em.value.trim();if(cd)acCodeV=cd.value;
 const msg='<div class="ac-msg'+(acMsgBad?' bad':'')+'" id="acMsg">'+acEsc(acMsg)+'</div>';let h='<div class="ac-pan"><div class="ac-hd"><b>ACCOUNT</b><div class="ac-x" data-ac="close">&times;</div></div>';
 if(!acOK())h+='<div class="ac-card" style="text-align:center;padding:18px 12px"><div style="font-size:16px;font-weight:800;margin-bottom:6px">Accounts are not set up yet</div><div style="font-size:12.5px;opacity:.7;line-height:1.4">Your game still saves on this device, the same as always.</div></div><div class="ac-b ac-go" data-ac="close">OK</div>';
 else if(acView==='wait')h+=msg;
 else if(acView==='conflict'&&acConf){const L=acInfo(acBundle()),C=acInfo(acConf.row.save),ct=acConf.row.updated_at?Date.parse(acConf.row.updated_at):C.t;
  h+='<div class="ac-p">'+(acConf.quiet?'Your account has a newer save. Load it now?':'This device and your account have different saves. Which one do you want to keep?')+'</div>'
   +'<div class="ac-card"><div class="ac-ct">This device</div><div class="ac-kv"><span>Cash</span><em>'+acMoney(L.cash)+'</em></div><div class="ac-kv"><span>Last saved</span><em class="w">'+acAgo(acMeta.t)+'</em></div></div>'
   +'<div class="ac-card"><div class="ac-ct">Your account'+(C.dev?' &middot; from a '+acEsc(C.dev):'')+'</div><div class="ac-kv"><span>Cash</span><em>'+acMoney(C.cash)+'</em></div><div class="ac-kv"><span>Last saved</span><em class="w">'+acAgo(ct)+'</em></div></div>'
   +'<div class="ac-row"><div class="ac-b" data-ac="keepLocal">Keep this device</div><div class="ac-b ac-go" data-ac="keepCloud">Use account save</div></div><div class="ac-note">The other save is replaced. If you pick the account save, the game restarts.</div>'+msg}
 else if(acUser&&acView!=='email'&&acView!=='code'){const st=acSt==='synced'?'Saved to your account':(acStTxt[acSt]||''),col=acSt==='synced'?'':(acSt==='offline'||acSt==='conflict'?'o':'w');
  h+='<div class="ac-card"><div class="ac-who"><span>'+acMask(acUser.email)+'</span>'+(acAdmin?'<span class="ac-badge">ADMIN</span>':'')+'</div>'
   +'<div class="ac-kv"><span>Cash</span><em>'+(acAdmin?'&infin; unlimited':acMoney(cash))+'</em></div><div class="ac-kv"><span>Play time</span><em class="w">'+acDur(acMeta.play)+'</em></div>'
   +'<div class="ac-kv"><span>Last saved to account</span><em class="w">'+acAgo(acCloudT)+'</em></div><div class="ac-kv"><span>Sync</span><em class="'+col+'" id="acSync">'+st+'</em></div></div>'
   +'<div class="ac-row"><div class="ac-b" data-ac="sync">Save now</div><div class="ac-b" data-ac="out">Sign out</div></div><div class="ac-b ac-warn" data-ac="del">'+(acDelC?'Tap again to delete for good':'Delete my account data')+'</div>'+msg+(acNoPersist||!acLS?acStoreNote():'')}
 else if(acView==='code'){const left=Math.max(0,Math.ceil((60000-(Date.now()-acSendAt))/1000));
  h+='<div class="ac-p">We emailed <b>'+acMask(acEmail)+'</b>. Tap <b>Sign in</b> in that email to open the game signed in, or type the 6-digit code if the email shows one. It can take a minute. Check spam too.</div><input class="ac-in ac-code" id="acCode" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" maxlength="6" placeholder="000000" enterkeyhint="done">'
   +'<div class="ac-b ac-go" data-ac="verify">Sign in</div><div class="ac-row"><div class="ac-b'+(left?' ac-dim':'')+'" data-ac="resend" id="acRe">'+(left?'Send again ('+left+')':'Send again')+'</div><div class="ac-b" data-ac="back">Other email</div></div>'+msg}
 else h+='<div class="ac-p">Sign in to keep your game on every device. We email you a sign-in link. No password.</div><input class="ac-in" id="acEm" type="email" inputmode="email" autocomplete="email" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="200" placeholder="Email address" enterkeyhint="send">'
   +'<div class="ac-b ac-go" data-ac="send">Email me a sign-in link</div>'+msg+acStoreNote();
 acRoot.innerHTML=h+'</div>';const e2=document.getElementById('acEm'),c2=document.getElementById('acCode');if(e2)e2.value=acEmail;if(c2)c2.value=acCodeV;if(foc==='acEm'&&e2)e2.focus();if(foc==='acCode'&&c2)c2.focus()}
function acOpenPanel(){if(acOpen)return;acOpen=true;acMsg='';acMsgBad=false;acDelC=0;acRoot.style.display='flex';acRoot.scrollTop=0;
 if(acOK()){if(acConf)acView='conflict';else if(acUser)acView='profile';else if(acView!=='code')acView='email';
  if(!acCl){let has=false;try{has=acStore.getItem(acSKEY)!==null}catch(e){}if(has){acView='wait';acMsg='Connecting...';acInit().then(()=>{if(acView==='wait'){acMsg='';acView=acConf?'conflict':(acUser?'profile':'email');if(acOpen)acRender()}}).catch(e=>{acView='email';acSay(acPlain(e),true)})}else acInit().catch(()=>{})}}
 acRender();acChipSync()}
function acClose(){if(!acOpen)return;acOpen=false;acRoot.style.display='none';acDelC=0;try{if(document.activeElement&&document.activeElement.blur&&acRoot.contains(document.activeElement))document.activeElement.blur()}catch(e){}acChipSync()}
function acAct(a){if(a==='close')acClose();else if(a==='send')acSend();else if(a==='verify')acVerify();else if(a==='resend'){if(Date.now()-acSendAt>=60000)acSend();else acSay('Please wait a little before sending again.',true)}
 else if(a==='back'){acView='email';acCodeV='';acSay('')}else if(a==='out')acSignOut();else if(a==='del')acDelete();
 else if(a==='sync'){acDelC=0;if(acConf){acView='conflict';acRender()}else if(!acGot)acSync(true);else{acLocalHash();acPush()}}
 else if(a==='keepLocal'){acConf=null;acView='profile';acPush();acRender();acChipSync()}else if(a==='keepCloud'){if(acConf)acApply(acConf.row)}
 if(a!=='del'&&acDelC){acDelC=0;if(acOpen)acRender()}}
const acTxt=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select');
acRoot.addEventListener('touchstart',e=>{e.stopPropagation();if(acTxt(e))return;if(e.cancelable)e.preventDefault();const a=e.target&&e.target.closest?e.target.closest('[data-ac]'):null;if(a)acAct(a.getAttribute('data-ac'))},{passive:false});
for(const acEv of['touchmove','touchend','touchcancel','mousedown','mouseup','click','wheel','keypress'])acRoot.addEventListener(acEv,e=>{e.stopPropagation()});
acRoot.addEventListener('input',e=>{const t=e.target;if(t&&t.id==='acCode'){const v=t.value.replace(/[^0-9]/g,'').slice(0,6);if(v!==t.value)t.value=v;acCodeV=v;if(v.length===6&&!acBusy)acVerify()}else if(t&&t.id==='acEm')acEmail=t.value.trim()});
acRoot.addEventListener('focusin',e=>{const t=e.target;if(t&&t.scrollIntoView)setTimeout(()=>{try{t.scrollIntoView({block:'center'})}catch(x){}},320)});
addEventListener('keydown',e=>{if(!acOpen)return;if(e.key==='Escape'){acClose();e.preventDefault()}else if(e.key==='Enter'&&acTxt(e)){acAct(acView==='code'?'verify':'send');e.preventDefault()}e.stopImmediatePropagation()},true);
addEventListener('keyup',e=>{if(acOpen)e.stopImmediatePropagation()},true);
acChip.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();acOpenPanel()},{passive:false});
setInterval(()=>{if(acOpen&&acView==='code'){const b=document.getElementById('acRe');if(b){const left=Math.max(0,Math.ceil((60000-(Date.now()-acSendAt))/1000));b.textContent=left?'Send again ('+left+')':'Send again';b.classList.toggle('ac-dim',left>0)}}},1000);
// ----- Account buttons on the title screen and in the pause / settings menu (added next to the ui module's own buttons) -----
function acMkBtn(id){const b=document.createElement('div');b.id=id;b.className='ui-b';b.innerHTML='Account<span class="ac-dot" style="display:none"></span>';
 b.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();acOpenPanel()},{passive:false});return b}
function acInject(){const t=document.getElementById('uiTitle');if(t&&!document.getElementById('acBtnT')){const o=t.querySelector('.ui-opt'),b=acMkBtn('acBtnT');if(o)o.appendChild(b);else{b.style.cssText='position:absolute;left:14px;bottom:calc(var(--sb,0px) + 7vh + 10px);height:34px;padding:0 13px;font-size:10px;color:#fff;border:1px solid rgba(255,255,255,.2)';t.appendChild(b)}}
 const s=document.getElementById('uiSet');if(s&&!document.getElementById('acBtnS')){const f=s.querySelector('.ui-ft');if(f)f.insertBefore(acMkBtn('acBtnS'),f.querySelector('.ui-res'))}
 for(const id of['acBtnT','acBtnS']){const b=document.getElementById(id),d=b&&b.querySelector('.ac-dot');if(d){d.style.display=acUser?'inline-block':'none';d.className='ac-dot'+(acSt==='synced'||acSt==='saving'?'':' o')}}
 if(acAdmin&&s){const sp=s.querySelector('.ui-hd span');if(sp&&sp.textContent.indexOf('$'+acBIG)>=0)sp.textContent=sp.textContent.replace('$'+acBIG,'$'+String.fromCharCode(8734))}
 acChipSync()}
setInterval(acInject,400);
// ----- start: only load anything if this device already holds a sign-in -----
function acBack(){const h=location.origin+location.pathname;return /^https:/.test(h)?h:'https://jacobjburrell.github.io/block-city/'}
// emailed sign-in link: the game opens with #access_token=... (or #error=...); supabase-js reads it, then we show the account panel
function acLinkIn(){const h=location.hash||'';if(!/access_token=|error_description=/.test(h))return false;const bad=/error_description=([^&]*)/.exec(h);
 if(bad){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}acView='email';acOpenPanel();acSay(/expired|invalid/i.test(decodeURIComponent(bad[1]))?'That sign-in link has expired. Send a new one.':'That sign-in link did not work. Send a new one.',true);return true}
 acInit().then(()=>{try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}if(acUser){acView='profile';acGot=false;acOpenPanel();acSync(true)}}).catch(e=>{acOpenPanel();acSay(acPlain(e),true)});return true}
function acBoot(){if(!acOK()||acCl||acInitP)return;if(acLinkIn())return;let has=false;try{has=acStore.getItem(acSKEY)!==null}catch(e){}if(has)acInit().catch(()=>{})}
setTimeout(acBoot,2500);
