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