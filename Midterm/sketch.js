var birds = [];
var birdsX = [];

var people = [];
var personX = [];
var personY = [];

var shirtColor;

var character;

let timeSinceLastBlink, alphaVal;
let timeElapsed;
let blink;
let alphaUp;

let bigBird;

function setup() {
  createCanvas(windowWidth, windowHeight + 150);
  background(255);

  character = new Player(width / 4, height / 2);

  // for loop to generate humans in an array
  for (var i = 0; i < 3; i++) {
    personX.push(i * 35 + 50);
    for (var j = 0; j < 3; j++) {
      if (j == 0) {
        personY.push(random(280, 400));
      } else if (j == 1) {
        personY.push(random(420, 500));
      } else {
        personY.push(random(520, 600));
      }

      people.push(new Human(personX[i], personY[3 * i + j]));
    }
  }

  // for loop to generate birds at top of screen
  for (var i = 0; i < 50; i++) {
    birdsX.push(i * 65 + 50);

    birds.push(new Pidgeon(birdsX[i], 80, character));
  }

  timeSinceLastBlink = 0;
  alphaVal = 0;
  blink = 0;
  alphaUp = true;

  bigBird = new Pidgeon(width / 2 + 100, height / 2 - 10, character);
}

function draw() {
  outside();
}

function outside() {
  background(45, 155, 232);

  //telephone line where birds are sitting
  stroke(0);
  strokeWeight(5);
  noFill();
  line(0, 95, width, 95);

  //asphalt
  noStroke();
  fill(100);
  rect(width / 2, height / 2 + 180, width, 700);

  //player walkway
  fill(180);
  rect(width / 2 + 30, height / 2, width, 100);

  //human walkway
  fill(50);
  rect(width / 15 - 8, height / 2 + 180, 150, 700);

  // spawns people on the left
  for (var i = 0; i < 9; i++) {
    if (i % 3 == 0) {
      shirtColor = 0;
    } else if (i % 3 == 1) {
      shirtColor = 1;
    } else {
      shirtColor = 2;
    }

    if (blink != 3) {
      people[i].walk();
    }
    people[i].display();

    if (blink == 1) {
      if (i % 3 == 0) {
        people[i].birdHead();
      } else {
        people[i].normalHead();
      }
    } else if (blink == 2) {
      if (i % 3 == 0 || i % 3 == 1) {
        people[i].birdHead();
      } else {
        people[i].normalHead();
      }
    } else if (blink == 3) {
      people[i].birdHead();
    } else {
      people[i].normalHead();
    }
  }

  // spawns birds
  for (var i = 0; i < 50; i++) {
    push();
    birds[i].flip();
    birds[i].display();
    pop();
  }

  // moves player character with A/D keys or arrow keys
  if (keyIsDown(97) || keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
    character.left();
  } else if (keyIsDown(100) || keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    character.right();
  }

  push();
  // character.shake();
  character.display();
  pop();

  if (blink == 3) {
    push();
    translate(width / 2, height / 2);
    scale(5);
    translate(-width / 2, -height / 2);
    bigBird.display();
    pop();
  }

  timeElapsed = millis() - timeSinceLastBlink;
  blinking();
}

class Pidgeon {
  constructor(x, y, target) {
    this.x = x;
    this.y = y;

    this.target = target;
  }

  display() {
    translate(this.x, this.y);
    scale(0.75);
    translate(-this.x, -this.y);
    push();
    ellipseMode(CENTER);
    noStroke();
    fill(160, 161, 165);
    ellipse(this.x, this.y, 70, 40); // body

    fill(74, 94, 123);
    ellipse(this.x - 30, this.y - 20, 20, 40); // head

    fill(255);
    ellipse(this.x - 32, this.y - 25, 7, 7); // iris

    fill(0);
    ellipse(this.x - 32, this.y - 25, 5, 5); // pupil

    fill(77, 77, 79);
    triangle(
      this.x - 39,
      this.y - 28,
      this.x - 40,
      this.y - 20,
      this.x - 50,
      this.y - 20
    ); // beak
    pop();
  }

  flip() {
    if (this.target.position.x > this.x - 30) {
      translate(this.x, this.y);
      scale(-1, 1);
      translate(-this.x, -this.y);
    } else {
      scale(1, 1);
    }
  }
}

class Human {
  constructor(x, y) {
    this.position = createVector(x, y);

    this.change = createVector(0, -1);

    this.starting = y;
  }

  display() {
    rectMode(CENTER);

    stroke(0);
    strokeWeight(1);
    if (shirtColor == 0) {
      fill(69, 111, 154);
    } else if (shirtColor == 1) {
      fill(103, 92, 34);
    } else {
      fill(34, 103, 35);
    }
    rect(this.position.x, this.position.y, 20, 50); // body
  }

  normalHead() {
    fill(216, 188, 102);
    ellipse(this.position.x, this.position.y - 30, 30, 40); // head

    fill(0);
    ellipse(this.position.x - 5, this.position.y - 33, 5, 5);
    ellipse(this.position.x + 5, this.position.y - 33, 5, 5); // eyes
  }

  birdHead() {
    push();
    translate(this.position.x, this.position.y);
    scale(-1, 1);
    translate(-this.position.x, -this.position.y);
    fill(74, 94, 123);
    ellipse(this.position.x, this.position.y - 30, 30, 40); // head

    noStroke();
    fill(255);
    ellipse(this.position.x - 5, this.position.y - 33, 7, 7); // iris

    fill(0);
    ellipse(this.position.x - 5, this.position.y - 33, 5, 5); // pupil

    fill(77, 77, 79);
    triangle(
      this.position.x - 15,
      this.position.y - 28,
      this.position.x - 11,
      this.position.y - 20,
      this.position.x - 22,
      this.position.y - 22
    ); // beak
    pop();
  }

  walk() {
    this.position.add(this.change);
    if (this.position.y > this.starting + 30) {
      this.change = createVector(0, -1);
    } else if (this.position.y < this.starting - 30) {
      this.change = createVector(0, 1);
    }
  }
}

class Player {
  constructor(x, y) {
    this.position = createVector(x, y);

    this.changeRight = createVector(5, 0);
    this.changeLeft = createVector(-5, 0);

    this.shakeX = createVector(0, 0);
  }

  display() {
    fill(184, 39, 19);
    rect(this.position.x, this.position.y, 20, 50); // body

    fill(216, 188, 102);
    ellipse(this.position.x, this.position.y - 30, 30, 40); // head

    fill(0);
    ellipse(this.position.x - 5, this.position.y - 33, 5, 5);
    ellipse(this.position.x + 5, this.position.y - 33, 5, 5); // eyes
  }

  left() {
    this.position.add(this.changeLeft);
  }

  right() {
    this.position.add(this.changeRight);
  }

  // WIP
  // shake() {
  //   let shakeX = 0;

  //   if (blink == 1) {
  //     this.shakeX.x = 2;
  //     if (this.shakeX.x >= 2) {
  //       this.shakeX.x -= 1;
  //     } else if (this.shakeX.x <= -2) {
  //       this.shakeX.x += 1;
  //     }
  //   } else if (blink == 2) {
  //     this.shakeX.x += 2;
  //     if (this.shakeX.x >= 4) {
  //       this.shakeX.x -= 2;
  //     } else if (this.shakeX.x <= -4) {
  //       this.shakeX.x += 2;
  //     }
  //   } else if (blink == 3) {
  //     this.shakeX.x += 8;
  //     if (this.shakeX.x >= 16) {
  //       this.shakeX.x -= 8;
  //     } else if (this.shakeX.x <= -16) {
  //       this.shakeX.x += 8;
  //     }
  //   }

  //   this.position.add(this.shakeX);
  // }
}

function blinking() {
  if (timeElapsed > 20000 && blink == 0) {
    alphaVal += 20;
    if (alphaVal > 255) {
      timeSinceLastBlink = millis();
      blink = 1;
      alphaUp = false;
    }
  } else if (timeElapsed > 1000 && blink == 1 && alphaUp == false) {
    alphaVal -= 20;
    if (alphaVal <= 0) {
      alphaVal = 0;
      alphaUp = true;
    }
  } else if (timeElapsed > 15000 && blink == 1) {
    alphaVal += 20;
    if (alphaVal > 255) {
      timeSinceLastBlink = millis();
      blink = 2;
      alphaUp = false;
    }
  } else if (timeElapsed > 1000 && blink == 2 && alphaUp == false) {
    alphaVal -= 20;
    if (alphaVal <= 0) {
      alphaVal = 0;
      alphaUp = true;
    }
  } else if (timeElapsed > 10000 && blink == 2) {
    alphaVal += 20;
    if (alphaVal > 255) {
      timeSinceLastBlink = millis();
      blink = 3;
      alphaUp = false;
    }
  } else if (timeElapsed > 1000 && blink == 3) {
    alphaVal -= 20;
    if (alphaVal <= 0) {
      alphaVal = 0;
    }
  }

  //black screen to mimic blinking
  fill(0, alphaVal);
  rect(width / 2, height / 2, width, height);
}
