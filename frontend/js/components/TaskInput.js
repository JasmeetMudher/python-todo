export default class TaskInput extends HTMLElement {
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
      </style>
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
    `;
  }

  connectedCallback() {
    const addBtn = this.shadowRoot.getElementById("add-btn");
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
}

customElements.define("task-input", TaskInput);
