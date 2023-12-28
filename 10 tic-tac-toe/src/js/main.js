import Game from './Game.js'


// Спросить при обновлении
if(!Game.isGridEmpty() && confirm("Продолжить последнюю игру?"))
    Game.continueGame();
else 
    Game.startNewGame();


Array.from(document.getElementsByClassName("cell")).forEach((cell)=>{
    cell.addEventListener('click', Game.makeStep)
})

document.getElementById('startNewBtn').addEventListener('click', Game.startNewGame)