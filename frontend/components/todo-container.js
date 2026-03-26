import { getTodos, addTodo, deleteTodo, updateTodo } from "../services/api.js";

class TodoContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    this.render();
  }

  async handleAdd(newTodoInfo) {
    await addTodo(newTodoInfo);
    this.render();
  }

  async handleDelete(idToDelete) {
    await deleteTodo(idToDelete);
    this.render();
  }

  async handleToggle(idToToggle, isCompletedNow) {
    await updateTodo(idToToggle, { completed: isCompletedNow });
    this.render();
  }

  async render() {
    const todos = await getTodos();

    this.shadowRoot.innerHTML = `
      <todo-input></todo-input>
      <todo-list></todo-list>
    `;

    const inputComponent = this.shadowRoot.querySelector("todo-input");
    inputComponent.addEventListener("add-todo", (e) => {
      this.handleAdd(e.detail);
    });

    const listComponent = this.shadowRoot.querySelector("todo-list");
    listComponent.todos = todos;
    listComponent.addEventListener("delete-todo", (e) => {
      this.handleDelete(e.detail);
    });
    listComponent.addEventListener("toggle-todo", (e) => {
      this.handleToggle(e.detail.id, e.detail.completed);
    });
  }
}

customElements.define("todo-container", TodoContainer);
