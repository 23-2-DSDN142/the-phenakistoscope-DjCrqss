const SLICE_COUNT = 12;

// activates mask for frame views
const doSliceMask = false;

function setup_pScope(pScope) {
  pScope.output_mode(OUTPUT_PRINT(A3));
  pScope.scale_for_screen(true);
  pScope.draw_layer_boundaries(false);
  pScope.set_direction(CCW);
  pScope.set_slice_count(SLICE_COUNT);
}

function setup_layers(pScope) {
  colorMode(HSB, 360)

  // sky and grass
  var layer1 = new PLayer(bg);
  layer1.mode(RING);

  // moon
  var layer4 = new PLayer(moon);
  layer4.mode(RING);

  // lake
  var layer2 = new PLayer(lake);
  layer2.mode(RING);
  strokeCap(SQUARE);

  // bubbles in lake
  var layer6 = new PLayer(bubbles);
  layer6.set_boundary(0, 300);
  layer6.mode(SWIRL(10));

  // trees
  var layer3 = new PLayer(trees);
  layer3.mode(RING);

  // fireflies
  var layer5 = new PLayer(fireflies);
  layer5.mode(RING);

  // mask
  if (doSliceMask) {
    var layermask = new PLayer(mask);
    layermask.mode(RING);
  }

}

/**
 * Draws the sky and grass
 */
function bg(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 - angleOffset;
  let backgroundArcEnd = 270 + angleOffset;

  // sky is a radial gradient from red to purple
  push();
  radialGradient(
    x, y, 1200,//Start pX, pY, start circle radius
    x, y, 2000,//End pX, pY, End circle radius
    color(320, 300, 40, 360), //Start color
    color(265, 300, 30, 360), //End color
  );
  arc(x, y, 2000, 2000, backgroundArcStart, backgroundArcEnd);
  pop();

  // ground is just green
  noStroke();
  fill(96, 135, 30)
  let landHeight = 1050;
  arc(x, y, landHeight, landHeight, backgroundArcStart, backgroundArcEnd);
}

/**
 * Handles drawing moon in sky
 */
function moon(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let moonHeight = 800;
  
  // draw moon
  const moonAngle = ((-animation.frame * (angleOffset * 2)) + 4*angleOffset);
  push();
  rotate(moonAngle);
  translate(0, -moonHeight);
  drawMoonPhase();
  pop();

  // draw extra moon as each slice is offset
  if(animation.frame == 0){
    const moonAngle2 = ((-animation.frame * (angleOffset * 2)) + 4* angleOffset);
    push();
    rotate(moonAngle2 - angleOffset*2);
    translate(0, -moonHeight);
    drawMoonPhase();
    pop();
  }


  /**
   * Draws moon at certain phase
   */
  function drawMoonPhase() {
    let dark = color(295, 180, 45);
    let light = color(255, 0, 280);
    let moonRadius = 180;

    noStroke();
    ellipseMode(CENTER);

    // angle of moon
    a = animation.frame * 360;

    noStroke();

    // colours for moon
    // the moon is made up of 4 arcs, 2 per side, that grow and shrink and
    // swap colours to create the illusion of a moon phase
    let color1;
    let color2;
    let color3;
    let color4;
    if (270 < a && a <= 360) {
      color3 = light;
      color4 = light;
      color1 = light;
      color2 = dark;
    } else if (180 < a && a <= 270) {
      color1 = light;
      color3 = dark;
      color4 = dark;
      color2 = dark;
    } else if (90 < a && a <= 180) {
      color4 = dark;
      color2 = light;
      color1 = dark;
      color3 = dark;
    } else {
      color4 = light;
      color3 = light;
      color1 = dark;
      color2 = light;
    }

    // add glow to mooon
    drawingContext.filter = 'blur(18px)';
    fill(light);
    // circle(a/4, 0, moonRadius);
    circle(0, 0, moonRadius/1.2);
    drawingContext.filter = 'none';

    // draw moon
    fill(color1);
    circle(0, 0, moonRadius);
    // left side of moon
    arc(0, 0, moonRadius, moonRadius, degrees(PI / 2), degrees(3 * PI / 2));
    fill(color2);
    arc(0, 0, moonRadius, moonRadius, degrees(3 * PI / 2), degrees(PI / 2));

    let heightPhase = moonRadius;
    let widthPhase = map(cos(a), 0, 1, 0, moonRadius);

    // right side of moon
    fill(color3);
    arc(0, 0, widthPhase - 2, heightPhase + 1, degrees(PI / 2), degrees(3 * PI / 2));
    fill(color4);
    arc(0, 0, widthPhase - 2, heightPhase + 1, degrees(3 * PI / 2), degrees(PI / 2));

    // extra line in middle to cover pixel gaps
    stroke(color3);
    noFill();
    strokeWeight(2);
    line(0, -moonRadius / 2, 0, moonRadius / 2);
  }

}

/**
 * Draws trees with leaves and shines
 */
function trees(x, y, animation, pScope) {
  // parameters for trees
  let landHeight = 525;
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let arcStart = 270 + angleOffset;
  let arcEnd = 270 - angleOffset;

  noStroke();

  // draw trees from angle arcStart to arcEnd offset from the middle by landHeight
  let treeCount = 2;
  let treeWidth = 40;
  let treeHeight = 220;
  let speed = 0.02;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart + angleOffset / 2, arcEnd + angleOffset / 2, landHeight, speed, 1);

  // another layer of trees
  treeCount = 3;
  treeWidth = 30;
  treeHeight = 200;
  speed = 0.015;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart + angleOffset / 2, arcEnd + angleOffset / 2, landHeight, speed, 2);
  
  // another layer of trees
  treeCount = 4;
  treeWidth = 20;
  treeHeight = 160;
  speed = 0.01;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart + angleOffset / 2, arcEnd + angleOffset / 2, landHeight, speed, 3);
  

  // draw trees from angle arcStart to arcEnd offset from the middle by landHeight
  function drawTrees(treeCount, treeWidth, treeHeight, arcStart, arcEnd, landHeight, speed, layer) {
    for (let i = 0; i < treeCount; i++) {
      // skip if last frame and first tree to reduce flickering
      if(animation.frame > 0.9 && i == 0 && layer != 3){
        continue;
      }

      push();
      let rotation = ((arcEnd - arcStart) / treeCount * i) + (animation.frame * angleOffset*2)/treeCount;
      let progress = animation.frame - 0.5; // used for shine on tree edges

      rotate((-1.5 * angleOffset) + rotation % (angleOffset * 4) + (angleOffset * 2));
      translate(0, -landHeight);
      // trunk
      fill(16, 200, Math.abs(progress)*50);
      rect(0, 0, treeWidth, -treeHeight);
      // leaves
      fill(80, 200, 10*layer + Math.abs(progress)*20);
      triangle(-treeWidth + treeWidth / 2, -treeHeight * 0.95, treeWidth / 2, -treeHeight * 1.3, treeWidth + treeWidth / 2, -treeHeight * 0.95 - 1);
      triangle(-treeWidth * 2 + treeWidth / 2, -treeHeight * 0.7, treeWidth / 2, -treeHeight * 1.1, treeWidth * 2 + treeWidth / 2, -treeHeight * 0.7 - 1);
      triangle(-treeWidth * 3 + treeWidth / 2, -treeHeight * 0.34, treeWidth / 2, -treeHeight * 0.8, treeWidth * 3 + treeWidth / 2, -treeHeight * 0.34 - 1);
      // shines, left side
      stroke(16, 0, Math.abs(progress) * 180);
      strokeWeight(3);
      line(treeWidth/2, -treeHeight * 1.3 , -treeWidth + treeWidth / 2 +5, -treeHeight);
      line(-treeWidth * 2 + treeWidth / 2, -treeHeight * 0.7, 0, -treeHeight);
      line(-treeWidth * 2 + treeWidth / 2, -treeHeight * 0.5, 0, -treeHeight*0.7);
      // right side of tree shine
      progress = animation.frame - 1;
      stroke(16, 0, Math.abs(progress) * 90);
      line(treeWidth/2, -treeHeight * 1.3, treeWidth + treeWidth / 2  -5, -treeHeight);
      line(treeWidth * 2 + treeWidth / 2, -treeHeight * 0.7, treeWidth/2 + treeWidth/3, -treeHeight);
      line(treeWidth * 2 + treeWidth / 2, -treeHeight * 0.5, treeWidth/2 + treeWidth, -treeHeight*0.7);
      pop();
    }

  }
}


/**
 * Draws a lake with water waves
 */
function lake(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  noStroke();

  // parameters for water waves
  let startAngle = 270
  let waterLevel = 300;
  let waveHeight = 12;
  let time = animation.frame * 360;
  // used for calculating water shine
  const moonAngle = ((-animation.frame * (angleOffset * 2)) + angleOffset);

  // water segment
  fill(200, 100, 50, 360);
  beginShape();
  vertex(x, y);
  for (let angle = 0; angle <= 360 / SLICE_COUNT; angle += 0.5) {
    let radius = waterLevel + 35 + cos(angle * 11 + time + 50) * waveHeight;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
    // draw water shine
    let dist = Math.abs((moonAngle - angleOffset/2) - radians(startAngle - angle + angleOffset));
    // let surfaceColor = color(200, 100, 50);
    fill(200, 100, 250, Math.max(0, 40 - dist*5));
    circle(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset), 10);
  }
  vertex(x, y);
  fill(200, 100, 50, 360);
  endShape();
 
  // water segment
  beginShape();
  vertex(x, y);
  for (let angle = 0; angle <= 360 / SLICE_COUNT; angle += 0.5) {
    let radius = waterLevel + 25 + cos(angle * 11 + time + 180) * waveHeight;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
    // draw water shine
    let dist = Math.abs((moonAngle - angleOffset/2) - radians(startAngle - angle + angleOffset));
    fill(180, 170, 250, Math.max(0, 40 - dist*5));
    circle(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset), 5);
  }
  vertex(x, y);
  fill(180, 170, 90, 80);
  endShape();

  // water segment
  beginShape();
  vertex(x, y);
  for (let angle = 0; angle <= 360 / SLICE_COUNT; angle += 0.5) {
    let radius = waterLevel + cos(angle * 11 + time) * waveHeight;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
    // draw water shine
    let dist = Math.abs((moonAngle - angleOffset/2) - radians(startAngle - angle + angleOffset));
    fill(200, 220, 250, Math.max(0, 40 - dist*5));
    circle(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset), 5);
  }
  vertex(x, y);
  fill(200, 220, 100, 80);
  endShape();

  // Inner water segment with radial gradient to fade to black in the middle
  push();
  radialGradient(
    x, y, 0,//Start pX, pY, start circle radius
    x, y, waterLevel * 2,//End pX, pY, End circle radius
    color(0, 0, 0, 200), //Start color
    color(180, 208, 150, 80), //End color
  );
  beginShape();
  vertex(x, y);
  for (let angle = 0; angle < 360 / SLICE_COUNT; angle += 0.5) {
    let radius = waterLevel - 20 + cos(angle * 11 + time + 80) * waveHeight;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
    push();
     // draw water shine
     let dist = Math.abs((moonAngle - angleOffset/2) - radians(startAngle - angle + angleOffset));
     fill(200, 220, 250, Math.max(0, 40 - dist*5));
     circle(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset), 5);
      pop();
  }
  vertex(x, y);
  endShape();
  pop();

  noStroke();
  fill(255)
}


/**
 * Draws fireflies on the ground
 */
function fireflies(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 + angleOffset;
  let backgroundArcEnd = 270 - angleOffset;

  // draw fireflies with parameters
  let fireflyCount = 1;
  let fireflySize = 10;
  let fireflyOffset = -2;
  let fireflyHeight = 520;
  drawFireflies(fireflyCount, fireflySize, backgroundArcStart + angleOffset / 2, backgroundArcEnd + angleOffset / 2, fireflyOffset, fireflyHeight, 0);
   
  fireflyCount = 2;
  fireflyHeight = 450;
  fireflyOffset = 2;
  fireflySize = 8;
  drawFireflies(fireflyCount, fireflySize, backgroundArcStart + angleOffset / 2, backgroundArcEnd + angleOffset / 2, fireflyOffset, fireflyHeight, 0);
  
  fireflyCount = 1;
  fireflyHeight = 400;
  fireflyOffset = -5;
  fireflySize = 9;
  drawFireflies(fireflyCount, fireflySize, backgroundArcStart + angleOffset / 2, backgroundArcEnd + angleOffset / 2, fireflyOffset, fireflyHeight, 0);

  // function to draw fireflies
  function drawFireflies(fireflyCount, fireflySize, arcStart, arcEnd, fireflyOffset, fireflyHeight) {
    noStroke();
    for (let i = 0; i < fireflyCount; i++) {
      let rotation = ((arcEnd - arcStart) / fireflyCount * i) + fireflyOffset + sin( (animation.frame * 360 + (i-1)*180 + fireflyOffset*30) )/5;
      let opacity = sin( (animation.frame * 360 + (i-1)*90 + fireflyOffset*30) ) * 140 + 220;
      
      push();
      rotate(rotation);
      translate(0, -fireflyHeight - sin( (animation.frame * 360 + (i)*180 + fireflyOffset*30) ) * 6);
      // draw glow of firefly with blurred pixel
      fill(20, 300, 360, opacity);
      drawingContext.filter = 'blur(20px)';
      rect(-fireflySize * 2, -fireflySize, fireflySize * 4, fireflySize * 4);
      fill(20, 300, 250, opacity);
      // draw pixels of firefly
      drawingContext.filter = 'none';
      rect(0, 0, fireflySize, fireflySize);
      pop();
    }
  }
}


/**
 * Draws a bubble in the lake
 * The position is modified by the animation's wave function
 */
function bubbles(x, y, animation, pScope) {
  let brightness = Math.sin(animation.frame * PI);

  noStroke();
  fill(180, 150, 255, brightness * 80);
  circle(x + animation.wave(.9) * 100, y, 7);
}

/**
 * draws a mask for the phenakistoscope's single slice
 */
function mask(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let arcStart = 270 + angleOffset;
  let arcEnd = 270 - angleOffset;

  fill(255);
  noStroke();
  arc(x, y, 2000, 2000, arcStart, arcEnd);
}


// HELPER FUNCTIONS from previous assignment
/** 
 * draws a linear gradient given starting and ending X and Y coordinates and colours
 * uses javascript's drawing context rather than p5 as it is much more efficient
 * @param {number} sX starting x coordinate
 * @param {number} sY starting y coordinate
 * @param {number} eX ending x coordinate
 * @param {number} eY ending y coordinate
 * @param {p5.Color} colorS starting colour
 * @param {p5.Color} colorE ending colour
 */
function linearGradient(sX, sY, eX, eY, colorS, colorE) {
  let gradient = drawingContext.createLinearGradient(
    sX, sY, eX, eY
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
}

function radialGradient(sX, sY, sR, eX, eY, eR, colorS, colorE) {
  let gradient = drawingContext.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);

  drawingContext.fillStyle = gradient;
}