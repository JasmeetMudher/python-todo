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
    document
      .getElementById("login-btn")
      .addEventListener("click", () => this.handleLogin());
    document
      .getElementById("register-btn")
      .addEventListener("click", () => this.handleRegister());

    if (this.user.isLoggedIn()) {
      document.getElementById("login-container").style.display = "none";
      document.getElementById("todo-container").style.display = "block";
      this.displayTasks();
    }

    this.displayTasks();
  }

  async displayTasks() {
    const tasks = await this.api.getTasks(this.user.getId());
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    tasks.sort(
      (a, b) =>
        priorityOrder[a.priority.toLowerCase()] -
        priorityOrder[b.priority.toLowerCase()],
    );

    this.taskList.innerHTML = "";

    tasks.forEach((todo) => {
      const li = document.createElement("li");
      const today = new Date();

      if (todo.deadline && new Date(todo.deadline) < today && !todo.completed) {
        li.classList.add("overdue");
      } else {
        li.classList.remove("overdue");
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

      checkbox.addEventListener("change", async () => {
        todo.completed = checkbox.checked;

        await this.api.updateTask(todo.id, todo);

        this.displayTasks();
      });

      li.appendChild(checkbox);

      deleteBtn.addEventListener("click", () => this.deleteTask(todo.id));

      li.appendChild(deleteBtn);

      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.className = "edit-btn";

      editBtn.addEventListener("click", () => this.editTask(todo));

      li.appendChild(editBtn);

      this.taskList.appendChild(li);

      document.getElementById("logout-btn").addEventListener("click", () => {
        this.user.logout();
        document.getElementById("login-container").style.display = "block";
        document.getElementById("todo-container").style.display = "none";
      });
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

  async handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) return alert("Enter credentials");

    try {
      const userData = await this.api.login(username, password);
      this.user.setUser(userData.id, userData.username);

      document.getElementById("login-container").style.display = "none";
      document.getElementById("todo-container").style.display = "block";

      this.displayTasks();
    } catch (err) {
      alert(err.message);
    }
  }

  async handleRegister() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) return alert("Enter credentials");

    try {
      const userData = await this.api.register(username, password);
      alert("Registration successful! You can now login.");
    } catch (err) {
      alert(err.message);
    }
  }
}
