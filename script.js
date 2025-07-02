const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Sons
const jumpSound = document.getElementById("jumpSound");
const hitSound = document.getElementById("hitSound");
const bgMusic = document.getElementById("bgMusic");

let playerImg = new Image();
playerImg.src = "https://i.imgur.com/OdL0XPt.png"; // Substitua por outro sprite se quiser

let player = {
  x: 100,
  y: canvas.height - 150,
  width: 60,
  height: 60,
  velocityY: 0,
  gravity: 1.5,
  jumpForce: -20,
  grounded: false
};

let buildings = [];
let gameRunning = false;
let score = 0;
let scoreInterval;
let soundOn = true;

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  canvas.style.display = "block";
  score = 0;
  buildings = [];
  player.y = canvas.height - player.height;
  player.velocityY = 0;
  player.grounded = false;
  updateScore();
  gameRunning = true;
  spawnBuilding();
  scoreInterval = setInterval(() => {
    score++;
    updateScore();
  }, 1000);
  if (soundOn) bgMusic.play();
  animate();
}

function updateScore() {
  document.getElementById("score").innerText = score;
  document.getElementById("finalScore").innerText = score;
}

function spawnBuilding() {
  buildings.push({
    x: canvas.width,
    y: canvas.height - 100,
    width: 80,
    height: 100
  });
  if (gameRunning) setTimeout(spawnBuilding, 2000);
}

function jump() {
  if (player.grounded) {
    player.velocityY = player.jumpForce;
    player.grounded = false;
    if (soundOn) jumpSound.play();
  }
}

function animate() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Atualiza jogador
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.grounded = true;
  }

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  ctx.fillStyle = "#2c3e50";
  buildings.forEach((building, index) => {
    building.x -= 5;
    ctx.fillRect(building.x, building.y, building.width, building.height);

    if (
      player.x < building.x + building.width &&
      player.x + player.width > building.x &&
      player.y < building.y + building.height &&
      player.y + player.height > building.y
    ) {
      endGame();
    }

    if (building.x + building.width < 0) {
      buildings.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

function endGame() {
  gameRunning = false;
  clearInterval(scoreInterval);
  canvas.style.display = "none";
  document.getElementById("gameOverScreen").style.display = "block";
  if (soundOn) {
    hitSound.play();
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
}

function restartGame() {
  startGame();
}

function toggleSound() {
  soundOn = !soundOn;
  const icon = document.getElementById("muteButton");
  icon.textContent = soundOn ? "🔊" : "🔇";
  if (!soundOn) {
    bgMusic.pause();
  } else {
    bgMusic.play();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
canvas.addEventListener("touchstart", () => {
  jump();
});
