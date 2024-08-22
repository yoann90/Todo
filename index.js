import TasksService from "./tasks.service.js";

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskService = TasksService(tasks);

const list = document.querySelector(".list");

let selectedColor = "";

let taskCount = 0;

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
  openModal("editTask", id);
}

function remove(id) {
  document.getElementById(`li-${id}`).remove();
  taskService.deleteTaskById(id);

  taskCount -= 1;
  setDoneCount();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleDone(id) {
  const task = taskService.getTaskById(id);
  const newDoneStatus = !task.done;
  taskService.editTaskById(id, task.text, newDoneStatus);
  document.getElementById(`name-tache-${id}`).innerHTML = renderTaskContent(
    id,
    task.text,
    task.deadline,
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
  const totalCount = taskCount;
  const numberDiv = document.querySelector(".number");

  numberDiv.innerHTML = `<p>${doneCount}/${totalCount}</p>`;
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "tache";
  li.id = `li-${task.id}`;
  li.classList.add(task.color);
  li.innerHTML = `
    <div class="name-tache" id="name-tache-${task.id}">
      ${renderTaskContent(task.id, task.text, task.deadline, task.done)}
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

function renderTaskContent(id, text, deadline, done) {
  const date = new Date(deadline);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const dateFormated = date
    .toLocaleDateString("fr-FR", options)
    .replace(".", "");

  return `<div class="clock">
            <img src="./img/clock.svg"/>
            <span class="date">${dateFormated}</span>
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

document.addEventListener("DOMContentLoaded", () => {
  setDoneCount();
  renderTasks();
});

window.openModal = function (action, id) {
  let description = "";
  const validButton = document.getElementById("modal-valid-button");

  validButton.onclick = null;

  if (action === "addTask") {
    description = document.getElementById("addTask").value;
    document.getElementById("modal-title").textContent = "Ajouter une tache";
    document.getElementById("modal-input-date").value = "";
    validButton.onclick = function () {
      validateForm("create");
    };
  } else {
    const task = taskService.getTaskById(id);
    document.getElementById("modal-input-date").value = task.deadline;
    document.getElementById(task.color).classList.add("selected-color");
    document.getElementById(
      "modal-title"
    ).textContent = `Modifier la tache ${task.text}`;
    description = task.text;
    selectedColor = task.color;
    validButton.onclick = function () {
      editForm(id);
    };
  }

  document.getElementById("modal-textarea").value = description;
  const modalOverlay = document.querySelector(".modal-overlay");
  modalOverlay.style.display = "flex";
};

window.closeModal = function () {
  const modalOverlay = document.querySelector(".modal-overlay");
  document.getElementById("addTask").value = "";
  document.getElementById("alert-modal").style.display = "none";
  modalOverlay.style.display = "none";
  selectedColor = "";
  const elements = document.querySelectorAll(".selected-color");
  elements.forEach((element) => {
    element.classList.remove("selected-color");
  });
};

window.setSelectedColor = function (id) {
  selectedColor = id;

  const elements = document.querySelectorAll(".selected-color");

  const selected = document
    .getElementById(id)
    .classList.contains("selected-color");

  if (selected) {
    document.getElementById(id).classList.remove("selected-color");
    selectedColor = "";
  } else {
    document.getElementById(id).classList.add("selected-color");
  }

  elements.forEach((element) => {
    element.classList.remove("selected-color");
  });
};

window.validateForm = function (action) {
  const description = document.getElementById("modal-textarea");
  const deadline = document.getElementById("modal-input-date");

  if (description.value != "" && deadline.value != "" && selectedColor != "") {
    const taskId = `task-${Date.now()}`;
    handleTaskAction(
      {
        id: taskId,
        text: description.value,
        color: selectedColor,
        deadline: deadline.value,
        done: false,
      },
      "create"
    );
    document.getElementById("addTask").value = "";
    document.getElementById(selectedColor).classList.remove("selected-color");
    selectedColor = "";
    deadline.value = "";
    closeModal();
  } else {
    document.getElementById("alert-modal").style.display = "block";
  }
};

function editForm(id) {
  const description = document.getElementById("modal-textarea");
  const deadline = document.getElementById("modal-input-date");

  const task = taskService.getTaskById(id);

  taskService.editTaskById(
    id,
    description.value,
    selectedColor,
    deadline.value,
    task.done
  );

  const editedTask = taskService.getTaskById(id);

  document.getElementById(`name-tache-${id}`).innerHTML = renderTaskContent(
    editedTask.id,
    editedTask.text,
    editedTask.deadline,
    editedTask.done
  );

  const listItem = document.getElementById(`li-${editedTask.id}`);
  listItem.className = `tache ${selectedColor}`;

  closeModal();
}
