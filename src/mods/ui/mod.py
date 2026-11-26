# ui module reps
if "const dist=driving?(driving.camD||13):9,h=" in s:
    rep("const dist=driving?(driving.camD||13):9,h=","const dist=(driving?(driving.camD||13):9)*uiZoom*(uiS.cd||1),h=")   # pinch zoom (airport's version of the camera line)
else:
    rep("const dist=driving?13:9,h=","const dist=(driving?13:9)*uiZoom*(uiS.cd||1),h=")                                     # pinch zoom (base camera line)
rep("camYaw-=(t.clientX-look.x)*0.008;camPitch=Math.max(0.05,Math.min(1.3,camPitch+(t.clientY-look.y)*0.005));","camYaw-=(t.clientX-look.x)*0.008*uiSens;camPitch=Math.max(uiFPWas?-1.05:0.05,Math.min(uiFPWas?1.6:1.3,camPitch+(t.clientY-look.y)*0.005*uiSens*uiInvY));")  # sensitivity + invert Y
rep("if(t.clientX<innerWidth*.42&&t.clientY>innerHeight*.4&&joy.id===null)","if(uiJoyZone(t)&&joy.id===null)")  # floating joystick + left-handed zone

# extras (ext.js): dead zone, auto-centre, day length, shift-lock shoulder camera, then the extras code itself
rep("if(jm<0.22){jx=0;jy=0}else{const s2=(jm-0.22)/0.78/jm;","if(jm<uiS.dz){jx=0;jy=0}else{const s2=(jm-uiS.dz)/(1-uiS.dz)/jm;")
rep("if(driving&&!look.id){const target=driving.m.rotation.y;","if(driving&&!look.id&&!uiRMB&&uiS.ac){const target=driving.m.rotation.y;")  # no auto-centre while the right mouse button turns the camera
rep("dayT=(dayT+dt/1200)%1","dayT=(dayT+dt/(60*(uiS.day||20)))%1")
rep("cam.position.lerp(new THREE.Vector3(cx,Math.max(1,cy),cz),Math.min(1,10*dt));cam.lookAt(pos.x,pos.y+h,pos.z);","const uiOx=uiShift&&!driving?Math.cos(camYaw)*1.6:0,uiOz=uiShift&&!driving?-Math.sin(camYaw)*1.6:0;cam.position.lerp(new THREE.Vector3(cx+uiOx,Math.max(1,cy),cz+uiOz),Math.min(1,10*dt));cam.lookAt(pos.x+uiOx,pos.y+h,pos.z+uiOz);")
rep("// ---------- main loop ----------",open(os.path.join(MODS,'ui/ext.js'),encoding='utf-8').read()+"\n// ---------- main loop ----------")
# design system (theme.js): tokens, HUD layout, title menu, settings tabs, panel styling; loads after ext.js so it can restyle and regroup it
_th=open(os.path.join(MODS,'ui/theme.js'),encoding='utf-8').read()
assert '`' not in _th and '${' not in _th and '</script>' not in _th, 'ui/theme.js: no backticks, ${ or </script>'
rep("// ---------- main loop ----------",_th+"\n// ---------- main loop ----------")
# declare UTF-8 so stars, arrows and the infinity sign render on hosts that send no charset header (local servers, file://)
rep('<meta name="viewport"','<meta charset="utf-8"><meta name="viewport"')

# boot screen: the page's first paint is a dark BLOCK CITY card in the new title's style instead of the old #msg title (which stays hidden while
# the card exists); the card fades out on the first rendered frame, when the new title screen is already in place (see uiBoot in mod.js)
rep('<div id="msg">','<div id="uiBoot"><style>#uiBoot{position:fixed;left:0;top:0;right:0;bottom:0;z-index:90;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 42%,#1b2230 0%,#07090e 68%,#030406 100%);color:#e8ecf1;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;transition:opacity .45s ease;pointer-events:none}#uiBoot~#msg{display:none}#uiBoot b{font-size:clamp(34px,9vw,76px);font-weight:800;letter-spacing:.2em;margin-right:-.2em;line-height:1;text-align:center}#uiBoot div{width:150px;height:1px;margin:16px 0 12px;background:linear-gradient(90deg,transparent,#ffd23f,transparent)}#uiBoot small{font-size:10px;font-weight:700;letter-spacing:.42em;margin-right:-.42em;opacity:.55;animation:uiBootP 1.4s ease-in-out infinite}#uiBoot i{font-style:normal;font-size:11px;margin-top:14px;opacity:0;animation:uiBootL 0s 25s forwards}@keyframes uiBootP{50%{opacity:.25}}@keyframes uiBootL{to{opacity:.6}}</style><b>BLOCK CITY</b><div></div><small>LOADING</small><i>Still loading. The first visit needs an internet connection.</i></div><div id="msg">')
