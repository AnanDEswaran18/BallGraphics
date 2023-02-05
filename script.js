const substeps = 12;
const gravity = 0.2;
const bounce = 0;
let boundaryRadius;
let newBall = false;
let newBallRadius = 0;

let objects = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  boundaryRadius = min(innerWidth, innerHeight)*3/8;
}

function draw() {
  background(40);
  stroke(225);
  fill(225);

  textSize(20);
  strokeWeight(1);
  textAlign(CENTER);
  text('Press and hold to create a ball.', width/2, 25);
  textSize(15);
  text('Inside the circle: normal, outside the circle: shoot in', width/2, 45);
  textSize(20);
  text('Press enter to restart.', width/2, height - 15);

  strokeWeight(4);
  
  handleBallCreation();
  drawConstraints();
  drawObjects();
  applyVerlet();
  applyConstraints();
}

function keyPressed() {
  if (keyCode === ENTER) {
    objects = [];
  }
}

function handleBallCreation() {
  if (mouseIsPressed) {
    if (!newBall) {
      newBallRadius = 20;
      newBall = true;
    } else {
      newBallRadius += 2;
      if (newBallRadius > boundaryRadius*2/3) {
        newBallRadius = boundaryRadius*2/3;
      }
    }

    noFill();
    circle(mouseX, mouseY, newBallRadius)
  } else if (newBall == true) {
    newBall = false;
    objects.push({x: mouseX, y: mouseY, oldX: mouseX, oldY: mouseY, radius: newBallRadius});
  }
}

function drawObjects() {
  objects.forEach((object) => {
    circle(object.x, object.y, object.radius);
  });
}

function applyVerlet() {
  objects.forEach((object) => {
    oldX = object.oldX;
    oldY = object.oldY;
    object.oldX = object.x;
    object.oldY = object.y;
    object.x += (object.x - oldX)*0.99;
    object.y += (object.y - oldY + gravity)*0.99;
  })
}

function drawConstraints() {
  noFill();
  circle(width/2, height/2, boundaryRadius*2);
}

function constrainObject(object, index) {
  var centerVec = p5.Vector.sub(createVector(object.x, object.y), createVector(width/2, height/2));
  if (centerVec.mag() > boundaryRadius - object.radius/2) {
    centerVec.setMag(boundaryRadius - object.radius/2);
    corrected = createVector(width/2, height/2).add(centerVec);
    object.x = corrected.x;
    object.y = corrected.y;
  }
  
  objects.forEach((test, testIndex) => {
    if (testIndex == index) {
      return;
    }
    
    var distVec = p5.Vector.sub(createVector(test.x, test.y), createVector(object.x, object.y));
    if (distVec.mag() < object.radius/2 + test.radius/2) {
      distVec.setMag(object.radius/2 + test.radius/2 + bounce);
      var adjustedObject = p5.Vector.sub(createVector(test.x, test.y), distVec);
      var adjustedTest = p5.Vector.sub(createVector(object.x, object.y), distVec.mult(-1));
      object.x = adjustedObject.x;
      object.y = adjustedObject.y;
      test.x = adjustedTest.x;
      test.y = adjustedTest.y;
    }
  })
}

function applyConstraints() {
  for (var i = 0; i < substeps; i++) {
    objects.forEach(constrainObject);
  }
}
