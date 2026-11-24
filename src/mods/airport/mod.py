# airport module reps
rep("if(Math.cos(a)>.5)continue;","if(Math.abs(Math.cos(a))>.5)continue;")          # no hills on the west side
rep("p.x=Math.max(-lim,","p.x=Math.max(-lim-235,")                                    # SHARED(collide limit): walkable west to the airport
rep("if(driving){const c=driving,m=c.m;const throttle=-jy,steer=-jx;","if(driving&&driving.custom){}else if(driving){const c=driving,m=c.m;const throttle=-jy,steer=-jx;")  # SHARED: custom vehicles skip car + on-foot physics
rep("const dist=driving?13:9,h=driving?1.5:2;","const dist=driving?(driving.camD||13):9,h=driving?(driving.camH||1.5):2;")  # SHARED: per-vehicle chase camera distance/height
