//canva and paddle properties(ค่าต่างๆ)
const canvas = document.getElementById('gamebox');
const ctx = canvas.getContext('2d');
const canvasWidth = 1200;
const canvasHeight = 600;
const paddleWidth = 10;
const paddleHeight = 80;
const paddleOffsetX = 30;

let playerHP = 4;
let kaijuHP = 25;

const ballSize = 5;
let ballX = canvasWidth - ballSize;
let ballY = canvasHeight / 2;
let ballSpeedX = -8;
let ballSpeedY = 6;

let leftPaddleX = paddleOffsetX;
let leftPaddleY = canvasHeight / 2 - paddleHeight / 2;
let leftPaddleUpPressed = false;
let leftPaddleDownPressed = false;

const kaijuWidth = 150;
const kaijuHeight = 150;
let kaijuX = canvasWidth - kaijuWidth - 30;
let kaijuY = canvasHeight / 2 - kaijuHeight / 2;

let fireballX = 0;
let fireballY = 0;
const fireballWidth = 40;
const fireballHeight = 40;
let fireballSpeedX = 8;
let fireballSpeedY = 5;
let isFiringFireball = false;
let lastFireballCastTime = 0;
// sound เสียง
const paddleHitSound = document.getElementById('paddleHitSound');
const borderHitSound = document.getElementById('borderHitSound');
const playerHurtSound = document.getElementById('hurt');
const kaijuHurtSound = document.getElementById('kaijuhurt');
const fireLaunchSound = document.getElementById('firelaunch');
const bgmusic = document.getElementById('bgmusic');
const roar = document.getElementById('roar');
fireLaunchSound.volume = 0.5;
borderHitSound.volume = 0.2;

let isScored = false;
// start game
function playBackgroundMusic() {
  bgmusic.volume = 0.1;
  bgmusic.play();
  const startButton = document.getElementById('startButton');
  startButton.style.display = 'none';
  setTimeout(() => {
    roar.play();
    moveImageUp();
  }, 1500);
  gameLoop();
}

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', playBackgroundMusic);

function moveImageUp() {
  const kaijuImage = document.getElementById('kaijuImage');
  kaijuImage.classList.add('fade-up');
  kaijuImage.classList.remove('fade-down');
}

function fadeout() {
  const kaijuImage = document.getElementById('kaijuImage');
  kaijuImage.classList.add('fade-down');
  kaijuImage.classList.remove('fade-up');
}

function updateKaijuImage() {
  const kaijuFire = document.getElementById('kaijufire');
  if (kaijuHP < 23) {
    fadeout();
    kaijuFire.style.display = 'block';
  }
}
// check key
document.addEventListener('keydown', (e) => {
  if (e.key === 'w') {
    leftPaddleUpPressed = true;
  } else if (e.key === 's') {
    leftPaddleDownPressed = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w') {
    leftPaddleUpPressed = false;
  } else if (e.key === 's') {
    leftPaddleDownPressed = false;
  }
});

function drawLeftPaddle() {
  ctx.fillStyle = 'white';
  ctx.fillRect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight);
}

function updateLeftPaddle() {
  if (leftPaddleUpPressed && leftPaddleY > 0) {
    leftPaddleY -= 5;
  } else if (leftPaddleDownPressed && leftPaddleY + paddleHeight < canvasHeight) {
    leftPaddleY += 5;
  }
}

function drawBall() {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY - ballSize < 0 || ballY + ballSize > canvasHeight) {
    ballSpeedY = -ballSpeedY;
    borderHitSound.play();
  }

  if (ballX + ballSize > canvasWidth) {
    if (!isScored) {
      kaijuHP = Math.max(0, kaijuHP - 1);
      kaijuHurtSound.play();
      isScored = true;
    }

    ballX = canvasWidth - ballSize;
    ballY = Math.random() * (canvasHeight - ballSize);

    ballY = Math.max(ballY, ballSize);
    ballY = Math.min(ballY, canvasHeight - ballSize);

    ballSpeedX = -8;
    ballSpeedY = Math.random() * 10 - 5;

    isScored = false;
  }

  if (ballX - ballSize < leftPaddleX + paddleWidth && ballX - ballSize > leftPaddleX && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
    paddleHitSound.play();
  }

  if (ballX - ballSize < 0) {
    ballX = canvasWidth - ballSize;
    ballY = Math.random() * (canvasHeight - ballSize);

    ballY = Math.max(ballY, ballSize);
    ballY = Math.min(ballY, canvasHeight - ballSize);

    ballSpeedX = -8;
    ballSpeedY = Math.random() * 10 - 5;
  }
}

function drawFireball() {
  ctx.fillStyle = 'red';
  ctx.fillRect(fireballX, fireballY, fireballWidth, fireballHeight);
  const yellowCenterSize = fireballWidth / 2;
  ctx.fillStyle = 'yellow';
  ctx.fillRect(fireballX + (fireballWidth - yellowCenterSize) / 2, fireballY + (fireballHeight - yellowCenterSize) / 2, yellowCenterSize, yellowCenterSize);
}

function updateFireball() {
  if (isFiringFireball) {
    fireballX += fireballSpeedX;
    if (fireballX < leftPaddleX + paddleWidth && fireballX + fireballWidth > leftPaddleX && fireballY > leftPaddleY && fireballY < leftPaddleY + paddleHeight) {
      playerHP -= 1;
      playerHurtSound.play();
      isFiringFireball = false;
    }

    if (fireballX > canvasWidth) {
      isFiringFireball = false;
    }

    drawFireball();
  }
}

const activeFireballs = [];

function fireballAttack() {
  const currentTime = Date.now();
  const baseInterval = 700;
  const fireballCastInterval = baseInterval + (kaijuHP * 100);

  if (kaijuHP <= 23 && currentTime - lastFireballCastTime >= fireballCastInterval) {
    lastFireballCastTime = currentTime;
    fireLaunchSound.currentTime = 0;
    fireLaunchSound.play();

    const newFireball = {
      x: kaijuX,
      y: kaijuY + kaijuHeight / 2 - fireballHeight / 2,
      speedX: 0,
      speedY: 0,
    };

    let predictedPaddleY = leftPaddleY;
    if (leftPaddleUpPressed) {
      predictedPaddleY -= 5;
    } else if (leftPaddleDownPressed) {
      predictedPaddleY += 5;
    }

    const verticalSpeed = (predictedPaddleY + paddleHeight / 2) - (newFireball.y + fireballHeight / 2);
    const horizontalSpeed = leftPaddleX - newFireball.x;
    const timeToReachPaddle = 1500;

    const minSpeedX = 6;
    const maxSpeedX = 16;
    newFireball.speedX = (Math.random() * (maxSpeedX - minSpeedX) + minSpeedX);

    const magnitude = Math.sqrt(verticalSpeed * verticalSpeed + horizontalSpeed * horizontalSpeed);
    const directionX = horizontalSpeed / magnitude;
    const directionY = verticalSpeed / magnitude;

    newFireball.speedY = directionY * newFireball.speedX;
    newFireball.speedX = directionX * newFireball.speedX;

    activeFireballs.push(newFireball);
  }

  for (let i = 0; i < activeFireballs.length; i++) {
    const fireball = activeFireballs[i];
    fireball.x += fireball.speedX;
    fireball.y += fireball.speedY;

    if (fireball.x < leftPaddleX + paddleWidth && fireball.x + fireballWidth > leftPaddleX && fireball.y > leftPaddleY && fireball.y < leftPaddleY + paddleHeight) {
      playerHP -= 1;
      playerHurtSound.play();
      activeFireballs.splice(i, 1);
      i--; //fireball in array so there will more than 1 fire
    }

    if (fireball.x > canvasWidth) {
      activeFireballs.splice(i, 1);
      i--;
    }
  }
}

function drawPlayerHP() {
  ctx.fillStyle = 'white';
  ctx.font = '3vh Pixelify Sans';
  ctx.fillText('Player HP: ' + playerHP, 100, 40);
}

function drawKaijuHP() {
  ctx.fillStyle = 'white';
  ctx.font = '3vh Pixelify Sans';
  ctx.fillText('Kaiju HP: ' + kaijuHP, 1000, 40);
}

let gameOver = false;

function checkGameOver() {
  if (kaijuHP <= 0 || playerHP <= 0) {
    gameOver = true;
  }
}

function drawActiveFireballs() {
  for (let i = 0; i < activeFireballs.length; i++) {
    const fireball = activeFireballs[i];
    ctx.fillStyle = 'red';
    ctx.fillRect(fireball.x, fireball.y, fireballWidth, fireballHeight);

    const yellowCenterSize = fireballWidth / 2;
    ctx.fillStyle = 'yellow';
    ctx.fillRect(fireball.x + (fireballWidth - yellowCenterSize) / 2, fireball.y + (fireballHeight - yellowCenterSize) / 2, yellowCenterSize, yellowCenterSize);
  }
}

function updateFireballs() {
  drawActiveFireballs();
}

function gameLoop() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    updateLeftPaddle();
    drawLeftPaddle();
    updateBall();
    drawBall();
    drawKaijuHP();
    drawPlayerHP();
    checkGameOver();
    fireballAttack();
    updateFireballs();
    updateKaijuImage();
    requestAnimationFrame(gameLoop);
  } else {
    if (kaijuHP === 0) {
      ctx.fillStyle = 'white';
      ctx.font = '5vh Pixelify Sans';
      ctx.fillText('You Win!', canvasWidth / 2 - 100, canvasHeight / 2);
    } else {
      ctx.fillText('You Lose!', canvasWidth / 2 - 100, canvasHeight / 2);
    }
    setTimeout(() => {
      location.reload();
    }, 4000);
  }
}
