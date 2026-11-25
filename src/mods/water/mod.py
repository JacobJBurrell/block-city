# water: the sea has a bed (deeper further out) and walking slows as it gets deeper; swimming takes over in mod.js
rep("const floorY=0.3;if(pos.y<=floorY)", "const floorY=wtFloorY();if(pos.y<=floorY)")
rep("mag=Math.min(1,Math.hypot(jx,jy));const spd=10;", "mag=Math.min(1,Math.hypot(jx,jy));const spd=wtSpd();")
