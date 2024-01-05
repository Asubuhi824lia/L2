import Animate from '../sort/effects/Animate.js'
import isInputsFilled, {
    ArrSize,
    ArrNumbs,
    SetAlgorithm,
    SetAuto,
} from './Inputs.js'
import Sort from '../sort/Sort.js'


// Общее для "Старта" и "Сброса"
class EdgeControl {
    static btns_id = {
        START: 'startBtn',
        ONRUN: 'onRun',
        RESET: 'resetBtn',
    }

    // Блокировка ввода setAlgorithm, value, setAuto, arrSize
    static setInputsDisabled(isDisable) {
        globalThis.isRun = isDisable

        ArrSize.disable(isRun)
        ArrNumbs.disable(isRun)
        SetAlgorithm.disable(isRun)
        SetAuto.disable(isRun)
    }
    // Заменить кнопку
    static setResetBtn() {this._changeBtn(this.btns_id.ONRUN, this.btns_id.RESET)}
    static setStartBtn() {this._changeBtn(this.btns_id.RESET, this.btns_id.START)}
    static setOnRunBtns(){this._changeBtn(this.btns_id.START, this.btns_id.ONRUN)}

    static _changeBtn(curElemId, nextElemId) {
        document.getElementById(curElemId).classList.add('hide')
        document.getElementById(nextElemId).classList.remove('hide')
    }
}

export class StartBtn extends EdgeControl {

    static startSort() {
        EdgeControl.setInputsDisabled(true)
        EdgeControl.setOnRunBtns()

        // Определить и начать сортировку
        const array = Array.from(document.querySelectorAll('.value')).map(input=>Number(input.value))
        StartBtn.sort(array)
    }

    static async sort(array) {
        await new Promise((resolve)=>{
            if(document.getElementById('bubbleSort').checked) {
                resolve(Sort.BubbleSort(array))
            } else if(document.getElementById('shakerSort').checked) {
                resolve(Sort.ShakerSort(array))
            } else if(document.getElementById('combSort').checked) {
                resolve(Sort.CombSort(array))
            } else if(document.getElementById('insertSort').checked) {
                resolve(Sort.InsertSort(array))
            } else if(document.getElementById('selectSort').checked) {
                resolve(Sort.SelectSort(array))
            }
    
            // setTimeout(()=>{},timeout)
        })
    
        if(!isPause) EdgeControl.setResetBtn()
    }

    static setIsInputsReady() {
        document.getElementById('startBtn').disabled = !isInputsFilled()
    }
    
}

export class ResetBtn extends EdgeControl {
    static resetSort() {
        EdgeControl.setInputsDisabled(false)
        EdgeControl.setStartBtn()

        // Обнулить все значения
        ResetBtn.resetValues()
        document.getElementById("startBtn").disabled = true
    }

    static resetValues() {
        const select = document.getElementById("arrSize")
        ArrSize.changeArraySize(select.value)
    }
}


// Общее для runtime-кнопок "Пауза" и "Продолжить"
class OnRunControl {
    static mode = {
        RUN: [true, 'continueBtn'],
        PAUSE: [false, 'pauseBtn'],
    }

    static switch(elem, mode) {
        OnRunControl._switchMode(mode);
        OnRunControl._switchBtns(elem, mode ? this.mode.RUN[1] : this.mode.PAUSE[1]);
    }

    static _switchMode(mode) {
        isRun   = this.mode.RUN[0]  ===mode
        isPause = this.mode.PAUSE[0]===mode
    }
    static _switchBtns(elem, mode) {
        elem.disabled = true
        document.getElementById(mode).disabled = false
    }
}

export class PauseBtn extends OnRunControl {
    static switch(e) {
        OnRunControl.switch(e.target, true)
    }
}

export class ContinueBtn extends OnRunControl {
    static switch(e) {
        OnRunControl.switch(e.target, false)
        Animate.continue()
    }
}