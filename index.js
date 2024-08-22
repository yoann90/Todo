import TasksService from "./tasks.service.js";

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskService = TasksService(tasks);

const list = document.querySelector(".list");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

const themeToggle = document.getElementById("checkbox");
const currentTheme = localStorage.getItem("theme") || "dark";

if (currentTheme === "light") {
  document.body.classList.add("light-theme");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("light-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light-theme");
    localStorage.setItem("theme", "dark");
  }
});

function handleTaskAction(id, action) {
  if (action === "create") {
    create(id);
  } else if (action === "edit") {
    edit(id);
  } else if (action === "remove") {
    remove(id);
  } else if (action === "toggleDone") {
    toggleDone(id);
  }
}

function create(id) {
  taskService.addTaskById(id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTask(taskService.getTaskById(id.id));
}

function edit(id) {
  const task = taskService.getTaskById(id);
  const inputEl = document.getElementById(`textarea-${id}`);

  if (inputEl) {
    const newText = inputEl.value.trim();
    if (newText) {
      taskService.editTaskById(id, newText, task.done);
      document.getElementById(`name-tache-${id}`).innerHTML = renderTaskContent(
        id,
        newText,
        task.done
      );
      reattachEventListeners(id);

      const trash = document.getElementById(`trash-${id}`);
      trash.style.pointerEvents = "auto";
      trash.style.opacity = "1";

      const span = document.getElementById(`span-${id}`);
      span.style.pointerEvents = "auto";
      span.style.opacity = "1";
    }
  } else {
    const trash = document.getElementById(`trash-${id}`);
    trash.style.pointerEvents = "none";
    trash.style.opacity = "0.5";

    const span = document.getElementById(`span-${id}`);
    span.style.pointerEvents = "none";
    span.style.opacity = "0.5";

    const textarea = document.createElement("textarea");

    textarea.id = `textarea-${id}`;
    textarea.value = task.text;
    textarea.classList.add("textarea-modif");

    textarea.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        handleTaskAction(id, "edit");
      }
    });

    let shouldHandleBlur = true;
    const listItem = document.getElementById(`li-${id}`);

    // Écouteur pour détecter un clic sur le document
    document.addEventListener("mousedown", function (event) {
      // Si le clic est à l'intérieur du <li> "card", on empêche l'action sur blur
      if (listItem.contains(event.target)) {
        shouldHandleBlur = false;
      } else {
        shouldHandleBlur = true;
      }
    });

    textarea.addEventListener("blur", function (event) {
      // Si le clic s'est produit en dehors de la "card", exécuter l'action
      if (shouldHandleBlur) {
        handleTaskAction(id, "edit");
      } else {
        textarea.focus();
      }
    });

    const nameTache = document.getElementById(`content-${id}`);
    const h1Element = nameTache.querySelector("h1");
    h1Element.remove();
    nameTache.appendChild(textarea);
    textarea.focus();

    const editButton = document.getElementById(`edit-${id}`);
    editButton.addEventListener("mousedown", function (event) {
      event.preventDefault();
    });
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function remove(id) {
  document.getElementById(`li-${id}`).remove();
  taskService.deleteTaskById(id);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  setDoneCount();
}

function toggleDone(id) {
  const task = taskService.getTaskById(id);
  const newDoneStatus = !task.done;
  taskService.editTaskById(id, task.text, newDoneStatus);
  document.getElementById(`name-tache-${id}`).innerHTML = renderTaskContent(
    id,
    task.text,
    newDoneStatus
  );
  reattachEventListeners(id);
  setDoneCount();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getDoneCount() {
  return tasks.filter((task) => task.done).length;
}

function setDoneCount() {
  const doneCount = getDoneCount();
  const totalCount = tasks.length;
  const numberDiv = document.querySelector(".number");

  numberDiv.innerHTML = `<p>${doneCount}/${totalCount}</p>`;
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
      <div class="edit" id="edit-${task.id}">
        <img src="./img/edit.svg"/>
      </div>
      <div class="trash" id="trash-${task.id}">
        <img src="./img/trash.svg"/>
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
  return `<div class="clock">
            <img src="./img/clock.svg"/>
            <span class="date">19 Aug 2024</span>
          </div>
          <div class = "content" id = "content-${id}">
            <span id="span-${id}" class="todo ${done ? "done" : ""}"></span>
            <h1 class="${done ? "done" : ""}">${text}</h1>
          </div>`;
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

  setDoneCount();
  input.value = "";
};

document.addEventListener("DOMContentLoaded", () => {
  setDoneCount();
  renderTasks();
});
