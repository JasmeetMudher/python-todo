const addBtn = document.getElementById("add-btn");
const clearAll = document.getElementById("clear-btn");
const taskList = document.getElementById("task-list");
const deadline = document.getElementById("deadline");
const priority = document.getElementById("priority");
const taskType = document.getElementById("task-type");
const taskInput = document.getElementById("task");

function addTask() {
  let taskValue = taskInput.value.trim();
  let deadlineValue = deadline.value;
  let priorityValue = priority.value;
  let taskTypeValue = taskType.value;

  if (taskValue === "") {
    alert("Please Enter a Task");
    return;
  }
  if (deadlineValue === "") {
    alert("Please Enter Deadline");
    return;
  }

  let newList = document.createElement("li");

  newList.innerHTML = `Task: ${taskValue},<br/>
                        Priority: ${priorityValue},<br/>
                        Task Type: ${taskTypeValue},<br/>
                        Deadline: ${deadlineValue}`;

  taskList.appendChild(newList);

  taskInput.value = "";
  deadline.value = "";
}

function clearTasks() {
  taskList.innerHTML = "";
}

addBtn.addEventListener("click", addTask);
clearAll.addEventListener("click", clearTasks);
