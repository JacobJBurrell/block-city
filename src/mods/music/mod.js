// ---------- music module (mu*): real music from YouTube on the phone and the car radio ----------
// Uses only the official YouTube IFrame Player API. Nothing is downloaded or proxied.
// Search needs a YouTube Data API v3 key (restricted by HTTP referrer). Paste it between the quotes:
const muCfg={ytKey:'AIzaSyDdrwXbGLrhej0o9C-6csbtL-T6chdvMGU'};
// genre stations: official "YouTube Music" playlists, first id is used, the others are fallbacks
const muST=[
 {id:'hiphop',n:'Hip-Hop',b:'HIP',c:'#ff9f0a',L:['RDCLAK5uy_lBGRuQnsG37Akr1CY4SxL0VWFbPrbO4gs','RDCLAK5uy_mpx6f-Md6iPbWSaizatzQIHfcF33fmT7E','RDCLAK5uy_kjWs8kYE7G6CkEijcEvsO9MVdE5doD3uY']},
 // Rap: The Golden Age of Gangsta Rap, then Southern Rappers Just Wanna Have Fun, NYE Rap Party Classics (all official YouTube Music, checked to play embedded)
 {id:'rap',n:'Rap',b:'RAP',c:'#00c7be',L:['RDCLAK5uy_lK012i9pCwk6EG19BPblG5b8m2RiNalII','RDCLAK5uy_mF9cV4dCYClMcRTJhwsmd8Do1ZZGMKRRc','RDCLAK5uy_nji1LYiW5aVPmxnAs4EYFMe16Dm-CM6BQ']},
 {id:'pop',n:'Pop',b:'POP',c:'#ff375f',L:['RDCLAK5uy_k8QSlZPzi4R3781ftLrAKefTJJ6x7JrVA','RDCLAK5uy_lBNUteBRencHzKelu5iDHwLF6mYqjL-JU','RDCLAK5uy_nxuz8sV0R7aWiLsbDv5W9_Bvp0X9PxFjY']},
 {id:'rock',n:'Rock',b:'ROCK',c:'#ff453a',L:['RDCLAK5uy_nZiG9ehz_MQoWQxY5yElsLHCcG0tv9PRg','RDCLAK5uy_k6CicQMBYujmwL9DB5xBripE9EfgeKpHM','RDCLAK5uy_k8XHur6m_KY0-QdVruQmxavFeS6dKc35A']},
 {id:'edm',n:'Dance / Electronic',b:'EDM',c:'#bf5af2',L:['RDCLAK5uy_mkXiaMATud8GJQ3aX7f0nCeCqvehA9wTQ','RDCLAK5uy_kIlC_He_q02_we1RKAq1_4JEYmueTqnGs','RDCLAK5uy_nBrLYLD4uLur0yOG-Ayla-Ig64ZzZcy7A']},
 {id:'rnb',n:'R&B',b:'R&B',c:'#5e5ce6',L:['RDCLAK5uy_kEtrQFmd2q44rtlNH5ukTHmda2jzWkwO0','RDCLAK5uy_mGVduYmr6JCg6Abgb-wB7-Mjfp2M7Jijc','RDCLAK5uy_nCZiH1ufDEK9aRoi-xipbtgDi9bgMqVjM']},
 {id:'lofi',n:'Lo-Fi',b:'LOFI',c:'#64d2ff',L:['RDCLAK5uy_kb7EBi6y3GrtJri4_ZH56Ms786DFEimbM','RDCLAK5uy_nZJzoZEBYRptA2XXskbxGTvKkevapT_F4','RDCLAK5uy_lRr70m6uTvLpxAG3G6Yuc41cJBIXODAws']},
 {id:'latin',n:'Latin',b:'LAT',c:'#ffd60a',L:['RDCLAK5uy_lOAAW-PX5XUed76iQefCxkOXd6m6ZvyiM','RDCLAK5uy_m-H5tH6XKlmMxXlwyUSgwCdGC1dCpaQsk','RDCLAK5uy_npkgrjOge0uceDgFNjxp5ymEDMdUUHQ_4']},
 {id:'country',n:'Country',b:'CTRY',c:'#c8a26a',L:['RDCLAK5uy_lf4wLV2b5cb2gsfuBM42Ng8eCoXv6no5w','RDCLAK5uy_lrj9qy29eJKUUvkLFw56PiEHq07rDHwkU','RDCLAK5uy_lJ8xZWiZj2GCw7MArjakb6b0zfvqwldps']},
 {id:'classical',n:'Classical',b:'CLAS',c:'#d1d1d6',L:['RDCLAK5uy_mv1P2oVguxLCIDXavV-jcDG1lQyukfSpo','RDCLAK5uy_n9hGvSNdO2TpX8jJuiThvnfrfIi1qNRnY','RDCLAK5uy_kVXmNQjiBEKjCGifBWc3eTMg8Fwjc6K8M']},
 {id:'jazz',n:'Jazz',b:'JAZZ',c:'#30d158',L:['RDCLAK5uy_m7EF_vYZXBhXNuduyXmhT00DYapc8cobs','RDCLAK5uy_n2cq0PxECLzVblC6NOorWjaCtF5NwXJT4','RDCLAK5uy_nRr0zn4n0C5AGQqZKdSaSzs2zmbImOIwU']},
 {id:'80s',n:'80s Hits',b:'80s',c:'#ff6ad5',L:['RDCLAK5uy_lMzHW51iFg1Kx0d_2EHpzbOgCrwtu8cgI','RDCLAK5uy_nKfNEHo6Yu1lao4pamzirHgatT0liBhzY','RDCLAK5uy_naw1C0OeGlLj48gCdhHAQYIy5tzXRgOwY']}];
// api: 0 not loaded, 1 loading, 2 ready, -1 failed (offline: the old synthesized radio takes over)
const mu={api:0,P:null,rdy:false,ps:-1,src:null,want:false,blocked:false,mode:null,reqT:0,errN:0,selfP:false,carP:false,hold:false,pend:null,q:[],qi:-1,cur:null,curId:'',tab:'st',exp:false,open:false,el:null,root:null,vis:false,res:null,resQ:'',resMsg:'',busy:false,vol:-1,hostCss:'',kickT:0,pillT:0,acc:0,offT:0,skDrag:false,ever:false,drv:null,fb:false,lists:{},ig:1,it:null,iDone:false,icue:null,ttl:0};
let muDB={fav:[],rec:[],car:0};
try{const d=JSON.parse(localStorage.getItem('blockcity_music')||'null');if(d&&typeof d==='object'){muDB=Object.assign(muDB,d);if(!Array.isArray(muDB.fav))muDB.fav=[];if(!Array.isArray(muDB.rec))muDB.rec=[];if(typeof muDB.car!=='number'||muDB.car>=muST.length)muDB.car=0;
 // saves from before Rap was added: the car station is an index, so stations after Hip-Hop moved up by one
 if(!(muDB.sv>=2)&&muDB.car>=1&&muDB.car<muST.length-1)muDB.car++}muDB.sv=2}catch(e){}
function muSave(){try{localStorage.setItem('blockcity_music',JSON.stringify(muDB))}catch(e){}}
function muE(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])}
function muTry(f,d){try{return f()}catch(e){return d}}
function muFmt(t){t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')}
const muTA=document.createElement('textarea');
function muDec(s){muTA.innerHTML=String(s==null?'':s).replace(/</g,'&lt;');return muTA.value}
// ----- YouTube Data API search (results parsing is pure so it can be tested with a canned response) -----
function muParse(j){const out=[];if(!j||!Array.isArray(j.items))return out;for(const it of j.items){const id=it&&it.id&&(typeof it.id==='string'?it.id:it.id.videoId),sn=it&&it.snippet;if(!id||!/^[\w-]{11}$/.test(id)||!sn)continue;const th=sn.thumbnails||{},im=th.medium||th.default||th.high||{};out.push({id:id,t:muDec(sn.title||'Untitled'),c:muDec(sn.channelTitle||''),im:im.url||('https://i.ytimg.com/vi/'+id+'/mqdefault.jpg')})}return out}
function muVidId(s){s=String(s||'').trim();let m=/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/.exec(s);if(m)return m[1];return /^[\w-]{11}$/.test(s)&&/[\d_-]/.test(s)?s:null}
function muSearch(q){q=String(q||'').trim();if(!q)return;const direct=muVidId(q);
 if(direct){muPlaySong({id:direct,t:'YouTube video',c:'',im:'https://i.ytimg.com/vi/'+direct+'/mqdefault.jpg'});return}
 mu.resQ=q;const ck='mu_s:'+q.toLowerCase();
 const hit=muTry(()=>JSON.parse(sessionStorage.getItem(ck)||'null'),null);if(hit&&Array.isArray(hit)){mu.res=hit;mu.resMsg='';muList();return}
 if(!muCfg.ytKey){mu.res=null;mu.resMsg='';muList();return}
 mu.busy=true;mu.resMsg='';muList();
 fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&videoEmbeddable=true&maxResults=12&q='+encodeURIComponent(q)+'&key='+encodeURIComponent(muCfg.ytKey)).then(r=>r.json().then(j=>({ok:r.ok,j:j}))).then(o=>{mu.busy=false;
  if(!o.ok){const er=o.j&&o.j.error,rs=er&&er.errors&&er.errors[0]&&er.errors[0].reason;mu.res=[];mu.resMsg=/quota/i.test(rs||'')?'Search limit reached for today. Stations still work.':'Search failed'+(rs?' ('+rs+')':'');muList();return}
  mu.res=muParse(o.j);mu.resMsg=mu.res.length?'':'No songs found';muTry(()=>sessionStorage.setItem(ck,JSON.stringify(mu.res)));muList()}).catch(()=>{mu.busy=false;mu.res=[];mu.resMsg='Search failed. Check your connection.';muList()})}
// ----- player: one iframe, kept at 320x200 in the page. While the phone is closed it sits behind the game canvas (never display:none or 0x0) -----
const muHost=document.createElement('div');muHost.id='muHost';muHost.innerHTML='<div id="muPl"></div>';muHost.className='lf-keep';document.body.appendChild(muHost);// lf-keep: the cinematic intro must not hide the player that plays its music
function muLoadApi(){if(mu.api===1||mu.api===2)return;mu.api=1;
 const done=()=>{if(mu.api===2)return;mu.api=2;muMake();muBtnDraw();if(mu.open)muDraw()};
 if(window.YT&&window.YT.Player){done();return}
 const prev=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=function(){muTry(()=>{if(typeof prev==='function')prev()});done()};
 const fail=()=>{if(mu.api===1)muOffline()};
 const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.async=true;s.onerror=fail;document.head.appendChild(s);setTimeout(fail,12000)}
function muMake(){if(mu.P||!window.YT||!window.YT.Player)return;
 mu.P=new YT.Player('muPl',{width:320,height:200,playerVars:Object.assign({playsinline:1,controls:1,rel:0,fs:0,disablekb:1,iv_load_policy:3},/^https?:/.test(location.origin||'')?{origin:location.origin}:{}),events:{
  onReady:function(){mu.rdy=true;muVol(true);if(mu.pend){const f=mu.pend;mu.pend=null;muTry(f)}},
  onStateChange:function(e){muState(e.data)},
  onError:function(e){muErr(e.data)}}})}
// YouTube cannot be used here (offline, or a page YouTube refuses to embed into): hand the radio back to the built-in stations
function muOffline(){mu.api=-1;mu.pend=null;mu.want=false;mu.blocked=false;muTry(()=>{auBtn.textContent=auR.st<4?auST[auR.st].b:'OFF';auBtn.style.opacity=auR.st<4?1:.55;auBtn.style.borderColor='#7df'});if(mu.open)muDraw()}
function muCmd(f){if(mu.P&&mu.rdy){muTry(f);return}mu.pend=f;if(mu.api===2)muMake();else muLoadApi()}
// music volume from the settings (0..1); mu.ig is the intro fade on top of it
function muEff(){return muTry(()=>Math.max(0,Math.min(1,(uiS.mus===undefined?1:uiS.mus)*(uiS.vol===undefined?1:uiS.vol))),1)}
function muVol(force){if(!mu.P||!mu.rdy)return;const v=Math.round(100*Math.max(0,Math.min(1,muEff()*mu.ig)));if(v!==mu.vol||force){mu.vol=v;muTry(()=>mu.P.setVolume(v))}}
function muState(s){mu.ps=s;
 if((s===1||s===3)&&!mu.want&&!mu.hold&&performance.now()-mu.offT<2500){muTry(()=>mu.P.pauseVideo());return}
 if(s===1||s===3){mu.blocked=false;if(!mu.want&&!mu.hold){mu.want=true;if(!mu.mode)mu.mode=driving?'car':'foot'}
  if(mu.src&&mu.src.k==='st'&&!mu.src.sh){mu.src.sh=true;muTry(()=>mu.P.setShuffle(true))}}
 if(s===1){mu.errN=0;mu.ever=true;mu.selfP=false;muTrack()}
 else if(s===2){if(mu.selfP)mu.selfP=false;else if(mu.want&&!mu.hold){mu.want=false}}
 else if(s===0){if(mu.src&&mu.src.k==='q')muQNext(true);else mu.reqT=performance.now()}
 muBtnDraw();muUpd()}
function muTrack(){const d=muTry(()=>mu.P.getVideoData(),null)||{},id=d.video_id||'';if(!id)return;
 let t=d.title||'',c=d.author||'';const qs=mu.src&&mu.src.k==='q'?mu.q[mu.qi]:null;if(qs&&qs.id===id){if(!t||t==='YouTube video')t=qs.t;else qs.t=t;if(!c)c=qs.c;else qs.c=c}
 c=String(c).replace(/ - Topic$/,'');const nw=id!==mu.curId;mu.curId=id;mu.cur={id:id,t:t||'Unknown',c:c,im:'https://i.ytimg.com/vi/'+id+'/mqdefault.jpg'};
 const ic=muDB.intro;if(ic&&ic.k==='song'&&ic.id===id&&t&&(!ic.t||ic.t==='YouTube video')){ic.t=t;ic.c=c}
 if(nw){muDB.rec=muDB.rec.filter(x=>x.id!==id);muDB.rec.unshift(mu.cur);if(muDB.rec.length>30)muDB.rec.length=30;muSave();if(!mu.vis&&!(mu.it&&!mu.it.keep))muPill('♪ '+mu.cur.t,3.6);if(mu.open&&(mu.tab==='lib'||mu.tab==='q'))muList()}}
// 2 = bad id, 5 = player error, 100 = removed or private, 101/150 = embedding not allowed: skip to the next item
function muErr(code){mu.errN++;if(!mu.src)return;if(code===153&&!mu.ever){muOffline();return}
 if(mu.src.k==='st'){if(mu.errN>=5)muStFail();else muTry(()=>mu.P.nextVideo())}
 else{const s=mu.q[mu.qi];if(s)s.bad=1;if(mu.errN>=6){mu.want=false;muPill('Could not play that',3)}else muQNext(true);if(mu.open)muList()}}
function muStFail(){const i=mu.src.i,S=muST[i];S.li=(S.li||0)+1;mu.errN=0;if(S.li<S.L.length)muPlayStation(i,mu.mode);else{S.li=0;mu.want=false;if(!mu.ever){muOffline();return}muPill(S.n+' is unavailable',3);muBtnDraw();muUpd()}}
function muBegin(mode){mu.mode=mode||(driving?'car':'foot');mu.want=true;mu.blocked=false;mu.carP=false;mu.errN=0;mu.reqT=performance.now()}
function muPlayStation(i,mode){i=((i%muST.length)+muST.length)%muST.length;const S=muST[i],list=S.L[S.li||0];mu.src={k:'st',i:i,sh:false};muBegin(mode);if(mu.mode==='car'){muDB.car=i;muSave()}
 mu.cur={id:'',t:S.n+' Radio',c:'Loading',im:''};mu.curId='';
 // stopVideo first: without it the player keeps playing the playlist that was loaded before this one
 muCmd(()=>{mu.P.stopVideo();mu.P.loadPlaylist({listType:'playlist',list:list,index:Math.floor(Math.random()*24)})});muBtnDraw();muUpd();if(mu.open&&mu.tab==='st')muList()}
function muPlayQ(mode){const s=mu.q[mu.qi];if(!s)return;mu.src={k:'q'};muBegin(mode);mu.cur={id:s.id,t:s.t,c:s.c,im:s.im};mu.curId='';muCmd(()=>mu.P.loadVideoById(s.id));muBtnDraw();muUpd();if(mu.open)muList()}
function muPlaySong(s,mode){s={id:s.id,t:s.t,c:s.c,im:s.im};if(mu.src&&mu.src.k==='q'&&mu.q.length){mu.q.splice(mu.qi+1,0,s);mu.qi++}else{mu.q=[s];mu.qi=0}muPlayQ(mode)}
function muQAdd(s){mu.q.push({id:s.id,t:s.t,c:s.c,im:s.im});if(!(mu.src&&mu.src.k==='q'&&mu.want)){mu.qi=mu.q.length-1;muPlayQ()}else{muPill('Added to queue',1.6);if(mu.open&&mu.tab==='q')muList()}}
function muQNext(auto){if(mu.qi<mu.q.length-1){mu.qi++;muPlayQ(mu.mode);return}
 if(auto&&mu.mode==='car'&&driving&&muDB.car>=0){muPlayStation(muDB.car,'car');return}
 if(auto){mu.want=false;muBtnDraw();muUpd()}}
function muNext(){if(!mu.src)return;mu.reqT=performance.now();if(mu.src.k==='st'){mu.want=true;muCmd(()=>mu.P.nextVideo())}else muQNext(false)}
function muPrev(){if(!mu.src)return;mu.reqT=performance.now();if(muTry(()=>mu.P.getCurrentTime(),0)>4){muTry(()=>mu.P.seekTo(0,true));return}
 if(mu.src.k==='st'){mu.want=true;muCmd(()=>mu.P.previousVideo())}else if(mu.qi>0){mu.qi--;muPlayQ(mu.mode)}else muTry(()=>mu.P.seekTo(0,true))}
function muHalt(){mu.offT=performance.now();if(!mu.P||!mu.rdy){mu.pend=null;return}if(mu.ps===1||mu.ps===3){mu.selfP=true;muTry(()=>mu.P.pauseVideo())}else if(mu.ps!==2)muTry(()=>mu.P.stopVideo())}
function muPause(){mu.want=false;mu.blocked=false;muHalt();muBtnDraw();muUpd()}
function muResume(mode){if(!mu.src){return}mu.want=true;mu.blocked=false;mu.carP=false;if(mode)mu.mode=mode;mu.reqT=performance.now();muCmd(()=>mu.P.playVideo());muBtnDraw();muUpd()}
function muToggle(){if(!mu.src){muPlayStation(muDB.car>=0?muDB.car:0);return}if(mu.want&&!mu.blocked)muPause();else muResume()}
function muStop(){mu.want=false;mu.blocked=false;mu.carP=false;muHalt();muBtnDraw();muUpd()}
function muSeek(fr){const d=muTry(()=>mu.P.getDuration(),0);if(d>0)muTry(()=>mu.P.seekTo(Math.max(0,Math.min(.995,fr))*d,true))}
function muIsFav(){return !!(mu.cur&&mu.cur.id&&muDB.fav.some(x=>x.id===mu.cur.id))}
function muFav(){if(!mu.cur||!mu.cur.id)return;if(muIsFav())muDB.fav=muDB.fav.filter(x=>x.id!==mu.cur.id);else muDB.fav.unshift({id:mu.cur.id,t:mu.cur.t,c:mu.cur.c,im:mu.cur.im});muSave();muUpd();if(mu.open&&mu.tab==='lib')muList()}
function muPlaying(){return mu.want&&(mu.ps===1||mu.ps===3)}
function muSrcName(){return mu.src?(mu.src.k==='st'?muST[mu.src.i].n+' Radio':'Your pick'):''}
// ----- car radio: the radio button cycles the stations and Off; a song picked on the phone plays until the station is changed -----
function muBtnDraw(){if(typeof auBtn==='undefined'||mu.api<0)return;let t='OFF',on=false;
 if(mu.want&&mu.src){on=true;t=mu.blocked?'▶':(mu.src.k==='st'?muST[mu.src.i].b:'♪')}
 if(auBtn.textContent!==t)auBtn.textContent=t;auBtn.style.opacity=on?1:.55;auBtn.style.borderColor=on&&mu.src.k==='st'?muST[mu.src.i].c:'#7df'}
function muRadioNext(){muIntroDrop();
 if(mu.want&&mu.blocked&&mu.src){muKick();return}
 let n;if(mu.want&&mu.src&&mu.src.k==='st')n=mu.src.i+1;else n=muDB.car>=0?muDB.car:0;
 if(n>=muST.length){muStop();muDB.car=-1;muSave();muPill('Radio off',1.6);return}
 muPlayStation(n,'car');muPill('♪ '+muST[n].n,2.2)}
// a tap while the browser is holding playback back: try again inside the tap, then show the player in the phone so it can be tapped directly
function muKick(){mu.reqT=performance.now();mu.blocked=false;mu.kickT=2.2;muCmd(()=>mu.P.playVideo());muBtnDraw()}
if(typeof auRadioNext!=='undefined'){const o=auRadioNext;auRadioNext=function(){if(mu.api<0){o();return}muRadioNext()}}
// ----- intro music: plays over the cinematic intro after the first PLAY of each visit (not after respawns) -----
// muDB.intro: {k:'st',id} a station, {k:'song',id,t,c,im,s} a song (s = start second), {k:'off'}; muDB.ikeep: keep playing after the intro
const muIG=1.15;// a little louder than normal during the intro, then down to the normal level
function muStIdx(id){const i=muST.findIndex(S=>S.id===id);return i<0?0:i}
function muIntroCfg(){const c=muDB.intro;if(c&&c.k==='off')return c;if(c&&c.k==='st'&&muST.some(S=>S.id===c.id))return c;if(c&&c.k==='song'&&/^[\w-]{11}$/.test(c.id||''))return c;return {k:'st',id:'hiphop'}}
function muIntroKey(c){return c.k==='st'?'st:'+c.id:(c.k==='song'?'song:'+c.id+':'+(c.s||0):'off')}
function muIName(c){c=c||muIntroCfg();return c.k==='off'?'Off':(c.k==='st'?muST[muStIdx(c.id)].n+' Radio':(c.t||'YouTube video'))}
// offline: the closest built-in station (0 NEON synthwave, 1 BLOCK hip-hop, 2 RIOT rock, 3 DUSK lo-fi), -1 = none, so the intro is silent
function muSynFor(c){const m={hiphop:1,rap:1,rnb:1,pop:0,edm:0,'80s':0,rock:2,lofi:3,jazz:3};return c.k==='st'&&m[c.id]!==undefined?m[c.id]:-1}
function muTSec(s){const m=/[?&#](?:t|start)=([0-9hms]+)/.exec(String(s||''));if(!m)return 0;const v=m[1];if(/^\d+$/.test(v))return +v;let t=0;v.replace(/(\d+)([hms])/g,(a,n,u)=>{t+=n*(u==='h'?3600:u==='m'?60:1);return a});return t}
// on the title screen: load the player and cue the intro choice, so the PLAY tap only has to press play (iPhone needs the tap for sound)
function muIntroCue(){if(mu.icue||!mu.P||!mu.rdy||mu.want)return;const c=muIntroCfg();if(c.k==='off')return;mu.icue=muIntroKey(c);
 if(c.k==='st'){const S=muST[muStIdx(c.id)];muTry(()=>mu.P.cuePlaylist({listType:'playlist',list:S.L[S.li||0],index:Math.floor(Math.random()*24)}))}
 else muTry(()=>mu.P.cueVideoById({videoId:c.id,startSeconds:c.s||0}))}
function muIntroGo(){if(mu.iDone)return;mu.iDone=true;const c=muIntroCfg();if(c.k==='off'||mu.want||muEff()<=0)return;
 const I=mu.it={keep:!!muDB.ikeep,ph:'in',g:0,t:0,seen:false,syn:null,sst:0,nx:0};
 if(mu.api<0){I.syn=muSynFor(c);return}
 mu.ig=0;muVol(true);const cued=mu.icue===muIntroKey(c)&&mu.P&&mu.rdy&&mu.ps===5;mu.icue='used';
 if(c.k==='st'){const i=muStIdx(c.id);if(cued){mu.src={k:'st',i:i,sh:false};muBegin('foot');mu.cur={id:'',t:muST[i].n+' Radio',c:'Loading',im:''};mu.curId='';muTry(()=>mu.P.playVideo())}else muPlayStation(i,'foot')}
 else{const s={id:c.id,t:c.t||'YouTube video',c:c.c||'',im:c.im||('https://i.ytimg.com/vi/'+c.id+'/mqdefault.jpg')};mu.q=[s];mu.qi=0;mu.src={k:'q'};muBegin('foot');mu.cur={id:s.id,t:s.t,c:s.c,im:s.im};mu.curId='';
  if(cued)muTry(()=>mu.P.playVideo());else muCmd(()=>mu.P.loadVideoById({videoId:c.id,startSeconds:c.s||0}))}
 muBtnDraw();muUpd()}
// the player (or the car radio) takes over: the music keeps going at the normal level, owned by whoever touched it
function muIntroDrop(){if(!mu.it)return;mu.it=null;mu.ig=1;muVol(true)}
function muIntroStopNow(){const I=mu.it;mu.it=null;mu.ig=1;if(I&&I.syn==null){muStop();mu.offT=performance.now()+5000;if(muPl.classList.contains('tap'))muPl.classList.remove('on','tap')}muVol(true)}
function muIntroEnd(){const I=mu.it;if(!I||I.ph!=='in')return;
 if(I.syn!=null){if(I.syn<0)mu.it=null;else if(I.keep){I.ph='kept';I.g=1}else{I.ph='out';I.g0=I.g}return}
 if(I.keep){I.ph='down';return}
 if(!(mu.want&&mu.ps===1)){muIntroStopNow();return}
 I.ph='out';I.g0=I.g}
function muIntroTick(dt){
 if(state==='ready'&&!mu.iDone){if(mu.api===0&&muIntroCfg().k!=='off'){mu.ttl+=Math.max(0,dt);if(mu.ttl>.6)muLoadApi()}if(mu.rdy)muIntroCue()}
 const L=muTry(()=>typeof lfIntro!=='undefined'?lfIntro:null,null);
 if(L&&!L.short&&!mu.iDone)muIntroGo();// fallback when PLAY came from the keyboard or a test
 const I=mu.it;if(!I)return;I.t+=Math.max(0,dt);
 if(I.ph==='in'){if(L)I.seen=true;if((I.seen&&!L)||(!I.seen&&I.t>3))muIntroEnd();if(!mu.it)return}
 if(I.syn==null&&mu.api<0){I.syn=muSynFor(muIntroCfg());I.g=0;if(I.ph!=='in'){if(I.keep&&I.syn>=0){I.ph='kept';I.g=1}else{mu.it=null;return}}}
 // getting into a vehicle hands the music to the car radio, as without an intro
 if(driving&&!mu.drv){if(I.syn!=null||I.keep){muIntroDrop();return}muIntroDrop();if(muDB.car<0)muStop();else mu.want=false;return}
 const top=I.syn!=null?1:muIG;
 if(I.ph==='in'){if(I.syn!=null||mu.ps===1)I.g=Math.min(top,I.g+dt*top/1.5)}
 else if(I.ph==='down'){I.g+=(1-I.g)*Math.min(1,dt*2.2);if(Math.abs(I.g-1)<.02){muIntroDrop();return}}
 else if(I.ph==='out'){I.g=Math.max(0,I.g-dt*Math.max(.3,I.g0)/1.8);if(I.g<=0){if(I.syn!=null)mu.it=null;else muIntroStopNow();return}}
 if(I.syn==null){mu.ig=I.g;muVol(false)}}
// the PLAY tap itself: start the intro music inside it (and press play again on the finger lift, iPhone counts that as the gesture)
let muRdyTap=false;
addEventListener('touchstart',()=>{muRdyTap=state==='ready'},true);
addEventListener('touchstart',()=>{if(muRdyTap&&state==='play'){muRdyTap=false;if(muTry(()=>!lfIntroDone,false))muIntroGo()}});
{const kick=()=>{const I=mu.it;if(I&&I.ph==='in'&&I.syn==null&&mu.want&&!mu.hold&&mu.P&&mu.rdy&&mu.ps!==1&&mu.ps!==3)muTry(()=>mu.P.playVideo())};addEventListener('touchend',kick,true);addEventListener('pointerup',kick,true)}
// offline intro: the built-in station plays on foot while the intro owns it (the car radio is untouched)
if(typeof auRadioTick==='function'){const o=auRadioTick;auRadioTick=function(){const I=mu.it;
 if(I&&typeof I.syn==='number'&&I.syn>=0&&!driving&&typeof auRG!=='undefined'&&auRG&&AC&&typeof auST!=='undefined'){const now=AC.currentTime;auRG.gain.setTargetAtTime(mu.hold?0:I.g,now,.15);
  const S=auST[I.syn],sd=60/S.bpm/4;if(!I.nx||I.nx<now)I.nx=now+.06;let n=0;while(I.nx<now+.32&&n++<12){auRStep(S,I.syn,I.sst,I.nx);I.nx+=sd;I.sst=(I.sst+1)%64}return}
 o()}}
function muILookup(id){if(!muCfg.ytKey)return;fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+encodeURIComponent(id)+'&key='+encodeURIComponent(muCfg.ytKey)).then(r=>r.json()).then(j=>{const s=muParse(j)[0],c=muDB.intro;if(!s||!c||c.k!=='song'||c.id!==id)return;c.t=s.t;c.c=s.c;c.im=s.im;muSave();if(mu.open)muList()}).catch(()=>{})}
function muISet(c){muDB.intro=c;muSave();if(mu.icue!=='used')mu.icue=null;muList()}
function muISearch(q){q=String(q||'').trim();if(!q)return;const id=muVidId(q);
 if(id){muISet({k:'song',id:id,t:'YouTube video',c:'',im:'https://i.ytimg.com/vi/'+id+'/mqdefault.jpg',s:muTSec(q)});muILookup(id);return}
 muSearch(q)}
// ----- tiny now-playing note (no player on the HUD) -----
const muPl=document.createElement('div');muPl.id='muPill';document.body.appendChild(muPl);
function muPill(t,sec,tap){muPl.textContent=t;muPl.classList.add('on');muPl.classList.toggle('tap',!!tap);mu.pillT=sec||3}
muPl.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(mu.blocked){muKick();muPill('♪ ...',1.5)}},{passive:false});
for(const ty of['touchmove','touchend'])muPl.addEventListener(ty,e=>e.stopPropagation());
// ----- styles -----
{const st=document.createElement('style');st.textContent=
'#muHost{position:fixed;left:0;top:0;width:320px;height:200px;z-index:-1;pointer-events:none;transform-origin:0 0;overflow:hidden;background:#000}#muHost iframe{display:block;width:320px;height:200px;border:0}'+
'#muHost.on{z-index:90;pointer-events:auto;border-radius:12px}'+
'#muPill{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 112px);transform:translate(-50%,-6px);max-width:min(62vw,300px);padding:4px 11px;border-radius:13px;background:#000a;color:#fff;font:600 11px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transition:opacity .5s,transform .5s;pointer-events:none;z-index:6}'+
'#muPill.on{opacity:.92;transform:translate(-50%,0)}#muPill.on.tap{pointer-events:auto;background:#e6143ce6}'+
'.mu-r{position:absolute;inset:0;display:flex;flex-direction:column;background:linear-gradient(180deg,#2a0b14,#000 34%);color:#fff;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.25;-webkit-user-select:none;user-select:none}'+
'.mu-r svg{fill:currentColor;display:block}'+
'.mu-hd{flex:none;padding:3.1em 1em .4em;display:flex;align-items:center;gap:.5em}.mu-hd b{flex:1;font-size:1.25em;font-weight:800;letter-spacing:-.01em}.mu-bk{color:#ff5a79;font-size:1.5em;line-height:1;padding:0 .35em .1em 0}'+
'.mu-np{flex:none;margin:0 .8em;padding:.6em;border-radius:1.1em;background:#ffffff12;display:grid;grid-template-columns:44% 1fr;gap:.2em .7em;align-items:center}'+
'.mu-vid{position:relative;width:100%;aspect-ratio:16/10;border-radius:.7em;overflow:hidden;background:linear-gradient(135deg,#ff2d55,#5b1022);display:flex;align-items:center;justify-content:center}.mu-vid svg{width:38%;height:38%;opacity:.85}'+
'.mu-in{min-width:0}.mu-tt{font-weight:700;font-size:.95em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mu-ss{font-size:.78em;color:#ffffff99;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.mu-ct{display:flex;align-items:center;justify-content:space-between;margin-top:.35em}.mu-ct span{width:2.1em;height:2.1em;display:flex;align-items:center;justify-content:center;border-radius:50%}.mu-ct svg{width:1.45em;height:1.45em}.mu-ct .pp{background:#fff;color:#000}.mu-ct .fv.on{color:#ff375f}'+
'.mu-sk{grid-column:1/3;padding:.55em 0 .1em}.mu-sk i{display:block;height:.28em;border-radius:.2em;background:#ffffff2e;position:relative}.mu-sk i b{position:absolute;left:0;top:0;bottom:0;border-radius:.2em;background:#ff375f;width:0}'+
'.mu-tm{grid-column:1/3;display:flex;justify-content:space-between;font-size:.68em;color:#ffffff80;font-variant-numeric:tabular-nums}'+
'.mu-hint{grid-column:1/3;text-align:center;font-size:.8em;font-weight:700;color:#ff8ea3;padding:.2em 0}'+
'.mu-r.exp .mu-np{grid-template-columns:1fr}.mu-r.exp .mu-sk,.mu-r.exp .mu-tm,.mu-r.exp .mu-hint{grid-column:1}.mu-r.exp .mu-tt{font-size:1.1em;margin-top:.3em}.mu-r.exp .mu-ct{margin-top:.6em;justify-content:space-around}.mu-r.exp .mu-ct span{width:2.7em;height:2.7em}'+
'.mu-tabs{flex:none;display:flex;gap:.25em;background:#ffffff14;border-radius:.8em;padding:.2em;margin:.6em .8em .3em}.mu-tabs span{flex:1;text-align:center;padding:.38em 0;border-radius:.65em;font-size:.8em;font-weight:600;color:#ffffffaa}.mu-tabs span.on{background:#ffffff26;color:#fff}'+
'.mu-sb{flex:none;display:flex;gap:.4em;margin:.2em .8em .3em}.mu-sb input{flex:1;min-width:0;border:0;outline:0;border-radius:.8em;background:#ffffff1f;color:#fff;font:inherit;font-size:16px;padding:.35em .7em;-webkit-user-select:text;user-select:text}.mu-sb span{flex:none;display:flex;align-items:center;justify-content:center;width:2.4em;border-radius:.8em;background:#ff375f}.mu-sb svg{width:1.2em;height:1.2em}'+
'.mu-sc{flex:1;min-height:0;overflow:hidden;padding:0 .8em 2.4em}'+
'.mu-row{display:flex;align-items:center;gap:.65em;padding:.45em .1em;border-bottom:.06em solid #ffffff14}.mu-row.on .mu-tt{color:#ff5a79}.mu-row.bad{opacity:.4}'+
'.mu-bd{flex:none;width:2.7em;height:2.7em;border-radius:.6em;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.72em;color:#000c;background-size:cover;background-position:center}.mu-th{flex:none;width:3.6em;height:2.3em;border-radius:.4em;background:#222 center/cover}'+
'.mu-x{flex:none;width:2em;height:2em;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#ffffff1a}.mu-x svg{width:1.1em;height:1.1em}'+
'.mu-h{font-size:.72em;font-weight:700;letter-spacing:.08em;color:#ffffff80;padding:.9em 0 .2em;display:flex;justify-content:space-between}.mu-n{font-size:.84em;color:#ffffff99;padding:.9em .2em;line-height:1.4}'+
'.mu-ib{background:linear-gradient(135deg,#ff375f,#ff9f0a);color:#fff}.mu-ib svg{width:1.7em;height:1.7em}.mu-cv{flex:none;font-size:1.5em;line-height:1;color:#ffffff66;padding:0 .2em}'+
'.mu-ck{flex:none;color:#ff375f}.mu-ck svg{width:1.3em;height:1.3em}.mu-isel{background:#ffffff0d;border-radius:.7em;padding:.5em .5em;border:0}'+
'.mu-sw{flex:none;width:2.7em;height:1.6em;border-radius:1em;background:#ffffff33;position:relative;transition:background .2s}.mu-sw::after{content:"";position:absolute;left:.15em;top:.15em;width:1.3em;height:1.3em;border-radius:50%;background:#fff;transition:transform .2s}.mu-sw.on{background:#30d158}.mu-sw.on::after{transform:translateX(1.1em)}'+
'.mu-pr{transform:scale(.94);filter:brightness(.75)}[data-m]{transition:transform .12s,filter .12s}'+
'#muFb{position:fixed;z-index:82;border-radius:28px;overflow:hidden;box-shadow:0 0 0 5px #17191d,0 18px 40px #000c;display:none;color:#fff}#muFb.on{display:block}'+
'#muFbBtn{position:fixed;left:14px;top:calc(env(safe-area-inset-top,0px) + 124px);width:36px;height:36px;border-radius:50%;background:#e6143ccc;border:2px solid #fff8;color:#fff;font-size:17px;display:none;align-items:center;justify-content:center;z-index:5}';
 document.head.appendChild(st)}
// ----- Music app UI (fills the phone-screen container it is given) -----
const muIc={play:'<path d="M8 5v14l11-7z"/>',pause:'<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>',next:'<path d="M6 6l8.5 6L6 18zm10 0h2v12h-2z"/>',prev:'<path d="M18 6l-8.5 6 8.5 6zM6 6h2v12H6z"/>',
 heart:'<path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 18.8 5 21 8.3 19.5 11.8 17.5 16.4 12 21 12 21z"/>',
 plus:'<path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/>',x:'<path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z"/>',
 find:'<path d="M10 3a7 7 0 0 1 5.6 11.2l5 5-1.4 1.4-5-5A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>',
 note:'<path d="M9 18a3 3 0 1 1-2-2.8V5.5L20 3v12a3 3 0 1 1-2-2.8V7.3L9 9.3z"/>',big:'<path d="M5 5h6v2H7v4H5zm8 12h4v-4h2v6h-6z"/>'};
function muSvg(k){return '<svg viewBox="0 0 24 24">'+muIc[k]+'</svg>'}
function muSongRow(s,key,on,act){return '<div class="mu-row'+(on?' on':'')+(s.bad?' bad':'')+'" data-m="'+key+'"><span class="mu-th" style="background-image:url(&quot;'+muE(s.im||('https://i.ytimg.com/vi/'+s.id+'/mqdefault.jpg'))+'&quot;)"></span><div class="mu-in" style="flex:1"><div class="mu-tt">'+muE(s.t)+'</div><div class="mu-ss">'+muE(s.c)+'</div></div>'+(act||'')+'</div>'}
function muDraw(){const el=mu.el;if(!el)return;const foc=mu.root&&document.activeElement&&document.activeElement.id==='muIn',val=foc?document.activeElement.value:null;
 let h='<div class="mu-r'+(mu.exp?' exp':'')+'" id="muRoot"><div class="mu-hd"><span class="mu-bk" data-m="back">&lsaquo;</span><b>Music</b></div>';
 h+='<div class="mu-np"><div class="mu-vid" id="muVid" data-m="exp">'+muSvg('note')+'</div><div class="mu-in"><div class="mu-tt" id="muTt" data-m="exp"></div><div class="mu-ss" id="muSs"></div>'+
  '<div class="mu-ct"><span data-m="prev">'+muSvg('prev')+'</span><span class="pp" data-m="pp" id="muPp"></span><span data-m="next">'+muSvg('next')+'</span><span class="fv" data-m="fav" id="muFv">'+muSvg('heart')+'</span><span data-m="exp">'+muSvg('big')+'</span></div></div>'+
  '<div class="mu-hint" id="muHint" style="display:none">Tap the video to start</div><div class="mu-sk" data-m="seek" id="muSk"><i><b id="muBar"></b></i></div><div class="mu-tm"><span id="muT0">0:00</span><span id="muT1">0:00</span></div></div>';
 h+='<div class="mu-tabs">';for(const t of[['st','Radio'],['se','Search'],['lib','Library'],['q','Queue']])h+='<span data-m="tab:'+t[0]+'" class="'+(mu.tab===t[0]?'on':'')+'">'+t[1]+'</span>';h+='</div>';
 h+='<div class="mu-sb" id="muSb" style="display:'+(mu.tab==='se'||mu.tab==='in'?'flex':'none')+'"><input id="muIn" type="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Song, artist or YouTube link"><span data-m="go">'+muSvg('find')+'</span></div>';
 h+='<div class="mu-sc" id="muSc"></div></div>';el.innerHTML=h;mu.root=el.firstChild;mu.hostCss='';
 if(val!==null){const i=document.getElementById('muIn');if(i){i.value=val;muTry(()=>i.focus())}}else if(mu.resQ){const i=document.getElementById('muIn');if(i)i.value=mu.resQ}
 muList();muUpd()}
function muIBadge(c){if(c.k==='st'){const S=muST[muStIdx(c.id)];return '<span class="mu-bd" style="background:'+S.c+'">'+muE(S.b)+'</span>'}
 if(c.k==='song')return '<span class="mu-th" style="background-image:url(&quot;'+muE(c.im||('https://i.ytimg.com/vi/'+c.id+'/mqdefault.jpg'))+'&quot;)"></span>';return '<span class="mu-bd" style="background:#3a3a3c;color:#fff">&times;</span>'}
const muCk='<span class="mu-ck">'+'<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg></span>';
function muIRow(){return '<div class="mu-row" data-m="tab:in"><span class="mu-bd mu-ib"><svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg></span><div class="mu-in" style="flex:1"><div class="mu-tt">Intro music</div><div class="mu-ss" id="muISub">'+muE(muIName())+(muDB.ikeep?' · keeps playing':'')+'</div></div><span class="mu-cv">&rsaquo;</span></div>'}
function muIList(L){const c=muIntroCfg();let h='<div class="mu-h"><span>INTRO MUSIC</span><span data-m="tab:st" style="color:#ff5a79">DONE</span></div>';
 h+='<div class="mu-row mu-isel">'+muIBadge(c)+'<div class="mu-in" style="flex:1"><div class="mu-tt" id="muIName">'+muE(muIName(c))+'</div><div class="mu-ss">'+(c.k==='off'?'No music in the intro':(c.k==='song'&&c.s?'Starts at '+muFmt(c.s):'Plays when you press PLAY'))+'</div></div></div>';
 h+='<div class="mu-row" data-m="ikeep"><div class="mu-in" style="flex:1"><div class="mu-tt">Keep playing after the intro</div></div><span class="mu-sw'+(muDB.ikeep?' on':'')+'" id="muISw"></span></div>';
 if(mu.api<0)h+='<div class="mu-n">Offline: the built-in radio plays instead.</div>';
 h+='<div class="mu-h"><span>STATIONS</span></div>';
 h+='<div class="mu-row'+(c.k==='off'?' on':'')+'" data-m="ioff"><span class="mu-bd" style="background:#3a3a3c;color:#fff">&times;</span><div class="mu-in" style="flex:1"><div class="mu-tt">Off</div></div>'+(c.k==='off'?muCk:'')+'</div>';
 muST.forEach((S,i)=>{const on=c.k==='st'&&c.id===S.id;h+='<div class="mu-row'+(on?' on':'')+'" data-m="ist:'+i+'"><span class="mu-bd" style="background:'+S.c+'">'+muE(S.b)+'</span><div class="mu-in" style="flex:1"><div class="mu-tt">'+muE(S.n)+'</div></div>'+(on?muCk:'')+'</div>'});
 h+='<div class="mu-h"><span>A SONG</span></div>';const so=s=>c.k==='song'&&c.id===s.id;let any=false;
 if(c.k==='song'){any=true;h+=muSongRow(c,'isel',true,muCk)}
 if(mu.cur&&mu.cur.id&&!so(mu.cur)){any=true;L.cur=[mu.cur];h+='<div class="mu-h" style="padding-top:.5em"><span>PLAYING NOW</span></div>'+muSongRow(mu.cur,'isong:cur:0',false,'')}
 if(mu.busy)h+='<div class="mu-n">Searching...</div>';
 else if(mu.res&&mu.res.length){any=true;L.se=mu.res;h+='<div class="mu-h" style="padding-top:.5em"><span>SEARCH RESULTS</span></div>';mu.res.forEach((s,i)=>{h+=muSongRow(s,'isong:se:'+i,so(s),so(s)?muCk:'')})}
 else if(mu.resMsg)h+='<div class="mu-n">'+muE(mu.resMsg)+'</div>';
 for(const g of[['fav','FAVOURITES',muDB.fav],['rec','RECENTLY PLAYED',muDB.rec]]){const A=g[2].slice(0,10);if(!A.length)continue;any=true;L[g[0]]=A;h+='<div class="mu-h" style="padding-top:.5em"><span>'+g[1]+'</span></div>';A.forEach((s,i)=>{h+=muSongRow(s,'isong:'+g[0]+':'+i,so(s),so(s)?muCk:'')})}
 if(!any)h+='<div class="mu-n" style="padding:.3em .2em">Search above or paste a YouTube link.</div>';
 return h}
function muList(){const sc=mu.root&&mu.root.isConnected?mu.root.querySelector('#muSc'):null;if(!sc)return;let h='';const L=mu.lists={};
 if(mu.tab==='in')h+=muIList(L);
 else if(mu.tab==='st'){h+=muIRow();
  if(mu.api<0){h+='<div class="mu-n">YouTube is not reachable, so the built-in radio is on. It plays in vehicles.</div>';
   if(typeof auST!=='undefined'){for(let i=0;i<=auST.length;i++){const on=auR.st===i;h+='<div class="mu-row'+(on?' on':'')+'" data-m="syn:'+i+'"><span class="mu-bd" style="background:'+['#bf5af2','#ff9f0a','#ff453a','#64d2ff','#3a3a3c'][i%5]+'">'+(i<auST.length?auST[i].b[0]:'&times;')+'</span><div class="mu-in" style="flex:1"><div class="mu-tt">'+(i<auST.length?muE(auST[i].n):'Radio off')+'</div></div></div>'}}
   h+='<div class="mu-row" data-m="retry"><div class="mu-in" style="flex:1"><div class="mu-tt" style="color:#ff5a79">Try YouTube again</div></div></div>'}
  else{for(let i=0;i<muST.length;i++){const S=muST[i],on=mu.src&&mu.src.k==='st'&&mu.src.i===i&&mu.want;h+='<div class="mu-row'+(on?' on':'')+'" data-m="st:'+i+'"><span class="mu-bd" style="background:'+S.c+'">'+S.b+'</span><div class="mu-in" style="flex:1"><div class="mu-tt">'+muE(S.n)+'</div><div class="mu-ss">'+(on?'Playing now':'YouTube Music radio')+'</div></div></div>'}
   h+='<div class="mu-row" data-m="off"><span class="mu-bd" style="background:#3a3a3c;color:#fff">'+'&times;'+'</span><div class="mu-in" style="flex:1"><div class="mu-tt">'+(driving?'Radio off':'Stop music')+'</div></div></div>'}}
 else if(mu.tab==='se'){
  if(mu.api<0)h+='<div class="mu-n">YouTube is not reachable right now.</div>';
  else if(mu.busy)h+='<div class="mu-n">Searching...</div>';
  else if(mu.res&&mu.res.length){L.se=mu.res;mu.res.forEach((s,i)=>{h+=muSongRow(s,'song:se:'+i,mu.cur&&mu.cur.id===s.id,'<span class="mu-x" data-m="add:se:'+i+'">'+muSvg('plus')+'</span>')})}
  else if(mu.resMsg)h+='<div class="mu-n">'+muE(mu.resMsg)+'</div>';
  else if(!muCfg.ytKey)h+='<div class="mu-n">Search needs a YouTube key.<br>You can still paste a YouTube link here, and Radio works.</div>';
  else h+='<div class="mu-n">Find any song on YouTube.</div>'}
 else if(mu.tab==='lib'){L.fav=muDB.fav;L.rec=muDB.rec;
  h+='<div class="mu-h"><span>FAVOURITES</span></div>';if(!muDB.fav.length)h+='<div class="mu-n" style="padding:.3em .2em">Tap the heart on a song to keep it here.</div>';
  muDB.fav.forEach((s,i)=>{h+=muSongRow(s,'song:fav:'+i,mu.cur&&mu.cur.id===s.id,'<span class="mu-x" data-m="add:fav:'+i+'">'+muSvg('plus')+'</span>')});
  h+='<div class="mu-h"><span>RECENTLY PLAYED</span>'+(muDB.rec.length?'<span data-m="clr:rec" style="color:#ff5a79">CLEAR</span>':'')+'</div>';if(!muDB.rec.length)h+='<div class="mu-n" style="padding:.3em .2em">Nothing yet.</div>';
  muDB.rec.forEach((s,i)=>{h+=muSongRow(s,'song:rec:'+i,mu.cur&&mu.cur.id===s.id,'<span class="mu-x" data-m="add:rec:'+i+'">'+muSvg('plus')+'</span>')})}
 else{L.q=mu.q;h+='<div class="mu-h"><span>UP NEXT</span>'+(mu.q.length?'<span data-m="clr:q" style="color:#ff5a79">CLEAR</span>':'')+'</div>';
  if(!mu.q.length)h+='<div class="mu-n" style="padding:.3em .2em">'+(mu.src&&mu.src.k==='st'?muE(muST[mu.src.i].n)+' Radio is playing. ':'')+'Pick songs in Search or Library; + adds them here.</div>';
  mu.q.forEach((s,i)=>{h+=muSongRow(s,'song:q:'+i,mu.src&&mu.src.k==='q'&&i===mu.qi,'<span class="mu-x" data-m="del:'+i+'">'+muSvg('x')+'</span>')})}
 const top=sc.scrollTop;sc.innerHTML=h;sc.scrollTop=top}
// light refresh: text, icons and progress only (keeps the search box focused)
function muUpd(){const R=mu.root;if(!R||!R.isConnected)return;const g=id=>R.querySelector('#'+id),c=mu.cur,pl=mu.want&&!mu.blocked;
 const tt=g('muTt'),ss=g('muSs'),pp=g('muPp'),fv=g('muFv'),hint=g('muHint');if(!tt)return;
 const t=c?c.t:'Nothing playing',s=c?((c.c?c.c+(mu.src?' · ':''):'')+muSrcName()):'Pick a station or search';
 if(tt.textContent!==t)tt.textContent=t;if(ss.textContent!==s)ss.textContent=s;
 const k=pl?'pause':'play';if(pp.getAttribute('data-i')!==k){pp.setAttribute('data-i',k);pp.innerHTML=muSvg(k)}
 fv.classList.toggle('on',muIsFav());hint.style.display=mu.blocked&&mu.want?'block':'none';
 if(mu.blocked&&mu.want&&!mu.exp){mu.exp=true;R.classList.add('exp')}
 muProg()}
function muProg(){const R=mu.root;if(!R||!R.isConnected||mu.skDrag)return;const bar=R.querySelector('#muBar');if(!bar)return;const d=mu.P&&mu.rdy?muTry(()=>mu.P.getDuration(),0)||0:0,t=mu.P&&mu.rdy?muTry(()=>mu.P.getCurrentTime(),0)||0:0;
 bar.style.width=(d>0?Math.min(100,t/d*100):0).toFixed(1)+'%';R.querySelector('#muT0').textContent=muFmt(t);R.querySelector('#muT1').textContent=muFmt(d)}
function muTap(k,el){const p=k.split(':'),mode=driving?'car':'foot';
 if(mu.it&&/^(pp|next|prev|st|off|song|add|syn)$/.test(p[0]))muIntroDrop();
 if(k==='ikeep'){muDB.ikeep=!muDB.ikeep;muSave();muList();return}
 if(k==='ioff'){muISet({k:'off'});return}
 if(p[0]==='ist'){const S=muST[+p[1]];if(S)muISet({k:'st',id:S.id});return}
 if(p[0]==='isong'){const L=mu.lists[p[1]],s=L&&L[+p[2]];if(s&&s.id)muISet({k:'song',id:s.id,t:s.t,c:s.c,im:s.im,s:0});return}
 if(k==='isel')return;
 if(k==='back'){if(mu.exp){mu.exp=false;mu.root.classList.remove('exp');mu.hostCss='';return}if(mu.fb){muFbShow(false);return}muTry(()=>{if(typeof stHome==='function')stHome()});return}
 if(k==='exp'){mu.exp=!mu.exp;mu.root.classList.toggle('exp',mu.exp);mu.hostCss='';return}
 if(k==='pp'){muToggle();return}if(k==='next'){muNext();return}if(k==='prev'){muPrev();return}if(k==='fav'){muFav();return}
 if(p[0]==='tab'){mu.tab=p[1];muDraw();return}
 if(p[0]==='st'){muPlayStation(+p[1],mode);return}
 if(k==='off'){muStop();if(driving){muDB.car=-1;muSave()}muList();return}
 if(p[0]==='syn'){muTry(()=>{auR.st=+p[1];auR.step=0;auR.next=0;auBtn.textContent=auR.st<4?auST[auR.st].b:'OFF';auBtn.style.opacity=auR.st<4?1:.55});muList();return}
 if(k==='retry'){mu.api=0;muLoadApi();muDraw();return}
 if(k==='go'){const i=document.getElementById('muIn');if(i){muTry(()=>i.blur());(mu.tab==='in'?muISearch:muSearch)(i.value)}return}
 if(p[0]==='song'){const L=mu.lists[p[1]],s=L&&L[+p[2]];if(!s)return;
  if(p[1]==='q'){mu.qi=+p[2];muPlayQ(mode)}else if(p[1]==='fav'){mu.q=muDB.fav.map(x=>({id:x.id,t:x.t,c:x.c,im:x.im}));mu.qi=+p[2];muPlayQ(mode)}else muPlaySong(s,mode);return}
 if(p[0]==='add'){const L=mu.lists[p[1]],s=L&&L[+p[2]];if(s)muQAdd(s);return}
 if(p[0]==='del'){const i=+p[1];if(i===mu.qi&&mu.src&&mu.src.k==='q')return;mu.q.splice(i,1);if(i<mu.qi)mu.qi--;muList();return}
 if(k==='clr:rec'){muDB.rec=[];muSave();muList();return}
 if(k==='clr:q'){const c=mu.src&&mu.src.k==='q'?mu.q[mu.qi]:null;mu.q=c?[c]:[];mu.qi=c?0:-1;muList();return}}
// touch input on whatever container holds the app (events are the game's synthetic touch-shaped ones)
let muTch=null;
function muBind(el){if(el.muB)return;el.muB=true;const K=t=>t&&t.closest?t.closest('[data-m]'):null,isIn=e=>e.target&&e.target.tagName==='INPUT';
 const skAt=(s,x)=>{const r=s.sk.getBoundingClientRect();return Math.max(0,Math.min(1,(x-r.left)/Math.max(1,r.width)))};
 el.addEventListener('touchstart',e=>{if(!mu.root||!mu.root.contains(e.target))return;e.stopPropagation();if(isIn(e))return;e.preventDefault();const a=document.activeElement;if(a&&a.id==='muIn')muTry(()=>a.blur());
  const t=e.changedTouches[0];if(!t||(muTch&&performance.now()-muTch.t0<4000))return;const k=K(t.target),sc=mu.root.querySelector('#muSc'),inSc=sc&&sc.contains(t.target);
  muTch={t0:performance.now(),id:t.identifier,x:t.clientX,y:t.clientY,k:k,sc:inSc?sc:null,st:inSc?sc.scrollTop:0,mv:false,sk:k&&k.getAttribute('data-m')==='seek'?k:null};
  if(muTch.sk){mu.skDrag=true;const f=skAt(muTch,t.clientX);muTch.f=f;mu.root.querySelector('#muBar').style.width=(f*100).toFixed(1)+'%'}else if(k)k.classList.add('mu-pr')},{passive:false});
 el.addEventListener('touchmove',e=>{const s=muTch;if(!s)return;e.stopPropagation();if(e.cancelable)e.preventDefault();for(const t of e.changedTouches){if(t.identifier!==s.id)continue;
   if(s.sk){s.f=skAt(s,t.clientX);const b=mu.root.querySelector('#muBar');if(b)b.style.width=(s.f*100).toFixed(1)+'%';continue}
   const dy=t.clientY-s.y;if(Math.abs(t.clientX-s.x)+Math.abs(dy)>9){s.mv=true;if(s.k)s.k.classList.remove('mu-pr')}if(s.sc)s.sc.scrollTop=s.st-dy}},{passive:false});
 const end=e=>{const s=muTch;if(!s){if(mu.root&&mu.root.contains(e.target))e.stopPropagation();return}e.stopPropagation();let mine=e.type==='touchcancel';for(const t of e.changedTouches)if(t.identifier===s.id)mine=true;if(!mine)return;
  muTch=null;if(s.k)s.k.classList.remove('mu-pr');if(s.sk){mu.skDrag=false;if(e.type!=='touchcancel')muSeek(s.f);return}
  if(e.type==='touchcancel'||s.mv||!s.k||!s.k.isConnected)return;muTap(s.k.getAttribute('data-m'),s.k)};
 el.addEventListener('touchend',end);el.addEventListener('touchcancel',end);
 el.addEventListener('wheel',e=>{const sc=mu.root&&mu.root.querySelector('#muSc');if(sc&&mu.root.contains(e.target)){sc.scrollTop+=e.deltaY;e.stopPropagation()}},{passive:true});
 for(const ty of['keydown','keyup','keypress'])el.addEventListener(ty,e=>{if(!isIn(e)||e.target.id!=='muIn')return;e.stopPropagation();if(ty==='keydown'&&e.key==='Enter'){e.preventDefault();const v=e.target.value;muTry(()=>e.target.blur());(mu.tab==='in'?muISearch:muSearch)(v)}})}
function muAppOpen(el){mu.el=el;mu.open=true;muBind(el);muLoadApi();muDraw()}
function muAppClose(){mu.open=false;mu.vis=false;muHostSet(false)}
// the player follows the artwork panel while the app is on screen, otherwise it waits behind the game canvas
function muHostSet(on,r){let css='';if(on&&r){css=Math.round(r.left)+'|'+Math.round(r.top)+'|'+(r.width/320).toFixed(4)}if(css===mu.hostCss)return;mu.hostCss=css;
 if(!css){muHost.classList.remove('on');muHost.style.left='0';muHost.style.top='0';muHost.style.transform='none';return}
 muHost.classList.add('on');muHost.style.left=Math.round(r.left)+'px';muHost.style.top=Math.round(r.top)+'px';muHost.style.transform='scale('+(r.width/320).toFixed(4)+')'}
// ----- phone app registry (story); a small stand-in opener is used only when the registry is not there -----
const muFb=document.createElement('div');muFb.id='muFb';document.body.appendChild(muFb);
const muFbBtn=document.createElement('div');muFbBtn.id='muFbBtn';muFbBtn.textContent='♪';document.body.appendChild(muFbBtn);
function muFbLayout(){const W=innerWidth,H=innerHeight;let h=H>=W?Math.min(500,H*.62):Math.min(460,H-18);const w=Math.round(h*.49);muFb.style.width=w+'px';muFb.style.height=Math.round(h)+'px';muFb.style.right='12px';muFb.style.bottom=(H>=W?Math.round(H*.3):Math.round((H-h)/2))+'px';muFb.style.fontSize=(w/245*13).toFixed(2)+'px'}
function muFbShow(on){mu.fb=on;muFb.classList.toggle('on',on);if(on){muFbLayout();muAppOpen(muFb)}else muAppClose()}
const muReg=typeof stApps!=='undefined'&&stApps&&typeof stApps.push==='function';
if(muReg)stApps.push({id:'music',name:'Music',icon:'<svg viewBox="0 0 24 24">'+muIc.note+'</svg>',color:['#ff7187','#e6143c'],bare:true,open:function(el){muAppOpen(el)},close:function(){muAppClose()}});
else{muFbBtn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();muFbShow(!mu.fb)},{passive:false});for(const ty of['touchmove','touchend'])muFbBtn.addEventListener(ty,e=>e.stopPropagation());addEventListener('resize',()=>{if(mu.fb)setTimeout(muFbLayout,60)})}
function muOpenApp(){if(muReg&&typeof stOpenApp==='function'){muTry(()=>stOpenApp('music'));return}if(!muReg)muFbShow(true)}
muBtnDraw();
// ----- per-frame -----
let muBoot=0;
MODS.push(function muFrame(dt){
 // load the YouTube API a few seconds into play so it never slows the start
 if(mu.api===0&&state==='play'){muBoot+=dt;if(muBoot>4)muLoadApi()}
 if(typeof auExt!=='undefined')auExt=mu.api<0?0:1;
 muIntroTick(dt);
 if(!muReg){const sh=state==='play'?'flex':'none';if(muFbBtn.style.display!==sh)muFbBtn.style.display=sh;if(mu.fb&&state!=='play'&&state!=='map')muFbShow(false)}
 // entering and leaving vehicles
 const d=driving||null;if(d!==mu.drv){const was=mu.drv;mu.drv=d;
  if(!d&&was){if(mu.mode==='car'&&mu.want){muPause();mu.carP=true}else if(mu.mode==='car')mu.carP=false}
  else if(d&&!was&&mu.api>=0&&state==='play'){if(mu.carP&&mu.src){muResume('car')}else if(!mu.want&&muDB.car>=0){muPlayStation(muDB.car,'car')}}
  muBtnDraw();if(mu.open&&mu.tab==='st')muList()}
 // phone calls pause the music
 const call=muTry(()=>typeof stCallO!=='undefined'&&!!stCallO,false);
 if(call&&!mu.hold){mu.hold=true;if(mu.want&&mu.P&&mu.rdy){if(mu.ps===1||mu.ps===3)mu.selfP=true;muTry(()=>mu.P.pauseVideo())}}
 else if(!call&&mu.hold){mu.hold=false;if(mu.want&&mu.src){mu.reqT=performance.now();muCmd(()=>mu.P.playVideo())}}
 // where the player sits
 let vis=false;if(mu.open&&mu.root&&mu.root.isConnected&&(mu.fb||muTry(()=>typeof stPhoneOpen!=='function'||!!stPhoneOpen(),true))){const v=mu.root.querySelector('#muVid'),r=v?v.getBoundingClientRect():null;if(r&&r.width>60&&mu.src&&mu.rdy){vis=true;muHostSet(true,r)}else if(r&&r.width>60)vis=true}
 if(mu.open&&mu.el&&!(mu.root&&mu.root.isConnected)&&mu.el.isConnected&&!mu.el.firstChild)muDraw();
 if(!vis||!(mu.src&&mu.rdy))muHostSet(false);mu.vis=vis;
 if(mu.pillT>0){mu.pillT-=dt;if(mu.pillT<=0)muPl.classList.remove('on','tap')}
 mu.acc+=dt;if(mu.acc<.25)return;const step=mu.acc;mu.acc=0;
 muVol(false);if(vis)muProg();
 // playback that never started: a dead playlist falls back to the next one, a browser autoplay block becomes "tap to play"
 if(mu.want&&!mu.hold&&mu.P&&mu.rdy&&mu.src&&!mu.blocked&&(mu.ps===-1||mu.ps===5||mu.ps===2)){const el=performance.now()-mu.reqT;
  if(el>3500){const empty=mu.src.k==='st'&&!(muTry(()=>mu.P.getPlaylist(),null)||[]).length;
   if(empty){if(el>9000)muStFail()}
   else{mu.blocked=true;muBtnDraw();muUpd();if(!vis&&!(mu.it&&!mu.it.keep))muPill('♪ Tap to play',6,true)}}}
 if(mu.want&&!mu.hold&&mu.rdy&&mu.src&&mu.src.k==='st'&&mu.ps===0&&performance.now()-mu.reqT>3000)muPlayStation(mu.src.i,mu.mode);
 if(mu.kickT>0){mu.kickT-=step;if(mu.kickT<=0&&mu.want&&mu.ps!==1&&mu.ps!==3){mu.blocked=true;mu.exp=true;muBtnDraw();if(!vis)muOpenApp();else{muDraw()}}}});
