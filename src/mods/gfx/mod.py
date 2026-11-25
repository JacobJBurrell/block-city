rep("sun.target.position.copy(pos);","sun.target.position.copy(pos);gxSun();")

# startup: the first frame waits (boot card still up) until gxStart has compiled the scene's shader programs in parallel (see gfx/mod.js section 6)
rep("requestAnimationFrame(frame)}\n<\\/script>","gxStart(frame)}\n<\\/script>")
# the first frame's rAF timestamp can be older than the script's own clock (it is taken before the long boot task ends), which gave a negative dt:
# the day clock stepped back and the sky reflection map (envTick) was skipped for the first seconds, so every material compiled twice (without, then with it)
rep("const dt=Math.min(0.05,(now-last)/1000)","const dt=Math.max(0,Math.min(0.05,(now-last)/1000))")
