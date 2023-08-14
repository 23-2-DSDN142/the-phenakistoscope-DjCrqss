const SLICE_COUNT = 12;

// activates mask for frame views
const output_mode = 'ANIMATED_DISK';

function setup_pScope(pScope) {
  pScope.output_mode(ANIMATED_DISK);
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

  var layer6 = new PLayer(bubbles);
  layer6.set_boundary(0, 400);
  layer6.mode(SWIRL(10));

  // // trees
  var layer3 = new PLayer(trees);
  layer3.mode(RING);

  // fireflies
  var layer5 = new PLayer(fireflies);
  layer5.mode(RING);

  if (output_mode == 'ANIMATED_FRAME' || output_mode == 'STATIC_FRAME') {
    var layermask = new PLayer(mask);
    layermask.mode(RING);
  }

}

function bg(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 - angleOffset;
  let backgroundArcEnd = 270 + angleOffset;

  fill(265, 300, 30, 360);
  arc(x, y, 2000, 2000, backgroundArcStart, backgroundArcEnd);

  push();
  radialGradient(
    x, y, 1000,//Start pX, pY, start circle radius
    x, y, 2000,//End pX, pY, End circle radius
    color(320, 300, 40, 360), //Start color
    color(265, 300, 30, 360), //End color
  );
  arc(x, y, 2000, 2000, backgroundArcStart, backgroundArcEnd);
  pop();

  noStroke();
  fill(96, 135, 30)
  let landHeight = 1240;
  arc(x, y, landHeight, landHeight, backgroundArcStart, backgroundArcEnd);
}

function moon(x, y, animation, pScope) {
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 + angleOffset;
  let backgroundArcEnd = 270 - angleOffset;
  // draw moon
  let moonRadius = 100;
  let moonHeight = 800;

  const moonAngle = ((-animation.frame * (angleOffset * 2)) + angleOffset);
  // const moonAngle = angleOffset;
  push();
  rotate(moonAngle);
  translate(0, -moonHeight);
  drawMoonPhase();
  pop();

  if(animation.frame == 0){
    const moonAngle2 = ((-animation.frame * (angleOffset * 2)) + angleOffset);
    push();
    rotate(moonAngle2 - angleOffset*2);
    translate(0, -moonHeight);
    drawMoonPhase();
    pop();
  }


  function drawMoonPhase() {
    let bg_color = color(265, 50, 20);
    let light_color = color(255, 0, 255);
    let moonRadius = 100;

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
      color3 = light_color;
      color4 = light_color;
      color1 = light_color;
      color2 = bg_color;
    } else if (180 < a && a <= 270) {
      color1 = light_color;
      color3 = bg_color;
      color4 = bg_color;
      color2 = bg_color;
    } else if (90 < a && a <= 180) {
      color4 = bg_color;
      color2 = light_color;
      color1 = bg_color;
      color3 = bg_color;
    } else {
      color4 = color(0, 255, 0, 0);
      color3 = light_color;
      color1 = bg_color;
      color2 = light_color;
    }

    // add glow
    drawingContext.filter = 'blur(20px)';
    fill(light_color);
    // circle(a/4, 0, moonRadius);
    circle(0, 0, moonRadius);
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
  let landHeight = 620;
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let arcStart = 270 + angleOffset;
  let arcEnd = 270 - angleOffset;

  // console.log(pScope.output_mode);

  noStroke();

  fill(16, 200, 20);
  // fill(0, 0, 255)

  // draw trees from angle arcStart to arcEnd offset from the middle by landHeight
  let treeCount = 4;
  let treeWidth = 30;
  let treeHeight = 140;
  let speed = 0.02;
  // drawTrees(treeCount, treeWidth, treeHeight, arcStart, arcEnd, landHeight, speed);
  drawTrees(treeCount, treeWidth, treeHeight, arcStart + angleOffset / 2, arcEnd + angleOffset / 2, landHeight, speed);


  treeCount = 2;
  treeWidth = 20;
  treeHeight = 120;
  speed = 0.015;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart + angleOffset / 2, arcEnd + angleOffset / 2, landHeight, speed);
  
  treeCount = 12;
  treeWidth = 10;
  treeHeight = 80;
  speed = 0.01;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart + angleOffset / 2, arcEnd + angleOffset / 2, landHeight, speed);
  

  // draw trees from angle arcStart to arcEnd offset from the middle by landHeight
  function drawTrees(treeCount, treeWidth, treeHeight, arcStart, arcEnd, landHeight, speed) {
    for (let i = 0; i < treeCount; i++) {
      push();
      let rotation = ((arcEnd - arcStart) / treeCount * i) + (animation.frame * angleOffset *2)/treeCount;
      rotate((-1.5 * angleOffset) + rotation % (angleOffset * 4) + (angleOffset * 2));
      translate(0, -landHeight);
      // trunk
      rect(0, 0, treeWidth, -treeHeight);
      // leaves
      triangle(-treeWidth + treeWidth / 2, -treeHeight * 0.95, treeWidth / 2, -treeHeight * 1.3, treeWidth + treeWidth / 2, -treeHeight * 0.95 - 1);
      triangle(-treeWidth * 2 + treeWidth / 2, -treeHeight * 0.7, treeWidth / 2, -treeHeight * 1.1, treeWidth * 2 + treeWidth / 2, -treeHeight * 0.7 - 1);
      triangle(-treeWidth * 3 + treeWidth / 2, -treeHeight * 0.34, treeWidth / 2, -treeHeight * 0.8, treeWidth * 3 + treeWidth / 2, -treeHeight * 0.34 - 1);
      pop();
    }

  }
}

function lake(x, y, animation, pScope) {

  // this is how you set up a background for a specific layer
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 + angleOffset;
  let backgroundArcEnd = 270 - angleOffset;


  noStroke();

  // create shape
  let startAngle = 270
  let waterLevel = 450;
  let waveHeight = 12;
  let time = animation.frame * 360;


  fill(200, 100, 50, 360);
  beginShape();
  vertex(x, y);
  for (let angle = 0; angle <= 360 / SLICE_COUNT; angle += 0.5) {
    let radius = waterLevel + 35 + cos(angle * 12 + time + 50) * waveHeight;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
  }
  vertex(x, y);
  endShape();

  fill(180, 170, 90, 80);
  beginShape();
  vertex(x, y);
  for (let angle = 0; angle <= 360 / SLICE_COUNT; angle += 0.5) {
    let radius = waterLevel + 25 + cos(angle * 12 + time + 180) * waveHeight;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
  }
  vertex(x, y);
  endShape();

  fill(200, 220, 100, 80);
  beginShape();
  vertex(x, y);
  for (let angle = 0; angle <= 360 / SLICE_COUNT; angle += 0.5) {
    let radius = waterLevel + cos(angle * 12 + time) * waveHeight;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
  }
  vertex(x, y);
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
    let radius = waterLevel - 20 + cos(angle * 12 + time + 80) * waveHeight;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
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
  let fireflyCount = 2;
  let fireflySize = 10;
  let fireflyOffset = 0;
  let fireflyHeight = 600;
  drawFireflies(fireflyCount, fireflySize, backgroundArcStart + angleOffset / 2, backgroundArcEnd + angleOffset / 2, fireflyOffset, fireflyHeight, 0);
   
  fireflyHeight = 650;
  fireflyOffset = 20;
  fireflySize = 8;
  fireflyCount = 1;
  drawFireflies(fireflyCount, fireflySize, backgroundArcStart + angleOffset / 2, backgroundArcEnd + angleOffset / 2, fireflyOffset, fireflyHeight, 0);
  
  fireflyHeight = 550;
  fireflyOffset = 0;
  fireflySize = 9;
  fireflyCount = 1;
  drawFireflies(fireflyCount, fireflySize, backgroundArcStart + angleOffset / 2, backgroundArcEnd + angleOffset / 2, fireflyOffset, fireflyHeight, 0);
  
  function drawFireflies(fireflyCount, fireflySize, arcStart, arcEnd, fireflyOffset, fireflyHeight) {
    noStroke();
    for (let i = 0; i < fireflyCount; i++) {
      let rotation = ((arcEnd - arcStart) / fireflyCount * i) + (animation.frame * angleOffset *2)/ fireflyCount + fireflyOffset;
      if(rotation/fireflyCount + fireflyOffset < -6.9 || rotation/fireflyCount - fireflyOffset > 26){
        continue;
      }
      
      push();
      rotate(rotation);
      translate(0, -fireflyHeight - animation.wave(1) * 20);
      // blur
      fill(20, 300, 360);
      drawingContext.filter = 'blur(20px)';
      rect(-fireflySize * 2, -fireflySize, fireflySize * 4, fireflySize * 4);
      fill(20, 300, 250);
      
      drawingContext.filter = 'none';
      rect(0, 0, fireflySize, fireflySize);
      pop();
    }
  }
}


function bubbles(x, y, animation, pScope) {
  // animation.frame goes from 0 to 1, let brightness go from 0 to 1 and back to 0
  let brightness = Math.sin(animation.frame * PI);

  noStroke();
  fill(180, 150, 255, brightness * 80);
  circle(x + animation.wave(1.1) * 100, y, 7);
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