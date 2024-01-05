import Animate from "./Animate.js";


export default class Paint {
    static types = {
        SELECT: 'selected',
        PLACED: 'placed',
        DEFINE: 'definable',
    }

    static async swap(cur, next, timeout) {
        // сформировать
        const promise = createTimeoutPromise(
            () => document.getElementById('showArea').insertBefore(
                document.querySelectorAll('.number')[next],
                document.querySelectorAll('.number')[cur],
            ), 
            timeout,
        )

        // выполнить
        await Animate.checkIsPause(promise)() 
    }

    static async paintNumb(index, timeout) {
        // сформировать
        const promise = createTimeoutPromise(
            () => Paint._paintColumn(index, this.types.SELECT, true)
        , timeout)

        // выполнить
        await Animate.checkIsPause(promise)() 
    }
    static async paintNumbs(indexes, timeout) {
        if(!Array.isArray(indexes) && indexes.length == 2 && typeof indexes[0] === typeof indexes[1] === 'number'
            || typeof(timeout) != 'number') 
        {
            console.error("Input values aren`t valid!",
                'indexes', indexes,
                'timeout', timeout
            );
            return;
        }

        // сформировать
        const promises = indexes.map(index => 
            () => Paint._paintColumn(index, this.types.SELECT, true)
        ).map(callback => 
            createTimeoutPromise(callback, timeout)
        )

        // выполнить
        await Animate.checkIsPause(promises[0])()
        await Animate.checkIsPause(promises[1])()
    }
    // static paintAll() {}

    static async unpaintNumb(index, timeout, isAwait = true) {
        // сформировать
        const promises = [
            () => Paint._paintColumn(index, this.types.SELECT, false),
            () => Paint._paintColumn(index, this.types.DEFINE, false)
        ].map(callback => 
            createTimeoutPromise(callback, timeout)
        )

        // выполнить
        promises.forEach(async (promise) => 
            await Animate.checkIsPause(promise, isAwait)() 
        )
    }
    static unpaintNumbs(indexes, timeout) {
        if(!Array.isArray(indexes) || typeof(timeout) != 'number') 
        {
            console.error("Input values aren`t valid!",
                'indexes', indexes,
                'timeout', timeout
            );
            return;
        }

        // сформировать
        const promises = indexes.map(index => 
            () => Paint._paintColumn(index, this.types.SELECT, false)
        ).map(callback => 
            createTimeoutPromise(callback, timeout)
        )

        // выполнить
        promises.forEach(async (promise) => 
            await Animate.checkIsPause(promise)()
        )
    }

    static async paintFixedNumb(index, timeout, isAwait = true) {
        // сформировать
        const promise = createTimeoutPromise(
            () => {
                Paint.unpaintNumb(index, timeout);
                Paint._paintColumn(index, this.types.PLACED, true);
            }, 
            timeout
        )
        
        // выполнить
        await Animate.checkIsPause(promise, isAwait)() 
    }
    static async paintDefNumb(index, timeout) {
        // сформировать
        const promise = createTimeoutPromise(
            () => Paint._paintColumn(index, this.types.DEFINE, true), 
            timeout, 
            () => {if(index >= 0) Paint.paintNumbs([index-1, index], timeout)}
        )

        // выполнить
        await Animate.checkIsPause(promise)() 
    }

    static _paintColumn(index, type, isPaint) {
        // получить DOM-элемент столбца
        const elem = document.querySelectorAll('.number')[index]
        // изменить цвет наполнения
        elem.classList.toggle(`number-${type}`, isPaint)           
    }
}


function createTimeoutPromise(callback, timeout, precondition = false) {
    // Проверка значений
    if(typeof(callback) != 'function' 
        || typeof(timeout) != 'number' 
        || precondition && typeof(precondition) != 'function') 
    {
        console.error("Input values aren`t valid!",
            'callback', callback,
            'timeout', timeout,
            'precondition', precondition
        );
        return;
    }
    
    return () => new Promise(resolve => {
        setTimeout(()=>{
            if(precondition) precondition();
            resolve(callback());
        },timeout)
    })
}