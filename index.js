import TasksService from "./tasks.service.js";

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskService = TasksService(tasks);

const list = document.querySelector(".list");

let selectedColor = "";

const themeToggle = document.getElementById("checkbox");

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

document.body.style.display = "block";

themeToggle.addEventListener("change", (e) => {
  const theme = e.target.checked ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
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
  setDoneCount();
}

function edit(id) {
  openModal("editTask", id);
}

function remove(id) {
  document.getElementById(`li-${id}`).remove();
  taskService.deleteTaskById(id);

  setDoneCount();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleDone(id) {
  const task = taskService.getTaskById(id);
  const newDoneStatus = !task.done;
  taskService.editTaskById(
    id,
    task.text,
    task.color,
    task.deadline,
    newDoneStatus
  );
  const editedTask = taskService.getTaskById(id);
  document.getElementById(`name-tache-${id}`).innerHTML = renderTaskContent(
    id,
    editedTask.text,
    editedTask.deadline,
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
  const numberDiv = document.querySelector(".number");

  numberDiv.innerHTML = `<p>${doneCount}/${tasks.length}</p>`;
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
  const isLightTheme = savedTheme === "light";
  themeToggle.checked = isLightTheme;

  renderTasks();
  setDoneCount();

  const taskInput = document.getElementById("addTask");

  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      openModal("addTask");
    }
  });
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
    document.getElementById("modal-title").textContent = `Modifier la tache`;
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

  if (description.value != "" && deadline.value != "") {
    if (selectedColor == "") {
      selectedColor = "color-default";
    }
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
    const elementColor = document.getElementById(selectedColor);
    if (elementColor) {
      elementColor.classList.remove("selected-color");
    }
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

  reattachEventListeners(id);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  const listItem = document.getElementById(`li-${editedTask.id}`);
  listItem.className = `tache ${selectedColor}`;

  closeModal();
}
