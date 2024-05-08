let arrTask = [];
let doneArr = [];
let todoArr = [];

let allTasksCounter;
let doneTasksCounter;
let todoTasksCounter;

//Start eventListener
document.addEventListener('DOMContentLoaded', function() {

    getDataFromLocalStorage();

    window.onload = () => {
        let taskText = document.getElementById("inputField");
        taskText.focus();
    }

    document.getElementById("inputField").addEventListener('keypress',function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("addTaskButton").click();
            document.getElementById("allButton").click();
        }
    });
    
    document.getElementById("allButton").addEventListener("click", function() {
        document.querySelectorAll('.Buttons button').forEach(btn => btn.classList.remove('active','activeButton'));
        this.classList.add('active' ,'activeButton');
        updateDisplay(); 
    });
    document.getElementById("doneButton").addEventListener("click", function() {
        document.querySelectorAll('.Buttons button').forEach(btn => btn.classList.remove('active','activeButton'));
        this.classList.add('active' ,'activeButton');
        updateDisplay(); 
    });
    document.getElementById("todoButton").addEventListener("click", function() {
        document.querySelectorAll('.Buttons button').forEach(btn => btn.classList.remove('active','activeButton'));
        this.classList.add('active' ,'activeButton');
        updateDisplay(); 
    });

    document.getElementById("newText").addEventListener('keypress',function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("edit").click();
        }
    });
    
    document.querySelector(".popup").addEventListener('click', function(event) {
        const editContainer = document.querySelector('.editPopup');
        const editButton = document.querySelector('.edit');
        if (!editContainer.contains(event.target) && event.target !== editButton) {
            closeEditPopup();
            closeDeletePopup();
            closeWarningPopup();
        }
    });

    document.getElementById("allButton").click();
    updateDisplay();
    
});
//End eventListener 

// Add New Task Function
function addNewTask(){
    let taskText = document.getElementById("inputField").value;
    window.onload = () => {
        taskText.focus();
    }
    let regExp = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/;
    if (taskText.value !== "") { 
        // Create object for every non-empty input field
        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false,
            date:null
        };
        // Ensure the input field contains only characters
        if (!regExp.test(taskText)) {
            let Popup = document.querySelector('.warningPopup');
            Popup.classList.add('openPopup');
            let popup = document.querySelector(".popup");
            popup.classList.add("popupDisplay");  
        } else {
            arrTask.push(newTask);
            saveTasksToLocalStorage();
        }
    }
    // Clear the input field value
    document.getElementById("inputField").value = '';
    updateDisplay();
} 

// Create Task Element Function
function createTaskElements(task){
    const taskContainer = document.querySelector('.taskContainer');
    const taskElement = document.createElement('div');
        taskElement.classList.add('TasksList');
        taskElement.setAttribute('draggable', 'true');
        taskElement.innerHTML = `
        <div class="taskNumber">
        <p id='taskNumber${task.id}'> </p>
        </div>
        <div class="content">
            <p id='${task.id}' class="${task.done ? 'done-task' : ''}"> ${task.text}</p>
            <p id="taskDate${task.id}"> </p>
        </div>
        <div class="Icons">
            <input type="checkbox"  class="checkbox" onchange="updateCheckbox(${task.id})" ${task.done ? 'checked' : ''}>
            <button type="button" class="edit" onclick="openEditPopup(${task.id},'${task.text}')"><i class='fas fa-pen'></i></button>
            <button type="button" class="delete" onclick="openDeletePopup(${task.id},'${task.text}')"><i class="fas fa-trash"></i></button>
        </div>
        `;
        taskContainer.appendChild(taskElement);

        let taskDateElement = document.getElementById(`taskDate${task.id}`);
        taskDateElement.innerText = task.date ? task.date : ''; // Display task date if available
        taskDateElement.classList.add("taskDate");

        // Add drag event listeners
        taskElement.addEventListener('dragstart', handleDragStart);// Event handler when dragging starts
        taskElement.addEventListener('dragover', handleDragOver);
        taskElement.addEventListener('drop', handleDrop);// Event handler when dropping occurs
}
//End Create Task Element Function

let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary to allow drop
    }
    e.dataTransfer.dropEffect = 'move';  
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }
    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }
    return false;
}

//Start Display All Tasks Function
function displayAllTasks(){
    allTasksCounter=0;
    const taskContainer = document.querySelector('.taskContainer');
    document.querySelector('.taskContainer').innerHTML = '';
    if (arrTask.length === 0) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('noTasksMessage');
        messageElement.textContent = 'No tasks!';
        taskContainer.appendChild(messageElement);
    } else {
        arrTask.forEach(task =>{
            allTasksCounter++;
            createTaskElements(task);
            let taskNumberElement=document.getElementById(`taskNumber${task.id}`);
            taskNumberElement.innerText= `Task${allTasksCounter}`;
            taskNumberElement.classList.add("taskNumber");
        });
    }
}
//End Display All Tasks Function

//Start display done task function
function displayDoneTasks(){
    doneTasksCounter=0;
    const taskContainer = document.querySelector('.taskContainer');
    taskContainer.innerHTML = '';

    doneArr = arrTask.filter(task => task.done );

    if (doneArr.length === 0) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('noTasksMessage');
        messageElement.textContent = 'No done tasks!';
        taskContainer.appendChild(messageElement);
    } else {
        doneArr.forEach(task => {
            doneTasksCounter++;
            createTaskElements(task);
            let taskNumberElement=document.getElementById(`taskNumber${task.id}`);
            taskNumberElement.innerText= `Task${doneTasksCounter}`;
            taskNumberElement.classList.add("taskNumber");
        });
    }
}
//End display done task function

//Start display Todo task function
function displayTodoTasks() {
    todoTasksCounter=0;
    const taskContainer = document.querySelector('.taskContainer');
    document.querySelector('.taskContainer').innerHTML = '';
    todoArr=arrTask.filter(task => !task.done );

    if (todoArr.length === 0) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('noTasksMessage');
        messageElement.textContent = 'No Todo tasks!';
        taskContainer.appendChild(messageElement);
    } else {
    todoArr.forEach(task=> {
        todoTasksCounter++;
        createTaskElements(task);
        let taskNumberElement=document.getElementById(`taskNumber${task.id}`);
        taskNumberElement.innerText= `Task${todoTasksCounter}`;
        taskNumberElement.classList.add("taskNumber");
    });
    }
}
//End display Todo task function

//Start updateCheckbox function
function updateCheckbox(taskId) {
    let task = arrTask.find(task => task.id === taskId);
    task.done = !task.done; 
    task.date = task.done ? new Date().toDateString() : null;

    const taskElement = document.getElementById(taskId);
    taskElement.classList.toggle('done-task', task.done);

    if (task.done) {
        doneArr.push(task);   
        todoArr = todoArr.filter(task => task.id !== taskId);
    } else {
        
        todoArr.push(task);
        doneArr = doneArr.filter(task => task.id !== taskId);
    }
    saveTasksToLocalStorage();
    updateDisplay();
}
//End updateCheckbox function

//Start updateDisplay function
function updateDisplay() {
    const allButton = document.getElementById("allButton");
    const doneButton = document.getElementById("doneButton");

    if (allButton.classList.contains("active")) {
        displayAllTasks();
    } else if (doneButton.classList.contains("active")) {
        displayDoneTasks();
    } else {
        displayTodoTasks();
    }
}
//End updateDisplay function

//Start closeWarningPopup function
function closeWarningPopup(){
    let Popup=document.querySelector('.warningPopup');
    Popup.classList.remove('openPopup');
    Popup.classList.add('closeEditPopup');
    let popup = document.querySelector(".popup");
    popup.classList.remove("popupDisplay");  
}
//End closeWarningPopup function

let taskIdToEdit;
//Start openEditPopup function
function openEditPopup(taskId,taskText){
    taskIdToEdit=taskId;

    document.getElementById('editTaskText').innerText= `Edit ${taskText} task`;
    document.getElementById("newText").value = taskText;
    
    let editPopup=document.querySelector(".editPopup");
    editPopup.classList.add("openPopup");
    let popup=document.querySelector(".popup");
    popup.classList.add("popupDisplay");
}
//End openEditPopup function

//Start editTask function
function editTask() {  

    let newTaskText = document.getElementById('newText').value;
    let regExp=/^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/;

    if(newTaskText.value !== ""){ 

    if(!regExp.test(newTaskText)){
        let Popup = document.querySelector('.warningPopup');
        Popup.classList.add('openPopup');     
    } 

    else{
        arrTask.forEach(task=>{
            if(task.id === taskIdToEdit){
                let indexTask=arrTask.indexOf(task);
                arrTask[indexTask].text=newTaskText;
            } 
        });
        
        doneArr.forEach(task=>{
            if(task.id === taskIdToEdit){
                let indexTask=doneArr.indexOf(task);
                doneArr[indexTask].text=newTaskText;
                } 
        });
        todoArr.forEach(task=>{
            if(task.id === taskIdToEdit){
                let indexTask=todoArr.indexOf(task);
                todoArr[indexTask].text=newTaskText;
                } 
        });
    }
}
    updateDisplay();
    closeEditPopup();
    saveTasksToLocalStorage();
    document.getElementById('newText').value='';
}
//End editTask function

//Start closeEditPopup function
function closeEditPopup(){
    let editPopup=document.querySelector(".editPopup");
    editPopup.classList.remove("openPopup");
    let popup = document.querySelector(".popup");
    popup.classList.remove("popupDisplay");  
}

//End closeEditPopup function

let taskIdToDelete;
//Start openDeletePopup function
function openDeletePopup(taskId,taskText) {
    taskIdToDelete = taskId;
    document.getElementById('deleteTaskText').innerText= `Are you sure you want to delete ${taskText} task?`;
    let deletePopup = document.querySelector(".deletePopup");
    deletePopup.classList.add("openPopup");
    let popup = document.querySelector(".popup");
    popup.classList.add("popupDisplay");
}
//End openDeletePopup function

//Start closeDeletePopup function
function closeDeletePopup(){
    let deletePopup = document.querySelector(".deletePopup");
    deletePopup.classList.remove("openPopup");
    let popup=document.querySelector(".popup");
    popup.classList.remove("popupDisplay");
}
//End closeDeletePopup function

//Start openYesPopup function
function openYesPopup() {
    let yesPopup = document.querySelector(".yesPopup");
    yesPopup.classList.add("openPopup");
    let popup = document.querySelector(".popup");
    popup.classList.add("popupDisplay");
    closeDeletePopup();

    
    arrTask = arrTask.filter(task => task.id !== taskIdToDelete);
    doneArr = doneArr.filter(task => task.id !== taskIdToDelete);
    todoArr = todoArr.filter(task => task.id !== taskIdToDelete);

    updateDisplay();
    saveTasksToLocalStorage();
}
//End openYesPopup function

//Start closeYesPopup function
function closeYesPopup(){
    let yesPopup = document.querySelector(".yesPopup");
    yesPopup.classList.remove("openPopup");
    let popup = document.querySelector(".popup");
    popup.classList.remove("popupDisplay");
}
//End closeYesPopup function

//Star Open delete done tasks popup
function openDeleteDoneTasksPopup(){
    if(doneArr.length===0){
        let Popup = document.querySelector('.noDoneTasksPopup');
        Popup.classList.add('openPopup');
        let popup = document.querySelector(".popup");
        popup.classList.add("popupDisplay");  
    }else{
        let donePopup = document.querySelector(".deleteDoneTasksPopup");
        donePopup.classList.add("openPopup");
        let popup = document.querySelector(".popup");
        popup.classList.add("popupDisplay");
}
}
//End Open delete done tasks popup

//Start closeNoDoneTasksPopup function
function closeNoDoneTasksPopup(){
    let Popup = document.querySelector('.noDoneTasksPopup');
    Popup.classList.remove('openPopup');
    let popup = document.querySelector(".popup");
    popup.classList.remove("popupDisplay");  
}
//End closeNoDoneTasksPopup function

//Star close delete done tasks popup
function closeDeleteDoneTasksPopup(){
    let donePopup = document.querySelector(".deleteDoneTasksPopup");
    donePopup.classList.remove("openPopup");
    let popup = document.querySelector(".popup");
    popup.classList.remove("popupDisplay");
    
}
//End close delete done tasks popup

//Star Open delete done tasks popup
function openDeleteAllTasksPopup(){
    if(arrTask.length===0){
        let Popup = document.querySelector('.noTasksPopup');
        Popup.classList.add('openPopup');
        let popup = document.querySelector(".popup");
        popup.classList.add("popupDisplay");  
    }else{
    let donePopup = document.querySelector(".deleteAllTasksPopup");
    donePopup.classList.add("openPopup");
    let popup = document.querySelector(".popup");
    popup.classList.add("popupDisplay");
}
}
//End Open delete done tasks popup

//Start closeNoTasksPopup function 
function closeNoTasksPopup(){
    let Popup = document.querySelector('.noTasksPopup');
        Popup.classList.remove('openPopup');
        let popup = document.querySelector(".popup");
        popup.classList.remove("popupDisplay"); 
}
//End closeNoTasksPopup function 

//Star close delete done tasks popup
function closeDeleteAllTasksPopup(){
    let donePopup = document.querySelector(".deleteAllTasksPopup");
    donePopup.classList.remove("openPopup");
    let popup = document.querySelector(".popup");
    popup.classList.remove("popupDisplay");
    
}
//End close delete done tasks popup

//Start deleteDoneTasks function
function deleteDoneTasks(){
    arrTask = arrTask.filter(task => !task.done);
    doneArr = []; 
    saveTasksToLocalStorage();
    closeDeleteDoneTasksPopup();
    updateDisplay();
}
//End deleteDoneTasks function

//Start deleteAllTasks function
function deleteAllTasks(){
    arrTask=[];
    saveTasksToLocalStorage();
    closeDeleteAllTasksPopup();
    updateDisplay();
}
//End deleteAllTasks function

//Start Local Storage
function saveTasksToLocalStorage() {
    localStorage.setItem("allTasks", JSON.stringify(arrTask));
}

function getDataFromLocalStorage() {
    let allData = localStorage.getItem("allTasks");
    if (allData) {
        arrTask = JSON.parse(allData);
        doneArr = arrTask.filter(task => task.done);;
        todoArr = arrTask.filter(task => !task.done);
        updateDisplay();
    }
}
//End Local Storage



