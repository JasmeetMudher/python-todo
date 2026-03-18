export default class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getTasks() {
  const res = await fetch(`${this.baseURL}/tasks`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not logged in");
  }

  return res.json();
}

  async addTask(task) {
    const res = await fetch(`${this.baseURL}/tasks`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to add task");
  }

  async deleteTask(taskId) {
    const res = await fetch(`${this.baseURL}/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include", 
    });

    if (!res.ok) throw new Error("Failed to delete task");
  }

  async clearTasks() {
  const res = await fetch(`${this.baseURL}/tasks/user`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to clear tasks");
}

  async updateTask(taskId, taskData) {
    const res = await fetch(`${this.baseURL}/tasks/${taskId}`, {
      method: "PATCH",
      credentials: "include", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
  }

  async register(username, password) {
    const res = await fetch(`${this.baseURL}/register`, {
      method: "POST",
      credentials: "include", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  }

  async login(username, password) {
    const res = await fetch(`${this.baseURL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    return res.json();
  }
  async logout() {
    const res = await fetch(`${this.baseURL}/logout`, {
      method: "POST",
      credentials: "include", 
    });

    if (!res.ok) throw new Error("Logout failed");
    return res.json();
  }
}
