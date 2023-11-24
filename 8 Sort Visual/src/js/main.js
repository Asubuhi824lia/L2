import {getMaxValue, changeValue, isReady} from './primaryGen.js'
import {selectNumbs, selectNumb, leaveNumbs, leaveNumb,
        animateSwap, showFixedNumb, showDefNumb} from './sortAnimate.js'


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
    } else if(document.getElementById('combSort').checked) {
        // CombSort(array)
        console.log('combSort')
    } else if(document.getElementById('insertSort').checked) {
        // InsertSort(array)
        console.log('insertSort')
    } else if(document.getElementById('selectSort').checked) {
        SelectSort(array)
    }
})

  
async function BubbleSort(values) {
    let startT = 500
    for (let i = 0; i + 1 < values.length; ++i) {
        for (let j = 0; j + 1 < values.length - i; ++j) {
            await selectNumbs(j, j+1, startT)
            if (values[j + 1] < values[j]) {
                await animateSwap(j, j+1, startT);
                [values[j], values[j + 1]] = [values[j + 1], values[j]]
            }
            leaveNumbs(j, j+1, startT)// выполнить чуть раньше selectNumbs
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
                await animateSwap(i-1, i, startT);
                [values[i - 1], values[i]] = [values[i], values[i - 1]]
            }
            leaveNumbs(i-1, i, startT)// выполнить чуть раньше selectNumbs
            if(i === left + 1) await showFixedNumb(i-1, startT)
        }
        ++left;

        for (let i = left; i < right; ++i) {
            await selectNumbs(i, i+1, startT)
            if (values[i] > values[i + 1]) {
                await animateSwap(i, i+1, startT);
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

async function SelectSort(values) {
    let startT = 1000
    for (let i = 0; i < values.length; ++i) {
        
        // отобразить перебор элементов от i до конца
        let min = i
        await showDefNumb(min, startT)
        for(let pos = i+1; pos < values.length; ++pos) {
            await selectNumb(pos, startT)
            
            if(values[min] > values[pos]) {
                if(min != i)leaveNumb(min, startT)
                min = pos
                await selectNumb(min, startT)
            } else if(pos == values.length-1 && pos != min) {
                await leaveNumb(pos, startT)
            } else {
                leaveNumb(pos, startT) //выполнить чуть раньше selectNumbs
            }
        }
        
        // поменять местами
        leaveNumb(i, startT)
        showFixedNumb(min, startT)
        if(min > i) {
            await animateSwap(min, i, startT)
            await animateSwap(i, min, startT)
        }
        await leaveNumbs(i, min, startT);
        [values[i], values[min]] = [values[min], values[i]]
        
    }
}