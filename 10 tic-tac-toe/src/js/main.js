import cellClickHandler from './cellClickHandler.js'


globalThis.player = true // false=='zero', true=='cross'
globalThis.step = 1
globalThis.isWin = false


const template = document.getElementById(player ? "crossTmp" : "zeroTmp").content.cloneNode(true)
document.getElementById('player').innerHTML = ''
document.getElementById('player').appendChild(template)


Array.from(document.getElementsByClassName("cell")).forEach((cell)=>{
    cell.addEventListener('click', cellClickHandler)
})


document.getElementById('startNewBtn').addEventListener('click',()=>{
    if(!isWin && !confirm("Стереть текущий прогресс?")) return;

    // стереть
    Array.from(document.getElementsByClassName("cell")).forEach(cell => {cell.innerHTML = ''})
    document.getElementById('player').innerHTML=''
    setCross(document.getElementById('player'))
    player = true
    step = 1
    isWin = false
    document.getElementById('playerStatus').textContent='Игрок'
    toggleArea(false)
})
