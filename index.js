import TasksService from "./tasks.service.js";
const tasks = [
  { id: `task-1`, text: `Faire les courses`, done: false },
  { id: `task-2`, text: `Faire le ménage`, done: false },
  { id: `task-3`, text: `Faire la vaisselle`, done: false },
];

const taskService = TasksService(tasks);

const list = document.querySelector(".list");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

for (let index = 0; index < tasks.length; index++) {
  const li = document.createElement("li");
  li.classList.add("tache");
  const task = tasks[index];
  const model = `
    <div class="name-tache">
      <span class="todo ${task.done ? "done" : "done"}"></span>
      <h1 class="todo done">${task.text}</h1>
      </div>
      <div class="emojis">
        <div class="trash">
          <img src="./img/trash.svg"/>
        </div>
        <div class="edit">
          <img src="./img/edit.svg"/>
        </div>
    </div>
  `;
  li.innerHTML = model;
  list.appendChild(li);
}

form.onsubmit = (e) => {
  e.preventDefault();
  const value = input.value;
  taskService.addTaskById({
    id: `task-${tasks.length + 1}`,
    text: value,
    done: false,
  });
  input.value = "";
  console.log(tasks);
};
