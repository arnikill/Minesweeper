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
    let cells = [];//тут храним все клетки
    let isGameOver = false;

    function updateTime() {// функция обновляет отображение прошедшего времени.
        const currentTime = new Date().getTime()// текущее время в миллисекундах
        elapsedTime = Math.floor((currentTime - startTime) / 1000)// Затем она вычисляет разницу между текущим временем и startTime
        timeElapsed.textContent = `Time: ${elapsedTime} seconds`//значение обновляется
    }

    function createBoard() {
        startTime = new Date().getTime();
        flagsLeft.innerHTML = bombAmount;

        const bombsArray = Array(bombAmount).fill('bomb');//кол-во опасных клеток
        const emptyArray = Array(width * width - bombAmount).fill('actual');//кол-во безопасных клеток
        const gameArray = emptyArray.concat(bombsArray);//объеденяем bombsArray empttyArray
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);//содержит случайное распределение бомб и безопасных клеток

        for (let i = 0; i < width * width; i++) {
            const cell = document.createElement('div');//создаю клетку
            cell.setAttribute('id', i);//уникальный номер, который меняется каждый раз, когда  создаю новую клетку
            cell.classList.add(shuffledArray[i]);//Добавляет этой клетке определенный класс, чтобы модно было определить, является ли она бомбой или безопасной клеткой
            board.appendChild(cell);//добавляет клетку в игровое поле
            cells.push(cell);//добавляет эту клетку в специальный список клеток, чтобы можно было легко управлять ими в будущем

            cell.addEventListener('click', function (e) {
                //Когда пользователь кликает левой кнопкой мыши вызывается функция click, которая обрабатывает этот клик
                click(cell);
            });

            cell.oncontextmenu = function (e) {
                //это связано с кликами правой кнопкой мыши
                e.preventDefault();//предотвращает стандартное контекстное меню браузера
                addFlag(cell);//вызывается функция добавления флажка
            };
        }
        //код помогает подсчитать и записать информацию о бомбах
        for (let i = 0; i < cells.length; i++) {
            let total = 0;// используется для подсчета количества бомб вокруг текущей клетки
            let leftEdge = i % width === 0;//определяет, находится ли текущая клетка на левом краю игравого поля
            let rightEdge = i % width === width - 1;//тут проверяет находится ли на правом

            if (cells[i].classList.contains('actual')) {
                if (i > 0 && !leftEdge && cells[i - 1].classList.contains('bomb')) total++;
                if (i > 9 && !rightEdge && cells[i + 1 - width].classList.contains('bomb')) total++;
                if (i > 10 && cells[i - width].classList.contains('bomb')) total++;
                if (i > 11 && !leftEdge && cells[i - 1 - width].classList.contains('bomb')) total++;
                if (i < 98 && !rightEdge && cells[i + 1].classList.contains('bomb')) total++;
                if (i < 90 && !leftEdge && cells[i - 1 + width].classList.contains('bomb')) total++;
                if (i < 88 && !rightEdge && cells[i + 1 + width].classList.contains('bomb')) total++;
                if (i < 89 && cells[i + width].classList.contains('bomb')) total++;
                cells[i].setAttribute('data', total);//при клике на клетку игрок может видеть сколько бомб рядом
            }
        }
        timerInterval = setInterval(updateTime, 1000);
    }

    createBoard();

    //если нажать на правую кнопку мыши то добавит флаг
    function addFlag(cell) {
        flagSound.play()//для звука
        if (isGameOver) return
        if (!cell.classList.contains('checked') && flags < bombAmount) {
            if (!cell.classList.contains('flag')) {
                cell.classList.add('flag')
                cell.innerHTML = ' 🚩'
                flags++
                flagsLeft.innerHTML = bombAmount - flags;
                checkForWin();
            } else {
                cell.classList.remove('flag')
                cell.innerHTML = ''
                flags--
                flagsLeft.innerHTML = bombAmount - flags

            }
        }
    }
    function click(cell) {
        clickCounter++;//увеличивает кол-во кликов
        clickCount.textContent = `Clicks: ${clickCounter}`;//обновляет
        clickSound.currentTime = 0;//воспроизводит новый звук щелчка при каждом клике
        clickSound.play();//воспроизводит звук
        let currentId = cell.id;//уникальный индификатор
        if (isGameOver) return;
        if (cell.classList.contains('checked') || cell.classList.contains('flag')) return;
        if (cell.classList.contains('bomb')) {
            gameOver(cell);
        } else {
            let total = cell.getAttribute('data');
            if (total != 0) {//означает, что рядом с текущей клеткой есть бомбы
                cell.classList.add('checked');
                if (total == 1) cell.classList.add('one');
                if (total == 2) cell.classList.add('two');
                if (total == 3) cell.classList.add('three');
                if (total == 4) cell.classList.add('four');
                cell.innerHTML = total;// отображается количество бомб
                return;// после того, как клетка была отмечена и ей был присвоен  стиль
            }
            checkCell(cell, currentId);
        }
        cell.classList.add('checked');
    }
    function checkCell(cell, currentId) {
        const leftEdge = currentId % width === 0;
        const rightEdge = currentId % width === width - 1;

        setTimeout(() => {
            if (currentId > 0 && !leftEdge) {
                const newId = cells[parseInt(currentId) - 1].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId > 9 && !rightEdge) {
                const newId = cells[parseInt(currentId) + 1 - width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId > 10) {
                const newId = cells[parseInt(currentId - width)].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId > 11 && !leftEdge) {
                const newId = cells[parseInt(currentId) - 1 - width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId < 98 && !rightEdge) {
                const newId = cells[parseInt(currentId) + 1].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId < 90 && !leftEdge) {
                const newId = cells[parseInt(currentId) - 1 + width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId < 88 && !rightEdge) {
                const newId = cells[parseInt(currentId) + 1 + width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId < 89) {
                const newId = cells[parseInt(currentId) + width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
        }, 10);
    }
    function gameOver() {
        explosionSound.play();//воспроизведение звука
        isGameOver = true
        result.innerHTML = 'GAME OVER!!!'

        cells.forEach((cell) => {
            if (cell.classList.contains('bomb')) {
                cell.innerHTML = '💣';
                cell.classList.remove('bomb');
                cell.classList.add('checked');
            }
        })
    }
    function checkForWin() {
        winSound.play()//воспроизведение звука
        let matches = 0
        for (let i = 0; i < matches.length; i++) {
            if (cells[i].classList.contains('flag') && cells[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombAmount) {
                result.innerHTML = 'YOU WIN!';
                isGameOver = true;
            }
        }
    }
    //кнопка перезпуска игры
    restartGame.addEventListener('click', function () {
        isGameOver = false
        result.innerHTML = ''
        flags = []
        clickCounter = 0;
        clickCount.textContent = 'Clicks: 0';

        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }
        createBoard();
    });


    // Добавляем созданные элементы в body
    document.body.appendChild(container);
    container.appendChild(board);
    container.appendChild(flagsLeft);
    container.appendChild(result);
    container.appendChild(restartGame);
    container.appendChild(timeElapsed);
    container.appendChild(clickCount)
});

