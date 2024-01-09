export function getStrCurDate(date = new Date) {
    return (
        date
    ).toLocaleDateString('ru', {
        day:'numeric', month:'numeric', year:'numeric'
    })
}

export function sumCalories(products) {
    return products.map(product=>{
            // перевести в калории
            if(product.measure.toLowerCase() === 'ккал.') return Number(product.calories*1000)
            else return Number(product.calories)
        })
        // посчитать, вернуть число
        .reduce((count, curVal) => count+curVal)
}