import {getMaxValue, changeValue, isReady, changeArraySize} from './primaryGen.js'
import {selectNumbs, selectNumb, leaveNumbs, leaveNumb,
        animateSwap, showFixedNumb, showDefNumb} from './sortAnimate.js'

globalThis.isPause = false
globalThis.pausedAnimations = []

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
    
    // заблокировать ввод setAlgorithm, value, setAuto, arrSize
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
    continueAnimate()
})
document.getElementById('resetBtn').addEventListener('click',(e)=>{
    setInputsDisabled(false)
    isRun = false

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

    if(!isPause) setResetBtn()
}

function setResetBtn() {
    document.getElementById('onRun').classList.add('hide')
    document.getElementById('resetBtn').classList.remove('hide')
}

async function BubbleSort(values) {
    for (let i = 0; i + 1 < values.length; ++i) {
        for (let j = 0; j + 1 < values.length - i; ++j) {
            await checkIsPause( selectNumbs(j, j+1, timeout) )()
            if (values[j + 1] < values[j]) {
                await checkIsPause( animateSwap(j, j+1, timeout) )();
                [values[j], values[j + 1]] = [values[j + 1], values[j]]
            }
            checkIsPause( leaveNumbs(j, j+1, timeout), false )()// выполнить чуть раньше selectNumbs
            if(j+1 === values.length - i - 1) await checkIsPause( showFixedNumb(j+1, timeout) )()
        }
    }

    await checkIsPause( showFixedNumb(0, timeout) )//окрасить оставшийся элемент
    return values
}

async function ShakerSort(values) {
    let left = 0;
    let right = values.length - 1;
    while (left <= right) {    
        for (let i = right; i > left; --i) {
            await checkIsPause( selectNumbs(i-1, i, timeout) )()
            if (values[i - 1] > values[i]) {
                await checkIsPause( animateSwap(i-1, i, timeout) )();
                [values[i - 1], values[i]] = [values[i], values[i - 1]]
            }
            checkIsPause( leaveNumbs(i-1, i, timeout), false )()// выполнить чуть раньше selectNumbs
            if(i === left + 1) await checkIsPause( showFixedNumb(i-1, timeout) )()
        }
        ++left;

        for (let i = left; i < right; ++i) {
            await checkIsPause( selectNumbs(i, i+1, timeout) )()
            if (values[i] > values[i + 1]) {
                await checkIsPause( animateSwap(i, i+1, timeout) )();
                [values[i], values[i + 1]] = [values[i + 1], values[i]]
            }
            checkIsPause( leaveNumbs(i, i+1, timeout), false )()// выполнить чуть раньше selectNumbs
            if(i === right - 1) await checkIsPause( showFixedNumb(i+1, timeout) )()
        }
        --right;
    }

    checkIsPause( showFixedNumb(Math.floor(values.length/2), timeout), false )() //окрасить оставшийся элемент
    return values
}

async function CombSort(values) {
    const factor = 1.247; // Фактор уменьшения
    let step = values.length - 1;
    while (step >= 1) {
        for (let i = 0; i + step < values.length; ++i) {
            await checkIsPause( selectNumbs(i, i + step, timeout) )()

            if (values[i] > values[i + step]) {
                await checkIsPause( animateSwap(i + step, i, timeout) )()
                await checkIsPause( animateSwap(i, i + step, timeout, true) )()
                
                ;[values[i], values[i + step]] = [values[i + step], values[i]]
            }
            checkIsPause( leaveNumbs(i, i + step, timeout), false )() 
        }
        step = Math.floor(step / factor);
    }
}

async function InsertSort(values) {
    for (let i = 1; i < values.length; ++i) {
        const x = values[i]
        let j = i
        await checkIsPause( selectNumb(i, timeout) )()
        while (j > 0 && values[j - 1] > x) {
            await checkIsPause( selectNumb(j - 1, timeout) )()
            if(j - 1 !== 0 && !(values[j - 2] < x && values[j - 1] >= x) )
                checkIsPause( leaveNumb(j - 1, timeout), false )()

            values[j] = values[j - 1]
            --j
        }
        if(i != j) {
            values[j] = x
            await checkIsPause( animateSwap(j, i, timeout) )()
        }
        checkIsPause( leaveNumbs(j, j+1, timeout), false )()
    }
}

async function SelectSort(values) {
    for (let i = 0; i < values.length; ++i) {
        
        // отобразить перебор элементов от i до конца
        let min = i
        await checkIsPause( showDefNumb(min, timeout) )()
        for(let pos = i+1; pos < values.length; ++pos) {
            await checkIsPause( selectNumb(pos, timeout) )()
            
            if(values[min] > values[pos]) {
                if(min != i) checkIsPause( leaveNumb(min, timeout), false )()
                min = pos
                await checkIsPause( selectNumb(min, timeout) )()
            } else if(pos == values.length-1 && pos != min) {
                await checkIsPause( leaveNumb(pos, timeout) )()
            } else {
                checkIsPause( leaveNumb(pos, timeout), false )() //выполнить чуть раньше selectNumbs
            }
        }
        
        // поменять местами
        checkIsPause( leaveNumb(i, timeout), false )()
        checkIsPause( showFixedNumb(min, timeout), false )()
        if(min > i) {
            await checkIsPause( animateSwap(min, i, timeout) )()
            await checkIsPause( animateSwap(i, min, timeout) )()
        }
        await checkIsPause( leaveNumbs(i, min, timeout) )();
        [values[i], values[min]] = [values[min], values[i]]
        
    }
}


// проверка и обработка вызова Паузы
function checkIsPause(callback, isAwait = true) {
    if(!isPause) 
        return callback
    else 
        pausedAnimations.push({callback, isAwait})
        return ()=>{}     
}
// обработка продолжения анимации
async function continueAnimate() {
    while(!isPause && pausedAnimations.length > 0) {
        if(pausedAnimations[0].isAwait)
            await pausedAnimations.shift().callback()
        else
            pausedAnimations.shift().callback()
    }
    if(pausedAnimations.length == 0) setResetBtn()
}