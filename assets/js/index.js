import { Pong } from './Pong.js';

let currentGame = null;

export function handleInfiniteGame() {
    const gameGoal = document.getElementById('game-goal');
    const infiniteGame = document.getElementById('infinite-game').checked;


    if (infiniteGame) {
        gameGoal.disabled = true;
        gameGoal.value = 0;
    } else {
        gameGoal.disabled = false;
        gameGoal.value = 5;
    }
}

export function startGame() {
    const gameGoal = document.getElementById('game-goal').value;
    const multiplayerGame = document.getElementById('game-cpu').checked;

    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    currentGame = new Pong(canvas, ctx, multiplayerGame, +gameGoal);

    currentGame.startGame();

    const preGameForm = document.getElementById('game-form');
    preGameForm.hidden = true;
    const inGameForm = document.getElementById('ingame-form');
    inGameForm.hidden = false;
}

export function stopGame() {
    currentGame.endGame();

    const preGameForm = document.getElementById('game-form');
    preGameForm.hidden = false;
    const inGameForm = document.getElementById('ingame-form');
    inGameForm.hidden = true;

    currentGame = null;
}

// TODO: implementar IA simples caso multiplayer seja desabilitado
// TODO: implementar counter do enzo
// TODO: implementar animação de vitória caso P1/P2 ganhe
// TODO: esconder controle do Player 2 caso 2P Game não esteja marcado
// TODO: adicionar title explicando o que cada opção faz

window.stopGame = stopGame;
window.startGame = startGame;
window.handleInfiniteGame = handleInfiniteGame;
