import DayGoal from '../DayGoal.js'
import Diagram from '../Diagram.js'
import LS from '../LS/LS.js'
import { getStrCurDate } from '../utils/utils.js'
import List from './List.js'


export default class Form {
    constructor() {
        this.name = document.getElementById('getProduct').value.trim()
        document.getElementById('getProduct').value =''
        
        this.calories = document.getElementById('getCalories').value.trim()
        document.getElementById('getCalories').value=''
        
        this.measure = document.getElementById('measure').value
    }
    
    static addProduct() {
        const form = new Form()
        form.validate()
    }
    /**
     * Убрать со всей форм срабатывание по клику на submit.
     */
    static preventDefault() {
        Array.from(document.getElementsByTagName('form')).forEach(form=>{
            form.addEventListener('click', e=>e.preventDefault())
        })
    }

    validate() {
        if(this.name=='' || this.calories=='') return false;
        
        const product = {name: this.name, calories: this.calories, measure: this.measure}
        const curDate = getStrCurDate()

        // сверяем текущую дату с последним днём
        let prodList = LS.getProducts()
        if(prodList.days.at(-1).date === curDate) {
            prodList.days.at(-1).products.push(product)
        } else {
            prodList.days.push({date:curDate, products:[product]})
        }

        LS.setProducts(prodList)
        List.insertProd(product)

        DayGoal.checkDayLimit()
        Diagram.draw()
    }
}