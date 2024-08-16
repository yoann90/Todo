import TasksService from "./tasks.service.js";
const tasks = [];
const taskService = TasksService(tasks);

const list = document.querySelector(".list");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

function handleTaskAction(id, action) {
  if (action === "create") {
    taskService.addTaskById(id);
    console.log(tasks);
  } else if (action === "edit") {
    const task = taskService.getTaskById(id);
    const div = document.getElementById(`name-tache-${id}`);
    const inputEl = document.getElementById(`input-${id}`);
    if (inputEl) {
      const newText = inputEl.value.trim();
      if (newText) {
        taskService.editTaskById(id, newText, task.done);
        div.innerHTML = renderTaskContent(id, newText, task.done);
      }
    } else {
      div.innerHTML = `<input id="input-${id}" value="${task.text}">`;
    }
    return;
  } else if (action === "remove") {
    document.getElementById(`li-${id}`).remove();
    taskService.deleteTaskById(id);
    return;
  } else if (action === "toggleDone") {
    const task = taskService.getTaskById(id);
    taskService.editTaskById(id, task.text, !task.done);
    console.log(tasks);
  }
  renderTasks();
}

function renderTasks() {
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "tache";
    li.id = `li-${task.id}`;
    li.innerHTML = `
      <div class="name-tache" id="name-tache-${task.id}">
        ${renderTaskContent(task.id, task.text, task.done)}
      </div>
      <div class="emojis">
        <div class="trash" id="trash-${task.id}">
          <img src="./img/trash.svg"/>
        </div>
        <div class="edit" id="edit-${task.id}">
          <img src="./img/edit.svg"/>
        </div>
      </div>
    `;
    list.appendChild(li);
    li.querySelector(`#span-${task.id}`).addEventListener("click", () =>
      handleTaskAction(task.id, "toggleDone")
    );
    li.querySelector(`#edit-${task.id}`).addEventListener("click", () =>
      handleTaskAction(task.id, "edit")
    );
    li.querySelector(`#trash-${task.id}`).addEventListener("click", () =>
      handleTaskAction(task.id, "remove")
    );
  });
}

function renderTaskContent(id, text, done) {
  return `<span id = span-${id} class="todo ${
    done ? "done" : ""
  }"></span><h1 class="${done ? "done" : ""}">${text}</h1>`;
}

form.onsubmit = (e) => {
  e.preventDefault();
  handleTaskAction(
    { id: `task-${tasks.length + 1}`, text: input.value, done: false },
    "create"
  );
  input.value = "";
};
