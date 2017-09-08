const {Tractor, SlowCar, Semi, FastCar} = require('./obstacle.js');
const {Platform, Turtle} = require('./platform.js');
const Home = require('./home.js')
const Sprite = require('./Sprite.js')


class Level {
  constructor(squareWidth, score, timer, image, context) {
    this.lives = 4;
    this.timeRemaining = 60;
    this.currentLevel = 1;
    this.gameOver = false;
    this.frameTick = 0;
    this.squareWidth = squareWidth;
    this.score = score;
    this.timer = timer;
    this.image = image;
    this.homes = this.buildHomes();
    this.lifeSprite = new Sprite(750, 57, 23, 23);
    this.run = true;
    this.wait = 0;
    this.respawnToad = true;
    this.context = context;
    this.homeSafe = false;
  }

  addLife() {
    this.lives ++
  }

  death() {
    if (this.lives === 0) {
      this.gameOver = true;
      this.score.setHigh();
    } else {
      this.lives --;
      this.respawnToad = true;
    }
  }

  drawLives(context) {
    for (let i = 0; i < this.lives; i++) {
      context.drawImage(this.image, this.lifeSprite.sourceX, this.lifeSprite.sourceY,
        this.lifeSprite.sourceWidth, this.lifeSprite.sourceHeight, 10 + (35 * i), 725,
        this.lifeSprite.sourceWidth, this.lifeSprite.sourceHeight);
    }
  }

  drawVictory(context) {
    if (this.homeSafe) {
      this.wait++;
      context.fillStyle = 'black';
      context.fillRect(390, 410, 250, 40);
      context.fillStyle = 'red';
      context.font = '24px "Press Start 2P"';
      context.fillText(`TIME: ${this.timer.lastTime}`, 420, 443)
      if (this.wait === 60) {
        // this.homeSafe = false;
        // this.wait = 0;
        this.respawnToad = true;
      }
      if (this.wait > 120) {
        this.homeSafe = false;
        this.wait = 0;
      }
    }
  }

  next() {
    if (this.currentLevel < 3) {
      this.currentLevel ++;
    }
  }

  waitTick() {
    // this.wait++;
    if (this.wait > 60) {
      this.run = true;
      // this.wait = 0;
    }
  }

  buildRoadLevel(level) {
    let autos = []

    switch (level) {
    case 1:
      autos = this.buildRoadRow(Tractor, 614.5, 1, 2, 8, 2, 4, 'black');
      autos = autos.concat(this.buildRoadRow(SlowCar, 564.5, 1, -1, 4, 4, 4, 'black'))
      autos = autos.concat(this.buildRoadRow(FastCar, 514.5, 1, 3, 3, 4, 1, 'black'));
      autos = autos.concat(this.buildRoadRow(Semi, 464.5, 2, -3, 3, 5, 3, 'black'));
      break;
    case 2:
      autos = this.buildRoadRow(Tractor, 614.5, 1, 2, 4, 4, 4, 'black');
      autos = autos.concat(this.buildRoadRow(SlowCar, 564.5, 1, -1, 4, 4, 4, 'black'))
      autos = autos.concat(this.buildRoadRow(FastCar, 514.5, 1, 3, 3, 4, 1, 'black'));
      autos = autos.concat(this.buildRoadRow(Semi, 464.5, 2, -3, 3, 5, 3, 'black'));
      break;
    case 3:
      autos = this.buildRoadRow(Tractor, 614.5, 1, 3, 4, 4, 4, 'black');
      autos = autos.concat(this.buildRoadRow(SlowCar, 564.5, 1, -1, 4, 4, 4, 'black'))
      autos = autos.concat(this.buildRoadRow(FastCar, 514.5, 1, 15, 3, 2, 1, 'black'));
      autos = autos.concat(this.buildRoadRow(Semi, 464.5, 2, -3, 3, 5, 3, 'black'));
      break;
    }
    return autos;
  }

  buildRiverLevel(level) {
    let rivers = [];

    switch (level) {
    case 1:
      rivers = this.buildRiverRow(Turtle, 364.5, 3, -1, 3, 6, 0);
      rivers = rivers.concat(this.buildRiverRow (Platform, 314.5, 3, 2, 2, 4, 2));
      rivers = rivers.concat(this.buildRiverRow (Platform, 264.5, 7, 3, 3, 3, 8));
      rivers = rivers.concat(this.buildRiverRow(Turtle, 214.5, 4, -2, 2, 6, 17));
      rivers = rivers.concat(this.buildRiverRow (Platform, 164.5, 4, 1, 3, 3, 2));
      break;
    case 2:
      rivers = this.buildRiverRow(Turtle, 364.5, 3, -2, 3, 6, 0);
      rivers = rivers.concat(this.buildRiverRow (Platform, 314.5, 3, 3, 2, 4, 2));
      rivers = rivers.concat(this.buildRiverRow (Platform, 264.5, 7, 4, 3, 3, 8));
      rivers = rivers.concat(this.buildRiverRow(Turtle, 214.5, 4, -3, 2, 6, 17));
      rivers = rivers.concat(this.buildRiverRow (Platform, 164.5, 4, 2, 3, 3, 2));
      break;
    case 3:
      rivers = this.buildRiverRow(Turtle, 364.5, 3, -2, 3, 6, 0);
      rivers = rivers.concat(this.buildRiverRow (Platform, 314.5, 3, 3, 4, 3, 2));
      rivers = rivers.concat(this.buildRiverRow (Platform, 264.5, 7, 4, 3, 1, 0));
      rivers = rivers.concat(this.buildRiverRow(Turtle, 214.5, 4, -3, 2, 6, 17));
      rivers = rivers.concat(this.buildRiverRow (Platform, 164.5, 4, 2, 3, 3, 2));
      break;
    }
    return rivers;
  }


  buildRoadRow(vehicleType, yCoordinate, carLength, speed, gap, numCars, offset, color, image) {
    let Type = vehicleType;
    let vehicleyCoordinate = yCoordinate;
    let vehicleLength = carLength * this.squareWidth;
    let vehicleSpeed = speed;
    let vehicleGap = gap * this.squareWidth;
    let numVehicles = numCars;
    let rowOffset = offset * this.squareWidth;
    let roadArray = [];
    let obstImage = image;

    for (let i = 0; i < numVehicles; i++) {
      roadArray.push(new Type((vehicleLength + vehicleGap) * i, vehicleyCoordinate, vehicleLength, vehicleSpeed, vehicleGap, rowOffset,
      color, obstImage));
    }
    return roadArray;
  }

  buildRiverRow (PlatformType, yCoordinate, platformLength, platformSpeed, platformGap, numPlatforms, platformOffset) {
    let riverArray = [];

    for (let i = 0; i < numPlatforms; i++) {
      if (PlatformType === Turtle) {
        riverArray.push(new PlatformType((platformLength * this.squareWidth + platformGap * this.squareWidth) * i,
        yCoordinate, platformLength * this.squareWidth, platformSpeed, platformGap * this.squareWidth, platformOffset * this.squareWidth,
        i % 3 === 0 ? true : false));
      } else {
        riverArray.push(new PlatformType((platformLength * this.squareWidth + platformGap * this.squareWidth) * i,
        yCoordinate, platformLength * this.squareWidth, platformSpeed, platformGap * this.squareWidth, platformOffset * this.squareWidth))
      }

    }
    return riverArray;
  }
  buildHomes() {
    let homeYcoord = 112.5;
    let startXcoord = 36.5;
    let gap = 148;
    let numberOfHomes = 5;
    let buildHomeArray = [];

    for (let i = 0; i < numberOfHomes; i++) {
      buildHomeArray.push(new Home(
        startXcoord + (this.squareWidth + gap) * i,
        homeYcoord,
        this.squareWidth,
        50,
        this.timer,
        this.score,
        this.image
      ));
    }
    return buildHomeArray;
  }

}

module.exports = Level;
