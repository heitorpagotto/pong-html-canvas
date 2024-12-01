import { Pong } from './Pong.js';
import {ScoreCounter} from "./Score.js";

let currentGame = null;
let p1Score = null;
let p2Score = null;

document.addEventListener('gameFinished', () => {
    handleMenu(false);
    currentGame = null;
    p1Score.setValue(0);
    p2Score.setValue(0);
})

document.addEventListener('player2Score', (value) => {
    handleScoreCounterValue(value.detail, 2);
})
document.addEventListener('player1Score', (value) => {
    handleScoreCounterValue(value.detail, 1);
})


export function handleInfiniteGame() {
    const gameGoal = document.getElementById('game-goal');
    const infiniteGame = document.getElementById('infinite-game').checked;

    if (infiniteGame) {
        gameGoal.disabled = true;
        gameGoal.value = 0;
    } else {
        gameGoal.disabled = false;
        gameGoal.value = 3;
    }
}

createGameScoreCounter()

export function startGame() {
    const gameGoal = document.getElementById('game-goal').value;
    const multiplayerGame = document.getElementById('game-cpu').checked;

    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    handleScoreVisibility(+gameGoal);

    currentGame = new Pong(canvas, ctx, multiplayerGame, +gameGoal);

    currentGame.startGame();

    handleMenu(true);

    p1Score.setValue(0);
    p2Score.setValue(0);
}

function handleScoreVisibility(gameGoal) {
    const score = document.querySelector('.score');

    if (gameGoal === 0 || gameGoal > 9) {
        score.style = 'display: none';
    } else {
        score.style = '';
    }
}

function handleMenu(isStarting = false) {
    const preGameForm = document.getElementById('game-form');
    const inGameForm = document.getElementById('ingame-form');
    const button = document.getElementById('start-btn');

    if (isStarting) {
        preGameForm.hidden = true;
        inGameForm.hidden = false;
        button.style = 'display:none';
    } else {
        preGameForm.hidden = false;
        inGameForm.hidden = true;
        button.style = '';
    }
}

function createGameScoreCounter() {
    const p1ScoreCanvas = document.getElementById('p1Score');
    const p2ScoreCanvas = document.getElementById('p2Score');

    const p1ScoreCtx = p1ScoreCanvas.getContext('2d');
    const p2ScoreCtx = p2ScoreCanvas.getContext('2d');

    p1Score = new ScoreCounter(p1ScoreCanvas, p1ScoreCtx);
    p2Score = new ScoreCounter(p2ScoreCanvas, p2ScoreCtx);

    p1Score.setValue(0);
    p2Score.setValue(0);
}

function handleScoreCounterValue(value, playerNumber) {
    switch (playerNumber) {
        case 1:
            p1Score.setValue(value);
            break;
        case 2:
            p2Score.setValue(value);
            break;
    }
}

export function stopGame() {
    currentGame?.endGame();

    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentGame)
        currentGame.playVictory = false;

    handleMenu(false);

    currentGame = null;

    p1Score.setValue(0);
    p2Score.setValue(0);
}

window.stopGame = stopGame;
window.startGame = startGame;
window.handleInfiniteGame = handleInfiniteGame;
