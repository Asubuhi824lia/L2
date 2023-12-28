export default class GridArea {
    static toggleArea(isDisable) {
        Array.from(document.getElementsByClassName("cell"))
            .forEach(cell => cell.disabled = isDisable)
    }

    static getGrid() {
        const area = Array.from(document.getElementsByClassName("cell")).map(cell=>this.checkPlayer(cell))
        const row1 = area.slice(0,3)
        const row2 = area.slice(3,6)
        const row3 = area.slice(6)
        return [row1, row2, row3];
    }
    static checkPlayer(elem) {
        if(elem.querySelector('.zero')) return 'zero'
        if(elem.querySelector('.cross')) return 'cross'
        return null
    }

    static isCrossed(role) {
        const area = this.getGrid()
        return this._diagonal(role, area) || this._horisontal(role, area) || this._vertical(role, area)
    }

    static _horisontal(role, [row1,row2,row3]) {
        // 3 по горизонтали?
        if(row1.filter(cell=>cell===role).length==3) return true;
        if(row2.filter(cell=>cell===role).length==3) return true;
        if(row3.filter(cell=>cell===role).length==3) return true;
        return false;
    }
    static _vertical(role, [row1,row2,row3]) {
        // 3 по вертикали?
        if(this._isStringsEquel(role, row1[0],row2[0],row3[0])) return true;
        if(this._isStringsEquel(role, row1[1],row2[1],row3[1])) return true;
        if(this._isStringsEquel(role, row1[2],row2[2],row3[2])) return true;
        return false;
    }
    static _diagonal(role, [row1,row2,row3]) {
        // 3 по диагонали?
        if(this._isStringsEquel(role, row1[0],row2[1],row3[2])) return true;
        if(this._isStringsEquel(role, row1[2],row2[1],row3[0])) return true;
        return false;
    }
    static _isStringsEquel(role, ...strings) {
        for (let i = 1; i < strings.length; i++) {
            if (strings[i-1] !== strings[i] || strings[i] !== role)
                return false;
        }
        return true;
    }
}