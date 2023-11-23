import {getMaxValue, changeValue, isReady} from './primaryGen.js'



/* Интерфейс задания настроек */

// автоматическая генерация значений
document.getElementById("setAuto").addEventListener('click',()=>{
    Array.from(document.querySelectorAll('.value')).forEach((input,ind)=>{
        input.value = Math.floor(Math.random()*getMaxValue())
        changeValue(ind, input.value)
    })
})
// обработка ввода setAlgorithm
Array.from(document.querySelectorAll('#setAlgorithm label')).forEach(radio=>{

    radio.addEventListener('mousedown',()=>{
        // устраняем предыдущий выбор
        Array.from(document.querySelectorAll('#setAlgorithm [type="radio"]')).forEach(elem=>{
            if(elem.checked==true) elem.checked=false
        })
    })
    // все ли поля заданы?
    radio.addEventListener('mouseup',()=>{
        setTimeout(()=>isReady(),100)
    })
})
