import Animate from './effects/Animate.js';
import Paint from './effects/Paint.js';


export default class Sort {

    static async BubbleSort(values) {
        for (let i = 0; i + 1 < values.length; ++i) {
            for (let j = 0; j + 1 < values.length - i; ++j) {
                // выделить сравниваемые "цифры" (столбцы)
                await Paint.paintNumbs([j, j+1], timeout)
                if (values[j + 1] < values[j]) {
                    //поменять местами
                    await Paint.swap(j, j+1, timeout);
                    [values[j], values[j + 1]] = [values[j + 1], values[j]]
                }
                // снять выделение
                await Paint.unpaintNumbs([j, j+1], timeout)
                     
                // "зафиксировать" найденное наибольшее
                if(j+1 === values.length - i - 1)
                    await Paint.paintFixedNumb(j+1, timeout)
            }
        }
        await Paint.paintFixedNumb(0, timeout)
        return values;
    }

    static async ShakerSort(values) {
        let left = 0;
        let right = values.length - 1;
        while (left <= right) {
            // Справа-налево
            for (let i = right; i > left; --i) {
                // выделить нужные "цифры" (столбцы)
                await Paint.paintNumbs([i, i-1], timeout)
                           
                if (values[i - 1] > values[i]) {
                    await Paint.swap(i-1, i, timeout);
                    [values[i - 1], values[i]] = [values[i], values[i - 1]]
                }
                await Paint.unpaintNumbs([i-1, i], timeout)
                if(i === left + 1) await Paint.paintFixedNumb(i-1, timeout)
            }
            ++left;
            
            // Слева-направо
            for (let i = left; i < right; ++i) {
                // выделить нужные "цифры" (столбцы)
                await Paint.paintNumbs([i, i+1], timeout)
                if (values[i] > values[i + 1]) {
                    await Paint.swap(i, i+1, timeout);
                    [values[i], values[i + 1]] = [values[i + 1], values[i]]
                }
                await Paint.unpaintNumbs([i, i+1], timeout)
                if(i === right - 1) await Paint.paintFixedNumb(i+1, timeout)
            }
            --right;
        }
    
        await Paint.paintFixedNumb(Math.floor(values.length/2), timeout, false) //окрасить оставшийся элемент
        return values
    }
    
    static async CombSort(values) {
        const factor = 1.247; // Фактор уменьшения
        let step = values.length - 1;
        while (step >= 1) {
            for (let i = 0; i + step < values.length; ++i) {
                await Paint.paintNumbs([i, i + step], timeout)
    
                if (values[i] > values[i + step]) {
                    // переставить
                    Paint.swap(i + step, i, timeout, false)
                    await Paint.swap(i, i + step, timeout)
                    
                    ;[values[i], values[i + step]] = [values[i + step], values[i]]
                }
                await Paint.unpaintNumbs([i, i + step], timeout)
            }
            step = Math.floor(step / factor);
        }
    }
    
    static async InsertSort(values) {
        for (let i = 1; i < values.length; ++i) {
            const x = values[i]
            let j = i
            // находим место столбцу начиная со 2-го
            await Paint.paintNumb(i, timeout)
            while (j > 0 && values[j - 1] > x) {
                // выделить столбец-претендент
                await Paint.paintNumb(j - 1, timeout)
                // Не подходит? Снять выделение
                if(j - 1 !== 0 && !(values[j - 2] < x && values[j - 1] >= x))
                    Paint.unpaintNumb(j - 1, timeout, false)

                values[j] = values[j - 1]
                j--
            }
            // Переставить?
            if(i != j) {
                values[j] = x
                await Paint.swap(j, i, timeout)
            }
            // снять выделение
            await Paint.unpaintNumbs([j, j+1], timeout)
        }
    }
    
    static async SelectSort(values) {
        for (let i = 0; i < values.length; ++i) {
            
            // отобразить перебор элементов от i до конца
            let min = i
            await Paint.paintDefNumb(min, timeout)
            for(let pos = i+1; pos < values.length; ++pos) {
                await Paint.paintNumb(pos, timeout)
                
                // Найдено меньшее значение? 
                if(values[min] > values[pos]) {
                    // снять выделение с прошлого минимума
                    if(min != i) //не затирать 1-й минимум
                        Paint.unpaintNumb(min, timeout, false)

                    min = pos
                    // оставляем выделенным
                } else {
                    // снять выделение с числа
                    Paint.unpaintNumb(pos, timeout, false)
                }
            }
            
            // поменять местами
            await Paint.paintFixedNumb(min, timeout, false)
            if(min > i) {
                Paint.swap(min, i, timeout, false)
                await Paint.swap(i, min, timeout)
            }
            await Paint.unpaintNumbs([i, min], timeout);
            [values[i], values[min]] = [values[min], values[i]]
        }
    }
}