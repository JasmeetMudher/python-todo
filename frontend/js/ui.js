import Task from "./task.js";

export default class UI {
  constructor(api, user) {
    this.api = api;
    this.user = user;

    this.taskInput = document.getElementById("task");
    this.deadlineInput = document.getElementById("deadline");
    this.prioritySelect = document.getElementById("priority");
    this.taskTypeSelect = document.getElementById("task-type");

    this.taskList = document.getElementById("task-list");

    this.addBtn = document.getElementById("add-btn");
    this.clearBtn = document.getElementById("clear-btn");

    this.init();
  }

  init() {
    this.addBtn.addEventListener("click", () => this.addTask());
    this.clearBtn.addEventListener("click", () => this.clearTasks());

    this.displayTasks();
  }

  async displayTasks() {
    const tasks = await this.api.getTasks(this.user.getId());
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    this.taskList.innerHTML = "";

    tasks.forEach((todo) => {
      const li = document.createElement("li");
      const today = new Date();

      if (todo.deadline && new Date(todo.deadline) < today && !todo.completed) {
        li.style.backgroundColor = "#ffcccc";
      }

      const text = document.createElement("span");

      text.innerHTML = `
    Task: ${todo.task}<br>
    Priority: ${todo.priority}<br>
    Type: ${todo.task_type}<br>
    Deadline: ${todo.deadline || "None"}<br>
  `;

      if (todo.completed) {
        text.style.textDecoration = "line-through";
      }

      li.appendChild(text);

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.className = "delete-btn";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;

      checkbox.addEventListener("change", () => this.toggleTask(todo.id));

      li.appendChild(checkbox);

      deleteBtn.addEventListener("click", () => this.deleteTask(todo.id));

      li.appendChild(deleteBtn);

      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.className = "edit-btn";

      editBtn.addEventListener("click", () => this.editTask(todo));

      li.appendChild(editBtn);

      this.taskList.appendChild(li);
    });
  }

  async addTask() {
    const taskValue = this.taskInput.value.trim();

    if (!taskValue) {
      alert("Enter a task");
      return;
    }

    const task = new Task(
      this.user.getId(),
      taskValue,
      this.prioritySelect.value,
      this.taskTypeSelect.value,
      this.deadlineInput.value || null,
    );

    await this.api.addTask(task.toAPI());
    this.taskInput.value = "";
    this.displayTasks();
  }

  async deleteTask(taskId) {
    await this.api.deleteTask(taskId);
    this.displayTasks();
  }

  async clearTasks() {
    await this.api.clearTasks(this.user.getId());
    this.displayTasks();
  }

  async toggleTask(taskId) {
    await this.api.toggleTask(taskId);
    this.displayTasks();
  }

  async editTask(todo) {
    const newTask = prompt("Edit task:", todo.task);
    if (!newTask) return;
    todo.task = newTask;
    await this.api.updateTask(todo.id, {
      task: todo.task,
      priority: todo.priority,
      task_type: todo.task_type,
      deadline: todo.deadline,
      completed: todo.completed,
    });

    this.displayTasks();
  }
}
