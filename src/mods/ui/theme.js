// ---------- ui theme: ONE design system for every on-screen surface (HUD, title, settings, phone, panels, map, account) ----------
// Tokens are CSS custom properties (--bc-*) on :root/body; everything below restyles the existing ids and classes, so behaviour code is untouched.
// Type scale: cap 10.5, xs 11.5, sm 12.5, md 14, lg 17, xl 21, 2xl 28 (px). Radii: xs 8, sm 12, md 16, lg 22, pill. Spacing: 4/8/12/16/20/24.
// Colours: one accent (yellow), ok / warn / danger / info, cash green; surfaces: glass (HUD, blurred), panel (menus), raise (rows/inputs), lines.
// --bc-k scales the HUD and menus up on big screens (1.12 on a laptop, 1.4 at 1080p); phones stay at 1.
const uiThI={menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M11 18.6h2"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21c1.4-4 4.2-6 7.5-6s6.1 2 7.5 6"/>',sliders:'<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
 acct:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.6 18.4c1.4-1.9 3.2-2.9 5.4-2.9s4 1 5.4 2.9"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6h.01"/>',chev:'<path d="M9 6l6 6-6 6"/>'};
const uiThIco=(d,cls)=>'<i'+(cls?' class="'+cls+'"':'')+' style="background-image:'+uiIc(d).split('"').join('&quot;')+'"></i>';
{const I='!important',c=[],GL='background:var(--bc-glass);-webkit-backdrop-filter:var(--bc-blur);backdrop-filter:var(--bc-blur);',
 PRI='background:linear-gradient(180deg,#ffe489 0%,var(--bc-accent) 52%,var(--bc-accent-2) 100%)'+I+';color:var(--bc-on-accent)'+I+';border-color:transparent'+I+';box-shadow:0 8px 22px rgba(255,190,40,.22),inset 0 1px 0 rgba(255,255,255,.55)'+I,
 SEC='background:var(--bc-raise-2)'+I+';color:var(--bc-text)'+I+';border:1px solid var(--bc-line-2)'+I+';box-shadow:none'+I,
 DNG='background:rgba(255,69,58,.1)'+I+';color:#ff8a80'+I+';border:1px solid rgba(255,69,58,.45)'+I+';box-shadow:none'+I;
 // ===== tokens =====
 c.push(':root,html body{--bc-font:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI Variable Text","Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;'
  +'--bc-fs-cap:10.5px;--bc-fs-xs:11.5px;--bc-fs-sm:12.5px;--bc-fs-md:14px;--bc-fs-lg:17px;--bc-fs-xl:21px;--bc-fs-2xl:28px;'
  +'--bc-accent:#ffd23f;--bc-accent-2:#ffb300;--bc-on-accent:#15130b;--bc-ok:#34c759;--bc-warn:#ff9f0a;--bc-danger:#ff453a;--bc-info:#0a84ff;--bc-cash:#7ee29b;'
  +'--bc-text:#f4f6fa;--bc-text-2:rgba(244,246,250,.68);--bc-text-3:rgba(244,246,250,.44);'
  +'--bc-glass:rgba(13,15,21,.56);--bc-panel:rgba(17,19,26,.95);--bc-raise:rgba(255,255,255,.06);--bc-raise-2:rgba(255,255,255,.11);--bc-line:rgba(255,255,255,.11);--bc-line-2:rgba(255,255,255,.2);'
  +'--bc-blur:blur(16px) saturate(1.4);--bc-r-xs:8px;--bc-r-sm:12px;--bc-r-md:16px;--bc-r-lg:22px;--bc-r-pill:999px;'
  +'--bc-s1:4px;--bc-s2:8px;--bc-s3:12px;--bc-s4:16px;--bc-s5:20px;--bc-s6:24px;'
  +'--bc-sh-1:0 6px 18px rgba(0,0,0,.3);--bc-sh-2:0 24px 64px rgba(0,0,0,.55);--bc-ic:20px;--bc-hit:44px;--bc-e:10px;--bc-k:1;--bc-z:1;--bc-sw:240px}');
 c.push('@media (min-width:1100px) and (min-height:620px){html body{--bc-k:1.12}}@media (min-width:1600px) and (min-height:900px){html body{--bc-k:1.4}}');
 c.push('html body{--ac:var(--bc-accent);--gb:var(--bc-line-2);font-family:var(--bc-font)}');
 // ===== shared components =====
 c.push('.bc-panel{box-sizing:border-box;background:var(--bc-panel);color:var(--bc-text);border:1px solid var(--bc-line);border-radius:var(--bc-r-lg);box-shadow:var(--bc-sh-2),inset 0 1px 0 rgba(255,255,255,.06);font-family:var(--bc-font)}');
 c.push('.bc-hd{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}.bc-hd b{font-size:var(--bc-fs-xl);font-weight:800;letter-spacing:.08em;text-transform:uppercase}');
 c.push('.bc-x{flex:none;width:40px;height:40px;box-sizing:border-box;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--bc-raise);border:1px solid var(--bc-line);font-size:22px;line-height:1;color:var(--bc-text)}');
 c.push('.bc-btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 18px;border-radius:var(--bc-r-sm);font:800 var(--bc-fs-sm)/1.1 var(--bc-font);letter-spacing:.08em;text-transform:uppercase;box-sizing:border-box;'+SEC+'}.bc-btn.bc-pri{'+PRI+'}.bc-btn.bc-ghost{background:transparent'+I+'}.bc-btn.bc-dng{'+DNG+'}');
 c.push('.bc-sec{font-size:var(--bc-fs-cap);font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--bc-text-3);margin:20px 0 2px;grid-column:1/-1}.bc-sec:first-child{margin-top:10px}');
 c.push('.bc-key{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:6px;background:#f4f6fa;color:#15171d;font:800 11px/1 var(--bc-font);letter-spacing:0;box-shadow:0 2px 0 rgba(255,255,255,.3)}');
 c.push('.bc-kv{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:var(--bc-fs-sm)}.bc-kv>span{color:var(--bc-text-2)}.bc-kv>em{font-style:normal;font-weight:700;text-align:right;color:var(--bc-text)}.bc-kv>em .bc-key{margin-left:3px}');
 c.push('.bc-card{border-radius:var(--bc-r-md);background:var(--bc-raise);border:1px solid var(--bc-line);padding:12px 14px;margin-top:12px;grid-column:1/-1}.bc-card b{display:block;font-size:var(--bc-fs-md);margin-bottom:4px}.bc-card p{margin:0;font-size:var(--bc-fs-sm);color:var(--bc-text-2);line-height:1.4}');
 // ===== HUD: grouped in the corners, safe-area aware =====
 // top-left: menu + phone buttons, status card (money, clock, health, armour), wanted stars, then the objective stack; top-right: radar with its slots under it
 c.push('html body{--bc-cl:calc(var(--sl) + var(--bc-e) + 54px)}');
 c.push('html body #uiGear,html body #stPhBtn{left:calc(var(--sl) + var(--bc-e))'+I+';right:auto'+I+';width:44px'+I+';height:44px'+I+';border-radius:50%'+I+';border:1px solid var(--bc-line-2)'+I+';box-sizing:border-box;'+GL+'box-shadow:var(--bc-sh-1)'+I+';z-index:6}');
 c.push('html body #uiGear{top:calc(var(--st) + var(--bc-e))'+I+';background-image:'+uiIc(uiThI.menu)+';background-repeat:no-repeat;background-position:center;background-size:22px}');
 c.push('html body #stPhBtn{top:calc(var(--st) + var(--bc-e) + 52px)'+I+';font-size:0'+I+';color:transparent;overflow:visible'+I+';zoom:var(--bc-z);opacity:var(--uho);scale:1'+I+'}html body #stPhBtn svg{display:none}html body #stPhBtn::before{width:22px;height:22px;margin:0;background-image:'+uiIc(uiThI.phone)+'}');
 c.push('html body #uiCard{left:var(--bc-cl);top:calc(var(--st) + var(--bc-e));width:184px;height:62px;border-radius:var(--bc-r-md);border:1px solid var(--bc-line);'+GL+'box-shadow:var(--bc-sh-1)}html body.bc-veh #uiCard{height:74px}');
 c.push('html body #hud{left:calc(var(--bc-cl) + 14px)'+I+';top:calc(var(--st) + var(--bc-e) + 8px)'+I+';width:156px;font-family:var(--bc-font)}');
 c.push('html body #cash{font-size:22px'+I+';line-height:26px;font-weight:800;color:var(--bc-cash)'+I+';letter-spacing:.01em;font-variant-numeric:tabular-nums}html body #clock{right:0;top:6px;font-size:var(--bc-fs-xs);font-weight:600;letter-spacing:.02em;color:var(--bc-text-2);opacity:1;font-variant-numeric:tabular-nums}');
 c.push('html body #bars{left:calc(var(--bc-cl) + 14px)'+I+';top:calc(var(--st) + var(--bc-e) + 40px)'+I+';width:156px'+I+'}html body #bars>div{height:5px'+I+';margin:0 0 7px 18px'+I+';background:rgba(255,255,255,.14)'+I+'}html body #bars>div::before{left:-18px;top:-3.5px;width:12px;height:12px}');
 c.push('html body #stars{left:calc(var(--bc-cl) + 2px)'+I+';top:calc(var(--st) + var(--bc-e) + 66px)'+I+';font-size:17px'+I+';letter-spacing:3px'+I+';line-height:20px;visibility:hidden;text-shadow:0 1px 3px rgba(0,0,0,.7)'+I+'}html body.bc-wanted #stars{visibility:visible}html body.bc-veh #stars{top:calc(var(--st) + var(--bc-e) + 78px)'+I+'}');
 c.push('#uiStack{position:fixed;left:calc(var(--sl) + var(--bc-e));top:calc(var(--st) + var(--bc-e) + 104px);width:var(--bc-sw);display:flex;flex-direction:column;align-items:flex-start;gap:8px;pointer-events:none;z-index:4;zoom:var(--bc-z);opacity:var(--uho)}body.ui-l #uiStack{width:280px}');
 c.push('html body #uiStack #mission{position:static'+I+';left:auto'+I+';top:auto'+I+';max-width:100%'+I+';box-sizing:border-box;zoom:1'+I+';opacity:1'+I+';margin:0;padding:9px 12px 10px;border-radius:var(--bc-r-sm);border:1px solid var(--bc-line);border-left:3px solid var(--bc-accent);'+GL+'font-size:var(--bc-fs-sm)'+I+';font-weight:600'+I+';line-height:1.38;color:var(--bc-text)}');
 c.push('html body #uiStack #stObj{position:static'+I+';left:auto'+I+';top:auto'+I+';transform:none'+I+';max-width:100%'+I+';box-sizing:border-box;text-align:left'+I+';padding:9px 12px'+I+';border-radius:var(--bc-r-sm)'+I+';border:1px solid var(--bc-line);border-left:3px solid #ff5cf0'+I+';'+GL+'font-size:var(--bc-fs-sm)'+I+';font-weight:600'+I+'}');
 c.push('#mission [data-mc]{display:inline-flex'+I+';align-items:center;justify-content:center;min-height:40px;min-width:64px;box-sizing:border-box;padding:0 12px'+I+';margin:4px 8px 0 0'+I+';border-radius:var(--bc-r-xs)'+I+';font-size:var(--bc-fs-xs)'+I+';letter-spacing:.08em'+I+'}#mission [data-mc=x]{background:rgba(255,69,58,.22)'+I+'}');
 // radar and the slots under it (portrait: a column under the radar; landscape: a column left of the radar, clear of the action buttons)
 c.push('html body #map{top:calc(var(--st) + var(--bc-e));right:calc(var(--sr) + var(--bc-e));width:112px;height:112px;border:2px solid rgba(255,255,255,.55);box-shadow:0 0 0 1px rgba(0,0,0,.35),var(--bc-sh-1)}html body.ui-l #map{width:120px;height:120px}');
 c.push('html body #uiRotB,html body #radio,html body #muFbBtn{width:44px'+I+';height:44px'+I+';box-sizing:border-box;left:auto'+I+';margin:0'+I+';border-radius:50%'+I+'}html body #uiRotB{border:1px solid var(--bc-line-2);'+GL+'background-image:'+uiIc(uiI.rot)+';background-repeat:no-repeat;background-position:center;background-size:20px;box-shadow:var(--bc-sh-1)}');
 c.push('html body #radio{border:1px solid rgba(125,221,255,.7)'+I+';background:var(--bc-glass)'+I+';font-family:var(--bc-font);font-size:9px'+I+'}html body #muFbBtn{border:1px solid rgba(255,255,255,.5)'+I+';zoom:var(--bc-z)}');
 c.push('html body.ui-p #uiRotB{right:calc(var(--sr) + var(--bc-e) + 68px)'+I+';top:calc(var(--st) + var(--bc-e) + 120px)'+I+'}html body.ui-p #radio{right:calc(var(--sr) + var(--bc-e))'+I+';top:calc(var(--st) + var(--bc-e) + 120px)'+I+'}html body.ui-p #muFbBtn{left:auto'+I+';right:calc(var(--sr) + var(--bc-e))'+I+';top:calc(var(--st) + var(--bc-e) + 172px)'+I+'}');
 c.push('html body.ui-p #uiApHud{top:calc(var(--st) + var(--bc-e) + 224px)'+I+';right:calc(var(--sr) + var(--bc-e))'+I+'}html body.ui-l #uiApHud{top:calc(var(--st) + var(--bc-e))'+I+'}#uiApHud{font-family:var(--bc-font);border-color:var(--bc-line)'+I+'}');
 c.push('html body.ui-l #uiRotB{right:calc(var(--sr) + var(--bc-e) + 130px)'+I+';top:calc(var(--st) + var(--bc-e))'+I+'}html body.ui-l #radio{right:calc(var(--sr) + var(--bc-e) + 130px)'+I+';top:calc(var(--st) + var(--bc-e) + 52px)'+I+'}html body.ui-l #muFbBtn{left:auto'+I+';right:calc(var(--sr) + var(--bc-e) + 130px)'+I+';top:calc(var(--st) + var(--bc-e) + 104px)'+I+'}');
 // HUD scale (setting x big screens) and see-through setting for everything in the top corners
 c.push('html body #uiCard,html body #hud,html body #stars,html body #bars,html body #map,html body #uiGear,html body #uiRotB,html body #radio,html body #uiApHud,html body #uiSpd{zoom:var(--bc-z)}html body #uiApHud,html body #muFbBtn{opacity:var(--uho)}');
 // transient messages
 c.push('html body #toast{top:calc(var(--st) + 26%)'+I+';padding:10px 18px;border-radius:var(--bc-r-pill);border:1px solid var(--bc-line);'+GL+'box-shadow:var(--bc-sh-1);font-family:var(--bc-font);font-size:var(--bc-fs-md)'+I+';font-weight:700'+I+';letter-spacing:.02em;zoom:var(--bc-k)}');
 c.push('html body #uiFps{left:calc(var(--sl) + var(--bc-e));transform:none;bottom:calc(var(--sb) + 3px);font-family:var(--bc-font)}');
 c.push('html body.ui-p #muPill{top:34%}html body.ui-l #muPill{top:calc(var(--st) + var(--bc-e) + 4px)}#muPill{font-family:var(--bc-font)'+I+';border:1px solid var(--bc-line)}html body #acChip{top:calc(var(--st) + 40%);font-family:var(--bc-font)}');
 c.push('#vhKeys,#msBan,#uiSpd{font-family:var(--bc-font)'+I+'}#uiSpd{text-shadow:0 2px 8px rgba(0,0,0,.65)}');
 // touch controls: one glass style, labels in the token font (positions stay where the thumbs already know them)
 c.push('html body .btn{font-family:var(--bc-font);border-color:var(--bc-line-2);background:var(--bc-glass)'+I+'}html body #fire{background:radial-gradient(circle at 34% 28%,rgba(255,122,100,.96),rgba(206,36,36,.88))'+I+'}html body #vhdn{background:rgba(10,132,255,.45)'+I+'}');
 c.push('html body #car[data-s=DRIVE],html body #car[data-s=STEAL]{'+PRI+';animation:uiPulse 1.2s infinite}');
 // in the air the EXIT button leaves the top-left corner (that is where the status and objectives are now)
 c.push('html body.ui-air.ui-air.ui-air.ui-p:not(.ui-zz) #car{top:auto'+I+';bottom:calc(var(--sb) + 182px)'+I+';left:calc(var(--sl) + 34px)'+I+';right:auto'+I+';width:52px'+I+';height:52px'+I+'}');
 c.push('html body.ui-air.ui-air.ui-air.ui-l:not(.ui-zz) #car{top:auto'+I+';bottom:calc(var(--sb) + 40px)'+I+';left:calc(var(--sl) + 172px)'+I+';right:auto'+I+';width:52px'+I+';height:52px'+I+'}');
 c.push('html body.ui-air.ui-air.ui-air.ui-lh.ui-p:not(.ui-zz) #car{left:auto'+I+';right:calc(var(--sr) + 34px)'+I+'}html body.ui-air.ui-air.ui-air.ui-lh.ui-l:not(.ui-zz) #car{left:auto'+I+';right:calc(var(--sr) + 172px)'+I+'}');
 // keyboard and mouse: the weapon becomes a card in the bottom-right corner, DRIVE / STEAL a prompt at the bottom centre, key caps on the corner buttons
 c.push('html body.in-kbm.in-kbm.in-kbm #wpn{right:calc(var(--sr) + 20px)'+I+';bottom:calc(var(--sb) + 20px)'+I+';left:auto'+I+';top:auto'+I+';width:auto'+I+';min-width:150px;height:54px'+I+';border-radius:var(--bc-r-md)'+I+';flex-direction:row;justify-content:flex-start;gap:10px;padding:0 46px 0 14px;box-sizing:border-box;scale:1'+I+';zoom:var(--bc-k);text-transform:uppercase}');
 c.push('html body.in-kbm.in-kbm.in-kbm #wpn::before{width:22px;height:22px;margin:0}html body.in-kbm.in-kbm.in-kbm #wpn>div{text-align:left;font-size:var(--bc-fs-xs);letter-spacing:.1em;line-height:1.15}html body.in-kbm.in-kbm.in-kbm #wpn small{display:block;font-size:15px'+I+';letter-spacing:0}html body.in-kbm.in-kbm.in-kbm #wpn::after{top:50%;right:12px;transform:translateY(-50%)}');
 c.push('html body.in-kbm #car[data-s=DRIVE],html body.in-kbm #car[data-s=STEAL]{left:50%'+I+';right:auto'+I+';top:auto'+I+';bottom:calc(var(--sb) + 26px)'+I+';transform:translateX(-50%);width:auto'+I+';height:44px'+I+';padding:0 18px 0 8px;border-radius:var(--bc-r-pill)'+I+';flex-direction:row;gap:10px;font-size:var(--bc-fs-sm)'+I+';letter-spacing:.12em;scale:1'+I+';zoom:var(--bc-k)}');
 c.push('html body.in-kbm #car::after{position:static;order:-2}html body.in-kbm #car::before{order:-1;width:20px;height:20px;margin:0}html body.in-kbm #car.ui-on{transform:translateX(-50%) scale(.95)}');
 c.push('body.in-kbm #stPhBtn::after,body.in-kbm #uiGear::after{position:absolute;right:-6px;bottom:-6px;min-width:18px;height:18px;padding:0 4px;box-sizing:border-box;border-radius:5px;background:#f4f6fa;color:#15171d;font:800 10px/18px var(--bc-font);text-align:center;letter-spacing:0;box-shadow:0 2px 6px rgba(0,0,0,.4)}body.in-kbm #stPhBtn::after{content:"T"}body.in-kbm #uiGear::after{content:"Esc"}');
 // the old floating CHARACTER chip on the title is replaced by the menu row
 c.push('html body.in-kbm #uiRotB{display:none'+I+'}html body #chBtn{display:none'+I+'}body.ui-title #uiStack,body.ui-title #muFbBtn,body.ui-title #muPill{display:none'+I+'}');
 // ===== title / main menu =====
 c.push('html body #uiTitle{gap:0;justify-content:space-between;align-items:center;padding:calc(var(--st) + 7vh + 26px) calc(var(--sr) + 24px) calc(var(--sb) + 7vh + 22px) calc(var(--sl) + 24px);font-family:var(--bc-font)}');
 c.push('.bc-tw{display:flex;flex-direction:column;align-items:center;margin-top:5vh}.bc-tm{width:100%;max-width:340px;display:flex;flex-direction:column;gap:12px;align-items:stretch}');
 c.push('html body #uiTitle .ui-play2{width:100%;height:56px;margin:0;border-radius:var(--bc-r-md);font-size:16px;letter-spacing:.32em;text-indent:.32em;'+PRI+';animation:uiGlow 2.4s ease-in-out infinite}html body #uiTitle .ui-play2::before{width:18px;height:18px;margin-left:-.32em}');
 c.push('.bc-list{display:flex;flex-direction:column;border-radius:var(--bc-r-md);overflow:hidden;border:1px solid var(--bc-line);'+GL+'box-shadow:var(--bc-sh-1)}');
 c.push('html body #uiTitle .bc-mi{display:flex;justify-content:flex-start;gap:12px;height:52px;padding:0 14px;border-radius:0;border:0;border-top:1px solid var(--bc-line);background:transparent;color:var(--bc-text);font-size:var(--bc-fs-md);font-weight:600;letter-spacing:.02em;text-transform:none;outline:0}html body #uiTitle .bc-mi:first-child{border-top:0}');
 c.push('#uiTitle .bc-mi>i{flex:none;width:22px;height:22px;background:center/contain no-repeat;opacity:.92}#uiTitle .bc-mi>i.bc-chev{width:16px;height:16px;opacity:.4}.bc-mt{flex:1;min-width:0;display:flex;flex-direction:column;text-align:left;line-height:1.2}.bc-mt small{font-size:var(--bc-fs-xs);font-weight:500;color:var(--bc-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}');
 c.push('html body #uiTitle .bc-mi.ui-on{transform:none;filter:none;color:var(--bc-text);background:rgba(255,255,255,.09)}body.in-kbm #uiTitle .bc-mi:hover{background:rgba(255,255,255,.07)}#uiTitle .bc-mi .ac-dot{margin-left:8px;vertical-align:2px}');
 c.push('#uiTitle .bc-rot{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:0}#uiTitle .bc-rot .ui-optl{width:100%;font-size:var(--bc-fs-cap);letter-spacing:.2em;color:var(--bc-text-3);opacity:1}html body #uiTitle .bc-rot .ui-b{height:40px;padding:0 14px;border-radius:var(--bc-r-pill);font-size:var(--bc-fs-xs);letter-spacing:.1em;border:1px solid var(--bc-line-2);background:var(--bc-raise);color:var(--bc-text)}');
 c.push('html body #uiTitle .ui-ver{right:calc(var(--sr) + 14px);bottom:calc(var(--sb) + 7vh + 8px);font-size:var(--bc-fs-cap);letter-spacing:.18em;color:var(--bc-text-3);opacity:1}html body #uiTitle .ui-tl{font-size:var(--bc-fs-cap)}');
 c.push('html body.ui-l #uiTitle{flex-direction:row;justify-content:space-between;align-items:center;padding:calc(var(--st) + 7vh + 10px) calc(var(--sr) + 6vw) calc(var(--sb) + 7vh + 10px) calc(var(--sl) + 6vw)}');
 c.push('html body.ui-l .bc-tw{align-items:flex-start;margin:0}html body.ui-l .ui-wm{align-items:flex-start;text-align:left}html body.ui-l .ui-wm b{display:block;font-size:clamp(34px,min(7.4vw,15vh),120px)}html body.ui-l .ui-wm b+b{margin-left:0}html body.ui-l .ui-rule{background:linear-gradient(90deg,var(--bc-accent),transparent)}html body.ui-l .ui-tl{margin-right:0}');
 c.push('html body.ui-l #uiTitle .ui-ver{right:auto;left:calc(var(--sl) + 6vw)}html body.ui-l .bc-tm{width:320px;flex:none;gap:10px}html body.ui-l #uiTitle .ui-play2{height:50px}html body.ui-l #uiTitle .bc-mi{height:46px}');
 c.push('@media (min-width:1100px) and (min-height:620px){html body .bc-tm{zoom:var(--bc-k)}}');
 // credits
 c.push('#uiCred{position:fixed;left:0;top:0;right:0;bottom:0;z-index:95;display:none;align-items:center;justify-content:center;background:rgba(4,6,10,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:var(--bc-text);font-family:var(--bc-font)}#uiCred.on{display:flex}');
 c.push('#uiCred .bc-panel{width:min(420px,calc(100% - 32px));padding:18px 18px 16px;transform:scale(var(--bc-k))}#uiCred .bc-btn{margin-top:14px}#uiCred .bc-lead{font-size:var(--bc-fs-sm);color:var(--bc-text-2);margin:0 0 4px;line-height:1.45}');
 // ===== settings / pause =====
 c.push('#uiSet{background:rgba(4,6,10,.5);-webkit-backdrop-filter:blur(10px) saturate(1.2);backdrop-filter:blur(10px) saturate(1.2);font-family:var(--bc-font)}');
 c.push('#uiSet .bc-set{width:min(540px,calc(100% - 24px - var(--sl) - var(--sr)));height:min(700px,calc((100% - 24px - var(--st) - var(--sb)) / var(--bc-k)));max-height:none;padding:0;display:flex;flex-direction:column;overflow:hidden;position:relative;background:var(--bc-panel);border:1px solid var(--bc-line);border-radius:var(--bc-r-lg);box-shadow:var(--bc-sh-2);transform:scale(var(--bc-k));color:var(--bc-text)}');
 c.push('#uiSet .bc-set .ui-hd{flex:none;display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:16px 18px 12px;margin:0}#uiSet .bc-set .ui-hd b{font-size:var(--bc-fs-xl);font-weight:800;letter-spacing:.08em;text-transform:uppercase}#uiSet .bc-set .ui-hd span{font-size:var(--bc-fs-xs);font-weight:600;color:var(--bc-text-2);opacity:1;letter-spacing:0;text-align:right}');
 c.push('.bc-body{flex:1 1 auto;min-height:0;display:flex;flex-direction:column}');
 c.push('#uiSet .bc-set .ui-tabs{flex:none;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0;padding:0 14px 12px}#uiSet .bc-set .ui-tabs .ui-b{position:relative;height:40px;padding:0 6px;border-radius:var(--bc-r-sm);font-size:var(--bc-fs-xs);font-weight:700;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--bc-line);background:var(--bc-raise);color:var(--bc-text-2);outline:0}');
 c.push('#uiSet .bc-set .ui-tabs .ui-b.on{background:var(--bc-accent);color:var(--bc-on-accent);border-color:transparent}#uiSet .bc-set .ui-tabs .ac-dot{position:absolute;right:8px;top:8px;margin:0}body.in-kbm #uiSet .bc-set .ui-tabs .ui-b:not(.on):hover{background:var(--bc-raise-2);color:var(--bc-text)}');
 c.push('#uiSet .bc-set .ui-tc{flex:1 1 auto;min-height:0;max-height:none'+I+';border-top:1px solid var(--bc-line);border-bottom:0;overflow:hidden}#uiSet .bc-set .ui-tci{padding:0 18px 18px}');
 c.push('#uiSet .bc-set .ui-ft{flex:none;display:flex;flex-wrap:nowrap;gap:10px;margin:0;padding:12px 14px;border-top:1px solid var(--bc-line)}html body #uiSet .bc-set .ui-ft .ui-b{flex:1 1 0;order:0;height:46px;padding:0 10px;border-radius:var(--bc-r-sm);font-size:var(--bc-fs-sm);letter-spacing:.08em;'+SEC+'}html body #uiSet .bc-set .ui-ft .ui-res{flex:1.3 1 0;'+PRI+'}');
 c.push('#uiSet .bc-it{padding:12px 0;margin:0;border-bottom:1px solid rgba(255,255,255,.06)}#uiSet .bc-l{display:block;font-size:var(--bc-fs-md);font-weight:600;letter-spacing:0;color:var(--bc-text);text-transform:none}#uiSet .bc-l small{display:block;margin-top:3px;font-size:var(--bc-fs-xs);font-weight:500;letter-spacing:0;color:var(--bc-text-2);opacity:1}');
 c.push('#uiSet .bc-it .ui-lb{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin:0 0 6px;font-size:inherit;letter-spacing:0}#uiSet .bc-it .ui-lb em{font-style:normal;font-size:var(--bc-fs-sm);font-weight:700;color:var(--bc-accent);font-variant-numeric:tabular-nums;white-space:nowrap;padding-top:2px}');
 c.push('#uiSet .ui-sl{display:flex;align-items:center;gap:10px}#uiSet .ui-pm{flex:none;width:40px;height:40px;box-sizing:border-box;border-radius:50%;border:1px solid var(--bc-line-2);background:var(--bc-raise);color:var(--bc-text);font-size:20px;font-weight:600}#uiSet .ui-tr{height:40px}');
 c.push('#uiSet .ui-tr::before{top:18px;height:4px;border-radius:2px;background:rgba(255,255,255,.14)}#uiSet .ui-fl{top:18px;height:4px;border-radius:2px;background:var(--bc-accent)}#uiSet .ui-th{top:9px;width:22px;height:22px;margin-left:-11px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.45),0 0 0 4px rgba(255,210,63,.18)}');
 c.push('#uiSet .ui-tg.bc-it{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:44px;box-sizing:border-box;padding:12px 0;font-size:inherit}#uiSet .ui-tg.off{opacity:.4}');
 c.push('#uiSet .ui-sw{flex:none;width:48px;height:28px;border-radius:14px;background:rgba(255,255,255,.16);padding:0;margin:0;border:0;font-size:0}#uiSet .ui-sw::after{left:3px;top:3px;width:22px;height:22px}#uiSet .ui-sw.on,#uiSet .ui-sw.ui-chip.on{background:var(--bc-ok)}#uiSet .ui-sw.on::after{transform:translateX(20px)}');
 c.push('#uiSet .bc-sgw .ui-seg{display:grid;gap:6px;margin:8px 0 0}html body #uiSet .bc-sgw .ui-seg .ui-b{height:40px;border-radius:10px;font-size:var(--bc-fs-sm);font-weight:700;letter-spacing:.02em;text-transform:none;border:1px solid var(--bc-line);background:var(--bc-raise);color:var(--bc-text-2)}html body #uiSet .bc-sgw .ui-seg .ui-b.on{background:var(--bc-accent);color:var(--bc-on-accent);border-color:transparent}');
 c.push('#uiSet .bc-danger{display:flex;gap:10px;margin-top:12px;grid-column:1/-1}html body #uiSet .bc-danger .ui-b{flex:1;height:46px;border-radius:var(--bc-r-sm);font-size:var(--bc-fs-sm);letter-spacing:.06em;'+SEC+'}html body #uiSet .bc-danger .ui-b.ui-warn{'+DNG+'}');
 c.push('#uiSet .bc-help{grid-column:1/-1}body.in-kbm #uiSet .bc-tch,body:not(.in-kbm) #uiSet .bc-kbh{display:none}#uiSet .bc-card .ui-b{margin-top:12px;height:46px;border-radius:var(--bc-r-sm);font-size:var(--bc-fs-sm);letter-spacing:.08em;'+PRI+'}');
 // landscape (phone sideways, laptop): footer buttons move up into the header row and the tabs sit in one row, so the list gets the height
 c.push('html body.ui-l #uiSet .bc-set{width:min(820px,calc((100% - 24px - var(--sl) - var(--sr)) / var(--bc-k)))}html body.ui-l #uiSet .bc-set .ui-hd{flex-direction:column;align-items:flex-start;gap:2px;padding:12px 16px 10px;min-height:44px}html body.ui-l #uiSet .bc-set .ui-hd span{text-align:left}');
 c.push('html body.ui-l #uiSet .bc-set .ui-ft{position:absolute;top:10px;right:12px;padding:0;border:0;width:min(330px,50%)}html body.ui-l #uiSet .bc-set .ui-ft .ui-b{height:42px}');
 c.push('html body.ui-l #uiSet .bc-set .ui-tabs{grid-template-columns:repeat(6,1fr);padding:0 14px 10px}html body.ui-l #uiSet .bc-set .ui-tci{column-gap:28px;padding:0 16px 14px}');
 // ===== crime counters / robbery menus, gun shop, story panels: the same panel, buttons and rows =====
 c.push('#cpPan,#msMenu,#stPan{font-family:var(--bc-font)'+I+';background:rgba(4,6,10,.5)'+I+';-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}');
 c.push('#cpPan>div,#msMenu>[data-ms=p],#stPan>div{width:min(420px,calc(100% - 32px))'+I+';max-height:calc((100% - 32px) / var(--bc-k))'+I+';overflow:auto'+I+';box-sizing:border-box;background:var(--bc-panel)'+I+';border:1px solid var(--bc-line)'+I+';border-radius:var(--bc-r-lg)'+I+';padding:18px 18px 16px'+I+';box-shadow:var(--bc-sh-2)'+I+';color:var(--bc-text)'+I+';font-size:var(--bc-fs-md)'+I+';font-weight:500'+I+';line-height:1.5'+I+';transform:scale(var(--bc-k));scrollbar-width:none}');
 c.push('#cpPan>div>div:first-child,#msMenu>[data-ms=p]>div:first-child{font-size:var(--bc-fs-xl)'+I+';font-weight:800'+I+';letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px'+I+'}');
 c.push('#cpPan [data-k]{display:inline-flex'+I+';align-items:center;justify-content:center;min-height:44px;min-width:44px;box-sizing:border-box;padding:0 18px'+I+';margin:12px 8px 0 0'+I+';border-radius:var(--bc-r-sm)'+I+';font-size:var(--bc-fs-sm)'+I+';font-weight:800'+I+';letter-spacing:.06em;line-height:1.1;vertical-align:top;'+PRI+'}#cpPan [data-k][style*="#ccc"]{'+SEC+'}');
 c.push('#cpPan [data-k][style*="padding:8px 10px"]{display:block'+I+';margin:8px 0 0'+I+';padding:12px 14px'+I+';border-radius:var(--bc-r-md)'+I+';background:var(--bc-raise)'+I+';border:1px solid var(--bc-line)'+I+';color:var(--bc-text)'+I+';font-size:var(--bc-fs-md)'+I+';font-weight:700'+I+';letter-spacing:0;text-align:left;box-shadow:none'+I+'}');
 c.push('#msMenu [data-ms]:not([data-ms=p]):not([data-ms=x]){border-radius:var(--bc-r-md)'+I+';border-width:1px'+I+';padding:14px 10px'+I+';min-height:44px;box-sizing:border-box}#msMenu [data-ms=x]{display:flex;align-items:center;justify-content:center;height:46px;box-sizing:border-box;padding:0'+I+';margin-top:8px'+I+';border-radius:var(--bc-r-sm)'+I+';font-size:var(--bc-fs-sm)'+I+';letter-spacing:.08em;'+SEC+'}');
 c.push('#stPan .st-h{font-size:var(--bc-fs-xl);font-weight:800;letter-spacing:.08em;text-transform:uppercase}#stPan .st-s,.st-p .st-s{color:var(--bc-text-2);opacity:1;font-size:var(--bc-fs-sm)}');
 c.push('.st-b{display:inline-flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;box-sizing:border-box;padding:0 18px;margin:10px 8px 0 0;border-radius:var(--bc-r-sm);font-family:var(--bc-font);font-size:var(--bc-fs-sm);font-weight:800;letter-spacing:.06em;vertical-align:middle;'+PRI+'}.st-b.g{'+SEC+'}.st-b.r{'+DNG+'}');
 c.push('.st-row{padding:10px 12px;border-radius:var(--bc-r-md);background:var(--bc-raise);border:1px solid var(--bc-line);margin-top:8px;font-size:var(--bc-fs-sm)}.st-row .st-b{margin:0}');
 // ===== account =====
 c.push('#acRoot{font-family:var(--bc-font)}#acRoot .ac-pan{border-radius:var(--bc-r-lg);background:var(--bc-panel);border-color:var(--bc-line);padding:18px 18px 16px;box-shadow:var(--bc-sh-2);zoom:var(--bc-k)}#acRoot .ac-hd b{font-size:var(--bc-fs-xl);font-weight:800;letter-spacing:.08em}');
 c.push('#acRoot .ac-x{width:40px;height:40px;box-sizing:border-box;border-color:var(--bc-line);background:var(--bc-raise);font-size:22px}#acRoot .ac-p{font-size:var(--bc-fs-sm);color:var(--bc-text-2);opacity:1}#acRoot .ac-p b{color:var(--bc-accent)}#acRoot .ac-in{border-radius:var(--bc-r-sm);border-color:var(--bc-line-2);background:var(--bc-raise)}');
 c.push('#acRoot .ac-b{height:46px;border-radius:var(--bc-r-sm);font-size:var(--bc-fs-sm);font-weight:800;letter-spacing:.08em;'+SEC+'}#acRoot .ac-b.ac-go{'+PRI+'}#acRoot .ac-b.ac-warn{'+DNG+'}#acRoot .ac-row .ac-b{font-size:var(--bc-fs-xs)}#acRoot .ac-card{border-radius:var(--bc-r-md);background:var(--bc-raise);border-color:var(--bc-line)}#acRoot .ac-ct{color:var(--bc-text-3);opacity:1}');
 // ===== full map =====
 c.push('#mpWrap{font-family:var(--bc-font)}#mpWrap .mpB{border-radius:var(--bc-r-sm);'+GL+'border:1px solid var(--bc-line-2);box-shadow:var(--bc-sh-1);font-weight:700}#mpHead{border-radius:var(--bc-r-md)'+I+';border:1px solid var(--bc-line)'+I+';'+GL+'letter-spacing:.14em'+I+';font-weight:800'+I+';text-shadow:none'+I+'}#mpHead small{color:var(--bc-text-2)'+I+';letter-spacing:.06em'+I+';font-weight:600'+I+'}');
 c.push('#mpLeg{border-radius:var(--bc-r-md)'+I+';background:var(--bc-panel)'+I+';border:1px solid var(--bc-line)'+I+';font-weight:600'+I+'}#mpHint{font-weight:600'+I+';color:var(--bc-text-2)'+I+'}');
 // ===== character screen (real module): same font, 40 px swatches and chips =====
 c.push('#chOv{font-family:var(--bc-font)'+I+'}#chOv .ch-sw{width:40px;height:40px}#chOv .ch-x{width:40px;height:40px;box-sizing:border-box}#chOv .ch-chip{min-height:40px;display:inline-flex;align-items:center;box-sizing:border-box;border-radius:var(--bc-r-sm)}#chOv .ch-in{height:44px;border-radius:var(--bc-r-sm);font-family:var(--bc-font)}');
 c.push('#chOv .ch-done{height:50px;border-radius:var(--bc-r-md);'+PRI+'}#chOv .ch-tt{letter-spacing:.2em}#chOv .ch-sec{color:var(--bc-text-3);opacity:1;font-size:var(--bc-fs-cap)}');
 // ===== phone (story + apps from other modules): token font, one header size, 40 px tap targets =====
 c.push('.stp,#stNB,.mu-r,.st-p{font-family:var(--bc-font)'+I+'}.stp-hd b,.mu-hd b{font-size:1.5em'+I+';font-weight:800'+I+';letter-spacing:-.01em}.mu-hd{padding:3.2em 1.1em .45em'+I+';min-height:2.2em}');
 c.push('.stp-bk,.mu-bk{display:inline-flex'+I+';align-items:center;min-height:40px;min-width:40px;box-sizing:border-box}.stp-btn,.stp-chip,.stp-ib,.stp-send{min-height:40px;min-width:40px;box-sizing:border-box}.stp-tab span{min-height:40px;display:flex;align-items:center;justify-content:center;box-sizing:border-box}');
 c.push('.stp-i span.l{font-size:.76em}.stp-sub{color:rgba(255,255,255,.6)}');
 // home bar: a 40 px tall strip (like the iPhone home indicator zone); app content keeps clear of it
 c.push('.stp-bar{height:max(1.9em,40px)'+I+'}.stp-sc,.mu-sc{padding-bottom:max(2.4em,46px)'+I+'}.stp-inp{padding-bottom:calc(40px + .4em)'+I+'}[data-k^="like:"]{display:inline-flex'+I+';align-items:center;min-height:40px;min-width:40px;margin:-13px 0;vertical-align:middle;box-sizing:border-box}');
 // Music app (music module): controls get their own full-width row of 40 px buttons, tabs and small buttons grow to 40 px
 c.push('.mu-np{margin:0 .6em'+I+';padding:.55em'+I+'}.mu-in{display:contents}.mu-vid{grid-row:1/3}.mu-tt,.mu-ss{grid-column:2}.mu-tt{align-self:end}.mu-ss{align-self:start}#muTt{padding:14px 0;margin:-14px 0}');
 c.push('.mu-ct{grid-column:1/-1;justify-content:space-around'+I+';margin-top:.2em'+I+'}.mu-ct span{width:40px'+I+';height:40px'+I+'}.mu-ct span[data-m=exp]{display:none'+I+'}.mu-r.exp .mu-ct span{width:max(2.7em,40px)'+I+';height:max(2.7em,40px)'+I+'}.mu-r.exp .mu-vid,.mu-r.exp .mu-tt,.mu-r.exp .mu-ss{grid-column:1;grid-row:auto}');
 c.push('#muSk{padding:19px 0'+I+';margin:-13px 0 -11px}.mu-row{min-height:44px;box-sizing:border-box}.mu-tabs span{min-height:40px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:0'+I+'}.mu-x,.mu-sb span{min-width:40px;min-height:40px;box-sizing:border-box}');
 c.push('#chOv .ch-side>*{flex-shrink:0}');
 const st=document.createElement('style');st.id='uiTheme';st.textContent=c.join('');document.head.appendChild(st)}
// ----- DOM: ids for elements that only had inline styles, and one stack for objectives under the status card -----
try{if(stPhBtn&&!stPhBtn.id)stPhBtn.id='stPhBtn'}catch(e){}
try{cpPan.id='cpPan'}catch(e){}
try{stPan.id='stPan'}catch(e){}
const uiStack=document.createElement('div');uiStack.id='uiStack';document.body.appendChild(uiStack);
{const m=$('mission');if(m)uiStack.appendChild(m);try{stObj.id='stObj';uiStack.appendChild(stObj)}catch(e){}}
// ----- HUD zoom: HUD-scale setting x big-screen factor, capped on narrow portrait phones so the status card never runs into the radar -----
function uiThZoom(){const W=innerWidth,H=innerHeight,k=(W>=1600&&H>=900)?1.4:((W>=1100&&H>=620)?1.12:1),b=document.body.style;let z=(+uiS.hud||1)*k;
 if(H>W)z=Math.min(z,Math.max(.75,(W-8)/370));const sw=H>W?Math.max(150,Math.min(260,(W-8)/z-142)):280;
 b.setProperty('--bc-k',String(k));b.setProperty('--bc-z',z.toFixed(3));b.setProperty('--bc-sw',Math.round(sw)+'px')}
{const a2=uiApply2;uiApply2=function(k){a2(k);if(!k||k==='hud')uiThZoom()}}
addEventListener('resize',uiThZoom);uiThZoom();
// ----- phone layout: wider in landscape so its text stays readable (same placement rules as story's own) -----
if(typeof stLayout==='function'&&typeof stPh!=='undefined'){stLayout=function(){const W=innerWidth,H=innerHeight;let h,b,r;const ar=H>=W?.49:.55;
 const rect=id=>{const e=$(id);if(!e)return null;const q=e.getBoundingClientRect();return q.width&&q.height?q:null};
 const rs=['fire','car','jump','wpn'].map(rect).filter(Boolean);
 if(H>=W){const top0=rs.length?Math.min.apply(null,rs.map(q=>q.top)):H*.68;h=Math.min(500,top0-160);if(h>=340){b=H-top0+12;r=10}else{h=Math.min(500,H*.62);b=10;r=10}}
 else{h=Math.min(460,H-18);if(rs.length){const l0=Math.min.apply(null,rs.map(q=>q.left));r=Math.max(10,W-l0+10);if(W-r-h*ar<W*.36)r=10}else r=24;b=(H-h)/2}
 h=Math.max(180,Math.min(h,H-16));let w=Math.round(h*ar);if(w>W-16){w=W-16;h=w/ar}h=Math.round(h);b=Math.round(Math.max(4,Math.min(b,H-h-8)));r=Math.round(Math.max(4,Math.min(r,W-w-8)));
 const k=w+','+h+','+r+','+b;if(k===stLayK)return;stLayK=k;
 stPh.style.width=w+'px';stPh.style.height=h+'px';stPh.style.right=r+'px';stPh.style.bottom='calc(env(safe-area-inset-bottom,0px) + '+b+'px)';stPh.style.fontSize=(w/(H>=W?245:236)*13).toFixed(2)+'px'}}
// ----- settings: grouped tabs, a short hint under every setting, reset per tab -----
const uiThTabs=[['ctl','Controls'],['cam','Camera'],['gfx','Display'],['aud','Audio'],['play','Gameplay'],['acct','Account']];
uiTabs.length=0;for(const t of uiThTabs)uiTabs.push(t);
if(!uiThTabs.some(t=>t[0]===uiTab))uiTab='ctl';
const uiThKeys={ctl:['sens','invY','lh','bsz','jsz','dz','vib'],cam:['fov','cd','fp','ac','shake','rot'],gfx:['auto','q','gxScale','gxShadow','gxSharp','gxAO','hud','hop','nomap','fps','cb','rm'],aud:['vol','mus','sfxv','amb','subs'],play:['diff','day','traf','ped','mph']};
const uiThHint={auto:'Lowers the quality by itself when the game slows down',q:'Lower runs smoother, higher looks sharper',gxScale:'Resolution the city is drawn at',gxShadow:'Sharper shadows cost speed',gxSharp:'Crisper edges after upscaling',gxAO:'Soft contact shadows, costs speed',
 hud:'Size of the map, money and corner buttons',hop:'Lower lets you see through the HUD',nomap:'Open the map with Tab, M or the phone',fps:'Frame counter in the bottom corner',cb:'Recolours the picture for colour vision deficiency',rm:'Less camera shake and animation',
 sens:'How fast dragging turns the camera',invY:'Drag up to look down',lh:'Joystick on the right, buttons on the left',bsz:'Size of the on-screen buttons',jsz:'Size of the joystick',dz:'How far the stick moves before you do',vib:'Where the phone supports it',
 fov:'Wider shows more around you',cd:'How far the camera sits behind you',fp:'Or zoom all the way in',ac:'The camera swings back behind the vehicle',shake:'From explosions and speed',rot:'Play with the phone turned sideways',
 vol:'Everything at once',mus:'Radio and the Music app',sfxv:'Guns, engines and crashes',amb:'City, wind and water',subs:'Crew and phone dialogue',diff:'How much damage you take',day:'Real minutes for one day in the city',traf:'Cars on the road',ped:'People on the street',mph:'For the speedometer'};
let uiThRst='',uiThRstT=0;
function uiThSl(k){const d=uiSl[k];if(!d)return '';const v=uiS[k],p=uiClamp((v-d.min)/(d.max-d.min),0,1)*100;
 return '<div class="ui-it bc-it"><div class="ui-lb"><span class="bc-l">'+d.n+(uiThHint[k]?'<small>'+uiThHint[k]+'</small>':'')+'</span><em id="uiV_'+k+'">'+d.f(v)+'</em></div><div class="ui-sl"><div class="ui-pm" data-a="dec" data-k="'+k+'">&minus;</div><div class="ui-tr" data-a="sl" data-k="'+k+'"><div class="ui-fl" id="uiF_'+k+'" style="width:'+p+'%"></div><div class="ui-th" id="uiT_'+k+'" style="left:'+p+'%"></div></div><div class="ui-pm" data-a="inc" data-k="'+k+'">+</div></div></div>'}
function uiThTg(k,n,a){return '<div class="ui-tg bc-it" data-a="'+(a||'tg')+'"'+(a?'':' data-k="'+k+'"')+'><span class="bc-l">'+n+(uiThHint[k]?'<small>'+uiThHint[k]+'</small>':'')+'</span><div class="ui-sw'+(a?' ui-chip':'')+(uiS[k]?' on':'')+'"></div></div>'}
function uiThSeg(k){const d=uiSegs[k];if(!d)return '';return '<div class="bc-it bc-sgw"><span class="bc-l">'+d[0]+(uiThHint[k]?'<small>'+uiThHint[k]+'</small>':'')+'</span><div class="ui-seg ui-seg'+d[1].length+'">'+d[1].map(o=>'<div class="ui-b'+((uiS[k]|0)===o[0]?' on':'')+'" data-a="seg" data-k="'+k+'" data-v="'+o[0]+'">'+o[1]+'</div>').join('')+'</div></div>'}
function uiThRot(){return '<div class="bc-it bc-sgw"><span class="bc-l">Rotate screen<small>'+uiThHint.rot+'</small></span><div class="ui-seg ui-seg4">'+[0,1,3,2].map(m=>'<div class="ui-b'+((uiS.rot|0)===m?' on':'')+'" data-a="rotset" data-k="'+m+'">'+uiRotName[m]+'</div>').join('')+'</div></div>'}
function uiThHelp(){const r=(a,b)=>'<div class="bc-kv"><span>'+a+'</span><em>'+b+'</em></div>',K=s=>s.split(' ').map(x=>'<span class="bc-key">'+x+'</span>').join('');
 return '<div class="bc-help bc-tch">'+r('Move','Left thumb')+r('Look','Drag the right side')+r('Zoom','Pinch')+r('Shoot','Tap a target or FIRE')+r('Vehicles','Car button')+r('Map','Tap the radar')+'</div>'
  +'<div class="bc-help bc-kbh">'+r('Move',K('W A S D'))+r('Look','Right drag or '+K('&larr; &rarr;'))+r('Zoom, first person','Wheel')+r('Shift lock',K('Shift'))+r('Jump',K('Space'))+r('Shoot','Click or '+K('F'))+r('Vehicle',K('E'))+r('Weapons',K('1 2 3 4 Q'))+r('Map',K('Tab M'))+r('Phone',K('T'))+r('Menu',K('Esc'))+'</div>'}
function uiThAcct(){if(typeof acOpenPanel!=='function')return '<div class="bc-card"><b>Accounts</b><p>Your game saves on this device.</p></div>';
 let u=null,m='';try{u=acUser;m=u&&typeof acMask==='function'?acMask(u.email):''}catch(e){}
 return '<div class="bc-card"><b>'+(u?'Signed in':'Not signed in')+'</b><p>'+(u?m+'. Your game is saved to your account and works on every device.':'Sign in with your email to keep your game on every device. No password.')+'</p><div class="ui-b" data-a="acct">'+(u?'Manage account':'Sign in')+'</div></div>'
  +'<div class="bc-card"><b>On this device</b><p>The game also saves here automatically.</p></div>'}
uiTabHtml=function(){const S=uiThSl,T=uiThTg,G=uiThSeg,H=s=>'<div class="bc-sec">'+s+'</div>',t=uiTab;
 if(t==='ctl')return H('Touch')+S('sens')+T('invY','Invert camera Y')+T('lh','Left-handed layout')+S('bsz')+S('jsz')+S('dz')+T('vib','Vibration')+H('How to play')+uiThHelp();
 if(t==='cam')return H('Camera')+S('fov')+S('cd')+T('fp','Always first person')+T('ac','Auto-centre behind vehicles')+T('shake','Camera shake')+H('Screen')+uiThRot();
 if(t==='gfx')return H('Graphics')+T('auto','Automatic quality','auto')+S('q')+(uiGX()?S('gxScale')+G('gxShadow')+T('gxSharp','Sharpening')+T('gxAO','Ambient occlusion'):'')+H('HUD')+S('hud')+S('hop')+T('nomap','Hide minimap')+T('fps','Show FPS')+H('Accessibility')+G('cb')+T('rm','Reduced motion');
 if(t==='aud')return H('Volume')+S('vol')+S('mus')+S('sfxv')+S('amb')+H('Dialogue')+T('subs','Subtitles');
 if(t==='play')return H('World')+G('diff')+S('day')+S('traf')+S('ped')+G('mph')+H('Progress')+'<div class="bc-danger">'+(uiPrev==='ready'?'':'<div class="ui-b" data-a="respawn">Respawn</div>')+'<div class="ui-b ui-warn" data-a="wipe">'+(uiConfirm?'Tap again to erase':'Erase saved game')+'</div></div>';
 return H('Account')+uiThAcct()};
uiRender=function(){const ready=uiPrev==='ready',jobs=typeof msPassed!=='undefined'?' &middot; '+msPassed+' jobs':'',rs=uiThRst===uiTab&&performance.now()-uiThRstT<2500;
 uiSet.innerHTML='<div class="ui-pan ui-pan2 bc-set"><div class="ui-hd"><b>'+(ready?'Settings':'Paused')+'</b><span>$'+cash+' &middot; '+kills+' takedowns &middot; '+coinN+' coins'+jobs+'</span></div>'
  +'<div class="bc-body"><div class="ui-tabs">'+uiTabs.map(t=>'<div class="ui-b'+(uiTab===t[0]?' on':'')+'" data-a="tab" data-k="'+t[0]+'"'+(t[0]==='acct'?' id="acBtnS"':'')+'>'+t[1]+(t[0]==='acct'?'<span class="ac-dot" style="display:none"></span>':'')+'</div>').join('')+'</div>'
  +'<div class="ui-tc"><div class="ui-tci">'+uiTabHtml()+'</div></div></div>'
  +'<div class="ui-ft">'+(uiThKeys[uiTab]?'<div class="ui-b" data-a="treset">'+(rs?'Restored':'Reset tab')+'</div>':'')+'<div class="ui-b ui-res" data-a="close">'+(ready?'Done':'Resume')+'</div></div></div>';
 const tc=uiSet.querySelector('.ui-tc');if(tc)tc.scrollTop=uiTcY};
function uiThReset(t){const D=Object.assign({},uiDef,uiDef2),L=uiThKeys[t];if(!L)return;for(const k of L)if(k in D)uiS[k]=D[k];
 uiSens=uiS.sens;uiInvY=uiS.invY?-1:1;uiAutoBad=0;if(L.indexOf('rot')>=0){uiS.hint=1;uiApplyRot()}uiLayout();uiApply2();uiApplyQ();uiVolT=0;uiSave();uiThRst=t;uiThRstT=performance.now();uiTcY=0;uiRender()}
uiSet.addEventListener('touchstart',e=>{const el=e.target&&e.target.closest?e.target.closest('[data-a]'):null;if(!el)return;const a=el.getAttribute('data-a');
 if(a==='treset')uiThReset(uiTab);else if(a==='acct'){if(typeof acOpenPanel==='function')acOpenPanel()}},{passive:false});
// ----- title: clear menu (Continue / Play, Character, Settings, Account, Credits), version in the corner -----
{const ts2=uiTitleSync;uiTitleSync=function(){ts2();
 const side=uiRotOK&&(inRot||uiRH()>uiRW()*1.05),ver=(($('msg').textContent||'').match(/version\s*\d+/i)||[''])[0],ri='<i style="transform:scaleX(-1);background-image:'+uiIc(uiI.rot).split('"').join('&quot;')+'"></i>';
 let save=false,who='',where='';try{save=!!localStorage.getItem('blockcity_save')}catch(e){}
 try{if(typeof chName==='function')who=chName();if(typeof chSpawnPick==='function')where=(chSpawnPick()||{}).label||''}catch(e){}
 const row=(attr,ic,l,sub)=>'<div class="ui-b bc-mi" '+attr+'>'+uiThIco(ic)+'<span class="bc-mt"><span>'+l+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</span>'+uiThIco(uiThI.chev,'bc-chev')+'</div>';
 uiTitle.innerHTML='<div class="bc-tw"><div class="ui-wm"><span class="ui-wl"><b>Block</b><b>City</b></span><div class="ui-rule"></div><div class="ui-tl">Open world &middot; Drive &middot; Fly &middot; Rule</div></div></div>'
  +'<div class="bc-tm"><div class="ui-b ui-play ui-play2">'+(save?'Continue':'Play')+'</div><div class="bc-list">'
  +(typeof chOpen==='function'?row('data-m="char"',uiThI.user,'Character',(who?who+(where?' &middot; '+where:''):'')):'')
  +row('data-a="set"',uiThI.sliders,'Settings')
  +(typeof acOpenPanel==='function'?row('data-m="acct" id="acBtnT"',uiThI.acct,'Account<span class="ac-dot" style="display:none"></span>'):'')
  +row('data-m="cred"',uiThI.info,'Credits')+'</div>'
  +(side?'<div class="ui-opt bc-rot"><div class="ui-optl">'+(inRot?'Screen rotated':'Play sideways')+'</div><div class="ui-b'+(inRot===1?' ui-on':'')+'" data-a="rot1">'+uiSpan('rot')+'Turn left</div><div class="ui-b'+(inRot===2?' ui-on':'')+'" data-a="rot2">Turn right'+ri+'</div>'+(inRot?'<div class="ui-b" data-a="rot0">Upright</div>':'')+'</div>':'')
  +'</div><div class="ui-ver">'+ver+'</div>'};
 uiTitleSync()}
uiTitle.addEventListener('touchstart',e=>{const m=e.target&&e.target.closest?e.target.closest('[data-m]'):null;if(!m)return;e.preventDefault();e.stopPropagation();const k=m.getAttribute('data-m');
 if(k==='char'){if(typeof chOpen==='function')chOpen('title')}else if(k==='acct'){if(typeof acOpenPanel==='function')acOpenPanel()}else if(k==='cred')uiCredOpen()},{passive:false});
uiTitle.addEventListener('mousedown',e=>{if(e.target&&e.target.closest&&e.target.closest('[data-m]'))e.stopPropagation()});
if(typeof chClose==='function'){const c0=chClose;chClose=function(){const r=c0.apply(this,arguments);try{if(state==='ready'||(state==='settings'&&uiPrev==='ready'))uiTitleSync()}catch(e){}return r}}
// ----- credits -----
const uiCred=document.createElement('div');uiCred.id='uiCred';document.body.appendChild(uiCred);
function uiCredOpen(){const r=(a,b)=>'<div class="bc-kv"><span>'+a+'</span><em>'+b+'</em></div>',ver=(($('msg').textContent||'').match(/version\s*\d+/i)||[''])[0];
 uiCred.innerHTML='<div class="bc-panel"><div class="bc-hd"><b>Credits</b><div class="bc-x" data-m="close">&times;</div></div><p class="bc-lead">Block City is an open-world city game that runs in the browser.</p>'
  +r('Game','Jacob')+r('3D engine','three.js (MIT)')+r('Characters','Microsoft Rocketbox (MIT)')+r('Accounts','Supabase')+r('Radio and music','YouTube')+(ver?r('Version',ver.replace(/version\s*/i,'')):'')
  +'<div class="ui-b bc-btn bc-pri" data-m="close">Close</div></div>';uiCred.classList.add('on')}
function uiCredClose(){uiCred.classList.remove('on')}
uiCred.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const m=e.target&&e.target.closest?e.target.closest('[data-m]'):null;if((m&&m.getAttribute('data-m')==='close')||e.target===uiCred)uiCredClose()},{passive:false});
for(const ty of['touchmove','touchend','mousedown'])uiCred.addEventListener(ty,e=>e.stopPropagation());
addEventListener('keydown',e=>{if(!uiCred.classList.contains('on'))return;if(e.key==='Escape'||e.key==='Enter')uiCredClose();e.stopImmediatePropagation()},true);
// ----- per frame: show the wanted stars only while wanted, grow the status card for the vehicle bar -----
let uiThW=null,uiThV=null;
MODS.push(function(){const w=wanted>0,v=!!driving;if(w!==uiThW){uiThW=w;document.body.classList.toggle('bc-wanted',w)}if(v!==uiThV){uiThV=v;document.body.classList.toggle('bc-veh',v)}});
