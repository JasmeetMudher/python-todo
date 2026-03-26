class TodoList extends HTMLElement {
  set todos(value) {
    this._todos = value;
    this.render();
  }

  render() {
    this.innerHTML = "";

    this._todos.forEach(todo => {
      const item = document.createElement("todo-item");
      item.todo = todo;
      this.appendChild(item);
    });
  }
}

customElements.define("todo-list", TodoList);
