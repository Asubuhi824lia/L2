import Datetime from './utils/datetime.js'

/* DB-side */
export class TaskList {
    tasks = Array()
    //по умолчанию - брать данные из LocalStorage
    constructor(tasks = this.get().tasks) {
        tasks.forEach(task => {
            this.tasks.push(new Task(task))
        });
    }

    set() {localStorage.setItem('TaskManager_taskList', JSON.stringify(this))}
    get() {return JSON.parse(localStorage.getItem('TaskManager_taskList'))}

    setTaskList() {
        //to LocalStorage
        this.set()
        //to interface
        new CardNodesList(taskList).createTaskList()
    }

    addTask(task) {
        //to var
        this.tasks.push(task)
        //to interface
        new CardNodesList(this).insertTask(task)
        //to LocalStorage
        this.set()
    }
    delTask(id) {
        //from var
        this.tasks.splice(id,1) 
        //from LocalStorage
        this.set()
    }
    changeTaskField(id, field, value) {
        //to var
        this.tasks[id].changeField(field, value)
        //to LocalStorage
        this.set()
    }
}
class Task {
    constructor({date,name,description,deadline,isDone}) {
        this.date = date;
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.isDone = isDone;
    }
    changeField(field, value) {this[field] = value;}
}

export class CardNodesList {
    constructor(taskList) {
        this.taskList = taskList ? new TaskList(taskList.tasks) : new TaskList()
    }

    insertTask(task) {
        const node = new CardNode(task)
        document.querySelectorAll('.task-card')[0].before(node.createCardNode())
    }
    createTaskList() {
        const cards_list = document.createElement('section')
        cards_list.classList.add('task-cards')
        cards_list.append(...this._createCardNodes())
        
        document.getElementById('tasksList').innerHTML=''
        document.getElementById('tasksList').appendChild(cards_list)
    }

    _createCardNodes() {
        return this.taskList.tasks.map(task=>
            new CardNode(task).createCardNode(task)
        ).reverse()
    }
}
class CardNode {
    constructor(task) {
        this.task = new Task(task)
    }

    createCardNode() {
        const done = document.createElement('input')
        done.setAttribute('type', 'checkbox')
        done.classList.add('doneBtn')
        
        const card = document.createElement('section')
        card.classList.add('task-card')
        card.append(done, this._createInfoNodes(), this._createControlsNode())
        
        if(this.task.isDone) {
            card.classList.add('done')
            done.checked = true
        }
        else card.classList.remove('done')

        new CardHandlers().setBtnHandler(card)
        return card
    }

    _createInfoNodes() {
        const info = document.createElement('section')
        info.classList.add('task-card__container')

        const name = document.createElement('p')
        name.classList.add('task-name')
        name.textContent = this.task.name

        if(this.task.description !== '') {
            const description = document.createElement('p')
            description.classList.add('task-description')
            description.textContent = this.task.description
            deadline.textContent = this.task.deadline
            info.append(this._createDatesNode(this.task), name, description)
        } else {
            info.append(this._createDatesNode(this.task), name)
        }

        return info
    }
    _createDatesNode() {
        const day = document.createElement('span')
        day.innerHTML = `<strong>${this.task.date}</strong>`
    
        const deadline = document.createElement('span')
        deadline.innerHTML = `...сделать до <strong>${this.task.deadline}</strong>`
    
        const dates = document.createElement('p')
        dates.classList.add('task-dates')
        dates.append(day, deadline)
    
        return dates
    }
    _createControlsNode() {
        const editBtn = document.createElement('button')
        editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#000000" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/></svg>'
        editBtn.classList.add('editBtn')
        
        const deleteBtn = document.createElement('button')
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>'
        deleteBtn.classList.add('delBtn')
    
        const ctrlBtns = document.createElement('section')
        ctrlBtns.classList.add('task-controls')
        ctrlBtns.append(editBtn, deleteBtn)
    
        return ctrlBtns
    }
}

class CardHandlers {    
    setAllBtnHandlers(taskList) {
        // Слушатели на все карточки списка
        Array.from(document.getElementsByClassName('delBtn')).forEach(delBtn=>{
            delBtn.getElementsByTagName('svg')[0].style.pointerEvents = "none"
            delBtn.addEventListener('click', (e) => this._delBtnHandler(e, taskList))
        })
        Array.from(document.getElementsByClassName('editBtn')).forEach(editBtn=>{
            editBtn.getElementsByTagName('svg')[0].style.pointerEvents = "none"
            editBtn.addEventListener('click', (e) => this._editBtnHandler(e, taskList))
        })
        Array.from(document.getElementsByClassName('doneBtn')).forEach((doneBtn)=>{
            doneBtn.addEventListener('click', (e) => this._isDoneBtnHandler(e, taskList))
        })
    }
    setBtnHandler(card) {
        // Слушатели на 1 карточку списка
        card.querySelector('.delBtn')
            .addEventListener('click', (e) => {e.stopPropagation(); this._delBtnHandler(e)})
        card.querySelector('.editBtn')
            .addEventListener('click', (e) => {e.stopPropagation(); this._editBtnHandler(e)})
        card.querySelector('.doneBtn')
            .addEventListener('click', (e) => this._isDoneBtnHandler(e))
    }

    _delBtnHandler(e) {
        if(!confirm("Удалить эту запись?")) return;
        
        // определяем порядок задачи в списке
        const tasksElems = Array.from(e.target.parentElement.parentElement.parentElement.children)
        const curCard = e.target.parentElement.parentElement
        let taskList = JSON.parse(localStorage.getItem('TaskManager_taskList'))
        taskList = new TaskList(taskList.tasks)

        tasksElems.reverse().forEach((card,id_task)=>
        {
            if(curCard != card) return;
            
            // убираем заметку из хранилищ
            taskList.delTask(id_task)
            new CardNodesList(taskList).createTaskList()
        })
    }
    _isDoneBtnHandler(e) {
        // определяем порядок задачи в списке
        const tasksElems = Array.from(e.target.parentElement.parentElement.children)
        const curCard = e.target.parentElement
        let taskList = JSON.parse(localStorage.getItem('TaskManager_taskList'))
        taskList = new TaskList(taskList.tasks)

        tasksElems.reverse().forEach((card,id_task)=>
        {
            if(curCard != card) return;
            
            // изменить значение
            if(e.target.checked) {
                taskList.changeTaskField(id_task,"isDone",true)
                curCard.classList.add('done')
            } else {
                taskList.changeTaskField(id_task,"isDone",false)
                curCard.classList.remove('done')
            }
        })
    }
    _editBtnHandler(e) {
        // узнать номер заметки в списке
        const tasksElems = Array.from(e.target.parentElement.parentElement.parentElement.children)
        const curCard = e.target.parentElement.parentElement
        let taskList = JSON.parse(localStorage.getItem('TaskManager_taskList'))
        taskList = new TaskList(taskList.tasks)

        tasksElems.reverse().forEach((card,id_task)=>
        {
            if(curCard != card) return;

            
            // в череде prompt-запросов получить название-описание-срок
            const newName = prompt(`Редактирование названия задачи.\n\nПредыдущее: "${taskList.tasks[id_task].name}"`)
            const newDesc = prompt(`Редактирование описания задачи.\n\nПредыдущее: "${taskList.tasks[id_task].description}"`)
            let newDeadline = prompt(`Редактирование срока выполнения задачи.
                \nПредыдущее: "${taskList.tasks[id_task].deadline}"
                \nФормат: dd.mm.yyyy hh:mm`)
                
            // Пропустиить только валидное значение времени
            while(newDeadline && !Datetime.isDatetimeValid(newDeadline)) {
                newDeadline = prompt(`Ошибка! Неверный формат или указанное время уже прошло!
                    \nРедактирование срока выполнения задачи.
                    \nПредыдущее: "${taskList.tasks[id_task].deadline}"
                    \nФормат: dd.mm.yyyy hh:mm`)
            }
            
            // заменить данные
            let name;
            if(newName && newName.trim()!='') {
                curCard.querySelector('.task-name').textContent = newName.trim()
                taskList.changeTaskField(id_task,"name",newName.trim())

                name = newName.trim()
            } else {
                name = card.querySelector('.task-name').textContent
            }

            if(newDesc && newDesc.trim()!='') {
                curCard.querySelector('.task-description').textContent = newDesc.trim()
                taskList.changeTaskField(id_task,"description",newDesc.trim())
            }

            // пришелший срок 100% валидный
            if(newDeadline && newDeadline!='') {
                curCard.querySelector('.task-dates span:last-child strong').textContent = newDeadline
                taskList.changeTaskField(id_task,"deadline",newDeadline)
                
                setNotification(name, newDeadline)
            }
        })
    }
}

export class SortTaskList {
    static sortByDeadlineAddition() {
        const curTaskList = new CardNodesList()
        curTaskList.createTaskList()
    }
    static sortByDeadlineIncrease() {
        const curTaskList = new CardNodesList()
        let sortedTaskList={}
        sortedTaskList.tasks = curTaskList.taskList.tasks.sort((a,b)=>{
            if(a.deadline < b.deadline) return -1
            else return 1
        })
        curTaskList.createTaskList()
    }
    static sortByDeadlineDecrease() {
        const curTaskList = new CardNodesList()
        let sortedTaskList={}
        sortedTaskList.tasks = curTaskList.taskList.tasks.sort((a,b)=>{
            if(a.deadline < b.deadline) return 1
            else return -1
        })
        curTaskList.createTaskList()
    }

    static sortByCreationFromNewToEarly() {
        const curTaskList = new CardNodesList()
        curTaskList.createTaskList()            // от новых к ранним
    }
    static sortByCreationFromEarlyToNew() {
        const curTaskList = new CardNodesList()
        curTaskList.taskList.tasks.reverse()
        curTaskList.createTaskList(curTaskList) // от ранних к новым
    }
}