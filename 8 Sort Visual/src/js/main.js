import {showValueRange, createArraySizeOptions, getMaxValue, changeValue} from './primaryGen.js'


// вывести диапазон значений для ячеек arrNumbs
showValueRange()


/* Интерфейс задания настроек */

createArraySizeOptions() //генерация и обработка ввода arrNumbs
//генерация setAuto
document.getElementById("setAuto").addEventListener('click',()=>{
    Array.from(document.querySelectorAll('.value')).forEach((input,ind)=>{
        input.value = Math.floor(Math.random()*getMaxValue())
        changeValue(ind, input.value)
    })
})
//обработка ввода setAlgorithm
Array.from(document.querySelectorAll('.params label')).forEach(radio=>{
    
    // только 1 checkbox должен быть выбран
    radio.addEventListener('mousedown',()=>{
        Array.from(document.querySelectorAll('.params [type="radio"]')).forEach(elem=>{
            if(elem.checked==true) elem.checked=false
        })
    })
})