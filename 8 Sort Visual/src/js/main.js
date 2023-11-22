
// сгенерировать значения для списка arrSize
const MIN_ARRAY_SIZE = 3
const MAX_ARRAY_SIZE = 20
const DEFAULT_SIZE = 20

const fragment = document.createDocumentFragment() //для пакетной обработки изменений перед добавлением в DOM
for (let size = MIN_ARRAY_SIZE; size <= MAX_ARRAY_SIZE; size++) {
    const option = document.createElement('option')
    option.value = size
    option.textContent = size
    if(size === DEFAULT_SIZE) option.selected=true
    fragment.appendChild(option)
}
const select = document.getElementById("arrSize")
select.innerHTML=''
select.appendChild(fragment)
