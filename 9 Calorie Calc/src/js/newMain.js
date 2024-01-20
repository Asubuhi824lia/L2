import DayGoal from "./DayGoal.js"
import Diagram from "./Diagram.js"
import Form from "./List/Form.js"
import List from "./List/List.js"

document.addEventListener('DOMContentLoaded', ()=>{
    DayGoal.set()
    
    List.createProdList()
    Form.preventDefault()

    Diagram.draw()
})

// Изменить целевые показатели калорийности на день
document.querySelector('#editDayGoal')
        .addEventListener('click', DayGoal.askDayGoal)

// Очистить все записи
document.getElementById('clearAllBtn')
        .addEventListener('click', List.clear)

// Добавить продукт
document.getElementById('addProdBtn')
        .addEventListener('click', Form.addProduct)

// Сортировка по калорийности
document.getElementById('sortType')
        .addEventListener('change', List.sort)

// Фильтрация по названию
document.getElementById('getProdNameBtn')
        .addEventListener('click', List.filter)