type Todo = Map<number, { id: number; title: string; completed: boolean }>;

class TodoList {
  localId: string;
  todos?: Todo;
  constructor(
    localId: string,
    todos?: Map<number, { id: number; title: string; completed: boolean }>,
  ) {
    if (todos) {
      this.todos = todos;
    } else {
      this.todos = new Map();
    }
    this.localId = localId;
  }

  load() {
    const JSONResult = localStorage.getItem(this.localId);

    if (typeof JSONResult === "string") {
      try {
        const todos = JSON.parse(JSONResult);
        this.todos = new Map([...(this.todos as Todo), ...todos]);
      } catch (error) {
        console.log(error);
      }
    }
    this.render();
  }

  save() {
    localStorage.setItem(
      this.localId,
      JSON.stringify([...(this.todos as Todo)]),
    );
  }

  addTodo(title: string) {
    const id = Math.random() * (this.todos?.size! * 5);

    this.todos!.set(id, { id, title, completed: false });
    this.save();
    this.render();
  }

  removeTodo(id: number) {
    this.todos!.delete(id);
    this.save();
    this.render();
  }

  toggleTodo(id: number) {
    const todo = this.todos!.get(id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    this.save();

    this.render();
  }

  renderHtml(todo: { id: number; title: string; completed: boolean }) {
    const parent = document.getElementById("todo-list")!;

    const HTMLElement = document.createElement("li");
    HTMLElement.classList.add("todo");

    const Title = document.createElement("p");
    Title.innerText = todo.title;
    HTMLElement.appendChild(Title);

    const Checkbox = document.createElement("input");
    Checkbox.checked = todo.completed;
    Checkbox.type = "checkbox";
    Checkbox.addEventListener("change", () => {
      this.toggleTodo(todo.id);
      this.save();
    });
    HTMLElement.appendChild(Checkbox);

    const RemoveButton = document.createElement("button");
    RemoveButton.innerText = `Delete ${todo.id}`;
    RemoveButton.addEventListener("click", () => {
      this.removeTodo(todo.id);
    });
    HTMLElement.appendChild(RemoveButton);

    parent.appendChild(HTMLElement);
  }

  render() {
    const parent = document.getElementById("todo-list")!;
    parent.innerHTML = "";
    this.todos!.forEach((todo) => {
      this.renderHtml(todo);
    });
  }

  init() {
    this.load();
    this.save();
  }
}

const Todos: Todo = new Map([
  [1, { id: 1, title: "Learn TypeScript", completed: true }],
]);

const Todo = new TodoList("localStorageExample2", Todos);

Todo.init();

const app = document.getElementById("app")!;
const button = document.createElement("button");
button.innerText = "Add Todo";
button.addEventListener("click", () => {
  Todo.addTodo("New Todo");
});
app.appendChild(button);

export {};
