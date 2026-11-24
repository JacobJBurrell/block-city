window.__au={an:{},pk:{},siren(){sirenTick(1);return !!auSir},whoosh(){const t=traffic.find(t=>!t.dead);t.auIn=false;auWhoCD=0;pos.set(t.m.position.x+3,.3,t.m.position.z+3);return 1},touch(){const r=auBtn.getBoundingClientRect(),o={identifier:7,target:auBtn,clientX:r.left+20,clientY:r.top+20},t=new Touch(o),b=auR.st;auBtn.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,cancelable:true,changedTouches:[t],touches:[t],targetTouches:[t]}));auBtn.dispatchEvent(new TouchEvent('touchend',{bubbles:true,cancelable:true,changedTouches:[t],touches:[],targetTouches:[]}));return {before:b,after:auR.st,look:look.id,joy:joy.id,fire:fireId,lock:!!lockObj,tapT:tapT>0,burst:burstN}},norender(){composer.render=()=>{};drawMap=()=>{}},
 tap(){if(!AC)return 'noAC';auInit();const nodes=Object.assign({master:auMaster,out:auOut},auBus),z=AC.createGain();z.gain.value=0;z.connect(AC.destination);for(const k in nodes){const p=AC.createScriptProcessor(1024,1,1);this.pk[k]=0;p.onaudioprocess=e=>{const d=e.inputBuffer.getChannelData(0);let m=this.pk[k];for(let i=0;i<d.length;i++){const v=Math.abs(d[i]);if(v>m)m=v}this.pk[k]=m};nodes[k].connect(p);p.connect(z);this.an[k]=p}return AC.state},
 peaks(){const o={};for(const k in this.pk){o[k]=+this.pk[k].toFixed(3);this.pk[k]=0}return o},
 gun(i){WEAP[i].ammo=Math.max(WEAP[i].ammo,5);wi=i;shoot();return WEAP[i].n},
 boom(){explode(new THREE.Vector3(pos.x+14,1,pos.z))},
 drive(){const c=cars.find(c=>!c.dead);pos.set(c.m.position.x+2.5,.3,c.m.position.z);carQ=true},
 joy(x,y){joy.x=x;joy.y=y},exit(){carQ=true},radio(){auBtn.click();return auR.st},
 st(){return {drv:!!driving,spd:driving?+driving.speed.toFixed(1):0,st:auR.st,acs:AC&&AC.state,rain:+rain.toFixed(2),btn:auBtn.style.display,lbl:auBtn.textContent,wanted,rpm:+auEng.rpm.toFixed(2),gear:auEng.gear}},
 rain(v){rainTarget=v;rain=v},wanted(){wantedScore=4},toast(s){toast(s)},kind(k){if(driving)driving.m.userData.kind=k},hp(){hp=100;armor=100},
 walk(x,y){joy.x=x;joy.y=y},jump(){jumpQ=true},radioOff(){auR.st=4}
};
