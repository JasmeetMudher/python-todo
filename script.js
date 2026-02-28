const addBtn = document.getElementById("add-btn");
const clearAllBtn = document.getElementById("clear-btn");
const taskListOl = document.getElementById("task-list");
const deadlineInput = document.getElementById("deadline");
const prioritySelect = document.getElementById("priority");
const taskTypeSelect = document.getElementById("task-type");
const taskInput = document.getElementById("task");

function addTask() {
  let taskValue = taskInput.value.trim();
  let deadlineValue = deadlineInput.value;
  let priorityValue = prioritySelect.value;
  let taskTypeValue = taskTypeSelect.value;

  if (taskValue === "") {
    alert("Please Enter a Task");
    return;
  }

  let li = document.createElement("li");

  li.innerText =`Task: ${taskValue}\n` +
                `Priority: ${priorityValue}\n` +
                `Task Type: ${taskTypeValue}\n` +
                `Deadline: ${deadlineValue || "No deadline"}`;

  taskListOl.appendChild(li);

  taskInput.value = "";
  deadlineInput.value = "";
}

function clearTasks() {
  taskListOl.innerHTML = "";
}

addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearTasks);
