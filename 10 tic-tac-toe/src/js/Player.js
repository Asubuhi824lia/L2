import GridArea from './GridArea.js'

class Player {
    role = 'player';

    setMark(e) {console.log("Player`s setMark!", e)} //Заглушка
    
    handleResult() {
        if(this._checkIsWin()) {this._setWin(); return true};
        if(this._checkIsDraw()){this._setDraw();return true};
        return false;
    }

    // Победа?
    _checkIsWin() {
        return GridArea.isCrossed(this.role)
    }
    _setWin() {
        document.getElementById('playerStatus').textContent='Winner!!'
        setTimeout(()=>{alert("С Победой!")}, 500)

        GridArea.toggleArea(true)
    }

    // Ничья?
    _checkIsDraw() {
        return !(
            GridArea.getGrid()   
                .map(row => row.filter(cell => cell==null).length > 0)  
                .includes(true)
        );  // Все ли ячейки заполнены?
    }
    _setDraw() {
        document.getElementById('playerStatus').textContent='Ничья'
        document.getElementById('player').textContent=''
        setTimeout(()=>{alert("Ничья!!")}, 500)
    }
}

export class Cross extends Player {
    role = 'cross';

    setMark(e) {
        if(e.target) this._setCross(e.target)
        else this._setCross(e)
    }
    _setCross(parent) {
        const template = document.getElementById("crossTmp").content.cloneNode(true)
        parent.appendChild(template)
        parent.querySelector('.cross').style.pointerEvents = "none"
    }
}

export class Zero extends Player {
    role = 'zero';

    setMark(e) {
        if(e.target) this._setZero(e.target)
        else this._setZero(e)
    }
    _setZero(parent) {
        const template = document.getElementById("zeroTmp").content.cloneNode(true)
        parent.appendChild(template)
        parent.querySelector('.zero').style.pointerEvents = "none"
    }
}