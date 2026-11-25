window.__is={tp:(x,z,y)=>{vhLaterAll();if(driving){driving.speed=0;driving=null;player.visible=true}pos.set(x,y||1,z);vel.set(0,0,0)},
 cam:(yaw,pitch)=>{camYaw=yaw;camPitch=pitch;look.id=99},free:()=>{look.id=null},
 top:(x,z,h,dx,dz)=>{window.__isTop=[x,z,h,dx||0,dz||30]},untop:()=>{window.__isTop=null},
 st:()=>({x:Math.round(pos.x),y:+pos.y.toFixed(2),z:Math.round(pos.z),drv:driving?(driving.vhT||driving.m.userData.isType||'car'):null,spd:driving?+driving.speed.toFixed(1):0,state,draws:isDraws,groups:isGroups.filter(g=>g.visible).map(g=>g.name).join(','),cars:cars.length,sol:isSol.length,land:+isLandAt(pos.x,pos.z).toFixed(2)}),
 car:(type,x,z,ry)=>{vhLaterAll();const c=isPark(type,x,z,ry||0);if(driving){driving=null}pos.set(x,1,z);driving=c;player.visible=false;return type},
 boat:(x,z,ry)=>{vhLaterAll();const c=isCraft.find(b=>!b.dead&&b.isMax>30&&b.m.userData.wheels===undefined)||isCraft[0];c.m.position.set(x,0,z);c.m.rotation.y=ry||0;driving=c;player.visible=false;pos.copy(c.m.position);return 'boat'},
 joy:(x,y)=>{joy.id=x||y?'test':null;joy.x=x;joy.y=y},exit:()=>{carQ=true},day:t=>{dayT=t},
 types:()=>Object.keys(isSpecs)};
{const r0=composer.render.bind(composer);let saved=null;composer.render=function(a){const t=window.__isTop;if(t){if(!saved)saved=[cam.far,scene.fog.far,scene.fog.near];cam.far=3000;cam.updateProjectionMatrix();scene.fog.near=2000;scene.fog.far=4000;cam.position.set(t[0]+t[3],t[2],t[1]+t[4]);cam.lookAt(t[0],0,t[1]);for(const g of isGroups)g.visible=true}else if(saved){cam.far=saved[0];cam.updateProjectionMatrix();scene.fog.far=saved[1];scene.fog.near=saved[2];saved=null}return r0(a)}}
window.__is.dbg=()=>{let e='';try{isTick(.016)}catch(x){e=x.message+' @ '+(x.stack||'').split('\n')[1]}return JSON.stringify([MODS.indexOf(isTick),MODS.length,isCullT,e])};
window.__is.dbg2=()=>JSON.stringify({cam:cam.position.toArray().map(v=>Math.round(v)),g:isGroups.map(g=>[g.name,g.visible,Math.round(Math.hypot(cam.position.x-g.userData.c[0],cam.position.z-g.userData.c[1])),g.userData.c[2]])});
window.__isDt=[];MODS.push(function(dt){if(window.__isDt.length<8)window.__isDt.push(dt)});
window.__is.spd=v=>{if(driving)driving.speed=v};window.__is.put=(x,z,ry)=>{if(driving){driving.m.position.set(x,driving.m.position.y,z);driving.m.rotation.y=ry;pos.set(x,pos.y,z)}};
window.__is.vd=()=>vhDrive.toString().slice(0,60);
window.__is.t1=()=>{const c=driving;const a=c.m.position.x;vhDrive(.05,0,-1);const b=c.m.position.x;return JSON.stringify([a,b,c.vhT,c.speed,c.m.rotation.y])};
window.__is.row=()=>{const T=Object.keys(isSpecs);T.forEach((t,i)=>{const c=isPark(t,isRX-34+i*4.6,isRZ-14,0)});return T.join(',')};
