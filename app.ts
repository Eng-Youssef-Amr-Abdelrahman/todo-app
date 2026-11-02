interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

class TodoApp {
  private todos: Todo[] = [];
  private filter: FilterType = "all";

  private todoInput: HTMLInputElement;
  private addBtn: HTMLButtonElement;
  private todoList: HTMLUListElement;
  private itemsCount: HTMLSpanElement;
  private filterAllBtn: HTMLButtonElement;
  private filterActiveBtn: HTMLButtonElement;
  private filterCompletedBtn: HTMLButtonElement;
  private clearCompletedBtn: HTMLButtonElement;
  private clearAllBtn: HTMLButtonElement;

  constructor() {
    this.todoInput = document.getElementById("todoInput") as HTMLInputElement;
    this.addBtn = document.getElementById("addBtn") as HTMLButtonElement;
    this.todoList = document.getElementById("todoList") as HTMLUListElement;
    this.itemsCount = document.getElementById("itemsCount") as HTMLSpanElement;
    this.filterAllBtn = document.getElementById("filterAll") as HTMLButtonElement;
    this.filterActiveBtn = document.getElementById("filterActive") as HTMLButtonElement;
    this.filterCompletedBtn = document.getElementById("filterCompleted") as HTMLButtonElement;
    this.clearCompletedBtn = document.getElementById("clearCompletedBtn") as HTMLButtonElement;
    this.clearAllBtn = document.getElementById("clearAllBtn") as HTMLButtonElement;

    this.init();
  }

  private init(): void {
    this.addBtn.addEventListener("click", () => this.addTodo());
    this.todoInput.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "Enter") this.addTodo();
    });

    this.filterAllBtn.addEventListener("click", () => this.setFilter("all"));
    this.filterActiveBtn.addEventListener("click", () => this.setFilter("active"));
    this.filterCompletedBtn.addEventListener("click", () => this.setFilter("completed"));

    this.clearCompletedBtn.addEventListener("click", () => this.clearCompleted());
    this.clearAllBtn.addEventListener("click", () => this.clearAll());

    this.render();
  }

  private addTodo(): void {
    const text = this.todoInput.value.trim();
    if (text === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };

    this.todos.push(newTodo);
    this.todoInput.value = "";
    this.render();
  }

  private toggleTodo(id: number): void {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.render();
  }

  private deleteTodo(id: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.render();
  }

  private editTodo(id: number, textSpan: HTMLSpanElement): void {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = todo.text;

    textSpan.replaceWith(input);
    input.focus();

    const save = () => {
      const newText = input.value.trim();
      if (newText !== "") {
        todo.text = newText;
      }
      this.render();
    };

    input.addEventListener("blur", save);
    input.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "Enter") save();
    });
  }

  private setFilter(filter: FilterType): void {
    this.filter = filter;
    this.filterAllBtn.classList.toggle("active", filter === "all");
    this.filterActiveBtn.classList.toggle("active", filter === "active");
    this.filterCompletedBtn.classList.toggle("active", filter === "completed");
    this.render();
  }

  private clearCompleted(): void {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.render();
  }

  private clearAll(): void {
    this.todos = [];
    this.render();
  }

  private render(): void {
    this.todoList.innerHTML = "";

    const filteredTodos = this.todos.filter((todo) => {
      if (this.filter === "active") return !todo.completed;
      if (this.filter === "completed") return todo.completed;
      return true;
    });

    filteredTodos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;

      const todoLeft = document.createElement("div");
      todoLeft.className = "todo-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => this.toggleTodo(todo.id));

      const textSpan = document.createElement("span");
      textSpan.className = "todo-text";
      textSpan.textContent = todo.text;
      textSpan.addEventListener("dblclick", () => this.editTodo(todo.id, textSpan));

      todoLeft.appendChild(checkbox);
      todoLeft.appendChild(textSpan);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = "&#128465;";
      deleteBtn.addEventListener("click", () => this.deleteTodo(todo.id));

      li.appendChild(todoLeft);
      li.appendChild(deleteBtn);

      this.todoList.appendChild(li);
    });

    const activeCount = this.todos.filter((todo) => !todo.completed).length;
    this.itemsCount.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} left`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TodoApp();
});
