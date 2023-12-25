import DB from './DB/DB.js'


export default class Game {
    static start() {
        // считать/проверить значения (режим настроек)
        const range = Values.getRange()
        if (!range) return;

        const {min, max} = range
        DB.setMax(max)
        DB.setMin(min)
        DB.setNum(Values.guessNum(min, max))

        // интерфейс в режим игры
        ChangeInterface.startGame()
    }
    static checkValue() {
        const userValue = Number(document.getElementById("userNum").value)
        ChangeInterface.checkAnswer(userValue)
    }
}

class Values {
    static _edges = {
        MAX: 1,
        MIN: 0,
    }

    static getRange() {
        const max = this._getEdge(this._edges.MAX)
        const min = this._getEdge(this._edges.MIN)

        return this._validateRange(min, max)
    }

    static guessNum(min, max) {
        return Math.floor(Math.random()*max) + min
    }

    static _getEdge(type) {
        const edge = document.getElementById(type ? 'highValue':'lowValue').value
        if(edge === '' || edge === '-' || edge === '--') {
            alert("Некорректен максимум!");
            return null;
        }
        return Number(edge)
    }
    static _validateRange(min, max) {
        if(min >= max) {
            this.alert("Минимум должен быть меньше максимума!");
            return false;
        }
        return {min, max};
    }
}

class ChangeInterface {
    static _prompts = {
        HIGHER:'Больше',
        LOWER: 'Меньше',
    }

    static startGame() {
        document.getElementById('highValue').disabled = true
        document.getElementById('lowValue').disabled  = true
        // показать всё, кроме подсказки
        Array.from(document.querySelectorAll('.hide'))
             .forEach(elem => (elem.id!='parity') && elem.classList.remove('hide'))
        this._toggle('',0,false)
    }

    static checkAnswer(userValue) {
        if(userValue < DB.getMin() || DB.getMax() < userValue) {
            alert("Указанное число за пределами диапазона!!")
            return;
        }
        const NUM = DB.getNum()

        const curAtempts = DB.getAttempts() + 1
        DB.setAttempts( curAtempts ) // обновить кол-во попыток
        
        if(userValue === NUM) this._showWin(curAtempts, userValue)
        else if(userValue < NUM) this._showPrompt(curAtempts, this._prompts.HIGHER)
        else {
            this._showPrompt(curAtempts, this._prompts.LOWER)
            DB.resetDB()
        }
    }
    
    static _showPrompt(attempts, text) {
        document.getElementById('answer').textContent = text;
        if(attempts % 3 === 0) {
            document.getElementById('parity').classList.remove('hide')
            document.getElementById('strParity').textContent = DB.getNum()%2===0 ? "чётное" : "нечётное"
        }
        document.getElementById('numAttempt').textContent = attempts
    }
    static _showWin(attempts, userValue) {
        this._toggle(`Верно!\nЭто число ${userValue}`, attempts, true)
    }
    static _toggle(text, attempts, isEnd = false) {
        document.getElementById('parity').classList.toggle('hide', !isEnd)

        document.getElementById('answer').innerHTML       = text
        document.getElementById('numAttempt').textContent = attempts
        
        document.getElementById('checkNumBtn').disabled = isEnd
        document.getElementById('userNum').disabled     = isEnd
        document.getElementById('highValue').disabled = !isEnd
        document.getElementById('lowValue').disabled  = !isEnd

        document.getElementById('userNum').value=''
    }
}