
let prodList
document.addEventListener('DOMContentLoaded',()=>{
    const LSgoal = localStorage.getItem('CalorieCalc_goal')
    document.getElementById('dayGoal').textContent = (!LSgoal||LSgoal=='') ? 'Укажите норму!' : LSgoal

    // получить список из localStorage
    try{
        prodList = JSON.parse(localStorage.getItem('CalorieCalc_prodList'))
    } catch {
        prodList = JSON.parse(JSON.stringify(prodListDef))
    }

    if(!prodList) {
        prodList = JSON.parse(JSON.stringify(prodListDef))
    }
    createProdList(prodList)

    // выборочное удаление записей
    setDelBtnHabdler()
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
    setDelBtnHabdler()
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
    
    const deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>'
    deleteBtn.classList.add('delBtn')
    
    const info = document.createElement('section')
    info.classList.add('product-card__container')
    info.append(name, calorie)
    
    card.append(info, deleteBtn)
    deleteBtn.addEventListener('click', delBtnHandler)
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


// очистить все записи
document.getElementById('clearAllBtn').addEventListener('click',()=>{
    if(confirm("Вы уверены, что хотите удалить ВСЕ записи?")) {
        prodList = {
            days: []
        }
        console.log(prodList)
        localStorage.setItem('CalorieCalc_prodList', JSON.stringify(prodList))
    }
})



function setDelBtnHabdler() {
    // выборочное удаление записей
    Array.from(document.getElementsByClassName('delBtn')).forEach(delBtn=>{
        delBtn.getElementsByTagName('svg')[0].style.pointerEvents = "none"

        delBtn.addEventListener('click', delBtnHandler)
    })
}

function delBtnHandler(e) {
    if(confirm("Удалить эту запись?")) 
    {
        // определяем порядок продукта в списке
        const products = Array.from(e.target.parentElement.parentElement.children)
        const curCard = e.target.parentElement
        products.reverse().forEach((card,id_product)=>{
            if(curCard == card) 
            {
                // определяем порядок дня в списке
                const days = Array.from(e.target.parentElement.parentElement.parentElement.parentElement.children)
                const curDay = curCard.parentElement.parentElement
                days.reverse().forEach((day, id_day)=>{
                    if(day == curDay) 
                    {
                        // убираем заметку из localStorage
                        let prods = prodList.days[id_day].products
                        prodList.days[id_day].products = sliceArray(prods, id_product)

                        // убираем день?
                        if(prodList.days[id_day].products.length == 0) {
                            prodList.days = sliceArray(prodList.days, id_day)
                            curDay.remove()
                        } else {
                            // удаляем заметку с зоны видимости
                            curCard.remove()
                        }
                        localStorage.setItem('CalorieCalc_prodList', JSON.stringify(prodList))
                        return;
                    }
                })
                return;
            }
        })

        
    }
}

function sliceArray(array, id_del) {
    if(id_del == 0) 
        array = array.slice(id_del+1)
    else if(id_del == array.length)
        array = array.slice(0, id_del)
    else
        array = [...array.slice(0,id_del), ...array.slice(id_del+1)]
    return array
}