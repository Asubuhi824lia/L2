globalThis.player = true // false=='zero', true=='cross'
const template = document.getElementById(player ? "crossTmp" : "zeroTmp").content.cloneNode(true)
document.getElementById('player').innerHTML = ''
document.getElementById('player').appendChild(template)


Array.from(document.getElementsByClassName("cell")).forEach((cell)=>{
    cell.addEventListener('click',(e)=>{
        console.log(e.target.innerHTML, e.target)
        // сделать ход
        if(e.target.innerHTML==='') {
            if(player) {
                // поставить крестик
                const template = document.getElementById("crossTmp").content.cloneNode(true)
                e.target.appendChild(template)
                e.target.querySelector('.cross').style.pointerEvents = "none"
            } else {
                // поставить нолик
                const template = document.getElementById("zeroTmp").content.cloneNode(true)
                e.target.appendChild(template)
                e.target.querySelector('.zero').style.pointerEvents = "none"
            }
            // указать следующего игрока
            player = !player
            const template = document.getElementById(player ? "crossTmp" : "zeroTmp").content.cloneNode(true)
            document.getElementById('player').innerHTML = ''
            document.getElementById('player').appendChild(template)
        }
    })
})


document.getElementById('startNewBtn').addEventListener('click',()=>{
    const isFinished = Array.from(document.getElementsByClassName('cell'))
                            .map(e=>e.innerHTML)
                            .filter(str=>str==='')
                            .length === 0
    if(!isFinished && !confirm("Стереть текущий прогресс?")) return;
    Array.from(document.getElementsByClassName("cell")).forEach(cell => {cell.innerHTML = ''})
})
