const API_URL = "http://127.0.0.1:8000/tasks";

const addBtn = document.getElementById("add-btn");
const clearAllBtn = document.getElementById("clear-btn");
const taskListOl = document.getElementById("task-list");
const taskInput = document.getElementById("task");
const deadlineInput = document.getElementById("deadline");
const prioritySelect = document.getElementById("priority");
const taskTypeSelect = document.getElementById("task-type");

const USER_ID = "1";

const displayTasks = async () => {
  const response = await fetch(`${API_URL}/${USER_ID}`);
  const tasks = await response.json();

  taskListOl.innerHTML = "";

  tasks.forEach((todo) => {
    const li = document.createElement("li");

    li.innerText =
      `Task: ${todo.task}\n` +
      `Priority: ${todo.priority}\n` +
      `Type: ${todo.task_type}\n` +
      `Deadline: ${todo.deadline || "None"}\n`;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.onclick = () => deleteTask(todo.id);

    li.appendChild(deleteBtn);
    taskListOl.appendChild(li);
  });
};

const addTask = async () => {
  const taskValue = taskInput.value.trim();
  if (!taskValue) return alert("Please Enter a Task");

  const todoData = {
    user_id: USER_ID,
    task: taskValue,
    priority: prioritySelect.value,
    task_type: taskTypeSelect.value,
    deadline: deadlineInput.value || null,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todoData),
  });

  if (response.ok) {
    taskInput.value = "";
    displayTasks();
  } else {
    const error = await response.json();
    alert(`Error: ${error.detail}`);
  }
};

const deleteTask = async (taskId) => {
  await fetch(`${API_URL}/${taskId}`, {
    method: "DELETE",
  });
    if (response.ok) {
    displayTasks();
  } else {
    const error = await response.json();
    alert(`Error: ${error.detail}`);
  }
};

const clearTasks = async () => {
  const response = await fetch(`${API_URL}/user/${USER_ID}`, {
    method: "DELETE",
  });
  if (response.ok) {
    displayTasks();
  } else {
    const error = await response.json();
    alert(`Error: ${error.detail}`);
  }
};

addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearTasks);
displayTasks();
