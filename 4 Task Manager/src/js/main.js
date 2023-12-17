import '../assets/style.css'
import {insertTask, createTaskList, getStrDate, isDatetimeValid,
    setDelBtnHandler, setEditBtnHandler, setIsDoneBtnHandler
} from './manageTaskList.js'


const taskListDef = {
    tasks: [
        {date:'20.11.2023', name: 'L2', description: '5 заданий из списка', deadline:'28.11.2023 23:59', isDone:false},
        {date:'28.11.2023', name: '3-е приложение', description: 'Игра "Угадай число"', deadline:'30.11.2023 17:30', isDone:true},
        {date:'28.11.2023', name: '4-е приложение', description: '"Планировщик задач"', deadline:'1.12.2023 23:59', isDone:false},
        {date:'30.11.2023', name: '5-е приложение', description: '"Музыкальный плеер с визуализацией"', deadline:'3.12.2023 23:59', isDone:false}
    ]
}


document.addEventListener('DOMContentLoaded',()=>{

    // получить список из localStorage
    try{
        globalThis.taskList = JSON.parse(localStorage.getItem('TaskManager_taskList'))
    } catch {
        globalThis.taskList = dubObject(taskListDef)
    }

    if(!taskList) { taskList = dubObject(taskListDef) }
    createTaskList(taskList)

    setDelBtnHandler(taskList)
    setEditBtnHandler(taskList)
    setIsDoneBtnHandler(taskList)

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
        localStorage.setItem('TaskManager_taskList', JSON.stringify(taskList))
        createTaskList(taskList)
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
    
    deadline = formDatetime(deadline)
    if(!isDatetimeValid(deadline)) {alert("Введена некорректная дата или время!"); return;}

    const task = {date: getStrDate(), name, description, deadline}
        taskList.tasks.push(task)

        localStorage.setItem('TaskManager_taskList', JSON.stringify(taskList))
        insertTask(task)
        setDelBtnHandler(taskList)
        setEditBtnHandler(taskList)

        setNotification(name, deadline)
})
function formDatetime(datetime) {
    let [date, time] = datetime.split('T')
    date = date.split('-').reverse().join('.')
    return `${date} ${time}`
}


// Сортировка по сроку выполнения
document.getElementById('sortDeadline').addEventListener('change',(option)=>{
    const type = option.target.value
    // console.log(option.target.value)

    if(type.toLowerCase() === "addition") {
        createTaskList(taskList)
    }
    else if (type.toLowerCase() === "increase") {
        const curTaskList = dubObject(taskList)
        let sortedTaskList={}
        sortedTaskList.tasks = curTaskList.tasks.sort((a,b)=>{
            if(a.deadline < b.deadline) return -1
            else return 1
        })
        createTaskList(curTaskList)
    }
    else if (type.toLowerCase() === "decrease") {
        const curTaskList = dubObject(taskList)
        let sortedTaskList={}
        sortedTaskList.tasks = curTaskList.tasks.sort((a,b)=>{
            if(a.deadline < b.deadline) return 1
            else return -1
        })
        createTaskList(curTaskList)
    }
})
// Сортировка по сроку выполнения
document.getElementById('sortCreationDay').addEventListener('change',(option)=>{
    const type = option.target.value

    if(type.toLowerCase() === "decrease") {
        createTaskList(taskList)    // от новых к ранним
    } else if (type.toLowerCase() === "increase") {
        const curTaskList = dubObject(taskList)
        curTaskList.tasks.reverse()
        createTaskList(curTaskList) // от ранних к новым
    }
})

function dubObject(object) {return JSON.parse(JSON.stringify(object))}