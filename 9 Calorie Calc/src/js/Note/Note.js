import LS from "../LS/LS.js"

export class Note {
    // Удалить выбранную заметку
    setDelBtnHandler(productsList) {
        Array.from(document.getElementsByClassName('delBtn')).forEach(delBtn=>{
            delNote.delContentListen(delBtn)
            delBtn.addEventListener('click', (e) => delNote.handler(e, productsList))
        })
    }
}

class delNote {
    // не ловить события от элементов внутри кнопки
    static delContentListen(delBtn) {
        delBtn.getElementsByTagName('svg')[0].style.pointerEvents = "none"
    }
    static handler(e, productsList) {
        const {curCard, id_product} = delNote._getProductId(e)
        const {curDay,  id_day} = delNote._getProdDayId(curCard)
        delNote._delFromLS(curCard, curDay, productsList, id_product, id_day)
        drawDiagram()
    }

    static _getProductId(e) {
        const products = Array.from(document.querySelectorAll('#productsList .product-card'))
        // получить DOM-элемент блока заметки
        const curCard = e.target.parentElement
        return {curCard, id_product: products.reverse().filter((card)=>(curCard == card))[0]}
    }
    static _getProdDayId(curCard) {
        const days = Array.from(document.querySelectorAll('#productsList .day'))
        // получить DOM-элемент блока заметок за день
        const curDay = curCard.parentElement.parentElement
        return {curDay, id_day: days.reverse().filter((day)=>(day == curDay))[0]}
    }

    static _delFromLS(curCard, curDay, productsList, id_product, id_day) {
        // удалить из списка
        let prods = productsList.days[id_day].products
        productsList.days[id_day].products = delNote._sliceArray(prods, id_product)
        // удалить визуально
        switch (productsList.days[id_day].products.length) {
            case 0:
                // Заметка единственная за сутки? - убираем день
                productsList.days = delNote._sliceArray(productsList.days, id_day)
                curDay.remove()
                break;
            default:
                curCard.remove()
                break;
        }
        // удалить из хранилища
        LS.setProd(productsList)
    }
    static _sliceArray(array, id_del) {
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