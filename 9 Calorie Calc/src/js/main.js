import {createProdList, insertProd,
    getStrDate, checkDayLimit,
    setDelBtnHandler, drawDiagram} from './manageProdList.js'


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
        globalThis.prodList = dubObject(prodListDef)
    }

    if(!prodList) { prodList = dubObject(prodListDef) }
    createProdList(prodList)

    // выборочное удаление записей
    setDelBtnHandler(prodList)

    // Убрать с форм срабатывание по клику submit
    Array.from(document.getElementsByTagName('form')).forEach(form=>{
        form.addEventListener('click', e=>e.preventDefault())
    })

    drawDiagram()
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
        localStorage.setItem('CalorieCalc_prodList', JSON.stringify(prodList))
        drawDiagram()
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
    const curDate = getStrDate()

    // сверяем текущую дату с последним днём
    if(prodList.days.at(-1).date === curDate) {
        prodList.days.at(-1).products.push(product)
    } else {
        prodList.days.push({date:curDate, products:[product]})
    }

    localStorage.setItem('CalorieCalc_prodList', JSON.stringify(prodList))
    insertProd(product)
    setDelBtnHandler()

    checkDayLimit()
    drawDiagram()
})


/* Фильтрация */

// Сортировка по калорийности
document.getElementById('sortType').addEventListener('change',(option)=>{
    const type = option.target.value
    console.log(option.target.value)

    if (type.toLowerCase() === "addition") {
        createProdList(prodList)
    }
    else if (type.toLowerCase() === "increase") {
        const curProrList = dubObject(prodList)
        let sortedProdList={}
        sortedProdList.days = curProrList.days.map(day=>{
            day.products = day.products.sort((a,b)=>{
                const calorA = (a.measure.toLowerCase() === 'ккал.') ? 1000*Number(a.calories) : Number(a.calories)
                const calorB = (b.measure.toLowerCase() === 'ккал.') ? 1000*Number(b.calories) : Number(b.calories)
                if(calorA < calorB) return -1
                else return 1
            })
            return day
        })
        createProdList(sortedProdList)
    }
    else if (type.toLowerCase() === "decrease") {
        const curProrList = dubObject(prodList)
        let sortedProdList={}
        sortedProdList.days = curProrList.days.map(day=>{
            day.products = day.products.sort((a,b)=>{
                const calorA = (a.measure.toLowerCase() === 'ккал.') ? 1000*Number(a.calories) : Number(a.calories)
                const calorB = (b.measure.toLowerCase() === 'ккал.') ? 1000*Number(b.calories) : Number(b.calories)
                if(calorA < calorB) return 1
                else return -1
            })
            return day
        })
        createProdList(sortedProdList)
    }
})

// Фильтрация по названию
document.getElementById('getProdNameBtn').addEventListener('click',()=>{
    const name = document.getElementById('getProdName').value

    const filteredProdList={}
    filteredProdList.days = filterDays(dubObject(prodList.days), name)
    createProdList(filteredProdList)
})

function filterProds(products, name) { return products.filter(product => product.name.toLowerCase().includes(name.toLowerCase())) }
function filterDays(days, name) {
    return days
        .map(day => {
            day.products = filterProds(day.products, name)
            return day
        })
        .filter(day => day.products.length > 0)
}
function dubObject(object) {return JSON.parse(JSON.stringify(object))}