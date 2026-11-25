# Block City

A 3D open-world city game in the style of GTA, made with three.js r147. It runs in a browser (phone or laptop) and as a Scriptable script on iPhone.

- Live game: https://jacobjburrell.github.io/block-city/ (GitHub Pages)
- Sekai shows the live page inside an iframe, so pushing to GitHub updates Sekai too.
- Owner: Jacob. He plays mostly on iPhone (portrait, often inside the Sekai app) and on a Windows laptop in Chrome.

## Never edit index.html by hand

`index.html` and `Block City.js` are build outputs. Change the source in `src/`, then rebuild:

```
python src/build.py
```

That writes `index.html` (the page GitHub Pages serves), `Block City.js` (Scriptable version) and `src/build/test.html` (the game plus test helpers).

## How the source is organised

- `src/base.js`: the original game (a Scriptable script whose HTML lives in one template string). City grid, player, cars, peds, combat, police, missions loop, render loop.
- `src/mods/<name>/mod.js`: each module is plain JavaScript inserted just before the line `// ---------- main loop ----------` in the base, so every module shares one block scope with all game globals (`scene`, `cam`, `pos`, `player`, `driving`, `cars`, `traffic`, `peds`, `shooters`, `solids`, `state`, `cash`, `wanted`, `T`, `dayT`, `HALF`, `roadCenter()` ...).
- `src/mods/<name>/mod.py` (optional): small exact-text edits to the combined source using `rep(old, new)`; `old` must occur exactly once at that point in the build.
- `src/mods/<name>/hook.js` (optional): test-only helpers (`window.__in()`, `__vh.go('heli',0)` etc.); only included in `src/build/test.html`.
- Module order is in `ORDER` in `src/build.py`. Later modules wrap earlier functions by reassignment, e.g. `{const old=drawMap;drawMap=function(){old();/* more */}}`. Prefer wrapping over `rep()`.
- Per-frame code: `MODS.push(function(dt){...})`.

Rules for `mod.js` (it ends up inside a JavaScript template string):
- No backticks, no `${`, no `</script>`. The build checks this.
- Each module prefixes its globals: real `rl`, missions `ms`, audio `au`, vehicles `vh`, world `wd`, airport `ap`, land `ld`, isles `is`, crime `cp`, story `st`, music `mu`, account `ac`, water `wt`, life `lf`, jets `jt`, fixes `fx`, input `in`, map `mp`, ui `ui`, gfx `gx`.

## Modules

| Module | What it does |
|---|---|
| real | Realistic Rocketbox avatars (MIT) loaded from `models/`, animation API `rlPlay`, character creator, spawn choice, HD sports car |
| missions | Jobs (delivery, taxi, hit, getaway, hot car, rampage), shops, saves (`blockcity_save`) |
| audio | Web Audio engine sounds, weapons, radio stations, ambience |
| vehicles | Bikes, helicopters, boats, rooftop helipads, vehicle damage model |
| world | Traffic lights, props, neon, beach, pier, sky, parks |
| airport | West airport, planes, flight model, parachute |
| land | North army base (tanks, jeeps), south hills with BLOCK CITY sign, marina, ferris wheel |
| isles | City-themed islands east (Coral Key, Metro Isle, Lucky Sands, Hikari, Porto Luna, port, volcano), bridges, 18 car types |
| crime | Police escalation (helicopters, SWAT, roadblocks), BUSTED/WASTED, robberies, furnished interiors, shop counters |
| account | Email-code sign-in (Supabase), cloud save, admin flag; setup in docs/ACCOUNT_SETUP.md |
| music | YouTube radio stations and phone Music app (official IFrame player, hidden when the phone is closed); search key in muCfg |
| water | Sea shader, shore foam, swimming and diving, wtHeight(x,z,t) |
| story | GTA-style phone, texting with replies, voice calls (speechSynthesis), properties, crew heists |
| life | Pedestrian and traffic AI, witnesses, beat cops, cinematic intro |
| jets | Fighter jets at the army base |
| fixes | Small glue fixes, map edges, mission pointer, **version number on the title screen** (bump it in `fixes/mod.py`) |
| input | Converts touch, mouse and pen to one input path; keyboard; rotation mapping |
| map | Radar, full map with pan/zoom, labels, fog of war, waypoints, `mpIcons` registry |
| ui | HUD, title screen, settings tabs, rotate modes, first person, Roblox-style mouse controls |
| gfx | Static batching, shadows, upscaler and sharpening, quality levels (`gxApply`) |

## Testing

```
pip install playwright
python -m playwright install chromium
python src/build.py
python src/smoke_test.py
```

The smoke test presses PLAY, drags the joystick with a finger (touch), releases it, fires, walks with W, and lists JavaScript errors. For timed Playwright tests on Windows, launch Chromium with `--use-angle=d3d11 --enable-gpu`; without a GPU the game runs at about 5% speed. 404s for model files are fine offline. For anything visual, open `src/build/test.html` through a local server (`python -m http.server` in the repo root, then http://localhost:8000/src/build/test.html) and look at it. Check both portrait (390x844) and landscape (844x390): the owner usually plays in portrait.

Known gotcha: input arrives as synthetic touch-shaped events dispatched by `input/adapter.js` (it swallows real touch/mouse events in the capture phase). UI buttons should listen for `touchstart`/`touchend` on the element and call `e.stopPropagation()`. Text inputs are exempt so the phone keyboard opens.

## Publishing

After building and testing:

```
git add -A
git commit -m "<what changed>"
git push origin main main:gh-pages
```

Push to both branches: GitHub Pages serves `gh-pages`. The site updates about a minute later; phones may cache for a few minutes. Bump the version number in `src/mods/fixes/mod.py` each release so the owner can confirm the update on the title screen.

## Known open issues

- Story's outdoor for-sale panels still buy outside; they should route through `cpOpenCounter('estate', ...)`.
- Time until PLAY is usable is still 3-8 s: the city build in base, isles, gfx, land and world plus the first-frame shader compile dominate. Models now stream in after the title.
- Islands are not offered as spawn points (isles could export `isSpawns`).
- Gang warning bubbles, honking, pull-over for sirens and fist fights are untested.
- Performance on a real iPhone is unmeasured; `gfx` Auto lowers render scale when fps drops.
