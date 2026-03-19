export default class TaskItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._taskData = null;
  }

  set taskData(data) {
    this._taskData = data;
    this.render();
  }

  get taskData() {
    return this._taskData;
  }

  render() {
    if (!this._taskData) return;

    const today = new Date();
    const isOverdue =
      this._taskData.deadline &&
      new Date(this._taskData.deadline) < today &&
      !this._taskData.completed;
    const completedStyle = this._taskData.completed
      ? "text-decoration: line-through;"
      : "";

    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        :host {
          display: flex;
          align-items: center;
          gap: 10px;
          background: ${isOverdue ? "var(--overdue-bg, #ffcccc)" : "var(--task-bg, #faf3c0)"};
          padding: 8px;
          margin-bottom: 6px;
          border-radius: 10px;
          font-size: 1rem;
        }

        .text {
          flex: 1;
          padding:10px;
        }

        .text span {
          ${completedStyle}
        }

        input[type="checkbox"] {
          transform: scale(1.5);
        }

        button {
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .delete-btn {
          background-color: red;
          color: white;
        }

        .edit-btn {
          background-color: var(--btn-color, #4c8baf);
          color: white;
        }
      </style>
      <span class="text">
        <span>
          Task: ${this._taskData.task}<br>
          Priority: ${this._taskData.priority}<br>
          Type: ${this._taskData.task_type}<br>
          Deadline: ${this._taskData.deadline || "None"}<br>
        </span>
      </span>
      <input type="checkbox" id="checkbox" ${this._taskData.completed ? "checked" : ""}>
      <button class="delete-btn" id="delete-btn">Delete</button>
      <button class="edit-btn" id="edit-btn">Edit</button>
    `;

    this.attachListeners();
  }

  attachListeners() {
    const checkbox = this.shadowRoot.getElementById("checkbox");
    const deleteBtn = this.shadowRoot.getElementById("delete-btn");
    const editBtn = this.shadowRoot.getElementById("edit-btn");

    checkbox.addEventListener("change", () => {
      this._taskData.completed = checkbox.checked;
      this.dispatchEvent(
        new CustomEvent("task-toggle", {
          detail: { taskId: this._taskData.id, task: this._taskData },
          bubbles: true,
          composed: true,
        }),
      );
    });

    deleteBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("task-delete", {
          detail: { taskId: this._taskData.id },
          bubbles: true,
          composed: true,
        }),
      );
    });

    editBtn.addEventListener("click", () => {
      const newTask = prompt("Edit task:", this._taskData.task);
      if (newTask) {
        this._taskData.task = newTask;
        this.dispatchEvent(
          new CustomEvent("task-edit", {
            detail: { taskId: this._taskData.id, task: this._taskData },
            bubbles: true,
            composed: true,
          }),
        );
      }
    });
  }
}

customElements.define("task-item", TaskItem);
