
export function getStrDate(date = new Date) {return (date).toLocaleDateString('ru', {day:'numeric', month:'numeric', year:'numeric'})}


/* Создание заметки / списка заметок */

export function insertTask(task) {
    document.querySelectorAll('.task-card')[0].before(createTaskNode(task))
}

function createDatesNode(task) {
    const day = document.createElement('span')
    day.innerHTML = `<strong>${task.date}</strong>`

    const deadline = document.createElement('span')
    deadline.innerHTML = `...сделать до <strong>${task.deadline}</strong>`

    const dates = document.createElement('p')
    dates.classList.add('task-dates')
    dates.append(day, deadline)

    return dates
}
function createInfoNodes(task) {
    const info = document.createElement('section')
    info.classList.add('task-card__container')

    const name = document.createElement('p')
    name.classList.add('task-name')
    name.textContent = task.name

    if(task.description !== '') {
        const description = document.createElement('p')
        description.classList.add('task-description')
        description.textContent = task.description
        deadline.textContent = task.deadline
        info.append(createDatesNode(task), name, description)
    } else {
        info.append(createDatesNode(task), name)
    }

    return info
}
function createControlNodes() {
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
function createTaskNode(task) {
    const done = document.createElement('input')
    done.setAttribute('type', 'checkbox')
    done.classList.add('doneBtn')
    
    const card = document.createElement('section')
    card.classList.add('task-card')
    card.append(done, createInfoNodes(task), createControlNodes())
    
    if(task.isDone) {
        card.classList.add('done')
        done.checked = true
    }
    else card.classList.remove('done')

    return card
}
function createTaskNodes(tasks) {
    return tasks.map(task=>createTaskNode(task)).reverse()
}

export function createTaskList(taskList) {
    const cards_list = document.createElement('section')
    cards_list.classList.add('task-cards')
    cards_list.append(...createTaskNodes(taskList.tasks))
    
    document.getElementById('tasksList').innerHTML=''
    document.getElementById('tasksList').appendChild(cards_list)
}


/* Удаление заметки */

export function setDelBtnHandler(taskList) {
    // выборочное удаление записей
    Array.from(document.getElementsByClassName('delBtn')).forEach(delBtn=>{
        delBtn.getElementsByTagName('svg')[0].style.pointerEvents = "none"
        delBtn.addEventListener('click', (e) => delBtnHandler(e, taskList))
    })
}
function delBtnHandler(e, taskList) {
    if(confirm("Удалить эту запись?")) 
    {
        // определяем порядок задачи в списке
        const tasksElems = Array.from(e.target.parentElement.parentElement.parentElement.children)
        const curCard = e.target.parentElement.parentElement
        tasksElems.reverse().forEach((card,id_task)=>{
            if(curCard == card) 
            {
                // убираем заметку из localStorage
                taskList.tasks.splice(id_task,1)
                
                localStorage.setItem('TaskManager_taskList', JSON.stringify(taskList))
                createTaskList(taskList)
                // "вернуть" слушатели
                setDelBtnHandler(taskList)
                setEditBtnHandler(taskList)
                return;
            }
        })
    }
}


/* Пометка задач как "выполненные" */
export function setIsDoneBtnHandler(taskList) {
    Array.from(document.getElementsByClassName('doneBtn')).forEach((doneBtn)=>{
        doneBtn.addEventListener('click', (e) => isDoneBtnHandler(e, taskList))
    })
}
function isDoneBtnHandler(e, taskList) {

    // определяем порядок задачи в списке
    const tasksElems = Array.from(e.target.parentElement.parentElement.children)
    const curCard = e.target.parentElement
    tasksElems.reverse().forEach((card,id_task)=>{
        if(curCard == card) 
        {
            // изменить значение
            if(e.target.checked) {
                taskList.tasks[id_task].isDone = true
                curCard.classList.add('done')
            } else {
                taskList.tasks[id_task].isDone = false
                curCard.classList.remove('done')
            }
            localStorage.setItem('TaskManager_taskList', JSON.stringify(taskList))
        }
    })
}


/* Изменение заметки о задаче */
export function setEditBtnHandler(taskList) {
    // выборочное изменени записей
    Array.from(document.getElementsByClassName('editBtn')).forEach(delBtn=>{
        delBtn.getElementsByTagName('svg')[0].style.pointerEvents = "none"
        delBtn.addEventListener('click', (e) => editBtnHandler(e, taskList))
    })
}
function editBtnHandler(e, taskList) {
    // узнать номер заметки в списке
    const tasksElems = Array.from(e.target.parentElement.parentElement.parentElement.children)
    const curCard = e.target.parentElement.parentElement
    tasksElems.reverse().forEach((card,id_task)=>{
        // в череде prompt-запросов получить название-описание-срок
        if(curCard == card) 
        {
            const newName = prompt(`Редактирование названия задачи.\n\nПредыдущее: "${taskList.tasks[id_task].name}"`)
            const newDesc = prompt(`Редактирование описания задачи.\n\nПредыдущее: "${taskList.tasks[id_task].description}"`)
            let newDeadline = prompt(`Редактирование срока выполнения задачи.
                \nПредыдущее: "${taskList.tasks[id_task].deadline}"
                \nФормат: dd.mm.yyyy hh:mm`).trim()
            while(newDeadline && !checkDatetime(newDeadline)) {
                newDeadline = prompt(`Редактирование срока выполнения задачи.
                    \nПредыдущее: "${taskList.tasks[id_task].deadline}"
                    \nФормат: dd.mm.yyyy hh:mm`)
            }
            
            // заменить данные
            if(newName) {
                curCard.querySelector('.card-name').textContent = newName.trim()
                taskList.tasks[id_task].name = newName.trim()
            }
            if(newDesc) {
                curCard.querySelector('.task-description').textContent = newDesc.trim()
                taskList.tasks[id_task].description = newDesc.trim()
            }
            if(newDeadline) {
                curCard.querySelector('.task-dates span:last-child strong').textContent = newDeadline.trim()
                taskList.tasks[id_task].deadline = newDeadline.trim()
            }
            localStorage.setItem('TaskManager_taskList', JSON.stringify(taskList))
        }
    })
}
function checkDatetime(datetime) {
    if(typeof datetime != 'string') return null;

    const day = datetime.slice(0,2)
    if(isNaN(Number(day)) || Number(day) > 31) return null;

    if(datetime.slice(2,3)!='.') return null;
    
    const month = datetime.slice(3,5)
    if(isNaN(Number(month)) || Number(month) > 12) return null;
    
    if(datetime.slice(5,6)!='.') return null;
    
    const year = datetime.slice(6,10)
    // if(isNaN(Number(year))) return null;
    
    if(datetime.slice(10,11)!=' ') return null;

    const hour = datetime.slice(11,13)
    if(isNaN(Number(hour))|| Number(hour) >= 24) return null;

    if(datetime.slice(13,14)!=':') return null;

    const minutes = datetime.slice(14,16)
    if(isNaN(Number(minutes)) || Number(minutes) >= 60) return null;

    console.log(day, datetime.slice(2,3), month, datetime.slice(4,5), year, datetime.slice(6,10), 
                datetime.slice(11,13), hour, datetime.slice(14,16), minutes)
    return datetime
}