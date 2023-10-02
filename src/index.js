import "@/styles/style.css"; // Импортируем стили (предполагая, что это правильный путь к файлу стилей)
import { clickSound } from '@/sounds/clickSound.mp3'
import { explosionSound } from '@/sounds/boom.mp3'
import { flagSound } from "@/sounds/flagSound.mp3";
import { winSound } from "@/sounds/winSound.mp3";

document.addEventListener('DOMContentLoaded', () => {
    //создание основынфх элементов
    const container = document.createElement('div');
    container.classList.add('container');

    const clickSound = new Audio('./sounds/clickSound.mp3');//звук клика
    const explosionSound = new Audio('./sounds/boom.mp3');//звук проигрыша
    const flagSound = new Audio("./sounds/flagSound.mp3")//звук флажка
    const winSound = new Audio("./sounds/winSound.mp3")//звук победы

    const timeElapsed = document.createElement('div');//истекшее время
    timeElapsed.id = 'time-elapsed';
    timeElapsed.classList.add('time-elapsed');
    timeElapsed.textContent = 'Time: 0 seconds';

    const clickCount = document.createElement('div');//колөво клика
    clickCount.id = 'click-count';
    clickCount.classList.add('click-count');
    clickCount.textContent = 'Clicks: 0';

    const title = document.createElement('h1');//заголовок
    title.textContent = 'Minesweeper on JavaScript';
    container.appendChild(title);

    const board = document.createElement('div');//игровое поле
    board.classList.add('board');

    const flagsLeft = document.createElement('div');//колөво оставшихся флажков
    flagsLeft.id = 'flags-left';
    flagsLeft.classList.add('flags-left');

    const result = document.createElement('div');
    result.id = 'result';
    result.classList.add('result');

    const restartGame = document.createElement('button');//перезапуск игры
    restartGame.id = 'restartGame';
    restartGame.classList.add('restartGame');
    restartGame.textContent = 'Restart Game';

//параметры игры
let startTime;
let elapsedTime = 0;
let clickCounter = 0;
let timerInterval;
let width = 10;
let bombAmount = 20;
let flags = 0;
let cells = [];
let isGameOver = false;



    // Добавляем созданные элементы в body
    document.body.appendChild(container);
    container.appendChild(board);
    container.appendChild(flagsLeft);
    container.appendChild(result);
    container.appendChild(restartGame);
    container.appendChild(timeElapsed)
    container.appendChild(clickCount)
});

