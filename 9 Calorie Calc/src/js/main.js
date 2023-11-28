import {createProdList, insertProd,
    getCurDate, 
    setDelBtnHandler} from './manageProdList.js'


const prodListDef = {
    days: [
        {
            date:'26.11.2023',
            products: [
                {name: 'Банан', calories: '107', measure:'кКал.'},
                {name: 'Леденцовая конфета', calories: '50', measure:'кал.'}
            ]
        }
    ]
}


document.addEventListener('DOMContentLoaded',()=>{
    const LSgoal = localStorage.getItem('CalorieCalc_goal')
    document.getElementById('dayGoal').textContent = (!LSgoal||LSgoal=='') ? 'Укажите норму!' : LSgoal

    // получить список из localStorage
    try{
        globalThis.prodList = JSON.parse(localStorage.getItem('CalorieCalc_prodList'))
    } catch {
        globalThis.prodList = JSON.parse(JSON.stringify(prodListDef))
    }

    if(!prodList) {
        prodList = JSON.parse(JSON.stringify(prodListDef))
    }
    createProdList(prodList)

    // выборочное удаление записей
    setDelBtnHandler()
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

// Очистить все записи
document.getElementById('clearAllBtn').addEventListener('click',()=>{
    if(confirm("Вы уверены, что хотите удалить ВСЕ записи?")) {
        prodList = {
            days: []
        }
        console.log(prodList)
        localStorage.setItem('CalorieCalc_prodList', JSON.stringify(prodList))
    }
})

// Добавить продукт
document.getElementById('addProdBtn').addEventListener('click',()=>{
    const name = document.getElementById('getProduct').value.trim()
    document.getElementById('getProduct').value =''
    const calories = document.getElementById('getCalories').value.trim()
    document.getElementById('getCalories').value=''
    const measure = document.getElementById('measure').value

    if(name=='' || calories=='') return;

    const product = {name, calories, measure}
    const curDate = getCurDate()

    // сверяем текущую дату с последним днём
    if(prodList.days.at(-1).date === curDate) {
        prodList.days.at(-1).products.push(product)
    } else {
        prodList.days.push({date:curDate, products:[product]})
    }

    localStorage.setItem('CalorieCalc_prodList', JSON.stringify(prodList))
    insertProd(product)
    setDelBtnHandler()
})