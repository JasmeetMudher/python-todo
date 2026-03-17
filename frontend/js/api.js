export default class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getTasks(userId) {
    const res = await fetch(`${this.baseURL}/tasks/${userId}`);
    return res.json();
  }

  async addTask(task) {
    const res = await fetch(`${this.baseURL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to add task");
  }

  async deleteTask(taskId) {
    const res = await fetch(`${this.baseURL}/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete task");
  }

  async clearTasks(userId) {
    const res = await fetch(`${this.baseURL}/tasks/user/${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to clear tasks");
  }


async updateTask(taskId, taskData) {
  const res = await fetch(`${this.baseURL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData)
  });

  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

async register(username, password) {
  const res = await fetch(`${this.baseURL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

async login(username, password) {
  const res = await fetch(`${this.baseURL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}
}
