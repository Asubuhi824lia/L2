export default class LS {
    static prefix = 'CalorieCalc'
    static items = {
        PRODLIST: 'prodList',
        GOAL: 'goal',
    }
    static goalUnit = 'кКал'

    static setGoal(goal) {this._set(this.items.GOAL, `${goal} ${goalEnd}`)}
    static setProducts(prodList) {this._set(this.items.PRODLIST, JSON.stringify(prodList))}
    static _set(item, data) {slocalStorage.setItem(`${LS.prefix}_${item}`, data)}

    static getGoal() {
        const goal = this._get(this.items.GOAL)
        return goal===null ? null : Number(goal.split(' ')[0])
    }
    static getProducts() {return JSON.parse(this._get(this.items.PRODLIST))}
    static _get(item) {return localStorage.getItem(`${LS.prefix}_${item}`)}
}