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
          text-align: ;
          margin-bottom: 10px;
        }

        .input-section {
          margin-bottom: 20px;
        }

        .list-section {
          padding-left: 15px;
        }

        input, select, button {
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

        #logout-btn {
          width: auto;
          padding: 5px 15px;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        .clear-btn {
          background: var(--btn-color, #4c8baf);
        }

        footer {
          text-align: center;
          font-size: 0.8rem;
          margin-top: 10px;
        }

        ol {
          list-style-position: inside;
        }

        li {
          background: var(--task-bg, #faf3c0);
          padding: 8px;
          margin-bottom: 6px;
          border-radius: 10px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        li.overdue {
          background-color: #ffcccc;
        }

        li span {
          flex: 1;
        }

        li input[type="checkbox"] {
          transform: scale(1.5);
          width: auto;
        }

        li button {
          width: auto;
          padding: 5px 10px;
          font-size: 0.9rem;
          margin-bottom: 0;
        }

        li button.delete-btn {
          background-color: red;
        }
      </style>
      <header class="app-header">
        <h1>My Todo App</h1>
        <button id="logout-btn">Logout</button>
      </header>

      <section class="input-section">
        <input placeholder="Enter a Task" id="task" />

        <p>Select Priority</p>
        <select id="priority">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <p>Select Task type:</p>
        <select id="task-type">
          <option>Personal</option>
          <option>School</option>
          <option>Work</option></select><br />

        <p>Select Deadline:</p>
        <input type="date" id="deadline" />

        <button id="add-btn">Add</button>
      </section>

      <section class="list-section">
        <p>Your Tasks:</p>
        <ol id="task-list"></ol>
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
    const addBtn = this.shadowRoot.getElementById("add-btn");

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

    addBtn.addEventListener("click", () => this.handleAdd());
  }

  handleAdd() {
    const task = this.shadowRoot.getElementById("task").value.trim();
    const priority = this.shadowRoot.getElementById("priority").value;
    const taskType = this.shadowRoot.getElementById("task-type").value;
    const deadline = this.shadowRoot.getElementById("deadline").value || null;

    if (!task) {
      alert("Enter a task");
      return;
    }

    this.dispatchEvent(
      new CustomEvent("add-task", {
        detail: { task, priority, taskType, deadline },
        bubbles: true,
        composed: true,
      }),
    );

    this.shadowRoot.getElementById("task").value = "";
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
