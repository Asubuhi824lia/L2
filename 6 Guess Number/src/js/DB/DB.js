export default class DB {
    static _types = {
        MAX: 'max',
        MIN: 'min',
        ATTEMPTS: 'attempts',
        NUMBER: 'number'
    }

    static getMin() {return this._get(this._types.MIN)}
    static getMax() {return this._get(this._types.MAX)}
    static getAttempts() {return this._get(this._types.ATTEMPTS)}
    static getNum() {return this._get(this._types.NUMBER)}
    
    static _get(datatype) {
        return JSON.parse(localStorage.getItem(`GuessNumber_${datatype}`))
    }

    static setMin(data) {return this._set(data, this._types.MIN)}
    static setMax(data) {return this._set(data, this._types.MAX)}
    static setAttempts(data) {return this._set(data, this._types.ATTEMPTS)}
    static setNum(data) {return this._set(data, this._types.NUMBER)}
    
    static _set(data, datatype) {
        localStorage.setItem(`GuessNumber_${datatype}`, JSON.stringify(data))
    }

    static delNum() {this._del(this._types.NUMBER)}
    static _del(datatype) {localStorage.removeItem(`GuessNumber_${datatype}`)}

    static resetDB() {
        this.setAttempts(0)
        this.delNum()
    }
}