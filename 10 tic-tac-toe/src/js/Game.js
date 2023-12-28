import {Zero,Cross} from './Player.js'
import LS from './DB/LS.js'
import GridArea from './GridArea.js'

export default class Game {
    static players = {
        ZERO:  false,
        CROSS: true,
    }

    static isGridEmpty() {
        return LS.getGrid() ? Game._isAreaEmpty(LS.getGrid()) : false;
    }
    static continueGame() {
        Game._setArea()
        this._showPlayer(LS.getPlayer())   
    }
    static startNewGame() {
        const isend = LS.getIsEnd()
        if(!isend && isend!=null && !Game.isGridEmpty() 
                  && !confirm("Стереть текущий прогресс?")) return;

        GridArea.toggleArea(false)
        Game._resetLS()
        Game._setArea() //только после очистки LS
        Game._showPlayer(Game.players.CROSS)
    }

    static makeStep(e) {
        if(!e.target || !(e.target.innerHTML==='')) return;
        
        let player= LS.getPlayer()
        const curPlayer = player ? new Cross() : new Zero()
        // нанести крестик / нолик
        curPlayer.setMark(e)
        LS.setGrid(GridArea.getGrid())
        // Проверить результат && обновить данные LS
        if(curPlayer.handleResult()) {
            LS.setIsEnd(true);
            LS.setGrid(Game._getEmptyGrid())
            return;
        }
        
        // сменить игрока
        LS.setPlayer(!player)
        Game._showPlayer(!player)
    }

    static _resetLS() {
        LS.setPlayer(this.players.CROSS)
        LS.setIsEnd(false)
        LS.setGrid(this._getEmptyGrid())
    }

    static _getEmptyGrid(){return Array(3).fill(Array(3).fill(null));}
    static _isAreaEmpty(grid) {
        return (
            grid.reduce((rows, row) => [...rows,...row])
                .filter(cell => cell != null).length === 0
        )
    }

    static _setArea() {
        let grid = LS.getGrid()
        grid = grid.reduce((rows, row) => [...rows,...row])

        const areaDOM = document.getElementById("gameArea")
        Array.from(areaDOM.children).forEach((cell, ind) => {
            cell.innerHTML = '';

            if(grid[ind] == null) return;

            const player = this.players[grid[ind].toUpperCase()] ? new Cross() : new Zero()
            player.setMark(cell)
        });
    }

    static _showPlayer(player) {
        document.getElementById('playerStatus').textContent='Игрок'
        const template = document.getElementById(player ? "crossTmp" : "zeroTmp").content.cloneNode(true)
        document.getElementById('player').innerHTML = ''
        document.getElementById('player').appendChild(template)
    }
}