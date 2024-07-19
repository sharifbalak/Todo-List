/** @format */
const form = document.querySelector('#task-form');
var inputTask = document.querySelector('#taskname');
var dueDate = document.querySelector('#dueDate');
const filter = document.querySelector('#filter');
const taskList = document.querySelector('.collection');
const clearTasks = document.querySelector('.clear-btn');
const sortbtn =  document.querySelector(".sort-btn");
var count = 0;


loadEventListener();

function loadEventListener() {
  // Loads stored tasks
  document.addEventListener('DOMContentLoaded', loadTasks);
  //Add task event
  form.addEventListener('submit', addTask);
  //Remove task
  taskList.addEventListener('click', deleteTask);
  // Filter task list
  filter.addEventListener('keyup', filterTasks);
  // Clear Task List
  clearTasks.addEventListener('click', clearTaskList);
  // sort Task List
  sortbtn.addEventListener("click",sortList);

  taskList.addEventListener("click",markasread);
  taskList.addEventListener("click",Updatetext);
}


// Load tasks from local storage on page start
function loadTasks() {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.forEach(function (task) {
    createNewTaskElement(task.taskname,task.dueDate);
  });
}
//Creates li & a-Tag element and adds it to the ul
function createNewTaskElement(taskname,dueDate) {
  const newTask = document.createElement('li');
  newTask.className = 'list-item';
  newTask.innerHTML=`<span style="width:20%;" class="markasread" id=${count}>${taskname}</span><span>${dueDate}</span>`;
  // newTask.appendChild(document.createTextNode(taskname,dueDate));
  const newTaskATag = document.createElement('a');
  newTaskATag.style.cursor = 'pointer';
  newTaskATag.style.color = '#e01a4f';
  newTaskATag.className = 'delete-item secondary-content';
  newTaskATag.innerHTML = `<i class="material-icons" style='margin-right: 5px'>delete</i><span><i class="fa-solid fa-pen editbtn" id="editbtn${count}"></i></span>`;
  newTaskATag.style.display = "flex";
  newTaskATag.style.alignItems = "center";
  newTask.appendChild(newTaskATag);

  taskList.appendChild(newTask);
  // const markasread = document.getElementsByClassName("markasread");
  // console.log(markasread);
  // markasread.parentElement.firstChild.addEventListener("click",function(){
  //   markasread.style.textDecoration="line-through";
  // });
  // const editbtn = document.getElementById("editbtn");
  // editbtn.addEventListener("click",function(e){
  //   console.log(e.target.parentElement);
  // })
}
// Adds a new task to the Task List
function addTask(e) {
  if (inputTask.value === '') {
    M.toast({ html: 'Add a task', classes: 'red rounded' });
  } else {
    createNewTaskElement(inputTask.value,dueDate.value);

    storeTaskInLocalStorage(inputTask.value,dueDate.value);

    inputTask.value = '';
  }
  e.preventDefault();
}
// Saves task to local storage
function storeTaskInLocalStorage(taskname,dueDate) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.push({taskname,dueDate});

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Deletes a single task from the task list
function deleteTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    if (confirm('Are you sure?')) {
      e.target.parentElement.parentElement.remove();

      removeTaskFromLocalStorage(
        e.target.parentElement.parentElement.firstChild.textContent
      );
    }
  }
}
// Delete task from local storage
function removeTaskFromLocalStorage(taskToDelete) {
  let tasks;
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(function (task) {
    if (task === taskToDelete) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filter Tasks
function filterTasks(e) {
  const text = e.target.value.toLowerCase();
  //Iterates through each task and checks if filter input matches it
  document.querySelectorAll('.list-item').forEach(function (task) {
    item = task.firstChild.textContent;
    if (item.toLowerCase().indexOf(text) != -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}

// Deletes all tasks from taskList
function clearTaskList() {
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  localStorage.clear();
}


taskList.addEventListener('click' , function(e){
  if(e.target.tagName==="LI"){
    e.target.classList.toggle("checked");
  }
},false);

function sortList(){
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.sort((a,b)=>{
    let da = new Date(a.dueDate),
        db = new Date(b.dueDate);
    return da - db;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  location.reload();
}

var elements = document.getElementsByClassName("editbtn");
function markasread(e)
{
  // e.preventDefault();
  // console.log(e.target);
  // console.log(elements);
  let clickedElement = e.target;
  if (clickedElement.classList.contains("markasread")) {
    // Find the closest ancestor with the "post" class
    clickedElement.style.textDecoration = "line-through";
}
} 
function Updatetext(e)
{
  // e.preventDefault();
  // console.log(e.target);
  // console.log(elements);
  let clickedElement = e.target;
  if (clickedElement.classList.contains("editbtn")) {
    // Find the closest ancestor with the "post" class
    inputTask.value = clickedElement.parentElement.parentElement.parentElement.firstChild.textContent;
    inputTask.addEventListener("mousedown", function(){
        var element = clickedElement.parentElement.parentElement.parentElement.firstChild;
        element.textContent = inputTask.value;
        inputTask.value = '';
    })
    
}
} 

