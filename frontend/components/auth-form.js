class AuthForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        h2 {
          margin-top: 0;
        }
        .form-input {
          display: block;
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .form-btn {
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          width: 48%;
        }
        .login-btn {
          background: #007bff;
          color: white;
        }
        .register-btn {
          background: #eee;
          color: #333;
          float: right;
        }
      </style>
      <h2>Login / Register</h2>
      <input id="username" class="form-input" placeholder="Username"/>
      <input id="password" class="form-input" type="password" placeholder="Password"/>
      <button id="login-btn" class="form-btn login-btn">Login</button>
      <button id="register-btn" class="form-btn register-btn">Register</button>
      <div style="clear:both;"></div>
    `;

    const usernameInput = this.querySelector("#username");
    const passwordInput = this.querySelector("#password");

    this.querySelector("#login-btn").onclick = () => {
      const loginEvent = new CustomEvent("login", {
        detail: {
          username: usernameInput.value,
          password: passwordInput.value
        },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(loginEvent);
    };

    this.querySelector("#register-btn").onclick = () => {
      const registerEvent = new CustomEvent("register", {
        detail: {
          username: usernameInput.value,
          password: passwordInput.value
        },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(registerEvent);
    };
  }
}

customElements.define("auth-form", AuthForm);
