import isInputsFilled from "./Inputs.js"


export default class ShowArea {
    static changeValue(index, value) {
        // установить value
        const col = document.getElementsByClassName('number')[index]
        col.textContent = value
        col.style.height = `max(calc(${value}px  + 2em),2em)` // MIN = 2em (для вместимости цифры)
        
        // все ли поля заданы?
        isInputsFilled()
    }
    // получить максимально допустимое значение (250px - 2em)
    static getMaxValue() {
        const areaHeight = Number(window.getComputedStyle(document.getElementById("showArea")).height.split('px')[0])
        const lowHeight  = 2 * Number(window.getComputedStyle(document.body).fontSize.split('px')[0])
        return areaHeight - lowHeight
    }
    // изменить кол-во столбцов на showArea
    static changeShowArea(length) {
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
}