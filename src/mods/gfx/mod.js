// ---------- gfx: static batching, stable shadows, FSR-style upscaling + sharpening, colour grade, quality policy ----------
let gxScale=1,gxSharp=.3,gxQ=8,gxEff=8,gxDyn=1,gxShN=1,gxFrame=0,gxUpOn=false,gxGood=0,gxBad=0,gxAcc=0,gxN=0,gxWarm=0,gxLodT=0,gxLast=performance.now();
const gxChunks=[],gxStats={calls:0,tris:0,merged:0,removed:0,on:false},gxNoBatch=location.hash.indexOf('gxnobatch')>=0,gxNoUp=location.hash.indexOf('gxnoup')>=0,gxFr=new THREE.Frustum(),gxPM=new THREE.Matrix4();
// ----- 1. static batching -----
function gxBatch(){scene.updateMatrixWorld(true);const C=110,chunks={},rm=[],winSet=new Set(winMats),shared={},sm={};
 const M=(k,f)=>sm[k]||(sm[k]=f());
 const add=(x,z,mk,mat,geo,sh)=>{const k=Math.floor(x/C)+'_'+Math.floor(z/C),c=chunks[k]||(chunks[k]={m:{},inst:{}});(c.m[mk]||(c.m[mk]={mat,g:[],sh})).g.push(geo)};
 const prep=(mesh,uv,ao)=>{let g=mesh.geometry.clone();if(g.index)g=g.toNonIndexed();for(const k of Object.keys(g.attributes))if(k!=='position'&&k!=='normal'&&k!=='uv')g.deleteAttribute(k);
  if(uv){const u=g.attributes.uv;for(let i=0;i<u.count;i++)u.setXY(i,u.getX(i)*uv.x,u.getY(i)*uv.y)}
  if(ao){const p=g.attributes.position,n=p.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){const v=p.getY(i)<0?.6:1;a[i*3]=a[i*3+1]=a[i*3+2]=v}g.setAttribute('color',new THREE.BufferAttribute(a,3))}
  g.applyMatrix4(mesh.matrixWorld);return g};
 const low=new THREE.BufferGeometry();{const parts=[[0,4.4,0,1.75],[1,3.8,.3,1.25],[-.9,3.9,-.4,1.3],[.1,3.7,-1,1.15],[-.2,3.75,1,1.2],[-.1,5.4,.1,1.2]].map(a=>{const q=new THREE.IcosahedronGeometry(1,1);q.scale(a[3],a[3]*.85,a[3]);q.translate(a[0],a[1],a[2]);return q});low.copy(U.mergeBufferGeometries(parts))}
 for(const o of scene.children.slice()){
  if(o.isMesh&&!o.isInstancedMesh&&!o.isSkinnedMesh&&!o.children.length&&o.visible&&!Array.isArray(o.material)){const g=o.geometry,p=g.parameters||{},m=o.material;let mk=null,mat=m,uv=null,ao=false,sh=3;
   if(winSet.has(m)&&m.map){const sid=m.map.source?m.map.source.uuid:m.map.uuid;uv=m.map.repeat.clone();if(!shared[sid]){shared[sid]=m.clone();shared[sid].map=m.map.clone();shared[sid].map.repeat.set(1,1);shared[sid].map.needsUpdate=true;if(m.emissiveMap){shared[sid].emissiveMap=m.emissiveMap.clone();shared[sid].emissiveMap.repeat.set(1,1);shared[sid].emissiveMap.needsUpdate=true}shared[sid].vertexColors=true}mat=shared[sid];mk='b'+sid;ao=true}
   else if(g===roofGeo&&m===roofMat){mk='cap'}
   else if(typeof fxRoofGeo!=='undefined'&&g===fxRoofGeo){mk='pr'+m.uuid}
   else if(m===lampMat){mk='lamp';sh=0}
   else if(g.type==='BoxGeometry'&&m.isMeshStandardMaterial&&!m.isMeshPhysicalMaterial&&!m.map&&!m.transparent&&!Object.keys(o.userData).length){const hex=m.color.getHex();
    if(p.height===2&&hex===0x666666){mk='roof';mat=M('roof',()=>m)}
    else if(p.width===.3&&p.height===6&&p.depth===.3){mk='pole';mat=M('pole',()=>m);sh=1}
    else if(p.height===.3&&p.width===BLOCK&&p.depth===BLOCK){mk='sw'+hex;mat=M(mk,()=>m);sh=2}
    else if(p.height===.35&&p.width===BLOCK-4){mk='pg'+hex;mat=M(mk,()=>m);sh=2}
    else if(p.width===40&&p.depth===40&&hex===0x5c8f5a){mk='hill';mat=M('hill',()=>m);sh=0}}
   if(mk){add(o.position.x,o.position.z,mk,mat,prep(o,uv,ao),sh);rm.push(o)}}
  else if(o.isGroup&&o.children.length===2&&o.children[0].geometry===trunkGeo&&o.children[1].geometry===canopyGeo&&o.visible){const k=Math.floor(o.position.x/C)+'_'+Math.floor(o.position.z/C),c=chunks[k]||(chunks[k]={m:{},inst:{}});
   (c.m.trunk||(c.m.trunk={mat:trunkMat,g:[],sh:1})).g.push(prep(o.children[0]));const lm=o.children[1].material;(c.inst[lm.uuid]||(c.inst[lm.uuid]={mat:lm,mx:[]})).mx.push(o.children[1].matrixWorld.clone());rm.push(o)}}
 const built=[];
 for(const k in chunks){const c=chunks[k],grp=new THREE.Group(),box=new THREE.Box3();grp.userData.gx=true;
  for(const mk in c.m){const e=c.m[mk],geo=U.mergeBufferGeometries(e.g);if(!geo)throw new Error('merge '+mk);geo.computeBoundingSphere();geo.computeBoundingBox();const me=new THREE.Mesh(geo,e.mat);me.castShadow=!!(e.sh&1);me.receiveShadow=!!(e.sh&2);me.matrixAutoUpdate=false;grp.add(me);box.union(geo.boundingBox);for(const q of e.g)q.dispose()}
  const inst=[];for(const u in c.inst){const e=c.inst[u],im=new THREE.InstancedMesh(low,e.mat,e.mx.length);e.mx.forEach((m,i)=>{im.setMatrixAt(i,m);box.expandByPoint(new THREE.Vector3().setFromMatrixPosition(m).add(new THREE.Vector3(0,4,0)))});im.instanceMatrix.needsUpdate=true;im.castShadow=true;im.frustumCulled=false;im.matrixAutoUpdate=false;grp.add(im);inst.push(im)}
  const sp=box.getBoundingSphere(new THREE.Sphere());sp.radius+=6;grp.matrixAutoUpdate=false;built.push({grp,sp,inst})}
 if(!built.length)return;
 for(const b of built){scene.add(b.grp);gxChunks.push(b)}
 for(const o of rm){scene.remove(o);if(o.isMesh&&o.geometry!==roofGeo&&!(typeof fxRoofGeo!=='undefined'&&o.geometry===fxRoofGeo))o.geometry.dispose();if(o.isMesh&&winSet.has(o.material))o.material.dispose()}
 winMats.length=0;for(const k in shared)winMats.push(shared[k]);
 gxStats.merged=built.length;gxStats.removed=rm.length;gxStats.on=true}
if(!gxNoBatch){try{gxBatch()}catch(e){console.log('gx batch skipped',e)}}
// ----- 2. upscale (bicubic with anti-ringing clamp) + contrast-adaptive sharpening -----
let gxPass=null;
try{if(!gxNoUp&&THREE.FullScreenQuad){const vs='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
 const m1=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null},src:{value:new THREE.Vector2(1,1)}},vertexShader:vs,depthTest:false,depthWrite:false,fragmentShader:[
  'uniform sampler2D tDiffuse;uniform vec2 src;varying vec2 vUv;',
  'void main(){vec2 sp=vUv*src,tc=floor(sp-.5)+.5,f=sp-tc;',
  'vec2 w0=f*(-.5+f*(1.-.5*f)),w1=1.+f*f*(-2.5+1.5*f),w2=f*(.5+f*(2.-1.5*f)),w3=f*f*(-.5+.5*f);',
  'vec2 w12=w1+w2,o12=w2/w12,t0=(tc-1.)/src,t3=(tc+2.)/src,t12=(tc+o12)/src;',
  'vec3 c=texture2D(tDiffuse,vec2(t0.x,t0.y)).rgb*w0.x*w0.y+texture2D(tDiffuse,vec2(t12.x,t0.y)).rgb*w12.x*w0.y+texture2D(tDiffuse,vec2(t3.x,t0.y)).rgb*w3.x*w0.y',
  '+texture2D(tDiffuse,vec2(t0.x,t12.y)).rgb*w0.x*w12.y+texture2D(tDiffuse,vec2(t12.x,t12.y)).rgb*w12.x*w12.y+texture2D(tDiffuse,vec2(t3.x,t12.y)).rgb*w3.x*w12.y',
  '+texture2D(tDiffuse,vec2(t0.x,t3.y)).rgb*w0.x*w3.y+texture2D(tDiffuse,vec2(t12.x,t3.y)).rgb*w12.x*w3.y+texture2D(tDiffuse,vec2(t3.x,t3.y)).rgb*w3.x*w3.y;',
  'vec3 a=texture2D(tDiffuse,tc/src).rgb,b=texture2D(tDiffuse,(tc+vec2(1.,0.))/src).rgb,d=texture2D(tDiffuse,(tc+vec2(0.,1.))/src).rgb,e=texture2D(tDiffuse,(tc+1.)/src).rgb;',
  'gl_FragColor=vec4(clamp(c,min(min(a,b),min(d,e)),max(max(a,b),max(d,e))),1.);}'].join('\n')});
 const m2=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null},px:{value:new THREE.Vector2(1,1)},sharp:{value:.3}},vertexShader:vs,depthTest:false,depthWrite:false,fragmentShader:[
  'uniform sampler2D tDiffuse;uniform vec2 px;uniform float sharp;varying vec2 vUv;',
  'void main(){vec3 e=texture2D(tDiffuse,vUv).rgb,b=texture2D(tDiffuse,vUv+vec2(0.,-px.y)).rgb,d=texture2D(tDiffuse,vUv+vec2(-px.x,0.)).rgb,f=texture2D(tDiffuse,vUv+vec2(px.x,0.)).rgb,h=texture2D(tDiffuse,vUv+vec2(0.,px.y)).rgb;',
  'vec3 mn=min(min(b,d),min(f,h)),mx=max(max(b,d),max(f,h));',
  'vec3 hmin=min(mn,e)/(4.*mx+1e-4),hmax=(1.-max(mx,e))/(4.*mn-4.-1e-4);vec3 lv=max(-hmin,hmax);',
  'float lobe=max(-.1875,min(max(lv.r,max(lv.g,lv.b)),0.))*sharp;',
  'gl_FragColor=vec4(clamp((lobe*(b+d+f+h)+e)/(4.*lobe+1.),0.,1.),1.);}'].join('\n')});
 const quad=new THREE.FullScreenQuad(m1),rt=new THREE.WebGLRenderTarget(4,4,{depthBuffer:false}),v=new THREE.Vector2();
 gxPass={enabled:true,needsSwap:false,clear:false,renderToScreen:true,setSize:function(){},dispose:function(){},
  render:function(r,wb,rb){r.getDrawingBufferSize(v);if(rt.width!==v.x||rt.height!==v.y)rt.setSize(v.x,v.y);
   m1.uniforms.tDiffuse.value=rb.texture;m1.uniforms.src.value.set(rb.width,rb.height);quad.material=m1;r.setRenderTarget(rt);quad.render(r);
   m2.uniforms.tDiffuse.value=rt.texture;m2.uniforms.px.value.set(1/v.x,1/v.y);m2.uniforms.sharp.value=gxSharp*4;quad.material=m2;r.setRenderTarget(null);quad.render(r)}};
 composer.addPass(gxPass);gxUpOn=true}}catch(e){console.log('gx upscaler off',e);gxPass=null;gxUpOn=false}
function gxSetScale(s){gxScale=Math.max(.4,Math.min(1,s));if(!gxUpOn)gxScale=1;try{composer.setPixelRatio(renderer.getPixelRatio()*gxScale);composer.setSize(innerWidth,innerHeight)}catch(e){}return gxScale}
// ----- 3. image quality -----
try{const an=Math.min(8,renderer.capabilities.getMaxAnisotropy()),seen=new Set();scene.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms)for(const k of['map','emissiveMap']){const t=m[k];if(t&&!seen.has(t)){seen.add(t);if(t.anisotropy<an){t.anisotropy=an;t.needsUpdate=true}}}})}catch(e){}
try{skyU.sd={value:new THREE.Vector3(0,1,0)};sky.material.fragmentShader=['uniform vec3 top;uniform vec3 bot;uniform vec3 sd;varying vec3 p;',
 'void main(){vec3 d=normalize(p);float h=d.y;vec3 c=mix(bot,top,pow(clamp(h*1.3,0.,1.),.75));',
 'c=mix(c,bot*1.1+.02,exp(-abs(h)*8.)*.5);float s=max(dot(d,normalize(sd)),0.),up=smoothstep(-.1,.15,sd.y);',
 'c+=vec3(1.,.8,.58)*(pow(s,5.)*.16+pow(s,60.)*.5)*up;gl_FragColor=vec4(c,1.);}'].join('\n');sky.material.needsUpdate=true}catch(e){console.log('gx sky',e)}
try{grade.material.fragmentShader=['uniform sampler2D tDiffuse;uniform float dmg,ex;varying vec2 vUv;',
 'vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}',
 'void main(){vec2 c=vUv-.5;float r=dot(c,c);vec3 col=aces(max(texture2D(tDiffuse,vUv).rgb,vec3(0.))*ex*1.06);',
 'float l=dot(col,vec3(.2126,.7152,.0722));col=mix(vec3(l),col,1.14);',
 'col+=vec3(-.010,.0,.016)*(1.-smoothstep(0.,.4,l))+vec3(.018,.008,-.014)*smoothstep(.45,1.,l);',
 'col=pow(clamp(col,0.,1.),vec3(1./2.2));col=mix(col,col*col*(3.-2.*col),.28);',
 'col*=1.-r*.5;col=mix(col,vec3(.75,0.,0.),dmg*smoothstep(.08,.45,r));gl_FragColor=vec4(col,1.);}'].join('\n');grade.material.needsUpdate=true;
 bloom.strength=.6;bloom.radius=.5;hemi.groundColor.set(0x3b4960)}catch(e){console.log('gx grade',e)}
// ----- shadows: texel-snapped so they do not shimmer, optional reduced update rate -----
const gxLM=new THREE.Matrix4(),gxLI=new THREE.Matrix4(),gxV1=new THREE.Vector3(),gxUp=new THREE.Vector3(0,1,0);
function gxSun(){try{const sc=sun.shadow.camera,st=(sc.right-sc.left)/sun.shadow.mapSize.x;gxLM.lookAt(sun.position,sun.target.position,gxUp);gxLI.copy(gxLM).transpose();
 gxV1.copy(sun.target.position).applyMatrix4(gxLI);const dx=Math.round(gxV1.x/st)*st-gxV1.x,dy=Math.round(gxV1.y/st)*st-gxV1.y;gxV1.set(dx,dy,0).applyMatrix4(gxLM);
 sun.position.add(gxV1);sun.target.position.add(gxV1);
 if(gxShN>1&&renderer.shadowMap.autoUpdate===false)renderer.shadowMap.needsUpdate=(gxFrame%gxShN===0)}catch(e){}}
// ----- 4. quality policy -----
const gxOUT=[1,1.25,1.5,2,2,2.5,3,3,3,3],gxSC=[.75,.72,.67,.62,.7,.67,.67,.77,.87,1],gxSH=[.4,.4,.38,.38,.35,.35,.33,.3,.25,.18];
function gxApply(q){q=Math.max(1,Math.min(10,Math.round(q||8)));gxEff=q;const i=q-1,dpr=devicePixelRatio||1,out=Math.min(dpr,gxOUT[i]),o={q,out,scale:1,shadow:0,every:1,bloom:q>=4};
 try{renderer.setPixelRatio(out);if(typeof size==='function')size();
  const floor=Math.min(1,Math.max(.5,Math.min(dpr,1.5)/out));o.scale=gxUpOn?Math.max(floor,Math.min(1,gxSC[i]*gxDyn+(1-gxSC[i])*0)):1;if(gxUpOn&&gxDyn>=1)o.scale=gxSC[i];gxSharp=gxSH[i];gxSetScale(o.scale);
  const sh=q>=4,ms=q>=9?4096:(q>=6?2048:1024);o.shadow=sh?ms:0;if(sun.castShadow!==sh)sun.castShadow=sh;if(sun.shadow.mapSize.x!==ms){sun.shadow.mapSize.set(ms,ms);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}
  gxShN=q>=8?1:(q>=6?2:3);o.every=gxShN;renderer.shadowMap.autoUpdate=gxShN<=1;renderer.shadowMap.needsUpdate=true;
  bloom.enabled=o.bloom;fxaa.enabled=true}catch(e){console.log('gx apply',e)}return o}
// auto: lower the internal render scale first (the upscaler hides it), then features, never the saved setting
function gxAuto(fps){const q0=gxQ;if(fps<27){gxGood=0;gxBad++;if(gxBad>=2){gxBad=0;if(gxDyn>.72)gxDyn=Math.max(.7,gxDyn-.1);else if(gxEff>4)gxEff--;else return gxEff;gxApply(gxEff)}}
 else if(fps>50){gxBad=0;gxGood++;if(gxGood>=4){gxGood=0;if(gxEff<q0){gxEff++;gxApply(gxEff)}else if(gxDyn<1){gxDyn=Math.min(1,gxDyn+.1);gxApply(gxEff)}}}else{gxBad=0;gxGood=0}return gxEff}
if(typeof uiApplyQ==='function'){try{if(uiS.auto&&uiS.q<8){uiS.q=8;uiSave()}}catch(e){}const u0=uiApplyQ;uiApplyQ=function(){u0();gxQ=uiS.q;gxDyn=1;gxApply(gxQ)};gxQ=uiS.q}
gxApply(gxQ);
MODS.push(function(dt){gxFrame++;const now=performance.now(),rt=Math.min(.5,(now-gxLast)/1000);gxLast=now;
 if(gxStats.measure){gxStats.calls=renderer.info.render.calls;gxStats.tris=renderer.info.render.triangles;renderer.info.reset()}
 try{if(typeof uiAutoBad!=='undefined')uiAutoBad=0}catch(e){}
 if(!document.hidden){gxWarm+=rt;gxAcc+=rt;gxN++;if(gxAcc>=1.5){const f=gxN/gxAcc;gxAcc=0;gxN=0;gxStats.fps=f;if(gxWarm>6&&state==='play'&&(typeof uiS==='undefined'||uiS.auto))gxAuto(f)}}
 try{const sa=dayT*Math.PI*2;skyU.sd.value.set(Math.cos(sa)*80,Math.sin(sa)*120,40)}catch(e){}
 if(gxUpOn&&composer.renderTarget1){const w=composer.renderTarget1.width,h=composer.renderTarget1.height;fxaa.uniforms.resolution.value.set(1/w,1/h)}
 if(gxChunks.length){gxPM.multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);gxFr.setFromProjectionMatrix(gxPM);const far=cam.far;
  for(const c of gxChunks){const d=c.sp.center.distanceTo(cam.position)-c.sp.radius;c.grp.visible=d<far;if(c.grp.visible&&c.inst.length){const v=gxFr.intersectsSphere(c.sp)||d<70;for(const m of c.inst)m.visible=v}}}
 gxLodTick(rt)});
// ----- options a settings menu can render -----
let gxSharpUser=null,gxBloomOn=true,gxShadowsOn=true;
const gxOptions=[
 {key:'upscale',label:'Upscaling (FSR-style)',type:'toggle',get:()=>!!(gxPass&&gxPass.enabled&&gxUpOn),set:v=>{if(!gxPass)return;gxPass.enabled=!!v;gxUpOn=!!v;gxApply(gxEff)}},
 {key:'scale',label:'Render scale',type:'slider',min:.5,max:1,step:.05,get:()=>gxScale,set:v=>{gxDyn=1;gxSetScale(v)}},
 {key:'sharp',label:'Sharpening',type:'slider',min:0,max:1,step:.05,get:()=>gxSharp,set:v=>{gxSharpUser=v;gxSharp=v}},
 {key:'bloom',label:'Bloom glow',type:'toggle',get:()=>bloom.enabled,set:v=>{gxBloomOn=!!v;bloom.enabled=!!v}},
 {key:'shadows',label:'Sun shadows',type:'toggle',get:()=>sun.castShadow,set:v=>{gxShadowsOn=!!v;sun.castShadow=!!v;renderer.shadowMap.needsUpdate=true}}];
{const a0=gxApply;gxApply=function(q){const o=a0(q);try{if(gxSharpUser!==null)gxSharp=gxSharpUser;if(!gxBloomOn)bloom.enabled=false;if(!gxShadowsOn)sun.castShadow=false}catch(e){}return o}}

// ----- far LOD: distant code-built people, cars and coins become instanced impostors (a few draw calls instead of thousands) -----
let gxLodPD=60,gxLodCD=85,gxImpOn=location.hash.indexOf('gxnoimp')<0;
const gxImp=(()=>{const vc=(g,r,gg,b)=>{g=g.index?g.toNonIndexed():g;for(const k of Object.keys(g.attributes))if(k!=='position'&&k!=='normal')g.deleteAttribute(k);const n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=r;a[i*3+1]=gg;a[i*3+2]=b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g};
 const mk=(geo,n,inst)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:inst==='car'?.3:0}),n);m.count=0;m.frustumCulled=false;m.castShadow=true;m.receiveShadow=true;
  m.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(n*3),3);scene.add(m);return m};
 const cap=(r,l,y,sx,sz)=>{const g=new THREE.CapsuleGeometry(r,l,2,6);g.scale(sx||1,1,sz||1);g.translate(0,y,0);return g};
 const up=U.mergeBufferGeometries([vc(cap(.24,.42,1.42,1.25,.75),1,1,1),vc(cap(.08,.62,1.38,1,1).translate(-.37,0,0),1,1,1),vc(cap(.08,.62,1.38,1,1).translate(.37,0,0),1,1,1)]);
 const lo=U.mergeBufferGeometries([vc(cap(.12,.78,.55),1,1,1).translate(-.13,0,0),vc(cap(.12,.78,.55),1,1,1).translate(.13,0,0)]);
 const hd=vc(new THREE.SphereGeometry(.2,8,6).translate(0,2.02,0),1,1,1);
 const car=U.mergeBufferGeometries([vc(new THREE.BoxGeometry(2.16,.56,4.3).translate(0,.66,0),1,1,1),vc(new THREE.BoxGeometry(1.8,.5,2.1).translate(0,1.2,.25),.22,.24,.27),
  ...[[-1,-1.38],[1,-1.38],[-1,1.38],[1,1.38]].map(w=>vc(new THREE.BoxGeometry(.3,.8,.8).translate(w[0],.4,w[1]),.06,.06,.06))]);
 return {up:mk(up,160),lo:mk(lo,160),hd:mk(hd,160),car:mk(car,160,'car')}})();
const gxSkin=new THREE.Color(.78,.58,.44),gxTmpC=new THREE.Color();
function gxMask(o,m){o.traverse(q=>{q.layers.mask=m})}
function gxLodTick(rt){gxLodT-=rt;const dec=gxLodT<=0;if(dec)gxLodT=.4;const P=cam.position;let np=0,nc=0;
 try{if(typeof rlPeople!=='undefined')for(const g of rlPeople){const u=g.userData,b=g.children[0];if(!b||g===player)continue;
  const far=gxImpOn&&g.parent===scene&&g.visible&&!u.av&&Math.hypot(g.position.x-P.x,g.position.z-P.z)>gxLodPD;
  if(dec&&far!==!!u.gxF){u.gxF=far;gxMask(b,far?2:1)}
  if(u.gxF&&np<160&&b.visible!==false){const m=g.matrixWorld;gxImp.up.setMatrixAt(np,m);gxImp.lo.setMatrixAt(np,m);gxImp.hd.setMatrixAt(np,m);
   if(!u.gxSC){const ch=b.children;u.gxSC=(ch[0]&&ch[0].material&&ch[0].material.color?ch[0].material.color:new THREE.Color(.5,.5,.55)).clone();u.gxPC=(ch[1]&&ch[1].material&&ch[1].material.color?ch[1].material.color:new THREE.Color(.2,.2,.25)).clone()}
   gxImp.up.setColorAt(np,u.gxSC);gxImp.lo.setColorAt(np,u.gxPC);gxImp.hd.setColorAt(np,gxSkin);np++}}}catch(e){}
 try{const lists=[cars,traffic];for(const L of lists)for(const e of L){const g=e.m;if(!g||!g.children[0]||g.children[0].geometry!==CAR.body)continue;const u=g.userData;
  const far=gxImpOn&&g.parent===scene&&g.visible&&!(typeof driving!=='undefined'&&driving&&driving.m===g)&&!(u.rl&&u.rl.visible)&&Math.hypot(g.position.x-P.x,g.position.z-P.z)>gxLodCD;
  if(dec&&far!==!!u.gxF){u.gxF=far;for(const ch of g.children)if(!ch.userData.rlKeep)gxMask(ch,far?2:1)}
  if(u.gxF&&nc<160){gxImp.car.setMatrixAt(nc,g.matrixWorld);gxImp.car.setColorAt(nc,g.children[0].material.color);nc++}
  if(dec&&u.rl&&!u.gxProx)gxProxy(u.rl,u)}}catch(e){}
 for(const k of['up','lo','hd'])gxImp[k].count=np;gxImp.car.count=nc;
 for(const k in gxImp){const m=gxImp[k];if(m.count){m.instanceMatrix.needsUpdate=true;m.instanceColor.needsUpdate=true}}}
// coins: one instanced draw instead of 140
const gxCoin=(()=>{try{const c0=coins[0];if(!c0)return null;const m=new THREE.InstancedMesh(c0.geometry,c0.material,coins.length);m.frustumCulled=false;m.castShadow=true;scene.add(m);for(const c of coins)c.layers.mask=2;return m}catch(e){return null}})();
MODS.push(function(){if(!gxCoin)return;let n=0;for(const c of coins)if(c.visible){c.updateMatrix();gxCoin.setMatrixAt(n++,c.matrix)}gxCoin.count=n;gxCoin.instanceMatrix.needsUpdate=true});

// the downloaded sports car is ~360k triangles: let a 30-triangle invisible stand-in cast its shadow instead (halves the shadow pass)
const gxProxMat=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}),gxProxGeo=U.mergeBufferGeometries([new THREE.BoxGeometry(1.9,.55,4.3).translate(0,.6,0).toNonIndexed(),new THREE.BoxGeometry(1.6,.45,1.9).translate(0,1.05,.15).toNonIndexed()]);
function gxProxy(rl,u){u.gxProx=true;const bb=new THREE.Box3().setFromObject(rl);rl.traverse(o=>{if(o.isMesh)o.castShadow=false});const m=new THREE.Mesh(gxProxGeo,gxProxMat);m.castShadow=true;m.renderOrder=-1;
 const inv=new THREE.Matrix4().copy(rl.matrixWorld).invert(),sz=bb.getSize(new THREE.Vector3()),c=bb.getCenter(new THREE.Vector3()).applyMatrix4(inv);m.position.set(c.x,0,c.z);rl.add(m)}
{const a1=gxApply;gxApply=function(q){const o=a1(q);try{const i=Math.max(1,Math.min(10,Math.round(q)))-1;if(typeof rlMaxCars!=='undefined'){rlMaxCars=[0,0,1,2,2,3,3,4,5,6][i];o.hdCars=rlMaxCars}if(typeof rlMaxPeople!=='undefined'){rlMaxPeople=[0,2,4,6,8,10,12,16,18,20][i];o.hdPeople=rlMaxPeople}gxLodPD=[35,40,45,50,55,60,60,65,70,75][i];gxLodCD=[50,55,60,70,75,80,85,90,100,110][i]}catch(e){}return o}}
gxApply(gxQ);
