
const canvas = document.getElementById('gamebox');
const ctx = canvas.getContext('2d');
const canvasWidth = 1200;
const canvasHeight = 600;
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const initialBallSpeedX = 5;
const initialBallSpeedY = 5;
const aiBaseSpeed = 1; 


const aiSpeedModifiers = {
  normal: 0.75, 
  hard: 1.0,  
  master: 2.0, 
};


let leftPaddleY = canvasHeight / 2 - paddleHeight / 2;
let rightPaddleY = canvasHeight / 2 - paddleHeight / 2;
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = initialBallSpeedX;
let ballSpeedY = initialBallSpeedY;
let leftScore = 0;
let rightScore = 0;
let gameStarted = false;


let leftPaddleUpPressed = false;
let leftPaddleDownPressed = false;


let aiDifficulty = 'normal'; 
let aiSpeedModifier = aiSpeedModifiers[aiDifficulty]; 


const paddleHitSound = document.getElementById('paddleHitSound');
const borderHitSound = document.getElementById('borderHitSound');
const scoreSound = document.getElementById('scoreSound');
borderHitSound.volume = 0.2;


const resetButton = document.getElementById('resetButton');
resetButton.style.display = 'none';
resetButton.addEventListener('click', resetGame);

const scoreText = document.getElementById('scoretext');
const countdownText = document.getElementById('countdown');


const normalButton = document.getElementById('normalButton');
const hardButton = document.getElementById('hardButton');
const masterButton = document.getElementById('masterButton');


normalButton.addEventListener('click', () => startGame('normal'));
hardButton.addEventListener('click', () => startGame('hard'));
masterButton.addEventListener('click', () => startGame('master'));


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

function drawPaddles() {
    ctx.fillStyle = 'white'; 
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  
    if (aiDifficulty === 'hard') {
      ctx.fillStyle = 'crimson'; 
    } else if (aiDifficulty === 'master') {
      ctx.fillStyle = 'purple';
    } else {
      ctx.fillStyle = 'white';
    }
  
    ctx.fillRect(canvasWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
  }

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fillStyle = 'white'; 
  ctx.fill();
  ctx.closePath();
}

function updatePaddles() {

  if (leftPaddleUpPressed && leftPaddleY > 0) {
    leftPaddleY -= 6; 
  } else if (leftPaddleDownPressed && leftPaddleY + paddleHeight < canvasHeight) {
    leftPaddleY += 6; 
  }

  const targetY = ballY - paddleHeight / 2;
  const deltaY = targetY - rightPaddleY;


  rightPaddleY += deltaY * (aiBaseSpeed * aiSpeedModifier);

  if (rightPaddleY < 0) {
    rightPaddleY = 0;
  } else if (rightPaddleY + paddleHeight > canvasHeight) {
    rightPaddleY = canvasHeight - paddleHeight;
  }
}

function drawScore() {
  ctx.font = '3vh Pixelify Sans';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(`${leftScore} : ${rightScore}`, canvasWidth / 2, 40);
}

function update() {
  if (gameStarted) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballSize < 0 || ballY + ballSize > canvasHeight) {
      ballSpeedY = -ballSpeedY;
      borderHitSound.play();
    }

    if (
      (ballX - ballSize < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
      (ballX + ballSize > canvasWidth - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
    ) {
      ballSpeedX = -ballSpeedX;
      paddleHitSound.play();
    }

    if (ballX - ballSize < 0) {
      rightScore++;
      scoreSound.play();
      resetBall();
    } else if (ballX + ballSize > canvasWidth) {
      leftScore++;
      scoreSound.play();
      resetBall();
    }

    if (Math.abs(ballSpeedX) < canvasWidth * 0.05) {
      ballSpeedX *= 1.0005;
      ballSpeedY *= 1.0005;
    }

    if (Math.abs(ballSpeedX) >= canvasWidth * 0.05) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = 'white';
    }

    drawScore();
  }
}

function resetBall() {
  ballX = canvasWidth / 2;
  ballY = canvasHeight / 2;
  ballSpeedX = initialBallSpeedX;
  ballSpeedY = initialBallSpeedY;
}

function startGame(difficulty) {
  aiDifficulty = difficulty;
  aiSpeedModifier = aiSpeedModifiers[aiDifficulty]; 

  normalButton.style.display = 'none';
  hardButton.style.display = 'none';
  masterButton.style.display = 'none';
  resetButton.style.display = 'block';

  countdownText.style.display = 'block';

  let countdown = 3;
  countdownText.innerText = countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownText.innerText = countdown;

    if (countdown === 0) {
      clearInterval(countdownInterval);
      countdownText.style.display = 'none';
      gameStarted = true;
    }
  }, 1000);
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  resetBall();
  gameStarted = false;
  normalButton.style.display = 'inline-block';
  hardButton.style.display = 'inline-block';
  masterButton.style.display = 'inline-block';
  resetButton.style.display = 'none';
}

function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  updatePaddles();
  drawPaddles();
  drawBall();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
document.getElementById("bootButton").onclick = gotopongsgame;
function gotopongsgame(){
  window.location.href = "sedif.html";
}