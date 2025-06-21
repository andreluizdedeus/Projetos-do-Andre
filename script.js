const dog = document.getElementById('dog');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const hitSound = document.getElementById('hitSound');
const bestScoreDisplay = document.getElementById('best-score');
const finalScoreDisplay = document.getElementById('final-score');
const finalBestScoreDisplay = document.getElementById('final-best-score');

const lanes = [80, 200, 320]; // posições verticais (3 faixas)
let currentLane = 1;
let score = 0;
let lives = 3;
let speed = 3000;
let gameRunning = false;
let gameLoop;

dog.style.top = lanes[currentLane] + 'px';

function moveUp() {
  if (currentLane > 0) {
    currentLane--;
    dog.style.top = lanes[currentLane] + 'px';
  }
}

function moveDown() {
  if (currentLane < lanes.length - 1) {
    currentLane++;
    dog.style.top = lanes[currentLane] + 'px';
  }
}

function createObstacle() {
  if (!gameRunning) return;

  const obstacle = document.createElement('img');
  obstacle.src = 'https://pngimg.com/uploads/stone/stone_PNG13609.png';
  obstacle.classList.add('obstacle');

  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  obstacle.style.top = lane + 'px';
  obstacle.style.animationDuration = (speed / 1000) + 's';

  game.appendChild(obstacle);

  obstacle.addEventListener('animationend', () => {
    obstacle.remove();
  });

  const interval = setInterval(() => {
    const obsRect = obstacle.getBoundingClientRect();
    const dogRect = dog.getBoundingClientRect();

    if (
      obsRect.left < dogRect.right &&
      obsRect.right > dogRect.left &&
      obsRect.top === dogRect.top
    ) {
      lives--;
      updateDisplay();
      hitSound.currentTime = 0;
      hitSound.play();
      obstacle.remove();
      clearInterval(interval);
      if (lives <= 0) endGame();
    }
  }, 50);
}

function updateDisplay() {
  scoreDisplay.textContent = `Pontos: ${score}`;
  livesDisplay.textContent = '❤️'.repeat(lives);
}

function updateBestScoreDisplay() {
  const best = localStorage.getItem('bestRunnerScore') || 0;
  bestScoreDisplay.textContent = best;
}

function startGame() {
  document.getElementById('start-screen').classList.add('hidden');
  game.classList.remove('hidden');

  score = 0;
  lives = 3;
  speed = 3000;
  gameRunning = true;
  updateDisplay();

  gameLoop = setInterval(() => {
    if (!gameRunning) return;
    createObstacle();
    score++;
    updateDisplay();
    if (speed > 1500) speed *= 0.98;
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(gameLoop);
  game.classList.add('hidden');
  document.getElementById('game-over-screen').classList.remove('hidden');

  const best = localStorage.getItem('bestRunnerScore') || 0;
  if (score > best) {
    localStorage.setItem('bestRunnerScore', score);
  }
  finalScoreDisplay.textContent = score;
  finalBestScoreDisplay.textContent = localStorage.getItem('bestRunnerScore');
}

function restartGame() {
  document.getElementById('game-over-screen').classList.add('hidden');
  startGame();
}

hitSound.currentTime = 10;
hitSound.play().catch(err => console.log("Erro ao tocar som:", err));

function playHitSound() {
  hitSound.currentTime = 0;
  hitSound.play().catch(e => console.warn('Som bloqueado pelo navegador, será liberado após interação.'));
}

hitSound.play().catch(() => {});  // desbloqueia o som após interação

playHitSound();


updateBestScoreDisplay();