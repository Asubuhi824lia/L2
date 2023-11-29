globalThis.attempts = 0


// Начать игру
document.getElementById('startGame').addEventListener('click',(e)=>{
    let min = document.getElementById('lowValue').value
    let max = document.getElementById('highValue').value

    if(max === '' || max === '-' || max === '--') {alert("Некорректен максимум!");return}
    if(min === '' || min === '-' || min === '--') {alert("Некорректен минимум!"); return}
    min = Number(min)
    max = Number(max)
    if(min > max) {alert("Минимум больше максимума!"); return}
    if(min === max) {alert("Минимум равен максимуму!");return}

    // Загадать число
    globalThis.num =  Math.floor(Math.random()*max) + min

    // Изменить интерфейс 
    if(globalThis.attempts === 0) {
        document.getElementById('highValue').disabled = true
        document.getElementById('lowValue').disabled = true
        Array.from(document.querySelectorAll('.hide')).forEach(elem => (elem.id!='parity') && elem.classList.remove('hide'))
        e.target.classList.add('hide')
    } else {
        document.getElementById('startGame').classList.remove('hide')
        document.getElementById('checkNumBtn').disabled = false
        document.getElementById('userNum').disabled     = false
        document.getElementById('userNum').value   =''
        document.getElementById('answer').innerHTML=''
        document.getElementById('numAttempt').textContent = 0
        document.getElementById('highValue').disabled = true
        document.getElementById('lowValue').disabled  = true
    }
})


// Сравнить ввод с загаданным числом
document.getElementById('checkNumBtn').addEventListener('click',()=>{
    const userValue = Number(document.getElementById('userNum').value)

    const min = Number(document.getElementById('lowValue').value)
    const max = Number(document.getElementById('highValue').value)
    if(userValue < min || max < userValue) {
        alert("Указанное число за пределами диапазона!!")
        return;
    }

    if(userValue === num) {
        document.getElementById('answer').innerText = `Верно!\nЭто число ${userValue}`
        document.getElementById('checkNumBtn').disabled = true
        document.getElementById('userNum').disabled     = true
        document.getElementById('startGame').classList.remove('hide')
        document.getElementById('highValue').disabled = false
        document.getElementById('lowValue').disabled  = false
        document.getElementById('parity').classList.add('hide')
        document.getElementById('numAttempt').textContent = ++attempts
    } else if(userValue < num) {
        document.getElementById('answer').textContent = 'Больше'
        if(++attempts % 3 === 0) document.getElementById('parity').classList.remove('hide')
        document.getElementById('numAttempt').textContent = attempts
    } else {
        document.getElementById('answer').textContent = 'Меньше'
        if(++attempts % 3 === 0) document.getElementById('parity').classList.remove('hide')
        document.getElementById('numAttempt').textContent = attempts
    }
})