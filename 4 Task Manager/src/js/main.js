import Datetime from './utils/datetime.js'
import {TaskList, CardNodesList, SortTaskList} from './manageTaskList.js'


const taskListDef = {
    tasks: [
        {date:'20.11.2023', name: 'L2', description: '5 заданий из списка', deadline:'28.11.2023 23:59', isDone:false},
        {date:'28.11.2023', name: '3-е приложение', description: 'Игра "Угадай число"', deadline:'30.11.2023 17:30', isDone:true},
        {date:'28.11.2023', name: '4-е приложение', description: '"Планировщик задач"', deadline:'01.12.2023 23:59', isDone:false},
        {date:'30.11.2023', name: '5-е приложение', description: '"Музыкальный плеер с визуализацией"', deadline:'03.12.2023 23:59', isDone:false}
    ]
}


document.addEventListener('DOMContentLoaded',()=>{

    // получить список из localStorage
    try{
        globalThis.taskList = JSON.parse(localStorage.getItem('TaskManager_taskList'))
        taskList = new TaskList(taskList.tasks)
    } catch {
        globalThis.taskList = new TaskList(taskListDef.tasks)
        taskList.set()
    }
    new CardNodesList(taskList).createTaskList()

    // Убрать с форм срабатывание по клику submit
    Array.from(document.getElementsByTagName('form')).forEach(form=>{
        form.addEventListener('click', e=>e.preventDefault())
    })
})


// Очистить все записи
document.getElementById('clearAllBtn').addEventListener('click',()=>{
    if(confirm("Вы уверены, что хотите удалить ВСЕ записи?")) {
        taskList = {
            tasks: []
        }
        new TaskList(taskList.tasks).setTaskList()
    }
})

// Добавить задачу
document.getElementById('addTaskBtn').addEventListener('click',()=>{

    const name = document.getElementById('getTask').value.trim()
    document.getElementById('getTask').value =''
    const description = document.getElementById('getDescription').value.trim()
    document.getElementById('getDescription').value=''
    let deadline = document.getElementById('deadline').value

    if(name==='' || deadline==='') {alert("Не введены название или срок выполнения!"); return;}
    
    deadline = Datetime.formDatetime(deadline)
    if(!Datetime.isDatetimeValid(deadline)) {alert("Введена некорректная дата или время!"); return;}

    const task = {date: Datetime.getStrDate(), name, description, deadline}

    taskList = new TaskList(taskList.tasks)
    taskList.addTask(task)

    setNotification(name, deadline)
})


// Сортировка по сроку выполнения
document.getElementById('sortDeadline').addEventListener('change',(option)=>{
    const type = option.target.value;
    if      (type.toLowerCase() === "addition") SortTaskList.sortByDeadlineAddition()
    else if (type.toLowerCase() === "increase") SortTaskList.sortByDeadlineIncrease()
    else if (type.toLowerCase() === "decrease") SortTaskList.sortByDeadlineDecrease()
})

// Сортировка по сроку создания
document.getElementById('sortCreationDay').addEventListener('change',(option)=>{
    const type = option.target.value;
    if      (type === "EarlyToNew") SortTaskList.sortByCreationFromEarlyToNew()
    else if (type === "NewToEarly") SortTaskList.sortByCreationFromNewToEarly()
})