const API_URL = "http://127.0.0.1:8000/tasks";

const addBtn = document.getElementById("add-btn");
const clearAllBtn = document.getElementById("clear-btn");
const taskListOl = document.getElementById("task-list");
const taskInput = document.getElementById("task");
const deadlineInput = document.getElementById("deadline");
const prioritySelect = document.getElementById("priority");
const taskTypeSelect = document.getElementById("task-type");


const displayTasks = async () => {
  const response = await fetch(API_URL);
  const tasks = await response.json();

  taskListOl.innerHTML = "";

  tasks.forEach((todo, index) => {
    const li = document.createElement("li");
    li.innerText = 
      `Task: ${todo.task}\n` +
      `Priority: ${todo.priority}\n` +
      `Type: ${todo.task_type}\n` +
      `Deadline: ${todo.deadline}\n`;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteTask(index);

    li.appendChild(deleteBtn);
    taskListOl.appendChild(li);
  });
};

const addTask = async () => {
  const taskValue = taskInput.value.trim();
  if (taskValue === "") {
    alert("Please Enter a Task");
    return;
  }

  const todoData = {
    task: taskValue,
    priority: prioritySelect.value,
    task_type: taskTypeSelect.value,
    deadline: deadlineInput.value || "No deadline"
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todoData)
  });

  taskInput.value = "";
  displayTasks();
};

const deleteTask = async (index) => {
  await fetch(`${API_URL}/${index}`, {
    method: "DELETE"
  });
  displayTasksTasks();
};

const clearTasks = async () => {
  await fetch(API_URL, { method: "DELETE" });
  displayTasks();
};

addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearTasks);
window.onload = displayTasks;