export class Pong {
    // controle geral do jogo
    gameShouldPlay = false;
    playVictory = false;
    multiplayer = false;
    goal = 0;

    // frame da animação
    frameId;

    // Controle de pontuação
    player1Score = 0;
    player2Score = 0;

    // canvas e context
    canvas;
    ctx;

    // Propriedades da bola
    ballX;
    ballY;
    ballRadius = 10;
    ballSpeedX = 3;
    ballSpeedY = 3;

    // Propriedades das raquetes
    paddleWidth = 10;
    paddleHeight = 100;
    paddleSpeed = 6;

    // Raquetes dos jogadores
    player1Y;
    player2Y;

    // Controle das teclas pressionadas
    upArrowPressed = false;
    downArrowPressed = false;
    wKeyPressed = false;
    sKeyPressed = false;

    constructor(canvas, ctx, multiplayer, goal = 0) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.multiplayer = multiplayer;
        this.goal = goal;
        this.ballX = canvas.width / 2;
        this.ballY = canvas.height / 2;
        this.player1Y = (canvas.height - this.paddleHeight) / 2;
        this.player2Y = (canvas.height - this.paddleHeight) / 2;

        this.gameLoop = this.gameLoop.bind(this);
    }

    _collidedPlayer(playerNumber) {
        switch (playerNumber) {
            case 1:
                return this.ballX - this.ballRadius < this.paddleWidth && this.ballY > this.player1Y && this.ballY < this.player1Y + this.paddleHeight;
            case 2:
                return this.ballX + this.ballRadius > this.canvas.width - this.paddleWidth && this.ballY > this.player2Y && this.ballY < this.player2Y + this.paddleHeight;
        }
    }

    _handlePlayerMovement() {
        // Movimento do Jogador 1
        if (this.wKeyPressed && this.player1Y > 10) {
            this.player1Y -= this.paddleSpeed;
            console.log('Jogador 1 se moveu para cima');
        }
        if (this.sKeyPressed && this.player1Y < this.canvas.height - this.paddleHeight - 10) {
            this.player1Y += this.paddleSpeed;
            console.log('Jogador 1 se moveu para baixo');
        }

        if (this.multiplayer) {
            // Movimento do Jogador 2
            if (this.upArrowPressed && this.player2Y > 10) {
                this.player2Y -= this.paddleSpeed;
                console.log('Jogador 2 se moveu para cima');
            }
            if (this.downArrowPressed && this.player2Y < this.canvas.height - this.paddleHeight - 10) {
                this.player2Y += this.paddleSpeed;
                console.log('Jogador 2 se moveu para baixo');
            }
        }
    }

    _handleAutoPlayerMovement() {
        if (this.multiplayer) {
            return; // Se multiplayer estiver ativado, o movimento automático é desativado.
        }

        // Apenas reage quando a bola está no lado direito do campo
        if (this.ballX < this.canvas.width / 2) {
            return; // Não faz nada enquanto a bola está no lado esquerdo
        }

        // Predição com imprecisão simulada
        const predictionError = Math.random() * 40 - 20; // Erro na previsão (-20 a +20 pixels)
        const targetY = this.ballY + predictionError;

        // Zona morta: evita movimentos desnecessários quando a bola está próxima
        const centerPaddle = this.player2Y + this.paddleHeight / 2;
        const errorMargin = 40; // Margem de segurança

        if (Math.abs(centerPaddle - targetY) < errorMargin) {
            return; // Não faz nada se a bola está dentro da zona morta
        }

        // Movimentação gradual limitada pela velocidade
        if (centerPaddle < targetY) {
            this.player2Y += this.paddleSpeed * 0.5; // Move para baixo
        } else if (centerPaddle > targetY) {
            this.player2Y -= this.paddleSpeed  * 0.5; // Move para cima
        }

        // Limites de movimento da raquete para não ultrapassar o canvas
        if (this.player2Y < 0) {
            this.player2Y = 0;
        } else if (this.player2Y > this.canvas.height - this.paddleHeight) {
            this.player2Y = this.canvas.height - this.paddleHeight;
        }
    }

    _handleGoal() {
        // Reiniciar a bola se sair dos limites
        if (this.ballX - this.ballRadius < 0) {
            this.player2Score++;
            document.dispatchEvent(new CustomEvent('player2Score', {
                detail: this.player2Score
            }));
            console.log('Jogador 2 marcou ponto');
            this._resetBall();
        } else if (this.ballX + this.ballRadius > this.canvas.width) {
            this.player1Score++;
            document.dispatchEvent(new CustomEvent('player1Score', {
                detail: this.player1Score
            }));
            console.log('Jogador 1 marcou ponto');
            this._resetBall();
        }

        this._handleWin();
    }

    _drawWinAnimation() {
        const winnerText = this.player1Score > this.player2Score ? "Player 1 venceu!" : "Player 2 venceu!";
        const confettiColors = ["#FF0", "#0F0", "#F00", "#00F", "#FFF"];
        const confettiParticles = Array.from({ length: 50 }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            r: Math.random() * 5 + 2,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            dx: (Math.random() - 0.5) * 2,
            dy: Math.random() * 2 + 1,
        }));

        this._animateWin(confettiParticles, winnerText);
    }

    _animateWin(confettiParticles, winnerText) {
        if (!this.playVictory) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Exibe o texto de vitória
        this.ctx.font = "40px 'Press Start 2P'";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#FFF";
        this.ctx.fillText(winnerText, this.canvas.width / 2, this.canvas.height / 2);

        // Desenha os confetes
        confettiParticles.forEach((particle) => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            particle.x += particle.dx;
            particle.y += particle.dy;

            // Reaparece na parte superior se sair da tela
            if (particle.y > this.canvas.height) {
                particle.y = 0;
                particle.x = Math.random() * this.canvas.width;
            }
        });

        if (!this.gameShouldPlay) {
            requestAnimationFrame(() => this._animateWin(confettiParticles, winnerText));
        }
    };

    _handleWin() {
        if (this.goal > 0 && (this.player1Score >= this.goal || this.player2Score >= this.goal)) {
            this.endGame();
            this.playVictory = true;

            this._drawWinAnimation();

            // Continua animando enquanto o jogo não for reiniciado
            setTimeout(() => {
                this.playVictory = false;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                document.dispatchEvent(new CustomEvent('gameFinished', {
                    detail: true
                }));
            }, 2500)
        }
    }

    _handleBallMovement() {
        // Mover a bola
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;
        console.log(`Posição da bola: (${this.ballX}, ${this.ballY})`);

        // Colisão da bola com as paredes superior e inferior
        if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvas.height) {
            this.ballSpeedY = -this.ballSpeedY;
            console.log('Bola colidiu com a parede superior/inferior');
        }

        // Colisão da bola com as raquetes
        if (this._collidedPlayer(1)) {
            this.ballSpeedX = -this.ballSpeedX;
            this.ballSpeedY = (this.ballY - (this.player1Y + this.paddleHeight / 2)) * 0.1;
            console.log('Bola colidiu com a raquete do Jogador 1');
        }
        if (this._collidedPlayer(2)) {
            this.ballSpeedX = -this.ballSpeedX;
            this.ballSpeedY = (this.ballY - (this.player2Y + this.paddleHeight / 2)) * 0.1;
            console.log('Bola colidiu com a raquete do Jogador 2');
        }
    }

    _updateGame() {
        console.log('Função de atualização chamada');

        this._handleBallMovement();
        this._handleGoal();
        this._handlePlayerMovement();
        this._handleAutoPlayerMovement();
    }

    _resetBall() {
        this.ballX = this.canvas.width / 2;
        this.ballY = this.canvas.height / 2;
        this.ballSpeedX = 2 * (Math.random() > 0.5 ? 1 : -1);
        this.ballSpeedY = 2 * (Math.random() > 0.5 ? 1 : -1);
        console.log('Bola reiniciada para o centro');
    }

    _draw() {
        console.log('Função de desenho chamada');
        // Limpar o canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenhar as pontuações
        this.ctx.font = '20px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(`${this.player1Score}`, 150, 50);
        this.ctx.fillText(`${this.player2Score}`, this.canvas.width - 150, 50);

        // Desenhar a bola
        this.ctx.beginPath();
        this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#fff";
        this.ctx.fill();
        this.ctx.closePath();

        // Desenhar a raquete do Jogador 1
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, this.player1Y, this.paddleWidth, this.paddleHeight);

        // Desenhar a raquete do Jogador 2
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.player2Y, this.paddleWidth, this.paddleHeight);
    }

    // Loop principal do jogo
    gameLoop() {
        console.log('Loop do jogo iniciado');

        if (!this.gameShouldPlay) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this._updateGame();
        this._draw();
        requestAnimationFrame(this.gameLoop);
    }

    _handleKeyDown = () => {
        switch (event.key) {
            case 'ArrowUp':
                this.upArrowPressed = true;
                event.preventDefault();
                console.log('Seta para cima pressionada');
                break;
            case 'ArrowDown':
                this.downArrowPressed = true;
                event.preventDefault();
                console.log('Seta para baixo pressionada');
                break;
            case 'w':
                this.wKeyPressed = true;
                console.log('Tecla W pressionada');
                break;
            case 's':
                this.sKeyPressed = true;
                console.log('Tecla S pressionada');
                break;
        }
    }

    _handleKeyUp = () => {
        switch (event.key) {
            case 'ArrowUp':
                this.upArrowPressed = false;
                event.preventDefault();
                console.log('Seta para cima liberada');
                break;
            case 'ArrowDown':
                this.downArrowPressed = false;
                event.preventDefault();
                console.log('Seta para baixo liberada');
                break;
            case 'w':
                this.wKeyPressed = false;
                console.log('Tecla W liberada');
                break;
            case 's':
                this.sKeyPressed = false;
                console.log('Tecla S liberada');
                break;
        }
    }

    startGame() {
        // Lidar com eventos de pressionamento de teclas
        window.addEventListener('keydown', this._handleKeyDown);
        // Lidar com eventos de liberação de teclas
        window.addEventListener('keyup', this._handleKeyUp);

        this.gameShouldPlay = true;
        this.gameLoop();
    }

    endGame() {
        // Remove eventos de tecla
        window.removeEventListener('keydown', this._handleKeyDown)
        window.removeEventListener('keyup', this._handleKeyUp)

        // Cancela animation frames
        cancelAnimationFrame(this.frameId)
        this.gameShouldPlay = false;

        console.log('FIM DE JOGO');
    }

}
