import { getStrCurDate } from "../utils/utils.js"
import Diagram from "../Diagram.js"
import LS from "../LS/LS.js"


export default class List {
    static prodListDef = {
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
    /**
     * Сформировать список DOM-элементов заметок за все дни.
     * @param {Array} prodList 
     */
    static createProdList(prodList = LS.getProducts() || List.prodListDef, isRewrite = true) {
        document.getElementById('productsList').innerHTML=''

        if(isRewrite) LS.setProducts(prodList)
        prodList.days.forEach((day, index) => {
            // внести в список 1-й день
            if (index == 0) 
                document.getElementById('productsList')
                        .appendChild(Day.create(day))
            // внести в начало списка следующий день
            else 
                document.querySelector('#productsList .day')
                        .before(Day.create(day))
        });
    }
    /**
     * Вставить DOM-элеиент заметки о новом продукте в список последнего 
     * зафиксированного дня либо вместе со вставкой нового дня.
     * @param {{name: String, calories: String, measure: String}} product 
     */
    static insertProd(product) {
        const note = new Note(product)

        // добавить как новый день
        if(note.isNewDay) document.getElementById("productsList").insertBefore(
            Day.create({date:getStrCurDate(), products:[note.product]}),
            List._getLastDay()
        )
        // вставить как новую заметку
        else List._getLastNoteNode().before(note.node)
    }
    static _getLastNoteNode() {
        return document.querySelectorAll('.day:first-child .product-card')[0]
    }
    static _getLastDay() {
        return document.querySelectorAll('.day')[0]
    }
    /**
     * Удалить все записи из хранилища и с интерфейса.
     */
    static clear() {
        if(confirm("Вы уверены, что хотите удалить ВСЕ записи?")) {
            prodList = {
                days: []
            }
            LS.setProducts(prodList)
            Diagram.draw()
        }
    }
    /**
     * Отфильтровать по введённому названию продукта и переформировать выдачу.
     */
    static filter() {
        const name = document.getElementById('getProdName').value
        const days = LS.getProducts().days
        const filteredProdList= {}
        
        filteredProdList.days = List.filterDays(days, name)
        List.createProdList(filteredProdList)
    }
    static _filterDays(days, name) {
        return (
            days
        ).map(day => {
            day.products = Day.filterProdsName(day.products, name)
            return day
        })
        // Не включать "пустые" дни
        .filter(day => day.products.length > 0)
    }
    /**
     * Выбрать и выполнить сортировку по каллориям.
     */
    static sort(option) {
        const type = option.target.value
        switch (type) {
            case "increase":
                Sort.sortByCalorieIncrease(); break;
            case "decrease":
                Sort.sortByCalorieDecrease(); break;
            default:
                Sort.sortByCalorieAddition(); break;
        }
    }
}

/**
 * Сортировки выдачи на основе каллорий по возрастанию, убыванию числа либо по добавлению заметки.
 */
class Sort {
    static sortByCalorieAddition() {
        const curProrList = LS.getProducts()
        List.createProdList(curProrList, false)
    }
    static sortByCalorieIncrease() {
        const curProrList   = LS.getProducts()
        const sortedProdList= {
            days: curProrList.days.map(day=>{
                day.products = day.products.sort((a,b)=>{
                    const calorA = (a.measure.toLowerCase() === 'ккал.') ? 1000*Number(a.calories) : Number(a.calories)
                    const calorB = (b.measure.toLowerCase() === 'ккал.') ? 1000*Number(b.calories) : Number(b.calories)
                    if(calorA < calorB) return 1
                    else return -1
                })
                return day
            })
        }
        List.createProdList(sortedProdList, false)
    }
    static sortByCalorieDecrease() {
        const curProrList   = LS.getProducts()
        const sortedProdList  = {
            days: curProrList.days.map(day=>{
                day.products = day.products.sort((a,b)=>{
                    const calorA = (a.measure.toLowerCase() === 'ккал.') ? 1000*Number(a.calories) : Number(a.calories)
                    const calorB = (b.measure.toLowerCase() === 'ккал.') ? 1000*Number(b.calories) : Number(b.calories)
                    if(calorA < calorB) return -1
                    else return 1
                })
                return day
            })
        }
        List.createProdList(sortedProdList, false)
    }
}

class Day {
    constructor(dayProducts) {
        this.dayProducts  = dayProducts
    }
    /**
     * Возвращает DOM-элемент, заполненный списком из DOM-элементов заметок, 
     * относящихся к текущему дню.
     */
    createDayListNode() {
        const day_list = document.createElement('section')
        day_list.classList.add('product-cards')
        day_list.append(...this._createProdNodes(this.dayProducts))
        return day_list
    }
    _createProdNodes(products) {
        return products.map(product=>new Note(product).node).reverse()
    }
    /**
     * Возвращает DOM-элемент дня со списком заметок и датой.
     * @param {{date: String, products: Array}} DayList
     * @returns 
     */
    static create({date, products}) {
        const day = document.createElement('section')
        day.classList.add('day')
        
        const h = document.createElement('h3')
        h.textContent = date
        const cards_list = new Day(products).createDayListNode()

        day.append(h, cards_list)
        return day
    }
    /**
     * Возвращает список отфильтрованных по имени продуктов дня.
     * @param {Array} products 
     * @param {String} name 
     * @returns 
     */
    static filterProdsName(products, name) { 
        return products.filter(product => 
            product.name.toLowerCase().includes(name.toLowerCase())
        ) 
    }
}

class Note {
    constructor(product) {
        this.product  = product
        this.isNewDay = !this.isLastDay()
        this.node = this.create()
        DelNote.delContentListen(this.node)  
    }
    /**
     * Возвращает true - если последний день в списке и текущий день соответствуют, иначе - false.
     */
    isLastDay()      {return this._getStrLastDay() === getStrCurDate()}
    _getStrLastDay() {
        const lastDay = this._getLastDayDate()
        return lastDay ? lastDay.textContent : null;
    }
    _getLastDayDate()    {return document.querySelectorAll('.day h3')[0]}
    
    /**
     * Возвращает сформированный DOM-элемент на основе данных объекта заметки.
     */
    create() {
        const info     = this._createInfoNode()
        const controls = this._createControlsNode()
        
        const card = document.createElement('section')
        card.classList.add('product-card')
        card.append(info, controls)
        
        // Слушатель на кнопку
        card.querySelector('.delBtn').addEventListener('click', DelNote.handler)
        return card
    }
    _createInfoNode() {
        const name = document.createElement('span')
        name.classList.add('product-name')
        name.textContent = this.product.name
        
        const calorie = document.createElement('span')
        calorie.classList.add('product-calorie')
        calorie.textContent = `${this.product.calories} ${this.product.measure}`

        const info = document.createElement('section')
        info.classList.add('product-card__container')
        info.append(name, calorie)
        return info
    }
    _createControlsNode() {
        const deleteBtn = document.createElement('button')
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>'
        deleteBtn.classList.add('delBtn')

        const controls = document.createElement('div')
        controls.appendChild(deleteBtn)
        return controls
    }
}

class DelNote {
    constructor(e) {
        this.curCard    = e.target.parentElement.parentElement
        this.curDay = this.curCard.parentElement.parentElement
        this.id_day = this._getProdDayId()
        this.id_product = this._getProductId()
    }
    _getProductId() {
        const products = Array.from(this.curDay.querySelectorAll('.product-card'))
        return products.reverse().map((card, id)=>{
            if(this.curCard == card) return id;
            else return null;
        }).filter(id => (id!=null))[0]
    }
    _getProdDayId() {
        const days = Array.from(document.querySelectorAll('#productsList .day'))
        return days.reverse().map((day, id)=>{
            if(this.curDay == day) return id;
            else return null;
        }).filter(id => (id!=null))[0]
    }

    /**
     * Убрать отслеживание событий мыши от элементов внутри кнопки.
     * @param {HTMLButtonElement} delBtn 
     */
    static delContentListen(delBtn) {
        delBtn.getElementsByTagName('svg')[0].style.pointerEvents = "none"
    }
    /**
     * Удаляет заметку и из списка, и из LS. Включает перерасчёт гистограммы.
     * @param {Event} e 
     */
    static handler(e) {
        const delNote = new DelNote(e)
        delNote._delFromLS()
        Diagram.draw()
    }

    _delFromLS() {
        let prodList = LS.getProducts()
        // удалить из списка
        let prods = prodList.days[this.id_day].products
        prodList.days[this.id_day].products = this._sliceArray(prods, this.id_product)
        // удалить визуально
        switch (prodList.days[this.id_day].products.length) {
            case 0:
                // Заметка единственная за сутки? - убираем день
                prodList.days = this._sliceArray(prodList.days, this.id_day)
                this.curDay.remove()
                break;
            default:
                this.curCard.remove()
                break;
        }
        // удалить из хранилища
        LS.setProducts(prodList)
    }
    _sliceArray(array, id_del) {
        switch (id_del) {
            case 0:
                array = array.slice(id_del+1); 
                break;
            case array.length:
                array = array.slice(0, id_del); 
                break;
            default:
                array = [...array.slice(0,id_del), ...array.slice(id_del+1)]; 
                break;
        }
        return array;
    }
}