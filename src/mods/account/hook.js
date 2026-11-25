// ---------- account test helpers (only in src/build/test.html) ----------
// Open test.html?acmock to run the account module against a fake supabase-js client. The fake "server" lives in
// localStorage key __acmock_db so it survives reloads; it enforces the same rules as the real table (own row only,
// only the save column writable). Nothing here ships in index.html.
window.__ac={
 st:()=>({ok:acOK(),open:acOpen,view:acView,user:acUser?acUser.id:null,admin:acAdmin,real:acReal,cash:cash,sync:acSt,conf:!!acConf,msg:acMsg,bad:acMsgBad,ls:acLS,lib:!!acCl,hud:getComputedStyle($('cash'),'::after').content,meta:Object.assign({},acMeta),retry:acRetry}),
 open:()=>acOpenPanel(),close:()=>acClose(),push:()=>acPush(),flush:()=>acFlush(),resync:()=>acResync(),client:()=>acCl,hash:()=>acLocalHash(),
 cooldown:v=>{acSendAt=v?Date.now():0;if(!v){acSends.length=0;try{localStorage.removeItem('bcacct_sent')}catch(e){}}}};
if(/[?&]acmock/.test(location.search)){
 const KEY='__acmock_db',M=window.__acMock={offline:false,rate:false,code:'123456',log:[],writes:0,
  db:()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{users:{},rows:{}}}catch(e){return {users:{},rows:{}}}},
  put:d=>localStorage.setItem(KEY,JSON.stringify(d)),
  // what the owner does in the Supabase SQL editor: only this "server side" call can change is_admin
  setAdmin:(email,v)=>{const d=M.db(),u=d.users[email];if(!u)return false;d.rows[u].is_admin=!!v;M.put(d);return true},
  setSave:(email,save)=>{const d=M.db(),u=d.users[email];if(!u)return false;d.rows[u].save=save;d.rows[u].updated_at=new Date(Date.now()+5).toISOString();M.put(d);return true},
  row:email=>{const d=M.db(),u=d.users[email];return u?d.rows[u]:null}};
 const later=v=>new Promise(r=>setTimeout(()=>r(v),40)),net=()=>({message:'TypeError: Failed to fetch',details:'',hint:'',code:''});
 window.__acLib={createClient:(url,key,opts)=>{const A=opts.auth,ss=A.storage,sk=A.storageKey;M.url=url;M.key=key;
  const sess=()=>{try{return JSON.parse(ss.getItem(sk)||'null')}catch(e){return null}};
  const q=(table)=>{const Q={op:'select',body:null,id:null,single:false,
    select:()=>Q,eq:(c,v)=>{if(c==='id')Q.id=v;return Q},maybeSingle:()=>{Q.single=true;return Q},
    update:b=>{Q.op='update';Q.body=b;return Q},insert:b=>{Q.op='insert';Q.body=b;return Q},
    then:(ok,bad)=>later().then(()=>{M.log.push(Q.op);if(M.offline)return {data:null,error:net()};const s=sess();if(table!=='profiles')return {data:null,error:{message:'relation does not exist',code:'42P01'}};
      const d=M.db(),uid=s&&s.user&&s.user.id,mine=uid&&Q.id===uid?d.rows[uid]:null;   // RLS: a row is only visible to its owner
      if(Q.op==='select')return {data:Q.single?(mine||null):(mine?[mine]:[]),error:null};
      if(!uid)return {data:null,error:{message:'permission denied for table profiles',code:'42501'}};
      const cols=Object.keys(Q.body||{});
      if(Q.op==='update'){if(cols.some(c=>c!=='save'))return {data:null,error:{message:'permission denied for table profiles',code:'42501'}};if(!mine)return {data:[],error:null};
       mine.save=JSON.parse(JSON.stringify(Q.body.save));mine.updated_at=new Date().toISOString();M.put(d);M.writes++;return {data:[{updated_at:mine.updated_at}],error:null}}
      if(cols.some(c=>c!=='save'&&c!=='id')||Q.body.id!==uid)return {data:null,error:{message:'new row violates row-level security policy',code:'42501'}};
      d.rows[uid]={id:uid,save:Q.body.save,is_admin:false,updated_at:new Date().toISOString()};M.put(d);M.writes++;return {data:[{updated_at:d.rows[uid].updated_at}],error:null}}).then(ok,bad)};return Q};
  return {from:q,
   rpc:name=>later().then(()=>{if(M.offline)return {data:null,error:net()};const s=sess(),d=M.db();if(name!=='delete_my_account'||!s)return {data:null,error:{message:'function not found',code:'PGRST202'}};
     delete d.rows[s.user.id];for(const e in d.users)if(d.users[e]===s.user.id)delete d.users[e];M.put(d);return {data:null,error:null}}),
   auth:{getSession:()=>later().then(()=>({data:{session:sess()},error:null})),
    signInWithOtp:a=>later().then(()=>{if(M.offline)return {data:{},error:{name:'AuthRetryableFetchError',message:'Failed to fetch',status:0}};if(M.rate)return {data:{},error:{message:'email rate limit exceeded',status:429}};M.sent=a.email;M.opts=a.options;return {data:{user:null,session:null},error:null}}),
    verifyOtp:a=>later().then(()=>{if(M.offline)return {data:{},error:{message:'Failed to fetch',status:0}};if(a.token!==M.code||a.email!==M.sent||a.type!=='email')return {data:{user:null,session:null},error:{message:'Token has expired or is invalid',status:403}};
      const d=M.db();let id=d.users[a.email];if(!id){id='u'+(Object.keys(d.users).length+1)+'-0000-4000-8000-000000000000';d.users[a.email]=id;d.rows[id]={id:id,save:null,is_admin:false,updated_at:new Date().toISOString()};M.put(d)}   // signup trigger makes the row
      const s={access_token:'mock',user:{id:id,email:a.email}};ss.setItem(sk,JSON.stringify(s));return {data:{user:s.user,session:s},error:null}}),
    signOut:()=>later().then(()=>{ss.removeItem(sk);return {error:null}})}}}};
 acCfg.url='https://mock.supabase.co';acCfg.anon='mock-anon-key';acBoot();
}
