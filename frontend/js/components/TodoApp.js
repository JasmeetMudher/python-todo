export default class TodoApp extends HTMLElement {
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
          display: none;
          background: var(--card-color, #ffffff);
          width: 550px;
          padding: 20px;
          border-radius: 6px;
        }

        :host(.visible) {
          display: block;
        }

        .app-header {
          text-align: center;
          margin-bottom: 10px;
        }

        .input-section {
          margin-bottom: 20px;
        }

        .list-section {
          padding-left: 15px;
        }

        #logout-btn {
          width: auto;
          padding: 5px 15px;
          font-size: 0.9rem;
          margin-top: 10px;
          border: none;
          background: var(--btn-color, #4c8baf);
          color: white;
          cursor: pointer;
          border-radius: 10px;
        }

        #logout-btn:hover {
          opacity: 0.9;
          transition: 0.2s ease;
        }

        .clear-btn {
          width: 100%;
          padding: 8px;
          margin-top: 10px;
          border: none;
          background: var(--btn-color, #4c8baf);
          color: white;
          cursor: pointer;
          border-radius: 10px;
          font-size: 1rem;
        }

        .clear-btn:hover {
          opacity: 0.9;
          transition: 0.2s ease;
        }

        footer {
          text-align: center;
          font-size: 0.8rem;
          margin-top: 10px;
        }
      </style>
      <header class="app-header">
        <h1>My Todo App</h1>
        <button id="logout-btn">Logout</button>
      </header>

      <section class="input-section">
        <task-input></task-input>
      </section>

      <section class="list-section">
        <task-list id="task-list"></task-list>
      </section>

      <button id="clear-btn" class="clear-btn">Clear All</button>

      <footer>
        <p>Made by Jasmeet</p>
      </footer>
    `;
  }

  connectedCallback() {
    const logoutBtn = this.shadowRoot.getElementById("logout-btn");
    const clearBtn = this.shadowRoot.getElementById("clear-btn");

    logoutBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("logout", { bubbles: true, composed: true }),
      );
    });

    clearBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("clear-all", { bubbles: true, composed: true }),
      );
    });
  }

  getTaskList() {
    return this.shadowRoot.getElementById("task-list");
  }

  show() {
    this.classList.add("visible");
  }

  hide() {
    this.classList.remove("visible");
  }
}

customElements.define("todo-app", TodoApp);
