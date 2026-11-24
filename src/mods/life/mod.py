# life module reps
rep("continue}const q=p.userData.path;q.t+=","continue}if(p.userData.lfOn)continue;const q=p.userData.path;q.t+=")   # smart pedestrians are moved by the life module
rep("let blocked=false;const ahead=t.alongX","let blocked=!!t.lfStop;const ahead=t.alongX")                      # traffic obeys lights, gaps, crossing people
rep("if(s.kind==='gang'){if(d<30)s.aggro=true;","if(s.kind==='gang'){if(d<30&&lfGangHot(s,d,dt))s.aggro=true;")   # turf gangs warn before attacking
rep(" grade.uniforms.dmg.value=dmgFx;composer.render()}"," lfCam(dt);grade.uniforms.dmg.value=dmgFx;composer.render()}")  # camera hook just before render
