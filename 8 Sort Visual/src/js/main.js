
// сгенерировать значения для списка arrSize
function createArraySizeOptions() {
    const MIN_ARRAY_SIZE = 3
    const MAX_ARRAY_SIZE = 20
    const DEFAULT_SIZE = 20

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

    changeArraySize(DEFAULT_SIZE) //создать дефолтное кол-во ячеей
    select.addEventListener('change', (e)=>changeArraySize(e.target.value))
}
createArraySizeOptions()


// менять кол-во ячеек arrNumbs и столбцов на showArea при выборе
function changeArraySize(length) {

    // изменить кол-во ячеек arrNumbs
    const arrNumbs = document.getElementById('arrNumbs')
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < length; i++) {
        const inputNum = document.createElement('input')
        inputNum.type = 'number'
        // исключить возм-ть записи числа больше 3-значного
        inputNum.addEventListener("keydown",(e)=>{
            const value = e.target.value
            if(value.length == 3) { setTimeout(()=>{e.target.value=value;},50) }
        })
        fragment.appendChild(inputNum)
    }
    arrNumbs.innerHTML = ''
    arrNumbs.appendChild(fragment)
}