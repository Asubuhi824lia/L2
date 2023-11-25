// сгенерировать значения для списка arrSize
createArraySizeOptions()
export function createArraySizeOptions() {
    const MIN_ARRAY_SIZE = 3
    const MAX_ARRAY_SIZE = 20
    const DEFAULT_SIZE = 14

    const fragment = document.createDocumentFragment() //для пакетной обработки изменений перед добавлением в DOM
    for (let len = MIN_ARRAY_SIZE; len <= MAX_ARRAY_SIZE; len++) {
        const option = document.createElement('option')
        option.value = len
        option.textContent = len
        if(len === DEFAULT_SIZE) option.selected=true
        fragment.appendChild(option)
    }
    const select = document.getElementById("arrSize")
    select.innerHTML=''
    select.appendChild(fragment)

    changeArraySize(DEFAULT_SIZE) //создать дефолтное кол-во ячеек
    select.addEventListener('change', (e)=>{changeArraySize(e.target.value); isReady()})
}

// вывести диапазон значений для ячеек arrNumbs
showValueRange()
export function showValueRange() {
    const range = document.createElement('span')
    range.append(`от 1 до ${getMaxValue()}`)
    range.style.fontSize = '12px'
    range.style.color = 'red'
    document.querySelector('#manually h4').append(' (',range,')')
}

// менять кол-во ячеек arrNumbs и столбцов на showArea при выборе
export function changeArraySize(length) {
    changeArrNumbs(length)
    changeShowArea(length)
}
// изменить кол-во ячеек arrNumbs
function changeArrNumbs(length) {
    const arrNumbs = document.getElementById('arrNumbs')
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < length; i++) {
        const inputNum = document.createElement('input')
        inputNum.type = 'number'
        inputNum.classList.add('value')
        inputNum.min = 1
        inputNum.max = getMaxValue()
        // исключить возм-ть записи числа больше 3-значного и MAX (250px - 2em)
        inputNum.addEventListener("keydown",(e)=>{
            const value = e.target.value
            setTimeout(()=>{
                if(e.target.value!='' && (Number(e.target.value) > getMaxValue() 
                || Number(e.target.value) < 1)) 
                    e.target.value=value;}
            ,50)
        })
        // отобразить значение на диаграмме showArea
        inputNum.addEventListener("keyup",(e)=>{ //ввод
            setTimeout(()=>changeValue(i, e.target.value),200)
        })
        inputNum.addEventListener("change",(e)=>{//стрелки
            setTimeout(()=>changeValue(i, e.target.value || e.value),200)
        })
        fragment.appendChild(inputNum)
    }
    arrNumbs.innerHTML = ''
    arrNumbs.appendChild(fragment)
}
// изменить кол-во столбцов на showArea
function changeShowArea(length) {
    const showArea = document.getElementById('showArea')
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < length; i++) {
        const div = document.createElement('div')
        div.classList.add('number')
        div.style.width = `calc(100% / ${length})`
        fragment.appendChild(div)
    }
    showArea.innerHTML = ''
    showArea.appendChild(fragment)
}
// получить максимально допустимое значение (250px - 2em)
export function getMaxValue() {
    const areaHeight = Number(window.getComputedStyle(document.getElementById("showArea")).height.split('px')[0])
    const lowHeight  = 2 * Number(window.getComputedStyle(document.body).fontSize.split('px')[0])
    return areaHeight - lowHeight
}
export function changeValue(index, value) {
    // установить value
    const col = document.getElementsByClassName('number')[index]
    col.textContent = value
    col.style.height = `max(calc(${value}px  + 2em),2em)` // MIN = 2em (для вместимости цифры)
    
    // все ли поля заданы?
    isReady()
}

export function isReady() {
    document.getElementById('startBtn').disabled=!isInputsFilled()
}
function isInputsFilled() {
    return isAllValuesFilled('.value') && isSortTypeSelected()
}
function isAllValuesFilled(selector) {
    let isAllFilled = true
    Array.from(document.querySelectorAll(selector)).forEach(input=>{
        if(input.value == '') isAllFilled = false
    })
    return isAllFilled
}
function isSortTypeSelected() {
    let isSelected = false
    Array.from(document.querySelectorAll('#setAlgorithm [type="radio"]')).forEach(elem=>{
        if(elem.checked == true) isSelected = true
    })
    return isSelected
}