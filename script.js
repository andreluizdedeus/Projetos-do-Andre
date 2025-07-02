const gameContainer = document.getElementById('game-container');
const character = document.getElementById('character');
const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreDisplay = document.getElementById('final-score');

// Sons (Lembre-se de baixar e hospedar estes sons em seu próprio projeto!)
// Por exemplo, crie uma pasta 'sounds' e coloque os mp3 lá: 'sounds/jump.mp3'
// Se for usar os links abaixo, esteja ciente que eles podem mudar ou não funcionar no futuro.
const jumpSound = new Audio('https://www.soundjay.com/buttons/beep-07.mp3'); 
const coinSound = new Audio('https://www.soundjay.com/misc/collecting-points.mp3');
const gameOverSound = new Audio('https://www.soundjay.com/misc/game-over-3.mp3');

let characterBottom = parseFloat(getComputedStyle(character).bottom);
let characterLeft = parseFloat(getComputedStyle(character).left);
let isJumping = false;
let isGameOver = false;
let score = 0;
let gravity = 0.5;
let jumpStrength = 10;
let buildings = []; 
let buildingSpeed = 3;
let buildingInterval;
let gameLoopInterval;

function initializeGame() {
    characterBottom = parseFloat(getComputedStyle(character).bottom);
    character.style.bottom = characterBottom + 'px';
    character.style.left = characterLeft + 'px';
    character.style.transform = 'none'; 
    isJumping = false;
    isGameOver = false;
    score = 0;
    scoreDisplay.textContent = 'Pontos: 0';
    
    // Remove todos os prédios e moedas existentes
    buildings.forEach(el => el.remove());
    buildings = [];
    
    gameOverScreen.classList.remove('active');
    startScreen.classList.remove('active');
}

function startGame() {
    initializeGame();
    gameLoopInterval = setInterval(gameLoop, 20); 

    buildingInterval = setInterval(generateBuilding, 1500); 
}

function gameLoop() {
    applyGravity();
    moveElements();
    checkCollision(); 
}

function applyGravity() {
    if (!isJumping) {
        characterBottom -= gravity;
        character.style.bottom = characterBottom + 'px';

        if (characterBottom <= parseFloat(getComputedStyle(document.getElementById('ground')).height)) {
            characterBottom = parseFloat(getComputedStyle(document.getElementById('ground')).height);
            character.style.bottom = characterBottom + 'px';
        }
    }
}

function jump() {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        jumpSound.play(); 
        
        character.classList.add('squash');
        setTimeout(() => {
            character.classList.remove('squash');
            character.classList.add('stretch'); 
            let jumpHeight = characterBottom + (gameContainer.offsetHeight * 0.35); // Altura de pulo relativa ao container
            let upInterval = setInterval(() => {
                if (characterBottom < jumpHeight && isJumping) {
                    characterBottom += jumpStrength;
                    character.style.bottom = characterBottom + 'px';
                } else {
                    clearInterval(upInterval);
                    character.classList.remove('stretch');
                    let downInterval = setInterval(() => {
                        if (characterBottom > parseFloat(getComputedStyle(document.getElementById('ground')).height) && isJumping) {
                            characterBottom -= jumpStrength * 0.8; 
                            character.style.bottom = characterBottom + 'px';
                        } else {
                            clearInterval(downInterval);
                            characterBottom = parseFloat(getComputedStyle(document.getElementById('ground')).height);
                            character.style.bottom = characterBottom + 'px';
                            isJumping = false;
                        }
                    }, 20);
                }
            }, 20);
        }, 100); 
    }
}

function generateBuilding() {
    if (isGameOver) return;

    const building = document.createElement('div');
    building.classList.add('building');
    if (Math.random() > 0.5) { 
        building.classList.add('dark');
    }

    let minHeight = gameContainer.offsetHeight * 0.25; 
    let maxHeight = gameContainer.offsetHeight * 0.70; 
    let buildingHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    building.style.height = buildingHeight + 'px';
    building.style.width = (Math.random() * (gameContainer.offsetWidth * 0.08) + gameContainer.offsetWidth * 0.05) + 'px'; 
    building.style.left = gameContainer.offsetWidth + 'px';
    gameContainer.appendChild(building);
    buildings.push(building);

    // Gera uma moeda no prédio
    if (Math.random() > 0.6) { 
        const coin = document.createElement('div');
        coin.classList.add('coin');
        // Calcula a posição da moeda relativa ao prédio
        let coinLeftOffset = Math.random() * (parseInt(building.style.width) - parseFloat(getComputedStyle(coin).width));
        coin.style.left = (parseInt(building.style.left) + coinLeftOffset) + 'px';
        coin.style.bottom = (buildingHeight + parseFloat(getComputedStyle(document.getElementById('ground')).height) + 15) + 'px'; 
        gameContainer.appendChild(coin);
        buildings.push(coin);
    }
}

function moveElements() {
    buildings = buildings.filter(element => {
        let currentLeft = parseInt(element.style.left);
        element.style.left = (currentLeft - buildingSpeed) + 'px';
        return currentLeft + element.offsetWidth > 0;
    });
}

function checkCollision() {
    const charRect = character.getBoundingClientRect();
    const groundHeight = parseFloat(getComputedStyle(document.getElementById('ground')).height);
    let onBuilding = false;

    buildings.forEach(element => {
        const elemRect = element.getBoundingClientRect();

        // Colisão com Moeda
        if (element.classList.contains('coin')) {
            if (
                charRect.left < elemRect.right &&
            charRect.right > elemRect.left &&
            charRect.top < elemRect.bottom &&
            charRect.bottom > elemRect.top
            ) {
                coinSound.play();
                score++;
                scoreDisplay.textContent = 'Pontos: ' + score;
                element.remove();
                // Remove a moeda do array de buildings
                buildings = buildings.filter(b => b !== element); 
                return; 
            }
        } 
        // Colisão com Prédio (para pouso)
       else if (element.classList.contains('building')) {
            // Se o personagem está caindo e acima de um prédio (apenas topo)
            if (charRect.bottom >= elemRect.top && charRect.bottom <= elemRect.top + (charRect.height * 0.2) && // Pequena margem para pouso no topo
                charRect.right > elemRect.left + 5 && charRect.left < elemRect.right - 5 && // Margem para não cair da beirada
                characterBottom > groundHeight) 
            {
                characterBottom = elemRect.height + groundHeight; 
                character.style.bottom = characterBottom + 'px';
                isJumping = false;
                onBuilding = true;
            }
        }
    });

    // Game Over: Cair entre os prédios ou no chão sem estar sobre um prédio
    if (!isJumping && characterBottom <= groundHeight && !onBuilding && !isGameOver) {
        let foundPlatformBelow = false;
        buildings.forEach(b => {
            if (b.classList.contains('building')) {
                const bRect = b.getBoundingClientRect();
                // Verifica se há um prédio *horizontalmente* abaixo do personagem E se o personagem está *abaixo* do topo desse prédio
                if (charRect.right > bRect.left && charRect.left < bRect.right && characterBottom < bRect.height + groundHeight) {
                    foundPlatformBelow = true;
                }
            }
        });

        // Se o personagem está no nível do chão (ou abaixo) e não há plataforma abaixo dele, é Game Over
        if (!foundPlatformBelow) {
            gameOver();
        }
    }
}


function gameOver() {
    if (isGameOver) return; 

    isGameOver = true;
    clearInterval(gameLoopInterval);
    clearInterval(buildingInterval);
    gameOverSound.play();
    finalScoreDisplay.textContent = 'Pontos: ' + score;
    gameOverScreen.classList.add('active');
}

// Eventos de Input
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isGameOver && startScreen.classList.contains('active')) {
        // Se o jogo ainda não começou e o espaço é pressionado, inicia
        startGame();
    } else if (e.code === 'Space' && !isGameOver) {
        jump();
    }
});

// Para telas de toque (celular)
gameContainer.addEventListener('touchstart', (e) => {
    if (!isGameOver && startScreen.classList.contains('active')) {
        // Se o jogo ainda não começou e a tela é tocada, inicia
        startGame();
    } else if (!isGameOver) {
        jump();
    }
});

// Botões das telas
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Inicializa a tela de início
startScreen.classList.add('active');
