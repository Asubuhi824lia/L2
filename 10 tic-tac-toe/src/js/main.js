import Game from './Game.js'


// Спросить при обновлении
if(!Game.isGridEmpty())
    if(confirm("Продолжить последнюю игру?"))
        Game.continueGame();
    else 
        Game.startNewGame(true); //не анализировать предыдущий прогресс
else 
    Game.startNewGame();


Array.from(document.getElementsByClassName("cell")).forEach((cell)=>{
    cell.addEventListener('click', Game.makeStep)
})

document.getElementById('startNewBtn').addEventListener('click', Game.startNewGame)