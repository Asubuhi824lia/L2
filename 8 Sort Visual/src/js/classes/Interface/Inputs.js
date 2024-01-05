import { StartBtn } from "./Controls.js"
import ShowArea from "./Visual.js"


class Input {
    static disable(selector, isDisabled) {
        Array.from(document.querySelectorAll(selector)).forEach(elem=>{
            elem.disabled = isDisabled
        })
    }
}


export class SetAlgorithm extends Input {

    static disable(isDisabled) {
        Input.disable('#setAlgorithm [type="radio"]', isDisabled)
    }
    
    static isSortTypeSelected() {
        let isSelected = false
        Array.from(document.querySelectorAll('#setAlgorithm [type="radio"]')).forEach(elem=>{
            if(elem.checked == true) isSelected = true
        })
        return isSelected
    }

    static delPrevCheck() {
        Array.from(document.querySelectorAll('#setAlgorithm [type="radio"]')).forEach(elem=>{
            if(elem.checked==true && !isRun) elem.checked=false
        })
    }
}

export class SetAuto extends Input {

    static disable(isDisabled) {
        Input.disable('#setAuto', isDisabled)
    }

    static startGenValues(e) {
        Array.from(document.querySelectorAll('.value')).forEach((input,ind)=>{
            input.value = Math.floor(Math.random() * ShowArea.getMaxValue() + 1)
            ShowArea.changeValue(ind, input.value)
        })
        StartBtn.setIsInputsReady();
    }
}

export class ArrSize extends Input {
    
    static disable(isDisabled) {
        Input.disable('#setAuto', isDisabled)
    }

    static createOptions() {
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

        ArrSize.changeArraySize(DEFAULT_SIZE) //создать дефолтное кол-во ячеек
        select.addEventListener('change', (e)=>{ArrSize.changeArraySize(e.target.value); StartBtn.setIsInputsReady()})
    }

    static changeArraySize(length) {//при выборе
        ArrNumbs.changeArrNumbs(length)  // менять кол-во ячеек для значений
        ShowArea.changeShowArea(length)  // менять кол-во столбцов 
    }
}

export class ArrNumbs extends Input {

    static disable(isDisabled) {
        Input.disable('.value', isDisabled)
    }

    static showValueRange() {
        const range = document.createElement('span')
        range.append(`от 1 до ${ShowArea.getMaxValue()}`)
        range.style.fontSize = '12px'
        range.style.color = 'red'
        document.querySelector('#manually h4').append(' (',range,')')
    }

    static changeArrNumbs(length) {
        const arrNumbs = document.getElementById('arrNumbs')
        const fragment = document.createDocumentFragment()
        for (let i = 0; i < length; i++) {
            const inputNum = document.createElement('input')
            inputNum.type = 'number'
            inputNum.classList.add('value')
            inputNum.min = 1
            inputNum.max = ShowArea.getMaxValue()
            // исключить возм-ть записи числа больше 3-значного и MAX (250px - 2em)
            inputNum.addEventListener("keydown",(e)=>{
                const value = e.target.value
                setTimeout(()=>{
                    if(e.target.value!='' && (Number(e.target.value) > ShowArea.getMaxValue() 
                    || Number(e.target.value) < 1)) 
                        e.target.value=value;}
                ,50)
            })
            // отобразить значение на диаграмме showArea
            inputNum.addEventListener("input",(e)=>{ //клавиатура
                setTimeout(()=>ShowArea.changeValue(i, e.target.value), 200)
            })
            fragment.appendChild(inputNum)
        }
        arrNumbs.innerHTML = ''
        arrNumbs.appendChild(fragment)
    }

    static isAllValuesFilled() {
        let isAllFilled = true
        Array.from(document.querySelectorAll('#arrNumbs .value')).forEach(input=>{
            if(input.value == '') isAllFilled = false
        })
        return isAllFilled
    }
}


export default function isInputsFilled() {
    return ArrNumbs.isAllValuesFilled() && SetAlgorithm.isSortTypeSelected()
}