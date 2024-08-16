import TasksService from "./tasks.service.js";
const tasks = [];
const taskService = TasksService(tasks);

const list = document.querySelector(".list");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

function handleTaskAction(id, action) {
  if (action === "create") {
    taskService.addTaskById(id);
    renderTask(taskService.getTaskById(id.id));
  } else if (action === "edit") {
    const task = taskService.getTaskById(id);
    const inputEl = document.getElementById(`input-${id}`);
    if (inputEl) {
      const newText = inputEl.value.trim();
      if (newText) {
        taskService.editTaskById(id, newText, task.done);
        document.getElementById(`name-tache-${id}`).innerHTML =
          renderTaskContent(id, newText, task.done);
        reattachEventListeners(id);
      }
    } else {
      document.getElementById(
        `name-tache-${id}`
      ).innerHTML = `<input id="input-${id}" value="${task.text}">`;
    }
  } else if (action === "remove") {
    document.getElementById(`li-${id}`).remove();
    taskService.deleteTaskById(id);
  } else if (action === "toggleDone") {
    const task = taskService.getTaskById(id);
    taskService.editTaskById(id, task.text, !task.done);
    document.getElementById(`name-tache-${id}`).innerHTML = renderTaskContent(
      id,
      task.text,
      !task.done
    );
    reattachEventListeners(id);
  }
}

function renderTask(task) {
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
}

function renderTasks() {
  list.innerHTML = "";
  tasks.forEach(renderTask);
}

function renderTaskContent(id, text, done) {
  return `<span id="span-${id}" class="todo ${
    done ? "done" : ""
  }"></span><h1 class="${done ? "done" : ""}">${text}</h1>`;
}

function reattachEventListeners(id) {
  document
    .querySelector(`#span-${id}`)
    .addEventListener("click", () => handleTaskAction(id, "toggleDone"));
}

form.onsubmit = (e) => {
  e.preventDefault();
  const taskId = `task-${Date.now()}`;
  handleTaskAction({ id: taskId, text: input.value, done: false }, "create");
  input.value = "";
};

renderTasks();
