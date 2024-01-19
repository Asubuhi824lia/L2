import LS from './LS/LS.js'


export default class DayGoal {
    errMsgs = {
        NAN: "Некорректное значение! Должны быть только цифры.",
        RANGE: "Некорректное значение! Число меньше сотни слишком мало.",
    }
    /**
     * Инициация запроса, обработка ввода и сохранение цели дня.
     */
    constructor() {
        this.goal = prompt("Введите целевой показатель калорийности на день (в кКал)")
        
        if(goal == null || goal.length==0) return;
        else if(isNaN(Number(goal)))alert(this.errMsgs.NAN);
        else if(goal.length < 3)    alert(this.errMsgs.RANGE);
        else {
            document.getElementById('dayGoal').textContent = `${goal} кКал`
            LS.setGoal(goal)
        }
    }
    /**
     * Установить текущее значение цели дня либо "заглушку".
     */
    static set() {
        const LSgoal = LS.getGoal()
        document.getElementById('dayGoal')
        .textContent = (!LSgoal || LSgoal=='') ? 'Укажите норму!' : LSgoal
    }
}