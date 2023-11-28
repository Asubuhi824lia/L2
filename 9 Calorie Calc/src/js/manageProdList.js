
export function getStrDate(date = new Date) {return (date).toLocaleDateString('ru', {day:'numeric', month:'numeric', year:'numeric'})}


/* Создание заметки / списка заметок */

export function insertProd(product) {
    const lastDate = document.querySelectorAll('.day h3')[0].textContent

    // установить соответствие даты
    if(lastDate === getStrDate()) {
        document.querySelectorAll('.day:first-child .product-card')[0]
            .before(createProdNode(product))
    } else {
        document.querySelectorAll('.day')[0]
            .before(createDayNode({date:getStrDate(), products:[product]}))
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

export function createProdList(productsList) {
    document.getElementById('productsList').innerHTML=''
    
    productsList.days.forEach((day, index) => {
        if(index == 0) document.getElementById('productsList').appendChild(createDayNode(day))
        else document.querySelector('#productsList .day').before(createDayNode(day))
    });
}


/* Удаление заметки */

export function setDelBtnHandler(productsList) {
    // выборочное удаление записей
    Array.from(document.getElementsByClassName('delBtn')).forEach(delBtn=>{
        delBtn.getElementsByTagName('svg')[0].style.pointerEvents = "none"

        delBtn.addEventListener('click', (e) => delBtnHandler(e, productsList))
    })
}
function delBtnHandler(e, productsList) {
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
                        let prods = productsList.days[id_day].products
                        productsList.days[id_day].products = sliceArray(prods, id_product)

                        // убираем день?
                        if(productsList.days[id_day].products.length == 0) {
                            productsList.days = sliceArray(productsList.days, id_day)
                            curDay.remove()
                        } else {
                            // удаляем заметку с зоны видимости
                            curCard.remove()
                        }
                        localStorage.setItem('CalorieCalc_prodList', JSON.stringify(productsList))
                        drawDiagram()
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


/* Рисование диаграммы потреблённых калорий */

export function drawDiagram() {
    document.getElementById('graphic')

    // Выделить 7 дней
    let week = prodList.days.slice(-7)
    const MAX = Math.max(...week.map(day=>sumCalories(day.products)))
    if(week.length < 7) {
        for(let i=0; i < 7-prodList.days.length; i++) {
            let date = getPrevDate(week[0].date)
            week.unshift({date, products:null})
        }
    }

    // Вывести диаграмму потребления (верх - по MAX, числа - под, калории - в "столбце")
    document.getElementById('graphic').innerHTML=''
    week.forEach((day=>{
        const div = document.createElement('div')
        div.classList.add('col')

        const col = document.createElement('section')
        col.classList.add('col__sum')
        const sum = day.products ? sumCalories(day.products) : 0
        col.innerText = `${sum}\nкал`
        col.style.height = `${( sum / MAX ) * 100}%`

        const date = document.createElement('span')
        date.classList.add('col__date')
        date.textContent = day.date

        div.append(col, date)
        document.getElementById('graphic').appendChild(div)
    }))

}
function getPrevDate(date) {
    const [day, month, year] = date.split('.').map(d=>Number(d))
    let prevDate = new Date([day-1, month, year].reverse())
    return getStrDate(prevDate)
}


/* Отслеживание превышения дневного лимита калорий */
export function checkDayLimit() {
    if(isDayLimit()) {
        alert("Дневной лимит калорий превышен!!")
    }
}
function isDayLimit() {
    const limit = Number(document.getElementById('dayGoal').textContent.split(' ')[0])*1000
    if(isNaN(limit)) return;

    const sum = sumCalories(prodList.days.at(-1).products)
    return sum > limit
}
function sumCalories(products) {
    return products.map(product=>{
            if(product.measure.toLowerCase() === 'ккал.') return Number(product.calories*1000)
            else return Number(product.calories)
        })
        .reduce((count, curVal) => count+curVal)
}