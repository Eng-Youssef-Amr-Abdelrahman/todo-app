class TodoApp {
    constructor() {
        this.todos = [];
        this.filter = "all";
        this.todoInput = document.getElementById("todoInput");
        this.addBtn = document.getElementById("addBtn");
        this.todoList = document.getElementById("todoList");
        this.itemsCount = document.getElementById("itemsCount");
        this.filterAllBtn = document.getElementById("filterAll");
        this.filterActiveBtn = document.getElementById("filterActive");
        this.filterCompletedBtn = document.getElementById("filterCompleted");
        this.clearCompletedBtn = document.getElementById("clearCompletedBtn");
        this.clearAllBtn = document.getElementById("clearAllBtn");
        this.init();
    }
    init() {
        this.addBtn.addEventListener("click", () => this.addTodo());
        this.todoInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter")
                this.addTodo();
        });
        this.filterAllBtn.addEventListener("click", () => this.setFilter("all"));
        this.filterActiveBtn.addEventListener("click", () => this.setFilter("active"));
        this.filterCompletedBtn.addEventListener("click", () => this.setFilter("completed"));
        this.clearCompletedBtn.addEventListener("click", () => this.clearCompleted());
        this.clearAllBtn.addEventListener("click", () => this.clearAll());
        this.render();
    }
    addTodo() {
        const text = this.todoInput.value.trim();
        if (text === "")
            return;
        const newTodo = {
            id: Date.now(),
            text,
            completed: false,
        };
        this.todos.push(newTodo);
        this.todoInput.value = "";
        this.render();
    }
    toggleTodo(id) {
        this.todos = this.todos.map((todo) => todo.id === id ? Object.assign(Object.assign({}, todo), { completed: !todo.completed }) : todo);
        this.render();
    }
    deleteTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.render();
    }
    editTodo(id, textSpan) {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo)
            return;
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
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter")
                save();
        });
    }
    setFilter(filter) {
        this.filter = filter;
        this.filterAllBtn.classList.toggle("active", filter === "all");
        this.filterActiveBtn.classList.toggle("active", filter === "active");
        this.filterCompletedBtn.classList.toggle("active", filter === "completed");
        this.render();
    }
    clearCompleted() {
        this.todos = this.todos.filter((todo) => !todo.completed);
        this.render();
    }
    clearAll() {
        this.todos = [];
        this.render();
    }
    render() {
        this.todoList.innerHTML = "";
        const filteredTodos = this.todos.filter((todo) => {
            if (this.filter === "active")
                return !todo.completed;
            if (this.filter === "completed")
                return todo.completed;
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
