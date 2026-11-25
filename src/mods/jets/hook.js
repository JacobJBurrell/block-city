window.__jt=()=>({n:jtJets.length,mode:jtMode,ms:jtMs.length,rel:+jtRel.toFixed(1),drv:!!(driving&&driving.jt),wanted,alert:typeof ldAlert!=='undefined'?Math.round(ldAlert):null,x:Math.round(pos.x),y:+pos.y.toFixed(1),z:Math.round(pos.z),spd:driving?Math.round(driving.speed):0,hp:Math.round(hp),dead:jtJets.filter(p=>p.dead).length,state});
window.__jtTp=i=>{vhLaterAll();const p=jtJets[i],m=p.m;pos.set(m.position.x-Math.cos(m.rotation.y)*3.4,.3,m.position.z+Math.sin(m.rotation.y)*3.4);vel.set(0,0,0);camYaw=m.rotation.y;camPitch=.25};
window.__jtFire=b=>{fireId=b?77:null};window.__jtMode=()=>cycleWeapon();window.__jtCam=(y,p)=>{camYaw=y;camPitch=p};
window.__jtView=(x,y,z,tx,ty,tz)=>{cam.position.set(x,y,z);cam.lookAt(tx,ty,tz)};
