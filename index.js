import TasksService from "./tasks.service.js";
const tasks = [];

const taskService = TasksService(tasks);

const list = document.querySelector(".list");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

function createtaskItem() {
  for (let index = 0; index < tasks.length; index++) {
    const exsitingLi = document.getElementById(`li-${tasks[index].id}`);
    if (exsitingLi) {
      
      continue;
    }
    const li = document.createElement("li");
    li.classList.add("tache");
    li.id = `li-${tasks[index].id}`;
    const task = tasks[index];
    const model = `
    <div class="name-tache" id=name-tache-${task.id}>
      <span class="todo ${task.done ? "done" : "done"}"></span>
      <h1 class="todo done">${task.text}</h1>
    </div>
    <div class="emojis">
      <div class="trash" id=trash-${task.id}>
        <img src="./img/trash.svg"/>
      </div>
      <div class="edit" id=edit-${task.id}>
        <img src="./img/edit.svg"/>
      </div>
    </div>
  `;
    li.innerHTML = model;
    list.appendChild(li);
    li.querySelector(`#edit-${task.id}`).addEventListener("click", (event) =>
      handleEditTask(event, task.id)
    );
    li.querySelector(`#trash-${task.id}`).addEventListener("click", (event) =>
      handleRemoveTask(event, task.id)
    );
  }
}

function editTaskItem(event, id) {
  event.stopPropagation();
  const input = document.getElementById(`input-${id}`);

  if (input === null) {
    console.log("edit")
    editItem(event, id);
  } else {
    console.log("save")
    saveItem(event, id);
  }
}

//cibler le name tache
//suprimer le contenue
//ajouter un input

function editItem(event, id) {
  const div = document.getElementById(`name-tache-${id}`);
  div.innerHTML = "";
  const input = document.createElement("input");
  const task = taskService.getTaskById(id);
  input.value = task.text;
  input.id = `input-${id}`;
  div.appendChild(input);
}

function saveItem(event, id) {
  event.stopPropagation();

  const input = document.getElementById(`input-${id}`);
  const newText = input.value.trim();

  if (newText) {
    taskService.editTaskById(id, newText, taskService.getTaskById(id).done);
    document.getElementById(`li-${id}`).remove();
    createtaskItem()
  }

}

function handleCreateTask(task) {
  taskService.addTaskById(task);
  createtaskItem();
}

function handleEditTask(event, id) {
  editTaskItem(event, id);
}

//removeTask
function removeTaskItem(event, id) {
  event.stopPropagation();
  console.log(id)
  document.getElementById(`li-${id}`).remove();
}

function handleRemoveTask(event, id) {
  removeTaskItem(event, id);
  taskService.deleteTaskById(id);
  console.log(tasks);
}

form.onsubmit = (e) => {
  e.preventDefault();
  const value = input.value;
  handleCreateTask({
    id: `task-${tasks.length + 1}`,
    text: value,
    done: false,
  });
  input.value = "";
  console.log(tasks);
};
