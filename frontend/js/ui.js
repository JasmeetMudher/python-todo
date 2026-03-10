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

    this.taskList.innerHTML = "";

    tasks.forEach((todo) => {
      const li = document.createElement("li");

      li.innerHTML = `
        Task: ${todo.task}<br>
        Priority: ${todo.priority}<br>
        Type: ${todo.task_type}<br>
        Deadline: ${todo.deadline || "None"}<br>
      `;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.className = "delete-btn";

      deleteBtn.addEventListener("click", () =>
        this.deleteTask(todo.id)
      );

      li.appendChild(deleteBtn);
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
      this.deadlineInput.value || null
    );

    await this.api.addTask(task);

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
}