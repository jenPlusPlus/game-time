let style = require('./style.css'); //???
let Game = require('./game.js');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let image = document.getElementById('source');
let startButton = document.getElementById('play-game');
let resetButton = document.getElementById('reset-game');
let game = new Game(canvas, context, image);
let quitLoop = false;

resetButton.disabled = true;

document.addEventListener('keydown', evalInput);
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

window.onload = gameStart;

function gameStart() {
  game.drawBackground();
  context.font = '24px "Press Start 2P"';
  context.fillStyle = 'white';
  context.fillText('Press Start Game to begin', 225, 400);

  context.font = '56px "Press Start 2P"';
  context.fillStyle = '#21DE00';

  context.save();
  context.shadowColor = '#FF00F7'
  context.shadowOffsetX = -3;
  context.shadowOffsetY = 0;
  context.fillText('Toader', 325, 300);

  context.shadowColor = '#FFFF00'
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 3;
  context.fillText('Toader', 325, 300);
  context.restore();
}

function startGame() {
  startButton.disabled = true;
  resetButton.disabled = false;
  game.buildLevel(game.level.currentLevel);
  requestAnimationFrame(function gameLoop() {
    game.drawBackground();
    game.drawGamePieces();
    game.drawLevel();
    game.toad.collisionDetection(game.autos, game.river);
    game.toad.drawToad(context);
    game.checkForWin();
    game.level.respawnToad ? game.toad.respawnToad() : null;
    if (quitLoop) {
      restartGame();
    } else if (game.level.restartGame) {
      gameOver();
    } else {
      requestAnimationFrame(gameLoop);
    }
  })

}

function gameOver() {
  startButton.disabled = false;
  resetButton.disabled = true;
  game.level.restartGame = false;
  game.level.gameOver = false;
  game.level.lives = 4;
  game.level.currentLevel = 1;
  game.score.current = 0;
  game.toad.respawnToad();
  gameStart();
}

function resetGame() {
  quitLoop = true;
}

function restartGame() {
  quitLoop = false;
  game.level.gameOver = false;
  game.level.lives = 4;
  game.level.currentLevel = 1;
  game.score.current = 0;
  game.toad.respawnToad();
  startGame();
}

function evalInput(event) {
  if (!game.toad.respawnMove) {
    game.toad.respawnMove = true;
    game.timer.timerRunning = true;
  }
  event.preventDefault();
  if (event.keyCode === 37) {
    game.toad.moveToad('left', canvas);
  } else if (event.keyCode === 38) {
    game.toad.moveToad('up', canvas);
  } else if (event.keyCode === 39) {
    game.toad.moveToad('right', canvas);
  } else if (event.keyCode === 40) {
    game.toad.moveToad('down', canvas);
  } else if (event.keyCode === 72) {
    game.winLevel();
  }
}
