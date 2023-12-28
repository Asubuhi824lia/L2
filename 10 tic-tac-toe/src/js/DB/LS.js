export default class LS {
    static datatypes = {
        PLAYER: 'player',
        ISEND:  'isEnd',
        STEP:   'step',
        GRID:   'grid',
    }

    static getPlayer()  {return this._get(this.datatypes.PLAYER)}
    static getIsEnd()   {return this._get(this.datatypes.ISEND)}
    static getGrid()    {return this._get(this.datatypes.GRID)?.data}
    static _get(type) {
        return JSON.parse(localStorage.getItem(`TicTacToe_${type}`))
    }

    static setPlayer(data)  {this._set(data, this.datatypes.PLAYER)}
    static setIsEnd(data)   {this._set(data, this.datatypes.ISEND)}
    static setGrid(data)    {this._set(JSON.stringify({data}), this.datatypes.GRID)}
    static _set(data, type) {
        localStorage.setItem(`TicTacToe_${type}`,data)
    }
}