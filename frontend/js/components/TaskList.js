export default class TaskList extends HTMLElement {
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

        ol {
          list-style-position: inside;
        }
      </style>
      <p>Your Tasks:</p>
      <ol id="task-list"></ol>
    `;
  }

  clear() {
    const list = this.shadowRoot.getElementById("task-list");
    list.innerHTML = "";
  }

  addTaskItem(taskItem) {
    const list = this.shadowRoot.getElementById("task-list");
    list.appendChild(taskItem);
  }
}

customElements.define("task-list", TaskList);
