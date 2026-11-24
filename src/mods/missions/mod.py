# one rep: swap the old delivery-only block in the frame loop for a call into the missions module
_a=s.index("  // missions\n");_b=s.index("  $('cash').textContent='$'+cash;")
rep(s[_a:_b],"  // missions\n  msTick(dt);\n")
