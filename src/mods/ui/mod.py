# ui module reps
if "const dist=driving?(driving.camD||13):9,h=" in s:
    rep("const dist=driving?(driving.camD||13):9,h=","const dist=(driving?(driving.camD||13):9)*uiZoom*(uiS.cd||1),h=")   # pinch zoom (airport's version of the camera line)
else:
    rep("const dist=driving?13:9,h=","const dist=(driving?13:9)*uiZoom*(uiS.cd||1),h=")                                     # pinch zoom (base camera line)
rep("camYaw-=(t.clientX-look.x)*0.008;camPitch=Math.max(0.05,Math.min(1.3,camPitch+(t.clientY-look.y)*0.005));","camYaw-=(t.clientX-look.x)*0.008*uiSens;camPitch=Math.max(uiFPWas?-1.05:0.05,Math.min(uiFPWas?1.6:1.3,camPitch+(t.clientY-look.y)*0.005*uiSens*uiInvY));")  # sensitivity + invert Y
rep("if(t.clientX<innerWidth*.42&&t.clientY>innerHeight*.4&&joy.id===null)","if(uiJoyZone(t)&&joy.id===null)")  # floating joystick + left-handed zone

# extras (ext.js): dead zone, auto-centre, day length, shift-lock shoulder camera, then the extras code itself
rep("if(jm<0.22){jx=0;jy=0}else{const s2=(jm-0.22)/0.78/jm;","if(jm<uiS.dz){jx=0;jy=0}else{const s2=(jm-uiS.dz)/(1-uiS.dz)/jm;")
rep("if(driving&&!look.id){const target=driving.m.rotation.y;","if(driving&&!look.id&&uiS.ac){const target=driving.m.rotation.y;")
rep("dayT=(dayT+dt/1200)%1","dayT=(dayT+dt/(60*(uiS.day||20)))%1")
rep("cam.position.lerp(new THREE.Vector3(cx,Math.max(1,cy),cz),Math.min(1,10*dt));cam.lookAt(pos.x,pos.y+h,pos.z);","const uiOx=uiShift&&!driving?Math.cos(camYaw)*1.6:0,uiOz=uiShift&&!driving?-Math.sin(camYaw)*1.6:0;cam.position.lerp(new THREE.Vector3(cx+uiOx,Math.max(1,cy),cz+uiOz),Math.min(1,10*dt));cam.lookAt(pos.x+uiOx,pos.y+h,pos.z+uiOz);")
rep("// ---------- main loop ----------",open(os.path.join(MODS,'ui/ext.js')).read()+"\n// ---------- main loop ----------")
