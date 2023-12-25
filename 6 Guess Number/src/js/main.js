import Game from './Game.js'


// Начать игру
document.getElementById('startGame')
        .addEventListener('click',()=>Game.start())

// Сравнить ввод с загаданным числом
document.getElementById('checkNumBtn')
        .addEventListener('click',()=>Game.checkValue())