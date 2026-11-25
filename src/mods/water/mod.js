// ---------- water: one sea shader (ripples, fresnel sky + sun, depth colour, foam, swell) and swimming ----------
// wtHeight(x,z,t) is the water surface height everywhere: the shader's vertex swell, boats and the swimmer all use it.
const wtY=.06,wtSX=HALF+41,wtEX=HALF+38.5,wtGX0=HALF+24,wtGZ0=-832,wtGC=1.625,wtNX=512,wtNZ=1024,wtDM=48,wtXMax=HALF+850,wtZMax=HALF+530,wtCarD=.9,wtNL=String.fromCharCode(10);
let wtD=null,wtMask=null,wtRow=0,wtReady=false,wtBuildT=1.5,wtAmp=.2;
let wtSwim=false,wtYc=0,wtVy=0,wtDive=0,wtBreath=1,wtProne=0,wtStroke=0,wtIn=false,wtRipT=0,wtFx=false,wtLateOn=false,wtScanT=0,wtLow=null,wtUW=false,wtCamK=0,wtDirty=false,wtWake=0,wtRipI=0,wtSurf=wtY,wtPrevOK=false;
const wtPrev=new THREE.Vector3(),wtSink=[],wtV=new THREE.Vector3(),wtUWC=new THREE.Color(),wtSave={};
function wtIsle(x,z){return typeof isIsleH==='function'?isIsleH(x,z):-1}
// is there open sea at this spot (bridges and piers stand over it, islands do not)
function wtSea(x,z){return x>wtSX&&x<wtXMax&&z>-wtZMax&&z<wtZMax&&wtIsle(x,z)<0}
function wtGridD(x,z){if(!wtReady)return wtDM;const fx=(x-wtGX0)/wtGC-.5,fz=(z-wtGZ0)/wtGC-.5;let ix=Math.floor(fx),iz=Math.floor(fz);const tx=fx-ix,tz=fz-iz;
 const x0=Math.max(0,Math.min(wtNX-1,ix)),x1=Math.max(0,Math.min(wtNX-1,ix+1)),z0=Math.max(0,Math.min(wtNZ-1,iz)),z1=Math.max(0,Math.min(wtNZ-1,iz+1));
 const a=wtD[z0*wtNX+x0],b=wtD[z0*wtNX+x1],c=wtD[z1*wtNX+x0],d=wtD[z1*wtNX+x1];return (a+(b-a)*tx)*(1-tz)+(c+(d-c)*tx)*tz}
// distance to the nearest shore (mainland beach or any island), metres
function wtShoreD(x,z){return Math.min(x-wtSX,wtGridD(x,z))}
function wtDepthAt(x,z){return Math.max(0,Math.min(7,wtShoreD(x,z)*.2))}
function wtSm(a,b,x){x=Math.max(0,Math.min(1,(x-a)/(b-a)));return x*x*(3-2*x)}
// surface height: flat by the shore, gentle swell offshore (keep in step with wtSwell in the vertex shader)
function wtHeight(x,z,t){if(x<wtSX)return wtY;const d=wtShoreD(x,z);if(d<5)return wtY;if(t===undefined)t=T;
 return wtY+wtAmp*wtSm(5,55,d)*(.8+.5*Math.sin(x*.06+z*.022+t*.55)+.3*Math.sin(-x*.021+z*.071+t*.43)+.2*Math.sin(x*.048-z*.052+t*.71))}
// ----- shore-distance field (R: land, G: piles and legs for foam), built a moment after start -----
const wtHF=!!(renderer.capabilities&&renderer.capabilities.isWebGL2&&THREE.DataUtils&&THREE.DataUtils.toHalfFloat),wtSC=wtHF?2:4,wtSD=wtHF?new Uint16Array(wtNX*wtNZ*2).fill(THREE.DataUtils.toHalfFloat(1)):new Uint8Array(wtNX*wtNZ*4).fill(255);
function wtEnc(v){return wtHF?THREE.DataUtils.toHalfFloat(v):Math.round(v*255)}
const wtST=new THREE.DataTexture(wtSD,wtNX,wtNZ,wtHF?THREE.RGFormat:THREE.RGBAFormat,wtHF?THREE.HalfFloatType:THREE.UnsignedByteType);wtST.magFilter=wtST.minFilter=THREE.LinearFilter;wtST.needsUpdate=true;
function wtBuild(){if(typeof isIsleH!=='function'){wtBuildT=2;return}
 if(!wtMask){wtMask=new Uint8Array(wtNX*wtNZ);wtRow=0}
 const end=Math.min(wtNZ,wtRow+40);for(let j=wtRow;j<end;j++){const z=wtGZ0+(j+.5)*wtGC;for(let i=22;i<wtNX;i++){if(isIsleH(wtGX0+(i+.5)*wtGC,z)>=0)wtMask[j*wtNX+i]=1}}
 wtRow=end;if(end<wtNZ){setTimeout(wtBuild,0);return}
 const N=wtNX*wtNZ,D=new Float32Array(N),W=wtNX,B=1e4,q=1.4142;let any=0;for(let i=0;i<N;i++){D[i]=wtMask[i]?0:B;any+=wtMask[i]}
 if(!any){wtMask=null;wtBuildT=3;return}
 for(let j=0;j<wtNZ;j++)for(let i=0;i<W;i++){const k=j*W+i;let v=D[k];if(v===0)continue;if(i>0&&D[k-1]+1<v)v=D[k-1]+1;if(j>0){if(D[k-W]+1<v)v=D[k-W]+1;if(i>0&&D[k-W-1]+q<v)v=D[k-W-1]+q;if(i<W-1&&D[k-W+1]+q<v)v=D[k-W+1]+q}D[k]=v}
 for(let j=wtNZ-1;j>=0;j--)for(let i=W-1;i>=0;i--){const k=j*W+i;let v=D[k];if(v===0)continue;if(i<W-1&&D[k+1]+1<v)v=D[k+1]+1;if(j<wtNZ-1){if(D[k+W]+1<v)v=D[k+W]+1;if(i<W-1&&D[k+W+1]+q<v)v=D[k+W+1]+q;if(i>0&&D[k+W-1]+q<v)v=D[k+W-1]+q}D[k]=v}
 for(let i=0;i<N;i++){const v=Math.max(0,Math.min(wtDM,D[i]*wtGC-wtGC*.5));D[i]=v;wtSD[i*wtSC]=wtEnc(v/wtDM)}
 // posts standing in the water: pier and marina piles, sea platform legs
 const P=[];try{if(typeof wdPX1!=='undefined')for(let x=wdPX1+2;x<=wdPX2;x+=6)for(const s of[-1,1])P.push([x,wdPZ+s*(x>wdPX2-14?7.3:3.9),.3])}catch(e){}
 try{if(typeof ldFloor==='function')for(let x=HALF+42;x<HALF+97;x+=9)for(const s of[-1,1])P.push([x,120+s*2.2,.3])}catch(e){}
 try{if(typeof isPlat!=='undefined')for(const s of[[-7,-7],[7,-7],[-7,7],[7,7]])P.push([isPlat[0]+s[0],isPlat[1]+s[1],1.2])}catch(e){}
 const G=new Float32Array(N).fill(1);for(const p of P){const ci=Math.floor((p[0]-wtGX0)/wtGC),cj=Math.floor((p[1]-wtGZ0)/wtGC);for(let j=cj-8;j<=cj+8;j++)for(let i=ci-8;i<=ci+8;i++){if(i<0||j<0||i>=wtNX||j>=wtNZ)continue;
   const d=Math.max(0,Math.hypot(wtGX0+(i+.5)*wtGC-p[0],wtGZ0+(j+.5)*wtGC-p[1])-p[2]),v=Math.min(1,d/12),k=j*wtNX+i;if(v<G[k]){G[k]=v;wtSD[k*wtSC+1]=wtEnc(v)}}}
 wtD=D;wtMask=null;wtReady=true;wtST.needsUpdate=true}
// ----- ripple normals (RG) and foam cells (B) in one small tiling texture -----
const wtNT=(()=>{const n=128,d=new Uint8Array(n*n*4),Wv=[],Pt=[];let s=11;const R=()=>{s=(s*16807)%2147483647;return s/2147483647};
 for(let k=0;k<16;k++){let fx=Math.round((R()*2-1)*(2+k*.8)),fz=Math.round((R()*2-1)*(2+k*.8));if(!fx&&!fz)fz=2;Wv.push([fx,fz,R()*6.2832,1/(1+Math.hypot(fx,fz)*.6)])}
 for(let k=0;k<22;k++)Pt.push([R(),R()]);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const u=x/n,v=y/n;let gx=0,gz=0;for(const w of Wv){const c=Math.cos((u*w[0]+v*w[1])*6.2832+w[2])*w[3];gx+=c*w[0];gz+=c*w[1]}
   gx*=.11;gz*=.11;const l=Math.hypot(gx,gz,1),i=(y*n+x)*4;d[i]=Math.round((-gx/l*.5+.5)*255);d[i+1]=Math.round((-gz/l*.5+.5)*255);
   let f1=9,f2=9;for(const p of Pt){let dx=Math.abs(u-p[0]),dz=Math.abs(v-p[1]);if(dx>.5)dx=1-dx;if(dz>.5)dz=1-dz;const q=Math.hypot(dx,dz);if(q<f1){f2=f1;f1=q}else if(q<f2)f2=q}
   const web=1-Math.min(1,(f2-f1)/.07),blob=Math.max(0,1-f1*6);d[i+2]=Math.round(Math.max(0,Math.min(1,web*.8+blob*.35))*255);d[i+3]=255}
 const t=new THREE.DataTexture(d,n,n,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=4;t.needsUpdate=true;return t})();
// ----- shader -----
const wtU={tN:{value:wtNT},tS:{value:wtST},uT:{value:0},uAmp:{value:wtAmp},uRain:{value:0},uEdge:{value:wtEX},uShoreX:{value:wtSX},uBeachZ:{value:HALF+197},uSdf:{value:new THREE.Vector4(wtGX0,wtGZ0,1/(wtNX*wtGC),1/(wtNZ*wtGC))},
 uTop:{value:new THREE.Color()},uBot:{value:new THREE.Color()},uSunDir:{value:new THREE.Vector3(0,1,0)},uSunCol:{value:new THREE.Color()},uShal:{value:new THREE.Color()},uDeep:{value:new THREE.Color()},uSand:{value:new THREE.Color()},uFoam:{value:new THREE.Color()},
 uFogC:{value:new THREE.Color()},uFogN:{value:120},uFogF:{value:262}};
const wtVS=['uniform float uT,uAmp,uEdge,uShoreX;uniform vec4 uSdf;uniform sampler2D tS;varying vec3 vW;varying vec2 vSl;',
 'void main(){vec4 w=modelMatrix*vec4(position,1.);vSl=vec2(0.);',
 '#ifndef POOL',
 'w.x=max(w.x,uEdge);float d=w.x-uShoreX;',
 '#ifndef LOW',
 'd=min(d,texture2D(tS,(w.xz-uSdf.xy)*uSdf.zw).r*48.);',
 '#endif',
 'float a=uAmp*smoothstep(5.,55.,d);float a1=w.x*.06+w.z*.022+uT*.55,a2=-w.x*.021+w.z*.071+uT*.43,a3=w.x*.048-w.z*.052+uT*.71;',
 'w.y+=a*(.8+.5*sin(a1)+.3*sin(a2)+.2*sin(a3));vSl=a*vec2(.03*cos(a1)-.0063*cos(a2)+.0096*cos(a3),.011*cos(a1)+.0213*cos(a2)-.0104*cos(a3));',
 '#endif',
 'vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}'].join(wtNL);
const wtFS=['uniform sampler2D tN,tS;uniform vec3 uTop,uBot,uSunDir,uSunCol,uShal,uDeep,uSand,uFoam,uFogC;uniform float uT,uRain,uFogN,uFogF,uShoreX,uBeachZ;uniform vec4 uSdf;varying vec3 vW;varying vec2 vSl;',
 'void main(){vec3 V=cameraPosition-vW;float dist=length(V);V/=dist;vec2 p=vW.xz;float dL=3.,dP=99.,dB=99.;',
 '#ifndef POOL',
 'float dM=vW.x-uShoreX,beach=step(abs(vW.z),uBeachZ);',
 'float lap=sin(uT*.7+vW.z*.045)*.75+sin(uT*1.13+vW.z*.11)*.35+.2;float dS=dM-lap*beach;if(dS<0.)discard;',
 'vec4 sd=texture2D(tS,(p-uSdf.xy)*uSdf.zw);dL=min(dS,sd.r*48.);dP=min(dL,sd.g*12.);dB=mix(99.,dS,beach);',
 '#endif',
 'vec4 n1=texture2D(tN,p*.047+uT*vec2(.021,.013));',
 '#ifdef LOW',
 'vec2 g=(n1.xy-.5)*1.9;float fn=n1.b;',
 '#else',
 'vec4 n2=texture2D(tN,p*.123+uT*vec2(-.031,.036));vec4 n3=texture2D(tN,p*.0113+uT*vec2(.004,-.006));vec2 g=(n1.xy-.5)*1.5+(n2.xy-.5)*(.8+uRain*1.6)+(n3.xy-.5)*1.5;',
 'float fn=texture2D(tN,p*.083+uT*vec2(.012,.02)).b;',
 '#endif',
 'float ns=(.52+uRain*.3)/(1.+dist*.016);vec3 N=normalize(vec3(g.x*ns-vSl.x,1.,g.y*ns-vSl.y));',
 'if(!gl_FrontFacing){vec3 uc=mix(uShal*1.5+uTop*.25,uFogC,smoothstep(2.,26.,dist));gl_FragColor=vec4(uc+N.x*.03,1.);return;}',
 'float ndv=max(dot(N,V),0.);float F=.02+.66*pow(1.-ndv,5.);',
 'vec3 R=reflect(-V,N);R.y=abs(R.y);vec3 sky=mix(uBot,uTop,clamp(R.y*1.5+.28,0.,1.));',
 'float sp=max(dot(R,uSunDir),0.);',
 '#ifdef LOW',
 'vec3 spec=uSunCol*pow(sp,90.)*.35;',
 '#else',
 'float s2=sp*sp;s2*=s2;s2*=s2;s2*=s2;vec3 spec=uSunCol*(pow(s2,14.)+s2*s2*.035);',
 '#endif',
 'float k=1.-exp(-max(dL,0.)/10.);vec3 body=mix(uShal,uDeep,k);body*=.82+.36*ndv;',
 'body=mix(uSand,body,smoothstep(-.3,2.6,dB));F*=smoothstep(0.,1.6,dB)*.6+.4;',
 'vec3 col=mix(body,sky,F)+spec;',
 '#ifndef POOL',
 'float e=1.-smoothstep(0.,1.7,dP);',
 '#ifdef LOW',
 'float fo=smoothstep(.4,.8,e*(.5+fn));',
 '#else',
 'float ln=smoothstep(.8,1.,fract(dL*.15+uT*.2))*(1.-smoothstep(2.5,13.,dL))*smoothstep(.2,1.6,dL);float fo=smoothstep(.38,.8,(e+ln*.75)*(.42+fn*.95));',
 '#endif',
 'col=mix(col,uFoam,fo*.92);',
 '#endif',
 'col=mix(col,uFogC,smoothstep(uFogN,uFogF,dist));gl_FragColor=vec4(col,1.);}'].join(wtNL);
function wtMat(defs){return new THREE.ShaderMaterial({uniforms:wtU,vertexShader:wtVS,fragmentShader:wtFS,defines:defs,side:THREE.DoubleSide})}
const wtMHi=wtMat({}),wtMLow=wtMat({LOW:1}),wtMPool=wtMat({POOL:1});
const wtGN=72,wtGeo=new THREE.PlaneGeometry(1,1,wtGN,wtGN);wtGeo.rotateX(-Math.PI/2);
const wtMesh=new THREE.Mesh(wtGeo,wtMHi);wtMesh.frustumCulled=false;wtMesh.position.y=wtY;wtMesh.userData.wt=1;scene.add(wtMesh);
// ----- foam patches under boats and expanding ripple rings: one instanced draw -----
const wtRN=40,wtRB=16,wtRipTex=canvasTex(64,64,g=>{g.fillStyle='#000';g.fillRect(0,0,64,64);const im=g.getImageData(0,0,64,64);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const r=Math.hypot(x-31.5,y-31.5)/31.5,an=Math.atan2(y-31.5,x-31.5),v=Math.max(0,1-Math.abs(r-.78)/.18)*(.62+.38*Math.sin(an*5+1)*Math.sin(an*3))+Math.max(0,1-r/.75)*.16,i=(y*64+x)*4;im.data[i]=im.data[i+1]=im.data[i+2]=Math.round(Math.min(1,v)*(r<1?255:0));im.data[i+3]=255}g.putImageData(im,0,0)});
const wtRipGeo=new THREE.PlaneGeometry(1,1);wtRipGeo.rotateX(-Math.PI/2);
const wtRipMesh=new THREE.InstancedMesh(wtRipGeo,new THREE.MeshBasicMaterial({map:wtRipTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),wtRN);wtRipMesh.frustumCulled=false;wtRipMesh.renderOrder=1;scene.add(wtRipMesh);
const wtRips=[],wtDum=new THREE.Object3D(),wtCol=new THREE.Color();for(let i=0;i<wtRN;i++){wtRips.push({t:9,L:1,x:0,z:0,r0:1,r1:2,s:0});wtDum.position.set(0,-50,0);wtDum.scale.setScalar(.001);wtDum.updateMatrix();wtRipMesh.setMatrixAt(i,wtDum.matrix);wtRipMesh.setColorAt(i,wtCol.setRGB(0,0,0))}
function wtRipple(x,z,r0,r1,life,str){const r=wtRips[wtRB+(wtRipI++%(wtRN-wtRB))];r.t=0;r.L=life;r.x=x;r.z=z;r.r0=r0;r.r1=r1;r.s=str}
function wtSplash(x,z,k){const y=wtHeight(x,z,T);wtV.set(x,y+.15,z);burst(wtV,Math.round(8+k*18),0xe4f3ff,3+k*6,.3+k*.25,.5+k*.4,1);sfx(.25+k*.4,900+k*500,.25+k*.45);if(k>.5)sfx(.2,2600,.2);wtRipple(x,z,.6,3+k*4,1.3+k,.5+k*.4);if(k>.4)wtRipple(x,z,.3,2+k*2,1.9+k,.4)}
// ----- on-screen: underwater tint and a thin breath bar (only while under) -----
const wtOv=document.createElement('div');wtOv.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:3;opacity:0;transition:opacity .25s;background:radial-gradient(ellipse at 50% 35%,rgba(20,120,150,.38),rgba(4,40,80,.72))';document.body.appendChild(wtOv);
const wtBar=document.createElement('div');wtBar.style.cssText='position:fixed;left:50%;bottom:24%;width:84px;height:5px;margin-left:-42px;border-radius:3px;background:rgba(0,0,0,.35);pointer-events:none;z-index:4;display:none';const wtBarI=document.createElement('div');wtBarI.style.cssText='height:100%;width:100%;border-radius:3px;background:#7fd4ff';wtBar.appendChild(wtBarI);document.body.appendChild(wtBar);
// ----- base hooks (see mod.py): floor under the player and walking / swimming speed -----
function wtFloorY(){if(wtSwim)return -60;if(driving||!wtSea(pos.x,pos.z))return .3;return .3-wtDepthAt(pos.x,pos.z)}
function wtSpd(){if(wtSwim)return fireId!==null?5.8:3.6;if(pos.y<.22)return 10-Math.min(1,(.3-pos.y)/1.2)*5.5;return 10}
// solid ground or deck next to the swimmer (beach, island, bridge ramp, pier, dock)
let wtPier0=null;
function wtLand(x,z){if(x<=wtSX)return .3;let h=-1;try{if(typeof isLandAt==='function')h=Math.max(h,isLandAt(x,z));if(wtPier0)h=Math.max(h,wtPier0(x,z));if(typeof ldFloor==='function'){const f=ldFloor(x,z);if(f>0)h=Math.max(h,f)}}catch(e){}return h}
function wtLedge(){const fa=facing;for(const r of[1.3,2.1,2.9])for(const o of[0,.5,-.5,1,-1,1.6,-1.6,2.3,-2.3,3.14]){const a=fa+o,x=pos.x-Math.sin(a)*r,z=pos.z-Math.cos(a)*r,h=wtLand(x,z);if(h>=0&&h<wtSurf+2.5)return [x,Math.max(.3,h),z]}return null}
function wtStop(){wtSwim=false;wtDive=0;wtBar.style.display='none'}
// the player may cross into open water; rails on piers, docks and bridges still hold unless he jumps them
function wtSolids(p,r,maxH){let res=false;for(const s of solids){if(maxH!==undefined&&p.y>s.h)continue;const cx=Math.max(s.minX,Math.min(p.x,s.maxX)),cz=Math.max(s.minZ,Math.min(p.z,s.maxZ)),dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;if(d2<r*r){const d=Math.sqrt(d2)||1e-4;if(d2===0)p.x+=r;else{p.x+=dx/d*(r-d);p.z+=dz/d*(r-d)}res=true}}return res}
{const c0=collide;collide=function(p,r,maxH){if(p!==pos||driving||state!=='play')return c0(p,r,maxH);const ox=p.x,oz=p.z;
  if(!wtSea(ox,oz)){const res=c0(p,r,maxH);if(wtPrevOK&&wtSea(wtPrev.x,wtPrev.z)&&Math.hypot(p.x-ox,p.z-oz)>1.5){p.x=wtPrev.x;p.z=wtPrev.z}return res}
  const res=c0(p,r,maxH);if(Math.abs(p.x-ox)<.002&&Math.abs(p.z-oz)<.002)return res;
  if(!wtSwim){const h=wtPrevOK?wtLand(wtPrev.x,wtPrev.z):-1;if(wtPrevOK&&wtPrev.x>wtSX&&h>=.5&&p.y<h+.45)return res}
  p.x=Math.min(wtXMax-2,ox);p.z=Math.max(-wtZMax+2,Math.min(wtZMax-2,oz));return wtSolids(p,r,maxH)}}
// no weapons in the water (holding FIRE is the fast stroke instead)
{const s0=shoot;shoot=function(){if(wtSwim)return;s0()};const t0=tapShoot;tapShoot=function(x,y){if(wtSwim)return;t0(x,y)}}
// fixes sinks any car past the waterline: let it through the shallows, the deep end is handled here
if(typeof wdPierH==='function'){wtPier0=wdPierH;wdPierH=function(x,z){const h=wtPier0(x,z);if(h>=0||!wtFx)return h;return wtSea(x,z)&&wtDepthAt(x,z)<=wtCarD+.4?0:h}}
// jump overboard anywhere (near a beach or island shore the older handlers still put you ashore)
MODS.unshift(function(){if(!(carQ&&driving&&state==='play'&&driving.vhT==='boat'))return;const m=driving.m,p=m.position;if(p.x<=HALF+53)return;
 try{if(typeof isNearShore==='function'){const s=isNearShore(p.x,p.z);if(s&&isLandAt(s.x,s.z)>=0)return}}catch(e){}
 carQ=false;const ry=m.rotation.y;let x=p.x+Math.cos(ry)*2.6,z=p.z-Math.sin(ry)*2.6;if(!wtSea(x,z)){x=p.x-Math.cos(ry)*2.6;z=p.z+Math.sin(ry)*2.6}
 driving.speed=0;driving=null;player.visible=true;pos.set(x,wtY+.5,z);vel.set(0,-3,0);onGround=false});
// ----- swim pose: the realistic avatar (bones) and the code-built body (limb groups) -----
function wtPoseRl(a){const B=a.B,pr=wtProne,ph=wtStroke,P=(b,c,f,up,r,w)=>rlPoint(B[b],B[c],rlDir(f,up,r),w===undefined?1:w);
 a.wtOn=1;a.w.rotation.x=-1.2*pr;a.w.position.z=1.05*pr;if(a.gun)a.gun.visible=false;
 for(const s of[-1,1]){const k=s<0?'L':'R',q=ph+(s>0?Math.PI:0),tr=1-pr;
  if(tr>.02){const w=Math.sin(T*2.6+s)*.25;P(k+'_UpperArm',k+'_Forearm',.3+w,-.3,s*.85,tr);P(k+'_Forearm',k+'_Hand',.75-w,-.05+w*.5,s*.45,tr);P(k+'_Thigh',k+'_Calf',.28*Math.sin(T*3.4+s*1.6),-1,s*.16,tr);P(k+'_Calf',k+'_Foot',-.25+.2*Math.sin(T*3.4+s*1.6+1),-1,0,tr)}
  if(pr>.02){const c=Math.cos(q),sn=Math.sin(q);P(k+'_UpperArm',k+'_Forearm',c,sn*.85-.1,s*.22,pr);P(k+'_Forearm',k+'_Hand',Math.cos(q+.35),Math.sin(q+.35)*.85-.1,s*.1,pr);
   const fl=Math.sin(ph*2+(s>0?Math.PI:0))*.26;P(k+'_Thigh',k+'_Calf',-1,fl-.05,s*.08,pr);P(k+'_Calf',k+'_Foot',-1,-fl*.8+.05,s*.08,pr)}}
 if(pr>.02&&B.Head)rlTwist(B.Head,rlR,.75*pr)}
if(typeof rlPose==='function'){const p0=rlPose;rlPose=function(a,dt){p0(a,dt);if(a.g===player){if(wtSwim||wtProne>.02){try{wtPoseRl(a)}catch(e){}}else if(a.wtOn){a.wtOn=0;a.w.rotation.x=0;a.w.position.z=0}}}}
function wtBody(){const b=player.children[0],u=player.userData;if(!b||!u.armL)return;
 if(wtSwim||wtProne>.02){wtDirty=true;const pr=wtProne,ph=wtStroke;b.rotation.x=-1.2*pr;b.position.z=1.05*pr;const tw=Math.sin(T*2.6)*.3;
  u.armL.rotation.x=(-1.6+1.45*Math.sin(ph))*pr+(-.9+tw)*(1-pr);u.armR.rotation.x=(-1.6-1.45*Math.sin(ph))*pr+(-.9-tw)*(1-pr);const lg=Math.sin(ph*2)*.4*pr+Math.sin(T*3.4)*.3*(1-pr);u.legL.rotation.x=lg;u.legR.rotation.x=-lg}
 else if(wtDirty){wtDirty=false;b.rotation.x=0;b.position.z=0}}
// ----- after the camera is placed: follow a dive under the surface, underwater look -----
function wtCam(dt){wtBody();if(state!=='play'&&!wtUW)return;
 const under=wtSwim&&wtYc<wtSurf-1.95;wtCamK+=((under?1:0)-wtCamK)*Math.min(1,dt*5);
 if(wtCamK>.02&&wtSwim){const cy=Math.min(wtSurf-.4,pos.y+1.7+Math.sin(camPitch)*3.5);cam.position.y+=(cy-cam.position.y)*wtCamK;cam.lookAt(pos.x,pos.y+1.1,pos.z)}
 const cp=cam.position,uw=state==='play'&&cp.y<wtHeight(cp.x,cp.z,T)-.03&&wtSea(cp.x,cp.z);
 if(uw!==wtUW){wtUW=uw;wtOv.style.opacity=uw?1:0;const f=scene.fog;
  if(uw){wtSave.n=f.near;wtSave.f=f.far;wtSave.sky=sky.visible;wtSave.st=stars.visible;wtSave.bg=scene.background;sky.visible=false;stars.visible=false;scene.background=wtUWC;sfx(.5,300,.35)}
  else{f.near=wtSave.n;f.far=wtSave.f;sky.visible=wtSave.sky;stars.visible=wtSave.st;scene.background=wtSave.bg}}
 if(uw){const f=scene.fog;wtUWC.copy(wtU.uShal.value).multiplyScalar(.55);f.color.copy(wtUWC);f.near=.5;f.far=30;wtU.uFogC.value.copy(wtUWC);wtU.uFogN.value=.5;wtU.uFogF.value=30}}
if(typeof lfCam==='function'){const c0=lfCam;lfCam=function(dt){c0(dt);try{wtCam(dt)}catch(e){}}}
function wtLate(){wtFx=false}
// ----- per frame: look -----
function wtOnDeck(x,z){try{if(typeof isLandAt==='function'&&isLandAt(x,z)>=0)return true;if(wtPier0&&wtPier0(x,z)>=0)return true;if(typeof ldFloor==='function'&&ldFloor(x,z)>0)return true}catch(e){}return false}
function wtVis(dt){const u=wtU,sunA=dayT*Math.PI*2,sunH=Math.sin(sunA),day=Math.max(0,Math.min(1,sunH*3+.5)),night=1-day,wet=typeof rain==='number'?rain:0,cp=cam.position;
 wtBuildT-=dt;if(!wtReady&&!wtMask&&wtBuildT<=0){wtBuildT=4;try{wtBuild()}catch(e){wtMask=null}}
 wtScanT-=dt;if(wtScanT<=0){wtScanT=T<40?1:5;
  try{if(typeof wdWater!=='undefined'&&wdWater)wdWater.visible=false;if(typeof wdFoam!=='undefined'&&wdFoam)wdFoam.visible=false;if(typeof wdOldSea!=='undefined'&&wdOldSea)wdOldSea.visible=false}catch(e){}
  const chk=o=>{if(!o.isMesh||o.userData.wt||!o.geometry)return;const g=o.geometry,p=g.parameters;if(!p)return;
   if(g.type==='PlaneGeometry'&&p.width>=600&&o.position.x>HALF&&o.position.y<1&&o.visible)o.visible=false;
   else if(g.type==='CylinderGeometry'&&p.radiusTop===3.6&&p.height===.2&&o.material!==wtMPool){o.material=wtMPool;o.userData.wt=1}};
  for(const o of scene.children){if(o.isMesh)chk(o);else if(o.isGroup&&!o.userData.gx&&o.children.length<40)for(const q of o.children)chk(q)}
  let q=8;try{q=gxEff}catch(e){}const low=q<=3;if(low!==wtLow){wtLow=low;wtMesh.material=low?wtMLow:wtMHi}}
 u.uT.value=T;u.uRain.value=wet;wtAmp=.2+wet*.08;u.uAmp.value=wtAmp;u.uTop.value.copy(skyU.top.value);u.uBot.value.copy(skyU.bot.value);
 const f=scene.fog;u.uFogC.value.copy(f.color);u.uFogN.value=f.near;u.uFogF.value=f.far;
 const L=(.04+.96*day)*(1-wet*.35),tp=skyU.top.value;u.uShal.value.setRGB(.05*L+tp.r*.08,.47*L+tp.g*.1,.45*L+tp.b*.1);u.uDeep.value.setRGB(.008*L+tp.r*.05,.075*L+tp.g*.06,.19*L+tp.b*.07);u.uSand.value.setRGB(.6*L,.5*L,.28*L);
 const fl=(.07+.93*day)*(1-wet*.25);u.uFoam.value.setRGB(.92*fl,.95*fl,fl);
 if(sunH>-.04){const k=Math.max(0,Math.min(1,sunH*2.2)),fs=(1-wet*.93)*wtSm(-.04,.06,sunH)*2.2;u.uSunDir.value.set(Math.cos(sunA)*80,Math.max(.5,sunH*120),40).normalize();u.uSunCol.value.setRGB(9*fs,(3.2+4.6*k)*fs,(1+4.2*k)*fs)}
 else{const fm=(.4+night*1.3)*(1-wet*.9)*.85;u.uSunDir.value.set(-Math.cos(sunA)*80,Math.max(.5,-sunH*45),-90).normalize();u.uSunCol.value.setRGB(fm*.8,fm*.9,fm)}
 const k=Math.max(1,cam.far/266),S=680*k,cell=S/wtGN;wtMesh.visible=cp.x<HALF+1700&&cp.x+S*.5>wtEX;wtMesh.scale.set(S,1,S);wtMesh.position.set(Math.round(cp.x/cell)*cell,wtY,Math.round(cp.z/cell)*cell);
 // foam patches under boats, wake behind the one that moves, ripple rings
 let dirty=false;const boats=typeof vhBoats!=='undefined'?vhBoats:null;
 for(let i=0;i<wtRB;i++){const b=boats&&boats[i],on=b&&!b.dead&&b.m.visible&&Math.abs(b.m.position.x-cp.x)<240&&Math.abs(b.m.position.z-cp.z)<240&&b.m.position.y<1.2;
  if(on){const m=b.m,sp=Math.min(1,Math.abs(b.speed||0)/20),w=(b.isMax&&b.isMax<20)?2.6:4.4;wtDum.position.set(m.position.x,wtHeight(m.position.x,m.position.z,T)+.035,m.position.z);wtDum.rotation.set(0,m.rotation.y,0);wtDum.scale.set(w*(1+sp*.25),1,w*1.9*(1+sp*.5));wtDum.updateMatrix();wtRipMesh.setMatrixAt(i,wtDum.matrix);wtRipMesh.setColorAt(i,wtCol.setScalar((.16+sp*.4)*fl));b.wtOn=1;dirty=true}
  else if(b&&b.wtOn){b.wtOn=0;wtRipMesh.setColorAt(i,wtCol.setRGB(0,0,0));dirty=true}}
 for(let i=wtRB;i<wtRN;i++){const r=wtRips[i];if(r.t>r.L)continue;r.t+=dt;const q=Math.min(1,r.t/r.L),rad=(r.r0+(r.r1-r.r0)*Math.sqrt(q))*2.3;wtDum.position.set(r.x,wtHeight(r.x,r.z,T)+.04,r.z);wtDum.rotation.set(0,0,0);wtDum.scale.set(rad,1,rad);wtDum.updateMatrix();wtRipMesh.setMatrixAt(i,wtDum.matrix);wtRipMesh.setColorAt(i,wtCol.setScalar(r.t>r.L?0:r.s*(1-q)*fl));dirty=true}
 if(dirty){wtRipMesh.instanceMatrix.needsUpdate=true;if(wtRipMesh.instanceColor)wtRipMesh.instanceColor.needsUpdate=true}
 if(boats)for(const b of boats){if(b.dead)continue;const m=b.m,p=m.position;if(p.y>1.2||Math.abs(p.x-cp.x)>300)continue;const h=wtHeight(p.x,p.z,T)-wtY;if(h!==0){p.y+=h;const sy=Math.sin(m.rotation.y),cy=Math.cos(m.rotation.y);m.rotation.x+=(wtHeight(p.x-sy*2,p.z-cy*2,T)-wtHeight(p.x+sy*2,p.z+cy*2,T))*.22}}
 const c=driving;if(c&&c.vhT==='boat'&&Math.abs(c.speed)>6){wtWake-=dt;if(wtWake<=0){wtWake=.16;const m=c.m,sy=Math.sin(m.rotation.y),cy=Math.cos(m.rotation.y);wtRipple(m.position.x+sy*2.4,m.position.z+cy*2.4,1.2,3.4+Math.abs(c.speed)*.08,1.6,.4)}}}
// ----- per frame: swimming, cars and people in the water -----
function wtTick(dt){if(!wtLateOn){wtLateOn=true;MODS.push(wtLate)}
 wtVis(dt);const play=state==='play';
 const sea=!driving&&wtSea(pos.x,pos.z);wtSurf=sea?wtHeight(pos.x,pos.z,T):wtY;const surf=wtSurf;
 if(wtSwim&&(!play||driving||!sea))wtStop();
 if(play&&!driving&&sea){const dep=wtDepthAt(pos.x,pos.z),fl=.3-dep,inW=pos.y<surf-.5;
  if(inW!==wtIn){wtIn=inW;if(inW)wtSplash(pos.x,pos.z,Math.max(.12,Math.min(1,-vel.y/14)))}
  if(!wtSwim&&pos.y<surf-1.25&&fl<surf-1.3&&!wtOnDeckLift()){wtSwim=true;wtYc=pos.y;wtVy=Math.max(-8,Math.min(0,vel.y*.45));wtDive=0;wtStroke=0}
  if(wtSwim){onGround=false;const mv=Math.hypot(vel.x,vel.z);wtProne+=((mv>1.1?1:0)-wtProne)*Math.min(1,dt*3.5);wtStroke+=dt*(2+mv*1.3);
   let out=false;
   if(jumpQ){jumpQ=false;const Ld=wtLedge();if(Ld){wtStop();wtSplash(pos.x,pos.z,.25);pos.set(Ld[0],Ld[1]+.06,Ld[2]);vel.set(0,0,0);onGround=true;out=true}else if(wtDive<=0&&wtBreath>.25){wtDive=1.8;sfx(.3,500,.35)}}
   if(!out){let ty=surf-1.3+wtProne*.98;if(wtDive>0){wtDive-=dt;ty=Math.max(fl+.2,surf-3.7)}
    const under=wtYc<surf-2.05;wtBreath=under?Math.max(0,wtBreath-dt/9):Math.min(1,wtBreath+dt/2.5);if(wtBreath<=0)wtDive=0;
    wtBar.style.display=wtBreath<.995?'block':'none';if(wtBreath<.995)wtBarI.style.width=Math.round(wtBreath*100)+'%';
    wtVy+=((ty-wtYc)*16-wtVy*5)*dt;wtYc+=wtVy*dt;if(wtYc<fl){wtYc=fl;wtVy=Math.max(0,wtVy)}
    if(fl>surf-1.2&&wtDive<=0){wtStop();pos.y=Math.max(fl,wtYc);vel.y=0}
    else{vel.y=30*dt+1.6;pos.y=wtYc-1.6*dt;
     if(mv>.8&&!under){wtRipT-=dt*(.6+mv*.25);if(wtRipT<=0){wtRipT=.5;wtRipple(pos.x,pos.z,.4,1.8+mv*.25,1.2,.3);if(mv>4.5){wtV.set(pos.x,surf+.1,pos.z);burst(wtV,3,0xe4f3ff,2.5,.22,.4,1);sfx(.12,1800,.08)}}}
     else if(!under){wtRipT-=dt;if(wtRipT<=0){wtRipT=1.3;wtRipple(pos.x,pos.z,.4,1.5,1.5,.18)}}}}}
  else if(inW&&Math.hypot(vel.x,vel.z)>2){wtRipT-=dt;if(wtRipT<=0){wtRipT=.45;wtRipple(pos.x,pos.z,.3,1.4,1,.25);if(Math.random()<.5)sfx(.1,1500,.06)}}}
 else wtIn=false;
 if(!wtSwim){wtProne+=(0-wtProne)*Math.min(1,dt*7);if(wtBreath<1)wtBreath=Math.min(1,wtBreath+dt/2.5)}
 wtPrev.copy(pos);wtPrevOK=play&&!driving;
 // a car driven into the sea: slows in the shallows, floods and sinks in the deep; the driver swims
 const c=driving;
 if(c&&play&&!c.vhT&&!c.custom){const m=c.m,k=m.userData.kind,p=m.position;if(k!=='heli'&&k!=='boat'&&k!=='plane'&&wtSea(p.x,p.z)&&!wtOnDeck(p.x,p.z)){const dep=wtDepthAt(p.x,p.z);
   if(dep>.12){c.speed*=Math.pow(.3,dt*Math.min(1,dep*1.5));if(Math.abs(c.speed)>4&&Math.random()<.5){wtV.set(p.x+(Math.random()-.5)*2,.3,p.z+(Math.random()-.5)*2);burst(wtV,2,0xe4f3ff,4,.3,.5,1)}}
   if(dep>wtCarD){wtSplash(p.x,p.z,1);c.dead=true;c.speed=0;wtSink.push({m:m,t:0,y:p.y});driving=null;player.visible=true;pos.set(p.x,wtY+.2,p.z);vel.set(0,0,0);onGround=false;toast('Your car sank!')}}}
 for(let i=wtSink.length-1;i>=0;i--){const s=wtSink[i],m=s.m;s.t+=dt;m.position.y=s.y-Math.min(3.2,s.t*s.t*.35);m.rotation.x-=dt*.09;m.rotation.z+=dt*.06;if(s.t<3&&Math.random()<dt*9){wtV.set(m.position.x+(Math.random()-.5)*2,wtY+.1,m.position.z+(Math.random()-.5)*3);burst(wtV,1,0xe4f3ff,1.2,.2,.5,1)}if(s.t>3.4){m.visible=false;wtSink.splice(i,1)}}
 // police cars stop at the deep water; people on foot wade, then float
 for(const pc of police){const p=pc.m.position;if(wtSea(p.x,p.z)&&wtDepthAt(p.x,p.z)>wtCarD&&!wtOnDeck(p.x,p.z)){if(pc.wtX!==undefined){p.x=pc.wtX;p.z=pc.wtZ}pc.speed=0}else{pc.wtX=p.x;pc.wtZ=p.z}}
 for(const s of shooters){if(s.dead)continue;const g=s.g,p=g.position;if(p.x>wtSX&&p.y<.5&&wtSea(p.x,p.z)){const dep=wtDepthAt(p.x,p.z);p.y=dep>1.35?wtHeight(p.x,p.z,T)-1.4+Math.sin(T*2+p.x)*.05:.3-dep}}
 wtFx=true}
function wtOnDeckLift(){return false}
MODS.push(wtTick);
