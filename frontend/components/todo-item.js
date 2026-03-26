class TodoItem extends HTMLElement {
  set todo(data) {
    this._todo = data;
    this.render();
  }

  render() {
    const id = this._todo.id;
    const task = this._todo.task || "";
    const type = this._todo.task_type || "general";
    const priority = this._todo.priority || "medium";
    const deadline = this._todo.deadline;
    const completed = this._todo.completed;

    const safeTask = task.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeType = type.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const deadlineString = deadline
      ? new Date(deadline).toLocaleString()
      : "None";

    this.innerHTML = `
      <style>
        .todo-item {
          border: 1px solid #ccc;
          padding: 10px;
          margin: 5px 0;
          border-radius: 8px;
        }
        .task-text {
          text-decoration: ${completed ? "line-through" : "none"};
        }
        .details {
          font-size: 12px;
          margin-top: 5px;
        }
        .delete-btn {
          margin-top: 5px;
        }
      </style>
      <div class="todo-item">
        <input type="checkbox" ${completed ? "checked" : ""} />
        <strong class="task-text">${safeTask}</strong>
        <div class="details">
          <span>Type: ${safeType}</span><br/>
          <span>Priority: ${priority}</span><br/>
          <span>Deadline: ${deadlineString}</span>
        </div>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    this.querySelector("input").onchange = (e) => {
      const toggleEvent = new CustomEvent("toggle-todo", {
        detail: { id: id, completed: e.target.checked },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(toggleEvent);
    };

    this.querySelector("button").onclick = () => {
      const deleteEvent = new CustomEvent("delete-todo", {
        detail: id,
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(deleteEvent);
    };
  }
}

customElements.define("todo-item", TodoItem);
