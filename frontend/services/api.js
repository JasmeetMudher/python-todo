const BASE_URL = "http://127.0.0.1:8000";

export async function getTodos() {
  const res = await fetch(`${BASE_URL}/tasks`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function addTodo(todo) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error("Failed to add task");
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete task");
}

export async function updateTodo(id, data) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error("Update failed", await res.text());
    return null;
  }
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(username, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Logout failed");
}

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/me`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}
