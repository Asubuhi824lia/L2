/**
 * Вернуть строку вормата "dd.mm.yyyy"
 * @param {Date} date
 */
export function getStrCurDate(date = new Date) {
    return (
        date
    ).toLocaleDateString('ru', {
        day:'numeric', month:'numeric', year:'numeric'
    })
}
/**
 * Возвращает сумму массива каллорий.
 * @param {Array} products
 */
export function sumCalories(products) {
    return products.map(product=>{
            // перевести в калории
            if(product.measure.toLowerCase() === 'ккал.') return Number(product.calories*1000)
            else return Number(product.calories)
        })
        // посчитать, вернуть число
        .reduce((count, curVal) => count+curVal)
}