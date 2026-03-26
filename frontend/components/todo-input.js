class TodoInput extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }
        input, select, button {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .add-btn {
          background: #28a745;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: bold;
          padding: 10px 20px;
        }
        .task-input {
          flex-grow: 1;
          min-width: 200px;
        }
      </style>
      <div class="input-group">
        <input id="task" class="task-input" type="text" placeholder="What needs to be done?" />
        <select id="priority">
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
        <input id="type" type="text" placeholder="Task type (e.g. work)" />
        <input id="deadline" type="datetime-local" />
        <button id="add-btn" class="add-btn">Add</button>
      </div>
    `;

    const taskInput = this.querySelector("#task");
    const priorityInput = this.querySelector("#priority");
    const typeInput = this.querySelector("#type");
    const deadlineInput = this.querySelector("#deadline");

    this.querySelector("#add-btn").onclick = () => {
      const taskValue = taskInput.value.trim();

      if (taskValue === "") {
        alert("Please enter a task");
        return;
      }

      const newTodo = {
        task: taskValue,
        priority: priorityInput.value,
        task_type: typeInput.value || "general",
        deadline: deadlineInput.value || null,
        completed: false,
      };

      const addEvent = new CustomEvent("add-todo", {
        detail: newTodo,
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(addEvent);

      taskInput.value = "";
      priorityInput.value = "medium";
      typeInput.value = "";
      deadlineInput.value = "";
    };
  }
}

customElements.define("todo-input", TodoInput);
