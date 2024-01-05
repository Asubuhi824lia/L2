import { ArrNumbs, ArrSize } from './classes/Interface/Inputs.js'
import {SetAlgorithm, SetAuto} from './classes/Interface/Inputs.js'
import { StartBtn,ResetBtn, PauseBtn,ContinueBtn } from './classes/Interface/Controls.js'

globalThis.isPause = false
globalThis.pausedAnimations = []
globalThis.timeout = 500
globalThis.isRun = false //для radio

    /*  Задать поведение  */
// автоматическая генерация значений
document.getElementById("setAuto").addEventListener('click', SetAuto.startGenValues)
// управление ходом анимации
document.getElementById('pauseBtn').addEventListener('click', PauseBtn.switch)
document.getElementById('continueBtn').addEventListener('click', ContinueBtn.switch)
document.getElementById('startBtn').addEventListener('click', StartBtn.startSort)
// сбросить результат и все значения
document.getElementById('resetBtn').addEventListener('click', ResetBtn.resetSort)
// обработка ввода setAlgorithm
Array.from(document.querySelectorAll('#setAlgorithm label')).forEach(radio=>{
    // устраняем предыдущий выбор
    radio.addEventListener('mousedown', SetAlgorithm.delPrevCheck)
    // все ли поля заданы?
    radio.addEventListener('mouseup',()=>setTimeout(StartBtn.setIsInputsReady,100))
})

    /* Дополнить интерфейс */
// сгенерировать значения для списка arrSize
ArrSize.createOptions()
// вывести диапазон значений для ячеек arrNumbs
ArrNumbs.showValueRange()