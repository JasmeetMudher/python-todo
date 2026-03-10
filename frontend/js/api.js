export default class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getTasks(userId) {
    const res = await fetch(`${this.baseURL}/${userId}`);
    return res.json();
  }

  async addTask(task) {
    const res = await fetch(this.baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to add task");
  }

  async deleteTask(taskId) {
    const res = await fetch(`${this.baseURL}/${taskId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete task");
  }

  async clearTasks(userId) {
    const res = await fetch(`${this.baseURL}/user/${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to clear tasks");
  }
}
