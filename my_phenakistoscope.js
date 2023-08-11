const SLICE_COUNT = 10;

function setup_pScope(pScope){
  pScope.output_mode(ANIMATED_DISK); //ANIMATED_DISK
  pScope.scale_for_screen(true);
  pScope.draw_layer_boundaries(true);
  pScope.set_direction(CCW);
  pScope.set_slice_count(SLICE_COUNT);
}

function setup_layers(pScope){
  
  //new PLayer(null, 220);  //lets us draw the whole circle background, ignoring the boundaries

  //pScope.load_image("wallpaper" , "png"); //SWIRL(5)
  colorMode(HSB, 360)

  var layer1 = new PLayer(bg);
  layer1.mode( RING  );
  // layer1.set_boundary( 200, 1000 );

  var layer4 = new PLayer(moon);
  layer4.mode( RING  );


  var layer2 = new PLayer(lake);
  layer2.mode( RING  );
  // layer2.set_boundary( 300, 400 );
  strokeCap(SQUARE);

  var layer3 = new PLayer(trees);
  layer3.mode( RING  );

}

function bg(x, y, animation, pScope){
  // pScope.draw_image("wallpaper", 0,0);
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 + angleOffset;
  let backgroundArcEnd = 270 -angleOffset;
  push();
  radialGradient(
    x, y, 700,//Start pX, pY, start circle radius
    x, y, 1000,//End pX, pY, End circle radius
    color(320, 300, 40, 100), //Start color
    color(265, 300, 30, 100), //End color
  );
  arc(x,y,10000,10000,backgroundArcStart,backgroundArcEnd);
  pop();

  noStroke();
  fill(96, 135, 30)
  let landHeight = 1300;
  arc(x,y,landHeight,landHeight,backgroundArcStart,backgroundArcEnd); // draws "pizza slice" in the background
}

function moon(x, y, animation, pScope){
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 + angleOffset;
  let backgroundArcEnd = 270 -angleOffset;
  // draw moon
  let moonRadius = 100;
  let moonHeight = 800;
  push();
    rotate(backgroundArcStart - (time/200 % (360 / SLICE_COUNT)));
    fill(255, 0, 255);
    translate(0, moonHeight);
    ellipse(0, 0, moonRadius, moonRadius);

  pop();
}

var time = 0;

function trees(x, y, animation, pScope){
  time++;
  
  let landHeight = 650;
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let arcStart = 270 + angleOffset;
  let arcEnd = 270 -angleOffset;

  noStroke();

  fill(16 ,200, 20);
  // fill(0, 0, 255)

  // draw trees from angle arcStart to arcEnd offset from the middle by landHeight
  let treeCount = 3;
  let treeWidth = 30;
  let treeHeight = 140;
  let speed = 0.02;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart, arcEnd, landHeight, speed);

  treeCount = 2;
  treeWidth = 20;
  treeHeight = 120;
  speed = 0.015;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart, arcEnd, landHeight, speed);

  treeCount = 12;
  treeWidth = 10;
  treeHeight = 80;
  speed = 0.01;
  drawTrees(treeCount, treeWidth, treeHeight, arcStart, arcEnd, landHeight, speed);
  
}

function drawTrees(treeCount, treeWidth, treeHeight, arcStart, arcEnd, landHeight, speed){
  for(let i = 0; i < treeCount; i++){
    push();
    rotate((arcStart + (arcEnd - arcStart) / treeCount * i) + (time*speed % (360 / SLICE_COUNT)) );
    translate(0, landHeight);
    // trunk
    rect(0, 0, treeWidth, treeHeight);
    // leaves
    triangle(-treeWidth + treeWidth/2,  treeHeight * 0.95, treeWidth/2, treeHeight*1.3, treeWidth + treeWidth/2,  treeHeight* 0.95 - 1);
    triangle(-treeWidth*2 + treeWidth/2, treeHeight*0.7, treeWidth/2, treeHeight*1.1, treeWidth*2 + treeWidth/2, treeHeight*0.7 - 1);
    triangle(-treeWidth*3 + treeWidth/2, treeHeight*0.34, treeWidth/2, treeHeight*0.8, treeWidth*3 + treeWidth/2, treeHeight*0.34 - 1);
    pop();
  }

}

function lake(x, y, animation, pScope){

  // this is how you set up a background for a specific layer
  let angleOffset = (360 / SLICE_COUNT) / 2;
  let backgroundArcStart = 270 + angleOffset;
  let backgroundArcEnd = 270 -angleOffset;


  noStroke();
  
  // create shape
  let startAngle = 270
  let waterLevel = 500;
  let waveHeight = 12;


  fill(200, 100, 50, 360);
  beginShape();
  vertex(x, y);
  for(let angle = 0; angle < 360/SLICE_COUNT; angle += 0.5){
    let radius = waterLevel+ 35 +  cos(angle*11 + (animation.frame * 360) + 50) * waveHeight ;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
  }
  vertex(x, y);
  endShape();

  fill(180, 170, 90, 80);
  beginShape();
  vertex(x, y);
  for(let angle = 0; angle < 360/SLICE_COUNT; angle += 0.5){
    let radius = waterLevel + 25 +  cos(angle*10 + (animation.frame * 360) + 180) * waveHeight ;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
  }
  vertex(x, y);
  endShape();

  fill(200, 220, 100, 80);
  beginShape();
  vertex(x, y);
  for(let angle = 0; angle < 360/SLICE_COUNT; angle += 0.5){
    let radius = waterLevel +  cos(angle*9 + (animation.frame * 360)) * waveHeight ;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
  }
  vertex(x, y);
  endShape();


  push();
  radialGradient(
    x, y, 0,//Start pX, pY, start circle radius
    x, y, waterLevel * 2,//End pX, pY, End circle radius
    color(0,0,0, 200), //Start color
    color(180, 208, 150, 80), //End color
  );
  beginShape();
  vertex(x, y);
  for(let angle = 0; angle < 360/SLICE_COUNT; angle += 0.5){
    let radius = waterLevel - 20 +  cos(angle*18 + (animation.frame * 360) + 80) * waveHeight ;
    vertex(radius * cos(startAngle - angle + angleOffset), radius * sin(startAngle - angle + angleOffset));
  }
  vertex(x, y);
  endShape();
  pop();




  noStroke();
  fill(255)
  // rect(-10,-300-animation.wave()*50,20,20) // .wave is a cosine wave btw

}


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


function radialGradient(sX, sY, sR, eX, eY, eR, colorS, colorE){
  let gradient = drawingContext.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);

  drawingContext.fillStyle = gradient;
}