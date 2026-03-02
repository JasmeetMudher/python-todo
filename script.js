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

  li.innerText =
    `Task: ${taskValue}\n` +
    `Priority: ${priorityValue}\n` +
    `Task Type: ${taskTypeValue}\n` +
    `Deadline: ${deadlineValue || "No deadline"}\n`;

  const doneLabel = document.createElement("span");
  doneLabel.innerText = "Mark as Done: ";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      li.style.textDecoration = "line-through";
    } else {
      li.style.textDecoration = "none";
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => li.remove());

  li.appendChild(doneLabel);
  li.appendChild(checkbox);
  li.appendChild(deleteBtn);

  taskListOl.appendChild(li);

  taskInput.value = "";
  deadlineInput.value = "";
}

function clearTasks() {
  taskListOl.innerHTML = "";
}

addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearTasks);
