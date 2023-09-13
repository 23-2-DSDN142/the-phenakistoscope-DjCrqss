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

function bg(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 - angleOffset;
  let backgroundArcEnd = 270 + angleOffset;


  push();
  radialGradient(
    x, y, 1200,//Start pX, pY, start circle radius
    x, y, 2000,//End pX, pY, End circle radius
    color(320, 300, 40, 360), //Start color
    color(265, 300, 30, 360), //End color
  );
  arc(x, y, 2000, 2000, backgroundArcStart, backgroundArcEnd);
  pop();

  noStroke();
  fill(96, 135, 30)
  let landHeight = 1050;
  arc(x, y, landHeight, landHeight, backgroundArcStart, backgroundArcEnd);
}

function moon(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 + angleOffset;
  let backgroundArcEnd = 270 - angleOffset;
  // draw moon
  let moonHeight = 800;

  const moonAngle = ((-animation.frame * (angleOffset * 2)) + 4*angleOffset);
  // const moonAngle = angleOffset;
  push();
  rotate(moonAngle);
  translate(0, -moonHeight);
  drawMoonPhase();
  pop();

  if(animation.frame == 0){
    const moonAngle2 = ((-animation.frame * (angleOffset * 2)) + 4* angleOffset);
    push();
    rotate(moonAngle2 - angleOffset*2);
    translate(0, -moonHeight);
    drawMoonPhase();
    pop();
  }


  function drawMoonPhase() {
    let dark = color(295, 180, 45);
    let light = color(255, 0, 280);
    let moonRadius = 180;

    noStroke();
    ellipseMode(CENTER);

    // moon
    a = animation.frame * 360;

    noStroke();

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

    // add glow
    drawingContext.filter = 'blur(18px)';
    fill(light);
    // circle(a/4, 0, moonRadius);
    circle(0, 0, moonRadius/1.2);
    drawingContext.filter = 'none';

    fill(color1);
    circle(0, 0, moonRadius);
    // let widthMoonPhase = map(Math.sin(a), -1, 1, -moonRadius, moonRadius);
    arc(0, 0, moonRadius, moonRadius, degrees(PI / 2), degrees(3 * PI / 2));
    fill(color2);
    arc(0, 0, moonRadius, moonRadius, degrees(3 * PI / 2), degrees(PI / 2));



    let heightPhase = moonRadius;
    let widthPhase = map(cos(a), 0, 1, 0, moonRadius);

    fill(color3);
    arc(0, 0, widthPhase - 2, heightPhase + 1, degrees(PI / 2), degrees(3 * PI / 2));
    fill(color4);
    arc(0, 0, widthPhase - 2, heightPhase + 1, degrees(3 * PI / 2), degrees(PI / 2));

    stroke(color3);
    noFill();
    strokeWeight(2);
    line(0, -moonRadius / 2, 0, moonRadius / 2);
  }

}

function trees(x, y, animation, pScope) {
  let landHeight = 525;
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let arcStart = 270 + angleOffset;
  let arcEnd = 270 - angleOffset;

  noStroke();

  
  // fill(0, 0, 255)

  // draw trees from angle arcStart to arcEnd offset from the middle by landHeight
  let treeCount = 2;
  let treeWidth = 40;
  let treeHeight = 220;
  let speed = 0.02;
  // drawTrees(treeCount, treeWidth, treeHeight, arcStart, arcEnd, landHeight, speed);
  drawTrees(treeCount, treeWidth, treeHeight, arcStart + angleOffset / 2, arcEnd + angleOffset / 2, landHeight, speed, 1);


  treeCount = 3;
  treeWidth = 30;
  treeHeight = 200;
  speed = 0.015;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart + angleOffset / 2, arcEnd + angleOffset / 2, landHeight, speed, 2);
  
  treeCount = 4;
  treeWidth = 20;
  treeHeight = 160;
  speed = 0.01;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart + angleOffset / 2, arcEnd + angleOffset / 2, landHeight, speed, 3);
  

  // draw trees from angle arcStart to arcEnd offset from the middle by landHeight
  function drawTrees(treeCount, treeWidth, treeHeight, arcStart, arcEnd, landHeight, speed, layer) {
    for (let i = 0; i < treeCount; i++) {

      if(animation.frame > 0.9 && i == 0 && layer != 3){
        continue;
      }

      push();
      let rotation = ((arcEnd - arcStart) / treeCount * i) + (animation.frame * angleOffset*2)/treeCount;

      // let progress = (rotation) / (angleOffset * 2);
      let progress = animation.frame - 0.5;

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
      // shines
      stroke(16, 0, Math.abs(progress) * 180);
      strokeWeight(3);
      line(treeWidth/2, -treeHeight * 1.3 , -treeWidth + treeWidth / 2 +5, -treeHeight);
      line(-treeWidth * 2 + treeWidth / 2, -treeHeight * 0.7, 0, -treeHeight);
      line(-treeWidth * 2 + treeWidth / 2, -treeHeight * 0.5, 0, -treeHeight*0.7);

      progress = animation.frame - 1;
      
      stroke(16, 0, Math.abs(progress) * 90);
      
      line(treeWidth/2, -treeHeight * 1.3, treeWidth + treeWidth / 2  -5, -treeHeight);
      line(treeWidth * 2 + treeWidth / 2, -treeHeight * 0.7, treeWidth/2 + treeWidth/3, -treeHeight);
      line(treeWidth * 2 + treeWidth / 2, -treeHeight * 0.5, treeWidth/2 + treeWidth, -treeHeight*0.7);
      pop();
    }

  }
}


function createWaterSegment(waterColor , surfaceHue, surfaceSaturation, x, y, startAngle, waterLevel, waveHeight, time, moonAngle, angleOffset, pScope) {
  beginShape();
  vertex(x, y);
  // creates a sine wave from startAngle of segment to the end
  for (let angle = 0; angle <= 360 / SLICE_COUNT; angle += 0.5) {
    let radius = waterLevel + cos(angle * 11 + time) * waveHeight;
    vertex(radius * cos(startAngle - angle), radius * sin(startAngle - angle));
    // draw water shine
    let dist = Math.abs((moonAngle - angleOffset/2) - radians(startAngle - angle + angleOffset));
    fill(surfaceHue, surfaceSaturation, 250, Math.max(0, 40 - dist*5));
    circle(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset), 5);
  }
  vertex(x, y);
  fill(waterColor);
  endShape();
}

function lake(x, y, animation, pScope) {

  let angleOffset = (360 / SLICE_COUNT) / 2;

  noStroke();

  // create shape
  let startAngle = 270
  let waterLevel = 300;
  let waveHeight = 12;
  let time = animation.frame * 360;
  // used for water shine
  const moonAngle = ((-animation.frame * (angleOffset * 2)) + angleOffset);


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
 
  
  // createWaterSegment(color(200, 100, 50), 200, 100, x, y, startAngle, waterLevel, waveHeight, time, moonAngle, angleOffset, pScope);

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
  // rect(-10,-300-animation.wave()*50,20,20) // .wave is a cosine wave btw

}


function fireflies(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 + angleOffset;
  let backgroundArcEnd = 270 - angleOffset;

  // draw fireflies
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

  function drawFireflies(fireflyCount, fireflySize, arcStart, arcEnd, fireflyOffset, fireflyHeight) {
    noStroke();
    for (let i = 0; i < fireflyCount; i++) {
      let rotation = ((arcEnd - arcStart) / fireflyCount * i) + fireflyOffset + sin( (animation.frame * 360 + (i-1)*180 + fireflyOffset*30) )/5;
     
      // let opacity = (((animation.wave(1) ) )* 360);
      // let opacity = animation.wave(1) * 360;
      let opacity = sin( (animation.frame * 360 + (i-1)*90 + fireflyOffset*30) ) * 140 + 220;
      
      
      push();
      rotate(rotation);
      translate(0, -fireflyHeight - sin( (animation.frame * 360 + (i)*180 + fireflyOffset*30) ) * 6);
      // blur
      fill(20, 300, 360, opacity);
      drawingContext.filter = 'blur(20px)';
      rect(-fireflySize * 2, -fireflySize, fireflySize * 4, fireflySize * 4);
      fill(20, 300, 250, opacity);
      
      drawingContext.filter = 'none';
      rect(0, 0, fireflySize, fireflySize);
      pop();
    }
  }
}


function bubbles(x, y, animation, pScope) {
  let brightness = Math.sin(animation.frame * PI);

  noStroke();
  fill(180, 150, 255, brightness * 80);
  circle(x + animation.wave(.9) * 100, y, 7);
}

function mask(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let arcStart = 270 + angleOffset;
  let arcEnd = 270 - angleOffset;

  fill(255);
  noStroke();
  arc(x, y, 2000, 2000, arcStart, arcEnd);
}


// HELPER FUNCTIONS
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