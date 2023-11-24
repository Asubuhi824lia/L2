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
        BubbleSort(array)
    } else if(document.getElementById('shakerSort').checked) {
        ShakerSort(array)
    }
})

  
async function BubbleSort(values) {
    let startT = 500
    for (let i = 0; i + 1 < values.length; ++i) {
        for (let j = 0; j + 1 < values.length - i; ++j) {
            await selectNumbs(j, j+1, startT+500)
            if (values[j + 1] < values[j]) {
                await animateExchange(j, j+1, startT);
                [values[j], values[j + 1]] = [values[j + 1], values[j]]
            }
            leaveNumbs(j, j+1, startT+500)// выполнить чуть раньше selectNumbs
            if(j+1 === values.length - i - 1) await showFixedNumb(j+1, startT)
        }
    }

    await showFixedNumb(0, startT) //окрасить оставшийся элемент
    return values
}

async function ShakerSort(values) {
    let startT = 500
    
    let left = 0;
    let right = values.length - 1;
    while (left <= right) {    
        for (let i = right; i > left; --i) {
            await selectNumbs(i-1, i, startT)
            if (values[i - 1] > values[i]) {
                await animateExchange(i-1, i, startT);
                [values[i - 1], values[i]] = [values[i], values[i - 1]]
            }
            leaveNumbs(i-1, i, startT)// выполнить чуть раньше selectNumbs
            if(i === left + 1) await showFixedNumb(i-1, startT)
        }
        ++left;

        for (let i = left; i < right; ++i) {
            await selectNumbs(i, i+1, startT)
            if (values[i] > values[i + 1]) {
                await animateExchange(i, i+1, startT);
                [values[i], values[i + 1]] = [values[i + 1], values[i]]
            }
            leaveNumbs(i, i+1, startT)// выполнить чуть раньше selectNumbs
            if(i === right - 1) await showFixedNumb(i+1, startT)
        }
        --right;
    }
    
    showFixedNumb(Math.floor(values.length/2), startT) //окрасить оставшийся элемент
    return values
}