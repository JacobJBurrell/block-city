window.__gx={stats:()=>{gxStats.measure=true;renderer.info.autoReset=false;return JSON.stringify(Object.assign({scale:gxScale,eff:gxEff,dyn:gxDyn,up:gxUpOn,chunks:gxChunks.length,objs:scene.children.length,win:winMats.length,pr:renderer.getPixelRatio(),rt:composer.renderTarget1.width+'x'+composer.renderTarget1.height},gxStats))},
 apply:q=>JSON.stringify(gxApply(q)),scale:s=>gxSetScale(s),sharp:v=>{gxSharp=v},up:b=>{if(gxPass)gxPass.enabled=b},auto:f=>gxAuto(f),
 view:(x,z,yaw,pit,fov)=>{pos.set(x,0.3,z);vel.set(0,0,0);look.id=99;camYaw=yaw;camPitch=pit;if(fov){cam.fov=fov;cam.updateProjectionMatrix()}},day:t=>{dayT=t;envT=0},top:(x,y,z)=>{pos.set(x,y,z)}};
window.__gxv=(n)=>{state='gxview';document.body.classList.add('ui-noblur');try{$('msg').style.display='none'}catch(e){}const R=roadCenter;
 const V={street:[R(5)+3,0.3,R(5)+3,0.9,.12],roof:[R(5),95,R(5)+30,.6,.85],beach:[HALF+22,0.3,R(4)+10,-1.57,.15],suburb:[R(1)+3,0.3,R(6)+3,.4,.2],park:[R(5)+CELL/2-14,0.3,R(5)+CELL/2+14,.7,.25],airport:[-HALF-120,0.3,0,1.57,.2]}[n];
 pos.set(V[0],V[1],V[2]);vel.set(0,0,0);look.id=99;camYaw=V[3];camPitch=V[4];return n};
window.__gxs=()=>{gxStats.measure=true;renderer.info.autoReset=false;return __gx.stats()};
window.__gxa=()=>{const cat={};let tot=0;for(const o of scene.children){let n=0,t=0;o.traverse(q=>{if(q.isMesh&&q.visible){n++;const g=q.geometry;t+=(g.index?g.index.count:(g.attributes.position?g.attributes.position.count:0))/3*(q.isInstancedMesh?q.count:1)}});if(!n)continue;tot+=n;
 const m=o.isMesh?o.material:null,k=(o.isMesh?'M:'+(o.geometry.type||'')+':'+(m&&m.type)+':'+(o.geometry.parameters?JSON.stringify(o.geometry.parameters).slice(0,40):''):(o.isGroup?'G:'+o.children.length+':'+(o.userData.kind||o.userData.vhT||Object.keys(o.userData).slice(0,3).join('|')):o.type));
 const c=cat[k]||(cat[k]={k,objs:0,meshes:0,tris:0});c.objs++;c.meshes+=n;c.tris+=t}
 return JSON.stringify({tot,top:Object.values(cat).sort((a,b)=>b.meshes-a.meshes).slice(0,22).map(c=>[c.k,c.objs,c.meshes,Math.round(c.tris)])})};
window.__gxb=()=>{const R=()=>{renderer.info.autoReset=false;renderer.info.reset();renderer.shadowMap.needsUpdate=true;composer.render();return [renderer.info.render.calls,renderer.info.render.triangles]};const out={all:R()};
 const tog=(k,objs)=>{const v=objs.map(o=>o.visible);objs.forEach(o=>o.visible=false);out[k]=R();objs.forEach((o,i)=>o.visible=v[i])};
 tog('chunks',gxChunks.map(c=>c.grp));tog('imp',Object.values(gxImp));
 const rl=[];scene.traverse(o=>{if(o.userData&&o.userData.rl)rl.push(o.userData.rl)});tog('rlcars',rl);
 const av=[];scene.traverse(o=>{if(o.isSkinnedMesh)av.push(o)});tog('avatars',av);
 const sh=sun.castShadow;sun.castShadow=false;out.noshadow=R();sun.castShadow=sh;
 const big=[];for(const o of scene.children){let t=0;o.traverse(q=>{if(q.isMesh&&q.visible&&q.layers.test(cam.layers)){const g=q.geometry;t+=(g.index?g.index.count:g.attributes.position.count)/3*(q.isInstancedMesh?q.count:1)}});if(t>40000)big.push([o.type,o.name,o.children.length,Math.round(t),Object.keys(o.userData).slice(0,3).join('|'),(o.material&&o.material.type)||''])}
 out.big=big.sort((a,b)=>b[3]-a[3]).slice(0,12);return JSON.stringify(out)};
window.__gxe=c=>eval(c);
