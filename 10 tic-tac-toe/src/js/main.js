globalThis.player = true // false=='zero', true=='cross'
globalThis.step = 1
globalThis.isWin = false


const template = document.getElementById(player ? "crossTmp" : "zeroTmp").content.cloneNode(true)
document.getElementById('player').innerHTML = ''
document.getElementById('player').appendChild(template)


Array.from(document.getElementsByClassName("cell")).forEach((cell)=>{
    cell.addEventListener('click',(e)=>{
        // сделать ход
        if(e.target.innerHTML==='') {
            if(player) {
                // поставить крестик
                setCross(e.target)
            } else {
                // поставить нолик
                setZero(e.target)
            }

            // определить победителя
            if(checkIsWin(player)) {
                document.getElementById('playerStatus').textContent='Winner!!'
                setTimeout(()=>{alert("С Победой!")}, 500)
                isWin = true

                // заблокировать поле
                toggleArea(true)
                return;
            }
            if(step === 9) {
                document.getElementById('playerStatus').textContent='Ничья'
                document.getElementById('player').textContent=''
                setTimeout(()=>{alert("Ничья!!")}, 500)
                isWin = true
                return;
            }
            
            // указать следующего игрока
            player = !player
            step++
            const template = document.getElementById(player ? "crossTmp" : "zeroTmp").content.cloneNode(true)
            document.getElementById('player').innerHTML = ''
            document.getElementById('player').appendChild(template)
        }
    })
})
function checkIsWin(player) {
    const area = Array.from(document.getElementsByClassName("cell")).map(cell=>checkPlayer(cell))
    const row1 = area.slice(0,3)
    const row2 = area.slice(3,6)
    const row3 = area.slice(6)

    const role = player ? 'cross' : 'zero'
    console.log(step, role)
    console.log(row1)
    console.log(row2)
    console.log(row3)

    // 3 по горизонтали?
    if(row1.filter(cell=>cell===role).length==3) return true
    if(row2.filter(cell=>cell===role).length==3) return true
    if(row3.filter(cell=>cell===role).length==3) return true
    // 3 по вертикали?
    if(isStringsEquel(row1[0], row2[0], row3[0], role)) return true
    if(isStringsEquel(row1[1], row2[1], row3[1], role)) return true
    if(isStringsEquel(row1[2], row2[2], row3[2], role)) return true
    // 3 по диагонали?
    if(isStringsEquel(row1[0],row2[1],row3[2],role)) return true
    if(isStringsEquel(row1[2],row2[1],row3[0],role)) return true

    return false
}
function isStringsEquel(...strings) {
    for (let i = 1; i < strings.length; i++) {
        if (strings[i-1] !== strings[i])
            return false
    }
    return true
}
function checkPlayer(elem) {
    if(elem.querySelector('.zero')) return 'zero'
    if(elem.querySelector('.cross')) return 'cross'
    return null
}
function setCross(parent) {
    const template = document.getElementById("crossTmp").content.cloneNode(true)
    parent.appendChild(template)
    parent.querySelector('.cross').style.pointerEvents = "none"
}
function setZero(parent) {
    const template = document.getElementById("zeroTmp").content.cloneNode(true)
    parent.appendChild(template)
    parent.querySelector('.zero').style.pointerEvents = "none"
}
function toggleArea(isDisable) {
    Array
        .from(document.getElementsByClassName("cell"))
        .forEach(cell => cell.disabled = isDisable)
}


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
