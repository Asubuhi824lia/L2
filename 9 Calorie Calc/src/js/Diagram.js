import LS from "./LS/LS.js"
import { getStrCurDate, sumCalories } from "./utils/utils.js"

export default class Diagram {
    constructor() {
        this._clearDiagram()
        this.week = this._getLastWeek()
    }
    /**
     * Очистить поле для графика.
     */
    _clearDiagram() {
        document.getElementById('graphic').innerHTML='';
    }
    /**
     * Формирует гистограмму каллорий за поледние 7 дней.
     */
    static draw() {
        const diagram = new Diagram();

        diagram.week.forEach(day => {
            const col = diagram.createColumnNode(day)
            const date= diagram.createDateNode(day)
            
            const div = document.createElement('div')
            div.classList.add('col')
            div.append(col, date)
            document.getElementById('graphic').appendChild(div)
        });
    }
    /**
     * Возвращает DOM-элемент столбца, для которого вычисляется 
     * высота относительно максимума и задаётся отображение 
     * суммарного количества калорий.
     */
    createColumnNode(day) {
        const MAX  = this._getWeekMax()
        const sum = day.products ? sumCalories(day.products) : 0
        
        const col = document.createElement('section')
        col.classList.add('col__sum')
        col.innerText = `${sum}\nкал`
        col.style.height = `${( sum / MAX ) * 100}%`
        return col
    }
    /**
     * Возвращает наибольшую сумму каллорий среди 7 последних дней.
     */
    _getWeekMax() {
        let week = LS.getProducts().days.slice(-7)
        return Math.max(...week.map(day=>
            sumCalories(day.products)
        ))
    }
    /**
     * Возвращает DOM-элемент, отображающий соответствующую дату в формате 'dd.mm.yyyy'.
     */
    createDateNode(day) {
        const date = document.createElement('span')
        date.classList.add('col__date')
        date.textContent = day.date
        return date
    }
    /**
     * Возвращает массив с данными о последних 7 днях записей.
     */
    _getLastWeek() {
        let week = LS.getProducts().days.slice(-7)
        if(week.length < 7) {
            for(let i=0; i < 7 - list.days.length; i++) {
                let date = this._getPrevDate(week[0].date)
                week.unshift({date, products:null})
            }
        }
        return week
    }
    
    _getPrevDate(date) {
        const [day, month, year] = date.split('.').map(d=>Number(d))
        let prevDate = new Date([day-1, month, year].reverse())
        return getStrCurDate(prevDate)
    }
}