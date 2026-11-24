// ---------- keyboard for desktop play ----------
{const K={};const mv=()=>{if(joy.id!==null&&joy.id!=='kb')return;const x=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0),y=(K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0);if(x||y){joy.id='kb';joy.x=x;joy.y=y}else if(joy.id==='kb'){joy.id=null;joy.x=joy.y=0}};
 addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(state==='ready'&&(k==='enter'||k===' ')){state='play';$('msg').style.display='none';audio()}K[k]=1;mv();if(k===' '){jumpQ=true;e.preventDefault()}if(k.indexOf('arrow')===0)e.preventDefault()});
 addEventListener('keyup',e=>{K[e.key.toLowerCase()]=0;mv()});addEventListener('blur',()=>{for(const k in K)K[k]=0;mv()});
 }
