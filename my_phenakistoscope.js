const SLICE_COUNT = 10;

function setup_pScope(pScope){
  pScope.output_mode(ANIMATED_DISK); //ANIMATED_DISK
  pScope.scale_for_screen(true);
  pScope.draw_layer_boundaries(true);
  pScope.set_direction(CCW);
  pScope.set_slice_count(SLICE_COUNT);
}

function setup_layers(pScope){

  new PLayer(null, 220);  //lets us draw the whole circle background, ignoring the boundaries

  pScope.load_image("wallpaper" , "png"); //SWIRL(5)

  var layer1 = new PLayer(bg);
  layer1.mode( RING  );
  // layer1.set_boundary( 200, 1000 );

  var layer2 = new PLayer(lake);
  layer2.mode( RING  );
  // layer2.set_boundary( 300, 400 );
  strokeCap(SQUARE);

  colorMode(HSB, 360)
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