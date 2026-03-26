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

    this.todoApp.addEventListener("task-toggle", (e) => this.toggleTask(e.detail));
    this.todoApp.addEventListener("task-delete", (e) => this.deleteTask(e.detail));
    this.todoApp.addEventListener("task-edit", (e) => this.editTask(e.detail));

    if (this.user.isLoggedIn()) {
      this.loginForm.style.display = "none";
      this.todoApp.show();
      this.displayTasks();
    }
  }

  async toggleTask({ taskId, task }) {
    await this.api.updateTask(taskId, task);
    this.displayTasks();
  }

  async deleteTask({ taskId }) {
    await this.api.deleteTask(taskId);
    this.displayTasks();
  }

  async editTask({ taskId, task }) {
    await this.api.updateTask(taskId, task);
    this.displayTasks();
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
    taskList.clear();

    tasks.forEach((todo) => {
      const taskItem = document.createElement("task-item");
      taskItem.taskData = todo;
      taskList.addTaskItem(taskItem);
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
