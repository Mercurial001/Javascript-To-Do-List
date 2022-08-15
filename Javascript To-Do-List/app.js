const alert = document.querySelector(".alert");
const form =  document.querySelector(".to-do-section");
const taskInput = document.getElementById("task-input");
const submitBtn = document.querySelector(".submit-btn");
const taskContainer = document.querySelector(".task-container");
const checkBtn = document.querySelector(".check-btn");
const deleteBtn = document.querySelector(".delete-btn");
const clearBtn = document.querySelector('.clear-btn');
const list = document.querySelector('.task-list');
const clearBtnContainer = document.querySelector('.clear-btn-div')


let editElement;
let editFlag = false;
let editID = "";
//Event Listener

// For Submitting Tasks
form.addEventListener('submit', addTask);

// load items from local storage

window.addEventListener('DOMContentLoaded', setupItems);
// For Clearing Tasks
clearBtn.addEventListener('click', clearItems);

//Functions
function addTask(e) {
    e.preventDefault();
    const task = taskInput.value
    // This is code is for generating unique set of number which we will be using 
    // as our ID
    const id = new Date().getTime().toString();
    if (task !== '' && editFlag === false) {
        console.log('log item into list');
        createListItem(id, task)
        // displays alert
        displayAlert('New Task Added', 'success')
        list.classList.add("show-task")
        // Add to local storage
        addToLocalStorage(id, task)
        // Set Back to Default
        setBackToDefault()
    } else if (task !== '' && editFlag === true) {
        editElement.innerHTML = task;
        displayAlert('Task Edited', 'success');
        // edit local storage
        editLocalStorage(editID, task)
        setBackToDefault();
    } else {
        console.log('empty value');
        displayAlert('Field is Empty!' ,'failed')
    }
}

// For Displaying Alert
function displayAlert(text, action) {
    alert.style.visibility = 'visible'
    alert.textContent = text;
    alert.classList.add(`${action}`);

    setTimeout( () => {
        alert.textContent = "";
        alert.classList.remove(`${action}`);
    }, 1000);
}

// Sets back to default
function setBackToDefault(){
    taskInput.value = '';
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Submit";
}

// Clear Item Function

function clearItems() {
    const tasker = document.querySelectorAll('.task-item');
    

    if (tasker.length > 0) {
        tasker.forEach(function (tsk) {
            list.removeChild(tsk);
        clearBtn.classList.remove('clear-btn-visibility')
        displayAlert('All Tasks Cleared', 'success')   
        setBackToDefault();
        localStorage.removeItem('list');
        });
    }
}

// Delete Task Function
function deleteItem (e) {
    const listElement = e.currentTarget.parentElement.parentElement;
    const taskId = listElement.dataset.id
    list.removeChild(listElement);
    const listLength = document.querySelectorAll('.task-item');

    if (listLength.length === 0) {
        clearBtn.classList.remove('clear-btn-visibility')
    }

    displayAlert('Task Deleted', 'failed')
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(taskId)

    console.log(listElement);
}

// Editing Tasks Function
function editItem(e) {
    // Targets the parent element from button div, therefore it is 'list'
    const editEventElement = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.
    previousElementSibling;
    // Sets form name
    taskInput.value = editElement.innerHTML;
    editFlag = true;
    editID = editEventElement.dataset.id;
    submitBtn.textContent = "Edit"
}

// **** LOCAL STORAGE ****
function addToLocalStorage(id, task) {
    const storedTask = {id, task};
    let taskItems = getLocalStorage()
    console.log(taskItems)
    taskItems.push(storedTask);
    localStorage.setItem("list", JSON.stringify(taskItems));
}

function removeFromLocalStorage(id) {
    let removeItems = getLocalStorage();

    removeItems = removeItems.filter(function (removeItem){
        if (removeItem.id !==id) {
            return removeItem
        }
    })
    localStorage.setItem('list', JSON.stringify(removeItems));
}
function editLocalStorage(id, task) {
    let items = getLocalStorage();
    items = items.map(function (item) {
        if (item.id === id) {
            item.task = task;
        }
        return item;
    })
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem('list')): [];
}
// Local Storage API
// Set Item
// Get Item
// Remove Item
// Save as Strings
//localStorage.setItem('orange', JSON.stringify(['item', 'item2']))

// **** SETUP ITEMS ****

function setupItems(){
    let items = getLocalStorage();
    if (items.length > 0 ) {
        items.forEach(function(item){
            createListItem(item.id, item.task)
        })
        taskContainer.classList.add('show-task')
    }
}

function createListItem(id, task) {
    const element = document.createElement('article');
        // add class
        element.classList.add('task-item');
        //add ID
        const attr = document.createAttribute('data-id')
        attr.value = id
        element.setAttributeNode(attr);
        // From class task-list; <div class="task-list"></div>
        element.innerHTML = `
        <p class="task-name">${task}</p>
        <div class="btns">
            <button type="button" class="check-btn"><i class="fa fa-pencil"></i></button>
            <button type="button" class="delete-btn"><i class="fa fa-trash-o"></i></button>
        </div>`;
        // Edit and Delete Buttons
        const deleteBtn = element.querySelector('.delete-btn');
        const checkBtn = element.querySelector('.check-btn');
        // Event Listeners for Button
        deleteBtn.addEventListener('click', deleteItem);
        checkBtn.addEventListener('click', editItem);
        // Appears Clear Button
        clearBtn.classList.add('clear-btn-visibility');
        // append child
        list.append(element);
}