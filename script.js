const canvas = document.getElementById('gamebox');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 6;

const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;

let leftScore = 0;
let rightScore = 0;
let gameStarted = false;
let countdown = 3;

const paddleHitSound = document.getElementById('paddleHitSound');
const borderHitSound = document.getElementById('borderHitSound');
const scoreSound = document.getElementById('scoreSound');
borderHitSound.volume = 0.2;

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startCountdown);

const resetButton = document.getElementById('resetButton');
resetButton.style.display = 'none';
resetButton.addEventListener('click', resetGame);

const scoreText = document.getElementById('scoretext');

const countdownText = document.getElementById('countdown');

let leftPaddleUpPressed = false;
let leftPaddleDownPressed = false;
let rightPaddleUpPressed = false;
let rightPaddleDownPressed = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'w') {
    leftPaddleUpPressed = true;
  } else if (e.key === 's') {
    leftPaddleDownPressed = true;
  } else if (e.key === 'ArrowUp') {
    rightPaddleUpPressed = true;
  } else if (e.key === 'ArrowDown') {
    rightPaddleDownPressed = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w') {
    leftPaddleUpPressed = false;
  } else if (e.key === 's') {
    leftPaddleDownPressed = false;
  } else if (e.key === 'ArrowUp') {
    rightPaddleUpPressed = false;
  } else if (e.key === 'ArrowDown') {
    rightPaddleDownPressed = false;
  }
});

function drawPaddles() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; // Ball's color
    ctx.fill();
    ctx.closePath();
  }
  
  
  
  

function updatePaddles() {
  if (leftPaddleUpPressed && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  } else if (leftPaddleDownPressed && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += paddleSpeed;
  }

  if (rightPaddleUpPressed && rightPaddleY > 0) {
    rightPaddleY -= paddleSpeed;
  } else if (rightPaddleDownPressed && rightPaddleY + paddleHeight < canvas.height) {
    rightPaddleY += paddleSpeed;
  }
}

function drawScore() {
  ctx.font = '3vh Pixelify Sans';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(`${leftScore} : ${rightScore}`, canvas.width / 2, 40);
}

function update() {
  if (gameStarted) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
      ballSpeedY = -ballSpeedY;
      borderHitSound.play();
    }

    if (
      (ballX - ballSize < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
      (ballX + ballSize > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
    ) {
      ballSpeedX = -ballSpeedX;
      paddleHitSound.play();
    }

    if (ballX - ballSize < 0) {
      rightScore++;
      scoreSound.play();
      resetBall();
    } else if (ballX + ballSize > canvas.width) {
      leftScore++;
      scoreSound.play();
      resetBall();
    }

    if (Math.abs(ballSpeedX) < canvas.width * 0.05) {
      ballSpeedX *= 1.0005;
      ballSpeedY *= 1.0005;
    }

    if (Math.abs(ballSpeedX) >= canvas.width * 0.05) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = 'white';
    }

    drawScore();
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 5;
  ballSpeedY = 5;
}

function startCountdown() {
  startGame();
}

function startGame() {
    startButton.style.display = 'none';
    countdownText.style.display = 'block';
  
    let countdownInterval = setInterval(() => {
      countdownText.innerText = countdown;
      countdown--;
  
      if (countdown < 0) {
        clearInterval(countdownInterval);
        countdownText.style.display = 'none';
        gameStarted = true;
        resetButton.style.display = 'block'; 
      }
    }, 1000);
  }

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  resetBall();
  gameStarted = false;
  startButton.style.display = 'block';
  resetButton.style.display = 'none';
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePaddles();
  drawPaddles();
  drawBall();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();