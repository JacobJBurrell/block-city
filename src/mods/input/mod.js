// ---------- keyboard for desktop play (Roblox defaults: WASD move, Up/Down arrows move, Left/Right arrows turn the camera, Space jump) ----------
// In any vehicle every arrow key goes to the vehicle (steering, and the flight controls in planes, helicopters and jets), never to the camera.
const inKeys={};
{const K=inKeys,typing=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]');
 const mv=()=>{if(joy.id!==null&&joy.id!=='kb')return;const veh=!!driving,x=Math.max(-1,Math.min(1,(K.d?1:0)-(K.a?1:0)+(veh?(K.arrowright?1:0)-(K.arrowleft?1:0):0))),y=Math.max(-1,Math.min(1,(K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0)));
  if(x||y){joy.id='kb';joy.x=x;joy.y=y}else if(joy.id==='kb'){joy.id=null;joy.x=joy.y=0}};
 addEventListener('keydown',e=>{if(typing(e))return;const k=e.key.toLowerCase();if(state==='ready'&&(k==='enter'||k===' ')){state='play';$('msg').style.display='none';audio()}K[k]=1;mv();if(k===' '){jumpQ=true;e.preventDefault()}if(k.indexOf('arrow')===0)e.preventDefault()});
 addEventListener('keyup',e=>{K[e.key.toLowerCase()]=0;mv()});addEventListener('blur',()=>{for(const k in K)K[k]=0;mv()});
 // per frame: keep the key-driven stick in step (getting in or out of a vehicle changes what the arrows do) and turn the camera with Left/Right on foot
 MODS.push(function(dt){mv();if(state!=='play'||driving)return;const r=(K.arrowleft?1:0)-(K.arrowright?1:0);if(r)camYaw+=r*2.4*dt})}
