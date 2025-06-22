// js/todo.js
document.addEventListener("DOMContentLoaded", function () {
    // Data
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    let filter = "all";

    // Helpers
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        const list = document.getElementById("todo-list");
        list.innerHTML = "";
        let filtered = tasks;
        if (filter === "pending") filtered = tasks.filter(t => !t.completed);
        if (filter === "completed") filtered = tasks.filter(t => t.completed);
        if (!filtered.length) {
            document.getElementById("empty-list").textContent = "No tasks to show.";
            return;
        }
        document.getElementById("empty-list").textContent = "";
        filtered.forEach((task) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex align-items-center justify-content-between";
            li.innerHTML = `
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <input type="checkbox" class="form-check-input me-2" ${task.completed ? "checked" : ""} data-idx="${task.id}">
                    <span class="${task.completed ? "text-decoration-line-through text-muted" : ""}">
                        ${task.text}
                        ${(task.due || task.time) ? `
                            <small class="badge bg-light text-dark ms-2">
                                ${task.due ? `<i class="bi bi-calendar"></i> ${task.due}` : ""}
                                ${task.time ? `<span class="ms-2"><i class="bi bi-clock"></i> ${task.time}</span>` : ""}
                            </small>
                        ` : ""}
                        <span class="badge 
                            ${task.priority === "high" ? "bg-danger" : task.priority === "low" ? "bg-info text-dark" : "bg-secondary"}
                            ms-2">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                    </span>
                </div>
                <button class="btn btn-sm btn-danger delete-task" data-idx="${task.id}">&times;</button>
            `;
            list.appendChild(li);
        });
    }

    function addTask(task) {
        tasks.push(task);
        saveTasks();
        renderTasks();
    }

    // Events
    document.getElementById("todo-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const input = document.getElementById("todo-input");
        const priority = document.getElementById("todo-priority").value;
        const due = document.getElementById("todo-due").value;
        const time = document.getElementById("todo-time").value;
        const task = {
            id: Date.now(),
            text: input.value.trim(),
            completed: false,
            priority,
            due,
            time // new property
        };
        addTask(task);
        input.value = "";
        document.getElementById("todo-due").value = "";
        document.getElementById("todo-time").value = "";
        document.getElementById("todo-priority").value = "normal";
    });

    document.getElementById("todo-list").addEventListener("change", function (e) {
        if (e.target.matches("input[type=checkbox]")) {
            const id = Number(e.target.getAttribute("data-idx"));
            tasks = tasks.map(t => t.id === id ? { ...t, completed: e.target.checked } : t);
            saveTasks();
            renderTasks();
        }
    });

    document.getElementById("todo-list").addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-task")) {
            const id = Number(e.target.getAttribute("data-idx"));
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }
    });

    document.querySelectorAll("[data-filter]").forEach(btn => {
        btn.addEventListener("click", function () {
            filter = this.getAttribute("data-filter");
            document.querySelectorAll("[data-filter]").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            renderTasks();
        });
    });

    // Initial render
    renderTasks();
});