/* Reset básico e fontes */
body {
    margin: 0;
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f8ff; /* Azul claro de fundo */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* Container do jogo - Responsivo */
#game-container {
    width: 90vw; /* 90% da largura da viewport */
    max-width: 800px; /* Limite máximo para telas grandes */
    height: 50vh; /* 50% da altura da viewport */
    max-height: 450px; /* Limite máximo */
    background: linear-gradient(to bottom, #87CEEB, #AEC6CF); /* Gradiente de céu */
    position: relative;
    overflow: hidden; /* Esconde elementos que saem do container */
    border-radius: 15px; /* Cantos arredondados */
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

/* Camada de fundo (para nuvens ou estrelas) */
.background-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%; /* Para permitir movimento */
    height: 100%;
    background: url('https://www.transparenttextures.com/patterns/clean-textile.png') repeat; /* Exemplo de textura */
    /* Ou adicione nuvens aqui */
    animation: backgroundMove 60s linear infinite; /* Movimento lento */
    opacity: 0.1;
}

@keyframes backgroundMove {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
}

/* Chão (Base para os prédios) */
#ground {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15%; /* Altura do chão */
    background-color: #4CAF50; /* Verde grama */
    border-top: 5px solid #388E3C;
}

/* Personagem */
#character {
    width: 8vw; /* Relativo à largura da viewport */
    max-width: 60px;
    height: 10vw; /* Relativo à largura da viewport */
    max-height: 80px;
    background-color: #FFEB3B; /* Amarelo vibrante */
    border-radius: 5px; /* Bordas levemente arredondadas */
    position: absolute;
    bottom: 15%; /* Acima do chão */
    left: 10%;
    transition: transform 0.2s ease-out, bottom 0.2s ease-out; /* Transição para pulo e squash/stretch */
    z-index: 10;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

#character.squash {
    transform: scaleY(0.8) scaleX(1.1);
}
#character.stretch {
    transform: scaleY(1.1) scaleX(0.9);
}

/* Prédios */
.building {
    min-width: 8vw; /* Largura mínima relativa */
    max-width: 120px;
    min-height: 25%; /* Altura mínima relativa */
    max-height: 80%;
    background-color: #607D8B; /* Cinza azulado */
    position: absolute;
    bottom: 15%; /* Acima do chão */
    left: 100%; /* Começa fora da tela */
    border-radius: 8px 8px 0 0; /* Cantos superiores arredondados */
    box-shadow: 0 -5px 10px rgba(0,0,0,0.2) inset;
    transition: background-color 0.1s ease-in-out;
    will-change: transform; /* Otimização para animação */
}
.building.dark {
    background-color: #455A64; /* Prédio mais escuro */
}
.building::before { /* Janelas */
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background-image:
        linear-gradient(to right,
            rgba(255,255,255,0.2) 1px, transparent 1px),
        linear-gradient(to bottom,
            rgba(255,255,255,0.2) 1px, transparent 1px);
    background-size: 20px 20px; /* Tamanho das janelas */
    background-repeat: repeat;
}

/* Moedas */
.coin {
    width: 3vw;
    max-width: 25px;
    height: 3vw;
    max-height: 25px;
    background: radial-gradient(circle at 50% 50%, #FFD700, #DAA520); /* Gradiente dourado */
    border-radius: 50%;
    position: absolute;
    transform: rotateY(0deg);
    animation: coinSpin 1.5s linear infinite;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    z-index: 9;
}

@keyframes coinSpin {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
}

/* Placar de Pontos */
#score {
    position: absolute;
    top: 2vh;
    left: 2vw;
    color: #333;
    font-size: 3vh;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
    z-index: 20;
}

/* Telas de Início/Fim de Jogo */
.game-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 100;
    backdrop-filter: blur(5px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.game-screen.active {
    opacity: 1;
    visibility: visible;
}

.game-screen h1 {
    font-size: 5vh;
    margin-bottom: 2vh;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.game-screen p {
    font-size: 3vh;
    margin-bottom: 3vh;
}

.game-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 2vh 4vw;
    font-size: 3vh;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    box-shadow: 0 5px 10px rgba(0,0,0,0.3);
}

.game-button:hover {
    background-color: #45a049;
    transform: translateY(-2px);
}
.game-button:active {
    transform: translateY(0);
}

/* Efeitos para telas pequenas (Mobile) */
@media (max-width: 600px) {
    #game-container {
        width: 95vw;
        height: 60vh;
    }
    #character {
        width: 10vw;
        height: 12vw;
    }
    .building {
        min-width: 10vw;
    }
    .coin {
        width: 4vw;
        height: 4vw;
    }
    #score {
        font-size: 3.5vh;
    }
    .game-screen h1 {
        font-size: 6vh;
    }
    .game-screen p {
        font-size: 3.5vh;
    }
    .game-button {
        padding: 2.5vh 6vw;
        font-size: 3.5vh;
    }
}
