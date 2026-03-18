import Task from "./task.js";

export default class UI {
  constructor(api, user) {
    this.api = api;
    this.user = user;

    this.loginForm = document.getElementById("login-form");
    this.todoApp = document.getElementById("todo-app");

    this.init();
  }

  init() {
    this.loginForm.addEventListener("login", (e) => this.handleLogin(e.detail));
    this.loginForm.addEventListener("register", (e) =>
      this.handleRegister(e.detail),
    );
    this.todoApp.addEventListener("logout", () => this.handleLogout());
    this.todoApp.addEventListener("clear-all", () => this.clearTasks());
    this.todoApp.addEventListener("add-task", (e) => this.addTask(e.detail));

    if (this.user.isLoggedIn()) {
      this.loginForm.style.display = "none";
      this.todoApp.show();
      this.displayTasks();
    }
  }

  async displayTasks() {
    const tasks = await this.api.getTasks();
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    tasks.sort(
      (a, b) =>
        priorityOrder[a.priority.toLowerCase()] -
        priorityOrder[b.priority.toLowerCase()],
    );

    const taskList = this.todoApp.getTaskList();
    taskList.innerHTML = "";

    tasks.forEach((todo) => {
      const li = document.createElement("li");
      const today = new Date();

      if (todo.deadline && new Date(todo.deadline) < today && !todo.completed) {
        li.classList.add("overdue");
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

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", async () => {
        todo.completed = checkbox.checked;
        await this.api.updateTask(todo.id, todo);
        this.displayTasks();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", async () => {
        await this.api.deleteTask(todo.id);
        this.displayTasks();
      });

      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.addEventListener("click", async () => {
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
      });

      li.appendChild(checkbox);
      li.appendChild(deleteBtn);
      li.appendChild(editBtn);

      taskList.appendChild(li);
    });
  }

  async addTask({ task, priority, taskType, deadline }) {
    const taskObj = new Task(null, task, priority, taskType, deadline);

    await this.api.addTask(taskObj.toAPI());
    this.displayTasks();
  }

  async clearTasks() {
    await this.api.clearTasks();
    this.displayTasks();
  }

  async handleLogin({ username, password }) {
    if (!username || !password) return alert("Enter credentials");

    try {
      const userData = await this.api.login(username, password);
      this.user.setUser(userData.id, userData.username);

      this.loginForm.style.display = "none";
      this.todoApp.show();

      this.displayTasks();
    } catch (err) {
      alert(err.message);
    }
  }

  async handleRegister({ username, password }) {
    if (!username || !password) return alert("Enter credentials");

    try {
      const userData = await this.api.register(username, password);
      alert("Registration successful! You can now login.");
    } catch (err) {
      alert(err.message);
    }
  }

  async handleLogout() {
    await this.user.logout(this.api);
    this.loginForm.style.display = "block";
    this.loginForm.clear();
    this.todoApp.hide();
  }
}
