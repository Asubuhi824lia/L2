import {getMaxValue, changeValue, isReady, changeArraySize} from './primaryGen.js'
import {selectNumbs, selectNumb, leaveNumbs, leaveNumb,
        animateSwap, showFixedNumb, showDefNumb} from './sortAnimate.js'

globalThis.isPause = true

const timeout = 500
let isRun = false //для radio


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
            if(elem.checked==true && !isRun) elem.checked=false
        })
    })
    // все ли поля заданы?
    radio.addEventListener('mouseup',()=>{
        setTimeout(()=>isReady(),100)
    })
})

function setInputsDisabled(isDisabled) {
    Array.from(document.querySelectorAll('#setAlgorithm [type="radio"]')).forEach(radio=>{
        radio.disabled = isDisabled
    })
    Array.from(document.querySelectorAll('.value')).forEach(input=>{
        input.disabled = isDisabled
    })
    document.getElementById('setAuto').disabled = isDisabled
    document.getElementById('arrSize').disabled = isDisabled
}
document.getElementById('startBtn').addEventListener('click',(e)=>{
    e.target.classList.add('hide')
    document.getElementById('onRun').classList.remove('hide')
    
    // заблокировать поля ввода setAlgorithm, value, setAuto, arrSize
    isRun = true
    setInputsDisabled(isRun)

    const array = Array.from(document.querySelectorAll('.value')).map(input=>Number(input.value))
    sort(array)
})
document.getElementById('pauseBtn').addEventListener('click',(e)=>{
    globalThis.isPause = true
    e.target.disabled = true
    isRun = false
    document.getElementById('continueBtn').disabled = false
})
document.getElementById('continueBtn').addEventListener('click',(e)=>{
    globalThis.isPause = false
    e.target.disabled = true
    isRun = true
    document.getElementById('pauseBtn').disabled = false
})
document.getElementById('resetBtn').addEventListener('click',(e)=>{
    setInputsDisabled(false)

    const select = document.getElementById("arrSize")
    changeArraySize(select.value)

    e.target.classList.add('hide')
    document.getElementById('startBtn').classList.remove('hide')
})


async function sort(array) {
    await new Promise((resolve)=>{
        if(document.getElementById('bubbleSort').checked) {
            resolve(BubbleSort(array))
        } else if(document.getElementById('shakerSort').checked) {
            resolve(ShakerSort(array))
        } else if(document.getElementById('combSort').checked) {
            resolve(CombSort(array))
        } else if(document.getElementById('insertSort').checked) {
            resolve(InsertSort(array))
        } else if(document.getElementById('selectSort').checked) {
            resolve(SelectSort(array))
        }

        setTimeout(()=>{},timeout)
    })

    // сброс для начала заново
    document.getElementById('onRun').classList.add('hide')
    document.getElementById('resetBtn').classList.remove('hide')
}
  
async function BubbleSort(values) {
    for (let i = 0; i + 1 < values.length; ++i) {
        for (let j = 0; j + 1 < values.length - i; ++j) {
            await selectNumbs(j, j+1, timeout)
            if (values[j + 1] < values[j]) {
                await animateSwap(j, j+1, timeout);
                [values[j], values[j + 1]] = [values[j + 1], values[j]]
            }
            leaveNumbs(j, j+1, timeout)// выполнить чуть раньше selectNumbs
            if(j+1 === values.length - i - 1) await showFixedNumb(j+1, timeout)
        }
    }

    await showFixedNumb(0, timeout) //окрасить оставшийся элемент
    return values
}

async function ShakerSort(values) {
    let left = 0;
    let right = values.length - 1;
    while (left <= right) {    
        for (let i = right; i > left; --i) {
            await selectNumbs(i-1, i, timeout)
            if (values[i - 1] > values[i]) {
                await animateSwap(i-1, i, timeout);
                [values[i - 1], values[i]] = [values[i], values[i - 1]]
            }
            leaveNumbs(i-1, i, timeout)// выполнить чуть раньше selectNumbs
            if(i === left + 1) await showFixedNumb(i-1, timeout)
        }
        ++left;

        for (let i = left; i < right; ++i) {
            await selectNumbs(i, i+1, timeout)
            if (values[i] > values[i + 1]) {
                await animateSwap(i, i+1, timeout);
                [values[i], values[i + 1]] = [values[i + 1], values[i]]
            }
            leaveNumbs(i, i+1, timeout)// выполнить чуть раньше selectNumbs
            if(i === right - 1) await showFixedNumb(i+1, timeout)
        }
        --right;
    }

    showFixedNumb(Math.floor(values.length/2), timeout) //окрасить оставшийся элемент
    return values
}

async function CombSort(values) {
    const factor = 1.247; // Фактор уменьшения
    let step = values.length - 1;
    while (step >= 1) {
        for (let i = 0; i + step < values.length; ++i) {
            await selectNumbs(i, i + step, timeout)
            if (values[i] > values[i + step]) {
                await animateSwap(i + step, i, timeout);
                await animateSwap(i, i + step, timeout);
                
                [values[i], values[i + step]] = [values[i + step], values[i]]
            }
            leaveNumbs(i, i + step, timeout)// выполнить чуть раньше selectNumbs
        }
        step = Math.floor(step / factor);
    }
}

async function InsertSort(values) {
    for (let i = 1; i < values.length; ++i) {
        const x = values[i]
        let j = i
        await selectNumb(i, timeout)
        while (j > 0 && values[j - 1] > x) {
            await selectNumb(j - 1, timeout)
            if(j - 1 !== 0 && !(values[j - 2] < x && values[j - 1] >= x) )
                leaveNumb(j - 1, timeout)

            values[j] = values[j - 1]
            --j
        }
        if(i != j) {
            values[j] = x
            await animateSwap(j, i, timeout)
        }
        leaveNumbs(j, j+1, timeout)
    }
    console.log(values)
}

async function SelectSort(values) {
    for (let i = 0; i < values.length; ++i) {
        
        // отобразить перебор элементов от i до конца
        let min = i
        await showDefNumb(min, timeout)
        for(let pos = i+1; pos < values.length; ++pos) {
            await selectNumb(pos, timeout)
            
            if(values[min] > values[pos]) {
                if(min != i)leaveNumb(min, timeout)
                min = pos
                await selectNumb(min, timeout)
            } else if(pos == values.length-1 && pos != min) {
                await leaveNumb(pos, timeout)
            } else {
                leaveNumb(pos, timeout) //выполнить чуть раньше selectNumbs
            }
        }
        
        // поменять местами
        leaveNumb(i, timeout)
        showFixedNumb(min, timeout)
        if(min > i) {
            await animateSwap(min, i, timeout)
            await animateSwap(i, min, timeout)
        }
        await leaveNumbs(i, min, timeout);
        [values[i], values[min]] = [values[min], values[i]]
        
    }
}