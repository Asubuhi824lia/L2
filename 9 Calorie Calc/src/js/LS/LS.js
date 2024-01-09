export default class LS {
    static prefix = 'CalorieCalc'
    static items = {
        PRODLIST: 'prodList',
        GOAL: 'goal',
    }

    static setGoal(goal) {this._set(this.items.GOAL, `${goal} кКал`)}
    static setProducts(prodList) {this._set(this.items.PRODLIST, JSON.stringify(prodList))}
    static _set(item, data) {slocalStorage.setItem(`${LS.prefix}_${item}`, data)}

    static getGoal() {return Number(this._get(this.items.GOAL).split(' ')[0])}
    static getProducts() {return JSON.parse(this._get(this.items.PRODLIST))}
    static _get(item) {return localStorage.getItem(`${LS.prefix}_${item}`)}
}