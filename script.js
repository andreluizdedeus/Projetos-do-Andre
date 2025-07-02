const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: 100,
  y: canvas.height - 150,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 1.5,
  jumpForce: -20,
  grounded: false
};

let buildings = [];
let gameRunning = false;

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  canvas.style.display = "block";
  gameRunning = true;
  spawnBuilding();
  animate();
}

function spawnBuilding() {
  buildings.push({
    x: canvas.width,
    y: canvas.height - 100,
    width: 80,
    height: 100
  });

  setTimeout(spawnBuilding, 2000);
}

function jump() {
  if (player.grounded) {
    player.velocityY = player.jumpForce;
    player.grounded = false;
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

  ctx.fillStyle = "#34495e";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Atualiza prédios
  ctx.fillStyle = "#2c3e50";
  buildings.forEach((building, index) => {
    building.x -= 5;
    ctx.fillRect(building.x, building.y, building.width, building.height);

    // Verifica colisão
    if (
      player.x < building.x + building.width &&
      player.x + player.width > building.x &&
      player.y < building.y + building.height &&
      player.y + player.height > building.y
    ) {
      endGame();
    }

    // Remove prédios fora da tela
    if (building.x + building.width < 0) {
      buildings.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

function endGame() {
  alert("Game Over!");
  location.reload();
}

// Controles
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

canvas.addEventListener("touchstart", () => {
  jump();
});
