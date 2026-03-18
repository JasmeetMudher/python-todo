export default class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        :host {
          display: block;
          background: var(--card-color, #ffffff);
          width: 550px;
          padding: 20px;
          border-radius: 6px;
        }

        h2 {
          text-align: center;
          margin-bottom: 10px;
        }

        input, button {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border-radius: 5px;
          font-size: 1rem;
        }

        button {
          border: none;
          background: var(--btn-color, #4c8baf);
          color: white;
          cursor: pointer;
          border-radius: 10px;
        }

        button:hover {
          opacity: 0.9;
          transition: 0.2s ease;
        }
      </style>
      <h2>Login</h2>
      <input id="username" placeholder="Username" />
      <input id="password" placeholder="Password" type="password" />
      <button id="login-btn">Login</button>
      <button id="register-btn">Register</button>
    `;
  }

  connectedCallback() {
    const loginBtn = this.shadowRoot.getElementById("login-btn");
    const registerBtn = this.shadowRoot.getElementById("register-btn");

    loginBtn.addEventListener("click", () => this.handleLogin());
    registerBtn.addEventListener("click", () => this.handleRegister());
  }

  handleLogin() {
    const username = this.shadowRoot.getElementById("username").value.trim();
    const password = this.shadowRoot.getElementById("password").value.trim();
    this.dispatchEvent(
      new CustomEvent("login", {
        detail: { username, password },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleRegister() {
    const username = this.shadowRoot.getElementById("username").value.trim();
    const password = this.shadowRoot.getElementById("password").value.trim();
    this.dispatchEvent(
      new CustomEvent("register", {
        detail: { username, password },
        bubbles: true,
        composed: true,
      }),
    );
  }

  clear() {
    this.shadowRoot.getElementById("username").value = "";
    this.shadowRoot.getElementById("password").value = "";
  }
}

customElements.define("login-form", LoginForm);
