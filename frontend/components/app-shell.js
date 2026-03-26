import { login, register, logout, getCurrentUser } from "../services/api.js";

class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.user = null;
  }

  async connectedCallback() {
    this.user = await getCurrentUser();
    this.render();
  }

  async handleLogin(username, password) {
    try {
      this.user = await login(username, password);
      this.render();
    } catch (err) {
      alert("Login failed");
    }
  }

  async handleRegister(username, password) {
    try {
      await register(username, password);
      alert("Registered! Now login.");
    } catch (err) {
      alert("Registration failed");
    }
  }

  async handleLogout() {
    await logout();
    this.user = null;
    this.render();
  }

  render() {
    if (this.user) {
      this.shadowRoot.innerHTML = `
        <style>
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .logout-btn {
            padding: 8px 16px;
          }
        </style>
        <div>
          <div class="header">
            <h1>My Todo List</h1>
            <button id="logout-btn" class="logout-btn">Logout</button>
          </div>
          <todo-container></todo-container>
        </div>
      `;

      this.shadowRoot.querySelector("#logout-btn").onclick = () => this.handleLogout();
    } else {
      this.shadowRoot.innerHTML = `<auth-form></auth-form>`;

      const authForm = this.shadowRoot.querySelector("auth-form");
      authForm.addEventListener("login", (e) => {
        this.handleLogin(e.detail.username, e.detail.password);
      });
      authForm.addEventListener("register", (e) => {
        this.handleRegister(e.detail.username, e.detail.password);
      });
    }
  }
}

customElements.define("app-shell", AppShell);
