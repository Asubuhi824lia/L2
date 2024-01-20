import LS from './LS/LS.js'


export default class DayGoal {
    static errMsgs = {
        NAN: "Некорректное значение! Должны быть только цифры.",
        RANGE: "Некорректное значение! Число меньше сотни слишком мало.",
    }
    /**
     * Инициация запроса, обработка ввода и сохранение цели дня.
     */
    static askDayGoal() {
        const goal = prompt("Введите целевой показатель калорийности на день (в кКал)")
        
        if(goal == null || goal.length==0) return;
        else if(isNaN(Number(goal)))alert(DayGoal.errMsgs.NAN);
        else if(goal.length < 3)    alert(DayGoal.errMsgs.RANGE);
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
    static get() {
        return LS.getGoal().split(' ')[0]
    }

    static checkDayLimit() {
        let curDay = LS.getProducts().days.reverse()[0].products
        curDay = curDay.map(prod => 
            (prod.measure.length==5 ? Number(prod.calories)*1000 : prod.calories)
        )
        const curSum = curDay.reduce((count, calories) => count + Number(calories), 0)
        const curDayGoal = Number(this.get())*1000

        if(curSum > curDayGoal) {
            alert("Дневной лимит калорий превышен!!")
        }
    }
}