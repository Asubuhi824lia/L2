
let prodList
document.addEventListener('DOMContentLoaded',()=>{
    const LSgoal = localStorage.getItem('CalorieCalc_goal')
    document.getElementById('dayGoal').textContent = (!LSgoal||LSgoal=='') ? 'Укажите норму!' : LSgoal

    // получить список из localStorage
    prodList = JSON.parse(localStorage.getItem('CalorieCalc_prodList'))
    if(!prodList) {
        prodList = JSON.parse(JSON.stringify(prodListDef))
    }
    createProdList(prodList)
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
})


function getCurDate() {return (new Date).toLocaleDateString('ru', {day:'numeric', month:'numeric', year:'numeric'})}

function insertProd(product) {
    const lastDate = document.querySelectorAll('.day h3')[0].textContent

    // установить соответствие даты
    if(lastDate === getCurDate()) {
        document.querySelectorAll('.day:first-child .product-card')[0]
            .before(createProdNode(product))
    } else {
        document.querySelectorAll('.day')[0]
            .before(createDayNode({date:getCurDate(), products:[product]}))
    }
}

function createProdNode(product) {
    const card = document.createElement('section')
    card.classList.add('product-card')

    const name = document.createElement('span')
    name.classList.add('product-name')
    name.textContent = product.name
    
    const calorie = document.createElement('span')
    calorie.classList.add('product-calorie')
    calorie.textContent = `${product.calories} ${product.measure}`

    card.append(name, calorie)
    return card
}
function createProdNodes(products) {
    return products.map(product=>createProdNode(product)).reverse()
}

function createDayNode({date, products}) {
    const day = document.createElement('section')
    day.classList.add('day')
    
    const h = document.createElement('h3')
    h.textContent = date
    
    const cards_list = document.createElement('section')
    cards_list.classList.add('product-cards')
    cards_list.append(...createProdNodes(products))
    
    day.append(h, cards_list)
    return day
}
function createProdList(prodList) {
    document.getElementById('productsList').innerHTML=''
    
    prodList.days.forEach((day, index) => {
        if(index == 0) document.getElementById('productsList').appendChild(createDayNode(day))
        else document.querySelector('#productsList .day').before(createDayNode(day))
    });
}


document.getElementById('clearAllBtn').addEventListener('click',()=>{
    if(confirm("Вы уверены, что хотите удалить ВСЕ записи?")) {
        prodList = {
            days: []
        }
        console.log(prodList)
        localStorage.setItem('CalorieCalc_prodList', JSON.stringify(prodList))
    }
})