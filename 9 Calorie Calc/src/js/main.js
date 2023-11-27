document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('dayGoal').textContent = localStorage.getItem('CalorieCalc_goal')
})

// Изменить целевые показатели калорийности на день
document.querySelector('#editDayGoal').addEventListener('click',()=>{
    const goal = prompt("Введите целевой показатель калорийности на день (в кКал)")
    
    if(goal == null || goal.length==0) {
        return;
    } else if(isNaN(Number(goal))) {
        alert("Некорректное значение! Должны быть только цифры.")
    } else if(goal.length < 3) {
        alert("Некорректное значение! Число меньше сотни слишком мало")
    } else {
        document.getElementById('dayGoal').textContent = `${goal} кКал`
        localStorage.setItem('CalorieCalc_goal', `${goal} кКал`)
    }
})