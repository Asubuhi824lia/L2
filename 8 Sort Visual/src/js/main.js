import {getMaxValue, changeValue, isReady} from './primaryGen.js'
import {selectNumbs, leaveNumbs, animateExchange, showFixedNumb} from './sortAnimate.js'


/*  Задать поведение  */

// автоматическая генерация значений
document.getElementById("setAuto").addEventListener('click',()=>{
    Array.from(document.querySelectorAll('.value')).forEach((input,ind)=>{
        input.value = Math.floor(Math.random()*getMaxValue() + 1)
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


document.getElementById('startBtn').addEventListener('click',()=>{
    const array = Array.from(document.querySelectorAll('.value')).map(input=>Number(input.value))
    console.log(array)

    if(document.getElementById('bubbleSort').checked) {
        console.log(BubbleSort(array))
    }
})

  
async function BubbleSort(values) {
    for (let i = 0; i + 1 < values.length; ++i) {
        for (let j = 0; j + 1 < values.length - i; ++j) {
            let startT = 500
            selectNumbs(j, j+1, startT)
            if (values[j + 1] < values[j]) {
                startT += 500
                await animateExchange(j, j+1, startT).then(()=>{
                    [values[j], values[j + 1]] = [values[j + 1], values[j]]
                })
            }
            startT += 500
            await leaveNumbs(j, j+1, startT)
            if(j+1 === values.length - i - 1) await showFixedNumb(j+1, startT+500)
        }
    }
    return values
}