import { getStrCurDate } from "../utils/utils"
import Diagram from "../Diagram/Diagram.js"
import LS from "../LS/LS.js"


export default class List {
    // сформировать список заметок за все дни
    static createProdList() {
        document.getElementById('productsList').innerHTML=''

        const prodList = LS.getProducts()
        prodList.days.forEach((day, index) => {
            // внести в список 1-й день
            if (index == 0) 
                document.getElementById('productsList')
                        .appendChild(DayNode.create(day))
            // внести в начало списка следующий день
            else 
                document.querySelector('#productsList .day')
                        .before(DayNode.create(day))
        });
    }
    // вставить заметку о новом продукте в список
    static insertProd(product) {
        const note = new NoteNode(product)

        // добавить новый день с новой заметкой?
        if(note.isNewDay) DayNode.create(...[note.node])
        // вставить новую заметку
        else List._getLastNote().before(note.node)
    }
    _getLastNote() {
        return document.querySelectorAll('.day:first-child .product-card')[0]
    }
}

class DayNode {
    constructor(dayProducts) {
        this.dayProducts  = dayProducts
    }
    _createDayListNode() {
        const day_list = document.createElement('section')
        day_list.classList.add('product-cards')
        day_list.append(...this._createProdNodes(this.dayProducts))
        return day_list
    }
    _createProdNodes(products) {
        return products.map(product=>new NoteNode(product).node).reverse()
    }

    static create({date, products}) {
        const day = document.createElement('section')
        day.classList.add('day')
        
        const h = document.createElement('h3')
        h.textContent = date
        const cards_list = new DayNode(products)._createDayListNode()

        day.append(h, cards_list)
        return day
    }
}

class NoteNode {
    constructor(product) {
        this.product  = product
        this.isNewDay = !this.isLastDay()
        this.node = this.create()
    }
    // Опрделить дату
    isLastDay()      {return this._getStrLastDay() === getStrCurDate()}
    _getStrLastDay() {return this._getLastDay().textContent}
    _getLastDay()    {return document.querySelectorAll('.day h3')[0]}
    // Сформировать DOM-элемент
    create() {
        const info     = this._createInfoNode()
        const controls = this._createControlsNode()

        const card = document.createElement('section')
        card.classList.add('product-card')
        card.append(info, controls)

        // Слушатель на кнопку
        card.querySelector('delBtn').addEventListener('click', (e) => {
            DelNote.delContentListen(e.target)
            DelNote.handler(e)
        })
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
        // получить DOM-элемент блока заметки
        this.curCard    = e.target.parentElement
        this.id_product = this._getProductId()
        // получить DOM-элемент блока списка заметок дня
        this.curDay = this.curCard.parentElement.parentElement
        this.id_day = this._getProdDayId()
    }
    _getProductId() {
        const products = Array.from(document.querySelectorAll('#productsList .product-card'))
        return products.reverse().filter((card)=>(this.curCard == card))[0]
    }
    _getProdDayId() {
        const days = Array.from(document.querySelectorAll('#productsList .day'))
        return days.reverse().filter((day)=>(day == this.curDay))[0]
    }

    // не ловить события от элементов внутри кнопки
    static delContentListen(delBtn) {
        delBtn.getElementsByTagName('svg')[0].style.pointerEvents = "none"
    }
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
        LS.setProd(prodList)
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