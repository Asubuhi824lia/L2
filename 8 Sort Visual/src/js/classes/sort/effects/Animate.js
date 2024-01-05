import { ResetBtn } from '../../Interface/Controls.js'


// Запись и воспроизведение анимаций
export default class Animate {
    // обработка продолжения анимации
    static async continue() {
        while(!isPause && pausedAnimations.length > 0) {
            switch (pausedAnimations[0].isAwait) {
                case true: await pausedAnimations.shift().callback(); break;
                case false:      pausedAnimations.shift().callback(); break;
                default: break;
            }
        }
        if(pausedAnimations.length == 0) ResetBtn.setResetBtn()
    }
    // проверка и обработка вызова Паузы
    static checkIsPause(promise, isAwait = true) {
        switch (isPause) {
            case true: pausedAnimations.push({callback: promise, isAwait}); return ()=>{};
            default: return promise;
        }
    }
}